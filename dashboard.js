// ─── ESTADO UI ────────────────────────────────────────────────────────────────
const UI_STATE_KEY = 'dashboardUIState';

function saveUIState() {
  try {
    const state = {
      sidebarCollapsed: document.getElementById('sb').classList.contains('collapsed'),
      navbarCollapsed:  document.getElementById('nb').classList.contains('collapsed'),
      activePage:       document.querySelector('.page.active')?.id || 'page-datos',
      activeFloatingMenu: activeKey,          // FIX: ahora se guarda correctamente
      checkedItems:     JSON.parse(JSON.stringify(checked)),
    };
    sessionStorage.setItem(UI_STATE_KEY, JSON.stringify(state)); // FIX: sessionStorage en vez de localStorage
  } catch(e) {
    console.warn('Error guardando estado:', e);
  }
}

function loadUIState() {
  try {
    const saved = sessionStorage.getItem(UI_STATE_KEY);
    if (!saved) return;
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
    // FIX: restaurar menú flotante activo
    if (state.activeFloatingMenu && MENUS[state.activeFloatingMenu]) {
      const tab = document.querySelector(`.sb-tab[data-key="${state.activeFloatingMenu}"]`);
      if (tab) setSb(tab);
    }
  } catch(e) {
    console.warn('Error cargando estado:', e);
  }
}

function resetUIState() {
  sessionStorage.removeItem(UI_STATE_KEY);
  location.reload();
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
  applyBtn.style.background   = data.color;
  applyBtn.style.borderColor  = data.color + '80';
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
  if (count === 0) { showToast('Selecciona al menos un elemento', 'warn'); return; }
  const selectedItems = Object.entries(checked[activeKey]).filter(([_,v])=>v).map(([k])=>k);
  console.log(`Aplicando ${count} items de ${MENUS[activeKey].title}:`, selectedItems);
  showToast(`Aplicando ${count} análisis de ${MENUS[activeKey].title}`, 'ok');
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

// ─── TOAST NOTIFICACIONES ─────────────────────────────────────────────────────
function showToast(msg, type = 'ok') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.style.cssText = `
      position:fixed;bottom:20px;right:20px;z-index:9999;
      display:flex;flex-direction:column;gap:8px;pointer-events:none;
    `;
    document.body.appendChild(container);
  }
  const colors = { ok:'#2ecc71', warn:'#f39c12', err:'#e74c3c', info:'#4a90d9' };
  const toast = document.createElement('div');
  toast.style.cssText = `
    background:#2d2d2a;border:0.5px solid ${colors[type]}40;border-left:3px solid ${colors[type]};
    color:#d4d4d0;font-size:12px;padding:10px 14px;border-radius:8px;
    box-shadow:0 4px 16px rgba(0,0,0,0.4);
    transform:translateX(110%);transition:transform .3s cubic-bezier(.4,0,.2,1);
    max-width:280px;pointer-events:none;
  `;
  toast.textContent = msg;
  container.appendChild(toast);
  requestAnimationFrame(() => { toast.style.transform = 'translateX(0)'; });
  setTimeout(() => {
    toast.style.transform = 'translateX(110%)';
    setTimeout(() => toast.remove(), 350);
  }, 3000);
}

// ─── CHART ────────────────────────────────────────────────────────────────────
const bvals = [45,70,30,85,55,60,40,75,20,90];
const ca = document.getElementById('chartViz');
if (ca) bvals.forEach((h,i) => {
  const b = document.createElement('div');
  b.className = 'bar' + (i===9?' hi':'');
  b.style.height = h+'%';
  b.onclick = () => {
    document.querySelectorAll('#chartViz .bar').forEach(x=>x.classList.remove('hi'));
    b.classList.add('hi');
  };
  ca.appendChild(b);
});

// ─── NOTCH ────────────────────────────────────────────────────────────────────
const nb     = document.getElementById('nb');
const notch  = document.getElementById('notch');
const topRow = document.querySelector('.top-row');

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

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
document.getElementById('sbBtn').addEventListener('click', () => {
  document.getElementById('sb').classList.toggle('collapsed');
  closeMenu();
  saveUIState();
});

// FIX: botón hamburger ahora alterna sidebar
const hamburgerBtn = document.querySelector('.icon-btn');
if (hamburgerBtn) {
  hamburgerBtn.addEventListener('click', () => {
    document.getElementById('sb').classList.toggle('collapsed');
    closeMenu();
    saveUIState();
  });
}

// ─── MULTIPAGE ────────────────────────────────────────────────────────────────
function navigateTo(targetId) {
  const target = document.getElementById(targetId);
  if (!target) return;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  target.classList.add('active');
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.toggle('active', t.dataset.target === targetId));
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
});

// ─── BÚSQUEDA ─────────────────────────────────────────────────────────────────
function filterDatasets() {
  const search = document.getElementById('datasetSearch').value.toLowerCase();
  document.querySelectorAll('#datasetsTableBody tr').forEach(row => {
    // FIX: usar dataset.name en vez de cells[1] para ser más robusto
    const name = (row.dataset.name || '').toLowerCase();
    row.style.display = name.includes(search) ? '' : 'none';
  });
}

// ─── ORDENAMIENTO ─────────────────────────────────────────────────────────────
function sortDatasets(criteria) {
  const tbody = document.getElementById('datasetsTableBody');
  const rows  = Array.from(tbody.querySelectorAll('tr'));

  rows.sort((a, b) => {
    if (criteria === 'name') {
      return (a.dataset.name || '').localeCompare(b.dataset.name || '');
    }
    if (criteria === 'size') {
      // FIX: usar el texto de la columna Filas (índice 3) — parseamos correctamente
      const aVal = parseInt((a.cells[3]?.textContent || '0').replace(/[,.\s]/g, '')) || 0;
      const bVal = parseInt((b.cells[3]?.textContent || '0').replace(/[,.\s]/g, '')) || 0;
      return bVal - aVal;
    }
    if (criteria === 'date') {
      // FIX: criterio 'date' ahora implementado (orden de inserción inverso)
      // Los datasets reales tendrían un data-date; aquí usamos el índice
      return rows.indexOf(b) - rows.indexOf(a);
    }
    return 0;
  });

  rows.forEach(row => tbody.appendChild(row));
  showToast(`Ordenado por ${criteria}`, 'info');
}

// ─── SELECCIÓN MÚLTIPLE ───────────────────────────────────────────────────────
function toggleSelectAll() {
  const selectAll = document.getElementById('selectAll');
  document.querySelectorAll('.dataset-check').forEach(cb => { cb.checked = selectAll.checked; });
  updateBulkActions();
}

function updateBulkActions() {
  const checked  = document.querySelectorAll('.dataset-check:checked');
  const bulkDiv  = document.getElementById('bulkActions');
  const countSpan = bulkDiv.querySelector('.selected-count');
  countSpan.textContent = `${checked.length} seleccionado${checked.length !== 1 ? 's' : ''}`;
  bulkDiv.style.display = checked.length > 0 ? 'flex' : 'none';
}

function deleteSelected() {
  const cbs = document.querySelectorAll('.dataset-check:checked');
  if (cbs.length === 0) return;
  if (!confirm(`¿Eliminar ${cbs.length} dataset(s)?`)) return;
  cbs.forEach(cb => cb.closest('tr').remove());
  updateBulkActions();
  showToast(`${cbs.length} dataset(s) eliminados`, 'err');
}

// ─── DRAG & DROP ──────────────────────────────────────────────────────────────
function initDragDrop() {
  const uploadArea = document.getElementById('uploadArea');
  const fileInput  = document.getElementById('fileInput');
  if (!uploadArea || !fileInput) { console.error('Elementos de upload no encontrados'); return; }

  uploadArea.addEventListener('dragover',  e => { e.preventDefault(); uploadArea.classList.add('dragover'); });
  uploadArea.addEventListener('dragleave', ()=> { uploadArea.classList.remove('dragover'); });
  uploadArea.addEventListener('drop', e => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    handleFiles(e.dataTransfer.files);
  });

  // FIX: separar el listener del fileInput del onclick inline del HTML para evitar doble trigger
  fileInput.addEventListener('change', e => { if (e.target.files.length) handleFiles(e.target.files); });
}

function handleFiles(files) {
  if (!files || files.length === 0) return;
  const file      = files[0];
  const validExts = ['.csv', '.xlsx', '.json'];
  const ext       = '.' + file.name.split('.').pop().toLowerCase();

  if (!validExts.includes(ext)) {
    showToast('Tipo no válido. Solo CSV, XLSX o JSON.', 'err'); return;
  }
  if (file.size > 50 * 1024 * 1024) {
    showToast('Archivo demasiado grande. Máximo 50 MB.', 'err'); return;
  }

  const uploadContent  = document.querySelector('.upload-content');
  const uploadProgress = document.getElementById('uploadProgress');
  const uploadSuccess  = document.getElementById('uploadSuccess');
  const uploadBar      = document.getElementById('uploadBar');
  const uploadStatus   = document.getElementById('uploadStatus');

  if (!uploadContent || !uploadProgress || !uploadSuccess || !uploadBar || !uploadStatus) {
    console.error('Faltan elementos del UI de upload'); return;
  }

  uploadContent.style.display  = 'none';
  uploadProgress.style.display = 'block';
  uploadBar.style.width        = '0%';
  uploadStatus.textContent     = 'Leyendo archivo...';

  // Leer el archivo real con FileReader
  const reader = new FileReader();

  reader.onprogress = e => {
    if (e.lengthComputable) {
      const pct = Math.round((e.loaded / e.total) * 80); // hasta 80% en lectura
      uploadBar.style.width    = pct + '%';
      uploadStatus.textContent = `Leyendo... ${pct}%`;
    }
  };

  reader.onload = e => {
    uploadBar.style.width    = '90%';
    uploadStatus.textContent = 'Procesando datos...';

    let parsedData = null;

    try {
      if (ext === '.csv') {
        parsedData = parseCSV(e.target.result);
      } else if (ext === '.json') {
        parsedData = parseJSON(e.target.result);
      } else if (ext === '.xlsx') {
        // XLSX es binario — no parseable sin librería externa
        // Guardamos null pero mostramos mensaje informativo
        parsedData = null;
      }
    } catch (err) {
      console.warn('Error parseando archivo:', err);
      parsedData = null;
    }

    // Guardar en DATASETS_PREVIEW para que tooltip y panel de info funcionen
    if (parsedData) {
      DATASETS_PREVIEW[file.name] = parsedData;
    }

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

  // CSV y JSON son texto; XLSX es binario
  if (ext === '.xlsx') {
    reader.readAsArrayBuffer(file);
  } else {
    reader.readAsText(file, 'UTF-8');
  }
}

// ─── PARSERS ──────────────────────────────────────────────────────────────────

/** Parsea CSV a { columns, rows } — soporta comas y punto y coma como separador */
function parseCSV(text) {
  // Detectar separador automáticamente
  const firstLine = text.split('\n')[0] || '';
  const sep = firstLine.includes(';') ? ';' : ',';

  const lines = text.trim().split('\n').map(l => l.replace(/\r$/, ''));
  if (lines.length < 2) return null;

  // Parser CSV que respeta comillas
  function parseLine(line) {
    const result = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i+1] === '"') { cur += '"'; i++; }
        else inQuotes = !inQuotes;
      } else if (ch === sep && !inQuotes) {
        result.push(cur.trim()); cur = '';
      } else {
        cur += ch;
      }
    }
    result.push(cur.trim());
    return result;
  }

  const columns = parseLine(lines[0]);
  const rows = lines.slice(1).filter(l => l.trim()).map(line => {
    return parseLine(line).map(cell => {
      const n = Number(cell);
      return cell !== '' && !isNaN(n) ? n : cell;
    });
  });

  return { columns, rows: rows.slice(0, 200) }; // máx 200 filas en preview
}

/** Parsea JSON (array de objetos) a { columns, rows } */
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
  const tbody   = document.getElementById('datasetsTableBody');
  const ext     = name.split('.').pop().toLowerCase();
  const type    = ext === 'csv' ? 'CSV' : ext === 'xlsx' ? 'XLSX' : 'JSON';
  const sizeStr = file ? formatFileSize(file.size) : '-';
  const rowCount = parsedData ? parsedData.rows.length.toLocaleString('es') : '-';
  const colCount = parsedData ? parsedData.columns.length : '-';

  const row = document.createElement('tr');
  row.dataset.name = name;
  row.innerHTML = `
    <td><input type="checkbox" class="dataset-check"></td>
    <td>${escapeHtml(name)}</td>
    <td><span class="tag tag-type">${type}</span></td>
    <td>${rowCount}</td>
    <td>${colCount}</td>
    <td><span class="status-dot" style="background:#2ecc71"></span>Listo</td>
  `;
  tbody.appendChild(row);

  // Agregar al tooltip de preview
  row.addEventListener('mouseenter', e => {
    const tooltip = document.getElementById('dataPreviewTooltip');
    const data    = DATASETS_PREVIEW[name];
    if (!tooltip || !data) return;
    document.getElementById('previewTitle').textContent =
      `Vista previa: ${name} (${data.rows.length} filas × ${data.columns.length} cols)`;
    document.getElementById('previewTable').innerHTML = `
      <thead><tr>${data.columns.map(c=>`<th>${escapeHtml(c)}</th>`).join('')}</tr></thead>
      <tbody>${data.rows.slice(0,8).map(r =>
        `<tr>${r.map(cell=>`<td>${escapeHtml(String(cell??''))}</td>`).join('')}</tr>`
      ).join('')}</tbody>`;
    let leftPos = e.clientX + 15;
    if (leftPos + 360 > window.innerWidth) leftPos = e.clientX - 360 - 15;
    tooltip.style.left = leftPos + 'px';
    tooltip.style.top  = Math.min(e.clientY + 15, window.innerHeight - 240) + 'px';
    tooltip.classList.add('visible');
  });
  row.addEventListener('mouseleave', () => {
    document.getElementById('dataPreviewTooltip')?.classList.remove('visible');
  });
  row.addEventListener('mousemove', e => {
    const tooltip = document.getElementById('dataPreviewTooltip');
    if (!tooltip?.classList.contains('visible')) return;
    let leftPos = e.clientX + 15;
    if (leftPos + 360 > window.innerWidth) leftPos = e.clientX - 360 - 15;
    tooltip.style.left = leftPos + 'px';
    tooltip.style.top  = Math.min(e.clientY + 15, window.innerHeight - 240) + 'px';
  });

  row.querySelector('.dataset-check').addEventListener('change', updateBulkActions);
  row.style.cursor = 'pointer';
  row.addEventListener('click', (e) => {
    if (e.target.type === 'checkbox') return;
    selectDatasetRow(row, name, DATASETS_PREVIEW[name] || null);
  });
}

// ─── CLICK EN FILA ────────────────────────────────────────────────────────────
function initDatasetClick() {
  document.querySelectorAll('.dataset-check').forEach(cb => {
    cb.addEventListener('change', updateBulkActions);
  });

  // FIX: filtros de estado — comparación más robusta
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('#datasetsTableBody tr').forEach(row => {
        if (filter === 'all') { row.style.display = ''; return; }
        // FIX: extraer solo el texto sin el dot usando lastChild
        const statusCell = row.querySelector('td:last-child');
        const statusText = statusCell ? statusCell.textContent.trim() : '';
        const map = { listo:'Listo', limpiando:'Limpiando', error:'Error' };
        row.style.display = (statusText === map[filter]) ? '' : 'none';
      });
    });
  });

  document.querySelectorAll('#datasetsTableBody tr').forEach(row => {
    row.style.cursor = 'pointer';
    row.addEventListener('click', (e) => {
      if (e.target.type === 'checkbox') return;
      const name = row.dataset.name;
      const data = DATASETS_PREVIEW[name] || null;
      selectDatasetRow(row, name, data);
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
    infoContent.innerHTML = `
      ${actionsHtml}
      <div style="padding:20px;color:#6b6b65;text-align:center;margin-top:20px;">
        Archivo cargado correctamente<br>
        <small>Vista previa no disponible para archivos nuevos</small>
      </div>`;
    return;
  }

  const stats = data.columns.map((col, ci) => {
    const values    = data.rows.map(r => r[ci]);
    const numValues = values.filter(v => typeof v === 'number');
    const nullCount = values.filter(v => v === null || v === '' || v === undefined).length;
    const uniqueCount = new Set(values).size;
    const min = numValues.length ? Math.min(...numValues) : '—';
    const max = numValues.length ? Math.max(...numValues) : '—';
    const type = numValues.length === values.length ? 'Número' : 'Texto';
    return { col, type, uniqueCount, nullCount, min, max };
  });

  infoContent.innerHTML = `
    ${actionsHtml}
    <table class="data-table" style="font-size:11px;margin-top:10px;">
      <thead><tr><th>Columna</th><th>Tipo</th><th>Únicos</th><th>Nulos</th><th>Min</th><th>Max</th></tr></thead>
      <tbody>${stats.map(s =>
        `<tr><td>${s.col}</td><td>${s.type}</td><td>${s.uniqueCount}</td><td>${s.nullCount}</td><td>${s.min}</td><td>${s.max}</td></tr>`
      ).join('')}</tbody>
    </table>`;
}

function buildActionsHtml(name) {
  const safe = escapeHtml(name).replace(/'/g,"&#39;");
  return `
    <div class="dataset-actions">
      <button class="btn-action" onclick="exportDataset('${safe}')" title="Exportar como CSV">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 2v8M5 7l3 3 3-3M3 13h10"/></svg>
        Exportar
      </button>
      <button class="btn-action" onclick="duplicateDataset('${safe}')" title="Duplicar">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="5" width="8" height="8" rx="1"/><path d="M5 5V4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1h-1"/></svg>
        Duplicar
      </button>
      <button class="btn-action" onclick="renameDataset('${safe}')" title="Renombrar">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M11 2l3 3-8 8H3V10L11 2z"/></svg>
        Renombrar
      </button>
      <button class="btn-action btn-danger" onclick="deleteDataset('${safe}')" title="Eliminar">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 4h10M5 4V3h6v1M4 4v9a1 1 0 001 1h6a1 1 0 001-1V4"/></svg>
        Eliminar
      </button>
    </div>`;
}

// ─── ACCIONES DE DATASET (EXPORTACIÓN REAL) ───────────────────────────────────

/**
 * FIX PRINCIPAL: exportDataset ahora genera y descarga un CSV real.
 * Si el dataset tiene datos de preview, exporta esos datos.
 * Si es un archivo recién subido, exporta un CSV de ejemplo/metadatos.
 */
function exportDataset(name) {
  const data = DATASETS_PREVIEW[name];
  let csvContent = '';

  if (data) {
    // Exportar datos reales del preview
    const header = data.columns.join(',');
    const rows = data.rows.map(row =>
      row.map(cell => {
        const str = String(cell == null ? '' : cell);
        // Escapar celdas que contengan coma, comilla o salto de línea
        return (str.includes(',') || str.includes('"') || str.includes('\n'))
          ? `"${str.replace(/"/g, '""')}"`
          : str;
      }).join(',')
    );
    csvContent = [header, ...rows].join('\r\n');
  } else {
    // Dataset sin datos de preview — exportar fila de metadatos
    csvContent = 'nombre,estado,tipo\r\n' + `"${name}","Listo","importado"`;
  }

  downloadBlob(csvContent, name.replace(/\.[^.]+$/, '') + '_export.csv', 'text/csv;charset=utf-8;');
  showToast(`"${name}" exportado como CSV`, 'ok');
}

/**
 * Exporta todos los datasets con datos de preview a un único CSV
 * con columna "dataset" como identificador.
 */
function exportAll() {
  const keys = Object.keys(DATASETS_PREVIEW);
  if (keys.length === 0) { showToast('No hay datasets con datos para exportar', 'warn'); return; }

  let lines = [];
  keys.forEach(name => {
    const d = DATASETS_PREVIEW[name];
    if (!lines.length) {
      // Escribir encabezado global (dataset + columnas del primer dataset)
      lines.push(['dataset', ...d.columns].join(','));
    }
    d.rows.forEach(row => {
      const cells = [name, ...row].map(cell => {
        const str = String(cell == null ? '' : cell);
        return (str.includes(',') || str.includes('"')) ? `"${str.replace(/"/g,'""')}"` : str;
      });
      lines.push(cells.join(','));
    });
  });

  downloadBlob(lines.join('\r\n'), 'todos_los_datasets.csv', 'text/csv;charset=utf-8;');
  showToast('Todos los datasets exportados', 'ok');
}

/**
 * Exportar resultados de análisis como JSON
 */
function exportAnalysisResults() {
  const results = {
    exportedAt: new Date().toISOString(),
    analyses: [
      { test:'Regresión múltiple', vars:'ingreso ~ edad + educ + exp', stat:'F = 24.31', pvalue:0.0001, significant:true },
      { test:'T-test pareado',     vars:'pre_test vs post_test',       stat:'t = -3.84', pvalue:0.0023, significant:true },
      { test:'Pearson',            vars:'ingreso ~ educación',         stat:'r = 0.67',  pvalue:0.0000, significant:true },
      { test:'ANOVA una vía',      vars:'satisfacción ~ región',       stat:'F = 1.92',  pvalue:0.1420, significant:false },
      { test:'Shapiro-Wilk',       vars:'residuos ~ normalidad',       stat:'W = 0.981', pvalue:0.2310, significant:false },
      { test:'Mann-Whitney U',     vars:'salario ~ género',            stat:'U = 1840',  pvalue:0.0341, significant:true },
    ]
  };
  const json = JSON.stringify(results, null, 2);
  downloadBlob(json, 'resultados_analisis.json', 'application/json');
  showToast('Resultados exportados como JSON', 'ok');
}

/** Utilidad para disparar descarga de un Blob en el navegador */
function downloadBlob(content, filename, mimeType) {
  const BOM  = mimeType.includes('csv') ? '\uFEFF' : ''; // BOM para CSV en Excel
  const blob = new Blob([BOM + content], { type: mimeType });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 1000);
}

function duplicateDataset(name) {
  const ext     = name.includes('.') ? name.slice(name.lastIndexOf('.')) : '';
  const base    = name.slice(0, name.lastIndexOf('.'));
  const newName = base + '_copia' + ext;
  addDatasetToTable(newName, null);
  // Si tiene datos, duplicar también el preview
  if (DATASETS_PREVIEW[name]) {
    DATASETS_PREVIEW[newName] = JSON.parse(JSON.stringify(DATASETS_PREVIEW[name]));
  }
  showToast(`"${name}" duplicado como "${newName}"`, 'ok');
}

function renameDataset(name) {
  const newName = prompt('Nuevo nombre del dataset:', name);
  if (!newName || newName.trim() === '' || newName === name) return;
  const sanitized = newName.trim();

  // Renombrar en la tabla
  const row = document.querySelector(`#datasetsTableBody tr[data-name="${CSS.escape(name)}"]`);
  if (row) {
    row.dataset.name = sanitized;
    row.cells[1].textContent = sanitized;
  }
  // Renombrar en preview
  if (DATASETS_PREVIEW[name]) {
    DATASETS_PREVIEW[sanitized] = DATASETS_PREVIEW[name];
    delete DATASETS_PREVIEW[name];
  }
  // Actualizar info panel si estaba activo
  const infoLabel = document.getElementById('infoPanelLabel');
  if (infoLabel && infoLabel.textContent.includes(name)) {
    infoLabel.textContent = `Información: ${sanitized}`;
  }
  showToast(`Renombrado a "${sanitized}"`, 'ok');
}

function deleteDataset(name) {
  if (!confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) return;
  const row = document.querySelector(`#datasetsTableBody tr[data-name="${CSS.escape(name)}"]`);
  if (row) row.remove();
  delete DATASETS_PREVIEW[name];
  // Limpiar info panel
  const infoLabel   = document.getElementById('infoPanelLabel');
  const infoContent = document.getElementById('infoPanelContent');
  if (infoLabel && infoLabel.textContent.includes(name)) {
    infoLabel.textContent = 'Información';
    infoContent.innerHTML = `<div class="empty-state" style="display:flex;align-items:center;justify-content:center;height:100%;color:#4a4a48;font-size:12px;">
      Haz click en un dataset para ver información</div>`;
  }
  updateBulkActions();
  showToast(`"${name}" eliminado`, 'err');
}

// ─── DATA PREVIEW TOOLTIP ─────────────────────────────────────────────────────
const DATASETS_PREVIEW = {
  'encuesta_2024.csv': {
    columns: ['id','edad','educacion','ingreso','region'],
    rows: [
      [1,25,'Universitaria',45000,'Norte'],
      [2,34,'Preparatoria',32000,'Sur'],
      [3,45,'Universitaria',58000,'Centro'],
      [4,28,'Secundaria',18000,'Oriente'],
      [5,52,'Universitaria',72000,'Norte'],
      [6,31,'Preparatoria',28000,'Sur'],
      [7,41,'Universitaria',51000,'Centro'],
      [8,26,'Secundaria',22000,'Oriente'],
      [9,38,'Preparatoria',35000,'Norte'],
      [10,29,'Universitaria',47000,'Sur']
    ]
  },
  'panel_hogares.xlsx': {
    columns: ['hogar_id','integrantes','ingreso_total','gasto','zona'],
    rows: [
      [1,4,35000,28000,'Urbana'],
      [2,2,42000,31000,'Rural'],
      [3,5,28000,22000,'Urbana'],
      [4,3,55000,42000,'Urbana'],
      [5,6,18000,15000,'Rural'],
      [6,2,65000,48000,'Urbana'],
      [7,4,31000,25000,'Urbana'],
      [8,3,44000,36000,'Rural']
    ]
  },
  'precios_hist.csv': {
    columns: ['producto','precio','mes','año'],
    rows: [
      ['Leche',24.50,'Ene',2024],
      ['Pan',18.00,'Ene',2024],
      ['Huevos',45.00,'Ene',2024],
      ['Leche',25.00,'Feb',2024],
      ['Pan',18.50,'Feb',2024],
      ['Huevos',46.00,'Feb',2024],
      ['Leche',25.50,'Mar',2024],
      ['Pan',19.00,'Mar',2024]
    ]
  }
};

function initDataPreview() {
  const tooltip = document.getElementById('dataPreviewTooltip');
  if (!tooltip) return;
  const titleEl = document.getElementById('previewTitle');
  const tableEl = document.getElementById('previewTable');
  const tableRows = document.querySelectorAll('#datasetsTableBody tr');

  tableRows.forEach(row => {
    row.addEventListener('mouseenter', e => {
      const name = row.dataset.name;
      const data = DATASETS_PREVIEW[name];
      if (!data) return;

      const numCols = data.columns.length;
      const minColWidth = 70;
      const maxColWidth = 130;
      const calculatedWidth = Math.min(Math.max(numCols * minColWidth, 250), window.innerWidth * 0.7);
      
      titleEl.textContent = `Vista previa: ${name} (${data.rows.length} filas × ${data.columns.length} cols)`;
      tableEl.innerHTML = `
        <thead><tr>${data.columns.map(c=>`<th style="min-width:${minColWidth}px;max-width:${maxColWidth}px">${escapeHtml(c)}</th>`).join('')}</tr></thead>
        <tbody>${data.rows.slice(0,8).map(r =>
          `<tr>${r.map(cell=>`<td>${escapeHtml(String(cell??''))}</td>`).join('')}</tr>`
        ).join('')}</tbody>`;

      tooltip.style.width = calculatedWidth + 'px';
      
      let leftPos = e.clientX + 20;
      if (leftPos + calculatedWidth > window.innerWidth - 20) {
        leftPos = e.clientX - calculatedWidth - 20;
        if (leftPos < 20) leftPos = 20;
      }
      
      tooltip.style.left = leftPos + 'px';
      tooltip.style.top = Math.min(e.clientY + 20, window.innerHeight - tooltip.offsetHeight - 20) + 'px';
      tooltip.classList.add('visible');
    });

    row.addEventListener('mouseleave', () => tooltip.classList.remove('visible'));
    row.addEventListener('mousemove', e => {
      if (!tooltip.classList.contains('visible')) return;
      let leftPos = e.clientX + 20;
      if (leftPos + tooltip.offsetWidth > window.innerWidth - 20) {
        leftPos = e.clientX - tooltip.offsetWidth - 20;
        if (leftPos < 20) leftPos = 20;
      }
      tooltip.style.left = leftPos + 'px';
      tooltip.style.top = Math.min(e.clientY + 20, window.innerHeight - tooltip.offsetHeight - 20) + 'px';
    });
  });
}

// ─── UTILIDADES ───────────────────────────────────────────────────────────────
function escapeHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B','KB','MB','GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}