# 04 — Lineamientos de Código

## Stack y entorno

- **Lenguaje:** JavaScript ES6+ (sin transpilación — compatible con navegadores modernos directamente)
- **Módulos:** No ES modules (`import/export`). Todo vía `window.*` y `module.exports` condicional.
- **Sin bundler** (no Webpack, Vite, etc.). Scripts cargados con `<script>` en `index.html`.
- **Sin librerías externas** salvo que se apruebe explícitamente.

---

## JavaScript — Convenciones

### Nomenclatura

```js
// Funciones de cálculo estadístico
calcularNombreDelTest()   // camelCase, prefijo 'calcular'
detectarNombreDelTest()   // para detección (outliers, etc.)

// Variables locales
const mediaAritmetica = ...   // camelCase descriptivo
let sumaRangos = ...

// Constantes de config
const ESTADISTICOS_CONFIG = {...}   // SCREAMING_SNAKE para objetos config globales
const MIN_MUESTRA_DEFAULT = 2

// Parámetros de funciones
function calcularMedia(datos, opciones = {}) { ... }
//                     ^^^^^ siempre 'datos' para el array principal

// Retorno de error
return { error: 'Mensaje descriptivo', codigo: 'CODIGO_ERROR' }
```

### Estructura de una función de cálculo

```js
function calcularNombreTest(datos, opciones = {}) {
    // 1. Validación de entrada
    const n = datos.length;
    if (n < CONFIG_MIN_MUESTRA) {
        return { error: `Se requieren al menos ${CONFIG_MIN_MUESTRA} observaciones`, codigo: 'MIN_MUESTRA' };
    }

    // 2. Filtrar NaN/null y advertir
    const datosLimpios = datos.filter(x => x !== null && !isNaN(x));
    const advertencias = [];
    if (datosLimpios.length < n) {
        advertencias.push(`Se eliminaron ${n - datosLimpios.length} valores inválidos`);
    }

    // 3. Cálculo
    const resultado = ...;

    // 4. Retorno estructurado (claves = config.salidas[])
    return {
        nombreSalida1: valor1,
        nombreSalida2: valor2,
        n: datosLimpios.length,
        advertencias: advertencias.length > 0 ? advertencias : undefined
    };
}
```

### Operaciones matemáticas

```js
// ✅ Usar Number.isFinite() para validar resultados
if (!Number.isFinite(resultado)) return { error: 'Resultado no finito', codigo: 'CALC_ERROR' };

// ✅ Evitar acumulación de errores de punto flotante en sumas
// Usar algoritmo de Kahan para sumas grandes si es necesario

// ✅ Redondear solo en el retorno, nunca en cálculos intermedios
return { media: parseFloat(media.toFixed(6)) };

// ❌ Nunca usar Math.round() en resultados estadísticos intermedios
```

### Manejo de arrays

```js
// ✅ Preferir métodos funcionales
const media = datos.reduce((acc, x) => acc + x, 0) / n;
const ordenados = [...datos].sort((a, b) => a - b);  // spread para no mutar

// ❌ No mutar el array de entrada
datos.sort(...)  // PROHIBIDO — muta el original

// ✅ Para operaciones que requieren índice explícito
for (let i = 0; i < n; i++) { ... }  // OK en hot paths
```

---

## JavaScript — Seguridad

### XSS — Regla crítica

```js
// ❌ PROHIBIDO — cualquier valor de usuario en innerHTML directamente
elemento.innerHTML = `<span>${valorDelUsuario}</span>`;
elemento.innerHTML = config.desc;  // aunque venga del config interno
elemento.innerHTML = resultado.media;  // aunque sea numérico

// ✅ OBLIGATORIO para texto
elemento.textContent = valorDelUsuario;
elemento.textContent = resultado.media;

// ✅ Si se necesita HTML estructurado, crear elementos del DOM
const span = document.createElement('span');
span.textContent = valor;
contenedor.appendChild(span);

// ✅ Si innerHTML es absolutamente necesario, sanitizar
function sanitizar(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
elemento.innerHTML = `<span>${sanitizar(valor)}</span>`;
```

### Otras reglas de seguridad

```js
// ❌ PROHIBIDO
eval(...)
new Function(...)
setTimeout('string de código', ...)
```

---

## JavaScript — Patrones del proyecto

### Patrón de config centralizada

```js
// El config DESCRIBE, no IMPLEMENTA
// Toda lógica de validación USA el config, no lo duplica

function ejecutarCalculo(nombreTest, datos) {
    const config = getEstadisticoConfig(nombreTest);
    if (!config) return { error: 'Test no encontrado' };

    if (datos.length < config.minMuestra) {
        return { error: `Mínimo ${config.minMuestra} observaciones` };
    }

    // Llamar la función dinámica
    const fn = window.EstadisticaDescriptiva[config.calcular];
    if (typeof fn !== 'function') return { error: 'Función no implementada' };

    return fn(datos);
}
```

### Patrón de retorno consistente

```js
// Todas las funciones retornan un objeto plano
// Las claves DEBEN coincidir con config.salidas[]
// Siempre incluir 'n'

return {
    // Claves de config.salidas[]
    media: ...,
    n: ...,
    suma: ...,
    // Opcionales
    advertencias: [...],  // array de strings o undefined
    metadata: { ... }     // info extra para debug, no para el UI
};
```

---

## CSS — Convenciones

### Nomenclatura de clases

```css
/* BEM-like — pero simplificado */
.stat-card { }           /* bloque */
.stat-card__title { }   /* elemento */
.stat-card--active { }  /* modificador */

/* Estados */
.is-loading { }
.is-disabled { }
.has-error { }

/* ❌ Evitar */
.rojo { }
.style1 { }
```

### Variables CSS

```css
:root {
    /* Definir AQUÍ todas las constantes visuales */
    --color-primario: #2563eb;
    --color-error: #dc2626;
    --espacio-base: 8px;
    --radio-borde: 4px;
}
```

---

## Control de calidad antes de entregar un archivo

Checklist mental antes de generar código:

- [ ] ¿Todas las funciones validan `minMuestra` (y `maxMuestra` si aplica)?
- [ ] ¿No hay `innerHTML` con valores no sanitizados?
- [ ] ¿Los arrays de entrada no se mutan?
- [ ] ¿Los retornos tienen las claves exactas de `config.salidas[]`?
- [ ] ¿Los errores retornan `{ error, codigo }` y no lanzan excepciones?
- [ ] ¿Las fórmulas matemáticas están comentadas con su referencia?
- [ ] ¿Se usa `textContent` en lugar de `innerHTML` donde aplica?

---

## Para el Agente: Errores comunes a evitar

| Error | Consecuencia | Solución |
|-------|--------------|----------|
| Usar `innerHTML` con variables | XSS | Usar `textContent` |
| Mutar `datos.sort()` | Datos corruptos | Usar `[...datos].sort()` |
| No validar `minMuestra` | Error matemático | Retornar `{ error }` |
| Retornar claves wrong | UI fallando | Coincidir con `config.salidas[]` |
| No usar `Number.isFinite()` | NaN propagado | Validar resultados |
