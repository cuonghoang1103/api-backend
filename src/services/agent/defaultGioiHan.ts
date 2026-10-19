/**
 * ============================================================
 * CUONGMINI DEFAULT — CHỐNG SPAM / DÙNG QUÁ ĐÀ (19/10/2026)
 * ============================================================
 *
 * Chủ app chốt: CuongMini Default chạy trên rambo (gói TRẢ TRỌN) cho MỌI tài khoản — Free lẫn Pro — gần như KHÔNG
 * giới hạn; chỉ có một lớp chống spam ở mức cao:
 *   • ≤ 10 lượt/phút/người (Free + Pro, khi chạy Default);
 *   • ≤ 500 lượt/ngày/người — CHỈ Free (Pro không có trần ngày);
 *   • ≤ 1500 lượt/ngày/IP — CHỈ Free (nhiều tài khoản Free cùng một IP);
 *   • Free phải XÁC THỰC EMAIL (kiểm ở route).
 * Admin chỉnh cả ba (`app_settings.cuongmini_default_gioi_han`), 0 = tắt. Chạm ⇒ câu thân thiện nói rõ khi nào
 * dùng lại (không chặn vĩnh viễn, không cần mã gia hạn).
 *
 * "LƯỢT" = một câu hỏi MỚI của người dùng (tin cuối của hội thoại là của người, không phải lượt phụ) — KHÔNG phải mỗi
 * bước gọi tool (một câu hỏi agent có thể đi 30–260 bước; đếm bước thì 10/phút chặn ngay việc bình thường).
 *
 * Đếm trong BỘ NHỚ tiến trình (nhanh, tính cả lượt đang chạy, có IP). Khởi động lại ⇒ đếm ngày của mỗi người được
 * nạp lại từ sổ (`interview_llm_call_logs`, dấu `default:luot` — `turn.ts`); đếm IP thì bắt đầu lại (chấp nhận được:
 * đây là lớp chống spam mức cao, không phải hoá đơn).
 *
 * ⚠️ RỦI RO: rambo là gói của MỘT nhà cung cấp — dùng quá đà có thể bị họ giới hạn khoá. Cầu dao rambo + lùi Solid
 * (Pro) / báo bảo trì (Free) che việc đó; trang admin có bảng "ai dùng Default nhiều nhất hôm nay" để phát hiện sớm.
 */
import { isIP } from 'node:net';
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';
import { dauNgayVn } from './anthropicChinhHang/hanMuc.js';

const KHOA = 'cuongmini_default_gioi_han';

export interface GioiHanDefault {
  /** Lượt/phút/người (Free + Pro). 0 = tắt. */
  phutNguoi: number;
  /** Lượt/ngày/người — chỉ Free. 0 = tắt. */
  ngayFree: number;
  /** Lượt/ngày/IP — chỉ Free. 0 = tắt. */
  ngayIp: number;
  /**
   * QA 19/10/2026: lời gọi `/turn` (MỌI bước, kể cả lượt phụ)/ngày/người — chỉ Free. 0 = tắt. Lưới đỡ cho hai trần trên:
   * "câu hỏi mới" do APP khai (tin cuối là của người, `laPhu` không đếm) ⇒ client tự sửa gói tin (gửi `laPhu: true`, hoặc
   * đội câu hỏi mới thành "kết quả tool") là không bị đếm câu nào. Trần bước thì không lách được.
   */
  buocNgayFree: number;
}
export const GIOI_HAN_MAC_DINH: GioiHanDefault = Object.freeze({ phutNguoi: 10, ngayFree: 500, ngayIp: 1500, buocNgayFree: 10_000 });

function docSo(v: unknown, mac: number): number {
  return typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= 1_000_000 ? Math.floor(v) : mac;
}
/** THUẦN: JSON admin đã lưu ⇒ đủ ba ô. */
export function gopGioiHan(o: unknown, goc: GioiHanDefault = GIOI_HAN_MAC_DINH): GioiHanDefault {
  const x = (o && typeof o === 'object' ? o : {}) as Record<string, unknown>;
  return {
    phutNguoi: docSo(x.phutNguoi, goc.phutNguoi), ngayFree: docSo(x.ngayFree, goc.ngayFree), ngayIp: docSo(x.ngayIp, goc.ngayIp),
    buocNgayFree: docSo(x.buocNgayFree, goc.buocNgayFree),
  };
}

let nho: { luc: number; v: GioiHanDefault } | null = null;
export async function docGioiHanDefault(): Promise<GioiHanDefault> {
  if (nho && Date.now() - nho.luc < 60_000) return nho.v;
  let v = { ...GIOI_HAN_MAC_DINH };
  try {
    const r = await prisma.appSetting.findUnique({ where: { key: KHOA } });
    if (r?.value) v = gopGioiHan(JSON.parse(r.value));
  } catch { /* hỏng ⇒ mặc định */ }
  nho = { luc: Date.now(), v };
  return v;
}
export async function datGioiHanDefault(moi: unknown): Promise<GioiHanDefault> {
  const v = gopGioiHan(moi, await docGioiHanDefault());
  const value = JSON.stringify(v);
  await prisma.appSetting.upsert({ where: { key: KHOA }, update: { value }, create: { key: KHOA, value } });
  nho = { luc: Date.now(), v };
  return v;
}

// ─── Bộ đếm (bộ nhớ) ─────────────────────────────────────────────

/** Mốc ngày giờ VN (chuỗi) — đổi ngày ⇒ đếm ngày tự về 0. */
function ngayVn(now: number): string {
  return dauNgayVn(new Date(now)).toISOString();
}

export class BoDemDefault {
  phut = new Map<number, number[]>();
  ngayNguoi = new Map<number, { ngay: string; so: number }>();
  ngayIp = new Map<string, { ngay: string; so: number }>();
  buocNguoi = new Map<number, { ngay: string; so: number }>();

  soPhut(userId: number, now: number): number[] {
    const ds = (this.phut.get(userId) ?? []).filter((t) => now - t < 60_000);
    this.phut.set(userId, ds);
    return ds;
  }
  soNgayNguoi(userId: number, now: number): number {
    const x = this.ngayNguoi.get(userId);
    return x && x.ngay === ngayVn(now) ? x.so : 0;
  }
  coNgayNguoi(userId: number, now: number): boolean {
    return this.ngayNguoi.get(userId)?.ngay === ngayVn(now);
  }
  datNgayNguoi(userId: number, so: number, now: number): void {
    this.ngayNguoi.set(userId, { ngay: ngayVn(now), so });
  }
  soNgayIp(ip: string, now: number): number {
    const x = this.ngayIp.get(ip);
    return x && x.ngay === ngayVn(now) ? x.so : 0;
  }
  soBuoc(userId: number, now: number): number {
    const x = this.buocNguoi.get(userId);
    return x && x.ngay === ngayVn(now) ? x.so : 0;
  }
  coBuoc(userId: number, now: number): boolean {
    return this.buocNguoi.get(userId)?.ngay === ngayVn(now);
  }
  ghiBuoc(userId: number, now: number, so = this.soBuoc(userId, now) + 1): void {
    this.buocNguoi.set(userId, { ngay: ngayVn(now), so });
  }
  ghi(userId: number, ip: string | null, now: number): void {
    this.soPhut(userId, now).push(now);
    this.datNgayNguoi(userId, this.soNgayNguoi(userId, now) + 1, now);
    if (ip) this.ngayIp.set(ip, { ngay: ngayVn(now), so: this.soNgayIp(ip, now) + 1 });
    /* Dọn bản đồ phút khi phình (người đã im > 1 phút). */
    if (this.phut.size > 5000) for (const [k, v] of this.phut) if (!v.some((t) => now - t < 60_000)) this.phut.delete(k);
    /* QA 19/10/2026: đếm theo NGÀY của hôm trước không bao giờ được đọc lại — dọn khi phình (mỗi IP Free một mục). */
    const homNay = ngayVn(now);
    for (const m of [this.ngayIp, this.ngayNguoi, this.buocNguoi] as Array<Map<unknown, { ngay: string }>>) {
      if (m.size > 20_000) for (const [k, v] of m) if (v.ngay !== homNay) m.delete(k);
    }
  }
}

export type KetQuaKiem =
  | { ok: true }
  | { ok: false; ma: 'DEFAULT_QUA_NHANH' | 'DEFAULT_HET_NGAY' | 'DEFAULT_HET_NGAY_IP' | 'DEFAULT_HET_BUOC_NGAY'; cau: string; thuLaiSauGiay: number };

/** Giây tới 0:00 ngày mai giờ Việt Nam. */
function giayToiNgayMai(now: number): number {
  return Math.max(1, Math.ceil((dauNgayVn(new Date(now)).getTime() + 86_400_000 - now) / 1000));
}
function moTaGio(giay: number): { vi: string; en: string } {
  const gio = Math.floor(giay / 3600);
  const phut = Math.ceil((giay % 3600) / 60);
  return gio > 0
    ? { vi: `${gio} giờ ${phut} phút`, en: `${gio}h ${phut}m` }
    : { vi: `${phut} phút`, en: `${phut} min` };
}

/**
 * THUẦN (test được): lượt MỚI này có được chạy không. Chỉ kiểm — ghi bằng `bo.ghi` khi cho qua.
 * `free = false` (Pro / admin) ⇒ chỉ trần phút.
 */
export function kiemThuan(bo: BoDemDefault, gh: GioiHanDefault, o: { userId: number; ip: string | null; free: boolean; now: number }): KetQuaKiem {
  const { userId, ip, free, now } = o;
  if (gh.phutNguoi > 0) {
    const ds = bo.soPhut(userId, now);
    if (ds.length >= gh.phutNguoi) {
      const giay = Math.max(1, Math.ceil((ds[0]! + 60_000 - now) / 1000));
      return {
        ok: false, ma: 'DEFAULT_QUA_NHANH', thuLaiSauGiay: giay,
        cau: `Bạn hỏi hơi nhanh (tối đa ${gh.phutNguoi} câu/phút với CuongMini Default) — đợi khoảng ${giay} giây rồi gửi tiếp nhé. / You're going a bit fast (max ${gh.phutNguoi} questions/min on CuongMini Default) — wait about ${giay}s and send again.`,
      };
    }
  }
  if (free && gh.ngayFree > 0 && bo.soNgayNguoi(userId, now) >= gh.ngayFree) {
    const giay = giayToiNgayMai(now);
    const t = moTaGio(giay);
    return {
      ok: false, ma: 'DEFAULT_HET_NGAY', thuLaiSauGiay: giay,
      cau: `Hôm nay bạn đã dùng hết ${gh.ngayFree} câu hỏi miễn phí với CuongMini Default — dùng lại sau 0:00 (còn khoảng ${t.vi}). Gói Pro không có trần ngày. / You've used today's ${gh.ngayFree} free CuongMini Default questions — available again after midnight Vietnam time (about ${t.en}). Pro has no daily cap.`,
    };
  }
  if (free && ip && gh.ngayIp > 0 && bo.soNgayIp(ip, now) >= gh.ngayIp) {
    const giay = giayToiNgayMai(now);
    const t = moTaGio(giay);
    return {
      ok: false, ma: 'DEFAULT_HET_NGAY_IP', thuLaiSauGiay: giay,
      cau: `Mạng bạn đang dùng đã chạm trần câu hỏi miễn phí hôm nay (nhiều tài khoản cùng một địa chỉ IP) — dùng lại sau 0:00 (còn khoảng ${t.vi}), hoặc đăng nhập tài khoản Pro. / Your network has reached today's free-question cap (many accounts on one IP) — available again after midnight Vietnam time (about ${t.en}), or sign in with Pro.`,
    };
  }
  return { ok: true };
}

/** THUẦN: trần BƯỚC/ngày của tài khoản Free (mọi lời gọi `/turn`). Chỉ kiểm — ghi bằng `bo.ghiBuoc`. */
export function kiemBuocThuan(bo: BoDemDefault, gh: GioiHanDefault, o: { userId: number; now: number }): KetQuaKiem {
  if (!(gh.buocNgayFree > 0) || bo.soBuoc(o.userId, o.now) < gh.buocNgayFree) return { ok: true };
  const giay = giayToiNgayMai(o.now);
  const t = moTaGio(giay);
  return {
    ok: false, ma: 'DEFAULT_HET_BUOC_NGAY', thuLaiSauGiay: giay,
    cau: `Hôm nay tài khoản miễn phí đã chạy quá ${gh.buocNgayFree} bước CuongMini Default — dùng lại sau 0:00 (còn khoảng ${t.vi}). Gói Pro không có trần ngày. / This free account ran more than ${gh.buocNgayFree} CuongMini Default steps today — available again after midnight Vietnam time (about ${t.en}). Pro has no daily cap.`,
  };
}

/**
 * IP để ĐẾM chống spam (QA 19/10/2026). KHÔNG dùng `req.ip`: hàm `trust proxy` ở `src/index.ts` tin HAI chặng (viết cho
 * Cloudflare → nginx), mà cuongthai.com trỏ THẲNG về VPS (không qua Cloudflare) ⇒ chặng thứ hai là `X-Forwarded-For` do
 * CLIENT tự gửi (nginx chỉ nối thêm IP thật vào cuối) ⇒ đổi header là đổi IP, trần theo IP vô dụng. `X-Real-IP` thì nginx
 * GHI ĐÈ bằng `$remote_addr` (client không giả được) — chỉ tin nó khi kết nối tới từ mạng nội bộ (nginx trong Docker);
 * còn lại (gọi thẳng, dev) ⇒ địa chỉ socket.
 */
export function ipChongSpam(req: { headers?: Record<string, unknown>; socket?: { remoteAddress?: string | null } | null }): string | null {
  const sock = (req.socket?.remoteAddress ?? '').replace(/^::ffff:/, '') || null;
  const real = String(req.headers?.['x-real-ip'] ?? '').trim();
  if (sock && laMangNoiBo(sock) && real && isIP(real)) return real.replace(/^::ffff:/, '');
  return sock;
}
function laMangNoiBo(ip: string): boolean {
  if (ip === '::1' || /^127\./.test(ip) || /^10\./.test(ip) || /^192\.168\./.test(ip)) return true;
  const m = /^172\.(\d+)\./.exec(ip);
  if (m && Number(m[1]) >= 16 && Number(m[1]) <= 31) return true;
  return /^f[cd][0-9a-f]{2}:/i.test(ip);
}

const BO = new BoDemDefault();

/** Đếm ngày của người này từ SỔ (một lần mỗi ngày mỗi người, sau khởi động lại). */
async function napNgayTuSo(userId: number, now: number): Promise<void> {
  if (BO.coNgayNguoi(userId, now)) return;
  try {
    const so = await prisma.interviewLLMCallLog.count({
      where: { userId, feature: 'agent', step: 'default:luot', createdAt: { gte: dauNgayVn(new Date(now)) } },
    });
    if (!BO.coNgayNguoi(userId, now)) BO.datNgayNguoi(userId, so, now);
  } catch (err) {
    logger.warn('[default] không đọc được sổ — đếm từ 0', { error: (err as Error).message });
    BO.datNgayNguoi(userId, 0, now);
  }
}

/** Kiểm + ghi một lượt MỚI của CuongMini Default. */
export async function kiemVaGhiLuotDefault(o: { userId: number; ip: string | null; free: boolean }): Promise<KetQuaKiem> {
  const now = Date.now();
  const gh = await docGioiHanDefault();
  await napNgayTuSo(o.userId, now);
  const kq = kiemThuan(BO, gh, { ...o, now });
  if (kq.ok) BO.ghi(o.userId, o.ip, now);
  else logger.info('[default] chạm giới hạn chống spam', { userId: o.userId, ma: kq.ma, free: o.free });
  return kq;
}

/** Kiểm + ghi một LỜI GỌI `/turn` (mọi bước) của tài khoản Free — trần bước/ngày. Đếm nạp lại từ sổ sau khởi động lại. */
export async function kiemVaGhiBuocFree(userId: number): Promise<KetQuaKiem> {
  const now = Date.now();
  const gh = await docGioiHanDefault();
  if (!(gh.buocNgayFree > 0)) return { ok: true };
  if (!BO.coBuoc(userId, now)) {
    let so = 0;
    try {
      so = await prisma.interviewLLMCallLog.count({
        where: { userId, feature: 'agent', step: { in: ['default:luot', 'default'] }, createdAt: { gte: dauNgayVn(new Date(now)) } },
      });
    } catch (err) {
      logger.warn('[default] không đọc được sổ bước — đếm từ 0', { error: (err as Error).message });
    }
    if (!BO.coBuoc(userId, now)) BO.ghiBuoc(userId, now, so);
  }
  const kq = kiemBuocThuan(BO, gh, { userId, now });
  if (kq.ok) BO.ghiBuoc(userId, now);
  else logger.info('[default] chạm trần bước/ngày (Free)', { userId });
  return kq;
}

/** Đếm hôm nay của một người (cho `/agent/tools` hiện "còn bao nhiêu"). */
export async function demHomNay(userId: number): Promise<number> {
  const now = Date.now();
  await napNgayTuSo(userId, now);
  return BO.soNgayNguoi(userId, now);
}

/** ADMIN: ai dùng CuongMini Default nhiều nhất hôm nay (từ sổ) + IP đông nhất (bộ nhớ). */
export async function topDefaultHomNay(gioiHan = 20): Promise<{
  nguoi: Array<{ userId: number; username: string | null; email: string | null; emailVerified: boolean; luot: number; buoc: number; token: number }>;
  ip: Array<{ ip: string; luot: number }>;
}> {
  const tu = dauNgayVn();
  /* QA 19/10/2026: xếp theo BƯỚC (lời gọi rambo thật), không theo "câu hỏi" — câu hỏi do app khai, client sửa gói tin
     (`laPhu`, tin cuối giả làm kết quả tool) thì 0 câu hỏi mà hàng nghìn bước ⇒ bảng cũ không bao giờ thấy họ. */
  const buoc = await prisma.interviewLLMCallLog.groupBy({
    by: ['userId'], where: { feature: 'agent', step: { in: ['default:luot', 'default'] }, createdAt: { gte: tu } },
    _count: { _all: true }, _sum: { inputTokens: true, outputTokens: true }, orderBy: { _count: { userId: 'desc' } }, take: gioiHan,
  });
  const ids = buoc.map((x) => x.userId).filter((x): x is number => typeof x === 'number');
  const luot = ids.length
    ? await prisma.interviewLLMCallLog.groupBy({
      by: ['userId'], where: { userId: { in: ids }, feature: 'agent', step: 'default:luot', createdAt: { gte: tu } }, _count: { _all: true },
    })
    : [];
  const luotTheo = new Map(luot.map((x) => [x.userId, x._count._all]));
  const users = ids.length
    ? await prisma.user.findMany({ where: { id: { in: ids } }, select: { id: true, username: true, email: true, emailVerified: true } })
    : [];
  const theoId = new Map(users.map((u) => [u.id, u]));
  const now = Date.now();
  const ip = [...BO.ngayIp.entries()]
    .filter(([, v]) => v.ngay === ngayVn(now))
    .sort((a, b) => b[1].so - a[1].so).slice(0, gioiHan)
    .map(([k, v]) => ({ ip: k, luot: v.so }));
  return {
    nguoi: buoc.filter((b) => typeof b.userId === 'number').map((b) => {
      const u = theoId.get(b.userId as number);
      return {
        userId: b.userId as number, username: u?.username ?? null, email: u?.email ?? null, emailVerified: Boolean(u?.emailVerified),
        luot: luotTheo.get(b.userId) ?? 0, buoc: b._count._all, token: (b._sum.inputTokens ?? 0) + (b._sum.outputTokens ?? 0),
      };
    }),
    ip,
  };
}

/** Đợt 8A (`/usage`): số câu Default của người này trong 60 giây qua (bộ nhớ). */
export function demPhutDefault(userId: number): number {
  return BO.soPhut(userId, Date.now()).length;
}
