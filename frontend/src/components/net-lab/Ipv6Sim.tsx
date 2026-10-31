'use client';
/**
 * IPv6 (Chương 2.4).
 *   addr      — viết gọn một địa chỉ từng bước (bỏ số 0 đầu nhóm, MỘT "::" cho dãy 0 dài nhất — bằng nhau thì dãy ĐẦU), người học
 *               tự chọn dãy nhận "::"; /64 = 18446744073709551616 địa chỉ; link-local fe80:: sinh từ MAC (EUI-64); NDP thay ARP
 *   happy     — Happy Eyeballs: AAAA + A, công tắc "đường IPv6 hỏng lặng lẽ"; curl lùi về IPv4 sau ~200 ms (0.210868 s thật),
 *               Node 22 sau 324 ms (thật), Node không autoselect vẫn chờ ở 8 s (thật); nhân bỏ cuộc ~127 s (TÍNH RA)
 *   localhost — server dev nghe 127.0.0.1:5000, "localhost" = ::1 trước ⇒ ECONNREFUSED ::1:5000; phía máy chủ 0.0.0.0 vs ::
 * Engine: engine/ipv6.ts. Số liệu: engine/capture2.ts.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { V6_ADDR, V6_BREAK, V6_CALL, V6_DUAL, V6_HAPPY, V6_LISTEN, V6_LOCALHOST, V6_NDP } from './engine/capture2';
import { HE, compressView, count6, eui64, happyRows, happyScript, localhostScript, solicitedNode, synGiveUpS } from './engine/ipv6';
import { Controls, Explain, Frame, Kpi, Seg, css as s, cx, tx, usePlayer, type Lang } from '../os-lab/ui';
import { WhereBox } from '../os-lab/where';
import { useLabBridge, useOwnStepSound } from '../labs/bus';
import { labSfx } from '../labs/sfx';
import { Picks, Src, Term, type TLine } from './parts';
import n from './netlab.module.css';

type Preset = 'addr' | 'happy' | 'localhost';
const PRESETS: Preset[] = ['addr', 'happy', 'localhost'];
const SAMPLES = ['2001:0db8:000a:0050:0000:0000:0000:0010', '2001:0db8:0000:0000:0001:0000:0000:0001', 'fe80:0000:0000:0000:0000:c0ff:fea8:320a', '2001:db8:d::10'];
/** đầu vào đã chạy qua Python ipaddress trong lab ⇒ kết quả "thật" */
const REAL_IN: Record<string, string> = { '2001:0db8:000a:0050:0000:0000:0000:0010': '2001:db8:a:50::10', '2001:0db8:0000:0000:0001:0000:0000:0001': '2001:db8::1:0:0:1', '2001:db8:a:50::10': '2001:db8:a:50::10' };
const MAC = '02:00:c0:a8:32:0a';
// trục thời gian gãy khúc: 0–400 ms chiếm 60%, 400–8500 ms chiếm 40%
const pos = (ms: number) => (ms <= 400 ? (ms / 400) * 60 : 60 + ((Math.min(ms, 8500) - 400) / 8100) * 40);
const FAM_COLOR = { 6: '#7c3aed', 4: '#0e7490' } as const;

export default function Ipv6Sim({ lang = 'vi', preset = 'addr' }: { lang?: Lang; preset?: string }) {
  const t = (en: string, vi: string) => tx(lang, en, vi);
  const [pre, setPre] = useState<Preset>(PRESETS.includes(preset as Preset) ? (preset as Preset) : 'addr');
  const [addr, setAddr] = useState(SAMPLES[0]);
  const [draft, setDraft] = useState(SAMPLES[0]);
  const [pick, setPick] = useState(-1);
  const [broken, setBroken] = useState(false);

  const V = useMemo(() => compressView(addr), [addr]);
  const happy = useMemo(() => happyScript(broken), [broken]);
  const lh = useMemo(() => localhostScript(), []);
  const total = pre === 'addr' ? 7 : pre === 'happy' ? happy.length : lh.length;
  const p = usePlayer(total, 1900);
  useOwnStepSound();
  const HS = happy[Math.min(p.i, happy.length - 1)];
  const LS = lh[Math.min(p.i, lh.length - 1)];
  const prevI = useRef(p.i);
  useEffect(() => {
    if (p.i > prevI.current) labSfx(pre === 'addr' ? (p.i === 3 ? 'right' : 'blip-decode') : ((pre === 'happy' ? HS.sfx : LS.sfx) ?? 'tick'));
    prevI.current = p.i;
  }, [p.i]); // eslint-disable-line react-hooks/exhaustive-deps

  const load = (k: Preset) => { setPre(k); p.reset(); labSfx('tap'); };
  const setA = (v: string) => { setDraft(v); if (compressView(v)) { setAddr(v.trim().toLowerCase()); setPick(-1); labSfx('tap'); } };
  const pickOk = !!V?.best && pick === V.best.start;
  const doPick = (start: number) => {
    if (!V) return;
    const run = V.runs.find((r) => start >= r.start && start < r.start + r.len);
    if (!run) return;
    setPick(run.start);
    labSfx(V.best && run.start === V.best.start ? 'right' : run.len >= 2 ? 'wrong' : 'miss');
  };

  useLabBridge('ipsix', {
    preset: pre, i: p.i, atEnd: p.atEnd,
    addr, full: V?.full ?? '', result: pre === 'addr' && p.i >= 3 && V ? V.result : '', stage: pre === 'addr' ? p.i : -1, picked: pick, pickOk,
    broken, family: pre === 'happy' ? HS.family : '', connected: pre === 'happy' && HS.connected,
  }, {
    preset: (v) => load(String(v) as Preset),
    addr: (v) => setA(String(v)),
    pick: (v) => doPick(Number(v)),
    broken: (v) => { setBroken(!!v); p.reset(); labSfx(v ? 'on' : 'off'); },
  });

  // ───────── addr ─────────
  const addrView = pre === 'addr' && (() => {
    const st = p.i;
    const real = !!REAL_IN[addr];
    const E = eui64(MAC);
    const groups = V ? (st === 0 ? V.groups : V.noLead) : [];
    const inRun = (k: number) => V?.runs.find((r) => k >= r.start && k < r.start + r.len);
    const ex: Array<[string, string]> = !V ? [['Not a valid IPv6 address.', 'Không phải địa chỉ IPv6 hợp lệ.']] : [
      [`IPv6 = 128 bits, written as 8 groups of 4 hexadecimal digits (16 bits each), separated by “:”. Full form: ${V.full}. That is long — two rules make it shorter.`, `IPv6 = 128 bit, viết thành 8 nhóm, mỗi nhóm 4 chữ số hex (16 bit), cách nhau bằng “:”. Dạng đủ: ${V.full}. Dài quá — hai luật làm nó ngắn lại.`],
      ['Rule 1: drop the leading zeros of every group: 0db8 → db8, 000a → a, 0000 → 0. (Only LEADING zeros: 0050 → 50, never 5.)', 'Luật 1: bỏ các số 0 ĐỨNG ĐẦU mỗi nhóm: 0db8 → db8, 000a → a, 0000 → 0. (Chỉ số 0 đứng đầu: 0050 → 50, không bao giờ thành 5.)'],
      [V.runs.filter((r) => r.len >= 2).length > 1 ? `Rule 2: ONE run of consecutive 0 groups may be replaced by “::”. Here there are ${V.runs.filter((r) => r.len >= 2).length} runs of equal length (yellow). Click the run that gets the “::”.` : V.best ? 'Rule 2: ONE run of consecutive 0 groups (yellow) may be replaced by “::”. Click it.' : 'Rule 2 would replace a run of 0 groups with “::” — but there is no run of two or more zero groups here, so nothing is shortened.',
        V.runs.filter((r) => r.len >= 2).length > 1 ? `Luật 2: MỘT dãy nhóm 0 liên tiếp được thay bằng “::”. Ở đây có ${V.runs.filter((r) => r.len >= 2).length} dãy dài bằng nhau (vàng). Bấm vào dãy được nhận “::”.` : V.best ? 'Luật 2: MỘT dãy nhóm 0 liên tiếp (vàng) được thay bằng “::”. Bấm vào nó.' : 'Luật 2 thay một dãy nhóm 0 bằng “::” — nhưng ở đây không có dãy nào từ hai nhóm 0 trở lên, nên không rút gọn được.'],
      [V.best ? `“::” goes to the LONGEST run; when two are equally long, to the FIRST (RFC 5952). Only one “::” is allowed — with two, nobody could tell how many zeros each one hides. Result: ${V.result}.${pick >= 0 ? (pickOk ? ' You picked right.' : ' Your pick was not the one the standard chooses.') : ''}` : `Result: ${V.result}. A single 0 group stays “0”.`,
        V.best ? `“::” dành cho dãy DÀI NHẤT; hai dãy dài bằng nhau thì dãy ĐẦU TIÊN (RFC 5952). Chỉ được một “::” — có hai thì không ai biết mỗi cái giấu bao nhiêu số 0. Kết quả: ${V.result}.${pick >= 0 ? (pickOk ? ' Bạn chọn đúng.' : ' Lựa chọn của bạn không phải dãy chuẩn chọn.') : ''}` : `Kết quả: ${V.result}. Một nhóm 0 đứng riêng vẫn giữ “0”.`],
      ['A /64 is the normal size of ONE IPv6 network (a home, an office LAN): the first 64 bits are the network, the last 64 the machine. 2^64 = 18446744073709551616 addresses — no counting hosts, no NAT.', '/64 là cỡ bình thường của MỘT mạng IPv6 (một nhà, một LAN văn phòng): 64 bit đầu là mạng, 64 bit sau là máy. 2^64 = 18446744073709551616 địa chỉ — không phải đếm máy, không cần NAT.'],
      [`Every IPv6 card also makes itself a link-local address fe80::… , valid only on its own cable. One old method (EUI-64): take the 48-bit MAC ${MAC}, flip bit 7 of the first byte (02 → 00), insert ff:fe in the middle ⇒ ${E.linkLocal}. The lab laptop really has it.`, `Mọi card IPv6 còn tự đặt một địa chỉ link-local fe80::… , chỉ có giá trị trên dây của nó. Một cách cũ (EUI-64): lấy MAC 48 bit ${MAC}, lật bit 7 của byte đầu (02 → 00), chèn ff:fe vào giữa ⇒ ${E.linkLocal}. Laptop trong lab thật sự có địa chỉ này.`],
      [`IPv6 has no ARP. To find a neighbour’s MAC it sends an ICMPv6 “neighbor solicitation” — not to everyone, but to a multicast group only that neighbour listens to: ff02::1:ff + the last 24 bits ⇒ ${solicitedNode('2001:db8:a:50::11')}. The answer is a “neighbor advertisement”; ip -6 neigh then shows REACHABLE.`, `IPv6 không có ARP. Để tìm MAC của hàng xóm nó gửi ICMPv6 “neighbor solicitation” — không phát cho mọi người, mà cho một nhóm multicast chỉ hàng xóm đó nghe: ff02::1:ff + 24 bit cuối ⇒ ${solicitedNode('2001:db8:a:50::11')}. Câu trả lời là “neighbor advertisement”; rồi ip -6 neigh ghi REACHABLE.`],
    ];
    return (
      <>
        <div className={s.bar} data-tour="v6-input">
          <span className={s.lbl}>IPv6 <input type="text" className={n.ipIn} style={{ width: 300, maxWidth: '100%' }} value={draft} onChange={(e) => setA(e.target.value)} aria-label={t('IPv6 address', 'Địa chỉ IPv6')} spellCheck={false} /></span>
        </div>
        <Picks value={addr} options={SAMPLES.map((x) => [x, x] as [string, string])} onChange={setA} />
        <Controls p={p} lang={lang} />
        <Explain tone={st === 3 ? (pick >= 0 && !pickOk ? 'warn' : 'ok') : undefined}>{t(...ex[V ? Math.min(st, 6) : 0])}</Explain>
        {V && (
          <div className={s.panel} data-tour="v6-groups">
            <div className={s.panelTitle} style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>{t('8 groups × 16 bits', '8 nhóm × 16 bit')} {st >= 2 && st <= 3 && V.best && <span className={s.small}>{t('— click a yellow run', '— bấm một dãy vàng')}</span>}</div>
            <div className={n.g6}>
              {groups.map((g, k) => {
                const r = inRun(k);
                const isRun = st >= 2 && !!r && r.len >= 2;
                const isBest = st >= 3 && !!V.best && k >= V.best.start && k < V.best.start + V.best.len;
                return (
                  <button type="button" key={k} disabled={!isRun} onClick={() => doPick(k)} className={cx(g.replace(/0/g, '') === '' && n.g6Zero, isRun && n.g6Run, isBest && n.g6Best, r && pick === r.start && n.g6Pick)} aria-label={`group ${k + 1}: ${g}`}>{g}</button>
                );
              })}
            </div>
            <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }} data-tour="v6-result">
              <span className={s.small}>{t('result', 'kết quả')}:</span>
              <span className={n.v6res}>{st >= 3 ? V.result : st >= 1 ? V.noLead.join(':') : V.full}</span>
              {st >= 3 && <Src real={real} lang={lang} en={real ? 'same as Python ipaddress in the lab' : 'computed'} vi={real ? 'đúng như ipaddress của Python trong lab' : 'tính ra'} />}
            </div>
          </div>
        )}
        <div className={n.cols}>
          <div className={s.stack} style={{ gap: 8 }}>
            {st >= 4 && <div className={s.kpis} data-tour="v6-count"><Kpi k={t('addresses in one /64', 'địa chỉ trong một /64')} v={<span style={{ fontSize: 14 }}>{count6(64)}</span>} tone="ok" /><Kpi k={t('all of IPv4', 'cả IPv4')} v={<span style={{ fontSize: 14 }}>4294967296</span>} /></div>}
            {st >= 5 && (
              <div className={s.panel} data-tour="v6-eui">
                <div className={s.panelTitle}>EUI-64: MAC ⇒ fe80:: <Src real={false} lang={lang} en="the rule, computed" vi="đúng luật, tính ra" /></div>
                <dl className={n.kv}>
                  <dt>MAC</dt><dd>{E.mac}</dd>
                  <dt>{t('flip bit 7', 'lật bit 7')}</dt><dd>{E.flipped}</dd>
                  <dt>{t('insert ff:fe', 'chèn ff:fe')}</dt><dd>{E.withFffe}</dd>
                  <dt>link-local</dt><dd>{E.linkLocal}</dd>
                </dl>
                <Term lang={lang} real lines={['$ ip -br -6 addr show eth0', { t: V6_ADDR[0], on: true }]} />
              </div>
            )}
            {st >= 6 && <Term lang={lang} tour="v6-ndp" title="tcpdump (NDP)" real wrap lines={[...V6_NDP.slice(0, 3).map((l, k) => ({ t: l, on: k !== 1 })), '$ ip -6 neigh show 2001:db8:a:50::11', { t: V6_NDP[3], on: true }]} />}
            {st < 4 && <Term lang={lang} title="python3 -c 'import ipaddress …'" real lines={[{ t: V6_ADDR[1], on: addr === SAMPLES[0] }, { t: V6_ADDR[2], on: addr === SAMPLES[1] }]} />}
          </div>
          <WhereBox focus={st >= 6 ? 'arp-cache' : 'ip-config'} lang={lang} height={170} />
        </div>
      </>
    );
  })();

  // ───────── happy ─────────
  const happyView = pre === 'happy' && (() => {
    const S = HS;
    const rows = happyRows(broken).slice(0, S.rows);
    const curlV = broken ? V6_HAPPY.slice(0, S.phase === 'try6' ? 1 : S.phase === 'try4' ? 2 : 3) : V6_DUAL.slice(4, S.phase === 'dns' ? 4 : 6);
    const shownCurl = S.phase === 'dns' ? [] : curlV;
    return (
      <>
        <div className={s.bar} data-tour="v6-broken">
          <Seg label={t('IPv6 path silently broken', 'đường IPv6 hỏng lặng lẽ')} value={broken ? 'on' : 'off'} options={[['off', t('no', 'không')], ['on', t('yes', 'có')]]} onChange={(v) => { setBroken(v === 'on'); p.reset(); labSfx(v === 'on' ? 'on' : 'off'); }} />
        </div>
        <Controls p={p} lang={lang} />
        <Explain tone={S.tone}>{t(S.en, S.vi)}</Explain>
        <div className={s.panel} data-tour="v6-timeline">
          <div className={s.panelTitle} style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>{t('Connection attempts over time', 'Các lần thử kết nối theo thời gian')} <Src real lang={lang} en="end times measured" vi="mốc kết thúc đo thật" /> <Src real={false} lang={lang} en="start of the v4 try = default timer" vi="lúc bắt đầu thử v4 = mặc định của bộ hẹn giờ" /></div>
          <div className={n.he}>
            {rows.length === 0 && <span className={s.empty}>{t('(press Step)', '(bấm Bước)')}</span>}
            {rows.map((r) => (
              <div key={r.who} className={n.heRow}>
                <b>{r.who}<small>{r.result}</small></b>
                <div className={n.heTrack}>
                  {r.bars.map((b, k) => (
                    <span key={k} className={n.heBar} title={`${b.label}: ${b.start}–${b.end} ms`}
                      style={{ left: `${pos(b.start)}%`, width: `${Math.max(1.2, pos(b.end) - pos(b.start))}%`, top: b.fam === 6 ? 3 : 18, background: b.ok ? FAM_COLOR[b.fam] : `repeating-linear-gradient(135deg, ${FAM_COLOR[b.fam]} 0 5px, transparent 5px 9px)`, color: b.ok ? undefined : 'var(--ol-text)' }}>
                      {b.ok ? '✓ ' : ''}{b.fam === 6 ? 'IPv6' : 'IPv4'}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            <div className={n.heRow}><span /><div className={n.heAxis}>{[0, 100, 200, 300, 400].map((x) => <span key={x} style={{ left: `${pos(x)}%`, transform: x ? 'translateX(-50%)' : 'none' }}>{x}{x === 400 ? ' ms ⟩' : ''}</span>)}{[2000, 5000, 8000].map((x) => <span key={x} style={{ left: `${pos(x)}%` }}>{x / 1000} s</span>)}</div></div>
          </div>
          <div className={n.note} style={{ marginTop: 4 }}>{t(`The axis bends at 400 ms so both 0.2 s and 8 s fit. Off the chart: the kernel would give up an unanswered SYN after ~${synGiveUpS()} s (computed, tcp_syn_retries = ${HE.synRetries}).`, `Trục gãy ở 400 ms để cả 0,2 s lẫn 8 s đều vừa. Ngoài biểu đồ: nhân bỏ cuộc một SYN không ai trả lời sau ~${synGiveUpS()} s (tính ra, tcp_syn_retries = ${HE.synRetries}).`)}</div>
        </div>
        <div className={n.cols}>
          <div className={s.stack} style={{ gap: 8 }}>
            <Term lang={lang} tour="v6-dig" real lines={[...V6_DUAL.slice(0, 4).map((l) => ({ t: l, on: S.phase === 'dns' && !l.startsWith('$') })), ...(broken ? [{ t: '# isp: ' + V6_BREAK[0].slice(2), dim: true }] : [])]} />
            <Term lang={lang} tour="v6-curl" title="curl -v http://labflow.test/" real lines={shownCurl.map((l, k) => ({ t: l, on: k === shownCurl.length - 1 }))} />
            {S.rows >= 2 && <Term lang={lang} real wrap lines={[{ t: V6_HAPPY[5], on: S.phase === 'node' }, ...(S.rows >= 3 ? [{ t: V6_HAPPY[6], on: S.phase === 'noauto' }] : []), ...(S.rows >= 4 ? [{ t: V6_HAPPY[4], on: S.phase === 'force6' }] : []), ...(broken && S.rows >= 1 ? [{ t: V6_HAPPY[3], on: S.phase === 'connected' }] : [])]} />}
          </div>
          <WhereBox focus="happy-eyeballs" lang={lang} height={170} />
        </div>
      </>
    );
  })();

  // ───────── localhost ─────────
  const lhView = pre === 'localhost' && (() => {
    const S = LS;
    const k = lh.findIndex((x) => x.phase === S.phase);
    const shown = Array.from(new Set(lh.slice(0, k + 1).flatMap((x) => x.lines))).sort((a, b) => a - b);
    const client = k <= 4;
    const doors = client ? [
      { addr: '[::1]:5000', on: false, label: t('nobody listens', 'không ai nghe'), hot: S.phase === 'curl' || S.phase === 'noauto' },
      { addr: '127.0.0.1:5000', on: true, label: t('dev server', 'dev server'), hot: S.phase === 'curl' || S.phase === 'node' },
    ] : [
      { addr: '0.0.0.0:3000', on: true, label: t('IPv4 only', 'chỉ IPv4'), hot: S.phase === 'v4only' },
      { addr: '[::]:3001  (*:3001)', on: true, label: t('IPv6 + IPv4', 'IPv6 + IPv4'), hot: S.phase === 'mapped' },
    ];
    const lines: TLine[] = client
      ? shown.map((i) => ({ t: V6_LOCALHOST[i], on: S.lines.includes(i) }))
      : [`$ ss -tln 'sport = :3000 or sport = :3001'  # server`, ...V6_LISTEN.map((l) => ({ t: l, on: S.phase === 'server' && l.startsWith('LISTEN') })),
        ...(k >= 6 ? ['$ curl http://203.0.113.10:3000/', { t: V6_CALL[0], on: S.phase === 'v4only' }, '$ curl "http://[2001:db8:d::10]:3000/"', { t: V6_CALL[1], on: S.phase === 'v4only' }] : []),
        ...(k >= 7 ? ['$ curl http://203.0.113.10:3001/', { t: V6_CALL[2], on: true }, '$ curl "http://[2001:db8:d::10]:3001/"', { t: V6_CALL[3], on: true }] : [])];
    return (
      <>
        <Controls p={p} lang={lang} />
        <Explain tone={S.tone}>{t(S.en, S.vi)}</Explain>
        <div className={n.cols}>
          <div className={s.stack} style={{ gap: 8 }}>
            <div className={s.panel} data-tour="v6-doors">
              <div className={s.panelTitle}>{client ? t('Your laptop: two loopback doors for port 5000', 'Laptop của bạn: hai cửa loopback cho cổng 5000') : t('The server 203.0.113.10: two apps', 'Máy chủ 203.0.113.10: hai app')}</div>
              <div className={n.ifaces}>
                {doors.map((d) => (
                  <div key={d.addr} className={cx(n.iface, d.on ? n.ifaceOn : n.ifaceOff)} style={d.hot ? { boxShadow: '0 0 0 2px var(--ol-accent)' } : undefined}>
                    <code>{d.addr}</code>{d.on ? '✓ ' : '✕ '}{d.label}
                  </div>
                ))}
              </div>
              {client && k >= 1 && <div className={n.note} style={{ marginTop: 6 }}>{t('“localhost” ⇒ ::1 first, then 127.0.0.1. Whoever tries only the first address knocks on the empty door.', '“localhost” ⇒ ::1 trước, rồi 127.0.0.1. Ai chỉ thử địa chỉ đầu tiên là gõ vào cánh cửa trống.')}</div>}
              {!client && k >= 7 && <div className={cx(n.verdict, n.vNew)} style={{ marginTop: 6 }}>::ffff:198.51.100.2 = {t('IPv4 198.51.100.2 written as an IPv6 address', 'IPv4 198.51.100.2 viết dưới dạng địa chỉ IPv6')}</div>}
            </div>
            <Term lang={lang} tour="v6-lh-term" real lines={lines} />
          </div>
          <WhereBox focus="socket" lang={lang} height={170} />
        </div>
      </>
    );
  })();

  return (
    <Frame badge={t('Network lab', 'Phòng lab mạng')} title={t('IPv6: bigger addresses, new traps', 'IPv6: địa chỉ lớn hơn, bẫy mới')}
      sub={t('Real outputs from the dual-stack “Internet in a box”: no NAT, NDP, Happy Eyeballs, localhost = ::1', 'Output thật từ “Internet in a box” chạy cả hai giao thức: không NAT, NDP, Happy Eyeballs, localhost = ::1')}>
      <div className={n.nl}>
        <div className={s.bar} data-tour="v6-preset">
          <Seg label={t('Scenario', 'Kịch bản')} value={pre} options={[['addr', t('addresses', 'địa chỉ')], ['happy', 'Happy Eyeballs'], ['localhost', 'localhost']]} onChange={load} />
        </div>
        {addrView}{happyView}{lhView}
        <div className={n.note}>{t('Dual stack = a machine speaks IPv4 and IPv6 at the same time. A name can have an A record (IPv4) and an AAAA record (IPv6); the client chooses.', 'Dual stack (chạy song song) = một máy nói cả IPv4 lẫn IPv6 cùng lúc. Một tên có thể có bản ghi A (IPv4) và bản ghi AAAA (IPv6); client tự chọn.')}</div>
      </div>
    </Frame>
  );
}
