/**
 * Trợ lý hỏi–đáp trên TOÀN BỘ ghi chú của một người.
 *
 * Khác `noteAiAssist.service.ts` ở chỗ căn bản: cái kia chỉ nhìn thấy ĐOẠN
 * ĐANG BÔI ĐEN (`runAiAssist(userId, action, selection)`), nên không trả lời
 * được "tuần trước tôi ghi gì về X". Cái này đi tìm trong kho ghi chú trước,
 * rồi mới hỏi model — và bắt model TRÍCH DẪN ghi chú nào.
 *
 * ─── Vì sao tìm bằng TỪ KHOÁ chứ chưa phải vector ───
 * Nhúng vector cần một model nhúng, mà hôm nay chưa có đường nào miễn phí:
 * máy chủ LLM ở máy nhà trả `501 This server does not support embeddings`
 * (llama.cpp phải bật cờ `--embeddings`, và Qwen là model TRÒ CHUYỆN nên dùng
 * làm bộ nhúng cũng cho kết quả kém), còn cổng modelapi.vn từ chối
 * `/v1/embeddings` với khoá hiện tại (401). Xem `docs/` hoặc hỏi lại chủ dự án.
 *
 * Nên bước tìm được tách hẳn ra hàm `timGhiChuLienQuan()`. Khi có bộ nhúng,
 * chỉ thay ruột hàm đó — phần còn lại (dựng ngữ cảnh, hỏi model, trích dẫn,
 * hạn mức) không phải sửa dòng nào.
 */
import { prisma } from '../config/database.js';
import { BadRequestError } from '../middleware/errorHandler.js';
import { llmComplete, checkTokenQuota, isAiAvailable } from './interview/llm/index.js';

/** Số ghi chú đưa vào ngữ cảnh. Nhiều hơn không giúp — model bắt đầu lạc. */
const SO_NGUON = 6;
/** Cắt mỗi ghi chú còn ngần này ký tự quanh chỗ khớp. */
const CUA_SO = 900;
const MAX_HOI = 500;

export interface NguonTraLoi {
  noteId: number;
  title: string;
  trich: string;
}

export interface KetQuaHoi {
  answer: string;
  sources: NguonTraLoi[];
}

/** Bỏ dấu tiếng Việt — "duong" phải tìm ra "đường". */
function boDau(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
}

/**
 * Từ để hỏi, không phải từ để tìm.
 *
 * "tuần trước tôi có ghi gì về Prisma không" — nếu ném cả câu vào `contains`
 * thì không ghi chú nào khớp. Phải bỏ hư từ và giữ lại từ mang nghĩa.
 */
const HU_TU = new Set([
  'tôi', 'toi', 'minh', 'mình', 'ban', 'bạn', 'gi', 'gì', 'nao', 'nào', 'the', 'thế',
  'co', 'có', 'khong', 'không', 'la', 'là', 've', 'về', 'cua', 'của', 'cho', 'voi', 'với',
  'da', 'đã', 'dang', 'đang', 'se', 'sẽ', 'roi', 'rồi', 'tuan', 'tuần', 'truoc', 'trước',
  'hom', 'hôm', 'nay', 'qua', 'ghi', 'chu', 'chú', 'note', 'notes', 'and', 'the', 'what',
  'when', 'where', 'how', 'did', 'do', 'does', 'my', 'me', 'i', 'a', 'an', 'of', 'in', 'on',
]);

export function tachTuKhoa(cauHoi: string): string[] {
  const tho = boDau(cauHoi).split(/[^a-z0-9]+/).filter(Boolean);
  const giu = tho.filter((t) => t.length >= 2 && !HU_TU.has(t));
  // Câu hỏi toàn hư từ ("hôm nay có gì không") thì thà tìm bằng chính nó còn
  // hơn tìm bằng mảng rỗng — mảng rỗng sẽ khớp MỌI ghi chú.
  return (giu.length > 0 ? giu : tho).slice(0, 8);
}

/** Bỏ thẻ HTML để đưa cho model chữ thuần. */
function boThe(html: string): string {
  return html
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Cắt một cửa sổ quanh chỗ khớp đầu tiên — đưa nguyên bài dài là phí token. */
function cuaSoQuanhTuKhoa(chu: string, tuKhoa: string[]): string {
  const nen = boDau(chu);
  let viTri = -1;
  for (const t of tuKhoa) {
    const i = nen.indexOf(t);
    if (i >= 0 && (viTri === -1 || i < viTri)) viTri = i;
  }
  if (viTri === -1) return chu.slice(0, CUA_SO);
  const dau = Math.max(0, viTri - Math.floor(CUA_SO / 3));
  return (dau > 0 ? '…' : '') + chu.slice(dau, dau + CUA_SO) + (dau + CUA_SO < chu.length ? '…' : '');
}

/**
 * Tìm ghi chú liên quan tới câu hỏi.
 *
 * ⚠️ CHỖ NÀY SẼ ĐƯỢC THAY bằng tìm theo vector khi có bộ nhúng. Mọi thứ khác
 * trong file không phụ thuộc vào cách tìm.
 */
export async function timGhiChuLienQuan(
  userId: number,
  cauHoi: string,
): Promise<Array<{ id: number; title: string; chu: string; diem: number }>> {
  const tuKhoa = tachTuKhoa(cauHoi);
  if (tuKhoa.length === 0) return [];

  /* Lấy rộng rồi CHẤM ĐIỂM trong Node, không xếp hạng trong SQL.
   * `contains` của Prisma không cho biết khớp bao nhiêu từ, mà "khớp 4/5 từ
   * khoá" với "khớp 1/5" là khác nhau một trời một vực. Kho của một người có
   * vài trăm ghi chú nên lấy rộng vẫn rẻ. */
  const tho = await prisma.note.findMany({
    where: {
      userId,
      // Ghi chú trong thùng rác KHÔNG được đưa vào câu trả lời — người dùng đã
      // xoá nó, trợ lý nhắc lại nội dung đó là bất ngờ khó chịu.
      deletedAt: null,
      OR: tuKhoa.flatMap((t) => [
        { title: { contains: t, mode: 'insensitive' as const } },
        { contentHtml: { contains: t, mode: 'insensitive' as const } },
      ]),
    },
    select: { id: true, title: true, contentHtml: true, updatedAt: true },
    orderBy: { updatedAt: 'desc' },
    take: 60,
  });

  const chamDiem = tho.map((n) => {
    const tieuDe = boDau(n.title ?? '');
    const than = boDau(boThe(n.contentHtml ?? ''));
    let diem = 0;
    for (const t of tuKhoa) {
      // Khớp ở TIÊU ĐỀ đáng giá hơn hẳn khớp trong thân bài.
      if (tieuDe.includes(t)) diem += 3;
      if (than.includes(t)) diem += 1;
    }
    return { id: n.id, title: n.title ?? '(không tên)', chu: boThe(n.contentHtml ?? ''), diem };
  });

  return chamDiem
    .filter((n) => n.diem > 0 && n.chu.length > 0)
    .sort((a, b) => b.diem - a.diem)
    .slice(0, SO_NGUON);
}

export async function hoiTroLyGhiChu(userId: number, cauHoiTho: unknown): Promise<KetQuaHoi> {
  const cauHoi = String(cauHoiTho ?? '').trim();
  if (!cauHoi) throw new BadRequestError('Chưa nhập câu hỏi.');
  if (cauHoi.length > MAX_HOI) throw new BadRequestError(`Câu hỏi quá dài (tối đa ${MAX_HOI} ký tự).`);
  if (!isAiAvailable()) throw new BadRequestError('Tính năng AI chưa được cấu hình.');
  if (!(await checkTokenQuota(userId))) {
    throw new BadRequestError('Đã hết hạn mức AI hôm nay. Thử lại vào ngày mai.');
  }

  const lienQuan = await timGhiChuLienQuan(userId, cauHoi);
  if (lienQuan.length === 0) {
    // KHÔNG hỏi model khi không tìm được gì. Hỏi thì nó sẽ bịa ra một câu trả
    // lời nghe rất hợp lý từ kiến thức chung, và người dùng tưởng đó là ghi
    // chú của mình.
    return {
      answer: 'Mình không tìm thấy ghi chú nào liên quan tới câu này. Thử hỏi bằng từ khoá có trong ghi chú xem sao.',
      sources: [],
    };
  }

  const nguon = lienQuan.map((n, i) => ({
    noteId: n.id,
    title: n.title,
    trich: cuaSoQuanhTuKhoa(n.chu, tachTuKhoa(cauHoi)),
    so: i + 1,
  }));

  const nguCanh = nguon
    .map((n) => `[${n.so}] ${n.title}\n${n.trich}`)
    .join('\n\n---\n\n');

  const res = await llmComplete({
    step: 'generation',
    feature: 'notes',
    // Việc này chạy trên model cục bộ ở máy nhà (xem LLM_LOCAL_PURPOSES) nên
    // hỏi bao nhiêu cũng không tốn tiền cổng.
    purpose: 'exphub_doc',
    system:
      'Bạn trả lời câu hỏi CHỈ dựa trên các ghi chú được cung cấp. '
      + 'Không thấy câu trả lời trong đó thì nói thẳng "Ghi chú của bạn không nói về việc này" — TUYỆT ĐỐI không suy đoán. '
      + 'Mỗi ý lấy từ ghi chú nào thì ghi số nguồn dạng [1], [2] ngay sau ý đó. '
      + 'Trả lời bằng tiếng Việt, ngắn gọn.',
    messages: [{
      role: 'user',
      content: `Ghi chú của tôi:\n\n${nguCanh}\n\n---\n\nCâu hỏi: ${cauHoi}`,
    }],
    maxTokens: 900,
    maxRetries: 1,
    timeoutMs: 90_000,
    userId,
  } as never);

  const answer = String((res as { text?: unknown }).text ?? '').trim();
  if (!answer) throw new BadRequestError('Trợ lý không trả lời được. Thử lại.');

  return {
    answer,
    sources: nguon.map(({ noteId, title, trich }) => ({ noteId, title, trich })),
  };
}
