import * as THREE from 'three/webgpu'
import { Game } from '../Game.js'
import {
    ALPHA, BASKETBALL, BUILDINGS, CANTEEN, DORMS, FOOTBALL, FORECOURT, GATE,
    LAKE, LAWN, MAIN_ROAD, MARTIAL, PARKING, PINE_HILL, RANKING_PLAZA,
    RANKING_SIGN, SIGN, SWAN_LAKE, THROUGH_ROAD, AXIS,
} from '../../data/fptu.js'

/**
 * ĐỒ ĐẠC SÂN TRƯỜNG — thứ làm khuôn viên hết trống trải.
 *
 * Người dùng chê hai điều và mô-đun này trả lời điều thứ hai: "khu FPTU đang
 * trống trải, thêm chi tiết đi". Ở đây là cột đèn, ghế đá, thùng rác, giá xe
 * đạp cùng xe đạp, ô tô đậu trong bãi, cột cờ, bảng tin, hàng rào cây, bồn hoa và
 * bàn ăn ngoài trời. Người thì ở `FptuPeople.js` — nó dùng lại `blocked()` của
 * đây nên phải dựng SAU mô-đun này.
 *
 * ─── VÌ SAO CÓ `blocked()` ───
 * Đợt trước đã dẫm đúng lỗi đặt đè: bộ kiểm `check-fptu-layout.mjs` chạy lần
 * đầu bắt được BẢY cặp công trình chồng lên nhau mà nhìn mắt thường không thấy.
 * Rải hàng trăm món đồ bằng tay thì kiểu gì cũng có món rơi vào lòng đường hay
 * đâm xuyên tường. Nên mọi thứ ở đây đều đi qua `blocked()` — một danh sách
 * vùng cấm dựng THẲNG TỪ `data/fptu.js`, nên sửa số liệu bố cục là vùng cấm tự
 * đổi theo, không phải nhớ cập nhật hai nơi.
 *
 * Mọi phép ngẫu nhiên đều băm từ chỉ số, KHÔNG dùng `Math.random`: bản dựng
 * phải tái lập được (cùng nguồn ra cùng mã băm — xem ghi chú build ở bàn giao).
 */

/** Số giả ngẫu nhiên tất định trong [0,1) từ một hạt nguyên. */
const rand = (seed) =>
{
    const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453
    return x - Math.floor(x)
}

export class FptuProps
{
    constructor(campus)
    {
        this.game = Game.getInstance()
        this.campus = campus
        this.y = campus.groundTop

        this.setBlockers()

        // Mặt kính của từng cột đèn — `FptuLights` đổi sang vật liệu phát sáng
        // và treo vũng sáng ban đêm lên đây
        this.lampLenses = []

        this.setLampPosts()
        this.setBenchesAndBins()
        this.setHedges()
        this.setFlowerBeds()
        this.setFlagPoles()
        this.setNoticeBoards()
        this.setBicycles()
        this.setParkedCars()
        this.setPicnicArea()
    }

    box(...args) { return this.campus.box(...args) }
    slab(...args) { return this.campus.slab(...args) }

    /**
     * Danh sách vùng CẤM ĐẶT ĐỒ, dựng thẳng từ số liệu bố cục.
     * Hình chữ nhật `{ x, z, w, d }` là nửa-kích-thước tính từ tâm.
     */
    setBlockers()
    {
        const rect = (x, z, w, d, pad = 1.5) => ({ x, z, w: w * 0.5 + pad, d: d * 0.5 + pad })

        this.blockers = [
            // Đường sá — cấm tuyệt đối, đây là chỗ xe chạy
            rect(MAIN_ROAD.x, MAIN_ROAD.z, MAIN_ROAD.width, MAIN_ROAD.length, 1.2),
            rect((AXIS.fromX + AXIS.toX) * 0.5, AXIS.z, Math.abs(AXIS.toX - AXIS.fromX), AXIS.halfWidth * 2, 1.2),
            rect((THROUGH_ROAD.fromX + THROUGH_ROAD.toX) * 0.5, THROUGH_ROAD.z, Math.abs(THROUGH_ROAD.toX - THROUGH_ROAD.fromX), THROUGH_ROAD.halfWidth * 2, 1.2),

            // Công trình
            rect(ALPHA.x, ALPHA.z, ALPHA.depth + 6, ALPHA.columnWidth * ALPHA.columns.length),
            rect(FORECOURT.x, FORECOURT.z, FORECOURT.width, FORECOURT.depth, 0.5),
            rect(RANKING_PLAZA.x, RANKING_PLAZA.z, RANKING_PLAZA.width, RANKING_PLAZA.depth, 0.5),
            rect(CANTEEN.x, CANTEEN.z, CANTEEN.width, CANTEEN.depth),
            rect(PARKING.x, PARKING.z, PARKING.width, PARKING.depth, 0.5),
            rect(GATE.x, GATE.z, 6, 16),

            /**
             * Hàng chữ FPT UNIVERSITY + biển xếp hạng + thảm cỏ trục chính —
             * KHÔNG đặt gì vào đây. Bản đầu bảng tin cắm ngay TRƯỚC hàng chữ
             * (−124, 32/48 — chữ ở x −127, trải z 28…52) che mất chữ, user chụp
             * ảnh chê. Vùng cấm phải nằm trong `blocked()` chứ không phải trong
             * trí nhớ của người đặt đồ.
             */
            rect(SIGN.x, SIGN.z, 6, 30, 1),
            rect(RANKING_SIGN.x, RANKING_SIGN.z, 3, RANKING_SIGN.width + 3, 1),
            rect(LAWN.x, LAWN.z, LAWN.width, LAWN.depth, 0.5),

            // Sân thể thao
            rect(FOOTBALL.x, FOOTBALL.z, FOOTBALL.width, FOOTBALL.depth),
            rect(BASKETBALL.x, BASKETBALL.z, BASKETBALL.width, BASKETBALL.depth),
            rect(MARTIAL.x, MARTIAL.z, MARTIAL.width, MARTIAL.depth),

            ...BUILDINGS.map((b) => rect(b.x, b.z, b.width, b.depth)),
            ...DORMS.map((d) => rect(d.x, d.z, 6.5, 5)),
        ]

        // Hồ và đồi là hình tròn/bầu dục — kiểm riêng
        this.roundBlockers = [
            { x: LAKE.x, z: LAKE.z, rx: LAKE.radiusX + 2, rz: LAKE.radiusZ + 2 },
            { x: SWAN_LAKE.x, z: SWAN_LAKE.z, rx: SWAN_LAKE.radiusX + 2, rz: SWAN_LAKE.radiusZ + 2 },
            { x: PINE_HILL.x, z: PINE_HILL.z, rx: PINE_HILL.radius + 1, rz: PINE_HILL.radius + 1 },
        ]

        // Mép đảo — đừng để đồ trôi ra bãi cát hay xuống nước
        this.bounds = { minX: -234, maxX: -90, minZ: -36, maxZ: 96 }
    }

    /** Chỗ này có đặt được đồ không. */
    blocked(x, z)
    {
        if(x < this.bounds.minX || x > this.bounds.maxX || z < this.bounds.minZ || z > this.bounds.maxZ)
            return true

        for(const b of this.blockers)
            if(Math.abs(x - b.x) < b.w && Math.abs(z - b.z) < b.d)
                return true

        for(const b of this.roundBlockers)
            if(Math.hypot((x - b.x) / b.rx, (z - b.z) / b.rz) < 1)
                return true

        return false
    }

    /**
     * Cột đèn kiểu sân trường: trụ tròn, tay vươn, chao đèn nghiêng.
     * Đặt dọc hai bên đường lớn và trục lễ nghi.
     */
    setLampPosts()
    {
        const spots = []

        // Dọc con đường lớn (chạy theo trục z tại x = −106), hai bên lề
        for(let z = MAIN_ROAD.z - MAIN_ROAD.length * 0.5 + 6; z <= MAIN_ROAD.z + MAIN_ROAD.length * 0.5 - 6; z += 13)
        {
            spots.push({ x: MAIN_ROAD.x - MAIN_ROAD.width * 0.5 - 1.6, z, dir: 1 })
            spots.push({ x: MAIN_ROAD.x + MAIN_ROAD.width * 0.5 + 1.6, z, dir: -1 })
        }

        // Dọc trục lễ nghi (chạy theo trục x tại z = 40)
        for(let x = AXIS.fromX - 8; x >= AXIS.toX + 6; x -= 12)
        {
            // Né hàng chữ FPT UNIVERSITY — cột đèn đứng chen giữa các ký tự
            // nhìn rất bẩn (chữ ở x −127, cột lưới 12 rơi đúng x −128)
            if(Math.abs(x - SIGN.x) < 5) continue

            spots.push({ x, z: AXIS.z - AXIS.halfWidth - 1.4, dir: 1, along: 'x' })
            spots.push({ x, z: AXIS.z + AXIS.halfWidth + 1.4, dir: -1, along: 'x' })
        }

        for(const [ i, s ] of spots.entries())
        {
            // Lề đường nằm ngay sát vùng cấm đường nên bỏ qua phép kiểm chồng
            // với chính con đường đó; chỉ tránh nhà cửa và hồ.
            if(this.roundBlockers.some((b) => Math.hypot((s.x - b.x) / b.rx, (s.z - b.z) / b.rz) < 1)) continue
            if(s.x < this.bounds.minX || s.x > this.bounds.maxX || s.z < this.bounds.minZ || s.z > this.bounds.maxZ) continue

            this.lampPost(s.x, s.z, s.along === 'x' ? (s.dir > 0 ? Math.PI * 0.5 : -Math.PI * 0.5) : (s.dir > 0 ? 0 : Math.PI), i)
        }
    }

    lampPost(x, z, rotation, seed)
    {
        const H = 4.2
        const cyl = this.campus.cylinderGeometry

        this.box(0.62, 0.22, 0.62, x, this.y + 0.11, z, '#5d5f63', { geometry: cyl, castShadow: false })
        this.box(0.26, H, 0.26, x, this.y + H * 0.5, z, '#6a6d72', { geometry: cyl, physical: true })

        // Tay đèn vươn ra rồi chao đèn chúc xuống
        const ax = Math.cos(rotation)
        const az = Math.sin(rotation)
        this.box(1.5, 0.16, 0.16, x + ax * 0.75, this.y + H - 0.1, z + az * 0.75, '#6a6d72', { rotationY: -rotation })
        this.box(0.72, 0.3, 0.42, x + ax * 1.45, this.y + H - 0.28, z + az * 1.45, '#4a4d52', { rotationY: -rotation })
        // Mặt kính — ghi lại để `FptuLights` gắn vật liệu phát sáng
        const lens = this.box(0.6, 0.08, 0.34, x + ax * 1.45, this.y + H - 0.44, z + az * 1.45, '#ffe9b8', { rotationY: -rotation, castShadow: false })
        this.lampLenses.push({ mesh: lens, x: x + ax * 1.45, z: z + az * 1.45 })

        // Thi thoảng treo giỏ hoa cho đỡ đơn điệu
        if(rand(seed) > 0.55)
        {
            this.box(0.42, 0.26, 0.42, x + ax * 0.85, this.y + H - 0.95, z + az * 0.85, '#7a5b3a', { geometry: cyl, castShadow: false })
            this.box(0.52, 0.3, 0.52, x + ax * 0.85, this.y + H - 0.74, z + az * 0.74, '#d04d6a', { geometry: cyl, castShadow: false })
        }
    }

    /** Ghế đá + thùng rác, rải dọc lối đi và quanh hai cái hồ. */
    setBenchesAndBins()
    {
        const spots = []

        // Quanh hồ sen — quay mặt ra hồ
        for(let i = 0; i < 10; i++)
        {
            const a = (i / 10) * Math.PI * 2
            spots.push({
                x: LAKE.x + Math.cos(a) * (LAKE.radiusX + 4.5),
                z: LAKE.z + Math.sin(a) * (LAKE.radiusZ + 4.5),
                rot: a + Math.PI,
            })
        }

        // Quanh hồ thiên nga
        for(let i = 0; i < 6; i++)
        {
            const a = (i / 6) * Math.PI * 2
            spots.push({
                x: SWAN_LAKE.x + Math.cos(a) * (SWAN_LAKE.radiusX + 4),
                z: SWAN_LAKE.z + Math.sin(a) * (SWAN_LAKE.radiusZ + 4),
                rot: a + Math.PI,
            })
        }

        // Dưới chân đồi thông, nhìn lên tượng
        for(let i = 0; i < 5; i++)
        {
            const a = (i / 5) * Math.PI * 2 + 0.4
            spots.push({
                x: PINE_HILL.x + Math.cos(a) * (PINE_HILL.radius + 3.5),
                z: PINE_HILL.z + Math.sin(a) * (PINE_HILL.radius + 3.5),
                rot: a + Math.PI,
            })
        }

        // Hai bên thảm cỏ trục chính
        for(let i = 0; i < 4; i++)
        {
            const x = LAWN.x + LAWN.width * 0.5 - 2 - i * 3.4
            spots.push({ x, z: LAWN.z - LAWN.depth * 0.5 - 2.5, rot: -Math.PI * 0.5 })
            spots.push({ x, z: LAWN.z + LAWN.depth * 0.5 + 2.5, rot: Math.PI * 0.5 })
        }

        let placed = 0
        for(const [ i, s ] of spots.entries())
        {
            if(this.blocked(s.x, s.z)) continue
            this.bench(s.x, s.z, s.rot)
            placed++

            // Cứ vài cái ghế thì có một thùng rác bên cạnh
            if(placed % 3 === 0)
            {
                const bx = s.x + Math.cos(s.rot + Math.PI * 0.5) * 1.9
                const bz = s.z + Math.sin(s.rot + Math.PI * 0.5) * 1.9
                if(!this.blocked(bx, bz)) this.bin(bx, bz, i)
            }
        }
    }

    bench(x, z, rotation)
    {
        // Chân
        for(const side of [ -1, 1 ])
            this.box(0.18, 0.44, 0.5, x + Math.cos(rotation + Math.PI * 0.5) * side * 0.85, this.y + 0.22, z + Math.sin(rotation + Math.PI * 0.5) * side * 0.85, '#6f6a60', { rotationY: -rotation })

        // Mặt ngồi
        this.box(0.62, 0.11, 2.2, x, this.y + 0.48, z, '#a8814e', { rotationY: -rotation, physical: true })
        // Tựa lưng, ngả ra sau một chút
        const bx = Math.cos(rotation) * -0.26
        const bz = Math.sin(rotation) * -0.26
        this.box(0.12, 0.62, 2.2, x + bx, this.y + 0.82, z + bz, '#a8814e', { rotationY: -rotation, rotationZ: 0.16 })
    }

    bin(x, z, seed)
    {
        const cyl = this.campus.cylinderGeometry
        this.box(0.62, 0.86, 0.62, x, this.y + 0.43, z, rand(seed) > 0.5 ? '#3f6f4a' : '#4a5560', { geometry: cyl, physical: true })
        this.box(0.7, 0.1, 0.7, x, this.y + 0.9, z, '#2f3a33', { geometry: cyl, castShadow: false })
    }

    /** Hàng rào cây thấp viền thảm cỏ và lối đi — mềm hoá mọi mép thẳng. */
    setHedges()
    {
        const runs = [
            // Viền thảm cỏ trục chính
            { x0: LAWN.x - LAWN.width * 0.5, z0: LAWN.z - LAWN.depth * 0.5 - 1.4, x1: LAWN.x + LAWN.width * 0.5, z1: LAWN.z - LAWN.depth * 0.5 - 1.4 },
            { x0: LAWN.x - LAWN.width * 0.5, z0: LAWN.z + LAWN.depth * 0.5 + 1.4, x1: LAWN.x + LAWN.width * 0.5, z1: LAWN.z + LAWN.depth * 0.5 + 1.4 },
            // Viền sảnh xếp hạng
            { x0: RANKING_PLAZA.x - 6, z0: RANKING_PLAZA.z - RANKING_PLAZA.depth * 0.5 - 1.2, x1: RANKING_PLAZA.x + 6, z1: RANKING_PLAZA.z - RANKING_PLAZA.depth * 0.5 - 1.2 },
            { x0: RANKING_PLAZA.x - 6, z0: RANKING_PLAZA.z + RANKING_PLAZA.depth * 0.5 + 1.2, x1: RANKING_PLAZA.x + 6, z1: RANKING_PLAZA.z + RANKING_PLAZA.depth * 0.5 + 1.2 },
            // Viền quanh cụm ký túc xá giữa
            { x0: -148, z0: 69, x1: -122, z1: 69 },
            { x0: -148, z0: 97, x1: -122, z1: 97 },
        ]

        for(const [ r, run ] of runs.entries())
        {
            const len = Math.hypot(run.x1 - run.x0, run.z1 - run.z0)
            const steps = Math.max(1, Math.round(len / 1.1))
            for(let i = 0; i <= steps; i++)
            {
                const t = i / steps
                const x = run.x0 + (run.x1 - run.x0) * t
                const z = run.z0 + (run.z1 - run.z0) * t
                if(this.blocked(x, z)) continue

                // CỤM LÁ THẬT của hệ mẫu, không phải hộp xanh — hàng rào hộp
                // chính là thứ user chụp ảnh chê "vuông như Minecraft"
                const jx = (rand(r * 47 + i) - 0.5) * 0.5
                const jz = (rand(r * 53 + i) - 0.5) * 0.5
                this.campus.canopy(x + jx, this.y + 0.3, z + jz, 0.5 + rand(r * 31 + i) * 0.28)
            }
        }
    }

    /** Bồn hoa nhiều màu, đặt ở các góc quảng trường và trước sảnh. */
    setFlowerBeds()
    {
        const beds = [
            { x: RANKING_PLAZA.x + 7.5, z: RANKING_PLAZA.z - 12 },
            { x: RANKING_PLAZA.x + 7.5, z: RANKING_PLAZA.z + 12 },
            { x: LAWN.x - 9, z: LAWN.z - 13 },
            { x: LAWN.x - 9, z: LAWN.z + 13 },
            { x: CANTEEN.x + 9, z: CANTEEN.z + 6 },
            { x: -132, z: 66 },
            { x: -176, z: 66 },
            { x: -206, z: 30 },
            { x: -120, z: 30 },
        ]

        const COLORS_FLOWER = [ '#e0556b', '#f0a93c', '#d94f8a', '#f2e05a', '#c96bd6' ]
        const cyl = this.campus.cylinderGeometry

        for(const [ b, bed ] of beds.entries())
        {
            if(this.blocked(bed.x, bed.z)) continue

            // Thành bồn xây tròn
            this.box(4.4, 0.4, 4.4, bed.x, this.y + 0.2, bed.z, '#b0a693', { geometry: cyl })
            this.box(3.9, 0.42, 3.9, bed.x, this.y + 0.24, bed.z, '#6b4f36', { geometry: cyl, castShadow: false })

            // Hoa: từng chùm nhỏ, màu xen kẽ
            for(let i = 0; i < 16; i++)
            {
                const a = i * 2.39996
                const r = 1.75 * Math.sqrt((i + 0.5) / 16)
                const hex = COLORS_FLOWER[(b + i) % COLORS_FLOWER.length]
                const s = 0.34 + rand(b * 17 + i) * 0.2
                this.box(s, s * 0.8, s, bed.x + Math.cos(a) * r, this.y + 0.56, bed.z + Math.sin(a) * r, hex, { geometry: cyl, castShadow: false })
            }
        }
    }

    /** Ba cột cờ trước sảnh xếp hạng. */
    setFlagPoles()
    {
        const cyl = this.campus.cylinderGeometry
        const FLAGS = [ '#da251d', '#f37021', '#00a3e0' ]

        /**
         * ⚠️ Cột cờ PHẢI qua `blocked()`.
         *
         * Bản đầu là chỗ DUY NHẤT trong file này tôi quên gọi nó, và hậu quả
         * đúng như user báo ngày 31/7: một cột cao 7,2 cắm ngay giữa trục lễ
         * nghi tại (−124, 40) — tức giữa lòng đường — nên lái tới là kẹt cứng.
         * Đo bằng tia thẳng đứng thấy vật cứng cao 7,24 ngay tim đường.
         *
         * Nay xếp cột cờ dọc theo mép Bắc quảng trường, cách trục ≥ 10.
         */
        for(let i = 0; i < 3; i++)
        {
            const x = RANKING_PLAZA.x - 8 + i * 4
            const z = RANKING_PLAZA.z - RANKING_PLAZA.depth * 0.5 - 4

            if(this.blocked(x, z)) continue
            this.box(1.1, 0.3, 1.1, x, this.y + 0.15, z, '#9c968a', { geometry: cyl, castShadow: false })
            this.box(0.2, 7.2, 0.2, x, this.y + 3.6, z, '#d9d5cc', { geometry: cyl, physical: true })
            // Lá cờ bay về một phía
            this.box(0.06, 1.1, 1.8, x + 0.06, this.y + 6.3, z + 0.95, FLAGS[i], { castShadow: false })
        }
    }

    /** Bảng tin và biển chỉ dẫn — thứ sân trường nào cũng có. */
    setNoticeBoards()
    {
        /**
         * Chỗ đặt bảng tin — đã DỜI khỏi mặt tiền hàng chữ (bản đầu ở −124,
         * 32/48 là ngay trước chữ FPT UNIVERSITY). Nay ở những chỗ người thật
         * hay dán thông báo: giữa hai cụm ký túc xá, cạnh nhà ăn, gần sân bóng.
         */
        const spots = [
            { x: -162, z: 88, rot: Math.PI * 0.5 },
            { x: -114, z: 62, rot: 0 },
            { x: -168, z: 70, rot: Math.PI * 0.5 },
            { x: -100, z: 26, rot: Math.PI },
        ]

        for(const [ i, s ] of spots.entries())
        {
            if(this.blocked(s.x, s.z)) continue

            for(const side of [ -1, 1 ])
                this.box(0.16, 1.9, 0.16, s.x + Math.cos(s.rot + Math.PI * 0.5) * side * 1.25, this.y + 0.95, s.z + Math.sin(s.rot + Math.PI * 0.5) * side * 1.25, '#6f6a60', { rotationY: -s.rot })

            this.box(0.18, 1.5, 3, s.x, this.y + 2.2, s.z, '#f4f2ec', { rotationY: -s.rot, physical: true })
            // Mấy tờ giấy dán trên bảng
            for(let j = 0; j < 4; j++)
            {
                const hex = [ '#f37021', '#00a3e0', '#a6ce39', '#e8e4d8' ][(i + j) % 4]
                this.box(0.05, 0.5, 0.62, s.x + Math.cos(s.rot) * 0.12, this.y + 2.5 - (j % 2) * 0.62, s.z + Math.sin(s.rot) * 0.12 + (j < 2 ? -0.78 : 0.78), hex, { rotationY: -s.rot, castShadow: false })
            }
            // Mái che nhỏ
            this.box(0.6, 0.12, 3.3, s.x, this.y + 3.02, s.z, '#8a5a3a', { rotationY: -s.rot, rotationZ: 0.12 })
        }
    }

    /** Giá để xe đạp + xe đạp, cạnh ký túc xá và toà Alpha. */
    setBicycles()
    {
        const racks = [
            { x: -135, z: 72, rot: 0 },
            { x: -135, z: 94, rot: 0 },
            { x: -179, z: 72, rot: 0 },
            { x: -179, z: 94, rot: 0 },
            { x: -150, z: 24, rot: Math.PI * 0.5 },
        ]

        const cyl = this.campus.cylinderGeometry

        for(const [ r, rack ] of racks.entries())
        {
            if(this.blocked(rack.x, rack.z)) continue

            const ux = Math.cos(rack.rot + Math.PI * 0.5)
            const uz = Math.sin(rack.rot + Math.PI * 0.5)

            // Khung giá: mấy quai sắt hình chữ U
            for(let i = 0; i < 5; i++)
            {
                const px = rack.x + ux * (i - 2) * 1.15
                const pz = rack.z + uz * (i - 2) * 1.15
                this.box(0.1, 0.75, 0.1, px, this.y + 0.37, pz, '#7c8189', { geometry: cyl })
                this.box(0.1, 0.75, 0.1, px + Math.cos(rack.rot) * 0.8, this.y + 0.37, pz + Math.sin(rack.rot) * 0.8, '#7c8189', { geometry: cyl })
                this.box(0.9, 0.1, 0.1, px + Math.cos(rack.rot) * 0.4, this.y + 0.75, pz + Math.sin(rack.rot) * 0.4, '#7c8189', { rotationY: -rack.rot })

                // Không phải chỗ nào cũng có xe
                if(rand(r * 13 + i) < 0.35) continue
                this.bicycle(px + Math.cos(rack.rot) * 0.4, pz + Math.sin(rack.rot) * 0.4, rack.rot, r * 13 + i)
            }
        }
    }

    bicycle(x, z, rotation, seed)
    {
        const cyl = this.campus.cylinderGeometry
        const hex = [ '#2f6d9e', '#c0392b', '#3f7a34', '#e0a52c', '#7a4a9e' ][Math.floor(rand(seed) * 5)]
        const ax = Math.cos(rotation)
        const az = Math.sin(rotation)

        // Hai bánh dựng đứng: hình trụ xoay 90° quanh trục lăn
        for(const s of [ -1, 1 ])
            this.box(0.62, 0.09, 0.62, x + ax * s * 0.52, this.y + 0.32, z + az * s * 0.52, '#2b2b30',
                { geometry: cyl, rotationY: -rotation, rotationX: Math.PI * 0.5, castShadow: false })

        this.box(1.02, 0.08, 0.08, x, this.y + 0.5, z, hex, { rotationY: -rotation })
        this.box(0.08, 0.34, 0.08, x - ax * 0.2, this.y + 0.62, z - az * 0.2, hex, { rotationY: -rotation })
        this.box(0.3, 0.07, 0.12, x - ax * 0.24, this.y + 0.8, z - az * 0.24, '#33333a', { rotationY: -rotation })
        this.box(0.08, 0.42, 0.5, x + ax * 0.45, this.y + 0.68, z + az * 0.45, '#33333a', { rotationY: -rotation })
    }

    /** Ô tô đậu trong bãi gửi xe, xếp thành hàng. */
    setParkedCars()
    {
        const COLORS_CAR = [ '#c0392b', '#2f6d9e', '#e8e4d8', '#3f4a55', '#4e8f3a', '#d8b43a' ]
        const count = Math.floor(PARKING.depth / 3.2)

        for(let i = 0; i < count; i++)
        {
            if(rand(i * 9 + 3) < 0.22) continue // chừa vài ô trống cho thật

            const z = PARKING.z - PARKING.depth * 0.5 + 1.9 + i * 3.2
            const x = PARKING.x
            const hex = COLORS_CAR[i % COLORS_CAR.length]

            this.parkedCar(x, z, hex)
        }
    }

    /**
     * MỘT CHIẾC Ô TÔ ĐẬU.
     *
     * Bản trước chỉ là mấy tấm phẳng chồng lên nhau nên user chê "hình vuông
     * giống Minecraft". Cái làm mắt đọc ra "ô tô" không phải số tam giác, mà là
     * bốn đặc điểm hình khối sau — bản này có đủ cả bốn:
     *
     *   1. MUI HẸP HƠN THÂN (greenhouse thóp vào), chứ không phải hộp trên hộp.
     *   2. CA-PÔ DỐC XUỐNG MŨI và đuôi vát nhẹ — thân xe không phẳng lì.
     *   3. HỐC BÁNH tối ôm quanh bánh, tách bánh khỏi thân.
     *   4. BA-ĐỜ-SỐC + gờ hông chạy dọc, cắt mảng màu lớn thành nhiều tầng.
     *
     * Vát cạnh làm bằng cách xếp nhiều tầng thóp dần rồi xoay nhẹ vài khối —
     * cùng thủ pháp mà xe của thế giới mẫu đang dùng.
     */
    parkedCar(x, z, hex)
    {
        const cyl = this.campus.cylinderGeometry
        const y = this.y
        const dark = '#2b2f36'
        const glass = '#2d3a49'

        // Tông tối hơn một chút cho phần dưới thân — xe thật bao giờ cũng vậy
        const lower = new THREE.Color(hex).multiplyScalar(0.78).getHexString()

        // ── Gầm và thân, xếp ba tầng thóp dần để cạnh trông có vát ──────────
        this.box(3.9, 0.26, 1.66, x, y + 0.30, z, `#${lower}`)
        this.box(4.15, 0.40, 1.84, x, y + 0.60, z, hex, { physical: true })
        this.box(3.95, 0.20, 1.72, x, y + 0.88, z, hex)

        // Ca-pô dốc xuống mũi, đuôi vát nhẹ lên
        this.box(1.35, 0.16, 1.66, x + 1.28, y + 0.93, z, hex, { rotationZ: -0.085 })
        this.box(1.05, 0.16, 1.66, x - 1.45, y + 0.95, z, hex, { rotationZ: 0.055 })

        // Gờ hông chạy dọc — cắt mảng màu lớn làm hai tầng
        for(const sz of [ -0.93, 0.93 ])
            this.box(3.7, 0.07, 0.06, x, y + 0.74, z + sz, `#${lower}`, { castShadow: false })

        // ── Khoang mui: HẸP hơn thân, đây là điểm mấu chốt ──────────────────
        this.box(1.95, 0.44, 1.56, x - 0.12, y + 1.20, z, hex)
        this.box(1.62, 0.12, 1.44, x - 0.14, y + 1.46, z, hex)   // nóc, thóp thêm

        // Kính chắn trước / sau nghiêng, kính hông hai bên
        this.box(0.62, 0.52, 1.5, x + 0.97, y + 1.16, z, glass, { rotationZ: -0.62, castShadow: false })
        this.box(0.5, 0.48, 1.5, x - 1.2, y + 1.16, z, glass, { rotationZ: 0.66, castShadow: false })
        for(const sz of [ -0.79, 0.79 ])
            this.box(1.75, 0.34, 0.06, x - 0.12, y + 1.22, z + sz, glass, { castShadow: false })

        // Trụ nóc mảnh giữa hai ô kính hông
        for(const sz of [ -0.8, 0.8 ])
            this.box(0.1, 0.36, 0.08, x - 0.42, y + 1.22, z + sz, hex, { castShadow: false })

        // ── Hốc bánh + bánh ─────────────────────────────────────────────────
        for(const sx of [ -1.28, 1.32 ])
        {
            for(const sz of [ -0.95, 0.95 ])
            {
                this.box(1.06, 0.5, 0.2, x + sx, y + 0.44, z + sz, dark, { castShadow: false })
                this.box(0.66, 0.66, 0.3, x + sx, y + 0.33, z + sz, '#1e1e22',
                    { geometry: cyl, rotationX: Math.PI * 0.5, castShadow: false })
                this.box(0.3, 0.3, 0.32, x + sx, y + 0.33, z + sz, '#8b8f96',
                    { geometry: cyl, rotationX: Math.PI * 0.5, castShadow: false })
            }
        }

        // ── Ba-đờ-sốc, đèn, gương ───────────────────────────────────────────
        this.box(0.34, 0.3, 1.86, x + 2.02, y + 0.5, z, dark)
        this.box(0.3, 0.28, 1.84, x - 2.04, y + 0.5, z, dark)

        for(const sz of [ -0.62, 0.62 ])
        {
            this.box(0.12, 0.19, 0.44, x + 2.06, y + 0.78, z + sz, '#ffeec2', { castShadow: false })
            this.box(0.1, 0.17, 0.42, x - 2.06, y + 0.78, z + sz, '#c33a30', { castShadow: false })
        }

        // Lưới tản nhiệt
        this.box(0.1, 0.16, 1.1, x + 2.06, y + 0.55, z, '#3a3f47', { castShadow: false })

        // Gương chiếu hậu
        for(const sz of [ -0.92, 0.92 ])
            this.box(0.24, 0.14, 0.16, x + 0.78, y + 1.16, z + sz * 1.05, dark, { castShadow: false })

        // Tay nắm cửa
        for(const sz of [ -0.94, 0.94 ])
            this.box(0.28, 0.06, 0.05, x - 0.35, y + 0.92, z + sz, `#${lower}`, { castShadow: false })
    }

    /** Khu bàn ăn ngoài trời cạnh nhà ăn — có ô che nắng. */
    setPicnicArea()
    {
        const cyl = this.campus.cylinderGeometry
        const UMBRELLA = [ '#f37021', '#00a3e0', '#a6ce39' ]

        for(let i = 0; i < 6; i++)
        {
            const x = CANTEEN.x + 9 + (i % 3) * 4.6
            const z = CANTEEN.z - 5 + Math.floor(i / 3) * 5.4
            if(this.blocked(x, z)) continue

            // Bàn tròn + bốn ghế đẩu
            this.box(0.24, 0.72, 0.24, x, this.y + 0.36, z, '#8a8578', { geometry: cyl })
            this.box(2.1, 0.12, 2.1, x, this.y + 0.76, z, '#c9a06a', { geometry: cyl, physical: true })

            for(let s = 0; s < 4; s++)
            {
                const a = s * Math.PI * 0.5 + 0.4
                this.box(0.6, 0.5, 0.6, x + Math.cos(a) * 1.75, this.y + 0.25, z + Math.sin(a) * 1.75, '#a8814e', { geometry: cyl, castShadow: false })
            }

            // Ô che: cột + tán nón
            this.box(0.14, 2.4, 0.14, x, this.y + 1.9, z, '#7c8189', { geometry: cyl })
            this.box(3.4, 0.5, 3.4, x, this.y + 3.25, z, UMBRELLA[i % 3], { geometry: this.coneGeometry() })
        }
    }

    coneGeometry()
    {
        if(!this._cone) this._cone = new THREE.ConeGeometry(0.5, 1, 10)
        return this._cone
    }
}
