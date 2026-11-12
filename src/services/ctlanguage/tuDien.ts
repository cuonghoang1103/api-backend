/**
 * CT Language — TRA TỪ ĐIỂN (bảng ctl_tu · ctl_khoa_tra · ctl_chu_han, nạp bằng scripts/ctlanguage/nhap-tu-dien.mts).
 *
 * Tra = khoá chuẩn hoá (`khoaTra`) khớp ĐÚNG trước, rồi khớp TIỀN TỐ (chỉ mục `text_pattern_ops`), sắp theo `uu_tien`
 * (kho soạn tay có nghĩa Việt > từ thông dụng > còn lại) rồi độ dài. Gõ tiếng Việt (có dấu / có khoảng trắng) ⇒ tra
 * thêm theo NGHĨA Việt của kho soạn tay (tra ngược Việt → ngoại ngữ).
 */
import { prisma } from '../../config/database.js';
import { BadRequestError, NotFoundError } from '../../middleware/errorHandler.js';
import { khoaTra, laChuHan } from './tuDienChuan.js';
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
  const [zh, ja] = await Promise.all([
    // Không bắt `thong_dung` (chữ tần suất vừa như 异 sẽ trắng) — bỏ tên riêng (pinyin viết hoa), xếp theo ưu tiên.
    prisma.$queryRawUnsafe<MucGon[]>(`SELECT ${COT} FROM ctl_tu t WHERE t.nn = 'zh' AND (t.chu LIKE $1 OR t.chu_phu LIKE $2) AND char_length(t.chu) BETWEEN 2 AND 3 AND t.doc !~ '^[A-ZĀÁǍÀĒÉĚÈŌÓǑÒ]' ORDER BY (t.chu LIKE $3) DESC, t.thong_dung DESC, t.uu_tien DESC, char_length(t.chu) LIMIT 3`, `%${dangTrung}%`, `%${chu}%`, `${dangTrung}%`),
    prisma.$queryRawUnsafe<MucGon[]>(`SELECT ${COT} FROM ctl_tu t WHERE t.nn = 'ja' AND t.thong_dung AND t.chu LIKE $1 AND char_length(t.chu) BETWEEN 2 AND 3 ORDER BY (t.chu LIKE $2) DESC, t.uu_tien DESC LIMIT 3`, `%${chu}%`, `${chu}%`),
  ]);
  return { ...han, dangTrung, tuTrung: zh, tuNhat: ja };
}
