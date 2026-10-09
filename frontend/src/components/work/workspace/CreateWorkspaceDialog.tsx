'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { workApi, workError } from '@/lib/work-api';
import { wk } from '../hooks';
import { Dialog, Field, Spinner } from '../ui';
import { wt } from '@/components/work/i18n';

export default function CreateWorkspaceDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const qc = useQueryClient();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (open) { setName(''); setDescription(''); }
  }, [open]);

  const create = useMutation({
    mutationFn: () => workApi.createWorkspace({ name: name.trim(), description: description.trim() || null }),
    onSuccess: (ws) => {
      qc.invalidateQueries({ queryKey: wk.workspaces });
      toast.success(wt('create.wsCreated', { name: ws.name }));
      // Không gọi onClose: trang cha có thể router.replace (bỏ ?new=1) và giẫm lên lệnh push này.
      router.push(`/work/${ws.slug}`);
    },
    onError: (err) => toast.error(workError(err, wt('create.wsCreateFailed'))),
  });

  const canSubmit = name.trim().length > 0 && !create.isPending && !create.isSuccess;

  return (
    <Dialog open={open} onClose={onClose} title={wt('create.newWorkspace')} width={480}>
      <form onSubmit={(e) => { e.preventDefault(); if (canSubmit) create.mutate(); }}>
        <p className="mb-4 text-[13px] text-[var(--w-text-2)]">
          {wt('create.wsIntro')}
        </p>
        <Field label={wt('create.name')}>
          <input className="w-input" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} placeholder={wt('create.wsNamePh')} autoFocus />
        </Field>
        <Field label={wt('create.descOptional')}>
          <textarea className="w-input" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} maxLength={2000} placeholder={wt('create.wsDescPh')} />
        </Field>
        <div className="mt-2 flex justify-end gap-2">
          <button type="button" className="w-btn" onClick={onClose}>{wt('create.cancel')}</button>
          <button type="submit" className="w-btn w-btn-primary" disabled={!canSubmit}>
            {(create.isPending || create.isSuccess) && <Spinner size={12} />}
            {wt('create.createWorkspace')}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
