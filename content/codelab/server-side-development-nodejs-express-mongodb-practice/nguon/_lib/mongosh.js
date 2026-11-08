// lib/mongosh.js — PROVIDED by the practice grader. A mongosh-like shell over the same in-memory store:
//   db.products.insertOne({...}) · insertMany · find(filter, projection).sort().limit() · findOne · countDocuments
//   updateOne / updateMany (with $set $inc $push $pull $unset $rename $addToSet, upsert) · deleteOne / deleteMany
// The collections have NO schema — exactly like MongoDB itself: any shape is accepted.
(function (G) {
  'use strict';
  var M = G.__mg;
  var STORE = M.STORE, ObjectId = M.ObjectId, clone = M.clone, eq = M.eq, matches = M.matches, sortRows = M.sortRows, parseSort = M.parseSort, parseSelect = M.parseSelect, project = M.project, applyUpdate = M.applyUpdate, isOpObj = M.isOpObj, isOid = M.isOid, mkErr = M.mkErr, defHidden = M.defHidden, fmtKey = M.fmtKey;
  var DBNAME = M.dbName();
  /* ═══════════ mongosh-like shell:  db.products.insertOne(...) ═══════════ */
  function shellColl(name) {
    STORE[name] = STORE[name] || [];
    var rows = function () { return STORE[name]; };
    var cursor = function (list) {
      var a = list.slice();
      defHidden(a, 'sort', function (s) { if (typeof s === 'function') return Array.prototype.sort.call(this, s); return cursor(sortRows(a, parseSort(s))); });
      defHidden(a, 'limit', function (n) { return cursor(n > 0 ? a.slice(0, n) : a); });
      defHidden(a, 'skip', function (n) { return cursor(a.slice(n)); });
      defHidden(a, 'toArray', function () { return Promise.resolve(a.slice()); });
      defHidden(a, 'count', function () { return a.length; });
      return a;
    };
    var plain = function (r) { return clone(r); };
    var c = {
      insertOne: function (doc) { var r = clone(doc); if (r._id === undefined) r = Object.assign({ _id: new ObjectId() }, r); if (rows().some(function (x) { return eq(x._id, r._id); })) throw mkErr('MongoServerError', 'E11000 duplicate key error collection: ' + DBNAME + '.' + name + ' index: _id_ dup key: { _id: ' + fmtKey(r._id) + ' }', { code: 11000 }); rows().push(r); return { acknowledged: true, insertedId: isOid(r._id) ? new ObjectId(r._id.__hex) : r._id }; },
      insertMany: function (docs) { var ids = {}; docs.forEach(function (d, i) { ids[i] = c.insertOne(d).insertedId; }); return { acknowledged: true, insertedIds: ids }; },
      find: function (f, proj) { var sel = parseSelect(proj); return cursor(rows().filter(function (r) { return matches(r, f); }).map(function (r) { return project(null, r, sel); })); },
      findOne: function (f, proj) { var r = rows().find(function (x) { return matches(x, f); }); return r ? project(null, r, parseSelect(proj)) : null; },
      countDocuments: function (f) { return rows().filter(function (r) { return matches(r, f); }).length; },
      updateOne: function (f, u, o) { return c._upd(f, u, o, true); },
      updateMany: function (f, u, o) { return c._upd(f, u, o, false); },
      _upd: function (f, u, o, one) {
        if (!Object.keys(u || {}).every(function (k) { return k.charAt(0) === '$'; })) throw mkErr('MongoInvalidArgumentError', 'Update document requires atomic operators');
        var hits = rows().filter(function (r) { return matches(r, f); }); if (one) hits = hits.slice(0, 1);
        var free = { schema: { paths: {}, options: { strict: false } } };
        var mod = 0;
        hits.forEach(function (h) { var a = applyUpdate(free, clone(h), u, {}, false); if (JSON.stringify(a) !== JSON.stringify(h)) mod++; rows()[rows().indexOf(h)] = a; });
        var up = null;
        if (!hits.length && o && o.upsert) { var seed = {}; Object.keys(f || {}).forEach(function (k) { if (k.charAt(0) !== '$' && !isOpObj(f[k])) seed[k] = f[k]; }); var nr = applyUpdate(free, Object.assign({ _id: new ObjectId() }, clone(seed)), u, {}, true); rows().push(nr); up = new ObjectId(nr._id.__hex); }
        return { acknowledged: true, insertedId: up, matchedCount: hits.length, modifiedCount: mod, upsertedCount: up ? 1 : 0 };
      },
      deleteOne: function (f) { var i = rows().findIndex(function (r) { return matches(r, f); }); if (i >= 0) rows().splice(i, 1); return { acknowledged: true, deletedCount: i >= 0 ? 1 : 0 }; },
      deleteMany: function (f) { var keep = rows().filter(function (r) { return !matches(r, f); }); var n = rows().length - keep.length; STORE[name] = keep; return { acknowledged: true, deletedCount: n }; },
      aggregate: function (p) { if (!M.runPipeline) throw new Error('aggregate needs the aggregation library'); return cursor(M.runPipeline(rows(), p)); },
      drop: function () { STORE[name] = []; return true; },
      __plain: plain,
    };
    return c;
  }
  var shellCache = {};
  G.db = new Proxy({}, { get: function (t, k) { if (typeof k !== 'string') return undefined; if (k === 'getCollection') return function (n) { return shellCache[n] || (shellCache[n] = shellColl(n)); }; return shellCache[k] || (shellCache[k] = shellColl(k)); } });
  G.ObjectId = ObjectId;
})(globalThis);
