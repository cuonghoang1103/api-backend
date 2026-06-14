import { Resend } from 'resend';
import { config } from '../config/env.js';

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
      console.warn('[email] RESEND_API_KEY not set — email not sent. Payload:', {
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
        console.error('[email] Resend error:', result.error);
        return { success: false, error: result.error.message };
      }

      console.log(`[email] Sent "${payload.subject}" to ${payload.to} (id: ${result.data?.id})`);
      return { success: true, id: result.data?.id };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error('[email] Failed to send:', message);
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
   * Password reset email.
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
}

export const emailService = new EmailService();
