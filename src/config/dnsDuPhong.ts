/**
 * DNS dự phòng theo tên miền (22/10/2026).
 *
 * Sự cố: `rambo.ai.vn` trả SERVFAIL ở cả 8.8.8.8 lẫn 1.1.1.1 ⇒ trong container backend `fetch` báo `fetch failed`
 * (getaddrinfo ENOTFOUND) ở MỌI lượt CuongMini đi rambo, trong khi gọi thẳng vào IP Cloudflare của nó vẫn 200.
 * Trình duyệt của chủ app vẫn vào được nhờ DNS cache ⇒ trông như "rambo chạy mà web không dùng được".
 *
 * Cách làm: bọc `dns.lookup` (thứ `fetch`/undici và `net.connect` dùng) — CHỈ với tên miền khai trong env
 * `DNS_DU_PHONG` và CHỈ khi tra cứu thường HỎNG thì trả IP khai sẵn. Tra cứu thường thành công ⇒ không đổi gì,
 * nên khi nhà cung cấp sửa DNS, IP khai sẵn tự thôi được dùng. Tên miền khác không bị đụng tới.
 *
 *   DNS_DU_PHONG="rambo.ai.vn=172.67.171.45,104.21.39.183;example.com=1.2.3.4"
 *
 * Không khai env ⇒ mặc định chỉ có rambo.ai.vn (IP Cloudflare đo 22/10/2026). `DNS_DU_PHONG=off` ⇒ tắt hẳn.
 * ⚠️ IP Cloudflare có thể đổi — đây là lưới đỡ khi DNS của họ hỏng, không thay cho DNS đúng.
 */
import dns from 'node:dns';
import { logger } from '../utils/logger.js';

const MAC_DINH = 'rambo.ai.vn=172.67.171.45,104.21.39.183';
/** Lỗi tra cứu đáng dùng IP dự phòng (không tìm thấy / máy chủ DNS hỏng / tạm thời). */
const LOI_DNS = new Set(['ENOTFOUND', 'EAI_AGAIN', 'ESERVFAIL', 'ENODATA', 'ETIMEOUT', 'ECONNREFUSED']);

/** Đọc `DNS_DU_PHONG` thành bảng tên miền (chữ thường) ⇒ danh sách IPv4/IPv6. */
export function docBangDuPhong(raw: string | undefined): Map<string, string[]> {
  const bang = new Map<string, string[]>();
  const s = (raw ?? MAC_DINH).trim();
  if (!s || s.toLowerCase() === 'off') return bang;
  for (const muc of s.split(';')) {
    const [ten, ips] = muc.split('=');
    const host = ten?.trim().toLowerCase();
    const ds = (ips ?? '').split(',').map((x) => x.trim()).filter((x) => /^[0-9a-f.:]+$/i.test(x));
    if (host && ds.length) bang.set(host, ds);
  }
  return bang;
}

let daCai = false;

/** Cài bọc `dns.lookup` một lần (gọi sớm lúc khởi động). Trả bảng đang dùng (để log/test). */
export function caiDnsDuPhong(raw: string | undefined = process.env.DNS_DU_PHONG): Map<string, string[]> {
  const bang = docBangDuPhong(raw);
  if (daCai || bang.size === 0) return bang;
  daCai = true;
  const goc = dns.lookup;
  const daBaoLoi = new Set<string>();
  const boc = function lookup(host: string, opts: unknown, cb?: unknown) {
    if (typeof opts === 'function') { cb = opts; opts = {}; }
    const o = (typeof opts === 'number' ? { family: opts } : (opts ?? {})) as dns.LookupOptions;
    const goiLai = cb as (err: NodeJS.ErrnoException | null, address?: string | dns.LookupAddress[], family?: number) => void;
    (goc as (h: string, o: dns.LookupOptions, c: typeof goiLai) => void).call(dns, host, o, (err, address, family) => {
      const du = err && LOI_DNS.has(err.code ?? '') ? bang.get(String(host).toLowerCase()) : undefined;
      if (!du) { goiLai(err, address, family); return; }
      if (!daBaoLoi.has(host)) {
        daBaoLoi.add(host);
        logger.warn('[dns] tra cứu hỏng ⇒ dùng IP dự phòng', { host, code: err?.code, ips: du });
      }
      const ds = du
        .map((a) => ({ address: a, family: a.includes(':') ? 6 : 4 }))
        .filter((a) => !o.family || o.family === a.family);
      if (!ds.length) { goiLai(err, address, family); return; }
      if (o.all) goiLai(null, ds);
      else goiLai(null, ds[0].address, ds[0].family);
    });
  };
  (dns as unknown as { lookup: typeof boc }).lookup = boc;
  logger.info('[dns] DNS dự phòng đã bật', { hosts: [...bang.keys()] });
  return bang;
}
