'use client';

import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import PlaygroundGate from './PlaygroundGate';
import { getLandingCopy } from './landingCopy';

export default function PlaygroundPreview() {
  const { locale } = useTranslation();
  const copy = getLandingCopy(locale).hero;
  const figureRef = useRef<HTMLElement | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
  }, []);

  const updateTilt = (event: ReactPointerEvent<HTMLElement>) => {
    if (
      event.pointerType !== 'mouse' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !window.matchMedia('(hover: hover) and (pointer: fine)').matches
    ) {
      return;
    }

    const element = figureRef.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    frameRef.current = window.requestAnimationFrame(() => {
      element.dataset.tilting = 'true';
      element.style.setProperty('--landing-tilt-x', `${(-y * 4).toFixed(2)}deg`);
      element.style.setProperty('--landing-tilt-y', `${(x * 5).toFixed(2)}deg`);
    });
  };

  const resetTilt = () => {
    const element = figureRef.current;
    if (!element) return;
    if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    frameRef.current = window.requestAnimationFrame(() => {
      delete element.dataset.tilting;
      element.style.setProperty('--landing-tilt-x', '0deg');
      element.style.setProperty('--landing-tilt-y', '0deg');
    });
  };

  return (
    <figure
      ref={figureRef}
      className="landing-playground-preview"
      onPointerMove={updateTilt}
      onPointerLeave={resetTilt}
      aria-describedby="landing-playground-caption"
    >
      <div className="landing-playground-image">
        <Image
          src="/playground/social/share-image.png"
          alt={copy.proofTitle}
          fill
          priority
          sizes="(max-width: 959px) 100vw, 44vw"
          className="landing-playground-image-media"
        />
        <span className="landing-playground-label">{copy.proofLabel}</span>
      </div>

      <figcaption id="landing-playground-caption" className="landing-playground-caption">
        <div>
          <p className="landing-playground-title">{copy.proofTitle}</p>
          <p className="landing-playground-note">{copy.proofBody}</p>
        </div>
        <PlaygroundGate className="landing-playground-cta">
          <span>{copy.proofCta}</span>
          <ArrowUpRight aria-hidden size={16} />
        </PlaygroundGate>
      </figcaption>
    </figure>
  );
}
