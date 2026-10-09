/**
 * E2E — làm nóng: `next dev` biên dịch mỗi trang ở lần mở ĐẦU TIÊN (30–90 s/trang trên máy lạnh), làm các spec sau
 * hết giờ chờ một cách ngẫu nhiên. Tệp này chạy trước (tên bắt đầu bằng 00-, chạy tuần tự) và mở sẵn các trang
 * mà bộ E2E dùng. Với `next start` (CI) nó xong trong vài giây.
 */
import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import type { Browser } from 'playwright';
import { cleanup, launch, newContext } from './helpers';

const PAGES = ['/login', '/register', '/work', '/work/x/X/board', '/work/x/X/tests', '/work/x/X/docs/1', '/work/x/X/portal', '/work/share/xxxxxxxxxxxxxxxxxxxxxxxx'];

describe('CT Work E2E — làm nóng trang', () => {
  let browser: Browser;
  before(async () => { browser = await launch(); });
  after(async () => { await browser?.close(); await cleanup(); });

  it('mở trước các trang của bộ E2E (biên dịch next dev)', { timeout: 15 * 60_000 }, async () => {
    const ctx = await newContext(browser);
    const page = await ctx.newPage();
    for (const p of PAGES) {
      const res = await page.goto(p, { timeout: 180_000, waitUntil: 'load' });
      // goto trả null khi trang tự điều hướng phía client — vẫn là đã biên dịch.
      assert.ok(!res || res.status() < 500, `${p} ⇒ ${res?.status()}`);
      await page.waitForLoadState('networkidle', { timeout: 120_000 }).catch(() => undefined);
    }
    await ctx.close();
  });
});
