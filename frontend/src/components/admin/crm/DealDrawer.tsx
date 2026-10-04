'use client';

/**
 * Chi tiết deal (ngăn kéo phải): Tổng quan · Hoạt động · Go/No-go · Đề xuất.
 * Liên kết hai chiều với phiếu yêu cầu (/admin/project-requests?id=) và dự án CT Work.
 */
import { useCallback, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import toast from 'react-hot-toast';
import {
  CalendarClock, Check, ClipboardCheck, Copy, ExternalLink, FileSignature, FileText, FolderKanban, Link2, Loader2,
  Plus, Send, ShieldOff, Trash2, Upload,
} from 'lucide-react';
import { useAdminT } from '@/components/admin/i18n';
import {
  crmApi, DEAL_STAGES, type ActivityType, type CrmMeta, type CrmOrg, type CrmContact, type CrmProposal, type DealDetail,
  type DealStage, type Decision,
} from '@/lib/crm-api';
import {
  ACTIVITY_LABEL, Chip, Drawer, Label, Modal, PACKAGE_LABEL, STAGE_LABEL, StageDot, areaCls, btn, btnDanger, btnPrimary,
  errMsg, fmtDate, fmtMoney, inputCls,
} from './shared';

export type DealTab = 'overview' | 'activity' | 'qualification' | 'proposals';

const mdComponents = {
  table: (p: React.ComponentProps<'table'>) => (
    <div className="my-3 overflow-x-auto"><table {...p} className="min-w-full border-collapse text-[12.5px]" /></div>
  ),
  th: (p: React.ComponentProps<'th'>) => <th {...p} className="border border-[var(--a-border)] px-2 py-1 text-left font-semibold" />,
  td: (p: React.ComponentProps<'td'>) => <td {...p} className="border border-[var(--a-border)] px-2 py-1 align-top" />,
};

export function ProposalPreview({ content }: { content: string }) {
  return (
    <div className="prose-crm text-[13px] leading-6 text-[var(--a-text-2)] [&_h1]:mb-2 [&_h1]:mt-4 [&_h1]:text-[17px] [&_h1]:font-semibold [&_h1]:text-[var(--a-text)] [&_h2]:mb-1.5 [&_h2]:mt-4 [&_h2]:text-[14.5px] [&_h2]:font-semibold [&_h2]:text-[var(--a-text)] [&_h3]:mt-3 [&_h3]:font-semibold [&_li]:ml-4 [&_li]:list-disc [&_p]:my-1.5 [&_hr]:my-4 [&_hr]:border-[var(--a-border)]">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]} components={mdComponents}>{content}</ReactMarkdown>
    </div>
  );
}

// ─── Tổng quan ──────────────────────────────────────────────────

function Overview({ deal, meta, reload, onStage }: { deal: DealDetail; meta: CrmMeta; reload: () => void; onStage: (s: DealStage) => void }) {
  const { vi, L } = useAdminT();
  const [f, setF] = useState(() => ({
    title: deal.title, orgId: deal.org?.id ?? null, contactId: deal.contact?.id ?? null, packageId: deal.packageId ?? '',
    valueAmount: deal.value === null ? '' : String(deal.value), currency: deal.currency, probability: deal.probability === null ? '' : String(deal.probability),
    expectedCloseAt: deal.expectedCloseAt?.slice(0, 10) ?? '', ownerId: deal.owner?.id ?? null, source: deal.source ?? '',
    ndaSigned: deal.ndaSigned, ndaSignedAt: deal.ndaSignedAt?.slice(0, 10) ?? '',
  }));
  const [orgs, setOrgs] = useState<CrmOrg[]>([]);
  const [contacts, setContacts] = useState<CrmContact[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  useEffect(() => {
    crmApi.orgs().then((r) => setOrgs(r.items)).catch(() => {});
    crmApi.contacts().then((r) => setContacts(r.items)).catch(() => {});
  }, []);

  async function save() {
    setBusy('save');
    try {
      await crmApi.updateDeal(deal.id, {
        title: f.title, orgId: f.orgId, contactId: f.contactId, packageId: f.packageId || null,
        valueAmount: f.valueAmount === '' ? null : Number(f.valueAmount), currency: f.currency || 'VND',
        probability: f.probability === '' ? null : Number(f.probability), expectedCloseAt: f.expectedCloseAt || null,
        ownerId: f.ownerId, source: f.source || null, ndaSigned: f.ndaSigned, ndaSignedAt: f.ndaSignedAt || null,
      });
      toast.success(L('Saved', 'Đã lưu'));
      reload();
    } catch (e) { toast.error(errMsg(e, L('Save failed', 'Lưu thất bại')).message); } finally { setBusy(null); }
  }

  async function createProject() {
    setBusy('project');
    try {
      const r = await crmApi.createWorkProject(deal.id);
      toast.success(r.alreadyExisted ? L('Project already exists', 'Dự án đã có sẵn') : L(`CT Work project ${r.key} created`, `Đã tạo dự án CT Work ${r.key}`));
      reload();
    } catch (e) { toast.error(errMsg(e, L('Could not create the project', 'Không tạo được dự án')).message); } finally { setBusy(null); }
  }

  async function uploadNda(file: File) {
    setBusy('nda');
    try { await crmApi.uploadNda(deal.id, file); toast.success(L('NDA uploaded', 'Đã tải NDA lên')); reload(); }
    catch (e) { toast.error(errMsg(e, L('Upload failed', 'Tải lên thất bại')).message); } finally { setBusy(null); }
  }
  async function openNda() {
    try { const { url } = await crmApi.ndaUrl(deal.id); window.open(url, '_blank', 'noopener'); }
    catch (e) { toast.error(errMsg(e, 'NDA').message); }
  }

  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((x) => ({ ...x, [k]: v }));
  const projectCreated = deal.request?.status === 'PROJECT_CREATED';

  return (
    <div className="space-y-5 p-4">
      {/* Giai đoạn */}
      <div className="flex flex-wrap items-center gap-2">
        <StageDot stage={deal.stage} label={STAGE_LABEL[deal.stage][vi ? 1 : 0]} />
        <span className="text-[12px] tabular-nums text-[var(--a-text-3)]">· {deal.effectiveProbability}% · {L('weighted', 'trọng số')} {fmtMoney(deal.weighted, deal.currency)}</span>
        {deal.stale && <Chip tone="var(--a-orange)">stale</Chip>}
        {deal.isRoleplay && <Chip tone="var(--a-yellow)">{L('roleplay', 'nhập vai')}</Chip>}
        <select
          aria-label={L('Move to stage', 'Chuyển giai đoạn')}
          value={deal.stage}
          onChange={(e) => onStage(e.target.value as DealStage)}
          className={`${inputCls} ml-auto w-auto`}
          disabled={projectCreated}
        >
          {DEAL_STAGES.map((s) => <option key={s} value={s}>{STAGE_LABEL[s][vi ? 1 : 0]}</option>)}
        </select>
      </div>
      {deal.stage === 'LOST' && deal.lostReason && (
        <p className="rounded-[8px] border border-[color:var(--a-red)] px-3 py-2 text-[12.5px] text-[var(--a-text-2)]">
          <b className="text-[color:var(--a-red)]">{L('Lost reason', 'Lý do thua')}:</b> {deal.lostReason}
        </p>
      )}

      {/* Liên kết phiếu ↔ dự án */}
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="rounded-[9px] border border-[var(--a-border)] p-3">
          <Label>{L('Project request', 'Phiếu yêu cầu')}</Label>
          {deal.request ? (
            <a href={`/admin/project-requests?id=${deal.request.id}`} className="inline-flex items-center gap-1 text-[13px] font-medium text-[var(--a-accent-text)] hover:underline">
              <Link2 className="h-3.5 w-3.5" /> {deal.request.code} · {deal.request.status}
            </a>
          ) : <p className="text-[12.5px] text-[var(--a-text-3)]">{L('None — an internal request is created with the project', 'Chưa có — sẽ tạo phiếu nội bộ khi tạo dự án')}</p>}
        </div>
        <div className="rounded-[9px] border border-[var(--a-border)] p-3">
          <Label>{L('CT Work project', 'Dự án CT Work')}</Label>
          {deal.workProject?.url ? (
            <a href={deal.workProject.url} className="inline-flex items-center gap-1 text-[13px] font-medium text-[var(--a-accent-text)] hover:underline">
              <FolderKanban className="h-3.5 w-3.5" /> {deal.workProject.key} <ExternalLink className="h-3 w-3" />
            </a>
          ) : deal.stage === 'WON' ? (
            <button className={btnPrimary} onClick={createProject} disabled={busy === 'project'} data-testid="create-work-project">
              {busy === 'project' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FolderKanban className="h-3.5 w-3.5" />}
              {L('Create CT Work project', 'Tạo dự án CT Work')}
            </button>
          ) : <p className="text-[12.5px] text-[var(--a-text-3)]">{L('Available once the deal is WON', 'Có khi deal ở WON')}</p>}
        </div>
      </div>

      {/* Trường */}
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="sm:col-span-2"><Label>{L('Title', 'Tiêu đề')}</Label><input className={inputCls} value={f.title} onChange={(e) => set('title', e.target.value)} /></label>
        <label><Label>{L('Organization', 'Tổ chức')}</Label>
          <select className={inputCls} value={f.orgId ?? ''} onChange={(e) => set('orgId', e.target.value ? Number(e.target.value) : null)}>
            <option value="">—</option>
            {orgs.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
        </label>
        <label><Label>{L('Contact', 'Người liên hệ')}</Label>
          <select className={inputCls} value={f.contactId ?? ''} onChange={(e) => set('contactId', e.target.value ? Number(e.target.value) : null)}>
            <option value="">—</option>
            {deal.contact && !contacts.some((c) => c.id === deal.contact!.id) && <option value={deal.contact.id}>{deal.contact.name}</option>}
            {contacts.map((c) => <option key={c.id} value={c.id}>{c.name}{c.email ? ` · ${c.email}` : ''}</option>)}
          </select>
        </label>
        <label><Label>{L('Package of interest', 'Gói quan tâm')}</Label>
          <select className={inputCls} value={f.packageId} onChange={(e) => set('packageId', e.target.value)}>
            <option value="">—</option>
            {meta.packages.map((p) => <option key={p} value={p}>{PACKAGE_LABEL[p]?.[vi ? 1 : 0] ?? p}</option>)}
          </select>
        </label>
        <label><Label>{L('Owner', 'Người phụ trách')}</Label>
          <select className={inputCls} value={f.ownerId ?? ''} onChange={(e) => set('ownerId', e.target.value ? Number(e.target.value) : null)}>
            <option value="">—</option>
            {meta.owners.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
        </label>
        <label><Label hint={L('entered by you', 'do bạn nhập')}>{L('Estimated value', 'Giá trị ước tính')}</Label>
          <div className="flex gap-1.5">
            <input className={inputCls} inputMode="decimal" value={f.valueAmount} onChange={(e) => set('valueAmount', e.target.value.replace(/[^\d.]/g, ''))} />
            <input className={`${inputCls} w-[64px] uppercase`} maxLength={3} value={f.currency} onChange={(e) => set('currency', e.target.value.toUpperCase())} aria-label={L('Currency', 'Tiền tệ')} />
          </div>
        </label>
        <label><Label hint={`${L('stage default', 'mặc định')} ${meta.probability[deal.stage]}%`}>{L('Probability %', 'Xác suất %')}</Label>
          <input className={inputCls} inputMode="numeric" placeholder={L('auto', 'tự động')} value={f.probability} onChange={(e) => set('probability', e.target.value.replace(/\D/g, '').slice(0, 3))} />
        </label>
        <label><Label>{L('Expected close', 'Ngày dự kiến chốt')}</Label><input type="date" className={inputCls} value={f.expectedCloseAt} onChange={(e) => set('expectedCloseAt', e.target.value)} /></label>
        <label><Label>{L('Source', 'Nguồn')}</Label><input className={inputCls} value={f.source} onChange={(e) => set('source', e.target.value)} /></label>
      </div>

      {/* NDA */}
      <div className="rounded-[9px] border border-[var(--a-border)] p-3">
        <div className="mb-2 flex items-center gap-2 text-[12.5px] font-medium text-[var(--a-text)]"><FileSignature className="h-3.5 w-3.5" /> NDA</div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex items-center gap-2 text-[12.5px] text-[var(--a-text-2)]">
            <input type="checkbox" checked={f.ndaSigned} onChange={(e) => set('ndaSigned', e.target.checked)} data-testid="nda-signed" /> {L('NDA signed', 'Đã ký NDA')}
          </label>
          <input type="date" className={`${inputCls} w-auto`} value={f.ndaSignedAt} onChange={(e) => set('ndaSignedAt', e.target.value)} aria-label={L('Signed on', 'Ngày ký')} />
          {deal.hasNdaFile ? (
            <>
              <button className={btn} onClick={openNda}><FileText className="h-3.5 w-3.5" /> {deal.ndaFileName}</button>
              <button className={btn} onClick={async () => { await crmApi.deleteNda(deal.id).catch(() => {}); reload(); }} aria-label={L('Remove file', 'Xoá tệp')}><Trash2 className="h-3.5 w-3.5" /></button>
            </>
          ) : (
            <label className={`${btn} cursor-pointer`}>
              {busy === 'nda' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />} {L('Upload file', 'Tải tệp lên')}
              <input type="file" className="hidden" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" onChange={(e) => { const fl = e.target.files?.[0]; if (fl) void uploadNda(fl); e.target.value = ''; }} />
            </label>
          )}
        </div>
        <p className="mt-2 text-[11.5px] text-[var(--a-text-3)]">{L('Files are private (R2), opened through a 10-minute signed link. Template: ', 'Tệp riêng tư (R2), mở qua link ký 10 phút. Mẫu: ')}<a className="underline" href="/quy-trinh/mau/nda.md" target="_blank" rel="noreferrer">nda.md</a></p>
      </div>

      <div className="flex items-center gap-2">
        <button className={btnPrimary} onClick={save} disabled={busy === 'save'} data-testid="deal-save">
          {busy === 'save' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />} {L('Save', 'Lưu')}
        </button>
      </div>

      {/* Người liên hệ */}
      {deal.contact && (
        <div className="rounded-[9px] border border-[var(--a-border)] p-3 text-[12.5px] text-[var(--a-text-2)]">
          <Label>{L('Contact details', 'Thông tin liên hệ')}</Label>
          <p className="font-medium text-[var(--a-text)]">{deal.contact.name}{deal.contact.title ? ` · ${deal.contact.title}` : ''}</p>
          <p className="break-all">{deal.contact.email ?? '—'} · {deal.contact.phone ?? '—'}</p>
          <p className="mt-1 text-[11.5px] text-[var(--a-text-3)]">
            {deal.contact.consent ? L(`Consent recorded ${fmtDate(deal.contact.consentAt, true)}`, `Đã đồng ý lúc ${fmtDate(deal.contact.consentAt, true)}`) : L('No consent on record', 'Chưa ghi nhận đồng ý')}
          </p>
        </div>
      )}

      {/* Dòng thời gian giai đoạn */}
      <div>
        <Label>{L('Stage history', 'Lịch sử giai đoạn')}</Label>
        <ol className="space-y-1">
          {deal.stageChanges.map((s) => (
            <li key={s.id} className="flex items-center gap-2 text-[12px] text-[var(--a-text-2)]">
              <span className="w-[120px] shrink-0 tabular-nums text-[var(--a-text-3)]">{fmtDate(s.at, true)}</span>
              {s.fromStage ? `${STAGE_LABEL[s.fromStage as DealStage]?.[vi ? 1 : 0] ?? s.fromStage} → ` : ''}
              <b className="font-medium text-[var(--a-text)]">{STAGE_LABEL[s.toStage as DealStage]?.[vi ? 1 : 0] ?? s.toStage}</b>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

// ─── Hoạt động ──────────────────────────────────────────────────

function Activity({ deal, reload }: { deal: DealDetail; reload: () => void }) {
  const { vi, L } = useAdminT();
  const [type, setType] = useState<ActivityType>('NOTE');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [due, setDue] = useState('');
  const [busy, setBusy] = useState(false);

  async function add() {
    if (!subject.trim()) return;
    setBusy(true);
    try {
      await crmApi.createActivity({ dealId: deal.id, type, subject, body: body || null, dueAt: type === 'TASK' && due ? new Date(due).toISOString() : null });
      setSubject(''); setBody(''); setDue('');
      reload();
    } catch (e) { toast.error(errMsg(e, L('Could not add', 'Không thêm được')).message); } finally { setBusy(false); }
  }
  async function toggle(id: number, done: boolean) {
    await crmApi.updateActivity(id, { done }).catch((e) => toast.error(errMsg(e, 'Error').message));
    reload();
  }
  const now = Date.now();
  return (
    <div className="space-y-4 p-4">
      <div className="space-y-2 rounded-[9px] border border-[var(--a-border)] p-3">
        <div className="flex flex-wrap gap-1">
          {(['NOTE', 'CALL', 'EMAIL', 'MEETING', 'TASK'] as ActivityType[]).map((t) => (
            <button key={t} onClick={() => setType(t)} className={`h-7 rounded-[6px] px-2.5 text-[12px] font-medium ${type === t ? 'bg-[var(--a-active)] text-[var(--a-text)]' : 'text-[var(--a-text-3)] hover:bg-[var(--a-hover)]'}`}>
              {ACTIVITY_LABEL[t][vi ? 1 : 0]}
            </button>
          ))}
        </div>
        <input className={inputCls} placeholder={L('Subject', 'Tiêu đề')} value={subject} onChange={(e) => setSubject(e.target.value)} data-testid="activity-subject" />
        <textarea className={areaCls} rows={3} placeholder={L('Details (optional)', 'Chi tiết (tuỳ chọn)')} value={body} onChange={(e) => setBody(e.target.value)} />
        <div className="flex flex-wrap items-center gap-2">
          {type === 'TASK' && (
            <label className="flex items-center gap-2 text-[12px] text-[var(--a-text-3)]">
              <CalendarClock className="h-3.5 w-3.5" /> {L('Due', 'Hạn')}
              <input type="datetime-local" className={`${inputCls} w-auto`} value={due} onChange={(e) => setDue(e.target.value)} />
            </label>
          )}
          <button className={`${btnPrimary} ml-auto`} onClick={add} disabled={busy || !subject.trim()}>
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />} {L('Add', 'Thêm')}
          </button>
        </div>
      </div>

      <ol className="space-y-2">
        {deal.activities.map((a) => {
          const overdue = a.type === 'TASK' && !a.done && a.dueAt && new Date(a.dueAt).getTime() < now;
          return (
            <li key={a.id} className="rounded-[9px] border border-[var(--a-border)] p-3">
              <div className="flex items-start gap-2">
                {a.type === 'TASK' ? (
                  <input type="checkbox" className="mt-0.5" checked={a.done} onChange={(e) => toggle(a.id, e.target.checked)} aria-label={L('Done', 'Xong')} />
                ) : null}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Chip>{ACTIVITY_LABEL[a.type]?.[vi ? 1 : 0] ?? a.type}</Chip>
                    <span className={`text-[12.5px] font-medium ${a.done && a.type === 'TASK' ? 'text-[var(--a-text-3)] line-through' : 'text-[var(--a-text)]'}`}>{a.subject}</span>
                  </div>
                  {a.body && <p className="mt-1 whitespace-pre-wrap break-words text-[12px] text-[var(--a-text-2)]">{a.body}</p>}
                  <p className="mt-1 text-[11px] tabular-nums text-[var(--a-text-3)]">
                    {fmtDate(a.createdAt, true)}
                    {a.dueAt && <span className={overdue ? 'ml-2 font-semibold text-[color:var(--a-red)]' : 'ml-2'}>· {L('due', 'hạn')} {fmtDate(a.dueAt, true)}</span>}
                  </p>
                </div>
                <button className="rounded p-1 text-[var(--a-text-3)] hover:text-[color:var(--a-red)]" aria-label={L('Delete', 'Xoá')} onClick={async () => { await crmApi.deleteActivity(a.id).catch(() => {}); reload(); }}>
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </li>
          );
        })}
        {!deal.activities.length && <p className="py-6 text-center text-[12px] text-[var(--a-text-3)]">{L('No activity yet', 'Chưa có hoạt động')}</p>}
      </ol>
    </div>
  );
}

// ─── Bảng đánh giá phù hợp (go/no-go) ───────────────────────────

const DECISIONS: Array<{ v: Decision; en: string; vi: string; tone: string }> = [
  { v: 'GO', en: 'Go', vi: 'Go', tone: 'var(--a-green)' },
  { v: 'GO_CONDITIONAL', en: 'Conditional go', vi: 'Go có điều kiện', tone: 'var(--a-yellow)' },
  { v: 'NO_GO', en: 'No-go', vi: 'No-go', tone: 'var(--a-red)' },
];

function QualificationTab({ deal, meta, reload }: { deal: DealDetail; meta: CrmMeta; reload: () => void }) {
  const { vi, L } = useAdminT();
  const q = deal.qualification;
  const [scores, setScores] = useState<Record<string, number | null>>(() => ({ ...(q.scores ?? {}) }));
  const [notes, setNotes] = useState<Record<string, string>>(() => ({ ...(q.notes ?? {}) }));
  const [risks, setRisks] = useState(q.risks ?? '');
  const [decision, setDecision] = useState<Decision | null>(q.decision ?? null);
  const [conditions, setConditions] = useState(q.conditions ?? '');
  const [reason, setReason] = useState(q.reason ?? '');
  const [busy, setBusy] = useState(false);

  const total = meta.criteria.reduce((s, c) => s + (scores[String(c.n)] ?? 0), 0);
  const answered = meta.criteria.filter((c) => scores[String(c.n)] !== undefined && scores[String(c.n)] !== null).length;
  const hardFail = meta.criteria.some((c) => c.hard && scores[String(c.n)] === 0);
  const suggestion: Decision | null = hardFail ? 'NO_GO' : answered === meta.criteria.length ? (total >= 15 ? 'GO' : total >= 10 ? 'GO_CONDITIONAL' : 'NO_GO') : null;

  async function save() {
    setBusy(true);
    try {
      await crmApi.qualification(deal.id, { scores, notes, risks: risks || null, decision, conditions: conditions || null, reason: reason || null });
      toast.success(L('Checklist saved', 'Đã lưu bảng đánh giá'));
      reload();
    } catch (e) { toast.error(errMsg(e, L('Save failed', 'Lưu thất bại')).message); } finally { setBusy(false); }
  }

  return (
    <div className="space-y-4 p-4" data-testid="qualification">
      <p className="text-[12px] text-[var(--a-text-3)]">
        {L('Qualification scorecard (0 = no · 1 = unclear · 2 = yes). Criteria 7, 8, 9 at 0 ⇒ no-go regardless of total. ≥15 go · 10–14 conditional · <10 no-go. Template: ',
          'Bảng đánh giá phù hợp (0 = không đạt · 1 = chưa rõ · 2 = đạt). Tiêu chí 7, 8, 9 bằng 0 ⇒ từ chối bất kể tổng. ≥15 go · 10–14 có điều kiện · <10 no-go. Mẫu: ')}
        <a className="underline" href="/quy-trinh/mau/checklist-danh-gia-phu-hop.md" target="_blank" rel="noreferrer">checklist-danh-gia-phu-hop.md</a>
      </p>
      <ol className="divide-y divide-[var(--a-border)] rounded-[9px] border border-[var(--a-border)]">
        {meta.criteria.map((c) => {
          const k = String(c.n);
          return (
            <li key={c.n} className="grid gap-2 p-3 sm:grid-cols-[1fr_auto]">
              <div className="min-w-0">
                <p className="text-[12.5px] font-medium text-[var(--a-text)]">
                  {c.n}. {vi ? c.vi : c.en} {c.hard && <span className="ml-1 text-[10.5px] font-semibold text-[color:var(--a-red)]">{L('HARD', 'CỨNG')}</span>}
                </p>
                <p className="text-[11.5px] text-[var(--a-text-3)]">{vi ? c.q : c.qEn}</p>
                <input className={`${inputCls} mt-1.5 h-7 text-[12px]`} placeholder={L('Evidence / note', 'Bằng chứng / ghi chú')} value={notes[k] ?? ''} onChange={(e) => setNotes((n) => ({ ...n, [k]: e.target.value }))} />
              </div>
              <div className="flex items-start gap-1" role="radiogroup" aria-label={`${c.n}`}>
                {[0, 1, 2].map((v) => (
                  <button
                    key={v}
                    role="radio"
                    aria-checked={scores[k] === v}
                    data-score={`${c.n}-${v}`}
                    onClick={() => setScores((s) => ({ ...s, [k]: s[k] === v ? null : v }))}
                    className={`h-8 w-9 rounded-[7px] border text-[12.5px] font-semibold tabular-nums ${
                      scores[k] === v
                        ? v === 0 ? 'border-[color:var(--a-red)] text-[color:var(--a-red)]' : v === 1 ? 'border-[color:var(--a-yellow)] text-[color:var(--a-yellow)]' : 'border-[color:var(--a-green)] text-[color:var(--a-green)]'
                        : 'border-[var(--a-border)] text-[var(--a-text-3)] hover:border-[var(--a-border-strong)]'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </li>
          );
        })}
      </ol>
      <div className="flex flex-wrap items-center gap-3 text-[13px]">
        <span className="tabular-nums font-semibold text-[var(--a-text)]">{L('Total', 'Tổng')} {total}/20</span>
        <span className="text-[var(--a-text-3)]">{answered}/10 {L('scored', 'đã chấm')}</span>
        {suggestion && <span className="text-[var(--a-text-2)]">{L('Suggestion', 'Gợi ý')}: <b>{DECISIONS.find((d) => d.v === suggestion)?.[vi ? 'vi' : 'en']}</b></span>}
        {hardFail && <Chip tone="var(--a-red)">{L('hard fail', 'dính luật cứng')}</Chip>}
      </div>
      <label className="block"><Label>{L('Major early risks', 'Rủi ro lớn ban đầu')}</Label><textarea className={areaCls} rows={3} value={risks} onChange={(e) => setRisks(e.target.value)} /></label>
      <div>
        <Label>{L('Decision', 'Quyết định')}</Label>
        <div className="flex flex-wrap gap-1.5">
          {DECISIONS.map((d) => (
            <button
              key={d.v}
              data-decision={d.v}
              onClick={() => setDecision(decision === d.v ? null : d.v)}
              className={`h-8 rounded-[7px] border px-3 text-[12.5px] font-medium ${decision === d.v ? '' : 'border-[var(--a-border)] text-[var(--a-text-3)]'}`}
              style={decision === d.v ? { borderColor: d.tone, color: d.tone } : undefined}
            >
              {vi ? d.vi : d.en}
            </button>
          ))}
        </div>
      </div>
      {decision === 'GO_CONDITIONAL' && (
        <label className="block"><Label>{L('Conditions', 'Điều kiện')}</Label><textarea className={areaCls} rows={2} value={conditions} onChange={(e) => setConditions(e.target.value)} /></label>
      )}
      <label className="block"><Label>{L('Reason', 'Lý do')}</Label><textarea className={areaCls} rows={2} value={reason} onChange={(e) => setReason(e.target.value)} /></label>
      {q.decidedAt && <p className="text-[11.5px] text-[var(--a-text-3)]">{L('Decided', 'Quyết lúc')} {fmtDate(q.decidedAt, true)}</p>}
      <button className={btnPrimary} onClick={save} disabled={busy} data-testid="qualification-save">
        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ClipboardCheck className="h-3.5 w-3.5" />} {L('Save checklist', 'Lưu bảng đánh giá')}
      </button>
    </div>
  );
}

// ─── Đề xuất ────────────────────────────────────────────────────

const PROPOSAL_TONE: Record<CrmProposal['status'], string> = {
  DRAFT: 'var(--a-text-3)', SENT: 'var(--a-blue)', ACCEPTED: 'var(--a-green)', REJECTED: 'var(--a-red)',
};

function ProposalEditor({ p, meta, reload }: { p: CrmProposal; meta: CrmMeta; reload: () => void }) {
  const { L } = useAdminT();
  const [title, setTitle] = useState(p.title);
  const [content, setContent] = useState(p.content);
  const [preview, setPreview] = useState(p.status !== 'DRAFT');
  const [days, setDays] = useState(meta.proposalTtl.default);
  const [busy, setBusy] = useState<string | null>(null);
  const dirty = title !== p.title || content !== p.content;

  async function run(key: string, fn: () => Promise<unknown>, ok: string) {
    setBusy(key);
    try { await fn(); toast.success(ok); reload(); } catch (e) { toast.error(errMsg(e, 'Error').message); } finally { setBusy(null); }
  }
  const copy = async () => { if (p.url) { await navigator.clipboard.writeText(p.url).catch(() => {}); toast.success(L('Link copied', 'Đã chép link')); } };

  return (
    <div className="space-y-3" data-proposal={p.version}>
      {p.status === 'DRAFT' ? (
        <>
          <p className="rounded-[8px] border border-[color:var(--a-yellow)] px-3 py-2 text-[11.5px] text-[var(--a-text-2)]">
            {L('Reference template — have an accountant/lawyer review prices, tax and legal terms before sending. Content is frozen (hashed) once sent.',
              'Mẫu tham khảo — cần kế toán/luật sư rà soát giá, thuế, điều khoản trước khi gửi. Gửi rồi là ĐÓNG BĂNG nội dung (có hash).')}
          </p>
          <input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} aria-label={L('Title', 'Tiêu đề')} />
          <div className="flex gap-1">
            <button className={`h-7 rounded-[6px] px-2.5 text-[12px] ${!preview ? 'bg-[var(--a-active)] text-[var(--a-text)]' : 'text-[var(--a-text-3)]'}`} onClick={() => setPreview(false)}>Markdown</button>
            <button className={`h-7 rounded-[6px] px-2.5 text-[12px] ${preview ? 'bg-[var(--a-active)] text-[var(--a-text)]' : 'text-[var(--a-text-3)]'}`} onClick={() => setPreview(true)}>{L('Preview', 'Xem trước')}</button>
          </div>
          {preview
            ? <div className="max-h-[60vh] overflow-y-auto rounded-[9px] border border-[var(--a-border)] p-3"><ProposalPreview content={content} /></div>
            : <textarea className={`${areaCls} font-mono text-[12px]`} rows={22} value={content} onChange={(e) => setContent(e.target.value)} data-testid="proposal-content" />}
          <div className="flex flex-wrap items-center gap-2">
            <button className={btn} disabled={!dirty || !!busy} onClick={() => run('save', () => crmApi.updateProposal(p.id, { title, content }), L('Draft saved', 'Đã lưu nháp'))}>
              {busy === 'save' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />} {L('Save draft', 'Lưu nháp')}
            </button>
            <label className="ml-auto flex items-center gap-1.5 text-[12px] text-[var(--a-text-3)]">
              {L('Link valid', 'Link hiệu lực')}
              <input className={`${inputCls} h-7 w-[56px]`} inputMode="numeric" value={days} onChange={(e) => setDays(Math.min(meta.proposalTtl.max, Math.max(1, Number(e.target.value.replace(/\D/g, '')) || 1)))} />
              {L('days', 'ngày')}
            </label>
            <button
              className={btnPrimary}
              disabled={!!busy}
              data-testid="proposal-send"
              onClick={() => run('send', async () => { if (dirty) await crmApi.updateProposal(p.id, { title, content }); await crmApi.sendProposal(p.id, days); }, L('Sent — copy the link for the client', 'Đã gửi — chép link cho khách'))}
            >
              {busy === 'send' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />} {L('Freeze & get link', 'Đóng băng & lấy link')}
            </button>
            <button className={btn} aria-label={L('Delete draft', 'Xoá nháp')} onClick={() => run('del', () => crmApi.deleteProposal(p.id), L('Draft deleted', 'Đã xoá nháp'))}><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-2 text-[12px] text-[var(--a-text-2)]">
            {p.url && p.linkState === 'OK' && (
              <>
                <code className="max-w-full truncate rounded bg-[var(--a-raised)] px-2 py-1 text-[11.5px]" data-testid="proposal-url">{p.url}</code>
                <button className={btn} onClick={copy}><Copy className="h-3.5 w-3.5" /> {L('Copy', 'Chép')}</button>
                <a className={btn} href={p.url} target="_blank" rel="noreferrer"><ExternalLink className="h-3.5 w-3.5" /></a>
                {p.status === 'SENT' && <button className={btn} onClick={() => run('revoke', () => crmApi.revokeProposal(p.id), L('Link revoked', 'Đã thu hồi link'))}><ShieldOff className="h-3.5 w-3.5" /> {L('Revoke', 'Thu hồi')}</button>}
              </>
            )}
            {p.linkState !== 'OK' && <Chip tone="var(--a-text-3)">{p.linkState}</Chip>}
          </div>
          <dl className="grid grid-cols-[120px_1fr] gap-x-3 gap-y-1 text-[12px]">
            <dt className="text-[var(--a-text-3)]">{L('Sent', 'Đã gửi')}</dt><dd className="tabular-nums">{fmtDate(p.sentAt, true)}</dd>
            <dt className="text-[var(--a-text-3)]">{L('Expires', 'Hết hạn')}</dt><dd className="tabular-nums">{fmtDate(p.tokenExpiresAt, true)}</dd>
            <dt className="text-[var(--a-text-3)]">{L('First viewed', 'Khách mở lần đầu')}</dt><dd className="tabular-nums">{fmtDate(p.viewedAt, true)}</dd>
            {p.respondedAt && (
              <>
                <dt className="text-[var(--a-text-3)]">{L('Response', 'Phản hồi')}</dt>
                <dd><b style={{ color: PROPOSAL_TONE[p.status] }}>{p.status}</b> · {p.responseName} · {fmtDate(p.respondedAt, true)}</dd>
                <dt className="text-[var(--a-text-3)]">IP · UA</dt><dd className="break-all">{p.responseIp ?? '—'} · {p.responseUserAgent?.slice(0, 80) ?? '—'}</dd>
                {p.responseNote && (<><dt className="text-[var(--a-text-3)]">{L('Note', 'Lời nhắn')}</dt><dd className="whitespace-pre-wrap">{p.responseNote}</dd></>)}
              </>
            )}
            <dt className="text-[var(--a-text-3)]">SHA-256</dt><dd className="break-all font-mono text-[11px]">{p.contentHash}</dd>
          </dl>
          <details className="rounded-[9px] border border-[var(--a-border)] p-3">
            <summary className="cursor-pointer text-[12px] text-[var(--a-text-2)]">{L('Frozen content', 'Nội dung đã đóng băng')}</summary>
            <div className="mt-2"><ProposalPreview content={p.content} /></div>
          </details>
        </>
      )}
    </div>
  );
}

function Proposals({ deal, meta, reload }: { deal: DealDetail; meta: CrmMeta; reload: () => void }) {
  const { L } = useAdminT();
  const [openId, setOpenId] = useState<number | null>(deal.proposals[0]?.id ?? null);
  const [busy, setBusy] = useState(false);
  async function create(fromVersion?: number) {
    setBusy(true);
    try { const p = await crmApi.createProposal(deal.id, fromVersion); setOpenId(p.id); reload(); }
    catch (e) { toast.error(errMsg(e, 'Error').message); } finally { setBusy(false); }
  }
  const latest = deal.proposals[0];
  const gateOk = deal.decision === 'GO' || deal.decision === 'GO_CONDITIONAL';
  return (
    <div className="space-y-3 p-4">
      {!gateOk && (
        <p className="rounded-[8px] border border-[var(--a-border)] px-3 py-2 text-[12px] text-[var(--a-text-3)]">
          {L('You can draft now; sending needs a GO on the qualification checklist.', 'Soạn được ngay; gửi cho khách cần bảng đánh giá đã quyết GO.')}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        <button className={btnPrimary} onClick={() => create()} disabled={busy} data-testid="proposal-new">
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />} {L('New from template', 'Tạo từ mẫu')}
        </button>
        {latest && <button className={btn} onClick={() => create(latest.version)} disabled={busy}><Copy className="h-3.5 w-3.5" /> {L(`New version from v${latest.version}`, `Bản mới từ v${latest.version}`)}</button>}
      </div>
      <p className="text-[11.5px] text-[var(--a-text-3)]">{L('Built from ', 'Soạn từ ')}<a className="underline" href="/quy-trinh/mau/de-xuat-giai-phap.md" target="_blank" rel="noreferrer">de-xuat-giai-phap.md</a> + <a className="underline" href="/quy-trinh/mau/bao-gia.md" target="_blank" rel="noreferrer">bao-gia.md</a></p>
      <ul className="space-y-2">
        {deal.proposals.map((p) => (
          <li key={p.id} className="rounded-[9px] border border-[var(--a-border)]">
            <button className="flex w-full items-center gap-2 px-3 py-2 text-left" onClick={() => setOpenId(openId === p.id ? null : p.id)}>
              <span className="tabular-nums text-[12px] font-semibold text-[var(--a-text)]">v{p.version}</span>
              <span className="min-w-0 flex-1 truncate text-[12.5px] text-[var(--a-text-2)]">{p.title}</span>
              <Chip tone={PROPOSAL_TONE[p.status]}>{p.status}</Chip>
            </button>
            {openId === p.id && <div className="border-t border-[var(--a-border)] p-3"><ProposalEditor key={`${p.id}-${p.status}-${p.updatedAt}`} p={p} meta={meta} reload={reload} /></div>}
          </li>
        ))}
        {!deal.proposals.length && <p className="py-6 text-center text-[12px] text-[var(--a-text-3)]">{L('No proposal yet', 'Chưa có đề xuất')}</p>}
      </ul>
    </div>
  );
}

// ─── Ngăn kéo ───────────────────────────────────────────────────

export default function DealDrawer({
  dealId, meta, tab, onTab, onClose, onChanged,
}: {
  dealId: number | null; meta: CrmMeta; tab: DealTab; onTab: (t: DealTab) => void; onClose: () => void; onChanged: () => void;
}) {
  const { L } = useAdminT();
  const [deal, setDeal] = useState<DealDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [lost, setLost] = useState<{ open: boolean; reason: string }>({ open: false, reason: '' });
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    if (!dealId) return;
    setLoading(true);
    try { setDeal(await crmApi.deal(dealId)); } catch (e) { toast.error(errMsg(e, 'Could not load the deal').message); } finally { setLoading(false); }
  }, [dealId]);
  useEffect(() => { setDeal(null); void load(); }, [load]);
  const reload = useCallback(() => { void load(); onChanged(); }, [load, onChanged]);

  async function moveStage(s: DealStage, lostReason?: string) {
    if (!deal) return;
    if (s === 'LOST' && !lostReason) { setLost({ open: true, reason: '' }); return; }
    try {
      await crmApi.stage(deal.id, s, lostReason);
      if (s === 'QUALIFIED') onTab('qualification');
      reload();
    } catch (e) {
      const m = errMsg(e, 'Error');
      toast.error(m.message);
      if (m.code === 'CRM_QUALIFICATION_REQUIRED') onTab('qualification');
    }
  }

  const tabs: Array<{ k: DealTab; label: string; n?: number }> = [
    { k: 'overview', label: L('Overview', 'Tổng quan') },
    { k: 'activity', label: L('Activity', 'Hoạt động'), n: deal?.dueTasks.length },
    { k: 'qualification', label: L('Go / no-go', 'Go / no-go') },
    { k: 'proposals', label: L('Proposals', 'Đề xuất'), n: deal?.proposals.length },
  ];

  return (
    <Drawer open={!!dealId} onClose={onClose} title={deal ? deal.title : L('Deal', 'Deal')}>
      <div className="sticky top-0 z-10 flex gap-0.5 overflow-x-auto border-b border-[var(--a-border)] bg-[var(--a-panel)] px-3 py-2">
        {tabs.map((t) => (
          <button key={t.k} data-tab={t.k} onClick={() => onTab(t.k)} className={`flex h-7 shrink-0 items-center gap-1.5 rounded-[6px] px-2.5 text-[12.5px] font-medium ${tab === t.k ? 'bg-[var(--a-active)] text-[var(--a-text)]' : 'text-[var(--a-text-3)] hover:bg-[var(--a-hover)]'}`}>
            {t.label}{t.n ? <span className="tabular-nums text-[11px] text-[var(--a-text-3)]">{t.n}</span> : null}
          </button>
        ))}
        {deal && deal.request?.status !== 'PROJECT_CREATED' && (
          <button className="ml-auto rounded p-1.5 text-[var(--a-text-3)] hover:text-[color:var(--a-red)]" aria-label={L('Delete deal', 'Xoá deal')} onClick={() => setDeleting(true)}><Trash2 className="h-3.5 w-3.5" /></button>
        )}
      </div>
      {loading && !deal && <div className="flex justify-center py-16"><Loader2 className="h-5 w-5 animate-spin text-[var(--a-text-3)]" /></div>}
      {deal && tab === 'overview' && <Overview key={`${deal.id}-${deal.stage}-${deal.ndaSigned}-${deal.hasNdaFile}`} deal={deal} meta={meta} reload={reload} onStage={(s) => moveStage(s)} />}
      {deal && tab === 'activity' && <Activity deal={deal} reload={reload} />}
      {deal && tab === 'qualification' && <QualificationTab key={deal.id} deal={deal} meta={meta} reload={reload} />}
      {deal && tab === 'proposals' && <Proposals deal={deal} meta={meta} reload={reload} />}

      <Modal open={lost.open} onClose={() => setLost({ open: false, reason: '' })} title={L('Mark as lost', 'Đánh dấu thua')}>
        <textarea className={areaCls} rows={3} autoFocus placeholder={L('Why was it lost? (required)', 'Vì sao thua? (bắt buộc)')} value={lost.reason} onChange={(e) => setLost({ open: true, reason: e.target.value })} />
        <div className="mt-3 flex justify-end gap-2">
          <button className={btn} onClick={() => setLost({ open: false, reason: '' })}>{L('Cancel', 'Huỷ')}</button>
          <button className={btnDanger} disabled={!lost.reason.trim()} onClick={() => { const r = lost.reason; setLost({ open: false, reason: '' }); void moveStage('LOST', r); }}>{L('Mark lost', 'Đánh dấu thua')}</button>
        </div>
      </Modal>
      <Modal open={deleting} onClose={() => setDeleting(false)} title={L('Delete this deal?', 'Xoá deal này?')}>
        <p className="text-[12.5px] text-[var(--a-text-2)]">{L('Activities, proposals and stage history are deleted too. The project request (if any) stays.', 'Hoạt động, đề xuất và lịch sử giai đoạn bị xoá theo. Phiếu yêu cầu (nếu có) vẫn giữ.')}</p>
        <div className="mt-3 flex justify-end gap-2">
          <button className={btn} onClick={() => setDeleting(false)}>{L('Cancel', 'Huỷ')}</button>
          <button className={btnDanger} onClick={async () => { setDeleting(false); try { await crmApi.deleteDeal(deal!.id); onChanged(); onClose(); } catch (e) { toast.error(errMsg(e, 'Error').message); } }}>{L('Delete', 'Xoá')}</button>
        </div>
      </Modal>
    </Drawer>
  );
}

/** Cho trang chính: hỏi lý do thua khi kéo thẻ sang LOST. */
export function LostReasonModal({ open, onCancel, onConfirm }: { open: boolean; onCancel: () => void; onConfirm: (reason: string) => void }) {
  const { L } = useAdminT();
  const [reason, setReason] = useState('');
  useEffect(() => { if (open) setReason(''); }, [open]);
  return (
    <Modal open={open} onClose={onCancel} title={L('Mark as lost', 'Đánh dấu thua')}>
      <textarea className={areaCls} rows={3} autoFocus placeholder={L('Why was it lost? (required)', 'Vì sao thua? (bắt buộc)')} value={reason} onChange={(e) => setReason(e.target.value)} data-testid="lost-reason" />
      <div className="mt-3 flex justify-end gap-2">
        <button className={btn} onClick={onCancel}>{L('Cancel', 'Huỷ')}</button>
        <button className={btnDanger} disabled={!reason.trim()} onClick={() => onConfirm(reason)}>{L('Mark lost', 'Đánh dấu thua')}</button>
      </div>
    </Modal>
  );
}

