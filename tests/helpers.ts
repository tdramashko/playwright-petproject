import { Page } from '@playwright/test';

export async function login(
  page: Page,
  username = 'standard_user',
  password = 'secret_sauce'
): Promise<void> {
  await page.goto('/');
  await page.fill('#user-name', username);
  await page.fill('#password', password);
  await page.click('#login-button');
}
