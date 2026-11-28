'use client';

/**
 * ✍️ Giấy ô vuông 原稿用紙 để viết tay (khối `giayViet`, 28/11/2026 — người học tập viết mỗi ngày trên iPad).
 *
 *  - `kieu: 'chep'`  mỗi câu mẫu một tờ nhỏ: dòng ô trên có chữ MỜ để tô, dòng ô dưới để tự viết lại (che câu để thử nhớ).
 *  - `kieu: 'doan'`  đề + gợi ý + giấy trống nhiều dòng; bài mẫu ẩn tới khi bấm "Xem bài mẫu".
 * Nét lưu trên máy (HandCanvas + useInkSaver, vector — xoay iPad không vỡ). Nút 🖨️ in tờ luyện A4 (inKhung).
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Eye, EyeOff, Printer, Volume2 } from 'lucide-react';
import HandCanvas, { InkTools, loadInk, useInkSaver, type HandCanvasHandle, type InkColor, type Painter, type Stroke, type Tool } from '../HandCanvas';
import { Inline } from '../Blocks';
import { play } from '../audio';
import { inKhung } from '../inKhung';
import { useCourse } from '../tutorContext';
import type { Block } from '../types';
import s from '../course.module.css';
import c from './luyencau.module.css';

const bare = (t: string) => t.replace(/\{([^|}]+)\|[^}]+\}/g, '$1');
/** Chữ để đặt vào ô: bỏ dấu cách, giữ dấu câu (dấu câu chiếm một ô như giấy thật). */
const oChu = (t: string) => [...bare(t).replace(/\s+/g, '').replace(/——/g, '—')];

/** Vẽ lưới ô vuông `cot` cột × `hang` hàng; `mo` = chữ mờ cho các hàng lẻ (hàng tô). */
function luoi(cot: number, hang: number, mo?: string[][]): Painter {
  return (ctx, w, h, o) => {
    const q = w / cot;
    ctx.save();
    ctx.strokeStyle = o.exporting ? '#cfd6e0' : o.dark ? '#353a43' : '#cfd8e5';
    ctx.lineWidth = 1;
    for (let r = 0; r <= hang; r++) { const y = Math.round(r * q) + 0.5; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    for (let k = 0; k <= cot; k++) { const x = Math.round(k * q) + 0.5; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    // Đường chữ thập mờ trong ô (giúp cân chữ), như vở tập viết.
    ctx.setLineDash([3, 4]);
    ctx.strokeStyle = o.exporting ? '#eef1f5' : o.dark ? '#262a31' : '#edf1f6';
    for (let r = 0; r < hang; r++) for (let k = 0; k < cot; k++) {
      ctx.beginPath(); ctx.moveTo(k * q + q / 2, r * q + 4); ctx.lineTo(k * q + q / 2, r * q + q - 4); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(k * q + 4, r * q + q / 2); ctx.lineTo(k * q + q - 4, r * q + q / 2); ctx.stroke();
    }
    ctx.setLineDash([]);
    if (mo && !o.exporting) {
      ctx.fillStyle = o.dark ? 'rgba(238,240,243,0.22)' : 'rgba(31,35,40,0.16)';
      ctx.font = `${Math.round(q * 0.7)}px 'Hiragino Mincho ProN','Yu Mincho','Noto Serif JP',serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      mo.forEach((hangChu, r) => hangChu.forEach((ch, k) => ctx.fillText(ch, k * q + q / 2, r * q + q / 2 + q * 0.03)));
    }
    ctx.restore();
    void h;
  };
}

type Luu = { v: 1; st: Stroke[] };

/** Một tờ: canvas + lưu nét. */
function To({ khoa, cot, hang, mo, tool, color, onActive, refOut }: {
  khoa: string; cot: number; hang: number; mo?: string[][]; tool: Tool; color: InkColor;
  onActive: () => void; refOut: (h: HandCanvasHandle | null) => void;
}) {
  const save = useInkSaver(khoa);
  const [st, setSt] = useState<Stroke[]>([]);
  useEffect(() => { const v = loadInk<Luu>(khoa); if (v?.v === 1 && Array.isArray(v.st)) setSt(v.st); }, [khoa]);
  const bg = useMemo(() => luoi(cot, hang, mo), [cot, hang, mo]);
  return (
    <div className={s.hPaper}>
      <HandCanvas
        ref={refOut}
        aspect={hang / cot}
        strokes={st}
        onChange={(x) => { setSt(x); save(x.length ? { v: 1, st: x } : null); }}
        tool={tool}
        color={color}
        penWidth={3}
        designWidth={720}
        background={bg}
        onActive={onActive}
        ariaLabel="Giấy ô vuông để viết tay"
      />
    </div>
  );
}

export default function GiayViet({ b }: { b: Extract<Block, { t: 'giayViet' }> }) {
  const course = useCourse();
  const goc = `${course?.storageKey ?? 'sach'}:ink:${b.id}`;
  const [tool, setTool] = useState<Tool>('pen');
  const [color, setColor] = useState<InkColor>('k');
  const [mau, setMau] = useState(false);
  const [che, setChe] = useState(false);
  const [lan, setLan] = useState(0); // đổi key ⇒ xoá sạch mọi tờ
  const active = useRef<HandCanvasHandle | null>(null);
  const refs = useRef<Map<number, HandCanvasHandle | null>>(new Map());
  const inRef = useRef<HTMLDivElement>(null);
  const [cot, setCot] = useState(14);
  const boxRef = useRef<HTMLDivElement>(null);
  // Số cột theo bề rộng: ô ≥ 40 px để viết bằng bút / ngón tay (iPad dọc ~16 cột, điện thoại ~8).
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const tinh = () => setCot(Math.max(8, Math.min(18, Math.floor(el.clientWidth / 44))));
    tinh();
    const ro = new ResizeObserver(tinh);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const xoaHet = () => {
    if (!confirm('Xoá hết chữ đã viết ở phần này?')) return;
    try { Object.keys(localStorage).filter((k) => k.startsWith(goc)).forEach((k) => localStorage.removeItem(k)); } catch { /* bỏ qua */ }
    setLan((x) => x + 1);
  };
  const inTo = () => {
    if (!inRef.current) return;
    const g = inRef.current.closest(`.${s.root}`) as HTMLElement | null;
    inKhung(inRef.current, { lop: g?.className ?? '', tieuDe: b.title });
  };

  const tools = (
    <InkTools
      tool={tool} setTool={setTool} color={color} setColor={setColor}
      onUndo={() => active.current?.undo()}
      onClear={xoaHet}
      clearLabel="Xoá hết"
    >
      <button type="button" className={s.btnGhost} onClick={inTo}><Printer size={15} /> In tờ luyện</button>
    </InkTools>
  );

  return (
    <div className={c.gv} ref={boxRef}>
      <div className={c.gvTitle}>✍️ {b.title}</div>
      {b.kieu === 'chep' ? (
        <>
          <div className={s.quizSub}>Mỗi câu: nghe 🔊 → tô chữ mờ ở dòng trên → tự viết lại ở dòng dưới. Bật <b>Che câu</b> để viết lại theo trí nhớ.</div>
          <div className={c.row}>
            <button type="button" className={`${c.btn} ${c.btnSm}`} onClick={() => setChe((x) => !x)} aria-pressed={che}>
              {che ? <Eye size={15} /> : <EyeOff size={15} />} {che ? 'Hiện câu' : 'Che câu'}
            </button>
          </div>
          {tools}
          {b.mau.map((e, i) => {
            const chu = oChu(e.en);
            const hangTo: string[][] = [];
            for (let k = 0; k < chu.length; k += cot) hangTo.push(chu.slice(k, k + cot));
            // Mỗi hàng chữ mờ đi kèm một hàng trống bên dưới.
            const mo: string[][] = [];
            hangTo.forEach((h) => { mo.push(che ? [] : h); mo.push([]); });
            return (
              <div key={`${i}-${lan}-${cot}`} className={c.gvCau}>
                <div className={c.gvCauHead}>
                  <div className="min-w-0">
                    <div className={`${c.gvJa} ${c.jp} ${che ? c.che : ''}`}><Inline text={e.en} /></div>
                    <div className={c.gvVi}>{i + 1}. {e.vi}{e.ro && !che ? ` · ${e.ro}` : ''}</div>
                  </div>
                  <button type="button" className={`${c.btn} ${c.btnSm}`} onClick={() => play({ text: e.en })} aria-label="Nghe câu"><Volume2 size={15} /></button>
                </div>
                <To
                  khoa={`${goc}:${i}`}
                  cot={cot}
                  hang={mo.length}
                  mo={mo}
                  tool={tool}
                  color={color}
                  onActive={() => { active.current = refs.current.get(i) ?? null; }}
                  refOut={(h) => { refs.current.set(i, h); }}
                />
              </div>
            );
          })}
        </>
      ) : (
        <>
          {b.de && <div className={c.gvDe}><Inline text={b.de} /></div>}
          {b.goiY?.length ? <ul className={c.gvGoi}>{b.goiY.map((g, i) => <li key={i}><Inline text={g} /></li>)}</ul> : null}
          {tools}
          <To
            key={`${lan}-${cot}`}
            khoa={`${goc}:doan`}
            cot={cot}
            hang={(b.dong ?? 6) * 2}
            tool={tool}
            color={color}
            onActive={() => { active.current = refs.current.get(0) ?? null; }}
            refOut={(h) => { refs.current.set(0, h); }}
          />
          <div className={c.row}>
            <button type="button" className={`${c.btn} ${mau ? '' : c.btnPri}`} onClick={() => setMau((x) => !x)} aria-expanded={mau}>
              {mau ? <EyeOff size={15} /> : <Eye size={15} />} {mau ? 'Ẩn bài mẫu' : 'Viết xong — xem bài mẫu'}
            </button>
            <button type="button" className={c.btn} onClick={() => play(b.mau.map((e) => ({ text: e.en })))}><Volume2 size={15} /> Nghe bài mẫu</button>
          </div>
          {mau && (
            <div className={c.gvMau}>
              {b.mau.map((e, i) => (
                <div key={i}>
                  <div className={`${c.gvJa} ${c.jp}`}><Inline text={e.en} /></div>
                  {e.ro && <div className={c.roText}>{e.ro}</div>}
                  <div className={c.gvVi}>{e.vi}</div>
                </div>
              ))}
              <div className={s.quizSub}>So từng câu: đủ ý chưa · trợ từ đúng chưa · động từ / です ở cuối câu chưa · chữ Hán của lớp đã viết bằng chữ Hán chưa.</div>
            </div>
          )}
        </>
      )}

      {/* Bản in (ẩn trên màn hình): đề / câu mẫu + lưới ô trống. */}
      <div ref={inRef} className={c.inGiay}>
        <h2 style={{ fontSize: 18, margin: '0 0 8px' }}>{b.title}</h2>
        {b.kieu === 'chep' ? b.mau.map((e, i) => {
          const chu = oChu(e.en);
          const n = Math.max(14, Math.ceil(chu.length / 14) * 14);
          return (
            <div key={i} className={c.inCau}>
              <div>{i + 1}. <span className={c.jp}><Inline text={e.en} /></span> — {e.vi}</div>
              <div className={c.inLuoi} style={{ ['--cot' as string]: 14 }}>
                {Array.from({ length: n }, (_, k) => <span key={k}>{chu[k] ?? ''}</span>)}
                {Array.from({ length: n }, (_, k) => <span key={`t${k}`} />)}
              </div>
            </div>
          );
        }) : (
          <>
            {b.de && <p><Inline text={b.de} /></p>}
            {b.goiY?.length ? <ul>{b.goiY.map((g, i) => <li key={i}><Inline text={g} /></li>)}</ul> : null}
            <div className={c.inLuoi} style={{ ['--cot' as string]: 16 }}>
              {Array.from({ length: 16 * (b.dong ?? 6) * 2 }, (_, k) => <span key={k} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
