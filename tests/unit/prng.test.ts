// ADR-008: the seeded random streams of the simulation.
import { describe, expect, it } from 'vitest';
import { createStream, createStreams, nextFloat, nextUint32 } from '../../src/sim/prng';

const draw = (seed: number, index: number, n: number) => {
  const s = createStream(seed, index);
  return Array.from({ length: n }, () => nextUint32(s));
};

describe('ADR-008 seeded randomness', () => {
  it('ADR-008: the same seed gives the same numbers', () => {
    expect(draw(42, 0, 100)).toEqual(draw(42, 0, 100));
  });

  it('ADR-008: the numbers are frozen, so a change to the generator shows up here', () => {
    expect(draw(6006, 0, 4)).toMatchInlineSnapshot(`
      [
        1259377250,
        757247482,
        4034841277,
        1069108989,
      ]
    `);
  });

  it('ADR-008: other seeds and other streams give other numbers', () => {
    expect(draw(42, 0, 10)).not.toEqual(draw(43, 0, 10));
    expect(draw(42, 0, 10)).not.toEqual(draw(42, 1, 10));
  });

  it('ADR-008: drawing from one stream never shifts another', () => {
    const a = createStreams(5);
    const b = createStreams(5);
    for (let i = 0; i < 50; i++) nextUint32(a.loot);
    expect(nextUint32(a.spawn)).toBe(nextUint32(b.spawn));
    expect(a.combat).toEqual(b.combat);
  });

  it('ADR-008: numbers are unsigned 32-bit integers and floats lie in [0, 1)', () => {
    const s = createStream(1, 0);
    for (let i = 0; i < 10_000; i++) {
      const u = nextUint32(s);
      expect(Number.isInteger(u) && u >= 0 && u <= 0xffffffff).toBe(true);
      const f = nextFloat(s);
      expect(f >= 0 && f < 1).toBe(true);
    }
  });

  it('ADR-008: the floats spread evenly', () => {
    const s = createStream(9, 2);
    const buckets = new Array<number>(10).fill(0);
    for (let i = 0; i < 100_000; i++) {
      const i = Math.floor(nextFloat(s) * 10);
      buckets[i] = (buckets[i] ?? 0) + 1;
    }
    for (const count of buckets) expect(Math.abs(count - 10_000)).toBeLessThan(500);
  });
});
