#!/usr/bin/env bash
# Backup lógico cifrado de PostgreSQL (StatAnalyzer Pro).
# Uso:
#   DATABASE_URL='postgresql://...' BACKUP_PASSPHRASE='...' ./scripts/backup-db.sh
# Requiere: pg_dump, gzip y gpg.
# El archivo resultante se guarda fuera del repo (por defecto ./backups).
set -euo pipefail

: "${DATABASE_URL:?Falta DATABASE_URL}"
: "${BACKUP_PASSPHRASE:?Falta BACKUP_PASSPHRASE}"

OUT_DIR="${BACKUP_DIR:-./backups}"
mkdir -p "$OUT_DIR"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
PLAIN="$OUT_DIR/statanalyzer-${STAMP}.sql.gz"
ENC="${PLAIN}.gpg"

echo "→ Generando dump..."
pg_dump "$DATABASE_URL" --no-owner --no-privileges --format=plain | gzip -9 > "$PLAIN"

echo "→ Cifrando..."
gpg --batch --yes --symmetric --cipher-algo AES256 \
  --passphrase "$BACKUP_PASSPHRASE" \
  --output "$ENC" "$PLAIN"
shred -u "$PLAIN" 2>/dev/null || rm -f "$PLAIN"

echo "✅ Backup: $ENC"
echo "   Restaurar: gpg --decrypt \"$ENC\" | gunzip | psql \"\$DATABASE_URL\""
