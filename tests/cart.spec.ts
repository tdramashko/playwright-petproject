import { test, expect } from '@playwright/test';
import { login } from './helpers';

test.describe('Cart', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('cart badge shows 1 after adding one item', async ({ page }) => {
    await page.locator('.inventory_item').first().locator('button').click();

    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('cart badge updates when multiple items are added', async ({ page }) => {
    await page.locator('.inventory_item').nth(0).locator('button').click();
    await page.locator('.inventory_item').nth(1).locator('button').click();

    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
  });

  test('button changes to Remove after adding item', async ({ page }) => {
    const firstItemBtn = page.locator('.inventory_item').first().locator('button');
    await firstItemBtn.click();

    await expect(firstItemBtn).toHaveText('Remove');
  });

  test('cart contains the added item', async ({ page }) => {
    const itemName = await page
      .locator('.inventory_item')
      .first()
      .locator('.inventory_item_name')
      .textContent();

    await page.locator('.inventory_item').first().locator('button').click();
    await page.locator('.shopping_cart_link').click();

    await expect(page.locator('.cart_item .inventory_item_name')).toHaveText(itemName!);
  });

  test('removing item from cart clears it', async ({ page }) => {
    await page.locator('.inventory_item').first().locator('button').click();
    await page.locator('.shopping_cart_link').click();

    await expect(page.locator('.cart_item')).toHaveCount(1);

    await page.getByRole('button', { name: 'Remove' }).click();

    await expect(page.locator('.cart_item')).toHaveCount(0);
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
  });

  test('continue shopping returns to inventory', async ({ page }) => {
    await page.locator('.shopping_cart_link').click();
    await page.getByRole('button', { name: 'Continue Shopping' }).click();

    await expect(page).toHaveURL(/inventory\.html/);
  });
});
