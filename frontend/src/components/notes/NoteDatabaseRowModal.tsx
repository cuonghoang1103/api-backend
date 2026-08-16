'use client';

import { useEffect, useMemo, useState } from 'react';
import { Loader2, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import {
  noteDatabaseApi,
  type NoteDatabaseProperty,
  type NoteDatabaseRow,
} from '@/lib/api';
import { editableValue, outboundValue, rowTitle } from '@/lib/noteDatabaseValues';

interface Props {
  properties: NoteDatabaseProperty[];
  row: NoteDatabaseRow;
  canEdit: boolean;
  onSaved: (row: NoteDatabaseRow) => void;
  onDeleted: (rowId: number) => void;
  onClose: () => void;
}

/**
 * Full-record editor for one database row.
 *
 * This is what makes Kanban/Gallery/Calendar usable: those views show a card
 * per row but have nowhere to put a grid of inputs, so opening the card has
 * to lead somewhere. Every field is written in ONE updateRow call, so a
 * rejected value (bad number, unknown option, non-http URL) leaves the whole
 * record untouched rather than half-applied.
 */
export default function NoteDatabaseRowModal({
  properties, row, canEdit, onSaved, onDeleted, onClose,
}: Props) {
  const ordered = useMemo(
    () => properties.slice().sort((a, b) => a.sortOrder - b.sortOrder),
    [properties],
  );

  const [draft, setDraft] = useState<Record<number, string>>(() =>
    Object.fromEntries(ordered.map((property) => [
      property.id,
      property.type === 'CHECKBOX'
        ? (row.values[property.id] ? 'true' : '')
        : editableValue(property, row.values[property.id]),
    ])));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const save = async () => {
    if (!canEdit || saving) return;
    setSaving(true);
    try {
      const values: Record<number, unknown> = {};
      for (const property of ordered) {
        const raw = draft[property.id] ?? '';
        values[property.id] = property.type === 'CHECKBOX'
          ? raw === 'true'
          : outboundValue(property, raw);
      }
      const res = await noteDatabaseApi.updateRow(row.id, values);
      onSaved(res.data.data);
      toast.success('Đã lưu');
      onClose();
    } catch (error) {
      const message = (error as { response?: { data?: { message?: string } } })
        .response?.data?.message;
      toast.error(message || 'Không lưu được, kiểm tra lại giá trị');
    } finally { setSaving(false); }
  };

  const remove = async () => {
    if (!canEdit) return;
    if (!window.confirm('Xoá dòng này?')) return;
    try {
      await noteDatabaseApi.deleteRow(row.id);
      onDeleted(row.id);
      onClose();
    } catch { toast.error('Không xoá được dòng'); }
  };

  return (
    <div
      className="fixed inset-0 z-[85] flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="db-row-title"
        className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-white/[0.08] dark:bg-[#0e1218]"
      >
        <header className="flex items-start justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-white/[0.07]">
          <h2 id="db-row-title" className="min-w-0 truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
            {rowTitle(ordered, row.values)}
          </h2>
          <button
            onClick={onClose}
            aria-label="Đóng"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:hover:bg-white/[0.06]"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </header>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
          {ordered.map((property) => {
            const inputId = `db-field-${property.id}`;
            return (
              <div key={property.id}>
                <label htmlFor={inputId} className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  {property.name}
                </label>
                {property.type === 'CHECKBOX' ? (
                  <input
                    id={inputId}
                    type="checkbox"
                    disabled={!canEdit}
                    checked={draft[property.id] === 'true'}
                    onChange={(event) => setDraft((current) => ({ ...current, [property.id]: event.target.checked ? 'true' : '' }))}
                    className="h-4 w-4 accent-teal-600"
                  />
                ) : (
                  <>
                    <input
                      id={inputId}
                      type={property.type === 'DATE' ? 'date' : 'text'}
                      inputMode={property.type === 'NUMBER' ? 'decimal' : undefined}
                      disabled={!canEdit}
                      value={draft[property.id] ?? ''}
                      onChange={(event) => setDraft((current) => ({ ...current, [property.id]: event.target.value }))}
                      list={property.config?.options ? `modal-opts-${property.id}` : undefined}
                      placeholder={property.type === 'MULTI_SELECT' ? 'Ngăn cách bằng dấu phẩy' : undefined}
                      className="min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 disabled:opacity-60 dark:border-white/[0.12] dark:bg-black/20 dark:text-slate-100"
                    />
                    {property.config?.options && (
                      <datalist id={`modal-opts-${property.id}`}>
                        {property.config.options.map((option) => <option key={option} value={option} />)}
                      </datalist>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>

        {canEdit && (
          <footer className="flex items-center justify-between gap-2 border-t border-slate-200 px-4 py-3 dark:border-white/[0.07]">
            <button
              onClick={remove}
              className="inline-flex min-h-10 items-center gap-1 rounded-lg px-2 text-xs text-rose-600 hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 dark:text-rose-300 dark:hover:bg-rose-500/10"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Xoá dòng
            </button>
            <button
              onClick={save}
              disabled={saving}
              className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-teal-600 px-4 text-sm font-medium text-white hover:bg-teal-500 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />} Lưu
            </button>
          </footer>
        )}
      </div>
    </div>
  );
}
