// lib/hono.js — PROVIDED by the practice grader. A small in-memory stand-in for Hono 4 (hono.dev):
// new Hono(); app.get/post/put/patch/delete(path, handler); handlers receive a Context c and RETURN a
// Response: c.json(data, status?), c.text(text, status?), c.body(null, 204); c.req.param('id'), c.req.query('q'),
// await c.req.json(), c.req.header('x'); app.use(path?, async (c, next) => { …; await next(); … });
// app.route('/api', subApp); app.notFound(c => …); app.onError((err, c) => …).
// Like real Hono, testing is built in: const res = await app.request('/api/x', { method, headers, body }).
(function (G) {
  'use strict';
  var MODS = G.__modules;

  function Res(status, body, headers) {
    var h = {}; Object.keys(headers || {}).forEach(function (k) { h[k.toLowerCase()] = String(headers[k]); });
    this.status = status; this.ok = status >= 200 && status < 300; this._body = body == null ? '' : String(body); this._used = false;
    this.headers = { get: function (k) { var v = h[String(k).toLowerCase()]; return v === undefined ? null : v; }, has: function (k) { return String(k).toLowerCase() in h; }, _all: h };
  }
  Res.prototype.text = function () { if (this._used) return Promise.reject(new TypeError('Body is unusable: Body has already been read')); this._used = true; return Promise.resolve(this._body); };
  Res.prototype.json = function () { return this.text().then(function (t) { return JSON.parse(t); }); };

  function compile(path) {
    var keys = [];
    var src = String(path).replace(/\/+$/, '') || '';
    var re = src.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\\\?/g, '?').replace(/:(\w+)/g, function (m, k) { keys.push(k); return '([^/]+)'; }).replace(/\*/g, '.*');
    return { re: new RegExp('^' + re + '/?$'), keys: keys };
  }

  function Hono() {
    this.routes = [];      // { method, path, re, keys, handler, mw }
    this._notFound = function (c) { return c.text('404 Not Found', 404); };
    this._onError = function (err, c) { if (err && typeof err.getResponse === 'function') return err.getResponse(); return c.text('Internal Server Error', 500); };
  }
  ['get', 'post', 'put', 'patch', 'delete', 'all'].forEach(function (m) {
    Hono.prototype[m] = function (path) {
      var hs = [].slice.call(arguments, 1); var self = this;
      hs.forEach(function (h, i) { var c = compile(path); self.routes.push({ method: m.toUpperCase(), path: path, re: c.re, keys: c.keys, handler: h, mw: i < hs.length - 1 }); });
      return this;
    };
  });
  Hono.prototype.use = function (path, fn) {
    if (typeof path === 'function') { fn = path; path = '*'; }
    var c = compile(path === '*' ? '*' : path.replace(/\/\*$/, '') + '*');
    this.routes.push({ method: 'ALL', path: path, re: path === '*' ? /.*/ : new RegExp('^' + String(path).replace(/\/\*$/, '').replace(/[.+?^${}()|[\]\\]/g, '\\$&') + '(/.*)?$'), keys: c.keys, handler: fn, mw: true });
    return this;
  };
  Hono.prototype.route = function (base, sub) {
    var self = this; var b = String(base).replace(/\/+$/, '');
    sub.routes.forEach(function (r) {
      var p = r.path === '*' ? b + '/*' : b + (r.path === '/' ? '' : r.path);
      var c = compile(p);
      self.routes.push({ method: r.method, path: p, re: r.path === '*' ? new RegExp('^' + b.replace(/[.+?^${}()|[\]\\]/g, '\\$&') + '(/.*)?$') : c.re, keys: c.keys, handler: r.handler, mw: r.mw });
    });
    return this;
  };
  Hono.prototype.notFound = function (fn) { this._notFound = fn; return this; };
  Hono.prototype.onError = function (fn) { this._onError = fn; return this; };
  Hono.prototype.request = function (input, init) {
    var self = this; init = init || {};
    var url = new URL(String(input), 'http://localhost');
    var method = String(init.method || 'GET').toUpperCase();
    var reqHeaders = {}; Object.keys(init.headers || {}).forEach(function (k) { reqHeaders[k.toLowerCase()] = String(init.headers[k]); });
    var raw = init.body == null ? null : String(init.body);
    var vars = {}; var resHeaders = {}; var statusSet = null; var params = {};
    var c = {
      req: {
        method: method, url: url.href, path: url.pathname,
        param: function (k) { return k === undefined ? Object.assign({}, params) : params[k]; },
        query: function (k) { if (k === undefined) { var o = {}; url.searchParams.forEach(function (v, kk) { o[kk] = v; }); return o; } var v = url.searchParams.get(k); return v === null ? undefined : v; },
        header: function (k) { if (k === undefined) return Object.assign({}, reqHeaders); return reqHeaders[String(k).toLowerCase()]; },
        json: function () { return new Promise(function (ok, ko) { try { ok(JSON.parse(raw == null ? '' : raw)); } catch (e) { ko(e); } }); },
        text: function () { return Promise.resolve(raw == null ? '' : raw); },
      },
      set: function (k, v) { vars[k] = v; }, get: function (k) { return vars[k]; }, var: vars,
      header: function (k, v) { resHeaders[k] = v; },
      status: function (s) { statusSet = s; },
      json: function (data, status, headers) { return new Res(status || statusSet || 200, JSON.stringify(data), Object.assign({ 'content-type': 'application/json' }, resHeaders, headers || {})); },
      text: function (t, status, headers) { return new Res(status || statusSet || 200, t, Object.assign({ 'content-type': 'text/plain;charset=UTF-8' }, resHeaders, headers || {})); },
      html: function (t, status) { return new Res(status || statusSet || 200, t, Object.assign({ 'content-type': 'text/html; charset=UTF-8' }, resHeaders)); },
      body: function (b, status) { return new Res(status || statusSet || 200, b == null ? '' : b, Object.assign({}, resHeaders)); },
      redirect: function (loc, status) { return new Res(status || 302, '', Object.assign({ location: loc }, resHeaders)); },
      notFound: function () { return self._notFound(c); },
      res: null,
    };
    var chain = this.routes.filter(function (r) { return (r.method === 'ALL' || r.method === method) && r.re.test(url.pathname); });
    var hasHandler = chain.some(function (r) { return !r.mw; });
    function paramsOf(r) { var m = r.re.exec(url.pathname); var p = {}; if (m) r.keys.forEach(function (k, i) { if (m[i + 1] !== undefined) p[k] = decodeURIComponent(m[i + 1]); }); return p; }
    function dispatch(i) {
      var r = chain[i];
      if (!r) return Promise.resolve(hasHandler ? c.res : self._notFound(c));
      params = paramsOf(r);
      return Promise.resolve().then(function () {
        var out = r.handler(c, function () { return dispatch(i + 1).then(function (res) { if (res) c.res = res; }); });
        return Promise.resolve(out).then(function (res) {
          if (res instanceof Res) { c.res = res; return res; }
          if (r.mw) return c.res;          // middleware that called await next()
          throw new Error('Context is not finalized. Did you forget to return a Response object or `await next()`?');
        });
      }).then(null, function (err) {
        // like Hono's compose: an error becomes the onError response, and outer middleware keeps running
        return Promise.resolve(self._onError(err, c)).then(function (res) { c.res = res; return res; });
      });
    }
    return dispatch(0).then(function (res) {
      if (!res) res = self._notFound(c);
      Object.keys(resHeaders).forEach(function (k) { res.headers._all[k.toLowerCase()] = String(resHeaders[k]); });
      return res;
    }, function (err) { return Promise.resolve(self._onError(err, c)); });
  };
  function HTTPException(status, o) { var e = new Error((o && o.message) || ''); e.name = 'HTTPException'; e.status = status; e.getResponse = function () { return new Res(status, e.message, { 'content-type': 'text/plain;charset=UTF-8' }); }; return e; }
  MODS.hono = { Hono: Hono };
  MODS['hono/http-exception'] = { HTTPException: HTTPException };
  G.__honoRes = function (r) { return r.text().then(function (t) { var ct = r.headers.get('content-type') || ''; var b = t; if (/json/.test(ct)) { try { b = JSON.parse(t); } catch (e) { /* text */ } } return { status: r.status, body: b }; }); };
})(globalThis);
