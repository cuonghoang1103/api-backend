'use client';

/**
 * Tab Cẩm nang thi — thông tin về kỳ thi, không phải bài luyện.
 *
 * Đặt ở chặng 1 dù còn lâu mới thi vì biết mình bị chấm theo tiêu chí nào thì
 * học đỡ lan man. Mục "4 tiêu chí Writing" là phần đáng đọc nhất — nó giải
 * thích vì sao viết hay mà vẫn 5.5.
 */
import { useState } from 'react';
import { AlertTriangle, ChevronDown } from 'lucide-react';
import { EXAM } from './data/stage1';

export default function ExamView() {
  // Mở sẵn mục đầu; các mục khác bấm mới mở, tránh trang dài lê thê.
  const [open, setOpen] = useState<Record<string, boolean>>({ [EXAM[0].id]: true });

  return (
    <div>
      <p className="text-sm text-slate-400 leading-relaxed mb-4 rounded-xl border border-white/10 bg-white/[0.02] p-3">
        Rất nhiều người luyện cả năm mà không biết Writing được chấm theo bốn tiêu chí, nên dồn hết sức
        vào từ vựng hoa mỹ trong khi mất điểm ở chỗ khác. Đọc mục{' '}
        <b className="text-slate-200">&quot;Writing chấm theo 4 tiêu chí nào&quot;</b> trước — đó là phần
        đáng giá nhất ở đây.
      </p>

      <div className="space-y-3">
        {EXAM.map((b) => {
          const isOpen = !!open[b.id];
          return (
            <div key={b.id} className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
              <button
                type="button"
                onClick={() => setOpen((o) => ({ ...o, [b.id]: !o[b.id] }))}
                className="w-full text-left p-4 flex items-center gap-3 hover:bg-white/[0.02] transition-colors"
              >
                <span className="shrink-0 w-10 h-10 rounded-xl bg-sky-500/15 flex items-center justify-center text-xl">
                  {b.icon}
                </span>
                <span className="flex-1 font-semibold text-white">{b.title}</span>
                <ChevronDown
                  className={`w-4 h-4 shrink-0 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 space-y-3">
                  <p className="text-slate-300 text-sm leading-relaxed">{b.body}</p>

                  {b.rows && (
                    <div className="rounded-xl border border-white/10 overflow-hidden">
                      {b.rows.map((r, i) => (
                        <div
                          key={i}
                          className={`grid sm:grid-cols-[minmax(0,14rem)_1fr] gap-x-4 gap-y-1 px-3 py-2.5 ${
                            i % 2 === 0 ? 'bg-white/[0.03]' : 'bg-white/[0.01]'
                          }`}
                        >
                          <p className="text-sm font-semibold text-sky-200">{r.k}</p>
                          <p className="text-sm text-slate-300 leading-relaxed">{r.v}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {b.bullets && (
                    <ul className="space-y-1.5">
                      {b.bullets.map((x, i) => (
                        <li key={i} className="text-slate-200 text-sm leading-relaxed flex gap-2">
                          <span className="text-sky-400 shrink-0">→</span>
                          <span>{x}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {b.warn && (
                    <p className="rounded-xl border border-rose-500/25 bg-rose-500/[0.08] p-3 text-sm text-rose-200 leading-relaxed flex gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{b.warn}</span>
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
