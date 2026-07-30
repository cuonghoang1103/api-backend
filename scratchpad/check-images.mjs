import { existsSync } from 'node:fs'
const ROOT = '/Users/admin/Downloads/api-backend/playground-3d'
const projects = (await import(`${ROOT}/sources/data/projects.js`)).default
const lab = (await import(`${ROOT}/sources/data/lab.js`)).default

let bad = 0, n = 0
const check = (rel, who) => { n++; if (!existsSync(`${ROOT}/static/${rel}`)) { console.log(`THIẾU: ${rel}  (${who})`); bad++ } }

for (const p of projects) {
    if (p.images.length > 5) { console.log(`QUÁ 5 ẢNH: ${p.title} có ${p.images.length}`); bad++ }
    for (const img of p.images) check(`projects/images/${img}`, p.title)
}
for (const l of lab) { check(`lab/images/${l.image}`, l.title); check(`lab/images/${l.imageMini}`, l.title) }

console.log(`projects: ${projects.length} mục · lab: ${lab.length} mục · ${n} file ảnh khai báo · thiếu: ${bad}`)
if (process.argv[2] === '--selftest') {
    console.log('--- tự kiểm bộ kiểm: file bịa phải bị bắt ---')
    const before = bad
    check('projects/images/khong-ton-tai-999.png', 'TỰ KIỂM')
    console.log(bad > before ? 'OK — bộ kiểm bắt được file thiếu' : 'HỎNG — bộ kiểm KHÔNG bắt được, đừng tin nó')
}
