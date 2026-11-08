// lib/auth.js — PROVIDED by the practice grader. In-memory stand-ins for `bcrypt` / `bcryptjs`,
// `jsonwebtoken` and a little of `crypto`. JWTs are REAL HS256 tokens (HMAC-SHA256 written in plain
// JavaScript), so jwt.io can decode them. bcrypt hashes LOOK like real ones ($2b$10$ + 22-char salt +
// 31-char hash) and behave the same way (random salt ⇒ two hashes of one password differ; compare() is
// the only way back) — but the inside is SHA-256, not Blowfish: never copy it into a real project.
(function (G) {
  'use strict';
  var MODS = G.__modules;
  function utf8(str) { // string ⇒ array of bytes (UTF-8)
    var out = [];
    for (var i = 0; i < str.length; i++) {
      var c = str.codePointAt(i);
      if (c > 0xffff) i++;
      if (c < 0x80) out.push(c);
      else if (c < 0x800) out.push(0xc0 | (c >> 6), 0x80 | (c & 63));
      else if (c < 0x10000) out.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
      else out.push(0xf0 | (c >> 18), 0x80 | ((c >> 12) & 63), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
    }
    return out;
  }
  function hex(bytes) { return bytes.map(function (b) { return (b < 16 ? '0' : '') + b.toString(16); }).join(''); }
  function sha256(bytes) { // array of bytes ⇒ array of 32 bytes
    var K = [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];
    var h = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
    var m = bytes.slice(); var bits = bytes.length * 8;
    m.push(0x80); while (m.length % 64 !== 56) m.push(0);
    for (var s = 56; s >= 0; s -= 8) m.push(s >= 32 ? Math.floor(bits / Math.pow(2, s)) & 255 : (bits >>> s) & 255);
    var r = function (x, n) { return (x >>> n) | (x << (32 - n)); };
    for (var o = 0; o < m.length; o += 64) {
      var w = [];
      for (var i = 0; i < 16; i++) w[i] = (m[o + 4 * i] << 24) | (m[o + 4 * i + 1] << 16) | (m[o + 4 * i + 2] << 8) | m[o + 4 * i + 3];
      for (i = 16; i < 64; i++) w[i] = (w[i - 16] + (r(w[i - 15], 7) ^ r(w[i - 15], 18) ^ (w[i - 15] >>> 3)) + w[i - 7] + (r(w[i - 2], 17) ^ r(w[i - 2], 19) ^ (w[i - 2] >>> 10))) | 0;
      var a = h[0], b = h[1], c = h[2], d = h[3], e = h[4], f = h[5], g = h[6], k = h[7];
      for (i = 0; i < 64; i++) {
        var t1 = (k + (r(e, 6) ^ r(e, 11) ^ r(e, 25)) + ((e & f) ^ (~e & g)) + K[i] + w[i]) | 0;
        var t2 = ((r(a, 2) ^ r(a, 13) ^ r(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) | 0;
        k = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
      }
      h = [h[0] + a, h[1] + b, h[2] + c, h[3] + d, h[4] + e, h[5] + f, h[6] + g, h[7] + k].map(function (x) { return x | 0; });
    }
    var out = [];
    h.forEach(function (x) { out.push((x >>> 24) & 255, (x >>> 16) & 255, (x >>> 8) & 255, x & 255); });
    return out;
  }
  function hmacSha256(key, msg) { // arrays of bytes ⇒ array of 32 bytes (RFC 2104)
    if (key.length > 64) key = sha256(key);
    var k = key.slice(); while (k.length < 64) k.push(0);
    var ipad = k.map(function (b) { return b ^ 0x36; });
    var opad = k.map(function (b) { return b ^ 0x5c; });
    return sha256(opad.concat(sha256(ipad.concat(msg))));
  }
  function b64url(bytes) { // array of bytes ⇒ base64url text, no padding
    var A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    var out = '';
    for (var i = 0; i < bytes.length; i += 3) {
      var n = (bytes[i] << 16) | ((bytes[i + 1] || 0) << 8) | (bytes[i + 2] || 0);
      var left = bytes.length - i;
      out += A[(n >> 18) & 63] + A[(n >> 12) & 63] + (left > 1 ? A[(n >> 6) & 63] : '') + (left > 2 ? A[n & 63] : '');
    }
    return out;
  }
  function unb64url(text) { // base64url text ⇒ array of bytes, or null if it is not valid base64url
    var A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    if (typeof text !== 'string' || !/^[A-Za-z0-9_-]*$/.test(text) || text.length % 4 === 1) return null;
    var bytes = [], bits = 0, acc = 0;
    for (var i = 0; i < text.length; i++) {
      acc = (acc << 6) | A.indexOf(text[i]); bits += 6;
      if (bits >= 8) { bits -= 8; bytes.push((acc >> bits) & 255); }
    }
    return bytes;
  }
  function fromUtf8(bytes) { // array of bytes ⇒ string (valid UTF-8 assumed)
    var s = '';
    for (var i = 0; i < bytes.length;) {
      var b = bytes[i], c;
      if (b < 0x80) { c = b; i += 1; }
      else if (b < 0xe0) { c = ((b & 31) << 6) | (bytes[i + 1] & 63); i += 2; }
      else if (b < 0xf0) { c = ((b & 15) << 12) | ((bytes[i + 1] & 63) << 6) | (bytes[i + 2] & 63); i += 3; }
      else { c = ((b & 7) << 18) | ((bytes[i + 1] & 63) << 12) | ((bytes[i + 2] & 63) << 6) | (bytes[i + 3] & 63); i += 4; }
      s += String.fromCodePoint(c);
    }
    return s;
  }
  function b64(bytes) { var A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'; var out = ''; for (var i = 0; i < bytes.length; i += 3) { var n = (bytes[i] << 16) | ((bytes[i + 1] || 0) << 8) | (bytes[i + 2] || 0); var left = bytes.length - i; out += A[(n >> 18) & 63] + A[(n >> 12) & 63] + (left > 1 ? A[(n >> 6) & 63] : '=') + (left > 2 ? A[n & 63] : '='); } return out; }
  function bytesOf(x) { if (x && x.__bytes) return x.__bytes.slice(); return utf8(String(x)); }
  function bufferLike(bytes) {
    return { __bytes: bytes, __buffer: true, length: bytes.length,
      toString: function (enc) { if (enc === 'hex') return hex(bytes); if (enc === 'base64url') return b64url(bytes); if (enc === 'base64') return b64(bytes); return fromUtf8(bytes); } };
  }
  // deterministic "randomness" (same run ⇒ same values, so the grader can compare)
  var seed = 0x2545f491;
  function rnd() { seed = (Math.imul(seed ^ (seed >>> 15), 0x2c1b3c6d) + 0x6d2b79f5) >>> 0; return seed; }
  function randBytes(n) { var out = []; for (var i = 0; i < n; i++) out.push(rnd() & 255); return out; }

  /* ═══ crypto (subset) ═══ */
  var crypto = {
    randomBytes: function (n) { return bufferLike(randBytes(n)); },
    randomUUID: function () { var h = hex(randBytes(16)); return h.slice(0, 8) + '-' + h.slice(8, 12) + '-4' + h.slice(13, 16) + '-a' + h.slice(17, 20) + '-' + h.slice(20, 32); },
    createHash: function (alg) {
      if (alg !== 'sha256') throw new Error('Digest method not supported: ' + alg + ' (this practice only has sha256)');
      var data = [];
      var h = { update: function (s) { data = data.concat(bytesOf(s)); return h; }, digest: function (enc) { var d = sha256(data); return enc ? bufferLike(d).toString(enc) : bufferLike(d); } };
      return h;
    },
    createHmac: function (alg, key) {
      if (alg !== 'sha256') throw new Error('Invalid digest: ' + alg + ' (this practice only has sha256)');
      var data = [];
      var h = { update: function (s) { data = data.concat(bytesOf(s)); return h; }, digest: function (enc) { var d = hmacSha256(bytesOf(key), data); return enc ? bufferLike(d).toString(enc) : bufferLike(d); } };
      return h;
    },
    timingSafeEqual: function (a, b) { var x = bytesOf(a), y = bytesOf(b); if (x.length !== y.length) { var e = new RangeError('Input buffers must have the same byte length'); e.code = 'ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH'; throw e; } var d = 0; for (var i = 0; i < x.length; i++) d |= x[i] ^ y[i]; return d === 0; },
  };
  MODS.crypto = crypto;

  /* ═══ bcrypt / bcryptjs ═══ */
  var BC = './ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  function bcEnc(bytes, len) { var s = ''; for (var i = 0; s.length < len; i++) s += BC[bytes[i % bytes.length] & 63]; return s; }
  function illegal(a, b) { return new Error('Illegal arguments: ' + typeof a + ', ' + typeof b); }
  function makeSalt(rounds) { var r = rounds == null ? 10 : rounds; if (typeof r !== 'number' || r < 4 || r > 31) r = 10; return '$2b$' + (r < 10 ? '0' : '') + r + '$' + bcEnc(randBytes(16), 22); }
  function hashWith(pw, salt) { var body = bcEnc(sha256(utf8(salt + '|' + pw)), 31); return salt + body; }
  function parse(h) { var m = /^\$2[aby]\$(\d\d)\$([./A-Za-z0-9]{22})([./A-Za-z0-9]{31})$/.exec(String(h)); return m ? { rounds: +m[1], salt: '$2b$' + m[1] + '$' + m[2] } : null; }
  function costMs(rounds) { return Math.round(60 * Math.pow(2, (rounds || 10) - 10)); } // 10 rounds ≈ 60 ms of (virtual) CPU
  var bcrypt = {
    genSaltSync: function (r) { return makeSalt(r); },
    genSalt: function (r) { return Promise.resolve(makeSalt(r)); },
    hashSync: function (pw, s) {
      if (typeof pw !== 'string' || (typeof s !== 'string' && typeof s !== 'number')) throw illegal(pw, s);
      return hashWith(pw, typeof s === 'string' ? s : makeSalt(s));
    },
    hash: function (pw, s, cb) {
      var p = new Promise(function (ok, ko) {
        if (typeof pw !== 'string' || (typeof s !== 'string' && typeof s !== 'number')) return ko(illegal(pw, s));
        var salt = typeof s === 'string' ? s : makeSalt(s);
        G.setTimeout(function () { ok(hashWith(pw, salt)); }, costMs(parse(salt + 'x'.repeat(31)) ? parse(salt + 'x'.repeat(31)).rounds : 10));
      });
      if (typeof cb === 'function') { p.then(function (h) { cb(null, h); }, cb); return undefined; }
      return p;
    },
    compareSync: function (pw, h) { if (typeof pw !== 'string' || typeof h !== 'string') throw illegal(pw, h); var p = parse(h); return !!p && hashWith(pw, p.salt) === h; },
    compare: function (pw, h, cb) {
      var p = new Promise(function (ok, ko) {
        if (typeof pw !== 'string' || typeof h !== 'string') return ko(illegal(pw, h));
        var info = parse(h);
        G.setTimeout(function () { ok(!!info && hashWith(pw, info.salt) === h); }, costMs(info ? info.rounds : 10));
      });
      if (typeof cb === 'function') { p.then(function (r) { cb(null, r); }, cb); return undefined; }
      return p;
    },
    getRounds: function (h) { var p = parse(h); if (!p) throw new Error('Illegal arguments: ' + typeof h); return p.rounds; },
  };
  MODS.bcrypt = bcrypt; MODS.bcryptjs = bcrypt;

  /* ═══ jsonwebtoken (HS256) ═══ */
  function JsonWebTokenError(message) { var e = new Error(message); e.name = 'JsonWebTokenError'; Object.setPrototypeOf(e, JsonWebTokenError.prototype); return e; }
  JsonWebTokenError.prototype = Object.create(Error.prototype);
  JsonWebTokenError.prototype.constructor = JsonWebTokenError;
  function TokenExpiredError(message, expiredAt) { var e = JsonWebTokenError(message); e.name = 'TokenExpiredError'; e.expiredAt = expiredAt; Object.setPrototypeOf(e, TokenExpiredError.prototype); return e; }
  TokenExpiredError.prototype = Object.create(JsonWebTokenError.prototype);
  TokenExpiredError.prototype.constructor = TokenExpiredError;
  function NotBeforeError(message, date) { var e = JsonWebTokenError(message); e.name = 'NotBeforeError'; e.date = date; Object.setPrototypeOf(e, NotBeforeError.prototype); return e; }
  NotBeforeError.prototype = Object.create(JsonWebTokenError.prototype);
  function seconds(v) {
    if (typeof v === 'number') return v;
    var m = /^\s*(-?\d+(?:\.\d+)?)\s*(ms|s|sec|secs|seconds?|m|min|mins|minutes?|h|hr|hrs|hours?|d|days?|w|weeks?|y|years?)?\s*$/i.exec(String(v));
    if (!m) return null;
    var n = parseFloat(m[1]); var u = (m[2] || 'ms').toLowerCase();
    var mul = /^ms$/.test(u) ? 0.001 : /^s/.test(u) ? 1 : /^m(in)?/.test(u) && u !== 'ms' ? 60 : /^h/.test(u) ? 3600 : /^d/.test(u) ? 86400 : /^w/.test(u) ? 604800 : /^y/.test(u) ? 31557600 : 0.001;
    return Math.floor(n * mul);
  }
  var jwt = {
    JsonWebTokenError: JsonWebTokenError, TokenExpiredError: TokenExpiredError, NotBeforeError: NotBeforeError,
    sign: function (payload, secret, opts, cb) {
      if (typeof opts === 'function') { cb = opts; opts = {}; }
      opts = opts || {};
      var run = function () {
        if (!secret) throw new Error('secretOrPrivateKey must have a value');
        if (typeof payload !== 'object' || payload === null) { if (opts.expiresIn !== undefined) throw new Error('invalid expiresIn option for string payload'); }
        var p = typeof payload === 'object' ? JSON.parse(JSON.stringify(payload)) : payload;
        if (typeof p === 'object') {
          if (p.iat === undefined && !opts.noTimestamp) p.iat = Math.floor(Date.now() / 1000);
          if (opts.expiresIn !== undefined) {
            if (payload.exp !== undefined) throw new Error('Bad "options.expiresIn" option the payload already has an "exp" property.');
            var s = seconds(opts.expiresIn);
            if (s === null) throw new Error('"expiresIn" should be a number of seconds or string representing a timespan');
            p.exp = p.iat + s;
          }
          if (opts.subject) p.sub = opts.subject;
          if (opts.issuer) p.iss = opts.issuer;
          if (opts.audience) p.aud = opts.audience;
        }
        var head = b64url(utf8(JSON.stringify({ alg: 'HS256', typ: 'JWT' })));
        var body = b64url(utf8(typeof p === 'object' ? JSON.stringify(p) : String(p)));
        return head + '.' + body + '.' + b64url(hmacSha256(bytesOf(secret), utf8(head + '.' + body)));
      };
      if (cb) { try { var t = run(); G.setTimeout(function () { cb(null, t); }, 0); } catch (e) { G.setTimeout(function () { cb(e); }, 0); } return undefined; }
      return run();
    },
    decode: function (token, o) {
      if (typeof token !== 'string') return null;
      var parts = token.split('.');
      if (parts.length !== 3) return null;
      try {
        var h = JSON.parse(fromUtf8(unb64url(parts[0])));
        var raw = fromUtf8(unb64url(parts[1]));
        var p; try { p = JSON.parse(raw); } catch (e) { p = raw; }
        return o && o.complete ? { header: h, payload: p, signature: parts[2] } : p;
      } catch (e) { return null; }
    },
    verify: function (token, secret, opts, cb) {
      if (typeof opts === 'function') { cb = opts; opts = {}; }
      opts = opts || {};
      var run = function () {
        if (!token) throw JsonWebTokenError('jwt must be provided');
        if (typeof token !== 'string') throw JsonWebTokenError('jwt must be a string');
        var parts = token.split('.');
        if (parts.length !== 3) throw JsonWebTokenError('jwt malformed');
        var full = jwt.decode(token, { complete: true });
        if (!full || typeof full.header !== 'object') throw JsonWebTokenError('invalid token');
        if (!parts[2]) throw JsonWebTokenError('jwt signature is required');
        if (!secret) throw JsonWebTokenError('secret or public key must be provided');
        if (full.header.alg !== 'HS256') throw JsonWebTokenError('invalid algorithm');
        var expect = b64url(hmacSha256(bytesOf(secret), utf8(parts[0] + '.' + parts[1])));
        if (expect !== parts[2]) throw JsonWebTokenError('invalid signature');
        var p = full.payload; var nowS = Math.floor(Date.now() / 1000);
        if (typeof p === 'object' && p !== null) {
          if (p.nbf !== undefined && !opts.ignoreNotBefore && p.nbf > nowS + (opts.clockTolerance || 0)) throw NotBeforeError('jwt not active', new Date(p.nbf * 1000));
          if (p.exp !== undefined && !opts.ignoreExpiration && nowS >= p.exp + (opts.clockTolerance || 0)) throw TokenExpiredError('jwt expired', new Date(p.exp * 1000));
        }
        return p;
      };
      if (cb) { try { var r = run(); G.setTimeout(function () { cb(null, r); }, 0); } catch (e) { G.setTimeout(function () { cb(e); }, 0); } return undefined; }
      return run();
    },
  };
  MODS.jsonwebtoken = jwt;
})(globalThis);
