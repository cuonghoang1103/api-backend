'use client';

import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, Headphones, Flame, NotebookPen, ArrowRight, Sparkles } from 'lucide-react';
import { languageApi } from '@/lib/language-api';
import type { LanguageCard } from '@/types/language';
import { ProgressRing, CardsSkeleton, EmptyState, useLangUser } from '@/components/language/primitives';
import WordOfTheDay from '@/components/language/WordOfTheDay';
import { KHOA_CHINH } from '@/lib/khoaChinh';
import s from './landing.module.css';

/**
 * Màu nhận diện từng ngôn ngữ — chỉ dùng làm ĐIỂM NHẤN (viền, nền cờ, vòng
 * tiến độ), chữ vẫn theo biến màu của theme để đọc được ở cả nền sáng lẫn tối.
 * Ngôn ngữ mới chưa có trong bảng thì lấy tím thương hiệu.
 */
const MAU: Record<string, string> = {
  en: '#3b82f6',
  ja: '#ef4444',
  zh: '#f97316',
  ko: '#14b8a6',
  fr: '#6366f1',
  de: '#eab308',
  ru: '#0ea5e9',
  es: '#f59e0b',
};
const mauCua = (code: string) => MAU[code] ?? '#8b5cf6';

const so = (n: number) => n.toLocaleString('vi-VN');

/** Có nội dung để học chưa — ngôn ngữ trống thì hiện "Sắp có" và xếp cuối. */
const coNoiDung = (l: LanguageCard) => l.counts.words + l.counts.grammar + l.counts.lessons > 0;

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

  // Có nội dung lên trước; giữ nguyên thứ tự máy chủ trả trong mỗi nhóm.
  const ds = useMemo(
    () => [...languages.filter(coNoiDung), ...languages.filter((l) => !coNoiDung(l))],
    [languages],
  );

  // Số liệu THẬT cộng từ dữ liệu — không có con số trang trí nào ở trang này.
  const tong = useMemo(() => ({
    ngonNgu: languages.filter(coNoiDung).length,
    tu: languages.reduce((a, l) => a + l.counts.words, 0),
    nguPhap: languages.reduce((a, l) => a + l.counts.grammar, 0),
    bai: languages.reduce((a, l) => a + l.counts.lessons, 0),
    canOn: languages.reduce((a, l) => a + (l.progress?.due ?? 0), 0),
  }), [languages]);

  // "Học tiếp": ngôn ngữ đang có thẻ đến hạn nhiều nhất, không có thì ngôn ngữ
  // đã học được nhiều nhất. Chưa học gì thì không hiện khối này.
  const hocTiep = useMemo(() => {
    if (!isAuthenticated) return null;
    const daHoc = languages.filter((l) => l.progress && (l.progress.learned > 0 || l.progress.due > 0));
    if (!daHoc.length) return null;
    return [...daHoc].sort((a, b) => (b.progress!.due - a.progress!.due) || (b.progress!.learned - a.progress!.learned))[0]!;
  }, [languages, isAuthenticated]);

  const vao = (code: string) => KHOA_CHINH[code]?.href ?? `/language/${code}`;
  const coKhoa = ds.filter(coNoiDung);
  const sapCoDs = ds.filter((l) => !coNoiDung(l));

  return (
    <div className={s.root}>
      <div className={s.nenSang} aria-hidden />
      <div className={s.wrap}>
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className={s.hero}
        >
          <span className={s.eyebrow}><Sparkles size={14} aria-hidden /> My Language</span>
          <h1 className={s.tieuDe}>
            Học ngoại ngữ theo <span className={s.nhan}>lộ trình từng ngày</span>
            <br className={s.ngatLon} /> — từ số 0 đến chứng chỉ.
          </h1>
          <p className={s.subtitle}>
            Mỗi ngôn ngữ là một khoá học trọn vẹn: bài theo ngày, slide, nghe – nói – đọc – viết, luyện nhớ bằng thẻ,
            thi thử từng chặng và gia sư AI giảng kèm.
          </p>

          {!loading && tong.ngonNgu > 0 && (
            <ul className={s.stats} aria-label="Nội dung hiện có">
              <li><strong>{so(tong.ngonNgu)}</strong><span>khoá ngôn ngữ</span></li>
              <li><strong>{so(tong.tu)}</strong><span>từ vựng</span></li>
              <li><strong>{so(tong.nguPhap)}</strong><span>điểm ngữ pháp</span></li>
              <li><strong>{so(tong.bai)}</strong><span>bài nghe</span></li>
            </ul>
          )}
        </motion.header>

        {hocTiep && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }}>
            <Link href={vao(hocTiep.code)} className={s.tiep} style={{ '--c': mauCua(hocTiep.code) } as CSSProperties}>
              <span className={s.tiepFlag} aria-hidden>{hocTiep.flagEmoji}</span>
              <span className={s.tiepBody}>
                <span className={s.tiepNhan}>Học tiếp</span>
                <span className={s.tiepTen}>{KHOA_CHINH[hocTiep.code]?.ten ?? hocTiep.name}</span>
                <span className={s.tiepMo}>
                  {hocTiep.progress!.due > 0
                    ? <><Flame size={13} aria-hidden /> {so(hocTiep.progress!.due)} thẻ đến hạn ôn hôm nay</>
                    : <>Đã học {so(hocTiep.progress!.learned)} / {so(hocTiep.progress!.total)} mục</>}
                </span>
              </span>
              <span className={s.tiepNut}>Vào học <ArrowRight size={16} aria-hidden /></span>
            </Link>
          </motion.div>
        )}

        {loading ? (
          <CardsSkeleton count={3} />
        ) : languages.length === 0 ? (
          <EmptyState emoji="🌍" title="Chưa có ngôn ngữ nào" hint="Quản trị viên có thể thêm ngôn ngữ trong trang admin." />
        ) : (
          <>
            <section>
              <div className={s.sectionHead}>
                <h2 className={s.sectionTitle}>Chọn khoá học</h2>
                {isAuthenticated && tong.canOn > 0 && (
                  <span className={s.sectionHint}><Flame size={13} aria-hidden /> {so(tong.canOn)} thẻ cần ôn</span>
                )}
              </div>
              <div className={s.grid}>
                {coKhoa.map((lang, i) => {
                  const pct = lang.progress && lang.progress.total > 0 ? (lang.progress.learned / lang.progress.total) * 100 : 0;
                  const k = KHOA_CHINH[lang.code];
                  return (
                    <motion.div
                      key={lang.id}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: Math.min(i * 0.07, 0.3) }}
                      whileHover={{ y: -4 }}
                    >
                      <Link href={vao(lang.code)} className={s.card} style={{ '--c': mauCua(lang.code) } as CSSProperties}>
                        <div className={s.cardTop}>
                          <span className={s.flag} aria-hidden>{lang.flagEmoji}</span>
                          <div className={s.cardHead}>
                            <h3 className={s.cardTitle}>{lang.name}</h3>
                            <p className={s.cardSub}>{k?.ten ?? lang.nameEn}</p>
                          </div>
                          {isAuthenticated && lang.progress && <ProgressRing value={pct} size={48} />}
                        </div>
                        {k && <span className={s.capDo}>{k.capDo}</span>}
                        <p className={s.mota}>{k?.mota ?? `Từ vựng, ngữ pháp, nghe, giao tiếp, đọc & Q&A tiếng ${lang.name.replace(/^Tiếng /, '')}.`}</p>
                        <div className={s.badges}>
                          <span className={s.badge}><BookOpen size={12} aria-hidden /> {so(lang.counts.words)} từ</span>
                          <span className={s.badge}><GraduationCap size={12} aria-hidden /> {so(lang.counts.grammar)} ngữ pháp</span>
                          <span className={s.badge}><Headphones size={12} aria-hidden /> {so(lang.counts.lessons)} bài nghe</span>
                        </div>
                        <div className={s.cardFoot}>
                          {isAuthenticated && lang.progress && lang.progress.due > 0
                            ? <span className={s.due}><Flame size={12} aria-hidden /> {so(lang.progress.due)} thẻ cần ôn</span>
                            : <span />}
                          <span className={s.cta}>Vào học <ArrowRight size={15} aria-hidden /></span>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </section>

            <div className={s.duoi}>
              <div className={s.wotd}><WordOfTheDay languageCode={(hocTiep ?? ds[0])!.code} /></div>
              <div className={s.phu}>
                {isAuthenticated && (
                  <Link href="/language/notebook" className={s.phuO}>
                    <NotebookPen size={18} aria-hidden />
                    <span><b>Sổ tay ngôn ngữ</b><small>Từ & câu bạn đã lưu khi học</small></span>
                    <ArrowRight size={15} aria-hidden />
                  </Link>
                )}
                {sapCoDs.length > 0 && (
                  <div className={s.sapCoKhoi}>
                    <span className={s.sapCoNhan}><Sparkles size={12} aria-hidden /> Sắp có</span>
                    <div className={s.sapCoDs}>
                      {sapCoDs.map((l) => <span key={l.id} className={s.sapCoChip}>{l.flagEmoji} {l.name}</span>)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
