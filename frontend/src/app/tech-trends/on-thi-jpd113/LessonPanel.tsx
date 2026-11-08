'use client';

/**
 * Bài giảng mở ra ngay trong một việc của lộ trình.
 *
 * Nguyên tắc trình bày: mục tiêu trước (học xong LÀM ĐƯỢC gì), rồi mới đến
 * nội dung; ví dụ luôn kèm cách đọc và bản dịch để không phải tra thêm; phần
 * tự kiểm giấu đáp án cho tới khi bấm — đọc lướt đáp án thì không nhớ được gì.
 */

import { useState } from 'react';
import { AlertTriangle, Lightbulb, Target, Eye } from 'lucide-react';

import type { TaskLesson, LessonPart } from './data/lessons';

export default function LessonPanel({ lesson }: { lesson: TaskLesson }) {
  return (
    <div className="mt-3 rounded-xl border border-neon-cyan/25 bg-neon-cyan/[0.04] p-4 sm:p-5 space-y-5">
      <div className="flex items-start gap-2.5">
        <Target className="w-4 h-4 text-tone-cyan shrink-0 mt-0.5" />
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wide text-tone-cyan mb-0.5">
            Học xong thì làm được gì
          </div>
          <p className="text-[13px] text-text-primary leading-relaxed">{lesson.goal}</p>
        </div>
      </div>

      {lesson.parts.map((part, i) => (
        <Part key={i} part={part} />
      ))}
    </div>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return <h4 className="text-[13px] font-bold text-text-primary mb-2">{children}</h4>;
}

function Part({ part }: { part: LessonPart }) {
  switch (part.type) {
    case 'text':
      return (
        <div>
          {part.h && <Heading>{part.h}</Heading>}
          <p className="text-[13px] text-text-secondary leading-relaxed">{part.body}</p>
        </div>
      );

    case 'steps':
      return (
        <div>
          {part.h && <Heading>{part.h}</Heading>}
          <ol className="space-y-1.5">
            {part.items.map((s, i) => (
              <li key={i} className="flex gap-2.5 text-[13px] text-text-secondary leading-relaxed">
                <span className="shrink-0 w-5 h-5 rounded-md bg-neon-violet/15 border border-neon-violet/30 text-tone-violet text-[10px] font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </div>
      );

    case 'table':
      return (
        <div>
          {part.h && <Heading>{part.h}</Heading>}
          <div className="overflow-x-auto rounded-lg border border-[var(--border-light)]">
            <table className="w-full text-[13px] min-w-[420px]">
              <thead>
                <tr className="bg-[var(--bg-surface-hover)]">
                  {part.headers.map((h, i) => (
                    <th
                      key={`${h}-${i}`}
                      className="text-left px-2.5 py-2 text-[10px] font-bold tracking-wide text-text-secondary uppercase"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {part.rows.map((row, ri) => {
                  const danger = part.dangerRows?.includes(ri);
                  return (
                    <tr
                      key={ri}
                      className={`border-t border-[var(--border-light)] ${danger ? 'bg-neon-red/[0.07]' : ''}`}
                    >
                      {row.map((cell, ci) => (
                        <td
                          key={ci}
                          className={`px-2.5 py-2 align-top ${
                            ci === 0 ? 'text-text-primary font-medium' : danger ? 'text-tone-red' : 'text-text-secondary'
                          }`}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {part.note && (
            <p className="text-[12px] text-text-muted leading-relaxed mt-2">{part.note}</p>
          )}
        </div>
      );

    case 'examples':
      return (
        <div>
          {part.h && <Heading>{part.h}</Heading>}
          <div className="space-y-2">
            {part.items.map((ex, i) => (
              <div
                key={i}
                className={`rounded-lg border px-3 py-2.5 ${
                  ex.wrong
                    ? 'border-neon-red/30 bg-neon-red/[0.05]'
                    : 'border-[var(--border-light)] bg-[var(--bg-surface-hover)]'
                }`}
              >
                <div className={`text-base leading-snug ${ex.wrong ? 'text-tone-red line-through' : 'text-text-primary'}`}>
                  {ex.jp}
                </div>
                {ex.read && ex.read !== ex.jp && (
                  <div className="text-[13px] text-tone-cyan mt-0.5">{ex.read}</div>
                )}
                {ex.romaji && <div className="text-[12px] text-text-muted mt-0.5">{ex.romaji}</div>}
                <div className="text-[13px] text-text-secondary mt-1">{ex.vi}</div>
                {ex.note && (
                  <div className="text-[12px] text-text-muted leading-relaxed mt-1.5">{ex.note}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      );

    case 'warn':
      return (
        <div className="rounded-lg border border-neon-red/30 bg-neon-red/[0.06] p-3.5">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-tone-red shrink-0 mt-0.5" />
            <div>
              {part.h && <div className="text-[12px] font-bold text-tone-red mb-1">{part.h}</div>}
              <p className="text-[13px] text-text-secondary leading-relaxed">{part.body}</p>
            </div>
          </div>
        </div>
      );

    case 'tip':
      return (
        <div className="rounded-lg border border-neon-green/25 bg-neon-green/[0.05] p-3.5">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-tone-green shrink-0 mt-0.5" />
            <div>
              {part.h && <div className="text-[12px] font-bold text-tone-green mb-1">{part.h}</div>}
              <p className="text-[13px] text-text-secondary leading-relaxed">{part.body}</p>
            </div>
          </div>
        </div>
      );

    case 'quiz':
      return <QuizPart part={part} />;

    default:
      return null;
  }
}

function QuizPart({ part }: { part: Extract<LessonPart, { type: 'quiz' }> }) {
  // Giấu đáp án cho tới khi bấm: đọc lướt sẵn đáp án thì không nhớ được gì
  const [shown, setShown] = useState<Record<number, boolean>>({});

  return (
    <div>
      {part.h && <Heading>{part.h}</Heading>}
      <div className="space-y-2">
        {part.items.map((it, i) => (
          <div key={i} className="rounded-lg border border-[var(--border-light)] bg-[var(--bg-surface-hover)] px-3 py-2.5">
            <div className="flex items-start justify-between gap-3">
              <span className="text-[15px] text-text-primary leading-snug">{it.q}</span>
              {!shown[i] && (
                <button
                  onClick={() => setShown((s) => ({ ...s, [i]: true }))}
                  className="shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium bg-[var(--bg-surface-hover)] border border-[var(--border-light)] text-text-secondary hover:text-text-primary transition-colors"
                >
                  <Eye className="w-3 h-3" />
                  Đáp án
                </button>
              )}
            </div>
            {shown[i] && (
              <div className="mt-1.5">
                <div className="text-[13px] text-tone-green font-medium">{it.a}</div>
                {it.why && <div className="text-[12px] text-text-muted leading-relaxed mt-0.5">{it.why}</div>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
