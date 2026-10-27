#!/usr/bin/env bash
# Smoke del PDF en servidor contra un backend real (local o Fly.io).
# Uso: BACKEND_URL=https://sigmaproxvl-backend.fly.dev USER=x PASS=y ./scripts/smoke-pdf.sh
set -euo pipefail
: "${BACKEND_URL:?BACKEND_URL requerido}"; : "${USER:?USER requerido}"; : "${PASS:?PASS requerido}"
TOKEN=$(curl -sf -X POST "$BACKEND_URL/api/login" -H 'Content-Type: application/json' \
  -d "{\"username\":\"$USER\",\"password\":\"$PASS\"}" | jq -r .token)
[ -n "$TOKEN" ] && [ "$TOKEN" != "null" ] || { echo "login falló (¿usuario con 2FA?)"; exit 1; }
echo "status:"; curl -sf "$BACKEND_URL/api/pdf/status" -H "Authorization: Bearer $TOKEN"; echo
HTML='<!DOCTYPE html><html><head><style>@media print{.sec{page-break-before:always}.sec:first-of-type{page-break-before:avoid}}</style></head><body><div class="sec"><h1>Sección 1</h1><script>document.body.innerHTML="JS EJECUTADO"</script></div><div class="sec"><h1>Sección 2</h1><img src="http://169.254.169.254/latest/meta-data"></div></body></html>'
curl -sf -X POST "$BACKEND_URL/api/pdf/render" -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d "$(jq -n --arg h "$HTML" '{html:$h, filename:"smoke.pdf", kind:"reporte"}')" -D /tmp/smoke-pdf.h -o /tmp/smoke.pdf
head -c 5 /tmp/smoke.pdf | grep -q '%PDF-' && echo "OK: PDF válido ($(wc -c </tmp/smoke.pdf) bytes)"
grep -i 'x-pdf-sha256' /tmp/smoke-pdf.h
command -v pdfinfo >/dev/null && pdfinfo /tmp/smoke.pdf | grep Pages   # esperado: Pages: 2
command -v pdftotext >/dev/null && { pdftotext /tmp/smoke.pdf - | grep -q 'JS EJECUTADO' && echo "FALLA: corrió JS" || echo "OK: JS bloqueado"; }
