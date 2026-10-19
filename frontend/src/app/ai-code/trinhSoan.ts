/**
 * Danh sách trình soạn code cài được CuongMini Code (extension VS Code của AI Code).
 *
 * MỘT chỗ duy nhất cho mã extension, deep link và link chợ — trang `/ai-code`
 * và khối giới thiệu ở `/download` cùng đọc từ đây, để đổi id/chợ chỉ sửa một lần.
 *
 * Deep link `<scheme>:extension/<id>` là cách chính thức của VS Code (và các bản
 * fork giữ nguyên trình xử lý URL) để mở thẳng trang extension trong trình soạn.
 * Scheme lấy từ `urlProtocol` trong product.json / CFBundleURLSchemes của từng app
 * (đo trên máy 17/10/2026: VS Code = `vscode`, Cursor = `cursor`, Antigravity
 * khai `antigravity`). Trình soạn chưa cài thì trình duyệt im lặng — nên mỗi thẻ
 * luôn kèm hướng dẫn tay.
 */

export const MA_EXTENSION = 'cuongthai.cuongthai-ai-code';
export const LINK_CHO_MS = `https://marketplace.visualstudio.com/items?itemName=${MA_EXTENSION}`;
export const LINK_OPEN_VSX = 'https://open-vsx.org/extension/cuongthai/cuongthai-ai-code';

/** Lệnh cài CuongMini CLI (bản dựng do phiên khác làm — giữ khớp `/cli/install.*`). */
export const LENH_CLI_UNIX = 'curl -fsSL https://cuongthai.com/cli/install.sh | bash';
export const LENH_CLI_WINDOWS = 'irm https://cuongthai.com/cli/install.ps1 | iex';
/** Cùng trình cài Windows, gõ trong Command Prompt (cmd) — cmd không có `irm`. */
export const LENH_CLI_WINDOWS_CMD = 'powershell -NoProfile -ExecutionPolicy Bypass -c "irm https://cuongthai.com/cli/install.ps1 | iex"';
/** Git Bash trên Windows: install.sh tự chuyển sang trình cài Windows (kiểm trên runner windows-latest 18/10/2026). */
export const LENH_CLI_GIT_BASH = LENH_CLI_UNIX;
export const LENH_CHAY_CLI = 'cuongmini';

export type MaTrinhSoan = 'vscode' | 'cursor' | 'antigravity' | 'windsurf' | 'vscodium';

export interface TrinhSoan {
  ma: MaTrinhSoan;
  ten: string;
  /** Chữ viết tắt trên biểu tượng — tự vẽ, KHÔNG dùng logo thương hiệu của hãng. */
  chuTat: string;
  /** Hai màu nền của biểu tượng chữ. */
  mau: [string, string];
  moTa: string;
  deepLink: string;
  /** Chợ extension mà trình soạn đó dùng (VS Code: chợ Microsoft; bản fork: Open VSX). */
  linkCho: string;
  tenCho: string;
  /** Lệnh CLI cài thẳng; null khi chưa chắc tên lệnh (đừng đưa người dùng lệnh đoán mò). */
  lenhCli: string | null;
  /** Ghi chú riêng khi deep link chưa chắc chạy. */
  ghiChu?: string;
}

export const DANH_SACH_TRINH_SOAN: TrinhSoan[] = [
  {
    ma: 'vscode',
    ten: 'VS Code',
    chuTat: 'VS',
    mau: ['#1f8ad2', '#0a5fa8'],
    moTa: 'Trình soạn phổ biến nhất — cài thẳng từ chợ extension chính thức.',
    deepLink: `vscode:extension/${MA_EXTENSION}`,
    linkCho: LINK_CHO_MS,
    tenCho: 'VS Code Marketplace',
    lenhCli: `code --install-extension ${MA_EXTENSION}`,
  },
  {
    ma: 'cursor',
    ten: 'Cursor',
    chuTat: 'Cu',
    mau: ['#3b3b46', '#16161c'],
    moTa: 'Dùng song song với AI sẵn có của Cursor — mỗi bên một khung.',
    deepLink: `cursor:extension/${MA_EXTENSION}`,
    linkCho: LINK_OPEN_VSX,
    tenCho: 'Open VSX',
    lenhCli: `cursor --install-extension ${MA_EXTENSION}`,
  },
  {
    ma: 'antigravity',
    ten: 'Antigravity',
    chuTat: 'Ag',
    mau: ['#4f7cff', '#7b4dff'],
    moTa: 'Trình soạn agent của Google — lấy extension từ Open VSX.',
    deepLink: `antigravity:extension/${MA_EXTENSION}`,
    linkCho: LINK_OPEN_VSX,
    tenCho: 'Open VSX',
    lenhCli: null,
    ghiChu: 'Antigravity mở app nhưng KHÔNG tự mở trang extension (nó chưa xử lý link extension/…). Trong Antigravity: mở Extensions (⇧⌘X / Ctrl+Shift+X) → tìm “CuongMini” → Install. Không thấy thì tải tệp .vsix từ Open VSX (nút Download) rồi kéo thả vào khung Extensions, hoặc ⋯ → Install from VSIX.',
  },
  {
    ma: 'windsurf',
    ten: 'Windsurf',
    chuTat: 'Ws',
    mau: ['#14b8a6', '#0e7490'],
    moTa: 'Cài từ Open VSX, chạy cạnh Cascade như một khung chat riêng.',
    deepLink: `windsurf:extension/${MA_EXTENSION}`,
    linkCho: LINK_OPEN_VSX,
    tenCho: 'Open VSX',
    lenhCli: `windsurf --install-extension ${MA_EXTENSION}`,
  },
  {
    ma: 'vscodium',
    ten: 'VSCodium',
    chuTat: 'Vc',
    mau: ['#2f80ed', '#1b4f9c'],
    moTa: 'Bản VS Code mã nguồn mở, không telemetry — dùng Open VSX.',
    deepLink: `vscodium:extension/${MA_EXTENSION}`,
    linkCho: LINK_OPEN_VSX,
    tenCho: 'Open VSX',
    lenhCli: `codium --install-extension ${MA_EXTENSION}`,
  },
];
