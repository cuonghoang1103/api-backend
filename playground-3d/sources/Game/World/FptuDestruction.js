import * as THREE from 'three/webgpu'
import { color, texture as textureNode } from 'three/tsl'
import { Game } from '../Game.js'
import { Events } from '../Events.js'
import { MeshDefaultMaterial } from '../Materials/MeshDefaultMaterial.js'

/**
 * HỆ PHÁ HUỶ KHU TRƯỜNG — bắn tới đâu phá tới đó.
 *
 * Bật/tắt và trả nguyên trạng ở mục "Destruction" trong bảng Cài đặt.
 *
 * ─── PHÁ CÁI GÌ ───
 *  - NHÀ: vỡ DẦN từng mảng. Nhà vốn đã ghép từ hàng chục khối rời (tường, mái,
 *    lan can, đố cửa) nên chỉ cần phá theo bán kính là tự ra hiệu ứng sập từng
 *    mảng — mảng gần tâm nổ đổ trước, mảng xa còn đứng, bắn thêm phát nữa mới đi.
 *  - CÂY: gãy — thân đổ nghiêng rồi chìm, tán lá tan.
 *  - NƯỚC: bắn xuống hồ hay xuống biển thì tung toé, có cột nước, giọt bắn và
 *    vòng sóng loang trên mặt nước.
 *  - THIÊN NGA: trúng thì lật ngửa và chìm.
 *
 * ─── BA ĐIỀU ĐÃ NÉ SẴN ───
 *
 * 1. **Không tạo thân Rapier cho mảnh vỡ.** Một phát tên lửa hất đi vài chục
 *    mảnh; thêm ngần ấy rigid body mỗi phát là giết khung hình. Mảnh vỡ tự tính
 *    vận tốc + trọng lực + nảy, y như `VehicleRocket.spawnBlast()` vẫn làm.
 *
 * 2. **Vỡ tới đâu TẮT VA CHẠM tới đó.** `objects.add()` trả về object mang
 *    `physical.body`; `FptuCampus.box()` nay giữ lại giá trị đó, và ở đây gọi
 *    `body.setEnabled(false)` ngay lúc khối vỡ. Quên bước này là ra đúng thứ
 *    user từng gọi tên: "nó chỉ biến mất hình ảnh nhưng vẫn còn ở đấy".
 *
 * 3. **Mặt xe chạy không bao giờ bị phá.** Sổ đăng ký trong `box()` gạt mọi
 *    khối có nóc dưới 0,5 (tấm lát, mặt cầu, bậc sảnh, vạch kẻ) — thủng mặt
 *    đường thì xe rơi hoặc kẹt ở mép hố, mà bộ kiểm bố cục KHÔNG bắt được
 *    chuyện đó.
 */

/** Trần mảnh vỡ sống cùng lúc — quá số này thì mảnh cũ nhất bị thu hồi. */
const MAX_SHARDS = 260

/** Trần cột nước sống cùng lúc. */
const MAX_SPLASHES = 6

/** Nóc khối phải cao hơn chừng này mới coi là "mảng nhà" đổ sập chứ không văng. */
const TOPPLE_SIZE = 2.2

export class FptuDestruction
{
    constructor(campus)
    {
        this.game = Game.getInstance()
        this.campus = campus
        this.events = new Events()

        this.pieces = []
        this.shards = []
        this.splashes = []
        this.deadTrees = []
        this.hiddenClusters = []

        this.materials = new Map()
        this.boxGeometry = new THREE.BoxGeometry(1, 1, 1)

        this.setPreference()
        this.collectPieces()
        this.collectTrees()
        this.collectClusters()
        this.setSettingsButtons()

        this.game.ticker.events.on('tick', () => this.update(), 11)
    }

    /**
     * Bật/Tắt, nhớ qua `localStorage` — cùng khuôn với Time, Rocket, Weather.
     * MẶC ĐỊNH BẬT: user đặt hàng hệ này để chơi, không phải để tự đi tìm nút.
     */
    setPreference()
    {
        this.preference = {}
        this.preference.names = [ 'off', 'on' ]
        this.preference.current = localStorage.getItem('destructionPreference') === 'off' ? 'off' : 'on'

        this.preference.set = (name) =>
        {
            if(!this.preference.names.includes(name)) return
            this.preference.current = name
            localStorage.setItem('destructionPreference', name)
            this.events?.trigger('preferenceChange')
        }
    }

    get enabled()
    {
        return this.preference.current === 'on'
    }

    /**
     * Đọc sổ đăng ký của `FptuCampus.box()` và chụp lại NGUYÊN TRẠNG từng khối.
     *
     * `home` phải chụp ở đây, lúc chưa ai đụng vào. Chụp lúc khối sắp vỡ thì
     * cái "nguyên trạng" ấy đã là trạng thái vỡ dở của lần bắn trước.
     */
    collectPieces()
    {
        const known = new Set()

        for(const entry of this.campus.destructibles)
        {
            this.register(entry.mesh, entry.object)
            known.add(entry.mesh)
        }

        /**
         * LƯỢT QUÉT VÉT — gom nốt những mesh dựng THẲNG, không đi qua `box()`.
         *
         * Có thật: mặt biển vẽ bằng canvas trong `FptuSigns`, thân và tán thông
         * trong `FptuPineHill`. Không gom thì bắn sập cái cột đỡ mà tấm biển
         * vẫn treo lơ lửng — đúng kiểu "phá dở" mà mắt bắt ngay.
         *
         * Ba thứ bị loại:
         *  - `fptuGround` — tấm lát, mặt cầu, bậc sảnh: mặt xe chạy, phá là
         *    xe rơi hoặc kẹt ở mép hố
         *  - `PlaneGeometry` — mảng địa hình của `heightPatch` (cả nền đảo, bờ,
         *    hai lòng hồ). Phá nền đảo thì không còn đảo
         *  - khối SÁT ĐẤT (nóc dưới 0,5) — cùng lý do với `fptuGround`
         */
        // Đồi thông treo group RIÊNG dưới `scene`, không nằm trong `campus.group`
        for(const root of [ this.campus.group, this.campus.pineHill?.group ])
            root?.traverse((child) =>
            {
                if(!child.isMesh) return
                if(known.has(child)) return
                if(child.userData.fptuGround) return
                // Đang ẩn sẵn (chóp tuyết chỉ hiện khi trời tuyết) — bỏ qua,
                // không thì `reset()` sẽ bật chúng lên giữa mùa hè
                if(!child.visible) return
                if(child.position.y + child.scale.y * 0.5 <= 0.5) return

                this.register(child, null)
            })

        // Sổ đăng ký hết việc — thả ra cho khỏi giữ hai bản cùng một danh sách
        this.campus.destructibles = null
    }

    /**
     * Khai thêm một khối vào sổ. Dùng cho thứ vào MUỘN hơn hàm dựng, ví dụ hàng
     * chữ FPT UNIVERSITY nạp bất đồng bộ từ `.glb`.
     */
    register(mesh, object = null)
    {
        if(!mesh) return

        const size = new THREE.Vector3()
        const center = new THREE.Vector3()

        if(mesh.isMesh && mesh.geometry)
        {
            /**
             * Đo bằng hộp bao CỤC BỘ của hình học rồi nhân với `scale`.
             *
             * Khối ra từ `box()` dùng hình hộp 1×1×1 nên ra đúng `scale` như
             * cũ, còn tấm biển vẽ canvas dùng `PlaneGeometry(4, 2)` với `scale`
             * để nguyên 1 — đo bằng `scale` không thôi thì tấm biển 4×2 bị coi
             * là 1×1, tức là phải bắn trúng gần như chính giữa mới ăn.
             *
             * ⚠️ ĐỪNG đo bằng `Box3.setFromObject()` ở đây. Hệ này dựng trong
             * `world.step(1)`, TRƯỚC khung hình đầu tiên, nên `matrixWorld` của
             * mấy nghìn khối vẫn còn là ma trận đơn vị — hộp bao thế giới sẽ
             * trả về 1×1×1 ở GỐC TOẠ ĐỘ cho tất cả. Cùng họ với cái bẫy đã làm
             * cây hiện ở gốc toạ độ hồi trước, nhưng im lặng hơn nhiều: nó chỉ
             * làm mọi khối "ở xa mọi vụ nổ", không có triệu chứng nào để thấy.
             */
            if(!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox()
            const bounds = mesh.geometry.boundingBox

            bounds.getSize(size).multiply(mesh.scale)
            bounds.getCenter(center).multiply(mesh.scale).add(mesh.position)
        }
        else
        {
            // Thứ nạp từ `.glb` (hàng chữ FPT UNIVERSITY) thì buộc phải đo bằng
            // hộp bao — nhưng cập nhật ma trận trước đã.
            mesh.updateMatrixWorld(true)
            const box = new THREE.Box3().setFromObject(mesh)
            box.getSize(size)
            box.getCenter(center)
        }

        this.pieces.push({
            mesh,
            object,
            center,
            half: size.clone().multiplyScalar(0.5),
            span: Math.max(size.x, size.y, size.z),
            home: {
                position: mesh.position.clone(),
                quaternion: mesh.quaternion.clone(),
                scale: mesh.scale.clone(),
                visible: mesh.visible,
            },
            broken: false,
            state: null,
        })
    }

    /** Ba loại cây của khu trường — mỗi cây một mục để gỡ lẻ được. */
    collectTrees()
    {
        this.trees = []

        for(const set of [ this.campus.birchTrees, this.campus.oakTrees, this.campus.cherryTrees ])
        {
            if(!set) continue

            for(let index = 0; index < set.references.length; index++)
                this.trees.push({
                    set,
                    index,
                    position: set.references[index].position.clone(),
                    // `Trees` cộng thêm 2,5 vào `position` khi dựng thân vật lý
                    // (Trees.js:108, `Vector3.add` sửa TẠI CHỖ) nên toạ độ ở đây
                    // đã bị đội lên — hạ về mặt đất để đo khoảng cách cho đúng.
                    alive: true,
                })
        }

        for(const tree of this.trees)
            tree.position.y = 0
    }

    /** Mọi hệ lá mềm: tán cây cảnh, hàng rào cây, bụi thấp. */
    collectClusters()
    {
        this.clusters = []

        const add = (foliage) =>
        {
            if(!foliage?.spots) return
            for(let index = 0; index < foliage.spots.length; index++)
                this.clusters.push({ foliage, index, position: foliage.spots[index], alive: true })
        }

        add(this.campus.leafClusters)
        add(this.campus.bushes)
    }

    material(hex)
    {
        let material = this.materials.get(hex)
        if(!material)
        {
            material = new MeshDefaultMaterial({ colorNode: color(hex) })
            this.materials.set(hex, material)
        }
        return material
    }

    /**
     * Vân loang tròn trên canvas — mềm ở mép, dùng cho bụi và bọt nước.
     * Pha trộn THƯỜNG, không cộng sáng: nền đất ở đây màu cam, cộng sáng là đẩy
     * hết về trắng bệch.
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
        const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
        gradient.addColorStop(0.0, `rgba(${r}, ${g}, ${b}, ${alpha})`)
        gradient.addColorStop(0.45, `rgba(${r}, ${g}, ${b}, ${alpha * 0.55})`)
        gradient.addColorStop(1.0, `rgba(${r}, ${g}, ${b}, 0)`)
        ctx.fillStyle = gradient
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

    /** Tấm bụi nằm ngang — máy quay chúc xuống nên thế là đủ. */
    makePuff(material)
    {
        if(!this.puffGeometry)
        {
            this.puffGeometry = new THREE.PlaneGeometry(1, 1)
            this.puffGeometry.rotateX(-Math.PI * 0.5)
        }

        const mesh = new THREE.Mesh(this.puffGeometry, material)
        mesh.castShadow = false
        mesh.receiveShadow = false
        mesh.renderOrder = 5
        this.game.scene.add(mesh)
        return mesh
    }

    /**
     * CAO ĐỘ MẶT CỨNG tại (x, z), đo bằng tia bắn thẳng xuống trong Rapier.
     *
     * Vì sao không tính bằng công thức: mặt đất ở đây là chồng của mảng địa hình
     * đảo, mảng địa hình đảo chính, tấm lát, mặt cầu và cả nóc nhà — không có
     * MỘT hàm nào trả lời được. Tia thì hỏi thẳng đúng thứ mà bánh xe đang chạm.
     *
     * Trả `null` nếu không chạm gì (bắn ra ngoài rìa thế giới).
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

            // Rapier đổi tên trường này giữa các bản (`toi` → `timeOfImpact`) —
            // nhận cả hai để nâng bản không làm nước im re.
            const distance = hit.timeOfImpact ?? hit.toi
            if(typeof distance !== 'number') return null

            return from - distance
        }
        catch(error)
        {
            return null
        }
    }

    /** Điểm này có phải mặt nước không (hồ trong trường, hai hồ, hay biển). */
    isWater(x, z)
    {
        const height = this.groundHeight(x, z)
        if(height === null) return false

        return height < this.game.water.surfaceElevation - 0.06
    }

    /**
     * ĐÒN ĐÁNH — gọi từ `VehicleRocket.detonate()`.
     *
     * @param center toạ độ tâm nổ
     * @param radius bán kính ăn đòn
     * @param power  1 = rocket. Tên lửa mạnh gấp 5 thì truyền 5.
     */
    damage(center, radius, power = 1)
    {
        if(!this.enabled) return

        // Nước trước: bắn xuống hồ thì phải thấy nước tung lên chứ không phải
        // nghe một tiếng nổ suông
        if(this.isWater(center.x, center.z))
            this.splash(center, radius)

        this.breakPieces(center, radius, power)
        this.breakTrees(center, radius)
        this.breakClusters(center, radius)

        // Vật sống — user chốt "phá huỷ được mọi thứ trong FPTU, cả người nữa"
        this.campus.swans?.killAround(center.x, center.z, radius * 0.75)
        this.campus.people?.killAround(center.x, center.z, radius * 0.85)
    }

    /**
     * Mảng nào đổ, mảng nào còn đứng.
     *
     * Chìa khoá của "vỡ DẦN" nằm ở đây: xác suất đổ giảm dần từ tâm ra mép chứ
     * KHÔNG phải cứ trong bán kính là bay sạch. Nhờ vậy phát đầu khoét một mảng,
     * phát sau ăn thêm một mảng, và cái nhà lở dần chứ không biến mất một phát.
     */
    breakPieces(center, radius, power)
    {
        for(const piece of this.pieces)
        {
            if(piece.broken) continue

            /**
             * Khoảng cách tới MẶT khối, không phải tới tâm khối.
             *
             * Đo tới tâm thì một bức tường dài 12 đơn vị có tâm cách 7 đơn vị
             * vẫn "ở xa" dù đầu tường nằm ngay giữa đám lửa — mà nới bán kính
             * để bù thì lại thổi bay cả những khối bé tí ở tận đâu. Đo tới mặt
             * hộp là đúng cả hai chiều, và nó lo luôn chiều cao: tường cao 8
             * đơn vị bị bắn vào chân thì cả bức đều nằm trong tầm.
             */
            const dx = Math.max(0, Math.abs(center.x - piece.center.x) - piece.half.x)
            const dy = Math.max(0, Math.abs(center.y - piece.center.y) - piece.half.y)
            const dz = Math.max(0, Math.abs(center.z - piece.center.z) - piece.half.z)
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)
            if(distance > radius) continue

            const closeness = 1 - distance / radius

            /**
             * ĐÂY là chỗ làm nhà "vỡ DẦN": sát tâm nổ thì chắc chắn đổ, ra tới
             * mép thì hên xui — nên phát đầu khoét một mảng, phát sau ăn thêm
             * mảng nữa, cái nhà lở dần chứ không biến mất một phát.
             *
             * ⚠️ ĐỪNG để đuôi đường cong chạm 0. Bản trước dùng
             * `closeness^1,5 × 1,6`, ở mép chỉ còn ~3% mỗi phát — đo ngày 31/7:
             * bắn rocket BỐN phát vào toà Alpha thì phát 2 đổ 3 mảng rồi phát 3
             * và 4 không suy suyển gì nữa, đọc ra hệt như "toà nhà này bất tử".
             * Nay có SÀN 0,35: mảnh nào đã lọt vào tầm thì bắn đủ lâu là đổ.
             *
             * `power` đẩy cả đường cong lên, nên tên lửa gấp 5 lần san phẳng
             * trọn tầm nổ ngay trong một phát — đúng ý nghĩa "gấp 5 lần".
             */
            const chance = Math.min(1, (0.35 + closeness * 0.75) * power)
            if(Math.random() > chance) continue

            this.breakPiece(piece, center)
        }
    }

    breakPiece(piece, center)
    {
        piece.broken = true

        // TẮT VA CHẠM NGAY — nếu không thì hình đi mà tường vô hình ở lại
        piece.object?.physical?.body?.setEnabled(false)

        const away = new THREE.Vector3().subVectors(piece.mesh.position, center)
        away.y = 0
        if(away.lengthSq() < 0.0001) away.set(1, 0, 0)
        away.normalize()

        if(piece.span >= TOPPLE_SIZE)
        {
            /**
             * MẢNG LỚN (tường, mái) — ĐỔ SẬP TẠI CHỖ.
             *
             * Không cho nó bay: một mảng tường 12 đơn vị vèo qua sân trông như
             * đồ chơi. Nó nghiêng đổ về phía xa tâm nổ, tụt xuống dưới nền rồi
             * co lại cho khuất hẳn — đúng dáng một mảng nhà sập.
             */
            piece.state = {
                type: 'topple',
                age: 0,
                life: 1.5,
                axis: new THREE.Vector3(-away.z, 0, away.x).normalize(),
                angle: 0.9 + Math.random() * 0.5,
                sink: piece.mesh.scale.y * 0.8 + 0.6,
            }
        }
        else
        {
            /**
             * MẢNH NHỎ (đố cửa, lan can, ghế, cột đèn) — VĂNG ra rồi rơi.
             * Tự tính vận tốc, KHÔNG đẻ thân Rapier.
             */
            piece.state = {
                type: 'fling',
                age: 0,
                life: 3.4,
                vx: away.x * (3.5 + Math.random() * 5),
                vz: away.z * (3.5 + Math.random() * 5),
                vy: 4 + Math.random() * 5,
                spinX: (Math.random() - 0.5) * 9,
                spinZ: (Math.random() - 0.5) * 9,
                resting: false,
                // Chốt mặt nằm NGAY BÂY GIỜ: cuối đời khối co lại, tính theo
                // `scale` đang co thì nó tụt dần xuống dưới nền
                floor: 0.06 + piece.mesh.scale.y * 0.3,
            }
        }

        this.spawnShards(piece, center)
    }

    /**
     * Vụn bắn ra từ chính khối vừa vỡ — cùng MÀU với nó, nên gạch ra vụn gạch,
     * mái ra vụn mái. Đây là thứ làm cái mảng "vỡ" chứ không phải "biến mất".
     */
    spawnShards(piece, center)
    {
        const count = Math.min(9, 2 + Math.round(piece.span * 1.2))

        for(let i = 0; i < count; i++)
        {
            // Chạm trần thì thu hồi mảnh cũ nhất — thà mất mảnh cũ còn hơn tụt
            // khung hình sau vài chục phát bắn
            if(this.shards.length >= MAX_SHARDS)
                this.game.scene.remove(this.shards.shift().mesh)

            // Vụn mang ĐÚNG vật liệu của khối vừa vỡ — gạch ra vụn gạch, mái ra
            // vụn mái. Hàng chữ nạp từ `.glb` là Group nên không có `material`,
            // rơi về màu cam của khu trường.
            const mesh = new THREE.Mesh(this.boxGeometry, piece.mesh.material ?? this.material('#e8702a'))
            const size = 0.12 + Math.random() * Math.min(0.6, piece.span * 0.22)
            mesh.scale.set(size, size * (0.5 + Math.random() * 0.6), size * (0.6 + Math.random() * 0.7))
            mesh.position.copy(piece.center)
            mesh.position.x += (Math.random() - 0.5) * piece.span * 0.6
            mesh.position.y += (Math.random() - 0.5) * piece.span * 0.4
            mesh.position.z += (Math.random() - 0.5) * piece.span * 0.6
            mesh.castShadow = false
            this.game.scene.add(mesh)

            const away = Math.atan2(mesh.position.z - center.z, mesh.position.x - center.x)
            const speed = 3 + Math.random() * 7

            this.shards.push({
                mesh,
                vx: Math.cos(away) * speed,
                vz: Math.sin(away) * speed,
                vy: 3 + Math.random() * 7,
                spinX: (Math.random() - 0.5) * 14,
                spinZ: (Math.random() - 0.5) * 14,
                age: 0,
                life: 5 + Math.random() * 3,
                floor: 0.06 + size * 0.3,
            })
        }
    }

    /** Cây trong bán kính thì gãy: tán tan, thân đổ nghiêng rồi chìm. */
    breakTrees(center, radius)
    {
        for(const tree of this.trees)
        {
            if(!tree.alive) continue
            if(Math.hypot(tree.position.x - center.x, tree.position.z - center.z) > radius) continue

            tree.alive = false
            tree.set.setTreeEnabled(tree.index, false)
            this.deadTrees.push(tree)

            this.spawnFallingTrunk(tree, center)
        }
    }

    /**
     * Thân cây gãy đổ — một khúc trụ nghiêng dần xuống rồi chìm.
     *
     * Cây của bản mẫu là `InstancedMesh` nên không lấy riêng một cây ra làm vật
     * rơi được; dựng một khúc trụ thay chỗ là cách rẻ nhất mà vẫn ra được cảnh
     * "cây đổ" thay vì "cây bốc hơi".
     */
    spawnFallingTrunk(tree, center)
    {
        if(!this.trunkGeometry)
            this.trunkGeometry = new THREE.CylinderGeometry(0.5, 0.62, 1, 7)

        const scale = tree.set.references[tree.index]?.scale?.x ?? 1
        const height = 4.4 * scale

        const mesh = new THREE.Mesh(this.trunkGeometry, this.material('#6d4f33'))
        mesh.scale.set(0.42 * scale, height, 0.42 * scale)
        mesh.position.set(tree.position.x, height * 0.5, tree.position.z)
        mesh.castShadow = true
        this.game.scene.add(mesh)

        const away = Math.atan2(tree.position.z - center.z, tree.position.x - center.x)

        this.shards.push({
            mesh,
            trunk: true,
            pivotY: height * 0.5,
            axis: new THREE.Vector3(-Math.sin(away), 0, Math.cos(away)).normalize(),
            vx: 0, vz: 0, vy: 0,
            age: 0,
            life: 6,
            floor: 0,
        })

        // Tán lá nát ra thành một nắm vụn xanh
        for(let i = 0; i < 6; i++)
        {
            if(this.shards.length >= MAX_SHARDS)
                this.game.scene.remove(this.shards.shift().mesh)

            const leaf = new THREE.Mesh(this.boxGeometry, this.material(i % 2 ? '#7fb43f' : '#5f9433'))
            const size = 0.25 + Math.random() * 0.3
            leaf.scale.set(size, size * 0.35, size)
            leaf.position.set(
                tree.position.x + (Math.random() - 0.5) * 2.4,
                height * 0.8 + Math.random() * 1.6,
                tree.position.z + (Math.random() - 0.5) * 2.4,
            )
            this.game.scene.add(leaf)

            this.shards.push({
                mesh: leaf,
                vx: (Math.random() - 0.5) * 5,
                vz: (Math.random() - 0.5) * 5,
                vy: 2 + Math.random() * 3,
                spinX: (Math.random() - 0.5) * 8,
                spinZ: (Math.random() - 0.5) * 8,
                age: 0,
                life: 4.5,
                floor: 0.1,
                drag: 0.45,       // lá thì rơi lửng lơ chứ không cắm xuống
            })
        }
    }

    breakClusters(center, radius)
    {
        for(const cluster of this.clusters)
        {
            if(!cluster.alive) continue
            if(Math.hypot(cluster.position.x - center.x, cluster.position.z - center.z) > radius) continue

            cluster.alive = false
            cluster.foliage.setInstanceEnabled(cluster.index, false)
            this.hiddenClusters.push(cluster)
        }
    }

    /**
     * NƯỚC TUNG TOÉ — cột nước bốc lên, vòng sóng loang ra, giọt bắn tứ phía.
     *
     * Mặt nước ở `water.surfaceElevation` (−0,3), mọi thứ dựng theo mốc đó chứ
     * không theo mặt đất, nếu không thì cột nước mọc hụt dưới đáy hồ.
     */
    splash(center, radius)
    {
        if(this.splashes.length >= MAX_SPLASHES)
            this.disposeSplash(this.splashes.shift())

        const y = this.game.water.surfaceElevation
        const scale = Math.max(0.8, radius / 8)

        // Vòng sóng loang trên mặt nước
        const ring = this.makePuff(this.puffMaterial(228, 244, 250, 0.6))
        ring.position.set(center.x, y + 0.06, center.z)

        // Cột nước dựng đứng — mấy tấm loang xếp chồng, bốc lên rồi rơi lại
        const column = []
        for(let i = 0; i < 8; i++)
        {
            const puff = this.makePuff(this.puffMaterial(238, 250, 255, 0.55 - i * 0.05))
            puff.position.set(center.x, y + 0.2 + i * 0.35, center.z)
            column.push({ mesh: puff, offset: i })
        }

        // Giọt bắn
        const drops = []
        if(!this.dropGeometry)
            this.dropGeometry = new THREE.SphereGeometry(0.5, 6, 5)

        for(let i = 0; i < 22; i++)
        {
            const mesh = new THREE.Mesh(this.dropGeometry, this.material('#cfeaf4'))
            const size = (0.08 + Math.random() * 0.16) * scale
            mesh.scale.setScalar(size)
            mesh.position.set(center.x, y + 0.2, center.z)
            this.game.scene.add(mesh)

            const angle = Math.random() * Math.PI * 2
            const speed = (2 + Math.random() * 7) * scale

            drops.push({
                mesh,
                vx: Math.cos(angle) * speed,
                vz: Math.sin(angle) * speed,
                vy: (5 + Math.random() * 8) * scale,
            })
        }

        this.splashes.push({ ring, column, drops, y, scale, age: 0, life: 2.2 })
        this.game.audio?.groups?.get('hitDefault')?.playRandomNext?.(6, center)
    }

    disposeSplash(splash)
    {
        this.game.scene.remove(splash.ring)
        for(const item of splash.column) this.game.scene.remove(item.mesh)
        for(const drop of splash.drops) this.game.scene.remove(drop.mesh)
    }

    /**
     * TRẢ TOÀN KHU VỀ NGUYÊN TRẠNG.
     *
     * Dựng lại từ `home` chụp lúc đầu chứ không dựng lại khu — dựng lại khu thì
     * đẻ ra một bộ va chạm thứ hai chồng lên bộ cũ, và đó đúng là công thức của
     * "vật vô hình chặn xe".
     */
    reset()
    {
        for(const piece of this.pieces)
        {
            if(!piece.broken) continue

            piece.mesh.position.copy(piece.home.position)
            piece.mesh.quaternion.copy(piece.home.quaternion)
            piece.mesh.scale.copy(piece.home.scale)
            piece.mesh.visible = piece.home.visible
            piece.object?.physical?.body?.setEnabled(true)
            piece.broken = false
            piece.state = null
        }

        for(const tree of this.deadTrees)
        {
            tree.set.setTreeEnabled(tree.index, true)
            tree.alive = true
        }
        this.deadTrees.length = 0

        for(const cluster of this.hiddenClusters)
        {
            cluster.foliage.setInstanceEnabled(cluster.index, true)
            cluster.alive = true
        }
        this.hiddenClusters.length = 0

        for(const shard of this.shards) this.game.scene.remove(shard.mesh)
        this.shards.length = 0

        for(const splash of this.splashes) this.disposeSplash(splash)
        this.splashes.length = 0

        this.campus.swans?.revive()
        this.campus.people?.revive()
    }

    /**
     * Ba nút Off / On / Reset trong bảng Cài đặt.
     *
     * ⚠️ Phải do CHÍNH module này nối, KHÔNG nối từ `Options`: `Options` dựng ở
     * `Game.js` dòng 110 còn nội dung thế giới mãi `world.step(1)` (dòng 199),
     * nên lúc `Options` chạy thì hệ này chưa tồn tại — đã thử `ticker.wait(2)`
     * và vẫn sớm.
     *
     * Reset là HÀNH ĐỘNG chứ không phải chế độ, nên nó mang `data-action` và
     * không bao giờ nhận trạng thái "đang chọn".
     */
    setSettingsButtons()
    {
        const container = document.querySelector('.js-destruction-modes')
        if(!container) return

        const modes = [ ...container.querySelectorAll('button[data-mode]') ]
        const resetButton = container.querySelector('button[data-action="reset"]')

        const update = () =>
        {
            for(const button of modes)
                button.classList.toggle('is-active', button.dataset.mode === this.preference.current)
        }

        update()
        this.events.on('preferenceChange', update)

        for(const button of modes)
            button.addEventListener('click', () =>
            {
                this.game.audio?.play?.('uiClick')
                this.preference.set(button.dataset.mode)
            })

        resetButton?.addEventListener('click', () =>
        {
            this.game.audio?.play?.('uiClick')
            this.reset()
        })
    }

    update()
    {
        const delta = Math.min(this.game.ticker.delta, 0.1)

        this.updatePieces(delta)
        this.updateShards(delta)
        this.updateSplashes(delta)
    }

    updatePieces(delta)
    {
        for(const piece of this.pieces)
        {
            const state = piece.state
            if(!state) continue

            state.age += delta
            const t = Math.min(1, state.age / state.life)

            if(state.type === 'topple')
            {
                // Nghiêng đổ + tụt xuống. Cuối đời thì co lại cho khuất hẳn
                // dưới nền, thay vì tắt hiển thị một phát.
                const fall = t * t
                piece.mesh.quaternion.copy(piece.home.quaternion)
                piece.mesh.rotateOnWorldAxis(state.axis, state.angle * fall)
                piece.mesh.position.copy(piece.home.position)
                piece.mesh.position.y -= state.sink * fall

                const shrink = Math.max(0.001, 1 - Math.max(0, t - 0.6) / 0.4)
                piece.mesh.scale.copy(piece.home.scale).multiplyScalar(shrink)
            }
            else
            {
                if(!state.resting)
                {
                    state.vy -= 17 * delta
                    piece.mesh.position.x += state.vx * delta
                    piece.mesh.position.y += state.vy * delta
                    piece.mesh.position.z += state.vz * delta
                    piece.mesh.rotateX(state.spinX * delta)
                    piece.mesh.rotateZ(state.spinZ * delta)

                    if(piece.mesh.position.y < state.floor)
                    {
                        piece.mesh.position.y = state.floor
                        state.vx *= 0.42
                        state.vz *= 0.42
                        state.vy *= -0.28

                        if(Math.abs(state.vy) < 1.2)
                        {
                            state.vy = 0
                            state.resting = true
                        }
                    }
                }

                // Nằm yên một lúc như đống đổ nát rồi mới chìm đi
                if(t > 0.75)
                {
                    const shrink = Math.max(0.001, 1 - (t - 0.75) / 0.25)
                    piece.mesh.scale.copy(piece.home.scale).multiplyScalar(shrink)
                }
            }

            if(t >= 1)
            {
                piece.mesh.visible = false
                piece.state = null
            }
        }
    }

    updateShards(delta)
    {
        for(let i = this.shards.length - 1; i >= 0; i--)
        {
            const shard = this.shards[i]
            shard.age += delta

            if(shard.age >= shard.life)
            {
                this.game.scene.remove(shard.mesh)
                this.shards.splice(i, 1)
                continue
            }

            if(shard.trunk)
            {
                // Thân cây đổ quanh gốc rồi chìm — quay quanh CHÂN chứ không
                // quanh tâm, nếu không nó lộn nhào giữa không trung
                const fall = Math.min(1, shard.age / 1.3)
                const angle = (Math.PI * 0.48) * fall * fall
                shard.mesh.quaternion.setFromAxisAngle(shard.axis, angle)
                shard.mesh.position.y = shard.pivotY * Math.cos(angle) - Math.max(0, shard.age - 2) * 0.9

                if(shard.age > shard.life - 1)
                    shard.mesh.scale.multiplyScalar(1 - delta * 1.6)

                continue
            }

            shard.vy -= (shard.drag ? 9 : 17) * delta
            shard.mesh.position.x += shard.vx * delta
            shard.mesh.position.y += shard.vy * delta
            shard.mesh.position.z += shard.vz * delta
            shard.mesh.rotation.x += shard.spinX * delta
            shard.mesh.rotation.z += shard.spinZ * delta

            if(shard.mesh.position.y < shard.floor)
            {
                shard.mesh.position.y = shard.floor
                shard.vx *= 0.5
                shard.vz *= 0.5
                shard.vy *= -0.3
                if(Math.abs(shard.vy) < 1) shard.vy = 0
            }

            // Tan dần ở cuối đời
            if(shard.age > shard.life - 0.8)
                shard.mesh.scale.multiplyScalar(1 - delta * 2.2)
        }
    }

    updateSplashes(delta)
    {
        for(let i = this.splashes.length - 1; i >= 0; i--)
        {
            const splash = this.splashes[i]
            splash.age += delta
            const t = splash.age / splash.life

            if(t >= 1)
            {
                this.disposeSplash(splash)
                this.splashes.splice(i, 1)
                continue
            }

            // Vòng sóng: loang nhanh rồi tan
            const ring = 1 - Math.pow(1 - Math.min(1, t * 1.8), 3)
            splash.ring.scale.setScalar((2 + ring * 16) * splash.scale)
            splash.ring.visible = t < 0.85

            // Cột nước: vọt lên rồi rơi lại, đốt trên cao lên chậm hơn đốt dưới
            for(const item of splash.column)
            {
                const local = Math.max(0, t - item.offset * 0.035)
                const rise = Math.sin(Math.min(1, local * 2.4) * Math.PI) * (3.4 + item.offset * 0.4) * splash.scale

                item.mesh.position.y = splash.y + 0.2 + rise
                item.mesh.scale.setScalar((1 + item.offset * 0.35 + t * 3) * splash.scale)
                item.mesh.visible = t < 0.7
            }

            // Giọt bắn
            for(const drop of splash.drops)
            {
                drop.vy -= 17 * delta
                drop.mesh.position.x += drop.vx * delta
                drop.mesh.position.y += drop.vy * delta
                drop.mesh.position.z += drop.vz * delta

                // Chạm mặt nước là mất hút
                if(drop.mesh.position.y < splash.y)
                    drop.mesh.visible = false
            }
        }
    }
}
