/**
 * `electron` GIẢ cho chế độ độc lập (không cần app desktop).
 *
 * Lúc dựng, esbuild đổi mọi `import … from 'electron'` trong mã AI Code của
 * app (`desktop/src/main/agent/**`, `ipc/agent.ts`…) sang file này. Nhờ vậy
 * extension chạy ĐÚNG mã vòng lặp, tool, skill, MCP, quyền… của app — không
 * phải bản chép lại sẽ lệch dần — chỉ thay phần "vỏ" Electron:
 *
 *   app.getPath('userData')  → thư mục lưu trữ riêng của extension
 *   BrowserWindow…send       → sự kiện đẩy thẳng ra khung chat VS Code
 *   dialog / shell / clipboard → API tương ứng của VS Code (do extension cắm vào)
 *   nativeImage              → bộ xử lý ảnh JS thuần (`anhThuan.ts`)
 *
 * File này KHÔNG import `vscode`: extension cắm hàm vào bằng `caiDatVo()`, để
 * lõi chạy được cả trong phép thử Node thuần.
 *
 * Thứ gì không có trong VS Code (cửa sổ trình duyệt nhúng, menu, màn hình…) thì
 * là vỏ rỗng: gọi tới không ném lúc NẠP module, chỉ không làm gì.
 */
import { EventEmitter } from 'node:events';
import os from 'node:os';
import path from 'node:path';

export { nativeImage } from './anhThuan';
export type { NativeImage } from './anhThuan';

export interface VoDocLap {
  /** Thư mục dữ liệu riêng (cài đặt, phiên hội thoại, quyền lâu dài…). */
  thuMucDuLieu: string;
  phienBan: string;
  /** Một sự kiện từ lõi (vd `agent:event`) ⇒ khung chat. */
  phatSuKien: (kenh: string, duLieu: unknown) => void;
  moNgoai: (url: string) => Promise<boolean>;
  chepChu: (chu: string) => void;
  /** Mở file/thư mục bằng chương trình mặc định. Trả '' khi được (giống Electron). */
  moDuong: (duong: string) => Promise<string>;
  chonThuMuc: (o: { title?: string; defaultPath?: string; properties?: string[] }) => Promise<{ canceled: boolean; filePaths: string[] }>;
  /** Đợt 3: nơi chạy (nhắn giữa phiên hiện tên này). */
  noi?: 'cli' | 'vscode';
}

let vo: VoDocLap | null = null;

export function caiDatVo(v: VoDocLap): void { vo = v; }

function canVo(): VoDocLap {
  if (!vo) throw new Error('Lõi độc lập chưa được khởi động.');
  return vo;
}

/** Thư mục thật theo tên kiểu Electron. */
function duongTheoTen(ten: string): string {
  const nha = os.homedir();
  switch (ten) {
    case 'userData':
    case 'sessionData':
      return canVo().thuMucDuLieu;
    case 'appData':
      return path.dirname(canVo().thuMucDuLieu);
    case 'home': return nha;
    case 'temp': return os.tmpdir();
    case 'downloads': return path.join(nha, 'Downloads');
    case 'documents': return path.join(nha, 'Documents');
    case 'desktop': return path.join(nha, 'Desktop');
    case 'logs': return path.join(canVo().thuMucDuLieu, 'logs');
    case 'exe': return process.execPath;
    default: return canVo().thuMucDuLieu;
  }
}

class AppGia extends EventEmitter {
  readonly isPackaged = true;
  /** 20/10/2026: lõi ngoài Electron (CLI/VS Code) — kho token CT Work dùng chung `~/.cuongmini/data` (`ctworkKetNoi.ts`). */
  readonly laLoiDocLap = true;
  getPath(ten: string): string { return duongTheoTen(ten); }
  getVersion(): string { return vo?.phienBan ?? '0.0.0'; }
  getName(): string { return 'CuongThai'; }
  getAppPath(): string { return canVo().thuMucDuLieu; }
  getLocale(): string { return 'vi'; }
  isReady(): boolean { return true; }
  whenReady(): Promise<void> { return Promise.resolve(); }
  quit(): void { /* không thoát VS Code */ }
}
export const app = new AppGia();

/** Một "cửa sổ" duy nhất: khung chat VS Code. `webContents.send` ⇒ sự kiện ra khung chat. */
const webContentsGia = {
  id: 1,
  send: (kenh: string, ...duLieu: unknown[]) => { vo?.phatSuKien(kenh, duLieu[0]); },
  isDestroyed: () => false,
  getURL: () => '',
  on: () => webContentsGia,
  once: () => webContentsGia,
};

export class BrowserWindow extends EventEmitter {
  static cuaSo = new BrowserWindow();
  readonly webContents = webContentsGia;
  readonly id = 1;
  static getAllWindows(): BrowserWindow[] { return [BrowserWindow.cuaSo]; }
  static getFocusedWindow(): BrowserWindow { return BrowserWindow.cuaSo; }
  static fromWebContents(): BrowserWindow { return BrowserWindow.cuaSo; }
  static fromId(): BrowserWindow { return BrowserWindow.cuaSo; }
  isDestroyed(): boolean { return false; }
  isFocused(): boolean { return true; }
  isVisible(): boolean { return true; }
  isMinimized(): boolean { return false; }
  focus(): void { /* VS Code tự lo */ }
  show(): void { /* như trên */ }
  restore(): void { /* như trên */ }
}

export const dialog = {
  /** Electron nhận `(cửaSổ, tuỳChọn)` hoặc `(tuỳChọn)`. */
  async showOpenDialog(a: unknown, b?: unknown): Promise<{ canceled: boolean; filePaths: string[] }> {
    const o = (b ?? a) as { title?: string; defaultPath?: string; properties?: string[] };
    return canVo().chonThuMuc(o ?? {});
  },
  async showMessageBox(): Promise<{ response: number; checkboxChecked: boolean }> {
    return { response: 0, checkboxChecked: false };
  },
  showErrorBox(): void { /* lỗi đã hiện trong khung chat */ },
};

export const shell = {
  openExternal: async (url: string): Promise<void> => { await canVo().moNgoai(url); },
  openPath: (duong: string): Promise<string> => canVo().moDuong(duong),
  showItemInFolder: (duong: string): void => { void canVo().moDuong(path.dirname(duong)); },
  beep: (): void => { /* không */ },
};

export const clipboard = {
  writeText: (chu: string): void => { canVo().chepChu(chu); },
  readText: (): string => '',
};

export const net = {
  fetch: (url: string | URL | Request, init?: RequestInit): Promise<Response> => fetch(url, init),
  isOnline: (): boolean => true,
};

/** Phiên đăng nhập của lõi KHÔNG đi qua đây (xem `authThay.ts`) — chỉ để mã khác nạp được. */
export const safeStorage = {
  isEncryptionAvailable: (): boolean => false,
  encryptString: (): Buffer => { throw new Error('safeStorage không có trong VS Code'); },
  decryptString: (): string => { throw new Error('safeStorage không có trong VS Code'); },
};

/** IPC thật không tồn tại: kênh được gọi thẳng qua sổ ở `ipcThay.ts`. */
export const ipcMain = {
  handle: (): void => { /* không */ },
  removeHandler: (): void => { /* không */ },
  on: (): void => { /* không */ },
};

export const nativeTheme = Object.assign(new EventEmitter(), { shouldUseDarkColors: true, themeSource: 'system' });
export const screen = { getPrimaryDisplay: () => ({ workAreaSize: { width: 1920, height: 1080 }, scaleFactor: 1 }) };
export const powerSaveBlocker = { start: (): number => 0, stop: (): void => { /* không */ }, isStarted: (): boolean => false };

export class Notification extends EventEmitter {
  static isSupported(): boolean { return false; }
  show(): void { /* không */ }
}

/** Cửa sổ trình duyệt nhúng chỉ có trong app — tạo ra là báo rõ. */
export class WebContentsView {
  constructor() { throw new Error('Trình duyệt tích hợp chỉ có trong app desktop CuongThai.'); }
}

export const session = {
  defaultSession: {
    fetch: (url: string | URL | Request, init?: RequestInit): Promise<Response> => fetch(url, init),
    on: (): void => { /* không */ },
  },
  fromPartition: () => session.defaultSession,
};

export default {
  app, BrowserWindow, dialog, shell, clipboard, net, safeStorage, ipcMain, nativeTheme, screen, powerSaveBlocker,
  Notification, WebContentsView, session,
};
