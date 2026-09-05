function skipFreeze(o: object) {
  return ArrayBuffer.isView(o) || o instanceof Date || o instanceof Map || o instanceof Set;
}

export function deepFreeze<T>(o: T): T {
  if (o === null || typeof o !== "object" || Object.isFrozen(o)) return o;
  if (skipFreeze(o)) return o;
  Object.freeze(o);
  for (const key of Object.getOwnPropertyNames(o)) {
    deepFreeze((o as Record<string, unknown>)[key]);
  }
  return o;
}

export function freezeState<T>(state: T): T {
  if (!import.meta.env.DEV) return state;
  let cloned: T;
  try {
    cloned = structuredClone(state);
  } catch (cause) {
    throw new TypeError("SvenJS: state must be structured-cloneable", { cause });
  }
  return deepFreeze(cloned);
}
