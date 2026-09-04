import * as THREE from 'three/webgpu'
import { attribute, color, uniform } from 'three/tsl'
import { Game } from '../Game.js'
import { MeshDefaultMaterial } from '../Materials/MeshDefaultMaterial.js'
import { PLAY_ISLAND, PLAY_BRIDGE, PLAY_ROADS, PLAY_COLORS, PLOTS } from '../../data/playisland.js'
import { FootballArena } from './FootballArena.js'
import { PlayConcert } from './PlayConcert.js'
import { PlayVillage } from './PlayVillage.js'
import { Foliage } from './Foliage.js'

/**
 * ĐẢO SÂN CHƠI — mảnh đất riêng ngoài khơi phía Nam, nối vào đảo chính bằng cầu.
 * Dựng HOÀN TOÀN BẰNG MÃ, không đụng file .glb nào. Xem `data/playisland.js`
 * để biết vì sao không dựng ở "quận Tây-Nam" như bàn giao cũ ghi.
 *
 * ⚠️ Class này CỐ Ý ĐỘC LẬP với `FptuCampus` dù bộ hàm dựng (`box`, `slab`,
 * `heightPatch`, `canopy`) gần như y hệt. Gộp chung nghĩa là mọi thay đổi ở đây
 * đều có thể làm hỏng khu FPTU đang chạy tốt trên production — với dự án này
 * thì cách ly đáng giá hơn là tránh trùng mã.
 */

/** Mặt đảo cao hơn "đáy biển" vật lý chừng này — LẤY ĐÚNG số của đảo FPTU. */
const GROUND_TOP = 0.04

/** Đáy biển quanh đảo, thấp hơn mực nước (−0,3) đủ để ra dáng chỗ nước sâu. */
const SEA_FLOOR = -1.6

/** Bề rộng bãi bờ tính theo TỈ LỆ bán kính đảo — thoải để xe bò lên mọi phía. */
const ISLAND_SHORE = 0.13

/** Màu mặt đảo theo cao độ. */
const PALETTE = {
    grass: '#6f9e3f',
    sand: '#d8b47e',
    shallow: '#4d8a86',
    bed: '#3d6f57',
    deep: '#27515e',
}

export class PlayIsland
{
    constructor()
    {
        this.game = Game.getInstance()

        this.group = new THREE.Group()
        this.group.name = 'playIsland'
        this.game.scene.add(this.group)

        this.boxGeometry = new THREE.BoxGeometry(1, 1, 1)
        this.cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 10)
        this.materials = new Map()

        this.groundTop = GROUND_TOP

        /**
         * Số liệu đường phơi ra cho `tools/check-play-island.mjs` đọc.
         * Bộ kiểm gõ tay lại toạ độ đường là tự chuốc báo oan: sửa bố cục ở
         * `data/playisland.js` xong quên sửa bộ kiểm thì nó đi soi lòng đường
         * cũ và tố cáo tường sân "nằm giữa đường".
         */
        this.roads = PLAY_ROADS

        /** Mốc tán lá — gom hết rồi cuối hàm dựng mới tạo MỘT hệ `Foliage`. */
        this.canopySpots = []

        this.setIsland()
        this.setBridge()
        this.setRoads()

        this.arena = new FootballArena(this)

        /**
         * Sân khấu nhạc hội — khu thứ nhất trong ba ô đất chừa sẵn (`PLOTS`).
         * Dựng TRƯỚC `setScenery()` để nó ghi mốc tán cây vào `canopySpots`
         * kịp cho `Foliage` gom ở cuối hàm dựng.
         */
        this.concert = new PlayConcert(this)

        /**
         * Làng ngôn ngữ — khu thứ hai. Cũng phải dựng TRƯỚC `setScenery()`
         * vì nó ghi mốc tán cây vào `canopySpots`, và `setScenery()` đọc
         * `PLOTS.village` để không trồng cây vào giữa làng.
         */
        this.village = new PlayVillage(this)

        this.setScenery()

        /**
         * Hệ lá chung — dựng SAU CÙNG để gom đủ mốc từ mọi nơi. Đắp hộp xanh
         * làm cây là sai (user đã chê ba lần ở khu FPTU), mọi tán mềm phải đi
         * qua `canopy()`.
         */
        this.leafClusters = new Foliage(this.canopySpots, uniform(color('#7fb43f')), uniform(color('#b4d150')))
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

    /**
     * Một khối hộp, tuỳ chọn kèm thân vật lý.
     *
     * ⚠️ Quaternion phải dựng từ ĐÚNG bộ Euler của hình (cả ba trục), không chỉ
     * mỗi `rotationY` — khối nào nghiêng mà chỉ lấy Y thì hình một đằng va chạm
     * một nẻo. Đây là lỗi đã sửa ở `FptuCampus.box()`.
     */
    box(width, height, depth, x, y, z, hex, { rotationX = 0, rotationY = 0, rotationZ = 0, physical = false, geometry = null, castShadow = true, receiveShadow = true, friction = null, restitution = null } = {})
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

            const description = {
                type: 'fixed',
                position: { x, y, z },
                rotation: { x: quaternion.x, y: quaternion.y, z: quaternion.z, w: quaternion.w },
                colliders: [ { shape: 'cuboid', parameters: [ width * 0.5, height * 0.5, depth * 0.5 ] } ]
            }
            if(friction !== null) description.friction = friction
            if(restitution !== null) description.restitution = restitution

            mesh.userData.object = this.game.objects.add(null, description)
        }

        return mesh
    }

    /**
     * Tấm phẳng lát nền (đường, mặt sân, vạch kẻ) — CÓ thân vật lý.
     *
     * Hai điều bắt buộc, cả hai đều là lỗi đã trả giá ở khu FPTU:
     * 1. **Phải có va chạm.** Tấm chỉ là hình thì mặt cứng vẫn là mặt đảo bên
     *    dưới, xe chìm 10–16 phân dưới mặt sân ("đi đang bị lún").
     * 2. **`layer` phải nghĩ tới.** Hai tấm cùng cao độ thì depth buffer không
     *    phân biệt nổi, ra vệt răng cưa chạy loạn khi máy quay nhúc nhích.
     *    layer 0 = mặt đường/mặt sân · 1 = thứ lát đè lên · 2 = vạch kẻ.
     */
    slab(width, depth, x, z, hex, { layer = 0, friction = null } = {})
    {
        const y = GROUND_TOP + 0.05 + layer * 0.03
        return this.box(width, 0.04, depth, x, y, z, hex, { castShadow: false, receiveShadow: false, physical: true, friction })
    }

    /**
     * Ghi một MỐC TÁN LÁ. `Foliage` đọc `matrix`/`matrixWorld` nên PHẢI
     * updateMatrix trước — quên là cả cụm hiện ở gốc toạ độ.
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
     * Đừng bao giờ ghép hộp nghiêng thành dốc: hộp ghép bao giờ cũng hở, và mỗi
     * khe là một bậc bánh xe không leo nổi. Đây là bài học đắt nhất của khu FPTU.
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
         * theo trục **X**. Suy từ `Floor.setPhysical()` — chỗ duy nhất trong dự
         * án đã chạy đúng thật. Đổi chỗ hai cái này thì lưới vuông không ai
         * thấy, còn lưới dẹt là lộ ngay.
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
     * KHOẢNG CÁCH TỚI BỜ, đơn vị thế giới. Dương = trên đất, âm = ngoài biển.
     *
     * ⚠️ BẮT BUỘC PHẢI CÓ và phải móc vào `Audio.js`. Bản mẫu tính âm lượng sóng
     * theo mép ĐỊA HÌNH GỐC (`terrain.size / 2 − |x|`), mà địa hình gốc chỉ rộng
     * 192 (nửa cạnh 96) còn đảo này ở z 100…200 — hẳn NGOÀI nó. Không móc vào
     * thì công thức trả số âm khắp đảo, bị kẹp về 1, và tiếng sóng gào kịch trần
     * suốt thời gian ở đây. Đúng lỗi đã mất cả buổi để tìm ở khu FPTU ngày 31/7.
     *
     * Dùng lại Y HỆT hình siêu-ellipse của `islandHeight()` để mép nước NGHE
     * được trùng mép nước NHÌN được.
     */
    distanceToShore(x, z)
    {
        return (1 - this.shapeDistance(x, z)) * (PLAY_ISLAND.width + PLAY_ISLAND.depth) * 0.25
    }

    /** `d = 1` là mép đất. Tách riêng để cao độ và tiếng sóng không thể lệch nhau. */
    shapeDistance(x, z)
    {
        const nx = (x - PLAY_ISLAND.x) / (PLAY_ISLAND.width * 0.5)
        const nz = (z - PLAY_ISLAND.z) / (PLAY_ISLAND.depth * 0.5)

        // Siêu-ellipse bậc 4: gần chữ nhật ở giữa cạnh, bo tròn ở bốn góc
        let d = Math.pow(Math.pow(Math.abs(nx), 4) + Math.pow(Math.abs(nz), 4), 0.25)

        // Sóng bờ: hai tần số lệch pha, biên độ nhỏ — bờ hết thẳng đơ mà không
        // ăn vào chỗ đã có công trình
        const theta = Math.atan2(nz, nx)
        d /= 1 + 0.04 * Math.sin(theta * 3 - 0.9) + 0.02 * Math.sin(theta * 7 + 1.4)

        return d
    }

    islandHeight(x, z)
    {
        const d = this.shapeDistance(x, z)

        if(d <= 1)
            return GROUND_TOP

        // Bờ thoải xuống đáy biển. Đường sinh smoothstep nên dốc bằng 0 ở CẢ
        // hai đầu: không có gờ ở mép đất, không có hố ở chân bờ.
        const t = Math.min(1, (d - 1) / ISLAND_SHORE)
        const s = t * t * (3 - 2 * t)
        return GROUND_TOP + (SEA_FLOOR - GROUND_TOP) * s
    }

    /** Màu mặt đảo theo cao độ, PHA LIÊN TỤC (cắt ngưỡng thì ra dải răng cưa). */
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

        // Nhiễu CHỈ rắc ở vùng ven nước — rắc đều khắp thì mặt cỏ phẳng cũng bị
        // đẩy sang màu cát, nổi vệt loang lổ như bị hắt sơn.
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
        const width = PLAY_ISLAND.width + PLAY_ISLAND.width * ISLAND_SHORE + 12
        const depth = PLAY_ISLAND.depth + PLAY_ISLAND.depth * ISLAND_SHORE + 12

        this.heightPatch(
            PLAY_ISLAND.x, PLAY_ISLAND.z, width, depth,
            Math.round(width / 1.15), Math.round(depth / 1.15),
            (x, z) => this.islandHeight(x, z),
            null,
            (x, z, y) => this.islandColor(x, z, y),
        )
    }

    /**
     * Cầu nối bờ Nam đảo chính. Mặt thấp sát nước, KHÔNG lan can.
     *
     * Bỏ lan can là chủ ý (user chốt ở cầu FPTU): rơi xuống biển không phải án
     * tử vì mặt biển vẫn lái được (tấm `Floor.bedRock` bám theo xe), cứ vòng
     * lại là lên bờ. Đổi lại mặt cầu thoáng và hết hai dãy va chạm kẹp hai bên
     * — chính hai dãy đó từng chừa khe hẹp hơn thân xe và làm kẹt ở đầu cầu.
     */
    setBridge()
    {
        const length = Math.abs(PLAY_BRIDGE.toZ - PLAY_BRIDGE.fromZ) + 6
        const centerZ = (PLAY_BRIDGE.fromZ + PLAY_BRIDGE.toZ) * 0.5
        const y = GROUND_TOP - 0.2

        this.box(PLAY_BRIDGE.width, 0.5, length, PLAY_BRIDGE.x, y, centerZ, PLAY_COLORS.road, { castShadow: false })
        this.game.objects.add(
            null,
            {
                type: 'fixed',
                friction: 0.25,
                restitution: 0,
                position: { x: PLAY_BRIDGE.x, y, z: centerZ },
                colliders: [ { shape: 'cuboid', parameters: [ PLAY_BRIDGE.width * 0.5, 0.25, length * 0.5 ] } ]
            }
        )

        // Cọc chống dưới mặt cầu — thuần trang trí, đặt THẤP hơn mặt cầu nên
        // không có gì chặn xe. Không cho va chạm.
        for(let i = 0; i < 5; i++)
        {
            const z = PLAY_BRIDGE.fromZ + 3 + i * (length - 6) / 4
            for(const side of [ -1, 1 ])
                this.box(0.5, 1.6, 0.5, PLAY_BRIDGE.x + side * (PLAY_BRIDGE.width * 0.5 - 0.6), y - 0.9, z, '#6b6f76', { castShadow: false })
        }
    }

    /** Đường trục từ cầu + hai đường ngang rẽ sang bốn khu. */
    setRoads()
    {
        const { spine, cross } = PLAY_ROADS

        const spineLength = spine.toZ - spine.fromZ
        this.slab(spine.halfWidth * 2, spineLength, spine.x, (spine.fromZ + spine.toZ) * 0.5, PLAY_COLORS.road)

        for(const road of cross)
            this.slab(road.toX - road.fromX, road.halfWidth * 2, (road.fromX + road.toX) * 0.5, road.z, PLAY_COLORS.road)

        // Vạch tim đường đứt quãng — lát layer 2 để không tranh chiều sâu với mặt đường
        for(let z = spine.fromZ + 3; z < spine.toZ - 2; z += 6)
            this.slab(0.35, 2.6, spine.x, z, PLAY_COLORS.kerb, { layer: 2 })

        for(const road of cross)
            for(let x = road.fromX + 3; x < road.toX - 2; x += 6)
                this.slab(2.6, 0.35, x, road.z, PLAY_COLORS.kerb, { layer: 2 })
    }

    /**
     * Cây cối và đá quanh đảo — chỉ ở VÙNG CHƯA DÙNG, tránh xa lòng đường và
     * bốn ô đất đã chia (xem `PLOTS`), để khu dựng sau không phải dọn.
     *
     * ⚠️ Vật có `physical: true` gần đường là nguồn gốc của bốn lần chặn lối xe
     * ở khu FPTU — không bộ kiểm nào bắt được, chỉ lái thật mới lộ. Ở đây mọi
     * thứ đều lùi ≥ 3 đơn vị khỏi mép đường và mép ô đất.
     */
    setScenery()
    {
        const { spine, cross } = PLAY_ROADS

        const nearRoad = (x, z) =>
        {
            if(Math.abs(x - spine.x) < spine.halfWidth + 3 && z > spine.fromZ - 3 && z < spine.toZ + 3) return true
            for(const road of cross)
                if(Math.abs(z - road.z) < road.halfWidth + 3 && x > road.fromX - 3 && x < road.toX + 3) return true
            return false
        }

        const inPlot = (x, z) =>
        {
            for(const key of Object.keys(PLOTS))
            {
                const p = PLOTS[key]
                if(Math.abs(x - p.x) < p.width * 0.5 + 3 && Math.abs(z - p.z) < p.depth * 0.5 + 3) return true
            }
            // Sân bóng cũng là một ô đất, nhưng nó không nằm trong PLOTS
            if(this.arena && this.arena.blocked(x, z, 3)) return true
            return false
        }

        // Băm tất định — KHÔNG Math.random, để bản dựng còn tái lập được
        const hash = (i) => { const h = Math.sin(i * 127.1) * 43758.5453; return h - Math.floor(h) }

        let placed = 0
        for(let i = 0; i < 900 && placed < 120; i++)
        {
            const x = PLAY_ISLAND.x + (hash(i) - 0.5) * PLAY_ISLAND.width
            const z = PLAY_ISLAND.z + (hash(i + 3000) - 0.5) * PLAY_ISLAND.depth

            // Chỉ trồng trên đất chắc, lùi khỏi mép nước
            if(this.shapeDistance(x, z) > 0.93) continue
            if(nearRoad(x, z) || inPlot(x, z)) continue

            const kind = hash(i + 7000)

            if(kind < 0.62)
            {
                // Bụi lá mềm — đi qua `canopy()`, KHÔNG đắp hộp xanh
                this.canopy(x, GROUND_TOP + 0.5 + hash(i + 11000) * 0.6, z, 0.7 + hash(i + 13000) * 0.9)
            }
            else if(kind < 0.86)
            {
                // Cây: thân trụ + hai tán lá mềm chồng nhau
                const height = 2.2 + hash(i + 17000) * 1.8
                this.box(0.5, height, 0.5, x, GROUND_TOP + height * 0.5, z, '#7a5b3a', { geometry: this.cylinderGeometry })
                this.canopy(x, GROUND_TOP + height + 0.4, z, 1.5 + hash(i + 19000) * 0.7)
                this.canopy(x + 0.5, GROUND_TOP + height - 0.3, z - 0.4, 1.1)
            }
            else
            {
                // Tảng đá — thứ DUY NHẤT ở đây có va chạm, và luôn cách đường ≥ 3
                const s = 0.8 + hash(i + 23000) * 1.1
                this.box(s * 1.4, s, s * 1.2, x, GROUND_TOP + s * 0.45, z, '#8a8578', { rotationY: hash(i + 29000) * Math.PI, physical: true })
            }

            placed++
        }
    }
}
