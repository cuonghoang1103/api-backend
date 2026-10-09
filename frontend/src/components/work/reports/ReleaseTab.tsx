'use client';

/** Tab "Release" của Reports (UX-B): burnup / burndown theo version, có dự báo ngày xong. */

import { ReleaseBurnupChart } from '../charts/FlowCharts';

export default function ReleaseTab({ pid }: { pid: number }) {
  return (
    <div className="space-y-4">
      <ReleaseBurnupChart pid={pid} height={320} />
    </div>
  );
}
