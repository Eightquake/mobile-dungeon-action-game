// ESLint flat config (ADR-006). The block for src/sim/ enforces the simulation rules of ADR-008.
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** Math functions the ECMAScript specification leaves implementation-approximated (ADR-008). */
const NON_EXACT_MATH = [
  'acos',
  'acosh',
  'asin',
  'asinh',
  'atan',
  'atanh',
  'atan2',
  'cbrt',
  'cos',
  'cosh',
  'exp',
  'expm1',
  'hypot',
  'log',
  'log1p',
  'log10',
  'log2',
  'pow',
  'sin',
  'sinh',
  'tan',
  'tanh',
];

/** Browser and wall-clock globals the pure simulation must not touch (ADR-008). */
const IMPURE_GLOBALS = [
  'window',
  'document',
  'navigator',
  'location',
  'performance',
  'Date',
  'fetch',
  'XMLHttpRequest',
  'WebSocket',
  'setTimeout',
  'setInterval',
  'requestAnimationFrame',
  'localStorage',
  'sessionStorage',
  'indexedDB',
  'crypto',
  'Intl',
  'console',
];

export default tseslint.config(
  {
    ignores: [
      'dist/',
      'coverage/',
      'playwright-report/',
      'test-results/',
      'tools/',
      'tests/fixtures/lint/',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.strict,
  {
    languageOptions: { globals: { ...globals.browser } },
  },
  {
    files: ['scripts/**', '*.config.{js,ts}', 'tests/**'],
    languageOptions: { globals: { ...globals.node } },
  },
  {
    files: ['src/sim/**/*.ts'],
    languageOptions: { globals: {} },
    rules: {
      'no-restricted-globals': [
        'error',
        ...IMPURE_GLOBALS.map((name) => ({
          name,
          message: 'The simulation is pure: no DOM, wall-clock, network, or I/O (ADR-008).',
        })),
      ],
      'no-restricted-properties': [
        'error',
        {
          object: 'Math',
          property: 'random',
          message: 'Use the seeded PRNG of the run (ADR-008).',
        },
        ...NON_EXACT_MATH.map((property) => ({
          object: 'Math',
          property,
          message: 'Not exact across engines; import it from src/sim/math (ADR-008).',
        })),
        ...['window', 'document', 'globalThis'].flatMap((object) =>
          ['performance', 'Date', 'crypto'].map((property) => ({
            object,
            property,
            message: 'The simulation is pure (ADR-008).',
          })),
        ),
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: "BinaryExpression[operator='**'], AssignmentExpression[operator='**=']",
          message:
            'The ** operator is not exact across engines; import pow from src/sim/math (ADR-008).',
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/render/**', '**/ui/**', '**/save/**', '**/sw/**', 'three', 'three/**'],
              message: 'src/sim/ imports nothing outside the simulation (ADR-008).',
            },
          ],
        },
      ],
    },
  },
  prettier,
);
