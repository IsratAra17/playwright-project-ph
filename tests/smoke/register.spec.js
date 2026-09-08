import { test, expect } from '@playwright/test';
import { openRegisterPage, registerLocators } from '../../src/pages/register.js';

test.describe('Register page @smoke', () => {
  test('opens register page after basic auth', async ({ page }) => {
    await openRegisterPage(page);

    const { heading, submitButton } = registerLocators(page);

    await expect(page).toHaveURL(/\/register/);
    await expect(heading).toHaveText('Create your account');
    await expect(submitButton).toBeVisible();
  });
});
