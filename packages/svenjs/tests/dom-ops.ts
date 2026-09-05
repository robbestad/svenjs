export type DomOps = {
  insertBefore: number;
  removeChild: number;
  createElement: number;
  createTextNode: number;
  setAttribute: number;
  removeAttribute: number;
};

const empty = (): DomOps => ({
  insertBefore: 0,
  removeChild: 0,
  createElement: 0,
  createTextNode: 0,
  setAttribute: 0,
  removeAttribute: 0,
});

function patchMethod(object: object, name: string, impl: (original: Function, args: unknown[]) => unknown): () => void {
  const original = (object as Record<string, unknown>)[name];
  if (typeof original !== "function") return () => {};
  (object as Record<string, unknown>)[name] = function (this: unknown, ...args: unknown[]) {
    return impl(original.bind(this), args);
  };
  return () => {
    (object as Record<string, unknown>)[name] = original;
  };
}

/** Count DOM writes during `fn`. Restores patched methods even if `fn` throws. */
export function countDomOps(fn: () => void): DomOps {
  const ops = empty();
  const restore = [
    patchMethod(Node.prototype, "insertBefore", (orig, args) => {
      ops.insertBefore++;
      return orig(...args);
    }),
    patchMethod(Node.prototype, "removeChild", (orig, args) => {
      ops.removeChild++;
      return orig(...args);
    }),
    patchMethod(document, "createElement", (orig, args) => {
      ops.createElement++;
      return orig(...args);
    }),
    patchMethod(document, "createElementNS", (orig, args) => {
      ops.createElement++;
      return orig(...args);
    }),
    patchMethod(document, "createTextNode", (orig, args) => {
      ops.createTextNode++;
      return orig(...args);
    }),
    patchMethod(Element.prototype, "setAttribute", (orig, args) => {
      ops.setAttribute++;
      return orig(...args);
    }),
    patchMethod(Element.prototype, "removeAttribute", (orig, args) => {
      ops.removeAttribute++;
      return orig(...args);
    }),
  ];

  try {
    fn();
    return ops;
  } finally {
    for (const undo of restore) undo();
  }
}
