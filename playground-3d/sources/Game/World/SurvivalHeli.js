import * as THREE from 'three/webgpu'
import { color } from 'three/tsl'
import { Game } from '../Game.js'
import { MeshDefaultMaterial } from '../Materials/MeshDefaultMaterial.js'
import { SURVIVAL_HELI } from '../../data/survival.js'

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  TRỰC THĂNG — mảnh cuối của kế hoạch Sinh tồn
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Mua **"Gọi trực thăng"** trong cửa hàng → nó bay từ ngoài bản đồ tới, hạ
 * xuống cạnh người chơi. Bấm **E** để lên. Bay bằng **W A S D**, **Space** lên,
 * **Shift** xuống, **F** bắn xuống. Hết dầu thì tự hạ cánh và bay đi.
 *
 * ─── BỐN TRẠNG THÁI ─────────────────────────────────────────────────────────
 *  `idle`     — chưa gọi, không tồn tại trong cảnh
 *  `arriving` — đang bay từ xa tới, không leo lên được
 *  `landed`   — đậu, chờ người chơi bấm E
 *  `flying`   — người chơi đang lái, nhiên liệu đếm ngược
 *
 * ─── VÌ SAO BAY KINEMATIC ───────────────────────────────────────────────────
 * Cái người chơi muốn không phải "lái trực thăng cho đúng" mà là "bay lên khỏi
 * tầm với của lũ quái rồi nã xuống". Nên nó đi theo hướng máy quay đúng như
 * người đi bộ, cộng một trục lên-xuống, cộng phép bám địa hình. Nghiêng thân
 * theo hướng bay là đủ để mắt tin — không cần một hệ vật lý thứ hai.
 */
export class SurvivalHeli
{
    constructor(survival)
    {
        this.game = Game.getInstance()
        this.survival = survival

        /** `idle` · `arriving` · `landed` · `flying` */
        this.state = 'idle'
        this.position = new THREE.Vector3()
        this.heading = 0
        this.height = SURVIVAL_HELI.hoverHeight
        this.groundY = 0
        this.fuel = 0
        this.calls = 0
        this.arriveAge = 0
        this.tilt = 0
        this.roll = 0

        this.moves = { forward: false, backward: false, left: false, right: false, up: false, down: false }

        this.materials = new Map()
        this.boxGeometry = new THREE.BoxGeometry(1, 1, 1)
        this.cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 8)
        this.sphereGeometry = new THREE.SphereGeometry(0.5, 8, 6)

        this.group = new THREE.Group()
        this.group.name = 'survivalHeli'
        this.group.visible = false
        this.game.scene.add(this.group)

        this.build()
        this.setActions()
        this.setSounds()

        // Nhịp 6.5 — cùng khe với người đi bộ, xem `SurvivalWalker`
        this.game.ticker.events.on('tick', () => this.update(), 6.5)
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  DỰNG HÌNH
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

    glowMaterial(hex)
    {
        const key = `glow-${hex}`
        let m = this.materials.get(key)
        if(!m)
        {
            m = new THREE.MeshBasicNodeMaterial()
            m.colorNode = color(hex)
            m.toneMapped = false
            this.materials.set(key, m)
        }
        return m
    }

    part(parent, w, h, d, x, y, z, hex, geometry = null, rotation = null)
    {
        const material = typeof hex === 'string' ? this.material(hex) : hex
        const mesh = new THREE.Mesh(geometry ?? this.boxGeometry, material)
        mesh.scale.set(w, h, d)
        mesh.position.set(x, y, z)
        if(rotation) mesh.rotation.set(rotation.x ?? 0, rotation.y ?? 0, rotation.z ?? 0)
        mesh.castShadow = true
        mesh.receiveShadow = true
        parent.add(mesh)
        return mesh
    }

    /**
     * Thân + đuôi + hai cánh quạt + càng đáp.
     *
     * Mũi chĩa về **+Z**, cùng quy ước với đàn quái và người đi bộ (`heading` là
     * góc quanh Y, 0 = nhìn về +Z). Lệch quy ước ở đây là mỗi lần bay tới thì
     * thân quay ngang.
     */
    build()
    {
        const c = SURVIVAL_HELI.colors
        const root = new THREE.Group()

        // ── Thân: khoang lái phình trước, thuôn về sau ──────────────────────
        this.part(root, 1.9, 1.5, 3.4, 0, 0, 0, c.body)
        this.part(root, 1.7, 1.2, 1.5, 0, 0.1, 1.3, c.cabin, this.sphereGeometry)
        // Kính buồng lái — dùng vật liệu phát sáng để ban đêm còn đọc ra đầu xe
        this.part(root, 1.3, 0.85, 0.7, 0, 0.15, 2.05, this.glowMaterial(c.glass), this.sphereGeometry)
        // Vạch sơn dọc thân
        this.part(root, 1.94, 0.16, 2.6, 0, 0.15, -0.2, c.stripe)

        // ── Đuôi: dầm dài + cánh đuôi đứng ──────────────────────────────────
        this.part(root, 0.5, 0.42, 3.2, 0, 0.25, -3.1, c.body)
        this.part(root, 0.18, 1.15, 0.8, 0, 0.75, -4.4, c.body)
        this.part(root, 1.0, 0.14, 0.5, 0, 0.35, -4.1, c.body)

        // ── Cánh quạt chính: trục + hai lá ──────────────────────────────────
        this.part(root, 0.28, 0.5, 0.28, 0, 0.95, 0.2, c.skid, this.cylinderGeometry)
        this.mainRotor = new THREE.Group()
        this.mainRotor.position.set(0, 1.22, 0.2)
        root.add(this.mainRotor)
        for(const angle of [ 0, Math.PI * 0.5 ])
        {
            const blade = new THREE.Group()
            blade.rotation.y = angle
            this.mainRotor.add(blade)
            this.part(blade, 0.34, 0.05, 8.4, 0, 0, 0, c.rotor)
        }

        // ── Cánh quạt đuôi ──────────────────────────────────────────────────
        this.tailRotor = new THREE.Group()
        this.tailRotor.position.set(0.3, 0.75, -4.4)
        root.add(this.tailRotor)
        for(const angle of [ 0, Math.PI * 0.5 ])
        {
            const blade = new THREE.Group()
            blade.rotation.x = angle
            this.tailRotor.add(blade)
            this.part(blade, 0.05, 1.8, 0.16, 0, 0, 0, c.rotor)
        }

        // ── Càng đáp ────────────────────────────────────────────────────────
        for(const side of [ -1, 1 ])
        {
            this.part(root, 0.16, 0.16, 3.0, side * 0.85, -1.05, 0.1, c.skid)
            this.part(root, 0.14, 0.62, 0.14, side * 0.75, -0.75, 1.1, c.skid, null, { z: side * 0.25 })
            this.part(root, 0.14, 0.62, 0.14, side * 0.75, -0.75, -0.9, c.skid, null, { z: side * 0.25 })
        }

        // ── Đèn báo dưới bụng và trên đuôi ──────────────────────────────────
        this.lights = [
            this.part(root, 0.22, 0.22, 0.22, 0, -0.78, 1.4, this.glowMaterial(c.light), this.sphereGeometry),
            this.part(root, 0.2, 0.2, 0.2, 0, 1.45, -4.4, this.glowMaterial(c.light), this.sphereGeometry),
        ]

        this.group.add(root)
        this.root = root
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  PHÍM
    // ═══════════════════════════════════════════════════════════════════════

    setActions()
    {
        this.game.inputs.addActions([
            { name: 'heliForward',  categories: [ 'heli' ], keys: [ 'Keyboard.KeyW', 'Keyboard.ArrowUp' ] },
            { name: 'heliBackward', categories: [ 'heli' ], keys: [ 'Keyboard.KeyS', 'Keyboard.ArrowDown' ] },
            { name: 'heliLeft',     categories: [ 'heli' ], keys: [ 'Keyboard.KeyA', 'Keyboard.ArrowLeft' ] },
            { name: 'heliRight',    categories: [ 'heli' ], keys: [ 'Keyboard.KeyD', 'Keyboard.ArrowRight' ] },
            { name: 'heliUp',       categories: [ 'heli' ], keys: [ 'Keyboard.Space' ] },
            { name: 'heliDown',     categories: [ 'heli' ], keys: [ 'Keyboard.ShiftLeft', 'Keyboard.ShiftRight' ] },
            { name: 'heliFire',     categories: [ 'heli' ], keys: [ 'Keyboard.KeyF' ] },
            // `survivalRide` (phím E) đã khai ở `SurvivalWalker` với hai category
            // 'wandering' và 'walking'; thêm bản 'heli' để còn xuống được
            { name: 'heliRide',     categories: [ 'heli' ], keys: [ 'Keyboard.KeyE' ] },
        ])

        const bind = (name, key) => this.game.inputs.events.on(name, (action) => { this.moves[key] = action.active })
        bind('heliForward', 'forward')
        bind('heliBackward', 'backward')
        bind('heliLeft', 'left')
        bind('heliRight', 'right')
        bind('heliUp', 'up')
        bind('heliDown', 'down')

        this.game.inputs.events.on('heliFire', (action) =>
        {
            this.survival.gun.firing = action.active
        })

        this.game.inputs.events.on('heliRide', (action) =>
        {
            if(action.active && this.state === 'flying') this.land()
        })
    }

    /**
     * Tiếng cánh quạt — LẶP và BÁM THEO TOẠ ĐỘ trực thăng.
     *
     * ⚠️ `distanceFade` để rất xa (90): người chơi phải nghe nó từ lúc nó còn
     * là một chấm ở chân trời, đó là nửa cái hay của việc gọi trực thăng về.
     *
     * ⚠️ Tiếng lặp phải tắt bằng `item.howl.stop()` — `item` của `Audio` không
     * có `stop()`, gọi `item.stop()` là im lặng không báo lỗi và cánh quạt kêu
     * mãi tới hết phiên. Cùng bẫy đã gặp với gió đêm và nhịp tim.
     */
    setSounds()
    {
        this.sounds = {}

        this.sounds.rotor = this.game.audio.register({
            path: 'sounds/survival/heli-loop.mp3',
            autoplay: false, loop: true, volume: 0.4, antiSpam: 0,
            positions: new THREE.Vector3(), distanceFade: 90,
            onPlay: (item, coordinates) => { if(coordinates) item.positions[0].copy(coordinates); item.volume = 1 },
        })

        const once = (path, volume, fade) => this.game.audio.register({
            path, autoplay: false, loop: false, volume, antiSpam: 1,
            positions: new THREE.Vector3(), distanceFade: fade,
            onPlay: (item, coordinates) => { if(coordinates) item.positions[0].copy(coordinates); item.volume = 1 },
        })

        this.sounds.arrive = once('sounds/survival/heli-arrive.mp3', 0.5, 110)
        this.sounds.land = once('sounds/survival/heli-land.mp3', 0.45, 70)
    }

    /** Bật/tắt tiếng cánh quạt — xem chú thích ở `setSounds()`. */
    setRotorSound(on)
    {
        const item = this.sounds?.rotor
        if(!item?.howl) return
        if(on === !!item.__on) return

        item.__on = on
        if(on) item.play(this.position)
        else item.howl.stop()
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  GỌI / LÊN / XUỐNG
    // ═══════════════════════════════════════════════════════════════════════

    /** Giá gọi HIỆN TẠI — mỗi lần gọi lại đắt thêm. */
    get price()
    {
        return Math.round(SURVIVAL_HELI.price * Math.pow(SURVIVAL_HELI.priceStep, this.calls))
    }

    get available()
    {
        return this.state === 'idle'
    }

    /** Phơi ra cho `SurvivalWalker.toggleRide()` khỏi phải import bảng số. */
    get enterRadiusValue()
    {
        return SURVIVAL_HELI.enterRadius
    }

    /**
     * Gọi trực thăng tới. Nó xuất hiện ở rìa tầm nhìn rồi bay vào — không "hiện
     * ra" ngay cạnh người chơi, vì một cỗ máy nặng bốn tấn nhảy ra từ hư không
     * thì hỏng hết cảm giác đã bỏ tiền gọi nó.
     */
    call(target)
    {
        if(this.state !== 'idle') return false

        const angle = Math.random() * Math.PI * 2
        this.arriveFrom = {
            x: target.x + Math.cos(angle) * SURVIVAL_HELI.arriveDistance,
            z: target.z + Math.sin(angle) * SURVIVAL_HELI.arriveDistance,
        }
        this.arriveTo = { x: target.x, z: target.z }

        this.position.set(this.arriveFrom.x, 0, this.arriveFrom.z)
        this.height = SURVIVAL_HELI.maxHeight
        this.groundY = this.survival.monsters.groundHeight(this.position.x, this.position.z) ?? 0
        this.arriveAge = 0
        this.fuel = SURVIVAL_HELI.fuel
        this.calls++

        this.state = 'arriving'
        this.group.visible = true
        this.sounds.arrive?.play(this.position)
        this.setRotorSound(true)

        this.game.notifications?.show(
            /* html */`<div class="top"><p class="title">Trực thăng đang tới</p></div><div class="bottom"><p class="description">Đợi nó hạ xuống rồi bấm <strong>E</strong> để lên</p></div>`,
            'is-achievement', 4,
        )

        return true
    }

    /** Người chơi leo lên. Trả `false` nếu đứng xa quá hoặc nó chưa đậu. */
    enter(from)
    {
        if(this.state !== 'landed') return false

        const distance = Math.hypot(this.position.x - from.x, this.position.z - from.z)
        if(distance > SURVIVAL_HELI.enterRadius)
        {
            this.game.notifications?.show(
                /* html */`<div class="top"><p class="title">Trực thăng ở xa quá</p></div><div class="bottom"><p class="description">Lại gần rồi bấm E</p></div>`,
                '', 2,
            )
            return false
        }

        this.state = 'flying'
        this.height = Math.max(SURVIVAL_HELI.minHeight, SURVIVAL_HELI.hoverHeight)

        // Người đi bộ (nếu đang đứng ngoài) biến mất — họ đã ở trong khoang
        this.survival.walker.group.visible = false

        this.game.inputs.filters.clear()
        this.game.inputs.filters.add('heli')

        this.survival.events.trigger('rideChange')
        this.game.notifications?.show(
            /* html */`<div class="top"><p class="title">Đã lên trực thăng</p></div><div class="bottom"><p class="description">W A S D bay · <strong>Space</strong> lên · <strong>Shift</strong> xuống · F bắn · E hạ cánh</p></div>`,
            'is-achievement', 5,
        )
        return true
    }

    /**
     * Hạ cánh và trả người chơi về mặt đất.
     *
     * ⚠️ Trả `inputs.filters` về đúng trạng thái TRƯỚC ĐÓ: nếu người chơi lên
     * trực thăng từ lúc đang đi bộ thì phải về `'walking'`, còn từ trên xe thì
     * về `'wandering'`. Trả nhầm là kẹt phím — cùng loại bẫy đã gặp với walker.
     */
    land()
    {
        if(this.state !== 'flying') return

        this.sounds.land?.play(this.position)
        this.setRotorSound(false)

        this.state = 'idle'
        this.group.visible = false
        this.survival.gun.firing = false

        const walker = this.survival.walker
        if(walker.active)
        {
            // Thả người xuống ngay dưới bụng trực thăng
            const y = this.survival.monsters.groundHeight(this.position.x, this.position.z)
            walker.position.set(this.position.x, y ?? this.groundY, this.position.z)
            walker.groundY = walker.position.y
            walker.group.visible = true
        }

        this.game.inputs.filters.clear()
        this.game.inputs.filters.add(walker.active ? 'walking' : 'wandering')

        this.survival.events.trigger('rideChange')
    }

    /** Tắt chế độ giữa chừng — phải trả phím về, không thì kẹt vĩnh viễn. */
    reset()
    {
        const wasFlying = this.state === 'flying'

        this.setRotorSound(false)

        this.state = 'idle'
        this.group.visible = false
        this.fuel = 0
        this.calls = 0

        if(wasFlying)
        {
            this.game.inputs.filters.clear()
            this.game.inputs.filters.add('wandering')
        }
    }

    get active()
    {
        return this.state === 'flying'
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  MỖI KHUNG HÌNH
    // ═══════════════════════════════════════════════════════════════════════

    update()
    {
        if(this.state === 'idle' || !this.survival.enabled) return

        const delta = Math.min(this.game.ticker.delta, 0.1)

        // Tiếng cánh quạt bám theo trực thăng
        if(this.sounds?.rotor?.__on && this.sounds.rotor.positions)
            this.sounds.rotor.positions[0].copy(this.position)

        // Cánh quạt quay bất kể trạng thái nào — đứng đậu vẫn nổ máy
        this.mainRotor.rotation.y += SURVIVAL_HELI.rotorSpeed * delta
        this.tailRotor.rotation.x += SURVIVAL_HELI.rotorSpeed * 1.6 * delta

        // Đèn báo nhấp nháy
        const blink = Math.sin(this.game.ticker.elapsed * 6) > 0
        for(const light of this.lights) light.visible = blink

        if(this.state === 'arriving') this.updateArriving(delta)
        else if(this.state === 'flying') this.updateFlying(delta)

        this.updateGround()
        this.applyTransform(delta)

        if(this.state === 'flying')
            this.game.view.focusPoint.trackedPosition.set(this.position.x, 0, this.position.z)
    }

    /** Bay từ xa vào rồi hạ xuống chỗ đã hẹn. */
    updateArriving(delta)
    {
        this.arriveAge += delta
        const t = Math.min(1, this.arriveAge / SURVIVAL_HELI.arriveDuration)
        const eased = t * t * (3 - 2 * t)

        this.position.x = this.arriveFrom.x + (this.arriveTo.x - this.arriveFrom.x) * eased
        this.position.z = this.arriveFrom.z + (this.arriveTo.z - this.arriveFrom.z) * eased

        // Hạ dần từ trần xuống sát đất
        this.height = SURVIVAL_HELI.maxHeight + (1.4 - SURVIVAL_HELI.maxHeight) * eased

        // Mũi hướng về chỗ đến
        const dx = this.arriveTo.x - this.position.x
        const dz = this.arriveTo.z - this.position.z
        if(Math.hypot(dx, dz) > 0.5)
            this.heading = Math.atan2(dx, dz)

        // Chúi mũi khi bay tới, ngẩng lên khi phanh lại
        this.tilt = (t < 0.7 ? -SURVIVAL_HELI.tiltMax : SURVIVAL_HELI.tiltMax * 0.6) * (1 - t * 0.4)

        if(t >= 1)
        {
            this.state = 'landed'
            this.tilt = 0
            this.game.notifications?.show(
                /* html */`<div class="top"><p class="title">Trực thăng đã đậu</p></div><div class="bottom"><p class="description">Bấm <strong>E</strong> khi đứng cạnh nó</p></div>`,
                'is-achievement', 4,
            )
        }
    }

    updateFlying(delta)
    {
        // ── Nhiên liệu ───────────────────────────────────────────────────────
        this.fuel -= delta
        if(this.fuel <= 0)
        {
            this.fuel = 0
            this.game.notifications?.show(
                /* html */`<div class="top"><p class="title">Hết dầu</p></div><div class="bottom"><p class="description">Trực thăng đang hạ xuống</p></div>`,
                '', 3,
            )
            this.land()
            return
        }

        // ── Hướng đi theo MÁY QUAY, đúng như người đi bộ ─────────────────────
        const camera = this.game.view.camera
        camera.getWorldDirection(this.forwardVector ??= new THREE.Vector3())

        const length = Math.hypot(this.forwardVector.x, this.forwardVector.z) || 1
        const forwardX = this.forwardVector.x / length
        const forwardZ = this.forwardVector.z / length
        const rightX = -forwardZ
        const rightZ = forwardX

        let moveX = 0
        let moveZ = 0
        if(this.moves.forward) { moveX += forwardX; moveZ += forwardZ }
        if(this.moves.backward) { moveX -= forwardX; moveZ -= forwardZ }
        if(this.moves.right) { moveX += rightX; moveZ += rightZ }
        if(this.moves.left) { moveX -= rightX; moveZ -= rightZ }

        const magnitude = Math.hypot(moveX, moveZ)

        if(magnitude > 0.001)
        {
            moveX /= magnitude
            moveZ /= magnitude

            this.position.x += moveX * SURVIVAL_HELI.speed * delta
            this.position.z += moveZ * SURVIVAL_HELI.speed * delta

            const wanted = Math.atan2(moveX, moveZ)
            let diff = wanted - this.heading
            while(diff > Math.PI) diff -= Math.PI * 2
            while(diff < -Math.PI) diff += Math.PI * 2
            this.heading += diff * Math.min(1, delta * 4)

            // Chúi mũi về hướng bay — thứ duy nhất làm nó ra dáng trực thăng
            this.tilt += (-SURVIVAL_HELI.tiltMax - this.tilt) * Math.min(1, delta * 4)
            // Nghiêng cánh khi rẽ
            this.roll += (Math.max(-1, Math.min(1, diff * 2)) * SURVIVAL_HELI.tiltMax - this.roll) * Math.min(1, delta * 4)
        }
        else
        {
            this.tilt += (0 - this.tilt) * Math.min(1, delta * 4)
            this.roll += (0 - this.roll) * Math.min(1, delta * 4)
        }

        // ── Lên / xuống ──────────────────────────────────────────────────────
        if(this.moves.up) this.height += SURVIVAL_HELI.liftSpeed * delta
        if(this.moves.down) this.height -= SURVIVAL_HELI.liftSpeed * delta
        this.height = Math.max(SURVIVAL_HELI.minHeight, Math.min(SURVIVAL_HELI.maxHeight, this.height))
    }

    /**
     * Bám địa hình.
     *
     * ⚠️ Độ cao tính THEO MẶT ĐẤT BÊN DƯỚI, không phải theo mực nước biển. Bay
     * qua sườn núi cao 20 mà giữ nguyên cao độ tuyệt đối là đâm thẳng vào nó —
     * và ở đây không có vật lý nào chặn lại, trực thăng sẽ chui qua lòng núi.
     */
    updateGround()
    {
        const ground = this.survival.monsters.groundHeight(this.position.x, this.position.z)
        if(ground !== null)
            this.groundY += (ground - this.groundY) * 0.35

        this.position.y = this.groundY + this.height
    }

    applyTransform(delta)
    {
        this.group.position.copy(this.position)
        this.group.rotation.y = this.heading
        this.group.rotation.x = this.tilt
        this.group.rotation.z = this.roll

        // Rung nhẹ khi treo — trực thăng đứng im tuyệt đối trông như đồ nhựa
        this.group.position.y += Math.sin(this.game.ticker.elapsed * 9) * 0.06
    }
}
