/**
 * Single source of truth for the /settings section list.
 *
 * The layout sidebar, the mobile tab strip and the /settings index cards
 * all read this. Adding a section = one entry here plus the page file;
 * there is no second list to keep in sync (the previous nav had exactly
 * one hardcoded link, to /settings/notifications, which is how
 * /settings/account ended up shipped but unreachable).
 */

export interface SettingsSection {
  href: string;
  label: string;
  /** lucide-react icon name; the components map it to a component. */
  icon: string;
  description: string;
}

export const SETTINGS_SECTIONS: SettingsSection[] = [
  {
    href: '/settings/profile',
    label: 'Hồ sơ',
    icon: 'User',
    description: 'Tên hiển thị, ảnh đại diện, tiểu sử, liên kết mạng xã hội',
  },
  {
    href: '/settings/notifications',
    label: 'Thông báo',
    icon: 'Bell',
    description: 'Loại thông báo muốn nhận, âm thanh riêng cho từng loại, âm lượng',
  },
  {
    href: '/settings/appearance',
    label: 'Giao diện',
    icon: 'Palette',
    description: 'Chế độ sáng/tối, ngôn ngữ hiển thị, giảm chuyển động',
  },
  {
    href: '/settings/privacy',
    label: 'Riêng tư',
    icon: 'Lock',
    description: 'Ai được nhắn tin cho bạn, danh sách người đã chặn',
  },
  {
    href: '/settings/security',
    label: 'Bảo mật',
    icon: 'ShieldCheck',
    description: 'Đổi mật khẩu, xác thực email, lịch sử đăng nhập gần nhất',
  },
  {
    href: '/settings/account',
    label: 'Tài khoản & Dữ liệu',
    icon: 'Database',
    description: 'Thông tin tài khoản, tải bản sao dữ liệu, yêu cầu xoá tài khoản',
  },
];
