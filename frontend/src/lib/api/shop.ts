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
  images?: string[];
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
  // PHYSICAL | DIGITAL
  type: string;
  fileUrl?: string;
  digitalContent?: string;
  ratingAvg?: number;
  ratingCount?: number;
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
  shippingProvince?: string;
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
  productType?: string;
  fileUrl?: string;
  digitalContent?: string;
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
  shippingProvince?: string;
  subtotal: number;
  discountAmount: number;
  discountCode?: string;
  shippingFee?: number;
  total: number;
  status: string;
  orderType?: string;
  fulfillmentStatus?: string;
  trackingNumber?: string;
  shippedAt?: string;
  deliveredAt?: string;
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
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'bestselling';
}): Promise<PageResponse<ProductResponse>> {
  const sp = new URLSearchParams();
  if (params?.page !== undefined) sp.set('page', String(params.page));
  if (params?.size !== undefined) sp.set('size', String(params.size));
  if (params?.category) sp.set('category', params.category);
  if (params?.featured !== undefined) sp.set('featured', String(params.featured));
  if (params?.search) sp.set('search', params.search);
  if (params?.sort) sp.set('sort', params.sort);

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

/**
 * Create a VNPAY-QR payment for an existing shop order.
 * Returns the VNPay gateway `paymentUrl` to render as a QR code.
 * vnp_TxnRef is `PRODUCT_{orderId}_{ts}` so the backend IPN routes it
 * to the shop (product) branch.
 */
export async function createShopPaymentQr(
  orderId: number
): Promise<ApiResponse<{ paymentUrl: string; txnRef: string; amount: number; orderType: 'PRODUCT' }>> {
  return request('/payments/create-qr', {
    method: 'POST',
    body: JSON.stringify({ orderId, orderType: 'PRODUCT' }),
  });
}

/**
 * Create a PayOS checkout link for an existing shop order (PRIMARY gateway).
 * Returns the hosted `checkoutUrl` — redirect the browser to it. On return,
 * PayOS sends the user to /shop/payment-return which polls the order status.
 */
export async function createShopPayos(
  orderCode: string
): Promise<ApiResponse<{ checkoutUrl: string; qrCode: string; orderCode: string }>> {
  return request('/payments/payos/shop/create', {
    method: 'POST',
    body: JSON.stringify({ orderCode }),
  });
}

// "Sản phẩm tương tự" — same category, most-sold first.
export async function getSimilarProducts(slug: string, limit = 8): Promise<ProductResponse[]> {
  const res = await request<ApiResponse<ProductResponse[]>>(
    `/shop/products/${slug}/similar?limit=${limit}`
  );
  return Array.isArray(res.data) ? res.data : [];
}

// ─── Shipping ─────────────────────────────────────────────────────────────────

export interface ShippingConfig { flatFee: number; freeThreshold: number }

export async function getShippingConfig(): Promise<ShippingConfig> {
  try {
    const res = await request<ApiResponse<ShippingConfig>>('/shop/shipping-config');
    return res.data;
  } catch {
    return { flatFee: 30000, freeThreshold: 500000 };
  }
}

// ─── Check usage (API/activation key) ───────────────────────────────────────────

export interface CheckUsageResult {
  configured: boolean;
  ok?: boolean;
  message?: string;
  usage?: Record<string, any>;
}

export async function checkUsage(apiKey: string): Promise<CheckUsageResult> {
  const res = await request<ApiResponse<CheckUsageResult>>('/shop/check-usage', {
    method: 'POST',
    body: JSON.stringify({ apiKey }),
  });
  return res.data;
}

// ─── Product reviews ───────────────────────────────────────────────────────────

export interface ProductReview {
  id: number;
  rating: number;
  comment?: string | null;
  createdAt: string;
  userId: number;
  userName: string;
  userAvatar?: string | null;
}

export interface ProductReviewsResponse {
  average: number;
  count: number;
  reviews: ProductReview[];
}

export async function getProductReviews(slug: string): Promise<ProductReviewsResponse> {
  const res = await request<ApiResponse<ProductReviewsResponse>>(`/shop/products/${slug}/reviews`);
  return res.data;
}

export async function postProductReview(productId: number, rating: number, comment?: string): Promise<ApiResponse<void>> {
  return request(`/shop/products/${productId}/reviews`, {
    method: 'POST',
    body: JSON.stringify({ rating, comment }),
  });
}

export async function deleteMyReview(reviewId: number): Promise<ApiResponse<void>> {
  return request(`/shop/reviews/${reviewId}`, { method: 'DELETE' });
}

export interface AdminReview {
  id: number;
  rating: number;
  comment?: string | null;
  isApproved: boolean;
  createdAt: string;
  userName: string;
  productName?: string;
  productSlug?: string;
}

export async function adminGetReviews(): Promise<AdminReview[]> {
  const res = await request<ApiResponse<AdminReview[]>>('/shop/admin/reviews');
  return Array.isArray(res.data) ? res.data : [];
}

export async function adminModerateReview(id: number, isApproved: boolean): Promise<ApiResponse<void>> {
  return request(`/shop/admin/reviews/${id}`, { method: 'PATCH', body: JSON.stringify({ isApproved }) });
}

export async function adminDeleteReview(id: number): Promise<ApiResponse<void>> {
  return request(`/shop/admin/reviews/${id}`, { method: 'DELETE' });
}

// ─── Admin fulfillment (physical order shipping lifecycle) ──────────────────────

export async function adminUpdateFulfillment(
  orderId: number,
  data: { fulfillmentStatus?: string; trackingNumber?: string }
): Promise<ApiResponse<OrderResponse>> {
  return request(`/shop/admin/orders/${orderId}/fulfillment`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
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

// Admin product list — unlike the public endpoint this INCLUDES the digital
// deliverables (fileUrl / digitalContent) so the edit form can load them.
export async function adminGetProducts(size = 200): Promise<ProductResponse[]> {
  const res = await request<ApiResponse<ProductResponse[]>>(`/shop/admin/products?size=${size}`);
  return Array.isArray(res.data) ? res.data : [];
}

// ─── Admin Categories ─────────────────────────────────────────────────────────

export interface AdminCategoryResponse extends CategoryResponse {
  productCount: number;
}

export async function adminGetCategories(): Promise<AdminCategoryResponse[]> {
  const res = await request<ApiResponse<AdminCategoryResponse[]>>('/shop/admin/categories');
  return Array.isArray(res.data) ? res.data : [];
}

export async function adminCreateCategory(
  data: { name: string; description?: string; sortOrder?: number }
): Promise<ApiResponse<CategoryResponse>> {
  return request('/shop/admin/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function adminUpdateCategory(
  id: number,
  data: { name?: string; description?: string; sortOrder?: number }
): Promise<ApiResponse<CategoryResponse>> {
  return request(`/shop/admin/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function adminDeleteCategory(id: number): Promise<ApiResponse<void>> {
  return request(`/shop/admin/categories/${id}`, { method: 'DELETE' });
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
    images: Array.isArray(bp.images) ? bp.images : [],
    category: bp.categoryName || 'Khác',
    productType: bp.type || 'DIGITAL',
    rating: bp.ratingAvg ?? 0,
    reviewCount: bp.ratingCount ?? 0,
    description: bp.shortDescription || bp.description || '',
    features: [],
    specs: bp.specs ?? [],
    guidance: bp.guidance ?? '',
    isHot: bp.isHot ?? false,
    isNew: bp.isNew ?? false,
    fileUrl: bp.fileUrl,
    digitalContent: bp.digitalContent,
    stock: bp.stockQuantity ?? 0,
    isFeatured: bp.featured ?? false,
    soldCount: bp.soldCount ?? 0,
    createdAt: bp.createdAt,
    tags: [],
  };
}
