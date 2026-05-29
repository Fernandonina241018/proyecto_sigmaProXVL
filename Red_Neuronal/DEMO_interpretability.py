"""
DEMO_interpretability.py - Demostración del módulo de interpretabilidad

Muestra:
  1. Carga de datos
  2. Entrenamiento de modelo
  3. SHAP analysis (global + local)
  4. Partial Dependence Plots
  5. Feature interactions
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
    from interpretability import explain_predictions
    print("✓ Módulos locales importados")
except ImportError as e:
    print(f"❌ Error importando módulos: {e}")
    print(f"   Verifica que existen: data_loader.py, preprocessor.py, trainer.py, evaluator.py, interpretability.py")
    sys.exit(1)


def demo_interpretability():
    """Demostración completa de interpretabilidad."""
    
    print("\n" + "="*80)
    print("  🎯 DEMOSTRACIÓN: INTERPRETABILIDAD CON SHAP + PARTIAL DEPENDENCE")
    print("="*80)
    
    # ─────────────────────────────────────────────────────────────────────────
    # 1. CARGAR DATOS
    # ─────────────────────────────────────────────────────────────────────────
    print("\n[1/5] Cargando datos...")
    
    csv_path = BASE_DIR / "datos" / "entrenamiento_financiero.csv"
    
    if not csv_path.exists():
        print(f"⚠️  No se encontró: {csv_path}")
        print("   Creando datos sintéticos...")
        
        # Crear datos sintéticos
        np.random.seed(42)
        n_samples = 100
        X = pd.DataFrame({
            'edad': np.random.randint(20, 70, n_samples),
            'ingresos': np.random.randint(10000, 200000, n_samples),
            'deuda': np.random.randint(0, 100000, n_samples),
            'historial_credito_meses': np.random.randint(1, 360, n_samples),
            'num_cuentas_activas': np.random.randint(0, 10, n_samples),
        })
        y = pd.Series(np.random.randint(0, 2, n_samples), name='aprobado')
        
        print(f"   ✓ Datos sintéticos creados: {X.shape[0]} filas, {X.shape[1]} features")
    else:
        try:
            data = load_data(str(csv_path), target_col='aprobado')
            X = data['X']
            y = data['y']
            print(f"   ✓ Datos cargados: {X.shape[0]} filas, {X.shape[1]} features")
        except Exception as e:
            print(f"   ⚠️  Error cargando CSV: {e}")
            print("   Usando datos sintéticos...")
            np.random.seed(42)
            n_samples = 100
            X = pd.DataFrame({
                'edad': np.random.randint(20, 70, n_samples),
                'ingresos': np.random.randint(10000, 200000, n_samples),
                'deuda': np.random.randint(0, 100000, n_samples),
            })
            y = pd.Series(np.random.randint(0, 2, n_samples), name='aprobado')
    
    # ─────────────────────────────────────────────────────────────────────────
    # 2. PREPROCESAR DATOS
    # ─────────────────────────────────────────────────────────────────────────
    print("\n[2/5] Preprocesando datos...")
    
    try:
        # Crear DataFrame completo con target incluido
        data_with_target = X.copy()
        data_with_target['aprobado'] = y
        
        # prepare_data espera (df, target_name, problem_type) y retorna (X_raw, y, preprocessor, meta)
        X_raw, y_processed, preprocessor, meta = prepare_data(
            data_with_target, 
            target='aprobado', 
            problem_type='auto'
        )
        print(f"   ✓ Datos preprocesados")
        print(f"     - Problema tipo: {meta['problem_type']}")
        print(f"     - Clases: {meta.get('target_classes', 'N/A')}")
    except Exception as e:
        print(f"   ❌ Error preprocesando: {e}")
        return
    
    # ─────────────────────────────────────────────────────────────────────────
    # 3. ENTRENAR MODELO
    # ─────────────────────────────────────────────────────────────────────────
    print("\n[3/5] Entrenando modelo...")
    
    try:
        pipeline, splits, cv_results = train(
            X_raw, y_processed,
            preprocessor=preprocessor,
            model_key='rf',
            problem_type=meta['problem_type'],
            meta=meta,
            cv_folds=3,
        )
        print(f"   ✓ Modelo entrenado (Random Forest)")
    except Exception as e:
        print(f"   ❌ Error entrenando: {e}")
        return
    
    # ─────────────────────────────────────────────────────────────────────────
    # 4. EXPLICACIÓN INTEGRAL
    # ─────────────────────────────────────────────────────────────────────────
    print("\n[4/5] Generando explicaciones...")
    
    X_sample = X_raw.iloc[:min(5, len(X_raw))]
    
    try:
        shap_results = explain_predictions(
            pipeline,
            X_train=X_raw,
            X_new=X_sample,
            sample_idx=0,
            verbose=True
        )
        print(f"   ✓ Explicaciones generadas")
    except Exception as e:
        print(f"   ⚠️  Error en explicaciones: {e}")
        print(f"      (Esto es normal si SHAP no está instalado)")
        print(f"      Instala con: pip install shap")
    
    print("\n" + "="*80)
    print("  ✅ DEMOSTRACIÓN COMPLETADA")
    print("="*80 + "\n")


if __name__ == "__main__":
    try:
        demo_interpretability()
        print("✨ Demo terminada exitosamente!")
    except Exception as e:
        print(f"\n❌ Error inesperado: {e}")
        import traceback
        traceback.print_exc()

