import * as THREE from 'three/webgpu'
import { color } from 'three/tsl'
import { Game } from '../Game.js'
import { View } from '../View.js'
import { SURVIVAL_GUN, SURVIVAL_HELI } from '../../data/survival.js'

/**
 * SÚNG MÁY trên nóc xe — vũ khí cơ bản của chế độ Sinh tồn.
 *
 * Giữ **F** (hoặc chuột phải) để bắn liên tục theo con trỏ. Bắn nhiều thì nòng
 * nóng lên; kịch kim là kẹt, phải chờ nguội. Toàn bộ số nằm ở `SURVIVAL_GUN`.
 *
 * ─── ĐẠN TÍNH BẰNG HÌNH HỌC ─────────────────────────────────────────────────
 * Không dựng vật thể đạn: ở nhịp 9 phát/giây thì mắt không đọc đường đạn nữa,
 * chỉ đọc vệt sáng và cái chết ở đầu kia. Mỗi phát chiếu từng con quái lên trục
 * nòng, con nào nằm gần trục nhất trong tầm thì ăn đạn.
 *
 * ─── VÌ SAO NẰM Ở ĐÂY, KHÔNG NẰM TRONG `VehicleRocket` ──────────────────────
 * Khẩu pháo tên lửa là thứ dùng chung với chế độ chơi thường (Cài đặt → Rocket).
 * Súng máy chỉ tồn tại trong Sinh tồn và ăn cả nâng cấp mua bằng tiền — nhét
 * chung vào đó là hai chế độ dính vào nhau.
 */
export class SurvivalGun
{
    constructor(survival)
    {
        this.game = Game.getInstance()
        this.survival = survival

        this.firing = false
        this.heat = 0
        this.jammed = false
        this.cooldown = 0

        this.tracers = []
        this.impacts = []
        this.materials = new Map()

        this.raycaster = new THREE.Raycaster()
        this.groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
        this.ndc = new THREE.Vector2()
        this.aim = new THREE.Vector3()
        this.muzzle = new THREE.Vector3()
        this.direction = new THREE.Vector3()
        this.toMonster = new THREE.Vector3()

        this.group = new THREE.Group()
        this.group.name = 'survivalGun'
        this.game.scene.add(this.group)

        this.tracerGeometry = new THREE.BoxGeometry(1, 1, 1)
        this.flashGeometry = new THREE.SphereGeometry(0.5, 6, 5)

        this.setAction()
        this.setSounds()
    }

    /**
     * Vật liệu tự phát sáng — vệt đạn và chớp nòng phải đọc được trong đêm, mà
     * đêm ở chế độ này tối thật. `toneMapped = false` để bộ ánh xạ tông không
     * kéo chúng về xám như mọi bề mặt khác.
     */
    material(hex)
    {
        let m = this.materials.get(hex)
        if(!m)
        {
            m = new THREE.MeshBasicNodeMaterial()
            m.colorNode = color(hex)
            m.toneMapped = false
            this.materials.set(hex, m)
        }
        return m
    }

    /**
     * Phím bắn đi qua ĐÚNG hệ `inputs.actions` như mọi phím khác — tự nghe
     * `keydown` là hỏng: màn chào chặn phím ở pha bắt, và bắn được trong lúc
     * bảng Cài đặt đang mở thì rất phiền.
     *
     * ⚠️ Dùng **F**, không dùng chuột TRÁI: chuột trái đã là nút ngoái đầu
     * trong cabin (`lookLocked`), chồng lên nhau là mỗi lần bắn lại ngoái đầu.
     */
    setAction()
    {
        this.game.inputs.addActions([
            { name: 'survivalFire', categories: [ 'wandering' ], keys: [ 'Keyboard.KeyF' ] },
        ])

        this.game.inputs.events.on('survivalFire', (action) =>
        {
            this.firing = action.active
        })
    }

    setSounds()
    {
        this.sounds = {}

        const register = (path, volume, fade, antiSpam) => this.game.audio.register({
            path,
            autoplay: false,
            loop: false,
            volume,
            antiSpam,
            positions: new THREE.Vector3(),
            distanceFade: fade,
            onPlay: (item, coordinates) =>
            {
                if(coordinates) item.positions[0].copy(coordinates)
                item.volume = 1
            },
        })

        /**
         * TIẾNG SÚNG THẬT — user tải về, đã cắt còn 0,26–0,39 giây mỗi phát.
         *
         * ⚠️ BA biến thể, phát luân phiên. Một tiếng duy nhất lặp 7 lần/giây
         * nghe ra ngay là băng ghi âm chạy vòng; ba tiếng xen kẽ thì tai không
         * bắt được chu kỳ nữa. Đây là mẹo cũ, `VehicleRocket` cũng dùng cho
         * tiếng nổ.
         *
         * ⚠️ `antiSpam` phải nhỏ (0,05): để mặc định 0,15 thì cứ ba phát mới
         * nghe một tiếng, nghe như súng kẹt.
         *
         * Trước đây phải mượn tiếng va kim loại và user nghe ra đúng cái nó là:
         * *"âm thanh tạch tạch nghe không giống tiếng súng"*.
         */
        this.sounds.shots = [
            register('sounds/survival/gun-shot-1.mp3', 0.3, 30, 0.05),
            register('sounds/survival/gun-shot-2.mp3', 0.3, 30, 0.05),
            register('sounds/survival/gun-shot-3.mp3', 0.26, 30, 0.05),
        ]
        this.shotIndex = 0
        this.sounds.jam = register('sounds/hits/metal/Metal Clip Hit.mp3', 0.4, 20, 0.6)
    }

    /** Một phát — xoay vòng ba biến thể, xem chú thích ở `setSounds()`. */
    playShotSound(at)
    {
        const sound = this.sounds.shots?.[this.shotIndex]
        this.shotIndex = (this.shotIndex + 1) % (this.sounds.shots?.length || 1)
        sound?.play(at)
    }

    /**
     * Điểm đang ngắm. Trả `false` nếu con trỏ chỉ ra ngoài mặt đất.
     *
     * Dùng lại đúng cách của `VehicleRocket.updateAim()`, kể cả luật **trong
     * cabin thì ngắm giữa khung hình**: ở góc nhìn thứ nhất chính con trỏ đã
     * điều khiển hướng NHÌN, để nó điều khiển cả hướng NGẮM nữa thì mỗi lần rê
     * chuột mục tiêu chạy hai lần và ngắm gì cũng trượt.
     */
    updateAim()
    {
        const pointer = this.game.inputs.pointer
        if(!pointer) return false

        if(this.game.view?.mode === View.MODE_COCKPIT)
            this.ndc.set(0, 0)
        else
            this.ndc.set(
                (pointer.current.x / this.game.viewport.width) * 2 - 1,
                -((pointer.current.y / this.game.viewport.height) * 2 - 1),
            )

        this.raycaster.setFromCamera(this.ndc, this.game.view.camera)
        return !!this.raycaster.ray.intersectPlane(this.groundPlane, this.aim)
    }

    /**
     * Một phát. Trả về con quái trúng đạn, hoặc `null`.
     *
     * ⚠️ Chiếu lên trục nòng bằng TÍCH VÔ HƯỚNG rồi mới đo khoảng cách vuông
     * góc — đừng chỉ so khoảng cách tới đường thẳng vô hạn, không thì bắn về
     * phía trước cũng giết được con đứng sau lưng.
     */
    shoot()
    {
        const vehicle = this.game.physicalVehicle
        const monsters = this.survival.monsters.monsters

        // Súng đi theo NGƯỜI BẮN: trên trực thăng, trong tay người đi bộ, hay
        // trên nóc xe — cùng một khẩu, ba chỗ gắn
        const walker = this.survival.walker
        const heli = this.survival.heli
        const shooter = heli?.active ? heli.position
            : (walker?.active ? walker.position : vehicle.position)

        /**
         * Hướng bắn tính từ TÂM người bắn, nhưng nòng đặt LỆCH SANG PHẢI.
         *
         * ⚠️ Đặt nòng ngay giữa trục nhìn là hỏng chế độ cabin: chớp nòng nằm
         * cách mắt chưa tới một mét nên nó nở ra choán gần nửa khung hình và
         * che sạch đường đi — đúng bài học đã trả giá với vô lăng và táp lô
         * (xem `Cockpit.js`: mọi thứ dựng thêm trong cabin đều nằm RẤT gần mắt).
         * Lệch sang một bên thì vừa nhìn ra súng gắn nóc thật, vừa để trống
         * chính giữa cho người lái.
         */
        this.direction.set(
            this.aim.x - shooter.x,
            0,
            this.aim.z - shooter.z,
        )
        const aimDistance = this.direction.length()
        if(aimDistance < 0.001) return null
        this.direction.divideScalar(aimDistance)

        // Người đi bộ cầm súng thấp hơn và sát thân hơn nóc xe; trên trực thăng
        // thì nòng chĩa ra từ bụng máy bay
        const side = heli?.active ? 0.9 : (walker?.active ? SURVIVAL_GUN.walkerMuzzleSide : SURVIVAL_GUN.muzzleSide)
        const height = heli?.active ? -0.9 : (walker?.active ? SURVIVAL_GUN.walkerMuzzleHeight : SURVIVAL_GUN.muzzleHeight)

        this.muzzle.set(
            shooter.x - this.direction.z * side,
            shooter.y + height,
            shooter.z + this.direction.x * side,
        )

        /**
         * ⚠️ NẾU KHẨU PHÁO TRÊN NÓC ĐANG BẬT, ĐẠN PHẢI RA TỪ CHÍNH ĐẦU NÒNG NÓ.
         *
         * User bắt đúng chỗ này: *"đạn phải bay từ khẩu súng trên nóc ra chứ"*.
         * Bản đầu luôn lấy một điểm lệch phải tâm xe, nên khi có khẩu pháo thì
         * đạn phóng ra từ hư không cạnh nó — mắt thấy ngay là sai.
         *
         * `mount.pitch` là khớp ngẩng của bệ pháo, và `VehicleRocket` đã xoay
         * sẵn nó theo con trỏ mỗi khung hình. Lấy vị trí thế giới của nó là ra
         * đúng đầu nòng, tự khớp cả khi pháo đang ngẩng lên hay chúc xuống.
         */
        const rocket = this.game.world?.vehicleRocket
        if(!heli?.active && !walker?.active && rocket?.enabled && rocket.mount?.pitch)
        {
            rocket.mount.pitch.getWorldPosition(this.muzzle)
            // Nhích ra trước một chút cho khỏi lọt trong thân bệ pháo
            this.muzzle.x += this.direction.x * 1.1
            this.muzzle.z += this.direction.z * 1.1
        }

        // Quay người bắn về hướng ngắm — bắn ngang hông trông như lỗi
        if(walker?.active)
            walker.heading = Math.atan2(this.direction.x, this.direction.z)

        let best = null
        let bestAlong = Infinity

        for(const monster of monsters)
        {
            if(monster.dead) continue

            this.toMonster.set(
                monster.root.position.x - this.muzzle.x,
                0,
                monster.root.position.z - this.muzzle.z,
            )

            const along = this.toMonster.dot(this.direction)
            if(along < 0 || along > SURVIVAL_GUN.range) continue

            // Khoảng cách vuông góc tới trục nòng
            const offX = this.toMonster.x - this.direction.x * along
            const offZ = this.toMonster.z - this.direction.z * along
            const off = Math.hypot(offX, offZ)

            // Con to thì dễ trúng hơn — bán kính thân cộng vào vùng trúng
            if(off > SURVIVAL_GUN.hitRadius + monster.spec.radius * monster.scale) continue

            // Con GẦN NHẤT trên đường đạn ăn viên này, không phải con gần trục nhất
            if(along < bestAlong)
            {
                bestAlong = along
                best = monster
            }
        }

        const hitDistance = best ? bestAlong : SURVIVAL_GUN.range
        this.spawnTracer(hitDistance)
        this.playShotSound(this.muzzle)

        if(best)
        {
            // Dấu TRÚNG ĐÍCH ngay tại chỗ viên đạn chạm vào — user bắt đúng
            // chỗ thiếu: *"viên đạn bay trúng không thấy khói bốc lên hay biểu
            // tượng cho trúng mục tiêu cả"*
            this.spawnImpact(
                this.muzzle.x + this.direction.x * bestAlong,
                best.root.position.y + best.spec.hitHeight * best.scale,
                this.muzzle.z + this.direction.z * bestAlong,
            )
            this.survival.monsters.hit(best, this.damage, this.muzzle.x, this.muzzle.z)
        }

        return best
    }

    /**
     * Sát thương mỗi viên: cộng nâng cấp "Nòng súng", và nhân thêm khi bắn từ
     * trực thăng — khẩu trên máy bay là loại khác hẳn, và đó là một phần của
     * thứ người chơi trả 220$ để có.
     */
    get damage()
    {
        const upgraded = SURVIVAL_GUN.damage * (1 + this.survival.level('barrel') * 0.6)
        return this.survival.heli?.active ? upgraded * SURVIVAL_HELI.gunDamageFactor : upgraded
    }

    /** Nhiệt cộng mỗi phát, đã trừ nâng cấp "Tản nhiệt". */
    get heatPerShot()
    {
        const base = SURVIVAL_GUN.heatPerShot / (1 + this.survival.level('cooler') * 0.45)
        return this.survival.heli?.active ? base * SURVIVAL_HELI.gunHeatFactor : base
    }

    /**
     * Vệt đạn: một thanh mảnh nằm dọc đường đạn, sống 0,05 giây.
     *
     * Dựng bằng `scale` + `lookAt` trên một khối hộp có sẵn thay vì tạo hình
     * học mới mỗi phát — chín phát mỗi giây mà cấp phát hình học thì rác dồn
     * lên nhanh hơn bộ dọn rác kịp thu.
     */
    /**
     * ĐẠN VẠCH — một CHUỖI CHẤM SÁNG bay dọc đường đạn, không phải một thanh dài.
     *
     * ⚠️ Bản đầu dựng nguyên một khối hộp dài 11 đơn vị và user gọi đúng tên nó
     * ra: *"cứ bắn là một thanh ngang màu vàng rất xấu"*. Ở máy quay nhìn từ
     * trên xuống, một hình hộp dài nằm ngang chính là một cái gạch — không có
     * gì gợi ra viên đạn.
     *
     * Cách này thì mỗi phát để lại bốn chấm nhỏ nối nhau, chấm càng xa càng mờ
     * và càng bé. Mắt ghép chúng thành một tia lao đi, đúng thứ mọi game bắn
     * súng vẫn làm — mà vẫn rẻ hơn một vật thể đạn thật.
     */
    spawnTracer(distance)
    {
        const drawn = Math.min(distance, SURVIVAL_GUN.tracerMaxLength)
        const dots = []

        for(let i = 0; i < SURVIVAL_GUN.tracerDots; i++)
        {
            const t = (i + 0.6) / SURVIVAL_GUN.tracerDots
            const dot = new THREE.Mesh(this.flashGeometry, this.material(SURVIVAL_GUN.tracerColor))

            // Nhỏ dần về phía xa — đó là thứ tạo cảm giác chiều sâu
            const size = SURVIVAL_GUN.tracerDotSize * (1 - t * 0.55)
            dot.scale.setScalar(size)
            dot.position.set(
                this.muzzle.x + this.direction.x * drawn * t,
                this.muzzle.y,
                this.muzzle.z + this.direction.z * drawn * t,
            )
            dot.castShadow = false
            this.group.add(dot)
            dots.push({ mesh: dot, size })
        }

        // Chớp nòng: to hơn các chấm, tắt nhanh nhất
        const flash = new THREE.Mesh(this.flashGeometry, this.material(SURVIVAL_GUN.muzzleColor))
        flash.scale.setScalar(SURVIVAL_GUN.flashScale)
        flash.position.set(
            this.muzzle.x + this.direction.x * SURVIVAL_GUN.flashDistance,
            this.muzzle.y,
            this.muzzle.z + this.direction.z * SURVIVAL_GUN.flashDistance,
        )
        flash.castShadow = false
        this.group.add(flash)

        this.tracers.push({ dots, flash, age: 0 })
    }

    /**
     * DẤU TRÚNG ĐÍCH — chùm tia lửa bắn ngược lại phía người bắn.
     *
     * ⚠️ Bắn NGƯỢC hướng đạn, không bắn xuôi: tia lửa văng ra từ chỗ va chạm
     * phải đi về phía viên đạn tới, đó là thứ mắt đọc ra "trúng rồi". Văng xuôi
     * theo đường đạn thì trông như đạn xuyên qua và bay tiếp.
     *
     * Dùng lại `flashGeometry` và vật liệu có sẵn — mỗi phát trúng chỉ thêm
     * năm khối nhỏ sống 0,18 giây, ở nhịp 7 phát/giây vẫn rẻ.
     */
    spawnImpact(x, y, z)
    {
        const sparks = []

        for(let i = 0; i < SURVIVAL_GUN.impactSparks; i++)
        {
            const mesh = new THREE.Mesh(this.flashGeometry, this.material(SURVIVAL_GUN.impactColor))
            const size = SURVIVAL_GUN.impactSize * (0.6 + Math.random() * 0.8)
            mesh.scale.setScalar(size)
            mesh.position.set(x, y, z)
            mesh.castShadow = false
            this.group.add(mesh)

            // Nón văng ngược hướng đạn, mở chừng 60°
            const spread = (Math.random() - 0.5) * 1.1
            const speed = 3 + Math.random() * 4
            sparks.push({
                mesh,
                size,
                vx: (-this.direction.x * Math.cos(spread) - this.direction.z * Math.sin(spread)) * speed,
                vy: 1.5 + Math.random() * 3,
                vz: (-this.direction.z * Math.cos(spread) + this.direction.x * Math.sin(spread)) * speed,
            })
        }

        // Một cụm sáng ở tâm va chạm, to hơn và tắt nhanh nhất
        const core = new THREE.Mesh(this.flashGeometry, this.material(SURVIVAL_GUN.muzzleColor))
        core.scale.setScalar(SURVIVAL_GUN.impactSize * 2.2)
        core.position.set(x, y, z)
        core.castShadow = false
        this.group.add(core)

        this.impacts.push({ sparks, core, age: 0 })
    }

    updateImpacts(delta)
    {
        for(let i = this.impacts.length - 1; i >= 0; i--)
        {
            const impact = this.impacts[i]
            impact.age += delta

            if(impact.age >= SURVIVAL_GUN.impactLife)
            {
                for(const s of impact.sparks) this.group.remove(s.mesh)
                this.group.remove(impact.core)
                this.impacts.splice(i, 1)
                continue
            }

            const t = impact.age / SURVIVAL_GUN.impactLife

            impact.core.scale.setScalar(SURVIVAL_GUN.impactSize * 2.2 * (1 - t))

            for(const s of impact.sparks)
            {
                s.vy -= 12 * delta
                s.mesh.position.x += s.vx * delta
                s.mesh.position.y += s.vy * delta
                s.mesh.position.z += s.vz * delta
                s.mesh.scale.setScalar(s.size * (1 - t))
            }
        }
    }

    updateTracers(delta)
    {
        for(let i = this.tracers.length - 1; i >= 0; i--)
        {
            const tracer = this.tracers[i]
            tracer.age += delta

            if(tracer.age >= SURVIVAL_GUN.tracerLife)
            {
                for(const dot of tracer.dots) this.group.remove(dot.mesh)
                this.group.remove(tracer.flash)
                this.tracers.splice(i, 1)
                continue
            }

            // Cả chuỗi chấm lẫn chớp nòng cùng teo dần rồi tắt
            const t = tracer.age / SURVIVAL_GUN.tracerLife
            tracer.flash.scale.setScalar(SURVIVAL_GUN.flashScale * (1 - t))
            for(const dot of tracer.dots)
                dot.mesh.scale.setScalar(dot.size * (1 - t * 0.8))
        }
    }

    /** Dọn sạch — tắt chế độ hoặc thua. */
    clear()
    {
        for(const tracer of this.tracers)
        {
            this.group.remove(tracer.mesh)
            this.group.remove(tracer.flash)
        }
        this.tracers.length = 0

        this.firing = false
        this.heat = 0
        this.jammed = false
        this.cooldown = 0
    }

    update(delta)
    {
        this.updateTracers(delta)
        this.updateImpacts(delta)

        // ── Nguội dần ────────────────────────────────────────────────────────
        if(this.heat > 0)
            this.heat = Math.max(0, this.heat - SURVIVAL_GUN.coolRate * delta)

        if(this.jammed && this.heat <= SURVIVAL_GUN.resumeAt)
            this.jammed = false

        if(this.cooldown > 0) this.cooldown -= delta

        // ── Bắn ──────────────────────────────────────────────────────────────
        // Chỉ bắn khi đang SĂN: bắn trong nhịp nghỉ chỉ tổ làm nóng nòng để rồi
        // vào sóng thì kẹt
        if(!this.firing || this.jammed || this.survival.phase !== 'hunting') return
        if(this.cooldown > 0) return
        if(!this.updateAim()) return

        this.cooldown = 1 / SURVIVAL_GUN.fireRate
        this.heat += this.heatPerShot
        this.shoot()

        if(this.heat >= 1)
        {
            this.heat = 1
            this.jammed = true
            this.sounds.jam?.play(this.muzzle)
        }
    }
}
