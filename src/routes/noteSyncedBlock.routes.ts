/**
 * Synced blocks — nội dung dùng chung giữa nhiều trang ghi chú.
 *
 * Mount tại /api/v1/notes-synced-blocks. Mọi kiểm quyền nằm trong service:
 * ở đây không có chỗ nào tin `userId` do client gửi lên.
 */

import { Router, type Response } from 'express';
import { authenticate } from '../middleware/auth.js';
import type { ApiResponse } from '../types/index.js';
import {
  createSyncedBlock,
  getSyncedBlock,
  updateSyncedBlock,
} from '../services/noteSyncedBlock.service.js';

const router = Router();
router.use(authenticate);

router.post('/', async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const data = await createSyncedBlock(req.user.userId, req.body?.contentJson);
    res.status(201).json({ success: true, data });
  } catch (error) { next(error); }
});

router.get('/:blockId', async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const data = await getSyncedBlock(req.user.userId, Number(req.params.blockId));
    res.json({ success: true, data });
  } catch (error) { next(error); }
});

router.patch('/:blockId', async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const data = await updateSyncedBlock(req.user.userId, Number(req.params.blockId), req.body?.contentJson);
    res.json({ success: true, data });
  } catch (error) { next(error); }
});

export default router;
