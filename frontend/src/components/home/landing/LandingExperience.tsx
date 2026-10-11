'use client';

import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import DeepDives from './DeepDives';
import LandingHeader from './LandingHeader';
import PlaygroundPreview from './PlaygroundPreview';
import { getLandingCopy, getLandingRails } from './landingCopy';
import { fmt, useLandingStats } from './useLandingStats';

export default function LandingExperience() {
  const { locale } = useTranslation();
  const copy = getLandingCopy(locale);
  const rails = getLandingRails(locale);
  const stats = useLandingStats();
  const vi = locale === 'vi';

  // SÁU con số, tất cả đến từ `GET /api/v1/landing/stats`. Trước đây chỉ hiện
  // ba, tức là ba con số đã fetch về rồi vứt đi — mà bề rộng nội dung mới là
  // thứ đáng khoe nhất của site này. Luật cũ giữ nguyên: `null` thì ẨN Ô ĐÓ,
  // không thay bằng 0 ("0 bài tập" là nói dối, không hiện gì chỉ là thiếu).
  const visibleStats = [
    { value: stats?.exercises, label: copy.stats.exercises },
    { value: stats?.examQuestions, label: copy.stats.examQuestions },
    { value: stats?.subjects, label: copy.stats.subjects },
    { value: stats?.roadmapNodes, label: copy.stats.roadmapNodes },
    { value: stats?.vocabWords, label: copy.stats.vocabWords },
    { value: stats?.hanziChars, label: copy.stats.hanziChars },
  ].filter((item): item is { value: number; label: string } => typeof item.value === 'number');

  // Mốc thời gian đếm. Nó nói thẳng rằng mấy con số trên là đếm thật chứ không
  // phải gõ tay — đó mới là điểm khác biệt, chứ không phải bản thân con số.
  const countedAt = stats?.computedAt
    ? new Date(stats.computedAt).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : null;

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

        {visibleStats.length > 0 && (
          <section className="landing-stats-block">
            <dl className="landing-stats" aria-label={locale === 'vi' ? 'Số liệu nội dung' : 'Content statistics'}>
              {visibleStats.map((item) => (
                <div key={item.label} className="landing-stat">
                  <dd>{fmt(item.value)}</dd>
                  <dt>{item.label}</dt>
                </div>
              ))}
            </dl>
            {countedAt && <p className="landing-stats-source">{copy.stats.countedAt(countedAt)}</p>}
          </section>
        )}
      </header>

      <DeepDives />

      {/* ── Showcase hai sản phẩm chủ lực ───────────────────────────────────
          CT Work (quản lý dự án kiểu Jira) + AI Code (agent lập trình trong app
          desktop). Đặt NGAY SAU Deep Dives, trước các dải "duyệt" — để hai công
          cụ mạnh nhất được khoe trước khi người đọc đi lướt danh mục. Toàn bộ
          dùng token `--color-*` trong `.landing-root` nên tự đúng ở cả sáng/tối;
          khung "mock" đứng thay cho ảnh/video demo thật (user sẽ thay sau). */}
      <section className="landing-showcase" aria-labelledby="landing-showcase-title">
        <div className="landing-showcase-head">
          <p className="landing-showcase-eyebrow">{vi ? 'Sản phẩm chủ lực' : 'Flagship tools'}</p>
          <h2 id="landing-showcase-title">
            {vi ? 'Hai công cụ chúng tôi tự dựng và dùng mỗi ngày' : 'Two tools we built and use every day'}
          </h2>
          <p>
            {vi
              ? 'Không chỉ là bài học — đây là phần mềm thật: một không gian làm việc kiểu Jira và một agent lập trình chạy ngay trong app desktop.'
              : 'Not just lessons — real software: a Jira-style workspace and a coding agent that runs right inside the desktop app.'}
          </p>
        </div>

        <div className="landing-showcase-grid">
          {/* ── CT Work ────────────────────────────────────────────────── */}
          <article className="landing-showcase-card">
            <div className="landing-showcase-mock">
              <span className="landing-showcase-mock-bar" aria-hidden>
                <i />
                <i />
                <i />
              </span>
              {/* TODO: ảnh/video demo CT Work */}
              <img
                className="landing-showcase-mock-logo"
                src="/images/ct-work/ct-work.svg"
                alt={vi ? 'Biểu trưng CT Work' : 'CT Work logo'}
                width={72}
                height={72}
                loading="lazy"
              />
              <span className="landing-showcase-mock-tag">
                {vi ? 'Bản xem trước demo sắp có' : 'Demo preview coming soon'}
              </span>
            </div>
            <div className="landing-showcase-card-head">
              <p className="landing-showcase-kicker">{vi ? 'Quản lý dự án & lớp học' : 'Projects & classrooms'}</p>
              <h3>CT Work</h3>
            </div>
            <ul className="landing-showcase-list">
              <li>{vi ? 'Board, sprint và issue kiểu Jira' : 'Jira-style boards, sprints & issues'}</li>
              <li>{vi ? 'AI agent làm việc qua MCP' : 'AI agents that work through MCP'}</li>
              <li>{vi ? 'Tích hợp Microsoft · Google · Notion · Slack' : 'Microsoft · Google · Notion · Slack integrations'}</li>
              <li>{vi ? 'Báo cáo, lớp học và cổng khách' : 'Reports, classrooms and a client portal'}</li>
            </ul>
            <div className="landing-showcase-cta">
              <Link href="/work" className="landing-primary-action">
                <span>{vi ? 'Mở CT Work' : 'Open CT Work'}</span>
                <ArrowRight aria-hidden size={17} />
              </Link>
            </div>
          </article>

          {/* ── AI Code (desktop) ──────────────────────────────────────── */}
          <article className="landing-showcase-card">
            <div className="landing-showcase-mock">
              <span className="landing-showcase-mock-bar" aria-hidden>
                <i />
                <i />
                <i />
              </span>
              {/* TODO: ảnh/video demo AI Code */}
              <img
                className="landing-showcase-mock-logo"
                src="/logos/ai-code.svg"
                alt={vi ? 'Biểu trưng AI Code' : 'AI Code logo'}
                width={72}
                height={72}
                loading="lazy"
              />
              <span className="landing-showcase-mock-tag">
                {vi ? 'Bản xem trước demo sắp có' : 'Demo preview coming soon'}
              </span>
            </div>
            <div className="landing-showcase-card-head">
              <p className="landing-showcase-kicker">{vi ? 'App desktop' : 'Desktop app'}</p>
              <h3>AI Code</h3>
            </div>
            <ul className="landing-showcase-list">
              <li>{vi ? 'Agent lập trình cùng bạn ngay trong app' : 'An agent that codes alongside you, in-app'}</li>
              <li>{vi ? 'Claude qua cổng riêng, trả lời chảy dần' : 'Claude through a dedicated gateway, real streaming'}</li>
              <li>{vi ? 'Nhiều model để chọn theo việc' : 'Multiple models to pick per task'}</li>
              <li>{vi ? 'Chạy trong Electron, có chế độ ngoại tuyến' : 'Runs in Electron, with an offline mode'}</li>
            </ul>
            <div className="landing-showcase-cta">
              <Link href="/download" className="landing-primary-action">
                <span>{vi ? 'Tải app' : 'Get the app'}</span>
                <ArrowRight aria-hidden size={17} />
              </Link>
            </div>
          </article>
        </div>
      </section>

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
          </nav>
        </div>
      </footer>
    </main>
  );
}
