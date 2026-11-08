'use client';

/** /interview/history — past sessions + score trend (STATIC phase: a clean list).
 * Bilingual VI/EN via interview-i18n; shares the `interview:uiLang` key with the
 * setup page so the whole module follows one language choice. */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, ArrowLeft, Brain, Flame } from 'lucide-react';
import ParticleBackground from '@/components/repos/ParticleBackground';
import { interviewApi } from '@/lib/interview-api';
import { makeT, type ILang, type IKey } from '@/lib/interview-i18n';
import type { HistoryItem, MasteryResponse, MasteryLevel } from '@/types/interview';

const MASTERY_META: Record<MasteryLevel, { key: IKey; color: string }> = {
  UNSEEN: { key: 'mUnseen', color: '#475569' },
  SHAKY: { key: 'mShaky', color: '#ef4444' },
  LEARNING: { key: 'mLearning', color: '#f59e0b' },
  SOLID: { key: 'mSolid', color: '#84cc16' },
  MASTERED: { key: 'mMastered', color: '#10b981' },
};
const MASTERY_ORDER: MasteryLevel[] = ['SHAKY', 'LEARNING', 'SOLID', 'MASTERED'];

const gradeColor = (g?: string | null) =>
  g === 'A' ? '#10b981' : g === 'B' ? '#84cc16' : g === 'C' ? '#f59e0b' : g === 'D' ? '#f97316' : g ? '#ef4444' : '#94a3b8';

export default function InterviewHistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [mastery, setMastery] = useState<MasteryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [uiLang, setUiLang] = useState<ILang>('VI');
  useEffect(() => {
    try {
      const saved = localStorage.getItem('interview:uiLang');
      if (saved === 'EN' || saved === 'VI') setUiLang(saved);
    } catch { /* ignore */ }
  }, []);
  const switchUiLang = (l: ILang) => {
    setUiLang(l);
    try { localStorage.setItem('interview:uiLang', l); } catch { /* ignore */ }
  };
  const t = makeT(uiLang);

  useEffect(() => {
    Promise.all([
      interviewApi.history().then((res) => setItems(res.data.data)).catch(() => {}),
      interviewApi.mastery().then((res) => setMastery(res.data.data)).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  return (
    <div className="relative min-h-screen bg-[var(--bg-primary)] text-text-primary pt-16 overflow-hidden">
      <ParticleBackground density="low" followPointer={false} />
      <div className="relative z-10 max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <Link href="/interview" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary"><ArrowLeft className="w-4 h-4" /> {t('backToRoom')}</Link>
          <div className="inline-flex rounded-lg border border-[var(--border-light)] overflow-hidden" role="group" aria-label="Display language">
            {(['VI', 'EN'] as const).map((lg) => (
              <button key={lg} onClick={() => switchUiLang(lg)} className={`px-2.5 py-1 text-xs transition-colors ${uiLang === lg ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-text-secondary hover:text-text-primary'}`}>{lg}</button>
            ))}
          </div>
        </div>
        <h1 className="text-2xl font-bold text-text-primary mb-6">{t('historyTitle')}</h1>

        {/* Drill CTA + mastery heatmap */}
        {mastery && mastery.totalCards > 0 && (
          <div className="mb-8 space-y-4">
            <Link href="/interview/drill" className="flex items-center gap-3 px-4 py-3 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/15 transition-colors">
              <Flame className="w-5 h-5 text-tone-amber shrink-0" />
              <div className="flex-1">
                <div className="text-sm font-semibold text-tone-amber">{mastery.totalDue > 0 ? t('dueToday', { n: mastery.totalDue }) : t('noDue')}</div>
                <div className="text-xs text-tone-amber">{t('drillSub')}</div>
              </div>
              <span className="text-sm text-tone-amber">{t('drillNow')}</span>
            </Link>

            <div className="rounded-xl border border-[var(--border-light)] p-4">
              <div className="flex items-center gap-2 mb-3"><Brain className="w-4 h-4 text-text-secondary" /><span className="text-sm font-semibold">{t('masteryMap')}</span></div>
              <div className="space-y-2">
                {mastery.topics.map((tp) => (
                  <div key={tp.topicId} className="flex items-center gap-3">
                    <span className="text-xs text-text-secondary w-32 shrink-0 truncate">{tp.topic}</span>
                    <div className="flex-1 flex h-4 rounded-md overflow-hidden bg-[var(--bg-surface-hover)]">
                      {MASTERY_ORDER.map((m) => {
                        const n = tp.byMastery[m] || 0;
                        if (!n) return null;
                        return <div key={m} title={`${t(MASTERY_META[m].key)}: ${n}`} style={{ width: `${(n / tp.total) * 100}%`, background: MASTERY_META[m].color }} />;
                      })}
                    </div>
                    {tp.due > 0 && <span className="text-[10px] text-tone-amber shrink-0">{t('dueShort', { n: tp.due })}</span>}
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-[var(--border-light)]">
                {MASTERY_ORDER.map((m) => (
                  <span key={m} className="inline-flex items-center gap-1.5 text-[11px] text-text-secondary"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: MASTERY_META[m].color }} />{t(MASTERY_META[m].key)}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center gap-2 text-text-secondary"><Loader2 className="w-4 h-4 animate-spin" /> {t('loadingCatalog')}</div>
        ) : !items.length ? (
          <div className="rounded-xl border border-[var(--border-light)] p-6 text-text-secondary">{t('emptyHistory')}<Link href="/interview" className="text-tone-amber">{t('startNow')}</Link></div>
        ) : (
          <div className="space-y-2">
            {items.map((s) => (
              <Link key={s.id} href={s.status === 'COMPLETED' ? `/interview/report/${s.id}` : `/interview/session/${s.id}`} className="flex items-center gap-4 px-4 py-3 rounded-xl border border-[var(--border-light)] hover:border-slate-500 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-text-primary truncate">{s.track}</div>
                  <div className="text-xs text-text-secondary">{s.level} · {s.status === 'COMPLETED' ? t('statusDone') : t('statusInProgress')} · {new Date(s.createdAt).toLocaleDateString(uiLang === 'VI' ? 'vi-VN' : 'en-US')}</div>
                </div>
                {s.letterGrade ? (
                  <span className="text-lg font-bold font-mono" style={{ color: `color-mix(in srgb, ${gradeColor(s.letterGrade)} 65%, var(--text-primary))` }}>{s.letterGrade}</span>
                ) : (
                  <span className="text-xs text-text-secondary">—</span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
