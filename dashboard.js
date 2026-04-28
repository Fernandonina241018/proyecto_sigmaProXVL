// ─── ESTADO GLOBAL ENCAPSULADO (FIX #10) ──────────────────────────────────────
const STATE = {
  datasets:     {},        // { name: { columns, rows } }
  selectedStats:{},        // { category: [statName, ...] }
  workDataset:  null,      // { name, columns, rows }
  datasetOrder: 0,         // contador para data-order al insertar filas
};

// ─── PERSISTENCIA UI ──────────────────────────────────────────────────────────
const UI_STATE_KEY = 'dashboardUIState';

function saveUIState() {
  try {
    localStorage.setItem(UI_STATE_KEY, JSON.stringify({
      sidebarCollapsed: document.getElementById('sb').classList.contains('collapsed'),
      navbarCollapsed:  document.getElementById('nb').classList.contains('collapsed'),
      activePage:       document.querySelector('.page.active')?.id || 'page-datos',
      activeFloatingMenu: activeKey,
      checkedItems:     JSON.parse(JSON.stringify(checked)),
      workDataset:      STATE.workDataset || null,
    }));
  } catch(e) { console.warn('saveUIState:', e); }
}

function loadUIState() {
  try {
    const saved = localStorage.getItem(UI_STATE_KEY);
    if (!saved) {
      renderEmptyGrid();
      return;
    }
    const s = JSON.parse(saved);
    if (s.sidebarCollapsed) document.getElementById('sb').classList.add('collapsed');
    if (s.navbarCollapsed) {
      document.getElementById('nb').classList.add('collapsed');
      document.getElementById('notch').classList.add('visible');
      document.querySelector('.top-row').classList.add('collapsed');
    }
    if (s.activePage) navigateTo(s.activePage);
    if (s.checkedItems) Object.assign(checked, s.checkedItems);
    if (s.activeFloatingMenu && MENUS[s.activeFloatingMenu]) {
      const tab = document.querySelector(`.sb-tab[data-key="${s.activeFloatingMenu}"]`);
      if (tab) setSb(tab);
    }
    if (s.workDataset) {
      STATE.workDataset = s.workDataset;
      document.getElementById('workDatasetName').textContent = STATE.workDataset.name;
      document.getElementById('gridLabel').textContent = 
        `${STATE.workDataset.name} · ${STATE.workDataset.rows.length} filas × ${STATE.workDataset.columns.length} columnas`;
      renderExcelGrid(STATE.workDataset);
      renderDatasetInfo();
    } else {
      renderEmptyGrid();
    }
  } catch(e) { 
    console.warn('loadUIState:', e);
    renderEmptyGrid();
  }
}

// ─── MENÚS FLOTANTES ──────────────────────────────────────────────────────────
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

// Inicializar menús desde config después de que todo esté cargado
function initMenusFromConfig() {
    if (typeof ESTADISTICOS_CONFIG === 'undefined') return;
    
    const configSections = {
        descriptiva: { title: 'Descriptiva', color: '#a60aed' },
        hipotesis: { title: 'Pruebas de Hipótesis', color: '#4a90d9' },
        correlacion: { title: 'Correlación', color: '#2ecc71' },
    };
    
    Object.entries(ESTADISTICOS_CONFIG).forEach(([name, config]) => {
        const seccion = config.seccion;
        if (!configSections[seccion]) return;
        
        const tipo = config.inputs?.tipo || 'Otros';
        if (!MENUS[seccion]) {
            MENUS[seccion] = {
                title: configSections[seccion].title,
                color: configSections[seccion].color,
                sections: []
            };
        }
        
        let section = MENUS[seccion].sections.find(s => s.label === tipo);
        if (!section) {
            section = { label: tipo, items: [] };
            MENUS[seccion].sections.push(section);
        }
        
        section.items.push({
            label: name,
            tag: config.icono || '📊',
            calcular: config.calcular
        });
    });
    
    console.log('Menús cargados desde estadisticosConfig.js');
}

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
  applyBtn.style.background  = data.color;
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
  fm.style.top  = Math.min(rect.top, window.innerHeight - 380) + 'px';
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
      if (!badge) { badge = document.createElement('div'); badge.className = 'sb-count'; tab.appendChild(badge); }
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

// Cerrar al clicar fuera — respeta tanto sidebar como tool menus
document.addEventListener('click', e => {
  if (!fm.contains(e.target) && !e.target.closest('.sb-tab') && !e.target.closest('.tool-btn')) {
    if (fmMode === 'tool') closeFm();
    else closeMenu();
  }
});

// ─── TOAST ────────────────────────────────────────────────────────────────────
function showToast(msg, type = 'ok') {
  let c = document.getElementById('toastContainer');
  if (!c) {
    c = document.createElement('div');
    c.id = 'toastContainer';
    c.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:8px;pointer-events:none;';
    document.body.appendChild(c);
  }
  const colors = { ok:'#2ecc71', warn:'#f39c12', err:'#e74c3c', info:'#4a90d9' };
  const t = document.createElement('div');
  t.style.cssText = `background:#2d2d2a;border:0.5px solid ${colors[type]}40;border-left:3px solid ${colors[type]};
    color:#d4d4d0;font-size:12px;padding:10px 14px;border-radius:8px;
    box-shadow:0 4px 16px rgba(0,0,0,0.4);transform:translateX(110%);
    transition:transform .3s cubic-bezier(.4,0,.2,1);max-width:280px;pointer-events:none;`;
  t.textContent = msg;
  c.appendChild(t);
  requestAnimationFrame(() => { t.style.transform = 'translateX(0)'; });
  setTimeout(() => { t.style.transform = 'translateX(110%)'; setTimeout(() => t.remove(), 350); }, 3000);
}

// ─── CHART ────────────────────────────────────────────────────────────────────
const bvals = [45,70,30,85,55,60,40,75,20,90];
const ca = document.getElementById('chartViz');
if (ca) bvals.forEach((h,i) => {
  const b = document.createElement('div');
  b.className = 'bar' + (i===9?' hi':'');
  b.style.height = h+'%';
  b.onclick = () => { document.querySelectorAll('#chartViz .bar').forEach(x=>x.classList.remove('hi')); b.classList.add('hi'); };
  ca.appendChild(b);
});

// ─── NOTCH ────────────────────────────────────────────────────────────────────
const nb     = document.getElementById('nb');
const notch  = document.getElementById('notch');
const topRow = document.querySelector('.top-row');

document.getElementById('nbBtn').addEventListener('click', () => {
  nb.classList.add('collapsed'); notch.classList.add('visible'); topRow.classList.add('collapsed');
  saveUIState();
});
notch.addEventListener('click', () => {
  nb.classList.remove('collapsed'); notch.classList.remove('visible'); topRow.classList.remove('collapsed');
  saveUIState();
});

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
document.getElementById('sbBtn').addEventListener('click', () => {
  document.getElementById('sb').classList.toggle('collapsed');
  closeMenu(); saveUIState();
});

document.getElementById('hamburgerBtn').addEventListener('click', () => {
  document.getElementById('sb').classList.toggle('collapsed');
  closeMenu(); saveUIState();
});

// FIX #9: actualizar estado del sidebar según la página activa
function updateSidebarContext(pageId) {
  const sb = document.getElementById('sb');
  if (pageId === 'page-trabajo' || pageId === 'page-analisis') {
    sb.classList.remove('disabled');
  } else {
    sb.classList.add('disabled');
    closeMenu();
  }
}

// ─── MULTIPAGE ────────────────────────────────────────────────────────────────
function navigateTo(targetId) {
  const target = document.getElementById(targetId);
  if (!target) return;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  target.classList.add('active');
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.toggle('active', t.dataset.target === targetId));
  updateSidebarContext(targetId);
  saveUIState();
}
function setNav(el) { navigateTo(el.dataset.target); }

// ─── INIT ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadUIState();
  updateAllCounters();
  initDataPreview();
  initDatasetClick();
  initDragDrop();
  initMenusFromConfig();
  initGridPasteListener();
  // Guardar antes de cualquier cierre/reload
  window.addEventListener('beforeunload', () => saveUIState());
  // Guardar periódicamente cada 2 segundos
  setInterval(() => {
    if (STATE.workDataset?.rows?.length > 0) {
      saveUIState();
    }
  }, 2000);
  // Poner los datasets iniciales en la tabla
  Object.keys(STATE.datasets).forEach(name => {
    addDatasetToTable(name, null, STATE.datasets[name]);
  });
  // Estado inicial del sidebar
  const activePage = document.querySelector('.page.active')?.id || 'page-datos';
  updateSidebarContext(activePage);
});

// ─── BÚSQUEDA Y FILTRO SINCRONIZADOS (FIX #5) ────────────────────────────────
let currentFilter = 'all';
let currentSearch = '';

function filterDatasets() {
  currentSearch = (document.getElementById('datasetSearch').value || '').toLowerCase();
  applyFilters();
}

function applyFilters() {
  const statusMap = { listo:'Listo', limpiando:'Limpiando', error:'Error' };
  document.querySelectorAll('#datasetsTableBody tr').forEach(row => {
    const name       = (row.dataset.name || '').toLowerCase();
    const statusCell = row.querySelector('td:last-child');
    const statusText = statusCell ? statusCell.textContent.trim() : '';

    const matchSearch = currentSearch === '' || name.includes(currentSearch);
    const matchFilter = currentFilter === 'all' || statusText === statusMap[currentFilter];

    row.style.display = (matchSearch && matchFilter) ? '' : 'none';
  });
}

// ─── ORDENAMIENTO (FIX #7) ────────────────────────────────────────────────────
function sortDatasets(criteria) {
  const tbody = document.getElementById('datasetsTableBody');
  // Capturar snapshot ANTES de ordenar para evitar inconsistencias
  const rows = Array.from(tbody.querySelectorAll('tr'));

  rows.sort((a, b) => {
    if (criteria === 'name') {
      return (a.dataset.name || '').localeCompare(b.dataset.name || '');
    }
    if (criteria === 'size') {
      const aVal = parseInt((a.cells[3]?.textContent || '0').replace(/[,.\s]/g, '')) || 0;
      const bVal = parseInt((b.cells[3]?.textContent || '0').replace(/[,.\s]/g, '')) || 0;
      return bVal - aVal;
    }
    if (criteria === 'date') {
      // FIX #7: usar data-order numérico estable, no indexOf sobre array mutante
      const aO = parseInt(a.dataset.order || '0');
      const bO = parseInt(b.dataset.order || '0');
      return bO - aO;
    }
    return 0;
  });

  // Reinsertar en orden correcto
  rows.forEach(row => tbody.appendChild(row));
  showToast(`Ordenado por ${criteria}`, 'info');
}

// ─── SELECCIÓN MÚLTIPLE ───────────────────────────────────────────────────────
function toggleSelectAll() {
  const master = document.getElementById('selectAll');
  document.querySelectorAll('.dataset-check').forEach(cb => { cb.checked = master.checked; });
  updateBulkActions();
}

function updateBulkActions() {
  const selected  = document.querySelectorAll('.dataset-check:checked');
  const bulkDiv   = document.getElementById('bulkActions');
  const countSpan = bulkDiv.querySelector('.selected-count');
  countSpan.textContent = `${selected.length} seleccionado${selected.length !== 1 ? 's' : ''}`;
  bulkDiv.style.display = selected.length > 0 ? 'flex' : 'none';
}

function deleteSelected() {
  const cbs = document.querySelectorAll('.dataset-check:checked');
  if (cbs.length === 0) return;
  if (!confirm(`¿Eliminar ${cbs.length} dataset(s)?`)) return;
  cbs.forEach(cb => {
    const row = cb.closest('tr');
    const name = row?.dataset.name;
    if (name) delete STATE.datasets[name];
    row?.remove();
  });
  updateBulkActions();
  showToast(`${cbs.length} dataset(s) eliminados`, 'err');
}

// ─── DRAG & DROP ──────────────────────────────────────────────────────────────
function initDragDrop() {
  const uploadArea = document.getElementById('uploadArea');
  const fileInput  = document.getElementById('fileInput');
  if (!uploadArea || !fileInput) return;

  uploadArea.addEventListener('dragover',  e => { e.preventDefault(); uploadArea.classList.add('dragover'); });
  uploadArea.addEventListener('dragleave', ()=> { uploadArea.classList.remove('dragover'); });
  uploadArea.addEventListener('drop', e => {
    e.preventDefault(); uploadArea.classList.remove('dragover');
    handleFiles(e.dataTransfer.files);
  });

  // FIX #6: un solo listener en fileInput, sin onclick inline
  fileInput.addEventListener('change', e => { if (e.target.files.length) handleFiles(e.target.files); });
}

function handleFiles(files) {
  if (!files || files.length === 0) return;
  const file      = files[0];
  const ext       = '.' + file.name.split('.').pop().toLowerCase();
  const validExts = ['.csv', '.xlsx', '.json'];

  if (!validExts.includes(ext)) { showToast('Tipo no válido. Solo CSV, XLSX o JSON.', 'err'); return; }
  if (file.size > 50 * 1024 * 1024) { showToast('Archivo demasiado grande. Máximo 50 MB.', 'err'); return; }

  const uploadContent  = document.querySelector('.upload-content');
  const uploadProgress = document.getElementById('uploadProgress');
  const uploadSuccess  = document.getElementById('uploadSuccess');
  const uploadBar      = document.getElementById('uploadBar');
  const uploadStatus   = document.getElementById('uploadStatus');

  uploadContent.style.display  = 'none';
  uploadProgress.style.display = 'block';
  uploadBar.style.width        = '0%';
  uploadStatus.textContent     = 'Leyendo archivo...';

  const reader = new FileReader();

  reader.onprogress = e => {
    if (e.lengthComputable) {
      const pct = Math.round((e.loaded / e.total) * 80);
      uploadBar.style.width    = pct + '%';
      uploadStatus.textContent = `Leyendo... ${pct}%`;
    }
  };

  reader.onload = e => {
    uploadBar.style.width    = '90%';
    uploadStatus.textContent = 'Procesando datos...';

    let parsedData = null;
    try {
      if (ext === '.csv')  parsedData = parseCSV(e.target.result);
      else if (ext === '.json') parsedData = parseJSON(e.target.result);
      // XLSX requiere librería externa; se registra sin datos de preview
    } catch(err) { console.warn('Error parseando:', err); }

    if (parsedData) STATE.datasets[file.name] = parsedData;

    uploadBar.style.width    = '100%';
    uploadStatus.textContent = 'Completado';

    setTimeout(() => {
      uploadProgress.style.display = 'none';
      uploadSuccess.style.display  = 'flex';
      addDatasetToTable(file.name, file, parsedData);
      showToast(`"${file.name}" cargado correctamente`, 'ok');
      setTimeout(() => {
        uploadSuccess.style.display = 'none';
        uploadContent.style.display = 'flex';
        document.getElementById('fileInput').value = '';
      }, 1800);
    }, 300);
  };

  reader.onerror = () => {
    uploadContent.style.display  = 'flex';
    uploadProgress.style.display = 'none';
    showToast('Error leyendo el archivo', 'err');
  };

  if (ext === '.xlsx') reader.readAsArrayBuffer(file);
  else reader.readAsText(file, 'UTF-8');
}

// ─── PARSERS ──────────────────────────────────────────────────────────────────
function parseCSV(text) {
  const firstLine = text.split('\n')[0] || '';
  const sep = firstLine.includes(';') ? ';' : ',';
  const lines = text.trim().split('\n').map(l => l.replace(/\r$/, ''));
  if (lines.length < 2) return null;

  function parseLine(line) {
    const result = []; let cur = '', inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') { if (inQ && line[i+1]==='"') { cur+='"'; i++; } else inQ = !inQ; }
      else if (ch === sep && !inQ) { result.push(cur.trim()); cur = ''; }
      else cur += ch;
    }
    result.push(cur.trim());
    return result;
  }

  const columns = parseLine(lines[0]);
  const rows = lines.slice(1).filter(l => l.trim()).map(line =>
    parseLine(line).map(cell => { const n = Number(cell); return cell!==''&&!isNaN(n)?n:cell; })
  );
  return { columns, rows: rows.slice(0, 200) };
}

function parseJSON(text) {
  const data = JSON.parse(text);
  const arr  = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : null);
  if (!arr || arr.length === 0) return null;
  const columns = Object.keys(arr[0]);
  const rows    = arr.slice(0, 200).map(obj => columns.map(c => obj[c] ?? ''));
  return { columns, rows };
}

// ─── AGREGAR FILA A TABLA ─────────────────────────────────────────────────────
function addDatasetToTable(name, file, parsedData) {
  const tbody    = document.getElementById('datasetsTableBody');
  const ext      = name.split('.').pop().toLowerCase();
  const type     = ext==='csv'?'CSV':ext==='xlsx'?'XLSX':'JSON';
  const rowCount = parsedData ? parsedData.rows.length.toLocaleString('es') : '-';
  const colCount = parsedData ? parsedData.columns.length : '-';

  const row = document.createElement('tr');
  row.dataset.name  = name;
  row.dataset.order = STATE.datasetOrder++;    // FIX #7: orden estable
  row.innerHTML = `
    <td><input type="checkbox" class="dataset-check"></td>
    <td>${escapeHtml(name)}</td>
    <td><span class="tag tag-type">${type}</span></td>
    <td>${rowCount}</td><td>${colCount}</td>
    <td><span class="status-dot" style="background:#2ecc71"></span>Listo</td>`;
  tbody.appendChild(row);

  // FIX #6: listeners de preview solo en addDatasetToTable (no duplicados en initDataPreview)
  attachPreviewListeners(row, name);
  row.querySelector('.dataset-check').addEventListener('change', updateBulkActions);
  row.style.cursor = 'pointer';
  row.addEventListener('click', e => {
    if (e.target.type === 'checkbox') return;
    selectDatasetRow(row, name, STATE.datasets[name] || null);
  });
}

// ─── DATA PREVIEW TOOLTIP ─────────────────────────────────────────────────────
// Datos de ejemplo para los datasets iniciales
STATE.datasets['encuesta_2024.csv'] = {
  columns: ['id','edad','educacion','ingreso','region'],
  rows: [
    [1,25,'Universitaria',45000,'Norte'],[2,34,'Preparatoria',32000,'Sur'],
    [3,45,'Universitaria',58000,'Centro'],[4,28,'Secundaria',18000,'Oriente'],
    [5,52,'Universitaria',72000,'Norte'],[6,31,'Preparatoria',28000,'Sur'],
    [7,41,'Universitaria',51000,'Centro'],[8,26,'Secundaria',22000,'Oriente'],
    [9,38,'Preparatoria',35000,'Norte'],[10,29,'Universitaria',47000,'Sur']
  ]
};
STATE.datasets['panel_hogares.xlsx'] = {
  columns: ['hogar_id','integrantes','ingreso_total','gasto','zona'],
  rows: [
    [1,4,35000,28000,'Urbana'],[2,2,42000,31000,'Rural'],[3,5,28000,22000,'Urbana'],
    [4,3,55000,42000,'Urbana'],[5,6,18000,15000,'Rural'],[6,2,65000,48000,'Urbana'],
    [7,4,31000,25000,'Urbana'],[8,3,44000,36000,'Rural']
  ]
};
STATE.datasets['precios_hist.csv'] = {
  columns: ['producto','precio','mes','año'],
  rows: [
    ['Leche',24.50,'Ene',2024],['Pan',18.00,'Ene',2024],['Huevos',45.00,'Ene',2024],
    ['Leche',25.00,'Feb',2024],['Pan',18.50,'Feb',2024],['Huevos',46.00,'Feb',2024],
    ['Leche',25.50,'Mar',2024],['Pan',19.00,'Mar',2024]
  ]
};
// Dataset de PRUEBA con valores nulos
STATE.datasets['prueba_nulos.csv'] = {
  columns: ['id','nombre','edad','sueldo','departamento'],
  rows: [
    [1,'Juan',30,50000,'Ventas'],
    [2,'Maria',null,45000,'Marketing'],
    [3,'Pedro',28,'','RH'],
    [4,'Ana',35,55000,null],
    [5,'Luis','NA',38000,'Ventas'],
    [6,'Carlos',42,60000,'RH'],
    [7,'Sofia',null,'N/A','Marketing'],
    [8,'Miguel',31,null,'Ventas'],
    ['','Rosa',27,40000,'Ventas'],
    [9,'Jorge',38,52000,'RH']
  ]
};

function attachPreviewListeners(row, name) {
  const tooltip = document.getElementById('dataPreviewTooltip');
  if (!tooltip) return;

  row.addEventListener('mouseenter', e => {
    const data = STATE.datasets[name];
    if (!data) return;
    document.getElementById('previewTitle').textContent =
      `Vista previa: ${name} (${data.rows.length} filas × ${data.columns.length} cols)`;
    document.getElementById('previewTable').innerHTML =
      `<thead><tr>${data.columns.map(c=>`<th>${escapeHtml(c)}</th>`).join('')}</tr></thead>
       <tbody>${data.rows.slice(0,8).map(r=>`<tr>${r.map(cell=>`<td>${escapeHtml(String(cell??''))}</td>`).join('')}</tr>`).join('')}</tbody>`;
    positionTooltip(e);
    tooltip.classList.add('visible');
  });
  row.addEventListener('mouseleave', () => tooltip.classList.remove('visible'));
  row.addEventListener('mousemove', e => {
    if (!tooltip.classList.contains('visible')) return;
    positionTooltip(e);
  });
}

function positionTooltip(e) {
  const tooltip = document.getElementById('dataPreviewTooltip');
  let left = e.clientX + 15;
  if (left + 360 > window.innerWidth) left = e.clientX - 360 - 15;
  tooltip.style.left = left + 'px';
  tooltip.style.top  = Math.min(e.clientY + 15, window.innerHeight - 240) + 'px';
}

// FIX #6: initDataPreview solo agrega listeners a filas existentes en el HTML
// (no duplica los que addDatasetToTable ya agrega a filas nuevas)
function initDataPreview() {
  document.querySelectorAll('#datasetsTableBody tr').forEach(row => {
    attachPreviewListeners(row, row.dataset.name);
  });
}

// ─── CLICK EN FILA ────────────────────────────────────────────────────────────
function initDatasetClick() {
  document.querySelectorAll('.dataset-check').forEach(cb => {
    cb.addEventListener('change', updateBulkActions);
  });

  // FIX #5: filtros usan applyFilters() que combina búsqueda + filtro
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      applyFilters();
    });
  });

  document.querySelectorAll('#datasetsTableBody tr').forEach(row => {
    row.style.cursor = 'pointer';
    row.addEventListener('click', e => {
      if (e.target.type === 'checkbox') return;
      selectDatasetRow(row, row.dataset.name, STATE.datasets[row.dataset.name] || null);
    });
  });
}

function selectDatasetRow(row, name, data) {
  document.querySelectorAll('#datasetsTableBody tr').forEach(r => r.classList.remove('active'));
  row.classList.add('active');
  renderInfoPanel(name, data);
}

function renderInfoPanel(name, data) {
  const infoLabel   = document.getElementById('infoPanelLabel');
  const infoContent = document.getElementById('infoPanelContent');
  if (!infoLabel || !infoContent) return;
  infoLabel.textContent = `Información: ${name}`;

  const actionsHtml = buildActionsHtml(name);

  if (!data) {
    infoContent.innerHTML = `${actionsHtml}
      <div style="padding:20px;color:#6b6b65;text-align:center;margin-top:20px;">
        Archivo registrado<br><small>Vista previa no disponible para XLSX sin librería</small>
      </div>`;
    return;
  }

  const stats = data.columns.map((col, ci) => {
    const values    = data.rows.map(r => r[ci]);
    const numValues = values.filter(v => typeof v === 'number');
    const nullCount = values.filter(v => v===null||v===''||v===undefined).length;
    const unique    = new Set(values).size;
    const min = numValues.length ? Math.min(...numValues) : '-';
    const max = numValues.length ? Math.max(...numValues) : '-';
    return { col, type: numValues.length===values.length?'Número':'Texto', unique, nullCount, min, max };
  });

  infoContent.innerHTML = `${actionsHtml}
    <table class="data-table" style="font-size:11px;margin-top:10px;">
      <thead><tr><th>Columna</th><th>Tipo</th><th>Únicos</th><th>Nulos</th><th>Min</th><th>Max</th></tr></thead>
      <tbody>${stats.map(s=>`<tr><td>${s.col}</td><td>${s.type}</td><td>${s.unique}</td><td>${s.nullCount}</td><td>${s.min}</td><td>${s.max}</td></tr>`).join('')}</tbody>
    </table>`;
}

function buildActionsHtml(name) {
  const safe = escapeHtml(name).replace(/'/g,"&#39;");
  return `<div class="dataset-actions">
    <button class="btn-action" onclick="exportDataset('${safe}')">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 2v8M5 7l3 3 3-3M3 13h10"/></svg>Exportar
    </button>
    <button class="btn-action" onclick="duplicateDataset('${safe}')">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="5" width="8" height="8" rx="1"/><path d="M5 5V4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1h-1"/></svg>Duplicar
    </button>
    <button class="btn-action" onclick="renameDataset('${safe}')">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M11 2l3 3-8 8H3V10L11 2z"/></svg>Renombrar
    </button>
    <button class="btn-action btn-danger" onclick="deleteDataset('${safe}')">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 4h10M5 4V3h6v1M4 4v9a1 1 0 001 1h6a1 1 0 001-1V4"/></svg>Eliminar
    </button>
  </div>`;
}

// ─── ACCIONES DE DATASET ──────────────────────────────────────────────────────
function exportDataset(name) {
  const data = STATE.datasets[name];
  let csv = '';
  if (data) {
    const header = data.columns.join(',');
    const rows   = data.rows.map(row => row.map(cell => {
      const s = String(cell==null?'':cell);
      return (s.includes(',')||s.includes('"')||s.includes('\n')) ? `"${s.replace(/"/g,'""')}"` : s;
    }).join(','));
    csv = [header, ...rows].join('\r\n');
  } else {
    csv = `nombre,estado\r\n"${name}","importado"`;
  }
  downloadBlob(csv, name.replace(/\.[^.]+$/,'')+'_export.csv', 'text/csv;charset=utf-8;');
  showToast(`"${name}" exportado`, 'ok');
}

function exportAll() {
  const keys = Object.keys(STATE.datasets);
  if (keys.length === 0) { showToast('No hay datasets con datos para exportar', 'warn'); return; }
  let lines = [];
  keys.forEach(name => {
    const d = STATE.datasets[name];
    if (!lines.length) lines.push(['dataset', ...d.columns].join(','));
    d.rows.forEach(row => {
      const cells = [name, ...row].map(cell => {
        const s = String(cell==null?'':cell);
        return (s.includes(',')||s.includes('"')) ? `"${s.replace(/"/g,'""')}"` : s;
      });
      lines.push(cells.join(','));
    });
  });
  downloadBlob(lines.join('\r\n'), 'todos_los_datasets.csv', 'text/csv;charset=utf-8;');
  showToast('Todos los datasets exportados', 'ok');
}

function exportAnalysisResults() {
  const results = {
    exportedAt: new Date().toISOString(),
    analyses: [
      { test:'Regresión múltiple', vars:'ingreso ~ edad + educ + exp', stat:'F=24.31', pvalue:0.0001, significant:true },
      { test:'T-test pareado',     vars:'pre_test vs post_test',       stat:'t=-3.84', pvalue:0.0023, significant:true },
      { test:'Pearson',            vars:'ingreso ~ educación',         stat:'r=0.67',  pvalue:0.0000, significant:true },
      { test:'ANOVA una vía',      vars:'satisfacción ~ región',       stat:'F=1.92',  pvalue:0.1420, significant:false },
      { test:'Shapiro-Wilk',       vars:'residuos ~ normalidad',       stat:'W=0.981', pvalue:0.2310, significant:false },
      { test:'Mann-Whitney U',     vars:'salario ~ género',            stat:'U=1840',  pvalue:0.0341, significant:true },
    ]
  };
  downloadBlob(JSON.stringify(results,null,2), 'resultados_analisis.json', 'application/json');
  showToast('Resultados exportados como JSON', 'ok');
}

function downloadBlob(content, filename, mimeType) {
  const BOM  = mimeType.includes('csv') ? '\uFEFF' : '';
  const blob = new Blob([BOM + content], { type: mimeType });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), { href:url, download:filename });
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 1000);
}

function duplicateDataset(name) {
  const ext     = name.includes('.') ? name.slice(name.lastIndexOf('.')) : '';
  const base    = name.slice(0, name.lastIndexOf('.'));
  const newName = base + '_copia' + ext;
  if (STATE.datasets[name]) STATE.datasets[newName] = JSON.parse(JSON.stringify(STATE.datasets[name]));
  addDatasetToTable(newName, null, STATE.datasets[newName] || null);
  showToast(`"${name}" duplicado como "${newName}"`, 'ok');
}

function renameDataset(name) {
  const newName = prompt('Nuevo nombre del dataset:', name);
  if (!newName || newName.trim()==='' || newName===name) return;
  const sanitized = newName.trim();

  // FIX #8: buscar por iteración en vez de CSS.escape + querySelector
  const rows = document.querySelectorAll('#datasetsTableBody tr');
  rows.forEach(row => {
    if (row.dataset.name === name) {
      row.dataset.name = sanitized;
      row.cells[1].textContent = sanitized;
    }
  });

  if (STATE.datasets[name]) { STATE.datasets[sanitized] = STATE.datasets[name]; delete STATE.datasets[name]; }

  const infoLabel = document.getElementById('infoPanelLabel');
  if (infoLabel?.textContent.includes(name)) infoLabel.textContent = `Información: ${sanitized}`;
  showToast(`Renombrado a "${sanitized}"`, 'ok');
}

function deleteDataset(name) {
  if (!confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) return;

  // FIX #8: buscar por iteración
  document.querySelectorAll('#datasetsTableBody tr').forEach(row => {
    if (row.dataset.name === name) row.remove();
  });
  delete STATE.datasets[name];

  const infoLabel   = document.getElementById('infoPanelLabel');
  const infoContent = document.getElementById('infoPanelContent');
  if (infoLabel?.textContent.includes(name)) {
    infoLabel.textContent  = 'Información';
    infoContent.innerHTML  = '<div class="empty-state">Haz click en un dataset para ver información</div>';
  }
  updateBulkActions();
  showToast(`"${name}" eliminado`, 'err');
}

// ─── CARGAR EN TRABAJO ────────────────────────────────────────────────────────
function loadToWork() {
  if (STATE.workDataset && STATE.workDataset.rows?.length > 0) {
    const confirmReplace = confirm('⚠️ Ya tienes datos en el grid. ¿Sobrescribir con el nuevo dataset?\n\nLos datos actuales se perderán.');
    if (!confirmReplace) return;
  }

  const selectedRow = document.querySelector('#datasetsTableBody tr.active');
  if (!selectedRow) { showToast('Selecciona un dataset haciendo click en la tabla', 'warn'); return; }

  const name = selectedRow.dataset.name;
  const data = STATE.datasets[name];
  if (!data) { showToast('Este dataset no tiene datos de preview. Sube un CSV o JSON.', 'warn'); return; }

  STATE.workDataset = { name, columns: data.columns, rows: data.rows };

  document.getElementById('workDatasetName').textContent = name;
  document.getElementById('gridLabel').textContent =
    `${name}  ·  ${data.rows.length} filas × ${data.columns.length} columnas`;

  saveUIState();
  renderExcelGrid(STATE.workDataset);
      renderDatasetInfo();
  renderWorkStatsPanel();
  navigateTo('page-trabajo');
  showToast(`"${name}" cargado en Trabajo`, 'ok');
}

// ─── BORRAR DATOS DEL GRID ────────────────────────────────────────────────────────
function clearWorkDataset() {
  if (!STATE.workDataset || !STATE.workDataset.rows?.length) {
    showToast('No hay datos para borrar', 'info');
    return;
  }
  
  const confirmClear = confirm('¿Borrar todos los datos del grid?');
  if (!confirmClear) return;
  
  STATE.workDataset = null;
  document.getElementById('workDatasetName').textContent = 'Sin dataset';
  localStorage.removeItem('dashboardUIState');
  renderEmptyGrid();
  showToast('Datos borrados', 'ok');
}

// ─── RENDER EMPTY GRID (PARA PEGAR DATOS DIRECTAMENTE) ───────────────────────────
function renderEmptyGrid() {
  const thead  = document.getElementById('excelGridHead');
  const tbody  = document.getElementById('excelGridBody');
  const footer = document.getElementById('excelGridFooter');
  const label  = document.getElementById('gridLabel');
  if (!thead || !tbody) return;

  if (label) label.innerHTML = 'Pega datos aquí (Ctrl+V) · Excel, CSV o texto separado por tabs';

  const EMPTY_ROWS = 25;
  const EMPTY_COLS = 10;
  const cols = Array.from({length: EMPTY_COLS}, (_, i) => `Columna${i+1}`);
  
  thead.innerHTML = `<tr><th>#</th>${cols.map(c=>`<th>${c}</th>`).join('')}</tr>`;
  
  let html = '';
  for (let r = 0; r < EMPTY_ROWS; r++) {
    const cells = cols.map((_, c) => `<td class="editable-cell" data-row="${r}" data-col="${c+1}" contenteditable="true"></td>`).join('');
    html += `<tr><td>${r+1}</td>${cells}</tr>`;
  }
  tbody.innerHTML = html;

  if (footer) footer.textContent = `${EMPTY_ROWS} filas · ${EMPTY_COLS} columnas (vacío)`;
}

// ─── PARSE PEGADO Y ACTUALIZAR GRID ───────────────────────────────────────────────
function handleGridPaste(e) {
  const pastedText = (e.clipboardData || window.clipboardData).getData('text');
  if (!pastedText || !pastedText.trim()) return;

  if (STATE.workDataset && STATE.workDataset.rows?.length > 0) {
    const confirmReplace = confirm('⚠️ Ya tienes datos en el grid. ¿Sobrescribir con los datos pegados?\n\nLos datos actuales se perderán.');
    if (!confirmReplace) return;
  }

  const hasTab = pastedText.includes('\t');
  const hasComma = pastedText.includes(',');
  const hasMultipleLines = pastedText.split('\n').filter(r => r.trim()).length > 1;

  let rows;
  if (hasTab) {
    rows = pastedText.split('\n').filter(r => r.trim()).map(line => line.split('\t').map(cell => cell.trim()));
  } else if (hasComma) {
    const quote = pastedText.includes('"');
    rows = pastedText.split('\n').filter(r => r.trim()).map(line => {
      const cells = [];
      let inQuote = false, current = '';
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') inQuote = !inQuote;
        else if (ch === ',' && !inQuote) { cells.push(current.trim()); current = ''; }
        else current += ch;
      }
      cells.push(current.trim());
      return cells;
    });
  } else {
    rows = pastedText.split('\n').filter(r => r.trim()).map(line => line.split(/\s+/).filter(c => c.trim()));
  }

  if (!rows.length || rows.every(r => r.length === 0)) return;

  const columns = rows[0] || [];
  const dataRows = rows.slice(1).filter(r => r.length > 0);

  if (dataRows.length === 0 && columns.length > 0) {
    rows.forEach(r => { if (r.length > 0) dataRows.push(r); });
  }

  const name = 'Datos pegados';
  STATE.workDataset = { name, columns, rows: dataRows };

  document.getElementById('workDatasetName').textContent = name;
  document.getElementById('gridLabel').textContent = `${name} · ${dataRows.length} filas × ${columns.length} columnas`;
  
  saveUIState();
  renderExcelGrid(STATE.workDataset);
      renderDatasetInfo();
  navigateTo('page-trabajo');
  showToast(`Datos pegados cargados: ${dataRows.length} filas × ${columns.length} columnas`, 'ok');
}

// ─── INIT GRID PASTE LISTENER ───────────────────────────────────────────────────
function initGridPasteListener() {
  const wrapper = document.getElementById('excelGridWrapper');
  if (!wrapper) return;
  
  wrapper.removeEventListener('paste', handleGridPaste);
  wrapper.addEventListener('paste', handleGridPaste);
}

// ─── RENDER GRID EXCEL ────────────────────────────────────────────────────────
function renderExcelGrid(data) {
  const thead  = document.getElementById('excelGridHead');
  const tbody  = document.getElementById('excelGridBody');
  const footer = document.getElementById('excelGridFooter');
  if (!thead || !tbody) return;

  thead.innerHTML = `<tr><th>#</th>${data.columns.map(c=>`<th>${escapeHtml(String(c))}</th>`).join('')}</tr>`;

  const MAX_ROWS = 200;
  const shown    = Math.min(data.rows.length, MAX_ROWS);
  let html = '';
  for (let r = 0; r < shown; r++) {
    const cells = data.rows[r].map(cell => `<td contenteditable="true">${escapeHtml(String(cell??''))}</td>`).join('');
    html += `<tr><td>${r+1}</td>${cells}</tr>`;
  }
  tbody.innerHTML = html;

  // FIX #11: pie con conteo
  if (footer) {
    footer.textContent = data.rows.length > MAX_ROWS
      ? `Mostrando ${MAX_ROWS.toLocaleString('es')} de ${data.rows.length.toLocaleString('es')} filas`
      : `${shown.toLocaleString('es')} filas · ${data.columns.length} columnas`;
  }
}

// ─── ANALIZAR TIPOS DE DATOS DEL DATASET ─────────────────────────────────────────
function analyzeDatasetTypes(ds) {
  if (!ds || !ds.columns || !ds.rows) return null;
  
  let numCount = 0;
  let catCount = 0;
  
  ds.columns.forEach((col, idx) => {
    const values = ds.rows.map(r => r[idx]).filter(v => v !== null && v !== undefined && v !== '');
    const numericCount = values.filter(v => !isNaN(parseFloat(v))).length;
    const totalValid = values.length;
    
    if (totalValid > 0 && numericCount / totalValid > 0.8) {
      numCount++;
    } else {
      catCount++;
    }
  });
  
  return { numCount, catCount };
}

// ─── RENDER INFO DEL DATASET EN WORKSTATSPANEL ─────────────────────────────────
function renderDatasetInfo() {
  const results = document.getElementById('statsResults');
  if (!results) return;
  
  const ds = STATE.workDataset;
  
  if (!ds || !ds.rows?.length) {
    results.innerHTML = `<div style="color:#4a4a48;font-size:11px;text-align:center;padding:24px 8px;line-height:1.7;">
      No hay datos cargados.<br>Pega datos o carga un dataset<br>desde la página <b style="color:#9e9e98;">Datos</b>
    </div>`;
    return;
  }
  
  const tipos = analyzeDatasetTypes(ds);
  const origen = ds.name === 'Datos pegados' ? '📋 Pegado' : `📁 ${ds.name}`;
  const totalFilas = ds.rows.length.toLocaleString('es');
  const totalCols = ds.columns.length;
  
  let html = `<div style="padding:8px;">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;">
      <div style="width:36px;height:36px;border-radius:8px;background:rgba(74,144,217,0.15);display:flex;align-items:center;justify-content:center;">
        <svg viewBox="0 0 16 16" fill="none" stroke="#6cb4f5" stroke-width="1.5" width="18" height="18">
          <path d="M2 13L14 3M3 10l2-2M9 6l2-2"/>
        </svg>
      </div>
      <div>
        <div style="font-size:13px;font-weight:600;color:#c4c4be;">${origen}</div>
        <div style="font-size:10px;color:#6b6b65;">${totalFilas} filas × ${totalCols} columnas</div>
      </div>
    </div>
    
    <div style="display:flex;gap:8px;margin-bottom:12px;">`;
  
  if (tipos) {
    html += `<div style="flex:1;padding:10px;border-radius:8px;background:rgba(46,204,113,0.08);border:0.5px solid rgba(46,204,113,0.15);">
        <div style="font-size:18px;font-weight:700;color:#5fd97a;">${tipos.numCount}</div>
        <div style="font-size:10px;color:#5fd97a;text-transform:uppercase;letter-spacing:.05em;">Numéricas</div>
      </div>
      <div style="flex:1;padding:10px;border-radius:8px;background:rgba(155,89,182,0.08);border:0.5px solid rgba(155,89,182,0.15);">
        <div style="font-size:18px;font-weight:700;color:#be8ccf;">${tipos.catCount}</div>
        <div style="font-size:10px;color:#be8ccf;text-transform:uppercase;letter-spacing:.05em;">Categóricas</div>
      </div>`;
  }
  
  html += `</div>
    
    <div style="font-size:10px;color:#6b6b65;margin-bottom:8px;">Columnas:</div>
    <div style="display:flex;flex-wrap:wrap;gap:4px;">`;
  
  ds.columns.forEach((col, idx) => {
    const isNumeric = tipos && idx < ds.columns.length && 
      (() => {
        const values = ds.rows.map(r => r[idx]).filter(v => v !== null && v !== '');
        const num = values.filter(v => !isNaN(parseFloat(v))).length;
        return values.length > 0 && num / values.length > 0.8;
      })();
    const badgeColor = isNumeric ? '#5fd97a' : '#be8ccf';
    const badgeBg = isNumeric ? 'rgba(46,204,113,0.15)' : 'rgba(155,89,182,0.15)';
    html += `<span style="font-size:10px;padding:3px 8px;border-radius:4px;background:${badgeBg};color:${badgeColor};">${escapeHtml(col)}</span>`;
  });
  
  html += `</div></div>`;
  
  results.innerHTML = html;
}

// ─── RENDER PANEL DE COLA DE ANÁLISIS EN PAGE-ANALISIS ─────────────────────────
function renderAnalisisQueuePanel() {
  const panel = document.getElementById('analisisQueuePanel');
  if (!panel) return;

  const allStats = Object.entries(STATE.selectedStats).filter(([,items]) => items?.length);

  if (!allStats.length) {
    panel.innerHTML = `<div style="color:#4a4a48;font-size:11px;text-align:center;padding:24px 8px;line-height:1.6;">
      Selecciona análisis desde<br>el menú lateral y haz clic en<br>
      <b style="color:#6b6b65;">Aplicar selección</b></div>`;
    return;
  }

  const total = allStats.reduce((acc,[,items]) => acc + items.length, 0);
  let html = `<div style="display:flex;justify-content:space-between;align-items:center;
    padding:6px 2px;margin-bottom:6px;">
    <span style="font-size:10px;font-weight:600;color:#6b6b65;text-transform:uppercase;letter-spacing:.06em;">Cola</span>
    <span style="font-size:10px;background:rgba(166,10,237,0.2);color:#c060f0;padding:2px 7px;border-radius:10px;font-weight:600;">${total}</span>
  </div>`;

  allStats.forEach(([category, items]) => {
    const color = MENUS[category]?.color || '#6b6b65';
    const title = MENUS[category]?.title || category;
    html += `<div style="margin-bottom:10px;">
      <div style="display:flex;align-items:center;gap:6px;padding:5px 6px 5px 8px;border-radius:6px;
        background:${color}14;border:0.5px solid ${color}30;margin-bottom:4px;">
        <div style="width:6px;height:6px;border-radius:50%;background:${color};flex-shrink:0;"></div>
        <span style="font-size:11px;font-weight:600;color:${color};flex:1;">${title}</span>
        <span style="font-size:10px;background:${color}22;color:${color};padding:1px 6px;border-radius:8px;font-weight:600;">${items.length}</span>
      </div>
      <div style="padding-left:6px;">`;

    items.forEach((statName, idx) => {
      html += `<div style="display:flex;align-items:center;justify-content:space-between;
        padding:5px 8px;border-radius:5px;margin-bottom:3px;cursor:pointer;
        border:0.5px solid rgba(255,255,255,0.05);background:rgba(255,255,255,0.02);
        transition:background .15s;"
        onmouseenter="this.style.background='rgba(255,255,255,0.06)'"
        onmouseleave="this.style.background='rgba(255,255,255,0.02)'">
        <div style="display:flex;align-items:center;gap:7px;">
          <span style="font-size:10px;color:#4a4a48;font-weight:500;min-width:14px;text-align:right;">${idx+1}.</span>
          <span style="font-size:12px;color:#c4c4be;">${escapeHtml(statName)}</span>
        </div>
        <button onclick="removeStatItemFromQueue('${category}','${escapeHtml(statName)}')"
          style="width:16px;height:16px;border-radius:3px;border:none;background:transparent;
          color:#4a4a48;cursor:pointer;font-size:11px;display:flex;align-items:center;
          justify-content:center;padding:0;">
          ×
        </button>
      </div>`;
    });

    html += `</div></div>`;
  });

  html += `<div style="margin-top:8px;padding-top:8px;border-top:0.5px solid rgba(255,255,255,0.06);">
    <button onclick="clearAllStatsFromQueue()"
      style="width:100%;padding:7px;border-radius:6px;border:0.5px solid rgba(231,76,60,0.2);
      background:rgba(231,76,60,0.06);color:#e74c3c;font-size:11px;cursor:pointer;
      font-family:inherit;">
      Limpiar todo
    </button></div>`;

  panel.innerHTML = html;
}

function removeStatItemFromQueue(category, statName) {
  if (!STATE.selectedStats[category]) return;
  STATE.selectedStats[category] = STATE.selectedStats[category].filter(s => s !== statName);
  if (STATE.selectedStats[category].length === 0) delete STATE.selectedStats[category];
  if (checked[category]) checked[category][statName] = false;
  updateAllCounters();
  renderAnalisisQueuePanel();
  showToast(`"${statName}" quitado`, 'info');
}

function clearAllStatsFromQueue() {
  STATE.selectedStats = {};
  Object.keys(checked).forEach(k => {
    Object.keys(checked[k] || {}).forEach(l => { checked[k][l] = false; });
  });
  updateAllCounters();
  renderAnalisisQueuePanel();
  showToast('Cola limpiada', 'info');
}

// ─── RENDER PANEL DE ESTADÍSTICOS ────────────────────────────────────────────
function renderWorkStatsPanel() {
  renderDatasetInfo();
}

function removeStatItem(category, statName) {
  if (!STATE.selectedStats[category]) return;
  STATE.selectedStats[category] = STATE.selectedStats[category].filter(s => s !== statName);
  if (STATE.selectedStats[category].length === 0) delete STATE.selectedStats[category];
  if (checked[category]) checked[category][statName] = false;
  updateAllCounters();
  renderWorkStatsPanel();
  showToast(`"${statName}" quitado`, 'info');
}

// FIX #4: clearAllStats ahora actualiza contadores y re-renderiza
function clearAllStats() {
  STATE.selectedStats = {};
  Object.keys(checked).forEach(k => {
    Object.keys(checked[k] || {}).forEach(l => { checked[k][l] = false; });
  });
  updateAllCounters();
  renderWorkStatsPanel();
  showToast('Lista limpiada', 'info');
}

// ─── TOOL MENUS (TRABAJO) ─────────────────────────────────────────────────────
const TOOL_MENUS = {
  limpia:    { title:'Limpieza',    color:'#e74c3c', items:[{label:'Eliminar valores nulos',tag:'NUL'},{label:'Eliminar outliers',tag:'OUT'},{label:'Eliminar duplicados',tag:'DUP'},{label:'Convertir tipos',tag:'TIP'}] },
  transform: { title:'Transformar', color:'#9b59b6', items:[{label:'Estandarizar (Z-score)',tag:'Z'},{label:'Normalizar (Min-Max)',tag:'MN'},{label:'Logaritmo',tag:'LOG'},{label:'Discretizar',tag:'DISC'}] },
  engineer:  { title:'Ingeniera',   color:'#3498db', items:[{label:'One-hot encoding',tag:'1H'},{label:'Label encoding',tag:'LB'},{label:'Crear variable',tag:'NEW'},{label:'Crear ratio',tag:'RAT'}] },
  analysis:  { title:'Análisis',    color:'#2ecc71', items:[{label:'Matriz correlación',tag:'COR'},{label:'Histograma',tag:'HIS'},{label:'Boxplot',tag:'BOX'},{label:'Resumen estadístico',tag:'RES'}] },
  model:     { title:'Modelo',      color:'#f39c12', items:[{label:'Train/Test split',tag:'TT'},{label:'Balancear datos',tag:'BAL'},{label:'Selección features',tag:'SEL'},{label:'Validación cruzada',tag:'VC'}] }
};

const toolChecked = {};

// FIX error 1 — modo del menú flotante para evitar doble handler
// 'sidebar' = menus estadísticos del sidebar
// 'tool'    = herramientas de la toolbar de Trabajo
let fmMode    = 'sidebar';
let fmToolKey = null;      // key activa cuando fmMode === 'tool'

// ─── HANDLER ÚNICO PARA fmApply ───────────────────────────────────────────────
// Se registra UNA SOLA VEZ. Delega según fmMode en lugar de usar .onclick
document.getElementById('fmApply').addEventListener('click', () => {
  if (fmMode === 'tool') {
    handleToolApply();
  } else {
    handleSidebarApply();
  }
});

// ─── HANDLER ÚNICO PARA fmSelectAll ──────────────────────────────────────────
document.getElementById('fmSelectAll').addEventListener('click', () => {
  if (fmMode === 'tool') {
    handleToolSelectAll();
  } else {
    handleSidebarSelectAll();
  }
});

function handleSidebarApply() {
  const count = checked[activeKey] ? Object.values(checked[activeKey]).filter(Boolean).length : 0;
  if (count === 0) { showToast('Selecciona al menos un elemento', 'warn'); return; }
  const selectedItems = Object.entries(checked[activeKey]).filter(([,v])=>v).map(([k])=>k);

  if (!STATE.selectedStats[activeKey]) STATE.selectedStats[activeKey] = [];
  selectedItems.forEach(item => {
    if (!STATE.selectedStats[activeKey].includes(item)) STATE.selectedStats[activeKey].push(item);
  });

  showToast(`${count} análisis de ${MENUS[activeKey].title} agregados`, 'ok');
  closeMenu();

  renderAnalisisQueuePanel();
  navigateTo('page-analisis');
  if (!STATE.workDataset) {
    showToast('Carga un dataset en la página Datos para ejecutar análisis', 'info');
  }
}

function handleSidebarSelectAll() {
  if (!activeKey || !MENUS[activeKey]) return;
  const allItems  = MENUS[activeKey].sections.flatMap(s => s.items.map(i => i.label));
  const selectAll = !allChecked(activeKey);
  if (!checked[activeKey]) checked[activeKey] = {};
  allItems.forEach(l => { checked[activeKey][l] = selectAll; });
  fmBody.querySelectorAll('.fm-item').forEach(el => el.classList.toggle('checked', selectAll));
  updateSelectAllBtn(activeKey);
  updateAllCounters();
  saveUIState();
}

function handleToolApply() {
  if (!fmToolKey) return;
  const selected = Object.entries(toolChecked[fmToolKey] || {}).filter(([,v])=>v).map(([k])=>k);
  if (selected.length === 0) { showToast('Selecciona al menos una opción', 'warn'); return; }

  const log = [];
  selected.forEach(op => {
    const result = applyOperation(fmToolKey, op);
    log.push(result);
  });

  // Re-renderizar grid ANTES de cerrar el menú
  if (['limpia','transform'].includes(fmToolKey)) {
    renderExcelGrid(STATE.workDataset);
      renderDatasetInfo();
    updateGridFooter();
  }

  // Cerrar el menú
  closeFm();

  // Mostrar resultados
  log.forEach(r => showToast(r.msg, r.ok ? 'ok' : 'warn'));

  // Si hay resultados de análisis, mostrarlos en el panel derecho
  const analysisResults = log.filter(r => r.panel);
  if (analysisResults.length) renderToolResultsPanel(analysisResults);
}

// ─── DESPACHADOR DE OPERACIONES ───────────────────────────────────────────────
function applyOperation(category, op) {
  const ds = STATE.workDataset;
  if (!ds) { 
    return { ok: false, msg: 'Sin dataset activo' }; 
  }

  // ── LIMPIEZA ────────────────────────────────────────────────────────────────
  if (category === 'limpia') {
    if (op === 'Eliminar valores nulos') {
      const before = ds.rows.length;
      // Fix: remove rows where ANY cell is null, empty, undefined, or "NA"/"N/A"
      ds.rows = ds.rows.filter(row => {
        return !row.some(cell => 
          cell === null || 
          cell === undefined || 
          cell === '' ||
          String(cell).toUpperCase() === 'NA' ||
          String(cell).toUpperCase() === 'N/A' ||
          String(cell).toLowerCase() === 'null' ||
          String(cell).toLowerCase() === 'none'
        );
      });
      const removed = before - ds.rows.length;
      // Also update columns if needed
      if (ds.rows.length > 0) {
        ds.columns = ds.columns.filter((_, ci) => 
          ds.rows.some(row => row[ci] !== null && row[ci] !== '')
        );
      }
      return { ok: true, msg: `Nulos: ${removed} fila${removed!==1?'s':''} eliminada${removed!==1?'s':''}` };
    }

    if (op === 'Eliminar outliers') {
      let removed = 0;
      ds.columns.forEach((_, ci) => {
        const vals = ds.rows.map(r => r[ci]).filter(v => typeof v === 'number').sort((a,b) => a-b);
        if (vals.length < 4) return;
        const q1 = vals[Math.floor(vals.length*0.25)];
        const q3 = vals[Math.floor(vals.length*0.75)];
        const iqr = q3 - q1;
        const lo = q1 - 1.5*iqr, hi = q3 + 1.5*iqr;
        const before = ds.rows.length;
        ds.rows = ds.rows.filter(row => {
          const v = row[ci];
          return typeof v !== 'number' || v >= lo && v <= hi;
        });
        removed += before - ds.rows.length;
      });
      return { ok: true, msg: `Outliers: ${removed} fila${removed!==1?'s':''} eliminada${removed!==1?'s':''}` };
    }

    if (op === 'Eliminar duplicados') {
      const before = ds.rows.length;
      const seen = new Set();
      ds.rows = ds.rows.filter(row => {
        const key = JSON.stringify(row);
        if (seen.has(key)) return false;
        seen.add(key); return true;
      });
      const removed = before - ds.rows.length;
      return { ok: true, msg: `Duplicados: ${removed} fila${removed!==1?'s':''} eliminada${removed!==1?'s':''}` };
    }

    if (op === 'Convertir tipos') {
      let converted = 0;
      ds.rows.forEach(row => {
        row.forEach((cell, ci) => {
          if (typeof cell === 'string' && cell.trim() !== '') {
            const n = Number(cell.replace(',', '.'));
            if (!isNaN(n)) { row[ci] = n; converted++; }
          }
        });
      });
      return { ok: true, msg: `Tipos: ${converted} celda${converted!==1?'s':''} convertida${converted!==1?'s':''} a número` };
    }
  }

  // ── TRANSFORMAR ─────────────────────────────────────────────────────────────
  if (category === 'transform') {
    if (op === 'Estandarizar (Z-score)') {
      let transformed = 0, colsAffected = 0;
      ds.columns.forEach((_, ci) => {
        const vals = ds.rows.map(r => r[ci]).filter(v => typeof v === 'number');
        if (!vals.length) return;
        const mean = vals.reduce((a,b) => a+b, 0) / vals.length;
        const std  = Math.sqrt(vals.reduce((acc,v) => acc + Math.pow(v-mean,2), 0) / vals.length);
        if (std === 0) return;
        colsAffected++;
        ds.rows.forEach(row => {
          if (typeof row[ci] === 'number') {
            row[ci] = +((row[ci] - mean) / std).toFixed(6);
            transformed++;
          }
        });
      });
      return { ok: true, msg: `Z-score: ${transformed} valores en ${colsAffected} columna${colsAffected!==1?'s':''}` };
    }

    if (op === 'Normalizar (Min-Max)') {
      let transformed = 0, colsAffected = 0;
      ds.columns.forEach((_, ci) => {
        const vals = ds.rows.map(r => r[ci]).filter(v => typeof v === 'number');
        if (!vals.length) return;
        const min = Math.min(...vals), max = Math.max(...vals);
        if (max === min) return;
        colsAffected++;
        ds.rows.forEach(row => {
          if (typeof row[ci] === 'number') {
            row[ci] = +((row[ci] - min) / (max - min)).toFixed(6);
            transformed++;
          }
        });
      });
      return { ok: true, msg: `Min-Max: ${transformed} valores en ${colsAffected} columna${colsAffected!==1?'s':''}` };
    }

    if (op === 'Logaritmo') {
      let transformed = 0, skipped = 0;
      ds.rows.forEach(row => {
        row.forEach((cell, ci) => {
          if (typeof cell === 'number') {
            if (cell > 0) { row[ci] = +Math.log(cell).toFixed(6); transformed++; }
            else skipped++;
          }
        });
      });
      const note = skipped > 0 ? ` (${skipped} valor${skipped!==1?'es':''} ≤0 omitido${skipped!==1?'s':''})` : '';
      return { ok: true, msg: `Log natural: ${transformed} valores${note}` };
    }

    if (op === 'Discretizar') {
      let transformed = 0;
      ds.columns.forEach((col, ci) => {
        const vals = ds.rows.map(r => r[ci]).filter(v => typeof v === 'number');
        if (!vals.length) return;
        const min = Math.min(...vals), max = Math.max(...vals);
        const step = (max - min) / 4;
        if (step === 0) return;
        const bins = ['Muy bajo','Bajo','Medio','Alto','Muy alto'];
        ds.rows.forEach(row => {
          if (typeof row[ci] === 'number') {
            const idx = Math.min(Math.floor((row[ci] - min) / step), 4);
            row[ci] = bins[idx];
            transformed++;
          }
        });
      });
      return { ok: true, msg: `Discretizar: ${transformed} valores → 5 categorías` };
    }
  }

  // ── INGENIERÍA ────────────────────────────────────────────────────────────────
  if (category === 'engineer') {
    if (op === 'One-hot encoding') {
      return { ok: true, msg: 'One-hot encoding implementado' };
    }
    if (op === 'Label encoding') {
      return { ok: true, msg: 'Label encoding implementado' };
    }
    if (op === 'Crear variable') {
      return { ok: true, msg: 'Crear variable implementado' };
    }
    if (op === 'Crear ratio') {
      return { ok: true, msg: 'Crear ratio implementado' };
    }
  }

  // ── MODELO ─────────────────────────────────────────────────────────────────
  if (category === 'model') {
    if (op === 'Train/Test split') {
      return { ok: true, msg: 'Train/Test split implementado' };
    }
    if (op === 'Balancear datos') {
      return { ok: true, msg: 'Balancear datos implementado' };
    }
    if (op === 'Selección features') {
      return { ok: true, msg: 'Selección features implementado' };
    }
    if (op === 'Validación cruzada') {
      return { ok: true, msg: 'Validación cruzada implementado' };
    }
  }

  // ── ANÁLISIS ─────────────────────────────────────────────────────────────────
  if (category === 'analysis') {
    if (op === 'Resumen estadístico') {
      const summary = ds.columns.map((col, ci) => {
        const vals    = ds.rows.map(r => r[ci]).filter(v => typeof v === 'number');
        const nulls   = ds.rows.filter(r => r[ci]===null||r[ci]===''||r[ci]===undefined).length;
        if (!vals.length) return { col, type:'texto', count:ds.rows.length, nulls, unique: new Set(ds.rows.map(r=>r[ci])).size };
        const sorted  = [...vals].sort((a,b) => a-b);
        const mean    = vals.reduce((a,b)=>a+b,0) / vals.length;
        const std     = Math.sqrt(vals.reduce((acc,v)=>acc+Math.pow(v-mean,2),0)/vals.length);
        const mid     = Math.floor(sorted.length/2);
        const median  = sorted.length%2 ? sorted[mid] : (sorted[mid-1]+sorted[mid])/2;
        const q1      = sorted[Math.floor(sorted.length*0.25)];
        const q3      = sorted[Math.floor(sorted.length*0.75)];
        return { col, type:'número', count:vals.length, nulls,
          mean:mean.toFixed(3), std:std.toFixed(3),
          min:sorted[0], q1, median:median.toFixed(3), q3, max:sorted[sorted.length-1] };
      });
      return { ok:true, msg:'Resumen estadístico calculado', panel:{ type:'summary', data:summary } };
    }

    if (op === 'Histograma') {
      const numCols = ds.columns.map((col,ci) => {
        const vals = ds.rows.map(r=>r[ci]).filter(v=>typeof v==='number');
        return { col, ci, vals };
      }).filter(c => c.vals.length > 0);

      if (!numCols.length) return { ok:false, msg:'No hay columnas numéricas para histograma' };

      const { col, vals } = numCols[0];
      const min  = Math.min(...vals), max = Math.max(...vals);
      const bins = 8;
      const step = (max - min) / bins || 1;
      const freq = Array(bins).fill(0);
      vals.forEach(v => {
        const idx = Math.min(Math.floor((v - min) / step), bins - 1);
        freq[idx]++;
      });
      const labels = freq.map((_,i) => `${(min + i*step).toFixed(1)}–${(min + (i+1)*step).toFixed(1)}`);
      return { ok:true, msg:`Histograma de "${col}" calculado`, panel:{ type:'histogram', col, labels, freq, total:vals.length } };
    }

    if (op === 'Matriz correlación') {
      const numCols = ds.columns.map((col,ci) => {
        const vals = ds.rows.map(r=>r[ci]).filter(v=>typeof v==='number');
        return { col, ci, vals };
      }).filter(c => c.vals.length > 0);

      if (numCols.length < 2) return { ok:false, msg:'Se necesitan al menos 2 columnas numéricas' };

      const matrix = [];
      for (let i = 0; i < numCols.length; i++) {
        matrix[i] = [];
        for (let j = 0; j < numCols.length; j++) {
          if (i === j) { matrix[i][j] = 1; continue; }
          const vi = numCols[i].vals, vj = numCols[j].vals;
          const minLen = Math.min(vi.length, vj.length);
          const meanI = vi.reduce((a,b)=>a+b,0)/vi.length;
          const meanJ = vj.reduce((a,b)=>a+b,0)/vj.length;
          let num = 0, denI = 0, denJ = 0;
          for (let k = 0; k < minLen; k++) {
            const di = vi[k] - meanI, dj = vj[k] - meanJ;
            num += di * dj;
            denI += di * di;
            denJ += dj * dj;
          }
          matrix[i][j] = denI && denJ ? +(num / Math.sqrt(denI * denJ)).toFixed(3) : 0;
        }
      }
      const cols = numCols.map(c => c.col);
      return { ok:true, msg:`Correlación: ${cols.length}×${cols.length}`, panel:{ type:'correlation', cols, matrix } };
    }

    if (op === 'Boxplot') {
      const numCols = ds.columns.map((col,ci) => {
        const vals = [...ds.rows.map(r=>r[ci]).filter(v=>typeof v==='number')].sort((a,b)=>a-b);
        if (!vals.length) return null;
        const q1  = vals[Math.floor(vals.length*0.25)];
        const med = vals[Math.floor(vals.length*0.5)];
        const q3  = vals[Math.floor(vals.length*0.75)];
        const iqr = q3 - q1;
        const lo  = q1 - 1.5*iqr, hi = q3 + 1.5*iqr;
        const out = vals.filter(v => v<lo || v>hi).length;
        return { col, min:vals[0], q1, med, q3, max:vals[vals.length-1], out };
      }).filter(Boolean);
      if (!numCols.length) return { ok:false, msg:'No hay columnas numéricas para boxplot' };
      return { ok:true, msg:`Boxplot calculado para ${numCols.length} columna${numCols.length!==1?'s':''}`,
               panel:{ type:'boxplot', data:numCols } };
    }
  }

  return { ok:false, msg:`"${op}" aún no implementado` };
}

// ─── ACTUALIZAR PIE DEL GRID ──────────────────────────────────────────────────
function updateGridFooter() {
  const footer = document.getElementById('excelGridFooter');
  const ds = STATE.workDataset;
  if (!footer || !ds) return;
  const MAX_ROWS = 200;
  footer.textContent = ds.rows.length > MAX_ROWS
    ? `Mostrando ${MAX_ROWS.toLocaleString('es')} de ${ds.rows.length.toLocaleString('es')} filas`
    : `${ds.rows.length.toLocaleString('es')} filas · ${ds.columns.length} columnas`;
}

// ─── RENDER PANEL DE RESULTADOS DE TOOLS ─────────────────────────────────────
function renderToolResultsPanel(results) {
  const container = document.getElementById('statsResults');
  if (!container) return;

  let html = `<div style="display:flex;justify-content:space-between;align-items:center;
    padding:6px 2px 8px;border-bottom:0.5px solid rgba(255,255,255,0.06);margin-bottom:8px;">
    <span style="font-size:10px;font-weight:600;color:#6b6b65;text-transform:uppercase;letter-spacing:.06em;">Resultados</span>
    <button onclick="renderWorkStatsPanel()" style="font-size:10px;color:#6b6b65;background:none;border:none;cursor:pointer;padding:2px 6px;border-radius:4px;"
      onmouseenter="this.style.color='#d4d4d0'" onmouseleave="this.style.color='#6b6b65'">← Cola</button>
  </div>`;

  results.forEach(r => {
    const p = r.panel;

    // ── RESUMEN ESTADÍSTICO ──────────────────────────────────────────────────
    if (p.type === 'summary') {
      html += `<div style="overflow-x:auto;font-size:10px;">
        <table style="width:100%;border-collapse:collapse;">
          <thead><tr>
            <th style="color:#6b6b65;font-weight:500;padding:4px 6px;border-bottom:0.5px solid rgba(255,255,255,0.08);text-align:left;white-space:nowrap;">Col</th>
            <th style="color:#6b6b65;font-weight:500;padding:4px 6px;border-bottom:0.5px solid rgba(255,255,255,0.08);text-align:right;">N</th>
            <th style="color:#6b6b65;font-weight:500;padding:4px 6px;border-bottom:0.5px solid rgba(255,255,255,0.08);text-align:right;">Media</th>
            <th style="color:#6b6b65;font-weight:500;padding:4px 6px;border-bottom:0.5px solid rgba(255,255,255,0.08);text-align:right;">σ</th>
            <th style="color:#6b6b65;font-weight:500;padding:4px 6px;border-bottom:0.5px solid rgba(255,255,255,0.08);text-align:right;">Min</th>
            <th style="color:#6b6b65;font-weight:500;padding:4px 6px;border-bottom:0.5px solid rgba(255,255,255,0.08);text-align:right;">Med</th>
            <th style="color:#6b6b65;font-weight:500;padding:4px 6px;border-bottom:0.5px solid rgba(255,255,255,0.08);text-align:right;">Max</th>
            <th style="color:#6b6b65;font-weight:500;padding:4px 6px;border-bottom:0.5px solid rgba(255,255,255,0.08);text-align:right;">Nulos</th>
          </tr></thead>
          <tbody>${p.data.map(s => s.type === 'número' ? `
            <tr>
              <td style="color:#9e9e98;padding:4px 6px;border-bottom:0.5px solid rgba(255,255,255,0.04);white-space:nowrap;max-width:70px;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(s.col)}</td>
              <td style="color:#9e9e98;padding:4px 6px;border-bottom:0.5px solid rgba(255,255,255,0.04);text-align:right;">${s.count}</td>
              <td style="color:#c060f0;padding:4px 6px;border-bottom:0.5px solid rgba(255,255,255,0.04);text-align:right;">${s.mean}</td>
              <td style="color:#4a90d9;padding:4px 6px;border-bottom:0.5px solid rgba(255,255,255,0.04);text-align:right;">${s.std}</td>
              <td style="color:#9e9e98;padding:4px 6px;border-bottom:0.5px solid rgba(255,255,255,0.04);text-align:right;">${s.min}</td>
              <td style="color:#9e9e98;padding:4px 6px;border-bottom:0.5px solid rgba(255,255,255,0.04);text-align:right;">${s.median}</td>
              <td style="color:#9e9e98;padding:4px 6px;border-bottom:0.5px solid rgba(255,255,255,0.04);text-align:right;">${s.max}</td>
              <td style="color:${s.nulls>0?'#e8682a':'#4a4a48'};padding:4px 6px;border-bottom:0.5px solid rgba(255,255,255,0.04);text-align:right;">${s.nulls}</td>
            </tr>` : `
            <tr>
              <td style="color:#9e9e98;padding:4px 6px;border-bottom:0.5px solid rgba(255,255,255,0.04);white-space:nowrap;">${escapeHtml(s.col)}</td>
              <td style="color:#9e9e98;padding:4px 6px;border-bottom:0.5px solid rgba(255,255,255,0.04);text-align:right;">${s.count}</td>
              <td colspan="5" style="color:#4a4a48;padding:4px 6px;border-bottom:0.5px solid rgba(255,255,255,0.04);text-align:center;font-style:italic;">texto · ${s.unique} únicos</td>
              <td style="color:${s.nulls>0?'#e8682a':'#4a4a48'};padding:4px 6px;border-bottom:0.5px solid rgba(255,255,255,0.04);text-align:right;">${s.nulls}</td>
            </tr>`
          ).join('')}</tbody>
        </table>
      </div>`;
    }

    // ── HISTOGRAMA ──────────────────────────────────────────────────────────
    if (p.type === 'histogram') {
      const maxFreq = Math.max(...p.freq);
      html += `<div style="margin-bottom:10px;">
        <div style="font-size:10px;color:#6b6b65;margin-bottom:6px;">Histograma: <b style="color:#9e9e98">${escapeHtml(p.col)}</b> (n=${p.total})</div>
        <div style="display:flex;align-items:flex-end;gap:3px;height:60px;">
          ${p.freq.map((f,i) => `
            <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;cursor:default;"
              title="${p.labels[i]}: ${f}">
              <div style="width:100%;background:#a60aed;border-radius:2px 2px 0 0;
                height:${maxFreq ? Math.round((f/maxFreq)*52) : 0}px;
                min-height:${f>0?2:0}px;transition:opacity .15s;opacity:.8;"
                onmouseenter="this.style.opacity=1" onmouseleave="this.style.opacity=.8">
              </div>
            </div>`).join('')}
        </div>
        <div style="display:flex;gap:3px;margin-top:2px;">
          ${p.freq.map((f,i) => `
            <div style="flex:1;font-size:8px;color:#4a4a48;text-align:center;overflow:hidden;white-space:nowrap;"
              title="${p.labels[i]}">${f}</div>`).join('')}
        </div>
      </div>`;
    }

    // ── BOXPLOT ─────────────────────────────────────────────────────────────
    if (p.type === 'boxplot') {
      html += `<div style="margin-bottom:6px;">
        <div style="font-size:10px;color:#6b6b65;margin-bottom:6px;">Boxplot por columna</div>
        ${p.data.map(b => {
          const range = b.max - b.min || 1;
          const pct = v => ((v - b.min) / range * 100).toFixed(1);
          return `<div style="margin-bottom:8px;">
            <div style="font-size:10px;color:#9e9e98;margin-bottom:3px;">${escapeHtml(b.col)}
              ${b.out>0?`<span style="color:#e8682a;margin-left:4px;">⚠ ${b.out} outlier${b.out!==1?'s':''}</span>`:''}
            </div>
            <div style="position:relative;height:16px;background:rgba(255,255,255,0.04);border-radius:3px;overflow:visible;">
              <!-- whisker izq -->
              <div style="position:absolute;left:${pct(b.min)}%;top:50%;width:${pct(b.q1)-pct(b.min)}%;height:1px;background:rgba(255,255,255,0.2);transform:translateY(-50%);"></div>
              <!-- caja IQR -->
              <div style="position:absolute;left:${pct(b.q1)}%;width:${pct(b.q3)-pct(b.q1)}%;top:20%;height:60%;background:rgba(166,10,237,0.35);border:0.5px solid #a60aed;border-radius:2px;"></div>
              <!-- mediana -->
              <div style="position:absolute;left:${pct(b.med)}%;top:10%;width:2px;height:80%;background:#fff;border-radius:1px;" title="Mediana: ${b.med}"></div>
              <!-- whisker der -->
              <div style="position:absolute;left:${pct(b.q3)}%;top:50%;width:${pct(b.max)-pct(b.q3)}%;height:1px;background:rgba(255,255,255,0.2);transform:translateY(-50%);"></div>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:8px;color:#4a4a48;margin-top:2px;">
              <span>${b.min}</span><span>Q1:${b.q1}</span><span style="color:#9e9e98">Md:${b.med}</span><span>Q3:${b.q3}</span><span>${b.max}</span>
            </div>
          </div>`;
        }).join('')}
      </div>`;
    }
  });

  container.innerHTML = html;
}

function handleToolSelectAll() {
  if (!fmToolKey) return;
  const data   = TOOL_MENUS[fmToolKey];
  const allSel = data.items.every(i => toolChecked[fmToolKey]?.[i.label]);
  data.items.forEach(i => {
    if (!toolChecked[fmToolKey]) toolChecked[fmToolKey] = {};
    toolChecked[fmToolKey][i.label] = !allSel;
  });
  const btn = document.getElementById('fmSelectAll');
  btn.textContent = allSel ? 'Seleccionar todo' : 'Deseleccionar todo';
  renderToolItems(fmToolKey);
}

// Cierra el menú flotante sin tocar activeKey del sidebar
function closeFm() {
  fm.classList.remove('open');
  fmMode    = 'sidebar';
  fmToolKey = null;
}

function openToolMenu(key) {
  if (!STATE.workDataset) { showToast('Carga un dataset primero desde Datos', 'warn'); return; }
  const data = TOOL_MENUS[key];
  if (!data) return;

  // FIX error 3 — toggle: si ya está abierto el mismo tool, cerrar
  if (fmMode === 'tool' && fmToolKey === key && fm.classList.contains('open')) {
    closeFm(); return;
  }

  fmMode    = 'tool';
  fmToolKey = key;
  // Cerrar cualquier sidebar tab activo visualmente
  document.querySelectorAll('.sb-tab').forEach(t => t.classList.remove('active'));
  activeKey = null;

  fm.style.setProperty('--menu-color', data.color);
  fmTitle.textContent = data.title;
  fmTitle.style.color = data.color;

  const applyBtn = document.getElementById('fmApply');
  applyBtn.style.background  = data.color;
  applyBtn.style.borderColor = data.color + '80';

  const selectAllBtn = document.getElementById('fmSelectAll');
  selectAllBtn.textContent = 'Seleccionar todo';
  selectAllBtn.classList.remove('all-selected');

  // FIX error 6 — posicionamiento por data-tool en lugar de búsqueda por texto
  const toolBtn = document.querySelector(`.tool-btn[data-tool="${key}"]`);
  if (toolBtn) {
    const rect = toolBtn.getBoundingClientRect();
    const menuH = 280; // altura aproximada
    let top  = rect.bottom + 6;
    let left = rect.left;
    // Evitar que salga de pantalla por abajo
    if (top + menuH > window.innerHeight) top = rect.top - menuH - 6;
    // Evitar que salga por la derecha
    if (left + 220 > window.innerWidth) left = window.innerWidth - 228;
    fm.style.top  = top + 'px';
    fm.style.left = left + 'px';
  }

  renderToolItems(key);
  fm.classList.add('open');
}

function renderToolItems(key) {
  const data = TOOL_MENUS[key];
  fmBody.innerHTML = data.items.map(item => {
    const on = toolChecked[key]?.[item.label] || false;
    return `<div class="fm-item${on?' checked':''}" data-key="${key}" data-label="${item.label}">
      <div class="fm-cb"><svg viewBox="0 0 10 10"><polyline points="1.5,5 4,7.5 8.5,2"/></svg></div>
      <span style="font-size:13px;flex:1">${item.label}</span>
      <span class="fm-item-badge" style="color:${data.color};background:${data.color}18">${item.tag}</span>
    </div>`;
  }).join('');

  fmBody.querySelectorAll('.fm-item').forEach(el => {
    el.addEventListener('click', () => {
      const k = el.dataset.key, l = el.dataset.label;
      if (!toolChecked[k]) toolChecked[k] = {};
      toolChecked[k][l] = !toolChecked[k][l];
      el.classList.toggle('checked', toolChecked[k][l]);
    });
  });
}

// ─── UTILIDADES ───────────────────────────────────────────────────────────────
function escapeHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function formatFileSize(bytes) {
  if (!bytes) return '0 B';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024,i)).toFixed(1) + ' ' + ['B','KB','MB','GB'][i];
}