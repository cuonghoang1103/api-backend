'use client';

import { useMemo } from 'react';
import type { NoteDatabaseProperty, NoteDatabaseRow } from '@/lib/api';
import { displayValue, optionNames, rowTitle } from '@/lib/noteDatabaseValues';

/**
 * Board / Gallery / Calendar renderings of a database.
 *
 * All three read the rows the table view already loaded — switching view costs
 * no request, and there is exactly one copy of the data on screen so an edit
 * made in one view cannot disagree with another.
 */

interface ViewProps {
  properties: NoteDatabaseProperty[];
  rows: NoteDatabaseRow[];
  onOpenRow?: (rowId: number) => void;
}

const UNSET = '__unset__';

function summaryFields(properties: NoteDatabaseProperty[], row: NoteDatabaseRow) {
  return properties
    .filter((property) => !property.isTitle)
    .map((property) => ({ property, value: row.values[property.id] }))
    .filter((entry) => entry.value !== null && entry.value !== undefined && entry.value !== '')
    .slice(0, 4);
}

// ─── Board ────────────────────────────────────────────────────

/** Groups by the first SELECT column; without one there is nothing to group by. */
export function BoardView({ properties, rows, onOpenRow, groupPropertyId }: ViewProps & { groupPropertyId?: number }) {
  const groupProperty = useMemo(() => (
    properties.find((property) => property.id === groupPropertyId && property.type === 'SELECT')
    ?? properties.find((property) => property.type === 'SELECT')
  ), [properties, groupPropertyId]);

  const columns = useMemo(() => {
    if (!groupProperty) return [];
    // `optionNames` chứ không phải `config.options` thẳng: cột STATUS lưu tuỳ
    // chọn dạng { name, group } nên duyệt thô sẽ đặt khoá cột là một object và
    // Board hiện ra một cột tên "[object Object]".
    const declared = optionNames(groupProperty);
    const seen = new Map<string, NoteDatabaseRow[]>();
    for (const option of declared) seen.set(option, []);
    for (const row of rows) {
      const raw = row.values[groupProperty.id];
      const key = raw === null || raw === undefined || raw === '' ? UNSET : String(raw);
      if (!seen.has(key)) seen.set(key, []);
      seen.get(key)!.push(row);
    }
    return [...seen.entries()].map(([key, items]) => ({ key, items }));
  }, [groupProperty, rows]);

  if (!groupProperty) {
    return (
      <p className="px-4 py-6 text-center text-sm text-slate-500">
        Bảng Kanban cần một cột kiểu “Một lựa chọn”. Thêm một cột như vậy rồi quay lại.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-min gap-3 p-3">
        {columns.map((column) => (
          <section key={column.key} className="flex w-64 shrink-0 flex-col rounded-xl bg-slate-100/70 p-2 dark:bg-white/[0.03]">
            <h4 className="mb-2 flex items-center justify-between px-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              <span className="truncate">{column.key === UNSET ? 'Chưa phân loại' : column.key}</span>
              <span className="ml-2 shrink-0 rounded-full bg-white px-1.5 text-[10px] dark:bg-white/[0.08]">{column.items.length}</span>
            </h4>
            <div className="space-y-2">
              {column.items.map((row) => (
                <button
                  key={row.id}
                  type="button"
                  onClick={() => onOpenRow?.(row.id)}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-left shadow-sm hover:border-teal-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:border-white/[0.07] dark:bg-white/[0.04]"
                >
                  <p className="truncate text-[13px] font-medium text-slate-800 dark:text-slate-200">{rowTitle(properties, row.values)}</p>
                  {summaryFields(properties, row)
                    .filter((entry) => entry.property.id !== groupProperty.id)
                    .map((entry) => (
                      <p key={entry.property.id} className="mt-1 truncate text-[11px] text-slate-500">
                        {entry.property.name}: {displayValue(entry.property, entry.value)}
                      </p>
                    ))}
                </button>
              ))}
              {column.items.length === 0 && (
                <p className="px-1 py-3 text-center text-[11px] text-slate-400">Trống</p>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

// ─── Gallery ──────────────────────────────────────────────────

export function GalleryView({ properties, rows, onOpenRow }: ViewProps) {
  if (rows.length === 0) {
    return <p className="px-4 py-6 text-center text-sm text-slate-500">Chưa có dòng nào.</p>;
  }
  return (
    <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 lg:grid-cols-3">
      {rows.map((row) => (
        <button
          key={row.id}
          type="button"
          onClick={() => onOpenRow?.(row.id)}
          className="rounded-xl border border-slate-200 bg-white p-3 text-left shadow-sm hover:border-teal-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:border-white/[0.07] dark:bg-white/[0.03]"
        >
          <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">{rowTitle(properties, row.values)}</p>
          <dl className="mt-2 space-y-0.5">
            {summaryFields(properties, row).map((entry) => (
              <div key={entry.property.id} className="flex gap-1 text-[11px]">
                <dt className="shrink-0 text-slate-400">{entry.property.name}:</dt>
                <dd className="truncate text-slate-600 dark:text-slate-300">{displayValue(entry.property, entry.value)}</dd>
              </div>
            ))}
          </dl>
        </button>
      ))}
    </div>
  );
}

// ─── Calendar ─────────────────────────────────────────────────

/** Month grid keyed off the first DATE column. */
export function CalendarView({ properties, rows, onOpenRow, month }: ViewProps & { month?: Date }) {
  const dateProperty = useMemo(
    () => properties.find((property) => property.type === 'DATE'),
    [properties],
  );

  const anchor = month ?? new Date();
  const year = anchor.getFullYear();
  const monthIndex = anchor.getMonth();

  const cells = useMemo(() => {
    if (!dateProperty) return [];
    const byDay = new Map<string, NoteDatabaseRow[]>();
    for (const row of rows) {
      const raw = row.values[dateProperty.id];
      if (!raw) continue;
      const date = new Date(String(raw));
      if (Number.isNaN(date.getTime())) continue;
      if (date.getFullYear() !== year || date.getMonth() !== monthIndex) continue;
      const key = String(date.getDate());
      if (!byDay.has(key)) byDay.set(key, []);
      byDay.get(key)!.push(row);
    }

    const first = new Date(year, monthIndex, 1);
    // Vietnamese calendars start the week on Monday.
    const leading = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const slots: Array<{ day: number | null; items: NoteDatabaseRow[] }> = [];
    for (let i = 0; i < leading; i++) slots.push({ day: null, items: [] });
    for (let day = 1; day <= daysInMonth; day++) {
      slots.push({ day, items: byDay.get(String(day)) ?? [] });
    }
    return slots;
  }, [dateProperty, rows, year, monthIndex]);

  if (!dateProperty) {
    return (
      <p className="px-4 py-6 text-center text-sm text-slate-500">
        Khung nhìn Lịch cần một cột kiểu “Ngày”. Thêm một cột như vậy rồi quay lại.
      </p>
    );
  }

  return (
    <div className="p-3">
      <p className="mb-2 text-center text-xs font-medium text-slate-600 dark:text-slate-300">
        Tháng {monthIndex + 1}/{year} · theo cột “{dateProperty.name}”
      </p>
      <div className="overflow-x-auto">
        <div className="grid min-w-[560px] grid-cols-7 gap-1">
          {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((label) => (
            <div key={label} className="py-1 text-center text-[10px] font-semibold uppercase text-slate-400">{label}</div>
          ))}
          {cells.map((cell, index) => (
            <div
              key={index}
              className={`min-h-[64px] rounded-lg border p-1 ${
                cell.day === null
                  ? 'border-transparent'
                  : 'border-slate-200 bg-white dark:border-white/[0.06] dark:bg-white/[0.02]'
              }`}
            >
              {cell.day !== null && (
                <>
                  <span className="text-[10px] font-medium text-slate-400">{cell.day}</span>
                  <div className="mt-0.5 space-y-0.5">
                    {cell.items.slice(0, 3).map((row) => (
                      <button
                        key={row.id}
                        type="button"
                        onClick={() => onOpenRow?.(row.id)}
                        title={rowTitle(properties, row.values)}
                        className="block w-full truncate rounded bg-teal-500/10 px-1 py-0.5 text-left text-[10px] text-teal-700 hover:bg-teal-500/20 dark:text-teal-300"
                      >
                        {rowTitle(properties, row.values)}
                      </button>
                    ))}
                    {cell.items.length > 3 && (
                      <span className="block px-1 text-[10px] text-slate-400">+{cell.items.length - 3} nữa</span>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
