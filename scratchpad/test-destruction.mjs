/**
 * Kiểm LOGIC hệ phá huỷ + vũ khí tên lửa trên dev server :5175.
 *
 * ⚠️ HAI ĐIỀU ĐÃ HỌC ĐƯỢC VỀ CÁI MÔI TRƯỜNG NÀY — đừng đi lại:
 *
 * 1. **Đừng chụp ảnh ở đây.** Headless chromium này không có WebGPU: JS chạy
 *    bình thường nhưng canvas KHÔNG vẽ gì, mọi ảnh chụp ra là một tấm đen
 *    giống hệt nhau. Hình ảnh để Khung xem (Browser pane) lo.
 *
 * 2. **Đừng chờ theo thời gian thực.** Vòng lặp game ở đây chạy chừng MỘT
 *    NHỊP MỖI GIÂY (đo được: `ticker.delta` = 0,033 sau 1,2 giây thực), vì cả
 *    khu trường 1435 mesh đang dựng bằng phần mềm. Chờ 4 giây thực để xem quả
 *    tên lửa bay 3,85 giây trong game là ra kết luận "đạn không bay" — sai
 *    hoàn toàn. Nên ở đây tự BƠM NHỊP: đặt `ticker.delta` rồi gọi thẳng
 *    `update()` của hai module, đúng thứ tự chúng chạy thật.
 */
const { chromium } = await import('/Users/admin/Downloads/api-backend/node_modules/playwright/index.mjs')

const browser = await chromium.launch({ args: [ '--enable-unsafe-webgpu', '--enable-features=Vulkan' ] })
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })

const errors = []
page.on('pageerror', (e) => errors.push(`PAGEERROR ${e.message}`))
page.on('console', (m) => { if(m.type() === 'error') errors.push(`CONSOLE ${m.text().slice(0, 200)}`) })

await page.goto('http://localhost:5175/#skip', { waitUntil: 'domcontentloaded' })
await page.waitForFunction(
    () => window.game?.world?.fptuCampus?.destruction && window.game?.reveal?.step >= 1,
    null, { timeout: 120000 },
)
await page.evaluate(() =>
{
    const button = document.querySelector('.js-welcome-play')
    if(button) { button.hidden = false; button.click() }
})
await page.waitForTimeout(2000)
console.log('✓ game đã vào')

/** Bơm `n` nhịp game với delta cố định, KHÔNG phụ thuộc tốc độ vẽ. */
const stepGame = (n, delta = 1 / 60) => page.evaluate(({ n, delta }) =>
{
    const game = window.game
    const vr = game.world.vehicleRocket
    const d = game.world.fptuCampus.destruction
    const saved = game.ticker.delta

    for(let i = 0; i < n; i++)
    {
        game.ticker.delta = delta
        game.ticker.elapsed += delta
        vr.updateCameraFollow()
        d.update()
        vr.update()
        game.world.fptuCampus.swans.update()
        game.world.fptuCampus.people.update()
    }

    game.ticker.delta = saved
}, { n, delta })

await page.evaluate(() =>
{
    window.game.physicalVehicle.moveTo({ x: -92, y: 4, z: 40 }, Math.PI)
    window.game.world.vehicleRocket.preference.set('on')
    window.game.world.fptuCampus.destruction.preference.set('on')
})
await page.waitForTimeout(1500)

const stats = await page.evaluate(() =>
{
    const c = window.game.world.fptuCampus
    return {
        manhDangKy: c.destruction.pieces.length,
        cay: c.destruction.trees.length,
        cumLa: c.destruction.clusters.length,
        nguoi: c.people.people.length,
        thienNga: c.swans.swans.length,
    }
})
console.log('SỔ ĐĂNG KÝ:', JSON.stringify(stats))

// ── Khí tài trên nóc xe có ĐỔI theo vũ khí không ─────────────────────────────
const mounts = await page.evaluate(() =>
{
    const vr = window.game.world.vehicleRocket
    const read = () => ({ phao: vr.cannon.visible, beRhong: vr.launcher.visible })
    vr.weaponPreference.set('rocket')
    const a = read()
    vr.weaponPreference.set('missile')
    const b = read()
    return { chonRocket: a, chonMissile: b }
})
console.log('KHÍ TÀI TRÊN NÓC XE:', JSON.stringify(mounts))

// ── Dò nước ─────────────────────────────────────────────────────────────────
const water = await page.evaluate(() =>
{
    const d = window.game.world.fptuCampus.destruction
    const swan = window.game.world.fptuCampus.swans.swans[0]
    const probe = (x, z, label) => ({ label, cao: +(d.groundHeight(x, z) ?? NaN).toFixed(2), nuoc: d.isWater(x, z) })
    return [
        probe(-160, 40, 'sân trường (lát)'),
        probe(swan.x, swan.z, 'hồ thiên nga'),
        probe(-156, 40, 'toà Alpha (nóc nhà)'),
    ]
})
console.log('DÒ NƯỚC:')
for(const w of water) console.log('   ', JSON.stringify(w))

// ═══ CA 1: ROCKET × 4 vào Alpha — phải VỠ DẦN ══════════════════════════════
const alphaShots = []
for(let shot = 0; shot < 4; shot++)
{
    await page.evaluate(() =>
    {
        const vr = window.game.world.vehicleRocket
        vr.weaponPreference.set('rocket')
        vr.hasAim = true
        vr.aim.set(-156, 0, 40)
        vr.fire()
    })
    await stepGame(90)   // 1,5 giây game — thừa cho rocket
    alphaShots.push(await page.evaluate(() => window.game.world.fptuCampus.destruction.pieces.filter(p => p.broken).length))
}
console.log('ROCKET × 4 vào Alpha — tổng mảng đã đổ sau mỗi phát:', JSON.stringify(alphaShots))

await page.evaluate(() => window.game.world.fptuCampus.destruction.reset())
await stepGame(10)

// ═══ CA 2: TÊN LỬA — ba pha + máy quay bám ═════════════════════════════════
await page.evaluate(() =>
{
    const vr = window.game.world.vehicleRocket
    vr.weaponPreference.set('missile')
    vr.hasAim = true
    vr.aim.set(-143, 0, 83)
    vr.fire()
})

const flight = []
for(let i = 0; i < 13; i++)
{
    await stepGame(18)   // 0,3 giây game mỗi mẫu
    const sample = await page.evaluate(() =>
    {
        const vr = window.game.world.vehicleRocket
        const r = vr.rockets[0]
        const cam = window.game.view.focusPoint.trackedPosition
        const xe = window.game.player.position
        if(!r) return { xong: true, camLechXe: +Math.hypot(cam.x - xe.x, cam.z - xe.z).toFixed(1) }
        return {
            t: +r.time.toFixed(2),
            y: +r.group.position.y.toFixed(1),
            r: +Math.hypot(r.group.position.x - r.to.x, r.group.position.z - r.to.z).toFixed(1),
            camLechXe: +Math.hypot(cam.x - xe.x, cam.z - xe.z).toFixed(1),
        }
    })
    flight.push(sample)
}
console.log('ĐƯỜNG BAY TÊN LỬA (y=cao độ · r=bán kính ngang tới đích · camLechXe=máy quay rời xe bao xa):')
for(const f of flight)
    console.log(f.xong ? `    (đã nổ)                       camLechXe=${f.camLechXe}` : `    t=${String(f.t).padEnd(5)} y=${String(f.y).padEnd(5)} r=${String(f.r).padEnd(6)} camLechXe=${f.camLechXe}`)

const afterMissile = await page.evaluate(() =>
{
    const c = window.game.world.fptuCampus
    return {
        moDo: c.destruction.pieces.filter(p => p.broken).length,
        cayGay: c.destruction.deadTrees.length,
        cumLaMat: c.destruction.hiddenClusters.length,
        manhVo: c.destruction.shards.length,
        nguoiChet: c.people.people.filter(p => p.dead).length,
    }
})
console.log('SAU MỘT PHÁT TÊN LỬA:', JSON.stringify(afterMissile))

// ═══ CA 3: bắn xuống HỒ THIÊN NGA ══════════════════════════════════════════
const lake = await page.evaluate(() =>
{
    const s = window.game.world.fptuCampus.swans.swans[0]
    return { x: s.x, z: s.z }
})
await page.evaluate((t) =>
{
    const vr = window.game.world.vehicleRocket
    vr.weaponPreference.set('missile')
    vr.hasAim = true
    vr.aim.set(t.x, 0, t.z)
    vr.fire()
}, lake)
await stepGame(245)   // ~4,1 giây game

const splash = await page.evaluate(() =>
{
    const c = window.game.world.fptuCampus
    return {
        cotNuoc: c.destruction.splashes.length,
        thienNgaChet: c.swans.swans.filter(s => s.dead).length,
    }
})
console.log('BẮN XUỐNG HỒ:', JSON.stringify(splash))

// ═══ CA 4: RESET ═══════════════════════════════════════════════════════════
const beforeReset = await page.evaluate(() =>
{
    const c = window.game.world.fptuCampus
    return {
        moDo: c.destruction.pieces.filter(p => p.broken).length,
        vaChamTat: c.destruction.pieces.filter(p => p.object?.physical?.body && !p.object.physical.body.isEnabled()).length,
        nguoiChet: c.people.people.filter(p => p.dead).length,
        thienNgaChet: c.swans.swans.filter(s => s.dead).length,
    }
})

await page.evaluate(() => window.game.world.fptuCampus.destruction.reset())
await stepGame(30)

const afterReset = await page.evaluate(() =>
{
    const c = window.game.world.fptuCampus
    const d = c.destruction
    return {
        moDo: d.pieces.filter(p => p.broken).length,
        anNhamHinh: d.pieces.filter(p => p.mesh.visible !== p.home.visible).length,
        vaChamTat: d.pieces.filter(p => p.object?.physical?.body && !p.object.physical.body.isEnabled()).length,
        saiViTri: d.pieces.filter(p => p.mesh.position.distanceTo(p.home.position) > 0.001).length,
        saiCo: d.pieces.filter(p => Math.abs(p.mesh.scale.x - p.home.scale.x) > 0.001).length,
        cayGay: d.deadTrees.length,
        manhVo: d.shards.length,
        nguoiChet: c.people.people.filter(p => p.dead).length,
        thienNgaChet: c.swans.swans.filter(s => s.dead).length,
    }
})
console.log('TRƯỚC RESET:', JSON.stringify(beforeReset))
console.log('SAU RESET  :', JSON.stringify(afterReset))

// ═══ CA 5: TẮT thì bắn không suy suyển gì ══════════════════════════════════
await page.evaluate(() =>
{
    window.game.world.fptuCampus.destruction.preference.set('off')
    const vr = window.game.world.vehicleRocket
    vr.weaponPreference.set('missile')
    vr.hasAim = true
    vr.aim.set(-156, 0, 40)
    vr.fire()
})
await stepGame(245)

const offCase = await page.evaluate(() =>
{
    const c = window.game.world.fptuCampus
    return {
        moDo: c.destruction.pieces.filter(p => p.broken).length,
        cayGay: c.destruction.deadTrees.length,
        nguoiChet: c.people.people.filter(p => p.dead).length,
    }
})
console.log('KHI TẮT (phải toàn 0):', JSON.stringify(offCase))

console.log('\n=== LỖI ===')
console.log(errors.length ? [ ...new Set(errors) ].slice(0, 15).join('\n') : '(không có)')

await browser.close()
