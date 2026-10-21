import { test, expect } from '@playwright/test';

test.describe('SauceDemo - Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('TC-LOGIN-001: login with valid credentials', async ({ page }) => {
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.getByText('Products', { exact: true })).toBeVisible();
    await expect(page.locator('.inventory_item')).toHaveCount(6);
  });

  test('TC-LOGIN-002: show error for invalid credentials', async ({ page }) => {
    await page.getByPlaceholder('Username').fill('invalid_user');
    await page.getByPlaceholder('Password').fill('wrong_password');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.locator('[data-test="error"]')).toContainText(
      'Username and password do not match'
    );
    await expect(page).toHaveURL('/');
  });

  test('TC-LOGIN-003: show validation when username is empty', async ({ page }) => {
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.locator('[data-test="error"]')).toContainText(
      'Username is required'
    );
  });

  test('TC-LOGIN-004: show validation when password is empty', async ({ page }) => {
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.locator('[data-test="error"]')).toContainText(
      'Password is required'
    );
  });

  test('TC-LOGIN-005: locked out user cannot log in', async ({ page }) => {
    await page.getByPlaceholder('Username').fill('locked_out_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.locator('[data-test="error"]')).toContainText(
      'locked out'
    );
    await expect(page).toHaveURL('/');
  });
});
