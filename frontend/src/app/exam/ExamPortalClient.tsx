'use client';

/**
 * Exam Room portal — every published exam, grouped by semester → course, plus
 * the signed-in student's recent attempts. Search + FE/PE filter. Bilingual.
 */
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { GraduationCap as AcademicCapIcon, Search as MagnifyingGlassIcon, Clock as ClockIcon, CheckCircle2 as CheckCircleIcon, XCircle as XCircleIcon } from 'lucide-react';
import { examApi, type ExamPortalItem } from '@/lib/api';
import { useTranslation } from '@/context/LocaleContext';
import { pickLang } from '@/lib/utils';
import './exam.css';

interface MyAttempt {
  id: number; examId: number; status: string; submittedAt: string | null; score: number | null; maxScore: number | null; passed: boolean | null;
  exam: { id: number; title: string; kind: string; peType: string | null; code: string | null };
}

export default function ExamPortalClient() {
  const { locale } = useTranslation();
  const L = locale === 'vi' ? 'vi' : 'en';
  const isVi = L === 'vi';
  const [exams, setExams] = useState<ExamPortalItem[]>([]);
  const [attempts, setAttempts] = useState<MyAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'FE' | 'PE'>('ALL');

  useEffect(() => {
    examApi.listAll().then((r) => setExams(r.data.data)).catch(() => {}).finally(() => setLoading(false));
    examApi.myAttempts().then((r) => setAttempts((r.data as { data: MyAttempt[] }).data || [])).catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    const qy = query.trim().toLowerCase();
    return exams.filter((e) => {
      if (filter !== 'ALL' && e.kind !== filter) return false;
      if (!qy) return true;
      return [e.title, e.course?.title, e.course?.courseCode, e.code].filter(Boolean).some((s) => String(s).toLowerCase().includes(qy));
    });
  }, [exams, query, filter]);

  // Group semester → course
  const groups = useMemo(() => {
    const bySem = new Map<string, { name: string; ordinal: number; courses: Map<number, { title: string; slug: string; code: string | null; exams: ExamPortalItem[] }> }>();
    for (const e of filtered) {
      const semKey = e.semester?.code || 'other';
      if (!bySem.has(semKey)) bySem.set(semKey, { name: e.semester?.name || (isVi ? 'Khác' : 'Other'), ordinal: e.semester?.ordinal ?? 999, courses: new Map() });
      const sem = bySem.get(semKey)!;
      if (!sem.courses.has(e.courseId)) sem.courses.set(e.courseId, { title: e.course?.title || `Course ${e.courseId}`, slug: e.course?.slug || '', code: e.course?.courseCode || null, exams: [] });
      sem.courses.get(e.courseId)!.exams.push(e);
    }
    return [...bySem.values()].sort((a, b) => a.ordinal - b.ordinal)
      .map((s) => ({ ...s, courses: [...s.courses.values()].sort((a, b) => (a.code || '').localeCompare(b.code || '')) }));
  }, [filtered, isVi]);

  return (
    <div className="exam-root min-h-screen" data-ml={L}>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-[var(--exam-accent)] mb-2"><AcademicCapIcon className="w-6 h-6" /><span className="text-sm font-semibold uppercase tracking-wide">{isVi ? 'Phòng thi' : 'Exam Room'}</span></div>
          <h1 className="text-3xl font-bold">{isVi ? 'Thi thử như trên trường' : 'Practice exams, exactly like school'}</h1>
          <p className="text-text-secondary mt-2">{isVi ? 'Thi FE (trắc nghiệm) và PE (thực hành: code / viết / nói) với đề thật, chấm điểm tự động và AI, lưu lại lịch sử.' : 'Take FE (multiple choice) and PE (code / writing / speaking) exams with real papers, auto & AI grading, and saved history.'}</p>
        </div>

        {/* My recent attempts */}
        {attempts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-text-secondary mb-3">{isVi ? 'Lần thi gần đây' : 'Recent attempts'}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {attempts.slice(0, 6).map((a) => (
                <Link key={a.id} href={`/exam/attempt/${a.id}`} className="exam-card p-4 hover:border-[var(--exam-accent)] transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`exam-badge ${a.exam.kind === 'FE' ? 'exam-badge-fe' : 'exam-badge-pe'}`}>{a.exam.kind === 'FE' ? 'FE' : `PE·${a.exam.peType}`}</span>
                    {a.passed != null && (a.passed ? <CheckCircleIcon className="w-5 h-5 text-[var(--exam-ok)]" /> : <XCircleIcon className="w-5 h-5 text-[var(--exam-danger)]" />)}
                  </div>
                  <div className="text-sm font-medium truncate">{pickLang(a.exam.title, L)}</div>
                  <div className="text-xs text-text-muted mt-1 exam-timer">{a.score ?? '—'}/{a.maxScore ?? '—'}</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={isVi ? 'Tìm môn, mã môn, đề…' : 'Search course, code, exam…'}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] outline-none focus:border-[var(--exam-accent)]" />
          </div>
          <div className="flex gap-2">
            {(['ALL', 'FE', 'PE'] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2.5 rounded-xl text-sm font-semibold border ${filter === f ? 'text-white border-transparent' : 'border-[var(--border-color)] text-text-secondary'}`}
                style={filter === f ? { background: 'linear-gradient(135deg, var(--exam-accent), var(--exam-accent-2))' } : {}}>{f === 'ALL' ? (isVi ? 'Tất cả' : 'All') : f}</button>
            ))}
          </div>
        </div>

        {/* Groups */}
        {loading ? (
          <div className="text-center text-text-muted py-16">{isVi ? 'Đang tải…' : 'Loading…'}</div>
        ) : groups.length === 0 ? (
          <div className="exam-card p-10 text-center text-text-muted">{isVi ? 'Chưa có đề thi nào.' : 'No exams yet.'}</div>
        ) : (
          <div className="space-y-8">
            {groups.map((sem) => (
              <div key={sem.name}>
                <h2 className="text-lg font-bold mb-3">{sem.name}</h2>
                <div className="space-y-4">
                  {sem.courses.map((c) => (
                    <div key={c.slug || c.title} className="exam-card p-4 sm:p-5">
                      <div className="flex items-center gap-2 mb-3">
                        {c.code && <span className="exam-badge" style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)' }}>{c.code}</span>}
                        <h3 className="font-semibold">{pickLang(c.title, L)}</h3>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-2.5">
                        {c.exams.map((e) => (
                          <Link key={e.id} href={`/exam/${e.id}`} className="flex items-center justify-between gap-3 p-3 rounded-xl border border-[var(--border-color)] hover:border-[var(--exam-accent)] transition-colors">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`exam-badge ${e.kind === 'FE' ? 'exam-badge-fe' : 'exam-badge-pe'}`}>{e.kind === 'FE' ? 'FE' : `PE·${e.peType}`}</span>
                                {e.code && <span className="text-[11px] text-text-muted">{e.code}</span>}
                              </div>
                              <div className="text-sm font-medium truncate">{pickLang(e.title, L)}</div>
                            </div>
                            <div className="text-xs text-text-muted text-right shrink-0">
                              <div className="flex items-center gap-1 justify-end"><ClockIcon className="w-3.5 h-3.5" />{e.durationMinutes}'</div>
                              <div>{e.questionCount} {isVi ? 'câu' : 'q'}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
