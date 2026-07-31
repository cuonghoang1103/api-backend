/**
 * Bộ kiểm bố cục khu FPTU: soi mọi cặp công trình xem có ĐÈ NHAU không, và
 * kiểm đường có bị chắn không. Chạy TRƯỚC khi dựng, đỡ phải phát hiện bằng mắt.
 *
 * Chạy: node tools/check-fptu-layout.mjs
 */
import * as D from '../sources/data/fptu.js'

const rect = (name, x, z, w, d) => ({ name, x0: x - w / 2, x1: x + w / 2, z0: z - d / 2, z1: z + d / 2 })
const overlap = (a, b) => a.x0 < b.x1 && a.x1 > b.x0 && a.z0 < b.z1 && a.z1 > b.z0
const area = (a, b) => Math.max(0, Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0)) * Math.max(0, Math.min(a.z1, b.z1) - Math.max(a.z0, b.z0))

const items = []
items.push(rect('HỒ SEN', D.LAKE.x, D.LAKE.z, D.LAKE.radiusX * 2, D.LAKE.radiusZ * 2))
items.push(rect('toà ALPHA', D.ALPHA.x, D.ALPHA.z, D.ALPHA.depth, D.ALPHA.columns.length * D.ALPHA.columnWidth))
for (const b of D.BUILDINGS) items.push(rect('toà ' + b.name, b.x, b.z, b.width, b.depth))
for (const m of D.DORMS) items.push(rect('Dom ' + m.name, m.x, m.z, 6.5, 5))
items.push(rect('nhà ăn', D.CANTEEN.x, D.CANTEEN.z, D.CANTEEN.width, D.CANTEEN.depth))
items.push(rect('đồi thông', D.PINE_HILL.x, D.PINE_HILL.z, D.PINE_HILL.radius * 2, D.PINE_HILL.radius * 2))
items.push(rect('hồ thiên nga', D.SWAN_LAKE.x, D.SWAN_LAKE.z, D.SWAN_LAKE.radiusX * 2, D.SWAN_LAKE.radiusZ * 2))
items.push(rect('sân bóng đá', D.FOOTBALL.x, D.FOOTBALL.z, D.FOOTBALL.width, D.FOOTBALL.depth))
items.push(rect('sân bóng rổ', D.BASKETBALL.x, D.BASKETBALL.z, D.BASKETBALL.width, D.BASKETBALL.depth))
items.push(rect('sân võ', D.MARTIAL.x, D.MARTIAL.z, D.MARTIAL.width, D.MARTIAL.depth))
items.push(rect('bãi xe', D.PARKING.x, D.PARKING.z, D.PARKING.width, D.PARKING.depth))
items.push(rect('biển xếp hạng', D.RANKING_SIGN.x, D.RANKING_SIGN.z, 1.4, D.RANKING_SIGN.width))
items.push(rect('chữ FPT UNIVERSITY', D.SIGN.x, D.SIGN.z, 1.2, 12.53 * D.SIGN.scale))
// Mặt tiền nay là HAI cổng hai bên + bậc sảnh giữa (xem `FRONTAGE`), không
// còn một khối cổng nằm giữa trục như bản trước. Bảng xếp hạng đứng ĐÚNG trên
// bậc sảnh giữa nên phải khai hai cổng riêng, nếu không bộ kiểm báo oan là
// "biển xếp hạng đè lên cổng".
for(const [ i, gz ] of D.FRONTAGE.gates.entries())
    items.push(rect(`cổng ${i + 1}`, D.FRONTAGE.x, gz, 3, D.FRONTAGE.gateHalf * 2 + 3.4))

let bad = 0

console.log('── CÔNG TRÌNH ĐÈ NHAU ──')
for (let i = 0; i < items.length; i++)
  for (let j = i + 1; j < items.length; j++)
    if (overlap(items[i], items[j])) { console.log(`  ✗ ${items[i].name}  ⨯  ${items[j].name}   (chồng ${area(items[i], items[j]).toFixed(1)} đơn vị²)`); bad++ }
if (!bad) console.log('  ✓ không cặp nào đè nhau')

console.log('── ĐƯỜNG CÓ BỊ CHẮN KHÔNG ──')
const roads = [
  { name: 'trục lễ nghi', z: D.AXIS.z, hw: D.AXIS.halfWidth, x0: D.AXIS.toX, x1: D.AXIS.fromX },
  { name: 'đường xuyên sảnh', z: D.THROUGH_ROAD.z, hw: D.THROUGH_ROAD.halfWidth, x0: D.THROUGH_ROAD.toX, x1: D.THROUGH_ROAD.fromX },
]
for (const r of roads) {
  const band = { x0: r.x0, x1: r.x1, z0: r.z - r.hw, z1: r.z + r.hw }
  let n = 0
  for (const it of items) {
    // Cố ý nằm trên trục: sảnh Alpha để chui qua, cổng có lối mở giữa hai trụ,
    // hàng chữ đặt giữa quảng trường (xe vòng hai bên như trường thật)
    if ([ 'toà ALPHA', 'cổng 1', 'cổng 2', 'chữ FPT UNIVERSITY' ].includes(it.name)) continue
    if (overlap(it, band)) { console.log(`  ✗ ${r.name} bị ${it.name} chắn`); n++; bad++ }
  }
  if (!n) console.log(`  ✓ ${r.name} thông suốt`)
}

console.log('── NẰM TRONG ĐẢO KHÔNG ──')
const isl = rect('đảo', D.ISLAND.x, D.ISLAND.z, D.ISLAND.width, D.ISLAND.depth)
for (const it of items) {
  if (it.x0 < isl.x0 || it.x1 > isl.x1 || it.z0 < isl.z0 || it.z1 > isl.z1) { console.log(`  ✗ ${it.name} thò ra ngoài mép đảo`); bad++ }
}
if (!items.some(it => it.x0 < isl.x0 || it.x1 > isl.x1 || it.z0 < isl.z0 || it.z1 > isl.z1)) console.log('  ✓ mọi thứ nằm gọn trong đảo')

console.log(`\nTỔNG LỖI: ${bad}`)
process.exit(bad ? 1 : 0)
