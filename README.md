# StatAnalyzer Pro — SigmaProXVL

SPA de análisis estadístico con cumplimiento FDA 21 CFR Part 11. Backend Node.js/Express + ML Service FastAPI.

## Fase 0 (2026-06-25)
- ✅ **2FA (TOTP)** — Autenticación de dos factores
- ✅ **WORM** — Preservación de datos originales (snapshots inmutables)
- ✅ **Backup** — Scripts de backup/restore PostgreSQL
- ✅ **Monitoring** — Correlation ID, slow request alerts

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
