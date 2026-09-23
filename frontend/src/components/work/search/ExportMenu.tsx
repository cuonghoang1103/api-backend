'use client';

/**
 * Nút "Export" ở danh sách thẻ: xuất ĐÚNG bộ lọc đang xem (JQL) ra CSV,
 * Excel hoặc PDF. Tải bằng object URL + thẻ <a download> tạm.
 */

import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { ChevronDown, Download, FileSpreadsheet, FileText, Sheet } from 'lucide-react';
import { workApi, workError } from '@/lib/work-api';
import { Popover, Spinner, useToggle } from '../ui';

type Format = 'csv' | 'xlsx' | 'pdf';

const FORMATS: Array<{ key: Format; label: string; hint: string; Icon: typeof FileText }> = [
  { key: 'csv', label: 'CSV', hint: 'Re-importable, Jira-compatible columns', Icon: Sheet },
  { key: 'xlsx', label: 'Excel (.xlsx)', hint: 'Spreadsheet with all fields', Icon: FileSpreadsheet },
  { key: 'pdf', label: 'PDF', hint: 'Printable summary table', Icon: FileText },
];

/** Lỗi của responseType 'blob' là một Blob — đọc JSON bên trong để lấy thông điệp. */
async function blobError(err: unknown): Promise<string> {
  const data = (err as { response?: { data?: unknown } })?.response?.data;
  if (data instanceof Blob) {
    try {
      const j = JSON.parse(await data.text()) as { error?: string; message?: string };
      if (j.error || j.message) return (j.error || j.message)!;
    } catch { /* không phải JSON */ }
  }
  return workError(err, 'Could not export the issues');
}

export default function ExportMenu({ pid, getJql }: { pid: number; getJql: () => string }) {
  const pop = useToggle();
  const btnRef = useRef<HTMLButtonElement>(null);
  const [busy, setBusy] = useState<Format | null>(null);

  const run = async (format: Format) => {
    pop.close();
    setBusy(format);
    try {
      const { blob, fileName } = await workApi.exportIssues(pid, format, getJql());
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      toast.error(await blobError(err));
    } finally {
      setBusy(null);
    }
  };

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={pop.toggle}
        disabled={!!busy}
        className="w-btn w-btn-sm gap-1"
        aria-haspopup="menu"
        aria-expanded={pop.on}
        title="Export the issues matching the current filter"
      >
        {busy ? <Spinner size={12} /> : <Download size={13} />}
        <span className="max-sm:!hidden">{busy ? 'Exporting…' : 'Export'}</span>
        <ChevronDown size={12} className="opacity-60" />
      </button>
      <Popover open={pop.on} onClose={pop.close} anchorRef={btnRef} width={260} align="end">
        <div className="p-1" role="menu">
          <div className="px-2 pb-1 pt-1.5 text-[11px] font-medium uppercase tracking-wide text-[var(--w-text-3)]">Export current filter</div>
          {FORMATS.map(({ key, label, hint, Icon }) => (
            <button
              key={key}
              type="button"
              role="menuitem"
              onClick={() => void run(key)}
              className="flex w-full items-start gap-2 rounded-[5px] px-2 py-1.5 text-left hover:bg-[var(--w-hover)]"
            >
              <Icon size={14} className="mt-0.5 shrink-0 text-[var(--w-text-3)]" />
              <span className="min-w-0">
                <span className="block text-[13px]">{label}</span>
                <span className="block text-[11.5px] text-[var(--w-text-3)]">{hint}</span>
              </span>
            </button>
          ))}
        </div>
      </Popover>
    </>
  );
}
