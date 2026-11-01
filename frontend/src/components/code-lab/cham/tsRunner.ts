/**
 * Máy chấm `ts` (TypeScript — khoá TypeScript, 01/11/2026) — HAI bộ chạy dạng chuỗi JS thuần (ES2017, không backtick,
 * không `${`), chạy được ở ba nơi như mutationRunner: Worker blob trên web · worker HỘP CÁT của app desktop · Node `vm`.
 *
 * 1. TS_KIEU_SRC — tầng KIỂU. Cần `ts` = TypeScript 6.0.3 (lib/typescript.js tự lưu ở /vendor/typescript-6.0.3/, nạp
 *    LƯỜI khi mở đề `ts`) + `lib` = { đường ảo: .d.ts } (lib-ts.json: lib.es2024.full + mọi lib nó kéo theo,
 *    @types/node 22.20.5, undici-types). Dựng `ts.createProgram` với một CompilerHost BỘ NHỚ đúng như
 *    `tsc -p` của scripts/ts/kiem-de-ts.mjs: thư mục ảo `/p` có package.json `"type": "module"` (nodenext ⇒ tệp .ts là
 *    ESM), tsconfig chuẩn của khoá (testsJson.tsconfig). Gắn `globalThis.__CL_TS__ = { khoiTao, kiemKieu, dich }`.
 *      kiemKieu({ tsconfig, hoc, coDinh, kiem }) ⇒ [{ i, dat, thay }] cho các kiểm tầng kiểu:
 *        sach            tsc trên tệp người học + `tep` ⇒ 0 lỗi
 *        phai-loi        dòng `dong` của `tep` PHẢI có lỗi mang một trong các mã `ma` (đột biến tầng kiểu)
 *        khong-loi-la    các dòng KHÁC của `tep` (không có `// expect TS…`) ⇒ 0 lỗi
 *        co-ma / chi-ma  (đề "đọc lỗi") tsc trên tệp người học phải có mã `ma` / chỉ được có các mã trong `ma`
 *        cam             regex cấm trong tệp người học (any, @ts-ignore, as …)
 *      dich({ tsconfig, tep }) ⇒ { js: { đường: mã CommonJS } } — ts.transpileModule cho tầng chạy.
 *    Tệp lib được phân tích MỘT lần rồi giữ (SourceFile dùng lại giữa các chương trình) ⇒ kiểm sau nhanh.
 * 2. TS_CHAY_SRC — tầng CHẠY (Worker NHẸ, mới cho mỗi lệnh, trang giữ giờ thật ⇒ vòng lặp vô hạn bị terminate()).
 *    `globalThis.__CL_TS_CHAY__.chay({ js, lenh })` mô phỏng `node --test test/x.test.ts` / `node src/main.ts`:
 *    bộ nạp module (require tương đối, đúng đường dẫn có đuôi .ts như Node ESM), shim `node:test` (test/it/describe/
 *    suite, hook, t.mock.method/fn, mock) + `node:assert/strict` (equal, deepEqual = deepStrictEqual, throws, rejects,
 *    match, ok, notEqual…), console bắt stdout/stderr, process.exit/exitCode. Trả { ma, stdout, stderr, tests, loi }.
 */
export const TS_PHIEN_BAN = '6.0.3';
export const TS_VENDOR_DUONG = `/vendor/typescript-${TS_PHIEN_BAN}/`;

export const TS_KIEU_SRC = String.raw`
(function (G) {
  'use strict';
  var ts = null, LIB = null, THU_MUC = null, libSf = {};
  var GOC = '/p/';
  var CAM_MAC_DINH = ['\\bany\\b', '@ts-ignore', '@ts-nocheck', '@ts-expect-error'];

  function khoiTao(tsApi, lib) {
    ts = tsApi; LIB = lib; THU_MUC = {};
    Object.keys(lib).forEach(function (k) {
      var p = k.split('/');
      for (var i = 1; i < p.length; i++) THU_MUC[p.slice(0, i).join('/') || '/'] = true;
    });
    return { phienBan: ts.version, soTep: Object.keys(lib).length };
  }

  function tuyChon(tsconfig) {
    var r = ts.convertCompilerOptionsFromJson(tsconfig || {}, GOC);
    var o = r.options;
    o.noEmit = true;
    return o;
  }

  function taoHost(tep, o) {
    var tatCa = {};
    Object.keys(tep).forEach(function (k) { tatCa[GOC + k] = tep[k]; });
    tatCa[GOC + 'package.json'] = '{"type":"module"}';
    var thuMuc = {};
    Object.keys(tatCa).forEach(function (k) {
      var p = k.split('/');
      for (var i = 1; i < p.length; i++) thuMuc[p.slice(0, i).join('/') || '/'] = true;
    });
    function doc(f) { return LIB[f] != null ? LIB[f] : tatCa[f]; }
    return {
      getSourceFile: function (f, ngonNgu) {
        if (LIB[f] != null) {
          if (!libSf[f]) libSf[f] = ts.createSourceFile(f, LIB[f], ngonNgu, false);
          return libSf[f];
        }
        var s = tatCa[f];
        return s == null ? undefined : ts.createSourceFile(f, s, ngonNgu, false);
      },
      getDefaultLibFileName: function (opt) { return '/lib/' + ts.getDefaultLibFileName(opt); },
      getDefaultLibLocation: function () { return '/lib/'; },
      writeFile: function () {},
      getCurrentDirectory: function () { return '/p'; },
      getDirectories: function () { return []; },
      fileExists: function (f) { return doc(f) != null; },
      readFile: function (f) { return doc(f); },
      directoryExists: function (d) { d = d.replace(/\/+$/, '') || '/'; return !!(THU_MUC[d] || thuMuc[d]); },
      realpath: function (f) { return f; },
      getCanonicalFileName: function (f) { return f; },
      useCaseSensitiveFileNames: function () { return true; },
      getNewLine: function () { return '\n'; }
    };
  }

  function loiCua(ds) {
    return ds.map(function (d) {
      var f = null, dong = null, cot = null;
      if (d.file) {
        f = d.file.fileName.indexOf(GOC) === 0 ? d.file.fileName.slice(GOC.length) : d.file.fileName;
        var vt = d.file.getLineAndCharacterOfPosition(d.start || 0);
        dong = vt.line + 1; cot = vt.character + 1;
      }
      return { f: f, dong: dong, cot: cot, ma: 'TS' + d.code, msg: ts.flattenDiagnosticMessageText(d.messageText, '\n') };
    });
  }
  function inLoi(e) { return (e.f ? e.f + '(' + e.dong + ',' + e.cot + '): ' : '') + e.ma + ': ' + e.msg; }

  /** Một phiên chấm: tệp cố định (tệp người học + tệp của đề), chương trình nhớ theo bộ tệp gốc. */
  function phien(tsconfig, tep) {
    var o = tuyChon(tsconfig);
    var host = taoHost(tep, o);
    var nho = {};
    return function chuongTrinh(goc) {
      var ds = goc.slice().sort();
      var k = ds.join('|');
      if (nho[k]) return nho[k];
      var p = ts.createProgram(ds.map(function (x) { return GOC + x; }), o, host);
      nho[k] = loiCua(ts.getPreEmitDiagnostics(p));
      return nho[k];
    };
  }

  function dongExpect(s) {
    var out = {};
    String(s || '').split('\n').forEach(function (t, i) {
      var m = /\/\/ expect (TS\d+)\s*$/.exec(t);
      if (m) out[i + 1] = m[1];
    });
    return out;
  }

  function ngan(s, n) { s = String(s); n = n || 400; return s.length > n ? s.slice(0, n - 3) + '...' : s; }
  function dsLoi(ds, n) {
    n = n || 3;
    return ds.slice(0, n).map(inLoi).join(' · ') + (ds.length > n ? ' · (+' + (ds.length - n) + ' more)' : '');
  }

  function kiemKieu(req) {
    var hoc = req.hoc || {}, coDinh = req.coDinh || {};
    var tep = {};
    Object.keys(hoc).forEach(function (k) { tep[k] = hoc[k]; });
    Object.keys(coDinh).forEach(function (k) { tep[k] = coDinh[k]; });
    var tepHoc = Object.keys(hoc).filter(function (k) { return /\.(ts|tsx|mts|cts)$/.test(k); });
    var ct = phien(req.tsconfig, tep);
    return (req.kiem || []).map(function (k) {
      var r;
      try { r = motKiem(k); } catch (e) { r = { dat: false, thay: 'grader error: ' + (e && e.message ? e.message : String(e)) }; }
      r.i = k.i;
      return r;
    });

    function motKiem(k) {
      var loai = k.kiem;
      if (loai === 'sach') {
        var ds = ct(tepHoc.concat(k.tep || []));
        if (!ds.length) return { dat: true, thay: 'tsc: 0 errors' };
        return { dat: false, thay: ngan('tsc: ' + ds.length + ' error(s) — ' + dsLoi(ds)) };
      }
      if (loai === 'phai-loi') {
        var ds2 = ct(tepHoc.concat([k.tep])).filter(function (e) { return e.f === k.tep && e.dong === k.dong; });
        var ma = [].concat(k.ma);
        var co = ds2.map(function (e) { return e.ma; });
        if (co.some(function (m) { return ma.indexOf(m) >= 0; })) {
          var e1 = ds2.filter(function (e) { return ma.indexOf(e.ma) >= 0; })[0];
          return { dat: true, thay: 'refused: ' + ngan(inLoi(e1), 300) };
        }
        if (!co.length) return { dat: false, thay: 'tsc ACCEPTS this line — your types still allow it (expected ' + ma[0] + ')' };
        return { dat: false, thay: ngan('wrong error on this line: ' + co.join(', ') + ' (expected ' + ma.join(' or ') + ') — ' + dsLoi(ds2, 1)) };
      }
      if (loai === 'khong-loi-la') {
        var mong = dongExpect(tep[k.tep]);
        var la = ct(tepHoc.concat([k.tep])).filter(function (e) { return e.f === k.tep && !mong[e.dong]; });
        if (!la.length) return { dat: true, thay: 'the valid lines of ' + k.tep + ' still compile' };
        return { dat: false, thay: ngan('a line that must compile now fails — ' + dsLoi(la)) };
      }
      if (loai === 'co-ma' || loai === 'chi-ma') {
        var ds3 = ct(tepHoc);
        var maCo = ds3.map(function (e) { return e.ma; });
        if (loai === 'co-ma') {
          var ma2 = [].concat(k.ma);
          var hit = ds3.filter(function (e) { return ma2.indexOf(e.ma) >= 0; })[0];
          return hit ? { dat: true, thay: ngan(inLoi(hit), 300) } : { dat: false, thay: 'no ' + ma2.join('/') + ' — tsc reports ' + (maCo.length ? Array.from(new Set(maCo)).join(', ') : 'no error') };
        }
        var duoc = [].concat(k.ma || []);
        var thua = ds3.filter(function (e) { return duoc.indexOf(e.ma) < 0; });
        if (!thua.length) return { dat: true, thay: maCo.length ? 'only ' + Array.from(new Set(maCo)).join(', ') : 'tsc: 0 errors' };
        return { dat: false, thay: ngan('unexpected error(s): ' + dsLoi(thua)) };
      }
      if (loai === 'cam') {
        var mau = (k.mau && k.mau.length ? k.mau : CAM_MAC_DINH);
        var gap = [];
        tepHoc.concat(Object.keys(hoc).filter(function (x) { return tepHoc.indexOf(x) < 0; })).forEach(function (f) {
          mau.forEach(function (m) {
            var re = new RegExp(m);
            var s = String(hoc[f]);
            var mm = re.exec(s);
            if (mm) {
              var dong = s.slice(0, mm.index).split('\n').length;
              gap.push(f + ':' + dong + ' /' + m + '/ ⇒ "' + mm[0] + '"');
            }
          });
        });
        if (!gap.length) return { dat: true, thay: 'no forbidden shortcut' };
        return { dat: false, thay: ngan('forbidden shortcut: ' + gap.slice(0, 3).join(' · ')) };
      }
      return { dat: false, thay: 'unknown check "' + loai + '"' };
    }
  }

  function dich(req) {
    var o = { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true, strict: true, alwaysStrict: true,
      verbatimModuleSyntax: false, isolatedModules: false, sourceMap: false, inlineSourceMap: false };
    var js = {};
    Object.keys(req.tep || {}).forEach(function (f) {
      if (!/\.(ts|mts|cts|js|mjs)$/.test(f)) return;
      var khong = /\.(ts|mts|cts)$/.test(f) ? cuPhapKhongXoaDuoc(String(req.tep[f]), f) : null;
      // Node 22 chạy .ts bằng BỎ KIỂU (strip-only): enum, namespace có mã, tham số thuộc tính, import =, export = ⇒ Node từ
      // chối nạp tệp (ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX). transpileModule thì dịch được hết ⇒ phải chặn lại cho giống Node.
      js[f] = khong
        ? 'throw Object.assign(new SyntaxError(' + JSON.stringify('TypeScript ' + khong.ten + ' is not supported in strip-only mode (' + f + ':' + khong.dong + ') — Node 22 runs .ts files by stripping types, it does not compile them') + '), { code: "ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX" });'
        : ts.transpileModule(String(req.tep[f]), { compilerOptions: o, fileName: f, reportDiagnostics: false }).outputText;
    });
    return { js: js };
  }

  /** Cú pháp TypeScript KHÔNG xoá được (Node strip-only từ chối) — null nếu không có. */
  function cuPhapKhongXoaDuoc(text, f) {
    var sf = ts.createSourceFile(f, text, ts.ScriptTarget.ES2022, true);
    var K = ts.SyntaxKind, gap = null;
    var THUOC = [K.PublicKeyword, K.PrivateKeyword, K.ProtectedKeyword, K.ReadonlyKeyword, K.OverrideKeyword];
    function moiTruong(n) { return !!(ts.getCombinedModifierFlags(n) & ts.ModifierFlags.Ambient); }
    function chiKieu(body) {
      if (!body) return true;
      if (body.kind === K.ModuleDeclaration) return chiKieu(body.body);
      return (body.statements || []).every(function (s) {
        return s.kind === K.InterfaceDeclaration || s.kind === K.TypeAliasDeclaration || (s.kind === K.ModuleDeclaration && chiKieu(s.body));
      });
    }
    function di(n) {
      if (gap) return;
      var ten = null;
      if (n.kind === K.EnumDeclaration && !moiTruong(n)) ten = 'enum';
      else if (n.kind === K.ModuleDeclaration && !moiTruong(n) && n.name.kind === K.Identifier && !chiKieu(n.body)) ten = 'namespace declaration';
      else if (n.kind === K.Parameter && n.parent && n.parent.kind === K.Constructor && (n.modifiers || []).some(function (m) { return THUOC.indexOf(m.kind) >= 0; })) ten = 'parameter property';
      else if (n.kind === K.ImportEqualsDeclaration && !n.isTypeOnly) ten = 'import equals declaration';
      else if (n.kind === K.ExportAssignment && n.isExportEquals) ten = 'export assignment';
      if (ten) { gap = { ten: ten, dong: sf.getLineAndCharacterOfPosition(n.getStart(sf)).line + 1 }; return; }
      ts.forEachChild(n, di);
    }
    di(sf);
    return gap;
  }

  G.__CL_TS__ = { khoiTao: khoiTao, kiemKieu: kiemKieu, dich: dich, dongExpect: dongExpect };
})(typeof globalThis !== 'undefined' ? globalThis : self);
`;

export const TS_CHAY_SRC = String.raw`
(function (G) {
  'use strict';
  var _Promise = Promise;
  var _setTimeout = G.setTimeout, _clearTimeout = G.clearTimeout, _setInterval = G.setInterval, _clearInterval = G.clearInterval;

  function chuanDuong(p) {
    var out = [];
    p.split('/').forEach(function (s) { if (!s || s === '.') return; if (s === '..') out.pop(); else out.push(s); });
    return out.join('/');
  }
  function thuMucCua(p) { var i = p.lastIndexOf('/'); return i < 0 ? '' : p.slice(0, i); }

  // ── util.inspect thu gọn (console.log, thông báo assert) ──
  function inspect(v, sau, trongObj) {
    sau = sau || 0;
    if (typeof v === 'string') return trongObj ? "'" + v.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n') + "'" : v;
    if (v === undefined) return 'undefined';
    if (v === null) return 'null';
    if (typeof v === 'number') return Object.is(v, -0) ? '-0' : String(v);
    if (typeof v === 'bigint') return String(v) + 'n';
    if (typeof v === 'boolean') return String(v);
    if (typeof v === 'symbol') return v.toString();
    if (typeof v === 'function') return v.prototype && /^class\s/.test(Function.prototype.toString.call(v)) ? '[class ' + (v.name || '(anonymous)') + ']' : '[Function: ' + (v.name || '(anonymous)') + ']';
    if (v instanceof Error) return (v.stack && sau === 0 ? String(v.name) + ': ' + v.message : '[' + v.name + ': ' + v.message + ']');
    if (v instanceof Date) return isNaN(v.getTime()) ? 'Invalid Date' : v.toISOString();
    if (v instanceof RegExp) return String(v);
    if (sau > 2) return Array.isArray(v) ? '[Array]' : '[Object]';
    var parts, mo, dong;
    if (Array.isArray(v)) {
      if (!v.length) return '[]';
      parts = v.map(function (x) { return inspect(x, sau + 1, true); });
      mo = '['; dong = ']';
    } else if (v instanceof Map) {
      parts = Array.from(v).map(function (p) { return inspect(p[0], sau + 1, true) + ' => ' + inspect(p[1], sau + 1, true); });
      mo = 'Map(' + v.size + ') {'; dong = '}';
      if (!parts.length) return mo + '}';
    } else if (v instanceof Set) {
      parts = Array.from(v).map(function (x) { return inspect(x, sau + 1, true); });
      mo = 'Set(' + v.size + ') {'; dong = '}';
      if (!parts.length) return mo + '}';
    } else {
      var k = Object.keys(v);
      if (!k.length) return '{}';
      parts = k.map(function (x) { return (/^[A-Za-z_$][\w$]*$/.test(x) ? x : "'" + x + "'") + ': ' + inspect(v[x], sau + 1, true); });
      mo = '{'; dong = '}';
    }
    var mot = mo + ' ' + parts.join(', ') + ' ' + dong;
    if (mot.length <= 72) return mot;
    var thut = new Array(sau + 2).join('  ');
    return mo + '\n' + thut + '  ' + parts.join(',\n' + thut + '  ') + '\n' + thut + dong;
  }
  function format(args) {
    args = Array.prototype.slice.call(args);
    var dau = '';
    if (typeof args[0] === 'string' && /%[sdifjoOc%]/.test(args[0])) {
      var f = args.shift();
      dau = f.replace(/%([sdifjoOc%])/g, function (m, c) {
        if (c === '%') return '%';
        if (!args.length) return m;
        var a = args.shift();
        if (c === 's') return typeof a === 'string' ? a : inspect(a, 1, true);
        if (c === 'd' || c === 'i') return c === 'i' ? String(parseInt(a, 10)) : String(Number(a));
        if (c === 'f') return String(parseFloat(a));
        if (c === 'j') { try { return JSON.stringify(a); } catch (e) { return '[Circular]'; } }
        if (c === 'c') return '';
        return inspect(a, 0, true);
      });
      return [dau].concat(args.map(function (a) { return inspect(a); })).join(' ');
    }
    return args.map(function (a) { return inspect(a); }).join(' ');
  }

  // ── assert/strict ──
  function AssertionError(o) {
    var e = new Error(o.message);
    e.name = 'AssertionError';
    e.code = 'ERR_ASSERTION';
    e.actual = o.actual; e.expected = o.expected; e.operator = o.operator;
    e.generatedMessage = !o.daCo;
    return e;
  }
  function loiThongDiep(msg, mac, o) {
    if (msg instanceof Error) throw msg;
    return AssertionError({ message: msg != null ? String(msg) : mac, actual: o.actual, expected: o.expected, operator: o.operator, daCo: msg != null });
  }
  function tag(v) { return Object.prototype.toString.call(v); }
  // so theo NHÃN (không instanceof) ⇒ đúng cả khi giá trị đến từ realm khác (vm của test, iframe)
  function laRegExp(v) { return tag(v) === '[object RegExp]'; }
  function laLoi(v) { return tag(v) === '[object Error]'; }
  function sauBang(a, b, dangDi) {
    if (Object.is(a, b)) return true;
    if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) {
      return false;
    }
    if (Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) return false;
    if (tag(a) !== tag(b)) return false;
    dangDi = dangDi || [];
    for (var i = 0; i < dangDi.length; i++) if (dangDi[i][0] === a && dangDi[i][1] === b) return true;
    dangDi = dangDi.concat([[a, b]]);
    var t = tag(a);
    if (t === '[object Date]') { var ta = Date.prototype.getTime.call(a), tb = Date.prototype.getTime.call(b); if (!Object.is(ta, tb)) return false; }
    if (t === '[object RegExp]' && (a.source !== b.source || a.flags !== b.flags || a.lastIndex !== b.lastIndex)) return false;
    if (t === '[object Error]' && (a.message !== b.message || a.name !== b.name)) return false;
    if ((t === '[object Number]' || t === '[object String]' || t === '[object Boolean]' || t === '[object BigInt]') && !Object.is(a.valueOf(), b.valueOf())) return false;
    if (Array.isArray(a) && a.length !== b.length) return false;
    if (t === '[object Map]') {
      if (a.size !== b.size) return false;
      var ok = true;
      a.forEach(function (v, k) {
        if (!ok) return;
        if (b.has(k)) { if (!sauBang(v, b.get(k), dangDi)) ok = false; return; }
        var co = false;
        b.forEach(function (v2, k2) { if (!co && sauBang(k, k2, dangDi) && sauBang(v, v2, dangDi)) co = true; });
        if (!co) ok = false;
      });
      if (!ok) return false;
    } else if (t === '[object Set]') {
      if (a.size !== b.size) return false;
      var ok2 = true;
      a.forEach(function (v) {
        if (!ok2 || b.has(v)) return;
        var co = false;
        b.forEach(function (w) { if (!co && sauBang(v, w, dangDi)) co = true; });
        if (!co) ok2 = false;
      });
      if (!ok2) return false;
    }
    var ka = Object.keys(a), kb = Object.keys(b);
    if (ka.length !== kb.length) return false;
    for (var j = 0; j < ka.length; j++) {
      if (!Object.prototype.propertyIsEnumerable.call(b, ka[j])) return false;
      if (!sauBang(a[ka[j]], b[ka[j]], dangDi)) return false;
    }
    var sa = Object.getOwnPropertySymbols(a).filter(function (s) { return Object.prototype.propertyIsEnumerable.call(a, s); });
    var sb = Object.getOwnPropertySymbols(b).filter(function (s) { return Object.prototype.propertyIsEnumerable.call(b, s); });
    if (sa.length !== sb.length) return false;
    for (var m = 0; m < sa.length; m++) if (!sauBang(a[sa[m]], b[sa[m]], dangDi)) return false;
    return true;
  }
  function kiemLoiNem(loi, mong, msg, ten) {
    if (mong === undefined) return;
    if (laRegExp(mong)) {
      if (mong.test(String(loi))) return;
      throw loiThongDiep(msg, 'The input did not match the regular expression ' + String(mong) + '. Input:\n\n' + inspect(String(loi), 0, true) + '\n', { actual: loi, expected: mong, operator: ten });
    }
    if (typeof mong === 'function') {
      if (mong.prototype !== undefined && loi instanceof mong) return;
      if (Error.isPrototypeOf(mong) || mong === Error || (mong.prototype && laLoi(mong.prototype))) {
        throw loiThongDiep(msg, 'The error is expected to be an instance of "' + mong.name + '". Received "' + (loi && loi.constructor ? loi.constructor.name : typeof loi) + '"\n\nError message:\n\n' + (loi && loi.message), { actual: loi, expected: mong, operator: ten });
      }
      var kq = mong.call({}, loi);
      if (kq !== true) throw loiThongDiep(msg, 'The "validate" function is expected to return "true". Received ' + inspect(kq, 0, true), { actual: loi, expected: mong, operator: ten });
      return;
    }
    if (typeof mong === 'object' && mong !== null) {
      var khoa = Object.keys(mong);
      if (laLoi(mong)) khoa.push('name', 'message');
      for (var i = 0; i < khoa.length; i++) {
        var k = khoa[i];
        var a = loi == null ? undefined : loi[k], e = mong[k];
        if (typeof a === 'string' && laRegExp(e) && e.test(a)) continue;
        if (!(loi != null && k in Object(loi)) || !sauBang(a, e)) {
          throw loiThongDiep(msg, 'Expected values to be strictly deep-equal:\n+ actual - expected\n\n  Comparison {\n+   ' + k + ': ' + inspect(a, 1, true) + '\n-   ' + k + ': ' + inspect(e, 1, true) + '\n  }', { actual: loi, expected: mong, operator: ten });
        }
      }
      return;
    }
  }
  function assert(v, msg) { return assert.ok(v, msg); }
  assert.ok = function (v, msg) {
    if (!v) throw loiThongDiep(msg, arguments.length === 0 ? 'No value argument passed to ' + "'assert.ok()'" : 'The expression evaluated to a falsy value:\n\n  assert.ok(' + inspect(v, 0, true) + ')\n', { actual: v, expected: true, operator: '==' });
  };
  assert.equal = assert.strictEqual = function (a, e, msg) {
    if (!Object.is(a, e)) throw loiThongDiep(msg, 'Expected values to be strictly equal:\n\n' + inspect(a, 0, true) + ' !== ' + inspect(e, 0, true) + '\n', { actual: a, expected: e, operator: 'strictEqual' });
  };
  assert.notEqual = assert.notStrictEqual = function (a, e, msg) {
    if (Object.is(a, e)) throw loiThongDiep(msg, 'Expected "actual" to be strictly unequal to: ' + inspect(e, 0, true), { actual: a, expected: e, operator: 'notStrictEqual' });
  };
  assert.deepEqual = assert.deepStrictEqual = function (a, e, msg) {
    if (!sauBang(a, e)) throw loiThongDiep(msg, 'Expected values to be strictly deep-equal:\n+ actual - expected\n\n+ ' + inspect(a, 0, true) + '\n- ' + inspect(e, 0, true), { actual: a, expected: e, operator: 'deepStrictEqual' });
  };
  assert.notDeepEqual = assert.notDeepStrictEqual = function (a, e, msg) {
    if (sauBang(a, e)) throw loiThongDiep(msg, 'Expected "actual" not to be strictly deep-equal to: ' + inspect(e, 0, true), { actual: a, expected: e, operator: 'notDeepStrictEqual' });
  };
  assert.throws = function (fn, mong, msg) {
    if (typeof fn !== 'function') { var te = new TypeError('The "fn" argument must be of type function. Received ' + inspect(fn, 0, true)); te.code = 'ERR_INVALID_ARG_TYPE'; throw te; }
    if (typeof mong === 'string') { msg = mong; mong = undefined; }
    var nem = false, loi;
    try { fn(); } catch (e) { nem = true; loi = e; }
    if (!nem) throw loiThongDiep(msg, 'Missing expected exception' + (typeof mong === 'function' && mong.name ? ' (' + mong.name + ').' : '.'), { actual: undefined, expected: mong, operator: 'throws' });
    kiemLoiNem(loi, mong, msg, 'throws');
  };
  assert.doesNotThrow = function (fn, mong, msg) {
    if (typeof mong === 'string') { msg = mong; }
    try { fn(); } catch (e) { throw loiThongDiep(msg, 'Got unwanted exception.\nActual message: "' + (e && e.message) + '"', { actual: e, expected: mong, operator: 'doesNotThrow' }); }
  };
  assert.rejects = function (p, mong, msg) {
    if (typeof mong === 'string') { msg = mong; mong = undefined; }
    return _Promise.resolve().then(function () { return typeof p === 'function' ? p() : p; }).then(function () {
      throw loiThongDiep(msg, 'Missing expected rejection' + (typeof mong === 'function' && mong.name ? ' (' + mong.name + ').' : '.'), { actual: undefined, expected: mong, operator: 'rejects' });
    }, function (loi) { kiemLoiNem(loi, mong, msg, 'rejects'); });
  };
  assert.doesNotReject = function (p, mong, msg) {
    return _Promise.resolve().then(function () { return typeof p === 'function' ? p() : p; }).then(function () {}, function (e) {
      throw loiThongDiep(msg, 'Got unwanted rejection.\nActual message: "' + (e && e.message) + '"', { actual: e, expected: mong, operator: 'doesNotReject' });
    });
  };
  assert.match = function (s, re, msg) {
    if (typeof s !== 'string' || !re.test(s)) throw loiThongDiep(msg, typeof s !== 'string' ? 'The "string" argument must be of type string. Received type ' + typeof s + ' (' + inspect(s, 0, true) + ')' : 'The input did not match the regular expression ' + String(re) + '. Input:\n\n' + inspect(s, 0, true) + '\n', { actual: s, expected: re, operator: 'match' });
  };
  assert.doesNotMatch = function (s, re, msg) {
    if (typeof s !== 'string' || re.test(s)) throw loiThongDiep(msg, 'The input was expected to not match the regular expression ' + String(re) + '. Input:\n\n' + inspect(s, 0, true) + '\n', { actual: s, expected: re, operator: 'doesNotMatch' });
  };
  assert.fail = function (msg) { throw loiThongDiep(msg, 'Failed', { operator: 'fail' }); };
  assert.ifError = function (v) { if (v !== null && v !== undefined) throw v; };
  assert.AssertionError = AssertionError;
  assert.strict = assert;
  assert.default = assert;

  // ── mock (node:test) ──
  function taoMock() {
    var khoiPhuc = [];
    function fn(goc, impl, opts) {
      if (typeof goc !== 'function') { opts = impl; impl = goc; goc = function () {}; }
      if (impl === undefined) impl = goc;
      var lan = [];
      var mot = {};
      var dem = 0;
      var m = function () {
        var args = Array.prototype.slice.call(arguments);
        var thucHien = mot[dem] || ctl._impl;
        var ghi = { arguments: args, this: this, result: undefined, error: undefined, target: undefined, stack: new Error() };
        dem++;
        try { ghi.result = thucHien.apply(this, args); lan.push(ghi); return ghi.result; } catch (e) { ghi.error = e; lan.push(ghi); throw e; }
      };
      var ctl = {
        _impl: impl,
        calls: lan,
        callCount: function () { return lan.length; },
        resetCalls: function () { lan.length = 0; },
        mockImplementation: function (f) { ctl._impl = f; },
        mockImplementationOnce: function (f, n) { mot[n === undefined ? dem : n] = f; },
        restore: function () { ctl._impl = goc; }
      };
      m.mock = ctl;
      return m;
    }
    function method(obj, ten, impl, opts) {
      var goc = obj[ten];
      if (typeof goc !== 'function') throw new TypeError('The argument \'methodName\' must be a method. Received ' + inspect(goc, 0, true));
      var m = fn(goc, impl === undefined ? goc : impl, opts);
      var coRieng = Object.prototype.hasOwnProperty.call(obj, ten);
      obj[ten] = m;
      var traLai = function () { if (coRieng) obj[ten] = goc; else delete obj[ten]; };
      var cuRestore = m.mock.restore;
      m.mock.restore = function () { cuRestore(); traLai(); };
      khoiPhuc.push(traLai);
      return m;
    }
    return {
      fn: fn,
      method: method,
      getter: function (obj, ten, impl) { var goc = Object.getOwnPropertyDescriptor(obj, ten); var m = fn(impl || function () {}); Object.defineProperty(obj, ten, { configurable: true, get: m }); khoiPhuc.push(function () { if (goc) Object.defineProperty(obj, ten, goc); else delete obj[ten]; }); return m; },
      reset: function () { khoiPhuc.splice(0).reverse().forEach(function (f) { f(); }); },
      restoreAll: function () { khoiPhuc.slice().reverse().forEach(function (f) { f(); }); }
    };
  }

  // ── một lượt chạy ──
  function chay(d) {
    var js = d.js || {};
    var stdout = [], stderr = [];
    var henCho = 0;
    var loiNgam = [];
    var console = {
      log: function () { stdout.push(format(arguments)); },
      info: function () { stdout.push(format(arguments)); },
      debug: function () { stdout.push(format(arguments)); },
      warn: function () { stderr.push(format(arguments)); },
      error: function () { stderr.push(format(arguments)); },
      table: function (v) { stdout.push(inspect(v)); },
      dir: function (v) { stdout.push(inspect(v)); }
    };
    function Thoat(ma) { this.ma = ma; }
    var process = {
      argv: ['node', '/p/' + (d.tepChinh || '')],
      env: {},
      exitCode: undefined,
      platform: 'linux',
      versions: { node: '22.23.3' },
      version: 'v22.23.3',
      cwd: function () { return '/p'; },
      exit: function (ma) { throw new Thoat(ma === undefined ? (process.exitCode || 0) : ma); },
      stdout: { write: function (s) { stdout.push(String(s).replace(/\n$/, '')); return true; } },
      stderr: { write: function (s) { stderr.push(String(s).replace(/\n$/, '')); return true; } },
      on: function () { return process; },
      nextTick: function (f) { var a = Array.prototype.slice.call(arguments, 1); _Promise.resolve().then(function () { f.apply(null, a); }); }
    };
    function hen(f, ms) { var a = Array.prototype.slice.call(arguments, 2); henCho++; var h = _setTimeout(function () { henCho--; try { f.apply(null, a); } catch (e) { loiNgam.push(e); } }, ms); return { __h: h }; }
    function huyHen(h) { if (h && h.__h !== undefined) { _clearTimeout(h.__h); henCho = Math.max(0, henCho - 1); } }
    var dsLap = [];
    function lap(f, ms) { var a = Array.prototype.slice.call(arguments, 2); var h = _setInterval(function () { try { f.apply(null, a); } catch (e) { loiNgam.push(e); } }, ms); dsLap.push(h); return { __l: h }; }
    function huyLap(h) { if (h && h.__l !== undefined) { _clearInterval(h.__l); dsLap = dsLap.filter(function (x) { return x !== h.__l; }); } }

    // node:test
    var mock = taoMock();
    var tests = [];
    var hook = { before: [], after: [], beforeEach: [], afterEach: [] };
    var tienTo = [];
    function dangKy(ten, opts, fn) {
      if (typeof ten === 'function') { fn = ten; opts = {}; ten = fn.name || '<anonymous>'; }
      else if (typeof opts === 'function') { fn = opts; opts = {}; }
      opts = opts || {};
      var t = { ten: tienTo.concat([String(ten)]).join(' > '), fn: fn, skip: !!opts.skip || !!opts.todo || !fn, todo: !!opts.todo };
      tests.push(t);
      return _Promise.resolve();
    }
    function test(ten, opts, fn) { return dangKy(ten, opts, fn); }
    test.skip = function (ten, opts, fn) { if (typeof opts === 'function') { fn = opts; opts = {}; } return dangKy(ten, Object.assign({}, opts, { skip: true }), fn); };
    test.todo = function (ten, opts, fn) { if (typeof opts === 'function') { fn = opts; opts = {}; } return dangKy(ten, Object.assign({}, opts, { todo: true }), fn); };
    test.only = test;
    function describe(ten, opts, fn) {
      if (typeof opts === 'function') { fn = opts; opts = {}; }
      tienTo.push(String(ten));
      try { if (fn) fn({ name: String(ten) }); } finally { tienTo.pop(); }
      return _Promise.resolve();
    }
    describe.skip = function () { return _Promise.resolve(); };
    describe.todo = describe.skip;
    describe.only = describe;
    var nodeTest = {
      test: test, it: test, describe: describe, suite: describe, mock: mock,
      before: function (f) { hook.before.push(f); }, after: function (f) { hook.after.push(f); },
      beforeEach: function (f) { hook.beforeEach.push(f); }, afterEach: function (f) { hook.afterEach.push(f); }
    };
    nodeTest.default = test;
    test.test = test; test.it = test; test.describe = describe; test.suite = describe; test.mock = mock;
    test.before = nodeTest.before; test.after = nodeTest.after; test.beforeEach = nodeTest.beforeEach; test.afterEach = nodeTest.afterEach;

    var BUILTIN = {
      'node:test': nodeTest, 'test': nodeTest,
      'node:assert/strict': assert, 'assert/strict': assert, 'node:assert': assert, 'assert': assert
    };

    var cache = {};
    function napModule(tu, spec) {
      if (Object.prototype.hasOwnProperty.call(BUILTIN, spec)) return BUILTIN[spec];
      if (/^node:/.test(spec)) { var e0 = new Error('No such built-in module: ' + spec + ' (only node:test and node:assert are available in the browser grader)'); e0.code = 'ERR_UNKNOWN_BUILTIN_MODULE'; throw e0; }
      if (spec.charAt(0) !== '.' && spec.charAt(0) !== '/') { var e1 = new Error("Cannot find package '" + spec + "' imported from /p/" + tu); e1.code = 'ERR_MODULE_NOT_FOUND'; throw e1; }
      var p = chuanDuong(spec.charAt(0) === '/' ? spec.replace(/^\/p\//, '') : thuMucCua(tu) + '/' + spec);
      if (js[p] == null) { var e2 = new Error("Cannot find module '/p/" + p + "' imported from /p/" + tu); e2.code = 'ERR_MODULE_NOT_FOUND'; throw e2; }
      if (cache[p]) return cache[p].exports;
      var module = { exports: {} };
      cache[p] = module;
      var f = new Function('exports', 'require', 'module', '__filename', '__dirname', 'console', 'process', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'setImmediate',
        js[p] + '\n//# sourceURL=/p/' + p);
      f.call(undefined, module.exports, function (s) { return napModule(p, s); }, module, '/p/' + p, '/p/' + thuMucCua(p), console, process, hen, huyHen, lap, huyLap, function (fn) { return hen(fn, 0); });
      return module.exports;
    }

    function loiChu(e) {
      if (e instanceof Thoat) return 'process.exit(' + e.ma + ')';
      if (e && e.name === 'AssertionError') return 'AssertionError [ERR_ASSERTION]: ' + e.message;
      return e && e.message !== undefined ? String(e.name || 'Error') + (e.code ? ' [' + e.code + ']' : '') + ': ' + e.message : 'Uncaught ' + inspect(e, 0, true);
    }
    function choRanh(n) {
      // đợi hẹn giờ của mã người học chạy hết (Node chỉ thoát khi vòng sự kiện rỗng) — trang giữ trần giờ thật
      return new _Promise(function (ok) {
        (function vong(k) {
          if ((henCho <= 0 && !dsLap.length) || k <= 0) return ok();
          _setTimeout(function () { vong(k - 1); }, 5);
        })(n);
      });
    }
    function goi(fn, t) {
      return new _Promise(function (ok, hong) {
        try {
          if (fn.length >= 2) { fn(t, function (e) { if (e) hong(e); else ok(); }); return; }
          _Promise.resolve(fn(t)).then(ok, hong);
        } catch (e) { hong(e); }
      });
    }

    var lenh = String(d.lenh || '').trim().split(/\s+/);
    if (lenh[0] !== 'node') return _Promise.resolve({ ma: 1, stdout: '', stderr: 'unsupported command: ' + d.lenh, tests: [] });
    var coTest = lenh.indexOf('--test') >= 0;
    var tep = lenh.filter(function (x, i) { return i > 0 && x.charAt(0) !== '-'; });
    var kq = { ma: 0, tests: [] };

    return _Promise.resolve().then(function () {
      for (var i = 0; i < tep.length; i++) {
        process.argv[1] = '/p/' + tep[i];
        try { napModule('', './' + tep[i]); }
        catch (e) {
          if (e instanceof Thoat) { kq.ma = e.ma; return; }
          stderr.push(loiChu(e));
          kq.ma = 1;
          kq.loi = loiChu(e);
          if (coTest) kq.tests.push({ ten: tep[i], dat: false, loi: 'file failed to load: ' + loiChu(e) });
          return;
        }
      }
      if (!coTest) return choRanh(400);
      // node --test: chạy lần lượt từng test đã đăng ký
      var tt = tests.slice();
      var chain = _Promise.resolve();
      hook.before.forEach(function (h) { chain = chain.then(function () { return goi(h, {}); }); });
      tt.forEach(function (t) {
        chain = chain.then(function () {
          if (t.skip) { kq.tests.push({ ten: t.ten, dat: true, boQua: true }); return; }
          var tMock = taoMock();
          var ctx = { name: t.ten, mock: tMock, diagnostic: function (s) { stdout.push('# ' + s); }, skip: function () {}, todo: function () {}, plan: function () {}, assert: assert,
            test: function () { throw new Error('subtests (t.test) are not supported by the browser grader'); } };
          var loi = null;
          var c = _Promise.resolve();
          hook.beforeEach.forEach(function (h) { c = c.then(function () { return goi(h, ctx); }); });
          c = c.then(function () { return goi(t.fn, ctx); });
          return c.then(function () {}, function (e) { loi = e; }).then(function () {
            var c2 = _Promise.resolve();
            hook.afterEach.forEach(function (h) { c2 = c2.then(function () { return goi(h, ctx); }); });
            return c2.then(function () {}, function (e) { if (!loi) loi = e; });
          }).then(function () {
            tMock.reset();
            if (!loi && loiNgam.length) loi = loiNgam.shift();
            kq.tests.push(loi ? { ten: t.ten, dat: false, loi: loiChu(loi) } : { ten: t.ten, dat: true });
          });
        });
      });
      hook.after.forEach(function (h) { chain = chain.then(function () { return goi(h, {}); }); });
      return chain.then(function () { mock.reset(); });
    }).then(function () {
      if (loiNgam.length) { kq.ma = kq.ma || 1; stderr.push(loiChu(loiNgam[0])); kq.loi = kq.loi || loiChu(loiNgam[0]); }
      if (coTest && kq.tests.some(function (t) { return !t.dat; })) kq.ma = 1;
      if (!kq.ma && process.exitCode) kq.ma = process.exitCode;
      dsLap.forEach(function (h) { _clearInterval(h); });
      kq.stdout = stdout.join('\n') + (stdout.length ? '\n' : '');
      kq.stderr = stderr.join('\n');
      if (coTest) kq.stdout += kq.tests.map(function (t) { return (t.dat ? '✔ ' : '✖ ') + t.ten + (t.loi ? '\n  ' + t.loi : ''); }).join('\n');
      return kq;
    }, function (e) {
      return { ma: e instanceof Thoat ? e.ma : 1, stdout: stdout.join('\n'), stderr: stderr.concat([loiChu(e)]).join('\n'), tests: kq.tests, loi: loiChu(e) };
    });
  }

  G.__CL_TS_CHAY__ = { chay: chay, inspect: inspect, format: format, assert: assert };
})(typeof globalThis !== 'undefined' ? globalThis : self);
`;
