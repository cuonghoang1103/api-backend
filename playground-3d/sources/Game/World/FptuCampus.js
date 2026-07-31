import * as THREE from 'three/webgpu'
import { color } from 'three/tsl'
import { Game } from '../Game.js'
import { MeshDefaultMaterial } from '../Materials/MeshDefaultMaterial.js'
import { ALPHA, ALPHA_LOBBY, SWAN_LAKE, LAKE_ISLET, AXIS, THROUGH_ROAD, BASKETBALL, BRIDGE, BUILDINGS, CANTEEN, COLORS, DORMS, FOOTBALL, FORECOURT, GATE, ISLAND, LAKE, LAWN, MAIN_ROAD, MARTIAL, PARKING, QUESTION_BLOCKS, RANKING_PLAZA, RANKING_SIGN, SIGN, STATUE } from '../../data/fptu.js'
import { FptuQuiz } from './FptuQuiz.js'
import { FptuPineHill } from './FptuPineHill.js'
import { FptuSwans } from './FptuSwans.js'
import { Trees } from './Trees.js'
import { Foliage } from './Foliage.js'
import { uniform } from 'three/tsl'

/**
 * KHUÔN VIÊN ĐẠI HỌC FPT — nằm trên MẢNH ĐẤT RIÊNG ngoài khơi phía Tây,
 * nối vào đảo chính bằng cầu. Dựng HOÀN TOÀN BẰNG MÃ, không đụng file .glb nào.
 *
 * Bản đầu đặt trường chen vào góc Tây-Nam đảo chính và bị người dùng bác đúng
 * cả bốn điểm: nhà đè lên hồ có sẵn, chữ chồng vào nhà khu cũ, nhà cao che mất
 * xe khi lái ngang, và bố cục sai trục. Bản này sửa tận gốc:
 *
 * - Đảo cũ TRẢ NGUYÊN TRẠNG — file này không đặt bất cứ khối nào trong ±96.
 * - Trục chính để TRỐNG hoàn toàn, mọi toà nhà lùi xa khỏi trục ≥ 18 đơn vị,
 *   nên máy quay (cao 22, chúc xuống) không bao giờ bị nhà chắn giữa nó và xe
 *   khi chạy trên trục.
 * - Thứ tự đúng ảnh thật, đi một đường thẳng:
 *   cầu → cổng → đường → sảnh + biển xếp hạng → chữ FPT UNIVERSITY
 *       → thảm cỏ + hai hàng cọ → sân trước → TOÀ ALPHA GIẬT CẤP.
 *
 * Ba điều kiện để "ra khơi" được — đã KIỂM TRONG MÃ trước khi viết:
 * 1. Không có kiểm tra biên nào giết người chơi (`die()` chỉ gọi từ AltarArea).
 * 2. `WaterSurface.update()` copy vị trí máy quay mỗi khung hình nên mặt biển
 *    đi theo người chơi ra tận đây.
 * 3. Sàn vật lý toàn cục là hộp 1000×1000 (`World.setPhysicalFloor`) nên ngoài
 *    địa hình vẫn có "đáy biển" đỡ xe — nền đảo chỉ việc kê lên trên.
 */

/** Ô caro là ĐẶC hay RỖNG — băm tất định, KHÔNG dùng Math.random. */
const isDarkCell = (i, j) => ((((i * 73856093) ^ (j * 19349663)) >>> 0) % 100) < 46

/** Có trồng cây trong ô rỗng không — cũng tất định. */
const hasFoliage = (i, j) => ((((i * 83492791) ^ (j * 29349643)) >>> 0) % 100) < 40

const GROUND_TOP = 0.04 // mặt đảo cao hơn "đáy biển" vật lý (−0,01) chừng này

export class FptuCampus
{
    constructor()
    {
        this.game = Game.getInstance()

        this.group = new THREE.Group()
        this.group.name = 'fptuCampus'
        this.game.scene.add(this.group)

        // Một hình học hộp duy nhất, mọi khối chỉ khác scale — vài trăm khối
        // vẫn chỉ một buffer hình học
        this.boxGeometry = new THREE.BoxGeometry(1, 1, 1)
        this.cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 8)
        this.materials = new Map()

        this.setIsland()
        this.setBridge()
        this.setGate()
        this.setGround()
        this.setRankingSign()
        this.setAlpha()
        this.setBuildings()
        this.setDorms()
        this.setLake()
        this.setSports()
        this.setCanteen()
        this.setParking()
        this.setPalms()
        this.setTrees()
        this.setSign()

        this.setSwanLake()

        this.pineHill = new FptuPineHill(this)
        this.swans = new FptuSwans(this)

        this.quiz = new FptuQuiz()
        this.setGateZone()
        this.setQuestionBlocks()
    }

    getMaterial(hex)
    {
        let material = this.materials.get(hex)

        if(!material)
        {
            material = new MeshDefaultMaterial({ colorNode: color(hex) })
            this.materials.set(hex, material)
        }

        return material
    }

    box(width, height, depth, x, y, z, hex, { rotationX = 0, rotationY = 0, rotationZ = 0, physical = false, geometry = null, castShadow = true, receiveShadow = true } = {})
    {
        const mesh = new THREE.Mesh(geometry ?? this.boxGeometry, this.getMaterial(hex))
        mesh.scale.set(width, height, depth)
        mesh.position.set(x, y, z)
        mesh.rotation.order = 'YZX'
        mesh.rotation.x = rotationX
        mesh.rotation.y = rotationY
        mesh.rotation.z = rotationZ
        mesh.castShadow = castShadow
        mesh.receiveShadow = receiveShadow
        this.group.add(mesh)

        if(physical)
        {
            // Lấy quaternion từ ĐÚNG bộ Euler của hình. Bản trước chỉ dựng từ
            // mỗi rotationY nên khối nào nghiêng là hình một đằng va chạm một nẻo.
            const quaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(rotationX, rotationY, rotationZ, 'YZX'))

            this.game.objects.add(
                null,
                {
                    type: 'fixed',
                    position: { x, y, z },
                    rotation: { x: quaternion.x, y: quaternion.y, z: quaternion.z, w: quaternion.w },
                    colliders: [ { shape: 'cuboid', parameters: [ width * 0.5, height * 0.5, depth * 0.5 ] } ]
                }
            )
        }

        return mesh
    }

    /**
     * Tấm phẳng lát nền (đường, sân, thảm cỏ) — không thân vật lý.
     *
     * ⚠️ `layer` là BẮT BUỘC phải nghĩ tới. Mọi tấm để chung một cao độ thì
     * depth buffer không phân biệt nổi tấm nào trên tấm nào, ra đúng hiện tượng
     * người dùng gặp: mặt sân "giật giật như nhiễu sóng", sọc răng cưa chạy
     * loạn khi máy quay nhúc nhích (z-fighting). Mỗi lớp cách nhau 0,03 đơn vị
     * là đủ tách bạch mà mắt không thấy nó nổi lên.
     *
     *   layer 0 — mặt đường, mặt sân, thảm cỏ (lớp nền)
     *   layer 1 — thứ lát ĐÈ LÊN lớp nền: lối đi bộ giữa thảm cỏ, sảnh trên sân
     *   layer 2 — vạch kẻ, đường biên
     *
     * Đáy tấm cũng phải nằm CAO HƠN mặt nền đảo (y = 0,04), nếu không nó cắm
     * vào nền và lại tranh chấp với chính mặt đất.
     */
    slab(width, depth, x, z, hex, { layer = 0 } = {})
    {
        const y = GROUND_TOP + 0.05 + layer * 0.03
        // `receiveShadow: false` — mặt lát nằm sát ngay trên mặt đảo, cả hai
        // cùng nhận bóng thì bóng tính ở hai độ sâu chênh nhau vài phân, ra
        // đúng những vệt răng cưa chạy loạn (shadow acne). Nền đảo vẫn nhận
        // bóng nên bóng nhà đổ xuống sân vẫn còn.
        return this.box(width, 0.04, depth, x, y, z, hex, { castShadow: false, receiveShadow: false })
    }

    /**
     * Nền đảo: một phiến lớn nổi trên biển, viền cát thò ra quanh mép để nhìn
     * nghiêng ra dáng bờ đảo chứ không phải tấm ván trôi.
     */
    setIsland()
    {
        /**
         * Viền cát quanh mép đảo — dựng thành BỐN DẢI VIỀN chứ không phải một
         * tấm đặc trải khắp.
         *
         * Bản trước để tấm đặc: mặt trên của nó nằm ở y ≈ −0,19, tức CAO HƠN
         * mặt biển (−0,3), nên nó BỊT KÍN cái lỗ vừa khoét làm hồ — nhìn xuống
         * hồ chỉ thấy màu cát cam thay vì nước. Đúng chỗ người dùng chê "hồ sen
         * xấu thế này".
         */
        /**
         * BỜ CÁT THOẢI quanh đảo — và nó PHẢI CÓ THÂN VẬT LÝ.
         *
         * Bản trước vành cát chỉ là hình: xe chạy ra mép liền rơi xuống "sàn
         * đáy" toàn cục (y = −0,01) trong khi mặt cát vẽ ở −0,19, tức xe đứng
         * lơ lửng CAO HƠN mặt cát 18 phân — nhìn đúng như đi xuyên qua bờ, và
         * lúc rơi xuống nước thì loay hoay không có gì để leo lên.
         *
         * Nay bờ làm hai bậc rất thoải: bậc ngoài mặt ở y = 0,00 (chỉ nhỉnh hơn
         * đáy 1 phân) rồi bậc trong ở y = 0,02, cuối cùng mới tới mặt đảo 0,04.
         * Chênh mỗi bậc chỉ 1–2 phân nên xe bò lên được từ mọi phía, không cần
         * tìm chỗ nào là "bến".
         */
        /**
         * BỜ DỐC quanh đảo — mặt phẳng NGHIÊNG thật, có thân vật lý.
         *
         * Bậc thang phẳng không ăn thua: xe rơi xuống biển nổi ở khoảng
         * y = −0,7, mà bậc bờ ở y = 0 thì chênh 70 phân — vách đứng, bánh không
         * bám nổi, đúng cảnh "kẹt dưới nước không lên được". Nên bờ phải là
         * DỐC: chìm hẳn xuống −1,4 ở mép ngoài rồi thoải dần lên bằng mặt đảo,
         * chạy dài 10 đơn vị nên độ dốc chỉ chừng 8° — xe bò lên từ mọi phía.
         */
        const RAMP_RUN = 10      // bề rộng dải dốc
        const RAMP_DROP = 1.45   // mép ngoài thấp hơn mặt đảo bao nhiêu
        const rampAngle = Math.atan2(RAMP_DROP, RAMP_RUN)
        const rampThickness = 1.6
        const rampLength = Math.hypot(RAMP_RUN, RAMP_DROP)
        const midY = GROUND_TOP - RAMP_DROP * 0.5 - Math.cos(rampAngle) * rampThickness * 0.5

        for(const side of [ -1, 1 ])
        {
            // Bờ Bắc / Nam: dốc nghiêng quanh trục X
            const zMid = ISLAND.z + side * (ISLAND.depth * 0.5 + RAMP_RUN * 0.5)
            this.box(
                ISLAND.width + RAMP_RUN * 2, rampThickness, rampLength,
                ISLAND.x, midY, zMid, '#d8b47e',
                { rotationX: side * rampAngle, physical: true, castShadow: false }
            )

            // Bờ Đông / Tây: dốc nghiêng quanh trục Z
            const xMid = ISLAND.x + side * (ISLAND.width * 0.5 + RAMP_RUN * 0.5)
            this.box(
                rampLength, rampThickness, ISLAND.depth,
                xMid, midY, ISLAND.z, '#d8b47e',
                { rotationZ: -side * rampAngle, physical: true, castShadow: false }
            )
        }

        const halfW = ISLAND.width * 0.5
        const halfD = ISLAND.depth * 0.5

        /**
         * Miệng hồ khoét theo hình BẦU DỤC, không phải chữ nhật.
         *
         * Cách làm: chia dải đất nằm trong bề ngang của hồ thành nhiều CỘT dọc
         * trục x; mỗi cột chừa ra một khoảng z đúng bằng nửa dây cung của hình
         * bầu dục tại cột đó. Nhiều cột thì bờ càng mượt — 18 cột đã đủ để nhìn
         * ra bờ cong tự nhiên như mấy hồ của bản đồ gốc, thay vì bốn góc vuông.
         */
        /**
         * Nền đảo chia thành CỘT DỌC trục X. Mỗi cột bị hai cái hồ khoét thủng
         * theo dây cung bầu dục, nên một cột có thể vỡ thành nhiều đoạn z rời
         * nhau. Xử lý tổng quát: với mỗi cột, dựng danh sách "khoảng cấm" rồi
         * lấy phần bù — thêm hồ thứ ba sau này cũng không phải viết lại.
         */
        const holes = [ LAKE, SWAN_LAKE ].map((lake) => ({
            x: lake.x, z: lake.z,
            rx: lake.radiusX ?? lake.radius,
            rz: lake.radiusZ ?? lake.radius,
        }))

        const columnWidth = 3
        const columnCount = Math.ceil(ISLAND.width / columnWidth)
        const ground = []

        for(let i = 0; i < columnCount; i++)
        {
            const x0 = ISLAND.x - halfW + i * columnWidth
            const x1 = Math.min(x0 + columnWidth, ISLAND.x + halfW)

            // Khoảng z bị hồ chiếm trong cột này
            const bans = []
            for(const hole of holes)
            {
                const dx = Math.max(Math.abs(x0 - hole.x), Math.abs(x1 - hole.x)) / hole.rx
                if(dx >= 1) continue
                const halfChord = hole.rz * Math.sqrt(1 - dx * dx)
                bans.push([ hole.z - halfChord, hole.z + halfChord ])
            }

            bans.sort((a, b) => a[0] - b[0])

            let cursor = ISLAND.z - halfD
            for(const [ banStart, banEnd ] of bans)
            {
                if(banStart > cursor) ground.push({ x0, x1, z0: cursor, z1: banStart })
                cursor = Math.max(cursor, banEnd)
            }
            if(cursor < ISLAND.z + halfD) ground.push({ x0, x1, z0: cursor, z1: ISLAND.z + halfD })
        }

        for(const piece of ground)
        {
            const width = piece.x1 - piece.x0
            const depth = piece.z1 - piece.z0
            if(width <= 0.01 || depth <= 0.01) continue

            const cx = (piece.x0 + piece.x1) * 0.5
            const cz = (piece.z0 + piece.z1) * 0.5

            this.box(width, 1.5, depth, cx, GROUND_TOP - 0.75, cz, COLORS.grass, { castShadow: false })

            this.game.objects.add(
                null,
                {
                    type: 'fixed',
                    friction: 0.25,
                    restitution: 0,
                    position: { x: cx, y: GROUND_TOP - 0.75, z: cz },
                    colliders: [ { shape: 'cuboid', parameters: [ width * 0.5, 0.75, depth * 0.5 ] } ]
                }
            )
        }
    }

    /** Cầu nối đảo chính — mặt thấp sát nước, có lan can hai bên. */
    setBridge()
    {
        const length = Math.abs(BRIDGE.toX - BRIDGE.fromX) + 6
        const centerX = (BRIDGE.fromX + BRIDGE.toX) * 0.5

        // Mặt cầu
        this.box(length, 0.5, BRIDGE.width, centerX, GROUND_TOP - 0.2, BRIDGE.z, COLORS.road, { castShadow: false })
        this.game.objects.add(
            null,
            {
                type: 'fixed',
                friction: 0.25,
                restitution: 0,
                position: { x: centerX, y: GROUND_TOP - 0.2, z: BRIDGE.z },
                colliders: [ { shape: 'cuboid', parameters: [ length * 0.5, 0.25, BRIDGE.width * 0.5 ] } ]
            }
        )

        // Lan can — vật lý, để xe không rơi xuống biển giữa chừng
        for(const side of [ -1, 1 ])
        {
            const z = BRIDGE.z + side * (BRIDGE.width * 0.5 + 0.2)
            this.box(length, 0.55, 0.3, centerX, GROUND_TOP + 0.32, z, COLORS.wall, { physical: true })
        }
    }

    /** Cổng chính — hai trụ, thanh ngang cam, biển đá + logo FPT, bốt bảo vệ. */
    setGate()
    {
        const { x, z } = GATE
        const opening = 6.5 // nửa độ rộng lối vào — trục đường rộng 9 nên dư sức

        for(const side of [ -1, 1 ])
            this.box(1.3, 5.2, 1.3, x, 2.6, z + side * opening, COLORS.wall, { physical: true })

        // Thanh ngang cao hơn nóc xe rất nhiều, chui qua thoải mái
        this.box(0.8, 0.8, opening * 2 + 1.3, x, 5.6, z, COLORS.orange)

        // Biển đá bên phải cổng + logo FPT ba khối màu
        this.box(0.5, 2, 4.6, x + 1.2, 1, z + opening + 3.4, '#8d7f68', { physical: true })
        this.box(0.18, 0.55, 1, x + 1.5, 1.55, z + opening + 2.3, COLORS.orange)
        this.box(0.18, 0.55, 1, x + 1.5, 1.55, z + opening + 3.4, COLORS.green)
        this.box(0.18, 0.55, 1, x + 1.5, 1.55, z + opening + 4.5, COLORS.blue)

        // Bốt bảo vệ bên trái
        this.box(2.4, 2.5, 2.4, x, 1.25, z - opening - 2.6, COLORS.wall, { physical: true })
        this.box(2.8, 0.25, 2.8, x, 2.62, z - opening - 2.6, COLORS.roof)
    }

    /** Mặt đường, sảnh, thảm cỏ, sân trước — toàn bộ phần lát nền. */
    setGround()
    {
        // CON ĐƯỜNG dọc mép Đông trường (bản đồ thật: đường chính mép Nam) —
        // "trước cái biển và sảnh đó là con đường"
        this.slab(MAIN_ROAD.width, MAIN_ROAD.length, MAIN_ROAD.x, MAIN_ROAD.z, COLORS.road)

        // Vạch kẻ tim đường cho ra dáng đường thật
        for(let i = 0; i < 8; i++)
            this.slab(0.9, 0.18, MAIN_ROAD.x, MAIN_ROAD.z - MAIN_ROAD.length * 0.5 + 5 + i * 8.4, '#e8e4da', { layer: 2 })

        // Trục lễ nghi từ cổng vào
        const axisLength = Math.abs(AXIS.toX - AXIS.fromX)
        this.slab(axisLength, AXIS.halfWidth * 2, (AXIS.fromX + AXIS.toX) * 0.5, AXIS.z, COLORS.road, { layer: 1 })

        // Sảnh gạch đỏ quanh biển xếp hạng
        this.slab(RANKING_PLAZA.width, RANKING_PLAZA.depth, RANKING_PLAZA.x, RANKING_PLAZA.z, COLORS.plazaBrick, { layer: 2 })

        // Thảm cỏ giữa hàng chữ và toà Alpha, lối đi bộ lát gạch ở giữa
        this.slab(LAWN.width, LAWN.depth, LAWN.x, LAWN.z, '#79a844', { layer: 2 })
        this.slab(LAWN.width, 6.5, LAWN.x, LAWN.z, COLORS.plazaBrick, { layer: 3 })

        // Sân trước chân toà Alpha
        this.slab(FORECOURT.width, FORECOURT.depth, FORECOURT.x, FORECOURT.z, '#a8a294', { layer: 3 })

        // CON ĐƯỜNG XUYÊN SẢNH — chui qua gầm toà Alpha rồi chạy thẳng tới cuối
        // đảo (nét đen người dùng vẽ trên bản đồ)
        const throughLength = Math.abs(THROUGH_ROAD.toX - THROUGH_ROAD.fromX)
        this.slab(throughLength, THROUGH_ROAD.halfWidth * 2, (THROUGH_ROAD.fromX + THROUGH_ROAD.toX) * 0.5, THROUGH_ROAD.z, COLORS.road)

        for(let i = 0; i < 12; i++)
            this.slab(2.4, 0.2, THROUGH_ROAD.fromX - 6 - i * 5, THROUGH_ROAD.z, '#e8e4da', { layer: 2 })
    }

    /**
     * Biển "top xếp hạng đại học thế giới" giữa sảnh — như tấm biển đá STARS
     * trong ảnh cổng trường. Xe vòng qua hai bên (sảnh rộng 30, biển chỉ 9).
     */
    setRankingSign()
    {
        const { x, z, height, width } = RANKING_SIGN

        // Bệ + thân biển. Bản trước để biển cao 3,2 rộng 8,5 ĐỨNG GIỮA sảnh nên
        // trông như bức tường chắn ngang; nay thu nhỏ còn ~60% và dời hẳn sang
        // mép sảnh, đúng chỗ tấm biển đá ở cổng trường thật.
        this.box(1.1, 0.35, width + 0.8, x, 0.17, z, '#7c6f5a', { physical: true })
        this.box(0.7, height, width, x, height * 0.5 + 0.35, z, '#8d7f68', { physical: true })

        // Logo FPT ba khối màu ở mặt hướng ra cổng (+X)
        this.box(0.14, 0.5, 0.9, x + 0.4, height - 0.2, z - 1, COLORS.orange)
        this.box(0.14, 0.5, 0.9, x + 0.4, height - 0.2, z, COLORS.green)
        this.box(0.14, 0.5, 0.9, x + 0.4, height - 0.2, z + 1, COLORS.blue)

        // Hàng năm sao — biển xếp hạng đại học
        for(let i = 0; i < 5; i++)
            this.box(0.12, 0.4, 0.4, x + 0.4, height - 1.1, z + (i - 2) * 0.85, '#f6c945', { rotationZ: Math.PI * 0.25 })

        // Dải chân biển màu cam
        this.box(0.14, 0.35, width - 0.6, x + 0.4, 0.62, z, COLORS.orange)
    }

    /**
     * TOÀ ALPHA — khối GIẬT CẤP KIỂU BẬC THANG đúng đặc trưng: hai đầu 3 tầng,
     * cao dần vào giữa 7 tầng (3-4-5-6-7-7-6-5-4-3), mặt bằng cong nhẹ như
     * cánh cung ôm lấy sân trước, mặt tiền ô caro đặc/rỗng, và CÂY XANH mọc
     * trên mặt bậc lộ thiên của từng cấp — "lớp xanh chắn nắng" của công trình
     * thật (KTS Võ Trọng Nghĩa, hoàn thành 2015, 11.065 m²).
     */
    setAlpha()
    {
        const total = ALPHA.columns.length * ALPHA.columnWidth
        const startZ = ALPHA.z - total * 0.5

        const darkCells = []
        const foliageCells = []

        ALPHA.columns.forEach((column, index) =>
        {
            const height = column.floors * ALPHA.floorHeight
            const zCenter = startZ + (index + 0.5) * ALPHA.columnWidth
            const xCenter = ALPHA.x + column.bow // bow dương = nhô về phía sân trước

            /**
             * Thân cột. Hai cột giữa được nâng lên thành CỔNG VÒM: phần dưới bỏ
             * trống làm SẢNH XUYÊN QUA — xe chui lọt từ sân trước ra thẳng con
             * đường phía sau, đúng cái sảnh lớn của toà Alpha thật.
             */
            const overLobby = Math.abs(zCenter - ALPHA.z) < ALPHA_LOBBY.halfWidth

            if(overLobby)
            {
                // Chỉ dựng phần TRÊN sảnh, và thân vật lý cũng chỉ ở phần trên
                const upperHeight = height - ALPHA_LOBBY.height
                if(upperHeight > 0.1)
                    this.box(ALPHA.depth, upperHeight, ALPHA.columnWidth, xCenter, ALPHA_LOBBY.height + upperHeight * 0.5, zCenter, COLORS.wall, { physical: true })
            }
            else
            {
                this.box(ALPHA.depth, height, ALPHA.columnWidth, xCenter, height * 0.5, zCenter, COLORS.wall, { physical: true })
            }

            // Mái cột
            this.box(ALPHA.depth + 0.35, 0.22, ALPHA.columnWidth + 0.1, xCenter, height + 0.11, zCenter, COLORS.roof)

            // CÂY XANH trên mặt bậc: dải cây sát mép trước của mái — chính là
            // thứ làm toà nhà "bậc thang phủ cây" nhận ra được từ xa
            this.box(1.1, 0.55, ALPHA.columnWidth - 0.7, xCenter + ALPHA.depth * 0.5 - 0.75, height + 0.5, zCenter, COLORS.foliage, { castShadow: false })

            // Vài chóp cây nhỏ nhô cao trên các bậc thấp (như ảnh: cây thật trên sân thượng)
            if(column.floors <= 5)
            {
                this.box(0.3, 1, 0.3, xCenter - 1, height + 0.72, zCenter - 1, COLORS.trunk, { geometry: this.cylinderGeometry, castShadow: false })
                this.box(1, 0.9, 1, xCenter - 1, height + 1.55, zCenter - 1, COLORS.foliage, { castShadow: false })
            }

            // Lưới ô caro trên mặt TRƯỚC (+X) của cột — 3 ô mỗi tầng
            const cells = 3
            const cellW = ALPHA.columnWidth / cells

            for(let floor = 0; floor < column.floors; floor++)
            {
                for(let cell = 0; cell < cells; cell++)
                {
                    const globalCell = index * cells + cell
                    if(!isDarkCell(floor, globalCell)) continue

                    const cellZ = zCenter - ALPHA.columnWidth * 0.5 + (cell + 0.5) * cellW
                    const cellY = floor * ALPHA.floorHeight + ALPHA.floorHeight * 0.5
                    const cellX = xCenter + ALPHA.depth * 0.5 + 0.06

                    // Không dán ô lên khoảng trống của sảnh xuyên qua
                    if(overLobby && cellY < ALPHA_LOBBY.height) continue

                    darkCells.push({ x: cellX, y: cellY, z: cellZ, w: cellW * 0.8, h: ALPHA.floorHeight * 0.74 })

                    if(hasFoliage(floor, globalCell))
                        foliageCells.push({ x: cellX + 0.1, y: cellY - ALPHA.floorHeight * 0.2, z: cellZ })
                }
            }
        })

        // Dầm ngang đỡ phần trên sảnh — viền tối cho ra dáng cửa sảnh lớn
        for(const side of [ -1, 1 ])
            this.box(ALPHA.depth + 0.2, 0.35, 0.5, ALPHA.x, ALPHA_LOBBY.height - 0.18, ALPHA.z + side * ALPHA_LOBBY.halfWidth, COLORS.windowDark)

        this.addCells(darkCells, COLORS.windowDark)
        this.addFoliage(foliageCells)
    }

    /** Các ô tối trên mặt tiền — một InstancedMesh cho tất cả. */
    addCells(cells, hex)
    {
        if(cells.length === 0) return

        const mesh = new THREE.InstancedMesh(this.boxGeometry, this.getMaterial(hex), cells.length)
        mesh.castShadow = false
        mesh.receiveShadow = true

        const dummy = new THREE.Object3D()

        cells.forEach((cell, index) =>
        {
            dummy.position.set(cell.x, cell.y, cell.z)
            dummy.rotation.set(0, 0, 0)
            dummy.scale.set(0.12, cell.h, cell.w)
            dummy.updateMatrix()
            mesh.setMatrixAt(index, dummy.matrix)
        })

        mesh.instanceMatrix.needsUpdate = true
        this.group.add(mesh)
    }

    /** Cây xanh thò ra từ các ô rỗng của mặt caro. */
    addFoliage(cells)
    {
        if(cells.length === 0) return

        const mesh = new THREE.InstancedMesh(this.boxGeometry, this.getMaterial(COLORS.foliage), cells.length)
        mesh.castShadow = false
        mesh.receiveShadow = true

        const dummy = new THREE.Object3D()

        cells.forEach((cell, index) =>
        {
            dummy.position.set(cell.x, cell.y, cell.z)
            dummy.scale.set(0.3, 0.4, 0.72)
            dummy.updateMatrix()
            mesh.setMatrixAt(index, dummy.matrix)
        })

        mesh.instanceMatrix.needsUpdate = true
        this.group.add(mesh)
    }

    /** Beta / Gamma / Delta — lùi hẳn khỏi trục, kiểu khối giảng đường mặt kính. */
    setBuildings()
    {
        for(const building of BUILDINGS)
        {
            const height = building.floors * 1.3

            this.box(building.width, height, building.depth, building.x, height * 0.5, building.z, COLORS.wall, { physical: true })
            this.box(building.width + 0.4, 0.25, building.depth + 0.4, building.x, height + 0.12, building.z, COLORS.roof)

            for(let floor = 0; floor < building.floors; floor++)
            {
                const y = floor * 1.3 + 0.75
                this.box(building.width * 0.88, 0.55, 0.1, building.x, y, building.z + building.depth * 0.5 + 0.05, COLORS.windowDark)
                this.box(building.width * 0.88, 0.55, 0.1, building.x, y, building.z - building.depth * 0.5 - 0.05, COLORS.windowDark)
            }
        }
    }

    /** Bốn toà ký túc xá Dom, dồn về góc sau, có bảng tên cam. */
    setDorms()
    {
        for(const dorm of DORMS)
        {
            const height = 4 * 1.15

            this.box(6.5, height, 5, dorm.x, height * 0.5, dorm.z, COLORS.wall, { physical: true })
            this.box(6.9, 0.22, 5.4, dorm.x, height + 0.11, dorm.z, COLORS.roof)
            this.box(1.5, 0.5, 0.12, dorm.x, height - 0.45, dorm.z + 2.56, COLORS.orange)

            for(let floor = 0; floor < 4; floor++)
                this.box(5.4, 0.45, 0.1, dorm.x, floor * 1.15 + 0.7, dorm.z + 2.55, COLORS.windowDark)
        }
    }

    /**
     * HỒ SEN LỚN sau lưng toà Alpha — đúng điểm nhận diện của campus thật:
     * "toà nhà hình rồng soi bóng xuống hồ". Sen + lá rải tất định.
     */
    /**
     * HỒ SEN — nền đảo đã được KHOÉT THỦNG đúng chỗ này (xem `setIsland`), nên
     * cái nhìn thấy dưới đáy là MẶT BIỂN THẬT của game: có gợn sóng, có loang
     * màu theo trời, lạnh thì đóng băng, xe lội xuống có tiếng nước. Ở đây chỉ
     * cần đắp bờ cát và thả sen.
     */
    setLake()
    {
        const waterY = this.game.water.surfaceElevation

        /**
         * VÀNH DỐC quanh miệng hồ — cùng lý do với bờ đảo: rơi xuống hồ mà mép
         * là vách đứng thì xe nằm dưới đó vĩnh viễn. Chia chu vi bầu dục thành
         * 20 đoạn, mỗi đoạn là một tấm nghiêng đặt tiếp tuyến, mép ngoài bằng
         * mặt đất còn mép trong chìm xuống đáy hồ.
         */
        /**
         * ĐÁY HỒ NÔNG. Mặt nước ở −0,3, đáy đặt ở −0,75 nên hồ sâu chừng 45
         * phân: xe lội qua được, nước ngập tới nửa bánh, và quan trọng nhất là
         * KHÔNG BAO GIỜ KẸT — cứ đi thẳng là lên bờ.
         *
         * Trước đó lòng hồ hoàn toàn rỗng (bắn tia xuống không thấy mặt rắn
         * nào), xe rơi xuống nổi lơ lửng ở −0,6 trong khi mép dốc nằm mãi dưới
         * −1,2 nên chẳng có gì mà bò lên.
         */
        const lakeFloorY = -0.75
        // Màu ĐÁY hồ phải là màu nước, không phải màu bùn: mặt nước của game
        // (`WaterSurface`) là tấm phẳng bám theo máy quay, bán kính chỉ chừng 29,
        // nên phần hồ ở xa xe chưa được phủ nước và lộ nguyên đáy ra
        this.box(LAKE.radiusX * 2 + 2, 0.6, LAKE.radiusZ * 2 + 2, LAKE.x, lakeFloorY - 0.3, LAKE.z, '#3d6f57', { castShadow: false })
        this.game.objects.add(null, {
            type: 'fixed', friction: 0.3, restitution: 0,
            position: { x: LAKE.x, y: lakeFloorY - 0.3, z: LAKE.z },
            colliders: [ { shape: 'cuboid', parameters: [ (LAKE.radiusX + 1), 0.3, (LAKE.radiusZ + 1) ] } ]
        })

        // Bề rộng dốc phải TỈ LỆ với bán kính nhỏ nhất của hồ. Để cứng 8 thì
        // với hồ bề ngang 8 (hồ thiên nga) vành dốc lấp kín cả lòng hồ — thiên
        // nga hoá ra đứng trên cạn.
        const LAKE_RUN = Math.min(6, Math.min(LAKE.radiusX, LAKE.radiusZ) * 0.45)
        const LAKE_DROP = 1.35
        const lakeAngle = Math.atan2(LAKE_DROP, LAKE_RUN)
        const lakeRampLength = Math.hypot(LAKE_RUN, LAKE_DROP)
        const segments = 20

        for(let i = 0; i < segments; i++)
        {
            const theta = (i / segments) * Math.PI * 2
            const cos = Math.cos(theta)
            const sin = Math.sin(theta)

            // Tâm đoạn dốc nằm TRONG LÒNG hồ, thụt vào nửa bề rộng dốc.
            // Đặt ra ngoài mép (bản trước) là dốc chìm hẳn dưới nền đất, xe bơi
            // tới nơi vẫn đâm vào vách đứng của nền.
            const px = LAKE.x + cos * (LAKE.radiusX - LAKE_RUN * 0.5)
            const pz = LAKE.z + sin * (LAKE.radiusZ - LAKE_RUN * 0.5)

            // Bề dài mỗi đoạn = cung chu vi, cộng dư để các đoạn gối lên nhau
            const arc = (Math.PI * 2 * Math.max(LAKE.radiusX, LAKE.radiusZ)) / segments * 1.5

            this.box(
                lakeRampLength, 1.4, arc,
                px, GROUND_TOP - LAKE_DROP * 0.5 - 0.7, pz, '#d8b47e',
                { rotationY: -theta, rotationZ: lakeAngle, physical: true, castShadow: false }
            )
        }

        /**
         * Không đắp bờ hay đáy gì cả: miệng hồ đã khoét hình bầu dục ở
         * `setIsland`, nên nhìn xuống là MẶT NƯỚC THẬT của game — cùng thứ nước
         * làm nên mấy cái hồ đẹp của bản đồ gốc: có sóng lượn, loang màu theo
         * trời, đóng băng khi lạnh.
         *
         * Việc ở đây chỉ là thả sen. Hồ sen của trường PHỦ KÍN lá (xem ảnh
         * thật), nên rải dày theo CỤM chứ không lác đác: gom quanh vài tâm cụm,
         * lệch nhau tất định, chừa khoảng nước trống ở giữa cho thấy mặt nước.
         */
        // Hồ nay rất rộng nên rải sen theo NHIỀU cụm hơn, và chừa trống vùng
        // cù lao ở giữa
        const clusters = [
            { x: -0.62, z: -0.42, n: 16 }, { x: -0.34, z: -0.66, n: 14 },
            { x: 0.38, z: -0.6, n: 16 }, { x: 0.66, z: -0.3, n: 14 },
            { x: 0.66, z: 0.34, n: 16 }, { x: 0.3, z: 0.62, n: 14 },
            { x: -0.36, z: 0.64, n: 16 }, { x: -0.68, z: 0.3, n: 14 },
            { x: -0.5, z: 0.02, n: 12 }, { x: 0.52, z: 0.04, n: 12 },
        ]

        let seed = 0
        const rand = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff }

        for(const cluster of clusters)
        {
            for(let i = 0; i < cluster.n; i++)
            {
                const spreadX = (rand() - 0.5) * 0.42
                const spreadZ = (rand() - 0.5) * 0.42
                const nx = cluster.x + spreadX
                const nz = cluster.z + spreadZ

                // Bỏ lá rơi ra ngoài mép bầu dục, hoặc rơi trúng cù lao
                if(nx * nx + nz * nz > 0.9) continue
                const dxIslet = LAKE.x + nx * LAKE.radiusX - LAKE_ISLET.x
                const dzIslet = LAKE.z + nz * LAKE.radiusZ - LAKE_ISLET.z
                if(Math.hypot(dxIslet, dzIslet) < LAKE_ISLET.radius + 2) continue

                const x = LAKE.x + nx * LAKE.radiusX
                const z = LAKE.z + nz * LAKE.radiusZ
                const size = 0.85 + rand() * 0.75

                // Lá sen — tấm tròn dẹt nổi sát mặt nước
                this.box(size, 0.05, size, x, waterY + 0.025, z, i % 3 === 0 ? '#3f8f4a' : '#4f9e4a', { castShadow: false, geometry: this.cylinderGeometry })
            }
        }

        /**
         * CÙ LAO GIỮA HỒ — mảng xanh nổi giữa mặt sen, đúng như ảnh thật.
         * Dựng bằng đĩa chồng như đồi thông (leo lên được), trên trồng cây tán
         * tròn cho rậm.
         */
        const tiers = 6
        for(let i = 0; i < tiers; i++)
        {
            const ratio = i / tiers
            const radius = LAKE_ISLET.radius * (1 - ratio * 0.55)
            const tierHeight = (LAKE_ISLET.height + 0.9) / tiers
            const y = -0.9 + tierHeight * i + tierHeight * 0.5

            this.box(radius * 2, tierHeight * 1.06, radius * 2, LAKE_ISLET.x, y, LAKE_ISLET.z,
                i === 0 ? '#c2a878' : '#5f9438', { geometry: this.cylinderGeometry, castShadow: i > 1 })

            this.game.objects.add(null, {
                type: 'fixed', friction: 0.3, restitution: 0,
                position: { x: LAKE_ISLET.x, y, z: LAKE_ISLET.z },
                colliders: [ { shape: 'cylinder', parameters: [ tierHeight * 0.53, radius ] } ]
            })
        }

        // Cây um tùm trên cù lao
        for(let i = 0; i < 9; i++)
        {
            const angle = i * 2.39996
            const spread = Math.sqrt((i + 0.4) / 9)
            const radius = LAKE_ISLET.radius * 0.55 * spread
            const x = LAKE_ISLET.x + Math.cos(angle) * radius
            const z = LAKE_ISLET.z + Math.sin(angle) * radius
            const top = LAKE_ISLET.height * (1 - radius / LAKE_ISLET.radius * 0.7)
            const scale = 0.9 + ((i * 31) % 7) / 12

            this.box(0.3 * scale, 1.5 * scale, 0.3 * scale, x, top + 0.75 * scale, z, COLORS.trunk, { geometry: this.cylinderGeometry, castShadow: false })
            this.box(1.7 * scale, 1.4 * scale, 1.7 * scale, x, top + 2 * scale, z, '#3f7f3a', { castShadow: false, geometry: this.cylinderGeometry })
            this.box(1.15 * scale, 0.9 * scale, 1.15 * scale, x, top + 2.9 * scale, z, '#559a44', { castShadow: false, geometry: this.cylinderGeometry })
        }

        // Vài bông sen hồng nhô lên — cánh xoè quanh nhuỵ vàng
        const blooms = [
            [ -0.6, -0.4 ], [ 0.4, -0.6 ], [ 0.66, -0.26 ], [ 0.62, 0.36 ],
            [ 0.28, 0.64 ], [ -0.38, 0.62 ], [ -0.68, 0.28 ], [ -0.32, -0.68 ],
        ]

        for(const [ nx, nz ] of blooms)
        {
            const x = LAKE.x + nx * LAKE.radiusX
            const z = LAKE.z + nz * LAKE.radiusZ

            for(let i = 0; i < 6; i++)
            {
                const angle = i * Math.PI / 3
                this.box(0.34, 0.1, 0.16, x + Math.cos(angle) * 0.17, waterY + 0.14, z + Math.sin(angle) * 0.17, '#ff9ec4', { rotationY: -angle, rotationZ: -0.5, castShadow: false })
            }

            this.box(0.16, 0.16, 0.16, x, waterY + 0.24, z, '#ffd76b', { castShadow: false })
        }
    }

    /**
     * HỒ THIÊN NGA — cùng công thức đã kiểm ở hồ sen: lòng hồ là lỗ khoét trên
     * nền đảo (làm trong `setIsland`), đáy nông để xe lội qua không kẹt, và
     * vành dốc quanh mép để bò lên bờ. Chỉ khác là không thả sen — đàn thiên
     * nga do `FptuSwans` lo.
     */
    setSwanLake()
    {
        const floorY = -0.75

        this.box(SWAN_LAKE.radiusX * 2 + 2, 0.6, SWAN_LAKE.radiusZ * 2 + 2, SWAN_LAKE.x, floorY - 0.3, SWAN_LAKE.z, '#3f6f78', { castShadow: false })
        this.game.objects.add(null, {
            type: 'fixed', friction: 0.3, restitution: 0,
            position: { x: SWAN_LAKE.x, y: floorY - 0.3, z: SWAN_LAKE.z },
            colliders: [ { shape: 'cuboid', parameters: [ SWAN_LAKE.radiusX + 1, 0.3, SWAN_LAKE.radiusZ + 1 ] } ]
        })

        const RUN = Math.min(6, Math.min(SWAN_LAKE.radiusX, SWAN_LAKE.radiusZ) * 0.45)
        const DROP = 1.35
        const angle = Math.atan2(DROP, RUN)
        const rampLength = Math.hypot(RUN, DROP)
        const segments = 20

        for(let i = 0; i < segments; i++)
        {
            const theta = (i / segments) * Math.PI * 2
            const px = SWAN_LAKE.x + Math.cos(theta) * (SWAN_LAKE.radiusX - RUN * 0.5)
            const pz = SWAN_LAKE.z + Math.sin(theta) * (SWAN_LAKE.radiusZ - RUN * 0.5)
            const arc = (Math.PI * 2 * Math.max(SWAN_LAKE.radiusX, SWAN_LAKE.radiusZ)) / segments * 1.5

            this.box(rampLength, 1.4, arc, px, GROUND_TOP - DROP * 0.5 - 0.7, pz, '#d8b47e',
                { rotationY: -theta, rotationZ: angle, physical: true, castShadow: false })
        }
    }

    /** Sân bóng rổ (góc Bắc cạnh đường) + sân bóng đá (giữa trường) + sân võ. */
    setSports()
    {
        // Bóng rổ — mặt xanh dương như ảnh bản đồ
        this.slab(BASKETBALL.width, BASKETBALL.depth, BASKETBALL.x, BASKETBALL.z, COLORS.court, { layer: 2 })

        for(const side of [ -1, 1 ])
        {
            const z = BASKETBALL.z + side * (BASKETBALL.depth * 0.5 - 0.7)
            this.box(0.22, 3.1, 0.22, BASKETBALL.x, 1.55, z, '#5a5a5a', { physical: true })
            this.box(0.12, 0.9, 1.5, BASKETBALL.x, 3.2, z - side * 0.5, COLORS.wall)
        }

        // Bóng đá — khung thành hai đầu
        this.slab(FOOTBALL.width, FOOTBALL.depth, FOOTBALL.x, FOOTBALL.z, COLORS.pitch)
        this.slab(FOOTBALL.width - 1.6, 0.2, FOOTBALL.x, FOOTBALL.z, '#e8e4da', { layer: 1 })

        for(const side of [ -1, 1 ])
        {
            const z = FOOTBALL.z + side * (FOOTBALL.depth * 0.5 - 0.5)
            this.box(3.6, 0.14, 0.14, FOOTBALL.x, 1.3, z, COLORS.wall)
            this.box(0.14, 1.3, 0.14, FOOTBALL.x - 1.8, 0.65, z, COLORS.wall, { physical: true })
            this.box(0.14, 1.3, 0.14, FOOTBALL.x + 1.8, 0.65, z, COLORS.wall, { physical: true })
        }

        // Sân võ nhỏ
        this.slab(MARTIAL.width, MARTIAL.depth, MARTIAL.x, MARTIAL.z, '#5f8f6f')
    }

    /** Nhà ăn hai tầng cạnh cụm Dom giữa. */
    setCanteen()
    {
        const height = CANTEEN.floors * 1.25

        this.box(CANTEEN.width, height, CANTEEN.depth, CANTEEN.x, height * 0.5, CANTEEN.z, COLORS.wall, { physical: true })
        this.box(CANTEEN.width + 0.4, 0.22, CANTEEN.depth + 0.4, CANTEEN.x, height + 0.11, CANTEEN.z, COLORS.roof)
        this.box(CANTEEN.width * 0.86, 0.5, 0.1, CANTEEN.x, 0.75, CANTEEN.z + CANTEEN.depth * 0.5 + 0.05, COLORS.windowDark)
        this.box(2, 0.45, 0.12, CANTEEN.x, height - 0.4, CANTEEN.z + CANTEEN.depth * 0.5 + 0.06, COLORS.orange)
    }

    /** Bãi gửi xe dọc mép đường — vài ô kẻ trắng và hai xe đỗ sẵn. */
    setParking()
    {
        this.slab(PARKING.width, PARKING.depth, PARKING.x, PARKING.z, '#7d7a72')

        for(let i = 0; i < 4; i++)
            this.slab(PARKING.width - 1, 0.16, PARKING.x, PARKING.z - PARKING.depth * 0.5 + 2 + i * 4, '#e8e4da', { layer: 1 })

        this.box(1.6, 0.62, 0.85, PARKING.x, 0.35, PARKING.z - 4, '#c94f39')
        this.box(1.6, 0.62, 0.85, PARKING.x, 0.35, PARKING.z + 4.2, '#3a6fc9')
    }

    /**
     * Hai hàng cọ dọc lối đi bộ giữa thảm cỏ — flanking như ảnh thật, cách trục
     * 4,5 đơn vị nên không chạm đường xe. Thảm cỏ nay chỉ rộng 8 nên 3 cây mỗi
     * hàng, bước 2,6 — thò rộng hơn là cọ đứng đè lên sân trước và hàng chữ.
     */
    setPalms()
    {
        const spots = []
        for(let i = 0; i < 3; i++)
        {
            const x = LAWN.x + LAWN.width * 0.5 - 1.2 - i * 2.6
            spots.push({ x, z: LAWN.z - 4.5 }, { x, z: LAWN.z + 4.5 })
        }

        for(const spot of spots)
            this.palm(spot.x, spot.z)
    }

    palm(x, z)
    {
        this.box(0.32, 4, 0.32, x, 2, z, COLORS.trunk, { physical: true, geometry: this.cylinderGeometry })

        for(let i = 0; i < 6; i++)
        {
            const angle = i * Math.PI / 3 + 0.35
            this.box(2, 0.12, 0.48, x + Math.cos(angle) * 0.9, 4.05, z + Math.sin(angle) * 0.9, COLORS.foliage, { rotationY: -angle, rotationZ: -0.42, castShadow: false })
        }

        this.box(0.42, 0.38, 0.42, x, 3.85, z, '#8f6b2f')
    }

    /**
     * CÂY CỐI THẬT — dùng lại đúng hệ `Trees` và `Foliage` của thế giới gốc thay
     * vì tự đắp hộp.
     *
     * Vì sao: bản trước dựng cây bằng hai khối hộp chồng nhau nên cả khu trông
     * "vuông, nhọn như đồ chơi" — người dùng chê đúng. Hai lớp này cho tán lá
     * dựng từ hàng chục phiến xoay ngẫu nhiên, có sắc độ chuyển, LAY THEO GIÓ,
     * đổ bóng mềm và luôn hơi xoay về phía máy quay. Chúng chỉ cần một mảng
     * Object3D làm mốc vị trí (`setFromReferences` đọc `position` và `scale.x`),
     * nên tạo bằng mã được, không phải sửa file .glb nào.
     */
    setTrees()
    {
        /**
         * ⚠️ PHẢI gọi `updateMatrix()` + `updateMatrixWorld()`.
         *
         * `Trees` dựng phần THÂN và LÁ từ `reference.matrix` / `.matrixWorld`
         * (Trees.js:61 và :76), nhưng dựng THÂN VẬT LÝ từ `reference.position`
         * (:108). Object3D tạo bằng mã có `position` đúng ngay nhưng `matrix`
         * vẫn là ma trận đơn vị cho tới khi được cập nhật — nên cây HIỆN Ở GỐC
         * TOẠ ĐỘ trong khi va chạm nằm đúng chỗ mình đặt. Đó chính là "bức
         * tường vô hình" người dùng đâm phải trước sảnh Alpha.
         */
        const make = (list) => list.map(([ x, z, scale ]) =>
        {
            const object = new THREE.Object3D()
            object.position.set(x, 0, z)
            object.scale.setScalar(scale)
            object.updateMatrix()
            object.updateMatrixWorld(true)
            return object
        })

        // Ba loại cây — toạ độ theo đảo MỚI (150×116, tâm −162·40), đều cách
        // tim hai con đường ≥ 9 đơn vị nên không cây nào thò vào lòng đường
        const birch = make([
            [ -98, 66, 1.1 ], [ -114, 12, 1 ], [ -120, 60, 1.2 ], [ -134, 16, 1 ],
            [ -150, 62, 1.1 ], [ -168, 56, 1 ], [ -196, 62, 1.2 ], [ -214, 52, 1 ],
        ])
        const oak = make([
            [ -98, 28, 1.2 ], [ -114, 56, 1 ], [ -130, 60, 1.1 ], [ -146, 20, 1.2 ],
            [ -164, 62, 1 ], [ -182, 56, 1.1 ], [ -212, 58, 1 ], [ -224, 56, 1.2 ],
        ])
        const cherry = make([
            [ -120, 66, 1 ], [ -122, 24, 1.1 ], [ -140, 62, 1 ], [ -158, 24, 1.1 ],
            [ -176, 62, 1 ], [ -206, 60, 1.1 ], [ -220, 66, 1 ],
        ])

        this.birchTrees = new Trees('FPTU Birch', this.game.resources.birchTreesVisualModel.scene, birch, '#ff4f2b', '#ff903f')
        this.oakTrees = new Trees('FPTU Oak', this.game.resources.oakTreesVisualModel.scene, oak, '#b4b536', '#d8cf3b')
        this.cherryTrees = new Trees('FPTU Cherry', this.game.resources.cherryTreesVisualModel.scene, cherry, '#ff6d6d', '#ff9990')

        // Bụi thấp rải khắp cho mặt cỏ đỡ trơ — cùng hệ lá với bụi của đảo chính
        const bushSpots = []
        for(let i = 0; i < 90; i++)
        {
            // Rải tất định bằng dãy Fibonacci góc vàng, bỏ những chỗ rơi vào
            // đường, sân hoặc chân nhà
            const angle = i * 2.39996
            const radius = Math.sqrt(i / 90)
            const x = ISLAND.x + Math.cos(angle) * radius * (ISLAND.width * 0.46)
            const z = ISLAND.z + Math.sin(angle) * radius * (ISLAND.depth * 0.46)

            if(Math.abs(z - AXIS.z) < 7) continue                       // trục lễ nghi
            if(Math.abs(z - THROUGH_ROAD.z) < 7 && x < THROUGH_ROAD.fromX) continue
            if(Math.abs(x - MAIN_ROAD.x) < 6) continue                  // đường dọc trường
            if(Math.abs(x - ALPHA.x) < 6) continue                      // chân toà Alpha
            if(Math.abs(x - LAKE.x) < LAKE.radiusX + 2 && Math.abs(z - LAKE.z) < LAKE.radiusZ + 2) continue

            const object = new THREE.Object3D()
            object.position.set(x, 0, z)
            object.scale.setScalar(0.5 + (i % 5) * 0.14)
            bushSpots.push(object)
        }

        this.bushes = new Foliage(bushSpots, uniform(color('#8fbe45')), uniform(color('#c6d94f')))
    }

    /**
     * Hàng chữ FPT UNIVERSITY — giữa sảnh xếp hạng và thảm cỏ, mặt quay ra cổng.
     * Nạp LƯỜI như `title/letters.glb` nên hỏng file cũng không treo màn tải.
     * Có thân vật lý mỏng để xe không phóng xuyên qua chữ.
     */
    setSign()
    {
        this.game.resourcesLoader.getLoader('gltf').load(
            'fptu/sign.glb',
            (gltf) =>
            {
                const group = new THREE.Group()
                group.name = 'fptuSign'

                const material = this.getMaterial(COLORS.orange)

                gltf.scene.traverse((child) =>
                {
                    if(child.isMesh)
                    {
                        child.material = material
                        child.castShadow = true
                        child.receiveShadow = true
                    }
                })

                group.add(gltf.scene)
                group.scale.setScalar(SIGN.scale)
                group.position.set(SIGN.x, SIGN.y + GROUND_TOP, SIGN.z)
                group.rotation.y = SIGN.rotationY

                this.group.add(group)
                this.sign = group
            },
            undefined,
            () => { console.warn('[FPTU] không nạp được fptu/sign.glb — khu trường vẫn chạy, chỉ thiếu hàng chữ') }
        )

        // Thân vật lý của hàng chữ: chữ gốc rộng 12,53 × cao 1,3 (đo lúc xuất)
        this.game.objects.add(
            null,
            {
                type: 'fixed',
                position: { x: SIGN.x, y: 0.9, z: SIGN.z },
                colliders: [ { shape: 'cuboid', parameters: [ 0.45, 0.9, 12.53 * SIGN.scale * 0.5 ] } ]
            }
        )
    }

    /** Vùng tròn quanh cổng — lái vào là hiện hộp thoại hỏi sinh viên. */
    setGateZone()
    {
        const zone = this.game.zones.create('cylinder', new THREE.Vector3(GATE.x, 0, GATE.z), 8)

        zone.events.on('enter', () =>
        {
            this.quiz.openGate()
        })

        this.gateZone = zone
    }

    /** Các khối "?" dọc hai bên trục — logic giữ nguyên từ bản trước. */
    setQuestionBlocks()
    {
        this.blocks = []

        for(const spot of QUESTION_BLOCKS)
        {
            const group = new THREE.Group()
            group.position.set(spot.x, 1.15, spot.z)
            group.visible = false
            this.group.add(group)

            const body = new THREE.Mesh(this.boxGeometry, this.getMaterial('#f6c945'))
            body.scale.set(1.35, 1.35, 1.35)
            body.castShadow = true
            body.receiveShadow = true
            group.add(body)

            for(const side of [ 1, -1 ])
            {
                const z = side * 0.7
                const mark = this.getMaterial('#5b3d05')

                const arc = new THREE.Mesh(this.boxGeometry, mark)
                arc.scale.set(0.5, 0.18, 0.06)
                arc.position.set(0, 0.36, z)
                group.add(arc)

                const stem = new THREE.Mesh(this.boxGeometry, mark)
                stem.scale.set(0.18, 0.45, 0.06)
                stem.position.set(0.16, 0.06, z)
                group.add(stem)

                const dot = new THREE.Mesh(this.boxGeometry, mark)
                dot.scale.set(0.18, 0.18, 0.06)
                dot.position.set(0, -0.36, z)
                group.add(dot)
            }

            // Khai báo `entry` TRƯỚC khi tạo thân vật lý — onCollision đóng gói nó
            const entry = { group, object: null, used: false }

            entry.object = this.game.objects.add(
                null,
                {
                    type: 'fixed',
                    position: { x: spot.x, y: 1.15, z: spot.z },
                    contactThreshold: 8,
                    enabled: false, // chỉ bật khi người chơi nhận là sinh viên FPT
                    colliders: [ { shape: 'cuboid', parameters: [ 0.68, 0.68, 0.68 ] } ],
                    onCollision: () => this.hitBlock(entry)
                }
            )

            this.blocks.push(entry)
        }

        this.blocksLive = false

        // Bộ câu hỏi nạp bất đồng bộ nên phải soi lại mỗi khung hình
        this.game.ticker.events.on('tick', () => this.refreshBlocks())
    }

    hitBlock(entry)
    {
        if(entry.used || !this.quiz.active)
            return

        if(!this.quiz.ask())
            return

        entry.used = true
        entry.group.visible = false
        entry.object?.physical?.body?.setEnabled(false)
    }

    refreshBlocks()
    {
        const shouldLive = this.quiz.active

        if(shouldLive === this.blocksLive)
            return

        this.blocksLive = shouldLive

        for(const entry of this.blocks)
        {
            if(entry.used) continue
            entry.group.visible = shouldLive
            entry.object?.physical?.body?.setEnabled(shouldLive)
        }
    }
}
