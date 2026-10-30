/** CEA201 · LAB chương 12 — Bộ vẽ sơ đồ thời gian pipeline (stall + forwarding). */
import { doiDau, KHOA, bi, tab, jsDe, dat } from './_ce.mjs';

const pipelineLab = function pipelineLab(lines, forwarding) {
  var ins = [], i, j;
  for (i = 0; i < lines.length; i++) {
    var p = lines[i].replace(/,/g, ' ').replace(/[()]/g, ' ').trim().split(/\s+/), op = p[0].toLowerCase(), dest = null, src = [];
    if (op === 'lw') { dest = p[1]; src = [p[3]]; }
    else if (op === 'sw') { src = [p[1], p[3]]; }
    else if (op === 'addi') { dest = p[1]; src = [p[2]]; }
    else { dest = p[1]; src = [p[2], p[3]]; }
    if (dest === 'r0') dest = null;
    ins.push({ op: op, dest: dest, src: src });
  }
  var ifS = [], idS = [], idE = [], ex = [], mem = [], wb = [];
  for (i = 0; i < ins.length; i++) {
    idS[i] = i === 0 ? 2 : idE[i - 1] + 1;
    ifS[i] = i === 0 ? 1 : idS[i - 1];
    var e = idS[i];
    for (j = 0; j < i; j++) {
      if (!ins[j].dest || ins[i].src.indexOf(ins[j].dest) < 0) continue;
      if (!forwarding) e = Math.max(e, wb[j]);
      else e = Math.max(e, (ins[j].op === 'lw' ? mem[j] + 1 : ex[j] + 1) - 1);
    }
    idE[i] = e; ex[i] = e + 1; mem[i] = e + 2; wb[i] = e + 3;
  }
  var n = ins.length, cycles = n ? wb[n - 1] : 0, diagram = [];
  for (i = 0; i < n; i++) {
    var row = [];
    for (var c = 1; c <= cycles; c++) {
      var t = '.';
      if (c >= ifS[i] && c < idS[i]) t = 'IF';
      else if (c >= idS[i] && c <= idE[i]) t = 'ID';
      else if (c === ex[i]) t = 'EX';
      else if (c === mem[i]) t = 'MEM';
      else if (c === wb[i]) t = 'WB';
      row.push(t);
    }
    diagram.push(row.join(' '));
  }
  return { cycles: cycles, stalls: n ? cycles - (n + 4) : 0, diagram: diagram };
};
const P1 = ['lw r1, 0(r2)', 'add r3, r1, r4', 'sub r5, r3, r6', 'sw r5, 4(r2)'];
const P2 = ['add r1, r2, r3', 'sub r4, r1, r5', 'and r6, r1, r7', 'or r8, r1, r9'];
const P3 = ['lw r1, 0(r2)', 'lw r2, 4(r1)', 'lw r3, 0(r2)', 'addi r4, r3, 1', 'sw r4, 8(r2)'];

const LAB = jsDe({
  tieuDe: 'Lab 12 — Pipeline timing diagram generator',
  doKho: 'HARD', phut: 60, diem: 60, dangBai: 'lab',
  moTa: bi(`<p><b>Scenario.</b> A teaching assistant wants the timing diagrams of the course drawn automatically. Write <code>pipelineLab(lines, forwarding)</code> for the classic 5-stage in-order pipeline <code>IF ID EX MEM WB</code> and return <code>{ cycles, stalls, diagram }</code>.</p>
<ol>
<li>Instruction forms: <code>lw rt, off(rs)</code> (writes rt, reads rs) · <code>sw rt, off(rs)</code> (reads rt and rs, writes nothing) · <code>addi rt, rs, imm</code> (writes rt, reads rs) · <code>add|sub|and|or|slt rd, rs, rt</code> (writes rd, reads rs and rt). <code>r0</code> never creates a dependence.</li>
<li>The first instruction is in IF at cycle 1 and in ID at cycle 2. Instruction <i>i</i> enters ID at the cycle after instruction <i>i−1</i> <b>leaves</b> ID; instruction <i>i</i> enters IF when instruction <i>i−1</i> enters ID, and waits there (stays “IF”) until it can enter ID.</li>
<li>No forwarding: the <b>last</b> ID cycle of a consumer is ≥ the WB cycle of every producer of one of its source registers (write in the first half, read in the second half of the same cycle). Forwarding: the consumer’s EX is after the producer’s EX (ALU/addi) or MEM (lw); a store’s data register is needed at the start of EX too.</li>
<li>After its last ID cycle an instruction takes EX, MEM, WB in three consecutive cycles.</li>
</ol>
<p><code>diagram</code> is an array with one string per instruction: <code>cycles</code> tokens joined by one space; token = <code>IF</code> (also while waiting), <code>ID</code> (also while stalled), <code>EX</code>, <code>MEM</code>, <code>WB</code>, or <code>.</code> for a cycle outside its life. <code>cycles</code> = the cycle of the last WB, <code>stalls</code> = <code>cycles − (n + 4)</code>.</p>
<h4>Sample (no forwarding)</h4>${tab(['instruction', 'diagram'], pipelineLab(P2.slice(0, 2), false).diagram.map((d, i) => [P2[i], d]))}`,
  `<p><b>Tình huống.</b> Trợ giảng muốn tự động vẽ sơ đồ thời gian của khoá học. Viết <code>pipelineLab(lines, forwarding)</code> cho pipeline 5 tầng theo thứ tự <code>IF ID EX MEM WB</code> kinh điển và trả <code>{ cycles, stalls, diagram }</code>.</p>
<ol>
<li>Dạng lệnh: <code>lw rt, off(rs)</code> (ghi rt, đọc rs) · <code>sw rt, off(rs)</code> (đọc rt và rs, không ghi) · <code>addi rt, rs, imm</code> (ghi rt, đọc rs) · <code>add|sub|and|or|slt rd, rs, rt</code> (ghi rd, đọc rs và rt). <code>r0</code> không bao giờ gây phụ thuộc.</li>
<li>Lệnh đầu ở IF chu kỳ 1 và ở ID chu kỳ 2. Lệnh <i>i</i> vào ID ở chu kỳ sau khi lệnh <i>i−1</i> <b>rời</b> ID; lệnh <i>i</i> vào IF khi lệnh <i>i−1</i> vào ID và chờ ở đó (vẫn là “IF”) đến khi vào được ID.</li>
<li>Không chuyển tiếp: chu kỳ ID <b>cuối</b> của lệnh dùng ≥ chu kỳ WB của mọi lệnh sinh ra một thanh ghi nguồn của nó (ghi nửa đầu, đọc nửa sau cùng chu kỳ). Chuyển tiếp: EX của lệnh dùng sau EX của lệnh sinh (ALU/addi) hoặc sau MEM (lw); thanh ghi dữ liệu của lệnh store cũng cần từ đầu EX.</li>
<li>Sau chu kỳ ID cuối, lệnh làm EX, MEM, WB ở ba chu kỳ liên tiếp.</li>
</ol>
<p><code>diagram</code> là mảng một chuỗi cho mỗi lệnh: <code>cycles</code> token nối bằng một dấu cách; token = <code>IF</code> (cả khi chờ), <code>ID</code> (cả khi đình trệ), <code>EX</code>, <code>MEM</code>, <code>WB</code>, hoặc <code>.</code> cho chu kỳ ngoài đời lệnh. <code>cycles</code> = chu kỳ của WB cuối, <code>stalls</code> = <code>cycles − (n + 4)</code>.</p>`),
  yeuCau: [bi('Do not modify <code>lines</code>.', 'Không sửa <code>lines</code>.'), bi('The result for an empty program is <code>{ cycles: 0, stalls: 0, diagram: [] }</code>.', 'Chương trình rỗng cho <code>{ cycles: 0, stalls: 0, diagram: [] }</code>.')],
  viDu: [{ input: 'pipelineLab(["add r1, r2, r3", "sub r4, r1, r5"], false)', output: JSON.stringify(pipelineLab(P2.slice(0, 2), false)), explanation: 'sub waits in ID for cycles 3–5 (add’s WB is in cycle 5).|||sub chờ ở ID các chu kỳ 3–5 (WB của add ở chu kỳ 5).' }],
  goiY: ['Compute the numbers first (ifS, idS, idEnd, ex, mem, wb per instruction) and test cycles/stalls; only then build the strings.', 'idS[i] = idEnd[i−1] + 1 and ifS[i] = idS[i−1]; every dependence only raises idEnd[i].', 'Token for cycle c: c in [ifS, idS) → IF; [idS, idEnd] → ID; c = ex → EX; c = mem → MEM; c = wb → WB; otherwise “.”.'],
  loiHayGap: ['Drawing the stall bubble in the wrong instruction (the stalled one stays in ID, the next one stays in IF).', 'Forgetting that sw’s data register is a source.', 'Treating r0 as a normal register.'],
  giaiThich: '<p>An in-order pipeline is determined by one number per instruction: the last ID cycle. Everything else (IF waiting, EX/MEM/WB) follows from it, and the diagram is just the occupancy of each stage per cycle.</p>',
  khaiNiem: ['pipeline diagram', 'stalls', 'forwarding'],
  fn: 'pipelineLab',
  tep: 'answer.js',
  dau: 'function pipelineLab(lines, forwarding) {\n  return { cycles: 0, stalls: 0, diagram: [] };\n}\n',
  giaiMa: '// Reference solution\n' + dat(pipelineLab, 'pipelineLab'),
  ref: pipelineLab,
  cases: [{ args: [P2, false] }, { args: [P2, true] }, { args: [P1, false] }, { args: [P1, true] }, { args: [P3, true], an: true }, { args: [P3, false], an: true }, { args: [['add r0, r1, r2', 'add r3, r0, r4'], false], an: true }, { args: [[], true], an: true }, { args: [['sw r1, 0(r2)'], true], an: true }],
});

export default doiDau({
  slug: 'cea201-12-lab-pipeline-diagram',
  ten: 'Lab 12 — Pipeline timing diagram generator',
  khoa: KHOA,
  baiHoc: 'cea201-quiz-ch12',
  de: [LAB],
});
