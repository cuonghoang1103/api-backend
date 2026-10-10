/**
 * CT Work — CTW đợt 8b: luật THUẦN của Slack (không DB, không mạng) — test ở ctw8b.test.ts.
 *
 *   - Chữ ký yêu cầu Slack (v0): `X-Slack-Signature = "v0=" + hex(HMAC_SHA256(signingSecret, "v0:" + ts + ":" + rawBody))`,
 *     `X-Slack-Request-Timestamp` lệch quá 5 phút ⇒ từ chối (chống phát lại); so bằng timingSafeEqual. Ngoài cửa sổ thời
 *     gian, service còn ghi "nonce" (băm chữ ký) vào work_ext_nonces ⇒ gửi lại ĐÚNG gói cũ trong 5 phút cũng bị chặn.
 *   - Slash command `/ctwork new <tiêu đề> [| chi tiết]` ⇒ đề xuất thẻ (đi qua hộp đề xuất chờ duyệt của 7b, KHÔNG tạo thẻ thẳng).
 *   - Tin thông báo dự án (Block Kit) + unfurl link thẻ CT Work. Chữ người dùng luôn thoát & < > (luật mrkdwn của Slack) ⇒
 *     tiêu đề "<!channel>" không ping cả kênh.
 */

import crypto from 'node:crypto';

export const SLACK_REPLAY_WINDOW_S = 5 * 60;

export function slackSign(signingSecret: string, timestamp: string, body: string | Buffer): string {
  return `v0=${crypto.createHmac('sha256', signingSecret).update(`v0:${timestamp}:`).update(body).digest('hex')}`;
}

export type SlackVerify = { ok: true; nonce: string } | { ok: false; reason: 'MISSING' | 'BAD_SIGNATURE' | 'STALE' };

export function verifySlack(signingSecret: string, headers: { signature?: string; timestamp?: string }, body: Buffer, nowMs = Date.now()): SlackVerify {
  const { signature, timestamp } = headers;
  if (!signingSecret || !signature || !timestamp) return { ok: false, reason: 'MISSING' };
  if (!/^\d{9,11}$/.test(timestamp) || Math.abs(nowMs / 1000 - Number(timestamp)) > SLACK_REPLAY_WINDOW_S) return { ok: false, reason: 'STALE' };
  if (!/^v0=[0-9a-f]{64}$/.test(signature)) return { ok: false, reason: 'BAD_SIGNATURE' };
  const want = Buffer.from(slackSign(signingSecret, timestamp, body));
  const got = Buffer.from(signature);
  if (want.length !== got.length || !crypto.timingSafeEqual(want, got)) return { ok: false, reason: 'BAD_SIGNATURE' };
  return { ok: true, nonce: `slack:${crypto.createHash('sha256').update(signature).digest('hex').slice(0, 40)}` };
}

/** Thân form-urlencoded của slash command ⇒ object chữ. */
export function parseForm(body: Buffer | string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of new URLSearchParams(Buffer.isBuffer(body) ? body.toString('utf8') : body)) out[k] = v;
  return out;
}

export type SlashCommand =
  | { kind: 'new'; title: string; details: string | null }
  | { kind: 'help' }
  | { kind: 'unknown'; text: string };

/** "/ctwork new Sửa lỗi đăng nhập | bấm Đăng nhập không có gì xảy ra" — "|" hoặc xuống dòng tách tiêu đề với chi tiết. */
export function parseSlash(text: string | undefined): SlashCommand {
  const t = (text ?? '').replace(/\r\n/g, '\n').trim();
  if (!t || /^(help|\?|trợ giúp)$/i.test(t)) return { kind: 'help' };
  const m = /^(new|add|tạo|tao)\b\s*([\s\S]*)$/i.exec(t);
  if (!m) return { kind: 'unknown', text: t.slice(0, 100) };
  const rest = m[2].trim();
  if (!rest) return { kind: 'help' };
  const cut = rest.search(/\s\|\s|\n/);
  const title = (cut >= 0 ? rest.slice(0, cut) : rest).replace(/^\|/, '').trim().slice(0, 255);
  const details = cut >= 0 ? rest.slice(cut).replace(/^\s*\|\s*/, '').trim().slice(0, 4000) : '';
  if (!title) return { kind: 'help' };
  return { kind: 'new', title, details: details || null };
}

export const SLASH_USAGE = 'Usage: `/ctwork new <short summary> | <optional details>` — it becomes a proposal the team reviews in CT Work (Intake).';

/** Thoát chữ cho mrkdwn của Slack (& < >) — chặn <!channel>, <@U…>, link giả. */
export const slackEsc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export interface SlackNotice { title: string; text?: string | null; url: string; footer: string }

/** Tin thông báo dự án: section (tiêu đề có link + mô tả) + context (dự án · loại · trạng thái). */
export function slackNoticeBlocks(m: SlackNotice) {
  const title = slackEsc(m.title.slice(0, 250));
  const body = m.text ? `\n${slackEsc(m.text.slice(0, 1500))}` : '';
  return {
    text: `${m.title.slice(0, 250)}${m.text ? ` — ${m.text.slice(0, 300)}` : ''}`,
    blocks: [
      { type: 'section', text: { type: 'mrkdwn', text: `*<${m.url}|${title}>*${body}` } },
      { type: 'context', elements: [{ type: 'mrkdwn', text: slackEsc(m.footer.slice(0, 300)) }] },
    ],
    unfurl_links: false,
    unfurl_media: false,
  };
}

/**
 * Link CT Work cần unfurl: `https://<host>/work/<ws>/<KEY>/issue/<n>` (cả `?issue=<n>` trên board/list/backlog).
 * Trả null với link khác (trang chủ, Docs…) — chỉ thẻ mới có nội dung đáng xem trước.
 */
export function parseIssueLink(url: string, allowedHosts: string[]): { ws: string; key: string; number: number } | null {
  let u: URL;
  try { u = new URL(url); } catch { return null; }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
  if (!allowedHosts.includes(u.hostname.toLowerCase())) return null;
  const m = /^\/work\/([a-z0-9-]{1,80})\/([A-Z][A-Z0-9]{0,9})(?:\/(issue)\/(\d{1,9})|\/(board|list|backlog))\/?$/.exec(u.pathname);
  if (!m) return null;
  const n = m[3] ? Number(m[4]) : Number(u.searchParams.get('issue'));
  if (!Number.isInteger(n) || n <= 0) return null;
  return { ws: m[1], key: m[2], number: n };
}

export interface UnfurlIssue { key: string; title: string; status: string; type: string; assignee: string | null; priority: string | null; project: string; due: string | null }

export function issueUnfurl(i: UnfurlIssue) {
  const fields = [`*Status:* ${slackEsc(i.status)}`, `*Type:* ${slackEsc(i.type)}`, `*Assignee:* ${slackEsc(i.assignee ?? 'Unassigned')}`];
  if (i.priority) fields.push(`*Priority:* ${slackEsc(i.priority)}`);
  if (i.due) fields.push(`*Due:* ${i.due}`);
  return {
    blocks: [
      { type: 'section', text: { type: 'mrkdwn', text: `*${slackEsc(i.key)} ${slackEsc(i.title.slice(0, 250))}*` } },
      { type: 'section', fields: fields.map((f) => ({ type: 'mrkdwn', text: f })) },
      { type: 'context', elements: [{ type: 'mrkdwn', text: `CT Work · ${slackEsc(i.project.slice(0, 120))}` }] },
    ],
  };
}

/** Sự kiện thông báo Slack chọn được (cùng bộ với chat hooks). */
export const SLACK_EVENTS = ['issue.created', 'issue.assigned', 'issue.done', 'comment.created', 'report.sent'] as const;
export type SlackEvent = (typeof SLACK_EVENTS)[number];
export const cleanSlackEvents = (list: unknown): SlackEvent[] =>
  (Array.isArray(list) ? [...new Set(list.filter((e): e is SlackEvent => (SLACK_EVENTS as readonly string[]).includes(e as string)))] : []);

/** Mã kênh Slack (C…/G…) — chặn chuỗi lạ trước khi gọi API. */
export const SLACK_CHANNEL_RE = /^[CG][A-Z0-9]{6,20}$/;
