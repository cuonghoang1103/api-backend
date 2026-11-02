// chay: tay — đo bằng Playwright: phím Tab thật với order, điện thoại giả lập (viewport), ba bề rộng màn hình. node content/courses/web-foundations/_demo/_t3/chay.mjs
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DEMO = path.resolve(HERE, '..');
const require = createRequire(path.resolve(HERE, '../../../../../package.json'));
const { chromium, devices } = require('playwright');
const OUT = path.join(HERE, 'out');
const ghi = (ten, s) => fs.writeFileSync(path.join(OUT, ten + '.out.txt'), s.replace(/\n+$/, '') + '\n');
const url = (rel) => 'file://' + path.join(DEMO, rel);

const trinh = await chromium.launch();

// 3.3 — order đổi thứ tự nhìn, không đổi thứ tự Tab
{
  const p = await trinh.newPage();
  await p.goto(url('3-3/thu-tu.html'));
  const nhin = await p.evaluate(() => [...document.querySelectorAll('a')].sort((a, b) => a.getBoundingClientRect().left - b.getBoundingClientRect().left).map((a) => a.id).join(' '));
  const tab = [];
  for (let i = 0; i < 3; i++) { await p.keyboard.press('Tab'); tab.push(await p.evaluate(() => document.activeElement.id)); }
  ghi('order-tab', `order on screen, left to right: ${nhin}\nTab order:                      ${tab.join(' ')}`);
  await p.close();
}

// 3.5 — điện thoại giả lập: có và không có thẻ viewport
{
  const dong = [];
  for (const [rel, ten] of [['3-5/khong-viewport.html', 'khong'], ['3-5/co-viewport.html', 'co']]) {
    const ctx = await trinh.newContext({ ...devices['iPhone 13'] });
    const p = await ctx.newPage();
    await p.goto(url(rel));
    const w = await p.evaluate(() => [innerWidth, screen.width, Math.round(document.querySelector('h1').getBoundingClientRect().width)]);
    dong.push(`${ten === 'co' ? 'with viewport tag   ' : 'without viewport tag'}: layout width ${w[0]}px on a ${w[1]}px-wide phone`);
    await p.screenshot({ path: path.join(DEMO, '3-5', ten + '-viewport-phone.png') });
    await ctx.close();
  }
  ghi('viewport', dong.join('\n'));
}

// 3.5 — cùng một trang ở ba bề rộng
{
  const dong = [];
  for (const [w, h, ten] of [[390, 520, 'dt'], [768, 420, 'tablet'], [1100, 320, 'laptop']]) {
    const p = await trinh.newPage({ viewport: { width: w, height: h } });
    await p.goto(url('3-5/mobile-first.html'));
    const r = await p.evaluate(() => {
      const c = getComputedStyle(document.querySelector('.cards')).gridTemplateColumns.split(' ').length;
      return { cot: c, aside: getComputedStyle(document.querySelector('aside')).display, m640: matchMedia('(min-width: 640px)').matches, m960: matchMedia('(min-width: 960px)').matches };
    });
    dong.push(`${String(w).padStart(4)}px: ${r.cot} column(s) · sidebar ${r.aside.padEnd(5)} · (min-width: 640px) ${String(r.m640).padEnd(5)} · (min-width: 960px) ${r.m960}`);
    await p.screenshot({ path: path.join(DEMO, '3-5', `mf-${ten}.png`) });
    await p.close();
  }
  ghi('mobile-first', dong.join('\n'));
}
await trinh.close();
console.log('xong');
