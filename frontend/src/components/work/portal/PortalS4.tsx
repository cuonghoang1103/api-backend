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
import { wt } from '@/components/work/i18n';

const TONE: Record<PaymentStatus, 'neutral' | 'orange' | 'blue' | 'green'> = { PLANNED: 'neutral', DUE: 'orange', INVOICED: 'blue', PAID: 'green' };

export function PaymentsTab({ pid, asClient }: { pid: number; asClient: boolean }) {
  const q = useQuery({ queryKey: s4Keys.portalPayments(pid, asClient), queryFn: () => s4Api.portalPayments(pid, asClient) });
  if (q.isLoading) return <PageLoading rows={3} />;
  if (!q.data) return <EmptyState title={wt('portal.loadPaymentsFailed')} body={workError(q.error)} />;
  if (!q.data.items.length) return <EmptyState icon={<Receipt size={20} />} title={wt('portal.noPayments')} body={wt('portal.noPaymentsBody')} />;
  const total = q.data.items.reduce((s, m) => s + (m.amount ?? 0), 0);
  const paid = q.data.items.filter((m) => m.status === 'PAID').reduce((s, m) => s + (m.amount ?? 0), 0);
  return (
    <div className="space-y-3" data-testid="portal-payments">
      <div className="w-card flex flex-wrap gap-x-6 gap-y-1 p-4 text-[13px]">
        <span>{wt('portal.totalShared')} <b className="tabular-nums">{fmtMoney(total, q.data.currency)}</b></span>
        <span>{wt('portal.paid')} <b className="tabular-nums">{fmtMoney(paid, q.data.currency)}</b></span>
      </div>
      <ul className="space-y-2">
        {q.data.items.map((m) => (
          <li key={m.number} className="w-card flex flex-wrap items-center gap-x-3 gap-y-1.5 px-4 py-3">
            <div className="min-w-0 flex-1 basis-[200px]">
              <div className="truncate text-[13.5px] font-medium">{m.name}</div>
              <div className="text-[12px] text-[var(--w-text-3)]">
                {m.percent ? wt('portal.pctContract', { n: m.percent }) : wt('portal.fixedAmount')}{m.dueDate ? wt('portal.dueSp', { d: formatDate(m.dueDate) }) : ''}{m.invoiceNumber ? wt('portal.invoiceSp', { n: m.invoiceNumber }) : ''}{m.paidAt ? wt('portal.paidSp', { d: formatDate(m.paidAt) }) : ''}
              </div>
            </div>
            <span className="text-[14px] font-semibold tabular-nums">{fmtMoney(m.amount, q.data!.currency)}</span>
            <Pill tone={TONE[m.status]}>{PAYMENT_STATUS_LABEL[m.status]}</Pill>
          </li>
        ))}
      </ul>
      <p className="text-[12px] text-[var(--w-text-3)]">{wt('portal.invoiceNote')}</p>
    </div>
  );
}

export function ReportsTab({ pid, asClient, openId, setOpenId }: { pid: number; asClient: boolean; openId: number | null; setOpenId: (id: number | null) => void }) {
  const q = useQuery({ queryKey: s4Keys.portalReports(pid, asClient), queryFn: () => s4Api.portalReports(pid, asClient) });
  const one = useQuery({ queryKey: s4Keys.portalReport(pid, openId ?? 0, asClient), queryFn: () => s4Api.portalReport(pid, openId!, asClient), enabled: !!openId });
  const { print, node } = usePrintReport();
  if (q.isLoading) return <PageLoading rows={3} />;
  if (!q.data) return <EmptyState title={wt('portal.loadReportsFailed')} body={workError(q.error)} />;
  return (
    <div className="space-y-3" data-testid="portal-reports">
      {!q.data.items.length ? <EmptyState title={wt('portal.noReports')} body={wt('portal.noReportsBody')} /> : (
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
      <Dialog open={!!openId} onClose={() => setOpenId(null)} width={860} title={one.data?.title ?? wt('rep.report')}
        footer={one.data && <button type="button" className="w-btn" onClick={() => print({ data: one.data!.data, polished: one.data!.aiPolished ? one.data!.bodyMarkdown : null })}><Printer size={14} />{wt('rep.printPdf')}</button>}>
        {!one.data ? <PageLoading rows={3} /> : <ReportDocument data={one.data.data} polished={one.data.aiPolished ? one.data.bodyMarkdown : null} />}
      </Dialog>
      {node}
    </div>
  );
}
