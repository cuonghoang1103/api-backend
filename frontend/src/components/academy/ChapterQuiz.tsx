'use client';

// Đề luyện CUỐI CHƯƠNG — lấy đúng câu hỏi ĐỀ THẬT (FE/PE/PT) đã gán về chương
// (ExamQuestion.sectionId) và cho làm ngay trong bài học, tự chấm.
// - Render Y HỆT phòng thi: dùng lại ExamRichContent (KaTeX + sơ đồ mermaid +
//   HTML + xuống dòng) cho đề/đáp án/giải thích, kèm ảnh (imageUrl).
// - Chấm tự động (một hoặc nhiều đáp án), hiện đúng/sai + giải thích từng câu.
// - Bên dưới có gia sư AI BIẾT các câu quiz: gõ "câu 3 …" là nó hiểu ngay.

import { useCallback, useMemo, useRef, useState } from 'react';
import {
  FileQuestion, Loader2, Shuffle, ListChecks, X, CheckCircle2, XCircle,
  RotateCcw, Languages,
} from 'lucide-react';
import { api } from '@/lib/api';
import ExamRichContent from '@/app/exam/ExamRichContent';
import { pickLang } from '@/lib/utils';
import { CourseTutor, type TutorQuizItem } from './CourseTutor';

interface ExamQ {
  id: number;
  prompt: string;
  imageUrl: string | null;
  options: unknown; // [{text}] | string[]
  correctIndexes: number[];
  explanation?: string | null;
  points: number;
  examKind?: string | null;
}

const normOpts = (o: unknown): string[] =>
  Array.isArray(o) ? o.map((x) => (typeof x === 'string' ? x : ((x as { text?: string })?.text ?? ''))) : [];
const sameSet = (a: number[], b: number[]) =>
  a.length === b.length && [...a].sort((x, y) => x - y).join(',') === [...b].sort((x, y) => x - y).join(',');
const LETTER = (i: number) => String.fromCharCode(65 + i); // 0 → A

// ── Một câu hỏi (render như phòng thi) ────────────────────────────────
function QuestionCard({ q, idx, L, selected, submitted, onToggle }: {
  q: ExamQ; idx: number; L: 'vi' | 'en'; selected: number[]; submitted: boolean;
  onToggle: (q: ExamQ, i: number) => void;
}) {
  const opts = normOpts(q.options);
  const multi = (q.correctIndexes?.length || 0) > 1;
  const isRight = submitted && sameSet(selected, q.correctIndexes || []);

  return (
    <div className="rounded-xl border p-4" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}>
      <div className="mb-2 flex items-center gap-2">
        <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-lg px-1.5 text-xs font-bold"
          style={{ background: 'var(--bg-surface)', color: 'var(--accent-color, #8b5cf6)' }}>Câu {idx + 1}</span>
        {q.examKind && <span className="rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase" style={{ background: 'var(--bg-surface)', color: 'var(--text-muted)' }}>{q.examKind}</span>}
        {multi && <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>(chọn nhiều đáp án)</span>}
        {submitted && (isRight
          ? <CheckCircle2 size={16} className="ml-auto" style={{ color: 'var(--exam-ok, #22c55e)' }} />
          : <XCircle size={16} className="ml-auto" style={{ color: 'var(--exam-bad, #ef4444)' }} />)}
      </div>

      <ExamRichContent html={q.prompt} L={L} className="text-sm leading-relaxed" />
      {q.imageUrl && (
        <img src={q.imageUrl} alt="" className="mt-2 max-w-full rounded-lg border" style={{ borderColor: 'var(--border-color)' }} />
      )}

      <div className="mt-3 space-y-1.5">
        {opts.map((o, i) => {
          const sel = selected.includes(i);
          const correct = (q.correctIndexes || []).includes(i);
          // Màu sau khi nộp: đúng→xanh, chọn-nhưng-sai→đỏ, còn lại→thường.
          let border = 'var(--border-color)'; let bg = 'var(--bg-surface)'; let color = 'var(--text-primary)';
          if (submitted && correct) { border = 'var(--exam-ok, #22c55e)'; bg = 'rgba(34,197,94,0.12)'; }
          else if (submitted && sel && !correct) { border = 'var(--exam-bad, #ef4444)'; bg = 'rgba(239,68,68,0.12)'; }
          else if (sel) { border = 'var(--accent-color, #8b5cf6)'; bg = 'var(--bg-surface-active, var(--bg-surface))'; }
          return (
            <button key={i} type="button" disabled={submitted} onClick={() => onToggle(q, i)}
              className="flex w-full items-start gap-2.5 rounded-lg border px-3 py-2 text-left text-sm transition-colors disabled:cursor-default"
              style={{ borderColor: border, background: bg, color }}>
              <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[11px] font-bold"
                style={{ background: sel || (submitted && correct) ? 'var(--accent-color, #8b5cf6)' : 'transparent', color: sel || (submitted && correct) ? '#fff' : 'var(--text-muted)', border: `1px solid ${sel || (submitted && correct) ? 'transparent' : 'var(--border-color)'}` }}>
                {LETTER(i)}
              </span>
              <ExamRichContent html={o} L={L} inline className="pt-0.5" />
              {submitted && correct && <CheckCircle2 size={14} className="ml-auto mt-0.5 shrink-0" style={{ color: 'var(--exam-ok, #22c55e)' }} />}
            </button>
          );
        })}
      </div>

      {submitted && q.explanation && (
        <div className="mt-2 rounded-lg border-l-2 p-2.5 text-[13px]" style={{ borderColor: 'var(--accent-color, #8b5cf6)', background: 'var(--bg-surface)' }}>
          <span className="mb-1 block text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Giải thích</span>
          <ExamRichContent html={q.explanation} L={L} className="exam-explain" />
        </div>
      )}
    </div>
  );
}

export function ChapterQuiz({ sectionId, sectionTitle, count, lessonId }: {
  sectionId: number; sectionTitle?: string; count: number; lessonId?: number;
}) {
  const [qs, setQs] = useState<ExamQ[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [L, setL] = useState<'vi' | 'en'>('vi');
  const [ans, setAns] = useState<Record<number, number[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  const start = useCallback(async (mode: 'random' | 'all') => {
    setLoading(true); setErr(null);
    try {
      const params = mode === 'random' ? { random: 1, limit: 10 } : {};
      const r = await api.get<{ success: boolean; data: ExamQ[] }>(`/exams/practice/by-section/${sectionId}`, { params });
      const data = r.data?.data ?? [];
      if (!data.length) { setErr('Chương này chưa có câu luyện.'); return; }
      setQs(data); setAns({}); setSubmitted(false);
    } catch {
      setErr('Không tải được đề luyện. Thử lại nhé.');
    } finally {
      setLoading(false);
    }
  }, [sectionId]);

  const toggle = useCallback((q: ExamQ, i: number) => {
    setAns((prev) => {
      const cur = prev[q.id] || [];
      const multi = (q.correctIndexes?.length || 0) > 1;
      if (multi) return { ...prev, [q.id]: cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i] };
      return { ...prev, [q.id]: [i] };
    });
  }, []);

  const score = useMemo(() => {
    if (!qs || !submitted) return null;
    let ok = 0;
    for (const q of qs) if (sameSet(ans[q.id] || [], q.correctIndexes || [])) ok++;
    return { ok, total: qs.length, pct: Math.round((ok / qs.length) * 100) };
  }, [qs, submitted, ans]);

  // Ngữ cảnh cho gia sư: "câu N" → đề + đáp án câu đó (đã pickLang tiếng Việt).
  const quizContext: TutorQuizItem[] = useMemo(() => (qs || []).slice(0, 25).map((q, i) => ({
    n: i + 1,
    prompt: pickLang(q.prompt, 'vi'),
    options: normOpts(q.options).map((o) => pickLang(o, 'vi')),
    correctIndexes: q.correctIndexes || [],
    explanation: q.explanation ? pickLang(q.explanation, 'vi') : undefined,
  })), [qs]);

  const answered = qs ? qs.filter((q) => (ans[q.id] || []).length).length : 0;

  // ── Thẻ mở (chưa tải câu) ──
  if (!qs) {
    return (
      <div className="ml-2 mt-2 rounded-xl border p-3.5" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)' }}>
        <p className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          <FileQuestion className="h-4 w-4" style={{ color: 'var(--accent-color, #8b5cf6)' }} /> Đề luyện cuối chương — {count} câu
        </p>
        <p className="mt-0.5 text-xs" style={{ color: 'var(--text-muted)' }}>
          Câu hỏi <b>thật</b> từ đề FE/PE/PT của kiến thức chương này. Học xong chương thì làm luôn để tự kiểm tra — chấm ngay, có giải thích + hỏi được gia sư.
        </p>
        <div className="mt-2.5 flex flex-wrap gap-2">
          <button disabled={loading} onClick={() => start('random')}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: 'var(--accent-color, #8b5cf6)' }}>
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Shuffle className="h-3.5 w-3.5" />} 10 câu ngẫu nhiên
          </button>
          <button disabled={loading} onClick={() => start('all')}
            className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors hover:opacity-90 disabled:opacity-50"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
            <ListChecks className="h-3.5 w-3.5" /> Làm tất cả {count} câu
          </button>
        </div>
        {err && <p className="mt-2 text-[11px]" style={{ color: 'var(--exam-bad, #ef4444)' }}>{err}</p>}
      </div>
    );
  }

  // ── Đang làm / đã nộp ──
  return (
    <div ref={topRef} className="ml-2 mt-2 rounded-xl border" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)' }}>
      {/* Header */}
      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-2 rounded-t-xl border-b px-4 py-2.5"
        style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}>
        <span className="flex items-center gap-1.5 text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
          <FileQuestion className="h-4 w-4" style={{ color: 'var(--accent-color, #8b5cf6)' }} />
          Đề luyện{sectionTitle ? ` · ${sectionTitle}` : ''}
        </span>
        {score
          ? <span className="rounded-full px-2 py-0.5 text-xs font-bold" style={{ background: score.pct >= 50 ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: score.pct >= 50 ? 'var(--exam-ok,#22c55e)' : 'var(--exam-bad,#ef4444)' }}>
              Đúng {score.ok}/{score.total} · {score.pct}%
            </span>
          : <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Đã trả lời {answered}/{qs.length}</span>}
        <div className="ml-auto flex items-center gap-2">
          <button type="button" onClick={() => setL((v) => (v === 'vi' ? 'en' : 'vi'))}
            className="inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-semibold" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
            <Languages size={12} /> {L === 'vi' ? 'EN' : 'VI'}
          </button>
          <button type="button" onClick={() => setQs(null)} className="inline-flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
            <X className="h-3.5 w-3.5" /> Đóng
          </button>
        </div>
        {/* progress bar */}
        <div className="h-1 w-full overflow-hidden rounded-full" style={{ background: 'var(--bg-surface)' }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${(answered / qs.length) * 100}%`, background: 'var(--accent-color, #8b5cf6)' }} />
        </div>
      </div>

      {/* Câu hỏi */}
      <div className="space-y-3 p-4">
        {qs.map((q, i) => (
          <QuestionCard key={q.id} q={q} idx={i} L={L} selected={ans[q.id] || []} submitted={submitted} onToggle={toggle} />
        ))}

        {/* Nộp / kết quả / làm lại */}
        {!submitted ? (
          <button type="button" onClick={() => { setSubmitted(true); topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
            className="w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: 'var(--accent-color, #8b5cf6)' }}>
            Nộp bài — chấm {qs.length} câu {answered < qs.length ? `(còn ${qs.length - answered} câu chưa chọn)` : ''}
          </button>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Kết quả: {score?.ok}/{score?.total} đúng ({score?.pct}%)
            </span>
            <button type="button" onClick={() => { setAns({}); setSubmitted(false); topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
              className="ml-auto inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
              <RotateCcw className="h-3.5 w-3.5" /> Làm lại
            </button>
            <button type="button" onClick={() => start('random')}
              className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
              <Shuffle className="h-3.5 w-3.5" /> Đổi 10 câu khác
            </button>
          </div>
        )}

        {/* Gia sư AI biết các câu quiz — hỏi "câu N" là hiểu ngay */}
        {lessonId && (
          <div className="mt-2 border-t pt-3" style={{ borderColor: 'var(--border-color)' }}>
            <CourseTutor lessonId={lessonId} lessonTitle={sectionTitle} quizContext={quizContext} />
          </div>
        )}
      </div>
    </div>
  );
}
