'use client';

/**
 * CTW đợt 9a — KHUNG TRANG LỚP (kiểu Google Classroom): `/work/classes?id=<lớp>&tab=<tab>`.
 *
 *   Stream · Classwork · People · Grades · Calendar — tên tab + tham số `tab` là HỢP ĐỒNG ổn định (slots/types.ts).
 *   9a sở hữu khung này + Stream / tài liệu trong Classwork / People / Calendar; 9b cắm bài tập (slots/AssignmentsSlot)
 *   + sổ điểm (slots/GradesSlot); 9c cắm quiz (slots/QuizzesSlot). Tham số phụ của khung: `checkin` (mã điểm danh từ QR).
 *
 * Mọi hook đặt TRƯỚC lệnh return sớm.
 */

import { useCallback, useRef, type KeyboardEvent } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, BookOpen, CalendarDays, GraduationCap, Megaphone, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workError } from '@/lib/work-api';
import { EmptyState, PageLoading } from '@/components/work/ui';
import { useWT, wt, type WKey } from '@/components/work/i18n';
import { teachingApi, teachingKeys } from '@/components/work/teaching/teachingApi';
import { CLASS_TABS, type ClassTab } from './slots/types';
import StreamTab from './tabs/StreamTab';
import ClassworkTab from './tabs/ClassworkTab';
import PeopleTab from './tabs/PeopleTab';
import GradesTab from './tabs/GradesTab';
import CalendarTab from './tabs/CalendarTab';

const TAB_ICON: Record<ClassTab, LucideIcon> = { stream: Megaphone, classwork: BookOpen, people: Users, grades: GraduationCap, calendar: CalendarDays };

const subjectLabel = (s: string) => (s === 'OTHER' ? wt('classroom.subject_OTHER') : s);

export default function ClassShell({ id }: { id: number }) {
  const { t } = useWT();
  const router = useRouter();
  const pathname = usePathname() ?? '/work/classes';
  const search = useSearchParams();
  const raw = search?.get('tab') ?? '';
  const tab: ClassTab = (CLASS_TABS as readonly string[]).includes(raw) ? (raw as ClassTab) : 'stream';
  const q = useQuery({ queryKey: teachingKeys.cls(id), queryFn: () => teachingApi.getClass(id) });
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const goTab = useCallback((next: ClassTab, extra?: Record<string, string>) => {
    const p = new URLSearchParams({ id: String(id), tab: next });
    for (const [k, v] of Object.entries(extra ?? {})) if (v) p.set(k, v);
    router.replace(`${pathname}?${p.toString()}`, { scroll: false });
  }, [router, pathname, id]);

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = CLASS_TABS.length;
    const j = e.key === 'ArrowRight' ? (i + 1) % n : e.key === 'ArrowLeft' ? (i - 1 + n) % n : e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : -1;
    if (j < 0) return;
    e.preventDefault();
    tabRefs.current[j]?.focus();
    goTab(CLASS_TABS[j]);
  };

  if (q.isLoading) return <PageLoading rows={4} />;
  if (q.error || !q.data) return <EmptyState title={workError(q.error)} action={<Link href="/work/classes" className="w-btn">{t('classroom.back')}</Link>} />;
  const c = q.data;

  return (
    <div className="w-page space-y-4">
      <Link href="/work/classes" className="inline-flex items-center gap-1 text-[13px] text-[var(--w-text-2)] hover:text-[var(--w-text)]"><ArrowLeft size={14} aria-hidden="true" />{t('classroom.back')}</Link>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[12px] font-medium text-[var(--w-text-2)]">{subjectLabel(c.subject)} · {c.classCode} · {c.term} · {t(`classroom.role_${c.role}` as WKey)}</div>
          <h2 className="text-[19px] font-semibold tracking-[-0.01em]">{c.name}</h2>
          <div className="mt-0.5 text-[13px] text-[var(--w-text-2)]">{t('classroom.lecturer')}: {c.teacher ? (c.teacher.displayName || c.teacher.username) : t('classroom.noLecturer')} · {t('classroom.createdBy', { name: c.owner.displayName || c.owner.username })}</div>
        </div>
        {c.manage && <span className={cn('rounded-full bg-[var(--w-sunken)] px-2 py-0.5 text-[12px] font-medium', c.joinState === 'OK' ? 'text-[var(--w-green-text)]' : 'text-[var(--w-text-2)]')}>{t(`classroom.state_${c.joinState}` as WKey)}</span>}
      </div>

      <div role="tablist" aria-label={t('c9a.tabsLabel')} className="-mx-1 flex gap-1 overflow-x-auto border-b border-[var(--w-border)] px-1">
        {CLASS_TABS.map((k, i) => {
          const Icon = TAB_ICON[k];
          const active = tab === k;
          return (
            <button
              key={k}
              ref={(el) => { tabRefs.current[i] = el; }}
              type="button"
              role="tab"
              id={`cls-tab-${k}`}
              aria-selected={active}
              aria-controls={`cls-panel-${k}`}
              tabIndex={active ? 0 : -1}
              data-testid={`cls-tab-${k}`}
              onClick={() => goTab(k)}
              onKeyDown={(e) => onKey(e, i)}
              className={cn(
                '-mb-px inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap border-b-2 px-2.5 pb-2.5 pt-1 text-[13px] font-medium transition-colors',
                active ? 'border-[var(--w-accent)] text-[var(--w-text)]' : 'border-transparent text-[var(--w-text-2)] hover:text-[var(--w-text)]',
              )}
            >
              <Icon size={14} aria-hidden="true" />{t(`c9a.tab_${k}` as WKey)}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" id={`cls-panel-${tab}`} aria-labelledby={`cls-tab-${tab}`} className="min-w-0">
        {tab === 'stream' && <StreamTab cls={c} goTab={goTab} />}
        {tab === 'classwork' && <ClassworkTab cls={c} goTab={goTab} />}
        {tab === 'people' && <PeopleTab cls={c} />}
        {tab === 'grades' && <GradesTab cls={c} goTab={goTab} />}
        {tab === 'calendar' && <CalendarTab cls={c} goTab={goTab} />}
      </div>
    </div>
  );
}
