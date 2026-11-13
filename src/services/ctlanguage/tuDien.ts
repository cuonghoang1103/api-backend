/**
 * CT Language — TRA TỪ ĐIỂN (bảng ctl_tu · ctl_khoa_tra · ctl_chu_han, nạp bằng scripts/ctlanguage/nhap-tu-dien.mts).
 *
 * Tra = khoá chuẩn hoá (`khoaTra`) khớp ĐÚNG trước, rồi khớp TIỀN TỐ (chỉ mục `text_pattern_ops`), sắp theo `uu_tien`
 * (kho soạn tay có nghĩa Việt > từ thông dụng > còn lại) rồi độ dài. Gõ tiếng Việt (có dấu / có khoảng trắng) ⇒ tra
 * thêm theo NGHĨA Việt của kho soạn tay (tra ngược Việt → ngoại ngữ).
 */
import { prisma } from '../../config/database.js';
import { BadRequestError, NotFoundError } from '../../middleware/errorHandler.js';
import { coKana, khoaTra, laChuHan, romaji } from './tuDienChuan.js';
import { kiemNet, nhanChu } from './vietTay.js';

export const NN_TU_DIEN = ['en', 'ja', 'zh'] as const;
export type NnTuDien = (typeof NN_TU_DIEN)[number];

export function kiemNn(nn: string): NnTuDien {
  if (!(NN_TU_DIEN as readonly string[]).includes(nn)) throw new BadRequestError('Ngôn ngữ không hỗ trợ', 'CTL_NN_SAI');
  return nn as NnTuDien;
}

export interface MucGon {
  id: number; chu: string; chuPhu: string | null; doc: string | null; hanViet: string | null;
  nghiaVi: string | null; nghiaEn: string | null; thongDung: boolean;
}

const COT = `t.id, t.chu, t.chu_phu AS "chuPhu", t.doc, t.han_viet AS "hanViet", t.nghia_vi AS "nghiaVi", t.nghia_en AS "nghiaEn", t.thong_dung AS "thongDung"`;
const thoat = (s: string) => s.replace(/[\\%_]/g, (c) => `\\${c}`);
const VIET = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i;

export async function tra(nnGoc: string, qGoc: string, gioiHan = 30): Promise<MucGon[]> {
  const nn = kiemNn(nnGoc);
  const q = qGoc.trim().slice(0, 60);
  const k = khoaTra(q);
  if (!k) return [];
  const lim = Math.max(1, Math.min(50, gioiHan));
  // Ứng viên tiền tố trần 3000 dòng (gõ "a" khớp hàng chục nghìn khoá) — đủ để chọn top theo ưu tiên.
  const theoKhoa = await prisma.$queryRawUnsafe<(MucGon & { khop: number })[]>(
    `SELECT ${COT}, MIN(CASE WHEN c.khoa = $2 THEN 0 ELSE 1 END) AS khop
       FROM (SELECT tu_id, khoa FROM ctl_khoa_tra WHERE nn = $1 AND khoa LIKE $3 ESCAPE '\\' LIMIT 3000) c
       JOIN ctl_tu t ON t.id = c.tu_id
      GROUP BY t.id
      ORDER BY khop, t.uu_tien DESC, char_length(t.chu), t.id
      LIMIT $4`,
    nn, k, `${thoat(k)}%`, lim,
  );
  let ra: MucGon[] = theoKhoa.map(({ khop: _k, ...m }) => m);
  // Tra ngược theo nghĩa Việt (kho soạn tay). Gõ CÓ DẤU tiếng Việt ⇒ nghĩa xếp TRƯỚC khoá (không thì "học" ra "hockey",
  // "trường học" ra tên riêng 张学友 vì khoá Hán Việt "truong hoc huu" khớp tiền tố).
  const goViet = VIET.test(q);
  if (goViet || (ra.length < lim && ((nn !== 'en' && /\s/.test(q)) || nn === 'en'))) {
    const nghia = await prisma.$queryRawUnsafe<MucGon[]>(
      `SELECT ${COT} FROM ctl_tu t
        WHERE t.nn = $1 AND t.nghia_vi ILIKE $2 ESCAPE '\\'
        ORDER BY (t.nghia_vi ILIKE $3 ESCAPE '\\') DESC, t.uu_tien DESC, char_length(t.chu)
        LIMIT $4`,
      nn, `%${thoat(q)}%`, `${thoat(q)}%`, lim,
    );
    // Khớp ĐÚNG khoá (vd gõ "học" ở tab Trung ⇒ chữ 学 âm học) vẫn đứng đầu, rồi tới khớp nghĩa, rồi khớp tiền tố.
    const dung = goViet ? theoKhoa.filter((m) => m.khop === 0).map(({ khop: _k, ...m }) => m) : [];
    const dau = goViet ? [...dung, ...nghia] : [...ra, ...nghia];
    const sau = goViet ? ra : [];
    const daCo = new Set<number>();
    ra = [...dau, ...sau].filter((m) => (daCo.has(m.id) ? false : (daCo.add(m.id), true))).slice(0, lim);
  }
  return ra;
}

export async function chiTiet(id: number) {
  const t = await prisma.ctlTu.findUnique({ where: { id } });
  if (!t) throw new NotFoundError('Không tìm thấy mục từ');
  const chuHan = t.nn === 'en' ? [] : [...new Set([...`${t.chu}${t.chuPhu ?? ''}`].filter(laChuHan))].slice(0, 12);
  const [han, cungChu] = await Promise.all([
    chuHan.length ? prisma.ctlChuHan.findMany({ where: { chu: { in: chuHan } } }) : Promise.resolve([]),
    // Cùng chữ viết (đồng hình khác âm/nghĩa — 日 にち / ひ …).
    prisma.ctlTu.findMany({ where: { nn: t.nn, chu: t.chu, id: { not: t.id } }, take: 6, orderBy: { uuTien: 'desc' },
      select: { id: true, chu: true, doc: true, nghiaVi: true, nghiaEn: true } }),
  ]);
  const theoThuTu = chuHan.map((c) => han.find((h) => h.chu === c)).filter(Boolean);
  return { ...t, chuHan: theoThuTu, cungChu };
}

/** Thẻ một chữ Hán + từ chứa nó (ưu tiên từ thông dụng). */
export async function chuHan(chu: string, nnGoc: string) {
  const nn = kiemNn(nnGoc);
  const c = [...chu][0];
  if (!c || !laChuHan(c)) throw new BadRequestError('Không phải chữ Hán', 'CTL_KHONG_PHAI_CHU_HAN');
  const han = await prisma.ctlChuHan.findUnique({ where: { chu: c } });
  if (!han) throw new NotFoundError('Chưa có dữ liệu chữ này');
  const tu = await prisma.$queryRawUnsafe<MucGon[]>(
    `SELECT ${COT} FROM ctl_tu t WHERE t.nn = $1 AND t.chu LIKE $2 AND t.chu <> $3
      ORDER BY t.uu_tien DESC, char_length(t.chu) LIMIT 24`,
    nn, `%${c}%`, c,
  );
  return { ...han, tu };
}

// ─── Tra theo bộ thủ ─────────────────────────────────────────

export interface ChuTheoBo {
  chu: string;
  soNet: number | null;
  hanViet: string | null;
  pinyin: string | null;
  onYomi: string | null;
  kunYomi: string | null;
  tanSuat: number | null;
}

/** Số bộ Khang Hy hợp lệ (1–214) — tách riêng để test không cần CSDL. */
export function kiemSoBo(so: unknown): number {
  const n = typeof so === 'number' ? so : Number(String(so ?? '').trim() || NaN);
  if (!Number.isInteger(n) || n < 1 || n > 214) throw new BadRequestError('Số bộ thủ phải từ 1 đến 214', 'CTL_BO_THU_SAI');
  return n;
}

/**
 * Các chữ thuộc bộ Khang Hy `so` dùng trong ngôn ngữ `nn`: zh ⇒ chữ có pinyin; ja ⇒ chữ có âm on hoặc kun.
 * Sắp số nét tăng dần, cùng số nét thì chữ hay gặp trước (tanSuat nhỏ = hay gặp; không có thứ hạng xếp cuối). Tối đa 800 (bộ 木 · 水 · 艸 có 630–710 chữ — trần 600 cắt mất chữ hay gặp).
 */
export async function theoBoThu(nnGoc: string, so: number): Promise<ChuTheoBo[]> {
  const nn = kiemNn(nnGoc);
  const bo = kiemSoBo(so);
  if (nn === 'en') throw new BadRequestError('Tra theo bộ thủ chỉ dành cho tiếng Trung và tiếng Nhật', 'CTL_NN_SAI');
  return prisma.ctlChuHan.findMany({
    where: {
      boThu: bo,
      ...(nn === 'zh'
        ? { pinyin: { not: null }, NOT: { pinyin: '' } }
        : { OR: [{ AND: [{ onYomi: { not: null } }, { NOT: { onYomi: '' } }] }, { AND: [{ kunYomi: { not: null } }, { NOT: { kunYomi: '' } }] }] }),
    },
    select: { chu: true, soNet: true, hanViet: true, pinyin: true, onYomi: true, kunYomi: true, tanSuat: true },
    orderBy: [{ soNet: { sort: 'asc', nulls: 'last' } }, { tanSuat: { sort: 'asc', nulls: 'last' } }, { chu: 'asc' }],
    take: 800,
  });
}

// ─── Viết tay ⇒ ứng viên chữ ─────────────────────────────────

let hangTanSuat: Promise<Map<string, number>> | null = null;
/** Thứ hạng tần suất (KANJIDIC2 freq, Unihan kFrequency) — chỉ dùng phá thế hoà giữa các chữ giống nét như nhau. */
function tanSuat() {
  if (!hangTanSuat) {
    hangTanSuat = prisma.ctlChuHan.findMany({ where: { tanSuat: { not: null } }, select: { chu: true, tanSuat: true } })
      .then((ds) => new Map(ds.map((d) => [d.chu, d.tanSuat!])))
      .catch(() => { hangTanSuat = null; return new Map<string, number>(); });
  }
  return hangTanSuat;
}

/** `net` = các nét theo thứ tự viết, mỗi nét là mảng [x, y] (đơn vị tuỳ ý — tự chuẩn hoá theo khung bao). */
export async function vietTay(nnGoc: string, than: unknown): Promise<string[]> {
  const nn = kiemNn(nnGoc);
  if (nn === 'en') throw new BadRequestError('Viết tay tiếng Anh nhận trên máy (Vision), không qua máy chủ', 'CTL_NN_SAI');
  const net = kiemNet((than as { net?: unknown })?.net);
  const ts = await tanSuat();
  return nhanChu(nn, net, 12, (c) => ts.get(c));
}

// ─── Gói từ điển OFFLINE (Pro, bước 5) ───────────────────────
//
// Từ thông dụng của một ngôn ngữ (cờ `thong_dung`: kho soạn tay + JMdict news1/ichi1… + CEDICT chữ hay gặp) ở dạng MẢNG
// gọn để app tra không cần mạng: `[id, chu, chuPhu, doc, hanViet, nghiaVi, nghiaEn, [khoá tra…]]`. Khoá tra lấy THẲNG
// từ `ctl_khoa_tra` ⇒ app không phải chép lại phép chuẩn hoá (`khoaTra`) — chỉ cần chuẩn hoá câu gõ y như máy chủ:
// chữ thường, bỏ dấu, đ→d, katakana→hiragana, ü→v, bỏ khoảng trắng/dấu câu (`KhoaTraCTL.swift` có phép kiểm đối chiếu).
// Đệm trong RAM theo phiên bản (số mục + id lớn nhất) — đổi dữ liệu (nhập lại) là tự dựng lại.

type GoiOffline = { phienBan: string; nn: NnTuDien; soMuc: number; muc: unknown[][] };
const demGoi = new Map<string, Promise<GoiOffline>>();

export async function goiOffline(nnGoc: string): Promise<GoiOffline> {
  const nn = kiemNn(nnGoc);
  const [pb] = await prisma.$queryRawUnsafe<{ n: number; m: number }[]>(
    `SELECT count(*)::int n, coalesce(max(id),0)::int m FROM ctl_tu WHERE nn = $1 AND thong_dung`, nn);
  const phienBan = `${pb.n}-${pb.m}`;
  const khoa = `${nn}:${phienBan}`;
  if (!demGoi.has(khoa)) {
    for (const k of demGoi.keys()) if (k.startsWith(`${nn}:`)) demGoi.delete(k);
    demGoi.set(khoa, (async () => {
      const ds = await prisma.$queryRawUnsafe<{ id: number; chu: string; chu_phu: string | null; doc: string | null; han_viet: string | null; nghia_vi: string | null; nghia_en: string | null; k: string[] }[]>(
        `SELECT t.id, t.chu, t.chu_phu, t.doc, t.han_viet, t.nghia_vi, t.nghia_en,
                array(SELECT DISTINCT c.khoa FROM ctl_khoa_tra c WHERE c.tu_id = t.id) k
           FROM ctl_tu t WHERE t.nn = $1 AND t.thong_dung ORDER BY t.uu_tien DESC, t.id`, nn);
      const gon = (s: string | null, n: number) => (s && s.length > n ? `${s.slice(0, n - 1)}…` : s);
      return {
        phienBan, nn, soMuc: ds.length,
        muc: ds.map((r) => [r.id, r.chu, r.chu_phu, r.doc, r.han_viet, gon(r.nghia_vi, 160), gon(r.nghia_en?.split('; ').slice(0, 3).join('; ') ?? null, 120), r.k]),
      };
    })().catch((e) => { demGoi.delete(khoa); throw e; }));
  }
  return demGoi.get(khoa)!;
}

// ─── Chữ của ngày — "Một chữ · ba ngôn ngữ" (docs mục 3.2) ───

/** Một chữ Hán có ĐỦ ba mặt (Hán Việt · pinyin · on/kun), đổi theo ngày, kèm vài từ thông dụng chứa nó ở Trung và Nhật. */
export async function chuCuaNgay(ngay: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ngay)) throw new BadRequestError('ngay phải dạng YYYY-MM-DD');
  const ds = await prisma.ctlChuHan.findMany({
    where: { hanViet: { not: null }, pinyin: { not: null }, onYomi: { not: null }, jlptCu: { not: null }, tanSuat: { not: null } },
    orderBy: { tanSuat: 'asc' }, select: { chu: true },
  });
  if (!ds.length) throw new NotFoundError('Chưa có dữ liệu chữ Hán');
  // Băm ngày ⇒ vị trí; cùng ngày mọi máy ra cùng một chữ.
  let h = 0;
  for (const c of ngay) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const chu = ds[h % ds.length].chu;
  const han = await prisma.ctlChuHan.findUnique({ where: { chu } });
  // Kanji Nhật (異, 歴) ≠ chữ giản thể của Trung (异, 历) ⇒ tìm từ Trung theo CẢ dạng giản thể lẫn phồn thể.
  const dangTrung = han?.gianThe ?? chu;
  // Từ Nhật thông dụng chứa chữ (đứng đầu từ trước).
  const jaRong = await prisma.$queryRawUnsafe<MucGon[]>(
    `SELECT ${COT} FROM ctl_tu t WHERE t.nn = 'ja' AND t.thong_dung AND t.chu LIKE $1 AND char_length(t.chu) BETWEEN 2 AND 3
      ORDER BY (t.chu LIKE $2) DESC, t.uu_tien DESC LIMIT 12`, `%${chu}%`, `${chu}%`);
  // Từ Trung: ưu tiên từ CÙNG ÂM HÁN VIỆT với một từ Nhật ở trên (历史 ↔ 歴史 "lịch sử", 异常 ↔ 異常 "dị thường") — đó là
  // từ chung của cả ba ngôn ngữ, đúng tinh thần thẻ. Tần suất chữ không phân biệt được 历史 với 历年 (đo 12/11).
  // Không bắt `thong_dung` (chữ tần suất vừa như 异 sẽ trắng); bỏ tên riêng (pinyin viết hoa).
  const hvNhat = [...new Set(jaRong.map((m) => m.hanViet).filter((x): x is string => !!x))];
  const zhRong = await prisma.$queryRawUnsafe<MucGon[]>(
    `SELECT ${COT} FROM ctl_tu t WHERE t.nn = 'zh' AND (t.chu LIKE $1 OR t.chu_phu LIKE $2) AND char_length(t.chu) BETWEEN 2 AND 3
        AND t.doc !~ '^[A-ZĀÁǍÀĒÉĚÈŌÓǑÒ]'
      ORDER BY array_position($4::text[], t.han_viet) NULLS LAST, (t.chu LIKE $3) DESC, t.thong_dung DESC, char_length(t.chu), t.uu_tien DESC
      LIMIT 10`, `%${dangTrung}%`, `%${chu}%`, `${dangTrung}%`, hvNhat);
  // Một chữ giản thể có thể ứng nhiều dạng phồn thể (历年 = 歷年 / 曆年) ⇒ bỏ trùng theo chữ.
  const daCo = new Set<string>();
  const zh = zhRong.filter((m) => (daCo.has(m.chu) ? false : (daCo.add(m.chu), true))).slice(0, 3);
  const hvTrung = new Set(zh.map((m) => m.hanViet));
  const ja = [...jaRong.filter((m) => hvTrung.has(m.hanViet)), ...jaRong.filter((m) => !hvTrung.has(m.hanViet))].slice(0, 3);
  return { ...han, dangTrung, tuTrung: zh, tuNhat: ja };
}

// ─── Trò chơi (bước 6) — đề ngẫu nhiên từ TỪ THÔNG DỤNG có nghĩa ───
//
// App dựng hai trò từ cùng một đề: "60 giây chọn nghĩa" (4 phương án lấy từ chính đề) và "Gõ nhanh" (gõ pinyin/romaji
// không dấu — app so bằng `KhoaTraCTL`, cùng phép chuẩn hoá `khoaTra`; tiếng Anh: nhìn nghĩa Việt gõ từ).
// CHỈ kho từ soạn tay có nghĩa Việt (Anh ~13k · Nhật ~7,7k · Trung ~5,3k từ, đo 13/11) — nghĩa tiếng Anh của CEDICT/JMdict
// ra toàn từ lạ (人心果 "sapodilla"). Bỏ tên riêng (pinyin viết hoa), bỏ mục không có cách đọc.

export interface MucTroChoi { id: number; chu: string; doc: string | null; docLatin: string | null; hanViet: string | null; nghia: string; nghiaViet: boolean }

export async function deTroChoi(nnGoc: string, soCau = 40): Promise<MucTroChoi[]> {
  const nn = kiemNn(nnGoc);
  const n = Math.max(4, Math.min(80, Math.floor(soCau) || 40));
  const dieuKien = nn === 'en'
    ? `t.nghia_vi IS NOT NULL AND t.chu ~ '^[a-z]{3,14}$'`
    : nn === 'zh'
      ? `t.doc IS NOT NULL AND t.doc !~ '^[A-ZĀÁǍÀĒÉĚÈŌÓǑÒ]' AND char_length(t.chu) BETWEEN 1 AND 4`
      : `t.doc IS NOT NULL AND t.doc_latin IS NOT NULL AND char_length(t.chu) BETWEEN 1 AND 5`;
  const ds = await prisma.$queryRawUnsafe<{ id: number; chu: string; doc: string | null; doc_latin: string | null; han_viet: string | null; nghia_vi: string | null; nghia_en: string | null }[]>(
    `SELECT t.id, t.chu, t.doc, t.doc_latin, t.han_viet, t.nghia_vi, t.nghia_en FROM ctl_tu t
      WHERE t.nn = $1 AND t.nguon = 'kho' AND t.nghia_vi IS NOT NULL AND ${dieuKien}
      ORDER BY random() LIMIT $2`, nn, n * 2);
  const daCo = new Set<string>();
  const ra: MucTroChoi[] = [];
  for (const r of ds) {
    // Nghĩa ngắn để vừa nút: đoạn đầu (trước ; / xuống dòng), quá 40 ký tự thì cắt ở dấu phẩy.
    let nghiaVi = r.nghia_vi?.split(/[;；\n/]/)[0]?.trim() ?? '';
    if (nghiaVi.length > 40) nghiaVi = nghiaVi.split(/[,，]/)[0].trim();
    const nghia = (nghiaVi || r.nghia_en?.split('; ')[0]?.trim() || '').slice(0, 60);
    // Hai mục cùng nghĩa trong một đề ⇒ câu chọn nghĩa có hai đáp án đúng.
    const k = nghia.toLowerCase();
    if (!nghia || nghia.length > 48 || daCo.has(k) || daCo.has(r.chu)) continue;
    daCo.add(k); daCo.add(r.chu);
    // Kho soạn tay đôi khi ghi kana vào ô romaji ⇒ đổi sang romaji (trò gõ nhanh so với chữ Latin).
    const docLatin = nn === 'ja' ? (r.doc_latin && !coKana(r.doc_latin) ? r.doc_latin : r.doc ? romaji(r.doc) : null) : r.doc_latin;
    ra.push({ id: r.id, chu: r.chu, doc: r.doc, docLatin, hanViet: r.han_viet, nghia, nghiaViet: !!nghiaVi });
    if (ra.length >= n) break;
  }
  return ra;
}
