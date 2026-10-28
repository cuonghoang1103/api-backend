/**
 * Cổng logic → mạch — hàm thuần. Mọi mạch ở đây được dựng TỪ CỔNG (không dùng phép + của JS cho bộ cộng), để mô
 * phỏng cho thấy đúng thứ phần cứng làm: bit nhớ đi qua từng tầng full adder, thanh ghi chỉ đổi ở sườn lên đồng hồ.
 */
export type Bit = 0 | 1;
export type Gate = 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR' | 'XNOR';
export const GATES: Gate[] = ['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR', 'XNOR'];

export function gate(g: Gate, a: Bit, b: Bit = 0): Bit {
  switch (g) {
    case 'AND': return (a & b) as Bit;
    case 'OR': return (a | b) as Bit;
    case 'NOT': return (1 - a) as Bit;
    case 'NAND': return (1 - (a & b)) as Bit;
    case 'NOR': return (1 - (a | b)) as Bit;
    case 'XOR': return (a ^ b) as Bit;
    case 'XNOR': return (1 - (a ^ b)) as Bit;
  }
}
export const arity = (g: Gate) => (g === 'NOT' ? 1 : 2);

/** Bảng chân trị: mỗi hàng [đầu vào…, đầu ra]. */
export function truthTable(g: Gate): Bit[][] {
  if (arity(g) === 1) return [[0, gate(g, 0)], [1, gate(g, 1)]];
  return [[0, 0], [0, 1], [1, 0], [1, 1]].map(([a, b]) => [a as Bit, b as Bit, gate(g, a as Bit, b as Bit)]);
}

/* ── Mọi thứ từ NAND ─────────────────────────────────────────────────────────────────────── */
const nand = (a: Bit, b: Bit) => gate('NAND', a, b);
export const NAND_BUILD: Record<'NOT' | 'AND' | 'OR' | 'XOR', { count: number; formula: string; f: (a: Bit, b: Bit) => Bit }> = {
  NOT: { count: 1, formula: 'NOT a = NAND(a, a)', f: (a) => nand(a, a) },
  AND: { count: 2, formula: 'a AND b = NOT(NAND(a, b)) = NAND(n, n), n = NAND(a, b)', f: (a, b) => { const n = nand(a, b); return nand(n, n); } },
  OR: { count: 3, formula: 'a OR b = NAND(NOT a, NOT b)  (De Morgan)', f: (a, b) => nand(nand(a, a), nand(b, b)) },
  XOR: { count: 4, formula: 'n = NAND(a,b);  a XOR b = NAND(NAND(a,n), NAND(b,n))', f: (a, b) => { const n = nand(a, b); return nand(nand(a, n), nand(b, n)); } },
};

/* ── Bộ cộng ───────────────────────────────────────────────────────────────────────────── */
export interface HalfAdd { a: Bit; b: Bit; s: Bit; c: Bit }
export const halfAdder = (a: Bit, b: Bit): HalfAdd => ({ a, b, s: gate('XOR', a, b), c: gate('AND', a, b) });

export interface FullAdd { a: Bit; b: Bit; cin: Bit; x1: Bit; c1: Bit; c2: Bit; s: Bit; cout: Bit }
/** Full adder = 2 half adder + 1 cổng OR. x1 = a⊕b, c1 = a·b, c2 = x1·cin. */
export function fullAdder(a: Bit, b: Bit, cin: Bit): FullAdd {
  const h1 = halfAdder(a, b);
  const h2 = halfAdder(h1.s, cin);
  return { a, b, cin, x1: h1.s, c1: h1.c, c2: h2.c, s: h2.s, cout: gate('OR', h1.c, h2.c) };
}

export interface RippleSnap {
  t: number;
  /** carry[k] = nhớ VÀO cột k (carry[n] = nhớ ra); null = chưa ổn định */
  carry: Array<Bit | null>;
  sum: Array<Bit | null>;
  /** cột vừa ổn định ở bước này */
  active: number;
}
export const toBits = (v: number, n: number): Bit[] => Array.from({ length: n }, (_, k) => (Math.floor(v / 2 ** k) % 2) as Bit);
export const fromBits = (bits: Array<Bit | null>) => bits.reduce<number>((acc, b, k) => acc + (b ? 2 ** k : 0), 0);

/**
 * Bộ cộng nối tiếp nhớ (ripple-carry) n bit: ở bước t, nhớ đã chạy qua t tầng.
 * Mỗi tầng chờ nhớ của tầng trước ⇒ thời gian tỉ lệ với n — lý do CPU thật dùng carry-lookahead.
 */
export function rippleAdd(a: number, b: number, n: number, cin: Bit = 0): RippleSnap[] {
  const A = toBits(a, n), B = toBits(b, n);
  const carry: Array<Bit | null> = Array(n + 1).fill(null);
  const sum: Array<Bit | null> = Array(n).fill(null);
  carry[0] = cin;
  const snaps: RippleSnap[] = [{ t: 0, carry: carry.slice(), sum: sum.slice(), active: -1 }];
  for (let k = 0; k < n; k++) {
    const fa = fullAdder(A[k], B[k], carry[k] as Bit);
    sum[k] = fa.s;
    carry[k + 1] = fa.cout;
    snaps.push({ t: k + 1, carry: carry.slice(), sum: sum.slice(), active: k });
  }
  return snaps;
}

/* ── MUX / bộ giải mã ─────────────────────────────────────────────────────────────────────── */
/** MUX 2^k → 1: đường chọn sel (k bit) quyết định đầu vào nào đi ra. */
export const mux = (inputs: Bit[], sel: number): Bit => inputs[sel] ?? 0;
/** Bộ giải mã k → 2^k: đúng MỘT đường ra bằng 1 — chính là cách RAM chọn ô nhớ theo địa chỉ. */
export const decoder = (addr: number, k: number): Bit[] => Array.from({ length: 2 ** k }, (_, i) => (i === addr ? 1 : 0) as Bit);

/* ── Mạch tuần tự: thanh ghi D flip-flop kích theo sườn lên ─────────────────────────────── */
export interface RegEvent { kind: 'd' | 'tick'; value?: number }
export interface RegSnap { clk: Bit; d: number; q: number; edge: boolean; note: 'd' | 'rise' | 'fall' | 'start' }
/**
 * Thanh ghi n bit: Q chỉ chép D ở SƯỜN LÊN của đồng hồ. Đổi D giữa hai nhịp không làm Q đổi — đó là thứ cho phép
 * cả CPU chạy đồng bộ: mọi thanh ghi chụp giá trị cùng một khoảnh khắc.
 */
export function registerTimeline(events: RegEvent[], d0 = 0, q0 = 0): RegSnap[] {
  let clk: Bit = 0, d = d0, q = q0;
  const out: RegSnap[] = [{ clk, d, q, edge: false, note: 'start' }];
  for (const e of events) {
    if (e.kind === 'd') { d = e.value ?? 0; out.push({ clk, d, q, edge: false, note: 'd' }); continue; }
    // một nhịp = lên rồi xuống
    clk = 1; q = d; out.push({ clk, d, q, edge: true, note: 'rise' });
    clk = 0; out.push({ clk, d, q, edge: false, note: 'fall' });
  }
  return out;
}

/** SR latch bằng hai cổng NOR — mạch nhớ 1 bit đơn giản nhất. S=R=1 là trạng thái cấm. */
export function srLatch(s: Bit, r: Bit, q: Bit): { q: Bit; nq: Bit; invalid: boolean } {
  if (s && r) return { q: 0, nq: 0, invalid: true };
  if (s) return { q: 1, nq: 0, invalid: false };
  if (r) return { q: 0, nq: 1, invalid: false };
  return { q, nq: (1 - q) as Bit, invalid: false };
}
