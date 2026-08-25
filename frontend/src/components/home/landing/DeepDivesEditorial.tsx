'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { DEEP_DIVES } from './deepDivesData';
import { getLandingCopy } from './landingCopy';

export default function DeepDivesEditorial() {
  const { locale } = useTranslation();
  const copy = getLandingCopy(locale).deepDives;

  return (
    <section className="landing-deep-dives">
      <div className="landing-deep-heading">
        <h2>{copy.title}</h2>
        <p>{copy.body}</p>
      </div>

      <ul className="landing-deep-grid">
        {DEEP_DIVES.map((d, index) => {
          const destination = d.article ? `/tech-trends/${d.article}` : d.href!;
          const translated = copy.items[d.title];
          const title = translated?.title ?? d.title;
          const blurb = translated?.blurb ?? d.blurb;
          const via = translated?.via ?? d.via;

          return (
            <li key={d.title} data-featured={index === 0 ? 'true' : undefined}>
              <Link href={destination} className="landing-deep-card">
                <div className="landing-deep-card-top">
                  <img
                    src={`/logos/${d.logo}.svg`}
                    alt=""
                    width={36}
                    height={36}
                    loading="lazy"
                  />
                  <span>{String(index + 1).padStart(2, '0')}</span>
                </div>
                <div className="landing-deep-card-copy">
                  <h3>{title}</h3>
                  <p>{blurb}</p>
                  {via && <small>{via}</small>}
                </div>
                <span className="landing-deep-card-action">
                  {d.article ? copy.read : copy.open}
                  <ArrowUpRight aria-hidden size={16} />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
