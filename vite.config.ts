import { defineConfig } from 'vitest/config';
import { precachePlugin } from './scripts/precache-plugin.ts';
import { tuningPlugin } from './scripts/tuning-plugin.ts';

// ADR-006 build tooling, ADR-010 hosting: the game is served from the domain root.
// ADR-015: the precache list is written into our own service worker by a local plugin.
// ADR-006, C-024: the tuning data in data/ is checked against its schema before every build.
export default defineConfig({
  base: '/',
  plugins: [tuningPlugin(), precachePlugin()],
  build: {
    target: 'es2022',
  },
  test: {
    include: ['tests/**/*.test.ts'],
    exclude: ['tests/e2e/**'],
  },
});
