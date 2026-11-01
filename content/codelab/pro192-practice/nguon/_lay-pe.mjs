#!/usr/bin/env node
/**
 * Chép (vendor) các bài luyện PE của khoá vào Code Lab:
 *   node content/codelab/pro192-practice/nguon/_lay-pe.mjs
 * Nguồn (CHỈ ĐỌC): ~/Documents/FLM-nguon/_repo/PRO192/gen/java/luyen-pe/PeQ*.java + .in — lời giải TỰ VIẾT của khoá (không chép
 * sampleSolution), chia khúc bằng dấu // [tên] … // [/tên]: [given] = bản thay Main.class của đề, [given-if] = interface đề cho,
 * [cham] = máy chấm thu nhỏ (bỏ), các khúc còn lại = lớp người học viết. .in: mỗi khối "# tên" là MỘT lần chạy.
 * Đề bài: content/exams/PRO192-PE<n>.mjs (prompt + explanation EN|||VI của Exam Room, cùng web).
 * Ra: nguon/_pe/<Tên>.json = { pe, ky, cau, diem, tieuDe{en,vi}, deBai{en,vi}, giaiThich{en,vi}, goiY[{en,vi}], hoc{tệp: mã}, cho{tệp: mã}, ca[{ten, vao}] }.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const NGUON = path.join(os.homedir(), 'Documents/FLM-nguon/_repo/PRO192/gen/java/luyen-pe');
const DAY = path.dirname(fileURLToPath(import.meta.url));
const GOC = path.resolve(DAY, '../../../..');
const RA = path.join(DAY, '_pe');
fs.mkdirSync(RA, { recursive: true });

const BAI = ['PeQ1CoffeeShop', 'PeQ1Person', 'PeQ1Student', 'PeQ2Cala', 'PeQ2Ladder', 'PeQ2Professor', 'PeQ3Ladder', 'PeQ3Watch', 'PeQ3Wine', 'PeQ4MyFile', 'PeQ4MyString'];
const hai = (s) => { const [en, vi] = String(s).split('|||'); return { en: en.trim(), vi: (vi ?? en).trim() }; };
// chú thích song ngữ "EN ||| VI" trong mã ⇒ giữ phần EN (mã nguồn của khoá viết chú thích tiếng Anh)
const motNgu = (code) => code.split('\n').map((l) => l.replace(/\s*\|\|\|.*$/, '')).join('\n');

for (const ten of BAI) {
  const src = fs.readFileSync(path.join(NGUON, `${ten}.java`), 'utf8');
  const dau = /^\/\/ (.*)$/m.exec(src.split('\n')[1])[1];
  const m = /PE(\d+) \((\w+)\) question (\d)(?:, (\d) marks?)?/.exec(dau);
  if (!m) throw new Error(`${ten}: không đọc được dòng đầu`);
  const [, pe, ky, cau, diem] = m;
  const imports = src.split('\n').filter((l) => /^import [\w.*]+;$/.test(l));
  const hoc = {}, cho = {}, goiY = [];
  for (const k of src.matchAll(/^\/\/ \[([\w-]+)\]\n([\s\S]*?)^\/\/ \[\/\1\]/gm)) {
    const [, khuc, than] = k;
    if (khuc === 'cham') continue;
    const lop = /\b(?:class|interface|enum)\s+(\w+)/.exec(than);
    const tep = khuc === 'given' ? 'Main.java' : `${lop[1]}.java`;
    const ma = `${imports.join('\n')}\n\n${motNgu(than).replace(/^\n+|\s+$/g, '')}\n`;
    if (khuc.startsWith('given')) cho[tep] = ma;
    else {
      hoc[tep] = ma;
      // chú thích song ngữ đứng riêng một dòng NGAY TRÊN một hàm = "cú xoắn" của hàm đó ⇒ gợi ý
      const dong = than.split('\n');
      dong.forEach((l, i) => {
        const c = /^\s*\/\/\s*(.+\|\|\|.+)$/.exec(l);
        if (c && /^\s*(@Override|public|protected|private|static)/.test(dong[i + 1] || '')) goiY.push(hai(c[1]));
      });
    }
  }
  const ca = [];
  for (const l of fs.readFileSync(path.join(NGUON, `${ten}.in`), 'utf8').replace(/\r/g, '').split('\n')) {
    if (l.startsWith('#')) ca.push({ ten: l.slice(1).trim(), vao: '' });
    else if (ca.length) ca[ca.length - 1].vao += `${l}\n`;
  }
  ca.forEach((x) => { x.vao = x.vao.replace(/\n+$/, '\n'); });
  const de = (await import(pathToFileURL(path.join(GOC, `content/exams/PRO192-PE${pe}.mjs`)).href)).default.exams[0];
  const q = de.questions[Number(cau) - 1];
  const ra = { ten, pe: `PE${pe}`, ky, cau: Number(cau), diem: Number(diem || q.points), tieuDe: hai(dau), deBai: hai(q.prompt), giaiThich: hai(q.explanation || ''), goiY: goiY.slice(0, 4), hoc, cho, ca };
  fs.writeFileSync(path.join(RA, `${ten}.json`), JSON.stringify(ra, null, 1) + '\n');
  console.log(`✓ ${ten}: PE${pe} câu ${cau} · học ${Object.keys(hoc).join(', ')} · cho ${Object.keys(cho).join(', ')} · ${ca.length} ca · ${goiY.length} gợi ý`);
}
