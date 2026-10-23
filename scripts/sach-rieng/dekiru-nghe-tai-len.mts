/**
 * 🎧 Bản chép RIÊNG các track nghe CD (Lesson 4–7) — MÃ HOÁ rồi tải lên R2.
 * Cùng khoá `SACH_RIENG_KHOA` và cùng cổng quyền với ảnh sách gốc: chỉ tài khoản
 * trong SACH_RIENG_USER_IDS / ADMIN xem được (GET /api/v1/sach-rieng/dekiru/nghe).
 *
 *   npx tsx scripts/sach-rieng/dekiru-nghe-tai-len.mts [--nguon <thư mục chứa L4.json…L7.json>]
 *
 * Đây là CHỦ Ý chạm bucket thật (tệp đã mã hoá, tiền tố rieng/sach/dekiru/).
 */
import 'dotenv/config';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { putObject } from '../../src/config/r2.js';
import { khoaTuEnv, maHoa, giaiMa } from '../../src/services/sachRieng/maHoa.js';
import { khoaR2, type TrackNghe } from '../../src/services/sachRieng/sachRieng.service.js';

const i = process.argv.indexOf('--nguon');
const NGUON = i > 0 ? process.argv[i + 1] : '';

async function main() {
  const khoa = khoaTuEnv();
  if (!khoa) throw new Error('Thiếu SACH_RIENG_KHOA (hex 64 ký tự) trong .env');
  if (!NGUON) throw new Error('Thiếu --nguon <thư mục>');
  const ds: TrackNghe[] = [];
  for (const f of (await readdir(NGUON)).filter((x) => /^L\d\.json$/.test(x)).sort()) {
    ds.push(...(JSON.parse(await readFile(path.join(NGUON, f), 'utf8')) as TrackNghe[]));
  }
  const trung = ds.map((t) => t.track).filter((t, k, a) => a.indexOf(t) !== k);
  if (trung.length) throw new Error(`track trùng: ${trung.join(', ')}`);
  const goi = maHoa(Buffer.from(JSON.stringify(ds)), khoa);
  if (!giaiMa(goi, khoa).length) throw new Error('tự kiểm giải mã hỏng');
  await putObject(khoaR2.nghe, goi, 'application/octet-stream', 'private, no-store');
  console.log(`✓ bản chép nghe: ${ds.length} track (${(goi.length / 1024).toFixed(0)} KB mã hoá)`);
}
main().then(() => process.exit(0)).catch((e) => { console.error('❌', e.message); process.exit(1); });
