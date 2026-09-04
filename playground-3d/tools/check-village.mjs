/**
 * BỘ KIỂM LÀNG NGÔN NGỮ — 9 mục.
 *
 * Chạy: `PLAY_URL=http://127.0.0.1:5188 node tools/check-village.mjs`
 * (cần `npm run dev` đang sống — `window.game` chỉ lộ ở bản dev).
 *
 * Ba mục đầu sinh ra từ đúng ba lỗi ĐÃ XẢY RA trên đảo này:
 *
 *   1. **Hành lang xe** — đường ngang z = 184 chạy XUYÊN ô đất làng (từ
 *      x = −34 sang Đông). Đây là lần thứ TƯ một khu được dựng đè lên lòng
 *      đường; ba lần trước là sân bóng, tổ quái, và khán đài nhạc hội.
 *   2. **Mép nước** — `PLOTS.village` khai z 171…197 nhưng đảo là siêu-ellipse
 *      bậc 4, và `shapeDistance(-30, 197)` đo được 1,013 ⇒ mép Nam ô đất nằm
 *      DƯỚI NƯỚC. Ô đất chữ nhật trong dữ liệu không biết chuyện đó.
 *   3. **Va chạm mồ côi / vật chắn lối** — mọi thứ `physical` gần đường.
 */
const { chromium } = await import(process.env.PW ?? '/home/user/api-backend/playground-3d/node_modules/playwright/index.mjs')

const BASE = process.env.PLAY_URL ?? 'http://127.0.0.1:5173'
const CHROME = process.env.CHROME ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'

const browser = await chromium.launch({
    executablePath: CHROME,
    args: [ '--enable-unsafe-swiftshader', '--use-gl=swiftshader' ],
})
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
const jsErrors = []
page.on('pageerror', (e) => jsErrors.push(String(e).split('\n')[0]))
page.on('console', (m) => { if(m.type() === 'warning' && m.text().includes('[Làng]')) jsErrors.push(m.text()) })

await page.goto(`${BASE}/#skip`, { waitUntil: 'load', timeout: 90000 })
await page.waitForFunction(() => window.game?.world?.playIsland?.village, null, { timeout: 180000 })
await page.waitForTimeout(8000)

const r = await page.evaluate(() =>
{
    const G = window.game
    const R = G.RAPIER
    const W = G.physics.world
    const island = G.world.playIsland
    const v = island.village
    const HF = R.ShapeType.HeightField

    const out = { vấn_đề: [], số_liệu: {} }
    const ray = (x, z) =>
    {
        const hit = W.castRay(new R.Ray({ x, y: 80, z }, { x: 0, y: -1, z: 0 }), 300, true)
        return hit ? 80 - hit.timeOfImpact : null
    }

    // 1. Dựng đủ chưa
    out.số_liệu.khối_chữ = v.letters.length
    out.số_liệu.đèn = v.lanternMeshes.length
    out.số_liệu.mặt_đồng_hồ = v.clockHands?.length ?? 0
    if(v.letters.length < 10) out.vấn_đề.push(`chỉ dựng ${v.letters.length} khối chữ — có khối bị chốt loại`)
    if(v.clockHands?.length !== 4) out.vấn_đề.push('tháp đồng hồ không đủ 4 mặt')

    // 2. QUÉT HÀNH LANG XE dọc đường z = 184, đoạn chạy qua ô đất
    const shape = new R.Cuboid(0.95, 0.7, 0.95)
    const rot = { x: 0, y: 0, z: 0, w: 1 }
    const blockers = new Map()
    for(let x = -34; x <= -12; x += 0.5)
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

    // 3. MÉP NƯỚC — mọi khối chữ phải đứng trên đất chắc
    let ướt = 0
    for(const entry of v.letters)
    {
        const p = entry.mesh.position
        if(island.shapeDistance(p.x, p.z) > 0.93) ướt++
    }
    out.số_liệu.khối_chữ_sát_nước = ướt
    if(ướt) out.vấn_đề.push(`${ướt} khối chữ đứng quá sát mép nước`)

    // 4. Ô đất khai trong PLOTS có thật sự nằm trên đảo không
    const góc = [ [ -48, 171 ], [ -12, 171 ], [ -48, 197 ], [ -12, 197 ] ]
    const ngoài = góc.filter(([ x, z ]) => island.shapeDistance(x, z) > 1)
    out.số_liệu.góc_ô_đất_ngoài_đảo = ngoài.length ? ngoài.map(g => g.join('·')).join(' ') : 'cả 4 góc trên đảo'

    // 5. Mọi công trình phải đứng trên đất, không lơ lửng và không chìm
    const mốc = [
        [ 'quảng_trường', -40, 184 ], [ 'torii', -41, 178 ], [ 'vườn_đá', -41, 174 ],
        [ 'cổng_tam_quan', -22, 178 ], [ 'đình', -22, 173 ], [ 'tháp_đồng_hồ', -26, 192 ],
    ]
    for(const [ tên, x, z ] of mốc)
    {
        const y = ray(x, z)
        out.số_liệu[tên] = y === null ? 'KHÔNG CÓ GÌ' : y.toFixed(2)
        if(y === null) out.vấn_đề.push(`${tên}: tia bắn xuống không trúng gì — chỗ đó rỗng`)
    }

    // Tháp đồng hồ phải CAO. Trúng mặt đất (≈0,04) nghĩa là nó không dựng lên,
    // hoặc toạ độ dò trong bộ kiểm đã lệch khỏi chỗ tháp đứng — cả hai đều là
    // lỗi cần biết, và bản đầu của bộ kiểm này đã dính đúng vế thứ hai.
    const đỉnhTháp = ray(-26, 192)
    if(đỉnhTháp === null || đỉnhTháp < 8)
        out.vấn_đề.push(`tháp đồng hồ chỉ cao ${đỉnhTháp} — phải > 8`)

    // 6. Điểm hồi sinh phải khai trong Respawns VÀ đứng trên đất chắc
    const rs = G.respawns.items.get('village')
    out.số_liệu.hồi_sinh = rs ? `${rs.position.x}·${rs.position.z}` : 'KHÔNG KHAI'
    if(!rs) out.vấn_đề.push('điểm hồi sinh "village" chưa khai trong Respawns.js')
    else
    {
        const y = ray(rs.position.x, rs.position.z)
        if(y === null || y < -0.5) out.vấn_đề.push(`điểm hồi sinh nằm trên nước (cao độ ${y})`)
        out.số_liệu.hồi_sinh_cao_độ = y === null ? 'rỗng' : y.toFixed(2)
    }

    // 7. Dùng CHUNG VocabQuiz với Bricks, không dựng cái thứ hai
    const quizOfBricks = G.world.bricks?.vocabQuiz
    out.số_liệu.dùng_chung_quiz = !!quizOfBricks
    if(!quizOfBricks) out.vấn_đề.push('không thấy world.bricks.vocabQuiz — khối chữ sẽ không hỏi được gì')

    // 8. Khối chữ phải là thân dynamic có onCollision
    const thiếuThân = v.letters.filter(e => !e.object?.physical?.body).length
    out.số_liệu.khối_chữ_thiếu_thân_vật_lý = thiếuThân
    if(thiếuThân) out.vấn_đề.push(`${thiếuThân} khối chữ không có thân vật lý — tông vào không ăn`)

    // 9. Không đè lên khu nhạc hội (z 133…167) hay sân bóng
    const chồng = v.letters.filter(e => e.mesh.position.z < 168).length
    if(chồng) out.vấn_đề.push(`${chồng} khối chữ lọt sang khu khác (z < 168)`)

    return out
})

console.log('══ SỐ LIỆU ══')
for(const [ k, val ] of Object.entries(r.số_liệu))
    console.log(`  ${k.padEnd(26)} ${val}`)

if(jsErrors.length)
{
    console.log('\n══ CẢNH BÁO TỪ MÃ LÀNG ══')
    ;[ ...new Set(jsErrors) ].forEach(e => console.log('  ' + e))
}

console.log('\n══ KẾT LUẬN ══')
if(r.vấn_đề.length) { r.vấn_đề.forEach(v => console.log('  ❌ ' + v)); process.exitCode = 1 }
else console.log('  ✅ 0 lỗi')

await browser.close()
