/**
 * toCsv — convert a list of records to a CSV string.
 *
 * Why not use papaparse or a similar lib? The export
 * shape is simple (one record per row, no nested
 * objects, ~20 fields) and we only ever export on
 * user click. Hand-rolling CSV is ~30 lines and
 * avoids another dependency.
 *
 * CSV rules we obey:
 * 1. Fields containing `,`, `"`, or `\n` are quoted
 * and have `"` doubled.
 * 2. Line separator is CRLF (RFC 4180) so the file
 * opens cleanly in Excel and Google Sheets.
 * 3. Empty / null / undefined values become an empty
 * string.
 * 4. Booleans render as `true` / `false`.
 * 5. Arrays (e.g. `tags`) render as `"a, b, c"`.
 * 6. We always include a UTF-8 BOM at the top so
 * Excel on Windows reads Vietnamese characters
 * correctly.
 */

export type CsvCell = string | number | boolean | null | undefined;

export interface CsvColumn<T> {
 /** Header text (the first row). */
 label: string;
 /** Cell extractor. */
 value: (row: T) => CsvCell | CsvCell[];
}

function escapeCell(v: CsvCell | CsvCell[]): string {
 if (v == null) return '';
 const s = Array.isArray(v) ? v.join(', ') : String(v);
 // RFC 4180: quote if it contains comma, double-quote,
 // CR, or LF. Inside a quoted field, double-quotes
 // are escaped by doubling them.
 if (/[",\r\n]/.test(s)) {
 return `"${s.replace(/"/g, '""')}"`;
 }
 return s;
}

export function toCsv<T>(rows: T[], columns: CsvColumn<T>[]): string {
 const header = columns.map((c) => escapeCell(c.label)).join(',');
 const body = rows
 .map((row) =>
 columns.map((c) => escapeCell(c.value(row))).join(','),
 )
 .join('\r\n');
 return '\uFEFF' + header + '\r\n' + body;
}

/**
 * downloadCsv — create a Blob from the CSV string and
 * trigger a browser download.
 */
export function downloadCsv(filename: string, csv: string): void {
 const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
 const url = URL.createObjectURL(blob);
 const a = document.createElement('a');
 a.href = url;
 a.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
 document.body.appendChild(a);
 a.click();
 document.body.removeChild(a);
 // Revoke after a tick so the click handler can finish.
 setTimeout(() => URL.revokeObjectURL(url), 0);
}
