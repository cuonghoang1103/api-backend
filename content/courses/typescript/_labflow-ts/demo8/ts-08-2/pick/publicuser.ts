type User = { id: number; name: string; email: string; passwordHash: string; role: string };

// A public view is a type with only some keys.
type PublicUser = Pick<User, 'id' | 'name'>;

function toPublic(u: User): PublicUser {
  return { id: u.id, name: u.name };
}

console.log(toPublic({ id: 1, name: 'An', email: 'a@x.vn', passwordHash: 'xxx', role: 'user' }));
