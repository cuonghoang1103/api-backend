'use client';

/**
 * Tab Nộp hồ sơ — chuẩn bị trước khi bấm nút gửi.
 *
 * Mẫu thư viết bằng tiếng Anh nhưng CỐ Ý để trống chỗ điền số. Hồ sơ dùng lại
 * nguyên văn của người khác thì nhà tuyển dụng nhận ra ngay, nên phần
 * "nên tránh" đặt ngay cạnh phần "nên viết" để thấy rõ khác biệt.
 */
import { useState } from 'react';
import { Check, ChevronDown, Copy, Info, ThumbsDown, ThumbsUp } from 'lucide-react';
import { APPLY_ITEMS, STATS } from './data';

export default function ApplyPanel() {
  const [open, setOpen] = useState<Record<string, boolean>>({ where: true });
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      window.setTimeout(() => setCopied((c) => (c === key ? null : c)), 1800);
    } catch {
      /* trình duyệt chặn clipboard — người dùng vẫn bôi đen chép tay được */
    }
  };

  return (
    <div className="space-y-6">
      <div className="max-w-2xl">
        <h2 className="text-lg font-bold text-white">Chuẩn bị trước khi nộp</h2>
        <p className="mt-1 text-sm leading-relaxed text-slate-400">
          Trong {STATS.jobs} tin, chỉ <strong className="text-slate-300">1 tin</strong> nhắc tới hỗ
          trợ visa, còn {STATS.byTier.C} tin chặn cứng theo địa lý. Nghĩa là con đường thật của một
          dev ở Việt Nam không phải &quot;nộp thật nhiều rồi hy vọng&quot;, mà là nhắm đúng nhóm nộp
          được rồi làm hồ sơ đủ mạnh cho nhóm đó.
        </p>
      </div>

      <div className="space-y-4">
        {APPLY_ITEMS.map((it) => {
          const isOpen = open[it.id] ?? false;
          return (
            <div key={it.id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
              <button
                type="button"
                onClick={() => setOpen((o) => ({ ...o, [it.id]: !isOpen }))}
                aria-expanded={isOpen}
                className="flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-white/[0.02] sm:p-5"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-bold text-white">{it.title}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-slate-400">{it.why}</p>
                </div>
                <ChevronDown
                  className={`mt-1 h-5 w-5 shrink-0 text-slate-500 transition-transform ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="space-y-4 border-t border-white/10 p-4 sm:p-5">
                  <ul className="space-y-2">
                    {it.todo.map((t) => (
                      <li key={t} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-slate-300">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                        {t}
                      </li>
                    ))}
                  </ul>

                  {it.sample?.map((s) => {
                    const bad = s.label.toLowerCase().includes('tránh');
                    const key = `${it.id}:${s.label}`;
                    return (
                      <div
                        key={s.label}
                        className={[
                          'rounded-xl border p-3.5',
                          bad
                            ? 'border-rose-500/25 bg-rose-500/[0.06]'
                            : 'border-emerald-500/25 bg-emerald-500/[0.06]',
                        ].join(' ')}
                      >
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <span
                            className={[
                              'flex items-center gap-1.5 text-xs font-semibold',
                              bad ? 'text-rose-300' : 'text-emerald-300',
                            ].join(' ')}
                          >
                            {bad ? <ThumbsDown className="h-3.5 w-3.5" /> : <ThumbsUp className="h-3.5 w-3.5" />}
                            {s.label}
                          </span>
                          {!bad && (
                            <button
                              type="button"
                              onClick={() => copy(key, s.text)}
                              className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-white/15 px-2 py-1 text-[11px] text-slate-400 transition-colors hover:border-white/30 hover:text-white"
                            >
                              {copied === key ? (
                                <>
                                  <Check className="h-3 w-3" />
                                  Đã chép
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3 w-3" />
                                  Chép
                                </>
                              )}
                            </button>
                          )}
                        </div>
                        <p className="whitespace-pre-line text-[13px] leading-relaxed text-slate-300">
                          {s.text}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-start gap-2.5 rounded-2xl border border-sky-500/25 bg-sky-500/[0.07] p-4">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
        <p className="text-[13px] leading-relaxed text-slate-300">
          Mẫu thư ở trên cố ý để trống chỗ điền số. Đừng gửi nguyên văn — nhà tuyển dụng đọc hàng
          trăm lá mỗi tuần và nhận ra mẫu có sẵn ngay lập tức. Thay bằng số thật của bạn và một chi
          tiết có thật lấy từ chính JD của họ.
        </p>
      </div>
    </div>
  );
}
