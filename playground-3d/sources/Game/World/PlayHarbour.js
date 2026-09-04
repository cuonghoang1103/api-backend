import * as THREE from 'three/webgpu'
import { color } from 'three/tsl'
import { Game } from '../Game.js'
import { HARBOUR, HARBOUR_COLORS } from '../../data/playisland.js'

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  BẾN CẢNG + HẢI ĐĂNG — khu thứ ba, ô đất cuối cùng của đảo sân chơi
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Bến lát đá dọc bờ Nam · cầu tàu gỗ trên cọc vươn ra biển · hải đăng đứng ở
 * đầu cầu và QUÉT ĐÈN thật khi trời tối · container xếp chồng để húc · cần cẩu
 * và nhà kho.
 *
 * ─── ĐÂY LÀ KHU DUY NHẤT CỐ Ý DỰNG RA NGOÀI HÌNH ĐẢO ────────────────────────
 * Làng ngôn ngữ có chốt `shapeDistance > 0.93` từ chối mọi thứ đặt ra mép nước,
 * và chốt đó đã bắt được bốn chỗ đặt sai. Nhưng cầu tàu và hải đăng thì PHẢI
 * ra ngoài — đó là ý nghĩa của một cái cảng. Nên ở đây có hai hàm dựng tách
 * bạch: `onLand()` cho thứ phải đứng trên đất, `overWater()` cho thứ được phép
 * ra biển. Không có hàm chung, để không ai vô ý dùng nhầm.
 *
 * ⚠️ Mặt nước ở y = −0,3 (`Water.surfaceElevation`), mặt đất ở 0,04 — chênh
 * đúng 0,34. Sàn cầu tàu nâng lên 0,7 và có cọc chống xuống, không thì nó nằm
 * ngang mặt nước trông như tấm ván trôi.
 *
 * ⚠️ Đèn hải đăng đọc `dayCycles.isNight()`, TUYỆT ĐỐI không đọc
 * `intervalEvents.get('night').inInterval` — cờ đó kiểm trước khi `override`
 * được áp, nên ép trời tối thì cảnh tối mà cờ vẫn báo ban ngày. Cầu vồng đã
 * dẫm đúng bẫy này một lần.
 */
export class PlayHarbour
{
    constructor(island)
    {
        this.game = Game.getInstance()
        this.island = island

        this.containers = []
        this.beam = null
        this.lamp = null
        /** Góc quét hiện tại của đèn hải đăng, radian. */
        this.beamAngle = 0

        this.setQuay()
        this.setJetty()
        this.setLighthouse()
        this.setContainers()
        this.setCrane()
        this.setWarehouse()
        this.setBoats()

        this.game.ticker.events.on('tick', () => this.update())
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  TIỆN ÍCH
    // ═══════════════════════════════════════════════════════════════════════

    glowMaterial(hex)
    {
        this.glowMaterials ??= new Map()
        let material = this.glowMaterials.get(hex)

        if(!material)
        {
            material = new THREE.MeshBasicNodeMaterial()
            material.colorNode = color(hex)
            material.toneMapped = false
            this.glowMaterials.set(hex, material)
        }

        return material
    }

    /** Lòng đường z = 184 — đường KẾT THÚC ở x = 44, nên chỉ chặn phía Tây đó. */
    onRoad(x, z, margin = 1)
    {
        const road = HARBOUR.road
        return x <= road.toX + margin && Math.abs(z - road.z) < road.halfWidth + margin
    }

    /**
     * Vật PHẢI đứng trên đất chắc: bến, container, cần cẩu, nhà kho.
     * Từ chối cả hai kiểu sai — nằm trong lòng đường, và thò ra mép nước.
     */
    onLand(width, height, depth, x, y, z, hex, options = {})
    {
        if(this.onRoad(x, z))
        {
            console.warn(`[Cảng] bỏ một khối vì nằm trong lòng đường z=184: (${x.toFixed(1)} · ${z.toFixed(1)})`)
            return null
        }

        if(this.island.shapeDistance(x, z) > 0.93)
        {
            console.warn(`[Cảng] bỏ một khối vì quá sát mép nước: (${x.toFixed(1)} · ${z.toFixed(1)})`)
            return null
        }

        return this.island.box(width, height, depth, x, y, z, hex, { physical: true, ...options })
    }

    /**
     * Vật ĐƯỢC PHÉP ra biển: sàn cầu tàu, cọc, hải đăng, thuyền.
     *
     * Vẫn chặn lòng đường — ra biển là chuyện khác, đè lên đường vẫn sai.
     */
    overWater(width, height, depth, x, y, z, hex, options = {})
    {
        if(this.onRoad(x, z))
        {
            console.warn(`[Cảng] bỏ một khối trên biển vì nằm trong lòng đường: (${x.toFixed(1)} · ${z.toFixed(1)})`)
            return null
        }

        return this.island.box(width, height, depth, x, y, z, hex, { physical: true, ...options })
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  DỰNG
    // ═══════════════════════════════════════════════════════════════════════

    /** BẾN — dải lát dọc bờ Nam, cộng hàng cọc buộc dây dọc mép. */
    setQuay()
    {
        const q = HARBOUR.quay

        this.island.slab(q.width, q.depth, q.x, q.z, HARBOUR_COLORS.quay, { layer: 0 })

        // Gờ chắn mép Nam — thấp, để xe không lao thẳng xuống biển nhưng vẫn
        // nhảy qua được nếu cố tình. Chừa khoảng giữa cho cầu tàu đi qua.
        const j = HARBOUR.jetty
        const edgeZ = q.z + q.depth * 0.5
        for(const [ fromX, toX ] of [
            [ q.x - q.width * 0.5, j.x - j.width * 0.5 - 0.4 ],
            [ j.x + j.width * 0.5 + 0.4, q.x + q.width * 0.5 ],
        ])
        {
            const width = toX - fromX
            if(width <= 0) continue
            this.onLand(width, 0.5, 0.5, fromX + width * 0.5, this.island.groundTop + 0.25, edgeZ, HARBOUR_COLORS.quayTrim)
        }

        // Cọc buộc dây
        for(const x of HARBOUR.bollards)
            this.onLand(0.5, 0.7, 0.5, x, this.island.groundTop + 0.35, edgeZ - 1.2, HARBOUR_COLORS.bollard,
                { geometry: this.island.cylinderGeometry })
    }

    /**
     * CẦU TÀU — sàn gỗ trên cọc, vươn từ mép bến ra biển.
     *
     * Sàn là MỘT khối liền, không phải nhiều tấm ghép: ghép tấm là có khe, và
     * mỗi khe là một bậc bánh xe không leo nổi — bài học đắt nhất của khu FPTU.
     */
    setJetty()
    {
        const j = HARBOUR.jetty
        const length = j.toZ - j.fromZ
        const centerZ = j.fromZ + length * 0.5

        // Sàn liền khối
        this.overWater(j.width, 0.3, length, j.x, j.deckY, centerZ, HARBOUR_COLORS.deck)

        // Dốc nối từ mặt bến lên sàn — không có thì sàn là một bậc 0,66
        const rampLength = 3
        const rise = j.deckY - this.island.groundTop
        const angle = Math.atan2(rise, rampLength)
        this.overWater(
            j.width, 0.3, rampLength / Math.cos(angle),
            j.x, this.island.groundTop + rise * 0.5, j.fromZ - rampLength * 0.5,
            HARBOUR_COLORS.deck,
            { rotationX: -angle, friction: 1.4 },
        )

        // Cọc chống hai bên, cắm từ sàn xuống dưới mặt nước
        for(let z = j.fromZ + 1; z <= j.toZ - 0.5; z += j.pileSpacing)
            for(const side of [ -1, 1 ])
                this.overWater(0.4, 2.4, 0.4, j.x + side * (j.width * 0.5 - 0.3), j.deckY - 1.2, z,
                    HARBOUR_COLORS.pile, { geometry: this.island.cylinderGeometry })

        // Lan can — chỉ là hình, KHÔNG va chạm: cho va chạm là xe cụng liên tục
        // trên một cây cầu vốn đã hẹp.
        for(const side of [ -1, 1 ])
            this.island.box(0.14, 0.5, length, j.x + side * j.width * 0.5, j.deckY + 0.4, centerZ,
                HARBOUR_COLORS.pile, { castShadow: false })
    }

    /** HẢI ĐĂNG — thân sọc đỏ-trắng, chóp đèn quét vòng khi trời tối. */
    setLighthouse()
    {
        const l = HARBOUR.lighthouse
        const baseY = HARBOUR.jetty.deckY

        // Bệ đá dưới chân
        this.overWater(l.radius * 2.6, 1.2, l.radius * 2.6, l.x, baseY - 0.2, l.z, HARBOUR_COLORS.quayTrim,
            { geometry: this.island.cylinderGeometry })

        // Thân: sáu đốt sọc đỏ-trắng xen kẽ, thu nhỏ dần lên trên
        const segments = 6
        const segmentHeight = l.height / segments
        for(let i = 0; i < segments; i++)
        {
            const t = i / segments
            const diameter = l.radius * 2 * (1 - t * 0.32)
            this.overWater(
                diameter, segmentHeight, diameter,
                l.x, baseY + 0.4 + segmentHeight * (i + 0.5), l.z,
                i % 2 === 0 ? HARBOUR_COLORS.towerWhite : HARBOUR_COLORS.towerRed,
                { geometry: this.island.cylinderGeometry },
            )
        }

        const lampY = baseY + 0.4 + l.height + 0.5
        const lampDiameter = l.radius * 1.5

        // Sàn quanh buồng đèn
        this.overWater(lampDiameter * 1.5, 0.2, lampDiameter * 1.5, l.x, lampY - 0.9, l.z, HARBOUR_COLORS.towerRed,
            { geometry: this.island.cylinderGeometry })

        // Buồng đèn — tự phát sáng nên đọc được cả ban ngày
        this.lamp = new THREE.Mesh(this.island.cylinderGeometry, this.glowMaterial(HARBOUR_COLORS.lampGlow))
        this.lamp.scale.set(lampDiameter, 1.4, lampDiameter)
        this.lamp.position.set(l.x, lampY, l.z)
        this.lamp.castShadow = false
        this.island.group.add(this.lamp)

        // Chóp
        this.island.box(lampDiameter * 1.2, 0.9, lampDiameter * 1.2, l.x, lampY + 1.1, l.z, HARBOUR_COLORS.towerRed,
            { geometry: this.island.cylinderGeometry })

        /**
         * CHÙM SÁNG QUÉT — một khối dài tự phát sáng, xoay quanh buồng đèn.
         *
         * Nó nằm trong một `Group` đặt ĐÚNG tâm buồng đèn, còn khối sáng thì
         * lệch ra trước theo trục Z cục bộ. Nhờ vậy `group.rotation.y` là góc
         * quét thật, không phải một phép xoay quanh gốc toạ độ thế giới.
         *
         * KHÔNG có va chạm — nó là ánh sáng.
         */
        this.beam = new THREE.Group()
        this.beam.position.set(l.x, lampY, l.z)
        this.island.group.add(this.beam)

        /**
         * ⚠️ Chùm sáng phải MỎNG và TRONG.
         *
         * Bản đầu để 1,2 × 0,7 đặc hoàn toàn, dùng chung vật liệu với buồng
         * đèn. Ảnh chụp ban đêm ra một TẤM VÁN VÀNG chắn ngang khung hình —
         * đúng hình dạng đã khai, mà đọc ra thì sai hoàn toàn. Ánh sáng phải
         * nhìn xuyên qua được.
         *
         * Vật liệu dựng RIÊNG chứ không lấy từ `glowMaterial()`: hàm đó nhớ
         * theo mã màu, nên đặt `transparent` ở đây là buồng đèn (cùng màu) hoá
         * trong suốt theo.
         *
         * `depthWrite = false` để chùm sáng không đục lỗ vào depth buffer —
         * không tắt thì thứ nằm sau nó biến mất từng mảng khi nó quét qua.
         */
        const beamLength = 26
        const beamMaterial = new THREE.MeshBasicNodeMaterial()
        beamMaterial.colorNode = color(HARBOUR_COLORS.lampGlow)
        beamMaterial.toneMapped = false
        beamMaterial.transparent = true
        beamMaterial.opacity = 0.34
        beamMaterial.depthWrite = false

        // Ba lát mỏng loe dần ra xa — rẻ hơn dựng hình nón mà vẫn ra cảm giác
        // chùm sáng toả, thay vì một thanh dày đều.
        for(const [ width, height, from, to ] of [
            [ 0.5, 0.34, 0.6, 9 ],
            [ 1.1, 0.5, 9, 18 ],
            [ 1.9, 0.7, 18, beamLength ],
        ])
        {
            const slice = new THREE.Mesh(this.island.boxGeometry, beamMaterial)
            slice.scale.set(width, height, to - from)
            slice.position.z = from + (to - from) * 0.5
            slice.castShadow = false
            this.beam.add(slice)
        }
    }

    /** CONTAINER xếp chồng — thứ để húc. Thân `dynamic` nên đổ được. */
    setContainers()
    {
        const top = this.island.groundTop

        for(const [ x, z, tone ] of HARBOUR.containers)
        {
            if(this.island.shapeDistance(x, z) > 0.93)
            {
                console.warn(`[Cảng] bỏ container quá sát mép nước: (${x} · ${z})`)
                continue
            }

            const hex = tone === 0 ? HARBOUR_COLORS.containerA : HARBOUR_COLORS.containerB
            const mesh = new THREE.Mesh(this.island.boxGeometry, this.island.getMaterial(hex))
            mesh.scale.set(3.2, 2.2, 2.2)
            mesh.position.set(x, top + 1.1, z)
            mesh.castShadow = true
            mesh.receiveShadow = true
            this.island.group.add(mesh)

            const object = this.game.objects.add(
                { model: mesh, updateMaterials: false, castShadow: false, receiveShadow: false, parent: null },
                {
                    type: 'dynamic',
                    position: { x, y: top + 1.1, z },
                    friction: 0.8,
                    mass: 0.9,
                    sleeping: true,
                    colliders: [ { shape: 'cuboid', parameters: [ 1.6, 1.1, 1.1 ], category: 'object' } ],
                },
            )

            this.containers.push({ mesh, object })
        }
    }

    /** CẦN CẨU bến — cột + tay vươn + đối trọng + móc treo. */
    setCrane()
    {
        const c = HARBOUR.crane
        const top = this.island.groundTop

        // Bệ + cột
        this.onLand(2.6, 0.5, 2.6, c.x, top + 0.25, c.z, HARBOUR_COLORS.craneDark)
        this.onLand(1.1, c.height, 1.1, c.x, top + c.height * 0.5, c.z, HARBOUR_COLORS.crane)

        // Tay vươn ra phía biển (+Z) và đối trọng phía sau — chỉ là hình, chúng
        // ở trên cao nên va chạm chỉ tạo trần vô hình
        const armY = top + c.height + 0.4
        this.island.box(0.8, 0.6, c.jib, c.x, armY, c.z + c.jib * 0.35, HARBOUR_COLORS.crane)
        this.island.box(1.4, 1.2, 2.2, c.x, armY, c.z - 2.4, HARBOUR_COLORS.craneDark)

        // Cáp + móc
        const hookZ = c.z + c.jib * 0.7
        this.island.box(0.1, 3.4, 0.1, c.x, armY - 1.9, hookZ, HARBOUR_COLORS.craneDark, { castShadow: false })
        this.island.box(0.7, 0.6, 0.7, c.x, armY - 3.8, hookZ, HARBOUR_COLORS.craneDark)
    }

    /** NHÀ KHO ở dải Bắc — khối đơn giản, mái dốc bằng hai tấm nghiêng. */
    setWarehouse()
    {
        const w = HARBOUR.warehouse
        const top = this.island.groundTop

        this.onLand(w.width, w.height, w.depth, w.x, top + w.height * 0.5, w.z, HARBOUR_COLORS.warehouse)

        // Mái: hai tấm nghiêng gặp nhau ở đỉnh
        const slope = 0.42
        const panel = w.depth * 0.5 / Math.cos(slope)
        for(const side of [ -1, 1 ])
            this.island.box(w.width + 0.8, 0.3, panel, w.x, top + w.height + w.depth * 0.25 * Math.tan(slope) * 0.5,
                w.z + side * w.depth * 0.25, HARBOUR_COLORS.warehouseRoof, { rotationX: side * slope })

        // Cửa cuốn ở mặt Nam, hướng ra bến
        this.island.box(w.width * 0.35, w.height * 0.62, 0.2, w.x, top + w.height * 0.31, w.z + w.depth * 0.5 + 0.1,
            HARBOUR_COLORS.warehouseRoof)
    }

    /** THUYỀN neo hai bên cầu tàu — thân + cabin + cột. Có va chạm, húc được. */
    setBoats()
    {
        const deckY = HARBOUR.jetty.deckY

        for(const [ x, z, facing ] of HARBOUR.boats)
        {
            // Thân: khối dài hơi chìm, mũi nhọn bằng một khối nhỏ xoay 45°
            this.overWater(2.6, 1.1, 6, x, deckY - 0.55, z, HARBOUR_COLORS.boatHull)
            this.overWater(1.9, 1.0, 1.9, x, deckY - 0.55, z + facing * 3.2, HARBOUR_COLORS.boatHull,
                { rotationY: Math.PI * 0.25 })

            // Cabin + cột
            this.overWater(1.8, 1.2, 2.2, x, deckY + 0.6, z - facing * 1.2, HARBOUR_COLORS.boat)
            this.island.box(0.18, 3.4, 0.18, x, deckY + 2.6, z - facing * 1.2, HARBOUR_COLORS.pile, { castShadow: false })
        }
    }

    update()
    {
        if(!this.beam)
            return

        /**
         * Đèn CHỈ quét khi trời tối. Ban ngày tắt hẳn chùm sáng — một vệt vàng
         * quay vòng giữa trưa trông như lỗi chứ không như hải đăng.
         *
         * ⚠️ `isNight()` chứ KHÔNG phải `intervalEvents.get('night').inInterval`
         * — xem khối chú thích đầu file.
         */
        const night = this.game.dayCycles?.isNight?.() ?? false

        this.beam.visible = night

        if(!night)
            return

        this.beamAngle += this.game.ticker.delta * 0.55
        this.beam.rotation.y = this.beamAngle
    }
}
