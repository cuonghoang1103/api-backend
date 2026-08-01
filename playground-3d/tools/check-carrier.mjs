/**
 * KIỂM TÀU SÂN BAY — neo giữa biển, cạnh cây cầu đi ra đảo quái vật.
 *
 * Chạy: `PLAY_URL=http://localhost:5173 node tools/check-carrier.mjs`
 *
 * Canh đúng những thứ đã trả giá ở các khu trước:
 *  1. Xe lái được từ cây cầu chính, qua cầu dẫn, lên boong — quét hành lang
 *     bằng đúng cỡ thân xe. Đây là thứ THAY CHO LÁI THỬ.
 *  2. Cầu dẫn không có bậc nào cao quá bánh xe leo nổi (dốc ghép hộp là nguồn
 *     gốc mọi chỗ kẹt ở khu FPTU).
 *  3. Boong bay phẳng và LIỀN suốt chiều dài.
 *  4. Mọi collider có nửa-cạnh DƯƠNG — nửa-cạnh âm làm Rapier trả NaN và ĐỨNG
 *     KHUNG HÌNH, đúng lỗi đã mất cả buổi ở đảo quái.
 *  5. Tàu không đè lên cây cầu chính hay bờ đảo nào.
 */

const BASE = process.env.PLAY_URL ?? 'http://localhost:5173'
const { chromium } = await import('/Users/admin/Downloads/api-backend/node_modules/playwright/index.mjs')

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
page.on('pageerror', (error) => console.log('  [lỗi trang]', error.message))

await page.goto(`${BASE}/#skip`, { waitUntil: 'load' })
await page.waitForFunction(() => window.game?.world?.carrier, null, { timeout: 120000 })

const report = await page.evaluate(() =>
{
    const G = window.game
    const R = G.RAPIER
    const W = G.physics.world
    const problems = []
    const facts = {}
    const round = (n) => Math.round(n * 1000) / 1000

    const SHIP = { x: 46, z: -140, length: 92, width: 24, deckY: 3.6 }
    const RAMP = { z: -140, fromX: 5, toX: 28.4 }
    const BOW = { x: 46, fromZ: -80, toZ: -94 }

    const groundAt = (x, z, from = 40) =>
    {
        const hit = W.castRay(new R.Ray({ x, y: from, z }, { x: 0, y: -1, z: 0 }), from + 20, true)
        return hit ? from - hit.timeOfImpact : null
    }

    // ── 1. Boong bay phẳng và liền ──────────────────────────────────────────
    {
        let maxStep = 0
        let stepAt = null
        let previous = null
        let missing = 0

        for(let z = SHIP.z - SHIP.length * 0.46; z <= SHIP.z + SHIP.length * 0.46; z += 1)
        {
            const y = groundAt(SHIP.x, z)
            if(y === null) { missing++; continue }
            if(previous !== null && Math.abs(y - previous) > maxStep) { maxStep = Math.abs(y - previous); stepAt = round(z) }
            previous = y
        }

        facts.boongThieuMatCung = missing
        facts.bacCaoNhatTrenBoong = `${round(maxStep)} tại z = ${stepAt}`

        if(missing) problems.push(`Boong bay THỦNG ở ${missing} chỗ — không có mặt cứng`)
        if(maxStep > 0.3) problems.push(`Boong bay có bậc ${round(maxStep)} tại z = ${stepAt} — bánh xe không leo nổi`)
    }

    // ── 2. Cầu dẫn dốc đều, không bậc ───────────────────────────────────────
    {
        let maxStep = 0
        let stepAt = null
        let previous = null
        let missing = 0
        const heights = []

        for(let x = RAMP.fromX - 1; x <= RAMP.toX + 2; x += 0.5)
        {
            const y = groundAt(x, RAMP.z, 30)
            if(y === null) { missing++; continue }
            heights.push([ round(x), round(y) ])
            if(previous !== null && Math.abs(y - previous) > maxStep) { maxStep = Math.abs(y - previous); stepAt = round(x) }
            previous = y
        }

        facts.cauDanThieuMatCung = missing
        facts.bacCaoNhatCauDan = `${round(maxStep)} tại x = ${stepAt}`
        facts.caoDoCauDan = `${heights[0]?.[1]} → ${heights[heights.length - 1]?.[1]}`

        if(missing) problems.push(`Cầu dẫn THỦNG ở ${missing} chỗ — xe sẽ rơi xuống biển`)
        if(maxStep > 0.3) problems.push(`Cầu dẫn có bậc ${round(maxStep)} tại x = ${stepAt}`)
    }

    // ── 3. QUÉT HÀNH LANG XE: cầu chính → cầu dẫn → boong → hết đường băng ──
    {
        const CAR = { halfWidth: 0.95, halfHeight: 0.7 }
        const shape = new R.Cuboid(CAR.halfWidth, CAR.halfHeight, 1.4)

        /**
         * ⚠️ `lift` — trên mặt DỐC phải nâng hộp quét cao hơn.
         *
         * Hộp quét thẳng đứng, còn cầu dẫn thì nghiêng: ở mép hộp (cách tâm
         * 0,95 theo X) mặt cầu đã cao hơn chỗ bắn tia chừng 0,15. Để nguyên
         * 0,12 như mặt phẳng thì hộp CẮT VÀO chính cái dốc nó đang đứng, và bộ
         * kiểm báo oan 31 chỗ "bị chắn" trên một cây cầu dẫn hoàn toàn thông.
         */
        const sweep = (label, from, to, steps, lift = 0.12) =>
        {
            const blockers = []
            for(let i = 0; i <= steps; i++)
            {
                const t = i / steps
                const x = from.x + (to.x - from.x) * t
                const z = from.z + (to.z - from.z) * t
                const surface = groundAt(x, z, 40)
                if(surface === null) { blockers.push(`không có mặt cứng tại (${round(x)} · ${round(z)})`); continue }

                const hits = []
                W.intersectionsWithShape(
                    { x, y: surface + CAR.halfHeight + lift, z }, { x: 0, y: 0, z: 0, w: 1 }, shape,
                    (collider) => { hits.push(collider); return hits.length < 4 },
                )
                if(hits.length) blockers.push(`vật cản tại (${round(x)} · ${round(z)})`)
            }
            facts[`hanhLang_${label}`] = blockers.length ? `${blockers.length} chỗ: ${blockers.slice(0, 3).join(' · ')}` : 'thông suốt'
            if(blockers.length) problems.push(`Tuyến "${label}" bị chắn ở ${blockers.length} chỗ — ${blockers.slice(0, 2).join(' · ')}`)
        }

        sweep('cauDanLenBoong', { x: RAMP.fromX + 1, z: RAMP.z }, { x: RAMP.toX + 6, z: RAMP.z }, 40, 0.38)
        // Đường băng: từ đuôi lên mũi, men theo ĐÚNG tim đường băng (x − 1,5 —
        // chính là chỗ vạch tim được kẻ trong `setDeckMarkings()`), không phải
        // tim tàu. Quét lệch khỏi vạch là đo một hành lang không ai đi.
        sweep('duongBang', { x: SHIP.x - 1.5, z: SHIP.z - SHIP.length * 0.42 }, { x: SHIP.x - 1.5, z: SHIP.z + SHIP.length * 0.42 }, 50)
    }

    // ── 3b. CẦU DẪN MŨI: từ bờ đảo chính lên mũi tàu ────────────────────────
    // Đây là lối lên user thấy thiếu ("ở chỗ này phải có nút lên tàu chứ").
    {
        const CAR = { halfWidth: 0.95, halfHeight: 0.7 }
        const shape = new R.Cuboid(CAR.halfWidth, CAR.halfHeight, 1.4)
        const blockers = []
        let maxStep = 0
        let previous = null

        for(let z = BOW.fromZ + 1; z >= BOW.toZ - 3; z -= 0.5)
        {
            const surface = groundAt(BOW.x, z, 30)
            if(surface === null) { blockers.push(`không có mặt cứng tại z = ${round(z)}`); continue }
            if(previous !== null) maxStep = Math.max(maxStep, Math.abs(surface - previous))
            previous = surface

            const hits = []
            W.intersectionsWithShape(
                { x: BOW.x, y: surface + CAR.halfHeight + 0.38, z }, { x: 0, y: 0, z: 0, w: 1 }, shape,
                (collider) => { hits.push(collider); return hits.length < 4 },
            )
            if(hits.length) blockers.push(`vật cản tại z = ${round(z)}`)
        }

        facts.hanhLang_cauDanMui = blockers.length ? `${blockers.length} chỗ: ${blockers.slice(0, 3).join(' · ')}` : 'thông suốt'
        facts.bacCaoNhatCauDanMui = round(maxStep)

        if(blockers.length) problems.push(`Cầu dẫn MŨI bị chắn ở ${blockers.length} chỗ — ${blockers.slice(0, 2).join(' · ')}`)
        if(maxStep > 0.35) problems.push(`Cầu dẫn mũi có bậc ${round(maxStep)} — bánh xe không leo nổi`)
    }

    // ── 4. Mọi collider có nửa-cạnh DƯƠNG ───────────────────────────────────
    // Nửa-cạnh âm ⇒ Rapier trả NaN ⇒ vị trí xe NaN ⇒ âm lượng NaN ⇒
    // `setValueAtTime` ném lỗi giữa chuỗi tick ⇒ ĐỨNG KHUNG HÌNH. Đã xảy ra thật.
    {
        const bad = []
        let checked = 0

        W.forEachCollider((collider) =>
        {
            const t = collider.translation()
            if(Math.abs(t.x - SHIP.x) > SHIP.width * 1.6) return
            if(Math.abs(t.z - SHIP.z) > SHIP.length * 0.8) return
            checked++

            if(![ t.x, t.y, t.z ].every(Number.isFinite)) { bad.push('vị trí NaN'); return }

            const he = collider.halfExtents?.()
            if(!he) return
            if(![ he.x, he.y, he.z ].every(Number.isFinite))
                bad.push(`nửa-cạnh NaN tại (${round(t.x)} · ${round(t.z)})`)
            else if(he.x <= 0 || he.y <= 0 || he.z <= 0)
                bad.push(`nửa-cạnh ÂM tại (${round(t.x)} · ${round(t.y)} · ${round(t.z)}): (${round(he.x)}, ${round(he.y)}, ${round(he.z)})`)
        })

        facts.colliderDaSoi = checked
        facts.colliderKichThuocXau = bad.length ? bad.slice(0, 4).join(' · ') : 'không có'
        if(bad.length) problems.push(`${bad.length} collider nửa-cạnh âm/NaN — sẽ ĐỨNG KHUNG HÌNH: ${bad.slice(0, 3).join(' · ')}`)
    }

    // ── 5. Tàu không đè cây cầu chính, không đè bờ đảo nào ───────────────────
    {
        // Cầu chính rộng 10 quanh x = 0; tàu bắt đầu ở x = 34
        const gapToBridge = (SHIP.x - SHIP.width * 0.5) - 5
        facts.hoTuCauChinhToiManTau = round(gapToBridge)
        if(gapToBridge < 4) problems.push(`Tàu chỉ cách mép cầu chính ${round(gapToBridge)} — quá sát, cầu dẫn sẽ không có chỗ`)

        // Bờ Bắc đảo chính tại x = 46 (hình tròn bán kính ~96)
        const shoreZ = -Math.sqrt(Math.max(0, 96 * 96 - SHIP.x * SHIP.x))
        const bowZ = SHIP.z + SHIP.length * 0.5
        facts.muiTauSoVoiBoDaoChinh = `mũi ${round(bowZ)} · bờ ${round(shoreZ)} · hở ${round(shoreZ - bowZ)}`
        if(bowZ > shoreZ) problems.push(`Mũi tàu (${round(bowZ)}) đâm vào bờ đảo chính (${round(shoreZ)})`)

        // Đuôi tàu so với bờ Nam đảo quái (z = −200)
        const sternZ = SHIP.z - SHIP.length * 0.5
        facts.duoiTauSoVoiDaoQuai = `đuôi ${round(sternZ)} · bờ đảo quái −200 · hở ${round(sternZ + 200)}`
        if(sternZ < -200) problems.push(`Đuôi tàu (${round(sternZ)}) đâm vào đảo quái`)
    }

    // ── 6. Điểm hồi sinh đứng trên boong ────────────────────────────────────
    {
        const respawn = G.respawns.getByName('carrier')
        facts.diemHoiSinh = respawn ? `(${round(respawn.position.x)} · ${round(respawn.position.y)} · ${round(respawn.position.z)})` : 'THIẾU'

        if(!respawn) problems.push('Thiếu điểm hồi sinh "carrier" trong Respawns.js')
        else
        {
            const surface = groundAt(respawn.position.x, respawn.position.z)
            facts.matBoongTaiDiemHoiSinh = surface === null ? 'KHÔNG CÓ' : round(surface)
            if(surface === null) problems.push('Điểm hồi sinh không có boong bên dưới — xe rơi thẳng xuống biển')
            else if(Math.abs(surface - SHIP.deckY) > 0.4) problems.push(`Điểm hồi sinh không đứng trên boong (mặt cứng ở ${round(surface)}, boong ở ${SHIP.deckY})`)
        }
    }

    // ── 7. Radar quay — CHỈ khi tàu dựng hoàn toàn bằng mã ──────────────────
    // Dùng model thật thì cột radar đã nằm sẵn trong model, `setIsland()` không
    // chạy nữa. Đòi radar tự dựng lúc đó là báo oan.
    {
        const carrier = G.world.carrier
        facts.dungModelThat = carrier.usingModel ? 'có' : 'không (dựng bằng mã)'
        facts.coRadar = carrier.radarDish ? 'có' : '(model tự có — bỏ qua)'
        if(!carrier.radarDish && !carrier.usingModel) problems.push('Thiếu chảo radar trên đảo chỉ huy')
        else if(carrier.radarDish)
        {
            const before = carrier.radarDish.rotation.y
            for(let i = 0; i < 20; i++) carrier.update()
            facts.radarQuay = `${round(before)} → ${round(carrier.radarDish.rotation.y)}`
            if(Math.abs(carrier.radarDish.rotation.y - before) < 1e-6)
                problems.push('Radar KHÔNG quay')
        }
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
