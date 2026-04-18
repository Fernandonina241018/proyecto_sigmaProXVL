"""
data_loader.py — Carga de datos desde múltiples fuentes externas.

Fuentes soportadas:
  • CSV / Excel local
  • API REST  (GET → JSON)
  • Base de datos SQL  (SQLite o PostgreSQL via connection string)
  • Datos sintéticos   (fallback / demo)
"""

import os
import json
import warnings
import numpy as np
import pandas as pd

warnings.filterwarnings("ignore")


# ══════════════════════════════════════════════════════════════════
#  CARGADORES INDIVIDUALES
# ══════════════════════════════════════════════════════════════════

def load_csv(path: str, **kwargs) -> pd.DataFrame:
    """Carga un archivo CSV.

    Parámetros extra de pandas (sep, encoding, decimal…) se pasan
    directamente en **kwargs.
    """
    if not os.path.exists(path):
        raise FileNotFoundError(f"No se encontró el archivo: {path}")
    df = pd.read_csv(path, **kwargs)
    print(f"  ✔ CSV cargado: {path}  ({len(df):,} filas, {df.shape[1]} cols)")
    return df


def load_excel(path: str, sheet_name=0, **kwargs) -> pd.DataFrame:
    """Carga un archivo Excel (.xlsx / .xls).

    Argumentos:
        sheet_name : nombre o índice de la hoja (default 0 = primera hoja).
    """
    if not os.path.exists(path):
        raise FileNotFoundError(f"No se encontró el archivo: {path}")
    df = pd.read_excel(path, sheet_name=sheet_name, **kwargs)
    print(f"  ✔ Excel cargado: {path}  ({len(df):,} filas, {df.shape[1]} cols)")
    return df


def load_api(url: str, params: dict = None, headers: dict = None,
             record_path=None, timeout: int = 30) -> pd.DataFrame:
    """Carga datos desde una API REST que devuelve JSON.

    Argumentos:
        url         : endpoint completo (ej. 'https://api.ejemplo.com/students')
        params      : query-params del GET (dict)
        headers     : cabeceras HTTP (dict), útil para tokens Bearer
        record_path : clave JSON que contiene la lista de registros.
                      None → se intenta normalizar el JSON directamente.
        timeout     : segundos antes de abortar la petición
    """
    try:
        import requests
    except ImportError:
        raise ImportError("Instala 'requests': pip install requests")

    resp = requests.get(url, params=params, headers=headers, timeout=timeout)
    resp.raise_for_status()
    data = resp.json()

    if isinstance(data, list):
        df = pd.json_normalize(data)
    elif isinstance(data, dict):
        if record_path and record_path in data:
            df = pd.json_normalize(data[record_path])
        else:
            df = pd.json_normalize(data)
    else:
        raise ValueError("La API devolvió un formato JSON no soportado.")

    print(f"  ✔ API cargada: {url}  ({len(df):,} filas, {df.shape[1]} cols)")
    return df


def load_sql(query: str, connection_string: str) -> pd.DataFrame:
    """Carga datos desde una base de datos SQL.

    Argumentos:
        query             : sentencia SELECT completa
        connection_string : 
            SQLite  → 'sqlite:///mi_bd.db'
            Postgres→ 'postgresql://user:pass@host:5432/db'
            MySQL   → 'mysql+pymysql://user:pass@host/db'

    Requiere: sqlalchemy  (pip install sqlalchemy)
    Para Postgres: pip install psycopg2-binary
    Para MySQL:    pip install pymysql
    """
    try:
        from sqlalchemy import create_engine, text
    except ImportError:
        raise ImportError("Instala 'sqlalchemy': pip install sqlalchemy")

    engine = create_engine(connection_string)
    with engine.connect() as conn:
        df = pd.read_sql(text(query), conn)

    print(f"  ✔ SQL cargado: {len(df):,} filas, {df.shape[1]} cols")
    return df


def load_synthetic(n_samples: int = 1000, seed: int = 42) -> pd.DataFrame:
    """Genera un dataset de ejemplo multivariado para demos y tests.

    Columnas generadas:
        horas_estudio       [0–12]
        asistencia_pct      [40–100]
        promedio_previo     [40–100]
        horas_sueno         [4–10]
        actividades_extra   {0, 1, 2, 3}
        nivel_estres        [1–10]
        aprobado            0/1   (target binario de ejemplo)
    """
    np.random.seed(seed)
    n = n_samples

    horas        = np.random.uniform(0, 12, n)
    asistencia   = np.random.uniform(40, 100, n)
    promedio     = np.random.uniform(40, 100, n)
    sueno        = np.random.uniform(4, 10, n)
    actividades  = np.random.randint(0, 4, n).astype(float)
    estres       = np.random.uniform(1, 10, n)

    # Probabilidad logística multivariada realista
    logit = (
        -6
        + 0.5  * horas
        + 0.04 * asistencia
        + 0.06 * promedio
        + 0.2  * sueno
        - 0.15 * estres
        + 0.3  * actividades
    )
    prob = 1 / (1 + np.exp(-logit))
    prob = np.clip(prob + np.random.normal(0, 0.05, n), 0, 1)
    aprobado = (np.random.random(n) < prob).astype(int)

    df = pd.DataFrame({
        "horas_estudio":     horas,
        "asistencia_pct":    asistencia,
        "promedio_previo":   promedio,
        "horas_sueno":       sueno,
        "actividades_extra": actividades,
        "nivel_estres":      estres,
        "aprobado":          aprobado,
    })
    print(f"  ✔ Datos sintéticos generados: {n:,} filas, {df.shape[1]} cols")
    return df


# ══════════════════════════════════════════════════════════════════
#  FUNCIÓN UNIFICADA  (punto de entrada del sistema)
# ══════════════════════════════════════════════════════════════════

def load_data(source: str, **kwargs) -> pd.DataFrame:
    """Enruta la carga de datos al cargador correcto.

    Argumentos:
        source : 'csv' | 'excel' | 'api' | 'sql' | 'synthetic'
        **kwargs: argumentos específicos del cargador elegido.

    Ejemplos de uso
    ---------------
    # CSV
    df = load_data('csv', path='datos/estudiantes.csv', sep=';')

    # Excel
    df = load_data('excel', path='datos/notas.xlsx', sheet_name='Hoja1')

    # API REST
    df = load_data('api',
                   url='https://mi-api.com/estudiantes',
                   headers={'Authorization': 'Bearer TOKEN'},
                   record_path='data')

    # SQL
    df = load_data('sql',
                   query='SELECT * FROM estudiantes WHERE anio = 2024',
                   connection_string='sqlite:///escuela.db')

    # Múltiples fuentes combinadas
    df = load_data('multi',
                   sources=[
                       {'type': 'csv',   'path': 'notas.csv'},
                       {'type': 'excel', 'path': 'asistencia.xlsx'},
                   ],
                   join_on='student_id')   # columna común para merge

    # Sintético (demo)
    df = load_data('synthetic', n_samples=2000)
    """
    source = source.lower().strip()
    loaders = {
        "csv":       _route_csv,
        "excel":     _route_excel,
        "api":       _route_api,
        "sql":       _route_sql,
        "synthetic": _route_synthetic,
        "multi":     _route_multi,
    }
    if source not in loaders:
        raise ValueError(
            f"Fuente '{source}' no reconocida. "
            f"Opciones: {list(loaders.keys())}"
        )
    return loaders[source](**kwargs)


# ── Rutas internas ─────────────────────────────────────────────────

def _route_csv(**kw):
    return load_csv(kw.pop("path"), **kw)

def _route_excel(**kw):
    return load_excel(kw.pop("path"), **kw)

def _route_api(**kw):
    return load_api(kw.pop("url"), **kw)

def _route_sql(**kw):
    return load_sql(kw.pop("query"), kw.pop("connection_string"), **kw)

def _route_synthetic(**kw):
    return load_synthetic(**kw)

def _route_multi(sources: list, join_on: str = None,
                 join_how: str = "inner") -> pd.DataFrame:
    """Carga múltiples fuentes y las combina.

    Argumentos:
        sources  : lista de dicts, cada uno con 'type' + args del cargador.
                   Ej: [{'type':'csv','path':'a.csv'}, {'type':'api','url':'...'}]
        join_on  : columna clave para hacer merge entre DataFrames.
                   Si es None → se usa pd.concat (apilado vertical, mismas cols).
        join_how : 'inner' | 'outer' | 'left' | 'right'  (solo si join_on dado)
    """
    frames = []
    for i, src in enumerate(sources):
        src = dict(src)              # copia para no mutar el original
        src_type = src.pop("type")
        print(f"  ↳ Fuente {i+1}/{len(sources)}: [{src_type}]")
        frames.append(load_data(src_type, **src))

    if not frames:
        raise ValueError("La lista 'sources' está vacía.")

    if join_on:
        df = frames[0]
        for f in frames[1:]:
            df = df.merge(f, on=join_on, how=join_how, suffixes=("", f"_dup{id(f)}"))
        # Eliminar columnas duplicadas generadas por merge
        dup_cols = [c for c in df.columns if "_dup" in c]
        df.drop(columns=dup_cols, inplace=True)
        print(f"  ✔ Merge completado ({join_how}) en '{join_on}': {len(df):,} filas")
    else:
        df = pd.concat(frames, ignore_index=True)
        print(f"  ✔ Concat completado: {len(df):,} filas totales")

    return df
