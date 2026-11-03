type User = { id: number; name: string; email: string; passwordHash: string };

// Omit the secret: PublicUser has no passwordHash, so reading it is a compile error.
type PublicUser = Omit<User, 'passwordHash'>;

function show(u: PublicUser) {
  console.log(u.passwordHash); // the field is gone
}
show({ id: 1, name: 'An', email: 'a@x.vn' });
