/**
 * TÁCH BẠCH: MODEL CÓ XƯƠNG HỎNG Ở KHÂU NÀO
 *
 * `probe-blackmass.mjs` đã chỉ đúng thủ phạm: lưới `Object_89` của model
 * crawler cao **382 đơn vị** lúc chạy và che trọn khung nhìn. Bộ này trả lời
 * câu tiếp theo — hỏng ở ĐÂU:
 *
 *   A. Ngay tư thế gốc, chưa đụng gì   → file hỏng sẵn
 *   B. Sau khi lắp `AnimationMixer`     → xương/clip lệch đơn vị
 *   C. Chỉ sau khi clip chạy được vài giây → hoạt ảnh kéo xương đi hoang
 *
 * Đo bằng `applyBoneTransform` — thứ duy nhất nói được lưới bọc xương đang
 * thật sự nằm ở đâu. Hộp bao hình học gốc là tư thế NGHỈ và không biết gì về
 * việc xương đã kéo đỉnh đi chỗ khác; chính nó đã cho ra con số 1,332 làm tôi
 * tưởng model lành suốt ba phiên.
 */

const BASE = process.env.PLAY_URL ?? 'http://localhost:5173'
const { chromium } = await import('/Users/admin/Downloads/api-backend/node_modules/playwright/index.mjs')

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 480, height: 320 } })
page.on('pageerror', (error) => console.log('  [lỗi trang]', error.message))

await page.goto(`${BASE}/#skip`, { waitUntil: 'load' })
await page.waitForFunction(() => window.game?.resources?.bossModel, null, { timeout: 90000 })
await page.waitForSelector('.js-welcome-play', { timeout: 90000 })
await page.evaluate(() => document.querySelector('.js-welcome-play')?.click())
await page.waitForTimeout(2500)

const out = await page.evaluate(async () =>
{
    const G = window.game
    const Vector3 = G.view.camera.position.constructor

    /**
     * Không nhập lại mô-đun `three` được: trong trang, tên gói trần không giải
     * được. Nên bộ này KHÔNG tự dựng bản sao — nó ép game sinh quái thật rồi
     * mượn chính `mixer` của con đó, và so với `source.scene` chưa ai đụng vào.
     */

    /** Chiều cao THẬT của lưới sau khi xương kéo đỉnh đi. */
    const span = (root) =>
    {
        root.updateMatrixWorld(true)
        const v = new Vector3()
        let lo = Infinity, hi = -Infinity, worstName = ''
        root.traverse((c) =>
        {
            const pos = c.geometry?.attributes?.position
            if(!pos) return
            let l = Infinity, h = -Infinity
            const step = Math.max(1, Math.floor(pos.count / 120))
            for(let i = 0; i < pos.count; i += step)
            {
                v.fromBufferAttribute(pos, i)
                if(c.isSkinnedMesh && c.applyBoneTransform) c.applyBoneTransform(i, v)
                v.applyMatrix4(c.matrixWorld)
                l = Math.min(l, v.y); h = Math.max(h, v.y)
            }
            if(h - l > hi - lo) { lo = l; hi = h; worstName = c.name }
        })
        return { cao: +(hi - lo).toFixed(2), lưới: worstName }
    }

    const survival = G.world.survival
    if(!survival.enabled) survival.enable()
    survival.monsters.clear()

    const results = {}

    for(const [ key, type ] of [ [ 'bossModel', 'crawler' ], [ 'bossModel', 'boss' ] ])
    {
        const source = G.resources[key]
        const clip = source.animations?.[0]
        const r = { clip: clip ? `${clip.name} · ${clip.duration.toFixed(2)}s · ${clip.tracks.length} rãnh` : '(không có)' }

        // A — bản gốc trong kho, chưa ai clone, chưa mixer nào chạm vào
        r['A. bản gốc trong kho'] = span(source.scene)

        // B..D — con quái thật do game dựng, điều khiển tay qua mixer của nó
        survival.monsters.clear()
        const p = G.world.vehicle?.position ?? { x: 0, z: 0 }
        survival.monsters.spawn(type, p.x + 6, p.z + 6)
        const m = survival.monsters.monsters[0]

        if(!m?.mixer)
        {
            r['B. KHÔNG CÓ MIXER'] = { cao: -1, lưới: '(con này dựng bằng mã?)' }
            results[key] = r
            continue
        }

        m.mixer.setTime(0)
        r['B. mixer tại giây 0'] = span(m.root)

        m.mixer.setTime(0.5)
        r['C. mixer tại giây 0,5'] = span(m.root)

        let worst = 0, worstAt = 0
        for(let t = 0; t < (clip?.duration ?? 1); t += 0.04)
        {
            m.mixer.setTime(t)
            const s = span(m.root)
            if(s.cao > worst) { worst = s.cao; worstAt = t }
        }
        r['D. tệ nhất cả chu kỳ'] = { cao: +worst.toFixed(2), lưới: `tại giây ${worstAt.toFixed(2)}` }

        results[key] = r
    }

    survival.monsters.clear()
    return results
})

console.log('')
for(const [ key, r ] of Object.entries(out))
{
    console.log(`  ═══ ${key} ═══`)
    console.log(`  clip: ${r.clip}`)
    for(const [ k, v ] of Object.entries(r))
    {
        if(k === 'clip') continue
        console.log(`   ${k.padEnd(24)} cao ${String(v.cao).padStart(9)}   ${v.lưới}`)
    }
    console.log('')
}

await browser.close()
