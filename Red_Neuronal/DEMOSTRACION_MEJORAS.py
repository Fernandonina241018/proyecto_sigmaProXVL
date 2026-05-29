"""
DEMOSTRACIÓN DE MEJORAS - Modelo de Créditos
═════════════════════════════════════════════

Este script compara el comportamiento del modelo antes y después
de las optimizaciones implementadas.

Cambios:
1. ✓ class_weight mejorado: {0: 3, 1: 1}
2. ✓ scale_pos_weight para XGBoost: 6.0
3. ✓ Threshold ajustable: 0.70 en lugar de 0.50
4. ✓ max_depth reducido: 10 en lugar de None (menos overfit)

CÓMO USAR:
  1. Ejecutar este script para ver comparación
  2. Ejecutar main.py para entrenar nuevo modelo
  3. Elegir opción "1. Entrenar nuevo modelo"
  4. Seleccionar dataset: entrenamiento_financiero.csv
  5. Observar diferencias en predicciones
"""

import csv
from collections import defaultdict

def demo_threshold_impact():
    """Demuestra el impacto de cambiar el threshold."""
    print("\n" + "="*80)
    print("DEMOSTRACIÓN: IMPACTO DEL THRESHOLD")
    print("="*80)
    
    # Simulación de probabilidades predichas por un modelo
    # (estos son ejemplos basados en el análisis real)
    
    client_predictions = [
        # id, true_label (1=aprobado, 0=rechazado), predicted_probability
        (1, 1, 0.92),   # Caso claro: cliente bueno, prob alta ✓
        (2, 1, 0.85),   # Caso claro: cliente bueno, prob alta ✓
        (5, 0, 0.15),   # Caso claro: cliente malo, prob baja ✓
        (6, 0, 0.08),   # Caso claro: cliente malo, prob muy baja ✓
        (8, 0, 0.62),   # PROBLEMA: cliente malo, pero prob moderada-alta
        (11, 0, 0.48),  # PROBLEMA: cliente malo, pero prob cerca de 0.5
        (16, 0, 0.35),  # PROBLEMA: cliente malo, pero prob > 0.30
        (24, 0, 0.58),  # PROBLEMA: cliente malo, pero prob moderada-alta
        (29, 0, 0.55),  # PROBLEMA: cliente malo, pero prob > 0.5
        (35, 0, 0.42),  # Límite: cliente malo, pero prob baja
        (43, 0, 0.65),  # PROBLEMA: cliente malo, pero prob alta
    ]
    
    print(f"\n📊 ANÁLISIS DE 11 CLIENTES CON CARACTERÍSTICAS DE RIESGO:\n")
    
    # Threshold 0.50 (actual)
    print("🔴 CON THRESHOLD = 0.50 (ACTUAL - PERMISIVO):")
    print("-" * 80)
    print(f"{'ID':<5} {'Real':<10} {'Probabil':<12} {'Pred@0.50':<12} {'Correcto':<12}")
    print("-" * 80)
    
    tp_050 = fp_050 = fn_050 = tn_050 = 0
    for id_c, true_label, prob in client_predictions:
        pred_050 = 1 if prob >= 0.50 else 0
        is_correct = "✓" if pred_050 == true_label else "✗ ERROR"
        
        label_str = "Aprobado" if true_label == 1 else "Rechazado"
        pred_str = "Aprobado" if pred_050 == 1 else "Rechazado"
        
        print(f"{id_c:<5} {label_str:<10} {prob:<12.2f} {pred_str:<12} {is_correct}")
        
        if pred_050 == 1 and true_label == 1:
            tp_050 += 1
        elif pred_050 == 1 and true_label == 0:
            fp_050 += 1
        elif pred_050 == 0 and true_label == 1:
            fn_050 += 1
        else:
            tn_050 += 1
    
    print("-" * 80)
    print(f"  Verdaderos Positivos (TP):        {tp_050}")
    print(f"  Falsos Positivos (FP) ⚠️:        {fp_050} ← PROBLEMA: Aprobamos malos")
    print(f"  Falsos Negativos (FN):            {fn_050}")
    print(f"  Verdaderos Negativos (TN):        {tn_050}")
    
    if (tp_050 + fp_050) > 0:
        precision_050 = tp_050 / (tp_050 + fp_050)
        print(f"  Precision: {precision_050:.2%} ← de quien aprobamos, cuántos son buenos")
    
    # Threshold 0.70 (mejorado)
    print(f"\n🟢 CON THRESHOLD = 0.70 (MEJORADO - CONSERVADOR):")
    print("-" * 80)
    print(f"{'ID':<5} {'Real':<10} {'Probabil':<12} {'Pred@0.70':<12} {'Correcto':<12}")
    print("-" * 80)
    
    tp_070 = fp_070 = fn_070 = tn_070 = 0
    for id_c, true_label, prob in client_predictions:
        pred_070 = 1 if prob >= 0.70 else 0
        is_correct = "✓" if pred_070 == true_label else "✗ ERROR"
        
        label_str = "Aprobado" if true_label == 1 else "Rechazado"
        pred_str = "Aprobado" if pred_070 == 1 else "Rechazado"
        
        print(f"{id_c:<5} {label_str:<10} {prob:<12.2f} {pred_str:<12} {is_correct}")
        
        if pred_070 == 1 and true_label == 1:
            tp_070 += 1
        elif pred_070 == 1 and true_label == 0:
            fp_070 += 1
        elif pred_070 == 0 and true_label == 1:
            fn_070 += 1
        else:
            tn_070 += 1
    
    print("-" * 80)
    print(f"  Verdaderos Positivos (TP):        {tp_070}")
    print(f"  Falsos Positivos (FP) ⚠️:        {fp_070} ← MEJORA: Menos malos aprobados")
    print(f"  Falsos Negativos (FN):            {fn_070}")
    print(f"  Verdaderos Negativos (TN):        {tn_070}")
    
    if (tp_070 + fp_070) > 0:
        precision_070 = tp_070 / (tp_070 + fp_070)
        print(f"  Precision: {precision_070:.2%} ← de quien aprobamos, cuántos son buenos")
    
    # Comparación
    print(f"\n📊 COMPARACIÓN DE MEJORA:")
    print("-" * 80)
    fp_reduction = fp_050 - fp_070
    print(f"  Reducción de Falsos Positivos: {fp_050} → {fp_070} (-{fp_reduction} errores)")
    if fp_050 > 0:
        pct_reduction = (fp_reduction / fp_050) * 100
        print(f"  Porcentaje de mejora: {pct_reduction:.0f}%")
    
    fn_increase = fn_070 - fn_050
    if fn_increase > 0:
        print(f"  Aumento de Falsos Negativos: {fn_050} → {fn_070} (+{fn_increase})")
        print(f"  (Esto es aceptable: rechazamos algunos buenos para evitar aprobar malos)")

def demo_class_weight_impact():
    """Demuestra el impacto del class_weight mejorado."""
    print("\n" + "="*80)
    print("DEMOSTRACIÓN: IMPACTO DE CLASS_WEIGHT")
    print("="*80)
    
    print("""
⚖️  ANTES (class_weight='balanced'):
   • Random Forest penaliza todos los errores por igual
   • Con 86% aprobados / 14% rechazados:
     - Costo de error en "aprobado": 1.0
     - Costo de error en "rechazado": 1.0
   • El modelo aprende a ser PERMISIVO (más aprobados = mejor accuracy)

🟢 DESPUÉS (class_weight={0: 3, 1: 1}):
   • Random Forest penaliza 3x más los errores en rechazados
   • Con {0: 3, 1: 1}:
     - Costo de error en "aprobado": 1.0
     - Costo de error en "rechazado": 3.0 ← 3 VECES MÁS
   • El modelo aprende a ser CONSERVADOR (rechaza dudosos)

📈 RESULTADO:
   • Menos falsos positivos (aprobamos menos malos)
   • Más falsos negativos (rechazamos algunos buenos)
   • PERO en créditos, esto es CORRECTO (es mejor rechazar buenos que aprobar malos)
    """)

def demo_business_rules():
    """Muestra cómo aplicar límites de negocio."""
    print("\n" + "="*80)
    print("DEMOSTRACIÓN: LÍMITES DE NEGOCIO")
    print("="*80)
    
    print("""
🎯 IMPLEMENTAR VALIDACIONES DE NEGOCIO:

Código a añadir ANTES de usar el modelo:

    def should_approve_credit(cliente):
        # 1. REGLA DE NEGOCIO DURA: Score mínimo
        if cliente['score_credito'] < 650:
            return False, "Score crédito muy bajo (<650)"
        
        # 2. REGLA DE NEGOCIO DURA: Ingreso mínimo
        if cliente['ingreso_mensual'] < 3000:
            return False, "Ingreso insuficiente (<$3,000)"
        
        # 3. REGLA DE NEGOCIO DURA: Ratio Deuda/Ingreso
        ratio = cliente['monto_solicitado'] / cliente['ingreso_mensual']
        if ratio > 7.0:
            return False, f"Apalancamiento excesivo (DTI={ratio:.1f})"
        
        # 4. Si pasa validaciones, usar modelo ML
        probabilities = modelo.predict_proba([cliente])
        prob_approval = probabilities[0, 1]
        
        if prob_approval >= 0.70:  # Threshold conservador
            return True, f"Aprobado por modelo (prob={prob_approval:.0%})"
        else:
            return False, f"Insuficiente confianza del modelo (prob={prob_approval:.0%})"

📋 EJEMPLO DE APLICACIÓN:

    Cliente #8: score=640, ingreso=$3,800, monto=$18,000
    
    • ❌ Rule 1: score (640) < 650? SÍ → RECHAZAR
    • No necesita verificar otras reglas
    Resultado: RECHAZADO ✓ (es cliente de riesgo)
    
    Cliente #15: score=660, ingreso=$4,200, monto=$20,000
    
    • ✓ Rule 1: score (660) >= 650
    • ✓ Rule 2: ingreso ($4,200) >= $3,000
    • ✓ Rule 3: ratio ($20,000/$4,200 = 4.76) <= 7.0
    • Procede a modelo ML
    • Prob = 0.75 >= 0.70? SÍ → APROBADO ✓
    Resultado: APROBADO ✓
    """)

def main():
    print("\n")
    print("╔════════════════════════════════════════════════════════════════════════════════╗")
    print("║        DEMOSTRACIONES - MEJORAS EN MODELO DE CRÉDITOS                         ║")
    print("╚════════════════════════════════════════════════════════════════════════════════╝")
    
    demo_threshold_impact()
    demo_class_weight_impact()
    demo_business_rules()
    
    print("\n" + "="*80)
    print("PRÓXIMOS PASOS")
    print("="*80)
    print("""
1. ✓ Cambios ya implementados en trainer.py y evaluator.py
   
2. Entrenar nuevo modelo:
   • python main.py
   • Seleccionar opción "1. Entrenar nuevo modelo"
   • Elegir dataset: entrenamiento_financiero.csv
   
3. Verificar mejoras:
   • Comparar métricas con modelo anterior
   • Observar reducción en False Positives
   • Matriz de confusión será diferente (es normal y esperado)
   
4. Ajustar threshold según necesidades:
   • Threshold 0.50: permisivo (aprueba más)
   • Threshold 0.65: moderado
   • Threshold 0.70: conservador (aprueba menos, menos riesgoso)
   • Threshold 0.80: muy conservador (muy pocos aprobados)
    """)

if __name__ == "__main__":
    main()
