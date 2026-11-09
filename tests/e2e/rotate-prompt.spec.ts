// UC-013 A4 and NFR-024: a phone held in portrait orientation sees a prompt to rotate it to landscape.
// Touch emulation in Playwright is reliable in Chromium only.
import { expect, test } from '@playwright/test';

test.skip(({ browserName }) => browserName !== 'chromium', 'Touch emulation runs in Chromium');

test('UC-013 A4: portrait shows the rotate prompt, landscape the title screen', async ({
  page,
}) => {
  await page.setViewportSize({ width: 412, height: 839 });
  await page.goto('/');
  const prompt = page.getByRole('alert');
  await expect(prompt).toBeVisible();
  await expect(prompt).toHaveText(/sideways/);

  // Steps 2 and 3: the player rotates the phone; the use case continues at step 4.
  await page.setViewportSize({ width: 839, height: 412 });
  await expect(prompt).toBeHidden();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('NFR-024: no rotate prompt in landscape', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('alert')).toBeHidden();
});
