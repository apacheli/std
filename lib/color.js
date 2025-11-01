// References:
// https://en.wikipedia.org/wiki/CMYK_color_model
// https://en.wikipedia.org/wiki/HSL_and_HSV
// https://en.wikipedia.org/wiki/RGB_color_model

// https://github.com/python/cpython/blob/3.11/Lib/colorsys.py

const { abs, max, min, floor } = Math;

const _h = (r, g, b, mx, d) => {
  if (r === mx) {
    return (g - b) / d + (g < b ? 6 : 0);
  }
  if (g === mx) {
    return (b - r) / d + 2;
  }
  return (r - g) / d + 4;
};

const _v = (m1, m2, h) => {
  if (h < 0) {
    h += 1;
  } else if (h > 1) {
    h -= 1;
  }
  if (h < 1 / 6) {
    return m1 + (m2 - m1) * 6 * h;
  }
  if (h < .5) {
    return m2;
  }
  if (h < 2 / 3) {
    return m1 + (m2 - m1) * (2 / 3 - h) * 6;
  }
  return m1;
};

/**
 * Convert decimal to RGB.
 *
 * ```js
 * const [r, g, b] = rgb(0xff0000);
 * console.log(`${r}, ${g}, ${b}`);
 * ```
 *
 * Convert to coordinates before using the other functions.
 *
 * ```js
 * const rc = r / 255;
 * const gc = g / 255;
 * const bc = b / 255;
 * ```
 *
 * @param {number} n
 * @returns {[r: number, g: number, b: number]}
 */
const rgb = (n) => [n >> 16, n >> 8 & 255, n & 255];

/**
 * Convert RGB coordinates to CMYK coordinates.
 *
 * ```js
 * const [c, m, y, k] = rgbToCmyk(.15, .35, .55);
 * console.log(`${c * 100}%, ${m * 100}%, ${y * 100}%, ${k * 100}%`);
 * ```
 *
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @returns {[c: number, m: number, y: number, k: number]}
 */
const rgbToCmyk = (r, g, b) => {
  const k = max(r, g, b);
  if (k === 0) {
    return [0, 0, 0, 1];
  }
  const c = 1 - r / k;
  const m = 1 - g / k;
  const y = 1 - b / k;
  return [c, m, y, 1 - k];
};

/**
 * Convert CMYK coordinates to RGB coordinates.
 *
 * ```js
 * const [r, g, b] = cmykToRgb(.2, .3, .4, .5);
 * console.log(`${r * 255}, ${g * 255}, ${b * 255}`);
 * ```
 *
 * @param {number} c
 * @param {number} m
 * @param {number} y
 * @param {number} k
 * @returns {[r: number, g: number, b: number]}
 */
const cmykToRgb = (c, m, y, k) => {
  if (k === 1) {
    return [0, 0, 0];
  }
  const x = 1 - k;
  return [x - c * x, x - m * x, x - y * x];
};

/**
 * Convert RGB coordinates to HLS coordinates.
 *
 * ```js
 * const [h, l, s] = rgbToHls(.6, .7, .8);
 * console.log(`${h * 360}\u00B0, ${l * 100}%, ${s * 100}%`);
 * ```
 *
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @returns {[h: number, l: number, s: number]}
 */
const rgbToHls = (r, g, b) => {
  const mx = max(r, g, b);
  const mn = min(r, g, b);
  const c = mx + mn;
  const l = c / 2;
  if (mn === mx) {
    return [0, l, 0];
  }
  const d = mx - mn;
  const s = d / (1 - abs(2 * l - 1));
  const h = _h(r, g, b, mx, d) / 6;
  return [h, l, s];
};

/**
 * Convert HLS coordinates to RGB coordinates.
 *
 * ```js
 * const [r, g, b] = hlsToRgb(.45, .6, .75);
 * console.log(`${r * 255}, ${g * 255}, ${b * 255}`);
 * ```
 *
 * @param {number} h
 * @param {number} l
 * @param {number} s
 * @returns {[r: number, g: number, b: number]}
 */
const hlsToRgb = (h, l, s) => {
  if (s === 0) {
    return [l, l, l];
  }
  const m2 = l <= .5 ? l * (1 + s) : l + s - l * s;
  const m1 = 2 * l - m2;
  const r = _v(m1, m2, h + 1 / 3);
  const g = _v(m1, m2, h);
  const b = _v(m1, m2, h - 1 / 3);
  return [r, g, b];
};

/**
 * Convert RGB coordinates to HSV coordinates.
 *
 * ```js
 * const [h, s, v] = rgbToHsv(.6, .7, .8);
 * console.log(`${h * 360}\u00B0, ${s * 100}%, ${v * 100}%`);
 * ```
 *
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @returns {[h: number, s: number, v: number]}
 */
const rgbToHsv = (r, g, b) => {
  const mx = max(r, g, b);
  const mn = min(r, g, b);
  if (mn === mx) {
    return [0, 0, mx];
  }
  const d = mx - mn;
  const s = d / mx;
  const h = _h(r, g, b, mx, d) / 6;
  return [h, s, mx];
};

/**
 * Convert HSV coordinates to RGB coordinates.
 *
 * ```js
 * const [r, g, b] = hsvToRgb(.45, .6, .75);
 * console.log(`${r * 255}, ${g * 255}, ${b * 255}`);
 * ```
 *
 * @param {number} h
 * @param {number} s
 * @param {number} v
 * @returns {[r: number, g: number, b: number]}
 */
const hsvToRgb = (h, s, v) => {
  if (s === 0) {
    return [v, v, v];
  }
  const i = floor(h * 6);
  const f = h * 6 - 1;
  const p = v * (1 - s);
  const q = v * (1 - s * f);
  const t = v * (1 - s * (1 - f));
  if (i === 0) {
    return [v, t, p];
  }
  if (i === 1) {
    return [q, v, p];
  }
  if (i === 2) {
    return [p, v, t];
  }
  if (i === 3) {
    return [p, q, v];
  }
  if (i === 4) {
    return [t, p, v];
  }
  if (i === 5) {
    return [v, p, q];
  }
};

export { cmykToRgb, hlsToRgb, hsvToRgb, rgb, rgbToCmyk, rgbToHls, rgbToHsv };
