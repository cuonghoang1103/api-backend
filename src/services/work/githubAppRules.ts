/**
 * CT Work 27/10/2026 — GitHub App "CT Work by CuongThai": phần THUẦN (ký JWT, kiểm chữ ký webhook, state HMAC, manifest,
 * bình luận review inline chỉ trên dòng có trong diff). Test: githubApp.test.ts. Không mạng, không DB.
 */

import crypto from 'node:crypto';
import { patchLines } from './codeText.js';
import type { CodeFinding } from './codeReviewRules.js';

// ─── JWT RS256 cho App (iss = App ID, sống ≤ 10 phút — GitHub đòi) ─────────

const b64u = (b: Buffer | string) => Buffer.from(b).toString('base64url');

export function appJwt(appId: string | number, pem: string, nowSec = Math.floor(Date.now() / 1000)): string {
  const head = b64u(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  // iat lùi 60 s (lệch đồng hồ), exp 9 phút (< 10 phút trần của GitHub).
  const body = b64u(JSON.stringify({ iat: nowSec - 60, exp: nowSec + 9 * 60, iss: String(appId) }));
  const sig = crypto.createSign('RSA-SHA256').update(`${head}.${body}`).sign(pem);
  return `${head}.${body}.${b64u(sig)}`;
}

/** Kiểm JWT bằng khoá công khai (chỉ cho test / chẩn đoán). */
export function verifyAppJwt(jwt: string, publicPem: string): { iss: string; iat: number; exp: number } | null {
  const [h, b, s] = jwt.split('.');
  if (!h || !b || !s) return null;
  const ok = crypto.createVerify('RSA-SHA256').update(`${h}.${b}`).verify(publicPem, Buffer.from(s, 'base64url'));
  if (!ok) return null;
  try { return JSON.parse(Buffer.from(b, 'base64url').toString('utf8')); } catch { return null; }
}

/** PEM từ env có thể bị dán với "\n" chữ — đổi lại thành xuống dòng thật. */
export function normalizePem(raw: string): string {
  return raw.includes('\\n') && !raw.includes('\n') ? raw.replace(/\\n/g, '\n') : raw;
}

// ─── Chữ ký webhook (X-Hub-Signature-256) ─────────────────────────

export function webhookSignatureOk(secret: string, raw: Buffer, header: string | undefined): boolean {
  if (!secret || !header || !header.startsWith('sha256=')) return false;
  const want = Buffer.from(`sha256=${crypto.createHmac('sha256', secret).update(raw).digest('hex')}`);
  const got = Buffer.from(header);
  return want.length === got.length && crypto.timingSafeEqual(want, got);
}

// ─── state HMAC (chống CSRF, có hạn) ──────────────────────────────

/** state = base64url(JSON payload) + "." + HMAC — payload có `exp` (giây). */
export function signAppState(secret: string, payload: Record<string, string | number>, ttlSec: number, nowSec = Math.floor(Date.now() / 1000)): string {
  const body = b64u(JSON.stringify({ ...payload, exp: nowSec + ttlSec, n: crypto.randomBytes(8).toString('hex') }));
  return `${body}.${crypto.createHmac('sha256', secret).update(body).digest('base64url')}`;
}

export function readAppState<T extends Record<string, unknown>>(secret: string, state: string | undefined | null, nowSec = Math.floor(Date.now() / 1000)): (T & { exp: number }) | null {
  if (!state || typeof state !== 'string' || state.length > 2000) return null;
  const [body, sig] = state.split('.');
  if (!body || !sig) return null;
  const want = Buffer.from(crypto.createHmac('sha256', secret).update(body).digest('base64url'));
  const got = Buffer.from(sig);
  if (want.length !== got.length || !crypto.timingSafeEqual(want, got)) return null;
  try {
    const p = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as T & { exp: number };
    if (typeof p.exp !== 'number' || p.exp < nowSec) return null;
    return p;
  } catch {
    return null;
  }
}

// ─── Manifest ─────────────────────────────────────────────────────

export function appManifest(base: string, opts: { name?: string } = {}) {
  const b = base.replace(/\/+$/, '');
  return {
    name: (opts.name ?? 'CT Work by CuongThai').slice(0, 34),
    url: b,
    description: 'Connect a GitHub repository to a CT Work project: Git activity on issues, code view and CuongMini code reviews.',
    hook_attributes: { url: `${b}/api/v1/work/github/webhook/app`, active: true },
    redirect_url: `${b}/api/v1/work/github-app/manifest/callback`,
    callback_urls: [`${b}/api/v1/work/github-app/setup`],
    setup_url: `${b}/api/v1/work/github-app/setup`,
    request_oauth_on_install: true,
    setup_on_update: true,
    public: true,
    default_permissions: { contents: 'read', metadata: 'read', pull_requests: 'write', checks: 'read', statuses: 'read' },
    default_events: ['push', 'create', 'delete', 'pull_request', 'pull_request_review', 'pull_request_review_comment', 'check_run', 'check_suite'],
  };
}

// ─── Review lên PR: chỉ dòng có trong diff ────────────────────────

export interface InlineComment { path: string; line: number; side: 'RIGHT'; body: string }

/**
 * Phát hiện ⇒ bình luận inline của GitHub. CHỈ dòng nằm trong hunk của tệp (GitHub từ chối cả review nếu một dòng nằm
 * ngoài diff); phát hiện không có dòng / dòng ngoài diff ⇒ vào thân review. Tối đa 30 bình luận inline.
 */
export function inlineComments(findings: CodeFinding[], files: Array<{ filename: string; patch: string | null }>, max = 30): { inline: InlineComment[]; rest: CodeFinding[] } {
  const lines = new Map(files.map((f) => [f.filename, patchLines(f.patch).all]));
  const inline: InlineComment[] = [];
  const rest: CodeFinding[] = [];
  for (const f of findings) {
    if (f.line && lines.get(f.file)?.has(f.line) && inline.length < max) {
      inline.push({ path: f.file, line: f.line, side: 'RIGHT', body: `**${f.severity}** · ${f.category}\n\n${f.message}${f.suggestion ? `\n\n_${f.suggestion}_` : ''}`.slice(0, 4000) });
    } else rest.push(f);
  }
  return { inline, rest };
}

/** Trạng thái CI gộp từ check_suite / check_run: failure > pending > success. */
export function ciStateOf(status: string | null | undefined, conclusion: string | null | undefined): 'success' | 'failure' | 'pending' | 'neutral' {
  if (status && status !== 'completed') return 'pending';
  if (!conclusion) return 'pending';
  if (['failure', 'timed_out', 'cancelled', 'action_required', 'startup_failure', 'stale'].includes(conclusion)) return 'failure';
  if (conclusion === 'success') return 'success';
  return 'neutral';
}
