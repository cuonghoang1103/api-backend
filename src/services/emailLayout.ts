/**
 * KHUNG THƯ CHUNG của CuongThai.com (27/10/2026) — mọi thư giao dịch của web (xác thực, OTP, đặt lại mật khẩu, hoá đơn,
 * hoàn tiền, nhắc học, thư cho quản trị) dựng qua đây để trông như MỘT sản phẩm.
 *
 * Vì sao viết tay, không dùng thư viện:
 *   - Bố cục BẢNG + style INLINE — Gmail bỏ <style> ở nhiều chế độ, Outlook (máy Word) không hiểu flex/div bo góc.
 *     `<style>` chỉ còn cho phần "tốt thì có": thu gọn trên điện thoại + chế độ tối (Apple Mail, Outlook.com).
 *   - Nút "chống đạn": ô bảng có bgcolor + <a> đệm — Outlook vẫn hiện nút có nền.
 *   - Logo PNG tuyệt đối (https://cuongthai.com/favicon.png) — không SVG (Gmail/Outlook chặn), không đường tương đối.
 *   - Mỗi thư luôn có bản text/plain ĐẦY ĐỦ (bộ lọc thư rác trừ điểm thư chỉ có HTML; trình đọc màn hình đọc bản chữ).
 *   - MỌI dữ liệu người dùng được escape ở đây — nơi gọi truyền chuỗi thô, không tự ghép HTML.
 *
 * Định dạng chữ tối giản trong đoạn văn: `**đậm**` và `` `mã` `` (áp SAU khi escape nên không mở đường chèn HTML).
 */
import { config } from '../config/env.js';

export const SITE_NAME = 'CuongThai.com';
/** Logo panda (favicon) — luôn là bản trên production: ảnh trong thư được máy chủ thư tải, không với tới localhost. */
export const SITE_LOGO_URL = 'https://cuongthai.com/favicon.png';

/** Gốc frontend tuyệt đối cho link trong thư (FRONTEND_URL; thiếu ⇒ production). */
export function siteUrl(path = '/'): string {
  const base = (config.frontendUrl || process.env.FRONTEND_URL || 'https://cuongthai.com').replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

export function escapeEmail(s: unknown): string {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

/** "Xin chào Cường," / "Xin chào," — dùng chung cho mọi thư gửi người dùng. */
export function greetingFor(name?: string | null): string {
  const n = (name ?? '').trim();
  return n ? `Xin chào ${n},` : 'Xin chào,';
}

/** "21:00, 27/10/2026" (giờ Việt Nam) — một định dạng ngày giờ cho mọi thư. */
export function vnDateTime(d: Date): string {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Ho_Chi_Minh', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(d).map((p) => [p.type, p.value]));
  return `${parts.hour}:${parts.minute}, ${parts.day}/${parts.month}/${parts.year}`;
}

/** Link hiển thị gọn: bỏ giao thức, rút token dài cuối đường (abcdef…wxyz); href vẫn là link đủ. */
export function displayLink(url: string): string {
  const bare = url.replace(/^https?:\/\//, '');
  return bare.replace(/([A-Za-z0-9_-]{6})[A-Za-z0-9_-]{14,}([A-Za-z0-9_-]{4})(?=$|&)/g, '$1…$2');
}

export type CalloutTone = 'info' | 'warning' | 'success' | 'danger';

export type EmailBlock =
  /** Đoạn văn (hỗ trợ **đậm** và `mã`). */
  | { type: 'p'; text: string; muted?: boolean }
  /** Ô mã lớn (OTP). */
  | { type: 'code'; code: string; caption?: string }
  /** Nút chính + dòng "Nút không bấm được?" (mặc định có). */
  | { type: 'button'; label: string; url: string; fallback?: boolean }
  /** Hộp nhấn mạnh: thông tin / cảnh báo / thành công. */
  | { type: 'callout'; tone: CalloutTone; title?: string; text: string }
  /** Bảng nhãn – giá trị (hoá đơn, chi tiết). `total` là dòng tổng in đậm cuối bảng. */
  | { type: 'table'; title?: string; rows: Array<{ label: string; value: string; mono?: boolean }>; total?: { label: string; value: string } }
  /** Trích dẫn (lý do, đoạn xem trước). */
  | { type: 'quote'; text: string; caption?: string }
  /** Danh sách gạch đầu dòng ngắn. */
  | { type: 'list'; items: string[] }
  /** Đường kẻ ngang. */
  | { type: 'divider' };

export interface SiteEmail {
  /** Dòng xem trước trong hộp thư (ẩn trong thân). */
  preheader?: string;
  /** Nhãn nhỏ phía trên tiêu đề (vd "Bảo mật tài khoản", "Hoá đơn"). */
  eyebrow?: string;
  heading: string;
  /** "Xin chào …," — null ⇒ không có dòng chào (thư cho quản trị). */
  greeting?: string | null;
  blocks: EmailBlock[];
  /** Vì sao người nhận có thư này (chân thư). */
  reason: string;
  /** Dòng kết thân thư (mặc định "Thân mến, / Đội ngũ CuongThai.com"); null ⇒ bỏ. */
  signoff?: string | null;
  lang?: 'vi' | 'en';
}

const C = {
  bg: '#f4f3f8', card: '#ffffff', border: '#e7e5ef', text: '#1c1b22', muted: '#5e5b6b', faint: '#8d8a99',
  accent: '#6d3fd9', accentText: '#ffffff', soft: '#f6f4fd', codeBg: '#f3f0fe', codeBorder: '#ddd3fb', codeText: '#3d1f99',
};
const TONE: Record<CalloutTone, { bg: string; border: string; text: string; cls: string }> = {
  info: { bg: '#eef3ff', border: '#cfdcfb', text: '#21396f', cls: 'c-info' },
  warning: { bg: '#fff7e8', border: '#f6dfae', text: '#6b4a07', cls: 'c-warn' },
  success: { bg: '#ecf8f1', border: '#c4e8d3', text: '#14532d', cls: 'c-ok' },
  danger: { bg: '#fdeeee', border: '#f5cccc', text: '#7a1d1d', cls: 'c-bad' },
};
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif";
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,'Liberation Mono',monospace";

/** escape rồi mới áp **đậm** / `mã` — chuỗi người dùng không thể chèn thẻ. */
export function richText(s: string, codeColor = C.codeText): string {
  return escapeEmail(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, `<code class="cd" style="font-family:${MONO};font-size:13px;background:${C.codeBg};color:${codeColor};padding:1px 5px;border-radius:4px">$1</code>`);
}
/** Bản chữ trơn của richText. */
export function plainText(s: string): string {
  return s.replace(/\*\*(.+?)\*\*/g, '$1').replace(/`([^`]+)`/g, '$1');
}

function blockHtml(b: EmailBlock, vi: boolean): string {
  switch (b.type) {
    case 'p':
      return `<p class="${b.muted ? 'mu' : 'tx'}" style="margin:0 0 16px;font:${b.muted ? '14px/1.6' : '15px/1.65'} ${FONT};color:${b.muted ? C.muted : C.text}">${richText(b.text)}</p>`;
    case 'code':
      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 20px"><tr><td align="center" class="codebox" style="padding:22px 16px 18px;background:${C.codeBg};border:1px solid ${C.codeBorder};border-radius:12px">
<div class="codetx" style="font:700 34px/1.2 ${MONO};letter-spacing:10px;color:${C.codeText};padding-left:10px">${escapeEmail(b.code)}</div>
${b.caption ? `<div class="mu" style="margin-top:10px;font:13px/1.5 ${FONT};color:${C.muted}">${escapeEmail(b.caption)}</div>` : ''}
</td></tr></table>`;
    case 'button': {
      const href = escapeEmail(b.url);
      const fb = b.fallback === false ? '' : `<p class="ft" style="margin:0 0 18px;font:12px/1.6 ${FONT};color:${C.faint}">${vi ? 'Nút không bấm được? Mở liên kết:' : 'Button not working? Open this link:'}<br><a href="${href}" target="_blank" style="color:${C.accent};text-decoration:underline;word-break:break-all">${escapeEmail(displayLink(b.url))}</a></p>`;
      return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:6px 0 14px"><tr><td align="center" bgcolor="${C.accent}" style="border-radius:10px;background:${C.accent}">
<a href="${href}" target="_blank" style="display:inline-block;padding:13px 28px;font:600 15px/1.2 ${FONT};color:${C.accentText};text-decoration:none;border-radius:10px">${escapeEmail(b.label)}</a>
</td></tr></table>${fb}`;
    }
    case 'callout': {
      const t = TONE[b.tone];
      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 18px"><tr><td class="${t.cls}" style="padding:13px 16px;background:${t.bg};border:1px solid ${t.border};border-radius:10px;font:14px/1.6 ${FONT};color:${t.text}">${b.title ? `<strong>${escapeEmail(b.title)}</strong> ` : ''}${richText(b.text, t.text)}</td></tr></table>`;
    }
    case 'table': {
      const rows = b.rows.map((r, i) => `<tr>
<td class="mu rw" valign="top" style="padding:10px 0;${i ? `border-top:1px solid ${C.border};` : ''}font:14px/1.5 ${FONT};color:${C.muted}">${escapeEmail(r.label)}</td>
<td class="tx rw" valign="top" align="right" style="padding:10px 0 10px 12px;${i ? `border-top:1px solid ${C.border};` : ''}font:600 14px/1.5 ${r.mono ? MONO : FONT};color:${C.text};word-break:break-word">${escapeEmail(r.value)}</td>
</tr>`).join('');
      const total = b.total ? `<tr>
<td class="tx tt" style="padding:12px 0 2px;border-top:2px solid ${C.text};font:700 15px/1.5 ${FONT};color:${C.text}">${escapeEmail(b.total.label)}</td>
<td class="tx tt" align="right" style="padding:12px 0 2px 12px;border-top:2px solid ${C.text};font:700 16px/1.5 ${FONT};color:${C.text}">${escapeEmail(b.total.value)}</td>
</tr>` : '';
      return `${b.title ? `<p class="mu" style="margin:6px 0 6px;font:600 12px/1.4 ${FONT};letter-spacing:.06em;text-transform:uppercase;color:${C.faint}">${escapeEmail(b.title)}</p>` : ''}<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="box" style="margin:0 0 20px;background:${C.soft};border:1px solid ${C.border};border-radius:12px"><tr><td style="padding:6px 18px 10px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${rows}${total}</table>
</td></tr></table>`;
    }
    case 'quote':
      return `${b.caption ? `<p class="mu" style="margin:0 0 6px;font:13px/1.5 ${FONT};color:${C.muted}">${escapeEmail(b.caption)}</p>` : ''}<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 18px"><tr><td class="qt" style="padding:10px 14px;border-left:3px solid ${C.codeBorder};background:${C.soft};border-radius:0 8px 8px 0;font:14px/1.6 ${FONT};color:${C.text};white-space:pre-line">${escapeEmail(b.text)}</td></tr></table>`;
    case 'list':
      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 16px">${b.items.map((it) => `<tr><td valign="top" width="18" class="mu" style="width:18px;padding:2px 0;font:15px/1.6 ${FONT};color:${C.accent}">•</td><td class="tx" style="padding:2px 0;font:15px/1.6 ${FONT};color:${C.text}">${richText(it)}</td></tr>`).join('')}</table>`;
    case 'divider':
      return `<div class="hr" style="height:1px;line-height:1px;font-size:0;background:${C.border};margin:6px 0 20px">&nbsp;</div>`;
  }
}

function blockText(b: EmailBlock): string[] {
  switch (b.type) {
    case 'p': return [plainText(b.text), ''];
    case 'code': return [`    ${b.code}`, ...(b.caption ? [b.caption] : []), ''];
    case 'button': return [`${b.label}:`, b.url, ''];
    case 'callout': return [`${b.title ? `${b.title} ` : ''}${plainText(b.text)}`, ''];
    case 'table': {
      const rows = b.rows.map((r) => `${r.label}: ${r.value}`);
      return [...(b.title ? [b.title] : []), ...rows, ...(b.total ? [`${b.total.label}: ${b.total.value}`] : []), ''];
    }
    case 'quote': return [...(b.caption ? [b.caption] : []), ...b.text.split('\n').map((l) => `> ${l}`), ''];
    case 'list': return [...b.items.map((i) => `- ${plainText(i)}`), ''];
    case 'divider': return ['---', ''];
  }
}

export function renderSiteEmail(e: SiteEmail): { html: string; text: string } {
  const vi = e.lang !== 'en';
  const year = new Date().getFullYear();
  const home = siteUrl('/');
  const support = siteUrl('/#contact');
  const signoff = e.signoff === undefined ? (vi ? 'Thân mến,\nĐội ngũ CuongThai.com' : 'Best,\nThe CuongThai.com team') : e.signoff;
  const greeting = e.greeting ? `<p class="tx" style="margin:0 0 16px;font:15px/1.65 ${FONT};color:${C.text}">${escapeEmail(e.greeting)}</p>` : '';
  const body = e.blocks.map((b) => blockHtml(b, vi)).join('\n');
  const sign = signoff ? `<p class="tx" style="margin:22px 0 0;font:15px/1.65 ${FONT};color:${C.text};white-space:pre-line">${escapeEmail(signoff)}</p>` : '';
  const html = `<!DOCTYPE html>
<html lang="${vi ? 'vi' : 'en'}" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>${escapeEmail(e.heading)}</title>
<style>
  body{margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}
  a{color:${C.accent}}
  @media (max-width:600px){ .wrap{width:100%!important} .px{padding-left:22px!important;padding-right:22px!important} .codetx{font-size:28px!important;letter-spacing:7px!important} }
  @media (prefers-color-scheme:dark){
    .bg{background:#101014!important} .card{background:#19191f!important;border-color:#2c2b35!important}
    .tx{color:#ececf1!important} .mu{color:#a9a7b5!important} .ft{color:#8e8c9a!important} .ey{color:#b9a4ff!important}
    .box{background:#202028!important;border-color:#2c2b35!important} .hr{background:#2c2b35!important}
    .rw{border-color:#2c2b35!important} .tt{border-color:#5b5868!important}
    .codebox{background:#231c3d!important;border-color:#3d3270!important} .codetx{color:#d4c6ff!important} .cd{background:#2a2442!important;color:#d4c6ff!important}
    .qt{background:#202028!important;color:#ececf1!important}
    .c-info{background:#18223b!important;border-color:#2b3c66!important;color:#c9d8ff!important}
    .c-warn{background:#2e2511!important;border-color:#5a4718!important;color:#f6dfa4!important}
    .c-ok{background:#122a1d!important;border-color:#1f4d33!important;color:#b9ecce!important}
    .c-bad{background:#311718!important;border-color:#5c2627!important;color:#f7c4c4!important}
  }
  [data-ogsc] .tx{color:#ececf1!important} [data-ogsc] .mu{color:#a9a7b5!important} [data-ogsb] .card{background:#19191f!important}
</style>
</head>
<body class="bg" style="margin:0;padding:0;background:${C.bg}">
${e.preheader ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:${C.bg};opacity:0">${escapeEmail(e.preheader)}${'&#8204;&nbsp;'.repeat(60)}</div>` : ''}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="bg" style="background:${C.bg}">
<tr><td align="center" style="padding:28px 12px 36px">
  <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" class="wrap" style="width:560px;max-width:560px">
    <tr><td style="padding:0 4px 16px">
      <a href="${escapeEmail(home)}" target="_blank" style="text-decoration:none">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
        <td valign="middle"><img src="${SITE_LOGO_URL}" width="32" height="32" alt="CuongThai.com" style="display:block;width:32px;height:32px;border:0;border-radius:8px"></td>
        <td valign="middle" class="tx" style="padding-left:10px;font:700 16px ${FONT};color:${C.text};letter-spacing:-.01em">CuongThai<span style="color:${C.accent}">.com</span></td>
      </tr></table>
      </a>
    </td></tr>
    <tr><td>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="card" style="background:${C.card};border:1px solid ${C.border};border-radius:16px">
        <tr><td height="4" style="height:4px;font-size:0;line-height:0;background:${C.accent};border-radius:16px 16px 0 0">&nbsp;</td></tr>
        <tr><td class="px" style="padding:30px 36px 32px">
          ${e.eyebrow ? `<p class="ey" style="margin:0 0 8px;font:600 12px/1.4 ${FONT};letter-spacing:.06em;text-transform:uppercase;color:${C.accent}">${escapeEmail(e.eyebrow)}</p>` : ''}
          <h1 class="tx" style="margin:0 0 18px;font:700 22px/1.35 ${FONT};color:${C.text};letter-spacing:-.01em">${escapeEmail(e.heading)}</h1>
          ${greeting}
          ${body}
          ${sign}
        </td></tr>
      </table>
    </td></tr>
    <tr><td class="px" style="padding:22px 10px 0;font:12px/1.65 ${FONT};color:${C.faint}">
      <p class="ft" style="margin:0 0 6px">${escapeEmail(e.reason)}</p>
      <p class="ft" style="margin:0 0 6px">${vi ? 'Cần hỗ trợ?' : 'Need help?'} <a href="${escapeEmail(support)}" target="_blank" style="color:${C.faint};text-decoration:underline">${vi ? 'Liên hệ CuongThai.com' : 'Contact CuongThai.com'}</a> · ${vi ? 'Thư gửi tự động, vui lòng không trả lời thư này.' : 'This is an automated email — please do not reply.'}</p>
      <p class="ft" style="margin:0">© ${year} CuongThai.com · <a href="${escapeEmail(home)}" target="_blank" style="color:${C.faint};text-decoration:underline">cuongthai.com</a></p>
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`;

  const text = [
    'CuongThai.com',
    '',
    e.heading,
    '',
    ...(e.greeting ? [e.greeting, ''] : []),
    ...e.blocks.flatMap((b) => blockText(b)),
    ...(signoff ? [signoff, ''] : []),
    '--',
    e.reason,
    `${vi ? 'Cần hỗ trợ? Liên hệ' : 'Need help? Contact us'}: ${support}`,
    `© ${year} CuongThai.com · ${home}`,
  ].join('\n').replace(/\n{3,}/g, '\n\n');
  return { html, text };
}
