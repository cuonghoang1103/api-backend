import * as THREE from 'three/webgpu'
import { color, texture as textureNode } from 'three/tsl'
import { Game } from '../Game.js'
import { MeshDefaultMaterial } from '../Materials/MeshDefaultMaterial.js'
import { Events } from '../Events.js'

/**
 * KHẨU PHÁO TÊN LỬA trên nóc xe.
 *
 * Bật/tắt ở mục "Rocket" trong bảng Cài đặt. Bật thì khẩu pháo mọc lên nóc xe,
 * nòng tự xoay theo con trỏ chuột; bấm Enter là bắn một quả tên lửa bay theo
 * đường vòng cung tới đúng điểm đang trỏ rồi nổ.
 *
 * ─── DÙNG LẠI CỦA BẢN MẪU, KHÔNG TỰ CHẾ ───
 * Vụ nổ không phải hiệu ứng tự vẽ mà là ĐÚNG bộ máy nổ của thế giới gốc:
 *  - `game.world.fireballs.create()` — quả cầu lửa có nhiễu chuyển động
 *  - `game.explosions.explode()` — sức nổ VẬT LÝ thật, thổi bay thùng gỗ, gạch,
 *    lá cây, và hất cả chiếc xe nếu đứng gần
 *  - `sounds/explosions/…` — đúng hai tiếng nổ của thùng thuốc nổ
 * Nhờ vậy bắn vào đống gạch là gạch bay tung, bắn cạnh xe là xe nảy lên.
 *
 * ⚠️ Bốn cái bẫy đã biết trước và né sẵn:
 *  - Máy quay nhìn từ trên xuống, khung hình gần như KHÔNG CÓ TRỜI ⇒ đường bay
 *    phải VÒNG THẤP, vọt cao là tên lửa bay ra ngoài khung, người chơi mất dấu.
 *  - Cộng sáng trên nền đất cam đẩy màu về trắng ⇒ vệt lửa dùng pha trộn thường.
 *  - Chỉ có MỘT nguồn sáng trong cả thế giới ⇒ ánh lửa phải là vật liệu tự phát
 *    sáng (`emissiveOrangeRadialGradient`), thả `PointLight` vào là vô nghĩa.
 *  - Game nghe `keydown` trên `window` pha nổi ⇒ đăng ký phím qua đúng hệ
 *    `inputs.actions` như mọi nút khác, đừng tự nghe sự kiện.
 *
 * ⚠️ PHÍM BẮN LÀ **X**, và Enter là phím phụ.
 * Enter đã được gán sẵn cho action `interact` (mở khu, bấm nút trong thế giới),
 * nên đứng cạnh một điểm tương tác mà bấm Enter thì vừa mở hộp thoại vừa bắn.
 * X không trùng với bất cứ phím nào đang dùng (W/A/S/D lái, Shift tăng tốc,
 * B/Ctrl phanh, Space giảm xóc, R hồi sinh, H còi, E/F/Enter tương tác, T thì
 * thầm, L tắt tiếng, J/K trò chơi ở khu Social).
 */

const TRAIL_COUNT = 14        // số đốt khói để lại phía sau
const FLIGHT_SPEED = 46       // đơn vị mỗi giây
/**
 * Chiều cao vòng cung, tính theo quãng đường bay.
 *
 * User muốn tên lửa "bay lên trời", nhưng máy quay ở đây chúc thẳng xuống và
 * khung hình gần như KHÔNG CÓ TRỜI — bay cao quá là ra ngoài khung, người chơi
 * mất dấu quả đạn. 0,22 (trần 12 đơn vị) là mức cao nhất còn nhìn thấy trọn
 * đường bay ở tầm bắn thường.
 */
const ARC_HEIGHT = 0.22

export class VehicleRocket
{
    constructor()
    {
        this.game = Game.getInstance()
        this.events = new Events()

        this.enabled = false
        this.rockets = []
        this.blasts = []
        this.aim = new THREE.Vector3()
        this.hasAim = false

        this.raycaster = new THREE.Raycaster()
        this.groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
        this.ndc = new THREE.Vector2()

        this.materials = new Map()
        this.boxGeometry = new THREE.BoxGeometry(1, 1, 1)
        this.cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 10)
        this.coneGeometry = new THREE.ConeGeometry(0.5, 1, 10)
        this.sphereGeometry = new THREE.SphereGeometry(0.5, 10, 8)

        this.setPreference()
        this.setCannon()
        this.setMarker()
        this.setSounds()
        this.setAction()
        this.setSettingsButtons()
        this.apply()

        this.game.ticker.events.on('tick', () => this.update(), 11)
    }

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

    /**
     * Vân LOANG TRÒN vẽ trên canvas — đậm ở tâm, tan dần ra mép.
     *
     * Đây là thứ làm khói và sóng nổ trông mềm. Dùng quả cầu đặc thì ra đúng
     * "hình vuông hình tròn cứng" mà user chê; một tấm phẳng dán vân loang,
     * lấy kênh alpha làm độ đục, thì mép tan hẳn vào không khí.
     *
     * ⚠️ Pha trộn THƯỜNG, không cộng sáng: nền đất ở đây màu cam, cộng sáng là
     * đẩy hết về trắng bệch (bài học cũ của cầu vồng và vệt đèn).
     */
    puffMaterial(r, g, b, alpha)
    {
        const key = `puff-${r}-${g}-${b}-${alpha}`
        let material = this.materials.get(key)
        if(material) return material

        const size = 128
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size

        const ctx = canvas.getContext('2d')
        const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
        grad.addColorStop(0.0, `rgba(${r}, ${g}, ${b}, ${alpha})`)
        grad.addColorStop(0.45, `rgba(${r}, ${g}, ${b}, ${alpha * 0.55})`)
        grad.addColorStop(1.0, `rgba(${r}, ${g}, ${b}, 0)`)
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, size, size)

        const map = new THREE.CanvasTexture(canvas)
        map.colorSpace = THREE.SRGBColorSpace

        const node = textureNode(map)
        material = new THREE.MeshBasicNodeMaterial()
        material.colorNode = node.rgb
        material.opacityNode = node.a
        material.transparent = true
        material.depthWrite = false
        material.toneMapped = false

        this.materials.set(key, material)
        return material
    }

    /** Một tấm khói nằm ngang — máy quay nhìn từ trên xuống nên thế là đủ. */
    makePuff(material)
    {
        if(!this.puffGeometry)
        {
            this.puffGeometry = new THREE.PlaneGeometry(1, 1)
            this.puffGeometry.rotateX(-Math.PI * 0.5)
        }

        const mesh = new THREE.Mesh(this.puffGeometry, material)
        mesh.visible = false
        mesh.castShadow = false
        mesh.receiveShadow = false
        mesh.renderOrder = 5
        this.game.scene.add(mesh)
        return mesh
    }

    /** Vật liệu tự phát sáng của bản mẫu — dùng cho lửa và đầu đạn. */
    get emissive()
    {
        return this.game.materials.getFromName('emissiveOrangeRadialGradient')
    }

    part(parent, geometry, w, h, d, x, y, z, hex, rotation = null)
    {
        const mesh = new THREE.Mesh(geometry, typeof hex === 'string' ? this.material(hex) : hex)
        mesh.scale.set(w, h, d)
        mesh.position.set(x, y, z)
        if(rotation) mesh.rotation.set(rotation.x ?? 0, rotation.y ?? 0, rotation.z ?? 0)
        mesh.castShadow = true
        mesh.receiveShadow = true
        parent.add(mesh)
        return mesh
    }

    /**
     * Lựa chọn Bật/Tắt, nhớ qua `localStorage` — cùng khuôn với các mục khác
     * trong bảng Cài đặt (Time, Headlights, Weather).
     */
    setPreference()
    {
        this.preference = {}
        this.preference.names = [ 'off', 'on' ]
        this.preference.labels = { off: 'Off', on: 'On' }
        this.preference.current = localStorage.getItem('rocketPreference') === 'on' ? 'on' : 'off'

        this.preference.set = (name) =>
        {
            if(!this.preference.names.includes(name)) return
            this.preference.current = name
            localStorage.setItem('rocketPreference', name)
            this.apply()
            this.events?.trigger('preferenceChange')
        }

        this.preference.next = () =>
            this.preference.set(this.preference.current === 'on' ? 'off' : 'on')
    }

    /**
     * Khẩu pháo: bệ xoay + hai nòng + thùng đạn, gắn thẳng vào thân xe nên nó
     * nghiêng ngả theo xe y như thật.
     */
    setCannon()
    {
        const chassis = this.game.world.visualVehicle?.parts?.chassis
        if(!chassis) return

        this.cannon = new THREE.Group()
        this.cannon.position.set(-0.05, 1.0, 0)
        this.cannon.visible = false
        chassis.add(this.cannon)

        const cyl = this.cylinderGeometry
        const steel = '#4d535c'
        const dark = '#2a2d33'
        const trim = '#e0a52c'

        // ── Bệ xoay: đĩa tròn + vành răng + bu lông, không phải hộp kê ──────
        this.part(this.cannon, cyl, 0.7, 0.08, 0.7, 0, 0.04, 0, dark)
        this.part(this.cannon, cyl, 0.58, 0.07, 0.58, 0, 0.11, 0, steel)
        for(let i = 0; i < 8; i++)
        {
            const a = (i / 8) * Math.PI * 2
            this.part(this.cannon, cyl, 0.06, 0.03, 0.06, Math.cos(a) * 0.29, 0.15, Math.sin(a) * 0.29, trim)
        }

        this.turret = new THREE.Group()
        this.turret.position.y = 0.15
        this.cannon.add(this.turret)

        // ── Thân tháp: khối chính + hai má vát nghiêng cho hết vuông ────────
        this.part(this.turret, this.boxGeometry, 0.42, 0.2, 0.44, -0.02, 0.11, 0, steel)
        for(const side of [ -1, 1 ])
            this.part(this.turret, this.boxGeometry, 0.4, 0.16, 0.14, -0.02, 0.09, side * 0.24, dark, { x: side * 0.5 })
        this.part(this.turret, this.boxGeometry, 0.16, 0.16, 0.34, -0.24, 0.16, 0, dark, { z: 0.35 })

        // Vạch cảnh báo vàng-đen quanh thân tháp
        for(let i = 0; i < 4; i++)
            this.part(this.turret, this.boxGeometry, 0.06, 0.04, 0.46, -0.16 + i * 0.09, 0.22, 0, i % 2 ? trim : dark)

        this.pitch = new THREE.Group()
        this.pitch.position.set(0.04, 0.21, 0)
        this.turret.add(this.pitch)

        // ── Hai RAY PHÓNG: ống mở, có gân dọc và miệng loe ──────────────────
        for(const side of [ -0.15, 0.15 ])
        {
            this.part(this.pitch, cyl, 0.19, 0.9, 0.19, 0.3, 0, side, steel, { z: Math.PI * 0.5 })
            this.part(this.pitch, cyl, 0.15, 0.92, 0.15, 0.3, 0, side, dark, { z: Math.PI * 0.5 })

            // Miệng loe hình nón
            this.part(this.pitch, this.coneGeometry, 0.24, 0.14, 0.24, 0.78, 0, side, steel, { z: -Math.PI * 0.5 })

            // Gân dọc thân ống
            for(const up of [ -1, 1 ])
                this.part(this.pitch, this.boxGeometry, 0.72, 0.035, 0.05, 0.3, up * 0.095, side, dark)

            // Đầu đạn ló ra ở miệng ống — nhìn là biết đang nạp
            this.part(this.pitch, this.coneGeometry, 0.13, 0.2, 0.13, 0.7, 0, side, '#c0392b', { z: -Math.PI * 0.5 })
        }

        // Khối nối hai ống + xi-lanh nâng hạ
        this.part(this.pitch, this.boxGeometry, 0.26, 0.2, 0.46, 0.02, 0, 0, steel)
        this.part(this.pitch, cyl, 0.07, 0.3, 0.07, -0.16, -0.1, 0, '#9aa0a8', { z: 0.9 })

        // Ống ngắm + đèn báo nạp đạn
        this.part(this.pitch, cyl, 0.09, 0.28, 0.09, 0.12, 0.15, 0, dark, { z: Math.PI * 0.5 })
        this.part(this.pitch, cyl, 0.11, 0.04, 0.11, 0.27, 0.15, 0, '#7ec8ff', { z: Math.PI * 0.5 })
        this.readyLight = this.part(this.pitch, this.sphereGeometry, 0.08, 0.08, 0.08, -0.17, 0.13, 0, this.emissive)
    }

    /** Vòng ngắm dưới đất, cho biết tên lửa sẽ rơi vào đâu. */
    setMarker()
    {
        this.marker = new THREE.Group()
        this.marker.visible = false
        this.game.scene.add(this.marker)

        const ring = new THREE.Mesh(new THREE.RingGeometry(0.8, 1.05, 28), this.emissive)
        ring.rotation.x = -Math.PI * 0.5
        this.marker.add(ring)

        const inner = new THREE.Mesh(new THREE.RingGeometry(0.24, 0.34, 20), this.emissive)
        inner.rotation.x = -Math.PI * 0.5
        this.marker.add(inner)

        for(let i = 0; i < 4; i++)
        {
            const a = i * Math.PI * 0.5 + Math.PI * 0.25
            const tick = new THREE.Mesh(this.boxGeometry, this.emissive)
            tick.scale.set(0.4, 0.03, 0.08)
            tick.position.set(Math.cos(a) * 1.35, 0, Math.sin(a) * 1.35)
            tick.rotation.y = -a
            this.marker.add(tick)
        }
    }

    /** Tiếng nổ lấy ĐÚNG của thùng thuốc nổ trong bản mẫu. */
    setSounds()
    {
        this.sounds = { explosions: [], launch: null }

        /**
         * Đăng ký theo ĐÚNG khuôn của `ExplosiveCrates` — kể cả `positions`,
         * `distanceFade` và `onPlay`. Thiếu `onPlay` thì `play(toạ độ)` không
         * làm gì cả, vì `Audio.register` chuyển tham số thẳng vào `onPlay`.
         */
        const register = (path, volume, fade) => this.game.audio.register({
            path,
            autoplay: false,
            loop: false,
            volume,
            antiSpam: 0.15,
            positions: new THREE.Vector3(),
            distanceFade: fade,
            onPlay: (item, coordinates) =>
            {
                item.positions[0].copy(coordinates)
                item.volume = 1
            },
        })

        for(const path of [
            'sounds/explosions/SmallImpactMediumE PE281202.mp3',
            'sounds/explosions/SmallImpactMediumE PE281203.mp3',
        ])
            this.sounds.explosions.push(register(path, 0.5, 30))

        // Tiếng phụt khi rời nòng — mượn tiếng va kim loại nhẹ có sẵn
        this.sounds.launch = register('sounds/clicks/Source Metal Clicks Delicate Light Sharp Clip Mid 07.mp3', 0.35, 20)
    }

    /**
     * Phím bắn đi qua ĐÚNG hệ `inputs.actions` như mọi phím khác của game.
     * Tự nghe `keydown` là hỏng: màn chào chặn phím ở pha bắt, và bảng Cài đặt
     * mở ra vẫn bắn được thì rất phiền.
     */
    setAction()
    {
        this.game.inputs.addActions([
            { name: 'fireRocket', categories: [ 'wandering' ], keys: [ 'Keyboard.KeyX', 'Keyboard.Enter', 'Keyboard.NumpadEnter' ] },
        ])

        // Bắt theo TÊN action — đúng khuôn `honk` của Player
        this.game.inputs.events.on('fireRocket', (action) =>
        {
            if(action.active) this.fire()
        })
    }

    /**
     * Tự nối hai nút Off/On trong bảng Cài đặt.
     *
     * ⚠️ Việc này KHÔNG làm được từ `Options`: `Options` dựng ở dòng 110 của
     * `Game.js` còn nội dung thế giới mãi `world.step(1)` (dòng 199) mới dựng,
     * nên lúc `Options` chạy thì `world.vehicleRocket` chưa tồn tại. Đã thử
     * hoãn bằng `ticker.wait(2)` và vẫn sớm — bấm nút không ăn gì. Để chính
     * module tự nối thì không còn phụ thuộc thứ tự nữa.
     */
    setSettingsButtons()
    {
        const container = document.querySelector('.js-rocket-modes')
        if(!container) return

        const buttons = [ ...container.querySelectorAll('button[data-mode]') ]

        const update = () =>
        {
            for(const button of buttons)
                button.classList.toggle('is-active', button.dataset.mode === this.preference.current)
        }

        update()
        this.events.on('preferenceChange', update)

        for(const button of buttons)
            button.addEventListener('click', () =>
            {
                this.game.audio?.play?.('uiClick')
                this.preference.set(button.dataset.mode)
            })
    }

    apply()
    {
        this.enabled = this.preference.current === 'on'
        if(this.cannon) this.cannon.visible = this.enabled
        if(!this.enabled) this.marker.visible = false
    }

    /** Điểm dưới con trỏ, chiếu xuống mặt đất. */
    updateAim()
    {
        const pointer = this.game.inputs.pointer
        if(!pointer) return false

        this.ndc.set(
            (pointer.current.x / this.game.viewport.width) * 2 - 1,
            -((pointer.current.y / this.game.viewport.height) * 2 - 1),
        )
        this.raycaster.setFromCamera(this.ndc, this.game.view.camera)

        const point = this.raycaster.ray.intersectPlane(this.groundPlane, this.aim)
        return !!point
    }

    fire()
    {
        if(!this.enabled || !this.cannon || !this.hasAim) return

        const muzzle = new THREE.Vector3()
        this.pitch.getWorldPosition(muzzle)

        const target = this.aim.clone()
        const distance = muzzle.distanceTo(target)

        const group = new THREE.Group()
        this.game.scene.add(group)

        // Thân đạn nằm dọc trục X cục bộ, để xoay theo hướng bay cho tiện
        this.part(group, this.cylinderGeometry, 0.16, 0.66, 0.16, 0, 0, 0, '#d8d3c7', { z: Math.PI * 0.5 })
        this.part(group, this.coneGeometry, 0.2, 0.26, 0.2, 0.42, 0, 0, '#c0392b', { z: -Math.PI * 0.5 })
        for(let i = 0; i < 3; i++)
        {
            const a = (i / 3) * Math.PI * 2
            this.part(group, this.boxGeometry, 0.18, 0.02, 0.16, -0.3, Math.sin(a) * 0.11, Math.cos(a) * 0.11, '#c0392b', { x: -a })
        }
        // Lửa đuôi
        const flame = this.part(group, this.coneGeometry, 0.22, 0.5, 0.22, -0.58, 0, 0, this.emissive, { z: Math.PI * 0.5 })

        /**
         * Vệt khói: đốt gần nòng còn cháy đỏ, ra sau nguội dần thành khói xám
         * rồi tan hẳn. Bốn tầng màu + độ đục giảm dần, cộng với việc mỗi đốt tự
         * phình to theo tuổi, là đủ ra vệt khói thật.
         */
        const trail = []
        for(let i = 0; i < TRAIL_COUNT; i++)
        {
            const t = i / (TRAIL_COUNT - 1)
            const material = t < 0.14 ? this.puffMaterial(255, 224, 150, 0.85)
                : t < 0.32 ? this.puffMaterial(255, 158, 74, 0.6)
                : t < 0.6 ? this.puffMaterial(188, 180, 170, 0.4)
                : this.puffMaterial(206, 202, 196, 0.2)
            trail.push(this.makePuff(material))
        }

        this.rockets.push({
            group, flame, trail,
            from: muzzle.clone(), to: target,
            distance,
            arc: Math.min(12, distance * ARC_HEIGHT),
            progress: 0,
            duration: Math.max(0.35, distance / FLIGHT_SPEED),
        })

        this.sounds.launch?.play(muzzle)
    }

    detonate(rocket)
    {
        const at = rocket.to.clone()
        at.y = Math.max(at.y, 0.2)

        // ĐÚNG bộ máy nổ của bản mẫu: cầu lửa + sức nổ vật lý + tiếng nổ
        this.game.world.fireballs?.create(at, 4.5, 5)
        this.game.explosions?.explode(at, 8, 5)

        const sound = this.sounds.explosions[Math.floor(this.game.ticker.elapsed * 7) % this.sounds.explosions.length]
        sound?.play(at)

        this.spawnBlast(at)

        this.game.scene.remove(rocket.group)
        for(const puff of rocket.trail) this.game.scene.remove(puff)
    }

    /**
     * Ba lớp phụ đắp thêm lên quả cầu lửa của bản mẫu, để vụ nổ có SỨC NẶNG:
     *  - SÓNG XUNG KÍCH loang trên mặt đất, bung rất nhanh rồi tan
     *  - CHỚP SÁNG loé một cái ở tâm rồi tắt
     *  - KHÓI CUỘN bốc lên và loe ra
     *  - MẢNH VĂNG bay ra bốn phía rồi rơi xuống theo trọng lực
     */
    spawnBlast(at)
    {
        const shock = this.makePuff(this.puffMaterial(255, 236, 190, 0.75))
        shock.position.set(at.x, 0.28, at.z)
        shock.visible = true

        const flash = this.makePuff(this.puffMaterial(255, 248, 214, 0.95))
        flash.position.set(at.x, at.y + 0.8, at.z)
        flash.visible = true

        const smoke = []
        for(let i = 0; i < 7; i++)
        {
            const puff = this.makePuff(this.puffMaterial(180, 172, 164, 0.42))
            const a = (i / 7) * Math.PI * 2
            puff.position.set(at.x + Math.cos(a) * 0.6, at.y + 0.5, at.z + Math.sin(a) * 0.6)
            puff.visible = true
            smoke.push({ mesh: puff, angle: a, speed: 2.4 + (i % 3) * 0.7 })
        }

        const shards = []
        for(let i = 0; i < 12; i++)
        {
            const mesh = new THREE.Mesh(this.boxGeometry, i % 3 === 0 ? this.emissive : this.material('#6b6357'))
            const s = 0.1 + (i % 4) * 0.045
            mesh.scale.set(s, s * 0.6, s * 0.8)
            mesh.position.copy(at)
            mesh.castShadow = false
            this.game.scene.add(mesh)

            const a = (i / 12) * Math.PI * 2 + 0.3
            shards.push({
                mesh,
                vx: Math.cos(a) * (5 + (i % 5)),
                vz: Math.sin(a) * (5 + (i % 5)),
                vy: 5.5 + (i % 4) * 1.4,
                spin: (i % 2 ? 1 : -1) * (4 + i % 3),
            })
        }

        this.blasts.push({ shock, flash, smoke, shards, at: at.clone(), age: 0, life: 1.5 })
    }

    updateBlasts(delta)
    {
        for(let i = this.blasts.length - 1; i >= 0; i--)
        {
            const b = this.blasts[i]
            b.age += delta
            const t = b.age / b.life

            if(t >= 1)
            {
                this.game.scene.remove(b.shock)
                this.game.scene.remove(b.flash)
                for(const s of b.smoke) this.game.scene.remove(s.mesh)
                for(const s of b.shards) this.game.scene.remove(s.mesh)
                this.blasts.splice(i, 1)
                continue
            }

            // Sóng xung kích: bung nhanh lúc đầu rồi chậm dần, mỏng đi khi tan
            const ring = 1 - Math.pow(1 - Math.min(1, t * 2.6), 3)
            b.shock.scale.setScalar(1.5 + ring * 15)
            b.shock.visible = t < 0.42

            // Chớp sáng: loé to rồi tắt ngay
            const flash = Math.max(0, 1 - t * 7)
            b.flash.scale.setScalar(0.4 + flash * 7)
            b.flash.visible = flash > 0.02

            // Khói cuộn: bốc lên, loe ra, mờ dần bằng cách phình to
            for(const s of b.smoke)
            {
                const grow = 1.4 + t * 6
                s.mesh.scale.setScalar(grow)
                s.mesh.position.x = b.at.x + Math.cos(s.angle) * (0.6 + t * s.speed * 1.6)
                s.mesh.position.z = b.at.z + Math.sin(s.angle) * (0.6 + t * s.speed * 1.6)
                s.mesh.position.y = b.at.y + 0.5 + t * 3.2
                s.mesh.visible = t < 0.92
            }

            // Mảnh văng: bay ra rồi rơi theo trọng lực, nằm lại trên đất
            for(const s of b.shards)
            {
                s.vy -= 17 * delta
                s.mesh.position.x += s.vx * delta
                s.mesh.position.z += s.vz * delta
                s.mesh.position.y += s.vy * delta
                s.mesh.rotation.x += s.spin * delta
                s.mesh.rotation.z += s.spin * 0.7 * delta

                if(s.mesh.position.y < 0.08)
                {
                    s.mesh.position.y = 0.08
                    s.vx *= 0.6
                    s.vz *= 0.6
                    s.vy = 0
                }
                s.mesh.visible = t < 0.95
            }
        }
    }

    update()
    {
        if(!this.cannon) return

        const delta = Math.min(this.game.ticker.delta, 0.1)

        // ── Ngắm ────────────────────────────────────────────────────────────
        if(this.enabled)
        {
            this.hasAim = this.updateAim()
            this.marker.visible = this.hasAim

            if(this.hasAim)
            {
                this.marker.position.set(this.aim.x, 0.18, this.aim.z)
                this.marker.rotation.y += delta * 0.6

                // Nòng quay theo điểm ngắm. Góc tính trong hệ quy chiếu CỦA XE
                // nên xe quay thì nòng vẫn bám đúng mục tiêu.
                const local = this.cannon.worldToLocal(this.aim.clone())
                this.turret.rotation.y = Math.atan2(-local.z, local.x)

                const flat = Math.hypot(local.x, local.z)
                this.pitch.rotation.z = Math.min(0.85, Math.max(0.12, 0.1 + flat * 0.012))
            }
        }
        else if(this.marker.visible)
        {
            this.marker.visible = false
        }

        this.updateBlasts(delta)

        // ── Tên lửa đang bay ────────────────────────────────────────────────
        for(let i = this.rockets.length - 1; i >= 0; i--)
        {
            const rocket = this.rockets[i]
            rocket.progress += delta / rocket.duration

            if(rocket.progress >= 1)
            {
                this.detonate(rocket)
                this.rockets.splice(i, 1)
                continue
            }

            const t = rocket.progress
            const position = rocket.from.clone().lerp(rocket.to, t)
            // Vòng cung thấp — máy quay nhìn từ trên xuống, vọt cao là mất dấu
            position.y += Math.sin(t * Math.PI) * rocket.arc

            // Hướng mũi đạn = hướng đang bay, lấy bằng cách nhìn trước một chút
            const ahead = rocket.from.clone().lerp(rocket.to, Math.min(1, t + 0.02))
            ahead.y += Math.sin(Math.min(1, t + 0.02) * Math.PI) * rocket.arc

            rocket.group.position.copy(position)
            rocket.group.lookAt(ahead)
            rocket.group.rotateY(Math.PI * 0.5)   // thân nằm dọc trục X cục bộ

            rocket.flame.scale.y = 0.4 + Math.abs(Math.sin(this.game.ticker.elapsed * 40)) * 0.3

            // Vệt khói: đốt càng cũ càng to và càng lùi lại phía sau
            for(let j = 0; j < rocket.trail.length; j++)
            {
                const back = (j + 1) * 0.028
                const tj = t - back
                if(tj < 0) continue

                const puff = rocket.trail[j]
                const p = rocket.from.clone().lerp(rocket.to, tj)
                p.y += Math.sin(tj * Math.PI) * rocket.arc

                // Khói bốc lên và loe ra theo tuổi — đứng yên một chỗ thì trông
                // như chuỗi hạt, không ra khói
                puff.position.set(p.x, p.y + j * 0.05, p.z)
                puff.visible = true
                puff.rotation.y = j * 0.7
                puff.scale.setScalar(0.7 + j * 0.34)
            }
        }

        // Đèn báo nhấp nháy khi có tên lửa đang bay
        if(this.readyLight)
            this.readyLight.scale.setScalar(this.rockets.length ? 0.05 : 0.09)
    }
}
