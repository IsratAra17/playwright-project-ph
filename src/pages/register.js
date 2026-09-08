import { expect } from '@playwright/test';

/**
 * @param {import('@playwright/test').Page} page
 */
export const registerLocators = (page) => ({
  heading: page.getByRole('heading', { name: 'Create your account' }),
  nameInput: page.locator('#name'),
  emailInput: page.locator('#email'),
  phoneInput: page.locator('input.PhoneInputInput'),
  passwordInput: page.locator('#password'),
  educationDropdown: page.locator('#registrationEducationLevel'),
  codingLevelDropdown: page.locator('#registrationCodingLevel'),
  termsCheckbox: page.locator('#agree'),
  submitButton: page.getByRole('button', { name: 'Create an account' }),
  recaptchaCheckbox: page
    .frameLocator('iframe[title*="reCAPTCHA"], iframe[src*="recaptcha/api2/anchor"]')
    .locator('#recaptcha-anchor'),
});

/**
 * @param {import('@playwright/test').Page} page
 */
export const openRegisterPage = async (page) => {
  await page.goto('/register');
  await expect(registerLocators(page).heading).toBeVisible();
};

/**
 * @param {import('@playwright/test').Page} page
 * @param {string} name
 */
export const fillName = (page, name) => registerLocators(page).nameInput.fill(name);

/**
 * @param {import('@playwright/test').Page} page
 * @param {string} email
 */
export const fillEmail = (page, email) => registerLocators(page).emailInput.fill(email);

/**
 * @param {import('@playwright/test').Page} page
 * @param {string} localNumber
 */
export const fillPhone = async (page, localNumber) => {
  const { phoneInput } = registerLocators(page);
  await phoneInput.click();
  await phoneInput.fill(`+880${localNumber}`);
};

/**
 * @param {import('@playwright/test').Page} page
 * @param {string} password
 */
export const fillPassword = (page, password) =>
  registerLocators(page).passwordInput.fill(password);

/**
 * @param {import('@playwright/test').Page} page
 * @param {string} optionLabel
 */
export const selectEducation = async (page, optionLabel) => {
  await registerLocators(page).educationDropdown.click();
  await page.getByRole('option', { name: optionLabel, exact: true }).click();
};

/**
 * @param {import('@playwright/test').Page} page
 * @param {string} optionLabel
 */
export const selectCodingLevel = async (page, optionLabel) => {
  await registerLocators(page).codingLevelDropdown.click();
  await page.getByRole('option', { name: optionLabel, exact: true }).click();
};

/**
 * @param {import('@playwright/test').Page} page
 */
export const acceptTerms = (page) => registerLocators(page).termsCheckbox.check();

/**
 * @param {import('@playwright/test').Page} page
 */
export const submitRegister = (page) => registerLocators(page).submitButton.click();

/**
 * @param {import('@playwright/test').Page} page
 * @param {import('../data/register.js').RegisterData} data
 */
export const fillRegisterForm = async (page, data) => {
  await fillName(page, data.name);
  await fillEmail(page, data.email);
  await fillPhone(page, data.phone);
  await fillPassword(page, data.password);
  await selectEducation(page, data.education);
  await selectCodingLevel(page, data.codingLevel);
  await acceptTerms(page);
};

/**
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<boolean>}
 */
export const tryClickVisibleRecaptcha = async (page) => {
  const { recaptchaCheckbox } = registerLocators(page);
  try {
    await recaptchaCheckbox.waitFor({ state: 'visible', timeout: 8_000 });
    await recaptchaCheckbox.click({ timeout: 5_000 });
    await page.waitForTimeout(2_000);
    return true;
  } catch {
    return false;
  }
};
