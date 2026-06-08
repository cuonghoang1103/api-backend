/**
 * ============================================================
 * API Client - Next.js Frontend
 *
 * Singleton axios instance và các hàm gọi API.
 * Tất cả request tự động attach JWT token từ cookie.
 * ============================================================
 */

import axios, { type AxiosInstance, type AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  timeout: 60_000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Gửi cookie cùng request
});

// ─── Response interceptor ────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined' && !error.config?.url?.includes('/auth/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
