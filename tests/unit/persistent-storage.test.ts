// UC-012 Install Game, step 3 and A5: asking the Browser to keep the save's storage persistent (C-018).
import { describe, expect, it, vi } from 'vitest';
import { requestPersistentStorage } from '../../src/save/persistent-storage';

describe('UC-012 persistent storage request', () => {
  it('UC-012 step 3: asks the Browser and reports a grant', async () => {
    const persist = vi.fn(() => Promise.resolve(true));
    expect(
      await requestPersistentStorage({ persisted: () => Promise.resolve(false), persist }),
    ).toBe('granted');
    expect(persist).toHaveBeenCalledOnce();
  });

  it('UC-012 step 3: does not ask again when the storage is persistent already', async () => {
    const persist = vi.fn(() => Promise.resolve(true));
    expect(
      await requestPersistentStorage({ persisted: () => Promise.resolve(true), persist }),
    ).toBe('granted');
    expect(persist).not.toHaveBeenCalled();
  });

  it('UC-012 A5: continues when the Browser refuses', async () => {
    expect(
      await requestPersistentStorage({
        persisted: () => Promise.resolve(false),
        persist: () => Promise.resolve(false),
      }),
    ).toBe('refused');
  });

  it('UC-012 A5: continues when the request fails', async () => {
    expect(await requestPersistentStorage({ persist: () => Promise.reject(new Error('x')) })).toBe(
      'refused',
    );
  });

  it('UC-012 A5: continues in a browser without the Storage API', async () => {
    expect(await requestPersistentStorage(undefined)).toBe('unsupported');
    expect(await requestPersistentStorage({})).toBe('unsupported');
  });
});
