type User = { id: number; name: string; email: string };
type Patch<T> = { [K in keyof T]?: T[K] };

export function updateUser(u: User, changes: Patch<User>): User {
  return { ...u, ...changes };
}

const an: User = { id: 1, name: 'An', email: 'an@fpt.edu.vn' };
console.log(updateUser(an, { name: 'An 2' }));
