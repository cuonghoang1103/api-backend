/**
 * academy-doi-chieu-ky.mjs — tìm môn bị gắn SAI KỲ so với khung ngành.
 *
 *   node scripts/academy-doi-chieu-ky.mjs
 *
 * So kỳ trong `frontend/src/data/fptuCurriculum.ts` (khung SE BIT_SE_K20B) với
 * kỳ thật của bản ghi môn trên production.
 *
 * ⚠️ Kết quả 20/09/2026: 9 môn lệch (OTP101, WED201c, MAS291, CSD201, SWR302,
 * SSG105, WDU203c, EXE101, ITE302c). KHÔNG sửa từng ô `semester` — một môn chỉ
 * giữ được MỘT kỳ, mà mỗi ngành xếp một kiểu (SSG105 là Kỳ 5 với SE/GD/DX
 * nhưng Kỳ 4 với IA/IS/IC/AS/RA). Đã sửa GỐC bằng `xepTheoKhung()` trong
 * frontend/src/components/academy/locTheoNganh.ts: khi đã chọn ngành thì trang
 * xếp theo kỳ TRONG KHUNG, không theo ô `semester`.
 *
 * Script này giờ dùng để KIỂM LẠI khi trường đổi chương trình.
 */
import fs from 'node:fs';
const src = fs.readFileSync('frontend/src/data/fptuCurriculum.ts', 'utf8');
const seBlock = src.slice(src.indexOf("id: 'se', curriculumCode: 'BIT_SE_K20B'"));
const semBlock = seBlock.slice(seBlock.indexOf('semesters: {'), seBlock.indexOf('},\n  },'));
const khungTheoKy = {};                       // mã -> kỳ theo KHUNG
for (const m of semBlock.matchAll(/^\s*(\d+):\s*\[([^\]]*)\]/gm)) {
  const ky = Number(m[1]);
  for (const c of m[2].matchAll(/'([^']+)'/g)) {
    const code = c[1].toUpperCase();
    if (!code.includes('*')) khungTheoKy[code] = ky;
  }
}
const sems = (await (await fetch('https://cuongthai.com/api/v1/academy/semesters')).json()).data;
const byId = Object.fromEntries(sems.map((s) => [s.id, s]));
// ordinal → số kỳ thật: KY1/KY2 là 1,2; FPTU_Hola3..9 là 3..9
const soKy = (s) => (s.code.startsWith('KY') ? Number(s.code.slice(2)) : Number(s.code.replace('FPTU_Hola', '')));
const viTri = {};                             // mã -> kỳ theo DB
for (const s of sems) {
  const ds = (await (await fetch('https://cuongthai.com/api/v1/courses/semester/' + s.id + '?gon=1')).json()).data || [];
  for (const c of ds) if (c.courseCode) viTri[c.courseCode.trim().toUpperCase()] = soKy(s);
}
const thieu = [], lech = [];
for (const [ma, ky] of Object.entries(khungTheoKy)) {
  if (!(ma in viTri)) thieu.push(ma + ' (khung: kỳ ' + ky + ')');
  else if (viTri[ma] !== ky) lech.push(ma + ': khung kỳ ' + ky + ' ↔ DB kỳ ' + viTri[ma]);
}
console.log('Khung SE có ' + Object.keys(khungTheoKy).length + ' mã thật\n');
console.log('❌ LỆCH KỲ (' + lech.length + '):');
lech.forEach((x) => console.log('   ' + x));
console.log('\n⚠️ KHÔNG CÓ trên Academy (' + thieu.length + '):');
thieu.forEach((x) => console.log('   ' + x));
