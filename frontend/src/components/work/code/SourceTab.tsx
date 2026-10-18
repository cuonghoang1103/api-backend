'use client';

/**
 * Tab "Mã nguồn": cây thư mục + xem tệp (tô màu, số dòng) + lịch sử commit + diff một commit — qua proxy của CT Work
 * (GitHub/GitLab API; repo private cần token chỉ đọc do ADMIN dán ở Cài đặt). Tệp > 1 MB / nhị phân: báo không xem được.
 */

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, ExternalLink, File, FileCode, Folder, GitBranch, History, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workError } from '@/lib/work-api';
import { Spinner } from '../ui';
import { Select } from '../settings/shared';
import { wt, wfmt } from '../i18n';
import { codeApi, codeKeys, type CommitDetail } from './codeApi';
import { CodeBlock, DiffView } from './CodeBlock';
import { IssueChips, LineDelta, ProviderIcon, Sha, WhoChip } from './parts';
import { languageOf, safeHref, sizeLabel } from './codeText';

const errCode = (e: unknown): string | null => (e as { response?: { data?: { code?: string } } })?.response?.data?.code ?? null;

function SourceError({ error, settingsHref, canManage }: { error: unknown; settingsHref: string; canManage: boolean }) {
  const code = errCode(error);
  if (code === 'WORK_GIT_PRIVATE' || code === 'WORK_GIT_TOKEN_INVALID') {
    return (
      <div className="rounded-[10px] border border-[var(--w-border)] bg-[var(--w-raised)] px-6 py-8 text-center">
        <Lock size={22} className="mx-auto text-[var(--w-text-3)]" aria-hidden="true" />
        <p className="mt-2 text-[14px] font-medium">{code === 'WORK_GIT_PRIVATE' ? wt('code.privateTitle') : wt('code.tokenBadTitle')}</p>
        <p className="mx-auto mt-1 max-w-[520px] text-[13px] text-[var(--w-text-2)]">{canManage ? wt('code.privateAdmin') : wt('code.privateMember')}</p>
        {canManage && <Link href={settingsHref} className="w-btn w-btn-primary mt-4 inline-flex">{wt('code.addToken')}</Link>}
      </div>
    );
  }
  return <p className="text-[13px] text-[var(--w-red-text)]">{workError(error, wt('code.loadFailed'))}</p>;
}

function CommitView({ pid, sha, onBack, onIssue, projectKey, onPath }: { pid: number; sha: string; onBack: () => void; onIssue: (n: number) => void; projectKey: string; onPath: (p: string) => void }) {
  const q = useQuery({ queryKey: codeKeys.commit(pid, sha), queryFn: () => codeApi.commit(pid, sha), staleTime: 3_600_000, retry: false });
  const c: CommitDetail | undefined = q.data;
  return (
    <div className="space-y-3">
      <button type="button" className="w-btn w-btn-sm" onClick={onBack}><ArrowLeft size={13} /> {wt('code.back')}</button>
      {q.isLoading ? <div className="flex justify-center py-12"><Spinner /></div> : q.isError || !c ? <p className="text-[13px] text-[var(--w-red-text)]">{workError(q.error, wt('code.loadFailed'))}</p> : (
        <>
          <div className="rounded-[10px] border border-[var(--w-border)] bg-[var(--w-raised)] p-4">
            <h2 className="whitespace-pre-wrap break-words text-[15px] font-semibold">{c.message.split('\n')[0]}</h2>
            {c.message.includes('\n') && <pre className="mt-2 whitespace-pre-wrap break-words font-sans text-[13px] text-[var(--w-text-2)]">{c.message.split('\n').slice(1).join('\n').trim()}</pre>}
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[12.5px] text-[var(--w-text-2)]">
              <WhoChip who={c.author} size={20} />
              {c.at && <span title={wfmt.dateTime(c.at)}>{wt('code.committedAgo', { t: wfmt.relative(c.at) })}</span>}
              <Sha sha={c.sha} href={c.url} />
              {c.parents[0] && <span className="text-[var(--w-text-3)]">{wt('code.parent')} <span className="font-mono">{c.parents[0].slice(0, 7)}</span></span>}
              <IssueChips nums={Object.keys(c.issues).map(Number)} refs={c.issues} projectKey={projectKey} onOpen={onIssue} />
              <span className="ml-auto inline-flex items-center gap-2">
                <span>{wt('code.nFilesChanged', { count: c.stats.files })}</span>
                <LineDelta add={c.stats.additions} del={c.stats.deletions} />
              </span>
            </div>
          </div>
          {c.truncated && <p className="text-[12.5px] text-[var(--w-yellow-text)]">{wt('code.diffTruncated')}</p>}
          {c.files.map((f) => (
            <details key={f.filename} open={c.files.length <= 25} className="overflow-hidden rounded-[10px] border border-[var(--w-border)] bg-[var(--w-raised)]">
              <summary className="flex cursor-pointer flex-wrap items-center gap-2 border-b border-[var(--w-border)] px-3 py-2 text-[12.5px]">
                <span className={cn('rounded-[4px] px-1.5 text-[11px] font-semibold uppercase',
                  f.status === 'added' ? 'bg-[color-mix(in_srgb,var(--w-green)_14%,transparent)] text-[var(--w-green-text)]'
                    : f.status === 'removed' ? 'bg-[color-mix(in_srgb,var(--w-red)_12%,transparent)] text-[var(--w-red-text)]'
                      : 'bg-[var(--w-sunken)] text-[var(--w-text-2)]')}>{f.status}</span>
                <button type="button" className="min-w-0 truncate font-mono text-[12.5px] hover:underline" onClick={(e) => { e.preventDefault(); if (f.status !== 'removed') onPath(f.filename); }}>
                  {f.previous ? `${f.previous} → ${f.filename}` : f.filename}
                </button>
                <span className="ml-auto"><LineDelta add={f.additions} del={f.deletions} /></span>
              </summary>
              {f.patch ? <DiffView patch={f.patch} /> : <p className="px-3 py-3 text-[12.5px] text-[var(--w-text-3)]">{f.truncated ? wt('code.diffTooBig') : wt('code.noDiff')}</p>}
            </details>
          ))}
        </>
      )}
    </div>
  );
}

export default function SourceTab({ pid, projectKey, refName, path, commit, history, settingsHref, canManage, onNav, onIssue }: {
  pid: number; projectKey: string; refName: string | null; path: string; commit: string | null; history: boolean; settingsHref: string; canManage: boolean;
  onNav: (patch: { ref?: string | null; path?: string | null; commit?: string | null; history?: boolean }) => void; onIssue: (n: number) => void;
}) {
  const meta = useQuery({ queryKey: codeKeys.meta(pid), queryFn: () => codeApi.meta(pid), staleTime: 300_000, retry: false });
  const ref = refName ?? meta.data?.defaultBranch ?? null;
  const refs = useQuery({ queryKey: codeKeys.refs(pid), queryFn: () => codeApi.refs(pid), staleTime: 60_000, retry: false, enabled: !!meta.data });
  // Đường dẫn là tệp hay thư mục: thử cây trước; lỗi "không phải thư mục" ⇒ là tệp.
  const tree = useQuery({
    queryKey: codeKeys.tree(pid, ref ?? '', path), queryFn: () => codeApi.tree(pid, { ref: ref!, path }), staleTime: 60_000, retry: false,
    enabled: !!ref && !commit && !history,
  });
  const isFile = tree.isError && errCode(tree.error) === 'WORK_GIT_NOT_DIR';
  const blob = useQuery({ queryKey: codeKeys.blob(pid, ref ?? '', path), queryFn: () => codeApi.blob(pid, { ref: ref!, path }), staleTime: 60_000, retry: false, enabled: !!ref && isFile && !commit });
  const commits = useQuery({ queryKey: codeKeys.commits(pid, ref ?? '', path), queryFn: () => codeApi.commits(pid, { ref: ref!, path }), staleTime: 60_000, retry: false, enabled: !!ref && history && !commit });

  const crumbs = useMemo(() => (path ? path.split('/') : []), [path]);
  const refOptions = useMemo(() => {
    const names = (refs.data ?? []).map((r) => r.name);
    if (ref && !names.includes(ref)) names.unshift(ref);
    return names;
  }, [refs.data, ref]);

  if (meta.isLoading) return <div className="flex justify-center py-12"><Spinner /></div>;
  if (meta.isError || !meta.data) return <SourceError error={meta.error} settingsHref={settingsHref} canManage={canManage} />;
  if (commit) return <CommitView pid={pid} sha={commit} projectKey={projectKey} onIssue={onIssue} onBack={() => onNav({ commit: null })} onPath={(p) => onNav({ commit: null, path: p, ref: commit })} />;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold">
          <ProviderIcon provider={meta.data.provider} />
          <a href={safeHref(meta.data.webUrl)} target="_blank" rel="noopener noreferrer" className="hover:underline">{meta.data.repo}</a>
          {meta.data.private && <span className="inline-flex items-center gap-1 rounded-full border border-[var(--w-border-strong)] px-1.5 text-[11px] font-medium text-[var(--w-text-2)]"><Lock size={10} /> {wt('code.private')}</span>}
        </span>
        <span className="inline-flex items-center gap-1">
          <GitBranch size={13} className="text-[var(--w-text-3)]" aria-hidden="true" />
          <Select aria-label={wt('code.branch')} value={ref ?? ''} onChange={(e) => onNav({ ref: e.target.value, commit: null })} className="!h-8 w-[200px] font-mono !text-[12.5px]">
            {refOptions.map((n) => <option key={n} value={n}>{n}</option>)}
          </Select>
        </span>
        <nav aria-label={wt('code.path')} className="flex min-w-0 flex-wrap items-center gap-0.5 font-mono text-[13px]">
          <button type="button" className="rounded px-1 font-semibold text-[var(--w-accent-text)] hover:underline" onClick={() => onNav({ path: null, history: false })}>{meta.data.repo.split('/').pop()}</button>
          {crumbs.map((c, i) => (
            <span key={i} className="inline-flex items-center gap-0.5">
              <ChevronRight size={12} className="text-[var(--w-text-3)]" aria-hidden="true" />
              {i === crumbs.length - 1 ? <span className="px-1 font-semibold">{c}</span> : (
                <button type="button" className="rounded px-1 text-[var(--w-accent-text)] hover:underline" onClick={() => onNav({ path: crumbs.slice(0, i + 1).join('/'), history: false })}>{c}</button>
              )}
            </span>
          ))}
        </nav>
        <button type="button" className={cn('w-btn w-btn-sm ml-auto', history && '!border-[var(--w-accent-border)] !bg-[var(--w-accent-soft)]')} onClick={() => onNav({ history: !history })} aria-pressed={history}>
          <History size={13} /> {wt('code.history')}
        </button>
      </div>

      {history ? (
        commits.isLoading ? <div className="flex justify-center py-12"><Spinner /></div> : commits.isError ? <SourceError error={commits.error} settingsHref={settingsHref} canManage={canManage} /> : (
          <ul className="overflow-hidden rounded-[10px] border border-[var(--w-border)] bg-[var(--w-raised)]">
            {(commits.data?.items ?? []).map((c) => (
              <li key={c.sha} className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-[var(--w-border)] px-3 py-2.5 last:border-b-0 hover:bg-[var(--w-hover)]">
                <button type="button" className="min-w-0 flex-1 truncate text-left text-[13px] font-medium hover:underline" onClick={() => onNav({ commit: c.sha })} title={c.message}>{c.message.split('\n')[0]}</button>
                <WhoChip who={c.author} size={18} muted className="max-w-[180px] text-[12px]" />
                {c.at && <span className="text-[12px] text-[var(--w-text-3)]" title={wfmt.dateTime(c.at)}>{wfmt.relative(c.at)}</span>}
                <Sha sha={c.sha} onClick={() => onNav({ commit: c.sha })} />
              </li>
            ))}
            {!commits.data?.items.length && <li className="px-3 py-6 text-center text-[13px] text-[var(--w-text-3)]">{wt('code.noCommits')}</li>}
          </ul>
        )
      ) : isFile ? (
        blob.isLoading ? <div className="flex justify-center py-12"><Spinner /></div> : blob.isError || !blob.data ? <SourceError error={blob.error} settingsHref={settingsHref} canManage={canManage} /> : (
          <div className="overflow-hidden rounded-[10px] border border-[var(--w-border)] bg-[var(--w-raised)]">
            <div className="flex flex-wrap items-center gap-2 border-b border-[var(--w-border)] px-3 py-2 text-[12.5px] text-[var(--w-text-2)]">
              <FileCode size={14} aria-hidden="true" />
              <span className="font-mono font-medium text-[var(--w-text)]">{blob.data.path.split('/').pop()}</span>
              <span>{sizeLabel(blob.data.size)}</span>
              {blob.data.content !== null && <span>· {wt('code.nLines', { count: blob.data.content.replace(/\n$/, '').split('\n').length })}</span>}
              {languageOf(blob.data.path) && <span className="rounded bg-[var(--w-sunken)] px-1.5 text-[11px]">{languageOf(blob.data.path)}</span>}
              <a href={safeHref(blob.data.webUrl)} target="_blank" rel="noopener noreferrer" className="ml-auto inline-flex items-center gap-1 hover:text-[var(--w-accent-text)]"><ExternalLink size={12} /> {meta.data.provider === 'GITLAB' ? 'GitLab' : 'GitHub'}</a>
            </div>
            {blob.data.tooLarge ? (
              <p className="px-4 py-8 text-center text-[13px] text-[var(--w-text-2)]">{wt('code.tooLarge', { s: sizeLabel(blob.data.size) })}</p>
            ) : blob.data.binary ? (
              <p className="px-4 py-8 text-center text-[13px] text-[var(--w-text-2)]">{wt('code.binary')}</p>
            ) : (
              <CodeBlock path={blob.data.path} content={blob.data.content ?? ''} />
            )}
          </div>
        )
      ) : tree.isLoading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : tree.isError ? (
        <SourceError error={tree.error} settingsHref={settingsHref} canManage={canManage} />
      ) : (
        <ul className="overflow-hidden rounded-[10px] border border-[var(--w-border)] bg-[var(--w-raised)]">
          {path && (
            <li className="border-b border-[var(--w-border)]">
              <button type="button" className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] text-[var(--w-text-2)] hover:bg-[var(--w-hover)]" onClick={() => onNav({ path: crumbs.slice(0, -1).join('/') || null })}>
                <Folder size={15} className="text-[var(--w-text-3)]" aria-hidden="true" /> ..
              </button>
            </li>
          )}
          {(tree.data?.entries ?? []).map((e) => (
            <li key={e.path} className="border-b border-[var(--w-border)] last:border-b-0">
              <button
                type="button"
                disabled={e.type === 'submodule'}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] hover:bg-[var(--w-hover)] disabled:cursor-default disabled:opacity-70"
                onClick={() => onNav({ path: e.path })}
              >
                {e.type === 'dir' ? <Folder size={15} className="shrink-0 text-[var(--w-blue)]" aria-hidden="true" /> : <File size={15} className="shrink-0 text-[var(--w-text-3)]" aria-hidden="true" />}
                <span className="min-w-0 flex-1 truncate font-mono text-[12.5px]">{e.name}</span>
                {e.type === 'submodule' && <span className="text-[11px] text-[var(--w-text-3)]">submodule</span>}
                {e.type === 'file' && e.size !== null && <span className="shrink-0 text-[12px] tabular-nums text-[var(--w-text-3)]">{sizeLabel(e.size)}</span>}
              </button>
            </li>
          ))}
          {!tree.data?.entries.length && <li className="px-3 py-6 text-center text-[13px] text-[var(--w-text-3)]">{wt('code.emptyFolder')}</li>}
        </ul>
      )}
    </div>
  );
}
