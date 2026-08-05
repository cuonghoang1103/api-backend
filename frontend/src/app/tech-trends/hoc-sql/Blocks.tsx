'use client';

/**
 * Render một mảng `Block` thành bài học.
 *
 * Có một bộ phân tích đánh dấu rất nhỏ ngay trong file (`**đậm**`, `` `code` ``,
 * `[chữ](đường-dẫn)`) thay vì kéo về một thư viện markdown: nội dung ở đây do
 * chính mình soạn nên tập ký hiệu đóng, và một thư viện markdown đầy đủ vừa
 * nặng vừa mở đường cho HTML tuỳ ý lọt vào trang.
 */
import { Fragment, type ReactNode } from 'react';
import Link from 'next/link';
import { AlertTriangle, Info, Lightbulb, ShieldAlert, PenLine, ArrowLeftRight } from 'lucide-react';
import type { Block, NoteTone } from './data/types';
import Figure from './Figures';
import Widget from './widgets';
import QuizBlock from './QuizBlock';
import CodeBlock from './CodeBlock';

/* ── Đánh dấu inline ──────────────────────────────────────────────── */

const TOKEN = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;

export function md(text: string): ReactNode[] {
  return text.split(TOKEN).filter(Boolean).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="rounded-md border border-white/10 bg-white/[0.06] px-1.5 py-px font-mono text-[0.9em] text-violet-300">
          {part.slice(1, -1)}
        </code>
      );
    }
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (link) {
      const [, label, href] = link;
      // Chỉ nhận đường dẫn nội bộ — chặn luôn khả năng biến nội dung thành
      // bàn đạp chuyển hướng ra ngoài.
      const internal = href.startsWith('/');
      return internal ? (
        <Link key={i} href={href} className="text-violet-300 underline decoration-violet-400/40 underline-offset-2 hover:text-violet-200">
          {label}
        </Link>
      ) : (
        <span key={i}>{label}</span>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

/* ── Hộp ghi chú ──────────────────────────────────────────────────── */

const NOTE_STYLE: Record<NoteTone, { wrap: string; head: string; Icon: typeof Info }> = {
  info: { wrap: 'border-sky-400/25 bg-sky-500/[0.07]', head: 'text-sky-300', Icon: Info },
  ok: { wrap: 'border-emerald-400/25 bg-emerald-500/[0.07]', head: 'text-emerald-300', Icon: Lightbulb },
  warn: { wrap: 'border-amber-400/25 bg-amber-500/[0.07]', head: 'text-amber-300', Icon: AlertTriangle },
  danger: { wrap: 'border-rose-400/30 bg-rose-500/[0.08]', head: 'text-rose-300', Icon: ShieldAlert },
};

function Note({ tone, title, text }: { tone: NoteTone; title?: string; text: string }) {
  const { wrap, head, Icon } = NOTE_STYLE[tone];
  return (
    <div className={`my-5 rounded-2xl border px-4 py-3.5 sm:px-5 ${wrap}`}>
      {title && (
        <p className={`mb-1.5 flex items-center gap-2 text-sm font-bold ${head}`}>
          <Icon className="h-4 w-4 shrink-0" />
          {title}
        </p>
      )}
      <p className="text-[14.5px] leading-relaxed text-slate-300">{md(text)}</p>
    </div>
  );
}

/* ── Hộp đối chiếu SQL Server ─────────────────────────────────────── */

function MssqlBox({ text, pg, ms }: { text: string; pg?: string; ms?: string }) {
  return (
    <div className="my-5 overflow-hidden rounded-2xl border border-orange-400/25 bg-orange-500/[0.05]">
      <div className="flex items-center gap-2 border-b border-orange-400/20 px-4 py-2.5">
        <ArrowLeftRight className="h-4 w-4 shrink-0 text-orange-300" />
        <span className="text-sm font-bold text-orange-300">Trên SQL Server thì sao?</span>
      </div>
      <div className="px-4 py-3.5">
        <p className="text-[14.5px] leading-relaxed text-slate-300">{md(text)}</p>
        {(pg || ms) && (
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {pg && (
              <div className="rounded-xl border border-sky-400/25 bg-sky-500/[0.06] p-3">
                <p className="mb-1.5 font-mono text-[10px] font-bold uppercase tracking-wide text-sky-300">PostgreSQL</p>
                <pre className="overflow-x-auto whitespace-pre font-mono text-[12px] leading-relaxed text-slate-200">{pg}</pre>
              </div>
            )}
            {ms && (
              <div className="rounded-xl border border-orange-400/25 bg-orange-500/[0.06] p-3">
                <p className="mb-1.5 font-mono text-[10px] font-bold uppercase tracking-wide text-orange-300">SQL Server</p>
                <pre className="overflow-x-auto whitespace-pre font-mono text-[12px] leading-relaxed text-slate-200">{ms}</pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Bảng ─────────────────────────────────────────────────────────── */

function Table({ head, rows, caption }: { head: string[]; rows: string[][]; caption?: string }) {
  return (
    <div className="my-5">
      {caption && <p className="mb-2 text-xs font-medium text-slate-400">{caption}</p>}
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-left text-[13.5px]">
          <thead>
            <tr className="bg-white/[0.05]">
              {head.map((h) => (
                <th key={h} className="px-3.5 py-2.5 font-semibold text-slate-200">{md(h)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t border-white/[0.07] align-top">
                {r.map((c, j) => (
                  <td key={j} className="px-3.5 py-2.5 leading-relaxed text-slate-300">{md(c)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Bộ render chính ──────────────────────────────────────────────── */

export default function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div>
      {blocks.map((b, i) => {
        switch (b.kind) {
          case 'h':
            return (
              <h3 key={i} className="mb-3 mt-9 border-l-[3px] border-violet-400/60 pl-3 text-xl font-bold text-white first:mt-0">
                {b.text}
              </h3>
            );
          case 'p':
            return (
              <p key={i} className="my-3.5 text-[15px] leading-[1.75] text-slate-300">{md(b.text)}</p>
            );
          case 'code':
            return <CodeBlock key={i} code={b.code} lang={b.lang} caption={b.caption} />;
          case 'list':
            return b.ordered ? (
              <ol key={i} className="my-4 space-y-2.5">
                {b.items.map((it, j) => (
                  <li key={j} className="flex gap-3 text-[15px] leading-[1.7] text-slate-300">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-[11px] font-bold text-violet-300">
                      {j + 1}
                    </span>
                    <span>{md(it)}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <ul key={i} className="my-4 space-y-2.5">
                {b.items.map((it, j) => (
                  <li key={j} className="flex gap-3 text-[15px] leading-[1.7] text-slate-300">
                    <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400/70" />
                    <span>{md(it)}</span>
                  </li>
                ))}
              </ul>
            );
          case 'note':
            return <Note key={i} tone={b.tone} title={b.title} text={b.text} />;
          case 'table':
            return <Table key={i} head={b.head} rows={b.rows} caption={b.caption} />;
          case 'mssql':
            return <MssqlBox key={i} text={b.text} pg={b.pg} ms={b.ms} />;
          case 'quiz':
            return <QuizBlock key={i} q={b.q} options={b.options} answer={b.answer} explain={b.explain} />;
          case 'widget':
            return <Widget key={i} name={b.name} title={b.title} hint={b.hint} />;
          case 'figure':
            return <Figure key={i} name={b.name} title={b.title} caption={b.caption} />;
          case 'try':
            return (
              <div key={i} className="my-5 flex gap-3 rounded-2xl border border-emerald-400/25 bg-emerald-500/[0.07] px-4 py-3.5">
                <PenLine className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                <div>
                  <p className="mb-1 text-sm font-bold text-emerald-300">Tự làm thử</p>
                  <p className="text-[14.5px] leading-relaxed text-slate-300">{md(b.text)}</p>
                </div>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
