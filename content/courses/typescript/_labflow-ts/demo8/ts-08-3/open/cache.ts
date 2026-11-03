// An open dictionary: any string key, so a lookup may be missing.
const cache: Record<string, number> = { a: 1, b: 2 };

const hit = cache['a'];        // number | undefined under noUncheckedIndexedAccess
console.log(hit ?? 0, cache['z'] ?? 0);
