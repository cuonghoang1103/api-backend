import type { User } from '../../../src/rules/model.ts';

// A generic class: T is fixed when you write new Repo<User>(), and every method speaks that type.
class Repo<T extends { id: number }> {
  private items = new Map<number, T>();
  add(item: T): void { this.items.set(item.id, item); }
  get(id: number): T | undefined { return this.items.get(id); }
  get size(): number { return this.items.size; }
}

const users = new Repo<User>();
users.add({ id: 1, createdAt: '2026-11-03', email: 'an@fpt.edu.vn', name: 'An', role: 'STUDENT' });
console.log(users.get(1)?.name, users.size);   // get(1) is User | undefined
