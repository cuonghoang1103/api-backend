/**
 * TÁC TỬ CHẤM chạy BÊN TRONG iframe sandbox (đợt Academy 28/10/2026) — loại 'dom' và 'react'.
 *
 * Bản trình duyệt của `chayKiemDom` + `dungTrangScript` trong scripts/codelab-kiem-de-web.mjs (máy
 * chấm jsdom dùng để kiểm đề). Khác jsdom ở chỗ ĐÚNG HƠN: trình duyệt thật có bố cục ⇒ 'kich-thuoc',
 * 'so-cot', 'ti-le-cot' đo thật (Node chỉ ước lượng); cascade/UA stylesheet thật.
 *
 * Viết bằng JS thuần trong một chuỗi (không phải hàm TS rồi `.toString()`): trình biên dịch của Next
 * có thể chèn helper ngoài phạm vi hàm (async → generator…) ⇒ hàm mang sang iframe sẽ gãy.
 * ⚠ KHÔNG dùng dấu huyền (`) hay `${` trong chuỗi dưới.
 *
 * Giao ước: trang chèn `window.__CL_CFG__ = {...}` (JSON) TRƯỚC tác tử. Tác tử chạy các kiểm của
 * CFG.kiem rồi `parent.postMessage({ __clCham: CFG.id, ketQua, log, loi, taiLai? }, '*')`.
 */
export const AGENT_SRC = String.raw`
(function () {
  'use strict';
  var CFG = window.__CL_CFG__ || {};
  var W = window, D = document;
  // tự gỡ khỏi DOM (kiểm cấu trúc head — "meta charset là con đầu" — không được thấy thẻ của máy chấm)
  try { if (D.currentScript) D.currentScript.remove(); } catch (e) { /* bỏ qua */ }
  var soTaiLai = CFG.taiLai || 0;
  var log = [], loi = [];
  var daGui = false;

  // ── thời gian thật của trình duyệt (trang người học có thể đè setTimeout — giữ bản gốc) ──
  var _st = W.setTimeout.bind(W), _now = function () { return (W.performance && performance.now) ? performance.now() : Date.now(); };
  function ngu(ms) { return new Promise(function (r) { _st(r, ms || 0); }); }

  // ── console + lỗi: ghi từ byte đầu (tác tử đứng trước mọi script của trang) ──
  function fmt(v) {
    if (typeof v === 'string') return v;
    if (v === undefined) return 'undefined';
    if (v === null || typeof v === 'number' || typeof v === 'boolean' || typeof v === 'bigint') return String(v);
    if (typeof v === 'function') return '[Function]';
    if (v && typeof v === 'object' && typeof v.name === 'string' && typeof v.message === 'string' && 'stack' in v) return v.name + ': ' + v.message;
    try { return JSON.stringify(v); } catch (e) { return String(v); }
  }
  var REACT_ON = /^(Warning: |Download the React DevTools|%c|You are using the in-browser Babel)/;
  ['log', 'info', 'warn', 'error', 'debug'].forEach(function (lv) {
    var goc = console[lv];
    console[lv] = function () {
      var a = [].slice.call(arguments);
      // cảnh báo nội bộ của React dev (key, act…) không phải output của bài
      if (!(CFG.react && typeof a[0] === 'string' && REACT_ON.test(a[0]))) log.push(a.map(fmt).join(' '));
      try { goc.apply(console, a); } catch (e) { /* bỏ qua */ }
    };
  });
  W.addEventListener('error', function (e) {
    if (e && e.target && e.target !== W && e.target.tagName) return; // ảnh/link 404 — không phải lỗi JS
    loi.push(fmt(e.error || e.message));
  });
  W.addEventListener('unhandledrejection', function (e) { loi.push(fmt(e.reason)); });

  // ── focus: khung chấm KHÔNG phải khung đang được focus (nhiều khung chạy song song, trang mẹ giữ focus)
  //    ⇒ document.activeElement không tin được. Ghi lại phần tử được gọi .focus() gần nhất (React autoFocus
  //    và useRef().current.focus() đều đi qua đây) để kiểm 'focus' chấm đúng ý "trang đã tự focus ô này".
  var focusGanNhat = null;
  try {
    var focusGoc = HTMLElement.prototype.focus;
    HTMLElement.prototype.focus = function () { focusGanNhat = this; return focusGoc.apply(this, arguments); };
    W.addEventListener('focusin', function (e) { if (e.target && e.target.nodeType === 1) focusGanNhat = e.target; }, true);
  } catch (e) { /* bỏ qua */ }

  // ── hộp thoại: iframe sandbox không có allow-modals ⇒ thay bằng bản tất định ──
  W.alert = function (m) { log.push('[alert] ' + fmt(m)); };
  W.confirm = function (m) { log.push('[confirm] ' + fmt(m)); return CFG.confirm === undefined ? true : !!CFG.confirm; };
  W.prompt = function (m) { log.push('[prompt] ' + fmt(m)); return CFG.prompt === undefined ? '' : String(CFG.prompt); };

  // ── localStorage / sessionStorage GIẢ (gốc mờ của sandbox ném SecurityError khi chạm bản thật) ──
  function taoKho(dau) {
    var m = {};
    if (dau) Object.keys(dau).forEach(function (k) { m[k] = String(dau[k]); });
    var kho = {
      getItem: function (k) { k = String(k); return Object.prototype.hasOwnProperty.call(m, k) ? m[k] : null; },
      setItem: function (k, v) { m[String(k)] = String(v); },
      removeItem: function (k) { delete m[String(k)]; },
      clear: function () { m = {}; },
      key: function (i) { return Object.keys(m)[i] == null ? null : Object.keys(m)[i]; },
      __m: function () { return m; }
    };
    Object.defineProperty(kho, 'length', { get: function () { return Object.keys(m).length; } });
    return kho;
  }
  var khoLocal = taoKho(CFG.khoCucBo), khoSession = taoKho(null);
  try { Object.defineProperty(W, 'localStorage', { value: khoLocal, configurable: true }); } catch (e) { /* bỏ qua */ }
  try { Object.defineProperty(W, 'sessionStorage', { value: khoSession, configurable: true }); } catch (e) { /* bỏ qua */ }

  // ── fetch GIẢ (cùng giao ước fetchGia với máy chấm JS) ──
  var fetchGia = CFG.fetchGia || null, daDung = {};
  W.__fetchDaGoi = [];
  if (fetchGia) {
    W.fetch = function (url, init) {
      init = init || {};
      url = String(url && url.url ? url.url : url);
      var method = String(init.method || 'GET').toUpperCase();
      W.__fetchDaGoi.push({ url: url, method: method, headers: init.headers || {}, body: init.body === undefined ? null : init.body });
      var khoa = (method + ' ' + url) in fetchGia ? method + ' ' + url : url;
      var m = fetchGia[khoa];
      if (Array.isArray(m)) { var i = daDung[khoa] = (daDung[khoa] == null ? -1 : daDung[khoa]) + 1; m = m[Math.min(i, m.length - 1)]; }
      return new Promise(function (res, rej) {
        _st(function () {
          if (!m) return res(new Response('Not Found', { status: 404, headers: { 'content-type': 'text/plain' } }));
          if (m.loiMang) return rej(new TypeError('Failed to fetch'));
          var laJson = 'json' in m;
          var h = Object.assign({ 'content-type': laJson ? 'application/json' : 'text/plain' }, m.headers || {});
          res(new Response(laJson ? JSON.stringify(m.json) : (m.text || ''), { status: m.status || 200, headers: h }));
        }, m && m.treMs != null ? Math.min(m.treMs, 200) : 10);
      });
    };
  }

  // ── json-server GIẢ có TRẠNG THÁI (29/10/2026 — đề PE FER202): CFG.jsonServer = { base, db }. GET/POST/PUT/
  //    PATCH/DELETE trên bảng của db như json-server 0.17 (lọc ?field=v, _sort/_order, _limit/_page, q, _like,
  //    _gte/_lte/_ne, _expand/_embed). Dữ liệu sống suốt khung (kể cả 'tai-lai' — như máy chủ thật).
  //    ⚠ Bản sao trong content/codelab/_chung/deLon.mjs (demo) — sửa thì sửa cả hai.
  var jsDb = null, jsBase = null;
  if (CFG.jsonServer && CFG.jsonServer.db) {
    jsBase = String(CFG.jsonServer.base || 'http://localhost:9999').replace(/\/+$/, '');
    try { jsDb = JSON.parse(JSON.stringify(CFG.jsonServer.db)); } catch (e) { jsDb = {}; }
  }
  W.__clDb = function () { return jsDb; };
  function jsTraLoi(status, body) {
    return new Response(body === undefined ? '{}' : JSON.stringify(body), { status: status, headers: { 'content-type': 'application/json' } });
  }
  function jsLay(o, k) { return String(k).split('.').reduce(function (a, p) { return a == null ? undefined : a[p]; }, o); }
  function jsMot(ten) { return /ies$/.test(ten) ? ten.slice(0, -3) + 'y' : ten.replace(/s$/, ''); }
  function jsXuLy(method, url, body) {
    var u = new URL(url);
    var phan = u.pathname.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean).map(decodeURIComponent);
    var ten = phan[0], id = phan[1];
    if (!ten || !(ten in jsDb)) return jsTraLoi(404, {});
    var bang = jsDb[ten];
    var duLieu = null;
    if (body != null && body !== '') { try { duLieu = JSON.parse(body); } catch (e) { return jsTraLoi(400, { error: 'invalid JSON' }); } }
    if (!Array.isArray(bang)) { // tài nguyên số ít (vd "profile": {})
      if (method === 'GET') return jsTraLoi(200, bang);
      if (method === 'PUT' || method === 'POST') { jsDb[ten] = duLieu || {}; return jsTraLoi(200, jsDb[ten]); }
      if (method === 'PATCH') { jsDb[ten] = Object.assign({}, bang, duLieu || {}); return jsTraLoi(200, jsDb[ten]); }
      return jsTraLoi(404, {});
    }
    var viTriId = function (x) { return bang.findIndex(function (r) { return String(r.id) === String(x); }); };
    var morong = function (r) {
      var o = Object.assign({}, r);
      u.searchParams.getAll('_expand').forEach(function (e) { var b = jsDb[e + 's'] || jsDb[e]; if (Array.isArray(b)) o[e] = b.find(function (x) { return String(x.id) === String(r[e + 'Id']); }); });
      u.searchParams.getAll('_embed').forEach(function (e) { var b = jsDb[e]; if (Array.isArray(b)) { var k = jsMot(ten) + 'Id'; o[e] = b.filter(function (x) { return String(x[k]) === String(r.id); }); } });
      return o;
    };
    if (method === 'GET') {
      if (id != null) { var i = viTriId(id); return i < 0 ? jsTraLoi(404, {}) : jsTraLoi(200, morong(bang[i])); }
      var ds = bang.slice();
      var loc = {};
      u.searchParams.forEach(function (v, k) { if (k.charAt(0) !== '_' && k !== 'q') (loc[k] = loc[k] || []).push(v); });
      Object.keys(loc).forEach(function (k) {
        var vs = loc[k], m = /^(.*)_(like|gte|lte|ne)$/.exec(k);
        ds = ds.filter(function (r) {
          if (m) {
            var gv = jsLay(r, m[1]);
            return vs.every(function (v) {
              if (m[2] === 'like') return new RegExp(v, 'i').test(String(gv));
              if (m[2] === 'ne') return String(gv) !== v;
              var a = Number(gv), b = Number(v); var so = !isNaN(a) && !isNaN(b);
              return m[2] === 'gte' ? (so ? a >= b : String(gv) >= v) : (so ? a <= b : String(gv) <= v);
            });
          }
          var g = jsLay(r, k);
          return vs.some(function (v) { return String(g) === v; });
        });
      });
      var qq = u.searchParams.get('q');
      if (qq) ds = ds.filter(function (r) { return JSON.stringify(r).toLowerCase().indexOf(qq.toLowerCase()) >= 0; });
      var sx = u.searchParams.get('_sort');
      if (sx) {
        var truong = sx.split(','), thu = (u.searchParams.get('_order') || 'asc').split(',');
        ds.sort(function (a, b) {
          for (var t = 0; t < truong.length; t++) {
            var f = truong[t].replace(/^-/, ''), giam = truong[t].charAt(0) === '-' || (thu[t] || thu[0]) === 'desc';
            var x = jsLay(a, f), y = jsLay(b, f);
            var c = (typeof x === 'number' && typeof y === 'number') ? x - y : String(x).localeCompare(String(y));
            if (c) return giam ? -c : c;
          }
          return 0;
        });
      }
      var gh = u.searchParams.get('_limit'), tr = u.searchParams.get('_page');
      var tong = ds.length;
      if (tr) { var n = Number(gh) || 10; ds = ds.slice((Number(tr) - 1) * n, Number(tr) * n); } else if (gh) ds = ds.slice(0, Number(gh));
      var res = jsTraLoi(200, ds.map(morong));
      try { res.headers.set('X-Total-Count', String(tong)); } catch (e) { /* bỏ qua */ }
      return res;
    }
    if (method === 'POST') {
      if (id != null) return jsTraLoi(404, {});
      var moi = Object.assign({}, duLieu || {});
      if (moi.id == null) {
        var so = bang.length && bang.every(function (r) { return typeof r.id === 'number'; });
        moi.id = so || !bang.length ? bang.reduce(function (mx, r) { return Math.max(mx, Number(r.id) || 0); }, 0) + 1 : Math.random().toString(16).slice(2, 6);
      }
      bang.push(moi);
      return jsTraLoi(201, moi);
    }
    if (id == null) return jsTraLoi(404, {});
    var j = viTriId(id);
    if (j < 0) return jsTraLoi(404, {});
    if (method === 'PUT') { bang[j] = Object.assign({}, duLieu || {}, { id: bang[j].id }); return jsTraLoi(200, bang[j]); }
    if (method === 'PATCH') { bang[j] = Object.assign({}, bang[j], duLieu || {}, { id: bang[j].id }); return jsTraLoi(200, bang[j]); }
    if (method === 'DELETE') { bang.splice(j, 1); return jsTraLoi(200, {}); }
    return jsTraLoi(404, {});
  }
  if (jsDb) {
    var fetchTruoc = fetchGia ? W.fetch : null;
    W.fetch = function (url, init) {
      init = init || {};
      var s = String(url && url.url ? url.url : url);
      var method = String(init.method || 'GET').toUpperCase();
      if (fetchGia && (((method + ' ' + s) in fetchGia) || (s in fetchGia))) return fetchTruoc(url, init);
      W.__fetchDaGoi.push({ url: s, method: method, headers: init.headers || {}, body: init.body === undefined ? null : init.body });
      return new Promise(function (res) {
        _st(function () {
          if (s.indexOf(jsBase + '/') !== 0) return res(new Response('Not Found', { status: 404, headers: { 'content-type': 'text/plain' } }));
          try { res(jsXuLy(method, s, init.body)); } catch (e) { res(jsTraLoi(500, { error: String(e) })); }
        }, 10);
      });
    };
  }

  // ── .env (CRA: process.env.REACT_APP_* · Vite: import.meta.env.VITE_*) đọc từ tệp .env của bài ──
  var ENV = { NODE_ENV: 'production', MODE: 'production', PROD: true, DEV: false, BASE_URL: '/' };
  try {
    String((CFG.files || {})['.env'] || '').split(/\r?\n/).forEach(function (d) {
      var m = /^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/.exec(d);
      if (m) ENV[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
    });
  } catch (e) { /* bỏ qua */ }
  W.__CL_ENV__ = ENV;
  if (!W.process) W.process = { env: ENV };

  // ── form gửi đi thật ⇒ trình duyệt sẽ tải lại trang (mô phỏng như máy chấm Node) ──
  var guiChuaChan = false;
  W.addEventListener('submit', function (e) {
    if (!e.defaultPrevented) { guiChuaChan = true; e.preventDefault(); }
  });
  // không cho trang tự điều hướng đi chỗ khác (link ngoài) — mất tác tử
  D.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    var h = a.getAttribute('href') || '';
    if (h.charAt(0) === '#' || /^javascript:/i.test(h)) return;
    if (!e.defaultPrevented) e.preventDefault();
  });

  // ═══ chuẩn hoá + các kiểm DOM ═══
  function chuanCss(v) {
    return String(v == null ? '' : v).trim().toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/\s*,\s*/g, ', ')
      .replace(/\(\s+/g, '(').replace(/\s+\)/g, ')')
      .replace(/(-?[\d.]+)rem\b/g, function (_, n) { return (+(parseFloat(n) * 16).toFixed(4)) + 'px'; });
  }
  function gonChu(s) { return String(s == null ? '' : s).replace(/\s+/g, ' ').trim(); }
  function re(s) { return new RegExp(s, 'i'); }
  function q(sel) { return sel ? [].slice.call(D.querySelectorAll(sel)) : []; }
  function bangSau(a, b) {
    if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') return a === b;
    if (Array.isArray(a) !== Array.isArray(b)) return false;
    if (Array.isArray(a)) return a.length === b.length && a.every(function (x, i) { return bangSau(x, b[i]); });
    var ka = Object.keys(a), kb = Object.keys(b);
    return ka.length === kb.length && ka.every(function (k) { return Object.prototype.hasOwnProperty.call(b, k) && bangSau(a[k], b[k]); });
  }
  function tokPx(s) {
    return chuanCss(s).split(' ').filter(function (t) { return /^-?[\d.]+px$/.test(t); }).map(parseFloat);
  }

  function kiem(k) {
    var tatCa = k.tatCa !== false;
    var els = q(k.selector);
    var moiCai = function (f) { return els.length > 0 && (tatCa ? els.every(f) : els.some(f)); };
    var soGT = function (v) { return k.giaTri !== undefined ? v === k.giaTri : re(k.khop).test(v); };
    switch (k.kiem) {
      case 'doctype': return { dat: !!(D.doctype && D.doctype.name === 'html') };
      case 'ton-tai': return { dat: els.length > 0, thay: els.length + ' phần tử' };
      case 'khong-ton-tai': return { dat: els.length === 0, thay: els.length + ' phần tử' };
      case 'so-luong': {
        var n = els.length;
        var dat = k.giaTri !== undefined ? n === k.giaTri : (n >= (k.min == null ? -Infinity : k.min) && n <= (k.max == null ? Infinity : k.max));
        return { dat: dat, thay: String(n) };
      }
      case 'thuoc-tinh':
        return {
          dat: moiCai(function (e) { return e.hasAttribute(k.thuocTinh) && (k.giaTri === undefined && !k.khop ? true : soGT(e.getAttribute(k.thuocTinh).trim())); }),
          thay: els.length ? els.map(function (e) { return e.getAttribute(k.thuocTinh); }).slice(0, 4).join(' | ') : 'không có phần tử'
        };
      case 'text':
        return { dat: moiCai(function (e) { return soGT(gonChu(e.textContent)); }), thay: els.length ? els.map(function (e) { return gonChu(e.textContent); }).slice(0, 3).join(' | ') : 'không có phần tử' };
      case 'danh-sach-text': {
        var ds = els.map(function (e) { return gonChu(e.textContent); });
        return { dat: bangSau(ds, k.mongDoi), thay: JSON.stringify(ds.slice(0, 12)) };
      }
      case 'css': {
        var vals = els.map(function (e) { return chuanCss(getComputedStyle(e).getPropertyValue(k.thuocTinh)); });
        var mong = k.giaTri !== undefined ? chuanCss(k.giaTri) : null;
        var f = function (v) { return mong !== null ? v === mong : re(k.khop).test(v); };
        return { dat: vals.length > 0 && (tatCa ? vals.every(f) : vals.some(f)), thay: vals.length ? vals.slice(0, 3).join(' | ') : 'không có phần tử' };
      }
      case 'kich-thuoc': {
        if (!els.length) return { dat: false, thay: 'không có phần tử' };
        var vs = els.map(function (e) { return +e.getBoundingClientRect()[k.thuocTinh].toFixed(2); });
        return { dat: vs.every(function (v) { return Math.abs(v - k.giaTri) <= 0.5; }), thay: vs.join(' | ') + 'px' };
      }
      case 'so-cot': {
        if (!els.length) return { dat: false, thay: 'không có phần tử' };
        var cs = getComputedStyle(els[0]);
        if (chuanCss(cs.display).indexOf('grid') < 0) return { dat: false, thay: 'không phải grid (display: ' + cs.display + ')' };
        var c = tokPx(cs.getPropertyValue('grid-template-columns')).filter(function (x) { return x > 0; }).length;
        return { dat: c === k.giaTri, thay: c + ' cột' };
      }
      case 'ti-le-cot': {
        if (!els.length) return { dat: false, thay: 'không có phần tử' };
        var t = tokPx(getComputedStyle(els[0]).getPropertyValue('grid-template-columns')).filter(function (x) { return x > 0; });
        if (t.length < 2) return { dat: false, thay: 'ít hơn 2 cột' };
        var r = t[0] / t[1];
        return { dat: Math.abs(r - k.giaTri) <= 0.05, thay: 'cột1/cột2 = ' + (+r.toFixed(3)) };
      }
      case 'co-nhan': {
        var coNhan = function (e) { return (e.labels && e.labels.length > 0) || !!(e.getAttribute('aria-label') || '').trim() || !!(e.getAttribute('aria-labelledby') || '').trim(); };
        var thieu = els.filter(function (e) { return !coNhan(e); }).map(function (e) { return e.id || e.name || e.tagName.toLowerCase(); });
        return { dat: els.length > 0 && thieu.length === 0, thay: thieu.length ? 'thiếu nhãn: ' + thieu.join(', ') : els.length + ' ô' };
      }
      case 'neo-hop-le': {
        var hong = els.filter(function (a) { var id = decodeURIComponent((a.getAttribute('href') || '').slice(1)); return !id || !D.getElementById(id); });
        return { dat: els.length > 0 && hong.length === 0, thay: hong.length ? 'hỏng: ' + hong.map(function (a) { return a.getAttribute('href'); }).join(', ') : els.length + ' neo' };
      }
      case 'tieu-de': {
        var pham = D.querySelector(k.selector || 'body');
        var hs = pham ? [].slice.call(pham.querySelectorAll('h1,h2,h3,h4,h5,h6')) : [];
        var cap = hs.map(function (h) { return +h.tagName[1]; });
        var soH1 = cap.filter(function (x) { return x === 1; }).length;
        var nhay = null;
        for (var i = 1; i < cap.length; i++) if (cap[i] > cap[i - 1] + 1) { nhay = 'h' + cap[i - 1] + ' → h' + cap[i]; break; }
        if (cap.length && cap[0] !== 1) nhay = nhay || ('mở đầu bằng h' + cap[0]);
        return { dat: soH1 === 1 && !nhay, thay: soH1 + ' h1' + (nhay ? ', nhảy cấp ' + nhay : '') };
      }
      case 'thu-tu': {
        var es = (k.cacSelector || []).map(function (s) { return D.querySelector(s); });
        var thieuS = (k.cacSelector || []).filter(function (_, i) { return !es[i]; });
        if (thieuS.length) return { dat: false, thay: 'thiếu: ' + thieuS.join(', ') };
        for (var j = 1; j < es.length; j++) {
          if (!(es[j - 1].compareDocumentPosition(es[j]) & 4)) return { dat: false, thay: k.cacSelector[j] + ' đứng trước ' + k.cacSelector[j - 1] };
        }
        return { dat: true };
      }
      case 'hop-le': {
        var dien = k.dien || {};
        for (var s in dien) { var e1 = D.querySelector(s); if (!e1) return { dat: false, thay: 'không có ' + s }; e1.value = dien[s]; }
        var chon = k.chon || [];
        for (var x = 0; x < chon.length; x++) { var e2 = D.querySelector(chon[x]); if (!e2) return { dat: false, thay: 'không có ' + chon[x] }; e2.checked = true; }
        var el = D.querySelector(k.selector);
        if (!el) return { dat: false, thay: 'không có ' + k.selector };
        var v = el.checkValidity();
        return { dat: v === k.giaTri, thay: 'checkValidity() = ' + v };
      }
      case 'thuoc-tinh-js':
        return { dat: moiCai(function (e) { return JSON.stringify(e[k.thuocTinh]) === JSON.stringify(k.giaTri); }), thay: els.map(function (e) { return JSON.stringify(e[k.thuocTinh]); }).slice(0, 4).join(' | ') || 'không có phần tử' };
      case 'console': return { dat: JSON.stringify(log) === JSON.stringify(k.mongDoi), thay: JSON.stringify(log.slice(0, 20)) };
      case 'khong-loi-js': return { dat: loi.length === 0, thay: loi.length ? loi.slice(0, 3).join(' | ') : 'không lỗi' };
      case 'khong-tai-lai': return { dat: soTaiLai === 0, thay: soTaiLai ? 'trang tải lại ' + soTaiLai + ' lần (form gửi đi thật — thiếu preventDefault?)' : 'không tải lại' };
      case 'focus': {
        var a = D.activeElement && D.activeElement !== D.body ? D.activeElement : null;
        if (!a && focusGanNhat && focusGanNhat.isConnected) a = focusGanNhat;
        if (!a) { var af = D.querySelector('[autofocus]'); if (af) a = af; }
        var dung = !!(a && a.matches && a.matches(k.selector));
        return { dat: dung, thay: a ? (a.tagName.toLowerCase() + (a.id ? '#' + a.id : '') + (a.name ? '[name=' + a.name + ']' : '')) : 'không ô nào được focus' };
      }
      case 'kho-cuc-bo': {
        var raw = khoLocal.getItem(k.khoa);
        if (raw == null) return { dat: k.tonTai === false, thay: 'localStorage["' + k.khoa + '"] chưa có' };
        if (k.tonTai === false) return { dat: false, thay: 'vẫn còn khoá ' + k.khoa };
        if (k.khop) return { dat: re(k.khop).test(raw), thay: raw.slice(0, 160) };
        if (k.mongDoi !== undefined) {
          var gt; try { gt = JSON.parse(raw); } catch (e) { gt = raw; }
          return { dat: bangSau(gt, k.mongDoi), thay: raw.slice(0, 160) };
        }
        if (k.doDai !== undefined) {
          var arr; try { arr = JSON.parse(raw); } catch (e) { arr = null; }
          return { dat: Array.isArray(arr) && arr.length === k.doDai, thay: Array.isArray(arr) ? arr.length + ' phần tử' : raw.slice(0, 80) };
        }
        return { dat: true, thay: raw.slice(0, 160) };
      }
      case 'duong-dan': { // URL hiện tại của React Router (pathname + search)
        var vt = viTri || CFG.url || '/';
        var dungDD = k.giaTri !== undefined ? vt === k.giaTri : re(k.khop).test(vt);
        return { dat: dungDD, thay: vt };
      }
      case 'du-lieu-server': { // dữ liệu trong json-server giả: bang + doDai | chua {…} | khongChua {…}
        if (!jsDb) return { dat: false, thay: 'đề không bật jsonServer' };
        var bg = jsDb[k.bang];
        if (!Array.isArray(bg)) return { dat: false, thay: 'không có bảng ' + k.bang };
        // so lỏng KIỂU chỉ với giá trị nguyên thuỷ (3 khớp "3"); object/mảng so sâu đúng kiểu
        var khopCon = function (r, mau) { return Object.keys(mau).every(function (f) { var m = mau[f]; return bangSau(r[f], m) || (!k.chat && (m === null || typeof m !== 'object') && r[f] != null && typeof r[f] !== 'object' && String(r[f]) === String(m)); }); };
        if (k.doDai !== undefined) return { dat: bg.length === k.doDai, thay: bg.length + ' bản ghi' };
        if (k.chua) { var co = bg.filter(function (r) { return khopCon(r, k.chua); }); return { dat: co.length > 0, thay: co.length ? JSON.stringify(co[0]).slice(0, 200) : 'không bản ghi nào khớp · ' + JSON.stringify(bg.slice(-2)).slice(0, 200) }; }
        if (k.khongChua) { var co2 = bg.filter(function (r) { return khopCon(r, k.khongChua); }); return { dat: co2.length === 0, thay: co2.length + ' bản ghi khớp' }; }
        return { dat: true, thay: bg.length + ' bản ghi' };
      }
      case 'goi-fetch': {
        var goi = (W.__fetchDaGoi || []).map(function (g) { return g.method + ' ' + g.url; });
        // than: { field: giá trị } ⇒ chỉ tính lời gọi có body JSON chứa các trường đó (vd POST đúng dữ liệu)
        var coThan = function (g) {
          if (!k.than) return true;
          var b; try { b = JSON.parse(g.body); } catch (e) { return false; }
          var ds2 = Array.isArray(b) ? b : [b];
          return ds2.some(function (x) { return x && Object.keys(k.than).every(function (f) { var m = k.than[f]; return bangSau(x[f], m) || (!k.chat && (m === null || typeof m !== 'object') && x[f] != null && typeof x[f] !== 'object' && String(x[f]) === String(m)); }); });
        };
        var khop = (W.__fetchDaGoi || []).filter(function (g) { return re(k.khop).test(g.method + ' ' + g.url) && coThan(g); }).length;
        return { dat: khop >= (k.min == null ? 1 : k.min) && (k.max == null || khop <= k.max), thay: goi.slice(0, 6).join(' · ') || 'chưa gọi fetch' };
      }
      default: return { dat: false, thay: 'loại kiểm lạ: ' + k.kiem };
    }
  }

  async function kiemCoCho(k) {
    var cho = k.choToiDa != null ? k.choToiDa : (CFG.choToiDa || 0);
    var het = _now() + cho, r;
    for (;;) {
      try { r = kiem(k); } catch (e) { r = { dat: false, thay: 'lỗi khi kiểm: ' + fmt(e) }; }
      if (r.dat || _now() >= het) return r;
      await ngu(40);
    }
  }

  // ═══ các bước "trước khi kiểm" ═══
  function datGiaTri(el, v) {
    var proto = el.tagName === 'SELECT' ? HTMLSelectElement.prototype : el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    var d = Object.getOwnPropertyDescriptor(proto, 'value');
    if (d && d.set) d.set.call(el, v); else el.value = v; // setter gốc ⇒ React thấy giá trị đổi
  }
  async function lamBuoc(b) {
    if (b.hanhDong === 'cho') { await ngu(Math.min(5000, b.ms || 100)); return null; }
    if (b.hanhDong === 'tai-lai') { if (CFG.react) { await napLaiReact(); return null; } return 'tai-lai chỉ dùng cho loại react'; }
    var el = b.selector ? (b.thu != null ? q(b.selector)[b.thu] : D.querySelector(b.selector)) : null;
    if (b.selector && !el) {
      // giao diện React có thể chưa kịp vẽ ⇒ chờ tối đa 1s
      var het = _now() + (CFG.react ? 1000 : 0);
      while (!el && _now() < het) { await ngu(40); el = b.thu != null ? q(b.selector)[b.thu] : D.querySelector(b.selector); }
      if (!el) return 'không có ' + b.selector + ' để ' + b.hanhDong;
    }
    try {
      switch (b.hanhDong) {
        case 'click': for (var i = 0; i < (b.lan || 1); i++) el.click(); break;
        case 'nhap':
          if (el.focus) el.focus();
          datGiaTri(el, b.giaTri);
          el.dispatchEvent(new Event('input', { bubbles: true }));
          break;
        case 'doi':
          if (b.giaTri !== undefined) datGiaTri(el, b.giaTri);
          el.dispatchEvent(new Event('change', { bubbles: true }));
          break;
        case 'chon-o': // checkbox / radio
          if (!!el.checked !== (b.giaTri !== false)) el.click();
          break;
        case 'gui': { var f = el.tagName === 'FORM' ? el : el.form; if (f.requestSubmit) f.requestSubmit(); else f.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); break; }
        case 'phim':
          el.dispatchEvent(new KeyboardEvent('keydown', { key: b.phim, bubbles: true, cancelable: true }));
          el.dispatchEvent(new KeyboardEvent('keyup', { key: b.phim, bubbles: true, cancelable: true }));
          break;
        case 'focus': el.focus(); break;
        default: return 'hành động lạ ' + b.hanhDong;
      }
    } catch (e) { loi.push(fmt(e)); }
    await ngu(0); await ngu(CFG.react ? 30 : 0);
    return null;
  }

  // ═══ React: biên dịch (sucrase) + require + gắn vào #root ═══
  var cache = {}, roots = [], bodyGoc = null;
  function duongDan(tu, spec) {
    var phan = tu.split('/').slice(0, -1);
    spec.split('/').forEach(function (p) { if (p === '.' || p === '') return; if (p === '..') phan.pop(); else phan.push(p); });
    return phan.join('/');
  }
  function timTep(p) {
    var files = CFG.files || {};
    var duoi = ['', '.js', '.jsx', '.ts', '.tsx', '.json', '/index.js', '/index.jsx', '/index.ts', '/index.tsx'];
    for (var i = 0; i < duoi.length; i++) if (files[p + duoi[i]] != null) return p + duoi[i];
    return null;
  }
  function jsxShim() {
    var R = W.React;
    // jsx: con (nếu là mảng) là danh sách ĐỘNG — React kiểm key như thật; jsxs: mảng con TĨNH ⇒ trải ra
    var tach = function (props, key) { var p = Object.assign({}, props); var c = p.children; delete p.children; if (key !== undefined) p.key = key; return [p, c]; };
    var jsx = function (type, props, key) { var t = tach(props, key); return t[1] === undefined ? R.createElement(type, t[0]) : R.createElement(type, t[0], t[1]); };
    var jsxs = function (type, props, key) { var t = tach(props, key); return R.createElement.apply(null, [type, t[0]].concat(t[1] || [])); };
    return { jsx: jsx, jsxs: jsxs, jsxDEV: jsx, Fragment: R.Fragment };
  }
  function axiosGia() {
    function goi(method, url, data, cfg) {
      cfg = cfg || {};
      var u = (cfg.baseURL || '') + url;
      if (cfg.params) { var sp = new URLSearchParams(cfg.params).toString(); if (sp) u += (u.indexOf('?') >= 0 ? '&' : '?') + sp; }
      var init = { method: method.toUpperCase(), headers: Object.assign({ 'Content-Type': 'application/json' }, cfg.headers || {}) };
      if (data !== undefined) init.body = typeof data === 'string' ? data : JSON.stringify(data);
      return W.fetch(u, init).then(function (res) {
        return res.text().then(function (t) {
          var d; try { d = JSON.parse(t); } catch (e) { d = t; }
          var out = { data: d, status: res.status, statusText: res.statusText, headers: {}, config: cfg };
          if (res.status >= 200 && res.status < 300) return out;
          var err = new Error('Request failed with status code ' + res.status); err.response = out; err.name = 'AxiosError';
          throw err;
        });
      });
    }
    function tao(base) {
      var a = function (cfg) { return goi(cfg.method || 'get', cfg.url, cfg.data, Object.assign({}, base, cfg)); };
      ['get', 'delete', 'head'].forEach(function (m) { a[m] = function (url, cfg) { return goi(m, url, undefined, Object.assign({}, base, cfg)); }; });
      ['post', 'put', 'patch'].forEach(function (m) { a[m] = function (url, data, cfg) { return goi(m, url, data, Object.assign({}, base, cfg)); }; });
      a.create = function (c) { return tao(Object.assign({}, base, c)); };
      a.defaults = base; a.interceptors = { request: { use: function () {} }, response: { use: function () {} } };
      a.isAxiosError = function (e) { return !!(e && e.name === 'AxiosError'); };
      return a;
    }
    var ax = tao({}); ax.default = ax; return ax;
  }
  // ── React Router (29/10/2026): khung srcdoc (about:srcdoc) KHÔNG pushState được ⇒ BrowserRouter/HashRouter
  //    chạy bằng MemoryRouter; URL đầu = CFG.url (kiểm "mở thẳng /subjects?status=ACTIVE"); vị trí GIỮ qua
  //    'tai-lai' (như trình duyệt tải lại cùng URL). Kiểm 'duong-dan' đọc viTri.
  var viTri = null;
  var routerBoc = null;
  function routerGia() {
    var RRD = W.ReactRouterDOM;
    if (!RRD) return null;
    if (routerBoc) return routerBoc;
    var R = W.React;
    var batDauTai = function () { return viTri || CFG.url || '/'; };
    function GhiViTri() {
      var l = RRD.useLocation();
      viTri = l.pathname + l.search + l.hash;
      return null;
    }
    function RouterGia(props) {
      var dau = R.useState(function () { return [batDauTai()]; })[0];
      return R.createElement(RRD.MemoryRouter, { initialEntries: dau, basename: props.basename, future: props.future }, R.createElement(GhiViTri), props.children);
    }
    function taoRouterGia(routes, opts) {
      var r = RRD.createMemoryRouter(routes, Object.assign({}, opts || {}, { initialEntries: [batDauTai()] }));
      var ghi = function (s) { viTri = s.location.pathname + s.location.search + s.location.hash; };
      ghi(r.state);
      r.subscribe(ghi);
      return r;
    }
    routerBoc = Object.assign({}, RRD, { BrowserRouter: RouterGia, HashRouter: RouterGia, createBrowserRouter: taoRouterGia, createHashRouter: taoRouterGia });
    return routerBoc;
  }
  // redux-thunk: vài dòng, không cần tải gói
  function thunkGia() {
    var t = function (api) { return function (next) { return function (action) { return typeof action === 'function' ? action(api.dispatch, api.getState) : next(action); }; }; };
    return { 'default': t, thunk: t, __esModule: true };
  }
  var THU_VIEN = {
    'react': function () { return W.React; },
    'react-dom': function () { return W.ReactDOM; },
    'react-dom/client': function () { return W.ReactDOM; },
    'react/jsx-runtime': jsxShim,
    'react/jsx-dev-runtime': jsxShim,
    'prop-types': function () { return W.PropTypes; },
    'react-router-dom': routerGia,
    'react-router': function () { return routerGia() || W.ReactRouter; },
    'react-bootstrap': function () { return W.ReactBootstrap; },
    'axios': axiosGia,
    '@reduxjs/toolkit': function () { return W.RTK; },
    'redux': function () { return W.RTK; },
    'react-redux': function () { return W.ReactRedux; },
    'redux-thunk': thunkGia
  };
  function yeuCau(tu, spec) {
    if (THU_VIEN[spec]) {
      var m = THU_VIEN[spec]();
      if (!m) throw new Error('Thư viện "' + spec + '" chưa được nạp cho bài này (khai trong testsJson.thuVien).');
      return m;
    }
    if (/\.css$/.test(spec) && !/^\.{1,2}\//.test(spec)) return {}; // css của gói (bootstrap…) — đã nạp qua thuVien
    if (!/^\.{1,2}\//.test(spec) && spec.charAt(0) !== '/') throw new Error('Không tìm thấy gói "' + spec + '" (Code Lab chỉ có react, react-dom, prop-types, react-router-dom, react-bootstrap, axios, @reduxjs/toolkit, redux, react-redux, redux-thunk)');
    var p = timTep(spec.charAt(0) === '/' ? spec.slice(1) : duongDan(tu, spec));
    if (!p) throw new Error('Không tìm thấy tệp "' + spec + '" (import từ ' + tu + ')');
    return napModule(p);
  }
  function napModule(p) {
    if (cache[p]) return cache[p].exports;
    var src = CFG.files[p];
    if (/\.css$/.test(p)) { var st = D.createElement('style'); st.setAttribute('data-tu', p); st.textContent = src; D.head.appendChild(st); cache[p] = { exports: {} }; return {}; }
    if (/\.json$/.test(p)) { cache[p] = { exports: JSON.parse(src) }; return cache[p].exports; }
    var module = { exports: {} };
    cache[p] = module;
    // mã đã biên dịch (JSX/TS → CommonJS) ở trang mẹ — xem bienDichReact trong chamKhung.ts
    var code = (CFG.maDich || {})[p];
    if (code == null) throw new Error('Không có mã biên dịch cho ' + p);
    var fn = new Function('require', 'module', 'exports', code + '\n//# sourceURL=' + p);
    fn(function (s) { return yeuCau(p, s); }, module, module.exports);
    return module.exports;
  }
  function batRoot() {
    var RD = W.ReactDOM;
    if (!RD || RD.__clBoc) return;
    var goc = RD.createRoot;
    if (goc) RD.createRoot = function (c, o) { var r = goc.call(RD, c, o); roots.push(r); return r; };
    RD.__clBoc = true;
  }
  async function chayUngDung() {
    cache = {};
    var vao = CFG.react.tepChinh;
    if (vao && CFG.files[vao] != null) napModule(vao);
    if (CFG.react.renderTu) {
      var m = napModule(CFG.react.renderTu);
      var C = m && (m['default'] || m.App || m);
      var goc = D.getElementById('root');
      if (typeof C === 'function' && goc) { var r = W.ReactDOM.createRoot(goc); r.render(W.React.createElement(C)); }
    }
    await ngu(0); await ngu(30);
  }
  async function batDauReact() {
    // thư viện UMD nạp từ cdn.jsdelivr.net (script thường, đứng trước) — mạng chậm thì chờ thêm chút
    for (var t = 0; t < 300 && (!W.React || !W.ReactDOM); t++) await ngu(50);
    if (!W.React || !W.ReactDOM) throw new Error('Không tải được React từ cdn.jsdelivr.net (mạng?)');
    batRoot();
    bodyGoc = D.body.innerHTML;
    try { await chayUngDung(); } catch (e) { loi.push(fmt(e)); }
    await ngu(60);
  }
  async function napLaiReact() {
    roots.splice(0).forEach(function (r) { try { r.unmount(); } catch (e) { /* bỏ qua */ } });
    D.body.innerHTML = bodyGoc;
    [].slice.call(D.querySelectorAll('style[data-tu]')).forEach(function (s) { s.remove(); });
    try { await chayUngDung(); } catch (e) { loi.push(fmt(e)); }
    await ngu(60);
  }

  // ═══ chạy ═══
  function guiVe(goi) {
    if (daGui) return;
    daGui = true;
    goi.__clCham = CFG.id;
    goi.log = log.slice(0, 200);
    goi.loi = loi.slice(0, 20);
    try { parent.postMessage(goi, '*'); } catch (e) { /* bỏ qua */ }
  }
  async function chay() {
    if (D.readyState !== 'complete') await new Promise(function (r) { W.addEventListener('load', r); _st(r, 4000); });
    await ngu(0);
    // iframe sandbox gốc mờ thường chạy ở TIẾN TRÌNH RIÊNG (Chrome cô lập sandbox) ⇒ kích thước khung nhìn
    // đến SAU sự kiện load: lúc đó innerHeight = 0 và 100vh tính ra 0px. Chờ có kích thước + một khung hình.
    for (var t = 0; t < 150 && (W.innerHeight === 0 || W.innerWidth === 0); t++) await ngu(20);
    await new Promise(function (r) { var xong = false; var k = function () { if (!xong) { xong = true; r(); } }; try { requestAnimationFrame(k); } catch (e) { k(); } _st(k, 100); });
    if (CFG.react) {
      try { await batDauReact(); } catch (e) {
        var ly = fmt(e);
        return guiVe({ ketQua: (CFG.kiem || []).map(function () { return { dat: false, thay: ly }; }), hong: ly });
      }
    }
    var buoc = CFG.truoc || [], tu = CFG.batDauTuBuoc || 0;
    for (var i = tu; i < buoc.length; i++) {
      var h = await lamBuoc(buoc[i]);
      if (h) return guiVe({ ketQua: (CFG.kiem || []).map(function () { return { dat: false, thay: h }; }) });
      if (guiChuaChan) {
        guiChuaChan = false;
        soTaiLai++;
        // trình duyệt thật sẽ TẢI LẠI trang (mất mọi thay đổi DOM/state, còn localStorage):
        //  - react: gỡ app, dựng lại từ đầu với cùng localStorage;
        //  - dom: báo trang mẹ dựng khung mới, chạy tiếp từ bước sau.
        if (CFG.react) await napLaiReact();
        else return guiVe({ taiLai: true, batDauTuBuoc: i + 1 });
      }
    }
    var ketQua = [];
    for (var j = 0; j < (CFG.kiem || []).length; j++) ketQua.push(await kiemCoCho(CFG.kiem[j]));
    guiVe({ ketQua: ketQua });
  }
  chay().catch(function (e) { guiVe({ ketQua: (CFG.kiem || []).map(function () { return { dat: false, thay: 'lỗi tác tử: ' + fmt(e) }; }) }); });
})();
`;
