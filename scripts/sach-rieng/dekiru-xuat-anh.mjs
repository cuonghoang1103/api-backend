#!/usr/bin/env node
/**
 * 📷 Sách gốc (RIÊNG TƯ) — bước 1: xuất từng trang sách できる日本語 ra ảnh WebP.
 * ─────────────────────────────────────────────────────────────────────────
 * Ảnh ra ở THƯ MỤC NGOÀI KHO (mặc định ~/Documents/JPD123/sach-goc-web/),
 * KHÔNG bao giờ trong repo hay frontend/public: sách có bản quyền, chỉ tài
 * khoản được phép xem (xem src/services/sachRieng/). Bước 2 là
 * `dekiru-huong-dan.mts` (AI soạn hướng dẫn từng trang), bước 3
 * `dekiru-tai-len.mts` (mã hoá + tải lên R2).
 *
 * Số trang = số trang của bản ĐẦY ĐỦ (304 trang, "SƠ CẤP (1).pdf"). Trang nào
 * có trong "BẢN RÕ" (300dpi, đã tăng nét) thì lấy bản rõ — đã đối chiếu ảnh
 * từng trang 29/09/2026: RÕ p.1–132 = đầy đủ p.1–132, RÕ p.133–152 = đầy đủ
 * p.270–289 (ポイント一覧 + 表). Các trang còn lại lấy bản scan đầy đủ.
 *
 *   node scripts/sach-rieng/dekiru-xuat-anh.mjs [--tu 1] [--den 304] [--ra <thư mục>]
 *
 * Cần `pdftoppm` (poppler) và `cwebp` (brew install poppler webp).
 */
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdir, rm, stat } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const run = promisify(execFile);
const arg = (k, d) => {
  const i = process.argv.indexOf(k);
  return i > 0 ? process.argv[i + 1] : d;
};

const GOC = path.join(os.homedir(), 'Documents/JPD123');
const PDF_DU = path.join(GOC, 'SÁCH DEKIRU NIHONGO - SƠ CẤP (1).pdf');
const PDF_RO = path.join(GOC, 'SÁCH DEKIRU - BẢN RÕ (Bài 1-7 + Ngữ pháp).pdf');
const RA = arg('--ra', path.join(GOC, 'sach-goc-web'));
const TU = Number(arg('--tu', 1));
const DEN = Number(arg('--den', 304));
const RONG = 1600; // px — đủ đọc furigana khi phóng to trên iPad
const RONG_NHO = 240; // ảnh thu nhỏ cho dải trang

/** Trang p của bản đầy đủ lấy từ file nào, trang mấy. */
export function nguonTrang(p) {
  if (p >= 1 && p <= 132) return { pdf: PDF_RO, trang: p, ro: true };
  if (p >= 270 && p <= 289) return { pdf: PDF_RO, trang: p - 137, ro: true };
  return { pdf: PDF_DU, trang: p, ro: false };
}

async function coSan(f) {
  try { return (await stat(f)).size > 0; } catch { return false; }
}

async function xuat(p) {
  const ten = `p-${String(p).padStart(3, '0')}`;
  const lon = path.join(RA, 'trang', `${ten}.webp`);
  const nho = path.join(RA, 'nho', `${ten}.webp`);
  if (await coSan(lon) && await coSan(nho)) return 'bỏ qua';
  const { pdf, trang } = nguonTrang(p);
  const tam = path.join(RA, 'tam', ten);
  await run('pdftoppm', ['-f', String(trang), '-l', String(trang), '-scale-to-x', String(RONG), '-scale-to-y', '-1', '-png', '-singlefile', pdf, tam]);
  await run('cwebp', ['-quiet', '-q', '78', `${tam}.png`, '-o', lon]);
  await run('cwebp', ['-quiet', '-q', '60', '-resize', String(RONG_NHO), '0', `${tam}.png`, '-o', nho]);
  await rm(`${tam}.png`, { force: true });
  return 'xong';
}

async function main() {
  for (const d of ['trang', 'nho', 'tam']) await mkdir(path.join(RA, d), { recursive: true });
  const ds = [];
  for (let p = TU; p <= DEN; p++) ds.push(p);
  let i = 0;
  let xong = 0;
  const tho = async () => {
    while (i < ds.length) {
      const p = ds[i++];
      try {
        const kq = await xuat(p);
        xong++;
        if (xong % 20 === 0 || kq !== 'bỏ qua') process.stdout.write(`\r${xong}/${ds.length} (p.${p} ${kq})   `);
      } catch (e) {
        console.error(`\n❌ p.${p}: ${e.message}`);
        process.exitCode = 1;
      }
    }
  };
  await Promise.all(Array.from({ length: Math.max(2, Math.min(8, os.cpus().length - 2)) }, tho));
  await rm(path.join(RA, 'tam'), { recursive: true, force: true });
  console.log(`\nXong: ${xong}/${ds.length} trang → ${RA}`);
}

main();
