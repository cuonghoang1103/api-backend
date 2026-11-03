export function byId<T extends { id: number }>(items: readonly T[], id: number): T | undefined {
  return items.find((item) => item.id === id);
}

// A lab has a `code`, not an `id` — it does not satisfy the constraint.
const labs = [{ code: 'BE-201', name: 'Backend Lab 1' }];
const found = byId(labs, 1);
void found;
