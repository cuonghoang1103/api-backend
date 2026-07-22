'use client';

/**
 * Code Lab — exercise detail (NTU programming-notes style).
 * Sections: problem statement → diagram → I/O examples → constraints →
 * "Knowledge to learn & apply" → progressive hints → your-code editor
 * (save / mark solved) → reveal official solution + explanation → references.
 */
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft, Loader2, CheckCircle2, Lightbulb, Save, Eye, EyeOff, Play,
  BookOpen, Youtube, ExternalLink, ListChecks, Layers, ChevronLeft, ChevronRight,
  Image as ImageIcon, FileText, Download,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { codeLabApi, DIFFICULTY_META } from '@/lib/code-lab-api';
import type { CodeExercise, CodeBlock } from '@/types/code-lab';
import { useAuthStore } from '@/store/authStore';
import { sanitizeHtml } from '@/lib/sanitizeHtml';
import { CodeViewer } from '@/components/exp-hub/CodeViewer';
import { MiniCode } from '@/components/code-lab/MiniCode';
import { Workspace, flavorFor } from '@/components/code-lab/Workspace';
import { DifficultyBadge } from '@/components/code-lab/shared';
import { ExerciseResources } from '@/components/code-lab/ExerciseResources';
import { AiExplain } from '@/components/code-lab/AiExplain';
import { CoachPanel } from '@/components/code-lab/CoachPanel';

/**
 * A name for the learner's first file when the exercise ships no starter.
 * LAB211 is done in NetBeans, so a Java exercise opens on Main.java, not on an
 * untitled buffer — the flavour knows what each track calls its entry point.
 */
function defaultFileName(ex: { language: string; track?: { slug?: string } | null }): string {
  return flavorFor(ex.track?.slug ?? '', ex.language).defaultFile;
}

function Section({ icon, title, children, right }: {
  icon?: React.ReactNode; title: string; children: React.ReactNode; right?: React.ReactNode;
}) {
  return (
    <section className="mb-6">
      <h2 className="mb-2.5 flex items-center gap-2 text-[13px] font-bold uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
        <span className="grid h-6 w-6 place-items-center rounded-lg" style={{ background: 'color-mix(in srgb, var(--cl-accent) 13%, transparent)', color: 'var(--cl-accent)' }}>
          {icon || <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--cl-accent)' }} />}
        </span>
        {title}
        {right && <span className="ml-auto">{right}</span>}
      </h2>
      {children}
    </section>
  );
}

/** EN / VN switch, shown only when a translation exists. */
function LangSwitch({ lang, onPick }: { lang: 'en' | 'vi'; onPick: (l: 'en' | 'vi') => void }) {
  return (
    <span className="flex gap-1">
      {(['en', 'vi'] as const).map((c) => (
        <button key={c} onClick={() => onPick(c)} aria-pressed={lang === c}
          className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
          style={lang === c
            ? { background: 'var(--accent-color, #8b5cf6)', color: '#fff' }
            : { background: 'var(--bg-surface)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}>
          {c === 'en' ? 'EN' : 'VN'}
        </button>
      ))}
    </span>
  );
}

export default function ExerciseDetailPage() {
  const params = useParams<{ trackSlug: string; exerciseSlug: string }>();
  const isAuthed = useAuthStore((s) => s.isAuthenticated);

  const [ex, setEx] = useState<CodeExercise | null>(null);
  const [loading, setLoading] = useState(true);
  // Ordered list of every exercise in this track (module order, then exercise
  // order) — powers the Prev / Next navigation so you don't have to go back to
  // the roadmap after each one.
  const [siblings, setSiblings] = useState<Array<{ slug: string; title: string }>>([]);

  const [revealHints, setRevealHints] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [activeSolution, setActiveSolution] = useState(0);

  // Workspace state: EVERY file the learner has, not one. `name` is the path.
  const [files, setFiles] = useState<CodeBlock[]>([]);
  const [status, setStatus] = useState<'IN_PROGRESS' | 'SOLVED' | null>(null);
  const [saving, setSaving] = useState(false);
  // Reading language for the brief and the walkthrough. Shares the key the
  // lesson panel uses, so a learner picks a language once for the whole track.
  const [lang, setLang] = useState<'en' | 'vi'>('en');

  useEffect(() => {
    const saved = window.localStorage.getItem('codelab.lessonLang');
    if (saved === 'vi' || saved === 'en') setLang(saved);
  }, []);

  const pickLang = (next: 'en' | 'vi') => {
    setLang(next);
    window.localStorage.setItem('codelab.lessonLang', next);
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
    setRevealHints(0); setShowSolution(false); setActiveSolution(0);
  }, [params.exerciseSlug, isAuthed]);

  // Build the ordered exercise list for this track (for Prev/Next). Fetched
  // once per track, independent of which exercise is open.
  useEffect(() => {
    let alive = true;
    codeLabApi.getTrack(params.trackSlug)
      .then((res) => {
        if (!alive) return;
        const mods = [...(res.data.data.modules || [])].sort((a, b) => a.sortOrder - b.sortOrder);
        const flat: Array<{ slug: string; title: string }> = [];
        for (const mod of mods) {
          for (const e of [...(mod.exercises || [])].sort((a, b) => a.sortOrder - b.sortOrder)) {
            flat.push({ slug: e.slug, title: e.title });
          }
        }
        setSiblings(flat);
      })
      .catch(() => { if (alive) setSiblings([]); });
    return () => { alive = false; };
  }, [params.trackSlug]);

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

  const save = async (markSolved = false) => {
    if (!ex) return;
    if (!isAuthed) { toast.error('Please sign in to save your work.'); return; }
    setSaving(true);
    try {
      // Save the whole workspace. Saving only the open file is how the previous
      // version lost four classes out of five.
      const res = await codeLabApi.saveProgress(ex.id, { status: markSolved ? 'SOLVED' : 'IN_PROGRESS', savedCode: files });
      setStatus(res.data.data.status);
      toast.success(markSolved ? 'Marked as solved 🎉' : 'Saved');
    } catch { toast.error('Could not save.'); } finally { setSaving(false); }
  };

  // Run in-browser (JS/TS only) — a convenience console for JavaScript exercises.
  const [runOut, setRunOut] = useState<string | null>(null);
  const jsFile = useMemo(
    () => files.find((f) => /\.(m?js|ts)$/i.test(f.name) || ['javascript', 'js', 'typescript', 'ts'].includes((f.language || '').toLowerCase())),
    [files],
  );
  const canRun = !!jsFile;
  const runJs = () => {
    const logs: string[] = [];
    const orig = console.log;
    try {
      (console as any).log = (...a: unknown[]) => logs.push(a.map((x) => typeof x === 'object' ? JSON.stringify(x) : String(x)).join(' '));
      // eslint-disable-next-line no-new-func
      const fn = new Function((jsFile?.code ?? '').replace(/\bexport\b/g, ''));
      const ret = fn();
      if (ret !== undefined) logs.push(String(ret));
      setRunOut(logs.join('\n') || '(no output)');
    } catch (e: any) {
      setRunOut('Error: ' + (e?.message || String(e)));
    } finally { (console as any).log = orig; }
  };

  if (loading) return <div className="flex justify-center py-24"><Loader2 className="animate-spin" style={{ color: 'var(--text-muted)' }} /></div>;
  if (!ex) return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center" style={{ color: 'var(--text-muted)' }}>
      Exercise not found. <Link href="/code-lab" className="underline">Back to Code Lab</Link>
    </div>
  );

  const concepts = ex.concepts || [];
  const prereqs = ex.prerequisites || [];
  const examples = ex.examplesJson || [];
  const hints = ex.hintsJson || [];
  const solution = ex.solutionCodeJson || [];

  const trackAccent = ex.track?.color || 'var(--accent-color)';

  return (
    <div className="cl-root mx-auto max-w-3xl px-4 pb-10 pt-20" style={{ color: 'var(--text-primary)', ['--cl-accent' as string]: trackAccent } as React.CSSProperties}>
      <Link href={`/code-lab/${params.trackSlug}`} className="mb-4 inline-flex items-center gap-1.5 text-sm transition-colors hover:opacity-80" style={{ color: 'var(--text-muted)' }}>
        <ArrowLeft size={15} /> {ex.track?.name || 'Roadmap'}
      </Link>

      {/* Title bar — hero */}
      <div className="cl-hero cl-in mb-6 p-5 sm:p-6">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <h1 className="cl-display text-2xl sm:text-[1.7rem]">{ex.title}</h1>
          <DifficultyBadge difficulty={ex.difficulty} />
          {status === 'SOLVED' && (
            <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold text-white" style={{ background: '#22c55e' }}>
              <CheckCircle2 size={14} /> Solved
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
          {ex.module?.name && (
            <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-medium" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}>
              <Layers size={12} />{ex.module.name}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-medium" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}>{ex.language}</span>
          {ex.estimatedMinutes ? <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-medium" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}>≈ {ex.estimatedMinutes} min</span> : null}
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-semibold text-white" style={{ background: 'var(--cl-accent)' }}>{ex.points} pts</span>
        </div>
      </div>

      <ExerciseResources youtubeUrl={ex.youtubeUrl} githubUrl={ex.githubUrl} sourceUrl={ex.sourceUrl} />

      {/* Problem statement */}
      {ex.problemHtml && (
        <Section
          icon={<BookOpen size={14} />}
          title={lang === 'vi' && ex.problemHtmlVi ? 'Đề bài' : 'Problem'}
          right={ex.problemHtmlVi ? <LangSwitch lang={lang} onPick={pickLang} /> : undefined}
        >
          <div className="prose-cl text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml((lang === 'vi' && ex.problemHtmlVi) || ex.problemHtml) }} />
        </Section>
      )}

      {/* Diagram — Mermaid (illustrates the problem, NTU-style) + optional image */}
      {ex.diagramMermaid && (
        <figure className="mb-5">
          <CodeViewer code={ex.diagramMermaid} language="mermaid" />
        </figure>
      )}
      {ex.diagramImageUrl && (
        <figure className="mb-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ex.diagramImageUrl} alt="Diagram" className="mx-auto max-h-[420px] rounded-lg border" style={{ borderColor: 'var(--border-color)' }} />
        </figure>
      )}
      {/* The original assignment sheet, embedded. Always a PDF — a .docx cannot
          be rendered by a browser, so Word sources are converted and the
          untouched file stays available as a download beside it. */}
      {ex.briefPdfUrl && (
        <Section icon={<FileText size={14} />} title="Original assignment sheet">
          {/* An <iframe>, NOT an <object>: the site's CSP sets object-src 'none',
              which blocks <object>/<embed> outright and leaves an empty box.
              frame-src already allows the media host, so the iframe renders. */}
          <div className="overflow-hidden rounded-lg border" style={{ borderColor: 'var(--border-color)' }}>
            <iframe
              src={`${ex.briefPdfUrl}#view=FitH`}
              title="Original assignment sheet"
              loading="lazy"
              className="block h-[720px] w-full"
              style={{ border: 0, background: '#fff' }}
            />
          </div>
          <p className="mt-1 text-[11px]" style={{ color: 'var(--text-muted)' }}>
            On phones the viewer may stay blank — use “Open PDF full screen” below.
          </p>
          <div className="mt-2 flex flex-wrap gap-3 text-xs">
            <a href={ex.briefPdfUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 underline" style={{ color: '#6366f1' }}>
              <ExternalLink size={12} /> Open PDF full screen
            </a>
            {ex.briefFileUrl && ex.briefFileUrl !== ex.briefPdfUrl && (
              <a href={ex.briefFileUrl} download
                className="inline-flex items-center gap-1 underline" style={{ color: '#6366f1' }}>
                <Download size={12} /> Download the original Word file
              </a>
            )}
          </div>
        </Section>
      )}

      {/* Figures — screenshots of the original lab sheet. Its own section so a
          scanned brief reads as reference material, not as loose images. Click
          opens the full-resolution file, since screenshots of a spec are often
          too dense to read at column width. */}
      {(ex.imagesJson || []).length > 0 && (
        <Section icon={<ImageIcon size={14} />} title={`Figures from the brief (${ex.imagesJson!.length})`}>
          <div className="space-y-4">
            {ex.imagesJson!.map((im, i) => (
              <figure key={i}>
                <a href={im.url} target="_blank" rel="noopener noreferrer" title="Open full size">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={im.url}
                    alt={im.caption || `Figure ${i + 1}`}
                    loading="lazy"
                    className="mx-auto max-h-[520px] w-auto max-w-full rounded-lg border"
                    style={{ borderColor: 'var(--border-color)' }}
                  />
                </a>
                <figcaption className="mt-1.5 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
                  {im.caption ? `Figure ${i + 1} — ${im.caption}` : `Figure ${i + 1}`}
                </figcaption>
              </figure>
            ))}
          </div>
        </Section>
      )}

      <AiExplain exerciseId={ex.id} />

      {/* The coach speaks NetBeans and marks Java: it belongs to LAB211, the
          university lab it was built for. On a Node.js or SQL exercise it would
          ask the learner to "paste your Java code". */}
      {params.trackSlug === 'lab211' && <CoachPanel exerciseId={ex.id} />}

      {/* Input / Output specs */}
      {(ex.inputSpec || ex.outputSpec) && (
        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {ex.inputSpec && (
            <div className="rounded-lg border p-3" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)' }}>
              <div className="mb-1 text-xs font-bold uppercase" style={{ color: 'var(--text-secondary)' }}>Input</div>
              <div className="whitespace-pre-wrap text-sm" style={{ color: 'var(--text-primary)' }}>{ex.inputSpec}</div>
            </div>
          )}
          {ex.outputSpec && (
            <div className="rounded-lg border p-3" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)' }}>
              <div className="mb-1 text-xs font-bold uppercase" style={{ color: 'var(--text-secondary)' }}>Output</div>
              <div className="whitespace-pre-wrap text-sm" style={{ color: 'var(--text-primary)' }}>{ex.outputSpec}</div>
            </div>
          )}
        </div>
      )}

      {/* Examples */}
      {examples.length > 0 && (
        <Section icon={<ListChecks size={14} />} title="Examples">
          <div className="space-y-3">
            {examples.map((exm, i) => (
              <div key={i} className="rounded-lg border" style={{ borderColor: 'var(--border-color)' }}>
                <div className="border-b px-3 py-1.5 text-xs font-semibold" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>Example {i + 1}</div>
                <div className="grid grid-cols-1 gap-px sm:grid-cols-2" style={{ background: 'var(--border-color)' }}>
                  <div className="p-3" style={{ background: 'var(--bg-card)' }}>
                    <div className="mb-1 text-[10px] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Input</div>
                    <MiniCode code={exm.input || '—'} language={ex.language} />
                  </div>
                  <div className="p-3" style={{ background: 'var(--bg-card)' }}>
                    <div className="mb-1 text-[10px] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Output</div>
                    <MiniCode code={exm.output || '—'} plain />
                  </div>
                </div>
                {exm.explanation && (
                  <div className="border-t px-3 py-2 text-xs" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                    <b>Explanation:</b> {exm.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Constraints */}
      {ex.constraints && (
        <Section title="Constraints">
          <div className="whitespace-pre-wrap rounded-lg border p-3 text-sm" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}>{ex.constraints}</div>
        </Section>
      )}

      {/* Knowledge to learn & apply */}
      {(concepts.length > 0 || prereqs.length > 0) && (
        <Section title="Knowledge to learn & apply">
          {concepts.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1.5">
              {concepts.map((c, i) => (
                <span key={i} className="rounded-full px-2.5 py-1 text-xs font-medium" style={{ background: 'rgba(99,102,241,0.12)', color: '#6366f1' }}>{c}</span>
              ))}
            </div>
          )}
          {prereqs.length > 0 && (
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              <b>Prerequisites:</b> {prereqs.join(', ')}
            </div>
          )}
        </Section>
      )}

      {/* Hints (progressive) */}
      {hints.length > 0 && (
        <Section icon={<Lightbulb size={14} />} title="Hints">
          <div className="space-y-2">
            {hints.slice(0, revealHints).map((h, i) => (
              <div key={i} className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}>
                <b style={{ color: 'var(--text-muted)' }}>Hint {i + 1}.</b> {h}
              </div>
            ))}
            {revealHints < hints.length && (
              <button onClick={() => setRevealHints((n) => n + 1)} className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                <Lightbulb size={13} /> Reveal hint {revealHints + 1} of {hints.length}
              </button>
            )}
          </div>
        </Section>
      )}

      {/* Your code */}
      <Section icon={<Play size={14} />} title="Your solution">
        <Workspace
          files={files}
          onChange={setFiles}
          exerciseId={ex.id}
          trackSlug={params.trackSlug as string}
          language={editorLang}
          projectName={ex.slug}
        />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button onClick={() => save(false)} disabled={saving} className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-transform hover:-translate-y-0.5 disabled:opacity-60" style={{ background: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />} Save
          </button>
          <button onClick={() => save(true)} disabled={saving} className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5 disabled:opacity-60" style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
            <CheckCircle2 size={15} /> Mark solved
          </button>
          {canRun && (
            <button onClick={runJs} className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-transform hover:-translate-y-0.5" style={{ background: 'color-mix(in srgb, var(--cl-accent) 13%, transparent)', color: 'var(--cl-accent)', border: '1px solid color-mix(in srgb, var(--cl-accent) 30%, transparent)' }}>
              <Play size={15} /> Run (JS)
            </button>
          )}
        </div>
        {runOut != null && (
          <pre className="mt-2 max-h-48 overflow-auto rounded-lg border p-3 font-mono text-xs" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}>{runOut}</pre>
        )}
        {!isAuthed && <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>Sign in to save your attempts and track progress.</p>}
      </Section>

      {/* Official solution */}
      {(solution.length > 0 || ex.solutionExplanationHtml) && (
        <Section title="Official solution">
          {!showSolution ? (
            <button onClick={() => setShowSolution(true)} className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm font-medium" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
              <Eye size={14} /> Reveal solution
            </button>
          ) : (
            <>
              <button onClick={() => setShowSolution(false)} className="mb-2 inline-flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                <EyeOff size={13} /> Hide solution
              </button>
              {solution.length > 1 && (
                <div className="mb-2 flex flex-wrap gap-1">
                  {solution.map((b, i) => (
                    <button key={i} onClick={() => setActiveSolution(i)} className="rounded-md px-2 py-1 text-xs font-medium" style={i === activeSolution ? { background: '#6366f1', color: '#fff' } : { background: 'var(--bg-surface)', color: 'var(--text-secondary)' }}>{b.name}</button>
                  ))}
                </div>
              )}
              {solution[activeSolution] && (
                <CodeViewer code={solution[activeSolution].code} language={solution[activeSolution].language} filename={solution[activeSolution].name} maxHeight="520px" />
              )}
              {ex.solutionExplanationHtml && (
                <div className="prose-cl mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml((lang === 'vi' && ex.solutionExplanationHtmlVi) || ex.solutionExplanationHtml || '') }} />
              )}
            </>
          )}
        </Section>
      )}

      {/* References */}
      {(ex.youtubeUrl || ex.referenceUrl) && (
        <Section title="References">
          <div className="flex flex-wrap gap-3 text-sm">
            {ex.youtubeUrl && (
              <a href={ex.youtubeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 underline" style={{ color: '#ef4444' }}>
                <Youtube size={15} /> Video tutorial
              </a>
            )}
            {ex.referenceUrl && (
              <a href={ex.referenceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 underline" style={{ color: 'var(--text-secondary)' }}>
                <ExternalLink size={14} /> Reference
              </a>
            )}
          </div>
        </Section>
      )}

      {/* Prev / Next exercise navigation */}
      {(nav.prev || nav.next) && (
        <nav className="mt-8 border-t pt-5" style={{ borderColor: 'var(--border-color)' }}>
          {nav.idx >= 0 && nav.total > 0 && (
            <div className="mb-2 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
              Exercise {nav.idx + 1} of {nav.total}
            </div>
          )}
          <div className="flex items-stretch gap-3">
            {nav.prev ? (
              <Link
                href={`/code-lab/${params.trackSlug}/${nav.prev.slug}`}
                className="group flex flex-1 items-center gap-2 rounded-xl border p-3 transition-colors hover:border-indigo-400"
                style={{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)' }}
              >
                <ChevronLeft size={18} className="shrink-0" style={{ color: 'var(--text-muted)' }} />
                <span className="min-w-0">
                  <span className="block text-[10px] font-bold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Previous</span>
                  <span className="block truncate text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{nav.prev.title}</span>
                </span>
              </Link>
            ) : <div className="flex-1" />}
            {nav.next ? (
              <Link
                href={`/code-lab/${params.trackSlug}/${nav.next.slug}`}
                className="group flex flex-1 items-center justify-end gap-2 rounded-xl border p-3 text-right transition-colors hover:border-indigo-400"
                style={{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)' }}
              >
                <span className="min-w-0">
                  <span className="block text-[10px] font-bold uppercase tracking-wide" style={{ color: '#6366f1' }}>Next exercise</span>
                  <span className="block truncate text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{nav.next.title}</span>
                </span>
                <ChevronRight size={18} className="shrink-0" style={{ color: '#6366f1' }} />
              </Link>
            ) : <div className="flex-1" />}
          </div>
        </nav>
      )}

      <style jsx global>{`
        .prose-cl p { margin: 0.5rem 0; }
        .prose-cl ul, .prose-cl ol { margin: 0.5rem 0; padding-left: 1.4rem; }
        .prose-cl ul { list-style: disc; }
        .prose-cl ol { list-style: decimal; }
        .prose-cl code { font-family: var(--font-mono, ui-monospace, monospace); background: var(--bg-surface); padding: 1px 5px; border-radius: 4px; font-size: 0.85em; }
        .prose-cl pre { background: var(--bg-surface); padding: 10px 12px; border-radius: 8px; overflow-x: auto; margin: 0.5rem 0; }
        .prose-cl a { color: #6366f1; text-decoration: underline; }
        .prose-cl strong { font-weight: 700; }
        /* Section headings, figures and spec tables — used by briefs that are
           reproduced from an original lab sheet (LAB211). */
        .prose-cl h3 { font-size: 0.95rem; font-weight: 700; margin: 1.25rem 0 0.4rem; letter-spacing: 0.01em; }
        .prose-cl h3:first-child { margin-top: 0; }
        .prose-cl h4 { font-size: 0.87rem; font-weight: 700; margin: 0.9rem 0 0.3rem; color: var(--text-secondary); }
        .prose-cl pre { white-space: pre; font-family: var(--font-mono, ui-monospace, monospace); font-size: 0.8rem; line-height: 1.5; tab-size: 4; }
        .prose-cl figure { margin: 0.9rem 0; }
        .prose-cl img { max-width: 100%; height: auto; border-radius: 8px; border: 1px solid var(--border-color); display: block; margin: 0 auto; }
        .prose-cl table { width: 100%; border-collapse: collapse; margin: 0.75rem 0; font-size: 0.82rem; display: block; overflow-x: auto; }
        .prose-cl th, .prose-cl td { border: 1px solid var(--border-color); padding: 6px 9px; text-align: left; vertical-align: top; }
        .prose-cl th { background: var(--bg-surface); font-weight: 700; }
      `}</style>
    </div>
  );
}
