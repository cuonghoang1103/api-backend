/**
 * KIỂM ĐẢO QUÁI VẬT — đảo thứ năm, sân khấu chế độ Sinh tồn.
 *
 * Chạy: `PLAY_URL=http://localhost:5173 node tools/check-monster-island.mjs`
 * (cần `npm run dev` sống — truyền đúng cổng Vite THẬT, nó hay nhảy cổng).
 *
 * ⚠️ KHÔNG tự bơm `ticker.events.trigger('tick')` và KHÔNG gọi
 * `physicalVehicle.moveTo()` liên tục — vòng lặp rAF thật vẫn chạy song song,
 * bơm chồng lên là Rapier ném "recursive use of an object … unsafe aliasing".
 * Ở đây chỉ ĐỌC trạng thái và bắn tia, không bước mô phỏng.
 *
 * ─── CANH NHỮNG GÌ ───
 *  1. Đảo không chồng lên bốn đảo cũ (chồng heightfield = xe rơi vào khe, kẹt cứng)
 *  2. Xe qua được cầu VÀ ba tuyến đường — quét hành lang bằng đúng cỡ thân xe
 *  3. Mặt cầu liền mạch, không bậc nào cao quá bánh xe leo nổi
 *  4. Va chạm mồ côi (vật vô hình chặn xe)
 *  5. Cảnh quan không mọc vào lòng đường hay ô đất đã chừa
 *  6. Tiếng sóng không gào kịch trần trên đảo (bẫy `terrain.size`)
 *  7. Điểm hồi sinh đứng trên đất, không rơi xuống biển
 */

const BASE = process.env.PLAY_URL ?? 'http://localhost:5173'
const { chromium } = await import('/Users/admin/Downloads/api-backend/node_modules/playwright/index.mjs')

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
page.on('pageerror', (error) => console.log('  [lỗi trang]', error.message))

await page.goto(`${BASE}/#skip`, { waitUntil: 'load' })
await page.waitForFunction(() => window.game?.world?.monsterIsland, null, { timeout: 90000 })

const report = await page.evaluate(() =>
{
    const G = window.game
    const R = G.RAPIER
    const W = G.physics.world
    const mi = G.world.monsterIsland
    const problems = []
    const facts = {}
    const round = (n) => Math.round(n * 1000) / 1000

    const ISLAND = { x: 0, z: -300, width: 240, depth: 200 }

    /** Cao độ mặt cứng tại (x, z) — bắn tia từ trên trời xuống. */
    const groundAt = (x, z) =>
    {
        const hit = W.castRay(new R.Ray({ x, y: 80, z }, { x: 0, y: -1, z: 0 }), 240, true)
        return hit ? 80 - hit.timeOfImpact : null
    }

    // ── 1. Đảo không chồng lên bốn đảo cũ ───────────────────────────────────
    {
        const others = [
            { name: 'đảo chính', x: 0, z: 0, width: 192, depth: 192 },
            { name: 'FPTU', x: -162, z: 30, width: 160, depth: 148 },
            { name: 'sân chơi', x: 6, z: 150, width: 124, depth: 100 },
            { name: 'thành phố', x: 232, z: 20, width: 172, depth: 152 },
        ]

        const overlaps = []
        for(const other of others)
        {
            const gapX = Math.abs(ISLAND.x - other.x) - (ISLAND.width + other.width) * 0.5
            const gapZ = Math.abs(ISLAND.z - other.z) - (ISLAND.depth + other.depth) * 0.5
            if(gapX < 0 && gapZ < 0) overlaps.push(`${other.name} (hở X ${round(gapX)}, hở Z ${round(gapZ)})`)
        }

        facts.chongLenDaoCu = overlaps.length ? overlaps.join(' · ') : 'không đảo nào'
        if(overlaps.length)
            problems.push(`Đảo quái CHỒNG lên: ${overlaps.join(' · ')} — hai heightfield chồng nhau làm xe kẹt vào khe giữa chúng`)
    }

    // ── 2. Quét HÀNH LANG XE trên cầu và ba tuyến đường ─────────────────────
    /**
     * Đẩy một khối hộp bằng đúng cỡ thân xe dọc từng tuyến. Bắt được cả vật
     * đứng NGOÀI lòng đường mà thân thò vào — thứ phép kiểm "tâm collider nằm
     * trong lòng đường" bỏ sót, và cũng đúng kiểu lỗi đã BỐN LẦN chặn lối xe ở
     * khu FPTU. Đây là thứ thay cho lái thử (lái tự động không chạy headless).
     */
    {
        const CAR = { halfWidth: 0.95, halfHeight: 0.7 }
        const shape = new R.Cuboid(CAR.halfWidth, CAR.halfHeight, 1.4)

        const sweep = (label, from, to, steps) =>
        {
            const blockers = []
            for(let i = 0; i <= steps; i++)
            {
                const t = i / steps
                const x = from.x + (to.x - from.x) * t
                const z = from.z + (to.z - from.z) * t
                const surface = groundAt(x, z)
                if(surface === null) { blockers.push(`không có mặt cứng tại (${round(x)} · ${round(z)})`); continue }

                const y = surface + CAR.halfHeight + 0.12
                const hits = []
                W.intersectionsWithShape(
                    { x, y, z }, { x: 0, y: 0, z: 0, w: 1 }, shape,
                    (collider) => { hits.push(collider); return hits.length < 4 },
                )
                if(hits.length) blockers.push(`vật cản tại (${round(x)} · ${round(z)})`)
            }
            facts[`hanhLang_${label}`] = blockers.length ? `${blockers.length} chỗ: ${blockers.slice(0, 3).join(' · ')}` : 'thông suốt'
            if(blockers.length)
                problems.push(`Tuyến "${label}" bị chắn ở ${blockers.length} chỗ — ${blockers.slice(0, 2).join(' · ')}`)
        }

        const roads = mi.roads
        sweep('cau', { x: 0, z: -86 }, { x: 0, z: -202 }, 60)
        sweep('duongTruc', { x: roads.spine.x, z: roads.spine.fromZ }, { x: roads.spine.x, z: roads.spine.toZ }, 60)
        roads.cross.forEach((road, index) =>
            sweep(`duongNgang${index + 1}`, { x: road.fromX, z: road.z }, { x: road.toX, z: road.z }, 50))
    }

    // ── 3. Mặt cầu liền mạch — không bậc nào quá cao ────────────────────────
    {
        let maxStep = 0
        let stepAt = null
        let previous = null
        for(let z = -86; z >= -204; z -= 1)
        {
            const y = groundAt(0, z)
            if(y === null) { problems.push(`Cầu THỦNG tại z = ${z} — không có mặt cứng`); continue }
            if(previous !== null && Math.abs(y - previous) > maxStep)
            {
                maxStep = Math.abs(y - previous)
                stepAt = z
            }
            previous = y
        }

        facts.bacCaoNhatTrenCau = `${round(maxStep)} tại z = ${stepAt}`
        // Bánh xe leo được chừng 0,35; để ngưỡng 0,3 cho có biên an toàn
        if(maxStep > 0.3)
            problems.push(`Mặt cầu có bậc ${round(maxStep)} tại z = ${stepAt} — bánh xe không leo nổi`)
    }

    // ── 3b. MỌI COLLIDER PHẢI CÓ NỬA-CẠNH DƯƠNG VÀ HỮU HẠN ─────────────────
    /**
     * ⚠️ MỤC QUAN TRỌNG NHẤT CỦA BỘ KIỂM NÀY — nó bắt đúng lỗi đã làm ĐỨNG
     * KHUNG HÌNH cả game ngày 1/8.
     *
     * Viết `toZ - fromZ` cho một đảo nằm ở z ÂM (z giảm dần) ra chiều dài −186,
     * và số âm đó đi thẳng vào `halfExtents` của Rapier. Cuboid nửa-cạnh âm thì
     * mọi va chạm với nó trả về NaN: vị trí xe NaN → âm lượng NaN →
     * `setValueAtTime` NÉM LỖI giữa chuỗi tick → mọi handler sau đó, kể cả
     * `Rendering.render` (nhịp 998), không bao giờ chạy.
     *
     * Ba thứ khiến nó gần như không thể tìm ra bằng mắt:
     *  · HÌNH vẫn hiện bình thường (mesh scale âm chỉ lật mặt)
     *  · chỉ hỏng khi xe CHẠM vào, nên đứng yên thì không sao
     *  · không tất định — có lần lái qua vẫn êm
     */
    {
        const bad = []
        const huge = []
        let checked = 0

        W.forEachCollider((collider) =>
        {
            const t = collider.translation()
            if(Math.abs(t.x - ISLAND.x) > ISLAND.width) return
            if(Math.abs(t.z - ISLAND.z) > ISLAND.depth) return
            checked++

            if(![ t.x, t.y, t.z ].every(Number.isFinite))
            {
                bad.push('vị trí NaN')
                return
            }

            const he = collider.halfExtents?.()
            if(!he) return

            if(![ he.x, he.y, he.z ].every(Number.isFinite))
                bad.push(`nửa-cạnh NaN tại (${round(t.x)} · ${round(t.z)})`)
            else if(he.x <= 0 || he.y <= 0 || he.z <= 0)
                bad.push(`nửa-cạnh ÂM/BẰNG 0 tại (${round(t.x)} · ${round(t.y)} · ${round(t.z)}): (${round(he.x)}, ${round(he.y)}, ${round(he.z)})`)
            else if(he.x > 300 || he.y > 300 || he.z > 300)
                huge.push(`(${round(t.x)} · ${round(t.z)}) = (${round(he.x)}, ${round(he.y)}, ${round(he.z)})`)
        })

        facts.colliderDaSoiKichThuoc = checked
        facts.colliderKichThuocXau = bad.length ? bad.slice(0, 4).join(' · ') : 'không có'
        if(huge.length) facts.colliderKhongLo = huge.slice(0, 3).join(' · ')

        if(bad.length)
            problems.push(`${bad.length} collider có nửa-cạnh âm/NaN — Rapier sẽ trả NaN khi xe chạm vào và ĐỨNG KHUNG HÌNH: ${bad.slice(0, 3).join(' · ')}`)
    }

    // ── 4. Va chạm mồ côi (vật vô hình chặn xe) ─────────────────────────────
    /**
     * Gom hộp bao của MỌI hình trên đảo (kể cả từng bản sao của `InstancedMesh`),
     * rồi soi từng collider xem có hình nào ở gần không. Collider không có hình
     * nào gần = thứ chặn xe mà người chơi không thấy gì.
     *
     * ⚠️ Bộ kiểm tương tự ở khu FPTU đã tự báo oan HAI lần: một lần vì không
     * đọc `InstancedMesh`, một lần vì đo mesh bằng GỐC TOẠ ĐỘ thay vì hộp bao.
     * Ở đây làm đúng cả hai.
     */
    {
        const boxes = []
        // Lấy hàm dựng Box3/Matrix4 từ chính đối tượng trong scene — script chạy
        // trong trang nên không import được `three` theo đường thường
        const first = mi.group.children.find(c => c.isMesh && c.geometry)
        if(first && !first.geometry.boundingBox) first.geometry.computeBoundingBox()
        const THREE_Box3 = first?.geometry?.boundingBox?.constructor
        const Matrix4 = mi.group.matrix.constructor

        mi.group.traverse((child) =>
        {
            if(!child.isMesh || !child.geometry) return
            if(!child.geometry.boundingBox) child.geometry.computeBoundingBox()
            const bb = child.geometry.boundingBox
            if(!bb || !THREE_Box3) return

            child.updateMatrixWorld(true)

            if(child.isInstancedMesh)
            {
                const m = new Matrix4()
                for(let i = 0; i < child.count; i++)
                {
                    child.getMatrixAt(i, m)
                    const world = new Matrix4().multiplyMatrices(child.matrixWorld, m)
                    boxes.push(new THREE_Box3().copy(bb).applyMatrix4(world))
                }
            }
            else
            {
                boxes.push(new THREE_Box3().copy(bb).applyMatrix4(child.matrixWorld))
            }
        })

        facts.soHopBaoHinh = boxes.length

        const orphans = []
        let checked = 0
        W.forEachCollider((collider) =>
        {
            const t = collider.translation()
            // Chỉ soi collider nằm trong phạm vi đảo
            if(Math.abs(t.x - ISLAND.x) > ISLAND.width * 0.6) return
            if(t.z > ISLAND.z + ISLAND.depth * 0.6 || t.z < ISLAND.z - ISLAND.depth * 0.6) return
            // Bỏ qua heightfield (nền đảo) — nó không có hộp bao theo kiểu này
            if(collider.shapeType() === 7) return
            checked++

            let near = false
            for(const box of boxes)
            {
                const dx = Math.max(box.min.x - t.x, 0, t.x - box.max.x)
                const dy = Math.max(box.min.y - t.y, 0, t.y - box.max.y)
                const dz = Math.max(box.min.z - t.z, 0, t.z - box.max.z)
                if(dx * dx + dy * dy + dz * dz < 9) { near = true; break }
            }
            if(!near) orphans.push(`(${round(t.x)} · ${round(t.y)} · ${round(t.z)})`)
        })

        facts.colliderDaSoi = checked
        facts.vaChamMoCoi = orphans.length ? orphans.slice(0, 4).join(' · ') : 'không có'
        if(orphans.length)
            problems.push(`${orphans.length} va chạm MỒ CÔI (chặn xe mà không thấy gì): ${orphans.slice(0, 3).join(' · ')}`)
    }

    // ── 5. Cảnh quan không mọc vào lòng đường / ô đất đã chừa ───────────────
    {
        let intruders = 0
        const samples = []
        mi.group.traverse((child) =>
        {
            if(!child.isInstancedMesh) return
            const Matrix4 = mi.group.matrix.constructor
            const m = new Matrix4()
            for(let i = 0; i < child.count; i++)
            {
                child.getMatrixAt(i, m)
                const x = m.elements[12]
                const z = m.elements[14]
                // Vệt nứt, vệt gỉ và đồ trên cầu CỐ Ý nằm ở đó — bỏ qua
                if(child.name.includes('crack') || child.name.includes('rustStain')) continue
                if(child.name.includes('bridge') || child.name.includes('cable')) continue

                /**
                 * ⚠️ Gai của tổ quái nằm TRONG ô đất của chính tổ quái — đúng
                 * theo thiết kế, không phải lỗi. Dùng `blocked()` cho nó là báo
                 * oan 25 cái gai (đã xảy ra). Với thứ thuộc về một công trình,
                 * câu hỏi đúng là "có chặn lối xe không?" — tức `onRoad()`.
                 */
                const trespass = child.name.includes('spike') ? mi.onRoad(x, z) : mi.blocked(x, z)
                if(trespass)
                {
                    intruders++
                    if(samples.length < 4) samples.push(`${child.name.replace('monsterIsland:', '')} tại (${round(x)} · ${round(z)})`)
                }
            }
        })

        facts.canhQuanLanVaoVungCam = intruders ? `${intruders} — ${samples.join(' · ')}` : 'không có'
        if(intruders)
            problems.push(`${intruders} vật cảnh quan mọc vào lòng đường hoặc ô đất đã chừa: ${samples.join(' · ')}`)
    }

    // ── 6. Tiếng sóng không gào kịch trần trên đảo ──────────────────────────
    /**
     * Bản mẫu tính âm lượng sóng theo mép ĐỊA HÌNH GỐC (nửa cạnh 96). Đảo này ở
     * z −400…−200 nên công thức trả số âm khắp nơi, bị kẹp về 1 và sóng gào
     * kịch trần suốt — đúng lỗi đã mất cả buổi ở khu FPTU rồi lặp lại ở đảo sân
     * chơi. Cứu bằng `distanceToShore()` móc vào `Audio.js`.
     */
    {
        const centre = mi.distanceToShore(ISLAND.x, ISLAND.z)
        const offshore = mi.distanceToShore(ISLAND.x, ISLAND.z + ISLAND.depth * 0.5 + 40)

        facts.khoangCachBo_giuaDao = round(centre)
        facts.khoangCachBo_ngoaiBien = round(offshore)

        if(!(centre > 40))
            problems.push(`Giữa đảo mà distanceToShore chỉ ${round(centre)} — tiếng sóng sẽ gào kịch trần ở trong đất liền`)
        if(!(offshore < 0))
            problems.push(`Ngoài biển mà distanceToShore vẫn dương (${round(offshore)})`)

        const wired = G.audio?.groups?.get?.('waves') !== undefined
        facts.audioCoNhomSong = wired ? 'có' : 'không thấy nhóm waves'
    }

    // ── 7. Điểm hồi sinh đứng trên đất ──────────────────────────────────────
    {
        const respawn = G.respawns.getByName('monster')
        facts.diemHoiSinh = respawn ? `(${round(respawn.position.x)} · ${round(respawn.position.z)})` : 'THIẾU'

        if(!respawn) problems.push('Thiếu điểm hồi sinh "monster" trong Respawns.js')
        else
        {
            const surface = groundAt(respawn.position.x, respawn.position.z)
            facts.matDatTaiDiemHoiSinh = surface === null ? 'KHÔNG CÓ' : round(surface)
            if(surface === null)
                problems.push('Điểm hồi sinh không có mặt cứng bên dưới — xe sẽ rơi thẳng xuống biển')
            else if(surface < -0.3)
                problems.push(`Điểm hồi sinh nằm dưới mực nước (${round(surface)})`)
        }
    }

    // ── 8. Vài mốc địa hình phải khớp giữa hàm cao độ và va chạm thật ───────
    {
        const spots = [
            [ 0, -250, 'đường trục' ],
            [ -74, -262, 'khu nhà đổ' ],
            [ 0, -390, 'cuối đường trục' ],
            [ -104, -250, 'đầu Tây đường ngang' ],
        ]
        const mismatches = []
        for(const [ x, z, label ] of spots)
        {
            const real = groundAt(x, z)
            const expected = mi.islandHeight(x, z)
            if(real === null) { mismatches.push(`${label}: không có mặt cứng`); continue }
            if(Math.abs(real - expected) > 0.6) mismatches.push(`${label}: tia ${round(real)} ≠ hàm ${round(expected)}`)
        }
        facts.hamCaoDoKhopVaCham = mismatches.length ? mismatches.join(' · ') : 'khớp ở mọi mốc'
        if(mismatches.length)
            problems.push(`Hàm cao độ lệch va chạm thật: ${mismatches.join(' · ')}`)
    }

    return { problems, facts }
})

await browser.close()

console.log('\n── SỐ LIỆU ĐO ───────────────────────────────────────────')
for(const [ key, value ] of Object.entries(report.facts))
    console.log(`  ${key}: ${value}`)

console.log('\n── KẾT QUẢ ──────────────────────────────────────────────')
if(report.problems.length === 0) console.log('  ✅ 0 lỗi')
else
{
    for(const problem of report.problems) console.log(`  ❌ ${problem}`)
    console.log(`\n  ${report.problems.length} lỗi`)
}
console.log()

process.exit(report.problems.length ? 1 : 0)
