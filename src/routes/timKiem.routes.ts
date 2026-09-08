/**
 * TÌM KIẾM HỢP NHẤT — /api/v1/tim-kiem
 *
 * Vì sao có route này: trước đây mỗi module tự có `/search` riêng
 * (`/users/search`, `/blog/posts/search`, `/code-lab/search`…) với hình dạng
 * trả về khác nhau, nên màn Tìm kiếm của app phải gọi nhiều nơi rồi tự ghép —
 * và trên iOS nó chưa từng chạy: app giải mã `{ users: [...] }` trong khi
 * `/users/search` trả về MẢNG PHẲNG, nên hỏng câm, không báo lỗi gì.
 *
 * ⚠️ `/users/search` KHÔNG dùng lại được cho việc này: nó là API cho `@mention`
 * — trần cứng 8 kết quả và LOẠI chính người đang tìm. Tìm kiếm chung mà giấu
 * mất tài khoản của chính mình thì người dùng tưởng dữ liệu hỏng.
 *
 *   GET /api/v1/tim-kiem?q=abc&loai=tat-ca|nguoi|bai-viet|khoa-hoc|nhac&gioiHan=20
 */
import { Router, type Request, type Response, type NextFunction } from 'express';
import { prisma } from '../config/database.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();

/** Trần cho MỖI loại. Đủ cho một màn cuộn, mà không biến một lượt gõ phím
 *  thành vài trăm KB — màn này gọi lại sau mỗi lần người dùng ngừng gõ. */
const TRAN = 20;

/* ⚠️ KHÔNG có 'nhac'. Bỏ 09/09/2026 theo yêu cầu người dùng: kho nhạc phát
 * nội dung không có quyền phân phối, đưa vào app iOS là rủi ro bị App Store
 * từ chối (Guideline 5.2 — Intellectual Property). Web giữ nguyên, chỉ app
 * không có lối vào. */
type Loai = 'tat-ca' | 'nguoi' | 'bai-viet' | 'khoa-hoc';

router.get('/', async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const q = String(req.query.q ?? '').trim();
    const loai = (String(req.query.loai ?? 'tat-ca') as Loai);
    const gioiHan = Math.min(Math.max(parseInt(String(req.query.gioiHan ?? ''), 10) || TRAN, 1), 50);

    // Một ký tự thì mọi thứ đều khớp — trả về rỗng thay vì quét cả bảng.
    if (q.length < 2) {
      res.json({ success: true, data: { q, nguoi: [], baiViet: [], khoaHoc: [] } });
      return;
    }

    const can = (l: Loai) => loai === 'tat-ca' || loai === l;
    const chua = { contains: q, mode: 'insensitive' as const };

    const [nguoi, baiViet, khoaHoc] = await Promise.all([
      can('nguoi')
        ? prisma.user.findMany({
            where: { enabled: true,
                     OR: [{ username: chua }, { displayName: chua }, { fullName: chua }] },
            select: { id: true, username: true, displayName: true, fullName: true,
                      avatarUrl: true, bio: true },
            take: gioiHan,
            orderBy: { id: 'asc' },
          })
        : Promise.resolve([]),

      can('bai-viet')
        ? /* ⚠️ `TechTrendArticle`, KHÔNG phải `Post`.
           * Bản đầu tôi viết `prisma.post` vì đọc mã thì đó là "bảng bài
           * viết". Hỏi dữ liệu mới ra sự thật: `Post` còn **3 dòng** (2 đã
           * đăng) — tàn dư của blog cũ; cuộc gộp 05/08 chép nội dung sang
           * `TechTrendArticle` (**31 bài**, 30 đã đăng) mà không xoá bảng cũ.
           * Tìm ở `Post` thì tab "Bài viết" gần như luôn rỗng.
           * Và KHÔNG tìm cả hai bảng: chúng có slug TRÙNG nhau, sẽ ra kết
           * quả đôi trỏ về cùng một bài. */
          prisma.techTrendArticle.findMany({
            // Chỉ bài ĐÃ ĐĂNG: bản nháp là của riêng tác giả, lọt vào tìm
            // kiếm chung là rò rỉ nội dung chưa muốn công bố.
            where: { status: 'PUBLISHED',
                     OR: [{ title: chua }, { summary: chua }, { tags: { has: q } }] },
            select: { id: true, title: true, slug: true, summary: true,
                      coverImageUrl: true, coverEmoji: true, category: true,
                      publishedAt: true, viewCount: true },
            take: gioiHan,
            orderBy: { publishedAt: 'desc' },
          })
        : Promise.resolve([]),

      can('khoa-hoc')
        ? prisma.course.findMany({
            where: { isPublished: true,
                     OR: [{ title: chua }, { shortDescription: chua }, { courseCode: chua }] },
            select: { id: true, title: true, slug: true, courseCode: true,
                      shortDescription: true, thumbnailUrl: true, level: true },
            take: gioiHan,
            orderBy: { id: 'desc' },
          })
        : Promise.resolve([]),

    ]);

    res.json({
      success: true,
      data: {
        q,
        nguoi,
        // Tiêu đề khoá học là chuỗi song ngữ `EN|||VI` — KHÔNG tách ở đây.
        // Client tách theo ngôn ngữ đang chọn của người dùng; tách sẵn ở máy
        // chủ là ép cả hai bên nói cùng một thứ tiếng.
        baiViet,
        khoaHoc,
        tong: nguoi.length + baiViet.length + khoaHoc.length,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
