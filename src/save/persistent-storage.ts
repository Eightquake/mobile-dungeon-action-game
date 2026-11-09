/** What the Browser answered when asked to keep the save's storage persistent (UC-012 step 3, C-018, ADR-004). */
export type PersistentStorage = 'granted' | 'refused' | 'unsupported';

/** The part of the StorageManager the request needs, so tests can pass their own. */
export interface PersistableStorage {
  persisted?: () => Promise<boolean>;
  persist?: () => Promise<boolean>;
}

/**
 * Asks the Browser to keep the save's storage persistent. Never throws and never blocks the title screen: the caller
 * does not wait for the answer before the player can start (UC-013 BR-002).
 */
export async function requestPersistentStorage(
  storage: PersistableStorage | undefined,
): Promise<PersistentStorage> {
  if (!storage?.persist) return 'unsupported';
  try {
    if (await storage.persisted?.()) return 'granted';
    // UC-012 A5: a refusal is not an error; the game continues without persistent storage.
    return (await storage.persist()) ? 'granted' : 'refused';
  } catch {
    return 'refused';
  }
}
