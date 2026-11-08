// lib/mongo-agg.js — PROVIDED by the practice grader. The MongoDB aggregation pipeline for the in-memory
// Mongoose stand-in: Model.aggregate([ { $match }, { $group }, { $sort }, { $limit }, { $skip }, { $project },
// { $addFields }, { $count }, { $unwind }, { $lookup } ]) with the usual accumulators and expressions.
// Like real MongoDB, aggregate() does NOT cast: a string id never matches an ObjectId.
(function (G) {
  'use strict';
  var M = G.__mg;
  var STORE = M.STORE, ObjectId = M.ObjectId, clone = M.clone, getP = M.getP, setP = M.setP, delP = M.delP, eq = M.eq, cmp = M.cmp, matches = M.matches, sortRows = M.sortRows, parseSort = M.parseSort, isPlain = M.isPlain, mkErr = M.mkErr, later = M.later;
  void ObjectId;
  /* ═══════════ aggregation pipeline ═══════════ */
  function evalExpr(e, doc) {
    if (typeof e === 'string' && e.charAt(0) === '$' && e.charAt(1) !== '$') return getP(doc, e.slice(1));
    if (Array.isArray(e)) return e.map(function (x) { return evalExpr(x, doc); });
    if (!isPlain(e)) return e;
    var ks = Object.keys(e);
    if (ks.length === 1 && ks[0].charAt(0) === '$') {
      var op = ks[0], a = e[op];
      var args = Array.isArray(a) ? a.map(function (x) { return evalExpr(x, doc); }) : [evalExpr(a, doc)];
      switch (op) {
        case '$add': return args.reduce(function (s, x) { return x instanceof Date ? new Date(x.getTime() + s) : s + (x || 0); }, 0);
        case '$subtract': return args[0] - args[1];
        case '$multiply': return args.reduce(function (s, x) { return s * x; }, 1);
        case '$divide': return args[0] / args[1];
        case '$round': var pl = Math.pow(10, args[1] || 0); return Math.round(args[0] * pl) / pl;
        case '$concat': return args.some(function (x) { return x == null; }) ? null : args.join('');
        case '$toUpper': return String(args[0] == null ? '' : args[0]).toUpperCase();
        case '$toLower': return String(args[0] == null ? '' : args[0]).toLowerCase();
        case '$size': return Array.isArray(args[0]) ? args[0].length : 0;
        case '$ifNull': return args[0] == null ? args[1] : args[0];
        case '$eq': return eq(args[0], args[1]);
        case '$ne': return !eq(args[0], args[1]);
        case '$gt': return cmp(args[0], args[1]) > 0;
        case '$gte': return cmp(args[0], args[1]) >= 0;
        case '$lt': return cmp(args[0], args[1]) < 0;
        case '$lte': return cmp(args[0], args[1]) <= 0;
        case '$and': return args.every(Boolean);
        case '$or': return args.some(Boolean);
        case '$cond': if (Array.isArray(a)) return args[0] ? args[1] : args[2]; return evalExpr(a.if, doc) ? evalExpr(a.then, doc) : evalExpr(a.else, doc);
        case '$year': return args[0].getUTCFullYear();
        case '$month': return args[0].getUTCMonth() + 1;
        case '$dayOfMonth': return args[0].getUTCDate();
        case '$dateToString': var d = evalExpr(a.date, doc); var f = a.format || '%Y-%m-%dT%H:%M:%S.%LZ'; var p2 = function (n, w) { return String(n).padStart(w || 2, '0'); };
          return f.replace('%Y', d.getUTCFullYear()).replace('%m', p2(d.getUTCMonth() + 1)).replace('%d', p2(d.getUTCDate())).replace('%H', p2(d.getUTCHours())).replace('%M', p2(d.getUTCMinutes())).replace('%S', p2(d.getUTCSeconds())).replace('%L', p2(d.getUTCMilliseconds(), 3));
        case '$literal': return a;
        case '$toString': return args[0] == null ? null : String(args[0]);
        case '$sum': return Array.isArray(args[0]) ? args[0].reduce(function (s, x) { return typeof x === 'number' ? s + x : s; }, 0) : args.reduce(function (s, x) { return typeof x === 'number' ? s + x : s; }, 0);
        case '$avg': var nums = (Array.isArray(args[0]) ? args[0] : args).filter(function (x) { return typeof x === 'number'; }); return nums.length ? nums.reduce(function (s, x) { return s + x; }, 0) / nums.length : null;
        case '$first': return Array.isArray(args[0]) ? args[0][0] : args[0];
        case '$in': return Array.isArray(args[1]) && args[1].some(function (x) { return eq(x, args[0]); });
        case '$filter': var src = evalExpr(a.input, doc) || []; var as = a.as || 'this'; return src.filter(function (x) { return evalExpr(replaceVar(a.cond, as), Object.assign({}, doc, { __var: x })); });
        default: throw mkErr('MongoServerError', 'Unrecognized expression \'' + op + '\'', { code: 168 });
      }
    }
    var o = {}; ks.forEach(function (k) { o[k] = evalExpr(e[k], doc); }); return o;
  }
  function replaceVar(c, as) { var s = JSON.stringify(c).split('"$$' + as).join('"$__var'); return JSON.parse(s); }
  function accumulate(op, arg, docs) {
    var vals = docs.map(function (d) { return evalExpr(arg, d); });
    switch (op) {
      case '$sum': return vals.reduce(function (s, x) { return typeof x === 'number' ? s + x : s; }, 0);
      case '$avg': var n = vals.filter(function (x) { return typeof x === 'number'; }); return n.length ? n.reduce(function (s, x) { return s + x; }, 0) / n.length : null;
      case '$min': var mn = null; vals.forEach(function (x) { if (x != null && (mn === null || cmp(x, mn) < 0)) mn = x; }); return mn;
      case '$max': var mx = null; vals.forEach(function (x) { if (x != null && (mx === null || cmp(x, mx) > 0)) mx = x; }); return mx;
      case '$first': return vals.length ? vals[0] : null;
      case '$last': return vals.length ? vals[vals.length - 1] : null;
      case '$push': return vals;
      case '$addToSet': var u = []; vals.forEach(function (x) { if (!u.some(function (y) { return eq(x, y); })) u.push(x); }); return u;
      case '$count': return docs.length;
      default: throw mkErr('MongoServerError', 'unknown group operator \'' + op + '\'', { code: 15952 });
    }
  }
  function runPipeline(rows, pipeline) {
    var cur = rows.map(clone);
    (pipeline || []).forEach(function (stage) {
      var name = Object.keys(stage)[0]; var arg = stage[name];
      switch (name) {
        case '$match': cur = cur.filter(function (d) { return matches(d, arg); }); break;
        case '$group': {
          var groups = []; var keyOf = function (d) { return evalExpr(arg._id === undefined ? null : arg._id, d); };
          cur.forEach(function (d) { var k = keyOf(d); var g = groups.find(function (x) { return eq(x.k, k === undefined ? null : k); }); if (!g) { g = { k: k === undefined ? null : k, docs: [] }; groups.push(g); } g.docs.push(d); });
          cur = groups.map(function (g) {
            var o = { _id: g.k };
            Object.keys(arg).forEach(function (f) { if (f === '_id') return; var acc = arg[f]; var op = Object.keys(acc)[0]; o[f] = accumulate(op, acc[op], g.docs); });
            return o;
          });
          break;
        }
        case '$sort': cur = sortRows(cur, parseSort(arg)); break;
        case '$limit': cur = cur.slice(0, arg); break;
        case '$skip': cur = cur.slice(arg); break;
        case '$count': cur = cur.length ? [(function () { var o = {}; o[arg] = cur.length; return o; })()] : []; break;
        case '$unwind': {
          var p = typeof arg === 'string' ? arg : arg.path; var keep = !!(arg && arg.preserveNullAndEmptyArrays);
          p = p.slice(1); var out = [];
          cur.forEach(function (d) { var v = getP(d, p); if (Array.isArray(v) && v.length) v.forEach(function (x) { var c = clone(d); setP(c, p, x); out.push(c); }); else if (!Array.isArray(v) && v != null) out.push(d); else if (keep) { var c2 = clone(d); if (Array.isArray(v)) delP(c2, p); out.push(c2); } });
          cur = out; break;
        }
        case '$lookup': {
          var other = STORE[arg.from] || [];
          cur = cur.map(function (d) { var v = getP(d, arg.localField); var c = clone(d); var hits = other.filter(function (o) { var fv = getP(o, arg.foreignField); return Array.isArray(v) ? v.some(function (x) { return eq(x, fv); }) : eq(v, fv); }).map(clone); setP(c, arg.as, hits); return c; });
          break;
        }
        case '$project': case '$addFields': case '$set': {
          cur = cur.map(function (d) {
            var keys = Object.keys(arg);
            if (name === '$project') {
              var incl = keys.some(function (k) { return k !== '_id' && arg[k] !== 0 && arg[k] !== false; });
              if (!incl) { var c = clone(d); keys.forEach(function (k) { delP(c, k); }); return c; }
              var o = {}; if (arg._id !== 0 && arg._id !== false) o._id = d._id;
              keys.forEach(function (k) { if (k === '_id' && (arg[k] === 0 || arg[k] === false)) return; var v = arg[k] === 1 || arg[k] === true ? getP(d, k) : evalExpr(arg[k], d); if (v !== undefined) setP(o, k, v); });
              return o;
            }
            var c3 = clone(d); keys.forEach(function (k) { setP(c3, k, evalExpr(arg[k], d)); }); return c3;
          });
          break;
        }
        default: throw mkErr('MongoServerError', 'Unrecognized pipeline stage name: \'' + name + '\'', { code: 40324 });
      }
    });
    return cur;
  }
  function Aggregate(model, pipeline) { this.model = model; this.pipeline = pipeline || []; }
  ['match', 'group', 'sort', 'limit', 'skip', 'project', 'unwind', 'lookup', 'count', 'addFields'].forEach(function (n) {
    Aggregate.prototype[n] = function (a) { var s = {}; s['$' + n] = a; this.pipeline.push(s); return this; };
  });
  Aggregate.prototype.exec = function () { var self = this; return later(function () { return runPipeline(STORE[self.model.collection.name], self.pipeline); }); };
  Aggregate.prototype.then = function (a, b) { return this.exec().then(a, b); };
  Aggregate.prototype.catch = function (b) { return this.exec().catch(b); };
  M.Aggregate = Aggregate; M.evalExpr = evalExpr; M.runPipeline = runPipeline;

})(globalThis);
