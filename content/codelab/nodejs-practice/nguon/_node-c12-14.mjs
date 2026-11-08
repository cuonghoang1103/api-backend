/**
 * Node.js · Chương 12–14 (Redis · hàng đợi nền · kiểm thử) — BỘ DỰNG ĐỀ dùng chung (tệp "_" ⇒ bộ xuất bỏ qua).
 *
 *  - Chữ + trắc nghiệm / sắp thứ tự / bảng: dùng lại ../../api-design-practice/nguon/_api.mjs (xáo theo NỘI DUNG,
 *    không bao giờ viết tay chữ a/b/c/d), chỉ đổi thẻ sang 'nodejs'.
 *  - Bài viết hàm: `jsBai()` chạy LỜI GIẢI qua ĐÚNG HARNESS của máy chấm (scripts/codelab-cham-js.mjs — hẹn giờ GIẢ,
 *    đồng hồ ẢO, Date.now() ảo) trong node:vm ⇒ `mongDoi` không thể lệch máy chấm, kể cả hàm async + setTimeout.
 *    Sau đó chấm lại bằng chamKiemJs thật: lời giải ĐẠT mọi kiểm, code khởi đầu TRƯỢT ≥ 1.
 *  - Không có Redis/BullMQ/Postgres trong trình duyệt ⇒ mỗi đề mang một tệp GIẢ đọc được (`fake-redis.js`, `fake-queue.js`…)
 *    nạp TRƯỚC answer.js (tepNap). Redis giả: mỗi lệnh = MỘT vòng đi-về 1 ms ẢO, lệnh chạy NGAY lúc gửi (như Redis đơn
 *    luồng nhận lệnh theo thứ tự) ⇒ cuộc đua GET → kiểm → SET của bài 12.4 tái hiện được, đếm được vòng đi-về (12.1),
 *    TTL theo đồng hồ ảo (12.2), `script(fn)` = EVAL Lua (nguyên tử, một vòng đi-về).
 *  - Chương 14: loại `mutation` (README §3d) — người học viết TEST, máy chấm chạy chúng với code đúng rồi với từng đột biến.
 */
import vm from 'node:vm';
import { HARNESS, chamKiemJs } from '../../../../scripts/codelab-cham-js.mjs';
import { doiDau, bi, hai, giai, lc, esc, pre, c, tab, tn, q, qn, ord, bang1, mt, cs as csApi } from '../../api-design-practice/nguon/_api.mjs';
export { doiDau, bi, hai, giai, lc, esc, pre, c, tab, tn, q, qn, ord, bang1, mt };

export const KHOA = 'nodejs';
const THE = ['nodejs'];
const hv = (x) => (Array.isArray(x) ? bi(x[0], x[1]) : x);

/** Bộ tĩnh (choice / order / table) — cs() của _api.mjs, thẻ 'nodejs', dangBai tuỳ chọn. */
export function cs(o) {
  const r = csApi(o);
  return { ...r, the: [...THE, ...(o.the || [])], ...(o.dangBai ? { dangBai: o.dangBai } : {}) };
}

/** Một module = một bài học (slug = slug bài) hoặc một Lab chương (baiHoc = bài có video gần nhất). */
export const modul = (slug, ten, de, baiHoc = slug) => doiDau({ slug, ten, khoa: KHOA, baiHoc, de });

/* ═══════════════════ chạy LỜI GIẢI qua đúng HARNESS của máy chấm ═══════════════════ */
function taoRealm(tj, k) {
  const ctx = vm.createContext({ URL, URLSearchParams }, { microtaskMode: 'afterEvaluate', codeGeneration: { strings: true, wasm: false } });
  const chay = (code, filename = 'cham.js') => new vm.Script(code, { filename }).runInContext(ctx, { timeout: 1000 });
  chay(HARNESS, 'harness.js');
  chay(`__fetchGia = ${JSON.stringify({ ...(tj.fetchGia || {}), ...(k.fetchGia || {}) })};`);
  return { ctx, chay };
}
function vongLap(r, xongKhi, timeoutMs) {
  const g0 = r.ctx.__gio();
  for (let buoc = 0; buoc < 20000; buoc++) {
    r.chay('0');
    if (xongKhi()) return;
    const ke = r.ctx.__henKeTiep();
    if (ke == null || ke - g0 > timeoutMs) return;
    try { r.chay('__chayHen()'); } catch (e) { if (e && e.code === 'ERR_SCRIPT_EXECUTION_TIMEOUT') throw e; }
  }
}
/** ⇒ { v } | { loi, thongDiep } */
function chayGiai(tj, k, files) {
  const r = taoRealm(tj, k);
  for (const t of tj.tepNap) r.chay(files[t], t);
  r.chay(`__batDau(async () => {\n${k.chuanBi || ''}\nreturn { v: (${k.goi || 'undefined'}) };\n});`);
  vongLap(r, () => r.ctx.__trangThai !== 'cho', k.timeoutMs || tj.timeoutMs || 10000);
  const tt = r.ctx.__trangThai;
  if (tt === 'cho') return { loi: '__ChuaXong', thongDiep: 'Promise chưa xong' };
  if (tt === 'loi') { const e = r.ctx.__kq; return { loi: e && e.name ? e.name : 'Error', thongDiep: String(e && e.message) }; }
  return { v: JSON.parse(JSON.stringify(r.ctx.__chuanHoa(r.ctx.__kq))) };
}

const bo = (m) => m.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`\\])\/\/.*$/gm, '$1');

/**
 * Bài viết hàm. spec = {
 *   ten, kho, phut, diem?, dangBai?, en, vi (HTML), yc: [[en,vi]…], dauVao?, dauRa?, rangBuoc?: [[en,vi]…],
 *   goiY: [[en,vi]…] (≥2), loi: [[en,vi]…] (≥2), gt: [en, vi] (HTML), kn: [], tns: [tn()…],
 *   gia?: { 'fake-redis.js': mã } (tệp GIẢ nạp trước answer.js — người học đọc được), dau, giai,
 *   chung?: 'chuanBi dùng chung mọi kiểm',
 *   cases: [{ goi, chuanBi?, an?, nem?: 'Error', thongDiep?, moTa?: [en,vi], timeoutMs? }],
 *   kiemThem?: [{ kiem:'ma-nguon', khop, phuDinh?, moTa }], viDu?: [{input, output, explanation}]
 * }
 */
export function jsBai(s) {
  const { ten, kho, phut, diem, dangBai, en, vi, yc, dauVao, dauRa, rangBuoc, goiY, loi, gt, kn = [], tns = [], dau, giai: giaiMa, cases, kiemThem = [], viDu, chung = '', gia = {}, the = [] } = s;
  const tep = 'answer.js';
  if (!cases.some((x) => x.an)) throw new Error(`${ten}: thiếu kiểm ẩn`);
  if (!cases.some((x) => !x.an)) throw new Error(`${ten}: thiếu kiểm hiện`);
  if (goiY.length < 2 || loi.length < 2) throw new Error(`${ten}: cần ≥ 2 gợi ý và ≥ 2 lỗi hay gặp`);
  if (giaiMa.length < 200) throw new Error(`${ten}: lời giải < 200 ký tự`);
  const tepGia = Object.keys(gia);
  const tj = { loai: 'js', phienBan: 1, tepChinh: tep, tepNap: [...tepGia, tep] };
  const giaiF = { [tep]: giaiMa, ...gia };
  const dauF = { [tep]: dau, ...gia };
  const kiem = cases.map((x, i) => {
    const k = { goi: x.goi, ...(chung || x.chuanBi ? { chuanBi: [chung, x.chuanBi].filter(Boolean).join('\n') } : {}), ...(x.timeoutMs ? { timeoutMs: x.timeoutMs } : {}) };
    const r = chayGiai(tj, k, giaiF);
    if (x.nem) {
      if (r.loi !== x.nem) throw new Error(`${ten}: ca ${i + 1} phải ném ${x.nem}, lời giải cho ${JSON.stringify(r)}`);
      k.mongDoi = { loi: x.nem, ...(x.thongDiep ? { thongDiep: x.thongDiep } : {}) };
    } else {
      if (r.loi) throw new Error(`${ten}: lời giải ném ${r.loi} ở ca ${i + 1}: ${r.thongDiep}`);
      k.mongDoi = r.v;
      if (JSON.stringify(r.v).includes('"$js":"Promise"')) throw new Error(`${ten}: ca ${i + 1} trả về Promise chưa await — viết await trong goi`);
    }
    const nhan = x.moTa ? bi(x.moTa[0], x.moTa[1]) : (x.an ? bi(`Hidden case ${i + 1}`, `Ca ẩn ${i + 1}`) : bi(`Case ${i + 1}`, `Ca ${i + 1}`));
    return { moTa: nhan, ...k, ...(x.an ? { an: true } : {}) };
  });
  let truot = 0;
  for (const k of kiem) {
    const g = chamKiemJs(tj, k, giaiF);
    if (!g.dat) throw new Error(`${ten}: lời giải trượt "${k.moTa.en}": ${g.thay}`);
    if (!chamKiemJs(tj, k, dauF).dat) truot++;
  }
  const them = kiemThem.map((k) => ({ kiem: 'ma-nguon', tep, ...k }));
  for (const k of them) {
    const re = new RegExp(k.khop, k.co || '');
    const dat = (m) => (k.phuDinh ? !re.test(bo(m)) : re.test(bo(m)));
    if (!dat(giaiMa)) throw new Error(`${ten}: lời giải trượt kiểm mã nguồn ${k.khop}`);
    if (!dat(dau)) truot++;
  }
  if (!truot) throw new Error(`${ten}: code khởi đầu đạt mọi kiểm — phải trượt ít nhất một`);
  const gop = (ds) => (ds && ds.length ? [bi(ds.map((x) => x[0]).join('\n'), ds.map((x) => x[1]).join('\n'))] : undefined);
  const k0 = kiem.find((x) => !x.an);
  return {
    tieuDe: ten, doKho: kho, phut, ...(diem ? { diem } : {}), dangBai: dangBai || 'practice',
    the: [...THE, ...the], ngonNgu: 'javascript', loaiKiem: 'js',
    moTa: bi(en, vi),
    yeuCau: yc.map(hv),
    ...(dauVao ? { dauVao: hv(dauVao) } : {}),
    ...(dauRa ? { dauRa: hv(dauRa) } : {}),
    ...(rangBuoc ? { rangBuoc: gop(rangBuoc) } : {}),
    viDu: viDu || [{
      input: `${k0.chuanBi ? `${k0.chuanBi}\n` : ''}${k0.goi}`,
      output: JSON.stringify(k0.mongDoi),
      explanation: 'The first sample case (Run shows every visible case; hidden ones only run on Submit).|||Ca mẫu đầu tiên (Chạy thử chạy mọi ca hiện; ca ẩn chỉ chạy khi Nộp).',
    }],
    goiY: goiY.map(hv), loiHayGap: loi.map(hv),
    giaiThich: bi(`<p>${gt[0]}</p>`, `<p>${gt[1]}</p>`),
    khaiNiem: kn, thuatNgu: tns,
    tests: { ...tj, kiem: [...kiem, ...them] },
    khoiDau: dauF,
    loiGiai: giaiF,
  };
}

/**
 * Bài viết TEST (loại mutation, README §3d). spec = {
 *   ten, kho, phut, en, vi, yc, goiY, loi, gt, kn, tns, viDu,
 *   impl: { 'src/x.js': code ĐÚNG, … }, tepTest: 'src/x.test.js', dau (bộ test YẾU nhưng đúng), giai (bộ test diệt hết),
 *   dotBien: [{ file, from, to, label, goiY, an? }], voHai?: [...], toiThieuTest, nguong?
 * }
 * Bộ xuất (codelab-xuat-de.mjs) chạy lời giải (xanh + diệt hết) và khởi đầu (xanh, diệt < ngưỡng) bằng bộ chạy thật.
 */
export function mutBai(s) {
  const { ten, kho, phut, diem, dangBai, en, vi, yc, dauVao, dauRa, goiY, loi, gt, kn = [], tns = [], viDu, impl, tepTest, dau, giai: giaiMa, dotBien, voHai, toiThieuTest, nguong, the = [] } = s;
  if (goiY.length < 2 || loi.length < 2) throw new Error(`${ten}: cần ≥ 2 gợi ý và ≥ 2 lỗi hay gặp`);
  if (!viDu || !viDu.length) throw new Error(`${ten}: cần viDu`);
  for (const d of dotBien) if (!d.goiY) throw new Error(`${ten}: đột biến "${d.label}" thiếu goiY`);
  return {
    tieuDe: ten, doKho: kho, phut, ...(diem ? { diem } : {}), dangBai: dangBai || 'practice',
    the: [...THE, 'testing', 'mutation', ...the], ngonNgu: 'javascript',
    moTa: bi(en, vi),
    yeuCau: yc.map(hv),
    ...(dauVao ? { dauVao: hv(dauVao) } : {}),
    ...(dauRa ? { dauRa: hv(dauRa) } : {}),
    viDu,
    goiY: goiY.map(hv), loiHayGap: loi.map(hv),
    giaiThich: bi(`<p>${gt[0]}</p>`, `<p>${gt[1]}</p>`),
    khaiNiem: kn, thuatNgu: tns,
    tests: { loai: 'mutation', impl, toiThieuTest, ...(nguong ? { nguong } : {}), timeoutMs: 4000, tepTest, dotBien, ...(voHai ? { voHai } : {}) },
    khoiDau: { [tepTest]: dau, ...impl },
    loiGiai: { [tepTest]: giaiMa, ...impl },
  };
}

/** Yêu cầu chuẩn của một đề mutation. */
export const YC_MUT = (n, m) => [
  [`Write at least <b>${n}</b> tests (<code>describe</code> / <code>it</code> / <code>expect</code> from <code>'vitest'</code>), each with at least one <code>expect</code>.`, `Viết ít nhất <b>${n}</b> test (<code>describe</code> / <code>it</code> / <code>expect</code> từ <code>'vitest'</code>), mỗi test có ít nhất một <code>expect</code>.`],
  ['Every test must pass on the correct code — the grader runs your file against it first.', 'Mọi test phải xanh với code đúng — máy chấm chạy tệp của bạn với nó trước.'],
  [`Kill all <b>${m}</b> mutants (copies of the code with one planted bug each). Editing the code files changes nothing: the grader always uses its own copy.`, `Diệt cả <b>${m}</b> đột biến (các bản code mỗi bản cài một lỗi). Sửa tệp code không có tác dụng: máy chấm luôn dùng bản của nó.`],
];

/* ═══════════════════ thuật ngữ dùng chung ═══════════════════ */
export const TN = {
  rtt: tn('round trip (RTT)', 'vòng đi-về', 'một lệnh gửi đi + chờ câu trả lời; với lệnh nhỏ nó chiếm gần hết thời gian'),
  pipeline: tn('pipeline', 'đường ống lệnh', 'gửi nhiều lệnh một lượt, đọc mọi câu trả lời một lượt — một vòng đi-về'),
  ttl: tn('TTL (time to live)', 'hạn sống', '-2 = khoá không tồn tại, -1 = tồn tại mà KHÔNG có hạn'),
  cacheAside: tn('cache-aside', 'đọc qua bộ đệm', 'ứng dụng tự hỏi cache, trượt thì hỏi CSDL rồi ghi lại cache'),
  stampede: tn('stampede', 'cơn giẫm đạp', 'nhiều request cùng trượt một khoá vừa hết hạn và cùng dội vào CSDL'),
  singleFlight: tn('single-flight', 'một chuyến bay', 'chỉ một lời gọi nạp thật; những lời gọi trùng bám vào cùng Promise đó'),
  atomic: tn('atomic', 'nguyên tử', 'không ai chen vào giữa được — Redis chạy MỘT lệnh / một script tại một thời điểm'),
  lua: tn('Lua script (EVAL)', 'kịch bản Lua', 'chạy bên trong Redis, cả kịch bản là một lệnh nguyên tử, một vòng đi-về'),
  lock: tn('distributed lock', 'khoá phân tán', 'SET khoá token PX ttl NX; chỉ mở khi token còn khớp'),
  idempotent: tn('idempotent', 'luỹ đẳng', 'chạy hai lần cho cùng kết quả như một lần'),
  atLeastOnce: tn('at-least-once', 'ít nhất một lần', 'hàng đợi có thể chạy lại một job — thử lại, job treo được nhặt lại, thêm trùng'),
  backoff: tn('exponential backoff', 'lùi thời gian theo cấp số nhân', 'khoảng chờ giữa các lần thử gấp đôi mỗi lần'),
  jitter: tn('jitter', 'độ rung ngẫu nhiên', 'cộng thêm một khoảng ngẫu nhiên để các khoá / lần thử không cùng rơi vào một thời điểm'),
  stalled: tn('stalled job', 'job treo', 'job ở trạng thái active mà khoá không còn được gia hạn — worker đã chết hoặc chặn event loop'),
  mutant: tn('mutant', 'đột biến', 'bản code bị cài sẵn MỘT lỗi nhỏ; bộ test tốt phải đỏ với nó'),
  killed: tn('killed / survived', 'bị diệt / còn sống', 'test đỏ với đột biến = diệt; vẫn xanh = sống (bộ test có lỗ hổng)'),
  double: tn('test double', 'hàng giả trong test', 'dummy, stub, spy, mock, fake — vật thay cho phụ thuộc thật'),
};

/* ═══════════════════ Redis GIẢ (tệp fake-redis.js của đề) ═══════════════════ */
export const FAKE_REDIS = `// fake-redis.js — PROVIDED by the exercise. Read it, do not edit it (it is loaded before answer.js).
// A tiny in-memory Redis with an ioredis-like API. Every command is ONE round trip of 1 ms (virtual clock):
// the command runs inside "Redis" the moment you send it, the reply arrives 1 ms later.
//   const redis = new FakeRedis();
//   await redis.set('k', 'v', 'EX', 60)      // also 'PX', ms · 'NX' · 'XX' · 'KEEPTTL'  → 'OK' | null
//   await redis.get('k') · mget(k1, k2…) · del · unlink · exists · incr · incrby · expire · pexpire · ttl · pttl
//   hset(k, field, v) | hset(k, {f: v}) · hget · hmget · hgetall · hincrby · hdel · hlen
//   zadd(k, score, member) · zincrby · zscore · zcard · zrank · zrevrank · zrange / zrevrange(k, start, stop, 'WITHSCORES')
//   zremrangebyscore(k, min, max) · sadd · srem · sismember · scard · smembers · lpush · rpush · lpop · rpop · lrange · ltrim · llen
//   setbit(k, offset, 0|1) · getbit · bitcount · bitop('AND'|'OR', dest, k1, k2…) · keys(pattern) · scan(cursor, 'MATCH', p, 'COUNT', n)
//   redis.pipeline() / redis.multi(): queue commands, then await .exec() → [[null, result], …] in ONE round trip
//   await redis.script((r) => { … })  stands in for EVAL of a Lua script: inside, r.<command>(…) runs SYNCHRONOUSLY
//                                     (no await), the whole function is ONE atomic command and ONE round trip.
// Counters you (and the grader) can read: redis.roundTrips · redis.commands · redis.log (command names in order).
// redis.down = true  ⇒ every command rejects with Error('connect ECONNREFUSED 127.0.0.1:6379').
// redis.maxKeys = n  ⇒ "maxmemory, policy noeviction": a write that would create key n+1 fails with ReplyError OOM.
class FakeRedis {
  constructor(opts) {
    opts = opts || {};
    this.rttMs = opts.rttMs == null ? 1 : opts.rttMs;
    this.data = new Map();      // key → { t: type, v: value, exp: ms | null }
    this.roundTrips = 0; this.commands = 0; this.log = []; this.down = false;
    this.cursorPage = opts.scanPage || 10;
  }
  // ── internals ──
  _live(k) { const e = this.data.get(String(k)); if (!e) return null; if (e.exp != null && Date.now() > e.exp) { this.data.delete(String(k)); return null; } return e; }
  _room(k) { // maxmemory with the default policy noeviction (lesson 12.6): a NEW key beyond maxKeys is refused
    if (this.maxKeys != null && !this._live(k) && this.data.size >= this.maxKeys) {
      const err = new Error("OOM command not allowed when used memory > 'maxmemory'."); err.name = 'ReplyError'; throw err;
    }
  }
  _get(k, t, make) {
    let e = this._live(k);
    if (!e) { if (!make) return null; this._room(k); e = { t, v: make(), exp: null }; this.data.set(String(k), e); }
    if (e.t !== t) { const err = new Error('WRONGTYPE Operation against a key holding the wrong kind of value'); err.name = 'ReplyError'; throw err; }
    return e;
  }
  _wait(v, err) { const ms = this.rttMs; return new Promise((ok, no) => setTimeout(() => (err ? no(err) : ok(v)), ms)); }
  _send(name, args) {
    this.roundTrips++;
    if (this.down) return this._wait(null, new Error('connect ECONNREFUSED 127.0.0.1:6379'));
    try { return this._wait(this._run(name, args)); } catch (e) { return this._wait(null, e); }
  }
  _run(name, args) {
    const f = FakeRedis.ops[name];
    if (!f) throw new Error('ERR unknown command ' + name);
    this.commands++; this.log.push(name);
    return f.apply(this, args);
  }
  pipeline() {
    const self = this, q = [], p = {};
    for (const n of FakeRedis.names) p[n] = (...a) => { q.push([n, a]); return p; };
    p.exec = () => {
      self.roundTrips++;
      if (self.down) return self._wait(null, new Error('connect ECONNREFUSED 127.0.0.1:6379'));
      return self._wait(q.map(([n, a]) => { try { return [null, self._run(n, a)]; } catch (e) { return [e, null]; } }));
    };
    p.length = () => q.length;
    return p;
  }
  multi() { return this.pipeline(); }
  script(fn) {
    this.roundTrips++;
    if (this.down) return this._wait(null, new Error('connect ECONNREFUSED 127.0.0.1:6379'));
    const self = this, r = {};
    for (const n of FakeRedis.names) r[n] = (...a) => self._run(n, a);
    this.commands++; this.log.push('EVAL');
    try { const out = fn(r); if (out && typeof out.then === 'function') throw new Error('script(fn): fn must be synchronous — Lua cannot await'); return this._wait(out); }
    catch (e) { return this._wait(null, e); }
  }
}
FakeRedis.ops = {
  get(k) { const e = this._get(k, 'string'); return e ? e.v : null; },
  set(k, v, ...o) {
    const up = o.map((x) => String(x).toUpperCase());
    const e = this._live(k);
    if (up.includes('NX') && e) return null;
    if (up.includes('XX') && !e) return null;
    this._room(k);
    let exp = null;
    const i = up.indexOf('EX'), j = up.indexOf('PX');
    if (i >= 0) exp = Date.now() + Number(o[i + 1]) * 1000;
    else if (j >= 0) exp = Date.now() + Number(o[j + 1]);
    else if (up.includes('KEEPTTL') && e) exp = e.exp;
    this.data.set(String(k), { t: 'string', v: String(v), exp });
    return 'OK';
  },
  mget(...ks) { return ks.flat().map((k) => { const e = this._live(k); return e && e.t === 'string' ? e.v : null; }); },
  del(...ks) { let n = 0; for (const k of ks.flat()) if (this._live(k)) { this.data.delete(String(k)); n++; } return n; },
  unlink(...ks) { return FakeRedis.ops.del.apply(this, ks); },
  exists(...ks) { return ks.flat().filter((k) => this._live(k)).length; },
  incr(k) { return FakeRedis.ops.incrby.call(this, k, 1); },
  incrby(k, n) {
    const e = this._get(k, 'string', () => '0');
    const x = Number(e.v) + Number(n);
    if (!Number.isInteger(Number(e.v))) throw new Error('ERR value is not an integer or out of range');
    e.v = String(x); return x;
  },
  expire(k, s) { const e = this._live(k); if (!e) return 0; e.exp = Date.now() + Number(s) * 1000; return 1; },
  pexpire(k, ms) { const e = this._live(k); if (!e) return 0; e.exp = Date.now() + Number(ms); return 1; },
  persist(k) { const e = this._live(k); if (!e || e.exp == null) return 0; e.exp = null; return 1; },
  pttl(k) { const e = this._live(k); if (!e) return -2; if (e.exp == null) return -1; return e.exp - Date.now(); },
  ttl(k) { const p = FakeRedis.ops.pttl.call(this, k); return p < 0 ? p : Math.floor((p + 500) / 1000); },
  hset(k, ...a) {
    const e = this._get(k, 'hash', () => new Map()); let n = 0;
    const pairs = a.length === 1 && typeof a[0] === 'object' ? Object.entries(a[0]) : [];
    for (let i = 0; i + 1 < a.length; i += 2) pairs.push([a[i], a[i + 1]]);
    for (const [f, v] of pairs) { if (!e.v.has(String(f))) n++; e.v.set(String(f), String(v)); }
    return n;
  },
  hget(k, f) { const e = this._get(k, 'hash'); return e && e.v.has(String(f)) ? e.v.get(String(f)) : null; },
  hmget(k, ...fs) { const e = this._get(k, 'hash'); return fs.flat().map((f) => (e && e.v.has(String(f)) ? e.v.get(String(f)) : null)); },
  hgetall(k) { const e = this._get(k, 'hash'); return e ? Object.fromEntries(e.v) : {}; },
  hincrby(k, f, n) { const e = this._get(k, 'hash', () => new Map()); const x = Number(e.v.get(String(f)) || 0) + Number(n); e.v.set(String(f), String(x)); return x; },
  hdel(k, ...fs) { const e = this._get(k, 'hash'); if (!e) return 0; let n = 0; for (const f of fs.flat()) if (e.v.delete(String(f))) n++; if (!e.v.size) this.data.delete(String(k)); return n; },
  hlen(k) { const e = this._get(k, 'hash'); return e ? e.v.size : 0; },
  zadd(k, ...a) { const e = this._get(k, 'zset', () => new Map()); let n = 0; for (let i = 0; i + 1 < a.length; i += 2) { if (!e.v.has(String(a[i + 1]))) n++; e.v.set(String(a[i + 1]), Number(a[i])); } return n; },
  zincrby(k, inc, m) { const e = this._get(k, 'zset', () => new Map()); const x = (e.v.get(String(m)) || 0) + Number(inc); e.v.set(String(m), x); return String(x); },
  zscore(k, m) { const e = this._get(k, 'zset'); return e && e.v.has(String(m)) ? String(e.v.get(String(m))) : null; },
  zcard(k) { const e = this._get(k, 'zset'); return e ? e.v.size : 0; },
  _zsorted(k, rev) {
    const e = this._get(k, 'zset'); if (!e) return [];
    const a = [...e.v].sort((x, y) => x[1] - y[1] || (x[0] < y[0] ? -1 : x[0] > y[0] ? 1 : 0));
    return rev ? a.reverse() : a;
  },
  _zslice(k, s, t, ws, rev) {
    const a = FakeRedis.ops._zsorted.call(this, k, rev), n = a.length;
    let i = Number(s), j = Number(t); if (i < 0) i += n; if (j < 0) j += n; i = Math.max(0, i); j = Math.min(n - 1, j);
    const part = i > j ? [] : a.slice(i, j + 1);
    return String(ws || '').toUpperCase() === 'WITHSCORES' ? part.flatMap(([m, sc]) => [m, String(sc)]) : part.map(([m]) => m);
  },
  zrange(k, s, t, ws) { return FakeRedis.ops._zslice.call(this, k, s, t, ws, false); },
  zrevrange(k, s, t, ws) { return FakeRedis.ops._zslice.call(this, k, s, t, ws, true); },
  zrank(k, m) { const i = FakeRedis.ops._zsorted.call(this, k, false).findIndex((x) => x[0] === String(m)); return i < 0 ? null : i; },
  zrevrank(k, m) { const i = FakeRedis.ops._zsorted.call(this, k, true).findIndex((x) => x[0] === String(m)); return i < 0 ? null : i; },
  zremrangebyscore(k, min, max) {
    const e = this._get(k, 'zset'); if (!e) return 0;
    const lo = min === '-inf' ? -Infinity : Number(min), hi = max === '+inf' ? Infinity : Number(max); let n = 0;
    for (const [m, sc] of [...e.v]) if (sc >= lo && sc <= hi) { e.v.delete(m); n++; }
    return n;
  },
  sadd(k, ...ms) { const e = this._get(k, 'set', () => new Set()); let n = 0; for (const m of ms.flat()) if (!e.v.has(String(m))) { e.v.add(String(m)); n++; } return n; },
  srem(k, ...ms) { const e = this._get(k, 'set'); if (!e) return 0; let n = 0; for (const m of ms.flat()) if (e.v.delete(String(m))) n++; return n; },
  sismember(k, m) { const e = this._get(k, 'set'); return e && e.v.has(String(m)) ? 1 : 0; },
  scard(k) { const e = this._get(k, 'set'); return e ? e.v.size : 0; },
  smembers(k) { const e = this._get(k, 'set'); return e ? [...e.v].sort() : []; },
  lpush(k, ...vs) { const e = this._get(k, 'list', () => []); for (const v of vs.flat()) e.v.unshift(String(v)); return e.v.length; },
  rpush(k, ...vs) { const e = this._get(k, 'list', () => []); for (const v of vs.flat()) e.v.push(String(v)); return e.v.length; },
  lpop(k) { const e = this._get(k, 'list'); return e && e.v.length ? e.v.shift() : null; },
  rpop(k) { const e = this._get(k, 'list'); return e && e.v.length ? e.v.pop() : null; },
  llen(k) { const e = this._get(k, 'list'); return e ? e.v.length : 0; },
  lrange(k, s, t) { const e = this._get(k, 'list'); if (!e) return []; const n = e.v.length; let i = Number(s), j = Number(t); if (i < 0) i += n; if (j < 0) j += n; return e.v.slice(Math.max(0, i), j + 1); },
  ltrim(k, s, t) { const e = this._get(k, 'list'); if (!e) return 'OK'; const n = e.v.length; let i = Number(s), j = Number(t); if (i < 0) i += n; if (j < 0) j += n; e.v = e.v.slice(Math.max(0, i), j + 1); return 'OK'; },
  setbit(k, off, b) { const e = this._get(k, 'bitmap', () => new Set()); const o = Number(off); const old = e.v.has(o) ? 1 : 0; if (Number(b)) e.v.add(o); else e.v.delete(o); return old; },
  getbit(k, off) { const e = this._get(k, 'bitmap'); return e && e.v.has(Number(off)) ? 1 : 0; },
  bitcount(k) { const e = this._get(k, 'bitmap'); return e ? e.v.size : 0; },
  bitop(op, dest, ...ks) {
    const sets = ks.flat().map((k) => { const e = this._get(k, 'bitmap'); return e ? e.v : new Set(); });
    let out;
    if (String(op).toUpperCase() === 'AND') out = new Set([...(sets[0] || [])].filter((x) => sets.every((s) => s.has(x))));
    else out = new Set(sets.flatMap((s) => [...s]));
    this.data.set(String(dest), { t: 'bitmap', v: out, exp: null });
    return out.size;
  },
  keys(p) {
    const re = new RegExp('^' + String(p).replace(/[.+^$()|{}[\\]\\\\]/g, '\\\\$&').replace(/\\*/g, '.*').replace(/\\?/g, '.') + '$');
    this.usedKeys = true;
    return [...this.data.keys()].filter((k) => this._live(k) && re.test(k)).sort();
  },
  scan(cursor, ...o) {
    const up = o.map((x) => String(x).toUpperCase());
    const im = up.indexOf('MATCH'), ic = up.indexOf('COUNT');
    const p = im >= 0 ? String(o[im + 1]) : '*';
    const cnt = ic >= 0 ? Number(o[ic + 1]) : this.cursorPage;
    const re = new RegExp('^' + p.replace(/[.+^$()|{}[\\]\\\\]/g, '\\\\$&').replace(/\\*/g, '.*').replace(/\\?/g, '.') + '$');
    const all = [...this.data.keys()].sort();
    const c = Number(cursor);
    // like real SCAN: a page may repeat the last key of the previous page (dedupe if it matters)
    const from = c === 0 ? 0 : Math.max(0, c - 1);
    const page = all.slice(from, c + cnt);
    const next = c + cnt >= all.length ? '0' : String(c + cnt);
    return [next, page.filter((k) => this._live(k) && re.test(k))];
  },
};
FakeRedis.names = Object.keys(FakeRedis.ops).filter((n) => n[0] !== '_');
for (const n of FakeRedis.names) FakeRedis.prototype[n] = function (...a) { return this._send(n, a); };
// await sleep(ms) — wait on the virtual clock (the grader jumps straight to the next timer, nothing really sleeps)
var sleep = typeof sleep === 'function' ? sleep : (ms) => new Promise((ok) => setTimeout(ok, ms));
`;

/** req/res GIẢ kiểu Express (cho middleware / handler) — nạp kèm như một tệp giả. */
export const FAKE_HTTP = `// fake-http.js — PROVIDED by the exercise (loaded before answer.js). Express-like req / res for handlers.
//   const req = mkReq({ ip, headers, body, params, user });
//   const res = mkRes();   res.status(429).set('Retry-After', '12').json({ … })   → res.statusCode · res.headers · res.body
//   const next = mkNext(); … next.calls → ['next()'] or ['next(<message>)']
function mkReq(o) { o = o || {}; return { ip: o.ip || '127.0.0.1', method: o.method || 'GET', path: o.path || '/', headers: o.headers || {}, body: o.body, params: o.params || {}, user: o.user || null }; }
function mkRes() {
  const r = { statusCode: 200, headers: {}, body: undefined, sent: 0 };
  r.status = (s) => { r.statusCode = s; return r; };
  r.set = (k, v) => { r.headers[String(k).toLowerCase()] = String(v); return r; };
  r.setHeader = r.set;
  r.json = (b) => { r.body = b; r.sent++; return r; };
  r.send = (b) => { r.body = b; r.sent++; return r; };
  r.end = () => { r.sent++; return r; };
  return r;
}
function mkNext() { const n = (err) => { n.calls.push(err === undefined ? 'next()' : 'next(' + (err && err.message ? err.message : String(err)) + ')'); }; n.calls = []; return n; }
var sleep = typeof sleep === 'function' ? sleep : (ms) => new Promise((ok) => setTimeout(ok, ms));
`;

/** CSDL giả: hàm truy vấn đắt, đếm số lần gọi. */
export const FAKE_DB = `// fake-db.js — PROVIDED by the exercise (loaded before answer.js).
// A slow "PostgreSQL": every call waits db.ms milliseconds (virtual clock) and is counted in db.calls.
function makeDb(opts) {
  opts = opts || {};
  const db = { ms: opts.ms == null ? 48 : opts.ms, calls: 0, rows: opts.rows || [], fail: 0 };
  db.wait = (v) => new Promise((ok, no) => setTimeout(() => (v instanceof Error ? no(v) : ok(v)), db.ms));
  // the leaderboard aggregate of lesson 12.2 — 48 ms on 500,000 notes
  db.leaderboard = () => { db.calls++; if (db.fail > 0) { db.fail--; return db.wait(new Error('db timeout')); } return db.wait(db.rows.slice(0, 20).map((r) => ({ ...r }))); };
  db.findUser = (id) => { db.calls++; const u = db.rows.find((r) => r.id === id); return db.wait(u ? { ...u } : null); };
  db.updateUser = (id, patch) => { db.calls++; const u = db.rows.find((r) => r.id === id); if (u) Object.assign(u, patch); return db.wait(u ? { ...u } : null); };
  return db;
}
var sleep = typeof sleep === 'function' ? sleep : (ms) => new Promise((ok) => setTimeout(ok, ms));
`;
