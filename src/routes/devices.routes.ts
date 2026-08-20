/**
 * Đăng ký thẻ thiết bị cho thông báo đẩy.
 *
 *   POST   /api/v1/devices        — đăng ký (hoặc chuyển chủ) một thẻ
 *   DELETE /api/v1/devices/:token — gỡ, gọi khi người dùng đăng xuất
 */
import { Router, type Request, type Response, type NextFunction } from 'express';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();
router.use(authenticate);

router.post('/', async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const token = String(req.body?.token ?? '').trim();
    // Thẻ APNs là hex 64 ký tự. Chặn ở đây thay vì để Apple từ chối sau —
    // một thẻ rác lọt vào bảng là mỗi lượt gửi lại tốn một vòng mạng vô ích.
    if (!/^[0-9a-fA-F]{64}$/.test(token)) {
      throw new AppError('Thẻ thiết bị không hợp lệ', 400, 'INVALID_TOKEN');
    }
    const sandbox = req.body?.sandbox === true || req.body?.sandbox === 'true';
    const platform = String(req.body?.platform ?? 'ios');

    // `upsert` theo `token` chứ không theo `(userId, token)`: cùng một máy mà
    // người khác đăng nhập thì thẻ phải CHUYỂN CHỦ. Nếu tạo hàng mới thì thông
    // báo của người cũ vẫn bay tới máy người mới đang cầm.
    const row = await prisma.deviceToken.upsert({
      where: { token },
      create: { token, userId: req.userId!, platform, sandbox },
      update: { userId: req.userId!, platform, sandbox, lastSeenAt: new Date() },
    });
    res.json({ success: true, data: { id: row.id } });
  } catch (error) { next(error); }
});

router.delete('/:token', async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    // Chỉ xoá thẻ của CHÍNH mình — không thì ai biết thẻ người khác cũng tắt
    // được thông báo của họ.
    await prisma.deviceToken.deleteMany({
      where: { token: req.params.token, userId: req.userId! },
    });
    res.json({ success: true });
  } catch (error) { next(error); }
});

export default router;
