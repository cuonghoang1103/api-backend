/**
 * codelab-lab211-starter.mjs — đính bộ khung 8 package (đúng kiến trúc giảng
 * viên LAB211 Fall 2026) làm starterCodeJson cho các bài đã chọn.
 *
 * Vì sao cần: 54/54 bài trên Code Lab đều KHÔNG có starter code, và lời giải
 * sẵn có dùng cấu trúc entity/bo/ui/utils — KHÁC hẳn cấu trúc thầy bắt
 * (constants/dto/main/controller/model/repository/view/utils). Nộp theo cấu
 * trúc kia là "không có cấu trúc → không review".
 *
 * Nguồn: ~/Documents/Lab211_Fall26/HE176322_J1S0055_DoctorManagement/src
 * đã biên dịch sạch và chạy thật (10 file, 9 thông báo lỗi đều đúng).
 *
 *   node scripts/codelab-lab211-starter.mjs           # thử khô
 *   node scripts/codelab-lab211-starter.mjs --apply
 */
import { PrismaClient } from '@prisma/client';
import fs from 'node:fs';
import path from 'node:path';

const prisma = new PrismaClient();
const APPLY = process.argv.includes('--apply');
const GOC = process.env.KHUNG_DIR || '/tmp/khung/src';

// Bài nào → đổi tên thực thể thành gì. P0055 giữ nguyên Doctor (bài mẫu của thầy).
const BAI = [
  { ma: 'P0055', thucThe: 'Doctor',    mo: 'bac si' },
  { ma: 'P0054', thucThe: 'Contact',   mo: 'danh ba' },
  { ma: 'P0056', thucThe: 'Worker',    mo: 'cong nhan' },
  { ma: 'P0066', thucThe: 'Car',       mo: 'xe' },
  { ma: 'P0057', thucThe: 'User',      mo: 'nguoi dung' },
  { ma: 'P0052', thucThe: 'Region',    mo: 'vung dia ly' },
  { ma: 'P0073', thucThe: 'Expense',   mo: 'khoan chi' },
  { ma: 'P0071', thucThe: 'Task',      mo: 'cong viec' },
  { ma: 'P0070', thucThe: 'Account',   mo: 'tai khoan' },
  { ma: 'P0068', thucThe: 'Student',   mo: 'sinh vien' },
];

// Đọc toàn bộ file .java của bộ khung, giữ nguyên đường dẫn tương đối.
function docKhung() {
  const ra = [];
  const di = (thuMuc) => {
    for (const t of fs.readdirSync(thuMuc)) {
      const p = path.join(thuMuc, t);
      if (fs.statSync(p).isDirectory()) di(p);
      else if (t.endsWith('.java')) {
        ra.push({ name: 'src/' + path.relative(GOC, p), language: 'java', code: fs.readFileSync(p, 'utf8') });
      }
    }
  };
  di(GOC);
  // Thứ tự đọc: model → dto → repository → controller → view → utils → constants → main,
  // đúng thứ tự thầy bảo gõ code.
  const uu = ['model', 'dto', 'repository', 'controller', 'view', 'utils', 'constants', 'main'];
  return ra.sort((a, b) => uu.findIndex((u) => a.name.includes('/' + u + '/')) - uu.findIndex((u) => b.name.includes('/' + u + '/')));
}

// Đổi Doctor → <ThucThe> trên cả tên file lẫn nội dung.
function doiTen(files, thucThe, mo) {
  if (thucThe === 'Doctor') return files;
  const thuong = thucThe.charAt(0).toLowerCase() + thucThe.slice(1);
  return files.map((f) => ({
    ...f,
    name: f.name.replace(/Doctor/g, thucThe),
    code: f.code
      .replace(/Doctor/g, thucThe)
      .replace(/doctor/g, thuong)
      // DOCTOR viết hoa nằm trong tên hằng (NO_DOCTOR_AVAILABLE) — đổi cả hai
      // phía nên vẫn khớp nhau, chỉ để tên đọc đúng nghĩa.
      .replace(/DOCTOR/g, thucThe.toUpperCase())
      .replace(/BAC SI/g, thucThe.toUpperCase())
      .replace(/bac si/g, mo),
  }));
}

const goc = docKhung();
if (!goc.length) { console.error(`Không thấy file .java nào trong ${GOC}`); process.exit(1); }
console.log(`Bộ khung: ${goc.length} file — ${goc.map((f) => f.name.split('/').pop()).join(', ')}\n`);

let doi = 0;
for (const b of BAI) {
  const ex = await prisma.codeExercise.findFirst({
    where: { track: { slug: 'lab211' }, title: { contains: b.ma } },
    select: { id: true, title: true, starterCodeJson: true },
  });
  if (!ex) { console.log(`❌ ${b.ma} — không tìm thấy`); continue; }

  const files = doiTen(goc, b.thucThe, b.mo);
  const daCo = Array.isArray(ex.starterCodeJson) ? ex.starterCodeJson.length : 0;
  console.log(`${daCo ? '↻' : '+'} ${b.ma}  ${b.thucThe.padEnd(9)} ${files.length} file  (đang có ${daCo})  ${ex.title.slice(0, 46)}`);

  if (APPLY) {
    await prisma.codeExercise.update({ where: { id: ex.id }, data: { starterCodeJson: files } });
    doi++;
  }
}
console.log(APPLY ? `\n✅ Đã đính starter code cho ${doi} bài.` : '\n(thử khô — thêm --apply để ghi thật)');
await prisma.$disconnect();
