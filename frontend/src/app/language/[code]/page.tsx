'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Type,
  BookOpen,
  GraduationCap,
  Headphones,
  MessagesSquare,
  Newspaper,
  HelpCircle,
  Flame,
  BarChart3,
  ArrowLeft,
  PenLine,
  Bot,
} from 'lucide-react';
import { languageApi } from '@/lib/language-api';
import type { LanguageOverview } from '@/types/language';
import { EmptyState, useLangUser } from '@/components/language/primitives';

const SECTIONS = [
  { key: 'alphabet', n: 1, label: 'Bảng chữ cái', desc: 'Chữ cái & phát âm', icon: Type, color: 'text-neon-violet' },
  { key: 'vocab', n: 2, label: 'Từ vựng', desc: 'Học từ theo chủ đề', icon: BookOpen, color: 'text-neon-cyan' },
  { key: 'grammar', n: 3, label: 'Ngữ pháp', desc: 'Cấu trúc câu', icon: GraduationCap, color: 'text-neon-emerald' },
  { key: 'listening', n: 4, label: 'Nghe', desc: 'Luyện nghe & shadowing', icon: Headphones, color: 'text-neon-blue' },
  { key: 'conversation', n: 5, label: 'Giao tiếp', desc: 'Hội thoại hằng ngày', icon: MessagesSquare, color: 'text-neon-fuchsia' },
  { key: 'reading', n: 6, label: 'Đọc', desc: 'Bài đọc & báo', icon: Newspaper, color: 'text-neon-orange' },
  { key: 'qna', n: 7, label: 'Q&A', desc: 'Câu hỏi thường gặp', icon: HelpCircle, color: 'text-neon-pink' },
  { key: 'writing', n: 8, label: 'Luyện viết', desc: 'AI chữa bài & chấm điểm', icon: PenLine, color: 'text-neon-emerald' },
  { key: 'roleplay', n: 9, label: 'Hội thoại AI', desc: 'Nhập vai tình huống', icon: Bot, color: 'text-neon-cyan' },
] as const;

const AI_SECTIONS = new Set(['writing', 'roleplay']);

export default function LanguageHomePage() {
  const params = useParams();
  const code = String(params.code);
  const { isAuthenticated } = useLangUser();
  const [lang, setLang] = useState<LanguageOverview | null>(null);
  const [due, setDue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    languageApi
      .overview(code)
      .then((res) => alive && setLang(res.data.data ?? null))
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [code]);

  useEffect(() => {
    if (!isAuthenticated) return;
    languageApi
      .reviewQueue(code)
      .then((res) => setDue(res.data.data?.count ?? 0))
      .catch(() => {});
  }, [code, isAuthenticated]);

  const counts = useMemo(() => lang?.counts, [lang]);

  if (!loading && !lang) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <EmptyState emoji="🔎" title="Không tìm thấy ngôn ngữ" hint="Ngôn ngữ này chưa tồn tại hoặc đã bị ẩn." />
        <div className="mt-6 text-center">
          <Link href="/language" className="text-neon-violet hover:underline">
            ← Về danh sách ngôn ngữ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-16">
      {/* Sticky top bar — sits just below the fixed 4rem site navbar */}
      <div className="sticky top-16 z-20 border-b border-[var(--border-color)] bg-[var(--bg-glass)] backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-3 py-3 sm:px-5">
          <Link href="/language" className="text-text-muted hover:text-neon-violet" aria-label="Quay lại">
            <ArrowLeft size={20} />
          </Link>
          <span className="text-2xl">{lang?.flagEmoji ?? '🏳️'}</span>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-heading text-lg font-bold text-text-primary">{lang?.name ?? code}</h1>
          </div>
          {isAuthenticated && (
            <Link
              href={`/language/${code}/stats`}
              className="inline-flex items-center gap-1 rounded-full bg-[var(--bg-surface)] px-3 py-1.5 text-sm text-text-secondary ring-1 ring-[var(--border-color)] hover:text-neon-violet"
            >
              <BarChart3 size={15} /> Thống kê
            </Link>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-3 py-6 sm:px-5">
        {isAuthenticated && due > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
            <Link
              href={`/language/${code}/vocab?mode=review`}
              className="flex items-center justify-center gap-2 rounded-2xl bg-neon-gradient px-4 py-3 font-semibold text-white shadow-neon transition hover:opacity-95"
            >
              <Flame size={18} /> Ôn tập ngay ({due} thẻ đến hạn)
            </Link>
          </motion.div>
        )}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {SECTIONS.map((s, i) => {
            const Icon = s.icon;
            const isAi = AI_SECTIONS.has(s.key);
            const count = counts ? (counts as Record<string, number>)[s.key] ?? 0 : 0;
            return (
              <motion.div
                key={s.key}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, delay: Math.min(i * 0.04, 0.28) }}
              >
                <Link href={`/language/${code}/${s.key}`} className="card group relative flex h-full flex-col p-4 transition hover:-translate-y-1">
                  <span className="absolute right-3 top-3 text-xs font-bold text-text-muted/50">{s.n}</span>
                  <Icon size={26} className={`${s.color} mb-2`} />
                  <h3 className="font-heading font-semibold text-text-primary">{s.label}</h3>
                  <p className="mt-0.5 text-xs text-text-muted">{s.desc}</p>
                  <span className="mt-auto pt-2 text-xs font-medium text-text-secondary">
                    {isAi ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-neon-violet/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-neon-violet">✨ AI · Pro</span>
                    ) : loading ? '…' : `${count} mục`}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
