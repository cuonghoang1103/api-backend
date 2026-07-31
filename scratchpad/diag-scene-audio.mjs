/**
 * ⚠️ ĐỪNG tự bơm `ticker.events.trigger('tick')` ở đây. Vòng lặp rAF thật của
 * game vẫn chạy song song; bơm chồng lên là Rapier ném "recursive use of an
 * object … unsafe aliasing in rust" từ `PhysicsVehicle`. Cách an toàn: đổi cài
 * đặt rồi ĐỂ GAME TỰ CHẠY vài nhịp thật.
 */
const { chromium } = await import('/Users/admin/Downloads/api-backend/node_modules/playwright/index.mjs')
const browser = await chromium.launch({ args: [ '--enable-unsafe-webgpu', '--enable-features=Vulkan' ] })
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } })
page.on('pageerror', e => console.log('PAGEERROR:', e.message))
await page.goto('http://localhost:5175/#skip', { waitUntil: 'domcontentloaded' })
await page.waitForFunction(() => window.game?.world?.fptuCampus && window.game?.reveal?.step >= 1, null, { timeout: 120000 })
await page.evaluate(() => { const b = document.querySelector('.js-welcome-play'); if(b){ b.hidden=false; b.click() } })
await page.waitForTimeout(2000)

// Theo dõi xem gà/sói có thật sự kêu không
await page.evaluate(() => {
    window.__keu = []
    for(const n of ['rooster','wolf','owl','birdTweet']) {
        for(const it of window.game.audio.groups.get(n).items) {
            const orig = it.howl.play.bind(it.howl)
            it.howl.play = (...a) => { window.__keu.push(n); return orig(...a) }
        }
    }
})

const scene = async (pref, label) => {
    await page.evaluate((pref) => { window.game.dayCycles.preference.set(pref, 0); window.__keu.length = 0 }, pref)
    await page.waitForTimeout(6000)   // vài nhịp THẬT để progress kịp áp + dế chuyển
    return page.evaluate((label) => {
        const g = window.game
        const vol = (n) => { const gr = g.audio.groups.get(n); return gr ? +(gr.items[0].volume ?? 0).toFixed(2) : '—' }
        return {
            canh: label,
            laBanDem: g.dayCycles.isNight(),
            coThoBaoDem: g.dayCycles.intervalEvents.get('night').inInterval,
            de: vol('crickets'),
            chimDuocPhepHot: !g.dayCycles.isNight(),
            cuDuocPhepKeu: g.dayCycles.isNight(),
            daKeu: [...new Set(window.__keu)],
        }
    }, label)
}

console.log('══ ÂM THANH THEO CẢNH ══')
console.log('coThoBaoDem = cờ interval THÔ (chỗ hỏng cũ). laBanDem = isNight() (nay ai cũng dùng)\n')
console.log(JSON.stringify(await scene('day', 'ép BAN NGÀY')))
console.log(JSON.stringify(await scene('night', 'ép BAN ĐÊM')))
console.log(JSON.stringify(await scene('day', 'ép về BAN NGÀY (phải có GÀ GÁY)')))
console.log(JSON.stringify(await scene('auto', 'trả về tự động')))
await browser.close()
