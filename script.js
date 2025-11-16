// ========================================
// FUNCIONALIDAD DE ACORDEÓN
// ========================================

const accordionHeaders = document.querySelectorAll('.accordion-header');

accordionHeaders.forEach(header => {
    header.addEventListener('click', function() {
        const content = this.nextElementSibling;
        const isActive = this.classList.contains('active');
        
        // Cerrar todos los acordeones
        accordionHeaders.forEach(h => {
            h.classList.remove('active');
            h.nextElementSibling.classList.remove('active');
        });
        
        // Si no estaba activo, abrirlo
        if (!isActive) {
            this.classList.add('active');
            content.classList.add('active');
        }
    });
});

// ========================================
// GESTIÓN DE ESTADÍSTICOS ACTIVOS
// ========================================

const activeStatsContainer = document.getElementById('activeStatsContainer');
const statsCount = document.getElementById('statsCount');
const emptyState = document.getElementById('emptyState');
let activeStats = [];

/**
 * Actualiza el contador y visibilidad del mensaje vacío
 */
function updateActiveStats() {
    if (activeStats.length === 0) {
        emptyState.style.display = 'block';
        statsCount.textContent = '0 estadísticos activos';
    } else {
        emptyState.style.display = 'none';
        const plural = activeStats.length !== 1;
        statsCount.textContent = `${activeStats.length} estadístico${plural ? 's' : ''} activo${plural ? 's' : ''}`;
    }
}

/**
 * Agrega un estadístico al panel de activos
 * @param {string} name - Nombre del estadístico
 */
function addActiveStat(name) {
    // Evitar duplicados
    if (activeStats.includes(name)) return;
    
    activeStats.push(name);
    
    // Crear el chip
    const chip = document.createElement('div');
    chip.className = 'stat-chip';
    chip.setAttribute('data-stat-name', name);
    chip.innerHTML = `
        <span>${name}</span>
        <button class="chip-remove" onclick="removeActiveStatByName('${name}')">×</button>
    `;
    
    activeStatsContainer.appendChild(chip);
    updateActiveStats();
}

/**
 * Elimina un estadístico por nombre
 * @param {string} name - Nombre del estadístico a eliminar
 */
function removeActiveStatByName(name) {
    // Eliminar del array
    activeStats = activeStats.filter(stat => stat !== name);
    
    // Eliminar el chip del DOM
    const chip = activeStatsContainer.querySelector(`[data-stat-name="${name}"]`);
    if (chip) {
        chip.remove();
    }
    
    // Desmarcar la opción en el menú
    document.querySelectorAll('.menu-option').forEach(option => {
        if (option.textContent === name) {
            option.classList.remove('selected');
        }
    });
    
    updateActiveStats();
}

// ========================================
// SELECCIÓN DE ESTADÍSTICOS
// ========================================

document.querySelectorAll('.menu-option').forEach(option => {
    option.addEventListener('click', function() {
        const statName = this.textContent;
        
        if (this.classList.contains('selected')) {
            // Deseleccionar
            this.classList.remove('selected');
            removeActiveStatByName(statName);
        } else {
            // Seleccionar
            this.classList.add('selected');
            addActiveStat(statName);
        }
    });
});

// ========================================
// BOTONES DE ACCIÓN
// ========================================

document.querySelector('.btn-import').addEventListener('click', function() {
    console.log('Importar datos clickeado');
    // Aquí irá la lógica para importar datos
    alert('Funcionalidad de importación de datos en desarrollo');
});

document.querySelector('.btn-run').addEventListener('click', function() {
    console.log('Ejecutar análisis clickeado');
    console.log('Estadísticos activos:', activeStats);
    
    if (activeStats.length === 0) {
        alert('Por favor, selecciona al menos un estadístico');
        return;
    }
    
    // Aquí irá la lógica para ejecutar el análisis
    alert(`Ejecutando análisis con ${activeStats.length} estadístico(s):\n${activeStats.join('\n')}`);
});

// ========================================
// NAVEGACIÓN SUPERIOR
// ========================================

document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function() {
        // Remover clase active de todos
        document.querySelectorAll('.nav-item').forEach(nav => {
            nav.classList.remove('active');
        });
        
        // Agregar clase active al clickeado
        this.classList.add('active');
        
        console.log('Navegación clickeada:', this.textContent);
        // Aquí se puede agregar lógica para cambiar vistas
    });
});

// ========================================
// INICIALIZACIÓN
// ========================================

// Actualizar el estado inicial
updateActiveStats();

console.log('StatAnalyzer Pro inicializado correctamente');