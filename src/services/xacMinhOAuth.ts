/**
 * Xác minh lời gọi `POST /api/v1/auth/oauth/token` TRƯỚC khi cấp phiên (18/10/2026).
 *
 * ⛔ Trước bản này route đó tin hoàn toàn email + providerId client gửi lên: ai biết
 * email của người khác (kể cả admin) là lấy được JWT của họ — chiếm tài khoản không
 * cần mật khẩu. Giờ chỉ cấp phiên khi qua MỘT trong ba cửa:
 *  1. Lời gọi NỘI BỘ từ máy chủ Next (sau khi NextAuth đã xác minh Google/GitHub/Apple
 *     ở phía web): header `x-cuongthai-noi-bo` = HMAC-SHA256(AUTH_SECRET, 'oauth-token-v1').
 *     Không gửi bí mật gốc; hai container cùng đọc `/opt/cuonghoangdev/.env`.
 *  2. Apple (app iOS): `identityToken` ký RS256 bằng khoá của Apple, `aud` là app của ta,
 *     còn hạn, `sub` = providerId, email khớp.
 *  3. Google (app iOS): `idToken` ký bằng khoá của Google, `aud` là client iOS/web của ta,
 *     `email_verified`, `sub` = providerId, email khớp.
 */
import { createHmac, createPublicKey, createVerify, timingSafeEqual, type JsonWebKey } from 'node:crypto';
import { logger } from '../utils/logger.js';

const NGUON_KHOA = {
  apple: 'https://appleid.apple.com/auth/keys',
  google: 'https://www.googleapis.com/oauth2/v3/certs',
} as const;

const AUD_APPLE = (process.env.APPLE_OAUTH_AUDIENCES
  ?? 'com.cuongthai.app,com.cuongthai.ctwork,com.cuongthai.admin,com.cuongthai.app.macos').split(',').map((s) => s.trim()).filter(Boolean);
const AUD_GOOGLE = [
  ...(process.env.GOOGLE_OAUTH_AUDIENCES ?? '650641212127-07fqeii3rqbpduj1ko39sc83bautslrs.apps.googleusercontent.com').split(','),
  process.env.GOOGLE_CLIENT_ID ?? '',
].map((s) => s.trim()).filter(Boolean);

type Jwk = JsonWebKey & { kid?: string };
const boNhoKhoa = new Map<string, { luc: number; khoa: Jwk[] }>();
const NHO_MS = 6 * 3600_000;

async function layKhoa(nguon: keyof typeof NGUON_KHOA, kid: string, ep = false): Promise<Jwk | null> {
  const nho = boNhoKhoa.get(nguon);
  if (!ep && nho && Date.now() - nho.luc < NHO_MS) {
    const k = nho.khoa.find((x) => x.kid === kid);
    if (k) return k;
  }
  const r = await fetch(NGUON_KHOA[nguon], { signal: AbortSignal.timeout(8000) });
  if (!r.ok) throw new Error(`Không tải được khoá ${nguon} (HTTP ${r.status})`);
  const j = await r.json() as { keys?: Jwk[] };
  boNhoKhoa.set(nguon, { luc: Date.now(), khoa: j.keys ?? [] });
  return (j.keys ?? []).find((x) => x.kid === kid) ?? null;
}

const b64u = (s: string): Buffer => Buffer.from(s, 'base64url');

/** Kiểm chữ ký RS256 của một JWT bằng bộ khoá công khai. Trả phần thân nếu hợp lệ. */
export async function kiemJwtRs256(token: string, nguon: keyof typeof NGUON_KHOA): Promise<Record<string, unknown> | null> {
  const phan = token.split('.');
  if (phan.length !== 3) return null;
  let dau: { alg?: string; kid?: string };
  let than: Record<string, unknown>;
  try {
    dau = JSON.parse(b64u(phan[0]!).toString('utf8'));
    than = JSON.parse(b64u(phan[1]!).toString('utf8'));
  } catch { return null; }
  if (dau.alg !== 'RS256' || !dau.kid) return null;
  let jwk = await layKhoa(nguon, dau.kid);
  if (!jwk) jwk = await layKhoa(nguon, dau.kid, true); // khoá vừa xoay
  if (!jwk) return null;
  const v = createVerify('RSA-SHA256');
  v.update(`${phan[0]}.${phan[1]}`);
  const dung = v.verify(createPublicKey({ key: jwk, format: 'jwk' }), b64u(phan[2]!));
  return dung ? than : null;
}

/** Chữ ký nội bộ máy chủ Next ⇒ backend. `null` khi chưa cấu hình bí mật. */
export function chuKyNoiBo(): string | null {
  const bi = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
  if (!bi) return null;
  return createHmac('sha256', bi).update('oauth-token-v1').digest('hex');
}

function bangNhau(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

const conHan = (than: Record<string, unknown>): boolean => typeof than.exp === 'number' && than.exp * 1000 > Date.now() - 60_000;
const cungEmail = (a: unknown, b: string): boolean => typeof a === 'string' && a.trim().toLowerCase() === b.trim().toLowerCase();

export type KetQuaXacMinh = { ok: true; cach: 'noiBo' | 'apple' | 'google' } | { ok: false; lyDo: string };

export async function xacMinhOAuth(
  headers: Record<string, unknown>,
  body: { email?: string; provider?: string; providerId?: string; identityToken?: string; idToken?: string },
): Promise<KetQuaXacMinh> {
  const noiBo = String(headers['x-cuongthai-noi-bo'] ?? '');
  const mong = chuKyNoiBo();
  if (noiBo && mong && bangNhau(noiBo, mong)) return { ok: true, cach: 'noiBo' };

  const email = String(body.email ?? '');
  const providerId = String(body.providerId ?? '');
  try {
    if (body.provider === 'apple' && body.identityToken) {
      const t = await kiemJwtRs256(body.identityToken, 'apple');
      if (!t) return { ok: false, lyDo: 'identityToken Apple sai chữ ký' };
      if (t.iss !== 'https://appleid.apple.com') return { ok: false, lyDo: 'iss Apple sai' };
      if (!AUD_APPLE.includes(String(t.aud))) return { ok: false, lyDo: `aud Apple lạ: ${String(t.aud)}` };
      if (!conHan(t)) return { ok: false, lyDo: 'identityToken Apple hết hạn' };
      if (String(t.sub) !== providerId) return { ok: false, lyDo: 'sub Apple khác providerId' };
      // Apple luôn đưa email vào token khi app xin quyền email; thiếu thì không có gì để đối chiếu ⇒ từ chối.
      if (!cungEmail(t.email, email)) return { ok: false, lyDo: 'email khác email trong token Apple' };
      return { ok: true, cach: 'apple' };
    }
    if (body.provider === 'google' && body.idToken) {
      const t = await kiemJwtRs256(body.idToken, 'google');
      if (!t) return { ok: false, lyDo: 'idToken Google sai chữ ký' };
      if (t.iss !== 'accounts.google.com' && t.iss !== 'https://accounts.google.com') return { ok: false, lyDo: 'iss Google sai' };
      if (!AUD_GOOGLE.includes(String(t.aud))) return { ok: false, lyDo: `aud Google lạ: ${String(t.aud)}` };
      if (!conHan(t)) return { ok: false, lyDo: 'idToken Google hết hạn' };
      if (t.email_verified !== true && t.email_verified !== 'true') return { ok: false, lyDo: 'email Google chưa xác minh' };
      if (String(t.sub) !== providerId) return { ok: false, lyDo: 'sub Google khác providerId' };
      if (!cungEmail(t.email, email)) return { ok: false, lyDo: 'email khác email trong token Google' };
      return { ok: true, cach: 'google' };
    }
  } catch (e) {
    logger.warn('[oauth] xác minh token hỏng', { error: (e as Error).message });
    return { ok: false, lyDo: 'không xác minh được với nhà cung cấp' };
  }
  if (!mong) logger.error('[oauth] AUTH_SECRET chưa có trong backend — lời gọi nội bộ từ web sẽ bị từ chối');
  return { ok: false, lyDo: 'thiếu bằng chứng đăng nhập (token nhà cung cấp hoặc chữ ký nội bộ)' };
}
