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
const { chromium } = await import('/Users/admin/Downloads/api-backend/node_modules/playwright/index.mjs')

/**
 * Khung nhìn NHỎ, cố ý. Bộ kiểm không nhìn hình, mà headless dựng cả thế giới
 * này ở 1280×720 chỉ được chừng 5 khung hình/giây — mỗi phép chờ dài gấp mười.
 * Thu nhỏ khung nhìn là cách rẻ nhất để bộ kiểm chạy xong trong một phút.
 */
const browser = await chromium.launch()
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

/**
 * Cho game chạy đủ `seconds` giây THEO ĐỒNG HỒ CỦA GAME.
 * Trả về số nhịp đã chạy (0 nghĩa là vòng lặp đứng hẳn).
 */
const run = async (seconds, timeoutMs = 60000) =>
{
    const start = await page.evaluate(() => ({ ticks: window.__tickCount, time: window.__gameTime }))
    const startedAt = Date.now()

    while(true)
    {
        // Nhích chuột để trang không bị coi là bỏ mặc
        await page.mouse.move(200 + (Date.now() % 40), 160)
        await page.waitForTimeout(120)

        const now = await page.evaluate(() => ({ ticks: window.__tickCount, time: window.__gameTime }))
        if(now.time - start.time >= seconds) return now.ticks - start.ticks
        if(Date.now() - startedAt > timeoutMs) return now.ticks - start.ticks
    }
}

const problems = []
const facts = {}

// ═══════════════════════════════════════════════════════════════════════════
//  0. KIỂM BỘ KIỂM — vòng lặp game có thật sự chạy không
// ═══════════════════════════════════════════════════════════════════════════
{
    const started = Date.now()
    const ticks = await run(1, 30000)
    const wallSeconds = (Date.now() - started) / 1000

    facts['0. một giây GAME'] = `${ticks} nhịp, mất ${wallSeconds.toFixed(1)}s thật `
        + `(${(1 / wallSeconds).toFixed(2)}× thời gian thực)`

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
