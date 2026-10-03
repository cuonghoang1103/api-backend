'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PHASES, STAGES, pick } from './data';
import s from '@/components/studio/showroom.module.css';

export default function PhaseExplorer({ lang }: { lang: 'vi' | 'en' }) {
  const [phase, setPhase] = useState(PHASES[0].key);
  const stages = STAGES.filter((stage) => stage.phase === phase);
  const active = PHASES.find((item) => item.key === phase)!;
  return (
    <div className={s.explorer}>
      <div className={s.phaseNav} role="group" aria-label={lang === 'vi' ? 'Chọn pha' : 'Choose a phase'}>
        {PHASES.map((item, index) => (
          <button key={item.key} type="button" aria-pressed={phase === item.key} aria-controls="phase-content" onClick={() => setPhase(item.key)} className={`${s.phaseButton} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}>
            <span aria-hidden="true">0{index + 1}</span>{pick(item.label, lang)}
          </button>
        ))}
      </div>
      <div id="phase-content" className={s.phaseContent} aria-live="polite" aria-atomic="true">
        <h2 className={s.phaseHeading}>{pick(active.label, lang)}</h2>
        {stages.map((stage) => (
          <Link key={stage.slug} href={`/about/quy-trinh/${stage.slug}`} className={`${s.stage} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}>
            <span className={s.stageNumber}>{String(stage.n).padStart(2, '0')}</span>
            <div>
              <h3>{pick(stage.title, lang)}</h3>
              <p>{pick(stage.goal, lang)}</p>
              <small>{stage.deliverables.length} {lang === 'vi' ? 'đầu ra bàn giao · Xem chi tiết' : 'deliverables · View details'}</small>
            </div>
            <span aria-hidden="true">↗</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
