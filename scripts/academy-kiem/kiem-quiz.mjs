/** Chạy THẬT mọi đoạn code trong quiz rồi in kèm đáp án đã đánh dấu, để đối chiếu. */
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import os from 'node:os';

const spec = (await import(pathToFileURL(path.resolve(process.argv[2])).href)).default;
const sections = Array.isArray(spec) ? spec : spec.sections;
const tmp = mkdtempSync(path.join(os.tmpdir(), 'prfquiz-'));
const un = (s) => (s || '').replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n').replace(/\\t/g, '  ');
const PRE = ['#include <iostream>', '#include <string>', '#include <vector>', '#include <map>', '#include <set>',
  '#include <algorithm>', '#include <fstream>', '#include <sstream>', '#include <iomanip>', '#include <cstring>',
  '#include <cstdio>', '#include <memory>', '#include <stdexcept>', '#include <climits>', 'using namespace std;'].join('\n');
let n = 0, run = 0;
for (const s of sections) for (const l of s.lessons) {
  if (!l.quiz) continue;
  for (const q of l.quiz.questions) {
    if (!q.code) continue;
    n++;
    const code = un(q.code);
    const f = path.join(tmp, 'q' + n + '.cpp');
    const hasMain = /\bint\s+main\s*\(/.test(code);
    writeFileSync(f, hasMain ? code : PRE + '\nint main() {\n' + code + '\nreturn 0;\n}\n');
    let out;
    try {
      execFileSync('g++', ['-std=c++17', '-o', path.join(tmp, 'q' + n), f], { stdio: 'pipe' });
      out = execFileSync(path.join(tmp, 'q' + n), { cwd: tmp, input: '', timeout: 8000, encoding: 'utf8', stdio: 'pipe' });
      run++;
    } catch (e) { out = 'KHÔNG CHẠY ĐƯỢC: ' + String(e.stderr || e.message).split('\n')[0]; }
    const opts = q.options.map((o, i) => (i === q.correctIndex ? '✔ ' : '  ') + o.split('|||')[0]);
    console.log(`\n── ${l.slug} ${q.id}\n   CHẠY THẬT: ${JSON.stringify(out.trim().slice(0, 200))}\n${opts.map((o) => '   ' + o).join('\n')}`);
  }
}
console.log(`\n${n} câu có code · ${run} câu chạy được`);
