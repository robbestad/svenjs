export function deepFreeze<T>(o: T): T {
  if (o === null || typeof o !== "object" || Object.isFrozen(o)) return o;
  Object.freeze(o);
  for (const key of Object.getOwnPropertyNames(o)) {
    deepFreeze((o as Record<string, unknown>)[key]);
  }
  return o;
}

export function isDev(): boolean {
  return import.meta.env?.DEV ?? true;
}

export function freezeState<T>(state: T): T {
  let cloned: T;
  try {
    cloned = structuredClone(state);
  } catch (cause) {
    throw new TypeError("SvenJS: state must be structured-cloneable", { cause });
  }
  if (isDev()) deepFreeze(cloned);
  return cloned;
}
