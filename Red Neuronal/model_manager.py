"""
model_manager.py - Gestor inteligente de modelos guardados.

Capacidades:
  • Listar todos los modelos entrenados con metadatos
  • Cargar un modelo específico por ID
  • Eliminar modelos antiguos
  • Mantener registro JSON de entrenamientos
  • Generar nombres descriptivos automáticos
"""

import os
import json
import shutil
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Optional
import joblib


class ModelManager:
    """Gestor centralizado de modelos entrenados."""
    
    def __init__(self, base_dir: str = None):
        """Inicializa el gestor de modelos.
        
        Argumentos:
            base_dir : directorio base para almacenar modelos.
                      Si es None, usa './modelos_guardados'
        """
        if base_dir is None:
            base_dir = Path(__file__).resolve().parent / "modelos_guardados"
        
        self.base_dir = Path(base_dir)
        self.registry_file = self.base_dir / "modelo_registro.json"
        
        # Crear directorio si no existe
        self.base_dir.mkdir(parents=True, exist_ok=True)
        
        # Crear registro si no existe
        if not self.registry_file.exists():
            self._save_registry({})
    
    def _load_registry(self) -> Dict:
        """Carga el registro JSON de modelos."""
        try:
            with open(self.registry_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
            return {}
    
    def _save_registry(self, registry: Dict) -> None:
        """Guarda el registro JSON de modelos."""
        with open(self.registry_file, 'w', encoding='utf-8') as f:
            json.dump(registry, f, indent=2, ensure_ascii=False)
    
    def _generate_model_id(self) -> str:
        """Genera un ID único para un modelo.
        
        Formato: modelo_NNN
        """
        registry = self._load_registry()
        max_id = 0
        
        for model_id in registry.keys():
            if model_id.startswith("modelo_"):
                try:
                    num = int(model_id.split("_")[1])
                    max_id = max(max_id, num)
                except (ValueError, IndexError):
                    pass
        
        return f"modelo_{str(max_id + 1).zfill(3)}"
    
    def _generate_filename(self, model_id: str, model_key: str, 
                          dataset_name: str) -> str:
        """Genera el nombre del archivo del modelo.
        
        Formato: modelo_NNN_algoritmo_dataset_fecha.pkl
        """
        fecha = datetime.now().strftime("%Y%m%d_%H%M%S")
        # Limpiar nombre del dataset
        dataset_clean = dataset_name.replace(".csv", "").replace(" ", "_")
        filename = f"{model_id}_{model_key}_{dataset_clean}_{fecha}.pkl"
        return filename
    
    def save_training(self, payload: Dict, dataset_name: str, 
                     model_key: str, eval_results: Dict = None) -> str:
        """Guarda un entrenamiento completado.
        
        Argumentos:
            payload       : dict con pipeline, meta, bootstrap_models, train_params
            dataset_name  : nombre del dataset usado (ej: "entrenamiento_temporal.csv")
            model_key     : tipo de modelo (ej: "rf", "xgb", "mlp")
            eval_results  : dict con métricas de evaluación
        
        Retorna:
            model_id : ID único del modelo guardado
        """
        model_id = self._generate_model_id()
        filename = self._generate_filename(model_id, model_key, dataset_name)
        filepath = self.base_dir / filename
        
        # Guardar el archivo .pkl
        joblib.dump(payload, filepath, compress=3)
        size_mb = os.path.getsize(filepath) / 1_048_576
        
        # Registrar en el JSON
        registry = self._load_registry()
        
        # Extraer métricas según tipo de problema
        metrics = self._extract_metrics(eval_results, payload['meta']['problem_type'])
        
        registry[model_id] = {
            "id": model_id,
            "filename": filename,
            "model_key": model_key,
            "dataset_name": dataset_name,
            "problem_type": payload['meta']['problem_type'],
            "created_at": datetime.now().isoformat(),
            "file_size_mb": round(size_mb, 2),
            "target_col": payload['meta'].get('target_col', 'unknown'),
            "num_features": len(payload['meta'].get('num_features', [])),
            "cat_features": len(payload['meta'].get('cat_features', [])),
            "metrics": metrics,
            "train_params": payload.get('train_params', {}),
            "target_classes": payload['meta'].get('target_classes'),
        }
        
        self._save_registry(registry)
        
        print(f"\n  ✔ Modelo guardado con ID: '{model_id}'")
        print(f"  Archivo: {filename}  ({size_mb:.2f} MB)")
        
        return model_id
    
    def _extract_metrics(self, eval_results: Dict, problem_type: str) -> Dict:
        """Extrae las métricas principales del resultado de evaluación."""
        if not eval_results:
            return {}
        
        metrics = {}
        
        if problem_type == "binary":
            metrics = {
                "accuracy": eval_results.get('accuracy'),
                "f1_score": eval_results.get('f1_score'),
                "auc_roc": eval_results.get('auc'),
                "precision": eval_results.get('precision'),
                "recall": eval_results.get('recall'),
            }
        elif problem_type == "multiclass":
            metrics = {
                "accuracy": eval_results.get('accuracy'),
                "f1_score": eval_results.get('f1_weighted'),
                "n_classes": eval_results.get('n_classes'),
            }
        elif problem_type == "regression":
            metrics = {
                "r2_score": eval_results.get('r2'),
                "rmse": eval_results.get('rmse'),
                "mae": eval_results.get('mae'),
            }
        
        return {k: v for k, v in metrics.items() if v is not None}
    
    def list_models(self) -> List[Dict]:
        """Lista todos los modelos guardados ordenados por fecha."""
        registry = self._load_registry()
        
        if not registry:
            return []
        
        # Ordenar por fecha de creación (más recientes primero)
        models = list(registry.values())
        models.sort(key=lambda x: x['created_at'], reverse=True)
        
        return models
    
    def get_model_info(self, model_id: str) -> Optional[Dict]:
        """Obtiene información de un modelo específico."""
        registry = self._load_registry()
        return registry.get(model_id)
    
    def load_model(self, model_id: str) -> Dict:
        """Carga un modelo guardado por su ID.
        
        Retorna:
            dict con claves: pipeline, meta, bootstrap_models, train_params, etc.
        """
        registry = self._load_registry()
        
        if model_id not in registry:
            raise ValueError(f"Modelo '{model_id}' no encontrado en el registro.")
        
        info = registry[model_id]
        filepath = self.base_dir / info['filename']
        
        if not filepath.exists():
            raise FileNotFoundError(f"Archivo del modelo no encontrado: {filepath}")
        
        payload = joblib.load(filepath)
        
        print(f"\n  ✔ Modelo cargado: '{model_id}'")
        print(f"    Algoritmo: {info['model_key'].upper()}")
        print(f"    Dataset: {info['dataset_name']}")
        print(f"    Problema: {info['problem_type'].upper()}")
        
        if info['metrics']:
            print(f"    Métricas:")
            for metric_name, value in info['metrics'].items():
                if value is not None:
                    if isinstance(value, float):
                        print(f"      {metric_name}: {value:.4f}")
                    else:
                        print(f"      {metric_name}: {value}")
        
        return payload
    
    def delete_model(self, model_id: str) -> bool:
        """Elimina un modelo guardado.
        
        Retorna:
            True si se eliminó exitosamente, False si no existe
        """
        registry = self._load_registry()
        
        if model_id not in registry:
            print(f"  ✗ Modelo '{model_id}' no encontrado.")
            return False
        
        info = registry[model_id]
        filepath = self.base_dir / info['filename']
        
        # Eliminar archivo
        if filepath.exists():
            os.remove(filepath)
        
        # Eliminar del registro
        del registry[model_id]
        self._save_registry(registry)
        
        print(f"  ✔ Modelo '{model_id}' eliminado exitosamente.")
        return True
    
    def print_models_table(self, models: List[Dict] = None) -> None:
        """Imprime una tabla formateada de modelos."""
        if models is None:
            models = self.list_models()
        
        if not models:
            print("  No hay modelos guardados.")
            return
        
        sep = "=" * 120
        print(f"\n{sep}")
        print("  HISTORIAL DE MODELOS ENTRENADOS")
        print(sep)
        
        print(f"\n  {'#':<3} {'ID':<12} {'Algoritmo':<10} {'Problema':<12} {'Dataset':<25} {'Fecha':<19} {'Métricas':<30}")
        print("  " + "-" * 116)
        
        for idx, model in enumerate(models, 1):
            fecha = model['created_at'][:10]  # YYYY-MM-DD
            hora = model['created_at'][11:16]  # HH:MM
            fecha_str = f"{fecha} {hora}"
            
            # Formatear métricas principales
            metrics_str = ""
            if model['problem_type'] == "binary" and model['metrics']:
                acc = model['metrics'].get('accuracy')
                f1 = model['metrics'].get('f1_score')
                if acc is not None:
                    metrics_str += f"Acc: {acc:.3f}"
                if f1 is not None:
                    metrics_str += f" | F1: {f1:.3f}"
            elif model['problem_type'] == "regression" and model['metrics']:
                r2 = model['metrics'].get('r2_score')
                rmse = model['metrics'].get('rmse')
                if r2 is not None:
                    metrics_str += f"R²: {r2:.3f}"
                if rmse is not None:
                    metrics_str += f" | RMSE: {rmse:.2f}"
            
            print(f"  {idx:<3} {model['id']:<12} {model['model_key']:<10} "
                  f"{model['problem_type']:<12} {model['dataset_name']:<25} "
                  f"{fecha_str:<19} {metrics_str:<30}")
        
        print(f"\n{sep}\n")
    
    def interactive_menu(self) -> Optional[Dict]:
        """Menú interactivo para cargar un modelo guardado.
        
        Retorna:
            dict del modelo cargado, o None si el usuario cancela
        """
        models = self.list_models()
        
        if not models:
            print("\n  No hay modelos guardados aún.")
            return None
        
        self.print_models_table(models)
        
        print("  Opciones:")
        print("    Ingresa el número o ID del modelo para cargar")
        print("    0 para volver")
        print()
        
        while True:
            try:
                entrada = input("  Selección: ").strip()
                
                if entrada == "0":
                    return None
                
                # Intentar como número de opción
                if entrada.isdigit():
                    idx = int(entrada) - 1
                    if 0 <= idx < len(models):
                        model_id = models[idx]['id']
                        return self.load_model(model_id)
                
                # Intentar como ID directo
                if entrada.startswith("modelo_"):
                    return self.load_model(entrada)
                
                print("  Opción inválida. Intenta de nuevo.")
            
            except ValueError:
                print("  Entrada inválida. Intenta de nuevo.")
            except Exception as e:
                print(f"  Error al cargar modelo: {e}")
                return None
