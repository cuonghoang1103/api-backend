'use client';

/**
 * Một trang tài liệu (S2a): đọc/sửa bằng RichEditor chế độ `docs`, TỰ LƯU.
 *
 * Tự lưu (khó ở đây là không đè, không mất chữ):
 *   · Sửa ⇒ chờ 1,2 s ngừng gõ ⇒ PATCH { title, contentJson, version }. Server ghi
 *     có điều kiện theo `version` — người khác vừa lưu trước ⇒ 409 WORK_PAGE_CONFLICT,
 *     ta KHÔNG tự đè: hiện dải "Someone else saved…" cho người dùng chọn.
 *   · `base.version` = version server đã nhận từ ta; mọi phản hồi (kể cả đổi trạng
 *     thái/chủ sở hữu) cập nhật nó. Bản tải lại do realtime (page.updated của CHÍNH
 *     ta) có version bằng base ⇒ không nạp đè vào editor. Version server LỚN hơn mà
 *     ta không có gì chưa lưu (người khác sửa, hoặc khôi phục) ⇒ nạp bản mới.
 *   · Rời trang khi còn chữ chưa lưu ⇒ lưu ngay (không chờ hẹn giờ) + hỏi trình duyệt.
 * Server gộp các lần lưu liên tiếp của cùng người trong 10 phút thành MỘT phiên bản.
 */

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  AlertTriangle, BadgeCheck, Check, ChevronRight, CloudOff, Download, FileText, History, Link2, Loader2, MoreHorizontal, Plus, RefreshCw, Save, Trash2, X, Share2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  userName, workApi, workDocsApi, workDocsKeys, workError, workStudioApi, workStudioKeys,
  type PageComment, type PageStatus, type PageVisibility, type ProjectConfig, type TiptapDoc, type WorkPageDetail,
} from '@/lib/work-api';
import { useAuthStore } from '@/store/authStore';
import RichEditor, { RichView, isDocEmpty } from '../RichEditor';
import { Dialog, EmptyState, Field, PageLoading, PickerList, Popover, Spinner, StatusBadge, UserAvatar, relativeTime } from '../ui';
import { ConfirmDialog, Select } from '../settings/shared';
import { ApprovalDialog } from '../studio/ApprovalDetail';
import { RequestApprovalDialog } from '../studio/IssueStudio';
import { ApprovalPill, Pill, ProcessGuideLink, WarnStrip, fmtDateTime, studioOn } from '../studio/shared';
import DocHistory from './DocHistory';
import { InternalPill, portalStaff, VisibleToClient } from '../portal/ClientShare';
import NewPageDialog from './NewPageDialog';
import { PAGE_STATUS, PageStatusPill, VisibilityBadge, docsBase, downloadText } from './shared';

type SaveState = 'saved' | 'dirty' | 'saving' | 'error' | 'conflict';

const errCode = (err: unknown) => (err as { response?: { data?: { code?: string } } })?.response?.data?.code;

export default function DocView({ config, num }: { config: ProjectConfig; num: number }) {
  const pid = config.id;
  const qc = useQueryClient();
  const router = useRouter();
  const sp = useSearchParams();
  const key = workDocsKeys.page(pid, num);
  const q = useQuery({ queryKey: key, queryFn: () => workDocsApi.get(pid, num), retry: false });
  const page = q.data;

  const [title, setTitle] = useState('');
  const [doc, setDoc] = useState<TiptapDoc | null>(null);
  const [ready, setReady] = useState(false);
  const [save, setSave] = useState<SaveState>('saved');
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const base = useRef<number | null>(null);
  const dirty = useRef(false);
  const seq = useRef(0);
  const inflight = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const titleRef = useRef(title);
  titleRef.current = title;
  const docRef = useRef(doc);
  docRef.current = doc;

  const [history, setHistory] = useState(false);
  const [asking, setAsking] = useState(false);
  const [approvalOpen, setApprovalOpen] = useState<number | null>(null);
  const [newChild, setNewChild] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState('');
  const moreRef = useRef<HTMLButtonElement>(null);
  const [more, setMore] = useState(false);

  // ?approval=<id> (thông báo trong chuông trỏ thẳng vào đây) ⇒ mở chi tiết phê duyệt.
  useEffect(() => {
    const a = Number(sp?.get('approval'));
    if (Number.isInteger(a) && a > 0) setApprovalOpen(a);
  }, [sp]);

  const load = useCallback((p: WorkPageDetail) => {
    setTitle(p.title);
    setDoc(p.contentJson ?? { type: 'doc', content: [] });
    base.current = p.version;
    dirty.current = false;
    setSave('saved');
    setReady(true);
  }, []);

  // Đồng bộ từ server: lần đầu, hoặc server có bản MỚI hơn mà ta không có gì chưa lưu.
  useEffect(() => {
    if (!page) return;
    if (base.current === null) { load(page); return; }
    if (!dirty.current && page.version > base.current) load(page);
  }, [page, load]);

  const editable = !!page && page.canEdit && !!config.permissions.editDocs && page.status !== 'ARCHIVED';

  const accept = useCallback((p: WorkPageDetail) => {
    base.current = p.version;
    qc.setQueryData(key, p);
    qc.invalidateQueries({ queryKey: workDocsKeys.list(pid) });
  }, [qc, key, pid]);

  const flush = useCallback(async () => {
    if (timer.current) { clearTimeout(timer.current); timer.current = null; }
    if (!dirty.current || base.current === null) return;
    if (inflight.current) { timer.current = setTimeout(() => void flush(), 400); return; }
    inflight.current = true;
    const mySeq = seq.current;
    setSave('saving');
    try {
      const r = await workDocsApi.update(pid, num, { title: titleRef.current, contentJson: docRef.current ?? undefined, version: base.current });
      accept(r);
      setSavedAt(new Date().toISOString());
      if (mySeq === seq.current) { dirty.current = false; setSave('saved'); } else timer.current = setTimeout(() => void flush(), 800);
    } catch (err) {
      setSave(errCode(err) === 'WORK_PAGE_CONFLICT' ? 'conflict' : 'error');
    } finally {
      inflight.current = false;
    }
  }, [pid, num, accept]);

  const touch = useCallback(() => {
    dirty.current = true;
    seq.current += 1;
    setSave((s) => (s === 'conflict' ? s : 'dirty'));
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => void flush(), 1200);
  }, [flush]);

  // Rời trang: lưu ngay; đóng tab khi còn chữ chưa lưu ⇒ trình duyệt hỏi lại.
  useEffect(() => {
    const onBefore = (e: BeforeUnloadEvent) => { if (dirty.current) { e.preventDefault(); e.returnValue = ''; } };
    window.addEventListener('beforeunload', onBefore);
    return () => {
      window.removeEventListener('beforeunload', onBefore);
      if (dirty.current) void flush();
    };
  }, [flush]);

  const patch = useMutation({
    mutationFn: (body: { status?: PageStatus; visibility?: PageVisibility; ownerId?: number; stageId?: number | null }) => workDocsApi.update(pid, num, body),
    onSuccess: (r) => { accept(r); toast.success('Saved'); },
    onError: (err) => toast.error(workError(err, 'Could not update the page')),
  });
  const saveVersion = useMutation({
    mutationFn: async () => {
      await flush();
      return workDocsApi.update(pid, num, { versionNote: note.trim() || 'Saved version', version: base.current ?? undefined });
    },
    onSuccess: (r) => { accept(r); setNoteOpen(false); setNote(''); toast.success(`Saved as version ${r.currentVersion}`); qc.invalidateQueries({ queryKey: workDocsKeys.versions(pid, num) }); },
    onError: (err) => toast.error(workError(err, 'Could not save a version')),
  });
  const remove = useMutation({
    mutationFn: () => workDocsApi.remove(pid, num),
    onSuccess: () => {
      dirty.current = false;
      toast.success('Page deleted');
      qc.invalidateQueries({ queryKey: workDocsKeys.all(pid) });
      router.push(docsBase(config));
    },
    onError: (err) => toast.error(workError(err, 'Could not delete the page')),
  });
  const exportMd = useMutation({
    mutationFn: async () => { await flush(); return workDocsApi.markdown(pid, num); },
    onSuccess: (r) => downloadText(r.filename, r.markdown),
    onError: (err) => toast.error(workError(err, 'Could not export the page')),
  });

  const reloadFromServer = async () => {
    dirty.current = false;
    base.current = null;
    if (timer.current) clearTimeout(timer.current);
    await qc.invalidateQueries({ queryKey: key });
  };

  if (q.isLoading) return <PageLoading />;
  if (!page) {
    return (
      <EmptyState
        title="Page not found"
        body={workError(q.error, 'It may have been deleted, or it is not shared with you.')}
        action={<Link href={docsBase(config)} className="w-btn">Back to docs</Link>}
      />
    );
  }

  const base$ = docsBase(config);
  const pendingApproval = page.approval?.status === 'PENDING';
  const members = config.members;

  return (
    <div className="w-doc mx-auto flex w-full max-w-[1240px] flex-col gap-6 px-4 pb-16 pt-4 md:px-8 lg:flex-row lg:gap-10">
      <article className="min-w-0 flex-1 lg:max-w-[860px]">
        {/* Đường dẫn: Docs › cha › … */}
        <nav aria-label="Page location" className="mb-3 flex min-w-0 flex-wrap items-center gap-1 text-[12.5px] text-[var(--w-text-3)]">
          <Link href={base$} className="hover:text-[var(--w-text)]">Docs</Link>
          {page.ancestors.map((a) => (
            <span key={a.id} className="flex min-w-0 items-center gap-1">
              <ChevronRight size={12} aria-hidden="true" className="shrink-0 opacity-70" />
              <Link href={`${base$}/${a.number}`} className="max-w-[220px] truncate hover:text-[var(--w-text)]">{a.title}</Link>
            </span>
          ))}
        </nav>

        {page.approval?.contentChanged && (
          <WarnStrip className="mb-3 rounded-[8px] border">
            <b className="font-semibold">Content changed since approval.</b> This page was edited after it was signed off — the approval still stands, but readers see text the approvers did not sign.
            {page.canRequestApproval && !pendingApproval && <> <button type="button" className="font-medium text-[var(--w-accent-text)] underline" onClick={() => setAsking(true)}>Request a new approval</button></>}
          </WarnStrip>
        )}
        {save === 'conflict' && (
          <div role="alert" className="mb-3 flex flex-wrap items-center gap-2 rounded-[8px] border border-[color-mix(in_srgb,var(--w-red)_40%,transparent)] bg-[color-mix(in_srgb,var(--w-red)_8%,transparent)] px-3 py-2 text-[13px]">
            <AlertTriangle size={14} className="shrink-0 text-[var(--w-red)]" />
            <span className="min-w-0 flex-1">Someone else saved this page while you were editing. Your latest changes are not saved.</span>
            <button type="button" className="w-btn w-btn-sm" onClick={() => void navigator.clipboard?.writeText(`${title}\n\n${tiptapPlain(doc)}`).then(() => toast.success('Your text is on the clipboard'))}>Copy my text</button>
            <button type="button" className="w-btn w-btn-sm w-btn-primary" onClick={() => void reloadFromServer()}><RefreshCw size={12} /> Load their version</button>
          </div>
        )}

        <div className="flex items-start gap-2">
          {editable ? (
            <textarea
              value={title}
              rows={1}
              maxLength={255}
              aria-label="Page title"
              onChange={(e) => { setTitle(e.target.value.replace(/\n/g, ' ')); touch(); }}
              onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
              className="min-w-0 flex-1 resize-none overflow-hidden bg-transparent text-[26px] font-semibold leading-tight tracking-[-0.02em] text-[var(--w-text)] outline-none [field-sizing:content] placeholder:text-[var(--w-text-3)] max-sm:text-[22px]"
              placeholder="Untitled"
            />
          ) : (
            <h1 className="min-w-0 flex-1 text-[26px] font-semibold leading-tight tracking-[-0.02em] [overflow-wrap:anywhere] max-sm:text-[22px]">{page.title}</h1>
          )}
        </div>

        {/* Cổng khách (S2b): dải rõ ràng khi trang lộ cho khách; nút chia sẻ nhanh khi còn nội bộ. */}
        {portalStaff(config) && (page.visibility === 'CLIENT' ? (
          <VisibleToClient className="mt-3">the client can read this page in their portal (Documents)</VisibleToClient>
        ) : page.canManage && config.permissions.editDocs ? (
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[12.5px] text-[var(--w-text-3)]">
            <InternalPill label="Internal only" />
            <button type="button" className="w-btn w-btn-sm" disabled={patch.isPending} onClick={() => patch.mutate({ visibility: 'CLIENT' })} data-testid="docs-share-client">
              <Share2 size={13} /> Share with client
            </button>
          </div>
        ) : null)}
        <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-[12.5px] text-[var(--w-text-3)]">
          <PageStatusPill status={page.status} />
          <VisibilityBadge visibility={page.visibility} />
          {page.owner && <span className="flex items-center gap-1.5"><UserAvatar user={page.owner} size={16} /> {userName(page.owner)}</span>}
          <span title={fmtDateTime(page.updatedAt)}>Edited {relativeTime(page.updatedAt)}{page.lastEditedBy ? ` by ${userName(page.lastEditedBy)}` : ''}</span>
          {editable && <SaveBadge state={save} savedAt={savedAt} onRetry={() => void flush()} />}
          <span className="ml-auto flex items-center gap-1">
            <button type="button" className="w-btn w-btn-ghost w-btn-sm" onClick={() => { void flush(); setHistory(true); }} data-testid="docs-history">
              <History size={13} /> <span className="max-sm:hidden">History</span> <span className="tabular text-[var(--w-text-3)]">v{page.currentVersion}</span>
            </button>
            {page.canRequestApproval && !!config.permissions.createApprovals && !pendingApproval && page.status !== 'ARCHIVED' && (
              <button type="button" className="w-btn w-btn-sm" onClick={() => { void flush(); setAsking(true); }} data-testid="docs-request-approval">
                <BadgeCheck size={13} /> <span className="max-sm:hidden">Request approval</span>
              </button>
            )}
            <button ref={moreRef} type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label="More page actions" onClick={() => setMore(true)}>
              <MoreHorizontal size={14} />
            </button>
          </span>
        </div>
        <Popover open={more} onClose={() => setMore(false)} anchorRef={moreRef} width={220} align="end">
          <div className="p-1" role="menu">
            <MenuItem icon={Download} label="Export as Markdown (.md)" onClick={() => { setMore(false); exportMd.mutate(); }} />
            {editable && <MenuItem icon={Save} label="Save as a named version…" onClick={() => { setMore(false); setNoteOpen(true); }} />}
            {editable && <MenuItem icon={Plus} label="Add a sub-page" onClick={() => { setMore(false); setNewChild(true); }} />}
            {page.canManage && <MenuItem icon={Trash2} label="Delete page…" danger onClick={() => { setMore(false); setConfirmDel(true); }} />}
          </div>
        </Popover>

        <div className="mt-5 min-w-0">
          {!ready ? <PageLoading rows={8} /> : editable ? (
            <RichEditor
              docs
              value={doc}
              onChange={(d) => {
                // Lưới an toàn: sự kiện "update" không đổi nội dung (editor tự bắn) không được tính là sửa.
                if (JSON.stringify(d) === JSON.stringify(docRef.current)) return;
                setDoc(d);
                touch();
              }}
              members={members}
              placeholder="Write, or type to start…"
              minHeight={320}
              className="!rounded-[8px]"
            />
          ) : (
            <RichView value={doc} docs />
          )}
          {page.status === 'ARCHIVED' && page.canEdit && (
            <p className="mt-2 text-[12px] text-[var(--w-text-3)]">This page is archived and read-only. Set its status back to Draft to edit it.</p>
          )}
        </div>

        {page.children.length > 0 && (
          <section className="mt-8">
            <h2 className="w-section-title mb-2">Pages inside</h2>
            <ul className="overflow-hidden rounded-[8px] border border-[var(--w-border)]">
              {page.children.map((c) => (
                <li key={c.id} className="border-b border-[var(--w-border)] last:border-b-0">
                  <Link href={`${base$}/${c.number}`} className="flex min-w-0 items-center gap-2 px-3 py-2 text-[13.5px] hover:bg-[var(--w-hover)]">
                    <FileText size={14} className="shrink-0 text-[var(--w-text-3)]" />
                    <span className="min-w-0 flex-1 truncate">{c.title}</span>
                    <VisibilityBadge visibility={c.visibility} compact />
                    {c.status !== 'DRAFT' && <PageStatusPill status={c.status} />}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <DocComments config={config} num={num} canComment={page.canComment} />
      </article>

      <aside className="w-full shrink-0 lg:sticky lg:top-4 lg:max-h-[calc(100vh-120px)] lg:w-[300px] lg:self-start lg:overflow-y-auto" aria-label="Page details">
        <div className="space-y-5 rounded-[10px] border border-[var(--w-border)] bg-[var(--w-panel)] p-4">
          <div>
            <h2 className="w-section-title mb-2">Details</h2>
            <dl className="space-y-2.5 text-[13px]">
              <Prop label="Status">
                {page.canEdit && config.permissions.editDocs ? (
                  <Select aria-label="Document status" value={page.status} disabled={patch.isPending || page.status === 'IN_REVIEW'} onChange={(e) => patch.mutate({ status: e.target.value as PageStatus })} className="!h-8">
                    {(['DRAFT', 'IN_REVIEW', 'APPROVED', 'ARCHIVED'] as PageStatus[]).map((s) => (
                      <option key={s} value={s} disabled={(s === 'IN_REVIEW' || s === 'APPROVED') && (page.approvalsOn || (s === 'APPROVED' && !config.permissions.manageDocs) || s === 'IN_REVIEW')}>
                        {PAGE_STATUS[s].label}{(s === 'IN_REVIEW' || s === 'APPROVED') && page.approvalsOn ? ' (via approval)' : ''}
                      </option>
                    ))}
                  </Select>
                ) : <PageStatusPill status={page.status} />}
              </Prop>
              <Prop label="Visible to">
                {page.canManage && config.permissions.editDocs ? (
                  <Select aria-label="Who can see this page" value={page.visibility} disabled={patch.isPending} onChange={(e) => patch.mutate({ visibility: e.target.value as PageVisibility })} className="!h-8">
                    <option value="INTERNAL">Project team only</option>
                    <option value="CLIENT">Team and client</option>
                  </Select>
                ) : <VisibilityBadge visibility={page.visibility} />}
              </Prop>
              <Prop label="Owner">
                {page.canManage && config.permissions.editDocs ? (
                  <Select aria-label="Page owner" value={page.ownerId ?? ''} disabled={patch.isPending} onChange={(e) => patch.mutate({ ownerId: Number(e.target.value) })} className="!h-8">
                    {page.ownerId === null && <option value="">No owner</option>}
                    {members.filter((m) => m.role === 'ADMIN' || m.role === 'MEMBER' || m.id === page.ownerId).map((m) => <option key={m.id} value={m.id}>{userName(m)}</option>)}
                  </Select>
                ) : <span className="flex items-center gap-1.5">{page.owner ? <><UserAvatar user={page.owner} size={18} /> {userName(page.owner)}</> : '—'}</span>}
              </Prop>
              {studioOn(config, 'stages') && (
                <Prop label="Stage">
                  <StageSelect config={config} value={page.stageId} disabled={!page.canEdit || !config.permissions.editDocs || patch.isPending} onChange={(v) => patch.mutate({ stageId: v })} />
                  {page.stage && <ProcessGuideLink slug={page.stage.slug} className="mt-1" />}
                </Prop>
              )}
              {page.templateKey && <Prop label="Template"><span className="font-mono text-[12px] text-[var(--w-text-2)]">{page.templateKey}</span></Prop>}
            </dl>
          </div>

          {page.approvalsOn && (
            <div>
              <h2 className="w-section-title mb-2">Approval</h2>
              {page.approval ? (
                <button type="button" onClick={() => setApprovalOpen(page.approval!.id)} className="flex w-full flex-wrap items-center gap-2 rounded-[8px] border border-[var(--w-border)] px-2.5 py-2 text-left text-[12.5px] hover:bg-[var(--w-hover)]" data-testid="docs-approval">
                  <ApprovalPill status={page.approval.status} />
                  {page.approval.contentChanged && <Pill tone="orange" title="Edited after it was signed">Changed since approval</Pill>}
                  <span className="ml-auto text-[var(--w-text-3)]">{relativeTime(page.approval.decidedAt ?? page.approval.createdAt)}</span>
                </button>
              ) : <p className="text-[12px] text-[var(--w-text-3)]">Not sent for approval yet.</p>}
            </div>
          )}

          <DocIssues config={config} page={page} onChange={accept} />
        </div>
      </aside>

      <DocHistory open={history} onClose={() => setHistory(false)} pid={pid} page={page} canRestore={page.canManage && editable} onRestored={(p) => { qc.setQueryData(key, p); qc.invalidateQueries({ queryKey: workDocsKeys.list(pid) }); }} />
      <RequestApprovalDialog
        open={asking}
        onClose={() => setAsking(false)}
        config={config}
        title={`Request approval · ${page.title}`}
        successMessage="Approval requested — the page is now In review"
        excludeClients={page.visibility !== 'CLIENT'}
        hint={page.visibility !== 'CLIENT' ? 'This page is internal, so the client cannot be an approver. Make it visible to the client first if they need to sign it.' : undefined}
        send={async (b) => {
          const a = await workStudioApi.createDocApproval(pid, { pageNumber: num, ...b });
          qc.invalidateQueries({ queryKey: key });
          qc.invalidateQueries({ queryKey: workStudioKeys.approvals(pid) });
          return a;
        }}
      />
      {approvalOpen && <ApprovalDialog pid={pid} approvalId={approvalOpen} config={config} onClose={() => { setApprovalOpen(null); qc.invalidateQueries({ queryKey: key }); }} />}
      <NewPageDialog open={newChild} onClose={() => setNewChild(false)} config={config} parentNumber={page.number} parentTitle={page.title} stageId={page.stageId} />
      <ConfirmDialog
        open={confirmDel}
        onClose={() => setConfirmDel(false)}
        onConfirm={() => remove.mutate()}
        pending={remove.isPending}
        title="Delete page"
        body={`“${page.title}”${page.children.length ? ' and every page inside it' : ''} will be deleted.`}
        confirmLabel="Delete"
      />
      <Dialog
        open={noteOpen}
        onClose={() => setNoteOpen(false)}
        title="Save as a named version"
        width={440}
        footer={<><button type="button" className="w-btn" onClick={() => setNoteOpen(false)}>Cancel</button><button type="button" className="w-btn w-btn-primary" disabled={saveVersion.isPending} onClick={() => saveVersion.mutate()}>{saveVersion.isPending ? <Spinner size={12} /> : <Save size={13} />} Save version</button></>}
      >
        <Field label="What changed?" hint="Named versions are never merged with later edits — use one before sending the page to a client.">
          <input className="w-input" value={note} maxLength={500} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Sent to client for review" autoFocus />
        </Field>
      </Dialog>
    </div>
  );
}

function tiptapPlain(doc: TiptapDoc | null): string {
  const out: string[] = [];
  const walk = (n: unknown) => {
    const x = n as { type?: string; text?: string; content?: unknown[] };
    if (typeof x?.text === 'string') out.push(x.text);
    (x?.content ?? []).forEach(walk);
    if (x?.type && ['paragraph', 'heading', 'listItem', 'taskItem', 'tableRow'].includes(x.type)) out.push('\n');
  };
  walk(doc);
  return out.join('');
}

function SaveBadge({ state, savedAt, onRetry }: { state: SaveState; savedAt: string | null; onRetry: () => void }) {
  if (state === 'saving') return <span className="flex items-center gap-1" aria-live="polite"><Loader2 size={12} className="animate-spin" /> Saving…</span>;
  if (state === 'dirty') return <span className="text-[var(--w-text-3)]" aria-live="polite">Unsaved changes</span>;
  if (state === 'error') return <button type="button" onClick={onRetry} className="flex items-center gap-1 font-medium text-[var(--w-red)]" aria-live="polite"><CloudOff size={12} /> Not saved — retry</button>;
  if (state === 'conflict') return <span className="flex items-center gap-1 font-medium text-[var(--w-red)]" aria-live="polite"><AlertTriangle size={12} /> Conflict</span>;
  return <span className="flex items-center gap-1 text-[var(--w-green)]" aria-live="polite" data-testid="docs-saved" title={savedAt ? `Saved ${fmtDateTime(savedAt)}` : undefined}><Check size={12} /> Saved</span>;
}

function MenuItem({ icon: Icon, label, onClick, danger }: { icon: typeof Download; label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button type="button" role="menuitem" onClick={onClick} className={cn('flex w-full items-center gap-2 rounded-[5px] px-2 py-1.5 text-left text-[13px] hover:bg-[var(--w-hover)]', danger && 'text-[var(--w-red)]')}>
      <Icon size={13} className="shrink-0 opacity-80" /> {label}
    </button>
  );
}

function Prop({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[84px_minmax(0,1fr)] items-center gap-2">
      <dt className="text-[12px] text-[var(--w-text-3)]">{label}</dt>
      <dd className="min-w-0">{children}</dd>
    </div>
  );
}

function StageSelect({ config, value, onChange, disabled }: { config: ProjectConfig; value: number | null; onChange: (v: number | null) => void; disabled?: boolean }) {
  const stages = useQuery({ queryKey: workStudioKeys.stages(config.id), queryFn: () => workStudioApi.stages(config.id), staleTime: 30_000 });
  return (
    <Select aria-label="Stage" value={value ?? ''} disabled={disabled} onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)} className="!h-8">
      <option value="">No stage</option>
      {(stages.data ?? []).map((s) => <option key={s.id} value={s.id}>{String(s.n).padStart(2, '0')}. {s.name}</option>)}
    </Select>
  );
}

// ─── Thẻ liên kết ────────────────────────────────────────────────

function DocIssues({ config, page, onChange }: { config: ProjectConfig; page: WorkPageDetail; onChange: (p: WorkPageDetail) => void }) {
  const pid = config.id;
  const qc = useQueryClient();
  const ref = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const canEdit = page.canEdit && !!config.permissions.editDocs;
  const issues = useQuery({ queryKey: ['work', 'issues', pid, 'doc-link-picker'], queryFn: () => workApi.issues(pid, { includeDone: true, limit: 200 }), enabled: open, staleTime: 30_000 });
  const linked = useMemo(() => new Set(page.issues.map((i) => i.number)), [page.issues]);
  const refresh = () => {
    qc.invalidateQueries({ queryKey: workDocsKeys.page(pid, page.number) });
    qc.invalidateQueries({ queryKey: ['work', 'pages', pid, 'issue'] });
  };
  const link = useMutation({
    mutationFn: (n: number) => workDocsApi.linkIssue(pid, page.number, n),
    onSuccess: (list) => { onChange({ ...page, issues: list }); refresh(); },
    onError: (err) => toast.error(workError(err, 'Could not link the issue')),
  });
  const unlink = useMutation({
    mutationFn: (n: number) => workDocsApi.unlinkIssue(pid, page.number, n),
    onSuccess: (list) => { onChange({ ...page, issues: list }); refresh(); },
    onError: (err) => toast.error(workError(err, 'Could not unlink the issue')),
  });
  const base = `/work/${config.workspace.slug}/${config.key}`;
  return (
    <div>
      <div className="mb-2 flex items-center">
        <h2 className="w-section-title">Linked issues</h2>
        {canEdit && (
          <button ref={ref} type="button" className="w-btn w-btn-ghost w-btn-sm ml-auto" onClick={() => setOpen(true)} data-testid="docs-link-issue">
            <Link2 size={12} /> Link issue
          </button>
        )}
      </div>
      {page.issues.length ? (
        <ul className="space-y-1">
          {page.issues.map((i) => (
            <li key={i.linkId} className="group flex min-w-0 items-center gap-2 rounded-[6px] px-1.5 py-1 hover:bg-[var(--w-hover)]">
              <Link href={`${base}/issue/${i.number}`} className="flex min-w-0 flex-1 items-center gap-2 text-[13px]">
                <span className="shrink-0 font-mono text-[12px] text-[var(--w-accent-text)]">{i.key}</span>
                <span className={cn('min-w-0 truncate', i.resolvedAt && 'text-[var(--w-text-3)] line-through')}>{i.title}</span>
              </Link>
              <StatusBadge status={i.status} className="max-sm:hidden" />
              {canEdit && (
                <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm opacity-0 focus:opacity-100 group-hover:opacity-100 max-md:opacity-100" aria-label={`Unlink ${i.key}`} onClick={() => unlink.mutate(i.number)}>
                  <X size={12} />
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : <p className="text-[12px] text-[var(--w-text-3)]">{canEdit ? 'Link the issues this document covers — they show it under “Linked docs”.' : 'No linked issues.'}</p>}
      <Popover open={open} onClose={() => setOpen(false)} anchorRef={ref} width={320} align="end">
        <PickerList
          options={(issues.data?.items ?? []).filter((i) => !linked.has(i.number)).map((i) => ({ value: i.number, label: `${config.key}-${i.number} ${i.title}`, keywords: String(i.number) }))}
          selected={[]}
          onPick={(n) => { link.mutate(n); setOpen(false); }}
          placeholder="Find an issue by key or title…"
          empty={issues.isLoading ? 'Loading…' : 'No issue found'}
        />
      </Popover>
    </div>
  );
}

// ─── Bình luận ───────────────────────────────────────────────────

function DocComments({ config, num, canComment }: { config: ProjectConfig; num: number; canComment: boolean }) {
  const pid = config.id;
  const qc = useQueryClient();
  const meId = useAuthStore((s) => s.user?.id);
  const key = workDocsKeys.comments(pid, num);
  const q = useQuery({ queryKey: key, queryFn: () => workDocsApi.comments(pid, num) });
  const [draft, setDraft] = useState<TiptapDoc | null>(null);
  const [empty, setEmpty] = useState(true);
  const [editorKey, setEditorKey] = useState(0);
  const add = useMutation({
    mutationFn: () => workDocsApi.addComment(pid, num, draft!),
    onSuccess: (c) => {
      qc.setQueryData<PageComment[]>(key, (old) => [...(old ?? []), c]);
      setDraft(null);
      setEmpty(true);
      setEditorKey((k) => k + 1);
    },
    onError: (err) => toast.error(workError(err, 'Could not post the comment')),
  });
  const del = useMutation({
    mutationFn: (cid: number) => workDocsApi.deleteComment(pid, num, cid),
    onSuccess: (_r, cid) => qc.setQueryData<PageComment[]>(key, (old) => (old ?? []).filter((c) => c.id !== cid)),
    onError: (err) => toast.error(workError(err, 'Could not delete the comment')),
  });
  const list = q.data ?? [];
  return (
    <section className="mt-10" aria-label="Comments">
      <h2 className="w-section-title mb-3">Comments {list.length > 0 && <span className="tabular text-[var(--w-text-3)]">· {list.length}</span>}</h2>
      <ul className="space-y-4">
        {list.map((c) => (
          <li key={c.id} className="flex gap-2.5" id={`comment-${c.id}`}>
            <UserAvatar user={c.author} size={26} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-[12.5px]">
                <span className="font-medium">{userName(c.author)}</span>
                <span className="text-[var(--w-text-3)]" title={fmtDateTime(c.createdAt)}>{relativeTime(c.createdAt)}</span>
                {(c.canDelete || c.authorId === meId) && (
                  <button type="button" className="ml-auto text-[12px] text-[var(--w-text-3)] hover:text-[var(--w-red)]" onClick={() => del.mutate(c.id)}>Delete</button>
                )}
              </div>
              <div className="mt-1 min-w-0"><RichView value={c.bodyJson} /></div>
            </div>
          </li>
        ))}
      </ul>
      {canComment ? (
        <div className="mt-4">
          <RichEditor
            key={editorKey}
            value={draft}
            onChange={(d, isEmpty) => { setDraft(d); setEmpty(isEmpty || isDocEmpty(d)); }}
            members={config.members}
            placeholder="Add a comment — @mention someone to notify them"
            minHeight={64}
            onSubmit={() => !empty && add.mutate()}
          />
          <div className="mt-2 flex justify-end">
            <button type="button" className="w-btn w-btn-primary w-btn-sm" disabled={empty || add.isPending} onClick={() => add.mutate()}>
              {add.isPending ? <Spinner size={12} /> : null} Comment
            </button>
          </div>
        </div>
      ) : !list.length ? <p className="text-[12px] text-[var(--w-text-3)]">No comments yet.</p> : null}
    </section>
  );
}
