/**
 * Check if an object has keys.
 *
 * @param {object} object
 */
const hasKeys = (object) => {
  for (const _ in object) {
    return true;
  }
  return false;
};

/**
 * Get the key count of an object.
 *
 * @param {object} object
 */
const keyCount = (object) => {
  let i = 0;
  for (const _ in object) {
    i++;
  }
  return i;
};

/**
 * Sleep for `delay` milliseconds.
 *
 * @param {number} delay
 */
const sleep = (delay) => new Promise((r) => setTimeout(r, delay));

/**
 * Partition a list.
 *
 * ```js
 * const numbers = [1, 2, 3, 4, 5, 6];
 *
 * const [even, odd] = partition(numbers, (n) => n % 2 === 0);
 * ```
 *
 * @param {unknown[]} list
 * @param {(item: unknown, index: number) => boolean} func
 */
const partition = (list, func) => {
  const x = [], y = [];
  for (let i = 0, j = list.length; i < j; i++) {
    const item = list[i];
    if (func(item, i)) {
      x.push(item);
    } else {
      y.push(item);
    }
  }
  return [x, y];
};

export { hasKeys, keyCount, partition, sleep };
