const { chromium } = await import('/Users/admin/Downloads/api-backend/node_modules/playwright/index.mjs')
const browser = await chromium.launch({ args: [ '--enable-unsafe-webgpu', '--enable-features=Vulkan' ] })
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } })
page.on('pageerror', e => console.log('PAGEERROR:', e.message))
await page.goto('http://localhost:5175/#skip', { waitUntil: 'domcontentloaded' })
await page.waitForFunction(() => window.game?.world?.fptuCampus?.destruction && window.game?.reveal?.step >= 1, null, { timeout: 120000 })
await page.evaluate(() => { const b = document.querySelector('.js-welcome-play'); if(b){ b.hidden=false; b.click() } })
await page.waitForTimeout(2000)

// Phá bằng cách gọi thẳng damage() — không đụng Rapier từ evaluate
console.log('phá:', await page.evaluate(() => {
    const d = window.game.world.fptuCampus.destruction
    d.preference.set('on')
    d.damage({ x: -156, y: 3, z: 40 }, 16, 5)
    return { moDo: d.pieces.filter(p => p.broken).length,
             vaChamDaTat: d.pieces.filter(p => p.object?.physical?.body && !p.object.physical.body.isEnabled()).length }
}))

await page.waitForTimeout(1500)
console.log('bấm Reset:', await page.evaluate(() => {
    try { window.game.world.fptuCampus.destruction.reset(); return 'không ném lỗi' }
    catch(e) { return 'NÉM LỖI: ' + e.message }
}))

await page.waitForTimeout(4000)   // chờ nhịp sau bật lại va chạm
console.log('sau Reset:', await page.evaluate(() => {
    const c = window.game.world.fptuCampus, d = c.destruction
    return {
        moDo: d.pieces.filter(p => p.broken).length,
        vaChamCONTAT: d.pieces.filter(p => p.object?.physical?.body && !p.object.physical.body.isEnabled()).length,
        saiViTri: d.pieces.filter(p => p.mesh.position.distanceTo(p.home.position) > 0.001).length,
        anNhamHinh: d.pieces.filter(p => p.mesh.visible !== p.home.visible).length,
        manhVo: d.shards.length,
        nguoiChet: c.people.people.filter(p => p.dead).length,
    }
}))
await browser.close()
