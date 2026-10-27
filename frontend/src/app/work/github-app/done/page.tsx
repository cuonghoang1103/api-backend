'use client';

/**
 * CT Work 27/10/2026 — trang GitHub đưa về sau khi cài GitHub App CT Work (backend /github-app/setup đã xác minh người cài
 * và cấp vé ký 30 phút). `?p=<projectId>&ticket=…` ⇒ chọn repo ⇒ nối. `?error=…` ⇒ báo lỗi + quay lại cài đặt.
 */

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { workApi, workError } from '@/lib/work-api';
import { githubAppApi } from '@/lib/work-github-app-api';
import { PageLoading, Spinner } from '@/components/work/ui';
import { wt } from '@/components/work/i18n';

function Done() {
  const search = useSearchParams();
  const router = useRouter();
  const pid = Number(search?.get('p')) || null;
  const ticket = search?.get('ticket') ?? null;
  const code = search?.get('error') ?? null;
  const [repos, setRepos] = useState<Array<{ id: number; fullName: string; private: boolean }> | null>(null);
  const [settings, setSettings] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(code ? wt('code.appErr', { code }) : null);
  const [busy, setBusy] = useState<number | null>(null);

  useEffect(() => {
    if (!pid) return;
    workApi.project(pid).then((c) => setSettings(`/work/${c.workspace.slug}/${c.key}/settings?tab=github`)).catch(() => undefined);
    if (!ticket) return;
    githubAppApi.repos(pid, ticket).then((r) => setRepos(r.repos)).catch((err) => setError(workError(err)));
  }, [pid, ticket]);

  const pick = async (id: number) => {
    if (!pid || !ticket) return;
    setBusy(id);
    try {
      await githubAppApi.link(pid, ticket, id);
      if (settings) router.replace(settings);
    } catch (err) {
      setError(workError(err));
      setBusy(null);
    }
  };

  return (
    <div className="mx-auto max-w-[560px] p-6">
      <div className="w-card space-y-3 p-5">
        <h1 className="text-[16px] font-semibold">{wt('code.appPickTitle')}</h1>
        {error && <p className="text-[13px] text-[var(--w-red-text)]" role="alert">{error}</p>}
        {!error && ticket && !repos && <div className="flex justify-center py-6"><Spinner /></div>}
        {repos && (
          <ul className="divide-y divide-[var(--w-border)] rounded-[8px] border border-[var(--w-border)]">
            {repos.map((r) => (
              <li key={r.id} className="flex items-center gap-2 px-3 py-2 text-[13px]">
                <span className="min-w-0 flex-1 truncate font-mono">{r.fullName}</span>
                {r.private && <span className="text-[11.5px] text-[var(--w-text-3)]">private</span>}
                <button type="button" className="w-btn w-btn-primary h-7 px-2.5 text-[12px]" disabled={busy !== null} onClick={() => pick(r.id)}>{busy === r.id ? <Spinner size={10} /> : null}{wt('code.appPick')}</button>
              </li>
            ))}
          </ul>
        )}
        {settings && <a href={settings} className="inline-block text-[13px] text-[var(--w-accent-text)] hover:underline">{wt('code.appBack')}</a>}
      </div>
    </div>
  );
}

export default function GithubAppDonePage() {
  return <Suspense fallback={<PageLoading />}><Done /></Suspense>;
}
