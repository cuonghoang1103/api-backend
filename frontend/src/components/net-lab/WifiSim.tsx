'use client';
/**
 * Wi-Fi trường (Chương 14.1): trang đăng nhập, đăng ký thiết bị theo MAC, "Địa chỉ Wi-Fi riêng".
 *   register — vào SSID đăng ký: DORA → câu hỏi dò bị chuyển hướng → HTTPS sai chứng chỉ → đăng nhập ghi tài khoản ↔ MAC
 *   private  — sang SSID có Internet với địa chỉ riêng Tắt / Cố định / Luân phiên (công tắc trên đầu)
 *   clone    — một tài khoản một MAC; máy thứ ba chép MAC ⇒ cùng IP, bảng MAC của switch lật, TCP RST
 * Engine: engine/wifi.ts · số liệu thật: engine/capture14.ts (lab "Wi-Fi trường trong một hộp").
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { MAC14 } from './engine/capture14';
import { wifiScript, type Mode, type Net, type Who } from './engine/wifi';
import { Controls, Explain, Frame, Seg, css as s, cx, tx, usePlayer, type Lang } from '../os-lab/ui';
import { WhereBox } from '../os-lab/where';
import { useLabBridge, useOwnStepSound } from '../labs/bus';
import { labSfx } from '../labs/sfx';
import { Src, Term, Topo, type TNode, type TLink } from './parts';
import n from './netlab.module.css';

type Preset = 'register' | 'private' | 'clone';
const PRESETS: Preset[] = ['register', 'private', 'clone'];
const KIND_COLOR = { dhcp: '#7c3aed', http: '#2563eb', https: '#0f766e', login: '#e06d10', data: '#2563eb', rst: '#dc2626' } as const;
const NAME: Record<Who, [string, string]> = { mac: ['MacBook', 'MacBook'], win: ['Windows laptop', 'Laptop Windows'], ke: ['copy-cat', 'máy chép MAC'] };
const NET_TXT: Record<Net, [string, string, 'ok' | 'bad' | 'warn' | undefined]> = {
  none: ['not tested yet', 'chưa thử', undefined], portal: ['login page only', 'chỉ có trang đăng nhập', 'warn'], ok: ['Internet OK', 'có Internet', 'ok'],
  blocked: ['blocked — not registered', 'bị chặn — chưa đăng ký', 'bad'], kicked: ['kicked — account moved', 'bị đá — tài khoản đã chuyển', 'bad'], reset: ['connection reset', 'kết nối bị reset', 'bad'],
};
/** ký tự hex thứ hai ∈ {2,6,a,e} ⇒ bit "tự quản" = 1 ⇒ địa chỉ riêng/ngẫu nhiên */
export const laRieng = (mac: string) => '26ae'.includes(mac[1]?.toLowerCase() ?? '');

export default function WifiSim({ lang = 'vi', preset = 'register' }: { lang?: Lang; preset?: string }) {
  const t = (en: string, vi: string) => tx(lang, en, vi);
  const [pre, setPre] = useState<Preset>(PRESETS.includes(preset as Preset) ? (preset as Preset) : 'register');
  const [mode, setMode] = useState<Mode>(preset === 'private' ? 'fixed' : 'fixed');
  const steps = useMemo(() => wifiScript(pre, mode), [pre, mode]);
  const p = usePlayer(steps.length, 2100);
  const S = steps[Math.min(p.i, steps.length - 1)];
  useOwnStepSound();
  const prev = useRef(p.i);
  useEffect(() => { if (p.i > prev.current) labSfx(S.tone === 'bad' ? 'oops' : S.tone === 'ok' ? 'step-ok' : 'tick'); prev.current = p.i; }, [p.i, S]);
  const load = (k: Preset) => { setPre(k); p.reset(); labSfx('tap'); };
  const pickMode = (m: Mode) => { setMode(m); p.reset(); labSfx(m === 'off' ? 'on' : 'off'); };

  useLabBridge('wifi', {
    preset: pre, i: p.i, atEnd: p.atEnd, mode, macNet: S.net.mac ?? '', winNet: S.net.win ?? '', keNet: S.net.ke ?? '',
    regMac: S.reg[0]?.mac ?? '', macUsed: S.mac.mac ?? '', flips: S.flips ?? 0,
  }, { preset: (v) => load(String(v) as Preset), mode: (v) => pickMode(String(v) as Mode) });

  // ── sơ đồ ──
  const who: Who[] = pre === 'clone' ? (S.mac.mac ? ['mac', 'win', 'ke'] : ['win', 'ke']) : ['mac'];
  const H = who.length === 1 ? 150 : who.length === 2 ? 210 : 250;
  const cy = H / 2 + 6;
  const ys = who.length === 1 ? [cy] : who.length === 2 ? [cy - 52, cy + 52] : [cy - 80, cy, cy + 80];
  const F = S.frame;
  const k = F ? KIND_COLOR[F.kind] : '#2563eb';
  const nodes: TNode[] = [
    ...who.map((w, i) => ({
      id: w, x: 84, y: ys[i], icon: w === 'mac' ? '💻' : w === 'win' ? '🖥️' : '🕵️', name: t(...NAME[w]), w: 168,
      sub: S.mac[w] ?? '—', sub2: `${S.ssid[w] === 'dk' ? 'SSID 1 · ' : S.ssid[w] === 'sv' ? 'SSID 2 · ' : ''}${S.ip[w] ?? t('no IP', 'chưa có IP')}`,
      on: S.focus === w, bad: S.net[w] === 'blocked' || S.net[w] === 'kicked' || S.net[w] === 'reset',
    })),
    { id: 'gw', x: 366, y: cy, icon: pre === 'clone' && S.port ? '🔀' : '🛂', name: t('AP + controller', 'điểm phát + bộ điều khiển'), sub: 'dk0 10.20.1.1 · sv0 10.20.2.1', sub2: pre === 'clone' && S.port ? `switch: 8c:8d:28… → ${S.port === 'win' ? 'Windows' : t('copy', 'máy chép')}` : t('DHCP · DNS · login · firewall', 'DHCP · DNS · đăng nhập · tường lửa'), on: S.focus === 'gw' || S.focus === 'sw', w: 236 },
    { id: 'net', x: 546, y: cy, icon: '🌐', name: 'Internet', sub: 'news.test', sub2: '198.18.0.10', w: 104 },
  ];
  const links: TLink[] = [
    ...who.map((w) => ({ a: w, b: 'gw', label: S.ssid[w] === 'dk' ? 'SSID 1' : S.ssid[w] === 'sv' ? 'SSID 2' : undefined, dashed: !S.ssid[w], on: !!F && (F.from === w || F.to === w), bad: !!F?.bad && (F.from === w || F.to === w), back: !!F && F.to === w })),
    { a: 'gw', b: 'net', on: !!F && (F.to === 'net' || F.from === 'net'), back: F?.from === 'net' },
  ];
  const topo = <Topo label={t('laptops, the Wi-Fi controller and the Internet', 'các laptop, bộ điều khiển Wi-Fi và Internet')} w={604} h={H} nodes={nodes} links={links} pill={F ? (lang === 'vi' && F.vi ? F.vi : F.label) : undefined} k={k} />;

  const statusCard = (w: Who) => {
    const st = S.net[w];
    if (!st || !S.mac[w]) return null;
    const [en, vi, tone] = NET_TXT[st];
    const mac = S.mac[w]!;
    return (
      <div key={w} className={cx(n.hostCard, S.focus === w && n.hostOn)}>
        <h5>{w === 'mac' ? '💻' : w === 'win' ? '🖥️' : '🕵️'} {t(...NAME[w])}</h5>
        <div className={s.small}><span className={s.mono}>{mac}</span> — {t('2nd hex character', 'ký tự hex thứ hai')} <b className={s.mono}>{mac[1]}</b> ⇒ <b>{laRieng(mac) ? t('private / random', 'riêng / ngẫu nhiên') : t('factory (hardware)', 'nhà máy (phần cứng)')}</b></div>
        <div className={cx(n.verdict, tone === 'ok' ? n.vOk : tone === 'bad' ? n.vBad : undefined)} style={{ marginTop: 4 }}>{t(en, vi)}</div>
      </div>
    );
  };

  return (
    <Frame badge={t('Network lab', 'Phòng lab mạng')} title={t('School Wi-Fi: login page and MAC registration', 'Wi-Fi trường: trang đăng nhập và đăng ký MAC')}
      sub={t('Two SSIDs, one controller that writes account ↔ MAC — the lab "school Wi-Fi in a box"', 'Hai SSID, một bộ điều khiển ghi tài khoản ↔ MAC — lab "Wi-Fi trường trong một hộp"')}>
      <div className={n.nl}>
        <div className={s.bar} data-tour="wifi-preset">
          <Seg label={t('Scenario', 'Kịch bản')} value={pre} options={[['register', t('register', 'đăng ký')], ['private', t('private address', 'địa chỉ riêng')], ['clone', t('one account, two laptops', 'một tài khoản, hai máy')]]} onChange={load} />
          {pre !== 'clone' && <span data-tour="wifi-mode"><Seg label={t('MacBook — Private Wi-Fi address', 'MacBook — Địa chỉ Wi-Fi riêng')} value={mode} options={[['off', t('Off', 'Tắt')], ['fixed', t('Fixed', 'Cố định')], ['rotating', t('Rotating', 'Luân phiên')]]} onChange={pickMode} /></span>}
        </div>
        <Controls p={p} lang={lang} />
        <Explain tone={S.tone}>{t(S.en, S.vi)}</Explain>
        <div className={n.cols}>
          <div className={s.stack} style={{ gap: 8 }}>
            <div className={s.panel} style={{ padding: 6 }} data-tour="wifi-topo">{topo}</div>
            <Term lang={lang} tour="wifi-term" title={t('terminal / controller log', 'terminal / nhật ký bộ điều khiển')} wrap lines={S.term.map((l) => ({ t: l.t, calc: !l.real, on: l.real }))} badge={<Src real={S.term.every((l) => l.real)} lang={lang} en={S.term.every((l) => l.real) ? 'real lab output' : 'real + computed'} vi={S.term.every((l) => l.real) ? 'output lab thật' : 'thật + tính ra'} />} />
          </div>
          <div className={s.stack} style={{ gap: 8 }}>
            <div className={s.panel} data-tour="wifi-reg">
              <div className={s.panelTitle}>{t('Controller: account ↔ MAC (one MAC per account)', 'Bộ điều khiển: tài khoản ↔ MAC (mỗi tài khoản một MAC)')}</div>
              {S.reg.length ? (
                <table className={n.rt}><thead><tr><th>{t('account', 'tài khoản')}</th><th>MAC</th><th>{t('allowed on SSID 2', 'được qua ở SSID 2')}</th></tr></thead>
                  <tbody>{S.reg.map((r) => <tr key={r.acct + r.mac} className={cx(r.hl && n.rtNew)}><td><code>{r.acct}</code></td><td><code>{r.mac}</code></td><td>✅ {t('only this MAC', 'chỉ MAC này')}</td></tr>)}</tbody></table>
              ) : <span className={s.empty}>{t('(empty — nobody has logged in)', '(trống — chưa ai đăng nhập)')}</span>}
            </div>
            <div className={n.hosts} data-tour="wifi-status">{(['mac', 'win', 'ke'] as Who[]).map(statusCard)}</div>
            {pre === 'clone' && (
              <div className={s.panel} data-tour="wifi-fdb">
                <div className={s.panelTitle} style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>{t('Switch table: where is 8c:8d:28:4e:7a:12?', 'Bảng của switch: 8c:8d:28:4e:7a:12 ở đâu?')} <Src real lang={lang} en="lab: 84 flips in 5 s" vi="lab: lật 84 lần trong 5 giây" /></div>
                <div className={s.small}>{S.port ? <>{t('behind the port of', 'sau cổng của')} <b>{S.port === 'win' ? t('the Windows laptop', 'laptop Windows') : t('the copy-cat', 'máy chép MAC')}</b> · {t('changes so far', 'số lần đổi')}: <b>{S.flips}</b></> : t('(one machine per MAC — nothing to flip)', '(mỗi MAC một máy — chưa có gì để lật)')}</div>
              </div>
            )}
            <WhereBox focus={S.where} lang={lang} height={150} />
          </div>
        </div>
        <div className={n.note}>{t(`MAC = the address of a network card on ONE network (like the chassis number of a motorbike); IP = an address borrowed from DHCP (like the room you rent). The school registers the MAC. Hardware MAC of this MacBook: ${MAC14.macHw}.`, `MAC = địa chỉ của card mạng trên MỘT mạng (như số khung xe máy); IP = địa chỉ mượn từ DHCP (như phòng trọ đang thuê). Trường đăng ký MAC. MAC phần cứng của MacBook này: ${MAC14.macHw}.`)}</div>
      </div>
    </Frame>
  );
}
