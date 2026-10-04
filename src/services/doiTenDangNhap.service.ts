/**
 * ĐỔI TÊN ĐĂNG NHẬP (username) — 04/10/2026.
 *
 * Người đăng nhập bằng Google/GitHub/Apple được tự đặt username kiểu
 * `ten.email_mf2k3x9` (auth.service → oauthLogin) và trước đây KHÔNG có đường
 * nào đổi. Họ chê xấu. Ở đây cho đổi, kèm tuỳ chọn dùng luôn làm tên hiển thị.
 *
 * Luật tên: 3–30 ký tự, chữ thường a-z, số, dấu chấm và gạch dưới; bắt đầu và
 * kết thúc bằng chữ/số; không hai dấu liền nhau. Không phân biệt hoa thường khi
 * so trùng — `CuongThai` và `cuongthai` là một người trong mắt người khác.
 *
 * ⚠️ `messages.routes.ts` nhận diện quản trị viên tối cao THEO USERNAME
 * (`cuong03dx`, `cuong123`). Vì vậy: hai tên đó KHÔNG ai lấy được, và hai tài
 * khoản đó KHÔNG đổi tên ở đây (đổi là tự tước quyền của mình).
 *
 * Người đăng nhập bằng mật khẩu đổi tên thì từ đó đăng nhập bằng tên MỚI
 * (login tìm theo username) — giao diện phải báo trước điều này.
 */
import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

const QUAN_TRI_TOI_CAO = new Set(['cuong03dx', 'cuong123']);
const TEN_GIU = new Set([
  ...QUAN_TRI_TOI_CAO,
  'admin', 'administrator', 'root', 'system', 'support', 'help', 'moderator', 'mod', 'staff',
  'cuongthai', 'cuong_thai', 'cuong.thai', 'cuongmini', 'odin', 'api', 'www', 'mail', 'me',
  'settings', 'profile', 'login', 'logout', 'signup', 'register', 'null', 'undefined', 'anonymous',
]);
const MAU = /^[a-z0-9](?:[a-z0-9._]{1,28})[a-z0-9]$/;
/** Tối đa 3 lần đổi mỗi ngày mỗi người — đủ để sửa lỡ tay, không đủ để đổi liên tục giả người khác. */
const TRAN_NGAY = 3;
const daDoi = new Map<string, number>();

export type KiemTen = { hopLe: boolean; conTrong: boolean; ten: string; lyDo?: string };

export function chuanHoaTen(raw: unknown): string {
  return String(raw ?? '').trim().toLowerCase().replace(/^@/, '');
}

function loiCuaTen(ten: string): string | null {
  if (ten.length < 3) return 'Tên đăng nhập cần ít nhất 3 ký tự.';
  if (ten.length > 30) return 'Tên đăng nhập tối đa 30 ký tự.';
  if (!MAU.test(ten)) return 'Chỉ dùng chữ thường không dấu (a–z), số, dấu chấm hoặc gạch dưới; bắt đầu và kết thúc bằng chữ hoặc số.';
  if (/[._]{2}/.test(ten)) return 'Không dùng hai dấu chấm/gạch dưới liền nhau.';
  if (TEN_GIU.has(ten)) return 'Tên này được giữ cho hệ thống, bạn chọn tên khác nhé.';
  return null;
}

async function biTrung(ten: string, userId: number): Promise<boolean> {
  const x = await prisma.user.findFirst({
    where: { username: { equals: ten, mode: 'insensitive' }, NOT: { id: userId } },
    select: { id: true },
  });
  return !!x;
}

/** Kiểm trước khi lưu — ô nhập gọi khi người dùng ngừng gõ. */
export async function kiemTenDangNhap(userId: number, raw: unknown): Promise<KiemTen> {
  const ten = chuanHoaTen(raw);
  const toi = await prisma.user.findUnique({ where: { id: userId }, select: { username: true } });
  if (toi && QUAN_TRI_TOI_CAO.has(toi.username.toLowerCase())) {
    return { hopLe: false, conTrong: false, ten, lyDo: 'Tài khoản quản trị chính không đổi tên đăng nhập ở đây.' };
  }
  const loi = loiCuaTen(ten);
  if (loi) return { hopLe: false, conTrong: false, ten, lyDo: loi };
  if (await biTrung(ten, userId)) return { hopLe: true, conTrong: false, ten, lyDo: 'Tên này đã có người dùng.' };
  return { hopLe: true, conTrong: true, ten };
}

export async function doiTenDangNhap(userId: number, raw: unknown, dungLamTenHienThi: boolean) {
  const ten = chuanHoaTen(raw);
  const loi = loiCuaTen(ten);
  if (loi) throw new AppError(loi, 400, 'USERNAME_INVALID');

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { username: true, provider: true } });
  if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  // So KHÔNG phân biệt hoa thường: tài khoản thật đang là `Cuong03dx`.
  if (QUAN_TRI_TOI_CAO.has(user.username.toLowerCase())) {
    throw new AppError('Tài khoản quản trị chính không đổi tên đăng nhập ở đây.', 403, 'USERNAME_LOCKED');
  }
  if (user.username === ten) {
    if (dungLamTenHienThi) await prisma.user.update({ where: { id: userId }, data: { displayName: ten } });
    return { username: ten, dangNhapBangTenMoi: false };
  }
  if (await biTrung(ten, userId)) throw new AppError('Tên này đã có người dùng.', 409, 'USERNAME_TAKEN');

  const k = `${userId}:${new Date().toISOString().slice(0, 10)}`;
  const n = (daDoi.get(k) ?? 0) + 1;
  if (n > TRAN_NGAY) throw new AppError('Hôm nay bạn đã đổi tên 3 lần — mai đổi tiếp nhé.', 429, 'USERNAME_RATE');
  if (daDoi.size > 5000) daDoi.clear();

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { username: ten, ...(dungLamTenHienThi ? { displayName: ten } : {}) },
    });
  } catch (e) {
    // Hai người chọn cùng một tên trong cùng một khoảnh khắc: khoá UNIQUE chặn người sau.
    if ((e as { code?: string }).code === 'P2002') throw new AppError('Tên này đã có người dùng.', 409, 'USERNAME_TAKEN');
    throw e;
  }
  daDoi.set(k, n);
  // provider null/'local' = có mật khẩu ⇒ từ giờ đăng nhập bằng tên mới.
  return { username: ten, dangNhapBangTenMoi: !user.provider || user.provider === 'local' };
}

/**
 * Tên đăng nhập ĐẸP cho tài khoản mới đăng nhập bằng Google/GitHub/Apple/Facebook
 * (04/10/2026). Trước đây là `phần-trước-@ + _ + Date.now() base36` ⇒
 * `anhthaimeo632005_munfqa89` — người dùng chê xấu.
 *
 * Ưu tiên: tên đăng nhập GitHub (nếu có) → họ tên bỏ dấu, viết liền
 * (Hoàng Nghĩa Cường → hoangnghiacuong) → phần trước @ của email. Trùng thì thêm
 * số ngắn (hoangnghiacuong2, …, rồi 3 chữ số ngẫu nhiên). Luôn qua cùng luật với
 * ô đổi tên, nên người dùng sửa lại được bất cứ lúc nào.
 */
export async function taoTenDangNhapDep(o: { fullName?: string | null; email: string; goiY?: string | null }): Promise<string> {
  const lam = (x: string | null | undefined) => String(x ?? '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd')
    .toLowerCase().replace(/[^a-z0-9._]+/g, '').replace(/[._]{2,}/g, '.')
    .replace(/^[._]+|[._]+$/g, '').slice(0, 24).replace(/[._]+$/g, '');
  const ungVien = [lam(o.goiY), lam(o.fullName), lam(o.email.split('@')[0])]
    .filter((t, i, a) => t.length >= 3 && a.indexOf(t) === i && !loiCuaTen(t));
  if (!ungVien.length) ungVien.push('ban.moi');
  const conTrong = async (t: string) => !loiCuaTen(t) && !(await prisma.user.findFirst({
    where: { username: { equals: t, mode: 'insensitive' } }, select: { id: true },
  }));
  for (const t of ungVien) if (await conTrong(t)) return t;
  const goc = ungVien[0].slice(0, 24);
  for (let n = 2; n <= 9; n++) if (await conTrong(`${goc}${n}`)) return `${goc}${n}`;
  for (let i = 0; i < 20; i++) {
    const t = `${goc}${100 + Math.floor(Math.random() * 900)}`;
    if (await conTrong(t)) return t;
  }
  return `${goc}_${Date.now().toString(36)}`; // lưới cuối, gần như không bao giờ tới
}
