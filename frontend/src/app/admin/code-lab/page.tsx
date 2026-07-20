'use client';

/**
 * Code Lab — ADMIN console.
 * Left: Group ▸ Track ▸ Module tree with inline CRUD.
 * Right: the selected module's exercises + a full exercise editor,
 *        an AI roadmap/exercise generator, and JSON bulk-import.
 * Backend routes are role-guarded (ADMIN/EDITOR); this page assumes access.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import {
  Plus, Trash2, Pencil, ChevronRight, ChevronDown, Loader2, Save, X,
  Sparkles, FolderPlus, FilePlus2, Wand2, Image as ImageIcon, Bot,
} from 'lucide-react';
import { codeLabApi, codeLabAdminApi, DIFFICULTY_META } from '@/lib/code-lab-api';
import { fileApi } from '@/lib/api';
import type {
  CodeGroup, CodeTrack, CodeModule, CodeExercise, CodeExerciseListItem,
  CodeDifficulty, CodeLevel, CodeStatus, ExampleIO, CodeBlock, ExerciseProposal, ImageItem,
} from '@/types/code-lab';
import { CodeEditor } from '@/components/exp-hub/CodeEditor';

const DIFFS: CodeDifficulty[] = ['EASY', 'MEDIUM', 'HARD', 'EXPERT'];
const LEVELS: CodeLevel[] = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];
const inp = 'w-full rounded-lg border px-3 py-2 text-sm bg-[var(--bg-surface)] outline-none';
const inpStyle = { borderColor: 'var(--border-color)', color: 'var(--text-primary)' } as const;
const btn = 'inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium';

function csv(arr?: string[] | null) { return (arr || []).join(', '); }
function fromCsv(s: string) { return s.split(',').map((x) => x.trim()).filter(Boolean); }

// ─── Exercise editor draft ──────────────────────────────────────
interface Draft {
  id?: number;
  moduleId: number;
  title: string;
  language: string;
  difficulty: CodeDifficulty;
  status: CodeStatus;
  points: number;
  estimatedMinutes: number;
  problemHtml: string;
  concepts: string;
  prerequisites: string;
  inputSpec: string;
  outputSpec: string;
  constraints: string;
  examples: ExampleIO[];
  hints: string[];
  starterCode: CodeBlock[];
  solutionCode: CodeBlock[];
  solutionExplanationHtml: string;
  diagramImageUrl: string;
  images: ImageItem[];
  youtubeUrl: string;
  referenceUrl: string;
  tags: string;
}

function emptyDraft(moduleId: number, language: string): Draft {
  return {
    moduleId, title: '', language, difficulty: 'EASY', status: 'PUBLISHED', points: 10, estimatedMinutes: 15,
    problemHtml: '', concepts: '', prerequisites: '', inputSpec: '', outputSpec: '', constraints: '',
    examples: [{ input: '', output: '', explanation: '' }], hints: [], starterCode: [{ name: 'Starter', language, code: '' }],
    solutionCode: [{ name: 'Solution', language, code: '' }], solutionExplanationHtml: '', diagramImageUrl: '',
    images: [], youtubeUrl: '', referenceUrl: '', tags: '',
  };
}

function draftToPayload(d: Draft) {
  return {
    moduleId: d.moduleId, title: d.title, language: d.language, difficulty: d.difficulty, status: d.status,
    points: Number(d.points) || 10, estimatedMinutes: Number(d.estimatedMinutes) || null,
    problemHtml: d.problemHtml, concepts: fromCsv(d.concepts), prerequisites: fromCsv(d.prerequisites),
    inputSpec: d.inputSpec, outputSpec: d.outputSpec, constraints: d.constraints,
    examplesJson: d.examples, hintsJson: d.hints, starterCodeJson: d.starterCode, solutionCodeJson: d.solutionCode,
    solutionExplanationHtml: d.solutionExplanationHtml, diagramImageUrl: d.diagramImageUrl || null,
    imagesJson: d.images.filter((im) => im.url.trim()),
    youtubeUrl: d.youtubeUrl || null, referenceUrl: d.referenceUrl || null, tags: fromCsv(d.tags),
  };
}

function exerciseToDraft(ex: CodeExercise): Draft {
  return {
    id: ex.id, moduleId: ex.moduleId, title: ex.title, language: ex.language, difficulty: ex.difficulty,
    status: ex.status, points: ex.points, estimatedMinutes: ex.estimatedMinutes || 15,
    problemHtml: ex.problemHtml || '', concepts: csv(ex.concepts), prerequisites: csv(ex.prerequisites),
    inputSpec: ex.inputSpec || '', outputSpec: ex.outputSpec || '', constraints: ex.constraints || '',
    examples: ex.examplesJson?.length ? ex.examplesJson : [{ input: '', output: '', explanation: '' }],
    hints: ex.hintsJson || [], starterCode: ex.starterCodeJson?.length ? ex.starterCodeJson : [{ name: 'Starter', language: ex.language, code: '' }],
    solutionCode: ex.solutionCodeJson?.length ? ex.solutionCodeJson : [{ name: 'Solution', language: ex.language, code: '' }],
    solutionExplanationHtml: ex.solutionExplanationHtml || '', diagramImageUrl: ex.diagramImageUrl || '',
    images: ex.imagesJson || [],
    youtubeUrl: ex.youtubeUrl || '', referenceUrl: ex.referenceUrl || '', tags: csv(ex.tags),
  };
}

function proposalToDraft(p: ExerciseProposal, moduleId: number, language: string): Draft {
  return {
    moduleId, title: p.title, language, difficulty: p.difficulty, status: 'PUBLISHED',
    points: p.points, estimatedMinutes: p.estimatedMinutes, problemHtml: p.problemHtml,
    concepts: p.concepts.join(', '), prerequisites: p.prerequisites.join(', '),
    inputSpec: p.inputSpec, outputSpec: p.outputSpec, constraints: p.constraints,
    examples: p.examples.length ? p.examples : [{ input: '', output: '', explanation: '' }], hints: p.hints,
    starterCode: p.starterCode.length ? p.starterCode : [{ name: 'Starter', language, code: '' }],
    solutionCode: p.solutionCode.length ? p.solutionCode : [{ name: 'Solution', language, code: '' }],
    solutionExplanationHtml: p.solutionExplanationHtml, diagramImageUrl: '', images: [],
    youtubeUrl: '', referenceUrl: '', tags: p.tags.join(', '),
  };
}

export default function AdminCodeLabPage() {
  const [groups, setGroups] = useState<CodeGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [selectedTrack, setSelectedTrack] = useState<CodeTrack | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [exercises, setExercises] = useState<CodeExerciseListItem[]>([]);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [savingEx, setSavingEx] = useState(false);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const res = await codeLabApi.getGroups();
      setGroups(res.data.data || []);
    } catch { toast.error('Failed to load'); } finally { setLoading(false); }
  }, []);

  useEffect(() => { reload(); }, [reload]);

  const loadTrack = useCallback(async (slug: string) => {
    try {
      const res = await codeLabApi.getTrack(slug);
      setSelectedTrack(res.data.data);
      const firstMod = res.data.data.modules?.[0]?.id ?? null;
      setSelectedModuleId(firstMod);
    } catch { toast.error('Failed to load track'); }
  }, []);

  // load exercises for the selected module
  useEffect(() => {
    if (!selectedModuleId) { setExercises([]); return; }
    codeLabApi.listExercises({ moduleId: selectedModuleId, limit: 100 })
      .then((r) => setExercises(r.data.data.exercises || []))
      .catch(() => setExercises([]));
  }, [selectedModuleId, selectedTrack]);

  const selectedModule = useMemo(
    () => selectedTrack?.modules?.find((m) => m.id === selectedModuleId) || null,
    [selectedTrack, selectedModuleId],
  );

  // ─── Group / Track / Module CRUD ──────────────────────────────
  const addGroup = async () => {
    const name = prompt('New group name (e.g. Backend, Frontend, Database):');
    if (!name?.trim()) return;
    await codeLabAdminApi.createGroup({ name });
    toast.success('Group added'); reload();
  };
  const addTrack = async (groupId: number) => {
    const name = prompt('New track name (e.g. Java Core, Spring Boot, SQL):');
    if (!name?.trim()) return;
    const language = prompt('Primary language key (e.g. java, python, sql):', 'text') || 'text';
    await codeLabAdminApi.createTrack({ groupId, name, language });
    toast.success('Track added'); reload();
  };
  const addModule = async (trackId: number) => {
    const name = prompt('New module name (e.g. Basics, OOP, Collections):');
    if (!name?.trim()) return;
    await codeLabAdminApi.createModule({ trackId, name });
    toast.success('Module added');
    if (selectedTrack?.id === trackId) loadTrack(selectedTrack.slug);
    reload();
  };
  const renameEntity = async (kind: 'group' | 'track' | 'module', id: number, current: string) => {
    const name = prompt(`Rename ${kind}:`, current);
    if (!name?.trim() || name === current) return;
    if (kind === 'group') await codeLabAdminApi.updateGroup(id, { name });
    if (kind === 'track') await codeLabAdminApi.updateTrack(id, { name });
    if (kind === 'module') await codeLabAdminApi.updateModule(id, { name });
    toast.success('Renamed');
    if (selectedTrack && kind === 'module') loadTrack(selectedTrack.slug);
    reload();
  };
  const delEntity = async (kind: 'group' | 'track' | 'module', id: number) => {
    if (!confirm(`Delete this ${kind}? This also deletes everything inside it.`)) return;
    if (kind === 'group') await codeLabAdminApi.deleteGroup(id);
    if (kind === 'track') await codeLabAdminApi.deleteTrack(id);
    if (kind === 'module') await codeLabAdminApi.deleteModule(id);
    toast.success('Deleted');
    if (kind === 'track' && selectedTrack?.id === id) { setSelectedTrack(null); setSelectedModuleId(null); }
    if (kind === 'module' && selectedTrack) loadTrack(selectedTrack.slug);
    reload();
  };

  // ─── Exercise editor ──────────────────────────────────────────
  const openNew = () => {
    if (!selectedModuleId || !selectedTrack) return;
    setDraft(emptyDraft(selectedModuleId, selectedTrack.language));
  };
  const openEdit = async (id: number) => {
    try {
      const res = await codeLabAdminApi.getExerciseAdmin(id);
      setDraft(exerciseToDraft(res.data.data));
    } catch { toast.error('Failed to load exercise'); }
  };
  const saveDraft = async () => {
    if (!draft) return;
    if (!draft.title.trim()) { toast.error('Title required'); return; }
    setSavingEx(true);
    try {
      const payload = draftToPayload(draft);
      if (draft.id) await codeLabAdminApi.updateExercise(draft.id, payload);
      else await codeLabAdminApi.createExercise(payload);
      toast.success('Saved');
      setDraft(null);
      if (selectedModuleId) {
        const r = await codeLabApi.listExercises({ moduleId: selectedModuleId, limit: 100 });
        setExercises(r.data.data.exercises || []);
      }
    } catch (e: any) { toast.error(e?.response?.data?.message || 'Save failed'); } finally { setSavingEx(false); }
  };
  const delExercise = async (id: number) => {
    if (!confirm('Delete this exercise?')) return;
    await codeLabAdminApi.deleteExercise(id);
    setExercises((prev) => prev.filter((e) => e.id !== id));
    toast.success('Deleted');
  };

  if (loading) return <div className="flex justify-center py-24"><Loader2 className="animate-spin" style={{ color: 'var(--text-muted)' }} /></div>;

  return (
    <div className="mx-auto max-w-7xl px-4 pb-10 pt-20" style={{ color: 'var(--text-primary)' }}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Code Lab — Admin</h1>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Manage tracks, modules and exercises. <Link href="/code-lab" className="underline">View public hub →</Link></p>
        </div>
        <button onClick={addGroup} className={btn} style={{ background: '#6366f1', color: '#fff' }}><FolderPlus size={15} /> Add group</button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_1fr]">
        {/* ── Tree ── */}
        <aside className="rounded-xl border p-2" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', height: 'fit-content' }}>
          {groups.length === 0 && <div className="p-3 text-sm" style={{ color: 'var(--text-muted)' }}>No groups yet.</div>}
          {groups.map((g) => {
            const gk = `g${g.id}`;
            const gOpen = expanded[gk] ?? true;
            return (
              <div key={g.id} className="mb-1">
                <div className="group flex items-center gap-1 rounded px-1 py-1 hover:bg-[var(--bg-surface-hover)]">
                  <button onClick={() => setExpanded((e) => ({ ...e, [gk]: !gOpen }))}>{gOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}</button>
                  <span className="flex-1 truncate text-sm font-semibold">{g.name}</span>
                  <button title="Add track" onClick={() => addTrack(g.id)} className="opacity-0 group-hover:opacity-100"><Plus size={14} /></button>
                  <button title="Rename" onClick={() => renameEntity('group', g.id, g.name)} className="opacity-0 group-hover:opacity-100"><Pencil size={13} /></button>
                  <button title="Delete" onClick={() => delEntity('group', g.id)} className="opacity-0 group-hover:opacity-100"><Trash2 size={13} style={{ color: '#ef4444' }} /></button>
                </div>
                {gOpen && (g.tracks || []).map((t) => {
                  const active = selectedTrack?.id === t.id;
                  return (
                    <div key={t.id} className="ml-4">
                      <div className={`group flex items-center gap-1 rounded px-1 py-1 hover:bg-[var(--bg-surface-hover)] ${active ? 'bg-[var(--bg-surface-active)]' : ''}`}>
                        <button onClick={() => loadTrack(t.slug)} className="flex-1 truncate text-left text-sm" style={{ color: active ? '#6366f1' : 'var(--text-primary)' }}>{t.name}</button>
                        <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{t.exerciseCount ?? 0}</span>
                        <button title="Add module" onClick={() => addModule(t.id)} className="opacity-0 group-hover:opacity-100"><Plus size={13} /></button>
                        <button title="Rename" onClick={() => renameEntity('track', t.id, t.name)} className="opacity-0 group-hover:opacity-100"><Pencil size={12} /></button>
                        <button title="Delete" onClick={() => delEntity('track', t.id)} className="opacity-0 group-hover:opacity-100"><Trash2 size={12} style={{ color: '#ef4444' }} /></button>
                      </div>
                      {active && (selectedTrack?.modules || []).map((m) => (
                        <div key={m.id} className={`group ml-4 flex items-center gap-1 rounded px-1 py-1 hover:bg-[var(--bg-surface-hover)] ${selectedModuleId === m.id ? 'bg-[var(--bg-surface-active)]' : ''}`}>
                          <button onClick={() => setSelectedModuleId(m.id)} className="flex-1 truncate text-left text-xs" style={{ color: selectedModuleId === m.id ? '#6366f1' : 'var(--text-secondary)' }}>{m.name}</button>
                          <button title="Rename" onClick={() => renameEntity('module', m.id, m.name)} className="opacity-0 group-hover:opacity-100"><Pencil size={11} /></button>
                          <button title="Delete" onClick={() => delEntity('module', m.id)} className="opacity-0 group-hover:opacity-100"><Trash2 size={11} style={{ color: '#ef4444' }} /></button>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </aside>

        {/* ── Main ── */}
        <main>
          {!selectedTrack ? (
            <div className="rounded-xl border py-20 text-center text-sm" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
              Select a track on the left, or add a group to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {/* AI generators */}
              <AiPanel track={selectedTrack} selectedModule={selectedModule} onRoadmapDone={() => loadTrack(selectedTrack.slug)} onExercisesReady={(props, moduleId) => {
                // open the first proposal in the editor; commit-all is inside the panel
                if (props[0]) setDraft(proposalToDraft(props[0], moduleId, selectedTrack.language));
              }} onCommitted={() => { if (selectedModuleId) codeLabApi.listExercises({ moduleId: selectedModuleId, limit: 100 }).then((r) => setExercises(r.data.data.exercises || [])); loadTrack(selectedTrack.slug); }} />

              {/* Module exercises */}
              <div className="rounded-xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: 'var(--border-color)' }}>
                  <div className="text-sm font-semibold">{selectedModule ? selectedModule.name : 'Exercises'} <span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>({exercises.length})</span></div>
                  <button onClick={openNew} disabled={!selectedModuleId} className={btn} style={{ background: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}><FilePlus2 size={14} /> New exercise</button>
                </div>
                <ul>
                  {exercises.length === 0 && <li className="px-4 py-6 text-center text-sm" style={{ color: 'var(--text-muted)' }}>No exercises in this module.</li>}
                  {exercises.map((ex) => (
                    <li key={ex.id} className="group flex items-center gap-3 border-t px-4 py-2 first:border-t-0" style={{ borderColor: 'var(--border-color)' }}>
                      <span className="min-w-0 flex-1 truncate text-sm">{ex.title}</span>
                      <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ color: DIFFICULTY_META[ex.difficulty].color, background: DIFFICULTY_META[ex.difficulty].bg }}>{DIFFICULTY_META[ex.difficulty].label}</span>
                      {ex.status !== 'PUBLISHED' && <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{ex.status}</span>}
                      <button onClick={() => openEdit(ex.id)} className="opacity-0 group-hover:opacity-100"><Pencil size={14} /></button>
                      <button onClick={() => delExercise(ex.id)} className="opacity-0 group-hover:opacity-100"><Trash2 size={14} style={{ color: '#ef4444' }} /></button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Exercise editor drawer */}
      {draft && (
        <ExerciseEditor
          draft={draft}
          setDraft={setDraft}
          onClose={() => setDraft(null)}
          onSave={saveDraft}
          saving={savingEx}
        />
      )}
    </div>
  );
}

// ═══════════════════════ AI panel ═══════════════════════════════
function AiPanel({ track, selectedModule, onRoadmapDone, onExercisesReady, onCommitted }: {
  track: CodeTrack;
  selectedModule: CodeModule | null;
  onRoadmapDone: () => void;
  onExercisesReady: (props: ExerciseProposal[], moduleId: number) => void;
  onCommitted: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<'roadmap' | 'exercises' | 'commit' | null>(null);
  const [count, setCount] = useState(5);
  const [difficulty, setDifficulty] = useState<CodeDifficulty | ''>('');
  const [topic, setTopic] = useState('');
  const [proposals, setProposals] = useState<ExerciseProposal[]>([]);

  const genRoadmap = async () => {
    if (!confirm('Generate a full roadmap (modules) for this track with AI? This creates modules but not exercises.')) return;
    setBusy('roadmap');
    try {
      const res = await codeLabAdminApi.aiRoadmap({ trackId: track.id, moduleCount: 8, titlesPerModule: 8 });
      // Persist proposed modules (append to track).
      let order = (track.modules?.length ?? 0);
      for (const m of res.data.data.modules) {
        await codeLabAdminApi.createModule({ trackId: track.id, name: m.name, description: m.description, level: m.level, sortOrder: order++ });
      }
      toast.success(`Added ${res.data.data.modules.length} modules`);
      onRoadmapDone();
    } catch (e: any) { toast.error(e?.response?.data?.message || 'Roadmap failed'); } finally { setBusy(null); }
  };

  const genExercises = async () => {
    if (!selectedModule) { toast.error('Select a module first'); return; }
    setBusy('exercises');
    setProposals([]);
    try {
      const res = await codeLabAdminApi.aiGenerateExercises({ moduleId: selectedModule.id, count, difficulty: difficulty || undefined, topic: topic || undefined });
      setProposals(res.data.data.exercises);
      toast.success(`Generated ${res.data.data.exercises.length} exercise(s) — review below`);
    } catch (e: any) { toast.error(e?.response?.data?.message || 'Generation failed'); } finally { setBusy(null); }
  };

  const commitAll = async () => {
    if (!selectedModule || proposals.length === 0) return;
    setBusy('commit');
    try {
      const res = await codeLabAdminApi.aiCommitExercises({ moduleId: selectedModule.id, exercises: proposals });
      toast.success(`Saved ${res.data.data.created} exercise(s)`);
      setProposals([]);
      onCommitted();
    } catch (e: any) { toast.error(e?.response?.data?.message || 'Save failed'); } finally { setBusy(null); }
  };

  return (
    <div className="rounded-xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center gap-2 px-4 py-3 text-left">
        <Bot size={16} style={{ color: '#8b5cf6' }} />
        <span className="text-sm font-semibold">AI generator</span>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>roadmap + full exercises (English)</span>
        <ChevronDown size={15} className="ml-auto transition-transform" style={{ transform: open ? 'rotate(180deg)' : 'none' }} />
      </button>
      {open && (
        <div className="border-t px-4 py-3" style={{ borderColor: 'var(--border-color)' }}>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <button onClick={genRoadmap} disabled={busy !== null} className={btn} style={{ background: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>
              {busy === 'roadmap' ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />} Generate roadmap (modules)
            </button>
          </div>

          <div className="rounded-lg border p-3" style={{ borderColor: 'var(--border-color)' }}>
            <div className="mb-2 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
              Generate exercises {selectedModule ? <>for module <b>{selectedModule.name}</b></> : <span style={{ color: '#ef4444' }}>(select a module first)</span>}
            </div>
            <div className="flex flex-wrap items-end gap-2">
              <label className="text-xs">Count
                <input type="number" min={1} max={20} value={count} onChange={(e) => setCount(Number(e.target.value))} className={`${inp} mt-0.5 w-20`} style={inpStyle} />
              </label>
              <label className="text-xs">Difficulty
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as any)} className={`${inp} mt-0.5 w-32`} style={inpStyle}>
                  <option value="">Auto (varied)</option>
                  {DIFFS.map((d) => <option key={d} value={d}>{DIFFICULTY_META[d].label}</option>)}
                </select>
              </label>
              <label className="flex-1 text-xs">Topic (optional)
                <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. recursion, arrays…" className={`${inp} mt-0.5`} style={inpStyle} />
              </label>
              <button onClick={genExercises} disabled={busy !== null || !selectedModule} className={btn} style={{ background: '#8b5cf6', color: '#fff' }}>
                {busy === 'exercises' ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />} Generate
              </button>
            </div>

            {proposals.length > 0 && (
              <div className="mt-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>{proposals.length} proposal(s) — review, then save all</span>
                  <div className="flex gap-2">
                    <button onClick={() => onExercisesReady(proposals, selectedModule!.id)} className={btn} style={{ background: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}><Pencil size={13} /> Edit first</button>
                    <button onClick={commitAll} disabled={busy !== null} className={btn} style={{ background: '#22c55e', color: '#fff' }}>
                      {busy === 'commit' ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save all
                    </button>
                  </div>
                </div>
                <ul className="max-h-48 space-y-1 overflow-auto">
                  {proposals.map((p, i) => (
                    <li key={i} className="flex items-center gap-2 rounded border px-2 py-1 text-xs" style={{ borderColor: 'var(--border-color)' }}>
                      <span className="min-w-0 flex-1 truncate">{p.title}</span>
                      <span style={{ color: DIFFICULTY_META[p.difficulty].color }}>{DIFFICULTY_META[p.difficulty].label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════ Exercise editor ════════════════════════
function ExerciseEditor({ draft, setDraft, onClose, onSave, saving }: {
  draft: Draft; setDraft: (d: Draft) => void; onClose: () => void; onSave: () => void; saving: boolean;
}) {
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft({ ...draft, [k]: v });
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const figRef = useRef<HTMLInputElement>(null);
  const [figBusy, setFigBusy] = useState(false);

  const uploadOne = async (f: File) => {
    const res = await fileApi.upload(f, 'image');
    const url = (res.data as any)?.data?.url;
    if (!url) throw new Error('no url');
    return url as string;
  };

  const uploadDiagram = async (f: File | null) => {
    if (!f) return;
    setUploading(true);
    try {
      set('diagramImageUrl', await uploadOne(f));
      toast.success('Image uploaded');
    } catch { toast.error('Upload failed'); } finally { setUploading(false); if (fileRef.current) fileRef.current.value = ''; }
  };

  // Figures — screenshots of the original brief. Accepts a multi-file pick,
  // a drag-and-drop, or a straight paste from the clipboard (⌘V after a
  // screenshot), because that is how these actually get captured.
  const addFigures = async (files: File[]) => {
    const imgs = files.filter((f) => f.type.startsWith('image/'));
    if (!imgs.length) return;
    setFigBusy(true);
    const added: ImageItem[] = [];
    for (const f of imgs) {
      try { added.push({ url: await uploadOne(f), caption: '' }); }
      catch { toast.error(`Upload failed: ${f.name || 'pasted image'}`); }
    }
    if (added.length) {
      setDraft({ ...draft, images: [...draft.images, ...added] });
      toast.success(`${added.length} figure${added.length > 1 ? 's' : ''} added`);
    }
    setFigBusy(false);
    if (figRef.current) figRef.current.value = '';
  };

  const setFigure = (i: number, patch: Partial<ImageItem>) =>
    set('images', draft.images.map((im, idx) => (idx === i ? { ...im, ...patch } : im)));
  const delFigure = (i: number) => set('images', draft.images.filter((_, idx) => idx !== i));
  const moveFigure = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= draft.images.length) return;
    const arr = [...draft.images];
    [arr[i], arr[j]] = [arr[j], arr[i]];
    set('images', arr);
  };

  const setBlock = (field: 'starterCode' | 'solutionCode', i: number, patch: Partial<CodeBlock>) => {
    const arr = draft[field].map((b, idx) => (idx === i ? { ...b, ...patch } : b));
    set(field, arr);
  };
  const addBlock = (field: 'starterCode' | 'solutionCode') => set(field, [...draft[field], { name: `Code ${draft[field].length + 1}`, language: draft.language, code: '' }]);
  const delBlock = (field: 'starterCode' | 'solutionCode', i: number) => set(field, draft[field].filter((_, idx) => idx !== i));

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={onClose}>
      <div className="h-full w-full max-w-2xl overflow-y-auto p-5 shadow-2xl" style={{ background: 'var(--bg-primary)' }} onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">{draft.id ? 'Edit exercise' : 'New exercise'}</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Title *</label>
            <input value={draft.title} onChange={(e) => set('title', e.target.value)} className={inp} style={inpStyle} />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div><label className="text-xs">Language</label><input value={draft.language} onChange={(e) => set('language', e.target.value)} className={inp} style={inpStyle} /></div>
            <div><label className="text-xs">Difficulty</label>
              <select value={draft.difficulty} onChange={(e) => set('difficulty', e.target.value as CodeDifficulty)} className={inp} style={inpStyle}>{DIFFS.map((d) => <option key={d} value={d}>{d}</option>)}</select></div>
            <div><label className="text-xs">Points</label><input type="number" value={draft.points} onChange={(e) => set('points', Number(e.target.value))} className={inp} style={inpStyle} /></div>
            <div><label className="text-xs">Est. min</label><input type="number" value={draft.estimatedMinutes} onChange={(e) => set('estimatedMinutes', Number(e.target.value))} className={inp} style={inpStyle} /></div>
          </div>

          <div><label className="text-xs">Status</label>
            <select value={draft.status} onChange={(e) => set('status', e.target.value as CodeStatus)} className={inp} style={inpStyle}>
              <option value="PUBLISHED">Published</option><option value="DRAFT">Draft</option><option value="ARCHIVED">Archived</option>
            </select></div>

          <div><label className="text-xs">Problem (HTML)</label>
            <textarea value={draft.problemHtml} onChange={(e) => set('problemHtml', e.target.value)} rows={6} className={inp} style={inpStyle} placeholder="<p>Describe the problem…</p>" /></div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div><label className="text-xs">Concepts (comma-separated)</label><input value={draft.concepts} onChange={(e) => set('concepts', e.target.value)} className={inp} style={inpStyle} placeholder="loops, arrays, recursion" /></div>
            <div><label className="text-xs">Prerequisites (comma-separated)</label><input value={draft.prerequisites} onChange={(e) => set('prerequisites', e.target.value)} className={inp} style={inpStyle} /></div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div><label className="text-xs">Input spec</label><textarea value={draft.inputSpec} onChange={(e) => set('inputSpec', e.target.value)} rows={2} className={inp} style={inpStyle} /></div>
            <div><label className="text-xs">Output spec</label><textarea value={draft.outputSpec} onChange={(e) => set('outputSpec', e.target.value)} rows={2} className={inp} style={inpStyle} /></div>
          </div>
          <div><label className="text-xs">Constraints</label><textarea value={draft.constraints} onChange={(e) => set('constraints', e.target.value)} rows={2} className={inp} style={inpStyle} /></div>

          {/* Examples */}
          <div>
            <div className="mb-1 flex items-center justify-between"><label className="text-xs font-medium">Examples (I/O)</label>
              <button onClick={() => set('examples', [...draft.examples, { input: '', output: '', explanation: '' }])} className="text-xs" style={{ color: '#6366f1' }}><Plus size={12} className="inline" /> add</button></div>
            {draft.examples.map((ex, i) => (
              <div key={i} className="mb-2 rounded-lg border p-2" style={{ borderColor: 'var(--border-color)' }}>
                <div className="grid grid-cols-2 gap-2">
                  <textarea value={ex.input} onChange={(e) => set('examples', draft.examples.map((x, idx) => idx === i ? { ...x, input: e.target.value } : x))} rows={2} placeholder="input" className={inp} style={inpStyle} />
                  <textarea value={ex.output} onChange={(e) => set('examples', draft.examples.map((x, idx) => idx === i ? { ...x, output: e.target.value } : x))} rows={2} placeholder="output" className={inp} style={inpStyle} />
                </div>
                <input value={ex.explanation} onChange={(e) => set('examples', draft.examples.map((x, idx) => idx === i ? { ...x, explanation: e.target.value } : x))} placeholder="explanation (optional)" className={`${inp} mt-2`} style={inpStyle} />
                <button onClick={() => set('examples', draft.examples.filter((_, idx) => idx !== i))} className="mt-1 text-xs" style={{ color: '#ef4444' }}>remove</button>
              </div>
            ))}
          </div>

          {/* Hints */}
          <div>
            <div className="mb-1 flex items-center justify-between"><label className="text-xs font-medium">Hints</label>
              <button onClick={() => set('hints', [...draft.hints, ''])} className="text-xs" style={{ color: '#6366f1' }}><Plus size={12} className="inline" /> add</button></div>
            {draft.hints.map((h, i) => (
              <div key={i} className="mb-1 flex gap-2">
                <input value={h} onChange={(e) => set('hints', draft.hints.map((x, idx) => idx === i ? e.target.value : x))} className={inp} style={inpStyle} placeholder={`Hint ${i + 1}`} />
                <button onClick={() => set('hints', draft.hints.filter((_, idx) => idx !== i))}><Trash2 size={14} style={{ color: '#ef4444' }} /></button>
              </div>
            ))}
          </div>

          {/* Code blocks */}
          {(['starterCode', 'solutionCode'] as const).map((field) => (
            <div key={field}>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-xs font-medium">{field === 'starterCode' ? 'Starter code' : 'Official solution code'}</label>
                <button onClick={() => addBlock(field)} className="text-xs" style={{ color: '#6366f1' }}><Plus size={12} className="inline" /> add block</button>
              </div>
              {draft[field].map((b, i) => (
                <div key={i} className="mb-2 rounded-lg border p-2" style={{ borderColor: 'var(--border-color)' }}>
                  <div className="mb-1 flex gap-2">
                    <input value={b.name} onChange={(e) => setBlock(field, i, { name: e.target.value })} placeholder="Block name" className={`${inp} flex-1`} style={inpStyle} />
                    <input value={b.language} onChange={(e) => setBlock(field, i, { language: e.target.value })} placeholder="lang" className={`${inp} w-28`} style={inpStyle} />
                    {draft[field].length > 1 && <button onClick={() => delBlock(field, i)}><Trash2 size={14} style={{ color: '#ef4444' }} /></button>}
                  </div>
                  <CodeEditor value={b.code} language={b.language} onChange={(code) => setBlock(field, i, { code })} height={160} />
                </div>
              ))}
            </div>
          ))}

          <div><label className="text-xs">Solution explanation (HTML)</label>
            <textarea value={draft.solutionExplanationHtml} onChange={(e) => set('solutionExplanationHtml', e.target.value)} rows={4} className={inp} style={inpStyle} /></div>

          {/* Diagram upload */}
          <div>
            <label className="text-xs font-medium">Diagram image</label>
            <div className="flex items-center gap-2">
              <input value={draft.diagramImageUrl} onChange={(e) => set('diagramImageUrl', e.target.value)} placeholder="https://… (R2) or upload" className={`${inp} flex-1`} style={inpStyle} />
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => uploadDiagram(e.target.files?.[0] || null)} />
              <button onClick={() => fileRef.current?.click()} className={btn} style={{ background: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>
                {uploading ? <Loader2 size={14} className="animate-spin" /> : <ImageIcon size={14} />} Upload
              </button>
            </div>
            {draft.diagramImageUrl && <img src={draft.diagramImageUrl} alt="" className="mt-2 max-h-40 rounded border" style={{ borderColor: 'var(--border-color)' }} />}
          </div>

          {/* Figures — screenshots of the original brief (Word/PDF). */}
          <div
            onPaste={(e) => {
              const files = Array.from(e.clipboardData.files);
              if (files.length) { e.preventDefault(); void addFigures(files); }
            }}
            onDrop={(e) => { e.preventDefault(); void addFigures(Array.from(e.dataTransfer.files)); }}
            onDragOver={(e) => e.preventDefault()}
          >
            <label className="text-xs font-medium">Figures — screenshots of the brief ({draft.images.length})</label>
            <div
              className="mt-1 rounded-lg border border-dashed p-3 text-center"
              style={{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)' }}
            >
              <input ref={figRef} type="file" accept="image/*" multiple className="hidden"
                onChange={(e) => void addFigures(Array.from(e.target.files || []))} />
              <button onClick={() => figRef.current?.click()} disabled={figBusy} className={btn}
                style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>
                {figBusy ? <Loader2 size={14} className="animate-spin" /> : <ImageIcon size={14} />} Choose images
              </button>
              <div className="mt-1.5 text-[11px]" style={{ color: 'var(--text-muted)' }}>
                …or drop files here, or take a screenshot and press ⌘V / Ctrl+V inside this box.
              </div>
            </div>

            {draft.images.length > 0 && (
              <div className="mt-2 space-y-2">
                {draft.images.map((im, i) => (
                  <div key={i} className="flex items-start gap-2 rounded-lg border p-2" style={{ borderColor: 'var(--border-color)' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={im.url} alt="" className="h-16 w-24 shrink-0 rounded object-cover" style={{ border: '1px solid var(--border-color)' }} />
                    <div className="min-w-0 flex-1">
                      <input value={im.caption || ''} onChange={(e) => setFigure(i, { caption: e.target.value })}
                        placeholder={`Caption for figure ${i + 1} (optional)`} className={inp} style={inpStyle} />
                      <div className="mt-1 truncate text-[10px]" style={{ color: 'var(--text-muted)' }}>{im.url}</div>
                    </div>
                    <div className="flex shrink-0 flex-col gap-1">
                      <button onClick={() => moveFigure(i, -1)} disabled={i === 0} title="Move up"
                        className="rounded px-1.5 text-xs disabled:opacity-30" style={{ border: '1px solid var(--border-color)' }}>↑</button>
                      <button onClick={() => moveFigure(i, 1)} disabled={i === draft.images.length - 1} title="Move down"
                        className="rounded px-1.5 text-xs disabled:opacity-30" style={{ border: '1px solid var(--border-color)' }}>↓</button>
                      <button onClick={() => delFigure(i)} title="Remove"
                        className="rounded px-1.5 text-xs" style={{ border: '1px solid var(--border-color)', color: '#ef4444' }}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div><label className="text-xs">YouTube URL</label><input value={draft.youtubeUrl} onChange={(e) => set('youtubeUrl', e.target.value)} className={inp} style={inpStyle} /></div>
            <div><label className="text-xs">Reference URL</label><input value={draft.referenceUrl} onChange={(e) => set('referenceUrl', e.target.value)} className={inp} style={inpStyle} /></div>
          </div>
          <div><label className="text-xs">Tags (comma-separated)</label><input value={draft.tags} onChange={(e) => set('tags', e.target.value)} className={inp} style={inpStyle} /></div>
        </div>

        <div className="sticky bottom-0 mt-4 flex justify-end gap-2 border-t py-3" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-primary)' }}>
          <button onClick={onClose} className={btn} style={{ background: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>Cancel</button>
          <button onClick={onSave} disabled={saving} className={btn} style={{ background: '#22c55e', color: '#fff' }}>{saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save exercise</button>
        </div>
      </div>
    </div>
  );
}
