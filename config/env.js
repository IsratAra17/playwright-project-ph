/**
 * Environment configuration for SQA test runs.
 * Override via process.env (CI or local .env).
 */
const env = {
  baseURL: process.env.BASE_URL ?? 'http://localhost:3000',
  apiURL: process.env.API_URL ?? 'http://localhost:3000/api',
  timeout: Number(process.env.TEST_TIMEOUT ?? 30_000),
  headless: process.env.HEADLESS !== 'false',
};

module.exports = { env };
