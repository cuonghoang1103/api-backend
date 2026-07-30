'use client';

/**
 * Mục "Deep Dives" trên trang chủ — lưới thẻ hướng dẫn dài, mỗi thẻ mang logo
 * công nghệ đúng màu thương hiệu.
 *
 * ─── HAI KIỂU ĐÍCH ──────────────────────────────────────────────────────────
 * Xem `deepDivesData.ts`. Thẻ có `article` mở bài viết dài trong hệ tech-trends;
 * thẻ có `href` dẫn vào nơi site đã dạy sâu chủ đề đó (Code Lab, khoá học, Xưởng
 * mô phỏng). Thẻ kiểu thứ hai hiện thêm một nhãn `via` để người đọc biết mình
 * sắp đi đâu — bấm vào tưởng đọc bài mà lại ra danh sách bài tập thì là lừa.
 *
 * ─── LOGO ───────────────────────────────────────────────────────────────────
 * `<img>` trỏ vào `/logos/<logo>.svg`, TỰ PHỤC VỤ. Bắt buộc: CSP của site đặt
 * `img-src 'self' data:` nên logo lấy từ CDN ngoài bị chặn thẳng.
 * Có `width`/`height` cố định để không gây layout shift (CLS) khi ảnh về.
 *
 * ─── KHÔNG LÀM GÌ Ở ĐÂY ─────────────────────────────────────────────────────
 * Không `hover:scale`, không nhấc thẻ lên, không glow theo màu. Hover chỉ đổi
 * đường viền và màu chữ — cùng luật với phần còn lại của trang chủ, xem chú
 * thích đầu `RiveLanding.tsx`.
 */
import Link from 'next/link';
import { DEEP_DIVES } from './deepDivesData';

export default function DeepDives() {
  return (
    <section className="border-b border-[var(--border-color)]">
      <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8">
        <div className="max-w-2xl">
          <p className="flex items-baseline gap-3 font-mono text-[11px] uppercase tracking-[0.22em]">
            <span className="text-[var(--accent-color)]">00</span>
            <span className="text-[var(--text-muted)]">Deep dives</span>
          </p>
          <h2 className="mt-3 font-heading text-2xl font-bold leading-[1.12] tracking-tight sm:text-[2rem]">
            The long ones, worth sitting down for
          </h2>
          <p className="mt-3 text-[var(--text-secondary)]">
            Full walkthroughs on one topic at a time — the kind you finish with something working,
            not a summary you have to go and research properly afterwards.
          </p>
        </div>

        <ul className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {DEEP_DIVES.map((d) => {
            const to = d.article ? `/tech-trends/${d.article}` : d.href!;
            return (
              <li key={d.title}>
                <Link
                  href={to}
                  className="group flex h-full gap-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 transition-colors duration-200 hover:border-[var(--accent-color)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-color)]"
                >
                  {/* Logo giữ nguyên màu thương hiệu — KHÔNG nhuộm lại, không
                      bọc trong ô vuông nhuộm màu (ô icon nhuộm màu lặp lại là
                      một dấu hiệu AI có tên: "icon-tile feature card"). */}
                  <img
                    src={`/logos/${d.logo}.svg`}
                    alt=""
                    width={32}
                    height={32}
                    loading="lazy"
                    className="mt-0.5 h-8 w-8 shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="font-heading text-[15px] font-semibold leading-snug text-[var(--text-primary)]">
                      {d.title}
                    </h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--text-muted)]">
                      {d.blurb}
                    </p>
                    {/* Nhãn cho biết thẻ dẫn sang phần khác của site chứ không
                        phải một bài viết — nói trước để khỏi bất ngờ. */}
                    {d.via && (
                      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--accent-color)]">
                        {d.via}
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
