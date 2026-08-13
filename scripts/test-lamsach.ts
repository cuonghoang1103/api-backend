/** So sánh mẩu ảnh cắt TRƯỚC và SAU khi làm sạch.
 *  npx tsx scripts/test-lamsach.ts <ảnh-vào> <thư/mục/ra> */
import { readFileSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';
import { doDoNghieng, lamSachAnh } from '../src/services/docTools/lamSachAnh.js';

const vao = process.argv[2];
const raDir = process.argv[3] ?? '/tmp';
const goc = readFileSync(vao);

const nghieng = await doDoNghieng(goc);
console.log(`độ nghiêng đo được: ${nghieng.toFixed(1)}°`);

const sach = await lamSachAnh(goc, { rongToiThieu: 700 });
writeFileSync(`${raDir}/sach.png`, sach);

// Ghép trước/sau cạnh nhau để nhìn một phát ra ngay
const a = await sharp(goc).resize({ width: 700 }).extend({ bottom: 0 }).png().toBuffer();
const b = await sharp(sach).resize({ width: 700 }).png().toBuffer();
const ma = await sharp(a).metadata();
const mb = await sharp(b).metadata();
const H = Math.max(ma.height ?? 0, mb.height ?? 0);
await sharp({ create: { width: 1420, height: H, channels: 3, background: '#dddddd' } })
  .composite([{ input: a, left: 0, top: 0 }, { input: b, left: 720, top: 0 }])
  .png()
  .toFile(`${raDir}/truoc-sau.png`);
console.log(`✅ ${raDir}/truoc-sau.png (trái = gốc, phải = đã làm sạch)`);
