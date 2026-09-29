'use client';

/**
 * Thẻ chi tiết MỘT chữ Hán — bật lên khi chạm vào chữ Hán ở bất cứ đâu trong khoá
 * (bảng chữ Hán, câu đọc không furigana, chữ có furigana trong câu, thẻ "Chữ Hán
 * của lớp"). Gồm: hoạt hình thứ tự nét (KanjiVG — phát, từng nét, số thứ tự),
 * Hán Việt/On/Kun/nghĩa/cách nhớ, "Từ đi chung" (từ cô chép + từ vựng mọi bài có
 * chữ này, ghi Bài N, đánh dấu chữ Hán nào đã học), câu ví dụ, ô tập viết.
 *
 * Mở: `openKanji('後')`, hoặc bất kỳ phần tử nào có `data-kj` (Inline tự gắn cho
 * mỗi chữ Hán). Dữ liệu tải chậm qua `course.kanji()` — trang không nặng thêm.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Pause, PenLine, Play, RotateCcw, SkipForward, Volume2, X } from 'lucide-react';
import type { Course } from './course';
import { IS_KANJI, lopOf, type HanTuTu, type KanjiDict, type KanjiWord } from './kanji';
import { Inline } from './Blocks';
import { play } from './audio';
import WriteBlock, { startOf, useStrokeData } from './WriteBlock';
import s from './course.module.css';
import k from './kanji.module.css';

/* ── Mở thẻ từ bất cứ đâu ─────────────────────────────────────────────── */

let opener: ((ch: string) => void) | null = null;
export function openKanji(ch: string) { opener?.(ch); }
/** Trang hiện có thẻ chữ Hán không (để khối khác quyết định có gắn nút chạm hay không). */
export const kanjiLive = () => opener !== null;

const plain = (t: string) => t.replace(/\{([^|}]+)\|[^}]+\}/g, '$1').replace(/\*\*|==|~~/g, '');
const kanjiOf = (t: string) => [...new Set([...plain(t)].filter((c) => IS_KANJI.test(c)))];
/** Chữ đọc được của một từ (bỏ furigana, giữ cách đọc) — để phát âm. */
const kana = (t: string) => t.replace(/\{[^|}]+\|([^}]+)\}/g, '$1').replace(/［.*?］|\d$/g, '');

/** Bài đang mở (từ `?bai=b5-…`) — mốc "đã học / bài này / bài sau". */
function currentBai(): number | null {
  if (typeof window === 'undefined') return null;
  const m = /^b(\d+)-/.exec(new URLSearchParams(window.location.search).get('bai') ?? '');
  return m ? Number(m[1]) : null;
}

let dictCache: Promise<KanjiDict> | null = null;
export function useKanjiDict(course: Course | null | undefined, want = true) {
  const [d, setD] = useState<KanjiDict | null>(null);
  const [err, setErr] = useState(false);
  useEffect(() => {
    if (!want || !course?.kanji) return;
    let on = true;
    dictCache ??= course.kanji().catch((e) => { dictCache = null; throw e; });
    dictCache.then((x) => on && setD(x), () => on && setErr(true));
    return () => { on = false; };
  }, [course, want]);
  return { dict: d, err };
}

/* ── Hoạt hình thứ tự nét ─────────────────────────────────────────────── */

function StrokePlayer({ ch, paths }: { ch: string; paths?: string[] }) {
  const n = paths?.length ?? 0;
  // shown = số nét đã hiện; anim = nét đang chạy (null = đứng yên).
  const [shown, setShown] = useState(n);
  const [anim, setAnim] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [slow, setSlow] = useState(false);
  const [nums, setNums] = useState(true);

  // Mở chữ mới: tự phát một lượt từ đầu.
  useEffect(() => {
    if (!n) return;
    setShown(0); setAnim(0); setPlaying(true);
  }, [ch, n]);

  const onEnd = (i: number) => {
    const next = i + 1;
    setShown(next);
    if (playing && next < n) setAnim(next);
    else { setAnim(null); setPlaying(false); }
  };
  const go = (to: number) => { setPlaying(false); setAnim(null); setShown(Math.max(0, Math.min(n, to))); };
  const stepFwd = () => { if (shown < n) { setPlaying(false); setAnim(shown); } };
  const toggle = () => {
    if (playing) { setPlaying(false); setAnim(null); return; }
    const from = shown >= n ? 0 : shown;
    setShown(from); setAnim(from); setPlaying(true);
  };

  if (!paths?.length) {
    return (
      <div className={k.player}>
        <svg viewBox="0 0 109 109" className={k.svg} role="img" aria-label={`Chữ ${ch}`}>
          <text x="54.5" y="60" textAnchor="middle" dominantBaseline="middle" className={`${k.fallback} ${k.mincho}`}>{ch}</text>
        </svg>
        <div className={k.step}>Chưa có dữ liệu thứ tự nét cho chữ này.</div>
      </div>
    );
  }
  const cur = anim ?? (shown > 0 && shown < n ? shown - 1 : null);
  return (
    <div className={k.player}>
      <svg viewBox="0 0 109 109" className={k.svg} role="img" aria-label={`Thứ tự nét chữ ${ch}: ${n} nét`}>
        <path d="M54.5 2V107M2 54.5H107" className={k.guide} />
        {paths.map((d, i) => <path key={`t${i}`} d={d} className={k.stTodo} />)}
        {paths.map((d, i) => {
          if (i > shown || (i === shown && anim !== i)) return null;
          const running = anim === i;
          return (
            <path
              key={`${i}-${running ? 'a' : 's'}`}
              d={d}
              pathLength={1}
              className={running ? `${k.stCur} ${k.stAnim}` : i === cur ? k.stCur : k.st}
              style={running ? ({ '--dur': slow ? '1.4s' : '0.7s' } as React.CSSProperties) : undefined}
              onAnimationEnd={running ? () => onEnd(i) : undefined}
            />
          );
        })}
        {nums && paths.map((d, i) => {
          if (i >= Math.max(shown, (anim ?? -1) + 1)) return null;
          const [x, y] = startOf(d);
          return <text key={`n${i}`} x={x - 4} y={y - 1.5} className={`${k.num} ${i === cur ? k.numCur : ''}`}>{i + 1}</text>;
        })}
      </svg>
      <div className={k.step}>Nét {Math.min(n, anim !== null ? anim + 1 : shown)}/{n}</div>
      <div className={k.controls}>
        <button type="button" className={k.iconBtn} onClick={() => go(0)} aria-label="Về đầu" title="Về đầu"><RotateCcw size={15} /></button>
        <button type="button" className={k.iconBtn} onClick={() => go(shown - 1)} disabled={shown === 0} aria-label="Lùi một nét" title="Lùi một nét"><ChevronLeft size={16} /></button>
        <button type="button" className={k.play} onClick={toggle}>
          {playing ? <><Pause size={15} /> Dừng</> : <><Play size={15} /> {shown >= n ? 'Phát lại' : 'Phát'}</>}
        </button>
        <button type="button" className={k.iconBtn} onClick={stepFwd} disabled={shown >= n || anim !== null} aria-label="Nét tiếp theo" title="Nét tiếp theo"><ChevronRight size={16} /></button>
        <button type="button" className={k.iconBtn} onClick={() => go(n)} aria-label="Hiện đủ nét" title="Hiện đủ nét"><SkipForward size={15} /></button>
      </div>
      <div className={k.controls}>
        <button type="button" className={k.iconBtn} aria-pressed={slow} onClick={() => setSlow(!slow)}>{slow ? 'Chậm ✓' : 'Chậm'}</button>
        <button type="button" className={k.iconBtn} aria-pressed={nums} onClick={() => setNums(!nums)}>{nums ? 'Số nét ✓' : 'Số nét'}</button>
      </div>
    </div>
  );
}

/* ── Một từ đi chung ──────────────────────────────────────────────────── */

type Row = { w: string; ro: string; vi: string; n?: number; bang?: boolean };

function WordRow({ r, ch, now, learned, dict, onOpen }: {
  r: Row; ch: string; now: number | null; learned: Map<string, number>; dict: KanjiDict; onOpen: (c: string) => void;
}) {
  const others = kanjiOf(r.w).filter((c) => c !== ch);
  return (
    <div className={`${k.word} ${r.bang ? k.wordBang : ''}`}>
      <button type="button" className={k.speak} aria-label={`Nghe: ${plain(r.w)}`} onClick={() => play({ text: kana(r.w) })}><Volume2 size={14} /></button>
      <div className={k.wordW}>
        <span><Inline text={r.w} /></span>
        {r.bang && <span className={`${k.tag} ${k.tagBang}`}>cô chép</span>}
        {r.n !== undefined && <span className={`${k.tag} ${r.n === now ? k.tagNow : ''}`}>Bài {r.n}</span>}
      </div>
      <div>
        <div className={s.ro}>{r.ro}</div>
        <div className={k.wordVi}><Inline text={r.vi} /></div>
        {others.length > 0 && (
          <div className={k.chips}>
            {others.map((c) => {
              const at = learned.get(c);
              const done = at !== undefined && (now === null || at <= now);
              const hv = dict.han[c]?.hv ?? dict.bang[c]?.hv?.split(/[\s(]/)[0];
              return (
                <button key={c} type="button" className={`${k.chip} ${done ? k.chipDone : at !== undefined ? k.chipTodo : ''}`}
                  onClick={() => onOpen(c)} title={done ? `Đã học ở Bài ${at}` : at !== undefined ? `Học ở Bài ${at}` : 'Chữ ngoài danh sách của lớp'}>
                  <b>{c}</b>{hv}{done ? ` · B${at} ✓` : at !== undefined ? ` · B${at}` : ''}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Nội dung thẻ ─────────────────────────────────────────────────────── */

function KanjiBody({ ch, dict, onOpen }: { ch: string; dict: KanjiDict; onOpen: (c: string) => void }) {
  const strokes = useStrokeData();
  const paths = strokes?.[ch];
  const now = useMemo(() => currentBai(), []);
  const learned = useMemo(() => lopOf(dict), [dict]);
  const han = dict.han[ch];
  const bang = dict.bang[ch];
  const lop = learned.get(ch);
  const [write, setWrite] = useState(false);
  const [showLater, setShowLater] = useState(false);
  useEffect(() => { setWrite(false); setShowLater(false); }, [ch]);

  // Bài của một từ: tra theo chữ trần trong chỉ mục (từ soạn tay không ghi bài).
  const all: KanjiWord[] = dict.tu[ch] ?? [];
  const baiOf = useMemo(() => new Map(all.map((w) => [plain(w.w).replace(/［.*?］|\d$/g, ''), w.n])), [all]);
  const handRows: Row[] = (han?.tu ?? []).map((t: HanTuTu) => ({ ...t, n: baiOf.get(plain(t.w)) }));
  const handSet = new Set(handRows.map((r) => plain(r.w)));
  const rest: Row[] = all.filter((w) => !handSet.has(plain(w.w).replace(/［.*?］|\d$/g, ''))).map((w) => ({ ...w }));
  const inNow = now === null ? [] : rest.filter((w) => w.n === now);
  const before = rest.filter((w) => now === null || (w.n ?? 0) < now);
  const later = now === null ? [] : rest.filter((w) => (w.n ?? 0) > now);

  const exs = useMemo(() => {
    const list = dict.vd[ch] ?? [];
    if (now === null) return list.slice(0, 4);
    // Ưu tiên câu của bài đang học, rồi bài gần nhất phía trước.
    return [...list].sort((a, b) => {
      const da = a.n <= now ? now - a.n : 100 + a.n - now;
      const db = b.n <= now ? now - b.n : 100 + b.n - now;
      return da - db;
    }).slice(0, 4);
  }, [dict, ch, now]);

  const on = han?.on ?? (bang?.on ? bang.on.split(/[・、,\s]+/).filter(Boolean) : []);
  const kun = han?.kun ?? (bang?.kun ? bang.kun.split(/[・、,\s]+(?![^(]*\))/).filter(Boolean) : []);
  const hv = han?.hv ?? bang?.hv;
  const nghia = han?.nghia ?? bang?.nghia;
  const firstWord = handRows[0] ?? rest[0];
  const rowProps = { ch, now, learned, dict, onOpen };

  return (
    <>
      <div className={k.hero}>
        <StrokePlayer ch={ch} paths={paths} />
        <div className={k.info}>
          <div className={k.hvRow}>
            <span className={`${k.big} ${k.mincho}`}>{ch}</span>
            {hv && <span className={k.hv}>{hv}</span>}
            {firstWord && (
              <button type="button" className={k.iconBtn} onClick={() => play({ text: kana(firstWord.w) })} aria-label="Nghe từ tiêu biểu">
                <Volume2 size={15} /> {plain(firstWord.w)}
              </button>
            )}
          </div>
          {nghia && <div className={k.nghia}>{nghia}</div>}
          {han?.en && <div className={k.en}>{han.en}</div>}
          <div className={k.reads}>
            <span className={k.readLbl}>On 音</span>
            <span className={k.readVal}>{on.length ? on.map((x) => <span key={x}>{x}</span>) : <span>—</span>}</span>
            <span className={k.readLbl}>Kun 訓</span>
            <span className={k.readVal}>{kun.length ? kun.map((x) => <span key={x}>{x}</span>) : <span>—</span>}</span>
          </div>
          <div className={k.badges}>
            {paths && <span className={k.badge}>{paths.length} nét</span>}
            {lop !== undefined && (
              <span className={`${k.badge} ${dict.lop[lop]?.nguon === 'slide' ? k.badgeLop : k.badgeDk}`}>
                Chữ của lớp · Bài {lop}{dict.lop[lop]?.nguon === 'slide' ? ' (slide của cô)' : ' (dự kiến)'}
              </span>
            )}
            {lop === undefined && bang && <span className={k.badge}>Gặp ở bảng chữ Hán Bài {bang.n}</span>}
            {all.length > 0 && <span className={k.badge}>{all.length} từ trong khoá</span>}
          </div>
          {han?.nho && <div className={k.nho}><b>Cách nhớ: </b><Inline text={han.nho} /></div>}
        </div>
      </div>

      {handRows.length > 0 && (
        <section className={k.sec}>
          <div className={k.secTitle}>Từ đi chung <small>từ tiêu biểu{handRows.some((r) => r.bang) ? ' — nền xanh là từ cô chép trên bảng' : ''}</small></div>
          <div className={k.words}>{handRows.map((r) => <WordRow key={r.w} r={r} {...rowProps} />)}</div>
        </section>
      )}

      {rest.length > 0 && (
        <section className={k.sec}>
          <div className={k.secTitle}>Chữ {ch} trong từ vựng của khoá <small>chip xanh = chữ Hán đã học</small></div>
          {inNow.length > 0 && <><div className={k.groupLbl}>Bài đang học (Bài {now})</div><div className={k.words}>{inNow.map((r) => <WordRow key={r.w} r={r} {...rowProps} />)}</div></>}
          {before.length > 0 && <><div className={k.groupLbl}>{now === null ? 'Các bài' : 'Đã gặp ở bài trước — ghép với chữ đã học'}</div><div className={k.words}>{before.map((r) => <WordRow key={r.w} r={r} {...rowProps} />)}</div></>}
          {later.length > 0 && (showLater
            ? <><div className={k.groupLbl}>Sẽ gặp ở bài sau</div><div className={k.words}>{later.map((r) => <WordRow key={r.w} r={r} {...rowProps} />)}</div></>
            : <button type="button" className={`${s.btnGhost} ${k.more}`} onClick={() => setShowLater(true)}>Xem {later.length} từ ở các bài sau</button>)}
        </section>
      )}

      {exs.length > 0 && (
        <section className={k.sec}>
          <div className={k.secTitle}>Câu ví dụ</div>
          <div className={k.exs}>
            {exs.map((e) => (
              <div key={e.text} className={k.ex}>
                <button type="button" className={k.speak} aria-label="Nghe câu" onClick={() => play({ text: e.text })}><Volume2 size={14} /></button>
                <div>
                  <div className={k.exText}><Inline text={e.text} /> <span className={k.tag}>Bài {e.n}</span></div>
                  <div className={s.ro}>{e.ro}</div>
                  <div className={k.exVi}><Inline text={e.vi} /></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className={k.sec}>
        {!write ? (
          <button type="button" className={s.btn} onClick={() => setWrite(true)}><PenLine size={15} /> Tập viết chữ {ch}</button>
        ) : (
          <div className={k.writeWrap}>
            <WriteBlock b={{ t: 'write', id: `kj-${ch}`, title: `Tập viết chữ ${ch}`, chars: [ch], note: 'Xem hoạt hình ở trên cho thuộc thứ tự nét, rồi tô theo chữ mờ ở ô đầu và tự viết ở hai ô sau.' }} />
          </div>
        )}
      </section>
    </>
  );
}

/* ── Khung bật lên (đặt một lần trong CoursePage) ─────────────────────── */

export function KanjiHost({ course }: { course: Course }) {
  const [stack, setStack] = useState<string[]>([]);
  const open = stack.length > 0;
  const ch = stack[stack.length - 1];
  const { dict, err } = useKanjiDict(course, open);
  const bodyRef = useRef<HTMLDivElement>(null);

  const push = useCallback((c: string) => {
    setStack((st) => (st[st.length - 1] === c ? st : [...st, c].slice(-20)));
  }, []);

  useEffect(() => {
    opener = push;
    document.body.classList.add(k.kjLive);
    // Chạm vào chữ Hán bất kỳ (phần tử có data-kj) — trừ khi đang bôi đen để hỏi
    // gia sư, hoặc chữ nằm trong một nút (nút đó có việc riêng: phát âm, chọn đáp án…).
    const onClick = (e: MouseEvent) => {
      const t = (e.target as HTMLElement | null)?.closest?.('[data-kj]') as HTMLElement | null;
      if (!t) return;
      if (t.closest('button, a, input, textarea, label, [contenteditable="true"]')) return;
      const sel = window.getSelection();
      if (sel && !sel.isCollapsed && sel.toString().trim()) return;
      const c = t.dataset.kj || t.textContent || '';
      if (!IS_KANJI.test(c)) return;
      e.preventDefault();
      push([...c][0]);
    };
    document.addEventListener('click', onClick);
    return () => {
      if (opener === push) opener = null;
      document.body.classList.remove(k.kjLive);
      document.removeEventListener('click', onClick);
    };
  }, [push]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setStack([]); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [open]);

  useEffect(() => { bodyRef.current?.scrollTo({ top: 0 }); }, [ch]);

  if (!open) return null;
  const hv = dict?.han[ch]?.hv ?? dict?.bang[ch]?.hv?.split(/[\s(]/)[0];
  return (
    <>
      <div className={k.scrim} onClick={() => setStack([])} />
      <div className={k.sheet} role="dialog" aria-modal="true" aria-label={`Chữ Hán ${ch}`}>
        <div className={k.head}>
          {stack.length > 1 && (
            <button type="button" className={k.iconBtn} onClick={() => setStack((st) => st.slice(0, -1))} aria-label={`Quay lại chữ ${stack[stack.length - 2]}`}>
              <ArrowLeft size={16} /> {stack[stack.length - 2]}
            </button>
          )}
          <div className={k.headTitle}>Chữ Hán {ch}{hv ? <small>{hv}</small> : null}</div>
          <button type="button" className={k.iconBtn} onClick={() => setStack([])} aria-label="Đóng"><X size={18} /></button>
        </div>
        <div className={k.body} ref={bodyRef}>
          {dict ? <KanjiBody key={ch} ch={ch} dict={dict} onOpen={push} />
            : err ? <div className={k.loading}>Không tải được dữ liệu chữ Hán. Kiểm tra mạng rồi mở lại.</div>
              : <div className={k.loading}>Đang tải…</div>}
        </div>
      </div>
    </>
  );
}
