/**
 * Nạp danh mục component — CHỈ ĐƯỢC IMPORT TỪ SERVER COMPONENT.
 *
 * Đuôi `.server.ts` là quy ước, không phải hàng rào: import nhầm tệp này vào
 * một component có `'use client'` sẽ âm thầm nhét 1,2 MB JSON vào gói trình
 * duyệt mà build vẫn xanh. Trang danh sách chỉ được nhận `ListItem` đã rút gọn
 * qua `toListItems()`. (Gói `server-only` sẽ biến chuyện này thành lỗi build,
 * nhưng dự án chưa cài và không đáng thêm một phụ thuộc chỉ vì một tệp.)
 *
 * Dùng `import` tĩnh chứ không `fs.readFileSync`: bản dựng standalone (Docker)
 * chỉ copy những gì webpack truy vết được, mà đường dẫn đọc bằng fs thì nó
 * không truy vết nổi — tệp sẽ thiếu trên production dù local vẫn chạy.
 */

import skills from '@/data/ai-templates/skills.json';
import agents from '@/data/ai-templates/agents.json';
import commands from '@/data/ai-templates/commands.json';
import mcps from '@/data/ai-templates/mcps.json';
import settings from '@/data/ai-templates/settings.json';
import hooks from '@/data/ai-templates/hooks.json';
import loops from '@/data/ai-templates/loops.json';
import sandbox from '@/data/ai-templates/sandbox.json';
import templates from '@/data/ai-templates/templates.json';
import plugins from '@/data/ai-templates/plugins.json';

import { TYPES, splitRef } from './catalog';
import { categoryLabel } from './labels';
import type { CategoryCount, ComponentRecord, ListItem, TypeSlug } from './types';

const DATA: Record<TypeSlug, ComponentRecord[]> = {
  skills: skills as ComponentRecord[],
  agents: agents as ComponentRecord[],
  commands: commands as ComponentRecord[],
  mcps: mcps as ComponentRecord[],
  settings: settings as ComponentRecord[],
  hooks: hooks as ComponentRecord[],
  loops: loops as ComponentRecord[],
  sandbox: sandbox as ComponentRecord[],
  templates: templates as ComponentRecord[],
  plugins: plugins as ComponentRecord[],
};

/** Toàn bộ bản ghi của một loại. */
export function getRecords(slug: TypeSlug): ComponentRecord[] {
  return DATA[slug] ?? [];
}

/** Số lượng component theo từng loại — dùng cho sidebar và trang tổng quan. */
export function getCounts(): Record<TypeSlug, number> {
  const out = {} as Record<TypeSlug, number>;
  for (const t of TYPES) out[t.slug] = DATA[t.slug].length;
  return out;
}

export function getTotalCount(): number {
  return TYPES.reduce((n, t) => n + DATA[t.slug].length, 0);
}

/** Danh mục của một loại, kèm số lượng, sắp xếp nhiều → ít. */
export function getCategories(slug: TypeSlug): CategoryCount[] {
  const counts = new Map<string, number>();
  for (const r of DATA[slug]) counts.set(r.category, (counts.get(r.category) ?? 0) + 1);
  return [...counts.entries()]
    .map(([s, count]) => ({ slug: s, label: categoryLabel(s), count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'vi'));
}

/** Độ dài mô tả tối đa gửi sang client. Thẻ chỉ hiện 3 dòng nên dài hơn là phí. */
const DESC_MAX = 260;

function trim(s: string): string {
  if (s.length <= DESC_MAX) return s;
  const cut = s.slice(0, DESC_MAX);
  const sp = cut.lastIndexOf(' ');
  return `${(sp > DESC_MAX * 0.6 ? cut.slice(0, sp) : cut).trimEnd()}…`;
}

/** Rút gọn bản ghi đầy đủ thành payload cho trang danh sách. */
export function toListItems(records: ComponentRecord[]): ListItem[] {
  return records.map((r) => {
    const item: ListItem = { n: r.name, p: r.path, c: r.category, d: trim(r.description) };
    if (r.author) item.a = r.author;
    if (r.keywords?.length) item.k = r.keywords.slice(0, 4);
    if (r.stars) item.s = r.stars;
    return item;
  });
}

/**
 * Tìm một component theo cặp (danh mục, tên) lấy từ URL.
 *
 * `splitRef` đã đổi dấu `/` lồng nhau thành `__` khi dựng URL, nên ở đây phải
 * so sánh qua đúng hàm đó chứ không ghép chuỗi tay — vài command nằm sâu hai
 * cấp thư mục và ghép tay sẽ trượt.
 */
export function findRecord(
  slug: TypeSlug,
  category: string,
  name: string,
): ComponentRecord | undefined {
  return DATA[slug].find((r) => {
    const k = splitRef(r.path, r.category);
    return k.category === category && k.name === name;
  });
}

/** Vài component cùng danh mục, dùng cho khối "Xem thêm" ở trang chi tiết. */
export function getRelated(
  slug: TypeSlug,
  record: ComponentRecord,
  limit = 6,
): ComponentRecord[] {
  return DATA[slug]
    .filter((r) => r.category === record.category && r.path !== record.path)
    .slice(0, limit);
}

/**
 * Chỉ mục nhẹ cho bảng lệnh ⌘K: gộp MỌI loại, chỉ giữ tên + danh mục + loại.
 * Bỏ hẳn mô tả — 1.877 mô tả là ~500 KB, còn tên thì chỉ ~90 KB.
 */
export interface SearchEntry {
  n: string;
  p: string;
  c: string;
  t: TypeSlug;
}

export function getSearchIndex(): SearchEntry[] {
  const out: SearchEntry[] = [];
  for (const t of TYPES) {
    for (const r of DATA[t.slug]) out.push({ n: r.name, p: r.path, c: r.category, t: t.slug });
  }
  return out;
}
