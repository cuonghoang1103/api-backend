// Lesson 9.2 — you rarely write types for variables: TypeScript infers them
export let count = 5;
export const title = 'Hello World';
export let price = 25000 * 1.1;
export const tags = ['sql', 'beginner'];
export const mixed = [1, 'two', true];
export const post = { id: 1, title: 'Hello World', views: 120, published: true };
export let maybe = Math.random() > 0.5 ? 'yes' : null;
export const sortDir = Math.random() > 0.5 ? 'asc' : 'desc';
export function double(n: number) {
  return n * 2;
}
export const settings = { dir: 'asc', size: 10 };
export const fixedSettings = { dir: 'asc', size: 10 } as const;
