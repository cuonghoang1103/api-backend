// An unconstrained T knows nothing about its shape, so item.id is an error.
export function byId<T>(items: readonly T[], id: number): T | undefined {
  return items.find((item) => item.id === id);
}
