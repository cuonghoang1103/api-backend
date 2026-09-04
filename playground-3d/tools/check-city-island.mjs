/**
 * BỘ KIỂM ĐẢO THÀNH PHỐ — nhà chắn đường, cầu có bậc, quảng trường bị lấn,
 * tiếng sóng, và số nhà thực tế mọc lên.
 *
 * Chạy: `node tools/check-city-island.mjs` (cần `npm run dev` đang sống).
 *
 * ⚠️ Mục "số_nhà" sinh ra từ một lỗi thật: three.js XOÁ dấu chấm trong tên node
 * glTF, nên `Building_Medium_2.001` thành `Building_Medium_2001` và 11 trong 32
 * toà nhà lặng lẽ không mọc lên, không một lỗi nào. Nếu con số này tụt xuống
 * dưới 32 thì gần như chắc chắn lại là chuyện tên mảnh.
 */
const { chromium } = await import(process.env.PW ?? '/Users/admin/Downloads/api-backend/node_modules/playwright/index.mjs')
// ⚠️ Vite NHẢY CỔNG khi 5173 đang bận (rất hay gặp: phiên Claude khác cũng mở
// dev server trong đúng thư mục này). Đọc cổng THẬT ở `preview_logs` rồi truyền
// vào bằng `PLAY_URL=`, không thì bộ kiểm chỉ báo ERR_CONNECTION_REFUSED.
const BASE = process.env.PLAY_URL ?? 'http://localhost:5173'
const browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {})
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
await page.goto(`${BASE}/#skip`, { waitUntil: 'load' })
await page.waitForFunction(() => window.game?.world?.cityIsland, null, { timeout: 90000 })
const r = await page.evaluate(() => {
  const G = window.game, R = G.RAPIER, W = G.physics.world, ci = G.world.cityIsland
  const HF = R.ShapeType.HeightField
  const out = { vấn_đề: [], số_liệu: {} }
  const ray = (x,z) => { const h = W.castRay(new R.Ray({x,y:80,z},{x:0,y:-1,z:0}), 300, true); return h ? 80-h.timeOfImpact : null }

  // 1. đếm nhà thật + collider của chúng
  let houses = 0
  ci.group.traverse(o => { if(/^Building_/.test(o.name) && o.parent === ci.group) houses++ })
  out.số_liệu.số_nhà = houses

  // 2. quét HÀNH LANG XE dọc mọi đường của lưới
  const shape = new R.Cuboid(0.95, 0.7, 0.95)
  const rot = { x:0,y:0,z:0,w:1 }
  const sweep = (pts, name) => {
    const blockers = new Map()
    for(const [x,z] of pts) {
      const g = ray(x,z); if(g === null) continue
      W.intersectionsWithShape({x, y: g + 0.82, z}, rot, shape, (c) => {
        const s = c.shape; if(s.type === HF) return true
        const t = c.translation()
        const top = t.y + (s.halfExtents ? s.halfExtents.y : 0.5)
        if(top < 0.35) return true
        const k = `${t.x.toFixed(0)}|${t.z.toFixed(0)}`
        if(!blockers.has(k)) blockers.set(k, `[${t.x.toFixed(0)}·${t.z.toFixed(0)}] gặp ở (${x.toFixed(0)}·${z.toFixed(0)})`)
        return true })
    }
    out.số_liệu[name] = blockers.size ? [...blockers.values()].slice(0,5).join(' · ') : 'thông suốt'
    if(blockers.size) out.vấn_đề.push(`${name}: ${blockers.size} vật chắn hành lang xe`)
  }
  const span = ci.grid.cols * ci.grid.blockSize + (ci.grid.cols+1) * ci.grid.roadWidth
  for(const cx of ci.roadXs) { const p = []; for(let z = ci.grid.z - span/2 + 2; z <= ci.grid.z + span/2 - 2; z += 1) p.push([cx, z]); sweep(p, `đường_dọc_x${cx.toFixed(0)}`) }
  for(const cz of ci.roadZs) { const p = []; for(let x = ci.grid.x - span/2 + 2; x <= ci.grid.x + span/2 - 2; x += 1) p.push([x, cz]); sweep(p, `đường_ngang_z${cz.toFixed(0)}`) }

  // 3. cầu: bậc lớn nhất
  { let prev=null, worst=0, at=null
    for(let x = 78; x <= 156; x += 0.5){ const y = ray(x, 20); if(y===null){ out.vấn_đề.push(`Cầu THỦNG ở x=${x}`); prev=null; continue }
      if(prev!==null){ const d=Math.abs(y-prev); if(d>worst){worst=d; at=x} } prev=y }
    out.số_liệu.cầu_bậc_lớn_nhất = `${worst.toFixed(2)} tại x=${at}`
    if(worst > 0.25) out.vấn_đề.push(`Cầu có BẬC ${worst.toFixed(2)} tại x=${at}`) }

  // 4. tiếng sóng
  const dIn = ci.distanceToShore(232, 20), dOut = ci.distanceToShore(232, 200)
  out.số_liệu.khoảng_cách_bờ = `giữa đảo ${dIn.toFixed(1)} · ngoài biển ${dOut.toFixed(1)}`
  if(!(dIn > 20)) out.vấn_đề.push('distanceToShore giữa đảo quá nhỏ — tiếng sóng sẽ gào')
  if(dOut > 0) out.vấn_đề.push('distanceToShore ngoài biển ra số dương — hình đảo sai')

  // 5. quảng trường phải TRỐNG
  { let hits = 0
    for(let x = ci.plaza.x - 8; x <= ci.plaza.x + 8; x += 1)
      for(let z = ci.plaza.z - 8; z <= ci.plaza.z + 8; z += 1) {
        const g = ray(x,z); if(g === null) continue
        W.intersectionsWithShape({x, y: g + 0.82, z}, rot, shape, (c) => {
          const s = c.shape; if(s.type === HF) return true
          const t = c.translation(); if(t.y + (s.halfExtents?s.halfExtents.y:0.5) < 0.35) return true
          hits++; return true }) }
    out.số_liệu.quảng_trường = hits ? `${hits} điểm bị vướng` : 'trống'
    if(hits) out.vấn_đề.push(`Quảng trường bị vướng ở ${hits} điểm`) }

  return out
})
console.log('── SỐ LIỆU ─────────────────────────────')
for(const [k,v] of Object.entries(r.số_liệu)) console.log(`  ${k}: ${v}`)
console.log('\n── KẾT QUẢ ─────────────────────────────')
if(!r.vấn_đề.length) console.log('  ✅ 0 lỗi')
else { r.vấn_đề.forEach(p => console.log('  ❌ ' + p)); console.log(`\n  ${r.vấn_đề.length} lỗi`) }
await browser.close()
process.exit(r.vấn_đề.length ? 1 : 0)
