import * as THREE from 'three/webgpu'
import { attribute, color } from 'three/tsl'
import { Game } from '../Game.js'
import { MeshDefaultMaterial } from '../Materials/MeshDefaultMaterial.js'
import { CITY_ISLAND, CITY_BRIDGE, CITY_GRID, CITY_COLORS, MODEL_SCALE } from '../../data/cityisland.js'

/**
 * ĐẢO THÀNH PHỐ — mảnh đất thứ tư, ngoài khơi phía Đông, nối bằng cầu dây văng.
 *
 * Khác ba khu trước ở chỗ đây là khu ĐẦU TIÊN dựng từ MODEL NGOÀI
 * (Downtown City MegaKit của Quaternius, CC0 — xem `static/ATTRIBUTION.txt`)
 * chứ không đắp bằng hộp. Nền đảo, cầu và quảng trường vẫn dựng bằng mã.
 *
 * ⚠️ CỐ Ý ĐỘC LẬP với `FptuCampus` và `PlayIsland` dù bộ hàm nền
 * (`heightPatch`, `islandHeight`, `distanceToShore`) gần như y hệt — cùng lý do
 * đã ghi ở `PlayIsland`: gộp chung thì một thay đổi ở đây có thể làm hỏng khu
 * đang chạy trên production.
 */

const GROUND_TOP = 0.04
const SEA_FLOOR = -1.6
const ISLAND_SHORE = 0.13

const PALETTE = {
    grass: '#7a8471',      // cỏ đô thị, xám hơn hai đảo kia
    sand: '#cbb392',
    shallow: '#4d8a86',
    bed: '#3d6f57',
    deep: '#27515e',
}

export class CityIsland
{
    constructor()
    {
        this.game = Game.getInstance()

        this.group = new THREE.Group()
        this.group.name = 'cityIsland'
        this.game.scene.add(this.group)

        this.boxGeometry = new THREE.BoxGeometry(1, 1, 1)
        this.cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 10)
        this.materials = new Map()
        this.groundTop = GROUND_TOP

        /** Số liệu lưới phơi ra cho bộ kiểm đọc — đừng gõ tay lại ở đó. */
        this.grid = CITY_GRID

        this.indexPieces()

        this.setIsland()
        this.setBridge()
        this.setStreets()
        this.setBlocks()
        this.setPlaza()
    }

    /**
     * Lập chỉ mục 153 mảnh của kit theo TÊN.
     *
     * ⚠️ File gốc của Quaternius là 153 SCENE RỜI, mà `GLTFLoader` chỉ nạp
     * scene mặc định — để nguyên thì cả file chỉ ra đúng một toà nhà. Đã gộp
     * về MỘT scene lúc chuẩn bị model (xem lịch sử commit), nên ở đây chỉ việc
     * duyệt `scene.children`.
     */
    indexPieces()
    {
        this.pieces = new Map()

        const source = this.game.resources.cityModel?.scene
        if(!source)
        {
            console.warn('[CityIsland] không thấy `resources.cityModel` — bỏ qua phần phố')
            return
        }

        for(const child of source.children)
            this.pieces.set(child.name, child)
    }

    /**
     * Tra một mảnh theo tên, CHỊU ĐƯỢC việc three.js đổi tên lúc nạp.
     *
     * ⚠️ `GLTFLoader` **XOÁ HẲN dấu chấm** trong tên node: mảnh tên
     * `Building_Medium_2.001` trong file trở thành `Building_Medium_2001` khi
     * vào scene. Tra thẳng bằng tên gốc thì trượt, và triệu chứng rất im: chỉ
     * là 11 trong 32 toà nhà không mọc lên, không lỗi nào cả. Tra thêm bản đã
     * bỏ dấu chấm để dù chép tên từ file gốc hay từ scene đều ra đúng mảnh.
     */
    piece(name)
    {
        return this.pieces.get(name)
            ?? this.pieces.get(name.replace(/\./g, ''))
            ?? this.pieces.get(name.replace(/\./g, '_'))
    }

    /**
     * Đặt MỘT mảnh của kit xuống thế giới.
     *
     * @param name    tên node trong kit, ví dụ 'Street_4Lane'
     * @param x, z    vị trí tâm mảnh trong hệ toạ độ game
     * @param rotationY  góc xoay quanh trục đứng
     * @param physical   `null` = không va chạm · `'box'` = hộp bao quanh mảnh
     */
    place(name, x, z, rotationY = 0, { y = GROUND_TOP, physical = null, scale = MODEL_SCALE } = {})
    {
        const source = this.piece(name)
        if(!source)
        {
            console.warn(`[CityIsland] không có mảnh "${name}"`)
            return null
        }

        const mesh = source.clone(true)

        mesh.position.set(x, y, z)
        mesh.rotation.y = rotationY
        mesh.scale.setScalar(scale)
        mesh.traverse((child) =>
        {
            if(child.isMesh)
            {
                child.castShadow = true
                child.receiveShadow = true
            }
        })

        /**
         * Ép vật liệu về hệ của game. `Materials.createFromMaterial()` nhận
         * `MeshStandardMaterial` (thứ glTF sinh ra) và GIỮ NGUYÊN texture, chỉ
         * đổi sang hệ TSL — nên mảnh vẫn giữ vẻ riêng mà ăn đúng ánh sáng,
         * sương mù và bóng đổ của thế giới này.
         */
        this.game.materials.updateObject(mesh)

        this.group.add(mesh)

        if(physical === 'box')
        {
            /**
             * ⚠️ Va chạm dùng HỘP BAO, KHÔNG trimesh. Trimesh nặng và mỗi khe
             * giữa hai mảnh là một chỗ bánh xe kẹt — đúng bài học đắt nhất của
             * khu FPTU. Hộp bao thì tệ nhất là xe đâm vào chỗ trống một chút,
             * còn hơn kẹt cứng.
             *
             * ⚠️ Và phải đo bằng hộp bao CỤC BỘ nhân scale, KHÔNG dùng
             * `Box3.setFromObject()`: trước khung hình đầu tiên `matrixWorld`
             * còn là ma trận đơn vị nên nó trả về hộp 1×1×1 ở gốc toạ độ.
             */
            const box = new THREE.Box3()
            const tmp = new THREE.Box3()
            let has = false
            source.traverse((child) =>
            {
                if(!child.isMesh || !child.geometry) return
                if(!child.geometry.boundingBox) child.geometry.computeBoundingBox()
                tmp.copy(child.geometry.boundingBox)
                if(has) box.union(tmp)
                else { box.copy(tmp); has = true }
            })

            if(has)
            {
                const size = box.getSize(new THREE.Vector3()).multiplyScalar(scale)
                const centre = box.getCenter(new THREE.Vector3()).multiplyScalar(scale)
                // Tâm hộp bao xoay theo cùng góc với hình
                const offset = new THREE.Vector2(centre.x, centre.z).rotateAround(new THREE.Vector2(), -rotationY)
                const quaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, rotationY, 0))

                // Hộp bao chỉ xoay quanh Y nên bề rộng/sâu hoán đổi khi xoay 90°
                this.game.objects.add(null, {
                    type: 'fixed',
                    position: { x: x + offset.x, y: y + centre.y, z: z + offset.y },
                    rotation: { x: quaternion.x, y: quaternion.y, z: quaternion.z, w: quaternion.w },
                    colliders: [ { shape: 'cuboid', parameters: [ size.x * 0.5, size.y * 0.5, size.z * 0.5 ] } ]
                })
            }
        }

        return mesh
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
            const quaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(rotationX, rotationY, rotationZ, 'YZX'))
            this.game.objects.add(null, {
                type: 'fixed',
                position: { x, y, z },
                rotation: { x: quaternion.x, y: quaternion.y, z: quaternion.z, w: quaternion.w },
                colliders: [ { shape: 'cuboid', parameters: [ width * 0.5, height * 0.5, depth * 0.5 ] } ]
            })
        }

        return mesh
    }

    /** Tấm lát có va chạm. `layer` tách chiều sâu để không tranh chấp z-fighting. */
    slab(width, depth, x, z, hex, { layer = 0 } = {})
    {
        const y = GROUND_TOP + 0.05 + layer * 0.03
        return this.box(width, 0.04, depth, x, y, z, hex, { castShadow: false, receiveShadow: false, physical: true })
    }

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
        else material = this.getMaterial(hex)

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
                heights[iz + ix * nz] = fn(cx - sizeX * 0.5 + (ix / cols) * sizeX, cz - sizeZ * 0.5 + (iz / rows) * sizeZ)

        // ⚠️ `nrows` là số ô theo trục Z, `ncols` theo trục X — không phải ngược lại.
        this.game.objects.add(null, {
            type: 'fixed',
            friction: 0.35,
            restitution: 0,
            position: { x: cx, y: 0, z: cz },
            colliders: [ { shape: 'heightfield', parameters: [ rows, cols, heights, { x: sizeX, y: 1, z: sizeZ } ] } ]
        })

        return mesh
    }

    shapeDistance(x, z)
    {
        const nx = (x - CITY_ISLAND.x) / (CITY_ISLAND.width * 0.5)
        const nz = (z - CITY_ISLAND.z) / (CITY_ISLAND.depth * 0.5)
        let d = Math.pow(Math.pow(Math.abs(nx), 4) + Math.pow(Math.abs(nz), 4), 0.25)
        const theta = Math.atan2(nz, nx)
        d /= 1 + 0.03 * Math.sin(theta * 3 + 2.1) + 0.015 * Math.sin(theta * 7 - 0.4)
        return d
    }

    /**
     * ⚠️ BẮT BUỘC móc vào `Audio.js`. Bản mẫu tính âm lượng sóng theo mép ĐỊA
     * HÌNH GỐC (nửa cạnh 96), mà đảo này ở x 146…318 — hẳn ngoài đó. Không móc
     * thì tiếng sóng gào kịch trần suốt thời gian ở trên đảo.
     */
    distanceToShore(x, z)
    {
        return (1 - this.shapeDistance(x, z)) * (CITY_ISLAND.width + CITY_ISLAND.depth) * 0.25
    }

    islandHeight(x, z)
    {
        const d = this.shapeDistance(x, z)
        if(d <= 1) return GROUND_TOP
        const t = Math.min(1, (d - 1) / ISLAND_SHORE)
        const s = t * t * (3 - 2 * t)
        return GROUND_TOP + (SEA_FLOOR - GROUND_TOP) * s
    }

    islandColor(x, z, y)
    {
        if(!this._colorScratch)
        {
            this._colorScratch = new THREE.Color()
            this._colorStops = [
                { y: SEA_FLOOR, c: new THREE.Color(PALETTE.deep) },
                { y: -0.62, c: new THREE.Color(PALETTE.bed) },
                { y: -0.24, c: new THREE.Color(PALETTE.shallow) },
                { y: -0.05, c: new THREE.Color(PALETTE.sand) },
                { y: GROUND_TOP - 0.005, c: new THREE.Color(PALETTE.sand) },
                { y: GROUND_TOP, c: new THREE.Color(PALETTE.grass) },
            ]
        }

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
            return this._colorScratch.copy(a.c).lerp(b.c, (yy - a.y) / (b.y - a.y))
        }
        return stops[stops.length - 1].c
    }

    setIsland()
    {
        const width = CITY_ISLAND.width + CITY_ISLAND.width * ISLAND_SHORE + 12
        const depth = CITY_ISLAND.depth + CITY_ISLAND.depth * ISLAND_SHORE + 12

        this.heightPatch(
            CITY_ISLAND.x, CITY_ISLAND.z, width, depth,
            Math.round(width / 1.2), Math.round(depth / 1.2),
            (x, z) => this.islandHeight(x, z),
            null,
            (x, z, y) => this.islandColor(x, z, y),
        )
    }

    /**
     * CẦU DÂY VĂNG — cầu dài nhất thế giới này (62 đơn vị ≈ 124 m).
     *
     * Hai tháp chữ A cao 22 đơn vị, dây văng toả từ đỉnh tháp xuống mặt cầu
     * theo hình quạt. Dây và tháp KHÔNG có va chạm ở phần trên — chỉ chân tháp
     * mới cứng, và chân đặt SÁT MÉP cầu để không thu hẹp lối xe.
     *
     * ⚠️ Mặt cầu PHẲNG và LIỀN một khối, không ghép đoạn nghiêng.
     */
    setBridge()
    {
        const { z, fromX, toX, width, towerHeight, towers } = CITY_BRIDGE
        const length = Math.abs(toX - fromX) + 8
        const centerX = (fromX + toX) * 0.5
        const y = GROUND_TOP - 0.2

        // Mặt cầu — một khối duy nhất
        this.box(length, 0.5, width, centerX, y, z, CITY_COLORS.deck, { castShadow: false })
        this.game.objects.add(null, {
            type: 'fixed',
            friction: 0.25,
            restitution: 0,
            position: { x: centerX, y, z },
            colliders: [ { shape: 'cuboid', parameters: [ length * 0.5, 0.25, width * 0.5 ] } ]
        })

        // Gờ chắn hai mép — thấp (0,45) để xe lỡ chạm không lật, mà mắt vẫn
        // đọc ra mép cầu. KHÔNG làm lan can cao: lan can cao ở cầu FPTU từng
        // chừa khe hẹp hơn thân xe và gây kẹt.
        for(const side of [ -1, 1 ])
            this.box(length, 0.45, 0.5, centerX, y + 0.47, z + side * (width * 0.5 - 0.25), CITY_COLORS.kerb, { castShadow: false, physical: true })

        // Trụ đỡ dưới mặt cầu
        for(let i = 0; i <= 6; i++)
        {
            const px = fromX + 4 + i * (length - 8) / 6
            for(const side of [ -1, 1 ])
                this.box(1.2, 2.6, 1.2, px, y - 1.4, z + side * (width * 0.5 - 1), CITY_COLORS.steel, { castShadow: false })
        }

        // ── Hai tháp chữ A + dây văng ───────────────────────────────────────
        for(const towerX of towers)
        {
            for(const side of [ -1, 1 ])
            {
                const baseZ = z + side * (width * 0.5 + 0.9)

                // Cột nghiêng vào trong tạo hình chữ A
                const lean = 0.09
                this.box(1.5, towerHeight, 1.5, towerX, y + towerHeight * 0.5, baseZ - side * towerHeight * lean * 0.5, CITY_COLORS.steel, { rotationX: side * lean })

                // Dây văng toả hình quạt về hai phía
                for(let i = 1; i <= 6; i++)
                {
                    const reach = 4 + i * 4.2
                    for(const dir of [ -1, 1 ])
                    {
                        const topY = y + towerHeight - i * 0.8
                        const dx = dir * reach
                        const dy = topY - (y + 0.4)
                        const len = Math.hypot(dx, dy)
                        const angle = Math.atan2(dy, dx)

                        this.box(len, 0.13, 0.13, towerX + dx * 0.5, (topY + y + 0.4) * 0.5, baseZ, CITY_COLORS.cable, { rotationZ: -angle + Math.PI, castShadow: false })
                    }
                }

                // Xà ngang nối hai cột của tháp
                this.box(1.3, 0.8, width + 2.4, towerX, y + towerHeight * 0.72, z, CITY_COLORS.steel, { castShadow: false })
            }
        }
    }

    /** Toạ độ tâm của một đường trong lưới (theo chỉ số 0…cols). */
    roadCentre(index, axis)
    {
        const { blockSize, roadWidth, cols, rows } = CITY_GRID
        const count = axis === 'x' ? cols : rows
        const total = count * blockSize + (count + 1) * roadWidth
        const start = (axis === 'x' ? CITY_GRID.x : CITY_GRID.z) - total * 0.5
        return start + roadWidth * 0.5 + index * (blockSize + roadWidth)
    }

    /** Tâm một ô nhà (col, row). */
    blockCentre(col, row)
    {
        const { blockSize, roadWidth } = CITY_GRID
        return {
            x: this.roadCentre(col, 'x') + (blockSize + roadWidth) * 0.5,
            z: this.roadCentre(row, 'z') + (blockSize + roadWidth) * 0.5,
        }
    }

    /**
     * LƯỚI ĐƯỜNG — 4 đường dọc × 4 đường ngang, ngã tư ở mọi giao điểm.
     *
     * Mảnh `Street_4Lane` dài 6 m (3 đơn vị sau khi nhân 0,5) nên phải lát nối
     * tiếp nhau. Ngã tư `Street_4WayIntersection` rộng 24,67 m (12,3 đơn vị) —
     * to hơn bề rộng đường nên nó tự trùm lên chỗ giao.
     */
    setStreets()
    {
        const { cols, rows, blockSize, roadWidth } = CITY_GRID
        const pieceLength = 6 * MODEL_SCALE          // 3 đơn vị
        const spanX = cols * blockSize + (cols + 1) * roadWidth
        const spanZ = rows * blockSize + (rows + 1) * roadWidth

        const xs = []
        const zs = []
        for(let i = 0; i <= cols; i++) xs.push(this.roadCentre(i, 'x'))
        for(let i = 0; i <= rows; i++) zs.push(this.roadCentre(i, 'z'))

        const nearCross = (x, z) =>
        {
            for(const cx of xs) for(const cz of zs)
                if(Math.abs(x - cx) < 6.4 && Math.abs(z - cz) < 6.4) return true
            return false
        }

        // Đường DỌC (chạy theo trục Z) — mảnh xoay 90°
        for(const cx of xs)
        {
            const from = CITY_GRID.z - spanZ * 0.5
            for(let d = pieceLength * 0.5; d < spanZ; d += pieceLength)
            {
                const cz = from + d
                if(nearCross(cx, cz)) continue
                this.place('Street_4Lane', cx, cz, Math.PI * 0.5)
            }
        }

        // Đường NGANG (chạy theo trục X)
        for(const cz of zs)
        {
            const from = CITY_GRID.x - spanX * 0.5
            for(let d = pieceLength * 0.5; d < spanX; d += pieceLength)
            {
                const cx = from + d
                if(nearCross(cx, cz)) continue
                this.place('Street_4Lane', cx, cz, 0)
            }
        }

        // Ngã tư ở mọi giao điểm
        for(const cx of xs)
            for(const cz of zs)
                this.place('Street_4WayIntersection', cx, cz, 0)

        this.roadXs = xs
        this.roadZs = zs
        this.roadHalfWidth = roadWidth * 0.5
    }

    /**
     * CÁC Ô NHÀ — mỗi ô rải vài toà quanh mép, chừa lòng ô làm sân trong.
     *
     * Nhà đặt QUAY MẶT RA ĐƯỜNG và lùi vào 1 đơn vị khỏi mép ô, để không có
     * góc nhà nào thò ra lòng đường. Bố trí tất định (băm từ chỉ số ô), không
     * dùng `Math.random` để bản dựng còn tái lập được.
     */
    setBlocks()
    {
        const { cols, rows, blockSize, squareCell } = CITY_GRID
        const hash = (i) => { const h = Math.sin(i * 127.1) * 43758.5453; return h - Math.floor(h) }

        const kinds = [
            { name: 'Building_Large_2', w: 20.64, d: 16.64 },
            { name: 'Building_Medium_2.001', w: 15.06, d: 13.06 },
            { name: 'Building_Small_1', w: 12.46, d: 14.54 },
        ]

        let seed = 0
        for(let col = 0; col < cols; col++)
        {
            for(let row = 0; row < rows; row++)
            {
                if(col === squareCell.col && row === squareCell.row) continue

                const centre = this.blockCentre(col, row)
                const half = blockSize * 0.5

                // Bốn mặt của ô, mỗi mặt một toà quay ra đường
                const faces = [
                    { dx: 0, dz: -1, rot: 0 },
                    { dx: 0, dz: 1, rot: Math.PI },
                    { dx: -1, dz: 0, rot: Math.PI * 0.5 },
                    { dx: 1, dz: 0, rot: -Math.PI * 0.5 },
                ]

                for(const face of faces)
                {
                    seed++
                    const kind = kinds[Math.floor(hash(seed) * kinds.length) % kinds.length]

                    // Lùi vào bằng NỬA CHIỀU SÂU của toà nhà + 1 đơn vị đệm, để
                    // mặt sau nhà nằm gọn trong ô và mặt trước không chạm đường
                    const inset = kind.d * MODEL_SCALE * 0.5 + 1
                    const along = (hash(seed + 500) - 0.5) * (blockSize - kind.w * MODEL_SCALE - 3)

                    const x = centre.x + face.dx * (half - inset) + (face.dx === 0 ? along : 0)
                    const z = centre.z + face.dz * (half - inset) + (face.dz === 0 ? along : 0)

                    this.place(kind.name, x, z, face.rot, { physical: 'box' })
                }
            }
        }
    }

    /**
     * QUẢNG TRƯỜNG ở ô giữa — chỗ để sau này đặt điểm hồi sinh, cửa hàng nâng
     * cấp cho chế độ Sinh tồn, hoặc bãi đỗ trực thăng.
     *
     * Để TRỐNG hoàn toàn ở giữa: không vật `physical` nào trong lòng, chỉ có
     * lát nền, viền cây và vài cột đèn sát mép.
     */
    setPlaza()
    {
        const { blockSize, squareCell } = CITY_GRID
        const centre = this.blockCentre(squareCell.col, squareCell.row)
        const half = blockSize * 0.5

        this.plaza = { x: centre.x, z: centre.z, size: blockSize }

        // Nền lát
        this.slab(blockSize, blockSize, centre.x, centre.z, CITY_COLORS.plaza)

        // Hoa văn: hai vành khuyên đồng tâm, lát layer 1 để không tranh chiều sâu
        for(const r of [ 6, 10 ])
        {
            const ring = new THREE.RingGeometry(r - 0.35, r, 56)
            ring.rotateX(-Math.PI * 0.5)
            this.box(1, 1, 1, centre.x, GROUND_TOP + 0.12, centre.z, CITY_COLORS.kerb, { geometry: ring, castShadow: false, receiveShadow: false })
        }

        // Viền bồn cây + cột chắn quanh mép, LÙI VÀO 2 đơn vị khỏi mép ô
        const step = blockSize / 8
        for(let i = 0; i < 8; i++)
        {
            const t = -half + 2 + i * step
            for(const side of [ -1, 1 ])
            {
                this.place('Prop_Planter_Single', centre.x + t, centre.z + side * (half - 2), 0)
                this.place('Prop_Planter_Single', centre.x + side * (half - 2), centre.z + t, 0)
            }
        }
    }
}
