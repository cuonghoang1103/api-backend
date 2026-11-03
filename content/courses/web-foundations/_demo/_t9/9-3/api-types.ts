// Lesson 9.3 — the Chapter 6 API, described with types (the shapes the front-end receives)
export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}
export interface ProductList {
  items: Product[];
  page: number;
  limit: number;
  total: number;
}
export interface ApiError {
  error: string;
}
export interface ValidationError {
  errors: string[];
}
export type CreateProductInput = Omit<Product, 'id'>;              // what POST /api/products accepts
export type UpdateProductInput = Partial<CreateProductInput>;      // what PATCH accepts: every field optional
export type ViewsByCategory = Record<string, number>;              // { office: 75000, home: 380000 }

export async function getProducts(page = 1): Promise<ProductList> {
  const res = await fetch('/api/products?page=' + page);
  if (!res.ok) throw new Error('HTTP ' + res.status);
  return res.json();
}
