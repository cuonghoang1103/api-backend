'use client';

/**
 * Trang soạn một test case: tiêu đề (sửa tại chỗ), Manual/Gherkin, điều kiện
 * trước + bảng bước, hoặc kịch bản Gherkin có tô màu từ khoá. Thân test lưu
 * theo lô (Save/Discard, cảnh báo khi rời trang còn thay đổi chưa lưu).
 * Cột phải: requirement được phủ, plan chứa test, lịch sử chạy.
 */

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, ExternalLink, Link2, Lock, Plus, RotateCcw, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { userName, workApi, workError, workErrorStatus, type ProjectConfig, type TestDetail } from '@/lib/work-api';
import ProjectHeader from '../ProjectHeader';
import { useLookups, wk } from '../hooks';
import { EmptyState, IssueTypeIcon, relativeTime, Spinner, StatusBadge, UserAvatar } from '../ui';
import { KindToggle } from './NewTestDialog';
import StepsTable, { stepsForSave, stepsProblem, toDraft, type DraftStep } from './StepsTable';
import { parseIssueKeys, RunStatusPill } from './testing-ui';

interface Draft { kind: 'MANUAL' | 'GHERKIN'; preconditions: string; gherkin: string; steps: DraftStep[] }

const fromDetail = (t: TestDetail): Draft => ({
  kind: t.kind,
  preconditions: t.preconditions ?? '',
  gherkin: t.gherkin ?? '',
  steps: t.steps.map(toDraft),
});

/** Dạng so sánh: bỏ key nội bộ và khoảng trắng thừa như lúc lưu. */
const signature = (d: Draft) => JSON.stringify({
  kind: d.kind, pre: d.preconditions.trim(), g: d.gherkin.trim(), steps: stepsForSave(d.steps),
});

export default function TestEditor({ config, pid, num, onOpenIssue }: {
  config: ProjectConfig; pid: number; num: number; onOpenIssue: (n: number) => void;
}) {
  const qc = useQueryClient();
  const lk = useLookups(config);
  const key = lk.issueKey(num);
  const base = `/work/${config.workspace.slug}/${config.key}/tests`;
  const canEdit = config.permissions.editIssues;

  const detailKey = useMemo(() => [...wk.tests(pid), 'detail', num], [pid, num]);
  const test = useQuery({
    queryKey: detailKey,
    queryFn: () => workApi.test(pid, num),
    retry: (n, err) => workErrorStatus(err) !== 404 && n < 2,
  });
  const issue = useQuery({ queryKey: wk.issue(pid, num), queryFn: () => workApi.issue(pid, num), enabled: test.isSuccess });

  const [draft, setDraft] = useState<Draft | null>(null);
  const [baseline, setBaseline] = useState<TestDetail | null>(null);
  const [saving, setSaving] = useState(false);
  const [tried, setTried] = useState(false);

  const dirty = !!(draft && baseline && signature(draft) !== signature(fromDetail(baseline)));

  // Dữ liệu server mới: chưa sửa gì thì nhận luôn; đang sửa dở thì giữ bản nháp.
  useEffect(() => {
    if (!test.data) return;
    if (!baseline || !dirty) {
      setBaseline(test.data);
      setDraft(fromDetail(test.data));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [test.data]);

  const staleWhileDirty = dirty && !!test.data && !!baseline && test.data.updatedAt !== baseline.updatedAt;

  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirty]);

  const save = useCallback(async () => {
    if (!draft || !dirty || saving) return;
    setTried(true);
    const problem = stepsProblem(draft.steps);
    if (problem) { toast.error(problem); return; }
    setSaving(true);
    try {
      const res = await workApi.updateTest(pid, num, {
        kind: draft.kind,
        preconditions: draft.preconditions.trim() || null,
        gherkin: draft.gherkin.trim() || null,
        steps: stepsForSave(draft.steps),
      });
      qc.setQueryData(detailKey, res);
      setBaseline(res);
      setDraft(fromDetail(res));
      setTried(false);
      qc.invalidateQueries({ queryKey: [...wk.tests(pid), 'list'] });
      toast.success('Test saved');
    } catch (e) {
      toast.error(workError(e, 'Could not save the test'));
    } finally {
      setSaving(false);
    }
  }, [draft, dirty, saving, pid, num, qc, detailKey]);

  const discard = () => {
    const src = test.data ?? baseline;
    if (!src) return;
    setBaseline(src);
    setDraft(fromDetail(src));
    setTried(false);
  };

  // ⌘/Ctrl+S lưu.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (canEdit) save();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [save, canEdit]);

  if (test.isLoading) {
    return (
      <div className="flex h-full flex-col">
        <ProjectHeader config={config} title={key} />
        <div className="flex flex-1 items-center justify-center"><Spinner size={20} /></div>
      </div>
    );
  }
  if (test.error || !test.data || !draft) {
    const notFound = workErrorStatus(test.error) === 404;
    return (
      <div className="flex h-full flex-col">
        <ProjectHeader config={config} title={key} />
        <EmptyState
          title={notFound ? 'Test not found' : 'Could not load this test'}
          body={notFound ? `${key} does not exist, was deleted, or is not a Test issue.` : workError(test.error)}
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <Link href={base} className="w-btn">Back to tests</Link>
              {notFound ? (
                <Link href={`/work/${config.workspace.slug}/${config.key}/issue/${num}`} className="w-btn">Open {key} as issue</Link>
              ) : (
                <button type="button" className="w-btn" onClick={() => test.refetch()}>Try again</button>
              )}
            </div>
          }
        />
      </div>
    );
  }

  const t = test.data;
  const setD = (patch: Partial<Draft>) => setDraft((d) => (d ? { ...d, ...patch } : d));

  return (
    <div className="flex h-full flex-col">
      <ProjectHeader config={config} title={key}>
        {canEdit && dirty && (
          <>
            <span className="hidden text-[12px] text-[var(--w-orange)] md:inline">Unsaved changes</span>
            <button type="button" className="w-btn w-btn-sm" onClick={discard} disabled={saving}><RotateCcw size={13} /> <span className="max-sm:hidden">Discard</span></button>
            <button type="button" className="w-btn w-btn-primary w-btn-sm" onClick={save} disabled={saving} title="Save (⌘S)">
              {saving ? <Spinner size={11} /> : <Save size={13} />} Save
            </button>
          </>
        )}
        <button type="button" className="w-btn w-btn-sm" onClick={() => onOpenIssue(num)} title="Comments, assignee, labels, status">
          <ExternalLink size={13} /> <span className="max-sm:hidden">Open as issue</span>
        </button>
      </ProjectHeader>

      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        <div className="mx-auto grid w-full max-w-[1280px] gap-6 px-4 py-5 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0">
            <Link href={base} className="mb-2 inline-flex items-center gap-1 text-[12px] text-[var(--w-text-3)] hover:text-[var(--w-text)]">
              <ArrowLeft size={12} /> Test library
            </Link>
            <TitleEditor pid={pid} num={num} title={t.title} canEdit={canEdit} detailKey={detailKey} />

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <KindToggle value={draft.kind} onChange={(k) => setD({ kind: k })} disabled={!canEdit} />
              {issue.data && (
                <span className="flex items-center gap-2 text-[12px] text-[var(--w-text-3)]">
                  <StatusBadge status={lk.statuses.get(issue.data.statusId)} />
                  <UserAvatar user={issue.data.assignee} size={20} />
                  <span className="max-sm:hidden">{issue.data.assignee ? userName(issue.data.assignee) : 'Unassigned'}</span>
                </span>
              )}
              <span className="text-[12px] text-[var(--w-text-3)]">Updated {relativeTime(t.updatedAt)}</span>
            </div>

            {!canEdit && (
              <div className="mt-4 flex items-center gap-2 rounded-[6px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-3 py-2 text-[12.5px] text-[var(--w-text-2)]">
                <Lock size={13} className="shrink-0" /> You have view-only access to this test.
              </div>
            )}
            {staleWhileDirty && (
              <div className="mt-4 rounded-[6px] border border-[color-mix(in_srgb,var(--w-orange)_45%,transparent)] bg-[color-mix(in_srgb,var(--w-orange)_8%,transparent)] px-3 py-2 text-[12.5px]">
                Someone else updated this test while you were editing. Saving will overwrite their changes —{' '}
                <button type="button" className="font-medium text-[var(--w-accent-text)] hover:underline" onClick={discard}>discard yours and load the latest</button>.
              </div>
            )}

            {draft.kind === 'MANUAL' ? (
              <>
                <Section title="Preconditions">
                  {canEdit ? (
                    <textarea
                      className="w-input min-h-[64px]"
                      value={draft.preconditions}
                      onChange={(e) => setD({ preconditions: e.target.value })}
                      placeholder="State the system must be in before the first step (accounts, data, configuration)…"
                    />
                  ) : (
                    <p className="whitespace-pre-wrap text-[13px] text-[var(--w-text-2)]">{draft.preconditions || <span className="text-[var(--w-text-3)]">None</span>}</p>
                  )}
                </Section>
                <Section title={`Steps (${stepsForSave(draft.steps).length})`}>
                  <StepsTable steps={draft.steps} onChange={(steps) => setD({ steps })} readOnly={!canEdit} showErrors={tried} />
                </Section>
              </>
            ) : (
              <Section title="Scenario (Gherkin)">
                <GherkinEditor value={draft.gherkin} onChange={(g) => setD({ gherkin: g })} readOnly={!canEdit} />
                <p className="mt-1.5 text-[12px] text-[var(--w-text-3)]">
                  Keywords: Feature, Background, Scenario, Scenario Outline, Examples, Given, When, Then, And, But. Manual steps are kept if you switch back.
                </p>
              </Section>
            )}
          </div>

          <aside className="min-w-0 space-y-5 lg:border-l lg:border-[var(--w-border)] lg:pl-6">
            <Requirements pid={pid} num={num} config={config} issue={issue.data} loading={issue.isLoading} canEdit={canEdit} onOpenIssue={onOpenIssue} />

            <SideSection title="Test plans">
              {t.plans.length ? (
                <ul className="space-y-1">
                  {t.plans.map((p) => (
                    <li key={p.id}>
                      <Link href={`${base}?tab=plans`} className="block truncate rounded-[5px] px-2 py-1 text-[13px] hover:bg-[var(--w-hover)]">{p.name}</Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[12.5px] text-[var(--w-text-3)]">Not in any plan. Add it from the test library.</p>
              )}
            </SideSection>

            <SideSection title="Run history">
              {t.runs.length ? (
                <ul className="space-y-2">
                  {t.runs.map((r) => (
                    <li key={r.id} className="rounded-[6px] border border-[var(--w-border)] px-2.5 py-2">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`${base}/cycles/${r.cycle.id}`}
                          className="min-w-0 flex-1 truncate text-[13px] font-medium hover:underline"
                          title={r.cycle.environment ? `${r.cycle.name} · ${r.cycle.environment}` : r.cycle.name}
                        >
                          {r.cycle.name}
                        </Link>
                        <RunStatusPill status={r.status} />
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11.5px] text-[var(--w-text-3)]">
                        {r.cycle.environment && <span className="rounded-[3px] bg-[var(--w-sunken)] px-1">{r.cycle.environment}</span>}
                        {r.executedBy ? (
                          <span className="inline-flex items-center gap-1"><UserAvatar user={r.executedBy} size={14} /> {userName(r.executedBy)}</span>
                        ) : null}
                        {r.executedAt ? (
                          <span title={new Date(r.executedAt).toLocaleString('en-US')}>{relativeTime(r.executedAt)}</span>
                        ) : (
                          <span>Not executed</span>
                        )}
                      </div>
                      {r.comment && <p className="mt-1 line-clamp-2 text-[12px] text-[var(--w-text-2)]">{r.comment}</p>}
                      {r.defects.length > 0 && (
                        <div className="mt-1.5 flex flex-wrap items-center gap-1">
                          <span className="text-[11px] text-[var(--w-text-3)]">Defects:</span>
                          {r.defects.map((d) => (
                            <button key={d.number} type="button" title={d.title} onClick={() => onOpenIssue(d.number)} className="rounded-[4px] border border-[color-mix(in_srgb,var(--w-red)_40%,transparent)] px-1 font-mono text-[11px] text-[var(--w-red)] hover:bg-[var(--w-hover)]">
                              {lk.issueKey(d.number)}
                            </button>
                          ))}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[12.5px] text-[var(--w-text-3)]">This test has not been run yet. Add it to a test cycle to execute it.</p>
              )}
            </SideSection>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-[var(--w-text-3)]">{title}</h2>
      {children}
    </section>
  );
}

function SideSection({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section>
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="text-[12px] font-semibold uppercase tracking-wide text-[var(--w-text-3)]">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

// ─── Tiêu đề sửa tại chỗ ─────────────────────────────────────────

function TitleEditor({ pid, num, title, canEdit, detailKey }: { pid: number; num: number; title: string; canEdit: boolean; detailKey: readonly unknown[] }) {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(title);
  const [saving, setSaving] = useState(false);
  useEffect(() => { if (!editing) setValue(title); }, [title, editing]);

  const commit = async () => {
    const v = value.trim();
    if (!v || v === title) { setEditing(false); setValue(title); return; }
    setSaving(true);
    try {
      await workApi.updateTest(pid, num, { title: v });
      // Chỉ vá tiêu đề — thân test có thể đang sửa dở, không được đè bản nháp.
      qc.setQueryData<TestDetail>(detailKey, (old) => (old ? { ...old, title: v } : old));
      qc.invalidateQueries({ queryKey: [...wk.tests(pid), 'list'] });
      qc.invalidateQueries({ queryKey: wk.issue(pid, num) });
      setEditing(false);
    } catch (e) {
      toast.error(workError(e, 'Could not rename the test'));
    } finally {
      setSaving(false);
    }
  };

  if (editing) {
    return (
      <div className="flex items-start gap-2">
        <textarea
          autoFocus
          rows={1}
          value={value}
          maxLength={255}
          disabled={saving}
          onChange={(e) => setValue(e.target.value.replace(/\n/g, ' '))}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.nativeEvent.isComposing) return;
            if (e.key === 'Enter') { e.preventDefault(); commit(); }
            if (e.key === 'Escape') { e.preventDefault(); setValue(title); setEditing(false); }
          }}
          className="w-input min-h-[40px] flex-1 resize-none text-[20px] font-semibold leading-snug"
        />
        {saving && <span className="mt-3"><Spinner size={14} /></span>}
      </div>
    );
  }
  return (
    <h1
      className={cn('break-words rounded-[6px] text-[20px] font-semibold leading-snug', canEdit && '-mx-1.5 cursor-text px-1.5 py-0.5 hover:bg-[var(--w-hover)]')}
      onClick={() => canEdit && setEditing(true)}
      title={canEdit ? 'Click to rename' : undefined}
    >
      {title}
    </h1>
  );
}

// ─── Requirement được phủ (link TESTS chiều đi) ──────────────────

function Requirements({ pid, num, config, issue, loading, canEdit, onOpenIssue }: {
  pid: number; num: number; config: ProjectConfig; issue: Awaited<ReturnType<typeof workApi.issue>> | undefined; loading: boolean;
  canEdit: boolean; onOpenIssue: (n: number) => void;
}) {
  const qc = useQueryClient();
  const lk = useLookups(config);
  const [adding, setAdding] = useState(false);
  const [value, setValue] = useState('');
  const [busy, setBusy] = useState(false);
  const links = (issue?.links ?? []).filter((l) => l.type === 'TESTS' && l.direction === 'outward');

  const refresh = () => {
    qc.invalidateQueries({ queryKey: wk.issue(pid, num) });
    qc.invalidateQueries({ queryKey: wk.tests(pid) });
  };
  const add = async () => {
    const keys = parseIssueKeys(value, config.key);
    if (!keys.length) return;
    setBusy(true);
    const failed: string[] = [];
    for (const k of keys) {
      try { await workApi.addLink(pid, num, { type: 'TESTS', targetKey: k }); } catch (e) { failed.push(`${k} (${workError(e)})`); }
    }
    setBusy(false);
    refresh();
    if (failed.length) toast.error(`Could not link ${failed.join(', ')}`);
    else { setValue(''); setAdding(false); }
  };
  const remove = async (linkId: number) => {
    try { await workApi.removeLink(pid, num, linkId); refresh(); } catch (e) { toast.error(workError(e)); }
  };

  return (
    <SideSection
      title="Requirements covered"
      action={canEdit && !adding ? (
        <button type="button" className="w-btn w-btn-ghost w-btn-sm" onClick={() => setAdding(true)}><Plus size={12} /> Add</button>
      ) : undefined}
    >
      {adding && (
        <form className="mb-2 flex gap-1.5" onSubmit={(e) => { e.preventDefault(); add(); }}>
          <input
            autoFocus
            className="w-input !h-[28px] min-w-0 flex-1 font-mono text-[12px]"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Escape' && (e.preventDefault(), setAdding(false), setValue(''))}
            placeholder={`${config.key}-12, ${config.key}-15`}
            disabled={busy}
          />
          <button type="submit" className="w-btn w-btn-primary w-btn-sm" disabled={busy || !value.trim()}>{busy ? <Spinner size={11} /> : 'Link'}</button>
          <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" onClick={() => { setAdding(false); setValue(''); }} aria-label="Cancel"><X size={13} /></button>
        </form>
      )}
      {loading ? (
        <div className="py-2"><Spinner size={14} /></div>
      ) : links.length ? (
        <ul className="space-y-0.5">
          {links.map((l) => (
            <li key={l.id} className="group flex items-center gap-2 rounded-[5px] px-1.5 py-1 hover:bg-[var(--w-hover)]">
              <IssueTypeIcon type={lk.types.get(l.issue.typeId)} size={13} />
              <button type="button" onClick={() => onOpenIssue(l.issue.number)} className="min-w-0 flex-1 text-left text-[13px]" title={l.issue.title}>
                <span className="mr-1.5 font-mono text-[11.5px] text-[var(--w-text-2)]">{l.issue.key}</span>
                <span className="truncate">{l.issue.title}</span>
              </button>
              {canEdit && (
                <button type="button" onClick={() => remove(l.id)} className="w-btn w-btn-ghost w-btn-icon w-btn-sm opacity-60 group-hover:opacity-100" aria-label={`Unlink ${l.issue.key}`} title="Remove coverage link">
                  <X size={12} />
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="flex items-center gap-1.5 text-[12.5px] text-[var(--w-text-3)]"><Link2 size={12} /> Not linked to any requirement yet.</p>
      )}
    </SideSection>
  );
}

// ─── Gherkin: textarea trong suốt đè lên lớp tô màu ──────────────

const KW = /^(\s*)(Feature:|Background:|Scenario Outline:|Scenario Template:|Scenario:|Example:|Examples:|Rule:|Given|When|Then|And|But|\*)(?=\s|$)/;

function highlightLine(line: string, i: number): ReactNode {
  if (/^\s*#/.test(line)) return <span key={i} className="text-[var(--w-text-3)]">{line}</span>;
  if (/^\s*@/.test(line)) return <span key={i} className="text-[var(--w-orange)]">{line}</span>;
  const m = KW.exec(line);
  const rest = m ? line.slice(m[0].length) : line;
  // Chuỗi "..." và tham số <param> trong phần còn lại.
  const parts: ReactNode[] = [];
  const re = /("[^"]*"|<[^>\s]+>|\|)/g;
  let last = 0;
  let mm: RegExpExecArray | null;
  let k = 0;
  while ((mm = re.exec(rest))) {
    if (mm.index > last) parts.push(rest.slice(last, mm.index));
    const tok = mm[0];
    parts.push(
      <span key={k++} className={tok === '|' ? 'text-[var(--w-text-3)]' : tok.startsWith('"') ? 'text-[var(--w-green)]' : 'text-[var(--w-blue)]'}>{tok}</span>,
    );
    last = mm.index + tok.length;
  }
  if (last < rest.length) parts.push(rest.slice(last));
  return (
    <span key={i}>
      {m && <>{m[1]}<span className={m[2].endsWith(':') ? 'text-[var(--w-accent-text)]' : 'text-[var(--w-orange)]'}>{m[2]}</span></>}
      {parts}
    </span>
  );
}

function GherkinEditor({ value, onChange, readOnly }: { value: string; onChange: (v: string) => void; readOnly?: boolean }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = '0px';
    el.style.height = `${Math.max(el.scrollHeight, 200)}px`;
  }, [value]);
  const lines = value.split('\n');
  const shared = 'm-0 whitespace-pre-wrap break-words px-3 py-2.5 font-mono text-[12.5px] leading-[1.6] [tab-size:2]';
  return (
    <div className="relative overflow-hidden rounded-[8px] border border-[var(--w-border-strong)] bg-[var(--w-panel)] focus-within:border-[var(--w-accent-border)] focus-within:shadow-[0_0_0_3px_var(--w-accent-soft)]">
      <pre aria-hidden className={cn(shared, 'pointer-events-none absolute inset-0 text-[var(--w-text)]')}>
        {lines.map((l, i) => (
          <span key={i}>{highlightLine(l, i)}{'\n'}</span>
        ))}
      </pre>
      <textarea
        ref={ref}
        value={value}
        readOnly={readOnly}
        spellCheck={false}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          // Tab chèn 2 dấu cách (thụt lề bước) thay vì nhảy khỏi ô; Shift+Tab vẫn rời ô.
          if (e.key === 'Tab' && !e.shiftKey && !readOnly) {
            e.preventDefault();
            const el = e.currentTarget;
            const s = el.selectionStart;
            const next = `${value.slice(0, s)}  ${value.slice(el.selectionEnd)}`;
            onChange(next);
            requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = s + 2; });
          }
        }}
        placeholder={readOnly ? '' : 'Feature: Login\n\n  Scenario: Successful login\n    Given a registered user\n    When they sign in with valid credentials\n    Then the dashboard is shown'}
        className={cn(shared, 'relative block w-full resize-none overflow-hidden bg-transparent text-transparent caret-[var(--w-text)] outline-none placeholder:text-[var(--w-text-3)] selection:bg-[var(--w-accent-soft)] selection:text-transparent')}
      />
    </div>
  );
}
