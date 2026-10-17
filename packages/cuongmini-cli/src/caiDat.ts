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
export type ChonTrinhDuyet = 'tuDong' | 'bat' | 'tat';

export interface CaiDat {
  theme: ChonTheme;
  /** heThong = chuông + thông báo của hệ điều hành khi terminal không được chú ý; chuong = chỉ chuông. */
  thongBao: ChonThongBao;
  /**
   * Chế độ quyền lúc mở (cờ `--che-do` thắng). `null` = CHƯA TỰ CHỌN ⇒ CLI không gọi
   * `datCheDoQuyen`, để lõi dùng mặc định của nó: "Hỏi trước" (đủ công cụ, mỗi lần vẫn duyệt).
   */
  cheDoMacDinh: CheDoQuyen | null;
  /** Mã model lúc mở (cờ `--model` thắng). `null` = giữ model đang chọn của tài khoản. */
  modelMacDinh: string | null;
  /** Ký tự ASCII thay khung/ký hiệu Unicode (console Windows đời cũ). */
  ascii: ChonAscii;
  /**
   * Cho AI lái trình duyệt (tool web_mo/web_doc/web_bam…). `tuDong` = bật khi máy có
   * Chrome/Edge/Brave/Chromium. Không bật thì lõi KHÔNG khai capability `browser`,
   * máy chủ không gửi tool web — AI chỉ còn nói "chưa có công cụ" (lỗi thật 0.2.0).
   */
  trinhDuyet: ChonTrinhDuyet;
}

export const MAC_DINH: CaiDat = { theme: 'tuDong', thongBao: 'heThong', cheDoMacDinh: null, modelMacDinh: null, ascii: 'tuDong', trinhDuyet: 'tuDong' };

export const LUA_CHON = {
  theme: [['tuDong', 'Tự động (dò COLORFGBG, mặc định tối)'], ['toi', 'Tối'], ['sang', 'Sáng — terminal nền trắng']],
  thongBao: [['heThong', 'Chuông + thông báo hệ điều hành khi bạn không nhìn terminal'], ['chuong', 'Chỉ chuông'], ['tat', 'Tắt']],
  cheDoMacDinh: [['hoi', 'Hỏi trước — đủ công cụ, mỗi lần sửa/chạy lệnh vẫn hỏi (mặc định)'], ['keHoach', 'Lập kế hoạch (chỉ đọc)'], ['tuSua', 'Tự sửa file'], ['tuSuaVaLenh', 'Tự động']],
  ascii: [['tuDong', 'Tự động (console cũ ⇒ ASCII)'], ['bat', 'Luôn dùng ASCII'], ['tat', 'Luôn dùng Unicode']],
  trinhDuyet: [['tuDong', 'Bật khi máy có Chrome/Edge/Brave/Chromium'], ['bat', 'Luôn bật'], ['tat', 'Tắt — AI không mở trình duyệt']],
} as const;

export const TEN_MUC: Record<keyof CaiDat, string> = {
  theme: 'Giao diện', thongBao: 'Thông báo', cheDoMacDinh: 'Chế độ quyền mặc định', modelMacDinh: 'Model mặc định', ascii: 'Ký tự khung', trinhDuyet: 'Trình duyệt cho AI',
};

export const duongCaiDat = (): string => path.join(thuMucGoc(), 'cai-dat.json');

/** Lọc một object bất kỳ thành cài đặt hợp lệ (trường sai ⇒ mặc định). */
export function chuanHoaCaiDat(tho: unknown): CaiDat {
  const j = (tho && typeof tho === 'object' ? tho : {}) as Record<string, unknown>;
  const trong = <K extends keyof typeof LUA_CHON>(k: K): string | null => {
    const v = j[k];
    return typeof v === 'string' && LUA_CHON[k].some(([id]) => id === v) ? v : MAC_DINH[k] as string | null;
  };
  // Không cho "Bỏ qua hết" làm mặc định từ file — chỉ bật được bằng cờ hoặc cửa xác nhận trong phiên.
  return {
    theme: trong('theme') as ChonTheme,
    thongBao: trong('thongBao') as ChonThongBao,
    cheDoMacDinh: trong('cheDoMacDinh') as CheDoQuyen,
    modelMacDinh: typeof j.modelMacDinh === 'string' && /^[\w.-]{1,40}$/.test(j.modelMacDinh) ? j.modelMacDinh : null,
    ascii: trong('ascii') as ChonAscii,
    trinhDuyet: trong('trinhDuyet') as ChonTrinhDuyet,
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
  if (k === 'cheDoMacDinh' && !c.cheDoMacDinh) return 'Hỏi trước (mặc định — đủ công cụ, mỗi lần vẫn hỏi)';
  const ds = LUA_CHON[k as keyof typeof LUA_CHON] as ReadonlyArray<readonly [string, string]>;
  return ds.find(([id]) => id === c[k])?.[1] ?? String(c[k]);
}

/** Có cho AI lái trình duyệt lúc mở không. `coTrinhDuyet` = máy có Chrome/Edge… (tiêm vào để test). */
export function nenBatTrinhDuyet(c: Pick<CaiDat, 'trinhDuyet'>, coTrinhDuyet: boolean): boolean {
  if (c.trinhDuyet === 'tat') return false;
  if (c.trinhDuyet === 'bat') return true;
  return coTrinhDuyet;
}
