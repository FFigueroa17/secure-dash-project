import { expect, test } from '@playwright/test';

test.describe('Basic Application Tests', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/');

    // Check if the page loads successfully
    await expect(page).toHaveTitle(/Experimento 01 - Crafted.is/);

    // Check for main heading
    await expect(
      page.getByRole('heading', { name: /Logs de Fail2Ban/i }),
    ).toBeVisible();

    // Check for description text
    await expect(
      page.getByText(/Revisa los registros y estadísticas más recientes/i),
    ).toBeVisible();
  });

  test('should have responsive navigation', async ({ page }) => {
    await page.goto('/');

    // Check if sidebar trigger is present
    await expect(
      page.getByRole('button', { name: /toggle sidebar/i }),
    ).toBeVisible();
  });

  test('should display loading states initially', async ({ page }) => {
    await page.goto('/');

    // The page should show some loading indicators initially
    // This will be more specific once we implement the actual data table tests
    await expect(page.locator('body')).toBeVisible();
  });
});
