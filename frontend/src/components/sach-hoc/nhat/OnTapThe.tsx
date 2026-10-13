'use client';

/**
 * Mục tra cứu "Ôn tập bằng thẻ" của khoá Dekiru (khối `onthe`) — 8 cách ôn kiểu Quizlet
 * trên toàn bộ từ vựng, chữ Hán của lớp và mẫu ngữ pháp của Bài 1–15:
 *   1. Thẻ lật · 2. Học (mỗi thẻ đúng 2 lần: chọn rồi gõ) · 3. Trắc nghiệm 4 đáp án ·
 *   4. Gõ đáp án · 5. Nghe (chọn / chép) · 6. Ghép cặp bấm giờ · 7. Kiểm tra 20 câu ·
 *   8. Ôn từ sai (Leitner 5 hộp).
 * Dữ liệu: dekiru/bai/onTheData.ts — SINH TỰ ĐỘNG từ nội dung bài (scripts/dekiru-on-the.mts),
 * không soạn tay. Mọi chế độ dùng chung một kho trạng thái trên máy (thuộc / sai / hộp ôn / kỷ lục).
 *
 * Quyết định sư phạm: romaji ẩn tới khi lật/trả lời (thấy romaji là đọc được ngay, đo nhầm
 * thành "đã thuộc"); furigana bật mặc định vì người học mới đọc được kana, tắt để luyện chữ Hán.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Volume2 } from 'lucide-react';
import { Inline } from '../Blocks';
import { play } from '../audio';
import { useTutor } from '../tutorContext';
import { bare, reading, toRomaji } from './chia';
import { foldJp, foldVi, jpVariants, matchJp, matchVi, toHira, viAnswers } from './onThe';
import { CAU, HAN, NHOM, NP, TU } from '@/app/language/[code]/dekiru/bai/onTheData';
import s from '../course.module.css';
import c from './onthe.module.css';

/* ── Mô hình ───────────────────────────────────────────────────────────── */

type Loai = 'tu' | 'han' | 'np';
type Dir = 'jv' | 'vj';
type Card = {
  id: string; loai: Loai; n: number; nhom: string;
  /** Mặt Nhật (markup furigana / chữ Hán / công thức). */
  jp: string;
  /** Cách đọc kana (đọc 🔊, chấm câu gõ). Rỗng với ngữ pháp. */
  kana: string;
  ro: string;
  vi: string;
  meta: string;
  ex?: { en: string; ro: string; vi: string };
  ansJp: string[];
  ansVi: string[];
};
type Cau = { id: string; loai: 'np' | 'han'; n: number; q: string; opts: string[]; correct: number; why: string; title: string };

const LOAI_TEN: Record<Loai, string> = { tu: 'Từ vựng', han: 'Chữ Hán', np: 'Ngữ pháp' };

/* ── Dựng thẻ từ dữ liệu sinh ──────────────────────────────────────────── */

function cleanKana(w: string) {
  return reading(w.replace(/［[^］]*］/g, '').replace(/\s*\d+\s*$/, '')).replace(/[（）()]/g, '').replace(/～/g, '').trim();
}

function buildCards(): Card[] {
  const out: Card[] = [];
  for (const [n, g, w, pos, ipa, vi] of TU) {
    out.push({
      id: `t:${n}:${bare(w)}`, loai: 'tu', n, nhom: NHOM[n]?.[g] ?? '', jp: w, kana: cleanKana(w), ro: ipa, vi, meta: pos,
      ansJp: jpVariants(w, ipa), ansVi: viAnswers(vi),
    });
  }
  for (const [ch, n, hv, nghia, on, kun, slide] of HAN) {
    const kunList = kun.split('、').filter(Boolean);
    const onList = on.split('・').filter(Boolean);
    const docChinh = (kunList[0] ?? '').replace(/・/g, '') || toHira(onList[0] ?? '');
    out.push({
      id: `h:${ch}`, loai: 'han', n, nhom: slide ? 'Chữ Hán của lớp (đúng slide)' : 'Chữ Hán của lớp', jp: ch, kana: docChinh,
      ro: toRomaji(docChinh), vi: `${hv} — ${nghia}`, meta: `On: ${on || '—'} · Kun: ${kun || '—'}`,
      ansJp: [...new Set([ch, ...kunList.map((k) => k.replace(/・/g, '')), ...kunList.map((k) => k.split('・')[0]), ...onList.map(toHira)].map(foldJp).filter(Boolean))],
      ansVi: [foldVi(hv), ...viAnswers(nghia)],
    });
  }
  NP.forEach(([n, p, f, vi, en, ro, exVi], i) => {
    out.push({
      id: `g:${n}:${i}`, loai: 'np', n, nhom: p, jp: f, kana: '', ro: '', vi, meta: p,
      ex: en ? { en, ro, vi: exVi } : undefined, ansJp: [], ansVi: viAnswers(vi),
    });
  });
  return out;
}

const ALL_CARDS = buildCards();
const CARD_BY_ID = new Map(ALL_CARDS.map((x) => [x.id, x]));
const ALL_CAU: Cau[] = CAU.map(([n, id, loai, q, opts, correct, why, title]) => ({ id: `q:${id}`, loai, n, q, opts, correct, why, title }));
const CAU_BY_ID = new Map(ALL_CAU.map((x) => [x.id, x]));
const BAI = [...new Set(ALL_CARDS.map((x) => x.n))].sort((a, b) => a - b);

/** Chữ Hán trông giống (có cả chữ "giả" hay gặp trong đề trắc nghiệm của lớp) — làm đáp án nhiễu. */
const LOOK: Record<string, string> = {
  先: '冼牛生', 生: '主牛星', 休: '体伏佑', 見: '貝具兒', 買: '罝貢員', 物: '牣牛勿', 名: '各多夕', 前: '煎剪首', 国: '玉団匤',
  食: '飲倉飼', 飲: '飯欽食', 午: '牛干年', 後: '役徒待', 行: '待往何', 週: '遇周過', 毎: '海母梅', 来: '米未束', 人: '入八大',
  日: '目白旧', 本: '木体末', 大: '犬太天', 学: '字覚宇', 会: '合今全', 何: '可河伺', 天: '夫天太', 右: '石左若', 左: '右在佐',
  土: '士上工', 千: '干午十', 万: '方力刀', 円: '丹月同', 東: '車束柬', 西: '酉四面', 北: '比此化', 南: '幸商帝', 山: '出凶岳',
  川: '州小三', 小: '少水川', 上: '止土下', 下: '不卞上', 中: '申虫史', 雨: '両兩電', 間: '問聞開', 聞: '間問閉', 話: '語読詁',
  語: '話詰誤', 読: '続説話', 書: '昼晝害', 時: '持詩待', 今: '令会合', 年: '午牛平', 月: '用円肉', 火: '人炎灰', 水: '氷永木',
  木: '本未禾', 金: '全針釜', 女: '安好如', 男: '田勇町', 子: '字了予', 父: '交文爻', 母: '毎海舟', 友: '反左支', 私: '仏秒科',
  長: '張帳髪', 白: '百日自', 百: '白万首', 外: '多夕処', 半: '羊平伴', 分: '公兮今', 入: '人八込', 出: '山凸缶', 立: '位拉辛',
  休日: '体日', 電: '雷雲雪', 車: '東軍専', 駅: '馬験験', 店: '庄点占', 新: '親薪斤', 古: '吉占右', 高: '亭京商', 安: '女案宴',
};

/* ── Kho trạng thái dùng chung (trên máy) ──────────────────────────────── */

type Store = { thuoc: Record<string, 1>; srs: Record<string, [number, number]>; best: Record<string, number> };
const LUU_TIEN_DO = 'dekiru-onthe-v1';
const LUU_TUY_CHON = 'dekiru-onthe-opt-v1';
/** Hộp 1–5 → số ngày tới lần ôn sau. */
const HOP_NGAY = [0, 0, 1, 3, 7, 14];
const NGAY = 86_400_000;

function readJson<T>(k: string, d: T): T {
  try { const v = localStorage.getItem(k); return v ? { ...d, ...JSON.parse(v) } : d; } catch { return d; }
}
function writeJson(k: string, v: unknown) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* chế độ riêng tư */ } }

function useStore() {
  const [st, setSt] = useState<Store>(() => readJson<Store>(LUU_TIEN_DO, { thuoc: {}, srs: {}, best: {} }));
  const update = useCallback((f: (x: Store) => Store) => setSt((prev) => { const nx = f(prev); writeJson(LUU_TIEN_DO, nx); return nx; }), []);
  /** Sai ở bất kỳ chế độ nào ⇒ vào hộp 1, đến hạn ngay. */
  const sai = useCallback((id: string) => update((x) => {
    const thuoc = { ...x.thuoc }; delete thuoc[id];
    return { ...x, thuoc, srs: { ...x.srs, [id]: [1, Date.now()] } };
  }), [update]);
  const thuoc = useCallback((id: string) => update((x) => ({ ...x, thuoc: { ...x.thuoc, [id]: 1 } })), [update]);
  return { st, update, sai, thuoc };
}

/* ── Tiện ích ──────────────────────────────────────────────────────────── */

function shuffle<T>(a: T[]): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; }
  return b;
}
/** Chèn lại thẻ sai vào sau 3–5 thẻ. */
const chenLai = <T,>(q: T[], item: T) => { const nx = [...q]; nx.splice(Math.min(nx.length, 3 + Math.floor(Math.random() * 3)), 0, item); return nx; };

function noi(c0: Card) {
  const text = c0.loai === 'np' ? c0.ex?.en ?? '' : c0.kana || reading(c0.jp);
  if (text) void play({ text });
}

/** Bản gọn để in trên nút/ô ghép: bỏ ［thể từ điển］ và số nhóm động từ. */
const gon = (w: string) => w.replace(/［[^］]*］/g, '').replace(/\s*\d+\s*$/, '').trim();
/** Đáp án hiện trên nút: chiều jv ⇒ nghĩa; chiều vj ⇒ mặt Nhật. */
const optText = (x: Card, dir: Dir) => (dir === 'jv' ? x.vi : gon(x.jp));

/** 3 đáp án nhiễu: ưu tiên cùng nhóm → cùng bài → cùng loại; chữ Hán chiều vj thêm chữ trông giống. */
function distractors(card: Card, pool: Card[], dir: Dir, k = 3): { text: string; card?: Card }[] {
  const same = pool.filter((x) => x.loai === card.loai && x.id !== card.id);
  const tiers = [
    shuffle(same.filter((x) => x.n === card.n && x.nhom === card.nhom)),
    shuffle(same.filter((x) => x.n === card.n && x.nhom !== card.nhom)),
    shuffle(same.filter((x) => x.n !== card.n)),
    shuffle(ALL_CARDS.filter((x) => x.loai === card.loai && x.id !== card.id)),
  ];
  const seen = new Set([optText(card, dir)]);
  const out: { text: string; card?: Card }[] = [];
  if (card.loai === 'han' && dir === 'vj') {
    for (const ch of shuffle([...(LOOK[card.jp] ?? '')]).slice(0, 2)) if (!seen.has(ch)) { seen.add(ch); out.push({ text: ch }); }
  }
  for (const t of tiers) for (const x of t) {
    if (out.length >= k) return out;
    const tx = optText(x, dir);
    if (seen.has(tx)) continue;
    seen.add(tx); out.push({ text: tx, card: x });
  }
  return out;
}

/* ── Các mảnh giao diện dùng chung ─────────────────────────────────────── */

/**
 * Như `Inline` nhưng KHÔNG gắn `data-kj`: chữ trên mặt thẻ / đáp án / ô ghép bị thay ngay sau cú
 * chạm, nên trình mở thẻ chữ Hán (KanjiSheet, nghe click ở document) nhận một phần tử đã rời DOM
 * và mở nhầm thẻ chữ. Mặt sau (MatSau) vẫn dùng Inline — chạm chữ Hán ở đó để xem thẻ chữ.
 */
function Jp({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|~~[^~]+~~|==[^=]+==|\{[^|}]+\|[^}]+\})/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('**') ? <b key={i}><Jp text={p.slice(2, -2)} /></b>
          : p.startsWith('~~') ? <s key={i}><Jp text={p.slice(2, -2)} /></s>
            : p.startsWith('==') ? <mark key={i}><Jp text={p.slice(2, -2)} /></mark>
              : p.startsWith('{') && p.includes('|') ? <ruby key={i} className={s.ruby}>{p.slice(1, p.indexOf('|'))}<rt>{p.slice(p.indexOf('|') + 1, -1)}</rt></ruby>
                : p ? <span key={i}>{p}</span> : null,
      )}
    </>
  );
}

function Speak({ card }: { card: Card }) {
  if (card.loai === 'np' && !card.ex) return null;
  return (
    <button type="button" className={`${c.btn} ${c.btnSm}`} onClick={(e) => { e.stopPropagation(); noi(card); }} aria-label="Nghe">
      <Volume2 size={15} /> Nghe
    </button>
  );
}

function Mat({ card, dir }: { card: Card; dir: Dir }) {
  if (dir === 'vj') return <div className={c.frontVi}><Jp text={card.vi} /></div>;
  if (card.loai === 'np') return <div className={`${c.frontNp} ${c.jp}`}><Jp text={card.jp} /></div>;
  return <div className={`${c.front} ${c.jp}`}><Jp text={card.jp} /></div>;
}

/** Mặt sau đầy đủ: cả hai mặt + romaji + loại từ / On-Kun + ví dụ. */
function MatSau({ card, dir }: { card: Card; dir: Dir }) {
  return (
    <div className={c.back}>
      {dir === 'jv'
        ? <div className={c.backMain}><Inline text={card.vi} /></div>
        : <div className={`${card.loai === 'np' ? c.frontNp : c.backJp} ${c.jp}`}><Inline text={card.jp} /></div>}
      {card.ro && <div className={c.ro}>{card.ro}</div>}
      {card.meta && card.loai !== 'np' && <div className={c.meta}>{card.meta}</div>}
      {card.ex && (
        <div className={`${c.ex} ${c.jp}`}>
          <Inline text={card.ex.en} />
          {card.ex.ro && <span className={c.ro}>{card.ex.ro}</span>}
          <span className={c.exVi}>{card.ex.vi}</span>
        </div>
      )}
    </div>
  );
}

function Progress({ done, total, text }: { done: number; total: number; text: string }) {
  return (
    <div className={c.progress}>
      <span className={c.count}>{text}</span>
      <div className={c.bar}><i style={{ width: `${total ? Math.min(100, (done / total) * 100) : 0}%` }} /></div>
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) { return <div className={c.empty}>{children}</div>; }

/* ── Một câu trắc nghiệm (thẻ hoặc câu sẵn có) ─────────────────────────── */

type McqItem = { key: string; prompt: React.ReactNode; opts: { node: React.ReactNode; ok: boolean }[]; why?: React.ReactNode; tag: string; after?: React.ReactNode };

function mcqFromCard(card: Card, pool: Card[], dir: Dir): McqItem {
  const ds = distractors(card, pool, dir);
  const render = (t: string) => (dir === 'jv' ? <Jp text={t} /> : <span className={c.jp}><Jp text={t} /></span>);
  return {
    key: card.id + dir,
    tag: `${LOAI_TEN[card.loai]} · Bài ${card.n}${card.nhom && card.loai === 'tu' ? ` · ${card.nhom}` : ''}`,
    prompt: <Mat card={card} dir={dir} />,
    opts: shuffle([{ node: render(optText(card, dir)), ok: true }, ...ds.map((d) => ({ node: render(d.text), ok: false }))]),
    after: <MatSau card={card} dir={dir} />,
  };
}
function mcqFromCau(q: Cau): McqItem {
  return {
    key: q.id,
    tag: `${q.loai === 'han' ? 'Chữ Hán' : 'Ngữ pháp'} · Bài ${q.n} · ${q.title}`,
    prompt: <div className={`${c.qText} ${c.jp}`}><Jp text={q.q} /></div>,
    opts: shuffle(q.opts.map((o, i) => ({ node: <span className={c.jp}><Jp text={o} /></span>, ok: i === q.correct }))),
    why: q.why ? <Inline text={q.why} /> : undefined,
  };
}

function McqView({ item, onDone, auto = true }: { item: McqItem; onDone: (ok: boolean) => void; auto?: boolean }) {
  const [pick, setPick] = useState<number | null>(null);
  const next = useRef<HTMLButtonElement>(null);
  useEffect(() => { setPick(null); }, [item.key]);
  useEffect(() => { if (pick !== null) next.current?.focus(); }, [pick]);
  const ok = pick !== null && item.opts[pick].ok;
  useEffect(() => {
    if (pick === null || !ok || !auto) return;
    const t = setTimeout(() => onDone(true), 900);
    return () => clearTimeout(t);
  }, [pick, ok, auto, onDone]);
  return (
    <div className={c.q}>
      <div className={c.qTag}>{item.tag}</div>
      {item.prompt}
      <div className={c.opts}>
        {item.opts.map((o, i) => (
          <button key={i} type="button" disabled={pick !== null}
            className={`${c.opt} ${pick !== null && o.ok ? c.optOk : ''} ${pick === i && !o.ok ? c.optNo : ''}`}
            onClick={() => setPick(i)}>{o.node}</button>
        ))}
      </div>
      {pick !== null && (
        <>
          {item.why && <div className={c.why}>💡 {item.why}</div>}
          {!ok && item.after}
          <div className={c.row}><button ref={next} type="button" className={`${c.btn} ${c.btnPri}`} onClick={() => onDone(ok)}>Tiếp →</button></div>
        </>
      )}
    </div>
  );
}

/* ── Câu gõ ────────────────────────────────────────────────────────────── */

function GoView({ card, dir, onDone, listen = false }: { card: Card; dir: Dir; onDone: (ok: boolean) => void; listen?: boolean }) {
  const [v, setV] = useState('');
  const [res, setRes] = useState<null | boolean>(null);
  const inp = useRef<HTMLInputElement>(null);
  const next = useRef<HTMLButtonElement>(null);
  useEffect(() => { setV(''); setRes(null); inp.current?.focus(); if (listen) noi(card); }, [card, listen]);
  useEffect(() => { if (res !== null) next.current?.focus(); }, [res]);
  const wantJp = listen || dir === 'vj';
  const check = () => { if (!v.trim()) return; setRes(wantJp ? matchJp(v, card.ansJp) : matchVi(v, card.ansVi)); };
  return (
    <div className={c.q}>
      <div className={c.qTag}>{LOAI_TEN[card.loai]} · Bài {card.n} · {listen ? 'nghe rồi gõ lại bằng kana hoặc romaji' : wantJp ? 'gõ tiếng Nhật (kana, romaji hoặc chữ Hán)' : 'gõ nghĩa tiếng Việt (không dấu cũng được)'}</div>
      {listen
        ? <div className={c.row}><button type="button" className={`${c.btn} ${c.btnPri}`} onClick={() => noi(card)}><Volume2 size={18} /> Nghe lại</button></div>
        : <Mat card={card} dir={dir} />}
      <form className={c.row} onSubmit={(e) => { e.preventDefault(); if (res === null) check(); else onDone(res); }}>
        <input ref={inp} id="onthe-go" className={c.input} value={v} disabled={res !== null} onChange={(e) => setV(e.target.value)}
          placeholder={wantJp ? 'vd: kita hoặc きた' : 'vd: phía bắc'} autoComplete="off" autoCapitalize="off" spellCheck={false} lang={wantJp ? 'ja' : 'vi'} />
        {res === null && <button type="submit" className={`${c.btn} ${c.btnPri} ${c.btnSm}`}>Kiểm tra</button>}
      </form>
      {res !== null && (
        <>
          <div className={res ? c.fbOk : c.fbNo}>{res ? '✓ Đúng!' : '✗ Chưa đúng — đáp án:'}</div>
          <MatSau card={card} dir={wantJp ? 'vj' : 'jv'} />
          <div className={c.row}>
            {!res && <button type="button" className={`${c.btn} ${c.btnSm}`} onClick={() => onDone(true)}>Tôi đúng (gõ khác cách)</button>}
            <button ref={next} type="button" className={`${c.btn} ${c.btnPri}`} onClick={() => onDone(res)}>Tiếp →</button>
          </div>
        </>
      )}
    </div>
  );
}

/* ── 1. Thẻ lật ────────────────────────────────────────────────────────── */

function TheLat({ pool, dir, store }: { pool: Card[]; dir: Dir; store: ReturnType<typeof useStore> }) {
  const [boQuaThuoc, setBoQua] = useState(true);
  const deck = useMemo(() => (boQuaThuoc ? pool.filter((x) => !store.st.thuoc[x.id]) : pool), [pool, boQuaThuoc]); // eslint-disable-line react-hooks/exhaustive-deps
  const [q, setQ] = useState<Card[]>([]);
  const [flip, setFlip] = useState(false);
  const [nho, setNho] = useState(0);
  const start = useCallback(() => { setQ(shuffle(deck)); setFlip(false); setNho(0); }, [deck]);
  useEffect(start, [start]);
  const cur = q[0];
  const daThuoc = pool.filter((x) => store.st.thuoc[x.id]).length;
  return (
    <>
      <div className={c.row}>
        <button type="button" className={`${c.chip}`} aria-pressed={boQuaThuoc} onClick={() => setBoQua(!boQuaThuoc)}>Bỏ qua thẻ đã thuộc ({daThuoc})</button>
        <button type="button" className={`${c.btn} ${c.btnSm}`} onClick={start}>↻ Trộn lại</button>
        {daThuoc > 0 && <button type="button" className={`${c.btn} ${c.btnSm}`} onClick={() => store.update((x) => { const t = { ...x.thuoc }; pool.forEach((p) => delete t[p.id]); return { ...x, thuoc: t }; })}>Học lại cả thẻ đã thuộc</button>}
      </div>
      <Progress done={nho} total={deck.length} text={`Nhớ ${nho}/${deck.length} · còn ${q.length} thẻ`} />
      {!cur ? (
        <Empty>{deck.length ? <>🎉 Xong lượt này — bạn đã nhớ hết {deck.length} thẻ.</> : <>Mọi thẻ trong lựa chọn này đã thuộc. Bỏ chọn "Bỏ qua thẻ đã thuộc" để lật lại.</>}<div className={c.row} style={{ marginTop: 12 }}><button type="button" className={`${c.btn} ${c.btnPri}`} onClick={start}>Lật lại từ đầu</button></div></Empty>
      ) : (
        <>
          <button type="button" className={c.card} onClick={(e) => { e.stopPropagation(); if (!flip) { setFlip(true); noi(cur); } }} aria-label={flip ? 'Mặt sau của thẻ' : 'Chạm để lật thẻ'}>
            <span className={c.qTag}>{LOAI_TEN[cur.loai]} · Bài {cur.n}{cur.nhom && cur.loai !== 'np' ? ` · ${cur.nhom}` : ''}</span>
            {!flip ? <><Mat card={cur} dir={dir} /><span className={c.hint}>Nhớ trong đầu (nói to càng tốt) rồi chạm để lật</span></> : <MatSau card={cur} dir={dir} />}
          </button>
          {flip ? (
            <div className={c.row}>
              <button type="button" className={`${c.btn} ${c.btnNo}`} onClick={() => { store.sai(cur.id); setQ(chenLai(q.slice(1), cur)); setFlip(false); }}>✗ Chưa nhớ</button>
              <Speak card={cur} />
              <button type="button" className={`${c.btn} ${c.btnOk}`} onClick={() => { store.thuoc(cur.id); setNho(nho + 1); setQ(q.slice(1)); setFlip(false); }}>✓ Nhớ rồi</button>
            </div>
          ) : <div className={c.row}><Speak card={cur} /></div>}
        </>
      )}
    </>
  );
}

/* ── 2. Học (Learn) ────────────────────────────────────────────────────── */

const LUOT_HOC = 20;
function Hoc({ pool, dir, store }: { pool: Card[]; dir: Dir; store: ReturnType<typeof useStore> }) {
  const [batch, setBatch] = useState(0);
  const cards = useMemo(() => {
    const chuaThuoc = pool.filter((x) => !store.st.thuoc[x.id]);
    return shuffle(chuaThuoc.length ? chuaThuoc : pool).slice(0, LUOT_HOC);
  }, [pool, batch]); // eslint-disable-line react-hooks/exhaustive-deps
  const [q, setQ] = useState<{ card: Card; stage: number }[]>([]);
  const [score, setScore] = useState<Record<string, number>>({});
  const [turn, setTurn] = useState(0);
  useEffect(() => { setQ(cards.map((card) => ({ card, stage: 0 }))); setScore({}); }, [cards]);
  const cur = q[0];
  const total = cards.length * 2;
  const done = Object.values(score).reduce((a, b) => a + b, 0);
  const onDone = (ok: boolean) => {
    if (!cur) return;
    setTurn(turn + 1);
    if (ok) {
      const st = cur.stage + 1;
      setScore({ ...score, [cur.card.id]: st });
      if (st >= 2) { store.thuoc(cur.card.id); setQ(q.slice(1)); } else setQ(chenLai(q.slice(1), { card: cur.card, stage: st }));
    } else { store.sai(cur.card.id); setQ(chenLai(q.slice(1), cur)); }
  };
  if (!cards.length) return <Empty>Chưa có thẻ nào trong lựa chọn này.</Empty>;
  const goDuoc = cur && cur.card.loai !== 'np';
  return (
    <>
      <Progress done={done} total={total} text={`Lượt ${batch + 1} · ${cards.length} thẻ · mỗi thẻ phải đúng 2 lần (chọn, rồi gõ) · ${Math.round((done / total) * 100)}%`} />
      {!cur ? (
        <Empty>🎉 Thuộc cả {cards.length} thẻ của lượt này.<div className={c.row} style={{ marginTop: 12 }}><button type="button" className={`${c.btn} ${c.btnPri}`} onClick={() => setBatch(batch + 1)}>Học {LUOT_HOC} thẻ tiếp</button></div></Empty>
      ) : cur.stage === 1 && goDuoc ? (
        <GoView key={turn} card={cur.card} dir={dir} onDone={onDone} />
      ) : (
        <McqView key={turn} item={mcqFromCard(cur.card, pool, cur.stage === 1 ? (dir === 'jv' ? 'vj' : 'jv') : dir)} onDone={onDone} />
      )}
    </>
  );
}

/* ── 3. Trắc nghiệm ────────────────────────────────────────────────────── */

function TracNghiem({ pool, caus, dir, store }: { pool: Card[]; caus: Cau[]; dir: Dir; store: ReturnType<typeof useStore> }) {
  const [round, setRound] = useState(0);
  type It = { kind: 'card'; card: Card } | { kind: 'cau'; cau: Cau };
  const items = useMemo<It[]>(() => shuffle<It>([...pool.map((card) => ({ kind: 'card' as const, card })), ...caus.map((cau) => ({ kind: 'cau' as const, cau }))]), [pool, caus, round]);
  const [i, setI] = useState(0);
  const [ok, setOk] = useState(0);
  useEffect(() => { setI(0); setOk(0); }, [items]);
  const cur = items[i];
  const mcq = useMemo(() => (cur ? (cur.kind === 'card' ? mcqFromCard(cur.card, pool, dir) : mcqFromCau(cur.cau)) : null), [cur, pool, dir]);
  const onDone = useCallback((good: boolean) => {
    if (!cur) return;
    if (good) setOk((x) => x + 1); else store.sai(cur.kind === 'card' ? cur.card.id : cur.cau.id);
    setI((x) => x + 1);
  }, [cur, store]);
  if (!items.length) return <Empty>Chưa có thẻ nào trong lựa chọn này.</Empty>;
  return (
    <>
      <Progress done={i} total={items.length} text={`Câu ${Math.min(i + 1, items.length)}/${items.length} · đúng ${ok} · câu sai tự vào hộp "Ôn từ sai"`} />
      {mcq ? <McqView key={i} item={mcq} onDone={onDone} /> : (
        <Empty><div className={c.score}>{ok}/{items.length}</div>Xong cả bộ.<div className={c.row} style={{ marginTop: 12 }}><button type="button" className={`${c.btn} ${c.btnPri}`} onClick={() => setRound(round + 1)}>Làm lại (trộn mới)</button></div></Empty>
      )}
    </>
  );
}

/* ── 4. Gõ đáp án ──────────────────────────────────────────────────────── */

function GoDapAn({ pool, dir, store }: { pool: Card[]; dir: Dir; store: ReturnType<typeof useStore> }) {
  const deck = useMemo(() => pool.filter((x) => x.loai !== 'np'), [pool]);
  const [q, setQ] = useState<Card[]>([]);
  const [ok, setOk] = useState(0);
  const [turn, setTurn] = useState(0);
  const start = useCallback(() => { setQ(shuffle(deck)); setOk(0); }, [deck]);
  useEffect(start, [start]);
  const cur = q[0];
  if (!deck.length) return <Empty>Chế độ gõ dùng cho <b>Từ vựng</b> và <b>Chữ Hán</b> — hãy chọn thêm một trong hai loại đó.</Empty>;
  return (
    <>
      <Progress done={ok} total={deck.length} text={`Đúng ${ok}/${deck.length} · còn ${q.length} · câu sai quay lại sau vài câu`} />
      {cur ? (
        <GoView key={turn} card={cur} dir={dir} onDone={(good) => {
          setTurn(turn + 1);
          if (good) { setOk(ok + 1); setQ(q.slice(1)); } else { store.sai(cur.id); setQ(chenLai(q.slice(1), cur)); }
        }} />
      ) : <Empty>🎉 Gõ đúng cả {deck.length} thẻ.<div className={c.row} style={{ marginTop: 12 }}><button type="button" className={`${c.btn} ${c.btnPri}`} onClick={start}>Làm lại</button></div></Empty>}
    </>
  );
}

/* ── 5. Nghe ───────────────────────────────────────────────────────────── */

function Nghe({ pool, store }: { pool: Card[]; store: ReturnType<typeof useStore> }) {
  const deck = useMemo(() => pool.filter((x) => x.loai === 'tu' && x.kana), [pool]);
  const [kieu, setKieu] = useState<'chon' | 'chep'>('chon');
  const [round, setRound] = useState(0);
  const order = useMemo(() => shuffle(deck), [deck, round]);
  const [i, setI] = useState(0);
  const [ok, setOk] = useState(0);
  useEffect(() => { setI(0); setOk(0); }, [order, kieu]);
  const cur = order[i];
  const mcq = useMemo<McqItem | null>(() => {
    if (!cur || kieu !== 'chon') return null;
    const ds = distractors(cur, deck, 'vj');
    return {
      key: cur.id + 'nghe', tag: `Nghe · Bài ${cur.n} — chọn từ bạn vừa nghe`,
      prompt: <div className={c.row}><button type="button" className={`${c.btn} ${c.btnPri}`} onClick={() => noi(cur)}><Volume2 size={18} /> Nghe lại</button></div>,
      opts: shuffle([{ node: <span className={c.jp}><Jp text={gon(cur.jp)} /></span>, ok: true }, ...ds.map((d) => ({ node: <span className={c.jp}><Jp text={d.text} /></span>, ok: false }))]),
      after: <MatSau card={cur} dir="jv" />,
    };
  }, [cur, kieu, deck]);
  useEffect(() => { if (cur && kieu === 'chon') noi(cur); }, [cur, kieu]);
  const onDone = useCallback((good: boolean) => { if (!cur) return; if (good) setOk((x) => x + 1); else store.sai(cur.id); setI((x) => x + 1); }, [cur, store]);
  if (!deck.length) return <Empty>Chế độ nghe dùng thẻ <b>Từ vựng</b> — hãy chọn loại Từ vựng.</Empty>;
  return (
    <>
      <div className={c.row}>
        <button type="button" className={c.chip} aria-pressed={kieu === 'chon'} onClick={() => setKieu('chon')}>Nghe chọn</button>
        <button type="button" className={c.chip} aria-pressed={kieu === 'chep'} onClick={() => setKieu('chep')}>Nghe chép (gõ lại)</button>
      </div>
      <Progress done={i} total={order.length} text={`Câu ${Math.min(i + 1, order.length)}/${order.length} · đúng ${ok}`} />
      {!cur ? <Empty><div className={c.score}>{ok}/{order.length}</div><div className={c.row} style={{ marginTop: 12 }}><button type="button" className={`${c.btn} ${c.btnPri}`} onClick={() => setRound(round + 1)}>Làm lại</button></div></Empty>
        : kieu === 'chon' && mcq ? <McqView key={i} item={mcq} onDone={onDone} />
          : <GoView key={i} card={cur} dir="vj" listen onDone={onDone} />}
    </>
  );
}

/* ── 6. Ghép cặp ───────────────────────────────────────────────────────── */

const SO_CAP = 6;
function GhepCap({ pool, store, bestKey }: { pool: Card[]; store: ReturnType<typeof useStore>; bestKey: string }) {
  const [round, setRound] = useState(0);
  const cards = useMemo(() => {
    const seen = new Set<string>();
    const ngan = pool.filter((x) => x.loai !== 'np');
    return shuffle(ngan.length >= 3 ? ngan : pool).filter((x) => { const k = x.vi; if (seen.has(k) || seen.has(x.jp)) return false; seen.add(k); seen.add(x.jp); return true; }).slice(0, SO_CAP);
  }, [pool, round]);
  const tiles = useMemo(() => shuffle(cards.flatMap((x) => [{ id: x.id, side: 'jp' as const, card: x }, { id: x.id, side: 'vi' as const, card: x }])), [cards]);
  const [gone, setGone] = useState<Set<string>>(new Set());
  const [sel, setSel] = useState<number | null>(null);
  const [bad, setBad] = useState<number[]>([]);
  const [t0, setT0] = useState(0);
  const [now, setNow] = useState(0);
  const [phat, setPhat] = useState(0);
  useEffect(() => { setGone(new Set()); setSel(null); setBad([]); setPhat(0); setT0(Date.now()); setNow(Date.now()); }, [tiles]);
  const xong = cards.length > 0 && gone.size === cards.length;
  useEffect(() => {
    if (xong) return;
    const t = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(t);
  }, [xong]);
  const ms = now - t0 + phat;
  const best = store.st.best[bestKey];
  useEffect(() => {
    if (!xong) return;
    if (!best || ms < best) store.update((x) => ({ ...x, best: { ...x.best, [bestKey]: ms } }));
  }, [xong]); // eslint-disable-line react-hooks/exhaustive-deps
  if (cards.length < 3) return <Empty>Cần ít nhất 3 thẻ để ghép cặp — hãy chọn thêm bài.</Empty>;
  const click = (i: number) => {
    const t = tiles[i];
    if (gone.has(t.id)) return;
    if (sel === null) { setSel(i); return; }
    if (sel === i) { setSel(null); return; }
    const a = tiles[sel];
    if (a.id === t.id && a.side !== t.side) { setGone(new Set(gone).add(t.id)); setSel(null); if (t.card.loai !== 'np') noi(t.card); }
    else {
      setBad([sel, i]); setPhat(phat + 1000); setSel(null);
      store.sai(a.side === 'jp' ? a.id : t.id);
      setTimeout(() => setBad([]), 450);
    }
  };
  return (
    <>
      <div className={c.row}>
        <span className={c.timer}>{(ms / 1000).toFixed(1)}s</span>
        <span className={c.count}>{best ? `Kỷ lục: ${(best / 1000).toFixed(1)}s` : 'Chưa có kỷ lục'} · ghép sai +1s</span>
        <button type="button" className={`${c.btn} ${c.btnSm}`} onClick={() => setRound(round + 1)}>↻ Bộ mới</button>
      </div>
      {xong ? (
        <Empty><div className={c.score}>{(ms / 1000).toFixed(1)}s</div>{!best || ms <= best ? '🏆 Kỷ lục mới!' : `Kỷ lục vẫn là ${(best / 1000).toFixed(1)}s`}<div className={c.row} style={{ marginTop: 12 }}><button type="button" className={`${c.btn} ${c.btnPri}`} onClick={() => setRound(round + 1)}>Chơi bộ mới</button></div></Empty>
      ) : (
        <div className={c.match}>
          {tiles.map((t, i) => (
            <button key={t.id + t.side} type="button" onClick={() => click(i)}
              className={`${c.tile} ${t.side === 'jp' ? `${c.tileJp} ${c.jp}` : ''} ${sel === i ? c.tileSel : ''} ${bad.includes(i) ? c.tileBad : ''} ${gone.has(t.id) ? c.tileGone : ''}`}>
              {t.side === 'jp' ? <Jp text={gon(t.card.jp)} /> : <Jp text={t.card.vi} />}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

/* ── 7. Kiểm tra ───────────────────────────────────────────────────────── */

type KtCau =
  | { kind: 'mcq'; id: string; item: McqItem; dung: string }
  | { kind: 'go'; id: string; card: Card; dir: Dir }
  | { kind: 'ds'; id: string; card: Card; shown: string; that: boolean };

function KiemTra({ pool, caus, dir, store }: { pool: Card[]; caus: Cau[]; dir: Dir; store: ReturnType<typeof useStore> }) {
  const tutor = useTutor();
  const [round, setRound] = useState(0);
  const de = useMemo<KtCau[]>(() => {
    const goPool = shuffle(pool.filter((x) => x.loai !== 'np'));
    const nGo = Math.min(6, goPool.length);
    const nDs = Math.min(6, pool.length);
    const out: KtCau[] = [];
    goPool.slice(0, nGo).forEach((card) => out.push({ kind: 'go', id: card.id, card, dir: Math.random() < 0.5 ? 'jv' : 'vj' }));
    shuffle(pool).slice(0, nDs).forEach((card) => {
      const that = Math.random() < 0.5;
      const sai = distractors(card, pool, 'jv', 1)[0]?.text;
      out.push({ kind: 'ds', id: card.id, card, that: that || !sai, shown: that || !sai ? card.vi : sai });
    });
    const used = new Set(out.map((x) => x.id));
    const mcqPool = shuffle<{ k: 'c'; v: Card } | { k: 'q'; v: Cau }>([
      ...pool.filter((x) => !used.has(x.id)).map((v) => ({ k: 'c' as const, v })),
      ...caus.map((v) => ({ k: 'q' as const, v })),
    ]);
    for (const m of mcqPool) {
      if (out.length >= 20) break;
      if (m.k === 'c') out.push({ kind: 'mcq', id: m.v.id, item: mcqFromCard(m.v, pool, dir), dung: optText(m.v, dir) });
      else out.push({ kind: 'mcq', id: m.v.id, item: mcqFromCau(m.v), dung: m.v.opts[m.v.correct] });
    }
    return shuffle(out);
  }, [pool, caus, dir, round]);
  const [i, setI] = useState(0);
  const [kq, setKq] = useState<{ cau: KtCau; ok: boolean; tl: string }[]>([]);
  const [v, setV] = useState('');
  useEffect(() => { setI(0); setKq([]); setV(''); }, [de]);
  const cur = de[i];
  const ghi = (ok: boolean, tl: string) => { setKq([...kq, { cau: cur, ok, tl }]); setI(i + 1); setV(''); };
  const xong = de.length > 0 && i >= de.length;
  useEffect(() => {
    if (!xong) return;
    kq.filter((x) => !x.ok).forEach((x) => store.sai(x.cau.id));
    tutor.report('dekiru-on-tap-the-kiem-tra', Math.round((kq.filter((x) => x.ok).length / kq.length) * 100));
  }, [xong]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!de.length) return <Empty>Chưa có thẻ nào trong lựa chọn này.</Empty>;
  if (xong) {
    const dung = kq.filter((x) => x.ok).length;
    return (
      <div className={c.done}>
        <div className={c.score}>{dung}/{kq.length}</div>
        <div>{dung / kq.length >= 0.85 ? '🎉 Rất chắc rồi!' : dung / kq.length >= 0.6 ? 'Khá ổn — ôn lại các câu sai bên dưới.' : 'Cần ôn thêm — vào "Ôn từ sai" để luyện lại các câu này.'}</div>
        <div className={c.wrongList}>
          {kq.filter((x) => !x.ok).map((x, k) => (
            <div key={k} className={c.wrongItem}>
              {x.cau.kind === 'mcq' ? <><div className={c.qTag}>{x.cau.item.tag}</div>{x.cau.item.prompt}<div>Đáp án: <b className={c.jp}><Inline text={x.cau.dung} /></b></div></>
                : x.cau.kind === 'go' ? <><span className={c.jp}><Inline text={x.cau.card.jp} /></span> = <b><Inline text={x.cau.card.vi} /></b> <span className={c.ro}>({x.cau.card.ro})</span><div className={c.meta}>Bạn gõ: {x.tl || '(trống)'}</div></>
                  : <><span className={c.jp}><Inline text={x.cau.card.jp} /></span> = <b><Inline text={x.cau.card.vi} /></b><div className={c.meta}>Câu đúng/sai: &quot;<Inline text={x.cau.shown} />&quot; là {x.cau.that ? 'ĐÚNG' : 'SAI'}</div></>}
            </div>
          ))}
        </div>
        <div className={c.row} style={{ width: '100%' }}><button type="button" className={`${c.btn} ${c.btnPri}`} onClick={() => setRound(round + 1)}>Làm đề mới</button></div>
      </div>
    );
  }
  return (
    <>
      <Progress done={i} total={de.length} text={`Câu ${i + 1}/${de.length} · chấm điểm khi nộp cuối bài`} />
      {cur.kind === 'mcq' ? (
        <div className={c.q}>
          <div className={c.qTag}>{cur.item.tag}</div>
          {cur.item.prompt}
          <div className={c.opts}>{cur.item.opts.map((o, k) => <button key={k} type="button" className={c.opt} onClick={() => ghi(o.ok, '')}>{o.node}</button>)}</div>
        </div>
      ) : cur.kind === 'ds' ? (
        <div className={c.q}>
          <div className={c.qTag}>Đúng hay sai? · Bài {cur.card.n}</div>
          <div className={`${c.qText} ${c.jp}`} style={{ textAlign: 'center' }}><Jp text={cur.card.jp} /></div>
          <div className={c.frontVi} style={{ textAlign: 'center' }}>= <Jp text={cur.shown} /></div>
          <div className={c.row}>
            <button type="button" className={`${c.btn} ${c.btnOk}`} onClick={() => ghi(cur.that, 'Đúng')}>Đúng</button>
            <button type="button" className={`${c.btn} ${c.btnNo}`} onClick={() => ghi(!cur.that, 'Sai')}>Sai</button>
          </div>
        </div>
      ) : (
        <div className={c.q}>
          <div className={c.qTag}>{cur.dir === 'vj' ? 'Gõ tiếng Nhật (kana / romaji / chữ Hán)' : 'Gõ nghĩa tiếng Việt'} · Bài {cur.card.n}</div>
          <Mat card={cur.card} dir={cur.dir} />
          <form className={c.row} onSubmit={(e) => { e.preventDefault(); ghi(cur.dir === 'vj' ? matchJp(v, cur.card.ansJp) : matchVi(v, cur.card.ansVi), v); }}>
            <input id="onthe-kt" className={c.input} value={v} onChange={(e) => setV(e.target.value)} autoFocus autoComplete="off" autoCapitalize="off" spellCheck={false} />
            <button type="submit" className={`${c.btn} ${c.btnPri} ${c.btnSm}`}>Trả lời</button>
          </form>
        </div>
      )}
    </>
  );
}

/* ── 8. Ôn từ sai (Leitner) ────────────────────────────────────────────── */

function OnTuSai({ dir, store, bai }: { dir: Dir; store: ReturnType<typeof useStore>; bai: number[] }) {
  const [chiBaiChon, setChiBaiChon] = useState(false);
  const [tick, setTick] = useState(0);
  const now = useMemo(() => Date.now(), [tick]); // eslint-disable-line react-hooks/exhaustive-deps
  const entries = Object.entries(store.st.srs).filter(([id]) => {
    const n = CARD_BY_ID.get(id)?.n ?? CAU_BY_ID.get(id)?.n;
    return n !== undefined && (!chiBaiChon || bai.includes(n));
  });
  const hop = [1, 2, 3, 4, 5].map((b) => entries.filter(([, v]) => v[0] === b).length);
  const [q, setQ] = useState<string[]>([]);
  const [flip, setFlip] = useState(false);
  const [turn, setTurn] = useState(0);
  const start = () => { setQ(shuffle(entries.filter(([, v]) => v[1] <= Date.now()).map(([id]) => id))); setFlip(false); setTick(tick + 1); };
  const denHan = entries.filter(([, v]) => v[1] <= now).length;
  const cham = (id: string, ok: boolean) => {
    store.update((x) => {
      const [b] = x.srs[id] ?? [1, 0];
      const srs = { ...x.srs };
      if (!ok) srs[id] = [1, Date.now()];
      else if (b >= 5) { delete srs[id]; return { ...x, srs, thuoc: { ...x.thuoc, [id]: 1 } }; }
      else srs[id] = [b + 1, Date.now() + HOP_NGAY[b + 1] * NGAY];
      return { ...x, srs };
    });
    setQ(ok ? q.slice(1) : chenLai(q.slice(1), id));
    setFlip(false);
    setTurn(turn + 1);
  };
  const id = q[0];
  const card = id ? CARD_BY_ID.get(id) : undefined;
  const cau = id ? CAU_BY_ID.get(id) : undefined;
  return (
    <>
      <div className={c.boxes}>{hop.map((x, k) => <div key={k} className={c.box}><b>{x}</b>Hộp {k + 1}<br />{k === 0 ? 'ôn ngay' : `+${HOP_NGAY[k + 1]} ngày`}</div>)}</div>
      <div className={c.row}>
        <button type="button" className={c.chip} aria-pressed={chiBaiChon} onClick={() => setChiBaiChon(!chiBaiChon)}>Chỉ bài đang chọn</button>
        <span className={c.count}>Đến hạn hôm nay: <b>{denHan}</b> · tổng trong hộp: {entries.length}</span>
      </div>
      {!id ? (
        <Empty>
          {entries.length === 0 ? <>Chưa có thẻ nào bị sai. Thẻ bạn sai ở bất kỳ cách ôn nào sẽ tự vào đây (hộp 1). Đúng thì lên hộp, sai thì về hộp 1; qua hộp 5 là thuộc hẳn.</>
            : denHan ? <>Có <b>{denHan}</b> thẻ đến hạn.</> : <>Hôm nay hết thẻ đến hạn — quay lại vào ngày mai nhé.</>}
          {denHan > 0 && <div className={c.row} style={{ marginTop: 12 }}><button type="button" className={`${c.btn} ${c.btnPri}`} onClick={start}>Ôn {denHan} thẻ đến hạn</button></div>}
        </Empty>
      ) : card ? (
        <>
          <button type="button" className={c.card} onClick={(e) => { e.stopPropagation(); if (!flip) { setFlip(true); noi(card); } }}>
            <span className={c.qTag}>Hộp {store.st.srs[id]?.[0] ?? 1} · {LOAI_TEN[card.loai]} · Bài {card.n} · còn {q.length}</span>
            {!flip ? <><Mat card={card} dir={dir} /><span className={c.hint}>Nhớ ra rồi chạm để lật</span></> : <MatSau card={card} dir={dir} />}
          </button>
          {flip && <div className={c.row}>
            <button type="button" className={`${c.btn} ${c.btnNo}`} onClick={() => cham(id, false)}>✗ Chưa nhớ</button>
            <button type="button" className={`${c.btn} ${c.btnOk}`} onClick={() => cham(id, true)}>✓ Nhớ</button>
          </div>}
        </>
      ) : cau ? (
        <McqView key={turn} item={mcqFromCau(cau)} auto={false} onDone={(ok) => cham(id, ok)} />
      ) : null}
    </>
  );
}

/* ── Trang chính ───────────────────────────────────────────────────────── */

const MODES = [
  { id: 'lat', icon: '🃏', ten: 'Thẻ lật', mo: 'lật & tự chấm' },
  { id: 'hoc', icon: '🎯', ten: 'Học', mo: 'chọn rồi gõ' },
  { id: 'tn', icon: '🔘', ten: 'Trắc nghiệm', mo: '4 đáp án' },
  { id: 'go', icon: '⌨️', ten: 'Gõ', mo: 'tự viết ra' },
  { id: 'nghe', icon: '🎧', ten: 'Nghe', mo: 'chọn / chép' },
  { id: 'ghep', icon: '🧩', ten: 'Ghép cặp', mo: 'bấm giờ' },
  { id: 'kt', icon: '📝', ten: 'Kiểm tra', mo: '20 câu' },
  { id: 'sai', icon: '🔁', ten: 'Ôn từ sai', mo: '5 hộp' },
] as const;
type ModeId = (typeof MODES)[number]['id'];
type Opt = { bai: number[]; loai: Loai[]; dir: Dir; furi: boolean; mode: ModeId };

export default function OnTapThe() {
  const store = useStore();
  const [opt, setOptRaw] = useState<Opt>(() => readJson<Opt>(LUU_TUY_CHON, { bai: [4, 5], loai: ['tu', 'han', 'np'], dir: 'jv', furi: true, mode: 'lat' }));
  const setOpt = (p: Partial<Opt>) => setOptRaw((o) => { const nx = { ...o, ...p }; writeJson(LUU_TUY_CHON, nx); return nx; });
  const pool = useMemo(() => ALL_CARDS.filter((x) => opt.bai.includes(x.n) && opt.loai.includes(x.loai)), [opt.bai, opt.loai]);
  const caus = useMemo(() => ALL_CAU.filter((x) => opt.bai.includes(x.n) && opt.loai.includes(x.loai)), [opt.bai, opt.loai]);
  const dem = useMemo(() => {
    const d: Record<number, number> = {};
    for (const x of ALL_CARDS) if (opt.loai.includes(x.loai)) d[x.n] = (d[x.n] ?? 0) + 1;
    return d;
  }, [opt.loai]);
  const toggle = <T,>(arr: T[], v: T) => (arr.includes(v) ? (arr.length > 1 ? arr.filter((x) => x !== v) : arr) : [...arr, v]);
  const bestKey = `${[...opt.bai].sort((a, b) => a - b).join(',')}|${[...opt.loai].sort().join(',')}`;
  const thuoc = pool.filter((x) => store.st.thuoc[x.id]).length;
  // Đổi lựa chọn ⇒ dựng lại chế độ đang mở từ đầu (key).
  const resetKey = `${opt.mode}|${bestKey}|${opt.dir}`;

  return (
    <div className={`${c.root} ${opt.furi ? '' : s.noFuri}`}>
      <div className={c.filters}>
        <div className={c.fRow}>
          <span className={c.fLbl}>Bài</span>
          {BAI.map((n) => <button key={n} type="button" className={c.chip} aria-pressed={opt.bai.includes(n)} onClick={() => setOpt({ bai: toggle(opt.bai, n) })}>B{n}<small>{dem[n] ?? 0}</small></button>)}
          <button type="button" className={c.chip} aria-pressed={false} onClick={() => setOpt({ bai: [...BAI] })}>Tất cả</button>
        </div>
        <div className={c.fRow}>
          <span className={c.fLbl}>Loại</span>
          {(['tu', 'han', 'np'] as Loai[]).map((l) => <button key={l} type="button" className={c.chip} aria-pressed={opt.loai.includes(l)} onClick={() => setOpt({ loai: toggle(opt.loai, l) })}>{LOAI_TEN[l]}</button>)}
        </div>
        <div className={c.fRow}>
          <span className={c.fLbl}>Chiều</span>
          <button type="button" className={c.chip} aria-pressed={opt.dir === 'jv'} onClick={() => setOpt({ dir: 'jv' })}>Nhật → Việt</button>
          <button type="button" className={c.chip} aria-pressed={opt.dir === 'vj'} onClick={() => setOpt({ dir: 'vj' })}>Việt → Nhật</button>
          <button type="button" className={c.chip} aria-pressed={opt.furi} onClick={() => setOpt({ furi: !opt.furi })}>{opt.furi ? 'Furigana: hiện' : 'Furigana: ẩn'}</button>
        </div>
        <span className={c.count}>{pool.length} thẻ{caus.length ? ` + ${caus.length} câu trắc nghiệm của sách` : ''} · đã thuộc {thuoc} · romaji luôn ẩn tới khi lật</span>
      </div>

      <div className={c.modes} role="group" aria-label="Cách ôn">
        {MODES.map((m) => (
          <button key={m.id} type="button" className={c.mode} aria-pressed={opt.mode === m.id} onClick={() => setOpt({ mode: m.id })}>
            <span aria-hidden>{m.icon}</span>{m.ten}<small>{m.mo}</small>
          </button>
        ))}
      </div>

      <div key={resetKey} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {opt.mode === 'lat' && <TheLat pool={pool} dir={opt.dir} store={store} />}
        {opt.mode === 'hoc' && <Hoc pool={pool} dir={opt.dir} store={store} />}
        {opt.mode === 'tn' && <TracNghiem pool={pool} caus={caus} dir={opt.dir} store={store} />}
        {opt.mode === 'go' && <GoDapAn pool={pool} dir={opt.dir} store={store} />}
        {opt.mode === 'nghe' && <Nghe pool={pool} store={store} />}
        {opt.mode === 'ghep' && <GhepCap pool={pool} store={store} bestKey={bestKey} />}
        {opt.mode === 'kt' && <KiemTra pool={pool} caus={caus} dir={opt.dir} store={store} />}
        {opt.mode === 'sai' && <OnTuSai dir={opt.dir} store={store} bai={opt.bai} />}
      </div>
    </div>
  );
}
