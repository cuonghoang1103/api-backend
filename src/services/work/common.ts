/**
 * CT Work — mảnh dùng chung cho các service.
 */

import crypto from 'node:crypto';
import { config } from '../../config/env.js';
import { emailService } from '../email.service.js';
import { logger } from '../../utils/logger.js';

/** Trường công khai của một người — KHÔNG bao giờ trả email của người khác. */
export const PUBLIC_USER = {
  id: true,
  username: true,
  fullName: true,
  displayName: true,
  avatarUrl: true,
} as const;

export interface PublicUser {
  id: number;
  username: string;
  fullName: string | null;
  displayName: string | null;
  avatarUrl: string | null;
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
}): Promise<void> {
  const body = opts.lines.map((l) => `<p>${escapeHtml(l)}</p>`).join('\n');
  const cta = opts.cta
    ? `<p style="margin:28px 0"><a href="${escapeHtml(opts.cta.url)}" style="display:inline-block;padding:12px 24px;background:#2563eb;color:#fff;text-decoration:none;border-radius:8px;font-weight:600">${escapeHtml(opts.cta.label)}</a></p>
       <p style="color:#64748b;font-size:12px;word-break:break-all">${escapeHtml(opts.cta.url)}</p>`
    : '';
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f8fafc;color:#0f172a;padding:32px 0">
  <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:32px">
    <div style="font-weight:700;color:#2563eb;margin-bottom:16px">CT Work</div>
    <h1 style="font-size:20px;margin:0 0 16px">${escapeHtml(opts.heading)}</h1>
    ${body}
    ${cta}
    <p style="color:#94a3b8;font-size:12px;margin-top:32px">You received this email because of activity in CT Work.</p>
  </div>
</body></html>`;
  const text = [opts.heading, '', ...opts.lines, ...(opts.cta ? ['', `${opts.cta.label}: ${opts.cta.url}`] : [])].join('\n');
  try {
    await emailService.send({ to: opts.to, subject: opts.subject, html, text });
  } catch (err) {
    logger.warn('[work] gửi email thất bại', { err });
  }
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
