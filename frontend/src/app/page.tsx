'use client';

import Link from 'next/link';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { blogApi } from '@/lib/api';
import type { Post, Category } from '@/types';
import { useProjectStore } from '@/store/projectStore';
import { useTranslation } from '@/hooks/useTranslation';
import BlogCard from '@/components/blog/BlogCard';
import ServicesSection from '@/components/home/ServicesSection';
import ContactSection from '@/components/home/ContactSection';
import Footer from '@/components/home/Footer';
import StatsSection from '@/components/home/StatsSection';
import HomeBackground from '@/components/home/HomeBackground';
import { formatNumber } from '@/lib/utils';
import { ArrowRight, Sparkles, Code2, Terminal, Zap, Brain, Gem, Search, ChevronRight } from 'lucide-react';

export default function HomePage() {
  const { t, locale } = useTranslation();
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  // Project store binding is kept ready for the future
  // admin/home/featured-projects section, but it's intentionally not
  // dereferenced here while that surface is still WIP.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _bindFeaturedProjects = useProjectStore((s) => s.getFeaturedProjects);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, categoriesRes] = await Promise.all([
          blogApi.getPosts({ size: 6 }),
          blogApi.getCategories(),
        ]);
        const posts = Array.isArray(postsRes.data?.data) ? postsRes.data.data : [];
        setFeaturedPosts(posts);
        setCategories(categoriesRes.data.data || []);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- Omni-Command Bar ---
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [placeholderText, setPlaceholderText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const placeholderPhrases = [
    "Type /projects to explore...",
    "Ask anything about Cuong's stack...",
    "Type /shop to view AI tools...",
    "Try /chat for AI assistance...",
  ];
  useEffect(() => {
    const phrase = placeholderPhrases[placeholderIdx];
    let charIdx = 0;
    setIsTyping(true);
    const typeInterval = setInterval(() => {
      setPlaceholderText(phrase.slice(0, charIdx + 1));
      charIdx++;
      if (charIdx >= phrase.length) {
        clearInterval(typeInterval);
        setTimeout(() => setIsTyping(false), 2200);
      }
    }, 38);
    return () => clearInterval(typeInterval);
  }, [placeholderIdx]);
  useEffect(() => {
    if (!isTyping) {
      const t = setTimeout(() => {
        setPlaceholderIdx((p) => (p + 1) % placeholderPhrases.length);
      }, 600);
      return () => clearTimeout(t);
    }
  }, [isTyping]);

  // --- Bento Benefit Cards ---
  const bentoCards = [
    {
      icon: Zap,
      titleKey: 'benefits.fastDelivery.title',
      desc: 'MVP ready in 2-4 weeks. Ship fast, iterate faster.',
      color: 'indigo',
      colSpan: 'col-span-1',
      accent: '#6366f1',
    },
    {
      icon: Brain,
      titleKey: 'benefits.aiPowered.title',
      desc: 'RAG + Gemini + Spring Boot — AI that actually works.',
      color: 'violet',
      colSpan: 'col-span-1',
      accent: '#8b5cf6',
    },
    {
      icon: Gem,
      titleKey: 'benefits.highQuality.title',
      desc: 'SonarQube A+, 99% maintainability, clean architecture.',
      color: 'fuchsia',
      colSpan: 'col-span-1',
      accent: '#d946ef',
    },
  ];

  // --- Mouse tracking for avatar glow ---
  const avatarRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 20 });
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!avatarRef.current) return;
    const rect = avatarRef.current.getBoundingClientRect();
    mouseX.set(((e.clientX - rect.left) / rect.width - 0.5) * 40);
    mouseY.set(((e.clientY - rect.top) / rect.height - 0.5) * 40);
  }, [mouseX, mouseY]);

  // --- Floating tech tags ---
  const techTags = [
    { label: 'Next.js', color: 'bg-gray-800 border-gray-600 text-gray-200', x: '12%', y: '8%', delay: 0, float: '-8px' },
    { label: 'Spring Boot', color: 'bg-green-900/60 border-green-600 text-green-300', x: '80%', y: '15%', delay: 0.4, float: '-12px' },
    { label: 'TypeScript', color: 'bg-blue-900/60 border-blue-500 text-blue-300', x: '85%', y: '65%', delay: 0.8, float: '-6px' },
    { label: 'PostgreSQL', color: 'bg-indigo-900/60 border-indigo-500 text-indigo-300', x: '5%', y: '70%', delay: 1.2, float: '-10px' },
    { label: 'Gemini AI', color: 'bg-purple-900/60 border-purple-500 text-purple-300', x: '50%', y: '0%', delay: 1.6, float: '-7px' },
    { label: 'Docker', color: 'bg-cyan-900/60 border-cyan-600 text-cyan-300', x: '70%', y: '85%', delay: 2.0, float: '-9px' },
  ];

  // --- System status ticker ---
  const systemStats = [
    { label: 'Supabase DB', status: 'Operational', latency: '14ms', ok: true },
    { label: 'Gemini API', status: 'Connected', latency: '82ms', ok: true },
    { label: 'Active Projects', status: '12', latency: '', ok: true },
    { label: 'AI Tokens Today', status: '4.2M', latency: '', ok: true },
    { label: 'Uptime', status: '99.97%', latency: '', ok: true },
    { label: 'CDN', status: 'Edge 47', latency: '8ms', ok: true },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0f' }}>
      {/* ── Multi-Layer Canvas Background ── */}
      <HomeBackground />

      {/* Hero Section */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden pt-16 pb-8">
        {/* Layered background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[15%] left-[10%] w-[500px] h-[500px] bg-neon-indigo/15 rounded-full blur-[160px] animate-pulse" />
          <div className="absolute bottom-[20%] right-[5%] w-[450px] h-[450px] bg-neon-violet/15 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '0.8s' }} />
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-neon-fuchsia/8 rounded-full blur-[100px]" />
          {/* Cyberpunk grid */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `linear-gradient(rgba(99,102,241,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.08) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            {/* Left - Text Content */}
            <div>
              {/* Status badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-neon-violet/10 border border-neon-violet/30 rounded-full mb-6"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-violet opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-violet" />
                </span>
                <span className="text-sm text-neon-violet font-medium">{t('hero.badge')}</span>
              </motion.div>

              {/* Main Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold mb-4 leading-tight"
              >
                <span className="text-text-primary">{t('hero.greeting')}</span>
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-indigo via-neon-violet to-neon-fuchsia">
                  {t('hero.name')}
                </span>
              </motion.h1>

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl md:text-2xl font-bold mb-4"
              >
                <span className="text-neon-indigo">{t('hero.tagline')}</span>
                <span className="text-text-muted"> + </span>
                <span className="text-neon-fuchsia">{t('hero.tagline2')}</span>
              </motion.p>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-base md:text-lg text-text-secondary max-w-xl mb-6 leading-relaxed"
              >
                {t('hero.description')}
              </motion.p>

              {/* Bento Grid - Value Props */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="grid grid-cols-3 gap-3 mb-6"
              >
                {bentoCards.map((card, idx) => (
                  <motion.div
                    key={card.titleKey}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + idx * 0.1, duration: 0.4 }}
                    whileHover={{ y: -4, scale: 1.03 }}
                    className={`relative group p-4 rounded-2xl border border-darkborder/60 bg-darkcard/60 backdrop-blur-sm overflow-hidden ${card.colSpan}`}
                    style={{ '--accent': card.accent } as React.CSSProperties}
                  >
                    {/* Glow on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{ background: `radial-gradient(ellipse at center, ${card.accent}18 0%, transparent 70%)` }} />
                    {/* Top accent line */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] opacity-60 group-hover:opacity-100 transition-opacity"
                      style={{ background: `linear-gradient(90deg, transparent, ${card.accent}, transparent)` }} />

                    <card.icon className="w-5 h-5 mb-2.5" style={{ color: card.accent }} strokeWidth={1.5} />

                    {card.titleKey === 'benefits.fastDelivery.title' && (
                      <div className="mb-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] text-text-muted font-mono">MVP</span>
                          <span className="text-[10px] font-mono" style={{ color: card.accent }}>2-4 wks</span>
                        </div>
                        <div className="h-1.5 bg-darkbg rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: `linear-gradient(90deg, ${card.accent}, #a855f7)` }}
                            initial={{ width: '0%' }}
                            animate={{ width: '75%' }}
                            transition={{ delay: 1, duration: 1.5, ease: 'easeOut' }}
                          />
                        </div>
                      </div>
                    )}

                    {card.titleKey === 'benefits.aiPowered.title' && (
                      <div className="mb-2 flex items-center gap-1.5">
                        {['Gemini', 'RAG', 'Spring'].map((n, i) => (
                          <div key={n} className="relative flex items-center">
                            <motion.div
                              className="w-5 h-5 rounded-full border flex items-center justify-center text-[8px] font-mono font-bold"
                              style={{
                                borderColor: card.accent,
                                color: card.accent,
                                background: `${card.accent}15`,
                                zIndex: 3 - i,
                              }}
                              animate={{ y: [-2, 2, -2] }}
                              transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                            >
                              {n[0]}
                            </motion.div>
                            {i < 2 && (
                              <div className="absolute -right-2 w-2 h-[1px] bg-darkborder" style={{ zIndex: 2 }} />
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {card.titleKey === 'benefits.highQuality.title' && (
                      <div className="space-y-1 mb-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-text-muted">SonarQube</span>
                          <span className="text-[10px] font-mono font-bold text-emerald-400">A+</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-text-muted">Maintainability</span>
                          <span className="text-[10px] font-mono font-bold text-emerald-400">99%</span>
                        </div>
                      </div>
                    )}

                    <h3 className="text-[11px] font-heading font-semibold text-text-primary leading-tight">
                      {t(card.titleKey)}
                    </h3>
                    <p className="text-[10px] text-text-muted mt-0.5 leading-tight hidden group-hover:block">
                      {card.desc}
                    </p>
                  </motion.div>
                ))}
              </motion.div>

              {/* Omni-Command Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="relative group mb-8"
              >
                {/* Glassmorphism bar */}
                <div className="relative flex items-center gap-3 px-5 py-3.5 rounded-2xl border border-white/[0.08]
                  bg-white/[0.04] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)]
                  transition-all duration-300 group-focus-within:border-neon-violet/60 group-focus-within:shadow-[0_0_0_3px_rgba(139,92,246,0.15),0_8px_32px_rgba(0,0,0,0.4)]">
                  <Search className="w-4 h-4 text-text-muted shrink-0" />
                  <span className="w-[1px] h-5 bg-white/10 shrink-0" />
                  <span className="text-sm text-text-muted font-mono">
                    {placeholderText}
                    <span className="animate-pulse text-neon-violet">|</span>
                  </span>
                  <div className="ml-auto flex items-center gap-1.5 shrink-0">
                    {['/', 'p', 'r'].map((k, i) => (
                      <kbd key={i} className="hidden sm:flex items-center justify-center w-5 h-5 rounded bg-white/10 border border-white/10 text-[10px] text-text-muted font-mono">
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
                {/* Quick action pills below */}
                <div className="flex flex-wrap gap-2 mt-3 ml-1">
                  {[
                    { label: '/projects', href: '/projects', icon: Code2 },
                    { label: '/shop', href: '/shop', icon: Zap },
                    { label: '/chat', href: '/chat', icon: Brain },
                  ].map(({ label, href, icon: Icon }) => (
                    <Link key={label}
                      href={href}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-darkborder/60 bg-darkcard/40 text-xs text-text-secondary hover:text-neon-violet hover:border-neon-violet/40 hover:bg-neon-violet/5 transition-all duration-200 group/btn"
                    >
                      <Icon className="w-3 h-3 opacity-60 group-hover/btn:opacity-100" />
                      {label}
                      <ChevronRight className="w-3 h-3 opacity-40" />
                    </Link>
                  ))}
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-col sm:flex-row items-start gap-4"
              >
                <Link
                  href="/projects"
                  className="group relative px-8 py-4 bg-gradient-to-r from-neon-indigo via-neon-violet to-neon-fuchsia text-white font-semibold rounded-2xl overflow-hidden"
                >
                  <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <span className="relative flex items-center justify-center gap-2">
                    {t('hero.viewProjects')}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
                <Link
                  href="/chat"
                  className="group px-8 py-4 bg-darkcard border-2 border-darkborder text-text-primary font-semibold rounded-2xl hover:border-neon-violet hover:bg-darkcard/80 transition-all duration-300"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5 text-neon-fuchsia" />
                    {t('hero.chatWithAI')}
                  </span>
                </Link>
              </motion.div>
            </div>

            {/* Right - Cyberpunk Dev Sandbox */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              ref={avatarRef}
              onMouseMove={handleMouseMove}
              className="hidden lg:flex justify-center items-center"
            >
              <div className="relative w-[420px] xl:w-[460px]">
                {/* Outer glow rings */}
                <motion.div
                  className="absolute inset-0 rounded-3xl"
                  style={{
                    x: springX,
                    y: springY,
                    background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.12) 0%, transparent 70%)',
                  }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Terminal frame */}
                <div className="relative rounded-3xl border border-white/[0.08] bg-darkcard/80 backdrop-blur-xl overflow-hidden shadow-[0_0_60px_rgba(99,102,241,0.08)]">
                  {/* Terminal header bar */}
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-black/20">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/70" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                      <div className="w-3 h-3 rounded-full bg-green-500/70" />
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-black/30 rounded-md border border-white/[0.06]">
                        <Terminal className="w-3 h-3 text-neon-violet" />
                        <span className="text-[11px] font-mono text-text-muted">cuong@dev ~ main</span>
                        <span className="text-[11px] font-mono text-emerald-400">●</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-3 h-3 rounded bg-neon-indigo/40" />
                      <div className="w-3 h-3 rounded bg-neon-violet/40" />
                    </div>
                  </div>

                  {/* Avatar area with mesh */}
                  <div className="relative h-[380px] overflow-hidden">
                    {/* Mesh gradient that tracks mouse */}
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      animate={{
                        background: `radial-gradient(ellipse 200px 200px at ${50 + (mouseX.get() / 40) * 25}% ${50 + (mouseY.get() / 40) * 25}%, rgba(139,92,246,0.25) 0%, rgba(99,102,241,0.1) 40%, transparent 70%)`,
                      }}
                      style={{ background: `radial-gradient(ellipse 200px 200px at 50% 50%, rgba(139,92,246,0.25) 0%, rgba(99,102,241,0.1) 40%, transparent 70%)` }}
                    />
                    {/* Floating grid overlay */}
                    <div className="absolute inset-0 opacity-20" style={{
                      backgroundImage: `linear-gradient(rgba(139,92,246,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.1) 1px, transparent 1px)`,
                      backgroundSize: '24px 24px',
                    }} />

                    <img
                      src="/images/avatar.png"
                      alt="CuongHoang"
                      className="relative w-full h-full object-cover object-top"
                    />

                    {/* Scanline effect */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                      <motion.div
                        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-neon-violet/40 to-transparent"
                        animate={{ top: ['0%', '100%'] }}
                        transition={{ duration: 6, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
                      />
                    </div>

                    {/* Status overlays on avatar */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 }}
                      className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 bg-black/70 backdrop-blur-md border border-emerald-500/30 rounded-xl"
                    >
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                      </span>
                      <span className="text-xs font-mono text-emerald-400">{t('hero.experience')}</span>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.0 }}
                      className="absolute top-4 right-4 flex items-center gap-2 px-3 py-2 bg-black/70 backdrop-blur-md border border-yellow-500/30 rounded-xl"
                    >
                      <span className="text-yellow-400 text-xs font-mono">★★★★★</span>
                      <span className="text-xs font-mono text-yellow-400">{t('hero.happyClients')}</span>
                    </motion.div>

                    {/* Floating tech tags */}
                    {techTags.map((tag, i) => (
                      <motion.div
                        key={tag.label}
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1, y: [0, parseInt(tag.float), 0] }}
                        transition={{ duration: 3 + i * 0.7, repeat: Infinity, ease: 'easeInOut', delay: 1.1 + i * 0.15 }}
                        className="absolute px-2.5 py-1 rounded-lg border text-[11px] font-mono font-medium backdrop-blur-md"
                        style={{
                          left: tag.x,
                          top: tag.y,
                          borderColor: 'rgba(255,255,255,0.15)',
                          backdropFilter: 'blur(12px)',
                        }}
                        custom={tag.float}
                      >
                        <div className={`absolute inset-0 rounded-lg ${tag.color} opacity-90`} />
                        <span className="relative">{tag.label}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Terminal footer */}
                  <div className="flex items-center gap-3 px-4 py-2.5 border-t border-white/[0.06] bg-black/20">
                    <span className="text-[11px] font-mono text-text-muted">
                      <span className="text-neon-violet">$</span> whoami
                    </span>
                    <span className="flex-1 h-[1px] border-b border-dashed border-white/10" />
                    <span className="text-[11px] font-mono text-neon-indigo">Cuong Hoang Dev</span>
                    <span className="text-[11px] font-mono text-emerald-400">~ 6 yrs</span>
                  </div>
                </div>

                {/* Ambient glow blobs */}
                <div className="absolute -top-8 -right-8 w-40 h-40 bg-neon-fuchsia/15 rounded-full blur-3xl -z-10" />
                <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-neon-indigo/15 rounded-full blur-3xl -z-10" />
              </div>
            </motion.div>
          </div>

          {/* System Status Ticker */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-8 relative"
          >
            <div className="flex items-center gap-4 overflow-hidden py-2">
              {/* Left fade */}
              <div className="w-20 h-6 bg-gradient-to-r from-darkbg to-transparent shrink-0 z-10 absolute left-0" />
              {/* Right fade */}
              <div className="w-20 h-6 bg-gradient-to-l from-darkbg to-transparent shrink-0 z-10 absolute right-0" />

              <div className="flex items-center gap-0 animate-[marquee_30s_linear_infinite] whitespace-nowrap"
                style={{ animation: 'marquee 30s linear infinite' }}>
                {[...systemStats, ...systemStats].map((stat, i) => (
                  <div key={i} className="inline-flex items-center gap-2 px-4">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${stat.ok ? 'bg-emerald-400' : 'bg-red-400'} opacity-75`}
                        style={{ animationDuration: '2s' }} />
                      <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${stat.ok ? 'bg-emerald-400' : 'bg-red-400'}`} />
                    </span>
                    <span className="text-[11px] font-mono text-text-muted">{stat.label}:</span>
                    <span className={`text-[11px] font-mono font-medium ${stat.ok ? 'text-emerald-400' : 'text-red-400'}`}>{stat.status}</span>
                    {stat.latency && <span className="text-[11px] font-mono text-text-muted">({stat.latency})</span>}
                    <span className="text-text-muted/30 mx-2">|</span>
                  </div>
                ))}
              </div>
            </div>
            <style>{`
              @keyframes marquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
            `}</style>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-6 h-10 border-2 border-text-muted/30 rounded-full flex justify-center pt-2"
            >
              <motion.div
                animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-3 bg-text-muted/50 rounded-full"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section - Upgraded */}
      <StatsSection />

      {/* Featured Projects (homepage) — temporarily hidden.
          Will be replaced by an admin-managed carousel (admin/home/featured-projects)
          in a follow-up. Keeping the fetch + state above so the future
          section can drop in without re-wiring anything. */}

      {/* About Section */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-heading font-bold text-text-primary mb-6">
                {t('about.title')}&nbsp;<span className="text-neon-violet">{t('about.subtitle')}</span>
              </h2>
              <p className="text-text-secondary text-lg leading-relaxed mb-6">
                {t('about.description1')}
              </p>
              <p className="text-text-secondary text-lg leading-relaxed mb-8">
                {t('about.description2')}
              </p>
              <div className="flex flex-wrap gap-3">
                {['JavaScript', 'TypeScript', 'React', 'Next.js', 'Java', 'Spring Boot', 'PostgreSQL', 'Redis', 'Docker'].map((skill) => (
                  <span key={skill} className="px-4 py-2 bg-darkcard border border-darkborder rounded-xl text-sm text-text-secondary">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-neon-indigo/20 to-neon-violet/20 border border-neon-violet/20 p-8 overflow-hidden">
                <img
                  src="/images/avatar.png"
                  alt="CuongHoang"
                  className="w-full h-full rounded-2xl object-cover"
                  style={{ maxWidth: '100%', maxHeight: '100%' }}
                />
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-neon-fuchsia/20 rounded-full blur-xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-neon-indigo/20 rounded-full blur-xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Latest Articles — AI Knowledge Stream */}
      <section className="py-24 bg-gradient-to-b from-darkbg to-darkcard">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-neon-violet animate-pulse" />
              <span className="text-xs font-mono text-neon-violet tracking-widest uppercase">AI Knowledge Stream</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-primary">
              {t('latestArticles')}&nbsp;<span className="text-neon-violet">{t('articles')}</span>
            </h2>
            <p className="text-text-secondary text-sm mt-1 max-w-xl">{t('blog.subtitle')}</p>
          </motion.div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 bg-darkcard rounded-xl border border-darkborder/50 animate-pulse" />
              ))}
            </div>
          ) : featuredPosts.length > 0 ? (
            <div className="space-y-3">
              {/* Terminal window frame */}
              <div className="rounded-2xl border border-darkborder/60 bg-darkcard/80 backdrop-blur-sm overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.05] bg-black/20">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                  </div>
                  <span className="text-[11px] font-mono text-text-muted ml-2">cuong@knowledge-stream ~ articles</span>
                </div>
                <div className="p-4 space-y-2 max-h-[500px] overflow-y-auto">
                  {featuredPosts.slice(0, 6).map((post, index) => {
                    const ts = post.createdAt ? new Date(post.createdAt) : new Date();
                    const dateStr = ts.toLocaleDateString('en-CA');
                    const timeStr = ts.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                    const categoryColors = ['text-neon-indigo', 'text-neon-violet', 'text-neon-fuchsia', 'text-neon-cyan', 'text-neon-emerald'];
                    const catColor = categoryColors[index % categoryColors.length];
                    return (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.07 }}
                      >
                        <Link
                          href={`/blog/${post.slug}`}
                          className="group flex items-start gap-4 px-4 py-3 rounded-xl border border-transparent hover:border-neon-violet/20 hover:bg-neon-violet/[0.04] transition-all duration-200"
                        >
                          {/* Timestamp */}
                          <span className="font-mono text-[11px] text-text-muted/50 shrink-0 mt-0.5 w-32 hidden sm:block">
                            [{dateStr} {timeStr}]
                          </span>
                          {/* Neon dot */}
                          <span className={`relative flex h-2 w-2 shrink-0 mt-1.5`}>
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${catColor} opacity-40`} style={{ animationDuration: '3s' }} />
                            <span className={`relative inline-flex rounded-full h-2 w-2 ${catColor.replace('text-', 'bg-')}`} />
                          </span>
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="text-[10px] font-mono text-neon-violet/70 uppercase tracking-wider hidden sm:inline">FETCH</span>
                              <span className="text-sm font-medium text-text-primary group-hover:text-neon-violet transition-colors line-clamp-1 leading-snug">
                                {post.title}
                              </span>
                            </div>
                            {post.excerpt && (
                              <p className="text-xs text-text-muted line-clamp-1 leading-relaxed">{post.excerpt}</p>
                            )}
                          </div>
                          {/* Status + arrow */}
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[11px] font-mono text-emerald-400">SUCCESS</span>
                            <ArrowRight className="w-3.5 h-3.5 text-text-muted group-hover:text-neon-violet group-hover:translate-x-0.5 transition-all" />
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
              <div className="text-center mt-6">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-darkcard border border-darkborder text-text-primary font-medium rounded-xl hover:border-neon-violet hover:text-neon-violet transition-all duration-300 group"
                >
                  {t('viewAllArticles')}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ) : (
            /* No articles — AI Knowledge Stream terminal style */
            <div className="rounded-2xl border border-darkborder/60 bg-darkcard/80 backdrop-blur-sm overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.05] bg-black/20">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                </div>
                <span className="text-[11px] font-mono text-text-muted ml-2">cuong@knowledge-stream ~ articles</span>
              </div>
              <div className="p-6 space-y-2 font-mono text-sm">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] text-text-muted/50">[2026-06-06 12:00:00]</span>
                  <span className="text-[11px] font-mono text-neon-violet/70">FETCH</span>
                  <span className="text-text-muted">Query: articles.all()</span>
                  <span className="text-yellow-400">→ PENDING</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] text-text-muted/50">[2026-06-06 12:00:01]</span>
                  <span className="text-[11px] font-mono text-yellow-400/70">WARN</span>
                  <span className="text-text-muted">ResultSet is empty. Waiting for content pipeline...</span>
                </div>
                <div className="flex items-center gap-3 pt-2 border-t border-darkborder/40">
                  <span className="font-mono text-[11px] text-text-muted/50">[2026-06-06 12:00:02]</span>
                  <span className="text-[11px] font-mono text-neon-indigo/70">HINT</span>
                  <span className="text-text-muted">Add your first article via the admin dashboard to activate the stream.</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Blog Posts — Latest 3 with cover image */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-1.5 bg-neon-fuchsia/10 border border-neon-fuchsia/20 rounded-full text-sm text-neon-fuchsia font-medium mb-4">
              {t('blogCategories') || 'Blog'}
            </span>
            <h2 className="text-4xl font-heading font-bold text-text-primary mb-4">
              Bài viết&nbsp;<span className="text-neon-fuchsia">mới nhất</span>
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Những bài viết mới nhất được đăng tải lên hệ thống.
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-72 bg-darkcard rounded-2xl border border-darkborder/50 animate-pulse" />
              ))}
            </div>
          ) : featuredPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPosts.slice(0, 3).map((post, index) => {
                const ts = post.createdAt ? new Date(post.createdAt) : new Date();
                const dateStr = ts.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
                const accentColors = ['from-neon-indigo to-neon-violet', 'from-neon-violet to-neon-fuchsia', 'from-neon-fuchsia to-neon-pink'];
                const accent = accentColors[index % accentColors.length];
                return (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                  >
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group block bg-darkcard rounded-2xl border border-darkborder/50 hover:border-neon-violet/40 transition-all duration-300 overflow-hidden h-full"
                    >
                      {/* Cover image */}
                      <div className="aspect-[16/9] relative overflow-hidden bg-darkbg">
                        {post.thumbnailUrl ? (
                          <img
                            src={post.thumbnailUrl}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${accent}`}>
                            <span className="text-5xl font-heading font-bold text-white/30 group-hover:text-white/50 transition-colors">
                              {post.title?.charAt(0).toUpperCase() || 'B'}
                            </span>
                          </div>
                        )}
                        {/* Top accent line */}
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-neon-fuchsia/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        {/* Date badge */}
                        <div className="absolute bottom-3 left-3">
                          <span className="px-2.5 py-1 text-[11px] font-mono text-white/80 bg-black/60 backdrop-blur-sm border border-white/[0.08] rounded-md">
                            {dateStr}
                          </span>
                        </div>
                      </div>

                      <div className="p-5">
                        <h3 className="text-lg font-heading font-bold text-text-primary group-hover:text-neon-fuchsia transition-colors line-clamp-2 mb-2">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-sm text-text-muted line-clamp-3 leading-relaxed">
                            {post.excerpt}
                          </p>
                        )}
                        <div className="mt-4 flex items-center gap-2 text-xs text-text-muted group-hover:text-neon-violet transition-colors">
                          <span>Đọc tiếp</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-text-muted text-lg">Chưa có bài viết nào</p>
            </div>
          )}

          {featuredPosts.length > 0 && (
            <div className="text-center mt-10">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 bg-darkcard border border-darkborder text-text-primary font-medium rounded-xl hover:border-neon-fuchsia hover:text-neon-fuchsia transition-all duration-300 group"
              >
                Xem tất cả bài viết
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-heading font-bold text-text-primary mb-4">
              {t('skillsTech')}&nbsp;<span className="text-neon-indigo">{t('about.title')}</span>
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              {t('skillsTechSubtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[
              { name: 'Java', level: 95, color: 'from-orange-500 to-red-500' },
              { name: 'Spring Boot', level: 90, color: 'from-green-500 to-emerald-500' },
              { name: 'Node.JS', level: 72, color: 'from-emerald-500 to-green-600' },
              { name: 'JavaScript', level: 85, color: 'from-yellow-400 to-orange-500' },
              { name: 'TypeScript', level: 80, color: 'from-blue-500 to-indigo-500' },
              { name: 'React', level: 85, color: 'from-cyan-400 to-blue-500' },
              { name: 'Next.js', level: 80, color: 'from-gray-600 to-gray-900' },
              { name: 'Golang', level: 60, color: 'from-cyan-500 to-teal-500' },
              { name: 'Mobile App', level: 68, color: 'from-purple-500 to-pink-500' },
              { name: 'VPS', level: 90, color: 'from-indigo-500 to-purple-600' },
              { name: 'Linux', level: 88, color: 'from-yellow-500 to-amber-600' },
              { name: 'Docker', level: 80, color: 'from-blue-400 to-cyan-500' },
              { name: 'PostgreSQL', level: 85, color: 'from-blue-600 to-indigo-700' },
              { name: 'Redis', level: 75, color: 'from-red-500 to-orange-500' },
              { name: 'AWS', level: 65, color: 'from-orange-400 to-yellow-500' },
            ].map((skill, i) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="p-4 bg-darkcard rounded-xl border border-darkborder/50 hover:border-neon-violet/30 transition-all group cursor-default"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-text-primary group-hover:text-neon-violet transition-colors">
                    {skill.name}
                  </span>
                  <span className="text-xs text-text-muted">{skill.level}%</span>
                </div>
                <div className="h-1.5 bg-darkbg rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${skill.color} rounded-full transition-all duration-1000`}
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <ServicesSection />

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}