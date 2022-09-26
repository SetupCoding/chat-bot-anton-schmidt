import { test, expect } from '@playwright/test';

test('should navigate to the Home page', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await expect(page.locator('h1')).toContainText('Versicherungs-Helfer');
});
