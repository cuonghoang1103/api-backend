'use client';

/**
 * Tab "Flow" của Reports (UX-B, 10/10/2026): CFD, throughput, cycle time, aging WIP — bộ biểu đồ dòng chảy kiểu
 * Kanban/Jira. Số liệu dựng lại từ lịch sử thẻ (flowReports.service.ts); khung + xuất ở ChartFrame.
 */

import { useState } from 'react';
import { AgingWipChart, CfdChart, CycleTimeChart, Seg, ThroughputChart } from '../charts/FlowCharts';
import { wt } from '@/components/work/i18n';

export default function FlowTab({ pid, onOpenIssue }: { pid: number; onOpenIssue?: (n: number) => void }) {
  const [days, setDays] = useState<'30' | '90'>('30');
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <p className="min-w-0 flex-1 text-[12.5px] text-[var(--w-text-3)]">{wt('charts.flowIntro')}</p>
        <Seg value={days} onChange={setDays} label={wt('charts.range')} options={[['30', wt('charts.lastNDays', { n: 30 })], ['90', wt('charts.lastNDays', { n: 90 })]]} />
      </div>
      <CfdChart pid={pid} days={Number(days)} height={300} />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <ThroughputChart pid={pid} weeks={days === '90' ? 13 : 8} />
        <CycleTimeChart pid={pid} days={Number(days) < 90 ? 90 : 180} onOpenIssue={onOpenIssue} />
      </div>
      <AgingWipChart pid={pid} onOpenIssue={onOpenIssue} />
    </div>
  );
}
