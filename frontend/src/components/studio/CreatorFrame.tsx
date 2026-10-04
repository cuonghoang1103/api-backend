'use client';

/**
 * Phần khung DÙNG CHUNG của Content Creator (04/10/2026).
 *
 *  - `CreatorModals`: hai hộp thoại toàn cục (Dự án mới, Tạo series) — mở được từ
 *    mọi trang /creator nhờ `useStudioStore`.
 *  - `KhungCreatorApp` (mặc định): khung cho APP DESKTOP — thanh công cụ studio +
 *    trang + hộp thoại. App không chạy `app/creator/layout.tsx` của Next (không có
 *    route `/api/auth/admin-check`, đăng nhập do app lo), nên trước đây trong app
 *    KHÔNG có thanh điều hướng studio và nút "Dự án mới" ở Tổng quan bấm không ra
 *    gì (hộp thoại chưa từng được gắn). Không dựng nền phim/đốm sáng `fixed` của
 *    web: chúng phủ cả cửa sổ app và tốn GPU khi cuộn.
 */
import type { ReactNode } from 'react';
import CreateProjectModal from './CreateProjectModal';
import SeriesGeneratorModal from './SeriesGeneratorModal';
import StudioTopbar from './StudioTopbar';
import { useStudioStore } from '@/store/studioStore';

function SeriesGeneratorGlobal() {
  const open = useStudioStore((s) => s.isSeriesModalOpen);
  const close = useStudioStore((s) => s.closeSeriesModal);
  return <SeriesGeneratorModal open={open} onClose={close} />;
}

export function CreatorModals() {
  return (
    <>
      <CreateProjectModal />
      <SeriesGeneratorGlobal />
    </>
  );
}

export default function KhungCreatorApp({ children }: { children: ReactNode }) {
  return (
    <div className="ct-creator-host">
      <StudioTopbar />
      <main className="relative">{children}</main>
      <CreatorModals />
    </div>
  );
}
