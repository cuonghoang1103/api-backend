'use client';

/**
 * CTW đợt 7b (C21) — Knowledge base:
 *   KbView      trang đội dự án /work/<ws>/<KEY>/kb — chuyên mục, thêm trang Docs làm bài, đối tượng (khách/nội bộ), số liệu.
 *   KbHelpTab   tab "Help center" trong cổng khách — tìm, đọc, "Hữu ích?" (xem trước như khách = chỉ đọc).
 *   KbSuggest   gợi ý bài khi khách gõ yêu cầu (deflection) — "Bài này giải quyết được" ⇒ đóng form, đếm deflection.
 */

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ArrowLeft, BookOpen, Lightbulb, Plus, Search, ThumbsDown, ThumbsUp, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workError } from '@/lib/work-api';
import { workKbApi, type KbArticle } from '@/lib/work-ctw7b-api';
import { RichView } from '../RichEditor';
import { EmptyState, PageLoading, Spinner } from '../ui';
import KpiTile, { KpiRow } from '../KpiTile';
import { useWT } from '../i18n';

const kk = { ov: (pid: number) => ['c7b-kb', pid] as const, browse: (pid: number, q: string, c: number | null, a: boolean) => ['c7b-kb-browse', pid, q, c, a] as const };

export default function KbView({ pid, docsHref }: { pid: number; docsHref: string }) {
  const { t } = useWT();
  const qc = useQueryClient();
  const q = useQuery({ queryKey: kk.ov(pid), queryFn: () => workKbApi.overview(pid) });
  const refresh = () => qc.invalidateQueries({ queryKey: kk.ov(pid) });
  const [catName, setCatName] = useState('');
  const [page, setPage] = useState('');
  const [audience, setAudience] = useState<'CLIENT' | 'INTERNAL' | ''>('');
  const addCat = useMutation({ mutationFn: () => workKbApi.addCategory(pid, { name: catName.trim() }), onSuccess: () => { setCatName(''); refresh(); }, onError: (e) => toast.error(workError(e)) });
  const delCat = useMutation({ mutationFn: (id: number) => workKbApi.removeCategory(pid, id), onSuccess: refresh, onError: (e) => toast.error(workError(e)) });
  const addArt = useMutation({
    mutationFn: () => workKbApi.addArticle(pid, { pageNumber: Number(page), ...(audience ? { audience } : {}) }),
    onSuccess: () => { setPage(''); toast.success(t('c7b.kbAdded')); refresh(); }, onError: (e) => toast.error(workError(e)),
  });
  const upd = useMutation({ mutationFn: ({ id, b }: { id: number; b: Parameters<typeof workKbApi.updateArticle>[2] }) => workKbApi.updateArticle(pid, id, b), onSuccess: refresh, onError: (e) => toast.error(workError(e)) });
  const del = useMutation({ mutationFn: (id: number) => workKbApi.removeArticle(pid, id), onSuccess: refresh, onError: (e) => toast.error(workError(e)) });
  if (q.isLoading) return <PageLoading />;
  if (q.error || !q.data) return <EmptyState title={t('c7b.loadFailed')} body={workError(q.error)} />;
  const d = q.data;
  const votes = d.totals.helpful + d.totals.notHelpful;
  return (
    <div className="space-y-4">
      <KpiRow label={t('c7b.kbStats')}>
        <KpiTile label={t('c7b.kbArticles')} value={d.totals.articles} hint={t('c7b.kbForClients', { count: d.totals.forClients })} />
        <KpiTile label={t('c7b.kbViews')} value={d.totals.views} />
        <KpiTile label={t('c7b.kbHelpful')} value={votes ? `${Math.round((d.totals.helpful / votes) * 100)}%` : '—'} hint={t('c7b.kbVotes', { count: votes })} />
        <KpiTile label={t('c7b.kbDeflected')} value={d.totals.deflected} tone="green" hint={t('c7b.kbDeflectedHint')} />
      </KpiRow>
      <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        <section className="w-card p-3" aria-label={t('c7b.kbCategories')}>
          <h2 className="w-section-title">{t('c7b.kbCategories')}</h2>
          <ul className="mt-2 space-y-1 text-[13px]">
            {d.categories.map((c) => (
              <li key={c.id} className="flex items-center gap-2"><span className="min-w-0 flex-1 truncate">{c.name}</span><span className="text-[12px] text-[var(--w-text-3)]">{c.articles}</span>
                {d.canEdit && <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={t('c7b.remove')} onClick={() => delCat.mutate(c.id)}><Trash2 size={12} /></button>}
              </li>
            ))}
            {!d.categories.length && <li className="text-[var(--w-text-3)]">{t('c7b.kbNoCategories')}</li>}
          </ul>
          {d.canEdit && (
            <form className="mt-2 flex gap-1.5" onSubmit={(e) => { e.preventDefault(); if (catName.trim()) addCat.mutate(); }}>
              <input className="w-input" aria-label={t('c7b.kbNewCategory')} placeholder={t('c7b.kbNewCategory')} value={catName} maxLength={80} onChange={(e) => setCatName(e.target.value)} />
              <button type="submit" className="w-btn w-btn-sm" disabled={!catName.trim()} aria-label={t('c7b.kbNewCategory')}><Plus size={13} /></button>
            </form>
          )}
        </section>
        <section className="w-card min-w-0 p-3" aria-label={t('c7b.kbArticles')}>
          <div className="flex flex-wrap items-end gap-2">
            <h2 className="w-section-title mr-auto">{t('c7b.kbArticles')}</h2>
            {d.canEdit && (
              <>
                <select className="w-input max-w-[260px]" aria-label={t('c7b.kbPickPage')} value={page} onChange={(e) => setPage(e.target.value)} data-testid="c7b-kb-page">
                  <option value="">{t('c7b.kbPickPage')}</option>
                  {d.pages.map((p) => <option key={p.number} value={p.number}>{p.title}{p.visibility === 'CLIENT' ? ` · ${t('c7b.kbClientPage')}` : ''}</option>)}
                </select>
                <select className="w-input max-w-[170px]" aria-label={t('c7b.kbAudience')} value={audience} onChange={(e) => setAudience(e.target.value as typeof audience)}>
                  <option value="">{t('c7b.kbAudienceAuto')}</option><option value="CLIENT">{t('c7b.kbAudClient')}</option><option value="INTERNAL">{t('c7b.kbAudInternal')}</option>
                </select>
                <button type="button" className="w-btn w-btn-sm w-btn-primary" disabled={!page || addArt.isPending} onClick={() => addArt.mutate()} data-testid="c7b-kb-add"><Plus size={13} /> {t('c7b.kbAdd')}</button>
              </>
            )}
          </div>
          <p className="mt-1 text-[12px] text-[var(--w-text-3)]">{t('c7b.kbHint')} <a className="underline" href={docsHref}>{t('c7b.kbOpenDocs')}</a></p>
          {d.articles.length ? (
            <div className="w-table-wrap mt-2 overflow-x-auto">
              <table className="w-full min-w-[720px] text-[12.5px]">
                <thead><tr className="text-left text-[var(--w-text-3)]"><th className="p-2">{t('c7b.fTitle')}</th><th className="p-2">{t('c7b.kbCategory')}</th><th className="p-2">{t('c7b.kbAudience')}</th><th className="p-2">{t('c7b.kbPublished')}</th><th className="p-2 text-right">{t('c7b.kbViews')}</th><th className="p-2 text-right">{t('c7b.kbHelpful')}</th><th className="p-2 text-right">{t('c7b.kbDeflected')}</th><th className="p-2" /></tr></thead>
                <tbody>
                  {d.articles.map((a) => (
                    <tr key={a.id} className="border-t border-[var(--w-border)]">
                      <td className="max-w-[260px] p-2"><span className="block truncate font-medium">{a.title}</span>{a.hiddenFromClients && <span className="block text-[11.5px] text-[var(--w-orange-text)]">{t('c7b.kbHidden')}</span>}</td>
                      <td className="p-2"><select className="w-input" aria-label={t('c7b.kbCategory')} disabled={!d.canEdit} value={a.category?.id ?? ''} onChange={(e) => upd.mutate({ id: a.id, b: { categoryId: e.target.value ? Number(e.target.value) : null } })}><option value="">—</option>{d.categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></td>
                      <td className="p-2"><select className="w-input" aria-label={t('c7b.kbAudience')} disabled={!d.canEdit} value={a.audience} onChange={(e) => upd.mutate({ id: a.id, b: { audience: e.target.value as 'CLIENT' | 'INTERNAL' } })}><option value="CLIENT">{t('c7b.kbAudClient')}</option><option value="INTERNAL">{t('c7b.kbAudInternal')}</option></select></td>
                      <td className="p-2"><input type="checkbox" aria-label={t('c7b.kbPublished')} disabled={!d.canEdit} checked={!!a.published} onChange={(e) => upd.mutate({ id: a.id, b: { published: e.target.checked } })} /></td>
                      <td className="p-2 text-right tabular-nums">{a.views}</td>
                      <td className="p-2 text-right tabular-nums">{a.helpfulPercent === null || a.helpfulPercent === undefined ? '—' : `${a.helpfulPercent}%`}</td>
                      <td className="p-2 text-right tabular-nums">{a.deflected}</td>
                      <td className="p-2">{d.canEdit && <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={t('c7b.remove')} onClick={() => del.mutate(a.id)}><Trash2 size={12} /></button>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <EmptyState icon={<BookOpen size={20} />} title={t('c7b.kbEmpty')} body={t('c7b.kbEmptyBody')} />}
        </section>
      </div>
    </div>
  );
}

// ─── Cổng khách ──────────────────────────────────────────────────

export function KbHelpTab({ pid, asClient }: { pid: number; asClient: boolean }) {
  const { t } = useWT();
  const [q, setQ] = useState('');
  const [term, setTerm] = useState('');
  const [cat, setCat] = useState<number | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  useEffect(() => { const h = setTimeout(() => setTerm(q.trim()), 250); return () => clearTimeout(h); }, [q]);
  const list = useQuery({ queryKey: kk.browse(pid, term, cat, asClient), queryFn: () => workKbApi.browse(pid, { ...(term ? { q: term } : {}), ...(cat ? { category: cat } : {}) }, asClient) });
  if (open) return <KbArticleView pid={pid} id={open} asClient={asClient} onBack={() => setOpen(null)} onOpen={setOpen} />;
  return (
    <div className="space-y-3">
      <label className="relative block max-w-[560px]">
        <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--w-text-3)]" aria-hidden="true" />
        <input className="w-input pl-8" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('c7b.kbSearchPh')} aria-label={t('c7b.kbSearch')} data-testid="c7b-kb-search" />
      </label>
      {list.data && list.data.categories.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          <button type="button" className={cn('w-btn w-btn-sm', cat === null && 'w-btn-on')} onClick={() => setCat(null)}>{t('c7b.kbAll')}</button>
          {list.data.categories.map((c) => <button key={c.id} type="button" className={cn('w-btn w-btn-sm', cat === c.id && 'w-btn-on')} onClick={() => setCat(c.id)}>{c.name} <span className="w-count">{c.count}</span></button>)}
        </div>
      )}
      {list.isLoading ? <PageLoading rows={3} /> : list.error || !list.data ? <EmptyState title={t('c7b.loadFailed')} body={workError(list.error)} /> : list.data.articles.length ? (
        <ul className="grid gap-2 md:grid-cols-2" data-testid="c7b-kb-list">
          {list.data.articles.map((a) => <ArticleCard key={a.id} a={a} onOpen={() => setOpen(a.id)} />)}
        </ul>
      ) : <EmptyState icon={<BookOpen size={20} />} title={term ? t('c7b.kbNoMatch') : t('c7b.kbNothingYet')} body={term ? t('c7b.kbNoMatchBody') : t('c7b.kbNothingYetBody')} />}
    </div>
  );
}

function ArticleCard({ a, onOpen }: { a: KbArticle; onOpen: () => void }) {
  return (
    <li>
      <button type="button" onClick={onOpen} className="w-card block h-full w-full p-3 text-left hover:bg-[var(--w-hover)]">
        <span className="block text-[13.5px] font-medium">{a.title}</span>
        {a.category && <span className="block text-[11.5px] text-[var(--w-text-3)]">{a.category.name}</span>}
        <span className="mt-1 line-clamp-2 block text-[12.5px] text-[var(--w-text-2)]">{a.excerpt}</span>
      </button>
    </li>
  );
}

function KbArticleView({ pid, id, asClient, onBack, onOpen }: { pid: number; id: number; asClient: boolean; onBack: () => void; onOpen: (id: number) => void }) {
  const { t, fmtDate } = useWT();
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ['c7b-kb-read', pid, id, asClient], queryFn: () => workKbApi.read(pid, id, asClient) });
  const vote = useMutation({ mutationFn: (h: boolean) => workKbApi.vote(pid, id, h), onSuccess: () => { toast.success(t('c7b.kbThanksVote')); qc.invalidateQueries({ queryKey: ['c7b-kb-read', pid, id] }); }, onError: (e) => toast.error(workError(e)) });
  return (
    <div className="space-y-3">
      <button type="button" className="w-btn w-btn-sm w-btn-ghost" onClick={onBack}><ArrowLeft size={13} /> {t('c7b.kbBack')}</button>
      {q.isLoading ? <PageLoading rows={4} /> : q.error || !q.data ? <EmptyState title={t('c7b.loadFailed')} body={workError(q.error)} /> : (
        <article className="w-card p-5">
          <h2 className="text-[18px] font-semibold">{q.data.title}</h2>
          <p className="mt-1 text-[12px] text-[var(--w-text-3)]">{q.data.category?.name ? `${q.data.category.name} · ` : ''}{t('c7b.kbUpdated', { d: fmtDate(q.data.updatedAt) })}</p>
          <div className="w-doc mt-4 min-w-0"><RichView value={q.data.contentJson as never} docs /></div>
          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[var(--w-border)] pt-3 text-[13px]">
            <span>{t('c7b.kbWasHelpful')}</span>
            <button type="button" className={cn('w-btn w-btn-sm', q.data.myVote === 'HELPFUL' && 'w-btn-on')} disabled={!q.data.canVote || vote.isPending} aria-pressed={q.data.myVote === 'HELPFUL'} onClick={() => vote.mutate(true)}><ThumbsUp size={13} /> {t('c7b.yes')}</button>
            <button type="button" className={cn('w-btn w-btn-sm', q.data.myVote === 'NOT_HELPFUL' && 'w-btn-on')} disabled={!q.data.canVote || vote.isPending} aria-pressed={q.data.myVote === 'NOT_HELPFUL'} onClick={() => vote.mutate(false)}><ThumbsDown size={13} /> {t('c7b.no')}</button>
            {!q.data.canVote && <span className="text-[12px] text-[var(--w-text-3)]">{t('c7b.previewReadOnly')}</span>}
          </div>
          {q.data.related.length > 0 && (
            <div className="mt-4"><h3 className="w-section-title">{t('c7b.kbRelated')}</h3>
              <ul className="mt-1 space-y-0.5">{q.data.related.map((r) => <li key={r.id}><button type="button" className="text-[13px] text-[var(--w-accent)] hover:underline" onClick={() => onOpen(r.id)}>{r.title}</button></li>)}</ul>
            </div>
          )}
        </article>
      )}
    </div>
  );
}

/** Gợi ý bài liên quan trong form yêu cầu của khách (deflection). Im lặng khi không có gì đủ liên quan. */
export function KbSuggest({ pid, text, onSolved }: { pid: number; text: string; onSolved: () => void }) {
  const { t } = useWT();
  const [term, setTerm] = useState('');
  const [open, setOpen] = useState<number | null>(null);
  useEffect(() => { const h = setTimeout(() => setTerm(text.trim().slice(0, 500)), 400); return () => clearTimeout(h); }, [text]);
  const q = useQuery({ queryKey: ['c7b-kb-suggest', pid, term], queryFn: () => workKbApi.suggest(pid, term), enabled: term.length >= 4, staleTime: 30_000 });
  const read = useQuery({ queryKey: ['c7b-kb-read', pid, open, false], queryFn: () => workKbApi.read(pid, open!), enabled: !!open });
  const solved = useMutation({ mutationFn: (id: number) => workKbApi.deflected(pid, id), onSuccess: () => { toast.success(t('c7b.kbGlad')); onSolved(); }, onError: (e) => toast.error(workError(e)) });
  const list = q.data?.articles ?? [];
  if (!list.length) return null;
  return (
    <div className="rounded-[8px] border border-[var(--w-accent-border)] bg-[var(--w-accent-soft)] p-3" role="region" aria-label={t('c7b.kbMayHelp')} data-testid="c7b-kb-suggest">
      <p className="flex items-center gap-1.5 text-[12.5px] font-medium"><Lightbulb size={13} aria-hidden="true" /> {t('c7b.kbMayHelp')}</p>
      <ul className="mt-1.5 space-y-1">
        {list.map((a) => (
          <li key={a.id} className="text-[12.5px]">
            <button type="button" className="font-medium text-[var(--w-accent)] hover:underline" aria-expanded={open === a.id} onClick={() => setOpen(open === a.id ? null : a.id)}>{a.title}</button>
            <span className="block text-[var(--w-text-2)]">{a.excerpt}</span>
            {open === a.id && (
              <div className="mt-2 rounded-[6px] bg-[var(--w-panel)] p-3">
                {read.isLoading ? <Spinner size={14} /> : read.data ? <div className="w-doc max-h-64 min-w-0 overflow-y-auto"><RichView value={read.data.contentJson as never} docs /></div> : null}
                <button type="button" className="w-btn w-btn-sm w-btn-primary mt-2" onClick={() => solved.mutate(a.id)} disabled={solved.isPending}>{t('c7b.kbSolved')}</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
