/**
 * 8.3 — Test API bằng Supertest (soạn 24/11/2026, agent fsp).
 * Output THẬT trên máy nhà: Vitest 5.1.1, supertest 7.3.2, socket.io-client 4.8.4, Postgres 18 dùng một lần (bài 8.2).
 * Mã: nhánh ch8/test (chưa commit — tệp trong cây làm việc).
 * Phát hiện thật 24/11: lần chạy đầu 7 test đỏ — 6 vì hàm trợ giúp tạo email "bình-2@test.dev" (z.email() của Zod 4 chỉ nhận
 * phần trước @ là ASCII ⇒ 400; kể cả "an@bình.vn"), 1 vì test đoán /posts/abc ⇒ 400 trong khi thiết kế bài 4.1 là 404; log mỗi
 * request làm output 268 dòng, 98 khối stdout ⇒ silent: 'passed-only' (60 dòng, log vẫn hiện khi test đỏ); bỏ kiểm "chỉ chính
 * mình xem phiên" (kiểu "sửa" của Peloton) ⇒ mọi test 401 vẫn xanh, chỉ test 403 bắt được; Supertest + Socket.IO cần máy chủ
 * HTTP sống suốt tệp (listen(0)).
 * Nguồn (GET 200, 24/11/2026): Pen Test Partners — Jan Masters, "Tour de Peloton: Exposed user data" (05/05/2021);
 * supertest README; OWASP API Security Top 10 2023 (API1 BOLA, API2 Broken Authentication).
 */
import { lienKet, spring, nguon } from '../_chung.mjs';

const TRO_GIUP = `// Công cụ cho test API: tạo người dùng thật (mật khẩu băm thật) và đăng nhập qua ĐÚNG endpoint như trình duyệt.
import request from 'supertest';
import type { Express } from 'express';
import { prisma } from '../../src/db/prisma.js';
import { bamMatKhau } from '../../src/lib/password.js';

export const MAT_KHAU = 'mat-khau-test-du-15-ky-tu';
let maBam: Promise&lt;string&gt; | undefined; // băm MỘT lần cho cả tệp (argon2 ~40 ms/lần)

let dem = 0;
export async function taoTaiKhoan(ten: string) {
  // Bỏ dấu: z.email() của Zod 4 chỉ nhận phần trước @ là ASCII ⇒ "bình-2@test.dev" bị 400 (lần chạy đầu đỏ vì chính dòng này).
  const khongDau = ten.normalize('NFD').replace(/\\p{M}/gu, '').replace(/đ/gi, 'd').toLowerCase();
  const email = \`\${khongDau}-\${++dem}@test.dev\`;
  const u = await prisma.user.create({
    data: { email, displayName: ten, passwordHash: await (maBam ??= bamMatKhau(MAT_KHAU)) },
  });
  return { ...u, email };
}

// Đăng nhập thật ⇒ { id, token, cookie } — token cho header Authorization, cookie "rt=…" cho /auth/refresh.
export async function dangNhap(app: Express, ten: string) {
  const u = await taoTaiKhoan(ten);
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: u.email, password: MAT_KHAU })
    .expect(200);
  const cookie = [res.get('Set-Cookie')![0]!.split(';')[0]!];
  return { id: u.id, token: res.body.accessToken as string, cookie };
}

export const bearer = (t: string) =&gt; ({ Authorization: \`Bearer \${t}\` });`;

const AUTH_DAU = `import { beforeEach, describe, it, expect } from 'vitest';
import request from 'supertest';
import { taoApp } from '../../src/app.js';
import { donSach } from '../tich-hop/du-lieu.js';
import { dangNhap, taoTaiKhoan, MAT_KHAU, bearer } from './tro-giup.js';

// Supertest nhận thẳng app Express: tự mở cổng ngẫu nhiên cho từng request rồi đóng — không cần "npm run dev", không đụng 41810.
const app = taoApp();
beforeEach(donSach);`;

const AUTH_LOGIN = `describe('POST /api/auth/login', () =&gt; {
  it('đúng ⇒ access token trong body; refresh token CHỈ trong cookie httpOnly/Secure/SameSite=Strict/Path=/api/auth', async () =&gt; {
    const u = await taoTaiKhoan('An');
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: u.email, password: MAT_KHAU })
      .expect(200);
    expect(Object.keys(res.body).sort()).toEqual(['accessToken', 'user']);
    expect(JSON.stringify(res.body)).not.toMatch(/passwordHash|argon2|refresh/i);
    const cookie = res.get('Set-Cookie')![0]!;
    expect(cookie).toMatch(/^rt=[A-Za-z0-9_-]{43};/);
    for (const thuocTinh of ['HttpOnly', 'Secure', 'SameSite=Strict', 'Path=/api/auth'])
      expect(cookie).toContain(thuocTinh);
  });`;

const AUTH_VONG = `describe('vòng đời phiên: refresh xoay vòng, dùng lại bị thu hồi, đăng xuất', () =&gt; {
  it('refresh ⇒ cookie MỚI; gửi lại cookie CŨ ⇒ 401 REFRESH_DUNG_LAI + xoá cookie; cookie mới cũng chết theo họ', async () =&gt; {
    const { cookie: cu } = await dangNhap(app, 'An');
    const r1 = await request(app).post('/api/auth/refresh').set('Cookie', cu).expect(200);
    const moi = [r1.get('Set-Cookie')![0]!.split(';')[0]!];
    expect(moi).not.toEqual(cu);
    expect(r1.body.accessToken).toEqual(expect.any(String));

    const r2 = await request(app).post('/api/auth/refresh').set('Cookie', cu).expect(401);
    expect(r2.body.error.code).toBe('REFRESH_DUNG_LAI');
    expect(r2.get('Set-Cookie')![0]).toMatch(/^rt=;.*Expires=Thu, 01 Jan 1970/);

    await request(app).post('/api/auth/refresh').set('Cookie', moi).expect(401);
  });

  it('đăng xuất ⇒ 204; refresh sau đó ⇒ 401. Access token đang cầm VẪN dùng được tới khi hết hạn (đã biết, bài 3.3)', async () =&gt; {
    const { token, cookie } = await dangNhap(app, 'An');
    await request(app).post('/api/auth/logout').set('Cookie', cookie).expect(204);
    await request(app).post('/api/auth/refresh').set('Cookie', cookie).expect(401);
    await request(app).get('/api/me').set(bearer(token)).expect(200);
  });
});`;

const BAO_VE_BANG = `const ID = '00000000-0000-4000-8000-000000000001';
// MỌI route cần đăng nhập. Thêm route mới mà quên requireAuth ⇒ thêm vào đây là đỏ ngay (checkpoint-3 làm việc này bằng tay).
const CAN_DANG_NHAP = [
  ['get', '/api/me'],
  ['get', \`/api/users/\${ID}/sessions\`],
  ['post', '/api/posts'],
  ['patch', \`/api/posts/\${ID}\`],
  ['delete', \`/api/posts/\${ID}\`],
  ['post', '/api/uploads'],
  ['post', \`/api/posts/\${ID}/comments\`],
  ['delete', \`/api/comments/\${ID}\`],
  ['put', \`/api/posts/\${ID}/like\`],
  ['delete', \`/api/posts/\${ID}/like\`],
] as const;

describe('xác thực', () =&gt; {
  it.each(CAN_DANG_NHAP)('%s %s không token ⇒ 401 CHUA_DANG_NHAP + WWW-Authenticate', async (m, url) =&gt; {
    const res = await request(app)[m](url).send({}).expect(401);
    expect(res.body.error.code).toBe('CHUA_DANG_NHAP');
    expect(res.get('WWW-Authenticate')).toBe('Bearer');
  });

  it('token rác ⇒ 401 TOKEN_KHONG_HOP_LE', async () =&gt; {
    const res = await request(app).get('/api/me').set(bearer('abc.def.ghi')).expect(401);
    expect(res.body.error.code).toBe('TOKEN_KHONG_HOP_LE');
  });

  it('đường dẫn không tồn tại ⇒ 404, KHÔNG phải 401 (lỗi apiRouter.use(requireAuth) ở bài 3.3)', async () =&gt; {
    await request(app).get('/api/khong-co-dau').expect(404);
    await request(app).delete('/api/khong-co-dau').expect(404);
  });
});`;

const BAO_VE_IDOR = `describe('phân quyền bài viết (IDOR)', () =&gt; {
  it('Bình sửa/xoá bài của An ⇒ 403, bài KHÔNG đổi trong CSDL', async () =&gt; {
    const an = await dangNhap(app, 'An');
    const binh = await dangNhap(app, 'Bình');
    const bai = await request(app)
      .post('/api/posts')
      .set(bearer(an.token))
      .send({ title: 'Của An', body: 'x', status: 'published' })
      .expect(201);
    await request(app)
      .patch(\`/api/posts/\${bai.body.id}\`)
      .set(bearer(binh.token))
      .send({ title: 'Bị sửa' })
      .expect(403);
    await request(app).delete(\`/api/posts/\${bai.body.id}\`).set(bearer(binh.token)).expect(403);
    expect(await prisma.post.findUnique({ where: { id: bai.body.id } })).toMatchObject({ title: 'Của An' });
  });`;

const BAO_VE_500 = `describe('lỗi máy chủ', () =&gt; {
  it('CSDL ném lỗi lạ ⇒ 500 LOI_MAY_CHU, client KHÔNG thấy chi tiết; log có requestId để tra', async () =&gt; {
    const log = vi.spyOn(console, 'error').mockImplementation(() =&gt; {});
    vi.spyOn(prisma.post, 'findMany').mockRejectedValueOnce(
      new Error('password authentication failed for user "chiase"'),
    );
    const res = await request(app).get('/api/posts').expect(500);
    expect(res.body).toEqual({
      error: { code: 'LOI_MAY_CHU', message: 'Có lỗi phía máy chủ', requestId: expect.any(String) },
    });
    expect(JSON.stringify(res.body)).not.toContain('password');
    expect(log.mock.calls[0]![0]).toContain(res.body.error.requestId);
  });
});`;

const GIOI_HAN = `import { describe, it, expect, vi } from 'vitest';
// Bộ giới hạn đọc AUTH_RATE_LIMIT LÚC IMPORT. import bị kéo lên đầu tệp ⇒ đặt biến bằng vi.hoisted (chạy TRƯỚC mọi import).
// Môi trường test chung đặt 1000 để các tệp khác đăng nhập thoải mái; riêng tệp này đặt 3 để chạm trần nhanh.
vi.hoisted(() =&gt; {
  process.env.AUTH_RATE_LIMIT = '3';
});
import request from 'supertest';
import { taoApp } from '../../src/app.js';

describe('giới hạn thử đăng nhập', () =&gt; {
  it('lần thứ 4 trong 15 phút ⇒ 429 QUA_NHIEU_LAN, có header RateLimit cho client biết khi nào thử lại', async () =&gt; {
    const app = taoApp();
    const thu = () =&gt; request(app).post('/api/auth/login').send({ email: 'x@test.dev', password: 'sai' });
    for (let i = 0; i &lt; 3; i++) expect((await thu()).status).toBe(401);
    const res = await thu();
    expect(res.status).toBe(429);
    expect(res.body.error.code).toBe('QUA_NHIEU_LAN');
    expect(res.get('RateLimit')).toMatch(/r=0/);
  });
});`;

const RT_DAU = `
// Socket cần MỘT máy chủ HTTP sống suốt tệp (Supertest tự mở/đóng mỗi request thì socket không bám vào được):
// mở cổng 0 (hệ điều hành chọn cổng trống), gắn realtime y như server.ts, rồi Supertest gửi request vào CHÍNH máy chủ đó.
const app = taoApp();
let http: HttpServer;
let io: Server;
let url: string;
const socketDaMo: Socket[] = [];

beforeAll(async () =&gt; {
  http = createServer(app);
  io = await ganRealtime(http);
  await new Promise&lt;void&gt;((r) =&gt; http.listen(0, '127.0.0.1', r));
  url = \`http://127.0.0.1:\${(http.address() as AddressInfo).port}\`;
});
afterAll(() =&gt; new Promise&lt;void&gt;((r) =&gt; io.close(() =&gt; r()))); // io.close đóng cả http (bài 7.1)
beforeEach(async () =&gt; {
  for (const s of socketDaMo.splice(0)) s.disconnect();
  await donSach();
});`;

const RT_TEST = `describe('realtime qua socket thật', () =&gt; {
  it('khách đang xem bài nhận bình luận mới; người xem bài KHÁC thì không', async () =&gt; {
    const an = await dangNhap(app, 'An');
    const taoBai = (title: string) =&gt;
      request(http).post('/api/posts').set(bearer(an.token)).send({ title, body: 'x', status: 'published' });
    const [b1, b2] = [(await taoBai('Một')).body, (await taoBai('Hai')).body];

    const xem1 = moSocket();
    const xem2 = moSocket();
    await Promise.all([choNoi(xem1), choNoi(xem2)]);
    expect(await xem1.emitWithAck('bai:xem', b1.id)).toEqual({ ok: true });
    expect(await xem2.emitWithAck('bai:xem', b2.id)).toEqual({ ok: true });

    let xem2Nhan = 0;
    xem2.on('binh-luan:moi', () =&gt; xem2Nhan++);
    const den = choSuKien(xem1, 'binh-luan:moi');
    await request(http)
      .post(\`/api/posts/\${b1.id}/comments\`)
      .set(bearer(an.token))
      .send({ body: 'Chào' })
      .expect(201);
    expect(await den).toMatchObject({
      postId: b1.id,
      binhLuan: { body: 'Chào', author: { displayName: 'An' } },
    });
    await new Promise((r) =&gt; setTimeout(r, 200));
    expect(xem2Nhan).toBe(0);
  });`;

const LAN_DAU = `     × xem phiên đăng nhập của NGƯỜI KHÁC ⇒ 403; của mình ⇒ thấy phiên, không thấy tokenHash 84ms
     × PUT hai lần ⇒ vẫn 1 lượt; DELETE hai lần ⇒ 0, đều 200 64ms
     × Bình sửa/xoá bài của An ⇒ 403, bài KHÔNG đổi trong CSDL 188ms
     × bài nháp của An: Bình GET/PATCH ⇒ 404 (không xác nhận "bài có tồn tại") 52ms
     × gửi kèm authorId để "đăng hộ" người khác ⇒ 400 (z.strictObject), không âm thầm bỏ qua 49ms
     × id không phải uuid ⇒ 404 KHONG_TIM_THAY ngay ở middleware, không phải 500 (bài 4.1) 9ms
     × vào phòng bài NHÁP của người khác ⇒ ack KHONG_TIM_THAY (cùng luật với GET /posts/:id) 46ms
 FAIL  |tich-hop| test/api/bao-ve.api.test.ts &gt; phân quyền bài viết (IDOR) &gt; Bình sửa/xoá bài của An ⇒ 403, bài KHÔNG đổi trong CSDL
Error: expected 200 "OK", got 400 "Bad Request"
 FAIL  |tich-hop| test/api/bao-ve.api.test.ts &gt; phân quyền bài viết (IDOR) &gt; bài nháp của An: Bình GET/PATCH ⇒ 404 (không xác nhận "bài có tồn tại")
Error: expected 200 "OK", got 400 "Bad Request"
 FAIL  |tich-hop| test/api/bao-ve.api.test.ts &gt; phân quyền bài viết (IDOR) &gt; gửi kèm authorId để "đăng hộ" người khác ⇒ 400 (z.strictObject), không âm thầm bỏ qua
Error: expected 200 "OK", got 400 "Bad Request"
 FAIL  |tich-hop| test/api/bao-ve.api.test.ts &gt; phân quyền bài viết (IDOR) &gt; id không phải uuid ⇒ 404 KHONG_TIM_THAY ngay ở middleware, không phải 500 (bài 4.1)
Error: expected 400 "Bad Request", got 404 "Not Found"
 FAIL  |tich-hop| test/api/binh-luan-thich.api.test.ts &gt; thích qua HTTP (PUT/DELETE idempotent) &gt; PUT hai lần ⇒ vẫn 1 lượt; DELETE hai lần ⇒ 0, đều 200
Error: expected 200 "OK", got 400 "Bad Request"
 FAIL  |tich-hop| test/api/nguoi-dung.api.test.ts &gt; /me và phiên &gt; xem phiên đăng nhập của NGƯỜI KHÁC ⇒ 403; của mình ⇒ thấy phiên, không thấy tokenHash
Error: expected 200 "OK", got 400 "Bad Request"
 FAIL  |tich-hop| test/api/realtime.api.test.ts &gt; realtime qua socket thật &gt; vào phòng bài NHÁP của người khác ⇒ ack KHONG_TIM_THAY (cùng luật với GET /posts/:id)
Error: expected 200 "OK", got 400 "Bad Request"
      Tests  7 failed | 32 passed (39)`;

const EMAIL = `"binh-2@test.dev"    hợp lệ
"bình-2@test.dev"    BỊ TỪ CHỐI: Invalid email address
"an@bình.vn"         BỊ TỪ CHỐI: Invalid email address`;

const LOG_ON = `$ npx vitest run --project tich-hop --reporter=verbose | wc -l
268
$ … | grep -c '^stdout'
98

stdout | test/api/bao-ve.api.test.ts &gt; xác thực &gt; get /api/me không token ⇒ 401 CHUA_DANG_NHAP + WWW-Authenticate
2026-11-24T16:50:32.027Z dc0bb92b-3648-46ae-b27a-863f533a186b GET /api/me 401 13.2ms
--
stdout | test/api/bao-ve.api.test.ts &gt; xác thực &gt; get /api/users/00000000-0000-4000-8000-000000000001/sessions không token ⇒ 401 CHUA_DANG_NHAP + WWW-Authenticate
2026-11-24T16:50:32.061Z fa7d5217-8558-47c2-9deb-e6b2e0f041ad GET /api/users/00000000-0000-4000-8000-000000000001/sessions 401 2.1ms
stdout | test/api/bao-ve.api.test.ts &gt; xác thực &gt; post /api/posts không token ⇒ 401 CHUA_DANG_NHAP + WWW-Authenticate`;

const LO_LOI = `     × CSDL ném lỗi lạ ⇒ 500 LOI_MAY_CHU, client KHÔNG thấy chi tiết; log có requestId để tra 16ms
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯
 FAIL  |tich-hop| test/api/bao-ve.api.test.ts &gt; lỗi máy chủ &gt; CSDL ném lỗi lạ ⇒ 500 LOI_MAY_CHU, client KHÔNG thấy chi tiết; log có requestId để tra
AssertionError: expected { Object (error) } to deeply equal { Object (error) }
- Expected
+ Received
  {
    "error": {
      "code": "LOI_MAY_CHU",
-     "message": "Có lỗi phía máy chủ",
+     "message": "Error: password authentication failed for user \\"chiase\\"",
      "requestId": "edd3c1ec-fc07-42b5-a2b5-66a6ed15ce7b",
    },
  }
 ❯ test/api/bao-ve.api.test.ts:104:22
    102|     );
    103|     const res = await request(app).get('/api/posts').expect(500);`;

const PELOTON_DIFF = `diff --git a/apps/api/src/services/user.service.ts b/apps/api/src/services/user.service.ts
index 9d3e42e..29efe99 100644
--- a/apps/api/src/services/user.service.ts
+++ b/apps/api/src/services/user.service.ts
@@ -10,8 +10,6 @@ export async function layToi(userId: string) {
 
 // Danh sách phiên đăng nhập (refresh token còn sống) của MỘT người — chỉ chính người đó được xem.
 export async function layPhien(nguoiXem: string, userId: string) {
-  if (nguoiXem !== userId)
-    throw new HttpError(403, 'KHONG_DUOC_PHEP', 'Bạn không được xem phiên của người khác');
   return prisma.refreshToken.findMany({
     where: { userId, revokedAt: null, expiresAt: { gt: new Date() } },
     select: { id: true, createdAt: true, expiresAt: true, userAgent: true },`;

const PELOTON = `     × xem phiên đăng nhập của NGƯỜI KHÁC ⇒ 403; của mình ⇒ thấy phiên, không thấy tokenHash 134ms
Error: expected 403 "Forbidden", got 200 "OK"
      Tests  1 failed | 38 passed (39)`;

const API_XANH = ` RUN  v5.1.1 /home/…/chiase/apps/api
[pg-test] fsp-pg-test-cb7869 sẵn sàng ở cổng 32832 sau 1492 ms
[pg-test] migrate deploy 1566 ms
 ✓ test/api/bao-ve.api.test.ts &gt; xác thực &gt; get /api/me không token ⇒ 401 CHUA_DANG_NHAP + WWW-Authenticate 226ms
 ✓ test/api/bao-ve.api.test.ts &gt; xác thực &gt; get /api/users/00000000-0000-4000-8000-000000000001/sessions không token ⇒ 401 CHUA_DANG_NHAP + WWW-Authenticate 15ms
 ✓ test/api/nguoi-dung.api.test.ts &gt; health &gt; CSDL sống ⇒ 200 {status: ok, db: ok} 186ms
 ✓ test/api/gioi-han.api.test.ts &gt; giới hạn thử đăng nhập &gt; lần thứ 4 trong 15 phút ⇒ 429 QUA_NHIEU_LAN, có header RateLimit cho client biết khi nào thử lại 379ms
 ✓ test/api/bao-ve.api.test.ts &gt; xác thực &gt; post /api/posts không token ⇒ 401 CHUA_DANG_NHAP + WWW-Authenticate 15ms
 ✓ test/api/bao-ve.api.test.ts &gt; xác thực &gt; patch /api/posts/00000000-0000-4000-8000-000000000001 không token ⇒ 401 CHUA_DANG_NHAP + WWW-Authenticate 13ms
 ✓ test/api/bao-ve.api.test.ts &gt; xác thực &gt; delete /api/posts/00000000-0000-4000-8000-000000000001 không token ⇒ 401 CHUA_DANG_NHAP + WWW-Authenticate 17ms
 ✓ test/api/bao-ve.api.test.ts &gt; xác thực &gt; post /api/uploads không token ⇒ 401 CHUA_DANG_NHAP + WWW-Authenticate 13ms
 ✓ test/api/bao-ve.api.test.ts &gt; xác thực &gt; post /api/posts/00000000-0000-4000-8000-000000000001/comments không token ⇒ 401 CHUA_DANG_NHAP + WWW-Authenticate 13ms
 ✓ test/api/bao-ve.api.test.ts &gt; xác thực &gt; delete /api/comments/00000000-0000-4000-8000-000000000001 không token ⇒ 401 CHUA_DANG_NHAP + WWW-Authenticate 12ms
 ✓ test/api/bao-ve.api.test.ts &gt; xác thực &gt; put /api/posts/00000000-0000-4000-8000-000000000001/like không token ⇒ 401 CHUA_DANG_NHAP + WWW-Authenticate 17ms
 ✓ test/api/auth.api.test.ts &gt; POST /api/auth/register &gt; 202, và email TRÙNG nhận đúng cùng câu trả lời (không dò được email nào có tài khoản) 409ms
 ✓ test/api/binh-luan-thich.api.test.ts &gt; bình luận qua HTTP &gt; tạo 201 ⇒ GET danh sách thấy, commentCount của bài tăng; khách đọc được không cần token 444ms
 ✓ test/api/nguoi-dung.api.test.ts &gt; /me và phiên &gt; trả hồ sơ KHÔNG có passwordHash (omit toàn cục) 196ms
 ✓ test/api/bao-ve.api.test.ts &gt; xác thực &gt; delete /api/posts/00000000-0000-4000-8000-000000000001/like không token ⇒ 401 CHUA_DANG_NHAP + WWW-Authenticate 12ms
 ✓ test/api/bao-ve.api.test.ts &gt; xác thực &gt; token rác ⇒ 401 TOKEN_KHONG_HOP_LE 14ms
 ✓ test/api/bao-ve.api.test.ts &gt; xác thực &gt; đường dẫn không tồn tại ⇒ 404, KHÔNG phải 401 (lỗi apiRouter.use(requireAuth) ở bài 3.3) 15ms
 ✓ test/api/nguoi-dung.api.test.ts &gt; /me và phiên &gt; token còn hạn nhưng tài khoản đã bị xoá ⇒ 401 TAI_KHOAN_KHONG_CON 67ms
 ✓ test/api/auth.api.test.ts &gt; POST /api/auth/register &gt; dữ liệu sai ⇒ 400 DU_LIEU_SAI liệt kê TỪNG trường sai, kèm requestId 28ms
 ✓ test/api/auth.api.test.ts &gt; POST /api/auth/register &gt; body không phải JSON ⇒ 400 JSON_HONG (không phải 500) 11ms
 ✓ test/api/auth.api.test.ts &gt; POST /api/auth/login &gt; đúng ⇒ access token trong body; refresh token CHỈ trong cookie httpOnly/Secure/SameSite=Strict/Path=/api/auth 106ms
 ✓ test/api/binh-luan-thich.api.test.ts &gt; bình luận qua HTTP &gt; ?limit=abc hoặc cursor hỏng ⇒ 400, không 500 84ms
 ✓ test/api/nguoi-dung.api.test.ts &gt; /me và phiên &gt; xem phiên đăng nhập của NGƯỜI KHÁC ⇒ 403; của mình ⇒ thấy phiên, không thấy tokenHash 133ms
 ✓ test/api/auth.api.test.ts &gt; POST /api/auth/login &gt; sai mật khẩu và email không tồn tại ⇒ CÙNG 401, cùng body (trừ requestId) 86ms
 ✓ test/api/bao-ve.api.test.ts &gt; phân quyền bài viết (IDOR) &gt; Bình sửa/xoá bài của An ⇒ 403, bài KHÔNG đổi trong CSDL 302ms
 ✓ test/api/nguoi-dung.api.test.ts &gt; POST /api/uploads (vé tải ảnh — chỉ KÝ, không gọi mạng) &gt; 201: khoá nằm trong tmp/&lt;id của mình&gt;/, URL ký cả content-length và content-type 74ms
 ✓ test/api/auth.api.test.ts &gt; vòng đời phiên: refresh xoay vòng, dùng lại bị thu hồi, đăng xuất &gt; refresh ⇒ cookie MỚI; gửi lại cookie CŨ ⇒ 401 REFRESH_DUNG_LAI + xoá cookie; cookie mới cũng chết theo họ 78ms
 ✓ test/api/auth.api.test.ts &gt; vòng đời phiên: refresh xoay vòng, dùng lại bị thu hồi, đăng xuất &gt; đăng xuất ⇒ 204; refresh sau đó ⇒ 401. Access token đang cầm VẪN dùng được tới khi hết hạn (đã biết, bài 3.3) 55ms
 ✓ test/api/nguoi-dung.api.test.ts &gt; POST /api/uploads (vé tải ảnh — chỉ KÝ, không gọi mạng) &gt; image/svg+xml hoặc &gt; 5 MiB ⇒ 400 51ms
 ✓ test/api/binh-luan-thich.api.test.ts &gt; bình luận qua HTTP &gt; xoá: người lạ 403, chủ bình luận 204, xoá lần nữa 404 162ms
 ✓ test/api/bao-ve.api.test.ts &gt; phân quyền bài viết (IDOR) &gt; bài nháp của An: Bình GET/PATCH ⇒ 404 (không xác nhận "bài có tồn tại") 105ms
 ✓ test/api/binh-luan-thich.api.test.ts &gt; thích qua HTTP (PUT/DELETE idempotent) &gt; PUT hai lần ⇒ vẫn 1 lượt; DELETE hai lần ⇒ 0, đều 200 132ms
 ✓ test/api/bao-ve.api.test.ts &gt; phân quyền bài viết (IDOR) &gt; gửi kèm authorId để "đăng hộ" người khác ⇒ 400 (z.strictObject), không âm thầm bỏ qua 62ms
 ✓ test/api/bao-ve.api.test.ts &gt; phân quyền bài viết (IDOR) &gt; id không phải uuid ⇒ 404 KHONG_TIM_THAY ngay ở middleware, không phải 500 (bài 4.1) 9ms
 ✓ test/api/bao-ve.api.test.ts &gt; lỗi máy chủ &gt; CSDL ném lỗi lạ ⇒ 500 LOI_MAY_CHU, client KHÔNG thấy chi tiết; log có requestId để tra 10ms
 ✓ test/api/realtime.api.test.ts &gt; realtime qua socket thật &gt; khách đang xem bài nhận bình luận mới; người xem bài KHÁC thì không 605ms
 ✓ test/api/realtime.api.test.ts &gt; realtime qua socket thật &gt; vào phòng bài NHÁP của người khác ⇒ ack KHONG_TIM_THAY (cùng luật với GET /posts/:id) 91ms
 ✓ test/api/realtime.api.test.ts &gt; realtime qua socket thật &gt; token rác ⇒ bị từ chối ngay lúc bắt tay với mã TOKEN_KHONG_HOP_LE 12ms
 ✓ test/api/realtime.api.test.ts &gt; realtime qua socket thật &gt; Origin lạ (trang khác mở WebSocket tới ta — CSWSH, bài 7.2) ⇒ bị từ chối 10ms
 Test Files  6 passed (6)
      Tests  39 passed (39)
   Start at  23:51:32
   Duration  5.42s (tests 40%, import 38%, setup 16%, transform 6%)`;


const MERMAID = `sequenceDiagram
  participant T as Test (Vitest)
  participant S as Supertest
  participant A as app Express (taoApp)
  participant D as Postgres dùng một lần
  T->>S: request(app).post('/api/auth/login')
  S->>A: mở cổng tạm 127.0.0.1:ngẫu nhiên, gửi HTTP thật
  A->>D: SELECT user, INSERT refresh_token
  A-->>S: 200 + Set-Cookie: rt=…; HttpOnly
  S-->>T: res.status, res.body, res.get('Set-Cookie')
  T->>T: expect(...) — và đóng cổng tạm`;

const MERMAID_EN = `sequenceDiagram
  participant T as Test (Vitest)
  participant S as Supertest
  participant A as Express app (taoApp)
  participant D as Disposable Postgres
  T->>S: request(app).post('/api/auth/login')
  S->>A: opens 127.0.0.1:random, sends real HTTP
  A->>D: SELECT user, INSERT refresh_token
  A-->>S: 200 + Set-Cookie: rt=…; HttpOnly
  S-->>T: res.status, res.body, res.get('Set-Cookie')
  T->>T: expect(...) — temporary port closed`;

const THE = [
  lienKet({ khoa: 'testing', bai: 'tst-5-1-supertest', title: 'Testing 5.1 — Supertest: gửi request mà không cần bật server', sub: 'Nền của bài này: request(app), agent, expect.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'testing', bai: 'tst-5-2-xac-thuc', title: 'Testing 5.2 — Test xác thực và phân quyền: 401, 403, 404', sub: 'Bảng route × vai trò, cách không bỏ sót route.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'testing', bai: 'tst-5-4-hop-dong', title: 'Testing 5.4 — Contract test và OpenAPI', sub: 'Khi frontend và backend lệch nhau về hình dạng JSON.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nodejs', bai: 'nodejs-14-3-supertest', title: 'Node.js 14.3 — Kiểm tầng HTTP bằng supertest', sub: 'Cùng công cụ, góc nhìn Node thuần.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('🚲', 'Pen Test Partners — Jan Masters, "Tour de Peloton: Exposed user data" (05/05/2021)', 'pentestpartners.com', 'https://www.pentestpartners.com/security-blog/tour-de-peloton-exposed-user-data/'),
  nguon('🛡️', 'OWASP API Security Top 10 — 2023', 'owasp.org', 'https://owasp.org/API-Security/editions/2023/en/0x11-t10/'),
  nguon('📦', 'supertest — README', 'github.com/forwardemail/supertest', 'https://github.com/forwardemail/supertest'),
].join('\n');

export default {
  title: '8.3 — API tests with Supertest|||8.3 — Test API bằng Supertest',
  slug: 'fp-8-3-api-supertest',
  type: 'LESSON',
  isFreePreview: true,
  description: '39 test gửi HTTP thật vào app Express mà không bật server: đăng ký/đăng nhập với cookie httpOnly, refresh xoay vòng và thu hồi cả họ, MỌI route bảo vệ không token ⇒ 401 (một bảng, thêm route là thêm dòng), IDOR 403 + CSDL không đổi, lỗi 500 không lộ chi tiết, 429 với vi.hoisted, và socket.io-client trên máy chủ cổng 0. Đo thật: lần chạy đầu 7 đỏ vì email có dấu (Zod 4 từ chối) và một test đoán sai thiết kế; 98 khối log che kết quả; bản "sửa" kiểu Peloton 2021 qua hết test 401 — chỉ test 403 bắt được.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Testing the stack</span>
<h2>Test the API the way the browser uses it — without starting it</h2>
<p class="lead">Services can be right and the API still wrong: a route without <code>requireAuth</code>, a cookie without <code>HttpOnly</code>, an error handler that prints the database password. Those live in routing, middleware and HTTP headers — the layer between the browser and the services. Supertest sends real HTTP requests to the Express app built by <code>taoApp()</code> (we split it from <code>server.ts</code> back in Chapter 2 for exactly this), on a temporary port, against the disposable Postgres from 8.2.</p>

<pre><code class="language-mermaid">${MERMAID_EN}</code></pre>

<h3>1. Helpers: real users, real login</h3>
<p>No forged tokens: tests log in through <code>POST /api/auth/login</code> like the web app, so the token and the cookie are exactly what production issues.</p>
<pre><code class="language-ts">${TRO_GIUP}</code></pre>
<pre><code class="language-ts">${AUTH_DAU}</code></pre>
<p>The first run of the API tests was 7 red:</p>
<div class="out">${LAN_DAU}</div>
<p>Six came from the helper, not the API: it built emails from display names, and "Bình" produced <code>bình-2@test.dev</code>. Zod 4's <code>z.email()</code> rejects non-ASCII local parts (and international domain names):</p>
<div class="out">${EMAIL}</div>
<p>That is a product decision worth writing down (a Vietnamese user with an internationalized address cannot register), not something to discover by accident. The seventh failure was the test being wrong: <code>/posts/abc</code> returns 404 by design (lesson 4.1 — a malformed id is "no such post"). When a new test fails, first decide which one is wrong — the code or your assumption.</p>

<h3>2. Authentication: cookies are part of the contract</h3>
<pre><code class="language-ts">${AUTH_LOGIN}</code></pre>
<p>Each attribute in the loop is a past decision: <code>HttpOnly</code> keeps the refresh token away from XSS (6.2), <code>SameSite=Strict</code> blocks cross-site sends, <code>Path=/api/auth</code> keeps it off every other request. Delete one in a refactor and this test names which. The full session lifecycle — rotation, reuse detection, logout — runs in two tests:</p>
<pre><code class="language-ts">${AUTH_VONG}</code></pre>
<p>The last assertion documents a known weakness on purpose (access tokens live until they expire, 3.3). A test that says "this is still true" stops someone from assuming otherwise.</p>

<h3>3. Every protected route, in one table</h3>
<p>Checkpoint 3 called protected routes one by one. A table turns "remember to test the new route" into "add a line":</p>
<pre><code class="language-ts">${BAO_VE_BANG}</code></pre>
<p>401 answers "who are you?". Authorization — "may <em>you</em> touch <em>this</em>?" — needs two real users:</p>
<pre><code class="language-ts">${BAO_VE_IDOR}</code></pre>
<p>As in 8.2, the test checks the database afterwards: a 403 that still applied the update would otherwise pass.</p>

<div class="pitfall co-tieu-de"><p><strong>Trap — API tests with only one user.</strong> If every test logs in as one person and works on that person's data, IDOR is never caught. Every "whose is it" rule needs at least one test with ANOTHER user — asserting both the status code and the database state.</p></div>

<h3>4. Errors: what the client must never see</h3>
<p>A spy makes Prisma throw once with a message that looks like a real leak:</p>
<pre><code class="language-ts">${BAO_VE_500}</code></pre>
<p>Change the handler to send <code>String(err)</code> (an easy "debug" edit) and the test shows exactly what would have reached every client:</p>
<div class="out">${LO_LOI}</div>

<h3>5. Rate limits: setting env before imports</h3>
<p>The limiter reads <code>AUTH_RATE_LIMIT</code> when its module is imported, and imports are hoisted above normal code. <code>vi.hoisted</code> runs first:</p>
<pre><code class="language-ts">${GIOI_HAN}</code></pre>
<p>The shared test environment sets 1000 so other files can log in freely; Vitest isolates each test file, so this file gets its own limiter with 3.</p>

<h3>6. Sockets need a server that stays up</h3>
<p>Supertest opens and closes a port per request; a WebSocket can't attach to that. Start one HTTP server on port 0 for the file, attach realtime exactly as <code>server.ts</code> does, and point both Supertest and socket.io-client at it:</p>
<pre><code class="language-ts">${RT_DAU}</code></pre>
<pre><code class="language-ts">${RT_TEST}</code></pre>
<p>The negative check ("the other room received nothing in 200 ms") is the one that would have caught <code>io.emit</code> to everyone in 7.2.</p>

<h3>7. Noise, and the whole layer</h3>
<p>Every request writes a log line. In verbose mode that buried the results:</p>
<div class="out">${LOG_ON}</div>
<p><code>silent: 'passed-only'</code> in <code>vitest.config.ts</code> hides output of passing tests and keeps it for failing ones, when the request id and the stack trace are exactly what you want. After: 60 lines, 0 log blocks.</p>
<div class="out">${API_XANH}</div>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">app</span><span class="lz-d">request(taoApp()) — HTTP thật, không mở cổng 41810</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">người thật</span><span class="lz-d">đăng nhập qua endpoint, không tự ký token</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">bảng route</span><span class="lz-d">mọi route bảo vệ không token ⇒ 401</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">hai người</span><span class="lz-d">người khác ⇒ 403/404 và CSDL không đổi</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">lỗi</span><span class="lz-d">500 không lộ gì, có requestId</span></div>
<div class="lz-step"><span class="lz-k">6</span><span class="lz-t">socket</span><span class="lz-d">máy chủ cổng 0 sống suốt tệp</span></div>
</div>

<h3>Everyday analogy</h3>
<p>Checking that the lock works with the right key is half the test. A locksmith also tries the neighbour's key, a bent key, and no key — and then checks that nothing inside moved.</p>

<h3>On the job</h3>
<p>In outsourcing, the customer's QA team will run a scanner or Postman collection against your API before acceptance. A table of routes × roles × expected status, kept in your repo as tests, is what lets you answer "did you check authorization on every endpoint?" with a link instead of a promise.</p>

<h3>⚠️ Real incident: Peloton API, 2021</h3>
<p>Jan Masters of Pen Test Partners reported on 20/01/2021 that Peloton's API let an <em>unauthenticated</em> user read private profile data — age, gender, location, workout stats — even for users who had set their profile to private. Peloton acknowledged, then went quiet. In February the endpoint was "silently and partly resolved": it now required a logged-in account… and returned the same data to <em>any</em> of Peloton's ~3 million authenticated users (published 05/05/2021, after a journalist got involved). Every "no token ⇒ 401" test would have passed after that fix. Here is the same kind of fix on ChiaSe — remove "only you can list your own sessions":</p>
<pre><code class="language-diff">${PELOTON_DIFF}</code></pre>
<div class="out">${PELOTON}</div>
<p>One test caught it: the one with two users. Authentication tests answer "is a token required?"; only authorization tests answer "whose data comes back?" (OWASP API Top 10 2023: API1 Broken Object Level Authorization, API2 Broken Authentication).</p>

${spring(true, 'Spring tests this layer with MockMvc: <code>@WebMvcTest</code> for one controller slice with mocked services, or <code>@SpringBootTest</code> + <code>@AutoConfigureMockMvc</code> for the full stack. <code>spring-security-test</code> adds <code>@WithMockUser</code> and <code>jwt()</code> post-processors — convenient, but also a forged identity: keep at least one test that logs in through the real endpoint.', [
  ['sb-11-3-mockmvc', 'Spring Boot 11.3 — Controller tests with @WebMvcTest'],
  ['sb-11-5-test-security', 'Spring Boot 11.5 — Testing secured endpoints'],
])}

<h3>🎤 What the interviewer will ask</h3>
<ol>
<li><strong>"How do you test an Express API without starting the server?"</strong> — Export the app separately from <code>listen</code>; Supertest binds it to an ephemeral port per request.</li>
<li><strong>"401 vs 403 vs 404 — how do you test each?"</strong> — No/invalid token ⇒ 401; valid user without rights ⇒ 403 (or 404 when existence itself is secret); check state didn't change.</li>
<li><strong>"How do you make sure no endpoint was left unprotected?"</strong> — A table-driven test over every protected route; ideally generated from the router or OpenAPI spec.</li>
<li><strong>"How do you test cookies?"</strong> — Read <code>Set-Cookie</code>, assert attributes, send it back with <code>.set('Cookie', …)</code>; test rotation and reuse.</li>
<li><strong>"How do you test WebSockets?"</strong> — A real server on port 0, a real client, wait for events with a timeout, and assert the negative case (who must <em>not</em> receive).</li>
</ol>

<h3>🧪 Lab 8.3 (2 hours)</h3>
<div class="callout ok">
<ol>
<li>Write the helper that registers and logs in through the real endpoint. Use a display name with Vietnamese accents and see what happens; decide and document.</li>
<li>Test register/login: same answer for duplicate email, field-level 400, cookie attributes, same 401 for wrong password and unknown email.</li>
<li>Test the session lifecycle: rotation, reuse revokes the family, logout.</li>
<li>Write the protected-routes table. Remove <code>requireAuth</code> from one route and watch it fail.</li>
<li>IDOR: another user edits/deletes ⇒ 403 and the row is unchanged. Remove the "only you" check from <code>layPhien</code> and record which tests catch it.</li>
<li>One socket test on a port-0 server: a guest receives a new comment, a viewer of another post does not.</li>
</ol>
<p><strong>Done when:</strong> ≥ 35 API tests green in under 10 s, verbose output shows no log noise for passing tests, and removing any single <code>requireAuth</code> or ownership check turns at least one test red.</p>
<p><strong>Rubric (10):</strong> real login helper (1) · cookie contract (2) · route table (2) · authorization with two users + state check (2) · 500 leak test (1) · socket positive + negative (2).</p>
</div>
<details><summary>Solution</summary>
<p>Branch <code>ch8/test</code>: <code>apps/api/test/api/</code> — <code>tro-giup.ts</code>, <code>auth.api.test.ts</code>, <code>bao-ve.api.test.ts</code>, <code>binh-luan-thich.api.test.ts</code>, <code>nguoi-dung.api.test.ts</code>, <code>gioi-han.api.test.ts</code>, <code>realtime.api.test.ts</code>; <code>silent: 'passed-only'</code> in <code>vitest.config.ts</code>; <code>AUTH_RATE_LIMIT</code> in <code>test/moi-truong.ts</code>.</p>
</details>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Supertest</span><span class="v">Sends real HTTP requests to an app on an ephemeral port and asserts on the response.</span></div>
  <div class="kv"><span class="k">authentication / authorization</span><span class="v">Who are you (401) / may you do this (403).</span></div>
  <div class="kv"><span class="k">BOLA / IDOR</span><span class="v">Accessing another user's object by changing an id.</span></div>
  <div class="kv"><span class="k">table-driven test</span><span class="v">One test body run over a list of cases (it.each).</span></div>
  <div class="kv"><span class="k">port 0</span><span class="v">Ask the OS for any free port.</span></div>
  <div class="kv"><span class="k">silent: 'passed-only'</span><span class="v">Show console output only for failing tests.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Supertest exercises routing, middleware, headers and cookies — what services tests cannot.</li>
<li>Log in through the real endpoint; a forged token tests your forgery.</li>
<li>One table of protected routes; two users for every ownership rule; check the database didn't change.</li>
<li>Peloton's "fix" passed every 401 test — authorization needs its own tests.</li>
<li>WebSockets: one server on port 0 per file, positive and negative assertions.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Test cả hệ thống</span>
<h2>Test API đúng như trình duyệt dùng nó — mà không cần bật nó</h2>
<p class="lead">Service đúng mà API vẫn sai được: một route thiếu <code>requireAuth</code>, một cookie thiếu <code>HttpOnly</code>, một bộ xử lý lỗi in ra mật khẩu CSDL. Những thứ đó nằm ở route, middleware và header HTTP — tầng giữa trình duyệt và service. Supertest gửi request HTTP thật vào app Express do <code>taoApp()</code> dựng (ta tách nó khỏi <code>server.ts</code> từ Chương 2 chính vì việc này), trên một cổng tạm, với Postgres dùng một lần của bài 8.2.</p>

<pre><code class="language-mermaid">${MERMAID}</code></pre>

<h3>1. Hàm trợ giúp: người dùng thật, đăng nhập thật</h3>
<p>Không tự ký token: test đăng nhập qua <code>POST /api/auth/login</code> như web, nên token và cookie đúng y thứ production cấp.</p>
<pre><code class="language-ts">${TRO_GIUP}</code></pre>
<pre><code class="language-ts">${AUTH_DAU}</code></pre>
<p>Lần chạy đầu của test API: 7 đỏ.</p>
<div class="out">${LAN_DAU}</div>
<p>Sáu cái do hàm trợ giúp, không phải do API: nó dựng email từ tên hiển thị, và "Bình" sinh ra <code>bình-2@test.dev</code>. <code>z.email()</code> của Zod 4 từ chối phần trước @ có ký tự ngoài ASCII (và cả tên miền quốc tế hoá):</p>
<div class="out">${EMAIL}</div>
<p>Đây là một quyết định sản phẩm đáng ghi lại (người dùng có địa chỉ email tiếng Việt không đăng ký được), không phải thứ để tình cờ phát hiện. Cái thứ bảy là test sai: <code>/posts/abc</code> trả 404 theo thiết kế (bài 4.1 — id hỏng nghĩa là "không có bài này"). Khi một test mới đỏ, trước hết hãy quyết định bên nào sai — mã, hay giả định của bạn.</p>

<h3>2. Xác thực: cookie là một phần của hợp đồng</h3>
<pre><code class="language-ts">${AUTH_LOGIN}</code></pre>
<p>Mỗi thuộc tính trong vòng lặp là một quyết định cũ: <code>HttpOnly</code> giữ refresh token khỏi tay XSS (6.2), <code>SameSite=Strict</code> chặn gửi chéo trang, <code>Path=/api/auth</code> để nó không đi kèm mọi request khác. Refactor mà lỡ xoá một cái, test này gọi đúng tên cái đó. Cả vòng đời phiên — xoay vòng, phát hiện dùng lại, đăng xuất — nằm trong hai test:</p>
<pre><code class="language-ts">${AUTH_VONG}</code></pre>
<p>Khẳng định cuối cố tình ghi lại một điểm yếu đã biết (access token sống tới khi hết hạn, bài 3.3). Một test nói "điều này vẫn đúng" ngăn người sau tưởng ngược lại.</p>

<h3>3. Mọi route được bảo vệ, trong một bảng</h3>
<p>Checkpoint 3 gọi từng route bảo vệ bằng tay. Một bảng biến "nhớ test route mới" thành "thêm một dòng":</p>
<pre><code class="language-ts">${BAO_VE_BANG}</code></pre>
<p>401 trả lời "bạn là ai?". Phân quyền — "BẠN có được đụng vào CÁI NÀY không?" — cần hai người dùng thật:</p>
<pre><code class="language-ts">${BAO_VE_IDOR}</code></pre>
<p>Như ở 8.2, test xem lại CSDL sau đó: một 403 mà vẫn ghi cập nhật thì nếu không xem lại sẽ vẫn qua.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — test API mà không có người thứ hai.</strong> Mọi test đăng nhập bằng một người rồi thao tác trên dữ liệu của chính người đó thì không bao giờ bắt được IDOR. Mỗi luật "của ai" cần ít nhất một test với người KHÁC — và test đó phải khẳng định cả mã trạng thái lẫn trạng thái CSDL.</p></div>

<h3>4. Lỗi: những thứ client không bao giờ được thấy</h3>
<p>Một spy làm Prisma ném lỗi một lần, với câu báo trông như một vụ lộ thật:</p>
<pre><code class="language-ts">${BAO_VE_500}</code></pre>
<p>Sửa bộ xử lý lỗi thành gửi <code>String(err)</code> (một chỉnh sửa "để debug" rất dễ gặp) và test cho thấy chính xác thứ đã suýt tới tay mọi client:</p>
<div class="out">${LO_LOI}</div>

<h3>5. Giới hạn tốc độ: đặt biến môi trường trước import</h3>
<p>Bộ giới hạn đọc <code>AUTH_RATE_LIMIT</code> lúc module của nó được import, và import được kéo lên trên mã thường. <code>vi.hoisted</code> chạy trước cả import:</p>
<pre><code class="language-ts">${GIOI_HAN}</code></pre>
<p>Môi trường test chung đặt 1000 để các tệp khác đăng nhập thoải mái; Vitest cô lập từng tệp test, nên tệp này có bộ giới hạn riêng với số 3.</p>

<h3>6. Socket cần một máy chủ sống suốt</h3>
<p>Supertest mở rồi đóng cổng cho mỗi request; WebSocket không bám vào thứ đó được. Bật một máy chủ HTTP ở cổng 0 cho cả tệp, gắn realtime y như <code>server.ts</code>, rồi trỏ cả Supertest lẫn socket.io-client vào nó:</p>
<pre><code class="language-ts">${RT_DAU}</code></pre>
<pre><code class="language-ts">${RT_TEST}</code></pre>
<p>Phép kiểm phủ định ("phòng kia không nhận gì trong 200 ms") chính là cái sẽ bắt được lỗi <code>io.emit</code> cho tất cả ở bài 7.2.</p>

<h3>7. Tiếng ồn, và toàn bộ tầng API</h3>
<p>Mỗi request ghi một dòng log. Ở chế độ verbose, chúng chôn mất kết quả:</p>
<div class="out">${LOG_ON}</div>
<p><code>silent: 'passed-only'</code> trong <code>vitest.config.ts</code> giấu output của test xanh và giữ cho test đỏ — lúc đó requestId và stack trace là đúng thứ bạn cần. Sau khi bật: 60 dòng, 0 khối log.</p>
<div class="out">${API_XANH}</div>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">app</span><span class="lz-d">request(taoApp()) — HTTP thật, không mở cổng 41810</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">người thật</span><span class="lz-d">đăng nhập qua endpoint, không tự ký token</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">bảng route</span><span class="lz-d">mọi route bảo vệ không token ⇒ 401</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">hai người</span><span class="lz-d">người khác ⇒ 403/404 và CSDL không đổi</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">lỗi</span><span class="lz-d">500 không lộ gì, có requestId</span></div>
<div class="lz-step"><span class="lz-k">6</span><span class="lz-t">socket</span><span class="lz-d">máy chủ cổng 0 sống suốt tệp</span></div>
</div>

<h3>Liên hệ đời thường</h3>
<p>Thử ổ khoá mở được bằng đúng chìa mới là một nửa phép thử. Thợ khoá còn thử chìa nhà hàng xóm, chìa cong, và không chìa — rồi kiểm xem đồ bên trong có bị xê dịch không.</p>

<h3>Tình huống đi làm thật</h3>
<p>Ở outsourcing, đội QA của khách sẽ chạy công cụ quét hoặc bộ Postman vào API của bạn trước khi nghiệm thu. Một bảng route × vai trò × mã trạng thái mong đợi, nằm sẵn trong repo dưới dạng test, là thứ giúp bạn trả lời câu "các anh đã kiểm phân quyền ở mọi endpoint chưa?" bằng một đường liên kết thay vì một lời hứa.</p>

<h3>⚠️ Sự cố thật: API của Peloton, 2021</h3>
<p>Ngày 20/01/2021, Jan Masters (Pen Test Partners) báo cho Peloton rằng API của họ cho người <em>chưa đăng nhập</em> đọc dữ liệu hồ sơ riêng tư — tuổi, giới tính, nơi ở, số liệu tập — kể cả của người đã đặt hồ sơ ở chế độ riêng tư. Peloton xác nhận đã nhận, rồi im lặng. Tháng 2, lỗ hổng được "sửa lặng lẽ và một phần": endpoint giờ đòi đăng nhập… và trả đúng dữ liệu đó cho <em>bất kỳ</em> ai trong khoảng 3 triệu tài khoản Peloton (bài công bố 05/05/2021, sau khi có nhà báo vào cuộc). Mọi test "không token ⇒ 401" đều sẽ xanh sau bản sửa đó. Đây là cùng kiểu sửa trên ChiaSe — bỏ luật "chỉ chính bạn xem được danh sách phiên của bạn":</p>
<pre><code class="language-diff">${PELOTON_DIFF}</code></pre>
<div class="out">${PELOTON}</div>
<p>Một test bắt được: test có hai người dùng. Test xác thực trả lời "có cần token không?"; chỉ test phân quyền trả lời "dữ liệu của AI được trả về?" (OWASP API Top 10 2023: API1 Broken Object Level Authorization, API2 Broken Authentication).</p>

${spring(false, 'Spring test tầng này bằng MockMvc: <code>@WebMvcTest</code> cho một lát controller với service giả, hoặc <code>@SpringBootTest</code> + <code>@AutoConfigureMockMvc</code> cho cả hệ thống. <code>spring-security-test</code> có <code>@WithMockUser</code> và bộ hậu xử lý <code>jwt()</code> — tiện, nhưng cũng là danh tính giả: giữ ít nhất một test đăng nhập qua endpoint thật.', [
  ['sb-11-3-mockmvc', 'Spring Boot 11.3 — Test controller bằng @WebMvcTest'],
  ['sb-11-5-test-security', 'Spring Boot 11.5 — Test endpoint có bảo mật'],
])}

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>"Test API Express mà không bật server thế nào?"</strong> — Export app tách khỏi <code>listen</code>; Supertest gắn nó vào một cổng tạm cho mỗi request.</li>
<li><strong>"401, 403, 404 — test từng cái ra sao?"</strong> — Không/sai token ⇒ 401; người dùng hợp lệ nhưng không có quyền ⇒ 403 (hoặc 404 khi chính sự tồn tại là bí mật); kiểm trạng thái không đổi.</li>
<li><strong>"Làm sao chắc không endpoint nào bị bỏ ngỏ?"</strong> — Test dạng bảng qua mọi route được bảo vệ; tốt nhất sinh từ router hoặc đặc tả OpenAPI.</li>
<li><strong>"Test cookie thế nào?"</strong> — Đọc <code>Set-Cookie</code>, khẳng định thuộc tính, gửi lại bằng <code>.set('Cookie', …)</code>; test xoay vòng và dùng lại.</li>
<li><strong>"Test WebSocket thế nào?"</strong> — Máy chủ thật ở cổng 0, client thật, chờ sự kiện có hạn giờ, và khẳng định ca phủ định (ai KHÔNG được nhận).</li>
</ol>

<h3>🧪 Lab 8.3 (2 giờ)</h3>
<div class="callout ok">
<ol>
<li>Viết hàm trợ giúp đăng ký và đăng nhập qua endpoint thật. Dùng tên hiển thị có dấu tiếng Việt và xem chuyện gì xảy ra; quyết định và ghi lại.</li>
<li>Test đăng ký/đăng nhập: cùng câu trả lời khi email trùng, lỗi 400 theo từng trường, thuộc tính cookie, cùng 401 cho sai mật khẩu và email không tồn tại.</li>
<li>Test vòng đời phiên: xoay vòng, dùng lại thì thu hồi cả họ, đăng xuất.</li>
<li>Viết bảng route được bảo vệ. Bỏ <code>requireAuth</code> ở một route và xem nó đỏ.</li>
<li>IDOR: người khác sửa/xoá ⇒ 403 và dòng không đổi. Bỏ luật "chỉ chính bạn" trong <code>layPhien</code> và ghi lại test nào bắt được.</li>
<li>Một test socket trên máy chủ cổng 0: khách nhận bình luận mới, người xem bài khác thì không.</li>
</ol>
<p><strong>Xong khi:</strong> ≥ 35 test API xanh dưới 10 giây, output verbose không còn log của test xanh, và bỏ bất kỳ một <code>requireAuth</code> hay một phép kiểm chủ sở hữu nào cũng làm ít nhất một test đỏ.</p>
<p><strong>Thang điểm (10):</strong> hàm đăng nhập thật (1) · hợp đồng cookie (2) · bảng route (2) · phân quyền với hai người + kiểm trạng thái (2) · test lộ lỗi 500 (1) · socket ca có + ca không (2).</p>
</div>
<details><summary>Lời giải</summary>
<p>Nhánh <code>ch8/test</code>: <code>apps/api/test/api/</code> — <code>tro-giup.ts</code>, <code>auth.api.test.ts</code>, <code>bao-ve.api.test.ts</code>, <code>binh-luan-thich.api.test.ts</code>, <code>nguoi-dung.api.test.ts</code>, <code>gioi-han.api.test.ts</code>, <code>realtime.api.test.ts</code>; <code>silent: 'passed-only'</code> trong <code>vitest.config.ts</code>; <code>AUTH_RATE_LIMIT</code> trong <code>test/moi-truong.ts</code>.</p>
</details>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Supertest</span><span class="v">Gửi request HTTP thật vào app trên một cổng tạm rồi khẳng định trên phản hồi.</span></div>
  <div class="kv"><span class="k">xác thực / phân quyền</span><span class="v">Bạn là ai (401) / bạn có được làm việc này không (403).</span></div>
  <div class="kv"><span class="k">BOLA / IDOR</span><span class="v">Đọc/sửa đối tượng của người khác bằng cách đổi id.</span></div>
  <div class="kv"><span class="k">test dạng bảng</span><span class="v">Một thân test chạy qua một danh sách ca (it.each).</span></div>
  <div class="kv"><span class="k">cổng 0</span><span class="v">Xin hệ điều hành một cổng trống bất kỳ.</span></div>
  <div class="kv"><span class="k">silent: 'passed-only'</span><span class="v">Chỉ in output console của test đỏ.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Supertest kiểm route, middleware, header và cookie — thứ test service không chạm tới.</li>
<li>Đăng nhập qua endpoint thật; token tự ký chỉ test được… cách bạn tự ký.</li>
<li>Một bảng route được bảo vệ; mỗi luật "của ai" có hai người dùng; kiểm CSDL không đổi.</li>
<li>Bản "sửa" của Peloton qua hết test 401 — phân quyền cần test riêng.</li>
<li>WebSocket: một máy chủ cổng 0 mỗi tệp, khẳng định cả ca có lẫn ca không.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
