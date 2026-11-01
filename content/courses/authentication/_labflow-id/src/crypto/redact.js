// src/crypto/redact.js — lesson 1.5: log only what you decided is safe (an allow-list), never "everything minus a deny-list".
const HIDDEN = '[redacted]';

/** A deep copy where every key NOT in `allow` is replaced by "[redacted]". Arrays and nested objects are walked. */
export function redact(value, allow) {
  const keep = new Set(allow);
  const walk = (v) => {
    if (Array.isArray(v)) return v.map(walk);
    if (v && typeof v === 'object') {
      return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, keep.has(k) ? walk(x) : HIDDEN]));
    }
    return v;
  };
  return walk(value);
}
