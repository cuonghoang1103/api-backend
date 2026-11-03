type User = { id: number; name: string };
const users: User[] = [{ id: 1, name: 'An' }];

// Under strictNullChecks, find may return undefined — reading .name is refused.
export function nameOf(id: number): string {
  const u = users.find((x) => x.id === id);
  return u.name;
}
