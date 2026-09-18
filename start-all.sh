#!/bin/bash
set -e
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

cleanup() {
    echo ""
    echo "⏹ Deteniendo servicios..."
    kill "$PID_ML" 2>/dev/null
    kill "$PID_NODE" 2>/dev/null
    wait "$PID_ML" 2>/dev/null
    wait "$PID_NODE" 2>/dev/null
    echo "✅ Servicios detenidos"
    exit 0
}
trap cleanup SIGINT SIGTERM

echo "╔══════════════════════════════════════╗"
echo "║   SigmaPro — Iniciando servicios    ║"
echo "╚══════════════════════════════════════╝"
echo ""
echo "💡 También disponible como servicios systemd:"
echo "   systemctl --user start   sigmapro-ml.service sigmapro-backend.service"
echo "   systemctl --user stop    sigmapro-ml.service sigmapro-backend.service"
echo "   systemctl --user status  sigmapro-ml.service sigmapro-backend.service"
echo "   # Se inician automáticamente al arrancar el sistema"
echo ""

# ── ML Service (Python, puerto 8000) ──
echo ""
echo "🚀 ML Service  → http://localhost:8000/api/ml/health"
export MPLBACKEND=Agg
export PYTHONPATH="${PYTHONPATH}:${ROOT_DIR}/Red_Neuronal"
python3 -u "$ROOT_DIR/ml_service/main.py" &
PID_ML=$!

# ── Backend (Node.js, puerto 3000) ──
if [ ! -f "$ROOT_DIR/backend/.env" ]; then
    JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
    echo "JWT_SECRET=$JWT_SECRET" > "$ROOT_DIR/backend/.env"
    echo "📝 Creado backend/.env con JWT_SECRET generado"
fi
echo "🚀 Backend     → http://localhost:3000"
cd "$ROOT_DIR/backend"
node server.js &
PID_NODE=$!
cd "$ROOT_DIR"

echo ""
echo "────────────────────────────────────────"
# OPT-7: health-wait — no declarar "listo" sin verificar. Backend es
# requerido (exit 1 si no levanta); ML es degradable (solo warning, la
# app funciona sin ML salvo sus páginas).
wait_for() { # $1=url $2=nombre $3=timeout_s
    if ! command -v curl >/dev/null 2>&1; then
        echo "⚠️  Sin curl: salto verificación de $2"
        return 0
    fi
    i=0
    while [ "$i" -lt "$3" ]; do
        if curl -sf --max-time 3 "$1" >/dev/null 2>&1; then
            echo "✅ $2 OK ($1)"
            return 0
        fi
        sleep 2
        i=$((i + 2))
    done
    return 1
}
if ! wait_for "http://localhost:3000/api/health" "Backend" 60; then
    echo "❌ Backend no respondió en 60s — revisa backend/.env y logs"
    cleanup
fi
wait_for "http://localhost:8000/api/ml/health" "ML Service" 60 || \
    echo "⚠️  ML Service no respondió — la app arranca sin ML"
echo "────────────────────────────────────────"
echo "  Prensa Ctrl+C para detener ambos"
echo "────────────────────────────────────────"

wait
