import * as THREE from 'three/webgpu'
import { color } from 'three/tsl'
import { Game } from '../Game.js'
import { MeshDefaultMaterial } from '../Materials/MeshDefaultMaterial.js'
import { CANTEEN, FOOTBALL, LAKE, LAWN, PINE_HILL, RANKING_PLAZA } from '../../data/fptu.js'

/**
 * SINH VIÊN trong khuôn viên — người có KHỚP, biết đứng, ngồi và đi lại.
 *
 * ─── VÌ SAO KHÔNG PHẢI "NHƯ GTA 5" ───
 * User hỏi thẳng câu đó. Câu trả lời trung thực: thế giới này không dựng được
 * người thật, và có dựng được cũng không nên.
 *  - Toàn bộ cảnh dùng MỘT nguồn sáng duy nhất (`Lighting.count = 1`), vật liệu
 *    phẳng tự tính sáng tối bằng TSL. Không có da, không có tóc, không đổ bóng
 *    mềm lên chính mình — những thứ làm nên khuôn mặt người.
 *  - Máy quay đứng cao 22 đơn vị chúc thẳng xuống, FOV 25. Ở khoảng cách đó một
 *    người cao 1,7 chiếm chừng năm chục điểm ảnh: có mô hình mười nghìn tam giác
 *    cũng không ai thấy được cái mũi.
 *  - Cả bản đồ là phong cách đồ chơi mặt phẳng. Thả người ảnh thật vào giữa mấy
 *    toà nhà hộp và cái xe hoạt hình thì hỏng cả hai.
 *
 * Nên hướng đi là **đúng tỉ lệ người + có khớp + biết cử động**: đó mới là thứ
 * mắt dùng để nhận ra "người thật" ở cỡ này, chứ không phải số tam giác.
 * Bản trước chỉ có một hộp thân với một hộp đầu — user chê "giả quá" là đúng.
 *
 * ─── GIỚI HẠN SỐ LƯỢNG ───
 * Mỗi người 15 khối. Giữ tổng quanh 40 người (~600 khối) — đủ đông để sân
 * trường có sự sống mà không thêm hàng nghìn lệnh vẽ.
 */

const rand = (seed) =>
{
    const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453
    return x - Math.floor(x)
}

const SKIN = [ '#f0c9a4', '#e0b183', '#c98d5f', '#a9683f', '#7d4b2c' ]
const HAIR = [ '#241a14', '#3a2a1c', '#0f0e10', '#5b3a22', '#7a6a52' ]
const SHIRT = [ '#f2f4f7', '#f37021', '#2f6d9e', '#d04d6a', '#a6ce39', '#e8c33a', '#7a4a9e', '#3aa88f', '#e8e4d8' ]
const PANTS = [ '#2f3a4a', '#3d3f45', '#4a5568', '#6b5b45', '#22272f' ]

export class FptuPeople
{
    constructor(campus)
    {
        this.game = Game.getInstance()
        this.campus = campus
        this.y = campus.groundTop

        this.geometry = campus.boxGeometry
        this.headGeometry = new THREE.SphereGeometry(0.5, 8, 6)
        this.materials = new Map()

        this.people = []

        this.group = new THREE.Group()
        this.group.name = 'fptuPeople'
        this.game.scene.add(this.group)

        this.spawn()

        this.game.ticker.events.on('tick', () => this.update())
    }

    material(hex)
    {
        let m = this.materials.get(hex)
        if(!m)
        {
            m = new MeshDefaultMaterial({ colorNode: color(hex) })
            this.materials.set(hex, m)
        }
        return m
    }

    /** Một khối của cơ thể, gắn vào một nhóm cha (để xoay quanh khớp). */
    part(parent, w, h, d, x, y, z, hex, geometry = null)
    {
        const mesh = new THREE.Mesh(geometry ?? this.geometry, this.material(hex))
        mesh.scale.set(w, h, d)
        mesh.position.set(x, y, z)
        mesh.castShadow = true
        mesh.receiveShadow = true
        parent.add(mesh)
        return mesh
    }

    /**
     * Dựng một người. Tay và chân treo vào NHÓM KHỚP đặt ở vai/hông, nên xoay
     * nhóm là cả chi xoay quanh đúng khớp — không phải trượt cả khối đi.
     */
    makePerson(seed)
    {
        const skin = SKIN[Math.floor(rand(seed * 3 + 1) * SKIN.length)]
        const hair = HAIR[Math.floor(rand(seed * 5 + 2) * HAIR.length)]
        const shirt = SHIRT[Math.floor(rand(seed * 7 + 3) * SHIRT.length)]
        const pants = PANTS[Math.floor(rand(seed * 11 + 4) * PANTS.length)]
        const tall = 0.94 + rand(seed * 13 + 5) * 0.16

        const root = new THREE.Group()
        root.scale.setScalar(tall)

        // ── Chân: đùi treo ở hông, cẳng treo ở gối ──────────────────────────
        const legs = []
        for(const side of [ -1, 1 ])
        {
            const hip = new THREE.Group()
            hip.position.set(side * 0.11, 0.86, 0)
            root.add(hip)
            this.part(hip, 0.21, 0.46, 0.23, 0, -0.23, 0, pants)

            const knee = new THREE.Group()
            knee.position.set(0, -0.46, 0)
            hip.add(knee)
            this.part(knee, 0.185, 0.44, 0.2, 0, -0.22, 0, pants)
            this.part(knee, 0.21, 0.12, 0.36, 0, -0.46, 0.06, '#2a2a30')

            legs.push({ hip, knee })
        }

        // ── Thân: hông, ngực hơi rộng hơn, vai ──────────────────────────────
        this.part(root, 0.4, 0.26, 0.25, 0, 0.99, 0, pants)
        this.part(root, 0.46, 0.44, 0.27, 0, 1.34, 0, shirt)
        this.part(root, 0.54, 0.14, 0.28, 0, 1.56, 0, shirt)

        // ── Tay: cánh tay treo ở vai, cẳng tay treo ở khuỷu ─────────────────
        const arms = []
        for(const side of [ -1, 1 ])
        {
            const shoulder = new THREE.Group()
            shoulder.position.set(side * 0.32, 1.54, 0)
            root.add(shoulder)
            this.part(shoulder, 0.15, 0.38, 0.17, 0, -0.19, 0, shirt)

            const elbow = new THREE.Group()
            elbow.position.set(0, -0.38, 0)
            shoulder.add(elbow)
            this.part(elbow, 0.135, 0.34, 0.15, 0, -0.17, 0, skin)
            this.part(elbow, 0.14, 0.14, 0.14, 0, -0.38, 0, skin)

            arms.push({ shoulder, elbow })
        }

        // ── Cổ, đầu, tóc ────────────────────────────────────────────────────
        this.part(root, 0.13, 0.1, 0.13, 0, 1.66, 0, skin)
        this.part(root, 0.29, 0.33, 0.28, 0, 1.85, 0, skin, this.headGeometry)
        this.part(root, 0.31, 0.19, 0.3, 0, 1.93, -0.01, hair, this.headGeometry)

        // Tóc dài cho một phần
        if(rand(seed * 17 + 6) > 0.55)
            this.part(root, 0.26, 0.3, 0.14, 0, 1.78, -0.13, hair)

        // Ba lô cho một nửa
        if(rand(seed * 19 + 7) > 0.45)
        {
            const bag = [ '#c0392b', '#2f6d9e', '#3f7a34', '#4a4a55' ][Math.floor(rand(seed * 23 + 8) * 4)]
            this.part(root, 0.3, 0.4, 0.16, 0, 1.32, -0.2, bag)
        }

        return { root, legs, arms }
    }

    /** Người đứng yên: chân thẳng, tay buông, hơi lệch trọng tâm cho tự nhiên. */
    poseStand(p, seed)
    {
        const lean = (rand(seed) - 0.5) * 0.16
        p.legs[0].hip.rotation.x = lean
        p.legs[1].hip.rotation.x = -lean * 0.6
        p.arms[0].shoulder.rotation.x = 0.08 + lean
        p.arms[1].shoulder.rotation.x = 0.08 - lean
        p.arms[0].elbow.rotation.x = -0.18
        p.arms[1].elbow.rotation.x = -0.24
    }

    /** Người ngồi: đùi ngang, cẳng chân thõng, tay chống nhẹ. */
    poseSit(p)
    {
        for(const leg of p.legs)
        {
            leg.hip.rotation.x = -Math.PI * 0.5
            leg.knee.rotation.x = Math.PI * 0.48
        }
        p.arms[0].shoulder.rotation.x = 0.5
        p.arms[1].shoulder.rotation.x = 0.42
        p.arms[0].elbow.rotation.x = -0.7
        p.arms[1].elbow.rotation.x = -0.6
        // Hạ cả người xuống đúng mặt ghế
        p.root.position.y -= 0.42 * p.root.scale.x
    }

    spawn()
    {
        const props = this.campus.props

        /** Chỗ tụ tập: tâm, bán kính, và bao nhiêu người. */
        const anchors = [
            { x: RANKING_PLAZA.x + 9, z: RANKING_PLAZA.z, r: 11, n: 6 },
            { x: LAWN.x, z: LAWN.z, r: 13, n: 6 },
            { x: CANTEEN.x + 9, z: CANTEEN.z, r: 10, n: 6 },
            { x: -135, z: 83, r: 11, n: 5 },
            { x: -179, z: 83, r: 11, n: 5 },
            { x: LAKE.x, z: LAKE.z + 26, r: 12, n: 5 },
            { x: PINE_HILL.x, z: PINE_HILL.z + 19, r: 10, n: 4 },
            { x: FOOTBALL.x, z: FOOTBALL.z, r: 13, n: 5 },
        ]

        let seed = 1
        for(const a of anchors)
        {
            let made = 0
            for(let i = 0; i < a.n * 8 && made < a.n; i++)
            {
                seed++
                const ang = rand(seed * 3) * Math.PI * 2
                const rad = Math.sqrt(rand(seed * 5)) * a.r
                const x = a.x + Math.cos(ang) * rad
                const z = a.z + Math.sin(ang) * rad

                // Dùng lại đúng bộ vùng cấm của đồ đạc — người cũng không được
                // đứng giữa lòng đường hay trong tường
                if(props && props.blocked(x, z)) continue

                const person = this.makePerson(seed)
                person.root.position.set(x, this.y, z)
                person.root.rotation.y = rand(seed * 7) * Math.PI * 2
                this.group.add(person.root)

                // Một phần ba đi lại, còn lại đứng nói chuyện
                const walker = rand(seed * 11) > 0.66
                if(walker)
                {
                    person.mode = 'walk'
                    person.heading = person.root.rotation.y
                    person.speed = 0.75 + rand(seed * 13) * 0.5
                    person.phase = rand(seed * 17) * Math.PI * 2
                    person.home = { x, z, r: a.r }
                }
                else
                {
                    person.mode = 'stand'
                    this.poseStand(person, seed * 19)
                }

                this.people.push(person)
                made++
            }
        }

        // Vài người ngồi trên ghế quanh hồ sen — cần có người NGỒI thì mới ra
        // dáng sân trường, đứng hết trông như đang xếp hàng
        for(let i = 0; i < 6; i++)
        {
            const a = (i / 6) * Math.PI * 2 + 0.3
            const x = LAKE.x + Math.cos(a) * (LAKE.radiusX + 4.5)
            const z = LAKE.z + Math.sin(a) * (LAKE.radiusZ + 4.5)
            if(props && props.blocked(x, z)) continue

            seed++
            const person = this.makePerson(seed)
            person.root.position.set(x, this.y + 0.48, z)
            person.root.rotation.y = -(a + Math.PI) + Math.PI * 0.5
            this.poseSit(person)
            person.mode = 'sit'
            this.group.add(person.root)
            this.people.push(person)
        }
    }

    /**
     * Nhịp đi: đùi và tay đánh ngược pha nhau, gối gập khi chân ra sau, thân
     * nhún nhẹ theo bước. Ba thứ đó là cái mắt dùng để đọc ra "đang đi bộ".
     */
    update()
    {
        const delta = Math.min(this.game.ticker.delta, 0.1)
        const elapsed = this.game.ticker.elapsed
        const props = this.campus.props

        for(const p of this.people)
        {
            if(p.mode !== 'walk') continue

            p.phase += delta * p.speed * 5.2
            const swing = Math.sin(p.phase)
            const swingB = Math.sin(p.phase + Math.PI)

            p.legs[0].hip.rotation.x = swing * 0.62
            p.legs[1].hip.rotation.x = swingB * 0.62
            p.legs[0].knee.rotation.x = Math.max(0, -swing) * 0.85
            p.legs[1].knee.rotation.x = Math.max(0, -swingB) * 0.85

            p.arms[0].shoulder.rotation.x = swingB * 0.5
            p.arms[1].shoulder.rotation.x = swing * 0.5
            p.arms[0].elbow.rotation.x = -0.3 - Math.max(0, swingB) * 0.35
            p.arms[1].elbow.rotation.x = -0.3 - Math.max(0, swing) * 0.35

            // Thân nhún theo bước
            p.root.position.y = this.y + Math.abs(Math.sin(p.phase)) * 0.035 * p.root.scale.x

            // Đi tới, thi thoảng đổi hướng, và luôn quay về nếu đi quá xa chỗ mình
            const nx = p.root.position.x + Math.sin(p.heading) * p.speed * delta
            const nz = p.root.position.z + Math.cos(p.heading) * p.speed * delta

            const far = Math.hypot(nx - p.home.x, nz - p.home.z) > p.home.r
            const wall = props && props.blocked(nx, nz)

            if(far || wall)
            {
                // Quay đầu về phía chỗ mình, cộng chút lệch cho khỏi máy móc
                p.heading = Math.atan2(p.home.x - p.root.position.x, p.home.z - p.root.position.z)
                    + (rand(Math.floor(elapsed * 3) + p.speed * 100) - 0.5) * 1.1
            }
            else
            {
                p.root.position.x = nx
                p.root.position.z = nz
                p.heading += Math.sin(elapsed * 0.6 + p.phase * 0.11) * delta * 0.35
            }

            p.root.rotation.y = p.heading
        }
    }
}
