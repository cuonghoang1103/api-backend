'use client';

/**
 * Tab "GitLab" — nối repo GitLab (gitlab.com hoặc GitLab của trường) qua webhook. Từ 18/10/2026 dùng chung giao diện
 * GitIntegration với GitHub (thẻ trạng thái, bước cài, thông báo + kênh chat, token chỉ đọc, tự chuyển trạng thái).
 */

import type { ProjectConfig } from '@/lib/work-api';
import GitIntegration from './GitIntegration';

export default function ProjectGitlab({ config }: { config: ProjectConfig; slug: string }) {
  return <GitIntegration config={config} provider="GITLAB" />;
}
