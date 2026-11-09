// ADR-008, docs/Performance.md section 4: fixed steps from an accumulator, capped per frame, with interpolation.
import { describe, expect, it } from 'vitest';
import { advanceClock, createClock, interpolation } from '../../src/ui/game-loop';

const STEP = 1000 / 60;

describe('ADR-008 fixed-timestep game loop', () => {
  it('ADR-008: the first frame runs no step', () => {
    expect(advanceClock(createClock(), 1000, STEP, 5)).toBe(0);
  });

  it('ADR-008: a frame runs as many whole steps as its time holds and keeps the rest', () => {
    const clock = createClock();
    advanceClock(clock, 0, STEP, 5);
    expect(advanceClock(clock, STEP * 2.5, STEP, 5)).toBe(2);
    expect(interpolation(clock, STEP)).toBeCloseTo(0.5, 10);
    expect(advanceClock(clock, STEP * 3.6, STEP, 5)).toBe(1);
  });

  it('ADR-008: steps follow the time, not the frame rate', () => {
    for (const fps of [30, 60, 120]) {
      const clock = createClock();
      let steps = 0;
      for (let frame = 0; frame <= fps; frame++)
        steps += advanceClock(clock, (frame * 1000) / fps, STEP, 5);
      expect(steps).toBeGreaterThanOrEqual(59);
      expect(steps).toBeLessThanOrEqual(60);
    }
  });

  it('ADR-008: a slow frame runs at most the cap and drops the rest, so slow frames do not pile up', () => {
    const clock = createClock();
    advanceClock(clock, 0, STEP, 5);
    expect(advanceClock(clock, 1000, STEP, 5)).toBe(5);
    expect(clock.accumulator).toBe(0);
    expect(advanceClock(clock, 1000 + STEP * 1.5, STEP, 5)).toBe(1);
  });

  it('ADR-008: a clock going backwards runs no step', () => {
    const clock = createClock();
    advanceClock(clock, 1000, STEP, 5);
    expect(advanceClock(clock, 900, STEP, 5)).toBe(0);
  });
});
