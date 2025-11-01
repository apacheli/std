/**
 * Combine flags from a table.
 *
 * ```js
 * const PermissionFlags = {
 *   SEND_MESSAGES: 1 << 0,
 *   // ...
 * };
 *
 * const value = flags(
 *   ["SEND_MESSAGES"],
 *   PermissionFlags,
 * );
 * ```
 *
 * @param {string[]} list
 * @param {Record<string, number | bigint>} table
 * @param {number | bigint} x
 */
const flags = (list, table, x = 0) => {
  for (let i = 0, j = list.length; i < j; i++) {
    x |= table[list[i]];
  }
  return x;
};

/**
 * Combine flags from a table.
 *
 * ```js
 * const PermissionFlags = {
 *   SEND_MESSAGES: 1 << 0,
 *   // ...
 * };
 *
 * const value = flagsAll(PermissionFlags);
 * ```
 *
 * @param {Record<string, number | bigint>} table
 * @param {number | bigint} x
 */
const flagsAll = (table, x = 0) => {
  for (const key in table) {
    x |= table[key];
  }
  return x;
};

/**
 * Show which flags are enabled.
 *
 * ```js
 * const PermissionFlags = {
 *   SEND_MESSAGES: 1 << 0,
 *   // ...
 * };
 *
 * const result = flagsTable(PermissionFlags, 1 << 0);
 *
 * if (result.SEND_MESSAGES) {
 *   // ...
 * }
 * ```
 *
 * @param {Record<string, number | bigint>} table
 * @param {number | bigint} x
 */
const flagsTable = (table, x = 0) => {
  const t = {};
  for (const key in table) {
    const f = table[key];
    t[key] = (x & f) === f;
  }
  return t;
};

export { flags, flagsAll, flagsTable };
