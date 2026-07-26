'use client';

/**
 * Exam Room portal — the lobby. Three tabs:
 *   • Browse    — every published exam, grouped by semester → course, search + FE/PE filter.
 *   • History   — the student's attempts (subject code + semester + retake/review/delete/bookmark).
 *   • Notebook  — saved exams + saved questions foldered by semester → subject ("Sổ tay ôn tập").
 *
 * The whole exam area DEFAULTS TO ENGLISH (exams are taken in English at FPTU);
 * a local EN/VN toggle flips language for this page only, without touching the
 * global site locale. Each visit starts in English again.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  GraduationCap, Search as SearchIcon, Clock as ClockIcon,
  CheckCircle2 as CheckCircleIcon, XCircle as XCircleIcon,
  Bookmark as BookmarkIcon, Trash2 as TrashIcon, RotateCw as RetakeIcon,
  ChevronDown, Eye as EyeIcon, BookMarked, History as HistoryIcon, Layers as LayersIcon,
} from 'lucide-react';
import { examApi, type ExamPortalItem } from '@/lib/api';
import { pickLang } from '@/lib/utils';
import ExamRichContent from './ExamRichContent';
import './exam.css';

// ── Shapes (mirror the enriched backend payloads) ──────────────────────
interface Sem { name: string; ordinal: number; code: string }
interface Course { title: string; slug: string; courseCode: string | null }
interface MyAttempt {
  id: number; examId: number; status: string; submittedAt: string | null; timeSpentSeconds: number;
  score: number | null; maxScore: number | null; passed: boolean | null; gradingMode: string; bookmarked: boolean;
  exam: { id: number; title: string; kind: string; peType: string | null; code: string | null; courseId: number; passMark: number; totalPoints: number; course: Course | null; semester: Sem | null };
}
interface ExamBookmark {
  id: number; examId: number; createdAt: string;
  exam: { id: number; kind: string; peType: string | null; title: string; code: string | null; durationMinutes: number; totalPoints: number; passMark: number; questionCount: number; courseId: number };
  course: Course | null; semester: Sem | null;
}
interface QBookmark {
  id: number; note: string | null; createdAt: string; questionId: number; examId: number;
  question: { id: number; kind: string; points: number; prompt: string; imageUrl: string | null; options: { text: string }[] | null; correctIndexes: number[]; explanation: string | null; language: string | null; sampleSolution: string | null; expectedOutput: string | null };
  exam: { id: number; kind: string; peType: string | null; title: string; code: string | null; courseId: number };
  course: Course | null; semester: Sem | null;
}

type Tab = 'browse' | 'history' | 'notebook';
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

export default function ExamPortalClient() {
  const [L, setL] = useState<'en' | 'vi'>('en'); // exams default to English
  const isVi = L === 'vi';

  const [tab, setTab] = useState<Tab>('browse');
  const [exams, setExams] = useState<ExamPortalItem[]>([]);
  const [attempts, setAttempts] = useState<MyAttempt[]>([]);
  const [examBms, setExamBms] = useState<ExamBookmark[]>([]);
  const [qBms, setQBms] = useState<QBookmark[]>([]);
  const [bmIds, setBmIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'FE' | 'PE'>('ALL');

  const reloadBookmarks = useCallback(() => {
    examApi.myExamBookmarks().then((r) => {
      const list = (r.data as { data: ExamBookmark[] }).data || [];
      setExamBms(list);
      setBmIds(new Set(list.map((b) => b.examId)));
    }).catch(() => {});
    examApi.myQuestionBookmarks().then((r) => setQBms((r.data as { data: QBookmark[] }).data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    examApi.listAll().then((r) => setExams(r.data.data)).catch(() => {}).finally(() => setLoading(false));
    examApi.myAttempts().then((r) => setAttempts((r.data as { data: MyAttempt[] }).data || [])).catch(() => {});
    reloadBookmarks();
  }, [reloadBookmarks]);

  // ── Actions ───────────────────────────────────────────────────────────
  const toggleExamBm = async (examId: number) => {
    try {
      const r = await examApi.toggleExamBookmark(examId);
      const on = r.data.data.bookmarked;
      setBmIds((s) => { const n = new Set(s); on ? n.add(examId) : n.delete(examId); return n; });
      setAttempts((as) => as.map((a) => (a.examId === examId ? { ...a, bookmarked: on } : a)));
      reloadBookmarks();
      toast.success(on ? (isVi ? 'Đã lưu đề vào sổ tay' : 'Saved to notebook') : (isVi ? 'Đã bỏ lưu' : 'Removed'));
    } catch { toast.error(isVi ? 'Không lưu được' : 'Could not save'); }
  };

  const deleteAttempt = async (id: number) => {
    if (!window.confirm(isVi ? 'Xoá lần thi này khỏi lịch sử?' : 'Delete this attempt from your history?')) return;
    try {
      await examApi.deleteAttempt(id);
      setAttempts((as) => as.filter((a) => a.id !== id));
      toast.success(isVi ? 'Đã xoá' : 'Deleted');
    } catch { toast.error(isVi ? 'Không xoá được' : 'Could not delete'); }
  };

  const removeQBm = async (questionId: number) => {
    try { await examApi.toggleQuestionBookmark(questionId); setQBms((q) => q.filter((b) => b.questionId !== questionId)); toast.success(isVi ? 'Đã bỏ lưu câu' : 'Removed'); }
    catch { toast.error(isVi ? 'Lỗi' : 'Error'); }
  };

  const saveNote = async (questionId: number, note: string) => {
    try { await examApi.updateQuestionBookmarkNote(questionId, note); setQBms((q) => q.map((b) => (b.questionId === questionId ? { ...b, note } : b))); toast.success(isVi ? 'Đã lưu ghi chú' : 'Note saved'); }
    catch { toast.error(isVi ? 'Lỗi lưu ghi chú' : 'Could not save note'); }
  };

  // ── Browse groups (semester → course) ──────────────────────────────────
  const filtered = useMemo(() => {
    const qy = query.trim().toLowerCase();
    return exams.filter((e) => {
      if (filter !== 'ALL' && e.kind !== filter) return false;
      if (!qy) return true;
      return [e.title, e.course?.title, e.course?.courseCode, e.code].filter(Boolean).some((s) => String(s).toLowerCase().includes(qy));
    });
  }, [exams, query, filter]);

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
    <div className="exam-root exam-portal min-h-screen" data-ml={L}>
      <div className="exam-portal-bg"><span className="exam-blob exam-blob-1" /><span className="exam-blob exam-blob-2" /><span className="exam-blob exam-blob-3" /></div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="exam-hero mb-6 relative">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[var(--exam-accent)] mb-2"><GraduationCap className="w-6 h-6" /><span className="text-sm font-semibold uppercase tracking-wide">{isVi ? 'Phòng thi' : 'Exam Room'}</span></div>
              <h1 className="text-2xl sm:text-3xl font-bold">{isVi ? 'Thi thử như trên trường' : 'Practice exams, exactly like school'}</h1>
              <p className="text-text-secondary mt-2 max-w-xl">{isVi ? 'Thi FE (trắc nghiệm) và PE (code / viết / nói) với đề thật, chấm tự động & AI, lưu lịch sử và sổ tay ôn tập.' : 'Take FE (multiple choice) and PE (code / writing / speaking) exams with real papers, auto & AI grading, saved history and a revision notebook.'}</p>
            </div>
            <button onClick={() => setL(isVi ? 'en' : 'vi')} className="shrink-0 text-xs font-semibold px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--exam-accent)]">
              {isVi ? 'EN' : 'VI'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="exam-tabs mb-6">
          <button className="exam-tab" data-active={tab === 'browse'} onClick={() => setTab('browse')}><LayersIcon className="w-4 h-4" />{isVi ? 'Đề thi' : 'Exams'}</button>
          <button className="exam-tab" data-active={tab === 'history'} onClick={() => setTab('history')}><HistoryIcon className="w-4 h-4" />{isVi ? 'Lịch sử' : 'History'}{attempts.length > 0 && <span className="ml-1 text-[11px] opacity-80">({attempts.length})</span>}</button>
          <button className="exam-tab" data-active={tab === 'notebook'} onClick={() => setTab('notebook')}><BookMarked className="w-4 h-4" />{isVi ? 'Sổ tay' : 'Notebook'}{(examBms.length + qBms.length) > 0 && <span className="ml-1 text-[11px] opacity-80">({examBms.length + qBms.length})</span>}</button>
        </div>

        {tab === 'browse' && (
          <BrowseTab
            loading={loading} groups={groups} L={L} isVi={isVi}
            query={query} setQuery={setQuery} filter={filter} setFilter={setFilter}
            bmIds={bmIds} onToggleBm={toggleExamBm}
          />
        )}

        {tab === 'history' && (
          <HistoryTab attempts={attempts} L={L} isVi={isVi} bmIds={bmIds} onToggleBm={toggleExamBm} onDelete={deleteAttempt} />
        )}

        {tab === 'notebook' && (
          <NotebookTab examBms={examBms} qBms={qBms} L={L} isVi={isVi} onRemoveExam={toggleExamBm} onRemoveQ={removeQBm} onSaveNote={saveNote} />
        )}
      </div>
    </div>
  );
}

// ── Browse tab ──────────────────────────────────────────────────────────
function BrowseTab({ loading, groups, L, isVi, query, setQuery, filter, setFilter, bmIds, onToggleBm }: {
  loading: boolean;
  groups: { name: string; ordinal: number; courses: { title: string; slug: string; code: string | null; exams: ExamPortalItem[] }[] }[];
  L: 'en' | 'vi'; isVi: boolean; query: string; setQuery: (v: string) => void;
  filter: 'ALL' | 'FE' | 'PE'; setFilter: (f: 'ALL' | 'FE' | 'PE') => void;
  bmIds: Set<number>; onToggleBm: (id: number) => void;
}) {
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <SearchIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
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
                        <div key={e.id} className="flex items-center gap-2 p-3 rounded-xl border border-[var(--border-color)] hover:border-[var(--exam-accent)] transition-colors">
                          <Link href={`/exam/${e.id}`} className="flex items-center justify-between gap-3 min-w-0 flex-1">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`exam-badge ${e.kind === 'FE' ? 'exam-badge-fe' : 'exam-badge-pe'}`}>{e.kind === 'FE' ? 'FE' : `PE·${e.peType}`}</span>
                                {e.code && <span className="text-[11px] text-text-muted">{e.code}</span>}
                              </div>
                              <div className="text-sm font-medium truncate">{pickLang(e.title, L)}</div>
                            </div>
                            <div className="text-xs text-text-muted text-right shrink-0">
                              <div className="flex items-center gap-1 justify-end"><ClockIcon className="w-3.5 h-3.5" />{e.durationMinutes}&apos;</div>
                              <div>{e.questionCount} {isVi ? 'câu' : 'q'}</div>
                            </div>
                          </Link>
                          <button className="exam-bm w-9 h-9 shrink-0" data-on={bmIds.has(e.id)} onClick={() => onToggleBm(e.id)}
                            title={bmIds.has(e.id) ? (isVi ? 'Bỏ lưu' : 'Remove bookmark') : (isVi ? 'Lưu đề' : 'Bookmark exam')}>
                            <BookmarkIcon className="w-4 h-4" fill={bmIds.has(e.id) ? 'currentColor' : 'none'} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ── History tab ─────────────────────────────────────────────────────────
function HistoryTab({ attempts, L, isVi, bmIds, onToggleBm, onDelete }: {
  attempts: MyAttempt[]; L: 'en' | 'vi'; isVi: boolean; bmIds: Set<number>; onToggleBm: (id: number) => void; onDelete: (id: number) => void;
}) {
  if (attempts.length === 0) return <div className="exam-card p-10 text-center text-text-muted">{isVi ? 'Bạn chưa thi đề nào. Chọn tab "Đề thi" để bắt đầu.' : 'No attempts yet. Head to the "Exams" tab to start.'}</div>;
  const fmtDate = (s: string | null) => (s ? new Date(s).toLocaleDateString(isVi ? 'vi-VN' : 'en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—');
  return (
    <div className="space-y-3">
      {attempts.map((a) => {
        const passed = a.passed === true;
        const mins = Math.floor(a.timeSpentSeconds / 60), secs = a.timeSpentSeconds % 60;
        return (
          <div key={a.id} className="exam-card p-4">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className={`exam-badge ${a.exam.kind === 'FE' ? 'exam-badge-fe' : 'exam-badge-pe'}`}>{a.exam.kind === 'FE' ? 'FE' : `PE·${a.exam.peType}`}</span>
              {a.exam.course?.courseCode && <span className="exam-badge" style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)' }}>{a.exam.course.courseCode}</span>}
              {a.exam.semester && <span className="text-[11px] text-text-muted">{a.exam.semester.name}</span>}
              {a.exam.code && <span className="text-[11px] text-text-muted">· {a.exam.code}</span>}
              <span className="ml-auto text-[11px] text-text-muted">{fmtDate(a.submittedAt)}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium truncate">{pickLang(a.exam.title, L)}</div>
                <div className="text-xs text-text-muted mt-1 flex items-center gap-3 flex-wrap">
                  <span className="flex items-center gap-1">{passed ? <CheckCircleIcon className="w-3.5 h-3.5 text-[var(--exam-ok)]" /> : <XCircleIcon className="w-3.5 h-3.5 text-[var(--exam-danger)]" />}<b className="exam-timer text-text-secondary">{a.score ?? '—'}</b>/{a.maxScore ?? '—'}</span>
                  <span className="flex items-center gap-1"><ClockIcon className="w-3.5 h-3.5" />{mins}:{String(secs).padStart(2, '0')}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <Link href={`/exam/attempt/${a.id}`} className="exam-bm w-9 h-9" title={isVi ? 'Xem lại' : 'Review'}><EyeIcon className="w-4 h-4" /></Link>
                <Link href={`/exam/${a.examId}`} className="exam-bm w-9 h-9" title={isVi ? 'Thi lại' : 'Retake'}><RetakeIcon className="w-4 h-4" /></Link>
                <button className="exam-bm w-9 h-9" data-on={bmIds.has(a.examId)} onClick={() => onToggleBm(a.examId)} title={isVi ? 'Lưu đề' : 'Bookmark'}><BookmarkIcon className="w-4 h-4" fill={bmIds.has(a.examId) ? 'currentColor' : 'none'} /></button>
                <button className="exam-bm w-9 h-9 hover:!text-[var(--exam-danger)] hover:!border-[var(--exam-danger)]" onClick={() => onDelete(a.id)} title={isVi ? 'Xoá' : 'Delete'}><TrashIcon className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Notebook tab ────────────────────────────────────────────────────────
function NotebookTab({ examBms, qBms, L, isVi, onRemoveExam, onRemoveQ, onSaveNote }: {
  examBms: ExamBookmark[]; qBms: QBookmark[]; L: 'en' | 'vi'; isVi: boolean;
  onRemoveExam: (id: number) => void; onRemoveQ: (qid: number) => void; onSaveNote: (qid: number, note: string) => void;
}) {
  // Fold saved questions by semester → subject.
  const folders = useMemo(() => {
    const bySem = new Map<string, { name: string; ordinal: number; subjects: Map<string, { code: string; title: string; items: QBookmark[] }> }>();
    for (const b of qBms) {
      const semKey = b.semester?.code || 'other';
      if (!bySem.has(semKey)) bySem.set(semKey, { name: b.semester?.name || (isVi ? 'Khác' : 'Other'), ordinal: b.semester?.ordinal ?? 999, subjects: new Map() });
      const sem = bySem.get(semKey)!;
      const code = b.course?.courseCode || `#${b.exam.courseId}`;
      if (!sem.subjects.has(code)) sem.subjects.set(code, { code, title: b.course?.title || code, items: [] });
      sem.subjects.get(code)!.items.push(b);
    }
    return [...bySem.values()].sort((a, b) => a.ordinal - b.ordinal)
      .map((s) => ({ ...s, subjects: [...s.subjects.values()].sort((a, b) => a.code.localeCompare(b.code)) }));
  }, [qBms, isVi]);

  const empty = examBms.length === 0 && qBms.length === 0;
  if (empty) {
    return (
      <div className="exam-card p-10 text-center text-text-muted">
        <BookMarked className="w-8 h-8 mx-auto mb-3 opacity-50" />
        <p className="font-medium text-text-secondary mb-1">{isVi ? 'Sổ tay đang trống' : 'Your notebook is empty'}</p>
        <p className="text-sm">{isVi ? 'Bấm biểu tượng cờ/bookmark trên đề để lưu đề, hoặc lưu từng câu khó ở trang kết quả để ôn lại.' : 'Bookmark an exam to save it, or save any hard question from the result page to review later.'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Saved exams */}
      {examBms.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-text-secondary mb-3">{isVi ? 'Đề đã lưu' : 'Saved exams'}</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {examBms.map((b) => (
              <div key={b.id} className="flex items-center gap-2 p-3 rounded-xl border border-[var(--border-color)] exam-card">
                <Link href={`/exam/${b.examId}`} className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`exam-badge ${b.exam.kind === 'FE' ? 'exam-badge-fe' : 'exam-badge-pe'}`}>{b.exam.kind === 'FE' ? 'FE' : `PE·${b.exam.peType}`}</span>
                    {b.course?.courseCode && <span className="text-[11px] text-text-muted">{b.course.courseCode}</span>}
                    {b.semester && <span className="text-[11px] text-text-muted">· {b.semester.name}</span>}
                  </div>
                  <div className="text-sm font-medium truncate">{pickLang(b.exam.title, L)}</div>
                </Link>
                <button className="exam-bm w-9 h-9 shrink-0" data-on onClick={() => onRemoveExam(b.examId)} title={isVi ? 'Bỏ lưu' : 'Remove'}><BookmarkIcon className="w-4 h-4" fill="currentColor" /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Saved questions foldered by semester → subject */}
      {qBms.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-text-secondary mb-3">{isVi ? 'Câu đã lưu' : 'Saved questions'}</h2>
          <div className="space-y-6">
            {folders.map((sem) => (
              <div key={sem.name}>
                <div className="text-xs font-bold uppercase tracking-wide text-text-muted mb-2">{sem.name}</div>
                <div className="space-y-3">
                  {sem.subjects.map((sub) => (
                    <Folder key={sub.code} sub={sub} L={L} isVi={isVi} onRemoveQ={onRemoveQ} onSaveNote={onSaveNote} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Folder({ sub, L, isVi, onRemoveQ, onSaveNote }: {
  sub: { code: string; title: string; items: QBookmark[] }; L: 'en' | 'vi'; isVi: boolean;
  onRemoveQ: (qid: number) => void; onSaveNote: (qid: number, note: string) => void;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="exam-folder">
      <button className="exam-folder-head" onClick={() => setOpen((o) => !o)}>
        <span className="exam-folder-badge">{sub.code.slice(0, 4)}</span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold truncate">{sub.code}</span>
          <span className="block text-xs text-text-muted truncate">{pickLang(sub.title, L)}</span>
        </span>
        <span className="text-xs text-text-muted mr-1">{sub.items.length} {isVi ? 'câu' : 'q'}</span>
        <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="p-3 sm:p-4 space-y-3">
          {sub.items.map((b) => <QuestionCard key={b.id} b={b} L={L} isVi={isVi} onRemoveQ={onRemoveQ} onSaveNote={onSaveNote} />)}
        </div>
      )}
    </div>
  );
}

function QuestionCard({ b, L, isVi, onRemoveQ, onSaveNote }: {
  b: QBookmark; L: 'en' | 'vi'; isVi: boolean; onRemoveQ: (qid: number) => void; onSaveNote: (qid: number, note: string) => void;
}) {
  const q = b.question;
  const [note, setNote] = useState(b.note || '');
  const [showExpl, setShowExpl] = useState(false);
  const dirty = (note.trim()) !== (b.note || '').trim();
  return (
    <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-4">
      <div className="flex items-start gap-2 mb-2">
        <span className="exam-badge exam-badge-fe shrink-0">{q.kind === 'MCQ' ? (isVi ? 'Trắc nghiệm' : 'MCQ') : q.kind}</span>
        <div className="text-xs text-text-muted min-w-0 flex-1 truncate pt-1">{b.exam.code || pickLang(b.exam.title, L)}</div>
        <Link href={`/exam/${b.examId}`} className="exam-bm w-8 h-8 shrink-0" title={isVi ? 'Vào đề' : 'Open exam'}><RetakeIcon className="w-3.5 h-3.5" /></Link>
        <button className="exam-bm w-8 h-8 shrink-0 hover:!text-[var(--exam-danger)] hover:!border-[var(--exam-danger)]" onClick={() => onRemoveQ(q.id)} title={isVi ? 'Bỏ lưu' : 'Remove'}><TrashIcon className="w-3.5 h-3.5" /></button>
      </div>
      <ExamRichContent html={q.prompt} L={L} className="text-[14px] leading-relaxed mb-2" />

      {/* MCQ options + correct answer */}
      {q.kind === 'MCQ' && q.options && (
        <div className="space-y-1.5 mb-2">
          {q.options.map((o, oi) => {
            const correct = q.correctIndexes.includes(oi);
            return (
              <div key={oi} className={`flex gap-2 text-[13px] px-2.5 py-1.5 rounded-lg ${correct ? 'bg-[rgba(16,185,129,.12)] border border-[rgba(16,185,129,.3)]' : ''}`}>
                <span className={`font-bold ${correct ? 'text-[var(--exam-ok)]' : 'text-text-muted'}`}>{LETTERS[oi]}</span>
                <span><ExamRichContent html={o.text} L={L} inline />{correct && <span className="text-[var(--exam-ok)] text-[11px] ml-1">✓ {isVi ? 'đáp án đúng' : 'correct'}</span>}</span>
              </div>
            );
          })}
        </div>
      )}

      {q.explanation && (
        <div className="mb-2">
          <button onClick={() => setShowExpl((s) => !s)} className="text-xs font-semibold text-[var(--exam-accent)]">{showExpl ? (isVi ? 'Ẩn giải thích' : 'Hide explanation') : (isVi ? 'Xem giải thích' : 'Show explanation')}</button>
          {showExpl && <ExamRichContent html={q.explanation} L={L} className="exam-explain mt-2 text-[13px]" />}
        </div>
      )}

      {/* Personal note */}
      <div className="flex items-end gap-2 mt-2">
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={1}
          placeholder={isVi ? 'Ghi chú của bạn (vì sao khó nhớ…)' : 'Your note (why it was tricky…)'}
          className="exam-note flex-1" />
        {dirty && <button onClick={() => onSaveNote(q.id, note)} className="px-3 py-1.5 rounded-lg text-white text-xs font-semibold shrink-0" style={{ background: 'linear-gradient(135deg, var(--exam-accent), var(--exam-accent-2))' }}>{isVi ? 'Lưu' : 'Save'}</button>}
      </div>
    </div>
  );
}
