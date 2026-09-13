'use client';

/**
 * /kiem-tra-key — dán key, xem còn bao nhiêu hạn mức.
 * ─────────────────────────────────────────────────────────────────────────
 * Thay cho `/shop/check-usage`, thứ CHƯA BAO GIỜ hoạt động: route đó chờ một
 * biến `CHECK_USAGE_API_URL` trỏ sang nhà cung cấp bên ngoài, chưa ai cắm,
 * nên mọi key — đúng hay sai — đều nhận đúng một câu "đang được cấu hình".
 *
 * Trang này hỏi thẳng `GET /llm/han-muc` của `canh`, nơi thật sự biết hạn mức
 * (nó là bên nạp lại quota mỗi chu kỳ). Không cần đăng nhập: ai cầm key thì
 * người đó xem được key của mình — và chỉ key của mình, vì con số lấy theo
 * chính key gửi lên.
 *
 * ⚠️ Key KHÔNG rời khỏi trình duyệt của người dùng ngoài đúng một lượt gọi
 * kiểm tra: không lưu localStorage, không gửi kèm analytics, không đưa vào URL
 * (đưa vào query string là nó chui vào lịch sử trình duyệt và log máy chủ).
 */
import { useState } from 'react';
import Link from 'next/link';
import { Terminal, Search, Loader2, Eye, EyeOff, AlertCircle, CheckCircle2, Clock, ShoppingBag } from 'lucide-react';

interface CuaSo {
  khongGioiHan?: boolean;
  hanMucUsd?: number | null;
  daDungUsd?: number | null;
  conLaiUsd?: number;
  vuotUsd?: number;
  daDung?: string | null;
  hetHanMuc?: boolean;
}
interface KetQua {
  key?: string;
  ketLuan?: string;
  cuaSoNay?: CuaSo;
  cong?: { dangMo?: boolean; lyDo?: string; cuaSoResetSau?: string };
  ghiChu?: string;
  loi?: string;
}

export default function TrangKiemTraKey() {
  const [key, setKey] = useState('');
  const [hien, setHien] = useState(false);
  const [dangTim, setDangTim] = useState(false);
  const [kq, setKq] = useState<KetQua | null>(null);
  const [loi, setLoi] = useState<string | null>(null);

  async function kiem() {
    const k = key.trim();
    if (!k) return;
    setDangTim(true); setKq(null); setLoi(null);
    try {
      // Key đi trong HEADER, không phải query string — query string nằm lại
      // trong lịch sử trình duyệt và log của mọi proxy trên đường.
      const r = await fetch('/llm/han-muc', { headers: { Authorization: `Bearer ${k}` } });
      const j = (await r.json()) as KetQua;
      if (!r.ok || j.loi) { setLoi(j.loi || `Không kiểm tra được (HTTP ${r.status}).`); return; }
      setKq(j);
    } catch {
      setLoi('Không kết nối được máy chủ kiểm tra. Thử lại sau ít phút.');
    } finally { setDangTim(false); }
  }

  const cs = kq?.cuaSoNay;
  const phanTram = cs?.hanMucUsd && cs.hanMucUsd > 0
    ? Math.min(100, Math.round(((cs.daDungUsd ?? 0) / cs.hanMucUsd) * 100))
    : null;

  return (
    <div className="min-h-screen bg-darkbg pt-24 pb-16 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-neon-indigo to-neon-violet flex items-center justify-center mx-auto mb-4">
            <Terminal className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-text-primary">Kiểm tra hạn mức key</h1>
          <p className="text-sm text-text-muted mt-2">
            Dán key CuongMini của bạn để xem còn bao nhiêu hạn mức trong chu kỳ hiện tại.
          </p>
        </div>

        <div className="rounded-2xl border border-darkborder bg-darkcard p-5">
          <label className="block text-xs text-text-muted mb-1.5">Key của bạn</label>
          <div className="flex items-center gap-2 bg-darkbg border border-darkborder rounded-xl px-3 py-2.5 focus-within:border-neon-violet">
            <input
              type={hien ? 'text' : 'password'}
              value={key}
              onChange={(e) => setKey(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') kiem(); }}
              placeholder="sk-..."
              autoComplete="off"
              spellCheck={false}
              className="flex-1 min-w-0 bg-transparent text-sm font-mono text-text-primary outline-none"
            />
            <button onClick={() => setHien((v) => !v)} className="text-text-muted hover:text-neon-violet shrink-0" aria-label={hien ? 'Ẩn key' : 'Hiện key'}>
              {hien ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <button
            onClick={kiem}
            disabled={!key.trim() || dangTim}
            className="mt-3 w-full py-3 rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {dangTim ? <><Loader2 className="w-4 h-4 animate-spin" /> Đang kiểm…</> : <><Search className="w-4 h-4" /> Kiểm tra</>}
          </button>

          <p className="text-[11px] text-text-muted mt-3 leading-relaxed">
            Key chỉ được gửi đi đúng một lượt để tra cứu — không lưu lại trên máy chủ, không lưu trong trình duyệt.
          </p>
        </div>

        {loi && (
          <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/[0.07] p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-sm text-red-300 font-medium">Không tra được key này</p>
              <p className="text-xs text-text-muted mt-1">{loi}</p>
            </div>
          </div>
        )}

        {kq && cs && (
          <div className="mt-4 rounded-2xl border border-darkborder bg-darkcard p-5 space-y-4">
            <div className="flex items-start gap-3">
              {cs.hetHanMuc ? <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                : <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-text-primary">{kq.ketLuan}</p>
                {kq.key && <p className="text-xs text-text-muted mt-0.5 font-mono">gói: {kq.key}</p>}
              </div>
            </div>

            {cs.khongGioiHan ? (
              <p className="text-sm text-text-secondary">Key này không giới hạn hạn mức.</p>
            ) : (
              <>
                {phanTram != null && (
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-text-muted">Đã dùng trong chu kỳ này</span>
                      <span className="text-text-secondary font-medium tabular-nums">{phanTram}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-darkbg overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${phanTram}%`,
                          background: phanTram >= 90
                            ? 'linear-gradient(90deg,#f59e0b,#ef4444)'
                            : 'linear-gradient(90deg,#6366f1,#a855f7)',
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-3 text-center">
                  {[
                    { nhan: 'Hạn mức', gt: cs.hanMucUsd != null ? `${cs.hanMucUsd}$` : '—' },
                    { nhan: 'Đã dùng', gt: cs.daDungUsd != null ? `${cs.daDungUsd}$` : '—' },
                    { nhan: 'Còn lại', gt: cs.conLaiUsd != null ? `${Math.round(cs.conLaiUsd * 100) / 100}$` : '—' },
                  ].map((o) => (
                    <div key={o.nhan} className="rounded-xl bg-darkbg border border-darkborder py-3">
                      <p className="text-[11px] text-text-muted">{o.nhan}</p>
                      <p className="text-base font-heading font-bold text-text-primary tabular-nums mt-0.5">{o.gt}</p>
                    </div>
                  ))}
                </div>

                {kq.cong?.cuaSoResetSau && (
                  <p className="text-xs text-text-muted text-center">
                    Chu kỳ mới sau khoảng <b className="text-text-secondary">{kq.cong.cuaSoResetSau}</b> — hạn mức tự nạp lại.
                  </p>
                )}
              </>
            )}

            {kq.ghiChu && <p className="text-[11px] text-text-muted leading-relaxed border-t border-darkborder pt-3">{kq.ghiChu}</p>}
          </div>
        )}

        <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
          <Link href="/llm-key" className="text-text-muted hover:text-neon-violet inline-flex items-center gap-1.5">
            <Terminal className="w-4 h-4" /> Hướng dẫn cắm vào OpenCode
          </Link>
          <Link href="/shop" className="text-text-muted hover:text-neon-violet inline-flex items-center gap-1.5">
            <ShoppingBag className="w-4 h-4" /> Mua key
          </Link>
        </div>
      </div>
    </div>
  );
}
