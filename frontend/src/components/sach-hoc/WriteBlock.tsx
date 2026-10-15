'use client';

/**
 * Khối `write` — tập viết chữ Nhật (kana, kanji) bằng Apple Pencil / chuột.
 *
 * Mỗi mục một hàng: ô mẫu (vẽ từ dữ liệu KanjiVG, có nút ▶ chạy thứ tự nét)
 * + ô luyện. Mục MỘT chữ: dải ba ô — ô đầu có chữ mờ để tô theo (bật/tắt được),
 * hai ô sau trống. Mục là TỪ nhiều chữ (15/10/2026, viết từ mới): lưới mỗi ô một
 * chữ — dòng trên chữ mờ để tô, dòng dưới tự viết; "Che mẫu" giấu mẫu, chỉ còn
 * gợi ý `goi` + 🔊. Mỗi hàng là MỘT canvas (ít canvas hơn → nhẹ hơn khi bài có 40
 * chữ Hán), chia trang 10 hàng một. Nét lưu theo khoá = chính mục (chữ/từ) ⇒ dữ
 * liệu đã lưu của khối cũ (toàn chữ đơn) đọc lại y nguyên.
 *
 * Thứ tự nét: public/kanjivg/strokes.json dựng bằng scripts/kanjivg-subset.mjs
 * (KanjiVG © Ulrich Apel, CC BY-SA 3.0 — dòng ghi công ở cuối khối là bắt buộc).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Eye, EyeOff, Play, RotateCcw, Sparkles, Undo2, Volume2, X } from 'lucide-react';
import api from '@/lib/api';
import ChatMarkdown from '@/components/chat/ChatMarkdown';
import HandCanvas, { InkTools, b64, loadInk, renderInk, useInkSaver, type HandCanvasHandle, type InkColor, type Painter, type Stroke, type Tool } from './HandCanvas';
import type { Block } from './types';
import { useCourse, useTutor } from './tutorContext';
import s from './course.module.css';
import { AI_TIMEOUT, play } from './audio';

/* ── Dữ liệu thứ tự nét (tải một lần cho cả trang) ─────────────────────── */

export type StrokeMap = Record<string, string[]>;
let strokesPromise: Promise<StrokeMap> | null = null;
export function loadStrokes(): Promise<StrokeMap> {
  // Web: tải file tĩnh /kanjivg/strokes.json (nhẹ, trình duyệt cache).
  // App desktop (origin app://): file đó ở cuongthai.com KHÔNG có header CORS nên
  // fetch bị chặn — lùi về import() chính file JSON, gói thành chunk riêng chỉ
  // tải khi cần (web không bao giờ đi nhánh này trừ khi mạng hỏng).
  const qua = () => import('../../../public/kanjivg/strokes.json').then((m) => (m.default ?? m) as unknown as StrokeMap);
  strokesPromise ??= (
    typeof window !== 'undefined' && window.location.protocol.startsWith('http')
      ? fetch('/kanjivg/strokes.json').then((r) => (r.ok ? r.json() : qua())).catch(qua)
      : qua()
  ).catch(() => {
    strokesPromise = null; // lỗi: lần sau thử lại
    return {} as StrokeMap;
  });
  return strokesPromise;
}
export function useStrokeData() {
  const [data, setData] = useState<StrokeMap | null>(null);
  useEffect(() => {
    let on = true;
    loadStrokes().then((d) => on && setData(d));
    return () => { on = false; };
  }, []);
  return data;
}

/** Điểm bắt đầu của nét (lệnh M đầu tiên) — chỗ đặt số thứ tự. */
export function startOf(d: string): [number, number] {
  const m = /M\s*([-\d.]+)[ ,]?([-\d.]+)/.exec(d);
  return m ? [Number(m[1]), Number(m[2])] : [0, 0];
}

const CELLS = 3;
const PAGE = 10;
/** Từ dài hơn chừng này chữ thì xuống dòng trong lưới tập. */
const TU_COT_TOI_DA = 6;

/* ── Lưới ô luyện: MỘT chữ (3 ô liền) hoặc một TỪ (mỗi dòng viết lại cả từ) ── */

/**
 * `o[i]` = chữ mờ của ô thứ i (theo hàng, trái → phải); `null` = ô trống.
 * - Mục một chữ: 1 dòng × 3 ô, chữ mờ ở ô đầu (như trước — dữ liệu cũ y nguyên).
 * - Mục là từ k chữ: lưới `cot` = min(k, 6) cột; lượt 1 (chữ mờ để tô) + lượt 2 (tự viết),
 *   mỗi lượt ceil(k / cot) dòng; mỗi ô một chữ của từ, đúng thứ tự.
 */
export type Luoi = { cot: number; dong: number; o: (string | null)[]; laTu: boolean };
export function luoiCua(muc: string): Luoi {
  const ky = Array.from(muc);
  if (ky.length <= 1) return { cot: CELLS, dong: 1, o: [muc, null, null], laTu: false };
  const cot = Math.min(ky.length, TU_COT_TOI_DA);
  const moiLuot = Math.ceil(ky.length / cot);
  const luot = (mo: boolean) => Array.from({ length: moiLuot * cot }, (_, i) => (mo && i < ky.length ? ky[i]! : null));
  return { cot, dong: moiLuot * 2, o: [...luot(true), ...luot(false)], laTu: true };
}

/* ── Nền ô luyện: ô 田 + chữ mờ ─────────────────────────────────────────── */

function gridPainter(luoi: Luoi, data: StrokeMap | null | undefined, ghost: boolean): Painter {
  return (ctx, w, h, o) => {
    const { cot, dong } = luoi;
    const c = w / cot;
    const line = o.exporting ? '#c9ccd1' : o.dark ? '#3a3e46' : '#d9d5cb';
    const dash = o.exporting ? '#e3e5e8' : o.dark ? '#2e3239' : '#ebe7de';
    ctx.save();
    // Đường giữa ô (nét đứt) — khung chia 4 như vở tập viết.
    ctx.strokeStyle = dash;
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    for (let r = 0; r < dong; r++) {
      for (let i = 0; i < cot; i++) {
        ctx.beginPath();
        ctx.moveTo(i * c + c / 2, r * c); ctx.lineTo(i * c + c / 2, (r + 1) * c);
        ctx.moveTo(i * c, r * c + c / 2); ctx.lineTo(i * c + c, r * c + c / 2);
        ctx.stroke();
      }
    }
    ctx.setLineDash([]);
    ctx.strokeStyle = line;
    ctx.lineWidth = 1.5;
    for (let i = 0; i <= cot; i++) {
      const x = Math.min(w - 0.75, Math.max(0.75, i * c));
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let r = 1; r < dong; r++) {
      // Ranh giữa lượt tô (trên) và lượt tự viết (dưới) đậm hơn.
      ctx.lineWidth = luoi.laTu && r === dong / 2 ? 3 : 1.5;
      ctx.beginPath(); ctx.moveTo(0, r * c); ctx.lineTo(w, r * c); ctx.stroke();
    }
    ctx.lineWidth = 1.5;
    ctx.strokeRect(0.75, 0.75, w - 1.5, h - 1.5);
    // Chữ mờ để tô — KHÔNG xuất sang ảnh gửi AI (AI phải thấy nét của người học).
    if (ghost && !o.exporting) {
      ctx.strokeStyle = o.dark ? 'rgba(143,179,230,0.22)' : 'rgba(29,79,145,0.16)';
      ctx.fillStyle = ctx.strokeStyle;
      luoi.o.forEach((ch, i) => {
        if (!ch) return;
        const x0 = (i % cot) * c, y0 = Math.floor(i / cot) * c;
        const paths = data?.[ch];
        ctx.save();
        ctx.translate(x0, y0);
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
          ctx.fillText(ch, c / 2, c / 2 + c * 0.03);
        }
        ctx.restore();
      });
    }
    ctx.restore();
  };
}

/* ── Ô mẫu: chữ vẽ từ KanjiVG + chạy thứ tự nét ────────────────────────── */

/** Một khung nét. `chay` bật ⇒ vẽ lần lượt từng nét, xong gọi `onXong`. */
function KhungNet({ ch, paths, chay, onXong, className }: {
  ch: string; paths?: string[]; chay: boolean; onXong: () => void; className?: string;
}) {
  // step = số nét đã vẽ xong; `null` = đứng yên, hiện đủ nét.
  const [step, setStep] = useState<number | null>(null);
  const n = paths?.length ?? 0;
  const xongRef = useRef(onXong);
  xongRef.current = onXong;
  useEffect(() => {
    if (!chay) return;
    if (n) setStep(0);
    else xongRef.current(); // chữ không có dữ liệu nét ⇒ qua luôn
  }, [chay, n]);
  return (
    <svg viewBox="0 0 109 109" className={className ?? s.wModelSvg} aria-label={`Chữ mẫu ${ch}`} role="img">
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
                onAnimationEnd={anim ? () => {
                  if (i + 1 >= n) { setStep(null); xongRef.current(); } else setStep(i + 1);
                } : undefined}
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
  );
}

/**
 * Ô mẫu của một mục: một chữ (khung to) hoặc cả TỪ (các khung nhỏ liền nhau, ▶ chạy
 * thứ tự nét lần lượt từng chữ). `che` ⇒ giấu mẫu, chỉ còn gợi ý + 🔊 (tự nhớ ra từ).
 */
function ModelCell({ muc, data, goi, che }: { muc: string; data: StrokeMap | null; goi?: string; che: boolean }) {
  const ky = Array.from(muc);
  const laTu = ky.length > 1;
  // dang = chỉ số chữ đang chạy nét; null = đứng yên.
  const [dang, setDang] = useState<number | null>(null);
  const tong = ky.reduce((a, c) => a + (data?.[c]?.length ?? 0), 0);
  const nghe = () => { void play({ text: muc, voice: 'ja-nu' }); };
  if (che) {
    return (
      <div className={`${s.wModel} ${laTu ? s.wModelTu : ''}`}>
        <div className={s.wCheMau}>
          <span className={s.wCheDau}>?</span>
          {goi && <span className={s.wGoi}>{goi}</span>}
        </div>
        <div className={s.wModelFoot}>
          <button type="button" className={s.wPlay} onClick={nghe} aria-label="Nghe từ cần viết"><Volume2 size={12} /> Nghe</button>
          <span className={s.wCount}>{ky.length} chữ</span>
        </div>
      </div>
    );
  }
  return (
    <div className={`${s.wModel} ${laTu ? s.wModelTu : ''}`}>
      {laTu ? (
        <div className={s.wModelTuKhung}>
          {ky.map((c, i) => (
            <KhungNet key={`${c}-${i}`} ch={c} paths={data?.[c]} className={s.wModelSvgNho}
              chay={dang === i} onXong={() => setDang(i + 1 < ky.length ? i + 1 : null)} />
          ))}
        </div>
      ) : (
        <KhungNet ch={muc} paths={data?.[muc]} chay={dang === 0} onXong={() => setDang(null)} />
      )}
      <div className={s.wModelFoot}>
        <span className={s.wModelCh}>{muc}</span>
        {tong > 0 && <span className={s.wCount}>{tong} nét</span>}
        {tong > 0 && (
          <button type="button" className={s.wPlay} onClick={() => setDang(0)} aria-label={`Xem thứ tự nét ${muc}`} disabled={dang !== null}>
            <Play size={12} /> Thứ tự nét
          </button>
        )}
        {laTu && <button type="button" className={s.wPlay} onClick={nghe} aria-label={`Nghe ${muc}`}><Volume2 size={12} /></button>}
      </div>
      {goi && <div className={s.wGoi}>{goi}</div>}
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
  ch, data, goi, che, ghost, tool, color, strokes, onChange, onActive, register,
}: {
  ch: string; data: StrokeMap | null; goi?: string; che: boolean; ghost: boolean; tool: Tool; color: InkColor;
  strokes: Stroke[] | undefined; onChange: (s: Stroke[]) => void;
  onActive: () => void; register: (h: HandCanvasHandle | null) => void;
}) {
  const ref = useRef<HandCanvasHandle | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const near = useNear(box);
  const luoi = useMemo(() => luoiCua(ch), [ch]);
  const painter = useMemo(() => gridPainter(luoi, data, ghost), [luoi, data, ghost]);
  const loai = luoi.laTu ? 'từ' : 'chữ';
  return (
    <div className={s.wRow}>
      <ModelCell muc={ch} data={data} goi={goi} che={che} />
      <div
        className={s.wPractice}
        ref={box}
        // Lưới từ: ô ~100px, đừng kéo giãn hết cột (từ 2 chữ thành ô 240px).
        style={luoi.laTu ? { maxWidth: luoi.cot * 104 + 40, minWidth: 0 } : undefined}
      >
        {!near ? <div className={`${s.inkWrap} ${s.wPlaceholder}`} style={{ aspectRatio: `${luoi.cot} / ${luoi.dong}` }} /> : <HandCanvas
          ref={(h) => { ref.current = h; register(h); }}
          aspect={luoi.dong / luoi.cot}
          strokes={strokes}
          onChange={onChange}
          onActive={onActive}
          tool={tool}
          color={color}
          penWidth={7}
          // 120 px thiết kế mỗi ô — nét dày bằng nhau dù hàng chữ hay hàng từ.
          designWidth={luoi.cot * 120}
          background={painter}
          ariaLabel={`Ô tập viết ${loai} ${ch}`}
        />}
        <div className={s.wRowTools}>
          <button type="button" className={s.wMini} onClick={() => ref.current?.undo()} aria-label={`Hoàn tác nét ${loai} ${ch}`} title="Hoàn tác"><Undo2 size={14} /></button>
          <button type="button" className={s.wMini} onClick={() => ref.current?.clear()} aria-label={`Xoá hàng ${loai} ${ch}`} title="Xoá hàng này"><X size={14} /></button>
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
  // "Che mẫu": giấu ô mẫu, chỉ còn gợi ý + 🔊 — luyện nhớ ra từ mới. Chỉ có ở khối có từ / gợi ý.
  const [che, setChe] = useState(false);
  const coTu = useMemo(() => chars.some((c) => Array.from(c).length > 1), [chars]);
  const coCheMau = coTu || !!b.goi;
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

  /**
   * Ghép các hàng đã viết thành MỘT ảnh: số hàng bên trái, lưới ô bên phải (hàng chữ
   * 3 ô; hàng từ: dòng tô + dòng tự viết). Trần chiều cao để ảnh không quá nặng.
   */
  const composeImage = () => {
    const cell = 150, label = 44, pad = 10, TRAN_CAO = 3200;
    const rows: string[] = [];
    let cao = pad;
    for (const ch of written) {
      if (rows.length >= 16) break;
      const h = luoiCua(ch).dong * cell + pad;
      if (rows.length && cao + h > TRAN_CAO) break;
      rows.push(ch);
      cao += h;
    }
    const cv = document.createElement('canvas');
    cv.width = label + Math.max(...rows.map((ch) => luoiCua(ch).cot * cell)) + pad;
    cv.height = cao;
    const ctx = cv.getContext('2d');
    if (!ctx) return null;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, cv.width, cv.height);
    let y = pad;
    rows.forEach((ch, i) => {
      const luoi = luoiCua(ch);
      const rowW = cell * luoi.cot, rowH = cell * luoi.dong;
      ctx.fillStyle = '#6b7280';
      ctx.font = 'bold 22px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(i + 1), label / 2, y + Math.min(rowH, cell) / 2);
      const row = renderInk(ink[ch] ?? [], rowW, luoi.dong / luoi.cot, gridPainter(luoi, data, false));
      ctx.drawImage(row, label, y);
      y += rowH + pad;
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
        {b.note ?? (coTu
          ? 'Bấm ▶ để xem thứ tự nét, tô theo chữ mờ ở dòng trên rồi tự viết lại cả từ ở dòng dưới (mỗi ô một chữ). Bật "Che mẫu" để tự nhớ ra từ từ nghĩa + 🔊.'
          : 'Bấm ▶ để xem thứ tự nét, rồi tô theo chữ mờ ở ô đầu và tự viết ở hai ô sau. Viết bằng Apple Pencil, chuột hoặc ngón tay.')}
      </div>

      <InkTools tool={tool} setTool={setTool} color={color} setColor={setColor}
        onUndo={() => { const h = active.current ? handles.current[active.current] : null; h?.undo(); }}
        onClear={clearAll} clearLabel="Xoá hết">
        <button type="button" className={`${s.inkTool} ${ghost ? s.inkToolOn : ''}`} onClick={() => setGhost(!ghost)} aria-pressed={ghost} title="Chữ mờ ở ô đầu để tô theo">
          {ghost ? <Eye size={16} /> : <EyeOff size={16} />} <span>Chữ mờ</span>
        </button>
        {coCheMau && (
          <button type="button" className={`${s.inkTool} ${che ? s.inkToolOn : ''}`}
            onClick={() => { const v = !che; setChe(v); if (v) setGhost(false); }}
            aria-pressed={che} title="Giấu mẫu — chỉ còn nghĩa + 🔊, tự nhớ ra rồi viết">
            <EyeOff size={16} /> <span>Che mẫu</span>
          </button>
        )}
      </InkTools>

      {pages > 1 && (
        <div className={s.wPager}>
          <button type="button" className={s.wMini} disabled={page === 0} onClick={() => setPage(page - 1)} aria-label="Nhóm trước"><ChevronLeft size={16} /></button>
          {Array.from({ length: pages }, (_, i) => (
            <button key={i} type="button" className={`${s.wChip} ${i === page ? s.wChipOn : ''}`} onClick={() => setPage(i)}>
              {chars.slice(i * PAGE, i * PAGE + PAGE).join(coTu ? '・' : '')}
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
            data={data}
            goi={b.goi?.[ch]}
            che={che}
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
        <span className={s.score}>Đã viết {written.length}/{chars.length} {coTu ? 'mục' : 'chữ'}</span>
        <button type="button" className={s.btn} disabled={busy || !written.length} onClick={askAI}>
          <Sparkles size={15} /> {busy ? 'AI đang xem…' : 'AI xem chữ'}
        </button>
      </div>
      {written.length > 16 && <div className={s.quizSub}>AI xem tối đa 16 {coTu ? 'mục' : 'chữ'} đầu đã viết mỗi lần.</div>}
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
