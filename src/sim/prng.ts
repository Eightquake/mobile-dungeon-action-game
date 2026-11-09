// Seeded randomness of the simulation (ADR-008): sfc32 on 32-bit integer operations, one stream per purpose, each
// derived from the run seed, so that drawing more numbers in one stream never shifts another.

/** The state of one sfc32 stream: plain data, so it is part of the run snapshot. */
export interface RandomStream {
  a: number;
  b: number;
  c: number;
  d: number;
}

/** The streams of a run, in a fixed order. New streams are added at the end. */
export const STREAMS = ['spawn', 'loot', 'combat', 'behavior'] as const;
export type StreamName = (typeof STREAMS)[number];
export type RandomStreams = Record<StreamName, RandomStream>;

/** splitmix32: spreads a seed over all bits, used to seed the sfc32 state words. */
function splitmix32(x: number): number {
  let z = (x + 0x9e3779b9) | 0;
  z = Math.imul(z ^ (z >>> 16), 0x21f0aaad);
  z = Math.imul(z ^ (z >>> 15), 0x735a2d97);
  return (z ^ (z >>> 15)) >>> 0;
}

/** Next unsigned 32-bit number of the stream; advances the stream in place. */
export function nextUint32(s: RandomStream): number {
  const t = (((s.a + s.b) | 0) + s.d) | 0;
  s.d = (s.d + 1) | 0;
  s.a = s.b ^ (s.b >>> 9);
  s.b = (s.c + (s.c << 3)) | 0;
  s.c = (s.c << 21) | (s.c >>> 11);
  s.c = (s.c + t) | 0;
  return t >>> 0;
}

/** Next number in [0, 1) with 32 bits of precision. Division by a power of two is exact. */
export function nextFloat(s: RandomStream): number {
  return nextUint32(s) / 4294967296;
}

/** A stream seeded from the run seed and the stream's index; the same inputs always give the same stream. */
export function createStream(seed: number, index: number): RandomStream {
  const base = splitmix32((seed >>> 0) ^ Math.imul(index + 1, 0x85ebca6b));
  const s: RandomStream = {
    a: splitmix32(base),
    b: splitmix32(base + 1),
    c: splitmix32(base + 2),
    d: 1,
  };
  // Warm up, so streams with close seeds no longer look alike.
  for (let i = 0; i < 12; i++) nextUint32(s);
  return s;
}

export function createStreams(seed: number): RandomStreams {
  return {
    spawn: createStream(seed, STREAMS.indexOf('spawn')),
    loot: createStream(seed, STREAMS.indexOf('loot')),
    combat: createStream(seed, STREAMS.indexOf('combat')),
    behavior: createStream(seed, STREAMS.indexOf('behavior')),
  };
}
