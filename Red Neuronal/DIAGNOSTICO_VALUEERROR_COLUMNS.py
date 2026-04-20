"""
DIAGNOSTICO_VALUEERROR_COLUMNS.py - Herramienta automática para diagnosticar
y resolver el error "ValueError: columns are missing"

Ejecuta este script para:
1. Identificar exactamente cuáles son las columnas disponibles
2. Encontrar discrepancias entre tu código y los datos
3. Obtener recomendaciones específicas de solución
"""

import sys
from pathlib import Path
import pandas as pd

# Agregar ruta del proyecto
proyecto_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(proyecto_dir))

from csv_auto_loader import get_available_datasets, get_dataset_info


def print_header(title: str):
    """Imprime un encabezado formateado."""
    print("\n" + "=" * 80)
    print(f"  {title}")
    print("=" * 80 + "\n")


def diagnose_csv_structure():
    """Diagnostica la estructura de todos los CSV disponibles."""
    print_header("PASO 1: ESTRUCTURA DE ARCHIVOS CSV")
    
    datasets = get_available_datasets()
    
    if not datasets:
        print("❌ No se encontraron archivos CSV en carpeta 'datos/'")
        print("   Verifica que la carpeta existe en:")
        print(f"   {proyecto_dir / 'datos'}")
        return False
    
    print(f"✓ Se encontraron {len(datasets)} archivo(s) CSV:\n")
    
    for i, (nombre, ruta) in enumerate(datasets.items(), 1):
        print(f"  {i}. {nombre}")
        print(f"     Ruta: {ruta}")
        
        info = get_dataset_info(nombre)
        if info:
            print(f"     Filas: {info['filas']}, Columnas: {info['columnas']}")
            print(f"     Tamaño: {info['tamaño_mb']} MB")
        print()
    
    return True


def analyze_column_names():
    """Analiza los nombres de columnas exactos."""
    print_header("PASO 2: ANÁLISIS DETALLADO DE COLUMNAS")
    
    datasets = get_available_datasets()
    
    if not datasets:
        print("❌ No hay datasets para analizar")
        return
    
    for nombre in datasets.keys():
        info = get_dataset_info(nombre)
        if not info:
            continue
        
        print(f"\n📊 Dataset: '{nombre}'")
        print(f"   Total de columnas: {info['columnas']}\n")
        
        print("   Nombres exactos de columnas:")
        for i, col in enumerate(info['names'], 1):
            # Mostrar espacios visibles
            display_col = col.replace(' ', '·')  # Punto para espacios
            print(f"   {i:2d}. '{col}' {f'(con espacios)' if col != col.strip() else ''}")
            print(f"        Tipo: {info['tipos'].get(col, 'unknown')}")
        
        # Detectar problemas comunes
        print(f"\n   🔍 Análisis de problemas comunes:")
        
        problems = []
        for col in info['names']:
            if col != col.strip():
                problems.append(f"  ⚠️  '{col}' tiene espacios al inicio/final")
            if col != col.lower():
                problems.append(f"  ⚠️  '{col}' tiene mayúsculas (case-sensitive)")
        
        if problems:
            for p in problems:
                print(p)
        else:
            print("  ✓ No se detectaron problemas evidentes")


def compare_with_code():
    """Compara los nombres de columnas con parámetros comunes en main.py."""
    print_header("PASO 3: COMPARACIÓN CON CÓDIGO")
    
    # Leer main.py para encontrar referencias a 'target'
    main_path = proyecto_dir / "main.py"
    if not main_path.exists():
        print("⚠️  No se encontró main.py")
        return
    
    with open(main_path, 'r') as f:
        content = f.read()
    
    # Buscar parámetros target comunes
    import re
    target_matches = re.findall(r"target\s*=\s*['\"]([^'\"]+)['\"]", content)
    
    if target_matches:
        print(f"Found {len(set(target_matches))} unique target parameter(s) in main.py:\n")
        
        datasets = get_available_datasets()
        all_columns = []
        
        for info_dict in [get_dataset_info(name) for name in datasets.keys()]:
            if info_dict:
                all_columns.extend(info_dict['names'])
        
        all_columns = list(set(all_columns))
        
        for target in set(target_matches):
            exists = target in all_columns
            status = "✓" if exists else "❌"
            print(f"  {status} target='{target}'")
            
            if not exists:
                # Buscar similar
                similar = [c for c in all_columns if target.lower() in c.lower()]
                if similar:
                    print(f"     💡 Columna similar encontrada: {similar}")
        
        print()


def generate_recommendations():
    """Genera recomendaciones específicas."""
    print_header("PASO 4: RECOMENDACIONES")
    
    datasets = get_available_datasets()
    
    print("📋 Pasos para evitar el error 'ValueError: columns are missing':\n")
    
    print("1. ANTES DE ENTRENAR, VALIDA:")
    print("""
   from csv_auto_loader import get_dataset_info
   
   info = get_dataset_info('nombre_dataset')
   if info:
       print(f"Columnas: {info['names']}")
    """)
    
    print("\n2. USA EL NOMBRE EXACTO DEL DATASET:")
    print("   ✓ Correcto:   run_pipeline(source='csv', target='aprobado')")
    print("   ❌ Incorrecto: run_pipeline(source='csv', target='resultado')")
    
    print("\n3. SI SIGUES TENIENDO ERROR:")
    print("   • Verifica que el nombre sea idéntico (mayúsculas, espacios, etc.)")
    print("   • Usa get_dataset_info() para ver los nombres exactos")
    print("   • Revisa que no hayas excluido la columna con exclude_cols")
    
    print("\n4. VALIDACIÓN COMPLETA (RECOMENDADO):")
    print("""
    def validate_before_training(dataset_name: str, target_col: str):
        from csv_auto_loader import get_dataset_info
        
        info = get_dataset_info(dataset_name)
        if not info:
            print(f"❌ Dataset '{dataset_name}' no encontrado")
            return False
        
        if target_col not in info['names']:
            print(f"❌ Columna '{target_col}' no encontrada")
            print(f"   Columnas disponibles: {info['names']}")
            return False
        
        print(f"✓ Validación exitosa")
        return True
    
    # Uso:
    if validate_before_training('entrenamiento_financiero', 'aprobado'):
        result = run_pipeline(source='csv', target='aprobado')
    """)


def run_diagnostic():
    """Ejecuta el diagnóstico completo."""
    print("\n")
    print("╔" + "=" * 78 + "╗")
    print("║" + " DIAGNÓSTICO: ValueError 'columns are missing' ".center(78) + "║")
    print("╚" + "=" * 78 + "╝")
    
    try:
        # Paso 1
        if not diagnose_csv_structure():
            return
        
        # Paso 2
        analyze_column_names()
        
        # Paso 3
        compare_with_code()
        
        # Paso 4
        generate_recommendations()
        
        # Resumen final
        print_header("RESUMEN")
        print("✓ Diagnóstico completado")
        print("\nPróximos pasos:")
        print("  1. Usa los nombres de columnas exactos mostrados arriba")
        print("  2. Valida con get_dataset_info() antes de entrenar")
        print("  3. Si persiste el error, comparte el output de este script")
        print("\n")
        
    except Exception as e:
        print(f"\n❌ Error durante el diagnóstico: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    run_diagnostic()
