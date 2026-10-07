/**
 * PHÒNG THI MÁY TÍNH (computer-delivered, 07/10/2026) — lưu lượt làm đề + AI
 * chấm Writing theo 4 tiêu chí band descriptors, trả JSON có cấu trúc.
 * ─────────────────────────────────────────────────────────────────────────
 * Đề nằm ở web (`frontend/src/app/language/[code]/ielts/thi-may/de/*.ts`),
 * web tự chấm Reading/Listening tại chỗ; máy chủ TÍNH LẠI band từ dung/tong
 * (không tin con số band web gửi lên) rồi lưu để mở lại ở tab "Result".
 */
import { prisma } from '../../config/database.js';
import { BadRequestError, AppError, NotFoundError } from '../../middleware/errorHandler.js';
import { isAiAvailable, llmComplete, checkTokenQuota, extractJson } from '../interview/llm/index.js';
import { quyDoiBand } from './deThi.service.js';
import { logger } from '../../utils/logger.js';

/** Làm tròn band kiểu IELTS: .25 lên .5, .75 lên số nguyên kế. */
export function lamTronBand(x: number): number {
  const nguyen = Math.floor(x);
  const du = x - nguyen;
  if (du < 0.25 - 1e-9) return nguyen;
  if (du < 0.75 - 1e-9) return nguyen + 0.5;
  return nguyen + 1;
}

/** Band Writing tổng: Task 2 nặng gấp đôi Task 1 (cách các trung tâm ước tính phổ biến). */
export function bandVietTong(t1: number | null, t2: number | null): number | null {
  if (t1 == null && t2 == null) return null;
  if (t1 == null) return t2;
  if (t2 == null) return t1;
  return lamTronBand((t1 + 2 * t2) / 3);
}

const CHE_DO = ['practice', 'full'] as const;
const KY = ['doc', 'nghe', 'viet'] as const;

export async function luuLuot(userId: number, b: { deId?: unknown; kyNang?: unknown; cheDo?: unknown; dung?: unknown; tong?: unknown; band?: unknown; giay?: unknown; chiTiet?: unknown }) {
  const deId = String(b.deId ?? '').trim();
  if (!/^[a-z0-9-]{2,40}$/.test(deId)) throw new BadRequestError('deId không hợp lệ');
  const kyNang = String(b.kyNang ?? '');
  const cheDo = String(b.cheDo ?? '');
  if (!(KY as readonly string[]).includes(kyNang)) throw new BadRequestError('Kỹ năng không hợp lệ');
  if (!(CHE_DO as readonly string[]).includes(cheDo)) throw new BadRequestError('Chế độ không hợp lệ');
  const tong = b.tong == null ? null : Math.round(Number(b.tong));
  const dung = b.dung == null ? null : Math.round(Number(b.dung));
  if (tong != null && (!Number.isFinite(tong) || tong < 0 || tong > 40)) throw new BadRequestError('tong 0–40');
  if (dung != null && (!Number.isFinite(dung) || dung < 0 || (tong != null && dung > tong))) throw new BadRequestError('dung không hợp lệ');
  let band: number | null = null;
  if (kyNang === 'viet') {
    const v = Number(b.band);
    band = Number.isFinite(v) && v >= 0 && v <= 9 ? lamTronBand(v) : null;
  } else if (cheDo === 'full' && tong === 40 && dung != null) {
    // Band chỉ có nghĩa khi làm ĐỦ 40 câu; luyện lẻ một passage thì không quy đổi.
    band = quyDoiBand(dung, 40, kyNang === 'doc' ? 'doc' : 'nghe');
  }
  const chiTiet = b.chiTiet && typeof b.chiTiet === 'object' ? b.chiTiet : null;
  if (chiTiet && JSON.stringify(chiTiet).length > 60_000) throw new BadRequestError('chiTiet quá lớn');
  const giay = Math.max(0, Math.min(4 * 3600, Math.round(Number(b.giay) || 0)));
  const r = await prisma.ieltsCdtAttempt.create({
    data: { userId, deId, kyNang, cheDo, dung, tong, band, giay, ...(chiTiet ? { chiTiet: chiTiet as object } : {}) },
    select: { id: true, band: true, createdAt: true },
  });
  return r;
}

/** Cập nhật lượt Writing sau khi AI chấm xong (band + kết quả vào chiTiet). */
export async function capNhatLuot(userId: number, id: number, b: { band?: unknown; chiTiet?: unknown }) {
  const r = await prisma.ieltsCdtAttempt.findFirst({ where: { id, userId }, select: { id: true, kyNang: true } });
  if (!r) throw new NotFoundError('Không có lượt làm này');
  if (r.kyNang !== 'viet') throw new BadRequestError('Chỉ lượt Writing mới cập nhật band sau khi chấm');
  const v = Number(b.band);
  const band = Number.isFinite(v) && v >= 0 && v <= 9 ? lamTronBand(v) : null;
  const chiTiet = b.chiTiet && typeof b.chiTiet === 'object' ? b.chiTiet : undefined;
  if (chiTiet && JSON.stringify(chiTiet).length > 60_000) throw new BadRequestError('chiTiet quá lớn');
  return prisma.ieltsCdtAttempt.update({
    where: { id },
    data: { band, ...(chiTiet ? { chiTiet: chiTiet as object } : {}) },
    select: { id: true, band: true },
  });
}

export async function dsLuot(userId: number, deId?: unknown) {
  const where: { userId: number; deId?: string } = { userId };
  if (deId) where.deId = String(deId).slice(0, 40);
  const items = await prisma.ieltsCdtAttempt.findMany({
    where, orderBy: { createdAt: 'desc' }, take: 100,
    select: { id: true, deId: true, kyNang: true, cheDo: true, dung: true, tong: true, band: true, giay: true, createdAt: true },
  });
  return { items };
}

export async function motLuot(userId: number, id: number) {
  const r = await prisma.ieltsCdtAttempt.findFirst({ where: { id, userId } });
  if (!r) throw new NotFoundError('Không có lượt làm này');
  return r;
}

/* ── AI chấm Writing ───────────────────────────────────────────────── */

export type KetQuaViet = {
  tieuChi: { ma: 'TR' | 'TA' | 'CC' | 'LR' | 'GRA'; ten: string; band: number; manh: string; sua: string }[];
  band: number;
  loi: { goc: string; sua: string; vi: string }[];
  banVietLai: string;
  nhanXet: string;
};

const RUBRIC_JSON = [
  'Bạn là giám khảo IELTS Academic Writing nghiêm túc, chấm theo band descriptors công khai (bản cập nhật 2023).',
  'Người học là người Việt, mục tiêu band 7.5. Nhận xét bằng TIẾNG VIỆT, trích dẫn bằng tiếng Anh nguyên văn từ bài.',
  'Bốn tiêu chí, mỗi tiêu chí một band theo thang 0.5 (0–9):',
  '  - Task 1: TA = Task Achievement (tổng quan/overview, số liệu chính, so sánh). Task 2: TR = Task Response (trả lời đủ mọi phần đề, quan điểm rõ, ý được phát triển).',
  '  - CC = Coherence & Cohesion (bố cục đoạn, tiến trình ý, từ nối dùng đúng chứ không máy móc, tham chiếu).',
  '  - LR = Lexical Resource (độ rộng, độ chính xác, collocation, chính tả, cấu tạo từ).',
  '  - GRA = Grammatical Range & Accuracy (câu phức đa dạng, tỷ lệ câu không lỗi).',
  'Bài thiếu số từ tối thiểu (Task 1: 150, Task 2: 250) phải bị trừ ở TA/TR. Lạc đề/học thuộc bài mẫu: TR tối đa 5.',
  'Không nâng điểm để động viên. Một band 7 cần phần lớn câu không lỗi và từ vựng ít phổ biến dùng chính xác.',
  'Trả về DUY NHẤT một JSON hợp lệ, không markdown, theo đúng khuôn:',
  '{"tieuChi":[{"ma":"TR|TA","band":6,"manh":"điểm mạnh + trích","sua":"việc cần sửa + trích"},{"ma":"CC",...},{"ma":"LR",...},{"ma":"GRA",...}],',
  ' "loi":[{"goc":"câu/cụm sai nguyên văn","sua":"bản sửa","vi":"vì sao sai, 1 câu"}],',
  ' "banVietLai":"toàn bài viết lại ở mức band 7.5, GIỮ ý và bố cục của người học, đủ số từ",',
  ' "nhanXet":"2–3 câu: ưu tiên sửa gì trước để lên band"}',
  '"loi" tối đa 8 mục, chọn lỗi ảnh hưởng band nhiều nhất. "banVietLai" là văn bản thuần, đoạn cách nhau bằng \\n\\n.',
  'NGẮN GỌN: "manh" và "sua" mỗi mục tối đa 2 câu; "vi" 1 câu; "nhanXet" tối đa 3 câu. Không lặp lại đề.',
  'Khi trích câu của học viên BÊN TRONG một giá trị chuỗi, dùng dấu nháy đơn \'…\' — KHÔNG dùng dấu " (làm hỏng JSON).',
].join('\n');

const TEN_TC: Record<string, string> = {
  TR: 'Task Response', TA: 'Task Achievement', CC: 'Coherence & Cohesion', LR: 'Lexical Resource', GRA: 'Grammatical Range & Accuracy',
};

/** Chuẩn hoá JSON model trả về — bỏ mục lạ, kẹp band, tự tính band tổng. */
export function chuanKetQuaViet(raw: unknown, task: 1 | 2): KetQuaViet {
  const j = (raw ?? {}) as { tieuChi?: unknown; loi?: unknown; banVietLai?: unknown; nhanXet?: unknown };
  const ma1 = task === 1 ? 'TA' : 'TR';
  const ds = Array.isArray(j.tieuChi) ? j.tieuChi as { ma?: unknown; band?: unknown; manh?: unknown; sua?: unknown }[] : [];
  const lay = (ma: string) => ds.find((x) => String(x.ma ?? '').toUpperCase().split('|').includes(ma) || (ma === ma1 && /^(TR|TA)/i.test(String(x.ma ?? ''))));
  const tieuChi = ([ma1, 'CC', 'LR', 'GRA'] as const).map((ma) => {
    const x = lay(ma);
    const b = Number(x?.band);
    return {
      ma, ten: TEN_TC[ma], band: Number.isFinite(b) ? Math.max(0, Math.min(9, Math.round(b * 2) / 2)) : 0,
      manh: String(x?.manh ?? '').slice(0, 1200), sua: String(x?.sua ?? '').slice(0, 1200),
    };
  });
  if (tieuChi.some((t) => !t.manh && !t.sua && t.band === 0)) throw new Error('thiếu tiêu chí');
  const loi = (Array.isArray(j.loi) ? j.loi as { goc?: unknown; sua?: unknown; vi?: unknown }[] : [])
    .slice(0, 8)
    .map((l) => ({ goc: String(l.goc ?? '').slice(0, 500), sua: String(l.sua ?? '').slice(0, 500), vi: String(l.vi ?? '').slice(0, 500) }))
    .filter((l) => l.goc && l.sua);
  return {
    tieuChi,
    band: lamTronBand(tieuChi.reduce((s, t) => s + t.band, 0) / 4),
    loi,
    banVietLai: String(j.banVietLai ?? '').slice(0, 6000),
    nhanXet: String(j.nhanXet ?? '').slice(0, 1200),
  };
}

/**
 * Chấm Writing CHẠY NỀN: POST trả `viecId` ngay, web hỏi lại bằng GET mỗi vài giây.
 *
 * Vì sao không chờ thẳng: đo thật 07/10/2026, một bài Task 2 ~180 từ mất ~118 giây
 * (JSON 4 tiêu chí + sửa lỗi + bản viết lại band 7.5). Cloudflare cắt mọi yêu cầu
 * quá 100 giây (524) — chờ thẳng thì production luôn hỏng dù máy cục bộ chạy được.
 * Việc giữ trong bộ nhớ của tiến trình (một container backend), hết hạn sau 30 phút;
 * khởi động lại giữa chừng thì web nhận `khong_thay` và cho bấm chấm lại.
 */
type ViecCham = { userId: number; luc: number; xong: boolean; kq?: { ketQua: KetQuaViet | null; lyDo?: string; soTu?: number }; loi?: string };
const VIEC = new Map<string, ViecCham>();
const VIEC_TTL = 30 * 60_000;
function donViec() { const han = Date.now() - VIEC_TTL; for (const [k, v] of VIEC) if (v.luc < han) VIEC.delete(k); }

async function chamVietThat(userId: number, bai: string, soTu: number, task: 1 | 2, de: string, hinh: string) {
  const kq = await llmComplete({
    step: 'generation',
    purpose: 'exam_grade',
    feature: 'chat',
    userId,
    // 6000: bản 4000 bị cắt giữa JSON ở bài dài (nhận xét tiếng Việt tốn token) ⇒ parse_failed.
    maxTokens: 6000,
    timeoutMs: 240_000,
    maxRetries: 1,
    system: RUBRIC_JSON,
    messages: [{
      role: 'user',
      content: `Writing Task ${task}. Đề:\n${de}\n${hinh ? `\nSố liệu của biểu đồ/bảng (để kiểm độ chính xác):\n${hinh}\n` : ''}\nBài của học viên (${soTu} từ):\n${bai}`,
    }],
  });
  try {
    return { ketQua: chuanKetQuaViet(docJsonCham(kq?.text ?? ''), task), soTu };
  } catch (e) {
    logger.warn('ielts cham-viet: không đọc được JSON của model', { dai: kq?.text?.length ?? 0, duoi: (kq?.text ?? '').slice(-160), loi: e instanceof Error ? e.message : String(e) });
    return { ketQua: null, lyDo: 'parse_failed' as const };
  }
}

/**
 * Đọc JSON model trả về, CÓ SỬA dấu nháy kép chưa thoát trong chuỗi.
 * Đo thật 07/10/2026: bài Task 2 dài ⇒ model trích câu của học viên bằng "…" ngay
 * trong giá trị JSON ⇒ JSON.parse hỏng ⇒ người học thấy "không đọc được". Quy tắc
 * sửa: trong một chuỗi, dấu " chỉ là dấu ĐÓNG nếu ký tự kế tiếp (bỏ khoảng trắng)
 * là , } ] hoặc : — còn lại thì thoát thành \".
 */
export function docJsonCham(text: string): unknown {
  let t = (text || '').trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
  const a = t.indexOf('{'), b = t.lastIndexOf('}');
  if (a >= 0 && b > a) t = t.slice(a, b + 1);
  try { return JSON.parse(t); } catch { /* thử sửa */ }
  try { return JSON.parse(suaNhay(t)); } catch { /* lùi về bộ đọc chung */ }
  return extractJson(text);
}

function suaNhay(t: string): string {
  let ra = '';
  let trong = false;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (c === '\\' && trong) { ra += c + (t[i + 1] ?? ''); i++; continue; }
    if (c === '"') {
      if (!trong) { trong = true; ra += c; continue; }
      let j = i + 1;
      while (j < t.length && /\s/.test(t[j])) j++;
      if (j >= t.length || ',}]:'.includes(t[j])) { trong = false; ra += c; } else ra += '\\"';
      continue;
    }
    ra += trong && c < ' ' ? (c === '\n' ? '\\n' : ' ') : c;
  }
  return ra;
}

export async function chamViet(userId: number, b: { bai?: unknown; de?: unknown; task?: unknown; moTaHinh?: unknown }) {
  const bai = String(b.bai ?? '').trim();
  const soTu = bai ? bai.split(/\s+/).length : 0;
  if (soTu < 40) throw new BadRequestError('Bài quá ngắn để chấm — viết ít nhất 40 từ');
  if (bai.length > 9000) throw new BadRequestError('Bài quá dài (tối đa 9000 ký tự)');
  const task: 1 | 2 = Number(b.task) === 1 ? 1 : 2;
  if (!isAiAvailable()) return { viecId: null, ketQua: null, lyDo: 'ai_unavailable' as const };
  if (!(await checkTokenQuota(userId))) throw new AppError('Bạn đã dùng hết hạn mức AI hôm nay. Thử lại vào ngày mai nhé.', 429);
  donViec();
  const dangChay = [...VIEC.values()].filter((v) => v.userId === userId && !v.xong).length;
  if (dangChay >= 2) throw new AppError('Đang chấm 2 bài của bạn — chờ xong rồi chấm tiếp nhé.', 429);

  const viecId = `${userId}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const v: ViecCham = { userId, luc: Date.now(), xong: false };
  VIEC.set(viecId, v);
  void chamVietThat(userId, bai, soTu, task, String(b.de ?? '').slice(0, 2000), String(b.moTaHinh ?? '').slice(0, 2500))
    .then((kq) => { v.kq = kq; })
    .catch((e: unknown) => { v.loi = e instanceof Error ? e.message.slice(0, 300) : 'Máy chấm lỗi'; })
    .finally(() => { v.xong = true; });
  return { viecId, soTu };
}

/** Hỏi kết quả một việc chấm (chỉ chủ việc mới thấy). */
export function ketQuaCham(userId: number, viecId: string) {
  const v = VIEC.get(viecId);
  if (!v || v.userId !== userId) return { xong: true, ketQua: null, lyDo: 'khong_thay' as const };
  if (!v.xong) return { xong: false, giay: Math.round((Date.now() - v.luc) / 1000) };
  if (v.loi) return { xong: true, ketQua: null, lyDo: 'loi_ai' as const, thongBao: v.loi };
  return { xong: true, ...v.kq };
}
