/**
 * Máy chấm SQL — BỘ CHẠY (29/10/2026). Mã JS thuần dạng chuỗi, chạy ở BA nơi với CÙNG một nguồn:
 *   - Web Worker (module, blob:) trên web — chamSql.ts ghép chuỗi này vào mã worker;
 *   - khung hộp cát của app desktop (__CT_HOP_CAT_KHUNG__) — cùng chuỗi, trong <script type="module">;
 *   - Node (bộ xuất đề dựng `mongDoi` từ LỜI GIẢI; test) — `new Function(SQL_RUNNER_SRC + 'return __CL_SQL__')`.
 *
 * PGlite (PostgreSQL 18 biên dịch WASM) nạp từ jsdelivr, ghim phiên bản: PGLITE_PHIEN_BAN. CSP: web đã cho
 * cdn.jsdelivr.net ở script-src + connect-src, 'unsafe-eval' ở script-src (biên dịch WASM cần nó hoặc
 * 'wasm-unsafe-eval'), worker-src blob: ⇒ KHÔNG phải sửa CSP web. App: khung hộp cát có sẵn script-src
 * jsdelivr + 'unsafe-eval' + connect-src jsdelivr ⇒ KHÔNG phải sửa CSP app (chi tiết: chamSql.ts).
 *
 * Một "kịch bản" (một kiểm) = các bước chạy trong MỘT giao dịch rồi ROLLBACK:
 *   { buoc: [{ loai: 'csdl'|'bai'|'truyVan'|'thu', sql }] }
 *     csdl    — dữ liệu mẫu của đề (đã qua csdlChoPg) · lỗi = lỗi của ĐỀ
 *     bai     — mã người học · lỗi ⇒ dừng
 *     truyVan — truy vấn kiểm của đề (sau khi chạy mã người học)
 *     thu     — một câu thử trong SAVEPOINT (vd INSERT vi phạm ràng buộc phải BỊ CHẶN) — lỗi không làm hỏng giao dịch
 * Sau ROLLBACK so "vân tay" của catalog (số bảng/hàm/schema/kiểu + search_path) với lúc mở; lệch (mã người
 * học COMMIT, đổi search_path…) ⇒ dựng CSDL mới (~1 s) để kiểm sau sạch sẽ.
 *
 * Chế độ SQL Server (xem sqlLoi.ts): extension citext (cột chữ của dữ liệu mẫu), avg(int) cắt phần lẻ
 * trong schema `cl_ss` đứng TRƯỚC pg_catalog trong search_path.
 */

export const PGLITE_PHIEN_BAN = '0.5.8';
export const PGLITE_CDN = `https://cdn.jsdelivr.net/npm/@electric-sql/pglite@${PGLITE_PHIEN_BAN}/dist/`;
/** Giới hạn: số dòng mỗi bảng kết quả gửi về trang. */
export const TRAN_DONG = 2000;

export const SQL_RUNNER_SRC = String.raw`
var __CL_SQL__ = (function () {
  var THO = function (v) { return v; };
  // numeric/int8/date/time/timestamp/interval ⇒ để CHỮ (trang chuẩn hoá) — tránh lệch múi giờ và mất chữ số
  var BO_DOC = { 20: THO, 1700: THO, 1082: THO, 1083: THO, 1114: THO, 1184: THO, 1186: THO, 1266: THO };
  var KHOI_DAU = [
    'CREATE EXTENSION IF NOT EXISTS citext',
    'CREATE SCHEMA cl_ss',
    // SQL Server: AVG(cột INT) trả INT, cắt phần lẻ (SUM/COUNT chia nguyên) — PostgreSQL trả numeric
    "CREATE FUNCTION cl_ss.avg_nguyen(int8[]) RETURNS int LANGUAGE sql IMMUTABLE STRICT AS 'SELECT CASE WHEN $1[1] = 0 THEN NULL ELSE ($1[2] / $1[1])::int END'",
    "CREATE AGGREGATE cl_ss.avg(int4) (SFUNC = int4_avg_accum, STYPE = int8[], FINALFUNC = cl_ss.avg_nguyen, INITCOND = '{0,0}')",
    "CREATE AGGREGATE cl_ss.avg(int2) (SFUNC = int2_avg_accum, STYPE = int8[], FINALFUNC = cl_ss.avg_nguyen, INITCOND = '{0,0}')",
    // COUNT(*) là INT ở SQL Server nhưng BIGINT ở PostgreSQL ⇒ AVG trên cột đếm (bảng dẫn xuất) cũng phải cắt phần lẻ
    "CREATE FUNCTION cl_ss.avg8_buoc(int8[], int8) RETURNS int8[] LANGUAGE sql IMMUTABLE STRICT AS 'SELECT ARRAY[$1[1] + 1, $1[2] + $2]'",
    "CREATE AGGREGATE cl_ss.avg(int8) (SFUNC = cl_ss.avg8_buoc, STYPE = int8[], FINALFUNC = cl_ss.avg_nguyen, INITCOND = '{0,0}')",
  ].concat(toanTuCi()).concat([
    'SET search_path = public, cl_ss, pg_catalog'
  ]).join(';\n');
  // Hằng N'…' (chuỗi Unicode, bắt buộc trên SQL Server cho chữ Việt) có kiểu bpchar ở PostgreSQL ⇒ citext = bpchar
  // rơi về so sánh PHÂN BIỆT hoa thường. Thêm toán tử khớp ĐÚNG kiểu (citext, bpchar) trong cl_ss (đứng trước
  // pg_catalog) để = <> < <= > >= LIKE NOT LIKE với N'…' cũng không phân biệt hoa thường như SQL Server.
  function toanTuCi() {
    var out = [];
    [['=', 'eq'], ['<>', 'ne'], ['<', 'lt'], ['<=', 'le'], ['>', 'gt'], ['>=', 'ge']].forEach(function (p) {
      out.push("CREATE FUNCTION cl_ss.ci_" + p[1] + "_cb(citext, bpchar) RETURNS boolean LANGUAGE sql IMMUTABLE STRICT AS 'SELECT $1 " + p[0] + " $2::text::citext'");
      out.push("CREATE FUNCTION cl_ss.ci_" + p[1] + "_bc(bpchar, citext) RETURNS boolean LANGUAGE sql IMMUTABLE STRICT AS 'SELECT $1::text::citext " + p[0] + " $2'");
      out.push('CREATE OPERATOR cl_ss.' + p[0] + ' (LEFTARG = citext, RIGHTARG = bpchar, FUNCTION = cl_ss.ci_' + p[1] + '_cb)');
      out.push('CREATE OPERATOR cl_ss.' + p[0] + ' (LEFTARG = bpchar, RIGHTARG = citext, FUNCTION = cl_ss.ci_' + p[1] + '_bc)');
    });
    [['~~', 'like'], ['!~~', 'nlike']].forEach(function (p) {
      out.push("CREATE FUNCTION cl_ss.ci_" + p[1] + "_cb(citext, bpchar) RETURNS boolean LANGUAGE sql IMMUTABLE STRICT AS 'SELECT $1 " + p[0] + " $2::text'");
      out.push('CREATE OPERATOR cl_ss.' + p[0] + ' (LEFTARG = citext, RIGHTARG = bpchar, FUNCTION = cl_ss.ci_' + p[1] + '_cb)');
    });
    return out;
  }
  var VAN_TAY = "SELECT concat_ws(':', (SELECT count(*) FROM pg_class), (SELECT count(*) FROM pg_proc), (SELECT count(*) FROM pg_namespace), (SELECT count(*) FROM pg_type), (SELECT count(*) FROM pg_constraint), current_setting('search_path')) AS v";
  var TRAN = ${TRAN_DONG};

  function loiCua(e) {
    return {
      thongDiep: String((e && e.message) || e),
      ma: (e && e.code) || null,
      viTri: e && e.position ? Number(e.position) : null,
      goiY: (e && e.hint) || null,
      chiTiet: (e && e.detail) || null
    };
  }
  function bang(r) {
    var hang = r.rows || [];
    return {
      cot: (r.fields || []).map(function (f) { return f.name; }),
      kieu: (r.fields || []).map(function (f) { return f.dataTypeID; }),
      hang: hang.slice(0, TRAN),
      tong: hang.length,
      lenh: r.command || null
    };
  }
  function cacBang(ds) {
    return (ds || []).filter(function (r) { return r.fields && r.fields.length; }).map(bang);
  }

  async function tao(PGlite, citext) {
    var db = null, vanTayGoc = null, soLanMo = 0;
    async function moi() {
      if (db) { try { await db.close(); } catch (e) { /* bỏ */ } }
      db = await PGlite.create({ extensions: { citext: citext }, parsers: BO_DOC });
      await db.exec(KHOI_DAU);
      vanTayGoc = (await db.query(VAN_TAY)).rows[0].v;
      soLanMo++;
    }
    await moi();

    async function chay(kb) {
      var t0 = Date.now();
      var out = [];
      await db.exec('BEGIN');
      try {
        for (var i = 0; i < kb.buoc.length; i++) {
          var b = kb.buoc[i];
          if (b.loai === 'thu') {
            await db.exec('SAVEPOINT cl_thu');
            try {
              var rt = await db.exec(b.sql, { rowMode: 'array' });
              await db.exec('RELEASE SAVEPOINT cl_thu');
              out.push({ ok: true, ds: cacBang(rt) });
            } catch (e1) {
              try { await db.exec('ROLLBACK TO SAVEPOINT cl_thu'); } catch (e2) { /* giao dịch đã hỏng */ }
              out.push({ ok: false, loi: loiCua(e1) });
            }
            continue;
          }
          try {
            var r = await db.exec(b.sql, { rowMode: 'array' });
            out.push({ ok: true, ds: cacBang(r), soLenh: r.length });
          } catch (e3) {
            out.push({ ok: false, loi: loiCua(e3) });
            break;
          }
        }
      } finally {
        try { await db.exec('ROLLBACK'); } catch (e4) { /* không còn giao dịch (người học COMMIT) */ }
        var sach = false;
        try { sach = (await db.query(VAN_TAY)).rows[0].v === vanTayGoc; } catch (e5) { sach = false; }
        if (!sach) await moi();
      }
      return { buoc: out, ms: Date.now() - t0, soLanMo: soLanMo };
    }
    return { chay: chay };
  }
  return { tao: tao };
})();
`;

/** Mã worker (module) cho web: nạp PGlite từ CDN rồi phục vụ { id, kb } ⇒ { id, kq } . */
export function maWorkerSql(): string {
  return `${SQL_RUNNER_SRC}
var __may = null, __loiMo = null;
var __san = (async function () {
  try {
    var m = await Promise.all([import(${JSON.stringify(`${PGLITE_CDN}index.js`)}), import(${JSON.stringify(`${PGLITE_CDN}contrib/citext.js`)})]);
    __may = await __CL_SQL__.tao(m[0].PGlite, m[1].citext);
  } catch (e) { __loiMo = String((e && e.message) || e); }
})();
self.onmessage = async function (ev) {
  var d = ev.data || {};
  await __san;
  if (__loiMo) { self.postMessage({ id: d.id, loiMo: __loiMo }); return; }
  if (d.mo) { self.postMessage({ id: d.id, san: true }); return; }
  try { self.postMessage({ id: d.id, kq: await __may.chay(d.kb) }); }
  catch (e) { self.postMessage({ id: d.id, loiMay: String((e && e.message) || e) }); }
};
`;
}

/** Trang cho khung hộp cát (app desktop): cùng giao thức qua postMessage với trang mẹ. */
export function trangKhungSql(): string {
  const ma = `${SQL_RUNNER_SRC}
var __may = null, __loiMo = null;
var __san = (async function () {
  try {
    var m = await Promise.all([import(${JSON.stringify(`${PGLITE_CDN}index.js`)}), import(${JSON.stringify(`${PGLITE_CDN}contrib/citext.js`)})]);
    __may = await __CL_SQL__.tao(m[0].PGlite, m[1].citext);
  } catch (e) { __loiMo = String((e && e.message) || e); }
})();
window.addEventListener('message', async function (ev) {
  if (ev.source !== window.parent) return;
  var d = ev.data || {};
  if (!d.__clSql) return;
  await __san;
  var gui = function (x) { x.__clSql = true; x.id = d.id; window.parent.postMessage(x, '*'); };
  if (__loiMo) return gui({ loiMo: __loiMo });
  if (d.mo) return gui({ san: true });
  try { gui({ kq: await __may.chay(d.kb) }); } catch (e) { gui({ loiMay: String((e && e.message) || e) }); }
});
window.parent.postMessage({ __clSql: true, id: 'khung-san' }, '*');
`;
  return `<!doctype html><html><head><meta charset="utf-8"><title>SQL</title></head><body><script type="module">${ma.replace(/<\/script/gi, '<\\/script')}</script></body></html>`;
}
