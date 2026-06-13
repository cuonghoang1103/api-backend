'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { contactApi } from '@/lib/api';
import { useTranslation } from '@/hooks/useTranslation';

export default function ContactSection() {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await contactApi.submit({
        name: form.name,
        email: form.email,
        subject: form.subject || undefined,
        message: form.message,
      });
      toast.success(t('contact.success'));
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'An error occurred. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Canonical contact info — keep in sync with the same data shown in
  // /admin/users, the Navbar, the Footer, and the static AI responses.
  // If you change these here, also update:
  //   - frontend/src/components/layout/Navbar.tsx
  //   - frontend/src/components/home/Footer.tsx
  //   - frontend/src/lib/ai-static-responses.ts
  const contactInfo = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      label: t('contact.email'),
      value: 'cuongthaihnhe176322@gmail.com',
      href: 'mailto:cuongthaihnhe176322@gmail.com',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: t('contact.location'),
      value: 'Hà Nội, Việt Nam',
      href: null,
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: t('contact.responseTime'),
      value: t('contact.responseTime'),
      href: null,
    },
  ];

  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-darkcard to-darkbg">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 bg-neon-fuchsia/10 border border-neon-fuchsia/20 rounded-full text-sm text-neon-fuchsia font-medium mb-4">
              {t('contact.title')}
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-text-primary mb-4">
              {t('letsWorkTogether')}&nbsp;<span className="text-neon-fuchsia">{t('workTogether')}</span>
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              {t('workTogetherSubtitle')}
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Contact Info - Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Info Cards */}
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-5 bg-darkbg rounded-xl border border-darkborder/50 hover:border-neon-violet/30 transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-neon-violet/10 flex items-center justify-center text-neon-violet shrink-0">
                  {info.icon}
                </div>
                <div>
                  <p className="text-text-muted text-sm mb-1">{info.label}</p>
                  {info.href ? (
                    <a
                      href={info.href}
                      className="text-text-primary font-medium hover:text-neon-violet transition-colors"
                    >
                      {info.value}
                    </a>
                  ) : (
                    <p className="text-text-primary font-medium">{info.value}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Social Links */}
            <div className="p-5 bg-darkbg rounded-xl border border-darkborder/50">
              <p className="text-text-muted text-sm mb-4">{t('contact.connectWithMe')}</p>
              <div className="flex gap-3">
                {[
                  {
                    name: 'GitHub',
                    icon: (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    ),
                    href: 'https://github.com/cuonghoang1103',
                    color: 'hover:text-white',
                  },
                  {
                    name: 'Facebook',
                    icon: (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    ),
                    href: 'https://www.facebook.com/share/1NUdMmmmcW/?mibextid=wwXIfr',
                    color: 'hover:text-blue-500',
                  },
                  {
                    name: 'LinkedIn',
                    icon: (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    ),
                    href: 'https://www.linkedin.com/in/cuong-hoang-843a37258/',
                    color: 'hover:text-blue-400',
                  },
                  {
                    name: 'X',
                    icon: (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    ),
                    href: 'https://x.com/Hncuong311',
                    color: 'hover:text-sky-400',
                  },
                ].map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`w-10 h-10 rounded-lg bg-darkcard flex items-center justify-center text-text-muted ${social.color} transition-colors`}
                    title={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form - Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-text-secondary mb-2">{t('contact.fullName')}</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder={t('contact.fullNamePlaceholder') as string}
                    className="w-full px-4 py-3 bg-darkbg border border-darkborder/50 rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 focus:ring-1 focus:ring-neon-violet/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-2">{t('contact.email')}</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder={t('contact.emailPlaceholder') as string}
                    className="w-full px-4 py-3 bg-darkbg border border-darkborder/50 rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 focus:ring-1 focus:ring-neon-violet/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-text-secondary mb-2">{t('contact.subject')}</label>
                <input
                  type="text"
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder={t('contact.subjectPlaceholder') as string}
                  className="w-full px-4 py-3 bg-darkbg border border-darkborder/50 rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 focus:ring-1 focus:ring-neon-violet/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm text-text-secondary mb-2">{t('contact.message')}</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder={t('contact.messagePlaceholder') as string}
                  className="w-full px-4 py-3 bg-darkbg border border-darkborder/50 rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 focus:ring-1 focus:ring-neon-violet/20 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-neon-violet/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {t('contact.sending')}
                  </>
                ) : (
                  <>
                    {t('contact.send')}
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
