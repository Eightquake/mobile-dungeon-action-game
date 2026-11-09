// Walking skeleton project setup (#9): the production build loads and shows the title screen in every engine.
import { expect, test } from '@playwright/test';

test('the title screen shows the game title', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('[WORKING TITLE]');
  expect(errors).toEqual([]);
});
