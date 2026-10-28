/**
 * CPU đồ chơi = máy MARIE (Null & Lobur, "The Essentials of Computer Organization and Architecture") — đúng cỗ máy mà
 * CEA201 dùng ở cụm thực hành hợp ngữ (buổi 39–44). Kiến trúc von Neumann: MỘT bộ nhớ 4096 từ × 16 bit chứa CẢ lệnh
 * lẫn dữ liệu; lệnh = 4 bit mã lệnh + 12 bit địa chỉ; một thanh ghi tích luỹ AC.
 *
 * Hàm thuần: assemble(nguồn) → chương trình; run(chương trình) → dãy ảnh chụp TỪNG VI BƯỚC (RTN) để bộ phát tua tới/lùi.
 * Skipcond theo MARIE gốc (bit 11–10: 00 AC<0 · 01 AC=0 · 10 AC>0). Bản fork trường phát so sánh thêm 10 bit thấp —
 * khác biệt đó được ghi rõ trong bài ASM.a; ở đây giữ bản gốc vì đó là bản trong sách.
 */

export const MEM_WORDS = 4096;
export const OPS = {
  JNS: 0x0, LOAD: 0x1, STORE: 0x2, ADD: 0x3, SUBT: 0x4, INPUT: 0x5, OUTPUT: 0x6, HALT: 0x7,
  SKIPCOND: 0x8, JUMP: 0x9, CLEAR: 0xa, ADDI: 0xb, JUMPI: 0xc, LOADI: 0xd, STOREI: 0xe,
} as const;
export const NAMES = ['JnS', 'Load', 'Store', 'Add', 'Subt', 'Input', 'Output', 'Halt', 'Skipcond', 'Jump', 'Clear', 'AddI', 'JumpI', 'LoadI', 'StoreI'];
/** tên quen thuộc của các máy khác → lệnh MARIE */
export const ALIASES: Record<string, keyof typeof OPS> = { SUB: 'SUBT', JMP: 'JUMP', HLT: 'HALT', OUT: 'OUTPUT', IN: 'INPUT' };
const NO_OPERAND = new Set([OPS.INPUT, OPS.OUTPUT, OPS.HALT, OPS.CLEAR]);

export const OP_HELP: Array<{ op: number; name: string; en: string; vi: string; rtn: string }> = [
  { op: 0x0, name: 'JnS X', en: 'store PC at X, jump to X+1 (call a subroutine)', vi: 'lưu PC vào X, nhảy tới X+1 (gọi chương trình con)', rtn: 'MBR←PC; MAR←X; M[MAR]←MBR; MBR←X; AC←1; AC←AC+MBR; PC←AC' },
  { op: 0x1, name: 'Load X', en: 'AC ← M[X]', vi: 'AC ← M[X]', rtn: 'MAR←X; MBR←M[MAR]; AC←MBR' },
  { op: 0x2, name: 'Store X', en: 'M[X] ← AC', vi: 'M[X] ← AC', rtn: 'MAR←X; MBR←AC; M[MAR]←MBR' },
  { op: 0x3, name: 'Add X', en: 'AC ← AC + M[X]', vi: 'AC ← AC + M[X]', rtn: 'MAR←X; MBR←M[MAR]; AC←AC+MBR' },
  { op: 0x4, name: 'Subt X', en: 'AC ← AC − M[X]', vi: 'AC ← AC − M[X]', rtn: 'MAR←X; MBR←M[MAR]; AC←AC−MBR' },
  { op: 0x5, name: 'Input', en: 'AC ← next input value', vi: 'AC ← giá trị nhập kế tiếp', rtn: 'AC←InREG' },
  { op: 0x6, name: 'Output', en: 'print AC', vi: 'in AC ra', rtn: 'OutREG←AC' },
  { op: 0x7, name: 'Halt', en: 'stop the machine', vi: 'dừng máy', rtn: '—' },
  { op: 0x8, name: 'Skipcond c', en: 'skip next instruction if: 000 AC<0 · 400 AC=0 · 800 AC>0', vi: 'bỏ qua lệnh kế nếu: 000 AC<0 · 400 AC=0 · 800 AC>0', rtn: 'if cond then PC←PC+1' },
  { op: 0x9, name: 'Jump X', en: 'PC ← X', vi: 'PC ← X', rtn: 'PC←IR[11–0]' },
  { op: 0xa, name: 'Clear', en: 'AC ← 0', vi: 'AC ← 0', rtn: 'AC←0' },
  { op: 0xb, name: 'AddI X', en: 'AC ← AC + M[M[X]] (indirect)', vi: 'AC ← AC + M[M[X]] (gián tiếp)', rtn: 'MBR←M[MAR]; MAR←MBR; MBR←M[MAR]; AC←AC+MBR' },
  { op: 0xc, name: 'JumpI X', en: 'PC ← M[X] (return from subroutine)', vi: 'PC ← M[X] (trở về từ chương trình con)', rtn: 'MBR←M[MAR]; PC←MBR' },
  { op: 0xd, name: 'LoadI X', en: 'AC ← M[M[X]] (X holds a pointer)', vi: 'AC ← M[M[X]] (X chứa con trỏ)', rtn: 'MBR←M[MAR]; MAR←MBR; MBR←M[MAR]; AC←MBR' },
  { op: 0xe, name: 'StoreI X', en: 'M[M[X]] ← AC', vi: 'M[M[X]] ← AC', rtn: 'MBR←M[MAR]; MAR←MBR; MBR←AC; M[MAR]←MBR' },
];

export const hex3 = (v: number) => v.toString(16).toUpperCase().padStart(3, '0');
export const hex4 = (v: number) => v.toString(16).toUpperCase().padStart(4, '0');
export const bin16 = (v: number) => v.toString(2).padStart(16, '0');
export const s16 = (v: number) => (v >= 0x8000 ? v - 0x10000 : v);
export const u16 = (v: number) => ((Math.trunc(v) % 0x10000) + 0x10000) % 0x10000;

export function disasm(word: number): string {
  const op = word >> 12, x = word & 0xfff;
  if (op === 0xf) return '???';
  if (NO_OPERAND.has(op as 5)) return NAMES[op];
  return `${NAMES[op]} ${hex3(x)}`;
}

/* ═══════════ HỢP DỊCH (hai lượt) ═══════════ */
export interface AsmMsg { line: number; en: string; vi: string }
export interface AsmLine {
  line: number; src: string; label?: string;
  kind: 'instr' | 'data' | 'none';
  addr: number | null; word: number | null;
  mnemonic?: string; operandText?: string; operand?: number;
}
export interface Program {
  ok: boolean;
  errors: AsmMsg[];
  lines: AsmLine[];
  symbols: Record<string, number>;
  mem: Uint16Array;
  /** địa chỉ → dòng nguồn (để tô dòng đang chạy) */
  addrLine: Map<number, number>;
  /** những ô do lệnh tạo ra (khác ô dữ liệu DEC/HEX) */
  codeAddrs: Set<number>;
  start: number;
  /** ô cuối cùng hợp dịch ghi vào */
  last: number;
}

const LABEL_RE = /^[A-Za-z_][A-Za-z0-9_]*$/;
const parseHex = (t: string) => (/^[0-9a-f]+$/i.test(t) ? parseInt(t, 16) : NaN);

export function assemble(src: string): Program {
  const raw = src.replace(/\r/g, '').split('\n');
  const errors: AsmMsg[] = [];
  const symbols: Record<string, number> = {};
  const lines: AsmLine[] = [];
  const err = (line: number, en: string, vi: string) => errors.push({ line, en, vi });

  interface Parsed { line: number; src: string; label?: string; op?: string; arg?: string }
  const parsed: Parsed[] = [];
  for (let i = 0; i < raw.length; i++) {
    let t = raw[i];
    const c = t.indexOf('/');
    if (c >= 0) t = t.slice(0, c);
    t = t.trim();
    const p: Parsed = { line: i + 1, src: raw[i] };
    if (t) {
      const m = t.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*,\s*(.*)$/);
      if (m) { p.label = m[1]; t = m[2].trim(); }
      if (t) {
        const parts = t.split(/\s+/);
        p.op = parts[0];
        if (parts.length > 2) err(i + 1, `Too many words: "${t}"`, `Thừa chữ: "${t}"`);
        p.arg = parts[1];
      }
    }
    parsed.push(p);
  }

  // Lượt 1: gán địa chỉ cho nhãn
  let lc = 0, start = 0, seenWord = false, ended = false;
  const addrOf: Array<number | null> = [];
  for (const p of parsed) {
    if (ended) { addrOf.push(null); continue; }
    const OP = p.op?.toUpperCase();
    if (OP === 'ORG') {
      const v = parseHex(p.arg ?? '');
      if (!Number.isFinite(v) || v >= MEM_WORDS) err(p.line, 'ORG needs a hex address 000–FFF', 'ORG cần một địa chỉ hex 000–FFF');
      else { lc = v; if (!seenWord) start = v; }
      addrOf.push(null);
      if (p.label) err(p.line, 'A label cannot sit on ORG', 'Không đặt nhãn trên dòng ORG');
      continue;
    }
    if (OP === 'END') { ended = true; addrOf.push(null); continue; }
    if (!p.op) {
      addrOf.push(null);
      if (p.label) err(p.line, `Label "${p.label}" labels nothing`, `Nhãn "${p.label}" không gắn với lệnh/dữ liệu nào`);
      continue;
    }
    if (p.label) {
      const k = p.label.toUpperCase();
      if (k in symbols) err(p.line, `Label "${p.label}" is defined twice`, `Nhãn "${p.label}" bị khai hai lần`);
      else symbols[k] = lc;
    }
    if (lc >= MEM_WORDS) { err(p.line, 'Program does not fit in 4096 words', 'Chương trình vượt 4096 ô nhớ'); addrOf.push(null); continue; }
    addrOf.push(lc);
    lc++;
    seenWord = true;
  }

  // Lượt 2: sinh mã
  const mem = new Uint16Array(MEM_WORDS);
  const addrLine = new Map<number, number>();
  const codeAddrs = new Set<number>();
  let last = start;
  const resolve = (arg: string | undefined, line: number): number | null => {
    if (arg === undefined) return null;
    const k = arg.toUpperCase();
    if (k in symbols) return symbols[k];
    const v = parseHex(arg);
    if (Number.isFinite(v)) {
      if (v >= MEM_WORDS) { err(line, `Address ${arg} is beyond FFF`, `Địa chỉ ${arg} vượt quá FFF`); return null; }
      return v;
    }
    err(line, LABEL_RE.test(arg) ? `Unknown label "${arg}"` : `Bad operand "${arg}"`, LABEL_RE.test(arg) ? `Không có nhãn "${arg}"` : `Toán hạng sai "${arg}"`);
    return null;
  };
  parsed.forEach((p, i) => {
    const addr = addrOf[i];
    const L: AsmLine = { line: p.line, src: p.src, label: p.label, kind: 'none', addr, word: null };
    lines.push(L);
    if (addr === null || !p.op) return;
    let OP = p.op.toUpperCase();
    if (OP in ALIASES) OP = ALIASES[OP];
    let word: number | null = null;
    if (OP === 'DEC') {
      const v = /^[-+]?\d+$/.test(p.arg ?? '') ? parseInt(p.arg!, 10) : NaN;
      if (!Number.isFinite(v) || v < -32768 || v > 65535) err(p.line, 'DEC needs a whole number in −32768…65535', 'DEC cần số nguyên trong −32768…65535');
      else word = u16(v);
      L.kind = 'data';
    } else if (OP === 'HEX') {
      const v = parseHex(p.arg ?? '');
      if (!Number.isFinite(v) || v > 0xffff) err(p.line, 'HEX needs 0–FFFF', 'HEX cần 0–FFFF');
      else word = v;
      L.kind = 'data';
    } else if (OP === 'OCT') {
      const v = /^[0-7]+$/.test(p.arg ?? '') ? parseInt(p.arg!, 8) : NaN;
      if (!Number.isFinite(v) || v > 0xffff) err(p.line, 'OCT needs an octal number', 'OCT cần số bát phân');
      else word = v;
      L.kind = 'data';
    } else if (OP === 'ADR') {
      const v = resolve(p.arg, p.line);
      if (v !== null) word = v;
      L.kind = 'data';
    } else if (OP in OPS) {
      const op = OPS[OP as keyof typeof OPS];
      L.kind = 'instr';
      L.mnemonic = NAMES[op];
      let x = 0;
      if (NO_OPERAND.has(op as 5)) {
        if (p.arg !== undefined) { const v = resolve(p.arg, p.line); if (v !== null) x = v; }
      } else if (p.arg === undefined) {
        err(p.line, `${NAMES[op]} needs an operand`, `${NAMES[op]} cần một toán hạng`);
      } else if (op === OPS.SKIPCOND) {
        const v = parseHex(p.arg);
        if (!Number.isFinite(v) || v > 0xfff) err(p.line, 'Skipcond takes a hex code: 000, 400 or 800', 'Skipcond nhận mã hex: 000, 400 hoặc 800');
        else x = v;
      } else {
        const v = resolve(p.arg, p.line);
        if (v !== null) x = v;
      }
      L.operandText = p.arg;
      L.operand = x;
      word = (op << 12) | x;
      codeAddrs.add(addr);
    } else {
      err(p.line, `Unknown instruction "${p.op}"`, `Không có lệnh "${p.op}"`);
    }
    if (word !== null) { mem[addr] = word; L.word = word; addrLine.set(addr, p.line); last = Math.max(last, addr); }
  });

  return { ok: errors.length === 0, errors, lines, symbols, mem, addrLine, codeAddrs, start, last };
}

/* ═══════════ CHẠY TỪNG VI BƯỚC ═══════════ */
export type RegName = 'AC' | 'MAR' | 'MBR' | 'PC' | 'IR' | 'IN' | 'OUT';
export type Unit = RegName | 'MEM' | 'ALU' | 'CU' | 'INDEV' | 'OUTDEV';
export interface Regs { AC: number; MAR: number; MBR: number; PC: number; IR: number; IN: number; OUT: number }
export type Phase = 'start' | 'fetch' | 'decode' | 'execute' | 'halt' | 'stop';
export interface Snap {
  phase: Phase;
  /** RTN của vi bước, vd. "MAR ← PC" */
  rtn: string;
  en: string; vi: string;
  regs: Regs;
  /** dữ liệu chạy trên bus: từ đâu tới đâu */
  bus?: { from: Unit; to: Unit; value: number; kind: 'addr' | 'data' };
  changed: RegName[];
  memRead?: number; memWrite?: number;
  memVer: number;
  /** địa chỉ của lệnh đang chạy */
  at: number;
  /** số lệnh đã chạy xong */
  done: number;
  output: number[];
  inputUsed: number;
  /** vi bước cuối của một lệnh */
  last: boolean;
}
export interface TraceRow { at: number; word: number; text: string; regs: Regs; skipped?: boolean }
export interface RunResult {
  snaps: Snap[];
  mems: Uint16Array[];
  trace: TraceRow[];
  stop: 'halt' | 'limit' | 'input' | 'illegal';
}

export function run(prog: Program, inputs: number[] = [], maxInstr = 2000): RunResult {
  const mems: Uint16Array[] = [prog.mem.slice()];
  let mem = mems[0];
  const R: Regs = { AC: 0, MAR: 0, MBR: 0, PC: prog.start, IR: 0, IN: 0, OUT: 0 };
  const snaps: Snap[] = [];
  const trace: TraceRow[] = [];
  const output: number[] = [];
  let inputUsed = 0, done = 0, at = prog.start;
  const push = (phase: Phase, rtn: string, en: string, vi: string, changed: RegName[], extra: Partial<Snap> = {}) => {
    snaps.push({ phase, rtn, en, vi, regs: { ...R }, changed, memVer: mems.length - 1, at, done, output: output.slice(), inputUsed, last: false, ...extra });
  };
  const write = (addr: number, v: number) => {
    mem = mem.slice();
    mem[addr] = u16(v);
    mems.push(mem);
  };
  push('start', '—', 'Power on. PC holds the address of the first instruction; every other register is 0.', 'Bật máy. PC giữ địa chỉ lệnh đầu tiên; mọi thanh ghi khác bằng 0.', []);

  let stop: RunResult['stop'] = 'limit';
  for (; done < maxInstr; ) {
    at = R.PC;
    // FETCH
    R.MAR = R.PC;
    push('fetch', 'MAR ← PC', `Fetch: copy PC (${hex3(R.PC)}) into MAR — the address goes out on the address bus.`, `Nạp lệnh: chép PC (${hex3(R.PC)}) vào MAR — địa chỉ đi ra bus địa chỉ.`, ['MAR'], { bus: { from: 'PC', to: 'MAR', value: R.MAR, kind: 'addr' } });
    R.IR = mem[R.MAR];
    R.MBR = R.IR;
    push('fetch', 'IR ← M[MAR]', `Memory returns the word at ${hex3(R.MAR)}: ${hex4(R.IR)} = ${bin16(R.IR).replace(/(\d{4})(?=\d)/g, '$1 ')}. It is just bits — the CPU treats it as an instruction because PC pointed here.`, `Bộ nhớ trả về từ tại ${hex3(R.MAR)}: ${hex4(R.IR)} = ${bin16(R.IR).replace(/(\d{4})(?=\d)/g, '$1 ')}. Nó chỉ là bit — CPU coi nó là lệnh vì PC trỏ vào đây.`, ['IR', 'MBR'], { bus: { from: 'MEM', to: 'IR', value: R.IR, kind: 'data' }, memRead: R.MAR });
    R.PC = (R.PC + 1) & 0xfff;
    push('fetch', 'PC ← PC + 1', `PC moves on to ${hex3(R.PC)}, the next instruction.`, `PC tiến tới ${hex3(R.PC)}, lệnh kế tiếp.`, ['PC']);
    // DECODE
    const op = R.IR >> 12, x = R.IR & 0xfff;
    if (op === 0xf) {
      push('stop', '???', `Opcode F does not exist: the bits ${hex4(R.IR)} are not an instruction. The CPU stops (a real CPU raises an "illegal instruction" exception — SIGILL on Linux).`, `Mã lệnh F không tồn tại: dãy bit ${hex4(R.IR)} không phải lệnh. CPU dừng (CPU thật sinh ngoại lệ "illegal instruction" — SIGILL trên Linux).`, [], { last: true });
      stop = 'illegal';
      break;
    }
    R.MAR = x;
    const name = NAMES[op];
    push('decode', 'MAR ← IR[11–0]', `Decode: top 4 bits ${op.toString(2).padStart(4, '0')} = ${op.toString(16).toUpperCase()} → ${name}. Low 12 bits ${hex3(x)} go to MAR.`, `Giải mã: 4 bit cao ${op.toString(2).padStart(4, '0')} = ${op.toString(16).toUpperCase()} → ${name}. 12 bit thấp ${hex3(x)} vào MAR.`, ['MAR'], { bus: { from: 'IR', to: 'MAR', value: x, kind: 'addr' } });
    const row: TraceRow = { at, word: R.IR, text: disasm(R.IR), regs: { ...R } };
    const readM = (en: string, vi: string) => {
      R.MBR = mem[R.MAR];
      push('execute', 'MBR ← M[MAR]', en.replace('%v', String(s16(R.MBR))), vi.replace('%v', String(s16(R.MBR))), ['MBR'], { bus: { from: 'MEM', to: 'MBR', value: R.MBR, kind: 'data' }, memRead: R.MAR });
    };
    const fin = () => { snaps[snaps.length - 1].last = true; done++; row.regs = { ...R }; trace.push(row); };
    let halted = false;
    switch (op) {
      case OPS.LOAD:
        readM(`Read M[${hex3(R.MAR)}] = %v into MBR.`, `Đọc M[${hex3(R.MAR)}] = %v vào MBR.`);
        R.AC = R.MBR; push('execute', 'AC ← MBR', `AC = ${s16(R.AC)}.`, `AC = ${s16(R.AC)}.`, ['AC'], { bus: { from: 'MBR', to: 'AC', value: R.AC, kind: 'data' } });
        break;
      case OPS.STORE:
        R.MBR = R.AC; push('execute', 'MBR ← AC', `Put AC (${s16(R.AC)}) into MBR, ready to go to memory.`, `Đưa AC (${s16(R.AC)}) vào MBR, sẵn sàng ghi ra bộ nhớ.`, ['MBR'], { bus: { from: 'AC', to: 'MBR', value: R.MBR, kind: 'data' } });
        write(R.MAR, R.MBR);
        push('execute', 'M[MAR] ← MBR', `Write ${s16(R.MBR)} into memory cell ${hex3(R.MAR)}.`, `Ghi ${s16(R.MBR)} vào ô nhớ ${hex3(R.MAR)}.`, [], { bus: { from: 'MBR', to: 'MEM', value: R.MBR, kind: 'data' }, memWrite: R.MAR });
        break;
      case OPS.ADD: case OPS.SUBT: {
        readM(`Read M[${hex3(R.MAR)}] = %v into MBR.`, `Đọc M[${hex3(R.MAR)}] = %v vào MBR.`);
        const a = s16(R.AC), b = s16(R.MBR);
        R.AC = u16(op === OPS.ADD ? a + b : a - b);
        const exact = op === OPS.ADD ? a + b : a - b;
        const ov = exact !== s16(R.AC);
        push('execute', op === OPS.ADD ? 'AC ← AC + MBR' : 'AC ← AC − MBR', `ALU: ${a} ${op === OPS.ADD ? '+' : '−'} ${b} = ${s16(R.AC)}.${ov ? ' ⚠ Overflow: the true answer does not fit in 16 bits.' : ''}`, `ALU: ${a} ${op === OPS.ADD ? '+' : '−'} ${b} = ${s16(R.AC)}.${ov ? ' ⚠ Tràn số: kết quả thật không vừa 16 bit.' : ''}`, ['AC'], { bus: { from: 'ALU', to: 'AC', value: R.AC, kind: 'data' } });
        break;
      }
      case OPS.INPUT: {
        if (inputUsed >= inputs.length) {
          push('stop', 'AC ← InREG', 'Input: the machine waits for a value, but the input box is empty. Type numbers there and run again.', 'Input: máy chờ nhập một giá trị nhưng ô nhập đang trống. Gõ số vào đó rồi chạy lại.', [], { last: true });
          stop = 'input';
          halted = true;
          break;
        }
        R.IN = u16(inputs[inputUsed++]);
        R.AC = R.IN;
        push('execute', 'AC ← InREG', `Read input value ${s16(R.IN)} into AC.`, `Đọc giá trị nhập ${s16(R.IN)} vào AC.`, ['IN', 'AC'], { bus: { from: 'INDEV', to: 'AC', value: R.AC, kind: 'data' } });
        break;
      }
      case OPS.OUTPUT:
        R.OUT = R.AC; output.push(R.AC);
        push('execute', 'OutREG ← AC', `Output ${s16(R.AC)}.`, `In ra ${s16(R.AC)}.`, ['OUT'], { bus: { from: 'AC', to: 'OUTDEV', value: R.AC, kind: 'data' } });
        break;
      case OPS.HALT:
        push('halt', 'Halt', `Halt after ${done + 1} instructions.`, `Dừng sau ${done + 1} lệnh.`, []);
        halted = true; stop = 'halt';
        break;
      case OPS.SKIPCOND: {
        const cond = (x >> 10) & 3, ac = s16(R.AC);
        const test = cond === 0 ? ac < 0 : cond === 1 ? ac === 0 : cond === 2 ? ac > 0 : false;
        const what = cond === 0 ? 'AC < 0' : cond === 1 ? 'AC = 0' : cond === 2 ? 'AC > 0' : '(11: never)';
        if (test) R.PC = (R.PC + 1) & 0xfff;
        row.skipped = test;
        push('execute', test ? 'PC ← PC + 1' : '—', `Skipcond ${hex3(x)}: is ${what}? AC = ${ac} → ${test ? 'YES: skip the next instruction' : 'no: carry on'}.`, `Skipcond ${hex3(x)}: ${what}? AC = ${ac} → ${test ? 'CÓ: bỏ qua lệnh kế tiếp' : 'không: chạy tiếp'}.`, test ? ['PC'] : [], { bus: { from: 'AC', to: 'CU', value: R.AC, kind: 'data' } });
        break;
      }
      case OPS.JUMP:
        R.PC = x;
        push('execute', 'PC ← IR[11–0]', `Jump: PC = ${hex3(x)}. The next fetch comes from there.`, `Nhảy: PC = ${hex3(x)}. Lần nạp lệnh sau lấy từ đó.`, ['PC'], { bus: { from: 'IR', to: 'PC', value: x, kind: 'addr' } });
        break;
      case OPS.CLEAR:
        R.AC = 0;
        push('execute', 'AC ← 0', 'AC = 0.', 'AC = 0.', ['AC']);
        break;
      case OPS.JNS: {
        R.MBR = R.PC; push('execute', 'MBR ← PC', `Remember the return address ${hex3(R.PC)}.`, `Nhớ địa chỉ trở về ${hex3(R.PC)}.`, ['MBR'], { bus: { from: 'PC', to: 'MBR', value: R.MBR, kind: 'addr' } });
        write(R.MAR, R.MBR);
        push('execute', 'M[MAR] ← MBR', `Store it in ${hex3(R.MAR)} (the subroutine's first word).`, `Lưu nó vào ${hex3(R.MAR)} (từ đầu tiên của chương trình con).`, [], { bus: { from: 'MBR', to: 'MEM', value: R.MBR, kind: 'data' }, memWrite: R.MAR });
        R.AC = u16(x + 1); R.PC = (x + 1) & 0xfff;
        push('execute', 'AC ← X + 1; PC ← AC', `Jump to ${hex3(R.PC)}. (MARIE computes X+1 in AC, so JnS overwrites AC.)`, `Nhảy tới ${hex3(R.PC)}. (MARIE tính X+1 trong AC nên JnS ghi đè AC.)`, ['AC', 'PC'], { bus: { from: 'ALU', to: 'PC', value: R.PC, kind: 'addr' } });
        break;
      }
      case OPS.JUMPI:
        readM(`Read the target address stored at ${hex3(R.MAR)}: %v.`, `Đọc địa chỉ đích lưu tại ${hex3(R.MAR)}: %v.`);
        R.PC = R.MBR & 0xfff;
        push('execute', 'PC ← MBR', `Jump to ${hex3(R.PC)}.`, `Nhảy tới ${hex3(R.PC)}.`, ['PC'], { bus: { from: 'MBR', to: 'PC', value: R.PC, kind: 'addr' } });
        break;
      case OPS.ADDI: case OPS.LOADI: case OPS.STOREI: {
        readM(`Read the POINTER stored at ${hex3(R.MAR)}: %v.`, `Đọc CON TRỎ lưu tại ${hex3(R.MAR)}: %v.`);
        R.MAR = R.MBR & 0xfff;
        push('execute', 'MAR ← MBR', `Follow the pointer: MAR = ${hex3(R.MAR)}.`, `Đi theo con trỏ: MAR = ${hex3(R.MAR)}.`, ['MAR'], { bus: { from: 'MBR', to: 'MAR', value: R.MAR, kind: 'addr' } });
        if (op === OPS.STOREI) {
          R.MBR = R.AC; push('execute', 'MBR ← AC', `MBR = AC = ${s16(R.AC)}.`, `MBR = AC = ${s16(R.AC)}.`, ['MBR'], { bus: { from: 'AC', to: 'MBR', value: R.MBR, kind: 'data' } });
          write(R.MAR, R.MBR);
          push('execute', 'M[MAR] ← MBR', `Write ${s16(R.MBR)} into ${hex3(R.MAR)}.`, `Ghi ${s16(R.MBR)} vào ${hex3(R.MAR)}.`, [], { bus: { from: 'MBR', to: 'MEM', value: R.MBR, kind: 'data' }, memWrite: R.MAR });
        } else {
          readM(`Read M[${hex3(R.MAR)}] = %v.`, `Đọc M[${hex3(R.MAR)}] = %v.`);
          const a = s16(R.AC), b = s16(R.MBR);
          R.AC = op === OPS.ADDI ? u16(a + b) : R.MBR;
          push('execute', op === OPS.ADDI ? 'AC ← AC + MBR' : 'AC ← MBR', `AC = ${s16(R.AC)}.`, `AC = ${s16(R.AC)}.`, ['AC'], { bus: { from: op === OPS.ADDI ? 'ALU' : 'MBR', to: 'AC', value: R.AC, kind: 'data' } });
        }
        break;
      }
    }
    if (stop === 'input') break;
    fin();
    if (halted) break;
  }
  if (stop === 'limit') {
    push('stop', '—', `Stopped after ${maxInstr} instructions — probably an endless loop (did the loop counter ever reach the Skipcond condition?).`, `Dừng sau ${maxInstr} lệnh — có lẽ vòng lặp vô tận (biến đếm có bao giờ chạm điều kiện Skipcond không?).`, [], { last: true });
  }
  return { snaps, mems, trace, stop };
}

/** Chỉ giữ vi bước CUỐI của mỗi lệnh (chế độ "từng lệnh"). Phần tử 0 (bật máy) luôn giữ. */
export const instrIndex = (snaps: Snap[]) => snaps.map((s, i) => (i === 0 || s.last ? i : -1)).filter((i) => i >= 0);

/* ═══════════ CHƯƠNG TRÌNH MẪU ═══════════ */
export const EXAMPLES: Record<string, { en: string; vi: string; src: string; inputs?: string; tasksEn: string[]; tasksVi: string[] }> = {
  add: {
    en: 'Add two numbers (X + Y → Z)', vi: 'Cộng hai số (X + Y → Z)',
    src: `/ Add X and Y, store the sum in Z
        Load  X      / AC = X
        Add   Y      / AC = AC + Y
        Store Z      / Z  = AC
        Output       / print AC
        Halt
X,      DEC   5
Y,      DEC   7
Z,      DEC   0`,
    tasksEn: ['Step through and watch PC: why does it count 000, 001, 002…?', 'Change Y to 30 and run again. Which memory cell changes at the end?', 'Change the program to compute X − Y (hint: Subt).'],
    tasksVi: ['Đi từng bước và nhìn PC: vì sao nó đếm 000, 001, 002…?', 'Đổi Y thành 30 rồi chạy lại. Ô nhớ nào đổi ở cuối?', 'Sửa chương trình để tính X − Y (gợi ý: Subt).'],
  },
  sum: {
    en: 'Sum 1 + 2 + … + N (a loop)', vi: 'Tổng 1 + 2 + … + N (vòng lặp)',
    src: `/ Sum = 1 + 2 + ... + N  (counts N down to 0)
        Load  N
        Store Count     / Count = N
Loop,   Load  Sum
        Add   Count
        Store Sum       / Sum = Sum + Count
        Load  Count
        Subt  One
        Store Count     / Count = Count - 1
        Skipcond 400    / Count = 0 ?  then skip the Jump
        Jump  Loop
        Load  Sum
        Output
        Halt
N,      DEC   5
Count,  DEC   0
Sum,    DEC   0
One,    DEC   1`,
    tasksEn: ['Run it: what is printed? Check with N·(N+1)/2.', 'Switch to "whole instructions" and count how many instructions run for N = 5. For N = 10?', 'What happens if you set N to 0? Explain using Skipcond.'],
    tasksVi: ['Chạy: in ra số mấy? Đối chiếu với N·(N+1)/2.', 'Chuyển sang "từng lệnh" và đếm số lệnh chạy khi N = 5. Khi N = 10?', 'Đặt N = 0 thì sao? Giải thích bằng Skipcond.'],
  },
  mul: {
    en: 'Multiply 5 × 4 by repeated addition', vi: 'Nhân 5 × 4 bằng cộng lặp',
    src: `/ Product = A * B by adding A, B times (MARIE has no multiply)
Loop,   Load  Prod
        Add   A
        Store Prod
        Load  B
        Subt  One
        Store B
        Skipcond 400    / B = 0 ? done
        Jump  Loop
        Load  Prod
        Output
        Halt
A,      DEC   5
B,      DEC   4
Prod,   DEC   0
One,    DEC   1`,
    tasksEn: ['How many times does the ALU add? Count the Add steps.', 'Try A = 300, B = 300. Why is the answer wrong? (16-bit overflow)'],
    tasksVi: ['ALU cộng bao nhiêu lần? Đếm các bước Add.', 'Thử A = 300, B = 300. Vì sao đáp án sai? (tràn 16 bit)'],
  },
  max: {
    en: 'Largest value in an array (pointers, LoadI)', vi: 'Số lớn nhất trong mảng (con trỏ, LoadI)',
    src: `/ Max of Arr[0..Len-1] using a pointer and indirect load
        Load  Arr
        Store Max       / Max = Arr[0]
        Load  Addr
        Store Ptr       / Ptr = address of Arr
        Load  Len
        Subt  One
        Store Left      / Len - 1 elements still to check
Loop,   Load  Ptr
        Add   One
        Store Ptr       / Ptr -> next element
        LoadI Ptr       / AC = M[Ptr]
        Subt  Max
        Skipcond 800    / element > Max ?  then skip the Jump
        Jump  Next
        LoadI Ptr
        Store Max       / Max = element
Next,   Load  Left
        Subt  One
        Store Left
        Skipcond 400    / no elements left ?
        Jump  Loop
        Load  Max
        Output
        Halt
Addr,   ADR   Arr       / the ADDRESS of Arr (a pointer)
Arr,    DEC   3
        DEC   9
        DEC   4
        DEC   7
Len,    DEC   4
Max,    DEC   0
Ptr,    DEC   0
Left,   DEC   0
One,    DEC   1`,
    tasksEn: ['Watch Ptr in memory: it holds an ADDRESS, not a value. Which addresses does it take?', 'Put −5 as the first element and 0 elsewhere. Is the answer right?', 'Add a fifth element 12 (and set Len to 5).'],
    tasksVi: ['Nhìn Ptr trong bộ nhớ: nó giữ một ĐỊA CHỈ, không phải giá trị. Nó lần lượt mang những địa chỉ nào?', 'Đặt phần tử đầu là −5, còn lại 0. Kết quả có đúng không?', 'Thêm phần tử thứ năm 12 (và sửa Len thành 5).'],
  },
  io: {
    en: 'Read two numbers, print the sum (Input/Output)', vi: 'Nhập hai số, in tổng (Input/Output)',
    src: `/ Input two numbers, output their sum
        Input
        Store A
        Input
        Add   A
        Output
        Halt
A,      DEC   0`,
    inputs: '12, 30',
    tasksEn: ['Change the inputs to 40000, 40000. What is printed and why?', 'Extend it to read three numbers.'],
    tasksVi: ['Đổi số nhập thành 40000, 40000. In ra gì và vì sao?', 'Mở rộng để nhập ba số.'],
  },
  selfmod: {
    en: 'Program = data: an instruction that rewrites itself', vi: 'Chương trình = dữ liệu: lệnh tự sửa chính nó',
    src: `/ Instructions are just numbers in the same memory as data.
/ We read the instruction at Patch AS DATA, add 1 to it, write it back,
/ and so turn "Load A" into "Load B" before it runs.
        Load  Patch     / AC = the instruction word itself
        Output          / ...printed as a number
        Add   One       / +1 changes its address field: A -> B
        Store Patch     / overwrite the instruction below
Patch,  Load  A         / by now this reads "Load B"!
        Output          / prints 20, not 10
        Halt
A,      DEC   10
B,      DEC   20
One,    DEC   1`,
    tasksEn: ['The first Output prints a strange big number. Convert it to hex: what instruction is it?', 'Watch the memory cell of Patch change colour when Store writes it.', 'Why do modern OSes mark code pages read-only (W^X)? Think about what an attacker could do with this.'],
    tasksVi: ['Lệnh Output đầu in ra một số lớn lạ. Đổi sang hex: đó là lệnh gì?', 'Nhìn ô nhớ của Patch đổi màu khi Store ghi vào.', 'Vì sao hệ điều hành ngày nay đánh dấu trang mã là chỉ-đọc (W^X)? Nghĩ xem kẻ tấn công làm được gì với chiêu này.'],
  },
  blank: {
    en: 'Empty — write your own', vi: 'Trống — tự viết',
    src: `/ Your program. One instruction per line:  [Label,]  Instruction  [operand]   / comment
/ Instructions: Load Store Add Subt Input Output Halt Skipcond Jump Clear AddI JumpI LoadI StoreI JnS
/ Data: DEC 5   HEX 1F   ADR Label
        Halt`,
    tasksEn: ['Write a program that adds 5 + 7 and halts.', 'Print the numbers 3, 2, 1 (a countdown loop).'],
    tasksVi: ['Viết chương trình cộng 5 + 7 rồi Halt.', 'In ra 3, 2, 1 (vòng đếm ngược).'],
  },
};
