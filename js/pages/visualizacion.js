// Visualizacion Page - StatAnalyzer Pro
export default function() {
    return `
        <div class="page-content">
            <div class="page-panel">
                <h2 class="page-panel-title">📈 Gráficos</h2>
                
                <div class="chart-grid">
                    <div class="chart-card">
                        <div class="chart-icon">📊</div>
                        <div class="chart-name">Barras</div>
                    </div>
                    <div class="chart-card">
                        <div class="chart-icon">📈</div>
                        <div class="chart-name">Líneas</div>
                    </div>
                    <div class="chart-card">
                        <div class="chart-icon">⚬</div>
                        <div class="chart-name">Dispersión</div>
                    </div>
                    <div class="chart-card">
                        <div class="chart-icon">◉</div>
                        <div class="chart-name">Circular</div>
                    </div>
                    <div class="chart-card">
                        <div class="chart-icon">📦</div>
                        <div class="chart-name">Caja</div>
                    </div>
                </div>
                
                <div style="margin-top: 16px;">
                    <button class="page-btn page-btn-primary">Exportar SVG</button>
                    <button class="page-btn page-btn-secondary">Exportar PNG</button>
                </div>
            </div>
            
            <style>
                .chart-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
                    gap: 12px;
                    margin-top: 16px;
                }
                .chart-card {
                    background: #3a3a3a;
                    border-radius: 10px;
                    padding: 20px;
                    text-align: center;
                    cursor: pointer;
                    transition: transform 0.2s, background 0.2s;
                }
                .chart-card:hover {
                    transform: translateY(-2px);
                    background: #4a4a4a;
                }
                .chart-icon { font-size: 32px; margin-bottom: 8px; }
                .chart-name { color: #ddd; font-size: 12px; }
            </style>
        </div>
    `;
}