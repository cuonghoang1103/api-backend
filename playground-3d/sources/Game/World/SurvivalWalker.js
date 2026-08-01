import * as THREE from 'three/webgpu'
import { color } from 'three/tsl'
import { Game } from '../Game.js'
import { MeshDefaultMaterial } from '../Materials/MeshDefaultMaterial.js'
import { SURVIVAL_WALKER } from '../../data/survival.js'

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  XUỐNG XE ĐI BỘ — phần "sau" của lời hứa "xe trước, đi bộ sau"
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Bấm **E** khi xe đang đứng để bước xuống. Đi bằng W/A/S/D hoặc phím mũi tên,
 * giữ **Shift** để chạy. Bấm **E** lần nữa khi đứng cạnh xe để leo lên lại.
 *
 * Đổi lại lớp vỏ thép: quái chạm là ăn đòn nặng hơn 60%, không húc được ai.
 * Bù lại nấp giỏi hơn hẳn (tầm phát hiện chỉ còn 62%) — không đèn pha, không
 * tiếng động cơ, thân người nhỏ.
 *
 * ─── BA CHỖ MÓC VÀO BẢN MẪU ─────────────────────────────────────────────────
 *
 * 1. **`inputs.filters`** — đúng cơ chế bản mẫu dùng để chuyển giữa lái xe và
 *    đua (xem `CircuitArea`). Xuống xe thì `filters` chỉ còn `'walking'`, nên
 *    mọi phím lái bị nuốt và chiếc xe đứng im dù người chơi bấm W. Không có nó
 *    thì xe bỏ chạy một mình trong lúc chủ đang đi bộ.
 *
 * 2. **`view.focusPoint.trackedPosition`** — `Player` ghi vị trí xe vào đó ở
 *    nhịp 6, `View` đọc ở nhịp 7. Ghi đè ở **nhịp 6.5** là máy quay bám người
 *    mà không phải sửa một dòng nào của `View`.
 *
 * 3. **`Survival.target`** — đàn quái vốn đã nhận mục tiêu qua tham số
 *    (`monsters.update(delta, target, …)`), nên chuyển sang đuổi người đi bộ
 *    chỉ là đổi một véc-tơ.
 */
export class SurvivalWalker
{
    constructor(survival)
    {
        this.game = Game.getInstance()
        this.survival = survival

        this.active = false
        this.position = new THREE.Vector3()
        this.heading = 0
        this.phase = 0
        this.speed = 0
        this.groundY = 0

        /** Cờ input, cập nhật từ các action riêng của chế độ đi bộ. */
        this.moves = { forward: false, backward: false, left: false, right: false, run: false }

        this.materials = new Map()
        this.boxGeometry = new THREE.BoxGeometry(1, 1, 1)
        this.sphereGeometry = new THREE.SphereGeometry(0.5, 8, 6)

        this.group = new THREE.Group()
        this.group.name = 'survivalWalker'
        this.group.visible = false
        this.game.scene.add(this.group)

        this.build()
        this.setActions()

        /**
         * Nhịp **6.5** — sau `Player` (6) đã ghi vị trí xe vào `focusPoint` và
         * trước `View` (7) đọc nó. Đúng một khe hẹp đó, không sớm hơn không
         * muộn hơn: sớm thì `Player` ghi đè lại, muộn thì máy quay đã dùng vị
         * trí cũ và người đi bộ trôi lệch một khung hình.
         */
        this.game.ticker.events.on('tick', () => this.update(), 6.5)
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  DỰNG NGƯỜI
    // ═══════════════════════════════════════════════════════════════════════

    material(hex)
    {
        let m = this.materials.get(hex)
        if(!m)
        {
            m = new MeshDefaultMaterial({ colorNode: color(hex) })
            this.materials.set(hex, m)
        }
        return m
    }

    part(parent, w, h, d, x, y, z, hex, geometry = null)
    {
        const mesh = new THREE.Mesh(geometry ?? this.boxGeometry, this.material(hex))
        mesh.scale.set(w, h, d)
        mesh.position.set(x, y, z)
        mesh.castShadow = true
        mesh.receiveShadow = true
        parent.add(mesh)
        return mesh
    }

    /**
     * Người chơi: cùng bộ khớp với `FptuPeople` (đùi treo ở hông, cẳng treo ở
     * gối) nên nhịp đi đọc ra y hệt — nhưng mặc áo khoác, áo giáp và ủng để
     * KHÔNG lẫn vào đám sinh viên trong khuôn viên. Ở cỡ nhìn này màu áo là thứ
     * duy nhất phân biệt được "mình" với "người qua đường".
     */
    build()
    {
        const c = SURVIVAL_WALKER.colors
        const root = new THREE.Group()

        // ── Chân ────────────────────────────────────────────────────────────
        this.legs = []
        for(const side of [ -1, 1 ])
        {
            const hip = new THREE.Group()
            hip.position.set(side * 0.12, 0.9, 0)
            root.add(hip)
            this.part(hip, 0.22, 0.48, 0.24, 0, -0.24, 0, c.pants)

            const knee = new THREE.Group()
            knee.position.set(0, -0.48, 0)
            hip.add(knee)
            this.part(knee, 0.2, 0.44, 0.22, 0, -0.22, 0, c.pants)
            this.part(knee, 0.23, 0.16, 0.38, 0, -0.46, 0.07, c.boots)

            this.legs.push({ hip, knee })
        }

        // ── Thân: áo khoác + áo giáp ────────────────────────────────────────
        this.part(root, 0.42, 0.26, 0.26, 0, 1.02, 0, c.pants)
        this.part(root, 0.48, 0.46, 0.28, 0, 1.38, 0, c.jacket)
        this.part(root, 0.4, 0.34, 0.32, 0, 1.36, 0, c.vest)
        this.part(root, 0.56, 0.14, 0.29, 0, 1.6, 0, c.jacket)

        // ── Tay ─────────────────────────────────────────────────────────────
        this.arms = []
        for(const side of [ -1, 1 ])
        {
            const shoulder = new THREE.Group()
            shoulder.position.set(side * 0.33, 1.58, 0)
            root.add(shoulder)
            this.part(shoulder, 0.16, 0.4, 0.18, 0, -0.2, 0, c.jacket)

            const elbow = new THREE.Group()
            elbow.position.set(0, -0.4, 0)
            shoulder.add(elbow)
            this.part(elbow, 0.14, 0.36, 0.16, 0, -0.18, 0, c.jacket)
            this.part(elbow, 0.15, 0.15, 0.15, 0, -0.4, 0, c.skin)

            this.arms.push({ shoulder, elbow })
        }

        // ── Cổ, đầu, tóc, mũ ────────────────────────────────────────────────
        this.part(root, 0.14, 0.1, 0.14, 0, 1.7, 0, c.skin)
        this.part(root, 0.3, 0.34, 0.29, 0, 1.89, 0, c.skin, this.sphereGeometry)
        this.part(root, 0.32, 0.2, 0.31, 0, 1.97, -0.01, c.hair, this.sphereGeometry)
        // Vành mũ chìa ra trước — bóng đổ của nó là thứ đọc ra "có đội mũ"
        this.part(root, 0.3, 0.05, 0.18, 0, 1.94, 0.16, c.vest)

        /**
         * KHẨU SÚNG cầm tay phải, chĩa về trước.
         *
         * Treo dưới `elbow` của tay phải nên nó đánh theo nhịp tay — khỏi phải
         * viết một mảnh mã riêng để đồng bộ.
         */
        const hand = this.arms[1].elbow
        this.gunMesh = this.part(hand, 0.1, 0.1, 0.56, 0, -0.4, 0.22, c.gun)
        this.part(hand, 0.08, 0.16, 0.12, 0, -0.46, 0.06, c.gun)

        root.scale.setScalar(SURVIVAL_WALKER.height / 1.95)
        this.group.add(root)
        this.root = root
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  PHÍM
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * ⚠️ Hai nhóm phím TÁCH HẲN nhau:
     *  - `'wandering'` — phím của bản mẫu, lái xe. Còn hiệu lực khi đang ngồi xe.
     *  - `'walking'`  — phím của chế độ đi bộ. Chỉ có hiệu lực sau khi đã xuống.
     *
     * `toggleRide` phải thuộc CẢ HAI, không thì xuống được mà không lên lại
     * được (hoặc ngược lại) — và người chơi kẹt vĩnh viễn ngoài xe.
     */
    setActions()
    {
        this.game.inputs.addActions([
            { name: 'survivalRide',     categories: [ 'wandering', 'walking' ], keys: [ 'Keyboard.KeyE' ] },
            { name: 'walkForward',      categories: [ 'walking' ], keys: [ 'Keyboard.KeyW', 'Keyboard.ArrowUp' ] },
            { name: 'walkBackward',     categories: [ 'walking' ], keys: [ 'Keyboard.KeyS', 'Keyboard.ArrowDown' ] },
            { name: 'walkLeft',         categories: [ 'walking' ], keys: [ 'Keyboard.KeyA', 'Keyboard.ArrowLeft' ] },
            { name: 'walkRight',        categories: [ 'walking' ], keys: [ 'Keyboard.KeyD', 'Keyboard.ArrowRight' ] },
            { name: 'walkRun',          categories: [ 'walking' ], keys: [ 'Keyboard.ShiftLeft', 'Keyboard.ShiftRight' ] },
            // Súng máy phải bắn được cả khi đi bộ — `SurvivalGun` khai action
            // này với category 'wandering', nên bổ sung bản 'walking'
            { name: 'walkFire',         categories: [ 'walking' ], keys: [ 'Keyboard.KeyF' ] },
            // Lối thoát khi lỡ đi bộ vào chỗ kẹt: về thẳng chỗ xe
            { name: 'walkRecall',       categories: [ 'walking' ], keys: [ 'Keyboard.KeyR' ] },
        ])

        this.game.inputs.events.on('survivalRide', (action) =>
        {
            if(action.active) this.toggleRide()
        })

        const bind = (name, key) => this.game.inputs.events.on(name, (action) => { this.moves[key] = action.active })
        bind('walkForward', 'forward')
        bind('walkBackward', 'backward')
        bind('walkLeft', 'left')
        bind('walkRight', 'right')
        bind('walkRun', 'run')

        this.game.inputs.events.on('walkFire', (action) =>
        {
            this.survival.gun.firing = action.active
        })

        this.game.inputs.events.on('walkRecall', (action) =>
        {
            if(action.active && this.active) this.enter(true)
        })
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  XUỐNG / LÊN XE
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Phím **E** — một phím, ba việc, theo thứ tự ưu tiên:
     *
     *  1. Trực thăng đang ĐẬU và mình đứng gần nó → leo lên trực thăng.
     *  2. Đang đi bộ → leo lên xe (nếu đủ gần).
     *  3. Đang ngồi xe → bước xuống.
     *
     * Trực thăng phải đứng TRƯỚC trong thứ tự này: gọi nó về tốn 220$, mà nó
     * hay đậu ngay cạnh xe, nên nếu xe được ưu tiên thì người chơi bấm E là leo
     * nhầm lên xe và không hiểu vì sao.
     */
    toggleRide()
    {
        if(!this.survival.enabled) return

        const heli = this.survival.heli
        if(heli.state === 'landed')
        {
            const from = this.active ? this.position : this.game.physicalVehicle.position
            const distance = Math.hypot(heli.position.x - from.x, heli.position.z - from.z)

            if(distance <= heli.enterRadiusValue)
            {
                heli.enter(from)
                return
            }
        }

        if(this.active) this.enter()
        else this.exit()
    }

    /** Bước xuống xe. */
    exit()
    {
        const vehicle = this.game.physicalVehicle

        if(vehicle.xzSpeed > SURVIVAL_WALKER.exitMaxSpeed)
        {
            this.game.notifications?.show(
                /* html */`<div class="top"><p class="title">Đang chạy nhanh quá</p></div><div class="bottom"><p class="description">Dừng lại rồi bấm E</p></div>`,
                '', 2,
            )
            return
        }

        // Bước ra BÊN TRÁI xe, không ra phía trước: ra trước thì lần lên lại
        // hay bị chính mũi xe húc
        const offset = SURVIVAL_WALKER.exitOffset
        const side = Math.atan2(vehicle.position.x, vehicle.position.z)
        let x = vehicle.position.x + Math.cos(side) * offset
        let z = vehicle.position.z - Math.sin(side) * offset

        const y = this.survival.monsters.groundHeight(x, z)
        if(y === null)
        {
            // Chỗ đó không có đất (đang trên cầu hẹp, trên boong tàu…) — thử
            // ngay dưới chân xe rồi thôi
            x = vehicle.position.x
            z = vehicle.position.z
        }

        this.position.set(x, y ?? vehicle.position.y, z)
        this.groundY = this.position.y
        this.heading = 0
        this.active = true
        this.group.visible = true

        // Phím lái bị nuốt từ đây — xem chú thích ở `setActions()`
        this.game.inputs.filters.clear()
        this.game.inputs.filters.add('walking')

        this.survival.events.trigger('rideChange')
        this.game.notifications?.show(
            /* html */`<div class="top"><p class="title">Đã xuống xe</p></div><div class="bottom"><p class="description">W A S D đi · Shift chạy · F bắn · <strong>E</strong> lên lại · R về chỗ xe</p></div>`,
            'is-achievement', 5,
        )
    }

    /**
     * Leo lên xe. `force = true` là lối thoát khẩn (phím R) — bỏ qua kiểm tra
     * khoảng cách, để người chơi không kẹt vĩnh viễn ở một chỗ không về được.
     */
    enter(force = false)
    {
        const vehicle = this.game.physicalVehicle
        const distance = Math.hypot(
            this.position.x - vehicle.position.x,
            this.position.z - vehicle.position.z,
        )

        if(!force && distance > SURVIVAL_WALKER.enterRadius)
        {
            this.game.notifications?.show(
                /* html */`<div class="top"><p class="title">Xe ở xa quá</p></div><div class="bottom"><p class="description">Lại gần rồi bấm E — hoặc bấm R để về thẳng chỗ xe</p></div>`,
                '', 2.5,
            )
            return
        }

        this.active = false
        this.group.visible = false
        this.survival.gun.firing = false

        this.game.inputs.filters.clear()
        this.game.inputs.filters.add('wandering')

        this.survival.events.trigger('rideChange')
    }

    /** Tắt chế độ Sinh tồn giữa chừng — phải trả phím lái về, không thì kẹt. */
    reset()
    {
        if(!this.active) return

        this.active = false
        this.group.visible = false
        this.game.inputs.filters.clear()
        this.game.inputs.filters.add('wandering')
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  MỖI KHUNG HÌNH
    // ═══════════════════════════════════════════════════════════════════════

    update()
    {
        if(!this.active || !this.survival.enabled) return

        const delta = Math.min(this.game.ticker.delta, 0.1)

        this.move(delta)
        this.animate(delta)

        // Máy quay bám người — xem chú thích "nhịp 6.5" ở hàm dựng
        this.game.view.focusPoint.trackedPosition.set(this.position.x, 0, this.position.z)
    }

    /**
     * Đi theo hướng MÁY QUAY, không theo hướng thân người.
     *
     * Bấm W là đi "lên phía trên màn hình" — đó là thứ tay người chơi mong đợi ở
     * một máy quay nhìn từ trên xuống. Đi theo hướng thân thì mỗi lần quay người
     * là cả bộ phím đảo nghĩa, và không ai lái nổi.
     */
    move(delta)
    {
        const camera = this.game.view.camera
        camera.getWorldDirection(this.forwardVector ??= new THREE.Vector3())

        const fx = this.forwardVector.x
        const fz = this.forwardVector.z
        const length = Math.hypot(fx, fz) || 1

        const forwardX = fx / length
        const forwardZ = fz / length
        const rightX = -forwardZ
        const rightZ = forwardX

        let moveX = 0
        let moveZ = 0
        if(this.moves.forward) { moveX += forwardX; moveZ += forwardZ }
        if(this.moves.backward) { moveX -= forwardX; moveZ -= forwardZ }
        if(this.moves.right) { moveX += rightX; moveZ += rightZ }
        if(this.moves.left) { moveX -= rightX; moveZ -= rightZ }

        const magnitude = Math.hypot(moveX, moveZ)

        if(magnitude < 0.001)
        {
            this.speed = 0
            this.phase += delta * 2
            return
        }

        moveX /= magnitude
        moveZ /= magnitude

        this.speed = this.moves.run ? SURVIVAL_WALKER.runSpeed : SURVIVAL_WALKER.walkSpeed

        const step = this.speed * delta
        const nextX = this.position.x + moveX * step
        const nextZ = this.position.z + moveZ * step

        /**
         * ⚠️ KIỂM ĐỘ DỐC TRƯỚC KHI BƯỚC.
         *
         * Không có phép kiểm này thì người đi bộ trèo thẳng lên vách núi và
         * tường nhà — bắn tia xuống lúc nào cũng tìm được mặt đất ở đó, dù nó
         * cao hơn đầu. Chênh cao độ chia cho quãng vừa đi chính là độ dốc.
         */
        const nextGround = this.survival.monsters.groundHeight(nextX, nextZ)
        if(nextGround === null) return

        const slope = (nextGround - this.groundY) / Math.max(step, 0.001)
        if(slope > SURVIVAL_WALKER.maxSlope) return

        this.position.x = nextX
        this.position.z = nextZ
        this.groundY = nextGround
        this.position.y = nextGround

        this.phase += delta * this.speed * 2.6

        // Xoay thân về hướng đi, mềm chứ không giật
        const wanted = Math.atan2(moveX, moveZ)
        let diff = wanted - this.heading
        while(diff > Math.PI) diff -= Math.PI * 2
        while(diff < -Math.PI) diff += Math.PI * 2
        this.heading += diff * Math.min(1, delta * 12)
    }

    /** Nhịp đi: tay và chân đánh ngược pha, thân nhún theo bước. */
    animate(delta)
    {
        this.group.position.set(this.position.x, this.groundY, this.position.z)
        this.group.rotation.y = this.heading

        const moving = this.speed > 0.01
        const swing = moving ? Math.sin(this.phase) : Math.sin(this.phase) * 0.12
        const swingB = moving ? Math.sin(this.phase + Math.PI) : Math.sin(this.phase + Math.PI) * 0.12
        const amount = moving ? (this.speed / SURVIVAL_WALKER.runSpeed) : 0.25

        this.legs[0].hip.rotation.x = swing * 0.66 * amount
        this.legs[1].hip.rotation.x = swingB * 0.66 * amount
        this.legs[0].knee.rotation.x = Math.max(0, -swing) * 0.9 * amount
        this.legs[1].knee.rotation.x = Math.max(0, -swingB) * 0.9 * amount

        // Tay TRÁI đánh theo bước; tay PHẢI giữ súng chĩa về trước, chỉ nhún nhẹ
        this.arms[0].shoulder.rotation.x = swingB * 0.5 * amount
        this.arms[0].elbow.rotation.x = -0.3 - Math.max(0, swingB) * 0.35 * amount
        this.arms[1].shoulder.rotation.x = -0.95 + swing * 0.08 * amount
        this.arms[1].elbow.rotation.x = -0.25

        this.group.position.y = this.groundY + (moving ? Math.abs(Math.sin(this.phase)) * 0.04 : 0)
    }
}
