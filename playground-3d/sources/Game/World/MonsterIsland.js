import * as THREE from 'three/webgpu'
import { attribute, color, texture as textureNode } from 'three/tsl'
import { Game } from '../Game.js'
import { MeshDefaultMaterial } from '../Materials/MeshDefaultMaterial.js'
import {
    MONSTER_ISLAND, MONSTER_BRIDGE, MONSTER_ROADS,
    MONSTER_PLOTS, MONSTER_COLORS,
} from '../../data/monsterisland.js'

/**
 * ĐẢO QUÁI VẬT — mảnh đất thứ NĂM, sân khấu của chế độ Sinh tồn.
 *
 * Đảo to nhất (240 × 200) và hoang tàn nhất: đất tro nứt nẻ, hố thiên thạch,
 * xác nhà đổ, rừng cây chết, và một cái TỔ phát sáng ở giữa — chỗ quái sẽ chui
 * ra khi chế độ Sinh tồn chạy. Nối vào đảo chính bằng cây cầu dài nhất thế
 * giới này (116 đơn vị ≈ 232 m), mục nát và sập một phần.
 *
 * Xem `data/monsterisland.js` cho mọi số liệu và lý do chọn chỗ.
 *
 * ⚠️ ĐỘC LẬP với `PlayIsland`/`CityIsland`/`FptuCampus` dù bộ hàm dựng gần như
 * y hệt — cùng lý do đã ghi ở `PlayIsland`: gộp chung thì mỗi lần sửa đảo mới
 * đều có thể làm hỏng ba khu đang chạy trên production.
 *
 * ─── BA ĐIỀU PHẢI GIỮ KHI SỬA FILE NÀY ───
 * 1. **MỘT hàm cao độ.** `islandHeight()` sinh ra CẢ hình LẪN va chạm của mặt
 *    đảo, kể cả chỗ lồi lõm, hố thiên thạch và những dải làm phẳng cho đường.
 *    Đừng bao giờ đắp hộp nghiêng thành dốc — hộp ghép bao giờ cũng hở, và mỗi
 *    khe là một bậc bánh xe không leo nổi.
 * 2. **Cũ nát chỉ ở phần HÌNH.** Mặt cầu thủng, đường nứt, nhà đổ — tất cả đều
 *    là hình. Thân va chạm luôn liền mạch, không thì người chơi kẹt giữa biển.
 * 3. **Draw call.** Đá, cây chết, mảnh vỡ đều lặp lại hàng trăm lần nên PHẢI đi
 *    qua `place()` + `buildInstances()`. Clone thẳng từng cái là đúng vết xe đổ
 *    của đảo thành phố: 3035 mesh riêng lẻ và user báo "game rất lag".
 */

/** Mặt đảo cao hơn "đáy biển" vật lý chừng này — LẤY ĐÚNG số của bốn đảo kia. */
const GROUND_TOP = 0.04

/** Đáy biển quanh đảo. */
const SEA_FLOOR = -1.7

/** Bề rộng bãi bờ tính theo tỉ lệ bán kính đảo. */
const ISLAND_SHORE = 0.12

/**
 * Biên độ gồ ghề của mặt đất, đơn vị thế giới.
 *
 * ⚠️ ĐỪNG NÂNG LÊN CHO "HOANG TÀN HƠN". Đây là mặt xe chạy: 0,42 với bước sóng
 * ~26 đơn vị cho ra dốc thoai thoải chừng 3–4°, xe leo thoải mái mà nhìn vẫn
 * gợn sóng chứ không phẳng lì như sân bóng. Nâng gấp đôi là bắt đầu có chỗ xe
 * mất đà giữa dốc, và kiểu lỗi đó chỉ lộ khi lái thật.
 */
const RUGGEDNESS = 0.42

/**
 * Hố thiên thạch: [x, z, bán kính, độ sâu].
 *
 * ⚠️ Miệng hố (tâm ± bán kính) không được chạm lòng đường. Hố tự nó thì vô hại
 * — `flatFactor()` kéo mặt đường về phẳng nên đường vẫn đi được — nhưng
 * `setCraterField()` thả một MẢNH THIÊN THẠCH CÓ VA CHẠM vào giữa mỗi hố, và
 * mảnh đó nằm giữa đường là chặn xe. Đường trục ở x = 0, hai đường ngang ở
 * z = −246 và −350.
 */
const CRATERS = [
    [ 74, -222, 14, 1.5 ],
    [ 96, -196, 10, 1.0 ],
    [ 44, -206, 9, 0.9 ],
    [ -78, -212, 12, 1.2 ],
    [ -44, -382, 13, 1.3 ],
    [ 26, -388, 10, 1.0 ],
]

export class MonsterIsland
{
    constructor()
    {
        this.game = Game.getInstance()

        this.group = new THREE.Group()
        this.group.name = 'monsterIsland'
        this.game.scene.add(this.group)

        this.boxGeometry = new THREE.BoxGeometry(1, 1, 1)
        this.cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 8)
        this.coneGeometry = new THREE.ConeGeometry(0.5, 1, 7)
        this.sphereGeometry = new THREE.SphereGeometry(0.5, 8, 6)
        this.materials = new Map()

        this.groundTop = GROUND_TOP

        /**
         * Số liệu đường phơi ra cho `tools/check-monster-island.mjs`.
         * Bộ kiểm gõ tay lại toạ độ đường là tự chuốc báo oan — sửa bố cục ở
         * `data/monsterisland.js` xong quên sửa bộ kiểm thì nó đi soi lòng
         * đường cũ. Đúng lỗi đã mắc một lần ở đảo sân chơi.
         */
        this.roads = MONSTER_ROADS
        this.plots = MONSTER_PLOTS

        /** Gom ma trận cho `buildInstances()` — xem chú thích ở đầu file. */
        this.instanceBatches = new Map()

        this.setIsland()
        this.setBridge()
        this.setRoads()
        this.setHive()
        this.setRuins()
        this.setCraterField()
        this.setScrapyard()
        this.setScenery()

        this.buildInstances()
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

    /** Vật liệu tự phát sáng cho mạch trên tổ quái — KHÔNG dùng PointLight. */
    getGlowMaterial(hex)
    {
        const key = `glow:${hex}`
        let material = this.materials.get(key)

        if(!material)
        {
            /**
             * Cả thế giới chỉ có MỘT nguồn sáng (xem `Ligthing`), nên thả đèn
             * điểm vào đây là vô nghĩa — thứ phát sáng phải tự phát sáng bằng
             * vật liệu. Nhân màu lên trên 1 để lọt ngưỡng bloom (0,25 ở
             * `Rendering.bloomPass`) thì mới thấy quầng.
             */
            material = new MeshDefaultMaterial({
                colorNode: color(hex).mul(2.6),
                hasCoreShadows: false,
                hasDropShadows: false,
                hasLightBounce: false,
            })
            this.materials.set(key, material)
        }

        return material
    }

    box(width, height, depth, x, y, z, hex, { rotationX = 0, rotationY = 0, rotationZ = 0, physical = false, geometry = null, castShadow = true, receiveShadow = true, friction = null, restitution = null, material = null } = {})
    {
        const mesh = new THREE.Mesh(geometry ?? this.boxGeometry, material ?? this.getMaterial(hex))
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
            // ⚠️ Quaternion dựng từ CẢ BA trục Euler, không chỉ mỗi Y — khối
            // nghiêng mà chỉ lấy Y thì hình một đằng va chạm một nẻo
            const quaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(rotationX, rotationY, rotationZ, 'YZX'))

            /**
             * ⚠️ CHẶN KÍCH THƯỚC ÂM — đây là lỗi đã làm đứng hình cả game.
             *
             * Một chiều âm (do viết `toZ - fromZ` mà z giảm dần) đi thẳng vào
             * `halfExtents` của Rapier, và cuboid nửa-cạnh âm thì mọi phép va
             * chạm với nó trả về NaN: vị trí xe NaN → âm lượng NaN →
             * `setValueAtTime` ném lỗi giữa chuỗi tick → render không bao giờ
             * chạy. HÌNH thì vẫn hiện bình thường nên nhìn không ra.
             *
             * Lấy trị tuyệt đối để game vẫn chạy, nhưng KÊU TO — im lặng sửa hộ
             * là lần sau lại mất một buổi đi tìm.
             */
            if(!(width > 0) || !(height > 0) || !(depth > 0))
                console.warn(`[MonsterIsland] kích thước va chạm không hợp lệ tại (${x} · ${y} · ${z}): ${width} × ${height} × ${depth}`)

            const description = {
                type: 'fixed',
                position: { x, y, z },
                rotation: { x: quaternion.x, y: quaternion.y, z: quaternion.z, w: quaternion.w },
                colliders: [ { shape: 'cuboid', parameters: [ Math.abs(width) * 0.5, Math.abs(height) * 0.5, Math.abs(depth) * 0.5 ] } ]
            }
            if(friction !== null) description.friction = friction
            if(restitution !== null) description.restitution = restitution

            mesh.userData.object = this.game.objects.add(null, description)
        }

        return mesh
    }

    /**
     * Tấm lát nền — CÓ thân vật lý.
     *
     * `layer`: 0 = mặt đường · 1 = thứ lát đè lên · 2 = vệt nứt/vạch.
     * Hai tấm cùng cao độ thì depth buffer không phân biệt nổi, ra vệt răng cưa
     * nhấp nháy — đúng thứ user gọi là "nhà bị nhiễu giật giật" ở thành phố.
     */
    slab(width, depth, x, z, hex, { layer = 0, friction = null, rotationY = 0 } = {})
    {
        const y = GROUND_TOP + 0.05 + layer * 0.035
        return this.box(width, 0.04, depth, x, y, z, hex, { castShadow: false, receiveShadow: false, physical: layer === 0, friction, rotationY })
    }

    /**
     * Ghi một bản sao vào lô instanced. `kind` gộp theo hình học + màu.
     * Ma trận dựng ở đây, `buildInstances()` mới thật sự tạo mesh.
     */
    place(kind, geometry, hex, position, quaternion, scale)
    {
        let batch = this.instanceBatches.get(kind)

        if(!batch)
        {
            batch = { geometry, hex, matrices: [] }
            this.instanceBatches.set(kind, batch)
        }

        batch.matrices.push(new THREE.Matrix4().compose(position, quaternion, scale))
    }

    /** Tạo `InstancedMesh` cho mọi lô đã gom. Gọi SAU CÙNG trong hàm dựng. */
    buildInstances()
    {
        for(const [ kind, batch ] of this.instanceBatches)
        {
            if(!batch.matrices.length) continue

            const mesh = new THREE.InstancedMesh(batch.geometry, this.getMaterial(batch.hex), batch.matrices.length)
            mesh.name = `monsterIsland:${kind}`
            for(let i = 0; i < batch.matrices.length; i++)
                mesh.setMatrixAt(i, batch.matrices[i])
            mesh.instanceMatrix.needsUpdate = true
            mesh.castShadow = true
            mesh.receiveShadow = true
            this.group.add(mesh)
        }
    }

    /**
     * MẢNG ĐỊA HÌNH MƯỢT — một hàm cao độ duy nhất sinh ra cả hình lẫn va chạm.
     * Xem chú thích đầu file về vì sao không được ghép hộp nghiêng.
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
         * án đã chạy đúng thật. Lưới ở đây DẸT (240 × 200) nên đổi chỗ hai cái
         * này là lộ ngay, khác lưới vuông của bản mẫu.
         */
        this.game.objects.add(null, {
            type: 'fixed',
            friction: 0.32,
            restitution: 0,
            position: { x: cx, y: 0, z: cz },
            colliders: [ { shape: 'heightfield', parameters: [ rows, cols, heights, { x: sizeX, y: 1, z: sizeZ } ] } ]
        })

        return mesh
    }

    /**
     * KHOẢNG CÁCH TỚI BỜ. Dương = trên đất, âm = ngoài biển.
     *
     * ⚠️ BẮT BUỘC PHẢI CÓ và phải móc vào `Audio.js`. Bản mẫu tính âm lượng
     * sóng theo mép ĐỊA HÌNH GỐC (`terrain.size / 2 − |x|`), mà địa hình gốc
     * chỉ rộng 192 (nửa cạnh 96) còn đảo này ở z −400…−200 — hẳn ngoài nó.
     * Không móc thì công thức trả số âm khắp đảo, bị kẹp về 1, và tiếng sóng
     * gào kịch trần suốt thời gian ở đây. Lỗi này đã mất cả buổi để tìm ở khu
     * FPTU, rồi lặp lại y hệt ở đảo sân chơi.
     */
    distanceToShore(x, z)
    {
        return (1 - this.shapeDistance(x, z)) * (MONSTER_ISLAND.width + MONSTER_ISLAND.depth) * 0.25
    }

    /** `d = 1` là mép đất. Tách riêng để cao độ và tiếng sóng không thể lệch nhau. */
    shapeDistance(x, z)
    {
        const nx = (x - MONSTER_ISLAND.x) / (MONSTER_ISLAND.width * 0.5)
        const nz = (z - MONSTER_ISLAND.z) / (MONSTER_ISLAND.depth * 0.5)

        // Siêu-ellipse bậc 4: gần chữ nhật ở giữa cạnh, bo tròn ở bốn góc
        let d = Math.pow(Math.pow(Math.abs(nx), 4) + Math.pow(Math.abs(nz), 4), 0.25)

        /**
         * Bờ RÁCH hơn ba đảo kia — bốn tần số thay vì hai, biên độ gấp rưỡi.
         * Đây là chỗ "cũ nát" được phép làm thật (chứ không chỉ ở phần hình):
         * bờ biển lồi lõm không ảnh hưởng gì tới đường xe chạy.
         */
        const theta = Math.atan2(nz, nx)
        d /= 1
            + 0.055 * Math.sin(theta * 3 - 0.9)
            + 0.035 * Math.sin(theta * 7 + 1.4)
            + 0.022 * Math.sin(theta * 13 + 0.3)

        return d
    }

    /** Nhiễu giả ngẫu nhiên tất định — không dùng Math.random để dựng thế giới. */
    noise(x, z)
    {
        const h = Math.sin(x * 0.0472 + 1.7) * Math.cos(z * 0.0391 - 0.6)
            + 0.55 * Math.sin(x * 0.0917 - 2.3) * Math.cos(z * 0.1013 + 1.1)
            + 0.3 * Math.sin((x + z) * 0.1533 + 0.4)
        return h / 1.85
    }

    /**
     * 1 = phải phẳng tuyệt đối, 0 = để địa hình tự nhiên.
     *
     * Đường và các ô đất phải nằm trên mặt phẳng, không thì tấm lát nổi lên
     * hoặc chìm xuống so với đất gồ ghề bên dưới. Xử ngay TRONG hàm cao độ chứ
     * không kê hộp cho bằng — đó là cả điểm của "một hàm cao độ".
     */
    flatFactor(x, z)
    {
        let flat = 0

        const band = (distance, half, fade) =>
        {
            if(distance <= half) return 1
            if(distance >= half + fade) return 0
            const t = 1 - (distance - half) / fade
            return t * t * (3 - 2 * t)
        }

        // Đường trục
        const spine = MONSTER_ROADS.spine
        if(z >= spine.fromZ - 8 && z <= spine.toZ + 8)
            flat = Math.max(flat, band(Math.abs(x - spine.x), spine.halfWidth + 2, 7))

        // Đường ngang
        for(const cross of MONSTER_ROADS.cross)
            if(x >= cross.fromX - 8 && x <= cross.toX + 8)
                flat = Math.max(flat, band(Math.abs(z - cross.z), cross.halfWidth + 2, 7))

        // Ô đất đã chừa (trừ bãi hố — chỗ đó địa hình mới là nội dung)
        for(const key of [ 'hive', 'ruins', 'scrapyard', 'bridgehead' ])
        {
            const plot = MONSTER_PLOTS[key]
            const dx = Math.abs(x - plot.x) - plot.width * 0.5
            const dz = Math.abs(z - plot.z) - plot.depth * 0.5
            const outside = Math.max(0, Math.max(dx, dz))
            flat = Math.max(flat, band(outside, 0, 9))
        }

        return Math.min(1, flat)
    }

    islandHeight(x, z)
    {
        const d = this.shapeDistance(x, z)

        if(d > 1)
        {
            // Bờ thoải xuống đáy biển. Đường sinh smoothstep nên dốc bằng 0 ở
            // CẢ hai đầu: không gờ ở mép đất, không hố ở chân bờ.
            const t = Math.min(1, (d - 1) / ISLAND_SHORE)
            const s = t * t * (3 - 2 * t)
            return GROUND_TOP + (SEA_FLOOR - GROUND_TOP) * s
        }

        let y = GROUND_TOP + this.noise(x, z) * RUGGEDNESS

        // Hố thiên thạch — lòng chảo smoothstep, dốc bằng 0 ở miệng nên xe bò
        // ra được, không thành cái bẫy
        for(const [ cx, cz, radius, depth ] of CRATERS)
        {
            const distance = Math.hypot(x - cx, z - cz)
            if(distance >= radius) continue
            const t = distance / radius
            const s = 1 - t * t * (3 - 2 * t)
            y -= depth * s
            // Gờ đất hất lên quanh miệng hố
            y += depth * 0.22 * Math.max(0, 1 - Math.abs(t - 0.92) / 0.16)
        }

        // Làm phẳng ở đường và ô đất
        const flat = this.flatFactor(x, z)
        if(flat > 0) y += (GROUND_TOP - y) * flat

        // Mép đất phải trùng đúng cao độ bờ, không thì có bậc ở mép nước
        const edge = Math.min(1, Math.max(0, (d - 0.9) / 0.1))
        if(edge > 0) y += (GROUND_TOP - y) * edge

        return y
    }

    /** Màu mặt đảo theo cao độ, PHA LIÊN TỤC (cắt ngưỡng ra dải răng cưa). */
    islandColor(x, z, y)
    {
        if(!this._colorScratch)
        {
            this._colorScratch = new THREE.Color()
            this._colorStops = [
                { y: SEA_FLOOR, c: new THREE.Color(MONSTER_COLORS.deep) },
                { y: -0.68, c: new THREE.Color(MONSTER_COLORS.bed) },
                { y: -0.26, c: new THREE.Color(MONSTER_COLORS.shallow) },
                { y: -0.05, c: new THREE.Color(MONSTER_COLORS.sand) },
                { y: GROUND_TOP - 0.005, c: new THREE.Color(MONSTER_COLORS.sand) },
                { y: GROUND_TOP, c: new THREE.Color(MONSTER_COLORS.ground) },
                { y: GROUND_TOP + RUGGEDNESS * 0.9, c: new THREE.Color(MONSTER_COLORS.rock) },
            ]
        }

        let yy = y

        // Nhiễu CHỈ rắc ven nước — rắc đều khắp thì mặt đất phẳng cũng bị đẩy
        // sang màu cát, nổi vệt loang lổ như bị hắt sơn
        if(y < GROUND_TOP - 0.002)
        {
            const h = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453
            yy += (h - Math.floor(h) - 0.5) * 0.07
        }

        const stops = this._colorStops
        let base
        if(yy <= stops[0].y) base = stops[0].c
        else
        {
            base = stops[stops.length - 1].c
            for(let i = 1; i < stops.length; i++)
            {
                if(yy > stops[i].y) continue
                const a = stops[i - 1], b = stops[i]
                const t = (yy - a.y) / (b.y - a.y)
                base = this._colorScratch.copy(a.c).lerp(b.c, t)
                break
            }
        }

        // Vệt cháy loang trên mặt đất — pha liên tục, không cắt ngưỡng
        if(y >= GROUND_TOP - 0.01)
        {
            const burn = Math.max(0, this.noise(x * 2.3 + 40, z * 2.1 - 25))
            if(burn > 0)
            {
                if(base === this._colorScratch)
                    return base.lerp(new THREE.Color(MONSTER_COLORS.groundDark), burn * 0.45)
                return this._colorScratch.copy(base).lerp(new THREE.Color(MONSTER_COLORS.groundDark), burn * 0.45)
            }
        }

        return base
    }

    setIsland()
    {
        const width = MONSTER_ISLAND.width + MONSTER_ISLAND.width * ISLAND_SHORE + 14
        const depth = MONSTER_ISLAND.depth + MONSTER_ISLAND.depth * ISLAND_SHORE + 14

        /**
         * ⚠️ MẬT ĐỘ LƯỚI 1,7 CHỨ KHÔNG PHẢI 1,1 như ba đảo kia.
         *
         * Đảo này to gần gấp đôi đảo thành phố, nên cùng một mật độ là ra
         * 257 × 216 ô = **111.000 tam giác** chỉ riêng mặt đất. Đo ngày 1/8:
         * cả đảo ngốn 411k tam giác trong khi TOÀN BỘ thế giới trước đó mới
         * 769k — tức tăng hơn một nửa cho một hòn đảo.
         *
         * Thưa lưới xuống 1,7 cắt được ~60% số đó mà hình không xấu đi: gợn
         * đất ở đây có bước sóng ~26 đơn vị (xem `noise()`), một ô 1,7 vẫn lấy
         * được thừa chi tiết. Chỗ cần mịn — đường, ô đất — thì đã được
         * `flatFactor()` làm phẳng hẳn nên càng không cần lưới dày.
         */
        this.heightPatch(
            MONSTER_ISLAND.x, MONSTER_ISLAND.z, width, depth,
            Math.round(width / 1.7), Math.round(depth / 1.7),
            (x, z) => this.islandHeight(x, z),
            null,
            (x, z, y) => this.islandColor(x, z, y),
        )
    }

    /**
     * CẦU MỤC NÁT — dài 116 đơn vị, cầu dài nhất thế giới này.
     *
     * ⚠️ MẶT VA CHẠM LÀ MỘT KHỐI LIỀN từ đầu tới cuối. Mọi thứ gãy/thủng/mất
     * mảng chỉ nằm ở phần hình: ván lát khuyết, lan can gãy khúc, dây văng đứt
     * lủng lẳng, một tháp nghiêng hẳn. Làm thủng thật thì đẹp đúng một lần rồi
     * người chơi kẹt vĩnh viễn giữa biển — xem `data/monsterisland.js`.
     */
    setBridge()
    {
        const { x, fromZ, toZ, width, towerHeight, towers } = MONSTER_BRIDGE
        const length = Math.abs(toZ - fromZ) + 6
        const centerZ = (fromZ + toZ) * 0.5
        const y = GROUND_TOP - 0.2

        // Mặt cầu: hình chia thành nhiều đoạn cho ra vẻ chắp vá…
        const segments = 14
        for(let i = 0; i < segments; i++)
        {
            const segLength = length / segments
            const z = fromZ - 3 + segLength * (i + 0.5)
            // Mỗi đoạn lệch nhẹ một chút — ván lát xô nhau theo năm tháng
            const tilt = (i % 3 === 0 ? 1 : i % 3 === 1 ? -1 : 0) * 0.012
            const shrink = i % 4 === 2 ? 0.86 : 1
            this.box(width * shrink, 0.45, segLength * 0.98, x + (i % 5 === 3 ? 0.35 : 0), y, z, MONSTER_COLORS.deck, {
                castShadow: false, rotationZ: tilt,
            })
        }

        // …nhưng VA CHẠM là một khối liền, rộng đủ cho cả những đoạn hình bị hụt
        this.game.objects.add(
            null,
            {
                type: 'fixed',
                friction: 0.25,
                restitution: 0,
                position: { x, y, z: centerZ },
                colliders: [ { shape: 'cuboid', parameters: [ width * 0.5, 0.25, length * 0.5 ] } ]
            }
        )

        // Vệt gỉ chảy dọc mặt cầu
        for(let i = 0; i < 9; i++)
        {
            const z = fromZ + 6 + i * (length - 12) / 8
            this.decal('rustStain', width * 0.24, 5 + (i % 3) * 3, x + ((i % 2) ? -1 : 1) * width * 0.26, z, MONSTER_COLORS.rust)
        }

        // Hai tháp — tháp phía đảo quái NGHIÊNG HẲN, như sắp đổ
        towers.forEach((towerZ, index) =>
        {
            const leaning = index === 1
            const lean = leaning ? 0.13 : 0
            const height = towerHeight * (leaning ? 0.82 : 1)

            for(const side of [ -1, 1 ])
            {
                this.box(1.5, height, 1.5, x + side * width * 0.46, y + height * 0.5, towerZ, MONSTER_COLORS.steel, {
                    rotationZ: lean * -side, castShadow: true,
                })
            }

            // Thanh ngang nối đỉnh — tháp nghiêng thì thanh này gãy mất một nửa
            const beamWidth = leaning ? width * 0.55 : width * 1.0
            this.box(beamWidth, 1.1, 1.2, x + (leaning ? -width * 0.22 : 0), y + height * 0.92, towerZ, MONSTER_COLORS.steel, { castShadow: true })

            /**
             * Dây văng toả quạt. Cứ vài sợi lại ĐỨT: sợi đứt vẽ ngắn hơn và
             * chúc xuống, thay vì nối tới mặt cầu.
             */
            const cableCount = 7
            for(let i = 1; i <= cableCount; i++)
            {
                for(const direction of [ -1, 1 ])
                {
                    const broken = (i + index * 2 + (direction > 0 ? 1 : 0)) % 4 === 0
                    const reach = (length * 0.42) * (i / cableCount)
                    const anchorZ = towerZ + direction * reach
                    if(Math.abs(anchorZ - centerZ) > length * 0.5) continue

                    const top = y + height * 0.88
                    const factor = broken ? 0.45 : 1
                    const endZ = towerZ + (anchorZ - towerZ) * factor
                    const endY = broken ? top - height * 0.42 : y + 0.4

                    for(const side of [ -1, 1 ])
                    {
                        const start = new THREE.Vector3(x + side * width * 0.42, top, towerZ)
                        const end = new THREE.Vector3(x + side * width * 0.46, endY, endZ)
                        this.strut(start, end, 0.16, MONSTER_COLORS.cable, 'cable')
                    }
                }
            }
        })

        // Cọc chống dưới mặt cầu — trang trí, đặt THẤP hơn mặt cầu nên không
        // chặn xe. Vài cọc gãy ngang.
        for(let i = 0; i < 9; i++)
        {
            const z = fromZ + 4 + i * (length - 8) / 8
            const broken = i % 4 === 1
            for(const side of [ -1, 1 ])
                this.place(
                    'bridgePost', this.boxGeometry, MONSTER_COLORS.steel,
                    new THREE.Vector3(x + side * (width * 0.5 - 0.7), y - (broken ? 0.55 : 1.05), z),
                    new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, broken ? 0.25 * side : 0)),
                    new THREE.Vector3(0.6, broken ? 0.9 : 1.9, 0.6),
                )
        }

        // Lan can gãy khúc — chỉ còn từng đoạn, KHÔNG có va chạm nên không thể
        // chừa khe hẹp hơn thân xe (lỗi đã bốn lần chặn lối xe ở khu FPTU)
        for(let i = 0; i < segments; i++)
        {
            if(i % 3 === 1) continue
            const segLength = length / segments
            const z = fromZ - 3 + segLength * (i + 0.5)
            for(const side of [ -1, 1 ])
                this.place(
                    'bridgeRail', this.boxGeometry, MONSTER_COLORS.steel,
                    new THREE.Vector3(x + side * width * 0.47, y + 0.65, z),
                    new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, ((i * 7 + (side > 0 ? 3 : 0)) % 5 - 2) * 0.06)),
                    new THREE.Vector3(0.28, 0.9, segLength * 0.7),
                )
        }
    }

    /**
     * Một thanh nối hai điểm bất kỳ — dùng cho dây văng và ống dẫn của tổ quái.
     *
     * `kind` khác null thì thanh đi vào lô instanced thay vì tạo mesh riêng.
     * Dây văng có tới ~56 sợi nên bắt buộc phải gộp; mấy cái ống to của tổ
     * quái thì chỉ vài cái, để mesh riêng cho dễ đọc.
     */
    strut(start, end, thickness, hex, kind = null)
    {
        const direction = new THREE.Vector3().subVectors(end, start)
        const length = direction.length()
        if(length < 0.01) return

        const position = start.clone().addScaledVector(direction, 0.5)
        const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize())
        const scale = new THREE.Vector3(thickness, length, thickness)

        if(kind)
        {
            this.place(kind, this.cylinderGeometry, hex, position, quaternion, scale)
            return null
        }

        const mesh = new THREE.Mesh(this.cylinderGeometry, this.getMaterial(hex))
        mesh.scale.copy(scale)
        mesh.position.copy(position)
        mesh.quaternion.copy(quaternion)
        mesh.castShadow = false
        mesh.receiveShadow = false
        this.group.add(mesh)

        return mesh
    }

    /**
     * Tấm mỏng THUẦN HÌNH (vệt nứt, vệt gỉ) — vào thẳng lô instanced.
     *
     * Riêng đảo này có gần 100 vệt nứt trên đường và 9 vệt gỉ trên cầu; để mỗi
     * cái một mesh là cộng thêm ngần ấy draw call cho một thứ chỉ để nhìn.
     */
    decal(kind, width, depth, x, z, hex, { layer = 2, rotationY = 0 } = {})
    {
        this.place(
            kind, this.boxGeometry, hex,
            new THREE.Vector3(x, GROUND_TOP + 0.05 + layer * 0.035, z),
            new THREE.Quaternion().setFromEuler(new THREE.Euler(0, rotationY, 0)),
            new THREE.Vector3(width, 0.04, depth),
        )
    }

    /** Đường mòn: trục dọc từ đầu cầu + hai nhánh ngang, nứt nẻ. */
    setRoads()
    {
        const { spine, cross } = MONSTER_ROADS

        /**
         * ⚠️ `Math.abs` — ĐÂY LÀ CHỖ ĐÃ LÀM ĐƠ CẢ GAME.
         *
         * Đảo này nằm ở z ÂM và đường trục chạy từ −204 xuống −390, nên
         * `toZ - fromZ` ra **−186**. Chiều dài âm đi thẳng vào collider thành
         * `halfExtents = (5,5 · 0,02 · −93)`, và Rapier gặp cuboid nửa-cạnh âm
         * thì tính ra NaN: vị trí xe NaN → âm lượng NaN → `setValueAtTime` NÉM
         * LỖI giữa chuỗi tick → mọi handler sau đó (kể cả `Rendering.render` ở
         * nhịp 998) không chạy → **đứng khung hình**.
         *
         * Ba thứ khiến nó khó tìm:
         *  · HÌNH vẫn hiện bình thường (mesh scale âm chỉ lật mặt, vẫn vẽ)
         *  · Chỉ hỏng khi xe CHẠM vào collider đó, nên đứng yên thì không sao
         *  · Không tất định — có lần lái qua vẫn êm
         *
         * Đảo sân chơi có cùng dòng mã này mà không lỗi, chỉ vì z ở đó TĂNG dần.
         */
        const spineLength = Math.abs(spine.toZ - spine.fromZ)
        this.slab(spine.halfWidth * 2, spineLength, spine.x, (spine.fromZ + spine.toZ) * 0.5, MONSTER_COLORS.road)

        for(const road of cross)
            this.slab(Math.abs(road.toX - road.fromX), road.halfWidth * 2, (road.fromX + road.toX) * 0.5, road.z, MONSTER_COLORS.road)

        /**
         * Vệt nứt — tấm mảnh màu tối rải dọc lòng đường, layer 2 nên nằm TRÊN
         * mặt đường và không tranh chiều sâu với nó. Thuần hình, không va chạm.
         */
        for(let i = 0; i < 46; i++)
        {
            const t = (i + 0.5) / 46
            const z = spine.fromZ + spineLength * t
            const offset = Math.sin(i * 2.7) * spine.halfWidth * 0.6
            this.decal('crack', 0.3 + (i % 3) * 0.25, 3 + (i % 4) * 2.5, spine.x + offset, z, MONSTER_COLORS.crack, {
                rotationY: Math.sin(i * 1.3) * 0.35,
            })
        }

        for(const road of cross)
        {
            const span = road.toX - road.fromX
            for(let i = 0; i < 26; i++)
            {
                const t = (i + 0.5) / 26
                const x = road.fromX + span * t
                this.decal('crack', 3 + (i % 4) * 2, 0.3 + (i % 3) * 0.22, x, road.z + Math.sin(i * 2.1) * road.halfWidth * 0.6, MONSTER_COLORS.crack, {
                    rotationY: Math.sin(i * 0.9) * 0.3,
                })
            }
        }
    }

    /**
     * TỔ QUÁI ở giữa đảo — nơi quái sẽ chui ra khi chế độ Sinh tồn chạy.
     *
     * Dựng như một khối u khổng lồ: vòm chính, mấy ống dẫn cắm xuống đất, và
     * những mạch phát sáng chạy trên vỏ. Chưa có logic sinh quái ở đây — file
     * này chỉ dựng sân khấu, phần chơi sẽ nối vào sau khi có model quái.
     */
    setHive()
    {
        const plot = MONSTER_PLOTS.hive
        const { x, z } = plot

        // Bệ đất nhô lên
        for(let ring = 0; ring < 3; ring++)
        {
            const radius = 22 - ring * 6
            const height = 0.5 + ring * 0.55
            this.box(radius * 2, height, radius * 1.75, x, GROUND_TOP + height * 0.5, z, ring === 2 ? MONSTER_COLORS.hive : MONSTER_COLORS.rock, {
                physical: true, rotationY: ring * 0.22,
            })
        }

        const baseY = GROUND_TOP + 2.4

        // Vòm chính
        this.box(19, 15, 17, x, baseY + 6.4, z, MONSTER_COLORS.hive, { geometry: this.sphereGeometry, physical: true })

        // Ba ống dẫn chĩa ra, cắm xuống đất
        const tubes = [ [ 1, 0.3 ], [ -0.75, 0.85 ], [ -0.2, -1 ] ]
        tubes.forEach(([ dx, dz ], index) =>
        {
            const length = 15 + index * 2.5
            const dir = new THREE.Vector3(dx, 0, dz).normalize()
            const start = new THREE.Vector3(x + dir.x * 6, baseY + 7.5, z + dir.z * 6)
            const end = new THREE.Vector3(x + dir.x * length, GROUND_TOP + 0.4, z + dir.z * length)
            this.strut(start, end, 3.1 - index * 0.35, MONSTER_COLORS.hive)

            // Chân ống có va chạm để húc vào thì đụng thật
            this.box(3.4, 2.4, 3.4, end.x, GROUND_TOP + 1.2, end.z, MONSTER_COLORS.hive, { physical: true })
        })

        // Gai nhọn quanh tổ
        for(let i = 0; i < 16; i++)
        {
            const angle = (i / 16) * Math.PI * 2
            const radius = 13 + (i % 3) * 2.6
            const height = 4 + (i % 4) * 1.7
            const px = x + Math.cos(angle) * radius
            const pz = z + Math.sin(angle) * radius * 0.86

            this.place(
                'spike', this.coneGeometry, MONSTER_COLORS.hive,
                new THREE.Vector3(px, GROUND_TOP + height * 0.5, pz),
                new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.sin(i * 1.7) * 0.22, angle, Math.cos(i * 2.1) * 0.22)),
                new THREE.Vector3(1.5 + (i % 3) * 0.4, height, 1.5 + (i % 3) * 0.4),
            )
        }

        // Mạch phát sáng trên vỏ — vật liệu tự phát sáng, KHÔNG dùng PointLight
        for(let i = 0; i < 22; i++)
        {
            const angle = (i / 22) * Math.PI * 2 + 0.4
            const tilt = 0.25 + (i % 5) * 0.2
            const radius = 8.6
            const mesh = new THREE.Mesh(this.sphereGeometry, this.getGlowMaterial(MONSTER_COLORS.hiveGlow))
            mesh.position.set(
                x + Math.cos(angle) * radius * Math.cos(tilt),
                baseY + 6.4 + Math.sin(tilt) * 7.2,
                z + Math.sin(angle) * radius * Math.cos(tilt) * 0.9,
            )
            mesh.scale.setScalar(0.9 + (i % 4) * 0.35)
            mesh.castShadow = false
            mesh.receiveShadow = false
            this.group.add(mesh)
        }
    }

    /**
     * KHU NHÀ ĐỔ NÁT — tái dùng chính `city.glb` đã có trong dự án.
     *
     * Không tốn thêm một byte tải về: model đã nạp cho đảo thành phố, ở đây chỉ
     * đặt lại với góc nghiêng và chiều cao thụt xuống cho ra vẻ sụp. Nếu vì lý
     * do gì mà resource không có thì bỏ qua êm, đảo vẫn dựng đủ những phần kia.
     */
    setRuins()
    {
        const source = this.game.resources?.cityModel?.scene
        const plot = MONSTER_PLOTS.ruins

        if(!source)
        {
            console.warn('[MonsterIsland] không thấy `resources.cityModel` — bỏ qua khu nhà đổ')
            return
        }

        /**
         * ⚠️ `GLTFLoader` XOÁ HẲN dấu chấm trong tên node: `Building_Medium_2.001`
         * vào scene thành `Building_Medium_2001`. Ở đảo thành phố, đúng cái bẫy
         * này làm 11 trong 32 toà nhà lặng lẽ không mọc lên, KHÔNG một lỗi nào.
         * Nên tra cả hai dạng.
         */
        const piece = (name) =>
            source.getObjectByName(name)
            ?? source.getObjectByName(name.replace(/\./g, ''))
            ?? null

        const names = [
            'Building_Small_1', 'Building_Small_2', 'Building_Medium_1',
            'Building_Medium_2', 'Building_Large_1', 'Building_Small_3',
        ]

        const available = names.map(piece).filter(Boolean)
        if(!available.length)
        {
            console.warn('[MonsterIsland] không mảnh nhà nào khớp tên — bỏ qua khu nhà đổ')
            return
        }

        this.ruinCount = 0

        for(let row = 0; row < 4; row++)
        {
            for(let col = 0; col < 4; col++)
            {
                // Chừa một ô trống làm khoảng sân giữa khu
                if(row === 2 && col === 1) continue

                const index = row * 4 + col
                const px = plot.x - plot.width * 0.5 + 12 + col * (plot.width - 24) / 3
                const pz = plot.z - plot.depth * 0.5 + 11 + row * (plot.depth - 22) / 3

                const template = available[index % available.length]
                const model = template.clone(true)

                // Sụp: thụt xuống đất, nghiêng, và thu nhỏ chiều cao
                const sink = 0.6 + (index % 4) * 0.8
                const scale = 0.5
                model.scale.set(scale, scale * (0.55 + (index % 5) * 0.1), scale)
                model.position.set(px, GROUND_TOP - sink, pz)
                model.rotation.set(
                    ((index * 5) % 7 - 3) * 0.035,
                    (index % 8) * 0.78,
                    ((index * 3) % 7 - 3) * 0.045,
                )
                model.updateMatrix()

                this.charModel(model)
                this.group.add(model)
                this.ruinCount++

                /**
                 * Va chạm bằng HỘP BAO, không trimesh — cùng cách đã dùng ở
                 * đảo thành phố. Đo hộp bao bằng geometry cục bộ chứ KHÔNG
                 * `Box3.setFromObject()`: dựng trong `world.step(1)` thì
                 * `matrixWorld` còn là ma trận đơn vị và mọi hộp trả về 1×1×1
                 * ở gốc toạ độ, im lặng không lỗi.
                 */
                const size = this.localSize(model)
                if(size)
                    this.game.objects.add(null, {
                        type: 'fixed',
                        friction: 0.4,
                        restitution: 0,
                        position: { x: px, y: GROUND_TOP - sink + size.y * 0.5, z: pz },
                        colliders: [ { shape: 'cuboid', parameters: [ size.x * 0.42, size.y * 0.5, size.z * 0.42 ] } ]
                    })
            }
        }

        // Đống gạch vụn rải giữa các nhà
        for(let i = 0; i < 60; i++)
        {
            const px = plot.x + (Math.sin(i * 12.3) * 0.5) * plot.width
            const pz = plot.z + (Math.cos(i * 7.9) * 0.5) * plot.depth
            if(this.blocked(px, pz)) continue

            const size = 0.7 + (i % 5) * 0.45
            this.place(
                'rubble', this.boxGeometry, i % 3 === 0 ? MONSTER_COLORS.bone : MONSTER_COLORS.rock,
                new THREE.Vector3(px, GROUND_TOP + size * 0.3, pz),
                new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.sin(i) * 0.5, i * 0.7, Math.cos(i) * 0.5)),
                new THREE.Vector3(size, size * 0.65, size * 1.2),
            )
        }
    }

    /**
     * NHUỘM TRO cho một model mượn từ khu phố.
     *
     * ⚠️ `materials.updateObject()` của bản mẫu GIỮ NGUYÊN texture — rất tiện ở
     * đảo thành phố, nhưng ở đây thì mấy toà nhà "đổ nát" hiện ra TRẮNG TINH
     * như vừa xây xong, hỏng hẳn cái tông hoang tàn. Đo bằng mắt trên ảnh chụp
     * 1/8: dãy nhà sáng hơn cả mặt đất quanh nó.
     *
     * Nhân texture với màu tro (0,42) thay vì bỏ hẳn texture: giữ được đường
     * nét cửa sổ và mảng tường, chỉ tối và ám màu đi. Vật liệu cache theo
     * texture nên 15 toà nhà dùng chung vài cái.
     */
    charModel(root)
    {
        if(!this._charMaterials) this._charMaterials = new Map()

        root.traverse((child) =>
        {
            if(!child.isMesh) return

            const map = child.material?.map ?? null
            const key = map ? (map.uuid ?? 'map') : 'flat'
            let material = this._charMaterials.get(key)

            if(!material)
            {
                /**
                 * ⚠️ `.rgb`, và để `color()` đứng trước trong phép nhân — cả
                 * hai đều để kết quả chắc chắn là vec3.
                 *
                 * `MeshDefaultMaterial` kết thúc bằng `vec4(outputColor, alpha)`,
                 * nên `colorNode` mà là vec4 (texture node trần) thì thành NĂM
                 * thành phần và three kêu "Length of parameters exceeds maximum
                 * length of function vec4()". Đúng cái bẫy đã vấp ở
                 * `Cockpit.paintedDial()`.
                 *
                 * (Đo 1/8: khu này KHÔNG sinh lỗi đó. Năm cảnh báo vec4 thấy
                 * trong console là của các khu CŨ — khu FPTU +3, đảo sân chơi
                 * +1, sân bóng +1 — chứ đảo quái +0.)
                 */
                material = new MeshDefaultMaterial({
                    colorNode: map
                        ? color(MONSTER_COLORS.ash).mul(textureNode(map).rgb)
                        : color(MONSTER_COLORS.groundDark),
                })
                this._charMaterials.set(key, material)
            }

            child.material = material
            child.castShadow = true
            child.receiveShadow = true
        })
    }

    /**
     * Hộp bao CỤC BỘ của một model — nhân chuỗi `matrix` đi ngược lên gốc.
     * Không dùng `Box3.setFromObject()`, xem chú thích ở `setRuins()`.
     */
    localSize(root)
    {
        const box = new THREE.Box3()
        const piece = new THREE.Box3()
        const matrix = new THREE.Matrix4()
        const chain = []

        root.traverse((child) =>
        {
            if(!child.isMesh || !child.geometry) return
            if(!child.geometry.boundingBox) child.geometry.computeBoundingBox()
            if(!child.geometry.boundingBox) return

            chain.length = 0
            let node = child
            while(node && node !== root) { chain.push(node); node = node.parent }
            if(node !== root) return

            matrix.identity()
            for(let i = chain.length - 1; i >= 0; i--)
            {
                chain[i].updateMatrix()
                matrix.multiply(chain[i].matrix)
            }

            piece.copy(child.geometry.boundingBox).applyMatrix4(matrix)
            box.union(piece)
        })

        if(box.isEmpty()) return null

        const size = box.getSize(new THREE.Vector3())
        size.multiply(root.scale)
        return size
    }

    /** Bãi thiên thạch: đá vỡ và mảnh kim loại quanh miệng các hố. */
    setCraterField()
    {
        for(const [ cx, cz, radius ] of CRATERS)
        {
            const count = 12 + Math.round(radius)
            for(let i = 0; i < count; i++)
            {
                const angle = (i / count) * Math.PI * 2 + cx * 0.01
                const distance = radius * (0.95 + (i % 4) * 0.16)
                const px = cx + Math.cos(angle) * distance
                const pz = cz + Math.sin(angle) * distance
                if(this.blocked(px, pz)) continue

                const size = 0.9 + (i % 5) * 0.5
                this.place(
                    'shard', this.coneGeometry, i % 4 === 0 ? MONSTER_COLORS.rust : MONSTER_COLORS.rock,
                    new THREE.Vector3(px, GROUND_TOP + size * 0.35, pz),
                    new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.sin(i * 3.1) * 0.55, angle, Math.cos(i * 2.3) * 0.55)),
                    new THREE.Vector3(size, size * 1.6, size),
                )
            }

            /**
             * Mảnh thiên thạch giữa hố — CÓ VA CHẠM để húc vào thì đụng thật.
             * ⚠️ Chính vì có va chạm nên phải kiểm `blocked()`: một hố nằm đè
             * lòng đường thì cái mảnh này thành vật chặn xe giữa đường.
             */
            if(!this.blocked(cx, cz))
                this.box(radius * 0.34, radius * 0.3, radius * 0.42, cx, this.islandHeight(cx, cz) + radius * 0.12, cz, MONSTER_COLORS.groundDark, {
                    geometry: this.sphereGeometry, physical: true, rotationY: cx * 0.03, rotationZ: 0.2,
                })
        }
    }

    /** Bãi phế liệu: container móp, khung xe, thùng phuy. */
    setScrapyard()
    {
        const plot = MONSTER_PLOTS.scrapyard

        for(let i = 0; i < 16; i++)
        {
            const px = plot.x - plot.width * 0.5 + 8 + (i % 4) * (plot.width - 16) / 3
            const pz = plot.z - plot.depth * 0.5 + 9 + Math.floor(i / 4) * (plot.depth - 18) / 3
            if(this.blocked(px, pz)) continue

            const stacked = i % 5 === 0
            const height = 3.2
            const angle = ((i * 3) % 7 - 3) * 0.16

            this.box(9.5, height, 4.2, px, GROUND_TOP + height * 0.5, pz, i % 3 === 0 ? MONSTER_COLORS.rust : MONSTER_COLORS.steel, {
                physical: true, rotationY: angle, rotationZ: i % 4 === 2 ? 0.06 : 0,
            })

            if(stacked)
                this.box(8.6, height, 3.9, px + 0.7, GROUND_TOP + height * 1.55, pz + 0.4, MONSTER_COLORS.groundDark, {
                    physical: true, rotationY: angle + 0.22,
                })
        }

        // Thùng phuy
        for(let i = 0; i < 24; i++)
        {
            const px = plot.x + Math.sin(i * 5.7) * plot.width * 0.42
            const pz = plot.z + Math.cos(i * 4.3) * plot.depth * 0.42
            if(this.blocked(px, pz)) continue

            const fallen = i % 3 === 0
            this.place(
                'barrel', this.cylinderGeometry, i % 4 === 0 ? MONSTER_COLORS.rust : MONSTER_COLORS.steel,
                new THREE.Vector3(px, GROUND_TOP + (fallen ? 0.55 : 1.1), pz),
                new THREE.Quaternion().setFromEuler(new THREE.Euler(fallen ? Math.PI * 0.5 : 0, i * 0.5, 0)),
                new THREE.Vector3(1.1, 2.2, 1.1),
            )
        }
    }

    /**
     * VÙNG CẤM ĐẶT CẢNH QUAN — lòng đường, cầu, và các ô đất đã chừa.
     *
     * ⚠️ Đây là thứ đứng giữa "đảo trông có hồn" và "xe không đi nổi". Ở khu
     * FPTU đã BỐN LẦN đặt vật chắn ngay giữa lối xe (cột cờ, biển hiệu, cột
     * đèn, hai tường biển ở đầu cầu), lần nào cũng chỉ lái thật mới lộ.
     */
    blocked(x, z)
    {
        if(this.onRoad(x, z)) return true

        // Ô đất đã chừa
        for(const plot of Object.values(MONSTER_PLOTS))
            if(Math.abs(x - plot.x) < plot.width * 0.5 + 3 && Math.abs(z - plot.z) < plot.depth * 0.5 + 3)
                return true

        // Ngoài mép đất
        if(this.shapeDistance(x, z) > 0.94) return true

        return false
    }

    /**
     * CHỈ lòng đường và hành lang cầu — không tính ô đất đã chừa.
     *
     * Tách khỏi `blocked()` vì hai câu hỏi khác nhau:
     *  · `blocked()` — "có được RẢI CẢNH QUAN ở đây không?" (không, cả trên
     *    đường lẫn trong ô đất của công trình khác)
     *  · `onRoad()` — "chỗ này có CHẶN LỐI XE không?" Gai của tổ quái nằm trong
     *    ô đất của chính tổ quái là hoàn toàn đúng; bộ kiểm dùng `blocked()`
     *    cho nó thì báo oan 25 cái gai.
     *
     * Sau này phần Sinh tồn sinh quái cũng nên hỏi hàm này — quái đứng chình
     * ình giữa đường thì người chơi không né được.
     */
    onRoad(x, z)
    {
        const { spine, cross } = MONSTER_ROADS

        if(z >= spine.fromZ - 6 && z <= spine.toZ + 6 && Math.abs(x - spine.x) < spine.halfWidth + 5)
            return true

        for(const road of cross)
            if(x >= road.fromX - 6 && x <= road.toX + 6 && Math.abs(z - road.z) < road.halfWidth + 5)
                return true

        if(Math.abs(x - MONSTER_BRIDGE.x) < MONSTER_BRIDGE.width * 0.5 + 7
            && z >= MONSTER_BRIDGE.fromZ - 10 && z <= MONSTER_BRIDGE.toZ + 14)
            return true

        return false
    }

    /**
     * Cảnh quan rải khắp đảo: rừng cây chết, đá tảng, xương.
     *
     * Tất cả đi qua `place()` nên cuối cùng chỉ còn vài `InstancedMesh` thay vì
     * hàng trăm mesh riêng lẻ — xem chú thích draw call ở đầu file.
     */
    setScenery()
    {
        const half = { x: MONSTER_ISLAND.width * 0.5, z: MONSTER_ISLAND.depth * 0.5 }

        let placed = 0
        for(let i = 0; i < 900 && placed < 340; i++)
        {
            // Lưới giả ngẫu nhiên tất định — không dùng Math.random để dựng thế giới
            const rx = Math.sin(i * 12.9898) * 43758.5453
            const rz = Math.sin(i * 78.233 + 3.7) * 43758.5453
            const px = MONSTER_ISLAND.x + ((rx - Math.floor(rx)) * 2 - 1) * half.x
            const pz = MONSTER_ISLAND.z + ((rz - Math.floor(rz)) * 2 - 1) * half.z

            if(this.blocked(px, pz)) continue

            const y = this.islandHeight(px, pz)
            const kind = i % 5

            if(kind <= 1)
            {
                /**
                 * CÂY CHẾT — thân + vài cành, KHÔNG có tán.
                 * Cố ý không đi qua `Foliage`: hệ lá của bản mẫu là phiến xanh
                 * lay theo gió, đúng cho ba đảo kia nhưng ở đây thì phá tông.
                 */
                const height = 4.5 + (i % 6) * 1.4
                this.place(
                    'deadTrunk', this.cylinderGeometry, MONSTER_COLORS.deadWood,
                    new THREE.Vector3(px, y + height * 0.5, pz),
                    new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.sin(i * 1.1) * 0.09, i * 0.4, Math.cos(i * 1.7) * 0.09)),
                    new THREE.Vector3(0.55 + (i % 3) * 0.14, height, 0.55 + (i % 3) * 0.14),
                )

                const branches = 2 + (i % 3)
                for(let b = 0; b < branches; b++)
                {
                    const angle = (b / branches) * Math.PI * 2 + i
                    const bh = height * (0.55 + b * 0.14)
                    const len = 1.6 + (b % 2) * 1.1
                    const start = new THREE.Vector3(px, y + bh, pz)
                    const end = new THREE.Vector3(
                        px + Math.cos(angle) * len,
                        y + bh + len * 0.55,
                        pz + Math.sin(angle) * len,
                    )

                    /**
                     * ⚠️ Kiểm `blocked()` cho CẢ ĐẦU CÀNH, không chỉ gốc cây.
                     * Cành toả ra tới 2,7 đơn vị, nên một cái cây đứng hợp lệ
                     * sát lề đường vẫn có thể chìa cành vào lòng đường. Bộ kiểm
                     * bắt được 9 cái như thế.
                     */
                    if(this.blocked(end.x, end.z)) continue

                    const direction = new THREE.Vector3().subVectors(end, start)
                    this.place(
                        'deadBranch', this.cylinderGeometry, MONSTER_COLORS.deadWood,
                        start.clone().addScaledVector(direction, 0.5),
                        new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize()),
                        new THREE.Vector3(0.22, direction.length(), 0.22),
                    )
                }
            }
            else if(kind === 2 || kind === 3)
            {
                const size = 1.1 + (i % 6) * 0.62
                this.place(
                    'boulder', this.sphereGeometry, i % 7 === 0 ? MONSTER_COLORS.bone : MONSTER_COLORS.rock,
                    new THREE.Vector3(px, y + size * 0.28, pz),
                    new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.sin(i * 2.2) * 0.4, i * 0.9, Math.cos(i * 1.4) * 0.4)),
                    new THREE.Vector3(size * 1.5, size, size * 1.25),
                )
            }
            else
            {
                // Xương trồi lên khỏi mặt đất
                const size = 0.9 + (i % 4) * 0.4
                this.place(
                    'bone', this.boxGeometry, MONSTER_COLORS.bone,
                    new THREE.Vector3(px, y + size * 0.2, pz),
                    new THREE.Quaternion().setFromEuler(new THREE.Euler(0.35 + Math.sin(i) * 0.3, i * 1.3, Math.cos(i * 3) * 0.4)),
                    new THREE.Vector3(0.28, size * 2.1, 0.28),
                )
            }

            placed++
        }

        this.sceneryCount = placed
    }
}
