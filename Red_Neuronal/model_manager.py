"""
model_manager.py - Gestor inteligente de modelos guardados con versionado.

Capacidades:
  • Listar todos los modelos entrenados con metadatos
  • Cargar un modelo específico por ID
  • Eliminar modelos antiguos
  • Mantener registro JSON de entrenamientos
  • Generar nombres descriptivos automáticos
  • Versionado formal: ID scheme {model_key}/v{N}
  • Lineage: cada versión guarda referencia a versión anterior (version_parent)
  • Promoción: marcar una versión como "promoted" (producción)
  • Rollback: volver a una versión anterior como promoted
  • Comparación: obtener métricas de N versiones side-by-side
"""

import hashlib
import os
import json
import shutil
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Optional
import joblib


def _compute_checksum(path: str) -> str:
    """SHA-256 checksum of a file."""
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


class ModelManager:
    """Gestor centralizado de modelos entrenados con versionado."""

    def __init__(self, base_dir: str = None):
        if base_dir is None:
            base_dir = Path(__file__).resolve().parent / "modelos_guardados"

        self.base_dir = Path(base_dir)
        self.registry_file = self.base_dir / "modelo_registro.json"

        self.base_dir.mkdir(parents=True, exist_ok=True)

        if not self.registry_file.exists():
            self._save_registry({})

    def _load_registry(self) -> Dict:
        try:
            with open(self.registry_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
            return {}

    def _save_registry(self, registry: Dict) -> None:
        with open(self.registry_file, 'w', encoding='utf-8') as f:
            json.dump(registry, f, indent=2, ensure_ascii=False)

    def _generate_model_id(self, model_key: str) -> str:
        """Genera un ID versionado.
        
        Formato: {model_key}/v{N}
        Ej: rf/v1, rf/v2, xgb/v1, mlp/v3
        """
        registry = self._load_registry()
        max_ver = 0

        for model_id in registry.keys():
            parts = model_id.split("/")
            if len(parts) == 2 and parts[0] == model_key and parts[1].startswith("v"):
                try:
                    num = int(parts[1][1:])
                    max_ver = max(max_ver, num)
                except (ValueError, IndexError):
                    pass

        new_ver = max_ver + 1
        return f"{model_key}/v{new_ver}"

    def _parse_model_id(self, model_id: str) -> tuple:
        """Parse a versioned model ID into (model_key, version_number, version_label).
        
        Returns (model_key, version_number, version_label) or raises ValueError.
        """
        parts = model_id.split("/")
        if len(parts) != 2 or not parts[1].startswith("v"):
            raise ValueError(f"Formato de ID inválido: '{model_id}'. Se espera {{model_key}}/v{{N}}")
        try:
            ver_num = int(parts[1][1:])
        except ValueError:
            raise ValueError(f"Número de versión inválido en ID: '{model_id}'")
        return parts[0], ver_num, parts[1]

    def _generate_filename(self, model_id: str, model_key: str,
                          dataset_name: str) -> str:
        """Genera el nombre del archivo del modelo.

        Formato: model_key_v{N}_dataset_fecha.pkl
        Trunca el nombre del dataset a 50 chars para respetar límites del
        filesystem (255 bytes en ext4, 260 en NTFS).
        """
        safe_id = model_id.replace("/", "_")
        fecha = datetime.now().strftime("%Y%m%d_%H%M%S")
        safe_name = str(dataset_name) if dataset_name else "unknown"
        dataset_clean = safe_name.replace(".csv", "").replace(" ", "_")
        for ch in r'/\:*?"<>|':
            dataset_clean = dataset_clean.replace(ch, "_")
        dataset_clean = dataset_clean[:50]
        filename = f"{safe_id}_{model_key}_{dataset_clean}_{fecha}.pkl"
        return filename

    def save_training(self, payload: Dict, dataset_name: str,
                     model_key: str, eval_results: Dict = None) -> str:
        """Guarda un entrenamiento completado con versionado automático.

        Argumentos:
            payload       : dict con pipeline, meta, bootstrap_models, train_params
            dataset_name  : nombre del dataset usado (ej: "entrenamiento_temporal.csv")
            model_key     : tipo de modelo (ej: "rf", "xgb", "mlp")
            eval_results  : dict con métricas de evaluación

        Retorna:
            model_id : ID versionado del modelo guardado (ej: "rf/v3")
        """
        registry = self._load_registry()

        # Determinar versión padre: la última versión del mismo model_key
        version_parent = None
        for mid in sorted(registry.keys(), reverse=True):
            try:
                mk, _, _ = self._parse_model_id(mid)
                if mk == model_key:
                    version_parent = mid
                    break
            except ValueError:
                continue

        model_id = self._generate_model_id(model_key)
        filename = self._generate_filename(model_id, model_key, dataset_name)
        filepath = self.base_dir / filename

        joblib.dump(payload, filepath, compress=3)
        size_mb = os.path.getsize(filepath) / 1_048_576

        checksum = _compute_checksum(str(filepath))

        metrics = self._extract_metrics(eval_results, payload['meta']['problem_type'])

        entry = {
            "id": model_id,
            "filename": filename,
            "model_key": model_key,
            "version": model_id.split("/")[1],
            "version_parent": version_parent,
            "dataset_name": dataset_name,
            "problem_type": payload['meta']['problem_type'],
            "created_at": datetime.now().isoformat(),
            "file_size_mb": round(size_mb, 2),
            "checksum": checksum,
            "target_col": payload['meta'].get('target_col', 'unknown'),
            "num_features": payload['meta'].get('num_features', []),
            "cat_features": payload['meta'].get('cat_features', []),
            "metrics": metrics,
            "train_params": payload.get('train_params', {}),
            "best_params": payload.get('best_params', {}),
            "target_classes": payload['meta'].get('target_classes'),
            "meta": payload.get('meta', {}),
            "promoted": version_parent is None,  # primera versión es promoted por defecto
        }

        registry[model_id] = entry
        self._save_registry(registry)

        print(f"\n  ✔ Modelo guardado con ID: '{model_id}'")
        if version_parent:
            print(f"  Versión padre: {version_parent}")
        print(f"  Archivo: {filename}  ({size_mb:.2f} MB)")

        return model_id

    def _extract_metrics(self, eval_results: Dict, problem_type: str) -> Dict:
        if not eval_results:
            return {}

        metrics = {}

        if problem_type == "binary":
            metrics = {
                "accuracy": eval_results.get('accuracy'),
                "f1_score": eval_results.get('f1_score'),
                "auc_roc": eval_results.get('auc_roc'),
                "precision": eval_results.get('precision'),
                "recall": eval_results.get('recall'),
            }
            cm = eval_results.get('confusion_matrix')
            if cm:
                metrics['confusion_matrix'] = cm
            roc = eval_results.get('roc_data')
            if roc:
                metrics['roc_data'] = roc
        elif problem_type == "multiclass":
            metrics = {
                "accuracy": eval_results.get('accuracy'),
                "f1_score": eval_results.get('f1_weighted'),
                "n_classes": eval_results.get('n_classes'),
            }
            cm = eval_results.get('confusion_matrix')
            if cm:
                metrics['confusion_matrix'] = cm
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

        models = list(registry.values())
        models.sort(key=lambda x: x['created_at'], reverse=True)

        return models

    def get_model_info(self, model_id: str) -> Optional[Dict]:
        """Obtiene información de un modelo específico."""
        registry = self._load_registry()
        return registry.get(model_id)

    def list_versions(self, model_key: str) -> List[Dict]:
        """Lista todas las versiones de un mismo tipo de modelo."""
        registry = self._load_registry()
        versions = []
        for mid, entry in registry.items():
            try:
                mk, _, _ = self._parse_model_id(mid)
                if mk == model_key:
                    versions.append(entry)
            except ValueError:
                continue
        versions.sort(key=lambda x: x['created_at'], reverse=True)
        return versions

    def get_promoted(self, model_key: str) -> Optional[Dict]:
        """Obtiene la versión promovida (producción) de un tipo de modelo."""
        registry = self._load_registry()
        for mid, entry in registry.items():
            try:
                mk, _, _ = self._parse_model_id(mid)
                if mk == model_key and entry.get("promoted"):
                    return entry
            except ValueError:
                continue
        return None

    def promote_version(self, model_id: str) -> bool:
        """Marca una versión como promovida (producción).
        
        Retorna:
            True si se promovió exitosamente, False si el ID no existe
        """
        registry = self._load_registry()
        if model_id not in registry:
            print(f"  ✗ Modelo '{model_id}' no encontrado.")
            return False

        try:
            target_key, _, _ = self._parse_model_id(model_id)
        except ValueError:
            return False

        # Quitar promoted de todas las versiones del mismo model_key
        for mid in list(registry.keys()):
            try:
                mk, _, _ = self._parse_model_id(mid)
                if mk == target_key:
                    registry[mid]["promoted"] = False
            except ValueError:
                continue

        # Marcar la versión seleccionada como promoted
        registry[model_id]["promoted"] = True
        self._save_registry(registry)

        print(f"\n  ✔ Versión '{model_id}' promovida a producción.")
        return True

    def rollback_to(self, model_key: str, target_version: str = None) -> Optional[str]:
        """Rollback a una versión anterior de un tipo de modelo.
        
        Si target_version es None, promueve la versión inmediatamente anterior
        a la actual promoted.
        
        Retorna:
            model_id de la versión ahora promovida, o None si no es posible
        """
        registry = self._load_registry()
        versions = self.list_versions(model_key)

        if not versions:
            print(f"  ✗ No hay versiones para '{model_key}'.")
            return None

        if len(versions) < 2:
            print(f"  ✗ Solo hay una versión de '{model_key}', no se puede hacer rollback.")
            return None

        if target_version:
            if target_version not in registry:
                print(f"  ✗ Versión '{target_version}' no encontrada.")
                return None
            try:
                mk, _, _ = self._parse_model_id(target_version)
                if mk != model_key:
                    print(f"  ✗ La versión '{target_version}' no corresponde al tipo '{model_key}'.")
                    return None
            except ValueError:
                return None
            self.promote_version(target_version)
            return target_version

        # Encontrar la versión promoted actual
        current_promoted = self.get_promoted(model_key)
        if not current_promoted:
            # Si no hay promoted, promover la más reciente
            oldest = versions[-1]
            self.promote_version(oldest["id"])
            return oldest["id"]

        # Promover la versión anterior a la actual promoted
        sorted_by_version = sorted(versions, key=lambda x: int(x["version"][1:]))
        current_idx = None
        for i, v in enumerate(sorted_by_version):
            if v["id"] == current_promoted["id"]:
                current_idx = i
                break

        if current_idx is None or current_idx == 0:
            print(f"  ✗ No hay versión anterior a la actual para '{model_key}'.")
            return None

        prev_version = sorted_by_version[current_idx - 1]
        self.promote_version(prev_version["id"])
        return prev_version["id"]

    def compare_versions(self, model_ids: List[str]) -> Dict:
        """Compara métricas de múltiples versiones side-by-side.
        
        Retorna:
            dict con formato: { model_id: { metric_name: value, ... }, ... }
        """
        registry = self._load_registry()
        result = {}

        for mid in model_ids:
            if mid not in registry:
                raise ValueError(f"Modelo '{mid}' no encontrado en el registro.")
            entry = registry[mid]
            metrics = entry.get("metrics", {})
            metrics_flat = {}
            for k, v in metrics.items():
                if isinstance(v, (int, float)):
                    metrics_flat[k] = v
                elif isinstance(v, list) and all(isinstance(x, (int, float)) for x in v):
                    # flatten confusion_matrix to individual values
                    for i, val in enumerate(v):
                        metrics_flat[f"{k}_{i}"] = val
                elif isinstance(v, dict):
                    for sk, sv in v.items():
                        if isinstance(sv, (int, float)):
                            metrics_flat[f"{k}_{sk}"] = sv
            result[mid] = {
                "model_key": entry["model_key"],
                "version": entry["version"],
                "created_at": entry["created_at"],
                "promoted": entry.get("promoted", False),
                "metrics": metrics_flat,
                "dataset_name": entry["dataset_name"],
                "file_size_mb": entry["file_size_mb"],
            }

        return result

    def load_model(self, model_id: str) -> Dict:
        """Carga un modelo guardado por su ID."""
        registry = self._load_registry()

        if model_id not in registry:
            raise ValueError(f"Modelo '{model_id}' no encontrado en el registro.")

        info = registry[model_id]
        filepath = self.base_dir / info['filename']

        if not filepath.exists():
            raise FileNotFoundError(f"Archivo del modelo no encontrado: {filepath}")

        stored_checksum = info.get("checksum")
        if stored_checksum:
            actual_checksum = _compute_checksum(str(filepath))
            if actual_checksum != stored_checksum:
                raise ValueError(
                    f"Checksum mismatch for model '{model_id}'. "
                    f"File may have been tampered with or corrupted."
                )

        payload = joblib.load(filepath)

        print(f"\n  ✔ Modelo cargado: '{model_id}'")
        print(f"    Algoritmo: {info['model_key'].upper()}")
        print(f"    Versión: {info['version']}")
        print(f"    Dataset: {info['dataset_name']}")
        print(f"    Promoted: {'✓' if info.get('promoted') else '✗'}")
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
        """Elimina un modelo guardado."""
        registry = self._load_registry()

        if model_id not in registry:
            print(f"  ✗ Modelo '{model_id}' no encontrado.")
            return False

        info = registry[model_id]
        filepath = self.base_dir / info['filename']

        if filepath.exists():
            os.remove(filepath)

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

        sep = "=" * 140
        print(f"\n{sep}")
        print("  HISTORIAL DE MODELOS ENTRENADOS")
        print(sep)

        print(f"\n  {'#':<3} {'ID':<18} {'Versión':<8} {'Algoritmo':<10} {'Problema':<12} {'Dataset':<20} {'Fecha':<17} {'Prom.':<6} {'Métricas':<30}")
        print("  " + "-" * 136)

        for idx, model in enumerate(models, 1):
            fecha = model['created_at'][:10]
            hora = model['created_at'][11:16]
            fecha_str = f"{fecha} {hora}"
            promoted = "✓" if model.get("promoted") else "✗"

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

            print(f"  {idx:<3} {model['id']:<18} {model.get('version', '?'):<8} {model['model_key']:<10} "
                  f"{model['problem_type']:<12} {model['dataset_name']:<20} "
                  f"{fecha_str:<17} {promoted:<6} {metrics_str:<30}")

        print(f"\n{sep}\n")

    def interactive_menu(self) -> Optional[Dict]:
        """Menú interactivo para cargar un modelo guardado."""
        models = self.list_models()

        if not models:
            print("\n  No hay modelos guardados aún.")
            return None

        self.print_models_table(models)

        print("  Opciones:")
        print("    Ingresa el número o ID del modelo para cargar (ej: rf/v2)")
        print("    0 para volver")
        print()

        while True:
            try:
                entrada = input("  Selección: ").strip()

                if entrada == "0":
                    return None

                if entrada.isdigit():
                    idx = int(entrada) - 1
                    if 0 <= idx < len(models):
                        model_id = models[idx]['id']
                        return self.load_model(model_id)

                if "/" in entrada:
                    return self.load_model(entrada)

                print("  Opción inválida. Intenta de nuevo.")

            except ValueError:
                print("  Entrada inválida. Intenta de nuevo.")
            except Exception as e:
                print(f"  Error al cargar modelo: {e}")
                return None
