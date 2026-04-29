// ========================================
// DatosManager.js — StatAnalyzer Pro
// Vista de datos mejorada
// ========================================

const DatosManager = (() => {

    let _currentPage   = 1;
    let _pageSize      = 50;
    let _sortCol       = null;
    let _sortDir       = 'asc';
    let _searchQuery   = '';
    let _filteredData  = [];
    let _outlierCols   = new Set();

    // ── Utilidades ────────────────────────
    // escapeHtml() y showToast() ahora están en utils.js

    function _getData() {
        const imported = StateManager.getImportedData();
        if (imported && imported.data && imported.data.length > 0) return imported;
        const sheet = StateManager.getActiveSheet();
        if (!sheet || !sheet.data || sheet.data.length === 0) return null;
        const data = sheet.data.map(row => {
            const obj = {};
            sheet.headers.forEach((h, i) => obj[h] = row[i]);
            return obj;
        });
        return { headers: sheet.headers, data, rowCount: data.length };
    }

    // _showToast ahora usa showToast() de utils.js
    function _showToast(msg, isError = false) {
        showToast(msg, isError);
    }

    // ── Exportar datos ──────────────────────
    function _doExport(format) {
        const imported = _getData();
        if (!imported || !imported.headers || imported.headers.length === 0) {
            _showToast('⚠️ No hay datos para exportar', true);
            return;
        }

        const headers = imported.headers;
        const data = imported.data;
        
        // Detectar formato de datos: array de objetos o array de arrays
        const isArrayOfArrays = Array.isArray(data[0]);
        
        // Convertir siempre a array de arrays para exportar
        let rows;
        if (isArrayOfArrays) {
            rows = data;
        } else {
            // Array de objetos - convertir a array de arrays
            rows = data.map(row => headers.map(h => row[h]));
        }

        let content, filename, type;

        const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
        const now = new Date();
        const date = `${String(now.getDate()).padStart(2,'0')}-${months[now.getMonth()]}-${now.getFullYear()}: ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
        const baseName = `datos_export_${date}`;

        switch (format) {
            case 'csv':
                console.log('DEBUG CSV - headers:', headers, 'rows:', rows);
                const csvLines = rows.map(row => 
                    row.map(val => {
                        const str = String(val ?? '');
                        return str.includes(',') || str.includes('"') || str.includes('\n') 
                            ? `"${str.replace(/"/g, '""')}"` 
                            : str;
                    }).join(',')
                );
                content = [headers.join(','), ...csvLines].join('\n');
                filename = `${baseName}.csv`;
                type = 'text/csv;charset=utf-8';
                console.log('DEBUG CSV - content generated');
                break;
            case 'json':
                const jsonData = data.map(row => {
                    const obj = {};
                    headers.forEach((h, i) => obj[h] = row[h] ?? row[i]);
                    return obj;
                });
                content = JSON.stringify(jsonData, null, 2);
                filename = `${baseName}.json`;
                type = 'application/json;charset=utf-8';
                break;
            case 'txt':
                let txt = headers.join('\t') + '\n';
                rows.forEach(row => {
                    txt += row.join('\t') + '\n';
                });
                content = txt;
                filename = `${baseName}.txt`;
                type = 'text/plain;charset=utf-8';
                break;
            default:
                _showToast('⚠️ Formato no válido', true);
                return;
        }

        const blob = new Blob([content], { type });
        console.log('DEBUG - blob created, size:', blob.size);
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        console.log('DEBUG - clicking link');
        link.click();
        document.body.removeChild(link);
        console.log('DEBUG - link clicked, done');
        URL.revokeObjectURL(link.href);

        _showToast(`✅ Datos exportados en formato ${format.toUpperCase()}`);
    }

    function _showExportModal() {
        const imported = _getData();
        if (!imported) {
            _showToast('⚠️ No hay datos para exportar', true);
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'dm-modal-overlay';
        modal.id = 'dm-export-modal';
        modal.innerHTML = `
            <div class="dm-modal">
                <div class="dm-modal-header">
                    <span class="dm-modal-title">💾 Exportar Datos</span>
                    <button class="dm-modal-close" onclick="document.getElementById('dm-export-modal')?.remove()">✕</button>
                </div>
                <div class="dm-modal-body">
                    <p class="dm-modal-desc">Selecciona el formato de exportación:</p>
                    <div class="dm-export-formats">
                        <label class="dm-export-option">
                            <input type="radio" name="exportFormat" value="csv" checked>
                            <span class="dm-export-label">
                                <span class="dm-export-icon">📄</span>
                                <span class="dm-export-name">CSV</span>
                                <span class="dm-export-desc">Compatible con Excel</span>
                            </span>
                        </label>
                        <label class="dm-export-option">
                            <input type="radio" name="exportFormat" value="json">
                            <span class="dm-export-label">
                                <span class="dm-export-icon">{ }</span>
                                <span class="dm-export-name">JSON</span>
                                <span class="dm-export-desc">Estructura de objetos</span>
                            </span>
                        </label>
                        <label class="dm-export-option">
                            <input type="radio" name="exportFormat" value="txt">
                            <span class="dm-export-label">
                                <span class="dm-export-icon">📝</span>
                                <span class="dm-export-name">TXT</span>
                                <span class="dm-export-desc">Separado por tabs</span>
                            </span>
                        </label>
                    </div>
                    <div class="dm-export-info">
                        <span>📊 ${imported.headers.length} columnas × ${imported.data.length} filas</span>
                    </div>
                </div>
                <div class="dm-modal-footer">
                    <button class="dm-btn dm-btn-secondary" onclick="document.getElementById('dm-export-modal')?.remove()">Cancelar</button>
                    <button class="dm-btn dm-btn-primary" id="dm-export-confirm">Exportar</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        document.getElementById('dm-export-confirm')?.addEventListener('click', () => {
            const format = document.querySelector('input[name="exportFormat"]:checked')?.value || 'csv';
            document.getElementById('dm-export-modal')?.remove();
            _doExport(format);
        });
    }

    // ── Calcular outliers ─────────────────
    function _calcOutliers(data, col) {
        const vals = data.map(r => parseFloat(r[col])).filter(v => !isNaN(v)).sort((a,b)=>a-b);
        if (vals.length < 4) return { low: -Infinity, high: Infinity };
        const q1  = vals[Math.floor(vals.length * 0.25)];
        const q3  = vals[Math.floor(vals.length * 0.75)];
        const iqr = q3 - q1;
        return { low: q1 - 1.5 * iqr, high: q3 + 1.5 * iqr };
    }

    // ── Construir vista principal ─────────
    function buildView() {
        const container = document.getElementById('datos-main-container');
        if (!container) return;

        const imported = _getData();

        container.innerHTML = `
        <div class="dm-layout">

            <!-- Sección 1: Archivos -->
            <div class="dm-section">
                <div class="dm-section-header">
                    <span class="dm-section-title">📂 Archivos</span>
                    <div class="dm-section-actions">
                        <button class="dm-btn dm-btn-primary" id="dm-btn-import">📁 Importar Datos</button>
                        <button class="dm-btn dm-btn-secondary" id="dm-btn-combine" ${!imported ? 'disabled' : ''}>🔗 Combinar Archivos</button>
                        <button class="dm-btn dm-btn-secondary" id="dm-btn-export" ${!imported ? 'disabled' : ''}>💾 Exportar Datos</button>
                    </div>
                </div>
                <div class="dm-files-area" id="dm-files-area">
                    ${_renderFilesArea(imported)}
                </div>
            </div>

            ${imported ? `
            <!-- Sección 2: Herramientas -->
            <div class="dm-section">
                <div class="dm-section-header">
                    <span class="dm-section-title">🔧 Herramientas</span>
                    <div class="dm-section-actions">
                        <button class="dm-btn dm-btn-tool" id="dm-btn-clean"    title="Eliminar espacios extra">🧹 Limpiar</button>
                        <button class="dm-btn dm-btn-tool" id="dm-btn-nulos"    title="Eliminar filas con nulos">🗑️ Eliminar nulos</button>
                        <button class="dm-btn dm-btn-tool" id="dm-btn-norm"     title="Normalización Min-Max">📐 Normalizar</button>
                        <button class="dm-btn dm-btn-tool" id="dm-btn-outliers" title="Detectar outliers (IQR)">⚠️ Detectar outliers</button>
                        <button class="dm-btn dm-btn-tool" id="dm-btn-calcol"   title="Crear columna calculada">➕ Crear columna</button>
                        <button class="dm-btn dm-btn-tool" id="dm-btn-dupcol"   title="Duplicar columna">📋 Duplicar columna</button>
                        <button class="dm-btn dm-btn-tool" id="dm-btn-delcol"   title="Eliminar columnas">✂️ Eliminar columnas</button>
                    </div>
                </div>

                <!-- Buscar y reemplazar -->
                <div class="dm-search-replace">
                    <div class="dm-sr-group">
                        <label class="dm-sr-label">🔍 Buscar</label>
                        <input class="dm-sr-input" id="dm-sr-find" type="text" placeholder="Valor a buscar...">
                    </div>
                    <div class="dm-sr-group">
                        <label class="dm-sr-label">✏️ Reemplazar por</label>
                        <input class="dm-sr-input" id="dm-sr-replace" type="text" placeholder="Nuevo valor...">
                    </div>
                    <div class="dm-sr-group">
                        <label class="dm-sr-label">📋 Columna</label>
                        <select class="dm-sr-select" id="dm-sr-col">
                            <option value="__all__">Todas las columnas</option>
                            ${imported.headers.map(h => `<option value="${escapeHtml(h)}">${escapeHtml(h)}</option>`).join('')}
                        </select>
                    </div>
                    <button class="dm-btn dm-btn-primary" id="dm-btn-replace">Reemplazar</button>
                </div>
            </div>

            <!-- Sección 3: Parámetros de Control -->
            ${_renderParametrosPanel(imported)}

            <!-- Sección 4: Preview de datos -->
            <div class="dm-section dm-section-table">
                <div class="dm-section-header">
                    <span class="dm-section-title">📊 Vista previa de datos</span>
                    <div class="dm-section-actions">
                        <input class="dm-search-input" id="dm-search" type="text" placeholder="🔍 Buscar en datos...">
                        <span class="dm-page-info" id="dm-page-info">—</span>
                        <button class="dm-btn dm-btn-icon" id="dm-btn-prev">◀</button>
                        <button class="dm-btn dm-btn-icon" id="dm-btn-next">▶</button>
                    </div>
                </div>
                <div class="dm-table-wrap" id="dm-table-wrap">
                    ${_renderTable(imported)}
                </div>
            </div>
            ` : `
            <div class="dm-empty-state">
                <div class="dm-empty-icon">📂</div>
                <h3>No hay datos cargados</h3>
                <p>Importa un archivo CSV, JSON o TXT para comenzar.</p>
                <button class="dm-btn dm-btn-primary" id="dm-btn-import-empty">📁 Importar datos</button>
            </div>
            `}
        </div>`;

        _attachListeners(imported);
    }

    // ── Panel de parámetros de control ────
    function _renderParametrosPanel(imported) {
        const numCols  = _getNumericCols(imported);
        const rawState = ParametrosManager.getRawState();
        const g        = rawState.global  || {};
        const cols     = rawState.columns || {};

        const colRows = numCols.map(h => {
            const c = cols[h] || {};
            return `
            <div class="dm-params-col-row">
                <span class="dm-params-colname" title="${escapeHtml(h)}">${escapeHtml(h)}</span>
                <input class="dm-params-input" type="number" step="any"
                       data-col="${escapeHtml(h)}" data-type="min"
                       placeholder="Mín" value="${escapeHtml(String(c.min ?? ''))}">
                <input class="dm-params-input" type="number" step="any"
                       data-col="${escapeHtml(h)}" data-type="max"
                       placeholder="Máx" value="${escapeHtml(String(c.max ?? ''))}">
                <input class="dm-params-input" type="number" step="any"
                       data-col="${escapeHtml(h)}" data-type="esp"
                       placeholder="Esp." value="${escapeHtml(String(c.esp ?? ''))}">
            </div>`;
        }).join('');

        return `
        <div class="dm-section dm-params-section">
            <div class="dm-section-header dm-params-header" id="dm-params-toggle-header" style="cursor:pointer">
                <span class="dm-section-title">🎯 Parámetros de Control</span>
                <div class="dm-section-actions">
                    <span class="dm-params-hint">Define mínimo, máximo y esperanza por columna</span>
                    <span class="dm-params-chevron" id="dm-params-chevron">▼</span>
                </div>
            </div>
            <div class="dm-params-body" id="dm-params-body">

                <!-- Fila global -->
                <div class="dm-params-global-row">
                    <span class="dm-params-global-label">📌 Global (todas las columnas)</span>
                    <input class="dm-params-input" type="number" step="any"
                           id="pm-g-min" placeholder="Mín" value="${escapeHtml(String(g.min ?? ''))}">
                    <input class="dm-params-input" type="number" step="any"
                           id="pm-g-max" placeholder="Máx" value="${escapeHtml(String(g.max ?? ''))}">
                    <input class="dm-params-input" type="number" step="any"
                           id="pm-g-esp" placeholder="Esp." value="${escapeHtml(String(g.esp ?? ''))}">
                    <button class="dm-btn dm-btn-primary dm-params-apply-global" id="dm-params-apply-global">
                        Aplicar a todas
                    </button>
                </div>

                <!-- Cabecera de columnas -->
                <div class="dm-params-cols-header">
                    <span>Columna</span>
                    <span>Mínimo</span>
                    <span>Máximo</span>
                    <span>Esperanza</span>
                </div>

                <!-- Filas por columna -->
                <div class="dm-params-cols-list">
                    ${numCols.length > 0 ? colRows : '<p class="dm-params-empty">No hay columnas numéricas detectadas</p>'}
                </div>

                <!-- Acciones -->
                <div class="dm-params-footer">
                    <button class="dm-btn dm-btn-primary" id="dm-params-save">💾 Guardar parámetros</button>
                    <button class="dm-btn dm-btn-secondary" id="dm-params-reset">🗑️ Limpiar todo</button>
                </div>
            </div>
        </div>`;
    }

    function _renderFilesArea(imported) {
        if (!imported) return '<p class="dm-no-file">No hay archivos cargados</p>';
        const fileName = StateManager.getState().fileName || 'datos importados';
        const numCols  = imported.headers.length;
        const numRows  = imported.rowCount || imported.data.length;
        const numNums  = _getNumericCols(imported).length;
        return `
        <div class="dm-file-card">
            <div class="dm-file-icon">📄</div>
            <div class="dm-file-info">
                <div class="dm-file-name">${escapeHtml(fileName)}</div>
                <div class="dm-file-meta">${numRows} filas · ${numCols} columnas · ${numNums} numéricas</div>
            </div>
            <div class="dm-file-kpis">
                <div class="dm-kpi"><div class="dm-kpi-val">${numRows}</div><div class="dm-kpi-lbl">Filas</div></div>
                <div class="dm-kpi"><div class="dm-kpi-val">${numCols}</div><div class="dm-kpi-lbl">Columnas</div></div>
                <div class="dm-kpi"><div class="dm-kpi-val">${numNums}</div><div class="dm-kpi-lbl">Numéricas</div></div>
                <div class="dm-kpi"><div class="dm-kpi-val">${_countNulls(imported)}</div><div class="dm-kpi-lbl">Nulos</div></div>
            </div>
            <button class="dm-btn dm-btn-send" id="dm-btn-send-analisis" title="Enviar a Análisis">
                ▶ Enviar a Análisis
            </button>
            <button class="dm-btn dm-btn-danger-sm" id="dm-btn-clear-data" title="Eliminar datos">🗑️ Eliminar Datos</button>
        </div>`;
    }

    function _renderTable(imported) {
        if (!imported) return '';

        // Aplicar búsqueda
        let data = imported.data;
        if (_searchQuery) {
            const q = _searchQuery.toLowerCase();
            data = data.filter(row =>
                imported.headers.some(h => String(row[h] ?? '').toLowerCase().includes(q))
            );
        }

        // Aplicar ordenamiento
        if (_sortCol) {
            data = [...data].sort((a, b) => {
                const av = a[_sortCol], bv = b[_sortCol];
                const an = parseFloat(av), bn = parseFloat(bv);
                const cmp = (!isNaN(an) && !isNaN(bn)) ? an - bn : String(av).localeCompare(String(bv));
                return _sortDir === 'asc' ? cmp : -cmp;
            });
        }

        _filteredData = data;
        const total   = data.length;
        const pages   = Math.ceil(total / _pageSize);
        _currentPage  = Math.max(1, Math.min(_currentPage, pages || 1));
        const start   = (_currentPage - 1) * _pageSize;
        const pageData= data.slice(start, start + _pageSize);

        // Info de paginación
        const infoEl = document.getElementById('dm-page-info');
        if (infoEl) infoEl.textContent = `${start+1}–${Math.min(start+_pageSize, total)} de ${total} filas`;

        // Calcular outliers si están activos
        const outlierRanges = {};
        _outlierCols.forEach(col => { outlierRanges[col] = _calcOutliers(imported.data, col); });

        const sortIcon = col => col === _sortCol ? (_sortDir === 'asc' ? ' ▲' : ' ▼') : '';

        const headers = imported.headers.map(h => `
            <th>
                <div class="dm-th-content">
                    <span class="dm-th-sort" data-col="${escapeHtml(h)}">${escapeHtml(h)}${sortIcon(h)}</span>
                    <div class="dm-th-btns">
                        <button class="dm-th-btn dm-th-rename" data-col="${escapeHtml(h)}" title="Renombrar">✏️</button>
                    </div>
                </div>
            </th>`).join('');

        return `
        <table class="dm-table">
            <thead><tr><th>#</th>${headers}</tr></thead>
            <tbody>
                ${pageData.length === 0
                    ? `<tr><td colspan="${imported.headers.length+1}" class="dm-no-results">No hay resultados para "${escapeHtml(_searchQuery)}"</td></tr>`
                    : pageData.map((row, i) => {
                        const cells = imported.headers.map(h => {
                            const val = row[h] ?? '';
                            const num = parseFloat(val);
                            let cls = '';
                            if (_outlierCols.has(h) && !isNaN(num)) {
                                const range = outlierRanges[h];
                                if (num < range.low || num > range.high) cls = ' dm-cell-outlier';
                            }
                            return `<td class="${cls}">${escapeHtml(String(val))}</td>`;
                        }).join('');
                        return `<tr><td class="dm-row-num">${start+i+1}</td>${cells}</tr>`;
                    }).join('')
                }
            </tbody>
        </table>`;
    }

    function _refreshTable() {
        const imported = _getData();
        if (!imported) return;
        const wrap = document.getElementById('dm-table-wrap');
        if (wrap) wrap.innerHTML = _renderTable(imported);
        _attachTableListeners();
    }

    // ── Utilidades de datos ───────────────
    function _getNumericCols(imported) {
        return StateManager.getNumericCols(imported);
    }

    function _countNulls(imported) {
        let count = 0;
        imported.data.forEach(row =>
            imported.headers.forEach(h => {
                const v = row[h];
                if (v === null || v === undefined || String(v).trim() === '') count++;
            })
        );
        return count;
    }

    // ── Listeners principales ─────────────
    function _attachListeners(imported) {
        // Importar — protegido por permisos
        const _doImport = () => {
            if (!PermisosManager.puede('importar_datos')) {
                PermisosManager.mostrarDenegado('importar_datos'); return;
            }
            document.querySelector('.btn-import')?.click();
        };
        document.getElementById('dm-btn-import')?.addEventListener('click', _doImport);
        document.getElementById('dm-btn-import-empty')?.addEventListener('click', _doImport);

        // Exportar
        document.getElementById('dm-btn-export')?.addEventListener('click', () => {
            _showExportModal();
        });

        // Limpiar datos
        document.getElementById('dm-btn-clear-data')?.addEventListener('click', () => {
            if (!confirm('¿Eliminar los datos cargados?')) return;
            StateManager.clearImportedData?.();
            _outlierCols.clear();
            buildView();
        });

        // Enviar a Análisis
        document.getElementById('dm-btn-send-analisis')?.addEventListener('click', () => {
            switchView('analisis');
        });

        // Herramientas — protegidas por permisos
        const _wrapEditar = (fn) => () => {
            if (!PermisosManager.puede('editar_datos')) {
                PermisosManager.mostrarDenegado('editar_datos'); return;
            }
            fn();
        };
        document.getElementById('dm-btn-clean')?.addEventListener('click', _wrapEditar(_doClean));
        document.getElementById('dm-btn-nulos')?.addEventListener('click', _wrapEditar(_doRemoveNulls));
        document.getElementById('dm-btn-norm')?.addEventListener('click', _wrapEditar(_doNormalize));
        document.getElementById('dm-btn-outliers')?.addEventListener('click', _doDetectOutliers);
        document.getElementById('dm-btn-calcol')?.addEventListener('click', _wrapEditar(_doCreateColumn));
        document.getElementById('dm-btn-dupcol')?.addEventListener('click', _wrapEditar(_doDuplicateColumn));
        document.getElementById('dm-btn-delcol')?.addEventListener('click', _wrapEditar(_doDeleteColumns));
        document.getElementById('dm-btn-replace')?.addEventListener('click', _wrapEditar(_doSearchReplace));
        document.getElementById('dm-btn-combine')?.addEventListener('click', _doCombine);

        // Búsqueda
        document.getElementById('dm-search')?.addEventListener('input', e => {
            _searchQuery  = e.target.value;
            _currentPage  = 1;
            _refreshTable();
        });

        // Paginación
        document.getElementById('dm-btn-prev')?.addEventListener('click', () => {
            if (_currentPage > 1) { _currentPage--; _refreshTable(); }
        });
        document.getElementById('dm-btn-next')?.addEventListener('click', () => {
            const imported = _getData();
            if (!imported) return;
            const pages = Math.ceil(_filteredData.length / _pageSize);
            if (_currentPage < pages) { _currentPage++; _refreshTable(); }
        });

        _attachTableListeners();

        // ★ Parámetros de control — solo si hay datos cargados
        if (imported) _attachParamsListeners(imported);
    }

    // ── Listeners de la tabla ─────────────
    function _attachTableListeners() {
        // Ordenar por columna
        document.querySelectorAll('.dm-th-sort').forEach(el => {
            el.addEventListener('click', () => {
                const col = el.dataset.col;
                if (_sortCol === col) _sortDir = _sortDir === 'asc' ? 'desc' : 'asc';
                else { _sortCol = col; _sortDir = 'asc'; }
                _refreshTable();
            });
        });

        // Renombrar columna
        document.querySelectorAll('.dm-th-rename').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const oldName = btn.dataset.col;
                const newName = prompt(`Nuevo nombre para "${oldName}":`, oldName);
                if (!newName || newName === oldName) return;

                const imported = _getData();
                if (!imported) return;

                const idx = imported.headers.indexOf(oldName);
                if (idx === -1) return;

                imported.headers[idx] = newName;
                imported.data.forEach(row => {
                    row[newName] = row[oldName];
                    delete row[oldName];
                });

                if (_sortCol === oldName) _sortCol = newName;
                if (_outlierCols.has(oldName)) { _outlierCols.delete(oldName); _outlierCols.add(newName); }

                StateManager.setImportedData(imported, StateManager.getState().fileName);
                _showToast(`✅ Columna renombrada: "${oldName}" → "${newName}"`);
                buildView();
            });
        });
    }

    // ── Listeners de parámetros de control ─
    function _attachParamsListeners(imported) {
        // Toggle colapsar/expandir panel
        const toggleHeader = document.getElementById('dm-params-toggle-header');
        const body         = document.getElementById('dm-params-body');
        const chevron      = document.getElementById('dm-params-chevron');

        const COLLAPSED_KEY = 'dm_params_collapsed';
        const isCollapsed   = sessionStorage.getItem(COLLAPSED_KEY) === 'true';
        if (isCollapsed && body) {
            body.style.display               = 'none';
            if (chevron) chevron.textContent = '▶';
        }

        toggleHeader?.addEventListener('click', () => {
            if (!body) return;
            const nowCollapsed               = body.style.display !== 'none';
            body.style.display               = nowCollapsed ? 'none' : '';
            if (chevron) chevron.textContent = nowCollapsed ? '▶' : '▼';
            sessionStorage.setItem(COLLAPSED_KEY, nowCollapsed);
        });

        // Aplicar valores globales a todas las columnas
        document.getElementById('dm-params-apply-global')?.addEventListener('click', () => {
            const min = document.getElementById('pm-g-min')?.value.trim() ?? '';
            const max = document.getElementById('pm-g-max')?.value.trim() ?? '';
            const esp = document.getElementById('pm-g-esp')?.value.trim() ?? '';

            document.querySelectorAll('.dm-params-col-row').forEach(row => {
                const col = row.querySelector('[data-type="min"]')?.dataset.col;
                if (!col) return;
                row.querySelector('[data-type="min"]').value = min;
                row.querySelector('[data-type="max"]').value = max;
                row.querySelector('[data-type="esp"]').value = esp;
            });

            _showToast('✅ Valores globales copiados a todas las columnas. Guarda para confirmar.');
        });

        // Guardar parámetros
        document.getElementById('dm-params-save')?.addEventListener('click', () => {
            // Guardar global
            const gMin = document.getElementById('pm-g-min')?.value.trim() ?? '';
            const gMax = document.getElementById('pm-g-max')?.value.trim() ?? '';
            const gEsp = document.getElementById('pm-g-esp')?.value.trim() ?? '';
            ParametrosManager.setGlobal(gMin, gMax, gEsp);

            // Guardar por columna
            document.querySelectorAll('.dm-params-col-row').forEach(row => {
                const col = row.querySelector('[data-type="min"]')?.dataset.col;
                if (!col) return;
                const min = row.querySelector('[data-type="min"]').value.trim();
                const max = row.querySelector('[data-type="max"]').value.trim();
                const esp = row.querySelector('[data-type="esp"]').value.trim();
                ParametrosManager.setColumna(col, min, max, esp);
            });

            _showToast('✅ Parámetros guardados. Se aplicarán en el próximo análisis.');
        });

        // Limpiar todos los parámetros
        document.getElementById('dm-params-reset')?.addEventListener('click', () => {
            if (!confirm('¿Limpiar todos los parámetros de control?')) return;
            ParametrosManager.reset();
            buildView();
            _showToast('✅ Parámetros limpiados.');
        });
    }

    // ── Transformaciones ──────────────────

    function _doClean() {
        const imported = _getData();
        if (!imported) return _showToast('⚠️ No hay datos cargados', true);
        let n = 0;
        imported.data.forEach(row => imported.headers.forEach(h => {
            if (typeof row[h] === 'string') {
                const c = row[h].trim().replace(/\s+/g,' ');
                if (c !== row[h]) { row[h] = c; n++; }
            }
        }));
        StateManager.setImportedData(imported, StateManager.getState().fileName);
        _refreshTable();
        _showToast(n === 0 ? '✅ No se encontraron espacios extra' : `✅ ${n} valores limpiados`);
    }

    function _doRemoveNulls() {
        const imported = _getData();
        if (!imported) return _showToast('⚠️ No hay datos cargados', true);
        const before = imported.data.length;
        imported.data = imported.data.filter(row =>
            imported.headers.every(h => {
                const v = row[h];
                return v !== null && v !== undefined && String(v).trim() !== '';
            })
        );
        imported.rowCount = imported.data.length;
        const removed = before - imported.data.length;
        StateManager.setImportedData(imported, StateManager.getState().fileName);
        buildView();
        _showToast(removed === 0 ? '✅ No se encontraron nulos' : `✅ ${removed} filas eliminadas con nulos`);
    }

    function _doNormalize() {
        const imported = _getData();
        if (!imported) return _showToast('⚠️ No hay datos cargados', true);
        const numCols = _getNumericCols(imported);
        if (!numCols.length) return _showToast('⚠️ No hay columnas numéricas', true);

        let normalized = 0, skipped = 0;

        numCols.forEach(col => {
            const vals = imported.data.map(r => parseFloat(r[col])).filter(v => !isNaN(v));
            const min = Math.min(...vals), max = Math.max(...vals), range = max - min;
            if (range === 0) return;

            const normMin = Math.min(...vals.map(v => ((v - min) / range)));
            const normMax = Math.max(...vals.map(v => ((v - min) / range)));
            if (Math.abs(normMin - 0) < 0.0001 && Math.abs(normMax - 1) < 0.0001) {
                skipped++;
                return;
            }

            imported.data.forEach(row => {
                const v = parseFloat(row[col]);
                if (!isNaN(v)) row[col] = ((v - min) / range).toFixed(4);
            });
            normalized++;
        });

        StateManager.setImportedData(imported, StateManager.getState().fileName);
        _refreshTable();

        if (normalized > 0 && skipped > 0) {
            _showToast(`✅ ${normalized} columna(s) normalizada(s), ${skipped} ya normalizada(s)`);
        } else if (normalized > 0) {
            _showToast(`✅ Normalización Min-Max en ${normalized} columna(s)`);
        } else {
            _showToast('ℹ️ Todas las columnas ya están normalizadas');
        }
    }

    function _doDetectOutliers() {
        const imported = _getData();
        if (!imported) return _showToast('⚠️ No hay datos cargados', true);
        const numCols = _getNumericCols(imported);
        if (!numCols.length) return _showToast('⚠️ No hay columnas numéricas', true);

        if (_outlierCols.size > 0) {
            _outlierCols.clear();
            _refreshTable();
            _showToast('✅ Marcas de outliers removidas');
            return;
        }

        numCols.forEach(col => _outlierCols.add(col));
        _refreshTable();

        let totalOutliers = 0;
        numCols.forEach(col => {
            const range = _calcOutliers(imported.data, col);
            imported.data.forEach(row => {
                const v = parseFloat(row[col]);
                if (!isNaN(v) && (v < range.low || v > range.high)) totalOutliers++;
            });
        });

        _showToast(`⚠️ ${totalOutliers} outlier(s) detectados y marcados en rojo. Clic de nuevo para quitar marcas.`);
    }

    function _doCreateColumn() {
        const imported = _getData();
        if (!imported) return _showToast('⚠️ No hay datos cargados', true);
        const numCols = _getNumericCols(imported);
        if (numCols.length < 2) return _showToast('⚠️ Se necesitan al menos 2 columnas numéricas', true);

        _showCalculatedColumnModal(imported, numCols);
    }

    function _showCalculatedColumnModal(imported, numCols) {
        document.getElementById('dm-calcol-modal')?.remove();

        const modal = document.createElement('div');
        modal.id = 'dm-calcol-modal';
        modal.innerHTML = `
        <div class="dm-modal-overlay" id="dm-modal-overlay"></div>
        <div class="dm-modal-card">
            <div class="dm-modal-header">
                <h3>➕ Crear columna calculada</h3>
                <button class="dm-modal-close" id="dm-modal-close">✕</button>
            </div>
            <div class="dm-modal-body">
                <div class="dm-modal-grid">
                    <div class="dm-field">
                        <label>Columna A</label>
                        <select id="dm-col-a">${numCols.map(c=>`<option>${escapeHtml(c)}</option>`).join('')}</select>
                    </div>
                    <div class="dm-field">
                        <label>Operación</label>
                        <select id="dm-op">
                            <option value="+">+ Suma</option>
                            <option value="-">- Resta</option>
                            <option value="*">× Multiplicación</option>
                            <option value="/">÷ División</option>
                        </select>
                    </div>
                    <div class="dm-field">
                        <label>Columna B</label>
                        <select id="dm-col-b">${numCols.map(c=>`<option>${escapeHtml(c)}</option>`).join('')}</select>
                    </div>
                </div>
                <div class="dm-field" style="margin-top:14px">
                    <label>Nombre de la nueva columna</label>
                    <input id="dm-col-name" type="text" placeholder="resultado" value="resultado">
                </div>
            </div>
            <div class="dm-modal-footer">
                <button class="dm-btn dm-btn-cancel" id="dm-modal-cancel">Cancelar</button>
                <button class="dm-btn dm-btn-success" id="dm-modal-confirm">✓ Crear columna</button>
            </div>
        </div>`;
        document.body.appendChild(modal);
        requestAnimationFrame(() => modal.classList.add('dm-modal-visible'));

        const close = () => { modal.classList.remove('dm-modal-visible'); setTimeout(() => modal.remove(), 250); };
        document.getElementById('dm-modal-close').addEventListener('click', close);
        document.getElementById('dm-modal-cancel').addEventListener('click', close);
        document.getElementById('dm-modal-overlay').addEventListener('click', close);

        document.getElementById('dm-modal-confirm').addEventListener('click', () => {
            const colA    = document.getElementById('dm-col-a').value;
            const colB    = document.getElementById('dm-col-b').value;
            const op      = document.getElementById('dm-op').value;
            const newName = document.getElementById('dm-col-name').value.trim() || `${colA}${op}${colB}`;

            if (colA === colB && op === '/') { _showToast('⚠️ División de una columna por sí misma siempre es 1', true); return; }
            if (imported.headers.includes(newName)) { _showToast(`⚠️ Ya existe una columna llamada "${newName}"`, true); return; }

            imported.headers.push(newName);
            imported.data.forEach(row => {
                const a = parseFloat(row[colA]), b = parseFloat(row[colB]);
                if (isNaN(a) || isNaN(b)) { row[newName] = ''; return; }
                let r;
                switch(op) {
                    case '+': r = a + b; break;
                    case '-': r = a - b; break;
                    case '*': r = a * b; break;
                    case '/': r = b !== 0 ? a / b : ''; break;
                }
                row[newName] = r !== '' ? Number(r).toFixed(4) : '';
            });

            StateManager.setImportedData(imported, StateManager.getState().fileName);
            close();
            buildView();
            _showToast(`✅ Columna "${newName}" creada`);
        });
    }

    function _doDuplicateColumn() {
        const imported = _getData();
        if (!imported) return _showToast('⚠️ No hay datos cargados', true);
        if (!imported.headers.length) return _showToast('⚠️ No hay columnas disponibles', true);

        document.getElementById('dm-dupcol-modal')?.remove();

        const modal = document.createElement('div');
        modal.id = 'dm-dupcol-modal';
        modal.innerHTML = `
        <div class="dm-modal-overlay" id="dm-dupcol-overlay"></div>
        <div class="dm-modal-card">
            <div class="dm-modal-header">
                <h3>📋 Duplicar columna</h3>
                <button class="dm-modal-close" id="dm-dupcol-close">✕</button>
            </div>
            <div class="dm-modal-body">
                <div class="dm-field">
                    <label>Columna a duplicar</label>
                    <select id="dm-dupcol-source">
                        ${imported.headers.map(h=>`<option value="${escapeHtml(h)}">${escapeHtml(h)}</option>`).join('')}
                    </select>
                </div>
                <div class="dm-field" style="margin-top:14px">
                    <label>Nombre de la nueva columna</label>
                    <input id="dm-dupcol-name" type="text" placeholder="nombre_copia" value="">
                </div>
            </div>
            <div class="dm-modal-footer">
                <button class="dm-btn dm-btn-cancel" id="dm-dupcol-cancel">Cancelar</button>
                <button class="dm-btn dm-btn-success" id="dm-dupcol-confirm">📋 Duplicar</button>
            </div>
        </div>`;
        document.body.appendChild(modal);
        requestAnimationFrame(() => modal.classList.add('dm-modal-visible'));

        const sourceSelect = document.getElementById('dm-dupcol-source');
        const nameInput = document.getElementById('dm-dupcol-name');
        nameInput.value = sourceSelect.value + '_copia';

        sourceSelect.addEventListener('change', () => {
            nameInput.value = sourceSelect.value + '_copia';
        });

        const close = () => { modal.classList.remove('dm-modal-visible'); setTimeout(() => modal.remove(), 250); };
        document.getElementById('dm-dupcol-close').addEventListener('click', close);
        document.getElementById('dm-dupcol-cancel').addEventListener('click', close);
        document.getElementById('dm-dupcol-overlay').addEventListener('click', close);

        document.getElementById('dm-dupcol-confirm').addEventListener('click', () => {
            const sourceCol = sourceSelect.value;
            const newName = nameInput.value.trim();

            if (!newName) return _showToast('⚠️ Escribe un nombre para la nueva columna', true);
            if (imported.headers.includes(newName)) return _showToast(`⚠️ Ya existe una columna llamada "${newName}"`, true);

            imported.headers.push(newName);
            imported.data.forEach(row => {
                row[newName] = row[sourceCol];
            });

            StateManager.setImportedData(imported, StateManager.getState().fileName);
            close();
            buildView();
            _showToast(`✅ Columna "${sourceCol}" duplicada como "${newName}"`);
        });
    }

    function _doDeleteColumns() {
        const imported = _getData();
        if (!imported) return _showToast('⚠️ No hay datos cargados', true);

        document.getElementById('dm-delcol-modal')?.remove();
        const modal = document.createElement('div');
        modal.id = 'dm-delcol-modal';
        modal.innerHTML = `
        <div class="dm-modal-overlay" id="dm-delcol-overlay"></div>
        <div class="dm-modal-card">
            <div class="dm-modal-header">
                <h3>✂️ Eliminar columnas</h3>
                <button class="dm-modal-close" id="dm-delcol-close">✕</button>
            </div>
            <div class="dm-modal-body">
                <p style="font-size:0.85rem;color:#666;margin-bottom:14px">Selecciona las columnas a eliminar:</p>
                <div class="dm-col-checks">
                    ${imported.headers.map(h => `
                    <label class="dm-check-row">
                        <input type="checkbox" value="${escapeHtml(h)}">
                        <span>${escapeHtml(h)}</span>
                    </label>`).join('')}
                </div>
            </div>
            <div class="dm-modal-footer">
                <button class="dm-btn dm-btn-success" id="dm-delcol-cancel">Cancelar</button>
                <button class="dm-btn dm-btn-danger" id="dm-delcol-confirm">✂️ Eliminar seleccionadas</button>
            </div>
        </div>`;
        document.body.appendChild(modal);
        requestAnimationFrame(() => modal.classList.add('dm-modal-visible'));

        const close = () => { modal.classList.remove('dm-modal-visible'); setTimeout(() => modal.remove(), 250); };
        document.getElementById('dm-delcol-close').addEventListener('click', close);
        document.getElementById('dm-delcol-cancel').addEventListener('click', close);
        document.getElementById('dm-delcol-overlay').addEventListener('click', close);

        document.getElementById('dm-delcol-confirm').addEventListener('click', () => {
            const toDelete = [...modal.querySelectorAll('input[type=checkbox]:checked')].map(cb => cb.value);
            if (!toDelete.length) return _showToast('⚠️ Selecciona al menos una columna', true);
            if (toDelete.length === imported.headers.length) return _showToast('⚠️ No puedes eliminar todas las columnas', true);

            imported.headers = imported.headers.filter(h => !toDelete.includes(h));
            imported.data.forEach(row => toDelete.forEach(h => delete row[h]));
            toDelete.forEach(h => _outlierCols.delete(h));

            StateManager.setImportedData(imported, StateManager.getState().fileName);
            close();
            buildView();
            _showToast(`✅ ${toDelete.length} columna(s) eliminada(s)`);
        });
    }

    function _doSearchReplace() {
        const imported = _getData();
        if (!imported) return _showToast('⚠️ No hay datos cargados', true);

        const find    = document.getElementById('dm-sr-find')?.value;
        const replace = document.getElementById('dm-sr-replace')?.value ?? '';
        const col     = document.getElementById('dm-sr-col')?.value;

        if (!find) return _showToast('⚠️ Escribe un valor a buscar', true);

        let n = 0;
        const cols = col === '__all__' ? imported.headers : [col];

        imported.data.forEach(row => {
            cols.forEach(h => {
                if (String(row[h] ?? '').includes(find)) {
                    row[h] = String(row[h]).replaceAll(find, replace);
                    n++;
                }
            });
        });

        StateManager.setImportedData(imported, StateManager.getState().fileName);
        _refreshTable();
        _showToast(n === 0 ? `⚠️ No se encontró "${find}"` : `✅ ${n} reemplazo(s) realizados`, n === 0);
    }

    function _doCombine() {
        _showToast('📋 Importa un segundo archivo — se combinará con el actual automáticamente');
    }

    return { buildView, _doExport, _showExportModal };

})();

console.log('✅ DatosManager cargado');