// Under strict, a parameter with no type is an error, not a silent any.
export function parse(raw) {
  return raw.trim().toUpperCase();
}
