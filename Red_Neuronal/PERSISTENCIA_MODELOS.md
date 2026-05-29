# Sistema de Persistencia de Modelos ML

## 📋 Descripción General

El sistema ahora incluye persistencia automática de modelos entrenados. Cuando entrenas un modelo, este se guarda automáticamente en la carpeta `modelos_guardados/` con:

- ✔️ **Modelo entrenado** (.pkl compilado)
- ✔️ **Metadatos completos** (fecha, algoritmo, dataset, parámetros)
- ✔️ **Métricas de desempeño** (Accuracy, F1-Score, AUC-ROC, etc.)
- ✔️ **Registro centralizado** (modelo_registro.json)

## 🗂️ Estructura de Almacenamiento

```
Red Neuronal/
├── main.py
├── model_manager.py          # [NUEVO] Gestor de modelos
├── modelos_guardados/        # [NUEVO] Carpeta de almacenamiento
│   ├── modelo_registro.json  # [NUEVO] Registro de todos los modelos
│   ├── modelo_001_rf_entrenamiento_temporal_20240418_143022.pkl
│   ├── modelo_002_xgb_entrenamiento_financiero_20240418_144015.pkl
│   └── ...
└── datos/
```

## 🚀 Flujo de Uso

### 1️⃣ Entrenar y Guardar Automáticamente

```bash
python main.py
```

**Menú principal:**
```
═════════════════════════════════════
  SISTEMA ML MODULAR - MENÚ PRINCIPAL
═════════════════════════════════════

  Opciones:

    1) Entrenar NUEVO modelo
    2) Cargar modelo EXISTENTE
    3) Ver historial de modelos
    4) Eliminar un modelo
    0) Salir
```

**Selecciona opción 1:**
- Elige un dataset de ejemplo
- El modelo se entrena automáticamente
- Se guarda en `modelos_guardados/` con ID único (ej: `modelo_001`)
- Se registra en `modelo_registro.json`

### 2️⃣ Ver Historial de Modelos

**Selecciona opción 3:**

```
═════════════════════════════════════════════════════════════════════
  HISTORIAL DE MODELOS ENTRENADOS
═════════════════════════════════════════════════════════════════════

  #    ID           Algoritmo   Problema      Dataset                 Fecha            Métricas
  ────────────────────────────────────────────────────────────────────────────────────────────
  1    modelo_001   rf          binary        entrenamiento_tempor...  2024-04-18 14:30 Acc: 0.847 | F1: 0.823
  2    modelo_002   xgb         binary        entrenamiento_financi... 2024-04-18 14:40 Acc: 0.912 | F1: 0.905
```

### 3️⃣ Cargar un Modelo Existente

**Selecciona opción 2:**
- Se muestra el historial de modelos
- Ingresa el número o ID del modelo a cargar (ej: `modelo_001`)
- El modelo se carga completamente
- Puedes hacer predicciones inmediatas

**Información mostrada:**
```
  ✔ Modelo cargado: 'modelo_001'
    Algoritmo: RF
    Dataset: entrenamiento_temporal.csv
    Problema: BINARY
    Métricas:
      accuracy: 0.8470
      f1_score: 0.8234
      auc_roc: 0.9102
      precision: 0.8567
      recall: 0.7934
```

### 4️⃣ Hacer Predicciones

Después de cargar un modelo:
- Opción 1: Predicciones en nuevos datos (modo interactivo)
- Opción 2: Volver al menú

```
  ¿Qué deseas hacer?

    1) Hacer predicciones en nuevos datos
    2) Volver al menú principal
```

**Modo interactivo de predicción:**
```
═══════════════════════════════════════════════════
  MODO INTERACTIVO - PREDICCION MANUAL
  Features: ['horas_estudio', 'asistencia_pct', 'promedio_previo', ...]
  Escribe 'salir' para terminar
═══════════════════════════════════════════════════

  horas_estudio (numerico): 7.5
  asistencia_pct (numerico): 85
  promedio_previo (numerico): 80
  horas_sueno (numerico): 7
  actividades_extra (numerico): 2
  nivel_estres (numerico): 5

  ──────────────────────────
  Prediccion : Aprobado
  Confianza  : Muy alta (92.3%)
  Alternativa: Rechazado (7.7%)
```

### 5️⃣ Eliminar un Modelo

**Selecciona opción 4:**
- Se muestra el historial
- Ingresa el ID del modelo a eliminar
- Confirmación y eliminación

## 📊 Información Registrada por Modelo

Cada modelo guardado registra:

```json
{
  "modelo_001": {
    "id": "modelo_001",
    "filename": "modelo_001_rf_entrenamiento_temporal_20240418_143022.pkl",
    "model_key": "rf",
    "dataset_name": "entrenamiento_temporal.csv",
    "problem_type": "binary",
    "created_at": "2024-04-18T14:30:22.123456",
    "file_size_mb": 15.42,
    "target_col": "aprobado",
    "num_features": 6,
    "cat_features": 0,
    "metrics": {
      "accuracy": 0.847,
      "f1_score": 0.8234,
      "auc_roc": 0.9102,
      "precision": 0.8567,
      "recall": 0.7934
    },
    "train_params": {
      "source": "csv",
      "model_key": "rf",
      "problem_type": "binary",
      "test_size": 0.2,
      "cv_folds": 5,
      "n_bootstraps": 80
    },
    "target_classes": [0, 1]
  }
}
```

## 🔧 Uso Programático

### Cargar un modelo entrenado

```python
from model_manager import ModelManager

manager = ModelManager()

# Listar todos los modelos
modelos = manager.list_models()
print(modelos)  # Lista de dicts con información

# Cargar un modelo específico
payload = manager.load_model("modelo_001")

# Acceder a componentes
pipeline = payload['pipeline']
meta = payload['meta']
bootstrap_models = payload.get('bootstrap_models', [])

# Hacer predicciones
from evaluator import predict
import pandas as pd

nuevos_datos = pd.DataFrame({
    'horas_estudio': [7.5, 5.0, 9.0],
    'asistencia_pct': [85, 70, 95],
    # ... más features
})

predicciones = predict(pipeline, nuevos_datos, meta, bootstrap_models)
```

### Usar en otras secciones del proyecto

```python
# En cualquier módulo de tu proyecto
from model_manager import ModelManager
from evaluator import predict

# Cargar el modelo más reciente
manager = ModelManager()
modelos = manager.list_models()

if modelos:
    modelo = manager.load_model(modelos[0]['id'])
    
    # Usar para predicciones
    pipeline = modelo['pipeline']
    meta = modelo['meta']
    
    # ... hacer predicciones
```

## 🎯 Ventajas del Sistema

| Característica | Beneficio |
|---|---|
| **Persistencia** | Entrenamientos disponibles entre sesiones |
| **Automatización** | Guardado automático sin intervención manual |
| **Metadatos** | Información completa de cada entrenamiento |
| **Organización** | Estructura clara y centralizada |
| **Rastreabilidad** | Historial completo con fechas y métricas |
| **Reutilización** | Modelos accesibles desde cualquier módulo |
| **Versionado implícito** | Múltiples versiones del mismo modelo |

## 📝 Cambios Realizados

### Nuevos archivos:
- ✅ `model_manager.py` - Gestor centralizado de modelos
- ✅ `test_model_persistence.py` - Script de prueba del sistema

### Archivos modificados:
- ✅ `main.py` - Menú interactivo con 4 opciones + guardado automático

### Nuevas carpetas:
- ✅ `modelos_guardados/` - Almacenamiento de modelos

## ⚙️ Configuración

El sistema está pre-configurado, pero puedes personalizarlo:

```python
from model_manager import ModelManager

# Usar directorio personalizado
manager = ModelManager(base_dir="/ruta/personalizada/modelos")

# Operaciones estándar
models = manager.list_models()
payload = manager.load_model("modelo_001")
manager.delete_model("modelo_001")
```

## 🧪 Prueba el Sistema

```bash
# Test completo
python test_model_persistence.py

# Uso interactivo
python main.py
```

## 📌 Notas Importantes

1. **Guardado automático**: Cada entrenamiento se guarda automáticamente (parámetro `auto_save=True`)
2. **IDs únicos**: Cada modelo recibe un ID único auto-incrementado (modelo_001, modelo_002, etc.)
3. **Nombrado inteligente**: Los archivos incluyen algoritmo, dataset y fecha para fácil identificación
4. **Registro JSON**: Central de control con metadatos de todos los entrenamientos
5. **Bootstrap**: Se incluyen modelos bootstrap para intervalos de confianza

## 🔮 Próximas Mejoras Posibles

- Comparar métricas entre modelos
- Exportar modelos a formatos estándar (ONNX, PMML)
- Versioning automático de hiperparámetros
- Dashboard web de modelos
- API REST para cargar modelos remotamente
