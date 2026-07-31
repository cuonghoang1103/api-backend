const { chromium } = await import('/Users/admin/Downloads/api-backend/node_modules/playwright/index.mjs')
const browser = await chromium.launch({ args: [ '--enable-unsafe-webgpu', '--enable-features=Vulkan' ] })
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } })
page.on('pageerror', e => console.log('PAGEERROR:', e.message))
await page.goto('http://localhost:5175/#skip', { waitUntil: 'domcontentloaded' })
await page.waitForFunction(() => window.game?.world?.fptuCampus && window.game?.reveal?.step >= 1, null, { timeout: 120000 })
await page.evaluate(() => { const b = document.querySelector('.js-welcome-play'); if(b){ b.hidden=false; b.click() } })
await page.waitForTimeout(2000)

console.log('══ 1. BÁN KÍNH MÁY QUAY theo mức thu phóng — có còn vọt ra ngoài trần không ══')
console.log(await page.evaluate(() => {
    const v = window.game.view, out = {}
    for(const r of [0, 0.15, 0.3, 0.5, 0.8, 1]) {
        v.zoom.baseRatio = r; v.zoom.ratio = r; v.zoom.smoothedRatio = r; v.update()
        out['thuPhong=' + r] = +v.spherical.radius.current.toFixed(1)
    }
    v.zoom.baseRatio = 0.3
    return out
}))

console.log('\n══ 2. XE CHẠY NHANH — máy quay giãn ra bao nhiêu (trước: 26→105) ══')
console.log(await page.evaluate(() => {
    const v = window.game.view
    const measure = (speed) => {
        v.zoom.baseRatio = 0.3; v.zoom.ratio = 0.3; v.zoom.smoothedRatio = 0.3
        // ép số hạng tốc độ bằng cách dịch điểm nhìn thật nhanh mỗi nhịp
        for(let i = 0; i < 80; i++) {
            window.game.ticker.delta = 1/60
            v.focusPoint.trackedPosition.x += speed / 60
            v.update()
        }
        return +v.spherical.radius.current.toFixed(1)
    }
    return { dungYen: measure(0), chayNhanh: measure(45) }
}))

const stepGame = (n) => page.evaluate((n) => {
    const g = window.game, w = g.world.vehicleRocket, d = g.world.fptuCampus.destruction
    for(let i = 0; i < n; i++) { g.ticker.delta = 1/60; g.ticker.elapsed += 1/60; w.updateCameraFollow(); d.update(); w.update(); g.view.update() }
}, n)

const run = async (zoomRatio, label) => {
    await page.evaluate((zoomRatio) => {
        const g = window.game
        g.physicalVehicle.moveTo({ x: -150, y: 2, z: 52 }, Math.PI)
        for(const p of ['trackedPosition','position','smoothedPosition']) g.view.focusPoint[p].set(-150,0,52)
        g.view.zoom.baseRatio = zoomRatio; g.view.zoom.ratio = zoomRatio; g.view.zoom.smoothedRatio = zoomRatio
        g.view.update()
        const w = g.world.vehicleRocket
        w.preference.set('on'); w.weaponPreference.set('missile')
        w.hasAim = true; w.aim.set(-156, 0, 40); w.fire()
        window.__r = w.rockets[w.rockets.length - 1]
    }, zoomRatio)

    const rows = []
    for(let i = 0; i < 12; i++) {
        await stepGame(20)
        rows.push(await page.evaluate(() => {
            const g = window.game, r = window.__r
            if(!r || !g.world.vehicleRocket.rockets.includes(r)) return null
            const p = r.group.position.clone().project(g.view.camera)
            return { t:+r.time.toFixed(2), mx:+p.x.toFixed(2), my:+p.y.toFixed(2),
                     tiLe:+(g.view.camera.position.distanceTo(r.group.position) / g.view.spherical.radius.current).toFixed(2) }
        }))
    }
    console.log(`\n── ${label} ──`)
    console.log('   t     màn hình (|x|,|y|>1 = ngoài khung)   đạn xa / bán kính  (nhỏ hơn 1 = to hơn xe)')
    let ngoai = 0
    for(const r of rows) {
        if(!r) { console.log('   (đã nổ)'); continue }
        const flag = (Math.abs(r.mx) > 1 || Math.abs(r.my) > 1) ? '  ← NGOÀI KHUNG' : ''
        if(flag) ngoai++
        console.log(`   ${String(r.t).padEnd(5)} x=${String(r.mx).padStart(6)} y=${String(r.my).padStart(6)}   ${r.tiLe}${flag}`)
    }
    console.log(`   → số mẫu ra ngoài khung: ${ngoai}`)
    await page.evaluate(() => { window.game.world.fptuCampus.destruction.reset(); window.game.world.vehicleRocket.rockets.length = 0 })
}

console.log('\n══ 3. BÁM TÊN LỬA ══')
await run(0.3, 'thu phóng mặc định')
await run(0,   'kéo xa hết cỡ')
await run(1,   'kéo gần hết cỡ')
await browser.close()
