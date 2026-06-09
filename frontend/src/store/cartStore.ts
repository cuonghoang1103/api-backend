'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItem, Product, Course, ItemType } from '@/types';
import { ssrSafeStorage } from './ssrSafeStorage';

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;

  // ── Cart item management ──────────────────────────────────────────────────
  addShopItem: (product: Product) => void;
  addAcademyItem: (course: Course) => void;
  addItem: (itemType: ItemType, product: Product, course?: Course) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;

  // ── Drawer controls ──────────────────────────────────────────────────────
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;

  // ── Computed helpers ─────────────────────────────────────────────────────
  getTotalPrice: () => number;
  getTotalItems: () => number;
  getShopItems: () => CartItem[];
  getAcademyItems: () => CartItem[];

  // ── Check if item already in cart ───────────────────────────────────────
  isInCart: (itemType: ItemType, productId?: string, courseId?: number) => boolean;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,

      // Add shop product to cart
      addShopItem: (product: Product) => {
        const { items } = get();
        const existing = items.find(
          (item) => item.itemType === 'shop' && item.product.id === product.id
        );
        if (existing) {
          set({
            items: items.map((item) =>
              item.id === existing.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          const newItem: CartItem = {
            id: generateId(),
            itemType: 'shop',
            product,
            quantity: 1,
          };
          set({ items: [...items, newItem] });
        }
        set({ isDrawerOpen: true });
      },

      // Add academy course to cart
      addAcademyItem: (course: Course) => {
        const { items } = get();
        const existing = items.find(
          (item) => item.itemType === 'academy' && item.course?.id === course.id
        );
        if (existing) return; // already in cart
        const newItem: CartItem = {
          id: generateId(),
          itemType: 'academy',
          product: {
            id: `course-${course.id}`,
            name: course.title,
            slug: course.slug,
            price: course.discountPrice && course.discountPrice > 0
              ? Number(course.discountPrice)
              : Number(course.price),
            originalPrice: course.isFree ? 0 : Number(course.price),
            thumbnail: course.thumbnailUrl || '',
            category: 'Ebook' as any,
            rating: Number(course.avgRating) || 0,
            reviewCount: course.totalReviews || 0,
            description: course.shortDescription || '',
            features: [],
            stock: 9999,
            tags: course.tags,
          },
          course,
          quantity: 1,
        };
        set({ items: [...items, newItem] });
        set({ isDrawerOpen: true });
      },

      // Generic add
      addItem: (itemType: ItemType, product: Product, course?: Course) => {
        if (itemType === 'academy' && course) {
          get().addAcademyItem(course);
        } else {
          get().addShopItem(product);
        }
      },

      removeItem: (cartItemId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== cartItemId),
        }));
      },

      updateQuantity: (cartItemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(cartItemId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === cartItemId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getShopItems: () => get().items.filter((i) => i.itemType === 'shop'),
      getAcademyItems: () => get().items.filter((i) => i.itemType === 'academy'),

      isInCart: (itemType: ItemType, productId?: string, courseId?: number) => {
        return get().items.some((item) => {
          if (itemType === 'shop' && productId) {
            return item.itemType === 'shop' && item.product.id === productId;
          }
          if (itemType === 'academy' && courseId) {
            return item.itemType === 'academy' && item.course?.id === courseId;
          }
          return false;
        });
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => ssrSafeStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
