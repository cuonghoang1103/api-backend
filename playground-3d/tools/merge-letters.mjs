/**
 * Ghép 9 chữ "CUONG THAI" vào areas.glb, thay cho 10 chữ "BRUNO SIMON".
 *
 * Vì sao không xuất đè areas.glb thẳng từ Blender: file .blend có 120 collection
 * và không ai biết thiết lập xuất gốc của tác giả. Xuất đè mà đoán sai là hỏng cả
 * 737 nút của thế giới. Ở đây chỉ đụng đúng các nút chữ, phần còn lại giữ nguyên.
 *
 * Ghi ra FILE MỚI. Bản gốc không bị sửa.
 */
import { NodeIO, PropertyType } from '@gltf-transform/core'
// Document.merge() đã bị bỏ ở gltf-transform v4 — phải dùng hàm rời này.
// prune() để dọn lưới/accessor mồ côi sau khi gỡ nút.
import { mergeDocuments, prune } from '@gltf-transform/functions'
import { ALL_EXTENSIONS } from '@gltf-transform/extensions'

const [ areasPath, lettersPath, outPath ] = process.argv.slice(2)

// ⚠️ BẮT BUỘC đăng ký extension. NodeIO trần KHÔNG hiểu extension nào, lúc đọc chỉ
// in "Missing optional extension" rồi BỎ QUA, và lúc ghi thì vứt luôn ra khỏi file.
// areas.glb dùng KHR_materials_emissive_strength — mất nó là hỏng vật liệu phát
// sáng và thế giới kẹt mãi ở màn hình tải. Đã dẫm đúng lỗi này một lần.
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS)

const areas = await io.read(areasPath)
const letters = await io.read(lettersPath)

const areasRoot = areas.getRoot()
const LETTER_RE = /^refLettersPhysicalDynamic/

// ── Khảo sát trước khi động vào ──────────────────────────────────────────
const oldLetters = areasRoot.listNodes().filter(n => LETTER_RE.test(n.getName()))
console.log(`Nút chữ cũ: ${oldLetters.length}`)

// Vật liệu 'palette' — chữ gốc dùng cái này
const palette = areasRoot.listMaterials().find(m => m.getName() === 'palette')
console.log(`Vật liệu 'palette': ${palette ? 'CÓ' : 'KHÔNG TÌM THẤY'}`)
if (!palette) throw new Error("Không tìm thấy vật liệu 'palette' trong areas.glb")

// Nút cha 'landing' — chữ gốc là con của nó
let landing = areasRoot.listNodes().find(n => n.getName() === 'landing')
console.log(`Nút cha 'landing': ${landing ? 'CÓ' : 'KHÔNG'}`)

// Cha thật sự của chữ cũ (để gắn chữ mới vào đúng chỗ)
const firstOld = oldLetters[0]
const oldParent = firstOld ? firstOld.getParentNode() : null
console.log(`Cha của chữ cũ: ${oldParent ? oldParent.getName() : '(gắn thẳng vào scene)'}`)

// ── Gộp tài liệu chữ mới vào ─────────────────────────────────────────────
mergeDocuments(areas, letters)

// Sau merge sẽ có thêm scene của file chữ — gom nút chữ mới rồi bỏ scene thừa
const scenes = areasRoot.listScenes()
const mainScene = scenes[0]
console.log(`Số scene sau merge: ${scenes.length}`)

const newLetters = areasRoot.listNodes().filter(
    n => LETTER_RE.test(n.getName()) && !oldLetters.includes(n)
)
console.log(`Nút chữ mới: ${newLetters.length}`)
if (newLetters.length === 0) throw new Error('Không thấy nút chữ mới sau khi gộp')

// ── Gán vật liệu 'palette' cho chữ mới ───────────────────────────────────
for (const node of newLetters) {
    const mesh = node.getMesh()
    if (!mesh) continue
    for (const prim of mesh.listPrimitives()) prim.setMaterial(palette)
}

// ── Gắn chữ mới vào đúng cha, rồi gỡ chữ cũ ──────────────────────────────
for (const node of newLetters) {
    // tách khỏi mọi scene/cha đang giữ nó sau khi merge
    const p = node.getParentNode()
    if (p) p.removeChild(node)
    for (const s of scenes) s.removeChild(node)

    if (oldParent) oldParent.addChild(node)
    else mainScene.addChild(node)
}

for (const node of oldLetters) {
    const p = node.getParentNode()
    if (p) p.removeChild(node)
    for (const s of scenes) s.removeChild(node)
    node.dispose()
}

// Bỏ các scene thừa do merge sinh ra
for (const s of scenes) if (s !== mainScene) s.dispose()

// ── Kiểm lại rồi ghi ─────────────────────────────────────────────────────
const finalLetters = areasRoot.listNodes().filter(n => LETTER_RE.test(n.getName()))
console.log(`\nSau khi ghép — nút chữ: ${finalLetters.length}`)
for (const n of finalLetters) {
    const t = n.getTranslation().map(v => Math.round(v * 1000) / 1000)
    const mat = n.getMesh()?.listPrimitives()[0]?.getMaterial()?.getName()
    console.log(`  ${n.getName()}  loc=[${t}]  cha=${n.getParentNode()?.getName() ?? '(scene)'}  vl=${mat}`)
}
console.log(`Tổng nút toàn file: ${areasRoot.listNodes().length}`)

// Dọn rác: node.dispose() chỉ bỏ NÚT, còn lưới và accessor của 10 chữ cũ vẫn nằm
// lại thành mồ côi (đã đo: số lưới đi từ 266 lên 275 thay vì xuống 265).
//
// ⚠️ PHẢI giới hạn propertyTypes. prune() mặc định dọn cả NODE, mà thế giới này có
// hàng trăm nút RỖNG cố ý — điểm hồi sinh, điểm tương tác, mốc vị trí ref* — đều
// không mang lưới. Gọi prune() trần một lần đã thổi bay 381 nút (737 -> 355).
await areas.transform(prune({
    propertyTypes: [ PropertyType.MESH, PropertyType.ACCESSOR ],
}))

// Gộp vùng đệm: mỗi tài liệu mang buffer riêng, sau khi gộp thành 2 — mà định dạng
// GLB chỉ cho phép tối đa 1. Dồn mọi accessor về buffer đầu rồi bỏ buffer thừa.
const buffers = areasRoot.listBuffers()
if (buffers.length > 1) {
    const main = buffers[0]
    for (const acc of areasRoot.listAccessors()) acc.setBuffer(main)
    for (const b of buffers.slice(1)) b.dispose()
    console.log(`Đã gộp ${buffers.length} vùng đệm về 1`)
}

await io.write(outPath, areas)
console.log(`\nĐã ghi: ${outPath}`)
