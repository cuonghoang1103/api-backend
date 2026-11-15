/**
 * CT Language — CỘNG ĐỒNG: "🐻 Nhờ Gấu trả lời" (14/11/2026). Trên bài loại "Hỏi", người đọc bấm ⇒ CuongMini AI viết MỘT
 * câu trả lời ngắn bằng tiếng Việt, gắn nhãn AI, báo cáo được như mọi câu trả lời.
 *   · Mỗi bài tối đa MỘT lần — giành chỗ bằng `updateMany where aiLuc IS NULL` (hai người bấm cùng lúc ⇒ một người thắng);
 *     AI lỗi ⇒ trả chỗ (aiLuc = null) để người sau bấm lại được.
 *   · Lượt/ngày (giờ VN) theo NGƯỜI BẤM: free `LUOT_GAU_FREE`, Pro `LUOT_GAU_PRO` — đếm thẳng từ `ctl_tra_loi`
 *     (`la_ai` + `user_id` = người bấm), không cần bảng đếm riêng, khởi động lại máy chủ không mất.
 *   · Gọi cổng LLM chung của web (`llmComplete`, purpose `language_tutor`) — trần $/ngày + bảo trì CuongMini áp sẵn.
 *   · Câu AI viết cũng đi qua `kiemNoiDung` (lọt từ xấu ⇒ bỏ, trả chỗ).
 * App: đường có `/ai/` ⇒ app gọi `DongYChiaSeAI.batBuoc()` trước khi gửi (App Store 5.1.2(i)).
 *
 * ── Đợt 3 (15/11/2026): câu AI viết theo ĐỊNH DẠNG GIÀU như Hỏi Gấu (`hoiGau.ts › nhacHoiGauGiau`, khung theo loại câu,
 * 1600 token, `lamSachTraLoiGiau`) và LƯU nguyên Markdown. Câu trả lời công khai ⇒ mọi bản app đọc nó: API trả `noiDung` =
 * `tronGau(...)` (chữ trơn — app cũ vẽ `Text`) + `noiDungGiau` = bản gốc cho app mới (`TraLoiGauView`) — xem `congDong.ts`.
 */
import { prisma } from '../../config/database.js';
import { AppError } from '../../middleware/errorHandler.js';
import { kiemNoiDung } from '../locNoiDung.js';
import { isProEffective } from '../pro.service.js';
import { dauNgayVn } from '../agent/anthropicChinhHang/hanMuc.js';
import { logger } from '../../utils/logger.js';
import { baiChoThaoTac, chiTietBai, taoThongBao } from './congDong.js';
import { theCuaNn } from './congDongThuan.js';
import type { NnTuDien } from './tuDien.js';

export const LUOT_GAU_FREE = 2;
export const LUOT_GAU_PRO = 15;

export interface PhuThuocGau {
  laPro: (userId: number) => Promise<boolean>;
  /** Trả văn bản câu trả lời. Ném lỗi khi AI hỏng. */
  goi: (o: { system: string; user: string; userId: number }) => Promise<string>;
}

const THAT: PhuThuocGau = {
  laPro: isProEffective,
  goi: async ({ system, user, userId }) => {
    const { llmComplete } = await import('../interview/llm/index.js');
    const r = await llmComplete({
      // 55 s × 2 lần ≈ 110 s < 125 s Cloudflare (tuyến không stream).
      step: 'generation', purpose: 'language_tutor', feature: 'language', userId, maxTokens: 1600, maxRetries: 1, timeoutMs: 55_000,
      system, messages: [{ role: 'user', content: user }],
    });
    return r.text ?? '';
  },
};

const TEN_NN: Record<NnTuDien, string> = { en: 'tiếng Anh', ja: 'tiếng Nhật', zh: 'tiếng Trung' };

export function nhacGau(nn: NnTuDien): string {
  const doc = nn === 'ja' ? ' kèm cách đọc (hiragana/romaji)' : nn === 'zh' ? ' kèm pinyin có dấu thanh' : '';
  return [
    `Bạn là Gấu CuongMini — trợ giảng ${TEN_NN[nn]} thân thiện trong cộng đồng học ngôn ngữ của app CT Language.`,
    'Viết MỘT câu trả lời cho câu hỏi của người học, bằng tiếng Việt, ngắn gọn (tối đa khoảng 180 chữ), chính xác, dễ hiểu.',
    `Có 1–3 ví dụ bằng ${TEN_NN[nn]}${doc} và nghĩa tiếng Việt. Không chắc thì nói rõ là không chắc — KHÔNG bịa.`,
    'Định dạng chữ thường: được dùng gạch đầu dòng "•", KHÔNG dùng bảng, tiêu đề #, hay **in đậm**. Không chào hỏi dài dòng.',
    'Câu hỏi không liên quan tới học ngôn ngữ hoặc có nội dung không phù hợp ⇒ lịch sự từ chối trong một câu.',
  ].join('\n');
}

/**
 * Markdown giàu ⇒ chữ trơn đọc được cho bản app CŨ (vẽ `Text`): bỏ tiêu đề/đậm/backtick, furigana ⇒ 漢字（かな）, hộp `>` ⇒ dòng
 * thường, gạch đầu dòng ⇒ "•", bảng ⇒ "ô · ô", "Đáp án:" giữ nguyên. Chữ vốn trơn đi qua không đổi. THUẦN — test đọc.
 */
export function tronGau(s: string): string {
  return s
    .replace(/\{([^|}\n]+)\|([^}\n]+)\}/g, '$1（$2）')
    .replace(/^[ \t]*\|?[ \t]*:?-{2,}:?[ \t]*(\|[ \t]*:?-{2,}:?[ \t]*)*\|?[ \t]*$\n?/gm, '')
    .replace(/^[ \t]*\|(.*)\|[ \t]*$/gm, (_, o: string) => o.split('|').map((x) => x.trim()).join(' · '))
    .replace(/^#{1,6}[ \t]+/gm, '')
    .replace(/^>[ \t]?/gm, '')
    .replace(/^([ \t]*)[-*][ \t]+/gm, '$1• ')
    .replace(/\*\*|==|~~|`/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Bỏ đánh dấu Markdown nặng mà app không vẽ (in đậm, tiêu đề). */
export const lamSachGau = (s: string) => s.replace(/\*\*(.+?)\*\*/g, '$1').replace(/^#{1,6}\s+/gm, '').replace(/\n{3,}/g, '\n\n').trim().slice(0, 2000);

async function daDungHomNay(userId: number) {
  return prisma.ctlTraLoi.count({ where: { userId, laAi: true, createdAt: { gte: dauNgayVn() } } });
}

export async function luotGau(userId: number, pt: PhuThuocGau = THAT) {
  const laPro = await pt.laPro(userId);
  const tran = laPro ? LUOT_GAU_PRO : LUOT_GAU_FREE;
  return { laPro, tran, conLai: Math.max(0, tran - (await daDungHomNay(userId))) };
}

export async function nhoGauTraLoi(userId: number, baiId: number, pt: PhuThuocGau = THAT) {
  const b = await baiChoThaoTac(userId, baiId);
  if (b.loai !== 'hoi') throw new AppError('Gấu chỉ trả lời bài loại "Hỏi".', 400, 'CTL_CD_AI_KHONG_HOI');
  if (b.aiLuc) throw new AppError('Gấu đã trả lời bài này rồi.', 409, 'CTL_CD_AI_DA_CO');
  const luot = await luotGau(userId, pt);
  if (luot.conLai <= 0) {
    throw new AppError(
      luot.laPro ? `Hôm nay bạn đã nhờ Gấu đủ ${luot.tran} lần — mai Gấu trả lời tiếp nhé.`
        : `Hôm nay bạn đã dùng hết ${luot.tran} lượt nhờ Gấu miễn phí. Nâng cấp Pro để nhờ Gấu ${LUOT_GAU_PRO} lần mỗi ngày.`,
      429, 'CTL_CD_AI_HET_LUOT',
    );
  }
  const gianh = await prisma.ctlBai.updateMany({ where: { id: baiId, aiLuc: null }, data: { aiLuc: new Date() } });
  if (!gianh.count) throw new AppError('Gấu đang (hoặc đã) trả lời bài này rồi.', 409, 'CTL_CD_AI_DA_CO');

  const nn = b.nn as NnTuDien;
  const tenThe = theCuaNn(nn).filter((t) => b.the.includes(t.ma)).map((t) => t.ten);
  const user = [b.tieuDe && `Tiêu đề: ${b.tieuDe}`, tenThe.length && `Chủ đề: ${tenThe.join(', ')}`, `Câu hỏi: ${b.noiDung}`].filter(Boolean).join('\n');
  let text = '';
  try {
    // Đợt 3: cùng lời nhắc giàu của Hỏi Gấu (màn `bai-cd`), giọng Gấu CuongMini mặc định; câu công khai ⇒ không có khối gợi ý.
    const { nhacHoiGauGiau, lamSachTraLoiGiau, phanLoaiCau } = await import('./hoiGau.js');
    const system = `${nhacHoiGauGiau(nn, 'gau', { loai: 'bai-cd', tieuDe: b.tieuDe ?? '', noiDung: tenThe.length ? `Chủ đề: ${tenThe.join(', ')}` : '' },
      phanLoaiCau(b.noiDung, 'bai-cd'))}\n\nRIÊNG LẦN NÀY: đây là câu trả lời CÔNG KHAI dưới một bài "Hỏi" trong cộng đồng (nhiều người đọc) — trả lời đúng câu hỏi trong tin nhắn, không hỏi lại, KHÔNG viết khối [[goi-y]].`;
    text = lamSachTraLoiGiau(await pt.goi({ system, user, userId })).than;
    if (text.length < 2) throw new Error('AI trả rỗng');
    if (kiemNoiDung(text).chan) throw new Error('AI viết lọt từ bị chặn');
  } catch (e) {
    logger.warn('[ctl-cong-dong] nhờ Gấu lỗi — trả chỗ', { baiId, error: (e as Error)?.message });
    await prisma.ctlBai.updateMany({ where: { id: baiId }, data: { aiLuc: null } });
    throw new AppError('Gấu đang bận, chưa trả lời được. Bạn thử lại sau ít phút nhé.', 503, 'CTL_CD_AI_LOI');
  }
  const [tl] = await prisma.$transaction([
    prisma.ctlTraLoi.create({ data: { baiId, userId, noiDung: text, laAi: true }, select: { id: true } }),
    prisma.ctlBai.update({ where: { id: baiId }, data: { soTraLoi: { increment: 1 } } }),
  ]);
  await taoThongBao({ nhan: b.userId, tu: userId, loai: 'ai-tra-loi', baiId, traLoiId: tl.id });
  return { ...(await chiTietBai(baiId, userId)), luotGau: { ...luot, conLai: Math.max(0, luot.conLai - 1) } };
}
