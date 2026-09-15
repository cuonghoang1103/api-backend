'use client';

/**
 * ============================================================
 * HỎI AI VỀ CHÍNH BÀI GIẢNG ĐANG ĐỌC
 * ============================================================
 *
 * Người học dừng lại ở một đoạn không hiểu thì hỏi ngay tại đó, thay vì mở một
 * cửa sổ chat khác rồi phải tự chép lại ngữ cảnh. Câu trả lời đứng trên CHÍNH
 * chữ của bài giảng (backend nhét thân bài vào prompt), nên nó không diễn đạt
 * lại bằng từ khác — với môn chấm từng ký tự, hai cách nói cho cùng một luật là
 * đủ làm người học tưởng có hai luật.
 *
 * `muc` gửi kèm là tiêu đề phần đang đọc: bài giảng ở đây dài tới 272 khối, và
 * nếu không nói đang hỏi phần nào thì backend buộc phải cắt từ đầu — tức là luôn
 * cắt mất phần cuối, vốn là phần khó nên mới bị hỏi.
 */
import { useRef, useState } from 'react';
import { Sparkles, Loader2, Send, User, CornerDownLeft } from 'lucide-react';
import Markdown from '@/components/markdown/Markdown';
import { codeLabApi } from '@/lib/code-lab-api';
import { useAuthStore } from '@/store/authStore';

interface Luot { role: 'user' | 'assistant'; content: string }

const GOI_Y = [
  'Giải thích mục này bằng lời đơn giản hơn',
  'Cho một ví dụ code ngắn',
  'Chỗ này thầy hay hỏi gì khi review?',
  'Nếu làm sai chỗ này thì hỏng thế nào?',
];

export function LessonAsk({ moduleId, parts, lang }: {
  moduleId: number;
  parts: Array<{ id: string; text: string; number?: string }>;
  lang: 'en' | 'vi';
}) {
  const isAuthed = useAuthStore((s) => !!s.user);
  const [hoi, setHoi] = useState('');
  const [muc, setMuc] = useState('');
  const [luots, setLuots] = useState<Luot[]>([]);
  const [dangHoi, setDangHoi] = useState(false);
  const [loi, setLoi] = useState<string | null>(null);
  // Bộ gõ tiếng Việt báo "đang ghép chữ"; Enter lúc đó là để CHỐT chữ, không
  // phải để gửi. Không chặn thì câu gửi đi cụt ngay giữa từ đang gõ.
  const dangGhepChu = useRef(false);

  const gui = async (cau?: string) => {
    const noiDung = (cau ?? hoi).trim();
    if (!noiDung || dangHoi) return;
    setLoi(null);
    setHoi('');
    const lichSu = luots.slice(-8);
    setLuots((cu) => [...cu, { role: 'user', content: noiDung }]);
    setDangHoi(true);
    try {
      const res = await codeLabApi.askLesson(moduleId, { question: noiDung, muc: muc || undefined, history: lichSu });
      setLuots((cu) => [...cu, { role: 'assistant', content: res.data.data.answer }]);
    } catch (e: unknown) {
      const m = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setLoi(m || 'Chưa hỏi được. Thử lại giúp mình nhé.');
    } finally {
      setDangHoi(false);
    }
  };

  return (
    <section
      className="mt-6 overflow-hidden rounded-2xl border"
      style={{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)' }}
    >
      <header className="flex flex-wrap items-center gap-2 border-b px-4 py-3" style={{ borderColor: 'var(--border-color)' }}>
        <Sparkles size={16} style={{ color: 'var(--accent-color, #8b5cf6)' }} />
        <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
          {lang === 'vi' ? 'Hỏi AI về bài giảng này' : 'Ask AI about this lesson'}
        </h3>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {lang === 'vi' ? '— trả lời bám đúng nội dung đang mở' : '— grounded in the page you are reading'}
        </span>
        {parts.length > 1 && (
          <select
            value={muc}
            onChange={(e) => setMuc(e.target.value)}
            className="ml-auto max-w-[min(100%,20rem)] rounded-lg border px-2 py-1 text-xs outline-none"
            style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-secondary)' }}
          >
            <option value="">{lang === 'vi' ? 'Cả bài' : 'Whole lesson'}</option>
            {parts.map((p) => (
              <option key={p.id} value={p.text}>{p.number ? `${p.number}. ` : ''}{p.text}</option>
            ))}
          </select>
        )}
      </header>

      <div className="px-4 py-3">
        {!isAuthed ? (
          <p className="py-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            {lang === 'vi' ? 'Đăng nhập để hỏi AI về bài giảng này.' : 'Sign in to ask about this lesson.'}
          </p>
        ) : (
          <>
            {luots.length > 0 && (
              <div className="mb-3 max-h-[520px] space-y-3 overflow-y-auto pr-1">
                {luots.map((t, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="mt-0.5 shrink-0">
                      {t.role === 'user'
                        ? <User size={15} style={{ color: 'var(--text-muted)' }} />
                        : <Sparkles size={15} style={{ color: 'var(--accent-color, #8b5cf6)' }} />}
                    </span>
                    <div
                      className="min-w-0 flex-1 rounded-xl px-3 py-2 text-sm"
                      style={t.role === 'user'
                        ? { background: 'var(--bg-card)', color: 'var(--text-primary)' }
                        : { background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}
                    >
                      {t.role === 'user'
                        ? <p className="whitespace-pre-wrap">{t.content}</p>
                        : <Markdown mdx={t.content} />}
                    </div>
                  </div>
                ))}
                {dangHoi && (
                  <div className="flex items-center gap-2 px-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                    <Loader2 size={14} className="animate-spin" /> {lang === 'vi' ? 'Đang đọc lại bài giảng…' : 'Reading the lesson…'}
                  </div>
                )}
              </div>
            )}

            {luots.length === 0 && (
              <div className="mb-3 flex flex-wrap gap-1.5">
                {GOI_Y.map((g) => (
                  <button
                    key={g}
                    onClick={() => gui(g)}
                    disabled={dangHoi}
                    className="rounded-full border px-3 py-1 text-xs transition-colors hover:bg-[var(--bg-surface-hover)] disabled:opacity-40"
                    style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                  >
                    {g}
                  </button>
                ))}
              </div>
            )}

            {loi && <p className="mb-2 text-sm" style={{ color: '#f87171' }}>{loi}</p>}

            <div className="flex items-end gap-2">
              <textarea
                value={hoi}
                onChange={(e) => setHoi(e.target.value)}
                onCompositionStart={() => { dangGhepChu.current = true; }}
                onCompositionEnd={() => { dangGhepChu.current = false; }}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter' || e.shiftKey) return;
                  // `isComposing` là cờ của chính sự kiện; `dangGhepChu` là lưới
                  // đỡ cho trình duyệt không bắn composition đúng lúc.
                  if (dangGhepChu.current || (e.nativeEvent as unknown as { isComposing?: boolean }).isComposing) return;
                  e.preventDefault();
                  void gui();
                }}
                rows={2}
                placeholder={lang === 'vi' ? 'Chỗ nào chưa hiểu? Hỏi thẳng vào đây…' : 'What part is unclear?'}
                className="flex-1 resize-none rounded-xl border px-3 py-2 text-sm outline-none"
                style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
              />
              <button
                onClick={() => void gui()}
                disabled={dangHoi || !hoi.trim()}
                className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold disabled:opacity-40"
                style={{ background: 'var(--accent-color, #8b5cf6)', color: '#fff' }}
              >
                {dangHoi ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                {lang === 'vi' ? 'Hỏi' : 'Ask'}
              </button>
            </div>
            <p className="mt-1.5 flex items-center gap-1 text-[11px]" style={{ color: 'var(--text-muted)' }}>
              <CornerDownLeft size={11} /> Enter {lang === 'vi' ? 'để gửi · Shift+Enter xuống dòng' : 'to send · Shift+Enter for a new line'}
            </p>
          </>
        )}
      </div>
    </section>
  );
}
