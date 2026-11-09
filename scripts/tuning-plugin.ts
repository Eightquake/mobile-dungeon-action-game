// Build-time schema check of the tuning data (ADR-006, C-024): the build fails when data/ holds an invalid value.
import { readFileSync } from 'node:fs';
import type { Plugin } from 'vite';
import { checkTiers, checkTuning } from '../src/sim/tuning.ts';

const FILES = [
  ['data/tuning.json', checkTuning],
  ['data/tiers.json', checkTiers],
] as const;

export function tuningPlugin(): Plugin {
  return {
    name: 'tuning-data-schema',
    buildStart() {
      const errors = FILES.flatMap(([file, check]) =>
        check(JSON.parse(readFileSync(file, 'utf8'))).map((error) => `${file}: ${error}`),
      );
      if (errors.length > 0) this.error(`Invalid tuning data (C-024):\n${errors.join('\n')}`);
    },
  };
}
