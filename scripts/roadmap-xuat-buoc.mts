/**
 * Xuất toàn bộ bước lộ trình (đúng như seeder sẽ ghi vào DB) ra JSON để soạn bài đọc + gắn bài học.
 *   npx tsx scripts/roadmap-xuat-buoc.mts [~/Documents/roadmap-lam/buoc.json]
 * Khoá của một bước = `${chặng} › ${tiêu đề}` — trùng với khoá seeder dùng để giữ dấu "đã xong".
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { ROADMAP_SEED } from '../src/services/roadmap.seed.js';
import { khoaBuoc } from '../src/services/roadmap.noiDung.js';

const ra = process.argv[2] || path.join(os.homedir(), 'Documents/roadmap-lam/buoc.json');
const out = ROADMAP_SEED.map((r) => ({
  slug: r.slug, title: r.title, type: r.type, description: r.description,
  stages: r.stages.map((s) => ({ label: s.label, nodes: s.nodes.map((n) => ({ key: khoaBuoc(s.label, n.title), ...n })) })),
}));
fs.writeFileSync(ra, JSON.stringify(out, null, 1));
console.log(`✓ ${out.length} lộ trình · ${out.reduce((a, r) => a + r.stages.reduce((b, s) => b + s.nodes.length, 0), 0)} bước ⇒ ${ra}`);
