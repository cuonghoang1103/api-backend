'use client';

/**
 * "How it all runs" — an animated map of the owner's real system, top (the apps
 * people open) to bottom (database and AI), all on one Docker-managed VPS.
 *
 * Tiers reveal and the connecting rails draw in as the map scrolls into view;
 * nodes float and the rails carry a travelling pulse. Product nodes deep-link to
 * the real thing (from `SYSTEM_MAP`); infra nodes have no public page and are not
 * links. Pure div/CSS + framer-motion — no new deps. Legible in dark theme,
 * stacks at phone width, and under prefers-reduced-motion it is a plain static
 * layout with no motion.
 */
import { Fragment } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SYSTEM_MAP, tx } from '@/app/about/aboutData';
import s from '@/app/about/about.module.css';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function SystemMap({ lang, reduce, legend }: { lang: 'en' | 'vi'; reduce: boolean | null; legend: string }) {
  let nodeIndex = 0;
  return (
    <div className={s.map2} data-reduce={reduce ? 'true' : undefined}>
      {SYSTEM_MAP.map((tier, ti) => (
        <Fragment key={tier.id}>
          {ti > 0 && (
            <div className={s.rail} aria-hidden>
              <motion.span
                className={s.railLine}
                initial={reduce ? false : { scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={reduce ? { duration: 0 } : { duration: 0.5, ease: EASE, delay: 0.1 }}
              />
              {!reduce && <span className={s.railPulse} />}
            </div>
          )}
          <motion.div
            className={s.tier}
            initial={reduce ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={reduce ? { duration: 0 } : { duration: 0.5, ease: EASE }}
          >
            <div className={s.tierLabel}>{tier.label[lang]}</div>
            <div className={s.tierNodes}>
              {tier.nodes.map((node) => {
                const i = nodeIndex++;
                const inner = (
                  <>
                    <span className={s.mapNodeDot} aria-hidden />
                    <span className={s.mapNodeText}>
                      <span className={s.mapNodeName}>{tx(node.label, lang)}</span>
                      <span className={s.mapNodeSub}>{node.sub[lang]}</span>
                    </span>
                    {node.href && <ArrowRight size={14} className={s.mapNodeArrow} aria-hidden />}
                  </>
                );
                const style = {
                  ['--hue' as string]: node.accent,
                  animationDelay: `${(i % 7) * 0.4}s`,
                } as React.CSSProperties;
                return node.href ? (
                  <Link key={node.id} href={node.href} className={s.mapNode} data-link="true" style={style}>
                    {inner}
                  </Link>
                ) : (
                  <div key={node.id} className={s.mapNode} style={style}>
                    {inner}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </Fragment>
      ))}
      <div className={s.mapLegend}>
        <span className={s.mapLegendDot} aria-hidden />
        {legend}
      </div>
    </div>
  );
}
