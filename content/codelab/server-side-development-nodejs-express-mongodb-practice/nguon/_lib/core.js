// lib/core.js — PROVIDED by the practice grader (do not edit: the grader always runs its own copy of this idea).
// A tiny, in-memory stand-in for the parts of Node.js these exercises use: require(), module.exports,
// process.env, path, fs (callbacks + promises, with simulated disk delay), events, util.promisify.
// Everything runs in the browser: there is no real disk, network or database.
(function (G) {
  'use strict';
  var MODS = {};
  G.__modules = MODS;
  G.process = { env: {}, version: 'v22.23.3', platform: 'linux', argv: ['node', 'app.js'], cwd: function () { return '/app'; },
    exit: function (code) { var e = new Error('process.exit(' + code + ') was called — the server would stop here'); e.code = 'PROCESS_EXIT'; throw e; } };
  G.module = { exports: {} };
  G.exports = G.module.exports;
  G.__dirname = '/app';
  G.__filename = '/app/app.js';
  G.require = function (name) {
    var n = String(name).replace(/^node:/, '');
    if (Object.prototype.hasOwnProperty.call(MODS, n)) return MODS[n];
    var e;
    if (/^\.{0,2}\//.test(n)) {
      e = new Error("Cannot find module '" + name + "' — in this practice everything lives in ONE file (answer.js); write the layers as objects/functions in it.");
    } else {
      e = new Error("Cannot find module '" + name + "'");
    }
    e.code = 'MODULE_NOT_FOUND';
    throw e;
  };

  // ── path (POSIX) ──
  function normalize(p) {
    var abs = p.charAt(0) === '/';
    var out = [];
    p.split('/').forEach(function (s) {
      if (!s || s === '.') return;
      if (s === '..') { if (out.length && out[out.length - 1] !== '..') out.pop(); else if (!abs) out.push('..'); }
      else out.push(s);
    });
    var r = (abs ? '/' : '') + out.join('/');
    return r || (abs ? '/' : '.');
  }
  var path = {
    sep: '/',
    normalize: normalize,
    join: function () { var a = [].slice.call(arguments).filter(function (x) { return x !== ''; }); return a.length ? normalize(a.join('/')) : '.'; },
    resolve: function () { var r = '/app'; [].slice.call(arguments).forEach(function (x) { r = x.charAt(0) === '/' ? x : r + '/' + x; }); return normalize(r); },
    basename: function (p, ext) { var s = String(p).replace(/\/+$/, ''); var b = s.slice(s.lastIndexOf('/') + 1); if (ext && b.slice(-ext.length) === ext && b !== ext) b = b.slice(0, -ext.length); return b; },
    dirname: function (p) { var s = String(p).replace(/\/+$/, ''); var i = s.lastIndexOf('/'); return i < 0 ? '.' : (i === 0 ? '/' : s.slice(0, i)); },
    extname: function (p) { var b = path.basename(p); var i = b.lastIndexOf('.'); return i <= 0 ? '' : b.slice(i); },
    isAbsolute: function (p) { return String(p).charAt(0) === '/'; },
  };
  path.posix = path;
  MODS.path = path;

  // ── fs: an in-memory disk; every async read takes a little (virtual) time, like a real disk ──
  var VOL = {};
  G.__disk = {
    put: function (p, data, delayMs) { VOL[path.resolve(p)] = { data: String(data), delay: delayMs == null ? 20 : delayMs }; },
    get: function (p) { var f = VOL[path.resolve(p)]; return f ? f.data : undefined; },
    del: function (p) { delete VOL[path.resolve(p)]; },
    list: function () { return Object.keys(VOL).sort(); },
  };
  function enoent(p, sc) {
    var e = new Error("ENOENT: no such file or directory, " + (sc || 'open') + " '" + p + "'");
    e.code = 'ENOENT'; e.errno = -2; e.syscall = sc || 'open'; e.path = p;
    return e;
  }
  function encOf(o) { return typeof o === 'string' ? o : (o && o.encoding) || null; }
  function asBufferLike(s) {
    // a very small Buffer stand-in: prints as text when you call toString()
    return { length: s.length, toString: function () { return s; }, __buffer: true };
  }
  var fs = {
    readFile: function (p, opts, cb) {
      if (typeof opts === 'function') { cb = opts; opts = null; }
      var f = VOL[path.resolve(p)];
      var enc = encOf(opts);
      G.setTimeout(function () {
        if (!f) cb(enoent(p)); else cb(null, enc ? f.data : asBufferLike(f.data));
      }, f ? f.delay : 5);
    },
    readFileSync: function (p, opts) {
      var f = VOL[path.resolve(p)];
      if (!f) throw enoent(p);
      G.__blockedMs = (G.__blockedMs || 0) + f.delay; // a sync read blocks the only thread for the whole disk time
      return encOf(opts) ? f.data : asBufferLike(f.data);
    },
    writeFile: function (p, data, opts, cb) {
      if (typeof opts === 'function') { cb = opts; }
      G.setTimeout(function () { VOL[path.resolve(p)] = { data: String(data), delay: 20 }; cb && cb(null); }, 10);
    },
    writeFileSync: function (p, data) { VOL[path.resolve(p)] = { data: String(data), delay: 20 }; },
    existsSync: function (p) { return !!VOL[path.resolve(p)]; },
    unlink: function (p, cb) { G.setTimeout(function () { var k = path.resolve(p); if (!VOL[k]) return cb(enoent(p, 'unlink')); delete VOL[k]; cb(null); }, 5); },
  };
  fs.promises = {
    readFile: function (p, opts) { return new Promise(function (ok, ko) { fs.readFile(p, opts, function (e, d) { if (e) ko(e); else ok(d); }); }); },
    writeFile: function (p, d) { return new Promise(function (ok, ko) { fs.writeFile(p, d, function (e) { if (e) ko(e); else ok(); }); }); },
    unlink: function (p) { return new Promise(function (ok, ko) { fs.unlink(p, function (e) { if (e) ko(e); else ok(); }); }); },
  };
  MODS.fs = fs;
  MODS['fs/promises'] = fs.promises;

  // ── events ──
  function EventEmitter() { this._ev = {}; }
  EventEmitter.prototype.on = EventEmitter.prototype.addListener = function (n, f) { (this._ev[n] = this._ev[n] || []).push(f); return this; };
  EventEmitter.prototype.once = function (n, f) { var self = this; function w() { self.off(n, w); return f.apply(self, arguments); } w.listener = f; return this.on(n, w); };
  EventEmitter.prototype.off = EventEmitter.prototype.removeListener = function (n, f) { var l = this._ev[n]; if (l) this._ev[n] = l.filter(function (x) { return x !== f && x.listener !== f; }); return this; };
  EventEmitter.prototype.emit = function (n) {
    var a = [].slice.call(arguments, 1); var l = (this._ev[n] || []).slice();
    if (n === 'error' && !l.length) throw a[0] instanceof Error ? a[0] : new Error('Unhandled error. (' + a[0] + ')');
    var self = this; l.forEach(function (f) { f.apply(self, a); });
    return l.length > 0;
  };
  EventEmitter.prototype.listenerCount = function (n) { return (this._ev[n] || []).length; };
  MODS.events = EventEmitter;
  EventEmitter.EventEmitter = EventEmitter;

  // ── util ──
  MODS.util = {
    promisify: function (fn) {
      return function () {
        var a = [].slice.call(arguments); var self = this;
        return new Promise(function (ok, ko) { fn.apply(self, a.concat([function (e, v) { if (e) ko(e); else ok(v); }])); });
      };
    },
  };

  // dotenv: the grader puts the .env values in process.env itself, so config() only reports them.
  MODS.dotenv = { config: function () { return { parsed: Object.assign({}, G.process.env) }; } };

  // ── helpers the grader uses in its checks (names start with __ so they never clash with yours) ──
  G.__json = function (v) { return v === undefined ? undefined : JSON.parse(JSON.stringify(v)); };
  G.__sleep = function (ms) { return new Promise(function (ok) { G.setTimeout(ok, ms); }); };
  G.__pick = function (o, keys) { var r = {}; String(keys).split(/[\s,]+/).filter(Boolean).forEach(function (k) { r[k] = o == null ? undefined : o[k]; }); return r; };
})(globalThis);
