# Guía — nuevo estadístico

> Checklist operativo. Contratos: `02_ESTADISTICOS.md` · Código: `04_CODE_GUIDELINES.md` · Políticas: `06_POLICIES.md`

## Archivos tocados (orden)

| # | Archivo | Acción |
|---|---------|--------|
| 1 | `estadisticosConfig.js` | Entrada en `ESTADISTICOS_CONFIG` |
| 2 | `EstadisticaDescriptiva.js` | `calcular*` + export IIFE |
| 3 | `EstadisticaDescriptiva.js` | `case` en `ejecutarAnalisis()` |
| 4 | `EstadisticaDescriptiva.js` | Plantilla en `generarHTML()` |
| 5 | `ReporteManager.js` | Caso reporte (si no auto desde config) |
| 6 | `script.js` | Solo si modal/UI especial (PCA, AF, hipótesis) |
| 7 | `index.html` | Solo si sidebar no viene de `getSeccionesSidebar()` |
| 8 | `02_ESTADISTICOS.md` | Marcar ✅ |

**Nota:** Sidebar y metadatos suelen resolverse solo con config. `ReporteManager` ya consume `estadisticosConfig` para fórmula/desc.

## 1. Config (`estadisticosConfig.js`)

```js
'Nombre Exacto del Test': {
    seccion: 'descriptiva',           // key sección
    calcular: 'calcularNombreTest',   // = nombre función
    formula: '...',
    desc: '...',
    icono: '📊',
    minMuestra: 3,
    salidas: ['clave1', 'clave2'],    // CONTRATO retorno
    inputs: { tipo: 'una-columna', grupos: 1 },
    requiereDosColumnas: false,
    // hipótesis opcional:
    tipoTest: { defecto: 'bilateral', opciones: ['unilateral', 'bilateral'] },
    nivelAlfa: 0.05,
    supuestos: ['...'],
    maxMuestra: 5000  // si aplica
}
```

Nombre en config = string en `ejecutarAnalisis()` = selección UI.

## 2. Función (`EstadisticaDescriptiva.js`)

```js
function calcularNombreTest(datos, opciones = {}) {
    const config = getEstadisticoConfig('Nombre Exacto del Test');
    if (datos.length < config.minMuestra)
        return { error: `Mínimo ${config.minMuestra}`, codigo: 'MIN_MUESTRA' };
    const limpios = datos.filter(x => x != null && !isNaN(x));
    // ... cálculo con referencia bibliográfica en comentario ...
    return { clave1, clave2, n: limpios.length };  // claves ∈ salidas[]
}
```

Exportar en el `return` del IIFE del módulo.

## 3. `ejecutarAnalisis()`

```js
case 'Nombre Exacto del Test':
    resultados['Nombre Exacto del Test'][col] = calcularNombreTest(values, opciones);
    break;
```

## 4. `generarHTML()`

- Rama específica o reutilizar plantilla de sección
- Multivariado: no usar solo plantilla `HYPOTHESIS_SET` genérica (ver bug 2026-04-24 en `05`)
- Render: **`textContent`** para valores dinámicos

## 5. UI especial

| Tipo | Extra |
|------|-------|
| 2 columnas | `requiereDosColumnas: true` |
| Hipótesis | Modal + `StateManager.setHypothesisConfig()` |
| PCA / AF | Botones `pca-save` / `af-save`; secuencia multi-select |
| Grupos | Modal grupos en `script.js` |

## 6. Verificación

- [ ] Config completa (`salidas`, `minMuestra`, `formula`)
- [ ] Función exportada y en switch
- [ ] Aparece en sidebar
- [ ] Análisis sin error en consola
- [ ] HTML resultado + reporte HTML/TXT
- [ ] Claves retorno = `salidas[]`
- [ ] Sin mutar `datos`
- [ ] Actualizar `02` y `05` si hubo decisión/bug

## 7. Prueba manual

1. Importar CSV de prueba
2. Seleccionar test → ejecutar
3. `ultimosResultados` en consola
4. Generar reporte
5. Ctrl+Shift+R entre cambios

## Errores típicos al integrar

| Síntoma | Causa |
|---------|-------|
| No en sidebar | Falta config o `seccion` incorrecta |
| "Función no implementada" | `calcular` ≠ nombre función o no exportada |
| UI vacía | Claves retorno ≠ `salidas[]` |
| Reporte genérico | Falta plantilla o set multivariado |
| Multi-select falla | ID botón modal no mapeado en `script.js` |
