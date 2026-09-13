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
  Terminal, KeyRound, Copy, Check, Loader2, ArrowLeft, Clock, XCircle,
  AlertCircle, Crown, Eye, EyeOff, Gauge, ExternalLink,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

interface DonKey {
  id: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REVOKED';
  reason: string;
  key: string | null;
  quotaUsd: number | null;
  adminNote: string | null;
  createdAt: string;
  resolvedAt: string | null;
}

const API = '/api/v1';

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
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [info, setInfo] = useState<{ baseUrl: string; models: string[]; isPro: boolean } | null>(null);
  const [dons, setDons] = useState<DonKey[]>([]);
  const [dangTai, setDangTai] = useState(true);
  const [lyDo, setLyDo] = useState('');
  const [dangGui, setDangGui] = useState(false);
  const [hienKey, setHienKey] = useState(false);
  const [chep, setChep] = useState<string | null>(null);
  const [hanMuc, setHanMuc] = useState<{ conLai?: number; tong?: number } | null>(null);
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

  const donHienHanh = dons.find((d) => d.status === 'PENDING' || d.status === 'APPROVED') ?? dons[0] ?? null;
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
            (info?.models ?? []).map((m) => [m, { limit: { context: 180000, output: 32000 } }]),
          ),
        },
      },
      model: 'cuong/claude-sonnet-5',
    },
    null,
    2,
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-darkbg pt-24 px-4">
        <div className="max-w-md mx-auto text-center bg-darkcard border border-darkborder rounded-2xl p-8">
          <Terminal className="w-12 h-12 text-neon-violet mx-auto mb-4" />
          <h1 className="text-xl font-heading font-bold text-text-primary mb-2">AI trên terminal</h1>
          <p className="text-text-muted text-sm mb-6">Đăng nhập để xin key dùng OpenCode trên máy bạn.</p>
          <Link href="/login?redirect=/llm-key" className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-semibold">
            Đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-darkbg pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
          <div className="min-w-0">
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-text-primary">AI trên terminal</h1>
            <p className="text-text-muted text-sm mt-1">
              Dùng AI ngay trong OpenCode trên máy bạn — code bằng terminal, không cần mở trình duyệt.
            </p>
          </div>
          <Link href="/" className="flex items-center gap-2 text-sm text-text-muted hover:text-neon-violet flex-shrink-0">
            <ArrowLeft className="w-4 h-4" /> Trang chủ
          </Link>
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
                <div className="min-w-0">
                  <p className="font-semibold text-amber-300">Đơn đang chờ admin duyệt</p>
                  <p className="text-sm text-text-muted mt-1">
                    Gửi lúc {new Date(donHienHanh.createdAt).toLocaleString('vi-VN')}. Key sẽ hiện ở đây ngay khi được duyệt.
                  </p>
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
              <h2 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-neon-violet" /> Cắm vào OpenCode
              </h2>

              <ol className="space-y-4 text-sm">
                <li>
                  <p className="text-text-primary font-medium mb-1.5">1. Cài OpenCode</p>
                  <div className="flex items-center gap-2 bg-darkbg border border-darkborder rounded-lg px-3 py-2">
                    <code className="flex-1 text-xs font-mono text-text-secondary">npm i -g opencode-ai</code>
                    <button onClick={() => chepChu('npm i -g opencode-ai', 'cai')} className="text-text-muted hover:text-neon-violet shrink-0" aria-label="Chép lệnh">
                      {chep === 'cai' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </li>

                <li>
                  <p className="text-text-primary font-medium mb-1.5">2. Đặt key vào biến môi trường</p>
                  <div className="flex items-center gap-2 bg-darkbg border border-darkborder rounded-lg px-3 py-2">
                    <code className="flex-1 min-w-0 text-xs font-mono text-text-secondary truncate">
                      export CUONG_LLM_KEY=&quot;{key ? (hienKey ? key : 'sk-…') : 'key-cua-ban'}&quot;
                    </code>
                    <button onClick={() => chepChu(`export CUONG_LLM_KEY="${key ?? 'key-cua-ban'}"`, 'env')} className="text-text-muted hover:text-neon-violet shrink-0" aria-label="Chép lệnh">
                      {chep === 'env' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-xs text-text-muted mt-1.5">
                    Thêm dòng này vào <code className="text-text-secondary">~/.zshrc</code> để lần sau khỏi gõ lại.
                  </p>
                </li>

                <li>
                  <p className="text-text-primary font-medium mb-1.5">
                    3. Tạo <code className="text-text-secondary">~/.config/opencode/opencode.json</code>
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
                  <p className="text-text-primary font-medium mb-1.5">4. Chạy</p>
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
                  <p className="font-semibold text-amber-300">Hai giới hạn cần biết trước</p>
                  <p className="text-text-muted">
                    <b className="text-text-primary">Web được ưu tiên.</b> Khi cuongthai.com đang dùng nhiều,
                    key cá nhân tạm nhường lượt và trả lỗi 429 kèm lý do. Hết chu kỳ là mở lại — không phải
                    key hỏng.
                  </p>
                  <p className="text-text-muted">
                    <b className="text-text-primary">Mỗi key có hạn mức riêng</b> theo từng chu kỳ, nạp lại
                    khi chu kỳ mới bắt đầu.
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
