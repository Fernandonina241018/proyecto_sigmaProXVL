# Plan: Sistema de Umbrales para Desviación Estándar y Varianza

## Objetivo

Agregar un sistema de semáforo (verde/amarillo/rojo) para indicar si la Desviación Estándar y la Varianza están dentro de parámetros aceptables, basadas en umbrales fijos:

| Métrica | Verde (<) | Amarillo (≥ y <) | Rojo (≥) |
|---------|-----------|------------------|----------|
| **Desviación Estándar** | 2 | 4 | 4 |
| **Varianza** | 4 | 16 | 16 |

---

## Ubicación del Semáforo

El semáforo se mostrará en las **tarjetas KPI** de la vista de resultados de análisis:

```
┌─────────────────────────────────────────────────────────────┐
│  VISTA DE ANÁLISIS - RESULTADOS                            │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │ Desviación Estándar │  │ Varianza         │               │
│  │ ┌──────────────┐  │  │ ┌──────────────┐  │               │
│  │ │   1.52      │  │  │ │   2.31       │  │               │
│  │ │  ✓ Dentro de │  │  │ │  ⚠️ Alerta   │  │  ← SEMÁFORO  │
│  │ │    parámetros│  │  │ │              │  │               │
│  │ └──────────────┘  │  │ └──────────────┘  │               │
│  └──────────────────┘  └──────────────────┘               │
└─────────────────────────────────────────────────────────────┘
```

Contenedor: `#analisis-resultados-container`

---

## Archivos a Modificar

| # | Archivo | Cambios | Líneas aproximadas |
|---|--------|---------|-------------------|
| 1 | `ParametrosManager.js` | +25 líneas (nuevos métodos para umbrales DE y Varianza) | ~30-60 |
| 2 | `EstadisticaDescriptiva.js` | +35 líneas (lógica de evaluación de umbrales) | ~3645-3680 |
| 3 | `analisis-dashboard.css` | +8 líneas (estilos para estado warn) | ~253-260 |

---

## Paso 1: Agregar Métodos en ParametrosManager.js

### Código a Agregar (después de línea 36):

```javascript
// ── Umbrales para Desviación Estándar ──────────────────────
function setUmbralDE(col, alerta, critico) {
    if (!_state.umbralesDE) _state.umbralesDE = {};
    _state.umbralesDE[col] = { alerta: parseFloat(alerta), critico: parseFloat(critico) };
    _persist();
}

function getUmbralDE(col) {
    const g = _state.umbralesDE?.global || { alerta: 2, critico: 4 };
    const c = (_state.umbralesDE?.columns || {})[col] || null;
    return c || g;
}

// ── Umbrales para Varianza ─────────────────────────────────
function setUmbralVarianza(col, alerta, critico) {
    if (!_state.umbralesVarianza) _state.umbralesVarianza = {};
    _state.umbralesVarianza[col] = { alerta: parseFloat(alerta), critico: parseFloat(critico) };
    _persist();
}

function getUmbralVarianza(col) {
    const g = _state.umbralesVarianza?.global || { alerta: 4, critico: 16 };
    const c = (_state.umbralesVarianza?.columns || {})[col] || null;
    return c || g;
}
```

### Actualizar return (línea ~106):

```javascript
return { 
    setGlobal, setColumna, 
    getParametros, getRawState, 
    verificarColumna, reset, reload,
    setUmbralDE, getUmbralDE,      // ← NUEVOS
    setUmbralVarianza, getUmbralVarianza  // ← NUEVOS
};
```

---

## Paso 2: Modificar función kpiCards() en EstadisticaDescriptiva.js

### Ubicación: Líneas ~3636-3652

### Código a Reemplazar (líneas 3636-3652):

```javascript
// Verificar cumplimiento de parámetros
let compliance = null;
if (hasParams) {
    const p      = ParametrosManager.getParametros(col);
    const numVal = typeof val === 'number' ? val : null;
    if (numVal !== null && (p.min !== null || p.max !== null)) {
        const out = (p.min !== null && numVal < p.min) ||
                    (p.max !== null && numVal > p.max);
        compliance = !out;
    }
}
```

### Código Nuevo (agregar después del bloque anterior):

```javascript
// Verificar umbrales de dispersión para Desviación Estándar
let dispersionStatus = null;
if (statKey === 'Desviación Estándar' && typeof val === 'number') {
    const umbral = ParametrosManager.getUmbralDE(col);
    if (umbral && umbral.alerta && umbral.critico) {
        if (val < umbral.alerta) {
            dispersionStatus = 'ok';
        } else if (val < umbral.critico) {
            dispersionStatus = 'warn';
        } else {
            dispersionStatus = 'danger';
        }
    }
}

// Verificar umbrales de dispersión para Varianza
if (statKey === 'Varianza' && typeof val === 'number') {
    const umbral = ParametrosManager.getUmbralVarianza(col);
    if (umbral && umbral.alerta && umbral.critico) {
        if (val < umbral.alerta) {
            dispersionStatus = 'ok';
        } else if (val < umbral.critico) {
            dispersionStatus = 'warn';
        } else {
            dispersionStatus = 'danger';
        }
    }
}

// Combinar con verificación de parámetros existente
const statusClass = dispersionStatus 
    ? `ar-kpi-${dispersionStatus}` 
    : (compliance === true ? 'ar-kpi-ok' : compliance === false ? 'ar-kpi-danger' : '');

const badgeHTML = dispersionStatus !== null
    ? `<div class="ar-kpi-badge ar-badge-${dispersionStatus}">
        ${dispersionStatus === 'ok' ? '✓ Dentro de parámetros' : 
          dispersionStatus === 'warn' ? '⚠️ Alerta' : '✗ Fuera de parámetros'}
      </div>`
    : (compliance !== null 
        ? `<div class="ar-kpi-badge ${compliance ? 'ar-badge-ok' : 'ar-badge-danger'}">
            ${compliance ? '✓ Dentro de parámetros' : '✗ Fuera de parámetros'}
          </div>` 
        : '');
```

---

## Paso 3: Agregar Estilos CSS en analisis-dashboard.css

### Ubicación: Después de línea 254

### Código a Agregar:

```css
/* Estado de alerta para semáforo de dispersión */
.ar-kpi-card.ar-kpi-warn     { border-color: #f6e05e; background: #fffff0; }
.ar-kpi-card.ar-kpi-warn    .ar-kpi-val { color: #b7791f; }
```

---

## Verificación de Funcionamiento

### Flujo Esperado:

1. **Usuario ejecuta análisis** → Se calculan Desviación Estándar y Varianza por columna
2. **kpiCards() genera HTML** → Detecta que es Desviación Estándar o Varianza
3. **evalúa umbrales** → Compara valor contra umbrales configurados
4. **aplica clase CSS** → Asigna `.ar-kpi-ok`, `.ar-kpi-warn` o `.ar-kpi-danger`
5. **muestra badge** → Muestra "✓ Dentro de parámetros", "⚠️ Alerta" o "✗ Fuera de parámetros"

### Valores de Prueba:

| Valor DE | Color Esperado | Badge |
|----------|---------------|-------|
| 1.5 | Verde | ✓ Dentro de parámetros |
| 2.5 | Amarillo | ⚠️ Alerta |
| 5.0 | Rojo | ✗ Fuera de parámetros |

---

## Notas Adicionales

1. **Valores por defecto**: Los umbrales por defecto son:
   - DE: alerta=2, critico=4
   - Varianza: alerta=4, critico=16

2. **Persistentes**: Los umbrales se guardan en sessionStorage

3. **Extensible**: El sistema puede extenderse a otros estadísticos (CV, etc.)

4. **Reportes**: El semáforo también aparecerá en los reportes HTML generados

---

## Orden de Implementación Recomendada

1. ✅ `ParametrosManager.js` - Agregar métodos de umbrales
2. ✅ `analisis-dashboard.css` - Agregar estilos warn
3. ✅ `EstadisticaDescriptiva.js` - Agregar lógica de evaluación
4. 🔍 **Prueba** - Verificar en navegador
5. 📝 **Documentar** - Actualizar ESTADO_PROYECTO.md

---

*Documento creado: Abril 2026*
*Proyecto: StatAnalyzer Pro (SigmaProXVL)*
