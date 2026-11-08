'use client';

/**
 * Một câu hỏi trắc nghiệm giữa bài.
 *
 * Lời giải thích hiện ra DÙ ĐÚNG HAY SAI — chọn đúng nhờ đoán mò mà không đọc
 * lý do thì lần sau vẫn sai. Không có nút "làm lại": người học đã thấy đáp án
 * rồi, làm lại chỉ tạo cảm giác hiểu bài giả.
 */
import { useState } from 'react';
import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import { md } from './Blocks';

export default function QuizBlock({
  q, options, answer, explain,
}: { q: string; options: string[]; answer: number; explain: string }) {
  const [picked, setPicked] = useState<number | null>(null);
  const done = picked !== null;
  const correct = picked === answer;

  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-violet-400/25 bg-violet-500/[0.05]">
      <div className="flex items-start gap-2.5 border-b border-violet-400/20 px-4 py-3">
        <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-tone-violet" />
        <p className="text-[14.5px] font-semibold leading-relaxed text-text-primary">{md(q)}</p>
      </div>

      <div className="space-y-1.5 p-3">
        {options.map((opt, i) => {
          const isAnswer = i === answer;
          const isPicked = i === picked;
          let cls = 'border-[var(--border-light)] bg-[var(--bg-surface-hover)] text-text-secondary hover:border-[var(--border-light-hover)] hover:bg-[var(--bg-surface-hover)]';
          if (done && isAnswer) cls = 'border-emerald-400/50 bg-emerald-500/15 text-text-primary';
          else if (done && isPicked) cls = 'border-rose-400/50 bg-rose-500/15 text-text-primary';
          else if (done) cls = 'border-[var(--border-light)] bg-[var(--bg-surface-hover)] text-text-muted';

          return (
            <button
              key={i}
              type="button"
              disabled={done}
              onClick={() => setPicked(i)}
              className={`flex w-full items-start gap-3 rounded-xl border px-3.5 py-2.5 text-left text-[14px] leading-relaxed transition-all active:scale-[0.99] disabled:cursor-default ${cls}`}
            >
              <span
                className={[
                  'mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold',
                  done && isAnswer ? 'bg-emerald-400 text-slate-900'
                    : done && isPicked ? 'bg-rose-400 text-slate-900'
                      : 'bg-[var(--bg-surface-active)] text-text-secondary',
                ].join(' ')}
              >
                {String.fromCharCode(65 + i)}
              </span>
              <span className="min-w-0 flex-1">{md(opt)}</span>
              {done && isAnswer && <CheckCircle2 className="mt-px h-4 w-4 shrink-0 text-tone-emerald" />}
              {done && isPicked && !isAnswer && <XCircle className="mt-px h-4 w-4 shrink-0 text-tone-rose" />}
            </button>
          );
        })}
      </div>

      {done && (
        <div className="border-t border-violet-400/20 px-4 py-3.5">
          <p className={`mb-1.5 text-sm font-bold ${correct ? 'text-tone-emerald' : 'text-tone-amber'}`}>
            {correct ? 'Chính xác.' : 'Chưa đúng — đọc kỹ chỗ này:'}
          </p>
          <p className="text-[14px] leading-relaxed text-text-secondary">{md(explain)}</p>
        </div>
      )}
    </div>
  );
}
