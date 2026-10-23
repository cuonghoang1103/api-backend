/**
 * Vở viết tay (iPad) — 🃏 THẺ ÔN rút từ trang (23/10/2026).
 * ─────────────────────────────────────────────────────────────────────
 * Hai nửa:
 *   1. AI rút ý chính + câu hỏi tự kiểm + thẻ mặt trước/sau từ MỘT trang (ảnh
 *      trang và/hoặc chữ Vision đọc trên iPad). Chạy nền + hỏi lại — cùng mẫu
 *      `voVietLai` vì model thị giác chạy 20–90 giây, sát trần 100s Cloudflare.
 *      KẾT QUẢ KHÔNG TỰ LƯU: người dùng sửa/bỏ trên app rồi mới gửi `luuTheOn`.
 *   2. Lưu + ôn: TÁI DÙNG `note_vocab_entries` (hệ thẻ ôn có sẵn của Notes, nên
 *      thẻ hiện luôn ở bộ flashcard của trang trên web) với `kind` mới và lịch
 *      SM-2 dùng chung (`srs/sm2.ts`).
 *
 * Ảnh KHÔNG được lưu: nhận base64, gửi thẳng cho cổng, xong.
 */
import crypto from 'node:crypto';
import { prisma } from '../config/database.js';
import { buildPublicUrl } from '../config/r2.js';
import { AppError, BadRequestError } from '../middleware/errorHandler.js';
import { checkTokenQuota, isAiAvailable } from './interview/llm/index.js';
import { visionComplete, type VisionImage } from './docTools/vision.js';
import { scheduleSm2 } from './srs/sm2.js';

// ─── Giới hạn ────────────────────────────────────────────────────────────

const MAX_B64 = 2_100_000;
const MAX_GOI_Y = 6000;
const MAX_Y_AI = 8;
const MAX_CAU_HOI_AI = 8;
const MAX_THE_AI = 20;
const MAX_Y_LUU = 12;
const MAX_THE_LUU = 40;
const UUID_RE = /^[0-9a-fA-F-]{16,64}$/;

export const LOAI_THE = ['THE', 'CAU_HOI'] as const;
export type LoaiThe = (typeof LOAI_THE)[number];
const KIND_VO = ['THE', 'CAU_HOI', 'Y_CHINH'];

const GIAY: Record<string, string> = {
  trang: 'giấy trắng trơn', keNgang: 'giấy kẻ ngang', oLy: 'giấy ô ly', cham: 'giấy chấm',
  cornell: 'giấy Cornell (cột gợi ý bên trái, ghi chép bên phải, tóm tắt ở đáy)',
  genkou: 'giấy ô vuông 原稿用紙', nhacLy: 'giấy khuông nhạc', bonDong: 'giấy 4 dòng tập viết tiếng Anh',
  luoiCode: 'lưới chép code', tuVung3Cot: 'mẫu từ vựng 3 cột (từ · nghĩa · ví dụ)',
  soDoTuDuy: 'mẫu sơ đồ tư duy (nút trung tâm, nhánh toả ra)', bangSoSanh: 'mẫu bảng so sánh',
};

// ─── Tiện ích chuỗi ──────────────────────────────────────────────────────

const chuoi = (v: unknown, max: number): string =>
  String(v ?? '').replace(/\r\n?/g, '\n').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max);

function docAnh(raw: unknown): VisionImage | null {
  let s = String(raw ?? '').trim();
  if (!s) return null;
  const pre = /^data:(image\/(?:png|jpeg|webp));base64,/.exec(s);
  if (pre) s = s.slice(pre[0].length);
  s = s.replace(/\s+/g, '');
  if (s.length > MAX_B64) throw new BadRequestError('Ảnh trang quá lớn (tối đa ~1,5MB)', 'ANH_QUA_LON');
  if (!/^[A-Za-z0-9+/]+=*$/.test(s)) throw new BadRequestError('Ảnh trang không phải base64 hợp lệ', 'ANH_HONG');
  const mediaType = s.startsWith('/9j/') ? 'image/jpeg' : s.startsWith('iVBOR') ? 'image/png'
    : s.startsWith('UklGR') ? 'image/webp' : '';
  if (!mediaType) throw new BadRequestError('Ảnh trang phải là JPEG, PNG hoặc WebP', 'ANH_HONG');
  return { data: s, mediaType };
}

function tachJson(text: string): Record<string, unknown> | null {
  const s = text.replace(/```(?:json)?/gi, '');
  const a = s.indexOf('{'), b = s.lastIndexOf('}');
  if (a < 0 || b <= a) return null;
  try {
    const o = JSON.parse(s.slice(a, b + 1));
    return o && typeof o === 'object' && !Array.isArray(o) ? o : null;
  } catch {
    return null;
  }
}

// ─── 1. AI rút thẻ ───────────────────────────────────────────────────────

export const SYSTEM_ON_THE = [
  'Bạn giúp một sinh viên Việt Nam ÔN BÀI từ chính trang vở viết tay của họ (Apple Pencil).',
  'Đầu vào: ảnh trang vở và/hoặc chữ máy đọc được trên iPad (hay sai chính tả, thiếu dấu — hiểu theo ngữ cảnh).',
  '',
  'LUẬT CỨNG:',
  '1. CHỈ dựa vào nội dung CÓ TRÊN TRANG. Không thêm kiến thức ngoài trang, không bịa số liệu, định nghĩa hay ví dụ trang không có. Trang thiếu ý thì để thiếu — không tự bổ sung.',
  '2. Giữ đúng thứ tiếng của trang (Việt/Anh/Nhật trộn lẫn thì giữ nguyên từng phần; thuật ngữ tiếng Anh giữ nguyên).',
  '3. "yChinh": 3–8 ý chính của trang, mỗi ý MỘT câu ngắn (≤ 200 ký tự), theo thứ tự trên trang.',
  '4. "cauHoi": 2–6 câu hỏi TỰ KIỂM buộc phải hiểu (kiểu "Vì sao…?", "So sánh A và B?", "Khi nào dùng…?", "Điều gì xảy ra nếu…?"), kèm "dap" là đáp án ngắn lấy từ trang.',
  '5. "the": 3–15 thẻ ghi nhớ. "truoc" = câu hỏi / khái niệm / thuật ngữ (ngắn, ≤ 120 ký tự); "sau" = đáp án ngắn gọn (≤ 300 ký tự). Mỗi thẻ MỘT ý, không trùng câu hỏi tự kiểm.',
  '6. Công thức viết bằng ký tự Unicode (x², √, ∫, ≤, →). Code giữ nguyên.',
  '7. Trang không có nội dung học (trống, chỉ hình vẽ không chữ): trả {"yChinh":[],"cauHoi":[],"the":[]}.',
  '',
  'ĐẦU RA: DUY NHẤT một đối tượng JSON (không markdown, không ```):',
  '{"yChinh":["..."],"cauHoi":[{"hoi":"...","dap":"..."}],"the":[{"truoc":"...","sau":"..."}]}',
].join('\n');

export interface KetQuaRutThe {
  yChinh: string[];
  cauHoi: Array<{ hoi: string; dap: string }>;
  the: Array<{ truoc: string; sau: string }>;
}

/** Chuẩn hoá đầu ra của model — THUẦN, có test. */
export function chuanHoaRutThe(o: Record<string, unknown> | null): KetQuaRutThe {
  if (!o) return { yChinh: [], cauHoi: [], the: [] };
  const daCo = new Set<string>();
  const khoa = (s: string) => s.toLowerCase().replace(/\s+/g, ' ');
  const yChinh = (Array.isArray(o.yChinh) ? o.yChinh : [])
    .map((y) => chuoi(typeof y === 'object' && y ? (y as Record<string, unknown>).noiDung ?? '' : y, 300)
      .replace(/^[-–•*·]\s+/, ''))
    .filter((y) => y && !daCo.has(khoa(y)) && (daCo.add(khoa(y)), true))
    .slice(0, MAX_Y_AI);
  const cauHoi = (Array.isArray(o.cauHoi) ? o.cauHoi : [])
    .filter((c): c is Record<string, unknown> => !!c && typeof c === 'object')
    .map((c) => ({ hoi: chuoi(c.hoi ?? c.cauHoi, 500), dap: chuoi(c.dap ?? c.traLoi, 2000) }))
    .filter((c) => c.hoi && c.dap && !daCo.has(khoa(c.hoi)) && (daCo.add(khoa(c.hoi)), true))
    .slice(0, MAX_CAU_HOI_AI);
  const the = (Array.isArray(o.the) ? o.the : [])
    .filter((c): c is Record<string, unknown> => !!c && typeof c === 'object')
    .map((c) => ({ truoc: chuoi(c.truoc ?? c.front, 500), sau: chuoi(c.sau ?? c.back, 2000) }))
    .filter((c) => c.truoc && c.sau && !daCo.has(khoa(c.truoc)) && (daCo.add(khoa(c.truoc)), true))
    .slice(0, MAX_THE_AI);
  return { yChinh, cauHoi, the };
}

export async function rutTheTuTrang(userId: number, b: {
  anh?: unknown; goiY?: unknown; tieuDe?: unknown; mon?: unknown; giay?: unknown;
}): Promise<KetQuaRutThe & { model: string }> {
  const img = docAnh(b.anh);
  const goiY = chuoi(b.goiY, MAX_GOI_Y);
  if (!img && !goiY) throw new BadRequestError('Thiếu ảnh trang hoặc chữ của trang', 'THIEU_NOI_DUNG');
  if (!isAiAvailable()) {
    throw new AppError('Tính năng AI chưa được cấu hình hoặc đang tạm ngắt.', 503, 'AI_UNAVAILABLE');
  }
  if (!(await checkTokenQuota(userId))) {
    throw new AppError('Đã hết hạn mức AI hôm nay. Thử lại vào ngày mai.', 429, 'QUOTA_EXCEEDED');
  }

  const tieuDe = chuoi(b.tieuDe, 200);
  const mon = chuoi(b.mon, 150);
  const giay = GIAY[String(b.giay ?? '')];
  const userText = [
    mon ? `Môn: ${mon}.` : '',
    tieuDe ? `Trang: ${tieuDe}.` : '',
    giay ? `Loại giấy: ${giay}.` : '',
    goiY
      ? `Chữ iPad đọc được trên trang (hay sai${img ? ', ảnh mới là nguồn đúng' : ''}):\n<<<\n${goiY}\n>>>`
      : 'Không có chữ máy đọc — đọc từ ảnh.',
    'Rút ý chính, câu hỏi tự kiểm và thẻ ôn theo đúng luật và đúng khuôn JSON.',
  ].filter(Boolean).join('\n\n');

  let text: string;
  let model: string;
  try {
    const kq = await visionComplete({
      purpose: 'vo_viet_lai',
      feature: 'vo_on_the',
      system: SYSTEM_ON_THE,
      userText,
      images: img ? [img] : [],
      maxTokens: 4000,
      maxRetries: 1,
      timeoutMs: 150_000,
      userId,
    });
    text = kq.text;
    model = kq.model;
  } catch (e) {
    if (e instanceof AppError) throw e;
    throw new AppError('AI chưa đọc được trang này — thử lại sau ít phút.', 502, 'AI_LOI');
  }

  const o = tachJson(text);
  if (!o) throw new AppError('AI trả về sai khuôn — thử lại.', 502, 'ON_THE_HONG');
  const kq = chuanHoaRutThe(o);
  if (!kq.yChinh.length && !kq.cauHoi.length && !kq.the.length) {
    throw new AppError('Trang này chưa có nội dung để rút thẻ ôn.', 422, 'TRANG_TRONG');
  }
  return { ...kq, model };
}

type ViecRut = {
  userId: number; luc: number; ketQua?: unknown;
  loi?: { thongDiep: string; ma: string; status: number };
};
const cacViec = new Map<string, ViecRut>();
const SONG_MS = 15 * 60_000;

export function batDauRutThe(userId: number, b: Record<string, unknown>) {
  const bay = Date.now() - SONG_MS;
  for (const [id, v] of cacViec) if (v.luc < bay) cacViec.delete(id);
  // Đầu vào hỏng thì báo NGAY bằng mã.
  const img = docAnh(b.anh);
  if (!img && !chuoi(b.goiY, MAX_GOI_Y)) throw new BadRequestError('Thiếu ảnh trang hoặc chữ của trang', 'THIEU_NOI_DUNG');
  const dangChay = [...cacViec.values()].filter((v) => v.userId === userId && !v.ketQua && !v.loi).length;
  if (dangChay >= 2) throw new AppError('Đang rút thẻ cho 2 trang rồi — đợi xong đã nhé.', 429, 'ON_THE_BAN');
  const id = crypto.randomUUID();
  const viec: ViecRut = { userId, luc: Date.now() };
  cacViec.set(id, viec);
  rutTheTuTrang(userId, b).then(
    (kq) => { viec.ketQua = kq; },
    (e: { message?: string; code?: string; statusCode?: number }) => {
      viec.loi = { thongDiep: e?.message || 'AI chưa rút được thẻ', ma: e?.code || 'AI_LOI', status: e?.statusCode || 502 };
    },
  );
  return { viec: id };
}

export function xemViecRutThe(userId: number, id: string) {
  const v = cacViec.get(id);
  if (!v || v.userId !== userId) {
    throw new AppError('Không tìm thấy lượt rút thẻ này (có thể đã quá 15 phút).', 404, 'ON_THE_KHONG_CO');
  }
  if (v.loi) throw new AppError(v.loi.thongDiep, v.loi.status, v.loi.ma);
  if (!v.ketQua) return { xong: false, giay: Math.round((Date.now() - v.luc) / 1000) };
  return { xong: true, ...(v.ketQua as object) };
}

// ─── 2. Lưu + ôn ─────────────────────────────────────────────────────────

const CHON_THE = {
  id: true, clientId: true, term: true, meaning: true, kind: true, dueAt: true,
  intervalDays: true, repetitions: true, lapses: true, reviewCount: true, lastReviewedAt: true,
} as const;

type HangThe = {
  id: number; clientId: string | null; term: string; meaning: string | null; kind: string;
  dueAt: Date | null; intervalDays: number; repetitions: number; lapses: number;
  reviewCount: number; lastReviewedAt: Date | null;
};

export interface TheOn {
  id: number; clientId: string | null; truoc: string; sau: string; loai: LoaiThe;
  dueAt: string | null; intervalDays: number; repetitions: number; lapses: number;
  lanOn: number; lanCuoi: string | null;
}

function theRa(r: HangThe): TheOn {
  return {
    id: r.id, clientId: r.clientId, truoc: r.term, sau: r.meaning ?? '',
    loai: r.kind === 'CAU_HOI' ? 'CAU_HOI' : 'THE',
    dueAt: r.dueAt?.toISOString() ?? null,
    intervalDays: r.intervalDays, repetitions: r.repetitions, lapses: r.lapses,
    lanOn: r.reviewCount, lanCuoi: r.lastReviewedAt?.toISOString() ?? null,
  };
}

async function timTrang(userId: number, q: { clientId?: unknown; noteId?: unknown }): Promise<number> {
  const noteId = Number(q.noteId);
  const clientId = typeof q.clientId === 'string' ? q.clientId.trim() : '';
  if (!(Number.isInteger(noteId) && noteId > 0) && !UUID_RE.test(clientId)) {
    throw new BadRequestError('Thiếu mã trang (clientId hoặc noteId)', 'INVALID_INPUT');
  }
  const t = await prisma.note.findFirst({
    where: Number.isInteger(noteId) && noteId > 0
      ? { id: noteId, userId, deletedAt: null }
      : { clientId, userId, deletedAt: null },
    select: { id: true },
  });
  if (!t) throw new AppError('Không tìm thấy trang', 404, 'NOTE_NOT_FOUND');
  return t.id;
}

export async function theCuaTrang(userId: number, q: { clientId?: unknown; noteId?: unknown }) {
  const noteId = await timTrang(userId, q);
  return docTheCuaTrang(userId, noteId);
}

async function docTheCuaTrang(userId: number, noteId: number) {
  const rows = await prisma.noteVocabEntry.findMany({
    where: { userId, noteId, kind: { in: KIND_VO } },
    orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    select: CHON_THE,
  });
  return {
    noteId,
    yChinh: rows.filter((r) => r.kind === 'Y_CHINH').map((r) => ({ id: r.id, noiDung: r.term })),
    the: rows.filter((r) => r.kind !== 'Y_CHINH').map(theRa),
  };
}

export async function luuTheOn(userId: number, b: { trangClientId?: unknown; yChinh?: unknown; the?: unknown }) {
  const noteId = await timTrang(userId, { clientId: b.trangClientId });
  const coYChinh = Array.isArray(b.yChinh);
  const yChinh = coYChinh
    ? (b.yChinh as unknown[]).map((y) => chuoi(y, 500)).filter(Boolean).slice(0, MAX_Y_LUU)
    : [];
  if (b.the !== undefined && !Array.isArray(b.the)) throw new BadRequestError('"the" phải là mảng', 'INVALID_INPUT');
  const dsThe = (Array.isArray(b.the) ? b.the : []) as unknown[];
  if (dsThe.length > MAX_THE_LUU) throw new BadRequestError(`Tối đa ${MAX_THE_LUU} thẻ một lượt`, 'TOO_MANY');
  const the = dsThe.map((raw) => {
    const c = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
    const clientId = typeof c.clientId === 'string' && c.clientId.trim() ? c.clientId.trim() : null;
    if (clientId && !UUID_RE.test(clientId)) throw new BadRequestError('clientId của thẻ không hợp lệ', 'INVALID_CLIENT_ID');
    const truoc = chuoi(c.truoc, 500);
    const sau = chuoi(c.sau, 4000);
    if (!truoc || !sau) throw new BadRequestError('Thẻ phải có đủ mặt trước và mặt sau', 'INVALID_INPUT');
    return { clientId, truoc, sau, loai: c.loai === 'CAU_HOI' ? 'CAU_HOI' : 'THE' };
  });

  await prisma.$transaction(async (tx) => {
    const cuoi = await tx.noteVocabEntry.findFirst({
      where: { userId, noteId }, orderBy: { sortOrder: 'desc' }, select: { sortOrder: true },
    });
    let thuTu = (cuoi?.sortOrder ?? -1) + 1;
    if (coYChinh) {
      await tx.noteVocabEntry.deleteMany({ where: { userId, noteId, kind: 'Y_CHINH' } });
      for (const y of yChinh) {
        await tx.noteVocabEntry.create({ data: { userId, noteId, kind: 'Y_CHINH', term: y, sortOrder: thuTu++ } });
      }
    }
    const now = new Date();
    for (const t of the) {
      if (t.clientId) {
        const co = await tx.noteVocabEntry.findUnique({
          where: { uk_note_vocab_client: { userId, clientId: t.clientId } }, select: { id: true, noteId: true },
        });
        if (co) {
          // Idempotent: gửi lại đúng thẻ đó chỉ sửa chữ, GIỮ lịch ôn.
          await tx.noteVocabEntry.update({ where: { id: co.id }, data: { term: t.truoc, meaning: t.sau, kind: t.loai } });
          continue;
        }
      }
      await tx.noteVocabEntry.create({
        data: {
          userId, noteId, kind: t.loai, clientId: t.clientId, term: t.truoc, meaning: t.sau,
          dueAt: now, sortOrder: thuTu++,
        },
      });
    }
  });
  return docTheCuaTrang(userId, noteId);
}

async function theCuaNguoi(userId: number, id: number, kinds = KIND_VO) {
  if (!Number.isInteger(id) || id <= 0) throw new BadRequestError('Mã thẻ không hợp lệ', 'INVALID_ID');
  const r = await prisma.noteVocabEntry.findFirst({ where: { id, userId, kind: { in: kinds } }, select: { id: true } });
  if (!r) throw new AppError('Không tìm thấy thẻ', 404, 'NOT_FOUND');
}

export async function suaTheOn(userId: number, id: number, b: { truoc?: unknown; sau?: unknown }) {
  await theCuaNguoi(userId, id);
  const d: { term?: string; meaning?: string } = {};
  if (b.truoc !== undefined) {
    const s = chuoi(b.truoc, 500);
    if (!s) throw new BadRequestError('Mặt trước không được để trống', 'INVALID_INPUT');
    d.term = s;
  }
  if (b.sau !== undefined) d.meaning = chuoi(b.sau, 4000);
  if (!Object.keys(d).length) throw new BadRequestError('Không có gì để sửa', 'EMPTY_UPDATE');
  const r = await prisma.noteVocabEntry.update({ where: { id }, data: d, select: CHON_THE });
  return theRa(r);
}

export async function xoaTheOn(userId: number, id: number) {
  await theCuaNguoi(userId, id);
  await prisma.noteVocabEntry.delete({ where: { id } });
  return { ok: true };
}

const MUC_Q: Record<string, number> = { lai: 1, kho: 3, tot: 4, de: 5 };

export async function chamTheOn(userId: number, id: number, b: { muc?: unknown }) {
  const q = MUC_Q[String(b.muc ?? '')];
  if (q === undefined) throw new BadRequestError('muc phải là lai | kho | tot | de', 'INVALID_INPUT');
  if (!Number.isInteger(id) || id <= 0) throw new BadRequestError('Mã thẻ không hợp lệ', 'INVALID_ID');
  const r = await prisma.noteVocabEntry.findFirst({
    where: { id, userId, kind: { in: ['THE', 'CAU_HOI'] } },
    select: { id: true, easeFactor: true, repetitions: true, intervalDays: true, lapses: true, knownStreak: true },
  });
  if (!r) throw new AppError('Không tìm thấy thẻ', 404, 'NOT_FOUND');
  const now = new Date();
  const s = scheduleSm2(r, q, { now });
  const daThuoc = q >= 4;
  const moi = await prisma.noteVocabEntry.update({
    where: { id },
    data: {
      easeFactor: s.easeFactor, repetitions: s.repetitions, intervalDays: s.intervalDays,
      lapses: s.lapses, dueAt: s.dueAt,
      reviewCount: { increment: 1 }, lastReviewedAt: now,
      isKnown: daThuoc, knownStreak: daThuoc ? Math.min(9999, r.knownStreak + 1) : 0,
    },
    select: CHON_THE,
  });
  return theRa(moi);
}

function ngayHopLe(v: unknown): Date | null {
  if (typeof v !== 'string' || !v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

export async function theHomNay(userId: number, q: { gioiHan?: unknown; den?: unknown; tuNgay?: unknown }) {
  const gioiHan = Math.min(200, Math.max(1, Number(q.gioiHan) || 60));
  const den = ngayHopLe(q.den) ?? new Date();
  const tuNgay = ngayHopLe(q.tuNgay) ?? new Date(Date.now() - 24 * 3600_000);
  const trangSong = { deletedAt: null };
  const dieuKien = {
    userId, kind: { in: ['THE', 'CAU_HOI'] }, dueAt: { lte: den }, note: trangSong,
  };
  const [rows, conLai, tong, daOnHomNay] = await Promise.all([
    prisma.noteVocabEntry.findMany({
      where: dieuKien,
      orderBy: [{ dueAt: 'asc' }, { id: 'asc' }],
      take: gioiHan,
      select: {
        ...CHON_THE,
        note: {
          select: {
            id: true, clientId: true, title: true, inkPreviewKey: true,
            subject: { select: { name: true } }, chapter: { select: { title: true } },
          },
        },
      },
    }),
    prisma.noteVocabEntry.count({ where: dieuKien }),
    prisma.noteVocabEntry.count({ where: { userId, kind: { in: ['THE', 'CAU_HOI'] }, note: trangSong } }),
    prisma.noteVocabEntry.count({
      where: { userId, kind: { in: ['THE', 'CAU_HOI'] }, lastReviewedAt: { gte: tuNgay }, note: trangSong },
    }),
  ]);
  return {
    the: rows.map((r) => ({
      ...theRa(r),
      trang: {
        id: r.note.id, clientId: r.note.clientId, tieuDe: r.note.title,
        monTen: r.note.subject?.name ?? '', cuonTen: r.note.chapter?.title ?? null,
        previewUrl: r.note.inkPreviewKey ? buildPublicUrl(r.note.inkPreviewKey) : null,
      },
    })),
    conLai, tong, daOnHomNay,
  };
}

export const _chiDeKiemThu = { chuanHoaRutThe, tachJson, docAnh, MUC_Q };
