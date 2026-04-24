# 📊 Guía para Implementar un Nuevo Estadístico en StatAnalyzer Pro

Este documento describe el proceso completo para agregar un nuevo estadístico al proyecto StatAnalyzer Pro, desde la implementación matemática hasta su inclusión en los reportes generados.

## 📋 Visión General del Flujo

La implementación de un nuevo estadístico sigue un patrón consistente que involucra modificaciones en varios componentes principales:

1. **EstadisticaDescriptiva.js** - Lógica de cálculo
2. **estadisticosConfig.js** - Configuración centralizada de metadatos (fórmulas, descripciones, iconos, etc.)
3. **index.html** - Disponibilidad en la interfaz de usuario
4. **ReporteManager.js** - Inclusión automática en reportes (usa estadisticosConfig.js)

Además, pueden requerirse actualizaciones en:
- script.js (para eventos de UI específicos y lógica de análisis)
- StateManager.js (si se necesita almacenar estado adicional)
- Archivos de estilo CSS (para ajustes de presentación)

## 🔧 Paso a Paso para la Implementación

### Paso 1: Implementar la Función de Cálculo
**Archivo:** `EstadisticaDescriptiva.js`

1. Añade la función de cálculo en la sección apropiada según su naturaleza:
   - Medidas de tendencia central
   - Medidas de forma 
   - Medidas de posición
   - Medidas de error e intervalos
   - Detección de outliers
   - Pruebas de hipótesis

2. Sigue el patrón existente:
   ```javascript
   /**
    * Calcula [Nombre del Estadístico]
    * @param {Array<number>} values - Array de valores numéricos
    * @param {boolean} esMuestral - Indica si es cálculo muestral (true) o poblacional (false)
    * @param {any} [parametrosAdicionales] - Parámetros específicos del estadístico
    * @returns {number|Object} Resultado del cálculo
    */
   function calcularNombreEstadistico(values, esMuestral = true, /* parámetros adicionales */) {
       // Validación de entrada
       if (values.length === 0) return 0; // o valor apropiado según el estadístico
       
       // Implementación del cálculo
       // ...
       
       return resultado;
   }
   ```

### Paso 2: Exponer la Función en el Módulo
**Archivo:** `EstadisticaDescriptiva.js` (sección de retorno del IIFE)

1. Localiza la sección de exportación del módulo (alrededor de la línea 1620)
2. Añade tu función a la lista de funciones expuestas siguiendo la categorización existente:
   ```javascript
   return {
       // ... otras funciones ...
       
       // Funciones individuales - [Categoría apropiada]
       calcularNombreEstadistico,
       
       // ... resto de funciones ...
   };
   ```

### Paso 3: ACTUALIZAR LA CONFIGURACIÓN CENTRALIZADA (ESPECIALMENTE IMPORTANTE)
**Archivo:** `estadisticosConfig.js`

**ESTE PASO ES CRÍTICO** para que el estadístico aparezca correctamente en los reportes con su descripción, fórmula y otros metadatos.

1. Localiza la sección apropiada en el objeto `ESTADISTICOS_CONFIG` (descriptiva, hipótesis, etc.)
2. Añade una entrada para tu estadístico siguiendo el formato exacto:
   ```javascript
   'Nombre del Estadístico': {
       seccion:   'nombre-de-la-sección', // ej: 'descriptiva', 'hipotesis'
       calcular:  'calcularNombreEstadistico', // debe coincidir exactamente con el nombre de la función
       formula:   'fórmula matemática aquí',
       desc:      'Descripción completa de qué mide y su interpretación',
       icono:     '📊', // emoji apropiado para la UI
       minMuestra: 1, // mínimo de observaciones requerido
       
       // Campos adicionales según corresponda:
       requiereDosColumnas: false, // true si necesita 2 columnas (ej: correlación)
       inputs: {
           tipo:        'una-columna' | 'dos-columnas' | 'grupos', // tipo de entrada esperada
           grupos:      1 | 2 | 'variable', // número de grupos/columnas necesarios
       },
       
       // Para pruebas de hipótesis, agregar:
       tipoTest: { 
           defecto: 'bilateral', 
           opciones: ['unilateral', 'bilateral'] 
       },
       nivelAlfa: 0.05,
       
       // Campos extendidos (opcional pero recomendado):
       supuestos: ['condición1', 'condición2'],
       efectoTamano: {
           metrica: 'd de Cohen',
           formula: 'formula aquí',
           umbrales: { pequeno: 0.2, medio: 0.5, grande: 0.8 }
       },
       interpretacion: {
           significativo: 'Texto para cuando es significativo',
           noSignificativo: 'Texto para cuando no es significativo'
       }
   },
   ```
   
   **Nota:** El archivo `estadisticosConfig.js` es la fuente central de metadatos para todos los estadísticos. Si no actualizas esto, tu estadístico **no tendrá descripción, fórmula, icono ni otros metadatos en los reportes ni en la UI**.

### Paso 4: Conectar al Flujo de Análisis
**Archivo:** `EstadisticaDescriptiva.js`

1. Localiza la función `ejecutarAnalisis()` (usualmente alrededor de la línea 900+)
2. En el switch statement, agrega un nuevo case que llame a tu función:
   ```javascript
   case 'Nombre del Estadístico':
       resultados['Nombre del Estadístico'][col] = calcularNombreEstadistico(values);
       break;
   ```
   
   **Importante:** El string en el case debe coincidir exactamente con la clave usada en `estadisticosConfig.js`.

### Paso 5: Agregar Opción al Menú de Usuario
**Archivo:** `index.html`

1. Localiza la sección del navbar donde se listan los estadísticos (usualmente dentro de un `<ul>` o `<div>` con clase relacionada al menú)
2. Añade un nuevo elemento con:
   ```html
   <li><a href="#" data-stat="Nombre del Estadístico">Nombre del Estadístico</a></li>
   ```
   
   **Importante:** El valor del atributo `data-stat` debe coincidir exactamente con:
   - El string usado en el case del Paso 4
   - La clave usada en `estadisticosConfig.js` del Paso 3
   - El nombre que aparecerá en el menú

### Paso 6: Verificar Integración con ReporteManager
**Archivo:** `ReporteManager.js` (verificar, no modificar normalmente)

1. Confirma que el ReporteManager usa `estadisticosConfig.js` para obtener metadatos (esto ya está implementado):
   - Busca llamadas a `estadisticosConfig[stat]` o funciones similares
   - Verifica que procese correctamente los nuevos campos que hayas añadido

## 📄 Plantilla de Implementación Completa

### 1. EstadisticaDescriptiva.js
```javascript
// 1. Implementar la función
function calcularNombreEstadistico(values, esMuestral = true) {
    // Validación
    if (values.length === 0) return null; // o 0 según corresponda
    
    // Cálculo
    // ...
    
    return resultado;
}

// 2. Exponer en el módulo
return {
    // ... otras funciones ...
    calcularNombreEstadistico,
    // ... resto ...
};

// 4. Conectar al flujo de análisis
function ejecutarAnalisis() {
    // ... código existente ...
    switch (nombreEstadisticoSeleccionado) {
        // ... otros cases ...
        case 'Nombre del Estadístico':
            resultados['Nombre del Estadístico'][col] = calcularNombreEstadistico(values);
            break;
        // ... resto ...
    }
    // ... resto ...
}
```

### 2. estadisticosConfig.js
```javascript
// En la sección apropiada (descriptiva, hipótesis, etc.)
'Nombre del Estadístico': {
    seccion:   'descriptiva',
    calcular:  'calcularNombreEstadistico',
    formula:   'fórmula matemática aquí',
    desc:      'Descripción completa de qué mide y su interpretación',
    icono:     '📊',
    minMuestra: 1,
    requiereDosColumnas: false,
    inputs: {
        tipo:        'una-columna',
        grupos:      1,
    },
    // Campos adicionales según el tipo de estadístico
    // ...
},
```

### 3. index.html
```html
<!-- Añadir en la sección apropiada del navbar -->
<li><a href="#" data-stat="Nombre del Estadístico">Nombre del Estadístico</a></li>
```

## ✅ Verificación de Cumplimiento

Después de implementar, verifica que:

1. [ ] La función de cálculo está correctamente implementada y expuesta
2. [ ] La entrada en `estadisticosConfig.js` contiene todos los metadatos necesarios
3. [ ] El estadístico aparece en el navbar con el nombre correcto
4. [ ] Seleccionar el estadístico y ejecutar análisis produce resultados
5. [ ] Los resultados aparecen correctamente en la vista de análisis
6. [ ] El estadístico está incluido en todos los formatos de reporte (HTML, PDF, TXT, CSV)
7. [ ] Las notas metodológicas incluyen la fórmula, descripción, icono y otros metadatos correctos gracias a `estadisticosConfig.js`
8. [ ] No se introducen errores en otras funcionalidades existentes
9. [ ] El código sigue las mismas convenciones de estilo que el resto del proyecto

## 📝 Ejemplo de Implementación Real

Basado en una entrada típica de `estadisticosConfig.js`:

1. **EstadisticaDescriptiva.js:**
   - Función `calcularNombreEstadistico(values)`
   - Expuesta en el retorno del módulo
   - Case en `ejecutarAnalisis()`

2. **estadisticosConfig.js:**
   ```javascript
   'Nombre del Estadístico': {
       seccion:   'descriptiva',
       calcular:  'calcularNombreEstadistico',
       formula:   'fórmula matemática aquí',
       desc:      'Descripción completa',
       icono:     '📊',
       minMuestra: 1,
       inputs: { tipo: 'una-columna', grupos: 1 }
   }
   ```

3. **index.html:**
   ```html
   <li><a href="#" data-stat="Nombre del Estadístico">Nombre del Estadístico</a></li>
   ```

## 🛠️ Solución de Problemas Comunes

### El estadístico no aparece en el menú
- Verifica que el `data-stat` en index.html coincida exactamente con el case en ejecutarAnalisis() y la clave en estadisticosConfig.js
- Asegúrate de que no haya errores de JavaScript que impidan la carga del menú

### El estadístico se calcula pero no aparece en los reportes
- Confirma que hayas añadido la entrada correcta en el objeto `estadisticosConfig.js`
- Verifica que la clave en estadisticosConfig.js coincida exactamente con el nombre usado en el case

### Las notas metodológicas muestran fórmula o descripción incorrecta
- Revisa la entrada correspondiente en estadisticosConfig.js
- Asegúrate de no haber cometido errores tipográficos en la fórmula o descripción

### Aparecen errores al seleccionar el estadístico
- Revisa la consola del navegador para mensajes de error específicos
- Verifica que tu función de cálculo maneje correctamente casos edge (arrays vacíos, etc.)
- Confirma que todas las variables y funciones utilizadas estén definidas

## 📚 Referencias en el Código

Para ver ejemplos de implementaciones recientes, consulta el archivo `estadisticosConfig.js` donde encontrarás entradas como:
- 'Media Aritmética'
- 'Asimetría (Skewness)'
- 'Curtosis (Kurtosis)'
- 'Error Estándar'
- 'Intervalos de Confianza'
- 'T-Test (una muestra)'
- 'ANOVA One-Way'
- y muchos más...

## 📋 Nueva Sección: Implementación de Estadísticos con Modal de Configuración

Algunos estadísticos requieren un **modal de configuración** para seleccionar columnas específicas antes de ejecutar el análisis. Ejemplos típicos:
- **PCA (Componentes Principales)**
- **Bootstrap**
- **Diagrama de Pareto**
- **Regresión Lineal Múltiple**

### Paso 1: Agregar al Mapa de Configuraciones

En `script.js`, dentro de la función `mostrarModalConfiguracionHypothesis()`, agregar la entrada en el objeto `configs`:

```javascript
// Agregar en la sección de configs (alrededor de línea 2094)
'Nombre del Estadístico': {
    title: '🎯 Configurar Nombre',
    customFunc: 'abrirModalConfigNombre'
}
```

### Paso 2: Crear la Función del Modal

En `script.js`, crear la función que construye el modal:

```javascript
window.abrirModalConfigNombre = function(importedParam) {
    // 1. Obtener datos (del parámetro o del estado)
    let imported = importedParam || getDataForModal();
    
    if (!imported || !imported.headers || imported.headers.length === 0) {
        // Buscar en StateManager como backup
        const sheet = StateManager.getActiveSheet();
        if (sheet && sheet.data && sheet.data.length > 0) {
            imported = { headers: sheet.headers, data: sheet.data };
        }
    }
    
    if (!imported || !imported.headers) {
        _showToast('⚠️ Primero importa datos', true);
        return false;
    }
    
    // 2. Encontrar columnas numéricas/categóricas
    const allCols = imported.headers;
    const numericCols = allCols.filter(col => {
        const values = imported.data.map(row => row[col])
            .filter(v => v !== null && v !== '' && v !== undefined);
        const numericCount = values.filter(v => !isNaN(parseFloat(v))).length;
        return numericCount / values.length > 0.5;
    });
    
    // 3. Crear el modal HTML
    const modal = document.createElement('div');
    modal.innerHTML = `
        <div class="dm-modal-overlay"></div>
        <div class="dm-modal-card">
            <div class="dm-modal-header">
                <h3>🎯 Configurar Nombre</h3>
            </div>
            <div class="dm-modal-body">
                <!-- Aquí，放入 checkbox para seleccionar columnas -->
            </div>
            <div class="dm-modal-footer">
                <button id="nombre-cancel">Cancelar</button>
                <button id="nombre-confirm">Guardar</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // 4. Manejar eventos y guardar configuración
    // ...
    
    return true;
};
```

### Paso 3: Conectar con el Flujo de Selección

En `script.js`, función `applyStatSelection()`, agregar el estadístico a la lista de configuración:

```javascript
// Los stats con customFunc también necesitan modal
const customFuncStats = [
    'Correlación Pearson',
    'Regresión Lineal Simple', 
    'PCA (Componentes Principales)',
    'Bootstrap',
    // Agregar nuevos aquí
];

section.options.forEach(opt => {
    if (tempModalSelection[opt]) {
        const necesitaConfig = HYPOTHESIS_SET.has(opt) || customFuncStats.includes(opt);
        if (necesitaConfig) {
            statsQueNecesitanConfig.push(opt);
        } else {
            statsNormales.push(opt);
        }
    }
});
```

### Errores Comunes y Soluciones

| Problema | Causa | Solución |
|---------|-------|----------|
| Modal no se abre | `imported` undefined | Usar `getDataForModal()` + StateManager como backup |
| customFunc no existe | Función no expuesta.global | Usar `window.abrirModalConfigNombre = function...` |
| Stats se agregan sin abrir modal | No está en `customFuncStats` | Agregar el nombre del stat al array `customFuncStats` |

### Verificación

Después de implementar:
1. [ ] Seleccionar el estadístico en el sidebar
2. [ ] Click en "Aceptar" debe abrir el modal
3. [ ] Seleccionar columnas y confirmar guarda la configuración
4. [ ] El análisis usa las columnas seleccionadas

---

### Ejemplo de Problema Resuelto: PCA

**Síntoma:** Al seleccionar PCA, se agregaba directamente al sidebar sin abrir el modal de selección de columnas.

**Causa:** El código solo verificaba `HYPOTHESIS_SET` para abrir modales, pero PCA usa `customFunc`.

**Solución:** Agregar 'PCA (Componentes Principales)' al array `customFuncStats` en `applyStatSelection()`.

Cada entrada sigue el formato estructurado documentado en las primeras líneas del archivo.