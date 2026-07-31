import * as THREE from 'three/webgpu'
import { texture as textureNode } from 'three/tsl'
import { Game } from '../Game.js'
import { MeshDefaultMaterial } from '../Materials/MeshDefaultMaterial.js'
import { InteractivePoints } from '../InteractivePoints.js'
import { remapClamp } from '../utilities/maths.js'
import { ARENA, ARENA_STUNTS, PLAY_COLORS } from '../../data/playisland.js'

/**
 * SÂN BÓNG ĐÁ LÁI XE — kiểu Rocket League, trên đảo sân chơi.
 *
 * Một quả bóng Rapier động, hai khung thành, tường bao bo góc, bảng điểm vẽ
 * bằng canvas, và một sân tập kỹ năng (dốc nhảy, bập bênh, vòng lật) phía Bắc.
 *
 * ─── VÌ SAO TƯỜNG DỰNG TỪ ĐA GIÁC ───
 * Tám cạnh tường (4 cạnh thẳng + 4 góc vát 45°) đều sinh ra từ MỘT danh sách
 * đỉnh qua `wallSegment()`: hàm đó tự tính pháp tuyến, tự đẩy tường ra ngoài,
 * tự tính góc xoay. Ngồi gõ tay toạ độ và góc cho từng đoạn là cách chắc chắn
 * để hình một đằng va chạm một nẻo ở đúng bốn góc vát.
 */
export class FootballArena
{
    constructor(island)
    {
        this.game = Game.getInstance()
        this.island = island

        this.score = { west: 0, east: 0 }
        this.lastGoalTime = -999
        this.celebrating = false

        // Biên sân (mặt trong của tường)
        this.x0 = ARENA.x - ARENA.innerWidth * 0.5
        this.x1 = ARENA.x + ARENA.innerWidth * 0.5
        this.z0 = ARENA.z - ARENA.innerDepth * 0.5
        this.z1 = ARENA.z + ARENA.innerDepth * 0.5

        this.setPitch()
        this.setWalls()
        this.setGoals()
        this.setStands()
        this.setScoreboard()
        this.setBall()
        this.setStunts()
        this.setSounds()
        this.setRestartPoint()

        this.game.ticker.events.on('tick', () =>
        {
            this.update()
        }, 12)
    }

    /**
     * VÙNG CẤM ĐẶT ĐỒ — `PlayIsland.setScenery()` hỏi hàm này để không trồng
     * cây vào giữa sân hay chắn lối vào khung thành.
     */
    blocked(x, z, pad = 0)
    {
        // Sân + tường + khung thành thụt ra sau + khán đài
        const halfX = ARENA.innerWidth * 0.5 + ARENA.goal.depth + 3 + pad
        const halfZ = ARENA.innerDepth * 0.5 + 6 + pad
        if(Math.abs(x - ARENA.x) < halfX && Math.abs(z - ARENA.z) < halfZ) return true

        // Sân tập kỹ năng — trải x −54…−6 quanh tâm −30 (xem `setStunts`)
        if(Math.abs(x - ARENA_STUNTS.x) < 24 + pad && Math.abs(z - ARENA_STUNTS.z) < 12 + pad) return true

        return false
    }

    /** Tám đỉnh biên sân, theo chiều kim đồng hồ nhìn từ trên xuống. */
    corners()
    {
        const c = ARENA.cornerCut
        return [
            { x: this.x0 + c, z: this.z0 },
            { x: this.x1 - c, z: this.z0 },
            { x: this.x1, z: this.z0 + c },
            { x: this.x1, z: this.z1 - c },
            { x: this.x1 - c, z: this.z1 },
            { x: this.x0 + c, z: this.z1 },
            { x: this.x0, z: this.z1 - c },
            { x: this.x0, z: this.z0 + c },
        ]
    }

    setPitch()
    {
        const { x0, x1, z0, z1 } = this

        // Mặt cỏ + sọc xen kẽ. Sọc là tấm lát layer 1 đè lên nền layer 0 — hai
        // tấm CÙNG cao độ là ra vệt răng cưa chạy loạn khi máy quay nhúc nhích.
        this.island.slab(ARENA.innerWidth + 2, ARENA.innerDepth + 2, ARENA.x, ARENA.z, PLAY_COLORS.pitch, { friction: 0.6 })

        const stripes = 8
        const stripeWidth = ARENA.innerWidth / stripes
        for(let i = 0; i < stripes; i += 2)
            this.island.slab(stripeWidth, ARENA.innerDepth, x0 + stripeWidth * (i + 0.5), ARENA.z, PLAY_COLORS.pitchDark, { layer: 1, friction: 0.6 })

        // ── Vạch kẻ (layer 2, nằm trên cùng) ────────────────────────────────
        const L = PLAY_COLORS.line

        // Biên dọc + biên ngang
        this.island.slab(ARENA.innerWidth, 0.3, ARENA.x, z0 + 0.4, L, { layer: 2 })
        this.island.slab(ARENA.innerWidth, 0.3, ARENA.x, z1 - 0.4, L, { layer: 2 })
        this.island.slab(0.3, ARENA.innerDepth, x0 + 0.4, ARENA.z, L, { layer: 2 })
        this.island.slab(0.3, ARENA.innerDepth, x1 - 0.4, ARENA.z, L, { layer: 2 })

        // Vạch giữa sân
        this.island.slab(0.3, ARENA.innerDepth, ARENA.x, ARENA.z, L, { layer: 2 })

        // Vòng tròn giữa sân — MỘT vành khuyên, không phải một chuỗi hộp nhỏ
        const ringGeometry = new THREE.RingGeometry(4.4, 4.7, 48)
        ringGeometry.rotateX(-Math.PI * 0.5)
        this.island.box(1, 1, 1, ARENA.x, this.island.groundTop + 0.13, ARENA.z, L, { geometry: ringGeometry, castShadow: false, receiveShadow: false })

        // Chấm giữa
        const dotGeometry = new THREE.CircleGeometry(0.5, 20)
        dotGeometry.rotateX(-Math.PI * 0.5)
        this.island.box(1, 1, 1, ARENA.x, this.island.groundTop + 0.13, ARENA.z, L, { geometry: dotGeometry, castShadow: false, receiveShadow: false })

        // Vòng cấm hai đầu
        for(const side of [ -1, 1 ])
        {
            const bx = side < 0 ? x0 : x1
            const depth = 7
            this.island.slab(0.3, ARENA.goal.width + 7, bx + side * -depth, ARENA.z, L, { layer: 2 })
            this.island.slab(depth, 0.3, bx + side * -depth * 0.5, ARENA.z - (ARENA.goal.width + 7) * 0.5, L, { layer: 2 })
            this.island.slab(depth, 0.3, bx + side * -depth * 0.5, ARENA.z + (ARENA.goal.width + 7) * 0.5, L, { layer: 2 })
        }
    }

    /**
     * Dựng MỘT đoạn tường từ A đến B: tự đẩy ra ngoài theo pháp tuyến và tự
     * tính góc xoay, nên bốn góc vát 45° không thể lệch giữa hình và va chạm.
     */
    wallSegment(ax, az, bx, bz, height, thickness, hex, { yOffset = 0, physical = true } = {})
    {
        const dx = bx - ax
        const dz = bz - az
        const length = Math.hypot(dx, dz)
        if(length < 0.01) return

        const dirX = dx / length
        const dirZ = dz / length

        // Pháp tuyến — chọn chiều HƯỚNG RA XA tâm sân
        let nx = dirZ
        let nz = -dirX
        const midX = (ax + bx) * 0.5
        const midZ = (az + bz) * 0.5
        if((midX - ARENA.x) * nx + (midZ - ARENA.z) * nz < 0)
        {
            nx = -nx
            nz = -nz
        }

        /**
         * Trục X địa phương của hộp sau khi xoay quanh Y một góc θ là
         * (cos θ, 0, −sin θ). Muốn nó trùng hướng (dirX, 0, dirZ) thì
         * θ = atan2(−dirZ, dirX).
         */
        const rotationY = Math.atan2(-dirZ, dirX)

        return this.island.box(
            length, height, thickness,
            midX + nx * thickness * 0.5,
            this.island.groundTop + height * 0.5 + yOffset,
            midZ + nz * thickness * 0.5,
            hex,
            { rotationY, physical },
        )
    }

    setWalls()
    {
        const pts = this.corners()
        const t = ARENA.wallThickness
        const h = ARENA.wallHeight
        const goalHalf = ARENA.goal.width * 0.5
        const gateHalf = ARENA.gate.width * 0.5

        for(let i = 0; i < pts.length; i++)
        {
            const a = pts[i]
            const b = pts[(i + 1) % pts.length]

            // Hai cạnh Tây/Đông mang khung thành — chừa miệng khung ở giữa
            const isGoalSide = Math.abs(a.x - b.x) < 0.01 && (Math.abs(a.x - this.x0) < 0.01 || Math.abs(a.x - this.x1) < 0.01)

            // Cạnh Bắc mang CỬA CHO XE VÀO — chừa khe ở giữa
            const isEntranceSide = Math.abs(a.z - this.z0) < 0.01 && Math.abs(b.z - this.z0) < 0.01

            if(isGoalSide)
            {
                const zLow = Math.min(a.z, b.z)
                const zHigh = Math.max(a.z, b.z)
                this.wallSegment(a.x, zLow, a.x, ARENA.z - goalHalf, h, t, PLAY_COLORS.wall)
                this.wallSegment(a.x, ARENA.z + goalHalf, a.x, zHigh, h, t, PLAY_COLORS.wall)
            }
            else if(isEntranceSide)
            {
                const xLow = Math.min(a.x, b.x)
                const xHigh = Math.max(a.x, b.x)
                this.wallSegment(xLow, a.z, ARENA.x - gateHalf, a.z, h, t, PLAY_COLORS.wall)
                this.wallSegment(ARENA.x + gateHalf, a.z, xHigh, a.z, h, t, PLAY_COLORS.wall)

                /**
                 * Hai trụ cửa cho mắt đọc ra ngay "đây là lối vào".
                 * ⚠️ Đặt HẲN RA NGOÀI mép sân (z nhỏ hơn `z0`), không thì thân
                 * trụ thò vào lòng sân — bắn tia đo được nóc 3,54 ở (−33 · 138),
                 * tức một cái cột chình ình ngay sau vạch vôi.
                 */
                for(const s of [ -1, 1 ])
                    this.island.box(0.7, h + 0.9, t + 0.2, ARENA.x + s * (gateHalf + 0.35), this.island.groundTop + (h + 0.9) * 0.5, a.z - t * 0.5 - 0.35, PLAY_COLORS.wallTrim, { physical: true })
            }
            else
            {
                this.wallSegment(a.x, a.z, b.x, b.z, h, t, PLAY_COLORS.wall)
            }

            // Nẹp sẫm trên đỉnh tường — thuần trang trí, KHÔNG va chạm (thêm
            // một tầng collider chồng lên tường chỉ tổ đẻ va chạm mồ côi)
            if(isEntranceSide)
            {
                const xLow = Math.min(a.x, b.x)
                const xHigh = Math.max(a.x, b.x)
                this.wallSegment(xLow, a.z, ARENA.x - gateHalf, a.z, 0.22, t + 0.12, PLAY_COLORS.wallTrim, { yOffset: h, physical: false })
                this.wallSegment(ARENA.x + gateHalf, a.z, xHigh, a.z, 0.22, t + 0.12, PLAY_COLORS.wallTrim, { yOffset: h, physical: false })
            }
            else if(!isGoalSide)
            {
                this.wallSegment(a.x, a.z, b.x, b.z, 0.22, t + 0.12, PLAY_COLORS.wallTrim, { yOffset: h, physical: false })
            }
        }
    }

    setGoals()
    {
        const { goal } = ARENA
        const halfW = goal.width * 0.5
        const t = ARENA.wallThickness
        const g = this.island.groundTop

        this.goals = []

        for(const side of [ -1, 1 ])
        {
            const mouthX = side < 0 ? this.x0 : this.x1        // vạch vôi
            const backX = mouthX + side * goal.depth           // đáy lưới
            const hex = side < 0 ? PLAY_COLORS.goalBlue : PLAY_COLORS.goalOrange

            // Đáy lưới — kéo dài thêm hai bên để bịt kín góc với hai má
            this.island.box(t, goal.height, goal.width + t * 2, backX + side * t * 0.5, g + goal.height * 0.5, ARENA.z, hex, { physical: true })

            // Hai má lưới
            for(const s of [ -1, 1 ])
                this.island.box(goal.depth, goal.height, t, (mouthX + backX) * 0.5, g + goal.height * 0.5, ARENA.z + s * (halfW + t * 0.5), hex, { physical: true })

            // Mái lưới — bịt nóc để bóng bay bổng không lọt ra ngoài qua trên
            this.island.box(goal.depth + t, 0.3, goal.width + t * 2, (mouthX + backX) * 0.5 + side * t * 0.5, g + goal.height + 0.15, ARENA.z, hex, { physical: true })

            // Sàn lưới — mặt cỏ sẫm để nhìn ra chỗ nào là "trong khung"
            this.island.slab(goal.depth, goal.width, (mouthX + backX) * 0.5, ARENA.z, PLAY_COLORS.pitchDark, { layer: 1 })

            // Cột dọc + xà ngang ở miệng khung: mảnh (0,3) nên gần như không
            // ăn vào bề rộng miệng, mà mắt vẫn đọc ra ngay đây là khung thành
            for(const s of [ -1, 1 ])
                this.island.box(0.3, goal.height, 0.3, mouthX, g + goal.height * 0.5, ARENA.z + s * halfW, hex, { physical: true })
            this.island.box(0.3, 0.3, goal.width, mouthX, g + goal.height + 0.15, ARENA.z, hex, { physical: true })

            this.goals.push({ side, mouthX, hex })
        }
    }

    /** Khán đài ba bậc dọc hai cạnh dài — leo lên được, không có chỗ kẹt. */
    setStands()
    {
        const g = this.island.groundTop
        const length = ARENA.innerWidth - ARENA.cornerCut * 2
        const xLow = ARENA.x - length * 0.5
        const xHigh = ARENA.x + length * 0.5
        const gateHalf = ARENA.gate.width * 0.5

        const bench = (x0, x1, height, z) =>
        {
            const width = x1 - x0
            if(width < 0.5) return

            this.island.box(width, height, 1.6, (x0 + x1) * 0.5, g + height * 0.5, z, PLAY_COLORS.stand, { physical: true })

            // Ghế — hàng khối nhỏ trên mặt bậc, KHÔNG va chạm để không biến
            // mặt bậc thành mê cung hộp nhỏ mà bánh xe vướng vào
            const count = Math.max(1, Math.round(width / 2.1))
            for(let j = 0; j < count; j++)
                this.island.box(1.6, 0.35, 0.5, x0 + (j + 0.5) * (width / count), g + height + 0.18, z, PLAY_COLORS.standSeat, { physical: false, castShadow: false })
        }

        for(const side of [ -1, 1 ])
        {
            for(let i = 0; i < 3; i++)
            {
                const height = 0.55 * (i + 1)
                const z = ARENA.z + side * (ARENA.innerDepth * 0.5 + ARENA.wallThickness + 1.4 + i * 1.6)

                /**
                 * ⚠️ Khán đài BẮC phải khoét ĐÚNG khe cửa. Mở cửa trên tường mà
                 * quên khán đài thì xe vẫn bị chắn ngay trước mặt — cửa chỉ để
                 * nhìn. Cạnh Nam không có cửa nên để liền.
                 */
                if(side < 0)
                {
                    bench(xLow, ARENA.x - gateHalf, height, z)
                    bench(ARENA.x + gateHalf, xHigh, height, z)
                }
                else
                {
                    bench(xLow, xHigh, height, z)
                }
            }
        }

        // Đường dẫn từ đường ngang z = 126 vào thẳng cửa sân
        this.island.slab(ARENA.gate.width, this.z0 - 126 + 1, ARENA.x, (126 + this.z0) * 0.5, PLAY_COLORS.road)
    }

    /**
     * BẢNG ĐIỂM vẽ bằng canvas.
     *
     * Giữ tham chiếu `canvas`/`ctx`/`map` chứ không dùng `painted()` như biển
     * ở khu FPTU: bảng này phải VẼ LẠI mỗi khi có bàn thắng.
     */
    setScoreboard()
    {
        const width = 12
        const height = 5

        this.board = {}
        this.board.canvas = document.createElement('canvas')
        this.board.canvas.width = 1024
        this.board.canvas.height = Math.round(1024 * height / width)
        this.board.ctx = this.board.canvas.getContext('2d')

        this.board.map = new THREE.CanvasTexture(this.board.canvas)
        this.board.map.colorSpace = THREE.SRGBColorSpace
        this.board.map.anisotropy = 8

        const material = new MeshDefaultMaterial({ colorNode: textureNode(this.board.map) })

        /**
         * TREO trên tường Bắc, phía TRONG sân, quay mặt vào sân (+Z).
         *
         * ⚠️ Bản đầu dựng nó đứng trên hai chân đỡ ở z = 128,5 — đúng giữa lòng
         * đường z = 126. Không đặt xuống đất được: khoảng giữa mép đường (130,5)
         * và bậc khán đài ngoài cùng (130,7) chỉ hở 0,2 đơn vị. Treo lên tường
         * là hết chuyện, mà nhìn cũng đúng kiểu sân vận động hơn.
         *
         * Cả bảng lẫn cột đỡ đều KHÔNG có va chạm: chúng nằm bên trong lòng sân
         * nên cho va chạm là đẻ thêm vật cứng ngay chỗ bóng hay bay qua.
         */
        const boardZ = this.z0 + 1.4
        const boardY = this.island.groundTop + ARENA.wallHeight + height * 0.5 + 0.5

        const geometry = new THREE.PlaneGeometry(width, height)
        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.set(ARENA.x, boardY, boardZ)
        mesh.castShadow = false
        mesh.receiveShadow = true
        this.island.group.add(mesh)

        // Hai cột đỡ, chân đứng trên ĐỈNH TƯỜNG chứ không chạm đất
        for(const s of [ -1, 1 ])
            this.island.box(0.4, boardY - this.island.groundTop - ARENA.wallHeight, 0.4, ARENA.x + s * (width * 0.5 - 1), (boardY + this.island.groundTop + ARENA.wallHeight) * 0.5, boardZ + 0.35, PLAY_COLORS.wallTrim, { physical: false })

        this.drawScoreboard()
    }

    drawScoreboard()
    {
        const { ctx, canvas, map } = this.board
        const W = canvas.width
        const H = canvas.height

        ctx.clearRect(0, 0, W, H)

        // Nền
        ctx.fillStyle = '#141c26'
        ctx.fillRect(0, 0, W, H)
        ctx.strokeStyle = '#33404f'
        ctx.lineWidth = W * 0.012
        ctx.strokeRect(ctx.lineWidth * 0.5, ctx.lineWidth * 0.5, W - ctx.lineWidth, H - ctx.lineWidth)

        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        // Tiêu đề
        ctx.fillStyle = '#8fa0b4'
        ctx.font = `bold ${Math.round(H * 0.15)}px sans-serif`
        ctx.fillText('SÂN BÓNG LÁI XE', W * 0.5, H * 0.17)

        // Hai ô điểm
        const boxes = [
            { x: W * 0.26, color: PLAY_COLORS.goalBlue, label: 'XANH', value: this.score.west },
            { x: W * 0.74, color: PLAY_COLORS.goalOrange, label: 'CAM', value: this.score.east },
        ]

        for(const box of boxes)
        {
            ctx.fillStyle = box.color
            ctx.font = `bold ${Math.round(H * 0.13)}px sans-serif`
            ctx.fillText(box.label, box.x, H * 0.42)

            ctx.fillStyle = '#ffffff'
            ctx.font = `bold ${Math.round(H * 0.44)}px sans-serif`
            ctx.fillText(String(box.value), box.x, H * 0.72)
        }

        // Dấu hai chấm giữa
        ctx.fillStyle = '#5c6a7c'
        ctx.font = `bold ${Math.round(H * 0.38)}px sans-serif`
        ctx.fillText(':', W * 0.5, H * 0.7)

        map.needsUpdate = true
    }

    /**
     * QUẢ BÓNG — thân Rapier động, hình cầu có hoa văn vẽ bằng canvas.
     *
     * Ba con số đáng chú ý:
     * - `restitution` 0,82: nảy tốt mà không thành quả bóng bàn bật mãi không
     *   dừng. Tường sân để mặc định (0,15) nên va tường vẫn có chút giảm chấn.
     * - `mass` 1,1 với bán kính 1,45: nhẹ hơn xe nhiều nên húc là bay, nhưng
     *   vẫn đủ nặng để không bị hất khỏi sân chỉ vì quệt nhẹ.
     * - `linearDamping` 0,22: bóng tự chậm lại rồi dừng, khỏi lăn vô tận.
     */
    setBall()
    {
        const { radius } = ARENA.ball

        // Hoa văn: nền trắng + các mảng sẫm rải đều — đủ để mắt thấy bóng ĐANG
        // XOAY. Bóng trắng trơn nhìn như đứng yên dù đang lăn rất nhanh.
        const canvas = document.createElement('canvas')
        canvas.width = 256
        canvas.height = 128
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = '#f4f6f8'
        ctx.fillRect(0, 0, 256, 128)
        ctx.fillStyle = '#28313d'
        for(let i = 0; i < 6; i++)
        {
            for(let j = 0; j < 3; j++)
            {
                const cx = (i + (j % 2) * 0.5) * (256 / 6)
                const cy = 20 + j * 44
                ctx.beginPath()
                for(let k = 0; k < 5; k++)
                {
                    const angle = -Math.PI * 0.5 + k * Math.PI * 0.4
                    const px = cx + Math.cos(angle) * 13
                    const py = cy + Math.sin(angle) * 13
                    if(k === 0) ctx.moveTo(px, py)
                    else ctx.lineTo(px, py)
                }
                ctx.closePath()
                ctx.fill()
            }
        }

        const map = new THREE.CanvasTexture(canvas)
        map.colorSpace = THREE.SRGBColorSpace
        map.anisotropy = 4

        const mesh = new THREE.Mesh(
            new THREE.SphereGeometry(radius, 28, 20),
            new MeshDefaultMaterial({ colorNode: textureNode(map) }),
        )
        mesh.castShadow = true
        mesh.receiveShadow = true

        this.ballHome = { x: ARENA.x, y: this.island.groundTop + radius + 0.1, z: ARENA.z }

        this.ballObject = this.game.objects.add(
            {
                model: mesh,
                parent: this.game.scene,
                updateMaterials: false,
                castShadow: true,
                receiveShadow: true,
            },
            {
                type: 'dynamic',
                position: this.ballHome,
                mass: ARENA.ball.mass,
                restitution: ARENA.ball.restitution,
                friction: 0.45,
                linearDamping: ARENA.ball.linearDamping,
                angularDamping: ARENA.ball.angularDamping,
                sleeping: true,
                contactThreshold: 6,
                onCollision: (force, position) =>
                {
                    if(this.sounds.hit)
                        this.sounds.hit.play(force, position)
                },
                colliders: [ { shape: 'ball', parameters: [ radius ] } ],
            },
        )

        this.ball = {
            mesh,
            body: this.ballObject.physical.body,
            position: new THREE.Vector3().copy(this.ballHome),
            speed: 0,
        }
    }

    resetBall(hard = true)
    {
        const body = this.ball.body
        body.setTranslation(this.ballHome, true)
        body.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true)
        body.setLinvel({ x: 0, y: 0, z: 0 }, true)
        body.setAngvel({ x: 0, y: 0, z: 0 }, true)
        body.resetForces(true)
        body.resetTorques(true)

        this.ballObject.needsUpdate = true

        if(hard)
        {
            // Ngủ ở nhịp SAU. Gọi `sleep()` ngay trong cùng nhịp với `setTranslation`
            // thì Rapier còn đang giữ tham chiếu vào thân đó — đúng kiểu gọi đã
            // ném "recursive use of an object" ở `FptuDestruction.reset()`.
            this.game.ticker.wait(2, () =>
            {
                try { this.ball.body.sleep() } catch(error) { /* thân đã bị dọn */ }
            })
        }
    }

    /**
     * SÂN TẬP KỸ NĂNG phía Bắc: hai dốc nhảy, một bập bênh, một vòng lật.
     *
     * ⚠️ Dốc KHÔNG ghép từ hộp nghiêng chồng lên nhau — đó là nguồn gốc của mọi
     * chỗ "xe kẹt" ở khu FPTU. Mỗi dốc ở đây là MỘT hộp nghiêng duy nhất, chân
     * dốc CẮM XUỐNG DƯỚI mặt đất nên mép tiếp đất không tạo bậc.
     */
    setStunts()
    {
        const g = this.island.groundTop
        const { x, z } = ARENA_STUNTS

        /**
         * ⚠️ MỌI THỨ Ở ĐÂY ĐỀU NẰM TRÊN CÙNG MỘT DẢI z, chỉ dàn theo trục X.
         *
         * Bản đầu đặt bập bênh ở `z + 16`, mà `ARENA_STUNTS.z` là 119 ⇒ ra đúng
         * z = 135, tức BIÊN BẮC CỦA SÂN BÓNG: hai tấm nghiêng cao 1,32 nằm chềnh
         * ềnh trong lòng sân. Bắn tia mới lộ ra, mắt nhìn ảnh chụp không thấy.
         * Dàn theo X thì không thể lấn sang sân bóng được nữa.
         *
         * Chiếm chỗ theo X (với tâm x = −29): vòng lật −50…−40 · hai dốc
         * −38,5…−19,5 · bập bênh −20…−8. Mép đường trục ở x = −4,5 nên vẫn còn
         * 3,5 đơn vị đệm, và chân đỡ vòng lật xa nhất (−50) vẫn nằm trong đất
         * (`shapeDistance` = 0,955 < 1).
         */

        // ── Hai dốc nhảy, quay lưng vào nhau ────────────────────────────────
        for(const side of [ -1, 1 ])
        {
            const angle = side * 0.34   // ~19,5° — đủ bốc mà xe không lật ngửa
            const length = 9
            const cx = x + side * 5

            /**
             * Hộp nghiêng dài 9, dày 1,2. Tâm hạ xuống sao cho MÉP THẤP chìm
             * dưới mặt đất: nửa chiều dài × sin(góc) là độ chênh hai đầu, trừ
             * thêm nửa bề dày. Không làm thế thì mép thấp nhô lên thành bậc
             * 15–20 phân ngay giữa đường lấy đà.
             */
            const drop = Math.sin(Math.abs(angle)) * length * 0.5
            this.island.box(length, 1.2, 7, cx, g + drop - 0.62, z, PLAY_COLORS.stunt, { rotationZ: angle, physical: true })
        }

        // ── Bập bênh: hai tấm chụm trên một trục lăn ────────────────────────
        // Trục và tấm đều CỐ ĐỊNH (không phải bản lề động): bản lề động ở đây
        // chỉ tổ hất xe lung tung, mà cái đáng chơi là cú lấy đà lên đỉnh.
        const seesawX = x + 15

        /**
         * ⚠️ Hình trụ của `cylinderGeometry` DÀI THEO TRỤC Y. Muốn nó nằm ngang
         * thì chiều dài phải truyền vào tham số `height` rồi mới xoay, chứ không
         * phải vào `depth`. Bản đầu truyền `box(1,1 · 1,1 · 8)` nên sau khi xoay
         * X 90° cái trục lăn hoá thành CỘT CAO 8 ĐƠN VỊ đâm lên trời — bắn tia
         * đo được nóc ở 4,59 giữa sân.
         */
        this.island.box(1.1, 8, 1.1, seesawX, g + 0.55, z, PLAY_COLORS.stuntDark, { geometry: this.island.cylinderGeometry, rotationX: Math.PI * 0.5, physical: true })

        for(const side of [ -1, 1 ])
        {
            const angle = side * 0.16
            const length = 6
            const drop = Math.sin(Math.abs(angle)) * length * 0.5
            this.island.box(length, 0.5, 7, seesawX + side * (length * 0.5 - 0.2), g + 1.05 - drop, z, PLAY_COLORS.stunt, { rotationZ: -angle, physical: true })
        }

        // ── Vòng lật: một vành đứng để lái xuyên qua ─────────────────────────
        // Vành KHÔNG có va chạm — xe ở đây không đủ tốc để bám ly tâm, nên nó
        // là cái cổng để lái xuyên chứ không phải đường chạy. Chỉ hai chân đỡ
        // là vật cứng, và chúng cách nhau 10 nên xe chui lọt thoải mái.
        const ringRadius = 5
        const ringX = x - 16
        const segments = 24
        for(let i = 0; i < segments; i++)
        {
            const angle = (i / segments) * Math.PI * 2
            if(Math.sin(angle) < -0.55) continue

            const px = ringX + Math.cos(angle) * ringRadius
            const py = g + ringRadius + 0.6 + Math.sin(angle) * ringRadius
            const width = (Math.PI * 2 * ringRadius) / segments + 0.35

            this.island.box(width, 0.7, 4.5, px, py, z, PLAY_COLORS.stunt, { rotationZ: angle + Math.PI * 0.5, physical: false })
        }

        for(const s of [ -1, 1 ])
            this.island.box(0.9, ringRadius + 0.6, 0.9, ringX + s * ringRadius, g + (ringRadius + 0.6) * 0.5, z + s * 2.6, PLAY_COLORS.stuntDark, { physical: true })
    }

    setSounds()
    {
        this.sounds = {}

        /**
         * ⚠️ Đăng ký phải theo ĐÚNG khuôn của `ExplosiveCrates`/`BowlingArea`,
         * kể cả `positions`, `distanceFade` và `onPlay` — thiếu `onPlay` thì
         * gọi `play(lực, toạ độ)` không kêu gì cả, im lặng hoàn toàn.
         */
        this.sounds.hit = this.game.audio.register({
            path: 'sounds/hits/pins/ComedyCrash 6115_16_4.mp3',
            autoplay: false,
            volume: 0.4,
            antiSpam: 0.06,
            positions: new THREE.Vector3(),
            distanceFade: 40,
            onPlay: (item, force, position) =>
            {
                item.positions[0].copy(position)
                const ratio = remapClamp(force, 3, 14, 0, 1)
                item.volume = 0.15 + ratio * 0.45
                item.rate = 1.35 - ratio * 0.35
            },
        })
    }

    setRestartPoint()
    {
        // Đặt ở góc Đông-Bắc ngoài sân, ngay mép đường vào (z = 126) và lệch
        // khỏi dải khán đài (x −42,5…−17,5) — lái ngang là gặp, khỏi phải tìm.
        this.restartPoint = this.game.interactivePoints.create(
            new THREE.Vector3(ARENA.x + ARENA.innerWidth * 0.5 + 3, this.island.groundTop + 1.4, ARENA.z - ARENA.innerDepth * 0.5 - 6),
            'Đặt lại tỉ số',
            InteractivePoints.ALIGN_RIGHT,
            InteractivePoints.STATE_CONCEALED,
            () =>
            {
                this.score.west = 0
                this.score.east = 0
                this.drawScoreboard()
                this.resetBall()

                const sound = this.game.audio.groups.get('click')
                if(sound)
                    sound.play(true)
            },
            () => { this.game.inputs.interactiveButtons.addItems(['interact']) },
            () => { this.game.inputs.interactiveButtons.removeItems(['interact']) },
            () => { this.game.inputs.interactiveButtons.removeItems(['interact']) },
        )
    }

    scoreGoal(side)
    {
        // `side` là phía KHUNG bị thủng ⇒ điểm thuộc về đội kia
        if(side < 0) this.score.east++
        else this.score.west++

        this.lastGoalTime = this.game.ticker.elapsedScaled
        this.drawScoreboard()

        const at = new THREE.Vector3().copy(this.ball.body.translation())

        if(this.game.world.confetti)
        {
            this.game.world.confetti.pop(at.clone())
            this.game.world.confetti.pop(new THREE.Vector3(ARENA.x, this.island.groundTop + 2, ARENA.z))
        }

        if(this.game.achievements?.sounds?.achieve)
            this.game.achievements.sounds.achieve.play()

        // ⚠️ API là `show(html, type, duration, …)` — KHÔNG phải `add({…})`.
        this.game.notifications.show(
            /* html */`<div class="title">VÀO!</div><div class="description">Xanh ${this.score.west} — ${this.score.east} Cam</div>`,
            '',
            2.5,
        )

        this.resetBall()
    }

    update()
    {
        if(!this.ball) return

        const p = this.ball.body.translation()

        // Bóng rơi khỏi đảo hoặc bị hất bay xa khỏi sân ⇒ đưa về giữa sân.
        // (Rơi xuống dưới mực nước thì `Objects.update()` cũng tự reset, nhưng
        // nó trả về vị trí ban đầu chứ không đánh thức bảng điểm — cứ chủ động.)
        const outOfBounds =
            Math.abs(p.x - ARENA.x) > ARENA.innerWidth * 0.5 + ARENA.goal.depth + 14 ||
            Math.abs(p.z - ARENA.z) > ARENA.innerDepth * 0.5 + 16 ||
            p.y < this.island.groundTop - 1.2

        if(outOfBounds)
        {
            this.resetBall()
            return
        }

        // ── Bàn thắng ───────────────────────────────────────────────────────
        // Chỉ tính khi bóng đã qua HẲN vạch vôi (trừ bán kính) và còn trong
        // miệng khung theo cả z lẫn y — bóng bay trên nóc lưới không phải bàn.
        const goalHalf = ARENA.goal.width * 0.5
        const inMouth = Math.abs(p.z - ARENA.z) < goalHalf && p.y < ARENA.goal.height

        if(inMouth && this.game.ticker.elapsedScaled - this.lastGoalTime > 1.5)
        {
            if(p.x < this.x0 - ARENA.ball.radius * 0.5)
                this.scoreGoal(-1)
            else if(p.x > this.x1 + ARENA.ball.radius * 0.5)
                this.scoreGoal(1)
        }
    }
}
