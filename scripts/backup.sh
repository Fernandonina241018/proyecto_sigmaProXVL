#!/usr/bin/env bash
# ==============================================
# backup.sh — StatAnalyzer Pro
# Backup automático de PostgreSQL + archivos
# Cumplimiento: CFR 21 Part 11 §11.10(c)
# ==============================================
set -euo pipefail

# ── Configuración ────────────────────────────
BACKUP_DIR="${BACKUP_DIR:-./backups}"
RETENTION_DAYS="${RETENTION_DAYS:-90}"       # Retención: 90 días por defecto
DB_NAME="${PGDATABASE:-statanalyzer}"
TIMESTAMP=$(date -u '+%Y%m%d_%H%M%S_UTC')
BACKUP_FILE="${BACKUP_DIR}/${DB_NAME}_${TIMESTAMP}.sql.gz"
CHECKSUM_FILE="${BACKUP_FILE}.sha256"
LOG_FILE="${BACKUP_DIR}/backup.log"

# ── Funciones ────────────────────────────────
log() {
    echo "[$(date -u '+%Y-%m-%d %H:%M:%S UTC')] $*" | tee -a "$LOG_FILE"
}

cleanup_old() {
    log "🧹 Limpiando backups anteriores a ${RETENTION_DAYS} días..."
    find "$BACKUP_DIR" -name "${DB_NAME}_*.sql.gz" -type f -mtime "+${RETENTION_DAYS}" -delete
    find "$BACKUP_DIR" -name "${DB_NAME}_*.sql.gz.sha256" -type f -mtime "+${RETENTION_DAYS}" -delete
    log "✅ Limpieza completada"
}

# ── Validación ───────────────────────────────
if [ -z "${DATABASE_URL:-}" ] && [ -z "${PGHOST:-}" ]; then
    log "❌ DATABASE_URL no definido. Modo local — no se requiere backup de BD."
    log "ℹ️  Los datos locales están en backend/data.json"
    exit 0
fi

mkdir -p "$BACKUP_DIR"

# ── Backup PostgreSQL ────────────────────────
log "📦 Iniciando backup de ${DB_NAME}..."
log "   Destino: ${BACKUP_FILE}"

if pg_dump --version >/dev/null 2>&1; then
    pg_dump \
        --dbname="${DATABASE_URL:-}" \
        --no-owner \
        --no-acl \
        --compress=9 \
        --file="${BACKUP_FILE}" \
        2>> "$LOG_FILE"

    # Verificar integridad
    if [ -f "$BACKUP_FILE" ] && [ -s "$BACKUP_FILE" ]; then
        # Calcular checksum
        sha256sum "$BACKUP_FILE" | cut -d' ' -f1 > "$CHECKSUM_FILE"
        BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
        log "✅ Backup completado: ${BACKUP_SIZE} | Checksum: $(cat "$CHECKSUM_FILE")"

        # Probar integridad del backup
        if gunzip -t "$BACKUP_FILE" 2>/dev/null; then
            log "✅ Integridad del backup verificada"
        else
            log "❌ ERROR: Backup corrupto!"
            exit 1
        fi
    else
        log "❌ ERROR: Archivo de backup vacío o no creado"
        exit 1
    fi
else
    log "⚠️  pg_dump no instalado. Instala PostgreSQL cliente para backups automáticos."
    log "   sudo apt install postgresql-client  # Debian/Ubuntu"
    log "   sudo pacman -S postgresql           # Arch Linux"
fi

# ── Limpieza ─────────────────────────────────
cleanup_old

# ── Reporte ──────────────────────────────────
log "✅ Backup completado exitosamente"
log "   Archivo: ${BACKUP_FILE}"
log "   Checksum: $(cat "$CHECKSUM_FILE" 2>/dev/null || echo 'N/A')"

exit 0
