/**
 * CẮT BẢN THÔ KHỎI THƯ MỤC DỰNG — chạy tự động sau `npm run build`.
 *
 * `vite.config.js` khai `publicDir: '../static/'`, và Vite chép NGUYÊN thư mục
 * đó vào `dist/`. Nhưng `static/` phải chứa CẢ HAI bản của mỗi tài nguyên:
 *
 *   · bản thô (`areas.glb`, `terrain.png`) — cho `npm run dev`, sửa model xong
 *     là thấy ngay, không phải chạy lại `npm run compress`
 *   · bản nén (`areas-compressed.glb`, `terrain.ktx`) — cho production
 *
 * Bản production (`VITE_COMPRESSED=1`) KHÔNG BAO GIỜ xin bản thô, nhưng chúng
 * vẫn theo `dist/` đi vào ảnh Docker và vào kho git. Đo 04/09/2026: hơn 5 MB
 * nằm không trong mỗi bản deploy.
 *
 * ⚠️ CHỈ chạy khi dựng có nén. Bản dựng KHÔNG nén thì bản thô chính là thứ
 * được tải — cắt đi là xoá đúng thứ đang dùng.
 *
 * ⚠️ LUẬT CẮT hẹp có chủ ý: chỉ bỏ `X.glb` khi `X-compressed.glb` tồn tại, và
 * `X.png` khi `X.ktx` tồn tại. Ba file `city.glb` · `carrier.glb` · `boss.glb`
 * không có bản nén song song (chúng đã nén sẵn từ nguồn, chỉ có MỘT bản) nên
 * luật này tự chừa chúng ra — đúng như mong muốn. Mấy ảnh .png của
 * `LabArea`/`ProjectsArea` cũng không có bản .ktx nên cũng được chừa.
 *
 * ⚠️ Vì sao KHÔNG dựa vào "tên file có được nhắc trong mã không":
 * `KonamiCode.js` từng gõ cứng `'vehicle/default.glb'`, bỏ qua công tắc nén.
 * Nó chỉ chạy khi có người gõ mã Konami, nên phép cắt dựa trên tên sẽ đẻ ra
 * một lỗi 404 CÂM nằm im nhiều tháng. Chỗ đó đã sửa cùng ngày; luật ở đây vẫn
 * giữ tinh thần "chỉ cắt thứ chắc chắn có bản thay thế nằm ngay cạnh".
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const dist = path.join(root, 'dist')

/**
 * ⚠️ `VITE_COMPRESSED` sống trong `.env.production`, KHÔNG trong `process.env`.
 *
 * `vite.config.js` gọi `import 'dotenv/config'`, mà dotenv chỉ nạp `.env` —
 * không nạp `.env.<mode>`. Chính Vite mới đọc `.env.production`, và nó đưa giá
 * trị vào `import.meta.env` của gói chứ không đưa ngược ra tiến trình node.
 *
 * Nên script này phải TỰ đọc file. Bản đầu viết `process.env.VITE_COMPRESSED`
 * và nó luôn rỗng ⇒ bước cắt lặng lẽ không làm gì, đúng kiểu "chạy xanh mà
 * không có tác dụng" đã dính ở bước 6c nginx.
 */
const readEnvFlag = () =>
{
    if(process.env.VITE_COMPRESSED)
        return true

    const envFile = path.join(root, '.env.production')

    if(!fs.existsSync(envFile))
        return false

    return fs.readFileSync(envFile, 'utf8')
        .split('\n')
        .some(line =>
        {
            const trimmed = line.trim()

            if(trimmed.startsWith('#'))
                return false

            const match = trimmed.match(/^VITE_COMPRESSED\s*=\s*(.+)$/)

            if(!match)
                return false

            const value = match[1].trim().replace(/^["']|["']$/g, '')

            return value !== '' && value !== '0' && value !== 'false'
        })
}

if(!readEnvFlag())
{
    console.log('[prune-dist] VITE_COMPRESSED trống → giữ nguyên bản thô, không cắt gì.')
    process.exit(0)
}

if(!fs.existsSync(dist))
{
    console.error('[prune-dist] không thấy dist/ — chạy `npm run build` trước.')
    process.exit(1)
}

const removed = []
let bytes = 0

const walk = (dir) =>
{
    for(const entry of fs.readdirSync(dir, { withFileTypes: true }))
    {
        const full = path.join(dir, entry.name)

        if(entry.isDirectory())
        {
            walk(full)
            continue
        }

        // Bản thô chỉ bị bỏ khi bản thay thế NẰM NGAY CẠNH.
        let replacement = null

        if(/\.glb$/.test(entry.name) && !/-compressed\.glb$/.test(entry.name))
            replacement = full.replace(/\.glb$/, '-compressed.glb')
        else if(/\.png$/.test(entry.name))
            replacement = full.replace(/\.png$/, '.ktx')

        if(!replacement || !fs.existsSync(replacement))
            continue

        bytes += fs.statSync(full).size
        fs.unlinkSync(full)
        removed.push(path.relative(dist, full))
    }
}

walk(dist)

// Bộ MÃ HOÁ Draco không bao giờ chạy trong trình duyệt — chỉ bộ giải mã chạy.
const encoder = path.join(dist, 'draco', 'draco_encoder.js')
if(fs.existsSync(encoder))
{
    bytes += fs.statSync(encoder).size
    fs.unlinkSync(encoder)
    removed.push('draco/draco_encoder.js')
}

console.log(`[prune-dist] bỏ ${removed.length} file thô khỏi dist/ — ${(bytes / 1048576).toFixed(2)} MB`)
