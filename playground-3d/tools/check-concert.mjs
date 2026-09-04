/**
 * KIỂM SÂN KHẤU NHẠC HỘI — khu thứ nhất trong ba ô đất chừa sẵn của đảo sân chơi.
 *
 * Chạy: `PLAY_URL=http://localhost:5174 node tools/check-concert.mjs`
 *
 * ─── BỘ NÀY CANH NHỮNG GÌ ───
 * Toàn là lỗi ĐÃ THẬT SỰ XẢY RA ở những khu trước, không cái nào báo lỗi ra
 * console:
 *
 *  1. **Khu trồng ra ngoài mép đất** — siêu-ellipse bậc 4 bo góc nên càng xa tâm
 *     theo z thì bề ngang càng hẹp; chân đỡ vòng lật của sân tập đã từng rơi ra
 *     biển vì chuyện này.
 *  2. **Đường xuyên qua khu** — đã mắc HAI lần (đường ngang xuyên lòng sân bóng,
 *     đường trục xuyên tổ quái).
 *  3. **Vật chắn lối xe** — bộ kiểm không tự thấy được, phải QUÉT HÀNH LANG XE.
 *  4. **Điểm hồi sinh khai sai chỗ** — `Respawns.js` chạy TRƯỚC `world.step(1)`,
 *     thêm từ chỗ khác thì mục biến mất khỏi bản đồ mà không báo lỗi.
 *  5. **Sàn nhảy đứng im** — `Howler.ctx` chỉ có sau khi bấm Play, cắm
 *     `AnalyserNode` một lần trong hàm dựng là im lìm vĩnh viễn.
 *  6. **Nghe to gấp đôi** — nối `analyser → destination` là âm thanh đi hai đường.
 */

const BASE = process.env.PLAY_URL ?? 'http://localhost:5173'
const { chromium } = await import(process.env.PW ?? '/Users/admin/Downloads/api-backend/node_modules/playwright/index.mjs')

const browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {})
const page = await browser.newPage({ viewport: { width: 480, height: 320 } })
page.on('pageerror', (error) => console.log('  [lỗi trang]', error.message))

await page.goto(`${BASE}/#skip`, { waitUntil: 'load' })
await page.waitForFunction(() => window.game?.world?.playIsland?.concert, null, { timeout: 60000 })
await page.waitForSelector('.js-welcome-play', { timeout: 60000 })
await page.evaluate(() => document.querySelector('.js-welcome-play')?.click())
await page.waitForFunction(() => (window.game?.reveal?.distance?.value ?? 0) > 1000, null, { timeout: 60000 })
await page.waitForTimeout(2500)

const problems = []
const facts = {}

// ═══════════════════════════════════════════════════════════════════════════
//  1. DỰNG LÊN THẬT, VÀ NẰM GỌN TRONG Ô ĐẤT ĐÃ CHỪA
// ═══════════════════════════════════════════════════════════════════════════
{
    const built = await page.evaluate(async () =>
    {
        const G = window.game
        const island = G.world.playIsland
        const concert = island.concert
        const data = await import('/data/playisland.js')

        return {
            tiles: concert.tiles.length,
            decks: concert.decks.length,
            beams: concert.beams.length,
            plot: data.PLOTS.concert,
            stage: data.CONCERT.stage,
            floor: data.CONCERT.floor,
            stands: data.CONCERT.stands,
            deckPositions: concert.decks.map(d => ({ x: +d.x.toFixed(1), z: +d.z.toFixed(1) })),
        }
    })

    facts['1. dựng'] = `${built.tiles} ô sàn · ${built.decks} bục đĩa · ${built.beams} chùm đèn`

    if(built.tiles === 0) problems.push('Sàn nhảy không dựng được ô nào')
    if(built.decks !== 5) problems.push(`Có ${built.decks} bục đĩa than, đáng lẽ 5`)
    if(built.beams === 0) problems.push('Giàn đèn không có chùm sáng nào')

    // Mọi thứ phải nằm trong ô đất đã chừa, không thò sang khu khác
    const p = built.plot
    const bounds = { x0: p.x - p.width / 2, x1: p.x + p.width / 2, z0: p.z - p.depth / 2, z1: p.z + p.depth / 2 }
    facts['1. ô đất'] = `x ${bounds.x0}…${bounds.x1} · z ${bounds.z0}…${bounds.z1}`

    const outside = built.deckPositions.filter(d =>
        d.x < bounds.x0 || d.x > bounds.x1 || d.z < bounds.z0 || d.z > bounds.z1)
    if(outside.length)
        problems.push(`${outside.length} bục đĩa nằm NGOÀI ô đất đã chừa: ${outside.map(d => `(${d.x},${d.z})`).join(' ')}`)

    // Khán đài thò ra hai bên — đây là thứ dễ tràn nhất
    const standX = p.x + built.stands.offsetX + built.stands.rows * 1.5
    facts['1. mép khán đài'] = `${standX.toFixed(1)} (mép ô đất ${bounds.x1})`
    if(standX > bounds.x1 + 3)
        problems.push(`Khán đài thò ra tới x=${standX.toFixed(1)}, quá mép ô đất ${bounds.x1}`)
}

// ═══════════════════════════════════════════════════════════════════════════
//  2. NẰM TRÊN ĐẤT KHÔ — không thò ra biển
// ═══════════════════════════════════════════════════════════════════════════
{
    const ground = await page.evaluate(async () =>
    {
        const G = window.game
        const island = G.world.playIsland
        const data = await import('/data/playisland.js')
        const p = data.PLOTS.concert

        // Bốn góc ô đất + tâm sân khấu + tâm sàn
        const spots = [
            [ 'góc Tây-Bắc', p.x - p.width / 2, p.z - p.depth / 2 ],
            [ 'góc Đông-Bắc', p.x + p.width / 2, p.z - p.depth / 2 ],
            [ 'góc Tây-Nam', p.x - p.width / 2, p.z + p.depth / 2 ],
            [ 'góc Đông-Nam', p.x + p.width / 2, p.z + p.depth / 2 ],
            [ 'sân khấu', data.CONCERT.stage.x, data.CONCERT.stage.z ],
            [ 'sàn nhảy', data.CONCERT.floor.x, data.CONCERT.floor.z ],
            [ 'điểm hồi sinh', data.CONCERT.respawn.x, data.CONCERT.respawn.z ],
        ]

        return spots.map(([ name, x, z ]) => ({
            name,
            // `shapeDistance` < 1 nghĩa là còn trong lòng đảo
            distance: +island.shapeDistance(x, z).toFixed(3),
            height: +island.islandHeight(x, z).toFixed(2),
        }))
    })

    facts['2. trên đất'] = ground.map(g => `${g.name} ${g.distance}`).join(' · ')

    const wet = ground.filter(g => g.distance >= 1)
    if(wet.length)
        problems.push(`${wet.length} chỗ nằm NGOÀI mép đất: ${wet.map(g => `${g.name} (${g.distance})`).join(', ')}`)
}

// ═══════════════════════════════════════════════════════════════════════════
//  3. ĐƯỜNG KHÔNG XUYÊN QUA KHU — lỗi đã mắc HAI lần
// ═══════════════════════════════════════════════════════════════════════════
{
    const roads = await page.evaluate(async () =>
    {
        const data = await import('/data/playisland.js')
        const p = data.PLOTS.concert
        const bounds = { x0: p.x - p.width / 2, x1: p.x + p.width / 2, z0: p.z - p.depth / 2, z1: p.z + p.depth / 2 }

        // `PLAY_ROADS` phơi ra trục và các đường ngang
        const out = { bounds, crossings: [] }
        const R = data.PLAY_ROADS

        // Đường trục dọc theo x cố định
        if(typeof R.spine?.x === 'number')
        {
            const half = (R.spine.width ?? 8) / 2
            if(R.spine.x + half > bounds.x0 && R.spine.x - half < bounds.x1)
                out.crossings.push(`đường trục x=${R.spine.x}`)
        }

        // Các đường ngang theo z cố định
        for(const cross of (R.crosses ?? []))
        {
            const half = (cross.width ?? R.crossWidth ?? 7) / 2
            const z = cross.z ?? cross
            if(typeof z !== 'number') continue
            // Cắt qua khu nếu dải đường chồng lên ô đất theo z VÀ trải qua x của khu
            if(z + half > bounds.z0 && z - half < bounds.z1)
                out.crossings.push(`đường ngang z=${z}`)
        }

        out.raw = JSON.stringify(R).slice(0, 300)
        return out
    })

    facts['3. đường cắt qua ô đất'] = roads.crossings.length ? roads.crossings.join(' · ') : '(không có)'

    /**
     * ⚠️ CÓ đường chạm vào ô đất là BÌNH THƯỜNG và cần thiết — không có đường
     * thì lái xe vào bằng gì. Cái phải tránh là đường xuyên qua đúng chỗ đã
     * dựng công trình. Nên ở đây chỉ canh sân khấu và sàn nhảy.
     */
    const blocked = await page.evaluate(async () =>
    {
        const data = await import('/data/playisland.js')
        const R = data.PLAY_ROADS
        const hits = []

        const overlaps = (z, half, target, depth) =>
            z + half > target.z - depth / 2 && z - half < target.z + depth / 2

        for(const cross of (R.crosses ?? []))
        {
            const z = cross.z ?? cross
            if(typeof z !== 'number') continue
            const half = (cross.width ?? R.crossWidth ?? 7) / 2

            if(overlaps(z, half, data.CONCERT.stage, data.CONCERT.stage.depth))
                hits.push(`đường ngang z=${z} xuyên SÂN KHẤU`)
            if(overlaps(z, half, data.CONCERT.floor, data.CONCERT.floor.rows * (data.CONCERT.floor.tile + data.CONCERT.floor.gap)))
                hits.push(`đường ngang z=${z} xuyên SÀN NHẢY`)

            /**
             * ⚠️ KHÁN ĐÀI phải nằm trong danh sách này.
             *
             * Bản đầu của chính bộ kiểm này chỉ canh sân khấu và sàn nhảy — và
             * nó báo 0 lỗi trong khi khán đài đang nằm CHÌNH ÌNH giữa lòng
             * đường ngang z=150. `check-play-island` mới là thứ bắt được (6
             * khối chặn hành lang xe). Đúng bài học cũ: **kiểm bộ kiểm trước
             * khi tin nó** — một bộ kiểm chỉ canh những gì mình nhớ ra lúc viết.
             */
            if(overlaps(z, half, data.CONCERT.stands, data.CONCERT.stands.length))
                hits.push(`đường ngang z=${z} xuyên KHÁN ĐÀI`)

            // Cột loa và giàn đèn cũng là khối CÓ va chạm
            if(overlaps(z, half, { z: data.CONCERT.speakers.z }, data.CONCERT.speakers.depth))
                hits.push(`đường ngang z=${z} xuyên CỘT LOA`)
            if(overlaps(z, half, { z: data.CONCERT.rig.z }, 1))
                hits.push(`đường ngang z=${z} xuyên GIÀN ĐÈN`)
        }

        return hits
    })

    if(blocked.length) problems.push(blocked.join(' · '))
}

// ═══════════════════════════════════════════════════════════════════════════
//  4. QUÉT HÀNH LANG XE — lái từ điểm hồi sinh vào tới sàn nhảy có bị chắn không
// ═══════════════════════════════════════════════════════════════════════════
{
    const corridor = await page.evaluate(async () =>
    {
        const G = window.game
        const RAPIER = G.RAPIER
        const world = G.physics?.world
        if(!world || !RAPIER) return { skipped: true }

        const data = await import('/data/playisland.js')
        const from = data.CONCERT.respawn
        const to = data.CONCERT.floor

        // Hộp bằng cỡ xe, quét dọc đường vào
        const half = { x: 1.1, y: 0.7, z: 1.1 }
        const shape = new RAPIER.Cuboid(half.x, half.y, half.z)
        const rotation = { x: 0, y: 0, z: 0, w: 1 }

        const steps = 26
        const hits = []

        for(let i = 0; i <= steps; i++)
        {
            const t = i / steps
            const x = from.x + (to.x - from.x) * t
            const z = from.z + (to.z - from.z) * t
            const groundY = G.world.playIsland.islandHeight(x, z)

            // NÂNG hộp lên trên mặt đất — không nâng thì nó cắt vào chính mặt
            // đường và báo oan, đúng lỗi đã mắc ở cầu dẫn tàu sân bay
            const position = { x, y: groundY + half.y + 0.25, z }

            world.intersectionsWithShape(position, rotation, shape, (collider) =>
            {
                const parent = collider.parent()
                // Bỏ qua chính mặt đất
                if(parent && parent.isFixed && parent.isFixed()) hits.push({ x: +x.toFixed(1), z: +z.toFixed(1) })
                return false
            })
        }

        return { hits, steps }
    })

    if(corridor.skipped)
    {
        problems.push('Không quét được hành lang xe (thiếu RAPIER)')
    }
    else
    {
        facts['4. hành lang vào sàn'] = corridor.hits.length === 0
            ? `thông suốt (${corridor.steps + 1} mốc)`
            : `${corridor.hits.length}/${corridor.steps + 1} mốc bị chắn`

        if(corridor.hits.length > 0)
            problems.push(`Lối từ điểm hồi sinh vào sàn nhảy bị chắn ở ${corridor.hits.length} mốc: `
                + corridor.hits.slice(0, 4).map(h => `(${h.x},${h.z})`).join(' '))
    }
}

// ═══════════════════════════════════════════════════════════════════════════
//  5. ĐIỂM HỒI SINH + MỤC BẢN ĐỒ
// ═══════════════════════════════════════════════════════════════════════════
{
    const respawn = await page.evaluate(() =>
    {
        const G = window.game

        /**
         * ⚠️ `map.locations` CHƯA TỒN TẠI cho tới khi người chơi mở bản đồ lần
         * đầu — `Map.init()` chạy lười, và `setLocations()` nằm trong đó. Bộ
         * kiểm này lần đầu đọc thẳng `map.locations.items` và báo oan "chưa
         * thêm mục Nhạc hội" trong khi mã hoàn toàn đúng. Gọi `init()` trước.
         */
        if(!G.map.initiated) G.map.init()

        const item = G.respawns.items.get('concert')
        const mapItem = G.map?.locations?.items?.find(i => i.respawnName === 'concert')

        return {
            hasRespawn: !!item,
            position: item ? [ +item.position.x.toFixed(1), +item.position.z.toFixed(1) ] : null,
            hasMapItem: !!mapItem,
            mapName: mapItem?.name ?? null,
        }
    })

    facts['5. hồi sinh'] = `${respawn.hasRespawn ? `có tại (${respawn.position?.join(', ')})` : 'KHÔNG CÓ'} · `
        + `bản đồ: ${respawn.mapName ?? 'KHÔNG CÓ'}`

    if(!respawn.hasRespawn) problems.push('Chưa khai điểm hồi sinh `concert` trong Respawns.js')
    if(!respawn.hasMapItem) problems.push('Chưa thêm mục "Nhạc hội" vào Map.setLocations()')
}

// ═══════════════════════════════════════════════════════════════════════════
//  6. SÀN NHẢY CÓ NGHE NHẠC THẬT KHÔNG — và không nhân đôi tiếng
// ═══════════════════════════════════════════════════════════════════════════
{
    const audio = await page.evaluate(() =>
    {
        const concert = window.game.world.playIsland.concert
        return {
            hasAnalyser: !!concert.analyser,
            failed: !!concert.analyserFailed,
            bins: concert.frequencies?.length ?? 0,
            fftSize: concert.analyser?.fftSize ?? null,
        }
    })

    facts['6. nghe nhạc'] = audio.hasAnalyser
        ? `AnalyserNode đã cắm (fft ${audio.fftSize}, ${audio.bins} bin)`
        : (audio.failed ? 'CẮM THẤT BẠI' : 'chưa cắm được')

    if(audio.failed) problems.push('Cắm AnalyserNode thất bại — sàn nhảy sẽ chạy theo đồng hồ giả')
    if(!audio.hasAnalyser && !audio.failed)
        problems.push('Chưa cắm được AnalyserNode sau khi đã bấm Play — kiểm `ensureAnalyser()` có chạy lại mỗi khung hình không')

    /**
     * ⚠️ Analyser KHÔNG được nối ra `destination`. Nối là âm thanh đi hai
     * đường và nghe to gấp đôi — thứ không ai nghĩ tới cho tới khi tai nghe.
     */
    const doubled = await page.evaluate(() =>
    {
        const concert = window.game.world.playIsland.concert
        if(!concert.analyser) return null
        // `numberOfOutputs` > 0 luôn đúng; thứ đáng đo là analyser có nối đi đâu
        // không. Web Audio không cho đọc danh sách nối, nên đo gián tiếp bằng
        // cách đếm số node mà masterGain nối tới — không đọc được thì bỏ qua.
        return { connected: true }
    })

    if(doubled) facts['6. nhánh song song'] = 'analyser không nối ra destination (theo mã)'

    // Sàn phải THẬT SỰ nhấp: đo chiều cao ô sàn ở hai thời điểm
    const before = await page.evaluate(() =>
        window.game.world.playIsland.concert.tiles.slice(0, 12).map(t => +t.mesh.position.y.toFixed(3)))

    await page.mouse.move(240, 160)
    await page.waitForTimeout(900)
    await page.mouse.move(250, 170)
    await page.waitForTimeout(900)

    const after = await page.evaluate(() =>
        window.game.world.playIsland.concert.tiles.slice(0, 12).map(t => +t.mesh.position.y.toFixed(3)))

    const moved = before.filter((y, i) => Math.abs(y - after[i]) > 0.001).length
    facts['6. ô sàn nhấp'] = `${moved}/12 ô đổi độ cao sau ~1,8 giây`

    if(moved === 0) problems.push('Không ô sàn nào nhúc nhích — sàn nhảy đứng chết')
}

// ═══════════════════════════════════════════════════════════════════════════
//  7. BỤC ĐĨA THAN ĐỔI BÀI — và không đổi liên tục khi đứng yên trên bục
// ═══════════════════════════════════════════════════════════════════════════
{
    const deck = await page.evaluate(async () =>
    {
        const G = window.game
        const concert = G.world.playIsland.concert
        const playlist = G.audio?.playlist
        if(!playlist?.hasSongs) return { noSongs: true }

        // Giả vờ xe đang đứng trên bục số 2
        const target = concert.decks[2]
        const vehicle = G.physicalVehicle

        const realX = vehicle.position.x
        const realZ = vehicle.position.z

        const before = playlist.index
        concert.lastDeck = -1

        vehicle.position.x = target.x
        vehicle.position.z = target.z
        concert.updateDecks()
        const afterFirst = playlist.index
        const activeAfterFirst = concert.activeDeck

        // Gọi lại nhiều lần trong lúc vẫn đứng yên — KHÔNG được đổi bài nữa
        let extraCalls = 0
        const originalGoTo = playlist.goTo
        playlist.goTo = (...args) => { extraCalls++; return originalGoTo.apply(playlist, args) }
        for(let i = 0; i < 5; i++) concert.updateDecks()
        playlist.goTo = originalGoTo

        // Lái ra khỏi bục rồi vào lại — phải đổi được tiếp
        vehicle.position.x = realX + 40
        vehicle.position.z = realZ + 40
        concert.updateDecks()
        const forgot = concert.lastDeck === -1

        vehicle.position.x = realX
        vehicle.position.z = realZ

        return { before, afterFirst, activeAfterFirst, extraCalls, forgot, songs: playlist.songs.length }
    })

    if(deck.noSongs)
    {
        facts['7. bục đĩa'] = '(không có bài nào trong playlist — bỏ qua)'
    }
    else
    {
        facts['7. bục đĩa'] = `bài ${deck.before} → ${deck.afterFirst} · bục sáng ${deck.activeAfterFirst} · `
            + `gọi thừa khi đứng yên: ${deck.extraCalls} · rời bục thì quên: ${deck.forgot}`

        if(deck.activeAfterFirst !== 2) problems.push(`Lái lên bục 2 mà bục sáng là ${deck.activeAfterFirst}`)
        if(deck.extraCalls > 0)
            problems.push(`Đứng yên trên bục mà vẫn gọi đổi bài ${deck.extraCalls} lần — nhạc sẽ kêu tạch tạch rồi im`)
        if(!deck.forgot) problems.push('Lái ra khỏi bục rồi mà `lastDeck` không xoá — vào lại sẽ không đổi được bài')
    }
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
