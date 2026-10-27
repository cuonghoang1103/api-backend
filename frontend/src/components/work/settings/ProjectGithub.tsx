'use client';

/**
 * Tab "GitHub" — nối repo qua webhook. Từ 18/10/2026 (trang Code) giao diện nằm ở GitIntegration (dùng chung với GitLab):
 * thẻ trạng thái, các bước cài thu gọn được, thông báo + kênh chat, token chỉ đọc, tự chuyển trạng thái.
 */

import type { ProjectConfig } from '@/lib/work-api';
import GitIntegration from './GitIntegration';
import GithubAppCard from './GithubAppCard';

export { CopyField, StatusSelect, Step } from './gitParts';

export default function ProjectGithub({ config }: { config: ProjectConfig; slug: string }) {
  // 27/10/2026: GitHub App là đường chính; token + webhook dán tay (GitIntegration) giữ làm dự phòng.
  return (
    <div className="space-y-6">
      <GithubAppCard config={config} />
      <GitIntegration config={config} provider="GITHUB" />
    </div>
  );
}
