import * as THREE from 'three/webgpu'
import { color } from 'three/tsl'
import { Game } from '../Game.js'
import { MeshDefaultMaterial } from '../Materials/MeshDefaultMaterial.js'
import { COLORS, PINE_HILL, STATUE } from '../../data/fptu.js'

/**
 * ĐỒI THÔNG trước toà Delta, trên đỉnh đặt tượng SELF MADE MAN.
 *
 * Trời tuyết thì rừng thông phủ trắng và mấy người tuyết hiện ra; trời thường
 * thì thông xanh, người tuyết biến mất. Trạng thái đọc từ `weather.snow.value`
 * — cùng đại lượng mà `Snow.js` và `Rainbow.js` đang dùng, nên đồi đổi cùng
 * nhịp với cả thế giới chứ không lệch pha.
 *
 * ─── ĐỒI PHẢI LEO ĐƯỢC ───
 * Sườn đồi dựng bằng nhiều ĐĨA CHỒNG nhỏ dần. Mỗi tầng chỉ cao 0,55 nên xe bò
 * lên tới đỉnh được — bậc cao hơn là bánh không bám, y như bài học ở bờ hồ.
 */

const TIERS = 10          // số tầng đĩa xếp thành đồi
const PINE_COUNT = 22     // số cây thông
const SNOW_ON = 0.12      // trên ngưỡng này coi là "trời tuyết"

export class FptuPineHill
{
    constructor(campus)
    {
        this.game = Game.getInstance()
        this.campus = campus

        this.group = new THREE.Group()
        this.group.name = 'fptuPineHill'
        this.game.scene.add(this.group)

        this.snowy = null // chưa xác định, để lần cập nhật đầu luôn áp trạng thái

        this.setHill()
        this.setPines()
        this.setStatue()
        this.setSnowmen()

        this.game.ticker.events.on('tick', () => this.update())
    }

    box(...args) { return this.campus.box(...args) }

    material(hex)
    {
        let material = this.materials?.get(hex)
        if(!this.materials) this.materials = new Map()
        if(!material)
        {
            material = new MeshDefaultMaterial({ colorNode: color(hex) })
            this.materials.set(hex, material)
        }
        return material
    }

    /** Gò đất: các đĩa tròn chồng lên nhau, nhỏ và cao dần. */
    setHill()
    {
        const cylinder = this.campus.cylinderGeometry

        for(let i = 0; i < TIERS; i++)
        {
            const ratio = i / TIERS
            const radius = PINE_HILL.radius * (1 - ratio * 0.82)
            const tierHeight = PINE_HILL.height / TIERS
            const y = tierHeight * i + tierHeight * 0.5

            // Cỏ đậm dần lên đỉnh cho đồi có khối, không bẹt như cái bánh
            const hex = i < TIERS * 0.4 ? '#6f9e3f' : (i < TIERS * 0.75 ? '#659237' : '#5c8531')

            const mesh = new THREE.Mesh(cylinder, this.material(hex))
            mesh.scale.set(radius * 2, tierHeight * 1.06, radius * 2)
            mesh.position.set(PINE_HILL.x, y, PINE_HILL.z)
            mesh.receiveShadow = true
            mesh.castShadow = i > TIERS * 0.5
            this.group.add(mesh)

            this.game.objects.add(
                null,
                {
                    type: 'fixed',
                    friction: 0.3,
                    restitution: 0,
                    position: { x: PINE_HILL.x, y, z: PINE_HILL.z },
                    colliders: [ { shape: 'cylinder', parameters: [ tierHeight * 0.53, radius ] } ]
                }
            )
        }
    }

    /**
     * Rừng thông: thân trụ + ba tầng tán hình nón. Giữ tham chiếu tới tán và
     * chóp tuyết để lát đổi theo thời tiết.
     */
    setPines()
    {
        this.pines = []

        const cone = new THREE.ConeGeometry(1, 1, 7)
        const cylinder = this.campus.cylinderGeometry

        for(let i = 0; i < PINE_COUNT; i++)
        {
            // Rải theo xoắn ốc góc vàng để cây không dồn cục
            const angle = i * 2.39996
            const spread = Math.sqrt((i + 0.5) / PINE_COUNT)
            const radius = PINE_HILL.radius * 0.86 * spread

            const x = PINE_HILL.x + Math.cos(angle) * radius
            const z = PINE_HILL.z + Math.sin(angle) * radius

            // Cao độ mặt đồi tại bán kính đó — cùng công thức với setHill
            const tierRatio = 1 - radius / PINE_HILL.radius
            const groundY = PINE_HILL.height * Math.max(0, Math.min(1, tierRatio / 0.82))

            // Chừa đỉnh cho tượng
            if(radius < 6.5) continue // chừa hẳn khoảng trống quanh tượng, đừng để thông che mất

            const scale = 0.6 + ((i * 37) % 10) / 30
            const trunkHeight = 1.5 * scale

            const trunk = new THREE.Mesh(cylinder, this.material(COLORS.trunk))
            trunk.scale.set(0.34 * scale, trunkHeight, 0.34 * scale)
            trunk.position.set(x, groundY + trunkHeight * 0.5, z)
            trunk.castShadow = true
            trunk.receiveShadow = true
            this.group.add(trunk)

            const pine = { canopies: [], caps: [] }

            // Ba tầng tán, tầng dưới to nhất
            for(let level = 0; level < 3; level++)
            {
                const levelScale = (1 - level * 0.24) * scale
                const canopyY = groundY + trunkHeight + level * 1.05 * scale + 0.65 * scale

                const canopy = new THREE.Mesh(cone, this.material('#2f6d3a'))
                canopy.scale.set(2.5 * levelScale, 2 * levelScale, 2.5 * levelScale)
                canopy.position.set(x, canopyY, z)
                canopy.castShadow = true
                canopy.receiveShadow = true
                this.group.add(canopy)
                pine.canopies.push(canopy)

                // Chóp tuyết đậy lên tán, chỉ hiện khi trời tuyết
                const cap = new THREE.Mesh(cone, this.material('#f2f6fa'))
                cap.scale.set(2.5 * levelScale * 0.78, 2 * levelScale * 0.5, 2.5 * levelScale * 0.78)
                cap.position.set(x, canopyY + 0.5 * levelScale, z)
                cap.castShadow = false
                cap.receiveShadow = false
                cap.visible = false
                this.group.add(cap)
                pine.caps.push(cap)
            }

            // Thân cây có va chạm — đâm vào thông thì khựng lại như đâm cây thật
            this.game.objects.add(
                null,
                {
                    type: 'fixed',
                    position: { x, y: groundY + trunkHeight * 0.5, z },
                    colliders: [ { shape: 'cylinder', parameters: [ trunkHeight * 0.5, 0.34 * scale ] } ]
                }
            )

            this.pines.push(pine)
        }
    }

    /**
     * Tượng SELF MADE MAN trên đỉnh đồi: người thợ đang tự đục mình ra khỏi
     * khối đá, tay phải giơ búa. Ghép khối theo đúng dáng ảnh thật.
     */
    setStatue()
    {
        const x = STATUE.x
        const z = STATUE.z
        const base = PINE_HILL.height
        const S = 1.45 // phóng to tượng cho nổi hẳn trên tán thông

        const stone = COLORS.stone
        const bronze = COLORS.bronze

        // Bệ đá hai bậc, có tấm biển đồng
        this.box(4.2 * S, 0.4 * S, 4.2 * S, x, base + 0.2 * S, z, '#7e7a70', { physical: true })
        this.box(2.6 * S, 2.2 * S, 2.6 * S, x, base + 1.5 * S, z, stone, { physical: true })
        this.box(1.2 * S, 0.42 * S, 0.1, x, base + 1.5 * S, z + 1.32 * S, '#c9a227')

        // Khối đá thô người thợ đang đục — nghiêng, cao dần về phía sau
        this.box(1.5 * S, 2.3 * S, 1.5 * S, x - 0.15 * S, base + 3.75 * S, z, '#4a4034', { rotationZ: 0.08 })
        this.box(1.1 * S, 1.5 * S, 1.2 * S, x + 0.35 * S, base + 3.3 * S, z, '#443a2f')

        // Thân người nhoài ra khỏi đá, nghiêng về trước
        this.box(0.95 * S, 1.5 * S, 0.7 * S, x + 0.55 * S, base + 4.15 * S, z, bronze, { rotationZ: 0.3 })
        // Đầu
        this.box(0.46 * S, 0.5 * S, 0.46 * S, x + 0.95 * S, base + 5.05 * S, z, bronze)
        // Tay phải giơ cao cầm búa
        this.box(0.26 * S, 1.5 * S, 0.26 * S, x + 0.72 * S, base + 5.5 * S, z - 0.2 * S, bronze, { rotationZ: -0.24 })
        this.box(0.8 * S, 0.34 * S, 0.34 * S, x + 0.36 * S, base + 6.28 * S, z - 0.2 * S, '#6b4a2a')
        this.box(0.42 * S, 0.5 * S, 0.5 * S, x + 0.05 * S, base + 6.3 * S, z - 0.2 * S, '#3f3f42')
        // Tay trái tì lên khối đá, cầm đục
        this.box(0.24 * S, 1.1 * S, 0.24 * S, x + 0.9 * S, base + 3.9 * S, z + 0.4 * S, bronze, { rotationZ: 0.62 })
        this.box(0.16 * S, 0.5 * S, 0.16 * S, x + 1.25 * S, base + 3.45 * S, z + 0.4 * S, '#5a5a5f')
    }

    /** Ba người tuyết quanh chân đồi — chỉ hiện khi trời tuyết. */
    setSnowmen()
    {
        this.snowmen = []

        const spots = [
            { x: PINE_HILL.x + 9, z: PINE_HILL.z + 7 },
            { x: PINE_HILL.x - 8, z: PINE_HILL.z + 9 },
            { x: PINE_HILL.x + 2, z: PINE_HILL.z - 11 },
        ]

        for(const spot of spots)
        {
            const group = new THREE.Group()
            group.position.set(spot.x, 0, spot.z)
            group.visible = false
            this.group.add(group)

            const add = (w, h, d, y, hex, extra = {}) =>
            {
                const mesh = new THREE.Mesh(extra.geometry ?? this.campus.boxGeometry, this.material(hex))
                mesh.scale.set(w, h, d)
                mesh.position.set(extra.x ?? 0, y, extra.z ?? 0)
                mesh.castShadow = true
                mesh.receiveShadow = true
                group.add(mesh)
                return mesh
            }

            const sphere = this.campus.cylinderGeometry
            add(1.7, 1.3, 1.7, 0.65, '#f4f8fb', { geometry: sphere })   // thân dưới
            add(1.25, 1.05, 1.25, 1.75, '#f4f8fb', { geometry: sphere }) // thân giữa
            add(0.9, 0.85, 0.9, 2.65, '#fbfdff', { geometry: sphere })   // đầu

            add(0.95, 0.12, 0.95, 3.1, '#33323a', { geometry: sphere })  // vành mũ
            add(0.62, 0.5, 0.62, 3.35, '#33323a', { geometry: sphere })  // chóp mũ

            add(0.18, 0.18, 0.5, 2.7, '#f0821e', { z: 0.42 })            // mũi cà rốt
            add(0.12, 0.12, 0.12, 2.82, '#2a2a30', { x: -0.2, z: 0.38 }) // mắt
            add(0.12, 0.12, 0.12, 2.82, '#2a2a30', { x: 0.2, z: 0.38 })
            add(0.7, 0.5, 0.12, 1.9, '#c0392b', { z: 0.36 })             // khăn quàng

            // Hai cành tay
            add(1.5, 0.1, 0.1, 1.95, '#6b4a2a', { x: 0 })

            this.snowmen.push(group)
        }
    }

    /** Đổi bộ mặt đồi theo thời tiết. */
    update()
    {
        this.tickCount = (this.tickCount ?? 0) + 1 // để bộ kiểm đo theo NHỊP GAME
        const snowy = this.game.weather.snow.value > SNOW_ON

        if(snowy === this.snowy)
            return

        this.snowy = snowy

        for(const pine of this.pines)
        {
            for(const cap of pine.caps)
                cap.visible = snowy

            // Tán ngả sang xanh lạnh khi có tuyết đọng
            for(const canopy of pine.canopies)
                canopy.material = this.material(snowy ? '#406b52' : '#2f6d3a')
        }

        for(const snowman of this.snowmen)
            snowman.visible = snowy
    }
}
