'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, Flame } from 'lucide-react';
import { languageApi } from '@/lib/language-api';
import type { LanguageCard } from '@/types/language';
import { ProgressRing, CardsSkeleton, EmptyState, useLangUser } from '@/components/language/primitives';
import WordOfTheDay from '@/components/language/WordOfTheDay';

export default function LanguageLandingPage() {
  const { isAuthenticated } = useLangUser();
  const [languages, setLanguages] = useState<LanguageCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    languageApi
      .list()
      .then((res) => {
        if (alive) setLanguages(res.data.data ?? []);
      })
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-16">
      <div className="mx-auto max-w-5xl px-3 py-8 sm:px-5 sm:py-12">
        {/* Hero */}
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8 text-center"
        >
          <h1 className="bg-neon-gradient bg-clip-text font-heading text-4xl font-extrabold text-transparent sm:text-5xl">
            My Language
          </h1>
          <p className="mt-3 text-text-secondary">
            Học ngôn ngữ theo cách của bạn — từ vựng, ngữ pháp, nghe, giao tiếp, đọc &amp; Q&amp;A.
          </p>
        </motion.header>

        {!loading && languages.length > 0 && (
          <div className="mb-6">
            <WordOfTheDay languageCode={languages[0].code} />
          </div>
        )}

        {loading ? (
          <CardsSkeleton count={4} />
        ) : languages.length === 0 ? (
          <EmptyState emoji="🌍" title="Chưa có ngôn ngữ nào" hint="Quản trị viên có thể thêm ngôn ngữ trong trang admin." />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {languages.map((lang, i) => {
              const pct = lang.progress && lang.progress.total > 0 ? (lang.progress.learned / lang.progress.total) * 100 : 0;
              return (
                <motion.div
                  key={lang.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: Math.min(i * 0.05, 0.3) }}
                >
                  <Link
                    href={`/language/${lang.code}`}
                    className="card group flex items-center gap-4 p-5 transition hover:-translate-y-1"
                  >
                    <span className="text-5xl drop-shadow">{lang.flagEmoji}</span>
                    <div className="min-w-0 flex-1">
                      <h2 className="truncate font-heading text-xl font-bold text-text-primary">{lang.name}</h2>
                      <p className="text-sm text-text-muted">{lang.nameEn}</p>
                      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-text-secondary">
                        <span className="inline-flex items-center gap-1">
                          <BookOpen size={13} className="text-neon-violet" /> {lang.counts.words} từ
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <GraduationCap size={13} className="text-neon-cyan" /> {lang.counts.grammar} ngữ pháp
                        </span>
                        <span className="inline-flex items-center gap-1">🎧 {lang.counts.lessons} bài</span>
                      </div>
                      {isAuthenticated && lang.progress && lang.progress.due > 0 && (
                        <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-neon-orange/15 px-2 py-0.5 text-[11px] font-medium text-neon-orange">
                          <Flame size={12} /> {lang.progress.due} thẻ cần ôn hôm nay
                        </span>
                      )}
                    </div>
                    {isAuthenticated && lang.progress && (
                      <ProgressRing value={pct} size={56} />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
