import { ImageResponse } from 'next/og'
import codebase from '@/data/codebaseStats.json'

// Ảnh Open Graph riêng cho /about (1200×630) — thứ Facebook, LinkedIn, Zalo,
// Discord, Slack hiện khi ai đó chia sẻ link trang giới thiệu.
//
// VÌ SAO KHÔNG DÙNG CHUNG ẢNH GỐC: ảnh ở app/opengraph-image.tsx giới thiệu
// NỀN TẢNG ("Portfolio, Academy & E-commerce with AI"). Còn link /about
// thường được gửi cho nhà tuyển dụng, nên ảnh xem trước phải nói về NGƯỜI —
// và nói bằng những con số đếm được, đúng tinh thần cả trang.
//
// Số lấy từ data/codebaseStats.json, sinh lại mỗi lần deploy. Ảnh này được
// Next cache bất biến, nhưng mỗi deploy là một bản dựng mới nên số vẫn theo kịp.
//
// ⚠️ Satori (next/og) KHÔNG hỗ trợ mẹo kẻ lưới bằng linear-gradient lặp kèm
// backgroundSize — nó ném "Missing comma before color stops". Chỉ dùng
// linear-gradient theo phần trăm như bên dưới. Mọi phần tử phải có `display`.

export const runtime = 'edge'
export const alt = 'CuongHoang — full-stack developer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const fmt = (n: number | null): string => (typeof n === 'number' ? n.toLocaleString('en-US') : '—')

  // Chỉ giữ ô ĐẾM ĐƯỢC — cùng luật với cả trang: không đếm được thì biến mất,
  // không hiện số 0.
  const stats = [
    { label: 'COMMITS', value: codebase.commits },
    { label: 'PAGES', value: codebase.pages },
    { label: 'API ROUTERS', value: codebase.apiRouters },
    { label: 'DB TABLES', value: codebase.prismaModels },
  ].filter((s) => typeof s.value === 'number' && s.value > 0)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: 'linear-gradient(135deg, #0a0a14 0%, #1a0a2e 50%, #0a0a14 100%)',
          color: 'white',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(135deg, rgba(139,92,246,0.12) 0%, transparent 42%, rgba(6,182,212,0.10) 100%)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(90deg, #8b5cf6 0%, #06b6d4 50%, #ec4899 100%)',
            display: 'flex',
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <div
            style={{
              fontSize: '24px',
              fontWeight: 600,
              color: '#06b6d4',
              letterSpacing: '4px',
              textTransform: 'uppercase',
              display: 'flex',
            }}
          >
            cuongthai.com / about
          </div>
          <div style={{ fontSize: '76px', fontWeight: 800, marginTop: '18px', display: 'flex' }}>
            CuongHoang
          </div>
          <div style={{ fontSize: '34px', fontWeight: 600, color: '#c4b5fd', marginTop: '6px', display: 'flex' }}>
            Full-Stack Developer · AI Builder
          </div>
          <div
            style={{
              fontSize: '25px',
              color: '#9ca3af',
              marginTop: '22px',
              maxWidth: '900px',
              lineHeight: 1.45,
              display: 'flex',
            }}
          >
            This whole platform — the code, the database, the deploy pipeline — is built and run by one person.
          </div>
        </div>

        {stats.length > 0 && (
          <div style={{ display: 'flex', gap: '64px', position: 'relative' }}>
            {stats.map((s) => (
              <div key={s.label} style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '44px', fontWeight: 800, color: 'white', display: 'flex' }}>
                  {fmt(s.value)}
                </div>
                <div
                  style={{
                    fontSize: '17px',
                    color: '#6b7280',
                    letterSpacing: '2.5px',
                    marginTop: '4px',
                    display: 'flex',
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    ),
    size,
  )
}
