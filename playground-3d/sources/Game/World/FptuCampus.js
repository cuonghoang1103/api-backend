import * as THREE from 'three/webgpu'
import { attribute, color } from 'three/tsl'
import { Game } from '../Game.js'
import { MeshDefaultMaterial } from '../Materials/MeshDefaultMaterial.js'
import { ALPHA, ALPHA_LOBBY, SWAN_LAKE, LAKE_ISLET, AXIS, THROUGH_ROAD, BASKETBALL, BRIDGE, BUILDINGS, CANTEEN, COLORS, DORMS, FOOTBALL, FORECOURT, GATE, ISLAND, LAKE, LAWN, MAIN_ROAD, MARTIAL, PARKING, QUESTION_BLOCKS, RANKING_PLAZA, RANKING_SIGN, SIGN, STATUE } from '../../data/fptu.js'
import { FptuQuiz } from './FptuQuiz.js'
import { FptuPineHill } from './FptuPineHill.js'
import { FptuSwans } from './FptuSwans.js'
import { FptuProps } from './FptuProps.js'
import { FptuPeople } from './FptuPeople.js'
import { FptuLights } from './FptuLights.js'
import { FptuSigns } from './FptuSigns.js'
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
 * - Đảo cũ gần như nguyên trạng. (Ghi chú cũ nói "không đặt khối nào trong
 *   ±96" — nay SAI: từ lần nới đảo gấp đôi, mép Đông đảo trường ở x = −82 nên
 *   có lấn vào rìa Tây đảo chính. Đã lái thử ngày 31/7: đi lại giữa hai đảo
 *   thông suốt, không có bậc nào chặn.)
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
 * 3. Ra khỏi địa hình vẫn có thứ đỡ xe — nhưng KHÔNG phải sàn 1000×1000 như
 *    ghi chú cũ nói: `World.setPhysicalFloor()` được định nghĩa mà KHÔNG AI
 *    GỌI. Thứ đỡ thật là `Floor.bedRock`, một tấm 12×12 bám theo xe, chỉ bật
 *    khi |x| hoặc |z| > 90 (đo ngày 31/7). Đảo trường nằm ở x −242…−82 nên
 *    luôn nằm ngoài ngưỡng đó, tức lúc nào cũng có tấm này bên dưới.
 */

/** Ô caro là ĐẶC hay RỖNG — băm tất định, KHÔNG dùng Math.random. */
const isDarkCell = (i, j) => ((((i * 73856093) ^ (j * 19349663)) >>> 0) % 100) < 46

/** Có trồng cây trong ô rỗng không — cũng tất định. */
const hasFoliage = (i, j) => ((((i * 83492791) ^ (j * 29349643)) >>> 0) % 100) < 40

const GROUND_TOP = 0.04 // mặt đảo cao hơn "đáy biển" vật lý (−0,01) chừng này

/** Đáy biển quanh đảo. Thấp hơn mực nước (−0,3) đủ để ra dáng chỗ nước sâu. */
const SEA_FLOOR = -1.6

/** Đáy hai cái hồ trong sân trường — nông, xe lội qua được. */
const LAKE_FLOOR = -0.75

/**
 * Bề rộng bãi bờ, tính theo TỈ LỆ bán kính đảo (0,13 ≈ 10 đơn vị ở cạnh dài).
 * Thoải cỡ này thì xe bò lên từ mọi phía mà không cần tìm "bến".
 */
const ISLAND_SHORE = 0.13

/** Màu mặt đảo theo cao độ — cỏ, cát, nước nông, đáy hồ. */
const ISLAND_PALETTE = {
    grass: '#6f9e3f',
    sand: '#d8b47e',
    shallow: '#4d8a86',
    bed: '#3d6f57',
    deep: '#27515e',
}

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

        // Cao độ mặt đảo, để các bộ phận khác (đồi thông…) khỏi phải đoán lại
        this.groundTop = GROUND_TOP

        /**
         * Mọi TÁN LÁ MỀM (hàng rào cây, cây trên bậc Alpha, cây cù lao…) chỉ
         * ghi MỐC vào mảng này; cuối hàm dựng gom hết thành MỘT hệ `Foliage` —
         * đúng hệ lá của bản mẫu (phiến xoay, chuyển sắc, lay theo gió), và cả
         * trăm cụm vẫn chỉ một lệnh vẽ.
         */
        this.canopySpots = []

        this.setIsland()
        this.setBridge()
        this.setGate()
        this.setGround()
        this.setAlpha()
        this.setBuildings()
        this.setDorms()
        this.setLake()
        this.setSports()
        this.setCanteen()
        this.setParking()
        this.setPalms()
        this.setTrees()

        this.setSwanLake()

        this.pineHill = new FptuPineHill(this)
        this.swans = new FptuSwans(this)

        // Đồ đạc sân trường — đặt SAU mọi công trình vì nó đọc vùng cấm từ
        // chính các công trình đó để tự tránh
        this.props = new FptuProps(this)

        // Người phải dựng SAU đồ đạc: nó dùng chung `props.blocked()` để khỏi
        // đứng giữa lòng đường hay lọt vào trong tường
        this.people = new FptuPeople(this)

        // Đèn dựng SAU cột đèn của props (nó cần danh sách mặt kính) và sau
        // đồi/cù lao (đèn phải đứng đúng cao độ mặt đất đã đổi)
        this.lights = new FptuLights(this)

        // Biển xếp hạng + bệ kê hàng chữ. Dựng SAU `canopy()` gom mốc lá vì nó
        // trồng thêm bụi hoa dưới chân biển, và TRƯỚC khi hệ lá chung dựng.
        this.signs = new FptuSigns(this)

        // Hàng chữ nạp SAU khi có bệ — nó đặt chữ lên `signs.plinthTop`
        this.setSign()

        /**
         * Hệ lá chung — dựng SAU CÙNG để gom đủ mốc từ mọi nơi (kể cả hàng rào
         * cây của FptuProps). User chụp ba tấm ảnh chê "cây vuông như
         * Minecraft": hộp xanh trên bậc Alpha, hàng rào hộp, tán trụ cù lao —
         * tất cả nay đi qua đây.
         */
        this.leafClusters = new Foliage(this.canopySpots, uniform(color('#7fb43f')), uniform(color('#b4d150')))

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
        /**
         * Tấm lát nay MỎNG và SÁT mặt đất.
         *
         * Bản trước để mặt tấm cao tới 0,11–0,20 trong khi mặt CỨNG mà bánh xe
         * đứng vẫn là 0,04 — chênh 10–16 phân, nên xe trông như lún nửa bánh
         * xuống sân. User báo đúng chỗ này ("đi đang bị lún"). Tấm lát không có
         * thân vật lý nên cách rẻ nhất là hạ nó xuống sát mặt đất: chênh còn
         * 1,5–5,7 phân, mắt không thấy nữa.
         *
         * Khoảng cách giữa các lớp giữ 1,4 phân — vẫn đủ tách bạch chiều sâu ở
         * cỡ khung hình này (cặp gây nhiễu hôm nay là hai tấm cách nhau ĐÚNG 0,
         * không phải do lớp quá sát).
         */
        const y = GROUND_TOP + 0.05 + layer * 0.03
        // `receiveShadow: false` — mặt lát nằm sát ngay trên mặt đảo, cả hai
        // cùng nhận bóng thì bóng tính ở hai độ sâu chênh nhau vài phân, ra
        // đúng những vệt răng cưa chạy loạn (shadow acne). Nền đảo vẫn nhận
        // bóng nên bóng nhà đổ xuống sân vẫn còn.
        /**
         * Tấm lát nay CÓ THÂN VẬT LÝ.
         *
         * Đây mới là gốc của "đi đang bị lún": tấm lát chỉ là hình, mặt cứng mà
         * bánh xe đứng vẫn là mặt đảo ở 0,04, nên xe chìm 10–16 phân dưới mặt
         * sân. Hạ tấm xuống chỉ giấu bớt triệu chứng, mà lại làm các lớp sát
         * nhau hơn. Cho tấm một thân vật lý là xe đứng ĐÚNG trên mặt sân, và
         * mép sân thành cái bó vỉa cao 1–3 phân — xe leo qua không thấy gì.
         */
        return this.box(width, 0.04, depth, x, y, z, hex, { castShadow: false, receiveShadow: false, physical: true })
    }

    /**
     * Ghi một MỐC TÁN LÁ. `Foliage` đọc `matrix`/`matrixWorld` nên PHẢI
     * updateMatrix trước (bẫy Trees cũ: quên là hình hiện ở gốc toạ độ).
     */
    canopy(x, y, z, scale)
    {
        const object = new THREE.Object3D()
        object.position.set(x, y, z)
        object.scale.setScalar(scale)
        object.updateMatrix()
        object.updateMatrixWorld(true)
        this.canopySpots.push(object)
    }

    /**
     * MẢNG ĐỊA HÌNH MƯỢT — một hàm cao độ duy nhất sinh ra CẢ hình LẪN va chạm.
     *
     * Vì sao phải có: mọi chỗ "xe kẹt" của khu này đều sinh ra từ cùng một kiểu
     * làm — ghép nhiều hộp nghiêng lại thành một cái dốc. Hộp ghép bao giờ cũng
     * hở, chồng hoặc bị nền đè, và mỗi khe hở là một cái bậc bánh xe không leo
     * nổi. Đo ngày 31/7: bờ hồ thiên nga còn nguyên một bậc 0,71 ở hai đầu.
     *
     * Cách này thì không thể lệch: `fn` vừa kéo đỉnh lưới của hình, vừa nạp
     * mảng cao độ cho `heightfield` của Rapier. Hình mượt thì va chạm mượt.
     *
     * ⚠️ Quy ước chỉ số của heightfield lấy Y HỆT `Floor.setPhysical()`
     * (`heights[iz + ix * n]`) — chỗ duy nhất trong dự án đã chạy đúng thật.
     * Vẫn phải bắn tia kiểm lại sau khi dựng, đừng tin quy ước suông.
     *
     * @param fn (x, z) → cao độ tuyệt đối
     */
    heightPatch(cx, cz, sizeX, sizeZ, cols, rows, fn, hex, colorFn = null)
    {
        const geometry = new THREE.PlaneGeometry(sizeX, sizeZ, cols, rows)
        geometry.rotateX(-Math.PI * 0.5)

        const position = geometry.attributes.position
        for(let i = 0; i < position.count; i++)
            position.setY(i, fn(position.getX(i) + cx, position.getZ(i) + cz))
        geometry.computeVertexNormals()

        let material
        if(colorFn)
        {
            // Màu theo ĐỈNH: một tấm địa hình duy nhất mà vẫn có cỏ, cát, nước
            // nông và đáy hồ — khỏi phải chồng thêm mặt nào lên nhau (chồng mặt
            // chính là nguồn gốc của cảnh "nhiễu sóng" đã gặp).
            const colors = new Float32Array(position.count * 3)
            const tmp = new THREE.Color()
            for(let i = 0; i < position.count; i++)
            {
                tmp.set(colorFn(position.getX(i) + cx, position.getZ(i) + cz, position.getY(i)))
                colors[i * 3] = tmp.r
                colors[i * 3 + 1] = tmp.g
                colors[i * 3 + 2] = tmp.b
            }
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

            if(!this.vertexColorMaterial)
                this.vertexColorMaterial = new MeshDefaultMaterial({ colorNode: attribute('color') })
            material = this.vertexColorMaterial
        }
        else
        {
            material = this.getMaterial(hex)
        }

        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.set(cx, 0, cz)
        mesh.receiveShadow = true
        mesh.castShadow = false
        this.group.add(mesh)

        const nx = cols + 1
        const nz = rows + 1
        const heights = new Float32Array(nx * nz)
        for(let ix = 0; ix < nx; ix++)
            for(let iz = 0; iz < nz; iz++)
                heights[iz + ix * nz] = fn(
                    cx - sizeX * 0.5 + (ix / cols) * sizeX,
                    cz - sizeZ * 0.5 + (iz / rows) * sizeZ,
                )

        /**
         * ⚠️ THỨ TỰ HAI THAM SỐ ĐẦU: `nrows` là số ô theo trục **Z**, `ncols`
         * theo trục **X** — KHÔNG phải ngược lại.
         *
         * Suy ra từ `Floor.setPhysical()`, chỗ duy nhất trong dự án đã chạy
         * đúng thật: nó nạp `heights[iz + ix * rowsCount]`, tức chỉ số HÀNG
         * chạy theo z (ma trận của Rapier xếp theo cột). Lưới địa hình là hình
         * vuông nên ở đó đổi chỗ hai tham số cũng chẳng ai thấy — còn hồ thì
         * dẹt (36 × 26) nên đổi chỗ là lộ ngay: đo ngày 31/7 thấy cao độ dọc
         * trục Z trả về đúng giá trị "ngoài hồ" ở chỗ lẽ ra còn là thành hồ.
         */
        this.game.objects.add(null, {
            type: 'fixed',
            friction: 0.35,
            restitution: 0,
            position: { x: cx, y: 0, z: cz },
            colliders: [ { shape: 'heightfield', parameters: [ rows, cols, heights, { x: sizeX, y: 1, z: sizeZ } ] } ]
        })

        return mesh
    }

    /**
     * NỀN ĐẢO — một mảng địa hình LIỀN, dựng từ đúng một hàm cao độ.
     *
     * Bản trước ghép hơn hai trăm hộp: nền chia thành cột dọc, cộng bốn tấm
     * nghiêng làm bờ. Mỗi mối ghép là một chỗ có thể hở, và đo ngày 31/7 vẫn
     * còn bậc 0,77 ở bờ Bắc — leo lên không nổi. Nay cả nền, cả bờ, cả hai lòng
     * hồ chỉ là MỘT `heightPatch`: không còn mối ghép thì không còn bậc.
     *
     * Tiện thể sửa luôn chỗ người dùng chê "vuông với nhọn": mép đảo không còn
     * là hình chữ nhật mà là SIÊU-ELLIPSE bậc 4 (bốn góc bo tròn) rồi cộng thêm
     * hai tầng sóng nhẹ, nên đường bờ uốn lượn tự nhiên như bờ biển thật.
     */
    islandHeight(x, z)
    {
        const nx = (x - ISLAND.x) / (ISLAND.width * 0.5)
        const nz = (z - ISLAND.z) / (ISLAND.depth * 0.5)

        // Siêu-ellipse bậc 4: gần chữ nhật ở giữa cạnh, bo tròn ở bốn góc
        let d = Math.pow(Math.pow(Math.abs(nx), 4) + Math.pow(Math.abs(nz), 4), 0.25)

        // Sóng bờ: hai tần số lệch pha, biên độ nhỏ — đủ để bờ hết thẳng đơ mà
        // không ăn vào chỗ đã có công trình (biên độ tối đa ~5% bán kính)
        const theta = Math.atan2(nz, nx)
        d /= 1 + 0.035 * Math.sin(theta * 3 + 0.6) + 0.018 * Math.sin(theta * 7 - 1.1)

        let y
        if(d <= 1)
        {
            y = GROUND_TOP
        }
        else
        {
            // Bờ thoải xuống đáy biển. Dốc bằng 0 ở mép đất (không có gờ) và
            // bằng 0 ở đáy (không có hố) — cùng kiểu đường cong với lòng hồ.
            const t = Math.min(1, (d - 1) / ISLAND_SHORE)
            const s = t * t * (3 - 2 * t)
            y = GROUND_TOP + (SEA_FLOOR - GROUND_TOP) * s
        }

        // Khoét hai cái hồ vào chính mặt đất này
        for(const lake of [ LAKE, SWAN_LAKE ])
        {
            const rx = lake.radiusX ?? lake.radius
            const rz = lake.radiusZ ?? lake.radius
            const r = Math.hypot((x - lake.x) / rx, (z - lake.z) / rz)
            if(r >= 1) continue

            const wall = Math.min(6, Math.min(rx, rz) * 0.45) / Math.min(rx, rz)
            const inner = 1 - wall
            const bed = r <= inner
                ? LAKE_FLOOR
                : LAKE_FLOOR + (GROUND_TOP - LAKE_FLOOR) * (() =>
                {
                    const t = (r - inner) / wall
                    return t * t * (3 - 2 * t)
                })()

            y = Math.min(y, bed)
        }

        return y
    }

    /**
     * Màu mặt đảo theo cao độ, PHA LIÊN TỤC.
     *
     * Bản đầu cắt màu theo ngưỡng cứng: mỗi đỉnh lưới nhận trọn một màu nên
     * ranh giới cát–cỏ chạy men theo cạnh tam giác, ra đúng dải RĂNG CƯA nhìn
     * thấy trong ảnh chụp. Pha dần thì mắt không còn thấy cái lưới nữa.
     *
     * Cộng thêm một chút nhiễu TẤT ĐỊNH (băm từ toạ độ, không dùng
     * Math.random để bản dựng còn tái lập được) cho mép bãi cát khỏi đều tăm
     * tắp như vẽ bằng compa.
     */
    islandColor(x, z, y)
    {
        if(!this._colorScratch)
        {
            this._colorScratch = new THREE.Color()
            this._colorStops = [
                { y: SEA_FLOOR, c: new THREE.Color(ISLAND_PALETTE.deep) },
                { y: -0.62, c: new THREE.Color(ISLAND_PALETTE.bed) },
                { y: -0.24, c: new THREE.Color(ISLAND_PALETTE.shallow) },
                { y: -0.05, c: new THREE.Color(ISLAND_PALETTE.sand) },
                { y: GROUND_TOP - 0.005, c: new THREE.Color(ISLAND_PALETTE.sand) },
                { y: GROUND_TOP, c: new THREE.Color(ISLAND_PALETTE.grass) },
            ]
        }

        /**
         * Nhiễu CHỈ rắc ở vùng ven nước.
         *
         * Bản đầu rắc đều khắp với biên độ ±4 phân, trong khi dải chuyển cỏ→cát
         * chỉ dày 0,5 phân — nên đất bằng phẳng trong sân trường cũng bị đẩy
         * sang màu cát, mặt cỏ nổi vệt loang lổ như bị hắt sơn (thấy rõ trong
         * ảnh chụp khu ký túc xá). Đất bằng thì y đúng bằng GROUND_TOP, nên chỉ
         * cần chừa nó ra là xong, mà mép bãi cát vẫn ráp tự nhiên.
         */
        let yy = y
        if(y < GROUND_TOP - 0.002)
        {
            const h = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453
            yy += (h - Math.floor(h) - 0.5) * 0.07
        }

        const stops = this._colorStops
        if(yy <= stops[0].y) return stops[0].c
        for(let i = 1; i < stops.length; i++)
        {
            if(yy > stops[i].y) continue
            const a = stops[i - 1], b = stops[i]
            const t = (yy - a.y) / (b.y - a.y)
            return this._colorScratch.copy(a.c).lerp(b.c, t)
        }
        return stops[stops.length - 1].c
    }

    setIsland()
    {
        const width = ISLAND.width + ISLAND.width * ISLAND_SHORE + 12
        const depth = ISLAND.depth + ISLAND.depth * ISLAND_SHORE + 12

        this.heightPatch(
            ISLAND.x, ISLAND.z, width, depth,
            Math.round(width / 1.15), Math.round(depth / 1.15),
            (x, z) => this.islandHeight(x, z),
            null,
            (x, z, y) => this.islandColor(x, z, y),
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

        /**
         * Lan can THẬT: hai thanh ngang mảnh trên hàng trụ con — bản trước là
         * một bức tường đặc cao 0,55 chạy suốt cầu, user chụp ảnh chê "bậc
         * trắng trắng vuông". Cả hai thanh đều có thân vật lý: khe giữa chúng
         * (0,28 → 0,55) nhỏ hơn bánh xe nên vẫn không lọt xuống biển được.
         */
        for(const side of [ -1, 1 ])
        {
            const zz = BRIDGE.z + side * (BRIDGE.width * 0.5 + 0.2)

            this.box(length, 0.14, 0.22, centerX, GROUND_TOP + 0.66, zz, '#e3ded2', { physical: true })
            this.box(length, 0.1, 0.16, centerX, GROUND_TOP + 0.3, zz, '#cfc9bb', { physical: true, castShadow: false })

            const posts = Math.round(length / 1.15)
            for(let i = 0; i <= posts; i++)
                this.box(0.12, 0.66, 0.12, centerX - length * 0.5 + (i / posts) * length, GROUND_TOP + 0.33, zz, '#d8d3c7', { castShadow: false })
        }
    }

    /** Cổng chính — hai trụ, thanh ngang cam, biển đá + logo FPT, bốt bảo vệ. */
    setGate()
    {
        const { x, z } = GATE
        const opening = 6.5 // nửa độ rộng lối vào — trục đường rộng 9 nên dư sức

        // Trụ cổng có ĐẾ LOE, GỜ và MŨ — hết cảnh hai cột hộp trơn user chê
        for(const side of [ -1, 1 ])
        {
            const pz = z + side * opening
            this.box(1.7, 0.5, 1.7, x, 0.25, pz, '#b9b2a2', { physical: true })
            this.box(1.25, 4.3, 1.25, x, 2.55, pz, COLORS.wall, { physical: true })
            // Panel ốp nổi hai mặt cho trụ có chiều sâu
            this.box(0.95, 3.6, 0.16, x, 2.45, pz + (side > 0 ? -0.66 : 0.66), '#e3ded2', { castShadow: false })
            this.box(0.16, 3.6, 0.95, x + 0.66, 2.45, pz, '#e3ded2', { castShadow: false })
            // Gờ + mũ trụ hai bậc, chóp tròn
            this.box(1.45, 0.28, 1.45, x, 4.85, pz, '#c3bdae')
            this.box(1.15, 0.35, 1.15, x, 5.15, pz, COLORS.wall)
            this.box(0.85, 0.3, 0.85, x, 5.48, pz, '#c3bdae', { geometry: this.cylinderGeometry })
        }

        // Thanh ngang hai lớp + logo ba khối màu quay ra phía cầu đón khách
        this.box(0.7, 0.55, opening * 2 + 1.1, x, 5.62, z, COLORS.orange)
        this.box(0.78, 0.16, opening * 2 + 1.5, x, 5.98, z, '#c3bdae')
        for(const [ i, hex ] of [ COLORS.orange, COLORS.green, COLORS.blue ].entries())
            this.box(0.2, 0.34, 0.62, x + 0.42, 5.62, z + (i - 1) * 0.78, hex, { castShadow: false })

        // Biển đá bên phải cổng nay do `FptuSigns.setGateSign()` dựng — tường đá
        // ong có logo FPT và bảng QS Stars vẽ thật, thay cho ba khối màu cũ

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
            // Dải cây mép bậc — CỤM LÁ THẬT của hệ mẫu, không phải hộp xanh
            // (chính cái hộp xanh này bị user chụp ảnh chê "như Minecraft")
            for(let c = -1; c <= 1; c++)
                this.canopy(xCenter + ALPHA.depth * 0.5 - 0.75, height + 0.62, zCenter + c * (ALPHA.columnWidth - 1.4) * 0.5, 0.5)

            // Vài cây nhỏ trên các bậc thấp: thân trụ + tán lá mềm
            if(column.floors <= 5)
            {
                this.box(0.22, 1.1, 0.22, xCenter - 1, height + 0.75, zCenter - 1, COLORS.trunk, { geometry: this.cylinderGeometry, castShadow: false })
                this.canopy(xCenter - 1, height + 1.75, zCenter - 1, 0.85)
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

    addFoliage(cells)
    {
        for(const cell of cells)
            this.canopy(cell.x, cell.y, cell.z, 0.5 + (Math.abs(Math.round(cell.x * 7 + cell.z * 13)) % 5) * 0.1)
    }

    /** Beta / Gamma / Delta — lùi hẳn khỏi trục, kiểu khối giảng đường mặt kính. */
    setBuildings()
    {
        for(const building of BUILDINGS)
        {
            const height = building.floors * 1.3

            this.box(building.width, height, building.depth, building.x, height * 0.5, building.z, COLORS.wall, { physical: true })
            this.box(building.width + 0.4, 0.25, building.depth + 0.4, building.x, height + 0.12, building.z, COLORS.roof)

            // Lan can mái + đế nhà: hai đường ngang chia khối cho nhà bớt trơ
            this.box(building.width + 0.5, 0.34, building.depth + 0.5, building.x, height + 0.4, building.z, '#c3bdae', { castShadow: false })
            this.box(building.width + 0.16, 0.55, building.depth + 0.16, building.x, 0.27, building.z, '#b9b2a2')

            for(let floor = 0; floor < building.floors; floor++)
            {
                const y = floor * 1.3 + 0.75
                this.box(building.width * 0.88, 0.55, 0.1, building.x, y, building.z + building.depth * 0.5 + 0.05, COLORS.windowDark)
                this.box(building.width * 0.88, 0.55, 0.1, building.x, y, building.z - building.depth * 0.5 - 0.05, COLORS.windowDark)

                // Đố dọc chia ô cửa — không có thì mỗi tầng là một vệt đen dài
                const bays = Math.max(3, Math.round(building.width / 2.4))
                for(let b = 1; b < bays; b++)
                {
                    const dx = -building.width * 0.44 + (building.width * 0.88 * b) / bays
                    for(const side of [ -1, 1 ])
                        this.box(0.16, 0.6, 0.14, building.x + dx, y, building.z + side * (building.depth * 0.5 + 0.06), COLORS.wall, { castShadow: false })
                }
            }

            // Mái hiên lối vào
            this.box(3.4, 0.2, 1.6, building.x, 2.3, building.z + building.depth * 0.5 + 0.8, COLORS.orange, { castShadow: false })
            for(const side of [ -1.4, 1.4 ])
                this.box(0.16, 2.2, 0.16, building.x + side, 1.1, building.z + building.depth * 0.5 + 1.45, '#8a8578', { geometry: this.cylinderGeometry })
        }
    }

    /** Bốn toà ký túc xá Dom, dồn về góc sau, có bảng tên cam. */
    setDorms()
    {
        for(const dorm of DORMS)
        {
            const height = 4 * 1.15

            this.box(6.5, height, 5, dorm.x, height * 0.5, dorm.z, COLORS.wall, { physical: true })

            // Cùng ngôn ngữ với Beta/Delta/Gamma: lan can mái + gờ, đế nhà —
            // hết cảnh "cái hộp đặt trên cỏ"
            this.box(6.9, 0.22, 5.4, dorm.x, height + 0.11, dorm.z, COLORS.roof)
            this.box(7.0, 0.3, 5.5, dorm.x, height + 0.35, dorm.z, '#c3bdae', { castShadow: false })
            this.box(6.66, 0.5, 5.16, dorm.x, 0.25, dorm.z, '#b9b2a2')
            this.box(1.5, 0.5, 0.12, dorm.x, height - 0.45, dorm.z + 2.56, COLORS.orange)

            for(let floor = 0; floor < 4; floor++)
            {
                const y = floor * 1.15 + 0.7
                this.box(5.4, 0.45, 0.1, dorm.x, y, dorm.z + 2.55, COLORS.windowDark)

                // Đố dọc chia ô cửa — mỗi tầng 4 ô, hết vệt đen dài
                for(let b = 1; b < 4; b++)
                    this.box(0.14, 0.5, 0.12, dorm.x - 2.7 + b * 1.35, y, dorm.z + 2.56, COLORS.wall, { castShadow: false })
            }

            // Mái hiên cửa vào + hai cột tròn
            this.box(2.2, 0.16, 1.2, dorm.x, 2.05, dorm.z + 3.1, COLORS.orange, { castShadow: false })
            for(const side of [ -0.9, 0.9 ])
                this.box(0.13, 2, 0.13, dorm.x + side, 1, dorm.z + 3.6, '#8a8578', { geometry: this.cylinderGeometry })
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
        /**
         * Lòng hồ nay là MỘT mảng địa hình liền, không còn vành hai mươi hộp
         * nghiêng ghép lại. Vành hộp cũ là nguồn gốc của bậc 0,71 đo được ở hai
         * đầu hồ thiên nga: hộp ghép theo GÓC THAM SỐ của hình bầu dục, mà góc
         * tham số không phải hướng pháp tuyến, nên hồ càng dẹt các hộp càng lệch
         * nhau và hở ra khe. Xem `heightPatch()`.
         *
         * Màu đáy vẫn là màu NƯỚC chứ không phải màu bùn: mặt nước của game
         * (`WaterSurface`) là tấm phẳng bám theo máy quay, bán kính chỉ chừng
         * 29, nên phần hồ ở xa xe chưa được phủ nước và lộ nguyên đáy ra.
         */
        // Lòng hồ nay nằm ngay trong `islandHeight()` — cùng một mảng địa
        // hình với cả hòn đảo, nên giữa bờ và lòng hồ không còn mối ghép nào

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
        /**
         * Thân cù lao là MỘT mảng địa hình mượt — cùng kỹ thuật đồi thông.
         * Bản trước xếp 6 đĩa chồng và trong ảnh cận nó lộ nguyên hình bậc
         * thang, đúng thứ user đang yêu cầu dẹp bỏ. Đường sinh smoothstep từ
         * đáy hồ (−0,9) lên đỉnh, mép hoà xuống dưới đáy hồ để nền che.
         */
        this.heightPatch(
            LAKE_ISLET.x, LAKE_ISLET.z,
            LAKE_ISLET.radius * 2 + 4, LAKE_ISLET.radius * 2 + 4, 40, 40,
            (x, z) =>
            {
                const r = Math.hypot(x - LAKE_ISLET.x, z - LAKE_ISLET.z) / LAKE_ISLET.radius
                if(r >= 1) return -0.95
                const t = 1 - r
                return -0.9 + (LAKE_ISLET.height + 0.9) * (t * t * (3 - 2 * t))
            },
            '#5f9438',
        )

        // Cây um tùm trên cù lao
        for(let i = 0; i < 9; i++)
        {
            const angle = i * 2.39996
            const spread = Math.sqrt((i + 0.4) / 9)
            const radius = LAKE_ISLET.radius * 0.55 * spread
            const x = LAKE_ISLET.x + Math.cos(angle) * radius
            const z = LAKE_ISLET.z + Math.sin(angle) * radius
            // Cao độ mặt cù lao tại chỗ trồng — cùng công thức với heightPatch
            const tt = 1 - radius / LAKE_ISLET.radius
            const top = -0.9 + (LAKE_ISLET.height + 0.9) * (tt * tt * (3 - 2 * tt))
            const scale = 0.9 + ((i * 31) % 7) / 12

            this.box(0.3 * scale, 1.5 * scale, 0.3 * scale, x, top + 0.75 * scale, z, COLORS.trunk, { geometry: this.cylinderGeometry, castShadow: false })
            // Tán bằng hệ lá mẫu — hai cụm chồng cho dáng tròn rậm
            this.canopy(x, top + 2 * scale, z, 1.05 * scale)
            this.canopy(x, top + 2.75 * scale, z, 0.7 * scale)
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
        // Hồ dẹt nhất khu (14 × 9) nên chính nó dính bậc 0,71 ở hai đầu Đông–Tây
        // khi còn dùng vành hộp nghiêng. Nay là mảng địa hình liền — xem `basin()`.
        // Lòng hồ do `islandHeight()` khoét — xem chú thích ở hồ sen
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
        /**
         * Mặt sân bóng ĐÈ LÊN mặt đường lớn một mảng 6×24 (đường rộng 8 tại
         * x = −106, sân trải tới x = −104). Hai tấm cùng lớp 0 nên mặt trên
         * trùng nhau ĐÚNG 0 phân — ra đúng cảnh "chập chờn bọ nhiễu" user chụp
         * lại được. Đẩy sân lên một lớp là hết tranh chấp, và đường vẫn ở dưới
         * đúng như ngoài đời (sân lấn ra vỉa hè, không phải đường lấn vào sân).
         */
        this.slab(FOOTBALL.width, FOOTBALL.depth, FOOTBALL.x, FOOTBALL.z, COLORS.pitch, { layer: 1 })
        this.slab(FOOTBALL.width - 1.6, 0.2, FOOTBALL.x, FOOTBALL.z, '#e8e4da', { layer: 2 })

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
        this.box(CANTEEN.width + 0.5, 0.28, CANTEEN.depth + 0.5, CANTEEN.x, height + 0.34, CANTEEN.z, '#c3bdae', { castShadow: false })
        this.box(CANTEEN.width + 0.16, 0.45, CANTEEN.depth + 0.16, CANTEEN.x, 0.22, CANTEEN.z, '#b9b2a2')

        // Dải kính mặt trước chia ô + biển hiệu + mái hiên dài che lối vào
        this.box(CANTEEN.width * 0.86, 0.5, 0.1, CANTEEN.x, 0.75, CANTEEN.z + CANTEEN.depth * 0.5 + 0.05, COLORS.windowDark)
        for(let b = 1; b < 5; b++)
            this.box(0.14, 0.55, 0.12, CANTEEN.x - CANTEEN.width * 0.43 + b * CANTEEN.width * 0.86 / 5, 0.75, CANTEEN.z + CANTEEN.depth * 0.5 + 0.06, COLORS.wall, { castShadow: false })
        this.box(2, 0.45, 0.12, CANTEEN.x, height - 0.4, CANTEEN.z + CANTEEN.depth * 0.5 + 0.06, COLORS.orange)
        this.box(CANTEEN.width * 0.7, 0.14, 1.4, CANTEEN.x, 1.5, CANTEEN.z + CANTEEN.depth * 0.5 + 0.75, COLORS.orange, { castShadow: false })
    }

    /** Bãi gửi xe dọc mép đường — vài ô kẻ trắng và hai xe đỗ sẵn. */
    setParking()
    {
        this.slab(PARKING.width, PARKING.depth, PARKING.x, PARKING.z, '#7d7a72')

        for(let i = 0; i < 4; i++)
            this.slab(PARKING.width - 1, 0.16, PARKING.x, PARKING.z - PARKING.depth * 0.5 + 2 + i * 4, '#e8e4da', { layer: 1 })

        // Xe đậu do FptuProps dựng (dáng thật: capô, kính vát, bánh) — hai
        // cục hộp mộc từng nằm ở đây đã bị user chụp ảnh chê, bỏ hẳn
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
            const x = LAWN.x + LAWN.width * 0.5 - 1.4 - i * 4.4
            spots.push({ x, z: LAWN.z - 5.4 }, { x, z: LAWN.z + 5.4 })
        }

        // Mỗi cây một hướng nghiêng và cỡ khác nhau — hàng cọ hết trông nhân bản
        spots.forEach((spot, i) =>
            this.palm(spot.x, spot.z, { scale: 0.7 + ((i * 5) % 4) * 0.05, lean: i * 1.7 }))
    }

    /**
     * CÂY CỌ — thân cong, tán lá rủ xuống, có buồng dừa.
     *
     * Bản trước là một cái cột thẳng đơ cắm sáu thanh dẹt chìa ngang — đúng thứ
     * người dùng chê "hình vuông hình nhọn". Cọ thật thì thân hơi cong theo một
     * hướng, các tàu lá vươn ra rồi RỦ XUỐNG thành đường cong, và lá hẹp dần về
     * phía ngọn. Dựng đúng ba đặc điểm đó là nhìn ra cây ngay.
     *
     * `lean` là hướng nghiêng của thân (radian). Truyền khác nhau cho mỗi cây
     * thì cả hàng cọ hết trông như nhân bản.
     */
    palm(x, z, { scale = 1, lean = 0 } = {})
    {
        const H = 4.6 * scale          // chiều cao thân
        const SEGS = 8                 // số đốt thân
        const BEND = 0.75 * scale      // thân ngả bao nhiêu ở ngọn
        const dx = Math.cos(lean)
        const dz = Math.sin(lean)

        // Thân: các đốt bám theo một cung parabol, mỗi đốt nghiêng đúng bằng
        // tiếp tuyến của cung tại đó nên nối nhau liền, không gãy khúc.
        for(let i = 0; i < SEGS; i++)
        {
            const t = (i + 0.5) / SEGS
            const segH = H / SEGS
            const radius = (0.29 - 0.12 * t) * scale
            const offset = BEND * t * t
            const tilt = Math.atan2(2 * BEND * t, H)

            this.box(
                radius * 2, segH * 1.08, radius * 2,
                x + dx * offset, H * t, z + dz * offset,
                i % 2 ? '#8a6a42' : '#7b5c39',
                {
                    rotationZ: -dx * tilt,
                    rotationX: dz * tilt,
                    geometry: this.cylinderGeometry,
                    physical: i === 0,
                },
            )
        }

        const topX = x + dx * BEND
        const topZ = z + dz * BEND

        // Bẹ lá ôm ngọn
        this.box(0.5 * scale, 0.42 * scale, 0.5 * scale, topX, H, topZ, '#6f5a33', { geometry: this.cylinderGeometry })

        // Tán: 11 tàu lá toả đều, mỗi tàu là một chuỗi đốt vươn ra rồi rủ xuống
        const FRONDS = 11
        for(let f = 0; f < FRONDS; f++)
        {
            const a = (f / FRONDS) * Math.PI * 2 + lean * 0.5
            // Tàu nào rủ nhiều tàu nào rủ ít — tất định theo chỉ số, không random
            const droop = (1.35 + ((f * 7) % 5) * 0.16) * scale
            const reach = (2.15 + ((f * 3) % 4) * 0.14) * scale
            const hue = f % 3 === 0 ? '#4f8f34' : (f % 3 === 1 ? '#5aa832' : '#448029')

            for(let j = 0; j < 5; j++)
            {
                const u = (j + 0.5) / 5
                const r = 0.12 * scale + u * reach
                const drop = droop * u * u
                const pitch = Math.atan2(2 * droop * u, reach)

                this.box(
                    (reach / 5) * 1.15, 0.075 * scale, (0.56 - 0.34 * u) * scale,
                    topX + Math.cos(a) * r, H + 0.34 * scale - drop, topZ + Math.sin(a) * r,
                    hue,
                    { rotationY: -a, rotationZ: -pitch, castShadow: j < 3 },
                )
            }
        }

        // Chỏm giữa tán — không có thì nhìn từ trên xuống thấy thủng một lỗ
        this.box(0.62 * scale, 0.3 * scale, 0.62 * scale, topX, H + 0.4 * scale, topZ, '#4f8f34', { geometry: this.cylinderGeometry, castShadow: false })

        // Buồng dừa dưới tán
        for(let c = 0; c < 4; c++)
        {
            const a = c * 1.9
            this.box(
                0.3 * scale, 0.3 * scale, 0.3 * scale,
                topX + Math.cos(a) * 0.36 * scale, H - 0.16 * scale, topZ + Math.sin(a) * 0.36 * scale,
                '#6b4a2a', { geometry: this.cylinderGeometry, castShadow: false },
            )
        }
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
                // Đứng trên mặt bệ, không phải trên cỏ
                group.position.set(SIGN.x, SIGN.y + (this.signs?.plinthTop ?? GROUND_TOP), SIGN.z)
                group.rotation.y = SIGN.rotationY

                this.group.add(group)
                this.sign = group
            },
            undefined,
            () => { console.warn('[FPTU] không nạp được fptu/sign.glb — khu trường vẫn chạy, chỉ thiếu hàng chữ') }
        )

        // Va chạm do chính cái BỆ lo (`FptuSigns.setSignPlinth`) — chữ đứng trên
        // đó nên không cần thêm khối nào, và nhất là không còn khối nào vắt
        // ngang lòng đường như bản trước.
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
