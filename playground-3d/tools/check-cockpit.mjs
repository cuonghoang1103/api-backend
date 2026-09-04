/**
 * KIỂM CHẾ ĐỘ LÁI NGƯỜI THỨ NHẤT — buồng lái và máy quay ghế lái.
 *
 * Chạy: `PLAY_URL=http://localhost:5174 node tools/check-cockpit.mjs`
 * (cần `npm run dev` đang sống — nhớ truyền đúng cổng Vite THẬT, xem
 * `preview_logs`, vì Vite nhảy cổng khi 5173 bận).
 *
 * ⚠️ KHÔNG tự bơm `ticker.events.trigger('tick')` và KHÔNG gọi
 * `physicalVehicle.moveTo()` — vòng lặp rAF thật vẫn chạy song song, bơm chồng
 * lên là Rapier ném "recursive use of an object … unsafe aliasing in rust".
 * Ở đây chỉ ĐỌC trạng thái, đặt vài giá trị vô hại (`player.steering`), rồi để
 * game tự chạy vài nhịp thật.
 *
 * ─── BỘ NÀY CANH NHỮNG GÌ ───
 * Toàn bộ đều là những lỗi ĐÃ THẬT SỰ XẢY RA trong lúc làm, và không cái nào
 * báo lỗi ra console:
 *
 *  1. Hộp bao thân xe tính nhầm cả đồ gắn thêm (pháo, bệ phóng, bánh) ⇒ đỉnh
 *     xe vống từ 0,72 lên 1,805 và người lái ngồi lơ lửng trên nóc.
 *  2. Mắt đặt LỌT TRONG khối thân đặc ⇒ vỏ xe chỉ vẽ mặt ngoài nên hình ra là
 *     nhìn xuyên qua xe.
 *  3. Đổi xe làm mất sạch nội thất (nó treo dưới `chassis` chiếc vừa `destroy`).
 *  4. Máy quay ngắm sai hướng — không trùng mũi xe.
 *  5. NaN đọng lại trong bộ lọc hồi tiếp của góc ngoái / FOV.
 *  6. Đồng hồ quay lưng về phía người lái.
 */

const BASE = process.env.PLAY_URL ?? 'http://localhost:5173'
const { chromium } = await import(process.env.PW ?? '/Users/admin/Downloads/api-backend/node_modules/playwright/index.mjs')

const browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {})
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
page.on('pageerror', (error) => console.log('  [lỗi trang]', error.message))

await page.goto(`${BASE}/#skip`, { waitUntil: 'load' })
await page.waitForFunction(() => window.game?.world?.cockpit, null, { timeout: 60000 })
await page.waitForSelector('.js-welcome-play', { timeout: 60000 })
await page.evaluate(() => document.querySelector('.js-welcome-play')?.click())
await page.waitForFunction(() => (window.game?.reveal?.distance?.value ?? 0) > 1000, null, { timeout: 60000 })
await page.waitForTimeout(1200)

// Vào cabin rồi để game chạy thật vài nhịp
await page.evaluate(() => window.game.view.setMode(3))
await page.mouse.move(640, 360)
await page.waitForTimeout(1200)

const report = await page.evaluate(async () =>
{
    const G = window.game
    const cockpit = G.world.cockpit
    const view = G.view
    const problems = []
    const facts = {}
    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))
    const round = (n) => Math.round(n * 1000) / 1000

    // ── 1. Buồng lái có dựng lên thật ───────────────────────────────────────
    {
        /**
         * ⚠️ ĐỪNG kiểm bằng ngưỡng cứng "ít nhất N mảnh".
         * User tắt dần từng bộ phận cho gọn (xem `PARTS` trong `Cockpit.js`),
         * nên con số ấy tụt theo ý người dùng chứ không phải theo lỗi. Kiểm
         * đúng thứ đáng kiểm: **mục nào đang BẬT thì phải thật sự dựng lên**.
         */
        facts.soMeshNoiThat = cockpit.group ? cockpit.group.children.length : 0
        facts.bocPhanDangBat = Object.entries(cockpit.parts ?? {}).filter(([ , on ]) => on).map(([ name ]) => name).join(' · ') || '(không có gì)'

        if(!cockpit.group) problems.push('Buồng lái KHÔNG dựng được (group rỗng)')

        const built = {
            dashboard: !!cockpit.dashboard,
            gauges: !!(cockpit.needles?.speed && cockpit.needles?.rev),
            steeringWheel: !!cockpit.steeringRim,
            windshield: !!cockpit.glass,
        }
        for(const [ name, on ] of Object.entries(cockpit.parts ?? {}))
        {
            if(!(name in built)) continue
            if(on && !built[name]) problems.push(`PARTS.${name} đang BẬT nhưng không dựng lên`)
            if(!on && built[name]) problems.push(`PARTS.${name} đang TẮT nhưng vẫn dựng lên`)
        }

        if(!cockpit.bounds) problems.push('Không đo được hộp bao thân xe')
    }

    // ── 2. Hộp bao thân xe KHÔNG được tính đồ gắn thêm ──────────────────────
    // Khẩu pháo, bệ phóng và bánh đều là con của `chassis`. Tính chúng vào là
    // hộp bao vống lên, và đó chính là lỗi đã làm người lái ngồi trên nóc.
    if(cockpit.bounds)
    {
        const chassis = G.world.visualVehicle.parts.chassis
        const b = cockpit.bounds
        facts.hopBaoThan = `${round(b.size.x)} × ${round(b.size.y)} × ${round(b.size.z)} (đỉnh y = ${round(b.max.y)})`

        // Đo lại hộp bao KHÔNG loại trừ gì cả, để so
        let rawMaxY = -Infinity
        chassis.traverse((child) =>
        {
            if(!child.isMesh || !child.geometry) return
            if(!child.geometry.boundingBox) child.geometry.computeBoundingBox()
            if(!child.geometry.boundingBox) return
            const chain = []
            let node = child
            while(node && node !== chassis) { chain.push(node); node = node.parent }
            if(node !== chassis) return
            const m = chassis.matrix.clone().identity()
            for(let i = chain.length - 1; i >= 0; i--) { chain[i].updateMatrix(); m.multiply(chain[i].matrix) }
            const bb = child.geometry.boundingBox.clone().applyMatrix4(m)
            rawMaxY = Math.max(rawMaxY, bb.max.y)
        })
        facts.dinhNeuKhongLoaiTru = round(rawMaxY)

        if(b.max.y >= rawMaxY - 0.001 && rawMaxY > 0)
            problems.push(`Hộp bao thân xe hình như ĐÃ tính cả đồ gắn thêm (đỉnh ${round(b.max.y)} = đỉnh thô ${round(rawMaxY)}). Kiểm cờ userData.vehicleAttachment và thứ tự dựng trong World.js`)

        // Bánh xe không được kéo đáy hộp bao xuống
        if(b.min.y < -b.size.x)
            problems.push(`Đáy hộp bao (${round(b.min.y)}) thấp bất thường — có phải đã tính cả bánh xe?`)
    }

    // ── 3. Mắt người lái phải NGOÀI khối thân đặc ───────────────────────────
    // Mấy model xe này đặc ruột. Mắt lọt vào trong thì vỏ xe (chỉ vẽ mặt ngoài)
    // biến thành trong suốt và hình ra là nhìn xuyên qua chính chiếc xe.
    if(cockpit.bounds)
    {
        const b = cockpit.bounds
        facts.matNguoiLai = `(${round(cockpit.eye.x)} · ${round(cockpit.eye.y)} · ${round(cockpit.eye.z)})`
        facts.matSoVoiDinhThan = round(cockpit.eye.y - b.max.y)

        if(cockpit.eye.y <= b.max.y)
            problems.push(`Mắt người lái (y = ${round(cockpit.eye.y)}) nằm DƯỚI đỉnh thân xe (${round(b.max.y)}) — máy quay sẽ chui vào trong khối đặc`)

        if(cockpit.eye.x < b.min.x || cockpit.eye.x > b.max.x)
            problems.push(`Mắt người lái nằm ngoài xe theo chiều dọc (x = ${round(cockpit.eye.x)}, thân ${round(b.min.x)}…${round(b.max.x)})`)

        if(Math.abs(cockpit.eye.z - b.center.z) > b.size.z * 0.5)
            problems.push(`Mắt người lái nằm ngoài xe theo bề ngang (z = ${round(cockpit.eye.z)})`)
    }

    // ── 4. Tia nhìn thẳng trước KHÔNG bị chính thân xe chắn ─────────────────
    // Đây là phép đo đã lộ ra chuyện xe đặc ruột. Bắn tia trong hệ CỤC BỘ của
    // chassis nên không phụ thuộc xe đang đứng ở đâu trên bản đồ.
    if(cockpit.bounds)
    {
        const chassis = G.world.visualVehicle.parts.chassis
        const targets = []
        chassis.traverse((child) =>
        {
            if(!child.isMesh) return
            let node = child, skip = false
            while(node && node !== chassis)
            {
                if(node.userData?.vehicleAttachment || /^wheel/i.test(node.name)) { skip = true; break }
                node = node.parent
            }
            if(!skip) targets.push(child)
        })

        const savedPosition = chassis.position.clone()
        const savedQuaternion = chassis.quaternion.clone()
        chassis.position.set(0, 0, 0)
        chassis.quaternion.identity()
        chassis.updateMatrixWorld(true)

        const raycaster = new (view.optimalArea.raycaster.constructor)()
        raycaster.far = 8
        const V3 = chassis.position.constructor

        const blocked = []
        for(const dir of [
            { name: 'thẳng trước', v: [ 1, 0, 0 ] },
            { name: 'chếch trái', v: [ 0.87, 0, -0.5 ] },
            { name: 'chếch phải', v: [ 0.87, 0, 0.5 ] },
        ])
        {
            raycaster.set(cockpit.eye, new V3(...dir.v).normalize())
            const hits = raycaster.intersectObjects(targets, false)
            if(hits.length) blocked.push(`${dir.name}@${round(hits[0].distance)}`)
        }

        chassis.position.copy(savedPosition)
        chassis.quaternion.copy(savedQuaternion)
        chassis.updateMatrixWorld(true)

        facts.huongNhinBiThanXeChan = blocked.length ? blocked.join(' · ') : 'không hướng nào'
        if(blocked.length)
            problems.push(`Thân xe chắn tầm nhìn ra trước: ${blocked.join(' · ')}`)
    }

    // ── 5. Máy quay ngắm đúng mũi xe khi không ngoái đầu ────────────────────
    {
        view.cockpit.yaw = 0
        view.cockpit.pitch = 0
        view.cockpit.smoothedYaw = 0
        view.cockpit.smoothedPitch = 0
        view.cockpit.hasPointer = false
        await wait(400)

        const e = view.camera.matrixWorld.elements
        const look = { x: -e[8], y: -e[9], z: -e[10] }
        const forward = G.physicalVehicle.forward
        const dot = look.x * forward.x + look.y * forward.y + look.z * forward.z

        facts.huongNhinSoVoiMuiXe = round(dot)
        if(dot < 0.9)
            problems.push(`Máy quay không ngắm theo mũi xe (tích vô hướng ${round(dot)}, đáng lẽ ≈ 1). Kiểm \`cockpit.baseYaw\``)

        const distance = view.camera.position.distanceTo(G.physicalVehicle.position)
        facts.khoangCachToiTamXe = round(distance)
        if(distance > Math.max(cockpit.bounds?.size.x ?? 3, 3))
            problems.push(`Máy quay cách tâm xe ${round(distance)} — quá xa để gọi là ngồi trong xe`)
    }

    // ── 5b. Khoá hướng nhìn: rê chuột KHÔNG được làm lệch máy quay ──────────
    // User bác bản đầu vì đúng chuyện này: *"nó cứ lệch cam khi chạm trúng
    // chuột"*. Khoá bật thì con trỏ nằm đâu cũng kệ, chỉ khi GIỮ chuột mới ngoái.
    {
        facts.khoaHuongNhinMacDinh = view.cockpit.lookLocked ? 'bật' : 'TẮT'
        if(!view.cockpit.lookLocked)
            problems.push('Khoá hướng nhìn KHÔNG bật sẵn — lái xe sẽ bị lệch máy quay mỗi lần chạm chuột')

        view.cockpit.lookLocked = true
        view.cockpit.hasPointer = true
        view.cockpit.yaw = 1.2
        view.cockpit.pitch = 0.3

        /**
         * ⚠️ ĐỪNG `await` rồi đo — phải gọi thẳng `updateCockpitLook()`.
         * Chromium headless bóp `requestAnimationFrame` khi trang không có
         * tương tác nào, nên chờ 1,5 giây có khi chỉ chạy được vài khung: góc
         * mới trôi được một phần và bộ kiểm BÁO OAN. Đo lần đầu đúng kiểu đó
         * ra "yaw còn 0,781" trong khi game thật về 0 trong khoảng 0,7 giây.
         * Gọi tay thì tất định, và hàm này không đụng Rapier nên an toàn.
         */
        for(let i = 0; i < 80; i++) view.updateCockpitLook()

        facts.gocSauKhiThaChuot = `yaw ${round(view.cockpit.yaw)} · pitch ${round(view.cockpit.pitch)}`
        if(Math.abs(view.cockpit.yaw) > 0.15 || Math.abs(view.cockpit.pitch) > 0.15)
            problems.push(`Khoá đang bật mà góc ngoái không trôi về nhìn thẳng (yaw còn ${round(view.cockpit.yaw)}, pitch ${round(view.cockpit.pitch)})`)
    }

    // ── 6. Ngoái đầu có giới hạn và không vượt biên ─────────────────────────
    // ⚠️ Phải TẮT khoá trước, không thì nhánh "tự về nhìn thẳng" kéo góc về 0
    // và phép kiểm giới hạn thành vô nghĩa (luôn pass vì chẳng bao giờ chạm biên).
    {
        view.cockpit.lookLocked = false
        view.cockpit.hasPointer = true
        view.cockpit.yaw = 99
        view.cockpit.pitch = 99
        view.updateCockpitLook()
        const overMax = view.cockpit.yaw > view.cockpit.maxYaw + 1e-6 || view.cockpit.pitch > view.cockpit.maxPitchUp + 1e-6

        view.cockpit.yaw = -99
        view.cockpit.pitch = -99
        view.updateCockpitLook()
        const underMin = view.cockpit.yaw < -view.cockpit.maxYaw - 1e-6 || view.cockpit.pitch < -view.cockpit.maxPitchDown - 1e-6

        facts.gioiHanNgoai = `yaw ±${round(view.cockpit.maxYaw)} rad · pitch −${round(view.cockpit.maxPitchDown)}…+${round(view.cockpit.maxPitchUp)}`
        if(overMax || underMin) problems.push('Góc ngoái đầu KHÔNG bị kẹp trong giới hạn')

        view.cockpit.yaw = 0
        view.cockpit.pitch = 0
        view.cockpit.lookLocked = true
    }

    // ── 6b. Máy quay phải chúc xuống nhìn đường ─────────────────────────────
    // Ngắm ngang thì đường chỉ còn một dải mỏng giữa khung — đúng thứ user chê
    // ở bản đầu. Góc nền phải âm (cúi xuống) và mắt phải cao hơn nóc kha khá.
    {
        facts.gocChucNen = `${round(view.cockpit.basePitch)} rad (${round(view.cockpit.basePitch * 180 / Math.PI)}°)`
        if(view.cockpit.basePitch >= 0)
            problems.push('Máy quay cabin KHÔNG chúc xuống — sẽ rất khó nhìn đường')

        if(cockpit.bounds)
        {
            const aboveRoof = cockpit.eye.y - cockpit.bounds.max.y
            facts.matCaoHonNoc = round(aboveRoof)
            if(aboveRoof < cockpit.bounds.size.y * 0.2)
                problems.push(`Mắt chỉ cao hơn nóc ${round(aboveRoof)} — quá thấp, tầm nhìn đường sẽ bị mui xe ăn mất`)
        }
    }

    // ── 7. NaN không được đọng lại trong bộ lọc hồi tiếp ────────────────────
    // `smoothedYaw = lerp(smoothedYaw, …)` là bộ lọc hồi tiếp: một khung hình
    // NaN lọt vào là nó ở lại VĨNH VIỄN. Đúng bệnh đã giết máy quay bám xe
    // ngày 31/7 (xem bàn giao mục 0c).
    {
        view.cockpit.smoothedYaw = NaN
        view.cockpit.smoothedPitch = NaN
        view.cockpit.smoothedFov = NaN
        await wait(600)

        facts.tuLanhSauNaN = `yaw ${round(view.cockpit.smoothedYaw)} · pitch ${round(view.cockpit.smoothedPitch)} · fov ${round(view.cockpit.smoothedFov)}`
        if(!Number.isFinite(view.cockpit.smoothedYaw) || !Number.isFinite(view.cockpit.smoothedPitch) || !Number.isFinite(view.cockpit.smoothedFov))
            problems.push('Góc ngoái / FOV KHÔNG tự lành sau khi dính NaN — máy quay sẽ chết hẳn tới lúc tải lại trang')

        if(!Number.isFinite(view.camera.position.x) || !Number.isFinite(view.camera.fov))
            problems.push('Vị trí hoặc FOV máy quay là NaN')
    }

    // ── 8. Vô lăng quay theo tay lái ────────────────────────────────────────
    /**
     * ⚠️ ĐỪNG gán `player.steering` rồi `await` chờ.
     * `Player.updatePrePhysics()` (nhịp 1) đặt `this.steering = 0` ở dòng đầu
     * mỗi khung rồi mới cộng lại từ bàn phím — nên giá trị gán từ ngoài sống
     * chưa hết một khung hình. Phép kiểm bản đầu làm đúng kiểu đó và báo oan
     * "vô lăng không quay". Ở đây gán rồi gọi thẳng `cockpit.update()` mấy chục
     * lần liên tiếp: JS chạy một luồng nên không nhịp nào chen vào giữa được.
     *
     * Gọi tay `cockpit.update()` là AN TOÀN vì nó không hề đụng tới Rapier —
     * khác hẳn `physicalVehicle.moveTo()`, thứ mà bàn giao cấm bơm bằng tay.
     */
    // ⚠️ Vô lăng đang TẮT theo yêu cầu user (`PARTS.steeringWheel` trong
    // `Cockpit.js`) — bỏ qua mục này thay vì báo lỗi. Bật lại là nó tự kiểm.
    if(!cockpit.steeringRim)
    {
        facts.gocVoLang = '(vô lăng đang tắt — bỏ qua)'
    }
    else
    {
        const before = cockpit.steeringAngle
        G.player.steering = 1
        for(let i = 0; i < 40; i++) cockpit.update()
        const right = cockpit.steeringAngle

        G.player.steering = -1
        for(let i = 0; i < 40; i++) cockpit.update()
        const left = cockpit.steeringAngle

        G.player.steering = 0

        facts.gocVoLang = `giữa ${round(before)} → phải ${round(right)} → trái ${round(left)}`
        if(Math.abs(right - before) < 0.1) problems.push('Vô lăng KHÔNG quay khi đánh lái sang phải')
        if(Math.abs(left - right) < 0.2) problems.push('Vô lăng KHÔNG đổi chiều khi đánh lái ngược lại')
        if(Math.sign(right) === Math.sign(left) && right !== 0)
            problems.push(`Vô lăng quay CÙNG một chiều cho cả hai hướng lái (${round(right)} và ${round(left)})`)
    }

    // ── 9. Đồng hồ quay mặt về phía người lái ───────────────────────────────
    // Đặt nhầm mặt táp lô hoặc nhầm dấu `rotation.y` thì đồng hồ vẫn dựng lên
    // nhưng quay ra đằng trước — chỉ người đi đường mới đọc được.
    // Bỏ qua khi đồng hồ đang tắt (`PARTS.gauges`) — user cố ý, không phải lỗi
    if(!cockpit.parts?.gauges)
    {
        facts.matSoQuayVeNguoiLai = '(đồng hồ đang tắt — bỏ qua)'
    }
    else
    {
        const dials = []
        cockpit.group.traverse((child) =>
        {
            if(child.isMesh && child.geometry?.type === 'PlaneGeometry' && child !== cockpit.glass) dials.push(child)
        })

        let facingDriver = 0
        const normal = new (G.physicalVehicle.forward.constructor)()
        for(const dial of dials)
        {
            normal.set(0, 0, 1).applyQuaternion(dial.quaternion)
            // Mặt số phải nhìn về −X (phía người lái ngồi)
            if(normal.x < -0.7) facingDriver++
        }

        facts.matSoQuayVeNguoiLai = `${facingDriver}/${dials.length} tấm phẳng (đã trừ kính chắn gió)`
        if(facingDriver < 2)
            problems.push(`Chỉ ${facingDriver} mặt số quay về phía người lái (đáng lẽ 2) — kiểm dấu của \`rotation.y\` trong setGauges()`)

        if(cockpit.needles.speed && cockpit.needles.rev)
        {
            const a = cockpit.needles.speed.rotation.z
            const b = cockpit.needles.rev.rotation.z
            facts.gocKim = `tốc độ ${round(a)} · vòng tua ${round(b)}`
            if(!Number.isFinite(a) || !Number.isFinite(b)) problems.push('Góc kim đồng hồ là NaN')
        }
        else problems.push('Thiếu kim đồng hồ')
    }

    // ── 10. Đổi xe không được làm mất nội thất ──────────────────────────────
    {
        const before = cockpit.group.children.length
        const beforeEye = cockpit.eye.clone()

        await G.world.garage.select('oldschool')
        await wait(2200)
        const afterOld = cockpit.group?.children.length ?? 0
        const eyeOld = cockpit.eye.clone()

        await G.world.garage.select('default')
        await wait(2200)
        const afterBack = cockpit.group?.children.length ?? 0

        facts.doiXe = `${before} mảnh → oldschool ${afterOld} → về default ${afterBack}`
        facts.matTheoXe = `default (${round(beforeEye.x)} · ${round(beforeEye.y)}) → oldschool (${round(eyeOld.x)} · ${round(eyeOld.y)})`

        // So với chính số mảnh TRƯỚC khi đổi, không với ngưỡng cứng — số ấy phụ
        // thuộc `PARTS`, mà `PARTS` thì user vặn theo ý
        if(afterOld < before) problems.push(`Đổi sang oldschool làm mất nội thất (${before} → ${afterOld} mảnh)`)
        if(afterBack < before) problems.push(`Đổi ngược về default làm mất nội thất (${before} → ${afterBack} mảnh)`)
        if(Math.abs(eyeOld.y - beforeEye.y) < 1e-6 && Math.abs(eyeOld.x - beforeEye.x) < 1e-6)
            problems.push('Chỗ ngồi KHÔNG đo lại theo xe mới — có phải đang gõ cứng số?')

        // Sau khi đổi xe, hộp bao vẫn phải sạch (không nuốt luôn buồng lái cũ)
        if(cockpit.bounds && cockpit.bounds.size.y > 4)
            problems.push(`Hộp bao thân xe phình sau khi đổi xe (cao ${round(cockpit.bounds.size.y)}) — buồng lái tự đo lại chính mình?`)
    }

    // ── 11. Ra khỏi cabin phải trả lại FOV và lớp mờ mép khung ──────────────
    {
        view.setMode(1)
        await wait(500)

        facts.fovSauKhiRa = round(view.camera.fov)
        if(Math.abs(view.camera.fov - view.defaultCamera.fov) > 0.01)
            problems.push(`Ra khỏi cabin nhưng FOV vẫn là ${round(view.camera.fov)} (đáng lẽ ${view.defaultCamera.fov})`)

        if(cockpit.visible) problems.push('Ra khỏi cabin nhưng nội thất vẫn hiện')

        const dof = G.rendering?.cheapDOFPass
        if(dof)
        {
            facts.mepMoSauKhiRa = `start ${round(dof.start.value)} · end ${round(dof.end.value)}`
            if(dof.start.value > 0.9)
                problems.push('Ra khỏi cabin nhưng lớp mờ mép khung (cheapDOF) vẫn bị tắt')
        }

        // Và vào lại phải chạy được
        view.setMode(3)
        await wait(600)
        if(!cockpit.visible) problems.push('Vào lại cabin nhưng nội thất không hiện')
        if(Math.abs(view.camera.fov - view.defaultCamera.fov) < 0.01)
            problems.push('Vào lại cabin nhưng FOV không đổi sang góc rộng')
        view.setMode(1)
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
