const _h = (a, kw, v, _q) => {
  if (v.substring(0, 2) === "--") {
    const z = v.indexOf("=");
    if (z === -1) {
      kw[v.substring(2)] = true;
    } else {
      kw[v.substring(2, z)] = v.substring(z + 1 + _q);
    }
    return;
  }
  if (v[0] === "-") {
    const z = v.indexOf("=");
    let l, p;
    if (z === -1) {
      l = v.length;
      p = true;
    } else {
      l = z;
      p = v.substring(z + 1 + _q);
    }
    while (l-- > 1) {
      kw[v[l]] = p;
    }
    return;
  }
  a.push(v.substring(_q));
};

/**
 * Parse a string into arguments.
 *
 * ```js
 * const { args, kwargs } = parse("hello world --hello=world");
 * // => { args: [ "hello", "world" ], kwargs: { hello: "world" } }
 * ```
 *
 * - Use `'`, `"`, or `` ` `` for long string input.
 * - Use `--` for keyword arguments.
 * - use `-` for many keyword arguments. `-XYZ` is equivalent to `--X --Y --Z`.
 * - use `--k=v` or `-k=v` to specify a value.
 *
 * @param {string} s
 */
const parse = (s) => {
  const args = [];
  const kwargs = {};

  let q, x;

  const len = s.length;
  for (let i = 0; i < len; i++) {
    const c = s[i];

    if (q !== undefined) {
      if (c === q) {
        _h(args, kwargs, s.substring(x, i), 1);
        q = undefined;
        x = undefined;
      }
      continue;
    }
    if (c === "'" || c === '"' || c === "`") {
      q = c;
      if (x === undefined) {
        x = i;
      }
      continue;
    }

    if (c === " " || c === "\n") {
      if (x !== undefined) {
        _h(args, kwargs, s.substring(x, i), 0);
        x = undefined;
      }
      continue;
    }

    if (x === undefined) {
      x = i;
    }
  }
  if (x !== undefined) {
    _h(args, kwargs, s.substring(x), 0);
  }

  return { args, kwargs };
};

/**
 * Parse a list into arguments.
 *
 * > Note: Your results may differ depending on your CLI.
 *
 * ```js
 * const { args, kwargs } = parseArgs(Deno.args);
 * ```
 *
 * @param {string[]} list
 */
const parseArgs = (list) => {
  const args = [];
  const kwargs = {};

  const len = list.length;
  for (let i = 0; i < len; i++) {
    _h(args, kwargs, list[i], false);
  }

  return { args, kwargs };
};

export { parse, parseArgs };
