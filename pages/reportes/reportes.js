// Reportes Page - StatAnalyzer Pro
export default function() {
    return `
        <div class="page-content">
            <div class="page-panel">
                <h2 class="page-panel-title">📄 Reportes</h2>
                
                <div class="page-toolbar">
                    <button class="page-btn page-btn-primary">➕ Nuevo</button>
                </div>

                <div class="report-list">
                    <div class="report-card">
                        <div class="report-icon">📊</div>
                        <div class="report-info">
                            <div class="report-name">Análisis Descriptivo Completo</div>
                            <div class="report-meta">Generado • 15/ene/2026 • PDF</div>
                        </div>
                    </div>
                    <div class="report-card">
                        <div class="report-icon">📈</div>
                        <div class="report-info">
                            <div class="report-name">Regresión Lineal_2026</div>
                            <div class="report-meta">Borrador • 10/ene/2026</div>
                        </div>
                    </div>
                    <div class="report-card">
                        <div class="report-icon">⚖️</div>
                        <div class="report-info">
                            <div class="report-name">Comparación de Grupos</div>
                            <div class="report-meta">Exportado • 05/ene/2026 • DOCX</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <style>
                .report-list { display: flex; flex-direction: column; gap: 12px; margin-top: 16px; }
                .report-card {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    background: #3a3a3a;
                    border-radius: 10px;
                    padding: 16px;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                .report-card:hover { background: #4a4a4a; }
                .report-icon { font-size: 28px; }
                .report-name { color: #ddd; font-size: 14px; font-weight: 500; }
                .report-meta { color: #666; font-size: 12px; margin-top: 4px; }
            </style>
        </div>
    `;
}