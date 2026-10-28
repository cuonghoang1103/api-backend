'use client';
/**
 * <WhereBox focus="syscall" /> — khung "Ở đâu trong máy?" cho các mô phỏng OS (28/10/2026, đợt mô phỏng #2).
 * Bọc <WhereInComputer> (cpu-lab-3d) và giữ đúng luật của nó: MỖI TRANG CHỈ MỘT ngữ cảnh WebGL.
 *   • Khung đầu tiên gắn lên trang giữ "chỗ 3D"; các khung sau vẽ sơ đồ 2D (MiniMap2D) với cùng chú thích,
 *     kèm nút "Xem 3D" — bấm thì giành chỗ (khung đang giữ chuyển về 2D).
 *   • Không WebGL / jsdom (bộ kiểm) / người dùng chọn 2D ⇒ luôn 2D.
 * `focus` là khái niệm (CONCEPTS) hoặc id điểm đến (FOCUS) trong cpu-lab-3d/scene/data.ts; đổi `focus` ⇒ camera bay.
 */
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import WhereInComputer from '../cpu-lab-3d/WhereInComputer';
import { MiniMap2D } from '../cpu-lab-3d/Fallback2D';
import { CONCEPTS, FOCUS, t2, type FocusId } from '../cpu-lab-3d/scene/data';
import m from '../cpu-lab-3d/cpu3d.module.css';
import { css as s, tx, type Lang } from './ui';

// ── chỗ 3D dùng chung cho cả trang ──
let owner = 0;
let seq = 0;
const subs = new Set<() => void>();
const emit = () => { for (const f of Array.from(subs)) f(); };
const sub = (f: () => void) => { subs.add(f); return () => { subs.delete(f); }; };

let glOk: boolean | null = null;
function canGl(): boolean {
  if (glOk !== null) return glOk;
  if (typeof window === 'undefined') return false;
  if (/jsdom/i.test(navigator.userAgent)) return (glOk = false);
  try { const c = document.createElement('canvas'); glOk = !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { glOk = false; }
  return glOk;
}

export function resolveWhere(x: string): { focus: FocusId; also: FocusId[]; note?: { vi: string; en: string } } {
  if (x in FOCUS) return { focus: x as FocusId, also: [] };
  const c = CONCEPTS[x];
  return c ? { focus: c.focus, also: c.also ?? [], note: c.note } : { focus: 'pc', also: [] };
}

export function WhereBox({ focus, lang, height = 230, title }: { focus: string; lang: Lang; height?: number; title?: string }) {
  const id = useRef(0);
  if (!id.current) id.current = ++seq;
  const cur = useSyncExternalStore(sub, () => owner, () => 0);
  const [gl, setGl] = useState(false);
  useEffect(() => {
    const ok = canGl();
    setGl(ok);
    if (ok && owner === 0) { owner = id.current; emit(); }
    return () => { if (owner === id.current) { owner = 0; emit(); } };
  }, []);
  const mine = gl && cur === id.current;
  const r = resolveWhere(focus);
  const f = FOCUS[r.focus];
  return (
    <div className={s.panel} style={{ padding: 8 }} data-tour="where">
      <div className={s.panelTitle} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ flex: 1 }}>📍 {title ?? tx(lang, 'Where in the computer?', 'Ở đâu trong máy tính?')}</span>
        {gl && !mine && (
          <button type="button" className={s.btn} style={{ minHeight: 26, padding: '2px 8px', fontSize: 12 }}
            onClick={() => { owner = id.current; emit(); }}>{tx(lang, 'View in 3D', 'Xem 3D')}</button>
        )}
      </div>
      {mine ? <WhereInComputer focus={focus} lang={lang} height={height} /> : (
        <div className={m.mini} style={{ height }} role="img"
          aria-label={`${tx(lang, 'Where in the computer', 'Vị trí trong máy tính')}: ${t2(f.name, lang)}. ${t2(r.note ?? f.what, lang)}`}>
          <MiniMap2D focus={r.focus} also={r.also} />
          <span className={m.miniTag}>{tx(lang, 'Where is it?', 'Ở đâu trong máy?')}</span>
          <div className={m.miniCap}>
            <b>{t2(f.name, lang)}</b>
            <span>{t2(r.note ?? f.what, lang)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
