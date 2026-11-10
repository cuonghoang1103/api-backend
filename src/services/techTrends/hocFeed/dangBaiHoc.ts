/**
 * ĐĂNG bài "Học mỗi ngày" lên Bảng tin + công cụ dọn bài bot mẫu cũ.
 * ─────────────────────────────────────────────────────────────────────────
 * Tác giả: tài khoản bot CuongMini (cuongMiniBot.ts), kênh `newsCategory='hoc'`.
 * Bài lấy từ THƯ VIỆN soạn sẵn đã kiểm chứng (thuVien.ts) ⇒ KHÔNG gọi LLM,
 * chi phí AI = 0. Việc tốn duy nhất: vẽ PNG bằng sharp + một lần tải ảnh
 * Commons (nếu bài là ảnh thật) + ghi R2.
 *
 * Bật tự đăng: `FEED_HOC_AUTOPOST=true` (MẶC ĐỊNH TẮT, giống mọi việc chạy
 * nền khác của repo). Số bài/ngày: `FEED_HOC_MOI_NGAY` (1–5, mặc định 3).
 * Nút chạy tay ở admin không phụ thuộc cờ.
 */
import { prisma } from '../../../config/database.js';
import { logger } from '../../../utils/logger.js';
import { createPost } from '../../social.service.js';
import { getCuongMiniBotUser } from '../cuongMiniBot.js';
import { vnDateKey } from '../cuongMiniSchedule.js';
import { BOT_USERNAMES } from '../newsBots.js';
import { dongDau, dungNoiDung, idTuNoiDung } from './dungBai.js';
import type { BaiHoc } from './kieu.js';
import { chonBaiKeTiep, luotCuaKhung, soBaiMoiNgay, type DaDang } from './lichHoc.js';
import { THU_VIEN } from './thuVien.js';
import { veVaTaiLen } from './veAnh.js';

export const KENH_HOC = 'hoc';
const BAI_BY_ID = new Map(THU_VIEN.map((b) => [b.id, b]));
const ID_THEO_DONG_DAU = new Map(THU_VIEN.map((b) => [dongDau(b), b.id]));

/** Lịch sử bài học đã đăng (mới nhất trước), nhận ra bài theo dòng đầu. */
export async function docLichSu(botId: number, gioiHan = 200): Promise<DaDang[]> {
  const rows = await prisma.socialPost.findMany({
    where: { authorId: botId, newsCategory: KENH_HOC },
    orderBy: { createdAt: 'desc' },
    take: gioiHan,
    select: { content: true, createdAt: true },
  });
  const out: DaDang[] = [];
  for (const r of rows) {
    const id = idTuNoiDung(r.content, ID_THEO_DONG_DAU);
    const bai = id ? BAI_BY_ID.get(id) : undefined;
    if (!bai) continue;
    out.push({ id: bai.id, nhom: bai.nhom, dinhDang: bai.dinhDang, mau: bai.anh.mau, luc: r.createdAt.getTime() });
  }
  return out;
}

export interface KetQuaDang {
  posted: boolean;
  reason?: string;
  postId?: number;
  id?: string;
  lyDo?: string[];
}

/** Đăng MỘT bài cụ thể (đã chọn). */
export async function dangBai(bai: BaiHoc, botId: number): Promise<number> {
  const anh = await veVaTaiLen(bai.anh, botId);
  const media = anh.map((a, k) => ({ type: 'IMAGE', url: a.url, width: a.w, height: a.h, alt: a.alt, sortOrder: k }));
  const post = await createPost({
    authorId: botId,
    content: dungNoiDung(bai),
    visibility: 'PUBLIC',
    type: 'POST',
    newsCategory: KENH_HOC,
    media: media.length ? media : undefined,
    poll: bai.poll ? { question: bai.poll.cauHoi, options: bai.poll.luaChon, multiChoice: false } : undefined,
  });
  return (post as { id: number }).id;
}

/** Chọn bài kế tiếp theo bộ xoay vòng rồi đăng. `xemTruoc` ⇒ chỉ trả bài sẽ chọn. */
export async function dangBaiKeTiep(opts: { luot?: number; xemTruoc?: boolean } = {}): Promise<KetQuaDang> {
  const bot = await getCuongMiniBotUser();
  const lichSu = await docLichSu(bot.id);
  const chon = chonBaiKeTiep(THU_VIEN, lichSu, { bayGio: Date.now(), khoaNgay: vnDateKey(), luot: opts.luot ?? lichSu.length });
  if (!chon) return { posted: false, reason: 'het-bai' };
  if (opts.xemTruoc) return { posted: false, reason: 'xem-truoc', id: chon.bai.id, lyDo: chon.lyDo };

  // Chặn đăng trùng trong ngày (hai tiến trình / bấm tay hai lần).
  const trung = await prisma.socialPost.findFirst({
    where: { authorId: bot.id, newsCategory: KENH_HOC, content: { startsWith: dongDau(chon.bai) }, createdAt: { gte: new Date(Date.now() - 86_400_000) } },
    select: { id: true },
  });
  if (trung) return { posted: false, reason: 'da-dang-24h', id: chon.bai.id };

  const postId = await dangBai(chon.bai, bot.id);
  logger.info('[hoc-feed] đã đăng', { postId, id: chon.bai.id, lyDo: chon.lyDo });
  return { posted: true, postId, id: chon.bai.id, lyDo: chon.lyDo };
}

export function hocAutopostBat(): boolean {
  return String(process.env.FEED_HOC_AUTOPOST ?? 'false').toLowerCase() === 'true';
}

/** Cron: gọi ở mỗi khung giờ VN. Không bao giờ ném. */
export async function chayKhungHoc(slot: string): Promise<void> {
  if (!hocAutopostBat()) return;
  try {
    const luot = luotCuaKhung(slot, soBaiMoiNgay(process.env.FEED_HOC_MOI_NGAY));
    if (luot < 0) return;
    const r = await dangBaiKeTiep({ luot });
    logger.info('[hoc-feed] khung giờ', { slot, ...r });
  } catch (err) {
    logger.error('[hoc-feed] khung giờ lỗi (đã nuốt)', { slot, error: (err as Error).message });
  }
}

// ─── Thống kê + dọn bài bot MẪU CŨ ──────────────────────────────────────────
/**
 * Bài bot "mẫu cũ" = bài của các tài khoản bot tin tức thuộc kênh so sánh
 * ('ai-compare') hoặc bài mẹo Claude xoay 8 hạt giống (kênh 'claude', dòng đầu
 * mở bằng 💡). Đây đúng là hai nhóm trong ảnh chụp người dùng gửi.
 */
async function botIds(): Promise<number[]> {
  const bots = await prisma.user.findMany({ where: { username: { in: BOT_USERNAMES } }, select: { id: true } });
  return bots.map((b) => b.id);
}

function whereMauCu(ids: number[]) {
  return {
    authorId: { in: ids },
    OR: [
      { newsCategory: 'ai-compare' },
      { newsCategory: 'claude', content: { startsWith: '💡' } },
    ],
  };
}

export async function thongKeBaiBot() {
  const ids = await botIds();
  if (!ids.length) return { tong: 0, mauCu: 0, dangHien: 0, daAn: 0, theoKenh: [], theoTieuDe: [] };
  const where = whereMauCu(ids);
  const [tong, mauCu, dangHien, theoKenh, rows] = await Promise.all([
    prisma.socialPost.count({ where: { authorId: { in: ids } } }),
    prisma.socialPost.count({ where }),
    prisma.socialPost.count({ where: { ...where, visibility: 'PUBLIC' } }),
    prisma.socialPost.groupBy({ by: ['newsCategory', 'visibility'], where: { authorId: { in: ids } }, _count: { _all: true } }),
    prisma.socialPost.findMany({ where, select: { content: true } }),
  ]);
  const dem = new Map<string, number>();
  for (const r of rows) {
    const dong = r.content.split('\n')[0].replace(/^\S+\s/, '');
    // Gom các tiêu đề "A vs B: …" về cặp A vs B.
    const khoa = dong.includes(' vs ') ? dong.split(':')[0].trim() : dong.slice(0, 60);
    dem.set(khoa, (dem.get(khoa) ?? 0) + 1);
  }
  return {
    tong,
    mauCu,
    dangHien,
    daAn: mauCu - dangHien,
    theoKenh: theoKenh.map((k) => ({ kenh: k.newsCategory, visibility: k.visibility, so: k._count._all })),
    theoTieuDe: [...dem.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20).map(([tieuDe, so]) => ({ tieuDe, so })),
  };
}

/**
 * ẨN (không xoá) bài bot mẫu cũ: đổi visibility PUBLIC → PRIVATE. Bot không
 * đăng nhập ⇒ không ai còn thấy; đảo ngược được bằng `hienLai`.
 * Xoá hẳn KHÔNG có ở đây — cần người dùng đồng ý riêng.
 */
export async function anBaiMauCu(opts: { thuThoi: boolean }): Promise<{ seAn: number; daAn?: number }> {
  const ids = await botIds();
  const where = { ...whereMauCu(ids), visibility: 'PUBLIC' };
  const seAn = ids.length ? await prisma.socialPost.count({ where }) : 0;
  if (opts.thuThoi || !seAn) return { seAn };
  const r = await prisma.socialPost.updateMany({ where, data: { visibility: 'PRIVATE' } });
  logger.info('[hoc-feed] đã ẩn bài bot mẫu cũ', { so: r.count });
  return { seAn, daAn: r.count };
}

export async function hienLaiBaiMauCu(): Promise<number> {
  const ids = await botIds();
  if (!ids.length) return 0;
  const r = await prisma.socialPost.updateMany({ where: { ...whereMauCu(ids), visibility: 'PRIVATE' }, data: { visibility: 'PUBLIC' } });
  return r.count;
}
