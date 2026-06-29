import { test, expect } from '@playwright/test';
import { login } from './helpers';

test.describe('Inventory', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('shows 6 products', async ({ page }) => {
    await expect(page.locator('.inventory_item')).toHaveCount(6);
  });

  test('each product has name, description, price, and button', async ({ page }) => {
    const firstItem = page.locator('.inventory_item').first();

    await expect(firstItem.locator('.inventory_item_name')).toBeVisible();
    await expect(firstItem.locator('.inventory_item_desc')).toBeVisible();
    await expect(firstItem.locator('.inventory_item_price')).toBeVisible();
    await expect(firstItem.locator('button')).toBeVisible();
  });

  test('product image links to detail page', async ({ page }) => {
    await page.locator('.inventory_item').first().locator('.inventory_item_name').click();

    await expect(page).toHaveURL(/inventory-item\.html/);
    await expect(page.locator('.inventory_details_name')).toBeVisible();
  });

  test('sort by name Z to A', async ({ page }) => {
    await page.selectOption('.product_sort_container', 'za');

    const names = await page.locator('.inventory_item_name').allTextContents();
    expect(names).toEqual([...names].sort((a, b) => b.localeCompare(a)));
  });

  test('sort by price low to high', async ({ page }) => {
    await page.selectOption('.product_sort_container', 'lohi');

    const priceTexts = await page.locator('.inventory_item_price').allTextContents();
    const prices = priceTexts.map((p) => parseFloat(p.replace('$', '')));
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('sort by price high to low', async ({ page }) => {
    await page.selectOption('.product_sort_container', 'hilo');

    const priceTexts = await page.locator('.inventory_item_price').allTextContents();
    const prices = priceTexts.map((p) => parseFloat(p.replace('$', '')));
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });
});
