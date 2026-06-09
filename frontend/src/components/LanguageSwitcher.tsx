'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check } from 'lucide-react';

interface LanguageOption {
  code: 'vi' | 'en';
  name: string;
  flag: string;
}

const languages: LanguageOption[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
];

interface LanguageSwitcherProps {
  variant?: 'navbar' | 'standalone';
}

export default function LanguageSwitcher({ variant = 'navbar' }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [locale, setLocaleState] = useState<'vi' | 'en'>('en');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load saved locale from cookie on mount — default to 'en'
  useEffect(() => {
    const match = document.cookie.match(/locale=(\w+)/);
    if (match && (match[1] === 'vi' || match[1] === 'en')) {
      setLocaleState(match[1]);
    } else {
      setLocaleState('en');
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (langCode: 'vi' | 'en') => {
    setLocaleState(langCode);
    document.cookie = `locale=${langCode}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    setIsOpen(false);
    // Broadcast locale change so all components re-render
    window.dispatchEvent(new Event('locale-changed'));
  };

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  // Navbar variant - compact
  if (variant === 'navbar') {
    return (
      <div className="relative" ref={dropdownRef}>
        {/* Main Button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`
            flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg
            bg-darkcard/80 backdrop-blur-sm border border-darkborder/50
            hover:border-neon-violet/50 hover:bg-darkcard
            transition-all duration-200
            ${isOpen ? 'border-neon-violet/50 bg-darkcard' : ''}
          `}
          title="Change language"
        >
          <Globe className="w-4 h-4 text-text-muted" />
          <span className="text-xs font-medium text-text-primary uppercase">
            {locale}
          </span>
        </motion.button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -5, scale: 0.95 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="absolute right-0 top-full mt-1.5 w-40 py-1.5 bg-darkcard/95 backdrop-blur-md border border-darkborder rounded-xl shadow-xl shadow-black/20 z-50 overflow-hidden"
            >
              {languages.map((lang) => (
                <motion.button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  whileHover={{ x: 4 }}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5
                    transition-colors duration-150
                    ${locale === lang.code 
                      ? 'bg-neon-violet/10 text-neon-violet' 
                      : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
                    }
                  `}
                >
                  <span className="text-base">{lang.flag}</span>
                  <span className="flex-1 text-sm font-medium text-left">
                    {lang.name}
                  </span>
                  {locale === lang.code && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <Check className="w-4 h-4 text-neon-violet" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Standalone variant - larger with full details
  return (
    <div className="relative" ref={dropdownRef}>
      {/* Main Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-xl
          bg-darkcard/80 backdrop-blur-sm border border-darkborder/50
          hover:border-neon-violet/50 hover:bg-darkcard
          transition-all duration-200
          ${isOpen ? 'border-neon-violet/50 bg-darkcard' : ''}
        `}
        title="Ngôn ngữ / Language"
      >
        <Globe className="w-4 h-4 text-neon-violet" />
        <span className="text-sm font-medium text-text-primary uppercase">
          {locale}
        </span>
        {/* Arrow */}
        <motion.svg
          className="w-3 h-3 text-text-muted"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-2 w-48 py-2 bg-darkcard/95 backdrop-blur-md border border-darkborder rounded-xl shadow-xl shadow-black/20 z-50 overflow-hidden"
          >
            {/* Dropdown Header */}
            <div className="px-3 py-2 border-b border-darkborder/50">
              <p className="text-xs text-text-muted font-medium">
                Chuyển ngôn ngữ / Switch language
              </p>
            </div>

            {/* Language Options */}
            <div className="py-1">
              {languages.map((lang) => (
                <motion.button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  whileHover={{ x: 4 }}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5
                    transition-colors duration-150
                    ${locale === lang.code 
                      ? 'bg-neon-violet/10 text-neon-violet' 
                      : 'text-text-secondary hover:bg-darkbg hover:text-text-primary'
                    }
                  `}
                >
                  {/* Flag */}
                  <span className="text-lg">{lang.flag}</span>
                  
                  {/* Language Name */}
                  <span className="flex-1 text-sm font-medium text-left">
                    {lang.name}
                  </span>
                  
                  {/* Checkmark */}
                  {locale === lang.code && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    >
                      <Check className="w-4 h-4 text-neon-violet" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Decorative gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-violet/30 to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
