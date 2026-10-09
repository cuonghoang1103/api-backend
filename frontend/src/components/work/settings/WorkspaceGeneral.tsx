'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { workApi, workError, type WorkspaceDetail } from '@/lib/work-api';
import { useAuthStore } from '@/store/authStore';
import { wk } from '../hooks';
import { Field, Spinner, useToggle } from '../ui';
import { ConfirmDialog, ReadOnlyNotice, Section, TypeToConfirmDialog } from './shared';
import { WorkspaceLogo } from './ProjectIdentity';
import { wt } from '@/components/work/i18n';

export default function WorkspaceGeneral({ ws }: { ws: WorkspaceDetail }) {
  const router = useRouter();
  const qc = useQueryClient();
  const me = useAuthStore((s) => s.user?.id);
  const canEdit = ws.role === 'OWNER' || ws.role === 'ADMIN';
  const isOwner = ws.role === 'OWNER';

  const [name, setName] = useState(ws.name);
  const [description, setDescription] = useState(ws.description ?? '');
  useEffect(() => { setName(ws.name); setDescription(ws.description ?? ''); }, [ws.name, ws.description]);
  const dirty = name.trim() !== ws.name || (description.trim() || null) !== (ws.description ?? null);

  const save = useMutation({
    mutationFn: () => workApi.updateWorkspace(ws.id, { name: name.trim(), description: description.trim() || null }),
    onSuccess: () => {
      toast.success(wt('settings.wsUpdated'));
      qc.invalidateQueries({ queryKey: wk.workspace(ws.slug) });
      qc.invalidateQueries({ queryKey: wk.workspaces });
    },
    onError: (err) => toast.error(workError(err, wt('settings.saveChangesFailed'))),
  });

  const delDialog = useToggle();
  const del = useMutation({
    mutationFn: (typed: string) => workApi.deleteWorkspace(ws.id, typed),
    onSuccess: () => {
      toast.success(wt('settings.wsDeleted', { name: ws.name }));
      qc.invalidateQueries({ queryKey: wk.workspaces });
      qc.removeQueries({ queryKey: wk.workspace(ws.slug) });
      router.push('/work');
    },
    onError: (err) => toast.error(workError(err, wt('settings.wsDeleteFailed'))),
  });

  const leaveDialog = useToggle();
  const leave = useMutation({
    mutationFn: () => {
      if (!me) throw new Error(wt('settings.sessionNotReady'));
      return workApi.removeMember(ws.id, me);
    },
    onSuccess: () => {
      toast.success(wt('settings.youLeft', { name: ws.name }));
      qc.invalidateQueries({ queryKey: wk.workspaces });
      qc.removeQueries({ queryKey: wk.workspace(ws.slug) });
      router.push('/work');
    },
    onError: (err) => toast.error(workError(err, wt('settings.leaveFailed'))),
  });

  return (
    <div>
      {!canEdit && <ReadOnlyNotice>{wt('settings.wsReadOnly')}</ReadOnlyNotice>}

      <Section title={wt('settings.wsDetails')} description={wt('settings.wsDetailsDesc')}>
        <form
          className="max-w-[520px]"
          onSubmit={(e) => { e.preventDefault(); if (canEdit && dirty && name.trim() && !save.isPending) save.mutate(); }}
        >
          <Field label={wt('common.name')}>
            <input className="w-input" value={name} onChange={(e) => setName(e.target.value)} disabled={!canEdit} maxLength={100} />
          </Field>
          <Field label={wt('common.description')}>
            <textarea className="w-input" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} disabled={!canEdit} maxLength={2000} placeholder={wt('create.wsDescPh')} />
          </Field>
          <Field label="URL">
            <div className="flex h-8 items-center rounded-[6px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-2.5 font-mono text-[12px] text-[var(--w-text-2)]">
              /work/{ws.slug}
            </div>
          </Field>
          {canEdit && (
            <button type="submit" className="w-btn w-btn-primary" disabled={!dirty || !name.trim() || save.isPending}>
              {save.isPending && <Spinner size={12} />}
              {wt('common.saveChanges')}
            </button>
          )}
        </form>
      </Section>

      {/* CTW-23: logo không gian. */}
      <WorkspaceLogo
        wsId={ws.id} name={ws.name} logoUrl={ws.logoUrl} canEdit={canEdit}
        onChanged={() => { qc.invalidateQueries({ queryKey: wk.workspace(ws.slug) }); qc.invalidateQueries({ queryKey: wk.workspaces }); }}
      />

      {isOwner ? (
        <Section title={wt('settings.tDangerZone')} danger description={wt('settings.wsDangerDesc')}>
          <div className="flex flex-col gap-3 rounded-[8px] border border-[color-mix(in_srgb,var(--w-red)_35%,transparent)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-[13px]">
              <div className="font-medium">{wt('settings.deleteThisWs')}</div>
              <div className="text-[var(--w-text-2)]">{wt('settings.transferFirst')}</div>
            </div>
            <button type="button" className="w-btn w-btn-danger shrink-0" onClick={delDialog.open}>{wt('settings.deleteWs')}</button>
          </div>
        </Section>
      ) : (
        <Section title={wt('settings.leaveWs')} description={wt('settings.leaveDesc')}>
          <button type="button" className="w-btn w-btn-danger" onClick={leaveDialog.open}>{wt('settings.leaveWs')}</button>
        </Section>
      )}

      <TypeToConfirmDialog
        open={delDialog.on}
        onClose={delDialog.close}
        title={wt('settings.deleteWs')}
        body={wt('settings.deleteWsBody', { name: ws.name })}
        expected={ws.name}
        confirmLabel={wt('settings.deleteWs')}
        pending={del.isPending}
        onConfirm={(typed) => del.mutate(typed)}
      />
      <ConfirmDialog
        open={leaveDialog.on}
        onClose={leaveDialog.close}
        title={wt('settings.leaveWsQ')}
        body={wt('settings.leaveBody', { name: ws.name })}
        confirmLabel={wt('settings.leaveWs')}
        pending={leave.isPending}
        onConfirm={() => leave.mutate()}
      />
    </div>
  );
}
