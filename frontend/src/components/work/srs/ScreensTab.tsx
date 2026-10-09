'use client';

/**
 * CTW đợt 4 (A6) — Màn hình: danh sách màn + Screens Flow (màn này dẫn tới màn nào, vẽ bằng Mermaid như trong Report 3 mục
 * 1.4.1) và ma trận Screen Authorization (1.4.2): hàng = màn, cột = actor, bấm ô để bật/tắt "X".
 */

import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { workError } from '@/lib/work-api';
import { renderMermaidSvg } from '@/lib/work-docs3a-api';
import { workCtw4Api, workCtw4Keys, type SrsData, type SrsScreen } from '@/lib/work-ctw4-api';
import { Dialog, EmptyState, Field, Spinner } from '../ui';
import { Clip, TableFrame, TD, TextArea, TH } from './shared';

const mm = (s: string) => s.replace(/["\n\r[\]{}|<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 60) || '…';
/** Cùng cú pháp với srs.ts (máy chủ) — sơ đồ trên trang giống sơ đồ trong Report 3. */
export function flowSource(data: Pick<SrsData, 'screens' | 'links'>) {
  const id = new Map(data.screens.map((s, i) => [s.id, `S${i + 1}`]));
  return ['flowchart LR', ...data.screens.map((s) => `  ${id.get(s.id)}["${mm(s.name)}"]`),
    ...data.links.filter((l) => id.has(l.fromId) && id.has(l.toId)).map((l) => (l.label ? `  ${id.get(l.fromId)} -->|"${mm(l.label)}"| ${id.get(l.toId)}` : `  ${id.get(l.fromId)} --> ${id.get(l.toId)}`))].join('\n');
}

function FlowDiagram({ data }: { data: SrsData }) {
  const [svg, setSvg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const src = useMemo(() => flowSource(data), [data]);
  // Đổi theme sáng/tối khi đang mở trang ⇒ vẽ lại sơ đồ đúng bảng màu (mermaid tô màu lúc vẽ, không theo CSS).
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const el = document.documentElement;
    const read = () => setDark(el.classList.contains('theme-dark'));
    read();
    const mo = new MutationObserver(read);
    mo.observe(el, { attributes: true, attributeFilter: ['class'] });
    return () => mo.disconnect();
  }, []);
  useEffect(() => {
    let live = true;
    renderMermaidSvg(src, dark).then((s) => { if (live) { setSvg(s); setErr(null); } }).catch((e: Error) => live && setErr(e.message));
    return () => { live = false; };
  }, [src, dark]);
  if (err) return <pre className="overflow-auto rounded-[6px] bg-[var(--w-sunken)] p-3 text-[12px]">{src}</pre>;
  if (!svg) return <div className="flex h-24 items-center justify-center"><Spinner /></div>;
  // SVG do mermaid tự vẽ với securityLevel 'strict' (không script, không HTML label).
  return <div className="overflow-auto [&_svg]:mx-auto [&_svg]:max-h-[360px]" role="img" aria-label={`Screens flow: ${data.screens.length} screens, ${data.links.length} links`} dangerouslySetInnerHTML={{ __html: svg }} />;
}

export function ScreensTab({ pid, data }: { pid: number; data: SrsData }) {
  const qc = useQueryClient();
  const refresh = () => { qc.invalidateQueries({ queryKey: workCtw4Keys.srs(pid) }); qc.invalidateQueries({ queryKey: workCtw4Keys.rtm(pid) }); };
  const [edit, setEdit] = useState<SrsScreen | 'new' | null>(null);
  const [f, setF] = useState({ name: '', feature: '', description: '', issue: '', linksTo: [] as Array<{ screenId: number; label: string }>, actorIds: [] as number[] });
  useEffect(() => {
    if (!edit) return;
    if (edit === 'new') { setF({ name: '', feature: '', description: '', issue: '', linksTo: [], actorIds: [] }); return; }
    setF({
      name: edit.name, feature: edit.feature ?? '', description: edit.description ?? '', issue: '',
      linksTo: data.links.filter((l) => l.fromId === edit.id).map((l) => ({ screenId: l.toId, label: l.label ?? '' })),
      actorIds: data.auth.filter(([s]) => s === edit.id).map(([, a]) => a),
    });
  }, [edit, data.links, data.auth]);
  const name = useMemo(() => new Map(data.screens.map((s) => [s.id, s.name])), [data.screens]);
  const actor = useMemo(() => new Map(data.actors.map((a) => [a.id, a.name])), [data.actors]);
  const save = useMutation({
    mutationFn: () => {
      const issueNumber = Number(/(\d+)\s*$/.exec(f.issue)?.[1]) || undefined;
      const body = { name: f.name.trim(), feature: f.feature.trim() || null, description: f.description || null, linksTo: f.linksTo.map((l) => ({ screenId: l.screenId, label: l.label.trim() || null })), actorIds: f.actorIds, ...(issueNumber ? { issueNumber } : {}) };
      return edit === 'new' ? workCtw4Api.createScreen(pid, body) : workCtw4Api.updateScreen(pid, (edit as SrsScreen).id, body);
    },
    onSuccess: () => { refresh(); setEdit(null); toast.success('Saved'); },
    onError: (e) => toast.error(workError(e, 'Could not save the screen')),
  });
  const del = useMutation({ mutationFn: (id: number) => workCtw4Api.deleteScreen(pid, id), onSuccess: () => { refresh(); toast.success('Screen deleted'); }, onError: (e) => toast.error(workError(e, 'Could not delete')) });
  const self = edit && edit !== 'new' ? edit.id : -1;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <p className="flex-1 text-[13px] text-[var(--w-text-2)]">Each screen, where it leads, and which actors may open it. Builds Screens Flow (1.4.1) and Screen Authorization (1.4.2) of Report 3.</p>
        {data.canEdit && <button type="button" className="w-btn w-btn-sm w-btn-primary" onClick={() => setEdit('new')}><Plus size={14} /> Add screen</button>}
      </div>
      {!data.screens.length ? <EmptyState title="No screens yet" body="Add screens such as Login, Home, Book Device — then link them to draw the flow." /> : (
        <>
          <section aria-labelledby="flow-h" className="rounded-[8px] border border-[var(--w-border)] bg-[var(--w-panel)] p-3">
            <h2 id="flow-h" className="mb-2 text-[13px] font-semibold">Screens flow</h2>
            <FlowDiagram data={data} />
          </section>
          <TableFrame label="Screens" maxH="420px">
            <table className="w-full min-w-[760px] border-separate border-spacing-0">
              <thead><tr>{['Screen', 'Feature', 'Navigates to', 'Actors', 'Description', ''].map((h, i) => <th key={i} scope="col" className={TH}>{h}</th>)}</tr></thead>
              <tbody>
                {data.screens.map((s) => (
                  <tr key={s.id} className="hover:bg-[var(--w-hover)]">
                    <td className={`${TD} font-medium`}>{s.name}</td>
                    <td className={TD}>{s.feature ?? '—'}</td>
                    <td className={TD}><Clip text={data.links.filter((l) => l.fromId === s.id).map((l) => `${name.get(l.toId)}${l.label ? ` (${l.label})` : ''}`).join(', ') || null} /></td>
                    <td className={TD}><Clip text={data.auth.filter(([x]) => x === s.id).map(([, a]) => actor.get(a)).join(', ') || null} /></td>
                    <td className={`${TD} max-w-[300px]`}><Clip text={s.description} /></td>
                    <td className={`${TD} w-20`}>
                      {data.canEdit && (
                        <span className="flex justify-end gap-1">
                          <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={`Edit ${s.name}`} onClick={() => setEdit(s)}><Pencil size={13} /></button>
                          <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={`Delete ${s.name}`} onClick={() => window.confirm(`Delete screen ${s.name}?`) && del.mutate(s.id)}><Trash2 size={13} /></button>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableFrame>
        </>
      )}
      <Dialog open={!!edit} onClose={() => setEdit(null)} title={edit === 'new' ? 'Add screen' : 'Edit screen'} width={640}
        footer={<><button type="button" className="w-btn" onClick={() => setEdit(null)}>Cancel</button><button type="button" className="w-btn w-btn-primary" disabled={!f.name.trim() || save.isPending} onClick={() => save.mutate()}>{save.isPending && <Spinner size={12} />} Save</button></>}>
        <div className="grid gap-x-4 sm:grid-cols-2">
          <Field label="Screen name"><input className="w-input" autoFocus value={f.name} maxLength={160} placeholder="Book Device" onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
          <Field label="Feature"><input className="w-input" value={f.feature} maxLength={120} placeholder="Booking" onChange={(e) => setF({ ...f, feature: e.target.value })} /></Field>
        </div>
        <TextArea id="screen-desc" label="Description" value={f.description} rows={2} onChange={(v) => setF({ ...f, description: v })} />
        <Field label="Requirement issue (optional)"><input className="w-input" value={f.issue} placeholder={`${data.key}-12`} onChange={(e) => setF({ ...f, issue: e.target.value })} /></Field>
        <fieldset className="mb-3">
          <legend className="w-label">Actors allowed (Screen Authorization)</legend>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {data.actors.map((a) => (
              <label key={a.id} className="flex items-center gap-1.5 text-[13px]"><input type="checkbox" checked={f.actorIds.includes(a.id)} onChange={() => setF({ ...f, actorIds: f.actorIds.includes(a.id) ? f.actorIds.filter((x) => x !== a.id) : [...f.actorIds, a.id] })} />{a.name}</label>
            ))}
            {!data.actors.length && <span className="text-[12.5px] text-[var(--w-text-3)]">Add actors first.</span>}
          </div>
        </fieldset>
        <fieldset>
          <legend className="w-label">Navigates to (Screens Flow)</legend>
          <div className="flex flex-col gap-1.5">
            {data.screens.filter((s) => s.id !== self).map((s) => {
              const on = f.linksTo.find((l) => l.screenId === s.id);
              return (
                <div key={s.id} className="flex flex-wrap items-center gap-2">
                  <label className="flex min-w-[180px] items-center gap-1.5 text-[13px]">
                    <input type="checkbox" checked={!!on} onChange={() => setF({ ...f, linksTo: on ? f.linksTo.filter((l) => l.screenId !== s.id) : [...f.linksTo, { screenId: s.id, label: '' }] })} />{s.name}
                  </label>
                  {on && <input className="w-input h-7 max-w-[240px] text-[12.5px]" aria-label={`Action that leads to ${s.name}`} placeholder="Action (optional), e.g. Sign in" value={on.label} onChange={(e) => setF({ ...f, linksTo: f.linksTo.map((l) => (l.screenId === s.id ? { ...l, label: e.target.value } : l)) })} />}
                </div>
              );
            })}
            {data.screens.length < 2 && <span className="text-[12.5px] text-[var(--w-text-3)]">Add another screen to link them.</span>}
          </div>
        </fieldset>
      </Dialog>
    </div>
  );
}

export function AuthMatrixTab({ pid, data }: { pid: number; data: SrsData }) {
  const qc = useQueryClient();
  const set = useMemo(() => new Set(data.auth.map(([s, a]) => `${s}:${a}`)), [data.auth]);
  const toggle = useMutation({
    mutationFn: (v: { screenId: number; actorId: number; allowed: boolean }) => workCtw4Api.setScreenAuth(pid, v),
    onMutate: async (v) => {
      const key = workCtw4Keys.srs(pid);
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<SrsData>(key);
      if (prev) qc.setQueryData<SrsData>(key, { ...prev, auth: v.allowed ? [...prev.auth, [v.screenId, v.actorId]] : prev.auth.filter(([s, a]) => !(s === v.screenId && a === v.actorId)) });
      return { prev };
    },
    onError: (e, _v, ctx) => { if (ctx?.prev) qc.setQueryData(workCtw4Keys.srs(pid), ctx.prev); toast.error(workError(e, 'Could not change access')); },
    onSettled: () => qc.invalidateQueries({ queryKey: workCtw4Keys.srs(pid) }),
  });
  if (!data.screens.length || !data.actors.length) return <EmptyState title="Nothing to authorize yet" body="Add actors and screens first — then click a cell to allow an actor on a screen." />;
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[13px] text-[var(--w-text-2)]">Click a cell to allow or deny. Exported as table 1.4.2 Screen Authorization of Report 3 (X = allowed).</p>
      <TableFrame label="Screen authorization matrix">
        <table className="border-separate border-spacing-0">
          <thead>
            <tr>
              <th scope="col" className={`${TH} sticky left-0 z-[2] min-w-[200px]`}>Screen</th>
              {data.actors.map((a) => <th key={a.id} scope="col" className={`${TH} text-center`}>{a.name}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.screens.map((s) => (
              <tr key={s.id}>
                <th scope="row" className={`${TD} sticky left-0 z-[1] bg-[var(--w-panel)] text-left font-medium`}>{s.name}</th>
                {data.actors.map((a) => {
                  const on = set.has(`${s.id}:${a.id}`);
                  return (
                    <td key={a.id} className={`${TD} p-0 text-center`}>
                      <button type="button" aria-pressed={on} disabled={!data.canEdit} aria-label={`${on ? 'Deny' : 'Allow'} ${a.name} on ${s.name}`}
                        className={`m-1 inline-flex h-7 w-12 items-center justify-center rounded-[5px] border text-[12px] font-semibold transition-colors ${on ? 'border-[var(--w-accent-border)] bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]' : 'border-[var(--w-border)] text-[var(--w-text-3)] hover:bg-[var(--w-hover)]'}`}
                        onClick={() => toggle.mutate({ screenId: s.id, actorId: a.id, allowed: !on })}>
                        {on ? <><Check size={13} aria-hidden="true" /> X</> : '—'}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </TableFrame>
    </div>
  );
}
