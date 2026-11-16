/**
 * Đăng nhập app qua web — phần CHỈ máy chủ Next (16/11/2026). Ký/đọc cookie `ct_app_dn` bằng HMAC của AUTH_SECRET.
 *
 * Cookie ràng bốn thứ của một lượt: app, nhà cung cấp, trangThai (nonce app sinh), thu (PKCE S256) + mốc bắt đầu.
 * /api/auth/app/ma chỉ xin mã khi: cookie còn hạn + chữ ký đúng + phiên NextAuth được cấp SAU mốc bắt đầu bằng ĐÚNG
 * nhà cung cấp đó. Nhờ vậy một phiên web cũ đang mở trong Safari KHÔNG bị "mượn" để phát mã cho app — người dùng
 * luôn vừa đăng nhập Google/GitHub trong chính lượt này.
 */
import { createHmac, timingSafeEqual } from 'node:crypto';
import {
  SONG_PHIEN_APP_DN_GIAY, laKhoaApp, laNhaCungCapApp, laThuApp, laTrangThaiApp,
  type KhoaAppQuaWeb, type NhaCungCapApp,
} from '@/lib/dangNhapApp';

export type PhienAppDn = { app: KhoaAppQuaWeb; ncc: NhaCungCapApp; tt: string; thu: string; luc: number };

function biMat(): string | null {
  return process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || null;
}

const ky = (than: string, bi: string): string =>
  createHmac('sha256', bi).update(`app-dn-v1.${than}`).digest('base64url');

export function kyPhienAppDn(p: PhienAppDn): string | null {
  const bi = biMat();
  if (!bi) return null;
  const than = Buffer.from(JSON.stringify(p)).toString('base64url');
  return `${than}.${ky(than, bi)}`;
}

export function docPhienAppDn(gt: string | undefined, bayGio = Date.now()): PhienAppDn | null {
  const bi = biMat();
  if (!bi || !gt) return null;
  const [than, chuKy] = gt.split('.');
  if (!than || !chuKy) return null;
  const a = Buffer.from(chuKy);
  const b = Buffer.from(ky(than, bi));
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  let p: PhienAppDn;
  try { p = JSON.parse(Buffer.from(than, 'base64url').toString('utf8')) as PhienAppDn; } catch { return null; }
  if (!laKhoaApp(p.app) || !laNhaCungCapApp(p.ncc) || !laTrangThaiApp(p.tt) || !laThuApp(p.thu)) return null;
  if (typeof p.luc !== 'number' || bayGio - p.luc > SONG_PHIEN_APP_DN_GIAY * 1000 || p.luc > bayGio + 60_000) return null;
  return p;
}
