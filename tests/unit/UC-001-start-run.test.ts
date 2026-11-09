// UC-001 Start Run, the walking skeleton slice: main success scenario steps 4 and 5 data, A2, BR-002, BR-003, BR-005.
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createRun, step, TIERS, tierWithoutChoice, TUNING, unlockedTiers } from '../../src/sim';

const start = { seed: 1234, tierId: 1, highestCleared: 0, codexPowers: [] };

describe('UC-001 Start Run', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('UC-001 step 4: creates a run for the tier with its seed, the starting items, and the codex powers', () => {
    const run = createRun({ ...start, codexPowers: ['power-a'] }, TUNING, TIERS);
    expect(run.tierId).toBe(1);
    expect(run.seed).toBe(1234);
    expect(run.step).toBe(0);
    expect(run.startingItems).toEqual(TUNING.hero.starting_items);
    expect(run.codexPowers).toEqual(['power-a']);
  });

  it('UC-001 step 4: places the hero at the entrance of the tier', () => {
    const run = createRun(start, TUNING, TIERS);
    const entrance = TIERS[0]?.entrance;
    expect(run.hero).toMatchObject({ x: entrance?.x, z: entrance?.z });
    expect(run.hero).toMatchObject({ prevX: entrance?.x, prevZ: entrance?.z });
  });

  it('UC-001 step 4: the seed is stored as an unsigned 32-bit number', () => {
    expect(createRun({ ...start, seed: -1 }, TUNING, TIERS).seed).toBe(0xffffffff);
  });

  it('UC-001 step 4: the run is plain data, so the snapshot is a direct copy (ADR-008)', () => {
    const run = createRun(start, TUNING, TIERS);
    expect(structuredClone(run)).toEqual(run);
    expect(JSON.parse(JSON.stringify(run))).toEqual(run);
  });

  it('UC-001 A2: a player who has not cleared a tier skips the choice and starts at tier 1', () => {
    expect(tierWithoutChoice(0, 10)).toBe(1);
  });

  it('UC-001 A2: a player who cleared a tier gets the choice', () => {
    expect(tierWithoutChoice(1, 10)).toBeNull();
  });

  it('UC-001 BR-002: tier 1, the cleared tiers, and the tier directly above the highest cleared tier are unlocked', () => {
    expect(unlockedTiers(0, 10)).toEqual([1]);
    expect(unlockedTiers(3, 10)).toEqual([1, 2, 3, 4]);
    expect(unlockedTiers(10, 10)).toEqual(Array.from({ length: 10 }, (_, i) => i + 1));
  });

  it('UC-001 BR-002: a run cannot start at a locked tier', () => {
    const first = TIERS[0];
    if (!first) throw new Error('no tier 1');
    const tiers = [first, { ...first, id: 2 }, { ...first, id: 3 }];
    expect(() => createRun({ ...start, tierId: 3, highestCleared: 1 }, TUNING, tiers)).toThrow(
      RangeError,
    );
    expect(createRun({ ...start, tierId: 2, highestCleared: 1 }, TUNING, tiers).tierId).toBe(2);
  });

  it('UC-001 BR-003: every run of a tier starts with the same items; only seed and codex powers differ', () => {
    const a = createRun({ ...start, seed: 1 }, TUNING, TIERS);
    const b = createRun({ ...start, seed: 2, codexPowers: ['power-b'] }, TUNING, TIERS);
    expect(a.startingItems).toEqual(b.startingItems);
    expect(a.hero).toEqual(b.hero);
    expect(a.random).not.toEqual(b.random);
  });

  it('UC-001 BR-003: a run gets its own copy of the starting items', () => {
    const run = createRun(start, TUNING, TIERS);
    run.startingItems.push('changed');
    expect(TUNING.hero.starting_items).not.toContain('changed');
  });

  it('UC-001 BR-005: starting a run and playing it never touches the network', () => {
    const fetch = vi.fn(() => Promise.reject(new Error('offline')));
    vi.stubGlobal('fetch', fetch);
    const tier = TIERS[0];
    if (!tier) throw new Error('no tier 1');
    const run = createRun(start, TUNING, TIERS);
    for (let i = 0; i < 600; i++) step(run, { moveX: 16, moveZ: -8 }, TUNING, tier);
    expect(fetch).not.toHaveBeenCalled();
  });
});
