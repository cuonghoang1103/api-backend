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
      toast.success('Workspace updated');
      qc.invalidateQueries({ queryKey: wk.workspace(ws.slug) });
      qc.invalidateQueries({ queryKey: wk.workspaces });
    },
    onError: (err) => toast.error(workError(err, 'Could not save changes')),
  });

  const delDialog = useToggle();
  const del = useMutation({
    mutationFn: (typed: string) => workApi.deleteWorkspace(ws.id, typed),
    onSuccess: () => {
      toast.success(`Workspace “${ws.name}” deleted`);
      qc.invalidateQueries({ queryKey: wk.workspaces });
      qc.removeQueries({ queryKey: wk.workspace(ws.slug) });
      router.push('/work');
    },
    onError: (err) => toast.error(workError(err, 'Could not delete the workspace')),
  });

  const leaveDialog = useToggle();
  const leave = useMutation({
    mutationFn: () => {
      if (!me) throw new Error('Your session is not ready yet. Reload the page and try again.');
      return workApi.removeMember(ws.id, me);
    },
    onSuccess: () => {
      toast.success(`You left ${ws.name}`);
      qc.invalidateQueries({ queryKey: wk.workspaces });
      qc.removeQueries({ queryKey: wk.workspace(ws.slug) });
      router.push('/work');
    },
    onError: (err) => toast.error(workError(err, 'Could not leave the workspace')),
  });

  return (
    <div>
      {!canEdit && <ReadOnlyNotice>Only workspace owners and admins can change these settings.</ReadOnlyNotice>}

      <Section title="Workspace details" description="The name appears in the sidebar, invitations and email notifications.">
        <form
          className="max-w-[520px]"
          onSubmit={(e) => { e.preventDefault(); if (canEdit && dirty && name.trim() && !save.isPending) save.mutate(); }}
        >
          <Field label="Name">
            <input className="w-input" value={name} onChange={(e) => setName(e.target.value)} disabled={!canEdit} maxLength={100} />
          </Field>
          <Field label="Description">
            <textarea className="w-input" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} disabled={!canEdit} maxLength={2000} placeholder="What does this team work on?" />
          </Field>
          <Field label="URL">
            <div className="flex h-8 items-center rounded-[6px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-2.5 font-mono text-[12px] text-[var(--w-text-2)]">
              /work/{ws.slug}
            </div>
          </Field>
          {canEdit && (
            <button type="submit" className="w-btn w-btn-primary" disabled={!dirty || !name.trim() || save.isPending}>
              {save.isPending && <Spinner size={12} />}
              Save changes
            </button>
          )}
        </form>
      </Section>

      {isOwner ? (
        <Section title="Danger zone" danger description="Deleting a workspace removes access to all of its projects, issues and files for every member.">
          <div className="flex flex-col gap-3 rounded-[8px] border border-[color-mix(in_srgb,var(--w-red)_35%,transparent)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-[13px]">
              <div className="font-medium">Delete this workspace</div>
              <div className="text-[var(--w-text-2)]">Transfer ownership first if you only want to step away.</div>
            </div>
            <button type="button" className="w-btn w-btn-danger shrink-0" onClick={delDialog.open}>Delete workspace</button>
          </div>
        </Section>
      ) : (
        <Section title="Leave workspace" description="You will lose access to every project in this workspace until someone invites you again.">
          <button type="button" className="w-btn w-btn-danger" onClick={leaveDialog.open}>Leave workspace</button>
        </Section>
      )}

      <TypeToConfirmDialog
        open={delDialog.on}
        onClose={delDialog.close}
        title="Delete workspace"
        body={<>This deletes <span className="font-medium text-[var(--w-text)]">{ws.name}</span> with all of its projects. Members lose access immediately.</>}
        expected={ws.name}
        confirmLabel="Delete workspace"
        pending={del.isPending}
        onConfirm={(typed) => del.mutate(typed)}
      />
      <ConfirmDialog
        open={leaveDialog.on}
        onClose={leaveDialog.close}
        title="Leave workspace?"
        body={<>You will no longer see <span className="font-medium text-[var(--w-text)]">{ws.name}</span> or its projects.</>}
        confirmLabel="Leave workspace"
        pending={leave.isPending}
        onConfirm={() => leave.mutate()}
      />
    </div>
  );
}
