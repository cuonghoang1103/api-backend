'use client';

/**
 * CT Work 27/10/2026 — thẻ "GitHub App CT Work" ở Cài đặt dự án → GitHub: trạng thái kết nối (app / token chỉ đọc /
 * công khai), nút cài (link GitHub kèm state ký), đổi repo, ngắt app. PAT + webhook dán tay bên dưới vẫn là dự phòng.
 */

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ExternalLink, Github, Unplug } from 'lucide-react';
import { workError, type ProjectConfig } from '@/lib/work-api';
import { githubAppApi } from '@/lib/work-github-app-api';
import { Spinner } from '../ui';
import { wt } from '@/components/work/i18n';

export default function GithubAppCard({ config }: { config: ProjectConfig }) {
  const pid = config.id;
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ['work', 'project', pid, 'github-app'], queryFn: () => githubAppApi.project(pid), retry: false });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const d = q.data;
  if (!d) return null;
  const mode = wt(`code.mode${d.mode === 'app' ? 'App' : d.mode === 'pat' ? 'Pat' : d.mode === 'anonymous' ? 'Anonymous' : 'None'}` as 'code.modeApp');

  const unlink = async () => {
    setBusy(true); setError(null);
    try { await githubAppApi.unlink(pid); await q.refetch(); void qc.invalidateQueries({ queryKey: ['work', 'project', pid] }); } catch (err) { setError(workError(err)); } finally { setBusy(false); }
  };

  return (
    <section className="w-card overflow-hidden" aria-label={wt('code.appTitle')}>
      <div className="flex flex-wrap items-center gap-3 border-b border-[var(--w-border)] px-5 py-4">
        <Github size={20} aria-hidden="true" />
        <h2 className="text-[15px] font-semibold">{wt('code.appTitle')}</h2>
        <span className="rounded-full bg-[var(--w-sunken)] px-2 py-0.5 text-[12px] text-[var(--w-text-2)]">{wt('code.appMode', { mode })}</span>
      </div>
      <div className="space-y-3 px-5 py-4 text-[13px]">
        <p className="text-[var(--w-text-2)]">{wt('code.appHint')}</p>
        {!d.appConfigured ? (
          <p className="text-[var(--w-text-2)]">{wt('code.appNotReady')}</p>
        ) : (
          <>
            {d.linked && (
              <p className="font-medium">
                {wt('code.appLinked', { repo: d.linked.repoFullName ?? '?' })}
                {d.linked.suspended && <span className="ml-2 text-[var(--w-yellow-text)]">· {wt('code.appSuspended')}</span>}
              </p>
            )}
            {d.canManage && (
              <div className="flex flex-wrap items-center gap-2">
                {d.installUrl && (
                  <a href={d.installUrl} className="w-btn w-btn-primary"><ExternalLink size={13} /> {d.linked ? wt('code.appReinstall') : wt('code.appInstall')}</a>
                )}
                {d.linked && <button type="button" className="w-btn w-btn-danger" onClick={unlink} disabled={busy}>{busy ? <Spinner size={11} /> : <Unplug size={13} />} {wt('code.appUnlink')}</button>}
              </div>
            )}
          </>
        )}
        {error && <p className="text-[var(--w-red-text)]" role="alert">{error}</p>}
      </div>
    </section>
  );
}
