// ========================================
// AsistenteAnalisis.js — StatAnalyzer Pro
// Asistente de selección de pruebas estadísticas
// ========================================

const AsistenteAnalisis = (() => {
    const PREGUNTAS = [
        { id: 'tipo_datos', texto: '¿Qué tipo de datos tienes?', opciones: [{ label: 'Cualitativos (grupos)', value: 'cualitativo' }, { label: 'Cuantitativos (números)', value: 'cuantitativo' }] },
        { id: 'num_grupos', texto: '¿Cuántos grupos tienes?', opciones: [{ label: 'Uno', value: '1' }, { label: 'Dos', value: '2' }, { label: 'Tres o más', value: '3+' }] },
        { id: 'normalidad', texto: '¿Los datos son normales?', opciones: [{ label: 'Sí', value: 'si' }, { label: 'No', value: 'no' }] },
        { id: 'emparejados', texto: '¿Grupos emparejados?', opciones: [{ label: 'Sí', value: 'si' }, { label: 'No', value: 'no' }] }
    ];

    const RECOMENDACIONES = {
        'cualitativo_': { nombre: 'Chi-Cuadrado', desc: 'Prueba para datos categóricos' },
        'cuantitativo_1': { nombre: 'T-Test una muestra', desc: 'Compara media con valor conocido' },
        'cuantitativo_2_si': { nombre: 'T-Test dos muestras', desc: 'Compara medias de dos grupos' },
        'cuantitativo_2_no': { nombre: 'Mann-Whitney U', desc: 'Alternativa no paramétrica' },
        'cuantitativo_3+': { nombre: 'ANOVA One-Way', desc: 'Compara medias de múltiples grupos' }
    };

    let respuestas = {};
    let preguntaActual = 0;

    function getPreguntaActual() {
        return preguntaActual < PREGUNTAS.length ? PREGUNTAS[preguntaActual] : null;
    }

    function getPreguntaInfo() {
        const p = getPreguntaActual();
        if (!p) return null;
        return { id: p.id, numero: preguntaActual + 1, total: PREGUNTAS.length, texto: p.texto, opciones: p.opciones };
    }

    function responder(id, value) {
        respuestas[id] = value;
        
        if (id === 'tipo_datos') {
            preguntaActual = value === 'cualitativo' ? 4 : 1;
        } else if (id === 'num_grupos') {
            preguntaActual = 2;
        } else {
            preguntaActual++;
        }
        
        return true;
    }

    function getRecomendacion() {
        const tipo = respuestas.tipo_datos || 'cuantitativo';
        const grupos = respuestas.num_grupos || '1';
        const normal = respuestas.normalidad || 'si';
        
        let key = tipo + '_';
        if (tipo === 'cuantitativo' && grupos === '2') {
            key += normal === 'si' ? 'si' : 'no';
        } else if (tipo === 'cuantitativo') {
            key += grupos;
        }
        
        return RECOMENDACIONES[key] || RECOMENDACIONES.cuantitativo_1;
    }

    function reset() {
        respuestas = {};
        preguntaActual = 0;
    }

    function getEstado() {
        return { preguntaActual, total: PREGUNTAS.length, respuestas, completo: preguntaActual >= PREGUNTAS.length };
    }

    return {
        getPreguntaActual,
        getPreguntaInfo,
        responder,
        getRecomendacion,
        reset,
        getEstado
    };
})();

// Funciones globales
function getPreguntaAsistente() { return AsistenteAnalisis.getPreguntaInfo(); }
function responderAsistente(id, value) { return AsistenteAnalisis.responder(id, value); }
function getRecomendacionAsistente() { return AsistenteAnalisis.getRecomendacion(); }
function resetAsistente() { return AsistenteAnalisis.reset(); }

console.log('✅ AsistenteAnalisis cargado');