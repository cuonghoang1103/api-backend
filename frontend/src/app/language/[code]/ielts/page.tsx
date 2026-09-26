'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, List, X, Clock, CalendarDays } from 'lucide-react';
import api from '@/lib/api';
import RobotAI from '@/components/academy/RobotAI';
import { useLangUser } from '@/components/language/primitives';
import { DAYS, INTRO, ALL_LESSONS, READY_LESSONS, KIND_LABEL, KIND_EN, KIND_HUE, lessonText, dayOf, type Lesson } from './data';
import { Blocks } from './Blocks';
import { GiaSu, type Turn } from './GiaSu';
import { TutorCtx, type TutorAsk } from './tutorContext';
import { useTienDo } from './useTienDo';
import { TongQuanBuoi, KeHoach, dayDone } from './TongQuan';
import s from './ielts.module.css';

/** Trang đang mở: một bài, tổng quan một buổi, hoặc kế hoạch & tiến độ. */
type View = { t: 'lesson'; id: string } | { t: 'day'; n: number } | { t: 'plan' };

function viewFromUrl(): View | null {
  const q = new URLSearchParams(window.location.search);
  const bai = q.get('bai');
  if (bai && READY_LESSONS.some((l) => l.id === bai)) return { t: 'lesson', id: bai };
  const buoi = Number(q.get('buoi'));
  if (buoi >= 1 && buoi <= DAYS.length) return { t: 'day', n: buoi };
  if (q.get('xem') === 'ke-hoach') return { t: 'plan' };
  return null;
}

function viewToQuery(v: View): [string, string] {
  return v.t === 'lesson' ? ['bai', v.id] : v.t === 'day' ? ['buoi', String(v.n)] : ['xem', 'ke-hoach'];
}

export default function IeltsPage() {
  const code = String(useParams().code);
  const { isAuthenticated } = useLangUser();
  const tien = useTienDo(isAuthenticated);

  // Mặc định là trang Kế hoạch — nó là "bàn học": hôm nay học buổi nào, đã
  // xong bao nhiêu. Người lần đầu vào sẽ thấy form đặt lịch ngay ở đó.
  const [view, setView] = useState<View>({ t: 'plan' });
  const [tocOpen, setTocOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [asking, setAsking] = useState(false);
  const [selection, setSelection] = useState('');
  const articleRef = useRef<HTMLElement>(null);

  // Đọc URL trong effect thay vì useSearchParams: hook đó bắt trang bọc
  // Suspense, còn ở đây chỉ cần đọc một lần lúc vào.
  useEffect(() => {
    const v = viewFromUrl();
    if (v) setView(v);
  }, []);

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
    if (l.blocks?.length) go({ t: 'lesson', id: l.id });
  }, [go]);

  const lesson = view.t === 'lesson' ? ALL_LESSONS.find((l) => l.id === view.id) ?? INTRO : null;
  const day = view.t === 'day' ? DAYS[view.n - 1] : lesson ? dayOf(lesson.id) : undefined;
  const idx = lesson ? READY_LESSONS.findIndex((l) => l.id === lesson.id) : -1;
  const prev = idx > 0 ? READY_LESSONS[idx - 1] : null;
  const next = idx >= 0 && idx < READY_LESSONS.length - 1 ? READY_LESSONS[idx + 1] : null;

  const viewTitle = lesson ? lesson.title : view.t === 'day' ? `Tổng quan buổi ${view.n}` : 'Kế hoạch & tiến độ';
  const contextText = useMemo(() => {
    if (lesson) return lessonText(lesson);
    if (view.t === 'day') return DAYS[view.n - 1].lessons.map(lessonText).join('\n').slice(0, 3900);
    return 'Trang kế hoạch học IELTS 15 buổi theo sách IELTS 4 kỹ năng cho người bắt đầu từ con số âm – Tập 1.';
  }, [lesson, view]);

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
      });
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
  }, [isAuthenticated, selection, viewTitle, contextText]);

  const ctx = useMemo(() => ({ ask, report: tien.report }), [ask, tien.report]);

  if (code !== 'en') {
    return (
      <div className={s.root}>
        <div className={s.soonBox} style={{ maxWidth: 560, margin: '48px auto' }}>
          IELTS chỉ có ở mục Tiếng Anh. <Link href="/language/en/ielts" className={s.linkBtn}>Mở IELTS</Link>
        </div>
      </div>
    );
  }

  const doneDays = DAYS.filter((d) => dayDone(d, tien.done)).length;

  const tutorProps = {
    lessonTitle: viewTitle,
    turns,
    asking,
    loggedIn: isAuthenticated,
    selection,
    onAsk: ask,
    onClear: () => setTurns([]),
  };

  const tocItem = (l: Lesson, sub?: string) => {
    const ready = !!l.blocks?.length;
    const isDone = tien.done.includes(l.id);
    return (
      <button
        key={l.id}
        type="button"
        disabled={!ready}
        onClick={() => open(l)}
        className={`${s.tocItem} ${lesson?.id === l.id ? s.tocActive : ''}`}
        style={{ '--k': KIND_HUE[l.kind] } as CSSProperties}
      >
        <span className={`${s.tocDot} ${isDone ? s.tocDotDone : ''}`}>{isDone && <Check size={11} strokeWidth={3} />}</span>
        <span className="min-w-0">
          <span className={s.tocKind}>{sub ?? KIND_LABEL[l.kind]}</span>
          {l.title}
        </span>
      </button>
    );
  };

  const markDone = () => lesson && tien.setDone(lesson.id, !tien.done.includes(lesson.id));

  return (
    <TutorCtx.Provider value={ctx}>
      <div className={s.root}>
        <div className={s.bar}>
          <div className={s.barInner}>
            <Link href={`/language/${code}`} className={s.iconBtn} aria-label="Về Tiếng Anh">
              <ArrowLeft size={18} />
            </Link>
            <span className={s.barTitle}>IELTS 4 kỹ năng · Tập 1</span>
            <button type="button" className={`${s.iconBtn} ${s.barProgress}`} onClick={() => go({ t: 'plan' })}>
              <CalendarDays size={15} /> {doneDays}/{DAYS.length} buổi
            </button>
            <button type="button" className={`${s.iconBtn} ${s.tocBtn}`} onClick={() => setTocOpen(true)}>
              <List size={17} /> Mục lục
            </button>
            <button type="button" className={s.tutorBtn} onClick={() => setSheetOpen(true)}>
              <RobotAI size={22} /> Gia sư
            </button>
          </div>
        </div>

        <div className={s.layout}>
          <nav className={tocOpen ? s.tocOpen : s.toc} aria-label="Mục lục khoá IELTS">
            <div className={s.tocClose}>
              <button type="button" className={s.iconBtn} onClick={() => setTocOpen(false)} aria-label="Đóng mục lục"><X size={18} /></button>
            </div>
            <button type="button" className={s.tocPlan} onClick={() => go({ t: 'plan' })} style={view.t === 'plan' ? { borderColor: 'var(--lh-accent)' } : undefined}>
              <CalendarDays size={16} /> Kế hoạch & tiến độ
            </button>
            <div className={s.tocDay}>{tocItem(INTRO, 'Mở đầu')}</div>
            {DAYS.map((d) => {
              const ready = d.lessons.some((l) => l.blocks?.length);
              const isDone = dayDone(d, tien.done);
              return (
                <div key={d.n} className={s.tocDay}>
                  <button
                    type="button"
                    className={`${s.tocDayHead} ${s.tocDayBtn} ${view.t === 'day' && view.n === d.n ? s.tocDayBtnActive : ''}`}
                    style={{ paddingTop: 6 }}
                    onClick={() => go({ t: 'day', n: d.n })}
                  >
                    <span>Ngày {d.n}{isDone ? ' ✓' : ''}</span>
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
            style={{ '--k': lesson ? KIND_HUE[lesson.kind] : '#6366f1' } as CSSProperties}
          >
            {view.t === 'plan' && (
              <KeHoach
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
                    <span className={s.dayWord}>{day ? 'Day' : 'Start'}</span>
                    <span className={s.dayNum}>{day ? String(day.n).padStart(2, '0') : '00'}</span>
                  </div>
                  <div className="min-w-0">
                    <div className={s.dayKind}>{KIND_EN[lesson.kind]}</div>
                    <h1 className={s.h1}>{lesson.title}</h1>
                  </div>
                </header>
                <div className={s.goal}>
                  <b>Mục tiêu (Aims):</b> {lesson.goal}
                  <span className={s.muted} style={{ marginLeft: 8, whiteSpace: 'nowrap' }}>
                    <Clock size={13} className="inline" style={{ marginTop: -2 }} /> ~{lesson.minutes} phút
                  </span>
                </div>

                <Blocks key={lesson.id} blocks={lesson.blocks ?? []} framed={lesson.kind === 'grammar'} />

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
  );
}
