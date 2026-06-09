'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { DiscountCode, DiscountUsage, DiscountType } from '@/types';
import { ssrSafeStorage } from './ssrSafeStorage';

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Simulated admin-created discount codes stored in localStorage
interface DiscountState {
  // Admin-managed codes
  discountCodes: DiscountCode[];

  // User's usage history (tracks which codes each user has used)
  usedCodes: DiscountUsage[];

  // ── Admin actions ─────────────────────────────────────────────────────────
  createDiscountCode: (data: {
    code: string;
    description?: string;
    discountType: DiscountType;
    discountValue: number;
    maxUses: number;
    minOrderValue?: number;
    maxDiscountAmount?: number;
    expiresAt?: string;
  }) => void;

  updateDiscountCode: (id: string, data: Partial<Omit<DiscountCode, 'id' | 'createdAt'>>) => void;
  deleteDiscountCode: (id: string) => void;
  getDiscountCodeByCode: (code: string) => DiscountCode | undefined;

  // ── User actions ──────────────────────────────────────────────────────────
  markCodeAsUsed: (codeId: string, orderId?: string) => void;
  hasUsedCode: (codeId: string) => boolean;
  validateCode: (
    code: string,
    subtotal: number
  ) => { valid: boolean; message: string; discountAmount?: number };

  // ── Seed initial demo codes ───────────────────────────────────────────────
  seedDemoCodes: () => void;
}

const DEMO_CODES: DiscountCode[] = [
  {
    id: 'demo-code-1',
    code: 'WELCOME10',
    description: 'Giảm 10% cho đơn hàng đầu tiên',
    discountType: 'PERCENTAGE',
    discountValue: 10,
    maxUses: 100,
    currentUses: 0,
    minOrderValue: 0,
    maxDiscountAmount: 100000,
    expiresAt: '2027-12-31T23:59:59.000Z',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-code-2',
    code: 'SUMMER50',
    description: 'Giảm 50,000 VND cho đơn hàng từ 200,000 VND',
    discountType: 'FIXED_AMOUNT',
    discountValue: 50000,
    maxUses: 50,
    currentUses: 0,
    minOrderValue: 200000,
    expiresAt: '2027-12-31T23:59:59.000Z',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-code-3',
    code: 'VIP20',
    description: 'Giảm 20% tối đa 200,000 VND',
    discountType: 'PERCENTAGE',
    discountValue: 20,
    maxUses: 20,
    currentUses: 0,
    minOrderValue: 100000,
    maxDiscountAmount: 200000,
    expiresAt: '2027-12-31T23:59:59.000Z',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-code-4',
    code: 'FREESHIP',
    description: 'Giảm 30% cho đơn hàng',
    discountType: 'PERCENTAGE',
    discountValue: 30,
    maxUses: 1,
    currentUses: 0,
    minOrderValue: 0,
    maxDiscountAmount: 50000,
    expiresAt: '2027-12-31T23:59:59.000Z',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

export const useDiscountStore = create<DiscountState>()(
  persist(
    (set, get) => ({
      discountCodes: [],
      usedCodes: [],

      // ── Admin actions ──────────────────────────────────────────────────────

      createDiscountCode: (data) => {
        const code: DiscountCode = {
          id: generateId(),
          code: data.code.toUpperCase().trim(),
          description: data.description,
          discountType: data.discountType,
          discountValue: data.discountValue,
          maxUses: data.maxUses,
          currentUses: 0,
          minOrderValue: data.minOrderValue,
          maxDiscountAmount: data.maxDiscountAmount,
          expiresAt: data.expiresAt,
          isActive: true,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          discountCodes: [...state.discountCodes, code],
        }));
      },

      updateDiscountCode: (id, data) => {
        set((state) => ({
          discountCodes: state.discountCodes.map((c) =>
            c.id === id ? { ...c, ...data } : c
          ),
        }));
      },

      deleteDiscountCode: (id) => {
        set((state) => ({
          discountCodes: state.discountCodes.filter((c) => c.id !== id),
        }));
      },

      getDiscountCodeByCode: (code) => {
        const upper = code.toUpperCase().trim();
        return get().discountCodes.find((c) => c.code === upper);
      },

      // ── User actions ───────────────────────────────────────────────────────

      markCodeAsUsed: (codeId, orderId) => {
        const usage: DiscountUsage = {
          discountCodeId: codeId,
          usedAt: new Date().toISOString(),
          orderId,
        };
        set((state) => {
          // Increment currentUses on the discount code
          const updatedCodes = state.discountCodes.map((c) =>
            c.id === codeId ? { ...c, currentUses: c.currentUses + 1 } : c
          );
          return {
            usedCodes: [...state.usedCodes, usage],
            discountCodes: updatedCodes,
          };
        });
      },

      hasUsedCode: (codeId) => {
        return get().usedCodes.some((u) => u.discountCodeId === codeId);
      },

      validateCode: (code, subtotal) => {
        const discountCode = get().getDiscountCodeByCode(code);

        if (!discountCode) {
          return { valid: false, message: 'Mã giảm giá không tồn tại.' };
        }

        if (!discountCode.isActive) {
          return { valid: false, message: 'Mã giảm giá đã bị vô hiệu hóa.' };
        }

        if (discountCode.currentUses >= discountCode.maxUses) {
          return { valid: false, message: 'Mã giảm giá đã hết lượt sử dụng.' };
        }

        if (get().hasUsedCode(discountCode.id)) {
          return { valid: false, message: 'Bạn đã sử dụng mã giảm giá này rồi (chỉ dùng được 1 lần).' };
        }

        if (discountCode.expiresAt) {
          const expDate = new Date(discountCode.expiresAt);
          if (expDate < new Date()) {
            return { valid: false, message: 'Mã giảm giá đã hết hạn.' };
          }
        }

        if (discountCode.minOrderValue && subtotal < discountCode.minOrderValue) {
          return {
            valid: false,
            message: `Đơn hàng tối thiểu ${formatPrice(discountCode.minOrderValue)} để dùng mã này.`,
          };
        }

        // Calculate discount
        let discountAmount = 0;
        if (discountCode.discountType === 'PERCENTAGE') {
          discountAmount = Math.round((subtotal * discountCode.discountValue) / 100);
          if (discountCode.maxDiscountAmount) {
            discountAmount = Math.min(discountAmount, discountCode.maxDiscountAmount);
          }
        } else {
          discountAmount = discountCode.discountValue;
        }

        // Don't allow discount > subtotal
        discountAmount = Math.min(discountAmount, subtotal);

        return {
          valid: true,
          message: `Áp dụng thành công! Giảm ${formatPrice(discountAmount)}`,
          discountAmount,
        };
      },

      // Seed demo codes if none exist
      seedDemoCodes: () => {
        const { discountCodes } = get();
        if (discountCodes.length === 0) {
          set({ discountCodes: DEMO_CODES });
        }
      },
    }),
    {
      name: 'discount-storage',
      storage: createJSONStorage(() => ssrSafeStorage),
      partialize: (state) => ({
        discountCodes: state.discountCodes,
        usedCodes: state.usedCodes,
      }),
    }
  )
);

function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(price);
}
