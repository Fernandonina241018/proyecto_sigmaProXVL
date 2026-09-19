// LOTE E — E2E mínimo del flujo crítico (login → bandeja → firmar).
// Servidores efímeros: backend store local + frontend estático.
// El frontend apunta a http://localhost:3000 cuando el host es localhost.
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './e2e',
  timeout: 60000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:5500',
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
      },
    },
    {
      command: 'python3 -m http.server 5500',
      port: 5500,
      reuseExistingServer: false,
    },
  ],
});
