'use client';

import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import { SELLER_INFO } from '@/lib/sellerInfo';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const navLabels = [t('common.home'), t('common.blog'), t('common.projects'), t('contact.title')];
  const serviceLabels = [t('footer.webDev'), t('footer.aiIntegration'), t('footer.ecommerce'), t('footer.devops')];
  const resourceLabels = [t('footer.github'), t('footer.linkedin'), t('footer.twitter'), t('footer.email')];

  type FooterLink = { label: string; href: string };
  const footerLinks: Record<string, FooterLink[]> = {
    navigation: navLabels.map((label, i) => ({ label: String(label), href: ['/', '/blog', '/projects', '/#contact'][i] })),
    services: serviceLabels.map((label) => ({ label: String(label), href: '/#services' })),
    resources: resourceLabels.map((label, i) => ({ label: String(label), href: ['https://github.com/cuonghoang1103', 'https://www.linkedin.com/in/cuong-hoang-843a37258/', 'https://x.com/Hncuong311', 'mailto:cuongthaihnhe176322@gmail.com'][i] })),
    legal: [
      { label: 'Hướng dẫn mua hàng', href: '/huong-dan-mua-hang' },
      { label: 'Chính sách thanh toán', href: '/chinh-sach-thanh-toan' },
      { label: 'Chính sách giao hàng', href: '/chinh-sach-giao-hang' },
      { label: 'Chính sách đổi trả & hoàn tiền', href: '/chinh-sach-doi-tra' },
      { label: 'Chính sách bảo mật', href: '/chinh-sach-bao-mat' },
    ],
  };

  return (
    <footer className="bg-darkbg border-t border-darkborder/50">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <img
                src="/images/avatar.png"
                alt="CuongHoang"
                className="w-10 h-10 rounded-xl object-cover"
              />
              <span className="font-heading font-bold text-lg text-text-primary">
                CuongHoang
              </span>
            </Link>
            <p className="text-text-muted text-sm leading-relaxed mb-6 whitespace-pre-line">
              {t('footer.footerDesc')}
            </p>
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
                },
                {
                  name: 'Facebook',
                  icon: (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  ),
                  href: 'https://www.facebook.com/share/1NUdMmmmcW/?mibextid=wwXIfr',
                },
                {
                  name: 'LinkedIn',
                  icon: (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  ),
                  href: 'https://www.linkedin.com/in/cuong-hoang-843a37258/',
                },
                {
                  name: 'X',
                  icon: (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  ),
                  href: 'https://x.com/Hncuong311',
                },
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  title={social.name}
                  className="w-10 h-10 rounded-lg bg-darkcard flex items-center justify-center text-text-muted hover:text-neon-violet hover:bg-neon-violet/10 transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Column */}
          <div>
            <h4 className="font-heading font-semibold text-text-primary mb-4">{t('footer.navigation')}</h4>
            <ul className="space-y-2.5">
              {footerLinks.navigation.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-text-muted text-sm hover:text-neon-violet transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="font-heading font-semibold text-text-primary mb-4">{t('footer.services')}</h4>
            <ul className="space-y-2.5">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-text-muted text-sm hover:text-neon-violet transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Seller info Column (Part 1 — MOIT) */}
          <div>
            <h4 className="font-heading font-semibold text-text-primary mb-4">Thông tin người bán</h4>
            <ul className="space-y-2 text-text-muted text-sm">
              <li>{SELLER_INFO.legalName}</li>
              <li>{SELLER_INFO.address}</li>
              <li>MST/ĐKKD: {SELLER_INFO.taxCode}</li>
              <li>
                <a href={`tel:${SELLER_INFO.phone}`} className="hover:text-neon-violet transition-colors">
                  ĐT/Zalo: {SELLER_INFO.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${SELLER_INFO.email}`} className="hover:text-neon-violet transition-colors">
                  {SELLER_INFO.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 pt-8 border-t border-darkborder/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-sm">
            © {currentYear} CuongHoang. {t('footer.rights')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-text-muted text-sm hover:text-neon-violet transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
