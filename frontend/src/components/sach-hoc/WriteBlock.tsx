'use client';

/**
 * Khối `write` — tập viết chữ Nhật (kana, kanji) bằng Apple Pencil / chuột.
 *
 * Mỗi chữ một hàng: ô mẫu (vẽ từ dữ liệu KanjiVG, có nút ▶ chạy thứ tự nét)
 * + một dải ba ô luyện — ô đầu có chữ mờ để tô theo (bật/tắt được), hai ô sau
 * trống. Cả dải là MỘT canvas (ít canvas hơn → nhẹ hơn khi bài có 40 chữ Hán),
 * và chữ được chia trang 10 hàng một.
 *
 * Thứ tự nét: public/kanjivg/strokes.json dựng bằng scripts/kanjivg-subset.mjs
 * (KanjiVG © Ulrich Apel, CC BY-SA 3.0 — dòng ghi công ở cuối khối là bắt buộc).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Eye, EyeOff, Play, RotateCcw, Sparkles, Undo2, X } from 'lucide-react';
import api from '@/lib/api';
import ChatMarkdown from '@/components/chat/ChatMarkdown';
import HandCanvas, { InkTools, b64, loadInk, renderInk, useInkSaver, type HandCanvasHandle, type InkColor, type Painter, type Stroke, type Tool } from './HandCanvas';
import type { Block } from './types';
import { useCourse, useTutor } from './tutorContext';
import s from './course.module.css';
import { AI_TIMEOUT } from './audio';

/* ── Dữ liệu thứ tự nét (tải một lần cho cả trang) ─────────────────────── */

type StrokeMap = Record<string, string[]>;
let strokesPromise: Promise<StrokeMap> | null = null;
function loadStrokes(): Promise<StrokeMap> {
  strokesPromise ??= fetch('/kanjivg/strokes.json')
    .then((r) => (r.ok ? r.json() : {}))
    .catch(() => {
      strokesPromise = null; // lỗi mạng: lần sau thử lại
      return {};
    });
  return strokesPromise;
}
function useStrokeData() {
  const [data, setData] = useState<StrokeMap | null>(null);
  useEffect(() => {
    let on = true;
    loadStrokes().then((d) => on && setData(d));
    return () => { on = false; };
  }, []);
  return data;
}

/** Điểm bắt đầu của nét (lệnh M đầu tiên) — chỗ đặt số thứ tự. */
function startOf(d: string): [number, number] {
  const m = /M\s*([-\d.]+)[ ,]?([-\d.]+)/.exec(d);
  return m ? [Number(m[1]), Number(m[2])] : [0, 0];
}

const CELLS = 3;
const PAGE = 10;

/* ── Nền ô luyện: ba ô 田 + chữ mờ ở ô đầu ─────────────────────────────── */

function gridPainter(paths: string[] | undefined, ch: string, ghost: boolean): Painter {
  return (ctx, w, h, o) => {
    const c = w / CELLS;
    const line = o.exporting ? '#c9ccd1' : o.dark ? '#3a3e46' : '#d9d5cb';
    const dash = o.exporting ? '#e3e5e8' : o.dark ? '#2e3239' : '#ebe7de';
    ctx.save();
    // Đường giữa ô (nét đứt) — khung chia 4 như vở tập viết.
    ctx.strokeStyle = dash;
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    for (let i = 0; i < CELLS; i++) {
      ctx.beginPath();
      ctx.moveTo(i * c + c / 2, 0); ctx.lineTo(i * c + c / 2, h);
      ctx.moveTo(i * c, h / 2); ctx.lineTo(i * c + c, h / 2);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.strokeStyle = line;
    ctx.lineWidth = 1.5;
    for (let i = 0; i <= CELLS; i++) {
      const x = Math.min(w - 0.75, Math.max(0.75, i * c));
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    ctx.strokeRect(0.75, 0.75, w - 1.5, h - 1.5);
    // Chữ mờ để tô — KHÔNG xuất sang ảnh gửi AI (AI phải thấy nét của người học).
    if (ghost && !o.exporting) {
      ctx.strokeStyle = o.dark ? 'rgba(143,179,230,0.22)' : 'rgba(29,79,145,0.16)';
      ctx.fillStyle = ctx.strokeStyle;
      if (paths?.length && typeof Path2D !== 'undefined') {
        ctx.translate(c * 0.06, c * 0.06);
        ctx.scale((c * 0.88) / 109, (c * 0.88) / 109);
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        for (const d of paths) ctx.stroke(new Path2D(d));
      } else {
        ctx.font = `${Math.round(c * 0.72)}px "Hiragino Mincho ProN","Yu Mincho","Noto Serif JP",serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(ch, c / 2, h / 2 + c * 0.03);
      }
    }
    ctx.restore();
  };
}

/* ── Ô mẫu: chữ vẽ từ KanjiVG + chạy thứ tự nét ────────────────────────── */

function ModelCell({ ch, paths }: { ch: string; paths?: string[] }) {
  // step = số nét đã vẽ xong; `null` = đứng yên, hiện đủ nét.
  const [step, setStep] = useState<number | null>(null);
  const run = () => setStep(0);
  const n = paths?.length ?? 0;
  return (
    <div className={s.wModel}>
      <svg viewBox="0 0 109 109" className={s.wModelSvg} aria-label={`Chữ mẫu ${ch}`} role="img">
        <path d="M54.5 0V109M0 54.5H109" className={s.wGuide} />
        {paths ? (
          <>
            {step !== null && paths.map((d, i) => <path key={`g${i}`} d={d} className={s.wStrokeGhost} />)}
            {paths.map((d, i) => {
              if (step !== null && i > step) return null;
              const anim = step !== null && i === step;
              return (
                <path
                  key={`${i}-${anim ? step : 'x'}`}
                  d={d}
                  pathLength={1}
                  className={anim ? `${s.wStroke} ${s.wStrokeAnim}` : s.wStroke}
                  onAnimationEnd={anim ? () => setStep(i + 1 >= n ? null : i + 1) : undefined}
                />
              );
            })}
            {paths.map((d, i) => {
              if (step !== null && i > step) return null;
              const [x, y] = startOf(d);
              return <text key={`n${i}`} x={x - 5} y={y - 1} className={s.wNum}>{i + 1}</text>;
            })}
          </>
        ) : (
          <text x="54.5" y="58" textAnchor="middle" dominantBaseline="middle" className={s.wFallback}>{ch}</text>
        )}
      </svg>
      <div className={s.wModelFoot}>
        <span className={s.wModelCh}>{ch}</span>
        {n > 0 && <span className={s.wCount}>{n} nét</span>}
        {n > 0 && (
          <button type="button" className={s.wPlay} onClick={run} aria-label={`Xem thứ tự nét chữ ${ch}`} disabled={step !== null}>
            <Play size={12} /> Thứ tự nét
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Một hàng luyện ────────────────────────────────────────────────────── */

/**
 * Chỉ dựng canvas khi hàng ở GẦN màn hình. Bài 0 có 10 khối × 10 hàng; mỗi
 * canvas Retina ~1MB bộ nhớ, và Safari iPad giết tab khi tổng canvas vượt
 * trần. Nét nằm ở state của khối nên gỡ canvas ra không mất gì.
 */
function useNear(ref: React.RefObject<HTMLElement | null>) {
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') { setNear(true); return; }
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: '600px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return near;
}

function PracticeRow({
  ch, paths, ghost, tool, color, strokes, onChange, onActive, register,
}: {
  ch: string; paths?: string[]; ghost: boolean; tool: Tool; color: InkColor;
  strokes: Stroke[] | undefined; onChange: (s: Stroke[]) => void;
  onActive: () => void; register: (h: HandCanvasHandle | null) => void;
}) {
  const ref = useRef<HandCanvasHandle | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const near = useNear(box);
  const painter = useMemo(() => gridPainter(paths, ch, ghost), [paths, ch, ghost]);
  return (
    <div className={s.wRow}>
      <ModelCell ch={ch} paths={paths} />
      <div className={s.wPractice} ref={box}>
        {!near ? <div className={`${s.inkWrap} ${s.wPlaceholder}`} style={{ aspectRatio: String(CELLS) }} /> : <HandCanvas
          ref={(h) => { ref.current = h; register(h); }}
          aspect={1 / CELLS}
          strokes={strokes}
          onChange={onChange}
          onActive={onActive}
          tool={tool}
          color={color}
          penWidth={7}
          designWidth={360}
          background={painter}
          ariaLabel={`Ô tập viết chữ ${ch}`}
        />}
        <div className={s.wRowTools}>
          <button type="button" className={s.wMini} onClick={() => ref.current?.undo()} aria-label={`Hoàn tác nét chữ ${ch}`} title="Hoàn tác"><Undo2 size={14} /></button>
          <button type="button" className={s.wMini} onClick={() => ref.current?.clear()} aria-label={`Xoá hàng chữ ${ch}`} title="Xoá hàng này"><X size={14} /></button>
        </div>
      </div>
    </div>
  );
}

/* ── Khối ──────────────────────────────────────────────────────────────── */

type Saved = { v: 1; ink: Record<string, Stroke[]> };

export default function WriteBlock({ b }: { b: Extract<Block, { t: 'write' }> }) {
  const course = useCourse();
  const tutor = useTutor();
  const data = useStrokeData();
  const chars = useMemo(() => [...new Set(b.chars)], [b.chars]);
  const key = `${course?.storageKey ?? 'sach'}:ink:${b.id}`;
  const save = useInkSaver(key);

  const [ink, setInk] = useState<Record<string, Stroke[]>>({});
  const [page, setPage] = useState(0);
  const [tool, setTool] = useState<Tool>('pen');
  const [color, setColor] = useState<InkColor>('k');
  const [ghost, setGhost] = useState(true);
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState<{ text: string; diem: number | null } | null>(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    const v = loadInk<Saved>(key);
    setInk(v?.v === 1 && v.ink ? v.ink : {});
  }, [key]);

  const inkRef = useRef(ink);
  inkRef.current = ink;
  const update = useCallback((ch: string, st: Stroke[]) => {
    const next = { ...inkRef.current };
    if (st.length) next[ch] = st; else delete next[ch];
    inkRef.current = next;
    setInk(next);
    save(Object.keys(next).length ? { v: 1, ink: next } : null);
  }, [save]);

  // Ô vừa viết gần nhất — nút Hoàn tác trên thanh công cụ chung trỏ vào nó.
  const handles = useRef<Record<string, HandCanvasHandle | null>>({});
  const active = useRef<string | null>(null);

  const pages = Math.ceil(chars.length / PAGE);
  const shown = chars.slice(page * PAGE, page * PAGE + PAGE);
  const written = chars.filter((c) => ink[c]?.length);

  const clearAll = () => {
    if (!written.length || !confirm('Xoá hết chữ đã viết trong khối này?')) return;
    inkRef.current = {};
    setInk({});
    save(null);
    setRes(null);
  };

  /** Ghép các hàng đã viết thành MỘT ảnh: số hàng bên trái, ba ô bên phải. */
  const composeImage = () => {
    const rows = written.slice(0, 16);
    const cell = 150, label = 44, pad = 10;
    const rowW = cell * CELLS;
    const cv = document.createElement('canvas');
    cv.width = label + rowW + pad;
    cv.height = rows.length * (cell + pad) + pad;
    const ctx = cv.getContext('2d');
    if (!ctx) return null;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, cv.width, cv.height);
    rows.forEach((ch, i) => {
      const y = pad + i * (cell + pad);
      ctx.fillStyle = '#6b7280';
      ctx.font = 'bold 22px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(i + 1), label / 2, y + cell / 2);
      const row = renderInk(ink[ch], rowW, 1 / CELLS, gridPainter(data?.[ch], ch, false));
      ctx.drawImage(row, label, y);
    });
    return { url: cv.toDataURL('image/png'), rows };
  };

  const askAI = async () => {
    const img = composeImage();
    if (!img) return;
    setBusy(true); setErr(''); setRes(null);
    try {
      const r = await api.post('/ielts/ai/xem-chu-viet', { image: b64(img.url), chars: img.rows, lang: 'ja' }, AI_TIMEOUT);
      const d = r.data?.data as { ketQua: string | null; diem?: number | null; lyDo?: string };
      if (d?.ketQua) {
        setRes({ text: d.ketQua, diem: d.diem ?? null });
        if (typeof d.diem === 'number') tutor.report(b.id, Math.max(0, Math.min(100, Math.round(d.diem))));
      } else setErr(d?.lyDo === 'ai_unavailable' ? 'AI xem chữ đang tạm tắt.' : 'AI chưa xem được, thử lại nhé.');
    } catch (e) {
      const m = (e as { response?: { status?: number; data?: { message?: string } } })?.response;
      setErr(m?.status === 401 ? 'Đăng nhập để AI xem chữ.' : m?.data?.message || 'Không kết nối được AI.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={s.wBox}>
      <div className={s.quizTitle}>✍️ {b.title}</div>
      <div className={s.quizSub}>
        {b.note ?? 'Bấm ▶ để xem thứ tự nét, rồi tô theo chữ mờ ở ô đầu và tự viết ở hai ô sau. Viết bằng Apple Pencil, chuột hoặc ngón tay.'}
      </div>

      <InkTools tool={tool} setTool={setTool} color={color} setColor={setColor}
        onUndo={() => { const h = active.current ? handles.current[active.current] : null; h?.undo(); }}
        onClear={clearAll} clearLabel="Xoá hết">
        <button type="button" className={`${s.inkTool} ${ghost ? s.inkToolOn : ''}`} onClick={() => setGhost(!ghost)} aria-pressed={ghost} title="Chữ mờ ở ô đầu để tô theo">
          {ghost ? <Eye size={16} /> : <EyeOff size={16} />} <span>Chữ mờ</span>
        </button>
      </InkTools>

      {pages > 1 && (
        <div className={s.wPager}>
          <button type="button" className={s.wMini} disabled={page === 0} onClick={() => setPage(page - 1)} aria-label="Nhóm trước"><ChevronLeft size={16} /></button>
          {Array.from({ length: pages }, (_, i) => (
            <button key={i} type="button" className={`${s.wChip} ${i === page ? s.wChipOn : ''}`} onClick={() => setPage(i)}>
              {chars.slice(i * PAGE, i * PAGE + PAGE).join('')}
            </button>
          ))}
          <button type="button" className={s.wMini} disabled={page >= pages - 1} onClick={() => setPage(page + 1)} aria-label="Nhóm sau"><ChevronRight size={16} /></button>
        </div>
      )}

      <div className={s.wRows}>
        {shown.map((ch) => (
          <PracticeRow
            key={ch}
            ch={ch}
            paths={data?.[ch]}
            ghost={ghost}
            tool={tool}
            color={color}
            strokes={ink[ch]}
            onChange={(st) => update(ch, st)}
            onActive={() => { active.current = ch; }}
            register={(h) => { handles.current[ch] = h; }}
          />
        ))}
      </div>

      <div className={s.quizFoot}>
        <span className={s.score}>Đã viết {written.length}/{chars.length} chữ</span>
        <button type="button" className={s.btn} disabled={busy || !written.length} onClick={askAI}>
          <Sparkles size={15} /> {busy ? 'AI đang xem…' : 'AI xem chữ'}
        </button>
      </div>
      {written.length > 16 && <div className={s.quizSub}>AI xem 16 chữ đầu đã viết mỗi lần.</div>}
      {err && <div className={`${s.feedback} ${s.bad}`}>{err}</div>}
      {res && (
        <div className={`${s.turnA} ${s.essayResult}`}>
          {res.diem !== null && <div className={s.wScore}>Điểm AI: <b>{res.diem}</b>/100</div>}
          <ChatMarkdown content={res.text} renderMath={false} />
          <button type="button" className={s.linkBtn} onClick={() => setRes(null)}><RotateCcw size={13} className="inline" /> Đóng nhận xét</button>
        </div>
      )}
      <div className={s.wCredit}>
        Thứ tự nét: <a href="https://kanjivg.tagaini.net" target="_blank" rel="noreferrer">KanjiVG</a> © Ulrich Apel,{' '}
        <a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noreferrer">CC BY-SA 3.0</a>
      </div>
    </div>
  );
}
