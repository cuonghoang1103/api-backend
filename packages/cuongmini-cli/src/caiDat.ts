/**
 * CÀI ĐẶT người dùng — `~/.cuongmini/cai-dat.json`, sửa bằng `/config`.
 * File hỏng/thiếu trường ⇒ dùng mặc định cho trường đó (không bao giờ ném
 * lúc mở CLI chỉ vì một dòng JSON gõ tay sai).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import type { CheDoQuyen } from './cheDo';
import { damBaoThuMuc, thuMucGoc } from './phien';

export type ChonTheme = 'tuDong' | 'toi' | 'sang';
export type ChonThongBao = 'heThong' | 'chuong' | 'tat';
export type ChonAscii = 'tuDong' | 'bat' | 'tat';

export interface CaiDat {
  theme: ChonTheme;
  /** heThong = chuông + thông báo của hệ điều hành khi terminal không được chú ý; chuong = chỉ chuông. */
  thongBao: ChonThongBao;
  /** Chế độ quyền lúc mở (cờ `--che-do` thắng). `keHoach` = an toàn nhất. */
  cheDoMacDinh: CheDoQuyen;
  /** Mã model lúc mở (cờ `--model` thắng). `null` = giữ model đang chọn của tài khoản. */
  modelMacDinh: string | null;
  /** Ký tự ASCII thay khung/ký hiệu Unicode (console Windows đời cũ). */
  ascii: ChonAscii;
}

export const MAC_DINH: CaiDat = { theme: 'tuDong', thongBao: 'heThong', cheDoMacDinh: 'keHoach', modelMacDinh: null, ascii: 'tuDong' };

export const LUA_CHON = {
  theme: [['tuDong', 'Tự động (dò COLORFGBG, mặc định tối)'], ['toi', 'Tối'], ['sang', 'Sáng — terminal nền trắng']],
  thongBao: [['heThong', 'Chuông + thông báo hệ điều hành khi bạn không nhìn terminal'], ['chuong', 'Chỉ chuông'], ['tat', 'Tắt']],
  cheDoMacDinh: [['keHoach', 'Lập kế hoạch (chỉ đọc)'], ['hoi', 'Hỏi trước mọi việc'], ['tuSua', 'Tự sửa file'], ['tuSuaVaLenh', 'Tự động']],
  ascii: [['tuDong', 'Tự động (console cũ ⇒ ASCII)'], ['bat', 'Luôn dùng ASCII'], ['tat', 'Luôn dùng Unicode']],
} as const;

export const TEN_MUC: Record<keyof CaiDat, string> = {
  theme: 'Giao diện', thongBao: 'Thông báo', cheDoMacDinh: 'Chế độ quyền mặc định', modelMacDinh: 'Model mặc định', ascii: 'Ký tự khung',
};

export const duongCaiDat = (): string => path.join(thuMucGoc(), 'cai-dat.json');

/** Lọc một object bất kỳ thành cài đặt hợp lệ (trường sai ⇒ mặc định). */
export function chuanHoaCaiDat(tho: unknown): CaiDat {
  const j = (tho && typeof tho === 'object' ? tho : {}) as Record<string, unknown>;
  const trong = <K extends keyof typeof LUA_CHON>(k: K): string => {
    const v = j[k];
    return typeof v === 'string' && LUA_CHON[k].some(([id]) => id === v) ? v : MAC_DINH[k] as string;
  };
  // Không cho "Bỏ qua hết" làm mặc định từ file — chỉ bật được bằng cờ hoặc cửa xác nhận trong phiên.
  return {
    theme: trong('theme') as ChonTheme,
    thongBao: trong('thongBao') as ChonThongBao,
    cheDoMacDinh: trong('cheDoMacDinh') as CheDoQuyen,
    modelMacDinh: typeof j.modelMacDinh === 'string' && /^[\w.-]{1,40}$/.test(j.modelMacDinh) ? j.modelMacDinh : null,
    ascii: trong('ascii') as ChonAscii,
  };
}

export function docCaiDat(): CaiDat {
  try {
    return chuanHoaCaiDat(JSON.parse(readFileSync(duongCaiDat(), 'utf8')));
  } catch {
    return { ...MAC_DINH };
  }
}

export function ghiCaiDat(c: CaiDat): void {
  damBaoThuMuc(thuMucGoc());
  writeFileSync(duongCaiDat(), `${JSON.stringify(chuanHoaCaiDat(c), null, 2)}\n`, { mode: 0o600 });
}

/** Mô tả giá trị cho menu `/config`. */
export function moTaGiaTri(k: keyof CaiDat, c: CaiDat): string {
  if (k === 'modelMacDinh') return c.modelMacDinh ?? 'giữ model đang chọn';
  const ds = LUA_CHON[k as keyof typeof LUA_CHON] as ReadonlyArray<readonly [string, string]>;
  return ds.find(([id]) => id === c[k])?.[1] ?? String(c[k]);
}
