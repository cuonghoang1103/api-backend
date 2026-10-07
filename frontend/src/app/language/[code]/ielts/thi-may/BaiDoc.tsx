'use client';

/**
 * Cột BÀI ĐỌC: tô sáng (chọn chữ → Tô sáng / Ghi chú; bấm chỗ đã tô → sửa ghi chú / xoá),
 * chuột phải trên vùng chọn cũng mở menu như máy thi thật; xem lại thì tô BẰNG CHỨNG
 * của câu đang xem (`ev` nguyên văn trong đề) và cuộn tới đó.
 *
 * Vị trí tô lưu theo (đoạn, ký tự đầu, ký tự cuối) trên chữ thuần của đoạn — mỗi mẩu
 * chữ vẽ ra mang `data-o` (vị trí bắt đầu) để đổi vùng chọn của trình duyệt về số.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Doan } from './de/types';
import s from '../chung/cdt.module.css';

export type ToSang = { id: string; p: number; s: number; e: number; note?: string };

type Moc = { s: number; e: number; loai: 'hl' | 'ev'; id?: string; note?: string };

function viTri(node: Node, off: number): { p: number; o: number } | null {
  const el = (node.nodeType === 3 ? node.parentElement : (node as Element)) as HTMLElement | null;
  const span = el?.closest('[data-o]') as HTMLElement | null;
  const para = el?.closest('[data-p]') as HTMLElement | null;
  if (!span || !para) return null;
  const base = Number(span.dataset.o);
  return { p: Number(para.dataset.p), o: base + (node.nodeType === 3 ? off : 0) };
}

function DoanVe({ d, i, moc, onBamHl, evRef }: { d: Doan; i: number; moc: Moc[]; onBamHl: (id: string, x: number, y: number) => void; evRef: React.RefObject<HTMLElement | null> }) {
  const cat = new Set<number>([0, d.s.length]);
  for (const m of moc) { cat.add(Math.max(0, m.s)); cat.add(Math.min(d.s.length, m.e)); }
  const diem = [...cat].sort((a, b) => a - b);
  const manh: React.ReactNode[] = [];
  for (let k = 0; k < diem.length - 1; k++) {
    const a = diem[k], b = diem[k + 1];
    if (a === b) continue;
    const hl = moc.find((m) => m.loai === 'hl' && m.s <= a && m.e >= b);
    const ev = moc.find((m) => m.loai === 'ev' && m.s <= a && m.e >= b);
    const cls = [hl ? s.hl : '', hl?.note ? s.hlNote : '', ev ? `${s.ev} ${s.evOn}` : ''].join(' ').trim();
    const laCuoiHl = hl && hl.e === b;
    manh.push(
      <span key={a} data-o={a} className={cls || undefined}
        ref={ev && ev.s === a ? (el) => { (evRef as React.MutableRefObject<HTMLElement | null>).current = el; } : undefined}
        onClick={hl ? (e) => { e.stopPropagation(); onBamHl(hl.id!, e.clientX, e.clientY); } : undefined}>
        {d.s.slice(a, b)}
      </span>,
    );
    if (laCuoiHl && hl.note) manh.push(<span key={`n${a}`} className={s.dauNote} title={hl.note} onClick={(e) => { e.stopPropagation(); onBamHl(hl.id!, e.clientX, e.clientY); }}>📝</span>);
  }
  return <>{manh}</>;
}

export function BaiDoc({
  tieuDe, phuDe, gioiThieu, doan, hl, setHl, ev, tieuDeChen,
}: {
  tieuDe: string; phuDe?: string; gioiThieu?: string; doan: Doan[];
  hl: ToSang[]; setHl: (f: (cu: ToSang[]) => ToSang[]) => void;
  /** Bằng chứng cần tô (xem lại). */
  ev?: string | null;
  /** Tiêu đề người học đã chọn cho từng đoạn (dạng matching headings) — hiện nhỏ trên đầu đoạn. */
  tieuDeChen?: Record<string, string>;
}) {
  const goc = useRef<HTMLDivElement>(null);
  const evRef = useRef<HTMLElement | null>(null);
  const [menu, setMenu] = useState<null | { x: number; y: number; chon?: { p: number; s: number; e: number }; hlId?: string }>(null);
  const [soan, setSoan] = useState<null | { id: string; x: number; y: number; text: string }>(null);

  const evViTri = useMemo(() => {
    if (!ev) return null;
    for (let i = 0; i < doan.length; i++) { const k = doan[i].s.indexOf(ev); if (k >= 0) return { p: i, s: k, e: k + ev.length }; }
    return null;
  }, [ev, doan]);

  useEffect(() => {
    if (evViTri) requestAnimationFrame(() => evRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' }));
  }, [evViTri]);

  useEffect(() => {
    const dong = () => setMenu(null);
    window.addEventListener('scroll', dong, true);
    return () => window.removeEventListener('scroll', dong, true);
  }, []);

  const layChon = (): { p: number; s: number; e: number; rect: DOMRect } | null => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.rangeCount) return null;
    const r = sel.getRangeAt(0);
    if (!goc.current?.contains(r.commonAncestorContainer)) return null;
    const a = viTri(r.startContainer, r.startOffset), b = viTri(r.endContainer, r.endOffset);
    if (!a || !b || a.p !== b.p || b.o <= a.o) return null;
    return { p: a.p, s: a.o, e: b.o, rect: r.getBoundingClientRect() };
  };

  const moMenuChon = (e?: React.MouseEvent) => {
    const c = layChon();
    if (!c) { if (!e || e.type !== 'contextmenu') setMenu(null); return false; }
    setMenu({ x: Math.min(window.innerWidth - 200, c.rect.left + c.rect.width / 2 - 70), y: Math.max(8, c.rect.top - 42), chon: { p: c.p, s: c.s, e: c.e } });
    return true;
  };

  const them = (c: { p: number; s: number; e: number }, note?: string) => {
    const id = `h${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
    setHl((cu) => {
      const trung = cu.filter((h) => h.p === c.p && h.s < c.e && h.e > c.s);
      const s0 = Math.min(c.s, ...trung.map((h) => h.s)), e0 = Math.max(c.e, ...trung.map((h) => h.e));
      const ghiCu = trung.map((h) => h.note).filter(Boolean).join(' · ');
      return [...cu.filter((h) => !trung.includes(h)), { id, p: c.p, s: s0, e: e0, note: note ?? (ghiCu || undefined) }];
    });
    window.getSelection()?.removeAllRanges();
    return id;
  };

  const mocCua = (i: number): Moc[] => [
    ...hl.filter((h) => h.p === i).map((h) => ({ s: h.s, e: h.e, loai: 'hl' as const, id: h.id, note: h.note })),
    ...(evViTri && evViTri.p === i ? [{ s: evViTri.s, e: evViTri.e, loai: 'ev' as const }] : []),
  ];

  return (
    <div
      ref={goc}
      onMouseUp={() => setTimeout(() => moMenuChon(), 0)}
      onKeyUp={(e) => { if (e.shiftKey) moMenuChon(); }}
      onContextMenu={(e) => { if (moMenuChon(e)) e.preventDefault(); }}
    >
      <h2 className={s.tieuDeDoc}>{tieuDe}</h2>
      {phuDe && <p className={s.phuDeDoc}>{phuDe}</p>}
      {gioiThieu && <p className={s.gioiThieu} dangerouslySetInnerHTML={{ __html: gioiThieu.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>') }} />}
      {doan.map((d, i) => (
        <div key={i} className={s.doan}>
          {d.nhan && tieuDeChen?.[d.nhan] && <div className={s.tieuDeChen}>{tieuDeChen[d.nhan]}</div>}
          <p data-p={i} style={{ margin: 0 }}>
            {d.nhan && <span className={s.nhanDoan}>{d.nhan}</span>}
            <DoanVe d={d} i={i} moc={mocCua(i)} evRef={evRef} onBamHl={(id, x, y) => setMenu({ x: Math.min(window.innerWidth - 220, x - 60), y: Math.max(8, y - 46), hlId: id })} />
          </p>
        </div>
      ))}

      {menu && (
        <div className={s.menuChon} style={{ left: menu.x, top: menu.y }} role="menu" onMouseDown={(e) => e.preventDefault()}>
          {menu.chon && (
            <>
              <button type="button" role="menuitem" onClick={() => { them(menu.chon!); setMenu(null); }}>🖍 Tô sáng</button>
              <button type="button" role="menuitem" onClick={() => { const id = them(menu.chon!); setSoan({ id, x: menu.x, y: menu.y + 40, text: '' }); setMenu(null); }}>📝 Ghi chú</button>
            </>
          )}
          {menu.hlId && (
            <>
              <button type="button" role="menuitem" onClick={() => { const h = hl.find((x) => x.id === menu.hlId); setSoan({ id: menu.hlId!, x: menu.x, y: menu.y + 40, text: h?.note ?? '' }); setMenu(null); }}>📝 Ghi chú</button>
              <button type="button" role="menuitem" onClick={() => { setHl((cu) => cu.filter((h) => h.id !== menu.hlId)); setMenu(null); }}>✕ Xoá tô</button>
            </>
          )}
          <button type="button" role="menuitem" aria-label="Đóng" onClick={() => setMenu(null)}>×</button>
        </div>
      )}

      {soan && (
        <div className={s.oNote} style={{ left: Math.min(soan.x, window.innerWidth - 340), top: Math.min(soan.y, window.innerHeight - 180) }} role="dialog" aria-label="Ghi chú">
          <textarea autoFocus value={soan.text} placeholder="Ghi chú cho đoạn đã tô (vd. ý chính, từ đồng nghĩa)…"
            onChange={(e) => setSoan({ ...soan, text: e.target.value })}
            onKeyDown={(e) => { if (e.key === 'Escape') setSoan(null); if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { setHl((cu) => cu.map((h) => (h.id === soan.id ? { ...h, note: soan.text.trim() || undefined } : h))); setSoan(null); } }} />
          <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', marginTop: 6 }}>
            <button type="button" className={s.nutPhu} onClick={() => setSoan(null)}>Huỷ</button>
            <button type="button" className={s.nutPhu} style={{ fontWeight: 600 }} onClick={() => { setHl((cu) => cu.map((h) => (h.id === soan.id ? { ...h, note: soan.text.trim() || undefined } : h))); setSoan(null); }}>Lưu (⌘↵)</button>
          </div>
        </div>
      )}
    </div>
  );
}

/** Lời thoại bài nghe (xem lại): tô bằng chứng của câu đang xem. */
export function LoiThoai({ loi, ev }: { loi: { ai: string; s: string }[]; ev?: string | null }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  useEffect(() => { if (ev) requestAnimationFrame(() => ref.current?.scrollIntoView({ block: 'center', behavior: 'smooth' })); }, [ev]);
  return (
    <div className={s.loiThoai}>
      {loi.map((l, i) => {
        const k = ev ? l.s.indexOf(ev) : -1;
        return (
          <p key={i}>
            <b>{l.ai}: </b>
            {k < 0 ? l.s : (<>{l.s.slice(0, k)}<span ref={ref} className={`${s.ev} ${s.evOn}`}>{ev}</span>{l.s.slice(k + ev!.length)}</>)}
          </p>
        );
      })}
    </div>
  );
}
