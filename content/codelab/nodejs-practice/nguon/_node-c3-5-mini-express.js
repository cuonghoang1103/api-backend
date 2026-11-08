/* mini-express.js — a small, faithful subset of Express 5, so Express code runs inside the browser grader.
 * You do not need to edit this file. Write your code in the other file exactly as you would with real Express.
 *
 *   express()                 app.use([path], ...fns) · app.get/post/put/patch/delete/all(path, ...fns)
 *                             app.disable('x-powered-by') · app.set(k, v) · app.get(k)
 *   express.Router({ mergeParams })   the same methods, mounted with app.use('/prefix', router)
 *   express.json({ limit })   parses a JSON body into req.body (400 entity.parse.failed · 413 entity.too.large)
 *   req   method · url · originalUrl · baseUrl · path · query · params · headers · body · get(name)
 *   res   status() · set() · get() · location() · type() · json() · send() · sendStatus() · end()
 *         headersSent · statusCode · locals · on('finish', fn)
 *   request(app, method, url, { body, headers, timeoutMs })  — a tiny supertest: resolves to
 *         { status, headers, text, body } when the response ends, or { status: 0, timedOut: true }
 *         when nothing answers within timeoutMs (default 5000 ms of the grader's virtual clock).
 * Not included: ETag, express.static, view engines, app.listen (export createApp() instead — lesson 5.5).
 */
var express = (function () {
  'use strict';
  var STATUS = { 200: 'OK', 201: 'Created', 202: 'Accepted', 204: 'No Content', 301: 'Moved Permanently', 302: 'Found', 304: 'Not Modified', 400: 'Bad Request', 401: 'Unauthorized', 403: 'Forbidden', 404: 'Not Found', 405: 'Method Not Allowed', 409: 'Conflict', 413: 'Payload Too Large', 415: 'Unsupported Media Type', 422: 'Unprocessable Entity', 429: 'Too Many Requests', 500: 'Internal Server Error', 503: 'Service Unavailable' };
  var METHODS = ['get', 'post', 'put', 'patch', 'delete'];

  function utf8Len(s) {
    var n = 0;
    for (var i = 0; i < s.length; i++) {
      var c = s.charCodeAt(i);
      if (c < 0x80) n += 1; else if (c < 0x800) n += 2;
      else if (c >= 0xd800 && c <= 0xdbff && i + 1 < s.length) { n += 4; i++; } else n += 3;
    }
    return n;
  }
  function headersSentError() {
    var e = new Error('Cannot set headers after they are sent to the client');
    e.code = 'ERR_HTTP_HEADERS_SENT';
    return e;
  }
  function decode(s) { try { return decodeURIComponent(s); } catch (e) { return s; } }
  // Express 5 default query parser = node:querystring — repeated key ⇒ array, '+' ⇒ space, everything a string
  function parseQuery(qs) {
    var out = Object.create(null);
    if (!qs) return out;
    qs.split('&').forEach(function (part) {
      if (!part) return;
      var i = part.indexOf('=');
      var k = decode((i < 0 ? part : part.slice(0, i)).replace(/\+/g, ' '));
      var v = i < 0 ? '' : decode(part.slice(i + 1).replace(/\+/g, ' '));
      if (!(k in out)) out[k] = v;
      else if (Array.isArray(out[k])) out[k].push(v);
      else out[k] = [out[k], v];
    });
    return out;
  }
  function splitUrl(u) { var i = u.indexOf('?'); return i < 0 ? [u, ''] : [u.slice(0, i), u.slice(i + 1)]; }
  function parseBytes(v) {
    if (typeof v === 'number') return v;
    var m = /^(\d+(?:\.\d+)?)\s*(b|kb|mb|gb)?$/i.exec(String(v || '100kb'));
    if (!m) return 102400;
    return Math.floor(parseFloat(m[1]) * { b: 1, kb: 1024, mb: 1048576, gb: 1073741824 }[(m[2] || 'b').toLowerCase()]);
  }

  // ── path patterns (path-to-regexp 8 subset): literals, :name, *name; case-insensitive; trailing slash optional ──
  function compile(path, end) {
    if (typeof path !== 'string') throw new TypeError('path must be a string');
    var keys = [], re = '', i = 0;
    while (i < path.length) {
      var ch = path[i];
      if (ch === ':' || ch === '*') {
        var m = /^[A-Za-z_$][A-Za-z0-9_$]*/.exec(path.slice(i + 1));
        if (!m) throw new TypeError('Missing parameter name at index ' + (i + 1) + ': ' + path + '; visit https://git.new/pathToRegexpError for info');
        keys.push({ name: m[0], splat: ch === '*' });
        re += ch === '*' ? '(.+)' : '([^\\/]+?)';
        i += 1 + m[0].length;
      } else if ('()[]?+!{}'.indexOf(ch) >= 0) {
        throw new TypeError('Unexpected ' + ch + ' at index ' + i + ': ' + path + '; visit https://git.new/pathToRegexpError for info');
      } else { re += ch.replace(/[.^$|\\/]/g, '\\$&'); i++; }
    }
    re = re.replace(/\\\/$/, '');   // a trailing slash in the pattern is optional anyway
    return { re: new RegExp('^' + re + (end ? '\\/?$' : '(?=\\/|$)'), 'i'), keys: keys };
  }
  function matchLayer(layer, pathname) {
    if (layer.all) return { params: {}, path: '' };
    var m = layer.rx.re.exec(pathname);
    if (!m) return null;
    var params = {};
    layer.rx.keys.forEach(function (k, j) {
      var v = m[j + 1];
      if (v === undefined) return;
      params[k.name] = k.splat ? v.split('/').map(decode) : decode(v);
    });
    return { params: params, path: m[0] };
  }

  function makeRouter(opts) {
    opts = opts || {};
    function router(req, res, next) { router.handle(req, res, next); }
    router.stack = [];
    router.mergeParams = !!opts.mergeParams;
    router.use = function () {
      var args = Array.prototype.slice.call(arguments);
      var path = typeof args[0] === 'string' ? args.shift() : '/';
      var fns = [].concat.apply([], args);
      if (!fns.length) throw new TypeError('app.use() requires a middleware function');
      fns.forEach(function (fn) {
        if (typeof fn !== 'function') throw new TypeError('app.use() requires a middleware function but got a ' + typeof fn);
        router.stack.push({ kind: 'use', all: path === '/' || path === '', rx: compile(path, false), fn: fn });
      });
      return router;
    };
    function addRoute(method) {
      return function (path) {
        var fns = [].concat.apply([], Array.prototype.slice.call(arguments, 1));
        fns.forEach(function (fn) {
          if (typeof fn !== 'function') throw new TypeError('Route.' + method + '() requires a callback function but got a ' + typeof fn);
        });
        router.stack.push({ kind: 'route', method: method, rx: compile(path, true), fns: fns });
        return router;
      };
    }
    METHODS.forEach(function (m) { router[m] = addRoute(m.toUpperCase()); });
    router.all = addRoute('*');
    router.handle = function (req, res, out) {
      var idx = 0;
      var parentParams = req.params || {};
      var parentUrl = req.url, parentBase = req.baseUrl || '';
      function restore() { req.url = parentUrl; req.baseUrl = parentBase; }
      function next(err) {
        restore();
        if (err === 'router') { req.params = parentParams; return out(); }
        var layer = router.stack[idx++];
        if (!layer) { req.params = parentParams; return out(err); }
        var pathname = splitUrl(req.url)[0] || '/';
        var m = matchLayer(layer, pathname);
        if (!m) return next(err);
        if (layer.kind === 'route' && layer.method !== '*' && layer.method !== req.method) return next(err);
        var own = m.params;
        req.params = router.mergeParams ? Object.assign({}, parentParams, own) : own;
        if (layer.kind === 'use') {
          if (m.path && m.path !== '/') {
            var rest = req.url.slice(m.path.length);
            req.url = rest.charAt(0) === '/' ? rest : '/' + rest;
            req.baseUrl = parentBase + m.path.replace(/\/$/, '');
          }
          return call(layer.fn, err, req, res, next);
        }
        // a route: run its handlers in order, each one's next() goes to the following handler
        var j = 0;
        (function step(e) {
          if (e === 'route') return next();
          var fn = layer.fns[j++];
          if (!fn) return next(e);
          call(fn, e, req, res, step);
        })(err);
      }
      next();
    };
    return router;
  }
  // error handlers are recognised by their number of declared parameters (fn.length === 4), as in Express
  function call(fn, err, req, res, next) {
    var isErr = fn.length === 4;
    if (err && !isErr) return next(err);
    if (!err && isErr) return next();
    try {
      var r = isErr ? fn(err, req, res, next) : fn(req, res, next);
      if (r && typeof r.then === 'function') r.then(null, function (e) { next(e || new Error('Rejected promise')); });   // Express 5
    } catch (e) { next(e); }
  }

  function makeRes(req, app, onEnd) {
    var listeners = {};
    var res = {
      statusCode: 200, headersSent: false, finished: false, locals: {}, req: req, app: app, _headers: {}, _body: '',
      on: function (ev, fn) { (listeners[ev] = listeners[ev] || []).push(fn); return res; },
      once: function (ev, fn) { function w() { res.off(ev, w); fn.apply(res, arguments); } w.listener = fn; return res.on(ev, w); },
      off: function (ev, fn) { listeners[ev] = (listeners[ev] || []).filter(function (f) { return f !== fn && f.listener !== fn; }); return res; },
      emit: function (ev) { var a = Array.prototype.slice.call(arguments, 1); (listeners[ev] || []).slice().forEach(function (f) { f.apply(res, a); }); return true; },
      status: function (n) { res.statusCode = n; return res; },
      setHeader: function (k, v) { if (res.headersSent) throw headersSentError(); res._headers[String(k).toLowerCase()] = String(v); return res; },
      getHeader: function (k) { return res._headers[String(k).toLowerCase()]; },
      removeHeader: function (k) { delete res._headers[String(k).toLowerCase()]; },
      set: function (k, v) {
        if (k && typeof k === 'object') { Object.keys(k).forEach(function (x) { res.set(x, k[x]); }); return res; }
        var val = String(v);
        if (String(k).toLowerCase() === 'content-type') val = contentType(val);
        return res.setHeader(k, val);
      },
      get: function (k) { return res.getHeader(k); },
      type: function (t) { return res.set('Content-Type', t); },
      location: function (u) { return res.set('Location', u); },
      json: function (obj) {
        var body = JSON.stringify(obj);
        if (!res.get('content-type')) res.set('Content-Type', 'application/json');
        return res.send(body === undefined ? '' : body);
      },
      send: function (body) {
        if (body !== null && body !== undefined && typeof body === 'object' && !(body instanceof Uint8Array)) return res.json(body);
        if (typeof body === 'number' || typeof body === 'boolean') return res.json(body);
        var text;
        if (body instanceof Uint8Array) {
          if (!res.get('content-type')) res.set('Content-Type', 'application/octet-stream');
          text = Array.prototype.map.call(body, function (b) { return String.fromCharCode(b); }).join('');
          res.set('Content-Length', String(body.length));
        } else {
          text = body == null ? '' : String(body);
          if (typeof body === 'string' && !res.get('content-type')) res.set('Content-Type', 'text/html');
          res.set('Content-Length', String(utf8Len(text)));
        }
        if (res.statusCode === 204 || res.statusCode === 304) {
          res.removeHeader('content-type'); res.removeHeader('content-length'); text = '';
        }
        return res.end(text);
      },
      sendStatus: function (n) {
        res.statusCode = n;
        res.type('text/plain');
        return res.send(STATUS[n] || String(n));
      },
      end: function (chunk) {
        if (res.finished) {
          if (chunk !== undefined && chunk !== '') { var e = new Error('write after end'); e.code = 'ERR_STREAM_WRITE_AFTER_END'; throw e; }
          return res;
        }
        if (chunk !== undefined) res._body = String(chunk);
        res.headersSent = true; res.finished = true;
        Promise.resolve().then(function () {
          try { res.emit('finish'); } catch (e) { console.error('[finish listener]', e && e.message); }
          onEnd(res);
        });
        return res;
      },
    };
    return res;
  }
  function contentType(v) {
    var map = { json: 'application/json', html: 'text/html', text: 'text/plain', txt: 'text/plain' };
    if (v.indexOf('/') < 0 && map[v]) v = map[v];
    if (!/charset=/i.test(v) && (/^text\//i.test(v) || /^application\/json/i.test(v))) v += '; charset=utf-8';
    return v;
  }

  // what Express answers when nothing else did: a 404 page, or an error page (status from err.status, else 500)
  function finalHandler(req, res) {
    function page(status, text) {
      var xpb = res.getHeader('x-powered-by');
      res._headers = {};
      if (xpb) res.setHeader('X-Powered-By', xpb);
      res.statusCode = status;
      var html = '<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<title>Error</title>\n</head>\n<body>\n<pre>' + text + '</pre>\n</body>\n</html>\n';
      res.set('Content-Security-Policy', "default-src 'none'");
      res.set('X-Content-Type-Options', 'nosniff');
      res.set('Content-Type', 'text/html');
      res.set('Content-Length', String(utf8Len(html)));
      res.end(html);
    }
    return function (err) {
      if (err) {
        var st = err.status || err.statusCode;
        if (!(st >= 400 && st < 600)) st = 500;
        console.error(err && err.name ? err.name + ': ' + err.message : String(err));
        if (res.headersSent) return;   // Express can only drop the connection here
        return page(st, err && err.name ? err.name + ': ' + err.message : 'Internal Server Error');
      }
      if (res.headersSent) return;
      page(404, 'Cannot ' + req.method + ' ' + splitUrl(req.originalUrl)[0]);
    };
  }

  function express() {
    var router = makeRouter();
    var settings = { 'x-powered-by': true };
    function app(req, res) { app.handle(req, res); }
    app.stack = router.stack;
    app.use = function () { router.use.apply(null, arguments); return app; };
    METHODS.forEach(function (m) { if (m !== 'get') app[m] = function () { router[m].apply(null, arguments); return app; }; });
    app.get = function (path) {
      if (arguments.length === 1) return settings[path];
      router.get.apply(null, arguments); return app;
    };
    app.all = function () { router.all.apply(null, arguments); return app; };
    app.set = function (k, v) { settings[k] = v; return app; };
    app.enable = function (k) { settings[k] = true; return app; };
    app.disable = function (k) { settings[k] = false; return app; };
    app.enabled = function (k) { return !!settings[k]; };
    app.disabled = function (k) { return !settings[k]; };
    app.listen = function () { throw new Error('app.listen() is not available in the browser grader: export createApp() and let the test call request(app, …) (lesson 5.5)'); };
    app.handle = function (req, res) {
      if (settings['x-powered-by']) res.setHeader('X-Powered-By', 'Express');
      req.app = app; res.app = app;
      router.handle(req, res, finalHandler(req, res));
    };
    return app;
  }
  express.Router = makeRouter;
  express.json = function (opts) {
    opts = opts || {};
    var limit = parseBytes(opts.limit);
    var strict = opts.strict !== false;
    return function jsonParser(req, res, next) {
      if (req._bodyRead) return next();
      var type = String(req.headers['content-type'] || '').toLowerCase();
      if (req._raw === undefined || !/^application\/(.+\+)?json\b/.test(type)) return next();
      req._bodyRead = true;
      var raw = req._raw;
      if (utf8Len(raw) > limit) {
        var big = new Error('request entity too large'); big.name = 'PayloadTooLargeError'; big.status = 413; big.statusCode = 413; big.type = 'entity.too.large'; big.expose = true;
        return next(big);
      }
      if (raw === '') { req.body = {}; return next(); }
      if (strict && !/^[\s]*[{[]/.test(raw)) {
        var bad = new SyntaxError('Unexpected token ' + JSON.stringify(raw.trim().charAt(0)) + ', ' + JSON.stringify(raw.slice(0, 20)) + ' is not valid JSON');
        bad.status = 400; bad.statusCode = 400; bad.type = 'entity.parse.failed'; bad.body = raw; bad.expose = true;
        return next(bad);
      }
      try { req.body = JSON.parse(raw); } catch (e) {
        e.status = 400; e.statusCode = 400; e.type = 'entity.parse.failed'; e.body = raw; e.expose = true;
        return next(e);
      }
      next();
    };
  };
  express.urlencoded = function () {
    return function urlencodedParser(req, res, next) {
      var type = String(req.headers['content-type'] || '').toLowerCase();
      if (req._bodyRead || req._raw === undefined || type.indexOf('application/x-www-form-urlencoded') !== 0) return next();
      req._bodyRead = true;
      req.body = Object.assign({}, parseQuery(req._raw));
      next();
    };
  };
  express.static = function () { throw new Error('express.static() is not available in the browser grader'); };

  express.__request = function (app, method, url, opts) {
    opts = opts || {};
    return new Promise(function (resolve) {
      var headers = {};
      Object.keys(opts.headers || {}).forEach(function (k) { headers[k.toLowerCase()] = String(opts.headers[k]); });
      var raw;
      if (opts.body !== undefined) {
        raw = typeof opts.body === 'string' ? opts.body : JSON.stringify(opts.body);
        if (!headers['content-type']) headers['content-type'] = 'application/json';
        headers['content-length'] = String(utf8Len(raw));
      }
      var u = String(url);
      var req = {
        method: String(method).toUpperCase(), url: u, originalUrl: u, baseUrl: '', headers: headers, params: {}, _raw: raw, body: undefined,
        get: function (name) { return headers[String(name).toLowerCase()]; },
      };
      req.header = req.get;
      Object.defineProperty(req, 'path', { get: function () { return splitUrl(req.url)[0] || '/'; }, enumerable: true });
      var q = parseQuery(splitUrl(u)[1]);
      Object.defineProperty(req, 'query', { get: function () { return q; }, enumerable: true });
      var done = false;
      var timer = setTimeout(function () { if (!done) { done = true; resolve({ status: 0, timedOut: true, headers: {}, text: '', body: undefined }); } }, opts.timeoutMs || 5000);
      var res = makeRes(req, null, function (r) {
        if (done) return;
        done = true; clearTimeout(timer);
        var body;
        if (/json/.test(r._headers['content-type'] || '') && r._body !== '') { try { body = JSON.parse(r._body); } catch (e) { body = undefined; } }
        resolve({ status: r.statusCode, headers: Object.assign({}, r._headers), text: r._body, body: body });
      });
      req.res = res; res.req = req;
      app(req, res);
    });
  };
  return express;
})();
var Router = express.Router;
function request(app, method, url, opts) { return express.__request(app, method, url, opts); }
