// TC-006 Install and Play Offline (UC-012, UC-013, UC-001, UC-002 step 2). The postcondition's stored run arrives with
// saves in walking skeleton PR 4 (#9), and so does the seed override of the test data: moving the hero does not
// depend on the seed.
// ADR-009: service worker tests run in Chromium; the manual iOS check covers WebKit.
import { expect, test } from '@playwright/test';

test.skip(
  ({ browserName }) => browserName !== 'chromium',
  'Service worker tests run in Chromium (ADR-009)',
);

test('TC-006: the game installs its files on the first visit, launches offline, and plays offline', async ({
  page,
  context,
}) => {
  // Step 5 plays for 30 seconds.
  test.setTimeout(90_000);
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

  // Step 5: start a run offline and hold the stick to the right for 30 seconds (UC-001 A2, steps 4 and 5).
  await page.getByRole('button', { name: 'Play' }).click();
  const canvas = page.locator('canvas.run-canvas');
  await expect(canvas).toBeVisible();
  const zone = page.getByLabel('Movement stick');
  await expect(zone).toBeVisible();
  const before = await canvas.screenshot();
  // Nothing moves while the stick is released, so a changed picture below comes from the stick.
  await page.waitForTimeout(500);
  expect((await canvas.screenshot()).equals(before)).toBe(true);
  const box = await zone.boundingBox();
  if (!box) throw new Error('no stick zone');
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + 40, y, { steps: 4 });
  await page.mouse.move(x + 200, y, { steps: 4 });

  // Step 6: the hero moves (UC-002 step 2); the camera follows the hero, so the view changes.
  await expect(async () => {
    expect((await canvas.screenshot()).equals(before)).toBe(false);
  }).toPass({ timeout: 5_000 });
  await page.waitForTimeout(30_000);
  await page.mouse.up();
  await expect(canvas).toBeVisible();

  // Validation 1: no network error from step 3 on.
  expect(failed).toEqual([]);
  expect(errors).toEqual([]);
});
