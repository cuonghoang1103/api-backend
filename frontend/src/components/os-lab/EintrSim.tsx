'use client';
/**
 * Tín hiệu cắt ngang lời gọi đang chặn (Chương 11): read() chặn 0 → 2 s, SIGALRM lúc 1 s; không SA_RESTART ⇒ EINTR,
 * có SA_RESTART ⇒ nhân tự chạy lại, poll luôn EINTR, Python tự thử lại, Go với SIGURG. Engine: engine/minitl.ts (c115).
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { eintr, type EintrMode } from './engine/minitl';
import { Controls, Explain, Frame, Seg, css as s, cx, tx, usePlayer, type Lang } from './ui';
import { WhereBox } from './where';
import { useLabBridge, useOwnStepSound } from '../labs/bus';
import { labSfx } from '../labs/sfx';
import c from './lab2.module.css';

const MODES: EintrMode[] = ['norestart', 'restart', 'poll', 'python', 'go'];
const LANES: Array<['prog' | 'kernel' | 'signal', string, string]> = [['prog', 'your program', 'chương trình'], ['kernel', 'kernel', 'nhân'], ['signal', 'signals', 'tín hiệu']];

export default function EintrSim({ lang = 'vi', preset = 'norestart' }: { lang?: Lang; preset?: string }) {
  const t = (en: string, vi: string) => tx(lang, en, vi);
  const [mode, setMode] = useState<EintrMode>((MODES as string[]).includes(preset) ? (preset as EintrMode) : 'norestart');
  const evs = useMemo(() => eintr(mode), [mode]);
  const p = usePlayer(evs.length, 1500);
  const e = evs[Math.min(p.i, evs.length - 1)];
  const tMax = mode === 'go' ? 1.5 : 2.2;
  useOwnStepSound();
  const prev = useRef(p.i);
  useEffect(() => { if (p.i !== prev.current) labSfx(e.lane === 'signal' ? 'whoosh' : e.tone === 'bad' ? 'oops' : e.tone === 'ok' ? 'hit' : 'tick'); prev.current = p.i; }, [p.i, e]);
  const pick = (m: EintrMode) => { setMode(m); p.reset(); labSfx('tap'); };
  const sawEintr = evs.slice(0, p.i + 1).some((x) => /EINTR|Interrupted/.test(x.strace ?? '') && x.lane === 'prog');
  useLabBridge('eintr', { mode, i: p.i, atEnd: p.atEnd, t: e.t, sawEintr, done: p.atEnd }, { mode: (v) => pick(v as EintrMode) });

  return (
    <Frame badge={t('OS lab', 'Phòng lab OS')} title={t('A signal interrupts a blocking call', 'Tín hiệu cắt ngang một lời gọi đang chặn')}
      sub={t('read() is sleeping, SIGALRM arrives: EINTR, SA_RESTART, poll, Python and Go', 'read() đang ngủ thì SIGALRM tới: EINTR, SA_RESTART, poll, Python và Go')}>
      <div className={s.bar} data-tour="ei-mode">
        <Seg value={mode} options={[['norestart', t('C, no SA_RESTART', 'C, không SA_RESTART')], ['restart', 'C + SA_RESTART'], ['poll', 'poll()'], ['python', 'Python'], ['go', 'Go']]} onChange={pick} />
      </div>
      <Controls p={p} lang={lang} label={`t = ${e.t.toFixed(e.t < 1.1 && mode === 'go' ? 2 : 1)} s`} />
      <Explain tone={e.tone}><b className={s.mono}>{e.text}</b> — {t(e.en, e.vi)}</Explain>
      <div className={c.split} style={{ marginTop: 10 }}>
        <div className={s.stack} style={{ gap: 8 }}>
          <div className={s.panel} data-tour="ei-timeline">
            <div className={s.panelTitle}>{t('Timeline', 'Dòng thời gian')} (0 – {tMax} s)</div>
            {LANES.map(([ln, en, vi]) => (
              <div key={ln} style={{ display: 'grid', gridTemplateColumns: '84px minmax(0,1fr)', gap: 6, alignItems: 'center', marginBottom: 6 }}>
                <span className={s.small} style={{ fontWeight: 800 }}>{t(en, vi)}</span>
                <div style={{ position: 'relative', height: 26, background: 'var(--ol-panel2)', borderRadius: 6, border: '1px solid var(--ol-border)' }}>
                  {ln === 'prog' && mode !== 'go' && <div style={{ position: 'absolute', left: 0, width: `${(Math.min(e.t, 2) / tMax) * 100}%`, top: 0, bottom: 0, background: 'repeating-linear-gradient(45deg, rgba(37,99,235,.18) 0 6px, transparent 6px 12px)', borderRadius: 6 }} title="blocked (S)" />}
                  {evs.slice(0, p.i + 1).filter((x) => x.lane === ln).map((x, k) => (
                    <span key={k} className={cx(c.tag, x.tone === 'bad' ? c.tagBad : x.tone === 'ok' ? c.tagOk : x.tone === 'warn' ? c.tagWarn : c.tagAcc)}
                      style={{ position: 'absolute', top: 3, left: `min(calc(${(x.t / tMax) * 100}% - 4px), calc(100% - 64px))`, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis' }} title={x.text}>
                      {x.lane === 'signal' ? '⚡' : x.tone === 'bad' ? '✗' : x.tone === 'ok' ? '✓' : '●'} {x.t}s
                    </span>
                  ))}
                </div>
              </div>
            ))}
            <div className={s.small}>{t('Striped = the program is asleep inside the call (state S).', 'Sọc = chương trình đang ngủ trong lời gọi (trạng thái S).')}</div>
          </div>
          <div className={s.term} data-tour="ei-term" style={{ minHeight: 80 }}>
            <span className={s.pr}>$ </span>strace -qq -e trace=read,ppoll,rt_sigreturn ./eintr {mode}{'\n'}
            {evs.slice(0, p.i + 1).filter((x) => x.strace).map((x, k) => <div key={k} className={/EINTR|Interrupted/.test(x.strace!) ? s.er : undefined} style={{ whiteSpace: 'pre-wrap' }}>{x.strace}</div>)}
          </div>
        </div>
        <div className={s.stack} style={{ gap: 8 }}>
          <div className={s.panel}>
            <div className={s.panelTitle}>{t('Rule of thumb', 'Quy tắc nhớ')}</div>
            <div className={s.small}>{t('A slow call (read on a pipe/socket, wait, poll, sleep…) can return -1 EINTR whenever a signal handler runs. C code must loop on EINTR or install handlers with SA_RESTART; poll/epoll_wait/nanosleep always need the loop. Python ≥ 3.5 and Go retry for you.', 'Lời gọi chậm (read trên ống/socket, wait, poll, sleep…) có thể trả -1 EINTR bất cứ khi nào một handler tín hiệu chạy. Mã C phải lặp khi gặp EINTR hoặc cài handler với SA_RESTART; poll/epoll_wait/nanosleep thì luôn cần vòng lặp. Python ≥ 3.5 và Go tự thử lại cho bạn.')}</div>
          </div>
          <WhereBox focus={e.lane === 'signal' ? 'interrupt' : e.lane === 'kernel' ? 'kernel-code' : 'process'} lang={lang} height={200} />
        </div>
      </div>
    </Frame>
  );
}
