// lib/express.js — PROVIDED by the practice grader. An in-memory stand-in for Express 4 (the version in the
// lesson): express(), app.use / get / post / put / patch / delete, express.Router(), express.json(),
// express.urlencoded(), express.static(), error handlers detected by their 4 parameters, route order,
// req.params / req.query / req.body, res.status().json(), res.send(), res.sendStatus(), res.redirect(),
// res.cookie(), res.render(), res.download(). Like Express 4, a REJECTED PROMISE from an async handler is
// NOT sent to your error handler (Express 5 does that) — the request just hangs until the client gives up.
// Instead of listening on a port, the grader sends requests with  await app.inject({ method, url, headers, body }).
(function (G) {
  'use strict';
  var MODS = G.__modules;
  var EventEmitter = MODS.events;
  var STATUS = { 100: 'Continue', 200: 'OK', 201: 'Created', 202: 'Accepted', 204: 'No Content', 301: 'Moved Permanently', 302: 'Found', 303: 'See Other', 304: 'Not Modified', 307: 'Temporary Redirect', 308: 'Permanent Redirect',
    400: 'Bad Request', 401: 'Unauthorized', 403: 'Forbidden', 404: 'Not Found', 405: 'Method Not Allowed', 409: 'Conflict', 410: 'Gone', 413: 'Payload Too Large', 415: 'Unsupported Media Type', 422: 'Unprocessable Entity', 429: 'Too Many Requests',
    500: 'Internal Server Error', 501: 'Not Implemented', 502: 'Bad Gateway', 503: 'Service Unavailable' };
  G.__STATUS = STATUS;
  var MIME = { '.html': 'text/html; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.json': 'application/json; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.pdf': 'application/pdf', '.csv': 'text/csv; charset=utf-8', '.svg': 'image/svg+xml' };
  function headersSentError() { var e = new Error('Cannot set headers after they are sent to the client'); e.code = 'ERR_HTTP_HEADERS_SENT'; return e; }

  /* ═══════════ request ═══════════ */
  function Req(init, app) {
    init = init || {};
    var url = init.url || '/';
    this._ev = {};
    this.app = app;
    this.method = String(init.method || 'GET').toUpperCase();
    this.url = url; this.originalUrl = url; this.baseUrl = '';
    var h = {}; var ih = init.headers || {};
    Object.keys(ih).forEach(function (k) { h[k.toLowerCase()] = String(ih[k]); });
    var raw = init.body;
    if (raw !== undefined && raw !== null && typeof raw !== 'string') { raw = JSON.stringify(raw); if (!h['content-type']) h['content-type'] = 'application/json'; }
    if (raw !== undefined && raw !== null) h['content-length'] = String(raw.length);
    if (init.cookies) h.cookie = Object.keys(init.cookies).map(function (k) { return k + '=' + init.cookies[k]; }).join('; ');
    this.headers = h;
    this._raw = raw === undefined ? null : raw;
    this.body = init.parsedBody !== undefined ? init.parsedBody : undefined;
    this.params = {};
    this.ip = init.ip || '127.0.0.1';
    this.protocol = init.protocol || 'http';
    this.secure = this.protocol === 'https';
    this.hostname = (h.host || 'localhost').split(':')[0];
    if (init.user !== undefined) this.user = init.user;
    if (init.session !== undefined) this.session = init.session;
    if (init.file !== undefined) this._file = init.file;
    if (init.files !== undefined) this._files = init.files;
    this._setUrl(url);
  }
  Req.prototype = Object.create(EventEmitter.prototype);
  Req.prototype._setUrl = function (url) {
    this.url = url;
    var q = url.indexOf('?');
    this.path = q < 0 ? url : url.slice(0, q);
    if (this.query === undefined) {
      var out = {};
      new URLSearchParams(q < 0 ? '' : url.slice(q + 1)).forEach(function (v, k) { if (Object.prototype.hasOwnProperty.call(out, k)) out[k] = [].concat(out[k], v); else out[k] = v; });
      this.query = out;
    }
  };
  Req.prototype.get = Req.prototype.header = function (name) { var n = String(name).toLowerCase(); if (n === 'referer' || n === 'referrer') return this.headers.referer || this.headers.referrer; return this.headers[n]; };
  Req.prototype.is = function (t) { var ct = (this.headers['content-type'] || '').split(';')[0].trim(); if (!ct) return null; if (t === 'json') t = 'application/json'; if (t === 'urlencoded') t = 'application/x-www-form-urlencoded'; return ct === t || (t.slice(-2) === '/*' && ct.indexOf(t.slice(0, -1)) === 0) ? ct : false; };

  /* ═══════════ response ═══════════ */
  function Res(req, app, onFinish) {
    EventEmitter.call(this);
    this.req = req; this.app = app; this.statusCode = 200; this._h = {}; this.finished = false; this.headersSent = false; this.locals = {};
    this._body = undefined; this._json = false; this._onFinish = onFinish;
  }
  Res.prototype = Object.create(EventEmitter.prototype);
  Res.prototype._guard = function () { if (this.headersSent) throw headersSentError(); };
  Res.prototype.status = function (c) { this.statusCode = Number(c); return this; };
  Res.prototype.set = Res.prototype.header = function (k, v) {
    if (k && typeof k === 'object') { var self = this; Object.keys(k).forEach(function (x) { self.set(x, k[x]); }); return this; }
    this._guard();
    this._h[String(k).toLowerCase()] = Array.isArray(v) ? v.map(String) : String(v);
    return this;
  };
  Res.prototype.setHeader = function (k, v) { this._guard(); this._h[String(k).toLowerCase()] = Array.isArray(v) ? v.map(String) : String(v); return this; };
  Res.prototype.get = Res.prototype.getHeader = function (k) { return this._h[String(k).toLowerCase()]; };
  Res.prototype.removeHeader = function (k) { this._guard(); delete this._h[String(k).toLowerCase()]; };
  Res.prototype.getHeaders = function () { return Object.assign({}, this._h); };
  Res.prototype.hasHeader = function (k) { return String(k).toLowerCase() in this._h; };
  Res.prototype.append = function (k, v) { var cur = this.get(k); var add = [].concat(v); return this.set(k, cur === undefined ? (add.length === 1 ? add[0] : add) : [].concat(cur, add)); };
  Res.prototype.vary = function (f) { var cur = this.get('vary'); if (!cur) return this.set('Vary', f); if (cur.split(/\s*,\s*/).indexOf(f) < 0) this.set('Vary', cur + ', ' + f); return this; };
  Res.prototype.type = Res.prototype.contentType = function (t) { var m = t.indexOf('/') >= 0 ? t : (MIME['.' + t.replace(/^\./, '')] || t); return this.set('Content-Type', m); };
  Res.prototype.location = function (u) { return this.set('Location', u); };
  Res.prototype.attachment = function (fn) { if (fn) this.type(MODS.path.extname(fn) || 'txt'); return this.set('Content-Disposition', fn ? 'attachment; filename="' + MODS.path.basename(fn) + '"' : 'attachment'); };
  Res.prototype._finish = function (body) {
    if (this.headersSent) throw headersSentError();
    this.headersSent = true; this.finished = true; this.writableEnded = true;
    if (body !== undefined) this._body = (this._body || '') + body;
    var self = this;
    this.emit('finish');
    if (this._onFinish) this._onFinish(self);
  };
  Res.prototype.writeHead = function (code, h) { this._guard(); this.statusCode = code; var self = this; Object.keys(h || {}).forEach(function (k) { self._h[k.toLowerCase()] = String(h[k]); }); return this; };
  Res.prototype.write = function (chunk) { this._body = (this._body || '') + String(chunk); return true; };
  Res.prototype.end = function (chunk) { this._finish(chunk === undefined ? undefined : String(chunk)); return this; };
  Res.prototype.json = function (obj) {
    this._guard();
    var s = JSON.stringify(obj);
    if (!this.get('content-type')) this.set('Content-Type', 'application/json; charset=utf-8');
    this._json = true;
    this._finish(s === undefined ? '' : s);
    return this;
  };
  Res.prototype.send = function (b) {
    this._guard();
    if (typeof b === 'number' && arguments.length === 1) { this.statusCode = b; b = STATUS[b] || String(b); }
    if (b === null || b === undefined) { this._finish(''); return this; }
    if (typeof b === 'object' && !b.__buffer) return this.json(b);
    if (typeof b === 'boolean') return this.json(b);
    if (!this.get('content-type')) this.set('Content-Type', b.__buffer ? 'application/octet-stream' : 'text/html; charset=utf-8');
    if (this.statusCode === 204 || this.statusCode === 304) { this._finish(''); return this; }
    this._finish(String(b));
    return this;
  };
  Res.prototype.sendStatus = function (c) { this.statusCode = c; if (c === 204 || c === 304) { this._finish(''); return this; } this.set('Content-Type', 'text/plain; charset=utf-8'); this._finish(STATUS[c] || String(c)); return this; };
  Res.prototype.redirect = function (a, b) { var code = typeof a === 'number' ? a : 302; var url = typeof a === 'number' ? b : a; this.statusCode = code; this.set('Location', url); this.set('Content-Type', 'text/plain; charset=utf-8'); this._finish((STATUS[code] || 'Found') + '. Redirecting to ' + url); return this; };
  Res.prototype.cookie = function (name, val, o) {
    o = Object.assign({ path: '/' }, o || {});
    var v = typeof val === 'object' ? 'j:' + JSON.stringify(val) : String(val);
    var s = name + '=' + encodeURIComponent(v);
    if (o.maxAge != null) { s += '; Max-Age=' + Math.floor(o.maxAge / 1000); }
    if (o.domain) s += '; Domain=' + o.domain;
    if (o.path) s += '; Path=' + o.path;
    if (o.maxAge != null) s += '; Expires=' + new Date(Date.now() + o.maxAge).toUTCString();
    else if (o.expires) s += '; Expires=' + new Date(o.expires).toUTCString();
    if (o.httpOnly) s += '; HttpOnly';
    if (o.sameSite) s += '; SameSite=' + (o.sameSite === true ? 'Strict' : String(o.sameSite).charAt(0).toUpperCase() + String(o.sameSite).slice(1).toLowerCase());
    if (o.secure) s += '; Secure';
    return this.append('Set-Cookie', s);
  };
  Res.prototype.clearCookie = function (name, o) { return this.append('Set-Cookie', name + '=; Path=' + ((o && o.path) || '/') + '; Expires=Thu, 01 Jan 1970 00:00:00 GMT'); };
  Res.prototype.sendFile = function (p, o, cb) {
    if (typeof o === 'function') { cb = o; }
    var data = G.__disk.get(p);
    var self = this;
    if (data === undefined) {
      var e = new Error("ENOENT: no such file or directory, stat '" + p + "'"); e.code = 'ENOENT'; e.status = e.statusCode = 404;
      if (cb) return cb(e);
      return this.req.next ? this.req.next(e) : undefined;
    }
    if (!this.get('content-type')) this.set('Content-Type', MIME[MODS.path.extname(p).toLowerCase()] || 'application/octet-stream');
    this._finish(data);
    if (cb) cb();
    void self;
  };
  Res.prototype.download = function (p, filename, cb) {
    if (typeof filename === 'function') { cb = filename; filename = null; }
    if (G.__disk.get(p) !== undefined) this.set('Content-Disposition', 'attachment; filename="' + (filename || MODS.path.basename(p)) + '"');
    return this.sendFile(p, cb);
  };
  Res.prototype.render = function (view, locals, cb) {
    if (typeof locals === 'function') { cb = locals; locals = {}; }
    var app = this.app; var self = this;
    var html;
    try { html = renderView(app, view, Object.assign({}, app && app.locals, this.locals, locals || {})); } catch (e) { if (cb) return cb(e); throw e; }
    if (cb) return cb(null, html);
    this.set('Content-Type', 'text/html; charset=utf-8');
    this._finish(html);
    void self;
  };
  function renderView(app, view, data) {
    var views = app && app.get('views');
    var engine = (app && app.get('view engine')) || '';
    if (!views || typeof views !== 'object') throw new Error('No views registered — in this practice use app.set("views", { name: "template text" }).');
    var name = view; var ext = '';
    var m = /\.(\w+)$/.exec(view); if (m) { ext = m[1]; name = view.slice(0, -m[0].length); }
    var tpl = views[view] !== undefined ? views[view] : views[name] !== undefined ? views[name] : views[name + '.' + engine];
    if (tpl === undefined) { var e = new Error('Failed to lookup view "' + view + '" in views directory "views"'); e.view = view; throw e; }
    var eng = ext || engine;
    if (eng === 'ejs') return MODS.ejs.render(tpl, data);
    if (eng === 'hbs' || eng === 'handlebars') return MODS.handlebars.compile(tpl)(data);
    throw new Error('No default engine was specified and no extension was provided.');
  }

  /* ═══════════ routing ═══════════ */
  function compilePath(p, end) {
    if (p instanceof RegExp) return { re: p, keys: [] };
    var keys = [];
    var src = String(p).replace(/\/+$/, '');
    var re = '';
    var i = 0;
    while (i < src.length) {
      var ch = src.charAt(i);
      if (ch === ':') {
        var m = /^:(\w+)(\?)?/.exec(src.slice(i));
        keys.push(m[1]);
        var prevSlash = re.slice(-1) === '/';
        if (m[2] && prevSlash) { re = re.slice(0, -1) + '(?:/([^/]+?))?'; } else re += '([^/]+?)';
        i += m[0].length; continue;
      }
      if (ch === '*') { keys.push(String(keys.length)); re += '(.*)'; i++; continue; }
      re += /[.+?^${}()|[\]\\]/.test(ch) ? '\\' + ch : ch;
      i++;
    }
    return { re: new RegExp('^' + re + (end ? '\\/?$' : '(?=\\/|$)'), 'i'), keys: keys };
  }
  function Layer(path, fn, opts) {
    this.path = path; this.fn = fn; this.method = opts.method || null; this.isRoute = !!opts.route; this.handlers = opts.handlers;
    var c = compilePath(path === '/' && !opts.route ? '' : path, !!opts.route);
    this.re = c.re; this.keys = c.keys;
  }
  Layer.prototype.match = function (p) {
    var m = this.re.exec(p);
    if (!m) return null;
    var params = {};
    for (var i = 0; i < this.keys.length; i++) { if (m[i + 1] !== undefined) { try { params[this.keys[i]] = decodeURIComponent(m[i + 1]); } catch (e) { params[this.keys[i]] = m[i + 1]; } } }
    return { params: params, matched: m[0] };
  };
  function callFn(fn, err, req, res, next) {
    var r;
    try {
      if (err) { if (fn.length === 4) r = fn(err, req, res, next); else return next(err); }
      else { if (fn.length === 4) return next(); r = fn(req, res, next); }
    } catch (e) { return next(e); }
    if (r && typeof r.then === 'function') {
      r.then(null, function (e) {
        // Express 4: nobody catches this. The request is left hanging.
        (G.__unhandled = G.__unhandled || []).push(e && e.name ? e.name + ': ' + e.message : String(e));
      });
    }
  }
  var METHODS = ['get', 'post', 'put', 'patch', 'delete', 'options', 'head', 'all'];
  function makeRouter() {
    function router(req, res, next) { router.handle(req, res, next); }
    router.stack = [];
    router.__isRouter = true;
    router.use = function () {
      var args = [].slice.call(arguments);
      var path = '/';
      if (typeof args[0] === 'string' || args[0] instanceof RegExp || Array.isArray(args[0])) path = args.shift();
      var fns = [].concat.apply([], args);
      if (!fns.length) throw new TypeError('app.use() requires a middleware function');
      fns.forEach(function (fn) {
        if (typeof fn !== 'function') throw new TypeError('app.use() requires a middleware function but got a ' + (fn === null ? 'null' : typeof fn));
        [].concat(path).forEach(function (p) { router.stack.push(new Layer(p, fn, {})); });
      });
      return router;
    };
    router.route = function (path) {
      var r = {};
      METHODS.forEach(function (m) { r[m] = function () { router[m].apply(router, [path].concat([].slice.call(arguments))); return r; }; });
      return r;
    };
    METHODS.forEach(function (m) {
      var orig = router[m];
      router[m] = function (path) {
        if (m === 'get' && arguments.length === 1 && typeof path === 'string' && router.__settings) return router.__settings[path];
        var fns = [].concat.apply([], [].slice.call(arguments, 1));
        if (!fns.length) throw new TypeError('Route.' + m + '() requires a callback function but got a [object Undefined]');
        fns.forEach(function (f) { if (typeof f !== 'function') throw new TypeError('Route.' + m + '() requires a callback function but got a [object ' + (f === undefined ? 'Undefined' : f === null ? 'Null' : typeof f === 'object' ? 'Object' : typeof f) + ']'); });
        [].concat(path).forEach(function (p) { router.stack.push(new Layer(p, null, { method: m, route: true, handlers: fns })); });
        void orig;
        return router;
      };
    });
    router.handle = function (req, res, out) {
      var idx = 0;
      var parentUrl = req.url, parentBase = req.baseUrl;
      function next(err) {
        if (err === 'router') { req._setUrl(parentUrl); req.baseUrl = parentBase; return out(); }
        if (err === 'route') err = undefined;
        var layer = router.stack[idx++];
        if (!layer) { req._setUrl(parentUrl); req.baseUrl = parentBase; return out(err); }
        var pathOnly = req.url.split('?')[0];
        var m = layer.match(pathOnly);
        if (!m) return next(err);
        if (layer.isRoute) {
          if (layer.method !== 'all' && layer.method.toUpperCase() !== req.method && !(req.method === 'HEAD' && layer.method === 'get')) {
            if (req.method === 'OPTIONS') { req._allow = req._allow || []; [layer.method.toUpperCase()].concat(layer.method === 'get' ? ['HEAD'] : []).forEach(function (m) { if (req._allow.indexOf(m) < 0) req._allow.push(m); }); }
            return next(err);
          }
          req.params = m.params;
          var hi = 0;
          var routeNext = function (e) {
            if (e === 'route') return next();
            if (e === 'router') return next('router');
            var fn = layer.handlers[hi++];
            if (!fn) return next(e);
            req.next = routeNext;
            callFn(fn, e, req, res, routeNext);
          };
          return routeNext(err);
        }
        // middleware / mounted router: strip the mount path
        var removed = m.matched.replace(/\/$/, '');
        var savedUrl = req.url, savedBase = req.baseUrl;
        var rest = req.url.slice(removed.length);
        if (rest.charAt(0) !== '/') rest = '/' + rest;
        req.baseUrl = savedBase + removed;
        req._setUrl(rest);
        if (layer.fn.__isRouter || Object.keys(m.params).length) req.params = Object.assign({}, req.params, m.params);
        var restore = function (e) { req._setUrl(savedUrl); req.baseUrl = savedBase; next(e); };
        req.next = restore;
        callFn(layer.fn, err, req, res, restore);
      }
      next();
    };
    return router;
  }

  function finalHandler(req, res, finish) {
    return function (err) {
      if (res.headersSent) return;
      if (err) {
        var code = err.status || err.statusCode;
        if (!(code >= 400 && code < 600)) code = 500;
        res.statusCode = code;
        res._h = { 'content-type': 'text/html; charset=utf-8' };
        res._uncaught = { name: err.name || 'Error', message: String(err.message || err) };
        res._finish(STATUS[code] || 'Error');
      } else if (req.method === 'OPTIONS' && req._allow && req._allow.length) {
        // Express answers OPTIONS by itself with the methods that exist for this path
        var allow = req._allow.join(',');
        res.statusCode = 200; res._h.allow = allow; res._h['content-type'] = 'text/html; charset=utf-8';
        res._finish(allow);
      } else {
        res.statusCode = 404;
        res._h = { 'content-type': 'text/html; charset=utf-8' };
        res._finish('Cannot ' + req.method + ' ' + req.originalUrl.split('?')[0]);
      }
      void finish;
    };
  }
  function resultOf(res, extra) {
    var body = res._body;
    var ct = res.get('content-type') || '';
    if (body !== undefined && /json/.test(ct)) { try { body = body === '' ? '' : JSON.parse(body); } catch (e) { /* keep text */ } }
    var r = { status: res.finished ? res.statusCode : null, headers: Object.assign({}, res._h), body: body };
    if (res._uncaught) r.error = res._uncaught;
    if (extra) Object.keys(extra).forEach(function (k) { r[k] = extra[k]; });
    return r;
  }

  function express() {
    var app = makeRouter();
    var settings = { 'x-powered-by': true, env: 'production' };
    app.__settings = settings;
    app.locals = {};
    app.set = function (k, v) { if (arguments.length === 1) return settings[k]; settings[k] = v; return app; };
    var getRoute = app.get;
    app.get = function (k) { if (arguments.length === 1 && typeof k === 'string') return settings[k]; return getRoute.apply(app, arguments); };
    app.enable = function (k) { settings[k] = true; return app; };
    app.disable = function (k) { settings[k] = false; return app; };
    app.enabled = function (k) { return !!settings[k]; };
    app.engine = function () { return app; };
    app.listen = function (port, a, b) {
      var cb = typeof a === 'function' ? a : b;
      app.__port = port;
      (G.__listening = G.__listening || []).push(port);
      var server = { address: function () { return { port: port }; }, close: function (f) { if (f) f(); }, on: function () { return server; } };
      if (cb) G.setTimeout(cb, 0);
      return server;
    };
    app.inject = function (init) {
      return new Promise(function (resolve) {
        var done = false; var timer;
        var req = new Req(init, app);
        var finish = function (r) { if (done) return; done = true; G.clearTimeout(timer); resolve(resultOf(r)); };
        var res = new Res(req, app, finish);
        req.res = res;
        if (settings['x-powered-by']) res._h['x-powered-by'] = 'Express';
        timer = G.setTimeout(function () { if (done) return; done = true; resolve({ status: null, headers: {}, body: undefined, timedOut: true, unhandled: (G.__unhandled || []).slice() }); }, (init && init.timeoutMs) || 30000);
        app.handle(req, res, finalHandler(req, res, finish));
      });
    };
    return app;
  }
  express.Router = function () { return makeRouter(); };
  express.json = function (o) {
    o = o || {};
    var limit = o.limit ? parseSize(o.limit) : 100 * 1024;
    return function jsonParser(req, res, next) {
      if (req._bodyParsed) return next();
      req._bodyParsed = true;
      if (req.body === undefined) req.body = {};
      var ct = (req.headers['content-type'] || '').split(';')[0].trim().toLowerCase();
      if (!/^application\/(.+\+)?json$/.test(ct) || req._raw == null || req._raw === '') { if (req._raw != null && ct.indexOf('json') < 0) req._bodyParsed = false; return next(); }
      if (req._raw.length > limit) { var e1 = new Error('request entity too large'); e1.status = e1.statusCode = 413; e1.type = 'entity.too.large'; e1.expose = true; return next(e1); }
      var first = req._raw.trim().charAt(0);
      try {
        if (o.strict !== false && first !== '{' && first !== '[') throw new SyntaxError('Unexpected token ' + first + ' in JSON (strict mode: only objects and arrays)');
        req.body = JSON.parse(req._raw);
      } catch (e) {
        var err = new SyntaxError(e.message); err.status = err.statusCode = 400; err.type = 'entity.parse.failed'; err.body = req._raw; err.expose = true;
        return next(err);
      }
      next();
    };
  };
  express.urlencoded = function () {
    return function urlencodedParser(req, res, next) {
      if (req.body === undefined) req.body = {};
      var ct = (req.headers['content-type'] || '').split(';')[0].trim().toLowerCase();
      if (ct !== 'application/x-www-form-urlencoded' || req._raw == null) return next();
      var out = {};
      new URLSearchParams(req._raw).forEach(function (v, k) { out[k] = Object.prototype.hasOwnProperty.call(out, k) ? [].concat(out[k], v) : v; });
      req.body = out; req._bodyParsed = true;
      next();
    };
  };
  express.static = function (root) {
    return function serveStatic(req, res, next) {
      if (req.method !== 'GET' && req.method !== 'HEAD') return next();
      var p = MODS.path.join(root, decodeURIComponent(req.path));
      if (G.__disk.get(p) === undefined) return next();
      res.sendFile(MODS.path.resolve(p));
    };
  };
  function parseSize(s) { if (typeof s === 'number') return s; var m = /^(\d+(?:\.\d+)?)\s*(b|kb|mb|gb)?$/i.exec(String(s)); if (!m) return 100 * 1024; var mul = { b: 1, kb: 1024, mb: 1048576, gb: 1073741824 }[(m[2] || 'b').toLowerCase()]; return Math.floor(parseFloat(m[1]) * mul); }
  G.__parseSize = parseSize;
  express.__Req = Req; express.__Res = Res;
  G.express = express;
  MODS.express = express;

  /* ═══════════ unit-testing ONE handler / middleware (what the grader does in many checks) ═══════════
     __goi(fn, reqInit, opts) runs fn(req, res, next) and resolves with what happened:
     { status (null if nothing was sent), body, headers, next: null | true | { name, message, status }, thrown } */
  G.__goi = function (fn, init, opts) {
    opts = opts || {};
    return new Promise(function (resolve) {
      var req = new Req(init, opts.app || null);
      if (init && init.body !== undefined && init.raw !== true) { req.body = typeof init.body === 'string' ? init.body : JSON.parse(JSON.stringify(init.body)); }
      if (init && init.params) req.params = Object.assign({}, init.params);
      if (init && init.locals) Object.keys(init.locals).forEach(function (k) { req[k] = init.locals[k]; });
      var settled = false; var nextVal = null; var thrown = null; var timer;
      var res = new Res(req, opts.app || { get: function () { return undefined; }, locals: {} }, function () { G.setTimeout(end, 0); });
      if (opts.views) res.app = { get: function (k) { return k === 'views' ? opts.views : k === 'view engine' ? opts.engine : undefined; }, locals: {} };
      req.res = res;
      function end() {
        if (settled) return; settled = true; G.clearTimeout(timer);
        var r = resultOf(res);
        resolve({ status: r.status, body: r.body, headers: r.headers, next: nextVal, thrown: thrown, req: { user: req.user === undefined ? null : G.__json(req.user), body: G.__json(req.body) } });
      }
      var next = function (e) {
        if (e === undefined || e === null) nextVal = true;
        else nextVal = e instanceof Error || (e && e.message) ? { name: e.name || 'Error', message: String(e.message), status: e.status || e.statusCode || null } : { value: String(e) };
        G.setTimeout(end, 0);
      };
      req.next = next;
      timer = G.setTimeout(end, opts.timeoutMs || 5000);
      var r;
      try { r = fn.length === 4 && opts.err !== undefined ? fn(opts.err, req, res, next) : fn(req, res, next); }
      catch (e) { thrown = { name: e.name || 'Error', message: String(e.message) }; G.setTimeout(end, 0); return; }
      if (r && typeof r.then === 'function') r.then(function () { G.setTimeout(end, 0); }, function (e) { thrown = { name: (e && e.name) || 'Error', message: String(e && e.message) }; G.setTimeout(end, 0); });
      else if (!res.finished && nextVal === null) { /* sync handler that did nothing yet: wait for timers */ }
    });
  };
  G.__res = function (r) { return { status: r.status, body: r.body }; };
})(globalThis);
