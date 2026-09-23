'use client';

/**
 * Nút "Start a project" gắn được ở bất cứ đâu (trang chủ /work, trạng thái
 * trống…). Mở trình tạo dự án 2 bước; không có workspace thì trình đó tự tạo
 * "<Tên>'s workspace" — người mới không phải qua bước workspace.
 */

import { type ReactNode } from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProjectTemplate } from '@/lib/work-api';
import CreateProjectDialog from '../workspace/CreateProjectDialog';
import { useToggle } from '../ui';

export default function StartProjectButton({
  workspaceId, slug, label = 'Start a project', primary = true, small = false, className, icon, initialTemplate,
}: {
  /** Có thì tạo vào đúng workspace này; bỏ trống thì tự chọn / tự tạo. */
  workspaceId?: number;
  slug?: string;
  label?: string;
  primary?: boolean;
  small?: boolean;
  className?: string;
  icon?: ReactNode;
  initialTemplate?: ProjectTemplate;
}) {
  const dialog = useToggle();
  return (
    <>
      <button
        type="button"
        onClick={dialog.open}
        className={cn('w-btn', primary && 'w-btn-primary', small && 'w-btn-sm', className)}
      >
        {icon ?? <Plus size={small ? 13 : 14} />} {label}
      </button>
      <CreateProjectDialog open={dialog.on} onClose={dialog.close} workspaceId={workspaceId} slug={slug} initialTemplate={initialTemplate} />
    </>
  );
}
