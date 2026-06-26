#!/usr/bin/env bash
# ==============================================
# backup-restore.sh — StatAnalyzer Pro
# Procedimiento de restauración de backup
# ==============================================
set -euo pipefail

if [ $# -lt 1 ]; then
    echo "Uso: $0 <archivo-backup.sql.gz>"
    echo ""
    echo "Ejemplos:"
    echo "  # Listar backups disponibles"
    echo "  ls -lh ./backups/"
    echo ""
    echo "  # Restaurar un backup específico"
    echo "  $0 ./backups/statanalyzer_20250101_000000_UTC.sql.gz"
    echo ""
    echo "  # Verificar checksum antes de restaurar"
    echo "  sha256sum -c ./backups/statanalyzer_20250101_000000_UTC.sql.gz.sha256"
    exit 1
fi

BACKUP_FILE="$1"
CHECKSUM_FILE="${BACKUP_FILE}.sha256"

echo "================================================"
echo "  StatAnalyzer Pro — Restauración de Backup"
echo "================================================"
echo ""

# ── Verificar que el archivo existe ─────────
if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ ERROR: Archivo no encontrado: ${BACKUP_FILE}"
    exit 1
fi

# ── Verificar checksum ──────────────────────
if [ -f "$CHECKSUM_FILE" ]; then
    echo "🔍 Verificando checksum..."
    if sha256sum -c "$CHECKSUM_FILE"; then
        echo "✅ Checksum verificado"
    else
        echo "❌ ERROR: Checksum no coincide. El backup puede estar corrupto."
        echo "   No se restaurará por seguridad."
        exit 1
    fi
else
    echo "⚠️  No se encontró archivo de checksum"
    echo "   ¿Continuar de todas formas? (s/N)"
    read -r CONFIRM
    if [ "$CONFIRM" != "s" ] && [ "$CONFIRM" != "S" ]; then
        echo "❌ Restauración cancelada"
        exit 1
    fi
fi

# ── Verificar DATABASE_URL ──────────────────
if [ -z "${DATABASE_URL:-}" ]; then
    echo "❌ ERROR: DATABASE_URL no está definida."
    echo "   Exporta la variable antes de restaurar:"
    echo "   export DATABASE_URL='postgresql://usuario:password@host:5432/statanalyzer'"
    exit 1
fi

# ── Confirmación final ──────────────────────
BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
echo ""
echo "⚠️  ADVERTENCIA: Esto REEMPLAZARÁ todos los datos en la BD."
echo ""
echo "   Backup a restaurar: ${BACKUP_FILE} (${BACKUP_SIZE})"
echo "   Base de datos:     ${DATABASE_URL}"
echo ""
echo "   ¿Estás SEGURO de continuar? (escribe 'RESTAURAR' para confirmar)"
read -r CONFIRM2
if [ "$CONFIRM2" != "RESTAURAR" ]; then
    echo "❌ Restauración cancelada"
    exit 1
fi

# ── Restaurar ───────────────────────────────
echo ""
echo "📦 Restaurando backup..."
gunzip -c "$BACKUP_FILE" | psql "${DATABASE_URL}" 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Restauración completada exitosamente"
    echo "   Archivo: ${BACKUP_FILE}"
else
    echo "❌ ERROR durante la restauración"
    echo "   Revisa el output para más detalles."
    exit 1
fi

exit 0
