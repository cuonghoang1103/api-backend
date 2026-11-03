type User = { id: number; name: string; email: string };

// updateUser should accept ANY subset of User fields, but the type demands all three.
export function updateUser(u: User, changes: User): User {
  return { ...u, ...changes };
}

const an: User = { id: 1, name: 'An', email: 'an@fpt.edu.vn' };
console.log(updateUser(an, { name: 'An 2' }));  // only one field — tsc refuses this
