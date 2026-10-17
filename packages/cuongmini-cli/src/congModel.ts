/**
 * Tên + nhóm cổng của model (menu `/model`). Tách khỏi `lenh.ts` vì file đó nạp
 * `ct-lenh` (alias của esbuild) — test chạy bằng tsx không nạp được.
 */
import { L } from './i18n';

/** Tên model do máy chủ khai ⇒ tên thương hiệu CuongThai (như extension). */
export const doiTenModel = (ten: string): string => ten.replace(/^Claude Sonnet\b/, 'Cuong Sonnet').replace(/^Claude Opus\b/, 'CuongMini Max')
  .replace(/^Claude Haiku\b/, 'Cuong Haiku').replace(/^Claude Fable\b/, 'Cuong Fable');

/** Tên hiện của một model: cổng Claude CHÍNH HÃNG giữ nguyên tên máy chủ khai (người dùng trả tiền cho đúng chữ "Claude" đó). */
export const tenModel = (m: { ten: string; cong?: string }): string => (m.cong === 'anthropic' ? m.ten : doiTenModel(m.ten));

/** Nhóm cổng của model — thứ tự hiện trong menu `/model`. */
export const NHOM_CONG = ['chinh', 'anthropic', 'modelapi'] as const;
export type NhomCong = typeof NHOM_CONG[number];
export const nhomCong = (m: { cong?: string }): NhomCong => (m.cong === 'anthropic' ? 'anthropic' : m.cong === 'modelapi' ? 'modelapi' : 'chinh');
export function tenNhomCong(n: NhomCong): string {
  return n === 'anthropic' ? L('Claude chính hãng', 'Official Claude') : n === 'modelapi' ? 'modelapi' : L('Cổng chính', 'Main gateway');
}
