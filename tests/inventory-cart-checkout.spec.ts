import { test, expect } from '@playwright/test';

async function login(page: import('@playwright/test').Page) {
  await page.goto('/');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/inventory\.html/);
}

test.describe('SauceDemo - Inventory, cart, checkout, navigation', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('TC-INV-001: inventory shows six products', async ({ page }) => {
    await expect(page.locator('.inventory_item')).toHaveCount(6);
    await expect(page.getByText('Products', { exact: true })).toBeVisible();
  });

  test('TC-INV-002: sort products by price low to high', async ({ page }) => {
    await page.locator('[data-test="product-sort-container"]').selectOption('lohi');

    const prices = await page.locator('.inventory_item_price').allTextContents();
    const numericPrices = prices.map(price => Number(price.replace('$', '')));
    expect(numericPrices).toEqual([...numericPrices].sort((a, b) => a - b));
  });

  test('TC-CART-001: add product and verify it in cart', async ({ page }) => {
    const firstProduct = page.locator('.inventory_item').filter({
      hasText: 'Sauce Labs Backpack',
    });
    await firstProduct.getByRole('button', { name: 'Add to cart' }).click();

    await expect(firstProduct.getByRole('button', { name: 'Remove' })).toBeVisible();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL(/cart\.html/);
    await expect(page.getByText('Sauce Labs Backpack', { exact: true })).toBeVisible();
    await expect(page.locator('.cart_item')).toHaveCount(1);
  });

  test('TC-CART-002: remove product from cart', async ({ page }) => {
    const firstProduct = page.locator('.inventory_item').filter({
      hasText: 'Sauce Labs Backpack',
    });
    await firstProduct.getByRole('button', { name: 'Add to cart' }).click();
    await page.locator('.shopping_cart_link').click();

    await page.getByRole('button', { name: 'Remove' }).click();
    await expect(page.locator('.cart_item')).toHaveCount(0);
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
  });

  test('TC-CHECKOUT-001: checkout requires first name', async ({ page }) => {
    await page.locator('.inventory_item').filter({
      hasText: 'Sauce Labs Backpack',
    }).getByRole('button', { name: 'Add to cart' }).click();

    await page.locator('.shopping_cart_link').click();
    await page.getByRole('button', { name: 'Checkout' }).click();
    await expect(page).toHaveURL(/checkout-step-one\.html/);

    await page.getByPlaceholder('Last Name').fill('Tester');
    await page.getByPlaceholder('Postal Code').fill('12345');
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page.locator('[data-test="error"]')).toContainText(
      'First Name is required'
    );
  });

  test('TC-CHECKOUT-002: complete purchase successfully', async ({ page }) => {
    await page.locator('.inventory_item').filter({
      hasText: 'Sauce Labs Backpack',
    }).getByRole('button', { name: 'Add to cart' }).click();

    await page.locator('.shopping_cart_link').click();
    await page.getByRole('button', { name: 'Checkout' }).click();

    await page.getByPlaceholder('First Name').fill('Alwi');
    await page.getByPlaceholder('Last Name').fill('Tester');
    await page.getByPlaceholder('Zip/Postal Code').fill('12345');
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page).toHaveURL(/checkout-step-two\.html/);
    await expect(page.locator('.cart_item')).toHaveCount(1);
    await expect(page.locator('.summary_subtotal_label')).toContainText('29.99');

    await page.getByRole('button', { name: 'Finish' }).click();
    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(page.getByText('Thank you for your order!', { exact: true })).toBeVisible();
  });

test('TC-NAV-001: logout returns to login page', async ({ page }) => {
  // Buka menu hamburger
  await page.locator('#react-burger-menu-btn').click();

  // Pastikan menu terbuka dan Logout terlihat
  await expect(page.locator('#logout_sidebar_link')).toBeVisible();

  // Klik Logout
  await page.locator('#logout_sidebar_link').click();

  // Pastikan kembali ke halaman login
  await expect(page).toHaveURL(/.*\/$/);
  await expect(page.locator('#login-button')).toBeVisible();
});

  test('TC-NAV-002: product details page can be opened and returned from', async ({ page }) => {
    await page.getByText('Sauce Labs Backpack', { exact: true }).click();
    await expect(page).toHaveURL(/inventory-item\.html/);
    await expect(page.getByText('Sauce Labs Backpack', { exact: true })).toBeVisible();

    await page.getByRole('button', { name: 'Back to products' }).click();
    await expect(page).toHaveURL(/inventory\.html/);
  });
});
