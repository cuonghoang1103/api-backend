type User = { id: number; name: string; email: string; role: string };

// Partial<User> lets the caller send any subset.
export function edit(u: User, patch: Partial<User>): User { return { ...u, ...patch }; }

const u: User = { id: 1, name: 'An', email: 'a@x.vn', role: 'user' };
console.log(edit(u, { name: 'Ada' }));
