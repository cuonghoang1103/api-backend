'use client';

/**
 * Tab "Mô phỏng" — chọn thiết bị rồi giao cho `RobotSimulator`.
 *
 * Tách khỏi `RobotSimulator` vì việc chọn thiết bị là chuyện của TRANG,
 * còn mô phỏng là chuyện của MỘT thiết bị. Trộn hai thứ vào một
 * component thì không tái dùng được bộ mô phỏng ở chỗ khác (ví dụ trang
 * huấn luyện tính cách, nơi thiết bị đã biết trước).
 */

import { useState } from 'react';
import { Bot } from 'lucide-react';
import type { MakerDevice } from '@/types/maker-lab';
import { RobotSimulator } from './RobotSimulator';

export function MoPhongTab({
  devices: tatCa,
  isAuthed,
  projectSlug,
}: {
  devices: MakerDevice[];
  isAuthed: boolean;
  projectSlug: string;
}) {
  /**
   * ⚠️ LỌC THEO DỰ ÁN — `listDevices()` trả về MỌI thiết bị của người
   * dùng, không phải của riêng dự án đang mở.
   *
   * Bỏ bước lọc này thì tab mô phỏng của dự án robot có thể nối vào một
   * thiết bị thuộc dự án KHÁC, và `capVeMoPhong()` lấy `projectId` từ
   * chính thiết bị ấy — nên robot chạy bằng TÍNH CÁCH và GIỌNG ĐỌC của
   * dự án kia.
   *
   * Hỏng thế nào: 26/08 mô phỏng nối vào "thiết bị #2", dự án đó chưa
   * chọn giọng, TTS trả về **0 byte** và robot im hoàn toàn — trong khi
   * chữ vẫn hiện ra đúng, nên trông y như lỗi loa.
   */
  const devices = tatCa.filter((d) => d.project?.slug === projectSlug);
  const [chon, setChon] = useState<number | null>(devices[0]?.id ?? null);

  if (!isAuthed) {
    return (
      <p className="rounded-xl border p-6 text-sm"
        style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
        Đăng nhập để mô phỏng — vé nối vào cổng thiết bị chỉ cấp cho chủ thiết bị.
      </p>
    );
  }

  if (devices.length === 0) {
    return (
      <div className="rounded-xl border p-6"
        style={{ borderColor: 'var(--border-color)' }}>
        <div className="mb-2 flex items-center gap-2 font-semibold"
          style={{ color: 'var(--text-primary)' }}>
          <Bot size={18} /> Chưa có thiết bị nào
        </div>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Dự án này chưa có thiết bị nào. Mô phỏng nối vào cổng thiết bị THẬT nên
          nó cần một thiết bị đã đăng ký — cùng cái mà bo ESP32 dùng. Tạo một cái ở
          tab <strong>Điều khiển</strong>, rồi quay lại đây. Không cần bo thật cắm điện.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {devices.length > 1 && (
        <label className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Thiết bị:
          <select
            value={chon ?? ''}
            onChange={(e) => setChon(Number(e.target.value))}
            className="rounded-lg border px-2 py-1"
            style={{
              borderColor: 'var(--border-color)',
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
            }}
          >
            {devices.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} (#{d.id})
              </option>
            ))}
          </select>
        </label>
      )}
      {chon !== null && <RobotSimulator key={chon} deviceId={chon} />}
    </div>
  );
}
