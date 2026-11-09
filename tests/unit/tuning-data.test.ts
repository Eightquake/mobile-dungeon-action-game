// C-024, ADR-006: the tuning data in data/ is valid, and the schema check catches invalid values.
import { describe, expect, it } from 'vitest';
import tiers from '../../data/tiers.json';
import tuning from '../../data/tuning.json';
import { checkTiers, checkTuning } from '../../src/sim/tuning';

const firstTier = tiers[0];
if (!firstTier) throw new Error('no tier 1');

describe('C-024 tuning data', () => {
  it('C-024: data/tuning.json passes the schema', () => {
    expect(checkTuning(tuning)).toEqual([]);
  });

  it('C-024: data/tiers.json passes the schema', () => {
    expect(checkTiers(tiers)).toEqual([]);
  });

  it('C-024: a missing, wrong, out-of-range, or unknown value is reported', () => {
    const bad = structuredClone(tuning);
    const hero: Partial<typeof bad.hero> = bad.hero;
    delete hero.speed;
    bad.stick.levels = 2.5;
    bad.camera.tilt_deg = 0;
    Object.assign(bad.simulation, { extra: 1 });
    expect(checkTuning(bad).sort()).toEqual([
      'tuning.camera.tilt_deg: 0 is outside 10 to 90',
      'tuning.hero.speed: expected a number',
      'tuning.simulation.extra: unknown field',
      'tuning.stick.levels: expected an integer',
    ]);
  });

  it('C-024: tiers are numbered from 1 without gaps, and the entrance lies on the floor', () => {
    const tier = firstTier;
    expect(checkTiers([])).toEqual(['tiers: needs at least 1 entries']);
    expect(checkTiers([{ ...tier, id: 2 }])).toEqual(['tiers[0].id: expected 1']);
    expect(checkTiers([{ ...tier, entrance: { x: 0, z: tier.floor.half_depth + 1 } }])).toEqual([
      'tiers[0].entrance: outside the floor',
    ]);
  });

  it('entity model LADDER_TIER: enemy strength lies in 1 to 9999', () => {
    expect(checkTiers([{ ...firstTier, enemy_strength: 0.5 }])).toEqual([
      'tiers[0].enemy_strength: 0.5 is outside 1 to 9999',
    ]);
  });
});
