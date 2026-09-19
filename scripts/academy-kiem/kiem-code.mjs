/**
 * Bộ kiểm ĐỘC LẬP: rút MỌI khối <pre><code class="language-c/cpp"> ra khỏi một
 * spec Academy rồi biên dịch lại từng khối. Không tin lời agent — biên dịch lại.
 *   node kiem-code.mjs ./partA.mjs [--run]
 * Quy ước: khối có `int main` → biên dịch nguyên trạng. Không có main → thử
 * (a) bọc trong main, (b) đặt ở mức file với main rỗng. Đạt nếu MỘT trong hai được.
 */
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import os from 'node:os';

const FILE = process.argv[2];
const RUN = process.argv.includes('--run');
const spec = (await import(pathToFileURL(path.resolve(FILE)).href)).default;
const sections = Array.isArray(spec) ? spec : spec.sections;
const tmp = mkdtempSync(path.join(os.tmpdir(), 'prf193-'));

const unesc = (s) => s
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');

const PRE = [
  '#include <iostream>', '#include <string>', '#include <vector>', '#include <map>',
  '#include <set>', '#include <algorithm>', '#include <fstream>', '#include <sstream>',
  '#include <iomanip>', '#include <cmath>', '#include <cstring>', '#include <cstdio>',
  '#include <cstdlib>', '#include <memory>', '#include <stdexcept>', '#include <cassert>',
  '#include <bitset>', '#include <climits>', '#include <cfloat>', '#include <thread>',
  '#include <mutex>', 'using namespace std;',
].join('\n');

function tryCompile(src, isC, name) {
  const ext = isC ? '.c' : '.cpp';
  const f = path.join(tmp, name + ext);
  writeFileSync(f, src);
  const out = path.join(tmp, name + '.bin');
  const cc = isC ? 'cc' : 'g++';
  const args = isC
    ? ['-std=c11', '-Wall', '-Wextra', '-o', out, f]
    : ['-std=c++17', '-Wall', '-Wextra', '-pthread', '-o', out, f];
  try {
    const warn = execFileSync(cc, args, { stdio: ['ignore', 'pipe', 'pipe'] , encoding: 'utf8'});
    return { ok: true, warn, bin: out };
  } catch (e) {
    return { ok: false, err: String(e.stderr || e.message).slice(0, 1200) };
  }
}

let total = 0, ok = 0, warned = 0, multi = 0, coY = 0;
const fails = [];
let i = 0;
for (const s of sections) {
  for (const l of s.lessons || []) {
    const html = l.content || '';
    const re = /<pre><code class="language-(cpp|c)([^"]*)">([\s\S]*?)<\/code><\/pre>/g;
    let m;
    while ((m = re.exec(html))) {
      i++; total++;
      const isC = m[1] === 'c';
      const flags = m[2] || '';
      const code = unesc(m[3]);
      const name = 'b' + String(i).padStart(3, '0');
      if (/^\/\/\s*=====\s*\S+\s*=====/.test(code.trim())) { total--; multi++; continue; } // mảnh của bộ nhiều file
      if (/\bloi-co-y\b/.test(flags)) { total--; coY++; continue; } // khối CỐ TÌNH sai để học viên tìm lỗi
      const hasMain = /\bint\s+main\s*\(/.test(code);
      let r;
      if (hasMain && !/\bfrag\b/.test(flags)) {
        r = tryCompile(code, isC, name);
      } else {
        r = tryCompile(PRE + '\nint main() {\n' + code + '\nreturn 0;\n}\n', isC, name + 'w');
        if (!r.ok) r = tryCompile(PRE + '\n' + code + '\nint main() { return 0; }\n', isC, name + 'f');
      }
      if (r.ok) {
        ok++;
        if ((r.warn || '').trim()) { warned++; console.log(`⚠ WARN ${l.slug} #${i}\n${r.warn.trim().slice(0, 400)}`); }
        if (RUN && hasMain) {
          try {
            const o = execFileSync(r.bin, { input: '', timeout: 8000, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
            console.log(`── RUN ${l.slug} #${i}\n${o.slice(0, 600)}`);
          } catch (e) { console.log(`── RUN ${l.slug} #${i} (lỗi/chờ input): ${String(e.message).slice(0, 200)}`); }
        }
      } else {
        fails.push({ slug: l.slug, i, err: r.err, code: code.slice(0, 300) });
      }
    }
  }
}
console.log(`\n${FILE}: ${ok}/${total} khối biên dịch được · ${warned} khối có cảnh báo · ${multi} khối nhiều file + ${coY} khối cố tình sai (bỏ qua) · ${fails.length} HỎNG`);
for (const f of fails) console.log(`\n✗ ${f.slug} #${f.i}\n--- code ---\n${f.code}\n--- lỗi ---\n${f.err}`);
console.log('tmp:', tmp);
