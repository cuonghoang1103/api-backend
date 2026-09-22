'use client';

// Gia sư AI cho MỘT bài học Academy. Chat THUẦN, luôn sẵn sàng. Ngữ cảnh bài học
// ghép ở server từ lessonId; client gửi câu hỏi + lịch sử. Pro-gated.
// - Trả lời STREAM ("gõ từng chữ") qua SSE; hỏng thì tự lùi về POST thường.
// - Mặc định TIẾNG VIỆT (giữ thuật ngữ tiếng Anh). Mỗi câu trả lời có nút
//   "Bản tiếng Anh" để hỏi lại đúng câu đó bằng tiếng Anh khi cần.
//
// ⚠️ ĐÂY CHỈ CÒN LÀ CÁI VỎ. Toàn bộ phần ruột (gọi cổng, stream, cache, dịch
// lại, lùi khi SSE hỏng) nằm ở `useGiaSuBai` — dùng chung với khung gia sư
// trong con robot nổi. Sửa hành vi thì sửa ở HOOK, đừng vá riêng ở đây: vá
// riêng là hai lối vào cùng một gia sư bắt đầu trả lời khác nhau.

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Sparkles, Loader2, Send, MessageCircle, Crown, User, Languages, RefreshCw, ImagePlus, X } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { usePro } from '@/hooks/usePro';
// Render câu trả lời như AI Chat chính: markdown + KaTeX + code + sơ đồ SVG.
import ChatMarkdown from '@/components/chat/ChatMarkdown';
import FaqGiaSu from '@/components/academy/FaqGiaSu';
import ChonSlide from '@/components/academy/ChonSlide';
import { GOI_Y_GIA_SU, useGiaSuBai, type TutorQuizItem } from '@/components/academy/useGiaSuBai';
import { useGiaSuBaiStore } from '@/store/giaSuBaiStore';
import { cauHoiSlide, docSlide, khoaCacheSlide, type Slide } from '@/components/academy/docSlide';

export type { TutorQuizItem };

export function CourseTutor({ lessonId, courseCode, courseTitle, lessonTitle, noiDungHtml, quizContext, autoAsk }: {
  lessonId: number; courseCode?: string; courseTitle?: string; lessonTitle?: string;
  /** HTML của bài — để đọc ra danh sách slide. Không truyền thì mục hỏi-theo-slide ẩn. */
  noiDungHtml?: string;
  /** Có ⇒ chế độ hỏi trong quiz: gia sư biết đề+đáp án các câu, học viên chỉ gõ "câu N". */
  quizContext?: TutorQuizItem[];
  /** Câu hỏi bắn đi NGAY khi `key` đổi — dùng cho nút "Hỏi AI vì sao sai" ở từng câu quiz. */
  autoAsk?: { key: number; text: string } | null;
}) {
  const isAuthed = useAuthStore((s) => s.isAuthenticated);
  const { isPro } = usePro();

  const {
    turns, question, setQuestion, asking, inQuiz,
    hoi: ask, hoiTiengAnh: askEnglish, hoiLaiMoi: askFresh, nhoLaiCauCu,
    anhDan, themAnh, boAnh, danVao,
  } = useGiaSuBai({ lessonId, ...(quizContext ? { quizContext } : {}), ...(autoAsk ? { autoAsk } : {}) });

  const endRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const oFileRef = useRef<HTMLInputElement>(null);

  // Bấm "Câu N" → điền sẵn vào ô để học viên trình bày chỗ chưa hiểu.
  const pickCau = useCallback((n: number) => {
    setQuestion(`Câu ${n}: mình chưa hiểu `);
    setTimeout(() => taRef.current?.focus(), 0);
  }, [setQuestion]);

  /*
   * CÔNG BỐ "đang học bài nào" cho con robot nổi.
   *
   * Đặt ở ĐÂY chứ không ở trang học, vì chính component này là thứ duy nhất
   * chắc chắn có mặt ở mọi lối vào bài học — trang `learn` của web, và màn
   * môn học của app desktop (`monHoc.tsx` dùng lại đúng component này). Đặt
   * ở trang thì mỗi lối vào mới phải nhớ cắm lại, và cái quên sẽ hỏng CÂM:
   * robot vẫn mở, chỉ là nó không biết bài nào và hiện chat thường.
   *
   * Đề luyện (`inQuiz`) KHÔNG công bố: ngữ cảnh của nó là đề và đáp án, không
   * phải bài học, nên robot mà nối vào đó sẽ trả lời lệch hẳn chủ đề.
   */
  const datBai = useGiaSuBaiStore((s) => s.datBai);
  /* Đọc MỘT LẦN cho mỗi lần nội dung đổi. Nội dung bài dài chục nghìn ký tự;
     chạy lại ở mỗi lần vẽ là quét lại cả chuỗi đó mỗi khi người dùng gõ. */
  const slides = useMemo(() => docSlide(noiDungHtml), [noiDungHtml]);
  useEffect(() => {
    if (inQuiz) return undefined;
    datBai({
      lessonId,
      ...(slides.length ? { slides } : {}),
      ...(courseCode ? { courseCode } : {}),
      ...(courseTitle ? { courseTitle } : {}),
      ...(lessonTitle ? { lessonTitle } : {}),
      ...(typeof window !== 'undefined' ? { duongDan: window.location.pathname } : {}),
    });
    return () => {
      /* Chỉ xoá nếu kho VẪN đang giữ đúng bài này. Rời một bài để sang bài
         khác thì hàm dọn của bài cũ có thể chạy SAU khi bài mới đã ghi vào —
         xoá vô điều kiện là robot mất ngữ cảnh ngay lúc vừa có. */
      const dang = useGiaSuBaiStore.getState().bai;
      if (dang?.lessonId === lessonId) datBai(null);
    };
  }, [inQuiz, lessonId, courseCode, courseTitle, lessonTitle, slides, datBai]);

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
                      ? (
                        <>
                          {!!t.anh?.length && (
                            <div className="mb-1.5 flex flex-wrap gap-1.5">
                              {t.anh.map((u, k) => (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img key={k} src={u} alt="" className="h-20 w-20 rounded-lg object-cover"
                                  style={{ border: '1px solid var(--border-color)' }} />
                              ))}
                            </div>
                          )}
                          <span className="whitespace-pre-wrap">{t.content}</span>
                        </>
                      )
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
              <>
              {slides.length > 0 && (
                <ChonSlide slides={slides} khoa={asking} onChon={(sl: Slide) => void ask(cauHoiSlide(sl), { cacheKey: khoaCacheSlide(sl) })} />
              )}
              <div className="mb-2 flex flex-wrap gap-1.5">
                {GOI_Y_GIA_SU.map((s) => (
                  <button key={s.key} type="button" onClick={() => void ask(s.q, { cacheKey: s.key })} disabled={asking}
                    className="rounded-full border px-2.5 py-1 text-left text-xs disabled:opacity-40"
                    style={{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-secondary)' }}>
                    {s.q}
                  </button>
                ))}
              </div>
              </>
            ))}
            {/* `flex-wrap` + `min-w` cho ô nhập: hàng này giờ có BA thứ (ô nhập,
                nút Hỏi, nút Câu hỏi thường gặp). Không cho xuống dòng thì ở cửa
                sổ hẹp ô nhập bị bóp còn một cột chữ dọc — đo thật ở 800px. */}
            {anhDan.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-2">
                {anhDan.map((u, i) => (
                  <div key={i} className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={u} alt="" className="h-16 w-16 rounded-lg object-cover"
                      style={{ border: '1px solid var(--border-color)' }} />
                    <button type="button" onClick={() => boAnh(i)} aria-label="Bỏ ảnh"
                      className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full text-xs"
                      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                      <X size={11} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-wrap items-end gap-2">
              {/* Nút chọn ảnh — lối vào thứ hai cạnh Ctrl+V, cho máy không dán
                  được ảnh từ clipboard. */}
              <input ref={oFileRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif" multiple hidden
                onChange={(e) => {
                  const ds = [...(e.target.files ?? [])];
                  e.target.value = '';   // chọn lại đúng file đó lần nữa phải được
                  if (ds.length) void themAnh(ds);
                }} />
              <button type="button" onClick={() => oFileRef.current?.click()} disabled={asking}
                title="Gửi kèm ảnh (hoặc dán thẳng bằng Ctrl+V)" aria-label="Gửi kèm ảnh"
                className="inline-flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-lg border disabled:opacity-40"
                style={{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-secondary)' }}>
                <ImagePlus size={15} />
              </button>
              <textarea
                ref={taRef}
                onPaste={danVao}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void ask(question); } }}
                rows={2}
                placeholder={inQuiz ? 'e.g. I don’t get why question 3’s answer is B…' : 'Ask anything about this lesson — paste a screenshot, code or your work for feedback…'}
                className="min-w-[min(100%,220px)] flex-1 resize-none rounded-lg border px-3 py-2 text-sm outline-none"
                style={{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
              />
              <button onClick={() => void ask(question)} disabled={asking || (!question.trim() && anhDan.length === 0)}
                className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold disabled:opacity-40"
                style={{ background: 'var(--accent-color, #8b5cf6)', color: '#fff' }}>
                {asking ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Hỏi
              </button>

            </div>

          </>
        )}

        {/* Mục "Câu hỏi thường gặp" — dùng chung với gia sư Code Lab, xem
            `FaqGiaSu.tsx`. NGOÀI cổng Pro có chủ đích. */}
        {isAuthed && (
          <FaqGiaSu
            duong={`/courses/lessons/${lessonId}/ai/asks`}
            khoaDoiBai={lessonId}
            onHoiTiep={(m) => { nhoLaiCauCu(m); setTimeout(() => taRef.current?.focus(), 0); }}
          />
        )}
      </div>
    </section>
  );
}
