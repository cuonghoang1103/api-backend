'use client';
/**
 * "Cùng khái niệm, ba hệ điều hành" (Chương 14): công tắc Linux / macOS / Windows phía trên, các thẻ khái niệm bên dưới
 * đổi tên + lệnh + một dòng output; chế độ so cạnh nhau 3 cột. Linux/macOS = output thật của lab (c141–c148); Windows =
 * "theo tài liệu". Engine (dữ liệu): engine/osmap.ts.
 */
import { useEffect, useRef, useState } from 'react';
import { OS_CARDS, OS_KEYS, OS_LABEL, type OsCell, type OsKey } from './engine/osmap';
import { Controls, Explain, Frame, Seg, css as s, cx, tx, usePlayer, type Lang } from './ui';
import { WhereBox } from './where';
import { useLabBridge, useOwnStepSound } from '../labs/bus';
import { labSfx } from '../labs/sfx';
import c from './lab3.module.css';

const OS_COLOR: Record<OsKey, string> = { linux: '#d97706', mac: '#64748b', win: '#2563eb' };
const OS_ICON: Record<OsKey, string> = { linux: '🐧', mac: '🍎', win: '🪟' };
type View = OsKey | 'compare';

function Cell({ x, k, lang, compact }: { x: OsCell; k: OsKey; lang: Lang; compact?: boolean }) {
  const measured = x.src !== 'doc';
  return (
    <div className={c.osCell} style={{ borderTopColor: OS_COLOR[k] }}>
      {compact && <div className={c.osCellOs} style={{ color: OS_COLOR[k] }}>{OS_ICON[k]} {OS_LABEL[k]}</div>}
      <div className={c.osName}>{x.name}</div>
      <div className={c.osCmd}><span className={c.osPr}>$</span> {x.cmd}</div>
      <pre className={c.osOut}>{x.out}</pre>
      <div className={c.osMeta}>
        <span className={cx(c.osBadge, measured ? c.osBadgeReal : c.osBadgeDoc)}>{measured ? tx(lang, `measured · ${x.src}`, `đo thật · ${x.src}`) : tx(lang, 'per documentation', 'theo tài liệu')}</span>
        {(x.noteEn || x.noteVi) && <span>{tx(lang, x.noteEn ?? '', x.noteVi ?? '')}</span>}
      </div>
    </div>
  );
}

export default function OsMapSim({ lang = 'vi', preset = 'linux' }: { lang?: Lang; preset?: string }) {
  const t = (en: string, vi: string) => tx(lang, en, vi);
  const [view, setView] = useState<View>((['linux', 'mac', 'win', 'compare'] as string[]).includes(preset) ? (preset as View) : 'linux');
  const [flash, setFlash] = useState(0);
  const p = usePlayer(OS_CARDS.length, 2600);
  const card = OS_CARDS[Math.min(p.i, OS_CARDS.length - 1)];
  useOwnStepSound();
  const prev = useRef(p.i);
  useEffect(() => { if (p.i !== prev.current) labSfx('blip-exec'); prev.current = p.i; }, [p.i]);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const gridRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (p.i === 0 && !p.playing) return;
    // cuộn TRONG khung thẻ (không kéo cả trang bài học)
    const el = cardRefs.current[card.id], box = gridRef.current;
    if (!el || !box) return;
    const top = el.offsetTop, bottom = top + el.offsetHeight;
    if (top < box.scrollTop || bottom > box.scrollTop + box.clientHeight) {
      const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      if (typeof box.scrollTo === 'function') box.scrollTo({ top: Math.max(0, top - 6), behavior: reduce ? 'auto' : 'smooth' }); else box.scrollTop = Math.max(0, top - 6);
    }
  }, [card.id]); // eslint-disable-line react-hooks/exhaustive-deps
  const setOs = (v: View) => { setView(v); setFlash((x) => x + 1); labSfx(v === 'compare' ? 'pop' : 'whoosh'); };
  useLabBridge('om', { view, card: card.id, i: p.i, atEnd: p.atEnd }, {
    os: (v) => setOs(v as View), card: (v) => { const k = OS_CARDS.findIndex((x) => x.id === v); if (k >= 0) p.setI(k); },
  });

  return (
    <Frame badge={t('OS lab', 'Phòng lab OS')} title={t('Same concept, three operating systems', 'Cùng khái niệm, ba hệ điều hành')}
      sub={t('Flip the switch: each card changes its name, its command and a real output line', 'Bật công tắc: mỗi thẻ đổi tên, lệnh và một dòng output thật')}>
      <div className={s.bar} data-tour="om-switch">
        <Seg value={view} options={[['linux', '🐧 Linux'], ['mac', '🍎 macOS'], ['win', '🪟 Windows'], ['compare', t('⫼ side by side', '⫼ so cạnh nhau')]] as Array<[View, string]>} onChange={setOs} />
      </div>
      <Controls p={p} lang={lang} label={`${p.i + 1}/${OS_CARDS.length} · ${t(card.en, card.vi)}`} />
      <Explain><b>{t(card.en, card.vi)}</b> — {t(card.whyEn, card.whyVi)}</Explain>

      <div className={c.cols} style={{ marginTop: 10 }}>
        <div className={c.osGrid} data-tour="om-cards" key={flash} ref={gridRef}>
          {OS_CARDS.map((cd, k) => (
            <div key={cd.id} ref={(el) => { cardRefs.current[cd.id] = el; }} className={cx(c.osCard, k === p.i && c.osCardOn, view === 'compare' && c.osCardWide)}
              onClick={() => { p.setI(k); labSfx('tap'); }} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') p.setI(k); }}>
              <div className={c.osCardTitle}>{t(cd.en, cd.vi)}</div>
              {view === 'compare'
                ? <div className={c.os3}>{OS_KEYS.map((o) => <Cell key={o} x={cd.os[o]} k={o} lang={lang} compact />)}</div>
                : <Cell x={cd.os[view]} k={view} lang={lang} />}
            </div>
          ))}
        </div>
        <div className={s.stack} style={{ gap: 8 }}>
          <div className={s.panel} data-tour="om-legend">
            <div className={s.panelTitle}>{t('Where the lines come from', 'Các dòng output lấy từ đâu')}</div>
            <div className={s.small}>{t('Linux = the course container (Docker Desktop\'s linuxkit VM on an M1 Max), macOS = the same Mac (27.0.1), both from lab/out/c141–c148. Windows was not run in the lab: those cards say what the documentation says, with no numbers.', 'Linux = container của khoá (máy ảo linuxkit của Docker Desktop trên M1 Max), macOS = chính chiếc Mac đó (27.0.1), đều lấy từ lab/out/c141–c148. Windows không chạy trong lab: các thẻ đó nói theo tài liệu, không có số đo.')}</div>
          </div>
          <WhereBox focus="kernel-code" lang={lang} height={180} />
        </div>
      </div>
    </Frame>
  );
}
