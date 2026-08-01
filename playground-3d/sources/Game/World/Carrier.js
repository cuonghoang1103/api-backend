import * as THREE from 'three/webgpu'
import { color } from 'three/tsl'
import { Game } from '../Game.js'
import { MeshDefaultMaterial } from '../Materials/MeshDefaultMaterial.js'
import {
    CARRIER, CARRIER_RAMP, CARRIER_ISLAND, CARRIER_PLANES, CARRIER_COLORS,
} from '../../data/carrier.js'

/**
 * TÀU SÂN BAY neo giữa biển, cạnh cây cầu đi ra đảo quái vật.
 *
 * Dựng HOÀN TOÀN BẰNG MÃ — xem `data/carrier.js` để biết vì sao không dùng
 * model user tải về (2,1 triệu đỉnh, nén hết cỡ vẫn 954k).
 *
 * Có: thân tàu mũi nhọn, boong bay kẻ vạch, đảo chỉ huy nhiều tầng với radar
 * quay, bảy máy bay đậu (loại gập cánh), thang máy boong, cần cẩu, đèn boong.
 * Lái xe lên được bằng cầu dẫn nối thẳng từ cây cầu chính.
 *
 * ─── BỐN ĐIỀU BẮT BUỘC KHI SỬA FILE NÀY ───
 * 1. **Mặt lái là MỘT khối liền.** Boong bay là một collider duy nhất; cầu dẫn
 *    là một khối nghiêng duy nhất. Ghép nhiều đoạn là có khe, và mỗi khe là
 *    một bậc bánh xe không leo nổi.
 * 2. **Kích thước phải DƯƠNG.** Nửa-cạnh âm làm Rapier trả NaN → vị trí xe NaN
 *    → âm lượng NaN → `setValueAtTime` ném lỗi giữa chuỗi tick → ĐỨNG KHUNG
 *    HÌNH. Đúng lỗi đã mất cả buổi ở đảo quái. `box()` ở đây kêu to nếu gặp.
 * 3. **Lan can, lưới, ăng-ten KHÔNG có va chạm.** Ở khu FPTU đã bốn lần đặt vật
 *    chắn lối xe, lần nào cũng chỉ lái thật mới lộ.
 * 4. **Draw call.** Vạch kẻ và đèn boong lặp lại hàng chục lần ⇒ đi qua
 *    `place()` + `buildInstances()`.
 */

export class Carrier
{
    constructor()
    {
        this.game = Game.getInstance()

        this.group = new THREE.Group()
        this.group.name = 'carrier'
        this.game.scene.add(this.group)

        this.boxGeometry = new THREE.BoxGeometry(1, 1, 1)
        this.cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 10)
        this.coneGeometry = new THREE.ConeGeometry(0.5, 1, 4)
        this.materials = new Map()
        this.instanceBatches = new Map()

        this.setHull()
        this.setDeck()
        this.setDeckMarkings()
        this.setRamp()
        this.setIsland()
        this.setPlanes()
        this.setEquipment()

        this.buildInstances()

        this.tickCallback = () => this.update()
        this.game.ticker.events.on('tick', this.tickCallback, 12)
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

    /** Vật liệu tự phát sáng cho đèn boong — cả thế giới chỉ có MỘT nguồn sáng. */
    getGlowMaterial(hex)
    {
        const key = `glow:${hex}`
        let material = this.materials.get(key)

        if(!material)
        {
            material = new MeshDefaultMaterial({
                colorNode: color(hex).mul(2.4),
                hasCoreShadows: false,
                hasDropShadows: false,
                hasLightBounce: false,
            })
            this.materials.set(key, material)
        }

        return material
    }

    box(width, height, depth, x, y, z, hex, { rotationX = 0, rotationY = 0, rotationZ = 0, physical = false, geometry = null, castShadow = true, receiveShadow = true, material = null, friction = null } = {})
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
            // ⚠️ Quaternion từ CẢ BA trục Euler — khối nghiêng mà chỉ lấy Y thì
            // hình một đằng va chạm một nẻo
            const quaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(rotationX, rotationY, rotationZ, 'YZX'))

            /**
             * ⚠️ Nửa-cạnh ÂM là thứ đã làm đứng khung hình cả game ở đảo quái:
             * Rapier trả NaN cho mọi va chạm với nó, NaN chạy tới `Audio` và
             * `setValueAtTime` ném lỗi giữa chuỗi tick. Lấy trị tuyệt đối cho
             * game vẫn chạy, nhưng KÊU TO — im lặng sửa hộ là lần sau lại mất
             * một buổi đi tìm.
             */
            if(!(width > 0) || !(height > 0) || !(depth > 0))
                console.warn(`[Carrier] kích thước va chạm không hợp lệ tại (${x} · ${y} · ${z}): ${width} × ${height} × ${depth}`)

            const description = {
                type: 'fixed',
                position: { x, y, z },
                rotation: { x: quaternion.x, y: quaternion.y, z: quaternion.z, w: quaternion.w },
                colliders: [ { shape: 'cuboid', parameters: [ Math.abs(width) * 0.5, Math.abs(height) * 0.5, Math.abs(depth) * 0.5 ] } ]
            }
            if(friction !== null) description.friction = friction

            mesh.userData.object = this.game.objects.add(null, description)
        }

        return mesh
    }

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

    buildInstances()
    {
        for(const [ kind, batch ] of this.instanceBatches)
        {
            if(!batch.matrices.length) continue

            const mesh = new THREE.InstancedMesh(batch.geometry, this.getMaterial(batch.hex), batch.matrices.length)
            mesh.name = `carrier:${kind}`
            for(let i = 0; i < batch.matrices.length; i++)
                mesh.setMatrixAt(i, batch.matrices[i])
            mesh.instanceMatrix.needsUpdate = true
            mesh.castShadow = kind !== 'deckLine'
            mesh.receiveShadow = true
            this.group.add(mesh)
        }
    }

    /**
     * Thân tàu: khối chính + mũi vát + mớn nước.
     *
     * Thuần HÌNH, không va chạm — mặt duy nhất xe đi được là boong bay. Cho
     * thân va chạm chỉ tổ đẻ ra những mặt nghiêng bẫy xe ở mạn tàu.
     */
    setHull()
    {
        const { x, z, length, width, deckY, hullDepth } = CARRIER

        // Khối thân chính, thu hẹp dần xuống dưới
        const tiers = [
            { w: width, l: length, y: deckY - 0.9, h: 1.6, hex: CARRIER_COLORS.hull },
            { w: width - 3.4, l: length - 5, y: deckY - 2.6, h: 2.2, hex: CARRIER_COLORS.hull },
            { w: width - 7.5, l: length - 12, y: deckY - 4.4, h: 2.0, hex: CARRIER_COLORS.hullDark },
        ]
        for(const tier of tiers)
            this.box(tier.w, tier.h, tier.l, x, tier.y, z, tier.hex)

        // Mũi tàu vát nhọn về phía +Z
        for(let i = 0; i < 5; i++)
        {
            const t = i / 5
            const w = width * (1 - t * 0.82)
            const segZ = z + length * 0.5 + i * 2.1
            this.box(w, 1.6 + i * 0.1, 2.2, x, deckY - 0.9 - i * 0.12, segZ, CARRIER_COLORS.hull)
        }

        // Đuôi vuông, có bệ đỡ
        this.box(width - 1.5, 2.4, 3.5, x, deckY - 2.1, z - length * 0.5 - 1.4, CARRIER_COLORS.hullDark)

        // Vệt gỉ chảy dọc mạn
        for(let i = 0; i < 14; i++)
        {
            const segZ = z - length * 0.42 + i * (length * 0.84) / 13
            for(const side of [ -1, 1 ])
                this.place(
                    'rust', this.boxGeometry, CARRIER_COLORS.rust,
                    new THREE.Vector3(x + side * (width * 0.5 + 0.06), deckY - 1.7 - (i % 3) * 0.3, segZ),
                    new THREE.Quaternion(),
                    new THREE.Vector3(0.12, 1.6 + (i % 4) * 0.7, 0.5 + (i % 3) * 0.4),
                )
        }
    }

    /**
     * BOONG BAY — mặt duy nhất xe chạy được.
     *
     * ⚠️ MỘT collider liền cho cả mặt boong. Chia nhỏ ra là có khe ở mối nối.
     */
    setDeck()
    {
        const { x, z, length, width, deckY } = CARRIER

        this.box(width, 0.5, length, x, deckY - 0.25, z, CARRIER_COLORS.deck, {
            physical: true, friction: 0.6, castShadow: false,
        })

        // Phần boong nhô ra mạn trái (angled deck) — chỗ cầu dẫn cập vào
        this.box(6, 0.5, 26, x - width * 0.5 - 2.6, deckY - 0.25, z, CARRIER_COLORS.deck, {
            physical: true, friction: 0.6, castShadow: false,
        })

        /**
         * Gờ chắn quanh mép boong — THẤP (0,35) và KHÔNG va chạm.
         * Cao hơn hoặc cho va chạm là thành cái bẫy kẹp xe ở mép, đúng kiểu lỗi
         * "hai tường biển chừa khe 2 đơn vị trong khi xe rộng 1,9" ở khu FPTU.
         */
        for(const side of [ -1, 1 ])
            this.box(0.3, 0.35, length * 0.98, x + side * (width * 0.5 - 0.15), deckY + 0.17, z, CARRIER_COLORS.deckWarn, { castShadow: false })
    }

    /** Vạch kẻ đường băng, số hiệu, vòng tròn hạ cánh — tất cả instanced. */
    setDeckMarkings()
    {
        const { x, z, length, deckY } = CARRIER
        const y = deckY + 0.03

        const line = (w, l, px, pz, hex, rotY = 0) =>
            this.place(
                'deckLine', this.boxGeometry, hex,
                new THREE.Vector3(px, y, pz),
                new THREE.Quaternion().setFromEuler(new THREE.Euler(0, rotY, 0)),
                new THREE.Vector3(w, 0.04, l),
            )

        // Tim đường băng — vạch đứt chạy dọc
        for(let i = 0; i < 18; i++)
        {
            const pz = z - length * 0.44 + i * (length * 0.88) / 17
            line(0.8, 3.2, x - 1.5, pz, CARRIER_COLORS.deckLine)
        }

        // Hai vạch biên đường băng
        for(const side of [ -1, 1 ])
            line(0.45, length * 0.9, x - 1.5 + side * 5.2, z, CARRIER_COLORS.deckLine)

        // Vạch cảnh báo vàng ở đuôi (khu vực nguy hiểm)
        for(let i = 0; i < 9; i++)
            line(1.6, 1.1, x - 7 + i * 1.8, z - length * 0.47, CARRIER_COLORS.deckWarn, 0.6)

        // Vòng tròn khu đỗ trực thăng ở mạn phải
        for(let i = 0; i < 16; i++)
        {
            const angle = (i / 16) * Math.PI * 2
            line(1.2, 0.4, x + 6.5 + Math.cos(angle) * 4.2, z + length * 0.28 + Math.sin(angle) * 4.2, CARRIER_COLORS.deckLine, angle)
        }

        // Số hiệu tàu ở mũi — ghép từ vạch, đọc được từ trên cao
        const digits = [
            [ [ 0, 0, 0.5, 3 ], [ 1.6, 0, 0.5, 3 ], [ 0.8, 1.5, 1.6, 0.5 ], [ 0.8, -1.5, 1.6, 0.5 ] ],   // 0
            [ [ 0.8, 0, 0.5, 3 ] ],                                                                        // 1
        ]
        const numberZ = z + length * 0.4
        digits.forEach((digit, index) =>
        {
            for(const [ dx, dz, w, l ] of digit)
                line(w, l, x - 2.6 + index * 3.4 + dx, numberZ + dz, CARRIER_COLORS.deckLine)
        })
    }

    /**
     * CẦU DẪN từ cây cầu chính lên boong — MỘT khối nghiêng duy nhất.
     *
     * ⚠️ Đừng chia thành nhiều đoạn cho "mượt hơn": dốc ghép từ nhiều hộp bao
     * giờ cũng hở, và mỗi khe là một bậc bánh xe không leo nổi. Đây là bài học
     * đắt nhất của khu FPTU, lặp lại ở mọi khu sau.
     */
    setRamp()
    {
        const { fromX, toX, z, width } = CARRIER_RAMP
        const bridgeY = 0.04 - 0.2          // mặt cây cầu chính (GROUND_TOP − 0.2)
        const deckY = CARRIER.deckY

        const run = Math.abs(toX - fromX)
        const rise = deckY - bridgeY
        const length = Math.hypot(run, rise)
        const angle = Math.atan2(rise, run)

        // Nghiêng quanh trục Z: khối dài theo X, cao dần khi x tăng
        this.box(length, 0.5, width, (fromX + toX) * 0.5, (bridgeY + deckY) * 0.5, z, CARRIER_COLORS.deck, {
            rotationZ: angle, physical: true, friction: 0.7, castShadow: false,
        })

        // Cột chống dưới cầu dẫn — thuần hình
        for(let i = 1; i < 5; i++)
        {
            const t = i / 5
            const px = fromX + (toX - fromX) * t
            const py = bridgeY + rise * t
            this.box(0.7, Math.max(0.4, py + 1.6), 0.7, px, (py - 1.6) * 0.5, z, CARRIER_COLORS.steel, { castShadow: false })
        }

        // Vạch dẫn hướng trên mặt cầu dẫn
        for(let i = 0; i < 7; i++)
        {
            const t = (i + 0.5) / 7
            const px = fromX + (toX - fromX) * t
            const py = bridgeY + rise * t + 0.3
            this.place(
                'deckLine', this.boxGeometry, CARRIER_COLORS.deckWarn,
                new THREE.Vector3(px, py, z),
                new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, angle)),
                new THREE.Vector3(1.8, 0.04, 0.6),
            )
        }
    }

    /** Đảo chỉ huy: tháp nhiều tầng, buồng kính, ống khói, cột radar. */
    setIsland()
    {
        const { x, z, deckY } = CARRIER
        const { offsetX, offsetZ, width, length, height } = CARRIER_ISLAND
        const px = x + offsetX
        const pz = z + offsetZ

        // Thân tháp giật cấp
        const tiers = [
            { w: width, l: length, h: height * 0.42, hex: CARRIER_COLORS.tower },
            { w: width * 0.86, l: length * 0.8, h: height * 0.3, hex: CARRIER_COLORS.towerDark },
            { w: width * 0.66, l: length * 0.58, h: height * 0.2, hex: CARRIER_COLORS.tower },
        ]
        let y = deckY
        for(const tier of tiers)
        {
            this.box(tier.w, tier.h, tier.l, px, y + tier.h * 0.5, pz, tier.hex, { physical: true })
            y += tier.h
        }

        // Buồng chỉ huy — dải kính chạy quanh tầng hai
        const glassY = deckY + height * 0.42 + height * 0.15
        for(const side of [ -1, 1 ])
            this.box(0.2, height * 0.12, length * 0.7, px + side * width * 0.44, glassY, pz, CARRIER_COLORS.glass, { castShadow: false })
        this.box(width * 0.8, height * 0.12, 0.2, px, glassY, pz + length * 0.4, CARRIER_COLORS.glass, { castShadow: false })

        // Hai ống khói
        for(const side of [ -1, 1 ])
            this.box(1.5, 3.4, 1.5, px + side * 1.6, y + 1.7, pz - length * 0.22, CARRIER_COLORS.towerDark)

        // Cột radar — quay trong `update()`
        this.radarMast = new THREE.Group()
        this.radarMast.position.set(px, y + 0.6, pz + length * 0.18)
        this.group.add(this.radarMast)

        // Dựng thẳng bằng `THREE.Mesh` chứ không qua `box()`: `box()` add vào
        // `this.group`, mà cột này phải là con của `radarMast` để quay theo
        const mast = new THREE.Mesh(this.boxGeometry, this.getMaterial(CARRIER_COLORS.steel))
        mast.scale.set(0.4, 5.5, 0.4)
        mast.position.set(0, 2.75, 0)
        mast.castShadow = false
        this.radarMast.add(mast)

        this.radarDish = new THREE.Group()
        this.radarDish.position.set(0, 5.4, 0)
        this.radarMast.add(this.radarDish)

        const dish = new THREE.Mesh(this.boxGeometry, this.getMaterial(CARRIER_COLORS.steel))
        dish.scale.set(4.6, 0.18, 0.9)
        dish.rotation.z = 0.25
        dish.castShadow = false
        this.radarDish.add(dish)

        // Ăng-ten râu — thuần hình, không va chạm
        for(let i = 0; i < 4; i++)
        {
            const antenna = new THREE.Mesh(this.cylinderGeometry, this.getMaterial(CARRIER_COLORS.steel))
            antenna.scale.set(0.12, 2.2 + i * 0.6, 0.12)
            antenna.position.set(px + (i - 1.5) * 1.1, y + 1.1 + i * 0.3, pz - length * 0.38)
            antenna.rotation.z = (i - 1.5) * 0.07
            antenna.castShadow = false
            this.group.add(antenna)
        }
    }

    /** Máy bay đậu — dựng bằng khối, loại xếp cánh gập như trên tàu thật. */
    setPlanes()
    {
        const { x, z, deckY } = CARRIER

        for(const [ dx, dz, angle, folded ] of CARRIER_PLANES)
        {
            const group = new THREE.Group()
            group.position.set(x + dx, deckY + 0.05, z + dz)
            group.rotation.y = angle
            this.group.add(group)

            const part = (w, h, d, px, py, pz, hex, rotY = 0, rotZ = 0, geometry = null) =>
            {
                const mesh = new THREE.Mesh(geometry ?? this.boxGeometry, this.getMaterial(hex))
                mesh.scale.set(w, h, d)
                mesh.position.set(px, py, pz)
                mesh.rotation.y = rotY
                mesh.rotation.z = rotZ
                mesh.castShadow = true
                mesh.receiveShadow = true
                group.add(mesh)
                return mesh
            }

            // Thân
            part(1.5, 1.1, 8.2, 0, 0.85, 0, CARRIER_COLORS.plane)
            // Mũi nhọn
            part(1.1, 0.8, 2.2, 0, 0.9, 5, CARRIER_COLORS.planeDark)
            // Buồng lái
            part(1.1, 0.62, 2.1, 0, 1.5, 1.9, CARRIER_COLORS.canopy)

            // Cánh — gập dựng lên khi đậu chật
            for(const side of [ -1, 1 ])
            {
                if(folded)
                {
                    part(0.32, 3.4, 2.6, side * 0.85, 2.3, -0.4, CARRIER_COLORS.plane, 0, side * 0.16)
                    part(2.0, 0.22, 2.4, side * 1.3, 0.85, -0.4, CARRIER_COLORS.plane)
                }
                else
                {
                    part(4.6, 0.22, 2.6, side * 2.9, 0.85, -0.4, CARRIER_COLORS.plane, 0, side * 0.04)
                }
            }

            // Đuôi đứng + cánh đuôi
            for(const side of [ -1, 1 ])
                part(0.22, 2.0, 1.8, side * 0.55, 1.9, -3.4, CARRIER_COLORS.planeDark, 0, side * 0.2)
            part(3.2, 0.2, 1.4, 0, 0.95, -3.6, CARRIER_COLORS.plane)

            // Bánh
            for(const [ wx, wz ] of [ [ 0, 3.1 ], [ -1.0, -1.4 ], [ 1.0, -1.4 ] ])
                part(0.45, 0.45, 0.45, wx, 0.2, wz, CARRIER_COLORS.planeDark, 0, 0, this.cylinderGeometry)

            /**
             * Va chạm bằng MỘT hộp bao quanh thân — húc vào thì đụng thật, mà
             * không đẻ ra chục mặt nghiêng bẫy xe như cho từng mảnh một collider.
             */
            const quaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, angle, 0))
            this.game.objects.add(null, {
                type: 'fixed',
                position: { x: x + dx, y: deckY + 1.0, z: z + dz },
                rotation: { x: quaternion.x, y: quaternion.y, z: quaternion.z, w: quaternion.w },
                colliders: [ { shape: 'cuboid', parameters: [ folded ? 1.4 : 3.4, 1.0, 4.4 ] } ]
            })
        }
    }

    /** Thang máy boong, cần cẩu, đèn mép boong. */
    setEquipment()
    {
        const { x, z, length, width, deckY } = CARRIER

        // Hai thang máy ở mạn phải — chỉ là mảng boong màu khác, KHÔNG va chạm
        // riêng (đã nằm trên mặt boong liền)
        for(const dz of [ 20, -6 ])
            this.box(7, 0.12, 9, x + width * 0.5 + 3, deckY + 0.02, z + dz, CARRIER_COLORS.hull, { castShadow: false, physical: false })

        // Cần cẩu ở đuôi
        const craneX = x - width * 0.5 + 2.5
        const craneZ = z - length * 0.42
        this.box(1.2, 6, 1.2, craneX, deckY + 3, craneZ, CARRIER_COLORS.steel)
        this.box(7.5, 0.5, 0.7, craneX + 3, deckY + 5.8, craneZ, CARRIER_COLORS.steel, { rotationZ: -0.12, castShadow: false })
        this.box(0.14, 2.6, 0.14, craneX + 6.4, deckY + 4.4, craneZ, CARRIER_COLORS.steel, { castShadow: false })

        // Đèn mép boong — tự phát sáng, thấy rõ khi ép ban đêm
        for(let i = 0; i < 24; i++)
        {
            const pz = z - length * 0.46 + i * (length * 0.92) / 23
            for(const side of [ -1, 1 ])
            {
                const lamp = new THREE.Mesh(this.boxGeometry, this.getGlowMaterial(CARRIER_COLORS.light))
                lamp.scale.set(0.22, 0.14, 0.5)
                lamp.position.set(x + side * (width * 0.5 - 0.4), deckY + 0.12, pz)
                lamp.castShadow = false
                lamp.receiveShadow = false
                this.group.add(lamp)
            }
        }

        // Trụ neo dọc mạn — thuần hình
        for(let i = 0; i < 10; i++)
        {
            const pz = z - length * 0.4 + i * (length * 0.8) / 9
            for(const side of [ -1, 1 ])
                this.place(
                    'bollard', this.cylinderGeometry, CARRIER_COLORS.steel,
                    new THREE.Vector3(x + side * (width * 0.5 + 0.5), deckY - 0.5, pz),
                    new THREE.Quaternion(),
                    new THREE.Vector3(0.5, 0.9, 0.5),
                )
        }
    }

    update()
    {
        // Radar quay chậm — chi tiết động duy nhất của cả con tàu, và là thứ
        // khiến nó trông "đang hoạt động" chứ không phải mô hình chết
        if(this.radarDish)
            this.radarDish.rotation.y += this.game.ticker.deltaScaled * 0.6
    }
}
