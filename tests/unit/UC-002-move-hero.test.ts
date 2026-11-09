// UC-002 Clear Pack step 2: the hero moves in the stick's direction at a speed that follows the stick's deflection.
// The stick is quantized to whole levels per axis (ADR-008).
import { describe, expect, it } from 'vitest';
import { createRun, step, TIERS, TUNING, type StepInput } from '../../src/sim';
import { quantizeStick } from '../../src/ui/stick';

const firstTier = TIERS[0];
if (!firstTier) throw new Error('no tier 1');
const tier = firstTier;
const L = TUNING.stick.levels;
const perStep = TUNING.hero.speed / TUNING.simulation.steps_per_second;

function runWith(input: StepInput, steps: number) {
  const run = createRun({ seed: 7, tierId: 1, highestCleared: 0, codexPowers: [] }, TUNING, TIERS);
  for (let i = 0; i < steps; i++) step(run, input, TUNING, tier);
  return run;
}

describe('UC-002 step 2: moving the hero', () => {
  it('UC-002 step 2: full deflection to the right moves the hero right at full speed', () => {
    const run = runWith({ moveX: L, moveZ: 0 }, 30);
    expect(run.hero.x - tier.entrance.x).toBeCloseTo(perStep * 30, 10);
    expect(run.hero.z).toBe(tier.entrance.z);
    expect(run.step).toBe(30);
  });

  it('UC-002 step 2: half deflection moves the hero at half speed', () => {
    const full = runWith({ moveX: 0, moveZ: -L }, 10);
    const half = runWith({ moveX: 0, moveZ: -L / 2 }, 10);
    expect(tier.entrance.z - half.hero.z).toBeCloseTo((tier.entrance.z - full.hero.z) / 2, 10);
  });

  it('UC-002 step 2: a diagonal moves no faster than a straight line', () => {
    const run = runWith({ moveX: L, moveZ: -L }, 1);
    const moved = Math.hypot(run.hero.x - tier.entrance.x, run.hero.z - tier.entrance.z);
    expect(moved).toBeCloseTo(perStep, 10);
  });

  it('UC-002 step 2: a released stick leaves the hero standing', () => {
    const run = runWith({ moveX: 0, moveZ: 0 }, 60);
    expect(run.hero).toMatchObject({ x: tier.entrance.x, z: tier.entrance.z });
  });

  it('UC-002 step 2: the hero stays on the floor', () => {
    const run = runWith({ moveX: L, moveZ: L }, 60 * 60);
    expect(run.hero.x).toBe(tier.floor.half_width);
    expect(run.hero.z).toBe(tier.floor.half_depth);
  });

  it('UC-002 step 2: the previous position is kept for interpolated rendering', () => {
    const run = runWith({ moveX: L, moveZ: 0 }, 2);
    expect(run.hero.x - run.hero.prevX).toBeCloseTo(perStep, 10);
  });

  it('ADR-008: the same seed and inputs always give the same run', () => {
    const inputs: StepInput[] = Array.from({ length: 500 }, (_, i) => ({
      moveX: ((i * 7) % (2 * L + 1)) - L,
      moveZ: ((i * 13) % (2 * L + 1)) - L,
    }));
    const play = () => {
      const run = createRun(
        { seed: 99, tierId: 1, highestCleared: 0, codexPowers: [] },
        TUNING,
        TIERS,
      );
      for (const input of inputs) step(run, input, TUNING, tier);
      return run;
    };
    expect(play()).toEqual(play());
  });
});

describe('UC-002 step 2: the virtual stick', () => {
  const out: StepInput = { moveX: 0, moveZ: 0 };
  const r = TUNING.stick.radius_px;

  it('UC-002 step 2: a drag to the radius is full deflection', () => {
    quantizeStick(r, 0, TUNING.stick, out);
    expect(out).toEqual({ moveX: L, moveZ: 0 });
  });

  it('UC-002 step 2: a drag beyond the radius stays at full deflection', () => {
    quantizeStick(0, -3 * r, TUNING.stick, out);
    expect(out).toEqual({ moveX: 0, moveZ: -L });
  });

  it('UC-002 step 2: a drag to half the radius is half deflection', () => {
    quantizeStick(r / 2, 0, TUNING.stick, out);
    expect(out).toEqual({ moveX: L / 2, moveZ: 0 });
  });

  it('UC-002 step 2: screen down moves the hero toward the camera (+z)', () => {
    quantizeStick(0, r, TUNING.stick, out);
    expect(out.moveZ).toBe(L);
  });

  it('UC-002 step 2: a drag inside the dead zone counts as released', () => {
    quantizeStick(TUNING.stick.dead_zone * r * 0.9, 0, TUNING.stick, out);
    expect(out).toEqual({ moveX: 0, moveZ: 0 });
  });

  it('ADR-008: the deflection is whole levels within [-levels, levels]', () => {
    for (let angle = 0; angle < 360; angle += 7) {
      const a = (angle * Math.PI) / 180;
      quantizeStick(Math.cos(a) * r * 1.5, Math.sin(a) * r * 1.5, TUNING.stick, out);
      expect(Number.isInteger(out.moveX) && Number.isInteger(out.moveZ)).toBe(true);
      expect(Math.abs(out.moveX)).toBeLessThanOrEqual(L);
      expect(Math.abs(out.moveZ)).toBeLessThanOrEqual(L);
      expect(Object.is(out.moveX, -0) || Object.is(out.moveZ, -0)).toBe(false);
    }
  });
});
