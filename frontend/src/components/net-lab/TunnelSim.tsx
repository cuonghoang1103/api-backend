'use client';
/**
 * SSH khi cổng 22 bị chặn (Chương 14.3): cửa phụ 993 + ~/.ssh/config tự chọn cổng, đường hầm -L/-R, proxy SOCKS -D.
 *   port    — ở trường / ở nhà × khối Match đứng trước / sau Host vps ⇒ ssh chọn 22 hay 993, gói chết hay qua
 *   forward — -L (kéo redis của VPS về) · -R chỉ 127.0.0.1 · -R 0.0.0.0 + GatewayPorts (khoe demo)
 *   socks   — gọi thẳng (SNI reset) · socks5h · socks5 (rò DNS) · phim.test qua socks5h · người lạ dùng SOCKS mở toang
 * Engine: engine/tunnel.ts · số liệu thật: engine/capture143.ts (lab "Wi-Fi trường trong một hộp" mở rộng, vps.example).
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { configLines, forwardScript, portScript, socksScript, chosenPort, type Fwd, type NodeId, type Order, type Place, type SocksReq } from './engine/tunnel';
import { Controls, Explain, Frame, Seg, css as s, cx, tx, usePlayer, type Lang } from '../os-lab/ui';
import { WhereBox } from '../os-lab/where';
import { useLabBridge, useOwnStepSound } from '../labs/bus';
import { labSfx } from '../labs/sfx';
import { Src, Term, Topo, type TNode, type TLink } from './parts';
import n from './netlab.module.css';

type Preset = 'port' | 'forward' | 'socks';
const PRESETS: Preset[] = ['port', 'forward', 'socks'];

export default function TunnelSim({ lang = 'vi', preset = 'port' }: { lang?: Lang; preset?: string }) {
  const t = (en: string, vi: string) => tx(lang, en, vi);
  const [pre, setPre] = useState<Preset>(PRESETS.includes(preset as Preset) ? (preset as Preset) : 'port');
  const [place, setPlace] = useState<Place>('school');
  const [order, setOrder] = useState<Order>('last');
  const [fwd, setFwd] = useState<Fwd>('L');
  const [req, setReq] = useState<SocksReq>('direct');
  const steps = useMemo(() => (pre === 'port' ? portScript(place, order) : pre === 'forward' ? forwardScript(fwd) : socksScript(req)), [pre, place, order, fwd, req]);
  const p = usePlayer(steps.length, 2100);
  const S = steps[Math.min(p.i, steps.length - 1)];
  useOwnStepSound();
  const prev = useRef(p.i);
  useEffect(() => { if (p.i > prev.current) labSfx(S.tone === 'bad' ? 'oops' : S.tone === 'ok' ? 'step-ok' : 'tick'); prev.current = p.i; }, [p.i, S]);
  const key = `${pre}|${place}|${order}|${fwd}|${req}`;
  useEffect(() => { p.reset(); }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  const load = (k: Preset) => { setPre(k); labSfx('tap'); };
  const pick = <T,>(set: (v: T) => void) => (v: T) => { set(v); labSfx('tap'); };
  useLabBridge('tunnel', { preset: pre, i: p.i, atEnd: p.atEnd, place, order, port: chosenPort(place, order), fwd, req, tone: S.tone ?? '' }, {
    preset: (v) => load(String(v) as Preset), place: (v) => setPlace(String(v) as Place), order: (v) => setOrder(String(v) as Order),
    fwd: (v) => setFwd(String(v) as Fwd), req: (v) => setReq(String(v) as SocksReq),
  });

  // ── sơ đồ ──
  const cy = 92;
  const right: TNode | null = pre === 'port' ? null : pre === 'forward'
    ? (fwd === 'L' ? { id: 'site', x: 540, y: cy, icon: '🗄️', name: 'redis', sub: '127.0.0.1:6379', sub2: t('on the VPS', 'trên VPS'), w: 120 } : { id: 'friend', x: 540, y: cy, icon: '🏠', name: t('friend', 'bạn ở nhà'), sub: 'curl :8080', w: 120 })
    : { id: 'site', x: 540, y: cy, icon: '🌐', name: req === 'stranger' ? 'news.test' : req === 'direct' || req === 'socks5h' ? 'social.test' : 'phim.test', sub: '198.18.0.10', w: 120 };
  const placeHome = pre === 'port' && place === 'home';
  const nodes: TNode[] = [
    { id: 'laptop', x: 76, y: cy, icon: '💻', name: 'laptop', sub: placeHome ? '192.168.1.20' : '10.20.2.159', sub2: pre === 'socks' ? 'SOCKS :1080' : pre === 'forward' && fwd === 'L' ? ':16379' : pre === 'forward' ? 'demo :3000' : undefined, on: S.focus === 'laptop', w: 130 },
    { id: 'fw', x: 228, y: cy, icon: placeHome ? '📶' : '🧱', name: placeHome ? t('home router', 'router nhà') : t('school firewall', 'tường lửa trường'), sub: placeHome ? t('all ports out', 'mọi cổng ra') : '80·443·587·993', on: S.focus === 'fw', bad: S.tone === 'bad' && S.focus === 'fw', w: 140 },
    { id: 'vps', x: 388, y: cy, icon: '🖥️', name: 'vps.example', sub: ':22 · :993', sub2: '198.18.0.30', on: S.focus === 'vps', w: 130 },
    ...(right ? [{ ...right, on: S.focus === right.id, bad: S.tone === 'bad' && S.focus === right.id }] : []),
    ...(pre === 'socks' && req === 'socks5' ? [{ id: 'dns', x: 228, y: cy + 82, icon: '📒', name: t('school DNS', 'DNS trường'), sub: 'NXDOMAIN', on: S.focus === 'dns', bad: S.focus === 'dns', w: 130 }] : []),
    ...(pre === 'socks' && req === 'stranger' ? [{ id: 'ke', x: 76, y: cy + 82, icon: '🕵️', name: t('stranger', 'người lạ'), sub: t('same Wi-Fi', 'cùng Wi-Fi'), on: S.focus === 'ke', bad: true, w: 130 }] : []),
  ];
  const H = nodes.some((x) => x.y > cy) ? 236 : 170;
  const hop = S.hop;
  const on = (a: NodeId, b: NodeId) => !!hop && ((hop.from === a && hop.to === b) || (hop.from === b && hop.to === a) || (hop.tunnel && ['laptop', 'fw', 'vps'].includes(a) && ['fw', 'vps'].includes(b) && (hop.from === 'laptop' || hop.from === 'vps')));
  const tunnelLbl = S.tunnel ? '🔒' : undefined;
  const links: TLink[] = [
    { a: 'laptop', b: 'fw', label: tunnelLbl, on: on('laptop', 'fw'), bad: !!hop?.bad && (hop.to === 'fw' || hop.from === 'fw' || hop.from === 'laptop'), back: hop?.from === 'fw' || hop?.from === 'vps' },
    { a: 'fw', b: 'vps', label: tunnelLbl, on: on('fw', 'vps'), bad: !!hop?.bad && hop.from === 'fw', back: hop?.from === 'vps' && hop.to === 'laptop', dashed: S.tone === 'bad' && hop?.from === 'fw' },
    ...(right ? [{ a: 'vps', b: right.id, on: on('vps', right.id as NodeId) || on(right.id as NodeId, 'vps'), back: hop?.from === right.id, bad: !!hop?.bad && hop.from === right.id }] : []),
    ...(pre === 'socks' && req === 'socks5' ? [{ a: 'laptop', b: 'dns', on: on('laptop', 'dns'), bad: true }] : []),
    ...(pre === 'socks' && req === 'stranger' ? [{ a: 'ke', b: 'laptop', on: on('ke', 'laptop'), bad: true }] : []),
  ];
  const k = S.tone === 'bad' ? '#dc2626' : S.tunnel ? '#0f766e' : '#2563eb';
  const topo = <Topo label={t('laptop, the school firewall, the VPS', 'laptop, tường lửa trường, VPS')} w={610} h={H} nodes={nodes} links={links} pill={hop ? (lang === 'vi' && hop.vi ? hop.vi : hop.label) : undefined} k={k} />;

  const outs = S.term.filter((l) => !l.t.startsWith('$ '));
  const allReal = outs.every((l) => l.real);
  const cfg = configLines(order);
  const port = chosenPort(place, order);
  // dòng Port THẮNG: Port đầu tiên trong các khối áp dụng
  const winIdx = (() => {
    let inMatch = false, applies = true;
    for (let i = 0; i < cfg.length; i++) {
      const l = cfg[i];
      if (l.startsWith('Match')) { inMatch = true; applies = place === 'school'; continue; }
      if (l.startsWith('Host')) { inMatch = false; applies = true; continue; }
      if (l.trim().startsWith('Port') && applies) return i;
    }
    return -1;
  })();

  return (
    <Frame badge={t('Network lab', 'Phòng lab mạng')} title={t('SSH when port 22 is blocked', 'SSH khi cổng 22 bị chặn')}
      sub={t('A side door on 993, a config that picks the port, and tunnels -L / -R / -D — every line from the lab', 'Cửa phụ 993, config tự chọn cổng, và đường hầm -L / -R / -D — mọi dòng lấy từ lab')}>
      <div className={n.nl}>
        <div className={s.bar} data-tour="tun-preset">
          <Seg label={t('Scenario', 'Kịch bản')} value={pre} options={[['port', t('22 or 993?', '22 hay 993?')], ['forward', t('-L / -R', '-L / -R')], ['socks', t('-D SOCKS', '-D SOCKS')]]} onChange={load} />
        </div>
        <div className={s.bar} data-tour="tun-opts">
          {pre === 'port' && <>
            <Seg label={t('Where is the laptop?', 'Laptop đang ở đâu?')} value={place} options={[['school', t('at school', 'ở trường')], ['home', t('at home', 'ở nhà')]]} onChange={pick(setPlace)} />
            <Seg label={t('Match block', 'Khối Match')} value={order} options={[['last', t('after Host vps', 'sau Host vps')], ['first', t('first in the file', 'đầu tệp')]]} onChange={pick(setOrder)} />
          </>}
          {pre === 'forward' && <Seg label={t('Tunnel', 'Đường hầm')} value={fwd} options={[['L', '-L 16379:127.0.0.1:6379'], ['R', '-R 8080:localhost:3000'], ['R0', '-R 0.0.0.0:8080 + GatewayPorts']]} onChange={pick(setFwd)} />}
          {pre === 'socks' && <Seg label={t('Request', 'Request')} value={req} options={[['direct', t('direct social.test', 'gọi thẳng social.test')], ['socks5h', 'socks5h social.test'], ['socks5', 'socks5 phim.test'], ['phim5h', 'socks5h phim.test'], ['stranger', t('stranger on open SOCKS', 'người lạ dùng SOCKS mở')]]} onChange={pick(setReq)} />}
        </div>
        <Controls p={p} lang={lang} />
        <Explain tone={S.tone}>{t(S.en, S.vi)}</Explain>
        <div className={n.cols}>
          <div className={s.stack} style={{ gap: 8 }}>
            <div className={s.panel} style={{ padding: 6 }} data-tour="tun-topo">{topo}</div>
            <Term lang={lang} tour="tun-term" title="terminal" wrap lines={S.term.map((l) => (l.t.startsWith('$ ') ? { t: l.t, dim: true } : { t: l.t, on: l.real, calc: !l.real }))}
              badge={outs.length ? <Src real={allReal} lang={lang} en={allReal ? 'real lab output' : 'real + computed'} vi={allReal ? 'output lab thật' : 'thật + tính ra'} /> : undefined} />
          </div>
          <div className={s.stack} style={{ gap: 8 }}>
            {pre === 'port' && (
              <div className={s.panel} data-tour="tun-config">
                <div className={s.panelTitle}>~/.ssh/config — {t('read top to bottom, FIRST value wins', 'đọc từ trên xuống, giá trị ĐẦU TIÊN thắng')}</div>
                <pre className={s.small} style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{cfg.map((l, i) => (
                  <div key={i} style={i === winIdx ? { background: 'var(--ol-ok-bg, #dcfce7)', fontWeight: 700 } : l.trim().startsWith('Port') ? { opacity: 0.55, textDecoration: 'line-through' } : undefined}>{l}{i === winIdx ? `   ◀ ${t('used', 'được dùng')}` : ''}</div>
                ))}</pre>
                <div className={s.small}>{t(`Result: Port ${port}.`, `Kết quả: Port ${port}.`)} {place === 'school' && order === 'last' ? t('The Match block is true but too late.', 'Khối Match đúng nhưng đến quá muộn.') : ''}</div>
              </div>
            )}
            {S.sees && (
              <div className={s.panel} data-tour="tun-sees">
                <div className={s.panelTitle}>🧱 {t('What the school sees', 'Trường thấy gì')}</div>
                <div className={s.small}>{t(S.sees.en, S.sees.vi)}</div>
              </div>
            )}
            {pre === 'forward' && (
              <div className={s.panel} data-tour="tun-listen">
                <div className={s.panelTitle}>{t('Who listens, who exits', 'Ai nghe, ai đi ra')}</div>
                <table className={n.rt}><thead><tr><th>{t('flag', 'cờ')}</th><th>{t('listens on', 'nghe ở')}</th><th>{t('exits at', 'đi ra ở')}</th></tr></thead>
                  <tbody>
                    <tr className={cx(fwd === 'L' && n.rtNew)}><td><code>-L</code></td><td>laptop 127.0.0.1:16379</td><td>VPS → 127.0.0.1:6379</td></tr>
                    <tr className={cx(fwd === 'R' && n.rtBad)}><td><code>-R</code></td><td>VPS 127.0.0.1:8080</td><td>laptop → :3000</td></tr>
                    <tr className={cx(fwd === 'R0' && n.rtNew)}><td><code>-R 0.0.0.0</code></td><td>VPS 0.0.0.0:8080</td><td>laptop → :3000</td></tr>
                  </tbody></table>
              </div>
            )}
            <WhereBox focus={S.where} lang={lang} height={150} />
          </div>
        </div>
        <div className={n.note}>{t('Like everyday life: the main gate (22) is locked at night, the mail door (993) stays open; a tunnel is a private pipe through that door — the guard only sees the pipe. Port 22 on the VPS is held by systemd (ssh.socket); 993 by a separate ssh993.service.', 'Như đời thường: cổng chính (22) khoá ban đêm, cửa thư từ (993) vẫn mở; đường hầm là một ống riêng xuyên qua cửa đó — bảo vệ chỉ thấy cái ống. Cổng 22 trên VPS do systemd (ssh.socket) giữ; 993 do ssh993.service riêng.')}</div>
      </div>
    </Frame>
  );
}
