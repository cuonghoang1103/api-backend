// Lesson 9.4 — generics: one function that keeps the type of whatever you give it
export function first<T>(items: T[]): T | undefined {
  return items[0];
}
export function findById<T extends { id: number }>(items: T[], id: number): T | undefined {
  return items.find((item) => item.id === id);
}
export interface ApiResponse<T> {
  data: T;
  fetchedAt: string;
}
export function wrap<T>(data: T): ApiResponse<T> {
  return { data, fetchedAt: '2026-11-02T10:00:00Z' };
}

const products = [{ id: 1, name: 'Notebook', price: 25000 }, { id: 3, name: 'Pen', price: 5000 }];
export const a = first(products);            // { id, name, price } | undefined
export const b = first(['sql', 'beginner']); // string | undefined
export const c = findById(products, 3);
export const d = wrap(products);             // ApiResponse<{ id; name; price }[]>

console.log(a?.name, b?.toUpperCase(), c?.price, d.data.length);
