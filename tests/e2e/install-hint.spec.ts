// UC-012 Install Game: the install hint on the title screen, in every engine (ADR-009). The emulated devices are an
// Android phone (Chromium), an iPhone (WebKit), and desktop Firefox, which cannot install web apps.
import { expect, test } from '@playwright/test';

const expected: Record<string, RegExp> = {
  chromium: /browser menu/,
  webkit: /Share button/,
  firefox: /cannot add the game/,
};

test('UC-012 step 4 and A2: the title screen explains how to add the game on this device', async ({
  page,
  browserName,
}) => {
  await page.goto('/');
  const hint = page.getByRole('complementary');
  await expect(hint).toBeVisible();
  await expect(hint).toContainText(expected[browserName] ?? /./);
});

test('UC-012 A1: the player dismisses the hint', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Not now' }).click();
  await expect(page.getByRole('complementary')).toHaveCount(0);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('UC-012 A3: no hint when the game runs from the home screen icon', async ({ page }) => {
  await page.addInitScript(() => {
    const original = window.matchMedia.bind(window);
    window.matchMedia = (query: string) =>
      query === '(display-mode: fullscreen)'
        ? ({ ...original(query), matches: true, media: query } as MediaQueryList)
        : original(query);
  });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('complementary')).toHaveCount(0);
});
