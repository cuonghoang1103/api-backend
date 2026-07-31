/**
 * RÀ SOÁT TOÀN DIỆN khu Đại học FPT — hai loại lỗi mà mắt không thấy được:
 *
 *  A. VA CHẠM MỒ CÔI — collider không có hình nào ở gần. Đây chính là "vật vô
 *     hình chặn xe" mà người dùng đâm phải nhiều lần.
 *  B. MẶT TRANH NHAU CHIỀU SÂU — hai tấm phẳng chồng nhau mà mặt trên gần
 *     trùng cao độ, ra vệt nhiễu nhấp nháy.
 *
 * ─── VÌ SAO PHẢI ĐẾM CẢ HÌNH DẠNG INSTANCED ───
 * Cây, bụi, đèn lồng đều vẽ bằng `InstancedMesh`: cả trăm bản sao nằm trong
 * MỘT mesh có `position` ở gốc toạ độ. Bộ dò chỉ nhìn `mesh.position` sẽ tưởng
 * chúng không tồn tại và báo oan mọi gốc cây là "va chạm mồ côi". Bản này đọc
 * từng ma trận instance nên đếm đúng.
 *
 * Chạy:  node tools/check-ghost-colliders.mjs          (cần dev server đang chạy)
 *        URL=http://localhost:5175/ node tools/...
 */
const { chromium } = await import('/Users/admin/Downloads/api-backend/node_modules/playwright/index.mjs')

const URL = process.env.URL ?? 'http://localhost:5175/'

const browser = await chromium.launch({ headless: false })
const page = await browser.newPage({ viewport: { width: 900, height: 600 } })
page.on('pageerror', (e) => console.log('  [pageerror]', e.message))
await page.goto(URL, { waitUntil: 'domcontentloaded' })
await page.waitForFunction(() => window.game?.world?.fptuCampus && window.game?.physics?.world, null, { timeout: 180000 })
await page.waitForTimeout(3000)   // chờ những thứ dựng ở nhịp sau (dời chướng ngại vật…)

const r = await page.evaluate(() =>
{
    const g = window.game, world = g.physics.world
    // Vùng rà: cả đảo trường + hành lang sang đảo chính
    const ZONE = { x0: -250, x1: -55, z0: -50, z1: 110 }
    const inZone = (x, z) => x > ZONE.x0 && x < ZONE.x1 && z > ZONE.z0 && z < ZONE.z1

    // ── Gom MỌI vị trí có HÌNH, kể cả từng bản sao của InstancedMesh ────────
    const visuals = []
    // ⚠️ Không có biến `THREE` trong trang. Mượn hàm dựng từ chính đối tượng
    // đang có: `group.matrixWorld` là Matrix4, `group.position` là Vector3.
    const sample = g.world.fptuCampus.group
    const m = new sample.matrixWorld.constructor()
    const v = new sample.position.constructor()
    const boxes = []
    // Box3 mượn từ hộp bao có sẵn của một hình bất kỳ
    let box = null
    g.scene.traverse((o) => { if(!box && o.isMesh && o.geometry) { o.geometry.computeBoundingBox(); box = o.geometry.boundingBox.clone() } })

    g.scene.traverse((o) =>
    {
        if(!o.isMesh) return

        if(o.isInstancedMesh)
        {
            o.updateWorldMatrix(true, false)
            for(let i = 0; i < o.count; i++)
            {
                o.getMatrixAt(i, m)
                v.setFromMatrixPosition(m).applyMatrix4(o.matrixWorld)
                if(inZone(v.x, v.z)) visuals.push([ v.x, v.z ])
            }
            return
        }

        /**
         * Dùng HỘP BAO, không dùng gốc toạ độ.
         *
         * Cụm chướng ngại vật là MỘT mesh gộp: gốc toạ độ nằm ở một góc còn
         * hình trải rộng cả chục đơn vị. Đo bằng gốc thì bộ kiểm báo oan sáu
         * "va chạm mồ côi" trong khi hình vẫn ở ngay đó.
         */
        o.updateWorldMatrix(true, false)
        if(!o.geometry.boundingBox) o.geometry.computeBoundingBox()
        box.copy(o.geometry.boundingBox).applyMatrix4(o.matrixWorld)
        boxes.push([ box.min.x, box.min.z, box.max.x, box.max.z ])
    })

    // ── A. Collider nào không có hình nào ở gần ─────────────────────────────
    const NEAR = 2.6
    const ghosts = []
    let scanned = 0

    world.forEachCollider((c) =>
    {
        const t = c.translation()
        if(!inZone(t.x, t.z)) return

        const he = c.shape.halfExtents
        const top = he ? t.y + he.y : t.y
        if(top < 0.3) return          // nằm bẹp dưới đất thì không chặn được xe
        scanned++

        for(const [ vx, vz ] of visuals)
            if(Math.abs(vx - t.x) < NEAR && Math.abs(vz - t.z) < NEAR) return

        for(const [ x0, z0, x1, z1 ] of boxes)
            if(t.x > x0 - NEAR && t.x < x1 + NEAR && t.z > z0 - NEAR && t.z < z1 + NEAR) return

        ghosts.push({
            x: +t.x.toFixed(1), y: +t.y.toFixed(2), z: +t.z.toFixed(1),
            co: he ? `${(he.x * 2).toFixed(2)}×${(he.y * 2).toFixed(2)}×${(he.z * 2).toFixed(2)}` : `hình ${c.shape.type}`,
            dinh: +top.toFixed(2),
        })
    })

    // ── B. Mặt phẳng tranh nhau chiều sâu ───────────────────────────────────
    const flats = []
    g.world.fptuCampus.group.traverse((o) =>
    {
        if(!o.isMesh || o.isInstancedMesh) return
        const s = o.scale, p = o.position
        if(s.y > 0.35) return
        if(!inZone(p.x, p.z)) return
        flats.push({
            top: +(p.y + Math.abs(s.y) / 2).toFixed(4),
            x0: p.x - Math.abs(s.x) / 2, x1: p.x + Math.abs(s.x) / 2,
            z0: p.z - Math.abs(s.z) / 2, z1: p.z + Math.abs(s.z) / 2,
            w: +Math.abs(s.x).toFixed(1), d: +Math.abs(s.z).toFixed(1),
        })
    })

    const fights = []
    for(let i = 0; i < flats.length; i++)
        for(let j = i + 1; j < flats.length; j++)
        {
            const a = flats[i], b = flats[j]
            if(Math.abs(a.top - b.top) > 0.008) continue     // chỉ bắt cái gần TRÙNG
            const ox = Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0)
            const oz = Math.min(a.z1, b.z1) - Math.max(a.z0, b.z0)
            if(ox > 0.5 && oz > 0.5)
                fights.push({ top: a.top, a: `${a.w}×${a.d}`, b: `${b.w}×${b.d}`, chong: `${ox.toFixed(1)}×${oz.toFixed(1)}` })
        }

    return { soVisual: visuals.length, soBox: boxes.length, scanned, ghosts, soFlat: flats.length, fights: fights.slice(0, 20), soFight: fights.length }
})

console.log(`đã gom ${r.soVisual} vị trí instanced + ${r.soBox} hộp bao · soi ${r.scanned} collider · ${r.soFlat} mặt lát`)

console.log(`\n══ A. VA CHẠM MỒ CÔI (chặn xe mà không thấy gì): ${r.ghosts.length} ══`)
for(const gh of r.ghosts) console.log(`  (${gh.x}, ${gh.y}, ${gh.z})  cỡ ${gh.co}  đỉnh ${gh.dinh}`)
if(!r.ghosts.length) console.log('  ✓ không có')

console.log(`\n══ B. MẶT TRANH NHAU CHIỀU SÂU (nhiễu nhấp nháy): ${r.soFight} ══`)
for(const f of r.fights) console.log(`  y=${f.top}  ${f.a} vs ${f.b}  chồng ${f.chong}`)
if(!r.soFight) console.log('  ✓ không có')

await browser.close()
process.exit(r.ghosts.length + r.soFight > 0 ? 1 : 0)
