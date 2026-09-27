'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, Flame, NotebookPen, ArrowUpRight } from 'lucide-react';
import { languageApi } from '@/lib/language-api';
import type { LanguageCard } from '@/types/language';
import { ProgressRing, CardsSkeleton, EmptyState, useLangUser } from '@/components/language/primitives';
import WordOfTheDay from '@/components/language/WordOfTheDay';
import s from './landing.module.css';

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
    <div className={s.root}>
      <div className={s.wrap}>
        <motion.header initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className={s.hero}>
          <div>
            <div className={s.kicker}><span className={s.kickerDot} /> Không gian học tập</div>
            <h1 className={s.title}>Mỗi ngày một bước <span className={s.titleAccent}>tiến bộ.</span></h1>
            <p className={s.subtitle}>Chọn ngôn ngữ bạn muốn học và xây dựng thói quen vững chắc qua từ vựng, ngữ pháp, nghe và giao tiếp.</p>
            {isAuthenticated && <div className={s.actions}><Link href="/language/notebook" className={s.action}><NotebookPen size={16} /> Sổ tay ngôn ngữ <ArrowUpRight size={15} /></Link></div>}
          </div>
          <div className={s.heroCard} aria-hidden="true"><div className={s.heroCardLabel}>Thói quen nhỏ</div><div className={s.heroCardText}>Học đều đặn.<br />Nhớ lâu hơn.</div><div className={s.heroCardLine} /></div>
        </motion.header>

        {!loading && languages.length > 0 && (
          <div className="mb-8">
            <WordOfTheDay languageCode={languages[0].code} />
          </div>
        )}

        {loading ? (
          <CardsSkeleton count={4} />
        ) : languages.length === 0 ? (
          <EmptyState emoji="🌍" title="Chưa có ngôn ngữ nào" hint="Quản trị viên có thể thêm ngôn ngữ trong trang admin." />
        ) : (
          <section><div className={s.sectionHead}><h2 className={s.sectionTitle}>Ngôn ngữ của bạn</h2><span className={s.sectionHint}>{languages.length} lựa chọn để bắt đầu</span></div><div className={s.grid}>
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
                    className={s.card}
                  >
                    <span className={s.flag}>
                      {lang.flagEmoji}
                    </span>
                    <div className={s.cardBody}>
                      <h2 className={s.cardTitle}>{lang.name}</h2>
                      <p className={s.cardSub}>{lang.nameEn}</p>
                      <div className={s.badges}>
                        <span className={s.badge}>
                          <BookOpen size={12} /> {lang.counts.words} từ
                        </span>
                        <span className={s.badge}>
                          <GraduationCap size={12} /> {lang.counts.grammar} ngữ pháp
                        </span>
                        <span className={s.badge}>🎧 {lang.counts.lessons} bài</span>
                      </div>
                      {isAuthenticated && lang.progress && lang.progress.due > 0 && (
                        <span className={`${s.badge} ${s.badgeHot}`}>
                          <Flame size={12} /> {lang.progress.due} thẻ cần ôn hôm nay
                        </span>
                      )}
                    </div>
                    {isAuthenticated && lang.progress && <div className={s.progress}><ProgressRing value={pct} size={56} /></div>}
                  </Link>
                </motion.div>
              );
            })}
            </div></section>
        )}
      </div>
    </div>
  );
}
