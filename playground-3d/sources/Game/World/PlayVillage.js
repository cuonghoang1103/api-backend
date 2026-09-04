import * as THREE from 'three/webgpu'
import { color } from 'three/tsl'
import { Game } from '../Game.js'
import { VILLAGE, VILLAGE_COLORS } from '../../data/playisland.js'

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  LÀNG NGÔN NGỮ — khu thứ hai trong ba ô đất chừa sẵn của đảo sân chơi
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Ba góc quây quanh một quảng trường: **Nhật** (torii + vườn đá khô), **Trung**
 * (cổng tam quan + đèn lồng + đình), **Anh** (tháp đồng hồ + bốt điện thoại).
 * Tông xe vào một khối chữ là bật câu hỏi từ vựng.
 *
 * ─── DÙNG CHUNG `VocabQuiz`, KHÔNG DỰNG CÁI THỨ HAI ─────────────────────────
 * `Bricks` đã `new VocabQuiz()` rồi (World.js dựng `bricks` ở dòng 84, trước
 * `playIsland` ở dòng 96). `VocabQuiz` bám vào **một** phần tử DOM `.js-vocab`
 * và tự gắn bộ bắt phím trong `setKeyboard()`. Dựng thêm một thể hiện nữa là
 * hai bộ bắt phím cùng nghe một nút, hai bộ đếm điểm cùng ghi vào một chỗ, và
 * câu trả lời tính hai lần. Nên ở đây MƯỢN lại thể hiện của `Bricks`.
 *
 * ⚠️ Mượn thì phải chịu được lúc KHÔNG có gì để mượn: nếu `Bricks` chưa dựng
 * hoặc tệp từ vựng hỏng thì `ask()` không tồn tại / không làm gì. Khối chữ vẫn
 * phải vỡ bình thường. Cả module này theo đúng nguyên tắc của `VocabQuiz`:
 * hỏng-được-mà-không-kéo-ai-theo.
 *
 * ─── ĐƯỜNG NGANG z = 184 CHẠY XUYÊN Ô ĐẤT ──────────────────────────────────
 * Xem khối chú thích dài ở `data/playisland.js → VILLAGE`. Tóm tắt: lòng đường
 * chiếm z ∈ [179,5 · 188,5] với mọi x ≥ −34, tức hơn nửa phía Đông ô đất. Mọi
 * thứ có `physical: true` ở đây đều phải nằm ngoài dải đó — trừ quảng trường,
 * và quảng trường nằm ở khúc x < −35 nơi đường đã kết thúc.
 */
export class PlayVillage
{
    constructor(island)
    {
        this.game = Game.getInstance()
        this.island = island

        this.letters = []
        this.lanternMeshes = []
        /** Kim phút của tháp đồng hồ — quay theo giờ trong game. */
        this.clockHands = null

        this.setPlaza()
        this.setJapan()
        this.setChina()
        this.setEngland()
        this.setLetters()

        this.game.ticker.events.on('tick', () => this.update())
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  TIỆN ÍCH
    // ═══════════════════════════════════════════════════════════════════════

    /** Vật liệu tự phát sáng — đèn lồng và mặt đồng hồ phải đọc được ban đêm. */
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

    /**
     * Có nằm trong lòng đường không? Dùng để tự chặn lúc dựng, chứ không đợi
     * bộ kiểm bắt — bộ kiểm chỉ nói "có lỗi", còn cái này ngăn lỗi xảy ra.
     */
    onRoad(x, z, margin = 1)
    {
        const road = VILLAGE.road
        return x >= road.fromX - margin && Math.abs(z - road.z) < road.halfWidth + margin
    }

    /**
     * Hộp có va chạm, nhưng TỪ CHỐI dựng nếu rơi vào lòng đường.
     *
     * ⚠️ Cảnh báo ra `console.warn` chứ không ném lỗi: ném ở đây là chết cả
     * sân chơi ở màn hình tải vì một khối trang trí đặt lệch.
     */
    solid(width, height, depth, x, y, z, hex, options = {})
    {
        if(this.onRoad(x, z))
        {
            console.warn(`[Làng] bỏ một khối vì nó nằm trong lòng đường z=184: (${x.toFixed(1)} · ${z.toFixed(1)})`)
            return null
        }

        /**
         * ⚠️ Chốt MÉP NƯỚC, cùng ngưỡng 0,93 mà `PlayIsland.setScenery()` dùng.
         *
         * Góc Tây-Nam của đảo bị siêu-ellipse bậc 4 vát rất mạnh, trong khi
         * `PLOTS.village` là một hình CHỮ NHẬT không biết chuyện đó — đo thật
         * thì góc (−48 · 197) của ô đất nằm hẳn ngoài đảo. Vật rơi xuống nước
         * không báo lỗi gì, nó chỉ chìm rồi bị `Objects.update()` reset.
         */
        if(this.island.shapeDistance(x, z) > 0.93)
        {
            console.warn(`[Làng] bỏ một khối vì quá sát mép nước: (${x.toFixed(1)} · ${z.toFixed(1)})`)
            return null
        }

        return this.island.box(width, height, depth, x, y, z, hex, { physical: true, ...options })
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  DỰNG
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * QUẢNG TRƯỜNG — mặt lát ở đầu Tây của đường ngang.
     *
     * Dùng `slab()` chứ không `box()`: tấm lát phải có va chạm (không thì xe
     * chìm 10–16 phân dưới mặt sân) và phải khai `layer` để không tranh chiều
     * sâu với mặt đảo. Cả hai đều là bài học đã trả giá ở khu FPTU.
     */
    setPlaza()
    {
        const p = VILLAGE.plaza

        this.island.slab(p.width, p.depth, p.x, p.z, VILLAGE_COLORS.plaza, { layer: 0 })

        // Viền quảng trường — layer 1 để nằm TRÊN mặt lát, không cùng cao độ
        const t = 0.6
        for(const [ dx, dz, w, d ] of [
            [ 0, -p.depth * 0.5, p.width, t ],
            [ 0, p.depth * 0.5, p.width, t ],
            [ -p.width * 0.5, 0, t, p.depth ],
            [ p.width * 0.5, 0, t, p.depth ],
        ])
            this.island.slab(w, d, p.x + dx, p.z + dz, VILLAGE_COLORS.plazaTrim, { layer: 1 })

        /**
         * Bốn cột đèn quanh quảng trường.
         *
         * ⚠️ Khoảng lệch để ±3,2 / ±2,2 chứ không phải ±4,4 / ±3,6 như bản đầu:
         * góc TÂY-NAM của quảng trường (−44,4 · 187,6) rơi đúng chỗ đảo vát,
         * và chốt mép nước loại nó ⇒ quảng trường thiếu một góc đèn, lệch hẳn.
         * Thu vào một chút thì cả bốn đều đứng trên đất chắc.
         */
        for(const [ dx, dz ] of [ [ -3.2, -2.2 ], [ 3.2, -2.2 ], [ -3.2, 2.2 ], [ 3.2, 2.2 ] ])
        {
            const x = p.x + dx
            const z = p.z + dz
            this.solid(0.34, 2.6, 0.34, x, this.island.groundTop + 1.3, z, VILLAGE_COLORS.wood, { geometry: this.island.cylinderGeometry })

            const bulb = new THREE.Mesh(this.island.boxGeometry, this.glowMaterial(VILLAGE_COLORS.lantern))
            bulb.scale.set(0.5, 0.6, 0.5)
            bulb.position.set(x, this.island.groundTop + 2.85, z)
            bulb.castShadow = false
            this.island.group.add(bulb)
            this.lanternMeshes.push(bulb)
        }
    }

    /**
     * GÓC NHẬT — torii đứng trên lối vào, sau nó là vườn đá khô.
     *
     * Torii dựng bằng bốn khối: hai cột + thanh ngang trên (kasagi) + thanh
     * ngang dưới (nuki). Hai cột CÓ va chạm, hai thanh ngang thì KHÔNG — chúng
     * ở trên đầu xe, cho va chạm chỉ tổ tạo trần vô hình.
     */
    setJapan()
    {
        const j = VILLAGE.japan
        const top = this.island.groundTop
        const t = j.torii

        // Hai cột — nghiêng nhẹ vào trong như torii thật
        for(const side of [ -1, 1 ])
            this.solid(0.5, t.height, 0.5, t.x + side * t.width * 0.5, top + t.height * 0.5, t.z, VILLAGE_COLORS.toriiRed,
                { geometry: this.island.cylinderGeometry, rotationZ: side * 0.03 })

        // Kasagi — thanh mái trên, cong nhẹ bằng cách xếp ba đoạn
        this.island.box(t.width + 2.2, 0.42, 0.62, t.x, top + t.height + 0.05, t.z, VILLAGE_COLORS.toriiDark, { castShadow: true })
        this.island.box(t.width + 1.5, 0.3, 0.5, t.x, top + t.height - 0.35, t.z, VILLAGE_COLORS.toriiRed)
        // Nuki — thanh ngang dưới
        this.island.box(t.width + 0.7, 0.34, 0.44, t.x, top + t.height * 0.66, t.z, VILLAGE_COLORS.toriiRed)
        // Gakuzuka — thẻ nhỏ giữa hai thanh
        this.island.box(0.5, 0.62, 0.3, t.x, top + t.height * 0.81, t.z, VILLAGE_COLORS.toriiDark)

        // Vườn đá khô: nền sỏi + vệt cào
        const g = j.garden
        this.island.slab(g.width, g.depth, g.x, g.z, VILLAGE_COLORS.gravel, { layer: 0 })
        for(let i = 0; i < 5; i++)
            this.island.slab(g.width - 1, 0.18, g.x, g.z - g.depth * 0.5 + 1 + i * 1.1, VILLAGE_COLORS.stone, { layer: 1 })

        // Năm tảng đá — CÓ va chạm, đây là thứ húc được
        for(const [ x, z, scale ] of j.stones)
            this.solid(scale * 1.4, scale, scale * 1.2, x, top + scale * 0.45, z, VILLAGE_COLORS.stone,
                { rotationY: (x + z) * 0.37 })

        // Hai bụi lá mềm hai bên — đi qua canopy(), KHÔNG đắp hộp xanh làm cây
        this.island.canopy(g.x - g.width * 0.5 - 1.2, top + 1.1, g.z + 1, 1.3)
        this.island.canopy(g.x + g.width * 0.5 + 1.2, top + 1.2, g.z - 1, 1.5)
    }

    /** GÓC TRUNG — cổng tam quan ba lối, đèn lồng, và một cái đình nhỏ. */
    setChina()
    {
        const c = VILLAGE.china
        const top = this.island.groundTop
        const g = c.gate

        // Bốn cột của cổng tam quan (ba lối ⇒ bốn cột)
        for(const dx of [ -g.width * 0.5, -g.width * 0.17, g.width * 0.17, g.width * 0.5 ])
            this.solid(0.44, g.height, 0.44, g.x + dx, top + g.height * 0.5, g.z, VILLAGE_COLORS.gateRed,
                { geometry: this.island.cylinderGeometry })

        // Ba tầng mái xếp chồng, hẹp dần lên trên — dáng đặc trưng của paifang
        for(let i = 0; i < 3; i++)
        {
            const width = g.width + 2.4 - i * 1.3
            const y = top + g.height + 0.25 + i * 0.75
            this.island.box(width, 0.34, 1.0 - i * 0.16, g.x, y, g.z, VILLAGE_COLORS.roof)
            this.island.box(width - 0.5, 0.2, 0.7 - i * 0.1, g.x, y + 0.28, g.z, VILLAGE_COLORS.gateGold)
        }

        // Biển ngạch giữa hai cột trong
        this.island.box(g.width * 0.34, 0.9, 0.24, g.x, top + g.height * 0.78, g.z + 0.16, VILLAGE_COLORS.gateJade)

        // Đèn lồng treo — cột thấp + quả cầu sáng
        for(const [ x, z ] of c.lanterns)
        {
            this.solid(0.28, 2.2, 0.28, x, top + 1.1, z, VILLAGE_COLORS.wood, { geometry: this.island.cylinderGeometry })

            const bulb = new THREE.Mesh(this.island.boxGeometry, this.glowMaterial(VILLAGE_COLORS.lantern))
            bulb.scale.set(0.62, 0.8, 0.62)
            bulb.position.set(x, top + 2.5, z)
            bulb.castShadow = false
            this.island.group.add(bulb)
            this.lanternMeshes.push(bulb)
        }

        // Đình nhỏ: bốn cột + mái, giữa để trống nên lái xe chui qua được
        const p = c.pavilion
        for(const dx of [ -1, 1 ])
            for(const dz of [ -1, 1 ])
                this.solid(0.36, p.height, 0.36, p.x + dx * p.width * 0.5, top + p.height * 0.5, p.z + dz * p.depth * 0.5,
                    VILLAGE_COLORS.gateRed, { geometry: this.island.cylinderGeometry })

        this.island.box(p.width + 1.6, 0.36, p.depth + 1.6, p.x, top + p.height + 0.18, p.z, VILLAGE_COLORS.roof)
        this.island.box(p.width * 0.6, 0.3, p.depth * 0.6, p.x, top + p.height + 0.5, p.z, VILLAGE_COLORS.gateGold)
    }

    /** GÓC ANH — tháp đồng hồ cao nhất làng, bốt điện thoại đỏ, băng ghế. */
    setEngland()
    {
        const e = VILLAGE.england
        const top = this.island.groundTop
        const t = e.tower

        // Thân tháp: ba đốt thu nhỏ dần cho đỡ giống một cây cột
        this.solid(t.side, t.height * 0.62, t.side, t.x, top + t.height * 0.31, t.z, VILLAGE_COLORS.towerStone)
        this.island.box(t.side * 0.94, t.height * 0.2, t.side * 0.94, t.x, top + t.height * 0.72, t.z, VILLAGE_COLORS.towerTrim)

        // Buồng đồng hồ
        const faceY = top + t.height * 0.86
        this.island.box(t.side * 1.1, t.side * 1.05, t.side * 1.1, t.x, faceY, t.z, VILLAGE_COLORS.towerStone)

        /**
         * BỐN MẶT ĐỒNG HỒ + KIM.
         *
         * ⚠️ Kim phải nằm trong một `Group` ĐÃ XOAY sẵn theo hướng mặt, rồi mới
         * quay quanh trục Z CỤC BỘ của group đó. Bản đầu đặt thẳng
         * `hand.rotation.y = ry` rồi mỗi khung hình ghi `hand.rotation.z` — hai
         * phép xoay chồng lên nhau trong cùng một Euler thứ tự XYZ, nên hai mặt
         * quay sang hai bên (±X) có kim quay SAI MẶT PHẲNG: ảnh chụp ra hai
         * vạch ngang nằm im trông như dấu trừ.
         *
         * Tách group ra thì trục Z cục bộ luôn đâm vuông góc mặt đồng hồ, và
         * `rotation.z` trở thành đúng cái nó nên là: góc kim trên mặt số.
         */
        this.clockHands = []
        const faceSize = t.side * 1.1

        for(const [ dx, dz, ry ] of [
            [ 0, 1, 0 ], [ 0, -1, Math.PI ], [ 1, 0, Math.PI * 0.5 ], [ -1, 0, -Math.PI * 0.5 ],
        ])
        {
            const face = new THREE.Mesh(this.island.boxGeometry, this.glowMaterial(VILLAGE_COLORS.clockFace))
            face.scale.set(faceSize * 0.66, faceSize * 0.66, 0.12)
            face.position.set(t.x + dx * faceSize * 0.52, faceY, t.z + dz * faceSize * 0.52)
            face.rotation.y = ry
            face.castShadow = false
            this.island.group.add(face)

            // Viền mặt số cho nó tách khỏi thân tháp
            const rim = new THREE.Mesh(this.island.boxGeometry, this.island.getMaterial(VILLAGE_COLORS.towerTrim))
            rim.scale.set(faceSize * 0.76, faceSize * 0.76, 0.08)
            rim.position.set(t.x + dx * faceSize * 0.5, faceY, t.z + dz * faceSize * 0.5)
            rim.rotation.y = ry
            rim.castShadow = false
            this.island.group.add(rim)

            const pivot = new THREE.Group()
            pivot.position.set(t.x + dx * faceSize * 0.55, faceY, t.z + dz * faceSize * 0.55)
            pivot.rotation.y = ry
            this.island.group.add(pivot)

            // Kim giờ ngắn và dày, kim phút dài và mảnh — lệch nhau mới đọc ra
            // là đồng hồ chứ không phải một cái chong chóng.
            const hour = new THREE.Mesh(this.island.boxGeometry, this.island.getMaterial(VILLAGE_COLORS.towerTrim))
            hour.scale.set(0.16, faceSize * 0.3, 0.06)
            hour.position.y = faceSize * 0.15
            hour.castShadow = false

            const hourPivot = new THREE.Group()
            hourPivot.add(hour)
            pivot.add(hourPivot)

            const minute = new THREE.Mesh(this.island.boxGeometry, this.island.getMaterial(VILLAGE_COLORS.towerTrim))
            minute.scale.set(0.1, faceSize * 0.46, 0.06)
            minute.position.y = faceSize * 0.23
            minute.castShadow = false

            const minutePivot = new THREE.Group()
            minutePivot.add(minute)
            pivot.add(minutePivot)

            this.clockHands.push({ hourPivot, minutePivot })
        }

        // Chóp nhọn
        this.island.box(t.side * 0.8, 1.8, t.side * 0.8, t.x, top + t.height + 0.4, t.z, VILLAGE_COLORS.roof)

        // Bốt điện thoại đỏ
        const b = e.booth
        this.solid(1.2, 2.5, 1.2, b.x, top + 1.25, b.z, VILLAGE_COLORS.boothRed)
        this.island.box(1.34, 0.24, 1.34, b.x, top + 2.6, b.z, VILLAGE_COLORS.boothRed)

        // Băng ghế — thấp, húc được
        const n = e.bench
        this.solid(2.6, 0.28, 0.7, n.x, top + 0.62, n.z, VILLAGE_COLORS.wood)
        for(const dx of [ -1, 1 ])
            this.solid(0.24, 0.5, 0.6, n.x + dx * 1.1, top + 0.25, n.z, VILLAGE_COLORS.letterTrim)

        this.island.canopy(t.x - 5.5, top + 1.4, t.z + 1.5, 1.6)
        this.island.canopy(t.x + 5.5, top + 1.3, t.z - 1, 1.4)
    }

    /**
     * KHỐI CHỮ — tông vào là bật câu hỏi từ vựng.
     *
     * Làm y hệt `Bricks`: thân `dynamic` có `onCollision`, đủ lực thì thu tỉ lệ
     * về 0 và tắt thân vật lý. Khác một điểm: ở đây mỗi khối là một mesh RIÊNG
     * (không phải `InstancedMesh` dùng chung như `Bricks`), vì chỉ có 13 khối —
     * gộp instance cho 13 vật là phức tạp hơn phần thu được.
     */
    setLetters()
    {
        const top = this.island.groundTop

        for(const [ x, z ] of VILLAGE.letters)
        {
            if(this.onRoad(x, z))
            {
                console.warn(`[Làng] bỏ khối chữ nằm trong lòng đường: (${x} · ${z})`)
                continue
            }

            /**
             * ⚠️ Mép NAM ô đất rơi xuống nước. `PLOTS.village` khai depth 26
             * (z 171…197) nhưng đo thật bằng `shapeDistance()` thì z = 197 ra
             * 1,013 — tức NGOÀI hình đảo. Đảo là siêu-ellipse bậc 4 nên càng ra
             * xa tâm theo z thì bề ngang càng hẹp, và ô đất chữ nhật khai trong
             * dữ liệu KHÔNG biết chuyện đó.
             *
             * Ngưỡng 0,93 lấy đúng của `PlayIsland.setScenery()` — chỗ duy nhất
             * trong mã đã trả lời câu hỏi "thế nào là còn đất chắc".
             *
             * Khối rơi xuống nước không báo lỗi gì: nó chìm, `Objects.update()`
             * reset nó, và người chơi chỉ thấy một chỗ trống.
             */
            if(this.island.shapeDistance(x, z) > 0.93)
            {
                console.warn(`[Làng] bỏ khối chữ quá sát mép nước: (${x} · ${z})`)
                continue
            }

            const mesh = new THREE.Mesh(this.island.boxGeometry, this.island.getMaterial(VILLAGE_COLORS.letter))
            mesh.scale.set(1.1, 1.3, 1.1)
            mesh.position.set(x, top + 0.75, z)
            mesh.castShadow = true
            mesh.receiveShadow = true
            this.island.group.add(mesh)

            const entry = { mesh, consumed: false, object: null }

            entry.object = this.game.objects.add(
                { model: mesh, updateMaterials: false, castShadow: false, receiveShadow: false, parent: null },
                {
                    type: 'dynamic',
                    position: { x, y: top + 0.75, z },
                    friction: 0.7,
                    mass: 0.14,
                    sleeping: true,
                    colliders: [ { shape: 'cuboid', parameters: [ 0.55, 0.65, 0.55 ], category: 'object' } ],
                    contactThreshold: 15,
                    onCollision: (force) => this.consume(entry, force),
                },
            )

            this.letters.push(entry)
        }
    }

    /**
     * "Nuốt" một khối chữ rồi hỏi từ vựng.
     *
     * Ngưỡng lực lấy đúng `Bricks.CONSUME_FORCE` (26): dưới ngưỡng thì khối chỉ
     * văng ra, để lăn nhẹ qua không sổ ra một tràng câu hỏi.
     */
    consume(entry, force)
    {
        if(entry.consumed || force < 26)
            return

        entry.consumed = true

        entry.mesh.scale.setScalar(0)
        entry.mesh.updateMatrixWorld(true)
        entry.object?.physical?.body?.setEnabled(false)

        // Mượn `VocabQuiz` của `Bricks`. Không có thì thôi — khối vẫn vỡ.
        this.game.world.bricks?.vocabQuiz?.ask()
    }

    update()
    {
        // Kim đồng hồ quay theo giờ trong game — một vòng mỗi chu kỳ ngày.
        if(!this.clockHands)
            return

        // Một chu kỳ ngày = 12 giờ trên mặt số ⇒ kim giờ đi một vòng, kim phút
        // đi 12 vòng. Quay ÂM để kim chạy thuận chiều kim đồng hồ khi nhìn từ
        // phía trước mặt số (trục Z cục bộ đâm ra phía người xem).
        const progress = this.game.dayCycles?.progress ?? 0

        for(const { hourPivot, minutePivot } of this.clockHands)
        {
            hourPivot.rotation.z = -progress * Math.PI * 2
            minutePivot.rotation.z = -progress * Math.PI * 24
        }
    }
}
