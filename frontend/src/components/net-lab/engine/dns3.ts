/**
 * dns3 — engine thuần cho 5 mô phỏng Chương 3 (DNS) của khoá Networking for Developers (01/11/2026):
 *   dns     — đọc bản bắt gói của resolver (dnsgoi.sh), đếm câu hỏi ra Internet; thứ tự tên mà stub thử (search + ndots)
 *   zone    — tên tuyệt đối/tương đối, luật "CNAME không đứng chung", MX trỏ IP / thiếu dấu chấm; máy phụ chép khi serial tăng
 *   ttl     — TTL còn lại, độ trễ xấu nhất của một lần đổi bản ghi, TTL âm = min(TTL của SOA, minimum)
 *   anycast — đường BGP ngắn nhất, điểm anycast mỗi phía tới, view GeoDNS theo địa chỉ resolver
 *   dnssec  — secure / insecure / bogus
 * Số liệu thật nằm ở capture3.ts; mọi con số mô phỏng tự tính phải ghi nhãn "tính ra" trong giao diện.
 */

// ───────────────────────── dns: bản bắt gói của resolver ─────────────────────────
export type Role = 'laptop' | 'resolver' | 'root' | 'tld' | 'ns1' | 'ns2' | 'other';
export const ROLE_OF: Record<string, Role> = {
  '198.51.100.2': 'laptop', // laptop sau NAT của router nhà
  '198.51.100.1': 'resolver', '192.0.2.1': 'resolver',
  '192.0.2.10': 'root', '192.0.2.20': 'tld', '203.0.113.53': 'ns1', '203.0.113.54': 'ns2',
};
export const role = (ip: string): Role => ROLE_OF[ip] ?? 'other';

export interface Goi { t: number; from: string; to: string; msg: 'query' | 'answer'; name: string; type: string; result: string }
/** một dòng in bởi lab/code/ch03/dnsgoi.sh */
export function parseGoi(line: string): Goi | null {
  const m = line.match(/^\s*(\d+\.\d+)\s+(\S+)\s+→\s+(\S+)\s+(query|answer)\s+(\S+)\s+(\S+)\s*(.*)$/);
  if (!m) return null;
  return { t: Number(m[1]), from: m[2], to: m[3], msg: m[4] as Goi['msg'], name: m[5], type: m[6], result: m[7].trim() };
}
/** số câu hỏi resolver gửi ra Internet (không tính câu hỏi của laptop) */
export const upstreamQueries = (g: Goi[]) => g.filter((x) => x.msg === 'query' && role(x.from) === 'resolver').length;
export const isReferral = (g: Goi) => g.msg === 'answer' && /referral/.test(g.result);
export const isAuthoritative = (g: Goi) => g.msg === 'answer' && /\baa\b/.test(g.result);

/**
 * Thứ tự tên stub (glibc) thử với `search` và `options ndots:N` — đúng quy tắc của resolv.conf(5):
 * tên có dấu chấm cuối ⇒ chỉ chính nó; ít hơn N dấu chấm ⇒ ghép từng tên miền search TRƯỚC rồi mới tới chính nó; còn lại ⇒ chính nó trước.
 */
export function searchOrder(name: string, search: string[], ndots: number): string[] {
  if (name.endsWith('.')) return [name.slice(0, -1)];
  const dots = (name.match(/\./g) ?? []).length;
  const withSearch = search.map((s) => `${name}.${s}`);
  return dots < ndots ? [...withSearch, name] : [name, ...withSearch];
}
/** stub dừng ở tên đầu tiên có trong tập tên tồn tại; trả về các tên đã thử (tên cuối là tên trúng) */
export function stubTries(name: string, search: string[], ndots: number, exists: (n: string) => boolean): string[] {
  const out: string[] = [];
  for (const c of searchOrder(name, search, ndots)) { out.push(c); if (exists(c)) break; }
  return out;
}

// ───────────────────────── zone ─────────────────────────
export interface Rec { name: string; type: string; data: string }
/** tên trong tệp vùng: "@" = vùng; có dấu chấm cuối = tuyệt đối; còn lại = tương đối (ghép tên vùng) */
export function fqdn(name: string, origin: string): string {
  const o = origin.endsWith('.') ? origin : `${origin}.`;
  if (name === '@') return o;
  return name.endsWith('.') ? name : `${name}.${o}`;
}
export interface ZoneCheck { errors: string[]; warnings: string[] }
/** kiểm như named-checkzone ở mức bài 3.2: CNAME đứng chung; MX là một địa chỉ; MX trỏ tới tên không có A/AAAA */
export function checkZone(recs: Rec[], origin: string): ZoneCheck {
  const errors: string[] = [], warnings: string[] = [];
  const by = new Map<string, Rec[]>();
  for (const r of recs) { const n = fqdn(r.name, origin); by.set(n, [...(by.get(n) ?? []), r]); }
  for (const [n, rs] of by) if (rs.some((r) => r.type === 'CNAME') && rs.length > 1) errors.push(`${n}: CNAME and other data`);
  const hasAddr = (n: string) => (by.get(n) ?? []).some((r) => r.type === 'A' || r.type === 'AAAA');
  for (const r of recs.filter((x) => x.type === 'MX')) {
    const target = r.data.trim().split(/\s+/).pop()!;
    if (/^\d+\.\d+\.\d+\.\d+\.?$/.test(target)) warnings.push(`'${target.endsWith('.') ? target : target + '.'}': MX is an address`);
    else if (!hasAddr(fqdn(target, origin))) warnings.push(`MX '${fqdn(target, origin).replace(/\.$/, '')}' has no address records (A or AAAA)`);
  }
  return { errors, warnings };
}
/** máy phụ chép vùng khi (và chỉ khi) serial của máy chính LỚN HƠN serial nó đang giữ */
export const secondaryTransfers = (primarySerial: number, secondarySerial: number) => primarySerial > secondarySerial;

// ───────────────────────── ttl ─────────────────────────
export const remainingTtl = (ttl: number, fetchedAt: number, now: number) => Math.max(0, ttl - Math.max(0, now - fetchedAt));
/** TTL âm (RFC 2308) = min(TTL của bản ghi SOA, trường cuối của SOA) */
export const negativeTtl = (soaTtl: number, minimum: number) => Math.min(soaTtl, minimum);
/**
 * Một cache lấy bản ghi lúc `cachedAt` với TTL cũ: nó còn trả địa chỉ cũ bao lâu SAU lúc đổi IP `changeAt`?
 * (Bản ghi sau khi hết hạn được lấy lại — từ lúc đó là địa chỉ mới.)
 */
export const staleAfterChange = (cachedAt: number, oldTtl: number, changeAt: number) => Math.max(0, cachedAt + oldTtl - changeAt);
/**
 * Độ trễ xấu nhất của một lần đổi: một cache nào đó vừa lấy bản ghi ngay TRƯỚC lúc hạ TTL (lowerAt) với TTL cũ, và mọi cache
 * lấy sau lúc hạ TTL chỉ giữ newTtl. ⇒ max(newTtl, lowerAt + oldTtl − changeAt).
 */
export const worstCaseDelay = (oldTtl: number, lowerAt: number, changeAt: number, newTtl: number) => Math.max(newTtl, lowerAt + oldTtl - changeAt);

// ───────────────────────── anycast / GeoDNS ─────────────────────────
export interface Path { via: string; asPath: number[] }
/** BGP ở mức bài này: đường có AS path ngắn nhất thắng (bằng nhau ⇒ đường đến trước) */
export const bestPath = (paths: Path[]): Path | undefined => paths.reduce<Path | undefined>((b, p) => (!b || p.asPath.length < b.asPath.length ? p : b), undefined);
export type Pop = 'pop1' | 'pop2';
/** máy ở nhà đi qua isp, máy trong DC đi qua router dc — mỗi router chọn đường ngắn nhất trong các điểm còn quảng bá */
export function anycastSite(client: 'home' | 'dc', up: Record<Pop, boolean>): Pop | null {
  const paths: Path[] = client === 'home'
    ? [...(up.pop1 ? [{ via: 'pop1', asPath: [64530] }] : []), ...(up.pop2 ? [{ via: 'pop2', asPath: [64510, 64530] }] : [])]
    : [...(up.pop2 ? [{ via: 'pop2', asPath: [64530] }] : []), ...(up.pop1 ? [{ via: 'pop1', asPath: [64500, 64530] }] : [])];
  return (bestPath(paths)?.via as Pop | undefined) ?? null;
}
/** địa chỉ nguồn mà máy chủ tên của CDN thấy, theo resolver hỏi (lab: lab/moi-truong/dns/named-cdn.conf) */
export const RESOLVER_SOURCE: Record<'isp' | 'pop1' | 'pop2', string> = { isp: '192.0.2.1', pop1: '192.0.2.30', pop2: '198.19.255.2' };
const VN_ACL = ['192.0.2.1', '192.0.2.30'];
const VN_NETS = ['198.51.100.', '100.64.0.'];
export const geoView = (src: string): 'vn' | 'sg' => (VN_ACL.includes(src) || VN_NETS.some((n) => src.startsWith(n)) ? 'vn' : 'sg');
export const EDGE: Record<'vn' | 'sg', string> = { vn: '203.0.113.10', sg: '203.0.113.11' };

// ───────────────────────── dnssec ─────────────────────────
export type SecStatus = 'secure' | 'insecure' | 'bogus';
/** hasDs = vùng cha có DS · dsMatches = DS khớp khoá đang công bố · sigValid = chữ ký còn hạn và kiểm qua */
export function validate(z: { hasDs: boolean; dsMatches: boolean; sigValid: boolean }): SecStatus {
  if (!z.hasDs) return 'insecure';
  return z.dsMatches && z.sigValid ? 'secure' : 'bogus';
}
/** resolver kiểm DNSSEC trả gì: bogus ⇒ SERVFAIL, trừ khi client đặt +cd (checking disabled) */
export const resolverStatus = (s: SecStatus, cd: boolean): 'NOERROR' | 'SERVFAIL' => (s === 'bogus' && !cd ? 'SERVFAIL' : 'NOERROR');
