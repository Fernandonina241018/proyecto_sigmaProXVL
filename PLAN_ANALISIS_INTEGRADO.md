# Plan: Integración Análisis Estadístico + ML

## Visión
Unificar los dos frentes del proyecto:
- **Frontend JS** (StatsUtils.js, EDAManager.js, EstadisticaDescriptiva.js) → análisis del lado del cliente
- **Backend Python ML** (ml_service/main.py) → modelos predictivos server-side

Crear un endpoint `/api/ml/analyze` que devuelva estadística clásica + insights del modelo en una sola respuesta.

---

## Paso 1: Endpoint `/api/ml/analyze` en `ml_service/main.py`

```python
class AnalyzeRequest(BaseModel):
    data: list
    columns: list[str]
    model_id: Optional[str] = None
    target: Optional[str] = None
```

**Respuesta:**
```json
{
  "descriptiva": {
    "columnas": [
      {"nombre": "mpg", "n": 200, "media": 23.5, "mediana": 22.8,
       "de": 4.2, "min": 10.2, "max": 35.1, "q1": 18.5, "q3": 27.3,
       "asimetria": 0.3, "curtosis": -0.8, "outliers_iqr": ["fila 3"]}
    ],
    "n_filas": 200,
    "n_columnas": 5,
    "n_categoricas": 2,
    "n_numericas": 3,
    "nulos": {"total": 0, "porcentaje": 0}
  },
  "correlaciones": [
    {"x": "mpg", "y": "l_per_100km", "pearson": -0.89, "spearman": -0.91}
  ],
  "normalidad": [
    {"columna": "mpg", "jarque_bera": 1.23, "p_valor": 0.54, "es_normal": true}
  ],
  "modelo": {
    "importancia_features": {"l_per_100km": 0.85},
    "metricas": {"r2": 0.87, "rmse": 2.3},
    "calidad_prediccion": "buena"
  }
}
```

## Paso 2: Crear `ml_service/analyzer.py`

Portar funciones de JS a Python (scipy):

| JS (`StatsUtils.js`) | Python (`analyzer.py`) |
|---|---|
| `getNumericValues()` | `_get_numeric_cols(df)` |
| `calcularMedia()`, `calcularMediana()` etc. | `describe_col(df[col])` — `df.describe()` |
| `detectarOutliersIQR()` | `detect_outliers_iqr(df[col])` |
| `calcularCorrelacionPearson()` | `df.corr(method='pearson')` |
| `calcularCorrelacionSpearman()` | `df.corr(method='spearman')` |
| `calcularTestNormalidad()` | `scipy.stats.jarque_bera()` |
| `calcularShapiroWilk()` | `scipy.stats.shapiro()` |
| `calcularTTestDosMuestras()` | `scipy.stats.ttest_ind()` |
| `calcularANOVA()` | `scipy.stats.f_oneway()` |

## Paso 3: Enriquecer con modelo

Si se pasa `model_id`:
1. Cargar pipeline del modelo
2. Predecir sobre los datos
3. Extraer feature importance
4. Calcular intervalos de confianza (bootstrap)
5. Devolver todo junto

## Paso 4: UI unificada en `ml.js`

Nueva función `analyzeData(data, modelId?)`:
- Fetch a `POST /api/ml/analyze`
- Renderizar reporte con tabs:
  - 📊 Descriptiva
  - 📈 Correlaciones
  - 🧪 Normalidad
  - 🤖 Modelo

## Paso 5: Botón "Analizar" en modal de predicción

Agregar toggle/botón extra en el modal:
```
[🔮 Predecir] [📊 Analizar]
```

## Archivos a modificar

| Archivo | Acción |
|---|---|
| `ml_service/analyzer.py` | **Crear** |
| `ml_service/main.py` | **Modificar** — agregar endpoint |
| `ml_service/requirements.txt` | **Modificar** — agregar `scipy` |
| `js/pages/ml.js` | **Modificar** — agregar analyzeData() |

## Prioridad: BAJA
Volver a esto después de resolver bugs activos.
