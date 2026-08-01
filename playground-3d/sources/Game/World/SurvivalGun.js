import * as THREE from 'three/webgpu'
import { color } from 'three/tsl'
import { Game } from '../Game.js'
import { View } from '../View.js'
import { SURVIVAL_GUN } from '../../data/survival.js'

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
         * Kho tiếng của bản mẫu không có tiếng súng nào. Tiếng va kim loại sắc
         * gọn là thứ gần nhất — nghe ra "tách tách" chứ không ra "đoàng", nhưng
         * ở nhịp 9 phát/giây thì chuỗi tiếng tách liên tục lại đúng cảm giác
         * súng liên thanh hơn là một tiếng nổ đơn lặp lại.
         *
         * ⚠️ `antiSpam` phải RẤT nhỏ (0,04): để mặc định 0,15 thì cứ ba phát
         * mới nghe một tiếng, nghe như súng kẹt.
         */
        this.sounds.shot = register('sounds/clicks/Source Metal Clicks Delicate Light Sharp Clip Mid 07.mp3', 0.22, 26, 0.04)
        this.sounds.jam = register('sounds/hits/metal/Metal Clip Hit.mp3', 0.4, 20, 0.6)
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

        // Đi bộ thì súng nằm trong tay người, không trên nóc xe
        const walker = this.survival.walker
        const shooter = walker?.active ? walker.position : vehicle.position

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

        // Người đi bộ cầm súng thấp hơn và sát thân hơn nóc xe
        const side = walker?.active ? SURVIVAL_GUN.walkerMuzzleSide : SURVIVAL_GUN.muzzleSide
        const height = walker?.active ? SURVIVAL_GUN.walkerMuzzleHeight : SURVIVAL_GUN.muzzleHeight

        this.muzzle.set(
            shooter.x - this.direction.z * side,
            shooter.y + height,
            shooter.z + this.direction.x * side,
        )

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
        this.sounds.shot?.play(this.muzzle)

        if(best)
            this.survival.monsters.hit(best, this.damage, this.muzzle.x, this.muzzle.z)

        return best
    }

    /** Sát thương mỗi viên, đã cộng nâng cấp "Nòng súng" mua ở cửa hàng. */
    get damage()
    {
        return SURVIVAL_GUN.damage * (1 + this.survival.level('barrel') * 0.6)
    }

    /** Nhiệt cộng mỗi phát, đã trừ nâng cấp "Tản nhiệt". */
    get heatPerShot()
    {
        return SURVIVAL_GUN.heatPerShot / (1 + this.survival.level('cooler') * 0.45)
    }

    /**
     * Vệt đạn: một thanh mảnh nằm dọc đường đạn, sống 0,05 giây.
     *
     * Dựng bằng `scale` + `lookAt` trên một khối hộp có sẵn thay vì tạo hình
     * học mới mỗi phát — chín phát mỗi giây mà cấp phát hình học thì rác dồn
     * lên nhanh hơn bộ dọn rác kịp thu.
     */
    spawnTracer(distance)
    {
        const mesh = new THREE.Mesh(this.tracerGeometry, this.material(SURVIVAL_GUN.tracerColor))

        // Cắt ngắn cho vệt nằm gọn trong khung hình — xem `tracerMaxLength`
        const drawn = Math.min(distance, SURVIVAL_GUN.tracerMaxLength)

        const half = drawn * 0.5
        mesh.position.set(
            this.muzzle.x + this.direction.x * half,
            this.muzzle.y,
            this.muzzle.z + this.direction.z * half,
        )
        mesh.scale.set(SURVIVAL_GUN.tracerWidth, SURVIVAL_GUN.tracerWidth, drawn)
        mesh.lookAt(this.aim.x, this.muzzle.y, this.aim.z)
        mesh.castShadow = false
        this.group.add(mesh)

        const flash = new THREE.Mesh(this.flashGeometry, this.material(SURVIVAL_GUN.muzzleColor))
        flash.scale.setScalar(SURVIVAL_GUN.flashScale)
        flash.position.set(
            this.muzzle.x + this.direction.x * SURVIVAL_GUN.flashDistance,
            this.muzzle.y,
            this.muzzle.z + this.direction.z * SURVIVAL_GUN.flashDistance,
        )
        flash.castShadow = false
        this.group.add(flash)

        this.tracers.push({ mesh, flash, age: 0 })
    }

    updateTracers(delta)
    {
        for(let i = this.tracers.length - 1; i >= 0; i--)
        {
            const tracer = this.tracers[i]
            tracer.age += delta

            if(tracer.age >= SURVIVAL_GUN.tracerLife)
            {
                this.group.remove(tracer.mesh)
                this.group.remove(tracer.flash)
                this.tracers.splice(i, 1)
                continue
            }

            // Tắt dần trong nửa đời sau
            const t = tracer.age / SURVIVAL_GUN.tracerLife
            tracer.flash.scale.setScalar(SURVIVAL_GUN.flashScale * (1 - t))
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
