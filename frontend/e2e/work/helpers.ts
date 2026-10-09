/**
 * E2E CT Work (đợt 6a, D2) — tiện ích chung cho `frontend/e2e/work/*.spec.ts`.
 *
 * Chạy bằng node:test + thư viện `playwright` (đã có ở package.json gốc) — KHÔNG cần @playwright/test.
 * Cần một stack CỤC BỘ đang chạy: backend (`RATE_LIMIT_MAX=1000000 PORT=… npx tsx src/index.ts` — bộ đếm
 * rate-limit nằm chung Redis theo IP 127.0.0.1, chạy vài lượt E2E là chạm trần 2000/15 phút ⇒ 429) + frontend
 * (`next dev`) trỏ vào nhau, và Postgres cục bộ (đăng ký cần đánh dấu email đã xác thực — thay hộp thư).
 *
 *   E2E_BASE_URL=http://localhost:3000 npm run test:e2e:work
 *
 * KHÔNG trỏ vào production: các spec tạo tài khoản/không gian thật rồi xoá theo id đã ghi lại.
 */
import { createHash } from 'node:crypto';
import { chromium, type Browser, type BrowserContext, type Page, type APIResponse } from 'playwright';
import { PrismaClient } from '@prisma/client';

export const BASE = (process.env.E2E_BASE_URL || 'http://localhost:3000').replace(/\/+$/, '');
export const HEADED = process.env.E2E_HEADED === '1';
export const SHOTS = process.env.E2E_SHOTS_DIR || '';
// Mili-giây + số ngẫu nhiên: node --test chạy mỗi tệp spec trong một tiến trình riêng, hai tiến trình khởi động cùng
// mili-giây từng sinh trùng tag ⇒ trùng slug không gian ⇒ 409 "workspace URL is taken" (QA 10/10, P2-1c).
export const tag = `e2e${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
export const PASSWORD = 'E2e-Test-Pass-2026!';

const host = new URL(BASE).hostname;
if (!['localhost', '127.0.0.1', '::1'].includes(host) && process.env.E2E_ALLOW_REMOTE !== '1') {
  throw new Error(`E2E chỉ chạy với stack cục bộ — E2E_BASE_URL đang là ${BASE}`);
}

let db: PrismaClient | null = null;
export function prisma(): PrismaClient {
  db ??= new PrismaClient();
  return db;
}

const createdUsers: number[] = [];
const createdWorkspaces: number[] = [];
export function trackWorkspace(id: number) { createdWorkspaces.push(id); }
export function trackUser(id: number) { createdUsers.push(id); }

export async function launch(): Promise<Browser> {
  return chromium.launch({ headless: !HEADED });
}

export async function newContext(browser: Browser): Promise<BrowserContext> {
  // E2E_BYPASS_CSP=1: bản build production chạy local nối WebSocket thẳng cổng backend (localhost:31xx) — CSP thật chỉ mở
  // wss://cuongthai.com (cùng gốc qua nginx). Chỉ để thử local; production không cần.
  const ctx = await browser.newContext({ baseURL: BASE, viewport: { width: 1440, height: 900 }, acceptDownloads: true, bypassCSP: process.env.E2E_BYPASS_CSP === '1' });
  ctx.setDefaultTimeout(45_000);
  ctx.setDefaultNavigationTimeout(90_000); // next dev biên dịch trang lần đầu khá lâu
  return ctx;
}

export async function shot(page: Page, name: string) {
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/${name}.png`, fullPage: false }).catch(() => undefined);
}

/** Gọi API qua proxy Next (/api/v1/**) bằng cookie của context — cùng đường trình duyệt đi. */
export async function api<T = any>(ctx: BrowserContext, method: string, path: string, body?: unknown): Promise<{ status: number; data: T; raw: any }> {
  const go = () => ctx.request.fetch(`${BASE}/api/v1${path}`, {
    method,
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    data: body === undefined ? undefined : JSON.stringify(body),
    failOnStatusCode: false,
  });
  let res: APIResponse;
  try {
    res = await go();
  } catch (err) {
    // `next dev` thỉnh thoảng cắt kết nối keep-alive (ECONNRESET) khi đang biên dịch trang khác — thử lại MỘT lần.
    if (!/ECONNRESET|socket hang up/i.test(String((err as Error).message))) throw err;
    await new Promise((r) => setTimeout(r, 1000));
    res = await go();
  }
  const raw = await res.json().catch(() => ({}));
  return { status: res.status(), data: raw?.data as T, raw };
}

export interface E2EUser { id: number; username: string; email: string }

/** Đăng ký qua API, đánh dấu email đã xác thực trong CSDL cục bộ (thay bước mở hộp thư). */
export async function registerUser(ctx: BrowserContext, name: string): Promise<E2EUser> {
  const username = `${tag}_${name}`.slice(0, 50);
  const email = `${username}@e2e.local`;
  const r = await api(ctx, 'POST', '/auth/register', { username, email, password: PASSWORD, fullName: `E2E ${name}` });
  if (r.status !== 201) throw new Error(`register ${name}: ${r.status} ${JSON.stringify(r.raw).slice(0, 300)}`);
  // Đặt sẵn `work.locale = en` (i18n GĐ1): không có nó, hộp "Tiếng Việt hay English?" lần đầu phủ toàn trang
  // (`fixed inset-0`) và chặn mọi click của spec (QA 10/10, P2-1a). Các spec khớp nhãn tiếng Anh.
  const u = await prisma().user.update({ where: { email }, data: { emailVerified: true, emailVerifiedAt: new Date(), preferences: { work: { locale: 'en' } } }, select: { id: true } });
  createdUsers.push(u.id);
  await ctx.clearCookies();
  return { id: u.id, username, email };
}

/** Đăng nhập bằng FORM thật ở /login, chờ rời trang đăng nhập. */
export async function loginUi(page: Page, u: E2EUser, next = '/work') {
  await page.goto(`/login?callbackUrl=${encodeURIComponent(next)}`);
  // `next dev` lạnh: gõ + bấm trước khi React gắn xong ⇒ form gửi kiểu HTML thuần (tải lại /login), chữ mất.
  // Chờ mạng yên rồi mới gõ, và nếu vẫn kẹt ở /login thì gõ + bấm lại (tối đa 3 lượt).
  for (let attempt = 0; attempt < 3; attempt++) {
    await page.waitForLoadState('networkidle', { timeout: 60_000 }).catch(() => undefined);
    await page.getByPlaceholder('Enter your username').fill(u.username);
    await page.getByPlaceholder('Enter your password').fill(PASSWORD);
    await page.locator('form button[type="submit"]').click();
    try {
      await page.waitForURL((url) => !url.pathname.startsWith('/login'), { timeout: 40_000 });
      return;
    } catch { /* thử lại */ }
  }
  throw new Error(`Không đăng nhập được ${u.username} qua form /login`);
}

/** Tạo nhanh một người dùng đã đăng nhập (context riêng). */
export async function userSession(browser: Browser, name: string) {
  const ctx = await newContext(browser);
  const user = await registerUser(ctx, name);
  const page = await ctx.newPage();
  // Lưới đỡ thứ hai: nếu hộp chọn ngôn ngữ lần đầu vẫn hiện (vd người dùng không tạo qua registerUser) thì chọn English.
  await page.addLocatorHandler(page.locator('[role="dialog"] button[lang="en"]'), async (b) => { await b.click(); });
  await loginUi(page, user);
  return { ctx, page, user };
}

/** Không gian mới của `ctx` (qua API — đường tạo không gian bằng giao diện có spec riêng). */
export async function createWorkspace(ctx: BrowserContext, name = `E2E ${tag}`) {
  const ws = await api<{ id: number; slug: string }>(ctx, 'POST', '/work/workspaces', { name });
  if (ws.status !== 201) throw new Error(`workspace: ${ws.status} ${JSON.stringify(ws.raw).slice(0, 300)}`);
  trackWorkspace(ws.data.id);
  return ws.data;
}

/** PNG thật 24×24 một màu — đủ để sharp ở backend nhận là ảnh. Màu khác ⇒ byte khác (backend gộp ảnh trùng nội dung). */
export function tinyPng(rgb: [number, number, number] = [40, 120, 200]): Buffer {
  // Dựng tay: IHDR + IDAT (zlib store) + IEND. Không phụ thuộc sharp trong frontend.
  const w = 24, h = 24;
  const rows = Buffer.alloc((w * 3 + 1) * h);
  for (let y = 0; y < h; y++) {
    rows[y * (w * 3 + 1)] = 0;
    for (let x = 0; x < w; x++) rows.set(rgb, y * (w * 3 + 1) + 1 + x * 3);
  }
  const crcTable = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
  const crc = (b: Buffer) => { let c = 0xffffffff; for (const x of b) c = crcTable[(c ^ x) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  const chunk = (type: string, data: Buffer) => {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
    const c = Buffer.alloc(4); c.writeUInt32BE(crc(td));
    return Buffer.concat([len, td, c]);
  };
  const adler = (b: Buffer) => { let a = 1, s = 0; for (const x of b) { a = (a + x) % 65521; s = (s + a) % 65521; } return ((s << 16) | a) >>> 0; };
  const store = Buffer.concat([Buffer.from([0x78, 0x01, 0x01]), Buffer.from([rows.length & 0xff, rows.length >> 8, ~rows.length & 0xff, (~rows.length >> 8) & 0xff]), rows, (() => { const a = Buffer.alloc(4); a.writeUInt32BE(adler(rows)); return a; })()]);
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr.set([8, 2, 0, 0, 0], 8);
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), chunk('IHDR', ihdr), chunk('IDAT', store), chunk('IEND', Buffer.alloc(0))]);
}

export const sha = (b: Buffer) => createHash('sha256').update(b).digest('hex').slice(0, 12);

/** Dọn theo id đã ghi lại (không bao giờ xoá theo mẫu tên). */
export async function cleanup() {
  const p = prisma();
  if (createdWorkspaces.length) await p.workSpace.deleteMany({ where: { id: { in: createdWorkspaces } } });
  if (createdUsers.length) {
    await p.socialNotification.deleteMany({ where: { OR: [{ receiverId: { in: createdUsers } }, { senderId: { in: createdUsers } }] } });
    await p.workEmailQueue.deleteMany({ where: { userId: { in: createdUsers } } });
    await p.user.deleteMany({ where: { id: { in: createdUsers } } });
  }
  await p.$disconnect();
  db = null;
}
