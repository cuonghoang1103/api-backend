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
  const visibleStats = [
    { value: stats?.exercises, label: copy.stats.exercises },
    { value: stats?.examQuestions, label: copy.stats.examQuestions },
    { value: stats?.subjects, label: copy.stats.subjects },
  ].filter((item): item is { value: number; label: string } => typeof item.value === 'number');

  return (
    <main className="landing-root min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
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
          <dl className="landing-stats" aria-label={locale === 'vi' ? 'Số liệu nội dung' : 'Content statistics'}>
            {visibleStats.map((item) => (
              <div key={item.label} className="landing-stat">
                <dd>{fmt(item.value)}</dd>
                <dt>{item.label}</dt>
              </div>
            ))}
          </dl>
        )}
      </header>

      <DeepDives />

      <section id="discover" className="landing-directory-shell">
        {rails.map((rail, index) => (
          <article key={rail.label} className="landing-rail" data-reverse={index % 2 === 1 ? 'true' : undefined}>
            <div className="landing-rail-intro">
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
