'use client';

/**
 * Làng agent trên trang chủ (10/11/2026) — thay khối sáu con số "đếm từ CSDL".
 *
 * Phần này SSR được (chữ + danh sách liên kết, tốt cho SEO và trình đọc màn hình) và GIỮ CHỖ đúng chiều cao sân
 * khấu ⇒ không xô lệch bố cục (CLS 0) khi cảnh tải xong. Cảnh (`AgentScene`, ~15 KB gzip) chỉ được import khi
 * sân khấu cách mép màn hình ≤ 250px VÀ trình duyệt đang rảnh (requestIdleCallback) — không bao giờ tranh CPU
 * với lúc tải trang. (Đo 10/11: với vùng "gần" 600px, Lighthouse mobile tải luôn chunk lúc mở trang ⇒ điểm
 * 55 so với 59 khi chặn chunk.)
 */
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { AGENTS, WORLD_COPY } from './agents';
import './agentWorld.css';

// Chunk cảnh tải hỏng (mạng chập, hoặc tab cũ mở từ trước một lần deploy — chunk mang mã băm cũ đã mất) thì
// CHỈ cảnh không hiện: chữ, nền trời và danh sách vẫn nguyên. Không để lỗi import kéo sập cả trang chủ
// (10/11: tắt server đo ⇒ tab cũ cuộn tới làng ⇒ cả trang thành "Đã xảy ra lỗi").
const AgentScene = dynamic(
  () =>
    import('./AgentScene').catch(() => ({
      default: function SceneUnavailable() {
        return null;
      },
    })),
  { ssr: false },
);

export default function AgentWorldLazy({ vi }: { vi: boolean }) {
  const copy = vi ? WORLD_COPY.vi : WORLD_COPY.en;
  const stageRef = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = stageRef.current;
    if (!el || near) return;
    if (typeof IntersectionObserver === 'undefined') {
      setNear(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
        if (ric) idle = ric(() => setNear(true), { timeout: 1500 });
        else idle = window.setTimeout(() => setNear(true), 300);
      },
      { rootMargin: '250px 0px' },
    );
    let idle = 0;
    io.observe(el);
    return () => {
      io.disconnect();
      const cic = (window as Window & { cancelIdleCallback?: (h: number) => void }).cancelIdleCallback;
      if (cic) cic(idle);
      else window.clearTimeout(idle);
    };
  }, [near]);

  return (
    <section className="aw-section" aria-labelledby="aw-title">
      <div ref={stageRef} className="aw-stage">
        <div className="aw-sky" aria-hidden />
        {near && <AgentScene vi={vi} />}
        <div className="aw-intro">
          <p className="aw-eyebrow">{copy.eyebrow}</p>
          <h2 id="aw-title" className="aw-title">
            {copy.title}
          </h2>
          <p className="aw-lede">{copy.body(AGENTS.length - 1)}</p>
        </div>
      </div>

      <nav className="aw-cast" aria-label={copy.cast}>
        <p className="aw-cast-label">{copy.cast}</p>
        <ul>
          {AGENTS.map((a) => (
            <li key={a.id}>
              <Link href={a.href} style={{ '--accent': a.accent } as React.CSSProperties}>
                <span className="aw-cast-dot" aria-hidden />
                <span className="aw-cast-name">{a.name}</span>
                <span className="aw-cast-place">{a.place[vi ? 'vi' : 'en']}</span>
                <span className="aw-cast-arrow" aria-hidden>
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="aw-credit">{copy.credit}</p>
      </nav>
    </section>
  );
}
