'use client';

import type { ApiResponse, PageResponse } from '@/types';

const API_BASE = '/api/v1';

/**
 * Requests go through the same-origin `/api/v1` proxy.
 * The browser forwards the httpOnly auth cookie automatically via `credentials: 'include'`.
 */
async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: HeadersInit = {
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers ?? {}),
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    // credentials: 'include' forwards the httpOnly cookie for same-origin proxy calls
    credentials: 'include',
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `HTTP ${res.status}`);
  }

  return res.json();
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductResponse {
  id: number;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  thumbnailUrl?: string;
  images?: string;
  price: number;
  originalPrice?: number;
  stockQuantity: number;
  soldCount: number;
  featured: boolean;
  active: boolean;
  isHot?: boolean;
  isNew?: boolean;
  categoryId?: number;
  categoryName?: string;
  categorySlug?: string;
  type: string;
  fileUrl?: string;
  specs?: ProductSpec[];
  guidance?: string;
  createdAt: string;
}

export interface CategoryResponse {
  id: number;
  name: string;
  slug: string;
  description?: string;
  sortOrder: number;
}

export interface DiscountValidateResponse {
  valid: boolean;
  code: string;
  discountType?: string;
  discountValue?: number;
  discountAmount?: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  message: string;
}

export interface CreateOrderItem {
  productId: number;
  productName: string;
  productSlug?: string;
  productImage?: string;
  price: number;
  quantity: number;
}

export interface CreateOrderRequest {
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string;
  buyerAddress?: string;
  items: CreateOrderItem[];
  discountCode?: string;
  notes?: string;
}

export interface OrderItemResponse {
  id: number;
  productName: string;
  productSlug?: string;
  productImage?: string;
  price: number;
  quantity: number;
  total: number;
  fileUrl?: string;
  credentials?: string;
}

export interface DigitalDelivery {
  productName: string;
  type: string;
  fileUrl?: string;
  credentials?: string;
}

export interface DeliveryInfo {
  hasDigitalItems: boolean;
  items: DigitalDelivery[];
  message: string;
}

export interface OrderResponse {
  id: number;
  orderCode: string;
  userId?: number;
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string;
  buyerAddress?: string;
  subtotal: number;
  discountAmount: number;
  discountCode?: string;
  total: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  paidAt?: string;
  items: OrderItemResponse[];
  deliveryInfo?: DeliveryInfo;
  createdAt: string;
}

// ─── Products API ─────────────────────────────────────────────────────────────

export async function getProducts(params?: {
  page?: number;
  size?: number;
  category?: string;
  featured?: boolean;
  search?: string;
}): Promise<PageResponse<ProductResponse>> {
  const sp = new URLSearchParams();
  if (params?.page !== undefined) sp.set('page', String(params.page));
  if (params?.size !== undefined) sp.set('size', String(params.size));
  if (params?.category) sp.set('category', params.category);
  if (params?.featured !== undefined) sp.set('featured', String(params.featured));
  if (params?.search) sp.set('search', params.search);

  const qs = sp.toString();
  const res = await request<ApiResponse<ProductResponse[]>>(
    `/shop/products${qs ? `?${qs}` : ''}`
  );
  return {
    content: Array.isArray(res.data) ? res.data : [],
    pageNumber: (res as any).pagination?.page ?? 0,
    pageSize: (res as any).pagination?.limit ?? (params?.size ?? 12),
    totalElements: (res as any).pagination?.total ?? (Array.isArray(res.data) ? res.data.length : 0),
    totalPages: (res as any).pagination?.totalPages ?? 1,
    first: ((res as any).pagination?.page ?? 0) === 0,
    last: ((res as any).pagination?.page ?? 0) >= (((res as any).pagination?.totalPages ?? 1) - 1),
  };
}

export async function getFeaturedProducts(): Promise<ProductResponse[]> {
  const res = await request<ApiResponse<ProductResponse[]>>(
    '/shop/products/featured'
  );
  return res.data;
}

export async function getProductBySlug(slug: string): Promise<ProductResponse> {
  const res = await request<ApiResponse<ProductResponse>>(
    `/shop/products/${slug}`
  );
  return res.data;
}

export async function getProductById(id: number): Promise<ProductResponse> {
  const res = await request<ApiResponse<ProductResponse>>(
    `/shop/products/id/${id}`
  );
  return res.data;
}

// ─── Categories API ───────────────────────────────────────────────────────────

export async function getCategories(): Promise<CategoryResponse[]> {
  const res = await request<ApiResponse<CategoryResponse[]>>(
    '/shop/categories'
  );
  return res.data;
}

// ─── Discounts API ────────────────────────────────────────────────────────────

export async function validateDiscount(
  code: string
): Promise<DiscountValidateResponse> {
  try {
    const discount = await request<ApiResponse<any>>(
      `/shop/discount/${code}`
    );
    const data = discount.data;
    return {
      valid: true,
      code: data.code,
      discountType: data.discountType,
      discountValue: Number(data.discountValue),
      minOrderAmount: Number(data.minOrderAmount || 0),
      maxDiscountAmount: data.maxDiscountAmount ? Number(data.maxDiscountAmount) : undefined,
      message: 'Discount code applied successfully.',
    };
  } catch {
    return {
      valid: false,
      code,
      discountType: 'PERCENTAGE',
      discountValue: 0,
      minOrderAmount: 0,
      message: 'Invalid or expired discount code.',
    };
  }
}

// ─── Orders API ──────────────────────────────────────────────────────────────

export async function createOrder(
  data: CreateOrderRequest
): Promise<ApiResponse<OrderResponse>> {
  return request('/shop/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getOrderByCode(
  code: string
): Promise<ApiResponse<OrderResponse>> {
  return request(`/shop/orders/${code}`);
}

export async function getMyOrders(): Promise<ApiResponse<OrderResponse[]>> {
  return request('/shop/orders/my');
}

// ─── Admin API ───────────────────────────────────────────────────────────────

export async function adminCreateProduct(
  data: Partial<ProductResponse>
): Promise<ApiResponse<ProductResponse>> {
  return request('/shop/admin/products', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function adminUpdateProduct(
  id: number,
  data: Partial<ProductResponse>
): Promise<ApiResponse<ProductResponse>> {
  return request(`/shop/admin/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function adminDeleteProduct(
  id: number
): Promise<ApiResponse<void>> {
  return request(`/shop/admin/products/${id}`, {
    method: 'DELETE',
  });
}

// ─── Admin Orders ─────────────────────────────────────────────────────────────

export async function adminGetOrders(params?: {
  page?: number;
  size?: number;
  status?: string;
}): Promise<PageResponse<OrderResponse>> {
  const sp = new URLSearchParams();
  if (params?.page !== undefined) sp.set('page', String(params.page));
  if (params?.size !== undefined) sp.set('size', String(params.size));
  if (params?.status && params.status !== 'ALL') sp.set('status', params.status);

  const qs = sp.toString();
  const res = await request<ApiResponse<OrderResponse[]>>(`/shop/admin/orders${qs ? `?${qs}` : ''}`);
  return {
    content: Array.isArray(res.data) ? res.data : [],
    pageNumber: (res as any).pagination?.page ?? 0,
    pageSize: (res as any).pagination?.limit ?? (params?.size ?? 100),
    totalElements: (res as any).pagination?.total ?? (Array.isArray(res.data) ? res.data.length : 0),
    totalPages: (res as any).pagination?.totalPages ?? 1,
    first: ((res as any).pagination?.page ?? 0) === 0,
    last: ((res as any).pagination?.page ?? 0) >= (((res as any).pagination?.totalPages ?? 1) - 1),
  };
}

export async function adminUpdateOrderStatus(
  id: number,
  status: string
): Promise<ApiResponse<OrderResponse>> {
  return request(`/shop/admin/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
}

// ─── Admin Discounts ──────────────────────────────────────────────────────────

export async function adminGetDiscounts() {
  return request<
    ApiResponse<
      Array<{
        id: number;
        code: string;
        discountType: string;
        discountValue: number;
        minOrderAmount: number;
        maxDiscountAmount?: number;
        maxUses?: number;
        usedCount: number;
        active: boolean;
        description?: string;
        expiresAt?: string;
      }>
    >
  >('/shop/admin/discounts');
}

export async function adminCreateDiscount(
  data: Record<string, unknown>
): Promise<ApiResponse<void>> {
  return request('/shop/admin/discounts', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function adminUpdateDiscount(
  id: number,
  data: Record<string, unknown>
): Promise<ApiResponse<void>> {
  return request(`/shop/admin/discounts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function adminDeleteDiscount(
  id: number
): Promise<ApiResponse<void>> {
  return request(`/shop/admin/discounts/${id}`, {
    method: 'DELETE',
  });
}

// ─── Map backend product → frontend Product type ─────────────────────────────

export function mapProductFromBackend(bp: ProductResponse) {
  return {
    id: String(bp.id),
    name: bp.name ?? '',
    slug: bp.slug ?? '',
    price: bp.price ?? 0,
    originalPrice: bp.originalPrice,
    thumbnail: bp.thumbnailUrl || '/images/products/default.jpg',
    category: (bp.categoryName as 'Web Template' | 'Tools' | 'Software' | 'Accounts' | 'Ebook') || 'Web Template',
    rating: 5,
    reviewCount: 0,
    description: bp.shortDescription || bp.description || '',
    features: [],
    specs: bp.specs ?? [],
    guidance: bp.guidance ?? '',
    isHot: bp.isHot ?? false,
    isNew: bp.isNew ?? false,
    fileUrl: bp.fileUrl,
    stock: bp.stockQuantity ?? 0,
    isFeatured: bp.featured ?? false,
    soldCount: bp.soldCount ?? 0,
    createdAt: bp.createdAt,
    tags: [],
  };
}
