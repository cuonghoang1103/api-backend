import * as THREE from 'three/webgpu'
import { Game } from '../Game.js'
import { texture as textureNode } from 'three/tsl'
import { InstancedGroup } from '../InstancedGroup.js'
import {
    ALPHA, AXIS, BRIDGE, CANTEEN, DORMS, FOOTBALL, GATE, LAKE, LAKE_ISLET, LAWN,
    MAIN_ROAD, PINE_HILL, RANKING_PLAZA, SWAN_LAKE, THROUGH_ROAD,
} from '../../data/fptu.js'

/**
 * ĐÈN TRONG KHUÔN VIÊN FPTU — dùng ĐÚNG đèn lồng của thế giới mẫu.
 *
 * User chê hai điều, đây là câu trả lời cho cả hai:
 *  1. "mấy cái đèn này buổi tối nó phải sáng chứ" — cột đèn tôi tự đắp chỉ là
 *     khối xám, tối đến vẫn xám. Nay mặt kính dùng vật liệu
 *     `emissiveOrangeRadialGradient` (đúng vật liệu mesh `light` của đèn lồng
 *     mẫu), và ban đêm còn loang một vũng sáng xuống mặt đường.
 *  2. "cho thêm nhiều cái đèn mẫu này ở khu khác qua khu FPTU nữa" — nhân bản
 *     thẳng model `lanternsModel` sang sân trường: dọc lối đi, quanh hai hồ,
 *     trước cửa ký túc xá, dọc cầu, trên cù lao và lối lên đồi thông.
 *
 * ─── VÌ SAO KHÔNG DÙNG `intervalEvents.get('night')` ───
 * `PoleLights` của bản mẫu nghe sự kiện đó. Nhưng cờ ấy tính theo tiến trình
 * TỰ NHIÊN của đồng hồ, TRƯỚC khi `override.progress` được áp — nên bấm nút
 * Time sang Night thì cảnh tối đi mà cờ vẫn báo ban ngày, đèn không chịu bật.
 * Đã dẫm bẫy này rồi. Ở đây hỏi thẳng `dayCycles.isNight()` mỗi nhịp.
 */

/** Băm tất định — bản dựng phải tái lập được, không dùng Math.random. */
const rand = (seed) =>
{
    const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453
    return x - Math.floor(x)
}

export class FptuLights
{
    constructor(campus)
    {
        this.game = Game.getInstance()
        this.campus = campus
        this.y = campus.groundTop

        this.night = null // chưa xác định ⇒ nhịp đầu tiên luôn áp trạng thái

        this.setLanterns()
        this.setLampGlow()

        this.game.ticker.events.on('tick', () => this.update(), 12)
    }

    /** Vật liệu phát sáng của thế giới mẫu — cùng thứ mesh `light` đang dùng. */
    get emissive()
    {
        return this.game.materials.getFromName('emissiveOrangeRadialGradient')
    }

    /**
     * Chỗ đặt đèn lồng. Đèn lồng là vật TRANG TRÍ sát lối đi nên không dùng
     * `props.blocked()` (nó cấm cả lề đường); thay vào đó liệt kê tay theo các
     * tuyến đi bộ, rồi chỉ loại những chỗ rơi vào lòng hồ.
     */
    lanternSpots()
    {
        const spots = []
        const push = (x, z, y = 0) => spots.push({ x, z, y })

        // Dọc hai lề trục lễ nghi, so le nhau
        for(let x = AXIS.fromX - 4; x >= AXIS.toX + 4; x -= 11)
        {
            const side = ((x / 6) | 0) % 2 === 0 ? 1 : -1
            push(x, AXIS.z + side * (AXIS.halfWidth + 2.6))
        }

        // Dọc đường xuyên sảnh ra cuối đảo
        for(let x = THROUGH_ROAD.fromX - 6; x >= THROUGH_ROAD.toX + 6; x -= 17)
            push(x, THROUGH_ROAD.z + (((x / 9) | 0) % 2 === 0 ? 1 : -1) * (THROUGH_ROAD.halfWidth + 2.6))

        // Dọc con đường lớn
        for(let z = MAIN_ROAD.z - MAIN_ROAD.length * 0.5 + 8; z <= MAIN_ROAD.z + MAIN_ROAD.length * 0.5 - 8; z += 17)
            push(MAIN_ROAD.x - MAIN_ROAD.width * 0.5 - 2.8, z)

        // Vòng quanh hồ sen và hồ thiên nga — đúng kiểu đèn ven hồ
        for(let i = 0; i < 8; i++)
        {
            const a = (i / 8) * Math.PI * 2
            push(LAKE.x + Math.cos(a) * (LAKE.radiusX + 2.6), LAKE.z + Math.sin(a) * (LAKE.radiusZ + 2.6))
        }
        for(let i = 0; i < 5; i++)
        {
            const a = (i / 5) * Math.PI * 2 + 0.4
            push(SWAN_LAKE.x + Math.cos(a) * (SWAN_LAKE.radiusX + 2.6), SWAN_LAKE.z + Math.sin(a) * (SWAN_LAKE.radiusZ + 2.6))
        }

        // Trước cửa từng toà ký túc xá, hai bên lối vào
        for(const dorm of DORMS)
            push(dorm.x + 1.9, dorm.z + 3.6)

        // Hai bên thảm cỏ trục chính + bốn góc sảnh xếp hạng
        for(const side of [ -1, 1 ])
        {
            push(LAWN.x + 3, LAWN.z + side * (LAWN.depth * 0.5 + 2))
            push(LAWN.x - 3, LAWN.z + side * (LAWN.depth * 0.5 + 2))
            push(RANKING_PLAZA.x + 6.5, RANKING_PLAZA.z + side * 8)
            push(RANKING_PLAZA.x - 6.5, RANKING_PLAZA.z + side * 8)
        }

        // Dọc lan can cầu — hai hàng đối xứng, đây là đường vào trường ban đêm
        // Cầu: thưa hẳn và nép SÁT MÉP. Bản trước cứ 4 đơn vị một ĐÔI đèn kẹp
        // hai bên nên mặt cầu chật cứng — user chê "mấy cái đèn giảm bớt đi
        // được không". Nay cách 9 đơn vị và mỗi chỗ chỉ một bên.
        const bridgeFrom = Math.min(BRIDGE.fromX, BRIDGE.toX) - 2
        const bridgeTo = Math.max(BRIDGE.fromX, BRIDGE.toX) + 2
        for(let x = bridgeFrom, i = 0; x <= bridgeTo; x += 9, i++)
            push(x, BRIDGE.z + (i % 2 === 0 ? -1 : 1) * (BRIDGE.width * 0.5 - 0.35), 0.55)

        // Hai bên cổng
        for(const side of [ -1, 1 ])
            push(GATE.x + 2.4, GATE.z + side * 8.2)

        // Lối lên đồi thông — xoắn dần lên đỉnh, đèn nằm ĐÚNG mặt đồi
        for(let i = 0; i < 9; i++)
        {
            const a = i * 0.8
            const r = PINE_HILL.radius * (1 - i / 11)
            const x = PINE_HILL.x + Math.cos(a) * r
            const z = PINE_HILL.z + Math.sin(a) * r
            const t = 1 - r / PINE_HILL.radius
            push(x, z, PINE_HILL.height * t * t * (3 - 2 * t))
        }

        // Trên cù lao giữa hồ sen
        for(let i = 0; i < 4; i++)
        {
            const a = i * Math.PI * 0.5 + 0.6
            const r = LAKE_ISLET.radius * 0.75
            const tt = 1 - 0.75
            push(LAKE_ISLET.x + Math.cos(a) * r, LAKE_ISLET.z + Math.sin(a) * r,
                -0.9 + (LAKE_ISLET.height + 0.9) * (tt * tt * (3 - 2 * tt)))
        }

        // Quanh nhà ăn và sân bóng
        for(const side of [ -1, 1 ])
        {
            push(CANTEEN.x + side * 7, CANTEEN.z + 5)
            push(FOOTBALL.x + side * (FOOTBALL.width * 0.5 + 2.4), FOOTBALL.z)
        }

        // Chân toà Alpha, dọc mặt tiền
        for(let i = -1; i <= 1; i++)
            push(ALPHA.x + ALPHA.depth * 0.5 + 3.4, ALPHA.z + i * 7)

        // Loại những chỗ rơi vào lòng hồ (đèn không cắm giữa mặt nước được)
        return spots.filter((s) =>
        {
            for(const lake of [ LAKE, SWAN_LAKE ])
            {
                const r = Math.hypot((s.x - lake.x) / lake.radiusX, (s.z - lake.z) / lake.radiusZ)
                // chừa cù lao ra: nó nổi giữa hồ nên hợp lệ
                const onIslet = Math.hypot(s.x - LAKE_ISLET.x, s.z - LAKE_ISLET.z) < LAKE_ISLET.radius - 1
                if(r < 1 && !onIslet) return false
            }
            return true
        })
    }

    /**
     * Nhân bản đèn lồng của thế giới mẫu sang sân trường.
     *
     * ⚠️ Phải CLONE model rồi mới dựng `InstancedGroup`: `World.lanterns` đã
     * dựng một nhóm trên chính các mesh gốc, dùng lại y nguyên là hai nhóm
     * tranh nhau cùng một đối tượng.
     */
    setLanterns()
    {
        const source = this.game.resources.lanternsModel.scene.children[0]
        if(!source) return

        const base = source.clone(true)
        base.position.set(0, 0, 0)
        base.rotation.set(0, 0, 0)

        for(const child of base.children)
        {
            child.name = child.name.replace(/[0-9]+$/i, '')
            child.castShadow = true
            child.receiveShadow = true
            child.frustumCulled = false
        }
        this.game.materials.updateObject(base)

        const spots = this.lanternSpots()
        const references = spots.map((spot, i) =>
        {
            const object = new THREE.Object3D()
            object.position.set(spot.x, this.y + spot.y, spot.z)
            object.rotation.y = rand(i * 7) * Math.PI * 2
            object.scale.setScalar(0.9 + rand(i * 11) * 0.35)
            object.needsUpdate = true
            return object
        })

        this.lanterns = new InstancedGroup(references, base, false)
        this.lanternCount = references.length

        // Thân đèn có va chạm — húc vào thì khựng như húc vật thật
        for(const reference of references)
            this.game.objects.add(null, {
                type: 'fixed',
                position: reference.position,
                colliders: [ { shape: 'cuboid', parameters: [ 0.32, 0.5, 0.32 ], category: 'object' } ],
            })
    }

    /**
     * Cột đèn tự đắp: mặt kính chuyển sang vật liệu phát sáng, và thêm một vũng
     * sáng loang xuống mặt đường chỉ hiện ban đêm. Máy quay nhìn từ trên xuống
     * nên vũng sáng dưới đất mới là thứ đọc ra "đèn đang bật".
     */
    setLampGlow()
    {
        const lenses = this.campus.props?.lampLenses ?? []
        this.pools = []

        const geometry = new THREE.CircleGeometry(1, 32)
        geometry.rotateX(-Math.PI * 0.5)
        const material = this.glowMaterial()

        for(const lens of lenses)
        {
            lens.mesh.material = this.emissive

            /**
             * ⚠️ Vũng sáng phải nằm CAO HƠN MỌI LỚP LÁT.
             *
             * Đặt ở y = 0,14 là trùng đúng cao độ mặt lát lớp 1 (0,11 + 0,03),
             * hai mặt tranh nhau chiều sâu và ra đúng vệt nhiễu nháy nháy user
             * chụp được ở cổng ban đêm. Lớp lát cao nhất là 0,20 (lớp 3), nên
             * treo hẳn lên 0,36. Máy quay nhìn từ trên xuống nên không ai thấy
             * nó lơ lửng.
             */
            const pool = new THREE.Mesh(geometry, material)
            pool.position.set(lens.x, this.y + 0.32, lens.z)
            pool.scale.setScalar(6.4)
            pool.visible = false
            pool.castShadow = false
            pool.receiveShadow = false
            pool.renderOrder = 3
            this.campus.group.add(pool)
            this.pools.push(pool)
        }
    }

    /**
     * VỆT SÁNG dưới chân cột đèn — mờ dần ra mép, KHÔNG phải cái đĩa đặc.
     *
     * Bản đầu dán thẳng vật liệu phát sáng lên một đĩa tròn: ra đúng vũng vàng
     * đậm cứng viền sắc lẹm mà user chụp ảnh chê. Ánh đèn thật thì sáng nhất ở
     * tâm rồi tắt dần, và toả rộng hơn nhiều so với cái chao đèn.
     *
     * Cách làm: vẽ một vòng loang trên canvas (đậm ở tâm → trong suốt ở mép),
     * lấy kênh alpha của nó làm độ đục. Dùng pha trộn THƯỜNG chứ không cộng
     * sáng — nền đất ở đây màu cam, cộng sáng là đẩy hết về trắng bệch (bài học
     * cũ của cầu vồng).
     */
    glowMaterial()
    {
        const size = 256
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size

        const ctx = canvas.getContext('2d')
        const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
        // Tâm chỉ ~0,55 độ đục: đèn làm SÁNG mặt đường chứ không sơn đè lên nó
        grad.addColorStop(0.00, 'rgba(255, 236, 178, 0.55)')
        grad.addColorStop(0.18, 'rgba(255, 214, 130, 0.40)')
        grad.addColorStop(0.42, 'rgba(255, 176, 84, 0.20)')
        grad.addColorStop(0.70, 'rgba(255, 150, 60, 0.07)')
        grad.addColorStop(1.00, 'rgba(255, 140, 50, 0.00)')
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, size, size)

        const map = new THREE.CanvasTexture(canvas)
        map.colorSpace = THREE.SRGBColorSpace
        map.needsUpdate = true

        const node = textureNode(map)
        const material = new THREE.MeshBasicNodeMaterial()
        material.colorNode = node.rgb
        material.opacityNode = node.a
        material.transparent = true
        material.depthWrite = false
        material.toneMapped = false

        return material
    }

    update()
    {
        // Hỏi thẳng `isNight()` — xem chú thích đầu file về cái bẫy cờ interval
        const night = this.game.dayCycles.isNight()
        if(night === this.night) return

        this.night = night
        for(const pool of this.pools)
            pool.visible = night
    }
}
