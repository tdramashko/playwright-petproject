import { test, expect } from '@playwright/test';
import { login } from './helpers';

test.describe('Checkout', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.locator('.inventory_item').first().locator('button').click();
    await page.locator('.shopping_cart_link').click();
    await page.click('[data-test="checkout"]');
  });

  test('checkout step one shows information form', async ({ page }) => {
    await expect(page.locator('[data-test="firstName"]')).toBeVisible();
    await expect(page.locator('[data-test="lastName"]')).toBeVisible();
    await expect(page.locator('[data-test="postalCode"]')).toBeVisible();
  });

  test('missing first name shows error', async ({ page }) => {
    await page.click('[data-test="continue"]');

    await expect(page.locator('[data-test="error"]')).toContainText('First Name is required');
  });

  test('missing last name shows error', async ({ page }) => {
    await page.fill('[data-test="firstName"]', 'Jane');
    await page.click('[data-test="continue"]');

    await expect(page.locator('[data-test="error"]')).toContainText('Last Name is required');
  });

  test('missing postal code shows error', async ({ page }) => {
    await page.fill('[data-test="firstName"]', 'Jane');
    await page.fill('[data-test="lastName"]', 'Doe');
    await page.click('[data-test="continue"]');

    await expect(page.locator('[data-test="error"]')).toContainText('Postal Code is required');
  });

  test('step two shows order summary with item and total', async ({ page }) => {
    await page.fill('[data-test="firstName"]', 'Jane');
    await page.fill('[data-test="lastName"]', 'Doe');
    await page.fill('[data-test="postalCode"]', '12345');
    await page.click('[data-test="continue"]');

    await expect(page).toHaveURL(/checkout-step-two/);
    await expect(page.locator('.cart_item')).toHaveCount(1);
    await expect(page.locator('.summary_subtotal_label')).toBeVisible();
    await expect(page.locator('.summary_tax_label')).toBeVisible();
    await expect(page.locator('.summary_total_label')).toBeVisible();
  });

  test('complete checkout shows confirmation', async ({ page }) => {
    await page.fill('[data-test="firstName"]', 'Jane');
    await page.fill('[data-test="lastName"]', 'Doe');
    await page.fill('[data-test="postalCode"]', '12345');
    await page.click('[data-test="continue"]');
    await page.click('[data-test="finish"]');

    await expect(page).toHaveURL(/checkout-complete/);
    await expect(page.locator('[data-test="complete-header"]')).toHaveText(
      'Thank you for your order!'
    );
  });

  test('back home button after order returns to inventory', async ({ page }) => {
    await page.fill('[data-test="firstName"]', 'Jane');
    await page.fill('[data-test="lastName"]', 'Doe');
    await page.fill('[data-test="postalCode"]', '12345');
    await page.click('[data-test="continue"]');
    await page.click('[data-test="finish"]');
    await page.click('[data-test="back-to-products"]');

    await expect(page).toHaveURL(/inventory\.html/);
  });
});
