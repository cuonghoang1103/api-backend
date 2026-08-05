/**
 * Kho AI Templates — kiểu dữ liệu dùng chung giữa server và client.
 *
 * Dữ liệu gốc là danh mục component mã nguồn mở của dự án
 * `davila7/claude-code-templates` (giấy phép MIT). Mỗi bản ghi mô tả MỘT
 * component cài được bằng CLI `npx claude-code-templates@latest`.
 *
 * Ở đây chỉ khai kiểu — phần nạp JSON nằm ở `data.server.ts` và CHỈ chạy
 * phía server: gộp cả 10 tệp lại là ~1,2 MB, đẩy sang trình duyệt là giết
 * trang. Client chỉ nhận `ListItem` đã cắt gọn.
 */

/** Mã loại component. Trùng cờ CLI (`--skill`, `--agent`, …) trừ `plugin`/`template`. */
export type ComponentType =
  | 'skill'
  | 'agent'
  | 'command'
  | 'mcp'
  | 'setting'
  | 'hook'
  | 'loop'
  | 'sandbox'
  | 'template'
  | 'plugin';

/** Slug xuất hiện trên URL: /ai-templates/<slug> */
export type TypeSlug =
  | 'skills'
  | 'agents'
  | 'commands'
  | 'mcps'
  | 'settings'
  | 'hooks'
  | 'loops'
  | 'sandbox'
  | 'templates'
  | 'plugins';

/** Bản ghi đầy đủ như trong tệp JSON đã chuẩn hoá. */
export interface ComponentRecord {
  name: string;
  /** Đường dẫn tương đối trong repo gốc, ví dụ `security/security-auditor.md`. */
  path: string;
  category: string;
  type: ComponentType;
  description: string;
  author: string;
  repo: string;
  version: string;
  license: string;
  keywords: string[];
  /** Chỉ có ở `templates.json`. */
  files?: string[];
  installCommand?: string;
  /** Chỉ có ở `plugins.json`. */
  stars?: number;
  website?: string;
  contains?: Record<string, number>;
  highlights?: string[];
}

/**
 * Bản rút gọn gửi sang client cho trang danh sách.
 *
 * Tên trường viết TẮT có chủ đích: 871 skill × mỗi ký tự tên trường lặp lại
 * 871 lần trong payload RSC. Đổi `description` → `d` cắt được vài chục KB
 * chỉ riêng phần tên khoá.
 */
export interface ListItem {
  /** name */
  n: string;
  /** path */
  p: string;
  /** category */
  c: string;
  /** description (đã cắt còn tối đa 260 ký tự) */
  d: string;
  /** author — rỗng thì bỏ hẳn khoá */
  a?: string;
  /** keywords, tối đa 4 */
  k?: string[];
  /** stars (plugin) */
  s?: number;
}

/** Một danh mục kèm số lượng, dùng cho bộ lọc bên trái. */
export interface CategoryCount {
  slug: string;
  label: string;
  count: number;
}

/** Mục trong "Stack Builder" (giỏ cài đặt) — lưu ở localStorage. */
export interface StackItem {
  type: ComponentType;
  /** Định danh dùng cho lệnh cài, đã bỏ đuôi tệp. */
  ref: string;
  name: string;
  category: string;
}
