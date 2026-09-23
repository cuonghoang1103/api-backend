'use client';

/**
 * Tab "Weekly report" — mã ở backend gom SỰ KIỆN (facts), AI chỉ viết lời.
 * Tốn 1 lượt AI mỗi lần bấm Generate. Hiện kèm "Facts used" để người đọc tự
 * đối chiếu rằng AI không bịa số. Bản gần nhất giữ trong localStorage theo dự án.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Check, ChevronDown, Copy, Download, Sparkles } from 'lucide-react';
import { isAiQuotaError, workApi, workError, type ProjectConfig } from '@/lib/work-api';
import { Spinner } from '@/components/work/ui';
import { cn } from '@/lib/utils';
import { Card } from './shared';

type Audience = 'teacher' | 'client' | 'team';
type Lang = 'en' | 'vi';
interface Saved { report: string; facts: string; audience: Audience; language: Lang; at: string }

const AUDIENCES: Array<{ id: Audience; label: string; hint: string }> = [
  { id: 'teacher', label: 'Lecturer', hint: 'Progress, who did what, and evidence of process' },
  { id: 'client', label: 'Client', hint: 'Outcomes, delivered features and upcoming milestones' },
  { id: 'team', label: 'Team', hint: 'Blockers, risks and what to focus on next week' },
];
const LANGS: Array<{ id: Lang; label: string }> = [
  { id: 'en', label: 'English' },
  { id: 'vi', label: 'Tiếng Việt' },
];

const storageKey = (pid: number) => `ctwork:weekly-report:${pid}`;

function loadSaved(pid: number): Saved | null {
  try {
    const raw = window.localStorage.getItem(storageKey(pid));
    if (!raw) return null;
    const v = JSON.parse(raw) as Saved;
    return typeof v?.report === 'string' ? v : null;
  } catch {
    return null;
  }
}
function storeSaved(pid: number, v: Saved) {
  try {
    window.localStorage.setItem(storageKey(pid), JSON.stringify(v));
  } catch {
    /* bộ nhớ đầy / chế độ riêng tư — bỏ qua */
  }
}

function Segmented<T extends string>({ label, options, value, onChange }: { label: string; options: Array<{ id: T; label: string }>; value: T; onChange: (v: T) => void }) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex max-w-full rounded-[var(--w-radius)] border border-[var(--w-border-strong)] bg-[var(--w-sunken)] p-0.5">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={value === o.id}
          onClick={() => onChange(o.id)}
          className={cn(
            'whitespace-nowrap rounded-[5px] px-2.5 py-1 text-[12px] font-medium transition-colors',
            value === o.id ? 'bg-[var(--w-panel)] text-[var(--w-text)] shadow-[0_1px_2px_rgba(0,0,0,0.12)]' : 'text-[var(--w-text-2)] hover:text-[var(--w-text)]',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export default function WeeklyReportTab({ pid, config }: { pid: number; config: ProjectConfig }) {
  const [audience, setAudience] = useState<Audience>('teacher');
  const [language, setLanguage] = useState<Lang>('en');
  const [saved, setSaved] = useState<Saved | null>(null);
  const [copied, setCopied] = useState(false);
  const [factsOpen, setFactsOpen] = useState(false);
  const canUse = config.permissions.useAi;

  // Đọc sau khi mount để không lệch HTML lúc hydrate.
  useEffect(() => {
    const s = loadSaved(pid);
    setSaved(s);
    if (s) {
      setAudience(s.audience);
      setLanguage(s.language);
    }
  }, [pid]);

  const gen = useMutation({
    mutationFn: () => workApi.aiWeeklyReport(pid, { audience, language }),
    onSuccess: (r) => {
      const v: Saved = { report: r.report, facts: r.facts, audience, language, at: new Date().toISOString() };
      setSaved(v);
      storeSaved(pid, v);
      setFactsOpen(false);
    },
  });

  const copy = async () => {
    if (!saved) return;
    try {
      await navigator.clipboard.writeText(saved.report);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard bị chặn — không làm gì */
    }
  };

  const download = () => {
    if (!saved) return;
    const blob = new Blob([saved.report], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.key}-weekly-report-${saved.at.slice(0, 10)}.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const quotaHit = gen.error && isAiQuotaError(gen.error);
  const audienceHint = AUDIENCES.find((a) => a.id === audience)?.hint;

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-end">
          <div className="min-w-0">
            <div className="w-label">Audience</div>
            <Segmented label="Audience" options={AUDIENCES} value={audience} onChange={setAudience} />
          </div>
          <div className="min-w-0">
            <div className="w-label">Language</div>
            <Segmented label="Language" options={LANGS} value={language} onChange={setLanguage} />
          </div>
          <div className="md:ml-auto">
            <button type="button" className="w-btn w-btn-primary w-full md:w-auto" disabled={!canUse || gen.isPending} onClick={() => gen.mutate()}>
              {gen.isPending ? <Spinner size={14} /> : <Sparkles size={14} />}
              {gen.isPending ? 'Writing…' : saved ? 'Regenerate' : 'Generate'}
            </button>
          </div>
        </div>
        <p className="mt-3 text-[12px] leading-relaxed text-[var(--w-text-3)]">
          {audienceHint}. Numbers come from your project data; AI only writes the text. Uses 1 AI request.
        </p>
        {!canUse && (
          <p className="mt-2 text-[12px] text-[var(--w-orange)]">You don&apos;t have permission to use AI in this project. Ask a project admin to enable it for your role.</p>
        )}
      </Card>

      {quotaHit ? (
        <div className="rounded-[var(--w-radius-lg)] border border-[var(--w-accent-border)] bg-[var(--w-accent-soft)] px-4 py-3">
          <div className="text-[14px] font-semibold">You&apos;ve used all your free AI requests</div>
          <p className="mt-1 text-[13px] text-[var(--w-text-2)]">Upgrade to Pro for more AI requests every day. Health and other reports stay free.</p>
          <Link href="/pro" className="w-btn w-btn-primary w-btn-sm mt-3 inline-flex">Upgrade to Pro</Link>
        </div>
      ) : gen.error ? (
        <div className="rounded-[var(--w-radius-lg)] border border-[color-mix(in_srgb,var(--w-red)_40%,transparent)] px-4 py-3 text-[13px] text-[var(--w-red)]">
          {workError(gen.error, 'Could not generate the report')}
        </div>
      ) : null}

      {gen.isPending && !saved && (
        <Card className="flex items-center justify-center gap-2 py-12 text-[13px] text-[var(--w-text-2)]">
          <Spinner size={16} /> Gathering facts and writing your report…
        </Card>
      )}

      {saved ? (
        <Card className={cn('p-0', gen.isPending && 'opacity-60')}>
          <div className="flex flex-wrap items-center gap-2 border-b border-[var(--w-border)] px-4 py-2.5">
            <div className="min-w-0 flex-1 text-[12px] text-[var(--w-text-3)]">
              {AUDIENCES.find((a) => a.id === saved.audience)?.label} · {saved.language === 'vi' ? 'Tiếng Việt' : 'English'} ·{' '}
              {new Date(saved.at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
            </div>
            <button type="button" className="w-btn w-btn-sm" onClick={copy}>
              {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? 'Copied' : 'Copy'}
            </button>
            <button type="button" className="w-btn w-btn-sm" onClick={download}>
              <Download size={13} /> Download .md
            </button>
          </div>
          <div className="w-prose min-w-0 overflow-x-hidden px-4 py-4">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                table: ({ children }) => (
                  <div className="mb-2 max-w-full overflow-x-auto">
                    <table className="w-full border-collapse text-[13px] [&_td]:border [&_td]:border-[var(--w-border)] [&_td]:px-2 [&_td]:py-1 [&_th]:border [&_th]:border-[var(--w-border)] [&_th]:px-2 [&_th]:py-1 [&_th]:text-left">{children}</table>
                  </div>
                ),
                a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>,
              }}
            >
              {saved.report}
            </ReactMarkdown>
          </div>
          <div className="border-t border-[var(--w-border)]">
            <button
              type="button"
              aria-expanded={factsOpen}
              onClick={() => setFactsOpen((v) => !v)}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[12px] font-medium text-[var(--w-text-2)] hover:bg-[var(--w-hover)]"
            >
              <ChevronDown size={14} className={cn('transition-transform', !factsOpen && '-rotate-90')} />
              Facts used
              <span className="font-normal text-[var(--w-text-3)]">— the data the AI was given, so you can check nothing was invented</span>
            </button>
            {factsOpen && (
              <pre className="mx-4 mb-4 max-h-[360px] overflow-auto whitespace-pre-wrap break-words rounded-[var(--w-radius)] border border-[var(--w-border)] bg-[var(--w-sunken)] p-3 font-mono text-[12px] leading-relaxed text-[var(--w-text-2)]">
                {saved.facts}
              </pre>
            )}
          </div>
        </Card>
      ) : (
        !gen.isPending && (
          <Card className="py-10 text-center">
            <div className="text-[14px] font-semibold">No report yet</div>
            <p className="mx-auto mt-1 max-w-[420px] text-[13px] text-[var(--w-text-2)]">
              Pick who it&apos;s for and press Generate. You get a ready-to-send summary of this week&apos;s progress.
            </p>
          </Card>
        )
      )}
    </div>
  );
}
