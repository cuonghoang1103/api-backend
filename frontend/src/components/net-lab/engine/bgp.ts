/**
 * bgp — engine thuần cho mô phỏng `bgp` (Chương 2.5): ba AS trên một điểm trao đổi (IX 192.0.2.0/24), phiên eBGP
 * isp↔dc và isp↔rogue (đúng như frr-*.conf của lab). Mỗi AS quảng bá dải của mình; tuyến lan đi kèm AS PATH (mỗi AS
 * chuyển tiếp thì THÊM số AS của mình vào ĐẦU). AS gốc (origin) = số CUỐI của path. Chọn đường: path ngắn nhất;
 * dải của chính mình luôn thắng; path đã chứa số AS của mình ⇒ bỏ (chống vòng lặp).
 *   • announce — bảng `show ip bgp` của isp và dc được điền dần (test: khớp từng dòng capture c25-isp / c25-dc).
 *   • hijack   — rogue quảng bá 203.0.113.0/25 (CỤ THỂ hơn /24 của LabFlow) ⇒ isp cài nó (tiền tố dài nhất thắng) ⇒
 *                lưu lượng tới 203.0.113.10 rơi vào hố đen; sửa: prefix-list trên isp chỉ nhận 198.18.0.0/24 từ AS64511.
 *                RPKI (ROA) là cách sửa ở quy mô Internet — số liệu THẬT của RIPEstat cho cuongthai.com.
 *   • withdraw — dc rút 203.0.113.0/24 (kiểu Facebook 04/10/2021) ⇒ isp quên tuyến ⇒ cả máy chủ tên ns 203.0.113.53.
 */
import { BGP_SHOW } from './capture2';
import { lpm } from './route';
import { ipToInt, maskOf } from './subnet';

export type AsId = 'isp' | 'dc' | 'rogue';
export const AS: Record<AsId, { asn: number; ix: string; own: string[]; name: string }> = {
  isp: { asn: 64500, ix: '192.0.2.1', own: ['198.51.100.0/24'], name: 'isp' },
  dc: { asn: 64510, ix: '192.0.2.3', own: ['203.0.113.0/24'], name: 'dc (LabFlow)' },
  rogue: { asn: 64511, ix: '192.0.2.66', own: ['198.18.0.0/24'], name: 'rogue' },
};
export const SESSIONS: Array<[AsId, AsId]> = [['isp', 'dc'], ['isp', 'rogue']];
const byAsn = (n: number) => (Object.keys(AS) as AsId[]).find((k) => AS[k].asn === n)!;

export interface Ann { as: AsId; prefix: string }
export interface BgpRow { network: string; nextHop: string; metric: string; weight: number; path: number[]; origin: number; own: boolean }
export interface BgpState { anns: Ann[]; filter: boolean }

/** chỉ isp có bộ lọc: từ rogue chỉ nhận 198.18.0.0/24 */
const accepts = (to: AsId, from: AsId, prefix: string, s: BgpState) => !(s.filter && to === 'isp' && from === 'rogue' && prefix !== '198.18.0.0/24');

/** Bảng BGP (best path) của mọi AS sau khi hội tụ. */
export function converge(s: BgpState): Record<AsId, BgpRow[]> {
  // path đầy đủ (gồm cả AS gốc ở cuối) mà mỗi AS chọn cho mỗi dải
  const best: Record<AsId, Map<string, number[]>> = { isp: new Map(), dc: new Map(), rogue: new Map() };
  for (const a of s.anns) best[a.as].set(a.prefix, []);
  for (let round = 0; round < 6; round++) {
    let changed = false;
    for (const [x, y] of SESSIONS) {
      for (const [from, to] of [[x, y], [y, x]] as Array<[AsId, AsId]>) {
        for (const [pfx, path] of best[from]) {
          const adv = [AS[from].asn, ...path];
          if (adv.includes(AS[to].asn) || !accepts(to, from, pfx, s)) continue;
          const cur = best[to].get(pfx);
          if (cur === undefined || (cur.length > 0 && adv.length < cur.length)) { best[to].set(pfx, adv); changed = true; }
        }
      }
    }
    if (!changed) break;
  }
  const out = {} as Record<AsId, BgpRow[]>;
  for (const k of Object.keys(best) as AsId[]) {
    out[k] = [...best[k].entries()].map(([network, path]) => {
      const own = path.length === 0;
      const origin = own ? AS[k].asn : path[path.length - 1];
      return {
        network, path, origin, own,
        // cả ba ở chung một mạng IX ⇒ next hop giữ nguyên là địa chỉ IX của AS GỐC (FRR "third-party next hop")
        nextHop: own ? '0.0.0.0' : AS[byAsn(origin)].ix,
        // MED (cột Metric) chỉ đi một chặng: thấy 0 khi học thẳng từ AS gốc, trống khi qua trung gian
        metric: own || path.length === 1 ? '0' : '',
        weight: own ? 32768 : 0,
      };
    }).sort((a, b) => cmpPfx(a.network, b.network));
  }
  return out;
}
const cmpPfx = (a: string, b: string) => { const [x, lx] = a.split('/'), [y, ly] = b.split('/'); return ipToInt(x) - ipToInt(y) || Number(lx) - Number(ly); };
export const pathText = (r: BgpRow) => (r.path.length ? `${r.path.join(' ')} i` : 'i');

/** đọc một dòng `show ip bgp` thật */
export function parseShow(line: string) {
  const w = line.trim().split(/\s+/);
  const i = w.findIndex((x) => x.includes('/'));
  const network = w[i], nextHop = w[i + 1];
  const tail = w.slice(i + 2);
  const iEnd = tail.lastIndexOf('i');
  // từ cuối: "i", path…, weight
  let j = iEnd - 1;
  const path: number[] = [];
  while (j >= 0 && /^\d+$/.test(tail[j]) && Number(tail[j]) >= 64000 && Number(tail[j]) !== 32768) { path.unshift(Number(tail[j])); j--; }
  return { network, nextHop, path, weight: Number(tail[j]), status: w[0] };
}

/** bảng định tuyến nhân (FIB) của một AS lấy từ best path BGP + tuyến nối thẳng; rogue: /25 là blackhole */
export interface Fib { net: number; len: number; text: string; via?: string; blackhole?: boolean }
export function fib(rows: BgpRow[], as: AsId): Fib[] {
  return rows.map((r) => {
    const [a, l] = r.network.split('/');
    const len = Number(l);
    const net = (ipToInt(a) & maskOf(len)) >>> 0;
    if (r.own) return { net, len, text: `${r.network} (${as === 'rogue' && len === 25 ? 'blackhole' : 'own'})`, blackhole: as === 'rogue' && len === 25 };
    return { net, len, via: r.nextHop, text: `${r.network} via ${r.nextHop} dev ix0 proto bgp metric 20` };
  });
}
export function nextHopFor(rows: BgpRow[], as: AsId, dst: string): string | null {
  const w = lpm(fib(rows, as), ipToInt(dst));
  return w ? (w.via ?? 'local') : null;
}

export const BASE: Ann[] = [{ as: 'isp', prefix: '198.51.100.0/24' }, { as: 'dc', prefix: '203.0.113.0/24' }, { as: 'rogue', prefix: '198.18.0.0/24' }];
export const HIJACK: Ann = { as: 'rogue', prefix: '203.0.113.0/25' };

/** so một bảng do engine tính với ảnh chụp thật (Network, Next Hop, Path, Weight) */
export function sameAsCapture(rows: BgpRow[], cap: readonly string[]): boolean {
  if (rows.length !== cap.length) return false;
  return cap.every((l, k) => {
    const p = parseShow(l), r = rows[k];
    return p.network === r.network && p.nextHop === r.nextHop && p.weight === r.weight && p.path.join(' ') === r.path.join(' ');
  });
}
export const CAPS = BGP_SHOW;

// ───────── RPKI ─────────
export interface Roa { origin: number; prefix: string; maxLength: number }
/** ROA thật của cuongthai.com (RIPEstat, c25-that) */
export const ROA_CT: Roa = { origin: 152992, prefix: '160.187.0.0/23', maxLength: 24 };
export type Rpki = 'valid' | 'invalid_asn' | 'invalid_length' | 'unknown';
/** RFC 6811: không ROA nào bao ⇒ unknown; có ROA khớp AS và độ dài ≤ max ⇒ valid; khớp AS nhưng quá dài ⇒ invalid_length; còn lại invalid_asn */
export function rpki(roas: Roa[], origin: number, prefix: string): Rpki {
  const [a, l] = prefix.split('/');
  const len = Number(l), n = ipToInt(a);
  const cover = roas.filter((r) => { const [ra, rl] = r.prefix.split('/'); return Number(rl) <= len && ((n & maskOf(Number(rl))) >>> 0) === ((ipToInt(ra) & maskOf(Number(rl))) >>> 0); });
  if (!cover.length) return 'unknown';
  if (cover.some((r) => r.origin === origin && len <= r.maxLength)) return 'valid';
  if (cover.some((r) => r.origin === origin)) return 'invalid_length';
  return 'invalid_asn';
}
