/**
 * flm-ds-tai.mjs — lập danh sách môn cần tải tài liệu FLM, theo THỨ TỰ KỲ (Kỳ 1 → Kỳ 9, mọi ngành),
 * bỏ các môn user xác nhận đã đầy đủ (BO_QUA trong academy-muc0-flm.mjs) và môn FLM không có file.
 *
 *   node scripts/flm-ds-tai.mjs --out <ds.json> [--ky 1,2]
 *
 * Ra: mảng [{ ma, sylID, ky, links }] cho scripts/flm-tai-lieu.py --ds.
 */
import fs from 'node:fs';
import path from 'node:path';
import { BO_QUA } from './academy-muc0-flm.mjs';

const args = process.argv.slice(2);
const val = (f) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : null; };
const OUT = val('--out');
if (!OUT) { console.error('cần --out <ds.json>'); process.exit(1); }
const KY = val('--ky') ? new Set(val('--ky').split(',').map(Number)) : null;
const SYL = 'content/academy/_syllabus-flm';

const ds = [];
const dem = { boQua: 0, khongFile: 0, khongSyl: 0 };
for (const f of fs.readdirSync(SYL).filter((x) => x.endsWith('.json'))) {
  const syl = JSON.parse(fs.readFileSync(path.join(SYL, f), 'utf8'));
  const ma = syl.ma || f.replace('.json', '');
  const fMon = `content/academy/${ma}.mjs`;
  if (!fs.existsSync(fMon) || syl.khongCo) { dem.khongSyl++; continue; }
  if (BO_QUA.has(ma)) { dem.boQua++; continue; }
  const links = (syl.links || []).filter((l) => l.startsWith('/download/'));
  if (!links.length) { dem.khongFile++; continue; }
  const spec = (await import(path.resolve(fMon))).default;
  const ky = spec.semester?.ordinal ?? 99;
  if (KY && !KY.has(ky)) continue;
  ds.push({ ma, sylID: syl.sylID, ky, links });
}
ds.sort((a, b) => a.ky - b.ky || a.ma.localeCompare(b.ma));
fs.writeFileSync(OUT, JSON.stringify(ds, null, 1));
const theoKy = ds.reduce((m, x) => ((m[x.ky] = (m[x.ky] || 0) + 1), m), {});
console.log(`${ds.length} môn cần tải · theo kỳ (ordinal): ${JSON.stringify(theoKy)} · bỏ qua đã đầy đủ ${dem.boQua} · không có file ${dem.khongFile} · không có syllabus ${dem.khongSyl}`);
