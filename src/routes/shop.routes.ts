import { Router, type Response } from 'express';
import { Prisma } from '@prisma/client';
import { nanoid } from 'nanoid';
import { prisma } from '../config/database.js';
import { authenticate, optionalAuth, requireAdmin } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import type { ApiResponse } from '../types/index.js';
import { reconcilePayosShopOrder, PAYOS_SHOP_ORDER_OFFSET } from '../services/shopFulfillment.js';

const router = Router();

// Flat shipping fee for physical goods, waived over a threshold. Env-overridable.
const SHIPPING_FLAT_FEE = Number(process.env.SHIPPING_FLAT_FEE ?? 30000);
const SHIPPING_FREE_THRESHOLD = Number(process.env.SHIPPING_FREE_THRESHOLD ?? 500000);

// Shipping fee for an order: 0 for digital-only or when the goods subtotal
// reaches the free-ship threshold; otherwise the flat fee.
function computeShippingFee(hasPhysical: boolean, goodsSubtotalAfterDiscount: number): number {
  if (!hasPhysical) return 0;
  if (goodsSubtotalAfterDiscount >= SHIPPING_FREE_THRESHOLD) return 0;
  return SHIPPING_FLAT_FEE;
}

function normalizeProductCategoryName(name?: string | null): string | null {
  if (!name) return null;
  const trimmed = name.trim();
  if (!trimmed) return null;
  return trimmed;
}

function productSlugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function ensureUniqueProductSlug(baseValue: string, excludeId?: number): Promise<string> {
  const baseSlug = productSlugify(baseValue) || `product-${Date.now()}`;
  let candidate = baseSlug;
  let suffix = 1;

  while (true) {
    const existing = await prisma.product.findFirst({
      where: {
        slug: candidate,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true },
    });

    if (!existing) return candidate;
    candidate = `${baseSlug}-${suffix++}`;
  }
}

async function resolveProductCategoryId(categoryName?: string | null): Promise<number | null> {
  const normalizedName = normalizeProductCategoryName(categoryName);
  if (!normalizedName) return null;

  const existing = await prisma.productCategory.findFirst({
    where: { name: { equals: normalizedName, mode: 'insensitive' } },
    select: { id: true },
  });

  if (existing) return existing.id;

  const created = await prisma.productCategory.create({
    data: {
      name: normalizedName,
      slug: productSlugify(normalizedName),
    },
    select: { id: true },
  });

  return created.id;
}

function parseProductSpecs(specs: unknown): Array<{ label: string; value: string }> {
  if (!Array.isArray(specs)) return [];
  return specs
    .filter((spec) => spec && typeof spec === 'object')
    .map((spec) => {
      const s = spec as { label?: unknown; value?: unknown };
      return {
        label: typeof s.label === 'string' ? s.label : '',
        value: typeof s.value === 'string' ? s.value : '',
      };
    })
    .filter((spec) => spec.label || spec.value);
}

// Store an images array as a JSON string (the `images` Text column).
function serializeImagesForStore(images: unknown): string | null {
  if (Array.isArray(images)) {
    const arr = images.filter((u): u is string => typeof u === 'string' && u.trim().length > 0);
    return arr.length ? JSON.stringify(arr) : null;
  }
  if (typeof images === 'string') return images.trim() || null;
  return null;
}

function normalizeProductType(t: unknown): 'PHYSICAL' | 'DIGITAL' {
  return t === 'PHYSICAL' ? 'PHYSICAL' : 'DIGITAL';
}

// Parse the `images` Text column (JSON array of URLs) into a string[].
function parseProductImages(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) return arr.filter((u) => typeof u === 'string');
  } catch { /* legacy comma-separated fallback */ }
  return String(raw).split(',').map((s) => s.trim()).filter(Boolean);
}

interface SerializableProduct {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  thumbnailUrl: string | null;
  images: string | null;
  price: any;
  originalPrice: any;
  stockQuantity: number;
  soldCount: number;
  featured: boolean;
  active: boolean;
  isHot: boolean;
  isNew: boolean;
  sortOrder?: number;
  categoryId: number | null;
  type: string;
  fileUrl: string | null;
  digitalContent?: string | null;
  ratingAvg?: any;
  ratingCount?: number;
  specs: unknown;
  guidance: string | null;
  createdAt: Date;
  updatedAt: Date;
  category?: { id: number; name: string; slug: string | null; description: string | null; sortOrder: number } | null;
}

// `admin=true` includes the digital deliverables (fileUrl / digitalContent).
// Public responses MUST NOT include them — otherwise anyone could download a
// paid digital product for free.
function serializeProduct(product: SerializableProduct, admin = false) {
  const base = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    shortDescription: product.shortDescription,
    thumbnailUrl: product.thumbnailUrl,
    images: parseProductImages(product.images),
    price: Number(product.price),
    originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
    stockQuantity: product.stockQuantity,
    soldCount: product.soldCount,
    featured: product.featured,
    active: product.active,
    isHot: product.isHot,
    isNew: product.isNew,
    sortOrder: product.sortOrder ?? 0,
    categoryId: product.categoryId,
    categoryName: product.category?.name,
    categorySlug: product.category?.slug,
    type: product.type,
    ratingAvg: product.ratingAvg !== undefined && product.ratingAvg !== null ? Number(product.ratingAvg) : 0,
    ratingCount: product.ratingCount ?? 0,
    specs: Array.isArray(product.specs) ? product.specs : parseProductSpecs(product.specs),
    guidance: product.guidance,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
  if (admin) {
    return { ...base, fileUrl: product.fileUrl, digitalContent: product.digitalContent ?? null };
  }
  return base;
}

// ─── GET /api/v1/shop/categories ─────────────────────
router.get('/categories', async (_req, res: Response<ApiResponse>, next) => {
  try {
    const categories = await prisma.productCategory.findMany({
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
    res.json({ success: true, data: categories });
  } catch (error) { next(error); }
});

// ─── GET /api/v1/shop/products/featured ───────────────
router.get('/products/featured', async (req, res: Response<ApiResponse>, next) => {
  try {
    const limit = Math.min(20, Math.max(1, parseInt(String(req.query.limit || '8'), 10)));
    const products = await prisma.product.findMany({
      where: { active: true, featured: true },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    });
    res.json({ success: true, data: products.map((p) => serializeProduct(p)) });
  } catch (error) { next(error); }
});

// ─── GET /api/v1/shop/products ───────────────────────
router.get('/products', async (req, res: Response<ApiResponse>, next) => {
  try {
    // Page is 0-indexed (offset = page * size). Previously the default
    // was `1`, which combined with the unsigned `pageNumber * pageSize`
    // skip offset silently jumped past every product whenever a caller
    // omitted the page query (e.g. the admin reload fetcher
    // `getProducts({ size: 100 })`). Public `/shop` would show 0
    // products even though the total count was correct.
    const { page = 0, size = 12, keyword, search, category, featured, sort } = req.query;
    const pageNumber = Math.max(0, Number(page) || 0);
    const pageSize = Math.max(1, Number(size) || 12);
    const skip = pageNumber * pageSize;
    const searchKeyword = keyword || search;
    const where: Record<string, unknown> = { active: true };
    if (searchKeyword) where.OR = [{ name: { contains: String(searchKeyword), mode: 'insensitive' } }, { description: { contains: String(searchKeyword), mode: 'insensitive' } }, { shortDescription: { contains: String(searchKeyword), mode: 'insensitive' } }];
    if (category) where.category = { slug: String(category) };
    if (featured !== undefined) where.featured = String(featured) === 'true';

    // Sort options for the shop grid. Default = admin manual order
    // (sortOrder asc, then newest) so the storefront respects drag/arrange.
    const orderBy: Prisma.ProductOrderByWithRelationInput | Prisma.ProductOrderByWithRelationInput[] =
      sort === 'price_asc' ? { price: 'asc' }
      : sort === 'price_desc' ? { price: 'desc' }
      : sort === 'bestselling' ? { soldCount: 'desc' }
      : sort === 'newest' ? { createdAt: 'desc' }
      : [{ sortOrder: 'asc' }, { createdAt: 'desc' }];

    const [products, total] = await Promise.all([
      prisma.product.findMany({ where, skip, take: pageSize, orderBy, include: { category: true } }),
      prisma.product.count({ where }),
    ]);
    res.json({ success: true, data: products.map((p) => serializeProduct(p)), pagination: { page: pageNumber, limit: pageSize, total, totalPages: Math.ceil(total / pageSize) } });
  } catch (error) { next(error); }
});

// ─── GET /api/v1/shop/products/:slug ──────────────────
router.get('/products/:slug', async (req, res: Response<ApiResponse>, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug },
      include: { category: true },
    });
    if (!product || !product.active) throw new AppError('Product not found', 404);
    res.json({ success: true, data: serializeProduct(product) });
  } catch (error) { next(error); }
});

// ─── GET /api/v1/shop/products/:slug/similar ──────────
// "Sản phẩm tương tự": other active products in the same category (falls
// back to newest overall if the product has no category), most-sold first.
router.get('/products/:slug/similar', async (req, res: Response<ApiResponse>, next) => {
  try {
    const limit = Math.min(12, Math.max(1, parseInt(String(req.query.limit || '8'), 10)));
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug },
      select: { id: true, categoryId: true },
    });
    if (!product) throw new AppError('Product not found', 404);

    const baseWhere: Record<string, unknown> = { active: true, NOT: { id: product.id } };
    let products = product.categoryId
      ? await prisma.product.findMany({
          where: { ...baseWhere, categoryId: product.categoryId },
          take: limit,
          orderBy: [{ soldCount: 'desc' }, { createdAt: 'desc' }],
          include: { category: true },
        })
      : [];

    // Backfill with newest products if the category didn't yield enough.
    if (products.length < limit) {
      const excludeIds = [product.id, ...products.map((p) => p.id)];
      const fill = await prisma.product.findMany({
        where: { active: true, NOT: { id: { in: excludeIds } } },
        take: limit - products.length,
        orderBy: { createdAt: 'desc' },
        include: { category: true },
      });
      products = [...products, ...fill];
    }

    res.json({ success: true, data: products.map((p) => serializeProduct(p)) });
  } catch (error) { next(error); }
});

// ─── Product reviews (verified purchase) ─────────────
// Recompute the denormalized rating aggregate from approved reviews.
async function recomputeProductRating(productId: number): Promise<void> {
  const agg = await prisma.productReview.aggregate({
    where: { productId, isApproved: true },
    _avg: { rating: true },
    _count: { _all: true },
  });
  await prisma.product.update({
    where: { id: productId },
    data: {
      ratingAvg: agg._avg.rating ? Math.round(agg._avg.rating * 100) / 100 : 0,
      ratingCount: agg._count._all,
    },
  });
}

// Has this user actually bought this product (a PAID order containing it)?
async function hasPurchasedProduct(userId: number, productName: string): Promise<boolean> {
  const order = await prisma.shopOrder.findFirst({
    where: { userId, status: 'PAID', items: { some: { productName } } },
    select: { id: true },
  });
  return !!order;
}

// GET reviews for a product (public — approved only) + summary.
router.get('/products/:slug/reviews', async (req, res: Response<ApiResponse>, next) => {
  try {
    const product = await prisma.product.findUnique({ where: { slug: req.params.slug }, select: { id: true, ratingAvg: true, ratingCount: true } });
    if (!product) throw new AppError('Product not found', 404);
    const reviews = await prisma.productReview.findMany({
      where: { productId: product.id, isApproved: true },
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: { user: { select: { id: true, fullName: true, username: true, avatarUrl: true } } },
    });
    res.json({
      success: true,
      data: {
        average: Number(product.ratingAvg),
        count: product.ratingCount,
        reviews: reviews.map((r) => ({
          id: r.id,
          rating: r.rating,
          comment: r.comment,
          createdAt: r.createdAt,
          userId: r.userId,
          userName: r.user?.fullName || r.user?.username || 'Người dùng',
          userAvatar: r.user?.avatarUrl || null,
        })),
      },
    });
  } catch (error) { next(error); }
});

// POST a review (auth + verified purchase). Upserts (one per user/product).
router.post('/products/:id/reviews', authenticate, async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const productId = parseInt(req.params.id, 10);
    if (!Number.isInteger(productId)) throw new AppError('ID san pham khong hop le', 400);
    const rating = Math.round(Number((req.body as { rating?: unknown }).rating));
    const comment = String((req.body as { comment?: unknown }).comment ?? '').trim() || null;
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) throw new AppError('So sao phai tu 1 den 5', 400);

    const product = await prisma.product.findUnique({ where: { id: productId }, select: { id: true, name: true } });
    if (!product) throw new AppError('Product not found', 404);
    if (!(await hasPurchasedProduct(req.userId, product.name))) {
      throw new AppError('Chi khach da mua san pham moi duoc danh gia', 403);
    }

    await prisma.productReview.upsert({
      where: { productId_userId: { productId, userId: req.userId } },
      create: { productId, userId: req.userId, rating, comment, isApproved: true },
      update: { rating, comment, isApproved: true },
    });
    await recomputeProductRating(productId);
    res.status(201).json({ success: true, message: 'Da gui danh gia' });
  } catch (error) { next(error); }
});

// DELETE own review (the author).
router.delete('/reviews/:id', authenticate, async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const review = await prisma.productReview.findUnique({ where: { id } });
    if (!review) throw new AppError('Review not found', 404);
    if (review.userId !== req.userId) throw new AppError('Khong co quyen', 403);
    await prisma.productReview.delete({ where: { id } });
    await recomputeProductRating(review.productId);
    res.json({ success: true, message: 'Da xoa danh gia' });
  } catch (error) { next(error); }
});

// Admin: hard-delete any review.
router.delete('/admin/reviews/:id', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const review = await prisma.productReview.findUnique({ where: { id } });
    if (!review) throw new AppError('Review not found', 404);
    await prisma.productReview.delete({ where: { id } });
    await recomputeProductRating(review.productId);
    res.json({ success: true, message: 'Da xoa danh gia' });
  } catch (error) { next(error); }
});

// Admin: list all reviews for moderation.
router.get('/admin/reviews', authenticate, requireAdmin('ROLE_ADMIN'), async (_req, res: Response<ApiResponse>, next) => {
  try {
    const reviews = await prisma.productReview.findMany({
      orderBy: { createdAt: 'desc' },
      take: 300,
      include: {
        user: { select: { fullName: true, username: true } },
        product: { select: { name: true, slug: true } },
      },
    });
    res.json({
      success: true,
      data: reviews.map((r) => ({
        id: r.id, rating: r.rating, comment: r.comment, isApproved: r.isApproved, createdAt: r.createdAt,
        userName: r.user?.fullName || r.user?.username || 'Người dùng',
        productName: r.product?.name, productSlug: r.product?.slug,
      })),
    });
  } catch (error) { next(error); }
});

// Admin: approve/hide a review.
router.patch('/admin/reviews/:id', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const isApproved = Boolean((req.body as { isApproved?: unknown }).isApproved);
    const review = await prisma.productReview.update({ where: { id }, data: { isApproved } });
    await recomputeProductRating(review.productId);
    res.json({ success: true, message: 'Da cap nhat danh gia' });
  } catch (error) { next(error); }
});

// ─── GET /api/v1/shop/admin/products ─────────────────
router.get('/admin/products', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const { page = 0, size = 50, keyword, category } = req.query;
    const pageNumber = Math.max(0, Number(page));
    const pageSize = Math.max(1, Number(size));
    const skip = pageNumber * pageSize;

    const where: Record<string, unknown> = {};
    if (keyword) {
      where.OR = [
        { name: { contains: String(keyword), mode: 'insensitive' } },
        { description: { contains: String(keyword), mode: 'insensitive' } },
        { shortDescription: { contains: String(keyword), mode: 'insensitive' } },
        { slug: { contains: String(keyword), mode: 'insensitive' } },
      ];
    }
    if (category) {
      where.category = { name: { equals: String(category), mode: 'insensitive' } };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({ where, skip, take: pageSize, orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }], include: { category: true } }),
      prisma.product.count({ where }),
    ]);

    res.json({
      success: true,
      data: products.map((p) => serializeProduct(p, true)),
      pagination: { page: pageNumber, limit: pageSize, total, totalPages: Math.ceil(total / pageSize) },
    });
  } catch (error) { next(error); }
});

// ─── POST /api/v1/shop/admin/products ────────────────
router.post('/admin/products', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const {
      name,
      slug,
      description,
      shortDescription,
      thumbnailUrl,
      price,
      originalPrice,
      stockQuantity,
      featured,
      isHot,
      isNew,
      sortOrder,
      categoryId: categoryIdInput,
      categoryName,
      type,
      fileUrl,
      digitalContent,
      images,
      specs,
      guidance,
      active,
    } = req.body;

    if (!name?.trim()) throw new AppError('Product name is required', 400);
    if (price === undefined || Number(price) < 0) throw new AppError('Valid price is required', 400);

    // Prefer an explicit categoryId (dropdown); fall back to categoryName
    // (legacy free-text, which upserts a category).
    const categoryId = categoryIdInput !== undefined && categoryIdInput !== null && categoryIdInput !== ''
      ? Number(categoryIdInput)
      : await resolveProductCategoryId(categoryName);
    const normalizedSlug = await ensureUniqueProductSlug(slug?.trim() || name, undefined);

    const created = await prisma.product.create({
      data: {
        name: String(name).trim(),
        slug: normalizedSlug,
        description: description?.trim() || null,
        shortDescription: shortDescription?.trim() || null,
        thumbnailUrl: thumbnailUrl?.trim() || null,
        price: Number(price),
        originalPrice: originalPrice !== undefined && originalPrice !== null && originalPrice !== '' ? Number(originalPrice) : null,
        stockQuantity: Number(stockQuantity ?? 0),
        featured: Boolean(featured),
        isHot: Boolean(isHot),
        isNew: Boolean(isNew),
        sortOrder: Number.isFinite(Number(sortOrder)) ? Number(sortOrder) : 0,
        active: active !== undefined ? Boolean(active) : true,
        categoryId,
        type: normalizeProductType(type),
        fileUrl: fileUrl?.trim() || null,
        digitalContent: digitalContent?.trim() || null,
        images: serializeImagesForStore(images),
        specs: parseProductSpecs(specs),
        guidance: guidance?.trim() || null,
      },
      include: { category: true },
    });

    res.status(201).json({ success: true, data: serializeProduct(created, true), message: 'Product created successfully' });
  } catch (error) { next(error); }
});

// ─── PUT /api/v1/shop/admin/products/:id ─────────────
router.put('/admin/products/:id', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) throw new AppError('Product not found', 404);

    const {
      name,
      slug,
      description,
      shortDescription,
      thumbnailUrl,
      price,
      originalPrice,
      stockQuantity,
      featured,
      isHot,
      isNew,
      sortOrder,
      categoryId: categoryIdInput,
      categoryName,
      type,
      fileUrl,
      digitalContent,
      images,
      specs,
      guidance,
      active,
    } = req.body;

    const categoryProvided = categoryIdInput !== undefined || categoryName !== undefined;
    const categoryId = categoryIdInput !== undefined
      ? (categoryIdInput === null || categoryIdInput === '' ? null : Number(categoryIdInput))
      : (categoryName !== undefined ? await resolveProductCategoryId(categoryName) : existing.categoryId);
    const normalizedSlug = name || slug ? await ensureUniqueProductSlug(slug?.trim() || name || existing.name, id) : existing.slug;

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: String(name).trim() }),
        slug: normalizedSlug,
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(shortDescription !== undefined && { shortDescription: shortDescription?.trim() || null }),
        ...(thumbnailUrl !== undefined && { thumbnailUrl: thumbnailUrl?.trim() || null }),
        ...(price !== undefined && { price: Number(price) }),
        ...(originalPrice !== undefined && { originalPrice: originalPrice !== null && originalPrice !== '' ? Number(originalPrice) : null }),
        ...(stockQuantity !== undefined && { stockQuantity: Number(stockQuantity) }),
        ...(featured !== undefined && { featured: Boolean(featured) }),
        ...(isHot !== undefined && { isHot: Boolean(isHot) }),
        ...(isNew !== undefined && { isNew: Boolean(isNew) }),
        ...(sortOrder !== undefined && { sortOrder: Number(sortOrder) || 0 }),
        ...(active !== undefined && { active: Boolean(active) }),
        ...(categoryProvided && { categoryId }),
        ...(type !== undefined && { type: normalizeProductType(type) }),
        ...(fileUrl !== undefined && { fileUrl: fileUrl?.trim() || null }),
        ...(digitalContent !== undefined && { digitalContent: digitalContent?.trim() || null }),
        ...(images !== undefined && { images: serializeImagesForStore(images) }),
        ...(specs !== undefined && { specs: parseProductSpecs(specs) }),
        ...(guidance !== undefined && { guidance: guidance?.trim() || null }),
      },
      include: { category: true },
    });

    res.json({ success: true, data: serializeProduct(updated, true), message: 'Product updated successfully' });
  } catch (error) { next(error); }
});

// ─── PATCH /api/v1/shop/admin/products/reorder ───────
// Persist a manual product order: body { ids: number[] } in the desired
// order → sortOrder = index. (Registered before :id so it isn't shadowed.)
router.patch('/admin/products/reorder', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const ids = (req.body as { ids?: unknown })?.ids;
    if (!Array.isArray(ids) || ids.some((x) => !Number.isInteger(Number(x)))) {
      throw new AppError('Danh sách ID không hợp lệ', 400);
    }
    await prisma.$transaction(
      ids.map((id, index) => prisma.product.update({ where: { id: Number(id) }, data: { sortOrder: index } })),
    );
    res.json({ success: true, message: 'Đã lưu thứ tự sản phẩm' });
  } catch (error) { next(error); }
});

// ─── DELETE /api/v1/shop/admin/products/:id ──────────
router.delete('/admin/products/:id', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!Number.isInteger(id)) throw new AppError('ID san pham khong hop le', 400);
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) throw new AppError('Product not found', 404);

    try {
      await prisma.product.delete({ where: { id } });
    } catch (e) {
      // P2003 = FK still references this product (e.g. an old order row on a
      // DB where the FK-drop migration hasn't run). Order items keep their own
      // name snapshot, so it's safe to just deactivate instead of hard-delete.
      if ((e as { code?: string })?.code === 'P2003') {
        await prisma.product.update({ where: { id }, data: { active: false } });
        res.json({ success: true, message: 'San pham dang duoc tham chieu boi don hang cu — da an khoi cua hang.' });
        return;
      }
      throw e;
    }
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) { next(error); }
});

// ─── Admin: product categories CRUD ──────────────────
// Lets the admin add/rename/reorder/delete shop categories freely
// (tool / sách / tài liệu / sản phẩm thật / ...).
async function ensureUniqueCategorySlug(name: string, excludeId?: number): Promise<string> {
  const base = productSlugify(name) || `cat-${Date.now()}`;
  let candidate = base;
  let suffix = 1;
  while (true) {
    const existing = await prisma.productCategory.findFirst({
      where: { slug: candidate, ...(excludeId ? { NOT: { id: excludeId } } : {}) },
      select: { id: true },
    });
    if (!existing) return candidate;
    candidate = `${base}-${suffix++}`;
  }
}

// GET admin categories with product counts.
router.get('/admin/categories', authenticate, requireAdmin('ROLE_ADMIN'), async (_req, res: Response<ApiResponse>, next) => {
  try {
    const categories = await prisma.productCategory.findMany({
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      include: { _count: { select: { products: true } } },
    });
    res.json({
      success: true,
      data: categories.map((c) => ({
        id: c.id, name: c.name, slug: c.slug, description: c.description,
        sortOrder: c.sortOrder, productCount: c._count.products,
      })),
    });
  } catch (error) { next(error); }
});

router.post('/admin/categories', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const name = normalizeProductCategoryName(req.body?.name);
    if (!name) throw new AppError('Ten danh muc khong duoc de trong', 400);
    const dup = await prisma.productCategory.findFirst({ where: { name: { equals: name, mode: 'insensitive' } }, select: { id: true } });
    if (dup) throw new AppError('Danh muc da ton tai', 409);
    const created = await prisma.productCategory.create({
      data: {
        name,
        slug: await ensureUniqueCategorySlug(name),
        description: req.body?.description?.trim() || null,
        sortOrder: Number.isFinite(Number(req.body?.sortOrder)) ? Number(req.body.sortOrder) : 0,
      },
    });
    res.status(201).json({ success: true, data: created, message: 'Category created' });
  } catch (error) { next(error); }
});

router.put('/admin/categories/:id', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = await prisma.productCategory.findUnique({ where: { id } });
    if (!existing) throw new AppError('Category not found', 404);
    const nextName = req.body?.name !== undefined ? normalizeProductCategoryName(req.body.name) : existing.name;
    if (!nextName) throw new AppError('Ten danh muc khong duoc de trong', 400);
    const updated = await prisma.productCategory.update({
      where: { id },
      data: {
        name: nextName,
        ...(req.body?.name !== undefined && nextName !== existing.name ? { slug: await ensureUniqueCategorySlug(nextName, id) } : {}),
        ...(req.body?.description !== undefined && { description: req.body.description?.trim() || null }),
        ...(req.body?.sortOrder !== undefined && { sortOrder: Number(req.body.sortOrder) || 0 }),
      },
    });
    res.json({ success: true, data: updated, message: 'Category updated' });
  } catch (error) { next(error); }
});

router.delete('/admin/categories/:id', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = await prisma.productCategory.findUnique({ where: { id } });
    if (!existing) throw new AppError('Category not found', 404);
    // Detach products first (categoryId is a nullable FK) so deleting a
    // category never orphans / cascades products.
    await prisma.product.updateMany({ where: { categoryId: id }, data: { categoryId: null } });
    await prisma.productCategory.delete({ where: { id } });
    res.json({ success: true, message: 'Category deleted' });
  } catch (error) { next(error); }
});

// ─── GET /api/v1/shop/admin/orders ───────────────────
router.get('/admin/orders', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const { page = 0, size = 100, status } = req.query;
    const pageNumber = Math.max(0, Number(page));
    const pageSize = Math.max(1, Number(size));
    const skip = pageNumber * pageSize;
    const where = status ? { status: String(status) } : {};

    const [orders, total] = await Promise.all([
      prisma.shopOrder.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: { items: true },
      }),
      prisma.shopOrder.count({ where }),
    ]);

    res.json({ success: true, data: orders, pagination: { page: pageNumber, limit: pageSize, total, totalPages: Math.ceil(total / pageSize) } });
  } catch (error) { next(error); }
});

// ─── PUT /api/v1/shop/admin/orders/:id/status ────────
router.put('/admin/orders/:id/status', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    // Canonical shop-order statuses match the payment layer + CourseOrder:
    // PENDING | PAID | FAILED | CANCELLED. Legacy 'COMPLETED' (older admin
    // builds) is normalised to PAID. REFUNDED is NOT settable here — it must go
    // through POST /admin/orders/:id/refund so the refund audit fields are set.
    let status = String(req.body.status || '').toUpperCase();
    if (status === 'COMPLETED') status = 'PAID';
    const allowed = ['PENDING', 'PAID', 'FAILED', 'CANCELLED'];
    if (!allowed.includes(status)) {
      throw new AppError('Trang thai khong hop le (dung /refund de hoan tien)', 400);
    }

    const isPaid = status === 'PAID';
    const updated = await prisma.shopOrder.update({
      where: { id },
      data: {
        status,
        paymentStatus: isPaid ? 'PAID' : undefined,
        paidAt: isPaid ? new Date() : undefined,
      },
      include: { items: true },
    });

    res.json({ success: true, data: updated, message: 'Order status updated successfully' });
  } catch (error) { next(error); }
});

// ─── POST /api/v1/shop/admin/orders/:id/refund ───────
// Full or partial refund of a PAID shop order (mirrors the course refund).
// Body: { refundAmount?: number, reason: string }
//   - refundAmount omitted / >= total → full refund; < total → partial.
// Marks the order REFUNDED, records the audit fields, and (physical goods)
// restocks the returned items. Idempotent-guarded: only a PAID, not-yet-
// refunded order can be refunded.
router.post('/admin/orders/:id/refund', authenticate, requireAdmin('ROLE_ADMIN'), async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const reason = String(req.body.reason || '').trim();
    if (!reason) throw new AppError('Ly do hoan tien la bat buoc', 400);
    if (reason.length > 500) throw new AppError('Ly do qua dai (toi da 500 ky tu)', 400);

    const order = await prisma.shopOrder.findUnique({ where: { id }, include: { items: true } });
    if (!order) throw new AppError('Khong tim thay don hang', 404);
    if (order.status !== 'PAID') {
      throw new AppError(`Chi hoan tien duoc don da thanh toan (dang: ${order.status})`, 400);
    }
    if (order.refundAmount !== null) {
      throw new AppError('Don hang da duoc hoan tien truoc do', 409);
    }

    const total = Number(order.total);
    const refundAmount =
      req.body.refundAmount === undefined || req.body.refundAmount === null
        ? total
        : Number(req.body.refundAmount);
    if (isNaN(refundAmount) || refundAmount <= 0) {
      throw new AppError('So tien hoan phai la so duong', 400);
    }
    if (refundAmount > total) {
      throw new AppError('So tien hoan khong duoc lon hon tong don', 400);
    }
    const isFullRefund = refundAmount >= total;

    const updated = await prisma.$transaction(async (tx) => {
      const row = await tx.shopOrder.update({
        where: { id: order.id },
        data: {
          status: 'REFUNDED',
          paymentStatus: 'REFUNDED',
          refundAmount,
          refundReason: reason,
          refundedAt: new Date(),
          refundedBy: req.userId ?? null,
        },
        include: { items: true },
      });
      // On a FULL refund of physical goods the customer is returning the item,
      // so put the stock back (guarded; digital items have unlimited stock).
      if (isFullRefund) {
        for (const item of order.items) {
          if ((item.productType || 'DIGITAL') === 'PHYSICAL') {
            await tx.product.updateMany({
              where: { name: item.productName },
              data: { stockQuantity: { increment: item.quantity }, soldCount: { decrement: item.quantity } },
            });
          }
        }
      }
      return row;
    });

    res.json({ success: true, data: updated, message: 'Da hoan tien don hang' });
  } catch (error) { next(error); }
});

// ─── PATCH /api/v1/shop/admin/orders/:id/fulfillment ─
// Physical-order shipping lifecycle: PROCESSING → SHIPPED → DELIVERED →
// COMPLETED (+ tracking number). Stamps shippedAt / deliveredAt.
router.patch('/admin/orders/:id/fulfillment', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { fulfillmentStatus, trackingNumber } = req.body as { fulfillmentStatus?: string; trackingNumber?: string };
    const allowed = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED'];
    if (fulfillmentStatus !== undefined && !allowed.includes(String(fulfillmentStatus))) {
      throw new AppError('Trang thai giao hang khong hop le', 400);
    }
    const updated = await prisma.shopOrder.update({
      where: { id },
      data: {
        ...(fulfillmentStatus !== undefined && { fulfillmentStatus: String(fulfillmentStatus) }),
        ...(trackingNumber !== undefined && { trackingNumber: String(trackingNumber).trim() || null }),
        ...(fulfillmentStatus === 'SHIPPED' && { shippedAt: new Date() }),
        ...(fulfillmentStatus === 'DELIVERED' && { deliveredAt: new Date() }),
      },
      include: { items: true },
    });
    res.json({ success: true, data: updated, message: 'Da cap nhat trang thai giao hang' });
  } catch (error) { next(error); }
});

// ─── GET /api/v1/shop/admin/discounts ────────────────
router.get('/admin/discounts', authenticate, requireAdmin('ROLE_ADMIN'), async (_req, res: Response<ApiResponse>, next) => {
  try {
    const discounts = await prisma.discountCode.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data: discounts });
  } catch (error) { next(error); }
});

// ─── POST /api/v1/shop/admin/discounts ───────────────
router.post('/admin/discounts', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const created = await prisma.discountCode.create({
      data: {
        code: String(req.body.code).toUpperCase().trim(),
        description: req.body.description?.trim() || null,
        discountType: req.body.discountType || 'PERCENT',
        discountValue: Number(req.body.discountValue),
        minOrderAmount: Number(req.body.minOrderAmount || 0),
        maxDiscountAmount: req.body.maxDiscountAmount !== undefined ? Number(req.body.maxDiscountAmount) : null,
        maxUses: req.body.maxUses !== undefined ? Number(req.body.maxUses) : null,
        expiresAt: req.body.expiresAt ? new Date(req.body.expiresAt) : null,
        active: req.body.active !== undefined ? Boolean(req.body.active) : true,
      },
    });
    res.status(201).json({ success: true, data: created, message: 'Discount created successfully' });
  } catch (error) { next(error); }
});

// ─── PUT /api/v1/shop/admin/discounts/:id ────────────
router.put('/admin/discounts/:id', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const updated = await prisma.discountCode.update({
      where: { id },
      data: {
        ...(req.body.code !== undefined && { code: String(req.body.code).toUpperCase().trim() }),
        ...(req.body.description !== undefined && { description: req.body.description?.trim() || null }),
        ...(req.body.discountType !== undefined && { discountType: req.body.discountType }),
        ...(req.body.discountValue !== undefined && { discountValue: Number(req.body.discountValue) }),
        ...(req.body.minOrderAmount !== undefined && { minOrderAmount: Number(req.body.minOrderAmount) }),
        ...(req.body.maxDiscountAmount !== undefined && { maxDiscountAmount: req.body.maxDiscountAmount !== null && req.body.maxDiscountAmount !== '' ? Number(req.body.maxDiscountAmount) : null }),
        ...(req.body.maxUses !== undefined && { maxUses: req.body.maxUses !== null && req.body.maxUses !== '' ? Number(req.body.maxUses) : null }),
        ...(req.body.expiresAt !== undefined && { expiresAt: req.body.expiresAt ? new Date(req.body.expiresAt) : null }),
        ...(req.body.active !== undefined && { active: Boolean(req.body.active) }),
      },
    });
    res.json({ success: true, data: updated, message: 'Discount updated successfully' });
  } catch (error) { next(error); }
});

// ─── DELETE /api/v1/shop/admin/discounts/:id ─────────
router.delete('/admin/discounts/:id', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.discountCode.delete({ where: { id } });
    res.json({ success: true, message: 'Discount deleted successfully' });
  } catch (error) { next(error); }
});

// ─── GET /api/v1/shop/discount/:code ─────────────────
router.get('/discount/:code', async (req, res: Response<ApiResponse>, next) => {
  try {
    const code = await prisma.discountCode.findUnique({ where: { code: req.params.code } });
    if (!code || !code.active) throw new AppError('Invalid discount code', 404);
    if (code.expiresAt && code.expiresAt < new Date()) throw new AppError('Discount code has expired', 400);
    if (code.maxUses && code.usedCount >= code.maxUses) throw new AppError('Discount code usage limit reached', 400);
    res.json({ success: true, data: code });
  } catch (error) { next(error); }
});

// ─── POST /api/v1/shop/orders ────────────────────────
router.post('/orders', async (req, res: Response<ApiResponse>, next) => {
  try {
    const { buyerName, buyerEmail, buyerPhone, buyerAddress, shippingProvince, items, discountCode } = req.body;

    if (!buyerName || !buyerEmail || !items?.length) {
      throw new AppError('Missing required fields', 400);
    }

    // Calculate totals
    let subtotal = 0;
    const orderItems = [];
    let hasPhysical = false;
    let hasDigital = false;

    for (const item of items) {
      // Validate quantity — a client-controlled multiplier. Reject
      // non-positive / non-integer / absurd values (negative would flip the
      // total negative; huge would DoS / oversell).
      const qty = Number(item.quantity);
      if (!Number.isInteger(qty) || qty < 1 || qty > 1000) {
        throw new AppError('So luong khong hop le', 400);
      }
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) throw new AppError(`Product ${item.productId} not found`, 404);
      const itemTotal = Number(product.price) * qty;
      subtotal += itemTotal;
      const pType = normalizeProductType(product.type);
      if (pType === 'PHYSICAL') hasPhysical = true; else hasDigital = true;
      orderItems.push({
        productName: product.name,
        productSlug: product.slug,
        productImage: product.thumbnailUrl,
        price: product.price,
        quantity: qty,
        total: itemTotal,
        productType: pType,
        // The digital deliverable (fileUrl / digitalContent) is copied onto the
        // item ONLY at fulfillment (payment) — never on an unpaid order, or the
        // owner could read it before paying.
        fileUrl: null,
        digitalContent: null,
      });
    }

    // Physical goods require a delivery address.
    if (hasPhysical && !String(buyerAddress || '').trim()) {
      throw new AppError('Vui long nhap dia chi giao hang cho san pham vat ly', 400);
    }
    const orderType = hasPhysical && hasDigital ? 'MIXED' : hasPhysical ? 'PHYSICAL' : 'DIGITAL';

    let discountAmount = 0;
    if (discountCode) {
      const discount = await prisma.discountCode.findUnique({ where: { code: discountCode } });
      const now = new Date();
      const usable = discount
        && discount.active
        && (!discount.startsAt || discount.startsAt <= now)
        && (!discount.expiresAt || discount.expiresAt > now)
        && (discount.maxUses === null || discount.usedCount < discount.maxUses)
        && (discount.userId === null); // shop coupons must be public (not user-scoped)
      if (usable && discount) {
        if (discount.minOrderAmount && subtotal < Number(discount.minOrderAmount)) {
          throw new AppError(`Minimum order amount is ${discount.minOrderAmount}`, 400);
        }
        if (discount.discountType === 'PERCENT') {
          discountAmount = subtotal * Number(discount.discountValue) / 100;
          if (discount.maxDiscountAmount && discountAmount > Number(discount.maxDiscountAmount)) {
            discountAmount = Number(discount.maxDiscountAmount);
          }
        } else {
          // FIXED — never exceed the subtotal, or the total goes negative.
          discountAmount = Math.min(Number(discount.discountValue), subtotal);
        }
      }
    }

    // Clamp so a discount can never make the goods total negative, then add
    // shipping (physical only, waived over the free-ship threshold).
    const goodsTotal = Math.max(0, subtotal - discountAmount);
    const shippingFee = computeShippingFee(hasPhysical, goodsTotal);
    const total = goodsTotal + shippingFee;
    const orderCode = `ORD-${Date.now()}-${nanoid(6).toUpperCase()}`;

    const order = await prisma.shopOrder.create({
      data: {
        orderCode,
        buyerName,
        buyerEmail,
        buyerPhone,
        buyerAddress,
        shippingProvince: shippingProvince?.trim() || null,
        subtotal,
        discountAmount,
        discountCode,
        shippingFee,
        total,
        orderType,
        // Digital-only orders are "fulfilled" the moment they're paid; physical
        // orders start their shipping lifecycle at PROCESSING (set on payment).
        fulfillmentStatus: 'PENDING',
        status: 'PENDING',
        items: { create: orderItems },
      },
      include: { items: true },
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) { next(error); }
});

// ─── GET /api/v1/shop/shipping-config ────────────────
// Public: lets the checkout show the flat fee + free-ship threshold.
router.get('/shipping-config', (_req, res: Response<ApiResponse>) => {
  res.json({ success: true, data: { flatFee: SHIPPING_FLAT_FEE, freeThreshold: SHIPPING_FREE_THRESHOLD } });
});

// ─── POST /api/v1/shop/check-usage ───────────────────
// "Check usage" tool: the buyer pastes an API/activation key and we return
// its usage/limits. The real data comes from a provider the shop owner wires
// up later via CHECK_USAGE_API_URL (POST {apiKey} → usage JSON). Until then we
// respond gracefully so the UI renders a "chưa cấu hình" state instead of an
// error. The key is NEVER logged or stored.
router.post('/check-usage', async (req, res: Response<ApiResponse>, next) => {
  try {
    const apiKey = String((req.body as { apiKey?: unknown })?.apiKey || '').trim();
    if (!apiKey) throw new AppError('Vui long nhap API key', 400);

    const providerUrl = process.env.CHECK_USAGE_API_URL;
    if (!providerUrl) {
      res.json({ success: true, data: { configured: false, message: 'Tính năng kiểm tra đang được cấu hình. Vui lòng quay lại sau.' } });
      return;
    }
    try {
      const r = await fetch(providerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(process.env.CHECK_USAGE_API_TOKEN ? { Authorization: `Bearer ${process.env.CHECK_USAGE_API_TOKEN}` } : {}) },
        body: JSON.stringify({ apiKey }),
      });
      const json = (await r.json().catch(() => ({}))) as Record<string, unknown>;
      if (!r.ok) {
        res.json({ success: true, data: { configured: true, ok: false, message: (json as { message?: string }).message || 'Không tìm thấy thông tin cho key này.' } });
        return;
      }
      res.json({ success: true, data: { configured: true, ok: true, usage: json } });
    } catch {
      throw new AppError('Không kết nối được máy chủ kiểm tra', 502);
    }
  } catch (error) { next(error); }
});

// ─── GET /api/v1/shop/orders/my ─────────────────────
router.get('/orders/my', authenticate, async (req: any, res: Response<ApiResponse>, next) => {
  try {
    // Reconcile recent PENDING PayOS orders against PayOS first (webhook may
    // have lagged / not been wired), so the list reflects real paid state.
    const pending = await prisma.shopOrder.findMany({
      where: { userId: req.userId, status: 'PENDING', paymentMethod: 'PAYOS' },
      select: { id: true, status: true, paymentMethod: true },
      take: 20,
    });
    for (const o of pending) await reconcilePayosShopOrder(o);

    const orders = await prisma.shopOrder.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });

    res.json({ success: true, data: orders });
  } catch (error) { next(error); }
});

// ─── GET /api/v1/shop/orders/:code ───────────────────
// Public poll (after checkout redirect). SECURITY: order codes are
// guessable, so a non-owner must NOT receive buyer PII or the digital
// deliverable (fileUrl / credentials). The owner (authenticated) gets the
// full order — including goods once PAID; everyone else gets a minimal
// status shape only.
router.get('/orders/:code', optionalAuth, async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const code = req.params.code;
    let order = await prisma.shopOrder.findUnique({
      where: { orderCode: code },
      include: { items: true },
    });
    // PayOS rewrites the return URL's `orderCode` to ITS numeric code
    // (PAYOS_SHOP_ORDER_OFFSET + ShopOrder.id). Recover the order from it so
    // the shop return page can poll after a PayOS redirect.
    if (!order && /^\d+$/.test(code)) {
      const n = parseInt(code, 10);
      const id = n >= PAYOS_SHOP_ORDER_OFFSET ? n - PAYOS_SHOP_ORDER_OFFSET : n;
      order = await prisma.shopOrder.findUnique({ where: { id }, include: { items: true } });
    }
    if (!order) throw new AppError('Order not found', 404);

    // Webhook-independent confirmation: a still-PENDING PayOS order asks PayOS
    // directly whether it was paid and fulfills, then we re-read so the poller
    // immediately sees PAID (no "Đang xác nhận" spin forever).
    if (order.status === 'PENDING' && order.paymentMethod === 'PAYOS') {
      await reconcilePayosShopOrder(order);
      order = (await prisma.shopOrder.findUnique({ where: { id: order.id }, include: { items: true } })) ?? order;
    }

    const isOwner = order.userId != null && req.userId === order.userId;
    if (isOwner) {
      // Digital deliverables (file / account-key / credentials) are released to
      // the owner ONLY once PAID — defense-in-depth on top of only snapshotting
      // them at fulfillment.
      const paid = order.status === 'PAID';
      res.json({
        success: true,
        data: {
          ...order,
          items: order.items.map((it) => ({
            ...it,
            fileUrl: paid ? it.fileUrl : null,
            digitalContent: paid ? it.digitalContent : null,
            credentials: paid ? it.credentials : null,
          })),
        },
      });
      return;
    }

    // Non-owner / guest poll: status + non-sensitive summary only.
    res.json({
      success: true,
      data: {
        orderCode: order.orderCode,
        status: order.status,
        orderType: order.orderType,
        fulfillmentStatus: order.fulfillmentStatus,
        total: Number(order.total),
        subtotal: Number(order.subtotal),
        discountAmount: Number(order.discountAmount),
        shippingFee: Number(order.shippingFee),
        createdAt: order.createdAt,
        completedAt: (order as { completedAt?: Date | null }).completedAt ?? null,
        items: order.items.map((it) => ({
          productName: it.productName,
          productSlug: it.productSlug,
          productImage: it.productImage,
          price: Number(it.price),
          quantity: it.quantity,
          total: Number(it.total),
        })),
      },
    });
  } catch (error) { next(error); }
});

export default router;
