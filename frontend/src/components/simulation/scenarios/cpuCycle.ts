/**
 * Máy tính · CEA201 — chu trình lấy lệnh, giải mã, thực thi.
 *
 * Câu hỏi mà bài này trả lời: "CPU chạy chương trình" nghĩa là gì, cụ thể,
 * ở mức từng bước? Câu trả lời gọn hơn người ta tưởng — CPU chỉ lặp đi lặp
 * lại đúng ba việc, mãi mãi, cho tới khi tắt máy:
 *
 *   FETCH   — đọc lệnh tại địa chỉ mà PC đang trỏ, rồi tăng PC lên.
 *   DECODE  — nhìn mã lệnh, xác định đây là phép gì và toán hạng ở đâu.
 *   EXECUTE — cho ALU tính, hoặc đọc/ghi bộ nhớ, hoặc nhảy tới chỗ khác.
 *
 * Hai chi tiết hay bị bỏ qua nhưng lại là chìa khoá:
 *
 * 1. PC được tăng NGAY ở bước fetch, trước khi lệnh được thực thi. Nhờ vậy
 *    lệnh nhảy chỉ cần ghi đè PC là xong — không có cơ chế "nhảy" riêng biệt
 *    nào cả, nhảy chỉ là gán giá trị cho một thanh ghi.
 * 2. Bộ nhớ không phân biệt lệnh với dữ liệu. Cùng một dãy byte, đọc qua
 *    đường lệnh thì thành lệnh, đọc qua đường dữ liệu thì thành số. Đây là
 *    kiến trúc von Neumann, và cũng là gốc rễ của cả một họ lỗ hổng bảo mật.
 *
 * Nhánh thứ hai cho thấy vì sao CPU thật không chạy tuần tự như vậy: nếu mỗi
 * lệnh phải đợi lệnh trước xong hẳn thì bốn trong năm tầng phần cứng luôn nằm
 * không. Đường ống (pipeline) lấp chỗ trống đó — và tạo ra vấn đề mới.
 */

import { Cpu } from 'lucide-react';
import type { PanelOp, PanelSpec } from '../panels';
import type { I18nText, Scenario, ScenarioOptions, SimStep } from '../types';

/* ── Chương trình mẫu ────────────────────────────────────────── */

const ASM = [
  '        ; tính  x = a + b',
  '0x00    LOAD  R1, [0x10]   ; R1 ← a',
  '0x01    LOAD  R2, [0x11]   ; R2 ← b',
  '0x02    ADD   R3, R1, R2   ; R3 ← R1+R2',
  '0x03    STORE [0x12], R3   ; x ← R3',
  '0x04    HALT',
];

/* ── Bố cục ──────────────────────────────────────────────────── */

const PANELS: PanelSpec[] = [
  {
    id: 'code',
    kind: 'code',
    title: { vi: 'Chương trình trong bộ nhớ', en: 'The program in memory' },
    file: 'chương trình',
    x: 0,
    y: 0,
    w: 470,
    h: 236,
    lines: ASM,
  },
  {
    id: 'mem',
    kind: 'table',
    title: { vi: 'Bộ nhớ — lệnh và dữ liệu nằm chung', en: 'Memory — code and data share it' },
    hint: { vi: 'cùng một dãy byte, khác nhau ở cách đọc', en: 'the same bytes, read two ways' },
    x: 0,
    y: 248,
    w: 470,
    h: 312,
    accent: '#38bdf8',
    columns: [
      { key: 'a', label: 'địa chỉ', flex: 0.6 },
      { key: 'v', label: 'nội dung', flex: 1.2 },
    ],
  },
  {
    id: 'regs',
    kind: 'lanes',
    title: { vi: 'Thanh ghi trong CPU', en: 'Registers inside the CPU' },
    hint: { vi: 'PC tăng ngay ở bước fetch', en: 'PC increments during fetch' },
    x: 482,
    y: 0,
    w: 518,
    h: 330,
    accent: '#f59e0b',
    layout: 'rows',
    lanes: [
      { id: 'pc', label: 'PC', sub: { vi: 'lệnh kế tiếp', en: 'next instruction' }, accent: '#f59e0b' },
      { id: 'ir', label: 'IR', sub: { vi: 'lệnh đang giải mã', en: 'instruction being decoded' }, accent: '#a78bfa' },
      { id: 'alu', label: 'ALU', sub: { vi: 'nơi phép tính xảy ra', en: 'where arithmetic happens' }, accent: '#34d399' },
      { id: 'r', label: 'R1 R2 R3', sub: { vi: 'thanh ghi dùng chung', en: 'general purpose' }, accent: '#38bdf8' },
    ],
  },
  {
    id: 'out',
    kind: 'log',
    title: { vi: 'Từng chu kỳ', en: 'Cycle by cycle' },
    file: 'CPU',
    x: 482,
    y: 342,
    w: 518,
    h: 218,
    accent: '#34d399',
    maxLines: 6,
  },
];

const PIPE_PANELS: PanelSpec[] = [
  {
    id: 'code',
    kind: 'code',
    title: { vi: 'Chương trình trong bộ nhớ', en: 'The program in memory' },
    file: 'chương trình',
    x: 0,
    y: 0,
    w: 470,
    h: 236,
    lines: ASM,
  },
  {
    id: 'out',
    kind: 'log',
    title: { vi: 'Từng chu kỳ', en: 'Cycle by cycle' },
    file: 'CPU',
    x: 0,
    y: 248,
    w: 470,
    h: 312,
    accent: '#34d399',
    maxLines: 9,
  },
  {
    id: 'pipe',
    kind: 'lanes',
    title: { vi: 'Năm tầng của đường ống', en: 'The five pipeline stages' },
    hint: { vi: 'mỗi chu kỳ, mọi tầng đều đang làm việc', en: 'every stage busy every cycle' },
    x: 482,
    y: 0,
    w: 518,
    h: 560,
    accent: '#a78bfa',
    layout: 'rows',
    lanes: [
      { id: 'if', label: 'IF', sub: { vi: 'lấy lệnh', en: 'fetch' }, accent: '#f59e0b' },
      { id: 'id', label: 'ID', sub: { vi: 'giải mã', en: 'decode' }, accent: '#a78bfa' },
      { id: 'ex', label: 'EX', sub: { vi: 'tính toán', en: 'execute' }, accent: '#34d399' },
      { id: 'mem', label: 'MEM', sub: { vi: 'đọc/ghi bộ nhớ', en: 'memory' }, accent: '#38bdf8' },
      { id: 'wb', label: 'WB', sub: { vi: 'ghi lại thanh ghi', en: 'write back' }, accent: '#94a3b8' },
    ],
  },
];

const panels = (opts: ScenarioOptions): PanelSpec[] =>
  opts.mode === 'pipeline' ? PIPE_PANELS : PANELS;

/* ── Tiện ích ────────────────────────────────────────────────── */

type Tone = 'ok' | 'warn' | 'err' | 'muted' | 'info' | 'active';

const lines = (v: number[]): PanelOp => ({ p: 'code', op: 'lines', value: v });
const out = (label: string, tone: Tone = 'muted'): PanelOp => ({ p: 'out', op: 'push', item: { label, tone } });

/** Đặt giá trị mới cho một thanh ghi (xoá giá trị cũ của làn đó trước). */
const reg = (lane: string, label: string, sub: string, tone: Tone = 'info'): PanelOp[] => [
  { p: 'regs', op: 'clear', lane },
  { p: 'regs', op: 'push', lane, item: { label, sub, tone } },
];

const cell = (id: string, addr: string, value: string, tone: Tone): PanelOp => ({
  p: 'mem',
  op: 'push',
  item: { id, label: addr, cells: [addr, value], tone },
});

/** Đưa một lệnh vào một tầng của đường ống. */
const stage = (lane: string, id: string, label: string, sub: string, tone: Tone = 'info'): PanelOp => ({
  p: 'pipe',
  op: 'push',
  lane,
  item: { id, label, sub, tone },
});

const clearStage = (lane: string): PanelOp => ({ p: 'pipe', op: 'clear', lane });

type Push = (
  id: string,
  title: I18nText,
  detail: I18nText,
  duration: number,
  ops: PanelOp[],
  extra?: Partial<SimStep>
) => void;

function collector(): { steps: SimStep[]; push: Push } {
  const steps: SimStep[] = [];
  const push: Push = (id, title, detail, duration, ops, extra = {}) => {
    steps.push({ id, title, detail, kind: 'INTERNAL', duration, ops, ...extra });
  };
  return { steps, push };
}

/* ────────────────────────────────────────────────────────────
   A — MỘT LỆNH ĐI TRỌN CHU TRÌNH
   ──────────────────────────────────────────────────────────── */

function buildCycle(): SimStep[] {
  const { steps, push } = collector();

  push(
    'setup',
    { vi: 'Trước khi bắt đầu: chương trình và dữ liệu đều nằm trong bộ nhớ', en: 'Before we start: program and data both live in memory' },
    {
      vi: 'Ô 0x00 tới 0x04 chứa năm lệnh; ô 0x10 và 0x11 chứa hai số cần cộng. Điều đáng chú ý: không có gì trong bộ nhớ đánh dấu "đây là lệnh" hay "đây là số". Chúng là những dãy bit y hệt nhau — cái quyết định là CPU đọc chúng qua đường nào.',
      en: 'Cells 0x00 to 0x04 hold five instructions; 0x10 and 0x11 hold the two numbers to add. Note what is missing: nothing in memory marks anything as "code" or "data". They are identical bit patterns — what decides is which path the CPU reads them through.',
    },
    2700,
    [
      lines([2, 3, 4, 5, 6]),
      cell('m0', '0x00', 'LOAD R1,[0x10]', 'muted'),
      cell('m1', '0x01', 'LOAD R2,[0x11]', 'muted'),
      cell('m2', '0x02', 'ADD R3,R1,R2', 'muted'),
      cell('m3', '0x10', '7   ← dữ liệu', 'info'),
      cell('m4', '0x11', '5   ← dữ liệu', 'info'),
      ...reg('pc', '0x00', 'trỏ vào lệnh đầu', 'ok'),
      out('reset · PC = 0x00', 'muted'),
    ],
    { sfx: 'click' }
  );

  push(
    'fetch',
    { vi: 'FETCH — đọc lệnh tại PC, rồi tăng PC ngay', en: 'FETCH — read the instruction at PC, then increment PC' },
    {
      vi: 'CPU đặt giá trị PC lên bus địa chỉ, bộ nhớ trả về nội dung ô đó, và lệnh được cất vào thanh ghi IR. Ngay sau đó PC tăng lên 0x01 — trước khi lệnh vừa lấy được thực thi. Chính thứ tự này làm cho lệnh nhảy trở nên đơn giản: nhảy chỉ là ghi đè PC.',
      en: 'The CPU puts PC on the address bus, memory returns that cell’s contents, and the instruction is latched into IR. Immediately after, PC becomes 0x01 — before the fetched instruction has run at all. That ordering is what makes jumps simple: a jump is just overwriting PC.',
    },
    3000,
    [
      lines([2]),
      ...reg('ir', 'LOAD R1,[0x10]', 'vừa lấy về', 'active'),
      ...reg('pc', '0x01', 'đã tăng, trước khi thực thi', 'warn'),
      { p: 'mem', op: 'tone', key: 'm0', tone: 'active' },
      out('chu kỳ 1 · fetch 0x00 → IR · PC ← 0x01', 'info'),
    ],
    {
      sfx: 'blip',
      teachingNote: {
        vi: 'Hỏi lớp: PC đã tăng rồi mà lệnh chưa chạy — vậy lệnh JUMP làm gì để nhảy?',
        en: 'Ask the class: PC already moved but the instruction has not run — so what does a JUMP actually do?',
      },
    }
  );

  push(
    'decode',
    { vi: 'DECODE — dãy bit đó nghĩa là gì', en: 'DECODE — what does that bit pattern mean' },
    {
      vi: 'Bộ giải mã tách lệnh thành các phần: mã phép (LOAD), thanh ghi đích (R1), và địa chỉ nguồn (0x10). Không có phép tính nào ở bước này — nó chỉ là bật đúng những đường điều khiển để phần cứng biết lát nữa phải làm gì với dữ liệu.',
      en: 'The decoder splits the instruction into fields: the opcode (LOAD), the destination register (R1), and the source address (0x10). No arithmetic happens here — it merely raises the right control lines so the hardware knows what to do with the data next.',
    },
    2800,
    [
      ...reg('ir', 'LOAD  R1 ← [0x10]', 'opcode · đích · nguồn', 'info'),
      out('chu kỳ 2 · decode: opcode=LOAD, rd=R1, addr=0x10', 'info'),
    ],
    { sfx: 'blip' }
  );

  push(
    'execute',
    { vi: 'EXECUTE — đọc bộ nhớ và ghi vào thanh ghi', en: 'EXECUTE — read memory and write the register' },
    {
      vi: 'Với LOAD thì phần thực thi là một lượt đọc bộ nhớ: lấy giá trị ở 0x10 rồi đặt vào R1. Chú ý ô 0x10 chứa số 7 — cùng loại byte như ô 0x00 chứa lệnh, chỉ khác là lần này CPU đọc nó qua đường dữ liệu chứ không phải đường lệnh.',
      en: 'For LOAD, execution is a memory read: take the value at 0x10 and place it in R1. Note that 0x10 holds the number 7 — the same kind of bytes as 0x00 holding an instruction, except this time the CPU read it through the data path rather than the instruction path.',
    },
    3000,
    [
      { p: 'mem', op: 'tone', key: 'm3', tone: 'active' },
      ...reg('r', 'R1 = 7', 'vừa nạp từ 0x10', 'ok'),
      out('chu kỳ 3 · execute: R1 ← mem[0x10] = 7', 'ok'),
    ],
    { sfx: 'ping' }
  );

  push(
    'repeat',
    { vi: 'Lặp lại — lệnh thứ hai đi trọn cùng ba bước đó', en: 'Repeat — the second instruction runs the same three steps' },
    {
      vi: 'Không có gì mới: fetch tại 0x01, PC lên 0x02, decode, rồi nạp 5 vào R2. Toàn bộ "chạy chương trình" chỉ là vòng lặp này quay hàng tỉ lần mỗi giây. Một CPU 3 GHz quay khoảng ba tỉ vòng trong một giây.',
      en: 'Nothing new: fetch at 0x01, PC goes to 0x02, decode, then load 5 into R2. All of "running a program" is this loop spinning billions of times per second. A 3 GHz CPU turns it roughly three billion times a second.',
    },
    2700,
    [
      lines([3]),
      ...reg('pc', '0x02', '', 'warn'),
      ...reg('ir', 'LOAD R2,[0x11]', '', 'info'),
      ...reg('r', 'R1=7  R2=5', 'đã nạp cả hai', 'ok'),
      out('chu kỳ 4-6 · R2 ← mem[0x11] = 5', 'ok'),
    ],
    { sfx: 'blip' }
  );

  push(
    'alu',
    { vi: 'ADD — lần này ALU mới thật sự làm việc', en: 'ADD — now the ALU actually does something' },
    {
      vi: 'Hai lệnh vừa rồi chỉ chuyển dữ liệu. `ADD` mới là lệnh đưa hai giá trị vào ALU — khối mạch chỉ biết làm cộng, trừ, AND, OR, dịch bit — và lấy kết quả ra. ALU không đọc bộ nhớ, không biết địa chỉ là gì; nó chỉ nhận hai số ở đầu vào và trả một số ở đầu ra.',
      en: 'The previous two instructions only moved data. `ADD` is the one that feeds two values into the ALU — a block of circuitry that only knows how to add, subtract, AND, OR and shift — and takes the result back. The ALU never reads memory and knows nothing about addresses; it takes two numbers in and produces one out.',
    },
    3100,
    [
      lines([4]),
      ...reg('pc', '0x03', '', 'warn'),
      ...reg('ir', 'ADD R3,R1,R2', '', 'info'),
      ...reg('alu', '7 + 5 = 12', 'cộng số nguyên', 'ok'),
      ...reg('r', 'R1=7 R2=5 R3=12', '', 'ok'),
      out('chu kỳ 7-9 · ALU: 7+5 → R3 = 12', 'ok'),
    ],
    { sfx: 'success' }
  );

  push(
    'store',
    { vi: 'STORE — và kết quả quay lại bộ nhớ', en: 'STORE — and the result goes back to memory' },
    {
      vi: 'Ô 0x12 nhận giá trị 12. Chương trình `x = a + b` vừa chạy xong, tốn khoảng mười hai chu kỳ. Điều đáng suy nghĩ: mọi phần mềm bạn từng dùng — trình duyệt, trò chơi, mô hình AI — đều được xây từ đúng bốn loại việc này: chuyển dữ liệu, tính toán, so sánh, và nhảy.',
      en: 'Cell 0x12 receives 12. The program `x = a + b` has finished, in about twelve cycles. Worth pausing on: every piece of software you have ever used — browsers, games, AI models — is built from exactly these four kinds of work: move data, compute, compare, and jump.',
    },
    3000,
    [
      lines([5]),
      ...reg('pc', '0x04', '', 'warn'),
      cell('m5', '0x12', '12  ← kết quả', 'ok'),
      out('chu kỳ 10-12 · mem[0x12] ← 12', 'ok'),
    ],
    { sfx: 'success' }
  );

  push(
    'waste',
    { vi: 'Nhưng cách chạy này lãng phí phần cứng khủng khiếp', en: 'But running this way wastes an enormous amount of hardware' },
    {
      vi: 'Trong lúc ALU đang cộng, khối lấy lệnh nằm không. Trong lúc lấy lệnh, ALU nằm không. Mỗi thời điểm chỉ một phần năm số mạch đang làm việc — bốn phần năm còn lại chờ. Đó là lý do CPU thật không chạy tuần tự thế này; chọn "Đường ống 5 tầng" để xem cách lấp chỗ trống.',
      en: 'While the ALU adds, the fetch unit idles. While fetching, the ALU idles. At any instant only a fifth of the circuitry is working — the other four fifths wait. That is why real CPUs do not run sequentially like this; pick "5-stage pipeline" to see how the gaps get filled.',
    },
    2900,
    [out('12 chu kỳ · mỗi lúc chỉ 1/5 phần cứng bận', 'warn')],
    { sfx: 'buzz' }
  );

  return steps;
}

/* ────────────────────────────────────────────────────────────
   B — ĐƯỜNG ỐNG 5 TẦNG
   ──────────────────────────────────────────────────────────── */

function buildPipeline(): SimStep[] {
  const { steps, push } = collector();

  push(
    'idea',
    { vi: 'Ý tưởng: chia CPU thành năm tầng làm việc đồng thời', en: 'The idea: split the CPU into five stages working at once' },
    {
      vi: 'Giống một dây chuyền giặt là: đang sấy mẻ thứ nhất thì đã giặt được mẻ thứ hai. Mỗi tầng phần cứng làm đúng một việc và chuyển kết quả sang tầng kế. Chu kỳ 1 chỉ có tầng IF bận — dây chuyền còn đang được lấp đầy.',
      en: 'Like a laundry line: while the first load dries, the second is already washing. Each hardware stage does exactly one job and hands its result to the next. In cycle 1 only IF is busy — the line is still filling.',
    },
    2700,
    [lines([2]), stage('if', 's1', 'LOAD R1', 'chu kỳ 1', 'info'), out('chu kỳ 1 · IF: LOAD R1', 'muted')],
    { sfx: 'click' }
  );

  push(
    'fill',
    { vi: 'Chu kỳ 2 và 3 — dây chuyền lấp dần', en: 'Cycles 2 and 3 — the line fills up' },
    {
      vi: 'Lệnh thứ nhất trôi xuống tầng ID, và ngay lúc đó tầng IF đã lấy lệnh thứ hai. Không tầng nào phải đợi tầng khác xong việc của cả lệnh — mỗi tầng chỉ cần xong PHẦN của mình trong chu kỳ này.',
      en: 'The first instruction slides down to ID, and at that very moment IF is already fetching the second. No stage waits for another to finish a whole instruction — each only needs to finish ITS part within this cycle.',
    },
    2800,
    [
      lines([3]),
      clearStage('if'),
      stage('id', 's1b', 'LOAD R1', 'giải mã', 'info'),
      stage('if', 's2', 'LOAD R2', 'chu kỳ 2', 'info'),
      out('chu kỳ 2 · IF: LOAD R2 · ID: LOAD R1', 'muted'),
    ],
    { sfx: 'blip' }
  );

  push(
    'full',
    { vi: 'Chu kỳ 5 — dây chuyền đầy, năm lệnh cùng chạy', en: 'Cycle 5 — the pipeline is full, five instructions in flight' },
    {
      vi: 'Đây là trạng thái mà đường ống sinh ra để đạt tới: mọi tầng đều bận, năm lệnh khác nhau đang ở năm giai đoạn khác nhau. Mỗi lệnh vẫn tốn năm chu kỳ để đi hết, nhưng cứ mỗi chu kỳ lại có một lệnh HOÀN THÀNH — thông lượng tăng gấp năm mà không cần tăng xung nhịp.',
      en: 'This is the state the pipeline exists to reach: every stage busy, five different instructions at five different phases. Each instruction still takes five cycles end to end, but one instruction now COMPLETES every cycle — five times the throughput without raising the clock.',
    },
    3200,
    [
      lines([2, 3, 4, 5, 6]),
      clearStage('if'),
      clearStage('id'),
      stage('if', 'f5', 'HALT', '', 'info'),
      stage('id', 'f4', 'STORE', '', 'info'),
      stage('ex', 'f3', 'ADD', 'ALU đang cộng', 'ok'),
      stage('mem', 'f2', 'LOAD R2', 'đọc 0x11', 'ok'),
      stage('wb', 'f1', 'LOAD R1', 'ghi R1', 'ok'),
      out('chu kỳ 5 · cả 5 tầng đều bận', 'ok'),
      out('thông lượng: 1 lệnh xong mỗi chu kỳ', 'ok'),
    ],
    {
      sfx: 'success',
      teachingNote: {
        vi: 'Nhấn mạnh: độ trễ MỘT lệnh không giảm (vẫn 5 chu kỳ) — cái tăng là thông lượng.',
        en: 'Stress: the latency of one instruction does not drop (still 5 cycles) — throughput is what rises.',
      },
    }
  );

  push(
    'hazard',
    { vi: 'Nhưng ADD cần R1 mà R1 chưa được ghi xong', en: 'But ADD needs R1, and R1 has not been written yet' },
    {
      vi: 'Đây là *data hazard*. Ở chu kỳ 5, lệnh `ADD` đang ở tầng EX và cần giá trị của R1 — nhưng `LOAD R1` mới vừa tới tầng WB, tức là R1 chưa thật sự được cập nhật khi ALU đọc nó. Nếu cứ để vậy, ALU sẽ cộng phải giá trị cũ, và kết quả sai một cách âm thầm.',
      en: 'This is a *data hazard*. At cycle 5 the `ADD` sits in EX needing R1 — but `LOAD R1` has only just reached WB, so R1 is not actually updated when the ALU reads it. Left alone, the ALU adds a stale value and the result is silently wrong.',
    },
    3200,
    [
      stage('ex', 'h1', '⚠ ADD cần R1', 'R1 chưa ghi xong', 'err'),
      out('data hazard: ADD đọc R1 trước khi WB ghi xong', 'err'),
    ],
    { sfx: 'error' }
  );

  push(
    'stall',
    { vi: 'Cách thô: chèn bong bóng, bắt cả đường ống đợi', en: 'The blunt fix: insert a bubble and make the pipeline wait' },
    {
      vi: 'Phần cứng nhận ra xung đột và nhét vào một chu kỳ rỗng — gọi là *bubble* hay *stall*. Nó đúng, nhưng mỗi bong bóng là một chu kỳ không lệnh nào hoàn thành. Chuỗi lệnh phụ thuộc nhau dày đặc có thể ăn mất phần lớn lợi ích của đường ống.',
      en: 'The hardware detects the conflict and injects an empty cycle — a *bubble*, or stall. It is correct, but every bubble is a cycle in which nothing completes. A dense chain of dependent instructions can eat most of the pipeline’s benefit.',
    },
    3000,
    [
      clearStage('ex'),
      stage('ex', 'h2', '— bong bóng —', 'mất 1 chu kỳ', 'warn'),
      out('chu kỳ 6 · stall: 0 lệnh hoàn thành', 'warn'),
    ],
    { sfx: 'buzz' }
  );

  push(
    'forward',
    { vi: 'Cách khéo: chuyển tiếp thẳng kết quả, không qua thanh ghi', en: 'The clever fix: forward the result without going through the register' },
    {
      vi: 'Giá trị của R1 THỰC RA đã tồn tại — nó đang nằm ở đầu ra của tầng trước, chỉ là chưa kịp ghi vào ô thanh ghi. *Forwarding* nối thẳng đầu ra đó về đầu vào ALU. Không cần đợi ai cả, không mất chu kỳ nào, và đây là lý do CPU hiện đại chịu được những chuỗi lệnh phụ thuộc liên tiếp.',
      en: 'R1’s value ALREADY exists — it is sitting at the previous stage’s output, merely not yet written into the register file. *Forwarding* wires that output straight back to the ALU input. Nobody waits, no cycle is lost, and this is why modern CPUs tolerate long chains of dependent instructions.',
    },
    3200,
    [
      clearStage('ex'),
      stage('ex', 'h3', 'ADD (đã forward)', 'lấy thẳng từ tầng trước', 'ok'),
      out('chu kỳ 6 · forwarding: không mất chu kỳ nào', 'ok'),
    ],
    { sfx: 'ping' }
  );

  push(
    'branch',
    { vi: 'Và loại xung đột khó nhất: lệnh rẽ nhánh', en: 'And the hardest hazard of all: branches' },
    {
      vi: 'Khi gặp lệnh nhảy có điều kiện, CPU chưa biết lệnh kế tiếp nằm ở đâu cho tới khi điều kiện được tính xong — mà lúc đó tầng IF đã nạp sẵn vài lệnh rồi. Giải pháp thực tế là ĐOÁN: dự đoán nhánh, cứ chạy tiếp theo hướng đoán, và nếu đoán sai thì vứt bỏ những gì đã làm. Đoán đúng thì không mất gì; đoán sai tốn cỡ mười lăm chu kỳ trên CPU hiện đại.',
      en: 'At a conditional jump the CPU does not know where the next instruction lives until the condition resolves — by which time IF has already fetched several. The practical answer is to GUESS: predict the branch, keep going down the predicted path, and discard the work if the guess was wrong. A correct guess costs nothing; a wrong one costs around fifteen cycles on a modern CPU.',
    },
    3200,
    [out('dự đoán nhánh: đoán đúng ~95% · đoán sai ≈ 15 chu kỳ', 'info')],
    { sfx: 'blip' }
  );

  push(
    'why',
    { vi: 'Vì sao điều này đáng quan tâm khi viết phần mềm', en: 'Why this matters when you write software' },
    {
      vi: 'Nó giải thích những chuyện tưởng như vô lý ở tầng cao: vì sao duyệt mảng theo thứ tự nhanh hơn nhảy lung tung (dự đoán nạp trước hoạt động tốt), vì sao mảng đã sắp xếp có thể chạy nhanh hơn mảng chưa sắp xếp trên cùng một đoạn mã (dự đoán nhánh đoán đúng liên tục), và vì sao đo hiệu năng bằng cách đếm số dòng lệnh gần như luôn sai.',
      en: 'It explains things that look absurd at the high level: why iterating an array in order beats jumping around it (prefetch prediction works), why a sorted array can run faster than an unsorted one through identical code (the branch predictor keeps guessing right), and why counting lines of code is an almost always wrong way to estimate performance.',
    },
    3100,
    [lines([])],
    { sfx: 'lock' }
  );

  return steps;
}

/* ── Kịch bản ────────────────────────────────────────────────── */

export const cpuCycleScenario: Scenario = {
  id: 'cpu-cycle',
  name: { vi: 'CPU — lấy lệnh, giải mã, thực thi', en: 'The CPU — fetch, decode, execute' },
  tagline: {
    vi: 'CPU chỉ lặp đúng ba việc cho tới khi tắt máy. PC tăng NGAY ở bước lấy lệnh — nên "nhảy" chẳng qua là ghi đè một thanh ghi. Và chạy tuần tự thì bốn phần năm phần cứng luôn nằm không.',
    en: 'A CPU repeats exactly three steps until you switch it off. PC increments during FETCH — so a "jump" is nothing but overwriting a register. And run sequentially, four fifths of the silicon sits idle.',
  },
  icon: Cpu,
  accent: '#f59e0b',
  group: 'computer',
  nodes: [],
  edges: [],
  panels,
  options: [
    {
      id: 'mode',
      label: { vi: 'Cách CPU chạy', en: 'How the CPU runs' },
      defaultValue: 'cycle',
      choices: [
        {
          value: 'cycle',
          label: 'Tuần tự từng lệnh',
          fullLabel: 'Một lệnh đi trọn ba bước',
          color: '#f59e0b',
          hint: { vi: '12 chu kỳ, 1/5 phần cứng bận', en: '12 cycles, a fifth of the silicon busy' },
        },
        {
          value: 'pipeline',
          label: 'Đường ống 5 tầng',
          fullLabel: 'Năm lệnh cùng chạy + hazard',
          color: '#a78bfa',
          hint: { vi: '1 lệnh xong mỗi chu kỳ', en: 'one instruction completes per cycle' },
        },
      ],
    },
  ],
  build: (opts: ScenarioOptions): SimStep[] => (opts.mode === 'pipeline' ? buildPipeline() : buildCycle()),
};
