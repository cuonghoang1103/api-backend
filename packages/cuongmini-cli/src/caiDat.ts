/**
 * CÀI ĐẶT người dùng — `~/.cuongmini/cai-dat.json`, sửa bằng `/config`.
 * File hỏng/thiếu trường ⇒ dùng mặc định cho trường đó (không bao giờ ném
 * lúc mở CLI chỉ vì một dòng JSON gõ tay sai).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import type { CheDoQuyen } from './cheDo';
import { L } from './i18n';
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
  /** Ngôn ngữ giao diện. `tuDong` = theo `LANG`/`LC_ALL`. */
  ngonNgu: 'tuDong' | 'vi' | 'en';
  /** Kèm dòng nhắc model trả lời bằng ngôn ngữ giao diện. */
  traLoiTheoNgonNgu: 'tat' | 'bat';
  /**
   * Toàn màn hình (alternate screen, 0.3.1): ô nhập + chân trang ghim đáy, hội thoại tự cuộn
   * phía trên. `tat` = in nối tiếp vào scrollback như 0.3.0 (bôi đen chép chữ tự nhiên nhất).
   */
  toanManHinh: 'bat' | 'tat';
  /**
   * Toàn màn hình có BẮT chuột không (18/10/2026). Mặc định `tat`: bôi đen chép chữ tự nhiên như
   * terminal thường; con lăn vẫn cuộn bảng ghi nhờ "alternate scroll" (con lăn ⇒ phím mũi tên).
   */
  chuot: 'bat' | 'tat';
  /**
   * Đợt 8C: tiêu đề tab xoay + trạng thái, tiến độ OSC 9;4 (tab phát sáng / taskbar), user var iTerm2 — chỉ ở terminal
   * hỗ trợ (`hieuUngTerminal.ts`). `tat` = không đổi tiêu đề/tab gì cả.
   */
  hieuUngTerminal: 'bat' | 'tat';
}

export const MAC_DINH: CaiDat = { theme: 'tuDong', thongBao: 'heThong', cheDoMacDinh: null, modelMacDinh: null, ascii: 'tuDong', trinhDuyet: 'tuDong', ngonNgu: 'tuDong', traLoiTheoNgonNgu: 'tat', toanManHinh: 'bat', chuot: 'tat', hieuUngTerminal: 'bat' };

/** Lựa chọn từng mục: [mã, tiếng Việt, English]. */
const LUA_CHON_GOC = {
  theme: [['tuDong', 'Tự động (dò COLORFGBG, mặc định tối)', 'Auto (detect COLORFGBG, default dark)'], ['toi', 'Tối', 'Dark'], ['sang', 'Sáng — terminal nền trắng', 'Light — white terminal background']],
  thongBao: [['heThong', 'Chuông + thông báo hệ điều hành khi bạn không nhìn terminal', 'Bell + OS notification when the terminal is not focused'], ['chuong', 'Chỉ chuông', 'Bell only'], ['tat', 'Tắt', 'Off']],
  cheDoMacDinh: [['hoi', 'Hỏi trước — đủ công cụ, mỗi lần sửa/chạy lệnh vẫn hỏi (mặc định)', 'Ask before edits — all tools, asks every time (default)'], ['keHoach', 'Lập kế hoạch (chỉ đọc)', 'Plan mode (read-only)'], ['tuSua', 'Tự sửa file', 'Accept edits'], ['tuSuaVaLenh', 'Tự động', 'Auto mode']],
  ascii: [['tuDong', 'Tự động (console cũ ⇒ ASCII)', 'Auto (legacy console ⇒ ASCII)'], ['bat', 'Luôn dùng ASCII', 'Always ASCII'], ['tat', 'Luôn dùng Unicode', 'Always Unicode']],
  trinhDuyet: [['tuDong', 'Bật khi máy có Chrome/Edge/Brave/Chromium', 'On when Chrome/Edge/Brave/Chromium is installed'], ['bat', 'Luôn bật', 'Always on'], ['tat', 'Tắt — AI không mở trình duyệt', 'Off — the AI never opens a browser']],
  ngonNgu: [['tuDong', 'Tự động (theo LANG của máy)', 'Auto (from system LANG)'], ['vi', 'Tiếng Việt', 'Vietnamese (Tiếng Việt)'], ['en', 'English', 'English']],
  traLoiTheoNgonNgu: [['tat', 'Tắt — AI tự chọn ngôn ngữ trả lời', 'Off — the AI picks its reply language'], ['bat', 'Bật — luôn trả lời bằng ngôn ngữ giao diện', 'On — always reply in the interface language']],
  toanManHinh: [['bat', 'Bật — ô nhập ghim đáy, cuộn bằng chuột/PgUp/PgDn (mặc định)', 'On — input pinned to the bottom, scroll with mouse/PgUp/PgDn (default)'], ['tat', 'Tắt — in nối tiếp vào lịch sử terminal', 'Off — print inline into the terminal scrollback']],
  hieuUngTerminal: [['bat', 'Bật — tiêu đề tab xoay + trạng thái, tab phát sáng/thanh tiến độ ở terminal hỗ trợ (mặc định)', 'On — spinning tab title + status, tab glow/progress bar where supported (default)'], ['tat', 'Tắt — không đổi tiêu đề hay tab', 'Off — leave the title and tab alone']],
  chuot: [['tat', 'Không bắt chuột — bôi đen chép chữ tự nhiên, con lăn vẫn cuộn (mặc định)', 'Don\'t capture the mouse — select & copy naturally, the wheel still scrolls (default)'], ['bat', 'Bắt chuột — cuộn chính xác; bôi đen phải giữ Option/Fn/Shift', 'Capture the mouse — precise scrolling; hold Option/Fn/Shift to select']],
} as const;

export type MucLuaChon = keyof typeof LUA_CHON_GOC;

/** Lựa chọn của một mục, nhãn theo ngôn ngữ hiện tại. */
export function luaChon(k: MucLuaChon): Array<[string, string]> {
  return (LUA_CHON_GOC[k] as ReadonlyArray<readonly [string, string, string]>).map(([id, vi, en]) => [id, L(vi, en)]);
}

const TEN_MUC_GOC: Record<keyof CaiDat, [string, string]> = {
  theme: ['Giao diện', 'Theme'], thongBao: ['Thông báo', 'Notifications'], cheDoMacDinh: ['Chế độ quyền mặc định', 'Default permission mode'],
  modelMacDinh: ['Model mặc định', 'Default model'], ascii: ['Ký tự khung', 'Box characters'], trinhDuyet: ['Trình duyệt cho AI', 'AI browser'],
  ngonNgu: ['Ngôn ngữ giao diện', 'Interface language'], traLoiTheoNgonNgu: ['AI trả lời bằng ngôn ngữ này', 'AI replies in this language'],
  toanManHinh: ['Toàn màn hình', 'Fullscreen'], chuot: ['Chuột (toàn màn hình)', 'Mouse (fullscreen)'], hieuUngTerminal: ['Hiệu ứng terminal', 'Terminal effects'],
};
export const tenMuc = (k: keyof CaiDat): string => L(TEN_MUC_GOC[k][0], TEN_MUC_GOC[k][1]);
export const CAC_MUC = Object.keys(TEN_MUC_GOC) as Array<keyof CaiDat>;

export const duongCaiDat = (): string => path.join(thuMucGoc(), 'cai-dat.json');

/** Lọc một object bất kỳ thành cài đặt hợp lệ (trường sai ⇒ mặc định). */
export function chuanHoaCaiDat(tho: unknown): CaiDat {
  const j = (tho && typeof tho === 'object' ? tho : {}) as Record<string, unknown>;
  const trong = <K extends MucLuaChon>(k: K): string | null => {
    const v = j[k];
    return typeof v === 'string' && LUA_CHON_GOC[k].some(([id]) => id === v) ? v : MAC_DINH[k] as string | null;
  };
  // Không cho "Bỏ qua hết" làm mặc định từ file — chỉ bật được bằng cờ hoặc cửa xác nhận trong phiên.
  return {
    theme: trong('theme') as ChonTheme,
    thongBao: trong('thongBao') as ChonThongBao,
    cheDoMacDinh: trong('cheDoMacDinh') as CheDoQuyen,
    modelMacDinh: typeof j.modelMacDinh === 'string' && /^[\w.-]{1,40}$/.test(j.modelMacDinh) ? j.modelMacDinh : null,
    ascii: trong('ascii') as ChonAscii,
    trinhDuyet: trong('trinhDuyet') as ChonTrinhDuyet,
    ngonNgu: trong('ngonNgu') as CaiDat['ngonNgu'],
    traLoiTheoNgonNgu: trong('traLoiTheoNgonNgu') as CaiDat['traLoiTheoNgonNgu'],
    toanManHinh: trong('toanManHinh') as CaiDat['toanManHinh'],
    chuot: trong('chuot') as CaiDat['chuot'],
    hieuUngTerminal: trong('hieuUngTerminal') as CaiDat['hieuUngTerminal'],
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
  if (k === 'modelMacDinh') return c.modelMacDinh ?? L('giữ model đang chọn', 'keep current model');
  if (k === 'cheDoMacDinh' && !c.cheDoMacDinh) return L('Hỏi trước (mặc định — đủ công cụ, mỗi lần vẫn hỏi)', 'Ask before edits (default — all tools, asks every time)');
  return luaChon(k as MucLuaChon).find(([id]) => id === c[k])?.[1] ?? String(c[k]);
}

/** Có cho AI lái trình duyệt lúc mở không. `coTrinhDuyet` = máy có Chrome/Edge… (tiêm vào để test). */
export function nenBatTrinhDuyet(c: Pick<CaiDat, 'trinhDuyet'>, coTrinhDuyet: boolean): boolean {
  if (c.trinhDuyet === 'tat') return false;
  if (c.trinhDuyet === 'bat') return true;
  return coTrinhDuyet;
}
