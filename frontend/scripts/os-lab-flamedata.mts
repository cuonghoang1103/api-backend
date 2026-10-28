/**
 * Dựng src/components/os-lab/engine/flamedata.ts từ 8 flame graph THẬT của Chương 15
 * (content/courses/operating-systems-for-developers/lab/code/ch15/fg/*.svg — flamegraph.pl vẽ từ folded stack đo
 * trong lab: perf, profile-libbpf, offcputime, async-profiler, py-spy). Mỗi khung SVG có <title>tên (N samples, X%)</title>
 * và <rect x y width>: độ sâu đọc từ y, chỗ bắt đầu đọc từ x, số mẫu đọc từ title (chính xác). Không bịa số nào.
 *
 *   cd frontend && npx tsx scripts/os-lab-flamedata.mts
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const FG = path.join(here, '../../content/courses/operating-systems-for-developers/lab/code/ch15/fg');
const OUT = path.join(here, '../src/components/os-lab/engine/flamedata.ts');
const GRAPHS = ['hot', 'hot-fixed', 'hot-diff', 'wait-on', 'wait-off', 'node', 'java', 'python'];

const dec = (s: string) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
let body = '';
for (const g of GRAPHS) {
  const svg = fs.readFileSync(path.join(FG, `${g}.svg`), 'utf8');
  const title = dec(svg.match(/<text id="title"[^>]*>([^<]*)</)![1]);
  const W = Number(svg.match(/<svg[^>]*width="(\d+)"/)![1]);
  const re = /<title>([^<]*)<\/title><rect x="([\d.]+)" y="([\d.]+)" width="([\d.]+)"/g;
  const raw: Array<{ name: string; n: number; delta: number | null; x: number; y: number; w: number }> = [];
  let unit = 'samples';
  for (let m = re.exec(svg); m; m = re.exec(svg)) {
    const t = dec(m[1]);
    const mm = t.match(/^(.*) \(([\d,]+) (samples|us), ([\d.]+)%(?:; ([+-]?[\d.]+)%)?\)$/);
    if (!mm) throw new Error(`${g}: cannot parse title ${t}`);
    unit = mm[3];
    raw.push({ name: mm[1], n: Number(mm[2].replace(/,/g, '')), delta: mm[5] !== undefined ? Number(mm[5]) : null, x: Number(m[2]), y: Number(m[3]), w: Number(m[4]) });
  }
  const root = raw.find((r) => r.name === 'all')!;
  const total = root.n;
  const pad = 10, span = W - 2 * pad;
  const names: string[] = [];
  const idx = (n: string) => { let k = names.indexOf(n); if (k < 0) { k = names.length; names.push(n); } return k; };
  const rows = raw.map((r) => [idx(r.name), Math.round((root.y - r.y) / 16), Math.round((r.x - pad) * 10), Math.round(r.w * 10), r.n, r.delta === null ? 0 : Math.round(r.delta * 100)]);
  rows.sort((a, b) => a[1] - b[1] || a[2] - b[2]);
  body += `  '${g}': { title: ${JSON.stringify(title)}, unit: '${unit}', total: ${total}, span: ${span}, diff: ${raw.some((r) => r.delta !== null)},\n    names: ${JSON.stringify(names)},\n    // [tên, độ sâu, x (px × 10, bề rộng khung ${span} px), rộng (px × 10), số mẫu, chênh lệch × 100 %]\n    f: ${JSON.stringify(rows.flat())} },\n`;
  console.log(`${g}: ${raw.length} frames, ${total} ${unit}`);
}
fs.writeFileSync(OUT, `/* eslint-disable */
// SINH TỰ ĐỘNG bởi frontend/scripts/os-lab-flamedata.mts từ lab/code/ch15/fg/*.svg — ĐỪNG sửa tay.
export interface FlameRaw { title: string; unit: 'samples' | 'us'; total: number; diff: boolean; names: string[]; f: number[]; span: number }
export const FLAME_RAW: Record<string, FlameRaw> = {
${body}};
`);
