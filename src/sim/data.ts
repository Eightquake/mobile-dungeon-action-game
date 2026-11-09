// The tuning data of data/ (C-024). The type annotations check its shape at compile time; the build checks its values
// with the schema (scripts/tuning-plugin.ts).
import tiersJson from '../../data/tiers.json';
import tuningJson from '../../data/tuning.json';
import type { TierData, Tuning } from './tuning';

export const TUNING: Tuning = tuningJson;
export const TIERS: readonly TierData[] = tiersJson;
