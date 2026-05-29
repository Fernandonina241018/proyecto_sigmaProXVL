"""
interpretability.py - Interpretabilidad avanzada con SHAP, Partial Dependence, ICE curves

Módulo para explicar cómo el modelo llega a sus predicciones.

Incluye:
  • SHAP values (SHapley Additive exPlanations)
  • Partial Dependence Plots (PDP)
  • Individual Conditional Expectation (ICE) curves
  • Feature interactions SHAP
  • SHAP force plots (explicación por predicción individual)
  • Resumen de impacto global vs local
"""

import warnings
import sys
from pathlib import Path

# Imports básicos (obligatorios)
try:
    import numpy as np
    import pandas as pd
    import matplotlib.pyplot as plt
    import seaborn as sns
    from sklearn.inspection import partial_dependence, PartialDependenceDisplay
    from sklearn.preprocessing import StandardScaler
except ImportError as e:
    print(f"❌ Error: Falta librería sklearn/pandas. Instala con: pip install scikit-learn pandas matplotlib seaborn")
    sys.exit(1)

# Imports opcionales
try:
    import shap
    HAS_SHAP = True
except ImportError:
    HAS_SHAP = False
    print("⚠️  Advertencia: SHAP no instalado. Instala con: pip install shap")

warnings.filterwarnings("ignore")

# Configurar estilo de plots (compatible con Windows)
try:
    plt.style.use("seaborn-v0_8-darkgrid")
except:
    try:
        plt.style.use("seaborn-darkgrid")
    except:
        pass  # Usar default si seaborn no está


# ═══════════════════════════════════════════════════════════════════════════
#  SHAP - SHapley Additive exPlanations (Explicaciones globales + locales)
# ═══════════════════════════════════════════════════════════════════════════

def compute_shap_values(pipeline, X_sample: pd.DataFrame, 
                       X_background: pd.DataFrame = None,
                       max_samples: int = 100) -> dict:
    """
    Calcula SHAP values para explicar predicciones.
    
    SHAP es el estándar actual en interpretabilidad:
    - Cada feature tiene un "valor SHAP"
    - Suma de SHAP values = predicción - baseline
    - Más preciso que feature importance tradicional
    
    Args:
        pipeline: Pipeline entrenado
        X_sample: Datos para explicar (1 row para 1 predicción, N rows para N)
        X_background: Datos para calcular baseline (default: muestra de X_sample)
        max_samples: Máximo de samples para acelerar (SHAP es lento)
    
    Returns:
        dict con:
          - 'explainer': Objeto SHAP
          - 'shap_values': Array de SHAP values
          - 'base_value': Valor baseline (predicción promedio)
          - 'feature_names': Nombres de features
    """
    if not HAS_SHAP:
        raise ImportError(
            "❌ SHAP no está instalado.\n"
            "   Instala con: pip install shap\n"
            "   O usa funciones alternativas que no requieran SHAP."
        )
    
    try:
        # Extraer features del pipeline
        X_features = pipeline.named_steps["preprocessor"].transform(X_sample)
        
        # Si es sparse matrix, convertir a dense
        if hasattr(X_features, 'toarray'):
            X_features = X_features.toarray()
        
        # Features para background (baseline)
        if X_background is not None:
            X_bg = pipeline.named_steps["preprocessor"].transform(X_background)
            if hasattr(X_bg, 'toarray'):
                X_bg = X_bg.toarray()
        else:
            # Usar muestra aleatoria de X_sample
            X_bg = X_features if len(X_features) <= max_samples else X_features[:max_samples]
        
        # Crear explainer
        model = pipeline.named_steps["model"]
        
        # Intentar con TreeExplainer (más rápido para árboles)
        try:
            explainer = shap.TreeExplainer(model)
        except:
            # Fallback a KernelExplainer (más lento pero universal)
            try:
                pred_func = lambda x: model.predict_proba(x) if hasattr(model, "predict_proba") else model.predict(x)
                explainer = shap.KernelExplainer(pred_func, X_bg)
            except Exception as e:
                raise RuntimeError(f"No se pudo crear explainer SHAP: {e}")
        
        # Calcular SHAP values
        shap_values = explainer.shap_values(X_features)
        
        # Asegurar formato correcto
        if isinstance(shap_values, list):
            # Para clasificación: lista de arrays (uno por clase)
            shap_vals = shap_values[1] if len(shap_values) > 1 else shap_values[0]
        else:
            shap_vals = shap_values
        
        # Feature names
        try:
            feature_names = list(pipeline.named_steps["preprocessor"].get_feature_names_out())
            feature_names = [n.split("__")[-1] for n in feature_names]
        except:
            feature_names = [f"Feature_{i}" for i in range(shap_vals.shape[1] if len(shap_vals.shape) > 1 else 1)]
        
        base_value = explainer.expected_value if hasattr(explainer, 'expected_value') else 0
        
        return {
            'explainer': explainer,
            'shap_values': shap_vals,
            'base_value': base_value,
            'feature_names': feature_names,
            'X_sample': X_features,
        }
    
    except Exception as e:
        print(f"❌ Error al calcular SHAP values: {e}")
        return {
            'explainer': None,
            'shap_values': None,
            'base_value': 0,
            'feature_names': [],
            'X_sample': None,
        }


def plot_shap_summary(shap_results: dict, plot_type: str = "bar", 
                     max_display: int = 15, title: str = "SHAP Summary"):
    """
    Visualiza SHAP values de forma agregada.
    
    Args:
        shap_results: Output de compute_shap_values()
        plot_type: 'bar' (feature importance), 'beeswarm' (distribución)
        max_display: Máximo de features a mostrar
        title: Título del gráfico
    """
    try:
        import shap
    except ImportError:
        print("⚠️  SHAP no instalado. Saltando visualización.")
        return
    
    shap_vals = shap_results['shap_values']
    feature_names = shap_results['feature_names']
    
    # Si shap_vals es 1D, expandir a 2D
    if len(shap_vals.shape) == 1:
        shap_vals = shap_vals.reshape(-1, 1)
    
    fig, ax = plt.subplots(figsize=(10, max_display / 2 + 1))
    
    try:
        if plot_type == "bar":
            # Feature importance: promedio del valor absoluto de SHAP
            mean_abs_shap = np.abs(shap_vals).mean(axis=0)
            idx = np.argsort(mean_abs_shap)[-max_display:]
            
            ax.barh(
                [feature_names[i] for i in idx],
                mean_abs_shap[idx],
                color="steelblue",
                alpha=0.8
            )
            ax.set_xlabel("Mean |SHAP value|")
            ax.set_title(title)
        
        elif plot_type == "beeswarm":
            # Distribución de SHAP values por feature
            mean_abs_shap = np.abs(shap_vals).mean(axis=0)
            idx = np.argsort(mean_abs_shap)[-max_display:]
            
            for i, feature_idx in enumerate(idx):
                ax.scatter(
                    shap_vals[:, feature_idx],
                    [i] * len(shap_vals),
                    alpha=0.6,
                    s=20,
                    edgecolors='black',
                    linewidths=0.3
                )
            
            ax.set_yticks(range(len(idx)))
            ax.set_yticklabels([feature_names[i] for i in idx])
            ax.set_xlabel("SHAP value")
            ax.set_title(title)
    
    except Exception as e:
        print(f"⚠️  Error en visualización SHAP: {e}")
    
    plt.tight_layout()
    plt.show()


def plot_shap_force(shap_results: dict, row_idx: int = 0):
    """
    Force plot SHAP para una predicción individual.
    Muestra cómo cada feature contribuye a alejar la predicción del baseline.
    
    Args:
        shap_results: Output de compute_shap_values()
        row_idx: Índice de la fila a explicar
    """
    try:
        import shap
    except ImportError:
        print("⚠️  SHAP no instalado.")
        return
    
    explainer = shap_results['explainer']
    shap_vals = shap_results['shap_values']
    base_value = shap_results['base_value']
    feature_names = shap_results['feature_names']
    
    # Asegurar que base_value es scalar
    if hasattr(base_value, '__iter__'):
        base_value = base_value[0] if len(base_value) > 0 else 0
    
    if row_idx >= len(shap_vals):
        print(f"⚠️  Índice {row_idx} fuera de rango (max: {len(shap_vals)-1})")
        return
    
    try:
        # Crear explicación local
        explanation = shap.Explanation(
            values=shap_vals[row_idx],
            base_values=base_value,
            data=shap_results['X_sample'][row_idx],
            feature_names=feature_names
        )
        
        fig = shap.force_plot(
            base_value,
            shap_vals[row_idx],
            shap_results['X_sample'][row_idx],
            feature_names=feature_names,
            matplotlib=True
        )
        plt.tight_layout()
        plt.show()
    
    except Exception as e:
        print(f"⚠️  Error en force plot: {e}")
        # Fallback: mostrar tabla simple
        _print_shap_table(shap_vals[row_idx], feature_names, base_value)


def _print_shap_table(shap_row: np.ndarray, feature_names: list, base_value: float):
    """Imprime tabla simple de SHAP values como fallback."""
    df_shap = pd.DataFrame({
        'Feature': feature_names,
        'SHAP_Value': shap_row,
        'Abs_Impact': np.abs(shap_row)
    })
    df_shap = df_shap.sort_values('Abs_Impact', ascending=False)
    
    print("\n" + "="*60)
    print("EXPLICACIÓN LOCAL (SHAP)")
    print("="*60)
    print(f"Baseline (predicción promedio): {base_value:.4f}\n")
    print(df_shap.to_string(index=False))
    print("="*60)


# ═══════════════════════════════════════════════════════════════════════════
#  PARTIAL DEPENDENCE PLOTS - Cómo cambia la predicción con cada feature
# ═══════════════════════════════════════════════════════════════════════════

def plot_partial_dependence(pipeline, X_train: pd.DataFrame,
                           feature_names: list = None,
                           max_features: int = 10,
                           kind: str = "average") -> None:
    """
    Partial Dependence Plot (PDP): Relación entre feature y predicción.
    
    Muestra: ¿Qué pasa con la predicción cuando cambio esta variable?
    
    Args:
        pipeline: Pipeline entrenado
        X_train: Datos de entrenamiento
        feature_names: Nombres de features a graficar (default: todas)
        max_features: Máximo de features a mostrar
        kind: 'average' (PDP) o 'individual' (ICE - ver función siguiente)
    """
    X_features = pipeline.named_steps["preprocessor"].transform(X_train)
    if hasattr(X_features, 'toarray'):
        X_features = X_features.toarray()
    
    if feature_names is None:
        try:
            feature_names = list(pipeline.named_steps["preprocessor"].get_feature_names_out())
            feature_names = [n.split("__")[-1] for n in feature_names]
        except:
            feature_names = [f"Feature_{i}" for i in range(X_features.shape[1])]
    
    # Seleccionar features con mayor varianza (más interesantes)
    feature_importance = np.var(X_features, axis=0)
    top_indices = np.argsort(feature_importance)[-max_features:]
    
    n_features = len(top_indices)
    n_cols = min(3, n_features)
    n_rows = (n_features + n_cols - 1) // n_cols
    
    fig, axes = plt.subplots(n_rows, n_cols, figsize=(15, 4*n_rows))
    axes = np.atleast_1d(axes).flatten()
    
    for idx, feature_idx in enumerate(top_indices):
        ax = axes[idx]
        
        try:
            display = PartialDependenceDisplay.from_estimator(
                pipeline, X_features, [feature_idx],
                kind=kind, ax=ax, grid_resolution=30
            )
            ax.set_title(f"Partial Dependence: {feature_names[feature_idx]}")
        
        except Exception as e:
            ax.text(0.5, 0.5, f"Error: {str(e)[:50]}", 
                   ha='center', va='center', transform=ax.transAxes)
    
    # Ocultar axes no usados
    for idx in range(n_features, len(axes)):
        axes[idx].axis('off')
    
    plt.suptitle("Partial Dependence Plots (PDP)", fontsize=14, fontweight='bold')
    plt.tight_layout()
    plt.show()


# ═══════════════════════════════════════════════════════════════════════════
#  ICE CURVES - Individual Conditional Expectation (variación por instancia)
# ═══════════════════════════════════════════════════════════════════════════

def compute_ice_curves(pipeline, X_sample: pd.DataFrame,
                      feature_idx: int = 0,
                      num_points: int = 50) -> dict:
    """
    ICE Curve: Partial Dependence pero para CADA instancia individualmente.
    
    Útil para detectar efectos heterogéneos (comportamiento distinto por grupo).
    
    Args:
        pipeline: Pipeline entrenado
        X_sample: Datos (varias instancias)
        feature_idx: Índice del feature a variar
        num_points: Puntos para la curva
    
    Returns:
        dict con ICE values y rango del feature
    """
    X_features = pipeline.named_steps["preprocessor"].transform(X_sample)
    if hasattr(X_features, 'toarray'):
        X_features = X_features.toarray()
    
    feature_values = X_features[:, feature_idx]
    min_val, max_val = feature_values.min(), feature_values.max()
    grid_values = np.linspace(min_val, max_val, num_points)
    
    ice_curves = []
    
    for instance_idx in range(min(len(X_features), 50)):  # Máximo 50 instancias
        X_temp = X_features.copy()
        predictions = []
        
        for grid_val in grid_values:
            X_temp[:, feature_idx] = grid_val
            pred = pipeline.named_steps["model"].predict_proba(X_temp) \
                   if hasattr(pipeline.named_steps["model"], "predict_proba") \
                   else pipeline.named_steps["model"].predict(X_temp)
            
            if len(pred.shape) > 1:
                # Clasificación: tomar probabilidad de clase positiva
                predictions.append(pred[instance_idx, 1] if pred.shape[1] > 1 else pred[instance_idx, 0])
            else:
                predictions.append(pred[instance_idx])
        
        ice_curves.append(predictions)
    
    return {
        'grid_values': grid_values,
        'ice_curves': np.array(ice_curves),
        'feature_name': f"Feature_{feature_idx}",
    }


def plot_ice_curves(ice_results: dict, feature_name: str = "Feature", 
                   show_mean: bool = True):
    """Visualiza ICE curves junto con PDP (promedio)."""
    grid_values = ice_results['grid_values']
    ice_curves = ice_results['ice_curves']
    
    fig, ax = plt.subplots(figsize=(12, 6))
    
    # Graficar cada instancia
    for curve in ice_curves:
        ax.plot(grid_values, curve, color='steelblue', alpha=0.3, linewidth=1)
    
    # Superponer PDP (promedio)
    if show_mean:
        mean_curve = ice_curves.mean(axis=0)
        ax.plot(grid_values, mean_curve, color='darkorange', 
               linewidth=2.5, label='PDP (promedio)', marker='o', markersize=4)
    
    ax.set_xlabel(f"{feature_name}")
    ax.set_ylabel("Predicción")
    ax.set_title(f"ICE Curves: {feature_name}\n(líneas azules=individuos, naranja=promedio)")
    ax.grid(alpha=0.3)
    ax.legend()
    plt.tight_layout()
    plt.show()


# ═══════════════════════════════════════════════════════════════════════════
#  FEATURE INTERACTIONS - Detectar cuándo dos features interactúan
# ═══════════════════════════════════════════════════════════════════════════

def compute_feature_interactions(shap_results: dict, top_k: int = 10) -> pd.DataFrame:
    """
    Detecta interacciones entre features usando SHAP.
    
    Una interacción significa: el efecto de Feature A depende del valor de Feature B.
    
    Args:
        shap_results: Output de compute_shap_values()
        top_k: Mostrar top K interacciones
    
    Returns:
        DataFrame con pares de features y su fuerza de interacción
    """
    shap_vals = shap_results['shap_values']
    feature_names = shap_results['feature_names']
    
    # Computar interacciones como covarianza de SHAP values
    interactions = []
    
    for i in range(len(feature_names)):
        for j in range(i+1, len(feature_names)):
            # Fuerza de interacción = correlación entre SHAP values
            if len(shap_vals.shape) > 1 and shap_vals.shape[0] > 1:
                interaction_strength = np.abs(
                    np.corrcoef(shap_vals[:, i], shap_vals[:, j])[0, 1]
                )
            else:
                interaction_strength = 0
            
            interactions.append({
                'Feature_A': feature_names[i],
                'Feature_B': feature_names[j],
                'Interaction_Strength': interaction_strength,
            })
    
    df_interactions = pd.DataFrame(interactions)
    df_interactions = df_interactions.nlargest(top_k, 'Interaction_Strength')
    
    return df_interactions


def plot_feature_interactions(interactions_df: pd.DataFrame):
    """Visualiza interacciones entre features."""
    if interactions_df.empty:
        print("No hay interacciones significativas.")
        return
    
    fig, ax = plt.subplots(figsize=(10, 6))
    
    interaction_labels = interactions_df.apply(
        lambda row: f"{row['Feature_A']}\nvs\n{row['Feature_B']}", axis=1
    )
    
    ax.barh(range(len(interactions_df)), interactions_df['Interaction_Strength'],
           color='coral', alpha=0.8)
    ax.set_yticks(range(len(interactions_df)))
    ax.set_yticklabels(interaction_labels, fontsize=9)
    ax.set_xlabel("Interaction Strength")
    ax.set_title("Feature Interactions (Top 10)")
    ax.grid(alpha=0.3, axis='x')
    
    plt.tight_layout()
    plt.show()


# ═══════════════════════════════════════════════════════════════════════════
#  EXPLICACIÓN INTEGRAL (Combina todo)
# ═══════════════════════════════════════════════════════════════════════════

def explain_predictions(pipeline, X_train: pd.DataFrame, X_new: pd.DataFrame = None,
                       sample_idx: int = 0,
                       verbose: bool = True) -> dict:
    """
    Explicación completa de predicciones usando múltiples técnicas.
    
    Combina:
      1. SHAP summary (global)
      2. SHAP force (local)
      3. Partial Dependence (relación con features)
      4. ICE curves (variación por instancia)
      5. Feature interactions
    
    Args:
        pipeline: Pipeline entrenado
        X_train: Datos de entrenamiento (para background)
        X_new: Datos a explicar (default: usos X_train[:1])
        sample_idx: Índice de la predicción a explicar localmente
        verbose: Mostrar prints y gráficos
    
    Returns:
        dict con todos los resultados
    """
    if X_new is None:
        X_new = X_train.iloc[:min(5, len(X_train))]
    
    if verbose:
        print("\n" + "="*70)
        print("  EXPLICACIÓN INTEGRAL DE PREDICCIONES")
        print("="*70)
    
    results = {}
    
    # 1. SHAP GLOBAL
    if verbose:
        print("\n1️⃣  Calculando SHAP values (esto puede tomar unos segundos)...")
    try:
        shap_results = compute_shap_values(pipeline, X_new, X_background=X_train)
        results['shap'] = shap_results
        
        if verbose:
            print("   ✓ SHAP calculado.")
            plot_shap_summary(shap_results, plot_type="bar")
    except Exception as e:
        if verbose:
            print(f"   ⚠️  Error en SHAP: {e}")
        results['shap'] = None
    
    # 2. SHAP LOCAL (force plot)
    if results.get('shap'):
        if verbose:
            print(f"\n2️⃣  SHAP Force Plot para predicción #{sample_idx}...")
        try:
            plot_shap_force(shap_results, row_idx=sample_idx)
        except Exception as e:
            if verbose:
                print(f"   ⚠️  Error en force plot: {e}")
    
    # 3. PARTIAL DEPENDENCE
    if verbose:
        print("\n3️⃣  Calculando Partial Dependence Plots...")
    try:
        plot_partial_dependence(pipeline, X_new, max_features=6)
    except Exception as e:
        if verbose:
            print(f"   ⚠️  Error en PDP: {e}")
    
    # 4. FEATURE INTERACTIONS
    if results.get('shap'):
        if verbose:
            print("\n4️⃣  Analizando interacciones entre features...")
        try:
            interactions = compute_feature_interactions(shap_results, top_k=5)
            results['interactions'] = interactions
            plot_feature_interactions(interactions)
        except Exception as e:
            if verbose:
                print(f"   ⚠️  Error en interacciones: {e}")
    
    if verbose:
        print("\n" + "="*70)
        print("  ✅ EXPLICACIÓN COMPLETADA")
        print("="*70 + "\n")
    
    return results
