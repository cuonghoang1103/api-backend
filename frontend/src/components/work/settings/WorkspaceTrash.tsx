'use client';

/** Cài đặt không gian → Trash: dự án đã xoá (xoá mềm), admin không gian khôi phục được. */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { FolderX, RotateCcw } from 'lucide-react';
import { workApi, workError, type WorkspaceDetail } from '@/lib/work-api';
import { wk } from '../hooks';
import { EmptyState, relativeTime, Spinner } from '../ui';
import { ReadOnlyNotice, Section } from './shared';

export default function WorkspaceTrash({ ws }: { ws: WorkspaceDetail }) {
  const canManage = ws.role === 'OWNER' || ws.role === 'ADMIN';
  const qc = useQueryClient();
  const key = ['work', 'workspace-trash', ws.id] as const;
  const q = useQuery({ queryKey: key, queryFn: () => workApi.projectTrash(ws.id), enabled: canManage });

  const restore = useMutation({
    mutationFn: (pid: number) => workApi.restoreProject(ws.id, pid),
    onSuccess: (_d, pid) => {
      const p = q.data?.find((x) => x.id === pid);
      toast.success(p ? `Project ${p.key} restored` : 'Project restored');
      qc.invalidateQueries({ queryKey: key });
      qc.invalidateQueries({ queryKey: wk.workspace(ws.slug) });
      qc.invalidateQueries({ queryKey: wk.workspaces });
    },
    onError: (err) => toast.error(workError(err, 'Could not restore the project')),
  });

  const description = 'Deleted projects are kept here with all their issues, sprints and settings. Restore a project to bring it back for everyone who had access.';

  if (!canManage) {
    return (
      <Section title="Trash" description={description}>
        <ReadOnlyNotice>Only workspace admins can view and restore deleted projects.</ReadOnlyNotice>
      </Section>
    );
  }

  const rows = q.data ?? [];

  return (
    <Section title="Trash" description={description}>
      {q.isLoading ? (
        <div className="flex justify-center py-10"><Spinner size={18} /></div>
      ) : q.error ? (
        <EmptyState title="Could not load the trash" body={workError(q.error)} action={<button type="button" className="w-btn" onClick={() => q.refetch()}>Try again</button>} />
      ) : !rows.length ? (
        <div className="flex flex-col items-center rounded-[8px] border border-dashed border-[var(--w-border)] px-6 py-10 text-center">
          <FolderX size={20} className="mb-2 text-[var(--w-text-3)]" />
          <div className="text-[13px] font-medium">No deleted projects</div>
          <p className="mt-1 text-[12px] text-[var(--w-text-3)]">Projects deleted from this workspace will appear here.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[8px] border border-[var(--w-border)]">
          {rows.map((p) => {
            const pending = restore.isPending && restore.variables === p.id;
            return (
              <div key={p.id} className="flex items-center gap-3 border-b border-[var(--w-border)] px-3 py-2.5 last:border-b-0">
                <span className="w-[52px] shrink-0 truncate font-mono text-[11px] font-semibold text-[var(--w-text-3)]">{p.key}</span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-medium">{p.name}</div>
                  <div className="text-[12px] text-[var(--w-text-3)]">
                    {p._count.issues} {p._count.issues === 1 ? 'issue' : 'issues'} · deleted {relativeTime(p.deletedAt)}
                  </div>
                </div>
                <button type="button" className="w-btn w-btn-sm shrink-0" disabled={pending} onClick={() => restore.mutate(p.id)}>
                  {pending ? <Spinner size={11} /> : <RotateCcw size={13} />} Restore
                </button>
              </div>
            );
          })}
        </div>
      )}
    </Section>
  );
}
