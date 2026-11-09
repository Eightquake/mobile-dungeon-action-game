import { defineConfig } from 'vitest/config';

// ADR-006 build tooling, ADR-010 hosting: the game is served from the domain root.
export default defineConfig({
  base: '/',
  build: {
    target: 'es2022',
  },
  test: {
    include: ['tests/**/*.test.ts'],
    exclude: ['tests/e2e/**'],
  },
});
