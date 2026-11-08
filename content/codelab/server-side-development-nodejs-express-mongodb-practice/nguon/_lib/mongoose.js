// lib/mongoose.js — PROVIDED by the practice grader. An IN-MEMORY stand-in for Mongoose 8 + MongoDB, so the
// exercises run in your browser. Same API as the lesson: new mongoose.Schema(...), mongoose.model(...),
// await Model.find/findById/create/findByIdAndUpdate(id, update, { new, runValidators })/…, .populate(),
// .select(), .sort(), .lean(); the same errors with the same messages (ValidationError, CastError,
// E11000 duplicate key). Differences from the real thing: data lives in memory and disappears after each
// check; ids are deterministic; there is no network.
(function (G) {
  'use strict';
  var MODS = G.__modules;
  var STORE = {};          // collection name ⇒ array of raw rows
  var MODELS = {};         // model name ⇒ Model
  var DBNAME = 'test';

  /* ═══════════ ObjectId ═══════════ */
  var oidSeq = 0;
  function hex2(n, w) { var s = n.toString(16); while (s.length < w) s = '0' + s; return s.slice(-w); }
  function BSONError(msg) { var e = new Error(msg); e.name = 'BSONError'; return e; }
  function ObjectId(v) {
    if (!(this instanceof ObjectId)) return new ObjectId(v);
    var h;
    if (v == null) h = hex2(Math.floor(Date.now() / 1000), 8) + 'a1c2e3b4d5' + hex2(++oidSeq, 6);
    else if (v instanceof ObjectId) h = v.__hex;
    else if (typeof v === 'string' && /^[0-9a-fA-F]{24}$/.test(v)) h = v.toLowerCase();
    else throw BSONError('input must be a 24 character hex string, 12 byte Uint8Array, or an integer');
    Object.defineProperty(this, '__hex', { value: h });
  }
  ObjectId.prototype.toString = ObjectId.prototype.toHexString = ObjectId.prototype.toJSON = function () { return this.__hex; };
  ObjectId.prototype.equals = function (o) { return o != null && String(o instanceof ObjectId ? o.__hex : o).toLowerCase() === this.__hex; };
  ObjectId.prototype.getTimestamp = function () { return new Date(parseInt(this.__hex.slice(0, 8), 16) * 1000); };
  ObjectId.isValid = function (v) { return v instanceof ObjectId || (typeof v === 'string' && /^[0-9a-fA-F]{24}$/.test(v)) || (typeof v === 'number' && Number.isInteger(v)); };
  var isOid = function (v) { return v instanceof ObjectId; };

  /* ═══════════ errors ═══════════ */
  function mkErr(name, msg, extra) { var e = new Error(msg); e.name = name; if (extra) for (var k in extra) e[k] = extra[k]; return e; }
  function MongooseError(msg) { return mkErr('MongooseError', msg); }
  function typeName(v) {
    if (v === null) return 'null';
    if (Array.isArray(v)) return 'Array';
    if (typeof v === 'object') return (v.constructor && v.constructor.name) || 'Object';
    return typeof v;
  }
  function showVal(v) {
    if (typeof v === 'string') return v;
    if (typeof v === 'object' && v !== null) { try { return JSON.stringify(v).replace(/"(\w+)":/g, '$1: ').replace(/,/g, ', ').replace(/^\{/, '{ ').replace(/\}$/, ' }'); } catch (e) { return String(v); } }
    return String(v);
  }
  function castError(kind, value, path, model, why) {
    var msg = 'Cast to ' + kind + ' failed for value "' + showVal(value) + '" (type ' + typeName(value) + ') at path "' + path + '"' + (why ? ' because of "' + why + '"' : '') + (model ? ' for model "' + model + '"' : '');
    return mkErr('CastError', msg, { kind: kind, value: value, path: path, stringValue: '"' + showVal(value) + '"', valueType: typeName(value) });
  }
  function ValidationError(prefix, errors) {
    var keys = Object.keys(errors);
    var msg = prefix + ': ' + keys.map(function (k) { return k + ': ' + errors[k].message; }).join(', ');
    return mkErr('ValidationError', msg, { errors: errors, _message: prefix });
  }
  function ValidationErrorCtor() {} // for instanceof checks
  function CastErrorCtor() {}
  [ValidationErrorCtor, CastErrorCtor].forEach(function (C, i) {
    var nm = i ? 'CastError' : 'ValidationError';
    Object.defineProperty(C, Symbol.hasInstance, { value: function (x) { return !!x && x.name === nm; } });
  });
  function ValidatorErrorCtor() {}
  Object.defineProperty(ValidatorErrorCtor, Symbol.hasInstance, { value: function (x) { return !!x && x.name === 'ValidatorError'; } });
  function MongoServerErrorCtor() {}
  Object.defineProperty(MongoServerErrorCtor, Symbol.hasInstance, { value: function (x) { return !!x && (x.name === 'MongoServerError' || x.name === 'MongoBulkWriteError'); } });
  G.MongoServerError = MongoServerErrorCtor;

  /* ═══════════ helpers ═══════════ */
  function isPlain(o) { return o !== null && typeof o === 'object' && !Array.isArray(o) && !(o instanceof Date) && !isOid(o) && !(o instanceof RegExp) && !(o instanceof Doc); }
  function clone(v) {
    if (v === null || typeof v !== 'object') return v;
    if (isOid(v)) return new ObjectId(v.__hex);
    if (v instanceof Date) return new Date(v.getTime());
    if (v instanceof RegExp) return v;
    if (v instanceof Doc) return v.toObject();
    if (Array.isArray(v)) return v.map(clone);
    var o = {}; for (var k in v) if (Object.prototype.hasOwnProperty.call(v, k)) o[k] = clone(v[k]); return o;
  }
  function getP(o, p) { var parts = p.split('.'); for (var i = 0; i < parts.length; i++) { if (o == null) return undefined; o = o[parts[i]]; } return o; }
  function setP(o, p, v) { var parts = p.split('.'); for (var i = 0; i < parts.length - 1; i++) { if (!isPlain(o[parts[i]])) o[parts[i]] = {}; o = o[parts[i]]; } o[parts[parts.length - 1]] = v; }
  function delP(o, p) { var parts = p.split('.'); for (var i = 0; i < parts.length - 1; i++) { o = o && o[parts[i]]; } if (o) delete o[parts[parts.length - 1]]; }
  function now() { return new Date(Date.now()); }
  function pluralize(n) {
    var s = n.toLowerCase();
    if (/(s|x|z|ch|sh)$/.test(s)) return s + 'es';
    if (/[^aeiou]y$/.test(s)) return s.slice(0, -1) + 'ies';
    if (s === 'person') return 'people';
    return s + 's';
  }
  function later(fn) { return new Promise(function (ok, ko) { Promise.resolve().then(function () { try { ok(fn()); } catch (e) { ko(e); } }); }); }

  /* ═══════════ Schema ═══════════ */
  var T = { ObjectId: 'ObjectId', Mixed: 'Mixed', String: String, Number: Number, Boolean: Boolean, Date: Date, Array: Array };
  function typeOf(t) {
    if (t === String || t === 'String') return 'String';
    if (t === Number || t === 'Number') return 'Number';
    if (t === Boolean || t === 'Boolean') return 'Boolean';
    if (t === Date || t === 'Date') return 'Date';
    if (t === 'ObjectId' || t === ObjectId) return 'ObjectId';
    if (t === 'Mixed' || t === Object) return 'Mixed';
    return null;
  }
  function Schema(def, opts) {
    if (!(this instanceof Schema)) return new Schema(def, opts);
    this.paths = {}; this.order = []; this.options = opts || {};
    this.hooks = { pre: {}, post: {} }; this.methods = {}; this.statics = {}; this.indexes = []; this.virtuals = {};
    this._toJSON = this.options.toJSON || null; this._toObject = this.options.toObject || null;
    this.add(def || {}, '');
  }
  Schema.Types = T;
  Schema.ObjectId = 'ObjectId';
  Schema.prototype.add = function (def, prefix) {
    var self = this;
    Object.keys(def).forEach(function (k) {
      var v = def[k]; var p = prefix + k;
      var spec = self._spec(v, p);
      if (spec.nested) { self.add(v, p + '.'); return; }
      spec.options = spec.o; if (spec.caster) spec.caster.options = spec.caster.o;
      self.paths[p] = spec; self.order.push(p);
      if (spec.o.unique) self.indexes.push({ fields: (function () { var f = {}; f[p] = 1; return f; })(), unique: true, sparse: !!spec.o.sparse });
    });
    return this;
  };
  Schema.prototype._spec = function (v, p) {
    if (v instanceof Schema) return { path: p, type: 'Sub', sub: v, o: {} };
    if (Array.isArray(v)) {
      var el = v.length ? v[0] : 'Mixed';
      var c = el instanceof Schema ? { type: 'Sub', sub: el, o: {} } : (isPlain(el) && !('type' in el) ? { type: 'Sub', sub: new Schema(el), o: {} } : this._spec(el, p));
      return { path: p, type: 'Array', caster: c, o: {} };
    }
    if (typeOf(v)) return { path: p, type: typeOf(v), o: {} };
    if (isPlain(v)) {
      if ('type' in v && (typeOf(v.type) || Array.isArray(v.type) || v.type instanceof Schema)) {
        var base = Array.isArray(v.type) || v.type instanceof Schema ? this._spec(v.type, p) : { path: p, type: typeOf(v.type) };
        base.o = Object.assign({}, v); delete base.o.type;
        if (base.type === 'Array' && base.o.ref) base.caster.o = Object.assign({}, base.caster.o, { ref: base.o.ref });
        return base;
      }
      return { nested: true };
    }
    return { path: p, type: 'Mixed', o: {} };
  };
  Schema.prototype.pre = function (op, fn) { (this.hooks.pre[op] = this.hooks.pre[op] || []).push(fn); return this; };
  Schema.prototype.post = function (op, fn) { (this.hooks.post[op] = this.hooks.post[op] || []).push(fn); return this; };
  Schema.prototype.index = function (fields, o) { this.indexes.push({ fields: fields, unique: !!(o && o.unique), sparse: !!(o && o.sparse) }); return this; };
  Schema.prototype.set = function (k, v) { if (k === 'toJSON') this._toJSON = v; else if (k === 'toObject') this._toObject = v; else this.options[k] = v; return this; };
  Schema.prototype.path = function (p) { return this.paths[p]; };
  Schema.prototype.virtual = function (name) { var vs = this.virtuals; var v = { get: function (f) { vs[name] = f; return v; }, set: function () { return v; } }; return v; };
  Schema.prototype.plugin = function (fn, o) { fn(this, o); return this; };

  /* ═══════════ casting ═══════════ */
  // returns { v } or { err: CastError }
  function castScalar(type, v, o) {
    if (v === undefined || v === null) return { v: v };
    switch (type) {
      case 'String':
        if (typeof v === 'string') { var s = v; if (o && o.trim) s = s.trim(); if (o && o.lowercase) s = s.toLowerCase(); if (o && o.uppercase) s = s.toUpperCase(); return { v: s }; }
        if (typeof v === 'number' || typeof v === 'boolean' || isOid(v)) return castScalar('String', String(v), o);
        return { err: 'String' };
      case 'Number':
        if (typeof v === 'number') return isNaN(v) ? { err: 'Number' } : { v: v };
        if (typeof v === 'string') { if (v.trim() === '') return { v: null }; var n = Number(v); return isNaN(n) ? { err: 'Number' } : { v: n }; }
        if (typeof v === 'boolean') return { v: v ? 1 : 0 };
        return { err: 'Number' };
      case 'Boolean':
        if (v === true || v === 'true' || v === 1 || v === '1' || v === 'yes') return { v: true };
        if (v === false || v === 'false' || v === 0 || v === '0' || v === 'no') return { v: false };
        return { err: 'Boolean' };
      case 'Date':
        var d = v instanceof Date ? new Date(v.getTime()) : (typeof v === 'number' || typeof v === 'string' ? new Date(v) : null);
        return d && !isNaN(d.getTime()) ? { v: d } : { err: 'date' };
      case 'ObjectId':
        if (isOid(v)) return { v: new ObjectId(v.__hex) };
        if (v instanceof Doc) return { v: new ObjectId(v._id.__hex) };
        if (isPlain(v) && v._id) return castScalar('ObjectId', v._id, o);
        if (typeof v === 'string' && /^[0-9a-fA-F]{24}$/.test(v)) return { v: new ObjectId(v) };
        return { err: 'ObjectId', why: 'BSONError' };
      default: return { v: v };
    }
  }
  // cast a whole object against a schema ⇒ { obj, castErrors: { path: CastError } }
  function castObject(schema, data, isNewDoc) {
    var out = {}; var errs = {};
    var src = data || {};
    if (src._id !== undefined) { var ci = castScalar('ObjectId', src._id); if (ci.err) errs._id = castError('ObjectId', src._id, '_id', null, 'BSONError'); else out._id = ci.v; }
    if (isNewDoc && out._id === undefined && schema.options._id !== false) out._id = new ObjectId();
    // casting errors appear in the order of the keys you passed in, like Mongoose (it casts at set time)
    var keysIn = [];
    (function walk(o, pre) { Object.keys(o || {}).forEach(function (k) { var p = pre + k; if (schema.paths[p]) keysIn.push(p); else if (isPlain(o[k])) walk(o[k], p + '.'); }); })(src, '');
    var ordered = keysIn.concat(schema.order.filter(function (p) { return keysIn.indexOf(p) < 0; }));
    ordered.forEach(function (p) {
      var spec = schema.paths[p];
      var raw = getP(src, p);
      if (raw === undefined && isNewDoc) {
        if (spec.o.default !== undefined) raw = typeof spec.o.default === 'function' ? spec.o.default() : clone(spec.o.default);
        else if (spec.type === 'Array') raw = [];
      }
      if (raw === undefined) return;
      var r = castPath(spec, raw, p);
      if (r.err) errs[p] = r.err; else setP(out, p, r.v);
    });
    if (schema.options.timestamps) {
      if (src.createdAt) out.createdAt = new Date(src.createdAt);
      if (src.updatedAt) out.updatedAt = new Date(src.updatedAt);
    }
    if (src.__v !== undefined) out.__v = src.__v;
    return { obj: out, castErrors: errs };
  }
  function castPath(spec, raw, p) {
    if (raw === null) return { v: null };
    if (spec.type === 'Array') {
      var arr = Array.isArray(raw) ? raw : [raw];
      var res = [];
      for (var i = 0; i < arr.length; i++) {
        var r = castElement(spec.caster, arr[i], p);
        if (r.err) return { err: r.err };
        res.push(r.v);
      }
      return { v: res };
    }
    if (spec.type === 'Sub') { var s = castObject(spec.sub, raw, true); var k = Object.keys(s.castErrors); if (k.length) return { err: s.castErrors[k[0]] }; return { v: s.obj }; }
    var c = castScalar(spec.type, raw, spec.o);
    if (c.err) return { err: castError(c.err === 'date' ? 'date' : c.err, raw, p, null, c.why) };
    return { v: c.v };
  }
  function castElement(caster, v, p) {
    if (caster.type === 'Sub') {
      var s = castObject(caster.sub, v instanceof Doc ? v.toObject() : v, !(v && v._id));
      var k = Object.keys(s.castErrors); if (k.length) return { err: s.castErrors[k[0]] };
      if (!s.obj._id && caster.sub.options._id !== false) s.obj._id = new ObjectId();
      return { v: s.obj };
    }
    if (caster.type === 'Array') return castPath(caster, v, p);
    var c = castScalar(caster.type, v, caster.o);
    if (c.err) return { err: castError(c.err === 'date' ? 'date' : '[' + c.err + ']', v, p, null, c.why) };
    return { v: c.v };
  }

  /* ═══════════ validation ═══════════ */
  function fmt(msg, props) { return String(msg).replace(/\{(PATH|VALUE|MIN|MAX|MINLENGTH|MAXLENGTH)\}/g, function (m, k) { return props[k] !== undefined ? String(props[k]) : m; }); }
  function optMsg(opt) { return Array.isArray(opt) ? { val: opt[0], msg: opt[1] } : (isPlain(opt) && 'value' in opt ? { val: opt.value, msg: opt.message } : { val: opt, msg: null }); }
  function emptyForRequired(spec, v) {
    if (v === undefined || v === null) return true;
    if (spec.type === 'String' && v === '') return true;
    return false;
  }
  function verr(kind, msg, p, v) { return mkErr('ValidatorError', msg, { kind: kind, path: p, value: v, properties: { message: msg, type: kind, path: p, value: v } }); }
  // returns ValidatorError or null — for ONE path (first failing validator wins, required first)
  function validatePath(spec, v, p, doc) {
    var o = spec.o || {};
    if (o.required) {
      var rq = optMsg(o.required); var need = typeof rq.val === 'function' ? rq.val.call(doc) : rq.val;
      if (need && emptyForRequired(spec, v)) return verr('required', rq.msg ? fmt(rq.msg, { PATH: p, VALUE: v }) : 'Path `' + p + '` is required.', p, v);
    }
    if (v === undefined || v === null) return null;
    var keys = Object.keys(o);
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i]; var x = optMsg(o[k]);
      if (k === 'min' && typeof v === 'number' && v < x.val) return verr('min', x.msg ? fmt(x.msg, { PATH: p, VALUE: v, MIN: x.val }) : 'Path `' + p + '` (' + v + ') is less than minimum allowed value (' + x.val + ').', p, v);
      if (k === 'max' && typeof v === 'number' && v > x.val) return verr('max', x.msg ? fmt(x.msg, { PATH: p, VALUE: v, MAX: x.val }) : 'Path `' + p + '` (' + v + ') is more than maximum allowed value (' + x.val + ').', p, v);
      if ((k === 'minlength' || k === 'minLength') && typeof v === 'string' && v.length < x.val) return verr('minlength', x.msg ? fmt(x.msg, { PATH: p, VALUE: v, MINLENGTH: x.val }) : 'Path `' + p + '` (`' + v + '`, length ' + v.length + ') is shorter than the minimum allowed length (' + x.val + ').', p, v);
      if ((k === 'maxlength' || k === 'maxLength') && typeof v === 'string' && v.length > x.val) return verr('maxlength', x.msg ? fmt(x.msg, { PATH: p, VALUE: v, MAXLENGTH: x.val }) : 'Path `' + p + '` (`' + v + '`, length ' + v.length + ') is longer than the maximum allowed length (' + x.val + ').', p, v);
      if (k === 'enum') {
        var vals = Array.isArray(o.enum) ? o.enum : (o.enum && o.enum.values) || [];
        var em = !Array.isArray(o.enum) && o.enum && o.enum.message;
        if (vals.indexOf(v) < 0) return verr('enum', em ? fmt(em, { PATH: p, VALUE: v }) : '`' + v + '` is not a valid enum value for path `' + p + '`.', p, v);
      }
      if (k === 'match' && typeof v === 'string') { var re = x.val; re.lastIndex = 0; if (!re.test(v)) return verr('regexp', x.msg ? fmt(x.msg, { PATH: p, VALUE: v }) : 'Path `' + p + '` is invalid (' + v + ').', p, v); }
      if (k === 'validate') {
        var list = Array.isArray(o.validate) && typeof o.validate[0] !== 'function' ? o.validate : [o.validate];
        for (var j = 0; j < list.length; j++) {
          var vd = typeof list[j] === 'function' ? { validator: list[j] } : (Array.isArray(list[j]) ? { validator: list[j][0], message: list[j][1] } : list[j]);
          var ok = vd.validator.call(doc, v);
          if (!ok) {
            var m = typeof vd.message === 'function' ? vd.message({ path: p, value: v }) : vd.message;
            return verr('user defined', m ? fmt(m, { PATH: p, VALUE: v }) : 'Validator failed for path `' + p + '` with value `' + v + '`', p, v);
          }
        }
      }
    }
    if (spec.type === 'Array' && spec.caster && spec.caster.type === 'Sub' && Array.isArray(v)) {
      for (var a = 0; a < v.length; a++) {
        var sub = spec.caster.sub;
        for (var b = 0; b < sub.order.length; b++) {
          var sp = sub.order[b]; var e = validatePath(sub.paths[sp], getP(v[a], sp), p + '.' + a + '.' + sp, v[a]);
          if (e) return e;
        }
      }
    }
    return null;
  }
  // full-document validation, with Mongoose's ordering of the error keys
  function validateDoc(schema, obj, castErrs, doc) {
    var errs = {};
    Object.keys(castErrs || {}).forEach(function (p) { errs[p] = castErrs[p]; });
    var unsetRequired = schema.order.filter(function (p) { var s = schema.paths[p]; return s.o.required && getP(obj, p) === undefined && !errs[p]; }).reverse();
    var rest = schema.order.filter(function (p) { return unsetRequired.indexOf(p) < 0 && !errs[p]; });
    unsetRequired.concat(rest).forEach(function (p) { var e = validatePath(schema.paths[p], getP(obj, p), p, doc); if (e) errs[e.path.indexOf(p) === 0 ? e.path : p] = e; });
    return Object.keys(errs).length ? errs : null;
  }

  /* ═══════════ matching (MongoDB query language, the parts the course uses) ═══════════ */
  function bsonType(v) {
    if (v === null || v === undefined) return 'null';
    if (isOid(v)) return 'objectId';
    if (v instanceof Date) return 'date';
    if (Array.isArray(v)) return 'array';
    if (typeof v === 'number') return Number.isInteger(v) ? 'int' : 'double';
    if (typeof v === 'string') return 'string';
    if (typeof v === 'boolean') return 'bool';
    if (v instanceof RegExp) return 'regex';
    return 'object';
  }
  function eq(a, b) {
    if (isOid(a) || isOid(b)) return isOid(a) && isOid(b) && a.__hex === b.__hex;
    if (a instanceof Date || b instanceof Date) return a instanceof Date && b instanceof Date && a.getTime() === b.getTime();
    if ((a === null || a === undefined) && (b === null || b === undefined)) return true;
    if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every(function (x, i) { return eq(x, b[i]); });
    if (isPlain(a) && isPlain(b)) { var ka = Object.keys(a), kb = Object.keys(b); return ka.length === kb.length && ka.every(function (k) { return eq(a[k], b[k]); }); }
    return a === b;
  }
  function cmp(a, b) {
    var ta = bsonType(a), tb = bsonType(b);
    var num = function (t) { return t === 'int' || t === 'double'; };
    if (num(ta) && num(tb)) return a < b ? -1 : a > b ? 1 : 0;
    if (ta !== tb) return null;
    if (ta === 'string') return a < b ? -1 : a > b ? 1 : 0;
    if (ta === 'date') return a.getTime() - b.getTime();
    if (ta === 'objectId') return a.__hex < b.__hex ? -1 : a.__hex > b.__hex ? 1 : 0;
    if (ta === 'bool') return (a ? 1 : 0) - (b ? 1 : 0);
    return null;
  }
  var TYPE_NUM = { 1: 'double', 2: 'string', 3: 'object', 4: 'array', 7: 'objectId', 8: 'bool', 9: 'date', 10: 'null', 16: 'int', 18: 'long' };
  function valuesAt(doc, p) {
    var parts = p.split('.');
    var cur = [doc];
    for (var i = 0; i < parts.length; i++) {
      var nxt = [];
      cur.forEach(function (c) {
        if (Array.isArray(c) && !/^\d+$/.test(parts[i])) c.forEach(function (x) { if (x != null && typeof x === 'object') nxt.push(x[parts[i]]); });
        else if (c != null && typeof c === 'object') nxt.push(c[parts[i]]);
        else nxt.push(undefined);
      });
      cur = nxt;
    }
    return cur;
  }
  function isOpObj(c) { return isPlain(c) && Object.keys(c).length > 0 && Object.keys(c).every(function (k) { return k.charAt(0) === '$'; }); }
  function testOne(v, op, arg, cond) {
    var arr = Array.isArray(v) ? v : null;
    var any = function (f) { return arr ? (arr.some(f) || f(v)) : f(v); };
    switch (op) {
      case '$eq': return any(function (x) { return eq(x, arg); });
      case '$ne': return !any(function (x) { return eq(x, arg); });
      case '$gt': return any(function (x) { var c = cmp(x, arg); return c !== null && c > 0; });
      case '$gte': return any(function (x) { var c = cmp(x, arg); return c !== null && c >= 0; });
      case '$lt': return any(function (x) { var c = cmp(x, arg); return c !== null && c < 0; });
      case '$lte': return any(function (x) { var c = cmp(x, arg); return c !== null && c <= 0; });
      case '$in': return any(function (x) { return arg.some(function (a) { return a instanceof RegExp ? typeof x === 'string' && a.test(x) : eq(x, a); }); });
      case '$nin': return !any(function (x) { return arg.some(function (a) { return eq(x, a); }); });
      case '$exists': return arg ? v !== undefined : v === undefined;
      case '$size': return Array.isArray(v) && v.length === arg;
      case '$all': return Array.isArray(v) && arg.every(function (a) { return v.some(function (x) { return eq(x, a); }); });
      case '$regex': var re = arg instanceof RegExp ? arg : new RegExp(arg, cond.$options || ''); return any(function (x) { return typeof x === 'string' && re.test(x); });
      case '$options': return true;
      case '$type': var want = typeof arg === 'number' ? TYPE_NUM[arg] : arg; return any(function (x) { var t = bsonType(x); return t === want || (want === 'number' && (t === 'int' || t === 'double')) || (want === 'double' && t === 'int'); });
      case '$elemMatch': return Array.isArray(v) && v.some(function (x) { return isOpObj(arg) ? Object.keys(arg).every(function (o) { return testOne(x, o, arg[o], arg); }) : matches(x, arg); });
      case '$not': return !testCond(v, arg);
      default: throw mkErr('MongoServerError', 'unknown operator: ' + op, { code: 2 });
    }
  }
  function testCond(v, c) {
    if (c instanceof RegExp) { var arr = Array.isArray(v) ? v : [v]; return arr.some(function (x) { return typeof x === 'string' && c.test(x); }); }
    if (isOpObj(c)) return Object.keys(c).every(function (op) { return testOne(v, op, c[op], c); });
    if (Array.isArray(v) && !Array.isArray(c)) return v.some(function (x) { return eq(x, c); });
    if (Array.isArray(v) && Array.isArray(c)) return eq(v, c) || v.some(function (x) { return eq(x, c); });
    return eq(v, c);
  }
  function matches(doc, filter) {
    filter = filter || {};
    return Object.keys(filter).every(function (k) {
      var c = filter[k];
      if (k === '$or') return c.some(function (f) { return matches(doc, f); });
      if (k === '$and') return c.every(function (f) { return matches(doc, f); });
      if (k === '$nor') return !c.some(function (f) { return matches(doc, f); });
      if (k === '$expr') { if (!G.__mg.evalExpr) throw mkErr('MongoServerError', '$expr needs the aggregation library in this practice'); return !!G.__mg.evalExpr(c, doc); }
      var vals = valuesAt(doc, k);
      if (vals.length === 1) return testCond(vals[0], c);
      if (isOpObj(c) && (c.$ne !== undefined || c.$nin !== undefined || c.$exists === false)) return vals.every(function (v) { return testCond(v, c); });
      return vals.some(function (v) { return testCond(v, c); });
    });
  }
  // cast a filter for a model (Mongoose casts query values to the schema types)
  function castFilter(model, filter) {
    var schema = model.schema;
    function specOf(p) { if (p === '_id') return { type: 'ObjectId', o: {} }; var s = schema.paths[p]; if (!s) { var m = p.match(/^(.*)\.\d+$/); s = m && schema.paths[m[1]]; } return s; }
    function castVal(spec, v, p) {
      if (v === null || v === undefined || v instanceof RegExp) return v;
      var t = spec.type === 'Array' ? spec.caster.type : spec.type;
      if (t === 'Sub' || t === 'Mixed' || t === 'Array') return v;
      if (Array.isArray(v) && spec.type === 'Array') return v.map(function (x) { return castVal(spec, x, p); });
      var r = castScalar(t, v, spec.type === 'Array' ? {} : {});
      if (r.err) throw castError(r.err === 'date' ? 'date' : r.err, v, p, model.modelName);
      return r.v;
    }
    function walk(f) {
      var out = {};
      Object.keys(f || {}).forEach(function (k) {
        var c = f[k];
        if (k === '$or' || k === '$and' || k === '$nor') { out[k] = c.map(walk); return; }
        if (k.charAt(0) === '$') { out[k] = c; return; }
        var spec = specOf(k);
        if (!spec) { out[k] = c; return; }
        if (isOpObj(c)) {
          var o = {};
          Object.keys(c).forEach(function (op) {
            var a = c[op];
            if (op === '$in' || op === '$nin' || op === '$all') o[op] = (Array.isArray(a) ? a : [a]).map(function (x) { return castVal(spec, x, k); });
            else if (op === '$exists' || op === '$size' || op === '$regex' || op === '$options' || op === '$type' || op === '$elemMatch' || op === '$not') o[op] = a;
            else o[op] = castVal(spec, a, k);
          });
          out[k] = o;
        } else out[k] = castVal(spec, c, k);
      });
      return out;
    }
    return walk(filter);
  }

  /* ═══════════ projection ═══════════ */
  function parseSelect(sel) {
    if (!sel) return null;
    var inc = {}, exc = {}, plus = {};
    var add = function (k, v) { if (k.charAt(0) === '+') plus[k.slice(1)] = 1; else if (k.charAt(0) === '-') exc[k.slice(1)] = 1; else if (v === 0 || v === false) exc[k] = 1; else inc[k] = 1; };
    if (typeof sel === 'string') sel.split(/\s+/).filter(Boolean).forEach(function (k) { add(k); });
    else if (Array.isArray(sel)) sel.forEach(function (k) { add(k); });
    else Object.keys(sel).forEach(function (k) { add(k, sel[k]); });
    return { inc: inc, exc: exc, plus: plus };
  }
  function mergeSelect(a, b) {
    if (!a) return b; if (!b) return a;
    return { inc: Object.assign({}, a.inc, b.inc), exc: Object.assign({}, a.exc, b.exc), plus: Object.assign({}, a.plus, b.plus) };
  }
  function project(schema, row, sel) {
    var out = clone(row);
    var hidden = schema ? schema.order.filter(function (p) { return schema.paths[p].o.select === false; }) : [];
    var inc = sel ? Object.keys(sel.inc) : [];
    if (inc.length) {
      var o2 = {};
      if (!(sel.exc._id)) o2._id = out._id;
      inc.forEach(function (p) { var v = getP(out, p); if (v !== undefined) setP(o2, p, v); });
      Object.keys(sel.plus || {}).forEach(function (p) { var v = getP(out, p); if (v !== undefined) setP(o2, p, v); });
      return o2;
    }
    hidden.forEach(function (p) { if (!(sel && (sel.plus[p] || sel.inc[p]))) delP(out, p); });
    if (sel) Object.keys(sel.exc).forEach(function (p) { delP(out, p); });
    return out;
  }

  /* ═══════════ sorting ═══════════ */
  function parseSort(s) {
    if (!s) return null;
    var out = [];
    if (typeof s === 'string') s.split(/\s+/).filter(Boolean).forEach(function (k) { out.push(k.charAt(0) === '-' ? [k.slice(1), -1] : [k.replace(/^\+/, ''), 1]); });
    else if (Array.isArray(s)) s.forEach(function (x) { out.push([x[0], x[1] === -1 || x[1] === 'desc' || x[1] === 'descending' ? -1 : 1]); });
    else Object.keys(s).forEach(function (k) { var d = s[k]; out.push([k, d === -1 || d === '-1' || d === 'desc' || d === 'descending' ? -1 : 1]); });
    return out;
  }
  function sortRows(rows, spec) {
    if (!spec || !spec.length) return rows;
    return rows.map(function (r, i) { return { r: r, i: i }; }).sort(function (x, y) {
      for (var j = 0; j < spec.length; j++) {
        var a = getP(x.r, spec[j][0]), b = getP(y.r, spec[j][0]);
        var c;
        if (a == null && b == null) c = 0; else if (a == null) c = -1; else if (b == null) c = 1; else { c = cmp(a, b); if (c === null) c = String(a) < String(b) ? -1 : String(a) > String(b) ? 1 : 0; }
        if (c) return c * spec[j][1];
      }
      return x.i - y.i;
    }).map(function (x) { return x.r; });
  }

  /* ═══════════ unique indexes ═══════════ */
  function idxName(fields) { return Object.keys(fields).map(function (k) { return k + '_' + fields[k]; }).join('_'); }
  function fmtKey(v) { if (v === undefined || v === null) return 'null'; if (typeof v === 'string') return '"' + v + '"'; if (isOid(v)) return "ObjectId('" + v.__hex + "')"; if (v instanceof Date) return 'new Date(' + v.getTime() + ')'; return String(v); }
  function dupError(model, idx, row, name) {
    var kv = {}; var kp = {};
    Object.keys(idx.fields).forEach(function (k) { var v = getP(row, k); kv[k] = v === undefined ? null : v; kp[k] = idx.fields[k]; });
    var msg = 'E11000 duplicate key error collection: ' + DBNAME + '.' + model.collection.name + ' index: ' + idxName(idx.fields) + ' dup key: { ' + Object.keys(kv).map(function (k) { return k + ': ' + fmtKey(kv[k]); }).join(', ') + ' }';
    return mkErr(name || 'MongoServerError', msg, { code: 11000, keyPattern: kp, keyValue: kv, index: 0 });
  }
  function checkUnique(model, row, exceptRow, name) {
    var rows = STORE[model.collection.name];
    var idxs = model.schema.indexes.filter(function (i) { return i.unique; });
    for (var i = 0; i < idxs.length; i++) {
      var idx = idxs[i]; var ks = Object.keys(idx.fields);
      if (idx.sparse && ks.every(function (k) { return getP(row, k) === undefined; })) continue;
      var clash = rows.some(function (r) { return r !== exceptRow && r !== row && ks.every(function (k) { return eq(getP(r, k), getP(row, k)); }); });
      if (clash) throw dupError(model, idx, row, name);
    }
  }

  /* ═══════════ Document ═══════════ */
  function Doc() {}
  function defHidden(o, k, v) { Object.defineProperty(o, k, { value: v, writable: true, configurable: true, enumerable: false }); }
  function hydrate(model, row, opts) {
    var d = Object.create(model.prototype);
    var data = clone(row);
    Object.keys(data).forEach(function (k) { d[k] = data[k]; });
    defHidden(d, '$__', { model: model, isNew: !!(opts && opts.isNew), snap: JSON.stringify(row), castErrors: (opts && opts.castErrors) || {}, row: opts && opts.row, populated: {} });
    return d;
  }
  function plainOf(d, o) {
    var out = {};
    Object.keys(d).forEach(function (k) {
      var v = d[k];
      out[k] = v instanceof Doc ? plainOf(v, o) : Array.isArray(v) ? v.map(function (x) { return x instanceof Doc ? plainOf(x, o) : clone(x); }) : clone(v);
    });
    var schema = d.$__ && d.$__.model.schema;
    var t = schema && (o === 'json' ? schema._toJSON : schema._toObject);
    if (t && t.virtuals) Object.keys(schema.virtuals).forEach(function (k) { out[k] = schema.virtuals[k].call(d); });
    if (t && typeof t.transform === 'function') { var r = t.transform(d, out, t); if (r !== undefined && r !== out) return r; }
    return out;
  }
  Object.defineProperties(Doc.prototype, {
    id: { get: function () { return this._id == null ? null : String(this._id); }, configurable: true },
    isNew: { get: function () { return this.$__.isNew; }, configurable: true },
  });
  Doc.prototype.toObject = function () { return plainOf(this, 'object'); };
  Doc.prototype.toJSON = function () { return plainOf(this, 'json'); };
  Doc.prototype.get = function (p) { return getP(this, p); };
  Doc.prototype.set = function (p, v) { if (isPlain(p)) { var self = this; Object.keys(p).forEach(function (k) { setP(self, k, p[k]); }); } else setP(this, p, v); return this; };
  Doc.prototype.isModified = function (p) {
    if (this.$__.isNew) return p === undefined ? true : getP(this, p) !== undefined;
    var old = JSON.parse(this.$__.snap);
    var cur = JSON.parse(JSON.stringify(plainOf(this, 'object')));
    if (p === undefined) return JSON.stringify(old) !== JSON.stringify(cur);
    return JSON.stringify(getP(old, p)) !== JSON.stringify(getP(cur, p));
  };
  Doc.prototype.markModified = function () { return this; };
  Doc.prototype.equals = function (o) { return !!o && eq(this._id, o._id); };
  Doc.prototype.validateSync = function () {
    var schema = this.$__.model.schema;
    var c = castObject(schema, this.toObject(), false);
    var self = this; var old = {};
    Object.keys(this.$__.castErrors).forEach(function (p) { if (getP(self, p) === undefined) old[p] = self.$__.castErrors[p]; });
    var errs = validateDoc(schema, c.obj, Object.assign(old, c.castErrors), this);
    return errs ? ValidationError(this.$__.model.modelName + ' validation failed', errs) : undefined;
  };
  Doc.prototype.validate = function () { var e = this.validateSync(); return e ? Promise.reject(e) : Promise.resolve(); };
  function runHooks(list, ctx, arg) {
    return (list || []).reduce(function (p, fn) {
      return p.then(function () {
        return new Promise(function (ok, ko) {
          if (fn.length >= 1) {
            var r;
            try { r = fn.call(ctx, function (err) { if (err) ko(err); else ok(); }, arg); } catch (e) { ko(e); return; }
            if (r && typeof r.then === 'function') r.then(ok, ko);
          } else {
            try { Promise.resolve(fn.call(ctx, arg)).then(ok, ko); } catch (e) { ko(e); }
          }
        });
      });
    }, Promise.resolve());
  }
  Doc.prototype.save = function () {
    var self = this; var model = this.$__.model; var schema = model.schema;
    return Promise.resolve().then(function () {
      return runHooks(schema.hooks.pre.validate, self);
    }).then(function () {
      var e = self.validateSync(); if (e) throw e;
      return runHooks(schema.hooks.pre.save, self);
    }).then(function () {
      var e = self.validateSync(); if (e) throw e;
      var c = castObject(schema, self.toObject(), false);
      var row = c.obj;
      var rows = STORE[model.collection.name];
      var t = now();
      if (self.$__.isNew) {
        if (schema.options.timestamps) { row.createdAt = row.createdAt || t; row.updatedAt = row.updatedAt || t; }
        if (schema.options.versionKey !== false) row.__v = row.__v || 0;
        checkUnique(model, row, null);
        rows.push(row);
      } else {
        var i = -1; for (var j = 0; j < rows.length; j++) if (eq(rows[j]._id, row._id)) i = j;
        if (i < 0) throw mkErr('DocumentNotFoundError', 'No document found for query "{ _id: ' + "ObjectId('" + row._id + "')" + ' }" on model "' + model.modelName + '"');
        if (schema.options.timestamps && self.isModified()) row.updatedAt = t;
        checkUnique(model, row, rows[i]);
        rows[i] = row;
      }
      Object.keys(row).forEach(function (k) { if (!(self[k] instanceof Doc) && !(Array.isArray(self[k]) && self[k].some(function (x) { return x instanceof Doc; }))) self[k] = clone(row[k]); });
      self.$__.isNew = false; self.$__.snap = JSON.stringify(row); self.$__.castErrors = {};
      return runHooks(schema.hooks.post.save, self, self);
    }).then(function () { return self; });
  };
  Doc.prototype.deleteOne = function () {
    var self = this; var model = this.$__.model;
    return later(function () { var rows = STORE[model.collection.name]; var i = rows.findIndex(function (r) { return eq(r._id, self._id); }); if (i >= 0) rows.splice(i, 1); return { acknowledged: true, deletedCount: i >= 0 ? 1 : 0 }; });
  };
  Doc.prototype.populate = function () {
    var self = this; var specs = parsePopulateArgs([].slice.call(arguments));
    return populateDocs(this.$__.model, [self], specs).then(function () { return self; });
  };

  /* ═══════════ populate ═══════════ */
  function parsePopulateArgs(args) {
    var out = [];
    var a = args[0];
    if (Array.isArray(a)) { a.forEach(function (x) { out = out.concat(parsePopulateArgs([x])); }); return out; }
    if (typeof a === 'string') { a.split(/\s+/).filter(Boolean).forEach(function (p) { out.push({ path: p, select: args[1], model: args[2] }); }); return out; }
    if (isPlain(a)) { (a.path || '').split(/\s+/).filter(Boolean).forEach(function (p) { out.push(Object.assign({}, a, { path: p })); }); }
    return out;
  }
  function populateDocs(model, docs, specs) {
    return specs.reduce(function (pr, sp) {
      return pr.then(function () {
        var spec = model.schema.paths[sp.path];
        if (!spec) {
          if (model.schema.virtuals[sp.path] || sp.strictPopulate === false) return;
          throw mkErr('StrictPopulateError', 'Cannot populate path `' + sp.path + '` because it is not in your schema. Set the `strictPopulate` option to false to override.', { path: sp.path });
        }
        var ref = sp.model ? (typeof sp.model === 'string' ? sp.model : sp.model.modelName) : (spec.type === 'Array' ? spec.caster.o && spec.caster.o.ref : spec.o.ref);
        if (!ref) return;
        var Ref = MODELS[ref];
        if (!Ref) throw mkErr('MissingSchemaError', 'Schema hasn\'t been registered for model "' + ref + '".\nUse mongoose.model(name, schema)');
        var sel = parseSelect(sp.select);
        var rows = STORE[Ref.collection.name];
        var found = function (id) {
          if (id == null) return null;
          var hexv = id instanceof Doc ? id._id : id;
          var r = rows.find(function (x) { return eq(x._id, hexv) && (!sp.match || matches(x, castFilter(Ref, sp.match))); });
          if (!r) return null;
          return hydrate(Ref, project(Ref.schema, r, sel), { row: r });
        };
        var created = [];
        docs.forEach(function (d) {
          if (!d) return;
          var v = getP(d, sp.path);
          if (Array.isArray(v)) { var list = v.map(found).filter(Boolean); setP(d, sp.path, list); created = created.concat(list); }
          else if (v !== undefined) { var one = found(v); setP(d, sp.path, one); if (one) created.push(one); }
          d.$__.populated[sp.path] = true;
        });
        if (sp.populate && created.length) return populateDocs(Ref, created, parsePopulateArgs([sp.populate]));
      });
    }, Promise.resolve());
  }

  /* ═══════════ updates ═══════════ */
  function applyUpdate(model, row, update, opts, ctxIsUpsert) {
    var schema = model.schema;
    var u = {};
    var keys = Object.keys(update || {});
    var hasOp = keys.some(function (k) { return k.charAt(0) === '$'; });
    if (!hasOp) u.$set = update; else keys.forEach(function (k) { u[k] = update[k]; });
    var vErrs = {};
    var specOf = function (p) { return schema.paths[p] || (p === '_id' ? { type: 'ObjectId', o: {} } : null); };
    var castOrThrow = function (spec, v, p) { var r = castPath(spec, v, p); if (r.err) { var e = r.err; e.message = e.message.replace(/ because of "BSONError"/, ''); throw e; } return r.v; };
    var check = function (spec, v, p) { if (opts && opts.runValidators) { var e = validatePath(spec, v, p, row); if (e) vErrs[p] = e; } };
    Object.keys(u).forEach(function (op) {
      var body = u[op] || {};
      Object.keys(body).forEach(function (p) {
        var spec = specOf(p); var arrM = !spec && p.match(/^(.*)\.(\d+|\$)$/);
        if (!spec && !arrM && schema.options.strict !== false) return; // strict: unknown paths are dropped silently
        var v = body[p];
        if (op === '$set') { var cv = spec ? castOrThrow(spec, v, p) : v; check(spec || {}, cv, p); setP(row, p, cv); }
        else if (op === '$unset') { if (spec && spec.o.required && opts && opts.runValidators) vErrs[p] = verr('required', 'Path `' + p + '` is required.', p, undefined); delP(row, p); }
        else if (op === '$inc') { var n = castOrThrow({ type: 'Number', o: {} }, v, p); var nv = (getP(row, p) || 0) + n; check(spec || {}, nv, p); setP(row, p, nv); }
        else if (op === '$push' || op === '$addToSet') {
          var each = isPlain(v) && v.$each ? v.$each : [v];
          var cur = getP(row, p); if (!Array.isArray(cur)) { cur = []; setP(row, p, cur); }
          each.forEach(function (x) {
            var c = spec && spec.type === 'Array' ? castElement(spec.caster, x, p) : { v: x };
            if (c.err) throw c.err;
            if (op === '$addToSet' && cur.some(function (y) { return eq(y, c.v); })) return;
            cur.push(c.v);
          });
        }
        else if (op === '$pull') {
          var arr = getP(row, p); if (!Array.isArray(arr)) return;
          var cnd = spec && spec.type === 'Array' && !isPlain(v) ? (castElement(spec.caster, v, p).v) : v;
          setP(row, p, arr.filter(function (x) { return isPlain(cnd) && isPlain(x) ? !matches(x, cnd) : !testCond(x, cnd); }));
        }
        else if (op === '$rename') { var val = getP(row, p); if (val !== undefined) { delP(row, p); setP(row, v, val); } }
        else if (op === '$setOnInsert') { if (ctxIsUpsert) setP(row, p, spec ? castOrThrow(spec, v, p) : v); }
        else if (op === '$min' || op === '$max') { var cv2 = spec ? castOrThrow(spec, v, p) : v; var old = getP(row, p); var c2 = old === undefined ? null : cmp(cv2, old); if (old === undefined || (op === '$min' ? c2 < 0 : c2 > 0)) setP(row, p, cv2); }
        else throw mkErr('MongoServerError', "Unknown modifier: " + op, { code: 9 });
      });
    });
    if (Object.keys(vErrs).length) throw ValidationError('Validation failed', vErrs);
    if (schema.options.timestamps) row.updatedAt = now();
    return row;
  }

  /* ═══════════ Query ═══════════ */
  function Query(model, op, filter, extra) {
    this.model = model; this.op = op; this._filter = filter || {}; this._extra = extra || {};
    this._sel = parseSelect(this._extra.projection); this._sortSpec = null; this._limitN = null; this._skipN = 0; this._pops = []; this._lean = false; this._done = false; this._orFail = false;
  }
  Query.prototype.select = function (s) { this._sel = mergeSelect(this._sel, parseSelect(s)); return this; };
  Query.prototype.sort = function (s) { this._sortSpec = (this._sortSpec || []).concat(parseSort(s) || []); return this; };
  Query.prototype.limit = function (n) { this._limitN = n; return this; };
  Query.prototype.skip = function (n) { this._skipN = n; return this; };
  Query.prototype.lean = function (v) { this._lean = v !== false; return this; };
  Query.prototype.populate = function () { this._pops = this._pops.concat(parsePopulateArgs([].slice.call(arguments))); return this; };
  Query.prototype.where = function (f) { if (isPlain(f)) Object.assign(this._filter, f); return this; };
  Query.prototype.setOptions = function (o) { Object.assign(this._extra.options = this._extra.options || {}, o); return this; };
  Query.prototype.orFail = function (e) { this._orFail = e || true; return this; };
  Query.prototype.getFilter = function () { return this._filter; };
  Query.prototype.countDocuments = function (f) { this.op = 'countDocuments'; if (f) this._filter = f; return this; };
  Query.prototype.exec = function () {
    var self = this;
    var label = this.model.modelName + '.' + this.op + '(' + showVal(this._filter).replace(/^\{\s*\}$/, '{}') + ')';
    if (this._done) return Promise.reject(mkErr('MongooseError', 'Query was already executed: ' + label));
    this._done = true;
    return later(function () { return self._run(); }).then(function (r) {
      if (self._orFail && (r === null || (Array.isArray(r) && !r.length && false))) {
        if (self._orFail !== true) throw typeof self._orFail === 'function' ? self._orFail() : self._orFail;
        throw mkErr('DocumentNotFoundError', 'No document found for query "' + showVal(self._filter).replace(/"/g, "'") + '" on model "' + self.model.modelName + '"');
      }
      return r;
    });
  };
  Query.prototype.then = function (a, b) { return this.exec().then(a, b); };
  Query.prototype.catch = function (b) { return this.exec().catch(b); };
  Query.prototype.finally = function (f) { return this.exec().finally(f); };
  Query.prototype._rows = function () {
    var f = castFilter(this.model, this._filter);
    var rows = STORE[this.model.collection.name].filter(function (r) { return matches(r, f); });
    return rows;
  };
  Query.prototype._out = function (rows) {
    var self = this; var model = this.model;
    rows = sortRows(rows, this._sortSpec);
    if (this._skipN) rows = rows.slice(this._skipN);
    if (this._limitN != null && this._limitN > 0) rows = rows.slice(0, this._limitN);
    var docs = rows.map(function (r) { return hydrate(model, project(model.schema, r, self._sel), { row: r }); });
    return populateDocs(model, docs, this._pops).then(function () { return self._lean ? docs.map(function (d) { return d.toObject(); }) : docs; });
  };
  Query.prototype._run = function () {
    var self = this; var model = this.model; var rows = STORE[model.collection.name];
    var o = this._extra.options || {};
    switch (this.op) {
      case 'find': return this._out(this._rows());
      case 'findOne': return this._out(this._rows()).then(function (d) { return d[0] || null; });
      case 'countDocuments': return this._rows().length;
      case 'exists': var r = this._rows()[0]; return r ? { _id: new ObjectId(r._id.__hex) } : null;
      case 'distinct': var seen = []; this._rows().forEach(function (x) { var v = getP(x, self._extra.field); (Array.isArray(v) ? v : [v]).forEach(function (y) { if (y !== undefined && !seen.some(function (s) { return eq(s, y); })) seen.push(y); }); }); return seen;
      case 'findOneAndUpdate': {
        var hit = sortRows(this._rows(), this._sortSpec)[0];
        var upsert = false;
        if (!hit) {
          if (!o.upsert) return null;
          var seed = {}; Object.keys(this._filter).forEach(function (k) { if (k.charAt(0) !== '$' && !isOpObj(self._filter[k])) seed[k] = self._filter[k]; });
          var c0 = castObject(model.schema, seed, true); hit = c0.obj; upsert = true;
          if (model.schema.options.timestamps) hit.createdAt = now();
          if (model.schema.options.versionKey !== false) hit.__v = 0;
        }
        var before = clone(hit);
        var after = applyUpdate(model, clone(hit), this._extra.update, o, upsert);
        checkUnique(model, after, upsert ? null : hit);
        if (upsert) rows.push(after); else rows[rows.indexOf(hit)] = after;
        var ret = (o.new || o.returnDocument === 'after') ? after : (upsert ? null : before);
        return ret ? this._out([ret]).then(function (d) { return d[0]; }) : null;
      }
      case 'findOneAndDelete': {
        var h = sortRows(this._rows(), this._sortSpec)[0];
        if (!h) return null;
        rows.splice(rows.indexOf(h), 1);
        return this._out([h]).then(function (d) { return d[0]; });
      }
      case 'updateOne': case 'updateMany': {
        var hits = this._rows(); if (this.op === 'updateOne') hits = hits.slice(0, 1);
        var modified = 0; var upId = null;
        hits.forEach(function (h0) {
          var a = applyUpdate(model, clone(h0), self._extra.update, o, false);
          checkUnique(model, a, h0);
          if (JSON.stringify(a) !== JSON.stringify(h0)) modified++;
          rows[rows.indexOf(h0)] = a;
        });
        if (!hits.length && o.upsert) {
          var s2 = {}; Object.keys(this._filter).forEach(function (k) { if (k.charAt(0) !== '$' && !isOpObj(self._filter[k])) s2[k] = self._filter[k]; });
          var nr = applyUpdate(model, castObject(model.schema, s2, true).obj, self._extra.update, o, true);
          if (model.schema.options.timestamps) nr.createdAt = nr.createdAt || now();
          if (model.schema.options.versionKey !== false) nr.__v = 0;
          checkUnique(model, nr, null); rows.push(nr); upId = new ObjectId(nr._id.__hex);
        }
        return { acknowledged: true, modifiedCount: modified, upsertedId: upId, upsertedCount: upId ? 1 : 0, matchedCount: hits.length };
      }
      case 'deleteOne': case 'deleteMany': {
        var del = this._rows(); if (this.op === 'deleteOne') del = del.slice(0, 1);
        del.forEach(function (d) { rows.splice(rows.indexOf(d), 1); });
        return { acknowledged: true, deletedCount: del.length };
      }
    }
    throw new Error('unsupported query ' + this.op);
  };

  /* ═══════════ Model ═══════════ */
  function idFilter(id) { return { _id: id }; }
  function compile(name, schema) {
    var coll = schema.options.collection || pluralize(name);
    STORE[coll] = STORE[coll] || [];
    function Model(data) {
      var c = castObject(schema, data instanceof Doc ? data.toObject() : data, true);
      var d = hydrate(Model, c.obj, { isNew: true, castErrors: c.castErrors });
      return d;
    }
    Model.prototype = Object.create(Doc.prototype);
    Object.keys(schema.methods).forEach(function (k) { defHidden(Model.prototype, k, schema.methods[k]); });
    Object.keys(schema.virtuals).forEach(function (k) { Object.defineProperty(Model.prototype, k, { get: schema.virtuals[k], configurable: true }); });
    Model.modelName = name; Model.schema = schema; Model.collection = { name: coll, collectionName: coll };
    Model.find = function (f, proj) { return new Query(Model, 'find', f, { projection: proj }); };
    Model.findOne = function (f, proj) { return new Query(Model, 'findOne', f, { projection: proj }); };
    Model.findById = function (id, proj) { if (id === undefined || id === null) { var q0 = new Query(Model, 'findOne', { _id: '__none__' }); q0._run = function () { return null; }; return q0; } return new Query(Model, 'findOne', idFilter(id), { projection: proj }); };
    Model.countDocuments = function (f) { return new Query(Model, 'countDocuments', f); };
    Model.estimatedDocumentCount = function () { return new Query(Model, 'countDocuments', {}); };
    Model.exists = function (f) { return new Query(Model, 'exists', f); };
    Model.distinct = function (field, f) { return new Query(Model, 'distinct', f, { field: field }); };
    Model.findOneAndUpdate = function (f, u, o) { return new Query(Model, 'findOneAndUpdate', f, { update: u, options: o }); };
    Model.findByIdAndUpdate = function (id, u, o) { if (id == null) { var q1 = new Query(Model, 'findOne', {}); q1._run = function () { return null; }; return q1; } return new Query(Model, 'findOneAndUpdate', idFilter(id), { update: u, options: o }); };
    Model.findOneAndDelete = function (f) { return new Query(Model, 'findOneAndDelete', f); };
    Model.findByIdAndDelete = Model.findByIdAndRemove = function (id) { if (id == null) { var q2 = new Query(Model, 'findOne', {}); q2._run = function () { return null; }; return q2; } return new Query(Model, 'findOneAndDelete', idFilter(id)); };
    Model.updateOne = function (f, u, o) { return new Query(Model, 'updateOne', f, { update: u, options: o }); };
    Model.updateMany = function (f, u, o) { return new Query(Model, 'updateMany', f, { update: u, options: o }); };
    Model.replaceOne = function (f, u, o) { return new Query(Model, 'updateOne', f, { update: { $set: u }, options: o }); };
    Model.deleteOne = function (f) { return new Query(Model, 'deleteOne', f); };
    Model.deleteMany = function (f) { return new Query(Model, 'deleteMany', f); };
    Model.create = function (a) {
      var many = Array.isArray(a) || arguments.length > 1;
      var list = Array.isArray(a) ? a : [].slice.call(arguments);
      return list.reduce(function (p, x) { return p.then(function (acc) { return new Model(x).save().then(function (d) { acc.push(d); return acc; }); }); }, Promise.resolve([]))
        .then(function (r) { return many ? r : r[0]; });
    };
    Model.insertMany = function (list) {
      return later(function () {
        var docs = (list || []).map(function (x) { return new Model(x); });
        docs.forEach(function (d) { var e = d.validateSync(); if (e) throw e; });
        var rows = STORE[coll]; var t = now(); var added = [];
        docs.forEach(function (d) {
          var row = castObject(schema, d.toObject(), false).obj;
          if (schema.options.timestamps) { row.createdAt = t; row.updatedAt = t; }
          if (schema.options.versionKey !== false) row.__v = 0;
          try { checkUnique(Model, row, null, 'MongoBulkWriteError'); } catch (e) { e.insertedDocs = added; throw e; }
          rows.push(row); added.push(hydrate(Model, row, { row: row }));
        });
        return added;
      });
    };
    Model.aggregate = function (p) { if (!G.__mg.Aggregate) throw new Error('Model.aggregate() is not available in this exercise (no aggregation library loaded)'); return new G.__mg.Aggregate(Model, p); };
    Model.syncIndexes = Model.init = Model.createIndexes = function () {
      return later(function () {
        var rows = STORE[coll];
        schema.indexes.filter(function (i) { return i.unique; }).forEach(function (idx) {
          var ks = Object.keys(idx.fields);
          for (var i = 0; i < rows.length; i++) for (var j = i + 1; j < rows.length; j++) {
            if (idx.sparse && ks.every(function (k) { return getP(rows[j], k) === undefined; })) continue;
            if (ks.every(function (k) { return eq(getP(rows[i], k), getP(rows[j], k)); })) { var e = dupError(Model, idx, rows[j]); e.message = 'Index build failed: ' + e.message; throw e; }
          }
        });
        return schema.indexes.map(function (i) { return idxName(i.fields); });
      });
    };
    Model.hydrate = function (o) { return hydrate(Model, o, {}); };
    Model.where = function (f) { return Model.find(f); };
    Object.keys(schema.statics).forEach(function (k) { Model[k] = schema.statics[k]; });
    return Model;
  }

  /* ═══════════ mongoose ═══════════ */
  var mongoose = {
    Schema: Schema,
    Types: { ObjectId: ObjectId },
    models: MODELS,
    connection: { readyState: 0, name: null, host: null, on: function () { return this; }, once: function () { return this; } },
    Error: { ValidationError: ValidationErrorCtor, CastError: CastErrorCtor, ValidatorError: ValidatorErrorCtor, DocumentNotFoundError: function () {} },
    isValidObjectId: function (v) { return ObjectId.isValid(v); },
    isObjectIdOrHexString: function (v) { return isOid(v) || (typeof v === 'string' && /^[0-9a-fA-F]{24}$/.test(v)); },
    set: function () { return mongoose; },
    model: function (name, schema) {
      if (schema === undefined) {
        if (MODELS[name]) return MODELS[name];
        throw mkErr('MissingSchemaError', 'Schema hasn\'t been registered for model "' + name + '".\nUse mongoose.model(name, schema)');
      }
      if (MODELS[name]) { if (MODELS[name].schema === schema) return MODELS[name]; throw mkErr('OverwriteModelError', 'Cannot overwrite `' + name + '` model once compiled.'); }
      if (!(schema instanceof Schema)) schema = new Schema(schema);
      MODELS[name] = compile(name, schema);
      return MODELS[name];
    },
    deleteModel: function (name) { delete MODELS[name]; return mongoose; },
    connect: function (uri) {
      return new Promise(function (ok, ko) {
        G.setTimeout(function () {
          if (typeof uri !== 'string') return ko(mkErr('MongooseError', 'The `uri` parameter to `openUri()` must be a string, got "' + typeName(uri).replace('null', 'null') + '". Make sure the first parameter to `mongoose.connect()` or `mongoose.createConnection()` is a string.'));
          if (!/^mongodb(\+srv)?:\/\//.test(uri)) return ko(mkErr('MongoParseError', 'Invalid scheme, expected connection string to start with "mongodb://" or "mongodb+srv://"'));
          var m = uri.replace(/^mongodb(\+srv)?:\/\//, '').replace(/^[^@]*@/, '');
          var host = m.split('/')[0]; var db = (m.split('/')[1] || '').split('?')[0];
          DBNAME = db || 'test';
          mongoose.connection.readyState = 1; mongoose.connection.name = DBNAME; mongoose.connection.host = host.split(':')[0];
          G.__mongo.connectedTo = uri;
          ok(mongoose);
        }, 30);
      });
    },
    disconnect: function () { mongoose.connection.readyState = 0; return Promise.resolve(); },
  };
  mongoose.Schema.Types.ObjectId = 'ObjectId';
  mongoose.default = mongoose;
  G.mongoose = mongoose;
  MODS.mongoose = mongoose;
  G.__mongo = { connectedTo: null, rows: function (coll) { return clone(STORE[coll] || []); }, reset: function () { Object.keys(STORE).forEach(function (k) { STORE[k].length = 0; }); } };

  G.__mg = { STORE: STORE, ObjectId: ObjectId, clone: clone, getP: getP, setP: setP, delP: delP, eq: eq, cmp: cmp, matches: matches, testCond: testCond, sortRows: sortRows, parseSort: parseSort,
    parseSelect: parseSelect, project: project, applyUpdate: applyUpdate, isPlain: isPlain, isOpObj: isOpObj, isOid: isOid, mkErr: mkErr, defHidden: defHidden, fmtKey: fmtKey, dbName: function () { return DBNAME; }, later: later };
  G.ObjectId = ObjectId;
})(globalThis);
