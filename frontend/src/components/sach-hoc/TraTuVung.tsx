'use client';

/**
 * Khối `vocabAll` — tra cứu TOÀN BỘ từ vựng của khoá ở một chỗ: tìm (Anh hoặc
 * Việt, gõ không dấu cũng được), lọc theo buổi, che nghĩa/che từ để tự kiểm tra,
 * và chế độ thẻ nhớ (lật từng thẻ, trộn ngẫu nhiên).
 *
 * Dữ liệu lấy từ MỤC LỤC các buổi (`course.summary(d).vocab` — manifest sinh tự
 * động), nên không phải tải nội dung từng buổi và tự có từ của buổi mới soạn.
 */
import { useMemo, useState } from 'react';
import { Volume2, Shuffle, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { Inline } from './Blocks';
import { play } from './audio';
import { useCourse } from './tutorContext';
import s from './course.module.css';

type Item = { w: string; pos: string; ipa: string; vi: string; n: number };
type Hide = 'all' | 'hideVi' | 'hideW';

const fold = (x: string) =>
  x.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').replace(/\{([^|}]+)\|([^}]+)\}/g, '$1 $2').toLowerCase();

const POS_CLASS = (pos: string) =>
  pos.startsWith('phr') ? s.posPhr : pos.startsWith('adj') ? s.posAdj : pos.startsWith('adv') ? s.posAdv : pos.startsWith('v') ? s.posV : s.posN;

function shuffle<T>(a: T[]): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

export default function TraTuVung() {
  const course = useCourse();
  const all = useMemo<Item[]>(() => {
    if (!course) return [];
    const seen = new Set<string>();
    const out: Item[] = [];
    for (const d of course.days) {
      for (const v of course.summary(d).vocab) {
        const k = v.w.toLowerCase();
        if (seen.has(k)) continue;
        seen.add(k);
        out.push({ ...v, n: d.n });
      }
    }
    return out;
  }, [course]);
  const days = useMemo(() => [...new Set(all.map((x) => x.n))], [all]);

  const [q, setQ] = useState('');
  const [day, setDay] = useState<number | 0>(0);
  const [hide, setHide] = useState<Hide>('all');
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [card, setCard] = useState<{ deck: Item[]; i: number; flip: boolean; viFirst: boolean } | null>(null);

  const list = useMemo(() => {
    const f = fold(q.trim());
    return all.filter((x) => (!day || x.n === day) && (!f || fold(x.w).includes(f) || fold(x.vi).includes(f)));
  }, [all, q, day]);

  if (!course) return null;
  const name = (n: number) => course.dayName(n);

  if (card) {
    const it = card.deck[card.i];
    const front = card.viFirst ? <Inline text={it.vi} /> : <><Inline text={it.w} /></>;
    return (
      <div className={s.flashWrap}>
        <div className={s.flashTop}>
          <span className={s.muted}>Thẻ {card.i + 1}/{card.deck.length} · {name(it.n)}</span>
          <button type="button" className={s.btnGhost} onClick={() => setCard(null)}>Về danh sách</button>
        </div>
        <button type="button" className={`${s.flash} ${card.flip ? s.flashOn : ''}`} onClick={() => {
          if (!card.flip && !card.viFirst) play({ text: it.w });
          setCard({ ...card, flip: !card.flip });
        }}>
          <span className={s.flashFront}>{front}</span>
          {!card.viFirst && <span className={s.flashSub}>{it.ipa}</span>}
          {card.flip ? (
            <span className={s.flashBack}>
              {card.viFirst ? <><b><Inline text={it.w} /></b> <span className={s.wordIpa}>{it.ipa}</span></> : <Inline text={it.vi} />}
              <span className={`${s.wordPos} ${POS_CLASS(it.pos)}`} style={{ marginLeft: 8 }}>{it.pos}</span>
            </span>
          ) : (
            <span className={s.flashHint}>{card.viFirst ? 'Nói to từ tiếng Anh — rồi chạm để lật' : 'Nói to nghĩa tiếng Việt — rồi chạm để lật'}</span>
          )}
        </button>
        <div className={s.flashNav}>
          <button type="button" className={s.btnGhost} disabled={card.i === 0} onClick={() => setCard({ ...card, i: card.i - 1, flip: false })}><ArrowLeft size={15} /> Trước</button>
          <button type="button" className={s.btnGhost} onClick={() => play({ text: it.w })}><Volume2 size={15} /> Nghe</button>
          {card.i < card.deck.length - 1 ? (
            <button type="button" className={s.btn} onClick={() => setCard({ ...card, i: card.i + 1, flip: false })}>Tiếp <ArrowRight size={15} /></button>
          ) : (
            <button type="button" className={s.btn} onClick={() => setCard({ ...card, deck: shuffle(card.deck), i: 0, flip: false })}><RotateCcw size={15} /> Trộn lại từ đầu</button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={s.traWrap}>
      <div className={s.traTools}>
        <input
          className={s.input}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Tìm từ tiếng Anh hoặc nghĩa tiếng Việt (gõ không dấu cũng được)…"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          aria-label="Tìm từ"
        />
        <div className={s.chips}>
          <button type="button" className={`${s.chip} ${day === 0 ? s.chipOn : ''}`} onClick={() => setDay(0)}>Tất cả ({all.length})</button>
          {days.map((n) => (
            <button key={n} type="button" className={`${s.chip} ${day === n ? s.chipOn : ''}`} onClick={() => setDay(n)}>
              {name(n)} ({all.filter((x) => x.n === n).length})
            </button>
          ))}
        </div>
        <div className={s.vocabBar} style={{ border: 'none', padding: 0, background: 'none' }}>
          <span className={s.vocabBarLabel}>Tự kiểm tra:</span>
          {([['all', 'Xem đủ'], ['hideVi', 'Che nghĩa'], ['hideW', 'Che từ tiếng Anh']] as [Hide, string][]).map(([m, l]) => (
            <button key={m} type="button" className={`${s.chip} ${hide === m ? s.chipOn : ''}`} aria-pressed={hide === m} onClick={() => { setHide(m); setOpen({}); }}>{l}</button>
          ))}
          <span className={s.traSep} />
          <button type="button" className={s.btnGhost} disabled={!list.length} onClick={() => setCard({ deck: shuffle(list), i: 0, flip: false, viFirst: false })}>
            <Shuffle size={14} /> Thẻ nhớ Anh → Việt
          </button>
          <button type="button" className={s.btnGhost} disabled={!list.length} onClick={() => setCard({ deck: shuffle(list), i: 0, flip: false, viFirst: true })}>
            <Shuffle size={14} /> Thẻ nhớ Việt → Anh
          </button>
        </div>
      </div>

      <div className={s.muted} style={{ fontSize: 13.5, margin: '10px 2px' }}>
        {list.length} từ{q ? ` khớp “${q}”` : ''}. Bấm 🔊 để nghe. Muốn xem câu ví dụ, mở bài của buổi đó.
      </div>

      <div className={s.vocab}>
        {list.map((v) => {
          const hv = hide === 'hideVi' && !open[v.w];
          const hw = hide === 'hideW' && !open[v.w];
          const show = () => setOpen((o) => ({ ...o, [v.w]: true }));
          return (
            <div key={`${v.n}-${v.w}`} className={s.traRow}>
              {hw ? <span className={s.speakGhost} aria-hidden /> : (
                <button type="button" className={s.speak} aria-label={`Nghe: ${v.w}`} onClick={() => play({ text: v.w })}><Volume2 size={15} /></button>
              )}
              <div className={s.traMain}>
                {hw ? (
                  <button type="button" className={s.mask} onClick={show}><span className={s.maskInner} aria-hidden><span className={s.wordW}><Inline text={v.w} /></span></span><span className={s.maskHint}>chạm để xem</span></button>
                ) : (
                  <span className={s.wordW}><Inline text={v.w} /></span>
                )}
                <span className={`${s.wordPos} ${POS_CLASS(v.pos)}`}>{v.pos}</span>
                {!hw && <span className={s.wordIpa}>{v.ipa}</span>}
              </div>
              <div className={s.traVi}>
                {hv ? (
                  <button type="button" className={s.mask} onClick={show}><span className={s.maskInner} aria-hidden><span className={s.wordVi}><Inline text={v.vi} /></span></span><span className={s.maskHint}>chạm để xem</span></button>
                ) : (
                  <span className={s.wordVi}><Inline text={v.vi} /></span>
                )}
                <span className={s.traDay}>{name(v.n)}</span>
              </div>
            </div>
          );
        })}
        {!list.length && <div className={s.soonBox} style={{ margin: 16 }}>Không có từ nào khớp. Thử gõ ngắn hơn, hoặc chọn “Tất cả”.</div>}
      </div>
    </div>
  );
}
