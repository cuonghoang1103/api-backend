/**
 * KIỂM LUẬT CHƠI SÂN BÓNG — bàn thắng, bảng điểm, reset bóng, biên sân.
 *
 * Chạy: `node tools/check-arena-rules.mjs` (cần `npm run dev` đang sống).
 *
 * ⚠️ KHÔNG tự bơm `ticker.events.trigger('tick')` và KHÔNG gọi
 * `physicalVehicle.moveTo()` — vòng lặp rAF thật vẫn chạy song song, bơm chồng
 * lên là Rapier ném "recursive use of an object … unsafe aliasing in rust".
 * Ở đây chỉ đặt vị trí quả bóng rồi gọi thẳng `arena.update()`, mà hàm đó chỉ
 * ĐỌC `translation()` chứ không bước mô phỏng.
 */

const BASE = process.env.PLAY_URL ?? 'http://localhost:5173'
const { chromium } = await import(process.env.PW ?? '/Users/admin/Downloads/api-backend/node_modules/playwright/index.mjs')

const browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {})
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
page.on('pageerror', (error) => console.log('  [lỗi trang]', error.message))

await page.goto(`${BASE}/#skip`, { waitUntil: 'load' })
await page.waitForFunction(() => window.game?.world?.playIsland?.arena, null, { timeout: 60000 })

const report = await page.evaluate(async () =>
{
    const G = window.game
    const arena = G.world.playIsland.arena
    const problems = []
    const facts = {}

    const put = (x, y, z) =>
    {
        arena.ball.body.setTranslation({ x, y, z }, true)
        arena.ball.body.setLinvel({ x: 0, y: 0, z: 0 }, true)
    }

    // Ảnh chụp nội dung bảng điểm, để biết nó có VẼ LẠI thật không
    const boardSignature = () =>
    {
        const c = arena.board.canvas
        const d = arena.board.ctx.getImageData(0, 0, c.width, c.height).data
        let sum = 0
        for(let i = 0; i < d.length; i += 997) sum = (sum + d[i] * (i % 251)) >>> 0
        return sum
    }

    // ── 1. Bóng bắt đầu ở giữa sân ──────────────────────────────────────────
    {
        const p = arena.ball.body.translation()
        facts.viTriBanDau = `(${p.x.toFixed(1)} · ${p.y.toFixed(2)} · ${p.z.toFixed(1)})`
        if(Math.hypot(p.x - arena.ballHome.x, p.z - arena.ballHome.z) > 1)
            problems.push(`Bóng không nằm giữa sân lúc khởi tạo: ${facts.viTriBanDau}`)
        if(Math.abs(p.y - (G.world.playIsland.groundTop + 1.45 + 0.1)) > 0.3)
            problems.push(`Bóng khởi tạo sai cao độ: y = ${p.y.toFixed(2)}`)
    }

    // ── 2. Bàn thắng vào khung TÂY (điểm cho đội Cam/Đông) ──────────────────
    {
        const before = { ...arena.score }
        const signBefore = boardSignature()

        arena.lastGoalTime = -999
        put(arena.x0 - 2, 1.5, arena.z0 + (arena.z1 - arena.z0) / 2)
        arena.update()

        facts.banThangKhungTay = `Xanh ${arena.score.west} — ${arena.score.east} Cam (trước: ${before.west}—${before.east})`
        if(arena.score.east !== before.east + 1)
            problems.push(`Bóng qua vạch vôi khung TÂY mà điểm đội Cam không tăng (${before.east} → ${arena.score.east})`)
        if(arena.score.west !== before.west)
            problems.push(`Điểm đội Xanh tự đổi khi thủng lưới Tây`)
        if(boardSignature() === signBefore)
            problems.push('Bảng điểm KHÔNG vẽ lại sau bàn thắng')
    }

    // ── 3. Bóng phải được đưa về giữa sân sau bàn thắng ─────────────────────
    {
        const p = arena.ball.body.translation()
        facts.viTriSauBanThang = `(${p.x.toFixed(1)} · ${p.z.toFixed(1)})`
        if(Math.hypot(p.x - arena.ballHome.x, p.z - arena.ballHome.z) > 1)
            problems.push(`Bóng không về giữa sân sau bàn thắng: ${facts.viTriSauBanThang}`)
    }

    // ── 4. Bàn thắng vào khung ĐÔNG ─────────────────────────────────────────
    {
        const before = { ...arena.score }
        arena.lastGoalTime = -999
        put(arena.x1 + 2, 1.5, arena.z0 + (arena.z1 - arena.z0) / 2)
        arena.update()

        facts.banThangKhungDong = `Xanh ${arena.score.west} — ${arena.score.east} Cam`
        if(arena.score.west !== before.west + 1)
            problems.push(`Bóng qua vạch vôi khung ĐÔNG mà điểm đội Xanh không tăng (${before.west} → ${arena.score.west})`)
    }

    // ── 5. Bóng bay TRÊN NÓC lưới KHÔNG phải bàn thắng ──────────────────────
    {
        const before = { ...arena.score }
        arena.lastGoalTime = -999
        put(arena.x0 - 2, 5.5, 150)      // cao hơn `goal.height` = 3,2
        arena.update()

        facts.bayTrenNocLuoi = `Xanh ${arena.score.west} — ${arena.score.east} Cam (không đổi là đúng)`
        if(arena.score.east !== before.east)
            problems.push('Bóng bay TRÊN NÓC lưới vẫn bị tính là bàn thắng')
    }

    // ── 6. Bóng lệch ngoài cột dọc KHÔNG phải bàn thắng ─────────────────────
    {
        const before = { ...arena.score }
        arena.lastGoalTime = -999
        put(arena.x0 - 2, 1.5, 150 + 9)  // lệch xa hơn nửa bề rộng khung (5,5)
        arena.update()

        facts.lechNgoaiCot = `Xanh ${arena.score.west} — ${arena.score.east} Cam (không đổi là đúng)`
        if(arena.score.east !== before.east)
            problems.push('Bóng lệch RA NGOÀI cột dọc vẫn bị tính là bàn thắng')
    }

    // ── 7. Bóng văng khỏi sân thì tự về giữa ────────────────────────────────
    {
        arena.lastGoalTime = -999
        put(arena.x1 + 40, 1.5, 150)
        arena.update()
        const p = arena.ball.body.translation()
        facts.vangKhoiSan = `(${p.x.toFixed(1)} · ${p.z.toFixed(1)})`
        if(Math.hypot(p.x - arena.ballHome.x, p.z - arena.ballHome.z) > 1)
            problems.push(`Bóng văng khỏi sân không tự về giữa: ${facts.vangKhoiSan}`)
    }

    // ── 8. Nút đặt lại tỉ số ────────────────────────────────────────────────
    {
        arena.score.west = 7
        arena.score.east = 4
        arena.restartPoint.interactCallback?.() ?? arena.restartPoint.callbacks?.interact?.()
        facts.sauKhiDatLai = `Xanh ${arena.score.west} — ${arena.score.east} Cam`
        if(arena.score.west !== 0 || arena.score.east !== 0)
            problems.push(`"Đặt lại tỉ số" không đưa về 0—0 (đang ${arena.score.west}—${arena.score.east})`)
    }

    // ── 9. Quả bóng có thân động và va chạm đúng hình cầu ───────────────────
    {
        const body = arena.ball.body
        facts.thanBong = `kiểu ${body.bodyType()} · khối lượng ${body.mass().toFixed(2)}`
        if(body.bodyType() !== 0) problems.push(`Quả bóng KHÔNG phải thân động (bodyType = ${body.bodyType()})`)

        let ballColliders = 0
        G.physics.world.forEachCollider((c) => { if(c.parent()?.handle === body.handle) ballColliders++ })
        facts.colliderCuaBong = ballColliders
        if(ballColliders !== 1) problems.push(`Quả bóng có ${ballColliders} collider, đáng lẽ 1`)
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
