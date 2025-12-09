import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, roc_auc_score, roc_curve

# ============================================
# PASO 1: DATOS DE ENTRENAMIENTO (EXPANDIDOS)
# ============================================
# CRÍTICO: 10 puntos son insuficientes. Aquí genero 50 con ruido realista
np.random.seed(42)
n_samples = 500

horas = np.random.uniform(1, 10, n_samples)
# Probabilidad logística real: P = 1/(1 + exp(-(horas - 5)))
prob_real = 1 / (1 + np.exp(-(horas - 5)))
# Añadir ruido: algunos aprueban/reprueban contra las probabilidades
aprobado = (np.random.random(n_samples) < prob_real).astype(int)

data = pd.DataFrame({
    'Horas_Estudio': horas,
    'Aprobado': aprobado
})    

print("=" * 50)
print("DATOS DE ENTRENAMIENTO")
print("=" * 50)
print(data.head(10))
print(f"\nTotal observaciones: {len(data)}")
print(f"Tasa de aprobación: {aprobado.mean():.2%}")

# ============================================
# PASO 2: DIVISIÓN TRAIN/TEST
# ============================================
X = data[['Horas_Estudio']]
y = data['Aprobado']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print(f"\nTrain: {len(X_train)} | Test: {len(X_test)}")

# ============================================
# PASO 3: ENTRENAMIENTO
# ============================================
modelo = LogisticRegression(max_iter=1000, random_state=42)
modelo.fit(X_train, y_train)

beta_0 = modelo.intercept_[0]
beta_1 = modelo.coef_[0][0]

print("\n" + "=" * 50)
print("MODELO ENTRENADO")
print("=" * 50)
print(f"Ecuación: log(P/(1-P)) = {beta_0:.3f} + {beta_1:.3f} × Horas")
print(f"\nInterpretación:")
print(f"- Cada hora adicional multiplica las odds por {np.exp(beta_1):.2f}")
print(f"- Con 0 horas, odds de aprobar = {np.exp(beta_0):.3f}")

# ============================================
# PASO 4: EVALUACIÓN EN TEST SET
# ============================================
y_pred_test = modelo.predict(X_test)
y_proba_test = modelo.predict_proba(X_test)[:, 1]

print("\n" + "=" * 50)
print("EVALUACIÓN (DATOS NO VISTOS)")
print("=" * 50)
print(classification_report(y_test, y_pred_test, target_names=['Reprobado', 'Aprobado']))
print(f"AUC-ROC: {roc_auc_score(y_test, y_proba_test):.3f}")

# ============================================
# PASO 5: FUNCIÓN DE PREDICCIÓN INTERACTIVA
# ============================================
def predecir_aprobacion(horas_estudio):
    """
    Predice probabilidad de aprobar dado horas de estudio.
    
    ADVERTENCIAS:
    - Extrapolación fuera de [1, 10] horas es poco confiable
    - Probabilidades son estimaciones, no certezas
    """
    if not 0 <= horas_estudio <= 15:
        print(f"⚠️  ADVERTENCIA: {horas_estudio} horas está fuera del rango razonable")
    
    X_nuevo = np.array([[horas_estudio]])
    proba = modelo.predict_proba(X_nuevo)[0]
    clase = modelo.predict(X_nuevo)[0]
    
    print("\n" + "=" * 50)
    print(f"PREDICCIÓN PARA {horas_estudio} HORAS DE ESTUDIO")
    print("=" * 50)
    print(f"Probabilidad de REPROBAR: {proba[0]:.1%}")
    print(f"Probabilidad de APROBAR:  {proba[1]:.1%}")
    print(f"\nPredicción: {'✓ APROBADO' if clase == 1 else '✗ REPROBADO'}")
    
    if proba[1] > 0.4 and proba[1] < 0.6:
        print("\n⚠️  Zona de incertidumbre: resultado impredecible")
    
    return proba[1]

# ============================================
# PASO 6: VISUALIZACIÓN
# ============================================
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))

# Panel izquierdo: Datos y curva logística
horas_plot = np.linspace(0, 12, 300).reshape(-1, 1)
proba_plot = modelo.predict_proba(horas_plot)[:, 1]

ax1.scatter(X_train, y_train, alpha=0.5, label='Train', color='blue', s=50)
ax1.scatter(X_test, y_test, alpha=0.7, label='Test', color='green', s=50, marker='s')
ax1.plot(horas_plot, proba_plot, 'r-', linewidth=2, label='P(Aprobar)')
ax1.axhline(y=0.5, color='gray', linestyle='--', alpha=0.5, label='Umbral 50%')
ax1.set_xlabel('Horas de Estudio', fontsize=12)
ax1.set_ylabel('Probabilidad / Clase', fontsize=12)
ax1.set_title('Modelo de Regresión Logística', fontsize=14, fontweight='bold')
ax1.legend()
ax1.grid(alpha=0.3)

# Panel derecho: Curva ROC
fpr, tpr, _ = roc_curve(y_test, y_proba_test)
ax2.plot(fpr, tpr, linewidth=2, label=f'ROC (AUC={roc_auc_score(y_test, y_proba_test):.3f})')
ax2.plot([0, 1], [0, 1], 'k--', label='Azar')
ax2.set_xlabel('Tasa Falsos Positivos', fontsize=12)
ax2.set_ylabel('Tasa Verdaderos Positivos', fontsize=12)
ax2.set_title('Curva ROC', fontsize=14, fontweight='bold')
ax2.legend()
ax2.grid(alpha=0.3)

plt.tight_layout()
plt.show()

# ============================================
# PASO 7: EJEMPLOS DE USO
# ============================================
print("\n" + "=" * 50)
print("EJEMPLOS DE PREDICCIÓN")
print("=" * 50)

# Casos de prueba
casos_prueba = [2, 5, 8, 10]
for horas in casos_prueba:
    predecir_aprobacion(horas)

# ============================================
# PASO 8: INPUT DEL USUARIO (DESCOMENTA PARA USAR)
# ============================================
while True:
     try:
         horas_input = float(input("\n\nIngresa horas de estudio (o -1 para salir): "))
         if horas_input == -1:
             break
         predecir_aprobacion(horas_input)
     except ValueError:
         print("❌ Error: ingresa un número válido")
     except KeyboardInterrupt:
         print("\n\nPrograma terminado")
         break