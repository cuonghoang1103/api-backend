import type { User } from '../../../../src/rules/model.ts';

// Fixed: no misleading generic. The return type says exactly what it is, and the caller must narrow unknown.
export function loadUsers(text: string): unknown {
  return JSON.parse(text);
}

const data = loadUsers('[]');
const users = Array.isArray(data) ? (data as User[]) : [];
console.log(users.length);
