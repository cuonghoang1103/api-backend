'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Order, OrderItem, OrderStatus, BuyerInfo, CartItem } from '@/types';
import { ssrSafeStorage } from './ssrSafeStorage';

function generateOrderId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'ORD-';
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

interface OrderState {
  orders: Order[];
  pendingOrder: Partial<Order> | null;
  currentOrderId: string | null;

  // ── Actions ───────────────────────────────────────────────────────────────
  createOrder: (
    items: CartItem[],
    buyerInfo: BuyerInfo,
    discountCode?: string,
    discountAmount?: number
  ) => string; // returns orderId

  saveBackendOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrderById: (orderId: string) => Order | undefined;
  getAllOrders: () => Order[];
  clearPendingOrder: () => void;
  setCurrentOrderId: (id: string | null) => void;
}

function cartItemsToOrderItems(cartItems: CartItem[]): OrderItem[] {
  return cartItems.map((item) => ({
    id: Math.random().toString(36).substring(2) + Date.now().toString(36),
    itemType: item.itemType,
    productId: item.itemType === 'shop' ? item.product.id : undefined,
    courseId: item.itemType === 'academy' ? item.course?.id : undefined,
    name: item.product.name,
    thumbnail: item.product.thumbnail,
    price: item.product.price,
    quantity: item.quantity,
    category: item.itemType === 'academy'
      ? (item.course?.categoryName || 'Khóa học')
      : item.product.category,
  }));
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      pendingOrder: null,
      currentOrderId: null,

      createOrder: (items, buyerInfo, discountCode, discountAmount = 0) => {
        const orderId = generateOrderId();
        const now = new Date().toISOString();

        const subtotal = items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );
        const total = Math.max(0, subtotal - discountAmount);

        const order: Order = {
          id: orderId,
          items: cartItemsToOrderItems(items),
          subtotal,
          discountAmount,
          discountCode: discountCode || undefined,
          total,
          status: 'Pending',
          buyerInfo,
          createdAt: now,
        };

        set((state) => ({
          orders: [order, ...state.orders],
          currentOrderId: orderId,
        }));

        return orderId;
      },

      saveBackendOrder: (order: Order) => {
        const exists = get().orders.some((o) => o.id === order.id);
        if (!exists) {
          set((state) => ({
            orders: [order, ...state.orders],
            currentOrderId: order.id,
          }));
        }
      },

      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  status,
                  ...(status === 'Completed' ? { completedAt: new Date().toISOString() } : {}),
                }
              : order
          ),
        }));
      },

      getOrderById: (orderId) => get().orders.find((o) => o.id === orderId),

      getAllOrders: () => get().orders,

      clearPendingOrder: () => set({ pendingOrder: null }),

      setCurrentOrderId: (id) => set({ currentOrderId: id }),
    }),
    {
      name: 'orders-storage',
      storage: createJSONStorage(() => ssrSafeStorage),
      partialize: (state) => ({
        orders: state.orders,
        currentOrderId: state.currentOrderId,
      }),
    }
  )
);
