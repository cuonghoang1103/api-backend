#!/usr/bin/env node
// Nhúng 14 ảnh PNG vào lap-rap.html thành một trang tự chứa để đăng.
//
// Ảnh KHÔNG nằm trong kho (`.gitignore` loại `anh/` vì sinh lại được).
// Chuỗi đầy đủ từ kho sạch:
//     node gen-stl.mjs ./stl && python3 xem-stl.py stl anh && node dung-trang.mjs
//
// ⚠️ Nguồn ở TRONG KHO chứ không ở scratchpad: scratchpad bị dọn giữa
// chừng hai lần trong phiên 22/08 và mất trắng bản đang soạn.
import { readFileSync, writeFileSync, existsSync } from 'fs';
const ra = process.argv[2] || './trang-lap-rap.html';
let s = readFileSync('lap-rap.html', 'utf8');
const ten = [...s.matchAll(/__IMG_([0-9a-z-]+)__/g)].map(m => m[1]);
for (const n of [...new Set(ten)]) {
  const p = `anh/${n}.png`;
  if (!existsSync(p)) {
    console.error(`THIẾU ${p} — sinh lại bằng:`);
    console.error('  node gen-stl.mjs ./stl && python3 xem-stl.py stl anh');
    process.exit(1);
  }
  s = s.replaceAll(`__IMG_${n}__`, 'data:image/png;base64,' + readFileSync(p).toString('base64'));
}
writeFileSync(ra, s);
console.log(`${ra} · ${[...new Set(ten)].length} ảnh · ${(s.length / 1024).toFixed(0)} KB`);
