/**
 * Bộ kiểm ĐỘC LẬP #2: với mỗi cặp (khối code hoàn chỉnh, khối .out ngay sau nó),
 * biên dịch + CHẠY THẬT rồi so output thật với chữ trong .out.
 *   node kiem-output.mjs ./partA.mjs
 * Bỏ qua: khối cần stdin (có cin>>/scanf/getline(cin)), .out có dấu … (rút gọn).
 */
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import os from 'node:os';

const FILE = process.argv[2];
const spec = (await import(pathToFileURL(path.resolve(FILE)).href)).default;
const sections = Array.isArray(spec) ? spec : spec.sections;
const tmp = mkdtempSync(path.join(os.tmpdir(), 'prfout-'));

const unesc = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
const clean = (s) => String(s).split('\n').map((x) => x.trim()).filter(Boolean).join('\n').replace(/[ \t]+/g, ' ').trim();
// .out là HTML: bỏ thẻ TRƯỚC rồi mới unescape (làm ngược lại sẽ ăn mất "<< 2 =")
const normHtml = (s) => clean(unesc(String(s).replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '')));
const normPlain = (s) => clean(s);

let pairs = 0, matched = 0, skipped = 0;
const diffs = [];
let i = 0;
for (const s of sections) {
  for (const l of s.lessons || []) {
    const c = l.content || '';
    const re = /<pre><code class="language-(cpp|c)([^"]*)">((?:(?!<\/code>)[\s\S])*)<\/code><\/pre>\s*<div class="out">((?:(?!<\/div>)[\s\S])*)<\/div>/g;
    let m;
    while ((m = re.exec(c))) {
      i++;
      const isC = m[1] === 'c';
      const code = unesc(m[3]);
      const claimed = normHtml(m[4]);
      if (!/\bint\s+main\s*\(/.test(code)) { skipped++; continue; }
      if (/cin\s*>>|scanf|getline\s*\(\s*cin/.test(code)) { skipped++; continue; }
      if (/[…]|\.\.\./.test(claimed)) { skipped++; continue; }
      pairs++;
      const f = path.join(tmp, 'p' + i + (isC ? '.c' : '.cpp'));
      writeFileSync(f, code);
      const bin = path.join(tmp, 'p' + i + '.bin');
      try {
        execFileSync(isC ? 'cc' : 'g++', isC ? ['-std=c11', '-o', bin, f] : ['-std=c++17', '-pthread', '-o', bin, f], { stdio: 'pipe' });
      } catch (e) { diffs.push({ slug: l.slug, i, why: 'KHÔNG BIÊN DỊCH ĐƯỢC', err: String(e.stderr).slice(0, 300) }); continue; }
      let real = '';
      try {
        real = normPlain(execFileSync(bin, { cwd: tmp, input: '', timeout: 10000, encoding: 'utf8', stdio: 'pipe' }));
      } catch (e) { diffs.push({ slug: l.slug, i, why: 'CHẠY LỖI', err: String(e.message).slice(0, 200) }); continue; }
      if (real === claimed) { matched++; continue; }
      // so từng dòng: nếu mọi dòng trong .out đều có mặt đúng thứ tự trong output thật → coi là khớp một phần
      const rl = real.split('\n'), cl = claimed.split('\n');
      let k = 0, subset = true;
      for (const line of cl) { const j = rl.indexOf(line, k); if (j < 0) { subset = false; break; } k = j + 1; }
      if (subset) { matched++; console.log(`≈ ${l.slug} #${i}: .out là tập con đúng thứ tự của output thật (${cl.length}/${rl.length} dòng)`); continue; }
      diffs.push({ slug: l.slug, i, why: 'LỆCH', claimed, real });
    }
  }
}
console.log(`\n${FILE}: ${pairs} cặp code+out kiểm được · ${matched} khớp · ${diffs.length} LỆCH · ${skipped} bỏ qua (cần stdin / rút gọn / mẩu rời)`);
for (const d of diffs) {
  console.log(`\n✗ ${d.slug} #${d.i} — ${d.why}`);
  if (d.err) console.log(d.err);
  if (d.claimed !== undefined) {
    console.log('--- .out ghi ---\n' + d.claimed.slice(0, 700));
    console.log('--- chạy thật ---\n' + d.real.slice(0, 700));
  }
}
