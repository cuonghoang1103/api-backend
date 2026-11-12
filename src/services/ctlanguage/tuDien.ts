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
