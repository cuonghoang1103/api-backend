'use client';

/**
 * wt('res.webLinks') trong chi tiết thẻ (Resources, 06/10/2026 — kiểu Jira): link ngoài gắn vào thẻ, chọn từ thư viện
 * Resources của dự án hoặc dán URL + tiêu đề; link dán thẳng có nút "Save to Resources". Chỉ hiện khi mô-đun
 * resources bật và người xem không phải khách bị cách ly (khách: tuyến bị chặn ở server).
 */

import { useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { BookmarkPlus, Globe, Library, Plus, X } from 'lucide-react';
import { workError, type ProjectConfig } from '@/lib/work-api';
import { openResourceLink, resApi, resKeys } from '@/lib/work-resources-api';
import { Dialog, Field, PickerList, Popover, Spinner } from '../ui';
import { studioOn } from '../studio/shared';
import { Favicon } from './shared';
import { wt } from '@/components/work/i18n';

export function IssueWebLinks({ config, issueNumber }: { config: ProjectConfig; issueNumber: number }) {
  const on = studioOn(config, 'resources') && !config.clientView;
  return on ? <Inner config={config} issueNumber={issueNumber} /> : null;
}

function Inner({ config, issueNumber }: { config: ProjectConfig; issueNumber: number }) {
  const pid = config.id;
  const qc = useQueryClient();
  const pickRef = useRef<HTMLButtonElement>(null);
  const [picking, setPicking] = useState(false);
  const [typing, setTyping] = useState(false);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const key = resKeys.webLinks(pid, issueNumber);
  const q = useQuery({ queryKey: key, queryFn: () => resApi.webLinks(pid, issueNumber), retry: false });
  const lib = useQuery({ queryKey: resKeys.list(pid, {}), queryFn: () => resApi.list(pid, {}), enabled: picking, staleTime: 30_000 });
  const done = (d: { items: unknown[] }) => { qc.setQueryData(key, d); qc.invalidateQueries({ queryKey: resKeys.all(pid) }); };
  const add = useMutation({
    mutationFn: (body: { resourceId?: number; url?: string; title?: string | null }) => resApi.addWebLink(pid, issueNumber, body),
    onSuccess: (d) => { done(d); setTyping(false); setUrl(''); setTitle(''); },
    onError: (e) => toast.error(workError(e)),
  });
  const del = useMutation({ mutationFn: (lid: number) => resApi.deleteWebLink(pid, issueNumber, lid), onSuccess: done, onError: (e) => toast.error(workError(e)) });
  const save = useMutation({
    mutationFn: (lid: number) => resApi.saveWebLink(pid, issueNumber, lid),
    onSuccess: () => { toast.success(wt('res.savedToRes')); qc.invalidateQueries({ queryKey: resKeys.all(pid) }); },
    onError: (e) => toast.error(workError(e)),
  });

  if (q.error || !q.data) return null;
  const items = q.data.items;
  const canEdit = q.data.canEdit;
  if (!items.length && !canEdit) return null;
  const linked = new Set(items.map((i) => i.resourceId).filter(Boolean));

  return (
    <section data-testid="issue-web-links">
      <div className="mb-2 flex items-center gap-1">
        <h3 className="w-section-title">{wt('res.webLinks')}</h3>
        {canEdit && (
          <div className="ml-auto flex items-center gap-1">
            <button ref={pickRef} type="button" className="w-btn w-btn-ghost w-btn-sm" onClick={() => setPicking(true)}><Library size={13} /> {wt('res.fromRes')}</button>
            <button type="button" className="w-btn w-btn-ghost w-btn-sm" onClick={() => setTyping(true)}><Plus size={13} /> {wt('res.addUrl')}</button>
          </div>
        )}
      </div>
      {items.length ? (
        <ul className="overflow-hidden rounded-[6px] border border-[var(--w-border)]">
          {items.map((l) => (
            <li key={l.id} className="group flex min-w-0 items-center gap-2 border-b border-[var(--w-border)] px-2.5 py-1.5 last:border-b-0 hover:bg-[var(--w-hover)]">
              <Favicon r={l} size={14} />
              <a href={l.url} target="_blank" rel="noopener noreferrer" className="min-w-0 flex-1 truncate text-[13px] hover:underline" title={l.url}
                onClick={(e) => { if (l.resourceId) { e.preventDefault(); openResourceLink(pid, { id: l.resourceId, url: l.url }); } }}>
                {l.title}
              </a>
              {l.inResources ? <span title={wt('res.inRes')}><Library size={12} className="shrink-0 text-[var(--w-text-3)]" /></span>
                : canEdit && (
                  <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm opacity-0 focus:opacity-100 group-hover:opacity-100 max-md:opacity-100" aria-label={wt('res.saveTToRes', { t: l.title })} title={wt('res.saveToRes')}
                    disabled={save.isPending} onClick={() => save.mutate(l.id)}><BookmarkPlus size={12} /></button>
                )}
              {l.canDelete && (
                <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm opacity-0 focus:opacity-100 group-hover:opacity-100 max-md:opacity-100" aria-label={wt('res.removeT', { t: l.title })} onClick={() => del.mutate(l.id)}>
                  <X size={12} />
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[12px] text-[var(--w-text-3)]">{wt('res.linkRepo')}</p>
      )}
      <Popover open={picking} onClose={() => setPicking(false)} anchorRef={pickRef} width={340} align="end">
        <PickerList
          options={(lib.data?.items ?? []).filter((r) => !linked.has(r.id)).map((r) => ({
            value: r.id, label: r.title, keywords: `${r.url} ${r.tags.join(' ')} ${r.groupName ?? ''}`, icon: <Favicon r={r} size={13} />,
          }))}
          selected={[]}
          onPick={(id) => { add.mutate({ resourceId: id }); setPicking(false); }}
          placeholder={wt('res.findRes')}
          empty={lib.isLoading ? wt('common.loading') : wt('res.noResFound')}
        />
      </Popover>
      <Dialog open={typing} onClose={() => setTyping(false)} title={wt('res.addWebLink')} width={460}
        footer={(
          <>
            <button type="button" className="w-btn" onClick={() => setTyping(false)}>{wt('common.cancel')}</button>
            <button type="button" className="w-btn w-btn-primary" disabled={!url.trim() || add.isPending} onClick={() => add.mutate({ url: url.trim(), title: title.trim() || null })}>
              {add.isPending && <Spinner size={12} />}{wt('res.addLink')}
            </button>
          </>
        )}
      >
        <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); if (url.trim()) add.mutate({ url: url.trim(), title: title.trim() || null }); }}>
          <Field label="URL"><input className="w-input" value={url} autoFocus onChange={(e) => setUrl(e.target.value)} placeholder="https://…" /></Field>
          <Field label={wt('res.linkText')} hint={wt('res.linkTextHint')}><input className="w-input" value={title} maxLength={200} onChange={(e) => setTitle(e.target.value)} /></Field>
          <p className="flex items-center gap-1.5 text-[12px] text-[var(--w-text-3)]"><Globe size={12} /> {wt('res.autoLinked')}</p>
          <button type="submit" hidden />
        </form>
      </Dialog>
    </section>
  );
}
