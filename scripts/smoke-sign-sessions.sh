#!/bin/bash
# FASE 4 — Smoke E2E de bandeja de firmas contra backend real (store local).
# Cubre la capa HTTP (auth, códigos, status) que los unit tests no tocan.
# Uso: ./scripts/smoke-sign-sessions.sh
set -u
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PORT=3101
export PORT JWT_SECRET="smoke-test-secret-min-32-chars-123456"
export ADMIN_USERNAME=smoke_admin ADMIN_PASSWORD="SmokePass123!"
export JWT_EXPIRES_IN=1h
unset DATABASE_URL
LOG=/tmp/smoke-sign-backend.log

cd "$ROOT/backend"
node server.js > "$LOG" 2>&1 &
SRV=$!
cleanup() { kill $SRV 2>/dev/null; wait $SRV 2>/dev/null; rm -f "$ROOT/backend/data.json"; }
trap cleanup EXIT

API="http://localhost:$PORT"
for _ in $(seq 1 30); do curl -sf --max-time 2 "$API/api/health" >/dev/null && break; sleep 1; done
curl -sf --max-time 2 "$API/api/health" >/dev/null || { echo "SMOKE FAIL: backend no levantó"; tail -20 "$LOG"; exit 1; }
echo "SMOKE OK: backend vivo"

fail() { echo "SMOKE FAIL: $1"; tail -15 "$LOG"; exit 1; }
pass() { echo "SMOKE OK: $1"; }
J() { jq -r "$2" <<<"$1"; }

TOK_ADMIN=$(curl -sf -X POST "$API/api/login" -H 'Content-Type: application/json' \
  -d '{"username":"smoke_admin","password":"SmokePass123!"}' | jq -r .token) || fail "login admin"
[ "$TOK_ADMIN" != "null" ] && [ -n "$TOK_ADMIN" ] || fail "token admin nulo"
pass "login admin"

mkuser() { curl -sf -X POST "$API/api/users" -H "Authorization: Bearer $TOK_ADMIN" \
  -H 'Content-Type: application/json' -d "$1" | jq -r .ok; }
[ "$(mkuser '{"username":"smoke_pub","password":"Pass123!","role":"analista","nombre":"Pub Test","signatureCode":"PUB-1"}')" = "true" ] || fail "crear pub"
[ "$(mkuser '{"username":"smoke_ana","password":"Pass123!","role":"analista","nombre":"Ana Rev","signatureCode":"ANA-1"}')" = "true" ] || fail "crear ana"
[ "$(mkuser '{"username":"smoke_sup","password":"Pass123!","role":"supervisor","nombre":"Sup Ap","signatureCode":"SUP-1"}')" = "true" ] || fail "crear sup"
[ "$(mkuser '{"username":"smoke_dora","password":"Pass123!","role":"analista","signatureCode":"DORA-1"}')" = "true" ] || fail "crear dora"
pass "4 usuarios con códigos"

HTML='<html><body><div data-signature-role="prepared"><span data-signature-field="name" data-signature-role="prepared">—</span></div></body></html>'
PUB=$(curl -sf -X POST "$API/api/sign-sessions" -H "Authorization: Bearer $TOK_ADMIN" \
  -H 'Content-Type: application/json' -d "$(jq -n --arg h "$HTML" '{name:"RPT-SMOKE", html:$h, assignedReviewer:"smoke_ana", assignedApprover:"smoke_sup", signatureCode:"PUB-1", password:"Pass123!"}')")
[ "$(J "$PUB" .ok)" = "true" ] || fail "publish: $(J "$PUB" .error)"
SID=$(J "$PUB" .session.id); VER=$(J "$PUB" .session.version)
[ "$(J "$PUB" .session.signatures.prepared.username)" = "smoke_pub" ] || fail "prepared no es pub"
pass "publish sesión #$SID (prepared=smoke_pub)"

# Fuera de orden
OOO=$(curl -s -X POST "$API/api/sign-sessions/$SID/sign" -H "Authorization: Bearer $TOK_ADMIN" \
  -H 'Content-Type: application/json' -d '{"role":"approved","signatureCode":"SUP-1","password":"Pass123!","expectedVersion":1}')
[ "$(J "$OOO" .code)" = "out-of-order" ] || fail "orden no enforced: $OOO"
pass "422 out-of-order"

# Misma persona
SP=$(curl -s -X POST "$API/api/sign-sessions/$SID/sign" -H "Authorization: Bearer $TOK_ADMIN" \
  -H 'Content-Type: application/json' -d '{"role":"reviewed","signatureCode":"PUB-1","password":"Pass123!","expectedVersion":1}')
[ "$(J "$SP" .code)" = "same-person" ] || fail "same-person no enforced: $SP"
pass "422 same-person"

# Revisor correcto
RV=$(curl -sf -X POST "$API/api/sign-sessions/$SID/sign" -H "Authorization: Bearer $TOK_ADMIN" \
  -H 'Content-Type: application/json' -d '{"role":"reviewed","signatureCode":"ANA-1","password":"Pass123!","expectedVersion":1}') || fail "reviewed"
[ "$(J "$RV" .session.next_role)" = "approved" ] || fail "next no es approved"
pass "reviewed por smoke_ana"

# Asignado equivocado en approved (dora no es sup ni asignada)
WA=$(curl -s -X POST "$API/api/sign-sessions/$SID/sign" -H "Authorization: Bearer $TOK_ADMIN" \
  -H 'Content-Type: application/json' -d '{"role":"approved","signatureCode":"DORA-1","password":"Pass123!","expectedVersion":2}')
[ "$(J "$WA" .code)" = "wrong-role" ] || fail "wrong-role no enforced: $WA"
pass "422 wrong-role"

# Versión vieja
ST=$(curl -s -X POST "$API/api/sign-sessions/$SID/sign" -H "Authorization: Bearer $TOK_ADMIN" \
  -H 'Content-Type: application/json' -d '{"role":"approved","signatureCode":"SUP-1","password":"Pass123!","expectedVersion":1}')
[ "$(J "$ST" .code)" = "stale-version" ] || fail "stale no enforced: $ST"
pass "409 stale-version"

# Aprobación final
AP=$(curl -sf -X POST "$API/api/sign-sessions/$SID/sign" -H "Authorization: Bearer $TOK_ADMIN" \
  -H 'Content-Type: application/json' -d '{"role":"approved","signatureCode":"SUP-1","password":"Pass123!","expectedVersion":2}') || fail "approved"
[ "$(J "$AP" .session.status)" = "complete" ] || fail "no completa"
pass "approved → complete"

# Bandeja: pendientes de ana (login como ana)
TOK_ANA=$(curl -sf -X POST "$API/api/login" -H 'Content-Type: application/json' \
  -d '{"username":"smoke_ana","password":"Pass123!"}' | jq -r .token) || fail "login ana"
CNT=$(curl -sf "$API/api/sign-sessions?scope=pending&count=1" -H "Authorization: Bearer $TOK_ANA" | jq -r .count)
[ "$CNT" = "0" ] || fail "pending de ana debe ser 0, es $CNT"
pass "pending count de ana = 0 (ya firmó todo)"

# Unsign: solo último + solo quien firmó + motivo obligatorio
UG=$(curl -sf -X POST "$API/api/sign-sessions" -H "Authorization: Bearer $TOK_ADMIN" \
  -H 'Content-Type: application/json' -d '{"name":"RPT-UNS","html":"<h1>u</h1>","assignedReviewer":"smoke_ana","signatureCode":"PUB-1","password":"Pass123!"}') || fail "publish unsign"
SIDU=$(J "$UG" .session.id)
curl -sf -X POST "$API/api/sign-sessions/$SIDU/sign" -H "Authorization: Bearer $TOK_ADMIN" \
  -H 'Content-Type: application/json' -d '{"role":"reviewed","signatureCode":"ANA-1","password":"Pass123!","expectedVersion":1}' >/dev/null || fail "reviewed unsign-setup"
UNL=$(curl -s -X POST "$API/api/sign-sessions/$SIDU/unsign" -H "Authorization: Bearer $TOK_ADMIN" \
  -H 'Content-Type: application/json' -d '{"role":"prepared","signatureCode":"PUB-1","password":"Pass123!","expectedVersion":2,"reason":"x"}')
[ "$(J "$UNL" .code)" = "not-last" ] || fail "unsign no-último debió ser not-last: $UNL"
pass "422 unsign no-último"
UNW=$(curl -s -X POST "$API/api/sign-sessions/$SIDU/unsign" -H "Authorization: Bearer $TOK_ADMIN" \
  -H 'Content-Type: application/json' -d '{"role":"reviewed","signatureCode":"DORA-1","password":"Pass123!","expectedVersion":2,"reason":"x"}')
[ "$(J "$UNW" .code)" = "wrong-person" ] || fail "unsign ajeno debió ser wrong-person: $UNW"
pass "422 unsign persona ajena"
UNR=$(curl -s -X POST "$API/api/sign-sessions/$SIDU/unsign" -H "Authorization: Bearer $TOK_ADMIN" \
  -H 'Content-Type: application/json' -d '{"role":"reviewed","signatureCode":"ANA-1","password":"Pass123!","expectedVersion":2}')
[ "$(J "$UNR" .error)" = "El motivo es obligatorio" ] || fail "motivo debió exigirse: $UNR"
pass "400 motivo obligatorio"
UNO=$(curl -sf -X POST "$API/api/sign-sessions/$SIDU/unsign" -H "Authorization: Bearer $TOK_ADMIN" \
  -H 'Content-Type: application/json' -d '{"role":"reviewed","signatureCode":"ANA-1","password":"Pass123!","expectedVersion":2,"reason":"dato mal"}') || fail "unsign propio"
[ "$(J "$UNO" .session.next_role)" = "reviewed" ] || fail "debió volver a reviewed"
pass "unsign propio revierte a reviewed"


# 403 detalle para no involucrada
FBD=$(curl -s -o /dev/null -w "%{http_code}" "$API/api/sign-sessions/$SID" -H "Authorization: Bearer $TOK_ADMIN")
[ "$FBD" = "200" ] || fail "admin debe ver detalle"
TOK_DORA=$(curl -sf -X POST "$API/api/login" -H 'Content-Type: application/json' \
  -d '{"username":"smoke_dora","password":"Pass123!"}' | jq -r .token) || fail "login dora"
FBD2=$(curl -s -o /dev/null -w "%{http_code}" "$API/api/sign-sessions/$SID" -H "Authorization: Bearer $TOK_DORA")
[ "$FBD2" = "403" ] || fail "dora debió recibir 403, fue $FBD2"
pass "403 para no involucrada"

# Import: archivo limpio con prepared coincidente (PUB TEST)
HTML2='<html><body><div data-signature-role="prepared"><span data-signature-field="name" data-signature-role="prepared">PUB TEST</span></div><div data-signature-role="reviewed"><span data-signature-field="name" data-signature-role="reviewed">—</span></div></body></html>'
IMP=$(curl -sf -X POST "$API/api/sign-sessions/import" -H "Authorization: Bearer $TOK_ADMIN" \
  -H 'Content-Type: application/json' -d "$(jq -n --arg h "$HTML2" '{name:"RPT-IMP", html:$h, assignedReviewer:"smoke_ana", signatureCode:"PUB-1", password:"Pass123!"}')") || fail "import"
[ "$(J "$IMP" .ok)" = "true" ] || fail "import: $(J "$IMP" .error)"
pass "import aceptado (sesión #$(J "$IMP" .session.id))"

# Import: mismatch de preparador
IMP2=$(curl -s -X POST "$API/api/sign-sessions/import" -H "Authorization: Bearer $TOK_ADMIN" \
  -H 'Content-Type: application/json' -d "$(jq -n --arg h "$HTML2" '{name:"RPT-IMP2", html:$h, assignedReviewer:"smoke_ana", signatureCode:"ANA-1", password:"Pass123!"}')")
[ "$(J "$IMP2" .code)" = "preparer-mismatch" ] || fail "mismatch no enforced: $IMP2"
pass "422 preparer-mismatch"

# Reject: no involucrada → 403; creador → 200 y sale de pendientes
# (la sesión #2 es la del import; el big publish viene después)
RJ1=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$API/api/sign-sessions/2/reject" -H "Authorization: Bearer $TOK_DORA" \
  -H 'Content-Type: application/json' -d '{"reason":"x"}')
[ "$RJ1" = "403" ] || fail "reject ajeno debió ser 403, fue $RJ1"
pass "403 reject no involucrada"
RJ2=$(curl -sf -X POST "$API/api/sign-sessions/2/reject" -H "Authorization: Bearer $TOK_ADMIN" \
  -H 'Content-Type: application/json' -d '{"reason":"datos mal"}') || fail "reject creador"
[ "$(J "$RJ2" .session.status)" = "rejected" ] || fail "no quedó rejected"
pass "reject por admin (sesión #2 rechazada)"
LST=$(curl -sf "$API/api/sign-sessions?scope=pending&limit=200" -H "Authorization: Bearer $TOK_ADMIN" | jq -r '.sessions[].id')
echo "$LST" | grep -qx "2" && fail "rechazada sigue en pendientes" || pass "rechazada fuera de pendientes"
DEL1=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE "$API/api/sign-sessions/1" -H "Authorization: Bearer $TOK_ADMIN")
[ "$DEL1" = "422" ] || fail "borrar completa debió ser 422, fue $DEL1"
pass "422 borrar completa"
DEL2=$(curl -sf -X DELETE "$API/api/sign-sessions/2" -H "Authorization: Bearer $TOK_ADMIN") || fail "borrar rechazada"
[ "$(J "$DEL2" .ok)" = "true" ] || fail "borrar rechazada"
GONE=$(curl -s -o /dev/null -w "%{http_code}" "$API/api/sign-sessions/2" -H "Authorization: Bearer $TOK_ADMIN")
[ "$GONE" = "404" ] || fail "eliminada debió ser 404, fue $GONE"
pass "rechazada eliminada (404 posterior)"

# Publish con HTML grande (~1MB, como reporte real con JPEGs) — regresión 413.
# OJO: se escribe a archivo porque 1MB como argumento rompe ARG_MAX del shell.
python3 -c "import json; print(json.dumps({'name':'RPT-BIG','html':'A'*1000000,'assignedReviewer':'smoke_ana','signatureCode':'PUB-1','password':'Pass123!'}))" > /tmp/smoke-big.json
BIGCODE=$(curl -s -o /tmp/smoke-big-resp.json -w "%{http_code}" --max-time 60 -X POST "$API/api/sign-sessions" -H "Authorization: Bearer $TOK_ADMIN" \
  -H 'Content-Type: application/json' --data-binary @/tmp/smoke-big.json)
[ "$BIGCODE" = "200" ] || fail "publish grande HTTP $BIGCODE: $(head -c 200 /tmp/smoke-big-resp.json)"
[ "$(jq -r .ok < /tmp/smoke-big-resp.json)" = "true" ] || fail "publish grande: $(jq -r .error < /tmp/smoke-big-resp.json)"
pass "publish 1MB aceptado (sesión #$(jq -r .session.id < /tmp/smoke-big-resp.json))"
rm -f /tmp/smoke-big.json /tmp/smoke-big-resp.json

# Verify chain intacta
VRF=$(curl -sf "$API/api/audit/verify" -H "Authorization: Bearer $TOK_ADMIN" | jq -r .valid)
[ "$VRF" = "true" ] || fail "cadena rota"
pass "audit chain válida"

echo "=== SMOKE E2E: TODO VERDE ==="
