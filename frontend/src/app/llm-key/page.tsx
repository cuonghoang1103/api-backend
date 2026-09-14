'use client';

/**
 * /llm-key — API key dùng AI trên terminal bằng OpenCode.
 *
 * Ba việc trên một trang: hướng dẫn cắm, xin key (admin duyệt), và xem hạn
 * mức còn lại.
 *
 * ⚠️ Phần hạn mức gọi `/llm/han-muc` — endpoint đó do phiên khác làm và có
 * thể CHƯA lên production. Gọi hỏng thì ẩn hẳn khối đó đi, KHÔNG để trang vỡ
 * và không hiện "0" (một con số sai nguy hiểm hơn không có số).
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  ShieldAlert, RefreshCw, Terminal, KeyRound, Copy, Check, Loader2, ArrowLeft, Clock, XCircle,
  AlertCircle, Crown, Eye, EyeOff, Gauge, ExternalLink,
} from 'lucide-react';
import { useDaDangNhap } from '@/hooks/useDaDangNhap';

interface DonKey {
  id: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REVOKED';
  reason: string;
  key: string | null;
  quotaUsd: number | null;
  adminNote: string | null;
  /** SHOP = mua gói ở /shop (tự cấp ngay) · REQUEST = xin ở trang này. */
  source?: 'SHOP' | 'REQUEST';
  /** Hết hạn gói (ISO). null = không hạn (key xin tay). */
  expiresAt?: string | null;
  hetHan?: boolean;
  createdAt: string;
  resolvedAt: string | null;
}

/** "còn 12 ngày" / "còn 3 giờ" / "đã hết hạn" — đọc nhanh hơn một mốc ngày. */
function conLaiChu(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const ms = new Date(iso).getTime() - Date.now();
  if (!Number.isFinite(ms)) return null;
  if (ms <= 0) return 'đã hết hạn';
  const gio = Math.floor(ms / 3_600_000);
  if (gio < 24) return `còn ${Math.max(1, gio)} giờ`;
  return `còn ${Math.floor(gio / 24)} ngày`;
}

const API = '/api/v1';

/**
 * Hướng dẫn cắm OpenCode theo HỆ ĐIỀU HÀNH.
 *
 * Vì sao phải tách: bản cũ chỉ đưa `export CUONG_LLM_KEY=…` và `~/.zshrc` —
 * đúng trên macOS/Linux và VÔ NGHĨA trên Windows (PowerShell không có
 * `export`, cũng không có `.zshrc`). Người dùng Windows dán vào là báo lỗi
 * ngay bước 2 rồi nghĩ key hỏng.
 *
 * OpenCode chạy trên CẢ BA hệ: nó là gói npm, cần Node. Chỉ hai thứ khác
 * nhau — cách đặt biến môi trường và đường dẫn file cấu hình.
 */
type MaHDH = 'macos' | 'windows' | 'linux';

const HE_DIEU_HANH: { ma: MaHDH; ten: string }[] = [
  { ma: 'macos', ten: 'macOS' },
  { ma: 'windows', ten: 'Windows' },
  { ma: 'linux', ten: 'Linux' },
];

/** Lệnh đặt biến môi trường GIỮ ĐƯỢC sau khi đóng terminal, cho từng hệ. */
function lenhDatKey(hdh: MaHDH, key: string): { lenh: string; ghiChu: string } {
  if (hdh === 'windows') {
    return {
      // PowerShell. `setx` của cmd.exe cắt giá trị ở 1024 ký tự và không cập
      // nhật phiên đang mở — dùng .NET API cho chắc.
      lenh: `[Environment]::SetEnvironmentVariable("CUONG_LLM_KEY", "${key}", "User")`,
      ghiChu: 'Chạy trong PowerShell, rồi MỞ LẠI terminal. Chỉ dùng cho phiên hiện tại thì: $env:CUONG_LLM_KEY="…"',
    };
  }
  return {
    lenh: `export CUONG_LLM_KEY="${key}"`,
    ghiChu: hdh === 'macos'
      ? 'Thêm dòng này vào ~/.zshrc (macOS mặc định dùng zsh) để lần sau khỏi gõ lại.'
      : 'Thêm dòng này vào ~/.bashrc hoặc ~/.zshrc để lần sau khỏi gõ lại.',
  };
}

/**
 * Lệnh cài Node.js theo từng hệ.
 *
 * OpenCode là gói npm nên KHÔNG có Node là không cài được — và thông báo lỗi
 * lúc đó (`npm không phải là lệnh`) chẳng nhắc gì tới Node, nên người dùng
 * tưởng hướng dẫn sai chứ không biết mình thiếu gì.
 */
function lenhCaiNode(hdh: MaHDH): string {
  if (hdh === 'windows') return 'winget install OpenJS.NodeJS.LTS';
  if (hdh === 'macos') return 'brew install node';
  return 'sudo apt install -y nodejs npm';
}

/** Đường dẫn file cấu hình TOÀN CỤC của OpenCode. */
function duongDanCauHinh(hdh: MaHDH): string {
  return hdh === 'windows'
    ? '%USERPROFILE%\\.config\\opencode\\opencode.json'
    : '~/.config/opencode/opencode.json';
}

async function goi<T>(path: string, init?: RequestInit): Promise<T> {
  const r = await fetch(`${API}${path}`, {
    credentials: 'include',
    headers: init?.body ? { 'Content-Type': 'application/json' } : undefined,
    ...init,
  });
  const body = await r.text();
  if (!r.ok) {
    let msg = `HTTP ${r.status}`;
    try { msg = (JSON.parse(body) as { message?: string }).message ?? msg; } catch { /* không phải JSON */ }
    throw new Error(msg);
  }
  return JSON.parse(body) as T;
}

export default function LlmKeyPage() {
  // Xem hooks/useDaDangNhap.ts — `isAuthenticated` một mình KHÔNG đủ.
  const { daDangNhap: isAuthenticated, sanSang } = useDaDangNhap();
  const [info, setInfo] = useState<{
    baseUrl: string; models: string[]; isPro: boolean;
    contextToken?: number; outputToken?: number;
  } | null>(null);
  const [dons, setDons] = useState<DonKey[]>([]);
  const [dangTai, setDangTai] = useState(true);
  const [lyDo, setLyDo] = useState('');
  const [dangGui, setDangGui] = useState(false);
  const [hienKey, setHienKey] = useState(false);
  const [chep, setChep] = useState<string | null>(null);
  const [hanMuc, setHanMuc] = useState<{ conLai?: number; tong?: number } | null>(null);
  const [heDieuHanh, setHeDieuHanh] = useState<MaHDH>('macos');
  const khoaGui = useRef(false);

  const nap = useCallback(async () => {
    if (!isAuthenticated) { setDangTai(false); return; }
    try {
      const [i, m] = await Promise.all([
        goi<{ data: { baseUrl: string; models: string[]; isPro: boolean } }>('/llm-keys/info'),
        goi<{ data: DonKey[] }>('/llm-keys/mine'),
      ]);
      setInfo(i.data);
      setDons(m.data);
    } catch { /* chưa đăng nhập hoặc mạng lỗi — khối dưới đã có trạng thái riêng */ }
    setDangTai(false);
  }, [isAuthenticated]);

  useEffect(() => { nap(); }, [nap]);

  /**
   * ═══ BA LỚP ĐỂ NGƯỜI DÙNG KHÔNG PHẢI TỰ TẢI LẠI TRANG ═══
   *
   * Trước 14/09/2026 trang này nạp đúng MỘT LẦN lúc mở. Admin duyệt xong thì
   * người dùng vẫn ngồi nhìn dòng "đang chờ admin duyệt" cho tới khi họ tình
   * cờ bấm F5 — và phần lớn không nghĩ ra việc đó. Người dùng nói nguyên văn:
   * *"nhiều user cứ ở trang đấy mãi trong khi admin duyệt rồi mà vẫn không
   * biết"*.
   *
   * Ba lớp, cố ý chồng nhau vì mỗi lớp hỏng theo một kiểu khác nhau:
   *  1. SOCKET — nhanh nhất, gần như tức thì. Nhưng rớt mạng, tab ngủ, hoặc
   *     proxy cắt kết nối thì nó im mà không báo.
   *  2. NHỊP HỎI LẠI 12 giây — lưới đỡ cho lớp 1. CHỈ chạy khi đang có đơn
   *     PENDING; đơn đã xong rồi mà vẫn hỏi mỗi 12 giây là tự tạo tải cho máy
   *     chủ suốt thời gian người dùng để tab đó mở.
   *  3. NÚT TẢI LẠI — cho người sốt ruột, và cho trường hợp cả hai lớp trên
   *     cùng hỏng. Luôn có, không phụ thuộc gì.
   */
  const dangCho = dons.some((d) => d.status === 'PENDING');

  // Lớp 2: nhịp hỏi lại, chỉ khi đang chờ.
  useEffect(() => {
    if (!dangCho || !isAuthenticated) return;
    const h = setInterval(() => { void nap(); }, 12_000);
    return () => clearInterval(h);
  }, [dangCho, isAuthenticated, nap]);

  // Lớp 1: socket. Nạp động để trang không kéo theo socket.io khi không cần.
  useEffect(() => {
    if (!isAuthenticated) return;
    let huy = false;
    let sk: { off: (s: string) => void } | null = null;
    void import('@/lib/socket')
      .then((m) => {
        const s = (m as { getSocket?: () => unknown }).getSocket?.() as
          | { on: (su: string, cb: (d: unknown) => void) => void; off: (su: string) => void }
          | null | undefined;
        if (!s || huy) return;
        s.on('llm-key:doi-trang-thai', (d) => {
          const tt = (d as { trangThai?: string } | null)?.trangThai;
          void nap();
          if (tt === 'APPROVED') toast.success('Admin đã duyệt — key của bạn đã sẵn sàng ngay bên dưới.', { duration: 8000 });
          else if (tt === 'REJECTED') toast.error('Đơn xin key của bạn đã bị từ chối. Xem lý do bên dưới.', { duration: 8000 });
          else if (tt === 'REVOKED') toast('Key của bạn vừa bị thu hồi.', { duration: 8000 });
        });
        sk = s;
      })
      .catch(() => { /* không có socket thì đã có lớp 2 và lớp 3 */ });
    return () => { huy = true; sk?.off('llm-key:doi-trang-thai'); };
  }, [isAuthenticated, nap]);

  /**
   * Xoay key khi bị lộ. Hỏi lại trước, vì key cũ CHẾT NGAY — mọi máy đang cắm
   * key đó sẽ ngừng chạy cho tới khi người dùng dán key mới vào.
   */
  const [dangXoay, setDangXoay] = useState(false);
  const xoayKey = useCallback(async () => {
    if (dangXoay) return;
    const chac = window.confirm(
      'Xoay key mới?\n\n'
      + '• Key hiện tại CHẾT NGAY LẬP TỨC — mọi máy đang cắm key đó sẽ ngừng chạy.\n'
      + '• Bạn nhận key mới với đúng hạn mức và đúng hạn còn lại của gói.\n'
      + '• Nhớ dán key mới vào opencode.json trên máy bạn.',
    );
    if (!chac) return;
    setDangXoay(true);
    try {
      await goi<{ data: { key: string } }>('/llm-keys/doi-key-bi-lo', { method: 'POST' });
      await nap();
      toast.success('Đã xoay key. Key cũ đã bị khoá — nhớ dán key mới vào cấu hình.', { duration: 10000 });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Không xoay được key.', { duration: 8000 });
    } finally {
      setDangXoay(false);
    }
  }, [dangXoay, nap]);

  const donHienHanh =
    dons.find((d) => (d.status === 'PENDING' || d.status === 'APPROVED') && !d.hetHan) ?? dons[0] ?? null;
  const key = donHienHanh?.status === 'APPROVED' ? donHienHanh.key : null;

  /**
   * Hạn mức còn lại. Endpoint `/llm/han-muc` do phiên khác làm; chưa lên thì
   * im lặng bỏ qua chứ không hiện số 0.
   */
  useEffect(() => {
    if (!key) { setHanMuc(null); return; }
    let huy = false;
    fetch('/llm/han-muc', { headers: { Authorization: `Bearer ${key}` } })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => { if (!huy && j && typeof j === 'object') setHanMuc(j as { conLai?: number; tong?: number }); })
      .catch(() => { /* chưa deploy — ẩn khối hạn mức */ });
    return () => { huy = true; };
  }, [key]);

  const guiDon = async () => {
    if (khoaGui.current) return;
    if (lyDo.trim().length < 20) {
      toast.warning('Vui lòng mô tả bạn định dùng key vào việc gì (ít nhất 20 ký tự).');
      return;
    }
    khoaGui.current = true;
    setDangGui(true);
    try {
      await goi('/llm-keys/request', { method: 'POST', body: JSON.stringify({ reason: lyDo.trim() }) });
      toast.success('Đã gửi đơn. Admin sẽ duyệt sớm nhất.');
      setLyDo('');
      await nap();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Không gửi được đơn.');
    } finally {
      khoaGui.current = false;
      setDangGui(false);
    }
  };

  const chepChu = async (chu: string, nhan: string) => {
    try {
      await navigator.clipboard.writeText(chu);
      setChep(nhan);
      setTimeout(() => setChep(null), 1800);
    } catch { toast.error('Trình duyệt không cho chép tự động — vui lòng chép tay.'); }
  };

  const cauHinhMau = JSON.stringify(
    {
      $schema: 'https://opencode.ai/config.json',
      provider: {
        cuong: {
          npm: '@ai-sdk/anthropic',
          name: 'Cổng Cường',
          options: { baseURL: info?.baseUrl ?? 'https://api.cuongthai.com/llm/v1', apiKey: '{env:CUONG_LLM_KEY}' },
          models: Object.fromEntries(
            // Con số do BACKEND quyết (`LLM_KEY_CONTEXT_TOKEN`), không cứng ở
            // đây: đo lại trần thật của cổng là đổi env, không phải dựng lại
            // frontend. 180k là mức an toàn đang dùng khi chưa đo xong.
            (info?.models ?? []).map((m) => [
              m,
              { limit: { context: info?.contextToken ?? 180_000, output: info?.outputToken ?? 32_000 } },
            ]),
          ),
        },
      },
      model: 'cuong/claude-sonnet-5',
    },
    null,
    2,
  );

  if (sanSang && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-darkbg pt-24 px-4">
        <div className="max-w-md mx-auto text-center bg-darkcard border border-darkborder rounded-2xl p-8">
          <Terminal className="w-12 h-12 text-neon-violet mx-auto mb-4" />
          <h1 className="text-xl font-heading font-bold text-text-primary mb-2">CuongMini trên Terminal</h1>
          <p className="text-text-muted text-sm mb-6">Đăng nhập để xin key dùng CuongMini trong OpenCode.</p>
          <Link href="/login?redirect=/llm-key" className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-semibold">
            Đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-darkbg pt-20 overflow-hidden">
      <NenTerminal />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-neon-violet mb-6">
          <ArrowLeft className="w-4 h-4" /> Trang chủ
        </Link>

        {/* Hero — dựng như một khung terminal thật. Hình thức nói ngay công
            dụng trước khi người dùng đọc chữ nào. */}
        <div className="mb-8 rounded-2xl border border-darkborder bg-darkcard/70 backdrop-blur overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-darkborder bg-darkbg/60">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
            <span className="ml-2 text-[11px] font-mono text-text-muted">~/du-an — opencode</span>
          </div>
          <div className="px-5 py-6 sm:px-7 sm:py-8">
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-text-primary tracking-tight">
              CuongMini trên Terminal
            </h1>
            <p className="text-text-secondary text-sm md:text-base mt-2.5 max-w-2xl leading-relaxed">
              Dùng CuongMini ngay trong OpenCode trên máy bạn — đọc và sửa mã bằng terminal,
              không cần mở trình duyệt.
            </p>
            <p className="mt-4 font-mono text-sm">
              <span className="text-emerald-400">$</span>{' '}
              <span className="text-text-muted">opencode</span>{' '}
              <span className="inline-block w-2 h-4 align-middle bg-neon-violet/80 animate-pulse" />
            </p>
          </div>
        </div>

        {dangTai ? (
          <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-neon-violet" /></div>
        ) : (
          <div className="space-y-6">
            {/* ─── Trạng thái key ─── */}
            {key ? (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.07] p-5">
                <div className="flex items-center gap-2 mb-4">
                  <KeyRound className="w-5 h-5 text-emerald-400" />
                  <span className="font-semibold text-text-primary">Key của bạn</span>
                  {donHienHanh?.quotaUsd != null && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300">
                      hạn mức {donHienHanh.quotaUsd} USD / chu kỳ
                    </span>
                  )}
                  {donHienHanh?.source === 'SHOP' && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300">
                      gói mua ở shop
                    </span>
                  )}
                  {conLaiChu(donHienHanh?.expiresAt) && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300">
                      {conLaiChu(donHienHanh?.expiresAt)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 bg-darkbg border border-darkborder rounded-xl px-3 py-2.5">
                  <code className="flex-1 min-w-0 text-sm font-mono text-text-primary truncate">
                    {hienKey ? key : '•'.repeat(Math.min(40, key.length))}
                  </code>
                  <button onClick={() => setHienKey((v) => !v)} className="text-text-muted hover:text-emerald-400 shrink-0" aria-label={hienKey ? 'Ẩn key' : 'Hiện key'}>
                    {hienKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button onClick={() => chepChu(key, 'key')} className="text-text-muted hover:text-emerald-400 shrink-0" aria-label="Chép key">
                    {chep === 'key' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-text-muted mt-3">
                  Giữ key như mật khẩu — đừng commit vào git, đừng dán lên nhóm chat.
                </p>

                {/* Lỡ lộ thì tính bằng PHÚT. Bắt người dùng nhắn admin rồi
                    ngồi chờ nghĩa là trong khoảng đó ai nhặt được cũng xài
                    được — và với key xin theo Pro thì nó ăn thẳng vào hạn mức
                    AI Code của chính nạn nhân. Nên để họ tự xoay. */}
                <button
                  onClick={() => void xoayKey()}
                  disabled={dangXoay}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs text-amber-300/90 hover:text-amber-200 underline underline-offset-2 disabled:opacity-50"
                >
                  {dangXoay
                    ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Đang xoay key…</>
                    : <><ShieldAlert className="w-3.5 h-3.5" /> Lỡ làm lộ key? Xoay key mới ngay</>}
                </button>

                {hanMuc && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-text-muted bg-darkbg rounded-lg p-3">
                    <Gauge className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      Hạn mức còn lại:{' '}
                      <b className="text-text-primary tabular-nums">
                        {hanMuc.conLai ?? '—'}{hanMuc.tong != null ? ` / ${hanMuc.tong}` : ''}
                      </b>
                    </span>
                  </div>
                )}
              </div>
            ) : donHienHanh?.status === 'PENDING' ? (
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-amber-300">Đơn đang chờ admin duyệt</p>
                  <p className="text-sm text-text-muted mt-1">
                    Gửi lúc {new Date(donHienHanh.createdAt).toLocaleString('vi-VN')}.
                  </p>
                  {/* Nói RÕ rằng trang tự theo dõi. Không nói thì người dùng
                      vẫn ngồi bấm F5 — mà chính việc họ không biết phải F5 là
                      vấn đề ban đầu. */}
                  <p className="text-sm text-text-secondary mt-2 flex items-center gap-2">
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                    </span>
                    Trang đang tự theo dõi — key sẽ hiện ngay tại đây khi admin duyệt, bạn không cần tải lại.
                  </p>
                  <button
                    onClick={() => { void nap(); toast.success('Đã kiểm tra lại.'); }}
                    className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/30 text-xs text-amber-200 hover:bg-amber-500/10 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Kiểm tra ngay
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-darkborder bg-darkcard p-5">
                <div className="flex items-center gap-2 mb-1">
                  <KeyRound className="w-5 h-5 text-neon-violet" />
                  <span className="font-semibold text-text-primary">Xin cấp key</span>
                </div>

                {donHienHanh?.status === 'REJECTED' && donHienHanh.adminNote && (
                  <p className="text-sm text-red-300/90 bg-red-500/10 border border-red-500/25 rounded-lg p-3 my-3">
                    Đơn trước bị từ chối: {donHienHanh.adminNote}
                  </p>
                )}
                {donHienHanh?.status === 'REVOKED' && (
                  <p className="text-sm text-amber-300/90 bg-amber-500/10 border border-amber-500/25 rounded-lg p-3 my-3">
                    Key trước đã bị thu hồi{donHienHanh.adminNote ? `: ${donHienHanh.adminNote}` : '.'}
                  </p>
                )}

                {info && !info.isPro ? (
                  <div className="mt-3">
                    <p className="text-sm text-text-muted mb-4">
                      Cấp key là quyền lợi của tài khoản Pro.
                    </p>
                    <Link href="/pro" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-violet-500 text-white font-semibold text-sm">
                      <Crown className="w-4 h-4" /> Nâng cấp Pro
                    </Link>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-text-muted mt-2 mb-3">
                      Mô tả bạn định dùng key vào việc gì — admin đọc trước khi duyệt.
                    </p>
                    <textarea
                      value={lyDo}
                      onChange={(e) => setLyDo(e.target.value)}
                      rows={3}
                      maxLength={2000}
                      placeholder="VD: dùng OpenCode để refactor dự án Next.js cá nhân trên máy Mac, khoảng 2-3 giờ mỗi tối."
                      className="w-full bg-darkbg border border-darkborder rounded-xl px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted/60 focus:border-neon-violet outline-none resize-none"
                    />
                    <div className="flex items-center justify-between mt-1.5 mb-4">
                      <span className={`text-xs ${lyDo.trim().length >= 20 ? 'text-text-muted' : 'text-amber-400'}`}>
                        {lyDo.trim().length >= 20 ? 'Đủ thông tin' : `Cần thêm ${20 - lyDo.trim().length} ký tự`}
                      </span>
                      <span className="text-xs text-text-muted">{lyDo.length}/2000</span>
                    </div>
                    <button
                      onClick={guiDon}
                      disabled={dangGui || lyDo.trim().length < 20}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {dangGui ? <><Loader2 className="w-4 h-4 animate-spin" /> Đang gửi…</> : 'Gửi đơn xin key'}
                    </button>
                  </>
                )}
              </div>
            )}

            {/* ─── Hướng dẫn ─── */}
            <div className="rounded-2xl border border-darkborder bg-darkcard p-5">
              <h2 className="font-semibold text-text-primary mb-1 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-neon-violet" /> Cắm vào OpenCode
              </h2>
              <p className="text-xs text-text-muted mb-4">
                Chạy được trên cả <strong className="text-text-secondary">Windows, macOS và Linux</strong> — OpenCode là
                gói npm, chỉ cần Node 18 trở lên. Các bước khác nhau giữa ba hệ nằm ngay dưới, chọn đúng hệ của bạn.
              </p>

              {/* Không giấu chuyện này xuống cuối: nhà phát triển OpenCode
                  khuyên mạnh dùng WSL trên Windows, và người dùng cần biết
                  TRƯỚC khi bỏ 10 phút đi theo đường native rồi mới gặp trục
                  trặc. Nhưng cũng không ép — gói npm có sẵn nhị phân Windows
                  (đã kiểm: os `win32`, opencode-windows-x64/arm64). */}
              {heDieuHanh === 'windows' && (
                <div className="rounded-xl border border-amber-500/25 bg-amber-500/[0.06] p-3 mb-4">
                  <p className="text-xs text-text-muted leading-relaxed">
                    <b className="text-amber-300">Windows:</b> làm theo hướng dẫn dưới là chạy được ngay. Nhưng nhà
                    phát triển OpenCode <b className="text-text-secondary">khuyên dùng WSL</b> (Windows Subsystem for
                    Linux) để có hiệu năng file và hỗ trợ terminal tốt hơn. Dùng WSL thì mở terminal WSL rồi làm theo
                    tab <b className="text-text-secondary">Linux</b>, không phải tab Windows.
                  </p>
                </div>
              )}

              {/* Chọn hệ điều hành — chỉ đổi bước 2 và bước 3 */}
              <div className="flex gap-1.5 mb-4 p-1 rounded-xl bg-darkbg border border-darkborder w-fit">
                {HE_DIEU_HANH.map((h) => (
                  <button
                    key={h.ma}
                    onClick={() => setHeDieuHanh(h.ma)}
                    aria-pressed={heDieuHanh === h.ma}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      heDieuHanh === h.ma
                        ? 'bg-gradient-to-r from-neon-indigo to-neon-violet text-white'
                        : 'text-text-muted hover:text-text-secondary'
                    }`}
                  >
                    {h.ten}
                  </button>
                ))}
              </div>

              <ol className="space-y-4 text-sm">
                {/* ⚠️ BƯỚC NÀY TRƯỚC ĐÂY KHÔNG CÓ, và đó là lỗi.
                    Hướng dẫn cũ bắt đầu thẳng từ `npm i -g opencode-ai`, tức
                    GIẢ ĐỊNH SẴN máy đã cài Node. Trên Windows sạch thì không,
                    và người dùng nhận "npm không phải là lệnh" — một câu chẳng
                    nhắc gì tới Node.js, nên họ tưởng hướng dẫn sai. Đã dính
                    thật 14/09/2026. */}
                <li>
                  <p className="text-text-primary font-medium mb-1.5">1. Cài Node.js (bỏ qua nếu đã có)</p>
                  <p className="text-xs text-text-muted mb-1.5">
                    Kiểm trước bằng <code className="text-text-secondary">node -v</code>. Ra số phiên bản là đã có.
                    Báo <em>&quot;không phải là lệnh&quot;</em> / <em>&quot;command not found&quot;</em> thì cài theo dưới
                    — và đó cũng chính là lý do <code className="text-text-secondary">npm</code> báo không tìm thấy.
                  </p>
                  <div className="flex items-center gap-2 bg-darkbg border border-darkborder rounded-lg px-3 py-2">
                    <code className="flex-1 min-w-0 text-xs font-mono text-text-secondary truncate">{lenhCaiNode(heDieuHanh)}</code>
                    <button onClick={() => chepChu(lenhCaiNode(heDieuHanh), 'node')} className="text-text-muted hover:text-neon-violet shrink-0" aria-label="Chép lệnh">
                      {chep === 'node' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-xs text-amber-300/80 mt-1.5">
                    Cài xong phải <b>mở lại cửa sổ terminal</b> — đường dẫn mới chỉ có hiệu lực ở cửa sổ mở sau đó.
                  </p>
                </li>

                <li>
                  <p className="text-text-primary font-medium mb-1.5">2. Cài OpenCode</p>
                  <div className="flex items-center gap-2 bg-darkbg border border-darkborder rounded-lg px-3 py-2">
                    <code className="flex-1 text-xs font-mono text-text-secondary">npm i -g opencode-ai</code>
                    <button onClick={() => chepChu('npm i -g opencode-ai', 'cai')} className="text-text-muted hover:text-neon-violet shrink-0" aria-label="Chép lệnh">
                      {chep === 'cai' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-xs text-text-muted mt-1.5">Giống nhau trên cả ba hệ điều hành.</p>
                </li>

                <li>
                  <p className="text-text-primary font-medium mb-1.5">3. Đặt key vào biến môi trường</p>
                  <div className="flex items-center gap-2 bg-darkbg border border-darkborder rounded-lg px-3 py-2">
                    <code className="flex-1 min-w-0 text-xs font-mono text-text-secondary truncate">
                      {lenhDatKey(heDieuHanh, key ? (hienKey ? key : 'sk-…') : 'key-cua-ban').lenh}
                    </code>
                    <button onClick={() => chepChu(lenhDatKey(heDieuHanh, key ?? 'key-cua-ban').lenh, 'env')} className="text-text-muted hover:text-neon-violet shrink-0" aria-label="Chép lệnh">
                      {chep === 'env' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-xs text-text-muted mt-1.5">{lenhDatKey(heDieuHanh, '').ghiChu}</p>
                </li>

                <li>
                  <p className="text-text-primary font-medium mb-1.5">
                    4. Tạo <code className="text-text-secondary">{duongDanCauHinh(heDieuHanh)}</code>
                  </p>
                  <p className="text-xs text-text-muted mb-1.5">
                    Không muốn đụng thư mục hệ thống thì đặt file tên{' '}
                    <code className="text-text-secondary">opencode.json</code> ngay trong thư mục dự án — cách này giống
                    hệt nhau trên cả ba hệ.
                  </p>
                  <div className="relative">
                    <pre className="bg-darkbg border border-darkborder rounded-lg p-3 text-xs font-mono text-text-secondary overflow-x-auto max-h-72">
{cauHinhMau}
                    </pre>
                    <button
                      onClick={() => chepChu(cauHinhMau, 'json')}
                      className="absolute top-2 right-2 p-1.5 rounded bg-darkcard/90 text-text-muted hover:text-neon-violet"
                      aria-label="Chép cấu hình"
                    >
                      {chep === 'json' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </li>

                <li>
                  <p className="text-text-primary font-medium mb-1.5">5. Chạy</p>
                  <div className="flex items-center gap-2 bg-darkbg border border-darkborder rounded-lg px-3 py-2">
                    <code className="flex-1 text-xs font-mono text-text-secondary">opencode</code>
                    <button onClick={() => chepChu('opencode', 'chay')} className="text-text-muted hover:text-neon-violet shrink-0" aria-label="Chép lệnh">
                      {chep === 'chay' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </li>
              </ol>

              {info && info.models.length > 0 && (
                <div className="mt-5 pt-4 border-t border-darkborder">
                  <p className="text-xs text-text-muted mb-2">Model dùng được ({info.models.length}):</p>
                  <div className="flex flex-wrap gap-1.5">
                    {info.models.map((m) => (
                      <code key={m} className="text-[11px] px-2 py-1 rounded bg-darkbg border border-darkborder text-text-secondary">
                        {m}
                      </code>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ─── Điều cần biết. Nói TRƯỚC, không để người dùng tự phát hiện ─── */}
            <div className="rounded-2xl border border-amber-500/25 bg-amber-500/[0.06] p-5">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-sm space-y-2 min-w-0">
                  <p className="font-semibold text-amber-300">Ba điều cần biết trước</p>
                  <p className="text-text-muted">
                    <b className="text-text-primary">Web được ưu tiên.</b> Khi cuongthai.com đang dùng nhiều,
                    key cá nhân tạm nhường lượt và trả lỗi 429 kèm lý do. Hết chu kỳ là mở lại — không phải
                    key hỏng.
                  </p>
                  <p className="text-text-muted">
                    <b className="text-text-primary">Mỗi key có hạn mức riêng</b> theo từng chu kỳ, nạp lại
                    khi chu kỳ mới bắt đầu.
                  </p>
                  <p className="text-text-muted">
                    <b className="text-text-primary">
                      Ngữ cảnh khai {Math.round((info?.contextToken ?? 180_000) / 1000)}k token.
                    </b>{' '}
                    Đây là mức OpenCode dùng để quyết định lúc nào nén hội thoại lại, đặt theo con số cổng đã
                    phục vụ được ổn định — khai cao hơn thứ cổng chịu nổi thì OpenCode ngừng nén và yêu cầu bị
                    từ chối giữa chừng. Cần nhiều hơn thì nhắn admin, chúng tôi đo lại và nâng.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="https://opencode.ai/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-neon-violet"
              >
                Tài liệu OpenCode <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <Link href="/pro" className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-amber-300">
                <Crown className="w-3.5 h-3.5" /> Quyền lợi Pro
              </Link>
            </div>

            {/* Lịch sử đơn */}
            {dons.length > 1 && (
              <div className="rounded-2xl border border-darkborder bg-darkcard p-5">
                <h2 className="font-semibold text-text-primary mb-3 text-sm">Lịch sử đơn</h2>
                <div className="space-y-2">
                  {dons.map((d) => (
                    <div key={d.id} className="flex items-center justify-between gap-3 text-xs py-2 border-b border-darkborder last:border-0">
                      <span className="text-text-muted truncate">{new Date(d.createdAt).toLocaleString('vi-VN')}</span>
                      <span className={
                        d.status === 'APPROVED' ? 'text-emerald-400'
                        : d.status === 'PENDING' ? 'text-amber-400'
                        : 'text-red-400'
                      }>
                        {{ APPROVED: 'Đã cấp', PENDING: 'Chờ duyệt', REJECTED: 'Từ chối', REVOKED: 'Đã thu hồi' }[d.status]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Nền cho trang terminal — tối, kỹ thuật, không tranh chấp với nội dung.
 *
 * Dùng lại đúng nguyên tắc của nền gian hàng: hai quầng sáng rất mờ trôi
 * chậm + một lưới mảnh mờ dần. Toàn bộ là CSS transform/opacity nên chạy
 * trên luồng hợp thành. `prefers-reduced-motion` thì đứng yên.
 */
function NenTerminal() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <style>{`
        @keyframes lkTroi {
          0%,100% { transform: translate3d(-5%, -3%, 0) scale(1); }
          50%     { transform: translate3d(4%, 3%, 0)  scale(1.1); }
        }
        .lk-quang { animation: lkTroi 28s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .lk-quang { animation: none !important; } }
      `}</style>
      <div
        className="lk-quang absolute -top-48 left-1/4 h-[560px] w-[560px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.10), transparent 62%)', filter: 'blur(110px)' }}
      />
      <div
        className="lk-quang absolute -bottom-52 right-1/5 h-[520px] w-[520px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.13), transparent 62%)', filter: 'blur(120px)', animationDelay: '-9s' }}
      />
      <div
        className="absolute inset-0 opacity-[0.13]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(148,163,184,.14) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,.14) 1px, transparent 1px)',
          backgroundSize: '52px 52px',
          maskImage: 'linear-gradient(to bottom, black, transparent 58%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black, transparent 58%)',
        }}
      />
    </div>
  );
}
