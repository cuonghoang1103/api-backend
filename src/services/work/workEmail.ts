/**
 * CT Work UX-D (09/10/2026) — MẪU EMAIL có thương hiệu cho mọi thư CT Work + thư MỜI (song ngữ Việt/Anh).
 *
 * Người dùng sắp gửi lời mời tới email @fpt.edu.vn và sợ thư trông như thư rác/lừa đảo. Thư cũ là khung trắng, chữ
 * "CT Work" xanh, một nút và một URL trần dài. Giờ:
 *   - Bố cục BẢNG (table) — chạy được trên Gmail, Outlook (Word engine), Apple Mail; rộng 600px, co về 100% trên điện thoại.
 *   - Logo PNG phục vụ từ chính site (KHÔNG SVG — Gmail/Outlook chặn), ảnh bìa dự án JPEG (bản raster của thư viện
 *     preset ở /images/work-covers/email/<id>.jpg; ảnh người dùng tải lên vốn đã là JPEG trên R2).
 *   - Dark mode cơ bản: `color-scheme` + @media (prefers-color-scheme: dark) cho Apple Mail / Outlook.com ([data-ogsc]);
 *     Gmail tự đảo màu — nền/chữ chọn để đảo vẫn đọc được.
 *   - Chân thư: tên dịch vụ, website, lý do nhận thư, cách bỏ qua nếu nhận nhầm. Luôn có bản text/plain ĐẦY ĐỦ.
 *   - Link dự phòng hiện GỌN (cuongthai.com/work/invite/abcd…wxyz), href vẫn là link đủ.
 * Không dùng chữ IN HOA toàn bộ, không "!!!", không từ kiểu "miễn phí/khuyến mãi" — bộ lọc spam để ý những thứ đó.
 */

import { config } from '../../config/env.js';
import { emailService } from '../email.service.js';
import { logger } from '../../utils/logger.js';
import { presetIdOf } from './covers.js';

export const WORK_FROM_NAME = 'CT Work · CuongThai';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

function siteUrl(path: string): string {
  const base = (config.frontendUrl || process.env.FRONTEND_URL || 'https://cuongthai.com').replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

/** URL hiển thị gọn: bỏ giao thức, rút đoạn cuối dài (token) thành abcd…wxyz. */
export function shortLink(url: string): string {
  const bare = url.replace(/^https?:\/\//, '');
  return bare.replace(/([A-Za-z0-9_-]{6})[A-Za-z0-9_-]{8,}([A-Za-z0-9_-]{4})$/, '$1…$2');
}

/** Ảnh bìa dùng được trong email (JPEG/PNG tuyệt đối) — preset ⇒ bản raster; ảnh tải lên ⇒ giữ nguyên; còn lại ⇒ null. */
export function emailCoverUrl(coverUrl: string | null | undefined): string | null {
  const preset = presetIdOf(coverUrl);
  if (preset) return siteUrl(`/images/work-covers/email/${preset}.jpg`);
  if (coverUrl && /^https:\/\//.test(coverUrl) && !/\.(svg|webp)(\?|$)/i.test(coverUrl)) return coverUrl;
  return null;
}

/** Ảnh đại diện dùng được trong email — đường tuyệt đối https (khoá R2 trần / đường /… được nối gốc), không SVG/WebP. */
function emailAvatarUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const abs = /^https?:\/\//.test(url) ? url : url.startsWith('/') ? siteUrl(url) : config.r2.publicUrl ? `${config.r2.publicUrl.replace(/\/$/, '')}/${url}` : null;
  return abs && /^https:\/\//.test(abs) && !/\.(svg|webp)(\?|$)/i.test(abs) ? abs : null;
}

const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(-2).map((w) => w[0]!.toUpperCase()).join('') || '?';

export interface WorkEmailParts {
  lang?: 'vi' | 'en';
  /** Dòng xem trước trong hộp thư (ẩn trong thân). */
  preheader?: string;
  /** Dòng thương hiệu cạnh logo (mặc định "CT Work"). */
  brand?: string;
  hero?: { url: string | null; color?: string | null; alt: string } | null;
  person?: { name: string; avatarUrl?: string | null; caption: string } | null;
  heading: string;
  lines: string[];
  details?: Array<{ label: string; value: string }>;
  note?: string | null;
  cta?: { label: string; url: string } | null;
  /** Dòng phụ ngôn ngữ thứ hai (tiếng Anh dưới thư tiếng Việt). */
  secondary?: string[];
  /** Lý do nhận thư. */
  reason: string;
  /** Câu "nhận nhầm thì bỏ qua". */
  ignore?: string;
}

const C = { bg: '#f4f3f0', card: '#ffffff', border: '#e7e5e0', text: '#1a1a17', muted: '#5f5e58', faint: '#8a8981', accent: '#4f5bd5', soft: '#eef0fc' };
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif";

export function renderWorkEmail(p: WorkEmailParts): { html: string; text: string } {
  const vi = p.lang === 'vi';
  const logo = siteUrl('/images/ct-work/ct-work-96.png');
  const brand = p.brand ?? 'CT Work';
  const hero = p.hero
    ? p.hero.url
      ? `<tr><td style="padding:0;font-size:0;line-height:0"><img src="${esc(p.hero.url)}" width="600" alt="${esc(p.hero.alt)}" style="display:block;width:100%;max-width:600px;height:auto;border:0;border-radius:12px 12px 0 0"></td></tr>`
      : `<tr><td height="12" style="height:12px;font-size:0;line-height:0;background:${esc(p.hero.color || C.accent)};border-radius:12px 12px 0 0">&nbsp;</td></tr>`
    : '';
  const av = p.person ? emailAvatarUrl(p.person.avatarUrl) : null;
  const person = p.person
    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px"><tr>
<td width="44" valign="middle" style="width:44px">${av
        ? `<img src="${esc(av)}" width="40" height="40" alt="" style="display:block;width:40px;height:40px;border-radius:20px;border:0;object-fit:cover">`
        : `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td width="40" height="40" align="center" valign="middle" style="width:40px;height:40px;border-radius:20px;background:${C.accent};color:#ffffff;font:600 15px ${FONT}">${esc(initials(p.person.name))}</td></tr></table>`}</td>
<td valign="middle" style="padding-left:10px;font:14px/1.4 ${FONT}"><div class="tx" style="color:${C.text};font-weight:600">${esc(p.person.name)}</div><div class="mu" style="color:${C.muted};font-size:13px">${esc(p.person.caption)}</div></td>
</tr></table>`
    : '';
  const lines = p.lines.map((l) => `<p class="tx" style="margin:0 0 14px;font:15px/1.6 ${FONT};color:${C.text}">${esc(l)}</p>`).join('');
  const details = p.details?.length
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="box" style="margin:6px 0 20px;background:#faf9f7;border:1px solid ${C.border};border-radius:10px">${p.details
        .map((d, i) => `<tr><td class="mu" width="38%" style="padding:${i ? 0 : 12}px 16px ${i === p.details!.length - 1 ? 12 : 8}px;font:13px/1.5 ${FONT};color:${C.muted};vertical-align:top">${esc(d.label)}</td><td class="tx" style="padding:${i ? 0 : 12}px 16px ${i === p.details!.length - 1 ? 12 : 8}px 0;font:600 14px/1.5 ${FONT};color:${C.text};vertical-align:top">${esc(d.value)}</td></tr>`)
        .join('')}</table>`
    : '';
  const note = p.note ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 22px"><tr><td class="chip" style="padding:12px 14px;background:${C.soft};border-radius:10px;font:13px/1.55 ${FONT};color:#2f3a9e">${esc(p.note)}</td></tr></table>` : '';
  const cta = p.cta
    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 18px"><tr><td align="center" bgcolor="${C.accent}" style="border-radius:8px;background:${C.accent}">
<a href="${esc(p.cta.url)}" target="_blank" style="display:inline-block;padding:13px 26px;font:600 15px ${FONT};color:#ffffff;text-decoration:none;border-radius:8px">${esc(p.cta.label)}</a></td></tr></table>
<p class="ft" style="margin:0 0 6px;font:12px/1.6 ${FONT};color:${C.faint}">${vi ? 'Nút không bấm được? Mở liên kết này:' : "Button not working? Open this link:"} <a href="${esc(p.cta.url)}" style="color:${C.accent};text-decoration:underline">${esc(shortLink(p.cta.url))}</a></p>`
    : '';
  const secondary = p.secondary?.length
    ? `<div class="hr" style="margin-top:22px;padding-top:16px;border-top:1px solid ${C.border}">${p.secondary.map((l) => `<p class="mu" lang="en" style="margin:0 0 6px;font:13px/1.55 ${FONT};color:${C.muted}">${esc(l)}</p>`).join('')}</div>`
    : '';
  const ignore = p.ignore ?? (vi ? 'Nếu bạn không chờ thư này, cứ bỏ qua — không có gì thay đổi với tài khoản của bạn.' : "If you weren't expecting this email, you can safely ignore it.");
  const html = `<!DOCTYPE html>
<html lang="${vi ? 'vi' : 'en'}" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>${esc(p.heading)}</title>
<style>
  body{margin:0;padding:0;-webkit-text-size-adjust:100%}
  a{color:${C.accent}}
  @media (max-width:620px){ .wrap{width:100%!important} .px{padding-left:20px!important;padding-right:20px!important} }
  @media (prefers-color-scheme:dark){
    .bg{background:#0f1012!important} .card{background:#17181b!important;border-color:#2b2c31!important}
    .tx{color:#ededef!important} .mu{color:#a5a5ad!important} .ft{color:#8b8b93!important}
    .box{background:#1e1f23!important;border-color:#2b2c31!important} .hr{border-color:#2b2c31!important} .chip{background:#232641!important;color:#c7ccfb!important}
  }
  [data-ogsc] .tx{color:#ededef!important} [data-ogsc] .mu{color:#a5a5ad!important} [data-ogsb] .card{background:#17181b!important}
</style>
</head>
<body class="bg" style="margin:0;padding:0;background:${C.bg}">
${p.preheader ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:${C.bg};opacity:0">${esc(p.preheader)}${'&#8204;&nbsp;'.repeat(40)}</div>` : ''}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="bg" style="background:${C.bg}">
<tr><td align="center" style="padding:28px 12px 36px">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" class="wrap" style="width:600px;max-width:600px">
    <tr><td style="padding:0 4px 16px">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
        <td valign="middle"><img src="${esc(logo)}" width="28" height="28" alt="CT Work" style="display:block;width:28px;height:28px;border:0;border-radius:7px"></td>
        <td valign="middle" class="tx" style="padding-left:9px;font:600 15px ${FONT};color:${C.text}">${esc(brand)}<span class="mu" style="font-weight:400;color:${C.muted}">&nbsp;&nbsp;by CuongThai</span></td>
      </tr></table>
    </td></tr>
    <tr><td>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="card" style="background:${C.card};border:1px solid ${C.border};border-radius:12px">
        ${hero}
        <tr><td class="px" style="padding:30px 36px 30px">
          ${person}
          <h1 class="tx" style="margin:0 0 14px;font:700 21px/1.35 ${FONT};color:${C.text}">${esc(p.heading)}</h1>
          ${lines}${details}${note}${cta}${secondary}
        </td></tr>
      </table>
    </td></tr>
    <tr><td class="px" style="padding:20px 8px 0;font:12px/1.65 ${FONT};color:${C.faint}">
      <p class="ft" style="margin:0 0 6px">${esc(p.reason)}</p>
      <p class="ft" style="margin:0 0 6px">${esc(ignore)}</p>
      <p class="ft" style="margin:0">CT Work by CuongThai · <a href="${esc(siteUrl('/work'))}" style="color:${C.faint};text-decoration:underline">cuongthai.com</a></p>
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`;

  const text = [
    `${brand} — CuongThai`,
    '',
    ...(p.person ? [`${p.person.name} — ${p.person.caption}`, ''] : []),
    p.heading,
    '',
    ...p.lines,
    ...(p.details?.length ? ['', ...p.details.map((d) => `${d.label}: ${d.value}`)] : []),
    ...(p.note ? ['', p.note] : []),
    ...(p.cta ? ['', `${p.cta.label}:`, p.cta.url] : []),
    ...(p.secondary?.length ? ['', '---', ...p.secondary] : []),
    '',
    '--',
    p.reason,
    ignore,
    'CT Work by CuongThai · https://cuongthai.com',
  ].join('\n');
  return { html, text };
}

/** Gửi một thư CT Work đã dựng. Không bao giờ ném lỗi (email hỏng không làm hỏng lệnh mời/giao việc). */
export async function deliverWorkEmail(opts: { to: string; subject: string; html: string; text: string; replyTo?: string | null; refId?: string; attachments?: Array<{ filename: string; content: string; contentType?: string }> }): Promise<void> {
  try {
    await emailService.send({
      to: opts.to, subject: opts.subject, html: opts.html, text: opts.text, fromName: WORK_FROM_NAME,
      ...(opts.replyTo && validReplyTo(opts.replyTo) ? { replyTo: opts.replyTo } : {}),
      ...(opts.refId ? { headers: { 'X-Entity-Ref-ID': opts.refId } } : {}),
      ...(opts.attachments?.length ? { attachments: opts.attachments } : {}),
    });
  } catch (err) {
    logger.warn('[work] gửi email thất bại', { err });
  }
}

/** Reply-To chỉ nhận email người thật (không agent `@agents.invalid`, không chuỗi lạ). */
export function validReplyTo(email: string): boolean {
  return /^[^\s@<>"]+@[^\s@<>"]+\.[a-z]{2,}$/i.test(email) && !/\.invalid$/i.test(email);
}

// ─── Thư mời ──────────────────────────────────────────────────────

const ROLE_VI: Record<string, string> = {
  OWNER: 'Chủ sở hữu (Owner)', ADMIN: 'Quản trị (Admin)', MEMBER: 'Thành viên (Member)', VIEWER: 'Người xem (Viewer)',
  GUEST: 'Khách (Guest)', TEACHER: 'Giảng viên (Teacher)', CLIENT: 'Khách hàng (Client)',
};
const fmtVi = (d: Date) => d.toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', day: '2-digit', month: '2-digit', year: 'numeric' });
const fmtEn = (d: Date) => d.toLocaleDateString('en-US', { timeZone: 'Asia/Ho_Chi_Minh', month: 'short', day: 'numeric', year: 'numeric' });

export interface InviteEmailInput {
  /** INVITE: người chưa có tài khoản (link có token) · ADDED: người đã có tài khoản, đã được thêm thẳng. */
  kind: 'INVITE' | 'ADDED';
  /** Lời mời khách vào cổng khách hàng. */
  portal?: boolean;
  to: string;
  inviter: { name: string; avatarUrl?: string | null };
  workspace: string;
  project?: { name: string; coverUrl?: string | null; color?: string | null } | null;
  role: string;
  url: string;
  expiresAt?: Date | null;
}

export function buildInviteEmail(i: InviteEmailInput): { subject: string; html: string; text: string } {
  const where = i.project ? `${i.workspace} · ${i.project.name}` : i.workspace;
  const added = i.kind === 'ADDED';
  const subject = i.portal
    ? (added ? `${i.inviter.name} đã mở cổng khách hàng (client portal) của dự án ${i.project?.name ?? i.workspace} cho bạn` : `${i.inviter.name} mời bạn vào cổng khách hàng (client portal) của dự án ${i.project?.name ?? i.workspace}`)
    : (added ? `${i.inviter.name} đã thêm bạn vào ${where} trên CT Work` : `${i.inviter.name} mời bạn tham gia ${where} trên CT Work`);
  const heading = i.portal
    ? `Cổng khách hàng · ${i.project?.name ?? i.workspace}`
    : added ? `Bạn đã được thêm vào ${where}` : `Tham gia ${where} trên CT Work`;
  const lines = i.portal
    ? [
        `${i.inviter.name} ${added ? 'đã cấp cho bạn quyền vào' : 'mời bạn vào'} cổng khách hàng của dự án "${i.project?.name ?? i.workspace}" do ${i.workspace} thực hiện.`,
        'Ở đó bạn theo dõi tiến độ theo từng giai đoạn, gửi yêu cầu và góp ý, duyệt sản phẩm bàn giao và tải tài liệu.',
      ]
    : [
        added
          ? `${i.inviter.name} đã thêm bạn vào ${i.project ? `dự án "${i.project.name}" trong ` : ''}không gian làm việc "${i.workspace}" trên CT Work — công cụ quản lý dự án (board, backlog, sprint, tài liệu) nhóm đang dùng.`
          : `${i.inviter.name} mời bạn cùng làm ${i.project ? `dự án "${i.project.name}" trong ` : ''}không gian làm việc "${i.workspace}" trên CT Work — công cụ quản lý dự án (board, backlog, sprint, tài liệu) nhóm đang dùng.`,
      ];
  const details = [
    { label: 'Không gian (workspace)', value: i.workspace },
    ...(i.project ? [{ label: 'Dự án (project)', value: i.project.name }] : []),
    { label: 'Vai trò (role)', value: ROLE_VI[i.role] ?? i.role },
    ...(!added && i.expiresAt ? [{ label: 'Hạn lời mời (expires)', value: `${fmtVi(i.expiresAt)}` }] : []),
  ];
  const note = added
    ? `Bạn đăng nhập bằng email ${i.to} là thấy ngay ${i.portal ? 'cổng khách hàng' : 'không gian này'} — không cần làm gì thêm.`
    : `Hãy đăng ký hoặc đăng nhập bằng đúng email ${i.to}: lời mời chỉ dùng được với địa chỉ này. Chưa có tài khoản thì tạo mới mất khoảng một phút.`;
  const cta = { label: added ? (i.portal ? 'Mở cổng khách hàng' : 'Mở không gian làm việc') : 'Chấp nhận lời mời', url: i.url };
  const secondary = i.portal
    ? [added ? `${i.inviter.name} gave you access to the client portal for "${i.project?.name ?? i.workspace}".` : `${i.inviter.name} invited you to the client portal for "${i.project?.name ?? i.workspace}".`,
       added ? `Sign in with ${i.to} to open it.` : `Sign up or sign in with ${i.to} and click "Chấp nhận lời mời" (Accept invitation).${i.expiresAt ? ` The invitation expires on ${fmtEn(i.expiresAt)}.` : ''}`]
    : [added ? `${i.inviter.name} added you to ${where} on CT Work.` : `${i.inviter.name} invited you to join ${where} on CT Work.`,
       added ? `Sign in with ${i.to} to open it.` : `Sign up or sign in with ${i.to} and click "Chấp nhận lời mời" (Accept invitation).${i.expiresAt ? ` The invitation expires on ${fmtEn(i.expiresAt)}.` : ''}`];
  const { html, text } = renderWorkEmail({
    lang: 'vi',
    preheader: added ? `Bạn đã có quyền vào ${where}.` : `${i.inviter.name} mời bạn cùng làm ${where}. Lời mời${i.expiresAt ? ` có hạn đến ${fmtVi(i.expiresAt)}` : ''}.`,
    brand: i.portal ? `${i.project?.name ?? i.workspace} · Cổng khách hàng` : 'CT Work',
    hero: i.project ? { url: emailCoverUrl(i.project.coverUrl), color: i.project.color, alt: `Ảnh bìa dự án ${i.project.name}` } : { url: null, color: '#4f5bd5', alt: '' },
    person: { name: i.inviter.name, avatarUrl: i.inviter.avatarUrl, caption: added ? 'đã thêm bạn vào nhóm' : 'đã mời bạn tham gia' },
    heading, lines, details, note, cta, secondary,
    reason: `Bạn nhận thư này vì ${i.inviter.name} đã nhập địa chỉ ${i.to} khi ${added ? 'thêm thành viên' : 'gửi lời mời'} trên CT Work (cuongthai.com).`,
    ignore: added
      ? 'Nếu bạn không quen người này, cứ bỏ qua thư — bạn có thể rời không gian bất cứ lúc nào trong phần cài đặt.'
      : 'Nếu bạn không quen người này hoặc nhận nhầm, cứ bỏ qua thư — lời mời tự hết hạn, không có tài khoản nào được tạo.',
  });
  return { subject, html, text };
}
