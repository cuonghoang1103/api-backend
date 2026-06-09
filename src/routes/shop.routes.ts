import { Router, type Response } from 'express';
import { nanoid } from 'nanoid';
import { prisma } from '../config/database.js';
import { authenticate, optionalAuth, requireAdmin } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();

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

function serializeProduct(product: {
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
  categoryId: number | null;
  type: string;
  fileUrl: string | null;
  specs: unknown;
  guidance: string | null;
  createdAt: Date;
  updatedAt: Date;
  category?: { id: number; name: string; slug: string | null; description: string | null; sortOrder: number } | null;
}) {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    shortDescription: product.shortDescription,
    thumbnailUrl: product.thumbnailUrl,
    images: product.images,
    price: Number(product.price),
    originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
    stockQuantity: product.stockQuantity,
    soldCount: product.soldCount,
    featured: product.featured,
    active: product.active,
    isHot: product.isHot,
    isNew: product.isNew,
    categoryId: product.categoryId,
    categoryName: product.category?.name,
    categorySlug: product.category?.slug,
    type: product.type,
    fileUrl: product.fileUrl,
    specs: Array.isArray(product.specs) ? product.specs : parseProductSpecs(product.specs),
    guidance: product.guidance,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

// ─── GET /api/v1/shop/categories ─────────────────────
router.get('/categories', async (req, res: Response<ApiResponse>, next) => {
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
    res.json({ success: true, data: products.map(serializeProduct) });
  } catch (error) { next(error); }
});

// ─── GET /api/v1/shop/products ───────────────────────
router.get('/products', async (req, res: Response<ApiResponse>, next) => {
  try {
    const { page = 1, size = 12, keyword, search, category, featured } = req.query;
    const pageNumber = Math.max(0, Number(page));
    const pageSize = Math.max(1, Number(size));
    const skip = pageNumber * pageSize;
    const searchKeyword = keyword || search;
    const where: Record<string, unknown> = { active: true };
    if (searchKeyword) where.OR = [{ name: { contains: String(searchKeyword), mode: 'insensitive' } }, { description: { contains: String(searchKeyword), mode: 'insensitive' } }, { shortDescription: { contains: String(searchKeyword), mode: 'insensitive' } }];
    if (category) where.category = { slug: String(category) };
    if (featured !== undefined) where.featured = String(featured) === 'true';

    const [products, total] = await Promise.all([
      prisma.product.findMany({ where, skip, take: pageSize, orderBy: { createdAt: 'desc' }, include: { category: true } }),
      prisma.product.count({ where }),
    ]);
    res.json({ success: true, data: products.map(serializeProduct), pagination: { page: pageNumber, limit: pageSize, total, totalPages: Math.ceil(total / pageSize) } });
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
      prisma.product.findMany({ where, skip, take: pageSize, orderBy: { createdAt: 'desc' }, include: { category: true } }),
      prisma.product.count({ where }),
    ]);

    res.json({
      success: true,
      data: products.map(serializeProduct),
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
      categoryName,
      fileUrl,
      specs,
      guidance,
      active,
    } = req.body;

    if (!name?.trim()) throw new AppError('Product name is required', 400);
    if (price === undefined || Number(price) < 0) throw new AppError('Valid price is required', 400);

    const categoryId = await resolveProductCategoryId(categoryName);
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
        active: active !== undefined ? Boolean(active) : true,
        categoryId,
        fileUrl: fileUrl?.trim() || null,
        specs: parseProductSpecs(specs),
        guidance: guidance?.trim() || null,
      },
      include: { category: true },
    });

    res.status(201).json({ success: true, data: serializeProduct(created), message: 'Product created successfully' });
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
      categoryName,
      fileUrl,
      specs,
      guidance,
      active,
    } = req.body;

    const categoryId = categoryName !== undefined ? await resolveProductCategoryId(categoryName) : existing.categoryId;
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
        ...(active !== undefined && { active: Boolean(active) }),
        ...(categoryName !== undefined && { categoryId }),
        ...(fileUrl !== undefined && { fileUrl: fileUrl?.trim() || null }),
        ...(specs !== undefined && { specs: parseProductSpecs(specs) }),
        ...(guidance !== undefined && { guidance: guidance?.trim() || null }),
      },
      include: { category: true },
    });

    res.json({ success: true, data: serializeProduct(updated), message: 'Product updated successfully' });
  } catch (error) { next(error); }
});

// ─── DELETE /api/v1/shop/admin/products/:id ──────────
router.delete('/admin/products/:id', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) throw new AppError('Product not found', 404);

    await prisma.product.delete({ where: { id } });
    res.json({ success: true, message: 'Product deleted successfully' });
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
    const { status } = req.body;
    if (!status) throw new AppError('Status is required', 400);

    const updated = await prisma.shopOrder.update({
      where: { id },
      data: {
        status: String(status),
        paymentStatus: String(status) === 'COMPLETED' ? 'PAID' : undefined,
        paidAt: String(status) === 'COMPLETED' ? new Date() : undefined,
      },
      include: { items: true },
    });

    res.json({ success: true, data: updated, message: 'Order status updated successfully' });
  } catch (error) { next(error); }
});

// ─── GET /api/v1/shop/admin/discounts ────────────────
router.get('/admin/discounts', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
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
    const { buyerName, buyerEmail, buyerPhone, buyerAddress, items, discountCode } = req.body;

    if (!buyerName || !buyerEmail || !items?.length) {
      throw new AppError('Missing required fields', 400);
    }

    // Calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) throw new AppError(`Product ${item.productId} not found`, 404);
      const itemTotal = Number(product.price) * item.quantity;
      subtotal += itemTotal;
      orderItems.push({
        productName: product.name,
        productSlug: product.slug,
        productImage: product.thumbnailUrl,
        price: product.price,
        quantity: item.quantity,
        total: itemTotal,
        fileUrl: product.fileUrl,
      });
    }

    let discountAmount = 0;
    if (discountCode) {
      const discount = await prisma.discountCode.findUnique({ where: { code: discountCode } });
      if (discount && discount.active && (!discount.expiresAt || discount.expiresAt > new Date())) {
        if (discount.minOrderAmount && subtotal < Number(discount.minOrderAmount)) {
          throw new AppError(`Minimum order amount is ${discount.minOrderAmount}`, 400);
        }
        if (discount.discountType === 'PERCENT') {
          discountAmount = subtotal * Number(discount.discountValue) / 100;
          if (discount.maxDiscountAmount && discountAmount > Number(discount.maxDiscountAmount)) {
            discountAmount = Number(discount.maxDiscountAmount);
          }
        } else {
          discountAmount = Number(discount.discountValue);
        }
      }
    }

    const total = subtotal - discountAmount;
    const orderCode = `ORD-${Date.now()}-${nanoid(6).toUpperCase()}`;

    const order = await prisma.shopOrder.create({
      data: {
        orderCode,
        buyerName,
        buyerEmail,
        buyerPhone,
        buyerAddress,
        subtotal,
        discountAmount,
        discountCode,
        total,
        status: 'PENDING',
        items: { create: orderItems },
      },
      include: { items: true },
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) { next(error); }
});

// ─── GET /api/v1/shop/orders/my ─────────────────────
router.get('/orders/my', authenticate, async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const orders = await prisma.shopOrder.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });

    res.json({ success: true, data: orders });
  } catch (error) { next(error); }
});

// ─── GET /api/v1/shop/orders/:code ───────────────────
router.get('/orders/:code', async (req, res: Response<ApiResponse>, next) => {
  try {
    const order = await prisma.shopOrder.findUnique({
      where: { orderCode: req.params.code },
      include: { items: true },
    });

    if (!order) throw new AppError('Order not found', 404);
    res.json({ success: true, data: order });
  } catch (error) { next(error); }
});

export default router;
