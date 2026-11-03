export type Id = string | number;

export function kind(id: Id): string {
  if (typeof id === 'string') return 'text';
  if (typeof id === 'number') return 'number';
  // Both members removed: here id has type never. Hover shows it; nothing reaches this line.
  return impossible(id);
}

function impossible(x: never): never {
  throw new Error('unreachable: ' + String(x));
}
