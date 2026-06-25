import { ImageResponse } from 'next/og'

// Dynamic Open Graph image (1200x630) — generated at the edge
// whenever someone hits /opengraph-image. This is the image
// Facebook, LinkedIn, Discord, Slack, etc. display when the
// homepage is shared.
//
// We render with the same brand colors as the rest of the site
// (deep purple/cyan) so the preview matches the site look.
// `next/og` uses Satori internally and runs only at request
// time, so we don't ship any binary asset.
//
// Cache: Next.js sets Cache-Control: public, immutable,
// max-age=31536000 by default for these routes since they're
// deterministic. To bust the cache after a redesign, append a
// query string (?v=2) in layout.tsx.

export const runtime = 'edge'
export const alt = 'CuongThai — Portfolio, Academy & E-commerce with AI'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          background:
            'linear-gradient(135deg, #0a0a14 0%, #1a0a2e 50%, #0a0a14 100%)',
          color: 'white',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Decorative ambient sheen. NOTE: Satori (next/og) does not
            support the CSS grid-line trick (a tiled
            `linear-gradient(... 1px, transparent 1px)` with
            backgroundSize) — it throws "Missing comma before color
            stops" at build/render time. We use a plain percentage-stop
            linear-gradient instead (same format as the page background
            above), which Satori renders fine and keeps the neon feel. */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(135deg, rgba(139,92,246,0.12) 0%, transparent 42%, rgba(6,182,212,0.10) 100%)',
            display: 'flex',
          }}
        />

        {/* Top accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background:
              'linear-gradient(90deg, #8b5cf6 0%, #06b6d4 50%, #ec4899 100%)',
            display: 'flex',
          }}
        />

        {/* Logo + name */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            position: 'relative',
          }}
        >
          <div
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '24px',
              background:
                'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '52px',
              fontWeight: 800,
              color: 'white',
              boxShadow: '0 0 60px rgba(139,92,246,0.6)',
            }}
          >
            C
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                fontSize: '28px',
                fontWeight: 600,
                color: '#06b6d4',
                letterSpacing: '4px',
                textTransform: 'uppercase',
              }}
            >
              cuongthai.com
            </div>
            <div
              style={{
                fontSize: '22px',
                fontWeight: 400,
                color: 'rgba(255,255,255,0.6)',
                marginTop: '4px',
              }}
            >
              by Cuong Hoang
            </div>
          </div>
        </div>

        {/* Main headline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          }}
        >
          <div
            style={{
              fontSize: '88px',
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-2px',
              background:
                'linear-gradient(135deg, #ffffff 0%, #8b5cf6 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              display: 'flex',
            }}
          >
            Portfolio · Academy
          </div>
          <div
            style={{
              fontSize: '88px',
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-2px',
              background:
                'linear-gradient(135deg, #06b6d4 0%, #ec4899 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              display: 'flex',
            }}
          >
            E-commerce · AI
          </div>
        </div>

        {/* Tagline + badges */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            position: 'relative',
          }}
        >
          <div
            style={{
              fontSize: '30px',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.75)',
              maxWidth: '900px',
              lineHeight: 1.4,
              display: 'flex',
            }}
          >
            Full-stack platform with AI chatbot, real-time messaging
            and a hand-curated dev hub.
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            {['Next.js', 'TypeScript', 'AI', 'Spring Boot', 'PostgreSQL'].map(
              (label) => (
                <div
                  key={label}
                  style={{
                    padding: '10px 22px',
                    borderRadius: '999px',
                    border: '1px solid rgba(139,92,246,0.4)',
                    background: 'rgba(139,92,246,0.1)',
                    color: '#c4b5fd',
                    fontSize: '22px',
                    fontWeight: 500,
                    display: 'flex',
                  }}
                >
                  {label}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}