import { Router } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import * as cyberService from '../services/cyber.service.js';

const router = Router();

// Validation helpers
const validate = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// ─── GET /api/v1/cyber/tasks?date=YYYY-MM-DD ───────────────────────────────
router.get(
  '/tasks',
  authenticate,
  [
    query('date')
      .optional()
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage('date must be YYYY-MM-DD'),
  ],
  validate,
  async (req: any, res: any, next: any) => {
    try {
      const date = (req.query.date as string) || new Date().toISOString().split('T')[0];
      const tasks = await cyberService.getTasks(req.user.id, date);
      res.json({ success: true, data: tasks });
    } catch (err) {
      next(err);
    }
  }
);

// ─── POST /api/v1/cyber/tasks ──────────────────────────────────────────────
router.post(
  '/tasks',
  authenticate,
  [
    body('title').trim().isLength({ min: 1, max: 255 }).withMessage('title is required (1-255 chars)'),
    body('description').optional().trim().isLength({ max: 2000 }),
    body('type').isIn(['TASK', 'STUDY', 'ROUTINE']).withMessage('type must be TASK, STUDY, or ROUTINE'),
    body('startTime')
      .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .withMessage('startTime must be HH:mm'),
    body('endTime')
      .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .withMessage('endTime must be HH:mm'),
    body('expReward').isInt({ min: 1, max: 500 }).withMessage('expReward must be 1-500'),
    body('date')
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage('date must be YYYY-MM-DD'),
  ],
  validate,
  async (req: any, res: any, next: any) => {
    try {
      const task = await cyberService.createTask(req.user.id, req.body);
      res.status(201).json({ success: true, data: task });
    } catch (err) {
      next(err);
    }
  }
);

// ─── PATCH /api/v1/cyber/tasks/:id/toggle ─────────────────────────────────
router.patch(
  '/tasks/:id/toggle',
  authenticate,
  [param('id').isInt({ min: 1 }).withMessage('id must be a positive integer')],
  validate,
  async (req: any, res: any, next: any) => {
    try {
      const result = await cyberService.toggleTask(req.user.id, Number(req.params.id));
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
);

// ─── DELETE /api/v1/cyber/tasks/:id ────────────────────────────────────────
router.delete(
  '/tasks/:id',
  authenticate,
  [param('id').isInt({ min: 1 }).withMessage('id must be a positive integer')],
  validate,
  async (req: any, res: any, next: any) => {
    try {
      const result = await cyberService.deleteTask(req.user.id, Number(req.params.id));
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
);

// ─── GET /api/v1/cyber/profile ─────────────────────────────────────────────
router.get('/profile', authenticate, async (req: any, res: any, next: any) => {
  try {
    const profile = await cyberService.getProfile(req.user.id);
    res.json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/v1/cyber/inventory ───────────────────────────────────────────
router.get('/inventory', authenticate, async (req: any, res: any, next: any) => {
  try {
    const inventory = await cyberService.getInventory(req.user.id);
    res.json({ success: true, data: inventory });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/v1/cyber/inventory/mint-coupon ───────────────────────────────
router.post(
  '/inventory/mint-coupon',
  authenticate,
  [
    body('discountAmount')
      .isInt({ min: 1, max: 100 })
      .withMessage('discountAmount must be an integer between 1 and 100'),
  ],
  validate,
  async (req: any, res: any, next: any) => {
    try {
      const coupon = await cyberService.mintCoupon(req.user.id, Number(req.body.discountAmount));
      res.status(201).json({ success: true, data: coupon });
    } catch (err) {
      next(err);
    }
  }
);

// ─── GET /api/v1/cyber/analytics?period=day|month|year ────────────────────
router.get(
  '/analytics',
  authenticate,
  [
    query('period')
      .optional()
      .isIn(['day', 'month', 'year'])
      .withMessage('period must be day, month, or year'),
  ],
  validate,
  async (req: any, res: any, next: any) => {
    try {
      const analytics = await cyberService.getAnalytics(req.user.id, (req.query.period as any) || 'month');
      res.json({ success: true, data: analytics });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
