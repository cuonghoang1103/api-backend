'use client';

/**
 * /cli — phần chạy ở trình duyệt.
 *
 * Client chỉ vì một thứ cần `window`: đoán hệ điều hành để mở sẵn đúng tab cài
 * đặt (người dùng máy mới tinh không biết mình nên đọc tab nào). Toàn bộ chữ vẫn
 * có trong HTML dựng sẵn nên không mất gì cho SEO.
 *
 * Mọi lệnh, cờ, phím tắt, lệnh `/` ở đây chép từ mã CLI thật
 * (`packages/cuongmini-cli/src/{coDong,cheDo,lenh}.ts`, `ui/ManChat.tsx`) và
 * `desktop/.../lenhGach.ts` — đổi bên đó thì sửa bên này, đừng bịa thêm.
 */
import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import {
  ArrowRight, AtSign, BookOpen, Brain, Check, ChevronDown, Copy, Crown, Download, FolderOpen,
  Gauge, KeyRound, ListChecks, LogIn, Plug, RefreshCw, ShieldCheck, ShoppingBag, Slash, Terminal, Trash2,
} from 'lucide-react';
import { detectPlatform } from '../download/DownloadClient';
import { LENH_CHAY_CLI, LENH_CLI_UNIX, LENH_CLI_WINDOWS } from '../ai-code/trinhSoan';

type MaHDH = 'macos' | 'windows' | 'linux';

const TAB_HDH: { ma: MaHDH; ten: string }[] = [
  { ma: 'macos', ten: 'macOS' },
  { ma: 'windows', ten: 'Windows' },
  { ma: 'linux', ten: 'Linux' },
];

/** Nút chép có trạng thái "Đã chép" tự hết sau 2 giây — để bấm lần hai vẫn thấy phản hồi. */
function NutChep({ chu }: { chu: string }) {
  const [daChep, setDaChep] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard.writeText(chu).then(() => {
          setDaChep(true);
          setTimeout(() => setDaChep(false), 2000);
        }).catch(() => { /* trình duyệt chặn chép — người dùng vẫn bôi đen được */ });
      }}
      className="inline-flex shrink-0 items-center gap-1 rounded-md bg-white/10 px-2.5 py-1 text-xs font-medium text-[#e6e8ee] transition hover:bg-white/20"
      aria-label={`Chép: ${chu}`}
    >
      {daChep ? <Check size={13} aria-hidden /> : <Copy size={13} aria-hidden />}
      {daChep ? 'Đã chép' : 'Chép'}
    </button>
  );
}

/** Một dòng lệnh trong khung tối — màu cố định nên đọc được ở cả theme sáng lẫn tối. */
function DongLenh({ lenh, dauNhac = '$', khongChep = false }: { lenh: string; dauNhac?: string; khongChep?: boolean }) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-[#0f1117] px-3.5 py-2.5 font-mono text-[13px] text-[#e6e8ee]">
      <span className="select-none pt-px text-[#7c8496]" aria-hidden>{dauNhac}</span>
      <code className="min-w-0 flex-1 whitespace-pre-wrap break-all">{lenh}</code>
      {!khongChep && <NutChep chu={lenh} />}
    </div>
  );
}

/* ── Logo chữ cỡ nhỏ ("Calvin S") — cùng bảng nét với `logo.ts` của CLI ── */
const NET_LOGO: Record<string, string[]> = {
  C: ['╔═╗', '║  ', '╚═╝'], u: ['┬ ┬', '│ │', '└─┘'], o: ['┌─┐', '│ │', '└─┘'], n: ['┌┐┌', '│││', '┘└┘'],
  g: ['┌─┐', '│ ┬', '└─┘'], M: ['╔╦╗', '║║║', '╩ ╩'], i: ['┬', '│', '┴'],
};
const LOGO = [0, 1, 2].map((d) => [...'CuongMini'].map((c) => NET_LOGO[c]![d]).join(''));

/**
 * Ảnh minh hoạ terminal dựng bằng CSS — không phải ảnh chụp, nên không cũ đi
 * khi giao diện CLI đổi màu. Bố cục bám đúng CLI thật: khung chào viền chuyển
 * sắc, dòng tool `● Tên(đối số)` + `⎿`, diff, bảng 📋 Kế hoạch ở cột phải
 * (CLI tự dời bảng lên trên ô nhập khi terminal hẹp — ở đây cũng vậy).
 */
function AnhTerminal() {
  return (
    <div aria-hidden className="overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[#14161d] text-[11.5px] leading-[1.55] text-[#c9cfdb] shadow-xl">
      <div className="flex items-center gap-1.5 border-b border-white/5 px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 truncate text-[11px] text-[#7c8496]">~/du-an-cua-ban — cuongmini</span>
      </div>
      <div className="flex flex-col font-mono md:flex-row">
        <div className="min-w-0 flex-1 space-y-2 p-3">
          {/* Khung chào: viền chuyển sắc tím → xanh như `veManMoDau` */}
          <div className="cli-vien rounded-lg p-px">
            <div className="rounded-[7px] bg-[#14161d] px-3 py-2">
              <p className="cli-chu text-[10px] font-semibold">✻ CuongMini CLI</p>
              <div className="cli-chu mt-1 whitespace-pre text-[10px] leading-[1.15]">{LOGO.join('\n')}</div>
              <p className="mt-1.5 text-white">Xin chào, Cường! <span className="text-[#7c8496]">Đọc, sửa code, chạy lệnh ngay tại đây.</span></p>
              <p><span className="text-[#7c8496]">Model&nbsp;&nbsp;</span><span className="text-[#93c5fd]">Cuong Sonnet 5</span><span className="text-[#7c8496]"> · mức Vừa</span></p>
              <p><span className="text-[#7c8496]">Chế độ&nbsp;</span><span className="text-[#fbbf24]">⚡ Tự động</span><span className="text-[#7c8496]"> (shift+tab)</span></p>
            </div>
          </div>

          <p className="text-white"><span className="text-[#a78bfa]">&gt;</span> Sửa lỗi null ở <span className="rounded bg-white/10 px-1">@src/auth.ts</span> rồi chạy test</p>

          <div>
            <p><span className="text-[#4ade80]">●</span> <span className="text-white">Đọc</span>(src/auth.ts)</p>
            <p className="pl-2 text-[#7c8496]">⎿&nbsp; 42/42 dòng</p>
          </div>
          <div>
            <p><span className="text-[#4ade80]">●</span> <span className="text-white">Sửa</span>(src/auth.ts)</p>
            <div className="ml-4 mt-0.5 overflow-hidden rounded border border-white/5">
              <p className="bg-[#f87171]/15 px-2 text-[#fca5a5]">- &nbsp;return u.token</p>
              <p className="bg-[#4ade80]/15 px-2 text-[#86efac]">+ &nbsp;if (!u) throw new LoiDangNhap()</p>
              <p className="bg-[#4ade80]/15 px-2 text-[#86efac]">+ &nbsp;return u.token</p>
            </div>
          </div>
          <div>
            <p><span className="text-[#4ade80]">●</span> <span className="text-white">Lệnh</span>(npm test)</p>
            <p className="pl-2 text-[#7c8496]">⎿&nbsp; <span className="text-[#86efac]">✓ 12 passed</span></p>
          </div>
          <p className="text-[#a78bfa]">✻ <span className="text-[#c9cfdb]">Đang kiểm lại…</span> <span className="text-[#7c8496]">(8s · bước 4 · esc để dừng)</span></p>
        </div>

        <div className="space-y-1 border-t border-white/5 p-3 md:w-[38%] md:border-l md:border-t-0">
          <p className="font-semibold text-[#c4b5fd]">📋 Kế hoạch</p>
          <p className="text-[#7c8496]">2/3 việc xong</p>
          <p><span className="text-[#4ade80]">☑</span> Đọc auth.ts</p>
          <p><span className="text-[#4ade80]">☑</span> Thêm kiểm tra rỗng</p>
          <p><span className="text-[#fbbf24]">◐</span> Chạy test</p>
          <p className="pt-1.5 font-semibold text-[#c4b5fd]">File đã sửa (1)</p>
          <p>auth.ts <span className="text-[#4ade80]">+2</span> <span className="text-[#f87171]">−1</span></p>
        </div>
      </div>
      <div className="border-t border-white/5 px-3 py-2 font-mono">
        <p className="text-white"><span className="text-[#a78bfa]">&gt;</span> <span className="cli-con-tro inline-block h-3 w-1.5 translate-y-0.5 bg-[#a78bfa]" /></p>
        <p className="truncate text-[10px] text-[#7c8496]">⚡ Tự động · shift+tab đổi chế độ · / lệnh · @ file · ctrl+p kế hoạch</p>
      </div>
    </div>
  );
}

/* ── Cài đặt theo hệ điều hành ─────────────────────────────────────────── */

interface BuocCai { tieuDe: string; moTa: ReactNode; lenh?: string; dauNhac?: string }

/**
 * Các bước viết cho người CHƯA TỪNG mở terminal: nói cả chỗ bấm để mở nó, và
 * nói trước chuyện phải mở cửa sổ MỚI sau khi cài (PATH chỉ có hiệu lực ở cửa
 * sổ mở sau) — đây là lỗi số một của người mới, nên nó là một bước riêng chứ
 * không phải một dòng chú thích.
 */
function cacBuocCai(hdh: MaHDH): BuocCai[] {
  if (hdh === 'windows') {
    return [
      {
        tieuDe: 'Mở PowerShell',
        moTa: <>Bấm phím <kbd>Windows</kbd>, gõ <strong>PowerShell</strong> (Windows 11 có thể gõ <strong>Terminal</strong>) rồi <kbd>Enter</kbd>. Không cần “Run as administrator”. <em>Đừng</em> dùng Command Prompt (cmd) — lệnh cài là lệnh PowerShell.</>,
      },
      {
        tieuDe: 'Dán lệnh cài rồi Enter',
        moTa: <>Bấm <strong>Chép</strong>, nhấp chuột phải vào cửa sổ PowerShell để dán (hoặc <kbd>Ctrl+V</kbd>), rồi <kbd>Enter</kbd>.</>,
        lenh: LENH_CLI_WINDOWS,
        dauNhac: 'PS>',
      },
      {
        tieuDe: 'Chờ cài xong',
        moTa: <>Thường dưới một phút. Máy chưa có Node.js thì trình cài tự tải Node 22 chính thức (kiểm SHA-256) vào <code>%USERPROFILE%\.cuongmini\node</code> — không đụng gì khác trên máy. Xong sẽ thấy dòng <code>Bắt đầu: cd thu-muc-du-an; cuongmini</code>.</>,
      },
      {
        tieuDe: 'Đóng PowerShell, mở cửa sổ MỚI',
        moTa: <>Lệnh <code>cuongmini</code> vừa được thêm vào PATH, mà PATH chỉ có hiệu lực ở cửa sổ mở <strong>sau</strong> khi cài.</>,
      },
      {
        tieuDe: 'Vào thư mục dự án',
        moTa: <>Gõ <code>cd</code> rồi đường dẫn thư mục. Mẹo: mở thư mục dự án trong File Explorer, gõ <strong>powershell</strong> vào thanh địa chỉ rồi <kbd>Enter</kbd> — PowerShell mở sẵn đúng chỗ.</>,
        lenh: 'cd $HOME\\Documents\\du-an-cua-ban',
        dauNhac: 'PS>',
      },
      {
        tieuDe: 'Gõ cuongmini',
        moTa: <>Lần đầu sẽ hỏi đăng nhập (xem phần Hướng dẫn sử dụng). Gõ tắt: <code>cm</code> nếu máy chưa có lệnh nào tên đó.</>,
        lenh: LENH_CHAY_CLI,
        dauNhac: 'PS>',
      },
    ];
  }
  const mac = hdh === 'macos';
  return [
    {
      tieuDe: 'Mở Terminal',
      moTa: mac
        ? <>Bấm <kbd>⌘ Cmd</kbd> + <kbd>Space</kbd> (Spotlight), gõ <strong>Terminal</strong> rồi <kbd>Enter</kbd>. Đã quen iTerm2 hay Warp thì dùng luôn.</>
        : <>Bấm <kbd>Ctrl+Alt+T</kbd> (Ubuntu và hầu hết bản Linux), hoặc tìm <strong>Terminal</strong> trong menu ứng dụng.</>,
    },
    {
      tieuDe: 'Dán lệnh cài rồi Enter',
      moTa: mac
        ? <>Bấm <strong>Chép</strong>, dán vào Terminal bằng <kbd>⌘ Cmd+V</kbd>, rồi <kbd>Enter</kbd>. Không cần sudo, không hỏi mật khẩu máy.</>
        : <>Bấm <strong>Chép</strong>, dán bằng <kbd>Ctrl+Shift+V</kbd>, rồi <kbd>Enter</kbd>. Không cần sudo. Cần có <code>curl</code> (hoặc <code>wget</code>) và <code>tar</code> — hầu hết bản Linux có sẵn.</>,
      lenh: LENH_CLI_UNIX,
    },
    {
      tieuDe: 'Chờ cài xong',
      moTa: <>Thường dưới một phút. Máy chưa có Node.js ≥ 20 thì trình cài tự tải Node 22 chính thức (kiểm SHA-256) vào <code>~/.cuongmini/node</code> — không đụng Node sẵn có của bạn. Lệnh <code>cuongmini</code> đặt ở <code>~/.local/bin</code> và tự thêm vào PATH (<code>{mac ? '~/.zshrc' : '~/.bashrc'}</code>).</>,
    },
    {
      tieuDe: 'Mở cửa sổ terminal MỚI',
      moTa: mac
        ? <>Bấm <kbd>⌘ Cmd+N</kbd> (hoặc đóng rồi mở lại Terminal). PATH mới chỉ có hiệu lực ở cửa sổ mở <strong>sau</strong> khi cài.</>
        : <>Mở tab/cửa sổ mới (hoặc chạy <code>source ~/.bashrc</code>). PATH mới chỉ có hiệu lực ở cửa sổ mở <strong>sau</strong> khi cài.</>,
    },
    {
      tieuDe: 'Vào thư mục dự án',
      moTa: mac
        ? <>Gõ <code>cd</code> và một dấu cách, rồi <strong>kéo thư mục dự án từ Finder thả vào Terminal</strong> — đường dẫn tự điền — rồi <kbd>Enter</kbd>.</>
        : <>Gõ <code>cd</code> rồi đường dẫn thư mục dự án. Nhiều trình quản lý file có “Open in Terminal” khi nhấp chuột phải vào thư mục.</>,
      lenh: 'cd ~/du-an-cua-ban',
    },
    {
      tieuDe: 'Gõ cuongmini',
      moTa: <>Lần đầu sẽ hỏi đăng nhập (xem phần Hướng dẫn sử dụng). Gõ tắt: <code>cm</code> nếu máy chưa có lệnh nào tên đó. Trên macOS, <code>open</code> là lệnh hệ thống nên lệnh chính luôn là <code>cuongmini</code>.</>,
      lenh: LENH_CHAY_CLI,
    },
  ];
}

const LOI_HAY_GAP: { hoi: string; dap: ReactNode }[] = [
  {
    hoi: '“command not found: cuongmini” / “cuongmini is not recognized”',
    dap: <>Gần như luôn là đang dùng cửa sổ terminal mở <strong>trước</strong> khi cài. Mở cửa sổ mới. Vẫn không được: macOS chạy <code>source ~/.zshrc</code>, Linux chạy <code>source ~/.bashrc</code>; Windows đóng <strong>hết</strong> cửa sổ PowerShell rồi mở lại. Chạy thẳng không cần PATH: <code>~/.local/bin/cuongmini</code> (Windows: <code>%LOCALAPPDATA%\CuongMini\bin\cuongmini.cmd</code>).</>,
  },
  {
    hoi: 'Windows: “irm is not recognized” hoặc “running scripts is disabled”',
    dap: <>Bạn đang dán vào Command Prompt (cmd) hoặc chạy một file <code>.ps1</code> đã tải về. Mở <strong>PowerShell</strong> và dán đúng lệnh <code>irm https://cuongthai.com/cli/install.ps1 | iex</code> — lệnh này chạy thẳng trong PowerShell, không cần đổi ExecutionPolicy. Máy công ty khoá chặt PowerShell thì nhờ IT, hoặc cài trong WSL theo tab Linux.</>,
  },
  {
    hoi: 'Mạng công ty / trường chặn, tải mãi không xong',
    dap: <>Trình cài cần vào được <code>cuongthai.com</code> và (nếu phải tải Node) <code>nodejs.org</code>; lúc dùng chỉ cần <code>cuongthai.com</code>. Thử mạng khác (phát 4G từ điện thoại) hoặc nhờ IT mở hai tên miền đó. Đứt giữa chừng thì cứ chạy lại lệnh cài — script chỉ chạy khi đã tải đủ, không để lại bản cài dở.</>,
  },
  {
    hoi: 'Linux: “curl: command not found”',
    dap: <>Cài curl trước: <code>sudo apt install -y curl</code> (Debian/Ubuntu) hoặc <code>sudo dnf install -y curl</code> (Fedora), rồi chạy lại lệnh cài. Có <code>wget</code> thì trình cài tự dùng wget để tải gói.</>,
  },
  {
    hoi: 'Bấm đăng nhập Google/GitHub/Apple mà không thấy trình duyệt mở',
    dap: <>CLI in sẵn một đường link — chép link đó mở bằng trình duyệt trên <strong>cùng máy</strong>. Đang SSH vào máy chủ (không có trình duyệt) thì chọn <strong>Tên đăng nhập + mật khẩu</strong>.</>,
  },
  {
    hoi: 'Đăng nhập được nhưng báo cần Pro',
    dap: <>Tài khoản đó chưa có quyền dùng AI Code trong terminal. Cần gói <Link href="/pro">Pro</Link> hoặc key terminal còn hạn (<Link href="/llm-key">xin key</Link> hay <Link href="/shop">mua ở shop</Link>). Đã có rồi thì kiểm lại xem có đăng nhập đúng tài khoản không: <code>cuongmini logout</code> rồi chạy lại.</>,
  },
];

/* ── Hướng dẫn sử dụng ─────────────────────────────────────────────────── */

const NHOM_LENH: { ten: string; lenh: [string, string][] }[] = [
  {
    ten: 'Cơ bản',
    lenh: [
      ['/help', 'Danh sách lệnh'],
      ['/clear', 'Xoá hội thoại, bắt đầu việc mới'],
      ['/login · /logout', 'Đăng nhập lại / đổi tài khoản · đăng xuất'],
      ['/exit', 'Thoát CuongMini'],
    ],
  },
  {
    ten: 'Phiên & model',
    lenh: [
      ['/model', 'Chọn model (menu): Cuong Sonnet 5, CuongMini Max, GPT 6 Sol'],
      ['/effort', 'Mức nỗ lực: thấp → tối đa (số bước, agent phụ)'],
      ['/compact', 'Tóm tắt phần cũ để nhẹ ngữ cảnh'],
      ['/context', 'Ngữ cảnh đã dùng'],
      ['/usage · /cost', 'Hạn mức 5 giờ, lúc hồi · tiền đã tiêu trong việc này'],
      ['/status', 'Phiên bản, cổng đang dùng, dự án, nhánh git'],
    ],
  },
  {
    ten: 'Làm việc',
    lenh: [
      ['/plan <việc>', 'Chỉ lập kế hoạch (không sửa, không chạy lệnh) — duyệt xong mới làm'],
      ['/review', 'Soát diff hiện tại, liệt kê lỗi kèm file:dòng — không sửa'],
      ['/diff', 'Xem git diff của dự án'],
      ['/init', 'Quét dự án, tạo/cập nhật AGENTS.md mà AI tự đọc mỗi lượt'],
      ['/undo', 'Hoàn tác mọi file AI đã sửa trong việc này'],
      ['/rewind [n]', 'Quay về một câu hỏi trước: cắt hội thoại + lùi file'],
      ['/resume', 'Bảng chọn việc cũ để làm tiếp'],
      ['/export [tên.md]', 'Xuất hội thoại ra file Markdown'],
    ],
  },
  {
    ten: 'Công cụ',
    lenh: [
      ['/memory', 'Xem/xoá bộ nhớ (bài học) của AI'],
      ['/mcp', 'Trạng thái máy chủ MCP'],
      ['/kynang', 'Tìm và cài skill từ kho AI Templates vào dự án'],
      ['/quyen', 'Xem và thu hồi các lệnh đã “Luôn cho phép”'],
      ['/hooks', 'Quản lý hook'],
      ['/doctor', 'Chẩn đoán: mạng, máy chủ, cổng, quyền thư mục'],
    ],
  },
];

const PHIM_TAT: [string, string][] = [
  ['Enter', 'Gửi'],
  ['Alt+Enter · \\ cuối dòng', 'Xuống dòng'],
  ['↑ / ↓', 'Lịch sử câu đã gửi'],
  ['/', 'Gợi ý lệnh (Tab chèn, Enter chạy)'],
  ['@', 'Gợi ý file/thư mục dự án (tìm mờ)'],
  ['shift+tab', 'Đổi chế độ quyền'],
  ['esc', 'Dừng việc đang chạy · esc esc xoá ô nhập'],
  ['ctrl+o', 'Bật/tắt xem đầy đủ đầu ra lệnh'],
  ['ctrl+p', 'Ẩn/hiện bảng kế hoạch'],
  ['ctrl+l', 'Xoá màn hình'],
  ['ctrl+c', 'Dừng việc · xoá ô nhập · nhấn 2 lần để thoát'],
];

const CHE_DO: { icon: string; ten: string; mo: string; co: string; mau: string }[] = [
  { icon: '⏸', ten: 'Lập kế hoạch', mo: 'Mặc định. Chỉ đọc — không sửa file, không chạy lệnh.', co: 'ke-hoach', mau: '#22d3ee' },
  { icon: '✋', ten: 'Hỏi trước mọi việc', mo: 'Mỗi lần sửa / chạy lệnh đều có thẻ duyệt.', co: 'hoi', mau: '#4ade80' },
  { icon: '✎', ten: 'Tự sửa file', mo: 'Sửa file không hỏi, chạy lệnh vẫn hỏi.', co: 'tu-sua', mau: '#a78bfa' },
  { icon: '⚡', ten: 'Tự động', mo: 'Sửa + chạy lệnh an toàn không hỏi; lệnh nguy hiểm vẫn hỏi.', co: 'tu-dong', mau: '#fbbf24' },
  { icon: '⚠', ten: 'Bỏ qua hết', mo: 'Không hỏi gì. CLI hỏi xác nhận trước khi bật — chỉ dùng khi thật tin.', co: 'bo-qua-het', mau: '#f87171' },
];

const SO_SANH: [string, string, string][] = [
  ['Cài đặt', 'Tự cài Node, npm i -g, đặt biến môi trường, viết opencode.json', 'Một dòng lệnh — tự lo Node, tự thêm PATH'],
  ['Đăng nhập', 'Dán key tay, giữ key như mật khẩu', 'Tài khoản cuongthai.com (Google/GitHub/Apple/mật khẩu)'],
  ['Bộ máy AI', 'Agent chung của OpenCode, gọi qua cổng key', 'Đúng lõi AI Code của app: skill dự án, bộ nhớ bài học, MCP, agent phụ'],
  ['Khi cổng chính bảo trì', 'Dừng', 'Tự chuyển cổng như app'],
  ['Hạn mức', 'Ví riêng của key', 'Chung một ví với app và extension'],
  ['Lệnh & quyền', 'Bộ lệnh của OpenCode', 'Cùng lệnh /, @ file, 5 chế độ quyền với app — giao diện tiếng Việt'],
];

/** Tiêu đề mục: số thứ tự + chữ, có id để nhảy tới từ mục lục. */
function TieuDeMuc({ id, children, moTa }: { id: string; children: ReactNode; moTa?: ReactNode }) {
  return (
    <div id={id} className="scroll-mt-24">
      <h2 className="text-2xl font-bold sm:text-3xl">{children}</h2>
      {moTa && <p className="mt-2 max-w-2xl text-[var(--text-secondary)]">{moTa}</p>}
    </div>
  );
}

/** Một thẻ hướng dẫn nhỏ có biểu tượng — dùng cho phần sử dụng. */
function TheHuongDan({ icon: Icon, tieuDe, children }: { icon: typeof Terminal; tieuDe: string; children: ReactNode }) {
  return (
    <div className="min-w-0 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
      <h3 className="flex items-center gap-2 font-semibold">
        <span className="cli-grad inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white">
          <Icon size={16} aria-hidden />
        </span>
        {tieuDe}
      </h3>
      <div className="mt-3 space-y-3 text-sm text-[var(--text-secondary)]">{children}</div>
    </div>
  );
}

export default function CliClient() {
  const [hdh, setHdh] = useState<MaHDH>('macos');

  // Mở sẵn tab đúng máy đang xem trang; người dùng vẫn đổi tay được.
  useEffect(() => {
    const p = detectPlatform();
    if (p === 'windows') setHdh('windows');
    else if (p === 'linux') setHdh('linux');
  }, []);

  const buoc = cacBuocCai(hdh);
  const laWin = hdh === 'windows';

  return (
    <main className="cli mx-auto max-w-5xl px-4 pb-24 pt-24 text-[var(--text-primary)] sm:px-6">
      <style>{`
        .cli { --cli-a: #8b5cf6; --cli-b: #6d28d9; --cli-c: #3b82f6; }
        .cli-grad { background-image: linear-gradient(100deg, var(--cli-a), var(--cli-b) 55%, var(--cli-c)); transition: filter .15s; }
        .cli-grad:hover { filter: brightness(1.1); }
        .cli-chu { background-image: linear-gradient(100deg, var(--cli-a), var(--cli-c)); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .cli-vien { background-image: linear-gradient(100deg, var(--cli-a), var(--cli-c)); }
        .cli-nhan { background: rgba(139, 92, 246, .15); color: var(--cli-a); }
        .cli code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: .92em; overflow-wrap: anywhere; }
        .cli kbd { font-family: inherit; font-size: .9em; padding: 0 .35em; border: 1px solid var(--border-color); border-radius: 4px; white-space: nowrap; }
        .cli a:not([class]) { color: var(--cli-a); }
        .cli a:not([class]):hover { text-decoration: underline; }
        @keyframes cliNhay { 50% { opacity: 0; } }
        .cli-con-tro { animation: cliNhay 1.1s steps(1) infinite; }
        @media (prefers-reduced-motion: reduce) { .cli-con-tro { animation: none; } }
      `}</style>

      {/* ── Đầu trang ─────────────────────────────────────────── */}
      <header className="grid items-center gap-10 lg:grid-cols-2">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">
            <Terminal size={16} aria-hidden className="text-[var(--cli-a)]" /> CuongMini CLI
            <span className="cli-nhan rounded-md px-1.5 py-0.5 text-[10px] tracking-normal">Mới</span>
          </p>
          <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            AI lập trình <span className="cli-chu">ngay trong terminal</span>
          </h1>
          <p className="mt-4 max-w-xl text-[var(--text-secondary)] sm:text-lg">
            Gõ <code>cuongmini</code> trong thư mục dự án rồi giao việc bằng tiếng Việt. AI đọc code, sửa file
            (có diff để duyệt), chạy lệnh, lập kế hoạch — đúng bộ máy AI Code của app CuongThai, không cần mở
            trình soạn hay app nào.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a href="#cai-dat" className="cli-grad inline-flex items-center gap-2 rounded-xl px-5 py-3 font-semibold text-white">
              <Download size={17} aria-hidden /> Cài trong 1 phút
            </a>
            <a
              href="#huong-dan"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-color)] px-5 py-3 text-sm font-medium transition hover:border-[var(--cli-a)]"
            >
              Hướng dẫn sử dụng <ArrowRight size={15} aria-hidden />
            </a>
          </div>
          <div className="mt-5 space-y-2">
            <DongLenh lenh={laWin ? LENH_CLI_WINDOWS : LENH_CLI_UNIX} dauNhac={laWin ? 'PS>' : '$'} />
            <p className="text-xs text-[var(--text-secondary)]">
              macOS · Windows · Linux. Dùng được với tài khoản <Link href="/pro">Pro</Link> hoặc{' '}
              <Link href="/llm-key">key terminal</Link> còn hạn.
            </p>
          </div>
        </div>
        <AnhTerminal />
      </header>

      {/* ── Mục lục nhanh ─────────────────────────────────────── */}
      <nav aria-label="Mục lục" className="mt-12 flex flex-wrap gap-2 text-sm">
        {[
          ['#ai-dung-duoc', 'Ai dùng được'],
          ['#cai-dat', 'Cài đặt'],
          ['#loi-hay-gap', 'Lỗi hay gặp'],
          ['#huong-dan', 'Hướng dẫn sử dụng'],
          ['#lenh', 'Lệnh /'],
          ['#che-do', 'Chế độ quyền'],
          ['#so-sanh', 'So với OpenCode'],
          ['#go-cai', 'Cập nhật & gỡ cài'],
        ].map(([href, chu]) => (
          <a key={href} href={href} className="rounded-full border border-[var(--border-color)] px-3 py-1 text-[var(--text-secondary)] transition hover:border-[var(--cli-a)] hover:text-[var(--text-primary)]">
            {chu}
          </a>
        ))}
      </nav>

      {/* ── Ai dùng được ──────────────────────────────────────── */}
      <section className="mt-16">
        <TieuDeMuc
          id="ai-dung-duoc"
          moTa={<>Cài CLI miễn phí. Phần AI chạy khi tài khoản đăng nhập có <strong>một trong hai</strong> thứ dưới — hạn mức tính chung một ví với app desktop và extension.</>}
        >
          Ai dùng được
        </TieuDeMuc>
        <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <li className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
            <Crown size={20} aria-hidden className="text-amber-500" />
            <h3 className="mt-2 font-semibold">Tài khoản Pro</h3>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">Đăng nhập là dùng — không cần xin gì thêm.</p>
            <Link href="/pro" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[var(--cli-a)] hover:underline">
              Xem gói Pro <ArrowRight size={14} aria-hidden />
            </Link>
          </li>
          <li className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
            <KeyRound size={20} aria-hidden className="text-emerald-500" />
            <h3 className="mt-2 font-semibold">Key terminal đã duyệt</h3>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Xin key, admin duyệt, còn hạn là dùng được. Không phải dán key vào đâu — chỉ cần đăng nhập đúng tài khoản đã được cấp.
            </p>
            <Link href="/llm-key" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[var(--cli-a)] hover:underline">
              Xin key terminal <ArrowRight size={14} aria-hidden />
            </Link>
          </li>
          <li className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
            <ShoppingBag size={20} aria-hidden className="text-violet-500" />
            <h3 className="mt-2 font-semibold">Mua key ở shop</h3>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">Key về tài khoản ngay sau khi thanh toán, dùng tới hết hạn gói.</p>
            <Link href="/shop" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[var(--cli-a)] hover:underline">
              Tới shop <ArrowRight size={14} aria-hidden />
            </Link>
          </li>
        </ul>
      </section>

      {/* ── Cài đặt ───────────────────────────────────────────── */}
      <section className="mt-20">
        <TieuDeMuc
          id="cai-dat"
          moTa="Viết cho máy mới tinh, chưa từng mở terminal. Trang đã chọn sẵn hệ điều hành của bạn — sai thì bấm đổi."
        >
          Cài đặt từng bước
        </TieuDeMuc>

        <div className="mt-6 inline-flex rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-1 text-sm" role="tablist" aria-label="Hệ điều hành">
          {TAB_HDH.map((t) => (
            <button
              key={t.ma}
              type="button"
              role="tab"
              aria-selected={hdh === t.ma}
              onClick={() => setHdh(t.ma)}
              className={`rounded-lg px-4 py-1.5 font-medium transition ${hdh === t.ma ? 'cli-grad text-white' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            >
              {t.ten}
            </button>
          ))}
        </div>

        <ol className="mt-6 space-y-3" role="tabpanel">
          {buoc.map((b, i) => (
            <li key={b.tieuDe} className="flex min-w-0 gap-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 sm:p-5">
              <span className="cli-grad inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white">{i + 1}</span>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold">{b.tieuDe}</h3>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">{b.moTa}</p>
                {b.lenh && <div className="mt-3"><DongLenh lenh={b.lenh} dauNhac={b.dauNhac} /></div>}
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-4 flex min-w-0 items-start gap-3 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-4 text-sm text-[var(--text-secondary)]">
          <Plug size={18} aria-hidden className="mt-0.5 shrink-0 text-[var(--cli-a)]" />
          <p>
            <strong className="text-[var(--text-primary)]">Có app desktop CuongThai?</strong> Trong app có nút cài CuongMini CLI —
            cài và đăng nhập sẵn bằng tài khoản đang mở trong app, khỏi gõ lệnh nào.{' '}
            <Link href="/download">Tải app</Link>
          </p>
        </div>
      </section>

      {/* ── Lỗi hay gặp ───────────────────────────────────────── */}
      <section className="mt-16">
        <TieuDeMuc id="loi-hay-gap">Lỗi hay gặp &amp; cách sửa</TieuDeMuc>
        <div className="mt-4 divide-y divide-[var(--border-color)] rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)]">
          {LOI_HAY_GAP.map(({ hoi, dap }) => (
            <details key={hoi} className="group px-5 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-medium">
                <span className="min-w-0">{hoi}</span>
                <ChevronDown size={16} aria-hidden className="shrink-0 text-[var(--text-secondary)] transition group-open:rotate-180" />
              </summary>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">{dap}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── Hướng dẫn sử dụng ─────────────────────────────────── */}
      <section className="mt-20">
        <TieuDeMuc id="huong-dan" moTa="Từ lần mở đầu tiên tới những phím tắt dùng hằng ngày.">
          Hướng dẫn sử dụng
        </TieuDeMuc>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <TheHuongDan icon={LogIn} tieuDe="1. Đăng nhập lần đầu">
            <p>
              Gõ <code>cuongmini</code>, chọn bằng phím ↑↓ (hoặc số 1–4) rồi <kbd>Enter</kbd>:
            </p>
            <ul className="list-inside list-disc space-y-1">
              <li><strong>Google / GitHub / Apple</strong> — trình duyệt mở ra, đăng nhập xong tự quay về terminal.</li>
              <li><strong>Tên đăng nhập + mật khẩu</strong> — ô mật khẩu không hiện ký tự, cứ gõ rồi Enter.</li>
            </ul>
            <p>
              Phiên lưu ở <code>~/.cuongmini/phien.json</code> (chỉ bạn đọc được), tự làm mới — lần sau mở là vào thẳng.
              Đổi tài khoản: <code>/login</code>; đăng xuất: <code>cuongmini logout</code>.
            </p>
          </TheHuongDan>

          <TheHuongDan icon={Brain} tieuDe="2. Giao việc bằng tiếng Việt">
            <p>Gõ như nói với một đồng nghiệp rồi <kbd>Enter</kbd>. Vài câu mở đầu hay:</p>
            <DongLenh lenh="giải thích cấu trúc dự án này" dauNhac=">" khongChep />
            <DongLenh lenh="sửa lỗi build rồi chạy lại cho tới khi xanh" dauNhac=">" khongChep />
            <p>
              Việc lớn thì AI tự lập kế hoạch và tích dần từng bước. Muốn duyệt trước khi AI đụng vào file: <code>/plan &lt;việc&gt;</code>.
              Đang chạy mà muốn dừng: <kbd>esc</kbd>.
            </p>
          </TheHuongDan>

          <TheHuongDan icon={AtSign} tieuDe="3. Nhắc file bằng @ và gửi ảnh">
            <p>
              Gõ <code>@</code> là hiện gợi ý file/thư mục trong dự án (tìm mờ, đọc theo <code>git ls-files</code>) —
              <kbd>Tab</kbd> để chèn <code>@đường/dẫn</code>. AI sẽ đọc đúng file đó.
            </p>
            <p>
              Gửi ảnh: gõ <code>@anh.png</code> hoặc <strong>kéo file ảnh thả vào terminal</strong> (terminal dán đường dẫn) —
              ảnh HEIC của iPhone cũng được, CLI tự chuyển đổi.
            </p>
          </TheHuongDan>

          <TheHuongDan icon={ShieldCheck} tieuDe="4. Thẻ duyệt">
            <p>
              Ở chế độ có hỏi, mỗi lần AI muốn sửa file hay chạy lệnh sẽ hiện một thẻ ngay trong luồng: diff tô màu, hoặc
              lệnh kèm lý do rủi ro.
            </p>
            <ul className="space-y-1">
              <li><kbd>1</kbd> cho phép · <kbd>2</kbd> cho phép cả việc này · <kbd>3</kbd> từ chối</li>
              <li>Hoặc ↑↓ rồi <kbd>Enter</kbd>; <kbd>esc</kbd> = từ chối.</li>
            </ul>
            <p>Đã lỡ “luôn cho phép” một lệnh? <code>/quyen</code> để xem và thu hồi.</p>
          </TheHuongDan>

          <TheHuongDan icon={ListChecks} tieuDe="5. Bảng kế hoạch">
            <p>
              Bảng <strong>📋 Kế hoạch</strong> nằm ở cột phải khi terminal rộng từ 110 cột (hẹp hơn thì nằm trên ô nhập):
              việc ☐ ◐ ☑, “Đang làm” (kèm lệnh đang chạy), file đã sửa (+/−), số bước, thời gian.
            </p>
            <p><kbd>ctrl+p</kbd> ẩn/hiện bảng. Đầu ra lệnh dài bị thu gọn còn vài dòng — <kbd>ctrl+o</kbd> để xem đủ.</p>
          </TheHuongDan>

          <TheHuongDan icon={RefreshCw} tieuDe="6. Làm tiếp việc cũ">
            <p>
              Việc được lưu theo thư mục. <code>cuongmini -c</code> mở lại việc gần nhất của thư mục đang đứng; trong phiên
              thì <code>/resume</code> hiện bảng chọn việc cũ.
            </p>
            <p>
              Lỡ tay: <code>/undo</code> hoàn tác mọi file AI đã sửa trong việc này, <code>/rewind</code> quay về một câu hỏi trước
              (cắt hội thoại + lùi file về mốc đó).
            </p>
          </TheHuongDan>
        </div>

        {/* Phím tắt */}
        <div className="mt-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
          <h3 className="font-semibold">Phím tắt</h3>
          <dl className="mt-3 grid grid-cols-1 gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
            {PHIM_TAT.map(([phim, tacDung]) => (
              <div key={phim} className="flex min-w-0 items-baseline gap-3">
                <dt className="w-40 shrink-0"><kbd>{phim}</kbd></dt>
                <dd className="min-w-0 text-[var(--text-secondary)]">{tacDung}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Lệnh / ────────────────────────────────────────────── */}
      <section className="mt-16">
        <TieuDeMuc
          id="lenh"
          moTa={<>Gõ <code>/</code> là hiện gợi ý, gõ tiếp để lọc. Cùng bộ lệnh với app desktop và extension VS Code; lệnh tự tạo của dự án (<code>.claude/commands/*.md</code>) cũng hiện trong gợi ý.</>}
        >
          <span className="inline-flex items-center gap-2"><Slash size={24} aria-hidden className="text-[var(--cli-a)]" /> Lệnh gạch chéo</span>
        </TieuDeMuc>
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {NHOM_LENH.map((nhom) => (
            <div key={nhom.ten} className="min-w-0 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
              <h3 className="font-semibold">{nhom.ten}</h3>
              <dl className="mt-3 space-y-2 text-sm">
                {nhom.lenh.map(([lenh, mo]) => (
                  <div key={lenh} className="grid min-w-0 grid-cols-[minmax(0,9.5rem)_minmax(0,1fr)] gap-3">
                    <dt><code className="text-[var(--cli-a)]">{lenh}</code></dt>
                    <dd className="text-[var(--text-secondary)]">{mo}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </section>

      {/* ── Chế độ quyền ──────────────────────────────────────── */}
      <section className="mt-16">
        <TieuDeMuc
          id="che-do"
          moTa={<><kbd>shift+tab</kbd> xoay vòng theo thứ tự dưới. Mở sẵn một chế độ: <code>cuongmini --che-do tu-sua</code>.</>}
        >
          5 chế độ quyền
        </TieuDeMuc>
        <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CHE_DO.map((c) => (
            <li key={c.co} className="min-w-0 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4">
              <p className="font-semibold">
                <span style={{ color: c.mau }} aria-hidden>{c.icon}</span> {c.ten}
              </p>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">{c.mo}</p>
              <p className="mt-2 text-xs text-[var(--text-secondary)]"><code>--che-do {c.co}</code></p>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Chạy không tương tác ──────────────────────────────── */}
      <section className="mt-16">
        <TieuDeMuc
          id="lenh-dong"
          moTa={<>Ngoài phiên tương tác, CLI chạy được một lượt rồi thoát — tiện cho script và git hook. Chế độ mặc định ở <code>-p</code> vẫn là chỉ đọc.</>}
        >
          Dùng trong script: <code className="cli-chu">-p</code>, <code className="cli-chu">-c</code> và các cờ
        </TieuDeMuc>
        <div className="mt-6 space-y-2">
          <DongLenh lenh={'cuongmini "giải thích dự án"'} />
          <DongLenh lenh={'cuongmini -p "tóm tắt git diff" > tom-tat.md'} />
          <DongLenh lenh={'git diff | cuongmini -p "soát diff này"'} />
          <DongLenh lenh="cuongmini -c" />
        </div>
        <dl className="mt-4 grid grid-cols-1 gap-x-8 gap-y-2 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 text-sm sm:grid-cols-2">
          {[
            ['-p, --in', 'Chế độ in: chạy một lượt, in kết quả ra stdout rồi thoát'],
            ['-c, --tiep-tuc', 'Mở lại việc gần nhất của thư mục này'],
            ['-m, --model <tên>', 'Chọn model: sonnet-5 · opus-4-8 · gpt-sol'],
            ['--che-do <chế độ>', 'ke-hoach · hoi · tu-sua · tu-dong · bo-qua-het'],
            ['-C, --thu-muc <đường>', 'Làm việc ở thư mục khác thư mục đang đứng'],
            ['-v · -h', 'In phiên bản · in trợ giúp'],
          ].map(([co, mo]) => (
            <div key={co} className="grid min-w-0 grid-cols-[minmax(0,10rem)_minmax(0,1fr)] gap-3">
              <dt><code>{co}</code></dt>
              <dd className="text-[var(--text-secondary)]">{mo}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ── So với OpenCode ───────────────────────────────────── */}
      <section className="mt-20">
        <TieuDeMuc
          id="so-sanh"
          moTa="Trước đây “CuongMini trên terminal” nghĩa là cắm key vào OpenCode. Từ nay đường chính là CuongMini CLI."
        >
          Vì sao chuyển từ OpenCode
        </TieuDeMuc>
        <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)]">
          <div className="hidden grid-cols-[10rem_1fr_1fr] gap-4 border-b border-[var(--border-color)] px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)] sm:grid">
            <span />
            <span>OpenCode + key (cũ)</span>
            <span className="text-[var(--cli-a)]">CuongMini CLI</span>
          </div>
          {SO_SANH.map(([muc, cu, moi]) => (
            <div key={muc} className="grid grid-cols-1 gap-1 border-b border-[var(--border-color)] px-5 py-3 text-sm last:border-0 sm:grid-cols-[10rem_1fr_1fr] sm:gap-4">
              <span className="font-medium">{muc}</span>
              <span className="text-[var(--text-secondary)]"><span className="sm:hidden">Cũ: </span>{cu}</span>
              <span className="flex min-w-0 items-start gap-1.5">
                <Check size={15} aria-hidden className="mt-0.5 shrink-0 text-emerald-500" />
                <span className="min-w-0">{moi}</span>
              </span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-[var(--text-secondary)]">
          <strong className="text-[var(--text-primary)]">Đang dùng OpenCode?</strong> Key cũ vẫn chạy tới hết hạn — không ai bị cắt
          ngang. Hướng dẫn cũ vẫn còn ở <Link href="/llm-key">/llm-key</Link> (mục “Cách cũ”). Muốn chuyển: cài CLI, đăng nhập
          đúng tài khoản đã được cấp key là dùng được, không cần dán key.
        </p>
      </section>

      {/* ── Cập nhật & gỡ cài ─────────────────────────────────── */}
      <section className="mt-16">
        <TieuDeMuc id="go-cai">Cập nhật &amp; gỡ cài</TieuDeMuc>
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <TheHuongDan icon={RefreshCw} tieuDe="Cập nhật">
            <p>
              <strong>Chạy lại đúng lệnh cài</strong> — nó tải bản mới nhất đè lên bản cũ, giữ nguyên đăng nhập và việc đã lưu.
              CLI tự kiểm bản mới (tối đa một lần mỗi ngày) và nhắc ngay trên màn mở đầu.
            </p>
            <DongLenh lenh={laWin ? LENH_CLI_WINDOWS : LENH_CLI_UNIX} dauNhac={laWin ? 'PS>' : '$'} />
          </TheHuongDan>
          <TheHuongDan icon={Trash2} tieuDe={`Gỡ cài (${TAB_HDH.find((t) => t.ma === hdh)?.ten})`}>
            {laWin ? (
              <>
                <p>Trong PowerShell: xoá dữ liệu + lệnh, rồi bỏ thư mục lệnh khỏi PATH người dùng.</p>
                <DongLenh lenh={'Remove-Item -Recurse -Force "$env:USERPROFILE\\.cuongmini", "$env:LOCALAPPDATA\\CuongMini"'} dauNhac="PS>" />
                <DongLenh
                  lenh={"$p = [Environment]::GetEnvironmentVariable('Path','User'); [Environment]::SetEnvironmentVariable('Path', (($p -split ';') | Where-Object { $_ -and $_ -notlike '*CuongMini\\bin*' }) -join ';', 'User')"}
                  dauNhac="PS>"
                />
              </>
            ) : (
              <>
                <p>Xoá dữ liệu + lệnh (bí danh <code>cm</code> chỉ xoá nếu nó là của CuongMini):</p>
                <DongLenh lenh={'rm -rf ~/.cuongmini ~/.local/bin/cuongmini; [ "$(readlink ~/.local/bin/cm)" = "$HOME/.local/bin/cuongmini" ] && rm ~/.local/bin/cm'} />
                <p>
                  Rồi mở <code>{hdh === 'macos' ? '~/.zshrc' : '~/.bashrc'}</code> xoá hai dòng ngay dưới chú thích{' '}
                  <code># CuongMini CLI</code>. Dùng fish thì xoá <code>~/.config/fish/conf.d/cuongmini.fish</code>.
                </p>
              </>
            )}
            <p className="text-xs">Phiên đăng nhập, lịch sử câu đã gửi và việc đã lưu đều nằm trong thư mục <code>.cuongmini</code> nên đi cùng luôn.</p>
          </TheHuongDan>
        </div>
      </section>

      {/* ── Lời cuối ──────────────────────────────────────────── */}
      <section className="mt-20 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold">Thích làm trong trình soạn code hơn?</h2>
            <p className="mt-2 text-[var(--text-secondary)]">
              Cùng bộ máy đó có sẵn dạng extension cho VS Code, Cursor, Antigravity, Windsurf, VSCodium — và trong app desktop.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/ai-code" className="cli-grad inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white">
              <FolderOpen size={16} aria-hidden /> Extension AI Code
            </Link>
            <Link href="/download" className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-color)] px-5 py-3 text-sm font-medium transition hover:border-[var(--cli-a)]">
              <Download size={16} aria-hidden /> App desktop
            </Link>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-[var(--border-color)] pt-4 text-sm text-[var(--text-secondary)]">
          <Link href="/llm-key" className="inline-flex items-center gap-1.5 hover:text-[var(--text-primary)]"><KeyRound size={14} aria-hidden /> Xin key terminal</Link>
          <Link href="/kiem-tra-key" className="inline-flex items-center gap-1.5 hover:text-[var(--text-primary)]"><Gauge size={14} aria-hidden /> Kiểm tra hạn mức key</Link>
          <Link href="/pro" className="inline-flex items-center gap-1.5 hover:text-[var(--text-primary)]"><Crown size={14} aria-hidden /> Gói Pro</Link>
          <Link href="/courses" className="inline-flex items-center gap-1.5 hover:text-[var(--text-primary)]"><BookOpen size={14} aria-hidden /> Khoá học</Link>
        </div>
      </section>
    </main>
  );
}
