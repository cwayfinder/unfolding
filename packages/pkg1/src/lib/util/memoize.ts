// eslint-disable-next-line @typescript-eslint/ban-types
export function memoize(fn: Function) {
  const cache = new Map();

  return function (this: unknown, ...args: unknown[]) {
    const key = args.join(',');

    if (cache.has(key)) {
      return structuredClone(cache.get(key));
    }

    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}
