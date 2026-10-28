'use client';
/**
 * Bộ chạy tour (trạng thái + nhịp). Hai chế độ:
 *   • học: người học bấm Tiếp/Trước; bước có `task` chờ trạng thái mô phỏng thoả `until` (hoặc nút "Làm giúp tôi");
 *   • quay video (record): tự chạy theo dòng thời gian cố định — vào bước, làm `do`, chờ ~35% thời lượng, làm `solve`,
 *     chờ điều kiện, chờ hết thời lượng, sang bước sau; cuối cùng trả lời câu hỏi. Dòng thời gian đã ghi trong TOURS.md.
 * Trạng thái công khai cho Playwright: window.__labTour = { id, idx, total, phase, stuck: [...] }.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import type { LabBus } from '../bus';
import { labSfx } from '../sfx';
import { Cancelled, holds, pause, runActs, waitUntil, type RunCtx } from './run';
import { QUIZ_MS, stepMs, type Tour } from './types';

export type TourPhase = 'idle' | 'step' | 'quiz' | 'done';

export interface TourRun {
  tour: Tour | null; idx: number; phase: TourPhase; taskDone: boolean; picked: number | null; busy: boolean;
  start: (t: Tour) => void; next: () => void; back: () => void; replay: () => void; close: () => void;
  solve: () => void; pick: (k: number) => void; finish: () => void;
}

interface LabTourWindow {
  __labTour?: { id: string; idx: number; total: number; phase: TourPhase; stuck: string[]; missing: string[] };
  /** chế độ quay: mốc thời gian (ms từ lúc tour bắt đầu) mỗi lần đổi bước — bước dựng video dùng để cắt/chèn lời */
  __labTourLog?: Array<{ t: number; idx: number; phase: TourPhase }>;
}

export function useTourRunner(bus: LabBus, lang: 'en' | 'vi', record: boolean, rate: number): TourRun {
  const [tour, setTour] = useState<Tour | null>(null);
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<TourPhase>('idle');
  const [taskDone, setTaskDone] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [token, setToken] = useState(0);
  const tokenRef = useRef(0);
  tokenRef.current = token;
  const stuck = useRef<string[]>([]);
  const t0 = useRef(0);
  const missing = useRef<string[]>([]);

  const visible = useCallback((t: Tour, k: number, dir: 1 | -1): number => {
    let j = k;
    while (j >= 0 && j < t.steps.length) {
      const w = t.steps[j].when;
      if (!w || holds(w, bus)) return j;
      j += dir;
    }
    return dir === 1 ? t.steps.length : -1;
  }, [bus]);

  const publish = useCallback((p: TourPhase, t: Tour | null, k: number) => {
    if (typeof window === 'undefined') return;
    const w = window as unknown as LabTourWindow;
    w.__labTour = { id: t?.id ?? '', idx: k, total: t?.steps.length ?? 0, phase: p, stuck: stuck.current.slice(), missing: missing.current.slice() };
    if (record) (w.__labTourLog ??= []).push({ t: Math.round(performance.now() - t0.current), idx: k, phase: p });
    document.documentElement.dataset.labTour = p;
  }, [record]);

  const go = useCallback((t: Tour, k: number) => {
    setTaskDone(false); setPicked(null);
    if (k >= t.steps.length) { setPhase('quiz'); setIdx(t.steps.length); publish('quiz', t, t.steps.length); }
    else { setPhase('step'); setIdx(k); publish('step', t, k); }
    setToken((x) => x + 1);
  }, [publish]);

  const start = useCallback((t: Tour) => {
    stuck.current = []; missing.current = [];
    t0.current = performance.now();
    if (record && typeof window !== 'undefined') (window as unknown as LabTourWindow).__labTourLog = [];
    setTour(t); labSfx('start');
    go(t, visible(t, 0, 1));
  }, [go, visible]);
  const next = useCallback(() => { if (tour) go(tour, visible(tour, idx + 1, 1)); }, [tour, idx, go, visible]);
  const back = useCallback(() => { if (!tour) return; const k = visible(tour, Math.min(idx, tour.steps.length) - 1, -1); if (k >= 0) go(tour, k); }, [tour, idx, go, visible]);
  const replay = useCallback(() => { if (tour) go(tour, idx); }, [tour, idx, go]);
  const close = useCallback(() => { setPhase('idle'); setTour(null); setToken((x) => x + 1); publish('idle', null, 0); }, [publish]);
  const finish = useCallback(() => { setPhase('done'); labSfx('done'); setToken((x) => x + 1); publish('done', tour, idx); }, [publish, tour, idx]);
  const pick = useCallback((k: number) => {
    if (!tour || picked !== null) return;
    setPicked(k); labSfx(k === tour.quiz.answer ? 'right' : 'wrong');
  }, [tour, picked]);

  const ctxFor = useCallback((tk: number): RunCtx => ({ bus, rate, alive: () => tokenRef.current === tk }), [bus, rate]);

  const solve = useCallback(() => {
    if (!tour || phase !== 'step') return;
    const st = tour.steps[idx];
    if (!st?.task) return;
    const ctx = ctxFor(tokenRef.current);
    setBusy(true);
    runActs(ctx, st.task.solve, () => holds(st.task!.until, bus)).catch(() => undefined).finally(() => { if (ctx.alive()) setBusy(false); });
  }, [tour, phase, idx, ctxFor, bus]);

  // vào một bước: làm `do`; chế độ quay thì tự làm luôn phần còn lại của bước
  useEffect(() => {
    if (!tour) return;
    const tk = token;
    const ctx = ctxFor(tk);
    let live = true;
    (async () => {
      try {
        if (phase === 'step') {
          const st = tour.steps[idx];
          const t0 = Date.now();
          setBusy(true);
          missing.current.push(...(await runActs(ctx, st.do)).map((a) => `${idx}:${a}`));
          if (!live) return;
          setBusy(false);
          if (!record) return;
          const dwell = stepMs(st, lang);
          if (st.task) {
            await pause(ctx, dwell * 0.35);
            setBusy(true);
            missing.current.push(...(await runActs(ctx, st.task.solve, () => holds(st.task!.until, bus))).map((a) => `${idx}:${a}`));
            const ok = await waitUntil(ctx, () => holds(st.task!.until, bus), 20000);
            setBusy(false);
            if (!ok) stuck.current.push(`${tour.id}#${idx}`);
          }
          const spent = (Date.now() - t0) * rate;
          await pause(ctx, Math.max(dwell * (st.task ? 0.25 : 1) - (st.task ? 0 : spent), 600));
          go(tour, visible(tour, idx + 1, 1));
        } else if (phase === 'quiz' && record) {
          await pause(ctx, 2600);
          setPicked(tour.quiz.answer); labSfx('right');
          await pause(ctx, QUIZ_MS - 2600);
          setPhase('done'); labSfx('done'); publish('done', tour, idx);
        }
      } catch (e) {
        if (!(e instanceof Cancelled)) throw e;
      }
    })();
    return () => { live = false; };
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  // chế độ học: theo dõi điều kiện của việc cần làm
  useEffect(() => {
    if (!tour || phase !== 'step') return;
    const st = tour.steps[idx];
    if (!st?.task) return;
    let done = false;
    const check = () => {
      if (done || !holds(st.task!.until, bus)) return;
      done = true; setTaskDone(true); labSfx('step-ok');
    };
    check();
    return bus.subscribe(check);
  }, [tour, phase, idx, bus, token]);

  return { tour, idx, phase, taskDone, picked, busy, start, next, back, replay, close, solve, pick, finish };
}
