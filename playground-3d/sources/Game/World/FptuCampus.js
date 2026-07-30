import * as THREE from 'three/webgpu'
import { color } from 'three/tsl'
import { Game } from '../Game.js'
import { MeshDefaultMaterial } from '../Materials/MeshDefaultMaterial.js'
import { ALPHA, AXIS, BASKETBALL, BRIDGE, BUILDINGS, CANTEEN, COLORS, DORMS, FOOTBALL, FORECOURT, GATE, ISLAND, LAKE, LAWN, MAIN_ROAD, MARTIAL, PARKING, QUESTION_BLOCKS, RANKING_PLAZA, RANKING_SIGN, SIGN, STATUE } from '../../data/fptu.js'
import { FptuQuiz } from './FptuQuiz.js'

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

    /** Tấm phẳng nằm trên mặt đảo (đường, sân, thảm cỏ) — không thân vật lý. */
    slab(width, depth, x, z, hex, { y = GROUND_TOP + 0.02 } = {})
    {
        return this.box(width, 0.05, depth, x, y, z, hex, { castShadow: false })
    }

    /**
     * Nền đảo: một phiến lớn nổi trên biển, viền cát thò ra quanh mép để nhìn
     * nghiêng ra dáng bờ đảo chứ không phải tấm ván trôi.
     */
    setIsland()
    {
        // Viền cát — to hơn nền một vòng, mặt thấp hơn một bậc
        this.box(ISLAND.width + 5, 1.1, ISLAND.depth + 5, ISLAND.x, GROUND_TOP - 0.72, ISLAND.z, '#d8b47e', { castShadow: false })

        // Nền chính — mặt cỏ
        this.box(ISLAND.width, 1.5, ISLAND.depth, ISLAND.x, GROUND_TOP - 0.73, ISLAND.z, COLORS.grass, { castShadow: false })

        // Thân vật lý mặt đảo: một hộp mỏng đúng bằng mặt trên
        this.game.objects.add(
            null,
            {
                type: 'fixed',
                friction: 0.25,
                restitution: 0,
                position: { x: ISLAND.x, y: GROUND_TOP - 0.5, z: ISLAND.z },
                colliders: [ { shape: 'cuboid', parameters: [ (ISLAND.width + 5) * 0.5, 0.5, (ISLAND.depth + 5) * 0.5 ] } ]
            }
        )
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
            this.slab(0.9, 0.18, MAIN_ROAD.x, MAIN_ROAD.z - MAIN_ROAD.length * 0.5 + 5 + i * 8.4, '#e8e4da', { y: GROUND_TOP + 0.045 })

        // Trục lễ nghi từ cổng vào
        const axisLength = Math.abs(AXIS.toX - AXIS.fromX)
        this.slab(axisLength, AXIS.halfWidth * 2, (AXIS.fromX + AXIS.toX) * 0.5, AXIS.z, COLORS.road)

        // Sảnh gạch đỏ quanh biển xếp hạng
        this.slab(RANKING_PLAZA.width, RANKING_PLAZA.depth, RANKING_PLAZA.x, RANKING_PLAZA.z, COLORS.plazaBrick)

        // Thảm cỏ giữa hàng chữ và toà Alpha, lối đi bộ lát gạch ở giữa
        this.slab(LAWN.width, LAWN.depth, LAWN.x, LAWN.z, '#79a844')
        this.slab(LAWN.width, 6.5, LAWN.x, LAWN.z, COLORS.plazaBrick)

        // Sân trước chân toà Alpha
        this.slab(FORECOURT.width, FORECOURT.depth, FORECOURT.x, FORECOURT.z, '#a8a294')
    }

    /**
     * Biển "top xếp hạng đại học thế giới" giữa sảnh — như tấm biển đá STARS
     * trong ảnh cổng trường. Xe vòng qua hai bên (sảnh rộng 30, biển chỉ 9).
     */
    setRankingSign()
    {
        const { x, z, height, width } = RANKING_SIGN

        // Bệ + thân biển
        this.box(1.6, 0.5, width + 1.2, x, 0.25, z, '#7c6f5a', { physical: true })
        this.box(1, height, width, x, height * 0.5 + 0.5, z, '#8d7f68', { physical: true })

        // Logo FPT ba khối màu ở mặt hướng ra cổng (+X), canh đúng tâm biển
        this.box(0.16, 0.75, 1.35, x + 0.56, height - 0.35, z - 1.5, COLORS.orange)
        this.box(0.16, 0.75, 1.35, x + 0.56, height - 0.35, z, COLORS.green)
        this.box(0.16, 0.75, 1.35, x + 0.56, height - 0.35, z + 1.5, COLORS.blue)

        // Hàng năm sao — biển xếp hạng, cũng canh tâm
        for(let i = 0; i < 5; i++)
            this.box(0.14, 0.55, 0.55, x + 0.56, height - 1.5, z + (i - 2) * 1.15, '#f6c945', { rotationZ: Math.PI * 0.25 })

        // Dải chân biển màu cam
        this.box(0.16, 0.5, width - 0.8, x + 0.56, 0.9, z, COLORS.orange)
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

            // Thân cột
            this.box(ALPHA.depth, height, ALPHA.columnWidth, xCenter, height * 0.5, zCenter, COLORS.wall, { physical: true })

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

                    darkCells.push({ x: cellX, y: cellY, z: cellZ, w: cellW * 0.8, h: ALPHA.floorHeight * 0.74 })

                    if(hasFoliage(floor, globalCell))
                        foliageCells.push({ x: cellX + 0.1, y: cellY - ALPHA.floorHeight * 0.2, z: cellZ })
                }
            }
        })

        // Sảnh vào ở giữa: khoang tối cao 1,5 tầng giữa hai cột trung tâm
        this.box(0.5, ALPHA.floorHeight * 1.4, 5.5, ALPHA.x + ALPHA.depth * 0.5 + 0.08, ALPHA.floorHeight * 0.7, ALPHA.z, COLORS.windowDark)

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
    setLake()
    {
        this.box(LAKE.radiusX * 2 + 1.8, 0.06, LAKE.radiusZ * 2 + 1.8, LAKE.x, GROUND_TOP + 0.03, LAKE.z, '#d8b47e', { castShadow: false })
        this.box(LAKE.radiusX * 2, 0.07, LAKE.radiusZ * 2, LAKE.x, GROUND_TOP + 0.055, LAKE.z, COLORS.water, { castShadow: false })

        for(let i = 0; i < 34; i++)
        {
            const angle = i * 2.39996
            const radius = 0.22 + (i % 8) / 10
            const x = LAKE.x + Math.cos(angle) * LAKE.radiusX * radius
            const z = LAKE.z + Math.sin(angle) * LAKE.radiusZ * radius

            this.box(1, 0.05, 1, x, GROUND_TOP + 0.1, z, '#3f8f4a', { castShadow: false })
            if(i % 4 === 0)
                this.box(0.28, 0.4, 0.28, x, GROUND_TOP + 0.3, z, '#ff8fb0')
        }
    }

    /** Sân bóng rổ (góc Bắc cạnh đường) + sân bóng đá (giữa trường) + sân võ. */
    setSports()
    {
        // Bóng rổ — mặt xanh dương như ảnh bản đồ
        this.slab(BASKETBALL.width, BASKETBALL.depth, BASKETBALL.x, BASKETBALL.z, COLORS.court)

        for(const side of [ -1, 1 ])
        {
            const z = BASKETBALL.z + side * (BASKETBALL.depth * 0.5 - 0.7)
            this.box(0.22, 3.1, 0.22, BASKETBALL.x, 1.55, z, '#5a5a5a', { physical: true })
            this.box(0.12, 0.9, 1.5, BASKETBALL.x, 3.2, z - side * 0.5, COLORS.wall)
        }

        // Bóng đá — khung thành hai đầu
        this.slab(FOOTBALL.width, FOOTBALL.depth, FOOTBALL.x, FOOTBALL.z, COLORS.pitch)
        this.slab(FOOTBALL.width - 1.6, 0.2, FOOTBALL.x, FOOTBALL.z, '#e8e4da', { y: GROUND_TOP + 0.045 })

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
            this.slab(PARKING.width - 1, 0.16, PARKING.x, PARKING.z - PARKING.depth * 0.5 + 2 + i * 4, '#e8e4da', { y: GROUND_TOP + 0.045 })

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

    /** Cây tán tròn rải quanh đảo cho có "công viên xanh" — tránh trục và nhà. */
    setTrees()
    {
        const spots = [
            { x: -105, z: 32 }, { x: -105, z: 52 }, { x: -110, z: 74 },
            { x: -122, z: 10 }, { x: -131, z: 20 }, { x: -158, z: 57 },
            { x: -178, z: 30 }, { x: -180, z: 52 }, { x: -127, z: 74 },
            { x: -156, z: 22 }, { x: -128, z: 52 },
        ]

        for(const spot of spots)
        {
            this.box(0.4, 2.2, 0.4, spot.x, 1.1, spot.z, COLORS.trunk, { physical: true, geometry: this.cylinderGeometry })
            this.box(2.4, 2, 2.4, spot.x, 3.1, spot.z, '#6f9e3f', { castShadow: false })
            this.box(1.7, 1, 1.7, spot.x, 4.35, spot.z, '#7fae4a', { castShadow: false })
        }
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
