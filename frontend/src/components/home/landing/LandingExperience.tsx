'use client';

import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import DeepDives from './DeepDives';
import FlagshipShowcase from './FlagshipShowcase';
import LandingHeader from './LandingHeader';
import PlaygroundPreview from './PlaygroundPreview';
import { getLandingCopy, getLandingRails } from './landingCopy';
import AgentWorldLazy from './agentWorld/AgentWorldLazy';

export default function LandingExperience() {
  const { locale } = useTranslation();
  const copy = getLandingCopy(locale);
  const rails = getLandingRails(locale);
  const vi = locale === 'vi';

  return (
    <main className="landing-root min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="landing-atmosphere" aria-hidden />
      <div className="landing-grain" aria-hidden />
      <div className="landing-measure" aria-hidden />
      <LandingHeader />

      <header className="landing-hero-shell">
        <div className="landing-hero">
          <div className="landing-hero-copy">
            <h1 className="landing-hero-title">
              {copy.hero.title}
              <span className="landing-mark">{copy.hero.mark}</span>
            </h1>
            <p className="landing-hero-body">{copy.hero.body}</p>
            <div className="landing-hero-actions">
              <Link href="/roadmap" className="landing-primary-action">
                <span>{copy.hero.primary}</span>
                <ArrowRight aria-hidden size={17} />
              </Link>
              <Link href="/code-lab" className="landing-secondary-action">
                <span>{copy.hero.secondary}</span>
                <ArrowUpRight aria-hidden size={16} />
              </Link>
            </div>
          </div>

          <PlaygroundPreview />
        </div>

      </header>

      {/* ── Làng agent (10/11/2026) — thay khối 6 con số "đếm từ CSDL". Cảnh đêm pixel sống: CuongMini + các agent
          đi lại, bong bóng thoại dẫn vào tính năng thật. Tải lười khi cuộn gần tới (xem `agentWorld/`). */}
      <AgentWorldLazy vi={vi} />

      <DeepDives />

      {/* ── Hai sản phẩm chủ lực (CT Work + AI Code) — viết lại 13/10/2026,
          xem `FlagshipShowcase.tsx`. Đặt NGAY SAU Deep Dives, trước các dải "duyệt". */}
      <FlagshipShowcase vi={vi} />

      <section id="discover" className="landing-directory-shell">
        {rails.map((rail, index) => (
          <article key={rail.label} className="landing-rail" data-reverse={index % 2 === 1 ? 'true' : undefined}>
            <div className="landing-rail-intro">
              {/* Chỉ mục "01 / 02 / 03" là NGÔN NGỮ PHÂN CÁCH của cấu trúc
                  Ecosystem Index (xem đầu `RiveLanding.tsx`): nó nói cho người
                  đọc biết trang có mấy phần và đang ở phần nào, như mục lục
                  sách. Bản dựng lại hồi 08/2026 đánh rơi nó, nên các dải nội
                  dung trôi tuột vào nhau — đây là chỗ khôi phục. */}
              <p className="landing-rail-index" aria-hidden>{String(index + 1).padStart(2, '0')}</p>
              <p className="landing-rail-label">{rail.label}</p>
              <h2>{rail.title}</h2>
              <p>{rail.blurb}</p>
              <span className="landing-rail-count">{copy.directory.count(rail.items.length)}</span>
            </div>

            <ul className="landing-directory-list">
              {rail.items.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="landing-directory-link">
                    <span className="landing-directory-name">{item.name}</span>
                    <span className="landing-directory-note">{item.note}</span>
                    <ArrowUpRight aria-hidden size={17} />
                    <span className="sr-only"> — {copy.directory.open}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <footer className="landing-statement-footer">
        <p className="landing-footer-statement">{copy.footer.statement}</p>
        <div className="landing-footer-meta">
          <span>{copy.footer.credit}</span>
          <nav aria-label={locale === 'vi' ? 'Liên kết cuối trang' : 'Footer links'}>
            <Link href="/about">{copy.footer.about}</Link>
            <Link href="/tech-trends">{copy.footer.writing}</Link>
            <Link href="/register">{copy.footer.account}</Link>
            <Link href="/chinh-sach-bao-mat">{copy.footer.privacy}</Link>
            <Link href="/dieu-khoan-su-dung">{copy.footer.terms}</Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}
