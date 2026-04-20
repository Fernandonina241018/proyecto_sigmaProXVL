"""
DEMO_anomaly_detector.py - Demostración del módulo de detección de anomalías

Muestra:
  1. Detección de outliers en datos
  2. Reporte de calidad de datos
  3. Análisis de desbalance de clases
  4. Recomendaciones para SMOTE
  5. Detección de anomalías en predicciones
  6. Data drift detection
"""

import sys
import os
from pathlib import Path

# ─────────────────────────────────────────────────────────────────────────
# MANEJO DE PATHS EN WINDOWS
# ─────────────────────────────────────────────────────────────────────────

# Obtener directorio del script actual
SCRIPT_DIR = Path(__file__).resolve().parent
BASE_DIR = SCRIPT_DIR

# Agregar al path de Python para importar módulos locales
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

print(f"📁 Directorio base: {BASE_DIR}")
print(f"🐍 Python version: {sys.version.split()[0]}")

# ─────────────────────────────────────────────────────────────────────────
# IMPORTS
# ─────────────────────────────────────────────────────────────────────────

try:
    import numpy as np
    import pandas as pd
    print("✓ numpy, pandas importados")
except ImportError as e:
    print(f"❌ Error: {e}")
    print("   Instala con: pip install numpy pandas")
    sys.exit(1)

try:
    from data_loader import load_data
    from preprocessor import prepare_data
    from trainer import train
    from evaluator import evaluate
    from anomaly_detector import (
        detect_outliers,
        plot_outliers,
        data_quality_report,
        print_quality_report,
        recommend_imbalance_handling,
        apply_smote,
        detect_prediction_anomalies,
        print_anomaly_report,
        detect_feature_drift,
        print_drift_report,
        comprehensive_anomaly_analysis,
    )
    print("✓ Módulos locales importados")
except ImportError as e:
    print(f"❌ Error importando módulos: {e}")
    print(f"   Verifica que existen todos los módulos necesarios")
    sys.exit(1)


def demo_outlier_detection():
    """Demo 1: Detección de outliers."""
    
    print("\n" + "="*80)
    print("  🚨 DEMO 1: DETECCIÓN DE OUTLIERS")
    print("="*80)
    
    # Crear datos con outliers obvios
    np.random.seed(42)
    n_normal = 80
    n_outliers = 10
    
    # Datos normales
    X_normal = pd.DataFrame({
        'edad': np.random.normal(40, 10, n_normal),
        'ingresos': np.random.normal(50000, 15000, n_normal),
        'deuda': np.random.normal(20000, 10000, n_normal),
    })
    
    # Outliers (valores extremos)
    X_outliers = pd.DataFrame({
        'edad': [5, 150, 200, -10] + [np.random.normal(40, 10) for _ in range(6)],
        'ingresos': [1000000, -50000, 5000000] + [np.random.normal(50000, 15000) for _ in range(7)],
        'deuda': [50000000, -1000000] + [np.random.normal(20000, 10000) for _ in range(8)],
    })[:n_outliers]
    
    # Combinar
    X = pd.concat([X_normal, X_outliers], ignore_index=True)
    
    print(f"\n✓ Datos creados: {len(X)} muestras (80 normales + 10 outliers sintéticos)")
    
    # Detectar outliers con Isolation Forest
    print("\n[Detectando Outliers con Isolation Forest]")
    try:
        outliers_if = detect_outliers(X, method="isolation_forest", contamination=0.15, verbose=True)
    except Exception as e:
        print(f"⚠️  Error: {e}")
        return
    
    # Visualizar
    print("\n[Visualización de Outliers]")
    try:
        plot_outliers(X, outliers_if['outlier_mask'], 
                     title="Detección de Outliers (Isolation Forest)")
    except Exception as e:
        print(f"⚠️  Error visualizando: {e}")
    
    print("\n✅ Demo de outliers completada\n")


def demo_data_quality():
    """Demo 2: Reporte de calidad de datos."""
    
    print("\n" + "="*80)
    print("  📊 DEMO 2: REPORTE DE CALIDAD DE DATOS")
    print("="*80)
    
    # Crear dataset con problemas comunes
    np.random.seed(42)
    n = 100
    
    X = pd.DataFrame({
        'edad': np.random.randint(18, 80, n),
        'ingresos': [np.random.randint(10000, 100000) if i % 15 != 0 else np.nan 
                     for i in range(n)],  # 7% valores faltantes
        'deuda': np.random.randint(0, 50000, n),
        'email': ['user@example.com'] * n,  # Feature de texto
    })
    
    # Crear algunos duplicados
    X = pd.concat([X, X.iloc[:5]], ignore_index=True)
    
    # Target desbalanceado
    y = pd.Series(
        [1] * 60 + [0] * 30 + [1] * 5 + [0] * 10,  # 65 positivos, 40 negativos
        name='aprobado'
    )
    
    print(f"\n✓ Dataset creado con problemas:")
    print(f"  - {len(X)} filas (con 5 duplicados)")
    print(f"  - Valores faltantes en 'ingresos'")
    print(f"  - Clases desbalanceadas: {y.value_counts().to_dict()}")
    
    # Generar reporte
    try:
        quality_report = data_quality_report(X, y)
        print_quality_report(quality_report)
    except Exception as e:
        print(f"❌ Error: {e}")


def demo_class_imbalance():
    """Demo 3: Análisis y manejo de desbalance de clases."""
    
    print("\n" + "="*80)
    print("  ⚖️  DEMO 3: ANÁLISIS DE DESBALANCE DE CLASES")
    print("="*80)
    
    # Crear datos desbalanceados típicos de créditos
    np.random.seed(42)
    X = pd.DataFrame({
        'edad': np.random.randint(20, 70, 100),
        'ingresos': np.random.randint(10000, 200000, 100),
        'deuda': np.random.randint(0, 100000, 100),
    })
    
    # Target: 85% clase positiva, 15% negativa (muy desbalanceado)
    y = pd.Series(
        [1] * 85 + [0] * 15,
        name='aprobado'
    )
    
    print(f"\n✓ Dataset desbalanceado creado:")
    print(f"  Clase 1 (aprobado): {(y==1).sum()} muestras (85%)")
    print(f"  Clase 0 (rechazado): {(y==0).sum()} muestras (15%)")
    
    # Obtener recomendaciones
    print("\n[Análisis de Desbalance]")
    try:
        recommendations = recommend_imbalance_handling(y)
        
        print(f"\nImbalance Ratio: {recommendations['imbalance_ratio']:.3f}")
        print(f"Clase minoritaria: {recommendations['minority_class']}")
        print(f"Clase mayoritaria: {recommendations['majority_class']}")
        
        print("\n[Estrategias Recomendadas]")
        for strategy in recommendations['suggested_strategies']:
            print(strategy)
        
        print("\n[Class Weights Recomendados]")
        for cls, weight in recommendations['class_weights'].items():
            print(f"  Clase {cls}: {weight:.2f}")
        
        # Intentar aplicar SMOTE
        try:
            print("\n[Intentando SMOTE]")
            X_resampled, y_resampled = apply_smote(X, y, sampling_strategy=0.7)
        except Exception as e:
            print(f"⚠️  SMOTE no disponible: {e}")
    
    except Exception as e:
        print(f"❌ Error: {e}")
    
    print("\n✅ Demo de desbalance completada\n")


def demo_prediction_anomalies():
    """Demo 4: Detección de anomalías en predicciones."""
    
    print("\n" + "="*80)
    print("  🎯 DEMO 4: ANOMALÍAS EN PREDICCIONES")
    print("="*80)
    
    # Crear predicciones con casos patológicos
    np.random.seed(42)
    n_test = 100
    
    y_true = np.array([1, 0, 1, 1, 0] * 20)  # 60 positivos, 40 negativos
    y_pred = np.array([1, 0, 1, 0, 0, 1, 0, 1, 1, 1] * 10)  # Algunas predicciones erradas
    
    # Probabilidades: algunas altas cuando están erradas, algunas bajas cuando aciertan
    y_proba = np.random.random((n_test, 2))
    y_proba[:, 1] = y_pred * 0.8 + np.random.random(n_test) * 0.2  # Correlación débil
    
    print(f"\n✓ Datos de predicción creados:")
    print(f"  - {n_test} predicciones")
    print(f"  - Accuracy: {(y_true == y_pred).mean():.1%}")
    
    # Detectar anomalías
    print("\n[Detectando Anomalías]")
    try:
        anomalies = detect_prediction_anomalies(
            y_true, y_pred, y_proba,
            confidence_threshold=0.7
        )
        
        print_anomaly_report(anomalies, y_true, y_pred)
    except Exception as e:
        print(f"❌ Error: {e}")
    
    print("\n✅ Demo de anomalías completada\n")


def demo_data_drift():
    """Demo 5: Detección de data drift."""
    
    print("\n" + "="*80)
    print("  📈 DEMO 5: DATA DRIFT DETECTION")
    print("="*80)
    
    # Datos de entrenamiento (distribución base)
    np.random.seed(42)
    X_train = pd.DataFrame({
        'edad': np.random.normal(40, 10, 200),
        'ingresos': np.random.normal(50000, 15000, 200),
        'deuda': np.random.normal(20000, 10000, 200),
    })
    
    # Datos nuevos (distribución cambió)
    X_new = pd.DataFrame({
        'edad': np.random.normal(55, 10, 100),  # Edad promedio subió (drift!)
        'ingresos': np.random.normal(50000, 15000, 100),  # Sin cambio
        'deuda': np.random.normal(30000, 10000, 100),  # Deuda subió (drift!)
    })
    
    print(f"\n✓ Datos creados:")
    print(f"  - X_train: {len(X_train)} muestras")
    print(f"  - X_new: {len(X_new)} muestras")
    
    print(f"\nDistribuciones (train vs new):")
    print(f"  edad:     {X_train['edad'].mean():.0f} vs {X_new['edad'].mean():.0f}")
    print(f"  ingresos: {X_train['ingresos'].mean():.0f} vs {X_new['ingresos'].mean():.0f}")
    print(f"  deuda:    {X_train['deuda'].mean():.0f} vs {X_new['deuda'].mean():.0f}")
    
    # Detectar drift
    print("\n[Detectando Drift]")
    try:
        drift_report = detect_feature_drift(X_train, X_new, threshold=0.05)
        print_drift_report(drift_report)
    except Exception as e:
        print(f"⚠️  Error: {e}")
    
    print("\n✅ Demo de data drift completada\n")


def demo_comprehensive_analysis():
    """Demo 6: Análisis integral (todo junto)."""
    
    print("\n" + "="*80)
    print("  🔍 DEMO 6: ANÁLISIS INTEGRAL DE ANOMALÍAS")
    print("="*80)
    
    # Cargar o crear datos
    csv_path = BASE_DIR / "datos" / "entrenamiento_financiero.csv"
    
    if csv_path.exists():
        try:
            data = load_data(str(csv_path), target_col='aprobado')
            X_train = data['X'].iloc[:80]
            y_train = data['y'].iloc[:80]
            X_new = data['X'].iloc[80:90]
        except:
            print("⚠️  Error cargando CSV, usando datos sintéticos...")
            np.random.seed(42)
            X_train = pd.DataFrame({
                'edad': np.random.randint(20, 80, 80),
                'ingresos': np.random.randint(10000, 200000, 80),
                'deuda': np.random.randint(0, 100000, 80),
            })
            y_train = pd.Series(np.random.choice([0, 1], 80, p=[0.3, 0.7]), name='aprobado')
            X_new = X_train.iloc[70:80].copy()
    else:
        np.random.seed(42)
        X_train = pd.DataFrame({
            'edad': np.random.randint(20, 80, 80),
            'ingresos': np.random.randint(10000, 200000, 80),
            'deuda': np.random.randint(0, 100000, 80),
        })
        y_train = pd.Series(np.random.choice([0, 1], 80, p=[0.3, 0.7]), name='aprobado')
        X_new = X_train.iloc[70:80].copy()
    
    print(f"\n✓ Datos listos. Ejecutando análisis integral...\n")
    
    try:
        # Análisis integral simple (sin entrenar modelo para ahorrar tiempo)
        quality = data_quality_report(X_train, y_train)
        print_quality_report(quality)
        
        outliers = detect_outliers(X_train, method="isolation_forest", verbose=True)
        imbalance = recommend_imbalance_handling(y_train)
        drift = detect_feature_drift(X_train, X_new)
        
        print("\n[Drift Detection]")
        print_drift_report(drift)
        
    except Exception as e:
        print(f"⚠️  Error: {e}")
        import traceback
        traceback.print_exc()
    
    print("\n✅ ANÁLISIS INTEGRAL COMPLETADO\n")


if __name__ == "__main__":
    print("\n" + "="*80)
    print("  🎪 DEMOSTRACIÓN: MÓDULO DE DETECCIÓN DE ANOMALÍAS")
    print("="*80)
    
    try:
        # Ejecutar todas las demos
        demo_outlier_detection()
        demo_data_quality()
        demo_class_imbalance()
        demo_prediction_anomalies()
        demo_data_drift()
        demo_comprehensive_analysis()
        
        print("\n" + "="*80)
        print("  ✨ TODAS LAS DEMOSTRACIONES COMPLETADAS")
        print("="*80)
        print("\n💡 Próximos pasos:")
        print("  1. Si quieres SHAP: pip install shap")
        print("  2. Si quieres SMOTE: pip install imbalanced-learn")
        print("  3. Data drift ya está incluido (usa scipy que está en sklearn)")
        print("\n")
    
    except Exception as e:
        print(f"\n❌ Error inesperado: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    print("\n" + "="*80)
    print("  🎪 DEMOSTRACIÓN COMPLETA: MÓDULO DE DETECCIÓN DE ANOMALÍAS")
    print("="*80)
    
    # Ejecutar todas las demos
    demo_outlier_detection()
    demo_data_quality()
    demo_class_imbalance()
    demo_prediction_anomalies()
    demo_data_drift()
    demo_comprehensive_analysis()
    
    print("\n" + "="*80)
    print("  ✨ TODAS LAS DEMOSTRACIONES COMPLETADAS")
    print("="*80)
    print("\n💡 Próximos pasos:")
    print("  1. Instala dependencias: pip install shap imbalanced-learn plotly")
    print("  2. Ejecuta: python DEMO_interpretability.py")
    print("  3. Ejecuta: python DEMO_anomaly_detector.py")
    print("\n")
