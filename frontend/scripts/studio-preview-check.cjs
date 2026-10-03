const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const errors = [];
  try {
    for (const width of [1440, 390]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 }, deviceScaleFactor: 1 });
      page.on('pageerror', error => errors.push(`${width}: ${error.message}`));
      await page.goto('http://localhost:3100/about/studio', { waitUntil: 'networkidle' });
      await page.screenshot({ path: `scratch/studio-${width}.png`, fullPage: true });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
      if (overflow) throw new Error(`Studio overflows at ${width}`);
      await page.locator('a[href="#studio-work"]').first().click();
      if (!(await page.locator('#studio-work').count())) throw new Error('Missing work anchor');
      await page.goto('http://localhost:3100/about/quy-trinh', { waitUntil: 'networkidle' });
      const lastPhase = page.locator('button[aria-controls="phase-content"]').last();
      await lastPhase.click();
      if (await lastPhase.getAttribute('aria-pressed') !== 'true') throw new Error('Phase selection failed');

      await page.locator('#phase-content h2').waitFor({ state: 'visible' });
      const ring = page.locator('[role="group"][aria-label*="rotate"], [role="group"][aria-label*="xoay"]').first();
      await ring.evaluate(el => { const details = el.closest('details'); if (details) details.open = true; });
      await ring.scrollIntoViewIfNeeded();
      await page.mouse.move(0, 0);
      await page.waitForTimeout(1000);
      const firstChip = ring.locator('button[aria-pressed]').first();
      const before = await firstChip.evaluate((el) => el.getBoundingClientRect().x);
      await page.waitForTimeout(900);
      const after = await firstChip.evaluate((el) => el.getBoundingClientRect().x);
      if (Math.abs(after - before) < 0.5) throw new Error('3D process ring is not moving');
      console.log(`PASS ${width}px: 3D ring moves ${Math.abs(after - before).toFixed(1)}px`);
      await page.screenshot({ path: `scratch/cinema-${width}.png` });
      await page.getByRole('button', { name: /Next stage|Giai đoạn sau/ }).click();
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.screenshot({ path: `scratch/process-${width}.png`, fullPage: true });
      if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) throw new Error(`Process overflows at ${width}`);
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await page.goto('http://localhost:3100/about/nhan-du-an', { waitUntil: 'networkidle' });
      const service = page.locator('section article').first();
      await service.scrollIntoViewIfNeeded();
      await page.waitForFunction(() => [...document.querySelectorAll('section article')].some(el => el.getAnimations().length > 0));
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.waitForFunction(() => [...document.querySelectorAll('section article')].every(el => el.getAnimations().length === 0));
      await page.screenshot({ path: `scratch/intake-${width}.png`, fullPage: true });
      console.log(`PASS ${width}px: scroll reveal runs, reduced motion cancels animation`);
      if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) throw new Error(`Intake overflows at ${width}`);
      await page.locator('a[href="#gui-yeu-cau"]').first().click();
      if (!(await page.locator('#gui-yeu-cau').count())) throw new Error('Missing request form anchor');
      console.log(`PASS ${width}px: studio anchor, process phase selection, intake form anchor, no horizontal overflow`);
      await page.close();
    }
    if (errors.length) throw new Error(errors.join('\n'));
    console.log('PASS: no uncaught browser exceptions');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
