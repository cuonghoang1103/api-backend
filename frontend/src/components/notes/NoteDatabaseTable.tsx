'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Check, Loader2, Plus, Table2, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import {
  noteDatabaseApi,
  type NoteDatabaseFull,
  type NoteDatabaseProperty,
  type NoteDatabasePropertyType,
  type NoteDatabaseRow,
} from '@/lib/api';

interface Props {
  databaseId: number;
  canEdit: boolean;
  onDeleted?: (databaseId: number) => void;
}

const TYPE_LABEL: Record<NoteDatabasePropertyType, string> = {
  TITLE: 'Tiêu đề',
  TEXT: 'Văn bản',
  NUMBER: 'Số',
  SELECT: 'Một lựa chọn',
  MULTI_SELECT: 'Nhiều lựa chọn',
  DATE: 'Ngày',
  CHECKBOX: 'Ô đánh dấu',
  URL: 'Liên kết',
};

const NEW_COLUMN_TYPES: NoteDatabasePropertyType[] = [
  'TEXT', 'NUMBER', 'SELECT', 'MULTI_SELECT', 'DATE', 'CHECKBOX', 'URL',
];

/** Render a stored cell value for display (not for editing). */
function displayValue(property: NoteDatabaseProperty, value: unknown): string {
  if (value === null || value === undefined) return '';
  switch (property.type) {
    case 'CHECKBOX':
      return value ? '✓' : '';
    case 'DATE': {
      const date = new Date(String(value));
      return Number.isNaN(date.getTime())
        ? ''
        : date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
    case 'MULTI_SELECT':
      return Array.isArray(value) ? value.join(', ') : String(value);
    case 'NUMBER':
      return typeof value === 'number' ? value.toLocaleString('vi-VN') : String(value);
    default:
      return String(value);
  }
}

/** Turn a stored value into what the <input> should show while editing. */
function editableValue(property: NoteDatabaseProperty, value: unknown): string {
  if (value === null || value === undefined) return '';
  if (property.type === 'DATE') {
    const date = new Date(String(value));
    // <input type="date"> only accepts yyyy-mm-dd.
    return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
  }
  if (property.type === 'MULTI_SELECT') return Array.isArray(value) ? value.join(', ') : String(value);
  return String(value);
}

/** Convert what the user typed back into the shape the API expects. */
function outboundValue(property: NoteDatabaseProperty, raw: string): unknown {
  if (property.type === 'MULTI_SELECT') {
    const picked = raw.split(',').map((part) => part.trim()).filter(Boolean);
    return picked.length > 0 ? picked : null;
  }
  return raw === '' ? null : raw;
}

export default function NoteDatabaseTable({ databaseId, canEdit, onDeleted }: Props) {
  const [database, setDatabase] = useState<NoteDatabaseFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<{ rowId: number; propertyId: number } | null>(null);
  const [draft, setDraft] = useState('');
  const [addingColumn, setAddingColumn] = useState(false);
  const [columnName, setColumnName] = useState('');
  const [columnType, setColumnType] = useState<NoteDatabasePropertyType>('TEXT');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const load = useCallback(async () => {
    const res = await noteDatabaseApi.get(databaseId);
    setDatabase(res.data.data);
  }, [databaseId]);

  useEffect(() => {
    setLoading(true);
    load()
      .catch(() => toast.error('Không tải được cơ sở dữ liệu'))
      .finally(() => setLoading(false));
  }, [load]);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const properties = useMemo(
    () => (database?.properties ?? []).slice().sort((a, b) => a.sortOrder - b.sortOrder),
    [database],
  );

  const commitCell = async (row: NoteDatabaseRow, property: NoteDatabaseProperty, raw: string) => {
    setEditing(null);
    const next = outboundValue(property, raw);
    const previous = row.values[property.id] ?? null;
    if (JSON.stringify(next) === JSON.stringify(previous)) return;

    // Optimistic: the grid should not flicker on every keystroke commit.
    setDatabase((current) => current && ({
      ...current,
      rows: current.rows.map((item) => (
        item.id === row.id
          ? { ...item, values: { ...item.values, [property.id]: next } }
          : item
      )),
    }));
    try {
      const res = await noteDatabaseApi.updateRow(row.id, { [property.id]: next });
      const saved = res.data.data;
      setDatabase((current) => current && ({
        ...current,
        rows: current.rows.map((item) => (item.id === row.id ? { ...item, values: saved.values } : item)),
      }));
    } catch (error) {
      // The server rejects bad numbers, unknown options and non-http URLs.
      // Roll the cell back so the grid never shows a value that was refused.
      setDatabase((current) => current && ({
        ...current,
        rows: current.rows.map((item) => (
          item.id === row.id
            ? { ...item, values: { ...item.values, [property.id]: previous } }
            : item
        )),
      }));
      const message = (error as { response?: { data?: { message?: string } } })
        .response?.data?.message;
      toast.error(message || 'Giá trị không hợp lệ');
    }
  };

  const addRow = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const res = await noteDatabaseApi.createRow(databaseId);
      setDatabase((current) => current && ({ ...current, rows: [...current.rows, res.data.data] }));
    } catch { toast.error('Không thêm được dòng'); }
    finally { setBusy(false); }
  };

  const removeRow = async (rowId: number) => {
    if (!window.confirm('Xoá dòng này?')) return;
    try {
      await noteDatabaseApi.deleteRow(rowId);
      setDatabase((current) => current && ({ ...current, rows: current.rows.filter((r) => r.id !== rowId) }));
    } catch { toast.error('Không xoá được dòng'); }
  };

  const addColumn = async () => {
    const name = columnName.trim();
    if (!name || busy) return;
    setBusy(true);
    try {
      await noteDatabaseApi.createProperty(databaseId, { name, type: columnType });
      setColumnName('');
      setAddingColumn(false);
      await load();
    } catch (error) {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message;
      toast.error(message || 'Không thêm được cột');
    } finally { setBusy(false); }
  };

  const removeColumn = async (property: NoteDatabaseProperty) => {
    if (!window.confirm(`Xoá cột "${property.name}"? Mọi giá trị trong cột sẽ mất.`)) return;
    try {
      await noteDatabaseApi.deleteProperty(property.id);
      await load();
    } catch { toast.error('Không xoá được cột'); }
  };

  const removeDatabase = async () => {
    if (!database) return;
    if (!window.confirm(`Xoá bảng "${database.title}"? Không thể hoàn tác.`)) return;
    try {
      await noteDatabaseApi.remove(database.id);
      onDeleted?.(database.id);
      toast.success('Đã xoá bảng');
    } catch { toast.error('Không xoá được bảng'); }
  };

  if (loading) {
    return (
      <div className="flex h-32 items-center justify-center text-slate-500">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
      </div>
    );
  }
  if (!database) return null;

  return (
    <section className="rounded-xl border border-slate-200 bg-white dark:border-white/[0.07] dark:bg-white/[0.02]">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-3 dark:border-white/[0.07]">
        <h3 className="flex min-w-0 items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
          <Table2 className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="truncate">{database.icon ? `${database.icon} ` : ''}{database.title}</span>
          <span className="shrink-0 text-[11px] font-normal text-slate-500">{database.rows.length} dòng</span>
        </h3>
        {canEdit && (
          <button
            type="button"
            onClick={removeDatabase}
            className="inline-flex min-h-9 items-center gap-1 rounded-md px-2 text-[11px] text-rose-600 hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 dark:text-rose-300 dark:hover:bg-rose-500/10"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Xoá bảng
          </button>
        )}
      </header>

      {/* Wide tables scroll inside their own box; the page never scrolls sideways. */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-white/[0.07]">
              {properties.map((property) => (
                <th
                  key={property.id}
                  scope="col"
                  className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500"
                >
                  <span className="flex items-center gap-1">
                    <span className="truncate">{property.name}</span>
                    <span className="font-normal normal-case text-slate-400">· {TYPE_LABEL[property.type]}</span>
                    {canEdit && !property.isTitle && (
                      <button
                        type="button"
                        onClick={() => removeColumn(property)}
                        aria-label={`Xoá cột ${property.name}`}
                        className="ml-0.5 text-slate-400 hover:text-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                      >
                        <X className="h-3 w-3" aria-hidden="true" />
                      </button>
                    )}
                  </span>
                </th>
              ))}
              {canEdit && <th scope="col" className="w-10 px-2 py-2"><span className="sr-only">Hành động</span></th>}
            </tr>
          </thead>
          <tbody>
            {database.rows.map((row) => (
              <tr key={row.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 dark:border-white/[0.04] dark:hover:bg-white/[0.02]">
                {properties.map((property) => {
                  const isEditing = editing?.rowId === row.id && editing.propertyId === property.id;
                  const value = row.values[property.id] ?? null;

                  if (property.type === 'CHECKBOX') {
                    return (
                      <td key={property.id} className="px-3 py-2">
                        <input
                          type="checkbox"
                          checked={Boolean(value)}
                          disabled={!canEdit}
                          onChange={(event) => commitCell(row, property, event.target.checked ? 'true' : '')}
                          aria-label={property.name}
                          className="h-4 w-4 accent-teal-600"
                        />
                      </td>
                    );
                  }

                  return (
                    <td key={property.id} className="px-3 py-2 align-top">
                      {isEditing ? (
                        <input
                          ref={inputRef}
                          type={property.type === 'DATE' ? 'date' : property.type === 'NUMBER' ? 'text' : 'text'}
                          inputMode={property.type === 'NUMBER' ? 'decimal' : undefined}
                          value={draft}
                          onChange={(event) => setDraft(event.target.value)}
                          onBlur={() => commitCell(row, property, draft)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter') { event.preventDefault(); commitCell(row, property, draft); }
                            if (event.key === 'Escape') setEditing(null);
                          }}
                          list={property.config?.options ? `opts-${property.id}` : undefined}
                          className="w-full min-w-[7rem] rounded border border-teal-500 bg-white px-2 py-1 text-sm text-slate-900 focus-visible:outline-none dark:bg-black/30 dark:text-slate-100"
                        />
                      ) : (
                        <button
                          type="button"
                          disabled={!canEdit}
                          onClick={() => { setEditing({ rowId: row.id, propertyId: property.id }); setDraft(editableValue(property, value)); }}
                          className="min-h-7 w-full truncate rounded px-1 py-0.5 text-left text-slate-800 hover:bg-slate-100 disabled:cursor-default disabled:hover:bg-transparent dark:text-slate-200 dark:hover:bg-white/[0.05]"
                        >
                          {property.type === 'URL' && value ? (
                            <span className="text-teal-600 underline dark:text-teal-300">{displayValue(property, value)}</span>
                          ) : (
                            displayValue(property, value) || <span className="text-slate-300 dark:text-slate-600">—</span>
                          )}
                        </button>
                      )}
                      {property.config?.options && (
                        <datalist id={`opts-${property.id}`}>
                          {property.config.options.map((option) => <option key={option} value={option} />)}
                        </datalist>
                      )}
                    </td>
                  );
                })}
                {canEdit && (
                  <td className="px-2 py-2 text-right">
                    <button
                      type="button"
                      onClick={() => removeRow(row.id)}
                      aria-label="Xoá dòng"
                      className="text-slate-400 hover:text-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {database.rows.length === 0 && (
              <tr>
                <td colSpan={properties.length + (canEdit ? 1 : 0)} className="px-3 py-6 text-center text-sm text-slate-500">
                  Chưa có dòng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {canEdit && (
        <footer className="flex flex-wrap items-center gap-2 border-t border-slate-200 px-3 py-2 dark:border-white/[0.07]">
          <button
            type="button"
            onClick={addRow}
            disabled={busy}
            className="inline-flex min-h-9 items-center gap-1 rounded-md px-2 text-xs text-slate-600 hover:bg-slate-100 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:text-slate-300 dark:hover:bg-white/[0.05]"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" /> Thêm dòng
          </button>

          {addingColumn ? (
            <span className="flex flex-wrap items-center gap-1">
              <label htmlFor="new-col-name" className="sr-only">Tên cột mới</label>
              <input
                id="new-col-name"
                value={columnName}
                onChange={(event) => setColumnName(event.target.value)}
                onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); addColumn(); } if (event.key === 'Escape') setAddingColumn(false); }}
                placeholder="Tên cột"
                className="min-h-9 w-32 rounded border border-slate-300 px-2 text-xs dark:border-white/[0.12] dark:bg-black/20 dark:text-slate-100"
              />
              <label htmlFor="new-col-type" className="sr-only">Kiểu cột</label>
              <select
                id="new-col-type"
                value={columnType}
                onChange={(event) => setColumnType(event.target.value as NoteDatabasePropertyType)}
                className="min-h-9 rounded border border-slate-300 px-1 text-xs dark:border-white/[0.12] dark:bg-black/20 dark:text-slate-100"
              >
                {NEW_COLUMN_TYPES.map((type) => <option key={type} value={type}>{TYPE_LABEL[type]}</option>)}
              </select>
              <button type="button" onClick={addColumn} disabled={busy || !columnName.trim()} aria-label="Lưu cột mới" className="flex h-9 w-9 items-center justify-center rounded-md text-teal-600 hover:bg-teal-50 disabled:opacity-40 dark:hover:bg-teal-500/10">
                <Check className="h-4 w-4" aria-hidden="true" />
              </button>
              <button type="button" onClick={() => setAddingColumn(false)} aria-label="Huỷ" className="flex h-9 w-9 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-white/[0.05]">
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setAddingColumn(true)}
              className="inline-flex min-h-9 items-center gap-1 rounded-md px-2 text-xs text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:text-slate-300 dark:hover:bg-white/[0.05]"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" /> Thêm cột
            </button>
          )}
        </footer>
      )}
    </section>
  );
}
