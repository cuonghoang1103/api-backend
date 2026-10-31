'use client';
/**
 * Đóng gói (encapsulation): MỘT request thật đi xuống ngăn xếp, qua dây, qua router, rồi đi lên lại tới nginx.
 *   http — từng tầng thêm header (phong bì lồng nhau, thước byte 14|20|32|83, hex dump THẬT tô theo tầng, bấm byte để giải nghĩa)
 *   hop  — cùng gói ở hai phía router: đoán trường nào đổi / giữ rồi mới mở đáp án (MAC ×2, TTL, checksum IP)
 *   mtu  — câu trả lời 3991 byte cắt theo MTU/MSS; segmentation offload (siêu gói 4057 byte trong capture)
 * Engine: engine/encap.ts (giải mã lại đúng byte capture, có test). Số "tính ra" luôn có nhãn.
 */
import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { BIG, BIG_SEGMENTS_OFF, BIG_SEGMENTS_TSO, HELLO_BYTES } from './engine/capture';
import {
  LAYERS, LAYER_NAME, LAYER_RANGE, WEB_BYTES, cutResponse, decode, encapSteps, hopFields, layerOf, superFrame,
  ETH_HDR, IP_HDR, TCP_HDR, TS_OPT, type Field, type LayerId,
} from './engine/encap';
import { Controls, Explain, Frame, Kpi, Seg, css as s, cx, tx, usePlayer, type Lang } from '../os-lab/ui';
import { WhereBox } from '../os-lab/where';
import { useLabBridge, useOwnStepSound } from '../labs/bus';
import { labSfx } from '../labs/sfx';
import n from './netlab.module.css';

type Mode = 'http' | 'hop' | 'mtu';
const MODES: Mode[] = ['http', 'hop', 'mtu'];
const LVAR: Record<LayerId, CSSProperties> = {
  eth: { '--c': 'var(--nl-eth)', '--cb': 'var(--nl-eth-bg)' } as CSSProperties,
  ip: { '--c': 'var(--nl-ip)', '--cb': 'var(--nl-ip-bg)' } as CSSProperties,
  tcp: { '--c': 'var(--nl-tcp)', '--cb': 'var(--nl-tcp-bg)' } as CSSProperties,
  http: { '--c': 'var(--nl-http)', '--cb': 'var(--nl-http-bg)' } as CSSProperties,
};
const LBG: Record<LayerId, string> = { eth: 'var(--nl-eth)', ip: 'var(--nl-ip)', tcp: 'var(--nl-tcp)', http: 'var(--nl-http)' };

/** ba máy và các tầng của chúng; bước i của dãy encap ứng với [máy, tầng] */
type RowK = 'app' | 'sock' | 'tcp' | 'ip' | 'eth' | 'nic' | 'fwd' | 'nic2';
const ROWS: Record<'client' | 'router' | 'web', Array<[RowK, string, string, boolean]>> = {
  client: [['app', 'curl', 'curl', false], ['sock', 'socket', 'socket', true], ['tcp', 'TCP', 'TCP', true], ['ip', 'IP', 'IP', true], ['eth', 'Ethernet', 'Ethernet', true], ['nic', 'NIC → wire', 'NIC → dây', true]],
  router: [['nic', 'eth0 (LAN)', 'eth0 (LAN)', true], ['fwd', 'IP: TTL − 1', 'IP: TTL − 1', true], ['nic2', 'eth1 (DMZ)', 'eth1 (DMZ)', true]],
  web: [['nic', 'NIC + Ethernet', 'NIC + Ethernet', true], ['ip', 'IP', 'IP', true], ['tcp', 'TCP → socket', 'TCP → socket', true], ['app', 'nginx', 'nginx', false]],
};
const ROW_AT: Array<['client' | 'router' | 'web', RowK]> = [
  ['client', 'app'], ['client', 'sock'], ['client', 'tcp'], ['client', 'ip'], ['client', 'eth'], ['client', 'nic'],
  ['router', 'fwd'], ['web', 'nic'], ['web', 'ip'], ['web', 'tcp'], ['web', 'app'],
];
const HOP_ROW: Array<['client' | 'router' | 'web', RowK]> = [['client', 'nic'], ['router', 'fwd'], ['router', 'nic2']];

const hex2 = (b: number) => b.toString(16).padStart(2, '0');

export default function EncapSim({ lang = 'vi', preset = 'http' }: { lang?: Lang; preset?: string }) {
  const t = (en: string, vi: string) => tx(lang, en, vi);
  const [mode, setMode] = useState<Mode>(MODES.includes(preset as Mode) ? (preset as Mode) : 'http');
  const [mtu, setMtu] = useState(1500);
  const [offload, setOffload] = useState(false);
  const [sel, setSel] = useState<string | null>(null);
  const [pred, setPred] = useState<Record<string, boolean>>({});
  const [revealed, setRevealed] = useState(false);
  const [side, setSide] = useState<'client' | 'web'>('client');

  const steps = useMemo(() => encapSteps(), []);
  const cut = useMemo(() => cutResponse(BIG.response, mtu), [mtu]);
  const total = mode === 'http' ? steps.length : mode === 'hop' ? 3 : offload ? 3 : cut.segs.length + 1;
  const p = usePlayer(total, mode === 'mtu' ? 1300 : 1700);
  const st = steps[Math.min(p.i, steps.length - 1)];
  const hops = useMemo(() => hopFields(), []);
  useOwnStepSound();

  // tiếng cho mỗi bước
  const prev = useRef(p.i);
  useEffect(() => {
    if (p.i !== prev.current && p.i > prev.current) {
      if (mode === 'http') labSfx(st.wire ? 'whoosh' : st.tone === 'ok' ? 'right' : st.side === 'web' ? 'blip-decode' : 'blip-fetch');
      else if (mode === 'hop') labSfx(p.i === 1 ? 'blip-exec' : 'whoosh');
      else labSfx(p.atEnd ? 'hit' : 'whoosh');
    }
    prev.current = p.i;
  }, [p.i]); // eslint-disable-line react-hooks/exhaustive-deps

  const switchMode = (m: Mode) => { setMode(m); setSel(null); p.reset(); labSfx('tap'); };
  const predictOne = (id: string, ch: boolean) => { if (revealed) return; setPred((o) => ({ ...o, [id]: ch })); labSfx('tap'); };
  const nPred = hops.filter((h) => pred[h.id] !== undefined).length;
  const nRight = hops.filter((h) => pred[h.id] === h.changes).length;
  const reveal = () => { setRevealed(true); setSide('web'); labSfx(nRight === hops.length ? 'right' : 'oops'); };
  const setMtuX = (v: number) => { setMtu(v); p.reset(); labSfx('tap'); };
  const setOff = (v: boolean) => { setOffload(v); p.reset(); labSfx(v ? 'on' : 'off'); };

  // byte & trường đang xem
  const have: LayerId[] = mode === 'http' ? st.have : ['eth', 'ip', 'tcp', 'http'];
  const hot: LayerId | undefined = mode === 'http' ? st.hot : undefined;
  const bytes = mode === 'http' ? (st.bytes === 'web' ? WEB_BYTES : HELLO_BYTES) : mode === 'hop' ? (side === 'web' ? WEB_BYTES : HELLO_BYTES) : HELLO_BYTES;
  const fields = useMemo(() => decode(bytes), [bytes]);
  const defaultSel = hot ? fields.find((f) => f.layer === hot)?.id : undefined;
  const selF: Field | undefined = fields.find((f) => f.id === (sel ?? defaultSel));
  const pick = (id: string) => { setSel(id); labSfx('tap'); };
  const fieldAt = (off: number) => fields.filter((f) => off >= f.off && off < f.off + f.len).sort((a, b) => a.len - b.len)[0];
  const changedBytes = useMemo(() => new Set(HELLO_BYTES.map((b, k) => (b !== WEB_BYTES[k] ? k : -1)).filter((k) => k >= 0)), []);

  useLabBridge('encap', {
    mode, i: p.i, atEnd: p.atEnd, layers: have.length, hot: hot ?? '', sel: selF?.id ?? '', predicted: nPred, correct: nRight, fields: hops.length,
    revealed, mtu, offload, segs: offload && p.i < 2 ? 1 : cut.segs.length, side,
  }, {
    mode: (v) => switchMode(String(v) as Mode),
    pick: (v) => pick(String(v)),
    predict: (v) => { const [id, c] = String(v).split(':'); predictOne(id, c === '1'); },
    predictAll: () => { setPred(Object.fromEntries(hops.map((h) => [h.id, h.changes]))); labSfx('tap'); },
    reveal: () => reveal(),
    mtu: (v) => setMtuX(Number(v)),
    offload: (v) => setOff(!!v),
    side: (v) => setSide(v === 'web' ? 'web' : 'client'),
  });

  // ── các khối giao diện ──
  const curRow = mode === 'http' ? ROW_AT[Math.min(p.i, ROW_AT.length - 1)] : mode === 'hop' ? HOP_ROW[Math.min(p.i, 2)] : (['web', offload && p.i < 2 ? 'tcp' : 'nic'] as ['web', RowK]);
  const machines = (
    <div className={n.machines} data-tour="en-stack">
      {(['client', 'router', 'web'] as const).map((m) => {
        const on = curRow[0] === m;
        const ip = m === 'client' ? '10.10.1.10' : m === 'router' ? '.1.254 / .2.254' : '10.10.2.10';
        return (
          <div key={m} className={cx(n.machine, on && n.machineOn)}>
            <div className={n.mHead}><span className={n.mIcon} aria-hidden>{m === 'client' ? '💻' : m === 'router' ? '🔀' : '🖥️'}</span>
              <span>{m === 'client' ? 'client' : m === 'router' ? 'router' : 'web (nginx)'}<small>{ip}</small></span></div>
            {ROWS[m].map(([k, en, vi, kern], j) => (
              <div key={k}>
                {m !== 'router' && ((m === 'client' && j === 1) || (m === 'web' && j === ROWS.web.length - 1)) && <div className={n.userLine}>{t('user ⇅ kernel', 'người dùng ⇅ nhân')}</div>}
                <div className={cx(n.lrow, kern && n.lrowKern, on && curRow[1] === k && n.lrowOn)}><i />{t(en, vi)}</div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );

  const envSummary = (L: LayerId, B: readonly number[]) => {
    const F = (id: string) => decode(B).find((f) => f.id === id)!.value;
    if (L === 'eth') return `dst ${F('eth.dst')} · src ${F('eth.src')} · ${F('eth.type')}`;
    if (L === 'ip') return `${F('ip.src')} → ${F('ip.dst')} · TTL ${F('ip.ttl')} · proto 6 · sum ${F('ip.sum')}`;
    if (L === 'tcp') return `${F('tcp.sport')} → ${F('tcp.dport')} · ${F('tcp.flags').split('· ')[1]} · +12 B timestamps`;
    return '';
  };
  const envelopes = (() => {
    if (!have.length) return <div className={n.envEmpty}>{t('Nothing has been sent yet — the request only exists inside curl’s memory.', 'Chưa có gì được gửi — request mới chỉ nằm trong bộ nhớ của curl.')}</div>;
    const body = String.fromCharCode(...bytes.slice(66)).replace(/\r\n/g, '↵\n').trim();
    let inner: ReactNode = null;
    for (const L of [...have].reverse()) {
      const [a, b] = LAYER_RANGE[L];
      inner = (
        <div className={cx(n.env, hot === L && n.envHot)} style={LVAR[L]} key={L}>
          <div className={n.envHead}>{t(LAYER_NAME[L][0], LAYER_NAME[L][1])} · {b - a} B{L !== 'http' && <code>{envSummary(L, bytes)}</code>}</div>
          {L === 'http' ? <div className={n.envBody}>{body}</div> : inner}
        </div>
      );
    }
    return inner;
  })();

  const ruler = (
    <div data-tour="en-ruler">
      <div className={n.ruler} role="img" aria-label={t('byte ruler', 'thước byte')}>
        {mode === 'http' && st.wire && <span className={cx(n.rseg, n.rsegWire)} style={{ flexGrow: 8 }}>8</span>}
        {LAYERS.map((L) => { const [a, b] = LAYER_RANGE[L]; return <span key={L} className={cx(n.rseg, !have.includes(L) && n.rsegOff)} style={{ flexGrow: b - a, background: LBG[L] }}>{b - a}</span>; })}
        {mode === 'http' && st.wire && <span className={cx(n.rseg, n.rsegWire)} style={{ flexGrow: 16 }}>4+12</span>}
      </div>
      <div className={n.rulerLegend}>
        <span><b>{have.reduce((x, L) => x + LAYER_RANGE[L][1] - LAYER_RANGE[L][0], 0)}</b> {t('bytes in the packet now', 'byte trong gói lúc này')}</span>
        {mode === 'http' && st.wire && <span>{t('+ preamble 8, FCS 4, gap 12 on a real cable — not in the capture', '+ preamble 8, FCS 4, khoảng nghỉ 12 trên dây thật — không có trong capture')}</span>}
        <span className={cx(n.src, n.srcReal)}>{t('bytes measured in the lab', 'byte đo trong lab')}</span>
      </div>
    </div>
  );

  const hexDump = (
    <div className={s.panel} data-tour="en-hex">
      <div className={s.panelTitle} style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ flex: 1 }}>{t('Real hex dump', 'Hex dump thật')} · {bytes === WEB_BYTES ? t('web side of the router', 'phía web của router') : t('client side', 'phía client')}</span>
        {mode === 'hop' && <Seg value={side} options={[['client', t('client side', 'phía client')], ['web', t('web side', 'phía web')]]} onChange={(v) => { setSide(v); labSfx('tap'); }} />}
      </div>
      <div className={n.hex}>
        {Array.from({ length: Math.ceil(bytes.length / 16) }, (_, r) => (
          [<span key={`o${r}`} className={n.hexOff}>{(r * 16).toString(16).padStart(4, '0')}</span>,
            ...bytes.slice(r * 16, r * 16 + 16).map((b, c) => {
              const off = r * 16 + c, L = layerOf(off), f = fieldAt(off);
              const isSel = !!selF && off >= selF.off && off < selF.off + selF.len;
              return (
                <button type="button" key={off} style={LVAR[L]} title={`${off}: 0x${hex2(b)}${f ? ` — ${t(f.name[0], f.name[1])}` : ''}`}
                  className={cx(n.hb, !have.includes(L) && n.hbDim, hot === L && n.hbHot, isSel && n.hbSel, mode === 'hop' && revealed && changedBytes.has(off) && n.hbChg)}
                  onClick={() => pick((f ?? fields.find((x) => x.layer === L))!.id)}>{hex2(b)}</button>
              );
            })]
        ))}
      </div>
      {selF && (
        <div className={n.field} style={{ ...LVAR[selF.layer], marginTop: 8 }} data-tour="en-field">
          <b>{t(selF.name[0], selF.name[1])}</b> · <span className={s.small}>{t('bytes', 'byte')} {selF.off}–{selF.off + selF.len - 1}</span> = <code>{selF.value}</code>
          <div style={{ marginTop: 3 }}>{t(selF.en, selF.vi)}</div>
        </div>
      )}
      {!selF && <div className={n.note} style={{ marginTop: 6 }} data-tour="en-field">{t('Click any byte to decode it.', 'Bấm vào một byte bất kỳ để giải mã nó.')}</div>}
    </div>
  );

  // ── hop ──
  const hopPanel = (
    <div className={s.panel} data-tour="en-hop">
      <div className={s.panelTitle}>{t('Guess first: which fields does the router change?', 'Đoán trước: router đổi những trường nào?')}</div>
      <div className={s.scrollX}>
        <table className={n.hopTbl}>
          <thead><tr><th>{t('field', 'trường')}</th><th className={n.hideSm}>{t('client side', 'phía client')}</th><th>{t('your guess', 'bạn đoán')}</th><th>{t('web side', 'phía web')}</th></tr></thead>
          <tbody>
            {hops.map((h) => (
              <tr key={h.id}>
                <td><b>{t(h.name[0], h.name[1])}</b></td>
                <td className={n.hideSm}><code>{h.client}</code></td>
                <td>
                  <span className={n.pred} role="group" aria-label={t(h.name[0], h.name[1])}>
                    <button type="button" className={cx(pred[h.id] === true && n.predOn)} onClick={() => predictOne(h.id, true)} disabled={revealed}>{t('changes', 'đổi')}</button>
                    <button type="button" className={cx(pred[h.id] === false && n.predOn)} onClick={() => predictOne(h.id, false)} disabled={revealed}>{t('stays', 'giữ')}</button>
                  </span>
                </td>
                <td className={cx(revealed && h.changes && n.cellChg)}>
                  {revealed ? <><code>{h.web}</code> <span className={pred[h.id] === h.changes ? n.right : n.wrong}>{pred[h.id] === h.changes ? '✓' : '✗'}</span></> : <span className={s.small}>?</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={s.bar}>
        <button type="button" className={cx(s.btn, s.primary)} disabled={revealed || nPred < hops.length} onClick={reveal} data-tour="en-reveal">
          {t('Reveal the far side', 'Mở phía bên kia')} ({nPred}/{hops.length})
        </button>
        {revealed && <span className={cx(n.verdict, nRight === hops.length ? n.vOk : n.vBad)} data-tour="en-score">{nRight}/{hops.length} {t('right', 'đúng')}</span>}
        {!revealed && <span className={s.small} data-tour="en-score">{t('Answer every row to unlock.', 'Trả lời đủ mọi dòng để mở.')}</span>}
      </div>
      {revealed && <div className={n.note}>{t('Only the link-layer envelope (both MACs) and two IP header fields change; everything from the IP addresses inward is end-to-end. Measured with tshark on both sides of the router.', 'Chỉ phong bì tầng liên kết (hai MAC) và hai trường của header IP thay đổi; mọi thứ từ địa chỉ IP vào trong là đầu-cuối. Đo bằng tshark ở hai phía router.')} {(() => { const h = hops.find((x) => x.id === 'ip.sum')!; return t(h.en, h.vi); })()}</div>}
    </div>
  );
  const hopText: Array<[string, string, string]> = [
    ['nic-frame', 'The frame leaves the client: destination MAC = the router’s LAN card. Its IP header says TTL 64, checksum 0x3c52. Fill in your guesses on the right, then step through the router.', 'Frame rời client: MAC đích = card LAN của router. Header IP ghi TTL 64, checksum 0x3c52. Điền dự đoán bên phải, rồi đi từng bước qua router.'],
    ['tcp-stack', 'Inside the router: the Ethernet envelope is thrown away. The router reads ONLY the IP header — destination 10.10.2.10 ⇒ out of eth1 — subtracts 1 from TTL and recomputes the header checksum. It never opens TCP or HTTP.', 'Bên trong router: phong bì Ethernet bị vứt. Router CHỈ đọc header IP — đích 10.10.2.10 ⇒ ra eth1 — trừ TTL đi 1 và tính lại checksum của header. Nó không hề mở TCP hay HTTP.'],
    ['nic-frame', 'A brand-new Ethernet envelope for the second network: from the router’s eth1 (02:00:0a:0a:02:fe) to the web server (02:00:0a:0a:02:0a). Same IP packet inside, TTL 63, checksum 0x3d52.', 'Một phong bì Ethernet hoàn toàn mới cho mạng thứ hai: từ eth1 của router (02:00:0a:0a:02:fe) tới máy web (02:00:0a:0a:02:0a). Vẫn gói IP đó bên trong, TTL 63, checksum 0x3d52.'],
  ];

  // ── mtu ──
  const hdr = ETH_HDR + IP_HDR + TCP_HDR + TS_OPT;
  const sent = offload ? (p.i >= 2 ? cut.segs.length : 0) : p.i;
  const realRows = mtu === 1500 ? (offload ? BIG_SEGMENTS_TSO : BIG_SEGMENTS_OFF) : null;
  const mtuText = offload
    ? [
      ['tcp-stack', 'nginx wrote 3991 bytes. With segmentation offload ON (the default) the kernel does NOT cut them: it builds one big TCP segment and its headers once.', 'nginx ghi 3991 byte. Khi BẬT segmentation offload (mặc định), nhân KHÔNG cắt: nó dựng một đoạn TCP lớn và header một lần.'],
      ['nic-frame', `tcpdump sits BEFORE the cut, so the capture shows ONE ${superFrame(BIG.response)}-byte “packet” — bigger than the 1500 MTU. That is not a bug, it is TSO/GSO: the network card (TSO) or the driver at the last moment (GSO) will cut it.`, `tcpdump đứng TRƯỚC chỗ cắt, nên capture thấy MỘT “gói” ${superFrame(BIG.response)} byte — lớn hơn MTU 1500. Đó không phải lỗi, mà là TSO/GSO: card mạng (TSO) hoặc driver vào phút chót (GSO) sẽ cắt nó.`],
      ['wire', `On the actual wire there are still ${cut.segs.length} normal frames (${cut.frames.join(', ')} B). To see them in a capture, turn offload off: ethtool -K eth0 tso off gso off gro off.`, `Trên dây thật vẫn là ${cut.segs.length} frame bình thường (${cut.frames.join(', ')} B). Muốn thấy chúng trong capture, tắt offload: ethtool -K eth0 tso off gso off gro off.`],
    ]
    : [
      ['tcp-stack', `nginx wrote 3991 bytes (headers + 3841-byte body) into its socket. TCP must cut them into segments of at most ${cut.perSeg} bytes.`, `nginx ghi 3991 byte (header + thân 3841 byte) vào socket. TCP phải cắt chúng thành các đoạn tối đa ${cut.perSeg} byte.`],
      ...cut.segs.map((x, k) => ['wire', `Segment ${k + 1}: ${x} bytes of data + ${hdr} bytes of headers = a ${cut.frames[k]}-byte frame.${k === cut.segs.length - 1 && cut.segs.length > 1 ? ' The last one carries the rest.' : ''}`, `Đoạn ${k + 1}: ${x} byte dữ liệu + ${hdr} byte header = frame ${cut.frames[k]} byte.${k === cut.segs.length - 1 && cut.segs.length > 1 ? ' Đoạn cuối chở phần còn lại.' : ''}`] as [string, string, string]),
    ];
  const mt = mtuText[Math.min(p.i, mtuText.length - 1)];
  const mtuPanel = (
    <div className={s.stack} style={{ gap: 8 }}>
      <div className={s.bar} data-tour="en-mtu">
        <Seg label="MTU" value={mtu} options={[[1500, t('1500 (lab)', '1500 (lab)')], [1420, '1420 WireGuard'], [9000, '9000 jumbo']]} onChange={setMtuX} />
        <span className={cx(n.src, mtu === 1500 ? n.srcReal : n.srcCalc)}>{mtu === 1500 ? t('measured in the lab', 'đo trong lab') : t('computed', 'tính ra')}</span>
        <span data-tour="en-offload"><Seg label={t('segmentation offload', 'segmentation offload')} value={offload ? 'on' : 'off'} options={[['off', t('off', 'tắt')], ['on', t('on (default)', 'bật (mặc định)')]]} onChange={(v) => setOff(v === 'on')} /></span>
      </div>
      <div className={n.eq}>
        <span>MTU {mtu}</span>−<span>IP 20</span>−<span>TCP 20</span>=<span>MSS {cut.mss}</span>−<span>{t('timestamps', 'timestamp')} 12</span>=<span className={n.eqRes}>{cut.perSeg} {t('B per segment', 'B mỗi đoạn')}</span>
      </div>
      <div className={s.panel} data-tour="en-segs">
        <div className={s.panelTitle}>{t('The 3991-byte response on its way', 'Câu trả lời 3991 byte trên đường đi')}</div>
        <div className={n.segs}>
          {offload && p.i === 1 ? (
            <div className={cx(n.segRow, n.segFly)}>
              <span className={s.small}>{t('super', 'siêu gói')}</span>
              <div className={n.segBar}><span style={{ flexGrow: hdr, background: 'var(--nl-tcp)' }}>{hdr}</span><span style={{ flexGrow: BIG.response, background: 'var(--nl-http)' }}>3991</span></div>
              <b className={n.mono}>{superFrame(BIG.response)} B</b>
            </div>
          ) : cut.segs.map((x, k) => (
            <div key={`${mtu}-${k}`} className={cx(n.segRow, k < sent ? n.segFly : n.segPending)}>
              <span className={s.small}>#{k + 1}</span>
              <div className={n.segBar} style={{ width: `${Math.max(14, (100 * (x + hdr)) / Math.max(...cut.frames, 1514))}%` }}>
                <span style={{ flexGrow: hdr, background: 'var(--nl-tcp)' }}>{hdr}</span><span style={{ flexGrow: x, background: 'var(--nl-http)' }}>{x}</span>
              </div>
              <b className={n.mono}>{cut.frames[k]} B</b>
            </div>
          ))}
        </div>
        <div className={n.note} style={{ marginTop: 6 }}>{t('orange = 66 B of headers (Ethernet 14 + IP 20 + TCP 32), green = data', 'cam = 66 B header (Ethernet 14 + IP 20 + TCP 32), xanh = dữ liệu')}</div>
      </div>
      <div className={s.kpis}>
        <Kpi k={t('frames on the wire', 'frame trên dây')} v={cut.segs.length} />
        <Kpi k={t('what tcpdump shows', 'tcpdump thấy')} v={offload ? `1 × ${superFrame(BIG.response)} B` : `${cut.segs.length} × ≤${cut.frames[0]} B`} tone={offload ? 'warn' : undefined} />
        <Kpi k={t('useful share of wire bytes', 'phần có ích trên dây')} v={`${cut.efficiency}%`} />
      </div>
      <div className={n.note}>{t('Useful share counts the 24 invisible bytes per frame on a real cable (preamble 8, FCS 4, gap 12) — computed.', 'Phần có ích tính cả 24 byte vô hình mỗi frame trên dây thật (preamble 8, FCS 4, khoảng nghỉ 12) — tính ra.')}</div>
      <div data-tour="en-real">
        {realRows ? (
          <div className={n.term}>
            <div className={n.termCalc} style={{ whiteSpace: 'normal' }}>{offload ? t('# real capture, offload ON (default)', '# capture thật, offload BẬT (mặc định)') : t('# real capture, ethtool -K … tso off gso off gro off', '# capture thật, ethtool -K … tso off gso off gro off')}</div>
            {realRows.map((r) => <div key={r.no} className={r.from === 'web' && r.len > 66 ? n.termOn : undefined}>{`${String(r.no).padStart(3)}  ${r.t}  ${r.from === 'web' ? '10.10.2.10 → 10.10.1.10' : '10.10.1.10 → 10.10.2.10'}  ${String(r.len).padStart(4)}  ${r.info}`}</div>)}
          </div>
        ) : (
          <div className={n.note}><span className={cx(n.src, n.srcCalc)}>{t('computed', 'tính ra')}</span> {mtu === 1420 ? t('1420 is a common MTU inside a WireGuard tunnel (1500 minus the tunnel’s own headers). Not captured in the lab.', '1420 là MTU hay gặp bên trong đường hầm WireGuard (1500 trừ header của chính đường hầm). Lab không bắt gói này.') : t('Jumbo frames need EVERY card and switch on the path set to 9000; one 1500 box in the middle and big frames are dropped. Here the whole response fits one frame. Not captured in the lab.', 'Jumbo frame cần MỌI card và công tắc trên đường đặt 9000; chỉ một hộp 1500 ở giữa là frame lớn bị vứt. Ở đây cả câu trả lời vừa một frame. Lab không bắt gói này.')}</div>
        )}
      </div>
    </div>
  );

  const explain = mode === 'http' ? <Explain tone={st.tone}><b className={s.mono}>{st.call}</b> — {t(st.en, st.vi)}</Explain>
    : mode === 'hop' ? <Explain>{t(hopText[Math.min(p.i, 2)][1], hopText[Math.min(p.i, 2)][2])}</Explain>
      : <Explain tone={offload && p.i === 1 ? 'warn' : p.atEnd ? 'ok' : undefined}>{t(mt[1], mt[2])}</Explain>;
  const where = mode === 'http' ? st.where : mode === 'hop' ? hopText[Math.min(p.i, 2)][0] : mt[0];

  return (
    <Frame badge={t('Network lab', 'Phòng lab mạng')} title={t('Encapsulation: one request, four envelopes', 'Đóng gói: một request, bốn lớp phong bì')}
      sub={t('curl → nginx in the course’s Docker lab, byte for byte (real capture)', 'curl → nginx trong lab Docker của khoá, từng byte (capture thật)')}>
      <div className={n.nl}>
        <div className={s.bar} data-tour="en-mode">
          <Seg label={t('Scenario', 'Kịch bản')} value={mode} options={[['http', t('down & up the stack', 'xuống & lên ngăn xếp')], ['hop', t('across a router', 'qua một router')], ['mtu', t('big response & MTU', 'câu trả lời lớn & MTU')]]} onChange={switchMode} />
        </div>
        {machines}
        <Controls p={p} lang={lang} label={`${t('step', 'bước')} ${p.i + 1}/${p.total}`} />
        {mode === 'http' && <div><span className={n.place}>📍 {t(st.place[0], st.place[1])}</span></div>}
        {explain}
        {mode === 'mtu' ? (
          <div className={n.cols}>
            {mtuPanel}
            <WhereBox focus={where} lang={lang} height={200} />
          </div>
        ) : (
          <div className={n.cols}>
            <div className={s.stack} style={{ gap: 10 }}>
              {mode === 'hop' ? hopPanel : <div data-tour="en-env">{envelopes}</div>}
              {ruler}
            </div>
            <div className={s.stack} style={{ gap: 10 }}>
              {hexDump}
              <WhereBox focus={where} lang={lang} height={190} />
            </div>
          </div>
        )}
      </div>
    </Frame>
  );
}
