const UI_STATE_KEY = 'dashboardUIState';

function saveUIState() {
  const state = {
    sidebarCollapsed: document.getElementById('sb').classList.contains('collapsed'),
    navbarCollapsed: document.getElementById('nb').classList.contains('collapsed'),
    activePage: document.querySelector('.page.active')?.id || 'page-datos',
    activeFloatingMenu: activeKey,
    checkedItems: JSON.parse(JSON.stringify(checked)),
    panelRatio: (function() {
      const handle = document.getElementById('datosHandle');
      const left = document.getElementById('panelDatasets');
      const right = document.getElementById('panelUpload');
      const container = document.getElementById('datosResizable');
      if (!handle || !left || !right || !container) return 0.55;
      const total = left.offsetWidth + right.offsetWidth;
      return total > 0 ? left.offsetWidth / total : 0.55;
    })()
  };
  localStorage.setItem(UI_STATE_KEY, JSON.stringify(state));
}

function loadUIState() {
  const saved = localStorage.getItem(UI_STATE_KEY);
  if (!saved) return;
  
  try {
    const state = JSON.parse(saved);
    
    if (state.sidebarCollapsed) {
      document.getElementById('sb').classList.add('collapsed');
    }
    
    if (state.navbarCollapsed) {
      document.getElementById('nb').classList.add('collapsed');
      document.getElementById('notch').classList.add('visible');
      document.querySelector('.top-row').classList.add('collapsed');
    }
    
    if (state.activePage) {
      navigateTo(state.activePage);
    }
    
    if (state.checkedItems) {
      Object.assign(checked, state.checkedItems);
    }
    
    if (state.panelRatio) {
      const handle = document.getElementById('datosHandle');
      const left = document.getElementById('panelDatasets');
      const right = document.getElementById('panelUpload');
      const container = document.getElementById('datosResizable');
      if (handle && left && right && container) {
        const total = container.offsetWidth - handle.offsetWidth;
        if (total > 0) {
          let newLeft = Math.round(total * state.panelRatio);
          const newRight = total - newLeft;
          left.style.flex = `0 0 ${newLeft}px`;
          right.style.flex = `0 0 ${newRight}px`;
        }
      }
    }
  } catch (e) {
    console.warn('Error loading UI state:', e);
  }
}

function resetUIState() {
  localStorage.removeItem(UI_STATE_KEY);
  location.reload();
}

const MENUS = {
  descriptiva: {
    title:'Descriptiva', color:'#a60aed',
    sections:[
      { label:'Tendencia central', items:[{label:'Media',tag:'μ'},{label:'Mediana',tag:'Md'},{label:'Moda',tag:'Mo'}] },
      { label:'Dispersión', items:[{label:'Desviación estándar',tag:'σ'},{label:'Varianza',tag:'σ²'},{label:'Rango intercuartil',tag:'IQR'},{label:'Coef. de variación',tag:'CV'}] },
      { label:'Forma', items:[{label:'Asimetría',tag:'Sk'},{label:'Curtosis',tag:'K'}] }
    ]
  },
  hipotesis: {
    title:'Pruebas de Hipótesis', color:'#4a90d9',
    sections:[
      { label:'Paramétricos', items:[{label:'T-test una muestra',tag:'t'},{label:'T-test dos muestras',tag:'t₂'},{label:'T-test pareado',tag:'tp'},{label:'Z-test proporción',tag:'z'},{label:'ANOVA una vía',tag:'F'}] },
      { label:'Varianza', items:[{label:'F-test varianzas',tag:'F'},{label:'Levene',tag:'W'}] }
    ]
  },
  correlacion: {
    title:'Correlación', color:'#2ecc71',
    sections:[
      { label:'Coeficientes', items:[{label:'Pearson',tag:'r'},{label:'Spearman',tag:'ρ'},{label:'Kendall',tag:'τ'},{label:'Punto-biserial',tag:'rpb'}] },
      { label:'Análisis', items:[{label:'Matriz de correlación',tag:'R'},{label:'Correlación parcial',tag:'rp'},{label:'Correlación canónica',tag:'Rc'}] }
    ]
  },
  regresion: {
    title:'Regresión', color:'#e8682a',
    sections:[
      { label:'Modelos', items:[{label:'Lineal simple',tag:'OLS'},{label:'Lineal múltiple',tag:'MLR'},{label:'Logística',tag:'LogR'},{label:'Polinomial',tag:'Poly'},{label:'Ridge',tag:'L2'},{label:'Lasso',tag:'L1'}] },
      { label:'Series de tiempo', items:[{label:'ARIMA',tag:'AR'},{label:'VAR',tag:'VAR'}] }
    ]
  },
  noparametricos: {
    title:'No Paramétricos', color:'#f39c12',
    sections:[
      { label:'Comparación', items:[{label:'Mann-Whitney U',tag:'U'},{label:'Wilcoxon',tag:'W'},{label:'Kruskal-Wallis',tag:'H'},{label:'Friedman',tag:'χ²'}] },
      { label:'Bondad de ajuste', items:[{label:'Kolmogorov-Smirnov',tag:'KS'},{label:'Shapiro-Wilk',tag:'SW'},{label:'Chi-cuadrado',tag:'χ²'}] }
    ]
  },
  multivariado: {
    title:'Multivariado', color:'#6c5ce7',
    sections:[
      { label:'Reducción', items:[{label:'PCA',tag:'PC'},{label:'Análisis factorial',tag:'FA'},{label:'MDS',tag:'MDS'}] },
      { label:'Clasificación', items:[{label:'Cluster K-means',tag:'K'},{label:'Cluster jerárquico',tag:'HC'},{label:'Discriminante',tag:'LDA'},{label:'MANOVA',tag:'MAN'}] }
    ]
  },
  especificacion: {
    title:'Especificación', color:'#4a90d9',
    sections:[
      { label:'Selección de modelo', items:[{label:'AIC',tag:'AIC'},{label:'BIC',tag:'BIC'},{label:'R² ajustado',tag:'R²'},{label:'Ramsey RESET',tag:'F'}] },
      { label:'Diagnóstico', items:[{label:'Multicolinealidad VIF',tag:'VIF'},{label:'Durbin-Watson',tag:'DW'},{label:'Breusch-Pagan',tag:'LM'}] }
    ]
  },
  calidad: {
    title:'Calidad', color:'#2ecc71',
    sections:[
      { label:'Supuestos', items:[{label:'Normalidad',tag:'N'},{label:'Homocedasticidad',tag:'H'},{label:'Autocorrelación',tag:'AC'}] },
      { label:'Diagnóstico', items:[{label:'Outliers (IQR)',tag:'IQR'},{label:'Outliers (Z)',tag:'Z'},{label:'Leverage',tag:'hii'},{label:"Cook's distance",tag:'D'}] }
    ]
  },
  extras: {
    title:'Extras', color:'#9e9e98',
    sections:[
      { label:'Datos', items:[{label:'Importar CSV / Excel',tag:'↑'},{label:'Exportar resultados',tag:'↓'},{label:'Limpiar datos',tag:'⌫'}] },
      { label:'General', items:[{label:'Configuración',tag:'⚙'},{label:'Atajos',tag:'⌘'},{label:'Documentación',tag:'?'}] }
    ]
  }
};

const fm      = document.getElementById('floatingMenu');
const fmTitle = document.getElementById('fmTitle');
const fmBody  = document.getElementById('fmBody');
let activeKey = null;
const checked = {};

function isChecked(key, label)   { return checked[key]?.[label] || false; }
function toggleCheck(key, label) { if (!checked[key]) checked[key] = {}; checked[key][label] = !checked[key][label]; }

function allChecked(key) {
  const all = MENUS[key].sections.flatMap(s => s.items.map(i => i.label));
  return all.every(l => checked[key]?.[l]);
}

function updateSelectAllBtn(key) {
  const btn = document.getElementById('fmSelectAll');
  if (!btn) return;
  const all = allChecked(key);
  btn.textContent = all ? 'Deseleccionar todo' : 'Seleccionar todo';
  btn.classList.toggle('all-selected', all);
}

function renderMenu(key) {
  const data = MENUS[key];
  fm.style.setProperty('--menu-color', data.color);
  fmTitle.textContent = data.title;
  fmTitle.style.color = data.color;
  
  const applyBtn = document.getElementById('fmApply');
  applyBtn.style.background = data.color;
  applyBtn.style.borderColor = data.color + '80';
  applyBtn.onmouseenter = () => { applyBtn.style.background = data.color + 'dd'; };
  applyBtn.onmouseleave = () => { applyBtn.style.background = data.color; };
  
  fmBody.innerHTML = data.sections.map(sec => `
    <div class="fm-section-label">${sec.label}</div>
    ${sec.items.map(item => {
      const on = isChecked(key, item.label);
      return `<div class="fm-item${on?' checked':''}" data-key="${key}" data-label="${item.label}">
        <div class="fm-cb"><svg viewBox="0 0 10 10"><polyline points="1.5,5 4,7.5 8.5,2"/></svg></div>
        <span style="font-size:13px;flex:1">${item.label}</span>
        <span class="fm-item-badge" style="color:${data.color};background:${data.color}18">${item.tag}</span>
      </div>`;
    }).join('')}`).join('');

  fmBody.querySelectorAll('.fm-item').forEach(el => {
    el.addEventListener('click', () => {
      toggleCheck(el.dataset.key, el.dataset.label);
      el.classList.toggle('checked', isChecked(el.dataset.key, el.dataset.label));
      updateSelectAllBtn(el.dataset.key);
      updateAllCounters();
      saveUIState();
    });
  });
  updateSelectAllBtn(key);
}

function setSb(el) {
  const key = el.dataset.key;
  if (activeKey === key) { closeMenu(); return; }
  document.querySelectorAll('.sb-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  activeKey = key;
  if (!MENUS[key]) return;
  const rect = el.getBoundingClientRect();
  fm.style.top  = Math.min(rect.top, window.innerHeight - 340) + 'px';
  fm.style.left = (rect.right + 8) + 'px';
  renderMenu(key);
  fm.classList.add('open');
  updateAllCounters();
}

function updateAllCounters() {
  Object.keys(MENUS).forEach(key => {
    const count = checked[key] ? Object.values(checked[key]).filter(Boolean).length : 0;
    const tab = document.querySelector(`.sb-tab[data-key="${key}"]`);
    if (!tab) return;
    let badge = tab.querySelector('.sb-count');
    if (count === 0) {
      if (badge) badge.remove();
    } else {
      if (!badge) {
        badge = document.createElement('div');
        badge.className = 'sb-count';
        tab.appendChild(badge);
      }
      badge.textContent = count > 9 ? '9+' : count;
      badge.style.background = MENUS[key].color;
    }
  });
}

function closeMenu() {
  fm.classList.remove('open');
  document.querySelectorAll('.sb-tab').forEach(t => t.classList.remove('active'));
  activeKey = null;
}

document.getElementById('fmClose').addEventListener('click', closeMenu);

document.getElementById('fmApply').addEventListener('click', () => {
  const count = checked[activeKey] ? Object.values(checked[activeKey]).filter(Boolean).length : 0;
  if (count === 0) {
    alert('Selecciona al menos un elemento');
    return;
  }
  const selectedItems = Object.entries(checked[activeKey])
    .filter(([_, v]) => v)
    .map(([k, _]) => k);
  console.log(`Aplicando ${count} items de ${MENUS[activeKey].title}:`, selectedItems);
  closeMenu();
});

document.getElementById('fmSelectAll').addEventListener('click', () => {
  if (!activeKey) return;
  const allItems  = MENUS[activeKey].sections.flatMap(s => s.items.map(i => i.label));
  const selectAll = !allChecked(activeKey);
  if (!checked[activeKey]) checked[activeKey] = {};
  allItems.forEach(l => { checked[activeKey][l] = selectAll; });
  fmBody.querySelectorAll('.fm-item').forEach(el => el.classList.toggle('checked', selectAll));
  updateSelectAllBtn(activeKey);
  updateAllCounters();
  saveUIState();
});

document.addEventListener('click', e => {
  if (!fm.contains(e.target) && !e.target.closest('.sb-tab')) closeMenu();
});

// CHART
const bvals = [45,70,30,85,55,60,40,75,20,90];
const ca = document.getElementById('chartViz');
if (ca) bvals.forEach((h,i) => {
  const b = document.createElement('div');
  b.className = 'bar' + (i===9?' hi':'');
  b.style.height = h+'%';
  b.onclick = () => { document.querySelectorAll('#chartViz .bar').forEach(x=>x.classList.remove('hi')); b.classList.add('hi'); };
  ca.appendChild(b);
});

// NOTCH
const nb      = document.getElementById('nb');
const notch   = document.getElementById('notch');
const topRow  = document.querySelector('.top-row');
document.getElementById('nbBtn').addEventListener('click', () => {
  nb.classList.add('collapsed');
  notch.classList.add('visible');
  topRow.classList.add('collapsed');
  saveUIState();
});
notch.addEventListener('click', () => {
  nb.classList.remove('collapsed');
  notch.classList.remove('visible');
  topRow.classList.remove('collapsed');
  saveUIState();
});

// SIDEBAR COLLAPSE
document.getElementById('sbBtn').addEventListener('click', () => {
  document.getElementById('sb').classList.toggle('collapsed');
closeMenu();
  saveUIState();
});

// MULTIPAGE
function navigateTo(targetId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(targetId).classList.add('active');
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.toggle('active', t.dataset.target === targetId));
  saveUIState();
}
function setNav(el) { navigateTo(el.dataset.target); }

// CARGAR ESTADO AL INICIAR
document.addEventListener('DOMContentLoaded', () => {
  loadUIState();
  updateAllCounters();
  initDataPreview();
  initDatasetClick();
});

// CLICK EN FILA DE DATASET
function initDatasetClick() {
  const tableRows = document.querySelectorAll('#datasetsTableBody tr');
  const infoLabel = document.getElementById('infoPanelLabel');
  const infoContent = document.getElementById('infoPanelContent');
  
  tableRows.forEach(row => {
    row.style.cursor = 'pointer';
    row.addEventListener('click', () => {
      const name = row.dataset.name;
      const data = DATASETS_PREVIEW[name];
      if (!data) return;
      
      tableRows.forEach(r => r.classList.remove('active'));
      row.classList.add('active');
      
      infoLabel.textContent = `Información: ${name}`;
      
      const stats = data.columns.map(col => {
        const values = data.rows.map(r => r[data.columns.indexOf(col)]);
        const numValues = values.filter(v => typeof v === 'number');
        const nullCount = values.filter(v => v === null || v === '' || v === undefined).length;
        const uniqueCount = [...new Set(values)].size;
        const min = numValues.length ? Math.min(...numValues) : '-';
        const max = numValues.length ? Math.max(...numValues) : '-';
        const type = numValues.length === values.length ? 'Número' : 'Texto';
        return { col, type, uniqueCount, nullCount, min, max };
      });
      
      infoContent.innerHTML = `
        <table class="data-table" style="font-size:11px;">
          <thead><tr><th>Columna</th><th>Tipo</th><th>Únicos</th><th>Nulos</th><th>Min</th><th>Max</th></tr></thead>
          <tbody>${stats.map(s => 
            `<tr><td>${s.col}</td><td>${s.type}</td><td>${s.uniqueCount}</td><td>${s.nullCount}</td><td>${s.min}</td><td>${s.max}</td></tr>`
          ).join('')}</tbody>
        </table>
      `;
    });
  });
}

// DATA PREVIEW TOOLTIP
const DATASETS_PREVIEW = {
  'encuesta_2024.csv': {
    columns: ['id', 'edad', 'educacion', 'ingreso', 'region'],
    rows: [
      [1, 25, 'Universitaria', 45000, 'Norte'],
      [2, 34, 'Preparatoria', 32000, 'Sur'],
      [3, 45, 'Universitaria', 58000, 'Centro'],
      [4, 28, 'Secundaria', 18000, 'Oriente'],
      [5, 52, 'Universitaria', 72000, 'Norte'],
      [6, 31, 'Preparatoria', 28000, 'Sur'],
      [7, 41, 'Universitaria', 51000, 'Centro'],
      [8, 26, 'Secundaria', 22000, 'Oriente'],
      [9, 38, 'Preparatoria', 35000, 'Norte'],
      [10, 29, 'Universitaria', 47000, 'Sur']
    ]
  },
  'panel_hogares.xlsx': {
    columns: ['hogar_id', 'integrantes', 'ingreso total', 'gasto', 'zona'],
    rows: [
      [1, 4, 35000, 28000, 'Urbana'],
      [2, 2, 42000, 31000, 'Rural'],
      [3, 5, 28000, 22000, 'Urbana'],
      [4, 3, 55000, 42000, 'Urbana'],
      [5, 6, 18000, 15000, 'Rural'],
      [6, 2, 65000, 48000, 'Urbana'],
      [7, 4, 31000, 25000, 'Urbana'],
      [8, 3, 44000, 36000, 'Rural']
    ]
  },
  'precios_hist.csv': {
    columns: ['producto', 'precio', 'mes', 'año'],
    rows: [
      ['Leche', 24.50, 'Ene', 2024],
      ['Pan', 18.00, 'Ene', 2024],
      ['Huevos', 45.00, 'Ene', 2024],
      ['Leche', 25.00, 'Feb', 2024],
      ['Pan', 18.50, 'Feb', 2024],
      ['Huevos', 46.00, 'Feb', 2024],
      ['Leche', 25.50, 'Mar', 2024],
      ['Pan', 19.00, 'Mar', 2024]
    ]
  }
};

function initDataPreview() {
  const tooltip = document.getElementById('dataPreviewTooltip');
  if (!tooltip) return;
  const titleEl = document.getElementById('previewTitle');
  const tableEl = document.getElementById('previewTable');
  const tableRows = document.querySelectorAll('#datasetsTableBody tr');
  if (tableRows.length === 0) return;
  
  tableRows.forEach(row => {
    row.style.cursor = 'pointer';
    row.addEventListener('mouseenter', e => {
      const name = row.cells[0].textContent;
      const data = DATASETS_PREVIEW[name];
      if (!data) return;
      
      titleEl.textContent = `Vista previa: ${name} (${data.rows.length} filas)`;
      
      tableEl.innerHTML = `<thead><tr>${data.columns.map(c => `<th>${c}</th>`).join('')}</tr></thead>
        <tbody>${data.rows.slice(0, 8).map(row => 
          `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`
        ).join('')}</tbody>`;
      
      const rect = row.getBoundingClientRect();
      
      let leftPos = e.clientX + 15;
      let tooltipWidth = 320;
      if (leftPos + tooltipWidth > window.innerWidth) {
        leftPos = e.clientX - tooltipWidth - 15;
      }
      
      tooltip.style.left = leftPos + 'px';
      tooltip.style.top = (e.clientY + 15) + 'px';
      tooltip.classList.add('visible');
    });
    
    row.addEventListener('mouseleave', () => {
      tooltip.classList.remove('visible');
    });
  });
}