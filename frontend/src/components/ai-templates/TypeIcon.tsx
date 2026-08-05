'use client';

/**
 * Biểu tượng của một loại component.
 *
 * `catalog.ts` chỉ lưu TÊN icon dạng chuỗi (`'Layers'`) chứ không lưu chính
 * component — vì catalog còn được server component import, mà kéo cả
 * lucide-react vào đường server là thừa. Bảng tra dưới đây liệt kê tay đúng 10
 * icon đang dùng: import động theo tên (`icons[name]`) sẽ nhét TOÀN BỘ ~1.500
 * icon vào gói trình duyệt.
 */

import {
  Layers,
  Bot,
  TerminalSquare,
  Plug,
  Settings2,
  Webhook,
  RefreshCw,
  Box,
  Package,
  Blocks,
  type LucideIcon,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  Layers,
  Bot,
  TerminalSquare,
  Plug,
  Settings2,
  Webhook,
  RefreshCw,
  Box,
  Package,
  Blocks,
};

export default function TypeIcon({
  name,
  size = 16,
  className,
  style,
}: {
  name: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const Icon = ICONS[name] ?? Layers;
  return <Icon size={size} className={className} style={style} strokeWidth={1.75} />;
}
