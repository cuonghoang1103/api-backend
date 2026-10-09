'use client';

/** /work/<slug>/<KEY>/meetings/<n> — một cuộc họp (chương trình, biên bản, việc cần làm) (đợt S3b, mô-đun meetings). */

import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import ProjectHeader from '@/components/work/ProjectHeader';
import { PageFocusButton } from '@/components/work/shell/panes'; // UX-E: Focus / Full width
import { useProject, useProjectRealtime } from '@/components/work/hooks';
import { EmptyState, PageLoading } from '@/components/work/ui';
import { ModuleOff, studioOn } from '@/components/work/studio/shared';
import MeetingDetail from '@/components/work/governance/MeetingDetail';
import { ShareToChannelButton } from '@/components/work/chat/ShareToChannel';
import { workError } from '@/lib/work-api';

function Inner() {
  const params = useParams<{ ws: string; key: string; num: string }>();
  const { pid, config, isLoading, error } = useProject(params.ws, params.key);
  useProjectRealtime(pid);
  if (isLoading) return <PageLoading />;
  if (error || !config || !pid) return <EmptyState title="Project not found" body={error ? workError(error) : undefined} />;
  return (
    <div className="flex h-full flex-col">
      <ProjectHeader config={config} title="Meeting">
        {/* CTW K-3: chia sẻ cuộc họp vào kênh chat. */}
        {config.permissions.viewGovernance && <ShareToChannelButton pid={config.id} path={`/work/${config.workspace.slug}/${config.key}/meetings/${params.num}`} label={`Meeting ${params.num}`} wsSlug={config.workspace.slug} projectKey={config.key} />}
        <PageFocusButton scope="meeting" />
      </ProjectHeader>
      {!studioOn(config, 'meetings') ? <ModuleOff config={config} label="The Meetings module" />
        : !config.permissions.viewGovernance ? <EmptyState title="Only for the project team" body="Meeting minutes and action items are internal to the team. Meetings you are invited to appear in the client portal." />
          : <MeetingDetail config={config} num={Number(params.num)} key={params.num} />}
    </div>
  );
}

export default function Page() {
  return <Suspense fallback={<PageLoading />}><Inner /></Suspense>;
}
