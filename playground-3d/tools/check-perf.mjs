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
                instances += o.count
                verts += n * o.count
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
 * MỐC ĐO THẬT 04/09/2026 (dev server, quality=1, WebGL/SwiftShader):
 *   mesh 4353 · instanced 107 (7578 bản sao) · 2,85 triệu đỉnh · 285 draw call
 * Ngưỡng = mốc đó + ~15% biên. Đây là ngưỡng CHỐNG TRÔI, không phải mục tiêu:
 * nó chỉ nói "đừng tệ hơn hôm nay", không nói "hôm nay đã tốt".
 */
const NGƯỠNG = { mesh: 5000, đỉnh_triệu: 3.3, drawCalls: 400 }

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
