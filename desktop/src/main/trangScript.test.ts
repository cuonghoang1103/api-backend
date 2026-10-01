/**
 * Chạy đoạn script của `trangScript.ts` trên CHROMIUM THẬT (Playwright).
 *
 * Trang mẫu dựng đúng kiểu khiến bản cũ mù: trang KHÔNG cuộn, nội dung nằm
 * trong một khung `overflow:auto` (khung xem slide / trang tài liệu), có ảnh
 * <img> lẫn ảnh nền CSS, có icon tí hon phải bị bỏ.
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { chromium, type Browser, type Page } from 'playwright';
import { MA_LIET_KE_ANH, maCuonTrang } from './trangScript';

interface Cuon { ok: boolean; y: number; cao: number; tong: number; trongKhung: boolean }
const cuon = (h: Parameters<typeof maCuonTrang>[0], den?: string): Promise<Cuon> => trang.evaluate(maCuonTrang(h, den)) as Promise<Cuon>;

const PNG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

let trinh: Browser | null = null;
let trang: Page;

beforeAll(async () => {
  try { trinh = await chromium.launch(); } catch { trinh = null; }
  if (!trinh) return;
  trang = await trinh.newPage({ viewport: { width: 1000, height: 700 } });
  // Ảnh "thật" phải là http(s) — chặn mạng, trả cùng một PNG cho mọi địa chỉ.
  await trang.route('https://anh.vi-du/**', (r) => r.fulfill({ contentType: 'image/png', body: Buffer.from(PNG.split(',')[1]!, 'base64') }));
  await trang.setContent(`<!doctype html><html><body style="margin:0;height:100vh;overflow:hidden">
    <aside style="position:fixed;left:0;top:0;width:200px;height:100vh;overflow:auto"><div style="height:3000px">menu</div></aside>
    <main id="khung" style="margin-left:200px;height:100vh;overflow-y:auto">
      <section id="slide-1" style="height:700px"><img src="https://anh.vi-du/slide1.png" alt="Slide 1: Hooks" width="800" height="450"></section>
      <section id="slide-2" style="height:700px"><img src="https://anh.vi-du/slide2.png" alt="Slide 2" width="800" height="450"></section>
      <section id="slide-3" style="height:700px;background-image:url('https://anh.vi-du/nen.png');background-size:cover"></section>
      <img src="https://anh.vi-du/icon.png" width="16" height="16" alt="icon">
    </main></body></html>`);
  await trang.waitForTimeout(200);
}, 60_000);

afterAll(async () => { await trinh?.close(); });

describe.runIf(process.env.CI !== 'true')('script trong trang — Chromium thật', () => {
  it('trang không cuộn ⇒ tìm ra khung cuộn LỚN NHẤT (không phải thanh menu) và cuộn nó', async () => {
    if (!trinh) return;
    const a = await cuon('xuong');
    expect(a).toMatchObject({ ok: true, trongKhung: true });
    expect(a.y).toBeGreaterThan(500);
    expect(await trang.evaluate('document.getElementById("khung").scrollTop')).toBe(a.y);
    const cuoi = await cuon('cuoi');
    expect(cuoi.y + cuoi.cao).toBeGreaterThanOrEqual(cuoi.tong - 4);
    const dau = await cuon('dau');
    expect(dau.y).toBe(0);
  });

  it('den = bộ chọn ⇒ cuộn phần tử đó vào màn; bộ chọn sai ⇒ báo lỗi', async () => {
    if (!trinh) return;
    await cuon(null, '#slide-3');
    const top = await trang.evaluate('document.getElementById("slide-3").getBoundingClientRect().top') as number;
    expect(Math.abs(top)).toBeLessThan(5);
    expect(await cuon(null, '#khong-co')).toMatchObject({ ok: false });
  });

  it('liệt kê ảnh: <img> + ảnh nền CSS, bỏ icon tí hon, có alt', async () => {
    if (!trinh) return;
    await cuon('dau');
    const ds = await trang.evaluate(MA_LIET_KE_ANH) as Array<{ src: string; alt: string; dangHien: boolean }>;
    const src = ds.map((a) => a.src);
    expect(src).toContain('https://anh.vi-du/slide1.png');
    expect(src).toContain('https://anh.vi-du/slide2.png');
    expect(src).toContain('https://anh.vi-du/nen.png');
    expect(src).not.toContain('https://anh.vi-du/icon.png');
    expect(ds.find((a) => a.src.endsWith('slide1.png'))).toMatchObject({ alt: 'Slide 1: Hooks', dangHien: true });
    expect(ds.find((a) => a.src.endsWith('slide2.png'))!.dangHien).toBe(false);
  });
});
