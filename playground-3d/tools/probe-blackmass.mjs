/**
 * TRUY MẢNG ĐEN CHE MÀN HÌNH (Sinh tồn)
 *
 * Người chơi báo: bật Sinh tồn là có "bóng đen to bay chập chờn che mất màn
 * hình". Tám lượt chẩn đoán từ xa đều trượt vì bộ kiểm cũ đo SAI CHỖ:
 *
 *  · Nó đo hộp bao của HÌNH HỌC GỐC (tư thế nghỉ). Lưới bọc xương lúc chạy bị
 *    xương kéo đi chỗ khác — hộp bao gốc không nói gì về cái đang được vẽ.
 *  · Nó đo "cỡ chia khoảng cách", một ước lượng. Thứ cần đo là PHẦN TRĂM KHUNG
 *    NHÌN bị che, và chỉ có phép chiếu lên máy quay mới trả lời được.
 *  · Nó chờ game tự chơi tới lượt quái nặng ký xuất hiện. Headless chạy ~0,05×
 *    thời gian thực nên chưa bao giờ tới sóng 3 — brute và trùm KHÔNG BAO GIỜ
 *    được kiểm.
 *
 * Bộ này chữa cả ba: ép sinh đủ bốn loại ngay lập tức, biến dạng đỉnh theo
 * xương thật (`applyBoneTransform`) rồi chiếu lên máy quay thật.
 *
 * Chạy: `PLAY_URL=http://localhost:64893 node tools/probe-blackmass.mjs`
 */

const BASE = process.env.PLAY_URL ?? 'http://localhost:5173'
const { chromium } = await import(process.env.PW ?? '/Users/admin/Downloads/api-backend/node_modules/playwright/index.mjs')

const browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {})
const page = await browser.newPage({ viewport: { width: 480, height: 320 } })
page.on('pageerror', (error) => console.log('  [lỗi trang]', error.message))

console.log('· Nạp trang…')
await page.goto(`${BASE}/#skip`, { waitUntil: 'load' })
await page.waitForFunction(() => window.game?.world?.survival, null, { timeout: 90000 })
await page.waitForSelector('.js-welcome-play', { timeout: 90000 })
await page.evaluate(() => document.querySelector('.js-welcome-play')?.click())
await page.waitForFunction(() => (window.game?.reveal?.distance?.value ?? 0) > 1000, null, { timeout: 90000 })
await page.waitForTimeout(1500)

console.log('· Bật Sinh tồn và ép sinh đủ bốn loại quái…')
const spawned = await page.evaluate(() =>
{
    const survival = window.game.world.survival
    if(!survival.enabled) survival.enable()

    const vehicle = window.game.world.vehicle
    const p = vehicle?.position ?? { x: 0, z: 0 }

    // Sinh sát xe để không con nào bị `despawnDistance` thu hồi mất — đây chính
    // là cái bẫy đã làm hỏng năm lần chụp màn hình trước.
    const types = [ 'crawler', 'stalker', 'brute', 'boss' ]
    const made = []
    types.forEach((t, i) =>
    {
        const a = (i / types.length) * Math.PI * 2
        try { survival.monsters.spawn(t, p.x + Math.cos(a) * 7, p.z + Math.sin(a) * 7); made.push(t) }
        catch(e) { made.push(`${t}:LỖI ${e.message}`) }
    })
    return { made, count: survival.monsters.monsters.length }
})
console.log('  ', JSON.stringify(spawned))

/**
 * Đo trong 120 khung hình liên tiếp. Một khung hình là không đủ: lỗi người chơi
 * mô tả là "chập chờn", nghĩa là nó chỉ nổ ra ở VÀI TƯ THẾ trong chu kỳ đi.
 */
console.log('· Theo dõi 120 khung hình…')
const report = await page.evaluate(() => new Promise((resolve) =>
{
    const G = window.game
    const cam = G.view.camera
    const worst = new Map()
    let frames = 0

    // `three` không có biến toàn cục ở bản dựng này — mượn lớp Vector3 từ một
    // vector có sẵn thay vì cố nhập mô-đun từ trong trang
    const Vector3 = cam.position.constructor
    const v = new Vector3()
    const ndc = new Vector3()

    const measure = () =>
    {
        cam.updateMatrixWorld(true)
        cam.updateProjectionMatrix()

        G.scene.traverse((c) =>
        {
            if((!c.isMesh && !c.isSkinnedMesh) || !c.visible) return
            const pos = c.geometry?.attributes?.position
            if(!pos) return

            c.updateMatrixWorld(true)

            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
            let spanY = 0, loY = Infinity, hiY = -Infinity
            let anyFront = false

            // Lấy mẫu đỉnh — đủ dày để bắt được chi vươn xa, đủ thưa để 120
            // khung hình chạy xong trong vài giây
            const step = Math.max(1, Math.floor(pos.count / 60))
            for(let i = 0; i < pos.count; i += step)
            {
                v.fromBufferAttribute(pos, i)

                // ⚠ ĐÂY là mấu chốt: với lưới bọc xương, toạ độ trong buffer là
                // TƯ THẾ NGHỈ. Phải cho xương kéo nó đi thì mới ra chỗ thật.
                if(c.isSkinnedMesh && c.applyBoneTransform) c.applyBoneTransform(i, v)
                v.applyMatrix4(c.matrixWorld)

                loY = Math.min(loY, v.y); hiY = Math.max(hiY, v.y)

                ndc.copy(v).applyMatrix4(cam.matrixWorldInverse)
                if(ndc.z < 0) anyFront = true

                ndc.copy(v).project(cam)
                minX = Math.min(minX, ndc.x); maxX = Math.max(maxX, ndc.x)
                minY = Math.min(minY, ndc.y); maxY = Math.max(maxY, ndc.y)
            }
            spanY = hiY - loY

            if(!anyFront) return
            const w = Math.min(maxX, 1) - Math.max(minX, -1)
            const h = Math.min(maxY, 1) - Math.max(minY, -1)
            const coverage = (w <= 0 || h <= 0) ? 0 : (w * h) / 4

            const chain = []
            for(let p = c; p && chain.length < 12; p = p.parent) chain.push(p.name || p.type)

            // Nó thuộc con quái nào? Đối chiếu tổ tiên với gốc của từng con
            let owner = ''
            for(const m of G.world.survival.monsters.monsters)
            {
                for(let p = c; p; p = p.parent) if(p === m.root) { owner = m.spec?.key || m.type || '?'; break }
                if(owner) break
            }

            const key = (owner ? `[QUÁI ${owner}] ` : '') + chain.join(' ← ')

            const prev = worst.get(key)
            if(!prev || coverage > prev.coverage)
                worst.set(key, { coverage, spanY, frame: frames })
        })

        frames++
        if(frames < 120) requestAnimationFrame(measure)
        else resolve({
            frames,
            monsters: G.world.survival.monsters.monsters.length,
            phase: G.world.survival.phase,
            camY: cam.position.y,
            list: [ ...worst.entries() ]
                .map(([ k, x ]) => ({ what: k, pct: +(x.coverage * 100).toFixed(1), cao: +x.spanY.toFixed(2) }))
                .filter(x => x.pct > 8 || x.cao > 12 || x.what.startsWith('[QUÁI'))
                .sort((a, b) => b.cao - a.cao)
                .slice(0, 30),
        })
    }
    requestAnimationFrame(measure)
}))

console.log('')
console.log('  nhịp:', report.phase, '· quái:', report.monsters, '· máy quay y =', report.camY.toFixed(1))
console.log('')
console.log('  ĐỘ CHE MÀN HÌNH LỚN NHẤT (qua', report.frames, 'khung hình)')
console.log('  ' + '─'.repeat(76))
for(const r of report.list)
    console.log(`  ${String(r.pct).padStart(6)}%  cao ${String(r.cao).padStart(9)}  ${r.what}`)
if(!report.list.length) console.log('   (không có gì đáng ngờ)')
console.log('')

await browser.close()
