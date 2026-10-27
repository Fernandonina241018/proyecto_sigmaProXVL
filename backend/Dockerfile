FROM node:18-slim

# PDF en servidor: Chromium del sistema + fuentes (incluye emoji, usados en
# los títulos del reporte). Si esta capa faltara, el backend arranca igual y
# /api/pdf/render responde 503 → el frontend usa el generador local.
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      chromium fonts-dejavu-core fonts-liberation fonts-noto-color-emoji ca-certificates \
 && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

COPY . .

# puppeteer-core se instala aparte (--no-save) para no tocar package-lock.json
# ni el `npm ci` de CI. Cuando se agregue formalmente a package.json, borrar
# la segunda línea.
RUN cd backend && npm install --omit=dev \
 && npm install --omit=dev --no-save --no-audit --no-fund puppeteer-core@23.11.1

EXPOSE 3000

CMD ["node", "backend/server.js"]
