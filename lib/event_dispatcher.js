const { Map } = globalThis;

/**
 * Dispatch events.
 */
class EventDispatcher {
  #events = new Map();

  /**
   * Listen to an event.
   *
   * ```js
   * dispatcher.listen("event", (a, b, c) => {
   *   // ...
   * });
   * ```
   *
   * @param {string} event
   * @param {(...args: unknown[]) => void} listener
   */
  listen(event, listener) {
    if (this.#events.get(event)?.push(listener) === undefined) {
      this.#events.set(event, [listener]);
    }
  }

  /**
   * Deafen an event.
   *
   * ```js
   * const listener = (a, b, c) => {
   *   // ...
   * };
   * dispatcher.listen("event", listener);
   * dispatcher.deafen("event", listener);
   * ```
   *
   * @param {string} event
   * @param {(...args: unknown[]) => void} listener
   */
  deafen(event, listener) {
    const listeners = this.#events.get(event);
    if (listeners !== undefined) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
      if (listeners.length === 0) {
        this.#events.delete(event);
      }
    }
  }

  /**
   * Dispatch an event.
   *
   * ```js
   * dispatcher.dispatch("event", 1, 2, 3);
   * ```
   *
   * @param {string} event
   * @param {...unknown} args
   */
  dispatch(event, ...args) {
    const listeners = this.#events.get(event);
    if (listeners !== undefined) {
      for (let i = 0; i < listeners.length; i++) {
        listeners[i](...args);
      }
    }
  }

  /**
   * Receive an event.
   *
   * ```js
   * const answer = "dog";
   *
   * const items = await dispatcher.receive("event", {
   *   aborter: (abort) => setTimeout(() => abort(new Error("aborted")), 60_000),
   *   filter: (data) => data.input.toLowerCase() === answer,
   *   limit: 1,
   * });
   * ```
   *
   * @param {string} event
   * @param {ReceiveOptions} options
   */
  receive(event, options) {
    return new Promise((resolve, reject) => {
      const items = [];
      const listener = (...args) => {
        if (options.filter(...args)) {
          items.push(args);
          if (items.length === options.limit) {
            this.deafen(event, listener);
            resolve(items);
          }
        }
      };
      options.aborter((reason) => {
        this.deafen(event, listener);
        reject(reason);
      });
    });
  }

  /**
   * Stream an event.
   *
   * ```js
   * for await (const [a, b, c] of dispatcher.stream("event")) {
   *   // ...
   * }
   * ```
   *
   * @param {string} event
   */
  stream(event) {
    let listener;
    return new ReadableStream({
      cancel: () => this.deafen(event, listener),
      pull: (controller) => {
        listener = (...args) => controller.enqueue(args);
        this.listen(event, listener);
      },
    });
  }

  /**
   * Check if an event has listeners.
   *
   * ```js
   * if (dispatcher.listening("event")) {
   *   const [a, b, c] = await expensiveSerializeOperation(data);
   *   dispatcher.dispatch("event", a, b, c);
   * }
   * ```
   *
   * @param {string} event
   */
  listening(event) {
    return this.#events.has(event);
  }
}

export { EventDispatcher };

/**
 * @typedef ReceiveOptions
 * @prop {(abort?: (reason?: unknown) => void) => void} aborter
 * @prop {(...args: unknown[]) => boolean} filter
 * @prop {number} limit
 */
