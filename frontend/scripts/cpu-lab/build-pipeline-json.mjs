/**
 * build-pipeline-json.mjs — gom output thô của gen-in-docker.sh thành MỘT tệp JSON cho mô phỏng "C → chương trình chạy".
 *   node build-pipeline-json.mjs <thư-mục-output-thô> <tệp-json-đích>
 * Chỉ giữ thứ người học cần nhìn; mọi con số (byte, địa chỉ, kích thước) là của trình biên dịch THẬT, không bịa.
 */
import fs from 'node:fs';
import path from 'node:path';

const [, , IN, OUT] = process.argv;
if (!IN || !OUT) { console.error('cần <in> <out>'); process.exit(1); }
const HERE = path.dirname(new URL(import.meta.url).pathname);
const rd = (...p) => { try { return fs.readFileSync(path.join(...p), 'utf8'); } catch { return ''; } };

const NOISE = /^\s*\.(file|ident|intel_syntax|arch|p2align|align|size)\b|^\s*\.section\s+\.note\.GNU-stack/;
const cleanAsm = (s) => s.split('\n').filter((l) => l.trim() && !NOISE.test(l)).join('\n');

function parseObjdump(s) {
  const fns = [];
  let cur = null;
  for (const line of s.split('\n')) {
    const h = line.match(/^([0-9a-f]+) <([^>]+)>:$/);
    if (h) { cur = { name: h[2], addr: parseInt(h[1], 16), insns: [] }; fns.push(cur); continue; }
    const m = line.match(/^\s+([0-9a-f]+):\t([0-9a-f ]+?)\s*\t(.*)$/);
    if (m && cur) {
      const bytes = m[2].trim().split(/\s+/);
      // aarch64 objdump in một từ 32 bit (vd. "52800000") — tách ra byte theo thứ tự TRONG BỘ NHỚ (little-endian)
      const flat = bytes.length === 1 && bytes[0].length === 8 ? bytes[0].match(/../g).reverse() : bytes;
      cur.insns.push({ addr: parseInt(m[1], 16), bytes: flat.join(' '), text: m[3].replace(/\s+/g, ' ').trim() });
    }
  }
  return fns;
}

function parseSections(s) {
  const out = [];
  for (const line of s.split('\n')) {
    const m = line.match(/^\s*\[\s*(\d+)\]\s+(\S+)\s+(\S+)\s+([0-9a-f]+)\s+([0-9a-f]+)\s+([0-9a-f]+)\s+([0-9a-f]+)\s*([A-Za-z]*)\s/);
    if (m && m[2] !== 'NULL') out.push({ name: m[2], type: m[3], addr: parseInt(m[4], 16), off: parseInt(m[5], 16), size: parseInt(m[6], 16), flags: m[8] || '' });
  }
  return out;
}

function parseSegments(s) {
  const out = [];
  for (const line of s.split('\n')) {
    const m = line.match(/^\s+LOAD\s+0x([0-9a-f]+)\s+0x([0-9a-f]+)\s+0x([0-9a-f]+)\s+0x([0-9a-f]+)\s+0x([0-9a-f]+)\s+([RWE ]+?)\s+0x/);
    if (m) out.push({ off: parseInt(m[1], 16), vaddr: parseInt(m[2], 16), filesz: parseInt(m[4], 16), memsz: parseInt(m[5], 16), flags: m[6].replace(/\s+/g, '') });
  }
  return out;
}

const SYMS = new Set(['main', 'sum_to', 'max_of', 'x', 'y', 'z', 'arr', '_start']);
function parseNm(s) {
  return s.split('\n').map((l) => l.trim().split(/\s+/)).filter((p) => p.length === 3 && SYMS.has(p[2]))
    .map(([a, t, n]) => ({ name: n, addr: parseInt(a, 16), type: t }));
}

const head = (s) => {
  const g = (re) => (s.match(re) || [])[1]?.trim() ?? '';
  return { type: g(/Type:\s+(.*)/), machine: g(/Machine:\s+(.*)/), entry: g(/Entry point address:\s+(.*)/) };
};
const head64 = (s) => s.split('\n').map((l) => l.replace(/^[0-9a-f]+\s*/, '').trim()).filter(Boolean).join(' ').split(/\s+/).slice(0, 64).join(' ');

const programs = {};
for (const p of ['add', 'sum', 'max']) {
  programs[p] = { source: fs.readFileSync(path.join(HERE, 'c', `${p}.c`), 'utf8'), builds: {} };
  for (const a of ['x86_64', 'aarch64']) {
    for (const o of ['O0', 'O2']) {
      const d = path.join(IN, p, a, o);
      const exit = rd(d, 'exit.txt').trim();
      programs[p].builds[`${a}-${o}`] = {
        asm: cleanAsm(rd(d, 'asm.s')),
        objdump: parseObjdump(rd(d, 'objdump.txt')),
        sections: parseSections(rd(d, 'sections.txt')),
        segments: parseSegments(rd(d, 'segments.txt')),
        header: head(rd(d, 'header.txt')),
        symbols: parseNm(rd(d, 'nm.txt')),
        head64: head64(rd(d, 'head64.txt')),
        fileBytes: Number(rd(d, 'bytes.txt').trim()) || 0,
        exit: exit === '' ? null : Number(exit),
      };
    }
  }
}
const out = {
  generatedAt: new Date().toISOString().slice(0, 10),
  toolchain: { x86: rd(IN, 'x86cc.txt').trim(), arm: rd(IN, 'armcc.txt').trim(), binutils: rd(IN, 'binutils.txt').trim() },
  flags: '-fno-asynchronous-unwind-tables -fno-unwind-tables -fno-stack-protector (+ -fcf-protection=none on x86-64, -mbranch-protection=none on ARM64)',
  programs,
};
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out));
console.log('✓', OUT, (fs.statSync(OUT).size / 1024).toFixed(1), 'KiB');
