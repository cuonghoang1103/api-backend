/**
 * Bộ chạy test kiểu Vitest TỐI THIỂU cho máy chấm `mutation` (01/11/2026).
 *
 * `RUNNER_SRC` là JS thuần (ES2017, không backtick, không `${`) — chạy được ở ba chỗ:
 *   - Worker blob của trang web (CSP web có 'unsafe-eval') — chamMutation.ts;
 *   - worker HỘP CÁT của app desktop (CSP riêng cho eval, không mạng) — cùng mã;
 *   - Node `vm` trong test đơn vị (mutation.test.ts).
 * Nó gắn `globalThis.__ctMutation = { chay }`. `chay({ files, tepTest, tranTestMs })`:
 *   1. biến đổi ES modules (import/export) ⇒ hàm + sổ module (không cần import(blob:) — app chặn);
 *   2. nạp từng tệp test (describe/it chạy đồng bộ lúc nạp, như Vitest);
 *   3. chạy từng test: beforeEach → test (await, trần `tranTestMs`) → afterEach;
 *      requireAssertions như cấu hình khoá Testing: test không có expect nào ⇒ ĐỎ.
 *   Trả { tests: [{ ten, dat, loi? }], loiNap? }.
 *
 * API: describe/it/test (+ .each, .skip, .only, .todo), beforeEach/afterEach/beforeAll/afterAll,
 * expect(x).<matcher> với .not / .resolves / .rejects, expect.soft, expect.assertions/hasAssertions.
 * Matcher: toBe toEqual toStrictEqual toMatchObject toThrow(toThrowError) toBeCloseTo toBeTruthy toBeFalsy
 * toBeNull toBeUndefined toBeDefined toBeNaN toContain toContainEqual toHaveLength toHaveProperty toMatch
 * toBeGreaterThan(OrEqual) toBeLessThan(OrEqual) toBeInstanceOf toBeTypeOf + toHaveBeenCalled(Times/With/LastCalledWith/
 * NthCalledWith) toHaveReturned(With); so khớp bất đối xứng expect.any/anything/stringContaining/stringMatching/
 * objectContaining/arrayContaining/closeTo; it.fails. Matcher khác ⇒ lỗi nói rõ.
 * `vi`: fn, spyOn, clear/reset/restoreAllMocks, useFakeTimers/useRealTimers, setSystemTime (Date giả),
 * advanceTimersByTime(Async), runAllTimers(Async), runOnlyPendingTimers(Async), advanceTimersToNextTimer(Async).
 * `fast-check` THU GỌN (integer/nat/boolean/constantFrom/oneof/tuple/record/array/string/double, map/filter/chain,
 * property/asyncProperty/assert): hạt giống cố định 42 + giá trị biên đi trước ⇒ chấm lặp lại được; không thu nhỏ phản ví dụ.
 * Đủ để chạy bộ test tham khảo của khoá Testing Ch1–Ch2 (10 đề, 58/58 đột biến — đo 01/11/2026).
 */
export const RUNNER_SRC = String.raw`
(function (G) {
  'use strict';
  var evalToanCuc = (0, eval);
  var _Promise = Promise, _Date = G.Date, _setTimeout = G.setTimeout, _clearTimeout = G.clearTimeout;
  var GOC_HEN = { setTimeout: G.setTimeout, clearTimeout: G.clearTimeout, setInterval: G.setInterval, clearInterval: G.clearInterval, Date: G.Date };
  function laBatDx(v) { return !!v && typeof v === 'object' && v.__batDoiXung === true; }

  // ── in giá trị cho thông báo lỗi ──
  function inGT(v, sau) {
    sau = sau || 0;
    if (typeof v === 'string') return sau ? "'" + v + "'" : "'" + v + "'";
    if (v === undefined) return 'undefined';
    if (v === null) return 'null';
    if (typeof v === 'number') return Object.is(v, -0) ? '-0' : String(v);
    if (typeof v === 'bigint') return String(v) + 'n';
    if (typeof v === 'boolean' || typeof v === 'symbol') return String(v);
    if (typeof v === 'function') return v._isMockFunction ? '[MockFunction ' + (v.getMockName() || 'vi.fn()') + ']' : '[Function ' + (v.name || 'anonymous') + ']';
    if (laBatDx(v)) return v.ten;
    if (v instanceof Error) return v.name + ': ' + v.message;
    if (v instanceof _Date) return 'Date(' + (isNaN(v) ? 'Invalid' : v.toISOString()) + ')';
    if (v instanceof RegExp) return String(v);
    if (sau > 3) return Array.isArray(v) ? '[…]' : '{…}';
    if (Array.isArray(v)) return '[' + v.map(function (x) { return inGT(x, sau + 1); }).join(', ') + ']';
    if (v instanceof Map) return 'Map {' + Array.from(v).map(function (p) { return inGT(p[0], sau + 1) + ' => ' + inGT(p[1], sau + 1); }).join(', ') + '}';
    if (v instanceof Set) return 'Set {' + Array.from(v).map(function (x) { return inGT(x, sau + 1); }).join(', ') + '}';
    var k = Object.keys(v);
    var s = '{ ' + k.map(function (x) { return x + ': ' + inGT(v[x], sau + 1); }).join(', ') + ' }';
    return k.length ? s : '{}';
  }
  function ngan(s) { s = String(s); return s.length > 300 ? s.slice(0, 297) + '...' : s; }

  // ── so sánh sâu (toEqual / toStrictEqual) ──
  function laObj(v) { return v !== null && typeof v === 'object'; }
  function bang(a, b, chat, dangDi) {
    if (Object.is(a, b)) return true;
    if (laBatDx(b)) return b.khop(a);
    if (laBatDx(a)) return a.khop(b);
    if (!laObj(a) || !laObj(b)) return false;
    dangDi = dangDi || [];
    for (var i = 0; i < dangDi.length; i++) if (dangDi[i][0] === a && dangDi[i][1] === b) return true;
    dangDi = dangDi.concat([[a, b]]);
    if (chat && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) return false;
    if (Array.isArray(a) !== Array.isArray(b)) return false;
    if (a instanceof _Date || b instanceof _Date) return a instanceof _Date && b instanceof _Date && Object.is(a.getTime(), b.getTime());
    if (a instanceof RegExp || b instanceof RegExp) return a instanceof RegExp && b instanceof RegExp && String(a) === String(b);
    if (a instanceof Error && b instanceof Error) return a.name === b.name && a.message === b.message;
    if (a instanceof Map || b instanceof Map) {
      if (!(a instanceof Map && b instanceof Map) || a.size !== b.size) return false;
      var ok = true;
      a.forEach(function (v, k) { if (!b.has(k) || !bang(v, b.get(k), chat, dangDi)) ok = false; });
      return ok;
    }
    if (a instanceof Set || b instanceof Set) {
      if (!(a instanceof Set && b instanceof Set) || a.size !== b.size) return false;
      var ok2 = true;
      a.forEach(function (v) { if (!b.has(v)) { var co = false; b.forEach(function (w) { if (bang(v, w, chat, dangDi)) co = true; }); if (!co) ok2 = false; } });
      return ok2;
    }
    if (Array.isArray(a)) {
      if (a.length !== b.length) return false;
      for (var j = 0; j < a.length; j++) {
        if (chat && ((j in a) !== (j in b))) return false;
        if (!bang(a[j], b[j], chat, dangDi)) return false;
      }
      return true;
    }
    var ka = Object.keys(a), kb = Object.keys(b);
    if (!chat) {
      ka = ka.filter(function (k) { return a[k] !== undefined; });
      kb = kb.filter(function (k) { return b[k] !== undefined; });
    }
    if (ka.length !== kb.length) return false;
    for (var m = 0; m < ka.length; m++) {
      var key = ka[m];
      if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
      if (!bang(a[key], b[key], chat, dangDi)) return false;
    }
    return true;
  }
  function khopMot(nhan, mau) {
    // toMatchObject: mọi khoá của mẫu có trong nhận (đệ quy); mảng so từng phần tử.
    if (laBatDx(mau)) return mau.khop(nhan);
    if (Array.isArray(mau)) return Array.isArray(nhan) && nhan.length === mau.length && mau.every(function (x, i) { return khopMot(nhan[i], x); });
    if (laObj(mau) && !(mau instanceof _Date) && !(mau instanceof RegExp)) {
      if (!laObj(nhan)) return false;
      return Object.keys(mau).every(function (k) { return k in Object(nhan) && khopMot(nhan[k], mau[k]); });
    }
    return bang(nhan, mau, false);
  }
  function layDuong(o, duong) {
    var p = Array.isArray(duong) ? duong : String(duong).replace(/\[(\d+)\]/g, '.$1').split('.').filter(function (x) { return x !== ''; });
    var cur = o;
    for (var i = 0; i < p.length; i++) {
      if (cur == null || !(p[i] in Object(cur))) return { co: false };
      cur = cur[p[i]];
    }
    return { co: true, gt: cur };
  }

  // ── trạng thái test đang chạy ──
  var hienTai = null; // { soExpect, loiMem: [], hua: [] }

  function LoiKhangDinh(msg) { var e = new Error(msg); e.name = 'AssertionError'; return e; }

  function dungExpect(nhan, opts) {
    var phu = !!opts.phu, mem = !!opts.mem, che = opts.che || null, loiSan = !!opts.loiSan; // che: 'resolves' | 'rejects' · loiSan: nhan LÀ lỗi đã ném (từ .rejects)
    function bao(dat, msgDung, msgPhu) {
      if (hienTai) hienTai.soExpect++;
      var ok = phu ? !dat : dat;
      if (ok) return;
      var e = LoiKhangDinh(phu ? msgPhu : msgDung);
      if (mem && hienTai) { hienTai.loiMem.push(e); return; }
      throw e;
    }
    var M = {
      toBe: function (mong) {
        var dat = Object.is(nhan, mong);
        var them = !dat && laObj(nhan) && laObj(mong) && bang(nhan, mong, true) ? ' — same content, different object: use toEqual for objects/arrays' : '';
        bao(dat, 'expected ' + inGT(nhan) + ' to be ' + inGT(mong) + ' // Object.is equality' + them, 'expected ' + inGT(nhan) + ' not to be ' + inGT(mong));
      },
      toEqual: function (mong) { bao(bang(nhan, mong, false), 'expected ' + inGT(nhan) + ' to deeply equal ' + inGT(mong), 'expected ' + inGT(nhan) + ' not to deeply equal ' + inGT(mong)); },
      toStrictEqual: function (mong) { bao(bang(nhan, mong, true), 'expected ' + inGT(nhan) + ' to strictly equal ' + inGT(mong), 'expected ' + inGT(nhan) + ' not to strictly equal ' + inGT(mong)); },
      toMatchObject: function (mong) { bao(khopMot(nhan, mong), 'expected ' + inGT(nhan) + ' to match object ' + inGT(mong), 'expected ' + inGT(nhan) + ' not to match object ' + inGT(mong)); },
      toBeCloseTo: function (mong, soChu) {
        if (soChu === undefined) soChu = 2;
        var dat;
        if (typeof nhan !== 'number' || typeof mong !== 'number') dat = false;
        else if (nhan === Infinity && mong === Infinity) dat = true;
        else if (nhan === -Infinity && mong === -Infinity) dat = true;
        else dat = Math.abs(mong - nhan) < Math.pow(10, -soChu) / 2;
        bao(dat, 'expected ' + inGT(nhan) + ' to be close to ' + inGT(mong) + ' (' + soChu + ' decimal digits, |diff| < ' + (Math.pow(10, -soChu) / 2) + ')', 'expected ' + inGT(nhan) + ' not to be close to ' + inGT(mong) + ' (' + soChu + ' digits)');
      },
      toBeTruthy: function () { bao(!!nhan, 'expected ' + inGT(nhan) + ' to be truthy', 'expected ' + inGT(nhan) + ' not to be truthy'); },
      toBeFalsy: function () { bao(!nhan, 'expected ' + inGT(nhan) + ' to be falsy', 'expected ' + inGT(nhan) + ' not to be falsy'); },
      toBeNull: function () { bao(nhan === null, 'expected ' + inGT(nhan) + ' to be null', 'expected ' + inGT(nhan) + ' not to be null'); },
      toBeUndefined: function () { bao(nhan === undefined, 'expected ' + inGT(nhan) + ' to be undefined', 'expected ' + inGT(nhan) + ' not to be undefined'); },
      toBeDefined: function () { bao(nhan !== undefined, 'expected ' + inGT(nhan) + ' to be defined', 'expected ' + inGT(nhan) + ' to be undefined'); },
      toBeNaN: function () { bao(typeof nhan === 'number' && isNaN(nhan), 'expected ' + inGT(nhan) + ' to be NaN', 'expected ' + inGT(nhan) + ' not to be NaN'); },
      toBeGreaterThan: function (n) { bao(nhan > n, 'expected ' + inGT(nhan) + ' to be greater than ' + inGT(n), 'expected ' + inGT(nhan) + ' not to be greater than ' + inGT(n)); },
      toBeGreaterThanOrEqual: function (n) { bao(nhan >= n, 'expected ' + inGT(nhan) + ' to be greater than or equal to ' + inGT(n), 'expected ' + inGT(nhan) + ' not to be greater than or equal to ' + inGT(n)); },
      toBeLessThan: function (n) { bao(nhan < n, 'expected ' + inGT(nhan) + ' to be less than ' + inGT(n), 'expected ' + inGT(nhan) + ' not to be less than ' + inGT(n)); },
      toBeLessThanOrEqual: function (n) { bao(nhan <= n, 'expected ' + inGT(nhan) + ' to be less than or equal to ' + inGT(n), 'expected ' + inGT(nhan) + ' not to be less than or equal to ' + inGT(n)); },
      toBeInstanceOf: function (C) { bao(typeof C === 'function' && nhan instanceof C, 'expected ' + inGT(nhan) + ' to be an instance of ' + (C && C.name), 'expected ' + inGT(nhan) + ' not to be an instance of ' + (C && C.name)); },
      toBeTypeOf: function (t) { bao(typeof nhan === t, 'expected ' + inGT(nhan) + ' to be type of ' + inGT(t), 'expected ' + inGT(nhan) + ' not to be type of ' + inGT(t)); },
      toContain: function (x) {
        var dat = typeof nhan === 'string' ? nhan.indexOf(x) >= 0 : (nhan != null && typeof nhan[Symbol.iterator] === 'function' && Array.from(nhan).some(function (y) { return Object.is(y, x); }));
        bao(dat, 'expected ' + inGT(nhan) + ' to contain ' + inGT(x), 'expected ' + inGT(nhan) + ' not to contain ' + inGT(x));
      },
      toContainEqual: function (x) {
        var dat = nhan != null && typeof nhan[Symbol.iterator] === 'function' && Array.from(nhan).some(function (y) { return bang(y, x, false); });
        bao(dat, 'expected ' + inGT(nhan) + ' to contain equal ' + inGT(x), 'expected ' + inGT(nhan) + ' not to contain equal ' + inGT(x));
      },
      toHaveLength: function (n) { var l = nhan != null ? nhan.length : undefined; bao(l === n, 'expected ' + inGT(nhan) + ' to have length ' + n + ' (got ' + l + ')', 'expected ' + inGT(nhan) + ' not to have length ' + n); },
      toHaveProperty: function (duong, gt) {
        var r = layDuong(nhan, duong);
        var coGt = arguments.length > 1;
        var dat = r.co && (!coGt || bang(r.gt, gt, false));
        bao(dat, 'expected ' + inGT(nhan) + ' to have property "' + duong + '"' + (coGt ? ' = ' + inGT(gt) + (r.co ? ' (got ' + inGT(r.gt) + ')' : '') : ''), 'expected ' + inGT(nhan) + ' not to have property "' + duong + '"' + (coGt ? ' = ' + inGT(gt) : ''));
      },
      toMatch: function (re) {
        var dat = typeof nhan === 'string' && (re instanceof RegExp ? re.test(nhan) : nhan.indexOf(String(re)) >= 0);
        bao(dat, 'expected ' + inGT(nhan) + ' to match ' + inGT(re), 'expected ' + inGT(nhan) + ' not to match ' + inGT(re));
      },
      toThrow: function (mong) {
        var nem = false, loi;
        if (loiSan) { nem = true; loi = nhan; }
        else {
          if (typeof nhan !== 'function') {
            if (hienTai) hienTai.soExpect++;
            throw LoiKhangDinh('toThrow() expects a FUNCTION, got ' + inGT(nhan) + ' — wrap the call: expect(() => fn(...)).toThrow()');
          }
          try { nhan(); } catch (e) { nem = true; loi = e; }
        }
        var tenMong = mong === undefined ? '' : (typeof mong === 'function' ? mong.name : inGT(mong));
        if (!nem) { bao(false, 'expected function to throw' + (tenMong ? ' ' + tenMong : '') + ', but it did not throw', ''); return; }
        var thongDiep = loi && typeof loi === 'object' && 'message' in loi ? String(loi.message) : String(loi);
        var dat = true;
        if (mong === undefined) dat = true;
        else if (typeof mong === 'string') dat = thongDiep.indexOf(mong) >= 0;
        else if (mong instanceof RegExp) dat = mong.test(thongDiep);
        else if (typeof mong === 'function') dat = loi instanceof mong;
        else if (mong instanceof Error) dat = thongDiep === mong.message;
        else if (laObj(mong) && 'message' in mong) dat = thongDiep === String(mong.message);
        bao(dat, 'expected function to throw ' + tenMong + ', but it threw ' + inGT(loi), 'expected function not to throw ' + (tenMong || 'an error') + ', but it threw ' + inGT(loi));
      },
    };
    function canMock() {
      if (typeof nhan !== 'function' || !nhan._isMockFunction) {
        if (hienTai) hienTai.soExpect++;
        throw LoiKhangDinh(inGT(nhan) + ' is not a spy or a call to it — create it with vi.fn() or vi.spyOn()');
      }
      return nhan.mock;
    }
    function inGoi(m) { return m.calls.length ? m.calls.map(function (c) { return '(' + c.map(function (x) { return inGT(x); }).join(', ') + ')'; }).join(' ') : 'no calls'; }
    M.toHaveBeenCalled = function () { var m = canMock(); bao(m.calls.length > 0, 'expected spy to be called at least once', 'expected spy not to be called, but it was called ' + m.calls.length + ' times'); };
    M.toHaveBeenCalledTimes = function (n) { var m = canMock(); bao(m.calls.length === n, 'expected spy to be called ' + n + ' times, but got ' + m.calls.length + ' times', 'expected spy not to be called ' + n + ' times'); };
    M.toHaveBeenCalledOnce = function () { M.toHaveBeenCalledTimes(1); };
    M.toHaveBeenCalledWith = function () { var a = Array.prototype.slice.call(arguments), m = canMock(); bao(m.calls.some(function (c) { return bang(c, a, false); }), 'expected spy to be called with ' + inGT(a) + ' — calls: ' + inGoi(m), 'expected spy not to be called with ' + inGT(a)); };
    M.toHaveBeenLastCalledWith = function () { var a = Array.prototype.slice.call(arguments), m = canMock(); var c = m.calls[m.calls.length - 1]; bao(!!c && bang(c, a, false), 'expected last call to be ' + inGT(a) + ' — calls: ' + inGoi(m), 'expected last call not to be ' + inGT(a)); };
    M.toHaveBeenNthCalledWith = function (n) { var a = Array.prototype.slice.call(arguments, 1), m = canMock(); var c = m.calls[n - 1]; bao(!!c && bang(c, a, false), 'expected call #' + n + ' to be ' + inGT(a) + ' — calls: ' + inGoi(m), 'expected call #' + n + ' not to be ' + inGT(a)); };
    M.toHaveReturned = function () { var m = canMock(); bao(m.results.some(function (r) { return r.type === 'return'; }), 'expected spy to have returned', 'expected spy not to have returned'); };
    M.toHaveReturnedWith = function (v) { var m = canMock(); bao(m.results.some(function (r) { return r.type === 'return' && bang(r.value, v, false); }), 'expected spy to have returned ' + inGT(v), 'expected spy not to have returned ' + inGT(v)); };
    M.toThrowError = M.toThrow;
    var bocLai = {};
    Object.keys(M).forEach(function (ten) {
      bocLai[ten] = function () {
        var args = arguments;
        if (che) {
          var hua = _Promise.resolve(nhan).then(function (v) {
            if (che === 'rejects') throw LoiKhangDinh('expected promise to reject, but it resolved to ' + inGT(v));
            return dungExpect(v, { phu: phu, mem: mem })[ten].apply(null, args);
          }, function (e) {
            if (che === 'resolves') throw LoiKhangDinh('expected promise to resolve, but it rejected with ' + inGT(e));
            return dungExpect(e, { phu: phu, mem: mem, loiSan: ten === 'toThrow' || ten === 'toThrowError' })[ten].apply(null, args);
          });
          if (hienTai) { hienTai.soExpect++; hienTai.hua.push(hua); } // .resolves/.rejects = một khẳng định
          return hua;
        }
        return M[ten].apply(null, args);
      };
    });
    return new Proxy(bocLai, {
      get: function (t, k) {
        if (k === 'not') return dungExpect(nhan, { phu: !phu, mem: mem, che: che, loiSan: loiSan });
        if (k === 'resolves' || k === 'rejects') return dungExpect(nhan, { phu: phu, mem: mem, che: k });
        if (k === 'then') return undefined;
        if (typeof k === 'string' && !(k in t)) {
          return function () {
            throw new Error('Matcher "' + k + '" is not available in the browser grader (supported: ' + Object.keys(M).join(', ') + '). Snapshots are not graded here — assert the value explicitly.');
          };
        }
        return t[k];
      },
    });
  }
  function expect(nhan) { return dungExpect(nhan, {}); }
  expect.soft = function (nhan) { return dungExpect(nhan, { mem: true }); };
  expect.assertions = function (n) { if (hienTai) hienTai.canDung = n; };
  function batDx(ten, khop) { return { __batDoiXung: true, ten: ten, khop: khop }; }
  expect.anything = function () { return batDx('Anything', function (v) { return v != null; }); };
  expect.any = function (C) {
    return batDx('Any<' + (C && C.name) + '>', function (v) {
      if (C === Number) return typeof v === 'number' || v instanceof Number;
      if (C === String) return typeof v === 'string' || v instanceof String;
      if (C === Boolean) return typeof v === 'boolean' || v instanceof Boolean;
      if (C === Function) return typeof v === 'function';
      if (C === Object) return v !== null && typeof v === 'object';
      if (typeof C === 'function' && C.name === 'BigInt') return typeof v === 'bigint';
      return v != null && typeof C === 'function' && v instanceof C;
    });
  };
  expect.stringContaining = function (s) { return batDx('StringContaining ' + inGT(s), function (v) { return typeof v === 'string' && v.indexOf(s) >= 0; }); };
  expect.stringMatching = function (re) { var r = re instanceof RegExp ? re : new RegExp(re); return batDx('StringMatching ' + String(r), function (v) { return typeof v === 'string' && r.test(v); }); };
  expect.objectContaining = function (o) { return batDx('ObjectContaining ' + inGT(o), function (v) { return laObj(v) && Object.keys(o).every(function (k) { return k in v && bang(v[k], o[k], false); }); }); };
  expect.arrayContaining = function (a) { return batDx('ArrayContaining ' + inGT(a), function (v) { return Array.isArray(v) && a.every(function (x) { return v.some(function (y) { return bang(y, x, false); }); }); }); };
  expect.closeTo = function (n, d) { if (d === undefined) d = 2; return batDx('NumberCloseTo ' + n, function (v) { return typeof v === 'number' && Math.abs(v - n) < Math.pow(10, -d) / 2; }); };
  expect.hasAssertions = function () { if (hienTai) hienTai.canCo = true; };

  // ── cây describe / it ──
  var goc, nhomHt;
  function nhomMoi(ten, cha, che) { return { ten: ten, cha: cha, con: [], truocMoi: [], sauMoi: [], truocTat: [], sauTat: [], che: che || null }; }
  function themTest(ten, fn, opts) {
    if (typeof ten === 'function') { fn = ten; ten = fn.name || 'anonymous'; }
    nhomHt.con.push({ loai: 'test', ten: String(ten), fn: fn, che: opts.che || null, tran: opts.tran, phaiDo: !!opts.phaiDo });
  }
  function themNhom(ten, fn, che) {
    var n = nhomMoi(String(ten), nhomHt, che);
    nhomHt.con.push({ loai: 'nhom', nhom: n });
    var cu = nhomHt; nhomHt = n;
    try {
      var r = typeof fn === 'function' ? fn() : undefined;
      if (r && typeof r.then === 'function') throw new Error('describe() callback must not be async — put async code inside it()');
    } finally { nhomHt = cu; }
  }
  function dinhDang(mau, hang, idx) {
    var s = String(mau);
    if (laObj(hang) && !Array.isArray(hang)) {
      s = s.replace(/\$([A-Za-z_][\w.]*)/g, function (m, duong) { var r = layDuong(hang, duong); return r.co ? (typeof r.gt === 'string' ? r.gt : inGT(r.gt)) : m; });
    }
    var args = Array.isArray(hang) ? hang.slice() : [hang];
    s = s.replace(/%([sdifjoOp#%])/g, function (m, c) {
      if (c === '%') return '%';
      if (c === '#') return String(idx);
      if (!args.length) return m;
      var v = args.shift();
      if (c === 's') return typeof v === 'string' ? v : inGT(v);
      if (c === 'd' || c === 'i') return String(c === 'i' ? Math.trunc(Number(v)) : Number(v));
      if (c === 'f') return String(Number(v));
      return inGT(v);
    });
    return s;
  }
  function moiEach(themFn) {
    return function (bang1) {
      if (!Array.isArray(bang1)) throw new Error('.each expects an array of rows');
      return function (mau, fn, tran) {
        bang1.forEach(function (hang, idx) {
          var args = Array.isArray(hang) ? hang : [hang];
          themFn(dinhDang(mau, hang, idx), function () { return fn.apply(null, args); }, tran);
        });
      };
    };
  }
  function lamIt(che) {
    return function (ten, fn, tran) {
      var opts = { che: che };
      if (typeof tran === 'number') opts.tran = tran; else if (laObj(tran) && typeof tran.timeout === 'number') opts.tran = tran.timeout;
      if (laObj(fn) && typeof tran === 'function') { fn = tran; }
      themTest(ten, fn, opts);
    };
  }
  var it = lamIt(null);
  it.skip = lamIt('skip');
  it.only = lamIt('only');
  it.todo = function (ten) { themTest(ten, null, { che: 'todo' }); };
  it.each = moiEach(function (t, f, tr) { it(t, f, tr); });
  it.skip.each = moiEach(function (t, f, tr) { it.skip(t, f, tr); });
  it.only.each = moiEach(function (t, f, tr) { it.only(t, f, tr); });
  it.fails = function (ten, fn, tran) { themTest(ten, fn, { phaiDo: true, tran: typeof tran === 'number' ? tran : undefined }); };
  it.concurrent = it;
  var describe = function (ten, fn) { themNhom(ten, fn, null); };
  describe.skip = function (ten, fn) { themNhom(ten, fn, 'skip'); };
  describe.only = function (ten, fn) { themNhom(ten, fn, 'only'); };
  describe.todo = function () {};
  describe.each = moiEach(function (t, f) { describe(t, f); });
  describe.concurrent = describe;
  function hook(ten) { return function (fn) { nhomHt[ten].push(fn); }; }

  // ── vi: hàm giả (vi.fn / vi.spyOn) + đồng hồ giả (useFakeTimers / setSystemTime / advanceTimersByTime…) ──
  var moiMock = [];
  function taoMock(impl) {
    var macDinh = impl, mot = [], ten = '';
    var m = function () {
      var args = Array.prototype.slice.call(arguments);
      m.mock.calls.push(args); m.mock.lastCall = args; m.mock.instances.push(this);
      var f = mot.length ? mot.shift() : macDinh;
      try {
        var r = f ? f.apply(this, args) : undefined;
        m.mock.results.push({ type: 'return', value: r });
        return r;
      } catch (e) { m.mock.results.push({ type: 'throw', value: e }); throw e; }
    };
    m._isMockFunction = true;
    m.mock = { calls: [], results: [], instances: [], lastCall: undefined };
    m.mockImplementation = function (f) { macDinh = f; return m; };
    m.mockImplementationOnce = function (f) { mot.push(f); return m; };
    m.mockReturnValue = function (v) { return m.mockImplementation(function () { return v; }); };
    m.mockReturnValueOnce = function (v) { return m.mockImplementationOnce(function () { return v; }); };
    m.mockResolvedValue = function (v) { return m.mockImplementation(function () { return _Promise.resolve(v); }); };
    m.mockResolvedValueOnce = function (v) { return m.mockImplementationOnce(function () { return _Promise.resolve(v); }); };
    m.mockRejectedValue = function (e) { return m.mockImplementation(function () { return _Promise.reject(e); }); };
    m.mockRejectedValueOnce = function (e) { return m.mockImplementationOnce(function () { return _Promise.reject(e); }); };
    m.mockReturnThis = function () { return m.mockImplementation(function () { return this; }); };
    m.mockClear = function () { m.mock.calls = []; m.mock.results = []; m.mock.instances = []; m.mock.lastCall = undefined; return m; };
    m.mockReset = function () { m.mockClear(); macDinh = impl; mot = []; return m; };
    m.mockRestore = function () { m.mockReset(); if (m._traVe) m._traVe(); return m; };
    m.mockName = function (n) { ten = String(n); return m; };
    m.getMockName = function () { return ten; };
    m.getMockImplementation = function () { return macDinh; };
    moiMock.push(m);
    return m;
  }
  // đồng hồ giả: hẹn giờ trong một hàng đợi; Date đọc giờ giả
  var gia = null; // { bay, hen: [], soId }
  function DateGia() {}
  function caiDate(bay) {
    var R0 = GOC_HEN.Date;
    var D = function (a, b, c, d, e, f, g) {
      if (!(this instanceof D)) return new R0(gia ? gia.bay : R0.now()).toString();
      var n = arguments.length;
      var x = n === 0 ? new R0(gia ? gia.bay : R0.now()) : n === 1 ? new R0(a) : new R0(a, b, c === undefined ? 1 : c, d || 0, e || 0, f || 0, g || 0);
      Object.setPrototypeOf(x, D.prototype);
      return x;
    };
    D.prototype = Object.create(R0.prototype, { constructor: { value: D, writable: true, configurable: true } });
    D.now = function () { return gia ? gia.bay : R0.now(); };
    D.UTC = R0.UTC; D.parse = R0.parse;
    G.Date = D;
    void bay;
  }
  function chayHenDen(dich) {
    for (var dem = 0; dem < 100000; dem++) {
      var ke = gia.hen.filter(function (h) { return h.luc <= dich; }).sort(function (a, b) { return a.luc - b.luc || a.id - b.id; })[0];
      if (!ke) break;
      chayMotHen(ke);
    }
    gia.bay = Math.max(gia.bay, dich);
  }
  function chayMotHen(h) {
    gia.bay = Math.max(gia.bay, h.luc);
    if (h.lap) h.luc = gia.bay + h.lap; else gia.hen.splice(gia.hen.indexOf(h), 1);
    if (typeof h.fn === 'function') h.fn.apply(null, h.args);
  }
  function henSom() { return gia.hen.slice().sort(function (a, b) { return a.luc - b.luc || a.id - b.id; })[0]; }
  function nhuong() { return new _Promise(function (r) { _setTimeout(r, 0); }); }
  async function chayHenDenAsync(dich) {
    await nhuong();
    for (var dem = 0; dem < 100000; dem++) {
      var ke = gia.hen.filter(function (h) { return h.luc <= dich; }).sort(function (a, b) { return a.luc - b.luc || a.id - b.id; })[0];
      if (!ke) break;
      chayMotHen(ke);
      await nhuong();
    }
    gia.bay = Math.max(gia.bay, dich);
  }
  function canGia(ten) { if (!gia || !gia.henBat) throw new Error('vi.' + ten + '() needs fake timers — call vi.useFakeTimers() first'); }
  var vi = {
    fn: function (impl) { return taoMock(impl); },
    spyOn: function (obj, key) {
      if (obj == null || typeof obj[key] !== 'function') throw new TypeError('vi.spyOn: ' + String(key) + ' is not a function on the given object');
      var goc = obj[key];
      if (goc._isMockFunction) return goc;
      var m = taoMock(function () { return goc.apply(this, arguments); });
      m._traVe = function () { obj[key] = goc; };
      obj[key] = m;
      return m;
    },
    isMockFunction: function (f) { return !!(f && f._isMockFunction); },
    clearAllMocks: function () { moiMock.forEach(function (m) { m.mockClear(); }); return vi; },
    resetAllMocks: function () { moiMock.forEach(function (m) { m.mockReset(); }); return vi; },
    restoreAllMocks: function () { moiMock.forEach(function (m) { if (m._traVe) m.mockRestore(); }); return vi; },
    useFakeTimers: function (cfg) {
      if (!gia) gia = { bay: GOC_HEN.Date.now(), hen: [], soId: 0 };
      if (cfg && cfg.now != null) gia.bay = +new GOC_HEN.Date(cfg.now);
      gia.henBat = true;
      G.setTimeout = function (fn, ms) { var h = { id: ++gia.soId, luc: gia.bay + Math.max(0, +ms || 0), fn: fn, args: Array.prototype.slice.call(arguments, 2), lap: 0 }; gia.hen.push(h); return h.id; };
      G.setInterval = function (fn, ms) { var d = Math.max(1, +ms || 0); var h = { id: ++gia.soId, luc: gia.bay + d, fn: fn, args: Array.prototype.slice.call(arguments, 2), lap: d }; gia.hen.push(h); return h.id; };
      G.clearTimeout = G.clearInterval = function (id) { if (!gia) return; var i = gia.hen.findIndex(function (h) { return h.id === id; }); if (i >= 0) gia.hen.splice(i, 1); };
      caiDate();
      return vi;
    },
    useRealTimers: function () {
      gia = null;
      G.setTimeout = GOC_HEN.setTimeout; G.clearTimeout = GOC_HEN.clearTimeout; G.setInterval = GOC_HEN.setInterval; G.clearInterval = GOC_HEN.clearInterval; G.Date = GOC_HEN.Date;
      return vi;
    },
    isFakeTimers: function () { return !!(gia && gia.henBat); },
    setSystemTime: function (t) {
      if (!gia) { gia = { bay: 0, hen: [], soId: 0, henBat: false }; caiDate(); }
      gia.bay = +new GOC_HEN.Date(t instanceof GOC_HEN.Date ? t.getTime() : t);
      return vi;
    },
    getMockedSystemTime: function () { return gia ? new GOC_HEN.Date(gia.bay) : null; },
    getRealSystemTime: function () { return GOC_HEN.Date.now(); },
    advanceTimersByTime: function (ms) { canGia('advanceTimersByTime'); chayHenDen(gia.bay + ms); return vi; },
    advanceTimersByTimeAsync: async function (ms) { canGia('advanceTimersByTimeAsync'); await chayHenDenAsync(gia.bay + ms); return vi; },
    advanceTimersToNextTimer: function () { canGia('advanceTimersToNextTimer'); var h = henSom(); if (h) chayMotHen(h); return vi; },
    advanceTimersToNextTimerAsync: async function () { canGia('advanceTimersToNextTimerAsync'); await nhuong(); var h = henSom(); if (h) { chayMotHen(h); await nhuong(); } return vi; },
    runOnlyPendingTimers: function () { canGia('runOnlyPendingTimers'); var cuoi = gia.hen.reduce(function (x, h) { return Math.max(x, h.luc); }, gia.bay); chayHenDen(cuoi); return vi; },
    runOnlyPendingTimersAsync: async function () { canGia('runOnlyPendingTimersAsync'); var cuoi = gia.hen.reduce(function (x, h) { return Math.max(x, h.luc); }, gia.bay); await chayHenDenAsync(cuoi); return vi; },
    runAllTimers: function () {
      canGia('runAllTimers');
      for (var i = 0; i < 10000; i++) { var h = henSom(); if (!h) return vi; chayMotHen(h); }
      throw new Error('Aborting after running 10000 timers, assuming an infinite loop!');
    },
    runAllTimersAsync: async function () {
      canGia('runAllTimersAsync');
      await nhuong();
      for (var i = 0; i < 10000; i++) { var h = henSom(); if (!h) return vi; chayMotHen(h); await nhuong(); }
      throw new Error('Aborting after running 10000 timers, assuming an infinite loop!');
    },
    getTimerCount: function () { return gia ? gia.hen.length : 0; },
    clearAllTimers: function () { if (gia) gia.hen = []; return vi; },
  };
  vi = new Proxy(vi, { get: function (t, k) {
    if (k in t || typeof k !== 'string' || k === 'then' || k === 'toJSON') return t[k];
    return function () { throw new Error('vi.' + k + '() is not available in the browser grader (supported: ' + Object.keys(t).join(', ') + ')'); };
  } });
  void DateGia;

  // ── fast-check thu gọn: sinh ngẫu nhiên có HẠT GIỐNG cố định (chấm lặp lại được) + giá trị biên đi trước; không thu nhỏ ──
  function ArbFc(sinh, bien) { this.sinh = sinh; this.bien = bien || []; }
  ArbFc.prototype.map = function (f) { var a = this; return new ArbFc(function (r) { return f(a.sinh(r)); }, a.bien.map(function (x) { return f(x); })); };
  ArbFc.prototype.filter = function (p) {
    var a = this;
    return new ArbFc(function (r) { for (var i = 0; i < 1000; i++) { var v = a.sinh(r); if (p(v)) return v; } throw new Error('fc.filter: too many rejected values'); }, a.bien.filter(function (x) { return p(x); }));
  };
  ArbFc.prototype.chain = function (f) { var a = this; return new ArbFc(function (r) { return f(a.sinh(r)).sinh(r); }); };
  function soNguyen(min, max) {
    var bien = [min, max, 0, min + 1, max - 1].filter(function (x, i, ds) { return x >= min && x <= max && ds.indexOf(x) === i; });
    return new ArbFc(function (r) { return min + Math.floor(r() * (max - min + 1)); }, bien);
  }
  var FC = {
    integer: function (o) { o = o || {}; return soNguyen(o.min == null ? -2147483648 : o.min, o.max == null ? 2147483647 : o.max); },
    nat: function (o) { var max = typeof o === 'number' ? o : o && o.max != null ? o.max : 2147483647; return soNguyen(0, max); },
    boolean: function () { return new ArbFc(function (r) { return r() < 0.5; }, [false, true]); },
    constant: function (v) { return new ArbFc(function () { return v; }, [v]); },
    constantFrom: function () { var ds = Array.prototype.slice.call(arguments); return new ArbFc(function (r) { return ds[Math.floor(r() * ds.length)]; }, ds.slice()); },
    oneof: function () { var ds = Array.prototype.slice.call(arguments); return new ArbFc(function (r) { return ds[Math.floor(r() * ds.length)].sinh(r); }); },
    tuple: function () { var ds = Array.prototype.slice.call(arguments); return new ArbFc(function (r) { return ds.map(function (a) { return a.sinh(r); }); }); },
    record: function (o) { return new ArbFc(function (r) { var x = {}; Object.keys(o).forEach(function (k) { x[k] = o[k].sinh(r); }); return x; }); },
    array: function (a, o) { o = o || {}; var lo = o.minLength || 0, hi = o.maxLength == null ? 10 : o.maxLength; return new ArbFc(function (r) { var n = lo + Math.floor(r() * (hi - lo + 1)), x = []; for (var i = 0; i < n; i++) x.push(a.sinh(r)); return x; }, lo === 0 ? [[]] : []); },
    string: function (o) { o = o || {}; var lo = o.minLength || 0, hi = o.maxLength == null ? 10 : o.maxLength; return new ArbFc(function (r) { var n = lo + Math.floor(r() * (hi - lo + 1)), s = ''; for (var i = 0; i < n; i++) s += String.fromCharCode(32 + Math.floor(r() * 95)); return s; }, lo === 0 ? [''] : []); },
    double: function (o) { o = o || {}; var lo = o.min == null ? -1e6 : o.min, hi = o.max == null ? 1e6 : o.max; return new ArbFc(function (r) { return lo + r() * (hi - lo); }, [lo, hi]); },
    property: function () { var ds = Array.prototype.slice.call(arguments); return { arbs: ds.slice(0, -1), pred: ds[ds.length - 1], bat: false }; },
    asyncProperty: function () { var ds = Array.prototype.slice.call(arguments); return { arbs: ds.slice(0, -1), pred: ds[ds.length - 1], bat: true }; },
    assert: function (prop, o) {
      o = o || {};
      var soLan = o.numRuns || 100, hat = o.seed == null ? 42 : o.seed;
      var r = (function (a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; })(hat);
      var soBien = prop.arbs.reduce(function (x, a) { return Math.max(x, a.bien.length); }, 0);
      function giaTri(i) { return prop.arbs.map(function (a) { return i < soBien && a.bien.length ? a.bien[i % a.bien.length] : a.sinh(r); }); }
      function hong(i, v, e) { return new Error('Property failed after ' + (i + 1) + ' tests\n{ seed: ' + hat + ' }\nCounterexample: ' + inGT(v) + (e ? '\nGot error: ' + (e && e.message ? e.message : String(e)) : '')); }
      if (!prop.bat) {
        for (var i = 0; i < soLan; i++) {
          var v = giaTri(i), kq, loi = null;
          try { kq = prop.pred.apply(null, v); } catch (e) { loi = e; }
          if (loi || kq === false) throw hong(i, v, loi);
        }
        return undefined;
      }
      return (async function () {
        for (var j = 0; j < soLan; j++) {
          var v2 = giaTri(j), kq2, loi2 = null;
          try { kq2 = await prop.pred.apply(null, v2); } catch (e) { loi2 = e; }
          if (loi2 || kq2 === false) throw hong(j, v2, loi2);
        }
      })();
    },
  };
  FC.default = FC;

  var VITEST = {
    describe: describe, it: it, test: it, expect: expect, suite: describe,
    beforeEach: hook('truocMoi'), afterEach: hook('sauMoi'), beforeAll: hook('truocTat'), afterAll: hook('sauTat'),
    vi: vi,
  };

  // ── ES modules ⇒ hàm (import/export viết lại; giữ số dòng) ──
  var DINH_DANH = /^[A-Za-z_$][\w$]*$/;
  function demDong(s) { return (s.match(/\n/g) || []).length; }
  function dem(s) { return new Array(demDong(s) + 1).join('\n'); }
  function bienDoi(ma, ten) {
    var xuat = [];
    // import ở đầu dòng HOẶC ngay sau dấu ; (nhiều import trên một dòng)
    var s = ma.replace(/(?<=^|;)([ \t]*)import\s+([\w$*{][\s\S]*?)\s+from\s*(['"])([^'"\n]+)\3[ \t]*;?/gm, function (m, sp, mau, q, spec) {
      mau = mau.trim();
      var phan = [], mDef = /^([A-Za-z_$][\w$]*)\s*(,|$)/.exec(mau);
      var bien = '__m' + Math.random().toString(36).slice(2, 8);
      phan.push('const ' + bien + ' = __nhap(' + JSON.stringify(spec) + ');');
      var con = mau;
      if (mDef) { phan.push('const ' + mDef[1] + ' = ' + bien + '.default;'); con = mau.slice(mDef[0].length).trim(); }
      var mNs = /^\*\s+as\s+([A-Za-z_$][\w$]*)$/.exec(con);
      if (mNs) phan.push('const ' + mNs[1] + ' = ' + bien + ';');
      else if (con) {
        var mNg = /^\{([\s\S]*)\}$/.exec(con);
        if (!mNg) throw new SyntaxError('cannot read import in ' + ten + ': ' + m.trim());
        mNg[1].split(',').map(function (x) { return x.trim(); }).filter(Boolean).forEach(function (x) {
          var mm = /^([\w$]+)(?:\s+as\s+([\w$]+))?$/.exec(x);
          if (!mm) throw new SyntaxError('cannot read import name "' + x + '" in ' + ten);
          phan.push('const ' + (mm[2] || mm[1]) + ' = __lay(' + bien + ', ' + JSON.stringify(mm[1]) + ', ' + JSON.stringify(spec) + ');');
        });
      }
      return sp + phan.join(' ') + dem(m);
    });
    s = s.replace(/(?<=^|;)([ \t]*)import\s*(['"])([^'"\n]+)\2[ \t]*;?/gm, function (m, sp, q, spec) { return sp + '__nhap(' + JSON.stringify(spec) + ');' + dem(m); });
    s = s.replace(/^([ \t]*)export\s+default\s+/gm, '$1__xuat.default = ');
    s = s.replace(/^([ \t]*)export\s+(async\s+function\s*\*?|function\s*\*?|class|const|let|var)\s+([A-Za-z_$][\w$]*)/gm, function (m, sp, kw, name) {
      xuat.push([name, name]);
      if (/^(const|let|var)$/.test(kw)) {
        // export const A = 1, B = 2 — hiếm; chỉ bắt tên đầu (đề tự soạn không dùng dạng này)
      }
      return sp + kw + ' ' + name;
    });
    s = s.replace(/^[ \t]*export\s*\{([^}]*)\}[ \t]*;?/gm, function (m, ds) {
      ds.split(',').map(function (x) { return x.trim(); }).filter(Boolean).forEach(function (x) {
        var mm = /^([\w$]+)(?:\s+as\s+([\w$]+))?$/.exec(x);
        if (mm) xuat.push([mm[1], mm[2] || mm[1]]);
      });
      return dem(m);
    });
    if (/^[ \t]*export\s/m.test(s)) throw new SyntaxError('unsupported export form in ' + ten + ' (use export function / export const / export { a, b })');
    var cuoi = xuat.map(function (p) { return 'Object.defineProperty(__xuat, ' + JSON.stringify(p[1]) + ', { enumerable: true, get: function () { return ' + p[0] + '; } });'; }).join(' ');
    return '(function (__nhap, __lay, __xuat) { "use strict";\n' + s + '\n;' + cuoi + '\n})\n//# sourceURL=' + ten;
  }
  function giai(spec, tu) {
    if (!/^\.{1,2}\//.test(spec)) return null;
    var phan = tu.split('/').slice(0, -1);
    spec.split('/').forEach(function (p) {
      if (p === '.' || p === '') return;
      if (p === '..') phan.pop(); else phan.push(p);
    });
    return phan.join('/');
  }

  async function chay(d) {
    var files = d.files || {};
    var tepTest = d.tepTest || [];
    var tranTestMs = d.tranTestMs || 2000;
    goc = nhomMoi('', null); nhomHt = goc;
    var soModule = {}, dangNap = {};
    function nap(duong) {
      if (soModule[duong]) return soModule[duong];
      if (dangNap[duong]) throw new Error('circular import through ' + duong + ' is not supported by the browser grader');
      if (files[duong] == null) throw new Error('Cannot find module ' + duong);
      dangNap[duong] = true;
      var xuat = {};
      soModule[duong] = xuat;
      var fn = evalToanCuc(bienDoi(String(files[duong]), duong));
      fn(function (spec) {
        if (spec === 'vitest') return VITEST;
        if (spec === 'fast-check') return FC;
        var p = giai(spec, duong);
        if (p == null) throw new Error('Cannot import "' + spec + '" — only "vitest" and relative paths (./file.js) to files of this exercise');
        if (files[p] == null && files[p + '.js'] != null) p = p + '.js';
        return nap(p);
      }, function (m, ten, spec) {
        if (!(ten in m)) throw new SyntaxError('The requested module ' + JSON.stringify(spec) + ' does not provide an export named ' + JSON.stringify(ten));
        return m[ten];
      }, xuat);
      dangNap[duong] = false;
      return xuat;
    }
    try {
      for (var i = 0; i < tepTest.length; i++) nap(tepTest[i]);
    } catch (e) {
      return { tests: [], loiNap: (e && e.name ? e.name + ': ' : '') + (e && e.message ? e.message : String(e)) };
    }

    // .only ⇒ chỉ chạy các test/nhóm only (như Vitest trong một tệp)
    function coOnly(n) { return n.con.some(function (c) { return c.loai === 'test' ? c.che === 'only' : (c.nhom.che === 'only' || coOnly(c.nhom)); }); }
    var locOnly = coOnly(goc);

    var ketQua = [];
    async function chayHook(ds) { for (var i = 0; i < ds.length; i++) await ds[i](); }
    function chuoiTruoc(n) { var ds = []; for (var x = n; x; x = x.cha) ds.unshift(x); return ds; }
    async function chayMot(t, n, tenDay) {
      var ctx = { soExpect: 0, loiMem: [], hua: [], canDung: null, canCo: false };
      hienTai = ctx;
      var loi = null;
      var tran = t.tran || tranTestMs;
      var hen;
      try {
        var day = chuoiTruoc(n);
        for (var a = 0; a < day.length; a++) await chayHook(day[a].truocMoi);
        var r = t.fn();
        var cho = _Promise.resolve(r).then(function () { return _Promise.all(ctx.hua); });
        await _Promise.race([cho, new _Promise(function (_, rej) { hen = _setTimeout(function () { rej(new Error('Test timed out in ' + tran + 'ms')); }, tran); })]);
        for (var b = day.length - 1; b >= 0; b--) await chayHook(day[b].sauMoi);
        if (ctx.loiMem.length) loi = ctx.loiMem[0];
        else if (ctx.canDung != null && ctx.soExpect !== ctx.canDung) loi = LoiKhangDinh('expected ' + ctx.canDung + ' assertions to be called but received ' + ctx.soExpect);
        else if (ctx.soExpect === 0) loi = LoiKhangDinh('expected any number of assertions, but got none — a test without expect() always passes (requireAssertions)');
      } catch (e) { loi = e; }
      if (hen) _clearTimeout(hen);
      hienTai = null;
      if (t.phaiDo) loi = loi ? null : LoiKhangDinh('expected this test to fail (it.fails), but it passed');
      ketQua.push({ ten: tenDay, dat: !loi, loi: loi ? ngan((loi && loi.name && loi.name !== 'AssertionError' ? loi.name + ': ' : '') + (loi && loi.message !== undefined ? loi.message : String(loi))) : undefined });
    }
    async function di(n, ten, boQua, trongOnly) {
      var dangOnly = trongOnly || n.che === 'only';
      var bo = boQua || n.che === 'skip';
      var coTest = false;
      (function quet(x) { x.con.forEach(function (c) { if (c.loai === 'test') coTest = true; else quet(c.nhom); }); })(n);
      if (!bo && coTest) {
        try { await chayHook(n.truocTat); } catch (e) { ketQua.push({ ten: (ten || 'beforeAll'), dat: false, loi: 'beforeAll failed: ' + ngan(e && e.message) }); return; }
      }
      for (var i = 0; i < n.con.length; i++) {
        var c = n.con[i];
        if (c.loai === 'nhom') { await di(c.nhom, (ten ? ten + ' › ' : '') + c.nhom.ten, bo, dangOnly); continue; }
        if (bo || c.che === 'skip' || c.che === 'todo' || typeof c.fn !== 'function') continue;
        if (locOnly && !dangOnly && c.che !== 'only') continue;
        await chayMot(c, n, (ten ? ten + ' › ' : '') + c.ten);
      }
      if (!bo && coTest) { try { await chayHook(n.sauTat); } catch (e) { /* afterAll lỗi: bỏ qua */ } }
    }
    await di(goc, '', false, false);
    return { tests: ketQua };
  }

  G.__ctMutation = { chay: chay, bienDoi: bienDoi, bang: bang };
})(globalThis);
`;
