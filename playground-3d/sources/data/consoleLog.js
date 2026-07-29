import * as THREE from 'three/webgpu'

const text = `
   ██████╗██╗   ██╗ ██████╗ ███╗   ██╗ ██████╗ ████████╗██╗  ██╗ █████╗ ██╗
  ██╔════╝██║   ██║██╔═══██╗████╗  ██║██╔════╝ ╚══██╔══╝██║  ██║██╔══██╗██║
  ██║     ██║   ██║██║   ██║██╔██╗ ██║██║  ███╗   ██║   ███████║███████║██║
  ██║     ██║   ██║██║   ██║██║╚██╗██║██║   ██║   ██║   ██╔══██║██╔══██║██║
  ╚██████╗╚██████╔╝╚██████╔╝██║ ╚████║╚██████╔╝   ██║   ██║  ██║██║  ██║██║
   ╚═════╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝    ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝

╔═ Intro ═══════════════╗
║ Chao ban, cam on da ghe san choi 3D cua CuongThai!
║ Lai xe quanh dao va dam vao cac cong de di toi tung khu hoc tap cua web.
╚═══════════════════════╝

╔═ Links ═══════════════╗
║ Website  => https://cuongthai.com
║ GitHub   => https://github.com/cuonghoang1103
║ Youtube  => https://www.youtube.com/@cuongthai2003
║ Facebook => https://www.facebook.com/CuongThaiswit
╚═══════════════════════╝

╔═ Debug ═══════════════╗
║ Them #debug vao cuoi URL roi tai lai trang de bat che do go loi.
║ Bam [V] de bat/tat camera tu do.
╚═══════════════════════╝

╔═ Credits ═════════════╗
║ The gioi 3D nay dua tren portfolio ma nguon mo "folio-2025".
║ Tac gia goc: Bruno Simon - Copyright (c) 2025, giay phep MIT.
║ Ma nguon goc => https://github.com/brunosimon/folio-2025
║ Trang cua tac gia => https://bruno-simon.com
╚═══════════════════════╝

╔═ Stack ═══════════════╗
║ Three.js (r${THREE.REVISION}, dung TSL cho ca WebGL lan WebGPU) => https://threejs.org/
║ Rapier (thu vien vat ly)  => https://rapier.rs/
║ Howler.js (thu vien am thanh) => https://howlerjs.com/
╚═══════════════════════╝
`
let finalText = ''
let finalStyles = []
const stylesSet = {
    letter: 'color: #ffffff; font: 400 1em monospace;',
    pipe: 'color: #D66FFF; font: 400 1em monospace;',
}
let currentStyle = null
for(let i = 0; i < text.length; i++)
{
    const char = text[i]

    const style = char.match(/[╔║═╗╚╝╔╝]/) ? 'pipe' : 'letter'
    if(style !== currentStyle)
    {
        currentStyle = style
        finalText += '%c'

        finalStyles.push(stylesSet[currentStyle])
    }
    finalText += char
}

export default [finalText, ...finalStyles]