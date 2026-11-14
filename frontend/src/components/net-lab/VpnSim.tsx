'use client';
/**
 * VPN cho lập trình viên (Chương 14.4): WireGuard split/full, ở trường UDP bị bỏ ⇒ OpenVPN TCP 443 sau sslh, rò DNS, kill switch.
 *   route  — laptop ở nhà: split / full tunnel ⇒ gói đi đường nào, trang thấy IP nào
 *   school — WireGuard (UDP) · OpenVPN 443 (DNS trường ⇒ rò / DNS VPN ⇒ kín) · mạng lưới DERP (tính ra, lab offline không đo)
 *   kill   — VPN sập: OpenVPN không kill switch ⇒ lộ IP trường · wg-quick full ⇒ gói bị giữ
 * Engine: engine/vpn.ts · số liệu thật: engine/capture144.ts.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { killScript, routeScript, schoolScript, type Dns, type Kill, type Mode, type Tun, type VNode } from './engine/vpn';
import { Controls, Explain, Frame, Seg, css as s, tx, usePlayer, type Lang } from '../os-lab/ui';
import { WhereBox } from '../os-lab/where';
import { useLabBridge, useOwnStepSound } from '../labs/bus';
import { labSfx } from '../labs/sfx';
import { Src, Term, Topo, type TNode, type TLink } from './parts';
import n from './netlab.module.css';

type Preset = 'route' | 'school' | 'kill';
const PRESETS: Preset[] = ['route', 'school', 'kill'];

export default function VpnSim({ lang = 'vi', preset = 'route' }: { lang?: Lang; preset?: string }) {
  const t = (en: string, vi: string) => tx(lang, en, vi);
  const [pre, setPre] = useState<Preset>(PRESETS.includes(preset as Preset) ? (preset as Preset) : 'route');
  const [mode, setMode] = useState<Mode>('split');
  const [tun, setTun] = useState<Tun>('wg');
  const [dns, setDns] = useState<Dns>('school');
  const [kill, setKill] = useState<Kill>('ovpn');
  const steps = useMemo(() => (pre === 'route' ? routeScript(mode) : pre === 'school' ? schoolScript(tun, dns) : killScript(kill)), [pre, mode, tun, dns, kill]);
  const p = usePlayer(steps.length, 2100);
  const S = steps[Math.min(p.i, steps.length - 1)];
  useOwnStepSound();
  const prev = useRef(p.i);
  useEffect(() => { if (p.i > prev.current) labSfx(S.tone === 'bad' ? 'oops' : S.tone === 'ok' ? 'step-ok' : 'tick'); prev.current = p.i; }, [p.i, S]);
  const key = `${pre}|${mode}|${tun}|${dns}|${kill}`;
  useEffect(() => { p.reset(); }, [key]); // eslint-disable-line react-hooks/exhaustive-deps
  const load = (k: Preset) => { setPre(k); labSfx('tap'); };
  const pick = <T,>(set: (v: T) => void) => (v: T) => { set(v); labSfx('tap'); };
  const upTo = steps.slice(0, p.i + 1);
  const leak = upTo.some((x) => x.leak);
  const seesNow = [...upTo].reverse().find((x) => x.sees)?.sees;
  const leakSees = upTo.find((x) => x.leak)?.sees;
  useLabBridge('vpn', { preset: pre, i: p.i, atEnd: p.atEnd, mode, tun, dns, kill, tone: S.tone ?? '', ip: S.ip ?? '', leak }, {
    preset: (v) => load(String(v) as Preset), mode: (v) => setMode(String(v) as Mode), tun: (v) => setTun(String(v) as Tun), dns: (v) => setDns(String(v) as Dns), kill: (v) => setKill(String(v) as Kill),
  });

  // ── sơ đồ ──
  const cy = 92;
  const atHome = pre === 'route' || (pre === 'kill' && kill === 'wg');
  const nodes: TNode[] = [
    { id: 'laptop', x: 76, y: cy, icon: '💻', name: 'laptop', sub: atHome ? '192.168.1.20' : '10.20.2.159', sub2: S.tunnel ? (pre === 'school' && tun === 'ovpn' || (pre === 'kill' && kill === 'ovpn') ? 'tun0 10.67.0.2' : 'wg0 10.66.0.2') : undefined, on: S.focus === 'laptop', w: 132 },
    { id: 'local', x: 228, y: cy, icon: atHome ? '📶' : '🧱', name: atHome ? t('home + CGNAT', 'nhà + CGNAT') : t('school firewall', 'tường lửa trường'), sub: atHome ? '→ 198.18.0.40' : t('UDP dropped', 'bỏ UDP'), on: S.focus === 'local', bad: S.tone === 'bad' && S.focus === 'local', w: 140 },
    { id: 'vps', x: 388, y: cy, icon: '🖥️', name: 'vps.example', sub: (pre === 'school' && tun === 'ovpn') || (pre === 'kill' && kill === 'ovpn') ? 'sslh :443' : 'wg0 :51820', sub2: '198.18.0.30', on: S.focus === 'vps', w: 130 },
    { id: 'site', x: 540, y: cy, icon: '🌐', name: pre === 'school' && tun === 'mesh' ? t('home PC', 'máy ở nhà') : 'news.test', sub: S.ip ? t(`sees ${S.ip}`, `thấy ${S.ip}`) : '198.18.0.10', on: S.focus === 'site', bad: S.tone === 'bad' && S.focus === 'site', w: 120 },
    ...(pre === 'school' && tun === 'ovpn' ? [{ id: 'dns', x: 228, y: cy + 82, icon: '📒', name: t('school DNS', 'DNS trường'), sub: '10.20.2.1', on: S.focus === 'dns', bad: S.focus === 'dns', w: 130 }] : []),
    ...(pre === 'school' && tun === 'mesh' ? [{ id: 'derp', x: 388, y: cy + 82, icon: '📡', name: 'DERP :443', sub: t('relay (computed)', 'trạm (tính ra)'), on: S.focus === 'derp', w: 130 }] : []),
  ];
  const H = nodes.some((x) => x.y > cy) ? 236 : 170;
  const hop = S.hop;
  const on = (a: VNode, b: VNode) => !!hop && ((hop.from === a && hop.to === b) || (hop.from === b && hop.to === a));
  const lock = S.tunnel ? '🔒' : undefined;
  const links: TLink[] = [
    { a: 'laptop', b: 'local', label: lock, on: on('laptop', 'local'), bad: !!hop?.bad && on('laptop', 'local') },
    { a: 'local', b: 'vps', label: lock, on: on('local', 'vps'), bad: !!hop?.bad && on('local', 'vps'), dashed: S.tone === 'bad' && hop?.to === 'vps' },
    { a: 'vps', b: 'site', on: on('vps', 'site') },
    { a: 'local', b: 'site', on: on('local', 'site'), bad: !!hop?.bad && on('local', 'site'), dashed: true },
    ...(pre === 'school' && tun === 'ovpn' ? [{ a: 'laptop', b: 'dns', on: on('laptop', 'dns'), bad: true }] : []),
    ...(pre === 'school' && tun === 'mesh' ? [{ a: 'local', b: 'derp', on: on('local', 'derp') }, { a: 'derp', b: 'site', on: p.atEnd }] : []),
  ];
  const k = S.tone === 'bad' ? '#dc2626' : S.tunnel ? '#0f766e' : '#2563eb';
  const topo = <Topo label={t('laptop, the local network, the VPS, a website', 'laptop, mạng tại chỗ, VPS, một trang web')} w={610} h={H} nodes={nodes} links={links} pill={hop ? (lang === 'vi' && hop.vi ? hop.vi : hop.label) : undefined} k={k} />;
  const outs = S.term.filter((l) => !l.t.startsWith('$ '));
  const allReal = outs.every((l) => l.real);

  return (
    <Frame badge={t('Network lab', 'Phòng lab mạng')} title={t('VPNs for developers', 'VPN cho lập trình viên')}
      sub={t('WireGuard split / full, UDP dropped at school, OpenVPN over 443, DNS leaks and the kill switch — real lab lines', 'WireGuard split / full, trường bỏ UDP, OpenVPN qua 443, rò DNS và kill switch — dòng thật từ lab')}>
      <div className={n.nl}>
        <div className={s.bar} data-tour="vpn-preset">
          <Seg label={t('Scenario', 'Kịch bản')} value={pre} options={[['route', t('split / full', 'split / full')], ['school', t('at school', 'ở trường')], ['kill', t('VPN dies', 'VPN sập')]]} onChange={load} />
        </div>
        <div className={s.bar} data-tour="vpn-opts">
          {pre === 'route' && <Seg label={t('AllowedIPs', 'AllowedIPs')} value={mode} options={[['split', 'split · 10.66.0.0/24'], ['full', 'full · 0.0.0.0/0']]} onChange={pick(setMode)} />}
          {pre === 'school' && <>
            <Seg label={t('Tunnel', 'Đường hầm')} value={tun} options={[['wg', 'WireGuard UDP 51820'], ['ovpn', 'OpenVPN TCP 443'], ['mesh', t('mesh + DERP', 'mạng lưới + DERP')]]} onChange={pick(setTun)} />
            {tun === 'ovpn' && <Seg label="DNS" value={dns} options={[['school', t('school DNS', 'DNS trường')], ['vpn', t('VPN DNS', 'DNS của VPN')]]} onChange={pick(setDns)} />}
          </>}
          {pre === 'kill' && <Seg label={t('Which VPN dies', 'VPN nào sập')} value={kill} options={[['ovpn', t('OpenVPN (no kill switch)', 'OpenVPN (không kill switch)')], ['wg', t('wg-quick full tunnel', 'wg-quick full tunnel')]]} onChange={pick(setKill)} />}
        </div>
        <Controls p={p} lang={lang} />
        <Explain tone={S.tone}>{t(S.en, S.vi)}</Explain>
        <div className={n.cols}>
          <div className={s.stack} style={{ gap: 8 }}>
            <div className={s.panel} style={{ padding: 6 }} data-tour="vpn-topo">{topo}</div>
            <Term lang={lang} tour="vpn-term" title="terminal" wrap lines={S.term.map((l) => (l.t.startsWith('$ ') ? { t: l.t, dim: true } : { t: l.t, on: l.real, calc: !l.real }))}
              badge={outs.length ? <Src real={allReal} lang={lang} en={allReal ? 'real lab output' : 'computed (not measured)'} vi={allReal ? 'output lab thật' : 'tính ra (chưa đo)'} /> : undefined} />
          </div>
          <div className={s.stack} style={{ gap: 8 }}>
            <div className={s.panel} data-tour="vpn-sees">
              <div className={s.panelTitle}>👀 {t('Who sees what', 'Ai thấy gì')}</div>
              <table className={n.rt}><tbody>
                <tr className={leak ? n.rtBad : undefined}><td>{atHome ? t('home network / ISP', 'mạng nhà / nhà mạng') : t('school', 'trường')}</td><td>{seesNow ? t(seesNow.en, seesNow.vi) : '…'}{leakSees && leakSees !== seesNow ? <> · <b>{t(leakSees.en, leakSees.vi)}</b></> : null}</td></tr>
                <tr><td>{t('the website', 'trang web')}</td><td>{S.ip ? <code>{S.ip}</code> : '…'}</td></tr>
                <tr><td>{t('VPN operator', 'người vận hành VPN')}</td><td>{S.tunnel ? t('everything inside the tunnel (HTTP in clear)', 'mọi thứ trong hầm (HTTP ở dạng rõ)') : '—'}</td></tr>
              </tbody></table>
              {leak && <div className={s.small} style={{ color: 'var(--ol-bad)' }}>⚠️ {t('leak: something left outside the tunnel', 'rò: có thứ đi ra ngoài đường hầm')}</div>}
            </div>
            <WhereBox focus={S.where} lang={lang} height={150} />
          </div>
        </div>
        <div className={n.note}>{t('Like everyday life: a VPN is a private pipe inside the shared water main — the city still carries it, nobody along the way sees inside; the person at the other end of the pipe (the VPN operator) does.', 'Như đời thường: VPN là ống nước riêng đặt trong đường ống chung — thành phố vẫn chở nó, không ai dọc đường thấy bên trong; người đứng ở đầu kia ống (người vận hành VPN) thì thấy.')}</div>
      </div>
    </Frame>
  );
}
