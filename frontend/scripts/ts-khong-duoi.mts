/**
 * Nạp móc resolve: import TƯƠNG ĐỐI không đuôi giữa các tệp bài (`import { X } from './kho56a'`) — webpack tự thêm
 * `.ts`, Node thì không ⇒ ERR_MODULE_NOT_FOUND. Import tệp này (chỉ để có tác dụng phụ) TRƯỚC khi nạp tệp bài.
 * Dùng chung cho dekiru-on-the.mts, dekiru-kanji-index.mts (course-manifest.mts có bản riêng giống hệt).
 */
import { register } from 'node:module';

register('data:text/javascript,' + encodeURIComponent(`
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
export async function resolve(spec, ctx, next) {
  if ((spec.startsWith('./') || spec.startsWith('../')) && !/\\.[cm]?[jt]sx?$/.test(spec) && ctx.parentURL && ctx.parentURL.startsWith('file:')) {
    const u = new URL(spec + '.ts', ctx.parentURL);
    if (existsSync(fileURLToPath(u))) return next(u.href, ctx);
  }
  return next(spec, ctx);
}`));
