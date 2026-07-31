import * as THREE from 'three/webgpu'
import { color, texture as textureNode } from 'three/tsl'
import { Game } from '../Game.js'
import { MeshDefaultMaterial } from '../Materials/MeshDefaultMaterial.js'
import { Events } from '../Events.js'

/**
 * KHẨU PHÁO TÊN LỬA trên nóc xe.
 *
 * Bật/tắt ở mục "Rocket" trong bảng Cài đặt, chọn vũ khí ở mục "Weapon" ngay
 * dưới. Bật thì khẩu pháo mọc lên nóc xe, nòng tự xoay theo con trỏ chuột; bấm
 * X là bắn một quả đạn bay tới đúng điểm đang trỏ rồi nổ.
 *
 * Vụ nổ nối thẳng vào `FptuDestruction` — bắn tới đâu nhà đổ, cây gãy, nước
 * tung tới đó (nếu mục "Destruction" đang bật).
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
 *  - Máy quay nhìn từ trên xuống, khung hình gần như KHÔNG CÓ TRỜI ⇒ đạn lên
 *    cao là khuất khỏi khung. Bù bằng BÓNG ĐỔ chạy dưới đất — với tên lửa thì
 *    cả pha lượn vòng, thứ người chơi nhìn chính là cái bóng vẽ vòng tròn.
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

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * HAI VŨ KHÍ, MỘT KHẨU PHÁO
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Đổi vũ khí ở mục "Weapon" trong bảng Cài đặt. Cố ý KHÔNG viết class thứ hai:
 * khẩu pháo, cách ngắm, vệt khói, bóng đổ, vụ nổ đều dùng chung — hai vũ khí
 * chỉ khác ĐƯỜNG BAY và HỆ SỐ NỔ, nên chúng là hai bộ tham số.
 *
 *  rocket  — vòng cung thấp, tới đích trong dưới một giây.
 *  missile — ba pha: BỐC LÊN (~0,6s) → LƯỢN MỘT VÒNG TRÒN trên trời (2,5s) →
 *            BỔ NHÀO thẳng xuống. Sức công phá và xung kích GẤP 5 LẦN rocket.
 *
 * Vì sao tên lửa lượn vòng lại xem được dù máy quay chúc thẳng xuống (khung
 * hình gần như không có trời): quả đạn kéo theo một vệt BÓNG ĐỔ chạy dưới đất,
 * và trong lúc lượn vòng cái bóng ấy vẽ nguyên một vòng tròn quanh mục tiêu —
 * đó chính là thứ người chơi nhìn, không phải quả đạn.
 */
const WEAPONS = {
    rocket: {
        label: 'Rocket',
        trailCount: 14,
        /**
         * Vòng cung cao 0,78 lần quãng đường, trần 24.
         *
         * Vùng nhìn chỉ chừng 29 đơn vị nên tầm bắn cũng chỉ tới đó — hệ số
         * phải LỚN thì vòng cung mới rõ: bắn xa 25 đơn vị thì đạn vọt lên gần
         * 20. User chốt chấp nhận có lúc đạn khuất khỏi khung hình, đổi lại có
         * bóng đổ để bám dấu.
         */
        arcHeight: 0.78,
        arcCeiling: 24,
        // Cố ý không nhanh hơn: vòng cung cao nên phải có thời gian mà nhìn,
        // bay nhanh quá thì chỉ thấy một cái chớp.
        speed: 34,
        bodyScale: 1,
        fireRadius: 4.5,
        blastRadius: 5,
        shockRadius: 8,
        shockStrength: 5,
        /**
         * Bán kính và sức phá của HỆ PHÁ HUỶ.
         *
         * Cố ý bằng ĐÚNG `shockRadius`: người chơi thấy sóng xung kích tới đâu
         * thì đổ tới đó. Để nhỏ hơn (đã thử 6) thì toà Alpha — vốn ghép từ
         * những khối 7×8×4 — chỉ có 6 mảng lọt vào tầm, bắn mãi không sập.
         */
        damageRadius: 8,
        damagePower: 1,
        blastScale: 1,
    },
    missile: {
        label: 'Missile',
        trailCount: 22,
        speed: 34,
        bodyScale: 1.5,
        /** Trần bay khi lượn vòng, và bán kính vòng lượn quanh mục tiêu. */
        apex: 26,
        /**
         * Bán kính vòng lượn.
         *
         * Từng phải thu xuống 5 hồi máy quay còn NEO TĨNH vào mục tiêu — khi
         * ấy cả vòng phải nằm lọt trong khung. Nay máy quay BÁM SÁT quả đạn
         * (xem `cameraTargetFor`) nên ràng buộc đó không còn: trả về 9 cho ra
         * một vòng bay rộng rãi, thấy rõ đang lượn quanh mục tiêu.
         */
        orbitRadius: 9,
        /** Ba pha, tính bằng GIÂY. Vòng lượn 2,5s — user chốt "2–3 giây". */
        boost: 0.6,
        orbit: 2.5,
        dive: 0.75,
        /**
         * Số vòng lượn. ĐÚNG MỘT vòng: máy quay bám theo nên nền đất quay theo
         * quả đạn, 1,25 vòng làm cảnh xoay quá tay và chóng mặt.
         */
        turns: 1,
        // GẤP 5 LẦN rocket ở cả sức công phá lẫn xung kích
        fireRadius: 9,
        blastRadius: 12,
        shockRadius: 18,
        shockStrength: 25,
        damageRadius: 16,
        damagePower: 5,
        blastScale: 2.2,
    },
}

/**
 * LƯỢNG NHÌN TRƯỚC của máy quay bám tên lửa, tính bằng GIÂY.
 *
 * Phải xấp xỉ TỔNG độ trễ của hai tầng làm mượt trên đường đi của điểm nhìn:
 *  - bộ lọc thông thấp trong `updateCameraFollow()` — hằng số thời gian 1/5 s
 *  - phần làm mượt điểm nhìn của `View.update()`     — hằng số thời gian 1/10 s
 * Cộng lại ~0,3 giây. Ngắm trước đúng ngần ấy thì hai cái trễ triệt tiêu nhau
 * và quả đạn đứng yên giữa khung, dù nó đang lượn 27 đơn vị mỗi giây.
 *
 * Để quá lớn thì khung hình chạy TRƯỚC quả đạn (nhìn như máy quay đang bỏ nó
 * lại), để quá nhỏ thì đạn tụt về sau khung.
 */
const CAMERA_LEAD = 0.3

export class VehicleRocket
{
    constructor()
    {
        this.game = Game.getInstance()
        this.events = new Events()

        this.enabled = false
        this.rockets = []
        this.blasts = []
        /** Độ giật của bệ phóng sau mỗi phát, tự tắt dần. */
        this.launchKick = 0
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
        this.setWeaponPreference()
        this.setCannon()
        this.setMarker()
        this.setSounds()
        this.setAction()
        this.setSettingsButtons()
        this.apply()

        this.game.ticker.events.on('tick', () => this.update(), 11)

        // Máy quay bám tên lửa — PHẢI ở thứ tự 6, xem chú thích ở
        // `updateCameraFollow()`
        this.game.ticker.events.on('tick', () => this.updateCameraFollow(), 6)
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

    /** Chọn vũ khí — cùng khuôn nhớ qua `localStorage`. */
    setWeaponPreference()
    {
        this.weaponPreference = {}
        this.weaponPreference.names = [ 'rocket', 'missile' ]
        this.weaponPreference.current = localStorage.getItem('weaponPreference') === 'missile' ? 'missile' : 'rocket'

        this.weaponPreference.set = (name) =>
        {
            if(!this.weaponPreference.names.includes(name)) return
            this.weaponPreference.current = name
            localStorage.setItem('weaponPreference', name)
            // `apply()` mới là chỗ tráo khí tài trên nóc xe
            this.apply()
            this.events?.trigger('weaponChange')
        }
    }

    get weapon()
    {
        return WEAPONS[this.weaponPreference.current] ?? WEAPONS.rocket
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

        this.setLauncher(chassis)
    }

    /**
     * BỆ PHÓNG TÊN LỬA — khí tài THỨ HAI, thay chỗ khẩu pháo khi chọn "Missile".
     *
     * Cố ý dựng khác hẳn khẩu pháo chứ không sơn lại cái cũ: khẩu pháo là hai
     * ống nằm ngang chĩa ra trước, còn đây là một CỤM ỐNG PHÓNG bốn ô dựng đứng
     * gần như thẳng lên trời, có ram thuỷ lực nâng ở sau và bốn chân chống hạ
     * xuống hai bên — nhìn một cái là biết xe đang mang thứ khác.
     *
     * Nòng dựng đứng cũng là điều kiện của đường bay: tên lửa bốc thẳng lên
     * trước rồi mới lượn vòng, nên bệ phóng phải chĩa lên chứ không chĩa ngang.
     */
    setLauncher(chassis)
    {
        const cyl = this.cylinderGeometry
        const steel = '#59606b'
        const dark = '#23262b'
        const olive = '#4c5b3a'
        const trim = '#e0a52c'

        this.launcher = new THREE.Group()
        this.launcher.position.set(-0.05, 1.0, 0)
        this.launcher.visible = false
        chassis.add(this.launcher)

        // ── Sàn bệ + bốn chân chống hạ xuống ────────────────────────────────
        this.part(this.launcher, this.boxGeometry, 0.92, 0.1, 0.78, 0, 0.05, 0, dark)
        for(const sx of [ -1, 1 ])
            for(const sz of [ -1, 1 ])
            {
                this.part(this.launcher, this.boxGeometry, 0.12, 0.06, 0.34, sx * 0.42, 0.05, sz * 0.42, steel, { x: sz * 0.5 })
                this.part(this.launcher, cyl, 0.16, 0.1, 0.16, sx * 0.46, 0.02, sz * 0.56, dark)
            }

        // Vành xoay
        this.part(this.launcher, cyl, 0.6, 0.09, 0.6, 0, 0.14, 0, steel)
        for(let i = 0; i < 10; i++)
        {
            const a = (i / 10) * Math.PI * 2
            this.part(this.launcher, this.boxGeometry, 0.05, 0.04, 0.05, Math.cos(a) * 0.3, 0.2, Math.sin(a) * 0.3, trim)
        }

        this.launcherTurret = new THREE.Group()
        this.launcherTurret.position.y = 0.2
        this.launcher.add(this.launcherTurret)

        // Hai má đỡ trục nâng — cụm ống gối lên đây
        for(const side of [ -1, 1 ])
            this.part(this.launcherTurret, this.boxGeometry, 0.22, 0.34, 0.1, -0.16, 0.17, side * 0.26, steel)

        this.launcherPitch = new THREE.Group()
        this.launcherPitch.position.set(-0.16, 0.3, 0)
        this.launcherTurret.add(this.launcherPitch)

        /**
         * ── CỤM BỐN ỐNG PHÓNG ──
         * Cụm nằm dọc trục X cục bộ giống nòng pháo, nên `rotation.z` của
         * `launcherPitch` nâng nó lên y hệt — dùng chung được đoạn mã ngắm.
         */
        this.part(this.launcherPitch, this.boxGeometry, 1.15, 0.5, 0.5, 0.42, 0, 0, olive)
        this.part(this.launcherPitch, this.boxGeometry, 1.2, 0.09, 0.54, 0.42, 0, 0, dark)
        this.part(this.launcherPitch, this.boxGeometry, 1.2, 0.54, 0.09, 0.42, 0, 0, dark)

        for(const oy of [ -0.12, 0.12 ])
            for(const oz of [ -0.12, 0.12 ])
            {
                // Lòng ống + miệng ống + đầu đạn ló ra, nhìn là biết đang nạp đủ
                this.part(this.launcherPitch, cyl, 0.2, 1.16, 0.2, 0.42, oy, oz, dark, { z: Math.PI * 0.5 })
                this.part(this.launcherPitch, cyl, 0.23, 0.07, 0.23, 0.99, oy, oz, steel, { z: Math.PI * 0.5 })
                this.part(this.launcherPitch, this.coneGeometry, 0.15, 0.22, 0.15, 1.02, oy, oz, '#c0392b', { z: -Math.PI * 0.5 })
            }

        // Vạch cảnh báo vàng-đen dọc thân cụm
        for(let i = 0; i < 5; i++)
            this.part(this.launcherPitch, this.boxGeometry, 0.09, 0.03, 0.52, 0.05 + i * 0.14, 0.26, 0, i % 2 ? trim : dark)

        // Ram thuỷ lực nâng cụm ống + khối máy ở đuôi
        this.part(this.launcherPitch, this.boxGeometry, 0.26, 0.42, 0.44, -0.28, 0, 0, steel)
        this.part(this.launcherPitch, cyl, 0.1, 0.5, 0.1, -0.2, -0.26, 0, '#9aa0a8', { z: 1.15 })

        // Đèn báo nạp đạn — nhấp nháy khi có quả đang bay
        this.launcherLight = this.part(this.launcherPitch, this.sphereGeometry, 0.09, 0.09, 0.09, -0.34, 0.26, 0, this.emissive)
    }

    /**
     * Khí tài ĐANG dùng. Cả hai treo trên thân xe cùng lúc, chỉ một cái hiện —
     * đổi vũ khí là đổi cái hiện, không phải dựng lại.
     */
    get mount()
    {
        return this.weaponPreference.current === 'missile'
            ? { root: this.launcher, turret: this.launcherTurret, pitch: this.launcherPitch, light: this.launcherLight }
            : { root: this.cannon, turret: this.turret, pitch: this.pitch, light: this.readyLight }
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

        /**
         * ─── TIẾNG CỦA TÊN LỬA ───
         *
         * Kho tiếng của bản mẫu không có tệp "tên lửa" nào, nên tiếng tên lửa
         * được GHÉP từ ba tiếng sẵn có, mỗi tiếng đúng một pha:
         *  - rời bệ phóng: tiếng xé gió trầm (`swoosh`), chồng lên tiếng kim loại
         *  - bổ nhào: tiếng xé gió thứ hai — đúng tiếng rít quen thuộc lúc đạn
         *    lao xuống, và nó cũng là lời báo trước cho người chơi
         *  - chạm đất: HAI tiếng nổ cùng lúc + một tiếng sấm gần làm phần trầm,
         *    nên quả này nghe nặng hẳn so với rocket
         */
        this.sounds.missileLaunch = register('sounds/swoosh/Swoosh 02.mp3', 0.5, 34)
        this.sounds.missileDive = register('sounds/swoosh/Swoosh 05.mp3', 0.6, 40)
        this.sounds.missileBoom = register('sounds/thunder/near/THUNDER_GEN-HDF-23300.mp3', 0.55, 60)
        this.sounds.missileIgnite = register('sounds/fire/ignite-1.mp3', 0.6, 30)

        /**
         * Tiếng động cơ: LẶP và BÁM theo quả đạn. `antiSpam: 0` vì nó không
         * phải tiếng bắn từng phát mà là một dòng chảy liên tục — để nguyên
         * 0,15 giây chống dội thì bật lại sau phát thứ hai sẽ bị nuốt.
         */
        this.sounds.missileEngine = this.game.audio.register({
            path: 'sounds/fire/Fire Burning.mp3',
            autoplay: false,
            loop: true,
            volume: 0.5,
            antiSpam: 0,
            positions: new THREE.Vector3(),
            distanceFade: 55,
            onPlay: (item, coordinates) =>
            {
                if(coordinates) item.positions[0].copy(coordinates)
                item.volume = 1
            },
        })
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

        // Hai nút chọn vũ khí — cùng lý do phải tự nối như trên
        const weaponContainer = document.querySelector('.js-weapon-modes')
        if(!weaponContainer) return

        const weaponButtons = [ ...weaponContainer.querySelectorAll('button[data-mode]') ]

        const updateWeapon = () =>
        {
            for(const button of weaponButtons)
                button.classList.toggle('is-active', button.dataset.mode === this.weaponPreference.current)
        }

        updateWeapon()
        this.events.on('weaponChange', updateWeapon)

        for(const button of weaponButtons)
            button.addEventListener('click', () =>
            {
                this.game.audio?.play?.('uiClick')
                this.weaponPreference.set(button.dataset.mode)
            })
    }

    apply()
    {
        this.enabled = this.preference.current === 'on'

        // Đổi vũ khí là ĐỔI CẢ KHÍ TÀI trên nóc xe — khẩu pháo hai nòng biến
        // mất, bệ phóng bốn ống mọc lên (và ngược lại)
        const missile = this.weaponPreference.current === 'missile'
        if(this.cannon) this.cannon.visible = this.enabled && !missile
        if(this.launcher) this.launcher.visible = this.enabled && missile

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

        const spec = this.weapon
        const isMissile = spec === WEAPONS.missile

        const muzzle = new THREE.Vector3()
        this.mount.pitch.getWorldPosition(muzzle)

        const target = this.aim.clone()
        const distance = muzzle.distanceTo(target)

        const group = new THREE.Group()
        this.game.scene.add(group)

        const flame = isMissile ? this.buildMissileBody(group) : this.buildRocketBody(group)

        /**
         * Vệt khói: đốt gần nòng còn cháy đỏ, ra sau nguội dần thành khói xám
         * rồi tan hẳn. Bốn tầng màu + độ đục giảm dần, cộng với việc mỗi đốt tự
         * phình to theo tuổi, là đủ ra vệt khói thật.
         */
        const trail = []
        for(let i = 0; i < spec.trailCount; i++)
        {
            const t = i / (spec.trailCount - 1)
            const material = t < 0.14 ? this.puffMaterial(255, 224, 150, 0.85)
                : t < 0.32 ? this.puffMaterial(255, 158, 74, 0.6)
                : t < 0.6 ? this.puffMaterial(188, 180, 170, 0.4)
                : this.puffMaterial(206, 202, 196, 0.2)
            trail.push(this.makePuff(material))
        }

        // Bóng đổ chạy dưới đất — thứ giúp bám dấu khi đạn vọt lên quá cao.
        // Với tên lửa nó còn quan trọng hơn: cả pha lượn vòng người chơi chỉ
        // nhìn thấy cái bóng vẽ vòng tròn quanh mục tiêu.
        const shadow = this.makePuff(this.puffMaterial(24, 20, 28, 0.5))
        shadow.visible = true
        shadow.scale.setScalar(1.6)

        const rocket = {
            spec, isMissile,
            group, flame, trail, shadow,
            from: muzzle.clone(), to: target,
            distance,
            time: 0,
        }

        if(isMissile)
        {
            /**
             * Vòng lượn bắt đầu ở phía CÙNG BÊN với bệ phóng, nên pha bốc lên
             * chỉ là leo thẳng lên chỗ vào vòng — không có cú bẻ ngang nào.
             */
            rocket.startAngle = Math.atan2(muzzle.z - target.z, muzzle.x - target.x)

            /**
             * ⚠️ TRẦN BAY phải tính theo CHIỀU CAO MÁY QUAY, không được là một
             * con số cứng.
             *
             * Máy quay bám theo quả đạn (xem `updateCameraFollow`), mà nó treo
             * ở độ cao `spherical.offset.y` — con số này nhảy từ ~17 tới ~30
             * tuỳ khung cửa sổ và mức thu phóng. Đặt cứng trần 26 thì trên
             * khung hẹp quả đạn chỉ còn cách ống kính 4 đơn vị: chụp thử ngày
             * 31/7 thấy nó CHE KÍN màn hình, không nhìn ra đang bay ở đâu.
             *
             * TRẦN BAY chính là nút vặn cỡ quả đạn trên màn hình: máy quay bám
             * nó, nên khoảng cách tới ống kính đúng bằng
             * `(caoMáyQuay − trầnBay) / cos(góc chúc)`, trong khi cái XE thì
             * luôn ở khoảng `caoMáyQuay / cos(góc chúc)`. Tức là tỉ số
             * `1 − trầnBay/caoMáyQuay` quyết định quả đạn trông TO BẰNG MẤY LẦN
             * cái xe — và tỉ số đó chỉ phụ thuộc HỆ SỐ, không phụ thuộc mức thu
             * phóng.
             *
             * ⚠️ Vì vậy trần bay PHẢI là bội số của chiều cao máy quay, KHÔNG
             * được có sàn cứng. Bản trước để `max(9, 0,34 × cao)`: khi kéo xa
             * thì máy quay cao 34 mà sàn 9 vẫn thắng, tỉ số tụt còn 0,26 và quả
             * đạn nhìn chỉ nhỉnh hơn cái xe một chút — user báo "camera không
             * theo tên lửa như trước nữa". Đo được: đạn cách ống kính 27–45
             * trong khi bán kính máy quay là 50.
             *
             * 0,52 cho ra quả đạn trông gấp chừng HAI LẦN cái xe ở MỌI mức thu
             * phóng. Kẹp 8–22 chỉ để tránh hai đầu cực đoan: quá thấp thì đạn
             * chui vào nhà, quá cao thì bay khỏi tầm nhìn.
             */
            const cameraHeight = this.game.view?.spherical?.offset?.y || 24
            rocket.apexY = Math.min(spec.apex, Math.max(8, Math.min(22, cameraHeight * 0.52)))
            rocket.orbitRadius = spec.orbitRadius
            rocket.turns = spec.turns
            rocket.boost = spec.boost
            rocket.orbit = spec.orbit
            rocket.dive = spec.dive
            rocket.duration = spec.boost + spec.orbit + spec.dive
            rocket.trailStep = 0.05
            /** Tốc độ tự xoay quanh trục thân, mỗi quả một khác. */
            rocket.roll = 5 + Math.random() * 3

            // Bệ phóng giật ngửa ra sau rồi từ từ về chỗ cũ
            this.launchKick = 0.32

            this.spawnLaunchSmoke(muzzle)

            this.sounds.missileLaunch?.play(muzzle)
            this.sounds.missileIgnite?.play(muzzle)
            this.startEngineSound(muzzle)
        }
        else
        {
            rocket.arc = Math.min(spec.arcCeiling, distance * spec.arcHeight)
            rocket.duration = Math.max(0.35, distance / spec.speed)
            rocket.trailStep = 0.028 * rocket.duration
        }

        this.rockets.push(rocket)
        this.sounds.launch?.play(muzzle)
    }

    /**
     * KHÓI RỜI BỆ — cuộn khói trắng đùn ra quanh chân bệ phóng rồi loang trên
     * mặt đất. Đây là thứ làm cú phóng có "sức nặng": không có nó thì quả đạn
     * chỉ như bị búng lên.
     */
    spawnLaunchSmoke(muzzle)
    {
        const smoke = []
        for(let i = 0; i < 10; i++)
        {
            const puff = this.makePuff(this.puffMaterial(228, 226, 222, 0.5))
            const angle = (i / 10) * Math.PI * 2
            puff.position.set(muzzle.x, muzzle.y - 0.6, muzzle.z)
            puff.visible = true
            smoke.push({ mesh: puff, angle, speed: 2.6 + (i % 4) * 0.8 })
        }

        // Dùng lại đúng bộ máy vụ nổ nhưng KHÔNG có chớp sáng và mảnh văng —
        // chỉ khói. Nhờ vậy nó tự tan và tự dọn theo cùng một vòng lặp.
        this.blasts.push({
            shock: this.makePuff(this.puffMaterial(240, 238, 234, 0.4)),
            flash: this.makePuff(this.puffMaterial(255, 236, 190, 0.001)),
            smoke, shards: [],
            at: new THREE.Vector3(muzzle.x, muzzle.y - 0.6, muzzle.z),
            age: 0, life: 1.9, scale: 0.9,
        })
    }

    /**
     * TIẾNG ĐỘNG CƠ CHÁY chạy SUỐT hành trình, và bám theo quả đạn.
     *
     * Đây là thứ phân biệt "một tiếng bụp rồi im" với "một quả tên lửa thật":
     * người chơi nghe được nó đang ở đâu trên trời trong lúc lượn vòng. Tiếng
     * đăng ký `loop: true` nên chỉ cần bật một lần, còn `positions[0]` được cập
     * nhật mỗi nhịp — `Audio.update()` đọc thẳng mảng đó để tính hướng và độ xa.
     */
    startEngineSound(at)
    {
        this.engineVoices = (this.engineVoices ?? 0) + 1
        const engine = this.sounds.missileEngine
        if(!engine) return

        engine.positions[0].copy(at)
        if(!engine.howl.playing()) engine.play(at)
    }

    stopEngineSound()
    {
        this.engineVoices = Math.max(0, (this.engineVoices ?? 0) - 1)
        // Còn quả nào đang bay thì tiếng vẫn phải kêu
        if(this.engineVoices === 0) this.sounds.missileEngine?.howl?.stop()
    }

    /** Quả rocket cũ: thân ngắn, ba cánh đuôi, một ngọn lửa. */
    buildRocketBody(group)
    {
        // Thân đạn nằm dọc trục X cục bộ, để xoay theo hướng bay cho tiện
        this.part(group, this.cylinderGeometry, 0.16, 0.66, 0.16, 0, 0, 0, '#d8d3c7', { z: Math.PI * 0.5 })
        this.part(group, this.coneGeometry, 0.2, 0.26, 0.2, 0.42, 0, 0, '#c0392b', { z: -Math.PI * 0.5 })
        for(let i = 0; i < 3; i++)
        {
            const a = (i / 3) * Math.PI * 2
            this.part(group, this.boxGeometry, 0.18, 0.02, 0.16, -0.3, Math.sin(a) * 0.11, Math.cos(a) * 0.11, '#c0392b', { x: -a })
        }

        return this.part(group, this.coneGeometry, 0.22, 0.5, 0.22, -0.58, 0, 0, this.emissive, { z: Math.PI * 0.5 })
    }

    /**
     * QUẢ TÊN LỬA — dài gấp rưỡi, thân trắng có vạch sơn, mũi đỏ, bốn cánh đuôi
     * cộng bốn cánh mũi, và một ngọn lửa hai lớp (lõi sáng + tán loe).
     *
     * Trả về ngọn lửa để vòng lặp còn cho nó rung theo nhịp.
     */
    buildMissileBody(group)
    {
        const cyl = this.cylinderGeometry
        const white = '#eae7df'
        const dark = '#3a3d44'
        const red = '#c0392b'

        // Thân chính + hai vòng đai
        this.part(group, cyl, 0.24, 1.5, 0.24, 0, 0, 0, white, { z: Math.PI * 0.5 })
        this.part(group, cyl, 0.26, 0.1, 0.26, 0.28, 0, 0, dark, { z: Math.PI * 0.5 })
        this.part(group, cyl, 0.26, 0.1, 0.26, -0.34, 0, 0, dark, { z: Math.PI * 0.5 })

        // Mũi đạn: nón đỏ + chóp đen
        this.part(group, this.coneGeometry, 0.24, 0.5, 0.24, 0.99, 0, 0, red, { z: -Math.PI * 0.5 })
        this.part(group, this.sphereGeometry, 0.1, 0.1, 0.1, 1.24, 0, 0, dark)

        // Bốn cánh đuôi + bốn cánh mũi nhỏ hơn
        for(let i = 0; i < 4; i++)
        {
            const a = (i / 4) * Math.PI * 2
            this.part(group, this.boxGeometry, 0.34, 0.03, 0.3, -0.6, Math.sin(a) * 0.2, Math.cos(a) * 0.2, red, { x: -a })
            this.part(group, this.boxGeometry, 0.2, 0.03, 0.16, 0.42, Math.sin(a) * 0.14, Math.cos(a) * 0.14, dark, { x: -a })
        }

        // Miệng phụt + lửa hai lớp
        this.part(group, cyl, 0.22, 0.12, 0.22, -0.78, 0, 0, dark, { z: Math.PI * 0.5 })
        this.part(group, this.coneGeometry, 0.42, 1.1, 0.42, -1.4, 0, 0, this.puffMaterial(255, 176, 88, 0.5), { z: Math.PI * 0.5 })

        return this.part(group, this.coneGeometry, 0.3, 0.9, 0.3, -1.3, 0, 0, this.emissive, { z: Math.PI * 0.5 })
    }

    /**
     * VỊ TRÍ QUẢ ĐẠN tại giây thứ `time` — MỘT hàm cho cả hai vũ khí.
     *
     * Thân đạn, bóng đổ và từng đốt khói đều hỏi qua đây, nên chúng không thể
     * lệch nhau. Bản trước chép công thức vòng cung ra hai chỗ (thân và vệt
     * khói) — thêm đường bay thứ hai kiểu đó là cầm chắc sai một chỗ.
     */
    positionAt(rocket, time, target = new THREE.Vector3())
    {
        if(!rocket.isMissile)
        {
            const t = Math.min(1, Math.max(0, time / rocket.duration))
            target.copy(rocket.from).lerp(rocket.to, t)
            target.y += Math.sin(t * Math.PI) * rocket.arc
            return target
        }

        // ── Pha 1: BỐC LÊN thẳng đứng tới chỗ vào vòng lượn ──────────────────
        if(time < rocket.boost)
        {
            const t = Math.min(1, Math.max(0, time / rocket.boost))
            const eased = t * t * (3 - 2 * t)   // smoothstep: rời nòng êm, vào vòng êm

            this.orbitPoint(rocket, rocket.startAngle, target)
            const entryX = target.x
            const entryZ = target.z

            target.x = rocket.from.x + (entryX - rocket.from.x) * eased
            target.z = rocket.from.z + (entryZ - rocket.from.z) * eased
            // Căn bậc hai: lên rất nhanh lúc đầu rồi thoải dần — dáng bốc thẳng
            // khỏi bệ phóng, không phải một đường chéo
            target.y = rocket.from.y + (rocket.apexY - rocket.from.y) * Math.sqrt(eased)
            return target
        }

        // ── Pha 2: LƯỢN VÒNG TRÒN trên trời ─────────────────────────────────
        if(time < rocket.boost + rocket.orbit)
        {
            const t = (time - rocket.boost) / rocket.orbit
            this.orbitPoint(rocket, rocket.startAngle + rocket.turns * Math.PI * 2 * t, target)
            target.y += Math.sin(t * Math.PI * 2) * 0.9   // nhấp nhô nhè nhẹ cho đỡ cứng
            return target
        }

        // ── Pha 3: BỔ NHÀO ──────────────────────────────────────────────────
        const t = Math.min(1, (time - rocket.boost - rocket.orbit) / rocket.dive)
        this.orbitPoint(rocket, rocket.startAngle + rocket.turns * Math.PI * 2, target)
        const exitX = target.x
        const exitZ = target.z

        const eased = t * t * (3 - 2 * t)
        target.x = exitX + (rocket.to.x - exitX) * eased
        target.z = exitZ + (rocket.to.z - exitZ) * eased
        // Chiều DỌC tăng tốc (t²) trong khi chiều ngang thì mượt — đó là thứ
        // biến "hạ cánh" thành "bổ nhào"
        target.y = rocket.apexY + (rocket.to.y - rocket.apexY) * (t * t)
        return target
    }

    /** Một điểm trên vòng lượn quanh mục tiêu. */
    orbitPoint(rocket, angle, target = new THREE.Vector3())
    {
        return target.set(
            rocket.to.x + Math.cos(angle) * rocket.orbitRadius,
            rocket.apexY,
            rocket.to.z + Math.sin(angle) * rocket.orbitRadius,
        )
    }

    detonate(rocket)
    {
        const spec = rocket.spec
        const at = rocket.to.clone()
        at.y = Math.max(at.y, 0.2)

        // ĐÚNG bộ máy nổ của bản mẫu: cầu lửa + sức nổ vật lý + tiếng nổ
        this.game.world.fireballs?.create(at, spec.fireRadius, spec.blastRadius)
        this.game.explosions?.explode(at, spec.shockRadius, spec.shockStrength)

        if(rocket.isMissile)
        {
            this.stopEngineSound()
            // Hai tiếng nổ chồng lên nhau + một tiếng sấm gần làm phần trầm
            for(const sound of this.sounds.explosions) sound?.play(at)
            this.sounds.missileBoom?.play(at)
        }
        else
        {
            const sound = this.sounds.explosions[Math.floor(this.game.ticker.elapsed * 7) % this.sounds.explosions.length]
            sound?.play(at)
        }

        this.spawnBlast(at, spec.blastScale)

        // HỆ PHÁ HUỶ — nhà đổ, cây gãy, nước tung, thiên nga chết. Tự nó kiểm
        // tra bật/tắt, nên ở đây cứ gọi thẳng.
        this.game.world.fptuCampus?.destruction?.damage(at, spec.damageRadius, spec.damagePower)

        this.game.scene.remove(rocket.group)
        this.game.scene.remove(rocket.shadow)
        for(const puff of rocket.trail) this.game.scene.remove(puff)
    }

    /**
     * Ba lớp phụ đắp thêm lên quả cầu lửa của bản mẫu, để vụ nổ có SỨC NẶNG:
     *  - SÓNG XUNG KÍCH loang trên mặt đất, bung rất nhanh rồi tan
     *  - CHỚP SÁNG loé một cái ở tâm rồi tắt
     *  - KHÓI CUỘN bốc lên và loe ra
     *  - MẢNH VĂNG bay ra bốn phía rồi rơi xuống theo trọng lực
     */
    spawnBlast(at, scale = 1)
    {
        const shock = this.makePuff(this.puffMaterial(255, 236, 190, 0.75))
        shock.position.set(at.x, 0.28, at.z)
        shock.visible = true

        const flash = this.makePuff(this.puffMaterial(255, 248, 214, 0.95))
        flash.position.set(at.x, at.y + 0.8, at.z)
        flash.visible = true

        const smokeCount = Math.round(7 * scale)
        const smoke = []
        for(let i = 0; i < smokeCount; i++)
        {
            const puff = this.makePuff(this.puffMaterial(180, 172, 164, 0.42))
            const a = (i / smokeCount) * Math.PI * 2
            puff.position.set(at.x + Math.cos(a) * 0.6 * scale, at.y + 0.5, at.z + Math.sin(a) * 0.6 * scale)
            puff.visible = true
            smoke.push({ mesh: puff, angle: a, speed: (2.4 + (i % 3) * 0.7) * scale })
        }

        const shardCount = Math.round(12 * scale)
        const shards = []
        for(let i = 0; i < shardCount; i++)
        {
            const mesh = new THREE.Mesh(this.boxGeometry, i % 3 === 0 ? this.emissive : this.material('#6b6357'))
            const s = (0.1 + (i % 4) * 0.045) * scale
            mesh.scale.set(s, s * 0.6, s * 0.8)
            mesh.position.copy(at)
            mesh.castShadow = false
            this.game.scene.add(mesh)

            const a = (i / shardCount) * Math.PI * 2 + 0.3
            shards.push({
                mesh,
                vx: Math.cos(a) * (5 + (i % 5)) * scale,
                vz: Math.sin(a) * (5 + (i % 5)) * scale,
                vy: (5.5 + (i % 4) * 1.4) * scale,
                spin: (i % 2 ? 1 : -1) * (4 + i % 3),
            })
        }

        this.blasts.push({ shock, flash, smoke, shards, at: at.clone(), age: 0, life: 1.5, scale })
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

            const scale = b.scale ?? 1

            // Sóng xung kích: bung nhanh lúc đầu rồi chậm dần, mỏng đi khi tan
            const ring = 1 - Math.pow(1 - Math.min(1, t * 2.6), 3)
            b.shock.scale.setScalar((1.5 + ring * 15) * scale)
            b.shock.visible = t < 0.42

            // Chớp sáng: loé to rồi tắt ngay
            const flash = Math.max(0, 1 - t * 7)
            b.flash.scale.setScalar((0.4 + flash * 7) * scale)
            b.flash.visible = flash > 0.02

            // Khói cuộn: bốc lên, loe ra, mờ dần bằng cách phình to
            for(const s of b.smoke)
            {
                const grow = (1.4 + t * 6) * scale
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
                const mount = this.mount
                const local = mount.root.worldToLocal(this.aim.clone())
                mount.turret.rotation.y = Math.atan2(-local.z, local.x)

                const flat = Math.hypot(local.x, local.z)

                if(this.weaponPreference.current === 'missile')
                {
                    /**
                     * Bệ phóng luôn chĩa GẦN THẲNG ĐỨNG (~68°) — tên lửa bốc lên
                     * rồi mới lượn vòng, chứ không bắn thẳng vào mục tiêu như
                     * rocket. Chỉ hạ nòng chút ít khi mục tiêu ở rất xa, cho
                     * người chơi thấy nó có phản ứng với tay ngắm.
                     */
                    const target = 1.28 - Math.min(0.22, flat * 0.006)
                    mount.pitch.rotation.z += (target + this.launchKick - mount.pitch.rotation.z) * Math.min(1, delta * 7)
                }
                else
                {
                    mount.pitch.rotation.z = Math.min(0.85, Math.max(0.12, 0.1 + flat * 0.012))
                }
            }
        }

        // Giật bệ phóng sau mỗi phát, tắt dần
        if(this.launchKick !== 0)
            this.launchKick += (0 - this.launchKick) * Math.min(1, delta * 6)
        else if(this.marker.visible)
        {
            this.marker.visible = false
        }

        this.updateBlasts(delta)

        // ── Tên lửa đang bay ────────────────────────────────────────────────
        for(let i = this.rockets.length - 1; i >= 0; i--)
        {
            const rocket = this.rockets[i]
            rocket.time += delta

            if(rocket.time >= rocket.duration)
            {
                this.detonate(rocket)
                this.rockets.splice(i, 1)
                continue
            }

            // Tiếng rít lúc bắt đầu bổ nhào — vừa cho ra dáng tên lửa thật, vừa
            // là lời báo trước "nó đang lao xuống chỗ kia"
            if(rocket.isMissile && !rocket.divePlayed && rocket.time >= rocket.boost + rocket.orbit)
            {
                rocket.divePlayed = true
                this.sounds.missileDive?.play(rocket.to)
            }

            const position = this.positionAt(rocket, rocket.time)
            // Hướng mũi đạn = hướng đang bay, lấy bằng cách nhìn trước một chút
            const ahead = this.positionAt(rocket, rocket.time + Math.min(0.03, rocket.duration * 0.02))

            rocket.group.position.copy(position)
            rocket.group.lookAt(ahead)
            rocket.group.rotateY(Math.PI * 0.5)   // thân nằm dọc trục X cục bộ
            rocket.group.scale.setScalar(rocket.spec.bodyScale)

            // Tên lửa thật XOAY quanh trục thân khi bay (cuộn con quay). Xoay
            // quanh trục X cục bộ vì thân nằm dọc trục đó.
            if(rocket.roll)
                rocket.group.rotateX(rocket.time * rocket.roll)

            // Lửa đuôi đập. Với tên lửa thì đập mạnh hơn và phụt dài hơn hẳn
            // lúc bốc lên, thu lại khi lượn vòng — trông như đang ga lớn ga nhỏ
            const flicker = Math.abs(Math.sin(this.game.ticker.elapsed * 40))
            if(rocket.isMissile)
            {
                const boosting = rocket.time < rocket.boost || rocket.time > rocket.boost + rocket.orbit
                rocket.flame.scale.y = (boosting ? 1.05 : 0.6) + flicker * 0.35
            }
            else
            {
                rocket.flame.scale.y = 0.4 + flicker * 0.3
            }

            // Tiếng động cơ đi theo quả đạn
            if(rocket.isMissile)
                this.sounds.missileEngine?.positions?.[0]?.copy(position)

            // Bóng: bám XZ của đạn, càng lên cao càng to và càng nhạt
            rocket.shadow.position.set(position.x, 0.2, position.z)
            rocket.shadow.scale.setScalar(1.4 + position.y * 0.14)

            // Vệt khói: đốt càng cũ càng to và càng lùi lại phía sau
            for(let j = 0; j < rocket.trail.length; j++)
            {
                const back = (j + 1) * rocket.trailStep
                const timeJ = rocket.time - back
                if(timeJ < 0) continue

                const puff = rocket.trail[j]
                const p = this.positionAt(rocket, timeJ)

                // Khói bốc lên và loe ra theo tuổi — đứng yên một chỗ thì trông
                // như chuỗi hạt, không ra khói
                puff.position.set(p.x, p.y + j * 0.05, p.z)
                puff.visible = true
                puff.rotation.y = j * 0.7
                puff.scale.setScalar((0.7 + j * 0.34) * rocket.spec.bodyScale)
            }
        }

        // Đèn báo nhấp nháy khi có tên lửa đang bay
        const light = this.mount.light
        if(light)
            light.scale.setScalar(this.rockets.length ? 0.05 : 0.09)
    }

    /**
     * MÁY QUAY BÁM THEO TÊN LỬA từ lúc rời bệ tới lúc chạm đất.
     *
     * ⚠️ Nhịp này đăng ký ở thứ tự 6 — CÙNG thứ tự với `Player.updatePostPhysics`
     * và TRƯỚC `View.update()` (thứ tự 7). Đó là điều kiện bắt buộc:
     * `Player` ghi `view.focusPoint.trackedPosition` mỗi nhịp ở thứ tự 6, còn
     * `View` đọc nó ở thứ tự 7. Đặt ở thứ tự 11 như phần còn lại của lớp này
     * thì mỗi nhịp `Player` lại giành lại máy quay về xe, và máy quay chỉ giật
     * giật chứ không bám được. `VehicleRocket` dựng lâu sau `Player` nên trong
     * mảng thứ tự 6 nó đứng SAU — ghi đè được.
     *
     * ⚠️ Vì sao không đơn giản gán toạ độ quả đạn: máy quay chúc xuống và luôn
     * nhìn vào một điểm trên MẶT ĐẤT (`focusPoint` chỉ dùng x/z). Gán thẳng
     * toạ độ ngang của quả đạn thì khung hình bám mặt đất BÊN DƯỚI nó, còn quả
     * đạn ở cao 26 thì nằm ngoài mép trên màn hình. Nên phải bù chiếu:
     *
     *     F = P.xz − offset.xz × (P.y / offset.y)
     *
     * với `offset` là vector từ điểm nhìn tới máy quay. Suy ra bằng cách bắt
     * tia từ máy quay qua quả đạn cắt mặt phẳng y = 0. Lúc bổ nhào P.y → 0 nên
     * số bù cũng về 0, khung hình đáp đúng vào mục tiêu.
     */
    updateCameraFollow()
    {
        const view = this.game.view
        if(!view?.focusPoint?.isTracking) return

        // Bám quả MỚI NHẤT, và chỉ bám tên lửa — rocket bay thấp và nhanh,
        // giật máy quay theo nó chỉ làm chóng mặt
        let missile = null
        for(const rocket of this.rockets)
            if(rocket.isMissile) missile = rocket

        const delta = Math.min(this.game.ticker.delta, 0.1)

        if(!missile)
        {
            this.followRatio = Math.max(0, (this.followRatio ?? 0) - delta * 1.2)

            if(this.followRatio <= 0)
            {
                // Quên đích cũ đi, không thì phát bắn sau máy quay giật từ chỗ
                // rơi của phát trước
                this.followTarget = null
                view.zoom.override = null
                return
            }
        }
        else
        {
            /**
             * Bám NGAY từ nhịp đầu.
             *
             * Từng phải hoãn tới 60% pha bốc lên, vì hồi đó máy quay ngắm vào
             * vị trí HIỆN TẠI của quả đạn — mà nửa giây đầu nó còn sát nóc xe
             * nên đích ngắm quăng đi rất mạnh. Nay đã ngắm TRƯỚC
             * `CAMERA_LEAD` giây nên ngay ở nhịp đầu đích đã nằm phía vùng mục
             * tiêu; máy quay tách khỏi xe ngay và quả đạn không còn vụt ngang
             * ống kính. Đo được: hoãn thì 37/231 mẫu ra ngoài khung, bám ngay
             * thì chỉ còn phần đầu rất ngắn.
             */
            this.followRatio = Math.min(1, (this.followRatio ?? 0) + delta * 2.2)

            /**
             * LÙI MÁY QUAY RA trong suốt hành trình.
             *
             * Không phải để cho đẹp mà vì hình học: phép bám đưa quả đạn vào
             * giữa khung, nên nếu ống kính đang ở thấp ngang tầm quả đạn thì
             * "giữa khung" cũng là "sát ống kính" và cả cảnh quay loạn. Ép trần
             * 0,28 thì ống kính luôn cao chừng 26 trong khi đạn bay cao ~13,5 —
             * cách nhau đủ xa để khung hình đứng yên. Bỏ ép ngay khi hết bám,
             * và `smoothedRatio` lo phần chuyển tiếp nên mắt không thấy giật.
             */
            view.zoom.override = 0.24

            const target = this.cameraTargetFor(missile)

            if(!this.followTarget)
            {
                /**
                 * Khởi động từ CHỖ MÁY QUAY ĐANG NHÌN, không phải từ đích.
                 *
                 * Gán thẳng đích ở nhịp đầu là bộ lọc chẳng có gì để lọc, và
                 * điểm nhìn nhảy một phát rất dài — đo được bước nhảy 6,2 đơn
                 * vị trong MỘT nhịp, mắt thấy rõ là giật. Bắt đầu từ vị trí
                 * hiện tại thì bộ lọc kéo nó tới đích trong ~0,2 giây, mượt.
                 */
                const from = view.focusPoint.trackedPosition
                this.followTarget = { x: from.x, z: from.z }
            }
            else
            {
                /**
                 * LỌC THÔNG THẤP trên chính đích ngắm. `View` đã làm mượt một
                 * lần nữa ở sau, nhưng nó làm mượt cái ĐÍCH — nếu bản thân đích
                 * nhảy giật thì kết quả vẫn giật. Hai tầng làm mượt là thứ biến
                 * "máy quay đuổi theo" thành "máy quay lướt theo".
                 */
                const k = Math.min(1, delta * 5)
                this.followTarget.x += (target.x - this.followTarget.x) * k
                this.followTarget.z += (target.z - this.followTarget.z) * k
            }
        }

        if(!this.followTarget) return

        // Hoà dần vào chỗ xe khi hết bám, để lúc trả máy quay về không bị giật
        const tracked = view.focusPoint.trackedPosition
        tracked.x += (this.followTarget.x - tracked.x) * this.followRatio
        tracked.z += (this.followTarget.z - tracked.z) * this.followRatio
    }

    /**
     * ĐIỂM MÁY QUAY NHÌN VÀO — BÁM SÁT quả đạn suốt cả ba pha.
     *
     * ⚠️ Chìa khoá là NHÌN TRƯỚC, và đây là chỗ đã đi sai HAI lần:
     *
     * Lần 1 — ngắm thẳng vào vị trí HIỆN TẠI của quả đạn. Hỏng: đạn lượn vòng
     * với tốc độ ~27 đơn vị/giây, mà hai tầng làm mượt (bộ lọc ở đây + phần
     * làm mượt điểm nhìn của `View`) cộng lại trễ chừng 0,3 giây ⇒ khung hình
     * luôn tụt lại 8 đơn vị sau quả đạn, trong khi nửa chiều cao khung chỉ ~6.
     * Đạn văng khỏi khung. Càng làm mượt càng trễ, càng bớt mượt càng giật.
     *
     * Lần 2 — neo tĩnh vào mục tiêu cho khỏi trễ. Hết giật thật, nhưng user
     * bác đúng: "cam nó theo tên lửa chứ không đứng ở 1 khung hình như này".
     *
     * Cách chạy được: đừng CHỐNG độ trễ, hãy BÙ nó. Ngắm vào chỗ quả đạn sẽ
     * tới sau `CAMERA_LEAD` giây — đúng bằng độ trễ của hai tầng làm mượt —
     * thì lúc khung hình đuổi kịp, quả đạn vừa vặn ở đó. Máy quay bám sát mà
     * vẫn mượt, vì phần làm mượt không hề bị đụng tới, chỉ pha bị dịch.
     *
     * Làm được là nhờ `positionAt()` tính được vị trí ở BẤT KỲ thời điểm nào
     * (nó vốn đã dùng cho vệt khói). Quá `duration` thì hàm tự bão hoà ở điểm
     * chạm đất, nên lúc bổ nhào lượng nhìn trước tự thu về 0 — không bị ngắm
     * vượt qua mục tiêu.
     */
    cameraTargetFor(missile)
    {
        const position = this.positionAt(missile, missile.time + CAMERA_LEAD)
        const offset = this.game.view.spherical.offset

        if(!offset || Math.abs(offset.y) < 0.001)
            return { x: position.x, z: position.z }

        /**
         * ⚠️ CHẶN TRÊN 0,7 — chỗ này có một điểm KỲ DỊ.
         *
         * Bù chiếu đầy đủ (`ratio = P.y / offset.y`) đưa quả đạn vào ĐÚNG giữa
         * khung hình. Nhưng khi quả đạn lên tới ngang tầm ống kính thì "đúng
         * giữa khung hình" cũng có nghĩa là "sát ngay ống kính": tỉ số tiến về
         * 1 và quả đạn phình ra che kín màn hình.
         *
         * ⚠️ Cũng ĐỪNG hạ quá tay. Đo ngày 31/7: hạ xuống 0,38 thì quả đạn bay
         * hẳn ra ngoài mép trên khung hình, chỉ còn thấy bãi cỏ nó sắp rơi
         * xuống. Cửa sổ "vừa mắt" hẹp hơn tưởng, vì máy quay treo thấp (14–30)
         * và chúc 55° — thứ gì bay cao cũng gần ống kính.
         *
         * 0,85 là gần như bù đủ nhưng tránh được điểm kỳ dị. Việc điều tiết cỡ
         * quả đạn giao cho TRẦN BAY lo (xem `fire()`): trần thấp thì quả đạn ở
         * xa ống kính hơn và nhìn nhỏ lại.
         */
        const ratio = Math.min(0.85, position.y / offset.y)
        return {
            x: position.x - offset.x * ratio,
            z: position.z - offset.z * ratio,
        }
    }
}
