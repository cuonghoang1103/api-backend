/**
 * ============================================================
 * Maker Lab — robot trả lời được về HỆ THỐNG của chủ nó (01/10/2026)
 * ============================================================
 *
 * Người dùng: "tôi có thể hỏi nó all về server của tôi, web, app…". Đây là
 * bước 1 — CHỈ ĐỌC: máy chủ, máy nhà, web, tiền AI, đợt deploy, lưu trữ,
 * app desktop. Hành động (restart, deploy…) là bước sau và sẽ đòi xác nhận
 * bằng tay.
 *
 * ── Vì sao ĐOÁN Ý RỒI ĐƯA SỐ, không cho model tự gọi công cụ ──
 *
 * Cùng khuôn với `canTraCuu` (tra web) và `canTrangThai` (pin, wifi): luật
 * nhận ra câu hỏi về hệ thống, server gom số liệu thật, đưa vào prompt như
 * một đoạn tham khảo. Không tốn thêm lượt gọi model nào — gọi công cụ kiểu
 * agent là thêm một vòng hỏi-đáp với model (2–3 giây) vào đúng câu người ta
 * đang chờ nghe. Và chạy được với CẢ HAI não: Qwen 9B ở nhà không gọi công
 * cụ tử tế được, nhưng đọc một bảng số thì đọc tốt.
 *
 * ⛔ CHỈ ROBOT CỦA ADMIN. Maker Lab mở cho người dùng khác; robot của họ hỏi
 * "server còn bao nhiêu ổ đĩa" thì phải không nhận được gì cả. Chốt ở
 * `chuLaAdmin()`, ngay chỗ gọi.
 *
 * ⚠️ THỨ NÀO KHÔNG ĐO ĐƯỢC THÌ NÓI LÀ KHÔNG ĐO ĐƯỢC. Cùng luật với haTang.ts:
 * model nhận một dòng "không lấy được" thì nó nói thế; nhận một ô trống thì
 * nó BỊA cho tròn câu — và một con số bịa về máy chủ là thứ người ta tin.
 */
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';

export type ChuDe = 'vps' | 'may-nha' | 'web' | 'ai' | 'deploy' | 'luu-tru' | 'app';

function khongDau(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Không dấu, có ranh giới từ. "web" một mình KHÔNG đủ (người ta hỏi "web
// nào học tiếng Anh tốt" là hỏi chuyện khác) — phải đi cùng dấu hiệu sở
// hữu ("web của tôi/mình") hoặc một số đo của web.
const LUAT: Array<[ChuDe, RegExp[]]> = [
  ['vps', [/\b(server|may chu|vps)\b/, /\b(o dia|o cung|dung luong dia)\b/, /\b(ram|cpu|tai may)\b/]],
  ['may-nha', [/\bmay (o )?nha\b/, /\b(card|gpu|vram)\b/, /\bnhiet do may\b/, /\bmay tinh o nha\b/]],
  [
    'web',
    [
      /\b(web|trang web|website) (cua )?(toi|minh|anh|em)\b/,
      /\b(nguoi dung|thanh vien|user)\b/,
      /\b(dang ky moi|bao nhieu nguoi dang ky|luot xem|luot truy cap)\b/,
    ],
  ],
  ['ai', [/\b(tien|chi phi|ton) (ai|model|llm|token)\b/, /\bai (ton|tieu|het) bao nhieu\b/, /\b(token|ngan sach ai)\b/]],
  ['deploy', [/\b(deploy|trien khai)\b/, /\b(ban|phien ban) (moi nhat|dang chay)\b/, /\bcap nhat (luc nao|gan nhat)\b/]],
  ['luu-tru', [/\b(r2|luu tru|bo nho luu tru)\b/, /\b(co so du lieu|database|csdl|redis)\b/]],
  ['app', [/\b(app|ung dung) (desktop|may tinh|iphone|ios|android|cua toi|cua minh)\b/, /\btestflight\b/, /\bban app\b/]],
];

/** Câu hỏi chung chung về hệ thống ⇒ một bản tóm tắt ba chủ đề chính. */
const CHUNG = /\b(he thong|ha tang)\b/;

/** Câu này hỏi về chủ đề hệ thống nào. Rỗng = không phải câu hỏi hệ thống. */
export function canHeThong(heard: string): ChuDe[] {
  const s = khongDau(heard || '');
  if (!s) return [];
  const ra = LUAT.filter(([, ds]) => ds.some((r) => r.test(s))).map(([cd]) => cd);
  if (!ra.length && CHUNG.test(s)) return ['vps', 'may-nha', 'web'];
  return ra;
}

// ─── Định dạng cho TAI nghe ───────────────────────────────

/** Byte → "18 GB" / "650 MB" — số tròn, robot đọc lên chứ không ai in ra. */
function dungLuong(b: number | null | undefined): string {
  if (b == null || !Number.isFinite(b)) return 'không rõ';
  const gb = b / 1024 ** 3;
  if (gb >= 10) return `${Math.round(gb)} GB`;
  if (gb >= 1) return `${gb.toFixed(1).replace('.', ',')} GB`;
  return `${Math.round(b / 1024 ** 2)} MB`;
}

function phanTram(dung: number | null, tong: number | null): string {
  if (!dung || !tong) return 'không rõ';
  return `${Math.round((dung / tong) * 100)}%`;
}

function thoiGian(giay: number | null | undefined): string {
  if (giay == null || !Number.isFinite(giay)) return 'không rõ';
  const ngay = Math.floor(giay / 86400);
  const gio = Math.floor((giay % 86400) / 3600);
  const phut = Math.floor((giay % 3600) / 60);
  if (ngay) return `${ngay} ngày ${gio} giờ`;
  if (gio) return `${gio} giờ ${phut} phút`;
  return `${phut} phút`;
}

/** "22:41 ngày 01/10" — giờ Việt Nam, đọc lên nghe tự nhiên. */
function gioVn(d: Date): string {
  const v = new Date(d.getTime() + 7 * 3600 * 1000);
  const hai = (n: number) => String(n).padStart(2, '0');
  return `${hai(v.getUTCHours())}:${hai(v.getUTCMinutes())} ngày ${hai(v.getUTCDate())}/${hai(v.getUTCMonth() + 1)}`;
}

/** Ngân sách chờ cho mỗi chủ đề. Robot chờ đoạn số liệu này xong mới nghĩ,
 *  nên chủ đề chậm nhất cộng thẳng vào độ trễ câu trả lời. */
const HAN_CHO_MS = 2500;

/** 0 giờ hôm nay theo giờ Việt Nam, dưới dạng Date (UTC bên trong). */
function dauNgayVn(): Date {
  const bayGio = Date.now();
  const lechMs = 7 * 3600 * 1000;
  const ngay = Math.floor((bayGio + lechMs) / 86400000) * 86400000;
  return new Date(ngay - lechMs);
}

// ─── Từng chủ đề ──────────────────────────────────────────

/** Có hạn chờ: máy nhà tắt thì `soLieuMayNha` chờ tới 8 giây — robot không
 *  được đứng im chừng ấy chỉ vì một dòng tham khảo. */
function hanCho<T>(p: Promise<T>, ms: number, thay: T): Promise<T> {
  return Promise.race([p, new Promise<T>((r) => setTimeout(() => r(thay), ms))]);
}

async function vps(): Promise<string> {
  const { soLieuVps } = await import('./haTang.js');
  const m = await soLieuVps();
  const tai = m.cpu.tai?.map((x) => x.toFixed(2).replace('.', ',')).join(' / ');
  const cpu =
    (m.cpu.phanTram != null ? `CPU ${m.cpu.phanTram}%` : 'CPU không rõ') +
    (m.cpu.soNhan ? ` (${m.cpu.soNhan} nhân${tai ? `, tải ${tai}` : ''})` : '');
  return (
    `Máy chủ VPS (${m.ten ?? 'cuongthai.com'}): ${cpu}; ` +
    `RAM dùng ${dungLuong(m.ram.daDung)} trên ${dungLuong(m.ram.tong)} (${phanTram(m.ram.daDung, m.ram.tong)}); ` +
    `ổ đĩa dùng ${phanTram(m.dia.daDung, m.dia.tong)}, còn trống ${dungLuong(m.dia.conTrong)}; ` +
    `chạy liên tục ${thoiGian(m.uptimeGiay)}.`
  );
}

async function mayNha(): Promise<string> {
  const { soLieuMayNha } = await import('./haTang.js');
  const m = await hanCho(soLieuMayNha(), HAN_CHO_MS, null);
  if (!m || !m.online) {
    return `Máy GPU ở nhà: KHÔNG lấy được số liệu (${m?.loi ?? 'quá 2,5 giây không trả lời'}) — có thể máy đang tắt hoặc mất mạng.`;
  }
  const gpu = (m.gpu ?? []).map((g) => {
    const x = g as { ten?: string; phanTram?: number; nhiet?: number; vramDung?: number; vramTong?: number };
    return `${x.ten ?? 'GPU'} chạy ${x.phanTram ?? '?'}%, ${x.nhiet ?? '?'}°C, VRAM ${dungLuong(x.vramDung)} / ${dungLuong(x.vramTong)}`;
  });
  const dv = Object.entries(m.dichVu ?? {})
    .map(([ten, tt]) => `${ten} ${tt === 'active' ? 'đang chạy' : tt}`)
    .join(', ');
  return (
    `Máy GPU ở nhà: ${m.cpu.phanTram != null ? `CPU ${m.cpu.phanTram}%` : 'CPU không rõ'}` +
    (m.nhiet.cpu != null ? `, ${Math.round(m.nhiet.cpu)}°C` : '') +
    `; RAM dùng ${phanTram(m.ram.daDung, m.ram.tong)}; ổ đĩa còn ${dungLuong(m.dia.conTrong)}` +
    (gpu.length ? `; ${gpu.join('; ')}` : '') +
    (dv ? `; dịch vụ: ${dv}` : '') +
    `; chạy liên tục ${thoiGian(m.uptimeGiay)}.`
  );
}

async function web(): Promise<string> {
  const homNay = dauNgayVn();
  const truoc24h = new Date(Date.now() - 24 * 3600 * 1000);
  const [tong, moi, dangNhap, baiViet, luotXem] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: homNay } } }),
    prisma.user.count({ where: { lastLoginAt: { gte: truoc24h } } }),
    prisma.post.count(),
    prisma.post.aggregate({ _sum: { viewCount: true } }),
  ]);
  return (
    `Web cuongthai.com: ${tong} tài khoản, ${moi} đăng ký mới từ 0 giờ hôm nay, ` +
    `${dangNhap} người đăng nhập trong 24 giờ qua; ${baiViet} bài viết, tổng ${luotXem._sum.viewCount ?? 0} lượt xem bài.`
  );
}

async function ai(): Promise<string> {
  const { todaySpendUsd, softCapUsd, hardCapUsd } = await import('../llm/budget.js');
  const tieu = await todaySpendUsd();
  return (
    `Tiền AI hôm nay (ƯỚC LƯỢNG — cổng không công khai giá): khoảng ${tieu.toFixed(2).replace('.', ',')} đô; ` +
    `trần mềm ${softCapUsd()} đô (cắt việc chạy nền), trần cứng ${hardCapUsd()} đô (cắt tất).`
  );
}

async function deploy(): Promise<string> {
  // Máy chủ không tự biết commit nào đang chạy (deploy-nha.sh suy ra từ tag
  // ảnh docker trên VPS). Nhưng mỗi đợt deploy là một container MỚI, nên
  // lúc tiến trình này khởi động chính là lúc đợt deploy gần nhất xong.
  const chay = process.uptime();
  return (
    `Đợt deploy gần nhất: backend khởi động lúc ${gioVn(new Date(Date.now() - chay * 1000))}, ` +
    `đã chạy ${thoiGian(chay)} (không biết mã commit từ phía máy chủ).`
  );
}

async function luuTru(): Promise<string> {
  const { getSystemStats } = await import('../systemStats.service.js');
  // Lần đầu, R2 phải liệt kê cả kho (có thể vài giây). Hết hạn chờ thì nói
  // "đang đo" — lời gọi vẫn chạy tiếp và làm ấm bộ nhớ đệm 10 phút của
  // systemStats, nên lần hỏi sau có số ngay.
  const s = await hanCho(getSystemStats(), HAN_CHO_MS, null);
  if (!s) return 'Lưu trữ: đang đo (lần đầu phải liệt kê cả kho R2) — hỏi lại sau ít giây là có số.';
  const r2 = s.r2 ? `R2 có ${s.r2.objectCount} tệp, ${dungLuong(s.r2.totalBytes)}` : 'R2 không đo được';
  return `Lưu trữ: ${r2}; cơ sở dữ liệu ${dungLuong(s.dbSizeBytes)}; Redis ${dungLuong(s.redisMemoryBytes)}.`;
}

let appCache: { luc: number; chu: string } | null = null;
async function app(): Promise<string> {
  if (appCache && Date.now() - appCache.luc < 15 * 60 * 1000) return appCache.chu;
  // Kho phát hành của app desktop là kho CÔNG KHAI (electron-updater tải bản
  // mới không kèm token), nên hỏi API GitHub không cần khoá.
  let chu = 'App desktop: không lấy được bản mới nhất từ GitHub.';
  try {
    const r = await fetch('https://api.github.com/repos/cuonghoang1103/cuongthai-desktop/releases/latest', {
      headers: { accept: 'application/vnd.github+json', 'user-agent': 'cuongthai-odin' },
      signal: AbortSignal.timeout(HAN_CHO_MS),
    });
    if (r.ok) {
      const j = (await r.json()) as { tag_name?: string; published_at?: string };
      chu = `App desktop: bản mới nhất ${j.tag_name ?? '?'}` + (j.published_at ? `, phát hành ${gioVn(new Date(j.published_at))}` : '') + '.';
    }
  } catch (e) {
    logger.debug('Odin: không lấy được bản app desktop', { error: e instanceof Error ? e.message : String(e) });
  }
  appCache = { luc: Date.now(), chu };
  return chu + ' App iPhone: chưa có số liệu (TestFlight không nối vào máy chủ).';
}

const LAM: Record<ChuDe, () => Promise<string>> = {
  vps,
  'may-nha': mayNha,
  web,
  ai,
  deploy,
  'luu-tru': luuTru,
  app,
};

/**
 * Đoạn tham khảo cho prompt. Lỗi ở một chủ đề KHÔNG làm hỏng cả đoạn — chủ
 * đề đó ghi "không lấy được", phần còn lại vẫn đi.
 */
export async function khoiHeThong(chuDe: ChuDe[]): Promise<string> {
  if (!chuDe.length) return '';
  const dong = await Promise.all(
    chuDe.map((cd) =>
      LAM[cd]().catch((e) => {
        logger.warn('Odin: lỗi lấy số liệu hệ thống', { chuDe: cd, error: e instanceof Error ? e.message : String(e) });
        return `${cd}: không lấy được số liệu (lỗi máy chủ).`;
      }),
    ),
  );
  return (
    `[Số liệu THẬT của hệ thống lúc ${gioVn(new Date())} — chủ của bạn đang hỏi về nó. ` +
    `Trả lời đúng câu hỏi bằng số tròn, đừng đọc cả bảng; thứ nào ghi "không lấy được" thì nói thẳng là không biết, đừng đoán.]\n` +
    dong.map((d) => `- ${d}`).join('\n')
  );
}

/** Chủ con robot này có phải ADMIN của web không — có hạn nhớ 5 phút. */
const adminCache = new Map<number, { luc: number; la: boolean }>();
export async function chuLaAdmin(deviceId: number): Promise<boolean> {
  const c = adminCache.get(deviceId);
  if (c && Date.now() - c.luc < 5 * 60 * 1000) return c.la;
  let la = false;
  try {
    const d = await prisma.makerDevice.findUnique({ where: { id: deviceId }, select: { ownerId: true } });
    if (d) {
      const u = await prisma.user.findUnique({
        where: { id: d.ownerId },
        select: { enabled: true, roles: { select: { role: { select: { name: true } } } } },
      });
      la =
        !!u?.enabled &&
        u.roles.some((r) => r.role.name.toUpperCase().replace('ROLE_', '') === 'ADMIN');
    }
  } catch (e) {
    logger.warn('Odin: không kiểm được quyền chủ robot', { deviceId, error: e instanceof Error ? e.message : String(e) });
  }
  adminCache.set(deviceId, { luc: Date.now(), la });
  return la;
}
