import * as THREE from 'three/webgpu'
import { color, texture as textureNode } from 'three/tsl'
import { Game } from '../Game.js'
import { MeshDefaultMaterial } from '../Materials/MeshDefaultMaterial.js'
import {
    CARRIER, CARRIER_RAMP, CARRIER_ISLAND, CARRIER_PLANES, CARRIER_COLORS, CARRIER_MODEL, CARRIER_BOW_RAMP,
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
    /**
     * Bán kính (đơn vị thế giới) mà xe lại gần thì bắt đầu tải `carrier.glb`.
     * Xem giải thích số đo ở `updateModelStreaming()`.
     */
    static MODEL_RADIUS = 120

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

        /**
         * MODEL THẬT LÀM PHẦN NHÌN, KHỐI TỰ DỰNG LÀM PHẦN VA CHẠM.
         *
         * User xem bản dựng-hoàn-toàn-bằng-mã và bác: *"sao tàu xấu quá vậy.
         * Bạn không lấy được tàu mẫu trong file của tôi gửi sao? Lấy 1 ít cũng
         * được hoặc dựa vào đấy chẳng hạn"*. Đúng — và lấy được thật:
         *
         * Model gốc 133 mesh / 2.126.216 đỉnh, trong đó hơn chục mảnh mỗi cái
         * đúng 65.534 đỉnh (trần uint16 — mesh gốc bị chia nhỏ). Bỏ 74 mảnh
         * nặng, giữ 59 mảnh ≤ 3.000 đỉnh: còn **43.288 đỉnh, 1,0 MB**, mà hộp
         * bao vẫn là 83 × 74 × 334 — tức mấy mảnh nhẹ TRẢI KHẮP con tàu chứ
         * không dồn một góc, nên vẫn ra dáng.
         *
         * ⚠️ Nhưng va chạm thì KHÔNG lấy từ model. Mặt boong phải là một khối
         * phẳng liền tuyệt đối để xe chạy; model có vô số chi tiết nhỏ, dựng
         * collider theo nó là đẻ ra hàng trăm mặt nghiêng bẫy xe. Nên: model lo
         * cái nhìn, còn boong + cầu dẫn + hộp va chạm vẫn do mã dựng.
         */
        this.setModel()

        /**
         * ⚠️ Có model thì BỎ HẲN thân tự dựng. Mũi vát tự dựng trải tới
         * z = −85,6, tức chồng lên đúng chỗ cầu dẫn mũi (z −80…−97) và che mất
         * lối lên — thuần hình nên không chặn xe, nhưng nhìn thì tưởng cụt.
         *
         * ⚠️ Từ 04/09/2026 `carrier.glb` NẠP KHI CẦN, nên lúc hàm dựng chạy thì
         * `usingModel` gần như luôn là `false` và hai phần tự dựng dưới đây LUÔN
         * được dựng. Model về sau sẽ gọi `applyModel()` để giấu chúng đi.
         *
         * Mọi mesh của hai phần đó ghi vào `codeOnlyParts` NGAY LÚC DỰNG —
         * `setModel()` chạy trước nên không thể lọc theo thứ tự con của group,
         * và đi dò lại bằng tên/vị trí về sau là mời gọi sai sót.
         */
        this.codeOnlyParts = []

        /**
         * ⚠️ Cờ thu thập phải bật/tắt QUANH ĐÚNG hai lời gọi, không phải bọc cả
         * đoạn dựng.
         *
         * Bản đầu bật trước `setHull()` và chỉ tắt sau `setIsland()` — tức nó
         * gom luôn boong, vạch boong, hai cầu dẫn, khí tài, đèn và máy bay: 35
         * mảnh thay vì 10. `applyModel()` sau đó tắt hết va chạm của chúng, và
         * **cả mặt boong biến mất** — xe hồi sinh lên tàu rơi thẳng xuống biển.
         * Bắn tia đo được: mọi điểm dọc thân tàu từ 3,60 tụt về `null`.
         */
        this.collectCodeOnly = true
        if(!this.usingModel) this.setHull()
        this.collectCodeOnly = false

        this.setDeck()
        this.setDeckMarkings()
        this.setRamp()
        this.setBowRamp()
        this.setEquipment()
        this.setNavLights()
        this.setSoftSprites()

        /**
         * Máy bay dựng bằng mã CHẠY CẢ KHI CÓ MODEL — boong của model trống
         * trơn, không một chiếc nào. Đây đúng là thứ nên bù bằng mã: bảy chiếc
         * xếp cánh gập, mỗi chiếc ~15 mesh nhỏ, rẻ hơn hẳn việc đi tìm model
         * máy bay riêng.
         */
        this.setPlanes()

        // Đảo chỉ huy thì model có sẵn (kèm cột radar) — chỉ dựng khi không model
        this.collectCodeOnly = true
        if(!this.usingModel) this.setIsland()
        this.collectCodeOnly = false

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

        // Đang dựng phần chỉ-dùng-khi-thiếu-model thì ghi lại, để `applyModel()`
        // giấu được đúng những mesh này về sau.
        if(this.collectCodeOnly)
            this.codeOnlyParts.push(mesh)

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
     * Đặt model tàu đã lọc vào đúng chỗ.
     *
     * Model dài 334 đơn vị theo Z; tàu trong game dài 92 ⇒ tỉ lệ **0,275**.
     * Ở tỉ lệ đó bề ngang model (83) ra 22,8 — khớp gần đúng bề ngang 24 mà
     * phần va chạm đang dùng, nên boong hình và boong cứng chồng khít nhau.
     *
     * ⚠️ `materials.updateObject()` GIỮ NGUYÊN texture của glTF, chỉ chuyển
     * sang hệ TSL — nên model tự ăn đúng ánh sáng, sương mù và bóng đổ của
     * game, không phải viết gì thêm. (Đúng như đã thấy với city kit.)
     */
    setModel()
    {
        const source = this.game.resources?.carrierModel?.scene
        this.usingModel = !!source

        if(!source)
        {
            console.warn('[Carrier] không thấy `resources.carrierModel` — dựng hoàn toàn bằng mã')
            return
        }

        const { x, z, deckY } = CARRIER
        const model = source.clone(true)

        model.scale.setScalar(CARRIER_MODEL.scale)
        model.rotation.y = CARRIER_MODEL.rotationY
        model.position.set(x + CARRIER_MODEL.offsetX, deckY + CARRIER_MODEL.offsetY, z + CARRIER_MODEL.offsetZ)
        model.updateMatrix()

        model.traverse((child) =>
        {
            if(!child.isMesh) return
            child.castShadow = true
            child.receiveShadow = true
        })

        this.game.materials.updateObject(model)
        this.group.add(model)
        this.model = model
    }

    /**
     * Thân tàu: khối chính + mũi vát + mớn nước.
     *
     * Thuần HÌNH, không va chạm — mặt duy nhất xe đi được là boong bay. Cho
     * thân va chạm chỉ tổ đẻ ra những mặt nghiêng bẫy xe ở mạn tàu.
     *
     * ⚠️ Khi có model thật thì phần này CHÌM XUỐNG làm nền cho model (model
     * thiếu mấy mảnh nặng nên thân có chỗ hở); chỉ dựng khối tối giản.
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

        /**
         * ⚠️ TÂM KHỐI PHẢI BÙ ĐỘ DÀY, không phải trung điểm hai đầu.
         *
         * Khối dày 0,5 nghiêng góc α thì mặt TRÊN của nó nằm cao hơn tâm
         * `0,25 / cos α` theo phương thẳng đứng. Đặt tâm ở đúng trung điểm là
         * mặt trên vống lên chừng ấy ở CẢ HAI ĐẦU — thành bậc 0,26 ở chân cầu
         * và lệch 0,25 so với mép boong ở đầu kia. Bộ kiểm bắt được cả hai.
         *
         * Xe đi trên MẶT TRÊN, nên phải căn mặt trên chứ không phải tâm khối.
         */
        const centreY = (bridgeY + deckY) * 0.5 - 0.25 / Math.cos(angle)

        // Nghiêng quanh trục Z: khối dài theo X, cao dần khi x tăng
        this.box(length, 0.5, width, (fromX + toX) * 0.5, centreY, z, CARRIER_COLORS.deck, {
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

    /**
     * CẦU DẪN MŨI — từ bờ Bắc đảo chính lên mũi tàu.
     *
     * Cùng nguyên tắc với cầu dẫn kia: MỘT khối nghiêng duy nhất, không ghép
     * đoạn. Đây là lối lên mà user thấy thiếu — nhìn từ bờ là thấy ngay, không
     * phải đi vòng qua cây cầu dài.
     */
    setBowRamp()
    {
        const { x, fromZ, toZ, width } = CARRIER_BOW_RAMP
        const groundY = 0.04
        const deckY = CARRIER.deckY

        const run = Math.abs(toZ - fromZ)
        const rise = deckY - groundY
        const length = Math.hypot(run, rise)
        const angle = Math.atan2(rise, run)

        // Tâm bù độ dày — xem chú thích ở `setRamp()`
        const centreY = (groundY + deckY) * 0.5 - 0.25 / Math.cos(angle)

        // Nghiêng quanh trục X: khối dài theo Z, cao dần khi z giảm
        this.box(width, 0.5, length, x, centreY, (fromZ + toZ) * 0.5, CARRIER_COLORS.deck, {
            rotationX: angle, physical: true, friction: 0.7, castShadow: false,
        })

        // Cột chống — thuần hình
        for(let i = 1; i < 4; i++)
        {
            const t = i / 4
            const pz = fromZ + (toZ - fromZ) * t
            const py = groundY + rise * t
            this.box(0.7, Math.max(0.4, py + 1.6), 0.7, x, (py - 1.6) * 0.5, pz, CARRIER_COLORS.steel, { castShadow: false })
        }

        // Vạch dẫn hướng vàng — nhìn từ bờ là biết đây là lối lên
        for(let i = 0; i < 6; i++)
        {
            const t = (i + 0.5) / 6
            const pz = fromZ + (toZ - fromZ) * t
            const py = groundY + rise * t + 0.3
            this.place(
                'deckLine', this.boxGeometry, CARRIER_COLORS.deckWarn,
                new THREE.Vector3(x, py, pz),
                new THREE.Quaternion().setFromEuler(new THREE.Euler(angle, 0, 0)),
                new THREE.Vector3(width * 0.55, 0.04, 1.6),
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

    /**
     * ĐÈN HÀNG HẢI — đỏ mạn trái, xanh mạn phải, trắng trên cột. Nhấp nháy.
     *
     * Đúng quy tắc đèn tàu thật, và là thứ khiến con tàu "sống" về đêm mà gần
     * như không tốn gì: sáu khối nhỏ tự phát sáng, đổi độ sáng trong `update()`.
     * ⚠️ Cả thế giới chỉ có MỘT nguồn sáng nên KHÔNG thả `PointLight` — thứ
     * phát sáng phải tự phát sáng bằng vật liệu.
     */
    setNavLights()
    {
        const { x, z, length, width, deckY } = CARRIER
        this.navLights = []

        const lamps = [
            { hex: '#ff2d2d', px: x - width * 0.5 - 0.3, pz: z + length * 0.34, phase: 0 },      // mạn trái
            { hex: '#2dff6a', px: x + width * 0.5 + 0.3, pz: z + length * 0.34, phase: 0 },      // mạn phải
            { hex: '#ffffff', px: x + 8.2, pz: z - 14, phase: 1.6, high: 14 },                   // đỉnh tháp
            { hex: '#ffb03c', px: x, pz: z + length * 0.47, phase: 0.8 },                        // mũi
            { hex: '#ffb03c', px: x, pz: z - length * 0.47, phase: 2.4 },                        // đuôi
        ]

        for(const lamp of lamps)
        {
            const mesh = new THREE.Mesh(this.boxGeometry, this.getGlowMaterial(lamp.hex))
            mesh.scale.setScalar(0.55)
            mesh.position.set(lamp.px, deckY + (lamp.high ?? 0.8), lamp.pz)
            mesh.castShadow = false
            mesh.receiveShadow = false
            this.group.add(mesh)
            this.navLights.push({ mesh, phase: lamp.phase, base: 0.55 })
        }
    }

    /**
     * KHÓI từ ống khói và VỆT SÓNG quanh mũi tàu.
     *
     * Cả hai là canvas radial gradient chứ không phải hạt: `colorNode = tex.rgb`,
     * `opacityNode = tex.a`, `transparent`, `depthWrite: false` — đúng khuôn đã
     * dùng cho khói tên lửa. Rẻ, và hợp tông low-poly hơn hệ hạt.
     */
    setSoftSprites()
    {
        const { x, z, length, width, deckY } = CARRIER

        const softTexture = (hex) =>
        {
            const S = 128
            const canvas = document.createElement('canvas')
            canvas.width = canvas.height = S
            const ctx = canvas.getContext('2d')
            const gradient = ctx.createRadialGradient(S * 0.5, S * 0.5, 0, S * 0.5, S * 0.5, S * 0.5)
            gradient.addColorStop(0, hex)
            gradient.addColorStop(0.45, hex + '80')
            gradient.addColorStop(1, hex + '00')
            ctx.fillStyle = gradient
            ctx.fillRect(0, 0, S, S)
            const map = new THREE.CanvasTexture(canvas)
            map.colorSpace = THREE.SRGBColorSpace
            return map
        }

        const softMaterial = (hex) =>
        {
            const map = softTexture(hex)
            return new MeshDefaultMaterial({
                colorNode: textureNode(map).rgb,
                alphaNode: textureNode(map).a,
                transparent: true,
                depthWrite: false,
                alphaTest: 0,
                hasCoreShadows: false,
                hasDropShadows: false,
                hasLightBounce: false,
            })
        }

        // Khói ống khói — ba cụm bay lên, cuộn trong `update()`
        this.smoke = []
        const smokeMaterial = softMaterial('#8a8f96')
        for(let i = 0; i < 6; i++)
        {
            const puff = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), smokeMaterial)
            puff.position.set(x + 6.6, deckY + 9 + i * 2.2, z - 17)
            puff.scale.setScalar(3 + i * 0.9)
            puff.renderOrder = 6
            this.group.add(puff)
            this.smoke.push({ mesh: puff, offset: i * 0.9, baseY: deckY + 9 })
        }

        // Vệt sóng bạc quanh mũi và hai mạn — nằm sát mặt nước
        const foamMaterial = softMaterial('#dff2ff')
        for(const [ px, pz, sx, sz ] of [
            [ x, z + length * 0.5 + 3, 16, 12 ],
            [ x - width * 0.5 - 1.5, z, 7, length * 0.8 ],
            [ x + width * 0.5 + 1.5, z, 7, length * 0.8 ],
            [ x, z - length * 0.5 - 3, 14, 10 ],
        ])
        {
            const foam = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), foamMaterial)
            foam.rotation.x = -Math.PI * 0.5
            foam.position.set(px, -0.24, pz)
            foam.scale.set(sx, sz, 1)
            foam.renderOrder = 3
            this.group.add(foam)
        }
    }

    /**
     * NẠP MODEL KHI XE LẠI GẦN — gọi mỗi khung hình, nên phải rẻ và phải tự
     * chốt để chỉ chạy đúng một lần.
     *
     * ⚠️ Bán kính 120 là số CHỌN TỪ SỐ ĐO, không phải ước lượng. Đo thật
     * 04/09/2026: sương mù che hết ở **68** đơn vị (`fog.far`), còn bờ Bắc đảo
     * chính cách tâm tàu **63,7** — tức con tàu NHÌN THẤY ĐƯỢC từ đảo chính.
     *
     * Chính vì thấy được nên phần tự dựng phải LUÔN có mặt; thứ hoãn lại chỉ là
     * model chi tiết. 120 cho khoảng đệm ~52 đơn vị giữa lúc bắt đầu tải và lúc
     * mắt nhìn ra được — đủ để 2,87 MB về kịp ở tốc độ lái bình thường.
     *
     * ⚠️ Đo bằng bình phương khoảng cách, KHÔNG `Math.hypot`: hàm này chạy 60
     * lần/giây suốt cả phiên chơi chỉ để trả lời một câu hỏi có/không.
     */
    updateModelStreaming()
    {
        if(this.modelRequested)
            return

        const player = this.game.player?.position
        if(!player)
            return

        const dx = player.x - CARRIER.x
        const dz = player.z - CARRIER.z

        if(dx * dx + dz * dz > Carrier.MODEL_RADIUS * Carrier.MODEL_RADIUS)
            return

        this.requestModel()
    }

    /**
     * Xin model. Gọi được từ bất cứ đâu, bao nhiêu lần cũng chỉ tải một lượt —
     * `loadLazy()` nhớ theo promise nên lời gọi thứ hai dùng lại lời hứa cũ.
     *
     * Trả về promise để chỗ nào cần CHỜ (ví dụ hồi sinh thẳng lên tàu) thì chờ
     * được, còn chỗ chỉ muốn kích hoạt thì kệ nó.
     */
    requestModel()
    {
        if(this.modelPromise)
            return this.modelPromise

        this.modelRequested = true

        this.modelPromise = this.game.resourcesLoader
            .loadLazy('carrierModel', `carrier/carrier.glb?cb=1`, 'gltf')
            .then((resource) =>
            {
                if(!resource)
                    return null

                // Cất vào `resources` để `setModel()` tìm thấy như trước đây —
                // nhờ vậy đường dựng model không phải sửa một dòng nào.
                this.game.resources.carrierModel = resource
                this.applyModel()
                return resource
            })

        return this.modelPromise
    }

    /**
     * TRÁO: giấu phần tự dựng, gắn model vào.
     *
     * ⚠️ Ba thứ phải giấu, không phải một:
     *
     *  1. **Mesh thường** của `setHull()` + `setIsland()` — đã gom sẵn trong
     *     `codeOnlyParts`.
     *  2. **Thân vật lý** của mấy khối trong `setIsland()`. Hàm đó có 2 khối
     *     `physical: true`, còn `setHull()` thì không có khối nào. Giấu hình mà
     *     quên tắt va chạm là để lại một cái tháp VÔ HÌNH giữa boong — đúng
     *     kiểu "vật vô hình chặn xe" mà `check-ghost-colliders` sinh ra để bắt.
     *  3. **Cụm instance `carrier:rust`** — 28 vệt gỉ dọc mạn thân tự dựng.
     *     Chúng không nằm trong `codeOnlyParts` vì đi qua `place()` chứ không
     *     qua `box()`. `'rust'` chỉ được tạo trong `setHull()` (đã kiểm: đúng
     *     một chỗ gọi trong cả file), nên giấu cả cụm là an toàn.
     */
    applyModel()
    {
        for(const mesh of this.codeOnlyParts)
        {
            mesh.visible = false
            mesh.userData.object?.physical?.body?.setEnabled(false)
        }

        const rust = this.group.getObjectByName('carrier:rust')
        if(rust)
            rust.visible = false

        this.setModel()
    }

    update()
    {
        this.updateModelStreaming()

        const elapsed = this.game.ticker.elapsedScaled

        // Radar quay chậm — chi tiết động duy nhất của phần tự dựng, và là thứ
        // khiến nó trông "đang hoạt động" chứ không phải mô hình chết
        if(this.radarDish)
            this.radarDish.rotation.y += this.game.ticker.deltaScaled * 0.6

        // Đèn hàng hải nhấp nháy, mỗi cái lệch pha
        if(this.navLights)
            for(const lamp of this.navLights)
            {
                const pulse = 0.55 + 0.45 * Math.sin(elapsed * 2.2 + lamp.phase)
                lamp.mesh.scale.setScalar(lamp.base * (0.7 + pulse * 0.5))
            }

        // Khói bay lên rồi lặp lại, luôn quay mặt về máy quay
        if(this.smoke)
        {
            const camera = this.game.view.camera
            for(const puff of this.smoke)
            {
                const t = ((elapsed * 0.35 + puff.offset) % 5.4)
                puff.mesh.position.y = puff.baseY + t * 2.4
                puff.mesh.scale.setScalar(3 + t * 1.4)
                puff.mesh.quaternion.copy(camera.quaternion)
            }
        }
    }
}
