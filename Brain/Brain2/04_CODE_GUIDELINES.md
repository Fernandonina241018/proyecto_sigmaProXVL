# 04 — Lineamientos de código

## Entorno

- ES6+ directo en navegador · sin transpiler/bundler
- Módulos vía `window.*` + `module.exports` condicional
- Sin deps externas salvo aprobación explícita
- Scripts en `index.html` con `<script>`

## Nomenclatura

```js
calcularNombreTest(datos, opciones = {})  // cálculo
detectarOutliers(datos, ...)              // detección
const mediaAritmetica = ...               // camelCase
const ESTADISTICOS_CONFIG = {...}         // config global
return { error: '...', codigo: 'MIN_MUESTRA' }
```

## Plantilla `calcular*`

```js
function calcularXxx(datos, opciones = {}) {
    const n = datos.length;
    if (n < config.minMuestra)
        return { error: `Mínimo ${config.minMuestra}`, codigo: 'MIN_MUESTRA' };

    const limpios = datos.filter(x => x != null && !isNaN(x));
    const advertencias = [];
    if (limpios.length < n)
        advertencias.push(`Eliminados ${n - limpios.length} inválidos`);

    // cálculo — no redondear intermedios
    const resultado = ...;
    if (!Number.isFinite(resultado))
        return { error: 'No finito', codigo: 'CALC_ERROR' };

    return {
        /* claves = config.salidas[] */
        n: limpios.length,
        advertencias: advertencias.length ? advertencias : undefined
    };
}
```

## Arrays

```js
const ordenados = [...datos].sort((a, b) => a - b);  // ✅
datos.sort(...);  // ❌ muta entrada
```

## Matemáticas

- `Number.isFinite()` en resultados
- Redondear solo al retorno: `parseFloat(x.toFixed(6))`
- Kahan opcional en sumas grandes

## XSS (crítico)

```js
el.textContent = valor;  // ✅ usuario, resultados, config.desc

el.innerHTML = `...${valor}...`;  // ❌

// HTML estructurado: createElement + textContent
// Si innerHTML inevitable:
function sanitizar(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;')
        .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
```

**Prohibido:** `eval`, `new Function`, `setTimeout(string)`, `document.write`.

Hallazgos pendientes en reportes: `PLAN_SEGURIDAD.md`.

## Patrón config-driven

```js
const config = getEstadisticoConfig(nombre);
if (!config) return { error: 'Test no encontrado' };
if (datos.length < config.minMuestra) return { error: '...', codigo: 'MIN_MUESTRA' };
const fn = window.EstadisticaDescriptiva[config.calcular];
if (typeof fn !== 'function') return { error: 'No implementado' };
return fn(datos, opciones);
```

## CSS

- BEM simplificado: `.stat-card`, `.stat-card__title`, `.stat-card--active`
- Estados: `.is-loading`, `.is-disabled`, `.has-error`
- Tokens en `:root` (`--color-primario`, `--espacio-base`, …)

## Checklist pre-entrega

- [ ] `minMuestra` / `maxMuestra`
- [ ] Sin `innerHTML` sin sanitizar
- [ ] Sin mutar `datos`
- [ ] Claves = `config.salidas[]` + `n`
- [ ] Errores `{ error, codigo }`
- [ ] Fórmulas con referencia en comentario

## Errores frecuentes

| Error | Fix |
|-------|-----|
| innerHTML + variable | textContent |
| `datos.sort()` | `[...datos].sort()` |
| Sin minMuestra | `{ error, codigo }` |
| Claves distintas a config | Alinear salidas |
| NaN propagado | `Number.isFinite()` |

Políticas bloqueantes: `06_POLICIES.md`.
