# Sistema de ML Modular

Pipeline completo de Machine Learning con soporte para múltiples fuentes de datos,
detección automática de variables y tipos de problema, y múltiples algoritmos.

---

## Estructura del proyecto

```
ml_modular/
├── config.py         # Configuración global: fuentes, modelos, parámetros
├── data_loader.py    # Carga desde CSV, Excel, API REST, SQL o múltiples fuentes
├── preprocessor.py   # Detección automática de columnas y preprocesamiento
├── trainer.py        # Entrenamiento con CV, bootstrap, múltiples algoritmos
├── evaluator.py      # Métricas y visualizaciones por tipo de problema
├── model_store.py    # Guardado y carga de modelos con joblib
└── main.py           # Orquestador: punto de entrada único
```

---

## Instalación de dependencias

```bash
pip install numpy pandas scikit-learn matplotlib seaborn joblib openpyxl
pip install requests sqlalchemy          # para API y SQL
pip install xgboost                      # para modelo XGBoost
pip install psycopg2-binary              # para PostgreSQL
pip install pymysql                      # para MySQL
```

---

## Uso rápido

### Demo con datos sintéticos
```bash
python main.py
```

### Desde Python

```python
from main import run_pipeline, interactive_cli
from evaluator import predict
import pandas as pd
```

---

## Ejemplos de uso

### CSV local
```python
resultado = run_pipeline(
    source        = 'csv',
    source_kwargs = {'path': 'datos/estudiantes.csv', 'sep': ';'},
    target        = 'aprobado',
    model_key     = 'rf',
)
```

### Excel
```python
resultado = run_pipeline(
    source        = 'excel',
    source_kwargs = {'path': 'datos/notas.xlsx', 'sheet_name': 'Hoja1'},
    target        = 'nota_final',
    model_key     = 'xgb',
    problem_type  = 'regression',
)
```

### API REST
```python
resultado = run_pipeline(
    source        = 'api',
    source_kwargs = {
        'url':         'https://mi-api.com/v1/estudiantes',
        'headers':     {'Authorization': 'Bearer TOKEN_AQUI'},
        'record_path': 'data',     # clave JSON que contiene la lista
    },
    target        = 'resultado',
    model_key     = 'mlp',
)
```

### Base de datos SQL
```python
resultado = run_pipeline(
    source        = 'sql',
    source_kwargs = {
        'query':             'SELECT * FROM estudiantes WHERE anio = 2024',
        'connection_string': 'postgresql://usuario:pass@localhost:5432/escuela',
    },
    target        = 'rendimiento',
    model_key     = 'rf',
)
```

### Múltiples fuentes combinadas (merge)
```python
resultado = run_pipeline(
    source        = 'multi',
    source_kwargs = {
        'sources': [
            {'type': 'csv',   'path': 'notas.csv'},
            {'type': 'excel', 'path': 'asistencia.xlsx'},
            {'type': 'api',
             'url':  'https://api.com/estres',
             'record_path': 'records'},
        ],
        'join_on':  'student_id',    # columna clave para merge
        'join_how': 'inner',         # inner | outer | left | right
    },
    target        = 'aprobado',
    model_key     = 'xgb',
)
```

### Múltiples fuentes combinadas (concat vertical — mismas columnas)
```python
resultado = run_pipeline(
    source        = 'multi',
    source_kwargs = {
        'sources': [
            {'type': 'csv', 'path': 'semestre_1.csv'},
            {'type': 'csv', 'path': 'semestre_2.csv'},
        ],
        # sin join_on → pd.concat vertical
    },
    target        = 'aprobado',
    model_key     = 'logistic',
)
```

---

## Modelos disponibles

| Clave       | Clasificación binaria | Multiclase | Regresión |
|-------------|:-------------------:|:----------:|:---------:|
| `logistic`  | ✔ (Logistic Reg.)   | ✔ (Softmax)|           |
| `mlp`       | ✔                   | ✔          | ✔         |
| `rf`        | ✔                   | ✔          | ✔         |
| `xgb`       | ✔                   | ✔          | ✔         |
| `linear`    |                     |            | ✔         |

---

## Detección automática

El sistema detecta automáticamente:

| Qué detecta                | Lógica                                           |
|----------------------------|--------------------------------------------------|
| Tipo de problema           | 2 únicos → binario · ≤20 únicos → multiclase · continuo → regresión |
| Features numéricas         | `int64`, `float64`, `int32`, `float32`           |
| Features categóricas       | `object`, `category`, `bool`                     |
| Valores nulos              | Mediana (numéricas) · Moda (categóricas)         |
| Codificación target texto  | LabelEncoder automático                          |

---

## Cargar y usar un modelo guardado

```python
from model_store import load_model
from evaluator   import predict
import pandas as pd

payload  = load_model('modelo_demo.pkl')
pipeline = payload['pipeline']
meta     = payload['meta']
boots    = payload['bootstrap_models']

nuevos   = pd.DataFrame({'horas_estudio': [3, 7, 10], ...})
preds    = predict(pipeline, nuevos, meta, boots)
print(preds)
```

---

## Parámetros de run_pipeline

| Parámetro         | Tipo    | Default       | Descripción                                      |
|-------------------|---------|---------------|--------------------------------------------------|
| `source`          | str     | `'synthetic'` | Fuente de datos                                  |
| `source_kwargs`   | dict    | `{}`          | Argumentos del cargador                          |
| `target`          | str     | `'aprobado'`  | Nombre de la columna objetivo                    |
| `exclude_cols`    | list    | `None`        | Columnas a ignorar (IDs, fechas, etc.)           |
| `model_key`       | str     | `'rf'`        | Algoritmo: logistic, mlp, rf, xgb, linear       |
| `problem_type`    | str     | `'auto'`      | auto, binary, multiclass, regression             |
| `model_kwargs`    | dict    | `{}`          | Hiperparámetros extra del modelo                 |
| `test_size`       | float   | `0.2`         | Proporción del set de test                       |
| `cv_folds`        | int     | `5`           | Número de folds en validación cruzada            |
| `run_bootstrap_ci`| bool    | `True`        | Calcular intervalos de confianza bootstrap       |
| `n_bootstraps`    | int     | `100`         | Número de modelos bootstrap                      |
| `save_path`       | str     | `None`        | Ruta para guardar el modelo (None = no guardar)  |
| `X_new`           | DataFrame| `None`       | Nuevas observaciones a predecir                  |
