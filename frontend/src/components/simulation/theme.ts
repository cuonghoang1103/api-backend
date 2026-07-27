/**
 * Bảng màu kỹ thuật + hình học của sân khấu.
 *
 * Trang này là DARK-ONLY có chủ đích: nó là bề mặt để quay video bài giảng,
 * nên nền phải cố định để mọi bản ghi trông giống nhau. Vì vậy KHÔNG dùng
 * biến `var(--text-primary)` hay biến thể Tailwind `dark:` ở đây — theo quy
 * ước của repo, `dark:` được dành riêng cho module Notes.
 */

import type { FlowKind, NodeKind } from './types';

/* ── Màu theo loại luồng dữ liệu ─────────────────────────────── */

export interface FlowStyle {
  /** Màu lõi của gói tin và tia sáng trên dây. */
  color: string;
  /** Màu quầng sáng (thường sáng hơn lõi). */
  glow: string;
  /** Nhãn hiển thị trên chú giải. */
  legend: string;
}

export const FLOW_STYLES: Record<FlowKind, FlowStyle> = {
  // Đọc dữ liệu — xanh ngọc
  GET: { color: '#10b981', glow: '#6ee7b7', legend: 'GET / Read' },
  // Tạo mới — lam sáng
  POST: { color: '#22d3ee', glow: '#a5f3fc', legend: 'POST / Create' },
  // Cập nhật — hổ phách
  PUT: { color: '#f59e0b', glow: '#fcd34d', legend: 'PUT / Update' },
  // Xoá — đỏ thẫm
  DELETE: { color: '#f43f5e', glow: '#fda4af', legend: 'DELETE' },
  // Phản hồi thành công — xanh ngọc nhạt để phân biệt với request
  RESPONSE: { color: '#34d399', glow: '#a7f3d0', legend: 'Response 2xx' },
  // Lỗi 4xx/5xx — đỏ
  ERROR: { color: '#ef4444', glow: '#fca5a5', legend: 'Error 4xx / 5xx' },
  // Cache HIT — tím neon
  CACHE_HIT: { color: '#a855f7', glow: '#e9d5ff', legend: 'Cache HIT' },
  // Cache MISS — cam xám trầm (cố tình "buồn" so với HIT)
  CACHE_MISS: { color: '#b08968', glow: '#d6c3ae', legend: 'Cache MISS' },
  // Sự kiện realtime — hồng sen
  EVENT: { color: '#e879f9', glow: '#f5d0fe', legend: 'Realtime event' },
  // Token / thông tin xác thực — vàng
  TOKEN: { color: '#facc15', glow: '#fef08a', legend: 'JWT / Token' },
  // Truy vấn CSDL — lam
  QUERY: { color: '#60a5fa', glow: '#bfdbfe', legend: 'SQL / Query' },
  // Xác nhận / ack — xám lam
  ACK: { color: '#94a3b8', glow: '#cbd5e1', legend: 'ACK' },
  // Xử lý nội bộ — xám
  INTERNAL: { color: '#64748b', glow: '#94a3b8', legend: 'Internal work' },
};

/** Màu riêng cho từng HTTP method, dùng cho nút chọn ở bảng điều khiển. */
export const METHOD_COLORS: Record<string, string> = {
  GET: FLOW_STYLES.GET.color,
  POST: FLOW_STYLES.POST.color,
  PUT: FLOW_STYLES.PUT.color,
  PATCH: '#fb923c',
  DELETE: FLOW_STYLES.DELETE.color,
};

// Màu mã trạng thái được suy ra từ danh mục HTTP (`httpStatus.ts`) để chỉ có
// MỘT chỗ định nghĩa. Re-export ở đây vì canvas và bảng soi đã quen import
// từ theme.
export { statusColor } from './httpStatus';

/* ── Màu theo loại node ──────────────────────────────────────── */

export interface NodeStyle {
  color: string;
  /** Nhãn loại hiện phía trên tên node. */
  kindLabel: string;
}

export const NODE_STYLES: Record<NodeKind, NodeStyle> = {
  client: { color: '#38bdf8', kindLabel: 'CLIENT' },
  edge: { color: '#f97316', kindLabel: 'EDGE' },
  gateway: { color: '#818cf8', kindLabel: 'GATEWAY' },
  server: { color: '#22d3ee', kindLabel: 'SERVICE' },
  cache: { color: '#a855f7', kindLabel: 'CACHE' },
  db: { color: '#60a5fa', kindLabel: 'DATABASE' },
  queue: { color: '#fb923c', kindLabel: 'BROKER' },
  worker: { color: '#4ade80', kindLabel: 'WORKER' },
  auth: { color: '#facc15', kindLabel: 'AUTH' },
  socket: { color: '#e879f9', kindLabel: 'REALTIME' },
  storage: { color: '#f59e0b', kindLabel: 'STORAGE' },
  ci: { color: '#c084fc', kindLabel: 'PIPELINE' },
  index: { color: '#2dd4bf', kindLabel: 'INDEX' },
};

/** Màu nền và khung của sân khấu — dùng chung cho canvas và vỏ trang. */
export const STAGE_COLORS = {
  bgOuter: '#04050a',
  bgInner: '#0b1020',
  grid: 'rgba(99, 130, 190, 0.075)',
  gridMajor: 'rgba(120, 160, 235, 0.13)',
  captionBg: 'rgba(4, 6, 14, 0.92)',
  textPrimary: '#e8eefc',
  textSecondary: '#93a4c4',
  textMuted: '#5d6d8c',
  wire: 'rgba(120, 150, 205, 0.24)',
  wireGhost: 'rgba(120, 150, 205, 0.13)',
} as const;
