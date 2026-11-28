/**
 * GET /api/v1/courses/:slug/roadmap — mô tả 4 ý mỗi bài cho sơ đồ lộ trình đầu khoá (công khai, không cần đăng nhập).
 * GET /api/v1/courses/roadmap/danh-sach — slug các khoá đã có mô tả.
 * Gắn TRƯỚC courseRoutes trong src/index.ts. Dữ liệu: src/services/roadmapKhoa.ts.
 */
import { Router, type Response } from 'express';
import type { ApiResponse } from '../types/index.js';
import { docRoadmapKhoa, dsKhoaCoRoadmap } from '../services/roadmapKhoa.js';

const router = Router();

router.get('/roadmap/danh-sach', (_req, res: Response<ApiResponse>) => {
  res.set('Cache-Control', 'public, max-age=300');
  res.json({ success: true, data: dsKhoaCoRoadmap() });
});

router.get('/:slug/roadmap', (req, res: Response<ApiResponse>) => {
  const data = docRoadmapKhoa(String(req.params.slug || ''));
  res.set('Cache-Control', 'public, max-age=300');
  // Khoá chưa có tệp ⇒ 200 + null (không phải lỗi: giao diện vẫn vẽ sơ đồ từ chương/bài, chỉ thiếu 4 ý).
  res.json({ success: true, data });
});

export default router;
