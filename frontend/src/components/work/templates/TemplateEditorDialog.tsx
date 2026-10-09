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
import { wt } from '@/components/work/i18n';

const EMPTY: TiptapDoc = { type: 'doc', content: [] };

export function TemplateBadge({ t }: { t: IssueTemplate }) {
  const kind = !t.doc ? 'none' : t.isDefault ? 'default' : 'custom';
  const label = kind === 'none' ? wt('common.none') : kind === 'default' ? wt('tpl.default') : wt('tpl.custom');
  return (
    <span
      className={
        kind === 'custom'
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
    onSuccess: () => done(draft && !isDocEmpty(draft) ? wt('tpl.savedT', { t: template!.typeName }) : wt('tpl.offT', { t: template!.typeName })),
    onError: (err) => toast.error(workError(err, wt('tpl.saveFailed'))),
  });
  const reset = useMutation({
    mutationFn: () => workApi.setIssueTemplate(config.id, template!.typeKey, null),
    onSuccess: () => done(template!.hasDefault ? wt('tpl.resetDone') : wt('tpl.removed')),
    onError: (err) => toast.error(workError(err, wt('tpl.resetFailed'))),
  });

  if (!template) return null;
  const type = config.issueTypes.find((t) => t.id === template.typeId);
  const pending = save.isPending || reset.isPending;
  const guardedClose = () => {
    if (pending) return;
    if (dirty && !window.confirm(wt('tpl.discardQ'))) return;
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
                {template.hasDefault ? wt('tpl.resetDefault') : wt('tpl.removeTpl')}
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button type="button" className="w-btn w-btn-ghost" disabled={pending} onClick={guardedClose}>{wt('common.cancel')}</button>
            <button type="button" className="w-btn w-btn-primary" disabled={pending || !dirty} onClick={() => save.mutate()}>
              {save.isPending && <Spinner size={12} />} {wt('common.save')}
            </button>
          </div>
        </div>
      ) : (
        <button type="button" className="w-btn" onClick={onClose}>{wt('common.close')}</button>
      )}
    >
      <p className="mb-3 text-[13px] text-[var(--w-text-2)]">
        {wt('tpl.prefills')} <span className="font-medium text-[var(--w-text)]">{template.typeName}</span>.
        {canEdit
          ? wt('tpl.leaveEmpty')
          : wt('tpl.onlyAdmins')}
      </p>
      {canEdit ? (
        <RichEditor
          key={editorKey}
          value={draft}
          onChange={(d) => { setDraft(d); setDirty(true); }}
          members={config.members}
          minHeight={260}
          placeholder={wt('tpl.noTplPh')}
          onSubmit={() => dirty && !pending && save.mutate()}
        />
      ) : template.doc ? (
        <div className="max-h-[60vh] overflow-y-auto rounded-[6px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-3 py-2.5">
          <RichView value={template.doc} />
        </div>
      ) : (
        <p className="rounded-[6px] border border-dashed border-[var(--w-border-strong)] px-3 py-6 text-center text-[13px] text-[var(--w-text-3)]">{wt('tpl.noTpl')}</p>
      )}
      {template.isDefault && template.doc && canEdit && (
        <p className="mt-2 text-[12px] text-[var(--w-text-3)]">{wt('tpl.lookingDefault')}</p>
      )}
    </Dialog>
  );
}
