'use client';
/**
 * NAT (Chương 2.3): nhiều máy, một IP công cộng.
 *   home    — laptop + điện thoại mở kết nối qua homegw: header trước (lan0) / sau (wan0) router, dòng conntrack hiện ra,
 *             máy chủ thấy "198.51.100.2 port …"; va chạm cổng thật: cả hai dùng 41000 ⇒ của điện thoại thành 4734
 *   inbound — máy chủ gọi ngược vào laptop: 192.168.50.10 ⇒ !N; 198.51.100.2:8080 ⇒ refused; người học thêm DNAT ⇒ chạy
 *   cgnat   — điện thoại 4G 100.64.0.10 sau NAT của nhà mạng ⇒ 198.51.100.200; không mở cổng được; docker -p = DNAT
 * Engine: engine/nat.ts. Số liệu: engine/capture2.ts.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { CGNAT_CONNTRACK, CGNAT_IN, CGNAT_MOBILE, CGNAT_RULE, DOCKER_P, NAT_CONNTRACK, NAT_DNAT, NAT_IN_FAIL, NAT_IN_OK, NAT_LAN_SYN, NAT_RULE, NAT_WAN_SYN } from './engine/capture2';
import { cgnatScript, homeScript, inboundScript, type Tuple } from './engine/nat';
import { Controls, Explain, Frame, Seg, css as s, cx, tx, usePlayer, type Lang } from '../os-lab/ui';
import { WhereBox } from '../os-lab/where';
import { useLabBridge, useOwnStepSound } from '../labs/bus';
import { labSfx } from '../labs/sfx';
import { Src, Term, Topo, type TLine } from './parts';
import n from './netlab.module.css';

type Preset = 'home' | 'inbound' | 'cgnat';
const PRESETS: Preset[] = ['home', 'inbound', 'cgnat'];

function Hdr({ t: tu, chg, lang, title }: { t: Tuple; chg?: 'src' | 'dst'; lang: Lang; title: string }) {
  const L = (en: string, vi: string) => tx(lang, en, vi);
  return (
    <div>
      <div className={s.small} style={{ fontWeight: 800, marginBottom: 2 }}>{title}</div>
      <div className={n.hdr}>
        <span className={cx(chg === 'src' && n.hdrChg)}><small>{L('src IP', 'IP nguồn')}</small>{tu.src}</span>
        <span className={cx(chg === 'src' && n.hdrChg)}><small>{L('src port', 'cổng nguồn')}</small>{tu.sport}</span>
        <span className={cx(chg === 'dst' && n.hdrChg)}><small>{L('dst IP', 'IP đích')}</small>{tu.dst}</span>
        <span className={cx(chg === 'dst' && n.hdrChg)}><small>{L('dst port', 'cổng đích')}</small>{tu.dport}</span>
      </div>
    </div>
  );
}

export default function NatSim({ lang = 'vi', preset = 'home' }: { lang?: Lang; preset?: string }) {
  const t = (en: string, vi: string) => tx(lang, en, vi);
  const [pre, setPre] = useState<Preset>(PRESETS.includes(preset as Preset) ? (preset as Preset) : 'home');
  const [dnat, setDnat] = useState(false);
  const home = useMemo(() => homeScript(), []);
  const inbound = useMemo(() => inboundScript(dnat), [dnat]);
  const cg = useMemo(() => cgnatScript(), []);
  const total = pre === 'home' ? home.length : pre === 'inbound' ? inbound.length : cg.length;
  const p = usePlayer(total, 1900);
  useOwnStepSound();
  const H = home[Math.min(p.i, home.length - 1)];
  const I = inbound[Math.min(p.i, inbound.length - 1)];
  const G = cg[Math.min(p.i, cg.length - 1)];
  const prevI = useRef(p.i);
  useEffect(() => {
    if (p.i > prevI.current) labSfx((pre === 'home' ? H.sfx : pre === 'inbound' ? I.sfx : G.sfx) ?? 'tick');
    prevI.current = p.i;
  }, [p.i]); // eslint-disable-line react-hooks/exhaustive-deps
  const [jump, setJump] = useState<number | null>(null);
  useEffect(() => { if (jump !== null && total > jump) { p.setI(jump); setJump(null); } }, [jump, total]); // eslint-disable-line react-hooks/exhaustive-deps

  const load = (k: Preset) => { setPre(k); p.reset(); labSfx('tap'); };
  const addDnat = () => { if (dnat) return; setDnat(true); setJump(3); labSfx('on'); };

  const collision = pre === 'home' && home.slice(0, p.i + 1).some((x) => x.collided);
  const phoneRow = H.rows.find((r) => r.who === 'phone');
  useLabBridge('nat', {
    preset: pre, i: p.i, atEnd: p.atEnd,
    rows: pre === 'home' ? H.rows.length : 0, collision, phonePort: phoneRow ? phoneRow.reply.dport : 0,
    dnat, inboundOk: pre === 'inbound' && I.phase === 'ok',
  }, {
    preset: (v) => load(String(v) as Preset),
    dnat: (v) => { if (v === false) { setDnat(false); p.reset(); labSfx('off'); } else addDnat(); },
  });

  // ───────── home ─────────
  const homeView = pre === 'home' && (() => {
    const S = H;
    const pk = S.pkt;
    const fromPhone = S.focus === 'phone' || S.lan === 2 || pk?.t.src === '192.168.50.11' || pk?.t.dst === '192.168.50.11';
    const lanT = S.lan !== undefined ? NAT_LAN_SYN[S.lan] : undefined;
    const lanTuple: Tuple | undefined = lanT ? (() => { const m = lanT.match(/^IP (\S+)\.(\d+) > (\S+)\.(\d+):/)!; return { src: m[1], sport: +m[2], dst: m[3], dport: +m[4] }; })() : undefined;
    const lanSeen = Array.from(new Set(home.slice(0, p.i + 1).flatMap((x) => (x.lan !== undefined ? [x.lan] : []))));
    const wanSeen = Array.from(new Set(home.slice(0, p.i + 1).flatMap((x) => (x.wan !== undefined ? [x.wan] : []))));
    const seenLine = [...home.slice(0, p.i + 1)].reverse().find((x) => x.seen)?.seen;
    const back = pk?.where === 'back';
    const topo = (
      <Topo label={t('laptop and phone behind homegw, the server on the Internet', 'laptop và điện thoại sau homegw, máy chủ trên Internet')} w={520} h={196}
        pill={pk ? (pk.where === 'lan' ? t('SYN on lan0 (private)', 'SYN trên lan0 (riêng)') : pk.where === 'wan' ? t('SYN on wan0 (rewritten)', 'SYN trên wan0 (đã viết lại)') : t('answer, rewritten back', 'trả lời, viết ngược lại')) : undefined}
        k={pk?.where === 'wan' ? '#dc2626' : back ? '#16a34a' : '#2563eb'}
        nodes={[
          { id: 'laptop', x: 62, y: 52, icon: '💻', name: 'laptop', sub: '192.168.50.10', on: S.focus === 'laptop' || (back && !fromPhone) },
          { id: 'phone', x: 62, y: 152, icon: '📱', name: t('phone', 'điện thoại'), sub: '192.168.50.11', on: S.focus === 'phone' || (back && !!fromPhone) },
          { id: 'gw', x: 228, y: 102, icon: '🏠', name: 'homegw', sub: 'lan0 .50.1', sub2: 'wan0 198.51.100.2', on: S.focus === 'homegw', w: 124 },
          { id: 'net', x: 360, y: 102, icon: '☁️', name: 'Internet', sub: 'isp → IX → dc', w: 96 },
          { id: 'srv', x: 466, y: 102, icon: '🌐', name: 'server', sub: '203.0.113.10', on: S.focus === 'server', w: 100 },
        ]}
        links={[
          { a: 'laptop', b: 'gw', on: !!pk && !fromPhone && (pk.where === 'lan' || back), back, label: 'lan0' },
          { a: 'phone', b: 'gw', on: !!pk && !!fromPhone && (pk.where === 'lan' || back), back },
          { a: 'gw', b: 'net', on: !!pk && pk.where !== 'lan', back, label: 'wan0' },
          { a: 'net', b: 'srv', on: !!pk && pk.where !== 'lan', back },
        ]} />
    );
    return (
      <>
        <Controls p={p} lang={lang} />
        <Explain tone={S.tone}>{t(S.en, S.vi)}</Explain>
        <div className={n.cols}>
          <div className={s.stack} style={{ gap: 8 }}>
            <div className={s.panel} style={{ padding: 6 }} data-tour="nat-topo">{topo}</div>
            <div className={s.panel} data-tour="nat-hdr">
              <div className={s.panelTitle} style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>{t('The packet, before and after homegw', 'Gói tin, trước và sau homegw')} <Src real lang={lang} en="real tcpdump on both sides" vi="tcpdump thật ở hai phía" /></div>
              {lanTuple ? <Hdr lang={lang} title={t('on lan0 (inside the home)', 'trên lan0 (trong nhà)')} t={lanTuple} /> : <span className={s.empty}>{back ? t('(an answer coming back)', '(câu trả lời đang về)') : t('(no packet yet)', '(chưa có gói)')}</span>}
              {S.wan !== undefined && pk?.where === 'wan' && <div style={{ marginTop: 6 }}><Hdr lang={lang} title={t('on wan0 (to the Internet)', 'trên wan0 (ra Internet)')} t={pk.t} chg="src" /></div>}
              {back && pk && <div style={{ marginTop: 6 }}><div className={s.small} style={{ fontWeight: 800 }}>{t('answer', 'câu trả lời')}: {pk.note}</div><Hdr lang={lang} title={t('delivered inside the home', 'giao vào trong nhà')} t={pk.t} chg="dst" /></div>}
              {S.collided && <div className={cx(n.verdict, n.vBad)} style={{ marginTop: 6 }}>⚠ {t('port collision: 41000 is taken ⇒ 4734', 'va chạm cổng: 41000 đã có người dùng ⇒ 4734')}</div>}
            </div>
          </div>
          <div className={s.stack} style={{ gap: 8 }}>
            <div className={s.panel} data-tour="nat-conntrack">
              <div className={s.panelTitle} style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>conntrack — homegw <Src real lang={lang} en="same rows as conntrack -L in the lab" vi="đúng các dòng conntrack -L trong lab" /></div>
              {S.rows.length ? (
                <div style={{ overflowX: 'auto' }}>
                  <table className={n.rt}>
                    <thead><tr><th>{t('original (what the device sent)', 'bộ gốc (thiết bị gửi)')}</th><th>{t('reply (what the answer looks like)', 'bộ trả lời (câu trả lời trông thế nào)')}</th></tr></thead>
                    <tbody>{S.rows.map((r, k) => {
                      const hit = back && pk && r.orig.src === pk.t.dst && r.orig.sport === pk.t.dport;
                      return (
                        <tr key={k} className={cx(k === S.rows.length - 1 && S.wan !== undefined && n.rtNew, hit && n.rtWin, r.reply.dport !== r.orig.sport && n.rtBad)}>
                          <td><code>{r.orig.src}:{r.orig.sport} → {r.orig.dst}:{r.orig.dport}</code></td>
                          <td><code>{r.reply.src}:{r.reply.sport} → {r.reply.dst}:<b>{r.reply.dport}</b></code></td>
                        </tr>
                      );
                    })}</tbody>
                  </table>
                </div>
              ) : <span className={s.empty}>{t('(empty)', '(trống)')}</span>}
            </div>
            {seenLine && <div className={cx(n.verdict, n.vOk)} data-tour="nat-seen">🌐 {t('server says', 'máy chủ nói')}: <span className={s.mono}>“{seenLine}”</span> <Src real lang={lang} /></div>}
            <Term lang={lang} tour="nat-tcpdump" title="tcpdump 'tcp[tcpflags] == tcp-syn'" real lines={[
              { t: '# lan0', dim: true }, ...lanSeen.map((k) => ({ t: NAT_LAN_SYN[k], on: k === S.lan })),
              { t: '# wan0', dim: true }, ...wanSeen.map((k) => ({ t: NAT_WAN_SYN[k], on: k === S.wan })),
            ]} />
            {p.atEnd && <Term lang={lang} tour="nat-real" title="$ conntrack -L -p tcp --dport 80" real wrap lines={NAT_CONNTRACK.map((l) => ({ t: l, on: /dport=4734/.test(l) }))} />}
            <WhereBox focus="conntrack" lang={lang} height={150} />
          </div>
        </div>
        <Term lang={lang} title="$ iptables -t nat -S POSTROUTING  # homegw" real lines={[{ t: NAT_RULE[0], on: p.i === 0 }]} />
      </>
    );
  })();

  // ───────── inbound ─────────
  const inboundView = pre === 'inbound' && (() => {
    const S = I;
    const ph = S.phase;
    const failLines = NAT_IN_FAIL.slice(0, ph === 'intro' ? 0 : ph === 'private' ? 4 : 6).map((l) => ({ t: l, on: S.lines.includes(NAT_IN_FAIL.indexOf(l)) }));
    const topo = (
      <Topo label={t('the server tries to reach the laptop', 'máy chủ thử gọi vào laptop')} w={520} h={170}
        pill={ph === 'private' ? '!N — Network is unreachable' : ph === 'refused' ? 'RST — Connection refused' : ph === 'ok' ? 'DNAT ⇒ 192.168.50.10:8080' : ph === 'dnat' ? 'iptables … -j DNAT' : undefined}
        k={ph === 'ok' || ph === 'dnat' ? '#16a34a' : '#dc2626'}
        nodes={[
          { id: 'laptop', x: 60, y: 96, icon: '💻', name: 'laptop', sub: '192.168.50.10', sub2: ':8080 dev server', on: ph === 'ok', w: 112 },
          { id: 'gw', x: 210, y: 96, icon: '🏠', name: 'homegw', sub: '198.51.100.2', on: ph === 'refused' || ph === 'dnat', bad: ph === 'refused', w: 112 },
          { id: 'net', x: 350, y: 96, icon: '🏭', name: 'dc / isp', sub: '203.0.113.1', bad: ph === 'private', w: 100 },
          { id: 'srv', x: 466, y: 96, icon: '🌐', name: 'server', sub: '203.0.113.10', on: ph !== 'intro', w: 100 },
        ]}
        links={[
          { a: 'laptop', b: 'gw', on: ph === 'ok', back: true },
          { a: 'gw', b: 'net', on: ph === 'refused' || ph === 'ok', back: true },
          { a: 'net', b: 'srv', on: ph === 'refused' || ph === 'ok', back: true, bad: ph === 'private' },
        ]}
        marks={ph === 'private' ? [{ x: 350, y: 150, text: t('no route to 192.168.x', 'không có tuyến tới 192.168.x'), bad: true }] : ph === 'refused' ? [{ x: 210, y: 150, text: t('nothing listens on 8080', 'không ai nghe ở 8080'), bad: true }] : ph === 'ok' ? [{ x: 60, y: 150, text: 'hello ✓', ok: true }] : undefined} />
    );
    return (
      <>
        <div className={s.bar} data-tour="nat-dnat">
          <button type="button" className={cx(s.btn, dnat ? s.on : s.primary)} disabled={dnat} onClick={addDnat}>🔓 {dnat ? t('port 8080 forwarded to the laptop', 'đã mở cổng 8080 về laptop') : t('Add port forwarding (DNAT) on homegw', 'Thêm mở cổng (DNAT) trên homegw')}</button>
          {dnat && <button type="button" className={s.btn} onClick={() => { setDnat(false); p.reset(); labSfx('off'); }}>{t('remove the rule', 'gỡ luật')}</button>}
        </div>
        <Controls p={p} lang={lang} />
        <Explain tone={S.tone}>{t(S.en, S.vi)}</Explain>
        <div className={s.panel} style={{ padding: 6 }} data-tour="nat-in-topo">{topo}</div>
        <div className={n.cols}>
          <div className={s.stack} style={{ gap: 8 }}>
            <Term lang={lang} tour="nat-in-term" title={t('on the server', 'trên máy chủ')} real lines={[...failLines, ...(ph === 'ok' ? NAT_IN_OK.map((l, k) => ({ t: l, on: k === 1 })) : [])]} />
            {dnat && <Term lang={lang} title={t('on homegw', 'trên homegw')} real wrap lines={[NAT_DNAT[0], '$ iptables -t nat -S PREROUTING', { t: NAT_DNAT[1], on: ph === 'dnat' }]} />}
          </div>
          <WhereBox focus="conntrack" lang={lang} height={160} />
        </div>
      </>
    );
  })();

  // ───────── cgnat ─────────
  const cgView = pre === 'cgnat' && (() => {
    const S = G;
    const ph = S.phase;
    const k0 = cg.findIndex((x) => x.phase === ph);
    const before: Tuple = { src: '100.64.0.10', sport: 47852, dst: '203.0.113.10', dport: 80 };
    const after: Tuple = { ...before, src: '198.51.100.200' };
    const lines: TLine[] = [
      '$ ip -br -4 addr show eth0  # mobile', { t: CGNAT_MOBILE[0], on: ph === 'intro' },
      ...(k0 >= 1 ? ['$ iptables -t nat -S POSTROUTING  # isp', { t: CGNAT_RULE[0], on: ph === 'snat' }, '$ conntrack -L -s 100.64.0.10 -p tcp  # isp', { t: CGNAT_CONNTRACK[0], on: ph === 'snat' }] : []),
      ...(k0 >= 2 ? ['$ curl -s http://203.0.113.10/  # mobile', { t: CGNAT_MOBILE[1], on: ph === 'seen' }] : []),
      ...(k0 >= 3 ? CGNAT_IN.map((l, k) => ({ t: l, on: k === 1 && ph === 'inbound' })) : []),
    ];
    const topo = (
      <Topo label={t('4G phone behind the ISP’s NAT', 'điện thoại 4G sau NAT của nhà mạng')} w={520} h={170}
        pill={ph === 'snat' ? 'SNAT 100.64.0.10 → 198.51.100.200' : ph === 'inbound' ? t('inbound: refused', 'gọi vào: bị từ chối') : undefined}
        k={ph === 'inbound' ? '#dc2626' : '#2563eb'}
        nodes={[
          { id: 'm', x: 62, y: 96, icon: '📱', name: 'mobile (4G)', sub: '100.64.0.10', on: ph === 'intro', w: 112 },
          { id: 'isp', x: 250, y: 96, icon: '🏢', name: t('isp (CGNAT)', 'isp (CGNAT)'), sub: 'mob0 100.64.0.1', sub2: '⇒ 198.51.100.200', on: ph === 'snat' || ph === 'inbound', bad: ph === 'inbound', w: 136 },
          { id: 'srv', x: 460, y: 96, icon: '🌐', name: 'server', sub: '203.0.113.10', on: ph === 'seen', w: 100 },
        ]}
        links={[{ a: 'm', b: 'isp', on: ph === 'snat' || ph === 'seen' }, { a: 'isp', b: 'srv', on: ph === 'seen' || ph === 'inbound', back: ph === 'inbound' }]}
        marks={ph === 'inbound' ? [{ x: 250, y: 150, text: t('not your box', 'không phải hộp của bạn'), bad: true }] : undefined} />
    );
    return (
      <>
        <div className={s.bar}>
          <button type="button" className={s.btn} disabled title={t('The NAT is on the ISP’s router — you cannot add rules there', 'NAT nằm trên router của nhà mạng — bạn không thêm luật ở đó được')}>🔒 {t('Add port forwarding… (the NAT box belongs to the ISP)', 'Thêm mở cổng… (hộp NAT là của nhà mạng)')}</button>
        </div>
        <Controls p={p} lang={lang} />
        <Explain tone={S.tone}>{t(S.en, S.vi)}</Explain>
        <div className={n.cols}>
          <div className={s.stack} style={{ gap: 8 }}>
            <div className={s.panel} style={{ padding: 6 }} data-tour="nat-cg-topo">{topo}</div>
            {k0 >= 1 && <div className={s.panel}><Hdr lang={lang} title={t('leaving the phone', 'rời điện thoại')} t={before} /><div style={{ marginTop: 6 }}><Hdr lang={lang} title={t('after the ISP’s NAT', 'sau NAT của nhà mạng')} t={after} chg="src" /></div></div>}
            {ph === 'docker' && <Term lang={lang} tour="nat-docker" title="$ docker run -p 18080:80 … nginx" real wrap lines={[`$ docker inspect … IPAddress`, DOCKER_P[0], '$ iptables -t nat -S DOCKER | grep 18080', { t: DOCKER_P[1], on: true }, '$ iptables -t nat -S POSTROUTING', { t: DOCKER_P[2], on: true }, '$ curl http://127.0.0.1:18080/', DOCKER_P[3]]} />}
          </div>
          <div className={s.stack} style={{ gap: 8 }}>
            <Term lang={lang} tour="nat-cg-term" real wrap lines={lines} />
            <WhereBox focus="conntrack" lang={lang} height={150} />
          </div>
        </div>
      </>
    );
  })();

  return (
    <Frame badge={t('Network lab', 'Phòng lab mạng')} title={t('NAT: many devices, one public address', 'NAT: nhiều máy, một địa chỉ công cộng')}
      sub={t('Real tcpdump and conntrack from the home router of the course’s “Internet in a box”', 'tcpdump và conntrack thật từ router nhà trong “Internet in a box” của khoá')}>
      <div className={n.nl}>
        <div className={s.bar} data-tour="nat-preset">
          <Seg label={t('Scenario', 'Kịch bản')} value={pre} options={[['home', t('going out', 'đi ra')], ['inbound', t('coming in', 'đi vào')], ['cgnat', t('4G / CGNAT', '4G / CGNAT')]]} onChange={load} />
        </div>
        {homeView}{inboundView}{cgView}
        <div className={n.note}>{t('NAT (Network Address Translation) = the router rewrites addresses (and ports) in packets as they pass. conntrack = its notebook of open connections, so answers can be rewritten back.', 'NAT (dịch địa chỉ mạng) = router viết lại địa chỉ (và cổng) trong gói khi chúng đi qua. conntrack = cuốn sổ các kết nối đang mở của nó, để viết ngược lại cho câu trả lời.')}</div>
      </div>
    </Frame>
  );
}
