'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, List, X, Clock, CalendarDays } from 'lucide-react';
import api from '@/lib/api';
import RobotAI from '@/components/academy/RobotAI';
import { useLangUser } from '@/components/language/primitives';
import { isReady, lessonText, type Course } from './course';
import type { Lesson } from './types';
import { Blocks } from './Blocks';
import { GiaSu, type Turn } from './GiaSu';
import { TutorCtx, CourseCtx, type TutorAsk } from './tutorContext';
import { setDefaultVoice, AI_TIMEOUT, getRate, setRate, onRate, stopAudio } from './audio';
import { useTienDo } from './useTienDo';
import { TongQuanBuoi, KeHoach, dayDone } from './TongQuan';
import { KanjiHost } from './KanjiSheet';
import { VideoBai } from './VideoBai';
import s from './course.module.css';

/** Trang đang mở: một bài, tổng quan một buổi, hoặc kế hoạch & tiến độ. */
type View = { t: 'lesson'; id: string } | { t: 'day'; n: number } | { t: 'plan' };

function viewFromUrl(course: Course): View | null {
  const q = new URLSearchParams(window.location.search);
  const bai = q.get('bai');
  if (bai && course.readyLessons.some((l) => l.id === bai)) return { t: 'lesson', id: bai };
  const buoi = Number(q.get('buoi'));
  if (buoi >= 1 && buoi <= course.days.length) return { t: 'day', n: buoi };
  if (q.get('xem') === 'ke-hoach') return { t: 'plan' };
  return null;
}

function viewToQuery(v: View): [string, string] {
  return v.t === 'lesson' ? ['bai', v.id] : v.t === 'day' ? ['buoi', String(v.n)] : ['xem', 'ke-hoach'];
}

/**
 * Trang một khoá học kiểu sách: mục lục · bài · gia sư, cộng Tổng quan buổi và
 * Kế hoạch & tiến độ. Nội dung đến từ `course` (vd. IELTS trong
 * app/language/[code]/ielts/data.ts).
 */
export default function CoursePage({ course, lessonExtra }: {
  course: Course;
  /** Khối thêm ở đầu mỗi bài (vd. thẻ 📷 Sách gốc của Dekiru, chỉ hiện với tài khoản được phép). */
  lessonExtra?: (lesson: Lesson, dayN: number | undefined) => ReactNode;
}) {
  const DAYS = course.days;
  const INTRO = course.intro;
  const READY_LESSONS = course.readyLessons;
  const { isAuthenticated } = useLangUser();
  const tien = useTienDo(isAuthenticated, course.stage, course.storageKey);
  useEffect(() => { setDefaultVoice(course.voice); }, [course.voice]);

  // Mặc định là trang Kế hoạch — nó là "bàn học": hôm nay học buổi nào, đã
  // xong bao nhiêu. Người lần đầu vào sẽ thấy form đặt lịch ngay ở đó.
  const [view, setView] = useState<View>({ t: 'plan' });
  // Chuyển bài / buổi / trang kế hoạch: dừng tiếng đang phát (bài cũ không được nói tiếp).
  const viewKey = view.t === 'lesson' ? `l:${view.id}` : view.t === 'day' ? `d:${view.n}` : 'plan';
  useEffect(() => { stopAudio(); }, [viewKey]);
  const [tocOpen, setTocOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [asking, setAsking] = useState(false);
  const [selection, setSelection] = useState('');
  // Khoá tiếng Nhật: bật/tắt furigana (chữ nhỏ trên chữ Hán) — tắt để tự luyện đọc.
  const isJa = course.voice.startsWith('ja');
  const [furi, setFuri] = useState(true);
  const [roma, setRoma] = useState(true);
  const [rate, setRateState] = useState(1);
  useEffect(() => { setRateState(getRate()); return onRate(setRateState); }, []);
  const articleRef = useRef<HTMLElement>(null);

  // Đọc URL trong effect thay vì useSearchParams: hook đó bắt trang bọc
  // Suspense, còn ở đây chỉ cần đọc một lần lúc vào.
  useEffect(() => {
    const v = viewFromUrl(course);
    if (v) setView(v);
  }, [course]);

  const go = useCallback((v: View) => {
    setView(v);
    setTocOpen(false);
    setTurns([]);
    setSelection('');
    const url = new URL(window.location.href);
    ['bai', 'buoi', 'xem'].forEach((k) => url.searchParams.delete(k));
    const [k, val] = viewToQuery(v);
    url.searchParams.set(k, val);
    window.history.replaceState(null, '', url);
    window.scrollTo({ top: 0 });
  }, []);
  const open = useCallback((l: Lesson) => {
    if (isReady(l)) go({ t: 'lesson', id: l.id });
  }, [go]);

  const lesson = view.t === 'lesson' ? course.allLessons.find((l) => l.id === view.id) ?? INTRO : null;
  const day = view.t === 'day' ? DAYS[view.n - 1] : lesson ? course.dayOf(lesson.id) : undefined;
  // Nội dung của buổi đang mở tải theo yêu cầu (một chunk mỗi buổi): `tick`
  // vẽ lại khi nó về, `loadErr` giữ buổi tải hỏng để hiện nút thử lại.
  const [tick, setTick] = useState(0);
  const [loadErr, setLoadErr] = useState<number | null>(null);
  const [retry, setRetry] = useState(0);
  const dayN = day?.n;
  useEffect(() => {
    if (!dayN) return;
    let live = true;
    setLoadErr(null);
    course.load(dayN).then(
      () => {
        if (!live) return;
        setTick((t) => t + 1);
        course.prefetch(dayN + 1);
      },
      () => { if (live) setLoadErr(dayN); },
    );
    return () => { live = false; };
  }, [course, dayN, retry]);
  // Bài đầy đủ (có blocks); undefined = buổi của nó đang tải.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const full = useMemo(() => (lesson ? course.fullLesson(lesson) : undefined), [course, lesson, tick]);

  const idx = lesson ? READY_LESSONS.findIndex((l) => l.id === lesson.id) : -1;
  const prev = idx > 0 ? READY_LESSONS[idx - 1] : null;
  const next = idx >= 0 && idx < READY_LESSONS.length - 1 ? READY_LESSONS[idx + 1] : null;

  const viewTitle = lesson ? lesson.title : view.t === 'day' ? `Tổng quan buổi ${view.n}` : 'Kế hoạch & tiến độ';
  const contextText = useMemo(() => {
    // Chưa tải xong thì gia sư chỉ có tên + mục tiêu bài.
    if (lesson) return lessonText(full ?? lesson);
    if (view.t === 'day') return (course.contentOf(view.n) ?? DAYS[view.n - 1].lessons).map(lessonText).join('\n').slice(0, 3900);
    return course.planContext;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson, full, view, DAYS, course, tick]);

  // Chữ người học bôi đen TRONG BÀI — để hỏi gia sư đúng chỗ đó.
  useEffect(() => {
    const onSel = () => {
      const sel = window.getSelection();
      const txt = sel?.toString().trim() ?? '';
      if (!txt) return;
      if (sel?.anchorNode && articleRef.current?.contains(sel.anchorNode)) setSelection(txt.slice(0, 2000));
    };
    document.addEventListener('selectionchange', onSel);
    return () => document.removeEventListener('selectionchange', onSel);
  }, []);

  const ask = useCallback(async (a: TutorAsk) => {
    setSheetOpen(true);
    if (!isAuthenticated) return;
    const chu = a.chu ?? (selection || viewTitle);
    setAsking(true);
    const q = selection && !a.chu ? `${a.label} — “${selection.slice(0, 60)}${selection.length > 60 ? '…' : ''}”` : a.label;
    setTurns((t) => [...t, { q, a: null }]);
    const finish = (patch: Partial<Turn>) => setTurns((t) => t.map((x, i) => (i === t.length - 1 ? { ...x, ...patch } : x)));
    try {
      const res = await api.post('/ielts/ai/hoi', {
        chu,
        ...(a.y ? { y: a.y } : {}),
        ...(a.cauHoi ? { cauHoi: a.cauHoi.slice(0, 500) } : {}),
        boiCanh: contextText,
        mon: course.tutor.mon,
        // Ba lượt đã trả lời gần nhất — cho câu hỏi tiếp "dễ hơn nữa", "ví dụ khác".
        lichSu: turns.filter((x) => x.a).slice(-3).map((x) => ({ q: x.q, a: x.a })),
      }, AI_TIMEOUT);
      const d = res.data?.data as { traLoi: string | null; lyDo?: string } | undefined;
      if (d?.traLoi) finish({ a: d.traLoi });
      else finish({ err: d?.lyDo === 'ai_unavailable' ? 'Gia sư AI đang tạm tắt. Bạn thử lại sau nhé.' : 'Gia sư chưa trả lời được. Thử hỏi lại nhé.' });
    } catch (e) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      finish({ err: msg || 'Không kết nối được tới gia sư. Kiểm tra mạng rồi thử lại.' });
    } finally {
      setAsking(false);
      setSelection('');
    }
  }, [isAuthenticated, selection, viewTitle, contextText, turns]);

  const ctx = useMemo(() => ({ ask, report: tien.report }), [ask, tien.report]);

  const doneDays = DAYS.filter((d) => dayDone(d, tien.done)).length;

  const tutorProps = {
    name: course.tutor.name,
    lessonTitle: viewTitle,
    turns,
    asking,
    loggedIn: isAuthenticated,
    selection,
    onAsk: ask,
    onClear: () => setTurns([]),
  };

  const tocItem = (l: Lesson, sub?: string) => {
    const ready = isReady(l);
    const isDone = tien.done.includes(l.id);
    return (
      <button
        key={l.id}
        type="button"
        disabled={!ready}
        onClick={() => open(l)}
        className={`${s.tocItem} ${lesson?.id === l.id ? s.tocActive : ''}`}
        style={{ '--k': course.hue(l.kind) } as CSSProperties}
      >
        <span className={`${s.tocDot} ${isDone ? s.tocDotDone : ''}`}>{isDone && <Check size={11} strokeWidth={3} />}</span>
        <span className="min-w-0">
          <span className={s.tocKind}>{sub ?? course.label(l.kind)}</span>
          {l.title}
        </span>
      </button>
    );
  };

  const markDone = () => lesson && tien.setDone(lesson.id, !tien.done.includes(lesson.id));

  return (
    <CourseCtx.Provider value={course}>
    <TutorCtx.Provider value={ctx}>
      <div className={`${s.root} ${isJa ? s.ja : ''} ${isJa && !furi ? s.noFuri : ''} ${isJa && !roma ? s.noRo : ''}`}>
        <div className={s.bar}>
          <div className={s.barInner}>
            <Link href={course.backHref} className={s.iconBtn} aria-label="Quay lại">
              <ArrowLeft size={18} />
            </Link>
            <span className={s.barTitle}>{course.title}</span>
            <button type="button" className={`${s.iconBtn} ${s.barProgress}`} onClick={() => go({ t: 'plan' })}>
              <CalendarDays size={15} /> {doneDays}/{DAYS.length}<span className={s.btnLabel}>&nbsp;buổi</span>
            </button>
            {isJa && (
              <button type="button" className={s.iconBtn} onClick={() => setFuri(!furi)} aria-pressed={furi} title="Bật/tắt furigana">
                <ruby>漢<rt style={{ visibility: 'visible' }}>かん</rt></ruby><span className={s.btnLabel}>{furi ? 'Ẩn furigana' : 'Hiện furigana'}</span>
              </button>
            )}
            {isJa && (
              <button type="button" className={s.iconBtn} onClick={() => setRoma(!roma)} aria-pressed={roma} title="Bật/tắt romaji">
                <span style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: 13 }}>Aa</span><span className={s.btnLabel}>{roma ? 'Ẩn romaji' : 'Hiện romaji'}</span>
              </button>
            )}
            {/* Tốc độ đọc cho mọi nút 🔊 — nhớ trên máy. */}
            <div className={s.rateGroup} role="group" aria-label="Tốc độ nghe">
              <span className={s.btnLabel}>🔊</span>
              {[0.75, 1, 1.25].map((r) => (
                <button key={r} type="button" className={`${s.rateBtn} ${rate === r ? s.rateOn : ''}`} onClick={() => setRate(r)}>
                  {r}×
                </button>
              ))}
            </div>
            <button type="button" className={`${s.iconBtn} ${s.tocBtn}`} onClick={() => setTocOpen(true)}>
              <List size={17} /><span className={s.btnLabel}>Mục lục</span>
            </button>
            <button type="button" className={s.tutorBtn} onClick={() => setSheetOpen(true)}>
              <RobotAI size={22} /><span className={s.btnLabel}>Gia sư</span>
            </button>
          </div>
        </div>

        <div className={s.layout}>
          <nav className={tocOpen ? s.tocOpen : s.toc} aria-label="Mục lục khoá học">
            <div className={s.tocClose}>
              <button type="button" className={s.iconBtn} onClick={() => setTocOpen(false)} aria-label="Đóng mục lục"><X size={18} /></button>
            </div>
            <button type="button" className={s.tocPlan} onClick={() => go({ t: 'plan' })} style={view.t === 'plan' ? { borderColor: 'var(--lh-accent)' } : undefined}>
              <CalendarDays size={16} /> Kế hoạch & tiến độ
            </button>
            {(course.links ?? []).map((k) => (
              <Link key={k.href} href={k.href} className={s.tocPlan}>{k.label}</Link>
            ))}
            <div className={s.tocDay}>
              {tocItem(INTRO, 'Mở đầu')}
              {(course.extras ?? []).map((l) => tocItem(l, 'Tra cứu'))}
            </div>
            {DAYS.map((d) => {
              const ready = d.lessons.some(isReady);
              const isDone = dayDone(d, tien.done);
              return (
                <div key={d.n} className={s.tocDay}>
                  <button
                    type="button"
                    className={`${s.tocDayHead} ${s.tocDayBtn} ${view.t === 'day' && view.n === d.n ? s.tocDayBtnActive : ''}`}
                    style={{ paddingTop: 6 }}
                    onClick={() => go({ t: 'day', n: d.n })}
                  >
                    <span>{course.dayName(d.n)}{isDone ? ' ✓' : ''}</span>
                    <span className={s.soon}>{ready ? 'tổng quan →' : 'sắp có'}</span>
                  </button>
                  {d.lessons.map((l) => tocItem(l))}
                </div>
              );
            })}
          </nav>

          <article
            ref={articleRef}
            className={s.article}
            style={{ '--k': lesson ? course.hue(lesson.kind) : '#6366f1' } as CSSProperties}
          >
            {view.t === 'plan' && (
              <KeHoach
                course={course}
                done={tien.done}
                scores={tien.scores}
                plan={tien.plan}
                onOpen={open}
                onOpenDay={(n) => go({ t: 'day', n })}
                savePlan={tien.savePlan}
                loggedIn={isAuthenticated}
              />
            )}

            {view.t === 'day' && day && (
              <TongQuanBuoi
                course={course}
                day={day}
                done={tien.done}
                scores={tien.scores}
                plan={tien.plan}
                onOpen={open}
                onAskDay={() => ask({ label: `Kiểm tra cả buổi ${day.n}`, y: 'kiemtra', chu: `Buổi ${day.n}` })}
              />
            )}

            {lesson && (
              <>
                {/* Đầu bài kiểu trang sách: khối "Day 01" + tên phần tiếng Anh. */}
                <header className={s.dayHead}>
                  <div className={s.dayBadge}>
                    <span className={s.dayWord}>{day ? course.badgeWord : 'Start'}</span>
                    <span className={s.dayNum}>{day ? course.dayNum(day.n) : '00'}</span>
                  </div>
                  <div className="min-w-0">
                    <div className={s.dayKind}>{course.en(lesson.kind)}</div>
                    <h1 className={s.h1}>{lesson.title}</h1>
                  </div>
                </header>
                <div className={s.goal}>
                  <b>Mục tiêu (Aims):</b> {lesson.goal}
                  <span className={s.muted} style={{ marginLeft: 8, whiteSpace: 'nowrap' }}>
                    <Clock size={13} className="inline" style={{ marginTop: -2 }} /> ~{lesson.minutes} phút
                  </span>
                </div>
                {lessonExtra?.(lesson, day?.n)}
                <VideoBai videos={course.videos?.[lesson.id] ?? []} />

                {full ? (
                  <Blocks key={lesson.id} blocks={full.blocks ?? []} framed={lesson.kind === 'grammar'} />
                ) : loadErr === day?.n ? (
                  <div className={s.soonBox} role="alert">
                    Không tải được nội dung bài (mạng chập chờn hoặc web vừa cập nhật).{' '}
                    <button type="button" className={s.linkBtn} onClick={() => setRetry((r) => r + 1)}>Thử lại</button>
                  </div>
                ) : (
                  <div className={s.soonBox} aria-busy="true">Đang tải bài…</div>
                )}

                <div className={s.pager}>
                  {prev ? (
                    <button type="button" className={s.btnGhost} onClick={() => open(prev)}>
                      <ArrowLeft size={15} /> {prev.title}
                    </button>
                  ) : <span />}
                  <div className="flex flex-wrap gap-2">
                    <button type="button" className={s.btnGhost} onClick={markDone}>
                      <Check size={15} /> {tien.done.includes(lesson.id) ? 'Đã học xong' : 'Đánh dấu đã học'}
                    </button>
                    {next ? (
                      <button
                        type="button"
                        className={s.btn}
                        onClick={() => {
                          if (!tien.done.includes(lesson.id)) tien.setDone(lesson.id, true);
                          open(next);
                        }}
                      >
                        Bài tiếp: {next.title} <ArrowRight size={15} />
                      </button>
                    ) : day ? (
                      <button
                        type="button"
                        className={s.btn}
                        onClick={() => {
                          if (!tien.done.includes(lesson.id)) tien.setDone(lesson.id, true);
                          go({ t: 'day', n: day.n });
                        }}
                      >
                        Xem tổng kết buổi {day.n} <ArrowRight size={15} />
                      </button>
                    ) : null}
                  </div>
                </div>
              </>
            )}
          </article>

          <aside className={s.tutorCol}>
            <GiaSu {...tutorProps} />
          </aside>
        </div>

        {/* Thẻ chữ Hán: chạm chữ Hán bất kỳ trong bài (chỉ khoá có dữ liệu chữ Hán). */}
        {course.kanji && <KanjiHost course={course} />}

        {sheetOpen && (
          <>
            <div className={s.scrim} onClick={() => setSheetOpen(false)} />
            <div className={s.tutorSheet}>
              <GiaSu {...tutorProps} onClose={() => setSheetOpen(false)} />
            </div>
          </>
        )}
      </div>
    </TutorCtx.Provider>
    </CourseCtx.Provider>
  );
}
