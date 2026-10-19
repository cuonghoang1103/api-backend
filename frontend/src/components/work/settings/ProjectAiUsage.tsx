'use client';

/** Cài đặt dự án → AI trong dự án (CTW đợt 8B, 19/10/2026). ADMIN xem cả nhóm; thành viên xem phần của mình. */

import type { ProjectConfig } from '@/lib/work-api';
import { wt } from '@/components/work/i18n';
import AiUsageView from '../aiUsage/AiUsageView';
import { Section } from './shared';

export default function ProjectAiUsage({ config }: { config: ProjectConfig; slug: string }) {
  return (
    <Section title={wt('aiu.tab')}>
      <AiUsageView scope="project" id={config.id} />
    </Section>
  );
}
