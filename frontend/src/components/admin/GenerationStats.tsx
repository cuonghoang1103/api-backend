'use client';
/**
 * Admin — AI Tạo Sinh: the live pulse of the bulk content generators.
 *
 * The generators run detached on the VPS, so until now the only way to know
 * whether one was alive, throttled or long dead was to SSH in and read a log.
 * Every call they make already lands in the LLM call log; this reads it back.
 *
 * Polls every 8s (matching System Stats). Read-only — it cannot disturb a run.
 */
import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import {
  Sparkles, Activity, Coins, Gauge, RefreshCw, CircleDot, Clock, AlertTriangle, Database, Languages, BrainCircuit,
} from 'lucide-react';

interface ModelStat {
  model: string;
  provider: 'claude' | 'openai_compat' | 'other';
  running: boolean;
  lastCallAt: string | null;
  secondsSinceLastCall: number | null;
  window: { calls: number; failed: number; tokens: number; inputTokens: number; outputTokens: number; costUsd: number };
  hour: { calls: number; tokens: number };
  day: { calls: number; tokens: number; costUsd: number };
  avgTokensPerCall: number;
  successRatePct: number;
}
interface GenStats {
  generatedAt: string;
  ai: { available: boolean; forceStatic: boolean; hasKey: boolean };
  models: ModelStat[];
  content: Array<{ key: string; label: string; total: number; lastHour: number; last24h: number }>;
  totals: { windowTokens: number; dayTokens: number; dayCostUsd: number; runningModels: number };
  languageByLevel: Array<{ code: string; level: string | null; words: number }>;
  interview: { published: number; draft: number; withEnglish: number; topicsAtTarget: number; topicsTotal: number };
}

// The window the generators throttle against, so the bar means the same thing
// they mean by it.
const WINDOW_BUDGET = 4_500_000;
const fmt = (n: number) => n.toLocaleString('vi-VN');
const mtok = (n: number) => (n >= 1e6 ? `${(n / 1e6).toFixed(2)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(1)}k` : String(n));

function ago(sec: number | null): string {
  if (sec == null) return 'chưa gọi';
  if (sec < 60) return `${sec}s trước`;
  if (sec < 3600) return `${Math.floor(sec / 60)} phút trước`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h${Math.floor((sec % 3600) / 60)}' trước`;
  return `${Math.floor(sec / 86400)} ngày trước`;
}
const PROVIDER_LABEL: Record<ModelStat['provider'], string> = {
  claude: 'Claude · Rambo',
  openai_compat: 'GPT · modelapi',
  other: 'khác',
};

export default function GenerationStats() {
  const [data, setData] = useState<GenStats | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [live, setLive] = useState(true);

  const load = useCallback(async () => {
    try {
      const r = await api.get('/ai/analytics/generation');
      setData(r.data?.data ?? null);
      setErr(null);
    } catch {
      setErr('Không tải được thống kê tạo sinh');
    }
  }, []);

  useEffect(() => {
    void load();
    if (!live) return;
    const t = setInterval(() => void load(), 8000);
    return () => clearInterval(t);
  }, [load, live]);

  if (err) {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-neon-orange/30 bg-neon-orange/10 p-4 text-neon-orange">
        <AlertTriangle size={18} /> {err}
      </div>
    );
  }
  if (!data) {
    return <div className="h-40 animate-pulse rounded-2xl border border-darkborder bg-darkcard" />;
  }

  const running = data.models.filter((m) => m.running);
  const idle = data.models.filter((m) => !m.running);
  const windowPct = Math.min(100, Math.round((data.totals.windowTokens / WINDOW_BUDGET) * 100));

  return (
    <div className="space-y-5">
      {/* Header + live toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 font-heading text-xl font-bold text-text-primary">
            <Sparkles className="text-neon-violet" size={20} /> AI Tạo Sinh
          </h2>
          <p className="mt-0.5 text-sm text-text-secondary">
            Các tiến trình sinh nội dung nền (My Language, câu hỏi phỏng vấn, dịch EN)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted">
            cập nhật {new Date(data.generatedAt).toLocaleTimeString('vi-VN')}
          </span>
          <button
            type="button"
            onClick={() => setLive((v) => !v)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 transition ${
              live ? 'bg-neon-green/15 text-neon-green ring-neon-green/30' : 'bg-darkcard text-text-muted ring-darkborder'
            }`}
          >
            <RefreshCw size={13} className={live ? 'animate-spin' : ''} style={live ? { animationDuration: '3s' } : undefined} />
            {live ? 'Realtime 8s' : 'Đã tạm dừng'}
          </button>
        </div>
      </div>

      {/* Top cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card
          icon={CircleDot}
          label="Model đang chạy"
          value={`${data.totals.runningModels}/${data.models.length}`}
          hint={running.length ? running.map((m) => m.model).join(', ') : 'không có model nào hoạt động'}
          tone={data.totals.runningModels > 0 ? 'green' : 'muted'}
        />
        <Card icon={Activity} label="Token 24h" value={mtok(data.totals.dayTokens)} hint={`${fmt(data.models.reduce((s, m) => s + m.day.calls, 0))} lệnh gọi`} tone="cyan" />
        <Card icon={Coins} label="Chi phí 24h" value={`$${data.totals.dayCostUsd.toFixed(2)}`} hint="theo log gateway" tone="violet" />
        <Card
          icon={Gauge}
          label="Cửa sổ 5h"
          value={`${windowPct}%`}
          hint={`${mtok(data.totals.windowTokens)} / ${mtok(WINDOW_BUDGET)} — chạm ngưỡng là tự ngủ`}
          tone={windowPct >= 90 ? 'orange' : 'blue'}
        />
      </div>

      {/* AI availability */}
      {(!data.ai.available || data.ai.forceStatic || !data.ai.hasKey) && (
        <div className="flex items-center gap-2 rounded-2xl border border-neon-orange/30 bg-neon-orange/10 p-3 text-sm text-neon-orange">
          <AlertTriangle size={16} />
          {!data.ai.hasKey ? 'Thiếu API key' : data.ai.forceStatic ? 'Đang bật STATIC mode — AI tắt' : 'AI tạm không khả dụng (circuit breaker)'}
        </div>
      )}

      {/* Per-model table */}
      <div className="overflow-hidden rounded-2xl border border-darkborder bg-darkcard">
        <div className="border-b border-darkborder px-4 py-3">
          <h3 className="text-sm font-semibold text-text-primary">Chi tiết theo model</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-darkborder text-left text-xs uppercase tracking-wide text-text-muted">
                <th className="px-4 py-2.5 font-medium">Model</th>
                <th className="px-3 py-2.5 font-medium">Trạng thái</th>
                <th className="px-3 py-2.5 text-right font-medium">Lệnh (5h)</th>
                <th className="px-3 py-2.5 text-right font-medium">Token (5h)</th>
                <th className="px-3 py-2.5 text-right font-medium">TB/lệnh</th>
                <th className="px-3 py-2.5 text-right font-medium">Vào / Ra</th>
                <th className="px-3 py-2.5 text-right font-medium">Thành công</th>
                <th className="px-3 py-2.5 text-right font-medium">24h</th>
              </tr>
            </thead>
            <tbody>
              {[...running, ...idle].map((m) => (
                <tr key={m.model} className="border-b border-darkborder/50 last:border-0">
                  <td className="px-4 py-3">
                    <div className="font-medium text-text-primary">{m.model}</div>
                    <div className="text-[11px] text-text-muted">{PROVIDER_LABEL[m.provider]}</div>
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        m.running ? 'bg-neon-green/15 text-neon-green' : 'bg-darkbg text-text-muted'
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${m.running ? 'animate-pulse bg-neon-green' : 'bg-text-muted'}`} />
                      {m.running ? 'đang chạy' : 'nghỉ'}
                    </span>
                    <div className="mt-0.5 flex items-center gap-1 text-[11px] text-text-muted">
                      <Clock size={10} /> {ago(m.secondsSinceLastCall)}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-right font-medium text-text-primary">{fmt(m.window.calls)}</td>
                  <td className="px-3 py-3 text-right font-medium text-text-primary">{mtok(m.window.tokens)}</td>
                  <td className="px-3 py-3 text-right text-text-secondary">{fmt(m.avgTokensPerCall)}</td>
                  <td className="px-3 py-3 text-right text-text-secondary">
                    {mtok(m.window.inputTokens)} / {mtok(m.window.outputTokens)}
                  </td>
                  <td className="px-3 py-3 text-right">
                    <span className={m.successRatePct >= 95 ? 'text-neon-green' : m.successRatePct >= 80 ? 'text-neon-orange' : 'text-neon-pink'}>
                      {m.successRatePct}%
                    </span>
                    {m.window.failed > 0 && <div className="text-[11px] text-text-muted">{m.window.failed} lỗi</div>}
                  </td>
                  <td className="px-3 py-3 text-right text-text-secondary">
                    {mtok(m.day.tokens)}
                    <div className="text-[11px] text-text-muted">${m.day.costUsd.toFixed(2)}</div>
                  </td>
                </tr>
              ))}
              {!data.models.length && (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-text-muted">Chưa có lệnh gọi nào trong 24h</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* What got produced */}
      <div className="grid gap-3 lg:grid-cols-2">
        <div className="rounded-2xl border border-darkborder bg-darkcard p-4">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-text-primary">
            <Database size={15} className="text-neon-cyan" /> Nội dung đã sinh
          </h3>
          <div className="space-y-2">
            {data.content.map((c) => (
              <div key={c.key} className="flex items-center gap-3 text-sm">
                <span className="min-w-0 flex-1 truncate text-text-secondary">{c.label}</span>
                <span className="font-semibold text-text-primary">{fmt(c.total)}</span>
                {c.last24h > 0 && <span className="rounded-full bg-neon-green/15 px-1.5 py-0.5 text-[11px] font-semibold text-neon-green">+{fmt(c.last24h)} /24h</span>}
                {c.lastHour > 0 && <span className="rounded-full bg-neon-violet/15 px-1.5 py-0.5 text-[11px] font-semibold text-neon-violet">+{c.lastHour} /giờ</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-darkborder bg-darkcard p-4">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-text-primary">
            <BrainCircuit size={15} className="text-neon-violet" /> Câu hỏi phỏng vấn
          </h3>
          <div className="space-y-2 text-sm">
            <Row label="Đã xuất bản" value={fmt(data.interview.published)} />
            <Row label="Bản nháp" value={fmt(data.interview.draft)} />
            <Row
              label="Có bản tiếng Anh"
              value={`${fmt(data.interview.withEnglish)} / ${fmt(data.interview.published + data.interview.draft)}`}
              bar={Math.round((data.interview.withEnglish / Math.max(1, data.interview.published + data.interview.draft)) * 100)}
            />
            <Row
              label="Topic đủ 50 câu"
              value={`${data.interview.topicsAtTarget} / ${data.interview.topicsTotal}`}
              bar={Math.round((data.interview.topicsAtTarget / Math.max(1, data.interview.topicsTotal)) * 100)}
            />
          </div>
        </div>
      </div>

      {/* Language progress by level */}
      <div className="rounded-2xl border border-darkborder bg-darkcard p-4">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-text-primary">
          <Languages size={15} className="text-neon-emerald" /> Từ vựng theo cấp
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {data.languageByLevel.map((l) => (
            <span key={`${l.code}-${l.level}`} className="inline-flex items-center gap-1.5 rounded-full bg-darkbg px-2.5 py-1 text-xs ring-1 ring-darkborder">
              <span className="font-semibold uppercase text-neon-emerald">{l.code}</span>
              <span className="text-text-secondary">{l.level ?? 'chưa gắn cấp'}</span>
              <span className="font-semibold text-text-primary">{fmt(l.words)}</span>
            </span>
          ))}
          {!data.languageByLevel.length && <span className="text-sm text-text-muted">Chưa có từ vựng</span>}
        </div>
      </div>
    </div>
  );
}

function Card({
  icon: Icon, label, value, hint, tone,
}: {
  icon: typeof Sparkles; label: string; value: string; hint: string;
  tone: 'green' | 'cyan' | 'violet' | 'blue' | 'orange' | 'muted';
}) {
  const tones: Record<string, string> = {
    green: 'text-neon-green', cyan: 'text-neon-cyan', violet: 'text-neon-violet',
    blue: 'text-neon-blue', orange: 'text-neon-orange', muted: 'text-text-muted',
  };
  return (
    <div className="rounded-2xl border border-darkborder bg-darkcard p-4">
      <div className="flex items-center gap-2">
        <Icon size={15} className={tones[tone]} />
        <span className="text-xs font-medium text-text-secondary">{label}</span>
      </div>
      <p className={`mt-1.5 font-heading text-2xl font-bold ${tones[tone]}`}>{value}</p>
      <p className="mt-0.5 truncate text-[11px] text-text-muted" title={hint}>{hint}</p>
    </div>
  );
}

function Row({ label, value, bar }: { label: string; value: string; bar?: number }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-text-secondary">{label}</span>
        <span className="font-semibold text-text-primary">{value}</span>
      </div>
      {bar != null && (
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-darkbg">
          <div className="h-full rounded-full bg-neon-violet transition-all" style={{ width: `${bar}%` }} />
        </div>
      )}
    </div>
  );
}
