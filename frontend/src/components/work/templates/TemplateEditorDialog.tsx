'use client';

/**
 * Sửa mẫu mô tả của một loại thẻ (Settings → Issue types). Dùng lại
 * RichEditor nên mẫu có đúng những gì ô mô tả vẽ được. Người không phải
 * admin chỉ xem.
 */

import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { RotateCcw } from 'lucide-react';
import { workApi, workError, type IssueTemplate, type ProjectConfig, type TiptapDoc } from '@/lib/work-api';
import { wk } from '../hooks';
import RichEditor, { isDocEmpty, RichView } from '../RichEditor';
import { Dialog, IssueTypeIcon, Spinner } from '../ui';

const EMPTY: TiptapDoc = { type: 'doc', content: [] };

export function TemplateBadge({ t }: { t: IssueTemplate }) {
  const label = !t.doc ? 'None' : t.isDefault ? 'Default' : 'Custom';
  return (
    <span
      className={
        label === 'Custom'
          ? 'rounded-[4px] border border-[var(--w-accent-border)] bg-[var(--w-accent-soft)] px-1.5 text-[11px] leading-[18px] text-[var(--w-accent-text)]'
          : 'rounded-[4px] border border-[var(--w-border-strong)] px-1.5 text-[11px] leading-[18px] text-[var(--w-text-3)]'
      }
    >
      {label}
    </span>
  );
}

export default function TemplateEditorDialog({ open, onClose, config, template, canEdit }: {
  open: boolean;
  onClose: () => void;
  config: ProjectConfig;
  template: IssueTemplate | null;
  canEdit: boolean;
}) {
  const qc = useQueryClient();
  const [draft, setDraft] = useState<TiptapDoc | null>(null);
  const [dirty, setDirty] = useState(false);
  const [editorKey, setEditorKey] = useState(0);

  useEffect(() => {
    if (!open || !template) return;
    setDraft(template.doc);
    setDirty(false);
    setEditorKey((k) => k + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- chỉ nạp lại khi mở/đổi loại: dữ liệu tải lại giữa chừng không được xoá chữ đang gõ
  }, [open, template?.typeKey]);

  const done = (msg: string) => {
    qc.invalidateQueries({ queryKey: wk.issueTemplates(config.id) });
    toast.success(msg);
    onClose();
  };
  const save = useMutation({
    mutationFn: () => workApi.setIssueTemplate(config.id, template!.typeKey, draft && !isDocEmpty(draft) ? draft : EMPTY),
    onSuccess: () => done(draft && !isDocEmpty(draft) ? `Template for ${template!.typeName} saved` : `Template for ${template!.typeName} turned off`),
    onError: (err) => toast.error(workError(err, 'Could not save the template')),
  });
  const reset = useMutation({
    mutationFn: () => workApi.setIssueTemplate(config.id, template!.typeKey, null),
    onSuccess: () => done(template!.hasDefault ? 'Template reset to the default' : 'Template removed'),
    onError: (err) => toast.error(workError(err, 'Could not reset the template')),
  });

  if (!template) return null;
  const type = config.issueTypes.find((t) => t.id === template.typeId);
  const pending = save.isPending || reset.isPending;
  const guardedClose = () => {
    if (pending) return;
    if (dirty && !window.confirm('Discard your changes to this template?')) return;
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={guardedClose}
      width={720}
      title={(
        <span className="flex items-center gap-2">
          <IssueTypeIcon type={type ?? { key: template.typeKey, color: '#64748b', name: template.typeName }} size={14} />
          {template.typeName} description template
          <TemplateBadge t={template} />
        </span>
      )}
      footer={canEdit ? (
        <div className="flex w-full flex-wrap items-center justify-between gap-2">
          <div>
            {!template.isDefault && (
              <button type="button" className="w-btn w-btn-ghost" disabled={pending} onClick={() => reset.mutate()}>
                {reset.isPending ? <Spinner size={12} /> : <RotateCcw size={13} />}
                {template.hasDefault ? 'Reset to default' : 'Remove template'}
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button type="button" className="w-btn w-btn-ghost" disabled={pending} onClick={guardedClose}>Cancel</button>
            <button type="button" className="w-btn w-btn-primary" disabled={pending || !dirty} onClick={() => save.mutate()}>
              {save.isPending && <Spinner size={12} />} Save
            </button>
          </div>
        </div>
      ) : (
        <button type="button" className="w-btn" onClick={onClose}>Close</button>
      )}
    >
      <p className="mb-3 text-[13px] text-[var(--w-text-2)]">
        Pre-fills the description when someone creates a <span className="font-medium text-[var(--w-text)]">{template.typeName}</span>.
        {canEdit
          ? ' Leave it empty to turn the template off for this type.'
          : ' Only project admins can change it.'}
      </p>
      {canEdit ? (
        <RichEditor
          key={editorKey}
          value={draft}
          onChange={(d) => { setDraft(d); setDirty(true); }}
          members={config.members}
          minHeight={260}
          placeholder="No template — the description starts empty."
          onSubmit={() => dirty && !pending && save.mutate()}
        />
      ) : template.doc ? (
        <div className="max-h-[60vh] overflow-y-auto rounded-[6px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-3 py-2.5">
          <RichView value={template.doc} />
        </div>
      ) : (
        <p className="rounded-[6px] border border-dashed border-[var(--w-border-strong)] px-3 py-6 text-center text-[13px] text-[var(--w-text-3)]">This type has no template.</p>
      )}
      {template.isDefault && template.doc && canEdit && (
        <p className="mt-2 text-[12px] text-[var(--w-text-3)]">You are looking at the CT Work default. Saving creates a custom copy for this project.</p>
      )}
    </Dialog>
  );
}
