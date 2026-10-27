/**
 * Điểm của một lượt chấm — BẢN SAO của `tinhDiem` trong src/services/codeLab.cham.ts (máy chủ tính
 * lại khi lưu lượt Nộp; bản này để hiện ngay lúc Chạy thử / khi khách Nộp thử). Test
 * src/services/codeLab.cham.test.ts so hai bản trên cùng dữ liệu — sửa thì sửa cả hai.
 */
import type { Diem, DiemNhom } from './kieu';

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => !!v && typeof v === 'object' && !Array.isArray(v);
const lamTron025 = (x: number) => Math.round(x * 4) / 4;

export function tinhDiem(testsJson: unknown, ketQua: ReadonlyArray<{ dat: boolean; nhom?: string | null }>): Diem {
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
