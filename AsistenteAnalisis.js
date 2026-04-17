// ========================================
// AsistenteAnalisis.js — StatAnalyzer Pro
// Asistente de selección de pruebas estadísticas
// ========================================

const AsistenteAnalisis = (() => {
    // ── Preguntas del árbol de decisión ───────
    const PREGUNTAS = [
        {
            id: 'tipo_datos',
            texto: '¿Qué tipo de datos tienes?',
            opciones: [
                { label: 'Cualitativos (categorías)', value: 'cualitativo' },
                { label: 'Cuantitativos (números)', value: 'cuantitativo' }
            ]
        },
        {
            id: 'num_grupos',
            texto: '¿Cuántos grupos o muestras tienes?',
            opciones: [
                { label: 'Uno solo', value: '1' },
                { label: 'Dos grupos', value: '2' },
                { label: 'Tres o más', value: '3+' }
            ]
        },
        {
            id: 'normalidad',
            texto: '¿Los datos siguen distribución normal?',
            opciones: [
                { label: 'Sí', value: 'si' },
                { label: 'No', value: 'no' },
                { label: 'No lo sé', value: 'nose' }
            ]
        },
        {
            id: 'emparejados',
            texto: '¿Los grupos están relacionados/emparejados?',
            opciones: [
                { label: 'Sí (mismas unidades)', value: 'si' },
                { label: 'No (independientes)', value: 'no' }
            ]
        },
        {
            id: ' varianza',
            texto: '¿Las varianzas son iguales?',
            opciones: [
                { label: 'Sí', value: 'si' },
                { label: 'No', value: 'no' },
                { label: 'No lo sé', value: 'nose' }
            ]
        }
    ];

    // ── Recomendaciones basadas en respuestas ───────
    const RECOMENDACIONES = {
        // Un grupo cuantitativo
        'cuantitativo_1_si_si': { prueba: 't-test-una-muestra', nombre: 'T-Test (una muestra)', desc: 'Compara la media de un grupo con un valor conocido' },
        'cuantitativo_1_si_no': { prueba: 'wilcoxon-una-muestra', nombre: 'Wilcoxon (una muestra)', desc: 'Alternativa no paramétrica para una muestra' },
        'cuantitativo_1_nose_si': { prueba: 't-test-una-muestra', nombre: 'T-Test (una muestra)', desc: 'Primero verifica normalidad, luego usa t-test' },
        'cuantitativo_1_nose_no': { prueba: 'wilcoxon-una-muestra', nombre: 'Wilcoxon (una muestra)', desc: 'Alternativa no paramétrica segura' },
        
        // Dos grupos cuantitativo
        'cuantitativo_2_si_si_si': { prueba: 't-test-dos-muestras', nombre: 'T-Test (dos muestras independientes)', desc: 'Compara medias de dos grupos' },
        'cuantitativo_2_si_si_no': { prueba: 't-test-dos-muestras-welch', nombre: 'T-Test de Welch', desc: 'Compara medias con varianzas desiguales' },
        'cuantitativo_2_si_no': { prueba: 'wilcoxon-mann', nombre: 'Mann-Whitney U', desc: 'Alternativa no paramétrica para dos grupos' },
        'cuantitativo_2_nose': { prueba: 't-test-dos-muestras', nombre: 'T-Test o Mann-Whitney', desc: 'Verifica normalidad primero' },
        
        // Dos grupos emparejados
        'cuantitativo_2si_emb': { prueba: 't-test-pareado', nombre: 'T-Test pareado', desc: 'Compara medidas relacionadas' },
        'cuantitativo_2_noemb': { prueba: 't-test-independiente', nombre: 'T-Test independiente', desc: 'Compara grupos distintos' },
        
        // Tres o más grupos
        'cuantitativo_3si_': { prueba: 'anova-oneway', nombre: 'ANOVA One-Way', desc: 'Compara medias de múltiples grupos' },
        'cuantitativo_3no_': { prueba: 'kruskal-wallis', nombre: 'Kruskal-Wallis', desc: 'ANOVA no paramétrico para múltiples grupos' },
        
        // Cualitativo
        'cualitativo_': { prueba: 'chi-cuadrado', nombre: 'Chi-Cuadrado', desc: 'Compara proporciones entre categorías' }
    };

    let _respuestas = {};
    let _pregunta_actual = 0;

    // ── API pública ──────────────────────────
    function getPreguntaActual() {
        const pregunta = PREGUNTAS[_pregunta_actual];
        if (!pregunta) return null;
        
        return {
            id: pregunta.id,
            numero: _pregunta_actual + 1,
            total: PREGUNTAS.length,
            texto: pregunta.texto,
            opciones: pregunta.opciones
        };
    }

    function responder(preguntaId, respuesta) {
        const preguntaIndex = PREGUNTAS.findIndex(p => p.id === preguntaId);
        if (preguntaIndex === -1) return false;
        
        _respuestas[preguntaId] = respuesta;
        
        // Determinar siguiente pregunta según lógica del árbol
        _pregunta_actual = _determinarSiguientePregunta(preguntaIndex, respuesta);
        
        return true;
    }

    function _determinarSiguientePregunta(preguntaIndex, respuesta) {
        const pregunta = PREGUNTAS[preguntaIndex];
        
        // Lógica simple de flujo
        if (pregunta.id === 'tipo_datos') {
            if (respuesta === 'cualitativo') return 4; // Ir a chi-cuadrado directamente
            return 1; // Ir a num_grupos
        }
        
        if (pregunta.id === 'num_grupos') {
            if (respuesta === '1') return 2; // Ir a normalidad
            if (respuesta === '2') return 3; // Ir a emparejados
            return 4; // Ir a fin (ANOVA)
        }
        
        if (pregunta.id === 'normalidad') {
            return 4; // Fin
        }
        
        if (pregunta.id === 'emparejados') {
            return 4; // Fin
        }
        
        return 4; // Fin por defecto
    }

    function getRecomendacion() {
        const tipo = _respuestas['tipo_datos'] || 'cuantitativo';
        const grupos = _respuestas['num_grupos'] || '1';
        const normal = _respuestas['normalidad'] || 'si';
        const emparejados = _respuestas['emparejados'] || 'no';
        
        // Construir key de búsqueda
        let key = `${tipo}_${grupos}`;
        
        if (tipo === 'cualitativo') {
            key = 'cualitativo_';
        } else if (grupos === '2' && emparejados === 'si') {
            key += 'si_emb';
        } else if (normal === 'si') {
            key += '_si';
        }
        
        const reco = RECOMENDACIONES[key];
        
        if (!reco) {
            return { prueba: 'descriptiva', nombre: 'Análisis Descriptivo', desc: 'Comenzar con estadísticas descriptivas' };
        }
        
        return reco;
    }

    function reset() {
        _respuestas = {};
        _pregunta_actual = 0;
    }

    function getEstado() {
        return {
            pregunta_actual: _pregunta_actual,
            total_preguntas: PREGUNTAS.length,
            respuestas: { ..._respuestas },
            completo: _pregunta_actual >= PREGUNTAS.length
        };
    }

    // API pública
    return {
        getPreguntaActual,
        responder,
        getRecomendacion,
        reset,
        getEstado
    };
})();

// Funciones globales para HTML
function getPreguntaAsistente() { return AsistenteAnalisis.getPreguntaActual(); }
function responderAsistente(id, value) { return AsistenteAnalisis.responder(id, value); }
function getRecomendacionAsistente() { return AsistenteAnalisis.getRecomendacion(); }
function resetAsistente() { return AsistenteAnalisis.reset(); }

console.log('✅ AsistenteAnalisis cargado');