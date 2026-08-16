/**
 * Cell value conversion for Notes Databases.
 *
 * Shared by the table grid, the row editor and the Board/Gallery/Calendar
 * views. Keeping one copy matters: if the grid and the row modal disagreed on
 * how a DATE or MULTI_SELECT round-trips, editing the same cell from two
 * places would produce two different stored shapes.
 */

import type { NoteDatabaseProperty } from '@/lib/api';

/** Human-facing rendering. Never used as input to an <input>. */
export function displayValue(property: NoteDatabaseProperty, value: unknown): string {
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

/** What the <input> should contain while editing. */
export function editableValue(property: NoteDatabaseProperty, value: unknown): string {
  if (value === null || value === undefined) return '';
  if (property.type === 'DATE') {
    const date = new Date(String(value));
    // <input type="date"> only accepts yyyy-mm-dd.
    return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
  }
  if (property.type === 'MULTI_SELECT') return Array.isArray(value) ? value.join(', ') : String(value);
  return String(value);
}

/** What the user typed, in the shape the API expects. `null` clears the cell. */
export function outboundValue(property: NoteDatabaseProperty, raw: string): unknown {
  if (property.type === 'MULTI_SELECT') {
    const picked = raw.split(',').map((part) => part.trim()).filter(Boolean);
    return picked.length > 0 ? picked : null;
  }
  return raw === '' ? null : raw;
}

/** The row's title text, used as the card label in every non-table view. */
export function rowTitle(properties: NoteDatabaseProperty[], values: Record<number, unknown>): string {
  const titleProperty = properties.find((property) => property.isTitle);
  const raw = titleProperty ? values[titleProperty.id] : null;
  const text = raw === null || raw === undefined ? '' : String(raw);
  return text || 'Không có tiêu đề';
}
