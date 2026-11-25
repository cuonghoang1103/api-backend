/**
 * 3.2 — Đăng nhập, JWT và xoay vòng refresh token (soạn 24/11/2026, agent fsp).
 * Output THẬT trên máy nhà (jose 6.2.18, cookie-parser 1.4.7, Prisma 7.10.1, PostgreSQL 18.7, curl 8.18.0), repo chiase tag ch3.
 * Phát hiện thật 24/11: bỏ mã băm giả ⇒ đăng nhập email không tồn tại 4,8 ms vs email có 39,8 ms (dò tài khoản bằng đồng hồ);
 * có mã băm giả ⇒ 39,2 vs 41,6 ms. Cookie Secure vẫn được curl/trình duyệt nhận trên http://localhost. Dùng lại refresh token cũ
 * ⇒ 401 REFRESH_DUNG_LAI và thu hồi CẢ HỌ (token mới nhất của chủ thật cũng chết). Hai tab refresh cùng lúc: 19/20 lần ổn,
 * 1/20 lần tab thắng bị đăng xuất luôn (request thua tới sau khi token đã bị đánh dấu ⇒ bị coi là dùng lại) — Chương 6 sửa bằng
 * single-flight ở frontend. 15 lần đo đăng nhập sinh 15 họ token ⇒ bảng phình, cần dọn định kỳ.
 * Nguồn (GET 200, 24/11/2026): RFC 9700 (01/2025) §2.2.2, §4.14.2; Cloudflare blog 2023 (Okta, 18/10/2023).
 */
import { lienKet, spring, nguon } from '../_chung.mjs';

const MA_CONFIG = `// Đọc cấu hình MỘT lần, ở MỘT chỗ. Thiếu biến bắt buộc ⇒ dừng ngay lúc khởi động, không đợi tới request đầu tiên.
function batBuoc(ten: string): string {
  const v = process.env[ten];
  if (!v) throw new Error(\`Thiếu biến môi trường \${ten} — chép .env.example thành .env rồi điền\`);
  return v;
}

// Khoá ký JWT phải đủ dài: HS256 với khoá ngắn bị dò ngược bằng máy (hashcat) nếu lộ một token.
function khoaBiMat(ten: string): string {
  const v = batBuoc(ten);
  if (Buffer.byteLength(v) &lt; 32)
    throw new Error(\`\${ten} quá ngắn (cần ≥ 32 byte) — sinh bằng lệnh ghi trong .env.example\`);
  return v;
}

export const config = {
  port: Number(process.env.PORT ?? 41810),
  webOrigin: batBuoc('WEB_ORIGIN'),
  databaseUrl: batBuoc('DATABASE_URL'),
  jwtAccessSecret: khoaBiMat('JWT_ACCESS_SECRET'),
  accessTtlS: Number(process.env.ACCESS_TTL_S ?? 15 * 60), // 15 phút
  refreshTtlS: Number(process.env.REFRESH_TTL_S ?? 30 * 24 * 3600), // 30 ngày
};`;

const MA_TOKENS = `import { createHash, randomBytes } from 'node:crypto';
import { SignJWT, jwtVerify, errors } from 'jose';
import { config } from '../config.js';

const KHOA = new TextEncoder().encode(config.jwtAccessSecret);
const ISS = 'chiase-api';
const AUD = 'chiase-web';

// ACCESS TOKEN: JWT ký HS256, sống ngắn (15′). Server KHÔNG lưu — chỉ kiểm chữ ký + hạn ⇒ không thu hồi được trước hạn.
export function kyAccessToken(userId: string) {
  return new SignJWT({})
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setSubject(userId)
    .setIssuer(ISS)
    .setAudience(AUD)
    .setIssuedAt()
    .setExpirationTime(\`\${config.accessTtlS}s\`)
    .sign(KHOA);
}

export type KetQuaKiem = { ok: true; userId: string } | { ok: false; lyDo: 'HET_HAN' | 'KHONG_HOP_LE' };

export async function kiemAccessToken(token: string): Promise&lt;KetQuaKiem&gt; {
  try {
    // algorithms CỐ ĐỊNH: không bao giờ tin "alg" do token tự khai (lỗ hổng alg=none / nhầm thuật toán, bài 3.2)
    const { payload } = await jwtVerify(token, KHOA, { algorithms: ['HS256'], issuer: ISS, audience: AUD });
    if (!payload.sub) return { ok: false, lyDo: 'KHONG_HOP_LE' };
    return { ok: true, userId: payload.sub };
  } catch (e) {
    return { ok: false, lyDo: e instanceof errors.JWTExpired ? 'HET_HAN' : 'KHONG_HOP_LE' };
  }
}

// REFRESH TOKEN: KHÔNG phải JWT — chỉ là 32 byte ngẫu nhiên. Server lưu MÃ BĂM ⇒ thu hồi được bất cứ lúc nào.
// SHA-256 (nhanh) là đủ ở đây: token 256 bit ngẫu nhiên, không ai đoán được — khác mật khẩu do người nghĩ ra.
export const taoRefreshToken = () =&gt; randomBytes(32).toString('base64url');
export const bamToken = (token: string) =&gt; createHash('sha256').update(token).digest('hex');`;

const MA_MODEL = `/// Một refresh token = một dòng. Lưu MÃ BĂM SHA-256 của token, không lưu token: lộ bảng này vẫn không dùng được token.
/// familyId: mọi token sinh ra từ MỘT lần đăng nhập (xoay vòng nối tiếp nhau) — phát hiện dùng lại ⇒ thu hồi cả họ.
model RefreshToken {
  id        String    @id @default(dbgenerated("uuidv7()")) @db.Uuid
  userId    String    @map("user_id") @db.Uuid
  familyId  String    @map("family_id") @db.Uuid
  tokenHash String    @unique @map("token_hash") @db.Char(64)
  expiresAt DateTime  @map("expires_at") @db.Timestamptz
  revokedAt DateTime? @map("revoked_at") @db.Timestamptz
  createdAt DateTime  @default(now()) @map("created_at") @db.Timestamptz
  userAgent String?   @map("user_agent") @db.VarChar(200)

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([familyId])
  @@map("refresh_tokens")
}`;

const OUT_MIGRATE = `$ npx prisma migrate dev --name refresh_tokens
Applying migration \`20261124122750_refresh_tokens\`
The following migration(s) have been created and applied from new schema changes:
  └─ 20261124122750_refresh_tokens/
    └─ migration.sql
Your database is now in sync with your schema.`;

const MA_MIGRATION = `-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "user_id" UUID NOT NULL,
    "family_id" UUID NOT NULL,
    "token_hash" CHAR(64) NOT NULL,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "revoked_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_agent" VARCHAR(200),

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_hash_key" ON "refresh_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "refresh_tokens_user_id_idx" ON "refresh_tokens"("user_id");

-- CreateIndex
CREATE INDEX "refresh_tokens_family_id_idx" ON "refresh_tokens"("family_id");

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;`;

const MA_SVC_DANGNHAP = `type Phien = {
  accessToken: string;
  refreshToken: string;
  user: { id: string; email: string; displayName: string };
};

async function capPhien(userId: string, familyId: string, userAgent: string | undefined) {
  const refreshToken = taoRefreshToken();
  await prisma.refreshToken.create({
    data: {
      userId,
      familyId,
      tokenHash: bamToken(refreshToken),
      expiresAt: new Date(Date.now() + config.refreshTtlS * 1000),
      userAgent: userAgent?.slice(0, 200),
    },
  });
  return { accessToken: await kyAccessToken(userId), refreshToken };
}

const SAI = () =&gt; new HttpError(401, 'SAI_THONG_TIN', 'Email hoặc mật khẩu không đúng');

export async function dangNhap(input: DangNhap, userAgent?: string): Promise&lt;Phien&gt; {
  const user = await prisma.user.findUnique({
    where: { email: chuanEmail(input.email) },
    omit: { passwordHash: false }, // nơi DUY NHẤT trong mã lấy passwordHash ra
  });
  // Không có user vẫn chạy argon2 với mã băm giả ⇒ thời gian trả lời như nhau (bài 3.2 đo: không có dòng này lệch ~40 ms)
  const dung = await khopMatKhau(user?.passwordHash ?? MA_BAM_GIA, input.password);
  if (!user || !dung) throw SAI(); // CÙNG một lỗi cho "không có email" và "sai mật khẩu"

  if (canBamLai(user.passwordHash)) {
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: await bamMatKhau(input.password) },
    });
  }
  const phien = await capPhien(user.id, randomUUID(), userAgent); // đăng nhập mới = họ token mới
  return { ...phien, user: { id: user.id, email: user.email, displayName: user.displayName } };
}`;

const OUT_GIO_KHONG = `# BẢN THỬ không có mã băm giả
# đăng nhập: email CÓ, sai mật khẩu
HTTP 401 · 15 lần · trung vị 39.8 ms (nhanh nhất 34.9, chậm nhất 377.5)
# đăng nhập: email KHÔNG có
HTTP 401 · 15 lần · trung vị 4.8 ms (nhanh nhất 3.6, chậm nhất 121.4)`;

const OUT_GIO_CO = `# đăng ký email MỚI (mỗi lần một email khác)
HTTP 202 · 15 lần · trung vị 41.2 ms (nhanh nhất 34.1, chậm nhất 175.8)
# đăng ký email ĐÃ CÓ
HTTP 202 · 15 lần · trung vị 49.0 ms (nhanh nhất 44.4, chậm nhất 177.5)
# đăng nhập: email CÓ, sai mật khẩu
HTTP 401 · 15 lần · trung vị 41.6 ms (nhanh nhất 34.2, chậm nhất 179.1)
# đăng nhập: email KHÔNG có
HTTP 401 · 15 lần · trung vị 39.2 ms (nhanh nhất 33.0, chậm nhất 171.9)
# đăng nhập: email CÓ, đúng mật khẩu
HTTP 200 · 15 lần · trung vị 45.3 ms (nhanh nhất 35.7, chậm nhất 195.5)`;

const MA_CONTROLLER = `import type { CookieOptions, Request, Response } from 'express';
import * as auth from '../services/auth.service.js';
import { config } from '../config.js';

// Refresh token đi trong cookie httpOnly: JavaScript của trang (kể cả mã XSS) KHÔNG đọc được.
// path giới hạn: trình duyệt chỉ gửi cookie này tới /api/auth/*, không kèm vào mọi request khác.
const COOKIE = 'rt';
const tuyChon: CookieOptions = {
  httpOnly: true,
  secure: true, // trình duyệt + curl coi http://localhost là "an toàn" nên vẫn nhận; production BẮT BUỘC https
  sameSite: 'strict',
  path: '/api/auth',
  maxAge: config.refreshTtlS * 1000,
};
const datCookie = (res: Response, token: string) =&gt; res.cookie(COOKIE, token, tuyChon);
const { maxAge: _bo, ...tuyChonXoa } = tuyChon; // clearCookie cần CÙNG path/secure/sameSite, không cần maxAge

export async function postDangKy(req: Request, res: Response) {
  res.status(202).json(await auth.dangKy(req.body));
}

export async function postDangNhap(req: Request, res: Response) {
  const { refreshToken, ...phan } = await auth.dangNhap(req.body, req.get('user-agent'));
  datCookie(res, refreshToken);
  res.json(phan); // { accessToken, user } — refresh token KHÔNG nằm trong body
}

export async function postLamMoi(req: Request, res: Response) {
  try {
    const { refreshToken, accessToken } = await auth.lamMoi(req.cookies?.[COOKIE], req.get('user-agent'));
    datCookie(res, refreshToken);
    res.json({ accessToken });
  } catch (e) {
    res.clearCookie(COOKIE, tuyChonXoa); // phiên hỏng ⇒ xoá luôn cookie để trình duyệt không gửi lại mãi
    throw e;
  }
}

export async function postDangXuat(req: Request, res: Response) {
  await auth.dangXuat(req.cookies?.[COOKIE]);
  res.clearCookie(COOKIE, tuyChonXoa);
  res.status(204).end();
}`;

const OUT_LOGIN = `$ curl -si -c jar.txt -X POST localhost:41815/api/auth/login -H "Content-Type: application/json" -d '{"email":"chi@mail.com","password":"mat-khau-cua-chi"}' | grep -iv "^\\(date\\|connection\\|keep-alive\\|etag\\)"
HTTP/1.1 200 OK
Set-Cookie: rt=0ozvmN32DQWZ6l9UZzvsV2trU1kW-eoZ_V6oI_Zh_wk; Max-Age=2592000; Path=/api/auth; Expires=Thu, 24 Dec 2026 12:30:38 GMT; HttpOnly; Secure; SameSite=Strict
Content-Type: application/json; charset=utf-8
Content-Length: 357

{"accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMWEyMGQ4OC04NGZhLTdiM2QtOWMyOS0yNmM1NDhlNGZlMjkiLCJpc3MiOiJjaGlhc2UtYXBpIiwiYXVkIjoiY2hpYXNlLXdlYiIsImlhdCI6MTc5NTUyMzQzOCwiZXhwIjoxNzk1NTI0MzM4fQ.jNgScdDoOMhHieXxpRIvPf581pYNSQzLNbAhGYZB90E","user":{"id":"01a20d88-84fa-7b3d-9c29-26c548e4fe29","email":"chi@mail.com","displayName":"Chi Lê"}}`;

const OUT_JWT = `$ echo "$TOKEN" | cut -d. -f2 | base64 -d 2&gt;/dev/null; echo
{"sub":"01a20d88-84fa-7b3d-9c29-26c548e4fe29","iss":"chiase-api","aud":"chiase-web","iat":1795523448,"exp":1795524348}
$ cat jar.txt | tail -1
#HttpOnly_localhost	FALSE	/api/auth	TRUE	1798115448	rt	kf1PKz6I7FzA497xmLDMwGs4YA3QQir0XeavXaTskMU
$ curl -s localhost:41815/api/me -H "Authorization: Bearer $TOKEN"; echo
{"id":"01a20d88-84fa-7b3d-9c29-26c548e4fe29","email":"chi@mail.com","displayName":"Chi Lê","createdAt":"2026-11-24T12:29:40.442Z"}`;

const MA_SVC_LAMMOI = `// XOAY VÒNG: mỗi refresh token dùng ĐÚNG MỘT lần, đổi lấy cặp mới. Token đã dùng mà xuất hiện lại ⇒ có người
// đang giữ bản sao (bị đánh cắp) ⇒ thu hồi CẢ HỌ: kẻ trộm lẫn chủ thật đều phải đăng nhập lại (RFC 9700 §4.14.2).
export async function lamMoi(refreshToken: string | undefined, userAgent?: string) {
  if (!refreshToken) throw new HttpError(401, 'THIEU_REFRESH', 'Chưa đăng nhập');
  const rt = await prisma.refreshToken.findUnique({ where: { tokenHash: bamToken(refreshToken) } });
  if (!rt) throw new HttpError(401, 'REFRESH_KHONG_HOP_LE', 'Phiên không hợp lệ, hãy đăng nhập lại');

  if (rt.revokedAt) {
    const n = await prisma.refreshToken.updateMany({
      where: { familyId: rt.familyId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    console.warn(
      \`refresh: token đã dùng bị dùng lại — thu hồi họ \${rt.familyId} (\${n.count} token còn sống)\`,
    );
    throw new HttpError(401, 'REFRESH_DUNG_LAI', 'Phiên đã bị thu hồi, hãy đăng nhập lại');
  }
  if (rt.expiresAt &lt;= new Date())
    throw new HttpError(401, 'REFRESH_HET_HAN', 'Phiên đã hết hạn, hãy đăng nhập lại');

  // Đánh dấu "đã dùng" CÓ ĐIỀU KIỆN revokedAt = null: hai request cùng token chạy song song thì chỉ MỘT cái thắng.
  const danh = await prisma.refreshToken.updateMany({
    where: { id: rt.id, revokedAt: null },
    data: { revokedAt: new Date() },
  });
  if (danh.count === 0)
    throw new HttpError(401, 'REFRESH_DUNG_LAI', 'Phiên đã bị thu hồi, hãy đăng nhập lại');

  return capPhien(rt.userId, rt.familyId, userAgent); // cùng họ
}

// ĐĂNG XUẤT: thu hồi cả họ của refresh token này. Access token đang cầm VẪN dùng được tới khi hết hạn (bài 3.3 đo).
export async function dangXuat(refreshToken: string | undefined) {
  if (!refreshToken) return;
  const rt = await prisma.refreshToken.findUnique({ where: { tokenHash: bamToken(refreshToken) } });
  if (!rt) return;
  await prisma.refreshToken.updateMany({
    where: { familyId: rt.familyId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}`;

const OUT_XOAY = `$ cp jar.txt jar-cu.txt     # kẻ trộm chép được cookie lúc này
$ curl -s -b jar.txt -c jar.txt -X POST localhost:41815/api/auth/refresh; echo
{"accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMWEyMGQ4OC04NGZhLTdiM2QtOWMyOS0yNmM1NDhlNGZlMjkiLCJpc3MiOiJjaGlhc2UtYXBpIiwiYXVkIjoiY2hpYXNlLXdlYiIsImlhdCI6MTc5NTUyMzQ0OCwiZXhwIjoxNzk1NTI0MzQ4fQ.z2uhURuHg_Lz9rVEkjganYQcLpWBJIHBw8BCcq-qVtM"}
$ diff &lt;(tail -1 jar-cu.txt | cut -f7) &lt;(tail -1 jar.txt | cut -f7)
1c1
&lt; kf1PKz6I7FzA497xmLDMwGs4YA3QQir0XeavXaTskMU
---
&gt; AjPdhI4NHRfjVj2DphC7wCd67ZJopM15IC4rptl_vl8
$ curl -s -b jar.txt -c jar.txt -X POST localhost:41815/api/auth/refresh -o /dev/null -w "chủ thật refresh lần 2: HTTP %{http_code}\\n"
chủ thật refresh lần 2: HTTP 200
$ curl -s -b jar-cu.txt -X POST localhost:41815/api/auth/refresh; echo     # kẻ trộm dùng token CŨ
{"error":{"code":"REFRESH_DUNG_LAI","message":"Phiên đã bị thu hồi, hãy đăng nhập lại"}}
$ curl -s -b jar.txt -X POST localhost:41815/api/auth/refresh; echo        # chủ thật, token mới nhất
{"error":{"code":"REFRESH_DUNG_LAI","message":"Phiên đã bị thu hồi, hãy đăng nhập lại"}}`;

const OUT_BANG = `$ docker exec chiase-pg psql -U chiase -c "SELECT left(family_id::text,8) AS ho, left(token_hash,10) AS token_hash, created_at::time(0) AS tao_luc, revoked_at::time(0) AS thu_hoi_luc FROM refresh_tokens WHERE family_id = '8708d184-4232-4a20-994a-c53146afd263' ORDER BY created_at"
    ho    | token_hash | tao_luc  | thu_hoi_luc 
----------+------------+----------+-------------
 8708d184 | c86c9d532b | 12:30:49 | 12:30:49
 8708d184 | 7c168fc802 | 12:30:49 | 12:30:49
 8708d184 | cb23c40fcf | 12:30:49 | 12:30:49
(3 rows)

$ docker exec chiase-pg psql -U chiase -c "SELECT count(*) AS so_dong, count(DISTINCT family_id) AS so_ho FROM refresh_tokens"
 so_dong | so_ho 
---------+-------
      20 |    18
(1 row)`;

const MA_DUA = `// 20 lần: hai tab refresh cùng lúc, rồi tab thắng thử refresh tiếp bằng cookie MỚI của nó
const U = 'http://localhost:41815/api/auth';
const dem = { 'thắng vẫn dùng tiếp được': 0, 'thắng bị đăng xuất luôn': 0 };
for (let i = 0; i &lt; 20; i++) {
  const l = await fetch(\`\${U}/login\`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: 'chi@mail.com', password: 'mat-khau-cua-chi' }) });
  const cookie = l.headers.get('set-cookie').split(';')[0];
  const [a, b] = await Promise.all([1, 2].map(() =&gt; fetch(\`\${U}/refresh\`, { method: 'POST', headers: { cookie } })));
  const thang = [a, b].find((r) =&gt; r.status === 200);
  const tiep = await fetch(\`\${U}/refresh\`, { method: 'POST', headers: { cookie: thang.headers.get('set-cookie').split(';')[0] } });
  dem[tiep.status === 200 ? 'thắng vẫn dùng tiếp được' : 'thắng bị đăng xuất luôn']++;
}
console.log(dem);`;

const OUT_DUA = `$ node dua2.mjs
{ 'thắng vẫn dùng tiếp được': 19, 'thắng bị đăng xuất luôn': 1 }`;

const OUT_DON = `$ docker exec chiase-pg psql -U chiase -c "DELETE FROM refresh_tokens WHERE expires_at &lt; now() OR revoked_at &lt; now() - interval '7 days'"
DELETE 0
$ docker exec chiase-pg psql -U chiase -c "SELECT count(*) FILTER (WHERE revoked_at IS NULL) AS con_song, count(*) FILTER (WHERE revoked_at IS NOT NULL) AS da_thu_hoi FROM refresh_tokens"
 con_song | da_thu_hoi 
----------+------------
       23 |          6
(1 row)`;

const THE = [
  lienKet({ khoa: 'authentication', bai: 'auth-4-1-giai-ma-bang-tay', title: 'Authentication 4.1 — Tự tay giải mã một JWT', sub: 'Header, payload, chữ ký — từng byte.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'authentication', bai: 'auth-4-3-cac-claim', title: 'Authentication 4.3 — Bảy claim, và cú tấn công cho mỗi cái bạn bỏ qua', sub: 'exp, iss, aud, sub… vì sao phải kiểm từng cái.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'authentication', bai: 'auth-5-2-xoay-vong', title: 'Authentication 5.2 — Xoay vòng, và cú tái dùng tố giác kẻ cắp', sub: 'Họ token và phát hiện dùng lại, chuyên sâu.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'authentication', bai: 'auth-5-5-cuoc-dua-refresh', title: 'Authentication 5.5 — Cuộc đua refresh, và cú cảnh báo giả', sub: 'Đúng cái lỗi 1/20 lần bài này đo được, và các cách xử lý.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'authentication', bai: 'auth-2-3-luong-dang-nhap', title: 'Authentication 2.3 — Luồng đăng nhập, với mọi nhánh bằng nhau', sub: 'Mã băm giả và thời gian bằng nhau.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nodejs', bai: 'nodejs-8-2-jwt-access-refresh', title: 'Node.js 8.2 — JWT, refresh token và xoay vòng', sub: 'Bài khái niệm gốc mà bài này RÁP vào dự án.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📘', 'RFC 9700 — OAuth 2.0 Security Best Current Practice (01/2025)', '§2.2.2: refresh token của client công khai PHẢI ràng buộc người gửi hoặc xoay vòng; §4.14.2: token đã vô hiệu xuất hiện lại ⇒ thu hồi token đang sống.', 'https://datatracker.ietf.org/doc/html/rfc9700'),
  nguon('📰', 'Cloudflare — How Cloudflare mitigated yet another Okta compromise (2023)', 'Ngày 18/10/2023 Cloudflare phát hiện tấn công dùng token xác thực bị lộ từ hệ thống hỗ trợ của Okta; Okta được báo từ 02/10/2023.', 'https://blog.cloudflare.com/how-cloudflare-mitigated-yet-another-okta-compromise/'),
  nguon('📘', 'jose (panva) — jwtVerify', 'algorithms, issuer, audience; lỗi JWTExpired.', 'https://github.com/panva/jose/blob/main/docs/jwt/verify/functions/jwtVerify.md'),
  nguon('📘', 'MDN — Set-Cookie', 'HttpOnly, Secure, SameSite, Path, Max-Age.', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie'),
].join('\n');

const MERMAID = `sequenceDiagram
  participant B as Trình duyệt
  participant A as API ChiaSe
  participant D as PostgreSQL
  B->>A: POST /auth/login (email, mật khẩu)
  A->>D: tìm user, argon2 verify
  A->>D: INSERT refresh_tokens (băm của R1, họ F)
  A-->>B: 200 accessToken (15 phút) + Set-Cookie rt=R1
  Note over B: 15 phút sau access token hết hạn
  B->>A: POST /auth/refresh (cookie R1)
  A->>D: R1 chưa dùng? đánh dấu đã dùng
  A->>D: INSERT R2 (cùng họ F)
  A-->>B: 200 accessToken mới + Set-Cookie rt=R2
  Note over B,A: Ai đó gửi lại R1
  A->>D: R1 đã dùng ⇒ thu hồi CẢ họ F
  A-->>B: 401 REFRESH_DUNG_LAI`;

export default {
  title: '3.2 — Login, JWT and refresh token rotation|||3.2 — Đăng nhập, JWT và xoay vòng refresh token',
  slug: 'fp-3-2-dang-nhap-jwt',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Hai token vì sao: access JWT 15 phút không lưu ở server, refresh token ngẫu nhiên lưu MÃ BĂM trong bảng refresh_tokens; đăng nhập với mã băm giả (đo: không có thì lộ email tồn tại qua 4,8 ms vs 39,8 ms); cookie HttpOnly/Secure/SameSite/Path; xoay vòng mỗi lần refresh và thu hồi cả họ khi token cũ bị dùng lại (RFC 9700); cuộc đua hai tab (đo: 1/20 lần bị đăng xuất); dọn bảng — kèm vụ Okta 2023.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Login</span>
<h2>Two tokens, one rotating: login that survives a stolen cookie</h2>
<p class="lead">After this lesson a ChiaSe user can log in and stay logged in for 30 days without typing the password again (story U2 from Chapter 1). That convenience is exactly what attackers want to steal, so we build it carefully: a short-lived access token the server does not store, a long-lived refresh token the server <em>does</em> store (hashed), and rotation that turns a stolen refresh token into an alarm. We measure two real problems along the way: a timing leak in login, and a race between two browser tabs that logs the user out about once in twenty.</p>

<pre><code class="language-mermaid">${MERMAID}</code></pre>

<h3>1. Why two tokens</h3>
<table>
<tr><th></th><th>Access token</th><th>Refresh token</th></tr>
<tr><td>Form</td><td>JWT signed with HS256</td><td>32 random bytes (not a JWT)</td></tr>
<tr><td>Lifetime</td><td>15 minutes</td><td>30 days, replaced at every use</td></tr>
<tr><td>Server stores</td><td>nothing — checks the signature</td><td>SHA-256 of it, in <code>refresh_tokens</code></td></tr>
<tr><td>Sent</td><td>header <code>Authorization: Bearer …</code> to every API</td><td>httpOnly cookie, only to <code>/api/auth/*</code></td></tr>
<tr><td>Revocable before expiry?</td><td>no</td><td>yes — one UPDATE</td></tr>
</table>
<p>One token cannot do both jobs. If it is checked without the database (fast, every request), it cannot be revoked; if it is checked in the database, every request pays a query. So: a cheap token that dies quickly, and an expensive one that lives long but is checked only when the cheap one needs renewing.</p>

<h3>2. Secrets and the token module</h3>
<pre><code class="language-ts">${MA_CONFIG}</code></pre>
<p>An HS256 key shorter than 32 bytes can be brute-forced offline from a single leaked token. Each environment gets its own key, generated with <code>node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"</code>; <code>.env.example</code> only names the variable.</p>
<pre><code class="language-ts">${MA_TOKENS}</code></pre>
<p>Three details carry the security. <code>algorithms: ['HS256']</code> is fixed — never trust the <code>alg</code> a token declares about itself (lesson 3.3 sends a token with <code>"alg":"none"</code>). <code>issuer</code> and <code>audience</code> are checked so a token minted for another app with the same key is refused. And the refresh token is hashed with plain SHA-256: lesson 3.1 said fast hashes are wrong for passwords, but a 256-bit random value cannot be guessed, so speed does not help an attacker.</p>

<h3>3. The <code>refresh_tokens</code> table</h3>
<pre><code class="language-prisma">${MA_MODEL}</code></pre>
<div class="out">${OUT_MIGRATE}</div>
<pre><code class="language-sql">${MA_MIGRATION}</code></pre>
<p>Remember Chapter 2: Prisma 7 <code>migrate dev</code> does not regenerate the client — run <code>npx prisma generate</code> (or <code>npm install</code>, which triggers <code>postinstall</code>) before using <code>prisma.refreshToken</code>.</p>

<h3>4. Login — and the timing leak</h3>
<pre><code class="language-ts">${MA_SVC_DANGNHAP}</code></pre>
<p>"Email or password is incorrect" for both failures is the obvious part. The less obvious part: if the email does not exist and we return immediately, the answer is <em>faster</em>. We removed the dummy hash on purpose and measured:</p>
<div class="out">${OUT_GIO_KHONG}</div>
<div class="out">${OUT_GIO_CO}</div>
<p>Without the dummy hash: 4.8 ms vs 39.8 ms — a stopwatch tells an attacker which emails have accounts, eight times over. With it: 39.2 vs 41.6 ms, within noise. <code>canBamLai</code> re-hashes a password stored with older parameters on successful login — the painless migration path mentioned in 3.1.</p>

<h3>5. The controller and the cookie</h3>
<pre><code class="language-ts">${MA_CONTROLLER}</code></pre>
<div class="out">${OUT_LOGIN}</div>
<p>Read the <code>Set-Cookie</code> line attribute by attribute. <strong>HttpOnly</strong>: page JavaScript — including injected XSS code — cannot read it. <strong>Secure</strong>: only over HTTPS; browsers and curl treat <code>http://localhost</code> as secure, so it works in development without a flag. <strong>SameSite=Strict</strong>: not sent on requests started by other sites. <strong>Path=/api/auth</strong>: not attached to every API call, only to refresh/logout. The refresh token is <em>not</em> in the body; the access token is, and Chapter 6 keeps it in memory only.</p>
<div class="out">${OUT_JWT}</div>
<p>The JWT payload is just base64 — anyone holding the token can read it. Never put anything secret in it. Ours carries only the user id (<code>sub</code>), issuer, audience and times.</p>

<h3>6. Rotation and reuse detection</h3>
<pre><code class="language-ts">${MA_SVC_LAMMOI}</code></pre>
<p>Now play both parts: the real user and a thief who copied the cookie file.</p>
<div class="out">${OUT_XOAY}</div>
<div class="out">${OUT_BANG}</div>
<p>Each refresh returned a <em>different</em> cookie; the thief's old one was refused and — the important part — the real user's newest token died too. The server cannot know which of the two is the thief, so it ends the whole family and both must log in again (RFC 9700 §4.14.2). The log line says how many live tokens were killed. For a single-page app, RFC 9700 §2.2.2 says refresh tokens <em>must</em> be either sender-constrained or rotated; we rotate.</p>

<div class="pitfall co-tieu-de"><p><strong>Trap — two tabs refreshing at the same moment.</strong> Open ChiaSe in two tabs, wait 15 minutes, and both tabs find an expired access token at the same time. Both send the same cookie.</p></div>
<pre><code class="language-js">${MA_DUA}</code></pre>
<div class="out">${OUT_DUA}</div>
<p>19 times out of 20 it is harmless: both requests read the token as unused, the conditional <code>updateMany(… revokedAt: null)</code> lets only one win, the other gets 401 and the winner carries on. Once in 20, the losing request arrives <em>after</em> the winner has marked the token used — it looks exactly like a thief, so the whole family is revoked, including the cookie the winner just received. The user is logged out "randomly". This is the worst kind of bug: rare, unreproducible on demand, and blamed on the user's network. Two fixes exist: the server tolerates reuse for a few seconds (some identity providers call this a reuse interval), or the frontend never sends two refreshes at once. ChiaSe does the second in Chapter 6 (one shared refresh promise); the server stays strict.</p>

<h3>7. The table grows</h3>
<p>Every login creates a family; every refresh adds a row. Our 15 timing logins alone left 15 families behind. Clean up on a schedule (Chapter 11 runs it daily):</p>
<div class="out">${OUT_DON}</div>
<p><code>DELETE 0</code> today because nothing is older than 7 days yet — the query is still worth writing now, while the table is small enough to reason about.</p>

<h3>🕵️ Hacker's corner — Okta, October 2023</h3>
<p>On 18 October 2023 Cloudflare detected attackers using an authentication token taken from Okta's customer-support system, where customers had uploaded files for troubleshooting; Okta had first been notified on 2 October. No password was cracked — a <em>token</em> was simply copied and replayed. That is the threat model of this lesson: assume a token leaks (a log, a support upload, a malware-infected laptop). Short access tokens limit the window; rotation makes a copied refresh token detectable; revocation lets you end it.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">login</span><span class="lz-d">argon2 verify (dummy hash if no user) ⇒ new family F</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">response</span><span class="lz-d">access JWT in body · refresh R1 in httpOnly cookie, hash in DB</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">refresh</span><span class="lz-d">R1 unused? mark used (conditional) ⇒ issue R2 in family F</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">reuse</span><span class="lz-d">R1 seen again ⇒ revoke every live token of F ⇒ 401</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">logout</span><span class="lz-d">revoke family, clear cookie; access JWT lives until exp</span></div>
</div>

<h3>In everyday life</h3>
<p>The access token is a day ticket at a theme park: the gate checks the stamp, not a database, and it is useless tomorrow. The refresh token is your membership card at the front desk: they look you up, take the old card, print a new one. If someone shows up with the old card, the desk cancels your membership and calls you in to verify.</p>

<h3>On a real job</h3>
<p>"Users get logged out randomly" is a classic OJT ticket, and the race above is one of its usual causes; now you know to check refresh concurrency before blaming cookies. Another: a tester reports "after logout, the API still works with the old token" — correct and expected for up to 15 minutes; lesson 3.3 measures it and explains the trade-off you write in the ticket.</p>

${spring(true, 'In Spring Boot you sign and verify JWTs with <code>spring-security-oauth2-jose</code> (<code>JwtEncoder</code>/<code>JwtDecoder</code>), and refresh tokens are a JPA entity with the same columns (hash, family, expiry, revoked). Rotation, reuse detection and the two-tab race are identical problems.', [
  ['sb-9-3-dang-nhap-jwt', 'Spring Boot 9.3 — Login and issuing JWTs'],
  ['sb-9-5-refresh-token', 'Spring Boot 9.5 — Refresh tokens and logout'],
])}

<h3>🎤 What the interviewer will ask</h3>
<ol>
<li><strong>"Why not one long-lived JWT?"</strong> — It cannot be revoked; a leak lasts until expiry. Short access + revocable refresh is the compromise.</li>
<li><strong>"Where do you store the refresh token, server and client side?"</strong> — Server: only its hash, with expiry and family. Client: httpOnly, Secure, SameSite cookie scoped to the auth path.</li>
<li><strong>"What is refresh token rotation and reuse detection?"</strong> — Each use returns a new token and invalidates the old; an old one presented again means a copy exists, so revoke the family.</li>
<li><strong>"How can login leak which emails exist?"</strong> — Different messages, or different timing; fix with one message and a dummy hash.</li>
<li><strong>"What goes in a JWT payload?"</strong> — Identifiers and claims only; it is readable by anyone. Verify algorithm, signature, exp, iss, aud.</li>
</ol>

<h3>🧪 Lab 3.2 (90 minutes)</h3>
<div class="callout ok">
<ol>
<li>Add <code>JWT_ACCESS_SECRET</code> to <code>.env</code> (generated) and the empty variable to <code>.env.example</code>; make <code>config.ts</code> refuse keys under 32 bytes.</li>
<li>Add the <code>RefreshToken</code> model, migrate, generate.</li>
<li>Write <code>lib/tokens.ts</code>, <code>dangNhap</code>, the controller and routes; log in with curl and read every <code>Set-Cookie</code> attribute aloud.</li>
<li>Measure login for an existing email with a wrong password vs a non-existent email, with and without the dummy hash (<code>do-gio.mjs</code> or 15 curl calls). Keep the dummy hash.</li>
<li>Write <code>lamMoi</code> and <code>dangXuat</code>; reproduce the thief scenario and the <code>psql</code> view of the family.</li>
<li>Run <code>dua2.mjs</code>. Write down your own ratio — you will need it in Chapter 6.</li>
</ol>
<p><strong>Done when:</strong> timing difference with the dummy hash is under 5 ms, reusing an old refresh token kills the newest one too, and the cookie has all four attributes.</p>
<p><strong>Scoring (10):</strong> secret handling (1) · model + migration (1) · fixed algorithm + iss + aud (2) · dummy hash measured (2) · cookie attributes (1) · rotation with conditional update (2) · race measured and explained (1).</p>
</div>
<details><summary>Solution</summary>
<p>Tag <code>ch3</code>: <code>apps/api/src/lib/tokens.ts</code>, <code>services/auth.service.ts</code>, <code>controllers/auth.controller.ts</code>, migration <code>…_refresh_tokens</code>. Common mistakes: <code>clearCookie</code> without the same <code>path</code> does not delete the cookie (the browser keeps sending it); forgetting <code>cookieParser()</code> makes <code>req.cookies</code> undefined so every refresh says "Chưa đăng nhập"; checking <code>revokedAt</code> and then doing an unconditional update lets <em>both</em> racing requests win and creates two live tokens in one family.</p>
</details>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">access token</span><span class="v">Short-lived proof of identity sent with every API call.</span></div>
  <div class="kv"><span class="k">refresh token</span><span class="v">Long-lived credential used only to obtain new access tokens.</span></div>
  <div class="kv"><span class="k">JWT</span><span class="v">JSON Web Token: header.payload.signature, base64url; readable, tamper-evident.</span></div>
  <div class="kv"><span class="k">rotation</span><span class="v">Replacing the refresh token at every use.</span></div>
  <div class="kv"><span class="k">token family</span><span class="v">All refresh tokens descending from one login.</span></div>
  <div class="kv"><span class="k">httpOnly cookie</span><span class="v">Cookie that page JavaScript cannot read.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Access JWT 15 minutes, unstored; refresh token random, stored hashed, revocable.</li>
<li>Fix the algorithm; check issuer and audience; keys ≥ 32 bytes per environment.</li>
<li>Dummy hash for unknown emails: 4.8 ms vs 39.8 ms without it.</li>
<li>Rotation + reuse detection revokes the whole family (RFC 9700).</li>
<li>Two tabs refreshing at once logged the user out 1 time in 20 — fixed in Chapter 6.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Đăng nhập</span>
<h2>Hai token, một cái xoay vòng: đăng nhập chịu được cả khi cookie bị trộm</h2>
<p class="lead">Xong bài này, người dùng ChiaSe đăng nhập được và giữ đăng nhập 30 ngày mà không phải gõ lại mật khẩu (story U2 ở Chương 1). Sự tiện lợi đó lại đúng là thứ kẻ tấn công muốn lấy, nên ta dựng nó cẩn thận: một access token sống ngắn mà server không lưu, một refresh token sống dài mà server <em>có</em> lưu (dạng băm), và cơ chế xoay vòng biến một refresh token bị trộm thành một tiếng chuông báo động. Trên đường đi ta đo hai vấn đề thật: một chỗ rò thời gian ở đăng nhập, và một cuộc đua giữa hai tab trình duyệt làm người dùng bị đăng xuất khoảng một lần trong hai mươi.</p>

<pre><code class="language-mermaid">${MERMAID}</code></pre>

<h3>1. Vì sao cần hai token</h3>
<table>
<tr><th></th><th>Access token</th><th>Refresh token</th></tr>
<tr><td>Dạng</td><td>JWT ký HS256</td><td>32 byte ngẫu nhiên (không phải JWT)</td></tr>
<tr><td>Thời hạn</td><td>15 phút</td><td>30 ngày, thay mới mỗi lần dùng</td></tr>
<tr><td>Server lưu</td><td>không gì cả — chỉ kiểm chữ ký</td><td>SHA-256 của nó, trong <code>refresh_tokens</code></td></tr>
<tr><td>Gửi kèm</td><td>header <code>Authorization: Bearer …</code> tới mọi API</td><td>cookie httpOnly, chỉ tới <code>/api/auth/*</code></td></tr>
<tr><td>Thu hồi trước hạn được không?</td><td>không</td><td>được — một lệnh UPDATE</td></tr>
</table>
<p>Một token không làm nổi cả hai việc. Nếu kiểm mà không cần CSDL (nhanh, mọi request) thì không thu hồi được; nếu kiểm bằng CSDL thì mọi request đều trả giá một truy vấn. Vậy nên: một token rẻ mà chết nhanh, và một token đắt sống lâu nhưng chỉ bị kiểm khi token rẻ cần làm mới.</p>

<h3>2. Bí mật và module token</h3>
<pre><code class="language-ts">${MA_CONFIG}</code></pre>
<p>Khoá HS256 ngắn hơn 32 byte có thể bị dò ngược bằng máy, ngoại tuyến, chỉ từ một token bị lộ. Mỗi môi trường một khoá riêng, sinh bằng <code>node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"</code>; <code>.env.example</code> chỉ ghi tên biến.</p>
<pre><code class="language-ts">${MA_TOKENS}</code></pre>
<p>Ba chi tiết gánh phần bảo mật. <code>algorithms: ['HS256']</code> cố định — không bao giờ tin <code>alg</code> mà token tự khai (bài 3.3 gửi một token <code>"alg":"none"</code>). <code>issuer</code> và <code>audience</code> được kiểm để token làm cho ứng dụng khác cùng khoá bị từ chối. Và refresh token băm bằng SHA-256 thường: bài 3.1 nói băm nhanh là sai cho mật khẩu, nhưng một giá trị ngẫu nhiên 256 bit thì không đoán nổi, nên tốc độ chẳng giúp gì kẻ tấn công.</p>

<h3>3. Bảng <code>refresh_tokens</code></h3>
<pre><code class="language-prisma">${MA_MODEL}</code></pre>
<div class="out">${OUT_MIGRATE}</div>
<pre><code class="language-sql">${MA_MIGRATION}</code></pre>
<p>Nhớ Chương 2: <code>migrate dev</code> của Prisma 7 không sinh lại client — chạy <code>npx prisma generate</code> (hoặc <code>npm install</code>, nó gọi <code>postinstall</code>) trước khi dùng <code>prisma.refreshToken</code>.</p>

<h3>4. Đăng nhập — và chỗ rò thời gian</h3>
<pre><code class="language-ts">${MA_SVC_DANGNHAP}</code></pre>
<p>Cùng một câu "Email hoặc mật khẩu không đúng" cho cả hai kiểu thất bại là phần dễ thấy. Phần khó thấy: nếu email không tồn tại mà ta trả lời ngay, câu trả lời <em>nhanh hơn</em>. Ta cố ý bỏ mã băm giả rồi đo:</p>
<div class="out">${OUT_GIO_KHONG}</div>
<div class="out">${OUT_GIO_CO}</div>
<p>Không có mã băm giả: 4,8 ms so với 39,8 ms — chỉ một cái đồng hồ bấm giờ là kẻ tấn công biết email nào có tài khoản, chênh tám lần. Có mã băm giả: 39,2 so với 41,6 ms, nằm trong nhiễu. <code>canBamLai</code> băm lại mật khẩu đã lưu bằng tham số cũ khi đăng nhập thành công — con đường chuyển đổi không đau đã nhắc ở bài 3.1.</p>

<h3>5. Controller và cookie</h3>
<pre><code class="language-ts">${MA_CONTROLLER}</code></pre>
<div class="out">${OUT_LOGIN}</div>
<p>Đọc dòng <code>Set-Cookie</code> từng thuộc tính một. <strong>HttpOnly</strong>: JavaScript của trang — kể cả mã XSS bị chèn vào — không đọc được. <strong>Secure</strong>: chỉ đi qua HTTPS; trình duyệt và curl coi <code>http://localhost</code> là an toàn nên khi dev vẫn chạy mà không cần cờ nào. <strong>SameSite=Strict</strong>: không gửi kèm request do trang khác khởi phát. <strong>Path=/api/auth</strong>: không dính vào mọi lời gọi API, chỉ đi tới refresh/logout. Refresh token <em>không</em> nằm trong body; access token thì có, và Chương 6 chỉ giữ nó trong bộ nhớ.</p>
<div class="out">${OUT_JWT}</div>
<p>Payload của JWT chỉ là base64 — ai cầm token cũng đọc được. Đừng bao giờ đặt thứ bí mật vào đó. Của ta chỉ mang id người dùng (<code>sub</code>), bên phát, bên nhận và thời gian.</p>

<h3>6. Xoay vòng và phát hiện dùng lại</h3>
<pre><code class="language-ts">${MA_SVC_LAMMOI}</code></pre>
<p>Giờ đóng cả hai vai: người dùng thật và kẻ trộm đã chép được tệp cookie.</p>
<div class="out">${OUT_XOAY}</div>
<div class="out">${OUT_BANG}</div>
<p>Mỗi lần refresh trả về một cookie <em>khác</em>; cookie cũ của kẻ trộm bị từ chối và — đây mới là phần quan trọng — token mới nhất của người dùng thật cũng chết theo. Server không biết ai trong hai người là kẻ trộm, nên nó kết thúc cả họ và cả hai phải đăng nhập lại (RFC 9700 §4.14.2). Dòng log ghi có bao nhiêu token đang sống bị giết. Với ứng dụng một trang, RFC 9700 §2.2.2 nói refresh token <em>phải</em> hoặc ràng buộc với người gửi, hoặc xoay vòng; ta xoay vòng.</p>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — hai tab refresh cùng một lúc.</strong> Mở ChiaSe ở hai tab, đợi 15 phút, và cả hai tab cùng lúc thấy access token hết hạn. Cả hai gửi cùng một cookie.</p></div>
<pre><code class="language-js">${MA_DUA}</code></pre>
<div class="out">${OUT_DUA}</div>
<p>19 trên 20 lần thì vô hại: cả hai request đọc thấy token chưa dùng, lệnh <code>updateMany(… revokedAt: null)</code> có điều kiện chỉ cho một cái thắng, cái kia nhận 401 và cái thắng đi tiếp. Một lần trong 20, request thua tới <em>sau</em> khi cái thắng đã đánh dấu token là đã dùng — trông nó y hệt kẻ trộm, nên cả họ bị thu hồi, kể cả cookie mà cái thắng vừa nhận. Người dùng bị đăng xuất "ngẫu nhiên". Đây là loại lỗi tệ nhất: hiếm, không tái hiện theo ý muốn, và hay bị đổ cho mạng của người dùng. Có hai cách sửa: server chấp nhận dùng lại trong vài giây (vài nhà cung cấp định danh gọi là khoảng dung sai dùng lại), hoặc frontend không bao giờ gửi hai lần refresh cùng lúc. ChiaSe làm cách thứ hai ở Chương 6 (một promise refresh dùng chung); server vẫn giữ nghiêm.</p>

<h3>7. Bảng phình ra</h3>
<p>Mỗi lần đăng nhập tạo một họ; mỗi lần refresh thêm một dòng. Riêng 15 lần đo thời gian đăng nhập đã để lại 15 họ. Dọn theo lịch (Chương 11 chạy hằng ngày):</p>
<div class="out">${OUT_DON}</div>
<p>Hôm nay <code>DELETE 0</code> vì chưa có gì quá 7 ngày — nhưng vẫn nên viết truy vấn ngay bây giờ, khi bảng còn đủ nhỏ để dễ suy nghĩ.</p>

<h3>🕵️ Góc hacker — Okta, tháng 10/2023</h3>
<p>Ngày 18/10/2023, Cloudflare phát hiện kẻ tấn công dùng một token xác thực lấy từ hệ thống hỗ trợ khách hàng của Okta, nơi khách hàng tải tệp lên để nhờ xử lý sự cố; Okta đã được báo từ 02/10. Không mật khẩu nào bị bẻ — chỉ một <em>token</em> bị chép rồi dùng lại. Đó chính là mô hình mối đe doạ của bài này: cứ coi như token sẽ có lúc bị lộ (một dòng log, một tệp gửi hỗ trợ, một máy tính dính mã độc). Access token ngắn thu hẹp khoảng thời gian; xoay vòng làm refresh token bị chép trở nên phát hiện được; thu hồi cho phép bạn chấm dứt nó.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">đăng nhập</span><span class="lz-d">argon2 verify (mã băm giả nếu không có user) ⇒ họ mới F</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">trả về</span><span class="lz-d">access JWT trong body · refresh R1 trong cookie httpOnly, băm trong CSDL</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">refresh</span><span class="lz-d">R1 chưa dùng? đánh dấu đã dùng (có điều kiện) ⇒ phát R2 cùng họ F</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">dùng lại</span><span class="lz-d">R1 xuất hiện lại ⇒ thu hồi mọi token sống của F ⇒ 401</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">đăng xuất</span><span class="lz-d">thu hồi họ, xoá cookie; access JWT sống tới exp</span></div>
</div>

<h3>Liên hệ đời thường</h3>
<p>Access token là vé ngày ở công viên giải trí: cổng chỉ nhìn con dấu, không tra sổ, và hôm sau là vô dụng. Refresh token là thẻ hội viên ở quầy lễ tân: họ tra sổ, thu thẻ cũ, in thẻ mới. Nếu có người cầm thẻ cũ tới, quầy huỷ tư cách hội viên của bạn và mời bạn tới xác minh.</p>

<h3>Đi làm thật</h3>
<p>"Người dùng bị đăng xuất ngẫu nhiên" là ticket OJT kinh điển, và cuộc đua ở trên là một nguyên nhân hay gặp; giờ bạn biết phải kiểm refresh đồng thời trước khi đổ cho cookie. Một ticket khác: tester báo "đăng xuất rồi mà API vẫn chạy với token cũ" — đúng và là hành vi dự kiến trong tối đa 15 phút; bài 3.3 đo điều này và giải thích sự đánh đổi để bạn ghi vào ticket.</p>

${spring(false, 'Ở Spring Boot, bạn ký và kiểm JWT bằng <code>spring-security-oauth2-jose</code> (<code>JwtEncoder</code>/<code>JwtDecoder</code>), còn refresh token là một entity JPA có cùng các cột (băm, họ, hạn, thời điểm thu hồi). Xoay vòng, phát hiện dùng lại và cuộc đua hai tab là y hệt các vấn đề ở đây.', [
  ['sb-9-3-dang-nhap-jwt', 'Spring Boot 9.3 — Đăng nhập và phát JWT'],
  ['sb-9-5-refresh-token', 'Spring Boot 9.5 — Refresh token và đăng xuất'],
])}

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>"Sao không dùng một JWT sống lâu?"</strong> — Nó không thu hồi được; lộ thì lộ tới khi hết hạn. Access ngắn + refresh thu hồi được là thế cân bằng.</li>
<li><strong>"Refresh token lưu ở đâu, phía server và phía client?"</strong> — Server: chỉ mã băm, kèm hạn và họ. Client: cookie httpOnly, Secure, SameSite, giới hạn đường dẫn xác thực.</li>
<li><strong>"Xoay vòng refresh token và phát hiện dùng lại là gì?"</strong> — Mỗi lần dùng trả token mới và vô hiệu token cũ; token cũ xuất hiện lại nghĩa là có bản sao, nên thu hồi cả họ.</li>
<li><strong>"Đăng nhập có thể làm lộ email nào tồn tại bằng cách nào?"</strong> — Câu báo khác nhau, hoặc thời gian khác nhau; sửa bằng một câu chung và mã băm giả.</li>
<li><strong>"Đặt gì vào payload JWT?"</strong> — Chỉ định danh và claim; ai cũng đọc được. Kiểm thuật toán, chữ ký, exp, iss, aud.</li>
</ol>

<h3>🧪 Lab 3.2 (90 phút)</h3>
<div class="callout ok">
<ol>
<li>Thêm <code>JWT_ACCESS_SECRET</code> vào <code>.env</code> (sinh ngẫu nhiên) và biến rỗng vào <code>.env.example</code>; cho <code>config.ts</code> từ chối khoá dưới 32 byte.</li>
<li>Thêm model <code>RefreshToken</code>, migrate, generate.</li>
<li>Viết <code>lib/tokens.ts</code>, <code>dangNhap</code>, controller và route; đăng nhập bằng curl và đọc to từng thuộc tính của <code>Set-Cookie</code>.</li>
<li>Đo đăng nhập với email có + sai mật khẩu so với email không tồn tại, có và không có mã băm giả (<code>do-gio.mjs</code> hoặc 15 lần curl). Giữ lại mã băm giả.</li>
<li>Viết <code>lamMoi</code> và <code>dangXuat</code>; tái hiện kịch bản kẻ trộm và góc nhìn <code>psql</code> của họ token.</li>
<li>Chạy <code>dua2.mjs</code>. Ghi lại tỉ lệ của chính bạn — Chương 6 sẽ cần.</li>
</ol>
<p><strong>Xong khi:</strong> chênh lệch thời gian khi có mã băm giả dưới 5 ms, dùng lại refresh token cũ giết luôn token mới nhất, và cookie có đủ bốn thuộc tính.</p>
<p><strong>Thang điểm (10):</strong> xử lý bí mật (1) · model + migration (1) · cố định thuật toán + iss + aud (2) · đo mã băm giả (2) · thuộc tính cookie (1) · xoay vòng với update có điều kiện (2) · đo và giải thích cuộc đua (1).</p>
</div>
<details><summary>Lời giải</summary>
<p>Tag <code>ch3</code>: <code>apps/api/src/lib/tokens.ts</code>, <code>services/auth.service.ts</code>, <code>controllers/auth.controller.ts</code>, migration <code>…_refresh_tokens</code>. Lỗi hay gặp: <code>clearCookie</code> không cùng <code>path</code> thì không xoá được cookie (trình duyệt cứ gửi mãi); quên <code>cookieParser()</code> thì <code>req.cookies</code> là undefined nên mọi lần refresh đều báo "Chưa đăng nhập"; kiểm <code>revokedAt</code> rồi update không điều kiện thì <em>cả hai</em> request đua đều thắng và một họ có hai token sống.</p>
</details>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">access token</span><span class="v">Bằng chứng danh tính sống ngắn, gửi kèm mọi lời gọi API.</span></div>
  <div class="kv"><span class="k">refresh token</span><span class="v">Thông tin xác thực sống dài, chỉ dùng để lấy access token mới.</span></div>
  <div class="kv"><span class="k">JWT</span><span class="v">JSON Web Token: header.payload.chữ-ký dạng base64url; đọc được, sửa là lộ.</span></div>
  <div class="kv"><span class="k">rotation</span><span class="v">Xoay vòng: thay refresh token mới ở mỗi lần dùng.</span></div>
  <div class="kv"><span class="k">token family</span><span class="v">Họ token: mọi refresh token sinh ra từ một lần đăng nhập.</span></div>
  <div class="kv"><span class="k">httpOnly cookie</span><span class="v">Cookie mà JavaScript của trang không đọc được.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Access JWT 15 phút, không lưu; refresh token ngẫu nhiên, lưu dạng băm, thu hồi được.</li>
<li>Cố định thuật toán; kiểm issuer và audience; khoá ≥ 32 byte, mỗi môi trường một khoá.</li>
<li>Mã băm giả cho email không tồn tại: không có nó thì 4,8 ms so với 39,8 ms.</li>
<li>Xoay vòng + phát hiện dùng lại thu hồi cả họ (RFC 9700).</li>
<li>Hai tab refresh cùng lúc làm người dùng bị đăng xuất 1 lần trong 20 — Chương 6 sửa.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
