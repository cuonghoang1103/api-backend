const { chromium } = await import('/Users/admin/Downloads/api-backend/node_modules/playwright/index.mjs')
const browser = await chromium.launch({ args: [ '--enable-unsafe-webgpu', '--enable-features=Vulkan' ] })
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } })
page.on('pageerror', e => console.log('PAGEERROR:', e.message))
await page.goto('http://localhost:5175/#skip', { waitUntil: 'domcontentloaded' })
await page.waitForFunction(() => window.game?.world?.fptuCampus && window.game?.reveal?.step >= 1, null, { timeout: 120000 })
await page.evaluate(() => { const b = document.querySelector('.js-welcome-play'); if(b){ b.hidden=false; b.click() } })
await page.waitForTimeout(2000)

console.log('══ CA HIỂM: ticker.delta = 0 (tab vừa được đánh thức) ══')
console.log(await page.evaluate(() => {
    const q = window.game, v = q.view
    const before = String(v.spherical.radius.current).slice(0,8)
    // Ép đúng tình huống 0/0
    q.ticker.delta = 0; v.update(); v.update()
    const ngay = String(v.spherical.radius.current).slice(0,8)
    // Rồi trả nhịp về bình thường — máy quay phải TỰ LÀNH
    for(let i=0;i<10;i++){ q.ticker.delta = 1/60; v.update() }
    return { truoc: before, ngayLucDelta0: ngay, sau10Nhip: String(v.spherical.radius.current).slice(0,8),
             conNaN: !isFinite(v.spherical.radius.current) }
}))

console.log('\n══ CA HIỂM: delta khổng lồ (tab treo lâu rồi quay lại) ══')
console.log(await page.evaluate(() => {
    const q = window.game, v = q.view
    q.ticker.delta = 5; v.update()
    const ngay = String(v.spherical.radius.current).slice(0,8)
    for(let i=0;i<10;i++){ q.ticker.delta = 1/60; v.update() }
    return { ngay, sau10Nhip: String(v.spherical.radius.current).slice(0,8), conNaN: !isFinite(v.spherical.radius.current) }
}))

console.log('\n══ ĐỘ ỔN ĐỊNH khi bám tên lửa (điểm nhìn có đứng yên không) ══')
console.log(await page.evaluate(() => {
    const q = window.game, v = q.view, w = q.world.vehicleRocket
    v.zoom.baseRatio = 0.3; v.zoom.ratio = 0.3; v.zoom.smoothedRatio = 0.3
    for(const p of ['trackedPosition','position','smoothedPosition']) v.focusPoint[p].set(-150,0,52)
    q.physicalVehicle.moveTo({x:-150,y:2,z:52}, Math.PI)
    w.preference.set('on'); w.weaponPreference.set('missile')
    w.hasAim = true; w.aim.set(-156,0,40); w.fire()
    let maxJump = 0, prev = null
    const rs = []
    for(let i=0;i<240;i++){
        q.ticker.delta=1/60; q.ticker.elapsed+=1/60
        w.updateCameraFollow(); w.update(); v.update()
        const p = v.focusPoint.smoothedPosition
        if(prev) maxJump = Math.max(maxJump, Math.hypot(p.x-prev.x, p.z-prev.z))
        prev = { x:p.x, z:p.z }
        if(i>60) rs.push(v.spherical.radius.current)
    }
    return {
        buocNhayLonNhatCuaDiemNhin: +maxJump.toFixed(3),
        banKinhDaoDongSauKhiOnDinh: +(Math.max(...rs) - Math.min(...rs)).toFixed(2),
        conNaN: !isFinite(v.spherical.radius.current),
    }
}))
await browser.close()
