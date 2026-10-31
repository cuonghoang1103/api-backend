/**
 * route — engine thuần cho mô phỏng `route` (Chương 2.2), trên các bảng định tuyến THẬT của "Internet in a box":
 *   • lookup — khớp tiền tố dài nhất (longest-prefix match): mọi dòng có (đích AND mặt nạ) = mạng của dòng đều KHỚP,
 *              dòng có prefix DÀI nhất thắng; không dòng nào khớp ⇒ "Network is unreachable". routeGet() in ra đúng
 *              như `ip route get` (test so với c22-*.out.txt).
 *   • trace  — traceroute: gói thăm dò TTL = 1, 2, 3, 4; router nào cũng trừ TTL 1, về 0 thì vứt và báo ICMP
 *              "Time exceeded"; đích cuối trả "Port unreachable" (cổng UDP 33434+ không ai nghe).
 *   • loop   — tuyến /32 bị quên trên dc trỏ ngược về isp ⇒ gói chạy qua lại tới khi TTL = 0 ở isp.
 * walk() cho gói đi thật qua các bảng (không kịch bản cứng) — test kiểm nó tái tạo đúng TTL của capture.
 */
import { RT_DC_REAL, RT_HOMEGW, RT_ISP, RT_LAPTOP, ROUTE_GET } from './capture2';
import { intToIp, ipToInt, maskOf } from './subnet';

export type RouterId = 'laptop' | 'homegw' | 'isp' | 'dc';
export interface Route { line: string; net: number; len: number; via?: string; dev: string; proto?: string; real: boolean; forgotten?: boolean }

export function parseRoute(line: string, real = true): Route {
  const w = line.trim().split(/\s+/);
  let net = 0, len = 0;
  if (w[0] !== 'default') {
    const [a, l] = w[0].split('/');
    len = l === undefined ? 32 : Number(l);
    net = (ipToInt(a) & maskOf(len)) >>> 0;
  }
  const at = (k: string) => { const i = w.indexOf(k); return i >= 0 ? w[i + 1] : undefined; };
  return { line, net, len, via: at('via'), dev: at('dev') ?? '', proto: at('proto'), real };
}

/** dc: chỉ hai dòng có capture (grep 203.0.113); các dòng còn lại TÍNH RA từ địa chỉ card + `show ip bgp` của dc (c25-dc) */
export const DC_CALC_LINES = [
  '192.0.2.0/24 dev ix0 proto kernel scope link src 192.0.2.3',
  '198.18.0.0/24 via 192.0.2.66 dev ix0 proto bgp metric 20',
  '198.51.100.0/24 via 192.0.2.1 dev ix0 proto bgp metric 20',
];
export function table(r: RouterId, forgotten = false): Route[] {
  if (r === 'laptop') return RT_LAPTOP.map((l) => parseRoute(l));
  if (r === 'homegw') return RT_HOMEGW.map((l) => parseRoute(l));
  if (r === 'isp') return RT_ISP.map((l) => parseRoute(l));
  const t = [...DC_CALC_LINES.map((l) => parseRoute(l, false)), parseRoute(RT_DC_REAL[0])];
  if (forgotten) t.push({ ...parseRoute(RT_DC_REAL[1]), forgotten: true });
  return t;
}
/** địa chỉ của từng card (nguồn "src" trong ip route get) */
export const IFACE: Record<RouterId, Record<string, string>> = {
  laptop: { eth0: '192.168.50.10' },
  homegw: { lan0: '192.168.50.1', wan0: '198.51.100.2' },
  isp: { cust0: '198.51.100.1', mob0: '100.64.0.1', ix0: '192.0.2.1' },
  dc: { ix0: '192.0.2.3', dc0: '203.0.113.1' },
};
export const ROUTER_IP: Record<RouterId, string> = { laptop: '192.168.50.10', homegw: '192.168.50.1', isp: '198.51.100.1', dc: '192.0.2.3' };

export interface Check { route: Route; match: boolean }
export interface Lookup { checks: Check[]; winner?: Route; get: string }
export const matches = (r: { net: number; len: number }, dst: number) => ((dst & maskOf(r.len)) >>> 0) === r.net;
export function lpm<T extends { net: number; len: number }>(rows: T[], dst: number): T | undefined {
  let best: T | undefined;
  for (const r of rows) if (matches(r, dst) && (!best || r.len > best.len)) best = r;
  return best;
}
export function lookup(router: RouterId, dst: string, forgotten = false): Lookup {
  const d = ipToInt(dst);
  const t = table(router, forgotten);
  const checks = t.map((route) => ({ route, match: matches(route, d) }));
  const winner = lpm(t, d);
  return { checks, winner, get: routeGet(router, dst, winner) };
}
export function routeGet(router: RouterId, dst: string, w: Route | undefined): string {
  if (!w) return 'RTNETLINK answers: Network is unreachable';
  const src = IFACE[router][w.dev];
  return w.via ? `${dst} via ${w.via} dev ${w.dev} src ${src} uid 0` : `${dst} dev ${w.dev} src ${src} uid 0`;
}
/** có capture thật cho (router, đích) này không */
export const realGet = (router: RouterId, dst: string, forgotten: boolean) => ROUTE_GET[`${router}${router === 'dc' && forgotten ? '+32' : ''}|${dst}`];

// ───────── cho gói đi thật qua các bảng ─────────
/** next hop (IP) ⇒ router nhận */
const OWNER: Record<string, RouterId | 'rogue'> = { '192.168.50.1': 'homegw', '198.51.100.1': 'isp', '192.0.2.1': 'isp', '192.0.2.3': 'dc', '192.0.2.66': 'rogue' };
export const SERVER = '203.0.113.10';
export interface Hop { at: RouterId | 'server' | 'rogue'; ttlIn: number; ttlOut?: number; route?: Route }
export interface Walk { hops: Hop[]; outcome: 'delivered' | 'expired' | 'unreachable' | 'blackhole'; at: string; replyFrom?: string }
/**
 * laptop gửi gói tới `dst` với TTL `ttl`. Mỗi router: TTL − 1; về 0 ⇒ vứt + "Time exceeded" (nguồn = card phía người gửi
 * — với laptop là địa chỉ ROUTER_IP); còn lại tra bảng (LPM) và chuyển cho next hop / giao thẳng.
 */
export function walk(dst: string, ttl: number, forgotten = false, maxHops = 80): Walk {
  const d = ipToInt(dst);
  const hops: Hop[] = [];
  // laptop không trừ TTL của gói nó tự gửi
  let cur: RouterId = 'laptop';
  let t = ttl;
  let w = lpm(table('laptop'), d);
  for (let k = 0; k < maxHops; k++) {
    if (!w) return { hops, outcome: 'unreachable', at: cur };
    if (!w.via) {
      // nối thẳng: giao cho máy đích
      hops.push({ at: 'server', ttlIn: t });
      return { hops, outcome: 'delivered', at: intToIp(d) };
    }
    const nxt = OWNER[w.via];
    if (nxt === 'rogue') { hops.push({ at: 'rogue', ttlIn: t }); return { hops, outcome: 'blackhole', at: 'rogue' }; }
    cur = nxt;
    const ttlOut = t - 1;
    const hop: Hop = { at: cur, ttlIn: t, ttlOut };
    hops.push(hop);
    if (ttlOut <= 0) return { hops, outcome: 'expired', at: cur, replyFrom: ROUTER_IP[cur] };
    t = ttlOut;
    w = lpm(table(cur, forgotten), d);
    hop.route = w;
  }
  return { hops, outcome: 'expired', at: cur };
}
/** TTL của câu trả lời ICMP khi về tới laptop: bắt đầu 64, mỗi router ở giữa trừ 1 */
export const replyTtl = (hopIndex: number) => 64 - (hopIndex - 1);

// ───────── kịch bản traceroute ─────────
export const PATH_NODES = ['laptop', 'homegw', 'isp', 'dc', 'server'] as const;
export const HOP_IP = ['192.168.50.10', '192.168.50.1', '198.51.100.1', '192.0.2.3', '203.0.113.10'];
export interface TraceStep {
  ttl: number; phase: 'intro' | 'send' | 'reply' | 'star' | 'port' | 'done';
  /** node (chỉ số trong PATH_NODES) nơi gói thăm dò chết / được trả lời */
  at: number;
  /** dòng tshark thật đang sáng (chỉ số TRACE_TSHARK) */
  tshark: number[];
  /** số dòng traceroute đã in */
  hopsShown: number;
  replyTtl?: number;
  en: string; vi: string; tone?: 'ok' | 'warn' | 'bad';
  sfx?: 'whoosh' | 'pop' | 'hit' | 'miss' | 'oops' | 'tick' | 'right' | 'thud' | 'on';
}
export function traceScript(silent: boolean): TraceStep[] {
  const out: TraceStep[] = [];
  out.push({ ttl: 0, phase: 'intro', at: 0, tshark: [], hopsShown: 0, sfx: 'tick',
    en: `traceroute -n 203.0.113.10: the laptop wants the list of routers on the way to the LabFlow server. Trick: send probes with TTL = 1, 2, 3… (TTL = “time to live”, a counter every router lowers by 1). Each router that lowers it to 0 throws the packet away and sends back an ICMP “Time exceeded” — and so reveals its address.${silent ? ' This time router dc is configured NOT to send Time exceeded (iptables DROP).' : ''}`,
    vi: `traceroute -n 203.0.113.10: laptop muốn biết danh sách router trên đường tới máy chủ LabFlow. Mẹo: gửi gói thăm dò với TTL = 1, 2, 3… (TTL = “thời gian sống”, bộ đếm mà router nào cũng trừ 1). Router nào trừ nó về 0 thì vứt gói và gửi lại ICMP “Time exceeded” (hết thời gian) — thế là lộ địa chỉ của nó.${silent ? ' Lần này router dc được cấu hình KHÔNG gửi Time exceeded (iptables DROP).' : ''}` });
  for (let k = 1; k <= 4; k++) {
    const names = ['', 'homegw', 'isp', 'dc', 'server'];
    out.push({ ttl: k, phase: 'send', at: k, tshark: [2 * (k - 1)], hopsShown: k - 1, sfx: 'whoosh',
      en: k < 4 ? `Probe ${k}: TTL = ${k}. ${k === 1 ? 'homegw lowers it 1 → 0 at once' : `${k === 2 ? 'homegw lowers it to 1' : 'homegw and isp lower it to 1'}, then ${names[k]} lowers it to 0`} ⇒ ${names[k]} drops the packet.` : 'Probe 4: TTL = 4. homegw → 3, isp → 2, dc → 1 — still alive, so it reaches the server itself.',
      vi: k < 4 ? `Gói thăm dò ${k}: TTL = ${k}. ${k === 1 ? 'homegw trừ ngay 1 → 0' : `${k === 2 ? 'homegw trừ còn 1' : 'homegw và isp trừ còn 1'}, rồi ${names[k]} trừ về 0`} ⇒ ${names[k]} vứt gói.` : 'Gói thăm dò 4: TTL = 4. homegw → 3, isp → 2, dc → 1 — vẫn sống, nên tới được chính máy chủ.' });
    if (k === 3 && silent) {
      out.push({ ttl: k, phase: 'star', at: 3, tshark: [], hopsShown: 3, sfx: 'miss', tone: 'warn',
        en: 'dc drops the probe as usual — but its firewall drops the “Time exceeded” too. traceroute waits 1 s (-w 1) and prints “*” three times: “* * *”. The router is there and forwards traffic fine; it just does not answer this question.',
        vi: 'dc vứt gói thăm dò như thường — nhưng tường lửa của nó vứt luôn “Time exceeded”. traceroute chờ 1 s (-w 1) rồi in ba dấu “*”: “* * *”. Router vẫn ở đó và chuyển gói bình thường; nó chỉ không trả lời câu hỏi này.' });
      continue;
    }
    if (k < 4) {
      out.push({ ttl: k, phase: 'reply', at: k, tshark: [2 * (k - 1) + 1], hopsShown: k, replyTtl: replyTtl(k), sfx: 'pop',
        en: `${names[k]} answers from ${HOP_IP[k]}: “Time-to-live exceeded”. The answer starts with TTL 64 and ${k === 1 ? 'comes straight back' : `loses 1 at each of the ${k - 1} router${k > 2 ? 's' : ''} on the way back`} ⇒ it arrives with TTL ${replyTtl(k)} (real tshark). traceroute prints hop ${k}.`,
        vi: `${names[k]} trả lời từ ${HOP_IP[k]}: “Time-to-live exceeded”. Câu trả lời bắt đầu với TTL 64 và ${k === 1 ? 'về thẳng' : `mất 1 ở mỗi router trong ${k - 1} router trên đường về`} ⇒ tới nơi với TTL ${replyTtl(k)} (tshark thật). traceroute in chặng ${k}.` });
    } else {
      out.push({ ttl: k, phase: 'port', at: 4, tshark: [7], hopsShown: 4, replyTtl: replyTtl(4), sfx: 'hit', tone: 'ok',
        en: `The server receives a UDP packet for port ${33437} — nobody listens there, so it answers “Destination unreachable (Port unreachable)”, TTL 61 on arrival. That different answer is how traceroute knows it has reached the destination and stops.`,
        vi: `Máy chủ nhận một gói UDP tới cổng ${33437} — không ai nghe ở đó, nên nó trả “Destination unreachable (Port unreachable)”, tới nơi với TTL 61. Câu trả lời KHÁC đó là cách traceroute biết đã tới đích và dừng lại.` });
    }
  }
  out.push({ ttl: 4, phase: 'done', at: 4, tshark: [], hopsShown: 4, sfx: 'right', tone: silent ? 'warn' : 'ok',
    en: silent ? 'Result: hop 3 is “* * *” but hop 4 — the destination — answers, and mtr shows 100% loss at hop 3 yet 0% at the end. Rule: loss that does NOT continue to the last hop is a router refusing to answer, not lost traffic. curl works.' : 'Result: four hops, one router per line. Reply TTLs 64 / 63 / 62 / 61 also tell you how far away each answer came from.',
    vi: silent ? 'Kết quả: chặng 3 là “* * *” nhưng chặng 4 — đích — vẫn trả lời, và mtr báo mất 100% ở chặng 3 mà 0% ở cuối. Quy tắc: mất gói KHÔNG kéo dài tới chặng cuối là router không chịu trả lời, không phải mất lưu lượng thật. curl vẫn chạy.' : 'Kết quả: bốn chặng, mỗi dòng một router. TTL của câu trả lời 64 / 63 / 62 / 61 cũng cho biết mỗi câu trả lời đến từ xa bao nhiêu.' });
  return out;
}

// ───────── kịch bản vòng lặp ─────────
export interface LoopStep { phase: 'intro' | 'first' | 'bounce' | 'expire' | 'trace' | 'fix' | 'ok'; ttl: number; at: number; en: string; vi: string; tone?: 'ok' | 'warn' | 'bad'; sfx?: TraceStep['sfx'] }
export function loopScript(fixed: boolean): LoopStep[] {
  const w = walk(SERVER, 64, true);
  const isp = w.hops.filter((h) => h.at === 'isp').length, dc = w.hops.filter((h) => h.at === 'dc').length;
  const out: LoopStep[] = [
    { phase: 'intro', ttl: 64, at: 3, sfx: 'tick', tone: 'warn',
      en: 'During maintenance someone added a test route on router dc and forgot it: “203.0.113.10/32 via 192.0.2.1” — send the server’s traffic to isp. dc still has its connected 203.0.113.0/24, but /32 is longer, so /32 wins.',
      vi: 'Lúc bảo trì, ai đó thêm tay một tuyến thử trên router dc rồi quên gỡ: “203.0.113.10/32 via 192.0.2.1” — gửi lưu lượng của máy chủ sang isp. dc vẫn có tuyến nối thẳng 203.0.113.0/24, nhưng /32 dài hơn nên /32 thắng.' },
    { phase: 'first', ttl: 61, at: 3, sfx: 'whoosh',
      en: 'ping 203.0.113.10 from the laptop (TTL 64). homegw → 63, isp → 62, dc → 61. dc looks up 203.0.113.10: the /32 wins ⇒ “via 192.0.2.1” — back to isp!',
      vi: 'ping 203.0.113.10 từ laptop (TTL 64). homegw → 63, isp → 62, dc → 61. dc tra 203.0.113.10: /32 thắng ⇒ “via 192.0.2.1” — quay về isp!' },
    { phase: 'bounce', ttl: 59, at: 3, sfx: 'pop', tone: 'bad',
      en: 'isp → 60 and its BGP route says “203.0.113.0/24 via 192.0.2.3” ⇒ back to dc. dc → 59 ⇒ /32 ⇒ isp… Each router is right by its own table; together they make a loop. Only TTL saves the network: −2 per round trip.',
      vi: 'isp → 60 và tuyến BGP của nó nói “203.0.113.0/24 via 192.0.2.3” ⇒ về dc. dc → 59 ⇒ /32 ⇒ isp… Router nào cũng đúng theo bảng của mình; gộp lại thành vòng lặp. Chỉ TTL cứu mạng: mỗi vòng đi-về −2.' },
    { phase: 'expire', ttl: 0, at: 2, sfx: 'thud', tone: 'bad',
      en: `isp receives the packet with TTL 1, lowers it to 0, drops it and sends “Time to live exceeded” from 198.51.100.1 (its card facing the laptop). One ping crossed the IX link ${isp + dc - 1} times (computed: isp saw it ${isp}×, dc ${dc}×).`,
      vi: `isp nhận gói với TTL 1, trừ về 0, vứt và gửi “Time to live exceeded” từ 198.51.100.1 (card phía laptop). Một gói ping đã chạy qua đường nối IX ${isp + dc - 1} lần (tính ra: isp thấy nó ${isp} lần, dc ${dc} lần).` },
    { phase: 'trace', ttl: 0, at: 2, sfx: 'tick', tone: 'warn',
      en: 'traceroute makes the loop visible: after hop 3 the SAME two addresses alternate — 198.51.100.1, 192.0.2.3, 198.51.100.1… A repeating pair in traceroute = routing loop.',
      vi: 'traceroute làm vòng lặp hiện ra: sau chặng 3, CÙNG hai địa chỉ thay nhau — 198.51.100.1, 192.0.2.3, 198.51.100.1… Một cặp lặp lại trong traceroute = vòng lặp định tuyến.' },
  ];
  if (fixed) {
    out.push({ phase: 'fix', ttl: 64, at: 3, sfx: 'on',
      en: 'Fix it where it is wrong — on dc: ip route del 203.0.113.10/32 via 192.0.2.1. Now ip route get 203.0.113.10 on dc says “dev dc0”: the connected /24 is used again.',
      vi: 'Sửa đúng chỗ sai — trên dc: ip route del 203.0.113.10/32 via 192.0.2.1. Giờ ip route get 203.0.113.10 trên dc nói “dev dc0”: tuyến nối thẳng /24 lại được dùng.' });
    out.push({ phase: 'ok', ttl: 61, at: 4, sfx: 'right', tone: 'ok',
      en: 'The packet arrives at the server with TTL 61 (64 − 3 routers), like the normal traceroute: 4 hops, no repeats.',
      vi: 'Gói tới máy chủ với TTL 61 (64 − 3 router), giống traceroute bình thường: 4 chặng, không lặp.' });
  }
  return out;
}
