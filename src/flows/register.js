import {
  fillRegisterForm,
  openRegisterPage,
  submitRegister,
  tryClickVisibleRecaptcha,
} from '../pages/register.js';

/**
 * @param {import('@playwright/test').Page} page
 * @param {import('../data/register.js').RegisterData} data
 */
export const registerUser = async (page, data) => {
  await openRegisterPage(page);
  await fillRegisterForm(page, data);
  await submitRegister(page);
  await tryClickVisibleRecaptcha(page);
};

/**
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<import('@playwright/test').Response>}
 */
export const waitForRegisterApi = (page) =>
  page.waitForResponse(
    (res) => res.url().includes('/api/user/register') && res.request().method() === 'POST',
    { timeout: 60_000 },
  );

/**
 * @param {import('@playwright/test').Response} response
 * @returns {Promise<Record<string, unknown>>}
 */
export const readJsonBody = async (response) => {
  try {
    return await response.json();
  } catch {
    return {};
  }
};

/**
 * @param {Record<string, unknown>} body
 * @param {number} status
 */
export const isCaptchaBlocked = (body, status) =>
  status === 400 ||
  status === 403 ||
  /captcha|network issue/i.test(String(body.msg ?? ''));
