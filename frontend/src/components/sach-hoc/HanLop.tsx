'use client';

/**
 * Khối `hanlop` — "Chữ Hán của lớp" trình bày như slide của cô: mỗi chữ một thẻ
 * (chữ to, Hán Việt, nghĩa, On/Kun kiểu み・ます, số nét, cách nhớ, từ đi chung).
 * Chạm thẻ → thẻ chi tiết (KanjiSheet: hoạt hình nét, mọi từ đi chung, tập viết).
 * Nút "Che để tự kiểm tra": chỉ còn chữ, tự nhớ âm + nghĩa rồi chạm để xem.
 */
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import type { Block } from './types';
import { useCourse } from './tutorContext';
import { Inline } from './Blocks';
import { useStrokeData } from './WriteBlock';
import { openKanji, useKanjiDict } from './KanjiSheet';
import s from './course.module.css';
import k from './kanji.module.css';

const HUES = ['#1d4f91', '#b45309', '#0f766e', '#7c3aed', '#be123c', '#15803d'];

export default function HanLop({ b }: { b: Extract<Block, { t: 'hanlop' }> }) {
  const course = useCourse();
  const { dict, err } = useKanjiDict(course);
  const strokes = useStrokeData();
  const [cover, setCover] = useState(false);
  const [seen, setSeen] = useState<Record<string, boolean>>({});

  if (!course?.kanji) return null;
  if (err) return <div className={s.soonBox}>Không tải được thẻ chữ Hán — kiểm tra mạng rồi tải lại trang.</div>;
  if (!dict) return <div className={s.soonBox} aria-busy="true">Đang tải thẻ chữ Hán…</div>;
  const lop = dict.lop[b.bai];
  if (!lop) return null;
  const chars = [...lop.chars];

  return (
    <div>
      <div className={k.lopBar}>
        <button type="button" className={s.btnGhost} aria-pressed={cover} onClick={() => { setCover(!cover); setSeen({}); }}>
          {cover ? <Eye size={15} /> : <EyeOff size={15} />} {cover ? 'Hiện hết' : 'Che để tự kiểm tra'}
        </button>
        <span className={s.muted}>
          {cover ? 'Nhìn chữ, nói to âm Hán Việt + nghĩa + một từ đi chung, rồi chạm thẻ để xem.' : 'Chạm vào thẻ để xem hoạt hình nét, mọi từ đi chung và tập viết.'}
        </span>
      </div>
      <div className={k.lopGrid}>
        {chars.map((ch, i) => {
          const h = dict.han[ch];
          const bang = dict.bang[ch];
          const hide = cover && !seen[ch];
          const net = strokes?.[ch]?.length;
          return (
            <button
              key={ch}
              type="button"
              className={k.card}
              style={{ '--k': HUES[i % HUES.length] } as React.CSSProperties}
              onClick={() => (hide ? setSeen({ ...seen, [ch]: true }) : openKanji(ch))}
              aria-label={hide ? `Chữ ${ch} — chạm để xem âm và nghĩa` : `Chữ ${ch}${h ? ` (${h.hv}, ${h.nghia})` : ''} — mở thẻ chi tiết`}
            >
              {net ? <span className={k.cardNet}>{net} nét</span> : null}
              <div className={k.cardTop}>
                <span className={`${k.cardCh} ${k.mincho}`}>{ch}</span>
                <div className={hide ? k.hidden : undefined} style={{ minWidth: 0 }}>
                  <div className={k.cardHv}>{h?.hv ?? bang?.hv ?? ''}</div>
                  <div className={k.cardNghia}>{h?.nghia ?? bang?.nghia ?? ''}</div>
                  {h?.en && <div className={k.cardEn}>{h.en}</div>}
                </div>
              </div>
              <div className={`${k.cardReads} ${hide ? k.hidden : ''}`}>
                <div><i>ON</i>{h?.on.length ? h.on.join('、') : bang?.on || '—'}</div>
                <div><i>KUN</i>{h?.kun.length ? h.kun.join('、') : bang?.kun || '—'}</div>
              </div>
              {h?.nho && <div className={`${k.cardNho} ${hide ? k.hidden : ''}`}><Inline text={h.nho} /></div>}
              {h?.tu.length ? (
                <div className={`${k.cardWords} ${hide ? k.hidden : ''}`}>
                  {h.tu.slice(0, 3).map((t) => (
                    <div key={t.w}><span><Inline text={t.w} /></span><span>{t.vi}</span></div>
                  ))}
                </div>
              ) : null}
              <span className={k.cardHint}>{hide ? 'Chạm để xem ›' : 'Nét viết · từ đi chung · tập viết ›'}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
