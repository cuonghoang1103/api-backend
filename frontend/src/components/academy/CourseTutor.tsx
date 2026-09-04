'use client';

// Gia sư AI cho MỘT bài học Academy. Chat THUẦN, luôn sẵn sàng. Ngữ cảnh bài học
// ghép ở server từ lessonId; client gửi câu hỏi + lịch sử. Pro-gated.
// - Trả lời STREAM ("gõ từng chữ") qua SSE; hỏng thì tự lùi về POST thường.
// - Mặc định TIẾNG VIỆT (giữ thuật ngữ tiếng Anh). Mỗi câu trả lời có nút
//   "Bản tiếng Anh" để hỏi lại đúng câu đó bằng tiếng Anh khi cần.

import { useCallback, useEffect, useRef, useState } from 'react';
import { Sparkles, Loader2, Send, MessageCircle, Crown, User, Languages, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { usePro } from '@/hooks/usePro';
// Render câu trả lời như AI Chat chính: markdown + KaTeX + code + sơ đồ SVG.
import ChatMarkdown from '@/components/chat/ChatMarkdown';

interface Turn {
  role: 'user' | 'assistant';
  content: string;
  srcQuestion?: string;  // câu hỏi tạo ra câu trả lời này → để bấm "Bản tiếng Anh"
  srcCacheKey?: string;  // cacheKey của chip (nếu có) → EN dùng lại để cache đúng khoá
  english?: boolean;     // đây LÀ bản tiếng Anh (không hiện nút EN cho nó nữa)
  streaming?: boolean;   // đang gõ dở → hoãn render KaTeX tới khi xong
  enDone?: boolean;      // đã xin bản tiếng Anh cho câu này rồi
  cached?: boolean;      // câu trả lời lấy từ cache (chip) → gắn nhãn "⚡ có sẵn"
}

// Gợi ý mở màn — đúng 5 việc học viên cần. Mỗi chip có `key` cố định để CACHE
// dùng chung: ai bấm cùng chip trên cùng bài đều nhận cùng câu trả lời, tức thì.
const QUICK: { key: string; q: string }[] = [
  { key: 'start', q: 'Bài này học gì? Tôi nên bắt đầu từ đâu?' },
  { key: 'exercises', q: 'Cho tôi 3 bài tập luyện + đáp án để tự kiểm tra.' },
  { key: 'prereq', q: 'Kiến thức nền nào cần có trước khi học bài này?' },
  { key: 'hard', q: 'Giảng lại phần khó nhất của bài một cách dễ hiểu.' },
];

function getToken(): string {
  if (typeof document === 'undefined') return '';
  const m = document.cookie.match(/(?:^|;)\s*backend_token=([^;]*)/);
  return m ? decodeURIComponent(m[1]) : '';
}

const toMsg = (t: Turn) => ({ role: t.role, content: t.content });

// Câu quiz truyền vào để gia sư biết "câu N" là gì (dùng ở Đề luyện cuối chương).
export interface TutorQuizItem { n: number; prompt: string; options: string[]; correctIndexes: number[]; explanation?: string }

export function CourseTutor({ lessonId, courseCode, courseTitle, lessonTitle, quizContext }: {
  lessonId: number; courseCode?: string; courseTitle?: string; lessonTitle?: string;
  /** Có ⇒ chế độ hỏi trong quiz: gia sư biết đề+đáp án các câu, học viên chỉ gõ "câu N". */
  quizContext?: TutorQuizItem[];
}) {
  const isAuthed = useAuthStore((s) => s.isAuthenticated);
  const { isPro } = usePro();
  const inQuiz = !!quizContext?.length;

  const [turns, setTurns] = useState<Turn[]>([]);
  const [question, setQuestion] = useState('');
  const [asking, setAsking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  // Bấm "Câu N" → điền sẵn vào ô để học viên trình bày chỗ chưa hiểu.
  const pickCau = useCallback((n: number) => {
    setQuestion(`Câu ${n}: mình chưa hiểu `);
    setTimeout(() => taRef.current?.focus(), 0);
  }, []);

  useEffect(() => { setTurns([]); setQuestion(''); }, [lessonId]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, [turns, asking]);

  const patch = (aIdx: number, upd: Partial<Turn>) =>
    setTurns((t) => t.map((x, i) => (i === aIdx ? { ...x, ...upd } : x)));

  // SSE: đọc luồng, dồn delta vào turn trợ lý ở vị trí aIdx. Ném lỗi để caller lùi.
  const runStream = useCallback(async (aIdx: number, q: string, history: Turn[], english: boolean, cacheKey?: string, refresh?: boolean) => {
    const res = await fetch(`/api/v1/courses/lessons/${lessonId}/ai/ask-stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}) },
      body: JSON.stringify({ question: q, history: history.map(toMsg), english, cacheKey, refresh, ...(inQuiz ? { quizContext } : {}) }),
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
          let evt: { type?: string; text?: string; answer?: string; error?: string; cached?: boolean };
          try { evt = JSON.parse(raw); } catch { continue; }
          if (evt.type === 'delta' && evt.text) {
            acc += evt.text;
            patch(aIdx, { content: acc });
          } else if (evt.type === 'done') {
            // Bản chuẩn cuối — thay hẳn (né lặp nếu stream có retry). cached ⇒ nhãn.
            patch(aIdx, { content: (evt.answer ?? acc), streaming: false, cached: !!evt.cached });
            return;
          } else if (evt.type === 'error') {
            throw new Error(evt.error || 'AI lỗi');
          }
        }
      }
    }
    if (!acc.trim()) throw new Error('empty stream');
    patch(aIdx, { content: acc, streaming: false });
  }, [lessonId, inQuiz, quizContext]);

  // Hỏi một câu. showUser=false + english=true là lúc bấm nút "Bản tiếng Anh".
  const ask = useCallback(async (text: string, opts?: {
    english?: boolean; showUser?: boolean; cacheKey?: string;
    /** Bỏ qua ĐỌC cache nhưng vẫn GHI ĐÈ (nút "Hỏi lại mới"). */
    refresh?: boolean;
    /** Gửi lịch sử RỖNG — xem ghi chú ở `askEnglish`. */
    noHistory?: boolean;
  }) => {
    const q = (text || '').trim();
    if (!q || asking) return;
    const english = !!opts?.english;
    const showUser = opts?.showUser !== false;
    const cacheKey = opts?.cacheKey;
    const refresh = !!opts?.refresh;

    setAsking(true);
    if (showUser) setQuestion('');

    const history = opts?.noHistory ? [] : turns.filter((t) => !t.streaming);
    const aIdx = history.length + (showUser ? 1 : 0); // vị trí turn trợ lý mới

    setTurns((t) => {
      const base = showUser ? [...t, { role: 'user' as const, content: q }] : [...t];
      return [...base, {
        role: 'assistant' as const, content: '', streaming: true,
        english, srcQuestion: english ? undefined : q, srcCacheKey: cacheKey,
      }];
    });

    try {
      await runStream(aIdx, q, history, english, cacheKey, refresh);
    } catch {
      // SSE hỏng/không hỗ trợ → POST thường, không để chat chết.
      try {
        const r = await api.post<{ success: boolean; data: { answer: string; cached?: boolean } }>(
          `/courses/lessons/${lessonId}/ai/ask`,
          { question: q, history: history.map(toMsg), english, cacheKey, refresh, ...(inQuiz ? { quizContext } : {}) },
          { timeout: 240_000 });
        patch(aIdx, { content: r.data.data.answer, streaming: false, cached: !!r.data.data.cached });
      } catch (e: unknown) {
        const status = (e as { response?: { status?: number } })?.response?.status;
        setTurns((t) => t.slice(0, showUser ? -2 : -1)); // gỡ bubble hỏng
        if (showUser) setQuestion(q);
        toast.error(status === 403 ? 'Hỏi AI là tính năng Pro.' : 'AI chưa trả lời được. Thử lại nhé.');
      }
    } finally { setAsking(false); }
  }, [asking, turns, lessonId, runStream]);

  // ⚠️⚠️ GỬI LỊCH SỬ RỖNG. Đo thật 05/09/2026: gửi kèm lịch sử thì model trả lời
  // "Bạn vừa hỏi lại câu này — tôi đã trả lời ở trên rồi nhé! 😊" — nó đọc ra là
  // hỏi TRÙNG (câu hỏi y hệt vừa nằm trong lịch sử) và đi trả lời chuyện đó thay
  // vì trả lời câu hỏi. Mà đây vốn không phải một lượt hội thoại tiếp theo — nó
  // là DỰNG LẠI một câu trả lời bằng thứ tiếng khác. Bỏ lịch sử còn rẻ hơn.
  //
  // Dùng lại cùng cacheKey ⇒ bản tiếng Anh cũng được cache dưới lang='en'.
  const askEnglish = useCallback((aIdx: number) => {
    const t = turns[aIdx];
    if (!t?.srcQuestion || asking) return;
    patch(aIdx, { enDone: true });
    void ask(t.srcQuestion, { english: true, showUser: false, cacheKey: t.srcCacheKey, noHistory: true });
  }, [turns, asking, ask]);

  // "Hỏi lại mới": sinh câu trả lời tươi VÀ ghi đè cache cho người sau.
  //
  // ⚠️ Bản cũ bỏ luôn `cacheKey` và ghi chú rằng "backend upsert nên cache cũng
  // được làm mới" — SAI: máy chủ chỉ GHI khi có `cacheKey`, nên nó vừa không đọc
  // vừa không ghi, và một mục cache hỏng nằm lại đó vĩnh viễn cho mọi người.
  // Nay giữ `cacheKey` + `refresh:true`: bỏ qua bước ĐỌC, vẫn GHI ĐÈ.
  const askFresh = useCallback((aIdx: number) => {
    const t = turns[aIdx];
    if (!t?.srcQuestion || asking) return;
    void ask(t.srcQuestion, {
      english: !!t.english, showUser: false,
      cacheKey: t.srcCacheKey, refresh: true, noHistory: true,
    });
  }, [turns, asking, ask]);

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
          <MessageCircle size={13} /> {inQuiz ? 'Hỏi gia sư về câu trong đề' : <>Gia sư riêng cho bài &ldquo;{lessonTitle || label}&rdquo;</>}
        </div>
        <p className="mb-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
          {inQuiz
            ? <>Chọn câu bạn thấy khó bên dưới (hoặc gõ thẳng &ldquo;câu 3 …&rdquo;) rồi trình bày chỗ chưa hiểu —
              gia sư đã biết đề &amp; đáp án câu đó, sẽ giảng vì sao đúng, khỏi cần chép lại đề.</>
            : <>Hỏi bất cứ điều gì về bài này — bắt đầu từ đâu, chỗ chưa hiểu, kiến thức nền còn thiếu,
              xin bài tập luyện, hoặc dán bài của bạn nhờ chữa. Trả lời bằng tiếng Việt; cần tiếng Anh
              thì bấm &ldquo;Bản tiếng Anh&rdquo; dưới mỗi câu trả lời.</>}
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
                <div className="min-w-0 flex-1">
                  <div className="ct-answer rounded-lg px-3 py-2 text-sm"
                    style={{ background: t.role === 'user' ? 'var(--bg-surface)' : 'var(--bg-surface-active, var(--bg-surface))', color: 'var(--text-primary)' }}>
                    {t.role === 'user'
                      ? <span className="whitespace-pre-wrap">{t.content}</span>
                      : (t.streaming && !t.content)
                        ? <span className="inline-flex items-center gap-2 opacity-70"><Loader2 size={13} className="animate-spin" /> Đang soạn…</span>
                        : <>
                            <ChatMarkdown content={t.content} renderMath={!t.streaming} />
                            {t.streaming && <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse align-middle" style={{ background: 'var(--accent-color,#8b5cf6)' }} />}
                          </>}
                  </div>
                  {/* Nhãn + hành động dưới câu trả lời của trợ lý. */}
                  {t.role === 'assistant' && !t.streaming && (t.cached || (t.srcQuestion && !t.enDone)) && (
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px]" style={{ color: 'var(--text-muted)' }}>
                      {t.cached && (
                        <span className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5"
                          style={{ background: 'var(--bg-surface)', color: 'var(--accent-color, #8b5cf6)' }}>
                          ⚡ Trả lời có sẵn
                        </span>
                      )}
                      {!t.english && t.srcQuestion && !t.enDone && (
                        <button type="button" onClick={() => askEnglish(i)} disabled={asking}
                          className="inline-flex items-center gap-1 disabled:opacity-40">
                          <Languages size={12} /> Bản tiếng Anh
                        </button>
                      )}
                      {/* Hiện cho MỌI câu trả lời có nguồn, không chỉ câu lấy
                          từ cache: một câu trả lời tươi mà dở thì cũng vừa bị
                          GHI vào cache dùng chung — người dùng phải có đường
                          sinh lại và ghi đè ngay. */}
                      {t.srcQuestion && (
                        <button type="button" onClick={() => askFresh(i)} disabled={asking}
                          className="inline-flex items-center gap-1 disabled:opacity-40">
                          <RefreshCw size={11} /> Hỏi lại mới
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
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
            {turns.length === 0 && (inQuiz ? (
              <div className="mb-2">
                <p className="mb-1.5 text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Bạn đang gặp khó ở câu nào?</p>
                <div className="flex flex-wrap gap-1.5">
                  {quizContext!.map((c) => (
                    <button key={c.n} type="button" onClick={() => pickCau(c.n)} disabled={asking}
                      className="rounded-lg border px-2.5 py-1 text-xs font-medium disabled:opacity-40"
                      style={{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-secondary)' }}>
                      Câu {c.n}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mb-2 flex flex-wrap gap-1.5">
                {QUICK.map((s) => (
                  <button key={s.key} type="button" onClick={() => void ask(s.q, { cacheKey: s.key })} disabled={asking}
                    className="rounded-full border px-2.5 py-1 text-left text-xs disabled:opacity-40"
                    style={{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-secondary)' }}>
                    {s.q}
                  </button>
                ))}
              </div>
            ))}
            <div className="flex items-end gap-2">
              <textarea
                ref={taRef}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void ask(question); } }}
                rows={2}
                placeholder={inQuiz ? 'VD: câu 3 mình chưa hiểu vì sao đáp án là B…' : 'Hỏi bất cứ điều gì về bài này — hoặc dán code/bài làm của bạn nhờ chữa…'}
                className="flex-1 resize-none rounded-lg border px-3 py-2 text-sm outline-none"
                style={{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
              />
              <button onClick={() => void ask(question)} disabled={asking || !question.trim()}
                className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold disabled:opacity-40"
                style={{ background: 'var(--accent-color, #8b5cf6)', color: '#fff' }}>
                {asking ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Hỏi
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
