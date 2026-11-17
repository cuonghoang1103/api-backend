'use client';

// Gia sư AI cho MỘT bài học Academy. Chat THUẦN, luôn sẵn sàng. Ngữ cảnh bài học
// ghép ở server từ lessonId; client gửi câu hỏi + lịch sử. Pro-gated.
// - Trả lời STREAM ("gõ từng chữ") qua SSE; hỏng thì tự lùi về POST thường.
// - Mặc định TIẾNG VIỆT (giữ thuật ngữ tiếng Anh). Mỗi câu trả lời có nút
//   "Bản tiếng Anh" để hỏi lại đúng câu đó bằng tiếng Anh khi cần.
//
// ⚠️ ĐÂY CHỈ CÒN LÀ CÁI VỎ. Toàn bộ phần ruột (gọi cổng, stream, cache, dịch
// lại, lùi khi SSE hỏng) nằm ở `useGiaSuBai` — dùng chung với khung gia sư
// trong con robot nổi. Sửa hành vi thì sửa ở HOOK, đừng vá riêng ở đây.
//
// 17/11/2026: danh sách lượt + ô soạn dùng CHUNG với khung robot (`giaSu/TinNhanGiaSu`, `giaSu/KhungSoanGiaSu`) — cùng
// cách trình bày, cùng chip ngữ cảnh, cùng mốc tua video. Thêm: CuongMini ở đầu mục, phím tắt A / Shift+A, và nhận
// "Hỏi phần này"/"Hỏi slide này" khi nút trợ lý nổi đang bị ẩn (cuộn tới đây + đặt con trỏ vào ô nhập).

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Crown } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { usePro } from '@/hooks/usePro';
import FaqGiaSu from '@/components/academy/FaqGiaSu';
import ChonSlide from '@/components/academy/ChonSlide';
import { GOI_Y_GIA_SU, useGiaSuBai, type TutorQuizItem } from '@/components/academy/useGiaSuBai';
import { ID_GIA_SU_CUOI_BAI, moGiaSuBai, useGiaSuBaiStore } from '@/store/giaSuBaiStore';
import { cauHoiSlide, docSlide, khoaCacheSlide, type Slide } from '@/components/academy/docSlide';
import TinNhanGiaSu from '@/components/academy/giaSu/TinNhanGiaSu';
import KhungSoanGiaSu from '@/components/academy/giaSu/KhungSoanGiaSu';
import { CuongMiniRobot } from '@/components/cuongmini/CuongMiniRobot';
import { useCamXucGiaSu } from '@/components/cuongmini/useCamXucGiaSu';
import { doanQuanhGiay } from '@/lib/mucLucVideo';
import { moc } from '@/lib/mocThoiGian';
import '@/components/academy/giaSu/giaSu.css';

export type { TutorQuizItem };

/** Đang gõ ở đâu đó ⇒ phím tắt một chữ cái không được ăn mất chữ người dùng. */
function dangGo(t: EventTarget | null): boolean {
  const el = t as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
}

/**
 * Phím tắt trang học: **A** mở CuongMini, **Shift+A** ghim ±30 s quanh chỗ đang xem rồi mở. Không chạy khi đang gõ,
 * khi giữ Ctrl/⌘/Alt (đừng cướp phím tắt của trình duyệt).
 */
function usePhimTatGiaSu(lessonId: number, bat: boolean) {
  useEffect(() => {
    if (!bat) return undefined;
    const nghe = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey || e.repeat || dangGo(e.target)) return;
      if (e.key !== 'a' && e.key !== 'A') return;
      e.preventDefault();
      const v = useGiaSuBaiStore.getState().video;
      if (e.shiftKey && v?.lessonId === lessonId && v.coPhuDe) {
        const g = v.layGiay() ?? 0;
        moGiaSuBai(lessonId, { loai: 'doan', doan: { ...doanQuanhGiay(g, v.thoiLuong), ten: `Quanh ${moc(g)}` } });
      } else moGiaSuBai(lessonId);
    };
    window.addEventListener('keydown', nghe);
    return () => window.removeEventListener('keydown', nghe);
  }, [lessonId, bat]);
}

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

  const g = useGiaSuBai({
    lessonId, ...(quizContext ? { quizContext } : {}), ...(autoAsk ? { autoAsk } : {}), nhanCauCho: 'cuoiBai',
  });
  const { turns, setQuestion, asking, inQuiz, hoi: ask, hoiTiengAnh: askEnglish, hoiLaiMoi: askFresh, nhoLaiCauCu } = g;

  const cuoi = turns[turns.length - 1];
  const mood = useCamXucGiaSu({ dangHoi: asking, coChu: !!(cuoi?.streaming && cuoi.content), soLoi: g.soLoi, chao: false });

  const khungRef = useRef<HTMLElement>(null);
  const cuonRef = useRef<HTMLDivElement>(null);
  const [focusLan, datFocusLan] = useState(0);

  // Bấm "Câu N" → điền sẵn vào ô để học viên trình bày chỗ chưa hiểu.
  const pickCau = useCallback((n: number) => {
    setQuestion(`Câu ${n}: mình chưa hiểu `);
    datFocusLan((x) => x + 1);
  }, [setQuestion]);

  /*
   * CÔNG BỐ "đang học bài nào" cho con robot nổi.
   *
   * Đặt ở ĐÂY chứ không ở trang học, vì chính component này là thứ duy nhất chắc chắn có mặt ở mọi lối vào bài học —
   * trang `learn` của web, và màn môn học của app desktop. Đề luyện (`inQuiz`) KHÔNG công bố.
   */
  const datBai = useGiaSuBaiStore((s) => s.datBai);
  /* Đọc MỘT LẦN cho mỗi lần nội dung đổi — nội dung bài dài chục nghìn ký tự. */
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
      /* Chỉ xoá nếu kho VẪN đang giữ đúng bài này (hàm dọn của bài cũ có thể chạy SAU khi bài mới đã ghi). */
      const dang = useGiaSuBaiStore.getState().bai;
      if (dang?.lessonId === lessonId) datBai(null);
    };
  }, [inQuiz, lessonId, courseCode, courseTitle, lessonTitle, slides, datBai]);

  usePhimTatGiaSu(lessonId, !inQuiz);

  /* Không có nút trợ lý nổi (người dùng đã ẩn) ⇒ mọi nút "Hỏi …" đưa người học tới ĐÂY. */
  const moYeuCau = useGiaSuBaiStore((s) => s.moYeuCau);
  const robotSan = useGiaSuBaiStore((s) => s.robotSan);
  const daThay = useRef(moYeuCau);
  useEffect(() => {
    if (moYeuCau === daThay.current) return;
    daThay.current = moYeuCau;
    if (robotSan || inQuiz) return;
    khungRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    datFocusLan((x) => x + 1);
  }, [moYeuCau, robotSan, inQuiz]);

  // Cuộn khung hội thoại (không phải cả trang) theo câu trả lời đang gõ.
  useEffect(() => {
    const c = cuonRef.current;
    if (c) c.scrollTop = c.scrollHeight;
  }, [turns]);

  const video = g.videoBai;
  const label = [courseCode, courseTitle].filter(Boolean).join(' · ') || 'khoá học';

  return (
    <section ref={khungRef} id={inQuiz ? undefined : ID_GIA_SU_CUOI_BAI} className="gsb mb-5 scroll-mt-20">
      <div className="overflow-hidden rounded-2xl" style={{ border: '1px solid var(--gsb-vien)', background: 'var(--gsb-nen)' }}>
        <div className="gsb-dau">
          <CuongMiniRobot mood={mood} size={40} title="CuongMini" />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div className="gsb-dau-ten">
              {inQuiz ? 'Hỏi CuongMini về câu trong đề' : 'Hỏi CuongMini'}
              <span className="gsb-huy-hieu" style={{ background: 'linear-gradient(90deg,#f59e0b,#f97316)', color: '#fff' }}>
                <Crown size={10} /> Pro
              </span>
            </div>
            <div className="gsb-dau-phu" title={lessonTitle || label}>
              {inQuiz ? 'Gia sư đã biết đề & đáp án — chọn câu bạn thấy khó' : `Gia sư riêng cho “${lessonTitle || label}”`}
            </div>
          </div>
          {g.coVideo && <span className="gsb-huy-hieu" title="Gia sư đã đọc lời giảng của video đang phát">🎬 Đã nghe video</span>}
        </div>

        {turns.length === 0 && (
          <p style={{ padding: '10px 14px 0', fontSize: 13.5, lineHeight: 1.6, color: 'var(--gsb-chu-2)' }}>
            {inQuiz
              ? <>Chọn câu bạn thấy khó bên dưới (hoặc gõ thẳng &ldquo;câu 3 …&rdquo;) rồi trình bày chỗ chưa hiểu — gia sư sẽ giảng vì sao đúng, khỏi cần chép lại đề.</>
              : <>Hỏi bất cứ điều gì về bài này — chỗ chưa hiểu, kiến thức nền, xin bài tập, dán bài nhờ chữa.
                {video ? <> Bấm <b>Hỏi phần này</b> ở mục lục dưới video để hỏi đúng một đoạn.</> : null}
                {' '}Phím tắt: <b>A</b> mở gia sư{video ? <>, <b>Shift+A</b> hỏi đoạn đang xem</> : null}.</>}
          </p>
        )}

        {turns.length > 0 && (
          <div ref={cuonRef} className="gsb-cuon" style={{ maxHeight: 520 }}>
            <TinNhanGiaSu
              turns={turns}
              asking={asking}
              coVideo={g.coVideo}
              onTua={video ? (s) => video.tua(s) : undefined}
              onHoiTiep={inQuiz ? undefined : (c) => void ask(c, { nguCanh: null })}
              onTiengAnh={askEnglish}
              onHoiLaiMoi={askFresh}
            />
          </div>
        )}

        {!isAuthed ? (
          <div style={{ padding: 14 }}>
            <Link href="/login" className="text-sm underline" style={{ color: 'var(--gsb-nhan)' }}>Đăng nhập để dùng gia sư AI</Link>
          </div>
        ) : !isPro ? (
          <div style={{ padding: 14 }}>
            <Link href="/pro" className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold"
              style={{ background: 'linear-gradient(90deg,#f59e0b,#f97316)', color: '#fff' }}>
              <Crown size={15} /> Nâng cấp Pro để hỏi AI
            </Link>
          </div>
        ) : (
          <>
            {turns.length === 0 && (
              <div style={{ padding: '10px 14px 4px' }}>
                {inQuiz ? (
                  <div className="gsb-goi-y">
                    {quizContext!.map((c) => (
                      <button key={c.n} type="button" onClick={() => pickCau(c.n)} disabled={asking}>Câu {c.n}</button>
                    ))}
                  </div>
                ) : (
                  <>
                    {slides.length > 0 && (
                      <ChonSlide slides={slides} khoa={asking}
                        onChon={(sl: Slide) => void ask(cauHoiSlide(sl), { cacheKey: khoaCacheSlide(sl), nguCanh: { loai: 'slide', slide: sl }, cauDaCoNguCanh: true })} />
                    )}
                    <div className="gsb-goi-y">
                      {GOI_Y_GIA_SU.map((s) => (
                        <button key={s.key} type="button" onClick={() => void ask(s.q, { cacheKey: s.key, nguCanh: null })} disabled={asking}>
                          {s.q}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
            <KhungSoanGiaSu
              question={g.question}
              setQuestion={setQuestion}
              asking={asking}
              hoi={ask}
              anhDan={g.anhDan}
              themAnh={g.themAnh}
              boAnh={g.boAnh}
              danVao={g.danVao}
              ghim={g.ghim}
              boGhim={g.boGhim}
              focusKhi={focusLan || undefined}
              placeholder={inQuiz ? 'Ví dụ: câu 3 vì sao đáp án là B…' : undefined}
            />
          </>
        )}

        {/* "Câu hỏi thường gặp" — NGOÀI cổng Pro có chủ đích. */}
        {isAuthed && (
          <div style={{ padding: '0 14px 12px' }}>
            <FaqGiaSu
              duong={`/courses/lessons/${lessonId}/ai/asks`}
              khoaDoiBai={lessonId}
              onHoiTiep={(m) => { nhoLaiCauCu(m); datFocusLan((x) => x + 1); }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
