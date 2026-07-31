import * as THREE from 'three/webgpu'
import { color } from 'three/tsl'
import { Game } from '../Game.js'
import { MeshDefaultMaterial } from '../Materials/MeshDefaultMaterial.js'
import { ALPHA, ALPHA_LOBBY, AXIS, THROUGH_ROAD, BASKETBALL, BRIDGE, BUILDINGS, CANTEEN, COLORS, DORMS, FOOTBALL, FORECOURT, GATE, ISLAND, LAKE, LAWN, MAIN_ROAD, MARTIAL, PARKING, QUESTION_BLOCKS, RANKING_PLAZA, RANKING_SIGN, SIGN, STATUE } from '../../data/fptu.js'
import { FptuQuiz } from './FptuQuiz.js'
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
        this.setStatue()
        this.setLake()
        this.setSports()
        this.setCanteen()
        this.setParking()
        this.setPalms()
        this.setTrees()
        this.setSign()

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

    box(width, height, depth, x, y, z, hex, { rotationY = 0, rotationZ = 0, physical = false, geometry = null, castShadow = true } = {})
    {
        const mesh = new THREE.Mesh(geometry ?? this.boxGeometry, this.getMaterial(hex))
        mesh.scale.set(width, height, depth)
        mesh.position.set(x, y, z)
        mesh.rotation.order = 'YZX'
        mesh.rotation.y = rotationY
        mesh.rotation.z = rotationZ
        mesh.castShadow = castShadow
        mesh.receiveShadow = true
        this.group.add(mesh)

        if(physical)
        {
            const quaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotationY)

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
        return this.box(width, 0.04, depth, x, y, z, hex, { castShadow: false })
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
        const bandW = 3
        const outerW = ISLAND.width + bandW * 2
        for(const side of [ -1, 1 ])
        {
            this.box(outerW, 1.1, bandW, ISLAND.x, GROUND_TOP - 0.78, ISLAND.z + side * (ISLAND.depth * 0.5 + bandW * 0.5), '#d8b47e', { castShadow: false })
            this.box(bandW, 1.1, ISLAND.depth, ISLAND.x + side * (ISLAND.width * 0.5 + bandW * 0.5), GROUND_TOP - 0.78, ISLAND.z, '#d8b47e', { castShadow: false })
        }

        /**
         * Nền đảo dựng thành BỐN DẢI chừa một lỗ đúng chỗ hồ sen, thay vì một
         * phiến liền.
         *
         * Vì sao bõ công: mặt biển của game (`WaterSurface`) là mặt phẳng bám
         * theo máy quay ở cao độ `water.surfaceElevation = −0,3`, tức CAO HƠN
         * đáy đảo. Khoét thủng nền là nước thật trồi lên thành hồ — có gợn
         * sóng, có loang màu, có đóng băng khi trời lạnh, xe lội xuống còn nghe
         * tiếng nước. Đắp một tấm phẳng màu xanh như bản trước thì chỉ ra miếng
         * bìa, đúng như người dùng chê "vuông, nhọn như đồ chơi".
         */
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
        const columns = 18
        const stripW = (LAKE.radiusX * 2) / columns

        const ground = []

        // Hai mảng lớn hai bên hồ
        ground.push({ x0: ISLAND.x - halfW, x1: LAKE.x - LAKE.radiusX, z0: ISLAND.z - halfD, z1: ISLAND.z + halfD })
        ground.push({ x0: LAKE.x + LAKE.radiusX, x1: ISLAND.x + halfW, z0: ISLAND.z - halfD, z1: ISLAND.z + halfD })

        // Các cột trong bề ngang hồ: chừa dây cung bầu dục ở giữa
        for(let i = 0; i < columns; i++)
        {
            const x0 = LAKE.x - LAKE.radiusX + i * stripW
            const x1 = x0 + stripW

            // Dùng mép NGOÀI của cột (điểm xa tâm nhất) để dây cung không ăn
            // lẹm vào đất — thà bờ dày hơn một chút còn hơn thủng lỗ chỗ
            const dx = Math.max(Math.abs(x0 - LAKE.x), Math.abs(x1 - LAKE.x)) / LAKE.radiusX
            const halfChord = dx >= 1 ? 0 : LAKE.radiusZ * Math.sqrt(1 - dx * dx)

            ground.push({ x0, x1, z0: ISLAND.z - halfD, z1: LAKE.z - halfChord })
            ground.push({ x0, x1, z0: LAKE.z + halfChord, z1: ISLAND.z + halfD })
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
         * Không đắp bờ hay đáy gì cả: miệng hồ đã khoét hình bầu dục ở
         * `setIsland`, nên nhìn xuống là MẶT NƯỚC THẬT của game — cùng thứ nước
         * làm nên mấy cái hồ đẹp của bản đồ gốc: có sóng lượn, loang màu theo
         * trời, đóng băng khi lạnh.
         *
         * Việc ở đây chỉ là thả sen. Hồ sen của trường PHỦ KÍN lá (xem ảnh
         * thật), nên rải dày theo CỤM chứ không lác đác: gom quanh vài tâm cụm,
         * lệch nhau tất định, chừa khoảng nước trống ở giữa cho thấy mặt nước.
         */
        const clusters = [
            { x: -0.45, z: -0.35, n: 14 }, { x: 0.35, z: -0.5, n: 12 },
            { x: -0.6, z: 0.4, n: 12 }, { x: 0.5, z: 0.35, n: 14 },
            { x: 0.05, z: 0.62, n: 10 }, { x: -0.15, z: -0.68, n: 10 },
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

                // Bỏ lá rơi ra ngoài mép bầu dục
                if(nx * nx + nz * nz > 0.9) continue

                const x = LAKE.x + nx * LAKE.radiusX
                const z = LAKE.z + nz * LAKE.radiusZ
                const size = 0.85 + rand() * 0.75

                // Lá sen — tấm tròn dẹt nổi sát mặt nước
                this.box(size, 0.05, size, x, waterY + 0.025, z, i % 3 === 0 ? '#3f8f4a' : '#4f9e4a', { castShadow: false, geometry: this.cylinderGeometry })
            }
        }

        // Vài bông sen hồng nhô lên — cánh xoè quanh nhuỵ vàng
        const blooms = [
            [ -0.35, -0.3 ], [ 0.42, -0.42 ], [ -0.5, 0.45 ], [ 0.46, 0.3 ], [ 0.02, 0.6 ], [ -0.1, -0.6 ], [ 0.2, 0.02 ],
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
     * Tượng SELF MADE MAN — người tự đục đẽo nên chính mình, biểu tượng đặt
     * giữa vườn ký túc xá của trường thật. Ghép khối: gò cỏ → bệ đá → tảng đá
     * đang đục → thân nghiêng → tay giơ búa.
     */
    setStatue()
    {
        const { x, z } = STATUE

        this.box(3.4, 0.55, 3.4, x, GROUND_TOP + 0.27, z, COLORS.grass, { geometry: this.cylinderGeometry, castShadow: false })
        this.box(1.15, 1.3, 1.15, x, 1.2, z, COLORS.stone, { physical: true })
        this.box(0.85, 0.75, 0.85, x + 0.12, 2.2, z, '#3f3428')
        this.box(0.5, 1.05, 0.4, x, 2.85, z, COLORS.bronze, { rotationZ: 0.16 })
        this.box(0.3, 0.3, 0.3, x + 0.08, 3.55, z, COLORS.bronze)
        this.box(0.15, 0.85, 0.15, x - 0.12, 3.85, z + 0.16, COLORS.bronze, { rotationZ: -0.32 })
        this.box(0.5, 0.1, 0.1, x - 0.36, 4.3, z + 0.16, '#6b4a2a')
        this.box(0.16, 0.24, 0.24, x - 0.6, 4.3, z + 0.16, '#3a3a3a')
        this.box(0.14, 0.6, 0.14, x + 0.34, 2.7, z - 0.08, COLORS.bronze, { rotationZ: 0.5 })
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
        const make = (list) => list.map(([ x, z, scale ]) =>
        {
            const object = new THREE.Object3D()
            object.position.set(x, 0, z)
            object.scale.setScalar(scale)
            return object
        })

        // Ba loại cây, đặt tránh trục đường và tránh chân nhà
        const birch = make([
            [ -104, 30, 1.1 ], [ -104, 52, 1 ], [ -122, 12, 1.2 ], [ -131, 22, 1 ],
            [ -150, 58, 1.1 ], [ -166, 34, 1 ], [ -178, 30, 1.2 ], [ -196, 34, 1 ],
        ])
        const oak = make([
            [ -110, 20, 1.2 ], [ -127, 30, 1 ], [ -134, 14, 1.1 ], [ -145, 56, 1.2 ],
            [ -158, 52, 1 ], [ -172, 26, 1.1 ], [ -190, 46, 1 ], [ -200, 22, 1.2 ],
        ])
        const cherry = make([
            [ -116, 32, 1 ], [ -124, 50, 1.1 ], [ -140, 30, 1 ], [ -152, 12, 1.1 ],
            [ -164, 46, 1 ], [ -182, 20, 1.1 ], [ -194, 60, 1 ],
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
