/**
 * 3.1 — Băm mật khẩu và endpoint đăng ký (soạn 24/11/2026, agent fsp).
 * Output THẬT trên máy nhà (Node 22.22.2, argon2 0.45.2, Zod 4.6.7, Express 5.3.0, PostgreSQL 18.7 container fsp-pg), repo chiase tag ch3.
 * Phát hiện thật 24/11: SHA-256 ~553.000 lần/giây/nhân vs argon2id (OWASP m=19 MiB t=2 p=1) 40 ms; mặc định thư viện argon2 0.45.2 là
 * m=64 MiB t=3 p=4 (187 ms); 20 lần băm đồng thời xếp hàng sau threadpool 4 luồng của libuv (chậm nhất 294 ms / 1.650 ms),
 * RSS tăng theo số luồng × m (UV_THREADPOOL_SIZE=8 + mặc định ⇒ +513 MiB); mật khẩu tiếng Việt NFC vs NFD ⇒ verify false;
 * Zod 4: z.email().trim() kiểm TRƯỚC khi cắt ⇒ "  An@Mail.COM " bị từ chối, phải trim().toLowerCase().pipe(z.email());
 * Zod 4 min() đếm code point (4 emoji không qua min(8)); NIST SP 800-63B-4: tối thiểu 15 ký tự khi mật khẩu là yếu tố duy nhất.
 * Đăng ký trùng email trả CÙNG câu 202; thời gian 41,2 ms (mới) vs 49,0 ms (trùng) — lệch ~8 ms, ghi thật.
 * Sự cố có nguồn (GET 200, 24/11/2026): LinkedIn 05/06/2012 (Wikipedia "2012 LinkedIn hack").
 */
import { lienKet, spring, nguon } from '../_chung.mjs';

const THU_BAM = `// src/thu-bam.ts — tệp dùng-xong-xoá: đo băm nhanh (SHA-256) và băm chậm (argon2id)
import argon2 from 'argon2';
import { createHash } from 'node:crypto';

const mk = 'MatKhau-ChiaSe-2026';
let t = performance.now();
for (let i = 0; i &lt; 100_000; i++) createHash('sha256').update(mk + i).digest('hex');
const sha = (performance.now() - t) / 100_000;
console.log(\`sha256: \${(sha * 1000).toFixed(2)} µs/lần ⇒ ~\${Math.round(1000 / sha).toLocaleString('vi-VN')} lần/giây trên MỘT nhân\`);

for (const [memoryCost, timeCost] of [[19456, 2], [65536, 3], [262144, 4]] as const) {
  const lan: number[] = [];
  let h = '';
  for (let i = 0; i &lt; 5; i++) {
    t = performance.now();
    h = await argon2.hash(mk, { type: argon2.argon2id, memoryCost, timeCost, parallelism: 1 });
    lan.push(performance.now() - t);
  }
  lan.sort((a, b) =&gt; a - b);
  console.log(\`argon2id m=\${memoryCost / 1024} MiB t=\${timeCost}: trung vị \${lan[2]!.toFixed(0)} ms\`);
  if (memoryCost === 19456) console.log('  mã băm:', h);
}
const md = await argon2.hash(mk);
console.log('mặc định argon2.hash():', md);
console.log('lần 2:', await argon2.hash(mk)); // cùng mật khẩu, băm lần nữa
console.log('verify đúng:', await argon2.verify(md, mk), '| verify sai:', await argon2.verify(md, mk + 'x'));`;

const OUT_BAM = `$ npx tsx src/thu-bam.ts
sha256: 1.81 µs/lần ⇒ ~553.179 lần/giây trên MỘT nhân
argon2id m=19 MiB t=2: trung vị 40 ms
  mã băm: $argon2id$v=19$m=19456,t=2,p=1$RjJYtFYqng8r8X+42gpE3Q$nvWySIyWGpuFIPEg9L7lpeKITJTOab+i/oExAoMS/Ow
argon2id m=64 MiB t=3: trung vị 187 ms
argon2id m=256 MiB t=4: trung vị 1000 ms
mặc định argon2.hash(): $argon2id$v=19$m=65536,t=3,p=4$+ETAQXV4SFxwRcG6CeYx5w$W6Cwn4LzkKY4hUba3RT0zTVEVPQqSxxUWFspW2RlFKk
lần 2: $argon2id$v=19$m=65536,t=3,p=4$gpj80nJLCByvWb/kOWFC7Q$kxnQeEHQUMlwpDsRIYEJ21jm4WuEGMaHov00LaIyFrY
verify đúng: true | verify sai: false`;

const THU_DONGTHOI = `// src/thu-dongthoi.ts — 20 lần băm CÙNG LÚC (như 20 người bấm "Đăng ký" một lượt)
import argon2 from 'argon2';
const N = 20;
for (const [ten, opt] of [
  ['OWASP m=19MiB t=2 p=1', { type: argon2.argon2id, memoryCost: 19456, timeCost: 2, parallelism: 1 }],
  ['mặc định m=64MiB t=3 p=4', {}],
] as const) {
  const rss0 = process.memoryUsage().rss;
  let dinh = rss0;
  const do_ = setInterval(() =&gt; { dinh = Math.max(dinh, process.memoryUsage().rss); }, 5);
  const t = performance.now();
  const moi = await Promise.all(Array.from({ length: N }, async () =&gt; {
    const t1 = performance.now(); await argon2.hash('x' + Math.random(), opt); return performance.now() - t1;
  }));
  clearInterval(do_);
  moi.sort((a, b) =&gt; a - b);
  console.log(\`\${ten}: \${N} lần băm cùng lúc — tổng \${(performance.now() - t).toFixed(0)} ms, nhanh nhất \${moi[0]!.toFixed(0)} ms, chậm nhất \${moi[N - 1]!.toFixed(0)} ms, RSS tăng ~\${Math.round((dinh - rss0) / 2 ** 20)} MiB\`);
}`;

const OUT_DONGTHOI = `$ npx tsx src/thu-dongthoi.ts                       # UV_THREADPOOL_SIZE mặc định = 4
OWASP m=19MiB t=2 p=1: 20 lần băm cùng lúc — tổng 296 ms, nhanh nhất 51 ms, chậm nhất 294 ms, RSS tăng ~80 MiB
mặc định m=64MiB t=3 p=4: 20 lần băm cùng lúc — tổng 1651 ms, nhanh nhất 297 ms, chậm nhất 1650 ms, RSS tăng ~256 MiB
$ UV_THREADPOOL_SIZE=8 npx tsx src/thu-dongthoi.ts
OWASP m=19MiB t=2 p=1: 20 lần băm cùng lúc — tổng 268 ms, nhanh nhất 48 ms, chậm nhất 265 ms, RSS tăng ~152 MiB
mặc định m=64MiB t=3 p=4: 20 lần băm cùng lúc — tổng 1851 ms, nhanh nhất 602 ms, chậm nhất 1851 ms, RSS tăng ~513 MiB`;

const OUT_NPM_I = `$ npm i -w apps/api --save-exact argon2@0.45.2 zod@4.6.7 jose@6.2.18 express-rate-limit@8.7.5 cookie-parser@1.4.7

added 12 packages, and audited 297 packages in 8s

found 0 vulnerabilities
$ npm i -w apps/api -D --save-exact @types/cookie-parser@1.4.10

added 1 package, and audited 298 packages in 3s

found 0 vulnerabilities`;

const THU_NFC = `// src/thu-nfc.ts — cùng một mật khẩu tiếng Việt, hai cách mã hoá Unicode
import { z } from 'zod';
import argon2 from 'argon2';
const r = (v: string) =&gt; z.string().min(8).safeParse(v).success;
console.log('min(8): 4 emoji', r('😀😀😀😀'), '| 7 emoji', r('😀'.repeat(7)), '| 8 emoji', r('😀'.repeat(8)));
const nfc = 'Mật khẩu của tôi', nfd = nfc.normalize('NFD');
console.log('trông giống nhau:', nfc, '|', nfd, '| === ?', nfc === nfd);
console.log('độ dài NFC', nfc.length, 'NFD', nfd.length, '| byte NFC', Buffer.byteLength(nfc), 'NFD', Buffer.byteLength(nfd));
const h = await argon2.hash(nfc);
console.log('băm NFC, verify bằng NFD:', await argon2.verify(h, nfd));
console.log('verify NFD.normalize("NFC"):', await argon2.verify(h, nfd.normalize('NFC')));`;

const OUT_NFC = `$ npx tsx src/thu-nfc.ts
min(8): 4 emoji false | 7 emoji false | 8 emoji true
trông giống nhau: Mật khẩu của tôi | Mật khẩu của tôi | === ? false
độ dài NFC 16 NFD 22 | byte NFC 23 NFD 28
băm NFC, verify bằng NFD: false
verify NFD.normalize("NFC"): true`;

const MA_PASSWORD = `import argon2 from 'argon2';

// Tham số tối thiểu OWASP khuyên cho argon2id: m = 19 MiB, t = 2, p = 1 (~40 ms trên máy dev, bài 3.1 đo).
// Mã băm tự ghi tham số + muối ($argon2id$v=19$m=19456,t=2,p=1$muối$băm) ⇒ đổi tham số sau này không hỏng mã băm cũ.
const THAM_SO = { type: argon2.argon2id, memoryCost: 19_456, timeCost: 2, parallelism: 1 } as const;

// NFC: "ậ" gõ từ máy này có thể là 1 ký tự, từ máy khác là "a" + 2 dấu ghép (NFD) ⇒ khác byte ⇒ sai mật khẩu.
const chuan = (matKhau: string) =&gt; matKhau.normalize('NFC');

export const bamMatKhau = (matKhau: string) =&gt; argon2.hash(chuan(matKhau), THAM_SO);

export async function khopMatKhau(maBam: string, matKhau: string): Promise&lt;boolean&gt; {
  try {
    return await argon2.verify(maBam, chuan(matKhau));
  } catch {
    return false; // mã băm hỏng/"!" (tài khoản bị khoá) ⇒ coi như sai, không ném 500
  }
}

// Mã băm "giả" để khi email KHÔNG tồn tại vẫn tốn đúng thời gian như khi có ⇒ không dò email bằng đồng hồ (bài 3.2).
export const MA_BAM_GIA = await bamMatKhau('khong-ai-co-mat-khau-nay');

// Mã băm tạo bằng tham số cũ/yếu hơn ⇒ băm lại khi người dùng đăng nhập thành công.
export const canBamLai = (maBam: string) =&gt; argon2.needsRehash(maBam, THAM_SO);`;

const OUT_ZOD = `$ npx tsx src/thu-zod.ts
z.email()                          "  An@Mail.COM "   ⇒ LỖI: Invalid email address
z.email().trim().toLowerCase()     "  An@Mail.COM "   ⇒ LỖI: Invalid email address
z.string().trim().toLowerCase().pipe(z.email()) "  An@Mail.COM "   ⇒ "an@mail.com"
z.email()                          "an@localhost"     ⇒ LỖI: Invalid email address
z.email()                          "an.@mail.com"     ⇒ LỖI: Invalid email address
z.string().min(8)                  "mật khẩu"         ⇒ "mật khẩu"
z.string().min(8)                  "😀😀😀😀"         ⇒ LỖI: Too small: expected string to have &gt;=8 characters
độ dài "😀😀😀😀": 8 | [... ].length: 4 | byte UTF-8: 16`;

const MA_SCHEMA = `import { z } from 'zod';

// THỨ TỰ quan trọng: z.email().trim() kiểm định dạng TRƯỚC khi cắt ⇒ "  An@Mail.COM " bị từ chối (bài 3.1 thử).
// Cắt + chữ thường trước, rồi mới pipe sang kiểm email. Mọi nơi nhận email (đăng ký, đăng nhập) dùng chung schema này.
export const emailSchema = z.string().trim().toLowerCase().max(254).pipe(z.email('Email không hợp lệ'));

// NIST SP 800-63B-4 (2025): mật khẩu là yếu tố DUY NHẤT ⇒ tối thiểu 15 ký tự, cho phép ≥ 64; KHÔNG bắt "chữ hoa + số +
// ký tự đặc biệt", KHÔNG bắt đổi định kỳ. Zod 4 đếm theo code point — đúng cách NIST đếm (emoji = 1 ký tự).
// Tối đa 128: argon2 băm được dài hơn, nhưng chuỗi 1 MB là cách làm CPU bận vô ích.
const matKhauSchema = z
  .string()
  .min(15, 'Mật khẩu cần ít nhất 15 ký tự')
  .max(128, 'Mật khẩu tối đa 128 ký tự');

export const dangKySchema = z.object({
  email: emailSchema,
  password: matKhauSchema,
  displayName: z.string().trim().min(1, 'Cần tên hiển thị').max(50, 'Tên hiển thị tối đa 50 ký tự'),
});

// Đăng nhập KHÔNG kiểm độ dài tối thiểu: luật mật khẩu có thể đổi, tài khoản cũ vẫn phải đăng nhập được.
export const dangNhapSchema = z.object({
  email: emailSchema,
  password: z.string().min(1).max(128),
});

export type DangKy = z.infer&lt;typeof dangKySchema&gt;;
export type DangNhap = z.infer&lt;typeof dangNhapSchema&gt;;`;

const MA_VALIDATE = `import type { NextFunction, Request, Response } from 'express';
import type { z } from 'zod';

// Kiểm body bằng schema Zod; hợp lệ ⇒ THAY req.body bằng dữ liệu đã chuẩn hoá (đã trim, chữ thường…).
// Chương 5 nâng cấp: trả cả danh sách lỗi từng trường (details).
export const validateBody = (schema: z.ZodType) =&gt; (req: Request, res: Response, next: NextFunction) =&gt; {
  const kq = schema.safeParse(req.body ?? {});
  if (!kq.success) {
    const dau = kq.error.issues[0]!;
    res
      .status(400)
      .json({ error: { code: 'DU_LIEU_SAI', message: \`\${dau.path.join('.') || 'body'}: \${dau.message}\` } });
    return;
  }
  req.body = kq.data;
  next();
};`;

const MA_SVC_DANGKY = `import { randomUUID } from 'node:crypto';
import { prisma } from '../db/prisma.js';
import { Prisma } from '../generated/prisma/client.js';
import { HttpError } from '../lib/http-error.js';
import { bamMatKhau, khopMatKhau, MA_BAM_GIA, canBamLai } from '../lib/password.js';
import { kyAccessToken, taoRefreshToken, bamToken } from '../lib/tokens.js';
import { config } from '../config.js';
import type { DangKy, DangNhap } from '../schemas/auth.schema.js';

// Email đã qua emailSchema (trim + chữ thường) ở middleware validate — service KHÔNG tin điều đó với dữ liệu từ nơi khác
// (script, test, Chương 5…), nên chuẩn hoá lại: rẻ, và CHECK trong CSDL là lưới cuối.
const chuanEmail = (email: string) =&gt; email.trim().toLowerCase();

// ĐĂNG KÝ: trả CÙNG một câu dù email mới hay đã có ⇒ không ai dò được "email X có tài khoản ở ChiaSe không".
// Băm TRƯỚC khi ghi ⇒ hai trường hợp tốn cùng thời gian (~40 ms argon2), đồng hồ cũng không lộ.
export async function dangKy(input: DangKy) {
  const passwordHash = await bamMatKhau(input.password);
  try {
    await prisma.user.create({
      data: { email: chuanEmail(input.email), passwordHash, displayName: input.displayName },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError &amp;&amp; e.code === 'P2002') {
      console.warn('dang-ky: email đã có tài khoản (không báo cho client)'); // KHÔNG ghi email vào log
    } else {
      throw e; // P2039 (vi phạm CHECK) = bug của mình ⇒ 500 + log, không nuốt
    }
  }
  return { message: 'Nếu email này chưa có tài khoản, tài khoản đã được tạo. Hãy đăng nhập.' };
}`;

const OUT_CURL = `$ curl -s -X POST localhost:41815/api/auth/register -H "Content-Type: application/json" -d '{"email":"  Chi@Mail.COM ","password":"mat-khau-cua-chi","displayName":"Chi Lê"}' -w "  [HTTP %{http_code}]\\n"
{"message":"Nếu email này chưa có tài khoản, tài khoản đã được tạo. Hãy đăng nhập."}  [HTTP 202]
$ # đăng ký LẠI đúng email đó (chữ thường), mật khẩu khác
$ curl -s -X POST localhost:41815/api/auth/register -H "Content-Type: application/json" -d '{"email":"chi@mail.com","password":"mat-khau-ke-gian","displayName":"Kẻ gian"}' -w "  [HTTP %{http_code}]\\n"
{"message":"Nếu email này chưa có tài khoản, tài khoản đã được tạo. Hãy đăng nhập."}  [HTTP 202]
$ curl -s -X POST localhost:41815/api/auth/register -H "Content-Type: application/json" -d '{"email":"chi@mail","password":"ngan","displayName":""}'; echo
{"error":{"code":"DU_LIEU_SAI","message":"email: Email không hợp lệ"}}
$ curl -s -X POST localhost:41815/api/auth/register -H "Content-Type: application/json" -d '{"email":"dung@mail.com","password":"Abc@1234","displayName":"Dũng"}'; echo
{"error":{"code":"DU_LIEU_SAI","message":"password: Mật khẩu cần ít nhất 15 ký tự"}}
$ curl -s -X POST localhost:41815/api/auth/register -H "Content-Type: application/json" -d '{"email":"dung@mail.com","password":"ba con meo trèo cây cau","displayName":"Dũng"}' -w "  [HTTP %{http_code}]\\n"
{"message":"Nếu email này chưa có tài khoản, tài khoản đã được tạo. Hãy đăng nhập."}  [HTTP 202]`;

const OUT_PSQL = `$ docker exec chiase-pg psql -U chiase -c "SELECT email, display_name, left(password_hash, 40) || '…' AS password_hash FROM users ORDER BY created_at"
      email      | display_name |               password_hash               
-----------------+--------------+-------------------------------------------
 an@chiase.dev   | An Nguyễn    | $argon2id$v=19$m=19456,t=2,p=1$x6Fe75j5M…
 binh@chiase.dev | Bình Trần    | $argon2id$v=19$m=19456,t=2,p=1$0BTWnEtzG…
 chi@mail.com    | Chi Lê       | $argon2id$v=19$m=19456,t=2,p=1$ThD2i2e68…
 dung@mail.com   | Dũng         | $argon2id$v=19$m=19456,t=2,p=1$wl506Zi97…
(4 rows)`;

const OUT_GIO_DK = `# đăng ký email MỚI (mỗi lần một email khác)
HTTP 202 · 15 lần · trung vị 41.2 ms (nhanh nhất 34.1, chậm nhất 175.8)
# đăng ký email ĐÃ CÓ
HTTP 202 · 15 lần · trung vị 49.0 ms (nhanh nhất 44.4, chậm nhất 177.5)
# đăng nhập: email CÓ, sai mật khẩu
HTTP 401 · 15 lần · trung vị 41.6 ms (nhanh nhất 34.2, chậm nhất 179.1)
# đăng nhập: email KHÔNG có
HTTP 401 · 15 lần · trung vị 39.2 ms (nhanh nhất 33.0, chậm nhất 171.9)
# đăng nhập: email CÓ, đúng mật khẩu
HTTP 200 · 15 lần · trung vị 45.3 ms (nhanh nhất 35.7, chậm nhất 195.5)`;

const MA_SEED = `// Dữ liệu mẫu cho máy dev: npx prisma db seed (chạy lại nhiều lần vẫn ra cùng kết quả — upsert theo email).
import { prisma } from '../src/db/prisma.js';
import { bamMatKhau } from '../src/lib/password.js';

// Mật khẩu mẫu CHỈ cho máy dev (đổi được bằng biến SEED_PASSWORD). Seed KHÔNG BAO GIỜ chạy trên production.
const matKhau = process.env.SEED_PASSWORD ?? 'chiase-mau-2026';
const mau = [
  { email: 'an@chiase.dev', displayName: 'An Nguyễn' },
  { email: 'binh@chiase.dev', displayName: 'Bình Trần' },
];

for (const u of mau) {
  const passwordHash = await bamMatKhau(matKhau);
  const kq = await prisma.user.upsert({
    where: { email: u.email },
    update: { displayName: u.displayName, passwordHash },
    create: { ...u, passwordHash },
  });
  console.log('seed:', kq.email, kq.displayName);
}
console.log(\`Mật khẩu mẫu: \${matKhau}\`);
await prisma.$disconnect();`;

const OUT_SEED = `$ npx prisma db seed
seed: an@chiase.dev An Nguyễn
seed: binh@chiase.dev Bình Trần
Mật khẩu mẫu: chiase-mau-2026

🌱  The seed command has been executed.`;

const THE = [
  lienKet({ khoa: 'authentication', bai: 'auth-2-1-da-co-csdl', title: 'Authentication 2.1 — Kẻ tấn công ĐÃ CÓ cơ sở dữ liệu của bạn', sub: 'Vì sao phải băm chậm, muối, pepper — từ góc nhìn kẻ đã lấy được bảng users.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'authentication', bai: 'auth-2-2-chon-va-chinh', title: 'Authentication 2.2 — Chọn và chỉnh hàm băm, bằng phép đo', sub: 'argon2id / scrypt / bcrypt, đo trên máy của bạn rồi mới chọn tham số.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'authentication', bai: 'auth-2-4-chinh-sach', title: 'Authentication 2.4 — Chính sách mật khẩu theo NIST, không theo thói quen', sub: 'Độ dài, danh sách chặn, bỏ luật "chữ hoa + số + ký tự đặc biệt".', cta: 'Mở bài →' }),
  lienKet({ khoa: 'authentication', bai: 'auth-6-1-dang-ky', title: 'Authentication 6.1 — Đăng ký, và cái định danh không rút lại được', sub: 'Dò tài khoản qua form đăng ký, và vì sao xác minh email giải được.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nodejs', bai: 'nodejs-8-1-mat-khau-va-bam', title: 'Node.js 8.1 — Lưu mật khẩu: vì sao gần như mọi cách đều sai', sub: 'Bài khái niệm gốc mà bài này RÁP vào dự án.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📘', 'OWASP — Password Storage Cheat Sheet', 'argon2id tối thiểu m=19 MiB, t=2, p=1; bcrypt giới hạn 72 byte.', 'https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html'),
  nguon('📘', 'NIST SP 800-63B-4 — Passwords', 'Tối thiểu 15 ký tự khi mật khẩu là yếu tố duy nhất; cho phép ≥ 64; mỗi code point là một ký tự; nên chuẩn hoá NFC; cấm luật thành phần và đổi định kỳ.', 'https://pages.nist.gov/800-63-4/sp800-63b.html'),
  nguon('📰', 'Wikipedia — 2012 LinkedIn hack', '05/06/2012: ~6,5 triệu mật khẩu bị đánh cắp; 05/2016 lộ thêm ~100 triệu email + mật khẩu băm của cùng vụ; không dùng muối nên bị giải nhanh.', 'https://en.wikipedia.org/wiki/2012_LinkedIn_hack'),
  nguon('📘', 'OWASP — Authentication Cheat Sheet (Account creation)', 'Câu trả lời đúng cho form đăng ký không tiết lộ email đã có tài khoản.', 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html'),
  nguon('📘', 'Unicode UAX #15 — Normalization Forms', 'NFC và NFD: cùng chữ, khác chuỗi byte.', 'https://unicode.org/reports/tr15/'),
].join('\n');

const MERMAID = `flowchart LR
  A["POST /api/auth/register"] --> B["gioiHanXacThuc · 10 lần / 15 phút"]
  B --> C["validateBody · Zod: trim, chữ thường, 15–128 ký tự"]
  C -->|sai| X["400 DU_LIEU_SAI"]
  C --> D["dangKy · argon2id ~40 ms"]
  D --> E[("INSERT users")]
  E -->|mới| F["202 + câu chung"]
  E -->|"P2002: email trùng"| F`;

export default {
  title: '3.1 — Password hashing and the register endpoint|||3.1 — Băm mật khẩu và endpoint đăng ký',
  slug: 'fp-3-1-dang-ky',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Vì sao SHA-256 sai cho mật khẩu (đo: ~553.000 lần/giây/nhân) và argon2id đúng (40 ms); chọn tham số bằng phép đo, kể cả khi 20 người đăng ký cùng lúc (threadpool 4 luồng + RAM); bẫy tiếng Việt NFC/NFD làm sai mật khẩu; Zod 4 validate (bẫy z.email().trim()); chính sách NIST 800-63B-4 (15 ký tự); endpoint đăng ký trả CÙNG một câu dù email đã có — kèm vụ LinkedIn 2012.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Register</span>
<h2>Store a password so that even you cannot read it — and let nobody learn who has an account</h2>
<p class="lead">This lesson gives ChiaSe its first real feature: <code>POST /api/auth/register</code>. Two things must be true. If someone steals the <code>users</code> table tomorrow, the passwords inside must cost them years, not minutes. And the endpoint must not become a free tool for checking whether an email has an account. We measure everything on a real machine — including two traps nobody warns you about: hashing under concurrent load, and Vietnamese text that looks identical but hashes differently.</p>

<pre><code class="language-mermaid">${MERMAID}</code></pre>

<h3>1. Why a fast hash is the wrong tool</h3>
<p>A hash function turns any input into a fixed-length fingerprint and cannot be reversed. You never store the password, only the fingerprint; at login you hash what the user typed and compare. But "cannot be reversed" is not the threat. The threat is <em>guessing</em>: an attacker with your table hashes a list of likely passwords and looks for matches. So the question is: how many guesses per second does your hash allow? We measured it.</p>
<pre><code class="language-ts">${THU_BAM}</code></pre>
<div class="out">${OUT_BAM}</div>
<p>SHA-256 manages about 553,000 guesses per second on <em>one</em> CPU core of this machine; a GPU does billions. argon2id with OWASP's minimum settings (19 MiB of memory, 2 passes, 1 lane) takes 40 ms — roughly 22,000 times slower — and each guess needs 19 MiB of RAM, which is exactly what makes GPUs and custom chips expensive to use against it. Two more things in the output: the same password hashed twice gives two different strings (a random <strong>salt</strong> is generated each time, so identical passwords do not look identical and precomputed tables are useless), and the hash string records its own algorithm, parameters and salt — <code>$argon2id$v=19$m=19456,t=2,p=1$salt$hash</code> — so you can change parameters later without breaking old hashes.</p>

<h3>2. Choose parameters by measuring under load, not alone</h3>
<p>The library default is m=64 MiB, t=3, p=4 (187 ms here). Stronger is better — until twenty people press "Register" at the same moment. Node runs argon2 on libuv's thread pool, which has <strong>4 threads</strong> by default; the rest queue.</p>
<pre><code class="language-ts">${THU_DONGTHOI}</code></pre>
<div class="out">${OUT_DONGTHOI}</div>
<div class="pitfall co-tieu-de"><p><strong>Trap — the cost is per request, multiplied by concurrency.</strong> With library defaults the 20th user waited 1.65 s; with 8 threads the process grew by 513 MiB. Chapter 9 puts the API in a container limited to 2 GB — a burst of sign-ups could get it killed for out-of-memory. OWASP's minimum (m=19 MiB, t=2, p=1) keeps the 20th user under 300 ms and the memory under 100 MiB, while still being expensive for an attacker. Rate limiting (lesson 3.3) caps the burst. Rule: pick the most expensive parameters for which <em>your expected peak</em> still fits in time and RAM — measure, don't copy.</p></div>

<h3>3. Install, pinned</h3>
<div class="out">${OUT_NPM_I}</div>
<p><code>argon2</code> ships prebuilt binaries for Windows, macOS and Linux, so no compiler is needed. Exact versions (<code>--save-exact</code>) for the same reason as Prisma in Chapter 2: what the lessons show is what you get.</p>

<h3>4. The password module — and the Vietnamese trap</h3>
<p>The same Vietnamese word can be stored as different Unicode sequences: "ậ" as one code point (NFC) or as "a" plus two combining marks (NFD). Some keyboards and operating systems produce NFD. They look identical on screen.</p>
<pre><code class="language-ts">${THU_NFC}</code></pre>
<div class="out">${OUT_NFC}</div>
<p>Registering on one machine and logging in from another would fail with "wrong password" — and nobody could explain why. NIST SP 800-63B-4 says verifiers <em>should</em> normalise to NFC; we do it in one place:</p>
<pre><code class="language-ts">${MA_PASSWORD}</code></pre>
<p><code>khopMatKhau</code> returns <code>false</code> instead of throwing when the stored value is not a valid hash — the seed's <code>'!'</code> from Chapter 2 is exactly such a value. <code>MA_BAM_GIA</code> and <code>canBamLai</code> are used in lesson 3.2.</p>

<h3>5. Validate with Zod — order matters</h3>
<div class="out">${OUT_ZOD}</div>
<div class="pitfall co-tieu-de"><p><strong>Trap — <code>z.email().trim()</code> rejects <code>"  An@Mail.COM "</code>.</strong> In Zod 4 the email check runs before the trim. Users paste emails with spaces all the time (from a chat, from autofill). Trim and lowercase first, then <code>.pipe(z.email())</code>.</p></div>
<p>The password policy follows NIST SP 800-63B-4 (2025), not habit: when the password is the <em>only</em> factor, minimum <strong>15 characters</strong>; allow at least 64; count each Unicode code point as one character (Zod 4 does — the output shows 4 emoji fail <code>min(8)</code> although <code>.length</code> is 8); and <em>no</em> "must contain an uppercase letter, a digit and a symbol" rules, <em>no</em> forced periodic changes. <code>Abc@1234</code> passes the old rules and is in every cracking list; <code>ba con meo trèo cây cau</code> fails them and is far stronger.</p>
<pre><code class="language-ts">${MA_SCHEMA}</code></pre>
<pre><code class="language-ts">${MA_VALIDATE}</code></pre>
<p>After validation, <code>req.body</code> is the <em>cleaned</em> data (trimmed, lowercase). Chapter 5 extends the error shape with a per-field <code>details</code> list.</p>

<h3>6. The service: one answer for new and existing emails</h3>
<pre><code class="language-ts">${MA_SVC_DANGKY}</code></pre>
<p>If the endpoint answered "this email is already registered", anyone could test a list of emails and learn who uses ChiaSe — useful for phishing and for targeting password-guessing. OWASP's correct answer is a sentence that is true in both cases. We return <strong>202 Accepted</strong> with the same body either way, and we hash <em>before</em> inserting so both paths spend the ~40 ms of argon2.</p>
<div class="out">${OUT_CURL}</div>
<div class="out">${OUT_PSQL}</div>
<p>The second request (an attacker trying to take over Chi's email with their own password) got the same answer and changed nothing; the table still holds Chi's hash. And the timing, measured 15 times each:</p>
<div class="out">${OUT_GIO_DK}</div>
<p>Honest numbers: the duplicate path is about 8 ms slower (the failed INSERT and the error object). With hundreds of samples an attacker could see that. And there is a bigger leak we cannot close here: they can simply try to <em>log in</em>. The real fix is email verification ("we sent a link to this address" — the answer is identical and the account only becomes usable from the inbox), which Chapter 1 cut from scope. What we do instead: identical answers, hashing on both paths, and the rate limit of lesson 3.3 so enumeration becomes slow. Writing down a known limitation is part of the job.</p>

<h3>7. Controller, route, seed</h3>
<p>The controller is two lines; the route chains limiter → validation → controller (full file in lesson 3.3):</p>
<pre><code class="language-ts">export async function postDangKy(req: Request, res: Response) {
  res.status(202).json(await auth.dangKy(req.body));
}
// routes/index.ts
apiRouter.post('/auth/register', gioiHanXacThuc, validateBody(dangKySchema), postDangKy);</code></pre>
<p>The Chapter 2 seed used <code>'!'</code> so nobody could log in. Now it gets real hashes — the password is for your dev machine only:</p>
<pre><code class="language-ts">${MA_SEED}</code></pre>
<div class="out">${OUT_SEED}</div>

<h3>🕵️ Hacker's corner — LinkedIn, 2012</h3>
<p>On 5 June 2012 about 6.5 million LinkedIn password hashes were posted online. They were hashed without a salt, so identical passwords produced identical hashes and precomputed tables cracked a huge share within days. In May 2016 a further ~100 million emails and hashes from the same breach appeared for sale, and LinkedIn had to invalidate passwords of everyone who had not changed theirs since 2012. Four years later the 2012 decision was still costing money. Your <code>password_hash</code> column is the thing that will outlive every other line in this repo.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">rate limit</span><span class="lz-d">10 attempts / 15 min per IP (lesson 3.3)</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">validateBody</span><span class="lz-d">trim + lowercase email, then check; password 15–128 code points</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">argon2id hash</span><span class="lz-d">NFC first; m=19 MiB t=2 p=1, ~40 ms</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">INSERT users</span><span class="lz-d">P2002 duplicate ⇒ log without email, do not tell the client</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">202</span><span class="lz-d">the same sentence for new and existing emails</span></div>
</div>

<h3>In everyday life</h3>
<p>A hash is like a fingerprint: from a person you get the fingerprint instantly, from a fingerprint you cannot rebuild the person — but you can check every suspect's finger. Slow hashing makes each check take a minute instead of a second. The salt is like each user having a different ink colour: a print taken from one database cannot be compared with prints from another.</p>

<h3>On a real job</h3>
<p>In outsourcing projects you will often inherit a <code>users</code> table hashed with MD5 or unsalted SHA-1. Do not force everyone to reset: wrap or re-hash on next successful login (the <code>canBamLai</code> function of lesson 3.2 is that mechanism). A common review comment: "why does register return 202 for an existing email?" — now you can answer with the enumeration argument and OWASP's guidance.</p>

${spring(true, 'Spring Security gives you <code>PasswordEncoder</code> (<code>Argon2PasswordEncoder</code> or <code>BCryptPasswordEncoder</code>); validation is Bean Validation (<code>@Email</code>, <code>@Size</code>) on a DTO with <code>@Valid</code>. Same rules: same answer for existing emails, measured parameters, NFC before encoding.', [
  ['sb-9-2-password-encoder', 'Spring Boot 9.2 — Password hashing with PasswordEncoder'],
  ['sb-5-1-bean-validation', 'Spring Boot 5.1 — Jakarta Bean Validation'],
  ['sb-9-1-security-filter-chain', 'Spring Boot 9.1 — The Spring Security filter chain'],
])}

<h3>🎤 What the interviewer will ask</h3>
<ol>
<li><strong>"Why not SHA-256 for passwords?"</strong> — It is designed to be fast; an attacker with the table guesses hundreds of thousands per second per core. Password hashes must be slow and memory-hard (argon2id, scrypt, bcrypt).</li>
<li><strong>"What is a salt, where do you store it?"</strong> — A random value per password so identical passwords hash differently; it is not secret and is stored inside the hash string.</li>
<li><strong>"How do you choose argon2 parameters?"</strong> — Start from OWASP's minimum, measure on production-like hardware under expected peak concurrency, raise while latency and memory fit.</li>
<li><strong>"What does NIST say about password rules?"</strong> — Length (15 if single-factor), allow long passphrases, check against breached lists, no composition rules, no periodic changes.</li>
<li><strong>"Should register say the email is taken?"</strong> — No: same answer and similar timing; the full fix is email verification; rate-limit the rest.</li>
</ol>

<h3>🧪 Lab 3.1 (60 minutes)</h3>
<div class="callout ok">
<ol>
<li>On branch <code>ch3/xac-thuc</code>, run <code>thu-bam.ts</code> and <code>thu-dongthoi.ts</code> on <em>your</em> machine. Write your numbers in <code>docs/do-argon2.md</code> and choose parameters with one sentence of reasoning.</li>
<li>Write <code>lib/password.ts</code> with NFC; prove with <code>thu-nfc.ts</code> that NFD now verifies. Delete the scratch files.</li>
<li>Write <code>auth.schema.ts</code> and <code>validateBody</code>; prove <code>"  An@Mail.COM "</code> becomes <code>an@mail.com</code> and <code>Abc@1234</code> is rejected.</li>
<li>Write <code>dangKy</code> + controller + route; reproduce the five curl calls above.</li>
<li>Update the seed; log in is not possible yet, but <code>psql</code> must show <code>$argon2id$…</code> for both seed users.</li>
</ol>
<p><strong>Done when:</strong> new and duplicate registration return byte-identical bodies with 202, the database holds only argon2id hashes, and your measurement note exists.</p>
<p><strong>Scoring (10):</strong> measured parameters with reasoning (2) · NFC (1) · schema order correct + NIST policy (2) · identical answers + hash before insert (3) · P2039 not swallowed (1) · seed with real hashes (1).</p>
</div>
<details><summary>Solution</summary>
<p>All code is in the ChiaSe repo at tag <code>ch3</code>: <code>apps/api/src/lib/password.ts</code>, <code>schemas/auth.schema.ts</code>, <code>middlewares/validate.ts</code>, <code>services/auth.service.ts</code> (function <code>dangKy</code>), <code>prisma/seed.ts</code>. If your duplicate registration returns 500, you are not catching <code>P2002</code> (check <code>e instanceof Prisma.PrismaClientKnownRequestError</code>, imported from your generated client). If both bodies match but the duplicate is 40 ms faster, you look up the email before hashing — hash first.</p>
</details>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">hash</span><span class="v">One-way fingerprint of any input, fixed length.</span></div>
  <div class="kv"><span class="k">salt</span><span class="v">Random, non-secret value per password, stored in the hash string.</span></div>
  <div class="kv"><span class="k">argon2id</span><span class="v">Memory-hard password hash; parameters m (memory), t (passes), p (lanes).</span></div>
  <div class="kv"><span class="k">libuv thread pool</span><span class="v">4 background threads (default) where Node runs argon2, file I/O, DNS…</span></div>
  <div class="kv"><span class="k">NFC / NFD</span><span class="v">Composed / decomposed Unicode forms of the same text.</span></div>
  <div class="kv"><span class="k">account enumeration</span><span class="v">Learning which identifiers have accounts from different answers or timings.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Fast hashes (SHA-256) are wrong for passwords; argon2id with measured parameters is right.</li>
<li>Cost multiplies with concurrency: the thread pool queues, memory grows — measure at peak.</li>
<li>Normalise passwords to NFC; trim + lowercase emails <em>before</em> validating them.</li>
<li>NIST 800-63B-4: 15+ characters, no composition rules, no periodic changes.</li>
<li>Register answers identically (202) for new and existing emails, hashing on both paths.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Đăng ký</span>
<h2>Cất mật khẩu sao cho chính bạn cũng không đọc được — và không để ai biết ai có tài khoản</h2>
<p class="lead">Bài này cho ChiaSe tính năng thật đầu tiên: <code>POST /api/auth/register</code>. Phải đúng hai điều. Nếu ngày mai ai đó lấy trộm bảng <code>users</code>, mật khẩu trong đó phải tốn của họ nhiều năm, không phải vài phút. Và endpoint này không được biến thành công cụ miễn phí để dò xem một email có tài khoản hay không. Mọi thứ được đo trên máy thật — kể cả hai cái bẫy ít ai nhắc: băm khi nhiều người cùng đăng ký, và chữ tiếng Việt trông giống hệt nhau nhưng băm ra khác nhau.</p>

<pre><code class="language-mermaid">${MERMAID}</code></pre>

<h3>1. Vì sao hàm băm nhanh là công cụ sai</h3>
<p>Hàm băm biến dữ liệu bất kỳ thành một "dấu vân tay" dài cố định, và không đảo ngược được. Bạn không bao giờ lưu mật khẩu, chỉ lưu dấu vân tay; lúc đăng nhập thì băm thứ người dùng gõ rồi so. Nhưng mối nguy không nằm ở chỗ "đảo ngược". Mối nguy là <em>đoán</em>: kẻ có bảng của bạn băm một danh sách mật khẩu hay gặp rồi tìm cái trùng. Vậy câu hỏi là: hàm băm của bạn cho phép đoán bao nhiêu lần mỗi giây? Ta đo.</p>
<pre><code class="language-ts">${THU_BAM}</code></pre>
<div class="out">${OUT_BAM}</div>
<p>SHA-256 làm được khoảng 553.000 lần đoán mỗi giây trên <em>một</em> nhân CPU của máy này; GPU làm hàng tỉ. argon2id với mức tối thiểu OWASP khuyên (19 MiB bộ nhớ, 2 lượt, 1 làn) mất 40 ms — chậm hơn khoảng 22.000 lần — và mỗi lần đoán cần 19 MiB RAM, chính điều đó làm GPU và chip chuyên dụng trở nên đắt khi đem ra tấn công. Thêm hai điều trong output: cùng một mật khẩu băm hai lần ra hai chuỗi khác nhau (mỗi lần sinh một <strong>muối</strong> ngẫu nhiên, nên mật khẩu giống nhau không lộ ra là giống nhau và bảng tính sẵn trở nên vô dụng), và chuỗi băm tự ghi thuật toán, tham số và muối của nó — <code>$argon2id$v=19$m=19456,t=2,p=1$muối$băm</code> — nên sau này đổi tham số không làm hỏng mã băm cũ.</p>

<h3>2. Chọn tham số bằng phép đo khi CÓ TẢI, không phải khi chạy một mình</h3>
<p>Mặc định của thư viện là m=64 MiB, t=3, p=4 (187 ms ở đây). Mạnh hơn thì tốt hơn — cho tới khi hai mươi người cùng bấm "Đăng ký" một lúc. Node chạy argon2 trên threadpool của libuv, mặc định chỉ có <strong>4 luồng</strong>; số còn lại xếp hàng.</p>
<pre><code class="language-ts">${THU_DONGTHOI}</code></pre>
<div class="out">${OUT_DONGTHOI}</div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — chi phí tính theo từng request, rồi nhân với số request đồng thời.</strong> Với mặc định của thư viện, người thứ 20 chờ 1,65 giây; với 8 luồng, tiến trình phình thêm 513 MiB. Chương 9 đặt API vào container giới hạn 2 GB — một đợt đăng ký dồn dập có thể làm nó bị giết vì hết bộ nhớ. Mức tối thiểu OWASP (m=19 MiB, t=2, p=1) giữ người thứ 20 dưới 300 ms và bộ nhớ dưới 100 MiB, mà vẫn đắt với kẻ tấn công. Giới hạn tần suất (bài 3.3) chặn trần đợt dồn. Luật: chọn tham số đắt nhất mà ở <em>mức cao điểm bạn dự kiến</em> vẫn vừa thời gian và RAM — đo, đừng chép.</p></div>

<h3>3. Cài gói, ghim phiên bản</h3>
<div class="out">${OUT_NPM_I}</div>
<p><code>argon2</code> có sẵn bản dựng cho Windows, macOS và Linux, không cần trình biên dịch. Ghim đúng phiên bản (<code>--save-exact</code>) vì cùng lý do như Prisma ở Chương 2: bài hiện gì thì bạn nhận đúng cái đó.</p>

<h3>4. Module mật khẩu — và cái bẫy tiếng Việt</h3>
<p>Cùng một chữ tiếng Việt có thể lưu bằng hai dãy Unicode khác nhau: "ậ" là một code point (NFC), hoặc "a" cộng hai dấu ghép (NFD). Một số bộ gõ và hệ điều hành sinh ra NFD. Trên màn hình chúng giống hệt nhau.</p>
<pre><code class="language-ts">${THU_NFC}</code></pre>
<div class="out">${OUT_NFC}</div>
<p>Đăng ký trên máy này, đăng nhập từ máy khác sẽ báo "sai mật khẩu" — và không ai giải thích nổi vì sao. NIST SP 800-63B-4 nói bên kiểm <em>nên</em> chuẩn hoá về NFC; ta làm ở đúng một chỗ:</p>
<pre><code class="language-ts">${MA_PASSWORD}</code></pre>
<p><code>khopMatKhau</code> trả <code>false</code> thay vì ném lỗi khi giá trị đã lưu không phải mã băm hợp lệ — dấu <code>'!'</code> trong seed Chương 2 đúng là loại giá trị đó. <code>MA_BAM_GIA</code> và <code>canBamLai</code> dùng ở bài 3.2.</p>

<h3>5. Kiểm dữ liệu bằng Zod — thứ tự là quan trọng</h3>
<div class="out">${OUT_ZOD}</div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — <code>z.email().trim()</code> từ chối <code>"  An@Mail.COM "</code>.</strong> Trong Zod 4, phép kiểm email chạy TRƯỚC khi cắt khoảng trắng. Người dùng dán email có dấu cách suốt (từ tin nhắn, từ tự điền). Cắt và đổi chữ thường trước, rồi mới <code>.pipe(z.email())</code>.</p></div>
<p>Chính sách mật khẩu theo NIST SP 800-63B-4 (2025), không theo thói quen: khi mật khẩu là yếu tố <em>duy nhất</em>, tối thiểu <strong>15 ký tự</strong>; cho phép ít nhất 64; mỗi code point Unicode đếm là một ký tự (Zod 4 đếm đúng như vậy — output cho thấy 4 emoji không qua <code>min(8)</code> dù <code>.length</code> là 8); và <em>không</em> luật "phải có chữ hoa, số và ký tự đặc biệt", <em>không</em> bắt đổi định kỳ. <code>Abc@1234</code> qua luật cũ và nằm trong mọi danh sách bẻ khoá; <code>ba con meo trèo cây cau</code> trượt luật cũ mà mạnh hơn nhiều.</p>
<pre><code class="language-ts">${MA_SCHEMA}</code></pre>
<pre><code class="language-ts">${MA_VALIDATE}</code></pre>
<p>Sau khi kiểm, <code>req.body</code> là dữ liệu <em>đã làm sạch</em> (đã cắt, chữ thường). Chương 5 mở rộng dạng lỗi với danh sách <code>details</code> theo từng trường.</p>

<h3>6. Service: một câu trả lời cho cả email mới lẫn email đã có</h3>
<pre><code class="language-ts">${MA_SVC_DANGKY}</code></pre>
<p>Nếu endpoint trả lời "email này đã được đăng ký", ai cũng thử được một danh sách email và biết ai đang dùng ChiaSe — có ích cho lừa đảo và cho dò mật khẩu có chủ đích. Câu trả lời đúng theo OWASP là một câu đúng trong cả hai trường hợp. Ta trả <strong>202 Accepted</strong> với cùng một body, và băm <em>trước</em> khi chèn để cả hai nhánh cùng tốn ~40 ms của argon2.</p>
<div class="out">${OUT_CURL}</div>
<div class="out">${OUT_PSQL}</div>
<p>Request thứ hai (kẻ gian thử chiếm email của Chi bằng mật khẩu của mình) nhận cùng câu trả lời và không đổi được gì; bảng vẫn giữ mã băm của Chi. Còn thời gian, đo mỗi loại 15 lần:</p>
<div class="out">${OUT_GIO_DK}</div>
<p>Số thật thì nói thật: nhánh email trùng chậm hơn khoảng 8 ms (lệnh INSERT thất bại và đối tượng lỗi). Với hàng trăm mẫu, kẻ tấn công nhìn ra được. Và còn một chỗ rò lớn hơn ta chưa đóng được ở đây: họ cứ việc thử <em>đăng nhập</em>. Cách sửa tận gốc là xác minh email ("chúng tôi đã gửi đường dẫn tới địa chỉ này" — câu trả lời giống hệt nhau và tài khoản chỉ dùng được khi bấm từ hộp thư), thứ Chương 1 đã cắt khỏi phạm vi. Thay vào đó ta làm: câu trả lời giống nhau, băm ở cả hai nhánh, và giới hạn tần suất của bài 3.3 để việc dò trở nên chậm. Ghi lại một giới hạn đã biết cũng là một phần của công việc.</p>

<h3>7. Controller, route, seed</h3>
<p>Controller chỉ hai dòng; route xâu chuỗi giới hạn tần suất → kiểm dữ liệu → controller (tệp đầy đủ ở bài 3.3):</p>
<pre><code class="language-ts">export async function postDangKy(req: Request, res: Response) {
  res.status(202).json(await auth.dangKy(req.body));
}
// routes/index.ts
apiRouter.post('/auth/register', gioiHanXacThuc, validateBody(dangKySchema), postDangKy);</code></pre>
<p>Seed Chương 2 dùng <code>'!'</code> để không ai đăng nhập được. Giờ nó có mã băm thật — mật khẩu chỉ dùng cho máy dev của bạn:</p>
<pre><code class="language-ts">${MA_SEED}</code></pre>
<div class="out">${OUT_SEED}</div>

<h3>🕵️ Góc hacker — LinkedIn, 2012</h3>
<p>Ngày 05/06/2012, khoảng 6,5 triệu mã băm mật khẩu LinkedIn bị đăng lên mạng. Chúng được băm không có muối, nên mật khẩu giống nhau cho mã băm giống nhau, và bảng tính sẵn bẻ được một phần rất lớn chỉ trong vài ngày. Tháng 5/2016, thêm khoảng 100 triệu email và mã băm của cùng vụ đó bị rao bán, và LinkedIn phải vô hiệu mật khẩu của mọi người chưa đổi mật khẩu từ 2012. Bốn năm sau, quyết định năm 2012 vẫn còn tốn tiền. Cột <code>password_hash</code> của bạn là thứ sống lâu hơn mọi dòng mã khác trong repo này.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">giới hạn tần suất</span><span class="lz-d">10 lần / 15 phút mỗi IP (bài 3.3)</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">validateBody</span><span class="lz-d">cắt + chữ thường email rồi mới kiểm; mật khẩu 15–128 code point</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">băm argon2id</span><span class="lz-d">NFC trước; m=19 MiB t=2 p=1, ~40 ms</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">INSERT users</span><span class="lz-d">P2002 trùng email ⇒ log không kèm email, không báo client</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">202</span><span class="lz-d">cùng một câu cho email mới và email đã có</span></div>
</div>

<h3>Liên hệ đời thường</h3>
<p>Hàm băm giống dấu vân tay: từ một người lấy dấu vân tay rất nhanh, từ dấu vân tay không dựng lại được người — nhưng có thể đem ngón tay của từng nghi phạm ra so. Băm chậm làm mỗi lần so mất một phút thay vì một giây. Muối giống như mỗi người dùng một màu mực riêng: dấu lấy từ CSDL này không đem so được với dấu ở CSDL khác.</p>

<h3>Đi làm thật</h3>
<p>Ở dự án outsourcing, bạn sẽ hay nhận lại một bảng <code>users</code> băm bằng MD5 hoặc SHA-1 không muối. Đừng bắt mọi người đặt lại mật khẩu: bọc lại hoặc băm lại ở lần đăng nhập thành công kế tiếp (hàm <code>canBamLai</code> của bài 3.2 chính là cơ chế đó). Một bình luận review hay gặp: "sao đăng ký email đã có lại trả 202?" — giờ bạn trả lời được bằng lập luận dò tài khoản và hướng dẫn của OWASP.</p>

${spring(false, 'Spring Security cho sẵn <code>PasswordEncoder</code> (<code>Argon2PasswordEncoder</code> hoặc <code>BCryptPasswordEncoder</code>); kiểm dữ liệu bằng Bean Validation (<code>@Email</code>, <code>@Size</code>) trên DTO kèm <code>@Valid</code>. Luật vẫn vậy: cùng câu trả lời cho email đã có, tham số chọn bằng phép đo, chuẩn hoá NFC trước khi băm.', [
  ['sb-9-2-password-encoder', 'Spring Boot 9.2 — Băm mật khẩu với PasswordEncoder'],
  ['sb-5-1-bean-validation', 'Spring Boot 5.1 — Jakarta Bean Validation'],
  ['sb-9-1-security-filter-chain', 'Spring Boot 9.1 — Chuỗi filter của Spring Security'],
])}

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>"Sao không dùng SHA-256 cho mật khẩu?"</strong> — Nó được thiết kế để nhanh; kẻ có bảng đoán được hàng trăm nghìn lần mỗi giây trên mỗi nhân. Băm mật khẩu phải chậm và tốn bộ nhớ (argon2id, scrypt, bcrypt).</li>
<li><strong>"Muối là gì, cất ở đâu?"</strong> — Giá trị ngẫu nhiên riêng cho mỗi mật khẩu để mật khẩu giống nhau băm ra khác nhau; không bí mật, nằm ngay trong chuỗi băm.</li>
<li><strong>"Chọn tham số argon2 thế nào?"</strong> — Bắt đầu từ mức tối thiểu OWASP, đo trên phần cứng giống production ở mức đồng thời cao điểm dự kiến, nâng lên chừng nào thời gian và bộ nhớ còn vừa.</li>
<li><strong>"NIST nói gì về luật mật khẩu?"</strong> — Độ dài (15 nếu là yếu tố duy nhất), cho phép cụm mật khẩu dài, đối chiếu danh sách đã lộ, không luật thành phần, không bắt đổi định kỳ.</li>
<li><strong>"Đăng ký có nên báo email đã có người dùng?"</strong> — Không: cùng câu trả lời, thời gian tương đương; sửa tận gốc là xác minh email; phần còn lại thì giới hạn tần suất.</li>
</ol>

<h3>🧪 Lab 3.1 (60 phút)</h3>
<div class="callout ok">
<ol>
<li>Trên nhánh <code>ch3/xac-thuc</code>, chạy <code>thu-bam.ts</code> và <code>thu-dongthoi.ts</code> trên máy <em>của bạn</em>. Ghi số đo vào <code>docs/do-argon2.md</code> và chọn tham số kèm một câu lý do.</li>
<li>Viết <code>lib/password.ts</code> có NFC; chứng minh bằng <code>thu-nfc.ts</code> rằng giờ NFD đã khớp. Xoá các tệp thử.</li>
<li>Viết <code>auth.schema.ts</code> và <code>validateBody</code>; chứng minh <code>"  An@Mail.COM "</code> thành <code>an@mail.com</code> và <code>Abc@1234</code> bị từ chối.</li>
<li>Viết <code>dangKy</code> + controller + route; tái hiện năm lệnh curl ở trên.</li>
<li>Cập nhật seed; chưa đăng nhập được, nhưng <code>psql</code> phải thấy <code>$argon2id$…</code> cho cả hai người dùng mẫu.</li>
</ol>
<p><strong>Xong khi:</strong> đăng ký mới và đăng ký trùng trả body giống hệt từng byte với mã 202, CSDL chỉ chứa mã băm argon2id, và có tệp ghi số đo.</p>
<p><strong>Thang điểm (10):</strong> tham số chọn bằng phép đo có lý do (2) · NFC (1) · thứ tự schema đúng + chính sách NIST (2) · câu trả lời giống nhau + băm trước khi chèn (3) · không nuốt P2039 (1) · seed có mã băm thật (1).</p>
</div>
<details><summary>Lời giải</summary>
<p>Toàn bộ mã nằm trong repo ChiaSe tại tag <code>ch3</code>: <code>apps/api/src/lib/password.ts</code>, <code>schemas/auth.schema.ts</code>, <code>middlewares/validate.ts</code>, <code>services/auth.service.ts</code> (hàm <code>dangKy</code>), <code>prisma/seed.ts</code>. Nếu đăng ký trùng trả 500, bạn chưa bắt <code>P2002</code> (kiểm <code>e instanceof Prisma.PrismaClientKnownRequestError</code>, import từ client đã sinh). Nếu hai body giống nhau nhưng nhánh trùng nhanh hơn 40 ms, bạn đang tìm email trước rồi mới băm — hãy băm trước.</p>
</details>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">hash</span><span class="v">Hàm băm: dấu vân tay một chiều, độ dài cố định, của dữ liệu bất kỳ.</span></div>
  <div class="kv"><span class="k">salt</span><span class="v">Muối: giá trị ngẫu nhiên, không bí mật, riêng cho từng mật khẩu, nằm trong chuỗi băm.</span></div>
  <div class="kv"><span class="k">argon2id</span><span class="v">Hàm băm mật khẩu tốn bộ nhớ; tham số m (bộ nhớ), t (số lượt), p (số làn).</span></div>
  <div class="kv"><span class="k">libuv thread pool</span><span class="v">4 luồng nền (mặc định) nơi Node chạy argon2, đọc ghi tệp, DNS…</span></div>
  <div class="kv"><span class="k">NFC / NFD</span><span class="v">Dạng Unicode dựng sẵn / tách dấu của cùng một văn bản.</span></div>
  <div class="kv"><span class="k">account enumeration</span><span class="v">Dò tài khoản: biết định danh nào có tài khoản nhờ câu trả lời hoặc thời gian khác nhau.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Băm nhanh (SHA-256) sai cho mật khẩu; argon2id với tham số chọn bằng phép đo là đúng.</li>
<li>Chi phí nhân lên theo số request đồng thời: threadpool xếp hàng, bộ nhớ phình — đo ở mức cao điểm.</li>
<li>Chuẩn hoá mật khẩu về NFC; cắt + đổi chữ thường email <em>trước</em> khi kiểm.</li>
<li>NIST 800-63B-4: từ 15 ký tự, không luật thành phần, không bắt đổi định kỳ.</li>
<li>Đăng ký trả lời giống hệt (202) cho email mới và email đã có, băm ở cả hai nhánh.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
