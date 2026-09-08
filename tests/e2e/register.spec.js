import { test, expect } from '@playwright/test';
import { buildRegisterData } from '../../src/data/register.js';
import {
  isCaptchaBlocked,
  readJsonBody,
  waitForRegisterApi,
} from '../../src/flows/register.js';
import {
  fillRegisterForm,
  openRegisterPage,
  registerLocators,
  submitRegister,
  tryClickVisibleRecaptcha,
} from '../../src/pages/register.js';

test.use({
  launchOptions: { slowMo: 250 },
});

test.describe('Register flow @e2e', () => {
  test('fills form and submits registration', async ({ page }, testInfo) => {
    test.setTimeout(120_000);

    const data = buildRegisterData();
    console.log('Registering with:', data);

    await openRegisterPage(page);
    await fillRegisterForm(page, data);

    const el = registerLocators(page);
    await expect(el.nameInput).toHaveValue(data.name);
    await expect(el.emailInput).toHaveValue(data.email);
    await expect(el.passwordInput).toHaveValue(data.password);
    await expect(el.termsCheckbox).toBeChecked();
    await expect(el.educationDropdown).toContainText(data.education);
    await expect(el.codingLevelDropdown).toContainText(data.codingLevel);

    const responsePromise = waitForRegisterApi(page);
    await submitRegister(page);
    let response = await responsePromise;
    let body = await readJsonBody(response);

    if (response.status() === 403 && body.requireV2) {
      await tryClickVisibleRecaptcha(page);
      const retryPromise = waitForRegisterApi(page);
      await submitRegister(page);
      response = await retryPromise;
      body = await readJsonBody(response);
    }

    console.log('Register API status:', response.status(), body);

    if (isCaptchaBlocked(body, response.status())) {
      testInfo.annotations.push({
        type: 'issue',
        description: `reCAPTCHA blocked registration: ${JSON.stringify(body)}`,
      });
    }

    expect(
      response.ok() || body.success === true,
      `Registration API failed: status=${response.status()} body=${JSON.stringify(body)}`,
    ).toBeTruthy();
  });
});
