# @apacheli/std

> [!NOTE]
> This software is experimental.

A collection of JavaScript modules written for optimization.

## Development

Feature requests are rejected, but bug fixes are welcome.

Use `deno lint` and `deno fmt` for code styling.

## Installing

### Deno

Import from GitHub:

```js
import * as color from "https://github.com/apacheli/std/raw/master/lib/color.js";

console.log(color.rgb(0xff0000));
```

### Bun

```sh
bun add https://github.com/apacheli/std
```

```js
import { color } from "@apacheli/std";

console.log(color.rgb(0xff0000));
```

## Modules

- [`ansi`](lib/ansi.js)
- [`args_parser`](lib/args_parser.js)
  - `args_parser.parse(s)`
  - `args_parser.parseArgs(list)`
- [`color`](lib/color.js)
  - `color.rgb(n)`
  - `color.rgbToCmyk(r, g, b)`
  - `color.cmykToRgb(c, m, y, k)`
  - `color.rgbToHls(r, g, b)`
  - `color.hlsToRgb(h, l, s)`
  - `color.rgbToHsv(r, g, b)`
  - `color.hsvToRgb(h, s, v)`
- [`flags`](lib/flags.js)
  - `flags.flags(list, table, x)`
  - `flags.flagsAll(table, x)`
  - `flags.flagsTable(table, x)`
- [`event_dispatcher`](lib/event_dispatcher.js)
  - `EventDispatcher`
    - `EventDispatcher.listen(event, listener)`
    - `EventDispatcher.deafen(event, listener)`
    - `EventDispatcher.dispatch(event, ...args)`
    - `EventDispatcher.receive(event)`
    - `EventDispatcher.stream(event)`
    - `EventDispatcher.listening(event)`
- [`random`](lib/random.js)
  - `random.choice(list)`
  - `random.rng(max, min)`
  - `random.shuffle(list)`
  - `random.shuffleSattolo(list)`
- [`schema`](lib/schema.js)
  - `schema.array(schema, options)`
  - `schema.object(properties, options)`
  - `schema.string(options)`
  - `schema.number(options)`
  - `schema.boolean(options)`
  - `schema.value(values, options)`
  - `schema.test(schema, key, value)`

## Licenses

This project is licensed under [the Apache License](LICENSE.txt).

- [Python License](https://github.com/python/cpython/blob/main/LICENSE)
