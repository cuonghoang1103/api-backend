'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Gauge, Search, Eye, EyeOff, Loader2, ArrowLeft, AlertCircle, Activity, Coins, Hash } from 'lucide-react';
import { checkUsage, type CheckUsageResult } from '@/lib/api/shop';
import ShopBackground from '@/components/shop/ShopBackground';

function num(v: unknown): string {
  if (v === null || v === undefined || v === '') return '--';
  const n = Number(v);
  return Number.isFinite(n) ? n.toLocaleString('vi-VN') : String(v);
}

export default function CheckUsagePage() {
  const [apiKey, setApiKey] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckUsageResult | null>(null);
  const [error, setError] = useState('');

  const run = async () => {
    if (!apiKey.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      setResult(await checkUsage(apiKey.trim()));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Không kiểm tra được. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const u = (result?.usage || {}) as Record<string, any>;
  const used = Number(u.requests ?? u.used ?? 0);
  const limit = Number(u.requestLimit ?? u.limit ?? 0);
  const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;

  return (
    <div className="min-h-screen pt-20 pb-20" style={{ background: '#050310' }}>
      <ShopBackground />
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
        <Link href="/shop" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-neon-violet transition-colors mb-6 mt-2">
          <ArrowLeft className="w-4 h-4" /> Quay lại Shop
        </Link>

        <div className="text-center mb-8">
          <div className="mx-auto w-14 h-14 rounded-2xl flex items-center justify-center mb-3" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', boxShadow: '0 8px 30px rgba(168,85,247,0.4)' }}>
            <Gauge className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-text-primary">Kiểm tra Usage / Limit</h1>
          <p className="text-text-muted text-sm mt-1.5">Dán API key / mã kích hoạt để xem hạn mức, số request và thời hạn.</p>
        </div>

        {/* Input */}
        <div className="rounded-2xl border p-3 flex flex-col sm:flex-row gap-2 mb-6"
          style={{ background: 'rgba(13,11,23,0.7)', borderColor: 'rgba(168,85,247,0.2)', backdropFilter: 'blur(16px)' }}>
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type={show ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && run()}
              placeholder="Nhập API Key…"
              className="w-full pl-11 pr-11 py-3 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50"
            />
            <button onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary">
              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <button
            onClick={run}
            disabled={loading || !apiKey.trim()}
            className="px-6 py-3 rounded-xl text-white text-sm font-bold inline-flex items-center justify-center gap-2 disabled:opacity-40 transition-opacity"
            style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Kiểm tra
          </button>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300 flex items-center gap-2 mb-6">
            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
          </div>
        )}

        {/* Not configured */}
        {result && !result.configured && (
          <div className="rounded-2xl border border-yellow-500/25 bg-yellow-500/5 p-6 text-center">
            <AlertCircle className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
            <p className="text-sm text-text-secondary">{result.message || 'Tính năng đang được cấu hình. Vui lòng quay lại sau.'}</p>
          </div>
        )}

        {/* Configured but key not found */}
        {result?.configured && result.ok === false && (
          <div className="rounded-2xl border border-red-500/25 bg-red-500/5 p-6 text-center">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <p className="text-sm text-text-secondary">{result.message || 'Không tìm thấy thông tin cho key này.'}</p>
          </div>
        )}

        {/* Usage result */}
        {result?.configured && result.ok && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border p-6"
            style={{ background: 'rgba(13,11,23,0.7)', borderColor: 'rgba(168,85,247,0.2)' }}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
              {[
                { icon: Hash, label: 'REQUESTS', value: num(u.requests ?? u.used) },
                { icon: Activity, label: 'TOKENS', value: num(u.tokens) },
                { icon: Coins, label: 'COST', value: u.cost !== undefined ? `$${num(u.cost)}` : '--' },
              ].map((c) => (
                <div key={c.label} className="rounded-xl border border-darkborder bg-darkbg p-4">
                  <div className="flex items-center gap-2 text-text-muted text-[11px] font-semibold tracking-wide mb-1"><c.icon className="w-3.5 h-3.5" />{c.label}</div>
                  <p className="text-lg font-heading font-bold text-text-primary">{c.value}</p>
                </div>
              ))}
            </div>

            {limit > 0 && (
              <div className="mb-5">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-text-secondary">{num(used)} / {num(limit)} request</span>
                  <span className="text-neon-violet font-semibold">{pct}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden bg-darkbg">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #6366f1, #a855f7)' }} />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl border border-darkborder bg-darkbg p-4">
                <p className="text-[11px] text-text-muted font-semibold mb-1">TOKEN LIMIT</p>
                <p className="text-sm text-text-primary font-semibold">{num(u.tokenLimit)}</p>
              </div>
              <div className="rounded-xl border border-darkborder bg-darkbg p-4">
                <p className="text-[11px] text-text-muted font-semibold mb-1">COST LIMIT</p>
                <p className="text-sm text-text-primary font-semibold">{u.costLimit !== undefined ? `$${num(u.costLimit)}` : '--'}</p>
              </div>
            </div>

            {(u.expiresAt || u.resetAt) && (
              <div className="mt-4 pt-4 border-t border-darkborder text-xs text-text-muted space-y-1">
                {u.resetAt && <p>Reset lúc: <span className="text-text-secondary">{String(u.resetAt)}</span></p>}
                {u.expiresAt && <p>Hết hạn: <span className="text-text-secondary">{String(u.expiresAt)}</span></p>}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
