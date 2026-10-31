/**
 * subnet — engine thuần cho mô phỏng `subnet` (Chương 2.1):
 *   • mask — tính một mạng IPv4 đúng như lab/code/ch02/cidr.py: nhị phân, AND với mặt nạ, bật bit host = broadcast,
 *            /31 = 2 địa chỉ, /32 = 1, không broadcast. cidrLines() in ra ĐÚNG từng ký tự như cidr.py (test so với
 *            c21-dia-chi.out.txt).
 *   • same — "đích có nằm trong mạng của tôi không?": AND địa chỉ đích với mặt nạ của CHÍNH MÌNH, so với mạng của mình
 *            ⇒ cùng mạng: ARP hỏi thẳng đích; khác mạng: gửi cho cổng mặc định. Lỗi thật: client2 gõ /16 thay /24.
 *   • vlsm — chia 10.20.0.0/22 như chia.py: lớn trước / theo thứ tự gõ (lỗ hổng 336 địa chỉ). vlsmLines() = chia.py.
 */
export const ipToInt = (s: string): number => {
  const p = s.trim().split('.');
  if (p.length !== 4) return NaN;
  let n = 0;
  for (const o of p) {
    if (!/^\d{1,3}$/.test(o)) return NaN;
    const v = Number(o);
    if (v > 255) return NaN;
    n = n * 256 + v;
  }
  return n >>> 0;
};
export const intToIp = (n: number) => [24, 16, 8, 0].map((s) => (n >>> s) & 255).join('.');
export const isIp = (s: string) => !Number.isNaN(ipToInt(s));
/** 32 bit, chấm sau mỗi 8 bit (như bits() của cidr.py) */
export const bits = (n: number) => { const s = (n >>> 0).toString(2).padStart(32, '0'); return [0, 8, 16, 24].map((i) => s.slice(i, i + 8)).join('.'); };
export const maskOf = (p: number) => (p === 0 ? 0 : (0xffffffff << (32 - p)) >>> 0);

export interface Cidr {
  addr: string; prefix: number;
  ip: number; mask: number; net: number; bcast: number | null;
  first: number; last: number; usable: number; size: number;
}
export function cidr(addr: string, prefix: number): Cidr {
  const ip = ipToInt(addr);
  const mask = maskOf(prefix);
  const net = (ip & mask) >>> 0;
  const top = (net | (~mask >>> 0)) >>> 0;
  const size = 2 ** (32 - prefix);
  if (prefix <= 30) return { addr, prefix, ip, mask, net, bcast: top, first: net + 1, last: top - 1, usable: size - 2, size };
  return { addr, prefix, ip, mask, net, bcast: null, first: net, last: top, usable: size, size };
}
const pad = (s: string | number, n: number) => String(s).padEnd(n);
/** năm dòng đầu của cidr.py (không có dòng "check") */
export function cidrLines(addr: string, prefix: number): string[] {
  const c = cidr(addr, prefix);
  return [
    `address    ${pad(addr, 15)}  ${bits(c.ip)}`,
    `mask /${pad(prefix, 2)}   ${pad(intToIp(c.mask), 15)}  ${bits(c.mask)}`,
    `network    ${pad(intToIp(c.net), 15)}  ${bits(c.net)}   (address AND mask)`,
    c.bcast !== null ? `broadcast  ${pad(intToIp(c.bcast), 15)}  ${bits(c.bcast)}   (host bits all 1)` : `broadcast  none             (/${prefix}: too few host bits to spare one for broadcast)`,
    `hosts      ${intToIp(c.first)} - ${intToIp(c.last)}   usable ${c.usable} of ${c.size} addresses`,
  ];
}

// ───────── same: đích có cùng mạng không? ─────────
export interface OnLink { mine: number; theirs: number; onLink: boolean }
export function onLink(self: string, prefix: number, dst: string): OnLink {
  const m = maskOf(prefix);
  const mine = (ipToInt(self) & m) >>> 0, theirs = (ipToInt(dst) & m) >>> 0;
  return { mine, theirs, onLink: mine === theirs };
}

// ───────── vlsm ─────────
export interface Need { name: string; hosts: number }
export interface Alloc { name: string; hosts: number; prefix: number; size: number; start: number }
export interface Gap { start: number; end: number; n: number; before: string }
export interface Plan { block: string; blockStart: number; blockSize: number; sorted: boolean; rows: Alloc[]; gaps: Gap[]; fail?: { name: string; prefix: number; size: number }; used: number; next: number }
export const DEFAULT_NEEDS: Need[] = [{ name: 'iot', hosts: 300 }, { name: 'web', hosts: 100 }, { name: 'db', hosts: 20 }, { name: 'mgmt', hosts: 10 }];
/** thứ tự gõ của lần chạy --as-given thật */
export const GIVEN_ORDER = ['web', 'db', 'mgmt', 'iot'];

/** prefix nhỏ nhất đủ chỗ cho `hosts` máy + địa chỉ mạng + broadcast (chia.py: 32 - ceil(log2(hosts + 2))) */
export const prefixFor = (hosts: number) => 32 - Math.ceil(Math.log2(Math.max(1, hosts) + 2));

export function vlsm(block: string, needs: Need[], sorted: boolean): Plan {
  const [a, l] = block.split('/');
  const bl = Number(l);
  const blockStart = (ipToInt(a) & maskOf(bl)) >>> 0;
  const blockSize = 2 ** (32 - bl);
  const end = blockStart + blockSize;
  const list = sorted ? [...needs].sort((x, y) => y.hosts - x.hosts) : [...needs];
  let nxt = blockStart;
  const rows: Alloc[] = [], gaps: Gap[] = [];
  for (const nd of list) {
    const prefix = prefixFor(nd.hosts);
    const size = 2 ** (32 - prefix);
    const start = Math.ceil(nxt / size) * size;
    if (start + size > end) return { block, blockStart, blockSize, sorted, rows, gaps, fail: { name: nd.name, prefix, size }, used: rows.reduce((t, r) => t + r.size, 0), next: nxt };
    if (start > nxt) gaps.push({ start: nxt, end: start - 1, n: start - nxt, before: nd.name });
    rows.push({ name: nd.name, hosts: nd.hosts, prefix, size, start });
    nxt = start + size;
  }
  return { block, blockStart, blockSize, sorted, rows, gaps, used: rows.reduce((t, r) => t + r.size, 0), next: nxt };
}
export const gapTotal = (p: Plan) => p.gaps.reduce((t, g) => t + g.n, 0);

/** bảng in ra như chia.py (để so với lần chạy thật) */
export function vlsmLines(p: Plan): string[] {
  const out = [`block ${p.block} = ${p.blockSize} addresses; ${p.sorted ? 'needs sorted largest first' : 'needs in the order given'}`];
  if (p.fail) {
    out.push(`✗ ${p.fail.name} needs /${p.fail.prefix} (${p.fail.size} addresses) — no aligned /${p.fail.prefix} left in ${p.block}: the plan does not fit`);
    return out;
  }
  out.push(`${pad('name', 6)}${'hosts'.padStart(6)}  ${pad('subnet', 17)}${pad('first host', 13)}${pad('last host', 13)}${pad('broadcast', 13)}${'usable'.padStart(6)}`);
  for (const r of p.rows) {
    out.push(`${pad(r.name, 6)}${String(r.hosts).padStart(6)}  ${pad(`${intToIp(r.start)}/${r.prefix}`, 17)}${pad(intToIp(r.start + 1), 13)}${pad(intToIp(r.start + r.size - 2), 13)}${pad(intToIp(r.start + r.size - 1), 13)}${String(r.size - 2).padStart(6)}`);
  }
  for (const g of p.gaps) out.push(`gap    ${intToIp(g.start)} - ${intToIp(g.end)}  (${g.n} addresses skipped to keep the next subnet aligned)`);
  const end = p.blockStart + p.blockSize;
  out.push(`check: all inside ${p.block}: True · any overlap: False · used ${p.used} of ${p.blockSize}` + (p.next < end ? `, next free ${intToIp(p.next)}` : ', block full'));
  return out;
}
