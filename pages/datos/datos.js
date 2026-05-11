// Datos Page - StatAnalyzer Pro
export default function() {
    return `
        <div class="page-content">
            <div class="page-panel">
                <h2 class="page-panel-title">📊 Gestión de Datos</h2>
                
                <div class="page-toolbar">
                    <button class="page-btn page-btn-primary">📁 Importar CSV</button>
                    <button class="page-btn page-btn-secondary">📋 Importar Excel</button>
                </div>

                <div class="dropzone">
                    <div class="dropzone-icon">📂</div>
                    <div>Arrastra archivos aquí o haz clic para seleccionar</div>
                    <div style="font-size: 12px; margin-top: 8px; color: #666;">CSV, XLSX, JSON soportados</div>
                </div>
            </div>
            
            <style>
                .dropzone {
                    border: 2px dashed #444;
                    border-radius: 12px;
                    padding: 40px;
                    text-align: center;
                    color: #666;
                    cursor: pointer;
                    margin-top: 16px;
                }
                .dropzone:hover {
                    border-color: var(--accent);
                    background: rgba(124,106,247,0.1);
                }
                .dropzone-icon { font-size: 48px; margin-bottom: 12px; }
            </style>
        </div>
    `;
}