import * as THREE from 'three/webgpu'
import { color } from 'three/tsl'
import { Game } from '../Game.js'
import { MeshDefaultMaterial } from '../Materials/MeshDefaultMaterial.js'
import { SWAN_LAKE } from '../../data/fptu.js'

/**
 * HỒ THIÊN NGA — đàn thiên nga bơi lượn, biết tránh xe và bị húc thì hoảng
 * chạy.
 *
 * ─── VÌ SAO KHÔNG DÙNG THÂN VẬT LÝ ───
 * Thả mỗi con một rigid body rồi để Rapier lo va chạm nghe thì đúng, nhưng
 * thiên nga nhẹ hều nằm trên mặt nước: xe húc một cái là chúng bay vèo ra khỏi
 * hồ hoặc lộn nhào, xấu hơn hẳn. Nên chúng chỉ là hình, còn hành vi tự viết:
 * mỗi con có hướng bơi riêng, gặp xe thì quay đầu bỏ chạy, và luôn bị kéo về
 * trong lòng hồ. Nhờ vậy đàn chim lúc nào cũng nổi đúng mặt nước và không bao
 * giờ trôi ra ngoài.
 */

const COUNT = 7
const CRUISE_SPEED = 0.55       // tốc độ bơi thong thả
const FLEE_SPEED = 3.4          // tốc độ hoảng chạy
const FLEE_RADIUS = 9           // thấy xe trong bán kính này là bắt đầu né
const PANIC_RADIUS = 3.2        // gần cỡ này coi như bị húc
const TURN_RATE = 2.2           // tốc độ xoay mình (radian/giây)

export class FptuSwans
{
    constructor(campus)
    {
        this.game = Game.getInstance()
        this.campus = campus

        this.group = new THREE.Group()
        this.group.name = 'fptuSwans'
        this.game.scene.add(this.group)

        this.waterY = this.game.water.surfaceElevation
        this.materials = new Map()

        this.setSwans()

        this.game.ticker.events.on('tick', () => this.update())
    }

    material(hex)
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
     * Mỗi con: thân bầu, cổ cong ba đốt, đầu nhỏ, mỏ cam, đuôi vểnh.
     * Toàn bộ gói trong một Group để xoay theo hướng bơi cho gọn.
     */
    setSwans()
    {
        this.swans = []

        const sphere = this.campus.cylinderGeometry
        const box = this.campus.boxGeometry

        for(let i = 0; i < COUNT; i++)
        {
            const group = new THREE.Group()

            const add = (geometry, hex, sx, sy, sz, px, py, pz, rotX = 0) =>
            {
                const mesh = new THREE.Mesh(geometry, this.material(hex))
                mesh.scale.set(sx, sy, sz)
                mesh.position.set(px, py, pz)
                mesh.rotation.x = rotX
                mesh.castShadow = true
                mesh.receiveShadow = true
                group.add(mesh)
                return mesh
            }

            // Thân — hơi chìm dưới nước một chút cho ra dáng nổi
            add(sphere, '#fdfdfa', 1.15, 0.62, 1.75, 0, 0.12, 0)
            // Lườn hai bên cho thân đỡ tròn ung
            add(box, '#f6f6f2', 0.5, 0.34, 1.1, 0.42, 0.2, -0.1, 0)
            add(box, '#f6f6f2', 0.5, 0.34, 1.1, -0.42, 0.2, -0.1, 0)

            // Cổ cong: ba đốt ngả dần về trước
            add(sphere, '#fdfdfa', 0.3, 0.55, 0.3, 0, 0.5, 0.55, 0.32)
            add(sphere, '#fdfdfa', 0.27, 0.5, 0.27, 0, 0.9, 0.74, 0.1)
            add(sphere, '#fdfdfa', 0.26, 0.42, 0.26, 0, 1.22, 0.82, -0.22)

            // Đầu + mỏ cam + mắt
            add(sphere, '#fdfdfa', 0.36, 0.34, 0.42, 0, 1.5, 0.86)
            add(box, '#f0821e', 0.16, 0.12, 0.34, 0, 1.47, 1.12)
            add(box, '#1d1d22', 0.06, 0.06, 0.06, 0.12, 1.56, 1.0)
            add(box, '#1d1d22', 0.06, 0.06, 0.06, -0.12, 1.56, 1.0)

            // Đuôi vểnh
            add(box, '#fdfdfa', 0.5, 0.3, 0.5, 0, 0.32, -0.85, -0.5)

            // Rải đều quanh hồ, mỗi con một hướng
            const angle = (i / COUNT) * Math.PI * 2
            const spread = 0.35 + (i % 3) * 0.18
            const swan = {
                group,
                x: SWAN_LAKE.x + Math.cos(angle) * SWAN_LAKE.radiusX * spread,
                z: SWAN_LAKE.z + Math.sin(angle) * SWAN_LAKE.radiusZ * spread,
                heading: angle + Math.PI * 0.5,
                target: angle + Math.PI * 0.5,
                speed: CRUISE_SPEED,
                bobOffset: i * 1.7,
                wanderTimer: 1 + i * 0.6,
            }

            // Chỗ đứng ban đầu, để `revive()` trả đúng con về đúng nơi
            swan.home = { x: swan.x, z: swan.z, heading: swan.heading }

            group.position.set(swan.x, this.waterY, swan.z)
            this.group.add(group)
            this.swans.push(swan)
        }
    }

    /**
     * GIẾT những con nằm trong bán kính nổ.
     *
     * Chết thì lật ngửa và chìm dần — không xoá ngay, vì biến mất một phát
     * trông như lỗi hình chứ không như bị bắn trúng.
     */
    killAround(x, z, radius)
    {
        let killed = 0

        for(const swan of this.swans)
        {
            if(swan.dead) continue
            if(Math.hypot(swan.x - x, swan.z - z) > radius) continue

            swan.dead = true
            swan.deathAge = 0
            // Bị hất văng ra xa tâm nổ một chút trước khi chìm
            const away = Math.atan2(swan.x - x, swan.z - z)
            swan.deathDriftX = Math.sin(away) * 1.6
            swan.deathDriftZ = Math.cos(away) * 1.6
            killed++
        }

        return killed
    }

    /** Trả cả đàn về nguyên trạng — nút Reset của hệ phá huỷ gọi vào đây. */
    revive()
    {
        for(const swan of this.swans)
        {
            if(!swan.dead) continue

            swan.dead = false
            swan.x = swan.home.x
            swan.z = swan.home.z
            swan.heading = swan.home.heading
            swan.target = swan.home.heading
            swan.speed = CRUISE_SPEED
            swan.group.visible = true
            swan.group.rotation.set(0, swan.heading, 0)
            swan.group.position.set(swan.x, this.waterY, swan.z)
        }
    }

    update()
    {
        this.tickCount = (this.tickCount ?? 0) + 1 // để bộ kiểm đo theo NHỊP GAME
        const delta = Math.min(this.game.ticker.delta, 0.1)
        const elapsed = this.game.ticker.elapsed
        const car = this.game.physicalVehicle?.position

        for(const swan of this.swans)
        {
            /**
             * ── Con đã chết: lật ngửa rồi chìm, KHÔNG chạy tiếp phần AI ─────
             *
             * Bỏ sót nhánh này thì con chết vẫn bơi lượn như thường — chỉ nằm
             * nghiêng, trông hệt một lỗi hình.
             */
            if(swan.dead)
            {
                swan.deathAge += delta

                const sinking = Math.min(1, swan.deathAge / 2.6)
                swan.x += swan.deathDriftX * delta * (1 - sinking)
                swan.z += swan.deathDriftZ * delta * (1 - sinking)

                swan.group.position.set(swan.x, this.waterY - sinking * 1.1, swan.z)
                swan.group.rotation.z = Math.min(Math.PI, sinking * Math.PI * 1.1)
                swan.group.rotation.y = swan.heading + sinking * 1.4

                if(sinking >= 1) swan.group.visible = false
                continue
            }

            // ── Thấy xe thì quay đầu bỏ chạy ────────────────────────────────
            let fleeing = false

            if(car)
            {
                const dx = swan.x - car.x
                const dz = swan.z - car.z
                const distance = Math.hypot(dx, dz)

                if(distance < FLEE_RADIUS)
                {
                    fleeing = true
                    swan.target = Math.atan2(dx, dz)
                    // Càng gần càng cuống; bị húc thì vọt hẳn
                    swan.speed = distance < PANIC_RADIUS ? FLEE_SPEED : FLEE_SPEED * 0.55
                    swan.wanderTimer = 2.5 // hoàn hồn xong mới thong thả lại
                }
            }

            // ── Không có xe thì thong thả đổi hướng ─────────────────────────
            if(!fleeing)
            {
                swan.wanderTimer -= delta
                if(swan.wanderTimer <= 0)
                {
                    swan.target += (Math.sin(elapsed * 1.7 + swan.bobOffset) * 0.9)
                    swan.wanderTimer = 2 + Math.abs(Math.sin(elapsed + swan.bobOffset)) * 3
                }
                swan.speed += (CRUISE_SPEED - swan.speed) * Math.min(1, delta * 1.6)
            }

            // ── Luôn bị kéo về trong lòng hồ ────────────────────────────────
            const nx = (swan.x - SWAN_LAKE.x) / SWAN_LAKE.radiusX
            const nz = (swan.z - SWAN_LAKE.z) / SWAN_LAKE.radiusZ
            const outward = Math.hypot(nx, nz)

            if(outward > 0.78)
            {
                // Quay mũi về tâm hồ, càng sát mép càng gắt
                const toCenter = Math.atan2(SWAN_LAKE.x - swan.x, SWAN_LAKE.z - swan.z)
                const urgency = Math.min(1, (outward - 0.78) / 0.22)
                swan.target = this.blendAngle(swan.target, toCenter, urgency)
            }

            // ── Xoay dần về hướng đích rồi tiến tới ─────────────────────────
            let diff = swan.target - swan.heading
            while(diff > Math.PI) diff -= Math.PI * 2
            while(diff < -Math.PI) diff += Math.PI * 2

            swan.heading += Math.max(-TURN_RATE * delta, Math.min(TURN_RATE * delta, diff))

            swan.x += Math.sin(swan.heading) * swan.speed * delta
            swan.z += Math.cos(swan.heading) * swan.speed * delta

            // Nhấp nhô nhè nhẹ cho ra dáng nổi trên sóng
            const bob = Math.sin(elapsed * 1.6 + swan.bobOffset) * 0.045

            swan.group.position.set(swan.x, this.waterY + bob, swan.z)
            swan.group.rotation.y = swan.heading
            swan.group.rotation.z = Math.sin(elapsed * 1.2 + swan.bobOffset) * 0.05
        }
    }

    /** Pha trộn hai góc theo đường ngắn nhất. */
    blendAngle(from, to, ratio)
    {
        let diff = to - from
        while(diff > Math.PI) diff -= Math.PI * 2
        while(diff < -Math.PI) diff += Math.PI * 2
        return from + diff * ratio
    }
}
