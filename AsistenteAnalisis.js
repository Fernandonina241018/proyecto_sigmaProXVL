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
        'cualitativo': { nombre: 'Chi-Cuadrado', desc: 'Prueba para datos categóricos' },
        'cuantitativo_1': { nombre: 'T-Test una muestra', desc: 'Compara media con valor conocido' },
        'cuantitativo_2_si': { nombre: 'T-Test dos muestras', desc: 'Compara medias de dos grupos' },
        'cuantitativo_2_no': { nombre: 'Mann-Whitney U', desc: 'Alternativa no paramétrica' },
        'cuantitativo_3+': { nombre: 'ANOVA One-Way', desc: 'Compara medias de múltiples grupos' }
    };

    let respuestas = {};
    let preguntaActual = 0;

    function getPregunta() {
        if (preguntaActual >= PREGUNTAS.length) return null;
        const p = PREGUNTAS[preguntaActual];
        return {
            id: p.id,
            texto: p.texto,
            opciones: p.opciones
        };
    }

    function getInfo() {
        if (preguntaActual >= PREGUNTAS.length) return null;
        return {
            id: PREGUNTAS[preguntaActual].id,
            numero: preguntaActual + 1,
            total: PREGUNTAS.length,
            texto: PREGUNTAS[preguntaActual].texto,
            opciones: PREGUNTAS[preguntaActual].opciones
        };
    }

    function responder(id, value) {
        respuestas[id] = value;
        
        if (id === 'tipo_datos') {
            preguntaActual = value === 'cualitativo' ? PREGUNTAS.length : 1;
        } else if (id === 'num_grupos') {
            preguntaActual = 2;
        } else {
            preguntaActual++;
        }
        
        return true;
    }

    function getResultado() {
        const tipo = respuestas.tipo_datos || 'cuantitativo';
        const grupos = respuestas.num_grupos || '1';
        
        if (tipo === 'cualitativo') return RECOMENDACIONES.cualitativo;
        
        if (tipo === 'cuantitativo' && grupos === '1') return RECOMENDACIONES.cuantitativo_1;
        if (tipo === 'cuantitativo' && grupos === '2') return RECOMENDACIONES.cuantitativo_2_si;
        if (tipo === 'cuantitativo' && grupos === '3+') return RECOMENDACIONES['cuantitativo_3+'];
        
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
        getPregunta,
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

console.log('✅ AsistenteAnalisis cargado');