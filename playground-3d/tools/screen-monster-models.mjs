/**
 * SÀNG LỌC MODEL QUÁI TRƯỚC KHI ĐẦU TƯ NÉN
 *
 * Bài học đắt: `alien_soldier_wip.glb` được nén, ghi công, lắp vào game và chạy
 * ba phiên trước khi lộ ra là nó HỎNG SẴN TỪ TRONG FILE — lưới bọc xương ở tư
 * thế nghỉ đã cao 283 đơn vị thay vì 2. Người chơi thấy nó thành "bóng đen to
 * bay chập chờn che màn hình".
 *
 * Phép đo đúng, và là phép đo duy nhất đáng tin:
 *
 *     nhịp = (chiều cao lưới SAU KHI XƯƠNG KÉO) / (chiều cao accessor POSITION)
 *
 * Model lành thì nhịp ≈ 1. Hộp bao hình học một mình KHÔNG phát hiện được gì —
 * chính nó đã cho ra 1,332 và làm tôi tưởng model lành suốt ba phiên. Model
 * dựng bằng đơn vị cm hay inch vẫn lành, miễn nhịp ≈ 1; ta co lại sau.
 *
 * Chạy: `PLAY_URL=http://localhost:5175 node tools/screen-monster-models.mjs`
 * (mượn khe resource `bossModel` — chép từng ứng viên đè lên
 * `static/monsters/boss.glb`, đo, rồi trả nguyên trạng.)
 */

import fs from 'node:fs'
import path from 'node:path'

const BASE = process.env.PLAY_URL ?? 'http://localhost:5173'
const SLOT = new URL('../static/monsters/boss.glb', import.meta.url).pathname
const VAULT = '/Users/admin/Downloads/Play Ground/Quái Vật'

const CANDIDATES = [
    'tribal_mutant_bug_2_rig.glb',
    'fatalis.glb',
    'alien_creature_take_3.glb',
    'creature_monster_3d_by_oscar_creativo.glb',
]

/** Chiều cao mà file TỰ KHAI trong accessor POSITION — mốc để so. */
const declaredHeight = (file) =>
{
    const b = fs.readFileSync(file)
    const json = JSON.parse(b.slice(20, 20 + b.readUInt32LE(12)).toString('utf8'))
    let lo = Infinity, hi = -Infinity
    for(const mesh of json.meshes ?? [])
        for(const prim of mesh.primitives ?? [])
        {
            const a = json.accessors?.[prim.attributes?.POSITION]
            if(a?.min && a?.max) { lo = Math.min(lo, a.min[1]); hi = Math.max(hi, a.max[1]) }
        }
    return { cao: hi - lo, skins: (json.skins ?? []).length, anims: (json.animations ?? []).length }
}

const backup = fs.readFileSync(SLOT)
const { chromium } = await import('/Users/admin/Downloads/api-backend/node_modules/playwright/index.mjs')

const rows = []

for(const name of CANDIDATES)
{
    const src = path.join(VAULT, name)
    if(!fs.existsSync(src)) { console.log(`  ⚠ thiếu ${name}`); continue }

    const decl = declaredHeight(src)
    process.stdout.write(`· ${name.padEnd(46)} (${(fs.statSync(src).size / 1e6).toFixed(1)} MB) … `)

    fs.copyFileSync(src, SLOT)

    const browser = await chromium.launch()
    const page = await browser.newPage({ viewport: { width: 320, height: 240 } })
    let measured = null
    try
    {
        await page.goto(`${BASE}/#skip`, { waitUntil: 'load' })
        await page.waitForFunction(() => window.game?.resources?.bossModel?.scene, null, { timeout: 180000 })

        measured = await page.evaluate(() =>
        {
            const G = window.game
            const Vector3 = G.view.camera.position.constructor
            const root = G.resources.bossModel.scene
            root.updateMatrixWorld(true)

            const v = new Vector3()
            let lo = Infinity, hi = -Infinity, worst = ''
            root.traverse((c) =>
            {
                const pos = c.geometry?.attributes?.position
                if(!pos) return
                let l = Infinity, h = -Infinity
                const step = Math.max(1, Math.floor(pos.count / 150))
                for(let i = 0; i < pos.count; i += step)
                {
                    v.fromBufferAttribute(pos, i)
                    // Xương kéo đỉnh đi đâu — thứ duy nhất nói được sự thật
                    if(c.isSkinnedMesh && c.applyBoneTransform) c.applyBoneTransform(i, v)
                    v.applyMatrix4(c.matrixWorld)
                    l = Math.min(l, v.y); h = Math.max(h, v.y)
                }
                if(h - l > hi - lo) { lo = l; hi = h; worst = c.name }
            })
            return { skinned: hi - lo, mesh: worst }
        })
    }
    catch(e) { measured = { error: e.message.slice(0, 60) } }
    await browser.close()

    const ratio = measured?.skinned ? measured.skinned / decl.cao : NaN
    rows.push({ name, decl: decl.cao, skinned: measured?.skinned, ratio, skins: decl.skins, anims: decl.anims, error: measured?.error })
    console.log(measured?.error ? `LỖI ${measured.error}` : `nhịp ${ratio.toFixed(2)}`)
}

fs.writeFileSync(SLOT, backup)
console.log('\n  (đã trả `static/monsters/boss.glb` về nguyên trạng)\n')

console.log('  ' + 'MODEL'.padEnd(46) + 'khai   bọc xương    nhịp   skin/anim   KẾT LUẬN')
console.log('  ' + '─'.repeat(100))
for(const r of rows)
{
    const ok = Number.isFinite(r.ratio) && r.ratio > 0.5 && r.ratio < 2
    console.log('  ' + r.name.padEnd(46)
        + String(r.decl?.toFixed(2)).padStart(6)
        + String(r.skinned?.toFixed(2) ?? '—').padStart(12)
        + String(Number.isFinite(r.ratio) ? r.ratio.toFixed(2) : '—').padStart(8)
        + `   ${r.skins}/${r.anims}`.padEnd(12)
        + (r.error ? `LỖI ${r.error}` : ok ? '  ✅ LÀNH' : '  ❌ BIND POSE HỎNG'))
}
console.log('')
