/**
 * CT Work — mảnh dùng chung cho các service.
 */

import crypto from 'node:crypto';
import { config } from '../../config/env.js';
import { deliverWorkEmail, renderWorkEmail } from './workEmail.js'; // UX-D

/** Trường công khai của một người — KHÔNG bao giờ trả email của người khác. */
export const PUBLIC_USER = {
  id: true,
  username: true,
  fullName: true,
  displayName: true,
  avatarUrl: true,
  /** CTW-28: HUMAN | AGENT — một chỗ lan ra mọi avatar/assignee/bình luận/lịch sử (UI gắn 🤖). */
  kind: true,
} as const;

export interface PublicUser {
  id: number;
  username: string;
  fullName: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  kind?: string;
}

export function displayName(u: Pick<PublicUser, 'username' | 'fullName' | 'displayName'>): string {
  return u.displayName || u.fullName || u.username;
}

export function sha256(s: string): string {
  return crypto.createHash('sha256').update(s).digest('hex');
}

/** Token ngẫu nhiên an toàn cho link mời (base64url, 32 byte). */
export function randomToken(): string {
  return crypto.randomBytes(32).toString('base64url');
}

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

export function frontendUrl(path: string): string {
  const base = (config.frontendUrl || process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * Gửi một email CT Work (tiếng Anh). Không bao giờ ném lỗi — email hỏng
 * không được làm hỏng lệnh mời/giao việc; người dùng vẫn thấy trong web.
 */
export async function sendWorkEmail(opts: {
  to: string;
  subject: string;
  heading: string;
  lines: string[];
  cta?: { label: string; url: string };
  /** Dòng thương hiệu đầu thư (mặc định "CT Work") — thư cho khách dùng "<Dự án> · Client portal". */
  brand?: string;
  /** Dòng chân thư (mặc định nói về hoạt động trong CT Work). */
  footer?: string;
  /** Tệp đính kèm, `content` base64 (lời mời họp .ics — đợt S3b). */
  attachments?: Array<{ filename: string; content: string; contentType?: string }>;
  /** UX-D: Reply-To (vd. email người mời). */
  replyTo?: string | null;
}): Promise<void> {
  // UX-D (09/10/2026): khung thư có thương hiệu (bảng, logo PNG, dark mode, chân thư đủ) — workEmail.ts.
  const { html, text } = renderWorkEmail({
    lang: 'en', heading: opts.heading, lines: opts.lines, cta: opts.cta ?? null, brand: opts.brand,
    preheader: opts.lines[0], reason: opts.footer ?? 'You received this email because of activity in CT Work.',
  });
  await deliverWorkEmail({ to: opts.to, subject: opts.subject, html, text, replyTo: opts.replyTo, attachments: opts.attachments });
}

/**
 * Cắt chuỗi tối đa `max` đơn vị UTF-16 mà KHÔNG xé đôi một cặp surrogate (emoji, ký tự ngoài BMP).
 * `str.slice(0, n)` rơi đúng giữa emoji để lại nửa surrogate lẻ ⇒ Postgres từ chối chuỗi UTF-8 hỏng ⇒ PATCH thẻ
 * trả 500 "InvalidArg" (gặp thật 09/10/2026 khi mô tả thẻ có emoji ở vị trí 470/500).
 */
export function cutText(s: string, max: number): string {
  if (s.length <= max) return s;
  let out = s.slice(0, max);
  const last = out.charCodeAt(out.length - 1);
  if (last >= 0xd800 && last <= 0xdbff) out = out.slice(0, -1);
  return out;
}

/** Chuẩn hoá chuỗi thành slug a-z0-9-. */
export function slugify(s: string, max = 50): string {
  const base = s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, max)
    .replace(/-+$/, '');
  return base || 'workspace';
}
