"""
analisis_creditos.py - Análisis detallado de por qué el modelo de créditos
está aprobando clientes de alto riesgo.

Este script:
1. Carga y analiza la distribución del dataset
2. Entrena modelos baseline con verbose
3. Genera matriz de confusión detallada
4. Calcula feature importance
5. Prueba diferentes thresholds de decisión
6. Proporciona recomendaciones de mejora
"""

import sys
import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    confusion_matrix, classification_report, roc_auc_score,
    roc_curve, precision_recall_curve, f1_score, accuracy_score
)
import warnings
warnings.filterwarnings("ignore")

# ═══════════════════════════════════════════════════════════════════════════════
# PARTE 1: CARGA Y EXPLORACIÓN DEL DATASET
# ═══════════════════════════════════════════════════════════════════════════════

def load_and_explore():
    """Carga el dataset financiero y genera análisis exploratorio."""
    print("\n" + "="*80)
    print("ANÁLISIS DE CRÉDITOS - MODELO APROBANDO RIESGO ALTO")
    print("="*80)
    
    # Cargar datos
    path = "/mnt/g/My Drive/SigmaProWeb/proyecto_sigmaProXVL/Red Neuronal/datos/entrenamiento_financiero.csv"
    df = pd.read_csv(path)
    
    print("\n📊 INFORMACIÓN DEL DATASET:")
    print(f"  Total de registros: {len(df)}")
    print(f"  Total de features: {len(df.columns) - 2}")  # -2 por id_cliente y aprobado
    print(f"  Columnas: {list(df.columns)}")
    
    # Análisis de balance de clases
    print("\n⚖️  BALANCE DE CLASES:")
    class_dist = df['aprobado'].value_counts()
    print(f"  Aprobados (1):   {class_dist[1]} ({class_dist[1]/len(df)*100:.1f}%)")
    print(f"  Rechazados (0):  {class_dist[0]} ({class_dist[0]/len(df)*100:.1f}%)")
    print(f"  Ratio neg/pos:   {class_dist[0]/class_dist[1]:.2f}")
    
    # Estadísticas descriptivas por clase
    print("\n📈 ESTADÍSTICAS POR CLASE:")
    for col in df.columns[1:-1]:  # Omitir id_cliente y aprobado
        print(f"\n  {col.upper()}:")
        for clase in [0, 1]:
            valor_mean = df[df['aprobado'] == clase][col].mean()
            valor_std = df[df['aprobado'] == clase][col].std()
            print(f"    Clase {clase}: {valor_mean:.2f} ± {valor_std:.2f}")
    
    return df

# ═══════════════════════════════════════════════════════════════════════════════
# PARTE 2: ANÁLISIS DE RIESGO
# ═══════════════════════════════════════════════════════════════════════════════

def analyze_risk_profiles(df):
    """Identifica patrones de riesgo en el dataset."""
    print("\n" + "="*80)
    print("ANÁLISIS DE PERFILES DE RIESGO")
    print("="*80)
    
    # Definir variables de riesgo
    high_risk = []
    
    for idx, row in df.iterrows():
        risk_score = 0
        risk_factors = []
        
        # Score bajo = riesgo alto
        if row['score_credito'] < 650:
            risk_score += 2
            risk_factors.append(f"Score bajo ({row['score_credito']})")
        
        # Ingreso bajo = riesgo alto
        if row['ingreso_mensual'] < 4000:
            risk_score += 2
            risk_factors.append(f"Ingreso bajo (${row['ingreso_mensual']})")
        
        # Deuda alta = riesgo alto
        if row['deuda_actual'] > 3000:
            risk_score += 1
            risk_factors.append(f"Deuda alta (${row['deuda_actual']})")
        
        # Monto solicitado muy alto relativo al ingreso
        debt_to_income = row['monto_solicitado'] / row['ingreso_mensual']
        if debt_to_income > 8:
            risk_score += 2
            risk_factors.append(f"DTI muy alto ({debt_to_income:.1f})")
        
        # Edad joven = riesgo moderado
        if row['edad'] < 30:
            risk_score += 1
            risk_factors.append(f"Edad joven ({row['edad']})")
        
        if risk_score >= 3:
            high_risk.append({
                'id': row['id_cliente'],
                'risk_score': risk_score,
                'factors': ', '.join(risk_factors),
                'aprobado': row['aprobado'],
                'score_credito': row['score_credito'],
                'ingreso': row['ingreso_mensual'],
                'deuda': row['deuda_actual']
            })
    
    high_risk_df = pd.DataFrame(high_risk)
    
    print(f"\n⚠️  Clientes con ALTO RIESGO identificados: {len(high_risk_df)}")
    print(f"   De estos, APROBADOS: {high_risk_df['aprobado'].sum()} ⚠️")
    print(f"   De estos, RECHAZADOS: {(1-high_risk_df['aprobado']).sum()} ✓")
    
    # Mostrar los más problemáticos (aprobados con alto riesgo)
    problematic = high_risk_df[(high_risk_df['aprobado'] == 1)].sort_values('risk_score', ascending=False)
    
    if len(problematic) > 0:
        print(f"\n🔴 CLIENTES APROBADOS CON ALTO RIESGO (más problemáticos):")
        for idx, row in problematic.head(10).iterrows():
            print(f"   Cliente {int(row['id']):2d}: Risk={row['risk_score']}")
            print(f"              Score={row['score_credito']}, Ingreso=${row['ingreso']:.0f}, Deuda=${row['deuda']:.0f}")
            print(f"              Factores: {row['factors']}")
    
    return high_risk_df

# ═══════════════════════════════════════════════════════════════════════════════
# PARTE 3: ENTRENAMIENTO Y EVALUACIÓN DETALLADA
# ═══════════════════════════════════════════════════════════════════════════════

def train_and_analyze(df):
    """Entrena modelo y analiza predicciones."""
    print("\n" + "="*80)
    print("ENTRENAMIENTO Y ANÁLISIS DEL MODELO")
    print("="*80)
    
    # Preparar datos
    X = df.drop(['id_cliente', 'aprobado'], axis=1)
    y = df['aprobado']
    
    # Scaler
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    X_scaled = pd.DataFrame(X_scaled, columns=X.columns)
    
    # Train/test split
    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y, test_size=0.25, random_state=42, stratify=y
    )
    
    print(f"\n📌 SPLIT TRAIN/TEST:")
    print(f"  Train: {len(X_train)} samples ({len(y_train[y_train==1])} aprobados, {len(y_train[y_train==0])} rechazados)")
    print(f"  Test:  {len(X_test)} samples ({len(y_test[y_test==1])} aprobados, {len(y_test[y_test==0])} rechazados)")
    
    # Entrenar Random Forest
    print(f"\n🤖 Entrenando Random Forest Classifier...")
    rf = RandomForestClassifier(
        n_estimators=200,
        max_depth=10,
        class_weight='balanced',
        random_state=42,
        n_jobs=-1
    )
    rf.fit(X_train, y_train)
    
    # Prediciones
    y_pred = rf.predict(X_test)
    y_proba = rf.predict_proba(X_test)[:, 1]
    
    # Métricas baseline
    print(f"\n📊 MÉTRICAS CON THRESHOLD=0.5:")
    print(f"  Accuracy: {accuracy_score(y_test, y_pred):.4f}")
    print(f"  F1-Score: {f1_score(y_test, y_pred):.4f}")
    print(f"  AUC-ROC:  {roc_auc_score(y_test, y_proba):.4f}")
    
    # Matriz de confusión
    cm = confusion_matrix(y_test, y_pred)
    print(f"\n📋 MATRIZ DE CONFUSIÓN (threshold=0.5):")
    print(f"  TN (correcto rechazo):    {cm[0,0]}")
    print(f"  FP (aprobación incorrecta): {cm[0,1]} ⚠️")
    print(f"  FN (rechazo incorrecto):  {cm[1,0]}")
    print(f"  TP (aprobación correcta):  {cm[1,1]}")
    
    print(f"\n🎯 ANÁLISIS DE ERRORES:")
    print(f"  False Positives (aprobamos malos): {cm[0,1]}/{len(y_test[y_test==0])} ({cm[0,1]/max(1,len(y_test[y_test==0]))*100:.1f}% de todos rechazados)")
    print(f"  False Negatives (rechazamos buenos): {cm[1,0]}/{len(y_test[y_test==1])} ({cm[1,0]/max(1,len(y_test[y_test==1]))*100:.1f}% de todos aprobados)")
    
    return rf, X_train, X_test, y_train, y_test, X_scaled, y, scaler, X

# ═══════════════════════════════════════════════════════════════════════════════
# PARTE 4: FEATURE IMPORTANCE
# ═══════════════════════════════════════════════════════════════════════════════

def analyze_feature_importance(rf, X):
    """Analiza qué features son más importantes."""
    print("\n" + "="*80)
    print("IMPORTANCIA DE FEATURES")
    print("="*80)
    
    importances = rf.feature_importances_
    feature_importance_df = pd.DataFrame({
        'feature': X.columns,
        'importance': importances
    }).sort_values('importance', ascending=False)
    
    print(f"\n🔍 TOP 10 FEATURES MÁS IMPORTANTES:")
    for idx, row in feature_importance_df.head(10).iterrows():
        bar = "█" * int(row['importance'] * 100)
        print(f"  {row['feature']:20s} {bar} {row['importance']:.4f}")
    
    return feature_importance_df

# ═══════════════════════════════════════════════════════════════════════════════
# PARTE 5: OPTIMIZACIÓN DE THRESHOLD
# ═══════════════════════════════════════════════════════════════════════════════

def optimize_threshold(rf, X_test, y_test):
    """Encuentra el threshold óptimo para minimizar false positives."""
    print("\n" + "="*80)
    print("OPTIMIZACIÓN DE THRESHOLD DE DECISIÓN")
    print("="*80)
    
    y_proba = rf.predict_proba(X_test)[:, 1]
    
    # Calcular métricas para diferentes thresholds
    thresholds = np.arange(0.3, 0.95, 0.05)
    results = []
    
    print(f"\n📊 COMPARACIÓN DE THRESHOLDS:")
    print(f"{'Threshold':<12} {'Acc':<10} {'F1':<10} {'FP':<8} {'FN':<8} {'Precision':<12} {'Recall':<10}")
    print("─" * 80)
    
    for threshold in thresholds:
        y_pred = (y_proba >= threshold).astype(int)
        cm = confusion_matrix(y_test, y_pred)
        
        acc = accuracy_score(y_test, y_pred)
        f1 = f1_score(y_test, y_pred, zero_division=0)
        fp = cm[0, 1] if cm.shape == (2, 2) else 0
        fn = cm[1, 0] if cm.shape == (2, 2) else 0
        tn = cm[0, 0] if cm.shape == (2, 2) else 0
        tp = cm[1, 1] if cm.shape == (2, 2) else 0
        
        precision = tp / (tp + fp) if (tp + fp) > 0 else 0
        recall = tp / (tp + fn) if (tp + fn) > 0 else 0
        
        results.append({
            'threshold': threshold,
            'accuracy': acc,
            'f1': f1,
            'fp': fp,
            'fn': fn,
            'precision': precision,
            'recall': recall,
            'cm': cm
        })
        
        print(f"{threshold:<12.2f} {acc:<10.4f} {f1:<10.4f} {fp:<8} {fn:<8} {precision:<12.4f} {recall:<10.4f}")
    
    # Encontrar mejor threshold (minimizar FP primero, luego FN)
    best_threshold = min(results, key=lambda x: (x['fp'], x['fn']))['threshold']
    
    print(f"\n✨ THRESHOLD RECOMENDADO: {best_threshold:.2f}")
    print(f"  Razón: Minimiza False Positives (aprobaciones incorrectas)")
    
    return best_threshold, results

# ═══════════════════════════════════════════════════════════════════════════════
# PARTE 6: VISUALIZACIONES
# ═══════════════════════════════════════════════════════════════════════════════

def create_visualizations(rf, X_test, y_test, feature_importance_df, results):
    """Genera visualizaciones del análisis."""
    print("\n📊 Generando visualizaciones...")
    
    fig, axes = plt.subplots(2, 2, figsize=(14, 10))
    fig.suptitle('Análisis Detallado del Modelo de Créditos', fontsize=14, fontweight='bold')
    
    # 1. Feature Importance
    top_features = feature_importance_df.head(10)
    axes[0, 0].barh(top_features['feature'], top_features['importance'], color='steelblue')
    axes[0, 0].set_title('Top 10 Features - Importancia')
    axes[0, 0].set_xlabel('Importancia')
    
    # 2. Curva ROC
    y_proba = rf.predict_proba(X_test)[:, 1]
    fpr, tpr, _ = roc_curve(y_test, y_proba)
    auc = roc_auc_score(y_test, y_proba)
    axes[0, 1].plot(fpr, tpr, lw=2, label=f'AUC = {auc:.3f}')
    axes[0, 1].plot([0, 1], [0, 1], 'k--', alpha=0.5)
    axes[0, 1].set_title('Curva ROC')
    axes[0, 1].set_xlabel('FPR')
    axes[0, 1].set_ylabel('TPR')
    axes[0, 1].legend()
    axes[0, 1].grid(alpha=0.3)
    
    # 3. Distribución de probabilidades
    axes[1, 0].hist(y_proba[y_test == 0], bins=15, alpha=0.6, label='Rechazados (Real)', color='red')
    axes[1, 0].hist(y_proba[y_test == 1], bins=15, alpha=0.6, label='Aprobados (Real)', color='green')
    axes[1, 0].axvline(0.5, color='blue', linestyle='--', linewidth=2, label='Threshold=0.5')
    axes[1, 0].set_title('Distribución de Probabilidades')
    axes[1, 0].set_xlabel('P(Aprobado)')
    axes[1, 0].set_ylabel('Frecuencia')
    axes[1, 0].legend()
    axes[1, 0].grid(alpha=0.3)
    
    # 4. Comparación de thresholds
    thresholds = [r['threshold'] for r in results]
    fps = [r['fp'] for r in results]
    fns = [r['fn'] for r in results]
    
    axes[1, 1].plot(thresholds, fps, 'o-', label='False Positives', color='red', linewidth=2)
    axes[1, 1].plot(thresholds, fns, 's-', label='False Negatives', color='orange', linewidth=2)
    axes[1, 1].axvline(0.5, color='gray', linestyle='--', alpha=0.5)
    axes[1, 1].set_title('Errores vs Threshold')
    axes[1, 1].set_xlabel('Threshold')
    axes[1, 1].set_ylabel('Número de Errores')
    axes[1, 1].legend()
    axes[1, 1].grid(alpha=0.3)
    
    plt.tight_layout()
    plt.savefig('/mnt/g/My Drive/SigmaProWeb/proyecto_sigmaProXVL/Red Neuronal/analisis_creditos_charts.png', dpi=150)
    print("   ✓ Gráficos guardados en: analisis_creditos_charts.png")
    plt.show()

# ═══════════════════════════════════════════════════════════════════════════════
# PARTE 7: RECOMENDACIONES
# ═══════════════════════════════════════════════════════════════════════════════

def print_recommendations(best_threshold, feature_importance_df, high_risk_df):
    """Imprime recomendaciones de mejora."""
    print("\n" + "="*80)
    print("RECOMENDACIONES DE MEJORA")
    print("="*80)
    
    print(f"""
✅ CAMBIOS INMEDIATOS:

1. 🎯 AJUSTAR THRESHOLD:
   • Cambiar de threshold=0.5 a threshold={best_threshold:.2f}
   • Esto reduce significativamente las aprobaciones de clientes de alto riesgo
   • Código: y_pred = (y_proba >= {best_threshold:.2f}).astype(int)

2. ⚖️ AJUSTAR CLASS_WEIGHT:
   • Usar class_weight='{{'0': 2, '1': 1}}' en RandomForest
   • O scale_pos_weight=2.0 en XGBoost
   • Esto penaliza más los False Positives (aprobaciones incorrectas)

3. 📊 ANALIZAR TOP FEATURES:
   • Las variables más importantes son:
   {chr(10).join([f"     - {row['feature']:20s} ({row['importance']:.4f})" for _, row in feature_importance_df.head(5).iterrows()])}
   
   • Asegúrese que estas variables se ponderan correctamente
   • Especialmente: score_credito, ingreso_mensual, deuda_actual

4. 🚨 ESTABLECER LÍMITES DE NEGOCIO:
   • Score de crédito MÍNIMO: >= 650
   • Deuda/Ingreso MÁXIMO: 7.0x
   • Ingreso MÍNIMO: >= 4000

5. 🔍 IMPLEMENTAR VALIDACIÓN CRUZADA ESTRATIFICADA:
   • Aumentar cv_folds a 5 con StratifiedKFold
   • Para dataset pequeño, esto es crítico

6. 📈 PRÓXIMOS PASOS:
   • Recolectar más datos financieros (actualmente solo 50 registros)
   • Implementar modelos ensemble (RF + XGBoost + LogisticRegression)
   • Usar SHAP values para explicabilidad de decisiones
   • Implementar monitoreo de drift en producción

""")

# ═══════════════════════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    # Ejecutar análisis completo
    df = load_and_explore()
    high_risk_df = analyze_risk_profiles(df)
    rf, X_train, X_test, y_train, y_test, X_scaled, y, scaler, X = train_and_analyze(df)
    feature_importance_df = analyze_feature_importance(rf, X)
    best_threshold, results = optimize_threshold(rf, X_test, y_test)
    create_visualizations(rf, X_test, y_test, feature_importance_df, results)
    print_recommendations(best_threshold, feature_importance_df, high_risk_df)
    
    print("\n" + "="*80)
    print("✅ ANÁLISIS COMPLETADO")
    print("="*80)
