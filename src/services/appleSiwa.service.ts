/**
 * Sign in with Apple — giữ refresh token để THU HỒI khi xoá tài khoản (App Store 5.1.1(v), 22/10/2026).
 * ─────────────────────────────────────────────────────────────────────────────────────────────────────────────
 * Apple bắt app có Sign in with Apple gọi REST `/auth/revoke` khi người dùng xoá tài khoản. Muốn thu hồi thì phải có
 * token, mà app chỉ gửi `authorizationCode` (dùng MỘT lần, sống 5 phút) lúc đăng nhập. Nên:
 *   1. Đăng nhập (`POST /auth/oauth/token`, provider=apple, identityToken đã xác minh): đổi `authorizationCode` lấy
 *      token ở `https://appleid.apple.com/auth/token`, lưu `refresh_token` MÃ HOÁ (AES-256-GCM, `sealToken` của kết nối
 *      OAuth CT Work, AAD = "<provider>:<userId>") vào `work_oauth_connections`, provider `siwa:<đuôi bundle id>`
 *      (`siwa:ctwork`, `siwa:app`) — không thêm bảng; danh sách kết nối CT Work chỉ hiện nhà cung cấp đã đăng ký nên
 *      dòng này không lộ ra giao diện. Chạy NỀN: không làm chậm đăng nhập, hỏng thì chỉ ghi log.
 *   2. Xoá tài khoản (`anonymizeAccount` — khi admin duyệt hoặc tự chạy sau 72 giờ): gọi `/auth/revoke` cho từng token
 *      rồi mới xoá dòng. Hỏng mạng/Apple từ chối ⇒ ghi WARN, việc xoá tài khoản VẪN chạy tiếp.
 * `client_secret` là JWT ES256 tự ký bằng khoá Sign in with Apple (.p8): iss = Team ID, sub = client_id (bundle id của
 * app đã đăng nhập — lấy từ `aud` của identityToken ĐÃ xác minh), aud = https://appleid.apple.com, sống 5 phút.
 *
 * Env (thiếu một biến ⇒ BỎ QUA lặng lẽ + WARN một lần; đăng nhập và xoá tài khoản không bao giờ hỏng vì nó):
 *   APPLE_SIWA_TEAM_ID       Team ID (10 ký tự, góc phải trên developer.apple.com)
 *   APPLE_SIWA_KEY_ID        Key ID của khoá Sign in with Apple
 *   APPLE_SIWA_PRIVATE_KEY   nội dung tệp AuthKey_<KEYID>.p8 (giữ nguyên xuống dòng, hoặc viết `\n`)
 *   APPLE_SIWA_CLIENT_IDS    tuỳ chọn — bundle id được phép, mặc định "com.cuongthai.ctwork,com.cuongthai.app"
 */
import { createPrivateKey, createSign } from 'node:crypto';
import { prisma } from '../config/database.js';
import { logger } from '../utils/logger.js';
import { openToken, sealToken, tokenAad } from './work/oauth/crypto.js';

export const APPLE_TOKEN_URL = 'https://appleid.apple.com/auth/token';
export const APPLE_REVOKE_URL = 'https://appleid.apple.com/auth/revoke';
const TIEN_TO = 'siwa:';

interface CauHinh { teamId: string; keyId: string; privateKey: string }

let daKeuThieu = false;

/** Đọc env LƯỜI (mỗi lần gọi) để test/đổi env không cần khởi động lại. */
export function cauHinhSiwa(): CauHinh | null {
  const teamId = process.env.APPLE_SIWA_TEAM_ID?.trim();
  const keyId = process.env.APPLE_SIWA_KEY_ID?.trim();
  const privateKey = process.env.APPLE_SIWA_PRIVATE_KEY?.replace(/\\n/g, '\n').trim();
  if (!teamId || !keyId || !privateKey) {
    if (!daKeuThieu) {
      daKeuThieu = true;
      logger.warn('[siwa] thiếu APPLE_SIWA_TEAM_ID / APPLE_SIWA_KEY_ID / APPLE_SIWA_PRIVATE_KEY — bỏ qua lưu + thu hồi token Sign in with Apple');
    }
    return null;
  }
  return { teamId, keyId, privateKey };
}

export function clientIdsHopLe(): string[] {
  return (process.env.APPLE_SIWA_CLIENT_IDS ?? 'com.cuongthai.ctwork,com.cuongthai.app').split(',').map((s) => s.trim()).filter(Boolean);
}

/** `siwa:ctwork` cho com.cuongthai.ctwork — cột provider chỉ 24 ký tự. */
export function providerCho(clientId: string): string {
  const duoi = clientId.split('.').filter(Boolean).pop() ?? clientId;
  return `${TIEN_TO}${duoi}`.slice(0, 24);
}

const b64u = (b: Buffer | string) => Buffer.from(b).toString('base64url');

/** client_secret = JWT ES256 (chữ ký dạng R‖S 64 byte như JOSE đòi, không phải DER). */
export function taoClientSecret(clientId: string, cfg: CauHinh, nowSec = Math.floor(Date.now() / 1000)): string {
  const dau = b64u(JSON.stringify({ alg: 'ES256', kid: cfg.keyId }));
  const than = b64u(JSON.stringify({ iss: cfg.teamId, iat: nowSec, exp: nowSec + 300, aud: 'https://appleid.apple.com', sub: clientId }));
  const ky = createSign('SHA256').update(`${dau}.${than}`).sign({ key: createPrivateKey(cfg.privateKey), dsaEncoding: 'ieee-p1363' });
  return `${dau}.${than}.${b64u(ky)}`;
}

async function goiApple(url: string, form: Record<string, string>): Promise<{ ok: boolean; status: number; json: Record<string, unknown> }> {
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded', accept: 'application/json' },
    body: new URLSearchParams(form).toString(),
    signal: AbortSignal.timeout(8000),
  });
  const json = (await r.json().catch(() => ({}))) as Record<string, unknown>;
  return { ok: r.ok, status: r.status, json };
}

/**
 * Đăng nhập Apple vừa xong: đổi authorizationCode lấy token và lưu (mã hoá). Không bao giờ ném lỗi.
 * Trả kết quả để test/nhật ký đọc được: 'saved' | 'skipped:<lý do>' | 'failed:<lý do>'.
 */
export async function luuTokenApple(userId: number, clientId: string | null | undefined, appleSub: string, code: string | null | undefined): Promise<string> {
  try {
    if (!code) return 'skipped:no-code';
    if (!clientId || !clientIdsHopLe().includes(clientId)) return `skipped:client-id ${clientId ?? '-'}`;
    const cfg = cauHinhSiwa();
    if (!cfg) return 'skipped:no-config';
    const r = await goiApple(APPLE_TOKEN_URL, {
      client_id: clientId, client_secret: taoClientSecret(clientId, cfg), code: String(code), grant_type: 'authorization_code',
    });
    if (!r.ok) {
      logger.warn('[siwa] Apple từ chối đổi authorizationCode', { userId, http: r.status, error: String(r.json.error ?? '') });
      return `failed:http-${r.status}`;
    }
    const refresh = typeof r.json.refresh_token === 'string' ? r.json.refresh_token : null;
    const access = typeof r.json.access_token === 'string' ? r.json.access_token : null;
    const token = refresh ?? access;
    if (!token) return 'failed:no-token';
    const provider = providerCho(clientId);
    const enc = sealToken(token, tokenAad(provider, userId));
    const settings = { clientId, tokenType: refresh ? 'refresh_token' : 'access_token' };
    await prisma.workOAuthConnection.upsert({
      where: { userId_provider: { userId, provider } },
      create: { userId, provider, status: 'ACTIVE', accountId: appleSub.slice(0, 200), refreshTokenEnc: enc, settings, scopes: '' },
      update: { status: 'ACTIVE', accountId: appleSub.slice(0, 200), refreshTokenEnc: enc, settings, lastError: null, lastErrorAt: null },
    });
    return 'saved';
  } catch (err) {
    logger.warn('[siwa] lưu token Apple hỏng', { userId, error: (err as Error).message });
    return `failed:${(err as Error).message}`;
  }
}

/**
 * Xoá tài khoản: thu hồi MỌI token Sign in with Apple đã lưu của người này rồi xoá dòng. Không bao giờ ném lỗi.
 * Trả số token đã thu hồi được / tổng.
 */
export async function thuHoiTokenApple(userId: number): Promise<{ revoked: number; total: number; skipped?: string }> {
  try {
    const rows = await prisma.workOAuthConnection.findMany({
      where: { userId, provider: { startsWith: TIEN_TO } },
      select: { id: true, provider: true, refreshTokenEnc: true, settings: true },
    });
    if (!rows.length) return { revoked: 0, total: 0 };
    const cfg = cauHinhSiwa();
    if (!cfg) {
      logger.warn('[siwa] có token Apple cần thu hồi nhưng thiếu cấu hình — KHÔNG thu hồi được', { userId, total: rows.length });
      return { revoked: 0, total: rows.length, skipped: 'no-config' };
    }
    let revoked = 0;
    for (const row of rows) {
      const s = (row.settings ?? {}) as { clientId?: string; tokenType?: string };
      const token = openToken(row.refreshTokenEnc, tokenAad(row.provider, userId));
      if (!token || !s.clientId) {
        logger.warn('[siwa] token Apple không giải mã được — bỏ qua', { userId, provider: row.provider });
        continue;
      }
      try {
        const r = await goiApple(APPLE_REVOKE_URL, {
          client_id: s.clientId, client_secret: taoClientSecret(s.clientId, cfg), token,
          token_type_hint: s.tokenType === 'access_token' ? 'access_token' : 'refresh_token',
        });
        if (r.ok) revoked += 1;
        else logger.warn('[siwa] Apple từ chối thu hồi token', { userId, provider: row.provider, http: r.status, error: String(r.json.error ?? '') });
      } catch (err) {
        logger.warn('[siwa] gọi /auth/revoke hỏng', { userId, provider: row.provider, error: (err as Error).message });
      }
    }
    await prisma.workOAuthConnection.deleteMany({ where: { userId, provider: { startsWith: TIEN_TO } } });
    logger.info('[siwa] thu hồi token Apple khi xoá tài khoản', { userId, revoked, total: rows.length });
    return { revoked, total: rows.length };
  } catch (err) {
    logger.warn('[siwa] thu hồi token Apple hỏng', { userId, error: (err as Error).message });
    return { revoked: 0, total: 0, skipped: 'error' };
  }
}
