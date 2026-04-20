"""
csv_auto_loader.py - Detección automática y validación de archivos CSV.

Este módulo escanea la carpeta 'datos/' para detectar dinámicamente nuevos
archivos CSV, validarlos y hacer que estén disponibles para entrenamiento
sin necesidad de modificar código hardcodeado.

Características:
    - Detección automática de CSV en datos/
    - Validación de estructura (columnas, tamaño, contenido)
    - Generación dinámica de opciones de entrenamiento
    - Monitoreo opcional de cambios (para apps 24/7)
    - Información detallada de cada dataset
"""

from pathlib import Path
import pandas as pd
from typing import Dict, List, Optional, Tuple
import logging

# Configurar logging
logger = logging.getLogger(__name__)


class CSVValidationError(Exception):
    """Excepción para errores de validación de CSV."""
    pass


def get_available_datasets() -> Dict[str, Path]:
    """
    Escanea dinámicamente la carpeta 'datos/' y retorna diccionario de CSV válidos.
    
    Returns:
        Dict[str, Path]: {"nombre_dataset": Path_to_csv, ...}
                        Ordenado alfabéticamente por nombre
    
    Ejemplo:
        >>> datasets = get_available_datasets()
        >>> for nombre, ruta in datasets.items():
        ...     print(f"{nombre}: {ruta}")
    """
    datos_dir = Path(__file__).resolve().parent / "datos"
    
    if not datos_dir.exists():
        logger.warning(f"Carpeta 'datos/' no encontrada en {datos_dir}")
        return {}
    
    datasets = {}
    
    for csv_file in sorted(datos_dir.glob("*.csv")):
        try:
            # Validar el CSV antes de incluirlo
            _validate_csv(csv_file)
            
            # Usar nombre del archivo (sin extensión) como clave
            nombre = csv_file.stem
            datasets[nombre] = csv_file
            
            logger.info(f"✓ CSV válido detectado: {nombre}")
            
        except CSVValidationError as e:
            logger.warning(f"✗ CSV inválido '{csv_file.name}': {e}")
        except Exception as e:
            logger.error(f"Error al procesar '{csv_file.name}': {e}")
    
    if not datasets:
        logger.warning("No se encontraron CSV válidos en datos/")
    
    return datasets


def _validate_csv(csv_path: Path) -> Tuple[bool, str]:
    """
    Valida estructura y contenido de un archivo CSV.
    
    Validaciones:
        - Archivo existe y es legible
        - Contiene al menos 2 filas (encabezado + datos)
        - Contiene al menos 2 columnas
        - Tamaño no excede 100MB
        - No tiene valores NaN completos
    
    Args:
        csv_path (Path): Ruta al archivo CSV
    
    Returns:
        Tuple[bool, str]: (es_válido, mensaje_error)
    
    Raises:
        CSVValidationError: Si el CSV no es válido
    """
    # Validar que existe
    if not csv_path.exists():
        raise CSVValidationError(f"Archivo no existe: {csv_path}")
    
    if not csv_path.is_file():
        raise CSVValidationError(f"No es un archivo: {csv_path}")
    
    # Validar tamaño (máx 100MB)
    file_size_mb = csv_path.stat().st_size / (1024 * 1024)
    if file_size_mb > 100:
        raise CSVValidationError(f"Archivo muy grande ({file_size_mb:.2f}MB > 100MB)")
    
    try:
        # Intentar leer el CSV
        df = pd.read_csv(csv_path, nrows=1000)  # Leer primeras 1000 para validación
        
        # Validar mínimo de filas
        if len(df) < 1:
            raise CSVValidationError("CSV no contiene datos")
        
        # Validar mínimo de columnas
        if len(df.columns) < 2:
            raise CSVValidationError(f"CSV tiene solo {len(df.columns)} columna(s), necesita ≥2")
        
        # Advertencia si hay muchos NaN
        nan_ratio = df.isnull().sum().sum() / (len(df) * len(df.columns))
        if nan_ratio > 0.5:
            logger.warning(f"  ⚠️  {csv_path.name}: {nan_ratio*100:.1f}% de valores NaN")
        
        return True, "Válido"
        
    except pd.errors.EmptyDataError:
        raise CSVValidationError("Archivo CSV vacío")
    except pd.errors.ParserError as e:
        raise CSVValidationError(f"Error al parsear CSV: {str(e)[:50]}")
    except Exception as e:
        raise CSVValidationError(f"Error desconocido: {str(e)[:100]}")


def get_dataset_info(dataset_name: str) -> Optional[Dict]:
    """
    Retorna información detallada de un dataset específico.
    
    Args:
        dataset_name (str): Nombre del dataset (sin .csv)
    
    Returns:
        Dict con:
            - nombre: Nombre del dataset
            - ruta: Ruta del archivo
            - tamaño: Tamaño en MB
            - filas: Número de filas
            - columnas: Número de columnas
            - names: Lista de nombres de columna
            - tipos: Tipos de datos
        
        None si el dataset no existe
    
    Ejemplo:
        >>> info = get_dataset_info("entrenamiento_financiero")
        >>> print(f"Filas: {info['filas']}, Columnas: {info['columnas']}")
    """
    datasets = get_available_datasets()
    
    if dataset_name not in datasets:
        logger.error(f"Dataset no encontrado: {dataset_name}")
        return None
    
    csv_path = datasets[dataset_name]
    
    try:
        df = pd.read_csv(csv_path)
        
        return {
            "nombre": dataset_name,
            "ruta": str(csv_path),
            "tamaño_mb": round(csv_path.stat().st_size / (1024 * 1024), 2),
            "filas": len(df),
            "columnas": len(df.columns),
            "names": list(df.columns),
            "tipos": df.dtypes.to_dict(),
            "memoria_mb": round(df.memory_usage(deep=True).sum() / (1024 * 1024), 2),
        }
    except Exception as e:
        logger.error(f"Error al obtener info de {dataset_name}: {e}")
        return None


def print_available_datasets() -> None:
    """
    Imprime lista formateada de datasets disponibles con detalles.
    
    Útil para debugging y verificación de qué CSV están disponibles.
    
    Ejemplo:
        >>> print_available_datasets()
        ╔════════════════════════════════════════════╗
        ║       DATASETS DISPONIBLES (4)             ║
        ╠════════════════════════════════════════════╣
        ║ 1. entrenamiento_financiero                ║
        ║    📊 50 filas × 8 columnas (2.13 MB)      ║
        ║    Columnas: id, nombre, salario, ...      ║
        ...
    """
    datasets = get_available_datasets()
    
    if not datasets:
        print("⚠️  No hay datasets disponibles en carpeta 'datos/'")
        return
    
    print(f"\n╔{'═' * 50}╗")
    print(f"║  ✨ DATASETS DISPONIBLES ({len(datasets)}) {'─' * (30 - len(str(len(datasets))))}║")
    print(f"╠{'═' * 50}╣")
    
    for idx, (nombre, ruta) in enumerate(datasets.items(), 1):
        info = get_dataset_info(nombre)
        
        if info:
            tamaño = info["tamaño_mb"]
            filas = info["filas"]
            cols = info["columnas"]
            col_names = ", ".join(info["names"][:3])
            if cols > 3:
                col_names += f", ... (+{cols-3})"
            
            print(f"║ {idx}. {nombre:<40} ║")
            print(f"║    📊 {filas} filas × {cols} cols ({tamaño} MB)     ║")
            print(f"║    Cols: {col_names:<35} ║")
    
    print(f"╚{'═' * 50}╝\n")


def watch_for_new_csvs(callback=None, poll_interval: int = 60) -> None:
    """
    Monitor continuo de cambios en carpeta 'datos/' (opcional para apps 24/7).
    
    Nota: Requiere 'watchdog' (pip install watchdog)
    
    Args:
        callback: Función a ejecutar cuando se detecta cambio
                 def callback(evento, nuevos_datasets)
        poll_interval: Segundos entre polls (default 60)
    
    Ejemplo:
        >>> def on_change(evento, datasets):
        ...     print(f"Cambio: {evento}, Datasets: {list(datasets.keys())}")
        >>> watch_for_new_csvs(callback=on_change, poll_interval=30)
    """
    try:
        from watchdog.observers import Observer
        from watchdog.events import FileSystemEventHandler
    except ImportError:
        logger.error("watchdog no instalado. Instalar con: pip install watchdog")
        return
    
    datos_dir = Path(__file__).resolve().parent / "datos"
    last_datasets = get_available_datasets()
    
    class CSVEventHandler(FileSystemEventHandler):
        def on_created(self, event):
            if event.src_path.endswith(".csv"):
                logger.info(f"✨ Nuevo CSV detectado: {Path(event.src_path).name}")
                if callback:
                    callback("created", get_available_datasets())
        
        def on_deleted(self, event):
            if event.src_path.endswith(".csv"):
                logger.info(f"🗑️  CSV eliminado: {Path(event.src_path).name}")
                if callback:
                    callback("deleted", get_available_datasets())
        
        def on_modified(self, event):
            if event.src_path.endswith(".csv"):
                logger.info(f"📝 CSV modificado: {Path(event.src_path).name}")
                if callback:
                    callback("modified", get_available_datasets())
    
    observer = Observer()
    observer.schedule(CSVEventHandler(), str(datos_dir), recursive=False)
    observer.start()
    
    logger.info(f"🔍 Monitor iniciado en {datos_dir}")
    logger.info(f"   Presiona Ctrl+C para detener")
    
    try:
        while True:
            observer.join(timeout=poll_interval)
    except KeyboardInterrupt:
        observer.stop()
    
    observer.join()


# ═══════════════════════════════════════════════════════════════════════════
# UTILIDADES PARA TESTING
# ═══════════════════════════════════════════════════════════════════════════

def create_test_csv(filename: str = "test_dataset.csv", rows: int = 100) -> Path:
    """
    Crea un CSV de prueba para testing.
    
    Args:
        filename: Nombre del archivo a crear
        rows: Número de filas a generar
    
    Returns:
        Path: Ruta al archivo creado
    
    Ejemplo:
        >>> test_path = create_test_csv("mi_test.csv", rows=50)
        >>> print(test_path)
    """
    import numpy as np
    
    datos_dir = Path(__file__).resolve().parent / "datos"
    datos_dir.mkdir(exist_ok=True)
    
    df = pd.DataFrame({
        "id": range(1, rows + 1),
        "valor_a": np.random.randn(rows),
        "valor_b": np.random.randint(0, 100, rows),
        "categoria": np.random.choice(["A", "B", "C"], rows),
    })
    
    test_path = datos_dir / filename
    df.to_csv(test_path, index=False)
    
    logger.info(f"✓ CSV de prueba creado: {test_path}")
    return test_path


if __name__ == "__main__":
    # Testing del módulo
    print("=" * 60)
    print("CSV AUTO LOADER - Testing")
    print("=" * 60)
    
    # 1. Listar datasets disponibles
    print_available_datasets()
    
    # 2. Información detallada
    datasets = get_available_datasets()
    if datasets:
        first_dataset = list(datasets.keys())[0]
        print(f"\n📋 Información de '{first_dataset}':")
        info = get_dataset_info(first_dataset)
        if info:
            for key, value in info.items():
                if key != "tipos":
                    print(f"   {key}: {value}")
    
    # 3. Crear CSV de prueba
    print("\n🧪 Creando CSV de prueba...")
    test_csv = create_test_csv("test_prueba.csv", rows=50)
    print(f"   Creado: {test_csv}")
    
    # 4. Verificar que se detecta
    print("\n🔍 Verificando detección...")
    print_available_datasets()
    
    print("\n✓ Testing completado")
