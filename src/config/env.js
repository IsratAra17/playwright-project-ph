import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/** Load `.env` into process.env when keys are not already set. */
const loadEnvFile = () => {
  const envPath = resolve(process.cwd(), '.env');
  if (!existsSync(envPath)) return;

  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;

    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (process.env[key] === undefined) process.env[key] = value;
  }
};

loadEnvFile();

/** @typedef {{ username: string, password: string }} HttpCredentials */

/**
 * @returns {{
 *   baseURL: string,
 *   apiURL: string,
 *   timeout: number,
 *   headless: boolean,
 *   useSystemChrome: boolean,
 *   httpCredentials: HttpCredentials,
 * }}
 */
export const getEnv = () => ({
  baseURL: process.env.BASE_URL ?? 'https://phero-test.jsdude.com',
  apiURL: process.env.API_URL ?? 'https://api-phero-test.jsdude.com',
  timeout: Number(process.env.TEST_TIMEOUT ?? 30_000),
  headless: process.env.HEADLESS !== 'false',
  useSystemChrome: process.env.USE_SYSTEM_CHROME !== 'false',
  httpCredentials: {
    username: process.env.BASIC_AUTH_USER ?? 'neptune',
    password: process.env.BASIC_AUTH_PASS ?? 'PHneptune',
  },
});
