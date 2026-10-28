'use client';
/**
 * Hai lần ghi nhỏ trên một socket (Chương 11, dùng lại ở Ch10): Nagle giữ gói thứ hai chờ ACK, khách trì hoãn ACK
 * ⇒ mỗi request ~41 ms; TCP_NODELAY hoặc gộp một write ⇒ 0,028 s cho 200 request. Engine: engine/minitl.ts (c113).
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { nagle, type NagleCfg } from './engine/minitl';
import { Controls, Explain, Frame, Kpi, Seg, css as s, cx, tx, usePlayer, type Lang } from './ui';
import { WhereBox } from './where';
import { useLabBridge, useOwnStepSound } from '../labs/bus';
import { labSfx } from '../labs/sfx';
import c from './lab2.module.css';

const PRESET: Record<string, NagleCfg> = {
  nagle: { writes: 2, nodelay: false, delayedAck: true },
  nodelay: { writes: 2, nodelay: true, delayedAck: true },
  onewrite: { writes: 1, nodelay: false, delayedAck: true },
};

export default function NagleSim({ lang = 'vi', preset = 'nagle' }: { lang?: Lang; preset?: string }) {
  const t = (en: string, vi: string) => tx(lang, en, vi);
  const [cfg, setCfg] = useState<NagleCfg>(PRESET[preset] ?? PRESET.nagle);
  const R = useMemo(() => nagle(cfg), [cfg]);
  const p = usePlayer(R.events.length, 1500);
  const e = R.events[Math.min(p.i, R.events.length - 1)];
  useOwnStepSound();
  const prev = useRef(p.i);
  useEffect(() => { if (p.i !== prev.current) labSfx(e.held ? 'miss' : e.tone === 'bad' ? 'oops' : e.tone === 'ok' ? 'hit' : 'blip-exec'); prev.current = p.i; }, [p.i, e]);
  const set = (x: Partial<NagleCfg>) => { setCfg((o) => ({ ...o, ...x })); p.reset(); labSfx('tap'); };
  useLabBridge('nagle', { writes: cfg.writes, nodelay: cfg.nodelay, delayedAck: cfg.delayedAck, i: p.i, atEnd: p.atEnd, ms: e.ms, total: R.total200s ?? -1 }, {
    writes: (v) => set({ writes: Number(v) as 1 | 2 }), nodelay: (v) => set({ nodelay: !!v }), delayedAck: (v) => set({ delayedAck: !!v }),
  });
  const seen = R.events.slice(0, p.i + 1);

  return (
    <Frame badge={t('OS lab', 'Phòng lab OS')} title={t('Nagle + delayed ACK: the 40 ms mystery', 'Nagle + ACK trễ: bí ẩn 40 ms')}
      sub={t('Two small write() calls on one TCP connection, seen packet by packet', 'Hai lần write() nhỏ trên một kết nối TCP, nhìn từng gói')}>
      <div className={s.bar} data-tour="ng-opts">
        <Seg label={t('response', 'câu trả lời')} value={cfg.writes} options={[[2, t('headers, then body (2 writes)', 'headers rồi body (2 write)')], [1, t('one write', 'một write')]]} onChange={(v) => set({ writes: v })} />
        <Seg label="TCP_NODELAY" value={cfg.nodelay ? 'on' : 'off'} options={[['off', t('off', 'tắt')], ['on', t('on', 'bật')]]} onChange={(v) => set({ nodelay: v === 'on' })} />
        <Seg label={t('client delayed ACK', 'ACK trễ ở khách')} value={cfg.delayedAck ? 'on' : 'off'} options={[['on', t('on (default)', 'bật (mặc định)')], ['off', 'QUICKACK']]} onChange={(v) => set({ delayedAck: v === 'on' })} />
      </div>
      <Controls p={p} lang={lang} label={`+${e.ms} ms`} />
      <Explain tone={e.tone}><b className={s.mono}>{e.label}</b> — {t(e.en, e.vi)}</Explain>
      <div className={c.split} style={{ marginTop: 10 }}>
        <div className={s.panel} data-tour="ng-seq">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 56px 1fr', fontWeight: 800, fontSize: 12.5, marginBottom: 6 }}>
            <span>🖥️ {t('server', 'máy chủ')}</span><span className={s.small} style={{ textAlign: 'center' }}>ms</span><span style={{ textAlign: 'right' }}>{t('client (curl)', 'khách (curl)')} 💻</span>
          </div>
          {seen.map((x, k) => (
            <div key={k} style={{ display: 'grid', gridTemplateColumns: '1fr 56px 1fr', alignItems: 'center', gap: 4, marginBottom: 4 }}>
              <span style={{ gridColumn: x.from === 'server' ? 1 : 3, textAlign: x.from === 'server' ? 'left' : 'right' }}>
                <span className={cx(c.tag, x.held ? c.tagWarn : x.tone === 'bad' ? c.tagBad : x.tone === 'ok' ? c.tagOk : c.tagAcc)} style={{ borderStyle: x.held ? 'dashed' : undefined, whiteSpace: 'normal' }}>
                  {x.from === 'server' ? '' : '← '}{x.label}{x.from === 'server' ? ' →' : ''}
                </span>
              </span>
              <span className={s.mono} style={{ gridColumn: 2, gridRow: 1, textAlign: 'center', fontWeight: 700 }}>{x.ms}</span>
            </div>
          ))}
        </div>
        <div className={s.stack} style={{ gap: 8 }}>
          <div className={s.kpis} data-tour="ng-cost">
            <Kpi k={t('per request', 'mỗi request')} v={R.perReqMs === null ? '—' : `${R.perReqMs} ms`} tone={R.perReqMs !== null && R.perReqMs > 10 ? 'bad' : 'ok'} />
            <Kpi k={t('200 requests (lab)', '200 request (lab)')} v={R.total200s === null ? t('not measured', 'chưa đo') : `${R.total200s} s`} tone={R.total200s !== null && R.total200s > 1 ? 'bad' : 'ok'} />
          </div>
          <div className={s.small}>{t('Measured in the lab: Python http.server 8.367 s → 0.028 s with TCP_NODELAY; the JDK HttpServer 8.604 s for 200 requests → 0.115 s for 1 000 with sun.net.httpserver.nodelay=true. Node sets TCP_NODELAY on every accepted socket by default.', 'Đo trong lab: Python http.server 8,367 s → 0,028 s với TCP_NODELAY; HttpServer của JDK 8,604 s cho 200 request → 0,115 s cho 1 000 request với sun.net.httpserver.nodelay=true. Node mặc định đặt TCP_NODELAY cho mọi socket được accept.')}</div>
          <WhereBox focus="packet" lang={lang} height={200} />
        </div>
      </div>
    </Frame>
  );
}
