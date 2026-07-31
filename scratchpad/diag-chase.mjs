const { chromium } = await import('/Users/admin/Downloads/api-backend/node_modules/playwright/index.mjs')
const browser = await chromium.launch({ args: [ '--enable-unsafe-webgpu', '--enable-features=Vulkan' ] })
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } })
page.on('pageerror', e => console.log('PAGEERROR:', e.message))
await page.goto('http://localhost:5175/#skip', { waitUntil: 'domcontentloaded' })
await page.waitForFunction(() => window.game?.world?.fptuCampus && window.game?.reveal?.step >= 1, null, { timeout: 120000 })
await page.evaluate(() => { const b = document.querySelector('.js-welcome-play'); if(b){ b.hidden=false; b.click() } })
await page.waitForTimeout(2000)

const run = async (zoomRatio, label) => {
  const out = await page.evaluate((zoomRatio) => {
    const q = window.game, v = q.view, w = q.world.vehicleRocket
    for(const p of ['trackedPosition','position','smoothedPosition']) v.focusPoint[p].set(-150,0,52)
    v.zoom.baseRatio = zoomRatio; v.zoom.ratio = zoomRatio; v.zoom.smoothedRatio = zoomRatio
    v.zoom.override = null; w.followTarget = null; w.followRatio = 0
    v.update()
    w.preference.set('on'); w.weaponPreference.set('missile')
    w.hasAim = true; w.aim.set(-156, 0, 40); w.fire()
    const r = w.rockets[w.rockets.length - 1]

    const samples = []; let camPath = 0, maxJump = 0, prev = null, ngoai = 0, n = 0
    for(let i = 0; i < 240; i++) {
      q.ticker.delta = 1/60; q.ticker.elapsed += 1/60
      w.updateCameraFollow(); w.update(); v.update()
      const f = v.focusPoint.smoothedPosition
      if(prev) { const d = Math.hypot(f.x-prev.x, f.z-prev.z); camPath += d; maxJump = Math.max(maxJump, d) }
      prev = { x: f.x, z: f.z }
      if(!w.rockets.includes(r)) break
      const p = r.group.position.clone().project(v.camera)
      n++; if(Math.abs(p.x) > 1 || Math.abs(p.y) > 1) ngoai++
      if(i % 24 === 0) samples.push({ t:+r.time.toFixed(2), x:+p.x.toFixed(2), y:+p.y.toFixed(2) })
    }
    return { samples, camPath:+camPath.toFixed(1), maxJump:+maxJump.toFixed(3), ngoai, n,
             banKinh:+v.spherical.radius.current.toFixed(1) }
  }, zoomRatio)

  console.log(`\n── ${label} (bán kính ${out.banKinh}) ──`)
  console.log('   vị trí quả đạn trên màn hình (0,0 = giữa khung):')
  for(const s of out.samples) console.log(`      t=${String(s.t).padEnd(5)} x=${String(s.x).padStart(6)}  y=${String(s.y).padStart(6)}`)
  console.log(`   ra ngoài khung: ${out.ngoai}/${out.n} mẫu`)
  console.log(`   MÁY QUAY CÓ DI CHUYỂN KHÔNG: đi tổng ${out.camPath} đơn vị (đứng yên = ~0)`)
  console.log(`   bước nhảy lớn nhất mỗi nhịp: ${out.maxJump} (càng nhỏ càng mượt)`)
  await page.evaluate(() => { window.game.world.fptuCampus.destruction.reset(); window.game.world.vehicleRocket.rockets.length = 0 })
}

await page.evaluate(() => window.game.physicalVehicle.moveTo({ x: -150, y: 2, z: 52 }, Math.PI))
await page.waitForTimeout(1500)
await run(0.3, 'thu phóng mặc định')
await run(0,   'kéo xa hết cỡ')
await run(1,   'kéo gần hết cỡ')
await browser.close()
