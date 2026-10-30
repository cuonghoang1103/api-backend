/**
 * CEA201 practice — BỘ MÔ PHỎNG dùng để TÍNH số trong đề (không tính nhẩm). Mỗi hàm TỰ CHỨA (không gọi hàm khác của tệp)
 * để dùng luôn làm "lời giải" cho bài viết hàm (dat(fn,'tên')). Kiểm với ví dụ sách/slide: node _kiem-sim.mjs
 */

/* ─────────── Chương 2 · hiệu năng ─────────── */
/** Thời gian CPU (giây) = IC × CPI / f(Hz). */
export function cpuTime(ic, cpi, hz) { return (ic * cpi) / hz; }
/** CPI trung bình có trọng số: mix = [[tỉ lệ, cpi], …]. */
export function avgCpi(mix) { var s = 0; for (var i = 0; i < mix.length; i++) s += mix[i][0] * mix[i][1]; return s; }
/** MIPS = f / (CPI × 10^6). */
export function mips(hz, cpi) { return hz / (cpi * 1e6); }
/** Amdahl: tăng tốc khi phần f được nhanh gấp s lần. */
export function amdahl(f, s) { return 1 / ((1 - f) + f / s); }

/* ─────────── Chương 4 · cache ─────────── */
/** Hình học cache: địa chỉ addrBits, khối blockBytes, tổng cacheBytes, ways (1 = trực tiếp; = số dòng ⇒ liên kết đầy đủ). */
export function cacheGeom(addrBits, blockBytes, cacheBytes, ways) {
  var lines = cacheBytes / blockBytes, sets = lines / ways;
  var off = Math.round(Math.log2(blockBytes)), idx = Math.round(Math.log2(sets));
  return { lines: lines, sets: sets, offsetBits: off, indexBits: idx, tagBits: addrBits - idx - off };
}
/** Mô phỏng cache liên kết theo tập. Trả về { hits, misses, trace:'MHM…', rows:[{addr,block,set,tag,hit,evicted}] }. policy: 'LRU' | 'FIFO'. */
export function cacheSim(addrs, blockBytes, lines, ways, policy) {
  var sets = lines / ways, st = [], i, rows = [], hits = 0, t = 0;
  for (i = 0; i < sets; i++) st.push([]);
  for (var k = 0; k < addrs.length; k++) {
    var block = Math.floor(addrs[k] / blockBytes), s = block % sets, tag = Math.floor(block / sets), way = st[s], pos = -1, ev = null;
    for (i = 0; i < way.length; i++) if (way[i].tag === tag) pos = i;
    t++;
    if (pos >= 0) { hits++; if (policy === 'LRU') way[pos].t = t; }
    else {
      if (way.length === ways) {
        var v = 0;
        for (i = 1; i < way.length; i++) if (way[i].t < way[v].t) v = i;
        ev = way[v].block; way.splice(v, 1);
      }
      way.push({ tag: tag, block: block, t: t });
    }
    rows.push({ addr: addrs[k], block: block, set: s, tag: tag, hit: pos >= 0, evicted: ev });
  }
  return { hits: hits, misses: addrs.length - hits, trace: rows.map(function (r) { return r.hit ? 'H' : 'M'; }).join(''), rows: rows };
}
/** Cache với lệnh đọc/ghi: ops = [['R',addr],['W',addr]…]; write-allocate. Trả { hits, misses, writeThroughWrites, writeBackWrites } (write-back: cộng cả khối bẩn còn lại cuối chương trình = false). */
export function cacheOps(ops, blockBytes, lines, ways) {
  var sets = lines / ways, st = [], i, hits = 0, t = 0, wt = 0, wb = 0;
  for (i = 0; i < sets; i++) st.push([]);
  for (var k = 0; k < ops.length; k++) {
    var block = Math.floor(ops[k][1] / blockBytes), s = block % sets, way = st[s], pos = -1;
    for (i = 0; i < way.length; i++) if (way[i].block === block) pos = i;
    t++;
    if (ops[k][0] === 'W') wt++;
    if (pos >= 0) { hits++; way[pos].t = t; }
    else {
      if (way.length === ways) {
        var v = 0;
        for (i = 1; i < way.length; i++) if (way[i].t < way[v].t) v = i;
        if (way[v].dirty) wb++;
        way.splice(v, 1);
      }
      pos = way.length; way.push({ block: block, t: t, dirty: false });
    }
    if (ops[k][0] === 'W') way[pos].dirty = true;
  }
  return { hits: hits, misses: ops.length - hits, writeThroughWrites: wt, writeBackWrites: wb };
}
/** Thời gian truy cập trung bình: h×c + (1−h)×m. */
export function amat(h, c, m) { return h * c + (1 - h) * m; }

/* ─────────── Chương 5 · bộ nhớ, Hamming ─────────── */
/** Số bit kiểm tra r nhỏ nhất cho m bit dữ liệu (SEC): 2^r ≥ m + r + 1. */
export function hammingR(m) { var r = 0; while ((1 << r) < m + r + 1) r++; return r; }
/** Mã Hamming chẵn lẻ chẵn: nhận chuỗi bit dữ liệu, trả từ mã (vị trí 1 ở ký tự đầu; bit kiểm tra ở vị trí 2^k). */
export function hammingEncode(data) {
  var m = data.length, r = 0;
  while ((1 << r) < m + r + 1) r++;
  var n = m + r, w = [], j = 0, p, i;
  for (i = 1; i <= n; i++) w[i] = (i & (i - 1)) === 0 ? 0 : Number(data[j++]);
  for (p = 1; p <= n; p <<= 1) {
    var x = 0;
    for (i = 1; i <= n; i++) if ((i & p) && i !== p) x ^= w[i];
    w[p] = x;
  }
  return w.slice(1).join('');
}
/** Hội chứng (syndrome) của một từ mã: 0 = không lỗi, ngược lại = vị trí bit sai (1-based). */
export function hammingSyndrome(code) {
  var s = 0;
  for (var i = 1; i <= code.length; i++) if (code[i - 1] === '1') s ^= i;
  return s;
}
/** Sửa tối đa 1 bit rồi trả dữ liệu gốc. */
export function hammingDecode(code) {
  var w = code.split(''), s = 0, i;
  for (i = 1; i <= w.length; i++) if (w[i - 1] === '1') s ^= i;
  if (s > 0 && s <= w.length) w[s - 1] = w[s - 1] === '1' ? '0' : '1';
  var d = '';
  for (i = 1; i <= w.length; i++) if ((i & (i - 1)) !== 0) d += w[i - 1];
  return d;
}

/* ─────────── Chương 6 · đĩa, RAID ─────────── */
/** Thời gian truy cập đĩa (ms) = seek + quay nửa vòng + truyền. bytes cần đọc, sectorsPerTrack × 512 B/rãnh. */
export function diskAccess(seekMs, rpm, bytes, bytesPerTrack) {
  var rot = 60000 / rpm;
  return seekMs + rot / 2 + (bytes / bytesPerTrack) * rot;
}
/** Dung lượng hữu dụng (đĩa) của RAID level với n đĩa. */
export function raidUsable(level, n) {
  if (level === 0) return n;
  if (level === 1) return n / 2;
  if (level === 5) return n - 1;
  if (level === 6) return n - 2;
  if (level === 10) return n / 2;
  return NaN;
}
/** Khôi phục giá trị bị mất của một dải RAID 5: mảng giá trị, phần tử thiếu là null. */
export function raidRecover(stripe) {
  var x = 0;
  for (var i = 0; i < stripe.length; i++) if (stripe[i] !== null) x ^= stripe[i];
  return x;
}

/* ─────────── Chương 8 · bộ nhớ ảo ─────────── */
/** Số lỗi trang: FIFO hoặc LRU, nFrames khung. */
export function pageFaults(algo, refs, nFrames) {
  var fr = [], f = 0, t = 0;
  for (var i = 0; i < refs.length; i++) {
    var p = refs[i], pos = -1, k;
    for (k = 0; k < fr.length; k++) if (fr[k].p === p) pos = k;
    t++;
    if (pos >= 0) { if (algo === 'LRU') fr[pos].t = t; continue; }
    f++;
    if (fr.length === nFrames) {
      var v = 0;
      for (k = 1; k < fr.length; k++) if (fr[k].t < fr[v].t) v = k;
      fr.splice(v, 1);
    }
    fr.push({ p: p, t: t });
  }
  return f;
}

/* ─────────── Chương 9 · logic số ─────────── */
/** Đánh giá mạng cổng: gates = [[out, 'NAND', a, b] | [out,'NOT',a], …] theo thứ tự tô-pô; inputs = {A:1,B:0}. */
export function evalNet(gates, inputs) {
  var v = {}, k;
  for (k in inputs) v[k] = inputs[k] ? 1 : 0;
  for (var i = 0; i < gates.length; i++) {
    var g = gates[i], a = v[g[2]], b = g.length > 3 ? v[g[3]] : 0, r;
    switch (g[1]) {
      case 'AND': r = a & b; break;
      case 'OR': r = a | b; break;
      case 'NAND': r = (a & b) ^ 1; break;
      case 'NOR': r = (a | b) ^ 1; break;
      case 'XOR': r = a ^ b; break;
      case 'XNOR': r = (a ^ b) ^ 1; break;
      case 'NOT': r = a ^ 1; break;
      default: throw new Error('unknown gate ' + g[1]);
    }
    v[g[0]] = r;
  }
  return v;
}
/** Cộng hai chuỗi bit bằng chuỗi bộ cộng đầy đủ (LSB ở cuối); trả { sum, carryOut }. */
export function rippleAdd(a, b) {
  var n = a.length, c = 0, s = '';
  for (var i = n - 1; i >= 0; i--) {
    var x = Number(a[i]), y = Number(b[i]);
    s = String(x ^ y ^ c) + s;
    c = (x & y) | (c & (x ^ y));
  }
  return { sum: s, carryOut: c };
}

/* ─────────── Chương 10 · biểu diễn số ─────────── */
/** Số nguyên n ⇒ chuỗi bù 2 `bits` bit (n phải nằm trong miền). */
export function toTwos(n, bits) {
  var v = n < 0 ? n + Math.pow(2, bits) : n, s = v.toString(2);
  while (s.length < bits) s = '0' + s;
  return s;
}
/** Chuỗi bù 2 ⇒ giá trị có dấu. */
export function fromTwos(s) {
  var v = parseInt(s, 2);
  return s[0] === '1' ? v - Math.pow(2, s.length) : v;
}
/** a + b trong `bits` bit bù 2: { bits, value, overflow }. */
export function addTwos(a, b, bits) {
  var lo = -Math.pow(2, bits - 1), hi = Math.pow(2, bits - 1) - 1, t = a + b, ovf = t < lo || t > hi;
  var w = ((t % Math.pow(2, bits)) + Math.pow(2, bits)) % Math.pow(2, bits), s = w.toString(2);
  while (s.length < bits) s = '0' + s;
  return { bits: s, value: s[0] === '1' ? w - Math.pow(2, bits) : w, overflow: ovf };
}
/** IEEE 754 đơn (32 bit) của x: { sign, exp, frac, hex } (exp 8 bit, frac 23 bit dạng chuỗi nhị phân). */
export function f32Fields(x) {
  var dv = new DataView(new ArrayBuffer(4));
  dv.setFloat32(0, x);
  var u = dv.getUint32(0), b = u.toString(2);
  while (b.length < 32) b = '0' + b;
  var h = u.toString(16).toUpperCase();
  while (h.length < 8) h = '0' + h;
  return { sign: b[0], exp: b.slice(1, 9), frac: b.slice(9), hex: h };
}
/** Giá trị thực của số IEEE 754 đơn cho bởi 8 chữ số hex. */
export function f32Value(hex) {
  var dv = new DataView(new ArrayBuffer(4));
  dv.setUint32(0, parseInt(hex, 16));
  return dv.getFloat32(0);
}

/* ─────────── Chương 11–12 · pipeline ─────────── */
/**
 * Pipeline 5 tầng IF ID EX MEM WB (MIPS cổ điển), không rẽ nhánh. instrs = [{op:'lw'|'alu'|'sw', rd, rs, rt}].
 * Chỉ RAW. Ghi thanh ghi ở nửa đầu chu kỳ WB, đọc ở nửa sau ID. forwarding = true: kết quả ALU cho EX kế tiếp, lw cho EX sau MEM.
 * Trả { cycles, stalls, rows:[{if,id,ex,mem,wb}] } (chu kỳ đánh số từ 1).
 */
export function pipeSim(instrs, forwarding) {
  var rows = [];
  for (var i = 0; i < instrs.length; i++) {
    var ins = instrs[i], fetch = i === 0 ? 1 : rows[i - 1].if + 1;
    var id = fetch + 1;
    if (i > 0) id = Math.max(id, rows[i - 1].id + 1);
    for (var j = 0; j < i; j++) {
      var pj = instrs[j];
      if (pj.op === 'sw' || !pj.rd) continue;
      var uses = ins.rs === pj.rd || ins.rt === pj.rd;
      if (!uses) continue;
      if (!forwarding) id = Math.max(id, rows[j].wb);
      else {
        var ready = pj.op === 'lw' ? rows[j].mem + 1 : rows[j].ex + 1;
        id = Math.max(id, ready - 1);
      }
    }
    var cur = { if: fetch, id: id, ex: id + 1, mem: id + 2, wb: id + 3 };
    rows.push(cur);
  }
  var cycles = rows[rows.length - 1].wb;
  return { cycles: cycles, stalls: cycles - (instrs.length + 4), rows: rows };
}
/** Dự đoán rẽ nhánh bộ đếm bão hoà 2 bit (0,1 = không nhảy; 2,3 = nhảy), trạng thái đầu init. outcomes: chuỗi 'T'/'N'. */
export function predict2bit(outcomes, init) {
  var s = init, pred = '', miss = 0;
  for (var i = 0; i < outcomes.length; i++) {
    var p = s >= 2 ? 'T' : 'N';
    pred += p;
    if (p !== outcomes[i]) miss++;
    if (outcomes[i] === 'T') s = Math.min(3, s + 1); else s = Math.max(0, s - 1);
  }
  return { pred: pred, mispredicts: miss, finalState: s };
}
/** Dự đoán 1 bit: nhớ kết quả lần trước. init = 'T' | 'N'. */
export function predict1bit(outcomes, init) {
  var last = init, miss = 0, pred = '';
  for (var i = 0; i < outcomes.length; i++) {
    pred += last;
    if (last !== outcomes[i]) miss++;
    last = outcomes[i];
  }
  return { pred: pred, mispredicts: miss };
}

/* ─────────── Chương 15 · MESI ─────────── */
/**
 * MESI cho MỘT địa chỉ, nCores lõi. events = [[core, 'R'|'W'], …]. Trả { states: ['I','E',…] mỗi bước (chuỗi mỗi lõi), bus: [..] }.
 * Bus: 'BusRd' (đọc trượt), 'BusRdX' (ghi trượt), 'BusUpgr' (ghi khi đang S), '-' (không cần bus).
 * Đọc trượt: lõi khác ở M/E/S ⇒ tất cả về S; không ai có ⇒ E. Ghi: các lõi khác về I, lõi ghi vào M.
 */
export function mesi(nCores, events) {
  var st = [], i, out = [], bus = [];
  for (i = 0; i < nCores; i++) st.push('I');
  for (var k = 0; k < events.length; k++) {
    var c = events[k][0], op = events[k][1], b = '-', other = false, j;
    for (j = 0; j < nCores; j++) if (j !== c && st[j] !== 'I') other = true;
    if (op === 'R') {
      if (st[c] === 'I') {
        b = 'BusRd';
        if (other) { for (j = 0; j < nCores; j++) if (st[j] !== 'I') st[j] = 'S'; st[c] = 'S'; } else st[c] = 'E';
      }
    } else {
      if (st[c] === 'I') b = 'BusRdX'; else if (st[c] === 'S') b = 'BusUpgr';
      for (j = 0; j < nCores; j++) if (j !== c) st[j] = 'I';
      st[c] = 'M';
    }
    out.push(st.join('')); bus.push(b);
  }
  return { states: out, bus: bus };
}

/* ─────────── Hợp ngữ MARIE ─────────── */
/**
 * Dịch + chạy chương trình MARIE. src: văn bản hợp ngữ (nhãn `Tên,`; ORG; DEC/HEX/OCT; chú thích `/`). input: mảng số cho lệnh Input.
 * Trả { output:[số có dấu…], steps, ac, pc, halted, mem (16 bit, mảng 4096), error? }. maxSteps chặn vòng lặp vô hạn.
 */
export function marieRun(src, input, maxSteps) {
  var OPS = { jns: 0, load: 1, store: 2, add: 3, subt: 4, input: 5, output: 6, halt: 7, skipcond: 8, jump: 9, clear: 10, addi: 11, jumpi: 12, loadi: 13, storei: 14 };
  var lines = src.split('\n'), items = [], labels = {}, loc = 0, i, ln;
  for (i = 0; i < lines.length; i++) {
    ln = lines[i].replace(/\/.*$/, '').trim();
    if (!ln) continue;
    var lab = null, m = /^([A-Za-z_][A-Za-z0-9_]*)\s*,\s*(.*)$/.exec(ln);
    if (m) { lab = m[1]; ln = m[2].trim(); }
    var parts = ln.split(/\s+/), op = (parts[0] || '').toLowerCase(), arg = parts[1];
    if (op === 'org') { loc = parseInt(arg, 16); continue; }
    if (lab) labels[lab] = loc;
    if (!op) continue;
    items.push({ loc: loc, op: op, arg: arg });
    loc++;
  }
  var mem = []; for (i = 0; i < 4096; i++) mem.push(0);
  function val(a) { return a in labels ? labels[a] : parseInt(a, 16); }
  for (i = 0; i < items.length; i++) {
    var it = items[i], w;
    if (it.op === 'dec') w = (parseInt(it.arg, 10) + 65536) & 0xFFFF;
    else if (it.op === 'hex') w = parseInt(it.arg, 16) & 0xFFFF;
    else if (it.op === 'oct') w = parseInt(it.arg, 8) & 0xFFFF;
    else {
      if (!(it.op in OPS)) return { error: 'unknown mnemonic ' + it.op, output: [], steps: 0 };
      var code = OPS[it.op], operand = it.arg === undefined ? 0 : val(it.arg);
      w = (code << 12) | (operand & 0xFFF);
    }
    mem[it.loc] = w;
  }
  var sg = function (x) { return x >= 32768 ? x - 65536 : x; };
  var NAMES = ['JnS', 'Load', 'Store', 'Add', 'Subt', 'Input', 'Output', 'Halt', 'Skipcond', 'Jump', 'Clear', 'AddI', 'JumpI', 'LoadI', 'StoreI'], trace = [];
  var pc = items.length ? items[0].loc : 0, ac = 0, out = [], steps = 0, halted = false, inp = (input || []).slice(), limit = maxSteps || 100000;
  while (!halted && steps < limit) {
    var ir = mem[pc], opc = ir >> 12, ad = ir & 0xFFF;
    var pc0 = pc;
    pc++; steps++;
    switch (opc) {
      case 0: mem[ad] = pc; pc = ad + 1; break;
      case 1: ac = mem[ad]; break;
      case 2: mem[ad] = ac; break;
      case 3: ac = (ac + mem[ad]) & 0xFFFF; break;
      case 4: ac = (ac - mem[ad] + 65536) & 0xFFFF; break;
      case 5: ac = ((inp.length ? inp.shift() : 0) + 65536) & 0xFFFF; break;
      case 6: out.push(sg(ac)); break;
      case 7: halted = true; break;
      case 8: {
        var cnd = (ir >> 10) & 3;
        if ((cnd === 0 && sg(ac) < 0) || (cnd === 1 && ac === 0) || (cnd === 2 && sg(ac) > 0)) pc++;
        break;
      }
      case 9: pc = ad; break;
      case 10: ac = 0; break;
      case 11: ac = (ac + mem[mem[ad] & 0xFFF]) & 0xFFFF; break;
      case 12: pc = mem[ad] & 0xFFF; break;
      case 13: ac = mem[mem[ad] & 0xFFF]; break;
      case 14: mem[mem[ad] & 0xFFF] = ac; break;
      default: return { error: 'bad opcode', output: out, steps: steps };
    }
    trace.push({ pc: pc0, op: NAMES[opc], arg: ad, ac: sg(ac), next: pc });
  }
  return { output: out, steps: steps, ac: sg(ac), pc: pc, halted: halted, mem: mem, trace: trace };
}
/** Chỉ dịch: trả [{addr:'100', word:'1105'}…] (hex). */
export function marieAssemble(src) {
  var OPS = { jns: 0, load: 1, store: 2, add: 3, subt: 4, input: 5, output: 6, halt: 7, skipcond: 8, jump: 9, clear: 10, addi: 11, jumpi: 12, loadi: 13, storei: 14 };
  var lines = src.split('\n'), items = [], labels = {}, loc = 0, i, ln;
  for (i = 0; i < lines.length; i++) {
    ln = lines[i].replace(/\/.*$/, '').trim();
    if (!ln) continue;
    var lab = null, m = /^([A-Za-z_][A-Za-z0-9_]*)\s*,\s*(.*)$/.exec(ln);
    if (m) { lab = m[1]; ln = m[2].trim(); }
    var parts = ln.split(/\s+/), op = (parts[0] || '').toLowerCase(), arg = parts[1];
    if (op === 'org') { loc = parseInt(arg, 16); continue; }
    if (lab) labels[lab] = loc;
    items.push({ loc: loc, op: op, arg: arg });
    loc++;
  }
  var hex = function (n, w) { var s = n.toString(16).toUpperCase(); while (s.length < w) s = '0' + s; return s; };
  return items.map(function (it) {
    var w;
    if (it.op === 'dec') w = (parseInt(it.arg, 10) + 65536) & 0xFFFF;
    else if (it.op === 'hex') w = parseInt(it.arg, 16) & 0xFFFF;
    else if (it.op === 'oct') w = parseInt(it.arg, 8) & 0xFFFF;
    else { var a = it.arg === undefined ? 0 : (it.arg in labels ? labels[it.arg] : parseInt(it.arg, 16)); w = (OPS[it.op] << 12) | (a & 0xFFF); }
    return { addr: hex(it.loc, 3), word: hex(w, 4) };
  });
}
