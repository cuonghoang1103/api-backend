'use client';

/**
 * /about — rebuilt 02/11/2026 in two parts, as the owner asked:
 *   1. About this website — what CuongThai is and what you can do here, with
 *      live counts from GET /api/v1/about/stats and the repo counts in
 *      `codebaseStats.json`.
 *   2. About me — the owner, using only what the site already stated (see
 *      `aboutCopy.ts`). Unknown facts are placeholders for the owner, hidden
 *      from visitors.
 *
 * The 08/08/2026 rule still holds: every number must be COUNTED. A count that
 * failed to load hides its figure — it is never replaced by 0 or a guess.
 *
 * Language: copy is picked per render from `useTranslation().locale`, so the
 * EN/VI switch in the top bar re-renders the page instantly, no reload.
 */
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Check, Copy, Plus } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { contactApi } from '@/lib/api';
import { useAboutStats, usePublicCv, fmt, type AboutStats } from '@/components/about/useAboutData';
import Footer from '@/components/home/Footer';
import codebase from '@/data/codebaseStats.json';
import { MENU_HUE, MENU_LABEL, MENU_ORDER, type MenuId } from '@/components/layout/nav/navLabels';
import { NAV_TREE, type NavItem } from '@/components/layout/nav/navTree';
import { INCIDENTS, SELF_ASSESSED_SKILLS, TECH_STACK, tx } from './aboutData';
import { BIO, OWNER, OWNER_TODO, PLACEHOLDER_LABEL, aboutCopy } from './aboutCopy';
import s from './about.module.css';

const EASE = [0.22, 1, 0.36, 1] as const;

/** Find a menu item (and the menu it sits in) by href. */
function findItem(href: string): { item: NavItem; menu: MenuId } | null {
  for (const m of NAV_TREE) for (const sec of m.sections) for (const it of sec.items) {
    if (it.href === href) return { item: it, menu: m.id };
  }
  return null;
}

/** The features shown under "What you can do here", each tied to a live count. */
const FEATURES: { href: string; stat?: keyof AboutStats; unit?: { en: string; vi: string } }[] = [
  { href: '/academy', stat: 'courses', unit: { en: 'subjects & courses', vi: 'môn & khoá học' } },
  { href: '/courses', stat: 'lessons', unit: { en: 'lessons', vi: 'bài học' } },
  { href: '/code-lab', stat: 'exercises', unit: { en: 'graded exercises', vi: 'bài tập chấm tự động' } },
  { href: '/exam', stat: 'examQuestions', unit: { en: 'exam questions', vi: 'câu hỏi thi' } },
  { href: '/language', stat: 'vocabWords', unit: { en: 'words to learn', vi: 'từ vựng' } },
  { href: '/interview', stat: 'interviewQuestions', unit: { en: 'interview questions', vi: 'câu hỏi phỏng vấn' } },
  { href: '/roadmap', stat: 'roadmapNodes', unit: { en: 'roadmap steps', vi: 'mốc lộ trình' } },
  { href: '/work' },
  { href: '/chat' },
];

const CODE_COUNTS: { key: keyof typeof codebase; label: { en: string; vi: string } }[] = [
  { key: 'commits', label: { en: 'Commits', vi: 'Lượt commit' } },
  { key: 'daysBuilding', label: { en: 'Days building', vi: 'Ngày xây dựng' } },
  { key: 'pages', label: { en: 'Web pages', vi: 'Trang web' } },
  { key: 'apiRouters', label: { en: 'API routers', vi: 'Router API' } },
  { key: 'prismaModels', label: { en: 'Database tables', vi: 'Bảng dữ liệu' } },
  { key: 'migrations', label: { en: 'Schema migrations', vi: 'Lần đổi lược đồ' } },
  { key: 'sourceFiles', label: { en: 'Source files', vi: 'Tệp mã nguồn' } },
  { key: 'sourceLines', label: { en: 'Lines of code', vi: 'Dòng mã' } },
];

const HIRE = ['/about/studio', '/about/nhan-du-an', '/about/quy-trinh'];

type SectionId = 'site' | 'me' | 'contact';

export default function AboutPage() {
  const { locale } = useTranslation();
  const lang: 'en' | 'vi' = locale === 'vi' ? 'vi' : 'en';
  const c = aboutCopy(lang);
  const reduce = useReducedMotion();
  const stats = useAboutStats();
  const cv = usePublicCv();
  const n = (v: number | null | undefined) => fmt(v, lang);

  // Owner placeholders: visible in dev, or with ?placeholders=1 — never to ordinary visitors.
  const [showTodo, setShowTodo] = useState(process.env.NODE_ENV !== 'production');
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has('placeholders')) setShowTodo(true);
  }, []);

  // ── Sticky section switch follows the scroll ───────────────────────────
  const [active, setActive] = useState<SectionId>('site');
  const refs = { site: useRef<HTMLElement>(null), me: useRef<HTMLElement>(null), contact: useRef<HTMLElement>(null) };
  useEffect(() => {
    const els = (['site', 'me', 'contact'] as SectionId[]).map((id) => refs[id].current).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id as SectionId);
      },
      { rootMargin: '-40% 0px -55% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Honour /about#contact etc. after the client render.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    const t = window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }), 120);
    return () => window.clearTimeout(t);
  }, []);

  const mapRows = useMemo(
    () => MENU_ORDER.map((id) => {
      const menu = NAV_TREE.find((m) => m.id === id)!;
      const first = menu.sections.flatMap((sec) => sec.items).find((it) => !it.gate) ?? menu.sections[0].items[0];
      const names = menu.sections.flatMap((sec) => sec.items).slice(0, 4).map((it) => it.title[lang]);
      return { id, href: first.href, icon: first.icon, names: names.join(', ') };
    }),
    [lang],
  );

  const reveal = (i = 0) => (reduce
    ? {}
    : {
        initial: { opacity: 0, y: 14 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-60px' },
        transition: { duration: 0.5, delay: i * 0.05, ease: EASE },
      });

  const countedAt = stats?.computedAt
    ? new Date(stats.computedAt).toLocaleString(lang === 'vi' ? 'vi-VN' : 'en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
    : null;
  const firstCommit = new Date(codebase.firstCommitDate).toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-GB', { month: 'long', year: 'numeric' });

  const codeCountedOn = new Date(codebase.generatedAt).toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  // ── Contact ────────────────────────────────────────────────────────────
  const [copied, setCopied] = useState(false);
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(OWNER.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${OWNER.email}`;
    }
  };
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sendState, setSendState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendState('sending');
    try {
      await contactApi.submit({ name: form.name, email: form.email, subject: form.subject || undefined, message: form.message });
      setForm({ name: '', email: '', subject: '', message: '' });
      setSendState('sent');
    } catch {
      setSendState('error');
    }
  };

  const [openIncident, setOpenIncident] = useState<number | null>(0);

  const Placeholder = ({ k }: { k: keyof typeof OWNER_TODO }) => (
    <span className={s.placeholder} title={c.placeholderHint}>+ {PLACEHOLDER_LABEL[k][lang]}</span>
  );

  return (
    <div className={s.page}>
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <header className={s.hero}>
        <div className={`${s.wrap} ${s.heroGrid}`}>
          <div>
            <motion.p className={s.heroLabel} initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              {c.pageLabel}
            </motion.p>
            <motion.h1
              key={`h1-${lang}`}
              className={`${s.display} ${s.heroTitle}`}
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              {c.heroTitle}
            </motion.h1>
            <motion.p
              className={s.heroBody}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1, ease: EASE }}
            >
              {c.heroBody}
            </motion.p>
            <motion.div
              className={s.jump}
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18, ease: EASE }}
            >
              <a href="#site" className={s.jumpLink} data-primary="true">{c.jumpSite} <ArrowRight size={16} aria-hidden /></a>
              <a href="#me" className={s.jumpLink}>{c.jumpMe}</a>
              <a href="#contact" className={s.jumpLink}>{c.jumpContact}</a>
            </motion.div>
          </div>

          <nav className={s.map} aria-label={c.mapTitle}>
            <div className={s.mapTitle}>{c.mapTitle}</div>
            {mapRows.map((r, i) => {
              const Icon = r.icon;
              return (
                <motion.div
                  key={r.id}
                  initial={reduce ? false : { opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.45, delay: 0.15 + i * 0.07, ease: EASE }}
                >
                  <Link href={r.href} className={s.mapRow} style={{ ['--hue' as string]: MENU_HUE[r.id] }}>
                    <span className={s.tile} aria-hidden><Icon /></span>
                    <span style={{ minWidth: 0 }}>
                      <div className={s.mapName}>{MENU_LABEL[r.id][lang]}</div>
                      <div className={s.mapSub}>{r.names}</div>
                    </span>
                    <ArrowRight size={16} className={s.mapArrow} aria-hidden />
                  </Link>
                </motion.div>
              );
            })}
          </nav>
        </div>
      </header>

      {/* ── Sticky section switch ──────────────────────────────────────── */}
      <div className={s.subnav}>
        <div className={`${s.wrap} ${s.subnavInner}`}>
          {([['site', c.jumpSite], ['me', c.jumpMe], ['contact', c.jumpContact]] as [SectionId, string][]).map(([id, label]) => (
            <a key={id} href={`#${id}`} className={s.subnavLink} aria-current={active === id ? 'true' : undefined}>
              {active === id && (
                <motion.span layoutId="about-subnav-pill" className={s.subnavPill} transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 36 }} />
              )}
              <span>{label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* ── 1. About this website ─────────────────────────────────────── */}
      <section id="site" ref={refs.site} className={s.section}>
        <div className={s.wrap}>
          <motion.h2 className={`${s.display} ${s.h2}`} {...reveal()}>{c.siteTitle}</motion.h2>
          <motion.p className={s.lead} {...reveal(1)}>{c.siteLead}</motion.p>
          <motion.p className={s.body} style={{ marginTop: '1rem' }} {...reveal(2)}>{c.siteBody}</motion.p>

          <div className={s.sub}>
            <div className={s.subHead}>
              <h3 className={s.h3}>{c.doTitle}</h3>
              {countedAt && <span className={s.meta}>{c.countedAt} {countedAt}</span>}
            </div>
            <div className={s.features}>
              {FEATURES.map((f, i) => {
                const found = findItem(f.href);
                if (!found) return null;
                const { item, menu } = found;
                const Icon = item.icon;
                const value = f.stat ? (stats?.[f.stat] as number | null | undefined) : undefined;
                return (
                  <motion.div key={f.href} {...reveal(i % 3)}>
                    <Link href={f.href} className={s.feature} style={{ ['--hue' as string]: MENU_HUE[menu] }}>
                      <div className={s.featureTop}>
                        <span className={s.tile} aria-hidden><Icon /></span>
                        {typeof value === 'number' && value > 0 && f.unit && (
                          <span className={s.featureStat}>
                            <div className={s.featureNum}>{n(value)}</div>
                            <div className={s.featureUnit}>{f.unit[lang]}</div>
                          </span>
                        )}
                      </div>
                      <div>
                        <div className={s.featureTitle}>{item.title[lang]}</div>
                        <p className={s.featureDesc} style={{ margin: '0.3rem 0 0' }}>{item.desc[lang]}</p>
                      </div>
                      <span className={s.featureOpen}>{c.open} <ArrowRight size={14} aria-hidden /></span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className={s.sub}>
            <div className={s.subHead}>
              <h3 className={s.h3}>{c.codeTitle}</h3>
              <span className={s.meta}>{c.codeBody} {codeCountedOn}</span>
            </div>
            <div className={s.counts}>
              {CODE_COUNTS.map(({ key, label }) => {
                const v = codebase[key];
                if (typeof v !== 'number' || v <= 0) return null;
                return (
                  <div key={key} className={s.count}>
                    <div className={s.countNum}>{n(v)}</div>
                    <div className={s.countLabel}>{label[lang]}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={s.sub}>
            <div className={s.subHead}><h3 className={s.h3}>{c.stackTitle}</h3></div>
            <div className={s.stack}>
              {TECH_STACK.map((g) => (
                <div key={tx(g.group, 'en')} className={s.stackGroup} style={{ ['--hue' as string]: g.accent }}>
                  <div className={s.stackName}><i aria-hidden />{tx(g.group, lang)}</div>
                  <div className={s.stackItems}>{g.items.map((it) => tx(it, lang)).join(' · ')}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. About me ───────────────────────────────────────────────── */}
      <section id="me" ref={refs.me} className={s.section}>
        <div className={s.wrap}>
          <motion.h2 className={`${s.display} ${s.h2}`} {...reveal()}>{c.meTitle}</motion.h2>
          <div className={s.meGrid}>
            <aside className={s.card}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={OWNER.photo} alt={OWNER.name} className={s.photo} width={352} height={352} />
              <div className={s.cardBody}>
                <h3 className={`${s.display} ${s.name}`}>{OWNER.name}</h3>
                <div className={s.role}>{OWNER.role[lang]}</div>
                <dl className={s.facts}>
                  <div className={s.fact}><dt>{c.meLocation}</dt><dd>{OWNER.location[lang]}</dd></div>
                  <div className={s.fact}><dt>{c.meLanguages}</dt><dd>{OWNER.languages[lang]}</dd></div>
                  <div className={s.fact}><dt>{c.meBuilding}</dt><dd>{firstCommit}</dd></div>
                  {(['education', 'experience', 'currently'] as const).map((k) => {
                    const v = OWNER_TODO[k];
                    if (!v && !showTodo) return null;
                    return (
                      <div key={k} className={s.fact}>
                        <dt>{PLACEHOLDER_LABEL[k][lang]}</dt>
                        <dd>{v ? v[lang] : <Placeholder k={k} />}</dd>
                      </div>
                    );
                  })}
                </dl>
                <div className={s.socials}>
                  {OWNER.socials.map((so) => (
                    <a key={so.label} href={so.href} target="_blank" rel="noopener noreferrer" className={s.chip}>
                      {so.label} <ArrowUpRight size={13} aria-hidden />
                    </a>
                  ))}
                  {cv?.available && <Link href="/cv/xem" className={s.chip}>{c.viewCv}</Link>}
                </div>
              </div>
            </aside>

            <div>
              <div className={s.bio}>
                {BIO.map((p, i) => <motion.p key={i} {...reveal(i)}>{p[lang]}</motion.p>)}
                {OWNER_TODO.story
                  ? <motion.p {...reveal(3)}>{OWNER_TODO.story[lang]}</motion.p>
                  : showTodo && <p><Placeholder k="story" /></p>}
                <p>{c.meOpenTo}</p>
              </div>

              <div className={s.sub}>
                <div className={s.subHead}>
                  <h3 className={s.h3}>{c.incidentsTitle}</h3>
                </div>
                <p className={s.body} style={{ marginBottom: '1.25rem' }}>{c.incidentsBody}</p>
                <div className={s.incidents}>
                  {INCIDENTS.map((inc, i) => {
                    const isOpen = openIncident === i;
                    return (
                      <div key={i} className={s.incident}>
                        <button
                          type="button"
                          className={s.incidentBtn}
                          aria-expanded={isOpen}
                          aria-controls={`incident-${i}`}
                          onClick={() => setOpenIncident(isOpen ? null : i)}
                        >
                          <span className={s.incidentNo}>{String(i + 1).padStart(2, '0')}</span>
                          <span>{inc.symptom[lang]}</span>
                          <Plus size={18} aria-hidden />
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              id={`incident-${i}`}
                              className={s.incidentBody}
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: reduce ? 0 : 0.3, ease: EASE }}
                            >
                              <div className={s.incidentInner}>
                                <div><h4>{c.cause}</h4><p>{inc.cause[lang]}</p></div>
                                <div><h4>{c.fix}</h4><p>{inc.fix[lang]}</p></div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className={s.sub}>
                <div className={s.subHead}>
                  <h3 className={s.h3}>{c.skillsTitle}</h3>
                  <span className={s.meta}>{c.skillsNote}</span>
                </div>
                <div className={s.skills}>
                  {SELF_ASSESSED_SKILLS.map((sk, i) => (
                    <div key={sk.name} className={s.skill}>
                      <div className={s.skillTop}><span>{sk.name}</span><span>{sk.level}%</span></div>
                      <div className={s.bar}>
                        <motion.i
                          style={{ width: `${sk.level}%` }}
                          initial={reduce ? false : { scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.7, delay: (i % 6) * 0.04, ease: EASE }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={s.sub}>
                <div className={s.subHead}><h3 className={s.h3}>{c.hireTitle}</h3></div>
                <p className={s.body} style={{ marginBottom: '1.25rem' }}>{c.hireBody}</p>
                <div className={s.hire}>
                  {HIRE.map((href) => {
                    const found = findItem(href);
                    if (!found) return null;
                    const Icon = found.item.icon;
                    return (
                      <Link key={href} href={href} className={s.feature} style={{ ['--hue' as string]: MENU_HUE.about }}>
                        <span className={s.tile} aria-hidden><Icon /></span>
                        <div>
                          <div className={s.featureTitle}>{found.item.title[lang]}</div>
                          <p className={s.featureDesc} style={{ margin: '0.3rem 0 0' }}>{found.item.desc[lang]}</p>
                        </div>
                        <span className={s.featureOpen}>{c.open} <ArrowRight size={14} aria-hidden /></span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact ───────────────────────────────────────────────────── */}
      <section id="contact" ref={refs.contact} className={s.section}>
        <div className={`${s.wrap} ${s.contactGrid}`}>
          <div>
            <motion.h2 className={`${s.display} ${s.h2}`} {...reveal()}>{c.contactTitle}</motion.h2>
            <p className={s.body}>{c.contactBody}</p>
            <div className={s.mailRow}>
              <a href={`mailto:${OWNER.email}`} className={s.mail}>{OWNER.email}</a>
              <button type="button" className={s.chip} onClick={copyEmail} aria-label={c.copyAria}>
                {copied ? <><Check size={14} aria-hidden /> {c.copied}</> : <><Copy size={14} aria-hidden /> {c.copy}</>}
              </button>
            </div>
            <div className={s.socials} style={{ marginTop: '1.5rem' }}>
              {OWNER.socials.map((so) => (
                <a key={so.label} href={so.href} target="_blank" rel="noopener noreferrer" className={s.chip}>
                  {so.label} <ArrowUpRight size={13} aria-hidden />
                </a>
              ))}
              <a href="https://zalo.me/0399360938" target="_blank" rel="noopener noreferrer" className={s.chip}>Zalo <ArrowUpRight size={13} aria-hidden /></a>
            </div>
          </div>

          <form className={s.form} onSubmit={submit}>
            <div className={s.formRow}>
              <label className={s.field}>{c.formName}
                <input className={s.input} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" />
              </label>
              <label className={s.field}>{c.formEmail}
                <input className={s.input} required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" />
              </label>
            </div>
            <label className={s.field}>{c.formSubject}
              <input className={s.input} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
            </label>
            <label className={s.field}>{c.formMessage}
              <textarea className={s.input} required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} style={{ resize: 'vertical' }} />
            </label>
            <button type="submit" className={s.submit} disabled={sendState === 'sending'}>
              {sendState === 'sending' ? c.formSending : c.formSend}
            </button>
            <div aria-live="polite" className={s.formNote}>
              {sendState === 'sent' && <span style={{ color: '#059669' }}>{c.formSent}</span>}
              {sendState === 'error' && <span style={{ color: '#dc2626' }}>{c.formError}</span>}
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
