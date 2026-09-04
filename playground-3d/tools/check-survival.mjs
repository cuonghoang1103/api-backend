/**
 * KIỂM CHẾ ĐỘ SINH TỒN — sóng quái, húc, bắn, tiền, máu, thua, dọn dẹp.
 *
 * Chạy: `PLAY_URL=http://localhost:5174 node tools/check-survival.mjs`
 * (cần `npm run dev` đang sống — truyền đúng cổng Vite THẬT, xem log của Vite,
 * vì nó nhảy cổng khi 5173 bận.)
 *
 * ⚠️ KHÔNG tự bơm `ticker.events.trigger('tick')`: vòng lặp rAF thật vẫn chạy
 * song song, bơm chồng lên là Rapier ném "recursive use of an object … unsafe
 * aliasing in rust". Ở đây chỉ ĐỌC trạng thái và gọi những hàm không đụng vào
 * bước vật lý (`hit`, `damageAround`, `hurt`), rồi để game tự chạy vài nhịp.
 *
 * ⚠️ **KIỂM BỘ KIỂM TRƯỚC**: headless bóp rAF khi trang không có tương tác, nên
 * "chờ 2 giây rồi đo" có thể đo trúng lúc game đứng im và báo oan đủ thứ. Mục 0
 * đếm số nhịp thật đã chạy; nếu vòng lặp không chạy thì bộ kiểm DỪNG và nói
 * thẳng là môi trường hỏng, chứ không kết luận về mã.
 *
 * ─── BỘ NÀY CANH NHỮNG GÌ ───
 *  1. Quái sinh ra LƠ LỬNG hoặc CHÌM DƯỚI ĐẤT (bám đất bằng tia, sai một lần là
 *     cả đàn trôi trên không).
 *  2. Quái sinh DƯỚI NƯỚC — lội giữa biển.
 *  3. Toạ độ NaN. Đúng loại lỗi đã làm ĐỨNG KHUNG HÌNH ở đảo quái vật: NaN lan
 *     vào âm lượng rồi `setValueAtTime` ném lỗi giữa chuỗi tick.
 *  4. Quái KHÔNG đuổi theo xe (AI chết lặng, không báo lỗi nào).
 *  5. Cả đàn CHỒNG KHÍT lên nhau thành một con (thiếu lực tách).
 *  6. Bắn/húc không giết được, hoặc giết mà không rơi tiền.
 *  7. Tiền không nhặt được.
 *  8. Tắt chế độ mà quái/tiền/HUD còn nằm lại trong cảnh.
 */

const BASE = process.env.PLAY_URL ?? 'http://localhost:5173'
const { chromium } = await import(process.env.PW ?? '/Users/admin/Downloads/api-backend/node_modules/playwright/index.mjs')

/**
 * Khung nhìn NHỎ, cố ý. Bộ kiểm không nhìn hình, mà headless dựng cả thế giới
 * này ở 1280×720 chỉ được chừng 5 khung hình/giây — mỗi phép chờ dài gấp mười.
 * Thu nhỏ khung nhìn là cách rẻ nhất để bộ kiểm chạy xong trong một phút.
 */
const browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {})
const page = await browser.newPage({ viewport: { width: 480, height: 320 } })
page.on('pageerror', (error) => console.log('  [lỗi trang]', error.message))

await page.goto(`${BASE}/#skip`, { waitUntil: 'load' })
await page.waitForFunction(() => window.game?.world?.survival, null, { timeout: 60000 })
await page.waitForSelector('.js-welcome-play', { timeout: 60000 })
await page.evaluate(() => document.querySelector('.js-welcome-play')?.click())
await page.waitForFunction(() => (window.game?.reveal?.distance?.value ?? 0) > 1000, null, { timeout: 60000 })
await page.waitForTimeout(1500)

/**
 * ĐỒNG HỒ CỦA GAME, không phải đồng hồ treo tường.
 *
 * ⚠️ Hai lần đo hỏng trước khi ra được phép đo này — chép lại để đừng ai đi lại:
 *
 *  1. `Ticker` KHÔNG có trường đếm khung hình, chỉ có `elapsed`. Đo `elapsed`
 *     rồi gọi nó là "số nhịp" thì con số vô nghĩa, và bộ kiểm tự tuyên bố
 *     "môi trường hỏng" trong khi game chạy ngon lành.
 *  2. Đếm nhịp thật thì ra ~5 nhịp/giây và trông y như "headless bóp rAF".
 *     KHÔNG PHẢI: cảnh này quá nặng, headless dựng được chừng đó khung hình mỗi
 *     giây, thế thôi.
 *
 * Điều thật sự quan trọng: `Ticker.delta` bị CHẶN ở `maxDelta = 1/30`, nên một
 * khung hình dài 200 ms vẫn chỉ đẩy logic đi 33 ms. `ticker.elapsed` thì lại là
 * thời gian THẬT. Nghĩa là chờ "3 giây" theo đồng hồ treo tường chỉ cho logic
 * chạy được nửa giây của nó — mọi phép đo về chuyển động sẽ báo oan.
 *
 * Nên ở đây cộng dồn chính `ticker.delta` và chờ theo CON SỐ ĐÓ.
 */
await page.evaluate(() =>
{
    window.__tickCount = 0
    window.__gameTime = 0
    window.game.ticker.events.on('tick', () =>
    {
        window.__tickCount++
        window.__gameTime += window.game.ticker.delta
    })
})

const problems = []
const facts = {}

/**
 * ⚠️ HẠN CHÓT PHẢI TỰ CO GIÃN THEO TỐC ĐỘ MÁY, VÀ IM LẶNG LÀ CẤM.
 *
 * Bản đầu để hạn chót CỨNG 60 giây thật. Cảnh này dựng ở 0,04× thời gian thực
 * nên `run(5)` cần 125 giây — nó bỏ cuộc ở 60 giây, TRẢ VỀ BÌNH THƯỜNG, và
 * phần kiểm sau đó tố cáo 6 lỗi trực thăng không hề có. Đo lại mới thấy trực
 * thăng chạy đúng 3,16 trên 4 giây nó cần: bộ kiểm cắt ngắn thời gian rồi trách
 * mã nguồn.
 *
 * Nay hạn chót suy từ tốc độ ĐO ĐƯỢC ở mục 0, và mỗi lần vẫn không kịp thì ghi
 * thẳng vào `problems` là lỗi MÔI TRƯỜNG — không bao giờ để nó trôi qua lặng lẽ.
 */
let gameRate = null

const run = async (seconds, timeoutMs = null) =>
{
    const budget = timeoutMs ?? (gameRate ? Math.max(20000, (seconds / gameRate) * 1000 * 1.6) : 60000)
    const start = await page.evaluate(() => ({ ticks: window.__tickCount, time: window.__gameTime }))
    const startedAt = Date.now()

    while(true)
    {
        // Nhích chuột để trang không bị coi là bỏ mặc
        await page.mouse.move(200 + (Date.now() % 40), 160)
        await page.waitForTimeout(120)

        const now = await page.evaluate(() => ({ ticks: window.__tickCount, time: window.__gameTime }))
        const delivered = now.time - start.time
        if(delivered >= seconds) return now.ticks - start.ticks

        if(Date.now() - startedAt > budget)
        {
            problems.push(`MÔI TRƯỜNG: xin ${seconds}s game, chỉ chạy được ${delivered.toFixed(2)}s trong `
                + `${((Date.now() - startedAt) / 1000).toFixed(0)}s thật — mọi mục kiểm phía sau ĐỀU CÓ THỂ BÁO OAN. `
                + 'Đóng bớt ứng dụng nặng rồi chạy lại.')
            return now.ticks - start.ticks
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════
//  0. KIỂM BỘ KIỂM — vòng lặp game có thật sự chạy không
// ═══════════════════════════════════════════════════════════════════════════
{
    const started = Date.now()
    const ticks = await run(1, 30000)
    const wallSeconds = (Date.now() - started) / 1000

    // Mọi hạn chót sau đây suy từ con số này — xem chú thích của `run()`
    gameRate = 1 / wallSeconds

    facts['0. một giây GAME'] = `${ticks} nhịp, mất ${wallSeconds.toFixed(1)}s thật `
        + `(${gameRate.toFixed(2)}× thời gian thực)`

    // Một giây game với `maxDelta = 1/30` là ÍT NHẤT 30 nhịp. Ít hơn nhiều
    // nghĩa là vòng lặp đứng, không phải máy chậm.
    if(ticks < 20)
    {
        console.log('\n⛔ MÔI TRƯỜNG HỎNG: vòng lặp game gần như không chạy '
            + `(${ticks} nhịp cho một giây game). Mọi phép đo sau đây sẽ báo oan.`)
        console.log('   Kiểm lại: trang đã bấm Play chưa, tab có bị ẩn không.')
        await browser.close()
        process.exit(1)
    }
}

// ═══════════════════════════════════════════════════════════════════════════
//  0b. MỌI TỆP ÂM THANH PHẢI TẢI ĐƯỢC
// ═══════════════════════════════════════════════════════════════════════════
//
// Đường dẫn sai thì Howler chỉ in một dòng `console.error` rồi im — game vẫn
// chạy, chỉ là tiếng đó không bao giờ kêu. Không có mục kiểm này thì phải ngồi
// chơi và tự nhận ra "hình như thiếu tiếng gì đó".
{
    const audio = await page.evaluate(async () =>
    {
        const paths = [
            'gun-shot-1', 'gun-shot-2', 'gun-shot-3',
            'explosion-1', 'explosion-2', 'explosion-big',
            'rocket-launch', 'rocket-fly',
            'growl-1', 'growl-2', 'growl-3', 'growl-4',
            'screech-1', 'screech-2', 'hit-1', 'hit-2',
            'death-1', 'death-2', 'step-1', 'step-2', 'step-boss', 'step-walker',
            'heli-loop', 'heli-arrive', 'heli-land',
            'riser', 'wave-horn', 'boss-horn', 'wave-clear', 'game-over',
            'heartbeat', 'night-wind',
        ]

        const missing = []
        await Promise.all(paths.map(async (name) =>
        {
            try
            {
                const response = await fetch(`/sounds/survival/${name}.mp3`, { method: 'HEAD' })
                if(!response.ok) missing.push(`${name} (${response.status})`)
            }
            catch(error) { missing.push(`${name} (không tải được)`) }
        }))

        // Nhạc nền riêng của chế độ
        try
        {
            const r = await fetch('/sounds/musics/survival-theme.mp3', { method: 'HEAD' })
            if(!r.ok) missing.push(`survival-theme (${r.status})`)
        }
        catch(error) { missing.push('survival-theme (không tải được)') }

        return { total: paths.length + 1, missing }
    })

    facts['0b. tệp âm thanh'] = audio.missing.length === 0
        ? `${audio.total}/${audio.total} tải được`
        : `THIẾU ${audio.missing.length}/${audio.total}: ${audio.missing.join(', ')}`

    if(audio.missing.length)
        problems.push(`${audio.missing.length} tệp âm thanh KHÔNG tải được: ${audio.missing.slice(0, 6).join(', ')}`)
}

// ═══════════════════════════════════════════════════════════════════════════
//  1. BẬT CHẾ ĐỘ
// ═══════════════════════════════════════════════════════════════════════════
{
    const before = await page.evaluate(() => window.game.dayCycles.preference.current)
    facts['1. giờ trước khi bật'] = before

    await page.evaluate(() => window.game.world.survival.preference.set('on'))
    await run(0.6)

    const state = await page.evaluate(() =>
    {
        const s = window.game.world.survival
        return {
            enabled: s.enabled,
            phase: s.phase,
            health: s.health,
            hudVisible: document.querySelector('.js-survival-hud')?.classList.contains('is-visible') ?? false,
            time: window.game.dayCycles.preference.current,
            buttons: document.querySelectorAll('.js-survival-modes button[data-mode]').length,
            activeButton: document.querySelector('.js-survival-modes button.is-active')?.dataset.mode ?? '(không có)',
        }
    })

    facts['1. bật xong'] = `phase=${state.phase} · máu=${state.health} · giờ=${state.time} · nút sáng=${state.activeButton}`

    if(!state.enabled) problems.push('Bấm On mà `survival.enabled` vẫn false')
    if(!state.hudVisible) problems.push('Bảng HUD không hiện (thiếu class is-visible)')
    if(state.buttons !== 2) problems.push(`Mục Survival trong Cài đặt có ${state.buttons} nút, đáng lẽ 2`)
    if(state.activeButton !== 'on') problems.push(`Nút đang sáng là "${state.activeButton}", đáng lẽ "on"`)
    if(state.phase !== 'preparing') problems.push(`Bật xong phải vào nhịp nghỉ, đang là "${state.phase}"`)
    if(state.time !== 'day') problems.push(`Nhịp nghỉ phải là TRỜI SÁNG, đang là "${state.time}"`)
}

// ═══════════════════════════════════════════════════════════════════════════
//  2. VÀO SÓNG — quái sinh ra, đứng đúng mặt đất, trên cạn, không NaN
// ═══════════════════════════════════════════════════════════════════════════
{
    await page.evaluate(() => window.game.world.survival.startWave())
    await run(4.5)

    const state = await page.evaluate(() =>
    {
        const G = window.game
        const s = G.world.survival
        const sea = G.water?.surfaceElevation ?? 0

        const list = s.monsters.monsters.map((m) =>
        {
            const p = m.root.position
            const ground = s.monsters.groundHeight(p.x, p.z)
            return {
                type: m.type,
                x: p.x, y: p.y, z: p.z,
                ground,
                // Cách mặt đất bao nhiêu — con số này là thứ bắt lỗi "trôi trên không"
                offGround: ground === null ? null : p.y - ground,
                underWater: ground !== null && ground <= sea + 0.05,
                nan: !Number.isFinite(p.x) || !Number.isFinite(p.y) || !Number.isFinite(p.z),
                dead: m.dead,
            }
        })

        return {
            time: G.dayCycles.preference.current,
            wave: s.wave,
            phase: s.phase,
            alive: s.monsters.aliveCount,
            list,
        }
    })

    facts['2. sóng'] = `${state.wave} · phase=${state.phase} · giờ=${state.time} · sống=${state.alive}`
    facts['2. loại quái'] = state.list.map(m => m.type).join(', ') || '(không có con nào)'

    if(state.time !== 'night') problems.push(`Vào sóng phải TỐI TRỜI, đang là "${state.time}"`)
    if(state.alive === 0) problems.push('Vào sóng 4,5 giây rồi mà KHÔNG có con quái nào sinh ra')

    const nan = state.list.filter(m => m.nan)
    if(nan.length) problems.push(`${nan.length} con có toạ độ NaN — đúng loại lỗi làm ĐỨNG KHUNG HÌNH`)

    const floating = state.list.filter(m => m.offGround !== null && Math.abs(m.offGround) > 0.45)
    if(floating.length)
        problems.push(`${floating.length}/${state.list.length} con KHÔNG đứng trên mặt đất `
            + `(lệch tới ${Math.max(...floating.map(m => Math.abs(m.offGround))).toFixed(2)})`)

    const wet = state.list.filter(m => m.underWater)
    if(wet.length) problems.push(`${wet.length} con sinh DƯỚI NƯỚC`)

    const lost = state.list.filter(m => m.ground === null)
    if(lost.length) problems.push(`${lost.length} con đứng ở chỗ bắn tia không chạm gì (ngoài rìa thế giới?)`)
}

// ═══════════════════════════════════════════════════════════════════════════
//  3. AI ĐUỔI THEO XE + KHÔNG CHỒNG KHÍT LÊN NHAU
// ═══════════════════════════════════════════════════════════════════════════
{
    const before = await page.evaluate(() =>
    {
        const G = window.game
        const v = G.physicalVehicle.position
        return G.world.survival.monsters.monsters
            .filter(m => !m.dead)
            .map(m => ({ d: Math.hypot(m.root.position.x - v.x, m.root.position.z - v.z) }))
    })

    await run(3)

    const after = await page.evaluate(() =>
    {
        const G = window.game
        const s = G.world.survival
        const v = G.physicalVehicle.position
        const alive = s.monsters.monsters.filter(m => !m.dead)

        // Cặp gần nhau nhất — nếu ~0 thì cả đàn đang chồng lên nhau
        let closest = Infinity
        for(let i = 0; i < alive.length; i++)
            for(let j = i + 1; j < alive.length; j++)
                closest = Math.min(closest, Math.hypot(
                    alive[i].root.position.x - alive[j].root.position.x,
                    alive[i].root.position.z - alive[j].root.position.z,
                ))

        // Sau khi ĐÃ ĐI một lúc mới là lúc bắt được lỗi lội xuống biển: kiểm
        // lúc vừa sinh thì con nào cũng khô, vì chỗ sinh đã được chọn là khô
        const sea = G.water?.surfaceElevation ?? 0
        const wet = alive.filter((m) =>
        {
            const g = s.monsters.groundHeight(m.root.position.x, m.root.position.z)
            return g !== null && g <= sea + 0.05
        }).length

        return {
            distances: alive.map(m => Math.hypot(m.root.position.x - v.x, m.root.position.z - v.z)),
            closest,
            wet,
            nan: alive.filter(m => !Number.isFinite(m.root.position.x) || !Number.isFinite(m.root.position.y)).length,
            vehicleSpeed: G.physicalVehicle.xzSpeed,
        }
    })

    const avgBefore = before.reduce((a, m) => a + m.d, 0) / (before.length || 1)
    const avgAfter = after.distances.reduce((a, d) => a + d, 0) / (after.distances.length || 1)

    facts['3. khoảng cách trung bình'] = `${avgBefore.toFixed(1)} → ${avgAfter.toFixed(1)} (xe đang ${after.vehicleSpeed.toFixed(1)} đv/s)`
    facts['3. cặp gần nhau nhất'] = Number.isFinite(after.closest) ? after.closest.toFixed(2) : '(dưới 2 con)'

    // Xe đứng yên thì khoảng cách PHẢI giảm rõ rệt
    if(after.vehicleSpeed < 1 && avgAfter >= avgBefore - 1)
        problems.push(`Quái KHÔNG đuổi theo xe: khoảng cách ${avgBefore.toFixed(1)} → ${avgAfter.toFixed(1)} sau 3 giây`)

    if(Number.isFinite(after.closest) && after.closest < 0.3)
        problems.push(`Cả đàn chồng khít lên nhau (cặp gần nhất chỉ cách ${after.closest.toFixed(2)}) — lực tách không chạy`)

    if(after.wet) problems.push(`${after.wet} con LỘI XUỐNG NƯỚC sau khi đi (chỗ sinh thì khô, nên lỗi nằm ở phần bám đất trong update)`)
    if(after.nan) problems.push(`${after.nan} con có toạ độ NaN sau khi di chuyển`)
}

// ═══════════════════════════════════════════════════════════════════════════
//  1b. NHẠC NỀN RIÊNG — tự bật, tôn trọng nút tắt nhạc và thanh âm lượng
// ═══════════════════════════════════════════════════════════════════════════
{
    const music = await page.evaluate(() =>
    {
        const G = window.game
        const s = G.world.survival
        const playlist = G.audio.playlist

        const themeOn = !!s.sounds.theme?.__on
        const themeVolume = s.sounds.theme?.howl?.volume?.() ?? null

        // Kéo thanh âm lượng → nhạc chế độ phải đổi theo
        const before = themeVolume
        playlist?.setVolume?.(0.05)
        G.audio.events.trigger('playlistChange')
        const afterQuiet = s.sounds.theme?.howl?.volume?.() ?? null

        playlist?.setVolume?.(0.5)
        G.audio.events.trigger('playlistChange')
        const afterLoud = s.sounds.theme?.howl?.volume?.() ?? null

        return {
            themeOn,
            playlistPlaying: !!playlist?.current?.sound?.playing?.(),
            before: before === null ? null : +before.toFixed(4),
            afterQuiet: afterQuiet === null ? null : +afterQuiet.toFixed(4),
            afterLoud: afterLoud === null ? null : +afterLoud.toFixed(4),
        }
    })

    facts['1b. nhạc chế độ'] = `tự bật=${music.themeOn} · âm lượng theo thanh trượt `
        + `${music.afterQuiet} → ${music.afterLoud}`

    if(!music.themeOn) problems.push('Bật chế độ mà nhạc nền riêng không tự chạy')
    if(music.playlistPlaying) problems.push('Nhạc thường vẫn chạy song song với nhạc chế độ — hai bài chồng nhau')
    if(music.afterQuiet !== null && music.afterLoud !== null && music.afterLoud <= music.afterQuiet)
        problems.push(`Kéo thanh âm lượng Music mà nhạc chế độ không đổi theo (${music.afterQuiet} → ${music.afterLoud})`)
}

// ═══════════════════════════════════════════════════════════════════════════
//  2b. KHÔNG CON NÀO ĐƯỢC TO BẤT THƯỜNG — canh đúng lỗi user báo
// ═══════════════════════════════════════════════════════════════════════════
//
// User bật chế độ và thấy "bóng đen to bay chập chờn che màn hình". HAI lần.
//
// Lần đầu: con `skeleton` cỡ 212 × 212 × 212.
// Lần hai: con `crawler` cao **382**, và mục kiểm này KHÔNG THẤY GÌ.
//
// ⚠️⚠️ VÌ SAO NÓ MÙ, và vì sao bản này đo khác hẳn:
//
// Bản trước dùng `SkinnedMesh.computeBoundingBox()`. Nghe thì đúng, nhưng hàm
// đó dựng hộp từ hình học ở TƯ THẾ NGHỈ — nó KHÔNG chạy skinning. Với
// `soldier.glb` nó trả 1,332 trong khi lưới GPU vẽ ra cao 283 và vọt tới 427
// giữa chu kỳ đi. Bộ kiểm báo sạch suốt ba phiên trong lúc người chơi nhìn
// thẳng vào con quái che kín màn hình.
//
// `applyBoneTransform()` là API DUY NHẤT áp đúng ma trận xương mà GPU sẽ áp.
// Chậm hơn, nhưng đây là thứ duy nhất nói thật.
{
    const oversized = await page.evaluate(() =>
    {
        const G = window.game
        const Vector3 = G.view.camera.position.constructor
        const v = new Vector3()
        const out = []

        for(const name of [ 'survivalMonsters', 'survivalGun', 'survivalWalker', 'survivalHeli' ])
        {
            const group = G.scene.getObjectByName(name)
            if(!group) continue
            group.updateMatrixWorld(true)

            group.traverse((child) =>
            {
                const position = child.geometry?.attributes?.position
                if(!position) return

                let loX = Infinity, hiX = -Infinity
                let loY = Infinity, hiY = -Infinity
                let loZ = Infinity, hiZ = -Infinity

                // Lấy mẫu thưa: cần bao ngoài, không cần từng đỉnh
                const step = Math.max(1, Math.floor(position.count / 100))
                for(let i = 0; i < position.count; i += step)
                {
                    v.fromBufferAttribute(position, i)
                    if(child.isSkinnedMesh && child.applyBoneTransform) child.applyBoneTransform(i, v)
                    v.applyMatrix4(child.matrixWorld)
                    if(v.x < loX) loX = v.x; if(v.x > hiX) hiX = v.x
                    if(v.y < loY) loY = v.y; if(v.y > hiY) hiY = v.y
                    if(v.z < loZ) loZ = v.z; if(v.z > hiZ) hiZ = v.z
                }

                const size = Math.max(hiX - loX, hiY - loY, hiZ - loZ)

                // Vật to nhất hợp lệ là cánh quạt trực thăng (8,4) — 20 là
                // ngưỡng rộng rãi, chỉ bắt những thứ sai bậc độ lớn
                if(size > 20) out.push({ group: name, name: child.name || '(không tên)', size: +size.toFixed(1) })
            })
        }

        return out
    })

    facts['2b. vật quá khổ'] = oversized.length === 0
        ? 'không có (đo qua xương, ngưỡng 20 đơn vị)'
        : oversized.map(o => `${o.group}/${o.name} cỡ ${o.size}`).join(' · ')

    if(oversized.length)
        problems.push(`${oversized.length} mesh TO BẤT THƯỜNG (lớn nhất ${Math.max(...oversized.map(o => o.size))} đơn vị) `
            + '— đây là thứ che kín màn hình người chơi. Model đó có TƯ THẾ BIND VỠ: '
            + 'bỏ nó đi, và sàng model thay thế bằng `tools/screen-monster-models.mjs`')
}

// ═══════════════════════════════════════════════════════════════════════════
//  2c. ĐO CỠ QUA TOÀN BỘ CLIP — bắt model có TƯ THẾ BIND VỠ
// ═══════════════════════════════════════════════════════════════════════════
//
// Mục 2b đo MỘT thời điểm và vẫn báo 0 lỗi trong khi user thấy "con dơi khổng
// lồ chập chờn che mất màn hình". Chữ "chập chờn" là manh mối: cỡ đổi theo thời
// gian. Đo `free_skeleton_man_axe` qua 20 mốc của clip thì ra **186,47 ở giây
// 0** — tư thế BIND của nó vỡ, các mảnh văng xa, chỉ khi clip chạy mới về chỗ.
//
// Model tải về từ nguồn lạ có thể vỡ theo kiểu này bất cứ lúc nào, nên phép
// kiểm phải quét cả clip chứ không tin một khung hình.
{
    const perType = await page.evaluate(() =>
    {
        const G = window.game
        const s = G.world.survival
        const v = G.physicalVehicle.position
        const out = []

        for(const type of Object.keys(s.monsters.constructor === Object ? {} : { crawler: 1, stalker: 1, brute: 1, boss: 1 }))
        {
            s.monsters.clear()
            const y = s.monsters.groundHeight(v.x + 8, v.z + 8)
            if(y === null) continue

            const m = s.monsters.add(type, v.x + 8, y, v.z + 8, v.x, v.z)
            if(!m) continue

            // Dựng bằng khối thì không có clip — bỏ qua, chúng luôn ổn định
            if(!m.mixer) { out.push({ type, gait: m.gait, max: null }); continue }

            const clip = m.mixer._actions?.[0]?._clip
            const duration = clip?.duration ?? 1
            let worst = 0
            let worstAt = 0

            for(let i = 0; i < 20; i++)
            {
                const t = (i / 20) * duration
                m.mixer.setTime(t)
                m.root.updateMatrixWorld(true)

                /**
                 * ⚠️ ĐO QUA XƯƠNG. `computeBoundingBox()` của SkinnedMesh dựng
                 * hộp từ hình học ở TƯ THẾ NGHỈ — nó không chạy skinning, nên
                 * nó trả 1,33 cho con quái đang cao 382. Xem mục 2b.
                 */
                let size = 0
                const vec = new (G.view.camera.position.constructor)()
                m.root.traverse((c) =>
                {
                    const pos = c.geometry?.attributes?.position
                    if(!pos) return
                    let lo = Infinity, hi = -Infinity
                    const step = Math.max(1, Math.floor(pos.count / 100))
                    for(let k = 0; k < pos.count; k += step)
                    {
                        vec.fromBufferAttribute(pos, k)
                        if(c.isSkinnedMesh && c.applyBoneTransform) c.applyBoneTransform(k, vec)
                        vec.applyMatrix4(c.matrixWorld)
                        if(vec.y < lo) lo = vec.y
                        if(vec.y > hi) hi = vec.y
                    }
                    size = Math.max(size, hi - lo)
                })

                if(size > worst) { worst = size; worstAt = +t.toFixed(2) }
            }

            out.push({ type, gait: m.gait, max: +worst.toFixed(2), at: worstAt, duration: +duration.toFixed(1) })
        }

        s.monsters.clear()
        return out
    })

    facts['2c. cỡ lớn nhất qua clip'] = perType
        .map(p => `${p.type} ${p.max === null ? '(dựng bằng khối)' : p.max}`)
        .join(' · ')

    for(const p of perType)
    {
        if(p.max === null) continue
        if(p.max > 20)
            problems.push(`"${p.type}" phình tới ${p.max} đơn vị ở giây ${p.at} của clip (dài ${p.duration}s) `
                + '— TƯ THẾ BIND VỠ, model này không dùng được, quay về dựng bằng khối')
    }
}

// ═══════════════════════════════════════════════════════════════════════════
//  3b. CHỐNG BẾ TẮC — quái sinh NGOÀI tầm phát hiện vẫn phải tiến về phía xe
// ═══════════════════════════════════════════════════════════════════════════
//
// Đây là lỗi chết người mà số đo của mục 3 mới để lộ: quái sinh trên vành
// 26–46 đơn vị, còn tầm phát hiện chỉ 17 khi tắt đèn. Nếu con mới sinh không
// được cho biết chỗ xe thì nó lảng vảng tại chỗ VĨNH VIỄN, sóng không bao giờ
// hết, và không có một dòng lỗi nào. Kiểm ở kịch bản xấu nhất: ĐÈN TẮT.
{
    const before = await page.evaluate(() =>
    {
        const G = window.game
        const s = G.world.survival
        const v = G.physicalVehicle.position

        G.lighting.headlights.setMode('off')
        s.monsters.clear()

        for(let i = 0; i < 4; i++) s.monsters.spawn('crawler', v.x, v.z)

        return {
            count: s.monsters.monsters.length,
            distances: s.monsters.monsters.map(m => Math.hypot(m.root.position.x - v.x, m.root.position.z - v.z)),
            sightRange: s.sightRange(G.physicalVehicle),
        }
    })

    await run(2.5)

    const after = await page.evaluate(() =>
    {
        const G = window.game
        const s = G.world.survival
        const v = G.physicalVehicle.position
        return s.monsters.monsters.map(m => Math.hypot(m.root.position.x - v.x, m.root.position.z - v.z))
    })

    const avgBefore = before.distances.reduce((a, d) => a + d, 0) / (before.distances.length || 1)
    const avgAfter = after.reduce((a, d) => a + d, 0) / (after.length || 1)
    const outside = before.distances.filter(d => d > before.sightRange).length

    facts['3b. sinh ngoài tầm'] = `${outside}/${before.count} con sinh ngoài tầm ${before.sightRange.toFixed(0)} · `
        + `khoảng cách ${avgBefore.toFixed(1)} → ${avgAfter.toFixed(1)} (đèn TẮT)`

    if(before.count === 0)
        problems.push('Không sinh được con nào cho phép kiểm chống bế tắc')
    else if(avgAfter >= avgBefore - 0.8)
        problems.push(`BẾ TẮC: quái sinh ngoài tầm KHÔNG tiến về phía xe `
            + `(${avgBefore.toFixed(1)} → ${avgAfter.toFixed(1)} sau 2,5 giây game). Sóng sẽ không bao giờ kết thúc.`)

    // Trả đèn về auto cho các mục sau
    await page.evaluate(() => window.game.lighting.headlights.setMode('auto'))
}

// ═══════════════════════════════════════════════════════════════════════════
//  4. GIẾT ĐƯỢC — bằng đòn trực tiếp và bằng nổ vùng, có máu đen + rơi tiền
// ═══════════════════════════════════════════════════════════════════════════
{
    const result = await page.evaluate(() =>
    {
        const s = window.game.world.survival
        const alive = s.monsters.monsters.filter(m => !m.dead)
        if(!alive.length) return { skipped: true }

        const bloodBefore = s.monsters.bloods.length
        const lootBefore = s.loot.length

        // (a) đòn trực tiếp — kiểu húc xe
        const victim = alive[0]
        const killedDirect = s.monsters.hit(victim, 999, victim.root.position.x + 2, victim.root.position.z)

        // (b) nổ vùng — kiểu tên lửa
        let killedBlast = 0
        const second = s.monsters.monsters.find(m => !m.dead)
        if(second)
            killedBlast = s.damageAround(second.root.position.clone(), 8, 5)

        return {
            killedDirect,
            killedBlast,
            bloodSpawned: s.monsters.bloods.length - bloodBefore,
            poolSpawned: s.monsters.pools.length,
            lootSpawned: s.loot.length - lootBefore,
            kills: s.kills,
            score: s.score,
        }
    })

    if(result.skipped)
    {
        problems.push('Không còn con nào để thử giết — mục 2 đã hỏng')
    }
    else
    {
        facts['4. giết'] = `đòn thẳng=${result.killedDirect} · nổ vùng=${result.killedBlast} con · tổng kills=${result.kills} · điểm=${result.score}`
        facts['4. máu đen'] = `${result.bloodSpawned} giọt · ${result.poolSpawned} vũng`

        if(!result.killedDirect) problems.push('Đòn 999 sát thương KHÔNG giết được con quái')
        if(result.killedBlast === 0) problems.push('Nổ vùng (bán kính 8, sức 5) không giết được con nào')
        if(result.bloodSpawned === 0) problems.push('Giết quái mà KHÔNG có giọt máu đen nào')
        if(result.poolSpawned === 0) problems.push('Giết quái mà không để lại vũng máu')
        if(result.lootSpawned === 0) problems.push('Giết quái mà KHÔNG rơi tiền/vật phẩm nào')
    }
}

// ═══════════════════════════════════════════════════════════════════════════
//  5. NHẶT TIỀN — thả một đồng ngay cạnh xe, lái qua là phải mất
// ═══════════════════════════════════════════════════════════════════════════
{
    const result = await page.evaluate(async () =>
    {
        const G = window.game
        const s = G.world.survival
        const v = G.physicalVehicle.position

        const moneyBefore = s.money
        const countBefore = s.loot.length

        // Thả đúng dưới bụng xe — chắc chắn nằm trong bán kính nhặt
        s.dropLoot(v.x, v.y - 0.4, v.z, 'money', 77)

        return { moneyBefore, countBefore, countAfterDrop: s.loot.length }
    })

    await run(0.7)

    const after = await page.evaluate(() =>
    {
        const s = window.game.world.survival
        return { money: s.money, loot: s.loot.length }
    })

    facts['5. nhặt tiền'] = `${result.moneyBefore} → ${after.money} (đồng còn lại trong cảnh: ${after.loot})`

    if(after.money < result.moneyBefore + 77)
        problems.push(`Thả một đồng 77 ngay dưới xe mà không nhặt được (tiền ${result.moneyBefore} → ${after.money})`)
}

// ═══════════════════════════════════════════════════════════════════════════
//  6. MÁU NGƯỜI CHƠI — trừ, hồi, và thua
// ═══════════════════════════════════════════════════════════════════════════
{
    const hurt = await page.evaluate(() =>
    {
        const s = window.game.world.survival
        s.health = 100
        s.hurt(30)
        return {
            health: s.health,
            hudValue: document.querySelector('.js-survival-health-value')?.textContent,
            hudHurt: document.querySelector('.js-survival-hud')?.classList.contains('is-hurt'),
        }
    })

    await run(0.4)
    const hudAfter = await page.evaluate(() => ({
        value: document.querySelector('.js-survival-health-value')?.textContent,
        bar: document.querySelector('.js-survival-health-bar')?.style.transform,
    }))

    facts['6. ăn đòn'] = `máu=${hurt.health} · HUD hiện "${hudAfter.value}" · thanh máu ${hudAfter.bar || '(chưa vẽ)'}`

    if(hurt.health !== 70) problems.push(`Ăn 30 sát thương mà máu còn ${hurt.health}, đáng lẽ 70`)
    if(!hurt.hudHurt) problems.push('Ăn đòn mà HUD không nhấp nháy (thiếu class is-hurt)')
    if(hudAfter.value !== '70') problems.push(`HUD hiện máu "${hudAfter.value}", đáng lẽ "70"`)
    if(!hudAfter.bar || !hudAfter.bar.includes('scaleX')) problems.push('Thanh máu không co theo (thiếu transform scaleX)')

    // ── Thua ────────────────────────────────────────────────────────────────
    const defeat = await page.evaluate(() =>
    {
        const s = window.game.world.survival
        s.hurt(999)
        return {
            phase: s.phase,
            health: s.health,
            monsters: s.monsters.monsters.length,
            overlay: document.querySelector('.js-survival-defeated')?.classList.contains('is-visible'),
            best: s.best,
        }
    })

    facts['6. thua'] = `phase=${defeat.phase} · máu=${defeat.health} · quái còn=${defeat.monsters} · kỷ lục=${defeat.best}`

    if(defeat.phase !== 'defeated') problems.push(`Máu về 0 mà phase là "${defeat.phase}", đáng lẽ "defeated"`)
    if(defeat.health !== 0) problems.push(`Thua rồi mà máu là ${defeat.health}, đáng lẽ 0`)
    if(!defeat.overlay) problems.push('Thua mà màn "Bạn đã gục" không hiện')
    if(defeat.monsters !== 0) problems.push(`Thua rồi mà còn ${defeat.monsters} con quái trong cảnh`)
}

// ═══════════════════════════════════════════════════════════════════════════
//  6b. NẤP — tầm phát hiện theo đèn pha và tốc độ, quái mất dấu thì lảng
// ═══════════════════════════════════════════════════════════════════════════
{
    // Hồi lại để không rơi vào nhánh "defeated" của mục 6
    await page.evaluate(() =>
    {
        const s = window.game.world.survival
        s.restart()
        s.phase = 'hunting'
    })

    const ranges = await page.evaluate(() =>
    {
        const G = window.game
        const s = G.world.survival
        const v = G.physicalVehicle
        const before = G.lighting.headlights.mode

        G.lighting.headlights.setMode('off')
        const off = s.sightRange(v)

        G.lighting.headlights.setMode('on')
        const on = s.sightRange(v)

        G.lighting.headlights.setMode(before)
        return { off, on, speed: v.xzSpeed }
    })

    facts['6b. tầm phát hiện'] = `đèn tắt ${ranges.off.toFixed(1)} → đèn bật ${ranges.on.toFixed(1)} (xe ${ranges.speed.toFixed(1)} đv/s)`

    if(ranges.on <= ranges.off)
        problems.push(`Bật đèn pha KHÔNG làm tăng tầm phát hiện (${ranges.off.toFixed(1)} → ${ranges.on.toFixed(1)}) — cơ chế nấp vô nghĩa`)

    // Thả một con ở NGOÀI tầm rồi xem nó có tự nhận là mất dấu không
    const sight = await page.evaluate(() =>
    {
        const G = window.game
        const s = G.world.survival
        const v = G.physicalVehicle.position
        G.lighting.headlights.setMode('off')

        s.monsters.clear()

        // Đặt hai con: một sát nách, một ở rất xa
        const near = s.monsters.groundHeight(v.x + 4, v.z)
        const far = s.monsters.groundHeight(v.x + 40, v.z)
        if(near !== null) s.monsters.add('crawler', v.x + 4, near, v.z)
        if(far !== null) s.monsters.add('crawler', v.x + 40, far, v.z)

        return { placed: s.monsters.monsters.length }
    })

    await run(0.6)

    const seen = await page.evaluate(() =>
    {
        const G = window.game
        const s = G.world.survival
        const v = G.physicalVehicle.position

        return s.monsters.monsters.map(m => ({
            d: Math.hypot(m.root.position.x - v.x, m.root.position.z - v.z),
            sees: m.sees,
            eyeScale: m.eyeScale,
        }))
    })

    facts['6b. thấy / mất dấu'] = seen.map(m => `${m.d.toFixed(0)}đv:${m.sees ? 'THẤY' : 'mất dấu'}`).join(' · ') || '(không đặt được con nào)'

    if(sight.placed < 2)
    {
        problems.push('Không đặt được hai con để thử cơ chế nấp')
    }
    else
    {
        const near = seen.find(m => m.d < 12)
        const far = seen.find(m => m.d > 25)

        if(near && !near.sees) problems.push('Con đứng sát nách mà vẫn báo mất dấu')
        if(far && far.sees) problems.push(`Con cách ${far.d.toFixed(0)} đơn vị mà vẫn thấy xe dù đèn đã tắt — tầm phát hiện không được áp dụng`)
        if(far && !far.sees && !(far.eyeScale < 1))
            problems.push('Mất dấu rồi mà mắt không nheo lại — người chơi không có cách nào biết mình đang nấp thành công')
    }
}

// ═══════════════════════════════════════════════════════════════════════════
//  6bb. SÚNG MÁY — bắn trúng, chỉ trúng phía TRƯỚC, quá nhiệt thì kẹt
// ═══════════════════════════════════════════════════════════════════════════
{
    const gun = await page.evaluate(() =>
    {
        const G = window.game
        const s = G.world.survival
        const v = G.physicalVehicle.position

        s.phase = 'hunting'
        s.monsters.clear()
        s.gun.clear()
        s.upgrades = {}

        // Một con NGAY TRƯỚC nòng, một con NGAY SAU LƯNG cùng khoảng cách
        const front = s.monsters.groundHeight(v.x + 10, v.z)
        const back = s.monsters.groundHeight(v.x - 10, v.z)
        const a = front === null ? null : s.monsters.add('brute', v.x + 10, front, v.z, v.x, v.z)
        const b = back === null ? null : s.monsters.add('brute', v.x - 10, back, v.z, v.x, v.z)

        // Ngắm thẳng vào con phía trước (bỏ qua con trỏ chuột)
        s.gun.aim.set(v.x + 10, 0, v.z)
        const aimOk = true

        const hpBefore = { front: a?.hp, back: b?.hp }
        const hit = s.gun.shoot()

        return {
            aimOk,
            placed: !!(a && b),
            hitType: hit ? (hit === a ? 'trước' : 'SAU LƯNG') : 'không trúng ai',
            hpBefore,
            hpAfter: { front: a?.hp, back: b?.hp },
            tracers: s.gun.tracers.length,
        }
    })

    facts['6bb. súng máy'] = `bắn trúng con ${gun.hitType} · máu trước ${gun.hpBefore.front}→${gun.hpAfter.front} · `
        + `máu sau lưng ${gun.hpBefore.back}→${gun.hpAfter.back} · ${gun.tracers} vệt đạn`

    if(!gun.placed) problems.push('Không đặt được hai con để thử súng máy')
    if(gun.hitType === 'SAU LƯNG')
        problems.push('Súng bắn trúng con ĐỨNG SAU LƯNG — phép chiếu lên trục nòng thiếu kiểm tra dấu (`along < 0`)')
    if(gun.hitType === 'không trúng ai') problems.push('Bắn thẳng vào một con cách 10 đơn vị mà không trúng')
    if(gun.hpAfter.back !== gun.hpBefore.back) problems.push('Con sau lưng bị mất máu dù súng chĩa về phía trước')
    if(gun.tracers === 0) problems.push('Bắn mà không có vệt đạn nào')

    // ── Quá nhiệt ────────────────────────────────────────────────────────────
    const heat = await page.evaluate(() =>
    {
        const s = window.game.world.survival
        s.gun.heat = 0
        s.gun.jammed = false

        // Bắn liên tục cho tới khi kẹt, tối đa 100 phát
        let shots = 0
        while(!s.gun.jammed && shots < 100)
        {
            s.gun.heat += s.gun.heatPerShot
            shots++
            if(s.gun.heat >= 1) { s.gun.heat = 1; s.gun.jammed = true }
        }

        const jammedAt = shots
        // Có tản nhiệt thì phải bắn được nhiều hơn
        s.upgrades.cooler = 3
        s.gun.heat = 0
        s.gun.jammed = false
        let shots2 = 0
        while(!s.gun.jammed && shots2 < 200)
        {
            s.gun.heat += s.gun.heatPerShot
            shots2++
            if(s.gun.heat >= 1) { s.gun.heat = 1; s.gun.jammed = true }
        }

        s.upgrades = {}
        return { jammedAt, withCooler: shots2 }
    })

    facts['6bb. quá nhiệt'] = `kẹt sau ${heat.jammedAt} phát · có tản nhiệt 3 cấp: ${heat.withCooler} phát`

    if(heat.jammedAt >= 100) problems.push('Bắn 100 phát liền mà nòng không bao giờ kẹt — quá nhiệt không chạy')
    if(heat.jammedAt < 8) problems.push(`Kẹt chỉ sau ${heat.jammedAt} phát — súng gần như không dùng được`)
    if(heat.withCooler <= heat.jammedAt) problems.push('Nâng cấp Tản nhiệt không kéo dài được loạt bắn')

    // ── Không được bắn trong nhịp nghỉ ───────────────────────────────────────
    const idle = await page.evaluate(() =>
    {
        const s = window.game.world.survival
        s.gun.clear()
        s.phase = 'preparing'
        s.gun.firing = true
        s.gun.update(0.5)
        const shotWhileResting = s.gun.tracers.length > 0
        s.gun.firing = false
        s.phase = 'hunting'
        return shotWhileResting
    })

    if(idle) problems.push('Súng bắn được trong nhịp NGHỈ — chỉ tổ làm nóng nòng để rồi vào sóng thì kẹt')
}

// ═══════════════════════════════════════════════════════════════════════════
//  6e. ĐI BỘ — xuống xe, phím lái bị nuốt, quái đổi mục tiêu, lên lại được
// ═══════════════════════════════════════════════════════════════════════════
{
    const exit = await page.evaluate(() =>
    {
        const G = window.game
        const s = G.world.survival
        s.phase = 'hunting'
        s.monsters.clear()
        s.gun.clear()

        const filtersBefore = [ ...G.inputs.filters ]
        s.walker.exit()

        return {
            filtersBefore,
            filtersAfter: [ ...G.inputs.filters ],
            active: s.walker.active,
            visible: s.walker.group.visible,
            pos: [ s.walker.position.x, s.walker.position.y, s.walker.position.z ].map(n => +n.toFixed(1)),
            vehicle: [ G.physicalVehicle.position.x, G.physicalVehicle.position.z ].map(n => +n.toFixed(1)),
            ground: s.monsters.groundHeight(s.walker.position.x, s.walker.position.z),
        }
    })

    const offGround = exit.ground === null ? null : exit.pos[1] - exit.ground
    facts['6e. xuống xe'] = `filters ${exit.filtersBefore.join(',')} → ${exit.filtersAfter.join(',')} · `
        + `đứng tại (${exit.pos[0]}, ${exit.pos[2]}) cách xe `
        + `${Math.hypot(exit.pos[0] - exit.vehicle[0], exit.pos[2] - exit.vehicle[1]).toFixed(1)} · `
        + `lệch đất ${offGround === null ? '(không có đất)' : offGround.toFixed(2)}`

    if(!exit.active) problems.push('Bấm xuống xe mà `walker.active` vẫn false')
    if(!exit.visible) problems.push('Xuống xe rồi mà không thấy nhân vật (group.visible = false)')
    if(!exit.filtersAfter.includes('walking'))
        problems.push(`Xuống xe rồi mà inputs.filters vẫn là [${exit.filtersAfter.join(',')}] — phím lái không bị nuốt, xe sẽ chạy một mình`)
    if(exit.filtersAfter.includes('wandering'))
        problems.push('Filter `wandering` còn nguyên khi đi bộ — bấm W là cả người lẫn xe cùng đi')
    if(offGround !== null && Math.abs(offGround) > 0.4)
        problems.push(`Nhân vật lệch mặt đất ${offGround.toFixed(2)} — lơ lửng hoặc lún`)

    // ── Quái phải đổi sang đuổi NGƯỜI, không đuổi xe ─────────────────────────
    const chase = await page.evaluate(() =>
    {
        const G = window.game
        const s = G.world.survival
        const w = s.walker.position

        // Dời người đi bộ ra xa xe rồi thả quái quanh CHỖ NGƯỜI
        s.walker.position.x += 22
        const y = s.monsters.groundHeight(s.walker.position.x, s.walker.position.z)
        if(y !== null) { s.walker.position.y = y; s.walker.groundY = y }

        s.monsters.clear()
        for(let i = 0; i < 3; i++) s.monsters.spawn('crawler', w.x, w.z)

        return {
            count: s.monsters.monsters.length,
            toWalker: s.monsters.monsters.map(m => +Math.hypot(m.root.position.x - w.x, m.root.position.z - w.z).toFixed(1)),
            toVehicle: s.monsters.monsters.map(m => +Math.hypot(m.root.position.x - G.physicalVehicle.position.x, m.root.position.z - G.physicalVehicle.position.z).toFixed(1)),
        }
    })

    await run(2.5)

    const chased = await page.evaluate(() =>
    {
        const G = window.game
        const s = G.world.survival
        const w = s.walker.position
        return {
            toWalker: s.monsters.monsters.map(m => +Math.hypot(m.root.position.x - w.x, m.root.position.z - w.z).toFixed(1)),
            sight: +s.sightRange(G.physicalVehicle).toFixed(1),
        }
    })

    const avgBefore = chase.toWalker.reduce((a, d) => a + d, 0) / (chase.toWalker.length || 1)
    const avgAfter = chased.toWalker.reduce((a, d) => a + d, 0) / (chased.toWalker.length || 1)

    facts['6e. quái đuổi người'] = `khoảng cách tới NGƯỜI ${avgBefore.toFixed(1)} → ${avgAfter.toFixed(1)} · tầm phát hiện khi đi bộ ${chased.sight}`

    if(chase.count === 0) problems.push('Không sinh được con nào quanh người đi bộ')
    else if(avgAfter >= avgBefore - 0.8)
        problems.push(`Quái KHÔNG đuổi theo người đi bộ (${avgBefore.toFixed(1)} → ${avgAfter.toFixed(1)}) — mục tiêu chưa chuyển sang walker`)

    // ── Lên lại xe ───────────────────────────────────────────────────────────
    const back = await page.evaluate(() =>
    {
        const G = window.game
        const s = G.world.survival

        // Đứng xa thì KHÔNG được lên
        const farRefused = (s.walker.enter(), s.walker.active)

        // Phím R là lối thoát khẩn — lên được từ mọi khoảng cách
        s.walker.enter(true)

        return {
            farRefused,
            active: s.walker.active,
            visible: s.walker.group.visible,
            filters: [ ...G.inputs.filters ],
        }
    })

    facts['6e. lên lại xe'] = `đứng xa bị từ chối=${back.farRefused} · sau khi về: active=${back.active} · filters ${back.filters.join(',')}`

    if(!back.farRefused) problems.push('Đứng cách xe 22 đơn vị mà vẫn leo lên được — thiếu kiểm tra khoảng cách')
    if(back.active) problems.push('Bấm lên xe mà vẫn còn ở chế độ đi bộ')
    if(back.visible) problems.push('Lên xe rồi mà nhân vật vẫn hiện trong cảnh')
    if(!back.filters.includes('wandering'))
        problems.push(`Lên xe rồi mà filters vẫn là [${back.filters.join(',')}] — KẸT, xe sẽ không nhúc nhích`)
}

// ═══════════════════════════════════════════════════════════════════════════
//  6c. CỬA HÀNG — giá, mua, tác dụng, và chỉ mở lúc nghỉ
// ═══════════════════════════════════════════════════════════════════════════
{
    const shop = await page.evaluate(() =>
    {
        const s = window.game.world.survival

        // Thử mua trong lúc ĐANG SĂN — phải bị chặn
        s.phase = 'hunting'
        s.money = 10000
        const boughtWhileHunting = s.buy(s.shopButtons[0].item)

        // Giờ vào nhịp nghỉ và mua thật
        s.phase = 'preparing'
        const armor = s.shopButtons.find(b => b.item.key === 'armor').item
        const maxBefore = s.maxHealth
        const priceFirst = s.priceOf(armor)
        const ok = s.buy(armor)
        const priceSecond = s.priceOf(armor)

        const ram = s.shopButtons.find(b => b.item.key === 'ram').item
        s.buy(ram)

        return {
            boughtWhileHunting,
            ok,
            maxBefore,
            maxAfter: s.maxHealth,
            priceFirst,
            priceSecond,
            money: s.money,
            armorLevel: s.level('armor'),
            ramLevel: s.level('ram'),
            items: s.shopButtons.length,
            domItems: document.querySelectorAll('.js-survival-shop-items .survival-shop-item').length,
        }
    })

    facts['6c. cửa hàng'] = `${shop.items} món (DOM ${shop.domItems}) · giáp ${shop.priceFirst}$ → ${shop.priceSecond}$ · máu tối đa ${shop.maxBefore} → ${shop.maxAfter}`

    if(shop.boughtWhileHunting) problems.push('MUA ĐƯỢC trong lúc đang săn — cửa hàng phải chỉ mở giữa hai sóng')
    if(!shop.ok) problems.push('Có đủ tiền mà không mua được món Giáp')
    if(shop.domItems !== shop.items) problems.push(`Cửa hàng có ${shop.items} món nhưng DOM chỉ dựng ${shop.domItems} nút`)
    if(shop.maxAfter <= shop.maxBefore) problems.push(`Mua Giáp mà máu tối đa không tăng (${shop.maxBefore} → ${shop.maxAfter})`)
    if(shop.priceSecond <= shop.priceFirst) problems.push(`Giá không tăng sau khi mua (${shop.priceFirst} → ${shop.priceSecond})`)
    if(shop.armorLevel !== 1 || shop.ramLevel !== 1) problems.push(`Cấp sau khi mua sai: giáp=${shop.armorLevel}, húc=${shop.ramLevel}, đáng lẽ 1 và 1`)

    // Nâng cấp phải ăn vào sát thương thật
    const power = await page.evaluate(() =>
    {
        const s = window.game.world.survival
        const v = window.game.physicalVehicle.position

        s.monsters.clear()
        const y = s.monsters.groundHeight(v.x + 6, v.z)
        if(y === null) return null
        const target = s.monsters.add('brute', v.x + 6, y, v.z)

        const before = target.hp
        // Nổ với sức 1 — nâng cấp "Đầu đạn" phải nhân lên
        s.upgrades.blast = 0
        s.damageAround(target.root.position.clone(), 6, 1)
        const plain = before - target.hp

        target.hp = before
        s.upgrades.blast = 2
        s.damageAround(target.root.position.clone(), 6, 1)
        const upgraded = before - target.hp

        return { plain, upgraded }
    })

    if(power)
    {
        facts['6c. đầu đạn'] = `sát thương ${power.plain.toFixed(1)} → ${power.upgraded.toFixed(1)} (2 cấp)`
        if(power.upgraded <= power.plain)
            problems.push(`Nâng cấp Đầu đạn không ăn vào sát thương nổ (${power.plain.toFixed(1)} → ${power.upgraded.toFixed(1)})`)
    }
    else problems.push('Không đặt được con nào để thử nâng cấp Đầu đạn')
}

// ═══════════════════════════════════════════════════════════════════════════
//  6f. TRỰC THĂNG — gọi bằng tiền, bay tới, lên được, quái không với tới
// ═══════════════════════════════════════════════════════════════════════════
{
    const call = await page.evaluate(() =>
    {
        const G = window.game
        const s = G.world.survival
        s.phase = 'preparing'
        s.monsters.clear()
        s.walker.reset()
        s.heli.reset()

        const item = s.shopButtons.find(b => b.item.action === 'heli')?.item
        if(!item) return { missing: true }

        // Không đủ tiền thì không gọi được
        s.money = 10
        const brokeRefused = !s.buy(item)

        s.money = 5000
        const price = s.priceOf(item)
        const bought = s.buy(item)

        return {
            brokeRefused,
            bought,
            price,
            moneyLeft: s.money,
            state: s.heli.state,
            visible: s.heli.group.visible,
            distance: +Math.hypot(
                s.heli.position.x - G.physicalVehicle.position.x,
                s.heli.position.z - G.physicalVehicle.position.z,
            ).toFixed(1),
        }
    })

    if(call.missing)
    {
        problems.push('Cửa hàng thiếu món "Trực thăng"')
    }
    else
    {
        facts['6f. gọi trực thăng'] = `giá ${call.price}$ · mua=${call.bought} · trạng thái ${call.state} · `
            + `xuất hiện cách xe ${call.distance}`

        if(!call.brokeRefused) problems.push('Gọi được trực thăng dù chỉ có 10$')
        if(!call.bought) problems.push('Có 5000$ mà không gọi được trực thăng')
        if(call.state !== 'arriving') problems.push(`Gọi xong mà trạng thái là "${call.state}", đáng lẽ "arriving"`)
        if(!call.visible) problems.push('Gọi xong mà trực thăng không hiện trong cảnh')
        if(call.distance < 30) problems.push(`Trực thăng hiện ra ngay cạnh xe (${call.distance}) — đáng lẽ bay từ xa vào`)
    }

    // Chờ nó bay tới và hạ cánh
    await run(5)

    const landed = await page.evaluate(() =>
    {
        const G = window.game
        const s = G.world.survival
        return {
            state: s.heli.state,
            distance: +Math.hypot(
                s.heli.position.x - G.physicalVehicle.position.x,
                s.heli.position.z - G.physicalVehicle.position.z,
            ).toFixed(1),
            ground: s.monsters.groundHeight(s.heli.position.x, s.heli.position.z),
            y: +s.heli.position.y.toFixed(2),
        }
    })

    facts['6f. hạ cánh'] = `trạng thái ${landed.state} · cách xe ${landed.distance} · cao hơn đất `
        + `${landed.ground === null ? '(không có đất)' : (landed.y - landed.ground).toFixed(2)}`

    if(landed.state !== 'landed') problems.push(`Sau 5 giây game mà trực thăng vẫn ở trạng thái "${landed.state}"`)
    if(landed.distance > 6) problems.push(`Hạ cánh cách xe ${landed.distance} — quá xa để leo lên`)

    // ── Lên trực thăng và kiểm quái không với tới ────────────────────────────
    const flying = await page.evaluate(() =>
    {
        const G = window.game
        const s = G.world.survival

        const entered = s.heli.enter(G.physicalVehicle.position)
        const filters = [ ...G.inputs.filters ]

        // Thả một con ngay dưới bụng trực thăng rồi ép nó "tới nơi"
        s.monsters.clear()
        const y = s.monsters.groundHeight(s.heli.position.x, s.heli.position.z)
        const monster = y === null ? null : s.monsters.add('crawler', s.heli.position.x, y, s.heli.position.z, s.heli.position.x, s.heli.position.z)

        const healthBefore = s.health
        if(monster) s.onMonsterReach(monster, G.physicalVehicle)

        return {
            entered,
            filters,
            state: s.heli.state,
            height: +s.heli.height.toFixed(1),
            healthBefore,
            healthAfter: s.health,
            gunDamage: +s.gun.damage.toFixed(2),
        }
    })

    facts['6f. đang bay'] = `lên=${flying.entered} · filters ${flying.filters.join(',')} · cao ${flying.height} · `
        + `máu ${flying.healthBefore}→${flying.healthAfter} · sát thương súng ${flying.gunDamage}`

    if(!flying.entered) problems.push('Đứng cạnh trực thăng đã đậu mà không leo lên được')
    if(!flying.filters.includes('heli'))
        problems.push(`Lên trực thăng rồi mà filters là [${flying.filters.join(',')}] — phím bay không ăn`)
    if(flying.healthAfter < flying.healthBefore)
        problems.push('Quái CẮN ĐƯỢC người chơi khi đang bay trên cao — phép "tới nơi" chỉ đo mặt phẳng ngang, thiếu nhánh chặn')
    if(flying.gunDamage <= 1) problems.push(`Súng trên trực thăng không mạnh hơn (sát thương ${flying.gunDamage})`)

    // ── Hết dầu thì tự hạ, và phím phải trả về ───────────────────────────────
    const outOfFuel = await page.evaluate(() =>
    {
        const G = window.game
        const s = G.world.survival
        s.heli.fuel = 0.01
        s.heli.update()
        return { state: s.heli.state, filters: [ ...G.inputs.filters ], visible: s.heli.group.visible }
    })

    facts['6f. hết dầu'] = `trạng thái ${outOfFuel.state} · filters ${outOfFuel.filters.join(',')}`

    if(outOfFuel.state === 'flying') problems.push('Hết dầu mà trực thăng vẫn bay')
    if(!outOfFuel.filters.includes('wandering') && !outOfFuel.filters.includes('walking'))
        problems.push(`Hạ cánh xong mà filters là [${outOfFuel.filters.join(',')}] — KẸT phím`)
    if(outOfFuel.visible) problems.push('Hạ cánh xong mà trực thăng vẫn nằm trong cảnh')
}

// ═══════════════════════════════════════════════════════════════════════════
//  6d. QUÁI TRÙM — sinh mỗi 5 sóng, thanh máu riêng, không nấp khỏi nó được
// ═══════════════════════════════════════════════════════════════════════════
{
    const boss = await page.evaluate(async () =>
    {
        const G = window.game
        const s = G.world.survival

        s.monsters.clear()
        s.upgrades = {}
        s.health = s.maxHealth

        // Vào thẳng sóng 5
        s.wave = 4
        s.startWave()
        const pendingAtWave5 = s.bossPending

        const v = G.physicalVehicle.position
        const y = s.monsters.groundHeight(v.x + 50, v.z)
        const monster = y === null ? null : s.monsters.add('boss', v.x + 50, y, v.z)
        s.boss = monster

        return {
            pendingAtWave5,
            wave: s.wave,
            placed: !!monster,
            hp: monster?.hp,
            scale: monster?.scale,
            isBoss: monster?.spec?.isBoss === true,
        }
    })

    await run(0.5)

    const bossState = await page.evaluate(() =>
    {
        const s = window.game.world.survival
        return {
            sees: s.boss?.sees,
            barVisible: document.querySelector('.js-survival-boss')?.classList.contains('is-visible'),
            bar: document.querySelector('.js-survival-boss-bar')?.style.transform,
        }
    })

    /**
     * Trùm dựng từ MODEL THẬT — đo chiều cao thật trong cảnh.
     *
     * Đây là phép kiểm đáng giá nhất của mục này: `makeBossModel()` co model
     * theo `modelHeight / spec.scale` vì `add()` còn nhân `spec.scale` lần nữa.
     * Quên phép chia đó thì con trùm cao 9,2 thay vì 3,4 — thò đầu qua mái nhà,
     * và KHÔNG có lỗi nào cả.
     */
    const shape = await page.evaluate(() =>
    {
        const s = window.game.world.survival
        if(!s.boss) return null

        /**
         * ⚠️ KHÔNG `import('three/webgpu')` trong trang — trình duyệt không
         * phân giải được tên gói trần (Vite chỉ viết lại import lúc dựng, còn
         * `page.evaluate` chạy ngoài đồ thị module đó).
         *
         * ⚠️⚠️ VÀ PHẢI ĐO BẰNG `SkinnedMesh.computeBoundingBox()`, KHÔNG bằng
         * `geometry.boundingBox`. Bản đầu của mục kiểm này dùng bbox hình học
         * nhân `matrixWorld` và báo oan "trùm cao 11,54" trong khi con quái
         * đứng đúng 6,5 — vì với lưới có xương, bbox hình học nằm ở không gian
         * BIND, chưa qua xương. Đây là ĐÚNG phép đo mà `makeModelMonster()`
         * dùng để tính tỉ lệ, nên hai bên nói cùng một ngôn ngữ.
         */
        s.boss.root.updateMatrixWorld(true)

        let minY = Infinity
        let maxY = -Infinity
        let skinned = 0

        const vec = new (window.game.view.camera.position.constructor)()

        s.boss.root.traverse((child) =>
        {
            const pos = child.geometry?.attributes?.position
            if(!pos) return
            if(child.isSkinnedMesh) skinned++

            /**
             * ⚠️ ĐÍNH CHÍNH BA TẦNG CHÚ THÍCH BÊN DƯỚI.
             *
             * Chúng dặn phải dùng `SkinnedMesh.computeBoundingBox()` và gọi đó
             * là "đúng phép đo mà `makeModelMonster()` dùng". Cả hai vế nay đều
             * SAI: hàm đó dựng hộp từ hình học ở TƯ THẾ NGHỈ, không chạy
             * skinning, và đã trả 1,33 cho con quái cao 382 che kín màn hình
             * người chơi. `makeModelMonster()` nay đo bằng `measureSkinned()`.
             *
             * Giữ lại mấy chú thích cũ vì hai bài học TỊNH TIẾN và TÁM GÓC ở
             * dưới vẫn đúng và vẫn đắt — chỉ có nguồn toạ độ là đổi.
             */
            const step = Math.max(1, Math.floor(pos.count / 100))
            for(let k = 0; k < pos.count; k += step)
            {
                vec.fromBufferAttribute(pos, k)
                if(child.isSkinnedMesh && child.applyBoneTransform) child.applyBoneTransform(k, vec)
                vec.applyMatrix4(child.matrixWorld)
                minY = Math.min(minY, vec.y)
                maxY = Math.max(maxY, vec.y)
            }
            return

            /**
             * `computeBoundingBox()` của SkinnedMesh trả hộp trong không gian
             * RIÊNG của lưới (đã qua xương, chưa qua tỉ lệ của cha).
             *
             * ⚠️ Phải nhân TỈ LỆ TÍCH LUỸ, không phải mỗi `root.scale`: cây là
             * `root(spec.scale) → model(tỉ lệ co) → …`, bỏ vế giữa thì con số
             * không đổi dù `modelSourceHeight` đổi — đúng triệu chứng đã gặp
             * (sửa 2,079 → 1,264 mà bộ kiểm vẫn báo y hệt 3,77).
             * Cột thứ hai của ma trận thế giới chính là tỉ lệ theo trục Y.
             */
            /**
             * ⚠️ Biến đổi qua ĐỦ ma trận thế giới, cả tỉ lệ LẪN tịnh tiến.
             *
             * Chỉ nhân tỉ lệ (`bb.min.y * scaleY`) thì được chiều cao đúng
             * nhưng VỊ TRÍ sai — `makeModelMonster()` nâng model lên bằng
             * `model.position.y = -minY * scale`, và phần nâng đó nằm ở cột
             * tịnh tiến. Bỏ nó là mọi phép đo "chân lệch mặt đất" đều lệch một
             * hằng số, và sửa `modelSourceMinY` bao nhiêu cũng không thấy đổi.
             */
            /**
             * ⚠️ TÁM GÓC, ĐỦ MA TRẬN. Hai lối tắt đã thử và cả hai đều sai:
             *  - `bb.min.y * scaleY` → chiều cao đúng, vị trí sai (mất tịnh tiến)
             *  - `m[5]*y + m[13]`    → chỉ đúng khi model không xoay quanh X/Z;
             *                          model này xoay nên ra "cao 0,00"
             * Biến đổi cả tám góc rồi lấy min/max là cách duy nhất không giả
             * định gì về ma trận.
             */
            const m = child.matrixWorld.elements
            for(const cx of [ bb.min.x, bb.max.x ])
                for(const cy of [ bb.min.y, bb.max.y ])
                    for(const cz of [ bb.min.z, bb.max.z ])
                    {
                        const y = m[1] * cx + m[5] * cy + m[9] * cz + m[13]
                        minY = Math.min(minY, y)
                        maxY = Math.max(maxY, y)
                    }
        })

        return {
            height: maxY - minY,
            footY: minY,
            groundY: s.boss.groundY,
            skinned,
            hasMixer: !!s.boss.mixer,
            gait: s.boss.gait,
            wanted: s.boss.spec.modelHeight,
        }
    })

    if(shape)
    {
        facts['6d. hình trùm'] = `cao ${shape.height.toFixed(2)} (muốn ${shape.wanted}) · ${shape.skinned} lưới có xương · `
            + `mixer ${shape.hasMixer ? 'có' : 'KHÔNG'} · chân lệch đất ${(shape.footY - shape.groundY).toFixed(2)}`

        if(shape.gait !== 'model')
            problems.push('Quái trùm KHÔNG dựng từ model (đã lùi về dáng dựng bằng mã) — kiểm `resources.bossModel`')
        else
        {
            if(shape.skinned === 0) problems.push('Model trùm không có lưới nào gắn xương — clone hỏng skinning')
            if(!shape.hasMixer) problems.push('Model trùm không có AnimationMixer — nó sẽ đứng đơ')
            if(Math.abs(shape.height - shape.wanted) > shape.wanted * 0.25)
                problems.push(`Trùm cao ${shape.height.toFixed(2)} trong khi muốn ${shape.wanted} — phép co model sai (nhớ CHIA cho spec.scale)`)
            if(Math.abs(shape.footY - shape.groundY) > 0.5)
                problems.push(`Chân trùm lệch mặt đất ${(shape.footY - shape.groundY).toFixed(2)} — nó đang lơ lửng hoặc lún`)
        }
    }
    else problems.push('Không đo được hình dạng quái trùm')

    facts['6d. quái trùm'] = `sóng ${boss.wave} sinh trùm=${boss.pendingAtWave5} · máu ${boss.hp} · cỡ ${boss.scale?.toFixed(2)} · thanh máu ${bossState.barVisible ? 'hiện' : 'KHÔNG hiện'}`

    if(!boss.pendingAtWave5) problems.push('Sóng 5 KHÔNG đặt lịch sinh quái trùm')
    if(!boss.placed) problems.push('Không đặt được quái trùm')
    if(!boss.isBoss) problems.push('Quái trùm thiếu cờ isBoss — luật "không nấp khỏi nó được" sẽ không chạy')
    if(!bossState.sees) problems.push('Quái trùm ở xa 50 đơn vị mà KHÔNG thấy xe — bossAlwaysSees không chạy')
    if(!bossState.barVisible) problems.push('Có quái trùm sống mà thanh máu riêng không hiện')

    // Dọn để mục 7 kiểm việc tắt chế độ
    await page.evaluate(() =>
    {
        const s = window.game.world.survival
        s.monsters.clear()
        s.boss = null
        s.toSpawn = 0
        s.bossPending = false
    })
}

// ═══════════════════════════════════════════════════════════════════════════
//  7. TẮT CHẾ ĐỘ — phải dọn SẠCH, trả lại giờ cũ
// ═══════════════════════════════════════════════════════════════════════════
{
    await page.evaluate(() => window.game.world.survival.preference.set('off'))
    await run(0.6)

    const state = await page.evaluate(() =>
    {
        const G = window.game
        const s = G.world.survival
        const group = G.scene.getObjectByName('survivalMonsters')

        return {
            enabled: s.enabled,
            monsters: s.monsters.monsters.length,
            groupChildren: group ? group.children.length : -1,
            loot: s.loot.length,
            hudVisible: document.querySelector('.js-survival-hud')?.classList.contains('is-visible'),
            overlay: document.querySelector('.js-survival-defeated')?.classList.contains('is-visible'),
            time: G.dayCycles.preference.current,
            activeButton: document.querySelector('.js-survival-modes button.is-active')?.dataset.mode ?? '(không có)',
        }
    })

    facts['7. tắt xong'] = `quái=${state.monsters} (mesh con=${state.groupChildren}) · tiền rơi=${state.loot} · giờ=${state.time} · nút sáng=${state.activeButton}`

    if(state.enabled) problems.push('Bấm Off mà `enabled` vẫn true')
    if(state.monsters !== 0) problems.push(`Tắt rồi còn ${state.monsters} con quái`)
    if(state.groupChildren > 0) problems.push(`Tắt rồi mà nhóm quái còn ${state.groupChildren} mesh nằm trong cảnh`)
    if(state.loot !== 0) problems.push(`Tắt rồi còn ${state.loot} đồng tiền trong cảnh`)
    if(state.hudVisible) problems.push('Tắt rồi mà HUD vẫn hiện')
    if(state.overlay) problems.push('Tắt rồi mà màn thua vẫn hiện')
    if(state.activeButton !== 'off') problems.push(`Nút đang sáng là "${state.activeButton}", đáng lẽ "off"`)
}

// ═══════════════════════════════════════════════════════════════════════════

console.log('\n─── SỐ ĐO ──────────────────────────────────────────────────────')
for(const [ key, value ] of Object.entries(facts))
    console.log(`  ${key}: ${value}`)

console.log('\n─── KẾT LUẬN ───────────────────────────────────────────────────')
if(problems.length === 0)
{
    console.log('  ✅ 0 lỗi')
}
else
{
    console.log(`  ❌ ${problems.length} lỗi:`)
    for(const problem of problems)
        console.log(`     · ${problem}`)
}

await browser.close()
process.exit(problems.length ? 1 : 0)
