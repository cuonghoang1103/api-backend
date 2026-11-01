// Khoá Authentication — quét output/tệp trước khi đưa vào repo: (1) so với MỌI giá trị trong .env thật (không in giá trị),
// (2) liệt kê dòng khớp TOKEN|KEY|SECRET|sk-|ctw_ để người soạn soát bằng mắt (giá trị GIẢ của khoá luôn có fake/demo/lfid_).
//   node scripts/auth/quet-bi-mat.mjs <tệp|thư mục>… [--env .env] [--im]   (--im: chỉ in tổng)
// Exit 1 nếu thấy giá trị thật của .env.
import fs from 'node:fs';
import path from 'node:path';
const args = process.argv.slice(2);
const im = args.includes('--im');
const ei = args.indexOf('--env');
const envFile = ei >= 0 ? args[ei + 1] : path.join(path.dirname(new URL(import.meta.url).pathname), '..', '..', '.env');
const targets = args.filter((a, i) => !a.startsWith('--') && !(ei >= 0 && i === ei + 1));
const real = [];
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split('\n')) {
    const m = /^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/.exec(line);
    if (!m) continue;
    const v = m[2].trim().replace(/^['"]|['"]$/g, '');
    if (v.length >= 8 && !/^(true|false|production|development|localhost|https?:\/\/localhost.*)$/i.test(v)) real.push([m[1], v]);
  }
}
const files = [];
const walk = (p) => { const st = fs.statSync(p); if (st.isDirectory()) { for (const f of fs.readdirSync(p)) if (f !== 'node_modules' && f !== '.git') walk(path.join(p, f)); } else files.push(p); };
targets.forEach(walk);
let hitReal = 0; let suspicious = 0;
const PAT = /TOKEN|KEY|SECRET|sk-|ctw_/;
for (const f of files) {
  let txt; try { txt = fs.readFileSync(f, 'utf8'); } catch { continue; }
  for (const [k, v] of real) if (txt.includes(v)) { hitReal++; console.log(`✗ GIÁ TRỊ THẬT của ${k} nằm trong ${f}`); }
  txt.split('\n').forEach((l, i) => {
    if (!PAT.test(l)) return;
    suspicious++;
    if (!im) console.log(`  ? ${path.relative(process.cwd(), f)}:${i + 1}: ${l.slice(0, 160)}`);
  });
}
console.log(`${hitReal ? '✗' : '✓'} ${files.length} tệp · ${real.length} giá trị .env đem so · ${hitReal} khớp giá trị thật · ${suspicious} dòng có chữ TOKEN/KEY/SECRET/sk-/ctw_ (soát tay)`);
process.exit(hitReal ? 1 : 0);
