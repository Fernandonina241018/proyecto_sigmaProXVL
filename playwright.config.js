// LOTE E — E2E mínimo del flujo crítico (login → bandeja → firmar).
// Servidores efímeros: backend store local + frontend estático.
// El frontend apunta a http://localhost:3000 cuando el host es localhost.
//
// El estático usa el 5510 (no 5500) a propósito: el 5500 es el puerto del
// servidor de desarrollo y suele estar ocupado en local, lo que abortaba
// Playwright con "port is already used". El 5510 es exclusivo del E2E.
// El backend sigue en 3000 con reuseExistingServer:false → store local limpio
// (el E2E NUNCA debe tocar la base del desarrollo).
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './e2e',
  timeout: 60000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:5510',
    headless: true,
    screenshot: 'only-on-failure',
  },
  webServer: [
    {
      command: 'node backend/server.js',
      port: 3000,
      reuseExistingServer: false,
      env: {
        PORT: '3000',
        JWT_SECRET: 'e2e-test-secret-min-32-chars-1234567890',
        ADMIN_USERNAME: 'e2e_admin',
        ADMIN_PASSWORD: 'E2ePass123!',
        JWT_EXPIRES_IN: '1h',
        // El E2E corre en 5510 → su origen debe estar permitido.
        CORS_ORIGINS: 'http://localhost:5510,http://127.0.0.1:5510',
      },
    },
    {
      command: 'python3 -m http.server 5510',
      port: 5510,
      reuseExistingServer: false,
    },
  ],
});
