/**
 * 📷 Sách gốc (RIÊNG TƯ) — bước 3: MÃ HOÁ rồi tải ảnh trang + hướng dẫn lên R2.
 * ─────────────────────────────────────────────────────────────────────────
 * Tiền tố `rieng/sach/dekiru/` (xem sachRieng.service.ts). Mã hoá AES-256-GCM
 * bằng `SACH_RIENG_KHOA` trong .env — PHẢI là cùng khoá với máy chủ, không thì
 * máy chủ không giải được. Mất khoá = chạy lại script này với khoá mới
 * (`--lam-lai`) rồi đặt khoá mới lên VPS.
 *
 *   npx tsx scripts/sach-rieng/dekiru-tai-len.mts [--chi-huong-dan] [--lam-lai]
 *
 * Ảnh đã có trên R2 thì bỏ qua (trừ `--lam-lai`); hướng dẫn luôn tải lại
 * (một tệp gộp mọi trang).
 */
import 'dotenv/config';
import { readdir, readFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { headObject, putObject } from '../../src/config/r2.js';
import { khoaTuEnv, maHoa, giaiMa } from '../../src/services/sachRieng/maHoa.js';
import { khoaR2 } from '../../src/services/sachRieng/sachRieng.service.js';
import { chuanHoaMuc, type HuongDanTrang } from '../../src/services/sachRieng/dekiru.js';

const arg = (k: string, d?: string) => {
  const i = process.argv.indexOf(k);
  return i > 0 ? process.argv[i + 1] : d;
};
const NGUON = arg('--nguon', path.join(os.homedir(), 'Documents/JPD123/sach-goc-web'))!;
const LAM_LAI = process.argv.includes('--lam-lai');
const CHI_HD = process.argv.includes('--chi-huong-dan');
const LOAI = 'application/octet-stream';
const CACHE = 'private, no-store';

async function main() {
  const khoa = khoaTuEnv();
  if (!khoa) throw new Error('Thiếu SACH_RIENG_KHOA (hex 64 ký tự) trong .env');

  // 1. Hướng dẫn: gộp mọi p-XXX.json thành một mảng.
  const tepHd = (await readdir(path.join(NGUON, 'huong-dan'))).filter((f) => /^p-\d{3}\.json$/.test(f)).sort();
  const tho0: HuongDanTrang[] = [];
  for (const f of tepHd) tho0.push(JSON.parse(await readFile(path.join(NGUON, 'huong-dan', f), 'utf8')));
  // Soát mục của từng trang (tên in trên sách thắng loại AI tự chọn) — xem chuanHoaMuc.
  const ds = chuanHoaMuc(tho0);
  const goi = maHoa(Buffer.from(JSON.stringify(ds)), khoa);
  if (!giaiMa(goi, khoa).length) throw new Error('tự kiểm giải mã hỏng');
  await putObject(khoaR2.huongDan, goi, LOAI, CACHE);
  console.log(`✓ hướng dẫn: ${ds.length} trang (${(goi.length / 1024).toFixed(0)} KB)`);
  if (CHI_HD) return;

  // 2. Ảnh trang + ảnh nhỏ.
  const tep = (await readdir(path.join(NGUON, 'trang'))).filter((f) => /^p-\d{3}\.webp$/.test(f)).sort();
  let moi = 0;
  let bo = 0;
  let i = 0;
  const tho = async () => {
    while (i < tep.length) {
      const f = tep[i++];
      const p = Number(f.slice(2, 5));
      for (const [thuMuc, key] of [['trang', khoaR2.trang(p)], ['nho', khoaR2.nho(p)]] as const) {
        if (!LAM_LAI && await headObject(key)) { bo++; continue; }
        const du = await readFile(path.join(NGUON, thuMuc, f));
        await putObject(key, maHoa(du, khoa), LOAI, CACHE);
        moi++;
      }
      if ((moi + bo) % 40 === 0) process.stdout.write(`\r${moi} mới, ${bo} bỏ qua…   `);
    }
  };
  await Promise.all(Array.from({ length: 8 }, tho));
  console.log(`\n✓ ảnh: ${moi} tệp mới, ${bo} đã có (tiền tố ${khoaR2.trang(1).replace(/trang\/.*$/, '')})`);
}

main().then(() => process.exit(0)).catch((e) => { console.error('❌', e.message); process.exit(1); });
