/**
 * Hồi quy NHÁY của phòng CuongMini (19/10/2026) — robot 3D không được mất khung hình.
 *
 * Nguyên nhân gốc đã đo: `renderer.setSize()` xoá trắng bộ đệm WebGL; ResizeObserver chạy SAU
 * requestAnimationFrame nên khung đó lên màn hình với canvas TRỐNG (prod trước sửa: 12 lần đổi
 * cỡ ⇒ 8–9 khung mất robot). Spec này:
 *   1. di chuột 200 lần ⇒ đúng 1 canvas, 1 WebGL context, KHÔNG có thay đổi DOM nào;
 *   2. ép vùng sân khấu đổi cỡ 12 lần ⇒ 0 khung hình mà vùng giữa robot rơi về màu nền.
 *
 * Chạy (cần một server đang phục vụ trang khoá học, vd. `next dev`):
 *   KIEM_URL=http://localhost:3000/language/ja/dekiru npx tsx --test frontend/e2e/cuongmini/nhay.spec.ts
 * Không đặt KIEM_URL ⇒ bỏ qua (không chạy trong `npm test`).
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createRequire } from 'node:module';
import { chromium, type Page } from 'playwright';

const URL = process.env.KIEM_URL;
const req = createRequire(import.meta.url);

async function moPhong(page: Page) {
  await page.addInitScript(() => {
    const w = window as unknown as { __do: { ctx: number; mount: number; mut: number } };
    w.__do = { ctx: 0, mount: 0, mut: 0 };
    const og = HTMLCanvasElement.prototype.getContext;
    // @ts-expect-error — bọc để đếm số WebGL context được tạo
    HTMLCanvasElement.prototype.getContext = function (t: string, ...a: unknown[]) {
      if (/webgl/.test(t) && !(this as unknown as { __d?: 1 }).__d) { (this as unknown as { __d?: 1 }).__d = 1; w.__do.ctx++; }
      // @ts-expect-error — chuyển tiếp nguyên tham số
      return og.call(this, t, ...a);
    };
    new MutationObserver((ms) => {
      for (const m of ms) { w.__do.mut++; for (const n of m.addedNodes) if (n.nodeName === 'CANVAS' || (n as Element).querySelector?.('canvas')) w.__do.mount++; }
    }).observe(document, { subtree: true, childList: true, attributes: true, characterData: true });
  });
  await page.goto(URL!, { waitUntil: 'load', timeout: 240_000 });
  await page.locator('button[title^="Gọi CuongMini"]:visible').first().click({ timeout: 120_000 });
  await page.waitForSelector('canvas[class*="goiNhanVat"]', { state: 'attached', timeout: 120_000 });
  await page.waitForTimeout(3000);
}

test('CuongMini 3D: di chuột không dựng lại canvas, đổi cỡ không mất khung hình', { skip: !URL, timeout: 10 * 60_000 }, async () => {
  const sharp = req('sharp') as typeof import('sharp');
  const browser = await chromium.launch({ channel: 'chromium' }); // headless mới: GPU thật (ANGLE Metal trên macOS)
  try {
    const page = await browser.newPage({ viewport: { width: 1400, height: 820 } });
    await moPhong(page);
    const doc = () => page.evaluate(() => ({ ...(window as unknown as { __do: { ctx: number; mount: number; mut: number } }).__do }));
    const a = await doc();
    await page.evaluate(() => { (window as unknown as { __do: { mut: number } }).__do.mut = 0; });
    for (let i = 0; i < 200; i++) { await page.mouse.move(150 + (i * 37) % 1100, 120 + (i * 53) % 640); await page.waitForTimeout(15); }
    const b = await doc();
    assert.equal(b.ctx, 1, 'chỉ một WebGL context');
    assert.equal(b.mount, a.mount, 'di chuột không gắn lại canvas');
    assert.equal(b.mut, 0, 'di chuột không đổi DOM');

    const cdp = await page.context().newCDPSession(page);
    const khung: string[] = [];
    cdp.on('Page.screencastFrame', (f: { data: string; sessionId: number }) => { khung.push(f.data); void cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }).catch(() => {}); });
    await cdp.send('Page.startScreencast', { format: 'png', everyNthFrame: 1 });
    for (let i = 0; i < 12; i++) {
      await page.evaluate((on) => {
        const f = document.querySelector('footer[class*="goiDay"]')!;
        let d = document.getElementById('__gia');
        if (on && !d) { d = document.createElement('div'); d.id = '__gia'; d.style.cssText = 'grid-column:1/-1;height:30px'; f.appendChild(d); } else if (!on) d?.remove();
      }, i % 2 === 0);
      await page.waitForTimeout(250);
    }
    await cdp.send('Page.stopScreencast');
    const box = (await page.locator('canvas[class*="goiNhanVat"]').boundingBox())!;
    const vung = { left: Math.round(box.x + box.width * 0.35), top: Math.round(box.y + box.height * 0.3), width: Math.round(box.width * 0.3), height: Math.round(box.height * 0.4) };
    const sang: number[] = [];
    for (const k of khung) {
      const cat = await sharp(Buffer.from(k, 'base64')).extract(vung).png().toBuffer();
      const st = await sharp(cat).stats();
      sang.push(st.channels.slice(0, 3).reduce((x, ch) => x + ch.mean, 0) / 3);
    }
    const tv = [...sang].sort((x, y) => x - y)[sang.length >> 1]!;
    const mat = sang.filter((v) => tv - v > 25).length;
    assert.ok(khung.length > 20, `chụp được ${khung.length} khung`);
    assert.equal(mat, 0, `khung hình mất robot: ${mat}/${khung.length} (độ sáng trung vị ${tv.toFixed(1)}, thấp nhất ${Math.min(...sang).toFixed(1)})`);
  } finally {
    await browser.close();
  }
});
