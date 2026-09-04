'use client';

// CuongMini — AI đồng hành khi thi (Pro only). Nút nổi mở panel trượt từ phải:
// 3 gợi ý dựng sẵn + chat tự do về ĐÚNG câu đang thi + nút "Hiện đáp án".
// Model chính đi cổng rambo riêng (claude-opus-4-8), tự lùi sang gpt-5.6-sol
// (modelapi.vn) nếu rambo lỗi; có công tắc chọn tay. Reset chat mỗi khi đổi câu
// (key={questionId} ở component cha).

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Sparkles, Loader2, Send, X, Eye, Bot, BookOpen } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { examApi } from '@/lib/api';
import ChatMarkdown from '@/components/chat/ChatMarkdown';
import ExamRichContent from '../ExamRichContent';

type Mode = 'how_to_solve' | 'how_to_remember' | 'knowledge' | 'free_qa';
type Provider = 'opus' | 'sol';

interface Turn {
  role: 'user' | 'assistant';
  content: string;
  streaming?: boolean;
}

const QUICK: { mode: Mode; label: string }[] = [
  { mode: 'how_to_solve', label: 'Câu này làm như nào?' },
  { mode: 'how_to_remember', label: 'Câu này nhớ như nào?' },
  { mode: 'knowledge', label: 'Câu này kiến thức là gì?' },
];

function getToken(): string {
  if (typeof document === 'undefined') return '';
  const m = document.cookie.match(/(?:^|;)\s*backend_token=([^;]*)/);
  return m ? decodeURIComponent(m[1]) : '';
}

const toMsg = (t: Turn) => ({ role: t.role, content: t.content });

export default function CuongMiniPanel({ attemptId, questionId, questionLabel, isVi }: {
  attemptId: number;
  questionId: number;
  questionLabel: string; // "Câu 5"
  isVi: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [question, setQuestion] = useState('');
  const [asking, setAsking] = useState(false);
  // undefined = tự động (rambo/Opus trước, lùi sang Sol nếu rambo lỗi/chậm).
  const [provider, setProvider] = useState<Provider | undefined>(undefined);
  const [reveal, setReveal] = useState<{ correctIndexes: number[]; explanation: string | null } | null>(null);
  const [revealArmed, setRevealArmed] = useState(false);
  // undefined = chưa tải; null = câu này chưa được gán chương (ẩn thẻ).
  const [relatedLesson, setRelatedLesson] = useState<{ sectionTitle: string; courseTitle: string; lessonTitle: string; url: string } | null | undefined>(undefined);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, [turns, asking]);

  // Tải link bài học liên quan đúng 1 lần khi panel mở lần đầu cho câu này —
  // tra DB thẳng (ExamQuestion.sectionId), không gọi AI, không cần đợi.
  useEffect(() => {
    if (!open || relatedLesson !== undefined) return;
    examApi.aiRelatedLesson(attemptId, questionId)
      .then((r) => setRelatedLesson(r.data.data))
      .catch(() => setRelatedLesson(null));
  }, [open, relatedLesson, attemptId, questionId]);

  const patch = (i: number, upd: Partial<Turn>) => setTurns((t) => t.map((x, idx) => (idx === i ? { ...x, ...upd } : x)));

  const runStream = useCallback(async (aIdx: number, mode: Mode, q: string, history: Turn[]) => {
    const res = await fetch(`/api/v1/exams/attempts/${attemptId}/ai/ask-stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}) },
      body: JSON.stringify({ questionId, mode, question: q, history: history.map(toMsg), provider }),
    });
    if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let acc = '';
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const frames = buffer.split('\n\n');
      buffer = frames.pop() || '';
      for (const frame of frames) {
        for (const line of frame.split('\n')) {
          if (!line.startsWith('data:')) continue;
          const raw = line.slice(5).trim();
          if (!raw) continue;
          let evt: { type?: string; text?: string; answer?: string; error?: string };
          try { evt = JSON.parse(raw); } catch { continue; }
          if (evt.type === 'delta' && evt.text) { acc += evt.text; patch(aIdx, { content: acc }); }
          else if (evt.type === 'done') { patch(aIdx, { content: evt.answer ?? acc, streaming: false }); return; }
          else if (evt.type === 'error') throw new Error(evt.error || 'AI lỗi');
        }
      }
    }
    if (!acc.trim()) throw new Error('empty stream');
    patch(aIdx, { content: acc, streaming: false });
  }, [attemptId, questionId, provider]);

  const ask = useCallback(async (mode: Mode, text?: string) => {
    const q = (text || '').trim();
    if (mode === 'free_qa' && !q) return;
    if (asking) return;
    setAsking(true);
    const history = turns.filter((t) => !t.streaming);
    const showUser = mode === 'free_qa';
    if (showUser) setQuestion('');
    const aIdx = history.length + (showUser ? 1 : 0);
    setTurns((t) => {
      const base = showUser ? [...t, { role: 'user' as const, content: q }] : [...t];
      return [...base, { role: 'assistant' as const, content: '', streaming: true }];
    });
    try {
      await runStream(aIdx, mode, q, history);
    } catch {
      try {
        const r = await examApi.aiAsk(attemptId, { questionId, mode, question: q, history: history.map(toMsg), provider });
        patch(aIdx, { content: r.data.data.answer, streaming: false });
      } catch (e: unknown) {
        const status = (e as { response?: { status?: number } })?.response?.status;
        setTurns((t) => t.slice(0, showUser ? -2 : -1));
        if (showUser) setQuestion(q);
        toast.error(status === 403 ? 'CuongMini là tính năng Pro.' : 'CuongMini chưa trả lời được. Thử lại nhé.');
      }
    } finally { setAsking(false); }
  }, [asking, turns, runStream, attemptId, questionId, provider]);

  const doReveal = useCallback(async () => {
    try {
      const r = await examApi.aiReveal(attemptId, questionId);
      setReveal(r.data.data);
    } catch (e: unknown) {
      const status = (e as { response?: { status?: number } })?.response?.status;
      toast.error(status === 403 ? 'CuongMini là tính năng Pro.' : 'Không lấy được đáp án.');
    }
  }, [attemptId, questionId]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full px-4 py-3 font-semibold text-white shadow-lg transition-transform active:scale-95"
        style={{ background: 'linear-gradient(135deg,#8b5cf6,#6366f1)' }}
        aria-label="Hỏi CuongMini">
        <Bot className="h-5 w-5" /> {isVi ? 'Hỏi CuongMini' : 'Ask CuongMini'}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button type="button" aria-label="Đóng" className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative flex h-full w-full max-w-md flex-col shadow-2xl"
            style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>
            <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: 'var(--border-color)' }}>
              <div className="flex items-center gap-2 font-bold">
                <Sparkles className="h-4 w-4" style={{ color: '#8b5cf6' }} /> CuongMini · {questionLabel}
              </div>
              <button type="button" onClick={() => setOpen(false)} className="rounded-lg p-1.5 hover:bg-[var(--bg-surface)]"><X className="h-4 w-4" /></button>
            </div>

            <div className="flex items-center gap-1.5 border-b px-4 py-2 text-[11px]" style={{ borderColor: 'var(--border-color)' }}>
              <span className="text-text-muted">Model:</span>
              {([undefined, 'opus', 'sol'] as (Provider | undefined)[]).map((p) => (
                <button key={p ?? 'auto'} type="button" onClick={() => setProvider(p)}
                  className="rounded-full border px-2 py-0.5 font-semibold"
                  style={{
                    borderColor: provider === p ? '#8b5cf6' : 'var(--border-color)',
                    background: provider === p ? 'rgba(139,92,246,.12)' : 'transparent',
                    color: provider === p ? '#8b5cf6' : 'var(--text-secondary)',
                  }}>
                  {p === undefined ? (isVi ? 'Tự động' : 'Auto') : p === 'opus' ? 'Opus 4.8' : 'GPT-5.6-Sol'}
                </button>
              ))}
            </div>

            {relatedLesson && (
              <Link href={relatedLesson.url} target="_blank"
                className="flex items-center gap-2 border-b px-4 py-2 text-xs hover:bg-[var(--bg-surface)]"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                <BookOpen className="h-3.5 w-3.5 shrink-0" style={{ color: '#8b5cf6' }} />
                <span className="min-w-0 flex-1 truncate">
                  {isVi ? 'Học phần liên quan: ' : 'Related lesson: '}
                  <b style={{ color: 'var(--text-primary)' }}>{relatedLesson.sectionTitle}</b>
                  {' · '}{relatedLesson.courseTitle}
                </span>
                <span className="shrink-0 font-semibold" style={{ color: '#8b5cf6' }}>{isVi ? 'Mở →' : 'Open →'}</span>
              </Link>
            )}

            <div className="flex-1 space-y-2 overflow-y-auto px-4 py-3">
              {turns.length === 0 && (
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {isVi ? 'Hỏi CuongMini về câu đang thi — cách làm, cách nhớ, kiến thức nền, hoặc gõ câu hỏi riêng của bạn.' : 'Ask CuongMini about this question — how to solve, how to remember, the underlying knowledge, or your own question.'}
                </p>
              )}
              {turns.map((t, i) => (
                <div key={i} className="rounded-lg px-3 py-2 text-sm"
                  style={{ background: t.role === 'user' ? 'var(--bg-surface)' : 'rgba(139,92,246,.08)' }}>
                  {t.role === 'user'
                    ? <span className="whitespace-pre-wrap">{t.content}</span>
                    : (t.streaming && !t.content)
                      ? <span className="inline-flex items-center gap-2 opacity-70"><Loader2 className="h-3.5 w-3.5 animate-spin" /> {isVi ? 'Đang soạn…' : 'Thinking…'}</span>
                      : <ChatMarkdown content={t.content} renderMath={!t.streaming} />}
                </div>
              ))}
              <div ref={endRef} />

              {reveal && (
                <div className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: '#f59e0b', background: 'rgba(245,158,11,.08)' }}>
                  <div className="mb-1 font-bold">{isVi ? 'Đáp án đúng' : 'Correct answer'}: {reveal.correctIndexes.map((i) => String.fromCharCode(65 + i)).join(', ')}</div>
                  {reveal.explanation && <ExamRichContent html={reveal.explanation} L={isVi ? 'vi' : 'en'} />}
                </div>
              )}
            </div>

            <div className="border-t px-4 py-3" style={{ borderColor: 'var(--border-color)' }}>
              {turns.length === 0 && (
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {QUICK.map((s) => (
                    <button key={s.mode} type="button" onClick={() => void ask(s.mode)} disabled={asking}
                      className="rounded-full border px-2.5 py-1 text-xs disabled:opacity-40"
                      style={{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-secondary)' }}>
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex items-end gap-2">
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void ask('free_qa', question); } }}
                  rows={2}
                  placeholder={isVi ? 'Hỏi CuongMini về câu này…' : 'Ask CuongMini about this question…'}
                  className="flex-1 resize-none rounded-lg border px-3 py-2 text-sm outline-none"
                  style={{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
                />
                <button onClick={() => void ask('free_qa', question)} disabled={asking || !question.trim()}
                  className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-white disabled:opacity-40"
                  style={{ background: '#8b5cf6' }}>
                  {asking ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                </button>
              </div>

              {!reveal && (
                revealArmed ? (
                  <button type="button" onClick={() => void doReveal()}
                    className="mt-2 w-full rounded-lg border py-2 text-sm font-semibold"
                    style={{ borderColor: '#f59e0b', color: '#f59e0b' }}>
                    {isVi ? 'Chắc chắn? Bấm lần nữa để hiện đáp án' : 'Sure? Tap again to reveal'}
                  </button>
                ) : (
                  <button type="button" onClick={() => setRevealArmed(true)}
                    className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border py-2 text-sm font-semibold"
                    style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                    <Eye className="h-3.5 w-3.5" /> {isVi ? 'Hiện đáp án' : 'Show answer'}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
