'use client';

// Gia sư AI cho MỘT bài học Academy. Chat THUẦN, luôn sẵn sàng (khác Code Lab có
// bản giảng cache trước — ở đây hỏi là trả lời ngay). Ngữ cảnh bài học được ghép
// ở server từ lessonId; client chỉ gửi câu hỏi + lịch sử. Pro-gated. Trả lời
// song ngữ Anh–Việt. Mẫu lấy từ nửa "follow-up chat" của code-lab/AiExplain.tsx.

import { useCallback, useEffect, useRef, useState } from 'react';
import { Sparkles, Loader2, Send, MessageCircle, Crown, User } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { usePro } from '@/hooks/usePro';
// Render câu trả lời AI như AI Chat chính: markdown (đậm/danh sách/bảng) +
// công thức toán KaTeX + code tô màu + sơ đồ SVG. KHÔNG để markdown thô (**).
import ChatMarkdown from '@/components/chat/ChatMarkdown';

interface Turn { role: 'user' | 'assistant'; content: string }

// Gợi ý mở màn — đúng 5 việc học viên cần: bắt đầu từ đâu · tạo bài tập · kiến
// thức nền · giảng lại chỗ khó.
const QUICK = [
  'Bài này học gì? Tôi nên bắt đầu từ đâu?',
  'Cho tôi 3 bài tập luyện + đáp án để tự kiểm tra.',
  'Kiến thức nền nào cần có trước khi học bài này?',
  'Giảng lại phần khó nhất của bài một cách dễ hiểu.',
];

export function CourseTutor({ lessonId, courseCode, courseTitle, lessonTitle }: {
  lessonId: number; courseCode?: string; courseTitle?: string; lessonTitle?: string;
}) {
  const isAuthed = useAuthStore((s) => s.isAuthenticated);
  // Một nguồn sự thật cho quyền Pro (giống AiExplain) — đừng đoán từ user object.
  const { isPro } = usePro();

  const [turns, setTurns] = useState<Turn[]>([]);
  const [question, setQuestion] = useState('');
  const [asking, setAsking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  // Đổi sang bài học khác → reset hội thoại (ngữ cảnh khác hẳn).
  useEffect(() => { setTurns([]); setQuestion(''); }, [lessonId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [turns, asking]);

  const send = useCallback(async (text: string) => {
    const q = (text || '').trim();
    if (!q || asking) return;
    setQuestion('');
    const history = turns.slice(-12);
    setTurns((t) => [...t, { role: 'user', content: q }]);
    setAsking(true);
    try {
      const r = await api.post<{ success: boolean; data: { answer: string } }>(
        `/courses/lessons/${lessonId}/ai/ask`, { question: q, history }, { timeout: 240_000 });
      setTurns((t) => [...t, { role: 'assistant', content: r.data.data.answer }]);
    } catch (e: unknown) {
      const status = (e as { response?: { status?: number } })?.response?.status;
      setTurns((t) => t.slice(0, -1)); // gỡ câu hỏi vừa thêm để thử lại
      setQuestion(q);
      toast.error(status === 403 ? 'Hỏi AI là tính năng Pro.' : 'AI chưa trả lời được. Thử lại nhé.');
    } finally { setAsking(false); }
  }, [asking, turns, lessonId]);

  const label = [courseCode, courseTitle].filter(Boolean).join(' · ') || 'khoá học';

  return (
    <section className="mb-5">
      <h2 className="mb-2 flex flex-wrap items-center gap-2 text-sm font-bold uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
        <Sparkles size={14} /> Hỏi AI · {courseCode || 'Khoá học'}
        <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
          style={{ background: 'linear-gradient(90deg,#f59e0b,#f97316)', color: '#fff' }}>
          <Crown size={10} /> Pro
        </span>
      </h2>

      <div className="rounded-xl border p-4" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}>
        <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase" style={{ color: 'var(--text-secondary)' }}>
          <MessageCircle size={13} /> Gia sư riêng cho bài &ldquo;{lessonTitle || label}&rdquo;
        </div>
        <p className="mb-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Hỏi bất cứ điều gì về bài này — bắt đầu từ đâu, chỗ chưa hiểu, kiến thức nền còn thiếu,
          xin bài tập luyện, hoặc dán bài của bạn nhờ chữa. Trả lời song ngữ Anh–Việt.
        </p>

        {turns.length > 0 && (
          <div className="mb-2 max-h-[460px] space-y-2 overflow-y-auto pr-1">
            {turns.map((t, i) => (
              <div key={i} className="flex gap-2">
                <span className="mt-0.5 shrink-0">
                  {t.role === 'user'
                    ? <User size={14} style={{ color: 'var(--text-muted)' }} />
                    : <Sparkles size={14} style={{ color: 'var(--accent-color, #8b5cf6)' }} />}
                </span>
                <div className="ct-answer min-w-0 flex-1 rounded-lg px-3 py-2 text-sm"
                  style={{ background: t.role === 'user' ? 'var(--bg-surface)' : 'var(--bg-surface-active, var(--bg-surface))', color: 'var(--text-primary)' }}>
                  {t.role === 'user'
                    ? <span className="whitespace-pre-wrap">{t.content}</span>
                    : <ChatMarkdown content={t.content} />}
                </div>
              </div>
            ))}
            {asking && (
              <div className="flex items-center gap-2 px-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                <Loader2 size={14} className="animate-spin" /> Đang nghĩ…
              </div>
            )}
            <div ref={endRef} />
          </div>
        )}

        {!isAuthed ? (
          <Link href="/login" className="text-sm underline" style={{ color: '#6366f1' }}>Đăng nhập để dùng gia sư AI</Link>
        ) : !isPro ? (
          <Link href="/pro" className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold"
            style={{ background: 'linear-gradient(90deg,#f59e0b,#f97316)', color: '#fff' }}>
            <Crown size={15} /> Nâng cấp Pro để hỏi AI
          </Link>
        ) : (
          <>
            {turns.length === 0 && (
              <div className="mb-2 flex flex-wrap gap-1.5">
                {QUICK.map((s) => (
                  <button key={s} type="button" onClick={() => void send(s)} disabled={asking}
                    className="rounded-full border px-2.5 py-1 text-left text-xs disabled:opacity-40"
                    style={{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-secondary)' }}>
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div className="flex items-end gap-2">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void send(question); } }}
                rows={2}
                placeholder="Hỏi bất cứ điều gì về bài này — hoặc dán code/bài làm của bạn nhờ chữa…"
                className="flex-1 resize-none rounded-lg border px-3 py-2 text-sm outline-none"
                style={{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
              />
              <button onClick={() => void send(question)} disabled={asking || !question.trim()}
                className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold disabled:opacity-40"
                style={{ background: 'var(--accent-color, #8b5cf6)', color: '#fff' }}>
                <Send size={14} /> Hỏi
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
