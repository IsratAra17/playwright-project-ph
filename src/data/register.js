/**
 * @typedef {{
 *   name: string,
 *   email: string,
 *   phone: string,
 *   password: string,
 *   education: string,
 *   codingLevel: string,
 * }} RegisterData
 */

/** @returns {RegisterData} */
export const buildRegisterData = () => {
  const stamp = Date.now();

  return {
    name: `Auto User ${stamp}`,
    email: `auto.user.${stamp}@example.com`,
    phone: `17${String(stamp).slice(-8)}`,
    password: 'Test@123456',
    education: 'Bachelor’s/Master’s/Honors',
    codingLevel: 'Beginner',
  };
};
