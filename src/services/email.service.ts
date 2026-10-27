import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { Resend } from 'resend';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { greetingFor, renderSiteEmail, vnDateTime, type EmailBlock } from './emailLayout.js';

const resend = config.resendApiKey ? new Resend(config.resendApiKey) : null;

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
  /** Tệp đính kèm (CT Work S3b: lời mời họp .ics). `content` là base64. */
  attachments?: Array<{ filename: string; content: string; contentType?: string }>;
  /** Tên người gửi hiển thị (giữ ĐÚNG địa chỉ của RESEND_FROM_EMAIL, chỉ thay tên) — CT Work: "CT Work · CuongThai". */
  fromName?: string;
  /** Địa chỉ gửi khác (cùng tên miền đã xác minh ở Resend) — CT Work: `ctwork@cuongthai.com` (avatar riêng trong Gmail). */
  fromAddress?: string;
  /** Reply-To (CT Work: email người mời — người nhận trả lời thẳng người quen, không vào hộp noreply). */
  replyTo?: string;
  /** Header thêm (vd. X-Entity-Ref-ID để Gmail không gộp các thư mời khác nhau vào một chuỗi). */
  headers?: Record<string, string>;
}

/** Tên người gửi mặc định của web (27/10/2026: thay "CuongHoangDev"). */
export const SITE_FROM_NAME = 'CuongThai.com';

/** "Tên <a@b>" hoặc "a@b" ⇒ "Tên mới <a@b>" (bỏ ký tự có thể bẻ header). */
export function withFromName(from: string, name: string): string {
  const addr = /<([^>]+)>/.exec(from)?.[1] ?? from.trim();
  const safe = name.replace(/[\r\n"<>]/g, '').trim();
  return safe ? `"${safe}" <${addr}>` : addr;
}

/**
 * HỘP THƯ GIẢ (11/10/2026). `.env` local mang khoá Resend THẬT, nên mọi lượt test/E2E/dev trước đây gửi thư thật:
 * 10/10 một lượt chụp ảnh của agent gửi báo cáo PDF tới `giangvien@fpt.edu.vn` (may là bounce), cùng hàng chục thư
 * xác thực tới `*@e2e.local` — bounce dồn lại làm xấu uy tín tên miền gửi. Nay:
 *   - Ngoài production ⇒ KHÔNG gửi, ghi thư ra `$TMPDIR/ctw-email-sandbox/*.html` (+ log tiêu đề). Cần gửi thật từ
 *     máy local (hiếm) ⇒ `EMAIL_SANDBOX=0`.
 *   - Ở MỌI môi trường, địa chỉ thuộc tên miền dành riêng (.local/.test/.invalid/.example/example.com…) không bao giờ
 *     được gửi tới Resend — chúng chỉ có thể bounce.
 */
const RESERVED_DOMAIN = /@(?:[^@]+\.)?(?:local|localhost|test|invalid|example|example\.(?:com|net|org))$/i;
export function emailSandboxReason(to: string, env: NodeJS.ProcessEnv = process.env): string | null {
  if (RESERVED_DOMAIN.test(to.trim())) return 'reserved-domain';
  if (env.NODE_ENV !== 'production' && env.EMAIL_SANDBOX !== '0') return 'non-production';
  return null;
}
function writeSandboxEmail(payload: EmailPayload, reason: string): { success: boolean; id: string } {
  const id = `sandbox-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  try {
    const dir = path.join(os.tmpdir(), 'ctw-email-sandbox');
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, `${id}.html`), `<!-- to: ${payload.to} | subject: ${payload.subject} | reason: ${reason} -->\n${payload.html}`);
  } catch { /* chỉ là bản lưu để xem — không chặn luồng */ }
  logger.info('Email sandbox — không gửi thật', { reason, subject: payload.subject, id });
  return { success: true, id };
}

export class EmailService {
  /**
   * Send email via Resend. Returns true on success, false on failure.
   * Failures are logged but never thrown — we don't want a Resend outage
   * to block user registration/login.
   */
  async send(payload: EmailPayload): Promise<{ success: boolean; error?: string; id?: string }> {
    const sandbox = emailSandboxReason(payload.to);
    if (sandbox) return writeSandboxEmail(payload, sandbox);
    if (!resend) {
 logger.warn('RESEND_API_KEY not set — email not sent', {
 to: payload.to,
 subject: payload.subject,
 });
      return { success: false, error: 'Email service not configured' };
    }

    try {
      const result = await resend.emails.send({
        // 27/10/2026: tên người gửi LUÔN theo thương hiệu (env prod còn "CuongHoangDev <noreply@…>") — giữ địa chỉ, thay tên.
        from: withFromName(payload.fromAddress ?? config.resendFromEmail, payload.fromName ?? SITE_FROM_NAME),
        to: payload.to,
        ...(payload.replyTo ? { replyTo: payload.replyTo } : {}),
        ...(payload.headers ? { headers: payload.headers } : {}),
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
        ...(payload.attachments?.length ? { attachments: payload.attachments.map((a) => ({ filename: a.filename, content: a.content, ...(a.contentType ? { contentType: a.contentType } : {}) })) } : {}),
      });

      if (result.error) {
        logger.error('Resend error', { error: result.error.message });
        return { success: false, error: result.error.message };
      }

      // (debug log removed 2026-06-17 — was logging recipient email)
      return { success: true, id: result.data?.id };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      logger.error('Failed to send', { error: message });
      return { success: false, error: message };
    }
  }

  /**
   * Email verification template (sent right after registration).
   * Token is embedded in the verification URL — user clicks to verify.
   */
  async sendVerificationEmail(opts: {
    to: string;
    fullName?: string;
    token: string;
  }): Promise<{ success: boolean; error?: string }> {
    const verifyUrl = `${frontendBase()}/verify-email?token=${opts.token}`;
    const { subject, html, text } = buildVerificationEmail({ fullName: opts.fullName, verifyUrl });
    return this.send({ to: opts.to, subject, html, text });
  }

  /**
   * Email verification — 6-digit OTP code (sent right after registration).
   * User enters the code in the verification form, no link to click.
   */
  async sendOtpEmail(opts: {
    to: string;
    fullName?: string;
    otp: string;
    type: 'verify' | 'reset';
    ttlMinutes?: number;
  }): Promise<{ success: boolean; error?: string }> {
    const { subject, html, text } = buildOtpEmail(opts);
    return this.send({ to: opts.to, subject, html, text });
  }

  /**
   * Password reset email (link-based, kept for backward compat).
   * New users should use OTP via sendOtpEmail with type='reset'.
   */
  async sendPasswordResetEmail(opts: {
    to: string;
    fullName?: string;
    token: string;
  }): Promise<{ success: boolean; error?: string }> {
    const resetUrl = `${frontendBase()}/reset-password?token=${opts.token}`;
    const { subject, html, text } = buildPasswordResetEmail({ fullName: opts.fullName, resetUrl });
    return this.send({ to: opts.to, subject, html, text });
  }

  /**
   * Course purchase receipt — sent after VNPay IPN marks an order PAID.
   * Includes order code, amount, and a deep link to the learn page so
   * the user can start watching the course right away.
   */
  async sendCourseReceiptEmail(opts: CourseReceiptInput & { to: string }): Promise<{ success: boolean; error?: string }> {
    const { subject, html, text } = buildCourseReceiptEmail(opts);
    return this.send({ to: opts.to, subject, html, text });
  }

  /**
   * Shop order confirmation — sent after an order is marked PAID.
   * Digital orders point to the delivery on /my-orders; physical orders
   * confirm the shipping address and that the order is being prepared.
   */
  async sendShopReceiptEmail(opts: ShopReceiptInput & { to: string }): Promise<{ success: boolean; error?: string }> {
    const { subject, html, text } = buildShopReceiptEmail(opts);
    return this.send({ to: opts.to, subject, html, text });
  }

  /**
   * Course refund confirmation — sent when an admin issues a refund.
   * Includes the amount returned, the original order code, and the
   * admin's reason. We DO NOT promise a refund timeline here because
   * the actual bank transfer happens via VNPay's settlement, not from
   * our system.
   */
  async sendCourseRefundEmail(opts: CourseRefundInput & { to: string }): Promise<{ success: boolean; error?: string }> {
    const { subject, html, text } = buildCourseRefundEmail(opts);
    return this.send({ to: opts.to, subject, html, text });
  }
}

export const emailService = new EmailService();

// ─── Mẫu thư (27/10/2026) — HÀM THUẦN, dựng trên khung chung emailLayout.ts ─────────────────────────────────────────

type Built = { subject: string; html: string; text: string };

/** Gốc frontend cho link trong thư (giữ hành vi cũ: thiếu FRONTEND_URL ⇒ localhost khi dev). */
function frontendBase(): string {
  return (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/$/, '');
}
const vnd = (n: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(n);
const vnTime = vnDateTime;

export function buildVerificationEmail(o: { fullName?: string; verifyUrl: string }): Built {
  const { html, text } = renderSiteEmail({
    preheader: 'Bấm nút trong thư để kích hoạt tài khoản. Liên kết có hiệu lực 24 giờ.',
    eyebrow: 'Kích hoạt tài khoản',
    heading: 'Xác thực địa chỉ email của bạn',
    greeting: greetingFor(o.fullName),
    blocks: [
      { type: 'p', text: 'Cảm ơn bạn đã đăng ký tài khoản **CuongThai.com**. Chỉ còn một bước nữa: xác nhận đây đúng là email của bạn.' },
      { type: 'button', label: 'Xác thực email', url: o.verifyUrl },
      { type: 'callout', tone: 'info', text: 'Liên kết có hiệu lực trong **24 giờ** và chỉ dùng được một lần.' },
      { type: 'p', muted: true, text: 'Nếu bạn không đăng ký tài khoản này, cứ bỏ qua thư — sẽ không có tài khoản nào được kích hoạt.' },
    ],
    reason: 'Bạn nhận thư này vì địa chỉ email này vừa được dùng để đăng ký tài khoản trên CuongThai.com.',
  });
  return { subject: 'Xác thực email tài khoản CuongThai.com', html, text };
}

export function buildOtpEmail(o: { fullName?: string; otp: string; type: 'verify' | 'reset'; ttlMinutes?: number }): Built {
  const isVerify = o.type === 'verify';
  const ttl = o.ttlMinutes ?? (isVerify ? 5 : 10);
  const { html, text } = renderSiteEmail({
    preheader: `${isVerify ? 'Mã xác thực email' : 'Mã đặt lại mật khẩu'} của bạn là ${o.otp} — hiệu lực ${ttl} phút.`,
    eyebrow: isVerify ? 'Xác thực email' : 'Bảo mật tài khoản',
    heading: isVerify ? 'Mã xác thực email của bạn' : 'Mã đặt lại mật khẩu',
    greeting: greetingFor(o.fullName),
    blocks: [
      { type: 'p', text: isVerify
        ? 'Cảm ơn bạn đã đăng ký **CuongThai.com**. Nhập mã dưới đây vào màn hình xác thực để kích hoạt tài khoản:'
        : 'Chúng tôi vừa nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Nhập mã dưới đây để tiếp tục:' },
      { type: 'code', code: o.otp, caption: `Mã có hiệu lực trong ${ttl} phút` },
      { type: 'callout', tone: isVerify ? 'info' : 'warning', title: isVerify ? undefined : 'Lưu ý bảo mật:',
        text: 'Không chia sẻ mã này với bất kỳ ai. CuongThai.com không bao giờ hỏi mã qua tin nhắn, điện thoại hay email.' },
      { type: 'p', muted: true, text: isVerify
        ? 'Nếu bạn không đăng ký tài khoản này, cứ bỏ qua thư.'
        : 'Nếu bạn không yêu cầu đặt lại mật khẩu, cứ bỏ qua thư — mật khẩu hiện tại vẫn giữ nguyên và tài khoản của bạn vẫn an toàn.' },
    ],
    reason: isVerify
      ? 'Bạn nhận thư này vì địa chỉ email này vừa được dùng để đăng ký tài khoản trên CuongThai.com.'
      : 'Bạn nhận thư này vì có yêu cầu đặt lại mật khẩu cho tài khoản CuongThai.com gắn với email này.',
  });
  return { subject: `${isVerify ? 'Mã xác thực' : 'Mã đặt lại mật khẩu'} CuongThai.com: ${o.otp}`, html, text };
}

export function buildPasswordResetEmail(o: { fullName?: string; resetUrl: string }): Built {
  const { html, text } = renderSiteEmail({
    preheader: 'Bấm nút trong thư để tạo mật khẩu mới. Liên kết có hiệu lực 1 giờ.',
    eyebrow: 'Bảo mật tài khoản',
    heading: 'Đặt lại mật khẩu',
    greeting: greetingFor(o.fullName),
    blocks: [
      { type: 'p', text: 'Chúng tôi vừa nhận được yêu cầu đặt lại mật khẩu cho tài khoản **CuongThai.com** của bạn. Bấm nút dưới đây để tạo mật khẩu mới:' },
      { type: 'button', label: 'Tạo mật khẩu mới', url: o.resetUrl },
      { type: 'callout', tone: 'info', text: 'Liên kết có hiệu lực trong **1 giờ** và chỉ dùng được một lần.' },
      { type: 'callout', tone: 'warning', title: 'Không phải bạn?', text: 'Cứ bỏ qua thư này — mật khẩu hiện tại vẫn giữ nguyên. Nếu bạn liên tục nhận thư như thế này, hãy liên hệ hỗ trợ.' },
    ],
    reason: 'Bạn nhận thư này vì có yêu cầu đặt lại mật khẩu cho tài khoản CuongThai.com gắn với email này.',
  });
  return { subject: 'Đặt lại mật khẩu tài khoản CuongThai.com', html, text };
}

export interface CourseReceiptInput {
  fullName?: string;
  orderCode: string;
  courseTitle: string;
  courseSlug: string;
  amount: number;
  paidAt: Date;
}

export function buildCourseReceiptEmail(o: CourseReceiptInput): Built {
  const learnUrl = `${frontendBase()}/courses/${o.courseSlug}/learn`;
  const amount = vnd(o.amount);
  const paidAt = vnTime(o.paidAt);
  const { html, text } = renderSiteEmail({
    preheader: `Đơn ${o.orderCode} đã thanh toán ${amount}. Khoá học "${o.courseTitle}" đã sẵn sàng.`,
    eyebrow: 'Xác nhận thanh toán',
    heading: 'Khoá học của bạn đã sẵn sàng',
    greeting: greetingFor(o.fullName),
    blocks: [
      { type: 'p', text: `Cảm ơn bạn đã tin chọn **CuongThai.com**. Thanh toán đã được xác nhận và khoá học **${o.courseTitle.replace(/\*/g, '')}** đã được mở trong tài khoản của bạn — bạn có thể bắt đầu học ngay.` },
      { type: 'table', title: 'Chi tiết đơn hàng', rows: [
        { label: 'Khoá học', value: o.courseTitle },
        { label: 'Mã đơn hàng', value: o.orderCode, mono: true },
        { label: 'Thời gian', value: paidAt },
      ], total: { label: 'Đã thanh toán', value: amount } },
      { type: 'button', label: 'Vào học ngay', url: learnUrl },
      { type: 'p', muted: true, text: 'Hãy giữ thư này làm biên nhận. Khoá học luôn có trong mục **Khoá học của tôi** khi bạn đăng nhập.' },
    ],
    reason: 'Bạn nhận thư này vì vừa thanh toán một khoá học trên CuongThai.com.',
  });
  return { subject: `Xác nhận thanh toán khoá học ${o.courseTitle}`, html, text };
}

export interface ShopReceiptInput {
  fullName?: string;
  orderCode: string;
  orderType: string; // PHYSICAL | DIGITAL | MIXED
  items: Array<{ name: string; quantity: number; total: number }>;
  subtotal: number;
  shippingFee: number;
  total: number;
  paidAt: Date;
  shippingAddress?: string | null;
}

export function buildShopReceiptEmail(o: ShopReceiptInput): Built {
  const ordersUrl = `${frontendBase()}/my-orders`;
  const hasPhysical = o.orderType === 'PHYSICAL' || o.orderType === 'MIXED';
  const hasDigital = o.orderType === 'DIGITAL' || o.orderType === 'MIXED';
  const blocks: EmailBlock[] = [
    { type: 'p', text: `Cảm ơn bạn đã mua sắm tại **CuongThai.com**. Đơn hàng **${o.orderCode.replace(/\*/g, '')}** đã được thanh toán thành công.` },
    { type: 'table', title: 'Chi tiết đơn hàng', rows: [
      ...o.items.map((it) => ({ label: `${it.name} × ${it.quantity}`, value: vnd(it.total) })),
      { label: 'Tạm tính', value: vnd(o.subtotal) },
      ...(o.shippingFee > 0 ? [{ label: 'Phí giao hàng', value: vnd(o.shippingFee) }] : []),
      { label: 'Thời gian', value: vnTime(o.paidAt) },
    ], total: { label: 'Tổng cộng', value: vnd(o.total) } },
  ];
  if (hasDigital) blocks.push({ type: 'callout', tone: 'success', title: 'Sản phẩm số đã sẵn sàng.', text: 'Mở mục **Đơn hàng của tôi** để tải tệp, xem tài khoản/mã và hướng dẫn sử dụng.' });
  if (hasPhysical) {
    blocks.push({ type: 'callout', tone: 'info', title: 'Đang chuẩn bị hàng.', text: 'Đơn hàng đang được đóng gói. Chúng tôi sẽ cập nhật trạng thái giao hàng trong mục Đơn hàng của tôi.' });
    if (o.shippingAddress) blocks.push({ type: 'quote', caption: 'Giao tới', text: o.shippingAddress });
  }
  blocks.push({ type: 'button', label: 'Xem đơn hàng của tôi', url: ordersUrl });
  const { html, text } = renderSiteEmail({
    preheader: `Đơn ${o.orderCode} đã thanh toán ${vnd(o.total)}.${hasDigital ? ' Sản phẩm số đã sẵn sàng.' : ''}`,
    eyebrow: 'Xác nhận đơn hàng',
    heading: 'Đặt hàng thành công',
    greeting: greetingFor(o.fullName),
    blocks,
    reason: 'Bạn nhận thư này vì vừa đặt và thanh toán một đơn hàng trên CuongThai.com.',
  });
  return { subject: `Xác nhận đơn hàng ${o.orderCode} — CuongThai.com`, html, text };
}

export interface CourseRefundInput {
  fullName?: string;
  orderCode: string;
  courseTitle: string;
  refundAmount: number;
  originalAmount: number;
  reason: string;
  refundedAt: Date;
}

export function buildCourseRefundEmail(o: CourseRefundInput): Built {
  const isPartial = o.refundAmount < o.originalAmount;
  const refund = vnd(o.refundAmount);
  const { html, text } = renderSiteEmail({
    preheader: `${isPartial ? 'Hoàn một phần' : 'Hoàn tiền'} ${refund} cho đơn ${o.orderCode}.`,
    eyebrow: 'Hoàn tiền',
    heading: isPartial ? 'Đã hoàn tiền một phần' : 'Đã hoàn tiền cho đơn hàng của bạn',
    greeting: greetingFor(o.fullName),
    blocks: [
      { type: 'p', text: `Yêu cầu hoàn tiền cho khoá học **${o.courseTitle.replace(/\*/g, '')}** đã được xử lý. Thông tin chi tiết:` },
      { type: 'table', rows: [
        { label: 'Khoá học', value: o.courseTitle },
        { label: 'Mã đơn hàng', value: o.orderCode, mono: true },
        { label: 'Số tiền gốc', value: vnd(o.originalAmount) },
        { label: 'Thời gian xử lý', value: vnTime(o.refundedAt) },
      ], total: { label: 'Số tiền hoàn', value: refund } },
      { type: 'quote', caption: 'Lý do hoàn tiền', text: o.reason },
      { type: 'callout', tone: 'info', text: 'Tiền được chuyển về phương thức thanh toán ban đầu, thường trong **3–7 ngày làm việc** tuỳ ngân hàng.' },
    ],
    reason: 'Bạn nhận thư này vì một đơn hàng của bạn trên CuongThai.com vừa được hoàn tiền.',
  });
  return { subject: `${isPartial ? 'Hoàn tiền một phần' : 'Hoàn tiền'} khoá học ${o.courseTitle}`, html, text };
}
