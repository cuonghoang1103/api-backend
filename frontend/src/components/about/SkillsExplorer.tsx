'use client';

/**
 * Interactive, colourful replacement for the old flat skill bars on /about.
 *
 * Skills are grouped by what they do (Backend, Frontend, Data, …), each group
 * coloured by its TECH_STACK accent. Tapping a chip opens an inline detail panel
 * (framer-motion spring) under that group: a proficiency bar that fills on open,
 * a short bilingual "what I know" blurb, and chips that deep-link to the REAL
 * products that use the skill (resolved from `BUILT`, so links never drift).
 *
 * Honesty is kept: the "self-assessed, not a test score" note stays, and the
 * levels come straight from `SELF_ASSESSED_SKILLS`. Keyboard accessible
 * (buttons, aria-expanded/controls); under prefers-reduced-motion the panel just
 * fades and the bar appears already filled.
 */
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { SELF_ASSESSED_SKILLS, SKILL_CATEGORIES, type ProductKey, type SelfSkill } from '@/app/about/aboutData';
import type { BuiltProduct } from '@/app/about/aboutProducts';
import s from '@/app/about/about.module.css';

const EASE = [0.22, 1, 0.36, 1] as const;

type ResolvedLink = { name: string; href: string; external: boolean };

export default function SkillsExplorer({
  lang,
  reduce,
  products,
  open,
  onToggle,
}: {
  lang: 'en' | 'vi';
  reduce: boolean | null;
  products: BuiltProduct[];
  open: string | null;
  onToggle: (name: string | null) => void;
}) {
  // productKey → a real destination + display name, from the product list itself.
  const byKey = new Map<ProductKey, ResolvedLink>();
  for (const p of products) {
    const primary = p.links[0];
    if (primary) byKey.set(p.id as ProductKey, { name: p.name, href: primary.href, external: !!primary.external });
  }

  const openSkill = open ? SELF_ASSESSED_SKILLS.find((sk) => sk.name === open) ?? null : null;

  const renderPanel = (sk: SelfSkill, accent: string) => {
    const used = sk.usedIn.map((k) => byKey.get(k)).filter(Boolean) as ResolvedLink[];
    return (
      <motion.div
        id={`skill-panel-${sk.name}`}
        className={s.skillPanel}
        style={{ ['--hue' as string]: accent }}
        initial={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
        animate={reduce ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
        transition={reduce ? { duration: 0.15 } : { type: 'spring', stiffness: 260, damping: 30 }}
      >
        <div className={s.skillPanelInner}>
          <div className={s.skillPanelHead}>
            <span className={s.skillPanelName}>{sk.name}</span>
            <span className={s.skillPanelPct}>{sk.level}%</span>
          </div>
          <div className={s.skillBigBar} role="meter" aria-valuenow={sk.level} aria-valuemin={0} aria-valuemax={100} aria-label={sk.name}>
            <motion.span
              className={s.skillBigFill}
              initial={reduce ? false : { transform: 'scaleX(0)' }}
              animate={{ transform: `scaleX(${sk.level / 100})` }}
              transition={reduce ? { duration: 0 } : { duration: 0.9, ease: EASE, delay: 0.05 }}
            />
          </div>
          <p className={s.skillKnow}>{sk.know[lang]}</p>
          {used.length > 0 && (
            <div className={s.skillUsed}>
              {used.map((u) => (u.external
                ? (
                  <a key={u.href + u.name} href={u.href} target="_blank" rel="noopener noreferrer" className={s.skillUsedChip}>
                    {u.name} <ArrowUpRight size={12} aria-hidden />
                  </a>
                )
                : u.href.startsWith('#')
                  ? <a key={u.href + u.name} href={u.href} className={s.skillUsedChip}>{u.name} <ArrowRight size={12} aria-hidden /></a>
                  : <Link key={u.href + u.name} href={u.href} className={s.skillUsedChip}>{u.name} <ArrowRight size={12} aria-hidden /></Link>))}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className={s.skillGroups}>
      {SKILL_CATEGORIES.map((cat) => {
        const skills = SELF_ASSESSED_SKILLS.filter((sk) => sk.category === cat.id);
        if (skills.length === 0) return null;
        const panelHere = openSkill && openSkill.category === cat.id ? openSkill : null;
        return (
          <div key={cat.id} className={s.skillGroup} style={{ ['--hue' as string]: cat.accent }}>
            <div className={s.skillGroupHead}>
              <i aria-hidden />
              <span>{cat.label[lang]}</span>
            </div>
            <div className={s.skillChips}>
              {skills.map((sk) => {
                const active = open === sk.name;
                return (
                  <button
                    key={sk.name}
                    type="button"
                    className={s.skillChip}
                    data-active={active ? 'true' : undefined}
                    aria-expanded={active}
                    aria-controls={`skill-panel-${sk.name}`}
                    onClick={() => onToggle(active ? null : sk.name)}
                  >
                    <span className={s.skillChipName}>{sk.name}</span>
                    <span className={s.skillChipPct}>{sk.level}%</span>
                    <span className={s.skillChipBar} aria-hidden>
                      <span className={s.skillChipBarFill} style={{ width: `${sk.level}%` }} />
                    </span>
                  </button>
                );
              })}
            </div>
            <AnimatePresence initial={false}>
              {panelHere && renderPanel(panelHere, cat.accent)}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
