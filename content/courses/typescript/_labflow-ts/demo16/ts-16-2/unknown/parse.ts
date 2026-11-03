// unknown is the safe top type — you must narrow before you use it.
export function size(raw: unknown): number {
  // Reading .length on unknown is refused until you narrow.
  return raw.length;
}
