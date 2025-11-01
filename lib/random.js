// References:
// https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle

// https://github.com/python/cpython/blob/3.12/Lib/random.py

const { floor, random } = Math;

/**
 * Randomly pick an element and return it.
 *
 * @param {unknown[]} list
 */
export const choice = (list) => list[floor(random() * list.length)];

/**
 * Generate a pseudorandom number between `max - 1` and `min`.
 *
 * @param {number} max
 * @param {number} [min]
 */
export const rng = (max, min = 0) => floor(random() * (max - min) + min);

/**
 * Create a shuffled list using [the Fisher–Yates shuffle algorithm](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle).
 *
 * @param {unknown[]} list
 */
export const shuffle = (list) => {
  const len = list.length;
  const a = new Array(len);
  for (let i = 0; i < len; i++) {
    const j = floor(random() * (i + 1));
    if (j !== i) {
      a[i] = a[j];
    }
    a[j] = list[i];
  }
  return a;
};

/**
 * Create a shuffled list using [the Sattolo algorithm](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle).
 *
 * ```js
 * shuffleSattolo([1, 2, 3, 4, 5])[0] !== 1;
 * ```
 *
 * @param {unknown[]} list
 */
export const shuffleSattolo = (list) => {
  const len = list.length;
  const a = new Array(len);
  for (let i = 0; i < len; i++) {
    const j = floor(random() * i);
    if (j !== i) {
      a[i] = a[j];
    }
    a[j] = list[i];
  }
  return a;
};
