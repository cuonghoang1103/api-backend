/**
 * Điểm của một lượt chấm — BẢN SAO của `tinhDiem` trong src/services/codeLab.cham.ts (máy chủ tính
 * lại khi lưu lượt Nộp; bản này để hiện ngay lúc Chạy thử / khi khách Nộp thử). Test
 * src/services/codeLab.cham.test.ts so hai bản trên cùng dữ liệu — sửa thì sửa cả hai.
 */
import type { Diem, DiemNhom } from './kieu';

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => !!v && typeof v === 'object' && !Array.isArray(v);
const lamTron025 = (x: number) => Math.round(x * 4) / 4;

type KqNho = { dat: boolean; nhom?: string | null; boQua?: string };

/**
 * Loại `mutation` (01/11/2026): kiểm nhom 'xanh' = bộ test xanh với code đúng; nhom 'dot-bien' = từng đột biến.
 * Bộ test chưa xanh ⇒ không đột biến nào tính là diệt. `nguong` = số đột biến phải diệt (mặc định: tất cả).
 */
export function demDotBien(testsJson: unknown, ketQua: ReadonlyArray<KqNho>): { xanh: boolean; diet: number; tong: number; nguong: number } {
  const xanh = ketQua.some((r) => r.nhom === 'xanh' && r.dat) && !ketQua.some((r) => r.nhom === 'xanh' && !r.dat);
  const db = ketQua.filter((r) => r.nhom === 'dot-bien');
  const diet = xanh ? db.filter((r) => r.dat).length : 0;
  const n = isObj(testsJson) ? Number(testsJson.nguong) : NaN;
  const nguong = Number.isInteger(n) && n >= 1 ? Math.min(n, db.length) : db.length;
  return { xanh, diet, tong: db.length, nguong };
}

/** Lượt Nộp này có tính là ĐÃ GIẢI không: mọi kiểm đạt; riêng `mutation`: test xanh + diệt ≥ ngưỡng. */
export function chapNhan(testsJson: unknown, ketQua: ReadonlyArray<KqNho>): boolean {
  const tinh = ketQua.filter((r) => !r.boQua);
  if (!tinh.length) return false;
  if (isObj(testsJson) && testsJson.loai === 'mutation') {
    const d = demDotBien(testsJson, tinh);
    return d.xanh && d.diet >= d.nguong;
  }
  return tinh.every((r) => r.dat);
}

export function tinhDiem(testsJson: unknown, ketQua: ReadonlyArray<{ dat: boolean; nhom?: string | null }>): Diem {
  if (isObj(testsJson) && testsJson.loai === 'mutation') {
    // điểm = tỉ lệ đột biến bị diệt (0–100); test chưa xanh với code đúng ⇒ 0
    const d = demDotBien(testsJson, ketQua);
    return { score: d.tong ? Math.round((d.diet * 100) / d.tong) : d.xanh ? 100 : 0, maxScore: 100, nhom: [] };
  }
  const thang = isObj(testsJson) && Array.isArray(testsJson.thangDiem) ? testsJson.thangDiem.filter(isObj) : [];
  if (thang.length) {
    const nhom: DiemNhom[] = thang.map((t) => {
      const ma = String(t.ma ?? '');
      const cua = ketQua.filter((r) => r.nhom === ma);
      const dat = cua.filter((r) => r.dat).length;
      const diem = Number(t.diem) || 0;
      return { ma, ten: String(t.ten ?? ma), diem, dat, tong: cua.length, diemDat: cua.length ? lamTron025((diem * dat) / cua.length) : 0 };
    });
    return {
      score: Math.round(nhom.reduce((s, n) => s + n.diemDat, 0) * 100) / 100,
      maxScore: Math.round(nhom.reduce((s, n) => s + n.diem, 0) * 100) / 100,
      nhom,
    };
  }
  const tong = ketQua.length;
  const dat = ketQua.filter((r) => r.dat).length;
  return { score: tong ? Math.round((dat * 100) / tong) : 0, maxScore: 100, nhom: [] };
}
