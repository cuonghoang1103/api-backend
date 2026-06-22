import { Resend } from 'resend';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';

const resend = config.resendApiKey ? new Resend(config.resendApiKey) : null;

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  /**
   * Send email via Resend. Returns true on success, false on failure.
   * Failures are logged but never thrown — we don't want a Resend outage
   * to block user registration/login.
   */
  async send(payload: EmailPayload): Promise<{ success: boolean; error?: string; id?: string }> {
    if (!resend) {
 logger.warn('RESEND_API_KEY not set — email not sent', {
 to: payload.to,
 subject: payload.subject,
 });
      return { success: false, error: 'Email service not configured' };
    }

    try {
      const result = await resend.emails.send({
        from: config.resendFromEmail,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
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
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const verifyUrl = `${frontendUrl}/verify-email?token=${opts.token}`;
    const greeting = opts.fullName ? `Xin chào ${opts.fullName},` : 'Xin chào,';

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #0f0f1a; color: #e2e8f0; padding: 40px 0; }
    .container { max-width: 560px; margin: 0 auto; background: #1a1b2e; border-radius: 16px; padding: 40px; }
    h1 { color: #a78bfa; font-size: 24px; margin: 0 0 16px; }
    p { color: #cbd5e1; line-height: 1.6; margin: 0 0 16px; }
    .button { display: inline-block; padding: 14px 32px; background: linear-gradient(90deg, #6366f1, #8b5cf6); color: #fff !important; text-decoration: none; border-radius: 12px; font-weight: 600; margin: 16px 0; }
    .footer { color: #64748b; font-size: 12px; margin-top: 32px; }
    .link { color: #94a3b8; word-break: break-all; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Xác thực email của bạn</h1>
    <p>${greeting}</p>
    <p>Cảm ơn bạn đã đăng ký tài khoản tại <strong>CuongHoangDev</strong>.</p>
    <p>Vui lòng click vào nút bên dưới để xác thực email — link này có hiệu lực trong <strong>24 giờ</strong>:</p>
    <p style="text-align: center; margin: 32px 0;">
      <a href="${verifyUrl}" class="button">Xác thực email ngay</a>
    </p>
    <p>Hoặc copy link này vào trình duyệt:</p>
    <p class="link">${verifyUrl}</p>
    <p>Nếu bạn không đăng ký tài khoản này, vui lòng bỏ qua email này.</p>
    <div class="footer">© ${new Date().getFullYear()} CuongHoangDev. All rights reserved.</div>
  </div>
</body>
</html>`.trim();

    return this.send({
      to: opts.to,
      subject: 'Xác thực email tài khoản CuongHoangDev',
      html,
      text: `${greeting}\n\nVui lòng truy cập link sau để xác thực email (có hiệu lực 24h):\n${verifyUrl}\n\nNếu bạn không đăng ký, vui lòng bỏ qua email này.`,
    });
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
    const greeting = opts.fullName ? `Xin chào ${opts.fullName},` : 'Xin chào,';
    const isVerify = opts.type === 'verify';
    const ttl = opts.ttlMinutes ?? (isVerify ? 5 : 10);
    const heading = isVerify ? 'Xác thực email của bạn' : 'Đặt lại mật khẩu';
    const intro = isVerify
      ? 'Cảm ơn bạn đã đăng ký tài khoản tại CuongHoangDev. Sử dụng mã bên dưới để xác thực email:'
      : 'Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Sử dụng mã bên dưới để tiếp tục:';
    const footer = isVerify
      ? 'Nếu bạn không đăng ký tài khoản này, vui lòng bỏ qua email này.'
      : 'Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này. Tài khoản của bạn vẫn an toàn.';

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #0f0f1a; color: #e2e8f0; padding: 40px 0; }
    .container { max-width: 560px; margin: 0 auto; background: #1a1b2e; border-radius: 16px; padding: 40px; }
    h1 { color: ${isVerify ? '#a78bfa' : '#f59e0b'}; font-size: 24px; margin: 0 0 16px; }
    p { color: #cbd5e1; line-height: 1.6; margin: 0 0 16px; }
    .otp-box { background: linear-gradient(135deg, #1e1b4b, #312e81); border: 1px solid #4338ca; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0; }
    .otp-code { font-size: 40px; font-weight: 800; letter-spacing: 12px; color: #c4b5fd; font-family: 'SF Mono', Monaco, Consolas, monospace; }
    .otp-ttl { color: #94a3b8; font-size: 13px; margin-top: 12px; }
    .footer { color: #64748b; font-size: 12px; margin-top: 32px; }
    .warning { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); border-radius: 8px; padding: 12px; color: #fca5a5; font-size: 14px; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>${heading}</h1>
    <p>${greeting}</p>
    <p>${intro}</p>
    <div class="otp-box">
      <div class="otp-code">${opts.otp}</div>
      <div class="otp-ttl">Mã có hiệu lực trong ${ttl} phút</div>
    </div>
    ${!isVerify ? `
    <div class="warning">
      <strong>Cảnh báo bảo mật:</strong> Không chia sẻ mã này cho bất kỳ ai. Nhân viên CuongHoangDev sẽ không bao giờ yêu cầu mã này.
    </div>` : ''}
    <p>${footer}</p>
    <div class="footer">© ${new Date().getFullYear()} CuongHoangDev. All rights reserved.</div>
  </div>
</body>
</html>`.trim();

    return this.send({
      to: opts.to,
      subject: `${heading} — Mã xác thực ${opts.otp}`,
      html,
      text: `${greeting}\n\n${isVerify ? 'Mã xác thực email' : 'Mã đặt lại mật khẩu'} của bạn: ${opts.otp}\n\nMã có hiệu lực trong ${ttl} phút.\n\n${footer}`,
    });
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
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/reset-password?token=${opts.token}`;
    const greeting = opts.fullName ? `Xin chào ${opts.fullName},` : 'Xin chào,';

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #0f0f1a; color: #e2e8f0; padding: 40px 0; }
    .container { max-width: 560px; margin: 0 auto; background: #1a1b2e; border-radius: 16px; padding: 40px; }
    h1 { color: #f59e0b; font-size: 24px; margin: 0 0 16px; }
    p { color: #cbd5e1; line-height: 1.6; margin: 0 0 16px; }
    .button { display: inline-block; padding: 14px 32px; background: linear-gradient(90deg, #f59e0b, #ef4444); color: #fff !important; text-decoration: none; border-radius: 12px; font-weight: 600; margin: 16px 0; }
    .footer { color: #64748b; font-size: 12px; margin-top: 32px; }
    .warning { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); border-radius: 8px; padding: 12px; color: #fca5a5; font-size: 14px; }
    .link { color: #94a3b8; word-break: break-all; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Đặt lại mật khẩu</h1>
    <p>${greeting}</p>
    <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Click nút bên dưới để tạo mật khẩu mới — link có hiệu lực trong <strong>1 giờ</strong>:</p>
    <p style="text-align: center; margin: 32px 0;">
      <a href="${resetUrl}" class="button">Đặt lại mật khẩu</a>
    </p>
    <p>Hoặc copy link:</p>
    <p class="link">${resetUrl}</p>
    <div class="warning">
      <strong>Cảnh báo bảo mật:</strong> Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này. Tài khoản của bạn vẫn an toàn.
    </div>
    <div class="footer">© ${new Date().getFullYear()} CuongHoangDev. All rights reserved.</div>
  </div>
</body>
</html>`.trim();

    return this.send({
      to: opts.to,
      subject: 'Đặt lại mật khẩu — CuongHoangDev',
      html,
      text: `${greeting}\n\nTruy cập link sau để đặt lại mật khẩu (có hiệu lực 1h):\n${resetUrl}\n\nNếu bạn không yêu cầu, vui lòng bỏ qua email này.`,
    });
  }

  /**
   * Course purchase receipt — sent after VNPay IPN marks an order PAID.
   * Includes order code, amount, and a deep link to the learn page so
   * the user can start watching the course right away.
   */
  async sendCourseReceiptEmail(opts: {
    to: string;
    fullName?: string;
    orderCode: string;
    courseTitle: string;
    courseSlug: string;
    amount: number;
    paidAt: Date;
  }): Promise<{ success: boolean; error?: string }> {
    const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/$/, '');
    const learnUrl = `${frontendUrl}/courses/${opts.courseSlug}/learn`;
    const greeting = opts.fullName ? `Xin chào ${opts.fullName},` : 'Xin chào,';
    const formattedAmount = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(opts.amount);
    const paidAtStr = new Intl.DateTimeFormat('vi-VN', {
      dateStyle: 'long',
      timeStyle: 'short',
    }).format(opts.paidAt);

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #0f0f1a; color: #e2e8f0; padding: 40px 0; }
    .container { max-width: 560px; margin: 0 auto; background: #1a1b2e; border-radius: 16px; padding: 40px; }
    h1 { color: #34d399; font-size: 24px; margin: 0 0 16px; }
    p { color: #cbd5e1; line-height: 1.6; margin: 0 0 16px; }
    .button { display: inline-block; padding: 14px 32px; background: linear-gradient(90deg, #10b981, #34d399); color: #fff !important; text-decoration: none; border-radius: 12px; font-weight: 600; margin: 16px 0; }
    .receipt { background: rgba(99,102,241,0.08); border: 1px solid rgba(99,102,241,0.25); border-radius: 12px; padding: 20px; margin: 24px 0; }
    .receipt-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .receipt-row:last-child { border-bottom: none; }
    .receipt-label { color: #94a3b8; font-size: 14px; }
    .receipt-value { color: #e2e8f0; font-weight: 600; font-size: 14px; }
    .footer { color: #64748b; font-size: 12px; margin-top: 32px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Thanh toán thành công!</h1>
    <p>${greeting}</p>
    <p>Cảm ơn bạn đã đăng ký khóa học tại <strong>CuongHoangDev</strong>. Đơn hàng của bạn đã được xác nhận và khóa học đã được mở khóa trong tài khoản.</p>
    <div class="receipt">
      <div class="receipt-row">
        <span class="receipt-label">Khóa học</span>
        <span class="receipt-value">${opts.courseTitle}</span>
      </div>
      <div class="receipt-row">
        <span class="receipt-label">Mã đơn hàng</span>
        <span class="receipt-value">${opts.orderCode}</span>
      </div>
      <div class="receipt-row">
        <span class="receipt-label">Số tiền</span>
        <span class="receipt-value">${formattedAmount}</span>
      </div>
      <div class="receipt-row">
        <span class="receipt-label">Thời gian</span>
        <span class="receipt-value">${paidAtStr}</span>
      </div>
    </div>
    <p style="text-align: center; margin: 32px 0;">
      <a href="${learnUrl}" class="button">Vào học ngay</a>
    </p>
    <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng phản hồi email này.</p>
    <div class="footer">© ${new Date().getFullYear()} CuongHoangDev. All rights reserved.</div>
  </div>
</body>
</html>`.trim();

    return this.send({
      to: opts.to,
      subject: `Xác nhận thanh toán — ${opts.courseTitle}`,
      html,
      text: `${greeting}\n\nCảm ơn bạn đã mua khóa học "${opts.courseTitle}".\n\nMã đơn: ${opts.orderCode}\nSố tiền: ${formattedAmount}\nThời gian: ${paidAtStr}\n\nVào học ngay: ${learnUrl}`,
    });
  }

  /**
   * Course refund confirmation — sent when an admin issues a refund.
   * Includes the amount returned, the original order code, and the
   * admin's reason. We DO NOT promise a refund timeline here because
   * the actual bank transfer happens via VNPay's settlement, not from
   * our system.
   */
  async sendCourseRefundEmail(opts: {
    to: string;
    fullName?: string;
    orderCode: string;
    courseTitle: string;
    refundAmount: number;
    originalAmount: number;
    reason: string;
    refundedAt: Date;
  }): Promise<{ success: boolean; error?: string }> {
    const greeting = opts.fullName ? `Xin chào ${opts.fullName},` : 'Xin chào,';
    const formattedRefund = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(opts.refundAmount);
    const formattedOriginal = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(opts.originalAmount);
    const isPartial = opts.refundAmount < opts.originalAmount;
    const refundedAtStr = new Intl.DateTimeFormat('vi-VN', {
      dateStyle: 'long',
      timeStyle: 'short',
    }).format(opts.refundedAt);

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #0f0f1a; color: #e2e8f0; padding: 40px 0; }
    .container { max-width: 560px; margin: 0 auto; background: #1a1b2e; border-radius: 16px; padding: 40px; }
    h1 { color: #f59e0b; font-size: 24px; margin: 0 0 16px; }
    p { color: #cbd5e1; line-height: 1.6; margin: 0 0 16px; }
    .receipt { background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.25); border-radius: 12px; padding: 20px; margin: 24px 0; }
    .receipt-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .receipt-row:last-child { border-bottom: none; }
    .receipt-label { color: #94a3b8; font-size: 14px; }
    .receipt-value { color: #e2e8f0; font-weight: 600; font-size: 14px; }
    .reason-box { background: rgba(255,255,255,0.05); border-radius: 8px; padding: 12px; font-size: 14px; color: #e2e8f0; margin: 12px 0; }
    .footer { color: #64748b; font-size: 12px; margin-top: 32px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>${isPartial ? 'Hoàn tiền một phần' : 'Hoàn tiền thành công'}</h1>
    <p>${greeting}</p>
    <p>Đơn hàng của bạn đã được admin xử lý hoàn tiền. Vui lòng kiểm tra thông tin bên dưới:</p>
    <div class="receipt">
      <div class="receipt-row">
        <span class="receipt-label">Khóa học</span>
        <span class="receipt-value">${opts.courseTitle}</span>
      </div>
      <div class="receipt-row">
        <span class="receipt-label">Mã đơn hàng</span>
        <span class="receipt-value">${opts.orderCode}</span>
      </div>
      <div class="receipt-row">
        <span class="receipt-label">Số tiền gốc</span>
        <span class="receipt-value">${formattedOriginal}</span>
      </div>
      <div class="receipt-row">
        <span class="receipt-label">Số tiền hoàn</span>
        <span class="receipt-value">${formattedRefund}</span>
      </div>
      <div class="receipt-row">
        <span class="receipt-label">Thời gian</span>
        <span class="receipt-value">${refundedAtStr}</span>
      </div>
    </div>
    <p><strong>Lý do hoàn tiền:</strong></p>
    <div class="reason-box">${opts.reason}</div>
    <p>Tiền sẽ được chuyển về phương thức thanh toán ban đầu trong vòng 3-7 ngày làm việc (tuỳ ngân hàng).</p>
    <p>Nếu bạn có thắc mắc, vui lòng phản hồi email này.</p>
    <div class="footer">© ${new Date().getFullYear()} CuongHoangDev. All rights reserved.</div>
  </div>
</body>
</html>`.trim();

    return this.send({
      to: opts.to,
      subject: `Hoàn tiền khoá học — ${opts.courseTitle}`,
      html,
      text: `${greeting}\n\nĐơn hàng "${opts.courseTitle}" đã được hoàn tiền.\n\nMã đơn: ${opts.orderCode}\nSố tiền gốc: ${formattedOriginal}\nSố tiền hoàn: ${formattedRefund}\nLý do: ${opts.reason}\nThời gian: ${refundedAtStr}\n\nTiền sẽ được chuyển về phương thức ban đầu trong 3-7 ngày làm việc.`,
    });
  }
}

export const emailService = new EmailService();
