'use client';

/**
 * /admin/crm — CRM nhẹ của studio (CT Work đợt S5b). CHỈ ADMIN (requireAdmin + MFA step-up nếu bật).
 *
 * Pipeline B2B tối giản: LEAD → QUALIFIED → DISCOVERY → PROPOSAL → NEGOTIATION → WON / LOST.
 * Phiếu ở /about/nhan-du-an tự thành deal LEAD; deal WON ⇒ "Create CT Work project".
 * Mở thẳng một deal: /admin/crm?deal=12 (link trong hộp thư admin). ?tab=deals|contacts|orgs|tasks|reports.
 * Đọc query bằng window.location trong effect — không dùng useSearchParams (khỏi bọc Suspense cả trang).
 */
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { DownloadCloud, Loader2, Plus, RefreshCw } from 'lucide-react';
import { useAdminT } from '@/components/admin/i18n';
import { PageHeader, Tabs } from '@/components/admin/ui';
import PipelineBoard from '@/components/admin/crm/PipelineBoard';
import DealDrawer, { LostReasonModal, type DealTab } from '@/components/admin/crm/DealDrawer';
import { ContactsView, DealsView, NewDealModal, OrgsView, ReportsView, TasksView } from '@/components/admin/crm/Views';
import { btn, btnPrimary, errMsg } from '@/components/admin/crm/shared';
import { crmApi, type CrmMeta, type DealListItem, type DealStage, type Pipeline } from '@/lib/crm-api';

type Tab = 'pipeline' | 'deals' | 'contacts' | 'orgs' | 'tasks' | 'reports';
const TABS: Tab[] = ['pipeline', 'deals', 'contacts', 'orgs', 'tasks', 'reports'];

function setQuery(params: Record<string, string | null>) {
  const u = new URL(window.location.href);
  for (const [k, v] of Object.entries(params)) { if (v === null) u.searchParams.delete(k); else u.searchParams.set(k, v); }
  window.history.replaceState(null, '', u.toString());
}

export default function AdminCrmPage() {
  const { L } = useAdminT();
  const [tab, setTab] = useState<Tab>('pipeline');
  const [meta, setMeta] = useState<CrmMeta | null>(null);
  const [pipeline, setPipeline] = useState<Pipeline | null>(null);
  const [roleplay, setRoleplay] = useState<'' | 'exclude' | 'only'>('');
  const [version, setVersion] = useState(0);
  const [openDeal, setOpenDeal] = useState<number | null>(null);
  const [dealTab, setDealTab] = useState<DealTab>('overview');
  const [lostFor, setLostFor] = useState<DealListItem | null>(null);
  const [newDeal, setNewDeal] = useState(false);
  const [busy, setBusy] = useState(false);
  const [initialStale, setInitialStale] = useState(false);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const t = p.get('tab') as Tab | null;
    if (t && TABS.includes(t)) setTab(t);
    if (p.get('stale') === '1') setInitialStale(true);
    const id = Number(p.get('deal'));
    if (Number.isInteger(id) && id > 0) setOpenDeal(id);
    crmApi.meta().then(setMeta).catch((e) => toast.error(errMsg(e, 'Could not load CRM').message));
  }, []);

  const loadPipeline = useCallback(async () => {
    try { setPipeline(await crmApi.pipeline({ roleplay: roleplay || undefined })); }
    catch (e) { toast.error(errMsg(e, 'Could not load the pipeline').message); }
  }, [roleplay]);
  useEffect(() => { if (tab === 'pipeline') void loadPipeline(); }, [tab, loadPipeline, version]);

  const changed = useCallback(() => setVersion((v) => v + 1), []);
  const open = useCallback((id: number, t: DealTab = 'overview') => { setDealTab(t); setOpenDeal(id); setQuery({ deal: String(id) }); }, []);
  const close = useCallback(() => { setOpenDeal(null); setQuery({ deal: null }); }, []);

  async function move(deal: DealListItem, to: DealStage, lostReason?: string) {
    if (to === 'LOST' && !lostReason) { setLostFor(deal); return; }
    // Lạc quan: dời thẻ ngay, lỗi thì tải lại.
    setPipeline((p) => (p ? { ...p, deals: p.deals.map((d) => (d.id === deal.id ? { ...d, stage: to } : d)) } : p));
    try {
      await crmApi.stage(deal.id, to, lostReason);
      if (to === 'QUALIFIED') open(deal.id, 'qualification');
    } catch (e) {
      const m = errMsg(e, L('Move failed', 'Chuyển thất bại'));
      toast.error(m.message);
      if (m.code === 'CRM_QUALIFICATION_REQUIRED') open(deal.id, 'qualification');
    } finally {
      changed();
    }
  }

  async function backfill() {
    setBusy(true);
    try { const r = await crmApi.backfill(); toast.success(L(`${r.created} deal(s) created from requests`, `Đã tạo ${r.created} deal từ phiếu`)); changed(); }
    catch (e) { toast.error(errMsg(e, 'Error').message); } finally { setBusy(false); }
  }

  const tabLabel: Record<Tab, string> = {
    pipeline: L('Pipeline', 'Pipeline'), deals: L('Deals', 'Deal'), contacts: L('Contacts', 'Người liên hệ'),
    orgs: L('Organizations', 'Tổ chức'), tasks: L('Tasks', 'Việc cần làm'), reports: L('Reports', 'Báo cáo'),
  };

  return (
    <div className="admin-crm">
      <PageHeader
        title="CRM"
        description={L('Studio pipeline — leads from /about/nhan-du-an, go/no-go, proposals, won deals become CT Work projects.',
          'Pipeline của studio — lead từ /about/nhan-du-an, go/no-go, đề xuất, deal thắng thành dự án CT Work.')}
        actions={(
          <>
            <button className={btn} onClick={backfill} disabled={busy} title={L('Create deals for requests sent before the CRM existed', 'Tạo deal cho phiếu gửi trước khi có CRM')}>
              {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <DownloadCloud className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">{L('Import requests', 'Nhập từ phiếu')}</span>
            </button>
            <button className={btn} onClick={changed} aria-label={L('Refresh', 'Tải lại')}><RefreshCw className="h-3.5 w-3.5" /></button>
            <button className={btnPrimary} onClick={() => setNewDeal(true)} disabled={!meta}><Plus className="h-3.5 w-3.5" /> {L('New deal', 'Deal mới')}</button>
          </>
        )}
      />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {/* Điện thoại: hàng tab cuộn ngang trong khung riêng, chữ không xuống dòng. */}
        <div className="min-w-0 max-w-full overflow-x-auto [scrollbar-width:none] [&_button]:shrink-0 [&_button]:whitespace-nowrap">
          <Tabs value={tab} onChange={(t) => { setTab(t); setQuery({ tab: t === 'pipeline' ? null : t }); }} items={TABS.map((t) => ({ value: t, label: tabLabel[t] }))} />
        </div>
        {tab === 'pipeline' && (
          <select className="ml-auto h-7 rounded-[6px] border border-[var(--a-border)] bg-[var(--a-raised)] px-2 text-[12px] text-[var(--a-text-2)]" value={roleplay} onChange={(e) => setRoleplay(e.target.value as '' | 'exclude' | 'only')} aria-label={L('Roleplay filter', 'Lọc nhập vai')}>
            <option value="">{L('Real + roleplay', 'Thật + nhập vai')}</option>
            <option value="exclude">{L('Real only', 'Chỉ khách thật')}</option>
            <option value="only">{L('Roleplay only', 'Chỉ nhập vai')}</option>
          </select>
        )}
      </div>

      {!meta ? (
        <div className="flex justify-center py-20"><Loader2 className="h-5 w-5 animate-spin text-[var(--a-text-3)]" /></div>
      ) : (
        <>
          {tab === 'pipeline' && (pipeline ? <PipelineBoard pipeline={pipeline} onOpen={(id) => open(id)} onMove={(d, s) => void move(d, s)} /> : <div className="flex justify-center py-20"><Loader2 className="h-5 w-5 animate-spin text-[var(--a-text-3)]" /></div>)}
          {tab === 'deals' && <DealsView meta={meta} onOpen={(id) => open(id)} version={version} initialStale={initialStale} />}
          {tab === 'contacts' && <ContactsView version={version} onOpenDeal={(id) => open(id)} onChanged={changed} />}
          {tab === 'orgs' && <OrgsView version={version} />}
          {tab === 'tasks' && <TasksView version={version} onOpen={(id) => open(id, 'activity')} />}
          {tab === 'reports' && <ReportsView version={version} />}

          <DealDrawer dealId={openDeal} meta={meta} tab={dealTab} onTab={setDealTab} onClose={close} onChanged={changed} />
          <NewDealModal open={newDeal} meta={meta} onClose={() => setNewDeal(false)} onCreated={(id) => { setNewDeal(false); changed(); open(id); }} />
          <LostReasonModal
            open={!!lostFor}
            onCancel={() => setLostFor(null)}
            onConfirm={(reason) => { const d = lostFor!; setLostFor(null); void move(d, 'LOST', reason); }}
          />
        </>
      )}
    </div>
  );
}
