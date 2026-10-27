/**
 * Máy chấm Code Lab trong TRÌNH DUYỆT — cửa vào duy nhất (đợt Academy 28/10/2026).
 *
 *   Chạy thử (`cheDo: 'chay'`) = các kiểm MẪU có trong payload trang bài (không `an`).
 *   Nộp     (`cheDo: 'nop'`)  = bộ kiểm ĐỦ lấy từ `GET /code-lab/exercises/:id/tests` (cả kiểm ẩn).
 *
 * Không có code người học nào chạy trên máy chủ. Lý do + giới hạn toàn vẹn: src/services/codeLab.cham.ts.
 * Kiểm toàn bộ đề bằng trình duyệt thật: `node scripts/codelab-kiem-cham-trinh-duyet.mjs`.
 */
import { chamJs } from './chamJs';
import { chamKhung } from './chamKhung';
import { chamTinh, type TraLoiTinh } from './chamTinh';
import { tinhDiem } from './diem';
import { LOAI_TRINH_DUYET, type Diem, type KetQuaKiem, type TepMap, type TestsJson } from './kieu';

export * from './kieu';
export { tinhDiem } from './diem';
export type { TraLoiTinh } from './chamTinh';

export interface ChamVao {
  exerciseId: number;
  tj: TestsJson;
  files: TepMap;
  traLoi?: TraLoiTinh;
  onTung?: (r: KetQuaKiem) => void;
}

export interface ChamRa {
  ketQua: KetQuaKiem[];
  dat: number;
  tong: number;
  diem: Diem;
  ms: number;
}

export function chamDuoc(loai: string | null | undefined): boolean {
  return !!loai && LOAI_TRINH_DUYET.has(loai);
}

export async function chamBai({ exerciseId, tj, files, traLoi, onTung }: ChamVao): Promise<ChamRa> {
  const t0 = performance.now();
  const kiem = Array.isArray(tj.kiem) ? tj.kiem : [];
  let ketQua: KetQuaKiem[];
  switch (tj.loai) {
    case 'js':
    case 'console':
    case 'module':
      ketQua = await chamJs(tj, kiem, files, onTung);
      break;
    case 'dom':
    case 'react':
      ketQua = await chamKhung(tj, kiem, files, onTung);
      break;
    case 'choice':
    case 'order':
    case 'table':
      ketQua = await chamTinh(exerciseId, tj, traLoi ?? {});
      ketQua.forEach((r) => onTung?.(r));
      break;
    default:
      throw new Error(`Loại chấm "${tj.loai}" chưa chạy được trong trình duyệt.`);
  }
  // kiểm "bỏ qua" (máy chấm không làm được ở đây) không tính vào tổng
  const tinh = ketQua.filter((r) => !r.boQua);
  return {
    ketQua,
    dat: tinh.filter((r) => r.dat).length,
    tong: tinh.length,
    diem: tinhDiem(tj, tinh),
    ms: Math.round(performance.now() - t0),
  };
}
