/**
 * Smoke MESSENGER của app desktop với backend CỤC BỘ (14/10/2026).
 *
 * App dùng lại nguyên cây messenger của web, nhưng qua ba lớp nối riêng (axios, authStore, socket của app)
 * và chạy trong Electron — nơi bấm một `<a target="_blank">` là `shell.openExternal` bật trình duyệt hệ
 * thống. Bài này chạy bản ĐÃ BUILD (`dist/`) và đo đúng ba điều người dùng báo:
 *
 *   1. tin người kia gửi hiện NGAY trong khung chat + danh sách (socket của app, không phải hỏi lại 8 s)
 *   2. mở hội thoại nằm ở ĐÁY
 *   3. bấm ảnh ⇒ trình xem ảnh TRONG app; `shell.openExternal` KHÔNG được gọi lần nào
 *
 * Cần: backend cục bộ cho phép origin của app
 *   CORS_ORIGINS=app://cuongthai STORAGE_SANDBOX=1 PORT=3201 RATE_LIMIT_MAX_REQUESTS=1000000 npx tsx src/index.ts
 * rồi (trong desktop/): npm run build && node scripts/smoke-messenger.mjs
 * Biến: CT_LOCAL_API (mặc định http://localhost:3201), CT_SHOTS_DIR (thư mục chụp màn hình, tuỳ chọn).
 * Ảnh trong tin là ảnh https công khai (picsum.photos): CSP của app chỉ nhận ảnh `https:`.
 *
 * ⛔ Chỉ localhost: tạo hai tài khoản thật trong CSDL cục bộ rồi xoá theo id.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { _electron as electron } from 'playwright';

const root = path.dirname(fileURLToPath(new URL('../package.json', import.meta.url)));
const repo = path.dirname(root);
const API = (process.env.CT_LOCAL_API || 'http://localhost:3201').replace(/\/+$/, '');
const SHOTS = process.env.CT_SHOTS_DIR || '';
if (!/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(API)) throw new Error(`Chỉ chạy với backend cục bộ: ${API}`);

// Prisma + DATABASE_URL lấy từ GỐC repo (desktop/ không cài Prisma).
const yeuCau = createRequire(path.join(repo, 'package.json'));
yeuCau('dotenv').config({ path: path.join(repo, '.env') });
if (!/localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL || '')) throw new Error('DATABASE_URL phải là CSDL cục bộ');
const { PrismaClient } = yeuCau('@prisma/client');
const prisma = new PrismaClient();

const PASS = 'E2e-Test-Pass-2026!';
const tag = `dsk${Date.now().toString(36)}`;
const taoRa = [];
let loi = 0;
const dat = (ten, ok, ct = '') => { if (!ok) loi += 1; console.log(`${ok ? '✓' : '✗'} ${ten}${ct ? ` — ${ct}` : ''}`); };
const ngu = (ms) => new Promise((r) => setTimeout(r, ms));

async function goi(token, method, p, body) {
  const r = await fetch(`${API}/api/v1${p}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`${method} ${p}: ${r.status} ${JSON.stringify(j).slice(0, 200)}`);
  return j.data;
}

async function taoNguoi(ten) {
  const username = `${tag}_${ten}`;
  const email = `${username}@e2e.local`;
  await goi(null, 'POST', '/auth/register', { username, email, password: PASS, fullName: `Desk ${ten}` });
  const u = await prisma.user.update({ where: { email }, data: { emailVerified: true, emailVerifiedAt: new Date() }, select: { id: true } });
  taoRa.push(u.id);
  const dn = await goi(null, 'POST', '/auth/login', { username, password: PASS });
  return { id: u.id, username, ten: `Desk ${ten}`, token: dn.token };
}

const hoSo = fs.mkdtempSync(path.join(os.tmpdir(), 'ct-smoke-msg-'));
let app;
try {
  const A = await taoNguoi('an');
  const B = await taoNguoi('binh');
  const t = await goi(A.token, 'POST', `/messages/threads/user/${B.id}`);
  for (let i = 1; i <= 24; i++) {
    if (i === 8 || i === 20) {
      await goi(A.token, 'POST', `/messages/threads/${t.id}/messages`, { media: { url: `https://picsum.photos/id/${i === 8 ? 237 : 1025}/480/360`, kind: 'gif' } });
    } else {
      await goi(i % 3 ? A.token : B.token, 'POST', `/messages/threads/${t.id}/messages`, { content: `tin ${i} — ${'nội dung '.repeat(i % 4 * 3)}` });
    }
  }

  app = await electron.launch({
    args: [`--user-data-dir=${hoSo}`, path.join(root, 'dist/main/index.cjs')],
    env: { ...process.env, CT_RENDERER: 'bundle', CUONGTHAI_API_ORIGIN: API },
  });
  // Chặn & ĐẾM mọi lần mở ra ngoài.
  await app.evaluate(({ shell }) => {
    globalThis.__moRaNgoai = [];
    shell.openExternal = async (u) => { globalThis.__moRaNgoai.push(String(u)); };
  });
  let w = null;
  for (let i = 0; i < 60 && !w; i++) {
    w = app.windows().find((x) => !x.url().endsWith('/robot.html')) ?? null;
    if (!w) await ngu(250);
  }
  if (!w) throw new Error('không thấy cửa sổ chính (app CuongThai đang mở sẵn?)');
  await w.setViewportSize({ width: 1400, height: 900 }).catch(() => undefined);
  await w.waitForSelector('input[autocomplete="username"]', { timeout: 30_000 });
  await w.fill('input[autocomplete="username"]', B.username);
  await w.fill('input[autocomplete="current-password"]', PASS);
  await w.click('button[type="submit"]');
  await w.waitForSelector('.ct-shell', { timeout: 30_000 });
  await w.locator('.ct-sidebar [data-route="/messages"]').first().click();
  const hang = w.locator('[data-testid="thread-row"]').filter({ hasText: A.ten }).first();
  await hang.waitFor({ timeout: 30_000 });
  await ngu(800);

  // 1. Realtime ở DANH SÁCH (chưa mở hội thoại)
  const p1 = `desk-ping-1 ${tag}`;
  await goi(A.token, 'POST', `/messages/threads/${t.id}/messages`, { content: p1 });
  const t1 = Date.now();
  let ok1 = false;
  while (Date.now() - t1 < 3000) { if ((await hang.innerText()).includes(p1)) { ok1 = true; break; } await ngu(50); }
  dat('app: danh sách đổi chữ xem trước ngay khi người kia nhắn', ok1, `${Date.now() - t1} ms`);

  // 2. Mở hội thoại ⇒ đáy
  await hang.click();
  await w.locator('[data-testid="message-scroll"]').getByText(p1).waitFor({ timeout: 15_000 });
  // Ảnh https công khai phải TẢI ĐƯỢC trong app (CSP `img-src https:`) — chờ tối đa 12 s.
  let anh = { tong: 0, xong: 0 };
  for (let i = 0; i < 48; i++) {
    anh = await w.evaluate(() => {
      const ds = [...document.querySelectorAll('[data-testid="message-image"] img')];
      return { tong: ds.length, xong: ds.filter((x) => x.complete && x.naturalWidth > 0).length };
    });
    if (anh.tong > 0 && anh.xong === anh.tong) break;
    await ngu(250);
  }
  dat('app: ảnh trong tin tải được', anh.tong > 0 && anh.xong === anh.tong, `${anh.xong}/${anh.tong}`);
  await ngu(800);
  const viTri = () => w.evaluate(() => { const el = document.querySelector('[data-testid="message-scroll"]'); return el ? Math.round(el.scrollHeight - el.scrollTop - el.clientHeight) : -1; });
  const c1 = await viTri();
  dat('app: mở hội thoại nằm ở ĐÁY', c1 >= 0 && c1 <= 4, `cách đáy ${c1}px`);
  if (SHOTS) await w.screenshot({ path: path.join(SHOTS, 'desktop-1-hoi-thoai.png') });

  // 3. Tin mới trong khung đang mở
  const p2 = `desk-ping-2 ${tag}`;
  await goi(A.token, 'POST', `/messages/threads/${t.id}/messages`, { content: p2 });
  const t2 = Date.now();
  let ok2 = false;
  while (Date.now() - t2 < 3000) { if (await w.locator('[data-testid="message-scroll"]').getByText(p2).count()) { ok2 = true; break; } await ngu(50); }
  dat('app: tin mới hiện trong khung chat đang mở', ok2, `${Date.now() - t2} ms`);
  await ngu(600);
  const c2 = await viTri();
  dat('app: vẫn dính đáy sau tin mới', c2 >= 0 && c2 <= 4, `cách đáy ${c2}px`);

  // 4. Ảnh ⇒ trình xem ảnh TRONG app
  const soCuaSo = app.windows().length;
  await w.locator('[data-testid="message-image"]').last().click();
  await w.locator('[data-testid="image-lightbox"]').waitFor({ timeout: 10_000 });
  await ngu(1500);
  if (SHOTS) await w.screenshot({ path: path.join(SHOTS, 'desktop-2-trinh-xem-anh.png') });
  const raNgoai = await app.evaluate(() => globalThis.__moRaNgoai);
  dat('app: bấm ảnh mở trình xem ảnh trong app, KHÔNG gọi shell.openExternal', raNgoai.length === 0 && app.windows().length === soCuaSo, JSON.stringify(raNgoai));
  await w.keyboard.press('Escape');
  await ngu(200);
  dat('app: Esc đóng trình xem ảnh', (await w.locator('[data-testid="image-lightbox"]').count()) === 0);
} catch (e) {
  dat('kịch bản chạy hết', false, String(e?.message || e).split('\n')[0]);
} finally {
  await app?.close().catch(() => undefined);
  try { fs.rmSync(hoSo, { recursive: true, force: true }); } catch { /* đã dọn */ }
  if (taoRa.length) {
    await prisma.messageThread.deleteMany({ where: { OR: [{ userAId: { in: taoRa } }, { userBId: { in: taoRa } }] } });
    await prisma.socialNotification.deleteMany({ where: { OR: [{ receiverId: { in: taoRa } }, { senderId: { in: taoRa } }] } }).catch(() => undefined);
    await prisma.user.deleteMany({ where: { id: { in: taoRa } } });
  }
  await prisma.$disconnect();
}
console.log(loi ? `\n${loi} phép kiểm ĐỎ` : '\nTất cả đạt');
process.exit(loi ? 1 : 0);
