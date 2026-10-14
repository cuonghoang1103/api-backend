'use client';

/**
 * Code Lab — trang làm MỘT bài, bố cục kiểu LeetCode (đợt 1, 14/10/2026).
 *
 *   ≥1024px (web):  ┌ thanh mảnh: quay lại · Trước · Bài 3/5 · Sau ────────────┐
 *                   │ TRÁI (cuộn riêng)          │ PHẢI (cố định)              │
 *                   │ [Đề|Lời giải|Giải thích AI] │ Code của bạn                │
 *                   │ thẻ đề trắng ProblemCard    │ Workspace (ô soạn cao theo  │
 *                   │                             │ màn hình) · Chạy/Lưu/Đánh   │
 *                   │                             │ dấu · Console               │
 *   <1024px:        hai tab "Đề | Code" dính trên, mỗi lúc một ngăn.
 *
 * Cột trái/phải giữ tên lớp cũ `cl-ex-trai` / `cl-ex-phai` trong `cl-ex-luoi`:
 * app desktop dựng chúng thành 2 cột bằng container query riêng
 * (desktop/src/renderer/features/codelab/codelab-desk.css). Luật 2 cột của WEB
 * (code-lab.css) loại trừ khung app `.ct-cl-khung` để hai lớp không chồng nhau.
 *
 * `?bai=<slug bài học>&khoa=<slug khoá>` (đến từ nút "Luyện tập" dưới video bài
 * học): Trước/Sau chỉ chạy trong bộ luyện do `GET /code-lab/practice/:khoa/:bai`
 * trả về (đã sắp Dễ → Khó; bài slide N.0 gộp cả chương). Có `bai` mà không có
 * `khoa` ⇒ lùi về module có slug trùng `bai`. `?ref=&reflabel=` giữ nút quay về bài học.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import {
  ArrowLeft, Loader2, CheckCircle2, Save, Play, ChevronLeft, ChevronRight,
  FileText, KeyRound, Sparkles, GraduationCap, Code2, X, Terminal,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { codeLabApi } from '@/lib/code-lab-api';
import type { CodeExercise, CodeBlock, CodeDifficulty } from '@/types/code-lab';
import { useAuthStore } from '@/store/authStore';
import { pickLang } from '@/lib/utils';
import { carryQS, duongDangNhap, layBoLuyenTapUi, sortEasyToHard, type SolutionFlags } from '@/lib/codelabUi';
import { CourseBackLink } from '@/components/code-lab/CourseBackLink';
import { Workspace, flavorFor } from '@/components/code-lab/Workspace';
import { AiExplain } from '@/components/code-lab/AiExplain';
import { CoachPanel } from '@/components/code-lab/CoachPanel';
import { ProblemCard } from '@/components/code-lab/ProblemCard';
import { SolutionPanel } from '@/components/code-lab/SolutionPanel';
import { chayJs } from '@/components/code-lab/chayJs';

/**
 * A name for the learner's first file when the exercise ships no starter.
 * LAB211 is done in NetBeans, so a Java exercise opens on Main.java, not on an
 * untitled buffer — the flavour knows what each track calls its entry point.
 */
function defaultFileName(ex: { language: string; track?: { slug?: string } | null }): string {
  return flavorFor(ex.track?.slug ?? '', ex.language).defaultFile;
}

type LeftTab = 'de' | 'giai' | 'ai' | 'coach';
type Sibling = { slug: string; title: string; difficulty: CodeDifficulty; sortOrder: number };

export default function ExerciseDetailPage() {
  const params = useParams<{ trackSlug: string; exerciseSlug: string }>();
  const searchParams = useSearchParams();
  // ref / reflabel / bai đi theo mọi link trong trang (quay lại track, Trước/Sau).
  const qs = carryQS(searchParams);
  const bai = searchParams.get('bai') || '';
  const khoa = searchParams.get('khoa') || '';
  const reflabel = searchParams.get('reflabel') || '';
  const pathname = usePathname();
  const isAuthed = useAuthStore((s) => s.isAuthenticated);
  const isLab211 = params.trackSlug === 'lab211';

  const [ex, setEx] = useState<CodeExercise | null>(null);
  const [loading, setLoading] = useState(true);
  // Thứ tự bài cho Trước/Sau: cả track (module theo thứ tự, trong module Dễ → Khó),
  // hoặc chỉ bộ luyện `?bai=`.
  const [siblings, setSiblings] = useState<Sibling[]>([]);
  const [setName, setSetName] = useState<string | null>(null);

  // Workspace state: EVERY file the learner has, not one. `name` is the path.
  const [files, setFiles] = useState<CodeBlock[]>([]);
  const [status, setStatus] = useState<'IN_PROGRESS' | 'SOLVED' | null>(null);
  const [saving, setSaving] = useState(false);
  // Reading language for the brief and the walkthrough. Shares the key the
  // lesson panel uses, so a learner picks a language once for the whole track.
  const [lang, setLang] = useState<'en' | 'vi'>('en');

  const [leftTab, setLeftTab] = useState<LeftTab>('de');
  // AI / Coach chỉ dựng khi được mở lần đầu (chúng gọi API lúc mount), rồi giữ nguyên.
  const [visited, setVisited] = useState<Record<LeftTab, boolean>>({ de: true, giai: false, ai: false, coach: false });
  const [solutionShown, setSolutionShown] = useState(false);
  const [pane, setPane] = useState<'de' | 'code'>('de');

  const [runOut, setRunOut] = useState<string | null>(null);

  // Đo chiều cao khung 2 cột (web ≥1024px) để cột phải vừa khít màn hình.
  const gridRef = useRef<HTMLDivElement>(null);
  const [wsH, setWsH] = useState<number | null>(null);
  const [isWide, setIsWide] = useState(false);
  const [inDesk, setInDesk] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('codelab.lessonLang');
      if (saved === 'vi' || saved === 'en') setLang(saved);
    } catch { /* storage bị chặn — giữ EN */ }
  }, []);

  const pickLangUi = (next: 'en' | 'vi') => {
    setLang(next);
    try { window.localStorage.setItem('codelab.lessonLang', next); } catch { /* ignore */ }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await codeLabApi.getExercise(params.exerciseSlug);
        const data = res.data.data;
        setEx(data);
        // Seed the workspace with EVERY starter file, not just the first. A
        // multi-file assignment that opens showing one file teaches the learner
        // the assignment is one file.
        const starterFiles: CodeBlock[] = (data.starterCodeJson ?? []).length
          ? data.starterCodeJson!.map((b) => ({ ...b }))
          : [{ name: defaultFileName(data), language: data.language, code: '' }];
        let seed: CodeBlock[] = starterFiles;
        if (isAuthed) {
          try {
            const p = await codeLabApi.myProgress(data.trackId);
            const mine = (p.data.data || []).find((it) => it.exerciseId === data.id);
            if (mine) {
              setStatus(mine.status);
              // Work saved before the workspace existed is a single block named
              // "Solution" — keep it, but give it a real filename to live under.
              if (mine.savedCode?.length) {
                seed = mine.savedCode.map((b, i) => ({
                  ...b,
                  name: b.name && b.name !== 'Solution' ? b.name
                    : (starterFiles[i]?.name ?? defaultFileName(data)),
                }));
              }
            }
          } catch { /* ignore */ }
        }
        setFiles(seed);
      } catch { setEx(null); } finally { setLoading(false); }
    })();
    // reset transient UI when the slug changes
    setStatus(null);
    setSolutionShown(false);
    setLeftTab('de');
    setVisited({ de: true, giai: false, ai: false, coach: false });
    setRunOut(null);
    setPane('de');
  }, [params.exerciseSlug, isAuthed]);

  // Danh sách bài cho Trước/Sau. Cùng thứ tự với trang track (trong module: Dễ → Khó).
  useEffect(() => {
    let alive = true;
    const theoTrack = () => codeLabApi.getTrack(params.trackSlug)
      .then((res) => {
        if (!alive) return;
        let mods = [...(res.data.data.modules || [])].sort((a, b) => a.sortOrder - b.sortOrder);
        const set = bai ? mods.find((m) => m.slug === bai) : undefined;
        if (set) mods = [set];
        setSetName(set ? set.name : null);
        const flat: Sibling[] = [];
        for (const mod of mods) {
          for (const e of sortEasyToHard(mod.exercises || [])) {
            flat.push({ slug: e.slug, title: e.title, difficulty: e.difficulty, sortOrder: e.sortOrder });
          }
        }
        setSiblings(flat);
      })
      .catch(() => { if (alive) { setSiblings([]); setSetName(null); } });
    if (bai && khoa) {
      // Bộ luyện của bài học: đúng danh sách + thứ tự của backend.
      layBoLuyenTapUi(khoa, bai)
        .then((bo) => {
          if (!alive) return;
          if (!bo.items.length) { void theoTrack(); return; }
          setSetName(reflabel || (bo.scope === 'chapter' ? 'cả chương' : bai));
          setSiblings(bo.items.map((it, i) => ({ slug: it.slug, title: it.title, difficulty: it.difficulty, sortOrder: i })));
        })
        .catch(() => { if (alive) void theoTrack(); });
    } else {
      void theoTrack();
    }
    return () => { alive = false; };
  }, [params.trackSlug, bai, khoa, reflabel]);

  // Locate the current exercise in the ordered list → neighbours.
  const nav = useMemo(() => {
    const idx = siblings.findIndex((s) => s.slug === params.exerciseSlug);
    if (idx < 0) return { idx, total: siblings.length, prev: null, next: null };
    return {
      idx,
      total: siblings.length,
      prev: idx > 0 ? siblings[idx - 1] : null,
      next: idx < siblings.length - 1 ? siblings[idx + 1] : null,
    };
  }, [siblings, params.exerciseSlug]);

  const editorLang = useMemo(() => ex?.language || 'text', [ex]);

  // Run in-browser (JS/TS only) — a convenience console for JavaScript exercises.
  const jsFile = useMemo(
    () => files.find((f) => /\.(m?js|ts)$/i.test(f.name) || ['javascript', 'js', 'typescript', 'ts'].includes((f.language || '').toLowerCase())),
    [files],
  );
  const canRun = !!jsFile;
  // Chạy trong worker có hạn giờ (components/code-lab/chayJs.ts): vòng lặp vô
  // hạn không treo tab nữa, và chạy được trong app desktop (CSP cấm eval trên trang).
  const runJs = useCallback(async () => {
    setRunOut('Đang chạy…');
    setRunOut(await chayJs(jsFile?.code ?? ''));
  }, [jsFile]);

  // Đo khung: web ≥1024px ⇒ cao = phần màn hình còn lại dưới thanh mảnh.
  // Trong app desktop (`.ct-cl-khung`) bố cục do codelab-desk.css lo, không đo.
  useEffect(() => {
    if (loading || !ex) return;
    const mq = window.matchMedia('(min-width: 1024px)');
    let raf = 0;
    const measure = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = gridRef.current;
        if (!el) return;
        const desk = !!el.closest('.ct-cl-khung');
        setInDesk(desk);
        setIsWide(mq.matches);
        if (!desk && mq.matches) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          setWsH(Math.max(460, Math.round(window.innerHeight - top - 12)));
        }
      });
    };
    measure();
    window.addEventListener('resize', measure);
    mq.addEventListener?.('change', measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', measure);
      mq.removeEventListener?.('change', measure);
    };
  }, [loading, ex]);

  // Phần cột phải KHÔNG phải ô soạn: tiêu đề, thanh công cụ Workspace, tên tệp,
  // hàng nút, đệm (~236px) + console + dòng ghi chú + link "Bài tiếp theo".
  const rightChrome = 236
    + (runOut != null ? 178 : 0)
    + (!canRun ? 24 : 0)
    + (!isAuthed ? 20 : 0)
    + (nav.next ? 52 : 0);
  const editorHeight = inDesk
    ? 440
    : isWide && wsH
      ? Math.min(1400, Math.max(220, wsH - rightChrome))
      : 340;

  const save = async (markSolved = false) => {
    if (!ex) return;
    if (!isAuthed) { toast.error('Đăng nhập để lưu bài làm.'); return; }
    setSaving(true);
    try {
      // Save the whole workspace. Saving only the open file is how the previous
      // version lost four classes out of five.
      const res = await codeLabApi.saveProgress(ex.id, { status: markSolved ? 'SOLVED' : 'IN_PROGRESS', savedCode: files });
      setStatus(res.data.data.status);
      toast.success(markSolved ? 'Đã đánh dấu là đã giải 🎉' : 'Đã lưu');
    } catch { toast.error('Không lưu được.'); } finally { setSaving(false); }
  };

  const openTab = (t: LeftTab) => {
    setLeftTab(t);
    setVisited((v) => (v[t] ? v : { ...v, [t]: true }));
  };

  // ─── Mọi hook ở TRÊN dòng này (build không chạy lint — bài học #310) ───
  if (loading) return <div className="flex justify-center py-24"><Loader2 className="animate-spin" style={{ color: 'var(--text-muted)' }} /></div>;
  if (!ex) return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center" style={{ color: 'var(--text-muted)' }}>
      Không tìm thấy bài tập. <Link href="/code-lab" className="underline">Về Code Lab</Link>
    </div>
  );

  const solution = ex.solutionCodeJson || [];
  // Backend đợt 1: khách nhận `solutionLocked` + `hasSolution`, không có trường lời giải.
  const flags = ex as CodeExercise & SolutionFlags;
  const hasSolution = flags.hasSolution ?? (solution.length > 0 || !!ex.solutionExplanationHtml);
  const qsNow = searchParams.toString();
  const loginHref = duongDangNhap(`${pathname}${qsNow ? `?${qsNow}` : ''}`);
  const trackAccent = ex.track?.color || 'var(--accent-color)';
  const orderLabel = nav.idx >= 0 && nav.total > 0
    ? `Bài ${nav.idx + 1}/${nav.total}${setName ? ' trong bộ luyện' : ''}`
    : null;
  const backLabel = setName ? `Bộ luyện: ${pickLang(setName, lang)}` : (ex.track?.name || 'Lộ trình');

  const TABS: Array<{ id: LeftTab; label: string; icon: React.ReactNode }> = [
    { id: 'de', label: 'Đề', icon: <FileText size={14} /> },
    { id: 'giai', label: 'Lời giải', icon: <KeyRound size={14} /> },
    { id: 'ai', label: 'Giải thích AI', icon: <Sparkles size={14} /> },
    // The coach speaks NetBeans and marks Java: it belongs to LAB211, the
    // university lab it was built for.
    ...(isLab211 ? [{ id: 'coach' as LeftTab, label: 'Coach', icon: <GraduationCap size={14} /> }] : []),
  ];

  return (
    <div
      className="cl-root cl-ex cl-ws mx-auto max-w-3xl px-4 pb-10 pt-20"
      data-pane={pane}
      style={{
        color: 'var(--text-primary)',
        ['--cl-accent' as string]: trackAccent,
        ...(wsH ? { ['--cl-ws-h' as string]: `${wsH}px` } : {}),
      } as React.CSSProperties}
    >
      {/* ── Thanh mảnh ── */}
      <div className="cl-ws-top">
        <div className="cl-ws-backlink"><CourseBackLink /></div>
        <Link href={`/code-lab/${params.trackSlug}${qs}`} className="inline-flex min-w-0 items-center gap-1.5 text-sm transition-colors hover:opacity-80" style={{ color: 'var(--text-muted)' }}>
          <ArrowLeft size={15} className="shrink-0" /> <span className="truncate">{backLabel}</span>
        </Link>
        <div className="ml-auto flex shrink-0 items-center gap-1.5">
          {nav.prev ? (
            <Link href={`/code-lab/${params.trackSlug}/${nav.prev.slug}${qs}`} className="cl-navbtn" title={`Bài trước: ${nav.prev.title}`}>
              <ChevronLeft size={16} /> <span className="hidden sm:inline">Trước</span>
            </Link>
          ) : <span className="cl-navbtn" aria-disabled="true"><ChevronLeft size={16} /> <span className="hidden sm:inline">Trước</span></span>}
          {nav.idx >= 0 && nav.total > 0 && (
            <span className="px-1 text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>{nav.idx + 1}/{nav.total}</span>
          )}
          {nav.next ? (
            <Link href={`/code-lab/${params.trackSlug}/${nav.next.slug}${qs}`} className="cl-navbtn" data-primary="true" title={`Bài sau: ${nav.next.title}`}>
              <span className="hidden sm:inline">Sau</span> <ChevronRight size={16} />
            </Link>
          ) : <span className="cl-navbtn" aria-disabled="true"><span className="hidden sm:inline">Sau</span> <ChevronRight size={16} /></span>}
        </div>
      </div>

      {/* ── Điện thoại / màn hẹp: hai tab Đề | Code ── */}
      <div className="cl-ws-mtabs" role="tablist" aria-label="Đề hoặc code">
        <button type="button" role="tab" aria-selected={pane === 'de'} onClick={() => setPane('de')}><FileText size={15} /> Đề</button>
        <button type="button" role="tab" aria-selected={pane === 'code'} onClick={() => setPane('code')}><Code2 size={15} /> Code</button>
      </div>

      <div ref={gridRef} className="cl-ex-luoi cl-ws-grid">
        {/* ── TRÁI: Đề · Lời giải · Giải thích AI (· Coach) ── */}
        <div className="cl-ex-trai cl-ws-left">
          <div className="cl-ws-tabs" role="tablist" aria-label="Nội dung bài">
            {TABS.map((t) => (
              <button key={t.id} type="button" role="tab" aria-selected={leftTab === t.id} onClick={() => openTab(t.id)}>
                {t.icon}{t.label}
              </button>
            ))}
          </div>
          <div className="cl-ws-leftbody">
            <div hidden={leftTab !== 'de'}>
              <ProblemCard
                key={ex.id}
                ex={ex}
                lang={lang}
                onPickLang={pickLangUi}
                solved={status === 'SOLVED'}
                orderLabel={orderLabel}
                isLab211={isLab211}
              />
            </div>
            <div hidden={leftTab !== 'giai'}>
              <SolutionPanel
                key={ex.id}
                exerciseId={ex.id}
                lang={lang}
                solution={solution}
                explanationHtml={ex.solutionExplanationHtml}
                explanationHtmlVi={ex.solutionExplanationHtmlVi}
                hasSolution={hasSolution}
                needLogin={!!flags.solutionLocked && !isAuthed}
                loginHref={loginHref}
                revealed={solutionShown}
                onReveal={setSolutionShown}
              />
            </div>
            {visited.ai && (
              <div hidden={leftTab !== 'ai'}>
                <AiExplain exerciseId={ex.id} />
              </div>
            )}
            {isLab211 && visited.coach && (
              <div hidden={leftTab !== 'coach'}>
                <CoachPanel exerciseId={ex.id} />
              </div>
            )}
          </div>
        </div>

        {/* ── PHẢI: sổ bài ── */}
        <div
          className="cl-ex-phai cl-ws-right"
          onKeyDown={(e) => {
            if (canRun && (e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); void runJs(); }
          }}
        >
          <div className="cl-ws-righthead">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              <Code2 size={15} style={{ color: 'var(--cl-accent)' }} /> Code của bạn
            </span>
            <span className="cl-meta-chip cl-meta-chip-theme">{ex.language}</span>
            {status === 'SOLVED' && (
              <span className="ml-auto inline-flex items-center gap-1 text-xs font-semibold" style={{ color: '#22c55e' }}>
                <CheckCircle2 size={14} /> Đã giải
              </span>
            )}
          </div>
          <Workspace
            files={files}
            onChange={setFiles}
            exerciseId={ex.id}
            trackSlug={params.trackSlug as string}
            language={editorLang}
            projectName={ex.slug}
            editorHeight={editorHeight}
            compact={!inDesk}
          />
          <div className="cl-ws-actions">
            {canRun && (
              <button type="button" onClick={() => void runJs()} className="cl-btn cl-btn-run" title="Chạy (Ctrl/⌘ + Enter)">
                <Play size={15} /> Chạy
              </button>
            )}
            <button type="button" onClick={() => save(false)} disabled={saving} className="cl-btn cl-btn-ghost">
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />} Lưu
            </button>
            <button
              type="button"
              onClick={() => save(true)}
              disabled={saving}
              className="cl-btn cl-btn-solve"
              title="Code Lab chưa có máy chấm — bạn tự xác nhận đã làm xong"
            >
              <CheckCircle2 size={15} /> Tự đánh dấu đã giải
            </button>
          </div>
          {runOut != null && (
            <div className="cl-console">
              <div className="cl-console-head">
                <span className="inline-flex items-center gap-1.5"><Terminal size={13} /> Console</span>
                <button type="button" onClick={() => setRunOut(null)} aria-label="Đóng console" className="ml-auto"><X size={14} /></button>
              </div>
              <pre>{runOut}</pre>
            </div>
          )}
          {!canRun && (
            <p className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
              Nút Chạy chỉ có với JavaScript. Ngôn ngữ khác: chạy trên máy của bạn rồi lưu lại ở đây.
            </p>
          )}
          {!isAuthed && <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>Đăng nhập để lưu bài làm và theo dõi tiến độ.</p>}
          {nav.next && (
            <Link href={`/code-lab/${params.trackSlug}/${nav.next.slug}${qs}`} className="cl-nextlink">
              <span className="min-w-0 truncate">Bài tiếp theo: <b>{nav.next.title}</b></span>
              <ChevronRight size={15} className="shrink-0" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
