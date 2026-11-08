// lib/http.js — PROVIDED by the practice grader. An in-memory stand-in for Node's core `http` module:
// http.createServer((req, res) => …), req.method / req.url / req.headers, the request body arriving in
// CHUNKS ('data' events, then 'end' — or `for await (const chunk of req)`), res.statusCode, res.setHeader(),
// res.writeHead(), res.write(), res.end(). Instead of a real port, the grader calls
//   await server.inject({ method, url, headers, body })  ⇒  { status, headers, body (text) }.
(function (G) {
  'use strict';
  var MODS = G.__modules;
  var EventEmitter = MODS.events;
  var STATUS_CODES = G.__STATUS || { 200: 'OK', 201: 'Created', 204: 'No Content', 301: 'Moved Permanently', 302: 'Found', 400: 'Bad Request', 401: 'Unauthorized', 403: 'Forbidden', 404: 'Not Found', 405: 'Method Not Allowed', 413: 'Payload Too Large', 415: 'Unsupported Media Type', 500: 'Internal Server Error' };
  function headersSentError() { var e = new Error('Cannot set headers after they are sent to the client'); e.code = 'ERR_HTTP_HEADERS_SENT'; return e; }

  function IncomingMessage(init) {
    EventEmitter.call(this);
    init = init || {};
    this.method = String(init.method || 'GET').toUpperCase();
    this.url = init.url || '/';
    this.httpVersion = '1.1';
    var h = {}; Object.keys(init.headers || {}).forEach(function (k) { h[k.toLowerCase()] = String(init.headers[k]); });
    var body = init.body;
    if (body !== undefined && body !== null && typeof body !== 'string') { body = JSON.stringify(body); if (!h['content-type']) h['content-type'] = 'application/json'; }
    if (body) h['content-length'] = String(body.length);
    if (!h.host) h.host = 'localhost:3000';
    this.headers = h;
    this._chunks = [];
    if (body) { var n = Math.max(1, Math.ceil(body.length / (init.chunkSize || 8))); var size = Math.ceil(body.length / Math.min(n, 3)); for (var i = 0; i < body.length; i += size) this._chunks.push(body.slice(i, i + size)); }
    this.socket = { remoteAddress: init.ip || '127.0.0.1', encrypted: false };
    this.connection = this.socket;
    this._flowing = false;
  }
  IncomingMessage.prototype = Object.create(EventEmitter.prototype);
  // the body only starts flowing once somebody listens for 'data' (or iterates the request)
  IncomingMessage.prototype.on = IncomingMessage.prototype.addListener = function (n, f) {
    EventEmitter.prototype.on.call(this, n, f);
    if ((n === 'data' || n === 'end') && !this._flowing) this._start();
    return this;
  };
  IncomingMessage.prototype._start = function () {
    var self = this; this._flowing = true;
    var chunks = this._chunks.slice(); var i = 0;
    (function push() {
      G.setTimeout(function () {
        if (i < chunks.length) { EventEmitter.prototype.emit.call(self, 'data', chunks[i++]); push(); }
        else EventEmitter.prototype.emit.call(self, 'end');
      }, 1);
    })();
  };
  IncomingMessage.prototype.setEncoding = function () { return this; };
  IncomingMessage.prototype[Symbol.asyncIterator] = function () {
    var self = this; var queue = []; var ended = false; var wait = null;
    this.on('data', function (c) { if (wait) { var w = wait; wait = null; w({ value: c, done: false }); } else queue.push(c); });
    this.on('end', function () { ended = true; if (wait) { var w = wait; wait = null; w({ value: undefined, done: true }); } });
    return { next: function () { if (queue.length) return Promise.resolve({ value: queue.shift(), done: false }); if (ended) return Promise.resolve({ value: undefined, done: true }); return new Promise(function (ok) { wait = ok; }); } };
  };

  function ServerResponse(onFinish) {
    EventEmitter.call(this);
    this.statusCode = 200; this.statusMessage = undefined; this._h = {}; this.headersSent = false; this.writableEnded = false; this.finished = false; this._body = ''; this._onFinish = onFinish;
  }
  ServerResponse.prototype = Object.create(EventEmitter.prototype);
  ServerResponse.prototype.setHeader = function (k, v) { if (this.headersSent) throw headersSentError(); this._h[String(k).toLowerCase()] = Array.isArray(v) ? v.map(String) : String(v); return this; };
  ServerResponse.prototype.getHeader = function (k) { return this._h[String(k).toLowerCase()]; };
  ServerResponse.prototype.getHeaders = function () { return Object.assign({}, this._h); };
  ServerResponse.prototype.hasHeader = function (k) { return String(k).toLowerCase() in this._h; };
  ServerResponse.prototype.removeHeader = function (k) { if (this.headersSent) throw headersSentError(); delete this._h[String(k).toLowerCase()]; };
  ServerResponse.prototype.writeHead = function (code, msg, h) {
    if (this.headersSent) throw headersSentError();
    if (typeof msg === 'object') { h = msg; msg = undefined; }
    var c = Number(code);
    if (!(c >= 100 && c <= 999) || Math.floor(c) !== c) { var e = new RangeError('Invalid status code: ' + code); e.code = 'ERR_HTTP_INVALID_STATUS_CODE'; throw e; }
    this.statusCode = c; if (msg) this.statusMessage = msg;
    var self = this; Object.keys(h || {}).forEach(function (k) { self._h[k.toLowerCase()] = String(h[k]); });
    this.headersSent = true;
    return this;
  };
  ServerResponse.prototype.write = function (chunk) {
    if (this.writableEnded) { var e = new Error('write after end'); e.code = 'ERR_STREAM_WRITE_AFTER_END'; throw e; }
    if (typeof chunk !== 'string' && !(chunk && chunk.__buffer)) { var t = new TypeError('The "chunk" argument must be of type string or an instance of Buffer or Uint8Array. Received ' + (chunk === null ? 'null' : typeof chunk === 'object' ? 'an instance of ' + (Array.isArray(chunk) ? 'Array' : 'Object') : 'type ' + typeof chunk + ' (' + String(chunk) + ')')); t.code = 'ERR_INVALID_ARG_TYPE'; throw t; }
    this.headersSent = true; this._body += String(chunk); return true;
  };
  ServerResponse.prototype.end = function (chunk) {
    if (this.writableEnded) return this;
    if (chunk !== undefined && chunk !== null) this.write(chunk);
    this.headersSent = true; this.writableEnded = true; this.finished = true;
    this.emit('finish');
    if (this._onFinish) this._onFinish(this);
    return this;
  };

  function createServer(opts, handler) {
    if (typeof opts === 'function') handler = opts;
    var server = new EventEmitter();
    if (handler) server.on('request', handler);
    server.listening = false;
    server.listen = function (port, host, cb) {
      if (typeof host === 'function') cb = host;
      server.listening = true; server._port = port;
      (G.__listening = G.__listening || []).push(port);
      if (cb) G.setTimeout(cb, 0);
      return server;
    };
    server.close = function (cb) { server.listening = false; if (cb) cb(); return server; };
    server.address = function () { return { port: server._port, address: '::', family: 'IPv6' }; };
    server.inject = function (init) {
      return new Promise(function (resolve) {
        var done = false; var timer;
        var req = new IncomingMessage(init);
        var res = new ServerResponse(function (r) { if (done) return; done = true; G.clearTimeout(timer); resolve({ status: r.statusCode, headers: Object.assign({}, r._h), body: r._body }); });
        timer = G.setTimeout(function () { if (done) return; done = true; resolve({ status: null, headers: {}, body: undefined, timedOut: true }); }, (init && init.timeoutMs) || 30000);
        try { server.emit('request', req, res); }
        catch (e) { if (!done) { done = true; G.clearTimeout(timer); resolve({ status: null, headers: {}, body: undefined, crashed: (e.name || 'Error') + ': ' + e.message }); } }
      });
    };
    return server;
  }
  var http = { createServer: createServer, STATUS_CODES: STATUS_CODES, IncomingMessage: IncomingMessage, ServerResponse: ServerResponse, METHODS: ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT'] };
  MODS.http = http;
  MODS.https = { createServer: function (opts, handler) { var s = createServer(handler); s.tls = { key: !!(opts && opts.key), cert: !!(opts && opts.cert) }; return s; } };
})(globalThis);
