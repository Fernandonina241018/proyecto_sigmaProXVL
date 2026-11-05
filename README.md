# StatAnalyzer Pro — SigmaProXVL

SPA de análisis estadístico con cumplimiento FDA 21 CFR Part 11. Backend Node.js/Express + ML Service FastAPI.

## Fase 0 (2026-06-25)
- ✅ **2FA (TOTP)** — Autenticación de dos factores
- ✅ **WORM** — Preservación de datos originales (snapshots inmutables)
- ✅ **Backup** — Scripts de backup/restore PostgreSQL
- ✅ **Monitoring** — Correlation ID, slow request alerts

## Passkeys (WebAuthn)
Segundo factor rápido con huella, rostro o llave de seguridad. El TOTP sigue
activo como respaldo y es requisito para registrar una passkey.

El RP ID y el origen deben coincidir con el frontend desplegado:
```bash
# Fly.io (producción)
fly secrets set WEBAUTHN_RP_ID=fernandonina241018.github.io
fly secrets set WEBAUTHN_ORIGIN=https://fernandonina241018.github.io

# Local / E2E
WEBAUTHN_RP_ID=localhost
WEBAUTHN_ORIGIN=http://localhost:5510
```

## Stack
- **Frontend:** Vanilla JS + HTML5/CSS3 + Chart.js
- **Backend:** Node.js + Express + PostgreSQL (Supabase)
- **ML:** Python + FastAPI + scikit-learn + XGBoost + SHAP
- **Infra:** GitHub Pages + Fly.io

## Instalación
```bash
cd backend && npm install
cp .env.example .env  # Configurar JWT_SECRET y DATABASE_URL
npm start
``` 
