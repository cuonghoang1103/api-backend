'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MOCK_PRODUCTS } from '@/data/products';
import type { Product, ProductCategory } from '@/types';
import { ssrSafeStorage } from './ssrSafeStorage';
import {
  getProducts as apiGetProducts,
  getFeaturedProducts as apiGetFeatured,
  mapProductFromBackend,
  type ProductResponse,
} from '@/lib/api/shop';

interface ProductState {
  products: Product[];
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Product) => void;
  deleteProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
  getProductBySlug: (slug: string) => Product | undefined;
  toggleFeatured: (id: string) => void;
  toggleHot: (id: string) => void;
  toggleNew: (id: string) => void;
  fetchProducts: () => Promise<void>;
  fetchFeatured: () => Promise<Product[]>;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: MOCK_PRODUCTS,
      isLoaded: false,
      isLoading: false,
      error: null,

      fetchProducts: async () => {
        if (get().isLoading) return;
        set({ isLoading: true, error: null });
        try {
          const page = await apiGetProducts({ size: 100 });
          const mapped = (page.content as unknown as ProductResponse[]).map(mapProductFromBackend);
          set({ products: mapped, isLoaded: true, isLoading: false });
        } catch (err) {
          console.warn('Failed to fetch products from API, using mock data', err);
          set({ isLoaded: true, isLoading: false, error: String(err) });
        }
      },

      fetchFeatured: async () => {
        try {
          const featured = await apiGetFeatured();
          return featured.map(mapProductFromBackend);
        } catch {
          return get().products.filter((p) => p.isFeatured);
        }
      },

      addProduct: (product: Product) => {
        set((state) => ({
          products: [product, ...state.products],
        }));
      },

      updateProduct: (id: string, product: Product) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...product, id } : p)),
        }));
      },

      deleteProduct: (id: string) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },

      getProduct: (id: string) => get().products.find((p) => p.id === id),

      getProductBySlug: (slug: string) => get().products.find((p) => p.slug === slug),

      toggleFeatured: (id: string) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, isFeatured: !p.isFeatured } : p
          ),
        }));
      },

      toggleHot: (id: string) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, isHot: !p.isHot } : p
          ),
        }));
      },

      toggleNew: (id: string) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, isNew: !p.isNew } : p
          ),
        }));
      },
    }),
    {
      name: 'shop-products-storage',
      storage: createJSONStorage(() => ssrSafeStorage),
      partialize: (state) => ({ products: state.products }),
    }
  )
);
