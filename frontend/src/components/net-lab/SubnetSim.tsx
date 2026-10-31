'use client';
/**
 * Subnet: địa chỉ IPv4, mặt nạ, chia mạng (Chương 2.1).
 *   mask — chọn địa chỉ + prefix /8–/32: 32 bit, AND với mặt nạ = mạng, bật bit host = broadcast, máy đầu/cuối, số máy dùng
 *          được (/31 = 2, /32 = 1) — khớp từng ký tự với cidr.py của lab (c21-dia-chi)
 *   same — "đích có cùng mạng không?": cùng mạng ⇒ ARP hỏi thẳng đích; khác ⇒ gửi cổng mặc định. Lỗi thật: gõ /16 thay /24
 *   vlsm — chia 10.20.0.0/22 cho văn phòng LabFlow: lớn trước hay theo thứ tự gõ (lỗ hổng 336 địa chỉ) — chia.py thật
 * Engine: engine/subnet.ts. Số liệu: engine/capture2.ts.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { CIDR_RUNS, MASK16, MASK24 } from './engine/capture2';
import { DEFAULT_NEEDS, GIVEN_ORDER, bits, cidr, cidrLines, gapTotal, intToIp, ipToInt, isIp, maskOf, onLink, vlsm, vlsmLines, type Need } from './engine/subnet';
import { Controls, Explain, Frame, Kpi, Seg, css as s, cx, tx, usePlayer, type Lang } from '../os-lab/ui';
import { WhereBox } from '../os-lab/where';
import { useLabBridge, useOwnStepSound } from '../labs/bus';
import { labSfx } from '../labs/sfx';
import { Picks, Src, Term, Topo, type TLine } from './parts';
import n from './netlab.module.css';

type Preset = 'mask' | 'same' | 'vlsm';
const PRESETS: Preset[] = ['mask', 'same', 'vlsm'];
const QUICK = ['10.10.1.10', '192.168.50.77', '203.0.113.10', '192.0.2.0'];
const NEED_COLOR: Record<string, string> = { iot: '#0e7490', web: '#7c3aed', db: '#b45309', mgmt: '#15803d' };

function BitRow({ v, prefix, show = true, hot }: { v: number; prefix: number; show?: boolean; hot?: 'net' | 'host' }) {
  const b = bits(v).replace(/\./g, '');
  return (
    <div className={n.bitRow} aria-label={bits(v)}>
      {b.split('').map((c, k) => (
        <span key={k} className={cx(n.bit, k >= prefix && n.bitHost, c === '1' && n.bitOne, !show && n.bitDim, hot === 'host' && k >= prefix && n.bitHot, hot === 'net' && k < prefix && n.bitHot, k > 0 && k % 8 === 0 && n.bitOct)}>{show ? c : '·'}</span>
      ))}
    </div>
  );
}

export default function SubnetSim({ lang = 'vi', preset = 'mask' }: { lang?: Lang; preset?: string }) {
  const t = (en: string, vi: string) => tx(lang, en, vi);
  const [pre, setPre] = useState<Preset>(PRESETS.includes(preset as Preset) ? (preset as Preset) : 'mask');
  // mask
  const [addr, setAddr] = useState('10.10.1.10');
  const [draft, setDraft] = useState('10.10.1.10');
  const [prefix, setPrefix] = useState(24);
  // same
  const [mlen, setMlen] = useState<16 | 24>(24);
  const [dst, setDst] = useState('10.10.2.10');
  // vlsm
  const [order, setOrder] = useState<'given' | 'sorted'>('given');
  const [hosts, setHosts] = useState<Record<string, number>>(() => Object.fromEntries(DEFAULT_NEEDS.map((d) => [d.name, d.hosts])));

  const C = useMemo(() => cidr(addr, prefix), [addr, prefix]);
  const needs: Need[] = useMemo(() => GIVEN_ORDER.map((nm) => ({ name: nm, hosts: hosts[nm] })), [hosts]);
  const plan = useMemo(() => vlsm('10.20.0.0/22', needs, order === 'sorted'), [needs, order]);
  const vReal = DEFAULT_NEEDS.every((d) => hosts[d.name] === d.hosts);
  const total = pre === 'mask' ? 5 : pre === 'same' ? 6 : plan.rows.length + 2;
  const p = usePlayer(total, 1700);
  useOwnStepSound();
  const prevI = useRef(p.i);

  const L = onLink('10.10.1.11', mlen, dst);
  const outcome = dst === '10.10.2.10' ? (L.onLink ? 'unreachable' : 'reply') : 'reply';
  useEffect(() => {
    if (p.i > prevI.current) {
      if (pre === 'same' && p.i === 5) labSfx(outcome === 'unreachable' ? 'thud' : 'right');
      else if (pre === 'vlsm' && p.atEnd) labSfx(gapTotal(plan) ? 'oops' : 'right');
      else if (p.atEnd) labSfx('done');
      else labSfx(pre === 'vlsm' ? 'pop' : 'blip-decode');
    }
    prevI.current = p.i;
  }, [p.i]); // eslint-disable-line react-hooks/exhaustive-deps

  const load = (k: Preset) => { setPre(k); p.reset(); labSfx('tap'); };
  const applyAddr = (v: string) => { setDraft(v); if (isIp(v)) { setAddr(v.trim()); labSfx('tap'); } };
  const applyPrefix = (v: number) => setPrefix(Math.max(8, Math.min(32, Math.round(v))));

  useLabBridge('subnet', {
    preset: pre, i: p.i, atEnd: p.atEnd,
    addr, prefix, network: intToIp(C.net), bcast: C.bcast === null ? 'none' : intToIp(C.bcast), usable: C.usable,
    mask: mlen, dst, onLink: L.onLink, outcome,
    order, gap: gapTotal(plan), fits: !plan.fail, custom: !vReal,
  }, {
    preset: (v) => load(String(v) as Preset),
    addr: (v) => applyAddr(String(v)),
    prefix: (v) => { applyPrefix(Number(v)); labSfx('tap'); },
    mask: (v) => { setMlen(Number(v) === 16 ? 16 : 24); p.reset(); labSfx('tap'); },
    dst: (v) => { setDst(String(v)); p.reset(); labSfx('tap'); },
    order: (v) => { setOrder(v === 'sorted' ? 'sorted' : 'given'); p.reset(); labSfx('tap'); },
    need: (v) => { const [k, x] = String(v).split('='); setHosts((h) => ({ ...h, [k]: Math.max(1, Math.min(1000, Number(x) || 1)) })); p.reset(); },
  });

  // ───────── mask ─────────
  const realKey = `${addr}/${prefix}`;
  const real = !!CIDR_RUNS[realKey];
  const maskView = pre === 'mask' && (() => {
    const lines = cidrLines(addr, prefix);
    const shown = p.i + 1;
    const ex: Array<[string, string]> = [
      [`Every IPv4 address is 32 bits. Written as four numbers 0–255 (“octets”), each is 8 bits. ${addr} in binary is the top row. The first ${prefix} bits (blue) will be the NETWORK part, the last ${32 - prefix} (orange) the HOST part.`,
        `Mỗi địa chỉ IPv4 là 32 bit. Viết thành bốn số 0–255 (“octet”), mỗi số 8 bit. ${addr} ở dạng nhị phân là hàng trên cùng. ${prefix} bit đầu (xanh) sẽ là phần MẠNG, ${32 - prefix} bit cuối (cam) là phần MÁY.`],
      [`/${prefix} means “the first ${prefix} bits are the network”. The mask is ${prefix} ones then ${32 - prefix} zeros = ${intToIp(C.mask)}.`,
        `/${prefix} nghĩa là “${prefix} bit đầu là mạng”. Mặt nạ là ${prefix} số 1 rồi ${32 - prefix} số 0 = ${intToIp(C.mask)}.`],
      [`Network = address AND mask, bit by bit: 1 AND 1 = 1, anything AND 0 = 0. So the host bits are wiped: ${intToIp(C.net)}. Every machine with the same network part is “on my network”.`,
        `Mạng = địa chỉ AND mặt nạ, từng bit: 1 AND 1 = 1, gì AND 0 cũng = 0. Thế là bit phần máy bị xoá: ${intToIp(C.net)}. Máy nào có cùng phần mạng là “ở trong mạng của tôi”.`],
      [C.bcast !== null ? `Broadcast = network with ALL host bits set to 1: ${intToIp(C.bcast)} — “everyone on this network”. Nobody can use it as their address.` : `/${prefix} has only ${32 - prefix} host bit${prefix === 31 ? '' : 's'}: no address is spared for broadcast. ${prefix === 31 ? 'A /31 is a point-to-point link between two routers (RFC 3021): both addresses are usable.' : 'A /32 is exactly one machine — routers use it for “this one host”.'}`,
        C.bcast !== null ? `Broadcast = mạng với TOÀN BỘ bit phần máy bật thành 1: ${intToIp(C.bcast)} — “mọi máy trong mạng này”. Không máy nào dùng nó làm địa chỉ được.` : `/${prefix} chỉ có ${32 - prefix} bit phần máy: không dành địa chỉ nào cho broadcast. ${prefix === 31 ? '/31 là đường nối điểm-điểm giữa hai router (RFC 3021): cả hai địa chỉ đều dùng được.' : '/32 là đúng một máy — router dùng nó cho “riêng máy này”.'}`],
      [`${C.size} addresses in total; ${C.bcast !== null ? `minus the network and broadcast addresses = ${C.usable} usable, from ${intToIp(C.first)} to ${intToIp(C.last)}` : `all ${C.usable} usable`}. ${real ? 'These lines are exactly what cidr.py printed in the lab.' : 'This combination was not run in the lab — the lines are computed with the same rules as cidr.py.'}`,
        `Tổng ${C.size} địa chỉ; ${C.bcast !== null ? `bớt địa chỉ mạng và broadcast = ${C.usable} dùng được, từ ${intToIp(C.first)} tới ${intToIp(C.last)}` : `cả ${C.usable} đều dùng được`}. ${real ? 'Các dòng này đúng y như cidr.py in ra trong lab.' : 'Tổ hợp này chưa chạy trong lab — các dòng được tính bằng đúng luật của cidr.py.'}`],
    ];
    return (
      <>
        <div className={s.bar} data-tour="sn-input">
          <span className={s.lbl}>{t('Address', 'Địa chỉ')} <input type="text" className={n.ipIn} value={draft} onChange={(e) => applyAddr(e.target.value)} aria-label={t('IPv4 address', 'Địa chỉ IPv4')} spellCheck={false} /></span>
          <Picks value={addr} options={QUICK.map((q) => [q, q] as [string, string])} onChange={applyAddr} />
        </div>
        <div className={n.slider} data-tour="sn-prefix">/{t('prefix', 'prefix')} <input type="range" min={8} max={32} value={prefix} onChange={(e) => applyPrefix(Number(e.target.value))} aria-label="prefix" /> <b>/{prefix}</b></div>
        <Controls p={p} lang={lang} />
        <Explain tone={p.atEnd ? 'ok' : undefined}><b className={s.mono}>{lines[Math.min(p.i, 4)].split(/\s{2,}/)[0]}</b> — {t(...ex[Math.min(p.i, 4)])}</Explain>
        <div className={s.panel} data-tour="sn-bits">
          <div className={n.bits}>
            <span className={n.bitsLbl}>{t('address', 'địa chỉ')}<small>{addr}</small></span><BitRow v={C.ip} prefix={prefix} />
            <span className={n.bitsLbl}>{t('mask', 'mặt nạ')} /{prefix}<small>{intToIp(C.mask)}</small></span><BitRow v={C.mask} prefix={prefix} show={p.i >= 1} />
            <span className={n.bitsLbl}>{t('network', 'mạng')}<small>{p.i >= 2 ? intToIp(C.net) : '?'}</small></span><BitRow v={C.net} prefix={prefix} show={p.i >= 2} hot={p.i === 2 ? 'host' : undefined} />
            <span className={n.bitsLbl}>broadcast<small>{p.i >= 3 ? (C.bcast === null ? t('none', 'không có') : intToIp(C.bcast)) : '?'}</small></span><BitRow v={C.bcast ?? C.net} prefix={prefix} show={p.i >= 3 && C.bcast !== null} hot={p.i === 3 ? 'host' : undefined} />
          </div>
          <div className={n.note} style={{ marginTop: 6 }}>{t('Blue = network bits (same for every machine on this network). Orange = host bits (different for each machine).', 'Xanh = bit phần mạng (mọi máy trong mạng giống nhau). Cam = bit phần máy (mỗi máy một khác).')}</div>
        </div>
        <div className={n.cols}>
          <div className={s.stack} style={{ gap: 8 }}>
            <div className={s.kpis} data-tour="sn-result">
              <Kpi k={t('network', 'mạng')} v={p.i >= 2 ? `${intToIp(C.net)}/${prefix}` : '?'} />
              <Kpi k="broadcast" v={p.i >= 3 ? (C.bcast === null ? '—' : intToIp(C.bcast)) : '?'} />
              <Kpi k={t('usable hosts', 'máy dùng được')} v={p.i >= 4 ? C.usable.toLocaleString('en-US') : '?'} tone={p.i >= 4 ? 'ok' : undefined} />
            </div>
            <Term lang={lang} title={<>$ python3 cidr.py {realKey}</>} real={real} tour="sn-cidr" lines={lines.slice(0, shown).map((l, k) => ({ t: l, on: k === p.i, calc: !real }))} />
          </div>
          <WhereBox focus="ip-config" lang={lang} height={180} />
        </div>
      </>
    );
  })();

  // ───────── same ─────────
  const sameView = pre === 'same' && (() => {
    const C2 = mlen === 24 ? MASK24 : MASK16;
    const realDst = dst === '10.10.2.10';
    const nh = L.onLink ? dst : '10.10.1.254';
    const get = realDst ? C2.get[0] : `${dst} dev eth0 src 10.10.1.11 uid 0`;
    const stepLines: TLine[][] = [
      [`$ ip -br -4 addr show eth0`, { t: C2.addr[0], on: true }],
      [`$ ip route`, ...C2.route.map((l) => ({ t: l, on: true }))],
      [],
      [`$ ip route get ${dst}`, { t: get, on: true, calc: !realDst }],
      realDst && L.onLink ? [`$ tcpdump -n arp`, ...MASK16.arp.map((l) => ({ t: l, on: /who-has/.test(l) })), `$ ip neigh show ${dst}`, { t: MASK16.neigh[0], on: true }]
        : [{ t: `ARP, Request who-has ${nh} tell 10.10.1.11, length 28`, on: true, calc: true }, { t: `ARP, Reply ${nh} is-at ${nh === '10.10.1.254' ? '02:00:0a:0a:01:fe' : '02:00:0a:0a:01:0a'}, length 28`, calc: true }],
      realDst ? [`$ ping ${dst}`, ...(L.onLink ? MASK16.ping : mlen === 24 ? MASK24.ping : []).map((l) => ({ t: l, on: true }))]
        : [`$ ping ${dst}`, { t: `64 bytes from ${dst}: icmp_seq=1 ttl=64`, on: true, calc: true }],
    ];
    const isReal = p.i <= 1 || realDst && (p.i !== 4 || L.onLink);
    const ex: Array<[string, string]> = [
      [`client2 is configured with ${C2.addr[0].split(/\s+/).pop()}: address 10.10.1.11, prefix /${mlen}${mlen === 16 ? ' — someone typed /16 instead of /24' : ''}. Before sending ANY packet it must answer one question: is ${dst} on my own network?`,
        `client2 được cấu hình ${C2.addr[0].split(/\s+/).pop()}: địa chỉ 10.10.1.11, prefix /${mlen}${mlen === 16 ? ' — ai đó gõ /16 thay vì /24' : ''}. Trước khi gửi BẤT KỲ gói nào, nó phải trả lời một câu hỏi: ${dst} có ở trong mạng của tôi không?`],
      [`The kernel turned the address and prefix into a “connected” route: ${C2.route[1].split(' ')[0]} dev eth0 — “these addresses are right here on my cable”. Everything else goes to the default gateway 10.10.1.254.`,
        `Nhân biến địa chỉ và prefix thành một tuyến “nối thẳng”: ${C2.route[1].split(' ')[0]} dev eth0 — “những địa chỉ này ở ngay trên dây của tôi”. Mọi thứ khác đi qua cổng mặc định 10.10.1.254.`],
      [`AND both with MY mask /${mlen}: mine = ${intToIp(L.mine)}, ${dst} → ${intToIp(L.theirs)}. ${L.onLink ? 'Equal ⇒ “same network: deliver it myself”.' : 'Different ⇒ “another network: hand it to the router”.'}`,
        `AND cả hai với mặt nạ CỦA TÔI /${mlen}: của tôi = ${intToIp(L.mine)}, ${dst} → ${intToIp(L.theirs)}. ${L.onLink ? 'Bằng nhau ⇒ “cùng mạng: tự giao”.' : 'Khác nhau ⇒ “mạng khác: đưa cho router”.'}`],
      [L.onLink ? `ip route get agrees: “${get}” — no “via”, so no router.` : `ip route get: “${get}” — “via 10.10.1.254”, the router.`,
        L.onLink ? `ip route get đồng ý: “${get}” — không có “via”, tức không qua router.` : `ip route get: “${get}” — “via 10.10.1.254”, tức router.`],
      [L.onLink ? `So client2 ARPs for ${dst} ITSELF: “who-has ${dst}”. ${realDst ? 'But 10.10.2.10 is behind the router, not on this cable — nobody answers. The real capture shows the question repeated every second; the only reply is someone ARPing for client2. The neighbour entry ends FAILED.' : `${dst} really is on this cable and answers.`}` : 'So client2 ARPs for the ROUTER 10.10.1.254 — the next hop — and the router forwards the packet.',
        L.onLink ? `Vậy client2 ARP hỏi CHÍNH ${dst}: “who-has ${dst}”. ${realDst ? 'Nhưng 10.10.2.10 nằm sau router, không ở trên dây này — không ai trả lời. Capture thật cho thấy câu hỏi lặp lại mỗi giây; câu trả lời duy nhất là người khác hỏi client2. Mục hàng xóm kết thúc ở FAILED.' : `${dst} đúng là ở trên dây này và trả lời.`}` : 'Vậy client2 ARP hỏi ROUTER 10.10.1.254 — chặng kế tiếp — và router chuyển gói đi.'],
      [outcome === 'unreachable' ? '“Destination Host Unreachable”, 100% loss. The web server is fine, the router is fine — one wrong number in client2’s mask made it think a remote machine was its neighbour. Fix: /24 ⇒ “via 10.10.1.254” ⇒ ping works again (ttl=63: one router on the way).' : realDst ? 'The reply comes back with ttl=63 — one router on the way. The mask is right, so the router was used.' : 'Same network, direct delivery: ttl=64 (no router lowered it). This case is computed — the lab only pinged 10.10.2.10.',
        outcome === 'unreachable' ? '“Destination Host Unreachable”, mất 100%. Máy web không sao, router không sao — chỉ một con số sai trong mặt nạ của client2 làm nó tưởng máy ở xa là hàng xóm. Sửa: /24 ⇒ “via 10.10.1.254” ⇒ ping chạy lại (ttl=63: qua một router).' : realDst ? 'Câu trả lời về với ttl=63 — qua một router. Mặt nạ đúng nên router được dùng.' : 'Cùng mạng, giao thẳng: ttl=64 (không router nào trừ). Trường hợp này là tính ra — lab chỉ ping 10.10.2.10.'],
    ];
    const lines = stepLines[Math.min(p.i, 5)];
    const arpOn = p.i >= 4;
    return (
      <>
        <div className={s.bar} data-tour="sn-same-opts">
          <Seg label={t('client2 mask', 'mặt nạ của client2')} value={String(mlen)} options={[['24', t('/24 (correct)', '/24 (đúng)')], ['16', t('/16 (typo)', '/16 (gõ nhầm)')]]} onChange={(v) => { setMlen(v === '16' ? 16 : 24); p.reset(); labSfx('tap'); }} />
          <Seg label={t('ping', 'ping')} value={dst} options={[['10.10.2.10', t('10.10.2.10 (web, other network)', '10.10.2.10 (web, mạng khác)')], ['10.10.1.10', t('10.10.1.10 (client, same network)', '10.10.1.10 (client, cùng mạng)')]]} onChange={(v) => { setDst(v); p.reset(); labSfx('tap'); }} />
        </div>
        <Controls p={p} lang={lang} />
        <Explain tone={p.i === 5 ? (outcome === 'unreachable' ? 'bad' : 'ok') : p.i === 2 && realDst && L.onLink ? 'warn' : undefined}>{t(...ex[Math.min(p.i, 5)])}</Explain>
        <div className={n.cols}>
          <div className={s.stack} style={{ gap: 8 }}>
            <div className={s.panel} style={{ padding: 6 }} data-tour="sn-topo">
              <Topo label={t('client2, client and the router on 10.10.1.0/24; the web server on 10.10.2.0/24', 'client2, client và router ở 10.10.1.0/24; máy web ở 10.10.2.0/24')} w={520} h={200}
                pill={arpOn ? `ARP who-has ${nh}` : undefined} k={outcome === 'unreachable' && arpOn ? '#dc2626' : '#d97706'}
                nodes={[
                  { id: 'c2', x: 70, y: 55, icon: '🖥️', name: 'client2', sub: `10.10.1.11/${mlen}`, on: true, bad: mlen === 16 },
                  { id: 'c1', x: 70, y: 150, icon: '💻', name: 'client', sub: '10.10.1.10', on: dst === '10.10.1.10' && arpOn },
                  { id: 'sw', x: 215, y: 102, icon: '🔌', name: '10.10.1.0/24', sub: t('one cable (LAN)', 'một dây (LAN)'), w: 120 },
                  { id: 'r', x: 345, y: 102, icon: '🔀', name: 'router', sub: '.1.254 | .2.254', on: !L.onLink && arpOn, w: 108 },
                  { id: 'web', x: 465, y: 102, icon: '🌐', name: 'web', sub: '10.10.2.10', on: dst === '10.10.2.10' && p.i === 5 && outcome === 'reply', bad: dst === '10.10.2.10' && p.i === 5 && outcome === 'unreachable' },
                ]}
                links={[
                  { a: 'c2', b: 'sw', on: arpOn },
                  { a: 'c1', b: 'sw', on: arpOn && L.onLink },
                  { a: 'sw', b: 'r', on: arpOn && (!L.onLink || realDst) },
                  { a: 'r', b: 'web', on: p.i === 5 && outcome === 'reply' && realDst, bad: p.i >= 4 && outcome === 'unreachable', label: '10.10.2.0/24' },
                ]}
                marks={outcome === 'unreachable' && p.i >= 4 ? [{ x: 405, y: 82, text: t('ARP never crosses a router', 'ARP không đi qua router'), bad: true }] : undefined} />
            </div>
            <div className={s.panel} data-tour="sn-and">
              <div className={s.panelTitle}>{t(`AND with my mask /${mlen}`, `AND với mặt nạ của tôi /${mlen}`)} <Src real={false} lang={lang} en="the rule, computed" vi="đúng luật, tính ra" /></div>
              <div className={n.bits}>
                <span className={n.bitsLbl}>{t('me', 'tôi')}<small>10.10.1.11</small></span><BitRow v={ipToInt('10.10.1.11')} prefix={mlen} />
                <span className={n.bitsLbl}>{t('destination', 'đích')}<small>{dst}</small></span><BitRow v={ipToInt(dst)} prefix={mlen} />
                <span className={n.bitsLbl}>{t('mask', 'mặt nạ')}<small>/{mlen}</small></span><BitRow v={maskOf(mlen)} prefix={mlen} />
              </div>
              <div className={cx(n.verdict, p.i >= 2 ? (L.onLink ? (realDst ? n.vBad : n.vOk) : n.vOk) : n.vNew)} style={{ marginTop: 6 }}>
                {p.i >= 2 ? (L.onLink ? t(`${intToIp(L.theirs)} = ${intToIp(L.mine)} ⇒ “same network” ⇒ ARP for ${dst} itself`, `${intToIp(L.theirs)} = ${intToIp(L.mine)} ⇒ “cùng mạng” ⇒ ARP hỏi chính ${dst}`) : t(`${intToIp(L.theirs)} ≠ ${intToIp(L.mine)} ⇒ “other network” ⇒ send to 10.10.1.254`, `${intToIp(L.theirs)} ≠ ${intToIp(L.mine)} ⇒ “mạng khác” ⇒ gửi cho 10.10.1.254`)) : t('step to the comparison…', 'bấm Bước tới phép so…')}
              </div>
            </div>
          </div>
          <div className={s.stack} style={{ gap: 8 }}>
            <Term lang={lang} title={t('client2’s terminal', 'terminal của client2')} real={isReal} tour="sn-term" lines={lines.length ? lines : [{ t: t(`(compare ${dst} with my network)`, `(so ${dst} với mạng của tôi)`), dim: true }]} />
            <WhereBox focus={p.i >= 4 ? 'arp-cache' : p.i >= 1 ? 'routing-table' : 'ip-config'} lang={lang} height={170} />
          </div>
        </div>
      </>
    );
  })();

  // ───────── vlsm ─────────
  const vlsmView = pre === 'vlsm' && (() => {
    const placed = Math.min(p.i, plan.rows.length);
    const end = p.atEnd;
    const pct = (a: number) => (100 * (a - plan.blockStart)) / plan.blockSize;
    const all = vlsmLines(plan);
    const upto = end ? all.length : plan.fail ? 1 : 2 + placed;
    const shown: TLine[] = [`$ python3 chia.py ${order === 'given' ? '--as-given ' : ''}10.20.0.0/22 ${(order === 'sorted' ? [...needs].sort((a, b) => b.hosts - a.hosts) : needs).map((x) => `${x.name}=${x.hosts}`).join(' ')}`,
      ...all.slice(0, upto).map((l, k) => ({ t: l, on: end ? k >= 2 + placed || !!plan.fail : k === 1 + placed && p.i > 0, calc: !vReal }))];
    const cur = plan.rows[placed - 1];
    const gp = gapTotal(plan);
    const ex: [string, string] = p.i === 0
      ? [`LabFlow’s office got the block 10.20.0.0/22 = 1024 addresses. Four networks are needed: iot ${hosts.iot} devices, web ${hosts.web}, db ${hosts.db}, mgmt ${hosts.mgmt}. Each needs a power-of-two block (+2 for network and broadcast), and a block must START at a multiple of its own size. Order: ${order === 'sorted' ? 'largest first' : 'as written (web, db, mgmt, iot)'}.`,
        `Văn phòng LabFlow được cấp khối 10.20.0.0/22 = 1024 địa chỉ. Cần bốn mạng: iot ${hosts.iot} thiết bị, web ${hosts.web}, db ${hosts.db}, mgmt ${hosts.mgmt}. Mỗi mạng cần một khối cỡ lũy thừa của 2 (+2 cho địa chỉ mạng và broadcast), và khối phải BẮT ĐẦU ở bội số của chính cỡ nó. Thứ tự: ${order === 'sorted' ? 'lớn trước' : 'như đã viết (web, db, mgmt, iot)'}.`]
      : !end && cur ? [`${cur.name}: ${cur.hosts} + 2 ≤ ${cur.size} ⇒ /${cur.prefix} (${cur.size} addresses). Next free address must be a multiple of ${cur.size} ⇒ ${intToIp(cur.start)}/${cur.prefix}.${plan.gaps.find((g) => g.before === cur.name) ? ` To get there it SKIPS ${plan.gaps.find((g) => g.before === cur.name)!.n} addresses — they can never be used by anything this size.` : ''}`,
        `${cur.name}: ${cur.hosts} + 2 ≤ ${cur.size} ⇒ /${cur.prefix} (${cur.size} địa chỉ). Địa chỉ trống kế tiếp phải là bội số của ${cur.size} ⇒ ${intToIp(cur.start)}/${cur.prefix}.${plan.gaps.find((g) => g.before === cur.name) ? ` Để tới đó nó BỎ QUA ${plan.gaps.find((g) => g.before === cur.name)!.n} địa chỉ — không mạng nào cỡ này dùng được chúng nữa.` : ''}`]
      : plan.fail ? [`${plan.fail.name} needs /${plan.fail.prefix} (${plan.fail.size} addresses) and no aligned block of that size is left — the plan does not fit. Try largest first, or fewer hosts.`, `${plan.fail.name} cần /${plan.fail.prefix} (${plan.fail.size} địa chỉ) mà không còn khối thẳng hàng nào cỡ đó — kế hoạch không vừa. Thử xếp lớn trước, hoặc bớt số máy.`]
      : gp ? [`Done, but ${gp} addresses were skipped to keep the big subnet aligned, and the block is now FULL. Same needs, largest first ⇒ no gap and 336 addresses left over (next free 10.20.2.176). Rule: allocate the largest subnet first.`, `Xong, nhưng ${gp} địa chỉ bị bỏ qua để mạng lớn thẳng hàng, và khối giờ ĐẦY. Cùng nhu cầu đó, xếp lớn trước ⇒ không lỗ hổng và còn dư 336 địa chỉ (trống kế tiếp 10.20.2.176). Quy tắc: cấp mạng lớn nhất trước.`]
      : [`Largest first: every block lands right after the previous one, no gap. Used ${plan.used} of 1024${plan.next < plan.blockStart + plan.blockSize ? `, next free ${intToIp(plan.next)}` : ''}.`, `Lớn trước: khối nào cũng nằm ngay sau khối trước, không lỗ hổng. Đã dùng ${plan.used} trên 1024${plan.next < plan.blockStart + plan.blockSize ? `, trống kế tiếp ${intToIp(plan.next)}` : ''}.`];
    return (
      <>
        <div className={s.bar} data-tour="sn-order">
          <Seg label={t('Order', 'Thứ tự')} value={order} options={[['given', t('as written', 'như đã viết')], ['sorted', t('largest first', 'lớn trước')]]} onChange={(v) => { setOrder(v); p.reset(); labSfx('tap'); }} />
        </div>
        <div className={n.needs} data-tour="sn-needs">
          <span className={s.lbl}>{t('Hosts needed', 'Số máy cần')}</span>
          {GIVEN_ORDER.map((nm) => (
            <label key={nm} style={{ color: NEED_COLOR[nm] }}>{nm} <input type="number" min={1} max={1000} value={hosts[nm]} onChange={(e) => { setHosts((h) => ({ ...h, [nm]: Math.max(1, Math.min(1000, Number(e.target.value) || 1)) })); p.reset(); }} aria-label={nm} /></label>
          ))}
          {!vReal && <button type="button" className={s.btn} onClick={() => { setHosts(Object.fromEntries(DEFAULT_NEEDS.map((d) => [d.name, d.hosts]))); p.reset(); labSfx('tap'); }}>{t('back to the lab numbers', 'về số của lab')}</button>}
        </div>
        <Controls p={p} lang={lang} />
        <Explain tone={end ? (plan.fail ? 'bad' : gp ? 'warn' : 'ok') : undefined}>{t(...ex)}</Explain>
        <div className={s.panel} data-tour="sn-vbar">
          <div className={s.panelTitle} style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>10.20.0.0/22 — 1024 {t('addresses', 'địa chỉ')} <Src real={vReal} lang={lang} en={vReal ? 'same as chia.py in the lab' : 'computed'} vi={vReal ? 'đúng như chia.py trong lab' : 'tính ra'} /></div>
          <div className={n.vbar}>
            {plan.rows.slice(0, placed).map((r) => <span key={r.name} className={n.vseg} style={{ left: `${pct(r.start)}%`, width: `${pct(r.start + r.size) - pct(r.start)}%`, background: NEED_COLOR[r.name] }} title={`${r.name} ${intToIp(r.start)}/${r.prefix}`}>{r.size >= 64 ? `${r.name} /${r.prefix}` : r.size >= 32 ? r.name : ''}</span>)}
            {plan.gaps.filter((g) => plan.rows.findIndex((r) => r.name === g.before) < placed).map((g) => <span key={g.start} className={n.vgap} style={{ left: `${pct(g.start)}%`, width: `${pct(g.end + 1) - pct(g.start)}%` }}>{t(`gap ${g.n}`, `hổng ${g.n}`)}</span>)}
          </div>
          <div className={n.vaxis}>{[0, 256, 512, 768].map((x) => <span key={x} style={{ left: `${(100 * x) / 1024}%`, transform: x ? 'translateX(-50%)' : 'none' }}>{intToIp(plan.blockStart + x)}</span>)}</div>
          <div className={s.kpis} style={{ marginTop: 8 }}>
            <Kpi k={t('used', 'đã dùng')} v={`${plan.rows.slice(0, placed).reduce((a, r) => a + r.size, 0)} / 1024`} />
            <Kpi k={t('skipped (gap)', 'bỏ phí (lỗ hổng)')} v={end ? gp : '…'} tone={end ? (gp ? 'bad' : 'ok') : undefined} />
          </div>
        </div>
        <div className={n.cols}>
          <Term lang={lang} real={vReal} tour="sn-chia" lines={shown} />
          <WhereBox focus="routing-table" lang={lang} height={170} />
        </div>
      </>
    );
  })();

  return (
    <Frame badge={t('Network lab', 'Phòng lab mạng')} title={t('Subnets: address, mask, network', 'Subnet: địa chỉ, mặt nạ, mạng')}
      sub={t('IPv4 in binary, the same-network test, and carving a block — checked against cidr.py / chia.py in the lab', 'IPv4 dạng nhị phân, phép thử cùng mạng, và chia một khối — đối chiếu với cidr.py / chia.py trong lab')}>
      <div className={n.nl}>
        <div className={s.bar} data-tour="sn-preset">
          <Seg label={t('Scenario', 'Kịch bản')} value={pre} options={[['mask', t('address & mask', 'địa chỉ & mặt nạ')], ['same', t('same network?', 'cùng mạng?')], ['vlsm', t('split a block', 'chia một khối')]]} onChange={load} />
        </div>
        {maskView}{sameView}{vlsmView}
        <div className={n.note}>{t('Prefix /n = the first n bits are the network. Mask = the same thing written as an address (/24 = 255.255.255.0). Subnet = one network carved out of a bigger block.', 'Prefix /n = n bit đầu là mạng. Mặt nạ (mask) = cùng ý đó viết dạng địa chỉ (/24 = 255.255.255.0). Subnet = một mạng con cắt ra từ một khối lớn hơn.')}</div>
      </div>
    </Frame>
  );
}
