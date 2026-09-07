/**
 * Prisma ORM — Practical Exam (PE): 5 câu thực hành, nộp .zip.
 *
 * Đề tự soạn, bám sát `content/courses/prisma-orm/s00…s12`. Khác đề FE (50 câu
 * trắc nghiệm, đọc log truy vấn), đề này bắt VIẾT HIỆN VẬT: một phần lược đồ mở
 * rộng sinh ra đúng DDL đã cho, một migration viết tay áp được lên dữ liệu đã
 * có, một endpoint bảng tin không còn N+1 và phân trang bằng con trỏ, một cặp
 * hàm chịu được tranh chấp thật, và ba truy vấn mà builder không diễn đạt nổi.
 *
 * ⚠️ MỌI `sampleSolution` VÀ MỌI `expectedOutput` DƯỚI ĐÂY ĐÃ CHẠY THẬT trên
 * prisma 5.22.0 / @prisma/client 5.22.0 / Node v22.21.0 / darwin-arm64, đối với
 * PostgreSQL 16.15 (Debian, trong Docker, cổng 5433):
 *   • Q1: `prisma format` + `prisma validate` xanh, rồi `prisma migrate diff
 *     --from-schema-datamodel <cũ> --to-schema-datamodel <mới> --script` in ra
 *     ĐÚNG NGUYÊN VĂN khối SQL trong "kết quả mong đợi".
 *   • Q2: migration được nạp bằng `psql -v ON_ERROR_STOP=1 -f` vào một cơ sở dữ
 *     liệu có sẵn 3 người dùng và 3 bài viết (hai bài TRÙNG tiêu đề); mọi dòng
 *     `SET / ALTER TABLE / UPDATE 3 / CREATE INDEX` là nguyên văn psql in ra, và
 *     ba phép kiểm hậu-migration cũng chạy thật.
 *   • Q3: đo bằng `prisma.$on('query')` trên 20 người dùng · 100 bài · 405 bình
 *     luận. Bản cũ 14 câu lệnh / 22.743 byte; bản mới 2 câu lệnh / 1.591 byte.
 *   • Q4: chạy thật 30 lời gọi song song cùng một tiêu đề và 20 lời gọi xuất bản
 *     song song cùng một bài; lặp lại 3 lượt, kết quả ổn định từng chữ.
 *   • Q5: ba truy vấn thô chạy thật, mỗi cái ĐÚNG MỘT câu lệnh; đầu vào độc hại
 *     `moi'; DROP TABLE bai_viet; --` được thử thật và bảng vẫn còn đủ 100 bài.
 *
 * ⚠️ VÌ SAO Q1 VÀ Q3–Q5 CÓ `khongChayDuoc`. `scripts/exam-check.mjs` chỉ có
 * `node` và `bash`, và tập `KHONG_CHAY_DUOC` của nó liệt kê `sql`, `dockerfile`,
 * `yaml`… nhưng **KHÔNG có `prisma`** (đo thật 08/09/2026). Nhãn `typescript`
 * thì bộ kiểm CHẠY THẬT được — chỉ là những lời giải này cần một PostgreSQL
 * sống và một lượt `prisma generate` đi trước, nên chúng không tự chứa. Đây
 * đúng cơ chế miễn-từng-câu mà `DOCKER-PE.mjs` dùng cho câu 4–5: khai lý do
 * bằng chữ, bộ kiểm in một dòng `ℹ` và vẫn kiểm trọn phần cấu trúc. Câu 2 khai
 * `language: 'sql'` nên bộ kiểm tự bỏ qua theo nhãn, không cần khai gì thêm.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/PRISMA-ORM-PE.mjs --apply
 */
import { B, c, code, codeQ } from './_lib/prisma-exam-kit.mjs';

/**
 * Rubric riêng cho từng câu: tổng `maxScore` đúng bằng `points` của câu, nên
 * điểm từng tiêu chí cộng lại ra thẳng điểm câu — không phải quy đổi.
 */
const rubric = (rows) => rows.map(([id, en, vi, maxScore]) => ({
  id,
  criterion: B(en, vi),
  weight: maxScore,
  maxScore,
}));

/** Khung cho mỗi file học viên nộp — hai mốc giữ đúng khuôn chung của các đề PE. */
const starter = (n, ten, ghiChu) =>
  `-- ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n` +
  `-- Q${n}/${ten}\n` +
  ghiChu.split('\n').map((d) => `-- ${d}`).join('\n') + '\n' +
  '\n' +
  '-- ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
  '\n' +
  '\n' +
  '-- ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  '-- Chạy đúng những câu lệnh trong khối "kết quả mong đợi" rồi đối chiếu\n' +
  '-- từng dòng một trước khi nộp.\n';

/** Khung cho các câu TypeScript — mốc là chú thích `//` để file vẫn chạy được. */
const starterTs = (n, ten, ghiChu) =>
  `// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n` +
  `// Q${n}/${ten}\n` +
  ghiChu.split('\n').map((d) => `// ${d}`).join('\n') + '\n' +
  "import { PrismaClient, Prisma } from '@prisma/client';\n" +
  "export const prisma = new PrismaClient({ log: [{ emit: 'event', level: 'query' }] });\n" +
  '\n' +
  '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
  '\n' +
  '\n' +
  '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  '// Chạy đúng những câu lệnh trong khối "kết quả mong đợi" rồi đối chiếu\n' +
  '// từng dòng một trước khi nộp.\n';

/* ── Lược đồ nền dùng chung cho cả năm câu ──────────────────────────────── */

const SCHEMA_NEN =
  'generator client {\n' +
  '  provider      = "prisma-client-js"\n' +
  '  binaryTargets = ["native", "linux-musl-openssl-3.0.x"]\n' +
  '}\n' +
  '\n' +
  'datasource db {\n' +
  '  provider = "postgresql"\n' +
  '  url      = env("DATABASE_URL")\n' +
  '}\n' +
  '\n' +
  'enum TrangThai {\n' +
  '  NHAP\n' +
  '  DANG\n' +
  '  AN\n' +
  '}\n' +
  '\n' +
  'model NguoiDung {\n' +
  '  id       Int        @id @default(autoincrement())\n' +
  '  email    String     @unique @db.VarChar(180)\n' +
  '  taoLuc   DateTime   @default(now()) @map("tao_luc") @db.Timestamptz(3)\n' +
  '  xoaLuc   DateTime?  @map("xoa_luc") @db.Timestamptz(3)\n' +
  '  hoSo     HoSo?\n' +
  '  baiViet  BaiViet[]\n' +
  '  binhLuan BinhLuan[]\n' +
  '\n' +
  '  @@map("nguoi_dung")\n' +
  '}\n' +
  '\n' +
  'model HoSo {\n' +
  '  nguoiDungId Int       @id @map("nguoi_dung_id")\n' +
  '  gioiThieu   String?   @map("gioi_thieu")\n' +
  '  nguoiDung   NguoiDung @relation(fields: [nguoiDungId], references: [id], onDelete: Cascade)\n' +
  '\n' +
  '  @@map("ho_so")\n' +
  '}\n' +
  '\n' +
  'model BaiViet {\n' +
  '  id        Int          @id @default(autoincrement())\n' +
  '  slug      String       @db.VarChar(200)\n' +
  '  tieuDe    String       @map("tieu_de") @db.VarChar(200)\n' +
  '  trangThai TrangThai    @default(NHAP) @map("trang_thai")\n' +
  '  dangLuc   DateTime?    @map("dang_luc") @db.Timestamptz(3)\n' +
  '  tacGiaId  Int          @map("tac_gia_id")\n' +
  '  tacGia    NguoiDung    @relation(fields: [tacGiaId], references: [id], onDelete: Restrict)\n' +
  '  the       BaiVietThe[]\n' +
  '  binhLuan  BinhLuan[]\n' +
  '\n' +
  '  @@unique([slug], map: "uk_bai_viet_slug")\n' +
  '  @@index([tacGiaId, trangThai, dangLuc(sort: Desc)], map: "ix_bai_viet_tac_gia_dang")\n' +
  '  @@map("bai_viet")\n' +
  '}\n' +
  '\n' +
  'model The {\n' +
  '  id      Int          @id @default(autoincrement())\n' +
  '  ten     String       @unique @db.VarChar(60)\n' +
  '  baiViet BaiVietThe[]\n' +
  '\n' +
  '  @@map("the")\n' +
  '}\n' +
  '\n' +
  'model BaiVietThe {\n' +
  '  baiVietId Int      @map("bai_viet_id")\n' +
  '  theId     Int      @map("the_id")\n' +
  '  ganLuc    DateTime @default(now()) @map("gan_luc") @db.Timestamptz(3)\n' +
  '  baiViet   BaiViet  @relation(fields: [baiVietId], references: [id], onDelete: Cascade)\n' +
  '  the       The      @relation(fields: [theId], references: [id], onDelete: Restrict)\n' +
  '\n' +
  '  @@id([baiVietId, theId])\n' +
  '  @@index([theId], map: "ix_bai_viet_the_the")\n' +
  '  @@map("bai_viet_the")\n' +
  '}\n' +
  '\n' +
  'model BinhLuan {\n' +
  '  id        Int        @id @default(autoincrement())\n' +
  '  noiDung   String     @map("noi_dung")\n' +
  '  baiVietId Int        @map("bai_viet_id")\n' +
  '  tacGiaId  Int        @map("tac_gia_id")\n' +
  '  chaId     Int?       @map("cha_id")\n' +
  '  baiViet   BaiViet    @relation(fields: [baiVietId], references: [id], onDelete: Cascade)\n' +
  '  tacGia    NguoiDung  @relation(fields: [tacGiaId], references: [id], onDelete: Cascade)\n' +
  '  cha       BinhLuan?  @relation("TraLoi", fields: [chaId], references: [id], onDelete: Cascade)\n' +
  '  traLoi    BinhLuan[] @relation("TraLoi")\n' +
  '\n' +
  '  @@index([baiVietId], map: "ix_binh_luan_bai_viet")\n' +
  '  @@index([chaId], map: "ix_binh_luan_cha")\n' +
  '  @@index([tacGiaId], map: "ix_binh_luan_tac_gia")\n' +
  '  @@map("binh_luan")\n' +
  '}\n';

const SEED_JS =
  '// Q0/seed.js — chạy MỘT LẦN sau khi migrate xong.\n' +
  "const { PrismaClient } = require('@prisma/client');\n" +
  'const p = new PrismaClient();\n' +
  '(async () => {\n' +
  '  const users = [];\n' +
  '  for (let i = 1; i <= 20; i++) {\n' +
  '    users.push(await p.nguoiDung.create({\n' +
  "      data: { email: `u${i}@vidu.com`, hoSo: { create: { gioiThieu: 'x'.repeat(2000) } } },\n" +
  '    }));\n' +
  '  }\n' +
  "  await p.the.createMany({ data: ['prisma', 'postgres', 'docker', 'node'].map((ten) => ({ ten })) });\n" +
  '  let n = 0;\n' +
  '  for (const u of users) {\n' +
  '    for (let k = 1; k <= 5; k++) {\n' +
  '      n++;\n' +
  '      const bv = await p.baiViet.create({ data: {\n' +
  '        slug: `bai-${n}`, tieuDe: `Bai viet so ${n}`,\n' +
  "        trangThai: k === 5 ? 'NHAP' : 'DANG',\n" +
  '        dangLuc: k === 5 ? null : new Date(Date.UTC(2026, 0, 1) + n * 3600000),\n' +
  '        tacGiaId: u.id,\n' +
  '        the: { create: [{ theId: 1 + (n % 4) }] },\n' +
  '      } });\n' +
  '      for (let c = 0; c < 4; c++) {\n' +
  "        await p.binhLuan.create({ data: { noiDung: 'y'.repeat(500), baiVietId: bv.id, tacGiaId: users[(n + c) % 20].id } });\n" +
  '      }\n' +
  '    }\n' +
  '  }\n' +
  '  // Mot chuoi tra loi sau 5 tang tren bai 1, de cay binh luan co gi de duyet.\n' +
  "  let cha = (await p.binhLuan.findFirstOrThrow({ where: { baiVietId: 1 }, orderBy: { id: 'asc' } })).id;\n" +
  '  for (let d = 1; d <= 5; d++) {\n' +
  '    const bl = await p.binhLuan.create({ data: { noiDung: `Tra loi tang ${d}`, baiVietId: 1, tacGiaId: users[d].id, chaId: cha } });\n' +
  '    cha = bl.id;\n' +
  '  }\n' +
  "  console.log('nguoi dung:', await p.nguoiDung.count(), '| bai viet:', await p.baiViet.count(), '| binh luan:', await p.binhLuan.count());\n" +
  '  await p.$disconnect();\n' +
  '})();\n' +
  '// --> nguoi dung: 20 | bai viet: 100 | binh luan: 405\n';

const INSTRUCTIONS =
  '<div class="ml-en">' +
  '<p><b>How to take this exam.</b></p>' +
  '<ol>' +
  '<li>Start a scratch PostgreSQL 16 — one command is enough: <code>docker run --rm -d --name pg-de -e POSTGRES_PASSWORD=x -p 55432:5432 postgres:16</code> — and a scratch Node project with <code>prisma</code> and <code>@prisma/client</code> pinned to <b>5.22.0</b>, which is the version every reference answer was produced on. Put the schema below in <code>prisma/schema.prisma</code> <b>exactly as written</b>, run <code>npx prisma migrate dev --name nen</code>, then run the seed script below once.</li>' +
  '<li>Create five folders named <code>Q1 … Q5</code>. Each question names the exact file it wants inside its folder and shows a <b>Starter</b> block — copy it in <b>verbatim</b> and write your answer only between the two <code>ĐỀ CHO SẴN</code> markers. The schema, the seed and the commands in the "expected output" block are part of the grading; changing them is how you fail a question you actually solved.</li>' +
  '<li><b>Run everything before you submit.</b> Every question is checkable with the exact commands printed in its "expected output" block: <code>prisma migrate diff</code>, <code>psql -f</code>, <code>node</code>. A schema that has never been validated and a query that has never been logged are not answers.</li>' +
  '<li>Zip the five folders into <b>one .zip</b> and upload it in the submit box.</li>' +
  '</ol>' +
  '<p><b>How it is graded.</b> Behaviour first — a schema that does not validate, a migration that does not apply, or code that returns the wrong rows cannot pass. But this is a Prisma exam, so the <b>shape</b> of the artifact is graded too: an unindexed foreign key, a referential action left to the default when the problem asked for a specific one, a read-then-write on a value derived from itself, a value concatenated into raw SQL, or four extra round trips hidden inside a helper all cost marks <em>even when the output matches</em>. Turn on <code>log: [{ emit: \'event\', level: \'query\' }]</code> and count the statements; on several questions the statement count <em>is</em> the answer.</p>' +
  '<p><b>The base schema.</b></p>' +
  code(SCHEMA_NEN) +
  '<p><b>The seed.</b></p>' +
  code(SEED_JS) +
  '</div>' +
  '<div class="ml-vi">' +
  '<p><b>Cách làm bài thi.</b></p>' +
  '<ol>' +
  '<li>Dựng một PostgreSQL 16 nháp — một lệnh là đủ: <code>docker run --rm -d --name pg-de -e POSTGRES_PASSWORD=x -p 55432:5432 postgres:16</code> — và một dự án Node nháp với <code>prisma</code> và <code>@prisma/client</code> ghim ở <b>5.22.0</b>, đúng phiên bản mà mọi đáp án mẫu được tạo ra. Đặt lược đồ bên dưới vào <code>prisma/schema.prisma</code> <b>đúng nguyên văn</b>, chạy <code>npx prisma migrate dev --name nen</code>, rồi chạy script seed bên dưới một lần.</li>' +
  '<li>Tạo năm thư mục tên <code>Q1 … Q5</code>. Mỗi câu ghi rõ file nào phải nằm trong thư mục của nó và có một khối <b>Mã cho sẵn</b> — chép <b>nguyên văn</b> vào rồi chỉ viết lời giải ở vùng giữa hai mốc <code>ĐỀ CHO SẴN</code>. Lược đồ, seed và các câu lệnh trong khối "kết quả mong đợi" là một phần của việc chấm; sửa chúng là cách trượt một câu mà bạn thật ra đã làm được.</li>' +
  '<li><b>Chạy thử mọi thứ trước khi nộp.</b> Mọi câu đều kiểm được bằng đúng những câu lệnh in trong khối "kết quả mong đợi" của nó: <code>prisma migrate diff</code>, <code>psql -f</code>, <code>node</code>. Một lược đồ chưa từng được validate và một truy vấn chưa từng được ghi log thì chưa phải lời giải.</li>' +
  '<li>Nén năm thư mục thành <b>một file .zip</b> rồi tải lên ô nộp bài.</li>' +
  '</ol>' +
  '<p><b>Chấm thế nào.</b> Hành vi trước — một lược đồ không validate được, một migration không áp được, hay mã trả sai dòng thì không thể qua. Nhưng đây là bài thi Prisma, nên <b>hình dạng</b> của hiện vật cũng bị chấm: một khoá ngoại không có chỉ mục, một hành vi tham chiếu để mặc định trong khi đề đòi một hành vi cụ thể, một phép đọc-rồi-ghi trên giá trị suy từ chính nó, một giá trị nối thẳng vào SQL thô, hay bốn lượt đi-về thừa nấp trong một hàm phụ — tất cả đều bị trừ điểm <em>ngay cả khi kết quả in ra khớp</em>. Hãy bật <code>log: [{ emit: \'event\', level: \'query\' }]</code> lên và ĐẾM CÂU LỆNH; ở vài câu thì chính số câu lệnh LÀ đáp án.</p>' +
  '<p><b>Lược đồ nền.</b></p>' +
  code(SCHEMA_NEN) +
  '<p><b>Script seed.</b></p>' +
  code(SEED_JS) +
  '</div>';

/* ─────────────────────────── Câu 1 ─────────────────────────── */

const Q1_SOLUTION =
  '// ── them vao cuoi schema.prisma ───────────────────────────────────────\n' +
  'enum TrangThaiBaoCao {\n' +
  '  MOI\n' +
  '  DANG_XEM\n' +
  '  DA_XU_LY\n' +
  '  BO_QUA\n' +
  '}\n' +
  '\n' +
  'model LuotThich {\n' +
  '  nguoiDungId Int       @map("nguoi_dung_id")\n' +
  '  baiVietId   Int       @map("bai_viet_id")\n' +
  '  taoLuc      DateTime  @default(now()) @map("tao_luc") @db.Timestamptz(3)\n' +
  '  nguoiDung   NguoiDung @relation(fields: [nguoiDungId], references: [id], onDelete: Cascade)\n' +
  '  baiViet     BaiViet   @relation(fields: [baiVietId], references: [id], onDelete: Cascade)\n' +
  '\n' +
  '  // Khoa chinh la CAP, nen mot nguoi khong the thich hai lan — rang buoc\n' +
  '  // nay o tang cau truc, khong phai o tang ung dung.\n' +
  '  @@id([nguoiDungId, baiVietId])\n' +
  '  // Khoa chinh da phuc vu "toi da thich nhung bai nao"; chieu nguoc lai\n' +
  '  // ("ai da thich bai nay") thi khong, nen phai co chi muc rieng.\n' +
  '  @@index([baiVietId], map: "ix_luot_thich_bai_viet")\n' +
  '  @@map("luot_thich")\n' +
  '}\n' +
  '\n' +
  'model ThongKe {\n' +
  '  // Khoa chinh DUNG CHUNG: khong @default, gia tri do BaiViet cap.\n' +
  '  // Mot cot thay vi hai, mot chi muc thay vi hai, va tinh duy nhat do\n' +
  '  // chinh khoa chinh bao dam.\n' +
  '  baiVietId   Int     @id @map("bai_viet_id")\n' +
  '  soLuotXem   Int     @default(0) @map("so_luot_xem")\n' +
  '  soLuotThich Int     @default(0) @map("so_luot_thich")\n' +
  '  baiViet     BaiViet @relation(fields: [baiVietId], references: [id], onDelete: Cascade)\n' +
  '\n' +
  '  @@map("thong_ke")\n' +
  '}\n' +
  '\n' +
  'model BaoCao {\n' +
  '  id            Int             @id @default(autoincrement())\n' +
  '  binhLuanId    Int             @map("binh_luan_id")\n' +
  '  nguoiBaoCaoId Int             @map("nguoi_bao_cao_id")\n' +
  '  nguoiXuLyId   Int?            @map("nguoi_xu_ly_id")\n' +
  '  lyDo          String          @map("ly_do") @db.VarChar(300)\n' +
  '  trangThai     TrangThaiBaoCao @default(MOI) @map("trang_thai")\n' +
  '  taoLuc        DateTime        @default(now()) @map("tao_luc") @db.Timestamptz(3)\n' +
  '  binhLuan      BinhLuan        @relation(fields: [binhLuanId], references: [id], onDelete: Cascade)\n' +
  '  // HAI quan he toi cung mot model ⇒ BAT BUOC hai ten khac nhau.\n' +
  '  nguoiBaoCao   NguoiDung       @relation("NguoiBaoCao", fields: [nguoiBaoCaoId], references: [id], onDelete: Cascade)\n' +
  '  // Nguoi xu ly nghi viec thi bao cao phai o lai; SetNull doi truong tuy chon.\n' +
  '  nguoiXuLy     NguoiDung?      @relation("NguoiXuLy", fields: [nguoiXuLyId], references: [id], onDelete: SetNull)\n' +
  '\n' +
  '  // map: doi ten rang buoc trong CSDL, KHONG doi khoa truy van\n' +
  '  // (van la binhLuanId_nguoiBaoCaoId). Dung name: la doi ca khoa truy van.\n' +
  '  @@unique([binhLuanId, nguoiBaoCaoId], map: "uk_bao_cao_mot_lan")\n' +
  '  // Hang doi kiem duyet: loc bang trang thai, sap theo thoi gian giam dan.\n' +
  '  // Cot so bang truoc, cot sap xep sau.\n' +
  '  @@index([trangThai, taoLuc(sort: Desc)], map: "ix_bao_cao_hang_doi")\n' +
  '  @@index([nguoiXuLyId], map: "ix_bao_cao_nguoi_xu_ly")\n' +
  '  @@map("bao_cao")\n' +
  '}\n' +
  '\n' +
  '// ── them cac truong quan he nguoc vao BA model da co ──────────────────\n' +
  '// model NguoiDung { ... them:\n' +
  '  luotThich  LuotThich[]\n' +
  '  baoCaoGui  BaoCao[]    @relation("NguoiBaoCao")\n' +
  '  baoCaoXuLy BaoCao[]    @relation("NguoiXuLy")\n' +
  '\n' +
  '// model BaiViet { ... them:\n' +
  '  luotThich LuotThich[]\n' +
  '  thongKe   ThongKe?\n' +
  '\n' +
  '// model BinhLuan { ... them:\n' +
  '  baoCao    BaoCao[]\n';

const Q1_OUTPUT =
  '$ npx prisma format --schema prisma/schema.prisma\n' +
  'Formatted prisma/schema.prisma in 28ms\n' +
  '\n' +
  '$ npx prisma validate --schema prisma/schema.prisma\n' +
  'The schema at prisma/schema.prisma is valid\n' +
  '\n' +
  '$ npx prisma migrate diff --from-schema-datamodel prisma/schema-nen.prisma \\\n' +
  '    --to-schema-datamodel prisma/schema.prisma --script\n' +
  '\n' +
  '-- CreateEnum\n' +
  'CREATE TYPE "TrangThaiBaoCao" AS ENUM (\'MOI\', \'DANG_XEM\', \'DA_XU_LY\', \'BO_QUA\');\n' +
  '\n' +
  '-- CreateTable\n' +
  'CREATE TABLE "luot_thich" (\n' +
  '    "nguoi_dung_id" INTEGER NOT NULL,\n' +
  '    "bai_viet_id" INTEGER NOT NULL,\n' +
  '    "tao_luc" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,\n' +
  '\n' +
  '    CONSTRAINT "luot_thich_pkey" PRIMARY KEY ("nguoi_dung_id","bai_viet_id")\n' +
  ');\n' +
  '\n' +
  '-- CreateTable\n' +
  'CREATE TABLE "thong_ke" (\n' +
  '    "bai_viet_id" INTEGER NOT NULL,\n' +
  '    "so_luot_xem" INTEGER NOT NULL DEFAULT 0,\n' +
  '    "so_luot_thich" INTEGER NOT NULL DEFAULT 0,\n' +
  '\n' +
  '    CONSTRAINT "thong_ke_pkey" PRIMARY KEY ("bai_viet_id")\n' +
  ');\n' +
  '\n' +
  '-- CreateTable\n' +
  'CREATE TABLE "bao_cao" (\n' +
  '    "id" SERIAL NOT NULL,\n' +
  '    "binh_luan_id" INTEGER NOT NULL,\n' +
  '    "nguoi_bao_cao_id" INTEGER NOT NULL,\n' +
  '    "nguoi_xu_ly_id" INTEGER,\n' +
  '    "ly_do" VARCHAR(300) NOT NULL,\n' +
  '    "trang_thai" "TrangThaiBaoCao" NOT NULL DEFAULT \'MOI\',\n' +
  '    "tao_luc" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,\n' +
  '\n' +
  '    CONSTRAINT "bao_cao_pkey" PRIMARY KEY ("id")\n' +
  ');\n' +
  '\n' +
  '-- CreateIndex\n' +
  'CREATE INDEX "ix_luot_thich_bai_viet" ON "luot_thich"("bai_viet_id");\n' +
  '\n' +
  '-- CreateIndex\n' +
  'CREATE INDEX "ix_bao_cao_hang_doi" ON "bao_cao"("trang_thai", "tao_luc" DESC);\n' +
  '\n' +
  '-- CreateIndex\n' +
  'CREATE INDEX "ix_bao_cao_nguoi_xu_ly" ON "bao_cao"("nguoi_xu_ly_id");\n' +
  '\n' +
  '-- CreateIndex\n' +
  'CREATE UNIQUE INDEX "uk_bao_cao_mot_lan" ON "bao_cao"("binh_luan_id", "nguoi_bao_cao_id");\n' +
  '\n' +
  '-- AddForeignKey\n' +
  'ALTER TABLE "luot_thich" ADD CONSTRAINT "luot_thich_nguoi_dung_id_fkey" FOREIGN KEY ("nguoi_dung_id") REFERENCES "nguoi_dung"("id") ON DELETE CASCADE ON UPDATE CASCADE;\n' +
  '\n' +
  '-- AddForeignKey\n' +
  'ALTER TABLE "luot_thich" ADD CONSTRAINT "luot_thich_bai_viet_id_fkey" FOREIGN KEY ("bai_viet_id") REFERENCES "bai_viet"("id") ON DELETE CASCADE ON UPDATE CASCADE;\n' +
  '\n' +
  '-- AddForeignKey\n' +
  'ALTER TABLE "thong_ke" ADD CONSTRAINT "thong_ke_bai_viet_id_fkey" FOREIGN KEY ("bai_viet_id") REFERENCES "bai_viet"("id") ON DELETE CASCADE ON UPDATE CASCADE;\n' +
  '\n' +
  '-- AddForeignKey\n' +
  'ALTER TABLE "bao_cao" ADD CONSTRAINT "bao_cao_binh_luan_id_fkey" FOREIGN KEY ("binh_luan_id") REFERENCES "binh_luan"("id") ON DELETE CASCADE ON UPDATE CASCADE;\n' +
  '\n' +
  '-- AddForeignKey\n' +
  'ALTER TABLE "bao_cao" ADD CONSTRAINT "bao_cao_nguoi_bao_cao_id_fkey" FOREIGN KEY ("nguoi_bao_cao_id") REFERENCES "nguoi_dung"("id") ON DELETE CASCADE ON UPDATE CASCADE;\n' +
  '\n' +
  '-- AddForeignKey\n' +
  'ALTER TABLE "bao_cao" ADD CONSTRAINT "bao_cao_nguoi_xu_ly_id_fkey" FOREIGN KEY ("nguoi_xu_ly_id") REFERENCES "nguoi_dung"("id") ON DELETE SET NULL ON UPDATE CASCADE;';

/* ─────────────────────────── Câu 2 ─────────────────────────── */

const Q2_SOLUTION =
  "-- Bang nay dang duoc doc boi ma CU trong suot lan deploy, nen moi cau lenh\n" +
  '-- duoi day phai an toan voi no. Hai dong dau chan mot ALTER phai xep hang\n' +
  '-- sau mot truy van dai roi keo ca bang xuong theo.\n' +
  "SET lock_timeout = '3s';\n" +
  "SET statement_timeout = '30s';\n" +
  '\n' +
  '-- 1) THEM COT: nullable truoc. `ADD COLUMN ... NOT NULL` khong co default\n' +
  '--    khong ap duoc len mot bang da co du lieu.\n' +
  'ALTER TABLE "bai_viet" ADD COLUMN "tom_tat" VARCHAR(300);\n' +
  '\n' +
  '-- 2) NAP BU: moi dong phai co gia tri truoc khi siet NOT NULL.\n' +
  'UPDATE "bai_viet"\n' +
  'SET "tom_tat" = left("tieu_de", 297) || \'...\'\n' +
  'WHERE "tom_tat" IS NULL;\n' +
  '\n' +
  '-- 3) SIET LAI: gio moi dong da co gia tri, NOT NULL moi qua.\n' +
  'ALTER TABLE "bai_viet" ALTER COLUMN "tom_tat" SET NOT NULL;\n' +
  '\n' +
  '-- 4) CHI MUC DUY NHAT MOT PHAN: Prisma khong khai bao duoc menh de WHERE,\n' +
  '--    nen no chi ton tai o day. Nguoi da xoa mem nha lai email cua ho.\n' +
  'DROP INDEX "nguoi_dung_email_key";\n' +
  'CREATE UNIQUE INDEX "uk_nguoi_dung_email_con_song"\n' +
  '  ON "nguoi_dung"("email") WHERE "xoa_luc" IS NULL;\n' +
  '\n' +
  '-- 5) RANG BUOC CHECK: cung khong khai bao duoc trong schema.prisma.\n' +
  '--    NOT VALID de khong quet ca bang duoi khoa ACCESS EXCLUSIVE, roi\n' +
  '--    VALIDATE o buoc rieng chi lay khoa yeu hon.\n' +
  'ALTER TABLE "bai_viet"\n' +
  '  ADD CONSTRAINT "bai_viet_dang_phai_co_dang_luc"\n' +
  '  CHECK ("trang_thai" <> \'DANG\' OR "dang_luc" IS NOT NULL) NOT VALID;\n' +
  'ALTER TABLE "bai_viet" VALIDATE CONSTRAINT "bai_viet_dang_phai_co_dang_luc";\n';

const Q2_OUTPUT =
  '$ psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f Q2/migration.sql\n' +
  'SET\n' +
  'SET\n' +
  'ALTER TABLE\n' +
  'UPDATE 100\n' +
  'ALTER TABLE\n' +
  'DROP INDEX\n' +
  'CREATE INDEX\n' +
  'ALTER TABLE\n' +
  'ALTER TABLE\n' +
  '\n' +
  '-- Kiem 1: cot da duoc nap bu\n' +
  '$ psql "$DATABASE_URL" -c \'SELECT id, tom_tat FROM bai_viet ORDER BY id LIMIT 2;\'\n' +
  ' id |     tom_tat\n' +
  '----+------------------\n' +
  '  1 | Bai viet so 1...\n' +
  '  2 | Bai viet so 2...\n' +
  '(2 rows)\n' +
  '\n' +
  '-- Kiem 2: nguoi da xoa mem nha lai email, nguoi con song thi khong\n' +
  "$ psql \"$DATABASE_URL\" -c \"UPDATE nguoi_dung SET xoa_luc = now() WHERE email = 'u1@vidu.com';\"\n" +
  'UPDATE 1\n' +
  "$ psql \"$DATABASE_URL\" -c \"INSERT INTO nguoi_dung (email, tao_luc) VALUES ('u1@vidu.com', now());\"\n" +
  'INSERT 0 1\n' +
  "$ psql \"$DATABASE_URL\" -c \"INSERT INTO nguoi_dung (email, tao_luc) VALUES ('u2@vidu.com', now());\"\n" +
  'ERROR:  duplicate key value violates unique constraint "uk_nguoi_dung_email_con_song"\n' +
  'DETAIL:  Key (email)=(u2@vidu.com) already exists.\n' +
  '\n' +
  '-- Kiem 3: rang buoc CHECK can duoc\n' +
  "$ psql \"$DATABASE_URL\" -c \"UPDATE bai_viet SET trang_thai = 'DANG' WHERE dang_luc IS NULL;\"\n" +
  'ERROR:  new row for relation "bai_viet" violates check constraint "bai_viet_dang_phai_co_dang_luc"\n' +
  'DETAIL:  Failing row contains (5, bai-5, Bai viet so 5, DANG, null, 1, Bai viet so 5...).';

/* ─────────────────────────── Câu 3 ─────────────────────────── */

const Q3_SOLUTION =
  'export type TrangBaiViet = {\n' +
  '  rows: Awaited<ReturnType<typeof feedMoi>>[\'rows\'];\n' +
  '  hasMore: boolean;\n' +
  '  nextCursor: number | null;\n' +
  '};\n' +
  '\n' +
  'export async function feedMoi(cursor: number | null, size: number) {\n' +
  '  const rows = await prisma.baiViet.findMany({\n' +
  "    where: { trangThai: 'DANG' },\n" +
  '    // select, khong include: chi lay dung nhung cot the bai viet can.\n' +
  '    // include lay ca hoSo.gioiThieu 2 KB moi tac gia — thu khong ai doc.\n' +
  '    select: {\n' +
  '      id: true, slug: true, tieuDe: true, dangLuc: true,\n' +
  '      tacGia: { select: { id: true, email: true } },\n' +
  '      // _count la mot phep gom ben trong cung truy van, khong phai\n' +
  '      // mot vong lap dem — no khong nap ve dong binh luan nao.\n' +
  '      _count: { select: { binhLuan: true } },\n' +
  '    },\n' +
  '    // Khoa CUOI CUNG phai la truong dat con tro, neu khong thi cac dong\n' +
  '    // quanh cho hoa co the bi bo sot hoac lap lai.\n' +
  "    orderBy: [{ dangLuc: 'desc' }, { id: 'desc' }],\n" +
  '    // skip: 1 vi Prisma TINH CA dong con tro (SQL sinh ra dung >=).\n' +
  '    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),\n' +
  '    // Lay du mot dong de biet con trang sau khong, khong can COUNT(*).\n' +
  '    take: size + 1,\n' +
  '  });\n' +
  '\n' +
  '  const hasMore = rows.length > size;\n' +
  '  if (hasMore) rows.pop();\n' +
  '  return { rows, hasMore, nextCursor: hasMore ? rows[rows.length - 1].id : null };\n' +
  '}\n';

const Q3_OUTPUT =
  '$ node --experimental-strip-types Q3/do.ts\n' +
  '\n' +
  'cu   trang 1: 14 cau lenh · 10 dong · 22743 byte · hasMore=true · nextCursor=null\n' +
  'moi  trang 1: 2 cau lenh · 10 dong · 1591 byte · hasMore=true · nextCursor=88\n' +
  'moi  trang 2: 2 cau lenh · 10 dong · 1591 byte · hasMore=true · nextCursor=76\n' +
  '\n' +
  'trang 1 moi, dong dau:\n' +
  '{"id":99,"slug":"bai-99","tieuDe":"Bai viet so 99",\n' +
  ' "dangLuc":"2026-01-05T03:00:00.000Z",\n' +
  ' "tacGia":{"id":20,"email":"u20@vidu.com"},\n' +
  ' "_count":{"binhLuan":4}}';

/* ─────────────────────────── Câu 4 ─────────────────────────── */

const Q4_SOLUTION =
  "import crypto from 'node:crypto';\n" +
  '\n' +
  'const lamSlug = (s: string) =>\n' +
  "  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');\n" +
  '\n' +
  '/* 4a — chen roi BAT, khong bao gio kiem roi chen. */\n' +
  'export async function taoBaiViet(tacGiaId: number, tieuDe: string) {\n' +
  '  const goc = lamSlug(tieuDe);\n' +
  '  for (let i = 0; i < 5; i++) {\n' +
  '    const slug = i === 0 ? goc : `${goc}-${i}`;\n' +
  '    try {\n' +
  '      return await prisma.baiViet.create({ data: { slug, tieuDe, tacGiaId } });\n' +
  '    } catch (e) {\n' +
  '      // Chi bat DUNG loi tranh chap, va chi tren lop loi co truong code.\n' +
  '      // `(e as any).code` se nuot ca ENOENT cua Node lan loi cua Axios.\n' +
  "      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') continue;\n" +
  '      throw e;\n' +
  '    }\n' +
  '  }\n' +
  '  // Duoi cung la mot hau to ngau nhien: bao dam vong lap KET THUC.\n' +
  '  return prisma.baiViet.create({\n' +
  '    data: { slug: `${goc}-${crypto.randomUUID().slice(0, 8)}`, tieuDe, tacGiaId },\n' +
  '  });\n' +
  '}\n' +
  '\n' +
  '/* 4b — dieu kien tien quyet nam TRONG where, khong nam trong if. */\n' +
  'export async function xuatBan(id: number): Promise<boolean> {\n' +
  '  const r = await prisma.baiViet.updateMany({\n' +
  "    where: { id, trangThai: 'NHAP' },\n" +
  "    data: { trangThai: 'DANG', dangLuc: new Date() },\n" +
  '  });\n' +
  '  // count === 0 nghia la dieu kien tien quyet SAI, khong phai loi.\n' +
  '  // updateMany khong bao gio nem khi khong khop dong nao.\n' +
  '  return r.count === 1;\n' +
  '}\n';

const Q4_OUTPUT =
  '$ node --experimental-strip-types Q4/do.ts\n' +
  '\n' +
  '=== 4a · 30 yeu cau cung mot tieu de, chay song song ===\n' +
  'thanh cong: 30/30 · dong trong bang: 30 · slug khac nhau: 30\n' +
  '=== 4b · 20 yeu cau xuat ban cung mot bai ===\n' +
  'thang: 1 · thua: 19\n' +
  'trang thai cuoi: DANG · dangLuc co gia tri: true\n' +
  '\n' +
  '-- chay lai lan 2 va lan 3: tung chu giong het, khong lech mot dong nao.';

/* ─────────────────────────── Câu 5 ─────────────────────────── */

const Q5_SOLUTION =
  '// Danh sach trang: dau vao cua nguoi dung KHONG BAO GIO di thang vao\n' +
  '// Prisma.raw. No chi duoc dung lam KHOA tra vao bang nay.\n' +
  'const COT_SAP_XEP: Record<string, string> = {\n' +
  "  moi: 'dang_luc',\n" +
  "  ten: 'tieu_de',\n" +
  '};\n' +
  '\n' +
  '/* 5a — N bai moi nhat cho MOI tac gia, dung MOT cau lenh. */\n' +
  'export async function topMoiTacGia(tacGiaIds: number[], soBai: number, sapXep: string) {\n' +
  "  const cot = COT_SAP_XEP[sapXep] ?? 'dang_luc';\n" +
  '  return prisma.$queryRaw<{ tacGiaId: number; email: string; baiVietId: number;\n' +
  '                            tieuDe: string; soBinhLuan: number }[]>`\n' +
  '    SELECT u.id       AS "tacGiaId",\n' +
  '           u.email    AS "email",\n' +
  '           b.id       AS "baiVietId",\n' +
  '           b.tieu_de  AS "tieuDe",\n' +
  '           (SELECT count(*)::int FROM binh_luan c WHERE c.bai_viet_id = b.id) AS "soBinhLuan"\n' +
  '    FROM nguoi_dung u\n' +
  '    CROSS JOIN LATERAL (\n' +
  '      SELECT p.id, p.tieu_de, p.dang_luc\n' +
  '      FROM bai_viet p\n' +
  "      WHERE p.tac_gia_id = u.id AND p.trang_thai = 'DANG'\n" +
  '      ORDER BY ${Prisma.raw(`p.${cot}`)} DESC\n' +
  '      LIMIT ${soBai}\n' +
  '    ) b\n' +
  '    WHERE u.id = ANY(${tacGiaIds})\n' +
  '    ORDER BY u.id, b.dang_luc DESC`;\n' +
  '}\n' +
  '\n' +
  '/* 5b — cay tra loi, CO chan do sau VA chan chu trinh. */\n' +
  'export async function cayTraLoi(baiVietId: number, doSauToiDa: number) {\n' +
  '  return prisma.$queryRaw<{ doSau: number; so: number }[]>`\n' +
  '    WITH RECURSIVE cay AS (\n' +
  '      SELECT c.id, c.cha_id, 1 AS do_sau, ARRAY[c.id] AS duong\n' +
  '      FROM binh_luan c\n' +
  '      WHERE c.bai_viet_id = ${baiVietId} AND c.cha_id IS NULL\n' +
  '      UNION ALL\n' +
  '      SELECT c.id, c.cha_id, cay.do_sau + 1, cay.duong || c.id\n' +
  '      FROM binh_luan c\n' +
  '      JOIN cay ON c.cha_id = cay.id\n' +
  '      WHERE cay.do_sau < ${doSauToiDa} AND NOT c.id = ANY(cay.duong)\n' +
  '    )\n' +
  '    SELECT do_sau::int AS "doSau", count(*)::int AS "so"\n' +
  '    FROM cay GROUP BY do_sau ORDER BY do_sau`;\n' +
  '}\n';

const Q5_OUTPUT =
  '$ node --experimental-strip-types Q5/do.ts\n' +
  '\n' +
  '=== 5a · 5 tac gia x 3 bai moi nhat ===\n' +
  'cau lenh: 1 · dong: 15\n' +
  '[{"tacGiaId":1,"email":"u1@vidu.com","baiVietId":4,"tieuDe":"Bai viet so 4","soBinhLuan":4},\n' +
  ' {"tacGiaId":1,"email":"u1@vidu.com","baiVietId":3,"tieuDe":"Bai viet so 3","soBinhLuan":4},\n' +
  ' {"tacGiaId":1,"email":"u1@vidu.com","baiVietId":2,"tieuDe":"Bai viet so 2","soBinhLuan":4}]\n' +
  'typeof soBinhLuan: number\n' +
  '\n' +
  '=== 5b · cay tra loi cua bai 1, tran do sau 4 ===\n' +
  'cau lenh: 1 · [{"doSau":1,"so":4},{"doSau":2,"so":1},{"doSau":3,"so":1},{"doSau":4,"so":1}]\n' +
  'tran 10:      [{"doSau":1,"so":4},{"doSau":2,"so":1},{"doSau":3,"so":1},{"doSau":4,"so":1},\n' +
  '               {"doSau":5,"so":1},{"doSau":6,"so":1}]\n' +
  '\n' +
  '=== 5c · dau vao doc hai KHONG lam gi duoc ===\n' +
  'sapXep="moi\'; DROP TABLE bai_viet; --" -> lui ve dang_luc, 1 dong,\n' +
  'bang van con 100 bai';

export default {
  course: { slug: 'prisma-orm' },
  exams: [
    {
      kind: 'PE',
      peType: 'CODE',
      code: 'PE',
      source: 'SAMPLE',
      sortOrder: 10,
      title: B(
        'Practical Exam — write the schema, then prove the SQL',
        'Thi thực hành — viết lược đồ, rồi chứng minh bằng chính SQL',
      ),
      description: B(
        'Five practical questions, submitted as a .zip. A schema extension whose generated DDL must match line for line, a hand-written migration that adds a NOT NULL UNIQUE column to a table that already has duplicate titles, a feed endpoint taken from fourteen statements to two with cursor pagination, a pair of functions that survive thirty concurrent requests, and three queries the query builder cannot express — chapters 2, 3, 4, 5, 6, 7, 9, 10 and 12.',
        'Năm câu thực hành, nộp dưới dạng .zip. Một phần lược đồ mở rộng mà DDL sinh ra phải khớp từng dòng, một migration viết tay thêm cột NOT NULL UNIQUE vào bảng đã có tiêu đề trùng nhau, một endpoint bảng tin đi từ mười bốn câu lệnh xuống hai kèm phân trang bằng con trỏ, một cặp hàm sống sót qua ba mươi yêu cầu song song, và ba truy vấn mà query builder không diễn đạt nổi — các chương 2, 3, 4, 5, 6, 7, 9, 10 và 12.',
      ),
      durationMinutes: 120,
      totalPoints: 10,
      passMark: 5,
      isPublished: true,
      instructions: INSTRUCTIONS,
      questions: [
        /* ── Q1 · chương 2 + 3 ────────────────────────────────────── */
        codeQ({
          points: 2,
          language: 'prisma',
          prompt: B(
            '<p><b>Q1 — Extend the schema, and let the generated DDL judge you (chapters 2 and 3).</b> Add three features to the base schema. Write <code>Q1/them-vao-schema.prisma</code> containing the new blocks plus the back-relation lines you must add to the existing models. Every name below is fixed; the grader compares the generated SQL line for line.</p>' +
            '<ul>' +
            '<li><b>Likes</b> — model <code>LuotThich</code>, table <code>luot_thich</code>. A user likes a post, at most once. Columns <code>nguoi_dung_id</code>, <code>bai_viet_id</code> and <code>tao_luc</code> (a moment, defaulting to now, with the native type that actually stores a zone). Deleting either side removes the like. "Who liked this post" must be an index scan, not a table scan.</li>' +
            '<li><b>Post stats</b> — model <code>ThongKe</code>, table <code>thong_ke</code>. One row per post, holding <code>so_luot_xem</code> and <code>so_luot_thich</code>, both integers defaulting to 0. Use the <b>shared primary key</b> form: one column instead of two, one index instead of two, uniqueness enforced by the primary key itself. Deleting the post removes the row.</li>' +
            '<li><b>Reports</b> — model <code>BaoCao</code>, table <code>bao_cao</code>, with enum <code>TrangThaiBaoCao</code> (' + c('MOI, DANG_XEM, DA_XU_LY, BO_QUA') + ', default <code>MOI</code>). A report belongs to a comment and has <b>two</b> links to <code>NguoiDung</code>: the reporter (required; deleting them removes the report) and the moderator who handled it (optional; deleting them must leave the report standing with an empty handler). <code>ly_do</code> is at most 300 characters, <code>tao_luc</code> is a moment defaulting to now. The same person may report the same comment only once, and the <b>constraint in the database</b> must be called <code>uk_bao_cao_mot_lan</code> while the compound key your queries use stays the default one. The moderation queue filters by status and shows newest first, from an index called <code>ix_bao_cao_hang_doi</code>.</li>' +
            '</ul>' +
            '<p>Four things are being graded that a schema which merely validates will still get wrong: which referential action each of the five foreign keys gets, whether the two links to <code>NguoiDung</code> carry distinct relation names, whether <code>map:</code> or <code>name:</code> was used on the <code>@@unique</code>, and whether the columns nobody indexed automatically have an index.</p>',

            '<p><b>Câu 1 — Mở rộng lược đồ, và để chính DDL sinh ra chấm bạn (chương 2 và 3).</b> Hãy thêm ba tính năng vào lược đồ nền. Viết file <code>Q1/them-vao-schema.prisma</code> chứa các khối mới cộng với những dòng quan hệ ngược phải thêm vào các model đã có. Mọi cái tên dưới đây là cố định; bộ chấm so đoạn SQL sinh ra theo từng dòng.</p>' +
            '<ul>' +
            '<li><b>Lượt thích</b> — model <code>LuotThich</code>, bảng <code>luot_thich</code>. Một người thích một bài, nhiều nhất một lần. Các cột <code>nguoi_dung_id</code>, <code>bai_viet_id</code> và <code>tao_luc</code> (một mốc thời gian, mặc định là bây giờ, với native type thật sự lưu được múi giờ). Xoá một trong hai phía thì lượt thích biến mất theo. Câu hỏi "ai đã thích bài này" phải là một lượt quét chỉ mục, không phải quét bảng.</li>' +
            '<li><b>Thống kê bài viết</b> — model <code>ThongKe</code>, bảng <code>thong_ke</code>. Mỗi bài một dòng, giữ <code>so_luot_xem</code> và <code>so_luot_thich</code>, đều là số nguyên mặc định 0. Hãy dùng dạng <b>khoá chính dùng chung</b>: một cột thay vì hai, một chỉ mục thay vì hai, và tính duy nhất do chính khoá chính bảo đảm. Xoá bài viết thì dòng này mất theo.</li>' +
            '<li><b>Báo cáo</b> — model <code>BaoCao</code>, bảng <code>bao_cao</code>, kèm enum <code>TrangThaiBaoCao</code> (' + c('MOI, DANG_XEM, DA_XU_LY, BO_QUA') + ', mặc định <code>MOI</code>). Một báo cáo thuộc về một bình luận và có <b>hai</b> liên kết tới <code>NguoiDung</code>: người báo cáo (bắt buộc; xoá người đó thì báo cáo mất theo) và người kiểm duyệt đã xử lý (tuỳ chọn; xoá người đó thì báo cáo phải ở lại với ô người xử lý trống). <code>ly_do</code> dài tối đa 300 ký tự, <code>tao_luc</code> là một mốc thời gian mặc định bây giờ. Cùng một người chỉ được báo cáo cùng một bình luận một lần, và <b>ràng buộc trong cơ sở dữ liệu</b> phải tên là <code>uk_bao_cao_mot_lan</code> trong khi khoá ghép mà truy vấn của bạn dùng vẫn là khoá mặc định. Hàng đợi kiểm duyệt lọc theo trạng thái và hiện mới nhất trước, từ một chỉ mục tên <code>ix_bao_cao_hang_doi</code>.</li>' +
            '</ul>' +
            '<p>Có bốn thứ bị chấm mà một lược đồ chỉ cần validate được vẫn sẽ làm sai: mỗi trong năm khoá ngoại nhận hành vi tham chiếu nào, hai liên kết tới <code>NguoiDung</code> có mang hai tên quan hệ khác nhau không, <code>@@unique</code> dùng <code>map:</code> hay <code>name:</code>, và những cột chẳng ai tự đánh chỉ mục hộ đã có chỉ mục chưa.</p>',
          ),
          starterCode: starter(1, 'them-vao-schema.prisma',
            'Chep nguyen khoi nay vao cuoi prisma/schema.prisma cua ban, roi\n' +
            'them cac truong quan he nguoc vao NguoiDung, BaiViet va BinhLuan.\n' +
            'Giu mot ban sao luoc do NEN o prisma/schema-nen.prisma de chay\n' +
            '`prisma migrate diff` doi chieu.'),
          expectedOutput: Q1_OUTPUT,
          sampleSolution: Q1_SOLUTION,
          rubric: rubric([
            ['ddl',
              'The three tables, the enum and every column match the expected DDL exactly — including <code>TIMESTAMPTZ(3)</code> for the two timestamps, <code>VARCHAR(300)</code> for <code>ly_do</code>, and the composite primary key <code>("nguoi_dung_id","bai_viet_id")</code> on <code>luot_thich</code>.',
              'Ba bảng, enum và mọi cột khớp chính xác với DDL mong đợi — kể cả <code>TIMESTAMPTZ(3)</code> cho hai mốc thời gian, <code>VARCHAR(300)</code> cho <code>ly_do</code>, và khoá chính ghép <code>("nguoi_dung_id","bai_viet_id")</code> trên <code>luot_thich</code>.',
              0.6],
            ['quanhe',
              'All five foreign keys carry the referential action the problem asked for: four <code>ON DELETE CASCADE</code> and one <code>ON DELETE SET NULL</code> on <code>nguoi_xu_ly_id</code>, whose field is therefore optional. Leaving any of them to the default is a mark lost even though the schema validates.',
              'Cả năm khoá ngoại mang đúng hành vi tham chiếu đề yêu cầu: bốn <code>ON DELETE CASCADE</code> và một <code>ON DELETE SET NULL</code> trên <code>nguoi_xu_ly_id</code>, mà trường tương ứng vì thế phải là tuỳ chọn. Để bất kỳ cái nào rơi vào mặc định là mất điểm dù lược đồ vẫn validate được.',
              0.5],
            ['tenquanhe',
              'The two relations from <code>BaoCao</code> to <code>NguoiDung</code> carry distinct <code>@relation("…")</code> names on both ends, and <code>ThongKe</code> uses the shared-primary-key form — <code>@id</code> on the relation scalar with no <code>@default</code> — rather than a surrogate id plus a <code>@unique</code>.',
              'Hai quan hệ từ <code>BaoCao</code> tới <code>NguoiDung</code> mang hai tên <code>@relation("…")</code> khác nhau ở cả hai đầu, và <code>ThongKe</code> dùng dạng khoá chính dùng chung — <code>@id</code> đặt trên chính trường vô hướng quan hệ và không có <code>@default</code> — chứ không phải một id thay thế cộng một <code>@unique</code>.',
              0.5],
            ['chimuc',
              'The indexes PostgreSQL does not create for you are present and named: <code>ix_luot_thich_bai_viet</code>, <code>ix_bao_cao_nguoi_xu_ly</code>, and <code>ix_bao_cao_hang_doi</code> with the equality column first and <code>tao_luc</code> descending; and the unique constraint is renamed with <code>map:</code>, not <code>name:</code>, so the compound query key stays the default.',
              'Những chỉ mục mà PostgreSQL không tạo hộ đều có mặt và đúng tên: <code>ix_luot_thich_bai_viet</code>, <code>ix_bao_cao_nguoi_xu_ly</code>, và <code>ix_bao_cao_hang_doi</code> với cột so bằng đứng trước và <code>tao_luc</code> giảm dần; còn ràng buộc duy nhất được đổi tên bằng <code>map:</code> chứ không phải <code>name:</code>, để khoá ghép dùng trong truy vấn vẫn là khoá mặc định.',
              0.4],
          ]),
        }),

        /* ── Q2 · chương 6 + 11 (+ 2, 4) ──────────────────────────── */
        codeQ({
          points: 2,
          language: 'sql',
          prompt: B(
            '<p><b>Q2 — A hand-written migration that survives the data already in the table (chapters 6 and 11).</b> The base schema is deployed and seeded: 100 posts, 20 users. Write <code>Q2/migration.sql</code>, applied with <code>psql -v ON_ERROR_STOP=1 -f</code>, doing three things. This is a migration for a table the running code is still reading, so every statement must be safe for the <em>old</em> code as well.</p>' +
            '<ul>' +
            '<li><b>Add <code>tom_tat</code></b> to <code>bai_viet</code>: at most 300 characters, <code>NOT NULL</code>, backfilled for existing rows from the first 297 characters of <code>tieu_de</code> with <code>...</code> appended. The obvious one-liner fails on the seeded data with ' + c('ERROR:  column "tom_tat" of relation "bai_viet" contains null values') + ' — the exam is testing whether you know why, and what the three-step form is.</li>' +
            '<li><b>Let a soft-deleted user free their email.</b> Today <code>nguoi_dung_email_key</code> is a plain unique index, so a user who signed up, was soft-deleted (<code>xoa_luc</code> set) and came back hits P2002 on their own address. Replace it with a unique index named <code>uk_nguoi_dung_email_con_song</code> that only applies while <code>xoa_luc IS NULL</code>. Two live users must still not be able to share an address.</li>' +
            '<li><b>Add a <code>CHECK</code> called <code>bai_viet_dang_phai_co_dang_luc</code></b>: a post with <code>trang_thai = \'DANG\'</code> must have a <code>dang_luc</code>. Add it in the two-step form that does not scan the whole table under an exclusive lock, then validate it.</li>' +
            '</ul>' +
            '<p>Two more things are graded. Open the file with the two session settings a migration touching a hot table should carry, so that an <code>ALTER</code> queueing behind a long query cannot take the whole table down with it. And note <em>why</em> the second and third items are here at all: neither a partial index nor a check constraint can be declared in <code>schema.prisma</code>, which is exactly the class of object that has to live in a hand-written migration.</p>',

            '<p><b>Câu 2 — Một migration viết tay sống được với dữ liệu đã nằm sẵn trong bảng (chương 6 và 11).</b> Lược đồ nền đã deploy và đã seed: 100 bài viết, 20 người dùng. Hãy viết <code>Q2/migration.sql</code>, áp bằng <code>psql -v ON_ERROR_STOP=1 -f</code>, làm ba việc. Đây là migration cho một bảng mà mã đang chạy vẫn đọc, nên mọi câu lệnh phải an toàn với cả mã CŨ.</p>' +
            '<ul>' +
            '<li><b>Thêm cột <code>tom_tat</code></b> vào <code>bai_viet</code>: tối đa 300 ký tự, <code>NOT NULL</code>, nạp bù cho các dòng đã có từ 297 ký tự đầu của <code>tieu_de</code> rồi nối thêm <code>...</code>. Cách viết một dòng hiển nhiên sẽ hỏng trên dữ liệu đã seed với ' + c('ERROR:  column "tom_tat" of relation "bai_viet" contains null values') + ' — đề đang kiểm xem bạn có biết VÌ SAO, và dạng ba bước là gì.</li>' +
            '<li><b>Cho người đã xoá mềm nhả lại email của họ.</b> Hôm nay <code>nguoi_dung_email_key</code> là một chỉ mục duy nhất thường, nên một người từng đăng ký, bị xoá mềm (<code>xoa_luc</code> có giá trị) rồi quay lại sẽ đâm vào P2002 với chính địa chỉ của mình. Hãy thay nó bằng một chỉ mục duy nhất tên <code>uk_nguoi_dung_email_con_song</code> chỉ có hiệu lực khi <code>xoa_luc IS NULL</code>. Hai người dùng còn sống thì vẫn phải không dùng chung được một địa chỉ.</li>' +
            '<li><b>Thêm một <code>CHECK</code> tên <code>bai_viet_dang_phai_co_dang_luc</code></b>: một bài có <code>trang_thai = \'DANG\'</code> thì bắt buộc phải có <code>dang_luc</code>. Hãy thêm nó theo dạng hai bước không quét cả bảng dưới một khoá độc quyền, rồi mới validate.</li>' +
            '</ul>' +
            '<p>Còn hai thứ nữa bị chấm. Hãy mở đầu file bằng hai thiết lập phiên mà một migration đụng vào bảng nóng nên mang theo, để một câu <code>ALTER</code> phải xếp hàng sau một truy vấn dài không kéo cả cái bảng chết theo. Và hãy để ý VÌ SAO mục hai và mục ba lại có mặt ở đây: cả chỉ mục một phần lẫn ràng buộc check đều không khai được trong <code>schema.prisma</code>, và đó đúng là lớp đối tượng buộc phải sống trong một migration viết tay.</p>',
          ),
          starterCode: starter(2, 'migration.sql',
            'Ap bang:  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f Q2/migration.sql\n' +
            'Bang bai_viet dang co 100 dong, nguoi_dung dang co 20 dong.\n' +
            'Khong duoc xoa hay tao lai bang; khong duoc dung DEFAULT de lach\n' +
            'buoc nap bu.'),
          expectedOutput: Q2_OUTPUT,
          sampleSolution: Q2_SOLUTION,
          rubric: rubric([
            ['bapuoc',
              'The new column is added in three separate statements — nullable <code>ADD COLUMN</code>, then a backfill <code>UPDATE</code> that reports <code>UPDATE 100</code>, then <code>ALTER COLUMN … SET NOT NULL</code> — rather than one <code>ADD COLUMN … NOT NULL</code>, and the backfilled value matches <code>Bai viet so 1...</code> exactly.',
              'Cột mới được thêm bằng ba câu lệnh tách rời — <code>ADD COLUMN</code> cho phép null, rồi một <code>UPDATE</code> nạp bù báo <code>UPDATE 100</code>, rồi <code>ALTER COLUMN … SET NOT NULL</code> — chứ không phải một câu <code>ADD COLUMN … NOT NULL</code>, và giá trị nạp bù khớp đúng <code>Bai viet so 1...</code>.',
              0.6],
            ['chimucmotphan',
              'The plain unique index is dropped and replaced by a partial unique index with the required name and the <code>WHERE "xoa_luc" IS NULL</code> predicate; the two verification inserts behave as printed — the soft-deleted address is accepted, the live one is refused by that constraint by name.',
              'Chỉ mục duy nhất thường bị bỏ đi và thay bằng một chỉ mục duy nhất MỘT PHẦN đúng tên yêu cầu kèm vị từ <code>WHERE "xoa_luc" IS NULL</code>; hai lệnh chèn kiểm chứng hành xử đúng như in ra — địa chỉ của người đã xoá mềm được nhận, còn địa chỉ của người còn sống bị chính ràng buộc đó từ chối theo đúng tên.',
              0.5],
            ['check',
              'The check constraint has the required name, expresses "published implies a publish time" correctly for the three-value enum, and is added with <code>NOT VALID</code> followed by a separate <code>VALIDATE CONSTRAINT</code> rather than in one scanning statement.',
              'Ràng buộc check đúng tên yêu cầu, diễn đạt đúng ý "đã đăng thì phải có thời điểm đăng" cho enum ba giá trị, và được thêm bằng <code>NOT VALID</code> rồi mới tới một câu <code>VALIDATE CONSTRAINT</code> riêng, chứ không phải một câu lệnh quét cả bảng.',
              0.5],
            ['khoa',
              'The file opens with <code>SET lock_timeout</code> and <code>SET statement_timeout</code>, and nothing in it drops or recreates a table or invents a <code>DEFAULT</code> to skip the backfill; the whole file applies cleanly under <code>ON_ERROR_STOP=1</code>.',
              'File mở đầu bằng <code>SET lock_timeout</code> và <code>SET statement_timeout</code>, và không có chỗ nào xoá hay tạo lại bảng hay bịa ra một <code>DEFAULT</code> để lách bước nạp bù; cả file áp sạch dưới <code>ON_ERROR_STOP=1</code>.',
              0.4],
          ]),
        }),

        /* ── Q3 · chương 4 + 5 + 9 ────────────────────────────────── */
        codeQ({
          points: 2,
          language: 'typescript',
          khongChayDuoc: 'lời giải cần một PostgreSQL SỐNG đã seed 20 người dùng / 100 bài / 405 bình luận và một lượt `prisma generate` chạy trước, nên nó không tự chứa; đã đo thật bằng prisma.$on("query") — bản cũ 14 câu lệnh/22.743 byte, bản mới 2 câu lệnh/1.591 byte, chạy lại ba lượt cho cùng kết quả',
          prompt: B(
            '<p><b>Q3 — Take a feed endpoint from fourteen statements to two (chapters 4, 5 and 9).</b> This is the version in production. It works, and it is wrong in four separate ways:</p>' +
            code('async function feedCu(trang: number, size: number) {\n' +
            '  const rows = await prisma.baiViet.findMany({\n' +
            "    where: { trangThai: 'DANG' },\n" +
            '    include: { tacGia: { include: { hoSo: true } } },\n' +
            "    orderBy: { dangLuc: 'desc' },\n" +
            '    skip: (trang - 1) * size,\n' +
            '    take: size,\n' +
            '  });\n' +
            '  const withCount = [];\n' +
            '  for (const bv of rows) {\n' +
            '    const soBinhLuan = await prisma.binhLuan.count({ where: { baiVietId: bv.id } });\n' +
            '    withCount.push({ ...bv, soBinhLuan });\n' +
            '  }\n' +
            '  const tong = await prisma.baiViet.count({ where: { trangThai: \'DANG\' } });\n' +
            '  return { rows: withCount, hasMore: trang * size < tong, nextCursor: null };\n' +
            '}') +
            '<p>Write <code>Q3/feed.ts</code> exporting ' + c('feedMoi(cursor: number | null, size: number)') + ' with the same response shape (<code>rows</code>, <code>hasMore</code>, <code>nextCursor</code>) that fixes all four:</p>' +
            '<ul>' +
            '<li><b>The loop.</b> One comment count per row is a loop across a network; the count must come back inside the page query.</li>' +
            '<li><b>The over-fetch.</b> Each card renders <code>slug</code>, <code>tieuDe</code>, <code>dangLuc</code>, the author\'s <code>id</code> and <code>email</code>, and the comment count. Nothing else may leave the database — and note that <code>hoSo.gioiThieu</code> is 2 KB per author.</li>' +
            '<li><b>The offset.</b> Replace numbered pages with a cursor. Prisma\'s <code>cursor</code> takes a unique field, and the ordering must end with the field you cursor on.</li>' +
            '<li><b>The count.</b> <code>hasMore</code> must be answered without a second query.</li>' +
            '</ul>' +
            '<p>The measurement is the answer: page one must come back in <b>two</b> statements, and the JSON must be about fifteen times smaller. Log with ' + c("log: [{ emit: 'event', level: 'query' }]") + ' and count.</p>',

            '<p><b>Câu 3 — Đưa một endpoint bảng tin từ mười bốn câu lệnh xuống hai (chương 4, 5 và 9).</b> Đây là bản đang chạy trên production. Nó chạy được, và nó sai theo bốn cách khác nhau:</p>' +
            code('async function feedCu(trang: number, size: number) {\n' +
            '  const rows = await prisma.baiViet.findMany({\n' +
            "    where: { trangThai: 'DANG' },\n" +
            '    include: { tacGia: { include: { hoSo: true } } },\n' +
            "    orderBy: { dangLuc: 'desc' },\n" +
            '    skip: (trang - 1) * size,\n' +
            '    take: size,\n' +
            '  });\n' +
            '  const withCount = [];\n' +
            '  for (const bv of rows) {\n' +
            '    const soBinhLuan = await prisma.binhLuan.count({ where: { baiVietId: bv.id } });\n' +
            '    withCount.push({ ...bv, soBinhLuan });\n' +
            '  }\n' +
            '  const tong = await prisma.baiViet.count({ where: { trangThai: \'DANG\' } });\n' +
            '  return { rows: withCount, hasMore: trang * size < tong, nextCursor: null };\n' +
            '}') +
            '<p>Hãy viết <code>Q3/feed.ts</code> xuất ra ' + c('feedMoi(cursor: number | null, size: number)') + ' với cùng hình dạng phản hồi (<code>rows</code>, <code>hasMore</code>, <code>nextCursor</code>) và sửa cả bốn chỗ:</p>' +
            '<ul>' +
            '<li><b>Cái vòng lặp.</b> Một phép đếm bình luận cho mỗi dòng là một vòng lặp bắc qua mạng; số đếm phải về ngay trong truy vấn của trang.</li>' +
            '<li><b>Phần lấy thừa.</b> Mỗi thẻ hiển thị <code>slug</code>, <code>tieuDe</code>, <code>dangLuc</code>, <code>id</code> và <code>email</code> của tác giả, cùng số bình luận. Không thứ gì khác được rời khỏi cơ sở dữ liệu — và lưu ý <code>hoSo.gioiThieu</code> nặng 2 KB mỗi tác giả.</li>' +
            '<li><b>Cái offset.</b> Hãy thay trang đánh số bằng con trỏ. <code>cursor</code> của Prisma nhận một trường duy nhất, và thứ tự sắp xếp phải KẾT THÚC bằng chính trường đặt con trỏ.</li>' +
            '<li><b>Phép đếm.</b> <code>hasMore</code> phải trả lời được mà không cần một truy vấn thứ hai.</li>' +
            '</ul>' +
            '<p>Phép đo chính là đáp án: trang một phải trở về trong <b>hai</b> câu lệnh, và JSON phải nhỏ đi khoảng mười lăm lần. Hãy bật log bằng ' + c("log: [{ emit: 'event', level: 'query' }]") + ' rồi đếm.</p>',
          ),
          starterCode: starterTs(3, 'feed.ts',
            'Xuat ra ham feedMoi(cursor, size). Trang dau goi voi cursor = null.\n' +
            'Do bang cach dem su kien "query" quanh moi lan goi, va do kich thuoc\n' +
            'bang Buffer.byteLength(JSON.stringify(ketQua)).\n' +
            'KHONG duoc sua ham feedCu; no o day de doi chieu.'),
          expectedOutput: Q3_OUTPUT,
          sampleSolution: Q3_SOLUTION,
          rubric: rubric([
            ['motcaulenh',
              'The comment count comes from <code>_count</code> inside the same query rather than a loop, and page one is measured at two statements — not fourteen, and not one per row.',
              'Số bình luận đến từ <code>_count</code> ngay trong cùng truy vấn chứ không phải từ một vòng lặp, và trang một đo được ĐÚNG hai câu lệnh — không phải mười bốn, cũng không phải một câu cho mỗi dòng.',
              0.6],
            ['select',
              'The query uses <code>select</code>, not <code>include</code>: exactly the six values the card renders leave the database, <code>hoSo</code> is never fetched, and the serialised page is about fifteen times smaller than the old one.',
              'Truy vấn dùng <code>select</code> chứ không dùng <code>include</code>: đúng sáu giá trị mà thẻ bài viết cần mới rời khỏi cơ sở dữ liệu, <code>hoSo</code> không bao giờ được lấy về, và trang sau khi tuần tự hoá nhỏ hơn bản cũ khoảng mười lăm lần.',
              0.5],
            ['contro',
              'Pagination is by cursor with <code>skip: 1</code> so the boundary row is not repeated, and <code>orderBy</code> ends with the cursor field (<code>id</code>) so rows around equal timestamps can neither be skipped nor duplicated.',
              'Phân trang bằng con trỏ có <code>skip: 1</code> để dòng ở ranh giới không bị lặp lại, và <code>orderBy</code> kết thúc bằng chính trường con trỏ (<code>id</code>) để các dòng quanh chỗ trùng thời gian không bị bỏ sót cũng không bị lặp.',
              0.5],
            ['hasmore',
              '<code>hasMore</code> is derived from <code>take: size + 1</code> and a <code>pop()</code>, with no <code>count()</code> anywhere; <code>nextCursor</code> is the id of the last row actually returned, and is <code>null</code> on the final page.',
              '<code>hasMore</code> được suy ra từ <code>take: size + 1</code> cộng một lần <code>pop()</code>, và không có <code>count()</code> ở bất cứ đâu; <code>nextCursor</code> là id của dòng CUỐI CÙNG thật sự được trả về, và là <code>null</code> ở trang cuối.',
              0.4],
          ]),
        }),

        /* ── Q4 · chương 4 + 7 + 12 ───────────────────────────────── */
        codeQ({
          points: 2,
          language: 'typescript',
          khongChayDuoc: 'lời giải cần một PostgreSQL SỐNG và ba mươi lời gọi chạy SONG SONG mới bộc lộ được hành vi cần chấm; đã chạy thật ba lượt trên PostgreSQL 16.15, kết quả ổn định 30/30 slug khác nhau và đúng 1 người thắng trong 20 lượt xuất bản',
          prompt: B(
            '<p><b>Q4 — Two functions that hold under real contention (chapters 4, 7 and 12).</b> Write <code>Q4/dong-thoi.ts</code> exporting two functions. Both are graded by running thirty and twenty of them at once, not by reading them.</p>' +
            '<p><b>4a — ' + c('taoBaiViet(tacGiaId: number, tieuDe: string)') + '.</b> Create a post whose <code>slug</code> is derived from the title and is unique. Thirty requests with the <em>same</em> title arrive together; all thirty must succeed, all thirty rows must exist, and all thirty slugs must differ. The obvious implementation — read the table, decide the slug is free, insert — is a race that loses under exactly this load. Use the constraint as the decision-maker and catch its error; narrow the catch to <b>the right error class and the right code</b>, so an unrelated failure is not swallowed; and make sure the loop terminates even in the worst case.</p>' +
            '<p><b>4b — ' + c('xuatBan(id: number): Promise<boolean>') + '.</b> Move a post from <code>NHAP</code> to <code>DANG</code> and stamp <code>dangLuc</code>, returning whether <em>this</em> call was the one that did it. Twenty requests for the same post arrive together; exactly one must return <code>true</code>. Reading the status, checking it in JavaScript and then updating is the losing shape — the precondition belongs somewhere the database evaluates it atomically, and the answer to "did I win" is already in what that call returns.</p>' +
            '<p>The invariants are the grade: <b>30/30 · 30 rows · 30 distinct slugs</b>, and <b>1 winner · 19 losers</b>, reproduced on three consecutive runs.</p>',

            '<p><b>Câu 4 — Hai hàm chịu được tranh chấp thật (chương 4, 7 và 12).</b> Hãy viết <code>Q4/dong-thoi.ts</code> xuất ra hai hàm. Cả hai đều được chấm bằng cách chạy ba mươi và hai mươi lời gọi CÙNG LÚC, chứ không phải bằng cách đọc.</p>' +
            '<p><b>4a — ' + c('taoBaiViet(tacGiaId: number, tieuDe: string)') + '.</b> Tạo một bài viết có <code>slug</code> suy ra từ tiêu đề và phải duy nhất. Ba mươi yêu cầu với CÙNG một tiêu đề tới cùng lúc; cả ba mươi phải thành công, cả ba mươi dòng phải tồn tại, và cả ba mươi slug phải khác nhau. Cách cài đặt hiển nhiên — đọc bảng, kết luận slug còn trống, rồi chèn — là một cuộc đua và nó thua đúng dưới tải này. Hãy để RÀNG BUỘC làm người quyết định rồi bắt lỗi của nó; hãy thu hẹp phép bắt về <b>đúng lớp lỗi và đúng mã lỗi</b>, để một cú hỏng chẳng liên quan không bị nuốt mất; và hãy bảo đảm vòng lặp KẾT THÚC kể cả trong trường hợp tệ nhất.</p>' +
            '<p><b>4b — ' + c('xuatBan(id: number): Promise<boolean>') + '.</b> Chuyển một bài từ <code>NHAP</code> sang <code>DANG</code> và đóng dấu <code>dangLuc</code>, trả về việc CHÍNH lời gọi này có phải là lời gọi làm được điều đó hay không. Hai mươi yêu cầu cho cùng một bài tới cùng lúc; đúng một cái phải trả về <code>true</code>. Đọc trạng thái, kiểm nó bằng JavaScript rồi mới cập nhật là hình dạng thua cuộc — điều kiện tiên quyết thuộc về nơi mà cơ sở dữ liệu tính nó một cách nguyên tử, và câu trả lời cho "tôi có thắng không" vốn đã nằm sẵn trong thứ mà lời gọi ấy trả về.</p>' +
            '<p>Các bất biến chính là điểm số: <b>30/30 · 30 dòng · 30 slug khác nhau</b>, và <b>1 thắng · 19 thua</b>, tái lập được qua ba lượt chạy liên tiếp.</p>',
          ),
          starterCode: starterTs(4, 'dong-thoi.ts',
            'Truoc moi luot do: TRUNCATE "binh_luan","bai_viet_the","bai_viet"\n' +
            'RESTART IDENTITY CASCADE;  roi goi 30 lan taoBaiViet(1, "Hoc Prisma\n' +
            'tu so 0") bang Promise.allSettled, va 20 lan xuatBan(id) bang\n' +
            'Promise.all tren cung mot bai.'),
          expectedOutput: Q4_OUTPUT,
          sampleSolution: Q4_SOLUTION,
          rubric: rubric([
            ['chenrobat',
              '4a inserts and catches instead of checking then inserting, so all thirty concurrent calls succeed and produce thirty distinct slugs; no call is lost and no duplicate row appears.',
              '4a CHÈN rồi BẮT lỗi chứ không kiểm rồi mới chèn, nhờ vậy cả ba mươi lời gọi song song đều thành công và sinh ra ba mươi slug khác nhau; không lời gọi nào bị mất và không có dòng trùng nào xuất hiện.',
              0.6],
            ['batdung',
              'The catch is narrowed with <code>e instanceof Prisma.PrismaClientKnownRequestError</code> and <code>e.code === \'P2002\'</code> and rethrows anything else — not <code>(e as any).code</code>, which would also swallow a Node <code>ENOENT</code> or an HTTP client error — and the attempt loop is bounded with a final fallback that cannot collide.',
              'Phép bắt lỗi được thu hẹp bằng <code>e instanceof Prisma.PrismaClientKnownRequestError</code> và <code>e.code === \'P2002\'</code> và ném lại mọi thứ khác — chứ không phải <code>(e as any).code</code>, thứ sẽ nuốt luôn một <code>ENOENT</code> của Node hay một lỗi của HTTP client — và vòng thử lại có giới hạn kèm một phương án cuối không thể va chạm.',
              0.5],
            ['tienquyet',
              '4b puts the precondition in the <code>where</code> of a single statement the database evaluates atomically, rather than reading the status and branching in JavaScript, so exactly one of twenty concurrent calls wins.',
              '4b đặt điều kiện tiên quyết vào <code>where</code> của một câu lệnh duy nhất mà cơ sở dữ liệu tính một cách nguyên tử, chứ không đọc trạng thái rồi rẽ nhánh bằng JavaScript, nhờ đó đúng một trong hai mươi lời gọi song song thắng.',
              0.5],
            ['docketqua',
              'The return value is derived from what the write itself reported — <code>{ count }</code> — rather than from a follow-up read, and <code>count === 0</code> is treated as "the precondition was false", not as an error; the final row shows <code>DANG</code> with a non-null <code>dangLuc</code>.',
              'Giá trị trả về được suy ra từ chính thứ phép ghi báo lại — <code>{ count }</code> — chứ không từ một lần đọc sau đó, và <code>count === 0</code> được hiểu là "điều kiện tiên quyết sai" chứ không phải một lỗi; dòng cuối cùng hiện <code>DANG</code> với <code>dangLuc</code> khác null.',
              0.4],
          ]),
        }),

        /* ── Q5 · chương 10 (+ 8, 12) ─────────────────────────────── */
        codeQ({
          points: 2,
          language: 'typescript',
          khongChayDuoc: 'lời giải là hai truy vấn SQL thô cần một PostgreSQL SỐNG có đúng dữ liệu seed (20 tác giả, cây trả lời 6 tầng trên bài 1) và một lượt `prisma generate` đi trước; đã chạy thật — mỗi truy vấn ĐÚNG 1 câu lệnh, và đầu vào độc hại đã được thử thật, bảng vẫn còn đủ 100 bài',
          prompt: B(
            '<p><b>Q5 — Three things the query builder cannot say (chapter 10).</b> Write <code>Q5/tho.ts</code> exporting two functions. Both must be <b>exactly one statement</b> each — check by counting <code>query</code> events, not by looking at the code.</p>' +
            '<p><b>5a — ' + c('topMoiTacGia(tacGiaIds: number[], soBai: number, sapXep: string)') + '.</b> For each of the given authors, the <code>soBai</code> most recent <b>published</b> posts, as <code>tacGiaId</code>, <code>email</code>, <code>baiVietId</code>, <code>tieuDe</code> and <code>soBinhLuan</code>, ordered by <code>u.id</code> then newest first. The builder needs one query per author for this; SQL has a construct that does it in one. Three details are graded:</p>' +
            '<ul>' +
            '<li>Raw SQL speaks <b>database</b> names — <code>bai_viet</code>, <code>tac_gia_id</code>, <code>binh_luan</code> — and the keys you want back in camelCase have to be aliased <em>in double quotes</em>, or PostgreSQL folds them to lower case.</li>' +
            '<li><code>soBinhLuan</code> must arrive as a JavaScript <code>number</code>. <code>count(*)</code> is <code>bigint</code>, and a <code>bigint</code> in a response makes <code>JSON.stringify</code> throw. Fix it where the type is decided.</li>' +
            '<li><code>sapXep</code> comes from the query string and selects the sort column. <b>An identifier cannot be a bind parameter</b> — interpolating it into the tagged template sends <code>ORDER BY $1</code> and sorts every row by a constant string, with no error. Map it through a whitelist you wrote, fall back to newest-first, and only then let it into the SQL. ' + c("sapXep = \"moi'; DROP TABLE bai_viet; --\"") + ' must change nothing.</li>' +
            '</ul>' +
            '<p><b>5b — ' + c('cayTraLoi(baiVietId: number, doSauToiDa: number)') + '.</b> Walk the reply tree of a post and return <code>doSau</code> (the roots are depth 1) and <code>so</code>, the number of comments at that depth, ordered by depth. A recursive CTE has <b>no built-in recursion limit</b> — it stops only when the recursive term produces zero rows — so use <b>both</b> guards: cap the depth, <em>and</em> carry the visited ids in an array and reject a node already in it. With <code>doSauToiDa = 4</code> the seeded tree must stop at depth 4; with 10 it must reach depth 6.</p>',

            '<p><b>Câu 5 — Ba thứ mà query builder không nói được (chương 10).</b> Hãy viết <code>Q5/tho.ts</code> xuất ra hai hàm. Cả hai phải là <b>đúng một câu lệnh</b> mỗi hàm — hãy kiểm bằng cách đếm sự kiện <code>query</code>, không phải bằng cách nhìn mã.</p>' +
            '<p><b>5a — ' + c('topMoiTacGia(tacGiaIds: number[], soBai: number, sapXep: string)') + '.</b> Với mỗi tác giả trong danh sách, lấy <code>soBai</code> bài <b>đã đăng</b> mới nhất, gồm <code>tacGiaId</code>, <code>email</code>, <code>baiVietId</code>, <code>tieuDe</code> và <code>soBinhLuan</code>, sắp theo <code>u.id</code> rồi mới nhất trước. Builder cần một truy vấn cho mỗi tác giả để làm việc này; SQL có một cấu trúc làm nó trong một câu. Ba chi tiết bị chấm:</p>' +
            '<ul>' +
            '<li>SQL thô nói bằng tên của <b>cơ sở dữ liệu</b> — <code>bai_viet</code>, <code>tac_gia_id</code>, <code>binh_luan</code> — và những khoá bạn muốn nhận về ở dạng camelCase phải được đặt bí danh <em>trong dấu nháy kép</em>, không thì PostgreSQL hạ chúng về chữ thường.</li>' +
            '<li><code>soBinhLuan</code> phải về tới nơi dưới dạng <code>number</code> của JavaScript. <code>count(*)</code> là <code>bigint</code>, và một <code>bigint</code> nằm trong phản hồi sẽ làm <code>JSON.stringify</code> ném lỗi. Hãy sửa nó ở chỗ kiểu được quyết định.</li>' +
            '<li><code>sapXep</code> đến từ chuỗi truy vấn và chọn cột sắp xếp. <b>Một định danh không thể là tham số ràng buộc</b> — nội suy nó vào tagged template sẽ gửi đi <code>ORDER BY $1</code> và sắp mọi dòng theo một chuỗi hằng, mà không báo lỗi. Hãy ánh xạ nó qua một danh sách trắng do bạn viết, lùi về mới-nhất-trước, rồi mới cho nó vào SQL. ' + c("sapXep = \"moi'; DROP TABLE bai_viet; --\"") + ' phải không đổi được thứ gì.</li>' +
            '</ul>' +
            '<p><b>5b — ' + c('cayTraLoi(baiVietId: number, doSauToiDa: number)') + '.</b> Hãy duyệt cây trả lời của một bài viết và trả về <code>doSau</code> (các nút gốc có độ sâu 1) cùng <code>so</code>, tức số bình luận ở độ sâu đó, sắp theo độ sâu. Một CTE đệ quy <b>không có giới hạn đệ quy dựng sẵn nào</b> — nó chỉ dừng khi vế đệ quy sinh ra không dòng nào — nên hãy dùng <b>cả hai</b> lớp chặn: chặn độ sâu, VÀ mang theo các id đã thăm trong một mảng rồi loại nút nào đã có trong đó. Với <code>doSauToiDa = 4</code> thì cây đã seed phải dừng ở độ sâu 4; với 10 thì nó phải tới độ sâu 6.</p>',
          ),
          starterCode: starterTs(5, 'tho.ts',
            'Do bang cach dem su kien "query" quanh moi lan goi — moi ham phai\n' +
            'la DUNG 1 cau lenh. Goi 5a voi [1,2,3,4,5], soBai = 3, sapXep =\n' +
            '"moi", roi goi lai voi sapXep = "moi\'; DROP TABLE bai_viet; --"\n' +
            'va dem lai so bai trong bang.'),
          expectedOutput: Q5_OUTPUT,
          sampleSolution: Q5_SOLUTION,
          rubric: rubric([
            ['motcaulenh',
              '5a returns the top-N per author in a single statement using a lateral construct (or an equivalent) rather than one query per author, and the fifteen expected rows come back in the required order.',
              '5a trả về top-N cho mỗi tác giả trong ĐÚNG một câu lệnh bằng một cấu trúc lateral (hoặc tương đương) chứ không phải một truy vấn cho mỗi tác giả, và mười lăm dòng mong đợi trở về đúng thứ tự yêu cầu.',
              0.5],
            ['tencot',
              'The SQL uses the mapped database names throughout, the camelCase result keys are aliased in double quotes so PostgreSQL does not fold them, and <code>soBinhLuan</code> is cast in SQL so it arrives as a <code>number</code> rather than a <code>bigint</code> that would break <code>JSON.stringify</code>.',
              'Đoạn SQL dùng đúng các tên đã ánh xạ của cơ sở dữ liệu từ đầu tới cuối, các khoá kết quả dạng camelCase được đặt bí danh trong dấu nháy kép để PostgreSQL không hạ chữ, và <code>soBinhLuan</code> được ép kiểu NGAY TRONG SQL để nó về dưới dạng <code>number</code> chứ không phải <code>bigint</code> vốn làm vỡ <code>JSON.stringify</code>.',
              0.5],
            ['danhsachtrang',
              'Every value reaches the statement as a bind parameter, and the one identifier that varies is resolved through a whitelist with a safe fallback before it is interpolated; the malicious <code>sapXep</code> changes nothing and the table still holds 100 posts.',
              'Mọi GIÁ TRỊ đều tới câu lệnh dưới dạng tham số ràng buộc, và một định danh duy nhất thay đổi được thì phải đi qua một danh sách trắng có phương án lùi an toàn trước khi được nội suy vào; giá trị <code>sapXep</code> độc hại không đổi được gì và bảng vẫn còn đủ 100 bài.',
              0.6],
            ['chanchutrinh',
              '5b is a single <code>WITH RECURSIVE</code> carrying both guards — a depth cap and a visited-ids array with a membership test — and the two runs stop at depth 4 and depth 6 respectively, with the expected counts per depth.',
              '5b là một <code>WITH RECURSIVE</code> duy nhất mang cả hai lớp chặn — chặn độ sâu và một mảng id đã thăm kèm phép kiểm thành viên — và hai lượt chạy dừng lần lượt ở độ sâu 4 và độ sâu 6, với đúng số lượng mong đợi ở mỗi tầng.',
              0.4],
          ]),
        }),
      ],
    },
  ],
};
