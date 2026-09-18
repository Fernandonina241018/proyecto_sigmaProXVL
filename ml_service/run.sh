#!/bin/bash
# Ejecuta el ML Service en local de forma portable (OPT-7: antes tenía
# un path absoluto Windows /mnt/g/... que no existe en Linux/Fly).
# Uso: ./ml_service/run.sh [puerto]   (default 8000, o $PORT)
set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
PORT="${1:-${PORT:-8000}}"
export MPLBACKEND=Agg
export PYTHONPATH="${PYTHONPATH}:${ROOT_DIR}/Red_Neuronal"
export PORT
exec python3 -u "$SCRIPT_DIR/main.py"
