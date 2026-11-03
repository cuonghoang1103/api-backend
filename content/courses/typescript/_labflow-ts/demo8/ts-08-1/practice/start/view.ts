type User = { id: number; name: string; email: string; role: string };

// patch typed as the full User — the caller must resend every field.
export function edit(u: User, patch: User): User { return { ...u, ...patch }; }

const u: User = { id: 1, name: 'An', email: 'a@x.vn', role: 'user' };
edit(u, { name: 'Ada' }); // only one field — id, email, role missing
