// Analisis Page - StatAnalyzer Pro
export default function() {
    return `
        <div class="page-content">
            <div class="page-panel">
                <h2 class="page-panel-title">🔬 Pruebas Estadísticas</h2>
                
                <div class="test-grid">
                    <div class="test-card">
                        <div class="test-icon">📊</div>
                        <div class="test-name">Estadística Descriptiva</div>
                        <div class="test-desc">Media, mediana, moda, varianza</div>
                    </div>
                    <div class="test-card">
                        <div class="test-icon">📈</div>
                        <div class="test-name">Regresión Lineal</div>
                        <div class="test-desc">Ajuste lineal simple</div>
                    </div>
                    <div class="test-card">
                        <div class="test-icon">⚖️</div>
                        <div class="test-name">t-Test</div>
                        <div class="test-desc">Comparación de medias</div>
                    </div>
                    <div class="test-card">
                        <div class="test-icon">📦</div>
                        <div class="test-name">ANOVA</div>
                        <div class="test-desc">Análisis de varianza</div>
                    </div>
                </div>
                
                <div style="margin-top: 16px;">
                    <button class="page-btn page-btn-primary">🚀 Ejecutar Todos los Tests</button>
                </div>
            </div>
            
            <style>
                .test-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                    gap: 12px;
                    margin-top: 16px;
                }
                .test-card {
                    background: #3a3a3a;
                    border-radius: 10px;
                    padding: 16px;
                    cursor: pointer;
                    transition: transform 0.2s, background 0.2s;
                }
                .test-card:hover {
                    transform: translateY(-2px);
                    background: #4a4a4a;
                }
                .test-icon { font-size: 24px; margin-bottom: 8px; }
                .test-name { color: #ddd; font-size: 13px; font-weight: 500; }
                .test-desc { color: #666; font-size: 11px; margin-top: 4px; }
            </style>
        </div>
    `;
}