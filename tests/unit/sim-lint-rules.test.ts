// ADR-008: the simulation lint rules must catch every source of non-determinism they name.
import { ESLint } from 'eslint';
import { describe, expect, it } from 'vitest';

const eslint = new ESLint();

async function simErrors(code: string): Promise<string[]> {
  const [result] = await eslint.lintText(code, { filePath: 'src/sim/lint-probe.ts' });
  return (result?.messages ?? []).filter((m) => m.severity === 2).map((m) => m.ruleId ?? 'parse');
}

describe('ADR-008 simulation lint rules', () => {
  it.each([
    ['Math.random', 'export const r = Math.random();', 'no-restricted-properties'],
    ['Math.sin', 'export const s = Math.sin(1);', 'no-restricted-properties'],
    ['Math.pow', 'export const p = Math.pow(2, 3);', 'no-restricted-properties'],
    ['the ** operator', 'export const p = 2 ** 3;', 'no-restricted-syntax'],
    ['Date', 'export const t = Date.now();', 'no-restricted-globals'],
    ['performance', 'export const t = performance.now();', 'no-restricted-globals'],
    [
      'globalThis.performance',
      'export const t = globalThis.performance;',
      'no-restricted-properties',
    ],
    ['the DOM', 'export const d = document.body;', 'no-restricted-globals'],
    ['a timer', 'setTimeout(() => undefined, 1);', 'no-restricted-globals'],
    [
      'the renderer',
      "import * as THREE from 'three';\nexport const t = THREE;",
      'no-restricted-imports',
    ],
    ['the UI', "import { x } from '../ui/hud';\nexport const y = x;", 'no-restricted-imports'],
  ])('forbids %s', async (_name, code, rule) => {
    expect(await simErrors(code)).toContain(rule);
  });

  it('allows the exact Math functions', async () => {
    const code =
      'export const v = Math.sqrt(2) + Math.floor(1.5) + Math.abs(-1) + Math.min(1, 2) + Math.imul(3, 4);';
    expect(await simErrors(code)).toEqual([]);
  });

  it('does not apply outside src/sim/', async () => {
    const [result] = await eslint.lintText('export const r = Math.random() + Date.now();', {
      filePath: 'src/ui/lint-probe.ts',
    });
    expect(result?.errorCount).toBe(0);
  });
});
