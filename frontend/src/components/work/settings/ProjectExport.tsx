'use client';

/**
 * Tab "Export" — mọi thành viên xem được dự án đều dùng được (khác tab Import
 * chỉ dành cho admin). Project Tracking theo mẫu SWP391: sheet Product (mỗi Req
 * một dòng: Screen ID, PIC, iteration, Complexity, Planned LOC, Quality, tiến độ
 * SRS/SDS/Coding/Test/Integrate, Evidence) + sheet Summary (LOC theo từng người).
 */

import { useState } from 'react';
import { toast } from 'sonner';
import { FileSpreadsheet } from 'lucide-react';
import { workApi, workError, type ProjectConfig } from '@/lib/work-api';
import { Spinner } from '../ui';
import { Section } from './shared';

function save(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

export default function ProjectExport({ config }: { config: ProjectConfig; slug: string }) {
  const [busy, setBusy] = useState(false);
  const names = config.customFields.map((f) => f.name.toLowerCase());
  const missing = ['Screen ID', 'Planned LOC', 'Quality'].filter((n) => !names.includes(n.toLowerCase()));

  const run = async () => {
    setBusy(true);
    try {
      const { blob, fileName } = await workApi.exportProjectTracking(config.id);
      save(blob, fileName);
      toast.success('Project Tracking downloaded');
    } catch (err) {
      toast.error(workError(err, 'Could not export Project Tracking'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Section
        title="Project Tracking (SWP391)"
        description="The Excel file your lecturer asks for each iteration, built from this board — no more copying by hand."
      >
        <div className="max-w-[640px] space-y-3 text-[13px] text-[var(--w-text-2)]">
          <ul className="list-disc space-y-1 pl-5">
            <li><span className="font-medium text-[var(--w-text)]">Product</span> — one row per requirement (issues labelled <code className="rounded bg-[var(--w-sunken)] px-1 font-mono text-[12px]">Req</code> or with a Screen ID): PIC, iteration, Complexity, Planned LOC, Quality, Graded LOC, status, progress of SRS · SDS · Coding · Test · Integrate, Evidence.</li>
            <li><span className="font-medium text-[var(--w-text)]">Summary</span> — per person: requirements, done, planned LOC per iteration, graded LOC, and how many reached Quality L2 or better.</li>
          </ul>
          {missing.length > 0 && (
            <p className="rounded-[6px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-3 py-2 text-[12.5px]">
              This project has no {missing.join(', ')} field yet — those columns will be empty. Add them in Settings → Fields (names must match).
            </p>
          )}
          <button type="button" className="w-btn w-btn-primary" onClick={run} disabled={busy}>
            {busy ? <Spinner size={12} /> : <FileSpreadsheet size={14} />} Download Project Tracking (.xlsx)
          </button>
          <p className="text-[12px] text-[var(--w-text-3)]">Rename it to {'{Class}_{Group}_{System}_ProjectTracking.xlsx'} before you submit. For a plain list of issues, use Export on the Issues page.</p>
        </div>
      </Section>
    </>
  );
}
