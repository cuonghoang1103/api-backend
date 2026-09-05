/**
 * BỘ ĐO HIỆU NĂNG — draw call, mesh, đỉnh, chia theo TỪNG ĐẢO.
 *
 * Chạy: `PLAY_URL=http://127.0.0.1:5188 node tools/check-perf.mjs`
 * (cần `npm run dev` đang sống — `window.game` CHỈ lộ ở bản dev, xem
 * `sources/index.js` và cờ `VITE_GAME_PUBLIC` trong `.env.development`).
 *
 * ⚠️ KHÔNG đo FPS ở đây. Headless dựng bằng SwiftShader (GPU phần mềm), nên
 * mọi con số nhịp hình đọc được đều là nhịp của CPU máy dựng, không dính gì
 * tới máy người chơi. Ba thứ dưới đây thì ĐỘC LẬP với GPU và là đúng thứ đã
 * gây ra lần "game rất lag" ngày 1/8:
 *
 *   · draw call — số lượt gọi vẽ mỗi khung hình
 *   · mesh      — bao nhiêu vật thể riêng lẻ trong cảnh
 *   · đỉnh      — tổng hình học phải xử lý
 *
 * Bài học 1/8 nằm sẵn trong bàn giao: clone thẳng từng mảnh kit thành phố đẻ ra
 * 3035 mesh riêng, tổng thế giới vọt 3734 → 6759. Gộp bằng `InstancedMesh` kéo
 * về 3860. Bộ đo này để con số đó không lặng lẽ trôi lên lại sau mỗi khu mới.
 *
 * NGƯỠNG dưới đây là mốc đo ngày 04/09/2026 cộng biên 15%. Thêm khu mới mà vượt
 * ngưỡng thì hoặc gộp instance, hoặc chỉnh ngưỡng CÓ CHỦ Ý kèm lý do — đừng nới
 * cho qua.
 */
const { chromium } = await import(process.env.PW ?? '/home/user/api-backend/playground-3d/node_modules/playwright/index.mjs')

const BASE = process.env.PLAY_URL ?? 'http://127.0.0.1:5173'
const CHROME = process.env.CHROME ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'

const browser = await chromium.launch({
    executablePath: CHROME,
    args: [ '--enable-unsafe-swiftshader', '--use-gl=swiftshader' ],
})
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
const errors = []
page.on('pageerror', (e) => errors.push(String(e).split('\n')[0]))

await page.goto(`${BASE}/#skip`, { waitUntil: 'load', timeout: 90000 })
await page.waitForFunction(() => window.game?.world?.playIsland, null, { timeout: 180000 })

/**
 * ⚠️ XIN MỌI MODEL NẠP-KHI-CẦN TRƯỚC KHI ĐO.
 *
 * Từ 04/09/2026 `city.glb`, `carrier.glb` và `boss.glb` chỉ tải khi người chơi
 * lại gần. Bộ kiểm chạy thẳng thì đo một thế giới THIẾU — đo thật lúc mới thêm
 * cơ chế đó: thành phố còn 58 mesh thay vì 61+59 instanced, đảo quái 57 thay vì
 * 207, tàu sân bay 191 thay vì 228. Ngưỡng chống trôi vẫn báo xanh trong khi nó
 * đang gác một cảnh không tồn tại.
 *
 * Đây là cái giá chung của mọi tài nguyên chuyển sang nạp-khi-cần: **mọi bộ
 * kiểm chạm tới nó đều phải xin trước.** `check-carrier`, `check-city-island`
 * và `check-monster-island` đã sửa cùng lý do.
 */
await page.evaluate(() => window.game.world.carrier?.requestModel?.())
await page.evaluate(() => window.game.world.cityIsland?.requestModel?.())
await page.waitForFunction(
    () => window.game.world.cityIsland?.pieces?.size > 0 && window.game.world.carrier?.usingModel,
    null, { timeout: 120000 })

// để thế giới chạy vài nhịp cho instance kịp dựng
await page.waitForTimeout(8000)

const r = await page.evaluate(() =>
{
    const G = window.game
    const scene = G.rendering.scene ?? G.scene

    const stat = (root) =>
    {
        let mesh = 0, instanced = 0, instances = 0, verts = 0
        root.traverse((o) =>
        {
            if(!o.isMesh && !o.isInstancedMesh)
                return

            const n = o.geometry?.attributes?.position?.count ?? 0

            if(o.isInstancedMesh)
            {
                instanced++

                /**
                 * ⚠️ `count` CÓ THỂ LÀ `NaN`, và một `NaN` lọt vào là mọi con
                 * số phía sau thành `NaN` — bộ kiểm mất tác dụng mà vẫn báo
                 * xanh.
                 *
                 * Thủ phạm đã tìm ra 04/09/2026: `Whispers.js:16` viết
                 * `parseInt(import.meta.env.VITE_WHISPERS_COUNT)`, mà biến đó
                 * KHÔNG được khai ở bất kỳ tệp `.env` nào ⇒ `parseInt(undefined)`
                 * = `NaN` ⇒ `new InstancedMesh(..., NaN)`. Cả tính năng Whispers
                 * chết câm (nó gắn với máy chủ vốn cũng đang ngủ), nhưng cái
                 * mesh hỏng vẫn nằm trong cảnh.
                 *
                 * Ở đây coi `count` không hợp lệ là 0 thay vì để nó nuốt cả
                 * phép đo.
                 */
                const count = Number.isFinite(o.count) ? o.count : 0
                instances += count
                verts += n * count
            }
            else
            {
                mesh++
                verts += n
            }
        })
        return { mesh, instanced, instances, verts }
    }

    const world = G.world
    const islands = {}
    for(const [ name, key ] of [
        [ 'FPTU', 'fptuCampus' ], [ 'sân_chơi', 'playIsland' ],
        [ 'thành_phố', 'cityIsland' ], [ 'đảo_quái', 'monsterIsland' ],
        [ 'tàu_sân_bay', 'carrier' ], [ 'nhạc_hội', 'playConcert' ],
    ])
    {
        const m = world[key]
        const g = m?.group ?? m?.container
        if(g) islands[name] = stat(g)
    }

    const info = G.rendering.renderer.info
    return {
        toàn_cảnh: stat(scene),
        đảo: islands,
        drawCalls: info?.render?.drawCalls ?? null,
        backend: G.rendering.renderer.backend?.isWebGPUBackend ? 'WebGPU' : 'WebGL',
        quality: G.quality.level,
    }
})

/**
 * MỐC ĐO THẬT 04/09/2026, đo LẦN HAI sau khi bộ kiểm tự xin model nạp-khi-cần
 * (dev server, quality=1, WebGL/SwiftShader, thế giới ĐẦY ĐỦ):
 *
 *   mesh 3863 · instanced 147 (8137 bản sao) · 2,50 triệu đỉnh · 303 draw call
 *
 * ⚠️ Mốc cũ ghi ở đây (4353 mesh / 2,85tr đỉnh / 285 draw call) KHÔNG so được
 * với mốc này: nó đo khi mọi model còn tải lúc khởi động, và trước khi gộp
 * instance cho người tĩnh ở FPTU.
 *
 * ⚠️ `drawCalls` để 350 chứ không 340: gộp instance cho người ĐÁNH ĐỔI draw
 * call lấy số vật. Đo thật trước/sau: mesh 4390 → 3863 (−527) nhưng draw call
 * 287 → 303 (+16), vì batch gộp trải khắp khuôn viên nên cắt tầm nhìn thô hơn.
 * Đó là đổi có lợi ở đây — 300 draw call chưa phải nút thắt, còn 4390 vật cho
 * CPU duyệt mỗi khung hình thì có.
 *
 * Ngưỡng = mốc đo + ~15% biên. Đây là ngưỡng CHỐNG TRÔI, không phải mục tiêu:
 * nó chỉ nói "đừng tệ hơn hôm nay", không nói "hôm nay đã tốt".
 */
const NGƯỠNG = { mesh: 4450, đỉnh_triệu: 2.9, drawCalls: 350 }

const đỉnhTr = r.toàn_cảnh.verts / 1e6
console.log(`backend=${r.backend}  quality=${r.quality}`)
console.log(`\n══ TOÀN CẢNH ══`)
console.log(`  mesh thường   : ${r.toàn_cảnh.mesh}`)
console.log(`  InstancedMesh : ${r.toàn_cảnh.instanced}  (${r.toàn_cảnh.instances} bản sao)`)
console.log(`  đỉnh          : ${đỉnhTr.toFixed(2)} triệu`)
console.log(`  draw call     : ${r.drawCalls ?? 'không đọc được'}`)

console.log(`\n══ THEO ĐẢO ══`)
for(const [ name, s ] of Object.entries(r.đảo))
    console.log(`  ${name.padEnd(13)} mesh=${String(s.mesh).padStart(4)}  inst=${String(s.instanced).padStart(3)}(${s.instances})  đỉnh=${(s.verts/1e6).toFixed(2)}tr`)

const vấnĐề = []
if(r.toàn_cảnh.mesh > NGƯỠNG.mesh) vấnĐề.push(`mesh ${r.toàn_cảnh.mesh} > ngưỡng ${NGƯỠNG.mesh}`)
if(đỉnhTr > NGƯỠNG.đỉnh_triệu) vấnĐề.push(`đỉnh ${đỉnhTr.toFixed(2)}tr > ngưỡng ${NGƯỠNG.đỉnh_triệu}tr`)
if(r.drawCalls && r.drawCalls > NGƯỠNG.drawCalls) vấnĐề.push(`draw call ${r.drawCalls} > ngưỡng ${NGƯỠNG.drawCalls}`)
if(errors.length) vấnĐề.push(`${errors.length} lỗi JS: ${errors.slice(0,3).join(' | ')}`)

console.log(`\n══ KẾT LUẬN ══`)
if(vấnĐề.length) { vấnĐề.forEach(v => console.log('  ❌ ' + v)); process.exitCode = 1 }
else console.log('  ✅ 0 lỗi')

await browser.close()
