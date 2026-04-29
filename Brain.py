# Red Neuronal Optimizada - Mejoras de Rendimiento
import tensorflow as tf
import numpy as np
import matplotlib.pyplot as plt
from datetime import datetime
import os

# ===== CONFIGURACIÓN DE REPRODUCIBILIDAD =====
SEED = 42
np.random.seed(SEED)
tf.random.set_seed(SEED)

# ===== CONFIGURACIÓN DE RENDIMIENTO =====
# Habilitar GPU si está disponible
physical_devices = tf.config.list_physical_devices('GPU')
if physical_devices:
    print(f"✓ GPU detectada: {physical_devices}")
    tf.config.experimental.set_memory_growth(physical_devices[0], True)
    print("✓ Memory growth habilitado")
else:
    print("⚠ No se detectó GPU, usando CPU")

# Habilitar Mixed Precision (más rápido y usa menos memoria)
tf.keras.mixed_precision.set_global_policy('mixed_float16')
print("✓ Mixed Precision habilitado (float16)")

# ===== DATOS =====
VariableInput = np.array([0, 1, 10, 15], dtype=np.float32)
VariableOutput = np.array([32.0, 33.8, 50.0, 59.0], dtype=np.float32)

# Normalización
input_mean = VariableInput.mean()
input_std = VariableInput.std()
VariableInput_norm = (VariableInput - input_mean) / input_std

output_mean = VariableOutput.mean()
output_std = VariableOutput.std()
VariableOutput_norm = (VariableOutput - output_mean) / output_std

# ===== PIPELINE DE DATOS OPTIMIZADO =====
# Crear dataset con tf.data para mejor rendimiento
BATCH_SIZE = 32  # Ajustar según tu hardware
BUFFER_SIZE = 1000

dataset = tf.data.Dataset.from_tensor_slices((
    VariableInput_norm.astype(np.float32),
    VariableOutput_norm.astype(np.float32)
))

# Optimizaciones del pipeline
dataset = dataset.cache()  # Cachear en memoria
dataset = dataset.shuffle(BUFFER_SIZE, seed=SEED)
dataset = dataset.batch(BATCH_SIZE)
dataset = dataset.prefetch(tf.data.AUTOTUNE)  # Cargar datos en paralelo

print("✓ Pipeline de datos optimizado")

# ===== ARQUITECTURA OPTIMIZADA =====
def create_model():
    model = tf.keras.Sequential([
        # Capa de entrada
        tf.keras.layers.Dense(
            units=8,
            input_shape=[1],
            activation='relu',
            kernel_initializer='he_normal'  # Mejor inicialización para ReLU
        ),
        tf.keras.layers.BatchNormalization(),  # Normalizar activaciones
        tf.keras.layers.Dropout(0.2),  # Regularización

        # Capa oculta
        tf.keras.layers.Dense(
            units=4,
            activation='relu',
            kernel_initializer='he_normal'
        ),
        tf.keras.layers.BatchNormalization(),
        tf.keras.layers.Dropout(0.1),

        # Capa de salida (dtype float32 para evitar problemas con mixed precision)
        tf.keras.layers.Dense(units=1, dtype='float32')
    ])
    return model

modelo = create_model()

# ===== CALLBACKS PARA MEJORAR ENTRENAMIENTO =====
# Crear directorio para checkpoints
checkpoint_dir = './checkpoints'
os.makedirs(checkpoint_dir, exist_ok=True)

callbacks = [
    # 1. Early Stopping - detener si no mejora
    tf.keras.callbacks.EarlyStopping(
        monitor='loss',
        patience=500,
        restore_best_weights=True,
        verbose=1
    ),

    # 2. Model Checkpoint - guardar mejor modelo
    tf.keras.callbacks.ModelCheckpoint(
        filepath=os.path.join(checkpoint_dir, 'best_model.h5'),
        monitor='loss',
        save_best_only=True,
        verbose=0
    ),

    # 3. ReduceLROnPlateau - reducir LR si se estanca
    tf.keras.callbacks.ReduceLROnPlateau(
        monitor='loss',
        factor=0.5,
        patience=200,
        min_lr=1e-6,
        verbose=1
    ),

    # 4. TensorBoard - visualización avanzada
    tf.keras.callbacks.TensorBoard(
        log_dir=f'./logs/{datetime.now().strftime("%Y%m%d-%H%M%S")}',
        histogram_freq=1,
        write_graph=True
    )
]

# ===== OPTIMIZADOR AVANZADO =====
# OPCIÓN 1: Learning rate fijo (para usar con ReduceLROnPlateau)
optimizer = tf.keras.optimizers.Adam(
    learning_rate=0.01,  # LR inicial
    clipnorm=1.0  # Gradient clipping para estabilidad
)

# OPCIÓN 2 (Comentada): Si prefieres usar schedule, comenta la opción 1
# y descomenta esto, pero elimina ReduceLROnPlateau de callbacks
# lr_schedule = tf.keras.optimizers.schedules.CosineDecay(
#     initial_learning_rate=0.1,
#     decay_steps=5000,
#     alpha=0.01
# )
# optimizer = tf.keras.optimizers.Adam(
#     learning_rate=lr_schedule,
#     clipnorm=1.0
# )

# ===== COMPILACIÓN =====
modelo.compile(
    optimizer=optimizer,
    loss='mean_squared_error',
    metrics=['mae', 'mse']
)

# Resumen del modelo
print("\n" + "=" * 60)
print("ARQUITECTURA DEL MODELO")
print("=" * 60)
modelo.summary()

# ===== ENTRENAMIENTO =====
print("\n" + "=" * 60)
print("INICIANDO ENTRENAMIENTO")
print("=" * 60)

start_time = datetime.now()

historial = modelo.fit(
    dataset,
    epochs=5000,
    callbacks=callbacks,
    verbose=0
)

end_time = datetime.now()
training_time = (end_time - start_time).total_seconds()

print(f"\n✓ Entrenamiento completado en {training_time:.2f} segundos")
print(f"  Loss final: {historial.history['loss'][-1]:.6f}")
print(f"  MAE final: {historial.history['mae'][-1]:.6f}")
print(f"  Épocas entrenadas: {len(historial.history['loss'])}")

# ===== VISUALIZACIÓN MEJORADA =====
fig, axes = plt.subplots(2, 2, figsize=(14, 10))

# Gráfica 1: Loss
axes[0, 0].plot(historial.history['loss'], color='blue', linewidth=1.5)
axes[0, 0].set_xlabel('Época')
axes[0, 0].set_ylabel('Loss (MSE)')
axes[0, 0].set_title('Evolución del Error')
axes[0, 0].grid(True, alpha=0.3)
axes[0, 0].set_yscale('log')  # Escala logarítmica para ver mejor

# Gráfica 2: MAE
axes[0, 1].plot(historial.history['mae'], color='green', linewidth=1.5)
axes[0, 1].set_xlabel('Época')
axes[0, 1].set_ylabel('MAE')
axes[0, 1].set_title('Error Absoluto Medio')
axes[0, 1].grid(True, alpha=0.3)

# Gráfica 3: Learning Rate
if 'lr' in historial.history:
    axes[1, 0].plot(historial.history['lr'], color='orange', linewidth=1.5)
    axes[1, 0].set_xlabel('Época')
    axes[1, 0].set_ylabel('Learning Rate')
    axes[1, 0].set_title('Evolución del Learning Rate')
    axes[1, 0].grid(True, alpha=0.3)
    axes[1, 0].set_yscale('log')
else:
    axes[1, 0].text(0.5, 0.5, 'LR history no disponible',
                    ha='center', va='center', transform=axes[1, 0].transAxes)

# Gráfica 4: Predicciones vs Real
predictions = []
for val in VariableInput_norm:
    pred = modelo.predict(np.array([[val]]), verbose=0)[0][0]
    predictions.append(pred * output_std + output_mean)

axes[1, 1].scatter(VariableInput, VariableOutput, color='blue', s=100,
                   label='Datos Reales', zorder=3)
axes[1, 1].plot(VariableInput, predictions, color='red', linewidth=2,
                label='Predicciones', marker='o')
axes[1, 1].set_xlabel('Input')
axes[1, 1].set_ylabel('Output')
axes[1, 1].set_title('Predicciones vs Datos Reales')
axes[1, 1].legend()
axes[1, 1].grid(True, alpha=0.3)

plt.tight_layout()
plt.show()

# ===== VERIFICACIÓN CON MÉTRICAS DETALLADAS =====
print("\n" + "=" * 60)
print("VERIFICACIÓN CON DATOS DE ENTRENAMIENTO")
print("=" * 60)
print(f"{'Input':>8} | {'Real':>8} | {'Predicción':>10} | {'Error':>8} | {'Error %':>8}")
print("-" * 60)

errors = []
for i, val in enumerate(VariableInput):
    val_norm = (val - input_mean) / input_std
    pred_norm = modelo.predict(np.array([[val_norm]]), verbose=0)[0][0]
    pred = pred_norm * output_std + output_mean
    real = VariableOutput[i]
    error = abs(pred - real)
    error_pct = (error / real) * 100
    errors.append(error)
    print(f"{val:8.1f} | {real:8.4f} | {pred:10.4f} | {error:8.4f} | {error_pct:7.2f}%")

print("-" * 60)
print(f"Error promedio: {np.mean(errors):.6f}")
print(f"Error máximo: {np.max(errors):.6f}")
print(f"Error mínimo: {np.min(errors):.6f}")

# ===== INFORMACIÓN DE RENDIMIENTO =====
print("\n" + "=" * 60)
print("INFORMACIÓN DE RENDIMIENTO")
print("=" * 60)
print(f"Tiempo total de entrenamiento: {training_time:.2f} segundos")
print(f"Tiempo por época: {training_time/len(historial.history['loss']):.4f} segundos")
print(f"Modelo guardado en: {checkpoint_dir}")
print(f"TensorBoard logs en: ./logs/")
print("\nPara ver TensorBoard ejecuta:")
print("  tensorboard --logdir=./logs")

# ===== MODO PREDICCIÓN INTERACTIVA =====
print("\n" + "=" * 60)
print("MODO PREDICCIÓN INTERACTIVA")
print("=" * 60)
print("Escribe 'salir' para terminar\n")

while True:
    entrada = input("Ingresar valor: ")

    if entrada.lower() in ['salir', 'exit', 'q', 'quit']:
        print("¡Hasta luego!")
        break

    try:
        valor = float(entrada)
        valor_norm = (valor - input_mean) / input_std
        resultado_norm = modelo.predict(np.array([[valor_norm]]), verbose=0)[0][0]
        resultado = resultado_norm * output_std + output_mean
        print(f"→ Predicción: {resultado:.4f}\n")
    except ValueError:
        print("⚠ Por favor ingresa un número válido\n")
    except KeyboardInterrupt:
        print("\n¡Hasta luego!")
        break