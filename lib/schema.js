import { hasKeys } from "./generic.js";

const { isArray } = Array;
const { MAX_SAFE_INTEGER, MIN_SAFE_INTEGER, isInteger } = Number;

/**
 * Add an error.
 *
 * @param {Record<string, unknown>} errors
 * @param {string} type
 * @param {string} message
 * @param {string} key
 */
const error = (errors, type, message, key) => {
  if (errors[key] === undefined) {
    errors[key] = [];
  }
  const e = {
    type,
    message,
  };
  errors[key].push(e);
  return e;
};

/**
 * Test a schema.
 *
 * ```js
 * const User = object({
 *   username: string({ min: 1, max: 32 }),
 * });
 *
 * const errors = test(User, "User", { username: "Bob" });
 * ```
 *
 * @param {unknown} schema
 * @param {string} key
 * @param {unknown} value
 * @param {unknown} errors
 */
const test = (schema, key, value, errors = {}) => {
  if (value === undefined) {
    if (schema.required) {
      error(errors, "KEY_ERROR", "Key is required.", key);
    }
    return errors;
  }
  if (value === null && schema.nullable) {
    return errors;
  }

  switch (schema.type) {
    case "boolean": {
      if (typeof value !== "boolean") {
        error(errors, "TYPE_ERROR", "Not a boolean.", key);
      }
      break;
    }

    case "string": {
      if (typeof value !== "string") {
        error(errors, "TYPE_ERROR", "Not a string.", key);
        break;
      }
      if (schema.min > value.length || schema.max < value.length) {
        error(errors, "RANGE_ERROR", `String is out of range. (${schema.min}-${schema.max})`, key);
      }
      if (schema.pattern !== undefined && !schema.pattern.test(value)) {
        error(errors, "PATTERN_ERROR", "Pattern test failed.", key);
      }
      break;
    }

    case "number": {
      if (typeof value !== "number") {
        error(errors, "TYPE_ERROR", "Not a number.", key);
        break;
      }
      if (value !== value) {
        error(errors, "NUMBER_ERROR", "Literally not a number.", key);
        break;
      }
      if (schema.integer && !isInteger(value)) {
        error(errors, "NUMBER_ERROR", "Not an integer.", key);
      }
      if (schema.min > value || schema.max < value) {
        error(errors, "RANGE_ERROR", `Number is out of range. (${schema.min}-${schema.max})`, key);
      }
      break;
    }

    case "array": {
      if (!isArray(value)) {
        error(errors, "TYPE_ERROR", "Not an array.", key);
        break;
      }
      if (value.length < schema.min || value.length > schema.max) {
        error(errors, "RANGE_ERROR", `Array is out of range. (${schema.min}-${schema.max})`, key);
      }
      const e = {};
      for (let i = 0, j = value.length; i < j; i++) {
        test(schema.schema, `${i}`, value[i], e);
      }
      if (hasKeys(e)) {
        const oe = error(errors, "ARRAY_ERROR", "An error occurred.", key);
        oe.errors = e;
      }
      break;
    }

    case "object": {
      if (value === null || typeof value !== "object" || isArray(value)) {
        error(errors, "TYPE_ERROR", "Not an object.", key);
        break;
      }
      const e = {};
      for (const k in schema.properties) {
        test(schema.properties[k], k, value[k], e);
      }
      if (hasKeys(e)) {
        const oe = error(errors, "OBJECT_ERROR", "An error occurred.", key);
        oe.errors = e;
      }
      break;
    }

    case "value": {
      if (!schema.values.includes(value)) {
        error(errors, "VALUE_ERROR", "Value mismatch.", key);
      }
      break;
    }
  }
  return errors;
};

const array = (schema, options) => ({
  type: "array",
  schema,
  min: 0,
  max: MAX_SAFE_INTEGER,
  required: true,
  nullable: false,
  ...options,
});

const object = (properties, options) => ({
  type: "object",
  properties,
  required: true,
  nullable: false,
  ...options,
});

const string = (options) => ({
  type: "string",
  min: 0,
  max: MAX_SAFE_INTEGER,
  required: true,
  nullable: false,
  // pattern,
  ...options,
});

const number = (options) => ({
  type: "number",
  min: MIN_SAFE_INTEGER,
  max: MAX_SAFE_INTEGER,
  required: true,
  nullable: false,
  // integer,
  ...options,
});

const boolean = (options) => ({
  type: "boolean",
  required: false,
  nullable: false,
  ...options,
});

const value = (values, options) => ({
  type: "value",
  values,
  required: true,
  nullable: false,
  ...options,
});

export { array, boolean, error, number, object, string, test, value };
