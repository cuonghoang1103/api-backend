'use client';

import { useEffect, useRef } from 'react';

/** Progressive enhancement: content stays visible without JS or motion support. */
export default function ScrollReveal() {
  const marker = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const root = marker.current?.parentElement;
    if (!root || !('IntersectionObserver' in window)) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const animations = new Set<Animation>();
    let observer: IntersectionObserver | undefined;
    const setup = () => {
      observer?.disconnect();
      animations.forEach(animation => animation.cancel());
      animations.clear();
      if (preference.matches) return;
      const targets = root.querySelectorAll<HTMLElement>('section h2, section article, [data-scroll-reveal]');
      observer = new IntersectionObserver(entries => {
        entries.forEach((entry, index) => {
          if (!entry.isIntersecting) return;
          const target = entry.target as HTMLElement;
          observer?.unobserve(target);
          const animation = target.animate([
            { opacity: 0, transform: 'translateY(32px)' },
            { opacity: 1, transform: 'translateY(0)' },
          ], { duration: 750, delay: Math.min(index % 4 * 90, 270), easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' });
          animations.add(animation);
          animation.onfinish = () => animations.delete(animation);
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
      targets.forEach(target => observer?.observe(target));
    };
    setup();
    preference.addEventListener('change', setup);
    return () => {
      observer?.disconnect();
      preference.removeEventListener('change', setup);
      animations.forEach(animation => animation.cancel());
    };
  }, []);
  return <span ref={marker} hidden aria-hidden="true" />;
}
