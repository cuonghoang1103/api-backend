import { Router, type Response } from 'express';
import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();

// ─── GET /api/v1/shop/products ───────────────────────
router.get('/products', async (req, res: Response<ApiResponse>, next) => {
  try {
    const { page = 1, size = 12, keyword, category } = req.query;
    const skip = (Number(page) - 1) * Number(size);
    const where: Record<string, unknown> = { active: true };
    if (keyword) where.OR = [{ name: { contains: String(keyword), mode: 'insensitive' } }, { description: { contains: String(keyword), mode: 'insensitive' } }];
    if (category) where.category = { slug: String(category) };

    const [products, total] = await Promise.all([
      prisma.product.findMany({ where, skip, take: Number(size), orderBy: { createdAt: 'desc' }, include: { category: true } }),
      prisma.product.count({ where }),
    ]);
    res.json({ success: true, data: products, pagination: { page: Number(page), limit: Number(size), total, totalPages: Math.ceil(total / Number(size)) } });
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
    res.json({ success: true, data: product });
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
    const orderCode = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

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

export default router;
