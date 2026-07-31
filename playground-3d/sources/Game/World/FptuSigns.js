import * as THREE from 'three/webgpu'
import { texture as textureNode } from 'three/tsl'
import { Game } from '../Game.js'
import { MeshDefaultMaterial } from '../Materials/MeshDefaultMaterial.js'
import { COLORS, GATE, RANKING_SIGN, SIGN } from '../../data/fptu.js'

/**
 * BIỂN BẢNG CỦA TRƯỜNG — biển xếp hạng Times Higher Education ở cổng, và cái
 * BỆ kê hàng chữ FPT UNIVERSITY.
 *
 * ─── VÌ SAO VẼ BẰNG CANVAS ───
 * Nội dung hai tấm biển là CHỮ và LOGO. Đắp bằng khối hộp thì ra đúng thứ user
 * chụp ảnh chê: mấy ô màu vô nghĩa xếp cạnh nhau. Vẽ lên canvas rồi dán làm
 * vân bề mặt thì đọc được thật, sắc nét ở mọi khoảng cách, và không phải thêm
 * tệp ảnh nào vào kho (bản dựng vẫn tái lập được y hệt).
 *
 * Bố cục biển chép theo đúng ảnh thật user gửi: nền trắng, bên trái là logo
 * THE + "Times Higher Education / Impact Rankings 2025" + thanh cầu vồng +
 * "FPT UNIVERSITY"; bên phải ba ô xếp hạng đen / hồng / đỏ. Cả tấm gắn trên
 * một mảng tường ĐÁ ONG nâu vàng đúng như ngoài cổng trường.
 */

export class FptuSigns
{
    constructor(campus)
    {
        this.game = Game.getInstance()
        this.campus = campus
        this.y = campus.groundTop

        this.setRankingSign()
        this.setGateSign()
        this.setSignPlinth()
    }

    box(...args) { return this.campus.box(...args) }

    /** Vẽ lên canvas rồi trả về vật liệu dán được. `draw(ctx, w, h)`. */
    painted(width, height, draw)
    {
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        draw(ctx, width, height)

        const map = new THREE.CanvasTexture(canvas)
        map.colorSpace = THREE.SRGBColorSpace
        map.anisotropy = 8
        map.needsUpdate = true

        return new MeshDefaultMaterial({ colorNode: textureNode(map) })
    }

    /** Chữ căn giữa, tự co lại nếu tràn bề ngang cho trước. */
    fitText(ctx, text, x, y, maxWidth, font, color, align = 'left')
    {
        ctx.font = font
        ctx.fillStyle = color
        ctx.textAlign = align
        ctx.textBaseline = 'middle'

        /**
         * ⚠️ Cỡ chữ phải BÓC RA TỪ "…NNpx…", không dùng `parseInt(font)`.
         * Chuỗi font ở đây thường bắt đầu bằng "bold " nên `parseInt` trả về
         * NaN, vòng lặp không chạy lần nào và chữ KHÔNG BAO GIỜ co lại — đúng
         * lỗi thấy trong ảnh: "FPT UNIVERSITY" tràn sang đè lên ba ô xếp hạng.
         */
        const match = font.match(/(\d+(?:\.\d+)?)px/)
        let size = match ? parseFloat(match[1]) : 16

        while(ctx.measureText(text).width > maxWidth && size > 6)
        {
            size -= 1
            ctx.font = font.replace(/(\d+(?:\.\d+)?)px/, `${size}px`)
        }

        ctx.fillText(text, x, y)
    }

    /** Hộp bo góc — dùng cho ba ô xếp hạng. */
    roundRect(ctx, x, y, w, h, r, fill)
    {
        ctx.beginPath()
        ctx.moveTo(x + r, y)
        ctx.arcTo(x + w, y, x + w, y + h, r)
        ctx.arcTo(x + w, y + h, x, y + h, r)
        ctx.arcTo(x, y + h, x, y, r)
        ctx.arcTo(x, y, x + w, y, r)
        ctx.closePath()
        ctx.fillStyle = fill
        ctx.fill()
    }

    /** Logo Times Higher Education: mấy vòng lục giác lồng nhau, nhiều màu. */
    theLogo(ctx, cx, cy, radius)
    {
        const hexes = [
            { r: 1.0, color: '#f2a63b' }, { r: 0.84, color: '#e5484d' },
            { r: 0.68, color: '#c13a8f' }, { r: 0.52, color: '#5b5bd6' },
            { r: 0.36, color: '#3aa8c1' }, { r: 0.2, color: '#5cbf6a' },
        ]

        ctx.lineWidth = Math.max(2, radius * 0.13)
        ctx.lineJoin = 'round'

        for(const hex of hexes)
        {
            const r = radius * hex.r
            ctx.beginPath()
            for(let i = 0; i < 6; i++)
            {
                const a = (i / 6) * Math.PI * 2 - Math.PI / 2
                const px = cx + Math.cos(a) * r
                const py = cy + Math.sin(a) * r
                if(i === 0) ctx.moveTo(px, py)
                else ctx.lineTo(px, py)
            }
            ctx.closePath()
            ctx.strokeStyle = hex.color
            ctx.stroke()
        }
    }

    /** Mặt biển xếp hạng, vẽ theo đúng ảnh thật. */
    drawRankingBoard(ctx, W, H)
    {
        // Nền trắng + viền kim loại mảnh
        ctx.fillStyle = '#f7f7f5'
        ctx.fillRect(0, 0, W, H)
        ctx.strokeStyle = '#b9b6ae'
        ctx.lineWidth = W * 0.008
        ctx.strokeRect(ctx.lineWidth * 0.5, ctx.lineWidth * 0.5, W - ctx.lineWidth, H - ctx.lineWidth)

        const pad = W * 0.035
        const leftW = W * 0.56

        // ── Bên trái: logo + tên bảng xếp hạng ──────────────────────────────
        const logoR = H * 0.16
        this.theLogo(ctx, pad + logoR, H * 0.24, logoR)

        const tx = pad + logoR * 2 + W * 0.02
        this.fitText(ctx, 'Times Higher Education', tx, H * 0.17, leftW - (tx - pad) - pad, `${Math.round(H * 0.085)}px sans-serif`, '#3d3d3f')
        this.fitText(ctx, 'Impact Rankings 2025', tx, H * 0.32, leftW - (tx - pad) - pad, `bold ${Math.round(H * 0.145)}px sans-serif`, '#17171a')

        // Thanh cầu vồng ngăn cách
        const barY = H * 0.48
        const barW = leftW - pad * 2
        const grad = ctx.createLinearGradient(pad, 0, pad + barW, 0)
        for(const [ stop, color ] of [ [ 0, '#5cbf6a' ], [ 0.2, '#3aa8c1' ], [ 0.4, '#5b5bd6' ], [ 0.6, '#c13a8f' ], [ 0.8, '#e5484d' ], [ 1, '#f2a63b' ] ])
            grad.addColorStop(stop, color)
        ctx.fillStyle = grad
        ctx.fillRect(pad, barY, barW, H * 0.035)

        // Tên trường — chữ lớn nhất trên biển
        this.fitText(ctx, 'FPT UNIVERSITY', pad, H * 0.75, barW, `bold ${Math.round(H * 0.22)}px sans-serif`, '#17171a')

        // ── Bên phải: ba ô xếp hạng ─────────────────────────────────────────
        const bx = leftW + W * 0.01
        const bw = W - bx - pad
        const rows = [
            { fill: '#1b1b1e', big: 'RANKED 301-400', small: null },
            { fill: '#d81b74', big: 'RANKED =80th', small: 'FOR SDG8: DECENT WORK AND ECONOMIC GROWTH' },
            { fill: '#e0301e', big: 'RANKED 101-200', small: 'FOR SDG4: QUALITY EDUCATION' },
        ]

        const gap = H * 0.035
        const bh = (H - pad * 2 - gap * 2) / 3

        rows.forEach((row, i) =>
        {
            const by = pad + i * (bh + gap)
            this.roundRect(ctx, bx, by, bw, bh, H * 0.035, row.fill)

            const ipad = bw * 0.05
            if(row.small)
            {
                this.fitText(ctx, row.big, bx + ipad, by + bh * 0.35, bw - ipad * 2, `bold ${Math.round(H * 0.115)}px sans-serif`, '#ffffff')
                // Dòng phụ có thể dài — tách hai dòng cho khỏi bé quá
                const words = row.small.split(' ')
                const half = Math.ceil(words.length / 2)
                this.fitText(ctx, words.slice(0, half).join(' '), bx + ipad, by + bh * 0.66, bw - ipad * 2, `${Math.round(H * 0.052)}px sans-serif`, '#ffffff')
                this.fitText(ctx, words.slice(half).join(' '), bx + ipad, by + bh * 0.84, bw - ipad * 2, `${Math.round(H * 0.052)}px sans-serif`, '#ffffff')
            }
            else
            {
                this.fitText(ctx, row.big, bx + ipad, by + bh * 0.5, bw - ipad * 2, `bold ${Math.round(H * 0.13)}px sans-serif`, '#ffffff')
            }
        })
    }

    /**
     * BIỂN XẾP HẠNG: mảng tường đá ong + tấm biển trắng gắn lên mặt trước.
     *
     * Bản trước là mấy khối màu xếp cạnh nhau, không đọc ra chữ gì — đúng thứ
     * user chụp ảnh chê. Vị trí cũng đã DỜI sang phía bên kia trục đường theo
     * yêu cầu (xem `RANKING_SIGN.z` trong data/fptu.js).
     */
    setRankingSign()
    {
        const { x, z, height, width } = RANKING_SIGN

        // Mặt biển quay về phía cổng (+X), nên tường nằm dọc trục z
        const wallW = 1.5
        const wallH = height + 0.9
        const wallD = width + 2.4

        // Thân tường đá ong: vài khối lệch nhau chút cho mặt tường gồ ghề
        this.box(wallW, wallH, wallD, x, this.y + wallH * 0.5, z, '#a8763f', { physical: true })
        for(let i = 0; i < 7; i++)
        {
            const t = (i + 0.5) / 7
            const jz = z - wallD * 0.5 + t * wallD
            const jy = this.y + 0.35 + ((i * 37) % 5) * 0.32
            this.box(wallW + 0.14, 0.42, wallD / 7 * 0.92, x, jy, jz,
                i % 2 ? '#9c6b37' : '#b3813f', { castShadow: false })
        }

        // Mũ tường + chân bệ
        this.box(wallW + 0.3, 0.22, wallD + 0.3, x, this.y + wallH + 0.11, z, '#8d7f68')
        this.box(wallW + 0.4, 0.3, wallD + 0.4, x, this.y + 0.15, z, '#7c6f5a')

        // Tấm biển: khung viền + mặt vẽ
        const boardH = height
        const boardW = width
        const boardY = this.y + wallH * 0.52

        this.box(0.12, boardH + 0.16, boardW + 0.16, x + wallW * 0.5 + 0.02, boardY, z, '#d9d5cc')

        const board = new THREE.Mesh(
            new THREE.PlaneGeometry(boardW, boardH),
            this.painted(1400, Math.round(1400 * boardH / boardW), (ctx, W, H) => this.drawRankingBoard(ctx, W, H)),
        )
        board.position.set(x + wallW * 0.5 + 0.1, boardY, z)
        // Mặt phẳng mặc định nhìn về +Z; xoay để nhìn về +X (phía cổng)
        board.rotation.y = Math.PI * 0.5
        board.castShadow = false
        board.receiveShadow = true
        this.campus.group.add(board)

        // Bụi hoa tím dưới chân biển như ảnh thật
        for(let i = 0; i < 14; i++)
        {
            const t = (i + 0.5) / 14
            this.campus.canopy(x + wallW * 0.5 + 0.9, this.y + 0.2, z - wallD * 0.5 + t * wallD, 0.42)
        }
    }


    /** Nền đá ong: khối gạch thô nhiều sắc nâu vàng, đúng tường trước cổng. */
    laterite(ctx, W, H)
    {
        ctx.fillStyle = '#a8763f'
        ctx.fillRect(0, 0, W, H)

        const rows = 9
        const bh = H / rows
        for(let r = 0; r < rows; r++)
        {
            const cols = 7
            const bw = W / cols
            const offset = (r % 2) * bw * 0.5
            for(let c = -1; c <= cols; c++)
            {
                const seed = r * 31 + c * 17
                const t = (Math.sin(seed) * 43758.5453) % 1
                const shade = 0.86 + Math.abs(t) * 0.3
                const base = [ 168, 118, 63 ]
                ctx.fillStyle = `rgb(${Math.min(255, base[0] * shade) | 0}, ${Math.min(255, base[1] * shade) | 0}, ${Math.min(255, base[2] * shade) | 0})`
                ctx.fillRect(c * bw + offset + 1.5, r * bh + 1.5, bw - 3, bh - 3)
            }
        }
    }

    /** Chữ FPT: ba hình bình hành nghiêng, mỗi chữ một màu như logo thật. */
    fptLogo(ctx, x, y, w, h)
    {
        const letters = [
            { ch: 'F', color: '#0b57a4' },
            { ch: 'P', color: '#f37021' },
            { ch: 'T', color: '#00954c' },
        ]
        const lw = w / 3.35
        const gap = lw * 0.12
        const skew = -0.26

        letters.forEach((letter, i) =>
        {
            const lx = x + i * (lw + gap)

            ctx.save()
            ctx.transform(1, 0, skew, 1, -skew * (y + h), 0)
            ctx.fillStyle = letter.color
            this.roundRect(ctx, lx, y, lw, h, h * 0.1, letter.color)

            ctx.fillStyle = '#ffffff'
            ctx.font = `bold ${Math.round(h * 0.78)}px sans-serif`
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText(letter.ch, lx + lw * 0.5, y + h * 0.54)
            ctx.restore()
        })
    }

    /** Ngôi sao tám cánh màu vàng của bảng QS Stars. */
    goldStar(ctx, cx, cy, r)
    {
        ctx.fillStyle = '#e8b53a'
        ctx.beginPath()
        for(let i = 0; i < 16; i++)
        {
            const a = (i / 16) * Math.PI * 2 - Math.PI / 2
            const rr = i % 2 === 0 ? r : r * 0.44
            const px = cx + Math.cos(a) * rr
            const py = cy + Math.sin(a) * rr
            if(i === 0) ctx.moveTo(px, py)
            else ctx.lineTo(px, py)
        }
        ctx.closePath()
        ctx.fill()
    }

    /** Mặt biển đá trước cổng: nền đá ong + logo FPT + bảng QS Stars. */
    drawGateBoard(ctx, W, H)
    {
        this.laterite(ctx, W, H)

        // ── Nửa trái: logo FPT + tên trường ─────────────────────────────────
        const lx = W * 0.06
        this.fptLogo(ctx, lx, H * 0.24, W * 0.3, H * 0.34)
        this.fitText(ctx, 'Fpt University', lx + W * 0.01, H * 0.74, W * 0.32,
            `${Math.round(H * 0.13)}px sans-serif`, '#f0ece2')

        // ── Nửa phải: bảng QS STARS nền đen ─────────────────────────────────
        const px = W * 0.46
        const pw = W * 0.48
        const py = H * 0.13
        const ph = H * 0.74

        ctx.fillStyle = '#c9c4b6'
        ctx.fillRect(px - 4, py - 4, pw + 8, ph + 8)
        ctx.fillStyle = '#131313'
        ctx.fillRect(px, py, pw, ph)

        // Dòng QS STARS — logo vuông vàng + chữ chân có chân
        const qs = ph * 0.2
        ctx.fillStyle = '#c9a227'
        this.roundRect(ctx, px + pw * 0.06, py + ph * 0.1, qs, qs, qs * 0.16, '#c9a227')
        ctx.fillStyle = '#131313'
        ctx.font = `bold ${Math.round(qs * 0.5)}px serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('QS', px + pw * 0.06 + qs * 0.5, py + ph * 0.1 + qs * 0.52)

        this.fitText(ctx, 'STARS', px + pw * 0.06 + qs * 1.25, py + ph * 0.21, pw * 0.6,
            `bold ${Math.round(ph * 0.27)}px serif`, '#f4f1e8')

        ctx.letterSpacing = `${Math.round(ph * 0.04)}px`
        this.fitText(ctx, 'RATED FOR EXCELLENCE', px + pw * 0.06, py + ph * 0.42, pw * 0.88,
            `${Math.round(ph * 0.13)}px serif`, '#efece2')
        ctx.letterSpacing = '0px'

        // Dải vàng ghi năm
        const bandY = py + ph * 0.53
        ctx.fillStyle = '#e0aa2a'
        ctx.fillRect(px + pw * 0.05, bandY, pw * 0.9, ph * 0.16)
        this.fitText(ctx, '2012', px + pw * 0.5, bandY + ph * 0.08, pw * 0.5,
            `bold ${Math.round(ph * 0.12)}px serif`, '#151515', 'center')

        // Ba sao vàng trên nền đen
        const starY = py + ph * 0.83
        for(let i = 0; i < 3; i++)
            this.goldStar(ctx, px + pw * (0.34 + i * 0.16), starY, ph * 0.11)
    }

    /**
     * BIỂN ĐÁ TRƯỚC CỔNG — tường đá ong có logo FPT và bảng QS Stars.
     *
     * Bản trước là ba khối màu xanh–vàng–cam gắn lên một tấm nâu, không ra chữ
     * gì cả; user chụp ảnh chê và gửi kèm ảnh thật để làm theo.
     */
    setGateSign()
    {
        /**
         * Đứng trên BẬC SẢNH GIỮA, nửa phía Nam, cạnh biển xếp hạng — đúng ảnh
         * mặt trước trường (hai tấm biển cùng nằm ở ô giữa).
         *
         * Bản trước đặt ở z ≈ 50 và nó CHẮN NGANG lối vào cổng Bắc: lái thử
         * ngày 31/7, xe đi được 1,4 đơn vị rồi đứng.
         */
        const x = GATE.x + 0.8
        const z = GATE.z - 5
        const wallW = 0.75
        const wallH = 2.5
        const wallD = 6.6

        // Khối tường + mũ tường + chân bệ
        this.box(wallW, wallH, wallD, x, this.y + wallH * 0.5, z, '#a8763f', { physical: true })
        this.box(wallW + 0.22, 0.18, wallD + 0.22, x, this.y + wallH + 0.09, z, '#8d7f68')
        this.box(wallW + 0.3, 0.24, wallD + 0.3, x, this.y + 0.12, z, '#7c6f5a')

        // Mặt biển vẽ sẵn, quay về phía cầu (+X) — chỗ người chơi đi tới
        const board = new THREE.Mesh(
            new THREE.PlaneGeometry(wallD * 0.94, wallH * 0.82),
            this.painted(1600, Math.round(1600 * (wallH * 0.82) / (wallD * 0.94)), (ctx, W, H) => this.drawGateBoard(ctx, W, H)),
        )
        board.position.set(x + wallW * 0.5 + 0.03, this.y + wallH * 0.52, z)
        board.rotation.y = Math.PI * 0.5
        board.castShadow = false
        board.receiveShadow = true
        this.campus.group.add(board)

        // Thảm cỏ và bụi hoa dưới chân tường như ảnh thật
        for(let i = 0; i < 16; i++)
        {
            const t = (i + 0.5) / 16
            this.campus.canopy(x + wallW * 0.5 + 0.85, this.y + 0.2, z - wallD * 0.5 + t * wallD, 0.45)
        }
    }

    /** Chữ nhỏ trên mặt bệ: "CAMPUS HA NOI". */
    drawPlinthText(ctx, W, H)
    {
        ctx.fillStyle = '#f2f0ea'
        ctx.fillRect(0, 0, W, H)

        // Gờ chỉ mảnh trên và dưới cho mặt bệ có chiều sâu
        ctx.fillStyle = '#dcd8cf'
        ctx.fillRect(0, 0, W, H * 0.06)
        ctx.fillRect(0, H * 0.94, W, H * 0.06)

        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = '#4a4a4f'
        ctx.font = `bold ${Math.round(H * 0.42)}px sans-serif`
        ctx.letterSpacing = `${Math.round(H * 0.12)}px`
        ctx.fillText('CAMPUS HA NOI', W * 0.5, H * 0.54)
    }

    /**
     * BỆ KÊ HÀNG CHỮ — theo đúng ảnh user gửi (cơ sở Quy Nhơn): cụm chữ 3D cam
     * đứng trên một bệ dài màu trắng, mặt bệ có dòng chữ nhỏ tên cơ sở.
     *
     * Trước đó chữ nằm thẳng trên mặt cỏ nên trông như bị vứt xuống đất.
     */
    setSignPlinth()
    {
        // Bề dài chữ gốc 12,53 (đo lúc xuất glb) nhân hệ số phóng
        const textW = 12.53 * SIGN.scale
        const w = textW + 2.2   // theo chiều DÀI của cụm chữ
        const h = 0.92
        const d = 1.7           // theo chiều DÀY của bệ

        const x = SIGN.x
        const z = SIGN.z

        /**
         * Bệ phải xoay theo đúng hướng cụm chữ, nếu không chữ quay một đằng bệ
         * nằm một nẻo. Suy hai vector từ `SIGN.rotationY`: `along` là chiều dài
         * (trục X cục bộ), `front` là mặt trước (trục Z cục bộ).
         */
        const ry = SIGN.rotationY
        const along = { x: Math.cos(ry), z: -Math.sin(ry) }
        const front = { x: Math.sin(ry), z: Math.cos(ry) }

        // Kích thước theo trục thế giới, suy từ hai vector trên
        const sx = Math.abs(along.x) * w + Math.abs(front.x) * d
        const sz = Math.abs(along.z) * w + Math.abs(front.z) * d
        const gx = Math.abs(along.x) * 0.24 + Math.abs(front.x) * 0.24
        const gz = Math.abs(along.z) * 0.24 + Math.abs(front.z) * 0.24

        this.box(sx, h, sz, x, this.y + h * 0.5, z, '#f2f0ea', { physical: true })
        this.box(sx + gx, 0.14, sz + gz, x, this.y + h + 0.07, z, '#e2ded4')
        this.box(sx + gx * 1.4, 0.18, sz + gz * 1.4, x, this.y + 0.09, z, '#d6d2c8')

        // Mặt trước bệ có dòng CAMPUS HA NOI, quay cùng hướng với cụm chữ
        const face = new THREE.Mesh(
            new THREE.PlaneGeometry(w * 0.92, h * 0.62),
            this.painted(1600, Math.round(1600 * (h * 0.62) / (w * 0.92)), (ctx, W, H) => this.drawPlinthText(ctx, W, H)),
        )
        face.position.set(x + front.x * (d * 0.5 + 0.03), this.y + h * 0.52, z + front.z * (d * 0.5 + 0.03))
        face.rotation.y = ry
        face.castShadow = false
        face.receiveShadow = true
        this.campus.group.add(face)

        this.plinthTop = this.y + h + 0.14
    }
}
