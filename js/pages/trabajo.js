// Trabajo Page - StatAnalyzer Pro
export default function() {
    return `
        <div class="page-content">
            <div class="page-panel">
                <h2 class="page-panel-title">📋 Hoja de Trabajo</h2>
                
                <div class="page-toolbar">
                    <button class="page-btn page-btn-secondary">🗑️ Limpiar</button>
                    <button class="page-btn page-btn-secondary">💾 Guardar</button>
                    <button class="page-btn page-btn-primary">🔄 Generar</button>
                </div>

                <table class="data-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Var1</th>
                            <th>Var2</th>
                            <th>Var3</th>
                            <th>Var4</th>
                            <th>Var5</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>45.2</td>
                            <td>23.1</td>
                            <td>67.8</td>
                            <td>89.1</td>
                            <td>✓</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>53.4</td>
                            <td>71.6</td>
                            <td>42.9</td>
                            <td>38.7</td>
                            <td>✓</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <style>
                .data-table { width: 100%; border-collapse: collapse; }
                .data-table th, .data-table td {
                    padding: 10px 12px;
                    text-align: left;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                }
                .data-table th { color: #888; font-weight: 500; font-size: 12px; }
                .data-table td { color: #ddd; font-size: 13px; }
                .data-table tr:hover td { background: rgba(255,255,255,0.05); }
            </style>
        </div>
    `;
}
