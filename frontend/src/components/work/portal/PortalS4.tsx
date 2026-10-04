'use client';

/**
 * Cổng khách — đợt S4: thẻ "Payments" (mốc thanh toán ĐÃ CHIA SẺ: tên, số tiền, hạn, trạng thái, số hoá đơn —
 * không đơn giá/chi phí nội bộ) và "Reports" (lịch sử báo cáo tuần đã gửi, in được). Dữ liệu từ
 * /portal/payments + /portal/reports — server đã lọc "như khách thấy".
 */

import { useQuery } from '@tanstack/react-query';
import { Printer, Receipt } from 'lucide-react';
import { workError } from '@/lib/work-api';
import { fmtMoney, PAYMENT_STATUS_LABEL, s4Api, s4Keys, type PaymentStatus } from '@/lib/work-s4-api';
import { Dialog, EmptyState, PageLoading, formatDate, relativeTime } from '../ui';
import { Pill } from '../studio/shared';
import ReportDocument from '../reports/ReportDocument';
import { usePrintReport } from '../reports/S4ReportTabs';

const TONE: Record<PaymentStatus, 'neutral' | 'orange' | 'blue' | 'green'> = { PLANNED: 'neutral', DUE: 'orange', INVOICED: 'blue', PAID: 'green' };

export function PaymentsTab({ pid, asClient }: { pid: number; asClient: boolean }) {
  const q = useQuery({ queryKey: s4Keys.portalPayments(pid, asClient), queryFn: () => s4Api.portalPayments(pid, asClient) });
  if (q.isLoading) return <PageLoading rows={3} />;
  if (!q.data) return <EmptyState title="Could not load payments" body={workError(q.error)} />;
  if (!q.data.items.length) return <EmptyState icon={<Receipt size={20} />} title="No payment milestones shared yet" body="Your project team shares the payment schedule here." />;
  const total = q.data.items.reduce((s, m) => s + (m.amount ?? 0), 0);
  const paid = q.data.items.filter((m) => m.status === 'PAID').reduce((s, m) => s + (m.amount ?? 0), 0);
  return (
    <div className="space-y-3" data-testid="portal-payments">
      <div className="w-card flex flex-wrap gap-x-6 gap-y-1 p-4 text-[13px]">
        <span>Total shared: <b className="tabular-nums">{fmtMoney(total, q.data.currency)}</b></span>
        <span>Paid: <b className="tabular-nums">{fmtMoney(paid, q.data.currency)}</b></span>
      </div>
      <ul className="space-y-2">
        {q.data.items.map((m) => (
          <li key={m.number} className="w-card flex flex-wrap items-center gap-x-3 gap-y-1.5 px-4 py-3">
            <div className="min-w-0 flex-1 basis-[200px]">
              <div className="truncate text-[13.5px] font-medium">{m.name}</div>
              <div className="text-[12px] text-[var(--w-text-3)]">
                {m.percent ? `${m.percent}% of the contract` : 'Fixed amount'}{m.dueDate ? ` · due ${formatDate(m.dueDate)}` : ''}{m.invoiceNumber ? ` · invoice ${m.invoiceNumber}` : ''}{m.paidAt ? ` · paid ${formatDate(m.paidAt)}` : ''}
              </div>
            </div>
            <span className="text-[14px] font-semibold tabular-nums">{fmtMoney(m.amount, q.data!.currency)}</span>
            <Pill tone={TONE[m.status]}>{PAYMENT_STATUS_LABEL[m.status]}</Pill>
          </li>
        ))}
      </ul>
      <p className="text-[12px] text-[var(--w-text-3)]">Invoices are issued by your supplier’s licensed e-invoice provider; this page only tracks the schedule.</p>
    </div>
  );
}

export function ReportsTab({ pid, asClient, openId, setOpenId }: { pid: number; asClient: boolean; openId: number | null; setOpenId: (id: number | null) => void }) {
  const q = useQuery({ queryKey: s4Keys.portalReports(pid, asClient), queryFn: () => s4Api.portalReports(pid, asClient) });
  const one = useQuery({ queryKey: s4Keys.portalReport(pid, openId ?? 0, asClient), queryFn: () => s4Api.portalReport(pid, openId!, asClient), enabled: !!openId });
  const { print, node } = usePrintReport();
  if (q.isLoading) return <PageLoading rows={3} />;
  if (!q.data) return <EmptyState title="Could not load reports" body={workError(q.error)} />;
  return (
    <div className="space-y-3" data-testid="portal-reports">
      {!q.data.items.length ? <EmptyState title="No reports yet" body="Weekly updates from your project team will be kept here." /> : (
        <ul className="w-card divide-y divide-[var(--w-border)]">
          {q.data.items.map((r) => (
            <li key={r.id}>
              <button type="button" className="flex w-full flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2.5 text-left hover:bg-[var(--w-hover)]" onClick={() => setOpenId(r.id)}>
                <span className="min-w-0 flex-1 truncate text-[13.5px] font-medium">{r.title}</span>
                <span className="text-[12px] text-[var(--w-text-3)]">{r.sentAt ? relativeTime(r.sentAt) : formatDate(r.createdAt)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <Dialog open={!!openId} onClose={() => setOpenId(null)} width={860} title={one.data?.title ?? 'Report'}
        footer={one.data && <button type="button" className="w-btn" onClick={() => print({ data: one.data!.data, polished: one.data!.aiPolished ? one.data!.bodyMarkdown : null })}><Printer size={14} />Print / PDF</button>}>
        {!one.data ? <PageLoading rows={3} /> : <ReportDocument data={one.data.data} polished={one.data.aiPolished ? one.data.bodyMarkdown : null} />}
      </Dialog>
      {node}
    </div>
  );
}
