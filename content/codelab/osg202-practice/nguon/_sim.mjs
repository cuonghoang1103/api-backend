/**
 * OSG202 practice — BỘ MÔ PHỎNG dùng để SINH đáp án (tệp bắt đầu bằng "_" ⇒ bộ xuất bỏ qua).
 * ════════════════════════════════════════════════════════════════════════════════════════
 * Mọi con số trong đề được TÍNH BẰNG CÁC HÀM Ở ĐÂY (không tính nhẩm). Kiểm lại với ví dụ sách giáo khoa:
 *   node content/codelab/osg202-practice/nguon/_kiem-sim.mjs
 * Mỗi hàm TỰ CHỨA (không dùng biến ngoài) để `fn.toString()` đem nguyên làm lời giải của đề viết-hàm.
 *
 * Quy ước (in cả vào đề):
 *  · Lập lịch: số nhỏ = ưu tiên cao; hoà ⇒ đến trước, rồi thứ tự liệt kê. RR: tiến trình mới đến đúng lúc hết lượt
 *    được xếp vào hàng TRƯỚC tiến trình bị cắt. Thời gian chuyển ngữ cảnh = 0.
 *  · Thay trang: khung rỗng được lấp theo thứ tự; OPT hoà (nhiều trang không dùng nữa) ⇒ khung số nhỏ nhất.
 *  · Đĩa: SCAN/C-SCAN chạy tới BIÊN đĩa; LOOK/C-LOOK chỉ tới yêu cầu cuối; bước nhảy về của C-SCAN/C-LOOK tính vào quãng.
 */

/** Lập lịch CPU. procs = [{id, at, bt, pr?}]. algo: FCFS | SJF | SRTF | PRIORITY | PRIORITY_P | RR. */
export function schedule(algo, procs, quantum) {
  const n = procs.length;
  const P = procs.map((p, i) => ({ id: p.id, at: p.at, bt: p.bt, pr: p.pr == null ? 0 : p.pr, i }));
  const rem = {}; const first = {}; const ct = {};
  P.forEach((p) => { rem[p.id] = p.bt; });
  const gantt = [];
  const push = (id, s, e) => {
    if (e <= s) return;
    const g = gantt[gantt.length - 1];
    if (g && g[0] === id && g[2] === s) g[2] = e; else gantt.push([id, s, e]);
  };
  const khoiDong = (id, t) => { if (first[id] === undefined) first[id] = t; };
  let t = 0; let xong = 0;
  if (algo === 'RR') {
    const q = quantum;
    const sx = P.slice().sort((a, b) => a.at - b.at || a.i - b.i);
    let k = 0; const hang = [];
    while (xong < n) {
      while (k < n && sx[k].at <= t) hang.push(sx[k++]);
      if (!hang.length) { t = sx[k].at; continue; }
      const p = hang.shift();
      khoiDong(p.id, t);
      const run = Math.min(q, rem[p.id]);
      push(p.id, t, t + run); t += run; rem[p.id] -= run;
      while (k < n && sx[k].at <= t) hang.push(sx[k++]);
      if (rem[p.id] > 0) hang.push(p); else { ct[p.id] = t; xong++; }
    }
  } else if (algo === 'FCFS' || algo === 'SJF' || algo === 'PRIORITY') {
    const daXong = {};
    while (xong < n) {
      let ds = P.filter((p) => !daXong[p.id] && p.at <= t);
      if (!ds.length) { t = Math.min.apply(null, P.filter((p) => !daXong[p.id]).map((p) => p.at)); continue; }
      const khoa = (p) => (algo === 'FCFS' ? [p.at, p.i] : algo === 'SJF' ? [p.bt, p.at, p.i] : [p.pr, p.at, p.i]);
      ds.sort((a, b) => { const x = khoa(a), y = khoa(b); for (let j = 0; j < x.length; j++) if (x[j] !== y[j]) return x[j] - y[j]; return 0; });
      const p = ds[0];
      khoiDong(p.id, t); push(p.id, t, t + p.bt); t += p.bt; ct[p.id] = t; daXong[p.id] = true; xong++;
    }
  } else {
    // SRTF / PRIORITY_P: quyết định lại sau MỖI đơn vị thời gian
    while (xong < n) {
      const ds = P.filter((p) => rem[p.id] > 0 && p.at <= t);
      if (!ds.length) { t = Math.min.apply(null, P.filter((p) => rem[p.id] > 0).map((p) => p.at)); continue; }
      const khoa = (p) => (algo === 'SRTF' ? [rem[p.id], p.at, p.i] : [p.pr, p.at, p.i]);
      ds.sort((a, b) => { const x = khoa(a), y = khoa(b); for (let j = 0; j < x.length; j++) if (x[j] !== y[j]) return x[j] - y[j]; return 0; });
      const p = ds[0];
      khoiDong(p.id, t); push(p.id, t, t + 1); rem[p.id]--; t++;
      if (rem[p.id] === 0) { ct[p.id] = t; xong++; }
    }
  }
  const lam2 = (x) => Math.round(x * 100) / 100;
  const tat = {}; const wt = {}; const rt = {};
  let sw = 0; let st = 0; let sr = 0;
  P.forEach((p) => {
    tat[p.id] = ct[p.id] - p.at; wt[p.id] = tat[p.id] - p.bt; rt[p.id] = first[p.id] - p.at;
    sw += wt[p.id]; st += tat[p.id]; sr += rt[p.id];
  });
  return { gantt, ct, tat, wt, rt, sumWt: sw, sumTat: st, avgWt: lam2(sw / n), avgTat: lam2(st / n), avgRt: lam2(sr / n), end: t };
}

/** Thay trang. algo: FIFO | LRU | OPT | CLOCK | LFU. Trả {faults, hits, rows:[{page, fault, frames, evicted}]}. */
export function replace(algo, refs, nf) {
  const frames = []; const R = []; const load = []; const last = []; const freq = {};
  let hand = 0; let faults = 0; const rows = [];
  for (let i = 0; i < refs.length; i++) {
    const pg = refs[i];
    freq[pg] = (freq[pg] || 0) + 1;
    const at = frames.indexOf(pg);
    let evicted = null; let loi = false;
    if (at >= 0) { last[at] = i; R[at] = 1; } else {
      loi = true; faults++;
      if (frames.length < nf) { frames.push(pg); R.push(1); load.push(i); last.push(i); } else {
        let v = 0;
        if (algo === 'FIFO') { let m = Infinity; for (let j = 0; j < nf; j++) if (load[j] < m) { m = load[j]; v = j; } }
        else if (algo === 'LRU') { let m = Infinity; for (let j = 0; j < nf; j++) if (last[j] < m) { m = last[j]; v = j; } }
        else if (algo === 'LFU') {
          let m = Infinity;
          for (let j = 0; j < nf; j++) { const f = freq[frames[j]]; if (f < m || (f === m && load[j] < load[v])) { m = f; v = j; } }
        } else if (algo === 'OPT') {
          let m = -1;
          for (let j = 0; j < nf; j++) {
            let nx = refs.indexOf(frames[j], i + 1); if (nx < 0) nx = Infinity;
            if (nx > m) { m = nx; v = j; }
          }
        } else if (algo === 'CLOCK') {
          while (R[hand] === 1) { R[hand] = 0; hand = (hand + 1) % nf; }
          v = hand; hand = (hand + 1) % nf;
        }
        evicted = frames[v]; frames[v] = pg; R[v] = 1; load[v] = i; last[v] = i;
      }
    }
    rows.push({ page: pg, fault: loi, frames: frames.slice(), evicted });
  }
  return { faults, hits: refs.length - faults, rows };
}

/** Thuật toán nhà băng. avail[m], alloc[n][m], max[n][m]. Quét từ tiến trình 0, mỗi vòng chọn tiến trình đầu tiên chạy xong được. */
export function banker(avail, alloc, max) {
  const n = alloc.length; const m = avail.length;
  const need = max.map((r, i) => r.map((v, j) => v - alloc[i][j]));
  const work = avail.slice(); const xong = new Array(n).fill(false); const seq = [];
  let tiep = true;
  while (tiep) {
    tiep = false;
    for (let i = 0; i < n; i++) {
      if (xong[i]) continue;
      let ok = true;
      for (let j = 0; j < m; j++) if (need[i][j] > work[j]) { ok = false; break; }
      if (ok) { for (let j = 0; j < m; j++) work[j] += alloc[i][j]; xong[i] = true; seq.push(i); tiep = true; break; }
    }
  }
  return { safe: seq.length === n, seq, need, work };
}

/** Một yêu cầu tài nguyên của tiến trình p có được cấp không (nhà băng)? Trả 'GRANT' | 'WAIT' (vượt Available) | 'DENY' (vượt Need) | 'UNSAFE'. */
export function banker_request(avail, alloc, max, p, req) {
  const m = avail.length;
  for (let j = 0; j < m; j++) if (req[j] > max[p][j] - alloc[p][j]) return 'DENY';
  for (let j = 0; j < m; j++) if (req[j] > avail[j]) return 'WAIT';
  const a2 = avail.map((v, j) => v - req[j]);
  const al2 = alloc.map((r, i) => (i === p ? r.map((v, j) => v + req[j]) : r.slice()));
  return banker(a2, al2, max).safe ? 'GRANT' : 'UNSAFE';
}

/** Phát hiện bế tắc (mỗi loại nhiều bản): trả danh sách tiến trình bị kẹt (chỉ số, tăng dần). */
export function deadlocked(avail, alloc, request) {
  const n = alloc.length; const m = avail.length;
  const work = avail.slice(); const xong = new Array(n).fill(false);
  for (let i = 0; i < n; i++) if (alloc[i].every((v) => v === 0)) xong[i] = true;
  let tiep = true;
  while (tiep) {
    tiep = false;
    for (let i = 0; i < n; i++) {
      if (xong[i]) continue;
      let ok = true;
      for (let j = 0; j < m; j++) if (request[i][j] > work[j]) { ok = false; break; }
      if (ok) { for (let j = 0; j < m; j++) work[j] += alloc[i][j]; xong[i] = true; tiep = true; }
    }
  }
  const kep = [];
  for (let i = 0; i < n; i++) if (!xong[i]) kep.push(i);
  return kep;
}

/** Lập lịch đĩa. algo: FCFS | SSTF | SCAN | CSCAN | LOOK | CLOOK; dir 'up'|'down'; maxCyl = cylinder cuối (0..maxCyl). */
export function disk(algo, head, reqs, dir, maxCyl) {
  const order = []; let pos = head; let total = 0;
  const di = (to) => { total += Math.abs(to - pos); pos = to; };
  const cho = reqs.slice();
  if (algo === 'FCFS') { cho.forEach((r) => { order.push(r); di(r); }); return { order, total }; }
  if (algo === 'SSTF') {
    while (cho.length) {
      let b = 0;
      for (let i = 1; i < cho.length; i++) if (Math.abs(cho[i] - pos) < Math.abs(cho[b] - pos)) b = i;
      const r = cho.splice(b, 1)[0]; order.push(r); di(r);
    }
    return { order, total };
  }
  const tang = cho.slice().sort((a, b) => a - b);
  const tren = tang.filter((r) => r >= head); const duoi = tang.filter((r) => r < head).reverse();
  const duoiTang = tang.filter((r) => r < head);
  if (algo === 'SCAN') {
    if (dir === 'up') { tren.forEach((r) => { order.push(r); di(r); }); if (duoi.length) { di(maxCyl); duoi.forEach((r) => { order.push(r); di(r); }); } }
    else { duoi.forEach((r) => { order.push(r); di(r); }); if (tren.length) { di(0); tren.forEach((r) => { order.push(r); di(r); }); } }
  } else if (algo === 'LOOK') {
    if (dir === 'up') { tren.forEach((r) => { order.push(r); di(r); }); duoi.forEach((r) => { order.push(r); di(r); }); }
    else { duoi.forEach((r) => { order.push(r); di(r); }); tren.forEach((r) => { order.push(r); di(r); }); }
  } else if (algo === 'CSCAN') {
    if (dir === 'up') { tren.forEach((r) => { order.push(r); di(r); }); if (duoiTang.length) { di(maxCyl); di(0); duoiTang.forEach((r) => { order.push(r); di(r); }); } }
    else { duoi.forEach((r) => { order.push(r); di(r); }); const tr2 = tren.slice().reverse(); if (tr2.length) { di(0); di(maxCyl); tr2.forEach((r) => { order.push(r); di(r); }); } }
  } else if (algo === 'CLOOK') {
    if (dir === 'up') { tren.forEach((r) => { order.push(r); di(r); }); duoiTang.forEach((r) => { order.push(r); di(r); }); }
    else { duoi.forEach((r) => { order.push(r); di(r); }); tren.slice().reverse().forEach((r) => { order.push(r); di(r); }); }
  }
  return { order, total };
}

/** Cấp phát vùng nhớ liên tục. strategy: first | best | worst | next. holes=[kích thước]; trả {place:[chỉ số lỗ|-1], holes:[còn lại]}. */
export function fit(strategy, holes, reqs) {
  const h = holes.slice(); const place = []; let last = 0;
  for (const r of reqs) {
    let c = -1;
    if (strategy === 'first') { for (let i = 0; i < h.length; i++) if (h[i] >= r) { c = i; break; } }
    else if (strategy === 'next') { for (let k = 0; k < h.length; k++) { const i = (last + k) % h.length; if (h[i] >= r) { c = i; break; } } }
    else if (strategy === 'best') { for (let i = 0; i < h.length; i++) if (h[i] >= r && (c < 0 || h[i] < h[c])) c = i; }
    else { for (let i = 0; i < h.length; i++) if (h[i] >= r && (c < 0 || h[i] > h[c])) c = i; }
    place.push(c);
    if (c >= 0) { h[c] -= r; last = c; }
  }
  return { place, holes: h };
}

/** Dịch địa chỉ ảo ⇒ vật lý. pageTable[page] = frame hoặc null (không có trong RAM). Trả số hoặc 'PAGE FAULT'. */
export function translate(vaddr, pageSize, pageTable) {
  const page = Math.floor(vaddr / pageSize); const off = vaddr % pageSize;
  if (page >= pageTable.length) return 'INVALID';
  const f = pageTable[page];
  return f === null || f === undefined ? 'PAGE FAULT' : f * pageSize + off;
}

/** Đếm số tiến trình sinh ra. prog = mảng lệnh: {op:'fork'} | {op:'forkIf', who:'child'|'parent', then:[...]} . */
export function processCount(prog) {
  function dem(ls) {
    if (!ls.length) return 1;
    const s = ls[0]; const rest = ls.slice(1);
    if (s.op === 'fork') return 2 * dem(rest);
    if (s.op === 'forkIf') return dem((s.who === 'parent' ? s.then : []).concat(rest)) + dem((s.who === 'child' ? s.then : []).concat(rest));
    return dem(rest);
  }
  return dem(prog);
}

/** Số lần in ra. prog thêm lệnh {op:'print'}. */
export function printCount(prog) {
  function dem(ls) {
    if (!ls.length) return 0;
    const s = ls[0]; const rest = ls.slice(1);
    if (s.op === 'print') return 1 + dem(rest);
    if (s.op === 'fork') return 2 * dem(rest);
    if (s.op === 'forkIf') return dem((s.who === 'parent' ? s.then : []).concat(rest)) + dem((s.who === 'child' ? s.then : []).concat(rest));
    return dem(rest);
  }
  return dem(prog);
}

/** Tập con của mọi giá trị cuối có thể có của biến chung khi các luồng tăng đồng thời (tách đọc-ghi). threads = số luồng, each = số lần tăng mỗi luồng. */
export function raceOutcomes(threads, each) {
  // trạng thái: [giá trị chung, mỗi luồng: bước (0 chưa đọc, 1 đã đọc), thanh ghi, số lần còn lại]
  const thấy = new Set(); const kq = new Set();
  const rec = (v, st) => {
    const key = v + '|' + st.map((s) => s.join(',')).join(';');
    if (thấy.has(key)) return; thấy.add(key);
    let xong = true;
    for (let t = 0; t < st.length; t++) {
      const [pha, reg, con] = st[t];
      if (con === 0 && pha === 0) continue;
      xong = false;
      const ns = st.map((s) => s.slice());
      if (pha === 0) { ns[t] = [1, v, con]; rec(v, ns); } else { ns[t] = [0, 0, con - 1]; rec(reg + 1, ns); }
    }
    if (xong) kq.add(v);
  };
  rec(0, Array.from({ length: threads }, () => [0, 0, each]));
  return Array.from(kq).sort((a, b) => a - b);
}

/** Semaphore: mô phỏng chuỗi lệnh. ops = [{p:'A', op:'down'|'up', s:'S'}] theo thứ tự thực thi; init = {S:1}. Trả trạng thái từng bước. */
export function semTrace(init, ops) {
  const val = Object.assign({}, init); const wait = {}; const chan = {};
  Object.keys(init).forEach((k) => { wait[k] = []; });
  const out = [];
  for (const o of ops) {
    if (chan[o.p]) { out.push({ p: o.p, op: o.op, s: o.s, kq: 'blocked (skipped)', val: Object.assign({}, val), wait: JSON.parse(JSON.stringify(wait)) }); continue; }
    let kq = '';
    if (o.op === 'down') {
      if (val[o.s] > 0) { val[o.s]--; kq = 'proceeds'; } else { wait[o.s].push(o.p); chan[o.p] = o.s; kq = 'blocks'; }
    } else if (wait[o.s].length) { const w = wait[o.s].shift(); delete chan[w]; kq = 'wakes ' + w; } else { val[o.s]++; kq = 'S++'; }
    out.push({ p: o.p, op: o.op, s: o.s, kq, val: Object.assign({}, val), wait: JSON.parse(JSON.stringify(wait)) });
  }
  return out;
}

/** Trạng thái tiến trình khi vòng lặp ghi/đọc: Amdahl. */
export const amdahl = (f, n) => 1 / ((1 - f) + f / n);
/** Dùng CPU với mô hình đa chương: 1 - p^n. */
export const cpuUtil = (p, n) => 1 - Math.pow(p, n);
/** Thời gian truy cập hiệu dụng với TLB: hit ratio h, TLB t, bộ nhớ m (1 cấp bảng trang). */
export const eat = (h, tlb, mem, levels) => h * (tlb + mem) + (1 - h) * (tlb + (levels || 1) * mem + mem);

/** Kích thước tệp tối đa của i-node kiểu Unix: direct nd con trỏ, 1 gián tiếp đơn, 1 đôi, 1 ba; block B byte, con trỏ P byte. */
export function inodeMax(B, P, nd, bacMax) {
  const k = B / P; let tong = nd * B;
  if (bacMax >= 1) tong += k * B;
  if (bacMax >= 2) tong += k * k * B;
  if (bacMax >= 3) tong += k * k * k * B;
  return tong;
}

/** Tập làm việc W(t, delta): các trang khác nhau trong delta tham chiếu gần nhất kết thúc ở chỉ số t (gồm t). */
export function workingSet(refs, t, delta) {
  const s = new Set();
  for (let i = Math.max(0, t - delta + 1); i <= t; i++) s.add(refs[i]);
  return Array.from(s).sort((a, b) => a - b);
}

/** Cấp khung theo tỉ lệ kích thước: frames tổng, sizes[]; trả mảng (làm tròn xuống, phần dư chia lần lượt từ tiến trình lớn nhất). */
export function proportional(frames, sizes) {
  const S = sizes.reduce((a, b) => a + b, 0);
  const kq = sizes.map((s) => Math.floor((s * frames) / S));
  let du = frames - kq.reduce((a, b) => a + b, 0);
  const thuTu = sizes.map((s, i) => [s, i]).sort((a, b) => b[0] - a[0] || a[1] - b[1]);
  for (let k = 0; du > 0; k = (k + 1) % thuTu.length, du--) kq[thuTu[k][1]]++;
  return kq;
}

/** Quyền Unix: ký hiệu 'rwxr-x---' (hoặc '-rwxr-x---') ⇒ chuỗi bát phân '750'. */
export function chmodOctal(sym) {
  const t = String(sym).length === 10 ? String(sym).slice(1) : String(sym);
  let out = '';
  for (let i = 0; i < 9; i += 3) out += (t[i] === 'r' ? 4 : 0) + (t[i + 1] === 'w' ? 2 : 0) + (t[i + 2] === 'x' ? 1 : 0);
  return out;
}

/**
 * Triết gia ăn tối theo vòng: plans[p] = danh sách đũa (chỉ số) phải lấy THEO THỨ TỰ. Mỗi vòng, lần lượt p = 0..n-1:
 * triết gia lấy đũa kế tiếp nếu rảnh (nếu bị giữ thì chờ); lấy đủ ⇒ ăn xong và trả hết đũa NGAY trong lượt đó.
 * Vòng nào không ai tiến thêm mà còn người chưa ăn ⇒ bế tắc. Trả {deadlock, order (thứ tự ăn xong), rounds}.
 */
export function dining(plans) {
  const n = plans.length; const owner = {}; const next = new Array(n).fill(0); const order = [];
  let rounds = 0;
  while (order.length < n) {
    rounds++; let tienBo = false;
    for (let p = 0; p < n; p++) {
      if (next[p] >= plans[p].length) continue;
      const f = plans[p][next[p]];
      if (owner[f] === undefined) {
        owner[f] = p; next[p]++; tienBo = true;
        if (next[p] === plans[p].length) { plans[p].forEach((g) => { delete owner[g]; }); order.push(p); }
      }
    }
    if (!tienBo) return { deadlock: true, order, rounds };
  }
  return { deadlock: false, order, rounds };
}

/** Bộ đệm có giới hạn: ops là chuỗi 'P'/'C' theo thứ tự thực hiện; trả chỉ số lệnh ĐẦU TIÊN bị chặn (đầy khi P, rỗng khi C) hoặc -1. */
export function firstBlock(N, ops) {
  let dem = 0;
  for (let i = 0; i < ops.length; i++) {
    if (ops[i] === 'P') { if (dem === N) return i; dem++; } else { if (dem === 0) return i; dem--; }
  }
  return -1;
}

/** Số luồng nhỏ nhất để đạt tăng tốc ≥ target theo Amdahl (phần song song f); -1 nếu không thể (trần 1/(1-f) ≤ target). */
export function threadsNeeded(f, target) {
  const tran = f >= 1 ? Infinity : 1 / (1 - f);
  if (target <= 1) return 1;
  if (tran <= target) return -1;
  for (let n = 1; n < 100000; n++) if (1 / ((1 - f) + f / n) >= target) return n;
  return -1;
}

/**
 * Đồ thị cấp phát tài nguyên, mỗi loại MỘT bản. edges: ['P1>R1' (P1 yêu cầu R1), 'R1>P2' (R1 đang cấp cho P2), …].
 * Có chu trình ⇒ bế tắc. Trả {deadlock, cycle: [node…] (chu trình đầu tiên tìm được, rỗng nếu không có)}.
 */
export function rag(edges) {
  const g = {};
  edges.forEach((e) => { const [a, b] = e.split('>'); (g[a] = g[a] || []).push(b); if (!g[b]) g[b] = []; });
  const nodes = Object.keys(g).sort();
  const state = {}; const stack = [];
  let found = [];
  const dfs = (u) => {
    state[u] = 1; stack.push(u);
    for (const v of g[u].slice().sort()) {
      if (found.length) return;
      if (state[v] === 1) { found = stack.slice(stack.indexOf(v)); return; }
      if (!state[v]) dfs(v);
    }
    stack.pop(); state[u] = 2;
  };
  for (const u of nodes) if (!state[u] && !found.length) dfs(u);
  return { deadlock: found.length > 0, cycle: found };
}

/** Theo chuỗi khối FAT. fat[i] = khối kế tiếp, -1 = hết tệp, -2 = khối hỏng/không hợp lệ. Trả {chain, ok}; ok=false khi có vòng hoặc con trỏ ngoài bảng. */
export function fatChain(fat, start) {
  const chain = []; const thay = {};
  let b = start;
  while (b !== -1) {
    if (b < 0 || b >= fat.length || thay[b]) return { chain, ok: false };
    thay[b] = true; chain.push(b); b = fat[b];
  }
  return { chain, ok: true };
}

/** Vị trí byte `offset` trong tệp i-node kiểu Unix: trả {level: 0 (trực tiếp)…3, reads: số khối đĩa phải đọc kể cả khối dữ liệu (i-node đã ở RAM)}. */
export function locate(offset, B, P, nd) {
  const k = B / P; const blk = Math.floor(offset / B);
  if (blk < nd) return { level: 0, reads: 1 };
  if (blk < nd + k) return { level: 1, reads: 2 };
  if (blk < nd + k + k * k) return { level: 2, reads: 3 };
  if (blk < nd + k + k * k + k * k * k) return { level: 3, reads: 4 };
  return { level: -1, reads: 0 };
}

/** RAID: dung lượng dùng được và số ổ hỏng ĐẢM BẢO chịu được. level: 0|1|5|6|10. */
export function raid(level, n, size) {
  if (level === 0) return { usable: n * size, tolerate: 0 };
  if (level === 1) return { usable: (n * size) / n, tolerate: n - 1 };
  if (level === 5) return { usable: (n - 1) * size, tolerate: 1 };
  if (level === 6) return { usable: (n - 2) * size, tolerate: 2 };
  return { usable: (n * size) / 2, tolerate: 1 };
}
