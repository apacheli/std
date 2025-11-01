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
 * Remove flags.
 *
 * ```js
 * const PermissionFlags = {
 *   SEND_MESSAGES: 1 << 0,
 *   // ...
 * };
 *
 * const oldValue = flags(
 *   ["SEND_MESSAGES"],
 *   PermissionFlags,
 * );
 *
 * const newValue = flagsRemove(
 *   ["SEND_MESSAGES"],
 *   PermissionFlags,
 *   oldValue,
 * );
 * ```
 *
 * @param {string[]} list
 * @param {Record<string, number | bigint>} table
 * @param {number | bigint} x
 */
const flagsRemove = (list, table, x = 0) => {
  for (let i = 0, j = list.length; i < j; i++) {
    x &= ~table[list[i]];
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

/**
 * Show enabled flags.
 *
 * ```js
 * const PermissionFlags = {
 *   SEND_MESSAGES: 1 << 0,
 *   // ...
 * };
 *
 * const result = flagsTable(PermissionFlags, 1 << 0);
 *
 * console.log(result.enabled.join(", "));
 * console.log(result.disabled.join(", "));
 * ```
 *
 * @param {Record<string, number | bigint>} table
 * @param {string | bigint} x
 */
const flagsList = (table, x = 0) => {
  const enabled = [], disabled = [];
  for (const key in table) {
    const f = table[key];
    if ((x & f) === f) {
      enabled.push(key);
    } else {
      disabled.push(key);
    }
  }
  return { enabled, disabled };
};

export { flags, flagsAll, flagsList, flagsRemove, flagsTable };
