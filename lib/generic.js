/**
 * Check if an object has keys.
 *
 * @param {unknown} object
 */
const hasKeys = (object) => {
  for (const _ in object) {
    return true;
  }
  return false;
};

/**
 * Sleep for `delay` milliseconds.
 *
 * @param {number} [delay]
 */
const sleep = (delay) => new Promise((r) => setTimeout(r, delay));

export { hasKeys, sleep };
