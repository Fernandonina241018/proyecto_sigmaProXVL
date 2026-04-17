import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.neural_network import MLPClassifier
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.metrics import (classification_report, roc_auc_score, roc_curve, 
                            precision_recall_curve, average_precision_score,
                            ConfusionMatrixDisplay)
from scipy import stats
import joblib
import warnings
warnings.filterwarnings('ignore')

# Configuración de estilo para gráficos profesionales
plt.style.use('seaborn-v0_8-darkgrid')
sns.set_palette("husl")

# ============================================
# PASO 1: GENERACIÓN DE DATOS MEJORADA
# ============================================
def generar_datos_reales(n_samples=1000, seed=42):
    """
    Genera datos sintéticos con relación realista entre horas de estudio y aprobación.
    
    Parámetros:
    -----------
    n_samples : int
        Número de muestras a generar
    seed : int
        Semilla para reproducibilidad
    
    Retorna:
    --------
    pd.DataFrame : DataFrame con columnas 'Horas_Estudio' y 'Aprobado'
    """
    np.random.seed(seed)
    
    # Rango más amplio para mejor extrapolación [0, 12]
    horas = np.random.uniform(0, 12, n_samples)
    
    # Función logística real: centro en 5.5 para mejor distribución
    prob_real = 1 / (1 + np.exp(-(horas - 5.5) * 1.2))
    
    # Añadir ruido realista (algunos estudiantes rinden mejor/peor)
    ruido_estudiante = np.random.normal(0, 0.1, n_samples)
    prob_con_ruido = np.clip(prob_real + ruido_estudiante, 0, 1)
    
    # Generar clases binarias
    aprobado = (np.random.random(n_samples) < prob_con_ruido).astype(int)
    
    return pd.DataFrame({
        'Horas_Estudio': horas,
        'Aprobado': aprobado
    })

# Generar datos
data = generar_datos_reales(n_samples=1000, seed=42)

print("=" * 60)
print("ANÁLISIS EXPLORATORIO DE DATOS")
print("=" * 60)
print(f"\n📊 Total observaciones: {len(data)}")
print(f"📈 Tasa de aprobación: {data['Aprobado'].mean():.2%}")
print(f"📉 Horas promedio: {data['Horas_Estudio'].mean():.2f} (±{data['Horas_Estudio'].std():.2f})")
print(f"📏 Rango de horas: [{data['Horas_Estudio'].min():.1f}, {data['Horas_Estudio'].max():.1f}]")

# Visualización rápida de distribución
fig, axes = plt.subplots(1, 2, figsize=(12, 4))
data[data['Aprobado']==0]['Horas_Estudio'].hist(ax=axes[0], bins=20, alpha=0.7, label='Reprobados', color='red')
data[data['Aprobado']==1]['Horas_Estudio'].hist(ax=axes[0], bins=20, alpha=0.7, label='Aprobados', color='green')
axes[0].set_xlabel('Horas de Estudio')
axes[0].set_ylabel('Frecuencia')
axes[0].set_title('Distribución de Horas por Resultado')
axes[0].legend()

data.boxplot(column='Horas_Estudio', by='Aprobado', ax=axes[1])
axes[1].set_title('Boxplot: Horas vs Aprobación')
axes[1].set_xlabel('Resultado')
axes[1].set_ylabel('Horas de Estudio')
plt.suptitle('')
plt.tight_layout()
plt.show()

# ============================================
# PASO 2: DIVISIÓN ESTRATIFICADA CON VALIDACIÓN
# ============================================
X = data[['Horas_Estudio']]
y = data['Aprobado']

# División train/test estratificada
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print(f"\n✅ División de datos:")
print(f"   Train: {len(X_train)} muestras ({y_train.mean():.1%} aprobados)")
print(f"   Test:  {len(X_test)} muestras ({y_test.mean():.1%} aprobados)")

# ============================================
# PASO 3: ENTRENAMIENTO CON RED PROFUNDA + VALIDACIÓN CRUZADA
# ============================================
# Red neuronal profunda (4 capas ocultas) para capturar relaciones no lineales
arquitectura_red = (128, 64, 32, 16)
modelo = MLPClassifier(
    hidden_layer_sizes=arquitectura_red,
    activation='relu',
    solver='adam',
    alpha=0.0005,
    learning_rate_init=0.001,
    max_iter=800,
    early_stopping=True,
    validation_fraction=0.15,
    n_iter_no_change=25,
    random_state=42
)

# Entrenamiento
modelo.fit(X_train, y_train)

# Validación cruzada (5 folds)
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
cv_scores_auc = cross_val_score(modelo, X, y, cv=cv, scoring='roc_auc')
cv_scores_accuracy = cross_val_score(modelo, X, y, cv=cv, scoring='accuracy')

# Umbral aproximado de horas para probabilidad 50%
horas_grid = np.linspace(0, 15, 500).reshape(-1, 1)
proba_grid = modelo.predict_proba(horas_grid)[:, 1]
idx_umbral = np.abs(proba_grid - 0.5).argmin()
horas_umbral_50 = horas_grid[idx_umbral, 0]

# Bootstrap de modelos para intervalos de confianza de predicción
n_bootstraps = 150
modelos_bootstrap = []
np.random.seed(42)
for i in range(n_bootstraps):
    indices = np.random.choice(len(X_train), len(X_train), replace=True)
    X_boot = X_train.iloc[indices]
    y_boot = y_train.iloc[indices]

    if y_boot.nunique() < 2:
        continue

    try:
        model_boot = MLPClassifier(
            hidden_layer_sizes=arquitectura_red,
            activation='relu',
            solver='adam',
            alpha=0.0005,
            learning_rate_init=0.001,
            max_iter=500,
            early_stopping=True,
            validation_fraction=0.15,
            n_iter_no_change=20,
            random_state=42 + i
        )
        model_boot.fit(X_boot, y_boot)
        modelos_bootstrap.append(model_boot)
    except Exception:
        continue

print("\n" + "=" * 60)
print("MODELO ENTRENADO - RESULTADOS")
print("=" * 60)
print(f"\n🧠 Arquitectura red neuronal: {arquitectura_red}")
print(f"⚙️  Activación: {modelo.activation} | Solver: {modelo.solver}")
print(f"🔁 Iteraciones usadas: {modelo.n_iter_}")
print(f"⏱️  Horas para ~50% de probabilidad: {horas_umbral_50:.2f} horas")
print(f"🧪 Modelos bootstrap válidos: {len(modelos_bootstrap)}/{n_bootstraps}")

print(f"\n🔍 Validación Cruzada (5 folds):")
print(f"   • AUC promedio: {cv_scores_auc.mean():.3f} (±{cv_scores_auc.std():.3f})")
print(f"   • Accuracy promedio: {cv_scores_accuracy.mean():.3f} (±{cv_scores_accuracy.std():.3f})")

# ============================================
# PASO 4: EVALUACIÓN COMPLETA EN TEST
# ============================================
y_pred_test = modelo.predict(X_test)
y_proba_test = modelo.predict_proba(X_test)[:, 1]

# Métricas avanzadas
auc_score = roc_auc_score(y_test, y_proba_test)
ap_score = average_precision_score(y_test, y_proba_test)

print("\n" + "=" * 60)
print("EVALUACIÓN EN DATOS NO VISTOS (TEST SET)")
print("=" * 60)
print("\n📋 Classification Report:")
print(classification_report(y_test, y_pred_test, target_names=['Reprobado', 'Aprobado']))
print(f"\n📈 Métricas avanzadas:")
print(f"   • AUC-ROC: {auc_score:.3f}")
print(f"   • Average Precision (PR-AUC): {ap_score:.3f}")

# ============================================
# PASO 5: ANÁLISIS DE RESIDUOS APROXIMADO
# ============================================
residuos = y_test - y_proba_test
eps = 1e-6
residuos_pearson = (y_test - y_proba_test) / np.sqrt(np.clip(y_proba_test * (1 - y_proba_test), eps, None))

# ============================================
# PASO 6: FUNCIÓN DE PREDICCIÓN MEJORADA
# ============================================
def predecir_aprobacion(horas_estudio, mostrar_intervalo=True):
    """
    Predice probabilidad de aprobar con intervalos de confianza.
    
    Parámetros:
    -----------
    horas_estudio : float
        Horas dedicadas al estudio (recomendado: 0-15)
    mostrar_intervalo : bool
        Si mostrar intervalos de confianza de la predicción
    
    Retorna:
    --------
    dict : Diccionario con predicciones y métricas
    """
    # Validación robusta
    if not isinstance(horas_estudio, (int, float)):
        raise ValueError("❌ Las horas deben ser un número")
    
    if horas_estudio < 0:
        print("⚠️  Horas negativas no tienen sentido. Usando 0 horas.")
        horas_estudio = 0
    
    # Advertencia de extrapolación
    if horas_estudio > 15:
        print(f"⚠️  ADVERTENCIA: {horas_estudio} horas está fuera del rango entrenado (0-12 horas)")
        print("   La predicción puede ser poco confiable.")
    
    # Predicción base
    X_nuevo = np.array([[horas_estudio]])
    proba = modelo.predict_proba(X_nuevo)[0]
    clase = modelo.predict(X_nuevo)[0]
    
    # Intervalos de confianza por ensamble bootstrap de redes
    if mostrar_intervalo:
        if len(modelos_bootstrap) >= 30:
            boot_probs = [m.predict_proba(X_nuevo)[0, 1] for m in modelos_bootstrap]
            ci_lower, ci_upper = np.percentile(boot_probs, [2.5, 97.5])
        else:
            ci_lower, ci_upper = np.nan, np.nan
    
    # Resultados formateados
    print("\n" + "=" * 60)
    print(f"🎯 PREDICCIÓN PARA {horas_estudio:.1f} HORAS DE ESTUDIO")
    print("=" * 60)
    print(f"\n📊 Probabilidades:")
    print(f"   • Reprobar: {proba[0]:.1%}")
    print(f"   • Aprobar:  {proba[1]:.1%}")
    
    if mostrar_intervalo:
        print(f"\n📏 Intervalo de confianza 95% para P(Aprobar):")
        if np.isnan(ci_lower) or np.isnan(ci_upper):
            print("   • No disponible (muestras bootstrap insuficientes)")
        else:
            print(f"   • Límite inferior: {ci_lower:.1%}")
            print(f"   • Límite superior: {ci_upper:.1%}")
    
    print(f"\n✅ Decisión: {'APRUEBA' if clase == 1 else 'REPRUEBA'}")
    
    # Interpretación cualitativa
    if proba[1] >= 0.8:
        print("   🟢 Muy alta probabilidad de éxito")
    elif proba[1] >= 0.6:
        print("   🟡 Probabilidad favorable")
    elif proba[1] >= 0.4:
        print("   🟠 Zona de incertidumbre - Recomendación: estudiar más")
    elif proba[1] >= 0.2:
        print("   🔴 Baja probabilidad - Riesgo alto de reprobar")
    else:
        print("   🔴 Muy baja probabilidad - Necesitas mucho más estudio")
    
    return {
        'prob_aprobar': proba[1],
        'prob_reprobar': proba[0],
        'clase': clase,
        'horas': horas_estudio
    }

# ============================================
# PASO 7: VISUALIZACIONES PROFESIONALES
# ============================================
fig = plt.figure(figsize=(16, 10))

# 1. Curva Logística y datos
ax1 = plt.subplot(2, 3, 1)
horas_plot = np.linspace(-1, 14, 500).reshape(-1, 1)
proba_plot = modelo.predict_proba(horas_plot)[:, 1]

# Datos con transparencia
ax1.scatter(X_train, y_train, alpha=0.4, label='Train', color='blue', s=30)
ax1.scatter(X_test, y_test, alpha=0.6, label='Test', color='green', s=40, marker='s', edgecolors='black', linewidth=0.5)

# Curva logística
ax1.plot(horas_plot, proba_plot, 'r-', linewidth=2.5, label='P(Aprobar)')
ax1.axhline(y=0.5, color='gray', linestyle='--', alpha=0.7, label='Umbral 50%')

# Intervalos de confianza (simulados)
ax1.fill_between(horas_plot.flatten(), 
                 np.maximum(0, proba_plot - 0.1), 
                 np.minimum(1, proba_plot + 0.1),
                 alpha=0.2, color='red', label='IC 95% aproximado')

ax1.set_xlabel('Horas de Estudio', fontsize=11)
ax1.set_ylabel('Probabilidad / Clase', fontsize=11)
ax1.set_title('Modelo de Regresión Logística\ncon Intervalos de Confianza', fontsize=12, fontweight='bold')
ax1.legend(loc='lower right', fontsize=9)
ax1.grid(alpha=0.3)
ax1.set_xlim(-0.5, 13)
ax1.set_ylim(-0.05, 1.05)

# 2. Curva ROC
ax2 = plt.subplot(2, 3, 2)
fpr, tpr, _ = roc_curve(y_test, y_proba_test)
ax2.plot(fpr, tpr, linewidth=2.5, label=f'ROC (AUC = {auc_score:.3f})', color='darkorange')
ax2.plot([0, 1], [0, 1], 'k--', label='Clasificador aleatorio', alpha=0.7)
ax2.fill_between(fpr, tpr, alpha=0.3, color='orange')
ax2.set_xlabel('Tasa de Falsos Positivos (1 - Especificidad)', fontsize=11)
ax2.set_ylabel('Tasa de Verdaderos Positivos (Sensibilidad)', fontsize=11)
ax2.set_title('Curva ROC', fontsize=12, fontweight='bold')
ax2.legend(loc='lower right', fontsize=10)
ax2.grid(alpha=0.3)

# 3. Curva Precision-Recall
ax3 = plt.subplot(2, 3, 3)
precision, recall, _ = precision_recall_curve(y_test, y_proba_test)
ax3.plot(recall, precision, linewidth=2.5, label=f'PR (AP = {ap_score:.3f})', color='green')
ax3.set_xlabel('Recall (Sensibilidad)', fontsize=11)
ax3.set_ylabel('Precisión', fontsize=11)
ax3.set_title('Curva Precision-Recall', fontsize=12, fontweight='bold')
ax3.legend(loc='lower left', fontsize=10)
ax3.grid(alpha=0.3)

# 4. Matriz de Confusión
ax4 = plt.subplot(2, 3, 4)
ConfusionMatrixDisplay.from_estimator(modelo, X_test, y_test, 
                                      display_labels=['Reprobado', 'Aprobado'],
                                      ax=ax4, cmap='Blues', colorbar=False)
ax4.set_title('Matriz de Confusión - Test Set', fontsize=12, fontweight='bold')

# 5. Distribución de Probabilidades
ax5 = plt.subplot(2, 3, 5)
ax5.hist(y_proba_test[y_test==0], bins=15, alpha=0.7, label='Real: Reprobados', color='red', density=True)
ax5.hist(y_proba_test[y_test==1], bins=15, alpha=0.7, label='Real: Aprobados', color='green', density=True)
ax5.axvline(x=0.5, color='black', linestyle='--', alpha=0.7, label='Umbral decisión')
ax5.set_xlabel('Probabilidad predicha de aprobar', fontsize=11)
ax5.set_ylabel('Densidad', fontsize=11)
ax5.set_title('Calibración del Modelo', fontsize=12, fontweight='bold')
ax5.legend(fontsize=9)
ax5.grid(alpha=0.3)

# 6. Análisis de Residuos
ax6 = plt.subplot(2, 3, 6)
ax6.scatter(y_proba_test, residuos_pearson, alpha=0.6, edgecolors='black', linewidth=0.5)
ax6.axhline(y=0, color='red', linestyle='--', alpha=0.7)
ax6.axhline(y=2, color='gray', linestyle=':', alpha=0.5)
ax6.axhline(y=-2, color='gray', linestyle=':', alpha=0.5)
ax6.set_xlabel('Probabilidad Predicha', fontsize=11)
ax6.set_ylabel('Residuos de Pearson', fontsize=11)
ax6.set_title('Análisis de Residuos', fontsize=12, fontweight='bold')
ax6.grid(alpha=0.3)

plt.tight_layout()
plt.show()

# ============================================
# PASO 8: EJEMPLOS DE PREDICCIÓN Y EXPORTACIÓN
# ============================================
print("\n" + "=" * 60)
print("EJEMPLOS DE PREDICCIÓN DETALLADA")
print("=" * 60)

casos_prueba = [0, 2.5, 4, 5.5, 7, 9, 12]
resultados = []
for horas in casos_prueba:
    resultado = predecir_aprobacion(horas, mostrar_intervalo=True)
    resultados.append(resultado)
    print("\n" + "-" * 40)

# Tabla resumen de predicciones
df_resultados = pd.DataFrame(resultados)
print("\n" + "=" * 60)
print("📊 TABLA RESUMEN DE PREDICCIONES")
print("=" * 60)
print(df_resultados.round(3))

# ============================================
# PASO 9: EXPORTAR MODELO (OPCIONAL)
# ============================================
exportar_modelo = input("\n💾 ¿Deseas exportar el modelo entrenado? (s/n): ").lower()
if exportar_modelo == 's':
    nombre_archivo = 'modelo_regresion_logistica.pkl'
    joblib.dump(modelo, nombre_archivo)
    print(f"✅ Modelo exportado exitosamente como '{nombre_archivo}'")
    print("   Para cargar: modelo = joblib.load('modelo_regresion_logistica.pkl')")

# ============================================
# PASO 10: INTERFAZ INTERACTIVA MEJORADA
# ============================================
print("\n" + "=" * 60)
print("🖥️  MODO INTERACTIVO")
print("=" * 60)
print("Ingresa horas de estudio para obtener predicciones personalizadas")
print("(Escribe 'salir' para terminar, 'info' para ver estadísticas)\n")

historial_predicciones = []

while True:
    try:
        entrada = input("\n📚 Horas de estudio: ").strip().lower()
        
        if entrada == 'salir':
            if historial_predicciones:
                print(f"\n📊 Resumen de {len(historial_predicciones)} predicciones realizadas:")
                df_hist = pd.DataFrame(historial_predicciones)
                print(f"   • Promedio de horas: {df_hist['horas'].mean():.2f}")
                print(f"   • Tasa de aprobación predicha: {df_hist['prob_aprobar'].mean():.1%}")
            print("\n👋 ¡Hasta luego!")
            break
        
        elif entrada == 'info':
            print("\n📈 Estadísticas del modelo:")
            print(f"   • AUC-ROC: {auc_score:.3f}")
            print(f"   • Horas para 50% de probabilidad: {horas_umbral_50:.2f}")
            print(f"   • Arquitectura: {arquitectura_red}")
            continue
        
        horas_input = float(entrada)
        
        if horas_input < 0:
            print("❌ Las horas no pueden ser negativas. Intenta nuevamente.")
            continue
        
        if horas_input > 20:
            print("⚠️  Advertencia: Más de 20 horas de estudio es poco realista.")
        
        # Realizar predicción y guardar en historial
        resultado = predecir_aprobacion(horas_input, mostrar_intervalo=True)
        historial_predicciones.append(resultado)
        
        # Recomendación adicional si aplica
        if resultado['prob_aprobar'] < 0.5 and resultado['prob_aprobar'] > 0.3:
            horas_necesarias = horas_umbral_50
            print(f"\n💡 Recomendación: Necesitas aproximadamente {horas_necesarias:.1f} horas para tener 50% de probabilidad de aprobar.")
        
    except ValueError:
        print("❌ Error: Ingresa un número válido (ej: 5.5) o 'salir' para terminar")
    except KeyboardInterrupt:
        print("\n\n👋 Programa interrumpido por el usuario. ¡Hasta luego!")
        break

print("\n" + "=" * 60)
print("🏁 PROGRAMA FINALIZADO")
print("=" * 60)