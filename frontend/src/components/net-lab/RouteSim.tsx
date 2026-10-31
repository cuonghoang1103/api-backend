'use client';
/**
 * Định tuyến (Chương 2.2), trên bảng định tuyến THẬT của "Internet in a box".
 *   lookup — chọn router (laptop / homegw / isp / dc) + đích: kiểm từng dòng, mọi dòng khớp sáng lên, prefix DÀI nhất thắng;
 *            8.8.8.8 ở isp ⇒ "Network is unreachable"; /32 bị quên trên dc thắng /24 nối thẳng
 *   trace  — traceroute laptop → 203.0.113.10 từng TTL, dòng tshark thật (TTL trả lời 64/63/62/61); bật "dc im lặng" ⇒ * * *
 *   loop   — tuyến /32 bị quên trên dc ⇒ gói chạy qua lại isp ↔ dc tới TTL 0; traceroute xen kẽ hai địa chỉ; xoá tuyến ⇒ hết
 * Engine: engine/route.ts. Số liệu: engine/capture2.ts.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { DC_ADD_32, DC_DEL_32, DC_SILENT_RULE, RT_DC_REAL, ROUTE_GET, SAO_CURL, SAO_MTR, SAO_OUT, TRACE_OUT, TRACE_TSHARK, VONG_PING, VONG_TRACE } from './engine/capture2';
import { HOP_IP, PATH_NODES, ROUTER_IP, SERVER, loopScript, lookup, realGet, traceScript, walk, type RouterId } from './engine/route';
import { isIp, maskOf, intToIp, ipToInt } from './engine/subnet';
import { Controls, Explain, Frame, Kpi, Seg, css as s, cx, tx, usePlayer, type Lang } from '../os-lab/ui';
import { WhereBox } from '../os-lab/where';
import { useLabBridge, useOwnStepSound } from '../labs/bus';
import { labSfx } from '../labs/sfx';
import { Picks, Src, Term, Topo, type TLine, type TNode } from './parts';
import n from './netlab.module.css';

type Preset = 'lookup' | 'trace' | 'loop';
const PRESETS: Preset[] = ['lookup', 'trace', 'loop'];
const DSTS = ['192.168.50.11', '203.0.113.10', '203.0.113.200', '8.8.8.8', '198.18.0.5', '100.64.0.10'];
const ROUTER_NAME: Record<RouterId, [string, string]> = {
  laptop: ['laptop (home)', 'laptop (ở nhà)'], homegw: ['homegw (home router)', 'homegw (router nhà)'], isp: ['isp (the ISP, AS64500)', 'isp (nhà mạng, AS64500)'], dc: ['dc (data centre, AS64510)', 'dc (trung tâm dữ liệu, AS64510)'],
};
const NODE_X = [52, 156, 260, 364, 468];
const ICON = ['💻', '🏠', '🏢', '🏭', '🌐'];

function pathNodes(lang: Lang, on: (k: number) => boolean, bad?: (k: number) => boolean): TNode[] {
  return PATH_NODES.map((id, k) => ({ id, x: NODE_X[k], y: 112, icon: ICON[k], name: id, sub: HOP_IP[k], on: on(k), bad: bad?.(k), w: 98 }));
}
const pathLinks = (on: (k: number) => boolean, back = false, bad?: (k: number) => boolean) => [0, 1, 2, 3].map((k) => ({ a: PATH_NODES[k], b: PATH_NODES[k + 1], on: on(k), back, bad: bad?.(k) }));

export default function RouteSim({ lang = 'vi', preset = 'lookup' }: { lang?: Lang; preset?: string }) {
  const t = (en: string, vi: string) => tx(lang, en, vi);
  const [pre, setPre] = useState<Preset>(PRESETS.includes(preset as Preset) ? (preset as Preset) : 'lookup');
  const [router, setRouter] = useState<RouterId>('laptop');
  const [dst, setDst] = useState('203.0.113.10');
  const [draft, setDraft] = useState('203.0.113.10');
  const [forgotten, setForgotten] = useState(true);
  const [silent, setSilent] = useState(false);
  const [fixed, setFixed] = useState(false);

  const L = useMemo(() => lookup(router, dst, forgotten), [router, dst, forgotten]);
  const trace = useMemo(() => traceScript(silent), [silent]);
  const loop = useMemo(() => loopScript(fixed), [fixed]);
  const total = pre === 'lookup' ? L.checks.length + 2 : pre === 'trace' ? trace.length : loop.length;
  const p = usePlayer(total, pre === 'lookup' ? 1100 : 1800);
  useOwnStepSound();
  const TS = trace[Math.min(p.i, trace.length - 1)];
  const LS = loop[Math.min(p.i, loop.length - 1)];
  const prevI = useRef(p.i);
  useEffect(() => {
    if (p.i > prevI.current) {
      if (pre === 'lookup') labSfx(p.atEnd ? (L.winner ? 'right' : 'thud') : L.checks[p.i - 1]?.match ? 'hit' : 'tick');
      else labSfx((pre === 'trace' ? TS.sfx : LS.sfx) ?? 'tick');
    }
    prevI.current = p.i;
  }, [p.i]); // eslint-disable-line react-hooks/exhaustive-deps

  const load = (k: Preset) => { setPre(k); p.reset(); labSfx('tap'); };
  const pickRouter = (r: RouterId) => { setRouter(r); p.reset(); labSfx('tap'); };
  const pickDst = (v: string) => { setDraft(v); if (isIp(v)) { setDst(v.trim()); p.reset(); labSfx('tap'); } };
  // nhảy tới một bước SAU khi dãy bước mới (dài hơn) đã dựng xong
  const [jump, setJump] = useState<number | null>(null);
  useEffect(() => { if (jump !== null && total > jump) { p.setI(jump); setJump(null); } }, [jump, total]); // eslint-disable-line react-hooks/exhaustive-deps
  const doFix = () => { setFixed(true); setJump(5); labSfx('on'); };

  const reached = pre === 'trace' && (TS.phase === 'port' || TS.phase === 'done');
  const star3 = pre === 'trace' && silent && p.i >= trace.findIndex((x) => x.phase === 'star');
  useLabBridge('route', {
    preset: pre, i: p.i, atEnd: p.atEnd,
    router, dst, forgotten, winnerLen: L.winner ? L.winner.len : -1, winner: L.winner?.line ?? '', unreachable: !L.winner, matches: L.checks.filter((c) => c.match).length,
    silent, hop: pre === 'trace' ? TS.ttl : 0, reached, star3,
    fixed, ttl: pre === 'loop' ? LS.ttl : 0,
  }, {
    preset: (v) => load(String(v) as Preset),
    router: (v) => pickRouter(String(v) as RouterId),
    dst: (v) => pickDst(String(v)),
    forgotten: (v) => { setForgotten(!!v); p.reset(); labSfx(v ? 'on' : 'off'); },
    silent: (v) => { setSilent(!!v); p.reset(); labSfx(v ? 'on' : 'off'); },
    fix: () => doFix(),
  });

  // ───────── lookup ─────────
  const lookupView = pre === 'lookup' && (() => {
    const checked = Math.min(p.i, L.checks.length);
    const done = p.atEnd;
    const real = realGet(router, dst, forgotten);
    const cur = p.i >= 1 && !done ? L.checks[p.i - 1] : undefined;
    const tableReal = router !== 'dc';
    const ex: [string, string] = p.i === 0
      ? [`A packet for ${dst} is inside ${router}. The kernel reads its routing table (ip route) and checks EVERY line: does (destination AND the line’s mask) equal the line’s network? Then the matching line with the LONGEST prefix wins.`, `Một gói tới ${dst} đang ở trong ${router}. Nhân đọc bảng định tuyến (ip route) và kiểm TỪNG dòng: (đích AND mặt nạ của dòng) có bằng mạng của dòng không? Rồi trong các dòng khớp, dòng có prefix DÀI nhất thắng.`]
      : cur ? (cur.route.len === 0
        ? [`“default” = 0.0.0.0/0: a mask of zero bits, so EVERY address matches it — it is the line of last resort, the shortest possible prefix.`, `“default” = 0.0.0.0/0: mặt nạ 0 bit, nên MỌI địa chỉ đều khớp — đây là dòng bất đắc dĩ, prefix ngắn nhất có thể.`]
        : [`${cur.route.line.split(' ')[0]}${cur.route.len === 32 && !cur.route.line.split(' ')[0].includes('/') ? '/32' : ''}: ${dst} AND /${cur.route.len} = ${intToIp((ipToInt(dst) & maskOf(cur.route.len)) >>> 0)} ${cur.match ? '= the network ⇒ MATCH' : `≠ ${intToIp(cur.route.net)} ⇒ no`}.`, `${cur.route.line.split(' ')[0]}${cur.route.len === 32 && !cur.route.line.split(' ')[0].includes('/') ? '/32' : ''}: ${dst} AND /${cur.route.len} = ${intToIp((ipToInt(dst) & maskOf(cur.route.len)) >>> 0)} ${cur.match ? '= mạng của dòng ⇒ KHỚP' : `≠ ${intToIp(cur.route.net)} ⇒ không`}.`])
      : L.winner ? [`${L.checks.filter((c) => c.match).length} line(s) match; the longest prefix is /${L.winner.len} ⇒ ${L.winner.via ? `send to the next router ${L.winner.via}` : `deliver directly on ${L.winner.dev}`}.${L.winner.forgotten ? ' The forgotten /32 beats the correct /24 — longer always wins, even when it is a mistake.' : ''}`, `${L.checks.filter((c) => c.match).length} dòng khớp; prefix dài nhất là /${L.winner.len} ⇒ ${L.winner.via ? `gửi cho router kế tiếp ${L.winner.via}` : `giao thẳng ra ${L.winner.dev}`}.${L.winner.forgotten ? ' Tuyến /32 bị quên thắng tuyến /24 đúng — dài hơn luôn thắng, kể cả khi đó là nhầm lẫn.' : ''}`]
      : [`No line matches and ${router} has NO default route — a core router of an ISP does not need one, it learns every network by BGP. The kernel gives up: “Network is unreachable”.`, `Không dòng nào khớp và ${router} KHÔNG có tuyến mặc định — router lõi của nhà mạng không cần, nó học mọi mạng bằng BGP. Nhân bỏ cuộc: “Network is unreachable”.`];
    return (
      <>
        <Picks label={t('Router', 'Router')} tour="rt-router" value={router} options={(['laptop', 'homegw', 'isp', 'dc'] as RouterId[]).map((r) => [r, r] as [RouterId, string])} onChange={pickRouter} />
        <div className={s.bar} data-tour="rt-dst">
          <span className={s.lbl}>{t('Destination', 'Đích')} <input type="text" className={n.ipIn} value={draft} onChange={(e) => pickDst(e.target.value)} aria-label={t('destination IP', 'IP đích')} spellCheck={false} /></span>
          <Picks value={dst} options={DSTS.map((d) => [d, d] as [string, string])} onChange={pickDst} />
          {router === 'dc' && <span data-tour="rt-forgotten"><Seg label={t('forgotten /32', 'tuyến /32 bị quên')} value={forgotten ? 'on' : 'off'} options={[['on', t('present', 'còn')], ['off', t('deleted', 'đã xoá')]]} onChange={(v) => { setForgotten(v === 'on'); p.reset(); labSfx(v === 'on' ? 'on' : 'off'); }} /></span>}
        </div>
        <Controls p={p} lang={lang} label={done ? t('result', 'kết quả') : p.i === 0 ? t('question', 'câu hỏi') : `${t('line', 'dòng')} ${p.i}/${L.checks.length}`} />
        <Explain tone={done ? (L.winner ? (L.winner.forgotten ? 'warn' : 'ok') : 'bad') : cur?.match ? 'ok' : undefined}>{t(...ex)}</Explain>
        <div className={s.panel} data-tour="rt-table">
          <div className={s.panelTitle} style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>$ ip route — {t(...ROUTER_NAME[router])} <Src real={tableReal} lang={lang} en={tableReal ? 'real table' : 'partly computed'} vi={tableReal ? 'bảng thật' : 'một phần tính ra'} /></div>
          <div style={{ overflowX: 'auto' }}>
            <table className={n.rt}>
              <thead><tr><th>{t('line', 'dòng')}</th><th>prefix</th><th>{t('match?', 'khớp?')}</th></tr></thead>
              <tbody>
                {L.checks.map((c, k) => {
                  const seen = k < checked;
                  const win = done && c.route === L.winner;
                  return (
                    <tr key={c.route.line} className={cx(win && n.rtWin, !win && seen && c.match && n.rtMatch, done && !c.match && n.rtNo, c.route.forgotten && n.rtNew)}>
                      <td><code>{c.route.line}</code>{!c.route.real && <> <Src real={false} lang={lang} en="derived from show ip bgp" vi="suy từ show ip bgp" /></>}{c.route.forgotten && <> <span className={cx(n.src, n.srcCalc)} style={{ color: 'var(--ol-bad)', borderColor: 'var(--ol-bad)', background: 'var(--ol-bad-bg)' }}>{t('forgotten!', 'bị quên!')}</span></>}</td>
                      <td><span className={cx(n.len, win && n.lenWin)}>/{c.route.len}</span></td>
                      <td>{seen ? (c.match ? <span className={n.y}>✓</span> : <span className={n.n}>✗</span>) : '…'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className={n.cols}>
          <Term lang={lang} tour="rt-get" title={<>$ ip route get {dst}</>} real={done ? !!real : undefined} lines={done ? [{ t: L.get, on: true, calc: !real }] : [{ t: t('(step to the end to see the answer)', '(bấm Bước tới cuối để xem câu trả lời)'), dim: true }]} />
          <WhereBox focus="routing-table" lang={lang} height={160} />
        </div>
      </>
    );
  })();

  // ───────── trace ─────────
  const traceView = pre === 'trace' && (() => {
    const S = TS;
    const out = silent ? SAO_OUT : TRACE_OUT;
    const traceLines: TLine[] = [out[0], out[1], ...out.slice(2, 2 + S.hopsShown).map((l, k) => ({ t: l, on: k === S.hopsShown - 1 && (S.phase === 'reply' || S.phase === 'star' || S.phase === 'port') }))];
    const sendMarks = S.phase === 'send' ? walk(SERVER, S.ttl).hops.map((h, k) => ({ x: NODE_X[k + 1], y: 74, text: h.ttlOut !== undefined ? `TTL ${h.ttlOut}${h.ttlOut === 0 ? ' ✕' : ''}` : `TTL ${h.ttlIn} ✓`, bad: h.ttlOut === 0, ok: h.ttlOut === undefined })) : [];
    const marks = [...sendMarks,
      ...(S.phase === 'star' ? [{ x: NODE_X[3], y: 74, text: '* * *', bad: true }] : []),
      ...(S.phase === 'reply' || S.phase === 'port' ? [{ x: NODE_X[S.at], y: 74, text: S.phase === 'port' ? 'Port unreachable' : 'Time exceeded', ok: S.phase === 'port' }] : []),
      ...(S.replyTtl ? [{ x: NODE_X[0], y: 160, text: `TTL ${S.replyTtl}`, ok: true }] : [])];
    const topo = (
      <Topo label={t('laptop, homegw, isp, dc and the server in a row', 'laptop, homegw, isp, dc và máy chủ xếp thành hàng')} w={520} h={176}
        pill={S.phase === 'send' ? `UDP probe TTL=${S.ttl}` : S.phase === 'reply' ? 'ICMP Time exceeded' : S.phase === 'port' ? 'ICMP Port unreachable' : S.phase === 'star' ? t('no answer', 'không trả lời') : undefined}
        k={S.phase === 'send' ? '#d97706' : S.phase === 'star' ? '#dc2626' : '#16a34a'}
        nodes={pathNodes(lang, (k) => k === S.at && S.phase !== 'intro', (k) => k === 3 && silent)}
        links={S.phase === 'send' ? pathLinks((k) => k < S.at) : S.phase === 'reply' || S.phase === 'port' ? pathLinks((k) => k < S.at, true) : S.phase === 'done' ? pathLinks(() => true) : pathLinks(() => false)}
        marks={marks} />
    );
    return (
      <>
        <div className={s.bar} data-tour="rt-silent">
          <Seg label={t('router dc sends “Time exceeded”', 'router dc gửi “Time exceeded”')} value={silent ? 'no' : 'yes'} options={[['yes', t('yes', 'có')], ['no', t('no (silent)', 'không (im lặng)')]]} onChange={(v) => { setSilent(v === 'no'); p.reset(); labSfx(v === 'no' ? 'on' : 'off'); }} />
        </div>
        <Controls p={p} lang={lang} label={S.ttl ? `TTL = ${S.ttl}` : t('start', 'bắt đầu')} />
        <Explain tone={S.tone}>{t(S.en, S.vi)}</Explain>
        <div className={s.panel} style={{ padding: 6 }} data-tour="rt-path">{topo}</div>
        <div className={n.cols}>
          <div className={s.stack} style={{ gap: 8 }}>
            <Term lang={lang} tour="rt-trace" real lines={traceLines} />
            {silent && <Term lang={lang} title={t('on dc', 'trên dc')} real lines={[DC_SILENT_RULE[0], { t: DC_SILENT_RULE[1], on: S.phase === 'star' }]} />}
            {silent && S.phase === 'done' && <Term lang={lang} tour="rt-mtr" real lines={[...SAO_MTR.map((l) => ({ t: l, on: /\?\?\?| 4\.\|/.test(l) })), '$ curl -s http://203.0.113.10/', ...SAO_CURL.map((l) => ({ t: l, on: true }))]} />}
          </div>
          <div className={s.stack} style={{ gap: 8 }}>
            {!silent && <Term lang={lang} tour="rt-tshark" title="tshark -e ip.src -e ip.dst -e ip.ttl -e _ws.col.Info" real wrap lines={TRACE_TSHARK.slice(0, Math.max(0, ...trace.slice(0, p.i + 1).flatMap((x) => x.tshark.map((k) => k + 1)))).map((l, k) => ({ t: l.replace(/\t/g, '  '), on: S.tshark.includes(k) }))} />}
            <WhereBox focus="routing-table" lang={lang} height={160} />
          </div>
        </div>
      </>
    );
  })();

  // ───────── loop ─────────
  const loopView = pre === 'loop' && (() => {
    const S = LS;
    const ph = S.phase;
    const dcRoutes: TLine[] = ['$ ip route | grep 203.0.113  # dc', { t: RT_DC_REAL[0], on: fixed && ph === 'fix' }, ...(fixed && (ph === 'fix' || ph === 'ok') ? [] : [{ t: RT_DC_REAL[1], on: ph === 'intro' || ph === 'first', tag: t('← forgotten test route', '← tuyến thử bị quên') }])];
    const marks = ph === 'first' ? [{ x: NODE_X[1], y: 74, text: 'TTL 63' }, { x: NODE_X[2], y: 74, text: 'TTL 62' }, { x: NODE_X[3], y: 74, text: 'TTL 61 ↩', bad: true }]
      : ph === 'bounce' ? [{ x: (NODE_X[2] + NODE_X[3]) / 2, y: 74, text: '61 → 60 → 59 → … ↔', bad: true }]
      : ph === 'expire' ? [{ x: NODE_X[2], y: 74, text: 'TTL 0 ✕', bad: true }]
      : ph === 'ok' ? [{ x: NODE_X[4], y: 74, text: 'TTL 61 ✓', ok: true }] : [];
    const topo = (
      <Topo label={t('the loop between isp and dc', 'vòng lặp giữa isp và dc')} w={520} h={176}
        pill={ph === 'bounce' ? t('ping-pong isp ↔ dc', 'chạy qua lại isp ↔ dc') : ph === 'expire' ? 'ICMP Time to live exceeded' : ph === 'ok' ? 'ICMP echo reply' : undefined}
        k={ph === 'ok' ? '#16a34a' : '#dc2626'}
        nodes={pathNodes(lang, (k) => (ph === 'expire' ? k === 2 : ph === 'fix' ? k === 3 : ph === 'ok' ? k === 4 : k === 2 || k === 3), (k) => k === 3 && !fixed)}
        links={ph === 'first' ? pathLinks((k) => k < 3) : ph === 'bounce' || ph === 'trace' ? pathLinks((k) => k === 2, false, (k) => k === 2) : ph === 'expire' ? pathLinks((k) => k < 2, true) : ph === 'ok' ? pathLinks(() => true) : pathLinks(() => false)}
        marks={marks} />
    );
    return (
      <>
        <div className={s.bar} data-tour="rt-fix">
          <button type="button" className={cx(s.btn, fixed ? s.on : s.primary)} disabled={fixed} onClick={doFix}>🔧 {fixed ? t('route deleted on dc', 'đã xoá tuyến trên dc') : t('Delete the forgotten route on dc', 'Xoá tuyến bị quên trên dc')}</button>
          {fixed && <button type="button" className={s.btn} onClick={() => { setFixed(false); p.reset(); labSfx('off'); }}>{t('put it back', 'đặt lại')}</button>}
        </div>
        <Controls p={p} lang={lang} />
        <Explain tone={S.tone}>{t(S.en, S.vi)}</Explain>
        <div className={s.panel} style={{ padding: 6 }} data-tour="rt-loop">{topo}</div>
        <div className={s.kpis}><Kpi k="TTL" v={ph === 'expire' || ph === 'trace' ? 0 : S.ttl} tone={ph === 'expire' ? 'bad' : ph === 'ok' ? 'ok' : undefined} /><Kpi k={t('IX crossings (computed)', 'lần qua IX (tính ra)')} v={ph === 'expire' || ph === 'trace' ? walk(SERVER, 64, true).hops.filter((h) => h.at === 'isp' || h.at === 'dc').length - 1 : '—'} /></div>
        <div className={n.cols}>
          <div className={s.stack} style={{ gap: 8 }}>
            <Term lang={lang} tour="rt-dcroutes" real lines={[DC_ADD_32[0], ...dcRoutes, ...(fixed && (ph === 'fix' || ph === 'ok') ? [DC_DEL_32[0], '$ ip route get 203.0.113.10  # dc', { t: ROUTE_GET['dc|203.0.113.10'], on: true }] : ['$ ip route get 203.0.113.10  # dc', { t: ROUTE_GET['dc+32|203.0.113.10'], on: ph === 'first' }])]} />
            <WhereBox focus="routing-table" lang={lang} height={150} />
          </div>
          <div className={s.stack} style={{ gap: 8 }}>
            {(ph === 'expire' || ph === 'trace') && <Term lang={lang} tour="rt-vong" real lines={ph === 'expire' ? VONG_PING.map((l) => ({ t: l, on: /From/.test(l) })) : VONG_TRACE.map((l, k) => ({ t: l, on: k >= 4 }))} />}
            {ph === 'ok' && <Term lang={lang} title={t('normal traceroute (no loop)', 'traceroute bình thường (không vòng lặp)')} real lines={TRACE_OUT.map((l, k) => ({ t: l, on: k >= 2 }))} />}
            {ph !== 'expire' && ph !== 'trace' && ph !== 'ok' && <div className={n.note}>{t(`Each router decides alone, from its own table. isp: “203.0.113.0/24 via 192.0.2.3 (dc)”. dc: “203.0.113.10 via 192.0.2.1 (isp)”. Nobody sees the whole path — that is why loops happen, and why every IP packet carries a TTL. isp’s address towards home is ${ROUTER_IP.isp}.`, `Mỗi router tự quyết, theo bảng của riêng nó. isp: “203.0.113.0/24 via 192.0.2.3 (dc)”. dc: “203.0.113.10 via 192.0.2.1 (isp)”. Không ai thấy cả con đường — vì thế mới có vòng lặp, và vì thế gói IP nào cũng mang TTL. Địa chỉ của isp phía nhà là ${ROUTER_IP.isp}.`)}</div>}
          </div>
        </div>
      </>
    );
  })();

  return (
    <Frame badge={t('Network lab', 'Phòng lab mạng')} title={t('Routing: who sends the packet where?', 'Định tuyến: ai gửi gói đi đâu?')}
      sub={t('Real routing tables and traceroutes from the course’s “Internet in a box” (home → ISP → exchange → data centre)', 'Bảng định tuyến và traceroute thật từ “Internet in a box” của khoá (nhà → nhà mạng → điểm trao đổi → trung tâm dữ liệu)')}>
      <div className={n.nl}>
        <div className={s.bar} data-tour="rt-preset">
          <Seg label={t('Scenario', 'Kịch bản')} value={pre} options={[['lookup', t('which line wins?', 'dòng nào thắng?')], ['trace', 'traceroute'], ['loop', t('routing loop', 'vòng lặp')]]} onChange={load} />
        </div>
        {lookupView}{traceView}{loopView}
        <div className={n.note}>{t('Routing table = the list “to reach these addresses, send to that next router (via) out of that card (dev)”. Every router has its own and decides one hop at a time.', 'Bảng định tuyến = danh sách “muốn tới những địa chỉ này thì gửi cho router kế tiếp kia (via), ra card kia (dev)”. Router nào cũng có bảng riêng và quyết từng chặng một.')}</div>
      </div>
    </Frame>
  );
}

