/**
 * 1) Thử chụp blog-2: /blog không có thẻ <a> tới bài, phải CLICK vào thẻ bài.
 * 2) Ghép mọi ảnh trong shots960/ thành MỘT tấm lưới để duyệt bằng một lượt nhìn.
 */
import playwright from '/Users/admin/Downloads/api-backend/node_modules/playwright/index.js'
import { readdirSync, writeFileSync } from 'node:fs'
const { chromium } = playwright

const DIR = '/private/tmp/claude-501/-Users-admin-Downloads-api-backend/d1b108cb-e5ac-4232-aac3-8d64f5e046f0/scratchpad'

const browser = await chromium.launch()

// ---------- 1. blog-2 ----------
{
    const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 2 })
    const page = await ctx.newPage()
    await page.goto('https://cuongthai.com/blog', { waitUntil: 'networkidle', timeout: 45000 })
    await page.waitForTimeout(2500)

    // thẻ bài viết = phần tử bắt được click ở nửa dưới trang; thử lần lượt vài kiểu
    const before = page.url()
    for (const sel of [ 'article', '[class*="cursor-pointer"]', 'h2', 'h3' ])
    {
        const el = page.locator(sel).first()
        if (await el.count() === 0) continue
        try { await el.click({ timeout: 4000 }) } catch { continue }
        await page.waitForTimeout(3000)
        if (page.url() !== before) break
    }

    if (page.url() === before) console.log('blog-2: click không điều hướng đi đâu — BỎ, Experience Log dùng 1 ảnh')
    else
    {
        await page.waitForTimeout(2000)
        await page.evaluate(() =>
        {
            for (const el of document.querySelectorAll('body *'))
            {
                const cs = getComputedStyle(el)
                if (cs.position !== 'fixed' || cs.display === 'none') continue
                const r = el.getBoundingClientRect()
                if (r.width === 0 || r.width > 420) continue
                if (r.bottom > innerHeight - 200 && (r.right > innerWidth - 220 || r.left < 220)) el.style.setProperty('display', 'none', 'important')
            }
        })
        await page.screenshot({ path: `${DIR}/shots/blog-2.png` })
        console.log(`blog-2: xong (${page.url()})`)
    }
    await ctx.close()
}

// ---------- 2. tấm lưới duyệt ảnh ----------
{
    const files = readdirSync(`${DIR}/shots960`).filter((f) => f.endsWith('.png')).sort()
    const html = `<style>
      body{margin:0;background:#111;font:13px monospace;color:#fff}
      .g{display:grid;grid-template-columns:repeat(3,480px);gap:10px;padding:10px}
      figure{margin:0} img{width:480px;height:270px;display:block;border:1px solid #444}
      figcaption{padding:3px 0;color:#8f8}
    </style><div class="g">${files.map((f) => `<figure><img src="file://${DIR}/shots960/${f}"><figcaption>${f}</figcaption></figure>`).join('')}</div>`

    writeFileSync(`${DIR}/sheet.html`, html)
    const ctx = await browser.newContext({ viewport: { width: 1500, height: 1000 } })
    const page = await ctx.newPage()
    await page.goto(`file://${DIR}/sheet.html`)
    await page.waitForTimeout(1200)
    await page.screenshot({ path: `${DIR}/sheet.png`, fullPage: true })
    console.log(`lưới: ${files.length} ảnh -> sheet.png`)
    await ctx.close()
}

await browser.close()
