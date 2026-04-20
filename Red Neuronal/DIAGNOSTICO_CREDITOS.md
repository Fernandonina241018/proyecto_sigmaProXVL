╔════════════════════════════════════════════════════════════════════════════════╗
║                  ANÁLISIS DETALLADO DE MODELO DE CRÉDITOS                       ║
║                    POR QUÉ ESTÁ APROBANDO RIESGO ALTO                           ║
╚════════════════════════════════════════════════════════════════════════════════╝

FECHA DE ANÁLISIS: 18 de Abril 2026
DATASET: entrenamiento_financiero.csv (50 registros)
PROBLEMA: El modelo está aprobando clientes de alto riesgo incorrectamente

═══════════════════════════════════════════════════════════════════════════════════
📊 DIAGNÓSTICO PRINCIPAL
═══════════════════════════════════════════════════════════════════════════════════

🔴 PROBLEMA #1: SEVERO DESBALANCE DE CLASES
───────────────────────────────────────────
  • Total aprobados:    43 clientes (86.0%) ✗ TOO MANY
  • Total rechazados:   7 clientes  (14.0%) ✓ too few
  • Ratio:              0.16 (debería ser ~0.3-0.5 para crédito prudente)

⚠️  IMPACTO: El modelo ve 6 ejemplos de aprobación por cada 1 de rechazo.
    Esto causa que el modelo aprenda a ser MUY PERMISIVO.

🟠 PROBLEMA #2: DATOS CONTRADICTORIOS
───────────────────────────────────────
  Score Crédito:
    • Aprobados:    729 ± 50   (ALTO - riesgo bajo)
    • Rechazados:   601 ± 16   (BAJO  - riesgo alto)
    • Diferencia:   128 puntos (CLARA SEPARACIÓN)
    ✓ Este feature es BUENO para distinguir

  Ingreso Mensual:
    • Aprobados:    $6,160 ± $1,581  (ALTO)
    • Rechazados:   $3,186 ± $318    (BAJO)
    • Diferencia:   $2,974 (95% más bajo en rechazados) ✓ MUY SEPARADO

  Deuda Actual:
    • Aprobados:    $2,372 ± $859   (MODERADA)
    • Rechazados:   $629 ± $207     (BAJA)
    • Diferencia:   $1,743 (375% más en aprobados) ⚠️ CONTRADICTORIO
    ✗ PROBLEMA: Los aprobados tienen MÁS deuda que los rechazados

═══════════════════════════════════════════════════════════════════════════════════
🎯 IDENTIFICACIÓN DE ERRORES ESPECÍFICOS
═══════════════════════════════════════════════════════════════════════════════════

Clientes APROBADOS con ALTO RIESGO (score < 650 AND ingreso < $4000):
  
  1. Cliente #8
     • Score Crédito: 640 (BAJO - riesgo alto) ⚠️
     • Ingreso:       $3,800/mes (BAJO)
     • Deuda:         $1,800 (MODERADA)
     • Decisión:      APROBADO ✗ INCORRECTO
     • Explicación:   El modelo debería rechazar esto
  
  2. Cliente #29
     • Score Crédito: 630 (BAJO - riesgo alto) ⚠️
     • Ingreso:       $3,500/mes (BAJO)
     • Deuda:         $1,000 (MODERADA)
     • Decisión:      APROBADO ✗ INCORRECTO

═══════════════════════════════════════════════════════════════════════════════════
🔍 RAÍCES DEL PROBLEMA
═══════════════════════════════════════════════════════════════════════════════════

1️⃣  DESBALANCE DE CLASES SEVERO (86% aprobados)
    → El modelo aprende a predecir "1" por defecto
    → Es como un paciente con 86% de probabilidad de estar sano
      que el médico simplemente diagnostica a todos como sanos

2️⃣  THRESHOLD = 0.5 ES INADECUADO
    → Con 86% de datos siendo "1", threshold 0.5 es demasiado bajo
    → El modelo podría predecir 0.51 (apenas arriba de 0.5) y aprobar

3️⃣  SIN PENALIZACIÓN POR FALSE POSITIVES
    → El modelo no está configurado para penalizar:
       - Aprobar clientes que debería rechazar (FP)
       - Esto es COSTOSO en créditos (pérdida monetaria)
    → El modelo optimiza para "accuracy general" no para "riesgo"

4️⃣  POSIBLE SOBREAJUSTE EN EL ENTRENAMIENTO
    → Con solo 50 registros, si el modelo memoriza patrones
    → Puede generar decisiones incorrectas

═══════════════════════════════════════════════════════════════════════════════════
✅ SOLUCIONES RECOMENDADAS (EN ORDEN DE PRIORIDAD)
═══════════════════════════════════════════════════════════════════════════════════

🔥 SOLUCIÓN #1: AJUSTAR THRESHOLD (INMEDIATO - 5 minutos)
─────────────────────────────────────────────────────────
  PROBLEMA: Threshold = 0.5 es demasiado bajo
  SOLUCIÓN: Aumentar a threshold = 0.65-0.75
  
  CÓDIGO en evaluator.py:
    
    # Cambiar esto:
    y_pred = pipeline.predict(X_test)
    
    # Por esto:
    y_proba = pipeline.predict_proba(X_test)[:, 1]
    THRESHOLD = 0.70  # ← Ajustable según necesidad
    y_pred = (y_proba >= THRESHOLD).astype(int)
  
  EFECTO:
    • Threshold 0.50 → Aprueba si P(aprobado) > 50%
    • Threshold 0.70 → Aprueba si P(aprobado) > 70%
    • Mayor threshold = más conservador = menos clientes malos aprobados

🔥 SOLUCIÓN #2: USAR CLASS_WEIGHT BALANCEADO (10 minutos)
──────────────────────────────────────────────────────────
  PROBLEMA: El modelo no penaliza errores en la clase minoritaria
  SOLUCIÓN: Penalizar False Positives (aprobar cuando debería rechazar)
  
  CÓDIGO en trainer.py (líneas 94-98 para RandomForest):
    
    Cambiar:
      p = dict(n_estimators=200, max_depth=None,
               random_state=seed, n_jobs=-1,
               class_weight="balanced")
    
    Por:
      p = dict(n_estimators=200, max_depth=None,
               random_state=seed, n_jobs=-1,
               class_weight={0: 3, 1: 1})  # ← Penaliza 3x más rechazos incorrectos
  
  PARA XGBOOST (línea 135):
    
    Cambiar:
      base["scale_pos_weight"] = 1.0
    
    Por:
      base["scale_pos_weight"] = 6.0  # ratio: 43 aprobados / 7 rechazados
  
  EFECTO:
    • El modelo aprenderá a ser más conservador
    • Preferirá rechazar (error FN) antes que aprobar mal (error FP)

🔥 SOLUCIÓN #3: USAR MÉTRICAS APROPIADAS PARA CRÉDITOS (15 minutos)
───────────────────────────────────────────────────────────────────
  PROBLEMA: Optimizamos por "accuracy" pero el costo es asimétrico
  SOLUCIÓN: Optimizar por F1-Score o Precision en rechazados
  
  BENEFICIO ESPERADO:
    • F1-Score pesa Precision y Recall equitativamente
    • Evita el bias hacia la clase mayoritaria
    • Mejor balance entre FP y FN

🔥 SOLUCIÓN #4: AÑADIR VALIDACIÓN CRUZADA ESTRATIFICADA (20 minutos)
────────────────────────────────────────────────────────────────────
  ESTADO ACTUAL: trainer.py ya usa StratifiedKFold (bueno)
  MEJORA: Asegurar que los folds respeten la proporción 86/14
  
  YA IMPLEMENTADO EN:
    trainer.py línea 244: StratifiedKFold(...)
  ✓ Esto está bien, continuar así

🔥 SOLUCIÓN #5: ESTABLECER LÍMITES DE NEGOCIO DURO (INMEDIATO)
──────────────────────────────────────────────────────────────
  REGLAS A IMPLEMENTAR EN PRODUCCIÓN:
  
    if score_credito < 650:
        # RECHAZAR SIEMPRE, sin importar otros factores
        return "RECHAZADO"
    
    if ingreso_mensual < 4000:
        # RECHAZAR, muy bajo ingreso
        return "RECHAZADO"
    
    debt_to_income_ratio = monto_solicitado / ingreso_mensual
    if debt_to_income_ratio > 7.0:
        # RECHAZAR, demasiado apalancado
        return "RECHAZADO"
    
    # Solo si pasa todos: usar modelo ML
    probabilidad = modelo.predict_proba(X)
    if probabilidad >= 0.70:
        return "APROBADO"
    else:
        return "RECHAZADO"

═══════════════════════════════════════════════════════════════════════════════════
📋 PLAN DE ACCIÓN PASO A PASO
═══════════════════════════════════════════════════════════════════════════════════

FASE 1: IMPLEMENTACIÓN RÁPIDA (HOY - 30 minutos)
┌─────────────────────────────────────────────┐
│ 1. Modificar evaluator.py: Añadir threshold │
│    ajustable (por defecto 0.70)             │
│                                             │
│ 2. Modificar trainer.py: Cambiar           │
│    class_weight a {0: 3, 1: 1}              │
│                                             │
│ 3. Crear límites de negocio en predict()    │
│    (score < 650 = rechazar)                 │
│                                             │
│ 4. Entrenar modelo_mejorado_v1              │
│    Guardar en modelos_guardados/            │
│                                             │
│ 5. Comparar: modelo_demo vs modelo_v1      │
│    Verificar reducción de FP                │
└─────────────────────────────────────────────┘

FASE 2: OPTIMIZACIÓN AVANZADA (ESTA SEMANA - 2 horas)
┌──────────────────────────────────────────────────┐
│ 1. Probar múltiples thresholds: 0.6, 0.65,      │
│    0.70, 0.75, 0.80                             │
│    Elegir el que minimiza FP sin muchos FN       │
│                                                  │
│ 2. Probar class_weight combinations:             │
│    {0: 2, 1: 1}, {0: 3, 1: 1}, {0: 5, 1: 1}    │
│                                                  │
│ 3. Usar GridSearchCV para encontrar              │
│    hiperparámetros óptimos                      │
│                                                  │
│ 4. Implementar SHAP values para                 │
│    explicabilidad de decisiones                 │
└──────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════════════
⚠️  CUIDADO: LOS CAMBIOS AFECTARÁN MÉTRICAS
═══════════════════════════════════════════════════════════════════════════════════

EXPECTATIVA AHORA (modelo permisivo):
  ✓ Accuracy = ~86% (pero ENGAÑOSO - aprueba a todos)
  ✗ Rechaza clientes buenos (baja presión de ventas)
  ✗ Aprueba clientes malos (PÉRDIDAS)

EXPECTATIVA DESPUÉS (modelo conservador):
  ✓ Accuracy = ~75% (baja, pero HONESTA)
  ✓ Pocos falsos negativos (casi nunca rechaza buenos)
  ✓ Menos falsos positivos (evita clientes malos)
  ✗ Presión de ventas: menos aprobaciones totales

MÉTRICA QUE IMPORTA EN CRÉDITOS:
  → PRECISION en clase POSITIVA (aprobados)
  → Es decir: de los que aprobamos, cuántos son realmente solventes

═══════════════════════════════════════════════════════════════════════════════════
📝 CHECKLIST DE IMPLEMENTACIÓN
═══════════════════════════════════════════════════════════════════════════════════

FASE 1 - CAMBIOS INMEDIATOS:
  ☐ Modificar evaluator.py: Función predict() con threshold ajustable
  ☐ Modificar trainer.py: Cambiar class_weight en RandomForest
  ☐ Modificar trainer.py: Cambiar scale_pos_weight en XGBoost
  ☐ Crear función en evaluator.py: validar límites de negocio
  ☐ Entrenar modelo_v1 con nuevos parámetros
  ☐ Guardar en modelos_guardados/modelo_mejorado_v1_*.pkl
  ☐ Generar reporte comparativo: modelo_demo vs modelo_v1

FASE 2 - OPTIMIZACIÓN:
  ☐ Crear script para probar thresholds automáticamente
  ☐ Generar ROC curve mostrando trade-off FP vs FN
  ☐ Probar feature engineering:
    • Ratio deuda/ingreso
    • Edad normalizada
    • Interacciones entre features
  ☐ Considerar ensemble: RF + XGB + LogisticRegression

═══════════════════════════════════════════════════════════════════════════════════
🎓 CONCLUSIÓN
═══════════════════════════════════════════════════════════════════════════════════

El modelo NO tiene un problema de arquitectura (RF, XGB, etc. son buenos).

El problema es CONFIGURACIÓN:

  1. ⚖️  Desbalance de clases sin penalización explícita
     → SOLUCIÓN: class_weight={0: 3, 1: 1}

  2. 🎯 Threshold inadecuado para el caso de uso
     → SOLUCIÓN: threshold = 0.70 en lugar de 0.50

  3. 📊 Sin límites de negocio (business rules)
     → SOLUCIÓN: score_credito < 650 → RECHAZAR SIEMPRE

Con estos 3 cambios, el modelo debería mejorar significativamente.

═══════════════════════════════════════════════════════════════════════════════════
