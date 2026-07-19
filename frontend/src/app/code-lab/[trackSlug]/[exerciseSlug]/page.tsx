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
  BookOpen, Youtube, ExternalLink, ListChecks, Layers,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { codeLabApi, DIFFICULTY_META } from '@/lib/code-lab-api';
import type { CodeExercise, CodeBlock } from '@/types/code-lab';
import { useAuthStore } from '@/store/authStore';
import { sanitizeHtml } from '@/lib/sanitizeHtml';
import { CodeViewer } from '@/components/exp-hub/CodeViewer';
import { MiniCode } from '@/components/code-lab/MiniCode';
import { CodeEditor } from '@/components/exp-hub/CodeEditor';
import { DifficultyBadge } from '@/components/code-lab/shared';

function Section({ icon, title, children }: { icon?: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section className="mb-5">
      <h2 className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
        {icon}{title}
      </h2>
      {children}
    </section>
  );
}

export default function ExerciseDetailPage() {
  const params = useParams<{ trackSlug: string; exerciseSlug: string }>();
  const isAuthed = useAuthStore((s) => s.isAuthenticated);

  const [ex, setEx] = useState<CodeExercise | null>(null);
  const [loading, setLoading] = useState(true);

  const [revealHints, setRevealHints] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [activeStarter, setActiveStarter] = useState(0);
  const [activeSolution, setActiveSolution] = useState(0);

  // Editor state (per-exercise; seeded from starter code or saved attempt).
  const [myCode, setMyCode] = useState('');
  const [status, setStatus] = useState<'IN_PROGRESS' | 'SOLVED' | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await codeLabApi.getExercise(params.exerciseSlug);
        const data = res.data.data;
        setEx(data);
        // seed editor
        let seed = data.starterCodeJson?.[0]?.code || '';
        if (isAuthed) {
          try {
            const p = await codeLabApi.myProgress(data.trackId);
            const mine = (p.data.data || []).find((it) => it.exerciseId === data.id);
            if (mine) {
              setStatus(mine.status);
              if (mine.savedCode?.[0]?.code) seed = mine.savedCode[0].code;
            }
          } catch { /* ignore */ }
        }
        setMyCode(seed);
      } catch { setEx(null); } finally { setLoading(false); }
    })();
    // reset transient UI when the slug changes
    setRevealHints(0); setShowSolution(false); setActiveStarter(0); setActiveSolution(0);
  }, [params.exerciseSlug, isAuthed]);

  const editorLang = useMemo(() => ex?.starterCodeJson?.[activeStarter]?.language || ex?.language || 'text', [ex, activeStarter]);

  const save = async (markSolved = false) => {
    if (!ex) return;
    if (!isAuthed) { toast.error('Please sign in to save your work.'); return; }
    setSaving(true);
    try {
      const savedCode: CodeBlock[] = [{ name: 'Solution', language: editorLang, code: myCode }];
      const res = await codeLabApi.saveProgress(ex.id, { status: markSolved ? 'SOLVED' : 'IN_PROGRESS', savedCode });
      setStatus(res.data.data.status);
      toast.success(markSolved ? 'Marked as solved 🎉' : 'Saved');
    } catch { toast.error('Could not save.'); } finally { setSaving(false); }
  };

  // Run in-browser (JS/TS only) — a convenience console for JavaScript exercises.
  const [runOut, setRunOut] = useState<string | null>(null);
  const canRun = ['javascript', 'js', 'typescript', 'ts'].includes(editorLang.toLowerCase());
  const runJs = () => {
    const logs: string[] = [];
    const orig = console.log;
    try {
      (console as any).log = (...a: unknown[]) => logs.push(a.map((x) => typeof x === 'object' ? JSON.stringify(x) : String(x)).join(' '));
      // eslint-disable-next-line no-new-func
      const fn = new Function(myCode.replace(/\bexport\b/g, ''));
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
  const starter = ex.starterCodeJson || [];
  const solution = ex.solutionCodeJson || [];

  return (
    <div className="mx-auto max-w-3xl px-4 pb-10 pt-20" style={{ color: 'var(--text-primary)' }}>
      <Link href={`/code-lab/${params.trackSlug}`} className="mb-4 inline-flex items-center gap-1 text-sm" style={{ color: 'var(--text-muted)' }}>
        <ArrowLeft size={15} /> {ex.track?.name || 'Roadmap'}
      </Link>

      {/* Title bar */}
      <div className="mb-5">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold">{ex.title}</h1>
          <DifficultyBadge difficulty={ex.difficulty} />
          {status === 'SOLVED' && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: '#22c55e' }}>
              <CheckCircle2 size={14} /> Solved
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
          {ex.module?.name && <span className="inline-flex items-center gap-1"><Layers size={12} />{ex.module.name}</span>}
          <span>{ex.language}</span>
          {ex.estimatedMinutes ? <span>≈ {ex.estimatedMinutes} min</span> : null}
          <span>{ex.points} pts</span>
        </div>
      </div>

      {/* Problem statement */}
      {ex.problemHtml && (
        <Section icon={<BookOpen size={14} />} title="Problem">
          <div className="prose-cl text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(ex.problemHtml) }} />
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
      {(ex.imagesJson || []).map((im, i) => (
        <figure key={i} className="mb-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={im.url} alt={im.caption || `Figure ${i + 1}`} className="mx-auto max-h-[420px] rounded-lg border" style={{ borderColor: 'var(--border-color)' }} />
          {im.caption && <figcaption className="mt-1 text-center text-xs" style={{ color: 'var(--text-muted)' }}>{im.caption}</figcaption>}
        </figure>
      ))}

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
        {starter.length > 1 && (
          <div className="mb-2 flex flex-wrap gap-1">
            {starter.map((b, i) => (
              <button key={i} onClick={() => { setActiveStarter(i); setMyCode(b.code); }} className="rounded-md px-2 py-1 text-xs font-medium" style={i === activeStarter ? { background: '#6366f1', color: '#fff' } : { background: 'var(--bg-surface)', color: 'var(--text-secondary)' }}>{b.name}</button>
            ))}
          </div>
        )}
        <CodeEditor value={myCode} language={editorLang} onChange={setMyCode} height={280} placeholder="Write your solution here…" />
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button onClick={() => save(false)} disabled={saving} className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium" style={{ background: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save
          </button>
          <button onClick={() => save(true)} disabled={saving} className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-semibold text-white" style={{ background: '#22c55e' }}>
            <CheckCircle2 size={14} /> Mark solved
          </button>
          {canRun && (
            <button onClick={runJs} className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium" style={{ background: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>
              <Play size={14} /> Run (JS)
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
                <div className="prose-cl mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(ex.solutionExplanationHtml) }} />
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

      <style jsx global>{`
        .prose-cl p { margin: 0.5rem 0; }
        .prose-cl ul, .prose-cl ol { margin: 0.5rem 0; padding-left: 1.4rem; }
        .prose-cl ul { list-style: disc; }
        .prose-cl ol { list-style: decimal; }
        .prose-cl code { font-family: var(--font-mono, ui-monospace, monospace); background: var(--bg-surface); padding: 1px 5px; border-radius: 4px; font-size: 0.85em; }
        .prose-cl pre { background: var(--bg-surface); padding: 10px 12px; border-radius: 8px; overflow-x: auto; margin: 0.5rem 0; }
        .prose-cl a { color: #6366f1; text-decoration: underline; }
        .prose-cl strong { font-weight: 700; }
      `}</style>
    </div>
  );
}
