// TC-006 Install and Play Offline, steps 1 to 4 (UC-012, UC-013). Steps 5 and 6 (start a run offline, the hero moves)
// arrive with UC-001 and UC-002 in walking skeleton PR 3 (#9).
// ADR-009: service worker tests run in Chromium; the manual iOS check covers WebKit.
import { expect, test } from '@playwright/test';

test.skip(
  ({ browserName }) => browserName !== 'chromium',
  'Service worker tests run in Chromium (ADR-009)',
);

test('TC-006 steps 1-4: the game installs its files on the first visit and launches offline', async ({
  page,
  context,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  // Validation 2: record whether the game asks for persistent storage.
  await page.addInitScript(() => {
    const original = StorageManager.prototype.persist;
    StorageManager.prototype.persist = function persist(this: StorageManager) {
      (window as Window & { persistAsked?: boolean }).persistAsked = true;
      return original.call(this);
    };
  });

  // Step 1: open the link; the title screen and the install hint appear (UC-012 steps 1 and 4).
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('[WORKING TITLE]');
  await expect(page.getByRole('complementary')).toBeVisible();

  // Step 2: every file of the precache list is stored (UC-012 step 2). The 5 MB limit is the CI budget job.
  const missing = await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    const sw = await (await fetch('/sw.js')).text();
    const list = /\/\*PRECACHE\*\/(.*?)\/\*END PRECACHE\*\//s.exec(sw);
    if (!list?.[1]) return ['no precache list'];
    const urls = (JSON.parse(list[1]) as { urls: string[] }).urls;
    const stored = await Promise.all(
      urls.map(async (url) => ((await caches.match(url)) ? '' : url)),
    );
    return stored.filter(Boolean);
  });
  expect(missing).toEqual([]);
  expect(
    await page.evaluate(() => (window as Window & { persistAsked?: boolean }).persistAsked),
  ).toBe(true);

  // Steps 3 and 4: cut the network and launch again; the title screen comes from the stored files (UC-013 step 2).
  const failed: string[] = [];
  page.on('requestfailed', (request) => failed.push(request.url()));
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('[WORKING TITLE]');
  await expect(page.getByRole('complementary')).toBeVisible();

  // Validation 1: no network error from step 3 on.
  expect(failed).toEqual([]);
  expect(errors).toEqual([]);
});
