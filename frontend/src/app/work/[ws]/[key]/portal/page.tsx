'use client';

/**
 * /work/<slug>/<KEY>/portal — CỔNG KHÁCH (đợt S2b, mô-đun clientPortal).
 * Khách (vai CLIENT) vào thẳng đây (mọi trang nội bộ khác tự chuyển về — hooks.useProject).
 * Nhân viên: chế độ quản lý + "Preview as client" (`?preview=1`, chỉ đọc).
 */

import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { workError } from '@/lib/work-api';
import ProjectHeader from '@/components/work/ProjectHeader';
import HelpButton from '@/components/work/help/HelpButton';
import { useProject, useProjectRealtime } from '@/components/work/hooks';
import { EmptyState, PageLoading } from '@/components/work/ui';
import { ModuleOff, studioOn } from '@/components/work/studio/shared';
import PortalView from '@/components/work/portal/PortalView';
import { wt } from '@/components/work/i18n';

function Inner() {
  const params = useParams<{ ws: string; key: string }>();
  const { pid, config, isLoading, error } = useProject(params.ws, params.key);
  useProjectRealtime(pid);
  if (isLoading) return <PageLoading />;
  if (error || !config || !pid) return <EmptyState title={wt('common.projectNotFound')} body={error ? workError(error) : undefined} />;
  return (
    <div className="flex h-full flex-col">
      {/* tools={false}: khách không có khoá chỉnh sửa / AI — chỉ giữ nút trợ giúp. */}
      <ProjectHeader config={config} title={wt('studio.mod_clientPortal')} tools={false}><HelpButton /></ProjectHeader>
      {studioOn(config, 'clientPortal') ? <PortalView config={config} pid={pid} /> : <ModuleOff config={config} label={wt('studio.mod_clientPortal')} />}
    </div>
  );
}

export default function PortalPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <Inner />
    </Suspense>
  );
}
