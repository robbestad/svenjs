export function deepFreeze<T>(o: T): T {
  if (o === null || typeof o !== "object" || Object.isFrozen(o)) return o;
  Object.freeze(o);
  for (const key of Object.getOwnPropertyNames(o)) {
    deepFreeze((o as Record<string, unknown>)[key]);
  }
  return o;
}

export function isDev(): boolean {
  try {
    return Boolean(import.meta.env && import.meta.env.DEV);
  } catch {
    return true;
  }
}

export function freezeState<T>(state: T): T {
  let cloned: T;
  try {
    cloned = structuredClone(state);
  } catch {
    cloned = JSON.parse(JSON.stringify(state)) as T;
  }
  if (isDev()) deepFreeze(cloned);
  return cloned;
}
