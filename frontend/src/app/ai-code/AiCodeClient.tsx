'use client';

/**
 * /ai-code — phần chạy ở trình duyệt.
 *
 * Client vì hai thứ cần `window`: đoán hệ điều hành (chọn sẵn lệnh cài CLI đúng
 * máy) và đoán deep link có mở được trình soạn hay không. Nội dung chữ vẫn có
 * trong HTML dựng sẵn nên không mất gì cho SEO.
 */
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight, AtSign, Bot, Check, ChevronDown, Copy, ExternalLink, FolderInput, History,
  Laptop, Lightbulb, ListChecks, LogIn, Mic, Plug, ShieldCheck, Slash, Terminal,
} from 'lucide-react';
import { detectPlatform } from '../download/DownloadClient';
import {
  DANH_SACH_TRINH_SOAN, LENH_CHAY_CLI, LENH_CLI_UNIX, LENH_CLI_WINDOWS, LINK_CHO_MS,
  LINK_OPEN_VSX, MA_EXTENSION, type MaTrinhSoan, type TrinhSoan,
} from './trinhSoan';

/** Nút chép có trạng thái "Đã chép" tự hết sau 2 giây — để bấm lần hai vẫn thấy phản hồi. */
function NutChep({ chu, nhan = 'Chép' }: { chu: string; nhan?: string }) {
  const [daChep, setDaChep] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard.writeText(chu).then(() => {
          setDaChep(true);
          setTimeout(() => setDaChep(false), 2000);
        });
      }}
      className="inline-flex shrink-0 items-center gap-1 rounded-md bg-white/10 px-2.5 py-1 text-xs font-medium text-[#e6e8ee] transition hover:bg-white/20"
      aria-label={`Chép: ${chu}`}
    >
      {daChep ? <Check size={13} aria-hidden /> : <Copy size={13} aria-hidden />}
      {daChep ? 'Đã chép' : nhan}
    </button>
  );
}

/** Một dòng lệnh trong khung tối — màu cố định, đọc được ở cả theme sáng lẫn tối. */
function DongLenh({ lenh, dauNhac = '$' }: { lenh: string; dauNhac?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-[#0f1117] px-3.5 py-2.5 font-mono text-[13px] text-[#e6e8ee]">
      <span className="select-none text-[#7c8496]" aria-hidden>{dauNhac}</span>
      <code className="min-w-0 flex-1 whitespace-pre-wrap break-all">{lenh}</code>
      <NutChep chu={lenh} />
    </div>
  );
}

/** Biểu tượng chữ tự vẽ cho từng trình soạn — cố ý KHÔNG chép logo thương hiệu của hãng. */
function BieuTuongChu({ ts, co = 44 }: { ts: TrinhSoan; co?: number }) {
  return (
    <span
      aria-hidden
      className="inline-flex shrink-0 items-center justify-center rounded-xl font-bold text-white shadow-sm"
      style={{
        width: co,
        height: co,
        fontSize: co * 0.36,
        backgroundImage: `linear-gradient(135deg, ${ts.mau[0]}, ${ts.mau[1]})`,
      }}
    >
      {ts.chuTat}
    </span>
  );
}

/**
 * Thẻ một trình soạn.
 *
 * Deep link mở được hay không, trình duyệt KHÔNG báo — trình soạn chưa cài thì
 * bấm nút là im lặng. Nên sau ~2 giây mà trang chưa mất tiêu điểm (dấu hiệu app
 * đã bật lên) thì tự mở phần hướng dẫn tay, thay vì để người dùng bấm mãi.
 */
function TheTrinhSoan({ ts, moSan, datMo }: { ts: TrinhSoan; moSan: boolean; datMo: (m: MaTrinhSoan | null) => void }) {
  const henGio = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (henGio.current) clearTimeout(henGio.current); }, []);

  const thuMo = () => {
    let daRoiTrang = false;
    const khiRoi = () => { daRoiTrang = true; };
    window.addEventListener('blur', khiRoi, { once: true });
    document.addEventListener('visibilitychange', khiRoi, { once: true });
    if (henGio.current) clearTimeout(henGio.current);
    henGio.current = setTimeout(() => {
      window.removeEventListener('blur', khiRoi);
      document.removeEventListener('visibilitychange', khiRoi);
      if (!daRoiTrang) datMo(ts.ma);
    }, 2000);
  };

  return (
    <li className="cmc-the flex min-w-0 flex-col rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
      <div className="flex items-center gap-3">
        <BieuTuongChu ts={ts} />
        <div className="min-w-0">
          <h3 className="font-semibold text-[var(--text-primary)]">{ts.ten}</h3>
          <p className="text-xs text-[var(--text-secondary)]">qua {ts.tenCho}</p>
        </div>
      </div>
      <p className="mt-3 flex-1 text-sm text-[var(--text-secondary)]">{ts.moTa}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <a
          href={ts.deepLink}
          onClick={thuMo}
          className="cmc-grad inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-white"
        >
          Cài vào {ts.ten}
        </a>
        <a
          href={ts.linkCho}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-xl border border-[var(--border-color)] px-3 py-2 text-xs text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
        >
          {ts.tenCho} <ExternalLink size={12} aria-hidden />
        </a>
      </div>

      <button
        type="button"
        onClick={() => datMo(moSan ? null : ts.ma)}
        className="mt-3 inline-flex items-center gap-1 self-start text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        aria-expanded={moSan}
      >
        Nút không mở được? Cài tay
        <ChevronDown size={13} aria-hidden className={moSan ? 'rotate-180 transition' : 'transition'} />
      </button>

      {moSan && (
        <div className="mt-2 space-y-2 rounded-xl bg-[var(--bg-surface)] p-3 text-xs text-[var(--text-secondary)]">
          <p>
            Chưa có {ts.ten} thì cài nó trước. Trình duyệt có thể hỏi “Mở {ts.ten}?” — bấm <strong>Mở</strong>.
            Hoặc làm tay:
          </p>
          <ol className="list-inside list-decimal space-y-1">
            <li>Mở {ts.ten} → <strong>Extensions</strong> (<kbd>Ctrl/Cmd+Shift+X</kbd>).</li>
            <li>Gõ <strong>CuongMini</strong> (hoặc <code>{MA_EXTENSION}</code>) → <strong>Install</strong>.</li>
          </ol>
          {ts.ghiChu && <p>{ts.ghiChu}</p>}
          {ts.lenhCli && (
            <>
              <p>Hoặc một lệnh trong terminal:</p>
              <DongLenh lenh={ts.lenhCli} />
            </>
          )}
        </div>
      )}
    </li>
  );
}

const TINH_NANG: { icon: typeof Bot; tieuDe: string; moTa: React.ReactNode }[] = [
  { icon: LogIn, tieuDe: 'Chạy không cần app', moTa: 'Đăng nhập bằng tài khoản cuongthai.com (Google, GitHub, Apple hoặc mật khẩu) là dùng được ngay.' },
  { icon: Plug, tieuDe: 'Tự nối với app desktop', moTa: 'App CuongThai đang mở thì extension chạy qua app: chung việc, chung quyền, chung vé dự phòng.' },
  { icon: History, tieuDe: 'Lịch sử việc', moTa: 'Mở lại việc cũ, ghim, đổi tên, xoá — làm tiếp đúng chỗ đang dừng.' },
  { icon: Slash, tieuDe: 'Gõ / ra đủ bộ lệnh', moTa: <><code>/plan</code> <code>/review</code> <code>/init</code> <code>/rewind</code> <code>/compact</code> <code>/model</code>… cộng lệnh riêng của dự án.</> },
  { icon: AtSign, tieuDe: '@ file, thư mục, hàm', moTa: 'Nhắc đúng file hay hàm/lớp trong dự án bằng tìm mờ, kèm cả đoạn đang bôi đen.' },
  { icon: FolderInput, tieuDe: 'Kéo thả & dán ảnh', moTa: 'Thả file/thư mục vào ô chat, dán ảnh chụp màn hình — cả ảnh HEIC của iPhone.' },
  { icon: ShieldCheck, tieuDe: '5 chế độ quyền', moTa: 'Từ “Lập kế hoạch” tới “Bỏ qua tất cả”. Sửa file, chạy lệnh, đẩy GitHub đều qua thẻ duyệt.' },
  { icon: Mic, tieuDe: 'Nói thay vì gõ', moTa: 'Bấm mic, nói tiếng Việt — chữ hiện vào ô chat.' },
  { icon: Lightbulb, tieuDe: 'Sửa lỗi ngay tại chỗ', moTa: 'Bóng đèn vàng “Nhờ CuongMini sửa lỗi này”; chuột phải đoạn code để hỏi AI.' },
];

export default function AiCodeClient() {
  const [dangMo, setDangMo] = useState<MaTrinhSoan | null>(null);
  const [heCli, setHeCli] = useState<'unix' | 'windows'>('unix');

  useEffect(() => {
    if (detectPlatform() === 'windows') setHeCli('windows');
  }, []);

  const vscode = DANH_SACH_TRINH_SOAN[0];

  return (
    <main className="cmc mx-auto max-w-5xl px-4 pb-24 pt-24 text-[var(--text-primary)] sm:px-6">
      <style>{`
        .cmc { --cmc-a: #8b5cf6; --cmc-b: #6d28d9; --cmc-c: #2563eb; }
        .cmc-grad { background-image: linear-gradient(100deg, var(--cmc-a), var(--cmc-b) 55%, var(--cmc-c)); transition: filter .15s; }
        .cmc-grad:hover { filter: brightness(1.1); }
        .cmc-chu { background-image: linear-gradient(100deg, var(--cmc-a), var(--cmc-c)); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .cmc-nhan { background: rgba(139, 92, 246, .15); color: var(--cmc-a); }
        .cmc-the { transition: border-color .15s, transform .15s; }
        .cmc-the:hover { border-color: var(--cmc-a); }
        .cmc code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: .92em; }
        .cmc kbd { font-family: inherit; font-size: .92em; padding: 0 .3em; border: 1px solid var(--border-color); border-radius: 4px; }
      `}</style>

      {/* ── Đầu trang ─────────────────────────────────────────── */}
      <header className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <div className="flex items-center gap-3">
            <img src="/images/cuongmini-code/icon.png" alt="" width={56} height={56} className="h-14 w-14 rounded-2xl" />
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">
              CuongMini Code · extension chính thức
            </p>
          </div>
          <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            AI Code của CuongThai, <span className="cmc-chu">ngay trong trình soạn code</span> của bạn
          </h1>
          <p className="mt-4 max-w-xl text-[var(--text-secondary)] sm:text-lg">
            Chat tiếng Việt một bên, AI đọc và sửa code trong thư mục bạn đang mở, chạy lệnh, dùng skill, MCP và
            đưa dự án lên GitHub. Cài bằng một cú bấm vào VS Code, Cursor, Antigravity, Windsurf, VSCodium — hoặc
            một dòng lệnh cho terminal.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a href={vscode.deepLink} className="cmc-grad inline-flex items-center gap-2 rounded-xl px-5 py-3 font-semibold text-white">
              Cài vào VS Code
            </a>
            <a
              href="#trinh-soan"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-color)] px-5 py-3 text-sm font-medium transition hover:border-[var(--cmc-a)]"
            >
              Trình soạn khác / Terminal <ArrowRight size={15} aria-hidden />
            </a>
          </div>
          <p className="mt-3 text-xs text-[var(--text-secondary)]">
            AI Code cần <Link href="/pro" className="text-[var(--cmc-a)] hover:underline">gói Pro</Link> hoặc <Link href="/llm-key" className="text-[var(--cmc-a)] hover:underline">key terminal</Link> còn hạn.
            Có sẵn trên{' '}
            <a href={LINK_CHO_MS} target="_blank" rel="noopener noreferrer" className="hover:underline">VS Code Marketplace</a>
            {' '}và{' '}
            <a href={LINK_OPEN_VSX} target="_blank" rel="noopener noreferrer" className="hover:underline">Open VSX</a>.
          </p>
        </div>

        {/* Ảnh minh hoạ dựng bằng CSS — không phải ảnh chụp, nên không bao giờ cũ so với bản thật về màu chủ đề. */}
        <div aria-hidden className="overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[#14161d] text-[12px] text-[#c9cfdb] shadow-xl">
          <div className="flex items-center gap-1.5 border-b border-white/5 px-3 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-3 text-[11px] text-[#7c8496]">du-an-cua-ban — auth.ts</span>
          </div>
          <div className="flex">
            <div className="flex w-10 flex-col items-center gap-3 border-r border-white/5 py-3">
              <img src="/images/cuongmini-code/icon.png" alt="" width={22} height={22} className="h-[22px] w-[22px] rounded-md" />
              <span className="h-4 w-4 rounded bg-white/10" />
              <span className="h-4 w-4 rounded bg-white/10" />
            </div>
            <div className="hidden min-w-0 flex-1 space-y-1 overflow-hidden whitespace-nowrap p-3 font-mono text-[11px] sm:block">
              <p><span className="text-[#c792ea]">function</span> <span className="text-[#82aaff]">dangNhap</span>(e) {'{'}</p>
              <p className="pl-3"><span className="text-[#c792ea]">const</span> u = tim(e)</p>
              <p className="rounded bg-[#ff5f57]/15 pl-3">return u.token</p>
              <p className="pl-3 text-[#ff8a80]">// ⚠ u có thể null</p>
              <p>{'}'}</p>
            </div>
            <div className="w-full min-w-0 space-y-2 border-l border-white/5 p-3 sm:w-[52%]">
              <p className="text-[11px] font-semibold text-white">CuongMini Code</p>
              <div className="ml-auto max-w-[90%] rounded-lg bg-[#6d28d9] px-2.5 py-1.5 text-white">
                Sửa lỗi null ở <span className="rounded bg-white/20 px-1">@dangNhap</span>
              </div>
              <div className="rounded-lg bg-white/5 px-2.5 py-2">
                <p className="mb-1 flex items-center gap-1 text-[11px] text-[#a5b4fc]"><ListChecks size={12} /> Kế hoạch</p>
                <p>✓ Đọc auth.ts</p>
                <p>✓ Thêm kiểm tra user rỗng</p>
                <p className="text-[#7c8496]">◻ Chạy test</p>
              </div>
              <p className="text-[10px] text-[#7c8496]">Đang code… (8s · bước 3)</p>
            </div>
          </div>
        </div>
      </header>

      {/* ── Chọn nơi cài ──────────────────────────────────────── */}
      <section id="trinh-soan" className="mt-20 scroll-mt-24">
        <h2 className="text-2xl font-bold sm:text-3xl">Chọn nơi bạn code</h2>
        <p className="mt-2 max-w-2xl text-[var(--text-secondary)]">
          Bấm “Cài vào …” — trình soạn sẽ mở thẳng trang extension, bạn chỉ còn bấm <strong>Install</strong>.
          Cùng một extension cho mọi trình soạn họ VS Code.
        </p>
        <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DANH_SACH_TRINH_SOAN.map((ts) => (
            <TheTrinhSoan key={ts.ma} ts={ts} moSan={dangMo === ts.ma} datMo={setDangMo} />
          ))}

          {/* Thẻ CLI */}
          <li className="cmc-the flex min-w-0 flex-col rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
            <div className="flex items-center gap-3">
              <span aria-hidden className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#0f1117] text-[#a5b4fc]">
                <Terminal size={22} />
              </span>
              <div>
                <h3 className="flex items-center gap-2 font-semibold">
                  Terminal <span className="cmc-nhan rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase">Mới</span>
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">CuongMini CLI</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-[var(--text-secondary)]">
              Không dùng trình soạn nào? Giao việc cho AI ngay trong terminal, ở bất kỳ thư mục dự án nào.
            </p>
            <div className="mt-3 inline-flex self-start rounded-lg border border-[var(--border-color)] p-0.5 text-xs" role="tablist">
              {(['unix', 'windows'] as const).map((he) => (
                <button
                  key={he}
                  type="button"
                  role="tab"
                  aria-selected={heCli === he}
                  onClick={() => setHeCli(he)}
                  className={`rounded-md px-2.5 py-1 transition ${heCli === he ? 'bg-[var(--bg-surface)] font-semibold text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}
                >
                  {he === 'unix' ? 'macOS / Linux' : 'Windows'}
                </button>
              ))}
            </div>
            <div className="mt-2 space-y-2">
              {heCli === 'unix'
                ? <DongLenh lenh={LENH_CLI_UNIX} />
                : <DongLenh lenh={LENH_CLI_WINDOWS} dauNhac="PS>" />}
              <p className="text-xs text-[var(--text-secondary)]">Cài xong, mở terminal trong thư mục dự án rồi chạy:</p>
              <DongLenh lenh={LENH_CHAY_CLI} />
            </div>
            {/* Trang /cli có hướng dẫn cho máy mới tinh, lệnh /, phím tắt — thẻ này chỉ đủ chỗ cho lệnh cài. */}
            <Link href="/cli" className="mt-3 inline-flex items-center gap-1 self-start text-xs font-medium text-[var(--cmc-a)] hover:underline">
              Hướng dẫn đầy đủ CuongMini CLI <ArrowRight size={13} aria-hidden />
            </Link>
          </li>
        </ul>
      </section>

      {/* ── Tính năng ─────────────────────────────────────────── */}
      <section className="mt-20">
        <h2 className="text-2xl font-bold sm:text-3xl">Đúng bộ máy AI Code của app — làm việc như Claude Code</h2>
        <p className="mt-2 max-w-2xl text-[var(--text-secondary)]">
          Extension chạy chính lõi AI Code của app CuongThai, nên chất lượng và tính năng giống hệt: skill của dự án,
          bộ nhớ bài học, MCP, agent phụ, chọn model và mức nỗ lực ngay dưới ô chat.
        </p>
        <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TINH_NANG.map(({ icon: Icon, tieuDe, moTa }) => (
            <li key={tieuDe} className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
              <span className="cmc-grad inline-flex h-9 w-9 items-center justify-center rounded-xl text-white">
                <Icon size={18} aria-hidden />
              </span>
              <h3 className="mt-3 font-semibold">{tieuDe}</h3>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">{moTa}</p>
            </li>
          ))}
        </ul>

        <div className="mt-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
          <h3 className="flex items-center gap-2 font-semibold">
            <Terminal size={18} aria-hidden className="text-[var(--cmc-a)]" /> Trong terminal, CuongMini CLI có thêm
          </h3>
          <ul className="mt-2 grid gap-1.5 text-sm text-[var(--text-secondary)] sm:grid-cols-2">
            <li>• <strong>Bảng kế hoạch</strong> hiện ngay trong terminal, tích dần từng bước</li>
            <li>• Cùng lệnh <code>/</code>, <code>@</code> file và chế độ quyền như extension</li>
            <li>• Không cần mở trình soạn hay app nào — chỉ cần terminal</li>
            <li>• Đăng nhập bằng cùng tài khoản cuongthai.com</li>
          </ul>
          <Link href="/cli" className="mt-3 inline-flex items-center gap-1 text-sm text-[var(--cmc-a)] hover:underline">
            Xem CuongMini CLI <ArrowRight size={14} aria-hidden />
          </Link>
        </div>
      </section>

      {/* ── Có app hay không ──────────────────────────────────── */}
      <section className="mt-20 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--cmc-a)]">
            <Laptop size={18} aria-hidden /> Có app CuongThai đang mở
          </span>
          <p className="mt-2 text-[var(--text-secondary)]">
            Extension tự nối với app trên chính máy bạn (127.0.0.1): dùng chung <strong>việc</strong>,{' '}
            <strong>quyền</strong> và <strong>vé dự phòng</strong> khi cổng chính bảo trì. Đổi nơi chạy bằng cài đặt{' '}
            <code>cuongthai.cheDo</code>.
          </p>
          <Link href="/download" className="mt-3 inline-flex items-center gap-1 text-sm text-[var(--cmc-a)] hover:underline">
            Tải app desktop <ArrowRight size={14} aria-hidden />
          </Link>
        </div>
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--cmc-a)]">
            <LogIn size={18} aria-hidden /> Không có app
          </span>
          <p className="mt-2 text-[var(--text-secondary)]">
            Vẫn chạy đủ ngay trong trình soạn: đăng nhập tài khoản cuongthai.com trên trình duyệt thật của bạn, phiên
            đăng nhập cất trong kho bí mật của hệ điều hành — không nằm trong file cài đặt.
          </p>
        </div>
      </section>

      {/* ── 3 bước ────────────────────────────────────────────── */}
      <section className="mt-20">
        <h2 className="text-2xl font-bold sm:text-3xl">Bắt đầu trong 3 bước</h2>
        <ol className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            ['Cài extension', 'Bấm “Cài vào …” ở trên rồi bấm Install trong trình soạn.'],
            ['Mở CuongMini', <>Mở thư mục dự án, bấm biểu tượng CuongMini ở thanh bên trái (<kbd>Cmd/Ctrl+Alt+C</kbd>).</>],
            ['Đăng nhập & giao việc', 'Lần đầu đăng nhập tài khoản cuongthai.com, rồi gõ việc cần làm. Thế thôi.'],
          ].map(([tieuDe, moTa], i) => (
            <li key={String(tieuDe)} className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
              <span className="cmc-chu text-3xl font-bold">{i + 1}</span>
              <h3 className="mt-1 font-semibold">{tieuDe}</h3>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">{moTa}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Hỏi đáp ───────────────────────────────────────────── */}
      <section className="mt-20">
        <h2 className="text-2xl font-bold sm:text-3xl">Hỏi nhanh</h2>
        <div className="mt-4 divide-y divide-[var(--border-color)] rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)]">
          {[
            ['Bấm “Cài vào …” mà không có gì xảy ra?', 'Máy chưa cài trình soạn đó, hoặc trình duyệt đang hỏi “Mở ứng dụng?” ở góc trên. Bấm “Nút không mở được? Cài tay” trong thẻ để cài qua Extensions hoặc một dòng lệnh.'],
            ['Cursor, Windsurf, Antigravity có AI riêng rồi — có đụng nhau không?', 'Không. CuongMini Code là một khung chat riêng ở thanh bên; AI sẵn có của trình soạn vẫn chạy như cũ.'],
            ['Dùng VS Code Remote (SSH/WSL/Container) được không?', 'Được. Đăng nhập Google/GitHub/Apple cần trình duyệt trên cùng máy với extension, nên khi làm từ xa hãy dùng tên đăng nhập + mật khẩu.'],
            ['Có mất phí không?', 'Cài extension và CLI miễn phí; phần AI Code dùng hạn mức của tài khoản CuongThai — gói Pro hoặc key terminal (xin ở /llm-key, mua ở /shop).'],
          ].map(([hoi, dap]) => (
            <details key={hoi} className="group px-5 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-medium">
                {hoi}
                <ChevronDown size={16} aria-hidden className="shrink-0 text-[var(--text-secondary)] transition group-open:rotate-180" />
              </summary>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">{dap}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
