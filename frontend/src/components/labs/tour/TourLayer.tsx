'use client';
/**
 * Giao diện của "Hướng dẫn từng bước":
 *   • TourToolbar — dưới tiêu đề khung: nút bắt đầu (hoặc dải giới thiệu tour bài học đã chọn), câu "bạn đang xem gì",
 *     nút âm thanh.
 *   • TourOverlay — vòng sáng quanh vùng đang nói tới (phần còn lại của khung mờ đi) + thẻ hướng dẫn dính đáy màn
 *     hình, có nhân vật dẫn đường "Chíp" (một con chip có mắt).
 */
import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { ArrowLeft, ArrowRight, Check, Compass, Lightbulb, Play, RotateCcw, Sparkles, Volume2, VolumeX, Wand2, X } from 'lucide-react';
import { ensureListeners, labSoundOn, setLabSound } from '../sfx';
import { stepMs, type L, type Tour } from './types';
import type { TourRun } from './useTourRunner';
import t from '../labs.module.css';

const T = (lang: 'en' | 'vi', x: L) => (lang === 'vi' ? x[1] : x[0]);
const tx = (lang: 'en' | 'vi', en: string, vi: string) => (lang === 'vi' ? vi : en);
const cx = (...a: Array<string | false | null | undefined>) => a.filter(Boolean).join(' ');

/** Tổng thời lượng ước tính (phút) — dùng chính nhịp của chế độ quay. */
export const tourMinutes = (tour: Tour, lang: 'en' | 'vi') => Math.max(1, Math.round(tour.steps.reduce((n, s) => n + stepMs(s, lang), 0) / 60000 + 0.3));

function useReduced() {
  const [r, setR] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    setR(m.matches);
    const f = () => setR(m.matches);
    m.addEventListener?.('change', f);
    return () => m.removeEventListener?.('change', f);
  }, []);
  return r;
}

/** "Chíp" — người dẫn đường: một con chip nhỏ có mắt, chớp mắt (tắt khi giảm chuyển động), cười khi xong việc. */
export function ChipGuide({ mood = 'talk', size = 40 }: { mood?: 'talk' | 'wait' | 'happy'; size?: number }) {
  return (
    <svg className={t.chip} width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      {[12, 20, 28, 36].map((y) => <g key={y}><rect x={2} y={y - 1.5} width={6} height={3} rx={1} className={t.chipPin} /><rect x={40} y={y - 1.5} width={6} height={3} rx={1} className={t.chipPin} /></g>)}
      {[16, 24, 32].map((x) => <rect key={x} x={x - 1.5} y={2} width={3} height={6} rx={1} className={t.chipPin} />)}
      <rect x={7} y={7} width={34} height={34} rx={9} className={t.chipBody} />
      <rect x={11} y={11} width={26} height={26} rx={6} className={t.chipFace} />
      <g className={t.chipEyes}>
        {mood === 'happy'
          ? <><path d="M16.5 22 q2.5 -3 5 0" className={t.chipLine} /><path d="M26.5 22 q2.5 -3 5 0" className={t.chipLine} /></>
          : <><circle cx={19} cy={21} r={2.6} className={t.chipEye} /><circle cx={29} cy={21} r={2.6} className={t.chipEye} /></>}
      </g>
      {mood === 'wait' ? <path d="M20 30 h8" className={t.chipLine} /> : <path d="M19 28.5 q5 4.5 10 0" className={t.chipLine} />}
      <circle cx={14.5} cy={27} r={1.8} className={t.chipBlush} /><circle cx={33.5} cy={27} r={1.8} className={t.chipBlush} />
    </svg>
  );
}

export function SoundToggle({ lang }: { lang: 'en' | 'vi' }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    ensureListeners();
    setOn(labSoundOn());
    const f = (e: Event) => setOn(!!(e as CustomEvent<boolean>).detail);
    window.addEventListener('lab:am-thanh', f);
    return () => window.removeEventListener('lab:am-thanh', f);
  }, []);
  const label = on ? tx(lang, 'Sound on — click to mute', 'Đang bật âm thanh — bấm để tắt') : tx(lang, 'Sound off — click to turn on', 'Đang tắt âm thanh — bấm để bật');
  return (
    <button type="button" className={cx(t.iconBtn, on && t.iconOn)} aria-pressed={on} aria-label={label} title={label} onClick={() => setLabSound(!on)}>
      {on ? <Volume2 /> : <VolumeX />}<span className={t.iconLbl}>{tx(lang, 'Sound', 'Âm thanh')}</span>
    </button>
  );
}

export function TourToolbar({ lang, run, tours, chosen, featured, hint, record }: {
  lang: 'en' | 'vi'; run: TourRun; tours: Tour[]; chosen: Tour | undefined; featured: boolean; hint: L | undefined; record: boolean;
}) {
  const [pickId, setPickId] = useState(chosen?.id ?? tours[0]?.id ?? '');
  useEffect(() => { if (chosen) setPickId(chosen.id); }, [chosen]);
  const sel = tours.find((x) => x.id === pickId) ?? chosen ?? tours[0];
  if (record) return null;
  if (run.phase !== 'idle') {
    return (
      <div className={t.toolbar}>
        <span className={t.running}><Compass aria-hidden />{tx(lang, 'Guided tour', 'Đang hướng dẫn')}: <b>{run.tour ? T(lang, run.tour.title) : ''}</b></span>
        <span className={t.grow} />
        <SoundToggle lang={lang} />
        <button type="button" className={t.ghostBtn} onClick={run.close}><X aria-hidden />{tx(lang, 'Exit the tour', 'Thoát hướng dẫn')}</button>
      </div>
    );
  }
  return (
    <div className={t.toolbarWrap}>
      {featured && sel ? (
        <div className={t.banner}>
          <ChipGuide size={42} />
          <div className={t.bannerText}>
            <div className={t.bannerTitle}>{tx(lang, 'Step-by-step guide', 'Hướng dẫn từng bước')}: {T(lang, sel.title)}</div>
            <div className={t.bannerSub}>{T(lang, sel.summary)} · {sel.steps.length} {tx(lang, 'steps', 'bước')} · ~{tourMinutes(sel, lang)} {tx(lang, 'min', 'phút')}</div>
          </div>
          <button type="button" className={t.startBtn} onClick={() => run.start(sel)}><Play aria-hidden />{tx(lang, 'Start the guide', 'Bắt đầu hướng dẫn')}</button>
        </div>
      ) : (
        <div className={t.toolbar}>
          {sel && <button type="button" className={t.startSmall} onClick={() => run.start(sel)}><Compass aria-hidden />{tx(lang, 'Start the guide', 'Bắt đầu hướng dẫn')}</button>}
          {tours.length > 1 && (
            <select className={t.tourSelect} value={pickId} onChange={(e) => setPickId(e.target.value)} aria-label={tx(lang, 'Choose a guide', 'Chọn bài hướng dẫn')}>
              {tours.map((x) => <option key={x.id} value={x.id}>{T(lang, x.title)} ({x.steps.length} {tx(lang, 'steps', 'bước')})</option>)}
            </select>
          )}
          <span className={t.grow} />
          <SoundToggle lang={lang} />
        </div>
      )}
      {hint && <p className={t.hint}><Lightbulb aria-hidden />{T(lang, hint)}</p>}
    </div>
  );
}

interface Box { top: number; left: number; width: number; height: number }

/** Theo dõi khung của vùng `data-tour=target` (toạ độ trong khung mô phỏng). */
function useTargetBox(rootRef: RefObject<HTMLDivElement>, target: string | undefined, active: boolean) {
  const [box, setBox] = useState<Box | null>(null);
  useLayoutEffect(() => {
    if (!active || !target) { setBox(null); return; }
    let raf = 0, last = '';
    const tick = () => {
      const root = rootRef.current;
      const els = root ? Array.from(root.querySelectorAll<Element>(`[data-tour="${target}"]`)) : [];
      const el = els.find((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; });
      let b: Box | null = null;
      if (root && el) {
        const R = root.getBoundingClientRect(), r = el.getBoundingClientRect();
        const pad = 6;
        const top = Math.max(2, r.top - R.top - pad), left = Math.max(2, r.left - R.left - pad);
        b = { top, left, width: Math.min(R.width - left - 2, r.width + 2 * pad), height: r.height + 2 * pad };
      }
      const key = b ? `${Math.round(b.top)},${Math.round(b.left)},${Math.round(b.width)},${Math.round(b.height)}` : '';
      if (key !== last) { last = key; setBox(b); }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [rootRef, target, active]);
  return box;
}

export function TourOverlay({ lang, run, rootRef, record }: { lang: 'en' | 'vi'; run: TourRun; rootRef: RefObject<HTMLDivElement>; record: boolean }) {
  const reduced = useReduced();
  const tour = run.tour;
  const st = tour && run.phase === 'step' ? tour.steps[run.idx] : undefined;
  const box = useTargetBox(rootRef, st?.target, run.phase === 'step');
  const cardRef = useRef<HTMLDivElement>(null);

  // đưa vùng đang nói tới vào giữa màn hình (chỉ khi nó đang khuất)
  useEffect(() => {
    if (!st?.target) return;
    const id = window.setTimeout(() => {
      const el = rootRef.current?.querySelector(`[data-tour="${st.target}"]`);
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dock = cardRef.current?.getBoundingClientRect().height ?? 200;
      if (r.top < 64 || r.bottom > window.innerHeight - dock - 16) el.scrollIntoView({ block: 'center', behavior: reduced || record ? 'auto' : 'smooth' });
    }, 260);
    return () => window.clearTimeout(id);
  }, [st, run.idx, rootRef, reduced, record]);

  useEffect(() => { if (run.phase !== 'idle' && !record) cardRef.current?.focus({ preventScroll: true }); }, [run.phase, run.idx, record]);

  if (!tour || run.phase === 'idle') return null;
  const total = tour.steps.length;
  const waiting = !!st?.task && !run.taskDone;
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); run.close(); }
    else if (e.key === 'ArrowRight' && run.phase === 'step') { e.preventDefault(); run.next(); }
    else if (e.key === 'ArrowLeft' && run.phase === 'step') { e.preventDefault(); run.back(); }
  };
  const correct = run.picked !== null && run.picked === tour.quiz.answer;
  return (
    <>
      {run.phase === 'step' && box && (
        <div className={cx(t.ring, waiting && t.ringWait, st?.task && run.taskDone && t.ringOk, reduced && t.still)} aria-hidden
          style={{ top: box.top, left: box.left, width: box.width, height: box.height }} />
      )}
      {run.phase === 'step' && !box && <div className={t.dim} aria-hidden />}
      <div ref={cardRef} className={cx(t.card, reduced && t.still)} role="dialog" aria-modal="false" tabIndex={-1} onKeyDown={onKey}
        aria-label={tx(lang, 'Step-by-step guide', 'Hướng dẫn từng bước')} data-lab-tour-card={run.phase}>
        <div className={t.cardTop}>
          <ChipGuide mood={run.phase === 'done' || run.taskDone || correct ? 'happy' : waiting ? 'wait' : 'talk'} size={34} />
          <div className={t.dots} aria-hidden>
            {Array.from({ length: total + 1 }, (_, k) => (
              <span key={k} className={cx(t.dot, k < run.idx && t.dotDone, k === run.idx && run.phase === 'step' && t.dotNow, k === total && t.dotQuiz, k === total && run.phase !== 'step' && t.dotNow)} />
            ))}
          </div>
          <span className={t.counter}>{run.phase === 'step' ? `${tx(lang, 'Step', 'Bước')} ${run.idx + 1}/${total}` : run.phase === 'quiz' ? tx(lang, 'Quick check', 'Kiểm tra nhanh') : tx(lang, 'Done', 'Xong')}</span>
          <button type="button" className={t.closeBtn} onClick={run.close} aria-label={tx(lang, 'Close the guide', 'Đóng hướng dẫn')}><X /></button>
        </div>
        <div aria-live="polite">
          {run.phase === 'step' && st && (
            <>
              <h4 className={t.cardTitle}>{T(lang, st.title)}</h4>
              <p className={t.cardBody}>{T(lang, st.body)}</p>
              {st.task && (
                <div className={cx(t.task, run.taskDone && t.taskOk)}>
                  {run.taskDone ? <Check aria-hidden /> : <span className={t.pulse} aria-hidden />}
                  <span><b>{run.taskDone ? tx(lang, 'Done!', 'Làm được rồi!') : tx(lang, 'Your task', 'Việc của bạn')}:</b> {T(lang, st.task.text)}</span>
                  {!run.taskDone && !record && (
                    <button type="button" className={t.helpBtn} onClick={run.solve} disabled={run.busy}><Wand2 aria-hidden />{tx(lang, 'Show me', 'Làm giúp tôi')}</button>
                  )}
                </div>
              )}
            </>
          )}
          {run.phase === 'quiz' && (
            <>
              <h4 className={t.cardTitle}>{T(lang, tour.quiz.q)}</h4>
              <div className={t.options}>
                {tour.quiz.options.map((o, k) => (
                  <button type="button" key={k} disabled={run.picked !== null}
                    className={cx(t.option, run.picked !== null && k === tour.quiz.answer && t.optRight, run.picked === k && k !== tour.quiz.answer && t.optWrong)}
                    onClick={() => run.pick(k)}>{String.fromCharCode(65 + k)}. {T(lang, o)}</button>
                ))}
              </div>
              {run.picked !== null && <p className={cx(t.why, correct ? t.whyOk : t.whyBad)}>{correct ? tx(lang, 'Correct! ', 'Chính xác! ') : tx(lang, 'Not quite. ', 'Chưa đúng. ')}{T(lang, tour.quiz.why)}</p>}
            </>
          )}
          {run.phase === 'done' && (
            <>
              <h4 className={t.cardTitle}><Sparkles aria-hidden className={t.inlineIcon} />{tx(lang, 'Guide finished', 'Xong bài hướng dẫn')}: {T(lang, tour.title)}</h4>
              <p className={t.cardBody}>{tx(lang, 'Everything stays where you left it — keep experimenting. You can replay the guide any time.', 'Mọi thứ vẫn giữ nguyên như lúc bạn dừng — cứ thử tiếp. Muốn xem lại hướng dẫn thì bấm nút bên dưới.')}</p>
            </>
          )}
        </div>
        {!record && (
          <div className={t.cardNav}>
            {run.phase === 'step' && (
              <>
                <button type="button" className={t.navBtn} onClick={run.back} disabled={run.idx === 0} aria-label={tx(lang, 'Back', 'Trước')}><ArrowLeft aria-hidden /><span className={t.navLbl}>{tx(lang, 'Back', 'Trước')}</span></button>
                <button type="button" className={t.navBtn} onClick={run.replay} aria-label={tx(lang, 'Replay this step', 'Xem lại bước này')}><RotateCcw aria-hidden /><span className={t.navLbl}>{tx(lang, 'Replay', 'Xem lại')}</span></button>
                <span className={t.grow} />
                <button type="button" className={t.textBtn} onClick={run.close}>{tx(lang, 'Skip', 'Bỏ qua')}</button>
                <button type="button" className={cx(t.nextBtn, st?.task && !run.taskDone && t.nextSoft)} onClick={run.next} disabled={run.busy}>
                  {run.idx === total - 1 ? tx(lang, 'Quick check', 'Kiểm tra nhanh') : tx(lang, 'Next', 'Tiếp')}<ArrowRight aria-hidden />
                </button>
              </>
            )}
            {run.phase === 'quiz' && (
              <>
                <button type="button" className={t.navBtn} onClick={run.back}><ArrowLeft aria-hidden /><span className={t.navLbl}>{tx(lang, 'Back', 'Trước')}</span></button>
                <span className={t.grow} />
                <button type="button" className={t.nextBtn} onClick={run.finish} disabled={run.picked === null}>{tx(lang, 'Finish', 'Hoàn thành')}<Check aria-hidden /></button>
              </>
            )}
            {run.phase === 'done' && (
              <>
                <button type="button" className={t.navBtn} onClick={() => run.start(tour)}><RotateCcw aria-hidden />{tx(lang, 'Replay the guide', 'Xem lại từ đầu')}</button>
                <span className={t.grow} />
                <button type="button" className={t.nextBtn} onClick={run.close}>{tx(lang, 'Close', 'Đóng')}<X aria-hidden /></button>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
