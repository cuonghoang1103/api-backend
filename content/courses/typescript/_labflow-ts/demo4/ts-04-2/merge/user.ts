// models.ts, line 1 — the User every screen uses.
export interface User {
  readonly id: number;
  email: string;
  name: string;
}

export function greet(u: User): string {
  return 'Hello, ' + u.name;
}

// … 200 lines later, someone adds "the user from the SMS module" and reuses the name.
export interface User {
  phone: string;
}

const an: User = { id: 1, email: 'an.nv@fpt.edu.vn', name: 'Nguyen Van An' };
console.log(greet(an));
