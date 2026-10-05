// ⛔ BẢN CHÉP — sửa ở src/services/doiKhang/luat/ rồi chạy scripts/dong-bo-luat-doi-khang.mjs
/**
 * Bảng luật đối kháng — máy chủ và giao diện tra theo mã trò.
 */
import type { LuatTro, MaTro } from './kieu';
import { coVua } from './coVua';
import { coTuong } from './coTuong';
import { tienLen } from './tienLen';
import { caro } from './caro';

export * from './kieu';
export { coVua, tuFen, perftCoVua } from './coVua';
export type { TrangThaiCoVua, NuocCoVua, QuanCoVua, PhongCap } from './coVua';
export { coTuong } from './coTuong';
export type { TrangThaiCoTuong, NuocCoTuong, QuanCoTuong, OCoTuong } from './coTuong';
export { tienLen, nhanBo, chanDuoc, giaTriLa, tenLa } from './tienLen';
export type { TrangThaiTienLen, NuocTienLen, NhinTienLen, BoTrenBan, LoaiBo } from './tienLen';
export { caro, CO_CARO } from './caro';
export type { TrangThaiCaro, NuocCaro } from './caro';
export { taoNgauNhien } from './chung';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const LUAT: Record<MaTro, LuatTro<any, any>> = {
  'co-vua': coVua,
  'co-tuong': coTuong,
  'tien-len': tienLen,
  caro,
};
