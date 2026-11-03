import type { User } from '../../../../src/rules/model.ts';

// A real guard makes the shape true at runtime; no generic promises a type nobody checked.
function isUser(x: unknown): x is User {
  return typeof x === 'object' && x !== null && typeof (x as { id?: unknown }).id === 'number';
}

export function loadUsers(text: string): User[] {
  const data: unknown = JSON.parse(text);
  return Array.isArray(data) ? data.filter(isUser) : [];
}

console.log(loadUsers('[{"id":1,"createdAt":"","email":"a","name":"An","role":"STUDENT"},{"id":"x"}]').length);
