'use client';
/**
 * Coordinated omission (bài 15.6): cùng một máy chủ "nhanh 0,1 ms nhưng đứng hình 200 ms mỗi giây" (stall.js), đo bằng
 * vòng KÍN (khách chờ ⇒ ngừng gửi lúc đứng hình) và vòng MỞ (yêu cầu rời đúng lịch). Hai làn thời gian, bảng p50/p95/p99
 * cập nhật sống, hai đồng hồ "từ lúc dự định" vs "từ lúc gửi thật", nút sửa kiểu wrk. Engine: engine/co.ts; số đo thật c156.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { C156, correct, LAB_SERVER, pct, pctUntil, runCo, type CoRun, type Pcts } from './engine/co';
import { Controls, Explain, Frame, Kpi, Seg, css as s, cx, tx, usePlayer, type Lang } from './ui';
import { useWidth } from './charts';
import { WhereBox } from './where';
import { useLabBridge, useOwnStepSound } from '../labs/bus';
import { labSfx } from '../labs/sfx';
import c from './lab3.module.css';

const DUR = 8000, STEP = 250, WIN = 1000, YMAX = 210;
const PRESET: Record<string, { conns: number; rate: number; stall: number; fix: boolean }> = {
  stall: { conns: 1, rate: 100, stall: 200, fix: false },
  conns: { conns: 50, rate: 100, stall: 200, fix: false },
  wrk: { conns: 1, rate: 100, stall: 200, fix: true },
  nostall: { conns: 1, rate: 100, stall: 0, fix: false },
};

function Lane({ run, t, mode, lang, title }: { run: CoRun; t: number; mode: 'closed' | 'open'; lang: Lang; title: string }) {
  const [box, W] = useWidth<HTMLDivElement>(560);
  const H = 150, L = 34, R = 6, T = 8, B = 18;
  const a = Math.max(0, t - WIN), b = Math.max(WIN, t);
  const X = (v: number) => L + ((W - L - R) * (v - a)) / (b - a);
  const Y = (ms: number) => T + (H - T - B) * (1 - Math.min(YMAX, ms) / YMAX);
  const inWin = run.reqs.filter((r) => r.intended >= a && r.intended < Math.min(b, t) && r.done <= t + 400);
  const bins = mode === 'closed' ? 120 : 0;
  const counts = new Array<number>(bins).fill(0), maxLat = new Array<number>(bins).fill(-1);
  if (mode === 'closed') for (const r of inWin) { if (r.done > t) continue; const k = Math.min(bins - 1, Math.floor(((r.sent - a) / (b - a)) * bins)); counts[k]++; maxLat[k] = Math.max(maxLat[k], r.done - r.sent); }
  const cmax = Math.max(1, ...counts);
  return (
    <div className={c.lane} ref={box}>
      <div className={c.laneHead}><span>{title}</span></div>
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ display: 'block', maxWidth: '100%' }} role="img" aria-label={title}>
        {run.stalls.filter(([x, y]) => y > a && x < b).map(([x, y], k) => <rect key={k} x={X(Math.max(a, x))} y={T} width={Math.max(0, X(Math.min(b, y)) - X(Math.max(a, x)))} height={H - T - B} fill="var(--ol-bad-bg)" />)}
        {[0, 100, 200].map((v) => <g key={v}><line x1={L} x2={W - R} y1={Y(v)} y2={Y(v)} className={s.svgGrid} /><text x={L - 4} y={Y(v) + 4} fontSize={10} textAnchor="end" className={s.svgMuted}>{v}</text></g>)}
        <text x={L} y={H - 4} fontSize={10.5} className={s.svgMuted}>{(a / 1000).toFixed(2)} s</text>
        <text x={W - R} y={H - 4} fontSize={10.5} textAnchor="end" className={s.svgMuted}>{(b / 1000).toFixed(2)} s</text>
        {mode === 'closed' && counts.map((n, k) => n > 0 && <rect key={k} x={L + ((W - L - R) * k) / bins} width={Math.max(1, (W - L - R) / bins - 0.5)} y={H - B - (n / cmax) * 28} height={(n / cmax) * 28} fill="#64748b" opacity={0.5} />)}
        {mode === 'closed' && maxLat.map((v, k) => v >= 0 && <circle key={`m${k}`} cx={L + ((W - L - R) * (k + 0.5)) / bins} cy={Y(v)} r={v > 20 ? 4.5 : 1.8} fill={v > 20 ? 'var(--ol-bad)' : 'var(--ol-accent)'} />)}
        {mode === 'open' && inWin.filter((r) => r.done <= t).map((r, k) => (
          <g key={k}>
            <circle cx={X(r.intended)} cy={Y(r.done - r.intended)} r={3.2} fill="var(--ol-bad)" />
            <circle cx={X(r.intended)} cy={Y(r.done - r.sent)} r={2.4} fill="var(--ol-accent)" />
          </g>
        ))}
        <line x1={X(Math.min(b, t))} x2={X(Math.min(b, t))} y1={T} y2={H - B} stroke="var(--ol-text)" strokeDasharray="2 3" />
      </svg>
      <div className={s.small}>
        {mode === 'closed'
          ? tx(lang, 'grey bars = requests sent per slice (silence = the client stopped sending) · dots = slowest latency in the slice', 'cột xám = số yêu cầu gửi trong mỗi lát (khoảng lặng = khách ngừng gửi) · chấm = độ trễ lớn nhất trong lát')
          : <><span style={{ color: 'var(--ol-bad)' }}>●</span> {tx(lang, 'latency from the INTENDED start', 'độ trễ tính từ lúc DỰ ĐỊNH')} · <span style={{ color: 'var(--ol-accent)' }}>●</span> {tx(lang, 'from the ACTUAL send', 'tính từ lúc GỬI THẬT')}</>}
        {' · '}<span style={{ background: 'var(--ol-bad-bg)', padding: '0 4px', borderRadius: 3 }}>{tx(lang, 'server stalled', 'máy chủ đứng hình')}</span>
      </div>
    </div>
  );
}

const f1 = (v: number) => (v >= 10 ? v.toFixed(1) : v.toFixed(2));

export default function OmissionSim({ lang = 'vi', preset = 'stall' }: { lang?: Lang; preset?: string }) {
  const t = (en: string, vi: string) => tx(lang, en, vi);
  const P0 = PRESET[preset] ?? PRESET.stall;
  const [conns, setConns] = useState(P0.conns);
  const [rate, setRate] = useState(P0.rate);
  const [stall, setStall] = useState(P0.stall);
  const [fix, setFix] = useState(P0.fix);
  const base = { ...LAB_SERVER, stallMs: stall, durationMs: DUR };
  const closed = useMemo(() => runCo({ ...base, mode: 'closed', rate: 0, conns }), [conns, stall]); // eslint-disable-line react-hooks/exhaustive-deps
  const open = useMemo(() => runCo({ ...base, mode: 'open', rate, conns }), [conns, stall, rate]); // eslint-disable-line react-hooks/exhaustive-deps
  const p = usePlayer(DUR / STEP + 1, 700);
  const now = p.i * STEP;
  useOwnStepSound();
  useEffect(() => { p.reset(); }, [conns, rate, stall]); // eslint-disable-line react-hooks/exhaustive-deps

  const liveC = useMemo(() => pctUntil(closed, now), [closed, now]);
  const liveO = useMemo(() => pctUntil(open, now), [open, now]);
  const liveFix = useMemo(() => {
    if (!fix) return null;
    const done = closed.reqs.filter((r) => r.done <= now).map((r) => r.done - r.sent);
    return pct(correct(done, (DUR * conns) / Math.max(1, closed.reqs.length)));
  }, [fix, closed, now, conns]);
  const inStall = closed.stalls.some(([a, b]) => now >= a && now < b + STEP);
  const prev = useRef(p.i);
  useEffect(() => { if (p.i !== prev.current) labSfx(inStall ? 'thud' : p.atEnd ? 'done' : 'tick'); prev.current = p.i; }, [p.i]); // eslint-disable-line react-hooks/exhaustive-deps

  const lastOpen = [...open.reqs].reverse().find((r) => r.done <= now);
  useLabBridge('co', {
    conns, rate, stall, fix, i: p.i, atEnd: p.atEnd, t: now,
    closedP99: +liveC.fromSent.p99.toFixed(2), openP99I: +liveO.fromIntended.p99.toFixed(1), openP99S: +liveO.fromSent.p99.toFixed(1), fixP99: liveFix ? +liveFix.p99.toFixed(1) : -1,
  }, {
    conns: (v) => { setConns(Number(v)); labSfx('tap'); }, rate: (v) => setRate(Number(v)), stall: (v) => setStall(Number(v)), fix: (v) => { setFix(!!v); labSfx(v ? 'on' : 'off'); },
  });

  const row = (name: string, P: Pcts, hot: boolean, key: string) => (
    <tr key={key}><td>{name}</td><td className={s.num}>{P.n.toLocaleString('en-US')}</td><td className={s.num}>{f1(P.p50)}</td><td className={cx(s.num, hot && P.p95 > 50 && c.hot)}>{f1(P.p95)}</td><td className={cx(s.num, P.p99 > 50 && c.hot)}>{f1(P.p99)}</td><td className={s.num}>{f1(P.max)}</td></tr>
  );

  const explain = () => {
    if (now === 0) return t(`A server that answers in ~0.1 ms but freezes for ${stall} ms every second (stall.js). Two load generators measure it for 8 s. Press Play and watch the red stripes.`, `Một máy chủ trả lời trong ~0,1 ms nhưng đứng hình ${stall} ms mỗi giây (stall.js). Hai công cụ tải đo nó trong 8 s. Bấm Chạy và nhìn các vệt đỏ.`);
    const cl = t(`Closed loop: ${liveC.fromSent.n.toLocaleString('en-US')} samples, p99 ${f1(liveC.fromSent.p99)} ms`, `Vòng kín: ${liveC.fromSent.n.toLocaleString('vi-VN')} mẫu, p99 ${f1(liveC.fromSent.p99)} ms`);
    const op = t(`open loop ${rate}/s: p99 ${f1(liveO.fromIntended.p99)} ms from the intended start, ${f1(liveO.fromSent.p99)} ms from the actual send`, `vòng mở ${rate}/s: p99 ${f1(liveO.fromIntended.p99)} ms tính từ lúc dự định, ${f1(liveO.fromSent.p99)} ms tính từ lúc gửi thật`);
    if (p.atEnd) return <>{cl}; {op}.{' '}{t(`The closed loop sent nothing while the server was frozen, so only ONE request per stall saw it — hidden under tens of thousands of fast ones. A user arriving during a stall waits up to ${stall} ms: the open loop's "from intended" column is the truth.`, `Vòng kín không gửi gì trong lúc máy chủ đứng hình, nên mỗi lần đứng chỉ MỘT yêu cầu thấy — bị vùi dưới hàng chục nghìn yêu cầu nhanh. Người dùng tới đúng lúc đứng hình phải chờ tới ${stall} ms: cột "từ lúc dự định" của vòng mở mới là sự thật.`)}{fix && liveFix ? t(` wrk-style correction puts the missing samples back: p99 ${f1(liveFix.p99)} ms (wrk measured 187.31).`, ` Sửa kiểu wrk chèn lại các mẫu bị thiếu: p99 ${f1(liveFix.p99)} ms (wrk đo được 187,31).`) : ''}</>;
    return <>{inStall ? <b>{t('Stall! ', 'Đứng hình! ')}</b> : null}{cl}; {op}.</>;
  };

  return (
    <Frame badge={t('OS lab', 'Phòng lab OS')} title={t('Coordinated omission: closed vs open loop', 'Coordinated omission: vòng kín vs vòng mở')}
      sub={t('Why "p99 = 0.2 ms" can be a lie, and how to measure latency the way users feel it', 'Vì sao "p99 = 0,2 ms" có thể là nói dối, và đo độ trễ đúng như người dùng cảm nhận')}>
      <div className={s.stack} style={{ gap: 4, margin: '6px 0' }} data-tour="co-opts">
        <label className={c.slider}><span>{t('open-loop rate', 'tốc độ vòng mở')}</span><input type="range" min={20} max={1000} step={10} value={rate} onChange={(e) => setRate(Number(e.target.value))} /><output>{rate}/s</output></label>
        <label className={c.slider}><span>{t('stall', 'đứng hình')}</span><input type="range" min={0} max={400} step={10} value={stall} onChange={(e) => setStall(Number(e.target.value))} /><output>{stall} ms</output></label>
        <div className={s.bar} style={{ margin: 0 }}>
          <Seg label={t('connections', 'kết nối')} value={conns} options={[[1, '1'], [2, '2'], [10, '10'], [50, '50']]} onChange={(v) => { setConns(v); labSfx('tap'); }} />
          <Seg label={t('wrk-style fix', 'sửa kiểu wrk')} value={fix ? 'on' : 'off'} options={[['off', t('off', 'tắt')], ['on', t('on', 'bật')]]} onChange={(v) => { setFix(v === 'on'); labSfx(v === 'on' ? 'on' : 'off'); }} />
        </div>
      </div>
      <Controls p={p} lang={lang} label={`${(now / 1000).toFixed(2)} s / 8 s`} />
      <Explain tone={p.atEnd ? 'warn' : inStall ? 'bad' : undefined}>{explain()}</Explain>

      <div className={c.cols} style={{ marginTop: 10 }}>
        <div className={s.stack} style={{ gap: 8 }} data-tour="co-lanes">
          <Lane run={closed} t={now} mode="closed" lang={lang} title={t(`Closed loop (hey, wrk, tai.js --closed) · ${conns} conn · ${Math.round(closed.rps).toLocaleString('en-US')} req/s`, `Vòng kín (hey, wrk, tai.js --closed) · ${conns} kết nối · ${Math.round(closed.rps).toLocaleString('vi-VN')} req/s`)} />
          <Lane run={open} t={now} mode="open" lang={lang} title={t(`Open loop (tai.js --rate, k6 arrival-rate) · ${rate}/s · ${conns} conn`, `Vòng mở (tai.js --rate, k6 arrival-rate) · ${rate}/s · ${conns} kết nối`)} />
          <div className={s.bar} style={{ margin: 0 }} data-tour="co-clocks">
            <span className={s.small}>{t('last open-loop request:', 'yêu cầu vòng mở gần nhất:')}</span>
            <span className={cx(c.clock, lastOpen && lastOpen.done - lastOpen.intended > 20 && c.clockBad)}>⏱ {t('from intended', 'từ lúc dự định')} {lastOpen ? f1(lastOpen.done - lastOpen.intended) : '—'} ms</span>
            <span className={c.clock}>⏱ {t('from actual send', 'từ lúc gửi thật')} {lastOpen ? f1(lastOpen.done - lastOpen.sent) : '—'} ms</span>
          </div>
        </div>
        <div className={s.stack} style={{ gap: 8 }}>
          <div className={s.panel} data-tour="co-table">
            <div className={s.panelTitle}>{t(`Model, live up to ${(now / 1000).toFixed(2)} s (ms)`, `Mô hình, tính tới ${(now / 1000).toFixed(2)} s (ms)`)}</div>
            <div className={s.scrollX}>
              <table className={cx(s.tbl, s.compact, c.pctTbl)}>
                <thead><tr><th /><th className={s.num}>n</th><th className={s.num}>p50</th><th className={s.num}>p95</th><th className={s.num}>p99</th><th className={s.num}>max</th></tr></thead>
                <tbody>
                  {row(t('closed', 'vòng kín'), liveC.fromSent, true, 'c')}
                  {fix && liveFix && row(t('closed + wrk fix', 'vòng kín + sửa wrk'), liveFix, true, 'f')}
                  {row(t('open, from intended', 'mở, từ lúc dự định'), liveO.fromIntended, true, 'oi')}
                  {row(t('open, from send', 'mở, từ lúc gửi'), liveO.fromSent, true, 'os')}
                </tbody>
              </table>
            </div>
          </div>
          <div className={s.panel}>
            <div className={s.panelTitle}>{t('Measured in the lab (c156, ms)', 'Đo thật trong lab (c156, ms)')}</div>
            <table className={cx(s.tbl, s.compact, c.pctTbl)}>
              <thead><tr><th /><th className={s.num}>p50</th><th className={s.num}>p99</th></tr></thead>
              <tbody>
                <tr><td>tai.js --closed 1</td><td className={s.num}>{C156.closed.p50}</td><td className={s.num}>{C156.closed.p99}</td></tr>
                <tr><td>hey -c 1</td><td className={s.num}>{C156.hey.p50}</td><td className={s.num}>{C156.hey.p99}</td></tr>
                <tr><td>{t('open 100/s, 1 conn, from intended', 'mở 100/s, 1 kết nối, từ dự định')}</td><td className={s.num}>{C156.open1Intended.p50}</td><td className={c.hot}>{C156.open1Intended.p99}</td></tr>
                <tr><td>{t('… from actual send', '… từ lúc gửi thật')}</td><td className={s.num}>{C156.open1Sent.p50}</td><td className={s.num}>{C156.open1Sent.p99}</td></tr>
                <tr><td>wrk -c1 ({t('corrected', 'đã sửa')})</td><td className={s.num}>{C156.wrk.p50}</td><td className={c.hot}>{C156.wrk.p99}</td></tr>
                <tr><td>k6 constant-arrival-rate</td><td className={s.num}>{C156.k6.p50.toFixed(2)}</td><td className={c.hot}>{C156.k6.p99}</td></tr>
              </tbody>
            </table>
            <div className={s.small} style={{ marginTop: 4 }}>{t('The lab’s "from actual send" p99 is 6.4 ms, not 0.1: real clients add timer and catch-up jitter the model leaves out.', '"Từ lúc gửi thật" ở lab có p99 6,4 ms chứ không phải 0,1: khách thật có thêm độ lệch hẹn giờ và lúc đuổi kịp mà mô hình bỏ qua.')}</div>
          </div>
          <div className={s.kpis}>
            <Kpi k={t('closed p99', 'p99 vòng kín')} v={`${f1(liveC.fromSent.p99)} ms`} tone="ok" />
            <Kpi k={t('real p99', 'p99 thật')} v={`${f1(liveO.fromIntended.p99)} ms`} tone={liveO.fromIntended.p99 > 50 ? 'bad' : undefined} />
          </div>
          <WhereBox focus="load-test" lang={lang} height={170} />
        </div>
      </div>
    </Frame>
  );
}
