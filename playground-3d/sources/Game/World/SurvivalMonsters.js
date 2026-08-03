import * as THREE from 'three/webgpu'
import { color } from 'three/tsl'
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js'
import { Game } from '../Game.js'
import { MeshDefaultMaterial } from '../Materials/MeshDefaultMaterial.js'
import { SURVIVAL_BLOOD, SURVIVAL_MONSTERS, SURVIVAL_SPAWN, SURVIVAL_STEALTH } from '../../data/survival.js'

/**
 * ĐÀN QUÁI của chế độ Sinh tồn — dựng hình, đi lại, đuổi xe, ăn đòn, chết.
 *
 * `Survival.js` lo luật chơi (sóng, máu người chơi, tiền). File này chỉ lo
 * **những con quái**: chúng trông thế nào và cư xử ra sao.
 *
 * ─── VÌ SAO CÓ KHỚP ─────────────────────────────────────────────────────────
 * Đúng bài học của `FptuPeople`: ở cỡ nhìn này (máy quay cao, FOV hẹp) thứ làm
 * mắt tin không phải số tam giác mà là **cử động đúng khớp**. Chân treo vào
 * nhóm đặt ở hông, cẳng treo vào nhóm đặt ở gối — xoay nhóm là cả chi xoay
 * quanh đúng khớp, không phải trượt cả khối đi.
 *
 * ─── HAI THỨ PHẢI TIẾT KIỆM ─────────────────────────────────────────────────
 * 1. **Bắn tia xuống đất**: mỗi con phải bám mặt đất, nhưng bắn tia cho 26 con
 *    mỗi khung hình là 26 lần `castRay` × 90 khung/giây. Nên mỗi con chỉ bắn
 *    lại chừng 5 lần/giây, và LỆCH PHA nhau theo chỉ số (`index % SLICES`) để
 *    không dồn hết vào cùng một khung.
 * 2. **Vật liệu**: gom theo mã màu trong một `Map` dùng chung cho cả đàn —
 *    mỗi vật liệu mới là một lần biên dịch shader.
 */

const rand = (seed) =>
{
    const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453
    return x - Math.floor(x)
}

/**
 * Bắn tia bám đất chia làm ngần này lát; mỗi khung hình chỉ một lát được bắn.
 *
 * ⚠️ Đã hạ 12 → 6 khi thêm cơ chế NẤP, rồi 6 → **4** khi nâng trần đàn quái lên
 * 30 con: con nhanh nhất đi 4,4 đơn vị/giây, mỗi 6 khung là gần một đơn vị —
 * đủ để lội qua mép nước rồi mới bị kéo lại, và bộ kiểm chụp đúng khoảnh khắc
 * đó. Bốn lát với 30 con là ~7,5 tia mỗi khung hình, vẫn rẻ.
 *
 * Lý do hạ lần đầu: trước đó quái đi THẲNG về phía xe,
 * gần như luôn trên đường phẳng; giờ chúng lảng vảng theo vòng tròn nên hay đi
 * vào bờ dốc và mép nước — 12 khung một lần đo là đủ để một con leo dốc mà cao
 * độ vẫn giữ giá trị cũ (đo được lệch 0,68) hoặc lội xuống nước cả nửa giây
 * trước khi bị kéo lại. Sáu lát là 26 con chia ra ~4,3 tia mỗi khung hình.
 */
const GROUND_SLICES = 4

export class SurvivalMonsters
{
    constructor(survival)
    {
        this.game = Game.getInstance()
        this.survival = survival

        this.monsters = []
        this.bloods = []
        this.pools = []

        /**
         * Tăng mỗi lần `clear()` xoá sạch đàn quái. `update()` chụp lại giá trị
         * này lúc bắt đầu và đối chiếu sau mỗi lần gọi ra ngoài — xem `clear()`.
         */
        this.generation = 0

        this.materials = new Map()
        this.boxGeometry = new THREE.BoxGeometry(1, 1, 1)
        this.sphereGeometry = new THREE.SphereGeometry(0.5, 8, 6)
        this.coneGeometry = new THREE.ConeGeometry(0.5, 1, 7)

        this.group = new THREE.Group()
        this.group.name = 'survivalMonsters'
        this.game.scene.add(this.group)

        this.seed = 1
        this.frame = 0

        this.setSounds()

        /** Dùng lại một véc-tơ thay vì cấp phát mới mỗi khung hình. */
        this.tmp = new THREE.Vector3()
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  ÂM THANH
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Tiếng của đàn quái — user tải về, đã cắt còn 0,45–2,2 giây mỗi tiếng.
     *
     * ⚠️ MỖI VAI CÓ NHIỀU BIẾN THỂ và chọn ngẫu nhiên. Một đàn ba mươi con mà
     * dùng chung đúng một tiếng gầm thì tai nghe ra ngay là một băng ghi âm
     * chạy vòng, và cảm giác "đàn quái" biến mất.
     *
     * ⚠️ `antiSpam` khác nhau theo vai: tiếng gầm để 0,45 (ba chục con cùng
     * gầm là thành tiếng ù), tiếng trúng đòn để 0,06 (bắn liên thanh phải nghe
     * từng phát trúng).
     */
    setSounds()
    {
        const register = (path, volume, fade, antiSpam) => this.game.audio.register({
            path,
            autoplay: false,
            loop: false,
            volume,
            antiSpam,
            positions: new THREE.Vector3(),
            distanceFade: fade,
            onPlay: (item, coordinates) =>
            {
                if(coordinates) item.positions[0].copy(coordinates)
                item.volume = 1
            },
        })

        this.sounds = {
            /**
             * ⚠️ `distanceFade` PHẢI NHỎ. Bản đầu để 42–55 và user nghe đúng
             * cái sai của nó: *"tiếng quái vật nghe liên hồi nhưng không thấy
             * con quái vật nào"*. Quái sinh trên vành 26–46 đơn vị, tức chúng
             * gầm ngay từ lúc còn ngoài tầm nhìn — tai bảo "chúng ở đây" mà mắt
             * không thấy gì, và cảm giác duy nhất còn lại là khó chịu.
             *
             * Nay tầm nghe khớp với tầm THẤY: gầm 20, rít 26 (tiếng báo động,
             * cho xa hơn một chút), bước chân 14. Con nào chưa vào tầm nhìn thì
             * cũng chưa nghe được.
             */
            growls: [ 1, 2, 3, 4 ].map(i => register(`sounds/survival/growl-${i}.mp3`, 0.35, 20, 0.6)),
            screeches: [ 1, 2 ].map(i => register(`sounds/survival/screech-${i}.mp3`, 0.4, 26, 0.9)),
            hits: [ 1, 2 ].map(i => register(`sounds/survival/hit-${i}.mp3`, 0.45, 24, 0.06)),
            deaths: [ 1, 2 ].map(i => register(`sounds/survival/death-${i}.mp3`, 0.42, 26, 0.15)),
            steps: [ 1, 2 ].map(i => register(`sounds/survival/step-${i}.mp3`, 0.16, 14, 0.05)),
            stepBoss: register('sounds/survival/step-boss.mp3', 0.5, 30, 0.2),
        }
    }

    /** Lấy ngẫu nhiên một biến thể rồi phát tại toạ độ. */
    playRandom(list, at)
    {
        if(!list?.length) return
        list[Math.floor(Math.random() * list.length)]?.play(at)
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  VẬT LIỆU & KHỐI
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

    /**
     * MẮT PHÁT SÁNG — `MeshBasicNodeMaterial` nên KHÔNG ăn ánh sáng cảnh: ban
     * đêm vẫn rực đúng màu đó. Đây là thứ duy nhất của con quái còn đọc được
     * khi trời tối hẳn, nên nó phải sáng thật chứ không phải "màu sáng".
     *
     * ⚠️ `toneMapped = false` là bắt buộc — không thì bộ ánh xạ tông kéo tụt
     * về xám như mọi bề mặt khác và mắt tắt ngóm.
     */
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

    // ═══════════════════════════════════════════════════════════════════════
    //  BA DÁNG QUÁI
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * BỌ BÒ — thân dẹt sát đất, BỐN chân gập kiểu nhện, một con mắt to.
     * Chân trước và chân sau đánh ngược pha nhau (dáng bò của côn trùng).
     */
    makeCrawler(spec, seed)
    {
        const c = spec.colors
        const root = new THREE.Group()
        const legs = []

        // Thân: bụng dẹt + mai gồ lên + đuôi nhọn
        this.part(root, 1.05, 0.42, 1.45, 0, 0.42, 0, c.body, this.sphereGeometry)
        this.part(root, 0.78, 0.3, 1.0, 0, 0.3, 0.05, c.belly, this.sphereGeometry)
        this.part(root, 0.34, 0.34, 0.6, 0, 0.36, -0.95, c.limb, this.coneGeometry, { x: -Math.PI * 0.5 })

        // Đầu chúi về trước + một mắt to
        const head = new THREE.Group()
        head.position.set(0, 0.44, 0.72)
        root.add(head)
        this.part(head, 0.62, 0.46, 0.6, 0, 0, 0, c.body, this.sphereGeometry)
        const eye = this.part(head, 0.34, 0.3, 0.24, 0, 0.06, 0.26, this.glowMaterial(c.eye), this.sphereGeometry)

        // Hai càng nhỏ trước miệng
        for(const side of [ -1, 1 ])
            this.part(head, 0.1, 0.1, 0.34, side * 0.16, -0.16, 0.3, c.limb, null, { x: 0.5 })

        // BỐN chân: đùi chĩa ngang ra rồi cẳng gập xuống — dáng nhện
        let i = 0
        for(const front of [ 1, -1 ])
        {
            for(const side of [ -1, 1 ])
            {
                const hip = new THREE.Group()
                hip.position.set(side * 0.42, 0.4, front * 0.42)
                root.add(hip)
                this.part(hip, 0.5, 0.12, 0.12, side * 0.25, 0.06, 0, c.limb)

                const knee = new THREE.Group()
                knee.position.set(side * 0.5, 0.06, 0)
                hip.add(knee)
                this.part(knee, 0.11, 0.44, 0.11, 0, -0.22, 0, c.limb)

                legs.push({ hip, knee, phase: (i % 2 === 0 ? 0 : Math.PI) + (front > 0 ? 0 : Math.PI) })
                i++
            }
        }

        return { root, legs, eyes: [ eye ], gait: 'crawl' }
    }

    /**
     * KẺ RÌNH — cao lêu nghêu, hai chân dài gập ngược như chân chim, hai tay
     * buông dài quá gối, đầu thuôn hai mắt.
     */
    makeStalker(spec, seed)
    {
        const c = spec.colors
        const root = new THREE.Group()
        const legs = []
        const arms = []

        // Hai chân dài, gối gập NGƯỢC (đầu gối chĩa về sau)
        for(const side of [ -1, 1 ])
        {
            const hip = new THREE.Group()
            hip.position.set(side * 0.16, 1.1, 0)
            root.add(hip)
            this.part(hip, 0.2, 0.6, 0.2, 0, -0.3, 0, c.limb)

            const knee = new THREE.Group()
            knee.position.set(0, -0.6, 0)
            hip.add(knee)
            this.part(knee, 0.16, 0.55, 0.16, 0, -0.27, 0, c.limb)
            // Bàn chân ba ngón
            for(const toe of [ -1, 0, 1 ])
                this.part(knee, 0.07, 0.07, 0.26, toe * 0.08, -0.53, 0.1, c.limb)

            legs.push({ hip, knee, phase: side > 0 ? 0 : Math.PI })
        }

        // Thân gầy, hơi chúi về trước
        const torso = new THREE.Group()
        torso.position.set(0, 1.12, 0)
        torso.rotation.x = 0.16
        root.add(torso)
        this.part(torso, 0.42, 0.34, 0.3, 0, 0.14, 0, c.body)
        this.part(torso, 0.5, 0.42, 0.32, 0, 0.5, 0, c.body)
        this.part(torso, 0.3, 0.36, 0.2, 0, 0.36, 0.14, c.belly)
        // Gai lưng
        for(let s = 0; s < 3; s++)
            this.part(torso, 0.1, 0.24 - s * 0.05, 0.1, 0, 0.62 - s * 0.2, -0.17, c.limb, this.coneGeometry)

        // Hai tay dài, khuỷu gập
        for(const side of [ -1, 1 ])
        {
            const shoulder = new THREE.Group()
            shoulder.position.set(side * 0.3, 0.62, 0)
            torso.add(shoulder)
            this.part(shoulder, 0.15, 0.46, 0.15, 0, -0.23, 0, c.limb)

            const elbow = new THREE.Group()
            elbow.position.set(0, -0.46, 0)
            shoulder.add(elbow)
            this.part(elbow, 0.13, 0.44, 0.13, 0, -0.22, 0, c.limb)
            // Bàn tay ba vuốt
            for(const claw of [ -1, 0, 1 ])
                this.part(elbow, 0.06, 0.2, 0.06, claw * 0.07, -0.5, 0, c.belly, this.coneGeometry, { x: Math.PI })

            arms.push({ shoulder, elbow, phase: side > 0 ? Math.PI : 0 })
        }

        // Đầu thuôn dài về trước, hai mắt
        const head = new THREE.Group()
        head.position.set(0, 0.86, 0.06)
        torso.add(head)
        this.part(head, 0.32, 0.34, 0.5, 0, 0, 0.06, c.body, this.sphereGeometry)
        this.part(head, 0.2, 0.16, 0.3, 0, -0.06, 0.28, c.belly, this.sphereGeometry)

        const eyes = []
        for(const side of [ -1, 1 ])
            eyes.push(this.part(head, 0.12, 0.14, 0.1, side * 0.1, 0.06, 0.2, this.glowMaterial(c.eye), this.sphereGeometry))

        return { root, legs, arms, torso, head, eyes, gait: 'walk' }
    }

    /**
     * QUÁI TO XÁC — vai rộng gấp đôi hông, hai càng nặng lê gần đất, chân ngắn
     * dày, ba mắt. Đi lắc lư chứ không sải bước.
     */
    makeBrute(spec, seed)
    {
        const c = spec.colors
        const root = new THREE.Group()
        const legs = []
        const arms = []

        // Chân ngắn, dày
        for(const side of [ -1, 1 ])
        {
            const hip = new THREE.Group()
            hip.position.set(side * 0.34, 0.78, 0)
            root.add(hip)
            this.part(hip, 0.36, 0.44, 0.4, 0, -0.22, 0, c.limb)

            const knee = new THREE.Group()
            knee.position.set(0, -0.44, 0)
            hip.add(knee)
            this.part(knee, 0.34, 0.38, 0.38, 0, -0.19, 0, c.limb)
            this.part(knee, 0.42, 0.16, 0.56, 0, -0.4, 0.08, c.body)

            legs.push({ hip, knee, phase: side > 0 ? 0 : Math.PI })
        }

        // Thân hình thang: hông hẹp, ngực bè
        const torso = new THREE.Group()
        torso.position.set(0, 0.8, 0)
        torso.rotation.x = 0.2
        root.add(torso)
        this.part(torso, 0.72, 0.4, 0.56, 0, 0.18, 0, c.limb)
        this.part(torso, 1.02, 0.62, 0.68, 0, 0.66, 0, c.body)
        this.part(torso, 0.66, 0.44, 0.3, 0, 0.6, 0.28, c.belly)
        // Vảy vai
        for(const side of [ -1, 1 ])
            this.part(torso, 0.42, 0.36, 0.5, side * 0.5, 0.86, 0, c.limb, this.sphereGeometry)

        // Hai càng nặng
        for(const side of [ -1, 1 ])
        {
            const shoulder = new THREE.Group()
            shoulder.position.set(side * 0.6, 0.82, 0)
            torso.add(shoulder)
            this.part(shoulder, 0.28, 0.52, 0.28, 0, -0.26, 0, c.limb)

            const elbow = new THREE.Group()
            elbow.position.set(0, -0.52, 0)
            shoulder.add(elbow)
            this.part(elbow, 0.3, 0.46, 0.3, 0, -0.23, 0, c.limb)
            // Càng: hai ngàm kẹp
            this.part(elbow, 0.34, 0.3, 0.24, 0, -0.5, 0.1, c.body)
            this.part(elbow, 0.12, 0.16, 0.34, -0.1, -0.58, 0.26, c.belly, this.coneGeometry, { x: Math.PI * 0.5 })
            this.part(elbow, 0.12, 0.16, 0.34, 0.1, -0.5, 0.26, c.belly, this.coneGeometry, { x: Math.PI * 0.5 })

            arms.push({ shoulder, elbow, phase: side > 0 ? Math.PI : 0 })
        }

        // Đầu lún vào giữa hai vai, ba mắt xếp ngang
        const head = new THREE.Group()
        head.position.set(0, 1.06, 0.12)
        torso.add(head)
        this.part(head, 0.56, 0.46, 0.56, 0, 0, 0, c.body, this.sphereGeometry)
        this.part(head, 0.42, 0.2, 0.3, 0, -0.14, 0.24, c.belly)
        // Hai sừng
        for(const side of [ -1, 1 ])
            this.part(head, 0.14, 0.34, 0.14, side * 0.2, 0.24, -0.06, c.limb, this.coneGeometry, { x: -0.4 })

        const eyes = []
        for(const side of [ -1, 0, 1 ])
            eyes.push(this.part(head, 0.13, 0.12, 0.1, side * 0.16, 0.08, 0.24, this.glowMaterial(c.eye), this.sphereGeometry))

        return { root, legs, arms, torso, head, eyes, gait: 'lumber' }
    }

    /**
     * DỰNG MỘT CON QUÁI TỪ MODEL THẬT — dùng chung cho cả bốn loại.
     *
     * User xem bản dựng bằng khối rồi chê thẳng *"quái vật còn ít và ngoại hình
     * xấu"*, nên nay mọi loại đều có `model` trỏ tới một resource glTF có xương.
     * Mã dựng bằng khối vẫn giữ nguyên và vẫn chạy khi model chưa nạp được.
     *
     * ─── CÁI GIÁ PHẢI TRẢ, VÀ VÌ SAO VẪN TRẢ ────────────────────────────────
     * Model có xương phải `SkeletonUtils.clone` (clone thường dùng CHUNG bộ
     * xương — mọi bản sao cử động y hệt và dính cứng vào nhau), và mỗi con là
     * một `AnimationMixer` cập nhật 82–126 khớp mỗi khung hình. Ba mươi con là
     * chừng 2.500 phép biến đổi ma trận mỗi khung.
     *
     * Chịu được vì đã chọn model theo SỐ LƯỢNG sẽ thả ra: loại đông nhất dùng
     * model 2.788 đỉnh, loại hiếm mới dùng model 28.500, và con 103.412 đỉnh
     * thì mỗi ván nhiều nhất một con.
     *
     * ─── CLIP THẾ NÀO ───────────────────────────────────────────────────────
     * Không model nào trong kho có vòng lặp "đi bộ" sạch — tất cả chỉ có MỘT
     * chuỗi dài 15–17 giây kiểu trình diễn. Chấp nhận: ở cỡ nhìn này cái mắt
     * đọc ra là "nó đang cựa quậy và tiến về phía mình", không phải "bước chân
     * có đúng nhịp không". `timeScale` lệch nhau theo từng con để cả đàn không
     * cử động y hệt như một khối.
     *
     * ⚠️ Trả về `null` nếu model chưa nạp được — chỗ gọi phải tự lùi về dáng
     * dựng bằng mã, không được để văng lỗi giữa lúc đang sinh quái.
     */
    /**
     * CHIỀU CAO THẬT của một model có xương, đo một lần rồi nhớ.
     *
     * ═══ VÌ SAO PHẢI CÓ HÀM NÀY ═══
     *
     * Lưới bọc xương KHÔNG nằm ở chỗ buffer `position` nói. Buffer giữ tư thế
     * NGHỈ; cái được vẽ ra là tư thế sau khi xương kéo từng đỉnh đi. Ba phép đo
     * quen thuộc đều đọc tư thế nghỉ nên đều mù:
     *
     *   · `Box3.setFromObject`     — còn nhân ma trận hai lần với lưới nằm dưới
     *                                xương; từng cho ra con trùm cao 1371
     *   · min/max của accessor      — chính là tư thế nghỉ
     *   · `geometry.boundingBox`    — cũng vậy
     *
     * `alien_soldier_wip.glb` khai 1,99 và đo hộp bao ra 1,332, nhưng lưới thật
     * lúc chạy cao **283** và vọt tới **427** giữa chu kỳ đi. Con quái crawler
     * phình ra che trọn khung nhìn — người chơi tả là "bóng đen to bay chập
     * chờn". Ba phiên không tìm ra vì mọi bộ kiểm đều đo lại đúng cái hộp bao
     * đã sai. Model đó nay đã bỏ.
     *
     * `applyBoneTransform()` là API DUY NHẤT nói được sự thật: nó áp đúng ma
     * trận xương mà GPU sẽ áp. Lấy mẫu vài tư thế rải khắp clip rồi lấy bao
     * ngoài của tất cả, nên số ra đúng cả với model biến dạng mạnh khi cử động.
     *
     * @returns {{ height: number, minY: number }} theo đơn vị gốc của model
     */
    measureSkinned(key, source)
    {
        this.measured ??= new Map()
        const cached = this.measured.get(key)
        if(cached) return cached

        const probe = cloneSkinned(source.scene)
        const clip = source.animations?.[0]
        const mixer = clip ? new THREE.AnimationMixer(probe) : null
        if(mixer) mixer.clipAction(clip).play()

        const v = new THREE.Vector3()
        let lo = Infinity
        let hi = -Infinity

        // Rải 6 mốc khắp clip: con quái vươn chi ở giữa nhịp chứ không phải lúc
        // đứng yên, và chính chỗ vươn đó mới quyết định nó có lòi ra ngoài không
        const samples = clip ? 6 : 1
        for(let s = 0; s < samples; s++)
        {
            if(mixer) mixer.setTime((s / samples) * clip.duration)
            probe.updateMatrixWorld(true)

            probe.traverse((child) =>
            {
                const position = child.geometry?.attributes?.position
                if(!position) return

                // Lấy mẫu thưa: cần bao ngoài, không cần từng đỉnh. 120 điểm đủ
                // bắt đầu-ngón-đuôi mà vẫn xong trong một phần nghìn giây
                const step = Math.max(1, Math.floor(position.count / 120))
                for(let i = 0; i < position.count; i += step)
                {
                    v.fromBufferAttribute(position, i)
                    if(child.isSkinnedMesh && child.applyBoneTransform) child.applyBoneTransform(i, v)
                    v.applyMatrix4(child.matrixWorld)
                    if(v.y < lo) lo = v.y
                    if(v.y > hi) hi = v.y
                }
            })
        }

        mixer?.stopAllAction()

        const result = Number.isFinite(lo) && hi > lo
            ? { height: hi - lo, minY: lo }
            : { height: 2, minY: 0 }

        this.measured.set(key, result)
        return result
    }

    makeModelMonster(spec)
    {
        const source = this.game.resources?.[spec.model]
        if(!source?.scene) return null

        const root = new THREE.Group()
        const model = cloneSkinned(source.scene)

        /**
         * Model cao bao nhiêu thì chưa biết — mỗi model một tỉ lệ. Đo hộp bao
         * rồi co về đúng chiều cao mong muốn, thay vì gõ cứng một con số chỉ
         * đúng với riêng file này.
         */
        /**
         * ⚠️ DÙNG SỐ ĐO TỪ FILE, KHÔNG ĐO LẠI TRONG CẢNH.
         *
         * Bản đầu gọi `new THREE.Box3().setFromObject(model)` ngay đây và nó
         * cho ra số VÔ NGHĨA với model có xương — lưới nằm dưới hierarchy xương
         * nên ma trận bị nhân hai lần. Hậu quả đo được: `skeleton` vỡ thành rìu
         * và sọ rời rạc, `bigboss` dựng ra cao **1371** rồi bay khỏi khung hình.
         * Xem bảng đối chiếu ở đầu `data/survival.js`.
         *
         * ⚠️ CHIA cho `spec.scale`: `add()` sẽ nhân cả nhóm gốc lên `spec.scale`
         * lần nữa. Quên phép chia là con trùm cao gấp `scale` lần mà không lỗi.
         */
        const { height, minY } = this.measureSkinned(spec.model, source)

        const wanted = spec.modelHeight / spec.scale
        const scale = wanted / height

        model.scale.setScalar(scale)
        // Kéo chân về đúng mặt đất: sau khi co, đáy model nằm ở `minY × scale`
        model.position.y = -minY * scale
        // Model quay mặt về +Z hay −Z là tuỳ người dựng; xoay nửa vòng cho khớp
        // quy ước của đàn quái (mặt về +Z, xem `heading`)
        model.rotation.y = Math.PI

        model.traverse((child) =>
        {
            if(!child.isMesh && !child.isSkinnedMesh) return
            child.castShadow = true
            child.receiveShadow = true
            // Bộ cắt theo hộp bao tính trên tư thế NGHỈ — con quái vung tay ra
            // ngoài hộp đó là biến mất từng mảng giữa lúc đánh nhau
            child.frustumCulled = false
        })

        // Giữ nguyên texture, chỉ chuyển sang hệ TSL — model tự ăn đúng ánh
        // sáng, sương mù và bóng đổ của game (đúng như city kit và tàu sân bay)
        this.game.materials.updateObject(model)

        /**
         * NHUỘM THEO LOÀI.
         *
         * Ba loại quái dùng chung một model (con lành duy nhất trong kho), nên
         * nếu không nhuộm thì đàn quái đọc ra là "một con ở ba cỡ". Nhân màu
         * gốc với `colors.body` giữ nguyên mọi chi tiết texture mà vẫn cho mỗi
         * loài một sắc riêng — crawler xanh bệnh, brute nâu gỉ, trùm tím sẫm.
         *
         * Nhân bản material trước: chúng dùng chung instance với model gốc, tô
         * thẳng là nhuộm luôn cả những con đã sinh ra trước đó.
         */
        const tint = new THREE.Color(spec.colors.body)
        model.traverse((child) =>
        {
            if(!child.material || !child.material.color) return
            child.material = child.material.clone()
            child.material.color.multiply(tint).multiplyScalar(1.9)
        })

        root.add(model)

        const mixer = new THREE.AnimationMixer(model)
        const clip = source.animations?.[0]
        if(clip)
        {
            const action = mixer.clipAction(clip)
            /**
             * Nhịp lệch nhau theo từng con — không có nó thì cả đàn cựa quậy y
             * hệt nhau cùng lúc, và mắt đọc ra ngay là "mấy bản sao", không
             * phải "một đàn". `this.seed` tăng mỗi lần sinh nên mỗi con một số.
             */
            action.timeScale = (0.45 + rand(this.seed * 5.7) * 0.5) * (spec.modelTimeScale ?? 1)
            // Vào clip ở chỗ ngẫu nhiên, cùng lý do
            action.time = rand(this.seed * 9.1) * (clip.duration || 1)
            action.play()
        }

        /**
         * Hai con mắt tự phát sáng gắn THÊM lên model.
         *
         * Model có mắt riêng của nó, nhưng mắt đó ăn ánh sáng cảnh nên tối om
         * trong đêm — mà "cặp mắt sáng trong đêm" chính là ngôn ngữ đã dùng cho
         * cả ba loại quái kia. Thiếu nó thì con trùm không cùng một họ.
         */
        const eyes = []
        for(const side of [ -1, 1 ])
        {
            const eye = new THREE.Mesh(this.sphereGeometry, this.glowMaterial(spec.colors.eye))
            // MỌI số đo theo `wanted` — cùng một hàm dựng dùng cho model cao
            // 1,85 lẫn model cao 6,2; gõ số tuyệt đối là mắt con nhỏ nằm ngoài
            // đầu còn mắt con to thì lọt trong ngực
            eye.scale.setScalar(wanted * 0.055)
            eye.position.set(side * wanted * 0.052, wanted * 0.86, wanted * 0.135)
            eye.castShadow = false
            root.add(eye)
            eyes.push(eye)
        }

        return { root, legs: [], arms: [], eyes, mixer, gait: 'model', model }
    }

    /**
     * Model thật nếu khai `spec.model` và nạp được; không thì lùi về dáng dựng
     * bằng khối. Chơi vẫn được, chỉ kém đẹp — và đó là điều quan trọng: một
     * file `.glb` 404 trên production không được phép làm chết cả chế độ chơi.
     */
    make(type, seed)
    {
        const spec = SURVIVAL_MONSTERS[type]

        if(spec.model)
        {
            const built = this.makeModelMonster(spec)
            if(built) return built

            if(!this.warnedModels?.has(spec.model))
            {
                this.warnedModels ??= new Set()
                this.warnedModels.add(spec.model)
                console.warn(`[Survival] không thấy \`resources.${spec.model}\` — "${spec.name}" dựng bằng khối`)
            }
        }

        if(type === 'crawler') return this.makeCrawler(spec, seed)
        if(type === 'brute' || type === 'boss') return this.makeBrute(spec, seed)
        return this.makeStalker(spec, seed)
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  SINH & THU HỒI
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Cao độ mặt đất tại (x, z) — bắn tia thẳng xuống, đúng cách của
     * `FptuDestruction.groundHeight()`.
     *
     * Tia hỏi thẳng thứ mà bánh xe đang chạm, nên đúng ở CẢ năm mảnh đất, trên
     * cầu, và trên boong tàu sân bay. Không hàm cao độ riêng nào của từng đảo
     * trả lời được cả năm chỗ đó. Trả `null` nếu không chạm gì.
     */
    groundHeight(x, z)
    {
        const world = this.game.physics?.world
        const RAPIER = this.game.RAPIER
        if(!world || !RAPIER) return null

        const from = 80

        try
        {
            if(!this.ray)
                this.ray = new RAPIER.Ray({ x, y: from, z }, { x: 0, y: -1, z: 0 })
            else
            {
                this.ray.origin.x = x
                this.ray.origin.y = from
                this.ray.origin.z = z
            }

            const hit = world.castRay(this.ray, from + 20, true)
            if(!hit) return null

            // Rapier đổi tên trường này giữa các bản (`toi` → `timeOfImpact`)
            const distance = hit.timeOfImpact ?? hit.toi
            if(typeof distance !== 'number') return null

            return from - distance
        }
        catch(error)
        {
            return null
        }
    }

    /** Chỗ này có phải đất khô không (không phải mặt biển, không phải lòng hồ). */
    isDry(x, z)
    {
        const height = this.groundHeight(x, z)
        if(height === null) return false

        const sea = this.game.water?.surfaceElevation ?? 0
        return height > sea + SURVIVAL_SPAWN.dryMargin
    }

    /**
     * Tìm một chỗ đất khô trên vành quanh (cx, cz) rồi thả một con xuống đó.
     * Trả `null` nếu thử đủ số lần vẫn không ra chỗ nào — gọi lại ở nhịp sau,
     * đừng chặn khung hình để tìm cho bằng được.
     */
    spawn(type, cx, cz)
    {
        const { minDistance, maxDistance, attempts } = SURVIVAL_SPAWN

        for(let i = 0; i < attempts; i++)
        {
            this.seed++
            const angle = rand(this.seed * 3.1) * Math.PI * 2
            const distance = minDistance + rand(this.seed * 5.7) * (maxDistance - minDistance)
            const x = cx + Math.cos(angle) * distance
            const z = cz + Math.sin(angle) * distance

            const y = this.groundHeight(x, z)
            if(y === null) continue

            const sea = this.game.water?.surfaceElevation ?? 0
            if(y <= sea + SURVIVAL_SPAWN.dryMargin) continue

            /**
             * ⚠️ Truyền chỗ xe vào làm "chỗ thấy lần cuối".
             *
             * Không có nó thì chế độ TỰ BẾ TẮC, và bế tắc lặng lẽ: quái sinh
             * trên vành 26–46 đơn vị, mà tầm phát hiện chỉ 17 (đèn tắt) đến ~32
             * (đèn bật) — nghĩa là phần lớn số con **sinh ra đã ở ngoài tầm**,
             * chưa từng thấy xe lần nào, nên chúng lấy chỗ đang đứng làm mốc và
             * lảng vảng tại chỗ **vĩnh viễn**. Sóng không bao giờ hết, người
             * chơi ngồi đợi mà không hiểu vì sao.
             *
             * Đặt mốc là chỗ xe lúc sinh thì chúng kéo về phía đó — vào tầm là
             * bám thật, còn nếu người chơi đã bỏ đi và tắt đèn thì chúng mò
             * quanh chỗ cũ. Đúng cả luật chơi lẫn cảm giác: sóng mới nổi lên là
             * chúng biết *đại khái* bạn ở đâu, chứ không phải biết chính xác.
             */
            return this.add(type, x, y, z, cx, cz)
        }

        return null
    }

    add(type, x, y, z, knownX = undefined, knownZ = undefined)
    {
        const spec = SURVIVAL_MONSTERS[type]
        this.seed++

        const built = this.make(type, this.seed)
        const scale = spec.scale * (0.9 + rand(this.seed * 7.3) * 0.2)

        built.root.scale.setScalar(scale)
        built.root.position.set(x, y, z)
        this.group.add(built.root)

        const monster = {
            ...built,
            type,
            spec,
            scale,
            hp: spec.hp,
            maxHp: spec.hp,
            /** Vận tốc thật sau khi cộng lực tránh nhau — dùng lại để xoay thân. */
            heading: rand(this.seed * 11.9) * Math.PI * 2,
            phase: rand(this.seed * 13.3) * Math.PI * 2,
            groundY: y,
            /** Cao độ nền đã làm mượt — xem chú thích ở `update()`. */
            smoothY: y,
            /**
             * Chỗ KHÔ cuối cùng nó đứng. Điểm sinh luôn khô (đã kiểm trong
             * `spawn()`) nên khởi tạo bằng chính nó — xem phần bám đất trong
             * `update()` để biết vì sao cần.
             */
            dryX: x,
            dryZ: z,
            /** > 0 nghĩa là vừa chạm nước — kiểm mặt đất mỗi khung, xem `update()`. */
            waterCooldown: 0,
            /** Chỗ nó tưởng người chơi đang ở — xem chú thích trong `spawn()`. */
            lastSeenX: knownX,
            lastSeenZ: knownZ,
            lostFor: 0,
            sees: false,
            /** Lát bắn tia của con này (xem `GROUND_SLICES`). */
            slice: this.monsters.length % GROUND_SLICES,
            dead: false,
            deathAge: 0,
            /** Bị húc xong thì miễn nhiễm một nhịp ngắn, xem `SURVIVAL_PLAYER`. */
            ramCooldown: 0,
            /** Đang bám vào xe và gặm — dùng để nhịp tấn công không liên tục. */
            attackCooldown: 0,
            /** Nhấp nháy đỏ khi vừa ăn đòn. */
            flash: 0,
        }

        this.monsters.push(monster)
        return monster
    }

    get aliveCount()
    {
        let n = 0
        for(const m of this.monsters) if(!m.dead) n++
        return n
    }

    /**
     * Dọn sạch — tắt chế độ, thua, hoặc bấm Reset.
     *
     * ⚠ Hàm này HAY ĐƯỢC GỌI TỪ GIỮA `update()`: quái cắn trúng → `onReach()` →
     * `Survival.hurt()` → máu về 0 → `defeat()` → `clear()`. Lúc đó vòng lặp
     * trong `update()` vẫn đang chạy dở và mọi chỉ số của nó vừa trở thành rác.
     * Tăng `generation` để vòng lặp đó nhận ra mà thoát ngay.
     */
    clear()
    {
        this.generation++

        for(const m of this.monsters)
            this.group.remove(m.root)
        this.monsters.length = 0

        for(const b of this.bloods)
            this.game.scene.remove(b.mesh)
        this.bloods.length = 0

        for(const p of this.pools)
            this.game.scene.remove(p.mesh)
        this.pools.length = 0
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  ĂN ĐÒN
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Trúng đòn. Trả `true` nếu đòn này giết được nó.
     *
     * @param from hướng đòn tới, để hất con quái ngã đúng chiều
     */
    hit(monster, amount, fromX = null, fromZ = null)
    {
        if(monster.dead) return false

        monster.hp -= amount
        monster.flash = 1

        const at = monster.root.position
        this.playRandom(this.sounds.hits, at)
        this.spawnBlood(at.x, at.y + monster.spec.hitHeight * monster.scale, at.z, SURVIVAL_BLOOD.hitDrops, monster.scale)

        if(monster.hp > 0)
            return false

        this.kill(monster, fromX, fromZ)
        return true
    }

    kill(monster, fromX = null, fromZ = null)
    {
        if(monster.dead) return

        monster.dead = true
        monster.deathAge = 0

        const at = monster.root.position

        // Hất ngã theo chiều đòn tới; không biết chiều thì ngã sấp về trước
        const away = (fromX === null || fromZ === null)
            ? monster.heading
            : Math.atan2(at.x - fromX, at.z - fromZ)

        monster.deathDriftX = Math.sin(away) * (1.6 + rand(this.seed++ * 3.7) * 2.4)
        monster.deathDriftZ = Math.cos(away) * (1.6 + rand(this.seed++ * 5.1) * 2.4)
        monster.deathSpin = (rand(this.seed++ * 7.9) - 0.5) * 3.4

        this.playRandom(this.sounds.deaths, at)
        this.spawnBlood(at.x, at.y + monster.spec.hitHeight * monster.scale, at.z, SURVIVAL_BLOOD.deathDrops, monster.scale * 1.4)
        this.spawnPool(at.x, monster.groundY, at.z, monster.scale)

        this.survival.onMonsterKilled(monster)
    }

    /**
     * SÁT THƯƠNG VÙNG — `VehicleRocket.detonate()` gọi vào đây.
     *
     * Giảm dần từ tâm ra mép, giống hệt cách hệ phá huỷ tính: trúng ngay tâm
     * thì con to xác cũng gục, trúng rìa thì chỉ sứt.
     */
    damageAround(center, radius, power = 1)
    {
        let killed = 0

        for(const m of this.monsters)
        {
            if(m.dead) continue

            const distance = Math.hypot(m.root.position.x - center.x, m.root.position.z - center.z)
            if(distance > radius) continue

            const falloff = 1 - (distance / radius) * 0.7
            if(this.hit(m, power * 3 * falloff, center.x, center.z))
                killed++
        }

        return killed
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  MÁU ĐEN
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Giọt máu bắn ra — khối nhỏ bay theo trọng lực rồi tan.
     *
     * Cố ý KHÔNG dùng tấm khói loang của `VehicleRocket`: máu phải là những
     * giọt rời đọc ra được, khói mới cần mép tan. Tấm loang màu đen ở đây trông
     * như một vết bẩn trên ống kính.
     */
    spawnBlood(x, y, z, count, scale = 1)
    {
        for(let i = 0; i < count; i++)
        {
            this.seed++
            const mesh = new THREE.Mesh(
                this.sphereGeometry,
                this.material(i % 4 === 0 ? SURVIVAL_BLOOD.mistColor : SURVIVAL_BLOOD.color),
            )
            const s = (0.07 + rand(this.seed * 3.3) * 0.1) * scale
            mesh.scale.setScalar(s)
            mesh.position.set(x, y, z)
            mesh.castShadow = false
            mesh.receiveShadow = false
            this.game.scene.add(mesh)

            const angle = rand(this.seed * 5.9) * Math.PI * 2
            const speed = (1.4 + rand(this.seed * 7.1) * 3.4) * scale

            this.bloods.push({
                mesh,
                vx: Math.cos(angle) * speed,
                vz: Math.sin(angle) * speed,
                vy: (2.2 + rand(this.seed * 9.3) * 3.2) * scale,
                age: 0,
                life: SURVIVAL_BLOOD.life * (0.8 + rand(this.seed * 11.7) * 0.5),
                baseScale: s,
            })
        }
    }

    /** Vũng máu đọng lại chỗ nó gục — bằng chứng rằng mình đã đi qua đây. */
    spawnPool(x, groundY, z, scale)
    {
        this.seed++

        const mesh = new THREE.Mesh(this.sphereGeometry, this.material(SURVIVAL_BLOOD.color))
        const s = (0.9 + rand(this.seed * 3.7) * 0.5) * scale
        mesh.scale.set(s, 0.02, s * 0.85)
        // Nhấc khỏi mặt đất một chút, không thì tranh nhau chiều sâu với nền —
        // đúng cái bẫy z-fighting đã trả giá ở khu thành phố
        mesh.position.set(x, groundY + 0.03, z)
        mesh.rotation.y = rand(this.seed * 5.3) * Math.PI
        mesh.castShadow = false
        mesh.receiveShadow = false
        this.game.scene.add(mesh)

        this.pools.push({ mesh, age: 0, life: SURVIVAL_BLOOD.poolLife, baseScale: s })
    }

    updateBlood(delta)
    {
        for(let i = this.bloods.length - 1; i >= 0; i--)
        {
            const b = this.bloods[i]
            b.age += delta

            if(b.age >= b.life)
            {
                this.game.scene.remove(b.mesh)
                this.bloods.splice(i, 1)
                continue
            }

            b.vy -= 14 * delta
            b.mesh.position.x += b.vx * delta
            b.mesh.position.y += b.vy * delta
            b.mesh.position.z += b.vz * delta

            // Teo dần ở nửa sau đời
            const t = b.age / b.life
            if(t > 0.5)
                b.mesh.scale.setScalar(b.baseScale * (1 - (t - 0.5) * 2))
        }

        for(let i = this.pools.length - 1; i >= 0; i--)
        {
            const p = this.pools[i]
            p.age += delta

            if(p.age >= p.life)
            {
                this.game.scene.remove(p.mesh)
                this.pools.splice(i, 1)
                continue
            }

            const t = p.age / p.life
            // Loang ra rồi mờ đi
            const spread = p.baseScale * (1 + Math.min(1, t * 4) * 0.5)
            p.mesh.scale.set(spread, 0.02, spread * 0.85)
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  MỖI KHUNG HÌNH
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * @param target    vị trí xe
     * @param onReach   gọi khi một con chạm tới xe — `Survival` trừ máu ở đó
     * @param sightRange tầm phát hiện HIỆN TẠI, do `Survival` tính từ đèn pha và
     *                   tốc độ xe. Xa hơn thế thì quái mất dấu — xem `updateSight`.
     */
    update(delta, target, onReach, sightRange = Infinity)
    {
        this.frame++
        this.updateBlood(delta)

        const slice = this.frame % GROUND_SLICES

        // Đàn quái có thể bị xoá sạch TỪ BÊN TRONG vòng lặp dưới đây — xem `clear()`
        const generation = this.generation

        for(let i = this.monsters.length - 1; i >= 0; i--)
        {
            const m = this.monsters[i]
            if(!m) break

            // ── Đã chết: ngã đổ rồi chìm xuống đất và biến mất ──────────────
            if(m.dead)
            {
                m.deathAge += delta

                if(m.deathAge > 3.2)
                {
                    this.group.remove(m.root)
                    this.monsters.splice(i, 1)
                    continue
                }

                const fall = Math.min(1, m.deathAge / 0.55)
                const drift = 1 - fall
                m.root.position.x += m.deathDriftX * delta * drift
                m.root.position.z += m.deathDriftZ * delta * drift

                m.root.rotation.x = fall * Math.PI * 0.5
                m.root.rotation.y = m.heading + m.deathSpin * fall
                m.root.position.y = m.groundY + Math.sin(fall * Math.PI) * 0.4 * m.scale - fall * 0.1

                // Hai giây cuối: chìm dần xuống đất cho khỏi chất đống xác
                if(m.deathAge > 1.6)
                    m.root.position.y -= (m.deathAge - 1.6) * 0.5

                continue
            }

            if(m.ramCooldown > 0) m.ramCooldown -= delta
            if(m.attackCooldown > 0) m.attackCooldown -= delta
            if(m.flash > 0) m.flash = Math.max(0, m.flash - delta * 3)

            const position = m.root.position
            const toX = target.x - position.x
            const toZ = target.z - position.z
            const distance = Math.hypot(toX, toZ)

            /**
             * ── Quá xa thì thu hồi, để `Survival` sinh lại gần xe ────────────
             *
             * Và phải BÁO LẠI, không thì lái xe chạy vòng vòng là xoá sạch sóng
             * mà không cần giết con nào: đàn quái rớt lại phía sau, bị thu hồi
             * lặng lẽ, và sóng tự tuyên bố hoàn thành. `onMonsterEscaped()` trả
             * suất đó về hàng chờ nên chúng sinh lại ở chỗ mới của xe.
             */
            if(distance > SURVIVAL_SPAWN.despawnDistance)
            {
                this.group.remove(m.root)
                this.monsters.splice(i, 1)
                if(!m.dead) this.survival.onMonsterEscaped()
                if(generation !== this.generation) return
                continue
            }

            // ── Có đang thấy xe không, và nếu không thì đi đâu ────────────────
            const goal = this.updateSight(m, target, distance, sightRange, delta)

            const goalX = goal.x - position.x
            const goalZ = goal.z - position.z
            const goalDistance = Math.hypot(goalX, goalZ)

            let dirX = goalX / (goalDistance || 1)
            let dirZ = goalZ / (goalDistance || 1)

            const separation = this.separationFor(m, i)
            dirX += separation.x
            dirZ += separation.z

            const length = Math.hypot(dirX, dirZ) || 1
            dirX /= length
            dirZ /= length

            const reach = (m.spec.radius + 1.4) * m.scale
            // Chỉ CẮN được khi thật sự thấy xe — mò trúng chỗ tối mà vẫn đớp
            // được thì cơ chế nấp thành vô nghĩa
            const arrived = m.sees && distance < reach

            if(arrived)
            {
                // Tới nơi rồi: bám vào và gặm, không đi xuyên qua xe
                if(m.attackCooldown <= 0)
                {
                    m.attackCooldown = 0.6
                    onReach(m)

                    // Cú cắn đó có thể vừa hạ gục người chơi, và `defeat()` đã
                    // gọi `clear()` — mảng rỗng, `i` thành rác. Thoát ngay.
                    if(generation !== this.generation) return
                }
            }
            else if(goalDistance > 0.6)
            {
                const speed = m.spec.speed * (m.sees ? 1 : SURVIVAL_STEALTH.wanderSpeedFactor)
                position.x += dirX * speed * delta
                position.z += dirZ * speed * delta

                const before = m.phase
                m.phase += delta * speed * (m.gait === 'crawl' ? 4.2 : 2.9)

                /**
                 * BƯỚC CHÂN theo đúng nhịp chân — phát mỗi khi pha đi qua bội
                 * số của π (một sải chân). Đếm theo pha chứ không theo đồng hồ:
                 * con chạy nhanh thì bước dồn, con lảng vảng thì thưa, tự khớp.
                 */
                if(distance < 16 && Math.floor(before / Math.PI) !== Math.floor(m.phase / Math.PI))
                {
                    if(m.spec.isBoss) this.sounds.stepBoss?.play(position)
                    else this.playRandom(this.sounds.steps, position)
                }
            }

            /**
             * GẦM GỪ trong lúc đuổi — thưa thớt và ngẫu nhiên.
             *
             * ⚠️ Xác suất phải RẤT nhỏ (0,25%/khung ≈ một tiếng mỗi 13 giây cho
             * mỗi con). Ba mươi con mà con nào cũng gầm đều đặn thì thành một
             * bức tường tiếng ồn liên tục, không còn dọa được ai.
             */
            /**
             * ⚠️ Chỉ gầm khi ĐÃ VÀO TẦM NHÌN CỦA MẮT (18 đơn vị). `distanceFade`
             * chỉ làm nhỏ tiếng chứ không tắt hẳn, nên con ở 40 đơn vị vẫn nghe
             * lí nhí — ba chục con lí nhí là một tiếng rì rầm liên tục không rõ
             * từ đâu. Chặn thẳng ở đây thì tiếng nào cũng có một con để nhìn.
             */
            if(m.sees && !m.dead && distance < 18 && Math.random() < 0.0035)
                this.playRandom(this.sounds.growls, position)

            // ── Xoay thân về hướng đi, xoay MỀM chứ không giật ───────────────
            const wanted = Math.atan2(dirX, dirZ)
            let diff = wanted - m.heading
            while(diff > Math.PI) diff -= Math.PI * 2
            while(diff < -Math.PI) diff += Math.PI * 2
            m.heading += diff * Math.min(1, delta * 7)
            m.root.rotation.y = m.heading

            /**
             * ── Bám mặt đất — chỉ bắn tia ở lát của mình ─────────────────────
             *
             * Và ĐÂY cũng là chỗ giữ chúng trên cạn. Kiểm tra chỗ khô lúc SINH
             * là chưa đủ: con quái sinh trên bãi rồi cứ nhắm thẳng hướng xe mà
             * đi, gặp mép nước là lội thẳng ra biển. Bộ kiểm bắt được đúng một
             * con làm thế.
             *
             * Cách chặn rẻ nhất: mỗi lần bắn tia, nếu chỗ đang đứng đã ướt thì
             * kéo về điểm khô cuối cùng và bẻ ngang hướng đi — nó tự men theo
             * bờ. Không tốn thêm một tia nào so với trước.
             */
            /**
             * ⚠️ CON NÀO VỪA CHẠM NƯỚC THÌ KIỂM MỖI KHUNG, không đợi tới lượt.
             *
             * Chỉ chia lát đều thôi là chưa đủ: con nhanh nhất đi 4,4 đơn vị/
             * giây, và ở mép nước thì bị kéo về rồi lại lao xuống ngay giữa hai
             * lần đo — bộ kiểm bắt được 2–3 con ướt cùng lúc khi trần đàn lên
             * 30. Cho riêng những con đang ở mép nước một "thẻ ưu tiên" trong
             * 2,5 giây thì chỉ vài con tốn tia mỗi khung, chứ không phải cả đàn.
             */
            if(m.waterCooldown > 0) m.waterCooldown -= delta

            if(m.slice === slice || m.waterCooldown > 0)
            {
                const y = this.groundHeight(position.x, position.z)

                if(y !== null)
                {
                    const sea = this.game.water?.surfaceElevation ?? 0

                    if(y > sea + SURVIVAL_SPAWN.dryMargin)
                    {
                        m.groundY = y
                        m.dryX = position.x
                        m.dryZ = position.z
                    }
                    else if(m.dryX !== undefined)
                    {
                        /**
                         * Kéo về chỗ khô cuối cùng RỒI LÙI THÊM một quãng theo
                         * hướng ngược hướng đang đi. Chỉ kéo về đúng điểm cũ là
                         * chưa đủ — điểm đó thường chỉ cách mép nước vài phân,
                         * nên bước sau nó lại lội xuống ngay.
                         */
                        position.x = m.dryX - dirX * 1.6
                        position.z = m.dryZ - dirZ * 1.6

                        // Bẻ ngang chứ không quay đầu hẳn: quay đầu thì nó chạy
                        // ngược ra xa xe rồi lại vòng vào đúng chỗ cũ
                        m.heading += Math.PI * 0.5
                        m.waterCooldown = 2.5
                    }
                    else
                    {
                        m.groundY = y
                    }
                }
            }

            /**
             * Trượt dần tới cao độ mới thay vì nhảy cóc mỗi lần bắn tia (tia
             * chỉ bắn lại 12 khung một lần, nhảy thẳng là thấy giật).
             *
             * ⚠️ Giữ cao độ nền RIÊNG trong `smoothY` chứ đừng nội suy thẳng
             * trên `position.y`: nhịp nhún của bước chân cũng ghi vào `position.y`,
             * hai thứ chồng lên nhau thì phép nội suy ăn mất nửa cái nhún và
             * dáng đi đờ ra.
             */
            /**
             * Chênh nhiều thì NHẢY THẲNG, chênh ít mới trượt dần.
             *
             * Chỉ trượt dần thôi là không đủ: xuống một bờ dốc, cao độ nền tụt
             * cả mét một lúc, và phép nội suy mềm để con quái treo lơ lửng trên
             * không suốt gần một giây. Mềm là để giấu chỗ nhảy cóc nhỏ giữa hai
             * lần bắn tia, không phải để đuổi theo địa hình.
             */
            const gap = m.groundY - m.smoothY
            if(Math.abs(gap) > 0.8) m.smoothY = m.groundY
            else m.smoothY += gap * Math.min(1, delta * 12)

            position.y = m.smoothY

            this.animate(m, arrived, delta)
        }
    }

    /**
     * ═══════════════════════════════════════════════════════════════════════
     *  THẤY / MẤT DẤU — trái tim của cơ chế NẤP
     * ═══════════════════════════════════════════════════════════════════════
     *
     * Trả về ĐIỂM ĐÍCH mà con này đang đi tới:
     *  - Đang thấy xe        → chính chiếc xe.
     *  - Vừa mất dấu         → chỗ thấy lần cuối; tới nơi thì lục lọi quanh đó.
     *  - Quá `memory` giây   → bỏ cuộc, tản đi lang thang.
     *
     * ⚠️ Ba chi tiết nhỏ mà thiếu là hỏng cả cơ chế:
     *
     * 1. **Nhớ chỗ CŨ, không nhớ hướng.** Nhớ hướng thì chúng đi thẳng mãi ra
     *    khỏi bản đồ; nhớ một ĐIỂM thì chúng dồn về đó và tản ra quanh — đúng
     *    dáng "mất dấu con mồi" mà mắt đọc được ngay từ trên cao.
     * 2. **Điểm lục lọi phải ĐỔI theo thời gian**, không thì cả đàn đứng chết
     *    một chỗ tại `lastSeen`. Ở đây quay quanh nó theo một pha riêng của
     *    từng con.
     * 3. **Có trễ khi bắt lại dấu** (`sees` bật ngay nhưng `lostFor` chỉ reset
     *    khi thật sự thấy) — bật/tắt liên tục ngay rìa tầm thì cả đàn giật cục.
     */
    updateSight(monster, target, distance, sightRange, delta)
    {
        const range = (monster.spec.isBoss && SURVIVAL_STEALTH.bossAlwaysSees)
            ? Infinity
            : Math.max(sightRange, SURVIVAL_STEALTH.alwaysSeeRange)

        const sawBefore = monster.sees
        monster.sees = distance <= range

        if(monster.sees)
        {
            /**
             * VỪA BẮT ĐƯỢC DẤU → rít lên một tiếng.
             *
             * Đây là tiếng quan trọng nhất của cả chế độ: nó báo cho người chơi
             * biết "mình vừa bị phát hiện" đúng vào khoảnh khắc điều đó xảy ra.
             * Không có nó thì cơ chế nấp chỉ đọc được qua dòng chữ trên HUD.
             */
            if(!sawBefore && distance < 24)
                this.playRandom(this.sounds.screeches, monster.root.position)

            monster.lostFor = 0
            monster.lastSeenX = target.x
            monster.lastSeenZ = target.z
            return target
        }

        monster.lostFor = (monster.lostFor ?? 0) + delta

        // Chưa từng thấy lần nào (sinh ra lúc người chơi đã nấp sẵn) — lấy chỗ
        // mình đang đứng làm mốc để khỏi bị kéo về gốc toạ độ
        if(monster.lastSeenX === undefined)
        {
            monster.lastSeenX = monster.root.position.x
            monster.lastSeenZ = monster.root.position.z
        }

        const wanderAngle = this.game.ticker.elapsed * 0.55 + monster.phase
        const radius = SURVIVAL_STEALTH.wanderRadius
            * (monster.lostFor > SURVIVAL_STEALTH.memory ? 2.2 : 1)

        this.tmp.set(
            monster.lastSeenX + Math.cos(wanderAngle) * radius,
            monster.root.position.y,
            monster.lastSeenZ + Math.sin(wanderAngle) * radius,
        )

        return this.tmp
    }

    /**
     * Lực đẩy khỏi những con đứng sát — không có nó thì cả đàn chồng khít lên
     * nhau thành MỘT con, vì tất cả cùng chạy về một điểm.
     *
     * Chỉ xét vài con quanh mình trong danh sách (đủ để chúng tản ra) — so từng
     * cặp trong 26 con là 325 phép đo mỗi khung hình mà mắt không thấy khác gì.
     */
    separationFor(monster, index)
    {
        let x = 0
        let z = 0

        const count = this.monsters.length
        for(let step = 1; step <= 4; step++)
        {
            const other = this.monsters[(index + step * 3) % count]
            if(!other || other === monster || other.dead) continue

            const dx = monster.root.position.x - other.root.position.x
            const dz = monster.root.position.z - other.root.position.z
            const distance = Math.hypot(dx, dz)

            const want = (monster.spec.radius * monster.scale + other.spec.radius * other.scale) * 1.6
            if(distance >= want || distance === 0) continue

            const push = (want - distance) / want
            x += (dx / distance) * push * 1.5
            z += (dz / distance) * push * 1.5
        }

        return { x, z }
    }

    /**
     * Nhịp cử động. Ba dáng khác nhau — đây là thứ phân biệt ba loại quái từ
     * xa, còn rõ hơn cả hình khối.
     */
    animate(monster, attacking, delta)
    {
        const swing = Math.sin(monster.phase)
        const swingB = Math.sin(monster.phase + Math.PI)

        /**
         * ── Dựng từ MODEL: hoạt ảnh do `AnimationMixer` lo ───────────────────
         *
         * Không có khớp nào để xoay ở đây — bộ xương 78 khớp đã được clip điều
         * khiển. Việc duy nhất còn lại là cho mixer chạy, và chỉ chạy khi con
         * quái CÒN SỐNG: chết rồi thì nhánh ngã đổ trong `update()` xoay cả
         * nhóm gốc, mà mixer vẫn chạy thì nó vừa nằm vừa bước, trông như lỗi.
         */
        if(monster.gait === 'model')
        {
            monster.mixer?.update(delta)

            // Nhún nhẹ theo bước để nó không trôi phẳng lì trên mặt đất
            monster.root.position.y += Math.abs(swing) * 0.05 * monster.scale
            monster.phase += delta * 1.6

            this.updateEyes(monster, delta)
            return
        }

        if(monster.gait === 'crawl')
        {
            // Bò: bốn chân đạp lệch pha, thân nhấp nhô sát đất
            for(const leg of monster.legs)
            {
                const s = Math.sin(monster.phase + leg.phase)
                leg.hip.rotation.y = s * 0.5
                leg.knee.rotation.z = Math.max(0, -s) * 0.6
            }
            monster.root.position.y += Math.abs(swing) * 0.05 * monster.scale
        }
        else if(monster.gait === 'lumber')
        {
            // Lê bước: chân nhấc thấp, thân LẮC NGANG theo bước — cái lắc đó là
            // thứ làm nó nặng nề
            for(const leg of monster.legs)
            {
                const s = Math.sin(monster.phase + leg.phase)
                leg.hip.rotation.x = s * 0.42
                leg.knee.rotation.x = Math.max(0, -s) * 0.5
            }
            for(const arm of monster.arms)
            {
                const s = Math.sin(monster.phase + arm.phase)
                arm.shoulder.rotation.x = s * 0.3
                arm.elbow.rotation.x = -0.4 - Math.max(0, s) * 0.3
            }
            monster.torso.rotation.z = swing * 0.12
            monster.root.position.y += Math.abs(swing) * 0.06 * monster.scale
        }
        else
        {
            // Sải bước: chân dài đánh rộng, tay đánh ngược pha
            for(const leg of monster.legs)
            {
                const s = Math.sin(monster.phase + leg.phase)
                leg.hip.rotation.x = s * 0.72
                leg.knee.rotation.x = -Math.max(0, -s) * 0.9
            }
            for(const arm of monster.arms)
            {
                const s = Math.sin(monster.phase + arm.phase)
                arm.shoulder.rotation.x = s * 0.55
                arm.elbow.rotation.x = -0.35 - Math.max(0, s) * 0.4
            }
            monster.torso.rotation.z = swing * 0.07
            monster.root.position.y += Math.abs(swing) * 0.045 * monster.scale
        }

        // ── Đang gặm xe: vung càng/tay về trước liên tục ─────────────────────
        if(attacking && monster.arms)
        {
            const strike = Math.sin(this.game.ticker.elapsed * 11)
            for(const arm of monster.arms)
            {
                arm.shoulder.rotation.x = -0.6 - strike * 0.5
                arm.elbow.rotation.x = -0.2 + strike * 0.4
            }
        }

        this.updateEyes(monster, delta)
    }

    /** Mắt: nhấp nháy khi ăn đòn, nheo lại khi mất dấu. Dùng chung cho cả bốn loại. */
    updateEyes(monster, delta)
    {
        // ── Mắt nhấp nháy khi vừa ăn đòn ─────────────────────────────────────
        if(monster.flash > 0)
        {
            const on = Math.sin(this.game.ticker.elapsed * 40) > 0
            for(const eye of monster.eyes)
                eye.visible = on
        }
        else if(monster.eyes[0] && !monster.eyes[0].visible)
        {
            for(const eye of monster.eyes)
                eye.visible = true
        }

        /**
         * ── MẮT NHEO LẠI KHI MẤT DẤU ─────────────────────────────────────────
         *
         * Người chơi phải ĐỌC ĐƯỢC là mình đang nấp thành công, nếu không thì
         * tắt đèn xong chỉ biết ngồi đoán. Mắt là thứ duy nhất của con quái còn
         * nhìn rõ trong đêm, nên nó cũng là chỗ duy nhất báo tin được.
         *
         * Thu nhỏ chứ không đổi màu: vật liệu mắt dùng CHUNG cho cả đàn theo mã
         * màu (gom trong `Map` để đỡ biên dịch shader), đổi màu một con là đổi
         * màu tất cả.
         */
        const wanted = monster.sees === false ? 0.45 : 1
        if(monster.eyeScale === undefined) monster.eyeScale = 1
        if(Math.abs(monster.eyeScale - wanted) > 0.01)
        {
            monster.eyeScale += (wanted - monster.eyeScale) * Math.min(1, delta * 6)
            for(const eye of monster.eyes)
            {
                if(!eye.userData.baseScale)
                    eye.userData.baseScale = eye.scale.clone()
                eye.scale.copy(eye.userData.baseScale).multiplyScalar(monster.eyeScale)
            }
        }
    }
}
