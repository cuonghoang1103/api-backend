'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';
import { ArrowRight, Cpu, Database, Gauge, Shield, Terminal } from 'lucide-react';

interface ServiceSpec {
  label: string;
  value: string;
  accent?: string;
}

interface ServiceContent {
  subtitle: string;
  specs: ServiceSpec[];
  techStack: string[];
  responseSpeed: string;
  latency: string;
  guardrails: string[];
  color: string;
}

const serviceContents: Record<string, ServiceContent> = {
  webDev: {
    subtitle: 'End-to-end web applications with modern frameworks',
    specs: [
      { label: 'TTFB', value: '< 80ms', accent: '#22d3ee' },
      { label: 'LCP', value: '< 1.8s', accent: '#8b5cf6' },
      { label: 'CLS', value: '< 0.05', accent: '#d946ef' },
      { label: 'Uptime', value: '99.97%', accent: '#4ade80' },
    ],
    techStack: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Redis', 'Docker'],
    responseSpeed: '80ms avg',
    latency: '< 50ms p99',
    guardrails: ['SSR + ISR', 'Edge Caching', 'Image Optimization', 'Font Subsetting'],
    color: '#6366f1',
  },
  aiIntegration: {
    subtitle: 'Production AI with RAG, guardrails, and real-time streaming',
    specs: [
      { label: 'TTFT', value: '< 0.3s', accent: '#8b5cf6' },
      { label: 'Tokens/s', value: '120 t/s', accent: '#22d3ee' },
      { label: 'Context', value: '32K ctx', accent: '#d946ef' },
      { label: 'Accuracy', value: '98.5%', accent: '#4ade80' },
    ],
    techStack: ['Gemini 2.0', 'LangChain', 'RAG Pipeline', 'Weaviate', 'Spring Boot', 'WebSocket'],
    responseSpeed: '300ms avg',
    latency: '< 200ms p99',
    guardrails: ['Input Sanitization', 'Output Validation', 'Rate Limiting', 'Content Filtering', 'Audit Logs'],
    color: '#8b5cf6',
  },
  ecommerce: {
    subtitle: 'Scalable e-commerce with payment and inventory management',
    specs: [
      { label: 'Checkout', value: '< 2.1s', accent: '#4ade80' },
      { label: 'Inventory', value: 'Real-time', accent: '#22d3ee' },
      { label: 'Concurrency', value: '10K+', accent: '#d946ef' },
      { label: 'Payment', value: 'Stripe', accent: '#8b5cf6' },
    ],
    techStack: ['Spring Boot', 'React', 'Stripe', 'PostgreSQL', 'Redis', 'AWS S3'],
    responseSpeed: '120ms avg',
    latency: '< 100ms p99',
    guardrails: ['SSL/TLS', 'PCI-DSS Compliant', 'Fraud Detection', 'Idempotency Keys'],
    color: '#4ade80',
  },
  devops: {
    subtitle: 'CI/CD pipelines, container orchestration, and infrastructure as code',
    specs: [
      { label: 'Deploy', value: '< 3min', accent: '#22d3ee' },
      { label: 'Recovery', value: '< 5min', accent: '#8b5cf6' },
      { label: 'Monitoring', value: 'Prometheus', accent: '#d946ef' },
      { label: 'IaC', value: 'Terraform', accent: '#4ade80' },
    ],
    techStack: ['Docker', 'Kubernetes', 'GitHub Actions', 'Terraform', 'Grafana', 'Prometheus'],
    responseSpeed: 'N/A',
    latency: '< 5min MTTR',
    guardrails: ['Auto-rollback', 'Blue/Green Deploy', 'Health Checks', 'Secrets Management'],
    color: '#22d3ee',
  },
};

export default function ServicesSection() {
  const { t } = useTranslation();
  const [activeService, setActiveService] = useState<string>('webDev');

  const services = [
    { id: 'webDev', titleKey: 'services.webDev.title', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg> },
    { id: 'aiIntegration', titleKey: 'services.aiIntegration.title', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
    { id: 'ecommerce', titleKey: 'services.ecommerce.title', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg> },
    { id: 'devops', titleKey: 'services.devops.title', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg> },
  ];

  const activeContent = serviceContents[activeService] || serviceContents.webDev;

  return (
    <section id="services" className="py-24 relative">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-[150px]"
          style={{ background: `${activeContent.color}08` }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 bg-neon-violet/10 border border-neon-violet/20 rounded-full text-sm text-neon-violet font-medium mb-4">
              {t('services.header')}
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-text-primary mb-4">
              {t('services.title')}&nbsp;<span className="text-neon-violet">{t('services.provide')}</span>
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              {t('services.subtitle')}
            </p>
          </motion.div>
        </div>

        {/* Split-pane layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Left: Service trigger tabs */}
          <div className="space-y-2">
            {services.map((service) => {
              const isActive = activeService === service.id;
              return (
                <motion.button
                  key={service.id}
                  onClick={() => setActiveService(service.id)}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full text-left flex items-center gap-3 px-5 py-4 rounded-2xl border transition-all duration-300 ${
                    isActive
                      ? 'bg-neon-violet/10 border-neon-violet/40 shadow-[0_0_20px_rgba(139,92,246,0.1)]'
                      : 'bg-darkcard/40 border-darkborder/50 hover:border-darkborder hover:bg-darkcard/60'
                  }`}
                >
                  <span className={`shrink-0 ${isActive ? 'text-neon-violet' : 'text-text-muted'}`}>
                    {service.icon}
                  </span>
                  <span className={`text-sm font-medium ${isActive ? 'text-text-primary' : 'text-text-secondary'}`}>
                    {t(service.titleKey)}
                  </span>
                  {isActive && (
                    <ArrowRight className="w-4 h-4 text-neon-violet ml-auto" />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Right: Dynamic spec panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeService}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="rounded-2xl border border-darkborder/60 bg-darkcard/60 backdrop-blur-xl overflow-hidden"
              style={{ boxShadow: `0 0 40px ${activeContent.color}08` }}
            >
              {/* Panel header */}
              <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.05] bg-black/20">
                <Terminal className="w-3.5 h-3.5 text-neon-violet" />
                <span className="text-[11px] font-mono text-text-muted">
                  {services.find((s) => s.id === activeService)?.titleKey ? t(services.find((s) => s.id === activeService)!.titleKey) : activeService} — SPEC_SHEET.md
                </span>
                <div className="ml-auto flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-mono text-emerald-400">LIVE</span>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Service title */}
                <div>
                  <h3 className="text-xl font-heading font-bold text-text-primary mb-1">
                    {t(services.find((s) => s.id === activeService)!.titleKey)}
                  </h3>
                  <p className="text-sm text-text-muted">{activeContent.subtitle}</p>
                </div>

                {/* Metrics grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {activeContent.specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="rounded-xl border border-white/[0.06] bg-black/20 p-3 text-center"
                    >
                      <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-1">{spec.label}</p>
                      <p className="text-lg font-bold font-mono" style={{ color: spec.accent }}>
                        {spec.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Spec rows */}
                <div className="rounded-xl border border-white/[0.06] bg-black/20 p-4 space-y-3">
                  {/* Response Speed */}
                  <div className="flex items-center gap-3">
                    <Gauge className="w-4 h-4 text-neon-violet shrink-0" />
                    <span className="text-[11px] font-mono text-text-muted w-20">API_SPEED</span>
                    <div className="flex-1 h-1.5 bg-darkborder rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: activeContent.color }}
                        initial={{ width: '0%' }}
                        animate={{ width: '85%' }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                      />
                    </div>
                    <span className="text-[11px] font-mono text-neon-violet">{activeContent.responseSpeed}</span>
                  </div>

                  {/* Latency */}
                  <div className="flex items-center gap-3">
                    <Cpu className="w-4 h-4 text-neon-cyan shrink-0" />
                    <span className="text-[11px] font-mono text-text-muted w-20">LATENCY</span>
                    <div className="flex-1 h-1.5 bg-darkborder rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-neon-cyan"
                        initial={{ width: '0%' }}
                        animate={{ width: '70%' }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                      />
                    </div>
                    <span className="text-[11px] font-mono text-neon-cyan">{activeContent.latency}</span>
                  </div>

                  {/* DB */}
                  <div className="flex items-center gap-3">
                    <Database className="w-4 h-4 text-neon-fuchsia shrink-0" />
                    <span className="text-[11px] font-mono text-text-muted w-20">DATABASE</span>
                    <div className="flex-1 h-1.5 bg-darkborder rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-neon-fuchsia"
                        initial={{ width: '0%' }}
                        animate={{ width: '90%' }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                      />
                    </div>
                    <span className="text-[11px] font-mono text-neon-fuchsia">PostgreSQL 16</span>
                  </div>

                  {/* Guardrails */}
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-[11px] font-mono text-text-muted w-20">GUARDRAIL</span>
                    <div className="flex-1 h-1.5 bg-darkborder rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-emerald-400"
                        initial={{ width: '0%' }}
                        animate={{ width: '95%' }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
                      />
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400">ENABLED</span>
                  </div>
                </div>

                {/* Tech stack chips */}
                <div>
                  <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-3">Tech Stack</p>
                  <div className="flex flex-wrap gap-2">
                    {activeContent.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1.5 rounded-lg border border-darkborder bg-black/20 text-xs font-mono text-text-secondary"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Guardrail integrations */}
                <div>
                  <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-3">Guardrail Integrations</p>
                  <div className="flex flex-wrap gap-2">
                    {activeContent.guardrails.map((g) => (
                      <span
                        key={g}
                        className="px-3 py-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-xs font-mono text-emerald-400"
                      >
                        ✓ {g}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
