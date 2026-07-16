'use client';

/**
 * AiAssistPanel — AI authoring controls for the tech-trends admin editor.
 *
 * Four actions, all backed by the interview LLM gateway (no new env/dep):
 *   - Draft:   topic + notes → a full article (fills the whole form)
 *   - FixBug:  error/trace   → a #FixBug post-mortem + Before/After code block
 *   - Enrich:  current body  → summary + tags + read-time + emoji
 *   - Rewrite: instruction   → a polished rewrite of the current body
 *
 * The panel is decoupled from the parent's ArticleForm type: it reads a few
 * primitives (category/title/body) and calls back with the generated payload.
 * If the server reports AI unavailable, the whole panel renders a disabled
 * hint instead of the controls.
 */

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Sparkles, Wand2, Bug, Tags, RefreshCw, Loader2, ChevronDown } from 'lucide-react';
import { adminTechTrendsApi, type AiGeneratedArticle } from '@/lib/api';
import type { Category } from '@/app/tech-trends/types';

type Mode = 'draft' | 'fixbug';

interface Props {
  category: Category;
  currentTitle: string;
  currentBody: string;
  onApplyArticle: (a: AiGeneratedArticle) => void;
  onApplyEnrich: (e: { summary: string; tags: string[]; readTimeMin: number; coverEmoji: string }) => void;
  onApplyBody: (bodyMdx: string) => void;
}

function errMsg(err: unknown, fallback: string): string {
  return err instanceof Error && err.message ? err.message : fallback;
}

export default function AiAssistPanel({
  category,
  currentTitle,
  currentBody,
  onApplyArticle,
  onApplyEnrich,
  onApplyBody,
}: Props) {
  const [available, setAvailable] = useState<boolean | null>(null);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>('draft');
  const [busy, setBusy] = useState<null | 'draft' | 'fixbug' | 'enrich' | 'rewrite'>(null);

  // Draft inputs
  const [topic, setTopic] = useState('');
  const [notes, setNotes] = useState('');
  // FixBug inputs
  const [errorText, setErrorText] = useState('');
  const [context, setContext] = useState('');
  // Rewrite input
  const [instruction, setInstruction] = useState('');

  useEffect(() => {
    let cancelled = false;
    adminTechTrendsApi
      .aiStatus()
      .then((r) => { if (!cancelled) setAvailable(!!r.data.data.available); })
      .catch(() => { if (!cancelled) setAvailable(false); });
    return () => { cancelled = true; };
  }, []);

  const runDraft = async () => {
    if (!topic.trim()) { toast.error('Nhập chủ đề trước'); return; }
    setBusy('draft');
    try {
      const res = await adminTechTrendsApi.aiDraft({ topic: topic.trim(), category, notes: notes.trim() || undefined });
      onApplyArticle(res.data.data);
      toast.success('Đã tạo nháp — kiểm tra & chỉnh lại trước khi lưu');
    } catch (err) {
      toast.error(errMsg(err, 'Tạo nháp thất bại'));
    } finally {
      setBusy(null);
    }
  };

  const runFixBug = async () => {
    if (!errorText.trim()) { toast.error('Dán lỗi / stack trace trước'); return; }
    setBusy('fixbug');
    try {
      const res = await adminTechTrendsApi.aiFixBug({ errorText: errorText.trim(), context: context.trim() || undefined });
      onApplyArticle(res.data.data);
      toast.success('Đã dựng bài #FixBug — kiểm tra code Before/After');
    } catch (err) {
      toast.error(errMsg(err, 'Dựng bài thất bại'));
    } finally {
      setBusy(null);
    }
  };

  const runEnrich = async () => {
    if (!currentBody.trim()) { toast.error('Cần có nội dung bài trước'); return; }
    setBusy('enrich');
    try {
      const res = await adminTechTrendsApi.aiEnrich({ title: currentTitle, bodyMdx: currentBody, category });
      const d = res.data.data;
      onApplyEnrich({ summary: d.summary, tags: d.tags, readTimeMin: d.readTimeMin, coverEmoji: d.coverEmoji });
      toast.success('Đã tạo tóm tắt + tags + thời gian đọc');
    } catch (err) {
      toast.error(errMsg(err, 'Tạo metadata thất bại'));
    } finally {
      setBusy(null);
    }
  };

  const runRewrite = async () => {
    if (!currentBody.trim()) { toast.error('Cần có nội dung để viết lại'); return; }
    setBusy('rewrite');
    try {
      const res = await adminTechTrendsApi.aiRewrite({ bodyMdx: currentBody, instruction: instruction.trim() || 'làm rõ ràng, mạch lạc hơn' });
      onApplyBody(res.data.data.bodyMdx);
      toast.success('Đã viết lại nội dung');
    } catch (err) {
      toast.error(errMsg(err, 'Viết lại thất bại'));
    } finally {
      setBusy(null);
    }
  };

  // Hidden entirely when the probe says AI is off — no dead controls.
  if (available === false) {
    return (
      <div className="rounded-xl border border-darkborder bg-darkbg/40 px-4 py-3 text-xs text-text-muted flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-text-muted" />
        Trợ lý AI chưa bật trên server (thiếu API key). Bạn vẫn soạn bài thủ công bình thường.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-neon-violet/30 bg-neon-violet/[0.04] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-text-primary hover:bg-white/[0.02] transition-colors"
      >
        <Sparkles className="w-4 h-4 text-neon-violet" />
        <span>Trợ lý AI</span>
        <span className="text-xs text-text-muted font-normal">— tạo nháp, dựng #FixBug, tóm tắt & viết lại</span>
        {available === null && <Loader2 className="w-3.5 h-3.5 animate-spin text-text-muted ml-1" />}
        <ChevronDown className={['w-4 h-4 text-text-muted ml-auto transition-transform', open ? 'rotate-180' : ''].join(' ')} />
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-4 border-t border-neon-violet/20">
          {/* Mode switch */}
          <div className="flex gap-1.5 pt-3">
            <ModeBtn active={mode === 'draft'} onClick={() => setMode('draft')} icon={<Wand2 className="w-3.5 h-3.5" />} label="Tạo nháp" />
            <ModeBtn active={mode === 'fixbug'} onClick={() => setMode('fixbug')} icon={<Bug className="w-3.5 h-3.5" />} label="Từ lỗi (FixBug)" />
          </div>

          {mode === 'draft' ? (
            <div className="space-y-2">
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Chủ đề bài viết, vd: 'Tại sao React key quan trọng'"
                className={aiInput}
              />
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Ghi chú / dàn ý / dữ kiện (tuỳ chọn) — AI sẽ dựa vào đây"
                className={aiInput + ' resize-y'}
              />
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-text-muted">Điền vào chuyên mục <b className="text-text-secondary">#{category}</b></span>
                <AiRunBtn busy={busy === 'draft'} onClick={runDraft} label="Tạo nháp bài" />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <textarea
                value={errorText}
                onChange={(e) => setErrorText(e.target.value)}
                rows={4}
                placeholder="Dán error message / stack trace ở đây"
                className={aiInput + ' font-mono text-xs resize-y'}
              />
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                rows={2}
                placeholder="Bối cảnh (tuỳ chọn): stack công nghệ, bạn đã thử gì..."
                className={aiInput + ' resize-y'}
              />
              <div className="flex items-center justify-end">
                <AiRunBtn busy={busy === 'fixbug'} onClick={runFixBug} label="Dựng bài #FixBug" />
              </div>
            </div>
          )}

          {/* Operate-on-current-body tools */}
          <div className="pt-2 border-t border-neon-violet/15 space-y-2">
            <p className="text-[11px] text-text-muted">Áp dụng lên nội dung hiện tại của bài:</p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={runEnrich}
                disabled={busy === 'enrich'}
                className={aiChip}
              >
                {busy === 'enrich' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Tags className="w-3.5 h-3.5" />}
                Tóm tắt + Tags + Thời gian đọc
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <input
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                placeholder="Hướng dẫn viết lại, vd: 'ngắn gọn hơn', 'thêm ví dụ'"
                className={aiInput + ' flex-1 min-w-[180px]'}
              />
              <button
                type="button"
                onClick={runRewrite}
                disabled={busy === 'rewrite'}
                className={aiChip}
              >
                {busy === 'rewrite' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                Viết lại
              </button>
            </div>
          </div>

          <p className="text-[11px] text-text-muted leading-relaxed">
            ⚠️ AI có thể sai — luôn đọc lại, kiểm chứng code và dữ kiện trước khi xuất bản.
          </p>
        </div>
      )}
    </div>
  );
}

function ModeBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
        active ? 'bg-neon-violet/20 text-neon-violet' : 'text-text-secondary hover:bg-white/[0.04] hover:text-text-primary',
      ].join(' ')}
    >
      {icon}
      {label}
    </button>
  );
}

function AiRunBtn({ busy, onClick, label }: { busy: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-neon-indigo to-neon-violet text-white text-xs font-semibold shadow-neon hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all"
    >
      {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
      {busy ? 'Đang tạo…' : label}
    </button>
  );
}

const aiInput = [
  'w-full px-3 py-2 bg-darkcard border border-darkborder rounded-lg',
  'text-sm text-text-primary placeholder:text-text-muted',
  'focus:outline-none focus:border-neon-violet/50 focus:ring-2 focus:ring-neon-violet/15 transition-all',
].join(' ');

const aiChip = [
  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium',
  'bg-white/[0.04] text-text-secondary border border-darkborder',
  'hover:text-neon-violet hover:border-neon-violet/30 disabled:opacity-50 active:scale-95 transition-all',
].join(' ');
