/**
 * Quét thiết bị trong mạng LAN — chạy ở TIẾN TRÌNH CHÍNH (có Node).
 *
 * Cách làm, và vì sao:
 *   1. Đọc dải mạng từ `os.networkInterfaces()` — lấy đúng card đang có IPv4
 *      riêng tư (192.168.x / 10.x / 172.16–31.x). Chỉ quét /24 (254 địa chỉ):
 *      mạng nhà gần như luôn là /24, và quét /16 là 65 nghìn địa chỉ — treo.
 *   2. Ping-sweep song song: gửi ping tới .1 → .254. Mục đích KHÔNG phải xem
 *      máy nào trả lời (nhiều máy tắt trả lời ping), mà là ÉP router/OS điền
 *      bảng ARP — hỏi "địa chỉ này là ai" ở tầng link.
 *   3. Đọc bảng ARP (`arp -a`) → cặp IP ↔ MAC. Đây mới là nguồn sự thật:
 *      thiết bị nào có MAC trong bảng nghĩa là NÓ CÓ THẬT trên dây, kể cả khi
 *      không thèm trả lời ping.
 *   4. Tra hãng từ MAC (offline) + reverse DNS lấy tên máy (nếu có).
 *
 * ⚠️ Cờ của `ping` KHÁC nhau giữa hệ điều hành (macOS/Linux/Windows) tới mức
 * không đáng tin. Nên KHÔNG dùng cờ timeout của ping — thay vào đó tự đặt hẹn
 * giờ rồi `kill` tiến trình. Một luật đúng cho cả ba hệ, thay vì ba luật mong
 * manh. Xem [[feedback_chot_an_toan_chi_viet_cho_mot_he_dieu_hanh]].
 */
import { spawn } from 'node:child_process';
import os from 'node:os';
import dns from 'node:dns/promises';
import { tenHang, macNgauNhien } from './oui.js';

export interface ThietBiMang {
  ip: string;
  mac: string;
  /** Tên hãng đoán từ MAC, hoặc chuỗi OUI khi chưa biết. */
  hang: string;
  /** Tên máy qua reverse DNS, nếu tra được. */
  ten: string | null;
  /** Ping có trả lời không (chỉ để tham khảo — không trả lời KHÔNG nghĩa là offline). */
  song: boolean;
  /** MAC ngẫu nhiên hoá (điện thoại bật quyền riêng tư). */
  macAn: boolean;
  /** Đây là máy đang chạy app này. */
  laMinh: boolean;
  /** Đây là router (cổng ra Internet). */
  laRouter: boolean;
}

export interface ThongTinMang {
  /** IPv4 của máy này trong LAN. */
  ipMinh: string | null;
  macMinh: string | null;
  tenCard: string | null;
  /** "192.168.1" — ba octet đầu của /24. */
  dai: string | null;
}

const RIENG_TU = /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/;

/** Card mạng LAN đang dùng: IPv4, không phải loopback, địa chỉ riêng tư. */
export function thongTinMang(): ThongTinMang {
  const cards = os.networkInterfaces();
  for (const [ten, list] of Object.entries(cards)) {
    for (const c of list ?? []) {
      // `family` là 'IPv4' ở Node mới, có bản cũ trả số 4 — chấp cả hai.
      const family = String(c.family);
      if ((family !== 'IPv4' && family !== '4') || c.internal) continue;
      if (!RIENG_TU.test(c.address)) continue;
      return {
        ipMinh: c.address,
        macMinh: c.mac && c.mac !== '00:00:00:00:00:00' ? c.mac : null,
        tenCard: ten,
        dai: c.address.split('.').slice(0, 3).join('.'),
      };
    }
  }
  return { ipMinh: null, macMinh: null, tenCard: null, dai: null };
}

/** Ping một IP, tự kill sau `hanMs`. Trả về true nếu có trả lời. */
function pingMot(ip: string, hanMs: number): Promise<boolean> {
  return new Promise((resolve) => {
    const win = process.platform === 'win32';
    const args = win ? ['-n', '1', '-w', String(hanMs), ip] : ['-c', '1', ip];
    const p = spawn('ping', args, { stdio: ['ignore', 'pipe', 'ignore'] });
    let ra = '';
    let xong = false;
    const ket = (song: boolean): void => {
      if (xong) return;
      xong = true;
      clearTimeout(hen);
      try { p.kill('SIGKILL'); } catch { /* đã thoát */ }
      resolve(song);
    };
    const hen = setTimeout(() => ket(false), hanMs + 200);
    p.stdout?.on('data', (d: Buffer) => { ra += d.toString(); });
    p.on('close', (code) => {
      // Trả lời được là exit 0 VÀ có dòng "ttl=" (một số OS trả 0 cả khi
      // "host unreachable"). Đọc cả hai cho chắc.
      ket(code === 0 && /ttl[=<]/i.test(ra));
    });
    p.on('error', () => ket(false)); // không tìm thấy lệnh ping → coi như không trả lời
  });
}

/**
 * Quét dải /24 theo lô song song `soLo` địa chỉ một lúc. Ping xong lô nào thì
 * gọi `khiThayLo` (để bên trên đọc ARP và bắn thiết bị mới ngay — trải nghiệm
 * realtime). Trả về danh sách IP có trả lời ping.
 */
async function pingSweep(
  dai: string,
  soLo: number,
  hanMs: number,
  onTienDo: (da: number, tong: number) => void,
  batDung: () => boolean,
): Promise<Set<string>> {
  const song = new Set<string>();
  const dsIp = Array.from({ length: 254 }, (_, i) => `${dai}.${i + 1}`);
  let da = 0;
  for (let i = 0; i < dsIp.length; i += soLo) {
    if (batDung()) break;
    const lo = dsIp.slice(i, i + soLo);
    const kq = await Promise.all(lo.map((ip) => pingMot(ip, hanMs)));
    kq.forEach((ok, j) => { const ip = lo[j]; if (ok && ip) song.add(ip); });
    da += lo.length;
    onTienDo(Math.min(da, dsIp.length), dsIp.length);
  }
  return song;
}

/** Đọc bảng ARP hệ thống → Map<ip, mac>. Bỏ MAC không đầy đủ / incomplete. */
function docArp(): Promise<Map<string, string>> {
  return new Promise((resolve) => {
    const win = process.platform === 'win32';
    const args = win ? ['-a'] : ['-a', '-n'];
    const p = spawn('arp', args, { stdio: ['ignore', 'pipe', 'ignore'] });
    let ra = '';
    p.stdout?.on('data', (d: Buffer) => { ra += d.toString(); });
    const xong = (): void => resolve(phanTichArp(ra));
    p.on('close', xong);
    p.on('error', () => resolve(new Map())); // không có arp → rỗng
    setTimeout(() => { try { p.kill('SIGKILL'); } catch { /* */ } xong(); }, 4000);
  });
}

/**
 * Bóc IP + MAC từ mọi định dạng `arp -a`:
 *   macOS:   `? (192.168.1.1) at ab:cd:ef:1:2:3 on en0 ifscope [ethernet]`
 *   Linux:   `hostname (192.168.1.5) at ab:cd:ef:12:34:56 [ether] on eth0`
 *   Windows: `  192.168.1.5    ab-cd-ef-12-34-56    dynamic`
 * macOS bỏ số 0 đầu mỗi octet (`1:2:3`) — phải chuẩn hoá lại về 2 hex.
 */
export function phanTichArp(raw: string): Map<string, string> {
  const map = new Map<string, string>();
  const reIp = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/;
  const reMac = /([0-9a-fA-F]{1,2}(?:[:-][0-9a-fA-F]{1,2}){5})/;
  for (const dong of raw.split('\n')) {
    const ip = dong.match(reIp)?.[1];
    const macTho = dong.match(reMac)?.[1];
    if (!ip || !macTho) continue;
    if (/incomplete|\(incomplete\)/i.test(dong)) continue;
    const mac = chuanHoaMac(macTho);
    if (mac === '00:00:00:00:00:00' || mac === 'ff:ff:ff:ff:ff:ff') continue;
    map.set(ip, mac);
  }
  return map;
}

function chuanHoaMac(mac: string): string {
  return mac
    .split(/[:-]/)
    .map((x) => x.padStart(2, '0').toLowerCase())
    .join(':');
}

/** Reverse DNS lấy tên máy, tự bỏ cuộc sau `hanMs` (nhiều IP không có tên). */
async function tenMay(ip: string, hanMs: number): Promise<string | null> {
  try {
    const kq = await Promise.race([
      dns.reverse(ip),
      new Promise<string[]>((_, rej) => setTimeout(() => rej(new Error('hết giờ')), hanMs)),
    ]);
    return kq[0] ?? null;
  } catch {
    return null;
  }
}

export interface TuyChonQuet {
  /** Địa chỉ IP mỗi lô ping song song. Mặc định 24. */
  soLo?: number | undefined;
  /** Hạn chờ mỗi ping (ms). Mặc định 800. */
  hanPingMs?: number | undefined;
}

/**
 * Chạy một lượt quét đầy đủ. `onThietBi` được gọi NGAY mỗi khi phát hiện một
 * thiết bị mới (không đợi quét xong) — đó là cái làm giao diện "realtime".
 * `batDung()` trả true thì dừng sớm. Trả về tổng số thiết bị tìm được.
 */
export async function quetMang(opts: {
  onThietBi: (tb: ThietBiMang) => void;
  onTienDo: (da: number, tong: number) => void;
  batDung: () => boolean;
  tuyChon?: TuyChonQuet | undefined;
}): Promise<{ soThietBi: number; thongTin: ThongTinMang }> {
  const { onThietBi, onTienDo, batDung, tuyChon } = opts;
  const thongTin = thongTinMang();
  if (!thongTin.dai) return { soThietBi: 0, thongTin };

  const soLo = tuyChon?.soLo ?? 24;
  const hanPingMs = tuyChon?.hanPingMs ?? 800;
  const router = `${thongTin.dai}.1`; // gần như luôn là cổng ra
  const daBan = new Set<string>();

  // Bắn thiết bị mới ra ngoài, tránh trùng.
  const banRa = async (ip: string, mac: string, song: boolean): Promise<void> => {
    if (daBan.has(ip)) return;
    daBan.add(ip);
    const ten = await tenMay(ip, 500);
    onThietBi({
      ip,
      mac,
      hang: tenHang(mac) ?? '—',
      ten,
      song,
      macAn: macNgauNhien(mac),
      laMinh: ip === thongTin.ipMinh,
      laRouter: ip === router,
    });
  };

  // Đọc ARP giữa các lô để hiện thiết bị dần. `song` để "false" tạm ở đây —
  // ping-sweep chạy nền, cuối cùng đối chiếu lại. Đơn giản: coi mọi thiết bị
  // trong ARP là có thật; cột "song" lấy từ kết quả ping cuối.
  const docVaBan = async (songSet: Set<string>): Promise<void> => {
    const arp = await docArp();
    for (const [ip, mac] of arp) {
      if (!ip.startsWith(`${thongTin.dai}.`)) continue; // chỉ dải LAN này
      await banRa(ip, mac, songSet.has(ip));
    }
  };

  // Máy mình gần như không nằm trong ARP của chính nó → thêm tay.
  if (thongTin.ipMinh && thongTin.macMinh) {
    await banRa(thongTin.ipMinh, thongTin.macMinh, true);
  }

  const songSet = new Set<string>();
  const song = await pingSweep(
    thongTin.dai,
    soLo,
    hanPingMs,
    async (da, tong) => {
      onTienDo(da, tong);
      // Cứ ~mỗi 1/4 chặng đọc ARP một lần để hiện dần.
      if (da % (soLo * 3) < soLo) await docVaBan(songSet);
    },
    batDung,
  );
  for (const ip of song) songSet.add(ip);

  // Đọc ARP lần cuối — bắt những thiết bị vừa trả lời ở lô cuối.
  await docVaBan(songSet);

  return { soThietBi: daBan.size, thongTin };
}
