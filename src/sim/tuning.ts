// Tuning data (C-024): every combat and balance value lives in data/, never in code. This module holds the types of
// data/tuning.json and data/tiers.json and the schema check that runs at build time (scripts/tuning-plugin.ts) and in
// tests (ADR-006).

export interface Tuning {
  simulation: {
    /** Fixed simulation steps per second (ADR-008). */
    steps_per_second: number;
    /** Most simulation steps one displayed frame may run, so a slow frame cannot cause slower frames. */
    max_steps_per_frame: number;
  };
  hero: {
    /** Hero speed at full stick deflection, in floor units per second. */
    speed: number;
    /** Item definition ids every run starts with (UC-001 BR-003). */
    starting_items: string[];
  };
  stick: {
    /** Drag distance in CSS pixels that gives full deflection. */
    radius_px: number;
    /** Share of the radius below which the stick counts as released. */
    dead_zone: number;
    /** Steps per axis between centre and full deflection; the simulation input is quantized to them (ADR-008). */
    levels: number;
  };
  camera: {
    fov_deg: number;
    /** Angle between the floor and the line of sight (ADR-007). */
    tilt_deg: number;
    /** Distance from the camera to the hero, in floor units. */
    distance: number;
    /** Device-pixel-ratio cap of the canvas (docs/Performance.md section 6). */
    max_pixel_ratio: number;
  };
}

/** One step of the challenge ladder (entity model LADDER_TIER) with its floor. */
export interface TierData {
  id: number;
  enemy_strength: number;
  floor: { half_width: number; half_depth: number };
  entrance: { x: number; z: number };
}

type Check = (value: unknown, path: string, errors: string[]) => void;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function num(min: number, max: number, integer = false): Check {
  return (value, path, errors) => {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      errors.push(`${path}: expected a number`);
    } else if (integer && !Number.isInteger(value)) {
      errors.push(`${path}: expected an integer`);
    } else if (value < min || value > max) {
      errors.push(`${path}: ${value} is outside ${min} to ${max}`);
    }
  };
}

function obj(fields: Record<string, Check>): Check {
  return (value, path, errors) => {
    if (!isRecord(value)) {
      errors.push(`${path}: expected an object`);
      return;
    }
    for (const [key, check] of Object.entries(fields)) check(value[key], `${path}.${key}`, errors);
    for (const key of Object.keys(value)) {
      if (!(key in fields)) errors.push(`${path}.${key}: unknown field`);
    }
  };
}

function list(item: Check, minLength = 0): Check {
  return (value, path, errors) => {
    if (!Array.isArray(value)) {
      errors.push(`${path}: expected a list`);
      return;
    }
    if (value.length < minLength) errors.push(`${path}: needs at least ${minLength} entries`);
    value.forEach((entry, i) => item(entry, `${path}[${i}]`, errors));
  };
}

const text: Check = (value, path, errors) => {
  if (typeof value !== 'string' || value === '')
    errors.push(`${path}: expected a non-empty string`);
};

const tuningSchema = obj({
  simulation: obj({ steps_per_second: num(1, 240, true), max_steps_per_frame: num(1, 30, true) }),
  hero: obj({ speed: num(0.1, 100), starting_items: list(text) }),
  stick: obj({ radius_px: num(16, 400), dead_zone: num(0, 0.9), levels: num(1, 127, true) }),
  camera: obj({
    fov_deg: num(5, 120),
    tilt_deg: num(10, 90),
    distance: num(1, 500),
    max_pixel_ratio: num(1, 4),
  }),
});

const tierSchema = obj({
  id: num(1, 9999, true),
  // Entity model LADDER_TIER.enemy_strength: Min 1, Max 9999.
  enemy_strength: num(1, 9999),
  floor: obj({ half_width: num(1, 1000), half_depth: num(1, 1000) }),
  entrance: obj({ x: num(-1000, 1000), z: num(-1000, 1000) }),
});

/** The schema errors of data/tuning.json; empty when it is valid. */
export function checkTuning(value: unknown): string[] {
  const errors: string[] = [];
  tuningSchema(value, 'tuning', errors);
  return errors;
}

/** The schema errors of data/tiers.json; empty when it is valid. */
export function checkTiers(value: unknown): string[] {
  const errors: string[] = [];
  list(tierSchema, 1)(value, 'tiers', errors);
  if (errors.length > 0 || !Array.isArray(value)) return errors;
  (value as TierData[]).forEach((tier, i) => {
    // The ladder is numbered from 1 without gaps (entity model LADDER_TIER.id).
    if (tier.id !== i + 1) errors.push(`tiers[${i}].id: expected ${i + 1}`);
    const inside =
      Math.abs(tier.entrance.x) <= tier.floor.half_width &&
      Math.abs(tier.entrance.z) <= tier.floor.half_depth;
    if (!inside) errors.push(`tiers[${i}].entrance: outside the floor`);
  });
  return errors;
}
