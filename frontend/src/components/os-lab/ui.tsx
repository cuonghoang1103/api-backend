'use client';
/**
 * Bộ khung dùng chung cho OS Visual Lab: chữ song ngữ, bộ phát từng bước (play/pause/step/speed), thanh điều khiển,
 * nút chọn nhiều phương án, ô số liệu. Mọi mô phỏng là "một dãy ảnh chụp trạng thái" (snapshot) — bộ phát chỉ dời
 * con trỏ i trên dãy đó, nên tua lùi luôn đúng và không có trạng thái ẩn nào lệch giữa hai lần xem.
 */
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Pause, Play, RotateCcw, SkipBack, SkipForward } from 'lucide-react';
import { useLabBridge, useLabBus } from '../labs/bus';
import { useLabChrome } from '../labs/chrome';
import { labSfx } from '../labs/sfx';
import s from './oslab.module.css';

export type Lang = 'en' | 'vi';
export const tx = (lang: Lang, en: string, vi: string) => (lang === 'vi' ? vi : en);
export const cx = (...a: Array<string | false | null | undefined>) => a.filter(Boolean).join(' ');

/** Màu tiến trình/luồng — đủ tương phản trên cả nền sáng lẫn tối (chữ trắng). */
export const PALETTE = ['#2563eb', '#d97706', '#059669', '#dc2626', '#7c3aed', '#db2777', '#0891b2', '#4d7c0f', '#9333ea', '#b45309'];
export const colorOf = (i: number) => PALETTE[((i % PALETTE.length) + PALETTE.length) % PALETTE.length];

export interface Player {
  i: number; total: number; playing: boolean; speed: number;
  setI: (i: number) => void; next: () => void; prev: () => void; reset: () => void; toggle: () => void;
  setSpeed: (v: number) => void; setPlaying: (v: boolean) => void; atEnd: boolean;
}

/** Bộ phát trên một dãy `total` bước. baseMs = thời gian một bước ở tốc độ 1×. */
export function usePlayer(total: number, baseMs = 900): Player {
  const [i, setIRaw] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const totalRef = useRef(total);
  totalRef.current = total;
  const clamp = (v: number) => Math.max(0, Math.min(Math.max(0, totalRef.current - 1), v));
  const setI = useCallback((v: number) => setIRaw(clamp(v)), []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (i > total - 1) setIRaw(Math.max(0, total - 1)); }, [total, i]);
  useEffect(() => {
    if (!playing) return;
    if (i >= total - 1) { setPlaying(false); return; }
    const id = window.setTimeout(() => setIRaw((x) => Math.min(totalRef.current - 1, x + 1)), baseMs / speed);
    return () => window.clearTimeout(id);
  }, [playing, i, total, speed, baseMs]);
  const p: Player = {
    i, total, playing, speed, setI, setSpeed, setPlaying,
    atEnd: i >= total - 1,
    next: () => { setPlaying(false); setIRaw((x) => clamp(x + 1)); },
    prev: () => { setPlaying(false); setIRaw((x) => clamp(x - 1)); },
    reset: () => { setPlaying(false); setIRaw(0); },
    toggle: () => {
      if (!playing && i >= total - 1) { setIRaw(0); setPlaying(true); return; }
      setPlaying((v) => !v);
    },
  };
  usePlayerBridge(p);
  return p;
}

/**
 * Bộ phát nào cũng tự đăng ký với tour dưới tên 'player' (labs/bus.tsx): trạng thái i/total/playing/atEnd và các
 * hành động step/back/reset/play/pause/seek/end/speed. Kèm tiếng "tick" nhỏ mỗi khi tiến đúng một bước — trừ khi
 * mô phỏng tự phát tiếng riêng cho từng bước (useOwnStepSound).
 */
export function usePlayerBridge(p: Player) {
  const bus = useLabBus();
  useLabBridge('player', { i: p.i, total: p.total, playing: p.playing, atEnd: p.atEnd, speed: p.speed }, {
    step: () => p.next(), back: () => p.prev(), reset: () => p.reset(),
    play: () => { if (p.atEnd) p.setI(0); p.setPlaying(true); }, pause: () => p.setPlaying(false),
    seek: (v) => { p.setPlaying(false); p.setI(Number(v)); }, end: () => { p.setPlaying(false); p.setI(p.total - 1); },
    speed: (v) => p.setSpeed(Number(v)),
  });
  const prevI = useRef(p.i);
  useEffect(() => {
    if (p.i === prevI.current + 1 && !(bus && bus.ownStepSound > 0)) labSfx('tick');
    prevI.current = p.i;
  }, [p.i, bus]);
}

const SPEEDS = [0.5, 1, 2, 4];

export function Controls({ p, lang, label, extra }: { p: Player; lang: Lang; label?: string; extra?: ReactNode }) {
  return (
    <div className={s.bar} data-tour="controls">
      <button type="button" className={s.btn} onClick={p.reset} title={tx(lang, 'Back to the start', 'Về đầu')} aria-label={tx(lang, 'Reset', 'Về đầu')}><RotateCcw /></button>
      <button type="button" className={s.btn} onClick={p.prev} disabled={p.i <= 0} title={tx(lang, 'Step back', 'Lùi một bước')} aria-label={tx(lang, 'Step back', 'Lùi một bước')}><SkipBack /></button>
      <button type="button" className={cx(s.btn, s.primary)} onClick={p.toggle} aria-label={p.playing ? tx(lang, 'Pause', 'Dừng') : tx(lang, 'Play', 'Chạy')} data-tour="play">
        {p.playing ? <Pause /> : <Play />}{p.playing ? tx(lang, 'Pause', 'Dừng') : tx(lang, 'Play', 'Chạy')}
      </button>
      <button type="button" className={s.btn} onClick={p.next} disabled={p.atEnd} title={tx(lang, 'One step', 'Một bước')} aria-label={tx(lang, 'Step forward', 'Tới một bước')} data-tour="step"><SkipForward />{tx(lang, 'Step', 'Bước')}</button>
      <div className={s.seg} role="group" aria-label={tx(lang, 'Speed', 'Tốc độ')}>
        {SPEEDS.map((v) => (
          <button type="button" key={v} className={p.speed === v ? s.on : ''} onClick={() => p.setSpeed(v)}>{v}×</button>
        ))}
      </div>
      <div className={s.progress} data-tour="timeline">
        <input type="range" min={0} max={Math.max(0, p.total - 1)} value={p.i} onChange={(e) => { p.setPlaying(false); p.setI(Number(e.target.value)); }} aria-label={tx(lang, 'Timeline', 'Dòng thời gian')} />
        <span className={s.small}>{label ?? `${tx(lang, 'step', 'bước')} ${p.i + 1}/${p.total}`}</span>
      </div>
      {extra}
    </div>
  );
}

export function Seg<T extends string | number>({ value, options, onChange, label }: {
  value: T; options: Array<[T, string]>; onChange: (v: T) => void; label?: string;
}) {
  return (
    <span className={s.lbl}>
      {label}
      <span className={s.seg}>
        {options.map(([v, t]) => (
          <button type="button" key={String(v)} className={v === value ? s.on : ''} onClick={() => onChange(v)}>{t}</button>
        ))}
      </span>
    </span>
  );
}

export function Kpi({ k, v, tone }: { k: string; v: ReactNode; tone?: 'ok' | 'bad' | 'warn' }) {
  return <div className={cx(s.kpi, tone && s[tone])}><div className={s.k}>{k}</div><div className={s.v}>{v}</div></div>;
}

export function Frame({ title, sub, badge, children }: { title: string; sub?: string; badge?: string; children: ReactNode }) {
  const chrome = useLabChrome();
  return (
    <div ref={chrome?.rootRef} className={cx(s.root, 'not-prose', chrome?.touring && s.touring)} data-os-lab-root="1" data-im="">
      <div className={s.head} data-tour="head">
        {chrome?.icon && <span className={s.headIcon} aria-hidden>{chrome.icon}</span>}
        <span className={s.headText}>
          <span className={s.title}>{title}</span>
          {sub && <span className={s.sub}>{sub}</span>}
        </span>
        {badge && <span className={s.badge}>{badge}</span>}
      </div>
      {chrome?.toolbar}
      {children}
      {chrome?.overlay}
    </div>
  );
}

export function Explain({ children, tone }: { children: ReactNode; tone?: 'ok' | 'bad' | 'warn' }) {
  return <div className={cx(s.explain, tone && s[tone])} aria-live="polite" data-tour="explain">{children}</div>;
}

/** Chữ trắng hay đen trên một màu nền. */
export function inkOn(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return 0.299 * r + 0.587 * g + 0.114 * b > 170 ? '#111' : '#fff';
}

export { rng } from './engine/rng';
export { s as css };
