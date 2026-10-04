'use client';

/**
 * Các bảng của /admin/crm: Deals · Contacts · Organizations · Tasks · Reports + hộp "New deal".
 * Contacts mang hai nút của quyền chủ thể dữ liệu (Luật BVDLCN 91/2025 + NĐ 356/2025):
 * xuất JSON và xoá/ẩn danh (giữ số liệu deal).
 */
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { AlertTriangle, Download, Loader2, Plus, Search, ShieldAlert, Trash2, UserX } from 'lucide-react';
import { useAdminT } from '@/components/admin/i18n';
import { EmptyState, Metric } from '@/components/admin/ui';
import {
  crmApi, DEAL_STAGES, type CrmContact, type CrmMeta, type CrmOrg, type CrmReport, type DealListItem, type DealStage, type DueTask,
} from '@/lib/crm-api';
import {
  CHANNEL_LABEL, Chip, Drawer, Label, Modal, PACKAGE_LABEL, STAGE_LABEL, STAGE_TONE, StageDot, TableWrap, areaCls, btn, btnDanger,
  btnPrimary, errMsg, fmtDate, fmtMoney, fmtMoneyMap, inputCls, tdCls, thCls,
} from './shared';

function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <label className="relative block min-w-0 flex-1 sm:max-w-[320px]">
      <Search className="pointer-events-none absolute left-2.5 top-2 h-4 w-4 text-[var(--a-text-3)]" />
      <input className={`${inputCls} pl-8`} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </label>
  );
}

function useDebounced<T>(v: T, ms = 300): T {
  const [d, setD] = useState(v);
  useEffect(() => { const t = setTimeout(() => setD(v), ms); return () => clearTimeout(t); }, [v, ms]);
  return d;
}

// ─── Deals ──────────────────────────────────────────────────────

export function DealsView({ meta, onOpen, version, initialStale }: { meta: CrmMeta; onOpen: (id: number) => void; version: number; initialStale?: boolean }) {
  const { vi, L } = useAdminT();
  const [q, setQ] = useState('');
  const dq = useDebounced(q);
  const [stage, setStage] = useState<DealStage | ''>('');
  const [owner, setOwner] = useState('');
  const [pkg, setPkg] = useState('');
  const [stale, setStale] = useState(!!initialStale);
  const [roleplay, setRoleplay] = useState<'' | 'only' | 'exclude'>('');
  const [rows, setRows] = useState<DealListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let off = false;
    setLoading(true);
    crmApi.deals({ q: dq || undefined, stage: stage || undefined, owner: owner ? Number(owner) : undefined, package: pkg || undefined, stale: stale ? '1' : undefined, roleplay: roleplay || undefined, limit: 200 })
      .then((r) => { if (!off) { setRows(r.items); setTotal(r.total); } })
      .catch((e) => toast.error(errMsg(e, 'Error').message))
      .finally(() => { if (!off) setLoading(false); });
    return () => { off = true; };
  }, [dq, stage, owner, pkg, stale, roleplay, version]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <SearchBox value={q} onChange={setQ} placeholder={L('Search title, org, contact, YC code…', 'Tìm tiêu đề, tổ chức, người, mã YC…')} />
        <select className={`${inputCls} w-auto`} value={stage} onChange={(e) => setStage(e.target.value as DealStage | '')} aria-label={L('Stage', 'Giai đoạn')}>
          <option value="">{L('All stages', 'Mọi giai đoạn')}</option>
          {DEAL_STAGES.map((s) => <option key={s} value={s}>{STAGE_LABEL[s][vi ? 1 : 0]}</option>)}
        </select>
        <select className={`${inputCls} w-auto`} value={owner} onChange={(e) => setOwner(e.target.value)} aria-label={L('Owner', 'Người phụ trách')}>
          <option value="">{L('Any owner', 'Mọi người phụ trách')}</option>
          {meta.owners.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
        </select>
        <select className={`${inputCls} w-auto`} value={pkg} onChange={(e) => setPkg(e.target.value)} aria-label={L('Package', 'Gói')}>
          <option value="">{L('Any package', 'Mọi gói')}</option>
          {meta.packages.map((p) => <option key={p} value={p}>{PACKAGE_LABEL[p]?.[vi ? 1 : 0] ?? p}</option>)}
        </select>
        <select className={`${inputCls} w-auto`} value={roleplay} onChange={(e) => setRoleplay(e.target.value as '' | 'only' | 'exclude')} aria-label={L('Roleplay', 'Nhập vai')}>
          <option value="">{L('Real + roleplay', 'Thật + nhập vai')}</option>
          <option value="exclude">{L('Real only', 'Chỉ khách thật')}</option>
          <option value="only">{L('Roleplay only', 'Chỉ nhập vai')}</option>
        </select>
        <label className="inline-flex items-center gap-1.5 text-[12.5px] text-[var(--a-text-2)]">
          <input type="checkbox" checked={stale} onChange={(e) => setStale(e.target.checked)} /> {L(`Stale (> ${meta.staleDays} days)`, `Stale (> ${meta.staleDays} ngày)`)}
        </label>
        <span className="ml-auto tabular-nums text-[12px] text-[var(--a-text-3)]">{loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : `${total} deals`}</span>
      </div>
      <TableWrap>
        <table className="w-full min-w-[860px] border-collapse">
          <thead><tr>
            <th className={thCls}>{L('Deal', 'Deal')}</th><th className={thCls}>{L('Stage', 'Giai đoạn')}</th>
            <th className={`${thCls} text-right`}>{L('Value', 'Giá trị')}</th><th className={`${thCls} text-right`}>%</th>
            <th className={`${thCls} text-right`}>{L('Weighted', 'Trọng số')}</th><th className={thCls}>{L('Close', 'Chốt')}</th>
            <th className={thCls}>{L('Owner', 'Phụ trách')}</th><th className={thCls}>{L('Last activity', 'Hoạt động cuối')}</th>
          </tr></thead>
          <tbody>
            {rows.map((d) => (
              <tr key={d.id} className="cursor-pointer hover:bg-[var(--a-hover)]" onClick={() => onOpen(d.id)} data-deal-row={d.id}>
                <td className={tdCls}>
                  <div className="max-w-[300px] truncate font-medium text-[var(--a-text)]">{d.title}</div>
                  <div className="truncate text-[11.5px] text-[var(--a-text-3)]">{d.org?.name ?? d.contact?.name ?? '—'}{d.request ? ` · ${d.request.code}` : ''}</div>
                </td>
                <td className={tdCls}><StageDot stage={d.stage} label={STAGE_LABEL[d.stage][vi ? 1 : 0]} /></td>
                <td className={`${tdCls} text-right tabular-nums`}>{fmtMoney(d.value, d.currency)}</td>
                <td className={`${tdCls} text-right tabular-nums`}>{d.effectiveProbability}</td>
                <td className={`${tdCls} text-right tabular-nums`}>{d.value ? fmtMoney(d.weighted, d.currency) : '—'}</td>
                <td className={`${tdCls} tabular-nums`}>{fmtDate(d.expectedCloseAt)}</td>
                <td className={tdCls}>{d.owner?.name ?? '—'}</td>
                <td className={`${tdCls} tabular-nums`}>
                  {fmtDate(d.lastActivityAt)} {d.stale && <AlertTriangle className="ml-1 inline h-3.5 w-3.5 text-[color:var(--a-orange)]" aria-label="stale" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrap>
      {!loading && !rows.length && <EmptyState title={L('No deals match', 'Không có deal khớp')} />}
    </div>
  );
}

// ─── Contacts ───────────────────────────────────────────────────

function ContactPanel({ id, onClose, onChanged, onOpenDeal }: { id: number | null; onClose: () => void; onChanged: () => void; onOpenDeal: (id: number) => void }) {
  const { vi, L } = useAdminT();
  const [c, setC] = useState<Awaited<ReturnType<typeof crmApi.contact>> | null>(null);
  const [f, setF] = useState<Partial<CrmContact>>({});
  const [orgs, setOrgs] = useState<CrmOrg[]>([]);
  const [erase, setErase] = useState<{ open: boolean; mode: 'anonymize' | 'delete'; typed: string }>({ open: false, mode: 'anonymize', typed: '' });
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    try { const r = await crmApi.contact(id); setC(r); setF({ name: r.name, title: r.title, email: r.email, phone: r.phone, orgId: r.orgId, preferredChannel: r.preferredChannel, consent: r.consent, note: r.note }); }
    catch (e) { toast.error(errMsg(e, 'Error').message); }
  }, [id]);
  useEffect(() => { setC(null); void load(); }, [load]);
  useEffect(() => { crmApi.orgs().then((r) => setOrgs(r.items)).catch(() => {}); }, []);

  async function save() {
    if (!c) return;
    setBusy('save');
    try { await crmApi.updateContact(c.id, { ...f, email: f.email || null }); toast.success(L('Saved', 'Đã lưu')); await load(); onChanged(); }
    catch (e) { toast.error(errMsg(e, 'Error').message); } finally { setBusy(null); }
  }
  async function exportJson() {
    if (!c) return;
    setBusy('export');
    try {
      const blob = await crmApi.exportContact(c.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `contact-${c.id}-export.json`; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } catch (e) { toast.error(errMsg(e, 'Export failed').message); } finally { setBusy(null); }
  }
  async function doErase() {
    if (!c) return;
    setBusy('erase');
    try {
      const r = await crmApi.eraseContact(c.id, erase.mode);
      toast.success(L(
        `Done — ${r.deletedRequests} request(s) deleted${r.keptRequests.length ? `, kept (contract): ${r.keptRequests.join(', ')}` : ''}`,
        `Xong — xoá ${r.deletedRequests} phiếu${r.keptRequests.length ? `, giữ (hợp đồng): ${r.keptRequests.join(', ')}` : ''}`,
      ), { duration: 6000 });
      setErase({ open: false, mode: 'anonymize', typed: '' });
      onChanged();
      if (erase.mode === 'delete') onClose(); else await load();
    } catch (e) { toast.error(errMsg(e, 'Error').message); } finally { setBusy(null); }
  }

  const anon = !!c?.anonymizedAt;
  return (
    <Drawer open={!!id} onClose={onClose} title={c ? c.name : L('Contact', 'Người liên hệ')} width="max-w-[560px]">
      {!c ? <div className="flex justify-center py-16"><Loader2 className="h-5 w-5 animate-spin text-[var(--a-text-3)]" /></div> : (
        <div className="space-y-4 p-4">
          {anon && <p className="rounded-[8px] border border-[var(--a-border)] px-3 py-2 text-[12px] text-[var(--a-text-3)]">{L('Anonymized on', 'Đã ẩn danh lúc')} {fmtDate(c.anonymizedAt, true)}</p>}
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="sm:col-span-2"><Label>{L('Name', 'Họ tên')}</Label><input className={inputCls} disabled={anon} value={f.name ?? ''} onChange={(e) => setF({ ...f, name: e.target.value })} /></label>
            <label><Label>{L('Job title', 'Chức vụ')}</Label><input className={inputCls} disabled={anon} value={f.title ?? ''} onChange={(e) => setF({ ...f, title: e.target.value })} /></label>
            <label><Label>{L('Organization', 'Tổ chức')}</Label>
              <select className={inputCls} disabled={anon} value={f.orgId ?? ''} onChange={(e) => setF({ ...f, orgId: e.target.value ? Number(e.target.value) : null })}>
                <option value="">—</option>{orgs.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
              </select>
            </label>
            <label><Label>Email</Label><input className={inputCls} disabled={anon} type="email" value={f.email ?? ''} onChange={(e) => setF({ ...f, email: e.target.value })} /></label>
            <label><Label>{L('Phone', 'SĐT')}</Label><input className={inputCls} disabled={anon} value={f.phone ?? ''} onChange={(e) => setF({ ...f, phone: e.target.value })} /></label>
            <label><Label>{L('Preferred channel', 'Kênh ưa thích')}</Label>
              <select className={inputCls} disabled={anon} value={f.preferredChannel ?? ''} onChange={(e) => setF({ ...f, preferredChannel: e.target.value || null })}>
                <option value="">—</option>{Object.keys(CHANNEL_LABEL).map((k) => <option key={k} value={k}>{CHANNEL_LABEL[k][vi ? 1 : 0]}</option>)}
              </select>
            </label>
            <div>
              <Label>{L('Consent to contact', 'Đồng ý được liên hệ')}</Label>
              <label className="inline-flex items-center gap-2 text-[12.5px] text-[var(--a-text-2)]">
                <input type="checkbox" disabled={anon} checked={!!f.consent} onChange={(e) => setF({ ...f, consent: e.target.checked })} /> {f.consent ? L('Yes', 'Có') : L('No', 'Không')}
              </label>
              <p className="mt-0.5 text-[11px] text-[var(--a-text-3)]">{fmtDate(c.consentAt, true)} · {c.consentSource ?? '—'}</p>
            </div>
            <label className="sm:col-span-2"><Label>{L('Note', 'Ghi chú')}</Label><textarea className={areaCls} rows={3} disabled={anon} value={f.note ?? ''} onChange={(e) => setF({ ...f, note: e.target.value })} /></label>
          </div>
          {!anon && <button className={btnPrimary} onClick={save} disabled={busy === 'save'}>{L('Save', 'Lưu')}</button>}

          <div>
            <Label>{L('Deals', 'Deal')}</Label>
            <ul className="space-y-1">
              {c.deals.map((d) => (
                <li key={d.id}><button className="flex w-full items-center gap-2 rounded-[7px] px-2 py-1.5 text-left hover:bg-[var(--a-hover)]" onClick={() => onOpenDeal(d.id)}>
                  <StageDot stage={d.stage} label="" /><span className="min-w-0 flex-1 truncate text-[12.5px] text-[var(--a-text)]">{d.title}</span>
                  <span className="tabular-nums text-[12px] text-[var(--a-text-3)]">{fmtMoney(d.value, d.currency, true)}</span>
                </button></li>
              ))}
              {!c.deals.length && <li className="text-[12px] text-[var(--a-text-3)]">—</li>}
            </ul>
          </div>

          <div className="rounded-[9px] border border-[var(--a-border)] p-3">
            <div className="mb-1 flex items-center gap-1.5 text-[12.5px] font-medium text-[var(--a-text)]"><ShieldAlert className="h-3.5 w-3.5" /> {L('Data subject rights', 'Quyền của chủ thể dữ liệu')}</div>
            <p className="mb-2 text-[11.5px] text-[var(--a-text-3)]">
              {L('Personal Data Protection Law 91/2025/QH15 + Decree 356/2025: export everything we hold about this person, or erase it. Deal numbers are kept; requests that became a contract are kept.',
                'Luật BVDLCN 91/2025/QH15 + NĐ 356/2025: xuất mọi dữ liệu về người này, hoặc xoá. Số liệu deal giữ lại; phiếu đã thành hợp đồng được giữ.')}
            </p>
            <div className="flex flex-wrap gap-2">
              <button className={btn} onClick={exportJson} disabled={busy === 'export'} data-testid="contact-export"><Download className="h-3.5 w-3.5" /> {L('Export JSON', 'Xuất JSON')}</button>
              {!anon && <button className={btnDanger} onClick={() => setErase({ open: true, mode: 'anonymize', typed: '' })} data-testid="contact-erase"><UserX className="h-3.5 w-3.5" /> {L('Anonymize / delete', 'Ẩn danh / xoá')}</button>}
            </div>
          </div>
        </div>
      )}
      <Modal open={erase.open} onClose={() => setErase({ ...erase, open: false })} title={L('Erase personal data', 'Xoá dữ liệu cá nhân')}>
        <div className="space-y-3 text-[12.5px] text-[var(--a-text-2)]">
          <label className="flex items-start gap-2"><input type="radio" checked={erase.mode === 'anonymize'} onChange={() => setErase({ ...erase, mode: 'anonymize' })} />
            <span><b>{L('Anonymize', 'Ẩn danh hoá')}</b> — {L('remove name/email/phone/notes, keep an anonymous record', 'xoá tên/email/SĐT/ghi chú, giữ một bản ghi vô danh')}</span></label>
          <label className="flex items-start gap-2"><input type="radio" checked={erase.mode === 'delete'} onChange={() => setErase({ ...erase, mode: 'delete' })} />
            <span><b>{L('Delete', 'Xoá hẳn')}</b> — {L('remove the contact row entirely', 'xoá hẳn dòng người liên hệ')}</span></label>
          <p className="text-[11.5px] text-[var(--a-text-3)]">{L('Both: activity text about this person is wiped, unconverted project requests are deleted, deal values/stages stay.', 'Cả hai: nội dung hoạt động về người này bị xoá, phiếu chưa thành dự án bị xoá, giá trị/giai đoạn deal giữ nguyên.')}</p>
          <label className="block"><Label>{L('Type ERASE to confirm', 'Gõ XOA để xác nhận')}</Label>
            <input className={inputCls} value={erase.typed} onChange={(e) => setErase({ ...erase, typed: e.target.value })} data-testid="erase-confirm" /></label>
          <div className="flex justify-end gap-2">
            <button className={btn} onClick={() => setErase({ ...erase, open: false })}>{L('Cancel', 'Huỷ')}</button>
            <button className={btnDanger} disabled={!['ERASE', 'XOA', 'XOÁ'].includes(erase.typed.trim().toUpperCase()) || busy === 'erase'} onClick={doErase} data-testid="erase-go">
              {busy === 'erase' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />} {L('Erase', 'Xoá')}
            </button>
          </div>
        </div>
      </Modal>
    </Drawer>
  );
}

export function ContactsView({ version, onOpenDeal, onChanged }: { version: number; onOpenDeal: (id: number) => void; onChanged: () => void }) {
  const { vi, L } = useAdminT();
  const [q, setQ] = useState('');
  const dq = useDebounced(q);
  const [anon, setAnon] = useState(false);
  const [rows, setRows] = useState<CrmContact[]>([]);
  const [open, setOpen] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [nf, setNf] = useState({ name: '', email: '', phone: '', title: '', consent: false });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    crmApi.contacts(dq || undefined, anon ? { anonymized: '1' } : {}).then((r) => setRows(r.items)).catch((e) => toast.error(errMsg(e, 'Error').message));
  }, [dq, anon, version, tick]);

  async function create() {
    try {
      const c = await crmApi.createContact({ name: nf.name, email: nf.email || null, phone: nf.phone || null, title: nf.title || null, consent: nf.consent });
      setCreating(false); setNf({ name: '', email: '', phone: '', title: '', consent: false }); setTick((t) => t + 1); setOpen(c.id);
    } catch (e) { toast.error(errMsg(e, 'Error').message); }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <SearchBox value={q} onChange={setQ} placeholder={L('Search name, email, phone, org…', 'Tìm tên, email, SĐT, tổ chức…')} />
        <label className="inline-flex items-center gap-1.5 text-[12.5px] text-[var(--a-text-2)]"><input type="checkbox" checked={anon} onChange={(e) => setAnon(e.target.checked)} /> {L('Include anonymized', 'Gồm người đã ẩn danh')}</label>
        <button className={`${btnPrimary} ml-auto`} onClick={() => setCreating(true)}><Plus className="h-3.5 w-3.5" /> {L('New contact', 'Người liên hệ mới')}</button>
      </div>
      <TableWrap>
        <table className="w-full min-w-[720px] border-collapse">
          <thead><tr>
            <th className={thCls}>{L('Name', 'Họ tên')}</th><th className={thCls}>{L('Organization', 'Tổ chức')}</th><th className={thCls}>Email</th>
            <th className={thCls}>{L('Phone', 'SĐT')}</th><th className={thCls}>{L('Channel', 'Kênh')}</th><th className={thCls}>{L('Consent', 'Đồng ý')}</th><th className={`${thCls} text-right`}>Deals</th>
          </tr></thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id} className="cursor-pointer hover:bg-[var(--a-hover)]" onClick={() => setOpen(c.id)} data-contact-row={c.id}>
                <td className={tdCls}><span className="font-medium text-[var(--a-text)]">{c.name}</span>{c.title ? <span className="text-[var(--a-text-3)]"> · {c.title}</span> : null}{c.anonymizedAt && <span className="ml-1"><Chip>anon</Chip></span>}</td>
                <td className={tdCls}>{c.org?.name ?? '—'}</td>
                <td className={`${tdCls} max-w-[220px] truncate`}>{c.email ?? '—'}</td>
                <td className={tdCls}>{c.phone ?? '—'}</td>
                <td className={tdCls}>{c.preferredChannel ? CHANNEL_LABEL[c.preferredChannel]?.[vi ? 1 : 0] ?? c.preferredChannel : '—'}</td>
                <td className={tdCls}>{c.consent ? <span className="text-[color:var(--a-green)]">✓</span> : '—'}</td>
                <td className={`${tdCls} text-right tabular-nums`}>{c._count?.deals ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrap>
      {!rows.length && <EmptyState title={L('No contacts', 'Chưa có người liên hệ')} />}
      <ContactPanel id={open} onClose={() => setOpen(null)} onChanged={() => { setTick((t) => t + 1); onChanged(); }} onOpenDeal={(d) => { setOpen(null); onOpenDeal(d); }} />
      <Modal open={creating} onClose={() => setCreating(false)} title={L('New contact', 'Người liên hệ mới')}>
        <div className="space-y-2.5">
          <label className="block"><Label>{L('Name', 'Họ tên')}</Label><input className={inputCls} value={nf.name} onChange={(e) => setNf({ ...nf, name: e.target.value })} /></label>
          <label className="block"><Label>Email</Label><input className={inputCls} type="email" value={nf.email} onChange={(e) => setNf({ ...nf, email: e.target.value })} /></label>
          <label className="block"><Label>{L('Phone', 'SĐT')}</Label><input className={inputCls} value={nf.phone} onChange={(e) => setNf({ ...nf, phone: e.target.value })} /></label>
          <label className="block"><Label>{L('Job title', 'Chức vụ')}</Label><input className={inputCls} value={nf.title} onChange={(e) => setNf({ ...nf, title: e.target.value })} /></label>
          <label className="inline-flex items-center gap-2 text-[12.5px] text-[var(--a-text-2)]"><input type="checkbox" checked={nf.consent} onChange={(e) => setNf({ ...nf, consent: e.target.checked })} /> {L('Person agreed to be contacted (time is recorded)', 'Người này đồng ý được liên hệ (ghi thời điểm)')}</label>
          <div className="flex justify-end"><button className={btnPrimary} disabled={nf.name.trim().length < 1} onClick={create}>{L('Create', 'Tạo')}</button></div>
        </div>
      </Modal>
    </div>
  );
}

// ─── Organizations ──────────────────────────────────────────────

export function OrgsView({ version }: { version: number }) {
  const { L } = useAdminT();
  const [q, setQ] = useState('');
  const dq = useDebounced(q);
  const [rows, setRows] = useState<CrmOrg[]>([]);
  const [edit, setEdit] = useState<Partial<CrmOrg> | null>(null);
  const [tick, setTick] = useState(0);
  useEffect(() => { crmApi.orgs(dq || undefined).then((r) => setRows(r.items)).catch((e) => toast.error(errMsg(e, 'Error').message)); }, [dq, version, tick]);

  async function save() {
    if (!edit?.name?.trim()) return;
    const body = { name: edit.name, industry: edit.industry || null, size: edit.size || null, website: edit.website || null, taxCode: edit.taxCode || null, note: edit.note || null };
    try {
      if (edit.id) await crmApi.updateOrg(edit.id, body); else await crmApi.createOrg(body as CrmOrg);
      setEdit(null); setTick((t) => t + 1);
    } catch (e) { toast.error(errMsg(e, 'Error').message); }
  }
  async function remove(id: number) {
    try { await crmApi.deleteOrg(id); setEdit(null); setTick((t) => t + 1); } catch (e) { toast.error(errMsg(e, 'Error').message); }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <SearchBox value={q} onChange={setQ} placeholder={L('Search name, industry, tax code…', 'Tìm tên, ngành, MST…')} />
        <button className={`${btnPrimary} ml-auto`} onClick={() => setEdit({ name: '' })}><Plus className="h-3.5 w-3.5" /> {L('New organization', 'Tổ chức mới')}</button>
      </div>
      <TableWrap>
        <table className="w-full min-w-[640px] border-collapse">
          <thead><tr>
            <th className={thCls}>{L('Name', 'Tên')}</th><th className={thCls}>{L('Industry', 'Ngành')}</th><th className={thCls}>{L('Size', 'Quy mô')}</th>
            <th className={thCls}>{L('Tax code', 'MST')}</th><th className={`${thCls} text-right`}>{L('Contacts', 'Người')}</th><th className={`${thCls} text-right`}>Deals</th>
          </tr></thead>
          <tbody>
            {rows.map((o) => (
              <tr key={o.id} className="cursor-pointer hover:bg-[var(--a-hover)]" onClick={() => setEdit(o)}>
                <td className={tdCls}><span className="font-medium text-[var(--a-text)]">{o.name}</span>{o.website ? <span className="text-[var(--a-text-3)]"> · {o.website}</span> : null}</td>
                <td className={tdCls}>{o.industry ?? '—'}</td><td className={tdCls}>{o.size ?? '—'}</td><td className={`${tdCls} tabular-nums`}>{o.taxCode ?? '—'}</td>
                <td className={`${tdCls} text-right tabular-nums`}>{o._count?.contacts ?? 0}</td><td className={`${tdCls} text-right tabular-nums`}>{o._count?.deals ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrap>
      {!rows.length && <EmptyState title={L('No organizations', 'Chưa có tổ chức')} />}
      <Modal open={!!edit} onClose={() => setEdit(null)} title={edit?.id ? L('Edit organization', 'Sửa tổ chức') : L('New organization', 'Tổ chức mới')}>
        {edit && (
          <div className="space-y-2.5">
            <label className="block"><Label>{L('Name', 'Tên')}</Label><input className={inputCls} value={edit.name ?? ''} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></label>
            <div className="grid grid-cols-2 gap-2">
              <label><Label>{L('Industry', 'Ngành')}</Label><input className={inputCls} value={edit.industry ?? ''} onChange={(e) => setEdit({ ...edit, industry: e.target.value })} /></label>
              <label><Label>{L('Size', 'Quy mô')}</Label><input className={inputCls} placeholder="11-50" value={edit.size ?? ''} onChange={(e) => setEdit({ ...edit, size: e.target.value })} /></label>
              <label><Label>Website</Label><input className={inputCls} value={edit.website ?? ''} onChange={(e) => setEdit({ ...edit, website: e.target.value })} /></label>
              <label><Label hint={L('optional', 'tuỳ chọn')}>{L('Tax code', 'MST')}</Label><input className={inputCls} value={edit.taxCode ?? ''} onChange={(e) => setEdit({ ...edit, taxCode: e.target.value })} /></label>
            </div>
            <label className="block"><Label>{L('Note', 'Ghi chú')}</Label><textarea className={areaCls} rows={3} value={edit.note ?? ''} onChange={(e) => setEdit({ ...edit, note: e.target.value })} /></label>
            <div className="flex justify-between gap-2">
              {edit.id ? <button className={btnDanger} onClick={() => remove(edit.id!)}><Trash2 className="h-3.5 w-3.5" /> {L('Delete', 'Xoá')}</button> : <span />}
              <button className={btnPrimary} onClick={save} disabled={!edit.name?.trim()}>{L('Save', 'Lưu')}</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ─── Tasks ──────────────────────────────────────────────────────

export function TasksView({ version, onOpen }: { version: number; onOpen: (id: number) => void }) {
  const { L } = useAdminT();
  const [rows, setRows] = useState<DueTask[]>([]);
  const [days, setDays] = useState(7);
  const [tick, setTick] = useState(0);
  useEffect(() => { crmApi.dueTasks(days).then(setRows).catch((e) => toast.error(errMsg(e, 'Error').message)); }, [days, version, tick]);
  const now = Date.now();
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2 text-[12.5px] text-[var(--a-text-2)]">
        {L('Open tasks due within', 'Việc chưa xong, hạn trong')}
        <select className={`${inputCls} w-auto`} value={days} onChange={(e) => setDays(Number(e.target.value))}>
          {[0, 7, 14, 30].map((d) => <option key={d} value={d}>{d === 0 ? L('overdue only', 'chỉ quá hạn') : `${d} ${L('days', 'ngày')}`}</option>)}
        </select>
        <span className="text-[11.5px] text-[var(--a-text-3)]">{L('Admins are notified (inbox) once when a task falls due.', 'Admin được báo (hộp thư) một lần khi việc tới hạn.')}</span>
      </div>
      <ul className="divide-y divide-[var(--a-border)] rounded-[9px] border border-[var(--a-border)]">
        {rows.map((t) => {
          const overdue = t.dueAt && new Date(t.dueAt).getTime() < now;
          return (
            <li key={t.id} className="flex items-center gap-3 px-3 py-2.5">
              <input type="checkbox" aria-label={L('Done', 'Xong')} onChange={async () => { await crmApi.updateActivity(t.id, { done: true }).catch(() => {}); setTick((x) => x + 1); }} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12.5px] font-medium text-[var(--a-text)]">{t.subject}</p>
                <p className="truncate text-[11.5px] text-[var(--a-text-3)]">{t.deal ? <button className="hover:underline" onClick={() => onOpen(t.deal!.id)}>{t.deal.title}</button> : t.contact?.name ?? '—'}</p>
              </div>
              <span className={`shrink-0 tabular-nums text-[12px] ${overdue ? 'font-semibold text-[color:var(--a-red)]' : 'text-[var(--a-text-2)]'}`}>{fmtDate(t.dueAt, true)}</span>
            </li>
          );
        })}
        {!rows.length && <li className="px-3 py-8 text-center text-[12px] text-[var(--a-text-3)]">{L('Nothing due', 'Không có việc tới hạn')}</li>}
      </ul>
    </div>
  );
}

// ─── Reports ────────────────────────────────────────────────────

const pct = (v: number | null) => (v === null ? '—' : `${Math.round(v * 1000) / 10}%`);

export function ReportsView({ version }: { version: number }) {
  const { vi, L } = useAdminT();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [rp, setRp] = useState(false);
  const [r, setR] = useState<CrmReport | null>(null);
  useEffect(() => {
    crmApi.reports({ from: from || undefined, to: to || undefined, roleplay: rp ? '1' : undefined }).then(setR).catch((e) => toast.error(errMsg(e, 'Error').message));
  }, [from, to, rp, version]);
  if (!r) return <div className="flex justify-center py-16"><Loader2 className="h-5 w-5 animate-spin text-[var(--a-text-3)]" /></div>;
  const maxReach = Math.max(1, ...r.funnel.map((f) => f.reached));
  const forecastMax = Math.max(1, ...r.forecast.map((m) => Object.values(m.weighted).reduce((a, b) => a + b, 0)));
  return (
    <div className="space-y-6" data-testid="crm-reports">
      <div className="flex flex-wrap items-end gap-2">
        <label><Label>{L('Created from', 'Tạo từ ngày')}</Label><input type="date" className={`${inputCls} w-auto`} value={from} onChange={(e) => setFrom(e.target.value)} /></label>
        <label><Label>{L('to', 'đến')}</Label><input type="date" className={`${inputCls} w-auto`} value={to} onChange={(e) => setTo(e.target.value)} /></label>
        <label className="mb-1.5 inline-flex items-center gap-1.5 text-[12.5px] text-[var(--a-text-2)]"><input type="checkbox" checked={rp} onChange={(e) => setRp(e.target.checked)} /> {L('Include roleplay', 'Gồm nhập vai')}</label>
      </div>
      <div className="grid grid-cols-2 border-y border-[var(--a-border)] sm:grid-cols-5">
        <Metric label={L('Open deals', 'Deal đang mở')} value={r.open} />
        <Metric label={L('Won', 'Thắng')} value={r.won} tone="var(--a-green)" />
        <Metric label={L('Lost', 'Thua')} value={r.lost} tone="var(--a-red)" />
        <Metric label={L('Win rate', 'Tỷ lệ thắng')} value={pct(r.winRate)} hint={L('won ÷ (won + lost)', 'thắng ÷ (thắng + thua)')} />
        <Metric label={L('Avg. cycle', 'Chu kỳ TB')} value={r.avgCycleDays === null ? '—' : `${r.avgCycleDays} ${L('d', 'ngày')}`} hint={L('created → won', 'tạo → thắng')} />
      </div>

      <section>
        <h3 className="mb-2 text-[12.5px] font-medium text-[var(--a-text-2)]">{L('Stage conversion (highest stage reached)', 'Chuyển đổi giữa giai đoạn (theo bậc cao nhất đã chạm)')}</h3>
        <ol className="space-y-1.5">
          {r.funnel.map((f) => (
            <li key={f.stage} className="grid grid-cols-[96px_1fr_92px] items-center gap-2 text-[12px]">
              <span className="text-[var(--a-text-2)]">{STAGE_LABEL[f.stage][vi ? 1 : 0]}</span>
              <span className="h-5 rounded-[4px] bg-[var(--a-raised)]">
                <span className="block h-5 rounded-[4px]" style={{ width: `${(f.reached / maxReach) * 100}%`, background: STAGE_TONE[f.stage], opacity: 0.75 }} />
              </span>
              <span className="tabular-nums text-right text-[var(--a-text-2)]">{f.reached}{f.conversionToNext !== null ? ` · ↓${pct(f.conversionToNext)}` : ''}</span>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h3 className="mb-2 text-[12.5px] font-medium text-[var(--a-text-2)]">{L('Monthly forecast (open deals, value × probability)', 'Dự báo theo tháng (deal mở, giá trị × xác suất)')}</h3>
        <TableWrap>
          <table className="w-full min-w-[520px] border-collapse">
            <thead><tr><th className={thCls}>{L('Month', 'Tháng')}</th><th className={`${thCls} text-right`}>Deals</th><th className={`${thCls} text-right`}>{L('Total', 'Tổng')}</th><th className={`${thCls} text-right`}>{L('Weighted', 'Trọng số')}</th><th className={thCls} /></tr></thead>
            <tbody>
              {r.forecast.map((m) => (
                <tr key={m.month}>
                  <td className={`${tdCls} tabular-nums`}>{m.month}</td><td className={`${tdCls} text-right tabular-nums`}>{m.deals}</td>
                  <td className={`${tdCls} text-right tabular-nums`}>{fmtMoneyMap(m.total)}</td><td className={`${tdCls} text-right tabular-nums font-medium text-[var(--a-text)]`}>{fmtMoneyMap(m.weighted)}</td>
                  <td className={`${tdCls} w-[30%]`}><span className="block h-2 rounded bg-[var(--a-accent)]" style={{ width: `${(Object.values(m.weighted).reduce((a, b) => a + b, 0) / forecastMax) * 100}%` }} /></td>
                </tr>
              ))}
              <tr><td className={`${tdCls} text-[var(--a-text-3)]`}>{L('No close date', 'Chưa có ngày chốt')}</td><td className={`${tdCls} text-right tabular-nums`}>{r.unscheduled.deals}</td><td className={tdCls} /><td className={`${tdCls} text-right tabular-nums`}>{fmtMoneyMap(r.unscheduled.weighted)}</td><td className={tdCls} /></tr>
            </tbody>
          </table>
        </TableWrap>
        <p className="mt-1 text-[11px] text-[var(--a-text-3)]">{L('Currencies are never converted — each is summed separately.', 'Không quy đổi tiền tệ — mỗi loại cộng riêng.')}</p>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <h3 className="mb-2 text-[12.5px] font-medium text-[var(--a-text-2)]">{L('Lead sources', 'Nguồn lead')}</h3>
          <TableWrap>
            <table className="w-full min-w-[440px] border-collapse">
              <thead><tr><th className={thCls}>{L('Source', 'Nguồn')}</th><th className={`${thCls} text-right`}>Deals</th><th className={`${thCls} text-right`}>{L('Won', 'Thắng')}</th><th className={`${thCls} text-right`}>{L('Win rate', 'Tỷ lệ')}</th><th className={`${thCls} text-right`}>{L('Won value', 'Giá trị thắng')}</th></tr></thead>
              <tbody>
                {r.sources.map((s) => (
                  <tr key={s.source}><td className={`${tdCls} max-w-[200px] truncate`}>{s.source}</td><td className={`${tdCls} text-right tabular-nums`}>{s.deals}</td><td className={`${tdCls} text-right tabular-nums`}>{s.won}</td><td className={`${tdCls} text-right tabular-nums`}>{pct(s.winRate)}</td><td className={`${tdCls} text-right tabular-nums`}>{fmtMoneyMap(s.wonValue)}</td></tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        </section>
        <section>
          <h3 className="mb-2 text-[12.5px] font-medium text-[var(--a-text-2)]">{L('Packages of interest', 'Gói được quan tâm')}</h3>
          <TableWrap>
            <table className="w-full min-w-[320px] border-collapse">
              <thead><tr><th className={thCls}>{L('Package', 'Gói')}</th><th className={`${thCls} text-right`}>Deals</th><th className={`${thCls} text-right`}>{L('Won', 'Thắng')}</th></tr></thead>
              <tbody>
                {r.packages.map((p) => (
                  <tr key={p.packageId}><td className={tdCls}>{PACKAGE_LABEL[p.packageId]?.[vi ? 1 : 0] ?? p.packageId}</td><td className={`${tdCls} text-right tabular-nums`}>{p.deals}</td><td className={`${tdCls} text-right tabular-nums`}>{p.won}</td></tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        </section>
      </div>
    </div>
  );
}

// ─── New deal ───────────────────────────────────────────────────

export function NewDealModal({ open, meta, onClose, onCreated }: { open: boolean; meta: CrmMeta; onClose: () => void; onCreated: (id: number) => void }) {
  const { vi, L } = useAdminT();
  const [f, setF] = useState({ title: '', orgId: '', contactId: '', packageId: '', value: '', currency: 'VND', close: '', stage: 'LEAD' as DealStage });
  const [orgs, setOrgs] = useState<CrmOrg[]>([]);
  const [contacts, setContacts] = useState<CrmContact[]>([]);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!open) return;
    crmApi.orgs().then((r) => setOrgs(r.items)).catch(() => {});
    crmApi.contacts().then((r) => setContacts(r.items)).catch(() => {});
  }, [open]);
  async function create() {
    setBusy(true);
    try {
      const d = await crmApi.createDeal({
        title: f.title, orgId: f.orgId ? Number(f.orgId) : null, contactId: f.contactId ? Number(f.contactId) : null, packageId: f.packageId || null,
        valueAmount: f.value ? Number(f.value) : null, currency: f.currency || 'VND', expectedCloseAt: f.close || null, stage: f.stage,
      });
      setF({ title: '', orgId: '', contactId: '', packageId: '', value: '', currency: 'VND', close: '', stage: 'LEAD' });
      onCreated(d.id);
    } catch (e) { toast.error(errMsg(e, 'Error').message); } finally { setBusy(false); }
  }
  return (
    <Modal open={open} onClose={onClose} title={L('New deal', 'Deal mới')}>
      <div className="space-y-2.5">
        <label className="block"><Label>{L('Title', 'Tiêu đề')}</Label><input className={inputCls} value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></label>
        <div className="grid grid-cols-2 gap-2">
          <label><Label>{L('Organization', 'Tổ chức')}</Label><select className={inputCls} value={f.orgId} onChange={(e) => setF({ ...f, orgId: e.target.value })}><option value="">—</option>{orgs.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}</select></label>
          <label><Label>{L('Contact', 'Người liên hệ')}</Label><select className={inputCls} value={f.contactId} onChange={(e) => setF({ ...f, contactId: e.target.value })}><option value="">—</option>{contacts.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
          <label><Label>{L('Package', 'Gói')}</Label><select className={inputCls} value={f.packageId} onChange={(e) => setF({ ...f, packageId: e.target.value })}><option value="">—</option>{meta.packages.map((p) => <option key={p} value={p}>{PACKAGE_LABEL[p]?.[vi ? 1 : 0] ?? p}</option>)}</select></label>
          <label><Label>{L('Stage', 'Giai đoạn')}</Label><select className={inputCls} value={f.stage} onChange={(e) => setF({ ...f, stage: e.target.value as DealStage })}>{meta.createStages.map((s) => <option key={s} value={s}>{STAGE_LABEL[s][vi ? 1 : 0]}</option>)}</select></label>
          <label><Label>{L('Est. value', 'Giá trị ước tính')}</Label><input className={inputCls} inputMode="decimal" value={f.value} onChange={(e) => setF({ ...f, value: e.target.value.replace(/[^\d.]/g, '') })} /></label>
          <label><Label>{L('Currency', 'Tiền tệ')}</Label><input className={`${inputCls} uppercase`} maxLength={3} value={f.currency} onChange={(e) => setF({ ...f, currency: e.target.value.toUpperCase() })} /></label>
          <label className="col-span-2"><Label>{L('Expected close', 'Ngày dự kiến chốt')}</Label><input type="date" className={inputCls} value={f.close} onChange={(e) => setF({ ...f, close: e.target.value })} /></label>
        </div>
        <div className="flex justify-end"><button className={btnPrimary} disabled={busy || f.title.trim().length < 2} onClick={create}>{busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />} {L('Create', 'Tạo')}</button></div>
      </div>
    </Modal>
  );
}
