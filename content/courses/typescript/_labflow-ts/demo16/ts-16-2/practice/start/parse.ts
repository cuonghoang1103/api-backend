export function first(raw: unknown): string {
  // raw is unknown — reading [0] is refused until you narrow.
  return raw[0];
}
