'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { workApi, workError, type ProjectConfig } from '@/lib/work-api';
import { wk } from '../hooks';
import { Spinner, useToggle } from '../ui';
import { ConfirmDialog, Section, TypeToConfirmDialog } from './shared';
import { useProjectInvalidate } from './useProjectInvalidate';
import { wt } from '@/components/work/i18n';

export default function ProjectDanger({ config, slug }: { config: ProjectConfig; slug: string }) {
  const router = useRouter();
  const qc = useQueryClient();
  const invalidate = useProjectInvalidate(config.id, slug);
  const archived = !!config.archivedAt;

  const archiveDialog = useToggle();
  const archive = useMutation({
    mutationFn: () => workApi.archiveProject(config.id, !archived),
    onSuccess: () => {
      toast.success(archived ? wt('settings.projRestored') : wt('settings.projArchived'));
      archiveDialog.close();
      invalidate();
    },
    onError: (err) => toast.error(workError(err, wt('settings.projChangeFailed'))),
  });

  const deleteDialog = useToggle();
  const del = useMutation({
    mutationFn: (typed: string) => workApi.deleteProject(config.id, typed),
    onSuccess: () => {
      toast.success(wt('settings.projDeleted', { key: config.key }));
      qc.invalidateQueries({ queryKey: wk.workspace(slug) });
      qc.invalidateQueries({ queryKey: wk.workspaces });
      qc.removeQueries({ queryKey: wk.resolve(slug, config.key) });
      qc.removeQueries({ queryKey: wk.project(config.id) });
      router.push(`/work/${slug}`);
    },
    onError: (err) => toast.error(workError(err, wt('settings.projDeleteFailed'))),
  });

  const row = 'flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between';

  return (
    <Section title={wt('settings.tDangerZone')} danger>
      <div className="overflow-hidden rounded-[8px] border border-[color-mix(in_srgb,var(--w-red)_35%,transparent)]">
        <div className={`${row} border-b border-[var(--w-border)]`}>
          <div className="text-[13px]">
            <div className="font-medium">{archived ? wt('settings.restoreProj') : wt('settings.archiveProj')}</div>
            <div className="text-[var(--w-text-2)]">
              {archived
                ? wt('settings.restoreHelp')
                : wt('settings.archiveHelp')}
            </div>
          </div>
          <button type="button" className="w-btn shrink-0" onClick={archiveDialog.open} disabled={archive.isPending}>
            {archive.isPending && <Spinner size={12} />}
            {archived ? wt('settings.restoreProj') : wt('settings.archiveProj')}
          </button>
        </div>
        <div className={row}>
          <div className="text-[13px]">
            <div className="font-medium">{wt('settings.deleteProj')}</div>
            <div className="text-[var(--w-text-2)]">{wt('settings.deleteHelp')}</div>
          </div>
          <button type="button" className="w-btn w-btn-danger shrink-0" onClick={deleteDialog.open}>{wt('settings.deleteProj')}</button>
        </div>
      </div>

      <ConfirmDialog
        open={archiveDialog.on}
        onClose={archiveDialog.close}
        title={archived ? wt('settings.restoreQ') : wt('settings.archiveQ')}
        body={archived
          ? wt('settings.restoreBody', { name: config.name })
          : wt('settings.archiveBody', { name: config.name })}
        confirmLabel={archived ? wt('common.restore') : wt('common.archive')}
        danger={!archived}
        pending={archive.isPending}
        onConfirm={() => archive.mutate()}
      />
      <TypeToConfirmDialog
        open={deleteDialog.on}
        onClose={deleteDialog.close}
        title={wt('settings.deleteProj')}
        body={wt('settings.deleteBody', { name: config.name })}
        expected={config.key}
        caseInsensitive
        confirmLabel={wt('settings.deleteProj')}
        pending={del.isPending}
        onConfirm={(typed) => del.mutate(typed)}
      />
    </Section>
  );
}
