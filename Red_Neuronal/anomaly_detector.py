"""
anomaly_detector.py - Detección de anomalías, calidad de datos e imbalance

Módulo para identificar problemas en datos y predicciones:

Incluye:
  • Detección de outliers (Isolation Forest, Local Outlier Factor)
  • Reporte de calidad de datos (valores faltantes, tipos inconsistentes)
  • Detección de desbalance de clases
  • Recomendaciones automáticas (SMOTE, oversampling, class weights)
  • Detección de anomalías en predicciones (predicciones sospechosas)
  • Feature drift detection (cambios en distribución)
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
    from sklearn.ensemble import IsolationForest
    from sklearn.neighbors import LocalOutlierFactor
    from sklearn.preprocessing import StandardScaler
except ImportError as e:
    print(f"❌ Error: Falta librería sklearn/pandas. Instala con: pip install scikit-learn pandas matplotlib seaborn")
    sys.exit(1)

# Imports opcionales
try:
    from imblearn.over_sampling import SMOTE
    HAS_IMBALANCED_LEARN = True
except ImportError:
    HAS_IMBALANCED_LEARN = False
    print("⚠️  Advertencia: imbalanced-learn no instalado. SMOTE no disponible.")

try:
    from scipy.stats import ks_2samp
    HAS_SCIPY = True
except ImportError:
    HAS_SCIPY = False
    print("⚠️  Advertencia: scipy no instalado. Data drift detection no disponible.")

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
#  DETECCIÓN DE OUTLIERS EN DATOS
# ═══════════════════════════════════════════════════════════════════════════

def detect_outliers(X: pd.DataFrame, method: str = "isolation_forest",
                   contamination: float = 0.1, verbose: bool = True) -> dict:
    """
    Detecta outliers (valores anómalos) en datos numéricos.
    
    Métodos disponibles:
      • 'isolation_forest': Rápido, bueno para alta dimensionalidad
      • 'lof': Local Outlier Factor, detecta patrones locales anómalos
    
    Args:
        X: DataFrame con datos
        method: 'isolation_forest' o 'lof'
        contamination: Porcentaje esperado de outliers (0.0-0.5)
        verbose: Mostrar información
    
    Returns:
        dict con:
          - 'outlier_mask': Boolean array indicando outliers
          - 'outlier_indices': Índices de outliers
          - 'outlier_scores': Score de anomalía por instancia
          - 'outlier_count': Número de outliers
    """
    X_numeric = X.select_dtypes(include=[np.number]).copy()
    
    if X_numeric.empty:
        if verbose:
            print("⚠️  No hay columnas numéricas para detectar outliers.")
        return {
            'outlier_mask': np.zeros(len(X), dtype=bool),
            'outlier_indices': [],
            'outlier_scores': np.zeros(len(X)),
            'outlier_count': 0,
        }
    
    # Normalizar datos
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X_numeric)
    
    # Detectar outliers
    if method == "isolation_forest":
        detector = IsolationForest(
            contamination=contamination,
            random_state=42,
            n_jobs=-1
        )
    elif method == "lof":
        detector = LocalOutlierFactor(
            n_neighbors=min(20, len(X)-1),
            contamination=contamination
        )
    else:
        raise ValueError(f"Método '{method}' no reconocido. Use 'isolation_forest' o 'lof'.")
    
    outlier_labels = detector.fit_predict(X_scaled)
    outlier_mask = outlier_labels == -1
    
    # Scores (si disponibles)
    if hasattr(detector, 'score_samples'):
        outlier_scores = -detector.score_samples(X_scaled)  # Negativar para que outliers > 0
    else:
        outlier_scores = np.zeros(len(X))
    
    outlier_indices = np.where(outlier_mask)[0].tolist()
    
    if verbose and len(outlier_indices) > 0:
        print(f"\n🚨 DETECCIÓN DE OUTLIERS")
        print(f"   Método: {method}")
        print(f"   Outliers encontrados: {len(outlier_indices)} ({len(outlier_indices)/len(X)*100:.1f}%)")
    
    return {
        'outlier_mask': outlier_mask,
        'outlier_indices': outlier_indices,
        'outlier_scores': outlier_scores,
        'outlier_count': np.sum(outlier_mask),
    }


def plot_outliers(X: pd.DataFrame, outlier_mask: np.ndarray,
                 title: str = "Detección de Outliers"):
    """
    Visualiza outliers en un scatter plot (PCA para visualización).
    
    Args:
        X: DataFrame con datos
        outlier_mask: Boolean array de outliers
        title: Título del gráfico
    """
    from sklearn.decomposition import PCA
    
    X_numeric = X.select_dtypes(include=[np.number]).copy()
    
    if X_numeric.shape[1] < 2:
        print("⚠️  Se necesitan al menos 2 features numéricos para visualizar.")
        return
    
    # PCA para reducir a 2D
    pca = PCA(n_components=2)
    X_pca = pca.fit_transform(X_numeric)
    
    fig, ax = plt.subplots(figsize=(10, 7))
    
    # Puntos normales
    normal_mask = ~outlier_mask
    ax.scatter(X_pca[normal_mask, 0], X_pca[normal_mask, 1],
              c='steelblue', alpha=0.6, s=30, label='Normal', edgecolors='black', linewidths=0.3)
    
    # Outliers
    if np.any(outlier_mask):
        ax.scatter(X_pca[outlier_mask, 0], X_pca[outlier_mask, 1],
                  c='red', alpha=0.8, s=100, marker='X', label='Outlier', 
                  edgecolors='darkred', linewidths=1)
    
    ax.set_xlabel(f"PC1 ({pca.explained_variance_ratio_[0]:.1%} var)")
    ax.set_ylabel(f"PC2 ({pca.explained_variance_ratio_[1]:.1%} var)")
    ax.set_title(title)
    ax.legend()
    ax.grid(alpha=0.3)
    
    plt.tight_layout()
    plt.show()


# ═══════════════════════════════════════════════════════════════════════════
#  REPORTE DE CALIDAD DE DATOS
# ═══════════════════════════════════════════════════════════════════════════

def data_quality_report(X: pd.DataFrame, y: pd.Series = None) -> dict:
    """
    Genera un reporte completo de calidad de datos.
    
    Verifica:
      • Valores faltantes
      • Tipos de datos inconsistentes
      • Duplicados
      • Valores únicos por feature
      • Distribución de clases (si y es proporcionado)
    
    Args:
        X: DataFrame con features
        y: Series con target (opcional)
    
    Returns:
        dict con métricas de calidad
    """
    quality_report = {
        'total_rows': len(X),
        'total_features': X.shape[1],
        'missing_values': {},
        'duplicate_rows': 0,
        'type_issues': [],
        'class_imbalance': None,
    }
    
    # 1. Valores faltantes
    missing_pct = (X.isnull().sum() / len(X) * 100)
    quality_report['missing_values'] = missing_pct[missing_pct > 0].to_dict()
    
    # 2. Duplicados
    quality_report['duplicate_rows'] = X.duplicated().sum()
    
    # 3. Verificar tipos de datos
    for col in X.columns:
        try:
            # Intentar conversión a float
            if X[col].dtype == 'object':
                pd.to_numeric(X[col], errors='raise')
        except (ValueError, TypeError):
            quality_report['type_issues'].append(col)
    
    # 4. Desbalance de clases
    if y is not None:
        class_counts = y.value_counts()
        ratio = class_counts.min() / class_counts.max()
        quality_report['class_imbalance'] = {
            'class_distribution': class_counts.to_dict(),
            'imbalance_ratio': ratio,
            'is_imbalanced': ratio < 0.7,  # Considerar imbalanceado si ratio < 0.7
        }
    
    return quality_report


def print_quality_report(quality_report: dict):
    """Imprime el reporte de calidad de forma legible."""
    print("\n" + "="*70)
    print("  REPORTE DE CALIDAD DE DATOS")
    print("="*70)
    
    print(f"\n📊 DIMENSIONES:")
    print(f"   • Total de filas: {quality_report['total_rows']:,}")
    print(f"   • Total de features: {quality_report['total_features']}")
    
    if quality_report['missing_values']:
        print(f"\n⚠️  VALORES FALTANTES:")
        for col, pct in quality_report['missing_values'].items():
            print(f"   • {col}: {pct:.1f}%")
    else:
        print(f"\n✓ No hay valores faltantes")
    
    if quality_report['duplicate_rows'] > 0:
        print(f"\n⚠️  DUPLICADOS:")
        print(f"   • Filas duplicadas: {quality_report['duplicate_rows']} ({quality_report['duplicate_rows']/quality_report['total_rows']*100:.1f}%)")
    else:
        print(f"\n✓ No hay filas duplicadas")
    
    if quality_report['type_issues']:
        print(f"\n⚠️  INCONSISTENCIAS DE TIPO:")
        for col in quality_report['type_issues']:
            print(f"   • {col}: Datos de texto en columna aparentemente numérica")
    else:
        print(f"\n✓ Tipos de datos consistentes")
    
    if quality_report['class_imbalance']:
        print(f"\n📈 DISTRIBUCIÓN DE CLASES:")
        for cls, count in quality_report['class_imbalance']['class_distribution'].items():
            print(f"   • {cls}: {count}")
        
        ratio = quality_report['class_imbalance']['imbalance_ratio']
        status = "⚠️  DESBALANCEADO" if quality_report['class_imbalance']['is_imbalanced'] else "✓ Balanceado"
        print(f"   • Ratio (minority/majority): {ratio:.2f} {status}")
    
    print("\n" + "="*70 + "\n")
    
    return quality_report


# ═══════════════════════════════════════════════════════════════════════════
#  MANEJO DE DESBALANCE (SMOTE, Oversampling, Class Weights)
# ═══════════════════════════════════════════════════════════════════════════

def recommend_imbalance_handling(y: pd.Series) -> dict:
    """
    Recomienda estrategias para manejar desbalance de clases.
    
    Args:
        y: Series con labels
    
    Returns:
        dict con recomendaciones
    """
    class_counts = y.value_counts()
    minority_count = class_counts.min()
    majority_count = class_counts.max()
    ratio = minority_count / majority_count
    
    recommendations = {
        'imbalance_ratio': ratio,
        'minority_class': class_counts.idxmin(),
        'majority_class': class_counts.idxmax(),
        'suggested_strategies': [],
        'class_weights': {},
    }
    
    # Calcular class weights recomendados
    total = len(y)
    for cls in class_counts.index:
        weight = total / (len(class_counts) * class_counts[cls])
        recommendations['class_weights'][str(cls)] = weight
    
    # Recomendaciones basadas en ratio
    if ratio >= 0.8:
        recommendations['suggested_strategies'].append("✓ Clases balanceadas - No acción necesaria")
    
    elif ratio >= 0.3:
        recommendations['suggested_strategies'].append("⚠️  Desbalance moderado")
        recommendations['suggested_strategies'].append("  → SMOTE (genera samples sintéticos)")
        recommendations['suggested_strategies'].append("  → Class weights balanceados")
    
    else:
        recommendations['suggested_strategies'].append("🚨 Desbalance severo")
        recommendations['suggested_strategies'].append("  → SMOTE + Oversampling")
        recommendations['suggested_strategies'].append("  → Class weights agresivos: {0: 3, 1: 1}")
        recommendations['suggested_strategies'].append("  → Considerar Threshold tuning (usar threshold > 0.5)")
    
    return recommendations


def apply_smote(X: pd.DataFrame, y: pd.Series,
                sampling_strategy: float = 0.8) -> tuple:
    """
    Aplica SMOTE (Synthetic Minority Oversampling) para balancear clases.
    
    SMOTE crea samples sintéticos interpolando entre samples minoritarios.
    
    Args:
        X: DataFrame con features
        y: Series con labels
        sampling_strategy: Ratio final (default: 0.8, lleva minority a 80% de majority)
    
    Returns:
        X_resampled, y_resampled
    """
    if not HAS_IMBALANCED_LEARN:
        raise ImportError(
            "❌ imbalanced-learn no instalado.\n"
            "   Instala con: pip install imbalanced-learn"
        )
    
    try:
        smote = SMOTE(sampling_strategy=sampling_strategy, random_state=42, k_neighbors=5)
        X_resampled, y_resampled = smote.fit_resample(X, y)
        
        print(f"\n✓ SMOTE aplicado:")
        print(f"  • Datos originales: {len(X)}")
        print(f"  • Datos después de SMOTE: {len(X_resampled)}")
        print(f"  • Nuevos samples creados: {len(X_resampled) - len(X)}")
        print(f"  • Nueva distribución: {pd.Series(y_resampled).value_counts().to_dict()}")
        
        return X_resampled, y_resampled
    
    except Exception as e:
        print(f"❌ Error al aplicar SMOTE: {e}")
        return X, y


# ═══════════════════════════════════════════════════════════════════════════
#  ANOMALÍAS EN PREDICCIONES
# ═══════════════════════════════════════════════════════════════════════════

def detect_prediction_anomalies(y_true: np.ndarray, y_pred: np.ndarray,
                               y_proba: np.ndarray = None,
                               confidence_threshold: float = 0.6) -> dict:
    """
    Detecta predicciones anómalas o sospechosas.
    
    Identifica:
      • Predicciones con baja confianza pero acertadas
      • Predicciones erradas con alta confianza
      • Patrones de error inconsistentes
    
    Args:
        y_true: Labels verdaderos
        y_pred: Predicciones del modelo
        y_proba: Probabilidades (si disponibles)
        confidence_threshold: Umbral de confianza
    
    Returns:
        dict con anomalías detectadas
    """
    is_correct = y_true == y_pred
    
    anomalies = {
        'low_confidence_correct': [],
        'high_confidence_wrong': [],
        'inconsistent_patterns': [],
    }
    
    if y_proba is not None:
        max_proba = y_proba.max(axis=1) if len(y_proba.shape) > 1 else y_proba
        
        # Predicciones correctas con baja confianza (suerte)
        low_conf_correct = (~is_correct) & (max_proba < confidence_threshold)
        anomalies['low_confidence_correct'] = np.where(low_conf_correct)[0].tolist()
        
        # Predicciones incorrectas con alta confianza (problema de confiabilidad)
        high_conf_wrong = (~is_correct) & (max_proba >= confidence_threshold)
        anomalies['high_confidence_wrong'] = np.where(high_conf_wrong)[0].tolist()
    
    return anomalies


def print_anomaly_report(anomalies: dict, y_true: np.ndarray = None,
                        y_pred: np.ndarray = None):
    """Imprime reporte de anomalías en predicciones."""
    print("\n" + "="*70)
    print("  ANOMALÍAS EN PREDICCIONES")
    print("="*70)
    
    if anomalies['low_confidence_correct']:
        print(f"\n⚠️  PREDICCIONES CORRECTAS CON BAJA CONFIANZA:")
        print(f"    (Modelo tuvo suerte o datos ambiguos)")
        print(f"    • Cantidad: {len(anomalies['low_confidence_correct'])}")
        print(f"    • Índices: {anomalies['low_confidence_correct'][:10]}{'...' if len(anomalies['low_confidence_correct']) > 10 else ''}")
    
    if anomalies['high_confidence_wrong']:
        print(f"\n🚨 PREDICCIONES INCORRECTAS CON ALTA CONFIANZA:")
        print(f"    (Modelo está equivocado pero confiado - ¡problema!)")
        print(f"    • Cantidad: {len(anomalies['high_confidence_wrong'])}")
        print(f"    • Índices: {anomalies['high_confidence_wrong'][:10]}{'...' if len(anomalies['high_confidence_wrong']) > 10 else ''}")
    
    print("\n" + "="*70 + "\n")


# ═══════════════════════════════════════════════════════════════════════════
#  FEATURE DRIFT DETECTION - Detectar cambios en distribución de datos
# ═══════════════════════════════════════════════════════════════════════════

def detect_feature_drift(X_train: pd.DataFrame, X_new: pd.DataFrame,
                        threshold: float = 0.05) -> dict:
    """
    Detecta cambios en la distribución de features (data drift).
    
    Si X_new tiene distribución distinta a X_train, el modelo puede estar
    prediciendo en un dominio diferente al que fue entrenado.
    
    Usa Kolmogorov-Smirnov test para detectar cambios.
    
    Args:
        X_train: Datos de entrenamiento
        X_new: Nuevos datos a analizar
        threshold: p-value threshold para significancia (default: 0.05)
    
    Returns:
        dict con features que tienen drift
    """
    if not HAS_SCIPY:
        print("⚠️  scipy no instalado. Data drift detection no disponible.")
        print("   Instala con: pip install scipy")
        return {
            'features_with_drift': [],
            'features_normal': [],
            'total_drift_score': 0,
        }
    
    drift_report = {
        'features_with_drift': [],
        'features_normal': [],
        'total_drift_score': 0,
    }
    
    X_train_numeric = X_train.select_dtypes(include=[np.number])
    X_new_numeric = X_new.select_dtypes(include=[np.number])
    
    common_features = set(X_train_numeric.columns) & set(X_new_numeric.columns)
    
    drift_scores = []
    
    for feature in common_features:
        try:
            statistic, p_value = ks_2samp(
                X_train_numeric[feature].dropna(),
                X_new_numeric[feature].dropna()
            )
            
            is_drift = p_value < threshold
            
            if is_drift:
                drift_report['features_with_drift'].append({
                    'feature': feature,
                    'p_value': p_value,
                    'statistic': statistic,
                })
            else:
                drift_report['features_normal'].append(feature)
            
            drift_scores.append(p_value if is_drift else 0)
        
        except Exception:
            continue
    
    drift_report['total_drift_score'] = np.mean(drift_scores) if drift_scores else 0
    
    return drift_report


def print_drift_report(drift_report: dict):
    """Imprime reporte de data drift."""
    print("\n" + "="*70)
    print("  DATA DRIFT DETECTION")
    print("="*70)
    
    if drift_report['features_with_drift']:
        print(f"\n⚠️  FEATURES CON DRIFT DETECTADO:")
        for item in drift_report['features_with_drift']:
            print(f"    • {item['feature']}: p_value={item['p_value']:.6f} (significativo)")
    else:
        print(f"\n✓ No hay drift detectado en features numéricos")
    
    print(f"\nTotal de features con drift: {len(drift_report['features_with_drift'])}")
    print(f"Features normales: {len(drift_report['features_normal'])}")
    print("\n" + "="*70 + "\n")


# ═══════════════════════════════════════════════════════════════════════════
#  ANÁLISIS INTEGRAL DE ANOMALÍAS
# ═══════════════════════════════════════════════════════════════════════════

def comprehensive_anomaly_analysis(X_train: pd.DataFrame, y_train: pd.Series,
                                  X_new: pd.DataFrame = None,
                                  y_test: np.ndarray = None,
                                  y_pred: np.ndarray = None,
                                  y_proba: np.ndarray = None,
                                  verbose: bool = True) -> dict:
    """
    Análisis completo de anomalías y calidad de datos.
    
    Ejecuta:
      1. Quality report de datos
      2. Outlier detection
      3. Class imbalance analysis
      4. Prediction anomalies
      5. Feature drift detection
    
    Args:
        X_train: Datos de entrenamiento
        y_train: Labels de entrenamiento
        X_new: Nuevos datos (opcional)
        y_test: Labels de prueba (opcional)
        y_pred: Predicciones (opcional)
        y_proba: Probabilidades (opcional)
        verbose: Mostrar reportes
    
    Returns:
        dict con todos los análisis
    """
    analysis_results = {}
    
    # 1. QUALITY REPORT
    if verbose:
        print("\n🔍 INICIANDO ANÁLISIS INTEGRAL DE ANOMALÍAS...\n")
    
    quality = data_quality_report(X_train, y_train)
    analysis_results['quality'] = quality
    if verbose:
        print_quality_report(quality)
    
    # 2. OUTLIERS EN ENTRENAMIENTO
    if verbose:
        print("   Detectando outliers en datos de entrenamiento...")
    outliers = detect_outliers(X_train, method="isolation_forest", verbose=False)
    analysis_results['outliers_train'] = outliers
    
    if verbose and outliers['outlier_count'] > 0:
        print(f"   ✓ Outliers encontrados: {outliers['outlier_count']}")
        plot_outliers(X_train, outliers['outlier_mask'], 
                     title="Outliers en Datos de Entrenamiento")
    
    # 3. IMBALANCE ANALYSIS
    if verbose:
        print("\n   Analizando balance de clases...")
    imbalance_rec = recommend_imbalance_handling(y_train)
    analysis_results['imbalance_recommendations'] = imbalance_rec
    
    for strategy in imbalance_rec['suggested_strategies']:
        if verbose:
            print(f"   {strategy}")
    
    # 4. PREDICTION ANOMALIES
    if y_test is not None and y_pred is not None:
        if verbose:
            print("\n   Detectando anomalías en predicciones...")
        pred_anomalies = detect_prediction_anomalies(y_test, y_pred, y_proba)
        analysis_results['prediction_anomalies'] = pred_anomalies
        
        if verbose:
            print_anomaly_report(pred_anomalies, y_test, y_pred)
    
    # 5. DRIFT DETECTION
    if X_new is not None:
        if verbose:
            print("   Detectando data drift...")
        drift = detect_feature_drift(X_train, X_new)
        analysis_results['drift'] = drift
        
        if verbose:
            print_drift_report(drift)
    
    if verbose:
        print("✅ ANÁLISIS COMPLETADO\n")
    
    return analysis_results
