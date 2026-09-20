/**
 * Thư viện BỘ PHẬN 3D cho Xưởng 3D trên iPad.
 *
 * Mỗi bộ phận là một CÔNG THỨC GHÉP KHỐI, không phải tệp lưới. Cả thư viện
 * 26 bộ phận chỉ 17,9 KB — nhỏ hơn một cái ảnh thu nhỏ. Vì thế trả nguyên
 * cục trong MỘT lời gọi rồi để app tự cất: tải lẻ từng bộ phận chỉ thêm
 * vòng mạng mà không tiết kiệm được gì đáng kể.
 *
 * Ba cái lợi so với tải tệp mô hình `.usdz`:
 *   · gần như không tốn dung lượng máy
 *   · tải tức thì
 *   · kéo ra rồi VẪN SỬA ĐƯỢC từng khối. Tệp lưới tải về là một cục chết,
 *     muốn đổi tỉ lệ hay màu một bộ phận thì phải ra máy tính.
 */
import { Router, type Response } from 'express';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { authenticate } from '../middleware/auth.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();
router.use(authenticate);

const TEP = path.resolve('content/xuong-3d/bo-phan.json');

/// Đọc một lần rồi giữ trong bộ nhớ: tệp đi theo ảnh Docker nên nó không
/// đổi giữa hai lần deploy, mà đọc đĩa mỗi lời gọi thì vô nghĩa.
let dem: { chu: string; luc: number } | null = null;

router.get('/bo-phan', async (_req, res: Response<ApiResponse>, next) => {
  try {
    if (!dem) {
      const chu = await readFile(TEP, 'utf8');
      dem = { chu, luc: Date.now() };
    }
    res.json({ success: true, data: JSON.parse(dem.chu) });
  } catch (e) {
    const ma = (e as NodeJS.ErrnoException).code;
    if (ma === 'ENOENT') {
      // Thiếu tệp nội dung thì trả thư viện RỖNG, không 500: app hiện
      // "chưa có bộ phận nào" thay vì một thông báo lỗi đỏ.
      res.json({ success: true, data: { phienBan: 0, nhom: [], boPhan: [] } });
      return;
    }
    next(e);
  }
});

export default router;
