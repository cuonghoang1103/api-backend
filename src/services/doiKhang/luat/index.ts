/**
 * Bảng luật đối kháng — máy chủ và giao diện tra theo mã trò.
 */
import type { LuatTro, MaTro } from './kieu.js';
import { coVua } from './coVua.js';
import { coTuong } from './coTuong.js';
import { tienLen } from './tienLen.js';
import { caro } from './caro.js';

export * from './kieu.js';
export { coVua, tuFen, perftCoVua } from './coVua.js';
export type { TrangThaiCoVua, NuocCoVua, QuanCoVua, PhongCap } from './coVua.js';
export { coTuong } from './coTuong.js';
export type { TrangThaiCoTuong, NuocCoTuong, QuanCoTuong, OCoTuong } from './coTuong.js';
export { tienLen, nhanBo, chanDuoc, giaTriLa, tenLa } from './tienLen.js';
export type { TrangThaiTienLen, NuocTienLen, NhinTienLen, BoTrenBan, LoaiBo } from './tienLen.js';
export { caro, CO_CARO } from './caro.js';
export type { TrangThaiCaro, NuocCaro } from './caro.js';
export { taoNgauNhien } from './chung.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const LUAT: Record<MaTro, LuatTro<any, any>> = {
  'co-vua': coVua,
  'co-tuong': coTuong,
  'tien-len': tienLen,
  caro,
};
