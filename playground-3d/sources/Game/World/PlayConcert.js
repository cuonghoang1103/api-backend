import * as THREE from 'three/webgpu'
import { color } from 'three/tsl'
import { Howler } from 'howler'
import { Game } from '../Game.js'
import { CONCERT, CONCERT_COLORS } from '../../data/playisland.js'

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  SÂN KHẤU NHẠC HỘI — khu thứ nhất trong ba khu chừa sẵn của đảo sân chơi
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Sân khấu ở mép Bắc, sàn nhảy 9 × 7 ô ở giữa, khán đài ôm hai bên, và **năm
 * bục đĩa than** xếp cung tròn — lái xe lên một bục là đổi sang bài tương ứng
 * trong danh sách nhạc của game.
 *
 * ─── SÀN NHẢY NHẤP THEO NHẠC THẬT ───────────────────────────────────────────
 * Không phải nhấp theo đồng hồ. Một `AnalyserNode` cắm vào `Howler.masterGain`
 * đọc phổ tần số của chính bản nhạc đang phát; ô sàn nâng lên theo **dải trầm**
 * (kick/bass — thứ tai nghe ra là "nhịp"), còn màu thì theo dải cao.
 *
 * ⚠️ `Howler.ctx` CHỈ tồn tại sau khi người chơi bấm Play ở màn chào (trình
 * duyệt chặn âm thanh tự phát). Nên phép cắm này phải **thử lại mỗi khung hình
 * cho tới khi được** — cắm một lần trong hàm dựng là im lìm vĩnh viễn, và không
 * có lỗi nào để thấy.
 *
 * ⚠️ Nối `masterGain → analyser` là NHÁNH SONG SONG. Analyser KHÔNG nối tiếp ra
 * `destination`, nên không nhân đôi tiếng. Nối `analyser → destination` là nghe
 * to gấp đôi.
 */
export class PlayConcert
{
    constructor(island)
    {
        this.game = Game.getInstance()
        this.island = island

        this.tiles = []
        this.decks = []
        this.beams = []
        this.analyser = null
        this.frequencies = null
        /** Mức trầm đã làm mượt — dùng cho chiều cao ô sàn. */
        this.bass = 0
        /** Mức cao đã làm mượt — dùng cho độ sáng đèn. */
        this.treble = 0
        /** Bục nào đang sáng (bài nào đang chạy). */
        this.activeDeck = 0
        /** Bục vừa chạm, để không đổi bài liên tục khi xe đứng trên nó. */
        this.lastDeck = -1

        this.setStage()
        this.setDanceFloor()
        this.setSpeakers()
        this.setRig()
        this.setStands()
        this.setDecks()
        this.setScenery()

        this.game.ticker.events.on('tick', () => this.update())
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  DỰNG
    // ═══════════════════════════════════════════════════════════════════════

    /** Vật liệu tự phát sáng — đèn và viền bục phải đọc được cả khi trời tối. */
    glowMaterial(hex)
    {
        this.glowMaterials ??= new Map()
        let m = this.glowMaterials.get(hex)
        if(!m)
        {
            m = new THREE.MeshBasicNodeMaterial()
            m.colorNode = color(hex)
            m.toneMapped = false
            this.glowMaterials.set(hex, m)
        }
        return m
    }

    /** Bục sân khấu + phông nền + mái che. */
    setStage()
    {
        const s = CONCERT.stage
        const top = this.island.groundTop

        // Bục: khối đặc, CÓ va chạm — lái xe lên được, và đó là một nửa cái vui
        this.island.box(s.width, s.height, s.depth, s.x, top + s.height * 0.5, s.z, CONCERT_COLORS.stage, { physical: true })

        // Dốc lên bục ở mặt trước, để xe bò lên chứ không phải húc vào một bức tường
        const rampDepth = 4.5
        const angle = Math.atan2(s.height, rampDepth)
        this.island.box(
            s.width * 0.55, 0.4, rampDepth / Math.cos(angle),
            s.x, top + s.height * 0.5 - 0.1, s.z + s.depth * 0.5 + rampDepth * 0.5,
            CONCERT_COLORS.stageTrim,
            { rotationX: -angle, physical: true, friction: 1.4 },
        )

        // Phông nền dựng đứng phía sau
        this.island.box(s.width, 7, 0.6, s.x, top + 3.5, s.z - s.depth * 0.5, CONCERT_COLORS.stage, { physical: true })
        // Vệt sáng trang trí trên phông
        for(let i = 0; i < 5; i++)
        {
            const mesh = new THREE.Mesh(this.island.boxGeometry, this.glowMaterial(CONCERT_COLORS.beams[i]))
            mesh.scale.set(0.5, 5.4, 0.14)
            mesh.position.set(s.x - 8 + i * 4, top + 3.6, s.z - s.depth * 0.5 + 0.35)
            mesh.castShadow = false
            this.island.group.add(mesh)
        }

        // Viền mép bục cho nổi khối
        this.island.box(s.width + 0.5, 0.22, s.depth + 0.5, s.x, top + s.height + 0.02, s.z, CONCERT_COLORS.stageTrim, { castShadow: false })
    }

    /**
     * SÀN NHẢY — lưới ô vuông, mỗi ô một khối dẹt nhấp lên theo nhạc.
     *
     * ⚠️ Ô sàn KHÔNG có va chạm. Cho chúng va chạm là lái xe qua giật cục như
     * đi trên bậc thang, và khi chúng nhấp lên thì xe bị hất tung — vui đúng
     * một lần rồi thành phiền. Mặt đất phẳng vẫn ở dưới, xe chạy trên đó.
     */
    setDanceFloor()
    {
        const f = CONCERT.floor
        const top = this.island.groundTop
        const step = f.tile + f.gap

        const originX = f.x - (f.cols - 1) * step * 0.5
        const originZ = f.z - (f.rows - 1) * step * 0.5

        for(let col = 0; col < f.cols; col++)
        {
            for(let row = 0; row < f.rows; row++)
            {
                const x = originX + col * step
                const z = originZ + row * step

                const mesh = new THREE.Mesh(
                    this.island.boxGeometry,
                    this.island.getMaterial((col + row) % 2 === 0 ? CONCERT_COLORS.floorA : CONCERT_COLORS.floorB),
                )
                mesh.scale.set(f.tile, 0.18, f.tile)
                mesh.position.set(x, top + 0.09, z)
                mesh.receiveShadow = true
                mesh.castShadow = false
                this.island.group.add(mesh)

                /**
                 * Pha theo KHOẢNG CÁCH TỚI TÂM sàn — nhịp lan ra thành sóng
                 * tròn từ giữa. Pha ngẫu nhiên thì ra nhiễu, pha theo hàng thì
                 * ra sóng thẳng trông như máy dệt.
                 */
                const distance = Math.hypot(x - f.x, z - f.z)

                this.tiles.push({ mesh, baseY: top + 0.09, phase: distance * 0.45 })
            }
        }
    }

    /** Hai cột loa hai bên sân khấu, mỗi cột bốn màng loa. */
    setSpeakers()
    {
        const sp = CONCERT.speakers
        const top = this.island.groundTop

        for(const side of [ -1, 1 ])
        {
            const x = CONCERT.x + side * sp.offsetX

            this.island.box(sp.width, sp.height, sp.depth, x, top + sp.height * 0.5, sp.z, CONCERT_COLORS.speaker, { physical: true })

            for(let i = 0; i < 4; i++)
            {
                const cone = new THREE.Mesh(this.island.cylinderGeometry, this.island.getMaterial(CONCERT_COLORS.speakerCone))
                cone.scale.set(sp.width * 0.62, 0.16, sp.width * 0.62)
                cone.rotation.x = Math.PI * 0.5
                cone.position.set(x, top + 1.2 + i * 1.5, sp.z + sp.depth * 0.5 + 0.1)
                cone.castShadow = false
                this.island.group.add(cone)
            }
        }
    }

    /** Giàn đèn: dàn ngang trên hai cột, sáu chùm sáng quét theo nhạc. */
    setRig()
    {
        const r = CONCERT.rig
        const top = this.island.groundTop
        const halfSpan = r.span * 0.5

        // Hai cột đứng
        for(const side of [ -1, 1 ])
            this.island.box(0.5, r.height, 0.5, CONCERT.x + side * halfSpan, top + r.height * 0.5, r.z, CONCERT_COLORS.truss, { physical: true })

        // Dàn ngang
        this.island.box(r.span, 0.5, 0.5, CONCERT.x, top + r.height, r.z, CONCERT_COLORS.truss)

        /**
         * Chùm sáng dựng bằng HÌNH NÓN LỘN NGƯỢC, đỉnh ở bóng đèn.
         *
         * Không dùng đèn thật: cả cảnh này chạy trên MỘT nguồn sáng duy nhất
         * (`Lighting.count = 1`) — thêm sáu nguồn nữa là phải viết lại toàn bộ
         * hệ vật liệu TSL. Một hình nón trong suốt màu rực thì mắt đọc ra ngay
         * là "chùm đèn", mà không đụng gì tới ánh sáng.
         */
        for(let i = 0; i < r.lights; i++)
        {
            const x = CONCERT.x - halfSpan + (i + 0.5) * (r.span / r.lights)
            const hex = CONCERT_COLORS.beams[i % CONCERT_COLORS.beams.length]

            // Bóng đèn
            const bulb = new THREE.Mesh(this.island.boxGeometry, this.glowMaterial(hex))
            bulb.scale.set(0.5, 0.4, 0.5)
            bulb.position.set(x, top + r.height - 0.45, r.z)
            bulb.castShadow = false
            this.island.group.add(bulb)

            // Chùm sáng
            const material = new THREE.MeshBasicNodeMaterial()
            material.colorNode = color(hex)
            material.transparent = true
            material.opacity = 0.16
            material.depthWrite = false
            material.toneMapped = false

            const beam = new THREE.Mesh(new THREE.ConeGeometry(1, 1, 10, 1, true), material)
            beam.scale.set(2.6, r.height - 0.6, 2.6)
            beam.position.set(x, top + (r.height - 0.6) * 0.5, r.z + 3)
            beam.castShadow = false
            beam.renderOrder = 4
            this.island.group.add(beam)

            this.beams.push({ mesh: beam, bulb, material, baseX: x, index: i })
        }
    }

    /** Khán đài ba bậc, ôm hai bên sàn nhảy. */
    setStands()
    {
        const st = CONCERT.stands
        const top = this.island.groundTop

        for(const side of [ -1, 1 ])
        {
            const x0 = CONCERT.x + side * st.offsetX

            for(let row = 0; row < st.rows; row++)
            {
                const x = x0 + side * row * 1.5
                const y = top + 0.45 + row * 0.75

                this.island.box(1.5, 0.75 + row * 0.75, st.length, x, y * 0.5 + top * 0.5, st.z, CONCERT_COLORS.stand, { physical: true })
                // Dãy ghế trên mỗi bậc
                this.island.box(1.1, 0.16, st.length - 1, x, y + 0.1, st.z, CONCERT_COLORS.standSeat, { castShadow: false })
            }
        }
    }

    /**
     * NĂM BỤC ĐĨA THAN — lái xe lên một bục là đổi sang bài tương ứng.
     *
     * Xếp cung tròn ở nửa Nam của sàn (hướng về sân khấu), chừa hẳn lối giữa để
     * xe còn chạy vào được.
     */
    setDecks()
    {
        const d = CONCERT.decks
        const top = this.island.groundTop

        for(let i = 0; i < d.count; i++)
        {
            // Cung 160° mở về phía Nam
            const angle = Math.PI * 0.5 + (i / (d.count - 1) - 0.5) * Math.PI * 0.9
            const x = d.x + Math.cos(angle) * d.radius
            const z = d.z + Math.sin(angle) * d.radius

            const hex = CONCERT_COLORS.beams[i % CONCERT_COLORS.beams.length]

            /**
             * Bục THẤP và KHÔNG va chạm: 0,55 đơn vị mà cho va chạm thì xe leo
             * lên chỉ để mắc kẹt trên đó. Cảm giác "lái lên bục" đến từ chỗ
             * chạm được ghi nhận, không từ chỗ bánh xe thật sự nhấc lên.
             */
            this.island.box(d.size, d.height, d.size, x, top + d.height * 0.5, z, CONCERT_COLORS.deck, { castShadow: false })

            // Viền phát sáng — cũng là thứ báo bục nào đang chạy
            const rim = new THREE.Mesh(this.island.boxGeometry, this.glowMaterial(hex))
            rim.scale.set(d.size + 0.3, 0.12, d.size + 0.3)
            rim.position.set(x, top + d.height + 0.03, z)
            rim.castShadow = false
            this.island.group.add(rim)

            // Đĩa than trên mặt bục
            const disc = new THREE.Mesh(this.island.cylinderGeometry, this.island.getMaterial('#15121f'))
            disc.scale.set(d.size * 0.72, 0.08, d.size * 0.72)
            disc.position.set(x, top + d.height + 0.1, z)
            disc.castShadow = false
            this.island.group.add(disc)

            this.decks.push({ x, z, rim, disc, index: i, hex })
        }
    }

    /** Vài cụm cây quanh mép khu, để nó không mọc lên giữa bãi đất trọc. */
    setScenery()
    {
        const spots = [
            [ CONCERT.x - 18, CONCERT.z + 14 ],
            [ CONCERT.x + 18, CONCERT.z + 14 ],
            [ CONCERT.x - 17, CONCERT.z - 8 ],
            [ CONCERT.x + 17, CONCERT.z - 8 ],
        ]

        for(const [ x, z ] of spots)
            this.island.canopy(x, this.island.groundTop + 2.6, z, 2.2)
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  NGHE NHẠC THẬT
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Cắm `AnalyserNode` vào `Howler.masterGain`.
     *
     * ⚠️ Gọi lại mỗi khung hình cho tới khi được: `Howler.ctx` chỉ tồn tại sau
     * khi người chơi bấm Play ở màn chào (trình duyệt chặn âm thanh tự phát).
     * Thử một lần trong hàm dựng là sàn nhảy đứng im vĩnh viễn — và không có
     * một dòng lỗi nào để lần ra.
     */
    ensureAnalyser()
    {
        if(this.analyser) return true

        const context = Howler.ctx
        const master = Howler.masterGain
        if(!context || !master) return false

        try
        {
            const analyser = context.createAnalyser()
            analyser.fftSize = 256
            analyser.smoothingTimeConstant = 0.72

            // NHÁNH SONG SONG — KHÔNG nối analyser ra `destination`, nối là
            // nghe to gấp đôi
            master.connect(analyser)

            this.analyser = analyser
            this.frequencies = new Uint8Array(analyser.frequencyBinCount)
            return true
        }
        catch(error)
        {
            // Trình duyệt nào đó chặn — sàn vẫn nhấp theo đồng hồ, xem `update()`
            this.analyserFailed = true
            return false
        }
    }

    /**
     * Đọc phổ, tách hai dải:
     *  - **trầm** (bin 1–8, chừng 40–350 Hz) → kick và bass, tức "nhịp"
     *  - **cao**  (bin 30–70) → hi-hat và tiếng lanh, dùng cho độ sáng đèn
     *
     * Không có nhạc (tắt tiếng, hoặc chưa bấm Play) thì rơi về một nhịp giả
     * chạy theo đồng hồ — sàn nhảy đứng chết trông như khu bỏ hoang.
     */
    readMusic(delta)
    {
        const elapsed = this.game.ticker.elapsed

        if(!this.ensureAnalyser())
        {
            const fake = (Math.sin(elapsed * 3.4) * 0.5 + 0.5) * 0.35
            this.bass += (fake - this.bass) * Math.min(1, delta * 6)
            this.treble = this.bass * 0.6
            return
        }

        this.analyser.getByteFrequencyData(this.frequencies)

        let low = 0
        for(let i = 1; i <= 8; i++) low += this.frequencies[i]
        low /= 8 * 255

        let high = 0
        for(let i = 30; i <= 70; i++) high += this.frequencies[i]
        high /= 41 * 255

        // Lên NHANH, xuống CHẬM — đó là thứ biến một con số thành "cú đập"
        this.bass += (low - this.bass) * Math.min(1, delta * (low > this.bass ? 22 : 7))
        this.treble += (high - this.treble) * Math.min(1, delta * 12)

        // Không có nhạc thật (im lặng hoàn toàn) thì vẫn nhấp nhẹ cho có sự sống
        if(low < 0.01 && high < 0.01)
        {
            const fake = (Math.sin(elapsed * 3.4) * 0.5 + 0.5) * 0.28
            this.bass += (fake - this.bass) * Math.min(1, delta * 5)
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  MỖI KHUNG HÌNH
    // ═══════════════════════════════════════════════════════════════════════

    update()
    {
        const delta = Math.min(this.game.ticker.delta, 0.1)
        const elapsed = this.game.ticker.elapsed

        this.readMusic(delta)
        this.updateFloor(elapsed)
        this.updateBeams(elapsed)
        this.updateDecks()
    }

    updateFloor(elapsed)
    {
        const lift = 0.15 + this.bass * 1.5

        for(const tile of this.tiles)
        {
            // Sóng tròn lan từ tâm sàn ra, biên độ theo dải trầm
            const wave = Math.sin(elapsed * 4.5 - tile.phase) * 0.5 + 0.5
            tile.mesh.position.y = tile.baseY + wave * lift
            tile.mesh.scale.y = 0.18 + wave * this.bass * 0.5
        }
    }

    updateBeams(elapsed)
    {
        for(const beam of this.beams)
        {
            // Quét qua lại, mỗi chùm lệch pha một chút
            const sweep = Math.sin(elapsed * 0.9 + beam.index * 0.7)
            beam.mesh.rotation.z = sweep * 0.34
            beam.mesh.position.x = beam.baseX + sweep * 2.2

            // Sáng theo dải cao
            beam.material.opacity = 0.08 + this.treble * 0.5
            beam.bulb.visible = this.treble > 0.03 || Math.sin(elapsed * 8 + beam.index) > 0
        }
    }

    /**
     * Lái xe lên một bục → đổi bài.
     *
     * ⚠️ Nhớ bục VỪA CHẠM (`lastDeck`): không có nó thì đứng yên trên bục là
     * `playlist.play()` gọi lại mỗi khung hình — nhạc kêu tạch tạch rồi im.
     * Rời khỏi mọi bục thì mới xoá nhớ, nên lái ra rồi vào lại là đổi được tiếp.
     */
    updateDecks()
    {
        const vehicle = this.game.physicalVehicle
        if(!vehicle) return

        const playlist = this.game.audio?.playlist
        let touching = -1

        for(const deck of this.decks)
        {
            const distance = Math.hypot(vehicle.position.x - deck.x, vehicle.position.z - deck.z)
            if(distance < CONCERT.decks.size * 0.9)
            {
                touching = deck.index
                break
            }
        }

        if(touching >= 0 && touching !== this.lastDeck)
        {
            this.lastDeck = touching
            this.activeDeck = touching

            if(playlist?.hasSongs)
            {
                /**
                 * ⚠️ `playlist.goTo(index)` là hàm ĐÚNG. `playlist.play()` không
                 * nhận tham số (nó phát lại bài hiện tại), còn `next()` /
                 * `previous()` thì nhảy tương đối — bục số 3 mà gọi `next()` là
                 * ra bài nào tuỳ lúc đó đang ở đâu.
                 */
                playlist.goTo(touching % playlist.songs.length)
            }
        }
        else if(touching < 0)
        {
            this.lastDeck = -1
        }

        // Viền bục đang chạy thì sáng hẳn, còn lại mờ đi
        for(const deck of this.decks)
        {
            const active = deck.index === this.activeDeck
            deck.rim.scale.y = active ? 0.12 + this.bass * 0.5 : 0.06
            deck.disc.rotation.y += (active ? 3.5 : 0.4) * this.game.ticker.delta
        }
    }
}
