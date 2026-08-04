'use client';

/**
 * Lộ trình IELTS 0 → 7.5.
 *
 * Cùng quy ước giao diện với /tech-trends/tieng-anh-giao-tiep: nền tối cố
 * định, KHÔNG dùng biến thể `dark:` của Tailwind (biến thể đó dành riêng cho
 * khối Notes). Tiến độ đọc localStorage sau khi mount để không lệch HTML
 * server/client.
 */
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Circle, AlertTriangle, Target, Flag } from 'lucide-react';
import { BAND_STAGES, IELTS_STATS } from './data/roadmap';

const PROGRESS_KEY = 'ielts:checkpoints:v1';

export default function IeltsClient() {
  const [open, setOpen] = useState<string>(BAND_STAGES[0].id);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    try {
      const raw = localStorage.getItem(PROGRESS_KEY);
      if (raw) setDone(JSON.parse(raw));
    } catch {
      /* localStorage bị chặn — vẫn xem được, chỉ không nhớ tiến độ */
    }
  }, []);

  const toggle = useCallback((key: string) => {
    setDone((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
      } catch {
        /* bỏ qua */
      }
      return next;
    });
  }, []);

  const totalDone = hydrated
    ? BAND_STAGES.flatMap((s) => s.checkpoints.map((_, i) => `${s.id}:${i}`)).filter((k) => done[k]).length
    : 0;

  return (
    <div className="min-h-screen pt-24 pb-24" style={{ background: '#0a0a0f' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <Link
          href="/tech-trends"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Tech Trends
        </Link>

        <header className="mb-8">
          <p className="text-sky-400 text-sm font-medium tracking-wide uppercase mb-2">
            Luyện thi · 4 chặng band
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
            Lộ trình IELTS 0 → 7.5
          </h1>
          <p className="text-slate-400 mt-3 max-w-3xl leading-relaxed">
            Mỗi chặng trả lời đúng ba câu bạn cần biết: bạn đang ở đâu, mỗi ngày làm gì cho từng
            kỹ năng, và khi nào thì đủ điều kiện lên chặng sau. Kèm cả những sai lầm hay mắc ở
            đúng chặng đó — phần khiến nhiều người kẹt hàng tháng trời.
          </p>

          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <span className="text-slate-300"><b className="text-white">{IELTS_STATS.stages}</b> chặng</span>
            <span className="text-slate-300"><b className="text-white">{IELTS_STATS.skills}</b> kế hoạch kỹ năng</span>
            <span className="text-slate-300"><b className="text-white">{IELTS_STATS.checkpoints}</b> mốc kiểm tra</span>
            <span className="text-slate-300">~<b className="text-white">14–19</b> tháng (2 giờ/ngày)</span>
          </div>

          {hydrated && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                <span>Mốc đã đạt</span>
                <span>{totalDone}/{IELTS_STATS.checkpoints}</span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 transition-all duration-500"
                  style={{ width: `${(totalDone / IELTS_STATS.checkpoints) * 100}%` }}
                />
              </div>
            </div>
          )}
        </header>

        {/* Các chặng */}
        <div className="space-y-4">
          {BAND_STAGES.map((stage, si) => {
            const isOpen = open === stage.id;
            const stageDone = hydrated
              ? stage.checkpoints.filter((_, i) => done[`${stage.id}:${i}`]).length
              : 0;
            const allDone = stageDone === stage.checkpoints.length;
            return (
              <div
                key={stage.id}
                className={`rounded-2xl border overflow-hidden transition-colors ${
                  allDone ? 'border-emerald-400/30 bg-emerald-500/[0.05]' : 'border-white/10 bg-white/[0.02]'
                }`}
              >
                {/* Đầu chặng */}
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? '' : stage.id)}
                  className="w-full text-left p-4 sm:p-5 flex items-start gap-4 hover:bg-white/[0.02] transition-colors"
                >
                  <span className="shrink-0 w-12 h-12 rounded-xl bg-sky-500/15 flex items-center justify-center text-2xl">
                    {stage.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">
                        Band {stage.from} → {stage.to}
                      </span>
                      <span className="text-xs text-slate-500">{stage.duration}</span>
                      <span className="text-xs text-slate-500">· Chặng {si + 1}</span>
                    </div>
                    <p className="font-bold text-white mt-1.5">{stage.title}</p>
                    <p className="text-sm text-slate-400 mt-1 leading-relaxed">{stage.youAre}</p>
                  </div>
                  <span
                    className={`shrink-0 text-xs px-2 py-1 rounded-lg ${
                      allDone ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/5 text-slate-400'
                    }`}
                  >
                    {stageDone}/{stage.checkpoints.length}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 space-y-5">
                    {/* Việc quan trọng nhất */}
                    <div className="rounded-xl border border-amber-500/25 bg-amber-500/[0.08] p-4">
                      <p className="flex items-center gap-2 text-amber-300 text-sm font-semibold mb-1.5">
                        <Target className="w-4 h-4" />
                        Việc quan trọng nhất chặng này
                      </p>
                      <p className="text-slate-200 text-sm leading-relaxed">{stage.keyFocus}</p>
                    </div>

                    {/* Bốn kỹ năng */}
                    <div className="grid gap-3 sm:grid-cols-2">
                      {stage.skills.map((sk) => (
                        <div key={sk.skill} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                          <p className="font-semibold text-white flex items-center gap-2">
                            <span>{sk.icon}</span> {sk.skill}
                          </p>
                          <p className="text-xs text-slate-500 mt-2">Mỗi ngày</p>
                          <p className="text-slate-300 text-sm leading-relaxed">{sk.daily}</p>
                          <p className="text-xs text-slate-500 mt-2">Đạt được</p>
                          <p className="text-emerald-300/90 text-sm leading-relaxed">{sk.target}</p>
                          <p className="mt-2 text-xs text-rose-300/90 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2 flex items-start gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                            <span>{sk.trap}</span>
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Mốc kiểm tra */}
                    <div>
                      <p className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
                        <Flag className="w-4 h-4 text-sky-400" />
                        Đủ những mốc này thì lên chặng sau
                      </p>
                      <ul className="space-y-2">
                        {stage.checkpoints.map((c, i) => {
                          const key = `${stage.id}:${i}`;
                          const ok = hydrated && done[key];
                          return (
                            <li key={i}>
                              <button
                                type="button"
                                onClick={() => toggle(key)}
                                className={`w-full text-left flex items-start gap-2.5 rounded-xl border p-3 transition-all active:scale-[0.99] ${
                                  ok
                                    ? 'border-emerald-400/30 bg-emerald-500/[0.08]'
                                    : 'border-white/10 bg-white/[0.03] hover:border-white/20'
                                }`}
                              >
                                {ok
                                  ? <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                                  : <Circle className="w-5 h-5 shrink-0 text-slate-600" />}
                                <span className={`text-sm leading-relaxed ${ok ? 'text-emerald-100' : 'text-slate-200'}`}>
                                  {c}
                                </span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Ghi chú phần đang làm tiếp */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <p className="text-sm text-slate-300 leading-relaxed">
            <b className="text-white">Đang bổ sung:</b> khu luyện Nghe (video nhúng theo cấp độ),
            ngân hàng bài Đọc theo dạng đề, và phần Viết Task 1 / Task 2 có bài mẫu band 6.5 so
            với band 8. Trong lúc chờ, phần nói và từ vựng nền đã có sẵn ở{' '}
            <Link href="/tech-trends/tieng-anh-giao-tiep" className="text-emerald-400 hover:underline">
              khoá Tiếng Anh Giao Tiếp
            </Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
