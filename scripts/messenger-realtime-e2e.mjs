#!/usr/bin/env node
/**
 * Messenger — phép kiểm THỜI GIAN THỰC chạy thật bằng hai trình duyệt (14/10/2026).
 *
 * Người dùng báo: bạn nhắn tới thì (a) danh sách hội thoại bên trái mãi sau mới đổi, (b) mở hội thoại ra thì
 * nằm GIỮA đoạn chat chứ không ở tin mới nhất. Script này dựng lại đúng cảnh đó và ĐO:
 *
 *   1. A nhắn ⇒ hàng của A trong danh sách của B đổi chữ xem trước + nhảy lên ĐẦU trong ≤ 1,5 s
 *   2. B mở hội thoại (có ảnh tải CHẬM 1,2 s, kiểu GIF thật) ⇒ sau khi ảnh tải xong vẫn ĐÁY
 *   3. A nhắn tiếp lúc B đang ở đáy ⇒ tin hiện trong ≤ 1,5 s và B vẫn dính đáy
 *   4. B cuộn lên đọc tin cũ, A nhắn ⇒ B KHÔNG bị giật xuống, hiện nút "tin mới ↓"; bấm nút ⇒ về đáy
 *   5. Ngắt mạng socket của B rồi nối lại ⇒ tin gửi lúc đứt vẫn hiện (lưới đỡ tải lại khi nối lại)
 *   6. Giao diện: mọi bong bóng tin đến cùng một mép trái, một ảnh đại diện ở CUỐI cụm, không còn nút "+"
 *      dưới mỗi tin, thanh 😊 ↩ ⋮ hiện khi rê chuột mà không xô bố cục, thả cảm xúc, menu ⋮, trình xem ảnh
 *      TRONG trang (←/→, Esc), không còn chấm xám / huy hiệu vàng
 *   7. "Hỗ trợ từ Admin" và nhắn thẳng admin ra CÙNG một hội thoại (cả hai thứ tự)
 *   + trang của B không ném lỗi runtime nào (bản cũ ném "Invalid easing type" của framer-motion)
 *
 * ─── Cần một stack CỤC BỘ đang chạy ───
 *   backend : INDEXNOW_ENABLED=false STORAGE_SANDBOX=1 PORT=3201 RATE_LIMIT_MAX_REQUESTS=1000000 npx tsx src/index.ts
 *   frontend: (cd frontend && INTERNAL_BACKEND_URL=http://localhost:3201 npx next dev -p 3200)
 *   chạy    : node scripts/messenger-realtime-e2e.mjs
 *
 * `next dev` KHÔNG chuyển tiếp websocket `/socket.io` (production có nginx làm việc đó), nên script tự dựng một
 * proxy nhỏ ở cổng 3202 đóng vai nginx: `/socket.io` → backend, còn lại → Next. Trình duyệt chỉ nói với 3202.
 * Proxy còn phục vụ `/__anh-cham/*.svg` — ảnh 320×420 trả về sau 1,2 s để mô phỏng GIF/ảnh tải chậm (thủ phạm
 * kinh điển của "mở chat nằm giữa": ảnh nở ra SAU lần cuộn xuống đáy).
 *
 * Biến môi trường: E2E_NEXT_URL (mặc định http://localhost:3200), E2E_BACKEND_URL (http://localhost:3201),
 * E2E_PROXY_PORT (3202), E2E_SHOTS_DIR (thư mục chụp ảnh, tuỳ chọn), E2E_HEADED=1.
 *
 * ⛔ Chỉ chạy với localhost — script TẠO tài khoản thật trong CSDL của `DATABASE_URL` rồi xoá theo id đã ghi lại.
 */
import 'dotenv/config';
import http from 'node:http';
import net from 'node:net';
import { setTimeout as ngu } from 'node:timers/promises';
import { chromium } from 'playwright';
import { PrismaClient } from '@prisma/client';

const NEXT = (process.env.E2E_NEXT_URL || 'http://localhost:3200').replace(/\/+$/, '');
const BACKEND = (process.env.E2E_BACKEND_URL || 'http://localhost:3201').replace(/\/+$/, '');
const PROXY_PORT = Number(process.env.E2E_PROXY_PORT || 3202);
const BASE = `http://localhost:${PROXY_PORT}`;
const SHOTS = process.env.E2E_SHOTS_DIR || '';
const HEADED = process.env.E2E_HEADED === '1';
const PASSWORD = 'E2e-Test-Pass-2026!';
const TRAN_MS = 1500; // "ngay lập tức" — gồm cả độ trễ vẽ lại của trình duyệt headless

for (const u of [NEXT, BACKEND]) {
  if (!['localhost', '127.0.0.1'].includes(new URL(u).hostname)) throw new Error(`Chỉ chạy với localhost: ${u}`);
}
if (!/localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL || '')) throw new Error('DATABASE_URL phải là CSDL cục bộ');

// ─── Proxy kiểu nginx ───────────────────────────────────────
function dungProxy() {
  const next = new URL(NEXT);
  const be = new URL(BACKEND);
  const dich = (url) => (url.startsWith('/socket.io') ? be : next);
  const server = http.createServer((req, res) => {
    if (req.url.startsWith('/__anh-cham/')) {
      const so = (req.url.match(/(\d+)/) || ['0'])[0];
      setTimeout(() => {
        res.writeHead(200, { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'no-store' });
        res.end(`<svg xmlns="http://www.w3.org/2000/svg" width="320" height="420"><rect width="320" height="420" fill="hsl(${(Number(so) * 47) % 360},60%,45%)"/><text x="160" y="220" font-size="64" text-anchor="middle" fill="#fff" font-family="sans-serif">#${so}</text></svg>`);
      }, 1200);
      return;
    }
    const t = dich(req.url);
    const p = http.request({ host: t.hostname, port: t.port, path: req.url, method: req.method, headers: { ...req.headers, host: `${t.hostname}:${t.port}` } }, (r) => {
      res.writeHead(r.statusCode || 502, r.headers);
      r.pipe(res);
    });
    p.on('error', () => { try { res.writeHead(502); res.end(); } catch { /* đã gửi */ } });
    req.pipe(p);
  });
  server.on('upgrade', (req, sock, head) => {
    const t = dich(req.url);
    const up = net.connect(Number(t.port), t.hostname, () => {
      const dong = [`${req.method} ${req.url} HTTP/${req.httpVersion}`];
      for (let i = 0; i < req.rawHeaders.length; i += 2) dong.push(`${req.rawHeaders[i]}: ${req.rawHeaders[i + 1]}`);
      up.write(`${dong.join('\r\n')}\r\n\r\n`);
      if (head?.length) up.write(head);
      sock.pipe(up).pipe(sock);
    });
    up.on('error', () => sock.destroy());
    sock.on('error', () => up.destroy());
  });
  return new Promise((ok) => server.listen(PROXY_PORT, () => ok(server)));
}

// ─── Tài khoản thử ──────────────────────────────────────────
const prisma = new PrismaClient();
const tag = `msg${Date.now().toString(36)}`;
const taoRa = [];

async function dangKy(ctx, ten) {
  const username = `${tag}_${ten}`;
  const email = `${username}@e2e.local`;
  const r = await ctx.request.post(`${BASE}/api/v1/auth/register`, {
    data: { username, email, password: PASSWORD, fullName: `E2E ${ten}` }, failOnStatusCode: false,
  });
  if (r.status() !== 201) throw new Error(`đăng ký ${ten}: ${r.status()} ${(await r.text()).slice(0, 200)}`);
  const u = await prisma.user.update({ where: { email }, data: { emailVerified: true, emailVerifiedAt: new Date() }, select: { id: true } });
  taoRa.push(u.id);
  await ctx.clearCookies();
  return { id: u.id, username, ten: `E2E ${ten}` };
}

async function dangNhap(page, u) {
  await page.goto(`${BASE}/login?callbackUrl=${encodeURIComponent('/messages')}`);
  for (let lan = 0; lan < 3; lan++) {
    await page.waitForLoadState('networkidle', { timeout: 60_000 }).catch(() => undefined);
    await page.getByPlaceholder('Enter your username').fill(u.username);
    await page.getByPlaceholder('Enter your password').fill(PASSWORD);
    await page.locator('form button[type="submit"]').click();
    try { await page.waitForURL((url) => !url.pathname.startsWith('/login'), { timeout: 40_000 }); return; } catch { /* thử lại */ }
  }
  throw new Error(`không đăng nhập được ${u.username}`);
}

async function goi(ctx, method, path, body) {
  const di = () => ctx.request.fetch(`${BASE}/api/v1${path}`, {
    method, data: body === undefined ? undefined : JSON.stringify(body),
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' }, failOnStatusCode: false,
  });
  let r = await di();
  // `next dev` thỉnh thoảng cắt kết nối keep-alive khi đang biên dịch ⇒ proxy trả 502. Thử lại MỘT lần.
  if (r.status() === 502) { await ngu(1000); r = await di(); }
  const j = await r.json().catch(() => ({}));
  if (r.status() >= 400) throw new Error(`${method} ${path}: ${r.status()} ${JSON.stringify(j).slice(0, 200)}`);
  return j.data;
}

// ─── Đo trên trang của B ────────────────────────────────────
/** Ô cuộn của khung chat: ưu tiên testid, lùi về ô `.chat-messages-scroll` CUỐI (ô đầu là danh sách hội thoại). */
const KHUNG = `(() => document.querySelector('[data-testid="message-scroll"]') || [...document.querySelectorAll('.chat-messages-scroll')].at(-1))()`;
const viTri = (page) => page.evaluate(`(() => { const el = ${KHUNG}; if (!el) return null;
  return { top: Math.round(el.scrollTop), cachDay: Math.round(el.scrollHeight - el.scrollTop - el.clientHeight), cao: el.scrollHeight }; })()`);
/** Chữ của cột danh sách hội thoại (ô cuộn đầu tiên). */
const chuDanhSach = (page) => page.evaluate(`(() => { const el = document.querySelector('[data-testid="thread-list"]') || document.querySelector('.chat-messages-scroll'); return el ? el.innerText : ''; })()`);

async function choDen(fn, tranMs, nhan) {
  const t0 = Date.now();
  for (;;) {
    if (await fn()) return Date.now() - t0;
    if (Date.now() - t0 > tranMs) throw new Error(`QUÁ ${tranMs} ms: ${nhan}`);
    await ngu(50);
  }
}

const ketQua = [];
const loiB = [];
function dat(ten, ok, chiTiet) {
  ketQua.push({ ten, ok, chiTiet });
  console.log(`${ok ? '✓' : '✗'} ${ten}${chiTiet ? ` — ${chiTiet}` : ''}`);
}

async function main() {
  const proxy = await dungProxy();
  const browser = await chromium.launch({ headless: !HEADED });
  const mo = async () => {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, bypassCSP: true });
    ctx.setDefaultTimeout(45_000);
    ctx.setDefaultNavigationTimeout(90_000);
    return ctx;
  };
  try {
    const ctxA = await mo(); const ctxB = await mo(); const ctxC = await mo();
    const A = await dangKy(ctxA, 'alice'); const B = await dangKy(ctxB, 'bob'); const C = await dangKy(ctxC, 'carol');
    const pageA = await ctxA.newPage(); const pageB = await ctxB.newPage(); const pageC = await ctxC.newPage();
    loiB.length = 0;
    // Bỏ qua tiếng ồn không thuộc messenger: lỗi mạng do chính phép kiểm ngắt mạng (bước 5), và
    // khung YouTube nhúng của trang khác trong cây (iframe bên thứ ba).
    const ON = /A network error occurred|writeEmbed|youtube\.com/i;
    pageB.on('pageerror', (e) => ON.test(`${e.message} ${e.stack}`) || loiB.push(`${e.message}\n${(e.stack || '').split('\n').slice(0, 6).join('\n')}`));
    pageB.on('console', (m) => { if (m.type() === 'error' && /removeChild|insertBefore|Uncaught|Minified React/.test(m.text())) loiB.push(m.text().slice(0, 600)); });
    await dangNhap(pageA, A); await dangNhap(pageB, B); await dangNhap(pageC, C);

    // Lịch sử: A↔B 30 tin xen ảnh tải chậm (dài hơn một màn hình), C↔B một tin MỚI HƠN để hàng C đứng đầu lúc đầu.
    const tAB = await goi(ctxA, 'POST', `/messages/threads/user/${B.id}`);
    for (let i = 1; i <= 30; i++) {
      if (i % 6 === 0) await goi(ctxA, 'POST', `/messages/threads/${tAB.id}/messages`, { media: { url: `${BASE}/__anh-cham/${i}.svg`, kind: 'gif' } });
      else await goi(i % 2 ? ctxA : ctxB, 'POST', `/messages/threads/${tAB.id}/messages`, { content: `lịch sử ${i} — ${'chữ '.repeat(i % 5 * 6)}` });
    }
    await goi(ctxA, 'POST', `/messages/threads/${tAB.id}/messages`, { media: { url: `${BASE}/__anh-cham/99.svg`, kind: 'gif' } });
    const tCB = await goi(ctxC, 'POST', `/messages/threads/user/${B.id}`);
    await goi(ctxC, 'POST', `/messages/threads/${tCB.id}/messages`, { content: 'chào bob, mình là carol' });

    // ── 1. Danh sách của B đổi ngay khi A nhắn ──
    await pageB.goto(`${BASE}/messages`);
    await pageB.getByText(C.ten).first().waitFor();
    await pageB.waitForFunction(() => /Đang hoạt động/.test(document.body.innerText), null, { timeout: 30_000 }).catch(() => undefined);
    await ngu(800);
    const ds0 = await chuDanhSach(pageB);
    dat('trước khi A nhắn: hàng Carol đứng trên hàng Alice', ds0.indexOf(C.ten) >= 0 && ds0.indexOf(C.ten) < ds0.indexOf(A.ten));
    if (SHOTS) await pageB.screenshot({ path: `${SHOTS}/realtime-1-truoc.png` });
    const ping1 = `ping-1 ${tag}`;
    const t1 = Date.now();
    await goi(ctxA, 'POST', `/messages/threads/${tAB.id}/messages`, { content: ping1 });
    // Đo TỪ LÚC máy chủ trả lời POST (tin đã lưu + đã phát socket). Thời gian của chính POST trên
    // `next dev` (biên dịch nóng, proxy) không phải độ trễ realtime.
    try {
      const ms = await choDen(async () => (await chuDanhSach(pageB)).includes(ping1), TRAN_MS, 'chữ xem trước của hàng Alice');
      dat('danh sách B: chữ xem trước đổi', true, `${ms} ms sau khi POST trả về (cả POST: ${Date.now() - t1} ms)`);
    } catch (e) { dat('danh sách B: chữ xem trước đổi', false, e.message); }
    const ds1 = await chuDanhSach(pageB);
    dat('danh sách B: hàng Alice nhảy lên trên hàng Carol', ds1.indexOf(A.ten) >= 0 && ds1.indexOf(A.ten) < ds1.indexOf(C.ten));
    if (SHOTS) await pageB.screenshot({ path: `${SHOTS}/realtime-2-ds-doi.png` });

    // ── 2. Mở hội thoại ⇒ ĐÁY, kể cả sau khi ảnh chậm tải xong ──
    await pageB.getByText(A.ten).first().click();
    await pageB.getByText(ping1).last().waitFor();
    await ngu(2500); // ảnh tải chậm 1,2 s + hiệu ứng
    const v2 = await viTri(pageB);
    dat('mở hội thoại: nằm ở đáy sau khi ảnh tải xong', !!v2 && v2.cachDay <= 4, JSON.stringify(v2));
    if (SHOTS) await pageB.screenshot({ path: `${SHOTS}/realtime-3-mo-chat.png` });

    // ── 3. Tin mới lúc đang ở đáy ⇒ hiện ngay + vẫn đáy ──
    const ping2 = `ping-2 ${tag}`;
    await goi(ctxA, 'POST', `/messages/threads/${tAB.id}/messages`, { content: ping2 });
    try {
      const ms = await choDen(async () => (await pageB.locator('[data-testid="message-scroll"], .chat-messages-scroll >> nth=-1').getByText(ping2).count()) > 0, TRAN_MS, 'tin ping-2 trong khung chat');
      dat('khung chat B: tin mới hiện', true, `${ms} ms sau khi POST trả về`);
    } catch (e) { dat('khung chat B: tin mới hiện', false, e.message); }
    await ngu(700);
    const v3 = await viTri(pageB);
    dat('khung chat B: vẫn dính đáy sau tin mới', !!v3 && v3.cachDay <= 4, JSON.stringify(v3));
    // Tin mới là ẢNH (cao hơn ngưỡng "gần đáy" cũ 120 px)
    await goi(ctxA, 'POST', `/messages/threads/${tAB.id}/messages`, { media: { url: `${BASE}/__anh-cham/77.svg`, kind: 'gif' } });
    await ngu(2600);
    const v3b = await viTri(pageB);
    dat('khung chat B: tin ẢNH mới (cao) vẫn dính đáy', !!v3b && v3b.cachDay <= 4, JSON.stringify(v3b));

    // ── 4. Đang đọc tin cũ ⇒ không giật, có nút "tin mới" ──
    await pageB.evaluate(`(() => { const el = ${KHUNG}; el.scrollTop = 0; el.dispatchEvent(new Event('scroll')); })()`);
    await pageB.mouse.move(900, 300); await pageB.mouse.wheel(0, -2000);
    await ngu(400);
    const ping3 = `ping-3 ${tag}`;
    await goi(ctxA, 'POST', `/messages/threads/${tAB.id}/messages`, { content: ping3 });
    await ngu(1200);
    const v4 = await viTri(pageB);
    dat('đang đọc tin cũ: KHÔNG bị kéo xuống', !!v4 && v4.top < 50, JSON.stringify(v4));
    const coNut = await pageB.locator('[data-testid="new-message-pill"]').count();
    dat('đang đọc tin cũ: hiện nút "tin mới ↓"', coNut > 0);
    if (SHOTS) await pageB.screenshot({ path: `${SHOTS}/realtime-4-nut-tin-moi.png` });
    if (coNut > 0) {
      await pageB.locator('[data-testid="new-message-pill"]').click();
      await ngu(900);
      const v5 = await viTri(pageB);
      dat('bấm nút "tin mới" ⇒ về đáy', !!v5 && v5.cachDay <= 4, JSON.stringify(v5));
    }

    // ── 5. Socket đứt rồi nối lại ⇒ tin trong lúc đứt vẫn tới ──
    await ctxB.setOffline(true);
    await ngu(1500);
    const ping4 = `ping-4 ${tag}`;
    await goi(ctxC, 'POST', `/messages/threads/${tCB.id}/messages`, { content: ping4 });
    await ngu(500);
    await ctxB.setOffline(false);
    try {
      const ms = await choDen(async () => (await chuDanhSach(pageB)).includes(ping4), 15_000, 'tin gửi lúc đứt mạng hiện trong danh sách sau khi nối lại');
      dat('sau khi socket nối lại: danh sách bắt kịp tin lúc đứt', true, `${ms} ms sau khi có mạng`);
    } catch (e) { dat('sau khi socket nối lại: danh sách bắt kịp tin lúc đứt', false, e.message); }
    if (SHOTS) await pageB.screenshot({ path: `${SHOTS}/realtime-5-noi-lai.png` });
    // ── 6. Giao diện: cụm tin, thanh công cụ, cảm xúc, trình xem ảnh, chấm trạng thái ──
    await pageB.locator('[data-testid="new-message-pill"], [data-testid="jump-bottom"]').first().click({ timeout: 2000 }).catch(() => undefined);
    for (const t of ['ngắn', `một tin dài hơn hẳn để bong bóng rộng ra ${'chữ '.repeat(14)}`, 'vừa']) {
      await goi(ctxA, 'POST', `/messages/threads/${tAB.id}/messages`, { content: `cụm ${t}` });
    }
    await pageB.locator('[data-testid="message-scroll"]').getByText('cụm vừa').waitFor();
    await ngu(600);
    const cum = await pageB.evaluate(() => {
      const g = [...document.querySelectorAll('[data-testid="message-group"]')].at(-1);
      const rows = g ? [...g.querySelectorAll('[data-testid="message-row"]')] : [];
      // MỌI bong bóng TIN ĐẾN trong cả khung (hàng có rãnh ảnh đại diện), không chỉ cụm cuối.
      const den = [...document.querySelectorAll('[data-testid="message-row"]')]
        .filter((r) => r.querySelector('[data-testid^="avatar-slot"]'))
        .map((r) => r.querySelector('[data-testid="bubble"]'))
        .filter(Boolean)
        .map((b) => Math.round(b.getBoundingClientRect().left));
      return {
        n: rows.length,
        left: [...new Set(den)],
        avatar: g ? g.querySelectorAll('[data-testid="avatar-slot-filled"]').length : -1,
        avatarOCuoi: !!rows.at(-1)?.querySelector('[data-testid="avatar-slot-filled"]'),
      };
    });
    dat('mọi bong bóng tin ĐẾN cùng một mép trái (không thụt ra thụt vào)', cum.left.length === 1, JSON.stringify(cum));
    dat('3 tin liên tiếp của A gộp chung cụm cuối', cum.n >= 3);
    dat('cụm: đúng MỘT ảnh đại diện, ở tin CUỐI', cum.avatar === 1 && cum.avatarOCuoi);
    dat('không còn nút "+" dưới mỗi tin', (await pageB.locator('[aria-label="Thêm reaction"]').count()) === 0);
    const hang = pageB.locator('[data-testid="message-row"]').filter({ hasText: 'cụm vừa' }).last();
    const bong = hang.locator('[data-testid="bubble"]');
    const b0 = await bong.boundingBox();
    await bong.hover();
    await ngu(250);
    const hienThanh = await hang.locator('[data-testid="message-toolbar"]').evaluate((el) => getComputedStyle(el).opacity === '1');
    const b1 = await bong.boundingBox();
    dat('rê chuột: hiện thanh 😊 ↩ ⋮ và bong bóng KHÔNG xê dịch', hienThanh && b0.x === b1.x && b0.y === b1.y, `${JSON.stringify(b0)} → ${JSON.stringify(b1)}`);
    await hang.getByLabel('Thả cảm xúc').click();
    await pageB.getByLabel('Thả ❤️').click();
    try {
      await choDen(async () => (await hang.locator('[data-testid="reaction-chip"]').count()) > 0, 4000, 'viên cảm xúc');
      dat('thả ❤️ ⇒ viên cảm xúc đè góc bong bóng', true);
    } catch (e) { dat('thả ❤️ ⇒ viên cảm xúc đè góc bong bóng', false, e.message); }
    await ngu(400);
    if (SHOTS) await pageB.screenshot({ path: `${SHOTS}/ui-1-cum-va-cam-xuc.png` });
    await bong.hover();
    await hang.getByLabel('Tuỳ chọn tin nhắn').click();
    const menu = pageB.getByRole('dialog', { name: 'Tuỳ chọn tin nhắn' });
    await menu.waitFor();
    const chuMenu = await menu.innerText();
    dat('menu ⋮ có Trả lời · Chuyển tiếp · Sao chép · Báo cáo', ['Trả lời', 'Chuyển tiếp', 'Sao chép', 'Báo cáo'].every((x) => chuMenu.includes(x)), chuMenu.replace(/\s+/g, ' '));
    if (SHOTS) await pageB.screenshot({ path: `${SHOTS}/ui-2-menu.png` });
    await pageB.keyboard.press('Escape');
    const soTabTruoc = ctxB.pages().length;
    await pageB.locator('[data-testid="message-image"]').last().click();
    const hop = pageB.locator('[data-testid="image-lightbox"]');
    await hop.waitFor();
    await ngu(1500);
    if (SHOTS) await pageB.screenshot({ path: `${SHOTS}/ui-3-trinh-xem-anh.png` });
    const dem1 = (await hop.innerText()).match(/\d+ \/ \d+/)?.[0];
    await pageB.keyboard.press('ArrowLeft');
    await ngu(200);
    const dem2 = (await hop.innerText()).match(/\d+ \/ \d+/)?.[0];
    dat('bấm ảnh ⇒ trình xem ảnh TRONG trang (không tab mới), ← đổi ảnh', ctxB.pages().length === soTabTruoc && !!dem1 && dem1 !== dem2, `${dem1} → ${dem2}`);
    await pageB.keyboard.press('Escape');
    await ngu(200);
    dat('Esc đóng trình xem ảnh', (await hop.count()) === 0);
    dat('không còn chấm xám / huy hiệu vàng cạnh ảnh đại diện', (await pageB.locator('.bg-zinc-500').count()) === 0);

    // ── 7. MỘT hội thoại với admin: "Hỗ trợ từ Admin" và nhắn từ trang cá nhân ra CÙNG hội thoại ──
    const vaiAdmin = await prisma.role.findFirst({ where: { name: 'admin' } });
    if (vaiAdmin) {
      // C làm admin DUY NHẤT của CSDL thử ⇒ `findFirstAdminUserId` trả C.
      const adminKhac = await prisma.userRole.count({ where: { roleId: vaiAdmin.id, NOT: { userId: C.id } } });
      if (adminKhac === 0) {
        await prisma.userRole.create({ data: { userId: C.id, roleId: vaiAdmin.id } });
        const hoTro = await goi(ctxA, 'POST', '/messages/threads/admin');
        const nhanThang = await goi(ctxA, 'POST', `/messages/threads/user/${C.id}`);
        dat('A: "Hỗ trợ từ Admin" rồi nhắn thẳng admin ⇒ CÙNG một hội thoại', hoTro.id === nhanThang.id, `${hoTro.id} / ${nhanThang.id}`);
        // B làm ngược thứ tự: B và C đã có hội thoại USER (tCB) ⇒ hỗ trợ phải mở lại đúng nó.
        const hoTroB = await goi(ctxB, 'POST', '/messages/threads/admin');
        dat('B đã nhắn admin trước ⇒ "Hỗ trợ từ Admin" mở lại ĐÚNG hội thoại đó', hoTroB.id === tCB.id, `${hoTroB.id} / ${tCB.id}`);
      } else {
        dat('(bỏ qua kiểm hội thoại admin — CSDL thử đã có admin khác)', true);
      }
    }

    dat('trang của B không có lỗi runtime nào', loiB.length === 0, loiB.length ? `${loiB.length} lỗi:\n${loiB.slice(0, 3).join('\n---\n')}` : '');
    await pageA.close(); await pageC.close();
  } catch (e) {
    dat('kịch bản chạy hết', false, String(e?.message || e).split('\n')[0]);
    if (loiB.length) console.log(`lỗi runtime trên trang B:\n${loiB.slice(0, 3).join('\n---\n')}`);
  } finally {
    await browser.close().catch(() => undefined);
    proxy.close();
    if (taoRa.length) {
      const threads = await prisma.messageThread.findMany({
        where: { OR: [{ userAId: { in: taoRa } }, { userBId: { in: taoRa } }, { userId: { in: taoRa } }] }, select: { id: true },
      });
      await prisma.messageThread.deleteMany({ where: { id: { in: threads.map((t) => t.id) } } });
      await prisma.socialNotification.deleteMany({ where: { OR: [{ receiverId: { in: taoRa } }, { senderId: { in: taoRa } }] } }).catch(() => undefined);
      await prisma.user.deleteMany({ where: { id: { in: taoRa } } });
    }
    await prisma.$disconnect();
  }
  const hong = ketQua.filter((k) => !k.ok);
  console.log(`\n${ketQua.length - hong.length}/${ketQua.length} đạt`);
  process.exit(hong.length ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(2); });
