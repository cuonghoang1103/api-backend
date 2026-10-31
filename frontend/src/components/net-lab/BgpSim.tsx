'use client';
/**
 * BGP (Chương 2.5): Internet tìm một mạng thế nào.
 *   announce — ba AS trên điểm trao đổi IX lần lượt quảng bá dải của mình; bảng `show ip bgp` của isp và dc điền dần (khớp
 *              capture thật); bấm một dòng để đọc AS PATH: AS gốc = số CUỐI (198.18.0.0/24 ở dc: "64500 64511" ⇒ 64511)
 *   hijack   — rogue quảng bá 203.0.113.0/25 cụ thể hơn /24 của LabFlow ⇒ isp cài nó ⇒ hố đen (curl timeout, traceroute *,
 *              DNS chết vì ns .53 cũng nằm trong /25); người học bật prefix-list trên isp ⇒ về lại 192.0.2.3. RPKI = RIPEstat thật
 *   withdraw — dc rút 203.0.113.0/24 (kiểu Facebook 04/10/2021) ⇒ "Network is unreachable", !N, DNS REFUSED EDE 23; quảng bá lại
 * Engine: engine/bgp.ts. Số liệu: engine/capture2.ts.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  BGP_HEAD, BGP_SHOW, BGP_SUMMARY, FILTER_CMD, FILTER_OK, HIJACK_DC_SEES, HIJACK_FIB, HIJACK_LAPTOP, HIJACK_ROGUE_CMD,
  REANNOUNCE_CMD, REANNOUNCE_LAPTOP, RIPE, ROUTE_GET, WITHDRAW_CMD, WITHDRAW_ISP, WITHDRAW_LAPTOP,
} from './engine/capture2';
import { AS, BASE, HIJACK, ROA_CT, converge, nextHopFor, pathText, rpki, sameAsCapture, type AsId, type BgpRow } from './engine/bgp';
import { Controls, Explain, Frame, Seg, css as s, cx, tx, usePlayer, type Lang } from '../os-lab/ui';
import { WhereBox } from '../os-lab/where';
import { useLabBridge, useOwnStepSound } from '../labs/bus';
import { labSfx } from '../labs/sfx';
import { Src, Term, Topo, type TLine } from './parts';
import n from './netlab.module.css';

type Preset = 'announce' | 'hijack' | 'withdraw';
const PRESETS: Preset[] = ['announce', 'hijack', 'withdraw'];
const ASNAME: Record<number, string> = { 64500: 'isp', 64510: 'dc (LabFlow)', 64511: 'rogue', 152992: 'DATAONLINE-VN' };
type Sfx = 'whoosh' | 'pop' | 'hit' | 'miss' | 'oops' | 'tick' | 'right' | 'thud' | 'on';
interface Step { en: string; vi: string; tone?: 'ok' | 'warn' | 'bad'; sfx?: Sfx }

function BgpTable({ as, rows, lang, picked, onPick, real, tour, hot }: { as: AsId; rows: BgpRow[]; lang: Lang; picked?: string; onPick?: (net: string) => void; real: boolean; tour?: string; hot?: string[] }) {
  const t = (en: string, vi: string) => tx(lang, en, vi);
  return (
    <div className={s.panel} data-tour={tour} style={{ padding: 8 }}>
      <div className={s.panelTitle} style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
        <span className={s.mono}>show ip bgp</span> — {AS[as].name} AS{AS[as].asn}
        <Src real={real} lang={lang} en={real ? 'same as the lab' : 'computed'} vi={real ? 'đúng như trong lab' : 'tính ra'} />
      </div>
      {rows.length === 0 ? <span className={s.empty}>{t('(empty — nothing announced yet)', '(trống — chưa ai quảng bá)')}</span> : (
        <div style={{ overflowX: 'auto' }}>
          <table className={n.rt}>
            <thead><tr><th>Network</th><th>Next Hop</th><th className={n.hideSm}>Metric</th><th className={n.hideSm}>Weight</th><th>Path</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.network} className={cx(onPick && n.rtClick, picked === r.network && n.rtSel, hot?.includes(r.network) && n.rtBad)} onClick={onPick ? () => onPick(r.network) : undefined}
                  role={onPick ? 'button' : undefined} tabIndex={onPick ? 0 : undefined} onKeyDown={onPick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPick(r.network); } } : undefined}>
                  <td><code>{r.network}</code></td>
                  <td><code>{r.nextHop}</code></td>
                  <td className={n.hideSm}><code>{r.metric}</code></td>
                  <td className={n.hideSm}><code>{r.weight}</code></td>
                  <td><code>{r.path.map((a, k) => <span key={k}>{k ? ' ' : ''}{k === r.path.length - 1 ? <b style={{ color: 'var(--ol-accent)' }}>{a}</b> : a}</span>)}{r.path.length ? ' i' : 'i'}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function BgpSim({ lang = 'vi', preset = 'announce' }: { lang?: Lang; preset?: string }) {
  const t = (en: string, vi: string) => tx(lang, en, vi);
  const [pre, setPre] = useState<Preset>(PRESETS.includes(preset as Preset) ? (preset as Preset) : 'announce');
  const [pick, setPick] = useState<{ as: AsId; net: string } | null>(null);
  const [filter, setFilter] = useState(false);
  const [reann, setReann] = useState(false);
  const [saw, setSaw] = useState(false);
  const [roaAs, setRoaAs] = useState(152992);
  const [roaPfx, setRoaPfx] = useState('160.187.0.0/23');

  const base = useMemo(() => converge({ anns: BASE, filter: false }), []);
  const hj = useMemo(() => converge({ anns: [...BASE, HIJACK], filter: false }), []);
  const fx = useMemo(() => converge({ anns: [...BASE, HIJACK], filter: true }), []);
  const wd = useMemo(() => converge({ anns: BASE.filter((a) => a.as !== 'dc'), filter: false }), []);

  const total = pre === 'announce' ? 5 : pre === 'hijack' ? (filter ? 8 : 5) : reann ? 6 : 4;
  const p = usePlayer(total, 2000);
  useOwnStepSound();
  const [jump, setJump] = useState<number | null>(null);
  useEffect(() => { if (jump !== null && total > jump) { p.setI(jump); setJump(null); } }, [jump, total]); // eslint-disable-line react-hooks/exhaustive-deps

  const load = (k: Preset) => { setPre(k); setPick(null); setFilter(false); setReann(false); setSaw(false); p.reset(); labSfx('tap'); };
  const doPick = (as: AsId, net: string) => { setPick({ as, net }); labSfx('pop'); };
  const doFilter = () => { if (filter) return; setFilter(true); setJump(5); labSfx('on'); };
  const doReann = () => { if (reann) return; setReann(true); setJump(4); labSfx('on'); };

  // bảng isp ở bước hiện tại
  const ispRows = pre === 'announce' ? converge({ anns: BASE.slice(0, Math.min(p.i, 3)), filter: false }).isp
    : pre === 'hijack' ? (p.i < 2 ? base.isp : filter && p.i >= 5 ? fx.isp : hj.isp)
    : (p.i >= 2 && !(reann && p.i >= 4) ? wd.isp : base.isp);
  const nextHop = nextHopFor(ispRows, 'isp', '203.0.113.10');
  useEffect(() => { if (pre === 'hijack' && p.i >= 2 && !saw) setSaw(true); }, [pre, p.i, saw]);
  const announced = pre !== 'withdraw' || !(p.i >= 1 && !(reann && p.i >= 4));
  const pickedRow = pick ? (pre === 'announce' ? converge({ anns: BASE.slice(0, Math.min(p.i, 3)), filter: false })[pick.as] : base[pick.as]).find((r) => r.network === pick.net) : undefined;

  const steps: Step[] = pre === 'announce' ? [
    { sfx: 'tick', en: 'Three networks meet at an exchange point (IX, one shared switch 192.0.2.0/24): isp AS64500, the data centre dc AS64510 (LabFlow), and rogue AS64511. AS = “autonomous system”, a network run by one organisation, with a number. isp has a BGP session with each of the other two (BGP = Border Gateway Protocol: routers telling each other “I can reach these addresses”).', vi: 'Ba mạng gặp nhau ở một điểm trao đổi (IX, một công tắc chung 192.0.2.0/24): isp AS64500, trung tâm dữ liệu dc AS64510 (LabFlow), và rogue AS64511. AS = “hệ tự trị”, một mạng do một tổ chức vận hành, có một con số. isp có một phiên BGP với mỗi bên còn lại (BGP = Border Gateway Protocol: các router báo cho nhau “tôi tới được những địa chỉ này”).' },
    { sfx: 'whoosh', en: 'isp announces its customers’ block 198.51.100.0/24. In its own table: Next Hop 0.0.0.0 (“it is me”), Weight 32768 (local routes always win), Path empty — just “i” (origin IGP). dc learns it with Path “64500”: one AS away.', vi: 'isp quảng bá khối khách hàng của mình 198.51.100.0/24. Trong bảng của chính nó: Next Hop 0.0.0.0 (“là tôi”), Weight 32768 (tuyến tại chỗ luôn thắng), Path trống — chỉ “i” (gốc IGP). dc học nó với Path “64500”: cách một AS.' },
    { sfx: 'whoosh', en: 'dc announces LabFlow’s 203.0.113.0/24. isp learns it with Path “64510”, next hop 192.0.2.3 — dc’s address on the IX.', vi: 'dc quảng bá dải của LabFlow 203.0.113.0/24. isp học nó với Path “64510”, next hop 192.0.2.3 — địa chỉ của dc trên IX.' },
    { sfx: 'whoosh', en: 'rogue announces 198.18.0.0/24. isp learns “64511” and passes it on to dc, PREPENDING its own number: dc sees “64500 64511”. Every AS that forwards an announcement adds itself to the FRONT.', vi: 'rogue quảng bá 198.18.0.0/24. isp học “64511” rồi chuyển tiếp cho dc, THÊM số của mình vào ĐẦU: dc thấy “64500 64511”. AS nào chuyển tiếp một lời quảng bá cũng tự thêm mình vào ĐẦU.' },
    { sfx: 'right', tone: 'ok', en: 'Converged — both tables now equal the real `show ip bgp` of the lab. Read a path from right to left: the LAST number is the origin AS, the one that owns the block; the others are the ASes it passed through. Click a row to read it.', vi: 'Đã hội tụ — cả hai bảng giờ y như `show ip bgp` thật của lab. Đọc một path từ phải sang trái: số CUỐI là AS gốc, AS sở hữu khối đó; các số còn lại là những AS nó đã đi qua. Bấm một dòng để đọc.' },
  ] : pre === 'hijack' ? [
    { sfx: 'tick', en: 'Normal day: isp reaches LabFlow 203.0.113.10 via 192.0.2.3 (dc), learned by BGP with Path “64510”.', vi: 'Ngày bình thường: isp tới LabFlow 203.0.113.10 qua 192.0.2.3 (dc), học bằng BGP với Path “64510”.' },
    { sfx: 'oops', tone: 'warn', en: 'rogue adds “blackhole 203.0.113.0/25” (drop everything) and announces 203.0.113.0/25 — HALF of LabFlow’s block, but MORE SPECIFIC. Like Pakistan Telecom and YouTube in 2008. Nothing in BGP checks who owns a block.', vi: 'rogue thêm “blackhole 203.0.113.0/25” (vứt hết) rồi quảng bá 203.0.113.0/25 — MỘT NỬA khối của LabFlow, nhưng CỤ THỂ HƠN. Giống Pakistan Telecom với YouTube năm 2008. BGP không có gì kiểm ai sở hữu một khối.' },
    { sfx: 'thud', tone: 'bad', en: 'isp accepts both. Its kernel routing table now has 203.0.113.0/24 via dc AND 203.0.113.0/25 via rogue. For 203.0.113.10 both match — longest prefix wins ⇒ /25 ⇒ via 192.0.2.66, into rogue’s black hole.', vi: 'isp nhận cả hai. Bảng định tuyến nhân của nó giờ có 203.0.113.0/24 qua dc VÀ 203.0.113.0/25 qua rogue. Với 203.0.113.10 cả hai đều khớp — tiền tố dài nhất thắng ⇒ /25 ⇒ qua 192.0.2.66, rơi vào hố đen của rogue.' },
    { sfx: 'miss', tone: 'bad', en: 'Users at home: curl times out, traceroute stops after isp (* * *), and even DNS dies — LabFlow’s name server 203.0.113.53 is also inside 0–127. The site is not “slow”, it has vanished. (203.0.113.200, in the upper half, still works.)', vi: 'Người dùng ở nhà: curl hết giờ, traceroute dừng sau isp (* * *), và cả DNS cũng chết — máy chủ tên của LabFlow 203.0.113.53 cũng nằm trong 0–127. Trang không “chậm”, nó biến mất. (203.0.113.200, ở nửa trên, vẫn chạy.)' },
    { sfx: 'tick', tone: 'warn', en: 'dc can see it happen: its own block appears with a strange origin, Path “64500 64511”. Monitoring services (BGPalerts, RIPE RIS) watch exactly this. Now fix it: on isp, only accept from AS64511 the block it really owns.', vi: 'dc thấy được chuyện đang xảy ra: chính khối của nó hiện ra với AS gốc lạ, Path “64500 64511”. Các dịch vụ giám sát (BGPalerts, RIPE RIS) canh đúng điều này. Giờ sửa: trên isp, chỉ nhận từ AS64511 đúng khối nó sở hữu.' },
    { sfx: 'on', tone: 'ok', en: 'Prefix-list FROM-ROGUE: “permit 198.18.0.0/24”, applied inbound on the session with 192.0.2.66. Everything else from rogue is rejected — the /25 disappears from isp’s table and 203.0.113.10 goes via 192.0.2.3 again.', vi: 'Prefix-list FROM-ROGUE: “permit 198.18.0.0/24”, áp chiều vào trên phiên với 192.0.2.66. Mọi thứ khác từ rogue bị từ chối — /25 biến khỏi bảng của isp và 203.0.113.10 lại đi qua 192.0.2.3.' },
    { sfx: 'right', tone: 'ok', en: 'LabFlow opens again for users. But this fix needs every ISP to keep a correct filter for every customer — by hand.', vi: 'LabFlow mở lại với người dùng. Nhưng cách sửa này đòi mọi nhà mạng giữ bộ lọc đúng cho từng khách hàng — bằng tay.' },
    { sfx: 'right', tone: 'ok', en: 'Internet-scale fix: RPKI. The owner signs a ROA (“AS152992 may originate 160.187.0.0/23, up to /24”) and routers drop announcements that break it. Real data for cuongthai.com: valid for AS152992; AS64511 ⇒ invalid_asn; a /25 ⇒ invalid_length — exactly the hijack above.', vi: 'Cách sửa ở quy mô Internet: RPKI. Chủ khối ký một ROA (“AS152992 được làm gốc cho 160.187.0.0/23, tới /24”) và router vứt lời quảng bá trái với nó. Số liệu thật của cuongthai.com: hợp lệ với AS152992; AS64511 ⇒ invalid_asn; một /25 ⇒ invalid_length — đúng vụ cướp tuyến ở trên.' },
  ] : [
    { sfx: 'tick', en: 'Normal: isp has 203.0.113.0/24 via dc. LabFlow’s web server .10 and its name server .53 are both inside it.', vi: 'Bình thường: isp có 203.0.113.0/24 qua dc. Máy web .10 và máy chủ tên .53 của LabFlow đều nằm trong đó.' },
    { sfx: 'oops', tone: 'warn', en: 'A config change on dc: “no network 203.0.113.0/24” — dc stops announcing its own block. That is what a bad config push did to Facebook on 4 October 2021.', vi: 'Một thay đổi cấu hình trên dc: “no network 203.0.113.0/24” — dc ngừng quảng bá chính khối của mình. Đó là điều một lần đẩy cấu hình lỗi đã làm với Facebook ngày 4/10/2021.' },
    { sfx: 'thud', tone: 'bad', en: 'isp receives the withdrawal and forgets the block: ip route get 203.0.113.10 ⇒ “Network is unreachable”, and the same for the name server 203.0.113.53.', vi: 'isp nhận lời rút và quên khối đó: ip route get 203.0.113.10 ⇒ “Network is unreachable”, máy chủ tên 203.0.113.53 cũng vậy.' },
    { sfx: 'miss', tone: 'bad', en: 'Users: the resolver cannot reach the name server ⇒ DNS answers REFUSED with EDE 23 (Network Error) ⇒ curl “Could not resolve host”. By IP: “Could not connect”, traceroute ends with !N at 198.51.100.1. The servers are running fine — the Internet just forgot the way. (Facebook’s engineers could not even reach their own buildings’ systems.)', vi: 'Người dùng: resolver không tới được máy chủ tên ⇒ DNS trả REFUSED kèm EDE 23 (Network Error) ⇒ curl “Could not resolve host”. Gõ IP: “Could not connect”, traceroute kết thúc bằng !N ở 198.51.100.1. Các máy chủ vẫn chạy ngon — chỉ là Internet quên đường. (Kỹ sư Facebook còn không vào được hệ thống của chính toà nhà họ.)' },
    { sfx: 'on', tone: 'ok', en: 'dc announces 203.0.113.0/24 again. isp relearns it within a second.', vi: 'dc quảng bá lại 203.0.113.0/24. isp học lại nó trong vòng một giây.' },
    { sfx: 'right', tone: 'ok', en: 'The name resolves again and the page opens.', vi: 'Tên phân giải lại được và trang mở ra.' },
  ];
  const S = steps[Math.min(p.i, steps.length - 1)];
  const prevI = useRef(p.i);
  useEffect(() => { if (p.i > prevI.current) labSfx(S.sfx ?? 'tick'); prevI.current = p.i; }, [p.i]); // eslint-disable-line react-hooks/exhaustive-deps

  useLabBridge('bgp', {
    preset: pre, i: p.i, atEnd: p.atEnd,
    pickedAs: pick?.as ?? '', pickedNet: pick?.net ?? '', pickedOrigin: pickedRow?.origin ?? 0,
    filter, sawHijack: saw, nextHop: nextHop ?? 'none', announced, reannounced: reann,
  }, {
    preset: (v) => load(String(v) as Preset),
    pick: (v) => { const [a, net] = String(v).split('|'); doPick(a as AsId, net); },
    filter: () => doFilter(),
    announce: () => doReann(),
  });

  // ───────── sơ đồ ─────────
  const traffic = pre === 'announce' ? undefined : nextHop === '192.0.2.3' ? 'dc' : nextHop === '192.0.2.66' ? 'rogue' : 'none';
  const showTraffic = pre !== 'announce' && (pre === 'hijack' ? p.i !== 1 && p.i !== 4 && p.i !== 7 : p.i !== 1 && p.i !== 4);
  const ann = pre === 'announce' ? Math.min(p.i, 3) : 0;
  const topo = pre === 'announce' ? (
    <Topo label={t('three ASes on an exchange point', 'ba AS trên một điểm trao đổi')} w={520} h={196}
      pill={p.i >= 1 && p.i <= 3 ? `${['', 'isp', 'dc', 'rogue'][p.i]}: ${t('announce', 'quảng bá')} ${BASE[p.i - 1].prefix}` : undefined} k="#7c3aed"
      nodes={[
        { id: 'isp', x: 260, y: 48, icon: '🏢', name: 'isp AS64500', sub: '192.0.2.1', sub2: '198.51.100.0/24', on: p.i === 1, w: 150 },
        { id: 'ix', x: 260, y: 150, icon: '🔌', name: 'IX 192.0.2.0/24', sub: t('shared switch', 'công tắc chung'), w: 150 },
        { id: 'rogue', x: 80, y: 150, icon: '🏴', name: 'rogue AS64511', sub: '192.0.2.66', sub2: '198.18.0.0/24', on: p.i === 3, w: 140 },
        { id: 'dc', x: 440, y: 150, icon: '🏭', name: 'dc AS64510', sub: '192.0.2.3', sub2: '203.0.113.0/24', on: p.i === 2, w: 140 },
      ]}
      links={[
        { a: 'isp', b: 'ix', on: ann >= 1 && p.i <= 3, back: p.i !== 1 },
        { a: 'rogue', b: 'ix', on: p.i === 3 },
        { a: 'dc', b: 'ix', on: p.i === 2 || p.i === 1, back: p.i === 1 },
      ]} />
  ) : (
    <Topo label={t('home, isp, dc and rogue', 'nhà, isp, dc và rogue')} w={520} h={196}
      pill={showTraffic ? (traffic === 'dc' ? t('to 203.0.113.10: via dc ✓', 'tới 203.0.113.10: qua dc ✓') : traffic === 'rogue' ? t('to 203.0.113.10: into the black hole', 'tới 203.0.113.10: vào hố đen') : t('to 203.0.113.10: no route', 'tới 203.0.113.10: không có tuyến')) : undefined}
      k={traffic === 'dc' ? '#16a34a' : '#dc2626'}
      nodes={[
        { id: 'home', x: 66, y: 60, icon: '💻', name: 'laptop', sub: '192.168.50.10', on: (pre === 'hijack' ? p.i === 3 || p.i === 6 : p.i === 3 || p.i === 5), bad: (pre === 'hijack' && p.i === 3) || (pre === 'withdraw' && p.i === 3), w: 112 },
        { id: 'isp', x: 236, y: 60, icon: '🏢', name: 'isp AS64500', sub: '192.0.2.1', on: pre === 'hijack' ? p.i === 2 || p.i === 5 : p.i === 2, bad: traffic === 'none' && showTraffic, w: 132 },
        { id: 'dc', x: 436, y: 60, icon: '🏭', name: 'dc AS64510', sub: '203.0.113.0/24', on: pre === 'hijack' ? p.i === 4 : p.i === 1 || p.i === 4, w: 140 },
        { id: 'rogue', x: 436, y: 158, icon: '🏴', name: 'rogue AS64511', sub: pre === 'hijack' && p.i >= 1 ? '+ 203.0.113.0/25 🕳' : '198.18.0.0/24', on: pre === 'hijack' && p.i === 1, bad: pre === 'hijack' && traffic === 'rogue' && showTraffic, w: 140 },
      ]}
      links={[
        { a: 'home', b: 'isp', on: showTraffic },
        { a: 'isp', b: 'dc', on: showTraffic && traffic === 'dc', label: 'IX', dashed: pre === 'withdraw' && !announced },
        { a: 'isp', b: 'rogue', bad: showTraffic && traffic === 'rogue', label: 'IX' },
      ]}
      marks={showTraffic && traffic === 'none' ? [{ x: 236, y: 112, text: '!N', bad: true }] : showTraffic && traffic === 'rogue' ? [{ x: 436, y: 112, text: t('dropped', 'bị vứt'), bad: true }] : undefined} />
  );

  // ───────── từng kịch bản ─────────
  const announceView = pre === 'announce' && (() => {
    const tab = converge({ anns: BASE.slice(0, ann), filter: false });
    const done = p.i >= 4;
    const pr = pickedRow;
    return (
      <>
        <div className={n.cols}>
          <div className={s.stack} style={{ gap: 8 }}>
            <div className={s.panel} style={{ padding: 6 }} data-tour="bgp-topo">{topo}</div>
            <Term lang={lang} tour="bgp-summary" title="$ vtysh -c 'show bgp ipv4 unicast summary'  # isp" real lines={BGP_SUMMARY.map((l, k) => ({ t: l, on: k > 0 && p.i === 0 }))} />
          </div>
          <div className={s.stack} style={{ gap: 8 }}>
            <BgpTable as="isp" rows={tab.isp} lang={lang} real={done && sameAsCapture(tab.isp, BGP_SHOW.isp)} tour="bgp-isp" picked={pick?.as === 'isp' ? pick.net : undefined} onPick={(net) => doPick('isp', net)} />
            <BgpTable as="dc" rows={tab.dc} lang={lang} real={done && sameAsCapture(tab.dc, BGP_SHOW.dc)} tour="bgp-dc" picked={pick?.as === 'dc' ? pick.net : undefined} onPick={(net) => doPick('dc', net)} />
            <div data-tour="bgp-path" className={cx(n.verdict, pr ? n.vNew : n.vOk)} style={pr ? undefined : { opacity: 0.7 }}>
              {pr ? (pr.own
                ? t(`${pr.network} at ${pick!.as}: its OWN block (Next Hop 0.0.0.0, Weight 32768). Origin = AS${pr.origin} itself.`, `${pr.network} ở ${pick!.as}: khối CỦA CHÍNH NÓ (Next Hop 0.0.0.0, Weight 32768). AS gốc = chính AS${pr.origin}.`)
                : t(`${pr.network} at ${pick!.as}: Path “${pathText(pr)}” — read right to left: origin AS${pr.origin} (${ASNAME[pr.origin]})${pr.path.length > 1 ? `, passed through AS${pr.path.slice(0, -1).join(', AS')} (${pr.path.slice(0, -1).map((a) => ASNAME[a]).join(', ')})` : ', learned directly'}. ${pr.path.length} AS hop${pr.path.length > 1 ? 's' : ''}; next hop ${pr.nextHop}.`,
                  `${pr.network} ở ${pick!.as}: Path “${pathText(pr)}” — đọc từ phải sang trái: AS gốc AS${pr.origin} (${ASNAME[pr.origin]})${pr.path.length > 1 ? `, đã đi qua AS${pr.path.slice(0, -1).join(', AS')} (${pr.path.slice(0, -1).map((a) => ASNAME[a]).join(', ')})` : ', học trực tiếp'}. ${pr.path.length} chặng AS; next hop ${pr.nextHop}.`))
                : t('Click a row of a table to read its AS path.', 'Bấm một dòng trong bảng để đọc AS path của nó.')}
            </div>
            <WhereBox focus="bgp-rib" lang={lang} height={150} />
          </div>
        </div>
      </>
    );
  })();

  const hijackView = pre === 'hijack' && (() => {
    const i = p.i;
    const ispReal = i < 2 ? sameAsCapture(ispRows, BGP_SHOW.isp) : filter && i >= 5 ? sameAsCapture(ispRows, BGP_SHOW.ispFiltered) : sameAsCapture(ispRows, BGP_SHOW.ispHijack);
    const left: TLine[] = i === 0 ? ['$ ip route get 203.0.113.10  # isp', { t: ROUTE_GET['isp|203.0.113.10'], on: true }]
      : i === 1 ? [`${HIJACK_ROGUE_CMD[0]}  # rogue`, "$ vtysh … 'network 203.0.113.0/25'", BGP_HEAD, ...BGP_SHOW.rogueHijack.map((l) => ({ t: l, on: /\/25/.test(l) }))]
      : i === 2 ? ['$ ip route | grep 203.0.113  # isp', { t: HIJACK_FIB[0], on: true }, HIJACK_FIB[1], '$ ip route get 203.0.113.10', { t: HIJACK_FIB[2], on: true }]
      : i === 3 ? ['$ curl -m 3 http://203.0.113.10/  # laptop', { t: HIJACK_LAPTOP[0], on: true }, '$ traceroute -n -q 1 -N 1 -w 1 -m 5 203.0.113.10', ...HIJACK_LAPTOP.slice(1, 6).map((l) => ({ t: l, on: l.includes('*') })), '$ dig labflow.test', ...HIJACK_LAPTOP.slice(6).map((l) => ({ t: l, on: true }))]
      : i === 4 ? ["$ vtysh -c 'show ip bgp 203.0.113.0/25'  # dc", ...HIJACK_DC_SEES.map((l, k) => ({ t: l, on: k === 1 }))]
      : i === 5 ? [{ t: FILTER_CMD[0], on: true }, '$ ip route get 203.0.113.10  # isp', { t: FILTER_CMD[1], on: true }]
      : i === 6 ? ['$ curl -4 -s http://labflow.test/  # laptop', ...FILTER_OK.map((l) => ({ t: l, on: true }))]
      : RIPE.map((l, k) => ({ t: l, on: k >= 2 }));
    const st = rpki([ROA_CT], roaAs, roaPfx);
    const realRpki = (roaAs === 152992 && roaPfx === '160.187.0.0/23') || (roaAs === 64511 && roaPfx === '160.187.0.0/23') || (roaAs === 152992 && roaPfx === '160.187.1.0/25');
    return (
      <>
        <div className={s.bar} data-tour="bgp-filter">
          <button type="button" className={cx(s.btn, filter ? s.on : s.primary)} disabled={filter || !saw} onClick={doFilter}>🛡 {filter ? t('prefix-list FROM-ROGUE applied on isp', 'đã áp prefix-list FROM-ROGUE trên isp') : t('Apply a prefix-list on isp (accept only 198.18.0.0/24 from AS64511)', 'Áp prefix-list trên isp (chỉ nhận 198.18.0.0/24 từ AS64511)')}</button>
          {!saw && <span className={s.small}>{t('(step until the hijack happens first)', '(bấm Bước tới lúc bị cướp tuyến trước đã)')}</span>}
        </div>
        <Controls p={p} lang={lang} />
        <Explain tone={S.tone}>{t(S.en, S.vi)}</Explain>
        <div className={n.cols}>
          <div className={s.stack} style={{ gap: 8 }}>
            <div className={s.panel} style={{ padding: 6 }} data-tour="bgp-topo">{topo}</div>
            <Term lang={lang} tour="bgp-term" real wrap lines={left} />
          </div>
          <div className={s.stack} style={{ gap: 8 }}>
            <BgpTable as="isp" rows={ispRows} lang={lang} real={ispReal} tour="bgp-isp" hot={i >= 2 && !(filter && i >= 5) ? ['203.0.113.0/25'] : undefined} />
            <div className={cx(n.verdict, nextHop === '192.0.2.3' ? n.vOk : n.vBad)} data-tour="bgp-nexthop">isp → 203.0.113.10: {nextHop === '192.0.2.3' ? t('via 192.0.2.3 (dc) ✓', 'qua 192.0.2.3 (dc) ✓') : t('via 192.0.2.66 (rogue) ✕ — the /25 is longer', 'qua 192.0.2.66 (rogue) ✕ — /25 dài hơn')}</div>
            {i >= 7 && (
              <div className={s.panel} data-tour="bgp-rpki">
                <div className={s.panelTitle} style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>RPKI — ROA: AS152992, 160.187.0.0/23, max /24 <Src real={realRpki} lang={lang} en={realRpki ? 'RIPEstat, real' : 'computed with the ROA'} vi={realRpki ? 'RIPEstat, thật' : 'tính từ ROA'} /></div>
                <div className={s.bar} style={{ margin: '4px 0' }}>
                  <Seg label={t('origin', 'AS gốc')} value={String(roaAs)} options={[['152992', 'AS152992'], ['64511', 'AS64511']]} onChange={(v) => { setRoaAs(Number(v)); labSfx('tap'); }} />
                  <Seg label={t('prefix', 'tiền tố')} value={roaPfx} options={[['160.187.0.0/23', '/23'], ['160.187.1.0/24', '/24'], ['160.187.1.0/25', '/25']]} onChange={(v) => { setRoaPfx(v); labSfx('tap'); }} />
                </div>
                <div className={cx(n.verdict, st === 'valid' ? n.vOk : n.vBad)}>AS{roaAs} {t('announcing', 'quảng bá')} {roaPfx}: {st}</div>
              </div>
            )}
            <WhereBox focus="bgp-rib" lang={lang} height={150} />
          </div>
        </div>
      </>
    );
  })();

  const withdrawView = pre === 'withdraw' && (() => {
    const i = p.i;
    const lines: TLine[] = i === 0 ? ['$ ip route get 203.0.113.10  # isp', { t: ROUTE_GET['isp|203.0.113.10'], on: true }]
      : i === 1 ? [{ t: WITHDRAW_CMD[0] + '  # dc', on: true }]
      : i === 2 ? WITHDRAW_ISP.map((l) => ({ t: l, on: !l.startsWith('$') }))
      : i === 3 ? ['$ dig +tries=1 labflow.test', { t: WITHDRAW_LAPTOP[0], on: true }, { t: WITHDRAW_LAPTOP[1], on: true }, '$ curl -m 3 http://labflow.test/', { t: WITHDRAW_LAPTOP[2], on: true }, '$ curl -m 3 http://203.0.113.10/', WITHDRAW_LAPTOP[3], '$ traceroute -n -q 1 -N 1 -m 4 203.0.113.10', WITHDRAW_LAPTOP[4], { t: WITHDRAW_LAPTOP[5], on: true }]
      : i === 4 ? [{ t: REANNOUNCE_CMD[0] + '  # dc', on: true }]
      : REANNOUNCE_LAPTOP.map((l) => ({ t: l, on: !l.startsWith('$') }));
    const ispReal = i >= 2 && !(reann && i >= 4) ? sameAsCapture(ispRows, BGP_SHOW.ispWithdrawn) : sameAsCapture(ispRows, BGP_SHOW.isp);
    return (
      <>
        <div className={s.bar} data-tour="bgp-reannounce">
          <button type="button" className={cx(s.btn, reann ? s.on : s.primary)} disabled={reann || p.i < 3} onClick={doReann}>📣 {reann ? t('dc announces 203.0.113.0/24 again', 'dc đã quảng bá lại 203.0.113.0/24') : t('Announce 203.0.113.0/24 again on dc', 'Quảng bá lại 203.0.113.0/24 trên dc')}</button>
        </div>
        <Controls p={p} lang={lang} />
        <Explain tone={S.tone}>{t(S.en, S.vi)}</Explain>
        <div className={n.cols}>
          <div className={s.stack} style={{ gap: 8 }}>
            <div className={s.panel} style={{ padding: 6 }} data-tour="bgp-topo">{topo}</div>
            <Term lang={lang} tour="bgp-term" real wrap lines={lines} />
          </div>
          <div className={s.stack} style={{ gap: 8 }}>
            <BgpTable as="isp" rows={ispRows} lang={lang} real={ispReal} tour="bgp-isp" />
            <WhereBox focus="bgp-rib" lang={lang} height={150} />
          </div>
        </div>
      </>
    );
  })();

  return (
    <Frame badge={t('Network lab', 'Phòng lab mạng')} title={t('BGP: how the Internet finds a network', 'BGP: Internet tìm một mạng thế nào')}
      sub={t('Real FRR “show ip bgp” tables from the course’s exchange point — announce, hijack, withdraw', 'Bảng “show ip bgp” thật của FRR ở điểm trao đổi trong lab — quảng bá, cướp tuyến, rút tuyến')}>
      <div className={n.nl}>
        <div className={s.bar} data-tour="bgp-preset">
          <Seg label={t('Scenario', 'Kịch bản')} value={pre} options={[['announce', t('announce', 'quảng bá')], ['hijack', t('hijack', 'cướp tuyến')], ['withdraw', t('withdraw', 'rút tuyến')]]} onChange={load} />
        </div>
        {pre === 'announce' && <><Controls p={p} lang={lang} /><Explain tone={S.tone}>{t(S.en, S.vi)}</Explain></>}
        {announceView}{hijackView}{withdrawView}
        <div className={n.note}>{t('AS path = the list of networks an announcement passed through, newest first. Origin AS = the last number = who claims to own the block. Longest prefix still decides where packets go.', 'AS path = danh sách các mạng mà một lời quảng bá đã đi qua, mới nhất đứng đầu. AS gốc = số cuối = ai nhận là chủ khối. Tiền tố dài nhất vẫn quyết định gói đi đâu.')}</div>
      </div>
    </Frame>
  );
}
