/**
 * CT Work — CTW đợt 7b (C14 / CTW-26): kênh ngoài ⇒ ĐỀ XUẤT thẻ. Luật thuần (không DB): xác thực chữ ký, cửa sổ thời
 * gian chống phát lại, đọc payload ⇒ đề xuất, mã hoá bí mật lưu DB. Test ở ctw7b.test.ts.
 *
 *   EMAIL  — Resend inbound ("email.received") ký kiểu Svix: header svix-id / svix-timestamp / svix-signature
 *            ("v1,<base64>" — có thể nhiều chữ ký cách nhau bằng dấu cách), khoá = base64 sau "whsec_",
 *            nội dung ký = `${id}.${timestamp}.${body}` HMAC-SHA256. Lệch giờ > 5 phút ⇒ từ chối.
 *   DISCORD — Interactions endpoint: Ed25519 trên `${X-Signature-Timestamp}${body}` bằng PUBLIC KEY của ứng dụng (hex 32 byte).
 *            Discord tự gửi PING (type 1) lúc lưu URL — phải trả { type: 1 } sau khi kiểm chữ ký.
 *   ZALO   — OA webhook: header X-ZEvent-Signature = "mac=" + sha256(appId + body + timestamp + OA secret key) (hex),
 *            timestamp lấy từ trường `timestamp` (ms) trong thân. Theo tài liệu developers.zalo.me (Official Account API →
 *            Webhook). Cần OA THẬT đã xác thực — người dùng tự đăng ký; không có OA thì dùng chế độ giả lập trong cài đặt.
 *
 * Mọi chữ ký so bằng timingSafeEqual; mọi kênh có thêm "nonce" (id sự kiện) lưu DB ⇒ gửi lại đúng gói cũ trong cửa sổ
 * thời gian vẫn bị chặn.
 */

import crypto from 'node:crypto';

export const INTAKE_KINDS = ['EMAIL', 'DISCORD', 'ZALO'] as const;
export type IntakeKind = (typeof INTAKE_KINDS)[number];
export const PROPOSAL_STATUSES = ['PENDING', 'ACCEPTED', 'REJECTED'] as const;

/** Cửa sổ chấp nhận lệch giờ (giây). */
export const REPLAY_WINDOW_S = 5 * 60;

const safeEq = (a: Buffer, b: Buffer) => a.length === b.length && crypto.timingSafeEqual(a, b);

function inWindow(tsSeconds: number, nowMs: number): boolean {
  return Number.isFinite(tsSeconds) && Math.abs(nowMs / 1000 - tsSeconds) <= REPLAY_WINDOW_S;
}

// ═══ Svix (Resend) ═══════════════════════════════════════════════

export function svixSign(secret: string, id: string, timestamp: string, body: string | Buffer): string {
  const key = Buffer.from(secret.replace(/^whsec_/, ''), 'base64');
  return `v1,${crypto.createHmac('sha256', key).update(`${id}.${timestamp}.`).update(body).digest('base64')}`;
}

export type VerifyResult = { ok: true; nonce: string } | { ok: false; reason: 'MISSING' | 'BAD_SIGNATURE' | 'STALE' };

export function verifySvix(secret: string, headers: { id?: string; timestamp?: string; signature?: string }, body: Buffer, nowMs = Date.now()): VerifyResult {
  const { id, timestamp, signature } = headers;
  if (!id || !timestamp || !signature || !secret) return { ok: false, reason: 'MISSING' };
  if (!/^\d{9,11}$/.test(timestamp) || !inWindow(Number(timestamp), nowMs)) return { ok: false, reason: 'STALE' };
  const expected = Buffer.from(svixSign(secret, id, timestamp, body).slice(3), 'base64');
  const ok = signature.split(/\s+/).some((part) => {
    const [ver, sig] = part.split(',', 2);
    return ver === 'v1' && !!sig && safeEq(Buffer.from(sig, 'base64'), expected);
  });
  return ok ? { ok: true, nonce: `svix:${id}` } : { ok: false, reason: 'BAD_SIGNATURE' };
}

// ═══ Discord (Ed25519) ═══════════════════════════════════════════

const ED25519_SPKI_PREFIX = Buffer.from('302a300506032b6570032100', 'hex');

export function discordPublicKey(hex: string): crypto.KeyObject {
  if (!/^[0-9a-f]{64}$/i.test(hex)) throw new Error('The Discord public key is 64 hex characters (Developer Portal → General Information → Public Key)');
  return crypto.createPublicKey({ key: Buffer.concat([ED25519_SPKI_PREFIX, Buffer.from(hex, 'hex')]), format: 'der', type: 'spki' });
}

export function verifyDiscord(publicKeyHex: string, headers: { signature?: string; timestamp?: string }, body: Buffer, nowMs = Date.now()): { ok: true } | { ok: false; reason: 'MISSING' | 'BAD_SIGNATURE' | 'STALE' } {
  const { signature, timestamp } = headers;
  if (!signature || !timestamp || !publicKeyHex) return { ok: false, reason: 'MISSING' };
  if (!/^[0-9a-f]{128}$/i.test(signature)) return { ok: false, reason: 'BAD_SIGNATURE' };
  if (!/^\d{9,11}$/.test(timestamp) || !inWindow(Number(timestamp), nowMs)) return { ok: false, reason: 'STALE' };
  try {
    const ok = crypto.verify(null, Buffer.concat([Buffer.from(timestamp), body]), discordPublicKey(publicKeyHex), Buffer.from(signature, 'hex'));
    return ok ? { ok: true } : { ok: false, reason: 'BAD_SIGNATURE' };
  } catch {
    return { ok: false, reason: 'BAD_SIGNATURE' };
  }
}

/** Ký giả cho test/giả lập (khoá riêng Ed25519). */
export function discordSign(privateKey: crypto.KeyObject, timestamp: string, body: string | Buffer): string {
  return crypto.sign(null, Buffer.concat([Buffer.from(timestamp), Buffer.isBuffer(body) ? body : Buffer.from(body)]), privateKey).toString('hex');
}

/** Hex 32 byte public key từ KeyObject (để test dựng khoá giả). */
export function rawPublicKeyHex(key: crypto.KeyObject): string {
  return key.export({ format: 'der', type: 'spki' }).subarray(ED25519_SPKI_PREFIX.length).toString('hex');
}

// ═══ Zalo OA ═════════════════════════════════════════════════════

export function zaloMac(appId: string, body: string | Buffer, timestamp: string, oaSecret: string): string {
  return crypto.createHash('sha256').update(appId).update(body).update(timestamp).update(oaSecret).digest('hex');
}

export function verifyZalo(cfg: { appId: string; oaSecret: string }, signatureHeader: string | undefined, body: Buffer, nowMs = Date.now()): VerifyResult {
  if (!signatureHeader || !cfg.appId || !cfg.oaSecret) return { ok: false, reason: 'MISSING' };
  let parsed: { timestamp?: unknown; message?: { msg_id?: unknown } } | null = null;
  try { parsed = JSON.parse(body.toString('utf8')); } catch { return { ok: false, reason: 'BAD_SIGNATURE' }; }
  const ts = String(parsed?.timestamp ?? '');
  if (!/^\d{10,14}$/.test(ts)) return { ok: false, reason: 'MISSING' };
  const tsS = ts.length > 11 ? Number(ts) / 1000 : Number(ts);
  const mac = signatureHeader.replace(/^mac=/, '').trim().toLowerCase();
  const want = zaloMac(cfg.appId, body, ts, cfg.oaSecret);
  if (!/^[0-9a-f]{64}$/.test(mac) || !safeEq(Buffer.from(mac), Buffer.from(want))) return { ok: false, reason: 'BAD_SIGNATURE' };
  if (!inWindow(tsS, nowMs)) return { ok: false, reason: 'STALE' };
  const msgId = parsed?.message?.msg_id;
  return { ok: true, nonce: `zalo:${typeof msgId === 'string' && msgId ? msgId : `${ts}:${crypto.createHash('sha1').update(body).digest('hex').slice(0, 16)}`}` };
}

// ═══ Payload ⇒ đề xuất ═══════════════════════════════════════════

export interface ProposalDraft {
  externalId: string;
  title: string;
  body: string | null;
  senderName: string | null;
  senderHandle: string | null;
  meta: Record<string, unknown>;
}

const clean = (s: unknown, n: number) => (typeof s === 'string' ? s.replace(/\r\n/g, '\n').trim().slice(0, n) : '');

/** "Lan Pham <lan@contoso.com>" ⇒ { name, email }. */
export function parseAddress(raw: unknown): { name: string | null; email: string | null } {
  const s = Array.isArray(raw) ? String(raw[0] ?? '') : typeof raw === 'object' && raw ? String((raw as { email?: string }).email ?? '') : String(raw ?? '');
  const m = /^\s*"?([^"<]*?)"?\s*<([^>]+)>\s*$/.exec(s);
  const email = (m ? m[2] : s).trim().toLowerCase();
  return { name: m && m[1].trim() ? m[1].trim().slice(0, 160) : null, email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email.slice(0, 200) : null };
}

/** Bỏ phần trích thư cũ ("On … wrote:", dòng bắt đầu bằng ">") và chữ ký "-- ". */
export function stripQuoted(text: string): string {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const out: string[] = [];
  for (const l of lines) {
    if (/^\s*>/.test(l)) continue;
    if (/^On .+wrote:\s*$/.test(l) || /^Vào .+đã viết:\s*$/.test(l) || l === '-- ' || /^-{2,}\s*Original Message\s*-{2,}/i.test(l)) break;
    out.push(l);
  }
  return out.join('\n').trim();
}

export function htmlToText(html: string): string {
  return html
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n').replace(/<\/(p|div|li|h\d|tr)>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&')
    .replace(/\n{3,}/g, '\n\n').trim();
}

/**
 * Thư Resend inbound ⇒ đề xuất. `address` = địa chỉ của kênh (thư gửi tới địa chỉ khác ⇒ null — một webhook Resend nhận
 * thư của CẢ tên miền, mỗi dự án chỉ lấy thư của mình).
 */
export function proposalFromEmail(payload: unknown, address: string): ProposalDraft | null | 'IGNORED' {
  const p = payload as { type?: string; data?: Record<string, unknown> } | null;
  if (!p || typeof p !== 'object') return null;
  if (p.type && p.type !== 'email.received' && p.type !== 'inbound.email') return 'IGNORED';
  const d = (p.data ?? {}) as Record<string, unknown>;
  const toList = ([] as unknown[]).concat(d.to ?? [], d.cc ?? []).map((x) => parseAddress(x).email).filter(Boolean) as string[];
  if (address && !toList.includes(address.toLowerCase())) return 'IGNORED';
  const from = parseAddress(d.from);
  const subject = clean(d.subject, 255) || '(no subject)';
  const text = typeof d.text === 'string' && d.text.trim() ? d.text : typeof d.html === 'string' ? htmlToText(d.html) : '';
  const id = clean(d.email_id ?? d.message_id ?? d.id, 200);
  if (!id) return null;
  const attachments = Array.isArray(d.attachments) ? (d.attachments as Array<Record<string, unknown>>).slice(0, 20).map((a) => ({ name: clean(a.filename ?? a.name, 200), type: clean(a.content_type ?? a.contentType, 100), size: Number(a.size) || null })) : [];
  return {
    externalId: id, title: subject.replace(/^(re|fw|fwd)\s*:\s*/i, '').slice(0, 255) || subject, body: stripQuoted(text).slice(0, 20_000) || null,
    senderName: from.name, senderHandle: from.email, meta: { to: toList.slice(0, 10), attachments, bodyMissing: !text },
  };
}

/** Discord interaction "/ctwork new title:… details:…" ⇒ đề xuất. */
export function proposalFromDiscord(interaction: Record<string, any>): ProposalDraft | null {
  if (interaction?.type !== 2) return null;
  const data = interaction.data ?? {};
  if (data.name !== 'ctwork') return null;
  // "/ctwork new title:… details:…" (lệnh con) — hoặc lệnh đăng ký phẳng "/ctwork title:… details:…".
  const top = (data.options ?? []) as any[];
  const subCmd = top.find((o) => o?.type === 1 || o?.type === 2);
  if (subCmd && subCmd.name !== 'new') return null;
  const sub = subCmd ?? { options: top };
  const opt = (n: string) => clean((sub.options ?? []).find((o: any) => o?.name === n)?.value, n === 'title' ? 255 : 4000);
  const title = opt('title');
  if (!title) return null;
  const user = interaction.member?.user ?? interaction.user ?? {};
  return {
    externalId: String(interaction.id ?? ''), title, body: opt('details') || null,
    senderName: clean(user.global_name ?? user.username, 160) || null, senderHandle: user.id ? `discord:${clean(user.id, 40)}` : null,
    meta: { guildId: interaction.guild_id ?? null, channelId: interaction.channel_id ?? null },
  };
}

/** Tin Zalo OA (user_send_text) ⇒ đề xuất khi bắt đầu bằng tiền tố (mặc định "#task"); tiền tố rỗng ⇒ mọi tin. */
export function proposalFromZalo(event: Record<string, any>, prefix: string): ProposalDraft | null | 'IGNORED' {
  if (event?.event_name !== 'user_send_text') return 'IGNORED';
  const text = clean(event.message?.text, 4000);
  if (!text) return 'IGNORED';
  const p = prefix.trim();
  let rest = text;
  if (p) {
    if (!text.toLowerCase().startsWith(p.toLowerCase())) return 'IGNORED';
    rest = text.slice(p.length).trim();
  }
  if (!rest) return 'IGNORED';
  const [first, ...more] = rest.split('\n');
  return {
    externalId: clean(event.message?.msg_id, 200) || `zalo:${event.timestamp}:${clean(event.sender?.id, 40)}`,
    title: first.trim().slice(0, 255), body: more.join('\n').trim() || null,
    senderName: null, senderHandle: event.sender?.id ? `zalo:${clean(event.sender.id, 60)}` : null,
    meta: { oaId: event.recipient?.id ?? null },
  };
}

// ═══ Bí mật lưu DB (AES-256-GCM) ═════════════════════════════════

/**
 * Khoá: APP_ENCRYPTION_KEY (base64 32 byte, như utils/crypto.ts) nếu có; không thì dẫn xuất từ JWT_SECRET (sha256 + nhãn
 * riêng) — vẫn không đọc được nếu chỉ lộ CSDL. AAD = "ctw-intake:<channel token>" ⇒ chép bí mật sang kênh khác là hỏng.
 */
function intakeKey(fallbackSecret: string): Buffer {
  const raw = process.env.APP_ENCRYPTION_KEY;
  if (raw) { const k = Buffer.from(raw, 'base64'); if (k.length === 32) return k; }
  return crypto.createHash('sha256').update(`ctw-intake-v1|${fallbackSecret}`).digest();
}

export function sealSecret(plain: string, aad: string, fallbackSecret: string): string {
  const iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv('aes-256-gcm', intakeKey(fallbackSecret), iv);
  c.setAAD(Buffer.from(aad));
  const ct = Buffer.concat([c.update(plain, 'utf8'), c.final()]);
  return `i1.${Buffer.concat([iv, c.getAuthTag(), ct]).toString('base64url')}`;
}

export function openSecret(token: string | null | undefined, aad: string, fallbackSecret: string): string | null {
  if (!token || !token.startsWith('i1.')) return null;
  try {
    const buf = Buffer.from(token.slice(3), 'base64url');
    const d = crypto.createDecipheriv('aes-256-gcm', intakeKey(fallbackSecret), buf.subarray(0, 12));
    d.setAAD(Buffer.from(aad));
    d.setAuthTag(buf.subarray(12, 28));
    return Buffer.concat([d.update(buf.subarray(28)), d.final()]).toString('utf8');
  } catch {
    return null;
  }
}

/** Hiện bí mật đã che: "whsec_…a1b2". */
export function maskSecret(s: string | null): string | null {
  if (!s) return null;
  return s.length <= 8 ? '••••' : `${s.slice(0, 6)}…${s.slice(-4)}`;
}
