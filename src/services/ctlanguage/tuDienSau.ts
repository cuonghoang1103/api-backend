/**
 * CT Language — TRANG TỪ "DÀY" (Đợt A, 14/11/2026). Phần có CSDL / R2 / AI; luật thuần ở `tuDienSauThuan.ts`.
 *
 *   · `xemMoRong`  (công khai): dữ liệu THẬT (từ ghép trong `ctl_tu`, cấp độ + chủ đề của kho soạn tay `lang_vocab_*`)
 *     + phần AI nếu ĐÃ có trong kho. Không bao giờ gọi model.
 *   · `sinhMoRong` (đăng nhập, đường `/ai/`): chưa có ⇒ gọi model MỘT lần, kiểm JSON, làm giàu bằng dữ liệu thật (id mục,
 *     âm Hán Việt, cách đọc chuẩn của từ điển), lưu VĨNH VIỄN một tệp JSON trên R2 (`khoaMoRong`) + đệm RAM.
 *   · Chống trùng: hai người tra cùng từ cùng lúc ⇒ chung MỘT lời hứa trong tiến trình (`dangSinh`); trước khi gọi model
 *     luôn đọc lại R2. Lượt SINH MỚI/người/ngày (giờ VN) đếm bằng Redis (Redis chết ⇒ đếm RAM): free `LUOT_FREE`, Pro
 *     `LUOT_PRO`; từ đã có trong kho không tốn lượt. Trần cả web/ngày `TRAN_WEB`. Trần $/ngày của cổng LLM áp sẵn.
 *   · KHÔNG có bảng Prisma nào (đợt này cấm đụng schema) — kho là R2, sổ lượt là Redis.
 */
import { prisma } from '../../config/database.js';
import { getObjectText, putObject, deleteObject } from '../../config/r2.js';
import { getRedis } from '../../config/redis.js';
import { AppError, NotFoundError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { dauNgayVn } from '../agent/anthropicChinhHang/hanMuc.js';
import { kiemNoiDung } from '../locNoiDung.js';
import { isProEffective } from '../pro.service.js';
import { kiemNn, type MucGon } from './tuDien.js';
import { laChuHan } from './tuDienChuan.js';
import {
  cauHoiMoRong, chuanCapDo, chuVietCuaMoRong, khoaMoRong, kiemMoRong, nhacMoRong, tachJson,
  type MoRongTu, type NnSau, type TuGoc, type TuLienQuan,
} from './tuDienSauThuan.js';

const soEnv = (ten: string, macDinh: number) => { const n = Number(process.env[ten]); return Number.isFinite(n) && n >= 0 && process.env[ten] !== '' && process.env[ten] !== undefined ? n : macDinh; };
/** Lượt SINH MỚI mỗi người mỗi ngày. 0 = tắt sinh mới cho hạng đó. */
export const luotFree = () => soEnv('CTL_TU_SAU_LUOT_FREE', 10);
export const luotPro = () => soEnv('CTL_TU_SAU_LUOT_PRO', 80);
/** Trần sinh mới của CẢ WEB mỗi ngày (chốt chặn cuối khi có người cày). */
export const tranWeb = () => soEnv('CTL_TU_SAU_TRAN_NGAY', 3000);

export interface TuCoSo extends TuGoc { id: number }
export interface BanLuu { v: number; nn: NnSau; chu: string; doc: string | null; taoLuc: string; model: string; duLieu: MoRongTu }
export interface DuLieuThat { tuGhep: TuLienQuan[]; capDo: string[]; chuDe: string[] }
export interface KetQuaMoRong {
  that: DuLieuThat;
  /** Phần AI đã lưu; `null` = chưa ai sinh. */
  ai: MoRongTu | null;
  taoLuc: string | null;
  /** Người gọi (nếu đăng nhập) còn bao nhiêu lượt sinh mới hôm nay; khách ⇒ null. */
  luot: { conLai: number; tran: number } | null;
}

export interface PhuThuocSau {
  layTu: (id: number) => Promise<TuCoSo | null>;
  duLieuThat: (t: TuCoSo) => Promise<DuLieuThat>;
  doc: (khoa: string) => Promise<string | null>;
  ghi: (khoa: string, json: string) => Promise<void>;
  xoa: (khoa: string) => Promise<void>;
  goi: (o: { system: string; user: string; userId: number }) => Promise<{ text: string; biCat?: boolean; model?: string }>;
  laPro: (userId: number) => Promise<boolean>;
  /** Tăng bộ đếm `khoa` (hết hạn sau ~36 giờ) rồi trả giá trị MỚI. */
  tang: (khoa: string, buoc: 1 | -1) => Promise<number>;
  dem: (khoa: string) => Promise<number>;
  /** Điền id mục thật / âm Hán Việt / cách đọc chuẩn cho các chip. */
  lamGiau: (nn: NnSau, m: MoRongTu) => Promise<MoRongTu>;
  biChan: (chu: string) => boolean;
}

// ─── Dữ liệu thật ────────────────────────────────────────────

const COT = `t.id, t.chu, t.chu_phu AS "chuPhu", t.doc, t.han_viet AS "hanViet", t.nghia_vi AS "nghiaVi", t.nghia_en AS "nghiaEn", t.thong_dung AS "thongDung"`;
const thoat = (s: string) => s.replace(/[\\%_]/g, (c) => `\\${c}`);
const nghiaNgan = (m: { nghiaVi: string | null; nghiaEn: string | null }) =>
  ((m.nghiaVi?.split(/[;；\n]/)[0] || m.nghiaEn?.split('; ')[0] || '').trim()).slice(0, 80);

async function duLieuThatCsdl(t: TuCoSo): Promise<DuLieuThat> {
  const chu = t.chu.trim();
  // Từ ghép THẬT: zh/ja = từ CHỨA từ này (thông dụng / kho soạn tay trước, dài hơn tối đa 2 chữ, bỏ tên riêng); en = cụm bắt đầu / kết thúc bằng từ này ("take off", "give and take").
  const tuGhepQ = t.nn === 'en'
    ? prisma.$queryRawUnsafe<MucGon[]>(
      `SELECT ${COT} FROM ctl_tu t WHERE t.nn = 'en' AND (lower(t.chu) LIKE $1 ESCAPE '\\' OR lower(t.chu) LIKE $2 ESCAPE '\\')
        ORDER BY t.uu_tien DESC, char_length(t.chu) LIMIT 12`, `${thoat(chu.toLowerCase())} %`, `% ${thoat(chu.toLowerCase())}`)
    : [...chu].length > 6 ? Promise.resolve([] as MucGon[]) : prisma.$queryRawUnsafe<MucGon[]>(
      `SELECT ${COT} FROM ctl_tu t WHERE t.nn = $1 AND t.chu LIKE $2 ESCAPE '\\' AND t.chu <> $3
          AND char_length(t.chu) <= $4 AND (t.doc IS NULL OR t.doc !~ '^[A-ZĀÁǍÀĒÉĚÈŌÓǑÒ]')
        ORDER BY (t.thong_dung OR t.nguon = 'kho') DESC, (t.nghia_vi IS NOT NULL) DESC, t.uu_tien DESC, char_length(t.chu), t.id LIMIT 10`,
      t.nn, `%${thoat(chu)}%`, chu, [...chu].length + 2);
  // Cấp độ + chủ đề THẬT: danh mục của kho từ vựng soạn tay (`lang_vocab_categories.level` · `.name`). Máy dev thường trống.
  const khoQ = prisma.$queryRawUnsafe<{ name: string; level: string | null }[]>(
    `SELECT DISTINCT c.name, c.level FROM lang_vocab_words w
       JOIN lang_vocab_categories c ON c.id = w.category_id JOIN languages l ON l.id = c.language_id
      WHERE l.code = $1 AND w.word = $2 LIMIT 6`, t.nn, chu);
  const [tuGhep, kho] = await Promise.all([tuGhepQ.catch(() => [] as MucGon[]), khoQ.catch(() => [] as { name: string; level: string | null }[])]);
  const bo = new Set<string>();
  return {
    tuGhep: tuGhep.filter((m) => (bo.has(m.chu) ? false : (bo.add(m.chu), true)))
      .map((m) => ({ id: m.id, chu: m.chu, doc: m.doc, hanViet: m.hanViet, vi: nghiaNgan(m), ...(m.nghiaVi ? {} : { nghiaAnh: true }) }))
      // Nghĩa Anh kiểu chú thích của CC-CEDICT/JMdict ("see 體格檢查", "(literary) …", "variant of …") không giúp gì người học ⇒ bỏ.
      .filter((m) => m.vi && !(m.nghiaAnh && /^(see |\(|variant of |old variant |abbr\. )/i.test(m.vi))),
    capDo: [...new Set(kho.map((k) => chuanCapDo(t.nn, k.level)).filter((x): x is string => !!x))],
    // Tên danh mục dạng "HSK 1 — Chào hỏi" ⇒ lấy phần chủ đề; danh mục chỉ là nhãn cấp ("N5") thì bỏ.
    chuDe: [...new Set(kho.map((k) => k.name.replace(/^(HSK|JLPT|TOCFL|CEFR)?\s?[A-CN]?\d[\d-]*\s*[—–:·-]\s*/i, '').trim())
      .filter((s) => s && s.length <= 24 && !chuanCapDo(t.nn, s)))].slice(0, 3),
  };
}

async function lamGiauCsdl(nn: NnSau, m: MoRongTu): Promise<MoRongTu> {
  const chips: { chu: string; doc: string | null; hanViet: string | null; vi?: string | null; id?: number | null }[] =
    [...m.tuGhep, ...m.canNghia, ...m.traiNghia, ...m.phanBiet.map((p) => ({ ...p, chu: p.voi }))];
  const ds = [...new Set(chips.map((c) => c.chu))];
  if (!ds.length) return m;
  const hang = await prisma.$queryRawUnsafe<{ id: number; chu: string; doc: string | null; han_viet: string | null }[]>(
    nn === 'en'
      ? `SELECT DISTINCT ON (lower(t.chu)) t.id, lower(t.chu) AS chu, t.doc, t.han_viet FROM ctl_tu t WHERE t.nn = $1 AND lower(t.chu) = ANY($2::text[]) ORDER BY lower(t.chu), t.uu_tien DESC`
      : `SELECT DISTINCT ON (t.chu) t.id, t.chu, t.doc, t.han_viet FROM ctl_tu t WHERE t.nn = $1 AND t.chu = ANY($2::text[]) ORDER BY t.chu, t.uu_tien DESC`,
    nn, nn === 'en' ? ds.map((d) => d.toLowerCase()) : ds).catch(() => []);
  const theoChu = new Map(hang.map((h) => [h.chu, h]));
  // Âm Hán Việt cho từ KHÔNG có trong từ điển: ghép âm chính từng chữ (chỉ khi cả từ là chữ Hán).
  const chuLe = nn === 'en' ? [] : [...new Set(ds.filter((d) => !theoChu.get(d)?.han_viet && [...d].every(laChuHan)).flatMap((d) => [...d]))];
  const han = chuLe.length ? await prisma.ctlChuHan.findMany({ where: { chu: { in: chuLe } }, select: { chu: true, hanViet: true } }).catch(() => []) : [];
  const amChu = new Map(han.map((h) => [h.chu, h.hanViet?.split(' · ')[0] ?? null]));
  const dien = <T extends { chu?: string; voi?: string; doc: string | null; hanViet: string | null; id?: number | null }>(c: T): T => {
    const chu = (c.voi ?? c.chu)!;
    const h = theoChu.get(nn === 'en' ? chu.toLowerCase() : chu);
    let hanViet = h?.han_viet ?? null;
    if (!hanViet && nn !== 'en' && [...chu].every(laChuHan)) {
      const am = [...chu].map((k) => amChu.get(k));
      if (am.every(Boolean)) hanViet = am.join(' ');
    }
    // Cách đọc: tiếng Trung lấy pinyin CHUẨN của từ điển khi có (model đôi khi sai thanh); Nhật giữ "kana · romaji" của model.
    return { ...c, id: h?.id ?? null, hanViet, doc: nn === 'zh' && h?.doc ? h.doc : c.doc ?? h?.doc ?? null };
  };
  return { ...m, tuGhep: m.tuGhep.map(dien), canNghia: m.canNghia.map(dien), traiNghia: m.traiNghia.map(dien), phanBiet: m.phanBiet.map(dien) };
}

// ─── Sổ lượt (Redis; Redis chết ⇒ RAM) ───────────────────────

const demRam = new Map<string, number>();
async function tangRedis(khoa: string, buoc: 1 | -1): Promise<number> {
  try {
    const r = await getRedis();
    const n = buoc === 1 ? await r.incr(khoa) : await r.decr(khoa);
    if (buoc === 1 && n === 1) await r.expire(khoa, 36 * 3600);
    return n;
  } catch {
    if (demRam.size > 20_000) demRam.clear();
    const n = (demRam.get(khoa) ?? 0) + buoc;
    demRam.set(khoa, n);
    return n;
  }
}
async function demRedis(khoa: string): Promise<number> {
  try { return Number(await (await getRedis()).get(khoa)) || 0; } catch { return demRam.get(khoa) ?? 0; }
}

const THAT: PhuThuocSau = {
  layTu: async (id) => {
    const t = await prisma.ctlTu.findUnique({ where: { id } });
    return t ? { id: t.id, nn: t.nn as NnSau, chu: t.chu, doc: t.doc, hanViet: t.hanViet, nghiaVi: t.nghiaVi, nghiaEn: t.nghiaEn, loai: t.loai, viDu: t.viDu } : null;
  },
  duLieuThat: duLieuThatCsdl,
  doc: (k) => getObjectText(k, 256 * 1024),
  ghi: async (k, json) => { await putObject(k, Buffer.from(json, 'utf8'), 'application/json; charset=utf-8', 'private, max-age=0, no-store'); },
  xoa: (k) => deleteObject(k),
  goi: async ({ system, user, userId }) => {
    const { llmComplete } = await import('../interview/llm/index.js');
    // `language_tutor`: việc người dùng bấm và ngồi chờ (không phải việc nền — `LLM_BACKGROUND_ENABLED` không chặn).
    const r = await llmComplete({
      step: 'generation', purpose: 'language_tutor', feature: 'language', userId, maxTokens: 4500, maxRetries: 1, timeoutMs: 100_000,
      system, messages: [{ role: 'user', content: user }],
    });
    return { text: r.text ?? '', biCat: r.biCat, model: r.model };
  },
  laPro: isProEffective,
  tang: tangRedis,
  dem: demRedis,
  lamGiau: lamGiauCsdl,
  biChan: (s) => kiemNoiDung(s).chan,
};

// ─── Đệm RAM + chống trùng ───────────────────────────────────

const TRAN_DEM = 3000;
const dem = new Map<string, { ban: BanLuu | null; het: number }>();
const dangSinh = new Map<string, Promise<BanLuu>>();

function ghiDem(khoa: string, ban: BanLuu | null) {
  if (dem.size >= TRAN_DEM) { const dau = dem.keys().next().value; if (dau !== undefined) dem.delete(dau); }
  dem.delete(khoa);
  // Có ⇒ giữ 6 giờ (kho bất biến, chỉ admin xoá); chưa có ⇒ 45 giây (người khác vừa sinh xong thì khách sớm thấy).
  dem.set(khoa, { ban, het: Date.now() + (ban ? 6 * 3600_000 : 45_000) });
}

async function docKho(khoa: string, pt: PhuThuocSau, boDem = false): Promise<BanLuu | null> {
  const c = dem.get(khoa);
  if (!boDem && c && c.het > Date.now()) return c.ban;
  const tho = await pt.doc(khoa).catch(() => null);
  let ban: BanLuu | null = null;
  if (tho) {
    try {
      const o = JSON.parse(tho) as BanLuu;
      if (o && o.duLieu && Array.isArray(o.duLieu.nghia) && o.duLieu.giaiThich) ban = o;
    } catch { /* tệp hỏng ⇒ coi như chưa có, lượt sinh sau ghi đè */ }
  }
  ghiDem(khoa, ban);
  return ban;
}

/** Chỉ cho test: xoá đệm RAM + lời hứa đang chạy. */
export function xoaDemMoRong() { dem.clear(); dangSinh.clear(); demRam.clear(); }

const ngayVn = () => new Date(dauNgayVn().getTime() + 7 * 3600_000).toISOString().slice(0, 10);
const khoaLuot = (userId: number) => `ctl:tusau:luot:${ngayVn()}:${userId}`;
const khoaWeb = () => `ctl:tusau:web:${ngayVn()}`;

async function luotCua(userId: number, pt: PhuThuocSau) {
  const laPro = await pt.laPro(userId);
  const tran = laPro ? luotPro() : luotFree();
  return { tran, conLai: Math.max(0, tran - (await pt.dem(khoaLuot(userId)))), laPro };
}

async function tuCua(nnGoc: string, id: number, pt: PhuThuocSau): Promise<TuCoSo> {
  const nn = kiemNn(nnGoc);
  const t = await pt.layTu(id);
  if (!t || t.nn !== nn) throw new NotFoundError('Không tìm thấy mục từ');
  return t;
}

export async function xemMoRong(nnGoc: string, id: number, userId: number | null, pt: PhuThuocSau = THAT): Promise<KetQuaMoRong> {
  const t = await tuCua(nnGoc, id, pt);
  const [that, ban, luot] = await Promise.all([
    pt.duLieuThat(t),
    docKho(khoaMoRong(t.nn, t.chu, t.doc), pt),
    userId ? luotCua(userId, pt).then(({ tran, conLai }) => ({ tran, conLai })).catch(() => null) : Promise.resolve(null),
  ]);
  return { that, ai: ban?.duLieu ?? null, taoLuc: ban?.taoLuc ?? null, luot };
}

/** Gọi model + kiểm + làm giàu + lưu. Ném lỗi khi không ra bản đủ tốt (KHÔNG lưu gì). */
async function sinhThat(t: TuCoSo, khoa: string, userId: number, pt: PhuThuocSau): Promise<BanLuu> {
  const r = await pt.goi({ system: nhacMoRong(t.nn), user: cauHoiMoRong(t), userId });
  if (r.biCat) throw new Error('model bị cắt giữa chừng (chạm trần token)');
  const sach = kiemMoRong(t.nn, t, tachJson(r.text));
  if (!sach) throw new Error('JSON của model thiếu hoặc hỏng');
  if (pt.biChan(chuVietCuaMoRong(sach))) throw new Error('nội dung AI lọt từ bị chặn');
  const duLieu = await pt.lamGiau(t.nn, sach).catch(() => sach);
  const ban: BanLuu = { v: 1, nn: t.nn, chu: t.chu, doc: t.doc ?? null, taoLuc: new Date().toISOString(), model: r.model ?? '', duLieu };
  await pt.ghi(khoa, JSON.stringify(ban));
  ghiDem(khoa, ban);
  return ban;
}

/** Một lượt sinh có tính lượt của `userId`: kiểm lượt người ⇒ giành trần web ⇒ gọi model; hỏng thì trả lượt. */
async function sinhCoTinhLuot(t: TuCoSo, khoa: string, userId: number, pt: PhuThuocSau): Promise<BanLuu> {
  const luot = await luotCua(userId, pt);
  if (luot.conLai <= 0) {
    throw new AppError(
      luot.tran <= 0 ? 'Tính năng mở rộng mục từ bằng AI đang tạm tắt.'
        : luot.laPro ? `Hôm nay bạn đã mở rộng đủ ${luot.tran} từ mới bằng AI — mai làm tiếp nhé. Từ đã có sẵn vẫn xem được bình thường.`
          : `Hôm nay bạn đã dùng hết ${luot.tran} lượt mở rộng từ mới bằng AI. Từ đã có sẵn vẫn xem được; nâng cấp Pro để có ${luotPro()} lượt mỗi ngày.`,
      429, 'CTL_TU_SAU_HET_LUOT', { tran: luot.tran });
  }
  if ((await pt.tang(khoaWeb(), 1)) > tranWeb()) {
    await pt.tang(khoaWeb(), -1).catch(() => 0);
    throw new AppError('Hôm nay Gấu đã soạn rất nhiều từ mới — phần mở rộng bằng AI tạm nghỉ tới mai.', 429, 'CTL_TU_SAU_TRAN_WEB');
  }
  await pt.tang(khoaLuot(userId), 1);
  try { return await sinhThat(t, khoa, userId, pt); } catch (e) {
    // Hỏng ⇒ trả lượt (người dùng không mất lượt vì model lỗi).
    await Promise.all([pt.tang(khoaLuot(userId), -1), pt.tang(khoaWeb(), -1)]).catch(() => []);
    throw e;
  }
}

export async function sinhMoRong(nnGoc: string, id: number, userId: number, pt: PhuThuocSau = THAT): Promise<KetQuaMoRong> {
  const t = await tuCua(nnGoc, id, pt);
  const khoa = khoaMoRong(t.nn, t.chu, t.doc);
  const that = pt.duLieuThat(t).catch((): DuLieuThat => ({ tuGhep: [], capDo: [], chuDe: [] }));
  // Đã có (đọc thẳng R2, bỏ qua đệm "chưa có" 45 giây) ⇒ trả luôn, KHÔNG tốn lượt. Đang có người sinh ⇒ khỏi đọc R2.
  let ban = dangSinh.has(khoa) ? null : await docKho(khoa, pt, true);
  for (let lan = 0; !ban && lan < 2; lan++) {
    // KHÔNG có `await` nào giữa `get` và `set` ⇒ hai yêu cầu cùng lúc luôn chung MỘT lời hứa (một lần gọi model).
    let cho = dangSinh.get(khoa);
    const cuaMinh = !cho;
    if (!cho) {
      cho = sinhCoTinhLuot(t, khoa, userId, pt).finally(() => { dangSinh.delete(khoa); });
      dangSinh.set(khoa, cho);
    }
    try { ban = await cho; } catch (e) {
      // Chờ nhờ lượt của NGƯỜI KHÁC mà người đó hết lượt ⇒ thử lại bằng lượt của chính mình (một lần).
      if (!cuaMinh && lan === 0 && e instanceof AppError && e.code === 'CTL_TU_SAU_HET_LUOT') continue;
      if (e instanceof AppError && e.statusCode !== 500) throw e;     // trần tiền / bảo trì CuongMini / hết lượt: giữ nguyên câu
      logger.warn('[ctl-tu-sau] sinh mở rộng lỗi', { nn: t.nn, chu: t.chu, error: (e as Error)?.message });
      throw new AppError('Gấu chưa soạn xong phần mở rộng cho từ này. Bạn thử lại sau ít phút nhé.', 503, 'CTL_TU_SAU_AI_LOI');
    }
  }
  if (!ban) throw new AppError('Gấu chưa soạn xong phần mở rộng cho từ này. Bạn thử lại sau ít phút nhé.', 503, 'CTL_TU_SAU_AI_LOI');
  const luot = await luotCua(userId, pt).then(({ tran, conLai }) => ({ tran, conLai })).catch(() => null);
  return { that: await that, ai: ban.duLieu, taoLuc: ban.taoLuc, luot };
}

/** Admin: xoá bản AI của một từ (sau khi có báo sai) ⇒ lượt tra sau sinh lại. */
export async function xoaMoRong(nnGoc: string, id: number, pt: PhuThuocSau = THAT): Promise<{ daXoa: boolean }> {
  const t = await tuCua(nnGoc, id, pt);
  const khoa = khoaMoRong(t.nn, t.chu, t.doc);
  await pt.xoa(khoa);
  ghiDem(khoa, null);
  return { daXoa: true };
}
