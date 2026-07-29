/**
 * Sinh 6 ảnh nhãn cho khu Sự nghiệp.
 *
 * Định dạng ảnh KHÔNG phải màu thật mà là hai kênh mặt nạ — đọc từ
 * CareerArea.js:114-119:
 *     alpha      = step(0.1, max(color.r, color.g))
 *     finalColor = mix(maskColor, emissiveColor, color.r)
 * => kênh XANH (0,255,0) = khối nền của nhãn
 * => kênh ĐỎ  (255,0,0) = chữ, phần này được tô màu phát sáng
 * => R=G=0 (đen) = trong suốt
 * Vẽ bằng màu thật là nhãn ra sai hết.
 *
 * GIỮ NGUYÊN kích thước từng file: UV trên lưới trong areas.glb đã cố định,
 * đổi tỉ lệ ảnh là chữ bị kéo méo.
 */
import sharp from 'sharp'
import path from 'path'

const OUT = 'static/career'

// Kích thước đo từ chính file gốc. Cao 60 = 2 dòng, cao 92 = 3 dòng.
const LABELS = [
    { file: 'careerIRLTeacher',       w: 268, h: 92, lines: [ 'HONOURS STUDENT', 'FPT UNIVERSITY', '3 SEMESTERS' ] },
    { file: 'careerOnlineTeacher',    w: 332, h: 92, lines: [ 'COURSE AUTHOR', 'FULL TYPESCRIPT', '+200 STUDENTS' ] },
    { file: 'careerFreelancer',       w: 240, h: 60, lines: [ 'FULL-STACK DEV', 'NODE.JS + TS' ] },
    { file: 'careerHetic',            w: 316, h: 60, lines: [ 'IELTS 6.5', 'ENGLISH PROFICIENCY' ] },
    { file: 'careerImmersiveGarden',  w: 340, h: 60, lines: [ 'NEXT GOAL', 'OPEN-SOURCE MAINTAINER' ] },
    { file: 'careerUzik',             w: 168, h: 60, lines: [ 'NEXT GOAL', 'AI ENGINEER' ] },
]

const FONT = 'Helvetica, Arial, sans-serif'

function svgFor({ w, h, lines }) {
    const n = lines.length
    const lineH = h / n
    // Cỡ chữ theo chiều cao dòng; dòng đầu là tiêu đề nên to và đậm hơn.
    const body = Math.round(lineH * 0.62)
    const head = Math.round(lineH * 0.74)

    const parts = lines.map((text, i) => {
        const isHead = i === 0
        const size = isHead ? head : body
        const y = lineH * i
        // Khối nền xanh phủ trọn dòng, chữ đỏ nằm trên.
        const esc = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        return `
    <rect x="0" y="${y}" width="${w}" height="${lineH}" fill="#00ff00"/>
    <text x="${Math.round(w / 2)}" y="${Math.round(y + lineH / 2)}"
          font-family="${FONT}" font-size="${size}" font-weight="${isHead ? 700 : 500}"
          fill="#ff0000" text-anchor="middle" dominant-baseline="central"
          letter-spacing="${isHead ? 1.2 : 0.6}">${esc}</text>`
    }).join('')

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <rect width="${w}" height="${h}" fill="#000000"/>${parts}
</svg>`
}

for (const label of LABELS) {
    const svg = svgFor(label)
    const out = path.join(OUT, `${label.file}.png`)
    await sharp(Buffer.from(svg)).png().toFile(out)

    // Kiểm ngay: ảnh PHẢI có cả điểm đỏ (chữ) lẫn điểm xanh (nền), nếu không
    // thì hoặc phông không nạp được (mất chữ) hoặc vẽ sai kênh.
    const { data, info } = await sharp(out).raw().toBuffer({ resolveWithObject: true })
    let red = 0, green = 0
    for (let i = 0; i < data.length; i += info.channels) {
        if (data[i] > 128 && data[i + 1] < 128) red++
        else if (data[i + 1] > 128 && data[i] < 128) green++
    }
    const ok = red > 50 && green > 50
    console.log(`${ok ? 'OK  ' : 'LỖI '} ${label.file}.png ${label.w}x${label.h}  đỏ(chữ)=${red}  xanh(nền)=${green}`)
}
