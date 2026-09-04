/**
 * BỘ KIỂM ĐẢO SÂN CHƠI — bắt đúng những thứ mắt không thấy trên ảnh chụp.
 *
 * Chạy: `node tools/check-play-island.mjs` (cần `npm run dev` đang sống).
 *
 * Kiểm bảy việc:
 *  1. Mặt sân bóng PHẲNG — không có gì nhô lên trong lòng sân ngoài quả bóng.
 *  2. Đường trục + cầu LIỀN MẠCH — không bậc nào cao quá 0,25 (xe leo được).
 *  3. Tường sân KÍN — không khe hở nào lọt bóng ra ngoài.
 *  4. Miệng khung thành THÔNG — bóng vào được, không bị cột chắn giữa.
 *  5. Không có VA CHẠM MỒ CÔI (collider không có hình nào gần) trên đảo.
 *  6. Không vật cứng nào nằm trong LÒNG ĐƯỜNG trục và hai đường ngang.
 *  7. Tiếng sóng KHÔNG gào kịch trần khi đứng giữa đảo (bẫy `terrain.size`).
 *
 * ⚠️ Bộ kiểm này KHÔNG bắt được "vật chắn lối xe" ở ngoài lòng đường đã khai.
 * Thêm bất cứ vật `physical` nào gần lối đi thì vẫn PHẢI lái thử lại.
 */

const BASE = process.env.PLAY_URL ?? 'http://localhost:5173'
const { chromium } = await import(process.env.PW ?? '/Users/admin/Downloads/api-backend/node_modules/playwright/index.mjs')

const browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {})
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })

page.on('pageerror', (error) => console.log('  [lỗi trang]', error.message))

await page.goto(`${BASE}/#skip`, { waitUntil: 'load' })
await page.waitForFunction(() => window.game?.world?.playIsland?.arena, null, { timeout: 60000 })

const report = await page.evaluate(() =>
{
    const G = window.game
    const R = G.RAPIER
    const W = G.physics.world
    const island = G.world.playIsland
    const arena = island.arena

    const problems = []
    const facts = {}

    /**
     * ⚠️ HeightField là **7**, KHÔNG phải 8 — enum của Rapier bỏ trống số 8 và
     * đẩy HalfSpace xuống 17. Đoán số này là lần báo oan thứ ba: nền đảo bị
     * tính thành "vật cứng nằm trong lòng đường" vì heightfield không có
     * `halfExtents` nên nóc rơi vào nhánh mặc định 0,5. Lấy từ enum, đừng gõ số.
     */
    const HEIGHTFIELD = R.ShapeType.HeightField

    const ray = (x, z, from = 60) =>
    {
        const hit = W.castRay(new R.Ray({ x, y: from, z }, { x: 0, y: -1, z: 0 }), 300, true)
        return hit ? from - hit.timeOfImpact : null
    }

    const rayInfo = (x, z, from = 60) =>
    {
        const hit = W.castRayAndGetNormal(new R.Ray({ x, y: from, z }, { x: 0, y: -1, z: 0 }), 300, true)
        if(!hit) return null
        const t = hit.collider.translation()
        return { y: from - hit.timeOfImpact, at: [ +t.x.toFixed(1), +t.y.toFixed(1), +t.z.toFixed(1) ] }
    }

    /**
     * Sân là ĐA GIÁC TÁM CẠNH (bốn góc bị vát), không phải hình chữ nhật. Quét
     * theo chữ nhật thì bốn góc vát rơi vào vùng quét và bộ kiểm báo oan "có
     * vật cao 2,64 giữa sân" — chính là tường góc. Đây là lần báo oan thứ nhất.
     */
    const cut = 4.5
    const insidePitch = (x, z) =>
    {
        if(x < arena.x0 || x > arena.x1 || z < arena.z0 || z > arena.z1) return false
        const dx = Math.min(x - arena.x0, arena.x1 - x)
        const dz = Math.min(z - arena.z0, arena.z1 - z)
        return dx + dz > cut
    }

    // ── 1. Mặt sân phẳng ────────────────────────────────────────────────────
    {
        const ballX = arena.ballHome.x
        const ballZ = arena.ballHome.z
        let worst = null
        for(let x = arena.x0 + 1; x <= arena.x1 - 1; x += 1)
        {
            for(let z = arena.z0 + 1; z <= arena.z1 - 1; z += 1)
            {
                if(!insidePitch(x, z)) continue
                if(Math.hypot(x - ballX, z - ballZ) < 3) continue // bỏ qua quả bóng
                const info = rayInfo(x, z)
                if(!info) { problems.push(`Mặt sân THỦNG ở (${x} · ${z})`); continue }
                if(info.y > 0.35 && (!worst || info.y > worst.y)) worst = { x, z, ...info }
            }
        }
        facts.matSanCaoNhat = worst ? `${worst.y.toFixed(2)} tại (${worst.x} · ${worst.z}), collider ở ${worst.at}` : 'phẳng đều'
        if(worst) problems.push(`Có vật nhô lên GIỮA SÂN: cao ${worst.y.toFixed(2)} tại (${worst.x} · ${worst.z}), collider ở [${worst.at}]`)
    }

    // ── 2. Đường trục + cầu liền mạch ───────────────────────────────────────
    {
        const check = (name, points) =>
        {
            let prev = null, worst = 0, worstAt = null
            for(const [ x, z ] of points)
            {
                const y = ray(x, z)
                if(y === null) { problems.push(`${name}: THỦNG ở (${x} · ${z})`); prev = null; continue }
                if(prev !== null)
                {
                    const step = Math.abs(y - prev)
                    if(step > worst) { worst = step; worstAt = [ x, z ] }
                }
                prev = y
            }
            facts[name] = `bậc lớn nhất ${worst.toFixed(3)} tại ${worstAt}`
            if(worst > 0.25) problems.push(`${name}: BẬC ${worst.toFixed(2)} tại (${worstAt}) — xe có thể kẹt`)
        }

        // ⚠️ Toạ độ đường lấy từ `island.roads` — gõ tay lại ở đây là bộ kiểm
        // sẽ đi soi lòng đường CŨ sau mỗi lần sửa bố cục.
        const spine = []
        for(let z = 70; z <= island.roads.spine.toZ; z += 0.5) spine.push([ island.roads.spine.x, z ])
        check('trucDuongVaCau', spine)

        for(const road of island.roads.cross)
        {
            const points = []
            for(let x = road.fromX; x <= road.toX; x += 0.5) points.push([ x, road.z ])
            check(`duongNgangZ${road.z}`, points)
        }
    }

    // ── 3. Tường sân kín ────────────────────────────────────────────────────
    {
        /**
         * Bắn tia từ TÂM SÂN ra 360°, không quét theo chu vi hình chữ nhật.
         * Quét theo chữ nhật thì bốn góc vát cho tia bắn vào chỗ trống và bộ
         * kiểm báo oan 16 chỗ hở — lần báo oan thứ hai. Bắn từ tâm thì mọi
         * hướng đều phải gặp một mặt cứng, trừ đúng hai miệng khung thành.
         */
        const gaps = []
        const y = 1.2
        const centre = { x: (arena.x0 + arena.x1) / 2, z: (arena.z0 + arena.z1) / 2 }
        const reach = Math.hypot(arena.x1 - arena.x0, arena.z1 - arena.z0)

        for(let deg = 0; deg < 360; deg += 0.5)
        {
            const angle = deg * Math.PI / 180
            const dx = Math.cos(angle)
            const dz = Math.sin(angle)
            const hit = W.castRay(new R.Ray({ x: centre.x, y, z: centre.z }, { x: dx, y: 0, z: dz }), reach, true)

            // Hướng gần như thẳng theo trục X là hướng của hai miệng khung —
            // ở đó tia chui qua miệng và chỉ gặp đáy lưới, xa hơn nửa chiều dài
            const towardsGoal = Math.abs(dz) < 0.22 && Math.abs(dx) > 0.9
            // Hướng về CỬA CHO XE ở giữa tường Bắc (−Z)
            const towardsGate = dz < -0.9 && Math.abs(dx) < 0.25
            if(hit === null && !towardsGoal && !towardsGate) gaps.push(`${deg.toFixed(1)}°`)
        }
        facts.tuongHo = gaps.length ? gaps.slice(0, 12).join(', ') : 'kín trừ hai khung thành và cửa xe'
        if(gaps.length) problems.push(`Tường sân HỞ ở ${gaps.length}/720 hướng: ${gaps.slice(0, 8).join(', ')}`)
    }

    /**
     * ── 3b. PHẢI CÓ LỐI VÀO SÂN CHO XE ─────────────────────────────────────
     *
     * ⚠️ MỤC NÀY SINH RA TỪ MỘT LỖI THẬT. Bản đầu quây tường kín cả tám cạnh và
     * QUÊN MẤT lối vào: đo được 0/360 hướng thông từ ngoài vào, tức người chơi
     * chỉ đứng ngoài nhìn cái sân. Tệ hơn, mục 3 ở trên lại KHẲNG ĐỊNH "tường
     * kín" là ĐẠT — bộ kiểm xác nhận đúng cái sai.
     *
     * Bài học rộng hơn: mỗi khi thêm một mục kiểm "phải kín / phải chặn", hãy
     * hỏi luôn "thế còn đường vào thì sao?" và thêm mục ngược lại.
     */
    {
        const y = 0.35                                   // cao độ gầm xe
        const centre = { x: (arena.x0 + arena.x1) / 2, z: (arena.z0 + arena.z1) / 2 }
        const ways = []
        for(let deg = 0; deg < 360; deg += 1)
        {
            const rad = deg * Math.PI / 180
            const ox = centre.x + Math.cos(rad) * 40
            const oz = centre.z + Math.sin(rad) * 40
            const hit = W.castRay(new R.Ray({ x: ox, y, z: oz }, { x: (centre.x - ox) / 40, y: 0, z: (centre.z - oz) / 40 }), 40, true)
            if(!hit || hit.timeOfImpact > 39) ways.push(deg)
        }
        facts.loiVaoSan = ways.length ? `${ways.length}/360 hướng thông từ ngoài vào (${ways[0]}°…${ways[ways.length - 1]}°)` : 'KHÔNG CÓ'
        if(ways.length === 0)
            problems.push('SÂN KÍN MÍT — không có lối nào cho xe vào, người chơi chỉ đứng ngoài nhìn')
    }

    // ── 4. Miệng khung thành thông ──────────────────────────────────────────
    {
        for(const side of [ -1, 1 ])
        {
            const mouthX = side < 0 ? arena.x0 : arena.x1
            let blocked = 0
            for(let z = 150 - 4.5; z <= 150 + 4.5; z += 0.5)
            {
                const hit = W.castRay(new R.Ray({ x: mouthX - side * 2, y: 1.4, z }, { x: side, y: 0, z: 0 }), 4, true)
                if(hit && hit.timeOfImpact < 3) blocked++
            }
            const name = side < 0 ? 'khungTay' : 'khungDong'
            facts[name] = `${blocked}/19 điểm bị chắn trong miệng`
            if(blocked > 3) problems.push(`Miệng ${name} bị CHẮN ${blocked}/19 điểm — bóng khó vào`)
        }
    }

    // ── 5. Va chạm mồ côi trên đảo ──────────────────────────────────────────
    {
        // Gom hộp bao của mọi mesh thuộc đảo (kể cả quả bóng treo dưới scene)
        const boxes = []
        const collect = (root) => root.traverse((o) =>
        {
            if(!o.isMesh && !o.isInstancedMesh) return
            o.updateWorldMatrix(true, false)
            const bb = o.geometry.boundingBox ?? (o.geometry.computeBoundingBox(), o.geometry.boundingBox)
            const b = bb.clone().applyMatrix4(o.matrixWorld)
            boxes.push(b)
        })
        collect(island.group)
        if(arena.ball?.mesh) collect(arena.ball.mesh)

        const orphans = []
        W.forEachCollider((c) =>
        {
            const t = c.translation()
            if(t.x < -60 || t.x > 72 || t.z < 96 || t.z > 204) return   // ngoài đảo
            const s = c.shape
            if(s.type === HEIGHTFIELD) return                           // nền đảo
            let near = false
            for(const b of boxes)
            {
                if(t.x > b.min.x - 2.5 && t.x < b.max.x + 2.5 &&
                   t.y > b.min.y - 2.5 && t.y < b.max.y + 2.5 &&
                   t.z > b.min.z - 2.5 && t.z < b.max.z + 2.5) { near = true; break }
            }
            if(!near) orphans.push([ +t.x.toFixed(1), +t.y.toFixed(1), +t.z.toFixed(1) ])
        })
        facts.vaChamMoCoi = orphans.length ? orphans.slice(0, 10).map(o => `[${o}]`).join(' ') : 'không có'
        if(orphans.length) problems.push(`${orphans.length} VA CHẠM MỒ CÔI (vật vô hình chặn xe): ${orphans.slice(0, 6).map(o => `[${o}]`).join(' ')}`)
    }

    // ── 6. Vật cứng trong lòng đường ────────────────────────────────────────
    {
        const inRoad = []
        W.forEachCollider((c) =>
        {
            const t = c.translation()
            const s = c.shape
            if(s.type === HEIGHTFIELD) return
            const top = t.y + (s.halfExtents ? s.halfExtents.y : (s.radius ?? 0.5))
            if(top < 0.3) return                                        // tấm lát mặt đường

            const spine = island.roads.spine
            let onRoad = Math.abs(t.x - spine.x) < spine.halfWidth && t.z > spine.fromZ && t.z < spine.toZ
            for(const road of island.roads.cross)
                onRoad = onRoad || (Math.abs(t.z - road.z) < road.halfWidth && t.x > road.fromX && t.x < road.toX)

            if(onRoad) inRoad.push([ +t.x.toFixed(1), +t.y.toFixed(1), +t.z.toFixed(1), `nóc ${top.toFixed(2)}` ])
        })
        facts.vatTrongLongDuong = inRoad.length ? inRoad.slice(0, 10).map(o => `[${o}]`).join(' ') : 'không có'
        if(inRoad.length) problems.push(`${inRoad.length} vật CỨNG NẰM TRONG LÒNG ĐƯỜNG: ${inRoad.slice(0, 6).map(o => `[${o}]`).join(' ')}`)
    }

    /**
     * ── 8. HÀNH LANG XE — thay cho lái thử ──────────────────────────────────
     *
     * Quét một khối hộp bằng đúng KÍCH CỠ XE (rộng 1,9 · cao 1,4) dọc từng
     * tuyến đường, xem có vật cứng nào chạm vào không. Bắt được cả vật đứng
     * ngoài lòng đường mà THÂN thò vào — thứ mà phép kiểm "tâm collider nằm
     * trong lòng đường" ở mục 6 bỏ sót, và cũng chính là kiểu lỗi đã bốn lần
     * chặn lối xe ở khu FPTU.
     *
     * ⚠️ VÌ SAO KHÔNG LÁI THẬT: đo ngày 1/8, xe trong headless KHÔNG BAO GIỜ
     * chạy. `PhysicsVehicle.updatePostPhysics()` tính `speed` từ TOÀN BỘ vector
     * dịch chuyển, kể cả thành phần Y, rồi `goingForward = direction · forward
     * > 0.5`. Xe ở headless nhún giảm xóc không tắt (`linvel.y` đứng ở −1,15),
     * nên `direction` gần như thẳng đứng ⇒ `goingForward` luôn false ⇒ nhánh
     * "đang lùi mà đạp ga" trong `updatePrePhysics()` đặt `engineForce = 0` và
     * phanh gấp, vĩnh viễn. Đo được: `engineForce` = 0 ở cả bốn bánh dù
     * `player.accelerating` = 1 và cả bốn bánh đều chạm đất. Ca đối chứng ở
     * chỗ đất trống trên ĐẢO CHÍNH cũng đi 0,0 — tức khung lái hỏng chứ không
     * phải bản đồ có vật chắn.
     */
    {
        const CAR_HALF_WIDTH = 0.95
        const CAR_HEIGHT = 1.4
        const shape = new R.Cuboid(CAR_HALF_WIDTH, CAR_HEIGHT / 2, CAR_HALF_WIDTH)
        const rot = { x: 0, y: 0, z: 0, w: 1 }

        const sweep = (name, points) =>
        {
            const blockers = new global.Map()
            for(const [ x, z ] of points)
            {
                const ground = ray(x, z)
                if(ground === null) continue
                const pos = { x, y: ground + CAR_HEIGHT / 2 + 0.12, z }
                W.intersectionsWithShape(pos, rot, shape, (collider) =>
                {
                    const s = collider.shape
                    if(s.type === HEIGHTFIELD) return true
                    // Quả bóng nằm chính giữa sân là chuyện đương nhiên — nó là
                    // thứ để húc, không phải vật cản. Báo oan thứ tư nếu quên.
                    if(collider.parent()?.handle === arena.ball.body.handle) return true
                    const t = collider.translation()
                    // Tấm lát mặt đường nằm dưới gầm, không phải vật chắn
                    if(t.y + (s.halfExtents ? s.halfExtents.y : 0.5) < 0.3) return true
                    const key = `${t.x.toFixed(1)}|${t.y.toFixed(1)}|${t.z.toFixed(1)}`
                    if(!blockers.has(key)) blockers.set(key, { at: key, tai: `(${x} · ${z})` })
                    return true
                })
            }
            facts[`hanhLang_${name}`] = blockers.size ? [ ...blockers.values() ].slice(0, 6).map(b => `[${b.at}] gặp ở ${b.tai}`).join(' · ') : 'thông suốt'
            if(blockers.size)
                problems.push(`${name}: ${blockers.size} vật CHẶN HÀNH LANG XE — ${[ ...blockers.values() ].slice(0, 4).map(b => `[${b.at}]`).join(' ')}`)
        }

        const spine = island.roads.spine
        const spinePts = []
        for(let z = 78; z <= spine.toZ; z += 0.5) spinePts.push([ spine.x, z ])
        sweep('trucDuongVaCau', spinePts)

        for(const road of island.roads.cross)
        {
            const pts = []
            for(let x = road.fromX; x <= road.toX; x += 0.5) pts.push([ x, road.z ])
            sweep(`duongNgangZ${road.z}`, pts)
        }

        // Trong lòng sân bóng: chạy dọc tim sân và ngang giữa sân
        const pitchPts = []
        for(let x = arena.x0 + 2; x <= arena.x1 - 2; x += 0.5) pitchPts.push([ x, 150 ])
        for(let z = arena.z0 + 2; z <= arena.z1 - 2; z += 0.5) pitchPts.push([ arena.x0 + (arena.x1 - arena.x0) / 2, z ])
        sweep('trongLongSanBong', pitchPts)
    }

    // ── 7. Tiếng sóng ───────────────────────────────────────────────────────
    {
        const d = island.distanceToShore(6, 150)
        facts.khoangCachToiBoGiuaDao = d.toFixed(1)
        if(!(d > 20)) problems.push(`distanceToShore ở giữa đảo chỉ ${d.toFixed(1)} — tiếng sóng sẽ gào (phải > 20)`)

        const dSea = island.distanceToShore(6, 240)
        facts.khoangCachToiBoNgoaiBien = dSea.toFixed(1)
        if(dSea > 0) problems.push(`distanceToShore ngoài biển ra số DƯƠNG (${dSea.toFixed(1)}) — hình đảo sai`)
    }

    return { problems, facts }
})

await browser.close()

console.log('\n── SỐ LIỆU ĐO ───────────────────────────────────────────')
for(const [ key, value ] of Object.entries(report.facts))
    console.log(`  ${key}: ${value}`)

console.log('\n── KẾT QUẢ ──────────────────────────────────────────────')
if(report.problems.length === 0)
{
    console.log('  ✅ 0 lỗi')
}
else
{
    for(const problem of report.problems) console.log(`  ❌ ${problem}`)
    console.log(`\n  ${report.problems.length} lỗi`)
}
console.log()

process.exit(report.problems.length ? 1 : 0)
