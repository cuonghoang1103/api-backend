/**
 * Tác vụ đã lên lịch của AI Chat (/chat → Tác vụ đã lên lịch, 10/11/2026).
 *
 * CHỈ những mẫu chạy được THẬT trên máy chủ này (không cần Gmail/Lịch):
 *   tom-tat-ngay  — tóm tắt tin công nghệ/AI trong ngày (tìm web)
 *   theo-doi      — tin mới về một chủ đề người dùng chọn (tìm web)
 *   y-tuong       — ý tưởng nội dung về một chủ đề
 *   tong-ket-tuan — tổng kết các chủ đề người dùng đã hỏi CuongMini trong 7 ngày (đọc tiêu đề cuộc của họ)
 *   tu-dat        — câu hỏi người dùng tự viết
 * "Phân loại hộp thư đến", "Chuẩn bị cuộc họp" cần kết nối Gmail/Lịch ⇒ giao diện ghi "sắp có", máy chủ từ chối.
 *
 * Chạy: cron mỗi phút (cron.service.ts) gọi `nhipTacVu()` ⇒ tối đa 5 tác vụ đến hạn, chạy TUẦN TỰ qua đúng
 * `aiService.streamChat` (model mặc định CuongMini 3.11), ví tiền chat của người dùng được kiểm trước.
 * Câu hỏi đi vào tin nhắn NGƯỜI DÙNG (như họ tự gõ), không vào system prompt.
 */
import { prisma } from '../config/database.js';
import { logger } from '../utils/logger.js';
import { AppError } from '../middleware/errorHandler.js';

export type MauTacVu = 'tom-tat-ngay' | 'theo-doi' | 'y-tuong' | 'tong-ket-tuan' | 'tu-dat';
export const MAU_CHAY_DUOC: readonly MauTacVu[] = ['tom-tat-ngay', 'theo-doi', 'y-tuong', 'tong-ket-tuan', 'tu-dat'];
const CAN_CHU_DE: ReadonlySet<MauTacVu> = new Set(['theo-doi', 'y-tuong']);
const CAN_WEB: ReadonlySet<MauTacVu> = new Set(['tom-tat-ngay', 'theo-doi']);
export const TOI_DA_MOI_NGUOI = 10;
const LECH_VN_MS = 7 * 3600_000; // Việt Nam UTC+7, không đổi giờ mùa hè

/** Lần chạy kế tiếp (UTC) SAU `tu`, theo giờ Việt Nam. */
export function tinhLanToi(lich: 'ngay' | 'tuan', gio: number, thu: number | null, tu: Date = new Date()): Date {
  const vn = new Date(tu.getTime() + LECH_VN_MS); // đọc bằng getUTC* = giờ VN
  const ung = new Date(Date.UTC(vn.getUTCFullYear(), vn.getUTCMonth(), vn.getUTCDate(), Math.floor(gio / 60), gio % 60, 0, 0));
  let t = ung.getTime() - LECH_VN_MS; // về UTC
  if (lich === 'ngay') {
    if (t <= tu.getTime()) t += 86_400_000;
    return new Date(t);
  }
  const thuNay = vn.getUTCDay();
  let them = ((thu ?? 0) - thuNay + 7) % 7;
  if (them === 0 && t <= tu.getTime()) them = 7;
  return new Date(t + them * 86_400_000);
}

/** Câu hỏi gửi CuongMini cho từng mẫu. `tu-dat` dùng chữ người dùng (đã cắt độ dài). */
export function dungLoiNhac(mau: MauTacVu, chuDe: string | null, tuViet: string | null): string {
  const cd = (chuDe ?? '').trim();
  switch (mau) {
    case 'tom-tat-ngay':
      return `Tóm tắt 5 tin công nghệ và AI nổi bật nhất trong 24 giờ qua${cd ? `, ưu tiên về ${cd}` : ''}. `
        + 'Mỗi tin 2–3 câu: chuyện gì xảy ra, vì sao đáng chú ý. Kèm nguồn.';
    case 'theo-doi':
      return `Tìm và tóm tắt những tin mới nhất trong 24 giờ qua về: ${cd}. `
        + 'Liệt kê từng tin kèm nguồn; không có gì mới thì nói rõ là không có.';
    case 'y-tuong':
      return `Gợi ý 5 ý tưởng nội dung (bài viết, video ngắn, bài đăng) về: ${cd}. `
        + 'Mỗi ý tưởng: tiêu đề hấp dẫn, góc nhìn chính, 3 ý triển khai.';
    case 'tong-ket-tuan':
      return 'Tổng kết tuần học của mình với CuongMini.';
    case 'tu-dat':
      return (tuViet ?? '').trim().slice(0, 2000);
  }
}

export interface DauVaoTacVu {
  mau: MauTacVu; ten: string; chuDe: string | null; loiNhac: string; lich: 'ngay' | 'tuan'; gio: number; thu: number | null;
}

/** Kiểm + chuẩn hoá thân yêu cầu tạo/sửa. Sai ⇒ AppError 400 tiếng Việt. */
export function kiemDauVao(b: Record<string, unknown>): DauVaoTacVu {
  const mau = b.mau as MauTacVu;
  if (!MAU_CHAY_DUOC.includes(mau)) throw new AppError('Mẫu tác vụ này chưa chạy được', 400, 'TAC_VU_MAU');
  const lich = b.lich === 'tuan' ? 'tuan' : b.lich === 'ngay' ? 'ngay' : null;
  if (!lich) throw new AppError('Lịch phải là hằng ngày hoặc hằng tuần', 400, 'TAC_VU_LICH');
  const gio = Number(b.gio);
  if (!Number.isInteger(gio) || gio < 0 || gio > 1439) throw new AppError('Giờ chạy không hợp lệ', 400, 'TAC_VU_GIO');
  const thu = lich === 'tuan' ? Number(b.thu) : null;
  if (lich === 'tuan' && (!Number.isInteger(thu) || (thu as number) < 0 || (thu as number) > 6)) throw new AppError('Chọn thứ trong tuần', 400, 'TAC_VU_THU');
  const chuDe = typeof b.chuDe === 'string' && b.chuDe.trim() ? b.chuDe.trim().slice(0, 200) : null;
  if (CAN_CHU_DE.has(mau) && !chuDe) throw new AppError('Mẫu này cần một chủ đề', 400, 'TAC_VU_CHU_DE');
  const tuViet = typeof b.loiNhac === 'string' ? b.loiNhac : null;
  const loiNhac = dungLoiNhac(mau, chuDe, tuViet);
  if (!loiNhac) throw new AppError('Viết nội dung CuongMini cần làm mỗi lần chạy', 400, 'TAC_VU_LOI_NHAC');
  const tenVao = typeof b.ten === 'string' ? b.ten.trim().slice(0, 120) : '';
  const TEN_MAC_DINH: Record<MauTacVu, string> = {
    'tom-tat-ngay': 'Tóm tắt hằng ngày', 'theo-doi': `Theo dõi: ${chuDe ?? ''}`.slice(0, 120), 'y-tuong': `Ý tưởng nội dung: ${chuDe ?? ''}`.slice(0, 120),
    'tong-ket-tuan': 'Tổng kết hằng tuần', 'tu-dat': loiNhac.slice(0, 60),
  };
  return { mau, ten: tenVao || TEN_MAC_DINH[mau], chuDe, loiNhac, lich, gio, thu };
}

/** Thêm dữ liệu cho "Tổng kết hằng tuần": tiêu đề các cuộc người dùng đã nói trong 7 ngày. */
async function nguCanhTongKet(userId: number): Promise<string> {
  const ds = await prisma.chatSession.findMany({
    where: { userId, updatedAt: { gte: new Date(Date.now() - 7 * 86_400_000) }, messages: { some: {} } },
    select: { title: true },
    orderBy: { updatedAt: 'desc' },
    take: 40,
  });
  const ten = ds.map((s) => s.title?.trim()).filter((t): t is string => !!t && !t.startsWith('⏰'));
  if (!ten.length) return 'Tuần này mình chưa hỏi CuongMini chủ đề nào. Gợi ý 3 việc nên học tuần tới cho một sinh viên IT.';
  return `Đây là các chủ đề mình đã hỏi CuongMini trong 7 ngày qua:\n${ten.map((t) => `- ${t}`).join('\n')}\n\n`
    + 'Hãy tổng kết: mình đã tìm hiểu những mảng nào, điểm nào nên ôn lại, và gợi ý 3 việc cụ thể cho tuần tới.';
}

/** Chạy MỘT tác vụ ngay: hỏi CuongMini, ghi kết quả vào cuộc của tác vụ. Không ném lỗi — ghi `loiCuoi`. */
export async function chayTacVu(id: string): Promise<{ ok: boolean; loi?: string; sessionId?: string }> {
  const tv = await prisma.chatTacVu.findUnique({ where: { id } });
  if (!tv) return { ok: false, loi: 'Không tìm thấy tác vụ' };
  const { aiService, generateSessionId, DEFAULT_CHAT_MODEL_ID } = await import('./ai.service.js');
  let sessionId = tv.sessionId;
  let taoMoi = false;
  const batDau = new Date();
  let loi: string | undefined;
  try {
    const { xemViTien, loiCanViTien } = await import('./agent/viTien.js');
    const vi = await xemViTien(tv.userId, 'chat');
    if (vi.canVi) throw new Error(loiCanViTien(vi));

    if (!sessionId || !(await prisma.chatSession.findUnique({ where: { id: sessionId }, select: { id: true } }))) {
      sessionId = generateSessionId();
      taoMoi = true;
      await prisma.chatSession.create({ data: { id: sessionId, userId: tv.userId, title: `⏰ ${tv.ten}`.slice(0, 255) } });
    }
    const message = tv.mau === 'tong-ket-tuan' ? await nguCanhTongKet(tv.userId) : tv.loiNhac;
    const vn = new Date(Date.now() + LECH_VN_MS);
    const context = {
      userId: tv.userId,
      sessionId,
      message,
      topK: 5,
      model: DEFAULT_CHAT_MODEL_ID,
      homNay: vn.toISOString().slice(0, 10),
      gioPhut: vn.toISOString().slice(11, 16),
      choTimWeb: CAN_WEB.has(tv.mau as MauTacVu),
      kyNang: 'tu-dong' as const,
    };
    const meta = { requested: DEFAULT_CHAT_MODEL_ID, effective: DEFAULT_CHAT_MODEL_ID, fellBack: false };
    let tra = '';
    const han = Date.now() + 150_000;
    for await (const part of aiService.streamChat(context, meta)) {
      if (typeof part === 'string') tra += part;
      if (Date.now() > han) throw new Error('Quá thời gian chạy (150 giây)');
    }
    if (!tra.trim()) throw new Error('CuongMini không trả lời');
  } catch (e) {
    const tho = e instanceof Error ? e.message : String(e);
    logger.warn('Tác vụ chat chạy hỏng', { id, loi: tho });
    loi = loiDeDoc(tho);
    // Lượt hỏng không để lại câu hỏi treo (không có trả lời) trong cuộc kết quả.
    if (sessionId) {
      try {
        await prisma.chatMessage.deleteMany({ where: { sessionId, role: 'user', createdAt: { gte: batDau } } });
        if (taoMoi && (await prisma.chatMessage.count({ where: { sessionId } })) === 0) {
          await prisma.chatSession.deleteMany({ where: { id: sessionId } });
          sessionId = tv.sessionId;
        }
      } catch { /* dọn dẹp là phụ */ }
    }
  }
  await prisma.chatTacVu.update({
    where: { id },
    data: {
      sessionId,
      lanCuoi: new Date(),
      loiCuoi: loi ?? null,
      soLan: { increment: loi ? 0 : 1 },
      lanToi: tinhLanToi(tv.lich as 'ngay' | 'tuan', tv.gio, tv.thu),
    },
  });
  return { ok: !loi, loi, sessionId: sessionId ?? undefined };
}

/** Lỗi kỹ thuật ⇒ câu người dùng đọc được (lỗi thô chỉ nằm trong log). */
export function loiDeDoc(tho: string): string {
  if (/hạn mức|ví|budget|5 giờ/i.test(tho) && !/providers failed/i.test(tho)) return tho.slice(0, 300);
  if (/Quá thời gian/.test(tho)) return 'CuongMini trả lời quá lâu — sẽ thử lại ở lần chạy tới';
  if (/không trả lời/i.test(tho)) return 'CuongMini không trả lời — sẽ thử lại ở lần chạy tới';
  return 'CuongMini đang bận — sẽ thử lại ở lần chạy tới';
}

let dangChay = false;
/** Nhịp cron mỗi phút: chạy tối đa 5 tác vụ đến hạn, tuần tự. Trả số tác vụ đã chạy. */
export async function nhipTacVu(): Promise<number> {
  if (dangChay) return 0; // nhịp trước chưa xong (model chậm) ⇒ bỏ nhịp này, không chạy chồng
  dangChay = true;
  try {
    const den = await prisma.chatTacVu.findMany({
      where: { bat: true, lanToi: { lte: new Date() } },
      orderBy: { lanToi: 'asc' },
      take: 5,
      select: { id: true },
    });
    for (const t of den) await chayTacVu(t.id);
    return den.length;
  } finally {
    dangChay = false;
  }
}
