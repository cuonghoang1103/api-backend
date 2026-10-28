/**
 * Sinh content/codelab/swr302-practice/_track.json từ các nguồn (thứ tự: chương ↑; trong chương: bài luyện theo số N.M,
 * rồi Lab, Deep Lab, dự án; chương 11 = PE). Chạy: node content/codelab/swr302-practice/nguon/_track-sinh.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const NGUON = path.dirname(fileURLToPath(import.meta.url));
const TRACK = path.join(NGUON, '..', '_track.json');
const goc = JSON.parse(fs.readFileSync(TRACK, 'utf8'));
const ds = [];
for (const f of fs.readdirSync(NGUON).filter((x) => x.endsWith('.mjs') && !x.startsWith('_'))) {
  const m = (await import(pathToFileURL(path.join(NGUON, f)).href)).default;
  const so = /^\s*(\d{1,2})\.(\d{1,2})\b/.exec(m.ten);
  const sl = /^swr302-(\d{1,2})-(lab|deep|project|pe)/.exec(m.slug);
  const kind = m.de[0].dangBai || 'practice';
  const chuong = so ? +so[1] : sl ? +sl[1] : 99;
  const thu = so ? +so[2] : 100 + ['lab', 'deep-lab', 'project', 'pe'].indexOf(kind) * 10;
  ds.push({ chuong, thu, slug: m.slug, name: m.ten, level: m.capDo || (kind === 'practice' ? (m.de.some((d) => d.doKho === 'HARD') ? 'INTERMEDIATE' : 'BEGINNER') : 'ADVANCED'), description: m.moTaModule || '' });
}
ds.sort((a, b) => a.chuong - b.chuong || a.thu - b.thu || a.slug.localeCompare(b.slug));
goc.modules = ds.map(({ slug, name, level, description }) => ({ slug, name, level, description }));
fs.writeFileSync(TRACK, `${JSON.stringify(goc, null, 2)}\n`);
console.log(`_track.json: ${ds.length} module`);
for (const d of ds) if (!d.description) console.log('  ⚠ thiếu moTaModule:', d.slug);
