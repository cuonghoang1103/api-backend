/**
 * ============================================================
 * DÒ TRÌNH SOẠN CODE ĐÃ CÀI — để cài CuongMini Code một cú bấm
 * ============================================================
 *
 * Chủ app 17/10/2026: muốn người dùng app biết AI Code chạy được ngay trong
 * VS Code / Cursor / Antigravity / Windsurf / VSCodium, và cài được bằng một
 * cú bấm từ chính màn AI Code.
 *
 * Tệp này là phần THUẦN (không Electron, không spawn) — chỉ tính ra "tìm ở
 * đâu" và "đọc kết quả thế nào", để test được trên mọi hệ. Phần chạy lệnh nằm
 * ở `ipc/trinhSoan.ts`.
 *
 * ─── AN TOÀN ───
 * Renderer CHỈ gửi mã trình soạn (danh sách trắng `MA_TRINH_SOAN`). Đường dẫn
 * CLI, tham số, mã extension đều do tệp này quyết — không có chuỗi nào từ
 * renderer chạm tới `spawn`.
 */
import path from 'node:path';
import type { MaTrinhSoan } from '../shared/ipc';

export const MA_EXTENSION = 'cuongthai.cuongthai-ai-code';

export interface ThongTinTrinhSoan {
  ma: MaTrinhSoan;
  ten: string;
  /** Tên lệnh CLI khi nằm trong PATH (`code`, `cursor`…). */
  tenCli: string;
  /** Scheme deep link — `<scheme>:extension/<id>` mở thẳng trang extension. */
  scheme: string;
  /** Tên gói .app trên macOS. */
  appMac: string;
  /** Thư mục cài trên Windows (dưới %LOCALAPPDATA%\Programs và %ProgramFiles%). */
  thuMucWin: string[];
}

/*
 * Scheme đo trên máy 17/10/2026 (CFBundleURLSchemes / product.json `urlProtocol`):
 * VS Code `vscode`, Cursor `cursor`, Antigravity `antigravity`. Windsurf và
 * VSCodium theo đúng tên sản phẩm như tài liệu của họ.
 */
export const DANH_SACH: readonly ThongTinTrinhSoan[] = [
  { ma: 'vscode', ten: 'VS Code', tenCli: 'code', scheme: 'vscode', appMac: 'Visual Studio Code.app', thuMucWin: ['Microsoft VS Code'] },
  { ma: 'cursor', ten: 'Cursor', tenCli: 'cursor', scheme: 'cursor', appMac: 'Cursor.app', thuMucWin: ['cursor', 'Cursor'] },
  { ma: 'antigravity', ten: 'Antigravity', tenCli: 'antigravity', scheme: 'antigravity', appMac: 'Antigravity.app', thuMucWin: ['Antigravity'] },
  { ma: 'windsurf', ten: 'Windsurf', tenCli: 'windsurf', scheme: 'windsurf', appMac: 'Windsurf.app', thuMucWin: ['Windsurf'] },
  { ma: 'vscodium', ten: 'VSCodium', tenCli: 'codium', scheme: 'vscodium', appMac: 'VSCodium.app', thuMucWin: ['VSCodium'] },
];

export function thongTin(ma: MaTrinhSoan): ThongTinTrinhSoan {
  const t = DANH_SACH.find((x) => x.ma === ma);
  if (!t) throw new Error(`Trình soạn không có trong danh sách: ${ma}`);
  return t;
}

export function deepLink(ma: MaTrinhSoan): string {
  return `${thongTin(ma).scheme}:extension/${MA_EXTENSION}`;
}

export interface UngVien {
  /** Nơi có thể là app (để biết "đã cài" và để mở). */
  app: string[];
  /** Nơi có thể là CLI, theo thứ tự ưu tiên. */
  cli: string[];
}

/**
 * Những chỗ cần nhìn để tìm một trình soạn, theo hệ điều hành.
 *
 * Tìm CẢ trong gói app lẫn trong PATH: người dùng macOS hiếm khi chạy "Shell
 * Command: Install 'code' in PATH", nên chỉ tìm PATH là báo "chưa cài" cho đa
 * số máy đã cài. Ngược lại trên Linux gói cài để CLI trong PATH là chuẩn.
 */
export function ungVien(
  ma: MaTrinhSoan,
  he: NodeJS.Platform,
  env: Record<string, string | undefined>,
  home: string,
): UngVien {
  const t = thongTin(ma);
  const p = he === 'win32' ? path.win32 : path.posix;
  const trongPath = (env.PATH ?? env.Path ?? '')
    .split(he === 'win32' ? ';' : ':')
    .filter(Boolean)
    .map((d) => p.join(d, he === 'win32' ? `${t.tenCli}.cmd` : t.tenCli));

  if (he === 'darwin') {
    const app = ['/Applications', p.join(home, 'Applications')].map((d) => p.join(d, t.appMac));
    return {
      app,
      cli: [...app.map((a) => p.join(a, 'Contents', 'Resources', 'app', 'bin', t.tenCli)), ...trongPath],
    };
  }

  if (he === 'win32') {
    const goc = [env.LOCALAPPDATA && p.join(env.LOCALAPPDATA, 'Programs'), env.ProgramFiles, env['ProgramFiles(x86)']]
      .filter((x): x is string => Boolean(x));
    const thuMuc = goc.flatMap((g) => t.thuMucWin.map((d) => p.join(g, d)));
    return {
      app: thuMuc,
      cli: [
        ...thuMuc.map((d) => p.join(d, 'bin', `${t.tenCli}.cmd`)),
        // Cursor đặt CLI sâu hơn một tầng so với VS Code.
        ...thuMuc.map((d) => p.join(d, 'resources', 'app', 'bin', `${t.tenCli}.cmd`)),
        ...trongPath,
      ],
    };
  }

  // Linux: gói .deb/.rpm/snap đều đặt lệnh vào PATH; thêm vài chỗ quen thuộc
  // phòng khi app chạy với PATH cụt.
  const quenThuoc = ['/usr/bin', '/usr/local/bin', '/snap/bin', p.join(home, '.local', 'bin')].map((d) => p.join(d, t.tenCli));
  const cli = [...new Set([...trongPath, ...quenThuoc])];
  return { app: [], cli };
}

/**
 * Đọc đầu ra `--list-extensions --show-versions` (mỗi dòng `publisher.ten@x.y.z`).
 * So không phân biệt hoa thường — chợ coi id là không phân biệt.
 */
export function docPhienBanExt(dauRa: string): string | null {
  for (const dong of dauRa.split(/\r?\n/)) {
    const m = /^\s*([^@\s]+)@(\S+)\s*$/.exec(dong);
    if (m && m[1]!.toLowerCase() === MA_EXTENSION) return m[2]!;
  }
  return null;
}

/**
 * Môi trường sạch cho CLI của trình soạn.
 *
 * App là Electron; vài biến của nó (`ELECTRON_RUN_AS_NODE`, `NODE_OPTIONS`)
 * làm CLI của VS Code — cũng là Electron — chạy sai chế độ. Còn `VSCODE_*`
 * (khi app được mở từ terminal của VS Code) khiến `code` gửi lệnh sang CỬA SỔ
 * VS Code đang chạy thay vì tự làm, rồi treo chờ.
 */
export function moiTruongSach(env: Record<string, string | undefined>): Record<string, string> {
  const ra: Record<string, string> = {};
  for (const [k, v] of Object.entries(env)) {
    if (v === undefined) continue;
    if (k === 'ELECTRON_RUN_AS_NODE' || k === 'NODE_OPTIONS' || k.startsWith('VSCODE_')) continue;
    ra[k] = v;
  }
  return ra;
}
