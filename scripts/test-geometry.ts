/**
 * Thử bộ dựng hình phẳng: mô tả CẤU TRÚC → toạ độ do mã TÍNH.
 * Dựng đúng hình Bài 60 trong đề Toán 7 (hai đường cắt nhau tại A và B).
 *
 *   npx tsx scripts/test-geometry.ts [thư/mục/ra]
 */
import { writeFileSync } from 'node:fs';
import sharp from 'sharp';
import { dungHinh, type HinhVao } from '../src/services/docTools/geometry.js';

const raDir = process.argv[2] ?? '/tmp';

// Bài 60: đường ry đi qua A, B; đường zt cắt ry tại A; đường mn cắt ry tại B.
// Góc tại A (giữa tia z và tia y) = 124°; góc tại B (giữa tia m và tia y) = 141°.
const BAI_60: HinhVao = {
  rong: 620,
  cao: 420,
  diem: [
    { ten: 'A', x: 0.34, y: 0.30 },
    { ten: 'B', x: 0.72, y: 0.70 },
  ],
  duong: [
    { qua: ['A', 'B'], nhanDau: 'r', nhanCuoi: 'y' },
    { qua: ['A'], huongDo: 22, nhanDau: 'z', nhanCuoi: 't' },
    { qua: ['B'], huongDo: 6, nhanDau: 'm', nhanCuoi: 'n' },
  ],
  goc: [
    { dinh: 'A', tia: ['z', 'y'], do: 124 },
    { dinh: 'B', tia: ['m', 'y'], do: 141 },
  ],
};

// Bài 56: hai đường xy và zt cắt nhau tại O.
const BAI_56: HinhVao = {
  rong: 560,
  cao: 360,
  diem: [{ ten: 'O', x: 0.5, y: 0.5 }],
  duong: [
    { qua: ['O'], huongDo: 145, nhanDau: 'x', nhanCuoi: 'y' },
    { qua: ['O'], huongDo: 28, nhanDau: 'z', nhanCuoi: 't' },
  ],
};

async function xuat(ten: string, hinh: HinhVao): Promise<void> {
  const svg = dungHinh(hinh);
  writeFileSync(`${raDir}/${ten}.svg`, svg);
  const png = await sharp(Buffer.from(svg), { density: 200 }).png().toBuffer();
  writeFileSync(`${raDir}/${ten}.png`, png);
  console.log(`✅ ${raDir}/${ten}.png — ${(png.length / 1024).toFixed(0)}KB`);
}

await xuat('hinh-bai-60', BAI_60);
await xuat('hinh-bai-56', BAI_56);
