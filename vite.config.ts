import { defineConfig } from 'vitest/config';
import { precachePlugin } from './scripts/precache-plugin.ts';

// ADR-006 build tooling, ADR-010 hosting: the game is served from the domain root.
// ADR-015: the precache list is written into our own service worker by a local plugin.
export default defineConfig({
  base: '/',
  plugins: [precachePlugin()],
  build: {
    target: 'es2022',
  },
  test: {
    include: ['tests/**/*.test.ts'],
    exclude: ['tests/e2e/**'],
  },
});
