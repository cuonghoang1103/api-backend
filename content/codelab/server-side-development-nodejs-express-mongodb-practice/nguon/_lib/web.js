// lib/web.js — PROVIDED by the practice grader. In-memory stand-ins for common Express middleware packages:
// cors (same headers as cors 2.8), express-session (MemoryStore, cookie connect.sid), cookie-parser,
// multer (single/array, dest, limits.fileSize, fileFilter, MulterError) and passport + passport-local.
// The grader sends a file with  app.inject({ method: 'POST', url, file: { fieldname, originalname, mimetype, content } }).
(function (G) {
  'use strict';
  var MODS = G.__modules;
  var crypto = MODS.crypto;

  /* ═══ cors ═══ */
  function cors(o) {
    o = Object.assign({ origin: '*', methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', optionsSuccessStatus: 204 }, o || {});
    function allowed(origin, cb) {
      var x = o.origin;
      if (typeof x === 'function') return x(origin, function (e, v) { cb(e, v); });
      if (x === true) return cb(null, origin || false);
      if (x === '*' || x === undefined) return cb(null, '*');
      if (typeof x === 'string') return cb(null, x);
      var list = [].concat(x);
      var ok = list.some(function (a) { return a instanceof RegExp ? a.test(origin || '') : a === origin; });
      return cb(null, ok ? origin : false, true);
    }
    return function corsMiddleware(req, res, next) {
      var origin = req.headers.origin;
      allowed(origin, function (err, v) {
        if (err) return next(err);
        var fixed = typeof o.origin === 'string' && o.origin !== '*';
        if (v === '*') res.set('Access-Control-Allow-Origin', '*');
        else if (v) { res.set('Access-Control-Allow-Origin', v === true ? origin : v); res.vary('Origin'); }
        else if (fixed || Array.isArray(o.origin) || o.origin instanceof RegExp || typeof o.origin === 'function') res.vary('Origin');
        if (o.credentials) res.set('Access-Control-Allow-Credentials', 'true');
        if (o.exposedHeaders) res.set('Access-Control-Expose-Headers', [].concat(o.exposedHeaders).join(','));
        if (req.method === 'OPTIONS' && !o.preflightContinue) {
          res.set('Access-Control-Allow-Methods', [].concat(o.methods).join(','));
          var ah = o.allowedHeaders ? [].concat(o.allowedHeaders).join(',') : req.headers['access-control-request-headers'];
          if (ah) res.set('Access-Control-Allow-Headers', ah);
          if (!o.allowedHeaders) res.vary('Access-Control-Request-Headers');
          if (o.maxAge) res.set('Access-Control-Max-Age', String(o.maxAge));
          res.statusCode = o.optionsSuccessStatus;
          res.set('Content-Length', '0');
          return res.end();
        }
        next();
      });
    };
  }
  MODS.cors = cors;

  /* ═══ cookie-parser ═══ */
  function parseCookies(h) {
    var out = {};
    String(h || '').split(';').forEach(function (p) {
      var i = p.indexOf('='); if (i < 0) return;
      var k = p.slice(0, i).trim(); var v = p.slice(i + 1).trim();
      try { v = decodeURIComponent(v); } catch (e) { /* keep */ }
      if (v.slice(0, 2) === 'j:') { try { v = JSON.parse(v.slice(2)); } catch (e) { /* keep */ } }
      if (!(k in out)) out[k] = v;
    });
    return out;
  }
  MODS['cookie-parser'] = function () { return function cookieParser(req, res, next) { req.cookies = parseCookies(req.headers.cookie); req.signedCookies = {}; next(); }; };
  // grader helper: Set-Cookie headers of a result ⇒ { name: rawValue } ready for the next inject({ cookies })
  G.__cookies = function (r) {
    var out = {};
    [].concat((r && r.headers && r.headers['set-cookie']) || []).forEach(function (c) { var first = c.split(';')[0]; var i = first.indexOf('='); out[first.slice(0, i)] = first.slice(i + 1); });
    return out;
  };

  /* ═══ express-session (MemoryStore) ═══ */
  function sign(val, secret) { return val + '.' + crypto.createHmac('sha256', secret).update(val).digest('base64').replace(/=+$/, ''); }
  function session(o) {
    o = o || {};
    if (!o.secret) throw new Error('secret option required for sessions');
    var name = o.name || 'connect.sid';
    var store = {};
    var cookieOpts = Object.assign({ path: '/', httpOnly: true }, o.cookie || {});
    var saveUninit = o.saveUninitialized !== false;
    function newId() { return crypto.randomBytes(18).toString('base64url'); }
    function Session(req, id, data) {
      Object.defineProperty(this, 'id', { value: id, writable: true, enumerable: false });
      Object.defineProperty(this, '__req', { value: req, enumerable: false });
      var self = this; Object.keys(data || {}).forEach(function (k) { self[k] = data[k]; });
      if (!this.cookie) this.cookie = Object.assign({}, cookieOpts);
    }
    Session.prototype.destroy = function (cb) { delete store[this.id]; this.__req.session = undefined; this.__req._sessDestroyed = true; if (cb) G.setTimeout(function () { cb(null); }, 0); return this; };
    Session.prototype.regenerate = function (cb) { delete store[this.id]; var s = new Session(this.__req, newId(), {}); this.__req.session = s; this.__req.sessionID = s.id; this.__req._sessIsNew = true; if (cb) G.setTimeout(function () { cb(null); }, 0); return this; };
    Session.prototype.save = function (cb) { store[this.id] = JSON.stringify(this); if (cb) G.setTimeout(function () { cb(null); }, 0); return this; };
    Session.prototype.reload = function (cb) { if (cb) cb(null); return this; };
    Session.prototype.touch = function () { return this; };
    function mw(req, res, next) {
      if (req.session) return next();
      var raw = parseCookies(req.headers.cookie)[name];
      var id = null;
      if (typeof raw === 'string' && raw.slice(0, 2) === 's:') { var val = raw.slice(2, raw.lastIndexOf('.')); if (sign(val, o.secret) === raw.slice(2) && store[val]) id = val; }
      if (id) { req.session = new Session(req, id, JSON.parse(store[id])); req._sessIsNew = false; }
      else { req.session = new Session(req, newId(), {}); req._sessIsNew = true; }
      req.sessionID = req.session.id;
      var snap = JSON.stringify(req.session);
      var orig = res._finish;
      res._finish = function (body) {
        if (!res.headersSent && req.session) {
          var s = req.session; var changed = JSON.stringify(s) !== snap;
          var shouldSave = req._sessIsNew ? (saveUninit || changed) : true;
          if (shouldSave) {
            store[s.id] = JSON.stringify(s);
            if (req._sessIsNew || o.rolling) res.cookie(name, 's:' + sign(s.id, o.secret), cookieOpts);
          }
        }
        return orig.call(res, body);
      };
      next();
    }
    mw.__store = store;
    return mw;
  }
  session.MemoryStore = function () {};
  MODS['express-session'] = session;

  /* ═══ multer ═══ */
  function MulterError(code, field) {
    var msgs = { LIMIT_FILE_SIZE: 'File too large', LIMIT_FILE_COUNT: 'Too many files', LIMIT_UNEXPECTED_FILE: 'Unexpected field', LIMIT_PART_COUNT: 'Too many parts', LIMIT_FIELD_KEY: 'Field name too long' };
    var e = new Error(msgs[code] || code); e.name = 'MulterError'; e.code = code; if (field) e.field = field;
    Object.setPrototypeOf(e, MulterError.prototype); return e;
  }
  MulterError.prototype = Object.create(Error.prototype);
  function multer(o) {
    o = o || {};
    var limits = o.limits || {};
    var storage = o.storage || (o.dest ? multer.diskStorage({ destination: o.dest }) : multer.memoryStorage());
    function handle(spec) {
      return function multerMiddleware(req, res, next) {
        var files = [].concat(req._files || (req._file ? [req._file] : []));
        req.body = Object.assign(req.body && typeof req.body === 'object' ? req.body : {}, req._fields || {});
        if (!files.length) return next();
        var out = []; var i = 0;
        (function step() {
          if (i >= files.length) {
            if (spec.mode === 'single') req.file = out[0];
            else req.files = out;
            return next();
          }
          var f0 = files[i++];
          if (spec.mode === 'none' || f0.fieldname !== spec.field) return next(MulterError('LIMIT_UNEXPECTED_FILE', f0.fieldname));
          if (spec.mode === 'array' && spec.max && out.length >= spec.max) return next(MulterError('LIMIT_UNEXPECTED_FILE', f0.fieldname));
          var content = f0.content !== undefined ? String(f0.content) : 'x'.repeat(Math.min(f0.size || 0, 64)); // a stand-in body: only its size matters
          var file = { fieldname: f0.fieldname, originalname: f0.originalname, encoding: '7bit', mimetype: f0.mimetype };
          var filter = o.fileFilter || function (r, f, cb) { cb(null, true); };
          filter(req, file, function (err, accept) {
            if (err) return next(err);
            if (!accept) return step();
            var size = f0.size != null ? f0.size : content.length;
            if (limits.fileSize != null && size > limits.fileSize) return next(MulterError('LIMIT_FILE_SIZE', f0.fieldname));
            storage._handle(req, file, content, size, function (e2, info) {
              if (e2) return next(e2);
              Object.assign(file, info, { size: size });
              out.push(file); step();
            });
          });
        })();
      };
    }
    return {
      single: function (field) { return handle({ mode: 'single', field: field }); },
      array: function (field, max) { return handle({ mode: 'array', field: field, max: max }); },
      none: function () { return handle({ mode: 'none' }); },
    };
  }
  multer.MulterError = MulterError;
  multer.memoryStorage = function () { return { _handle: function (req, file, content, size, cb) { cb(null, { buffer: { length: content.length, toString: function () { return content; }, __buffer: true } }); } }; };
  multer.diskStorage = function (opts) {
    return { _handle: function (req, file, content, size, cb) {
      var dest = opts.destination;
      var withDest = function (d) {
        var nameFn = opts.filename || function (r, f, c) { c(null, crypto.randomBytes(16).toString('hex')); };
        nameFn(req, file, function (e, fname) {
          if (e) return cb(e);
          var p = MODS.path.join(d, fname);
          G.__disk.put(p, content);
          cb(null, { destination: d, filename: fname, path: p });
        });
      };
      if (typeof dest === 'function') dest(req, file, function (e, d) { if (e) return cb(e); withDest(d); });
      else withDest(dest || '/tmp');
    } };
  };
  MODS.multer = multer;

  /* ═══ passport + passport-local ═══ */
  function LocalStrategy(opts, verify) {
    if (typeof opts === 'function') { verify = opts; opts = {}; }
    if (!verify) throw new TypeError('LocalStrategy requires a verify callback');
    this.name = 'local'; this._verify = verify; this._user = opts.usernameField || 'username'; this._pass = opts.passwordField || 'password'; this._passReq = !!opts.passReqToCallback;
  }
  MODS['passport-local'] = { Strategy: LocalStrategy };
  var strategies = {}; var ser = null; var deser = null;
  var passport = {
    use: function (name, s) { if (typeof name !== 'string') { s = name; name = s.name; } strategies[name] = s; return passport; },
    serializeUser: function (fn) { ser = fn; }, deserializeUser: function (fn) { deser = fn; },
    initialize: function () { return function (req, res, next) { req.isAuthenticated = function () { return !!req.user; }; req.logout = function (cb) { req.user = null; if (req.session) delete req.session.passport; if (cb) cb(); }; next(); }; },
    session: function () {
      return function (req, res, next) {
        var id = req.session && req.session.passport && req.session.passport.user;
        if (id === undefined || !deser) return next();
        deser(id, function (e, u) { if (e) return next(e); if (u) req.user = u; next(); });
      };
    },
    authenticate: function (name, opts, cb) {
      if (typeof opts === 'function') { cb = opts; opts = {}; }
      opts = opts || {};
      return function (req, res, next) {
        var s = strategies[name];
        if (!s) return next(new Error('Unknown authentication strategy "' + name + '"'));
        var b = req.body || {};
        var u = b[s._user], p = b[s._pass];
        if (!u || !p) { if (cb) return cb(null, false, { message: 'Missing credentials' }); return res.status(400).send('Bad Request'); }
        var done = function (err, user, info) {
          if (cb) return cb(err, user, info);
          if (err) return next(err);
          if (!user) return res.status(401).send('Unauthorized');
          req.user = user;
          if (opts.session !== false && req.session && ser) return ser(user, function (e, id) { if (e) return next(e); req.session.passport = { user: id }; next(); });
          next();
        };
        try { if (s._passReq) s._verify(req, u, p, done); else s._verify(u, p, done); } catch (e) { next(e); }
      };
    },
  };
  MODS.passport = passport;
})(globalThis);
