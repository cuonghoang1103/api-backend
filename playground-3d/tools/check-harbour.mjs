/**
 * BỘ KIỂM BẾN CẢNG — 10 mục.
 *
 * Chạy: `PLAY_URL=http://127.0.0.1:5188 node tools/check-harbour.mjs`
 *
 * Khu này khác hai khu kia ở một điểm quan trọng: nó CỐ Ý dựng vật ra ngoài
 * hình đảo (cầu tàu, hải đăng, thuyền). Nên bộ kiểm không thể chỉ hỏi "có gì
 * nằm trên nước không" — nó phải hỏi ĐÚNG HAI câu tách bạch:
 *
 *   · thứ phải trên đất (bến, container, cần cẩu, kho) có đúng trên đất không
 *   · thứ trên biển (sàn cầu tàu) có LIỀN MẠCH không — sàn ghép hở một khe là
 *     một bậc bánh xe không leo nổi, đúng bài học đắt nhất của khu FPTU
 */
const { chromium } = await import(process.env.PW ?? '/home/user/api-backend/playground-3d/node_modules/playwright/index.mjs')

const BASE = process.env.PLAY_URL ?? 'http://127.0.0.1:5173'
const CHROME = process.env.CHROME ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'

const browser = await chromium.launch({
    executablePath: CHROME,
    args: [ '--enable-unsafe-swiftshader', '--use-gl=swiftshader' ],
})
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
const warnings = []
page.on('console', (m) => { if(m.text().includes('[Cảng]')) warnings.push(m.text()) })
page.on('pageerror', (e) => warnings.push('LỖI JS: ' + String(e).split('\n')[0]))

await page.goto(`${BASE}/#skip`, { waitUntil: 'load', timeout: 90000 })
await page.waitForFunction(() => window.game?.world?.playIsland?.harbour, null, { timeout: 180000 })
await page.waitForTimeout(8000)

const r = await page.evaluate(() =>
{
    const G = window.game
    const R = G.RAPIER
    const W = G.physics.world
    const island = G.world.playIsland
    const h = island.harbour
    const HF = R.ShapeType.HeightField

    const out = { vấn_đề: [], số_liệu: {} }
    const ray = (x, z) =>
    {
        const hit = W.castRay(new R.Ray({ x, y: 80, z }, { x: 0, y: -1, z: 0 }), 300, true)
        return hit ? 80 - hit.timeOfImpact : null
    }

    // 1. Dựng đủ chưa
    out.số_liệu.container = h.containers.length
    out.số_liệu.có_chùm_sáng = !!h.beam
    if(h.containers.length < 6) out.vấn_đề.push(`chỉ dựng ${h.containers.length}/6 container`)
    if(!h.beam) out.vấn_đề.push('hải đăng không có chùm sáng')

    // 2. SÀN CẦU TÀU PHẢI LIỀN MẠCH — bắn tia dọc thân cầu, tìm bậc lớn nhất
    /**
     * ⚠️ CHỈ quét tới z = 202, KHÔNG tới 205.
     *
     * Bản đầu quét tới hết cầu (205) và báo "BẬC 12,70 tại z = 203,4". Con số
     * đó là THÂN HẢI ĐĂNG: bệ đá rộng `radius × 2,6 = 5,72` quanh tâm z = 205,5
     * nên nó chiếm z ∈ [202,6 · 208,4], và tia bắn xuống trúng đỉnh tháp cao
     * 14,1 thay vì trúng sàn. Không có bậc nào cả — bộ kiểm tự báo oan, đúng
     * cái bẫy đã dính năm lần trước ở khu khác.
     *
     * Phần sàn NGƯỜI CHƠI ĐI ĐƯỢC là từ mép bến tới chân hải đăng.
     */
    let prev = null, worstStep = 0, stepAt = null, holes = 0
    for(let z = 193; z <= 202; z += 0.4)
    {
        const y = ray(34, z)
        if(y === null || y < -0.25) { holes++; prev = null; continue }
        if(prev !== null)
        {
            const d = Math.abs(y - prev)
            if(d > worstStep) { worstStep = d; stepAt = z }
        }
        prev = y
    }
    out.số_liệu.cầu_tàu_bậc_lớn_nhất = `${worstStep.toFixed(2)} tại z=${stepAt}`
    out.số_liệu.cầu_tàu_lỗ_thủng = holes
    if(worstStep > 0.25) out.vấn_đề.push(`cầu tàu có BẬC ${worstStep.toFixed(2)} tại z=${stepAt} — bánh xe không leo nổi`)
    if(holes > 0) out.vấn_đề.push(`cầu tàu THỦNG ${holes} chỗ — tia bắn xuống rơi vào nước`)

    // 3. Dốc lên cầu tàu phải nối liền mặt bến
    const bến = ray(34, 192)
    const chânDốc = ray(34, 193.5)
    out.số_liệu.mặt_bến = bến === null ? 'rỗng' : bến.toFixed(2)
    if(bến === null) out.vấn_đề.push('mặt bến rỗng — tấm lát không có va chạm')

    // 4. HÀNH LANG XE trên đường z = 184 đoạn qua ô đất cảng
    const shape = new R.Cuboid(0.95, 0.7, 0.95)
    const rot = { x: 0, y: 0, z: 0, w: 1 }
    const blockers = new Map()
    for(let x = 14; x <= 44; x += 0.5)
    {
        for(const dz of [ -3, 0, 3 ])
        {
            const z = 184 + dz
            const ground = ray(x, z)
            if(ground === null) continue
            W.intersectionsWithShape({ x, y: ground + 0.82, z }, rot, shape, (c) =>
            {
                const s = c.shape
                if(s.type === HF) return true
                const t = c.translation()
                const top = t.y + (s.halfExtents ? s.halfExtents.y : 0.5)
                if(top < 0.35) return true
                blockers.set(`${t.x.toFixed(0)}|${t.z.toFixed(0)}`, `[${t.x.toFixed(1)}·${t.z.toFixed(1)}]`)
                return true
            })
        }
    }
    out.số_liệu.chắn_hành_lang = blockers.size ? [ ...blockers.values() ].slice(0, 6).join(' ') : 'thông suốt'
    if(blockers.size) out.vấn_đề.push(`${blockers.size} vật chắn hành lang xe trên đường z=184`)

    /**
     * 4b. QUÉT HÀNH LANG XE DỌC CẦU TÀU.
     *
     * Lái tự động KHÔNG chạy được trong headless (xem mục 3 của bàn giao), nên
     * đây là thứ thay thế: đẩy một khối đúng cỡ xe (rộng 1,9 · cao 1,4) dọc tim
     * cầu và xem có gì chặn. Cầu chỉ rộng 5, lan can hai bên — nếu lan can vô ý
     * được cho va chạm thì phép quét này bắt ngay.
     */
    const jetty = new Map()
    for(let z = 194; z <= 201.5; z += 0.5)
    {
        const ground = ray(34, z)
        if(ground === null) continue
        W.intersectionsWithShape({ x: 34, y: ground + 0.82, z }, rot, shape, (c) =>
        {
            const sh = c.shape
            if(sh.type === HF) return true
            const t = c.translation()
            const topY = t.y + (sh.halfExtents ? sh.halfExtents.y : 0.5)
            // Bỏ qua chính mặt sàn (nằm dưới gầm xe)
            if(topY < ground + 0.3) return true
            jetty.set(`${t.x.toFixed(1)}|${t.z.toFixed(1)}`, `[${t.x.toFixed(1)}·${t.z.toFixed(1)}]`)
            return true
        })
    }
    out.số_liệu.hành_lang_cầu_tàu = jetty.size ? [ ...jetty.values() ].slice(0, 5).join(' ') : 'thông suốt'
    if(jetty.size) out.vấn_đề.push(`${jetty.size} vật chắn hành lang xe trên cầu tàu`)

    // 5. Thứ PHẢI trên đất thì phải trên đất
    for(const [ tên, x, z ] of [
        [ 'cần_cẩu', 47, 192 ], [ 'nhà_kho', 24, 175 ],
    ])
    {
        const d = island.shapeDistance(x, z)
        out.số_liệu[tên + '_shape'] = d.toFixed(3)
        if(d > 0.93) out.vấn_đề.push(`${tên} đứng trên đất mép nước (shape ${d.toFixed(3)})`)
    }
    for(const c of h.containers)
        if(island.shapeDistance(c.mesh.position.x, c.mesh.position.z) > 0.93)
            out.vấn_đề.push('có container đứng trên mép nước')

    // 6. Hải đăng phải CAO và phải ở ngoài đảo (đó là ý nghĩa của nó)
    const đỉnh = ray(34, 205.5)
    out.số_liệu.hải_đăng_cao = đỉnh === null ? 'rỗng' : đỉnh.toFixed(2)
    out.số_liệu.hải_đăng_ngoài_đảo = island.shapeDistance(34, 205.5) > 1
    if(đỉnh === null || đỉnh < 10) out.vấn_đề.push(`hải đăng chỉ cao ${đỉnh} — phải > 10`)
    if(island.shapeDistance(34, 205.5) <= 1) out.vấn_đề.push('hải đăng nằm TRÊN đảo — nó phải ở ngoài biển')

    // 7. Chùm sáng chỉ bật ban đêm
    const đêm = G.dayCycles.isNight()
    out.số_liệu.đang_là_đêm = đêm
    out.số_liệu.chùm_sáng_đang_hiện = h.beam.visible
    if(h.beam.visible !== đêm) out.vấn_đề.push(`chùm sáng ${h.beam.visible ? 'BẬT ban ngày' : 'TẮT ban đêm'}`)

    // 8. Điểm hồi sinh khai đủ và đứng trên đất chắc
    const rs = G.respawns.items.get('harbour')
    out.số_liệu.hồi_sinh = rs ? `${rs.position.x}·${rs.position.z}` : 'KHÔNG KHAI'
    if(!rs) out.vấn_đề.push('điểm hồi sinh "harbour" chưa khai trong Respawns.js')
    else
    {
        const y = ray(rs.position.x, rs.position.z)
        out.số_liệu.hồi_sinh_cao_độ = y === null ? 'rỗng' : y.toFixed(2)
        if(y === null || y < -0.25) out.vấn_đề.push(`điểm hồi sinh nằm trên nước (cao độ ${y})`)
    }

    // 9. Container phải có thân vật lý dynamic
    const thiếu = h.containers.filter(c => !c.object?.physical?.body).length
    if(thiếu) out.vấn_đề.push(`${thiếu} container không có thân vật lý — húc không đổ`)

    // 10. Không lấn sang làng (x < 10)
    if(h.containers.some(c => c.mesh.position.x < 10)) out.vấn_đề.push('có container lọt sang khu khác')

    return out
})

console.log('══ SỐ LIỆU ══')
for(const [ k, val ] of Object.entries(r.số_liệu))
    console.log(`  ${k.padEnd(26)} ${val}`)

if(warnings.length)
{
    console.log('\n══ CẢNH BÁO TỪ MÃ CẢNG ══')
    ;[ ...new Set(warnings) ].forEach(w => console.log('  ' + w))
}

console.log('\n══ KẾT LUẬN ══')
if(r.vấn_đề.length) { r.vấn_đề.forEach(v => console.log('  ❌ ' + v)); process.exitCode = 1 }
else console.log('  ✅ 0 lỗi')

await browser.close()
