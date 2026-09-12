FROM node:18-slim

WORKDIR /app

COPY . .

RUN cd backend && npm install --omit=dev

EXPOSE 3000

CMD ["node", "backend/server.js"]
