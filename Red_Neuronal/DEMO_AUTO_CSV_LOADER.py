"""
DEMO_AUTO_CSV_LOADER.py - Demostración del sistema automático de detección de CSV.

Este script demuestra cómo funciona el nuevo sistema automático de carga de CSV,
sin necesidad de modificar código hardcodeado cuando se agregan nuevos archivos.
"""

from pathlib import Path
import sys
import csv

# Agregar la ruta del proyecto
proyecto_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(proyecto_dir))

from csv_auto_loader import (
    get_available_datasets,
    get_dataset_info,
    print_available_datasets,
    create_test_csv,
)


def demo_deteccion_automatica():
    """Demuestra la detección automática de CSV."""
    print("\n" + "=" * 70)
    print("DEMO 1: DETECCIÓN AUTOMÁTICA DE DATASETS")
    print("=" * 70)
    
    datasets = get_available_datasets()
    
    print(f"\n✓ Se encontraron {len(datasets)} datasets automáticamente:\n")
    for nombre, ruta in datasets.items():
        print(f"  • {nombre:<35} -> {ruta.name}")
    
    return datasets


def demo_validacion_csv(datasets):
    """Demuestra validación de CSV."""
    print("\n" + "=" * 70)
    print("DEMO 2: VALIDACIÓN DE CSV")
    print("=" * 70)
    
    if not datasets:
        print("  No hay datasets para validar")
        return
    
    # Validar el primer dataset
    primer_nombre = list(datasets.keys())[0]
    info = get_dataset_info(primer_nombre)
    
    if info:
        print(f"\n✓ Información de '{primer_nombre}':")
        print(f"  • Filas:       {info['filas']}")
        print(f"  • Columnas:    {info['columnas']}")
        print(f"  • Tamaño:      {info['tamaño_mb']} MB")
        print(f"  • Memoria:     {info['memoria_mb']} MB")
        print(f"  • Nombres:     {', '.join(info['names'][:5])}")
        if len(info['names']) > 5:
            print(f"                 ... y {len(info['names']) - 5} más")


def demo_formato_usuario(datasets):
    """Demuestra cómo se vería el menú para el usuario."""
    print("\n" + "=" * 70)
    print("DEMO 3: MENÚ DE SELECCIÓN DINÁMICO (como vería el usuario)")
    print("=" * 70)
    
    print("\n  Elige una fuente de datos:\n")
    
    for i, fuente in enumerate(datasets.keys(), 1):
        archivo = datasets[fuente].name
        print(f"    {i}) {fuente:<25} -> {archivo}")
    
    print("    0) Volver")
    print("")


def demo_agregar_nuevo_csv():
    """Demuestra cómo se agrega automáticamente un nuevo CSV."""
    print("\n" + "=" * 70)
    print("DEMO 4: AGREGAR NUEVO CSV DINÁMICAMENTE")
    print("=" * 70)
    
    print("\nANTES: Datasets detectados")
    datasets_antes = get_available_datasets()
    print(f"  Total: {len(datasets_antes)} datasets")
    
    print("\nCreando nuevo CSV de prueba: 'mi_nuevo_dataset.csv'...")
    nuevo_csv = create_test_csv("mi_nuevo_dataset.csv", rows=50)
    print(f"✓ Creado: {nuevo_csv}")
    
    print("\nDESPUÉS: Datasets detectados (sin cambiar código)")
    datasets_despues = get_available_datasets()
    print(f"  Total: {len(datasets_despues)} datasets")
    
    nuevos = set(datasets_despues.keys()) - set(datasets_antes.keys())
    if nuevos:
        print(f"\n✓ NUEVO DATASET DETECTADO AUTOMÁTICAMENTE:")
        for nuevo in nuevos:
            print(f"  • {nuevo}")
    
    return datasets_despues


def demo_visualizacion_completa(datasets):
    """Demuestra la visualización completa de datasets."""
    print("\n" + "=" * 70)
    print("DEMO 5: VISUALIZACIÓN COMPLETA")
    print("=" * 70)
    print()
    
    print_available_datasets()


def main():
    """Ejecuta todas las demostraciones."""
    print("\n")
    print("╔" + "=" * 68 + "╗")
    print("║" + " DEMOSTRACIÓN: SISTEMA AUTOMÁTICO DE CARGA DE CSV ".center(68) + "║")
    print("╚" + "=" * 68 + "╝")
    
    try:
        # Demo 1: Detección automática
        datasets = demo_deteccion_automatica()
        
        # Demo 2: Validación
        if datasets:
            demo_validacion_csv(datasets)
            
            # Demo 3: Menú dinámico
            demo_formato_usuario(datasets)
            
            # Demo 4: Agregar nuevo CSV
            datasets = demo_agregar_nuevo_csv()
            
            # Demo 5: Visualización completa
            demo_visualizacion_completa(datasets)
        
        print("\n" + "=" * 70)
        print("✓ DEMOSTRACIÓN COMPLETADA EXITOSAMENTE")
        print("=" * 70)
        
        print("\n📝 RESUMEN DE BENEFICIOS:")
        print("""
  1. ✓ Detección automática de CSV
     → No requiere modificar código
     → Se detectan automáticamente cuando se agregan nuevos archivos
  
  2. ✓ Validación automática
     → Se valida estructura, tamaño y contenido
     → Evita errores en datos inválidos
  
  3. ✓ Menú dinámico
     → Las opciones se generan automáticamente
     → El usuario ve siempre los datasets disponibles
  
  4. ✓ Escalable
     → Funciona con 1, 10, 100+ datasets
     → Sin cambios en el código de main.py
  
  5. ✓ Información completa
     → Detalles de cada dataset (filas, columnas, tamaño, etc.)
     → Para debugging y auditoría
        """)
        
    except Exception as e:
        print(f"\n✗ Error: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
