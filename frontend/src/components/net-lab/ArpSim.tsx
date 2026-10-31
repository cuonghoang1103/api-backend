'use client';
/**
 * ARP: từ IP ra MAC trên một mạng LAN (cầu Docker = công tắc ảo) — client, client2, router.
 *   lan     — ping hàng xóm với bộ đệm trống: hỏi phát rộng → công tắc học cổng + phát tràn → trả lời gửi thẳng → REACHABLE
 *   gateway — ping máy ở mạng khác: ARP hỏi ROUTER; MAC đích = router, IP đích = web (dòng tcpdump THẬT)
 *   stale   — máy mới cùng IP, MAC mới: REACHABLE → STALE → DELAY → PROBE → FAILED, hay gratuitous ARP (mặc định nhân, TÍNH RA)
 * Engine: engine/arp.ts.
 */
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { ARP_LINES, MAC } from './engine/capture';
import { BCAST, NUD_DEFAULTS, arpScript, type ArpStep, type HostId, type Nud, type WireFrame } from './engine/arp';
import { Controls, Explain, Frame, Seg, css as s, cx, tx, usePlayer, type Lang } from '../os-lab/ui';
import { WhereBox } from '../os-lab/where';
import { useLabBridge, useOwnStepSound } from '../labs/bus';
import { labSfx } from '../labs/sfx';
import n from './netlab.module.css';

type Preset = 'lan' | 'gateway' | 'stale';
const KIND_COLOR: Record<WireFrame['kind'], string> = { 'arp-req': '#d97706', 'arp-rep': '#16a34a', icmp: '#2563eb', garp: '#7c3aed', probe: '#db2777' };
const KIND_NAME: Record<WireFrame['kind'], [string, string]> = {
  'arp-req': ['ARP request (broadcast)', 'Hỏi ARP (phát rộng)'], 'arp-rep': ['ARP reply (unicast)', 'Trả lời ARP (gửi thẳng)'],
  icmp: ['IP packet (ICMP ping)', 'Gói IP (ICMP ping)'], garp: ['gratuitous ARP (broadcast)', 'gratuitous ARP (phát rộng)'], probe: ['ARP probe (unicast)', 'Dò ARP (gửi thẳng)'],
};
const NUD_COLOR: Record<Nud, string> = { REACHABLE: '#15803d', STALE: '#a16207', DELAY: '#c2410c', PROBE: '#dc2626', FAILED: '#7f1d1d', INCOMPLETE: '#64748b' };
const macName = (m: string, lang: Lang) => m === BCAST ? tx(lang, 'everyone', 'mọi người') : m === MAC.client ? 'client' : m === MAC.client2 ? 'client2' : m === MAC.routerLan ? 'router' : tx(lang, 'new client2', 'client2 mới');

// toạ độ sơ đồ (viewBox 400 × 250)
const POS: Record<number, { x: number; y: number }> = { 1: { x: 66, y: 125 }, 2: { x: 334, y: 46 }, 3: { x: 334, y: 204 } };
const SW = { x: 200, y: 125 };
const PORT_XY: Record<number, { x: number; y: number }> = { 1: { x: SW.x - 62, y: SW.y }, 2: { x: SW.x + 62, y: SW.y - 20 }, 3: { x: SW.x + 62, y: SW.y + 20 } };

export default function ArpSim({ lang = 'vi', preset = 'lan' }: { lang?: Lang; preset?: string }) {
  const t = (en: string, vi: string) => tx(lang, en, vi);
  const [pre, setPre] = useState<Preset>(['lan', 'gateway', 'stale'].includes(preset) ? (preset as Preset) : 'lan');
  const [garp, setGarp] = useState(false);
  const steps = useMemo(() => arpScript(pre, garp), [pre, garp]);
  const p = usePlayer(steps.length, 1800);
  const S: ArpStep = steps[Math.min(p.i, steps.length - 1)];
  useOwnStepSound();
  const prev = useRef(p.i);
  useEffect(() => { if (p.i !== prev.current) { if (p.i > prev.current) labSfx(S.sfx ?? 'tick'); prev.current = p.i; } }, [p.i, S]);
  const load = (k: Preset) => { setPre(k); p.reset(); labSfx('tap'); };
  const setG = (v: boolean) => { setGarp(v); p.reset(); labSfx(v ? 'on' : 'off'); };

  const client = S.hosts.find((h) => h.id === 'client')!;
  const targetIp = pre === 'gateway' ? '10.10.1.254' : '10.10.1.11';
  const entry = client.cache.find((c) => c.ip === targetIp);
  useLabBridge('arp', {
    preset: pre, i: p.i, atEnd: p.atEnd, garp, kind: S.frame?.kind ?? '', dstMac: S.frame?.dstMac ?? '', ipDst: S.frame?.ipDst ?? '',
    state: entry?.state ?? '', mac: entry?.mac ?? '', t: S.t ?? -1, fdb: S.fdb.length,
  }, { preset: (v) => load(String(v) as Preset), garp: (v) => setG(!!v) });


  // ── sơ đồ ──
  const F = S.frame;
  const fromPort = F ? S.hosts.find((h) => h.id === F.from)!.port : 0;
  const kc = F ? KIND_COLOR[F.kind] : 'transparent';
  const hostAt = (port: number) => S.hosts.filter((h) => h.port === port).sort((a, b) => Number(!!a.gone) - Number(!!b.gone))[0];
  const topo = (
    <svg className={n.topo} viewBox="0 0 400 262" role="img" style={{ '--k': kc } as CSSProperties}
      aria-label={F ? `${t(KIND_NAME[F.kind][0], KIND_NAME[F.kind][1])}: ${macName(F.srcMac, lang)} → ${macName(F.dstMac, lang)}` : t('network diagram', 'sơ đồ mạng')}>
      {[1, 2, 3].map((port) => {
        const a = POS[port], b = PORT_XY[port];
        const on = F && (port === fromPort || F.to.includes(port));
        const drop = F?.dropped?.includes(port);
        return (
          <g key={port}>
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} className={n.tLink} />
            {on && <line x1={port === fromPort ? a.x : b.x} y1={port === fromPort ? a.y : b.y} x2={port === fromPort ? b.x : a.x} y2={port === fromPort ? b.y : a.y} className={cx(n.tLink, drop ? n.tLinkDrop : n.tLinkOn)} />}
          </g>
        );
      })}
      <rect x={SW.x - 62} y={SW.y - 34} width={124} height={68} rx={12} className={cx(n.tBox, S.focus === 'switch' && n.tBoxOn)} />
      <text x={SW.x} y={SW.y - 6} textAnchor="middle" className={n.tName}>🔌 {t('switch', 'công tắc')}</text>
      <text x={SW.x} y={SW.y + 12} textAnchor="middle" className={n.tSub}>docker bridge</text>
      {[1, 2, 3].map((port) => (
        <g key={port}><rect x={PORT_XY[port].x - 9} y={PORT_XY[port].y - 8} width={18} height={16} rx={4} className={n.tPort} />
          <text x={PORT_XY[port].x} y={PORT_XY[port].y + 4} textAnchor="middle" className={n.tPortTxt}>{port}</text></g>
      ))}
      {[1, 2, 3].map((port) => {
        const h = hostAt(port), a = POS[port];
        const gone = !!h.gone;
        return (
          <g key={port}>
            <rect x={a.x - 62} y={a.y - 30} width={124} height={60} rx={11} className={cx(n.tBox, S.focus === h.id && n.tBoxOn, gone && n.tBoxGone)} />
            <text x={a.x} y={a.y - 11} textAnchor="middle" className={n.tName}>{h.id === 'client' ? '💻 ' : h.id === 'router' ? '🔀 ' : '🖥️ '}{h.id === 'newbox' ? t('new client2', 'client2 mới') : h.name}</text>
            <text x={a.x} y={a.y + 5} textAnchor="middle" className={n.tSub}>{h.ip}</text>
            <text x={a.x} y={a.y + 19} textAnchor="middle" className={n.tSub}>{h.mac}</text>
            {F?.dropped?.includes(port) && <text x={a.x + 56} y={a.y - 18} textAnchor="middle" fontSize="18" fill="var(--ol-bad)">✕</text>}
            {F && F.to.includes(port) && !F.dropped?.includes(port) && <text x={a.x + 56} y={a.y - 18} textAnchor="middle" fontSize="16">📩</text>}
          </g>
        );
      })}
      {pre === 'gateway' && <text x={334} y={254} textAnchor="middle" className={n.tSub}>eth1 → 10.10.2.0/24</text>}
      {F && (
        <g>
          <rect x={SW.x - 96} y={6} width={192} height={22} rx={11} className={n.tPill} />
          <text x={SW.x} y={21} textAnchor="middle" className={n.tPillTxt}>{t(KIND_NAME[F.kind][0], KIND_NAME[F.kind][1])}</text>
        </g>
      )}
    </svg>
  );

  // ── frame đang chạy ──
  const frameCard = F && (
    <dl className={n.frameCard} style={{ '--k': kc } as CSSProperties} data-tour="arp-frame">
      <dt>{t('dst MAC', 'MAC đích')}</dt><dd className={F.dstMac === BCAST ? n.big : undefined}>{F.dstMac} <span className={s.small}>({macName(F.dstMac, lang)}{F.kind === 'icmp' ? t(' — next hop', ' — chặng kế tiếp') : ''})</span></dd>
      <dt>{t('src MAC', 'MAC nguồn')}</dt><dd>{F.srcMac} <span className={s.small}>({macName(F.srcMac, lang)})</span></dd>
      {F.ipDst && <><dt>{t('IP', 'IP')}</dt><dd className={n.big}>{F.ipSrc} → {F.ipDst} <span className={s.small}>{t('(final destination)', '(đích cuối cùng)')}</span></dd></>}
      <dt>{t('says', 'nội dung')}</dt><dd>{F.label}</dd>
    </dl>
  );

  // ── dòng tcpdump ──
  const seen = Array.from(new Set(steps.slice(0, p.i + 1).flatMap((x) => x.lines))).sort((a, b) => a - b);
  const echo = new Set(steps.flatMap((x) => x.echoLines ?? []));
  const tcpdump = pre !== 'stale' && (
    <div data-tour="arp-tcpdump">
      <div className={s.panelTitle} style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>tcpdump -e -n <span className={cx(n.src, n.srcReal)}>{t('real capture', 'capture thật')}</span></div>
      <div className={n.term}>
        {seen.length === 0 && <div className={n.termEcho}>{t('(nothing on the wire yet)', '(chưa có gì trên dây)')}</div>}
        {seen.map((k) => (
          <div key={k} className={cx(S.lines.includes(k) && n.termOn, echo.has(k) && n.termEcho)}>
            {ARP_LINES[k].replace(', ethertype', ',').replace(/, length 28$/, '')}
            {echo.has(k) && <span className={n.termTag}>↩ {t('your own broadcast echoed back by the virtual switch (seen as inbound with tcpdump -Q in) — a quirk of Docker Desktop’s bridge, not a second request', 'chính lời phát rộng của bạn bị công tắc ảo vọng lại (thấy là gói ĐẾN với tcpdump -Q in) — tật của cầu Docker Desktop, không phải câu hỏi thứ hai')}</span>}
          </div>
        ))}
        {S.computed && pre === 'gateway' && <><div className={n.termEcho}># ip neigh</div>{S.computed.map((l) => <div key={l} className={n.termOn}>{l}</div>)}</>}
      </div>
    </div>
  );

  // ── stale: dòng thời gian trạng thái ──
  const timeline = pre === 'stale' && (() => {
    const pts = steps.map((x) => ({ t: x.t ?? 0, st: x.hosts.find((h) => h.id === 'client')!.cache[0]?.state ?? 'INCOMPLETE' }));
    const end = Math.max(50, pts[pts.length - 1].t + 2);
    const segs: Array<{ a: number; b: number; st: Nud }> = [];
    pts.forEach((x, k) => {
      const b = k + 1 < pts.length ? pts[k + 1].t : end;
      if (b > x.t) { const last = segs[segs.length - 1]; if (last && last.st === x.st) last.b = b; else segs.push({ a: x.t, b, st: x.st as Nud }); }
    });
    return (
      <div data-tour="arp-timeline">
        <div className={s.panelTitle} style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>{t('Linux neighbour state of 10.10.1.11, over time', 'Trạng thái hàng xóm 10.10.1.11 trong Linux, theo thời gian')} <span className={cx(n.src, n.srcCalc)}>{t('computed from kernel defaults', 'tính từ mặc định của nhân')}</span></div>
        <div className={n.tl}>
          {segs.map((g, k) => <span key={k} style={{ width: `${(100 * (g.b - g.a)) / end}%`, background: NUD_COLOR[g.st] }} title={`${g.st} ${g.a}–${g.b} s`}>{g.b - g.a >= 4 ? g.st : ''}</span>)}
          <i className={n.tlNow} style={{ left: `calc(${(100 * (S.t ?? 0)) / end}% - 1px)` }} />
        </div>
        <div className={n.tlAxis} style={{ position: 'relative', height: 12 }}>{[0, 10, 20, 30, 40, 50].filter((x) => x <= end).map((x) => <span key={x} style={{ position: 'absolute', left: `${(100 * x) / end}%`, transform: x ? 'translateX(-50%)' : undefined }}>{x} s</span>)}</div>
        <div className={n.note} style={{ marginTop: 4 }}>base_reachable_time {NUD_DEFAULTS.baseReachableS} s ({t('random', 'ngẫu nhiên')} {NUD_DEFAULTS.minS}–{NUD_DEFAULTS.maxS} s) · delay_first_probe_time {NUD_DEFAULTS.delayFirstProbeS} s · retrans_time {NUD_DEFAULTS.retransS} s · ucast_solicit {NUD_DEFAULTS.ucastSolicit} · {t('bridge MAC ageing', 'tuổi MAC của cầu')} {NUD_DEFAULTS.bridgeAgeingS} s</div>
        {S.computed && <div className={cx(n.term, n.wrapTerm)} style={{ marginTop: 6 }}>{S.computed.map((l) => <div key={l} className={n.termCalc}>{l}</div>)}</div>}
      </div>
    );
  })();

  const hostCard = (id: HostId) => {
    const h = S.hosts.find((x) => x.id === id);
    if (!h) return null;
    return (
      <div key={id} className={cx(n.hostCard, S.focus === id && n.hostOn, h.gone && n.hostGone)}>
        <h5>{id === 'client' ? '💻' : id === 'router' ? '🔀' : '🖥️'} {id === 'newbox' ? t('new client2', 'client2 mới') : h.name} <code>ip neigh</code>{h.gone && <span className={s.small}>{t('(unplugged)', '(đã rút)')}</span>}</h5>
        {h.cache.length ? (
          <div className={n.neigh}>
            {h.cache.map((c) => (
              <span key={c.ip} style={{ display: 'contents' }}>
                <span>{c.ip}</span><span>{c.mac || '—'}</span>
                <span key={`${c.ip}-${c.state}`} className={cx(n.nud, n[`nud${c.state}`], n.nudChg)}>{c.state}</span>
              </span>
            ))}
          </div>
        ) : <span className={s.empty}>{t('(empty)', '(trống)')}</span>}
      </div>
    );
  };
  const swCard = (
    <div className={cx(n.hostCard, S.focus === 'switch' && n.hostOn)} data-tour="arp-fdb">
      <h5>🔌 {t('switch MAC table', 'bảng MAC của công tắc')} <code>bridge fdb</code></h5>
      {S.fdb.length ? <div className={n.neigh} style={{ gridTemplateColumns: 'minmax(0, 1fr) auto' }}>{S.fdb.map((x) => <span key={x.mac} style={{ display: 'contents' }}><span>{x.mac}</span><span>{t('port', 'cổng')} {x.port}</span></span>)}</div>
        : <span className={s.empty}>{t('(empty — it will learn from the first frame)', '(trống — nó sẽ học từ frame đầu tiên)')}</span>}
    </div>
  );

  return (
    <Frame badge={t('Network lab', 'Phòng lab mạng')} title={t('ARP: finding the MAC for an IP', 'ARP: tìm MAC cho một IP')}
      sub={t('Three machines on one switch (the Docker bridge of the course lab)', 'Ba máy cắm chung một công tắc (cầu Docker trong lab của khoá)')}>
      <div className={n.nl}>
        <div className={s.bar} data-tour="arp-preset">
          <Seg label={t('Scenario', 'Kịch bản')} value={pre} options={[['lan', t('neighbour', 'hàng xóm')], ['gateway', t('another network', 'mạng khác')], ['stale', t('machine replaced', 'máy bị thay')]]} onChange={load} />
          {pre === 'stale' && <span data-tour="arp-garp"><Seg label={t('new machine sends gratuitous ARP', 'máy mới gửi gratuitous ARP')} value={garp ? 'on' : 'off'} options={[['off', t('no', 'không')], ['on', t('yes', 'có')]]} onChange={(v) => setG(v === 'on')} /></span>}
        </div>
        <Controls p={p} lang={lang} label={S.t !== undefined ? `t = ${S.t} s` : `${t('step', 'bước')} ${p.i + 1}/${p.total}`} />
        <Explain tone={S.tone}><b className={s.mono}>{S.call}</b> — {t(S.en, S.vi)}</Explain>
        {S.route && <div className={n.term} data-tour="arp-route"><div className={n.termEcho}># ip route</div>{['default via 10.10.1.254 dev eth0', '10.10.1.0/24 dev eth0 proto kernel scope link src 10.10.1.10'].map((l) => <div key={l} className={l === S.route ? n.termOn : undefined}>{l}</div>)}</div>}
        <div className={n.cols}>
          <div className={s.stack} style={{ gap: 8 }}>
            <div className={s.panel} style={{ padding: 6 }} data-tour="arp-topo"><div style={{ maxWidth: 500, margin: '0 auto' }}>{topo}</div></div>
            {frameCard}
          </div>
          <div className={s.stack} style={{ gap: 8 }}>
            <div className={n.hosts} data-tour="arp-caches">
              {(['client', 'client2', 'newbox', 'router'] as HostId[]).map(hostCard)}
              {swCard}
            </div>
          </div>
        </div>
        {tcpdump}
        {timeline}
        <div className={n.cols}>
          <div className={n.note}>{t('MAC = the 6-byte hardware address of a network card, only meaningful on one local network. IP = the address across networks. ARP (Address Resolution Protocol) is the question “who has this IP? tell me your MAC”.', 'MAC = địa chỉ phần cứng 6 byte của một card mạng, chỉ có nghĩa trong một mạng cục bộ. IP = địa chỉ xuyên qua các mạng. ARP (Address Resolution Protocol) là câu hỏi “ai có IP này? cho tôi biết MAC của bạn”.')}</div>
          <WhereBox focus={S.where} lang={lang} height={180} />
        </div>
      </div>
    </Frame>
  );
}
