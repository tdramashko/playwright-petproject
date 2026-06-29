import { test, expect } from '@playwright/test';

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('login form is visible', async ({ page }) => {
    await expect(page.locator('#user-name')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('#login-button')).toBeVisible();
  });

  test('valid credentials redirect to inventory', async ({ page }) => {
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');

    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('wrong password shows error', async ({ page }) => {
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'wrong_password');
    await page.click('#login-button');

    await expect(page.locator('[data-test="error"]')).toContainText(
      'Username and password do not match'
    );
  });

  test('locked out user shows error', async ({ page }) => {
    await page.fill('#user-name', 'locked_out_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');

    await expect(page.locator('[data-test="error"]')).toContainText(
      'Sorry, this user has been locked out'
    );
  });

  test('empty form shows username required error', async ({ page }) => {
    await page.click('#login-button');

    await expect(page.locator('[data-test="error"]')).toContainText('Username is required');
  });

  test('missing password shows password required error', async ({ page }) => {
    await page.fill('#user-name', 'standard_user');
    await page.click('#login-button');

    await expect(page.locator('[data-test="error"]')).toContainText('Password is required');
  });

  test('Products header is visible after login', async ({ page }) => {
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');

    await expect(page.locator('.header_secondary_container .title')).toHaveText('Products');
  });
});
