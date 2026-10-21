# Web Automation Test - Playwright #1
SauceDemo [[https://www.saucedemo.com/](https://www.saucedemo.com/)] is a dummy e-commerce site

# SauceDemo Playwright Automation

End-to-end automation for [https://www.saucedemo.com] using Playwright Test + TypeScript.

## Test Scope

### Login
- TC-LOGIN-001: Valid login
- TC-LOGIN-002: Invalid credentials
- TC-LOGIN-003: Empty username
- TC-LOGIN-004: Empty password
- TC-LOGIN-005: Locked out user account

### Inventory, Cart, Checkout, and Navigation
- TC-INV-001: Ensure 6 products are displayed
- TC-INV-002: Sort price from low to high
- TC-CART-001: Add product to cart and verify in cart
- TC-CART-002: Remove product from cart
- TC-CHECKOUT-001: Validate First Name is required
- TC-CHECKOUT-002: Successful checkout
- TC-NAV-001: Logout
- TC-NAV-002: Open product detail page and navigate back to inventory

## SauceDemo Test Accounts

- Standard user: `standard_user` / `secret_sauce`
- Locked user: `locked_out_user` / `secret_sauce`

---