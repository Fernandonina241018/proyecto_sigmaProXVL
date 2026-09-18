import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    include: ['tests/**/*.test.js'],
    setupFiles: ['tests/setup.js'],
    // OPT-8: coverage report-only (sin umbrales bloqueantes hasta medir base)
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary'],
      include: ['js/**/*.js'],
    },
  },
});
