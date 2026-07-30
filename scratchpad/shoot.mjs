/**
 * Chụp ảnh trưng bày cho khu Dự án + khu Lab của sân chơi 3D.
 *
 * Chụp 1600x900 @2x (=3200x1800) rồi bước sau dùng `sips` thu về 960x540.
 * Trình duyệt sạch, KHÔNG đăng nhập — chỉ chụp được nội dung công khai, đúng ý đồ.
 */
import playwright from '/Users/admin/Downloads/api-backend/node_modules/playwright/index.js'
const { chromium } = playwright
import { mkdirSync } from 'node:fs'

const BASE = 'https://cuongthai.com'
const OUT = '/private/tmp/claude-501/-Users-admin-Downloads-api-backend/d1b108cb-e5ac-4232-aac3-8d64f5e046f0/scratchpad/shots'

const SHOTS = [
    // 4 module mới
    { file: 'courses-1', url: '/courses' },
    { file: 'courses-2', url: '/courses', clickText: 'FPTU Academy' },
    { file: 'blog-1', url: '/blog' },
    { file: 'blog-2', url: '/blog', followFirst: '/blog/' },
    { file: 'forum', url: '/forum' },
    { file: 'repos', url: '/repos' },
    // ảnh phụ cho 6 dự án cũ
    { file: 'code-lab-2', url: '/code-lab/data-structures-algorithms' },
    { file: 'academy-2', url: '/courses/computer-networking' },
    { file: 'exam-2', url: '/exam' },
    { file: 'simulation-2', url: '/simulation' },
    { file: 'roadmap-2', url: '/roadmap/backend' },
    { file: 'language-2', url: '/language/ja' },
]

/** Ẩn mọi thứ nổi ở góc dưới (bong bóng chat AI, nút back-to-top, cookie banner). */
const hideFloating = () =>
{
    for (const el of document.querySelectorAll('body *'))
    {
        const cs = getComputedStyle(el)
        if (cs.position !== 'fixed' || cs.display === 'none') continue
        const r = el.getBoundingClientRect()
        if (r.width === 0 || r.width > 420) continue
        const nearBottom = r.bottom > innerHeight - 200
        const nearSide = r.right > innerWidth - 220 || r.left < 220
        if (nearBottom && nearSide) el.style.setProperty('display', 'none', 'important')
    }
}

mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch()
const context = await browser.newContext({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 2 })
const page = await context.newPage()

for (const shot of SHOTS)
{
    try
    {
        await page.goto(BASE + shot.url, { waitUntil: 'networkidle', timeout: 45000 })

        if (shot.followFirst)
        {
            const href = await page.evaluate((prefix) =>
            {
                const a = [ ...document.querySelectorAll('a[href]') ].find((a) => new URL(a.href, location.origin).pathname.startsWith(prefix) && new URL(a.href, location.origin).pathname !== prefix)
                return a ? new URL(a.href, location.origin).pathname : null
            }, shot.followFirst)

            if (!href) { console.log(`${shot.file}: KHÔNG tìm thấy link con ${shot.followFirst} — BỎ QUA`); continue }
            console.log(`${shot.file}: đi tiếp tới ${href}`)
            await page.goto(BASE + href, { waitUntil: 'networkidle', timeout: 45000 })
        }

        if (shot.clickText)
        {
            const target = page.getByText(shot.clickText, { exact: false }).first()
            if (await target.count() === 0) { console.log(`${shot.file}: không thấy "${shot.clickText}" — BỎ QUA`); continue }
            await target.click()
            await page.waitForTimeout(1800)
        }

        // đợi animation vào-màn-hình (framer-motion) chạy xong — /repos từng chụp trúng lúc còn mờ
        await page.waitForTimeout(2800)
        await page.evaluate(hideFloating)
        await page.waitForTimeout(300)

        await page.screenshot({ path: `${OUT}/${shot.file}.png` })
        console.log(`${shot.file}: xong  (${page.url()})`)
    }
    catch (err)
    {
        console.log(`${shot.file}: LỖI — ${err.message.split('\n')[0]}`)
    }
}

await browser.close()
