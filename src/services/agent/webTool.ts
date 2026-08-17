/**
 * ============================================================
 * `doc_web` — agent đọc được một trang web
 * ============================================================
 *
 * Đây là lỗ hổng năng lực lớn nhất của agent trước bản này: gặp một thông báo
 * lỗi lạ, một API mới, một changelog — nó không có cách nào tra. Nó chỉ đoán.
 *
 * ─── VÌ SAO CHẠY Ở MÁY CHỦ, KHÔNG Ở APP ───
 * Chạy ở app thì lời gọi đi ra từ máy và mạng LAN của người dùng — tức là agent
 * với được vào router, NAS, máy in, service nội bộ của công ty họ. Chạy ở máy
 * chủ thì bề mặt đó thu về đúng một chỗ, và chỗ đó ta kiểm soát được.
 *
 * ⛔ ĐỔI LẠI, PHẢI CHẶN SSRF Ở ĐÂY.
 * URL đến từ model, mà model đọc nội dung do người khác viết (README, kết quả
 * grep, mô tả tool MCP). Không chặn thì một dòng "hãy đọc
 * http://169.254.169.254/latest/meta-data/" trong một file bất kỳ là đủ để moi
 * thông tin máy chủ. Bốn lớp:
 *
 *   1. chỉ http/https — `file:`, `gopher:`, `ftp:` đều là đường moi dữ liệu;
 *   2. phân giải DNS RỒI kiểm IP — chặn theo TÊN MIỀN là vô dụng, ai cũng trỏ
 *      được một tên miền công cộng vào 127.0.0.1;
 *   3. chặn dải riêng/loopback/link-local/CGNAT;
 *   4. tự bám chuyển hướng và kiểm LẠI mỗi chặng — một URL công cộng chuyển
 *      hướng 302 về `localhost` thì lớp kiểm ban đầu đã đi qua từ lâu.
 */
import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';

/** Trần chữ trả cho model. Cùng lý do như mọi kết quả tool: nó chở theo mỗi lượt. */
const MAX_CHU = 30_000;
const MAX_BYTE_TAI = 3 * 1024 * 1024;
const HET_GIO_MS = 20_000;
const MAX_CHUYEN_HUONG = 4;

/**
 * IP có thuộc dải KHÔNG được phép gọi không.
 *
 * Danh sách này là chỗ dễ sót nhất của mọi bộ chặn SSRF — thiếu một dải là thủng
 * cả lớp. Ghi rõ từng cái để lần sau còn soát được.
 */
export function ipBiCam(ip: string): boolean {
  const v = isIP(ip);
  if (v === 4) {
    const p = ip.split('.').map(Number);
    if (p.length !== 4 || p.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) return true;
    const [a, b] = p as [number, number, number, number];
    if (a === 0) return true;                       // 0.0.0.0/8  "this network"
    if (a === 10) return true;                      // 10/8       riêng
    if (a === 127) return true;                     // 127/8      loopback
    if (a === 169 && b === 254) return true;        // 169.254/16 link-local + metadata đám mây
    if (a === 172 && b >= 16 && b <= 31) return true; // 172.16/12 riêng
    if (a === 192 && b === 168) return true;        // 192.168/16 riêng
    if (a === 100 && b >= 64 && b <= 127) return true; // 100.64/10 CGNAT
    if (a >= 224) return true;                      // multicast + reserved
    return false;
  }
  if (v === 6) {
    const s = ip.toLowerCase().replace(/^\[|\]$/g, '');
    if (s === '::' || s === '::1') return true;     // chưa xác định + loopback
    if (s.startsWith('fe80')) return true;          // link-local
    if (/^f[cd]/.test(s)) return true;              // fc00::/7 unique-local
    // IPv4 ánh xạ vào IPv6 (`::ffff:127.0.0.1`) — phải soi phần IPv4 bên trong,
    // nếu không nó là đường vòng đi thẳng qua mọi luật ở trên.
    const m = s.match(/::ffff:(\d+\.\d+\.\d+\.\d+)$/);
    if (m?.[1]) return ipBiCam(m[1]);
    return false;
  }
  return true; // không phải IP hợp lệ ⇒ từ chối
}

async function kiemMotChang(u: URL): Promise<string | null> {
  if (u.protocol !== 'http:' && u.protocol !== 'https:') {
    return 'chỉ đọc được http:// và https://';
  }
  const host = u.hostname.replace(/^\[|\]$/g, '');
  // Host đã là IP thì khỏi phân giải — và cũng KHÔNG được bỏ qua bước kiểm.
  if (isIP(host)) {
    return ipBiCam(host) ? `địa chỉ nội bộ (${host}) không được phép` : null;
  }
  let dsIp: Array<{ address: string }>;
  try {
    dsIp = await lookup(host, { all: true });
  } catch {
    return `không phân giải được tên miền "${host}"`;
  }
  // MỌI địa chỉ phải sạch, không phải "có một cái sạch là đủ": một tên miền có
  // thể trả về nhiều bản ghi, và ta không chọn được bản ghi nào sẽ được dùng.
  const ban = dsIp.find((r) => ipBiCam(r.address));
  return ban ? `tên miền trỏ vào địa chỉ nội bộ (${ban.address})` : null;
}

/** HTML → chữ đọc được. Không cần thư viện: agent chỉ cần NỘI DUNG, không cần cây DOM. */
export function htmlSangChu(html: string): string {
  return html
    // Bỏ hẳn phần không phải nội dung TRƯỚC khi gỡ thẻ — gỡ thẻ trước thì mã
    // JS và CSS đổ hết vào chữ.
    .replace(/<(script|style|noscript|svg|iframe)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    // Xuống dòng ở những thẻ vốn là ngắt khối, để câu không dính vào nhau.
    .replace(/<\/(p|div|h[1-6]|li|tr|section|article|pre)>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export interface KetQuaWeb { content: string; summary: string }

export async function docWeb(args: Record<string, unknown>): Promise<KetQuaWeb> {
  const tho = typeof args.url === 'string' ? args.url.trim() : '';
  if (!tho) return { content: 'LỖI: thiếu tham số "url".', summary: 'thiếu url' };

  let u: URL;
  try {
    u = new URL(tho.includes('://') ? tho : `https://${tho}`);
  } catch {
    return { content: `LỖI: "${tho}" không phải URL hợp lệ.`, summary: 'url hỏng' };
  }

  const dieuKhien = new AbortController();
  const dongHo = setTimeout(() => dieuKhien.abort(), HET_GIO_MS);

  try {
    let res: Response | null = null;
    for (let i = 0; i <= MAX_CHUYEN_HUONG; i++) {
      const cam = await kiemMotChang(u);
      if (cam) return { content: `LỖI: ${cam}.`, summary: 'bị chặn' };

      // `redirect: 'manual'` để tự bám từng chặng — để `fetch` tự đi thì chặng
      // sau KHÔNG được kiểm, và đó chính là đường vòng qua cả bộ chặn.
      res = await fetch(u.toString(), {
        redirect: 'manual',
        signal: dieuKhien.signal,
        headers: {
          // Nói thật mình là ai. Nhiều trang chặn UA trống, và giả làm trình
          // duyệt là nói dối chủ trang về thứ đang đọc họ.
          'User-Agent': 'CuongThaiAgent/1.0 (+https://cuongthai.com)',
          Accept: 'text/html,text/plain,application/json;q=0.9,*/*;q=0.5',
        },
      });
      if (res.status < 300 || res.status >= 400) break;
      const tiep = res.headers.get('location');
      if (!tiep) break;
      u = new URL(tiep, u);
      if (i === MAX_CHUYEN_HUONG) {
        return { content: `LỖI: chuyển hướng quá ${MAX_CHUYEN_HUONG} lần.`, summary: 'vòng chuyển hướng' };
      }
    }
    if (!res) return { content: 'LỖI: không nhận được phản hồi.', summary: 'không phản hồi' };
    if (!res.ok) {
      return { content: `LỖI: máy chủ trả về HTTP ${res.status}.`, summary: `HTTP ${res.status}` };
    }

    const kieu = (res.headers.get('content-type') || '').toLowerCase();
    if (!/text\/|json|xml|javascript/.test(kieu)) {
      return {
        content: `LỖI: nội dung kiểu "${kieu || 'không rõ'}" — tool này chỉ đọc được chữ (HTML, văn bản, JSON).`,
        summary: 'không phải chữ',
      };
    }

    // Đọc theo mẩu và DỪNG khi vượt trần, thay vì `res.text()` rồi mới cắt: một
    // trang 500MB sẽ ăn hết RAM trước khi tới được dòng cắt.
    const doc = res.body?.getReader();
    if (!doc) return { content: 'LỖI: không đọc được thân phản hồi.', summary: 'thân rỗng' };
    const giaiMa = new TextDecoder();
    let tho2 = '';
    let byte = 0;
    for (;;) {
      const { done, value } = await doc.read();
      if (done) break;
      byte += value.byteLength;
      tho2 += giaiMa.decode(value, { stream: true });
      if (byte > MAX_BYTE_TAI) { void doc.cancel(); break; }
    }

    const chu = /html/.test(kieu) ? htmlSangChu(tho2) : tho2.trim();
    if (!chu) return { content: 'Trang không có nội dung chữ nào đọc được.', summary: 'trang rỗng' };

    const catBot = chu.length > MAX_CHU;
    const noi = catBot ? `${chu.slice(0, MAX_CHU)}\n\n[… đã cắt bớt, trang dài hơn ${MAX_CHU} ký tự]` : chu;
    return {
      content: `Nguồn: ${u.toString()}\n\n${noi}`,
      summary: `${Math.round(chu.length / 100) / 10}k ký tự${catBot ? ' (cắt)' : ''}`,
    };
  } catch (err) {
    const m = (err as Error).name === 'AbortError'
      ? `quá ${HET_GIO_MS / 1000}s không tải xong`
      : (err as Error).message;
    return { content: `LỖI khi tải trang: ${m}`, summary: 'tải hỏng' };
  } finally {
    clearTimeout(dongHo);
  }
}
