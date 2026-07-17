/**
 * Landing page — API client for the promo marquee (public read + admin CRUD).
 */
import { api } from './api';

export interface LandingPromo {
  id: number;
  title: string;
  tagline: string | null;
  videoUrl: string;
  posterUrl: string | null;
  href: string | null;
  accent: string | null;
  featureKey: string | null;
  isActive: boolean;
  order: number;
}

export type LandingPromoInput = Partial<Omit<LandingPromo, 'id'>> & { title: string; videoUrl: string };

const BASE = '/landing';
const ADMIN = '/admin/landing';

export const landingApi = {
  // Public
  getPromos: () => api.get<{ success: boolean; data: LandingPromo[] }>(`${BASE}/promos`),

  // Admin
  adminList: () => api.get<{ success: boolean; data: LandingPromo[] }>(`${ADMIN}/promos`),
  create: (data: LandingPromoInput) => api.post<{ success: boolean; data: LandingPromo }>(`${ADMIN}/promos`, data),
  update: (id: number, data: Partial<LandingPromoInput>) => api.put<{ success: boolean; data: LandingPromo }>(`${ADMIN}/promos/${id}`, data),
  remove: (id: number) => api.delete<{ success: boolean; data: { deleted: boolean } }>(`${ADMIN}/promos/${id}`),
  reorder: (ids: number[]) => api.post<{ success: boolean; data: LandingPromo[] }>(`${ADMIN}/promos/reorder`, { ids }),
};
