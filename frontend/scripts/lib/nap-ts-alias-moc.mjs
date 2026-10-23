/** Phần móc `resolve` (chạy trong luồng nạp riêng của Node) — xem nap-ts-alias.mjs. */
import { pathToFileURL, fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const SRC = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'src');
const DUOI = ['.ts', '.tsx', '/index.ts', '/index.tsx', '.mts', '.js'];

export async function resolve(spec, ctx, next) {
  const s = spec.startsWith('@/') ? pathToFileURL(join(SRC, spec.slice(2))).href : spec;
  try {
    return await next(s, ctx);
  } catch (e) {
    const tuongDoi = s.startsWith('.') || s.startsWith('file:');
    if (!tuongDoi || !['ERR_MODULE_NOT_FOUND', 'ERR_UNSUPPORTED_DIR_IMPORT'].includes(e?.code)) throw e;
    for (const d of DUOI) {
      try { return await next(s + d, ctx); } catch { /* thử đuôi kế */ }
    }
    throw e;
  }
}
