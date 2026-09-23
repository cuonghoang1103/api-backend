'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { workApi, workError, type ProjectConfig } from '@/lib/work-api';
import { wk } from '../hooks';
import { Spinner, useToggle } from '../ui';
import { ConfirmDialog, Section, TypeToConfirmDialog } from './shared';
import { useProjectInvalidate } from './useProjectInvalidate';

export default function ProjectDanger({ config, slug }: { config: ProjectConfig; slug: string }) {
  const router = useRouter();
  const qc = useQueryClient();
  const invalidate = useProjectInvalidate(config.id, slug);
  const archived = !!config.archivedAt;

  const archiveDialog = useToggle();
  const archive = useMutation({
    mutationFn: () => workApi.archiveProject(config.id, !archived),
    onSuccess: () => {
      toast.success(archived ? 'Project restored' : 'Project archived');
      archiveDialog.close();
      invalidate();
    },
    onError: (err) => toast.error(workError(err, 'Could not change the project')),
  });

  const deleteDialog = useToggle();
  const del = useMutation({
    mutationFn: (typed: string) => workApi.deleteProject(config.id, typed),
    onSuccess: () => {
      toast.success(`Project ${config.key} deleted`);
      qc.invalidateQueries({ queryKey: wk.workspace(slug) });
      qc.invalidateQueries({ queryKey: wk.workspaces });
      qc.removeQueries({ queryKey: wk.resolve(slug, config.key) });
      qc.removeQueries({ queryKey: wk.project(config.id) });
      router.push(`/work/${slug}`);
    },
    onError: (err) => toast.error(workError(err, 'Could not delete the project')),
  });

  const row = 'flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between';

  return (
    <Section title="Danger zone" danger>
      <div className="overflow-hidden rounded-[8px] border border-[color-mix(in_srgb,var(--w-red)_35%,transparent)]">
        <div className={`${row} border-b border-[var(--w-border)]`}>
          <div className="text-[13px]">
            <div className="font-medium">{archived ? 'Restore project' : 'Archive project'}</div>
            <div className="text-[var(--w-text-2)]">
              {archived
                ? 'Move the project back to the active list in the sidebar and workspace.'
                : 'Hide the project from the sidebar. Its issues stay intact and you can restore it any time.'}
            </div>
          </div>
          <button type="button" className="w-btn shrink-0" onClick={archiveDialog.open} disabled={archive.isPending}>
            {archive.isPending && <Spinner size={12} />}
            {archived ? 'Restore project' : 'Archive project'}
          </button>
        </div>
        <div className={row}>
          <div className="text-[13px]">
            <div className="font-medium">Delete project</div>
            <div className="text-[var(--w-text-2)]">Removes the project with all of its issues, sprints, comments and attachments for everyone.</div>
          </div>
          <button type="button" className="w-btn w-btn-danger shrink-0" onClick={deleteDialog.open}>Delete project</button>
        </div>
      </div>

      <ConfirmDialog
        open={archiveDialog.on}
        onClose={archiveDialog.close}
        title={archived ? 'Restore project?' : 'Archive project?'}
        body={archived
          ? <><span className="font-medium text-[var(--w-text)]">{config.name}</span> will appear in the sidebar again.</>
          : <><span className="font-medium text-[var(--w-text)]">{config.name}</span> will be hidden from the sidebar. Members can still open it from the Archived section of the workspace.</>}
        confirmLabel={archived ? 'Restore' : 'Archive'}
        danger={!archived}
        pending={archive.isPending}
        onConfirm={() => archive.mutate()}
      />
      <TypeToConfirmDialog
        open={deleteDialog.on}
        onClose={deleteDialog.close}
        title="Delete project"
        body={<>This permanently deletes <span className="font-medium text-[var(--w-text)]">{config.name}</span> for every member. This cannot be undone from the app.</>}
        expected={config.key}
        caseInsensitive
        confirmLabel="Delete project"
        pending={del.isPending}
        onConfirm={(typed) => del.mutate(typed)}
      />
    </Section>
  );
}
