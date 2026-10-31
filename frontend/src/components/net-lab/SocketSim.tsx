'use client';
/**
 * Socket & cổng: gói này của ai?
 *   demux     — một socket nghe 0.0.0.0:80 + nhiều kết nối ESTAB cùng cổng 80, ghép theo bộ 4; bảng `ss -tan` sống; tự gửi thử
 *   bind      — nghe 127.0.0.1 / 0.0.0.0 / 10.10.2.20 :3000 — ai vào được, ai bị RST (lỗi kinh điển "chạy trên máy tôi mà")
 *   ephemeral — cạn cổng tạm khi mở kết nối ngắn không có pool (TÍNH RA từ mặc định của nhân)
 * Engine: engine/socket.ts.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  C2, CALLERS, EPH, EPH_MAX_RATE, EPH_PORTS, TAB1, TAB2, bindResult, demuxScript, ephemeralAt, lookup, ssLines,
  type BindAddr, type Lookup, type Seg as TcpSeg,
} from './engine/socket';
import { Controls, Explain, Frame, Kpi, Seg, css as s, cx, tx, usePlayer, type Lang } from '../os-lab/ui';
import { WhereBox } from '../os-lab/where';
import { useLabBridge, useOwnStepSound } from '../labs/bus';
import { labSfx } from '../labs/sfx';
import n from './netlab.module.css';

type Mode = 'demux' | 'bind' | 'ephemeral';
const STRAY = '10.10.1.11:51001';
const FROMS = [TAB1, TAB2, C2, STRAY];
const TSTEP = 3; // giây mỗi bước ở kịch bản cổng tạm

export default function SocketSim({ lang = 'vi', preset = 'demux' }: { lang?: Lang; preset?: string }) {
  const t = (en: string, vi: string) => tx(lang, en, vi);
  const [mode, setMode] = useState<Mode>(['demux', 'bind', 'ephemeral'].includes(preset) ? (preset as Mode) : 'demux');
  const [bind, setBind] = useState<BindAddr>('127.0.0.1');
  const [rate, setRate] = useState(1000);
  const [pool, setPool] = useState(false);
  const [probe, setProbe] = useState<{ seg: TcpSeg; look: Lookup } | null>(null);
  const [from, setFrom] = useState(C2);
  const [kind, setKind] = useState<'SYN' | 'DATA'>('DATA');
  const [port, setPort] = useState(80);

  const demux = useMemo(() => demuxScript(), []);
  const total = mode === 'demux' ? demux.length : mode === 'bind' ? CALLERS.length + 1 : Math.round(90 / TSTEP) + 1;
  const p = usePlayer(total, mode === 'ephemeral' ? 500 : 1700);
  useOwnStepSound();

  const D = demux[Math.min(p.i, demux.length - 1)];
  const look = probe?.look ?? D.look;
  const seg = probe?.seg ?? D.seg;
  const bindStep = Math.min(p.i, CALLERS.length);
  const eph = ephemeralAt(rate, p.i * TSTEP, pool ? 10 : 0);
  const prevFail = useRef(false);

  const prev = useRef(p.i);
  useEffect(() => {
    if (p.i !== prev.current) {
      if (p.i > prev.current) {
        if (mode === 'demux') labSfx(D.sfx ?? 'tick');
        else if (mode === 'bind') { if (p.i >= 1) labSfx(bindResult(bind, CALLERS[p.i - 1].id).ok ? 'hit' : 'oops'); }
        else if (eph.failing && !prevFail.current) labSfx('thud');
        else labSfx('tick');
      }
      prev.current = p.i;
      setProbe(null);
    }
    prevFail.current = eph.failing;
  }, [p.i]); // eslint-disable-line react-hooks/exhaustive-deps

  const switchMode = (m: Mode) => { setMode(m); setProbe(null); p.reset(); labSfx('tap'); };
  const doProbe = (src: string, flags: 'SYN' | 'DATA', dport: number) => {
    const sg: TcpSeg = { src, dst: `10.10.2.10:${dport}`, flags, len: flags === 'DATA' ? 20 : 0 };
    const lk = lookup(D.socks, sg);
    setProbe({ seg: sg, look: lk });
    labSfx(lk.via === 'rst' ? 'oops' : lk.via === 'listener' ? 'pop' : 'hit');
  };
  const setBindX = (v: BindAddr) => { setBind(v); p.reset(); labSfx('tap'); };
  const okCount = CALLERS.filter((c) => bindResult(bind, c.id).ok).length;

  useLabBridge('sock', {
    mode, i: p.i, atEnd: p.atEnd, via: look?.via ?? '', segFlags: seg?.flags ?? '', hitPeer: look?.hit !== undefined ? D.socks.find((k) => k.id === look.hit)?.peer ?? '' : '',
    probeVia: probe?.look.via ?? '', probeSrc: probe?.seg.src ?? '', probePort: probe ? Number(probe.seg.dst.split(':')[1]) : -1, estab: D.socks.filter((k) => k.state === 'ESTAB').length,
    bind, okCount, rate, pool, failing: eph.failing, inUse: eph.inUse,
  }, {
    mode: (v) => switchMode(String(v) as Mode),
    probe: (v) => { const [src, fl, pt] = String(v).split('|'); doProbe(src, fl === 'SYN' ? 'SYN' : 'DATA', Number(pt || 80)); },
    bind: (v) => setBindX(String(v) as BindAddr),
    rate: (v) => { setRate(Number(v)); p.reset(); },
    pool: (v) => { setPool(!!v); p.reset(); labSfx(v ? 'on' : 'off'); },
  });

  // ── demux ──
  const ss = ssLines(D.socks);
  const hitId = look?.hit;
  const prevIds = new Set((demux[p.i - 1]?.socks ?? []).map((k) => `${k.id}:${k.state}`));
  const demuxView = (
    <>
      <div className={n.cols}>
        <div className={s.stack} style={{ gap: 8 }}>
          <div className={n.box} data-tour="sk-proc">
            <div className={n.boxHead}>🖥️ web <code>10.10.2.10</code> · nginx {t('file descriptors', 'file descriptor')}</div>
            <div className={n.fds}>
              {D.socks.filter((k) => k.fd !== undefined).map((k) => <span key={k.id} className={cx(n.fd, !(demux[p.i - 1]?.socks.find((x) => x.id === k.id)?.fd) && p.i > 0 && n.fdNew)}>fd {k.fd} → {k.state === 'LISTEN' ? 'LISTEN :80' : k.peer}</span>)}
            </div>
          </div>
          <div data-tour="sk-ss">
            <div className={s.panelTitle}>ss -tan <span className={s.small}>({t('kernel socket table', 'bảng socket của nhân')})</span></div>
            <div className={n.ss}>
              <div className={n.ssHead}>{ss[0]}</div>
              {D.socks.map((k, j) => <div key={k.id} className={cx(hitId === k.id && n.ssHit, !prevIds.has(`${k.id}:${k.state}`) && p.i > 0 && n.ssNew)}>{ss[j + 1]}{k.acceptQ ? t('   ← in accept queue', '   ← trong hàng accept') : ''}</div>)}
            </div>
          </div>
          <WhereBox focus="socket" lang={lang} height={190} />
        </div>
        <div className={s.stack} style={{ gap: 8 }}>
          <div className={s.panel} data-tour="sk-match">
            <div className={s.panelTitle}>{probe ? t('Your segment', 'Đoạn bạn gửi') : t('Arriving segment', 'Đoạn vừa tới')}</div>
            {seg ? (
              <>
                <div className={n.tuple}><span>TCP</span><span className={n.tSrc}>{seg.src.split(':')[0]}</span><span className={n.tPortK}>:{seg.src.split(':')[1]}</span>→<span className={n.tSrc}>{seg.dst.split(':')[0]}</span><span className={n.tPortK}>:{seg.dst.split(':')[1]}</span><span>{seg.flags}{seg.len ? ` ${seg.len} B` : ''}</span></div>
                <div className={s.scrollX} style={{ marginTop: 6 }}>
                  <table className={n.match}>
                    <thead><tr><th>socket</th><th>{t('src IP', 'IP nguồn')}</th><th>{t('src port', 'cổng nguồn')}</th><th>{t('dst IP', 'IP đích')}</th><th>{t('dst port', 'cổng đích')}</th></tr></thead>
                    <tbody>
                      {look!.cells.map((c) => {
                        const k = D.socks.find((x) => x.id === c.id)!;
                        const L = k.state === 'LISTEN';
                        const m = (v: boolean, any = false) => any ? <span className={s.small}>*</span> : v ? <span className={n.y}>✓</span> : <span className={n.n}>✗</span>;
                        return (
                          <tr key={c.id} className={cx(look!.hit === c.id && n.mHit, look!.via === 'established' && L && n.mSkip)}>
                            <td>{L ? `LISTEN ${k.local}` : `${k.state} ${k.peer}`}</td>
                            <td>{m(c.cell.srcIp, L)}</td><td>{m(c.cell.srcPort, L)}</td><td>{m(c.cell.dstIp)}</td><td>{m(c.cell.dstPort)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className={cx(n.verdict, look!.via === 'rst' ? n.vBad : look!.via === 'listener' ? n.vNew : n.vOk)} style={{ marginTop: 6 }}>
                  {look!.via === 'rst' ? '⛔ RST' : look!.via === 'listener' ? t('➕ to the listening socket', '➕ vào socket nghe') : `✅ ${t('to', 'tới')} ${D.socks.find((k) => k.id === look!.hit)?.peer}`}
                  <span style={{ fontWeight: 600, fontSize: 12 }}>{t(look!.why[0], look!.why[1])}</span>
                </div>
              </>
            ) : <span className={s.empty}>{t('(no segment in this step — press Step)', '(bước này không có đoạn nào — bấm Bước)')}</span>}
          </div>
          <div className={s.panel} data-tour="sk-try">
            <div className={s.panelTitle}>{t('Try it: send your own segment to 10.10.2.10', 'Tự thử: gửi một đoạn của bạn tới 10.10.2.10')}</div>
            <div className={s.bar} style={{ margin: 0 }}>
              <label className={s.lbl}>{t('from', 'từ')} <select value={from} onChange={(e) => setFrom(e.target.value)}>{FROMS.map((f) => <option key={f} value={f}>{f}{f === STRAY ? t(' (no connection)', ' (chưa kết nối)') : ''}</option>)}</select></label>
              <Seg value={kind} options={[['SYN', 'SYN'], ['DATA', t('data', 'dữ liệu')]]} onChange={(v) => setKind(v)} />
              <Seg label={t('port', 'cổng')} value={port} options={[[80, '80'], [81, '81']]} onChange={(v) => setPort(v)} />
              <button type="button" className={cx(s.btn, s.primary)} onClick={() => doProbe(from, kind, port)}>{t('Send', 'Gửi')}</button>
            </div>
            <div className={n.note} style={{ marginTop: 4 }}>{t('Matched against the sockets of the current step. A port = a number that picks one program’s socket inside a machine.', 'Được so với các socket ở bước hiện tại. Cổng = con số chọn socket của một chương trình trong một máy.')}</div>
          </div>
        </div>
      </div>
    </>
  );

  // ── bind ──
  const caller = bindStep > 0 ? CALLERS[bindStep - 1] : null;
  const res = caller ? bindResult(bind, caller.id) : null;
  const bindView = (
    <div className={n.cols}>
      <div className={s.stack} style={{ gap: 8 }}>
        <div className={s.bar} data-tour="sk-bind" style={{ margin: 0 }}>
          <Seg label={t('the app listens on', 'ứng dụng nghe ở')} value={bind} options={[['127.0.0.1', '127.0.0.1'], ['0.0.0.0', '0.0.0.0'], ['10.10.2.20', '10.10.2.20']]} onChange={setBindX} />
        </div>
        <div className={n.box}>
          <div className={n.boxHead}>📦 api container <code>10.10.2.20</code> · Node</div>
          <div className={n.term} style={{ marginBottom: 6 }}>
            <div>app.listen(3000, &apos;{bind}&apos;)</div>
            <div className={n.termEcho}># ss -ltn</div>
            <div className={n.termOn}>{`LISTEN 0      511    ${bind}:3000      0.0.0.0:*`}</div>
          </div>
          <div className={n.ifaces} data-tour="sk-ifaces">
            {[['lo', '127.0.0.1', t('loopback: never leaves the machine', 'loopback: không bao giờ rời khỏi máy')], ['eth0', '10.10.2.20', t('the card on the network', 'card nối ra mạng')]].map(([nm, ip, d]) => {
              const on = bind === '0.0.0.0' || bind === ip;
              return <div key={nm} className={cx(n.iface, on ? n.ifaceOn : n.ifaceOff)}><b>{nm}</b> <code>{ip}</code><span className={s.small}>{d}</span><div className={s.small} style={{ fontWeight: 800 }}>{on ? t('✓ socket listens here', '✓ socket nghe ở đây') : t('✗ nobody listens on :3000', '✗ không ai nghe :3000')}</div></div>;
            })}
          </div>
          <div className={n.note} style={{ marginTop: 6 }}>{t('0.0.0.0 = “every address this machine has”. 127.0.0.1 = loopback only. Node’s default backlog is 511.', '0.0.0.0 = “mọi địa chỉ máy này có”. 127.0.0.1 = chỉ loopback. backlog mặc định của Node là 511.')}</div>
        </div>
        <WhereBox focus={caller?.id === 'host' || caller?.id === 'web' ? 'nic-frame' : 'socket'} lang={lang} height={180} />
      </div>
      <div className={s.stack} style={{ gap: 8 }}>
        <div className={n.callers} data-tour="sk-callers">
          {CALLERS.map((c, k) => {
            const r = bindResult(bind, c.id);
            const shown = k < bindStep;
            return (
              <div key={c.id} className={cx(n.caller, k === bindStep - 1 && n.callerOn, !shown && n.callerFuture, shown && (r.ok ? n.callerOk : n.callerBad))} data-tour={c.id === 'host' ? 'sk-host' : undefined}>
                <span aria-hidden style={{ fontSize: 16 }}>{shown ? (r.ok ? '✅' : '⛔') : '⏳'}</span>
                <span><b>{t(c.who[0], c.who[1])}</b><br /><code>{c.cmd}</code> <span className={s.small}>· {t('arrives on', 'tới qua')} {c.iface}</span>{shown && <><br /><code className={r.ok ? n.right : n.wrong}>{r.msg}</code></>}</span>
              </div>
            );
          })}
        </div>
        <div className={s.kpis}><Kpi k={t('callers that get in', 'số nơi vào được')} v={`${okCount}/4`} tone={okCount === 4 ? 'ok' : 'bad'} /></div>
        <div className={n.note}><span className={cx(n.src, n.srcCalc)}>{t('typical messages', 'thông báo thường gặp')}</span> {t('The exact curl text varies by version and by Docker’s proxy mode.', 'Chữ chính xác của curl khác nhau theo phiên bản và chế độ proxy của Docker.')}</div>
      </div>
    </div>
  );

  // ── ephemeral ──
  const used = (100 * eph.inUse) / EPH_PORTS;
  const ephView = (
    <div className={n.cols}>
      <div className={s.stack} style={{ gap: 8 }}>
        <div className={n.slider} data-tour="sk-rate">
          {t('new connections / s to db:5432', 'kết nối mới / s tới db:5432')} <input type="range" min={50} max={2000} step={10} value={rate} onChange={(e) => { setRate(Number(e.target.value)); p.reset(); }} aria-label={t('requests per second', 'request mỗi giây')} /> <b>{rate}/s</b>
        </div>
        <div className={s.bar} style={{ margin: 0 }} data-tour="sk-pool">
          <Seg label={t('connection pool', 'pool kết nối')} value={pool ? 'on' : 'off'} options={[['off', t('none (new connection per query)', 'không (mỗi truy vấn một kết nối)')], ['on', t('10 kept-alive connections', '10 kết nối giữ sống')]]} onChange={(v) => { setPool(v === 'on'); p.reset(); labSfx('tap'); }} />
        </div>
        <div data-tour="sk-ports">
          <div className={s.panelTitle}>{t('Ephemeral ports 32768–60999 toward ONE destination ip:port', 'Cổng tạm 32768–60999 tới MỘT ip:port đích')} · t = {eph.t} s</div>
          <div className={n.ports}>
            <span style={{ width: `${used}%`, background: eph.failing ? 'var(--ol-bad)' : 'var(--ol-warn)' }}>{used > 12 ? `${eph.inUse.toLocaleString()} ${pool ? t('in use', 'đang dùng') : 'TIME_WAIT'}` : ''}</span>
            <span style={{ width: `${100 - used}%`, background: 'var(--ol-ok)' }}>{100 - used > 12 ? `${eph.free.toLocaleString()} ${t('free', 'trống')}` : ''}</span>
          </div>
        </div>
        <div className={s.kpis}>
          <Kpi k={t('ports in the range', 'số cổng trong dải')} v={EPH_PORTS.toLocaleString()} />
          <Kpi k={t('ceiling (one destination)', 'trần (một đích)')} v={`≈ ${Math.floor(EPH_MAX_RATE)}/s`} />
          <Kpi k={t('runs out after', 'cạn sau')} v={pool ? t('never', 'không bao giờ') : eph.exhaustAt ? `${eph.exhaustAt.toFixed(1)} s` : t('never', 'không bao giờ')} tone={!pool && eph.exhaustAt ? 'bad' : 'ok'} />
        </div>
        <div className={n.term}>
          <div className={n.termEcho}>$ ss -tan state time-wait dst db:5432 | wc -l</div>
          <div>{pool ? 0 : eph.inUse}</div>
          {eph.failing && <div style={{ color: '#ff7b72', fontWeight: 700 }}>connect(…) = -1 EADDRNOTAVAIL (Cannot assign requested address)</div>}
          {pool && <div className={n.termEcho}># {t('10 sockets stay ESTAB and are reused — no new ports', '10 socket luôn ESTAB và được dùng lại — không tốn cổng mới')}</div>}
        </div>
      </div>
      <div className={s.stack} style={{ gap: 8 }}>
        <div className={n.note}><span className={cx(n.src, n.srcCalc)}>{t('computed from kernel defaults', 'tính từ mặc định của nhân')}</span> {t(`net.ipv4.ip_local_port_range = 32768 60999 (${EPH_PORTS.toLocaleString()} ports). The side that closes first keeps the connection in TIME_WAIT for ${EPH.timeWaitS} s, holding its port. ${EPH_PORTS.toLocaleString()} ÷ ${EPH.timeWaitS} ≈ ${Math.floor(EPH_MAX_RATE)} new connections per second to the SAME ip:port — beyond that, connect() fails. A different destination (another DB replica) has its own ${EPH_PORTS.toLocaleString()}. Linux may reuse TIME_WAIT ports for new outgoing connections only with net.ipv4.tcp_tw_reuse (default 2 = loopback only).`,
          `net.ipv4.ip_local_port_range = 32768 60999 (${EPH_PORTS.toLocaleString()} cổng). Bên đóng trước giữ kết nối ở TIME_WAIT ${EPH.timeWaitS} s, giữ luôn cổng của nó. ${EPH_PORTS.toLocaleString()} ÷ ${EPH.timeWaitS} ≈ ${Math.floor(EPH_MAX_RATE)} kết nối mới mỗi giây tới CÙNG một ip:port — quá mức đó connect() hỏng. Một đích khác (bản sao DB khác) có ${EPH_PORTS.toLocaleString()} cổng riêng. Linux chỉ dùng lại cổng TIME_WAIT cho kết nối ra ngoài khi bật net.ipv4.tcp_tw_reuse (mặc định 2 = chỉ loopback).`)}</div>
        <WhereBox focus="socket" lang={lang} height={190} />
      </div>
    </div>
  );

  const explain = mode === 'demux'
    ? <Explain tone={probe ? (probe.look.via === 'rst' ? 'bad' : 'ok') : D.tone}><b className={s.mono}>{probe ? `${probe.seg.flags} ${probe.seg.src} → ${probe.seg.dst}` : D.call}</b> — {probe ? t(probe.look.why[0], probe.look.why[1]) : t(D.en, D.vi)}</Explain>
    : mode === 'bind'
      ? <Explain tone={res ? (res.ok ? 'ok' : 'bad') : undefined}>{caller && res ? <><b className={s.mono}>{caller.cmd}</b> — {t(res.en, res.vi)}</> : t(`The API listens on ${bind}:3000. Press Step: four different callers try to connect, each arriving through a different door of the container.`, `API nghe ở ${bind}:3000. Bấm Bước: bốn nơi khác nhau thử kết nối, mỗi nơi đi vào container qua một cửa khác.`)}</Explain>
      : <Explain tone={eph.failing ? 'bad' : pool ? 'ok' : eph.inUse > EPH_PORTS * 0.8 ? 'warn' : undefined}>{eph.failing
        ? t(`t = ${eph.t} s: every ephemeral port toward db:5432 is sitting in TIME_WAIT. connect() fails with EADDRNOTAVAIL — the API returns 500s while the database is perfectly healthy.`, `t = ${eph.t} s: mọi cổng tạm tới db:5432 đều đang nằm TIME_WAIT. connect() hỏng với EADDRNOTAVAIL — API trả 500 trong khi CSDL hoàn toàn khoẻ.`)
        : pool ? t('With a pool, the same 10 connections carry every query: no handshake per query, no TIME_WAIT pile-up. This is what keep-alive / a DB pool buys you.', 'Có pool, đúng 10 kết nối đó chở mọi truy vấn: không bắt tay cho từng truy vấn, không dồn TIME_WAIT. Đó là thứ keep-alive / pool CSDL mang lại.')
          : t(`t = ${eph.t} s: ${rate} short connections per second, each closed connection keeps its port for ${EPH.timeWaitS} s.`, `t = ${eph.t} s: ${rate} kết nối ngắn mỗi giây, mỗi kết nối đã đóng giữ cổng của nó ${EPH.timeWaitS} s.`)}</Explain>;

  return (
    <Frame badge={t('Network lab', 'Phòng lab mạng')} title={t('Sockets & ports: who gets this packet?', 'Socket & cổng: gói này của ai?')}
      sub={t('Inside the web server’s kernel: many connections, one port 80', 'Bên trong nhân của máy web: nhiều kết nối, một cổng 80')}>
      <div className={n.nl}>
        <div className={s.bar} data-tour="sk-mode">
          <Seg label={t('Scenario', 'Kịch bản')} value={mode} options={[['demux', t('many clients, port 80', 'nhiều khách, cổng 80')], ['bind', t('bind & Docker', 'bind & Docker')], ['ephemeral', t('running out of ports', 'cạn cổng')]]} onChange={switchMode} />
        </div>
        <Controls p={p} lang={lang} label={mode === 'ephemeral' ? `t = ${eph.t} s` : `${t('step', 'bước')} ${p.i + 1}/${p.total}`} />
        {explain}
        {mode === 'demux' ? demuxView : mode === 'bind' ? bindView : ephView}
      </div>
    </Frame>
  );
}
