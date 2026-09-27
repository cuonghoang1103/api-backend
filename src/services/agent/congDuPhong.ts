/**
 * ============================================================
 * CỔNG DỰ PHÒNG CHO AI CODE — modelapi.vn, CÓ MẬT KHẨU (27/09/2026)
 * ============================================================
 *
 * Người dùng chốt: *"cổng này làm cổng dự phòng khi cổng rambo.ai.vn bảo trì
 * hoặc không hoạt động thôi vì nó tính phí tiền của tôi. Khi cổng rambo hoạt
 * động trở lại thì nó sẽ tự động dùng lại model đã setup ở cổng rambo mà không
 * cần chỉnh tay."* Và: phải nhập MẬT KHẨU (admin tạo) mới được dùng.
 *
 * Nên ba luật:
 *  1. Dự phòng CHỈ chạy khi rambo đang hỏng (`ramboDangNghi()` hoặc vừa hỏng
 *     ngay trong lượt). Rambo khoẻ ⇒ đi rambo, kể cả khi app đang cầm vé dự
 *     phòng — không ai phải bấm gì để "quay về".
 *  2. Vé dự phòng = chữ ký HMAC {userId, phiên bản mật khẩu, hạn}. Admin đổi
 *     hoặc tắt mật khẩu là MỌI vé cũ chết ngay, không phải đi thu hồi từng cái.
 *  3. Model dự phòng là MỘT model cố định do máy chủ chọn (`AGENT_DU_PHONG_MODEL`),
 *     không theo lựa chọn trong app: người dùng chọn Fable ở rambo (gói trả
 *     trọn) không có nghĩa là muốn trả tiền thật cho Fable ở modelapi.
 *
 * ⚠️ ĐO THẬT 27/09/2026 — vì sao KHÔNG mặc định Claude trên modelapi:
 * cùng MỘT việc AI Code (11 bước, ~22k token mới + ~200k token đọc từ đệm),
 * `claude-opus-5` trên modelapi bị trừ 227 đơn vị trong sổ của cổng — trong
 * khi bảng giá niêm yết chỉ ra ~14. Cổng tính phần đọc-từ-đệm BẰNG GIÁ ĐẦY ĐỦ
 * và nhân hệ số nhóm `claude` ×2; vòng lặp gọi tool thì gửi lại toàn bộ ngữ
 * cảnh ở mỗi bước, nên đó đúng là phần to nhất. Admin cổng cũng xác nhận
 * "Claude trên này đắt gấp 2–3 lần GPT".
 *
 * Cùng việc đó, đo qua ĐÚNG đường dự phòng (rambo 502 thật, vé thật), sổ khoá:
 *
 *   model            sổ trừ   bước   ghi chú
 *   claude-opus-5    227,4     11    tuyến Anthropic, đệm tính giá đầy đủ ×2
 *   gpt-6-astra       98,4     41
 *   gpt-5.6-sol       66,9     38
 *   gpt-6-sol         16,4     22    ⇐ MẶC ĐỊNH: rẻ hơn opus-5 ~14 lần, trả lời
 *                                     đúng, trích file:dòng như các model kia
 *
 * ⚠️ Số bước của GPT dao động mạnh: lượt thử đầu của gpt-6-sol đi 63 bước
 * (~327k token) cho cùng câu hỏi. Nếu thấy nó lan man trên việc thật thì đó
 * là chỗ đầu tiên cần nhìn, trước khi đổi model.
 */
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';

import { prisma } from '../../config/database.js';
import { gatewayKeyFor, gatewayRoot, type LlmEndpoint } from '../llm/gateway.js';

const KHOA_MAT_KHAU = 'agent_du_phong_mat_khau';
/** Vé sống 30 ngày — đủ dài để không phải gõ lại mỗi lần rambo chập chờn. */
const HAN_VE_MS = 30 * 24 * 60 * 60 * 1000;

/** Model dự phòng mặc định. Đổi bằng env, không cần deploy. */
export function modelDuPhongAgent(): string {
  return process.env.AGENT_DU_PHONG_MODEL?.trim() || 'gpt-6-sol';
}

/** Tên hiện trong app — nói rõ là cổng tính tiền, không giả làm CuongMini. */
export function tenDuPhong(model = modelDuPhongAgent()): string {
  const ten = model
    .replace(/^gpt-/i, 'GPT ')
    .replace(/^claude-/i, 'Claude ')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return `${ten} (cổng dự phòng)`;
}

/**
 * Điểm cuối dự phòng cho một model. Giao thức theo HỌ model: `claude-*` đi
 * tuyến Anthropic (`/v1/messages`, giữ nguyên khung tool như rambo), còn lại
 * đi tuyến OpenAI. Khoá theo nhóm (`gatewayKeyFor`) — khoá nhóm claude không
 * gọi được model GPT và ngược lại (503 "No available channel").
 */
export function congDuPhong(model = modelDuPhongAgent()): LlmEndpoint | null {
  const key = gatewayKeyFor(model);
  if (!key) return null;
  return {
    root: gatewayRoot(),
    key,
    local: false,
    label: 'cong-du-phong',
    giaoThuc: /^claude-/i.test(model) ? 'anthropic' : 'openai',
  };
}

// ─── Mật khẩu (admin đặt) ───────────────────────────────────────────

async function docBam(): Promise<string | null> {
  const row = await prisma.appSetting.findUnique({ where: { key: KHOA_MAT_KHAU } });
  return row?.value || null;
}

export async function daCoMatKhau(): Promise<boolean> {
  return Boolean(await docBam());
}

/** Đặt mật khẩu mới (vé cũ chết theo), hoặc `null` để TẮT hẳn cổng dự phòng. */
export async function datMatKhauDuPhong(matKhau: string | null): Promise<void> {
  const value = matKhau ? await bcrypt.hash(matKhau, 10) : null;
  await prisma.appSetting.upsert({
    where: { key: KHOA_MAT_KHAU },
    update: { value },
    create: { key: KHOA_MAT_KHAU, value },
  });
}

// ─── Vé ─────────────────────────────────────────────────────────────

function biMat(): string {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error('JWT_SECRET chưa đặt — không ký được vé cổng dự phòng');
  return s;
}

/** Phiên bản mật khẩu = mẩu băm của chính chuỗi bcrypt. Đổi mật khẩu ⇒ đổi phiên bản. */
function phienBan(bam: string): string {
  return crypto.createHash('sha256').update(bam).digest('base64url').slice(0, 12);
}

function ky(noiDung: string): string {
  return crypto.createHmac('sha256', biMat()).update(noiDung).digest('base64url');
}

/**
 * Chống dò mật khẩu: 5 lần sai trong 15 phút là khoá người đó 15 phút. Giữ
 * trong bộ nhớ là đủ — mất khi deploy thì chỉ là được thử lại sớm hơn.
 */
const lanSai = new Map<number, { dem: number; tu: number }>();
const CUA_SO_SAI_MS = 15 * 60 * 1000;

export class MoKhoaLoi extends Error {
  constructor(message: string, public readonly code: 'CHUA_BAT' | 'SAI_MAT_KHAU' | 'THU_QUA_NHIEU') {
    super(message);
  }
}

export async function moKhoaDuPhong(userId: number, matKhau: string): Promise<{ ve: string; hetHan: string }> {
  const bam = await docBam();
  if (!bam) throw new MoKhoaLoi('Quản trị chưa bật cổng dự phòng.', 'CHUA_BAT');

  const now = Date.now();
  const sai = lanSai.get(userId);
  if (sai && now - sai.tu < CUA_SO_SAI_MS && sai.dem >= 5) {
    throw new MoKhoaLoi('Nhập sai quá nhiều lần. Thử lại sau 15 phút.', 'THU_QUA_NHIEU');
  }

  if (!matKhau || !(await bcrypt.compare(matKhau, bam))) {
    const moi = sai && now - sai.tu < CUA_SO_SAI_MS ? { dem: sai.dem + 1, tu: sai.tu } : { dem: 1, tu: now };
    lanSai.set(userId, moi);
    throw new MoKhoaLoi('Sai mật khẩu cổng dự phòng.', 'SAI_MAT_KHAU');
  }
  lanSai.delete(userId);

  const het = now + HAN_VE_MS;
  const noiDung = `${userId}.${phienBan(bam)}.${het}`;
  return { ve: `${noiDung}.${ky(noiDung)}`, hetHan: new Date(het).toISOString() };
}

/** Vé còn hiệu lực cho đúng người này, với đúng mật khẩu hiện hành? */
export async function veDuPhongHopLe(userId: number, ve: unknown): Promise<boolean> {
  if (typeof ve !== 'string' || ve.length > 200) return false;
  const phan = ve.split('.');
  if (phan.length !== 4) return false;
  const [uid, pb, het, chuKy] = phan as [string, string, string, string];
  if (Number(uid) !== userId || !(Number(het) > Date.now())) return false;

  const mong = ky(`${uid}.${pb}.${het}`);
  const a = Buffer.from(chuKy);
  const b = Buffer.from(mong);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;

  const bam = await docBam();
  return Boolean(bam) && phienBan(bam!) === pb;
}
