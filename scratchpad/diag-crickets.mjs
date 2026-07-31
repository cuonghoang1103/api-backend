/** `audio.update()` KHÔNG đụng Rapier nên bơm nhịp cho riêng nó là an toàn. */
const { chromium } = await import('/Users/admin/Downloads/api-backend/node_modules/playwright/index.mjs')
const browser = await chromium.launch({ args: [ '--enable-unsafe-webgpu', '--enable-features=Vulkan' ] })
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } })
page.on('pageerror', e => console.log('PAGEERROR:', e.message))
await page.goto('http://localhost:5175/#skip', { waitUntil: 'domcontentloaded' })
await page.waitForFunction(() => window.game?.world?.fptuCampus && window.game?.reveal?.step >= 1, null, { timeout: 120000 })
await page.evaluate(() => { const b = document.querySelector('.js-welcome-play'); if(b){ b.hidden=false; b.click() } })
await page.waitForTimeout(2000)

const fade = async (pref, label) => {
    await page.evaluate((pref) => window.game.dayCycles.preference.set(pref, 0), pref)
    await page.waitForTimeout(3500)   // để nhịp THẬT áp mức ép giờ vào progress
    return page.evaluate((label) => {
        const g = window.game
        const it = g.audio.groups.get('crickets').items[0]
        const saved = g.ticker.delta
        const moc = {}
        for(let s = 1; s <= 20; s++) {
            for(let i = 0; i < 60; i++) { g.ticker.delta = 1/60; g.audio.update() }
            if([1,5,10,15,20].includes(s)) moc['sau' + s + 's'] = +it.volume.toFixed(3)
        }
        g.ticker.delta = saved
        return { canh: label, laBanDem: g.dayCycles.isNight(), ...moc }
    }, label)
}

console.log('══ TIẾNG DẾ chuyển theo cảnh (mục tiêu: đêm 0,65 · ngày 0) ══')
console.log(JSON.stringify(await fade('night', 'ép BAN ĐÊM'), null, 0))
console.log(JSON.stringify(await fade('day', 'ép BAN NGÀY'), null, 0))
await browser.close()
