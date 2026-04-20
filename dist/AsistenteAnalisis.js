"use strict";
// ========================================
// AsistenteAnalisis.js — StatAnalyzer Pro v2
// Asistente de selección de pruebas estadísticas
// Niveles: 1=básico, 2=árbol completo, 3=enriquecido
// ========================================
// Mapeo de nombres a keys de estadísticos (exactos del sistema)
const MAPA_ESTADISTICOS = {
    'Chi-Cuadrado': 'Chi-Cuadrado',
    'T-Test Una Muestra': 'T-Test (una muestra)',
    'T-Test dos Muestras': 'T-Test (dos muestras)',
    'T-Test Dos Muestras Independientes': 'T-Test (dos muestras)',
    'T-Test de Welch': 'T-Test (dos muestras)',
    'Mann-Whitney U': 'Mann-Whitney U',
    'T-Test Pareado': 'Wilcoxon',
    'ANOVA One-Way': 'ANOVA One-Way',
    'Kruskal-Wallis': 'Kruskal-Wallis'
};
const AsistenteAnalisis = (() => {
    // ── Nivel 1: Preguntas expandidas ─────
    const PREGUNTAS = [
        {
            id: 'tipo_datos',
            texto: '¿Qué tipo de datos tienes?',
            descripcion: 'Esto determina la familia de pruebas a usar',
            opciones: [
                { label: 'Cuantitativos (números, medidas)', value: 'cuantitativo' },
                { label: 'Cualitativos (categorías, grupos)', value: 'cualitativo' }
            ]
        },
        {
            id: 'num_grupos',
            texto: '¿Cuántos grupos o muestras necesitas comparar?',
            descripcion: 'El número de grupos cambia completamente la prueba',
            opciones: [
                { label: 'Uno (comparar con un valor)', value: '1' },
                { label: 'Dos (comparar entre dos grupos)', value: '2' },
                { label: 'Tres o más (múltiples grupos)', value: '3+' }
            ]
        },
        {
            id: 'emparejados',
            texto: '¿Los datos están relacionados o son independientes?',
            descripcion: 'Datos de las mismas personas/unidades vs diferentes',
            opciones: [
                { label: 'Relacionados/Emparejados (mismas unidades)', value: 'si' },
                { label: 'Independientes (diferentes unidades)', value: 'no' }
            ]
        },
        {
            id: 'normalidad',
            texto: '¿Los datos siguen distribución normal?',
            descripcion: 'Prueba paramétrica vs no paramétrica',
            opciones: [
                { label: 'Sí (distribución normal)', value: 'si' },
                { label: 'No (distribución libre)', value: 'no' },
                { label: 'No lo sé', value: 'nose' }
            ]
        },
        {
            id: 'varianza',
            texto: '¿Las varianzas de los grupos son iguales?',
            descripcion: 'Homocedasticidad - afecta la prueba t',
            opciones: [
                { label: 'Sí (varianzas iguales)', value: 'si' },
                { label: 'No (varianzas diferentes)', value: 'no' },
                { label: 'No lo sé', value: 'nose' }
            ]
        },
        {
            id: 'tamano_muestra',
            texto: '¿Cuál es el tamaño de muestra?',
            descripcion: 'n > 30 permite normalidad asintótica',
            opciones: [
                { label: 'Pequeño (n ≤ 30)', value: 'pequeno' },
                { label: 'Mediano (30 < n ≤ 100)', value: 'mediano' },
                { label: 'Grande (n > 100)', value: 'grande' }
            ]
        }
    ];
    // ── Recomendaciones enrichidas (Nivel 3) ─────
    const RECOMENDACIONES = {
        // Cualitativo
        'cualitativo': {
            nombre: 'Chi-Cuadrado',
            pruebas: ['Chi-Cuadrado de independencia', 'Chi-Cuadrado de bondad de ajuste'],
            descripcion: 'Compara frecuencias observadas vs esperadas en categorías',
            cuando: 'Tienes datos categóricos y quieres probar asociación entre variables',
            supuesto1: 'Frecuencia esperada ≥ 5 en cada celda',
            supuesto2: 'Observaciones independientes',
            alternativa: 'Test exacto de Fisher si hay pocas observaciones',
            interpretacion: 'Valor p < 0.05 indica asociación significativa'
        },
        // Un grupo cuantitativo
        'cuantitativo_1': {
            nombre: 'T-Test Una Muestra',
            pruebas: ['T-Test una muestra'],
            descripcion: 'Compara la media de un grupo con un valor conocido o teórico',
            cuando: 'Tienes un grupo y quieres comparar su media con un valor de referencia',
            supuesto1: 'Datos aproximadamente normales',
            supuesto2: 'Variable continua',
            alternativa: 'Wilcoxon si no hay normalidad',
            interpretacion: 'Valor p < 0.05 → la media es diferente del valor de referencia'
        },
        // Dos grupos independientes
        'cuantitativo_2_no_si': {
            nombre: 'T-Test Dos Muestras Independientes',
            pruebas: ['T-Test independiente', 'T-Test de Welch'],
            descripcion: 'Compara medias de dos grupos separados',
            cuando: 'Tienes dos grupos diferentes y quieres comparar sus medias',
            supuesto1: 'Normalidad en ambos grupos',
            supuesto2: 'Varianzas homogéneas (o usar Welch)',
            supuesto3: 'Observaciones independientes',
            alternativa: 'Mann-Whitney U si no hay normalidad',
            interpretacion: 'Valor p < 0.05 → las medias son diferentes'
        },
        'cuantitativo_2_no_no': {
            nombre: 'Mann-Whitney U',
            pruebas: ['Mann-Whitney U', 'Wilcoxon rank-sum'],
            descripcion: 'Alternativa no paramétrica para comparar dos grupos',
            cuando: 'No hay normalidad o muestras pequeñas',
            supuesto1: 'Observaciones independientes',
            supuesto2: 'Distribución similar en ambos grupos',
            alternativa: 'No hay alternativa más simple',
            interpretacion: 'Valor p < 0.05 → los grupos difieren en posición'
        },
        // Dos grupos emparejados
        'cuantitativo_2_si': {
            nombre: 'T-Test Pareado',
            pruebas: ['T-Test pareado', 'T-Test de diferencias'],
            descripcion: 'Compara medidas antes/después en las mismas unidades',
            cuando: 'Mismas unidades medidas dos veces (antes/después, izquierda/derecha)',
            supuesto1: 'Diferencias aproximadamente normales',
            supuesto2: 'Parejas de observaciones',
            alternativa: 'Wilcoxon signed-rank si no hay normalidad',
            interpretacion: 'Valor p < 0.05 → hay cambio significativo'
        },
        // Tres o más grupos
        'cuantitativo_3+_si': {
            nombre: 'ANOVA One-Way',
            pruebas: ['ANOVA de un factor', 'ANOVA de Welch'],
            descripcion: 'Compara medias de 3+ grupos simultáneamente',
            cuando: 'Tienes múltiples grupos y quieres saber si al menos uno es diferente',
            supuesto1: 'Normalidad en todos los grupos',
            supuesto2: 'Varianzas homogéneas',
            supuesto3: 'Diseño balanceado preferido',
            alternativa: 'Kruskal-Wallis (no paramétrico)',
            interpretacion: 'p < 0.05 → al menos un grupo diferente. Post-hoc para saber cuál'
        },
        'cuantitativo_3+_no': {
            nombre: 'Kruskal-Wallis',
            pruebas: ['Kruskal-Wallis H-test'],
            descripcion: 'Alternativa no paramétrica para múltiples grupos',
            cuando: 'No hay normalidad o muestras pequeñas',
            supuesto1: 'Variables ordinales o continuas',
            supuesto2: '3+ grupos independientes',
            alternativa: 'No hay alternativa más simple',
            interpretacion: 'p < 0.05 → al menos un grupo diferente'
        }
    };
    let respuestas = {};
    let preguntaActual = 0;
    function getInfo() {
        if (preguntaActual >= PREGUNTAS.length)
            return null;
        return {
            id: PREGUNTAS[preguntaActual].id,
            numero: preguntaActual + 1,
            total: PREGUNTAS.length,
            texto: PREGUNTAS[preguntaActual].texto,
            descripcion: PREGUNTAS[preguntaActual].descripcion,
            opciones: PREGUNTAS[preguntaActual].opciones
        };
    }
    function responder(id, value) {
        respuestas[id] = value;
        // Lógica de navegación del árbol (Nivel 2)
        if (id === 'tipo_datos') {
            preguntaActual = value === 'cualitativo' ? PREGUNTAS.length : 1;
        }
        else if (id === 'num_grupos') {
            preguntaActual = 2;
        }
        else if (id === 'normalidad' || id === 'emparejados' || id === 'varianza' || id === 'tamano_muestra') {
            preguntaActual++;
        }
        return true;
    }
    function getResultado() {
        const tipo = respuestas.tipo_datos || 'cuantitativo';
        const grupos = respuestas.num_grupos || '2';
        const emparejados = respuestas.emparejados || 'no';
        const normalidad = respuestas.normalidad || 'si';
        const varianza = respuestas.varianza || 'si';
        if (tipo === 'cualitativo') {
            return RECOMENDACIONES.cualitativo;
        }
        // Un grupo
        if (grupos === '1') {
            return RECOMENDACIONES.cuantitativo_1;
        }
        // Dos grupos emparejados
        if (emparejados === 'si') {
            return RECOMENDACIONES.cuantitativo_2_si;
        }
        // Dos grupos independientes con 3+ grupos
        if (grupos === '3+' || (grupos === '2' && emparejados === 'no')) {
            const key = normalidad === 'si' ? 'si' : 'no';
            if (grupos === '3+') {
                return key === 'si' ? RECOMENDACIONES['cuantitativo_3+_si'] : RECOMENDACIONES['cuantitativo_3+_no'];
            }
            return key === 'si' ? RECOMENDACIONES.cuantitativo_2_no_si : RECOMENDACIONES.cuantitativo_2_no_no;
        }
        return RECOMENDACIONES.cuantitativo_1;
    }
    function reset() {
        respuestas = {};
        preguntaActual = 0;
    }
    function getEstado() {
        return { preguntaActual, total: PREGUNTAS.length, respuestas, completo: preguntaActual >= PREGUNTAS.length };
    }
    return {
        getInfo,
        responder,
        getResultado,
        reset,
        getEstado
    };
})();
// Funciones globales
function getPreguntaAsistente() { return AsistenteAnalisis.getInfo(); }
function responderAsistente(id, value) { return AsistenteAnalisis.responder(id, value); }
function getRecomendacionAsistente() { return AsistenteAnalisis.getResultado(); }
function resetAsistente() { return AsistenteAnalisis.reset(); }
console.log('✅ AsistenteAnalisis v2 cargado - 6 preguntas + recomendaciones enrichidas');
