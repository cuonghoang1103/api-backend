const { chromium } = await import('/Users/admin/Downloads/api-backend/node_modules/playwright/index.mjs')
const browser = await chromium.launch({ args: [ '--enable-unsafe-webgpu', '--enable-features=Vulkan' ] })
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
page.on('pageerror', e => console.log('PAGEERROR:', e.message))
await page.goto('http://localhost:5175/#skip', { waitUntil: 'domcontentloaded' })
await page.waitForFunction(() => window.game?.world?.fptuCampus && window.game?.reveal?.step >= 1, null, { timeout: 120000 })
await page.evaluate(() => { const b = document.querySelector('.js-welcome-play'); if(b){ b.hidden=false; b.click() } })
await page.waitForTimeout(2000)

const probe = async (x, z, label) => page.evaluate(({x, z, label}) => {
    const g = window.game
    g.player.position.set(x, 0.2, z)
    g.view.focusPoint.position.set(x, 0, z)
    for(let i = 0; i < 5; i++) g.audio.update()
    return { chỗ: label, song: +g.audio.groups.get('waves').items[0].volume.toFixed(3) }
}, {x, z, label})

console.log('TIẾNG SÓNG sau khi sửa:')
for(const [x, z, label] of [
    [0, 0, 'giữa đảo chính                '],
    [80, 0, 'sát mép đảo chính             '],
    [-88, 40, 'giữa cầu (trên biển)          '],
    [-162, 30, 'GIỮA SÂN TRƯỜNG FPTU          '],
    [-150, 52, 'đường trong trường            '],
    [-236, 30, 'sát mép Tây đảo trường        '],
    [-260, 30, 'ngoài biển phía Tây trường    '],
]) {
    const r = await probe(x, z, label)
    console.log(`   ${r.chỗ} → ${r.song}`)
}

console.log('\nMÁY QUAY:')
console.log(await page.evaluate(() => {
    const v = window.game.view
    const before = v.mode
    v.toggleMode()
    const afterToggle = v.mode
    v.toggleMode()
    return {
        thuPhongMax: v.spherical.radius.edges.max,
        thuPhongMin: v.spherical.radius.edges.min,
        cheDoBanDau: before,
        sauKhiBamV: afterToggle,
        veLai: v.mode,
        nutCaiDat: !!document.querySelector('.js-camera-modes'),
        freeModeSan: !!v.freeMode,
    }
}))

console.log('\nBán kính máy quay ở hai đầu thu phóng:')
console.log(await page.evaluate(() => {
    const v = window.game.view
    const out = {}
    for(const r of [0, 0.5, 1]) {
        v.zoom.smoothedRatio = r
        v.update()
        out['ratio=' + r] = +v.spherical.radius.current.toFixed(1)
    }
    v.zoom.smoothedRatio = 0.3
    return out
}))
await browser.close()
