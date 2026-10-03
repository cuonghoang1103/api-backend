/**
 * Huấn luyện học kỳ — DÙNG LẠI nguyên cây `/hoc-tap` của web (2 màn: tổng
 * quan + một môn). Chỉ dính `next/link` — shim đã có.
 * Dữ liệu đi qua `/api/v1/hoc-tap`, nên tiến độ/điểm đồng bộ với web và iOS.
 *
 * Từ 04/10/2026 màn TỔNG QUAN học kỳ nằm trong Tổng quan của app (tab "Học kỳ")
 * — người dùng gộp hai trang. Nên `/hoc-tap` trần (⌘K, link "quay lại" trong trang
 * một môn) chuyển thẳng sang đó; trang một môn `/hoc-tap/mon/:id` vẫn ở đây.
 */
import { useEffect } from 'react';
import { useAppState } from '../../app-state';
import { TrangWebTheoTuyen } from '../web/TrangWeb';

export function HocTapPage() {
  const { route, navigate } = useAppState();
  const laGoc = route === '/hoc-tap';
  useEffect(() => {
    if (laGoc) navigate('/dashboard', 'tab=hoc-ky');
  }, [laGoc, navigate]);
  if (laGoc) return null;
  return <TrangWebTheoTuyen ten="Huấn luyện học kỳ" />;
}
