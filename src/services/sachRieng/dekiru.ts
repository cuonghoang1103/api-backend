/**
 * Sách できる日本語 初級 本冊 — BẢN ĐỒ TRANG (chỉ số trang, không có chữ của sách).
 * ─────────────────────────────────────────────────────────────────────────
 * Dùng chung cho route `/api/v1/sach-rieng` và các script dựng dữ liệu
 * (`scripts/sach-rieng/`). Số trang là số in trên sách = số trang của bản PDF
 * đầy đủ 304 trang. Nguồn: SOAN-BAI.md của khoá + đối chiếu ảnh 29/09/2026.
 */

/** Trang đầu của từng bài; bài n kéo tới (trang đầu bài n+1) − 1. Bài 15 hết p.269. */
export const TRANG_DAU_BAI: Record<number, number> = {
  1: 15, 2: 31, 3: 47, 4: 67, 5: 83, 6: 101, 7: 117, 8: 137,
  9: 153, 10: 169, 11: 185, 12: 205, 13: 221, 14: 237, 15: 253,
};
export const TRANG_CUOI_BAI_15 = 269;
export const SO_TRANG = 304;

/** ポイント (số điểm ngữ pháp) của từng bài: [đầu, cuối]. */
export const POINT_CUA_BAI: Record<number, [number, number]> = {
  1: [1, 6], 2: [7, 15], 3: [16, 23], 4: [24, 36], 5: [37, 47], 6: [48, 60], 7: [61, 71],
  8: [72, 80], 9: [81, 87], 10: [88, 97], 11: [98, 103], 12: [104, 107], 13: [108, 112],
  14: [113, 118], 15: [119, 124],
};

export function trangCuaBai(n: number): [number, number] {
  const dau = TRANG_DAU_BAI[n];
  const cuoi = n === 15 ? TRANG_CUOI_BAI_15 : TRANG_DAU_BAI[n + 1] - 1;
  return [dau, cuoi];
}

/** Trang p thuộc phần nào của sách. `bai` = 1–15 nếu là trang của một bài. */
export function BAI_CUA_TRANG(p: number): { bai: number | null; nhan: string } {
  if (p < 15) return { bai: null, nhan: 'Phần đầu sách (lời nói đầu, mục lục, nhân vật)' };
  for (let n = 1; n <= 15; n++) {
    const [a, b] = trangCuaBai(n);
    if (p >= a && p <= b) return { bai: n, nhan: `Bài ${n}` };
  }
  if (p <= 281) return { bai: null, nhan: 'ポイント一覧 (tổng hợp ngữ pháp cuối sách)' };
  if (p <= 289) return { bai: null, nhan: '表 (bảng: chia động từ, số đếm, lịch, gia đình…)' };
  return { bai: null, nhan: '索引 (tra từ cuối sách)' };
}

/** Bài chứa ポイント số n. */
export function baiCuaPoint(n: number): number | null {
  for (const [b, [a, z]] of Object.entries(POINT_CUA_BAI)) if (n >= a && n <= z) return Number(b);
  return null;
}

export type LoaiMuc =
  | 'mo-bai' | 'hanashite' | 'hoi-thoai' | 'yattemiyou' | 'ittemiyou' | 'kiitemiyou' | 'yondemiyou'
  | 'kaitemiyou' | 'dekiru' | 'kotoba' | 'point' | 'hyo' | 'khac';

/** Hướng dẫn học một trang (AI soạn một lần, người soát lại). Chứa chữ chép từ sách → CHỈ ở R2 mã hoá. */
export type HuongDanTrang = {
  trang: number;
  bai: number | null;
  muc: { loai: LoaiMuc; ten?: string; topic?: number }[];
  tinCay?: number;
  tomTat?: string;
  mucTieu?: string;
  tuMoi?: { w: string; ro?: string; vi: string }[];
  nguPhap?: { point?: number; mau: string; y?: string }[];
  cau?: { ja: string; ro?: string; vi: string }[];
  tranh?: { so?: string; moTa: string }[];
  cachLam?: string[];
  cauHoiCo?: { ja: string; ro?: string; vi?: string; traLoi?: string; traLoiRo?: string; traLoiVi?: string }[];
  luuY?: string[];
  nguon?: { model: string; luc: string };
};

/** Tên mục in trên sách → loại (AI hay xếp các mục này vào `khac`, hoặc nhầm dòng "☞ポイント N" cuối trang thành `point`). */
const THEO_TEN: [RegExp, LoaiMuc][] = [
  [/チャレンジ/, 'hoi-thoai'],
  [/話してみよう/, 'hanashite'],
  [/聞いてみよう|もう一度聞こう|聞こう/, 'kiitemiyou'],
  [/言ってみよう/, 'ittemiyou'],
  [/やってみよう/, 'yattemiyou'],
  [/読んでみよう/, 'yondemiyou'],
  [/書いてみよう/, 'kaitemiyou'],
  [/できる[！!]/, 'dekiru'],
  [/ことば/, 'kotoba'],
];

/**
 * Chuẩn hoá mục của từng trang sau khi AI đọc (chạy lúc tải lên):
 *  - khớp theo TÊN in trên trang trước (tên đáng tin hơn loại AI tự chọn);
 *  - trang của bài không có `point`/`hyo` (đó là dòng "☞ポイント" hoặc bảng nhỏ trong bài tập);
 *  - p.270–281 = ポイント一覧, p.282–289 = 表;
 *  - trang không còn mục nào (nối tiếp) thì kế thừa mục cuối của trang trước.
 */
export function chuanHoaMuc(ds: HuongDanTrang[]): HuongDanTrang[] {
  const sx = [...ds].sort((a, b) => a.trang - b.trang);
  let truoc: HuongDanTrang['muc'][number] | null = null;
  for (const h of sx) {
    const p = h.trang;
    if (p >= 270 && p <= 281) { h.muc = [{ loai: 'point', ten: 'ポイント一覧' }]; truoc = null; continue; }
    if (p >= 282 && p <= 289) { h.muc = [{ loai: 'hyo', ten: h.muc?.find((m) => m.loai === 'hyo')?.ten || '表' }]; truoc = null; continue; }
    let muc = (h.muc ?? []).map((m) => {
      const theoTen = THEO_TEN.find(([re]) => re.test(m.ten ?? ''))?.[1];
      return theoTen && m.loai !== 'mo-bai' ? { ...m, loai: theoTen } : m;
    });
    if (h.bai) muc = muc.filter((m) => m.loai !== 'point' && m.loai !== 'hyo');
    muc = muc.filter((m, i) => i === 0 || m.loai !== muc[i - 1].loai || m.topic !== muc[i - 1].topic);
    if (!muc.length && truoc && h.bai) muc = [{ ...truoc }];
    h.muc = muc;
    if (muc.length) truoc = muc[muc.length - 1];
    if (h.bai && p === TRANG_DAU_BAI[h.bai]) truoc = null;
  }
  return sx;
}
