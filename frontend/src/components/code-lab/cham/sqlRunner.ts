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
 * HAI chế độ (`cheDo`, chọn lúc dựng máy — một worker một chế độ):
 *   'sqlserver' (loại 'sql', DBI202) — extension citext (cột chữ của dữ liệu mẫu), avg(int) cắt phần lẻ trong
 *               schema `cl_ss` đứng TRƯỚC pg_catalog trong search_path (xem sqlLoi.ts);
 *   'pg'        (loại 'sql-pg', 31/10/2026 — khoá PostgreSQL) — PostgreSQL NGUYÊN BẢN: không extension, không
 *               schema phụ, search_path mặc định ⇒ LIMIT, ILIKE, ::, RETURNING, ON CONFLICT, DISTINCT ON,
 *               WITH RECURSIVE, hàm cửa sổ, PL/pgSQL… chạy và chấm đúng như máy chủ PostgreSQL thật.
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
  var KHOI_DAU_SS = [
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

  // cheDo: 'sqlserver' (mặc định — cần citext) | 'pg' (PostgreSQL nguyên bản, citext bỏ qua)
  async function tao(PGlite, citext, cheDo) {
    var laPg = cheDo === 'pg';
    var db = null, vanTayGoc = null, soLanMo = 0;
    async function moi() {
      if (db) { try { await db.close(); } catch (e) { /* bỏ */ } }
      db = laPg
        ? await PGlite.create({ parsers: BO_DOC })
        : await PGlite.create({ extensions: { citext: citext }, parsers: BO_DOC });
      if (!laPg) await db.exec(KHOI_DAU_SS);
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
    return { chay: chay, cheDo: laPg ? 'pg' : 'sqlserver' };
  }
  return { tao: tao };
})();
`;

export type CheDoSql = 'sqlserver' | 'pg';

/** Đoạn mã nạp PGlite từ CDN (chế độ 'pg' không tải citext). */
function maNap(cheDo: CheDoSql): string {
  const nap = [`import(${JSON.stringify(`${PGLITE_CDN}index.js`)})`];
  if (cheDo !== 'pg') nap.push(`import(${JSON.stringify(`${PGLITE_CDN}contrib/citext.js`)})`);
  return `var __may = null, __loiMo = null;
var __san = (async function () {
  try {
    var m = await Promise.all([${nap.join(', ')}]);
    __may = await __CL_SQL__.tao(m[0].PGlite, m[1] ? m[1].citext : null, ${JSON.stringify(cheDo)});
  } catch (e) { __loiMo = String((e && e.message) || e); }
})();`;
}

/** Mã worker (module) cho web: nạp PGlite từ CDN rồi phục vụ { id, kb } ⇒ { id, kq } . */
export function maWorkerSql(cheDo: CheDoSql = 'sqlserver'): string {
  return `${SQL_RUNNER_SRC}
${maNap(cheDo)}
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

/**
 * Trang cho khung hộp cát (app desktop): cùng giao thức qua postMessage với trang mẹ.
 *
 * 31/10/2026: PGlite chạy trong một Worker blob TẠO TỪ BÊN TRONG khung — KHÔNG chạy trên luồng chính của khung.
 * Đo bằng Chromium (scripts/codelab-kiem-cham-trinh-duyet.mjs --app): khung sandbox gốc mờ ở CHUNG tiến trình với
 * trang mẹ, nên một truy vấn chạy mãi trên luồng chính của khung khoá luôn trang mẹ — hẹn giờ của chamSql không
 * bao giờ chạy, cả app đứng hình. Trong worker thì luồng chính rảnh; quá giờ trang mẹ gỡ khung ⇒ worker chết theo.
 * Cần `worker-src blob:` trong CSP_HOP_CAT_KHUNG (desktop/src/main/security.ts). App CŨ chưa có chỉ thị đó ⇒ tạo
 * worker hỏng ⇒ LÙI về chạy trên luồng chính của khung như trước (chấm được, chỉ là quá giờ thì treo như cũ).
 */
export function trangKhungSql(cheDo: CheDoSql = 'sqlserver'): string {
  const nap = [`import(${JSON.stringify(`${PGLITE_CDN}index.js`)})`];
  if (cheDo !== 'pg') nap.push(`import(${JSON.stringify(`${PGLITE_CDN}contrib/citext.js`)})`);
  const ma = `${SQL_RUNNER_SRC}
var MA_WORKER = ${JSON.stringify(maWorkerSql(cheDo))};
var guiCha = function (x, id) { x.__clSql = true; x.id = id; window.parent.postMessage(x, '*'); };
var __napInline = null;
function napInline() {
  if (!__napInline) __napInline = (async function () {
    var m = await Promise.all([${nap.join(', ')}]);
    return __CL_SQL__.tao(m[0].PGlite, m[1] ? m[1].citext : null, ${JSON.stringify(cheDo)});
  })();
  return __napInline;
}
async function xuLyInline(d) {
  var may;
  try { may = await napInline(); } catch (e) { return guiCha({ loiMo: String((e && e.message) || e) }, d.id); }
  if (d.mo) return guiCha({ san: true }, d.id);
  try { guiCha({ kq: await may.chay(d.kb) }, d.id); } catch (e) { guiCha({ loiMay: String((e && e.message) || e) }, d.id); }
}
var w = null, wSong = false, cho = {};
try {
  w = new Worker(URL.createObjectURL(new Blob([MA_WORKER], { type: 'text/javascript' })), { name: 'cl-sql' });   // classic: worker module từ blob trong tài liệu gốc mờ hỏng (đo 31/10)
  w.onmessage = function (ev) { var x = ev.data || {}; wSong = true; delete cho[x.id]; var id = x.id; delete x.id; guiCha(x, id); };
  w.onerror = function (ev) {
    if (ev && ev.preventDefault) ev.preventDefault();
    var ds = Object.keys(cho).map(function (k) { return cho[k]; });
    cho = {};
    if (!wSong) { w = null; ds.forEach(xuLyInline); }   // không tạo được worker (CSP app cũ) ⇒ chạy trên luồng khung
    else ds.forEach(function (d) { guiCha({ loiMay: (ev && ev.message) || 'worker SQL hỏng' }, d.id); });
  };
} catch (e) { w = null; }
window.addEventListener('message', function (ev) {
  if (ev.source !== window.parent) return;
  var d = ev.data || {};
  if (!d.__clSql) return;
  if (w) { cho[d.id] = d; w.postMessage({ id: d.id, mo: d.mo, kb: d.kb }); }
  else xuLyInline(d);
});
window.parent.postMessage({ __clSql: true, id: 'khung-san' }, '*');
`;
  return `<!doctype html><html><head><meta charset="utf-8"><title>SQL</title></head><body><script type="module">${ma.replace(/<\/script/gi, '<\\/script')}</script></body></html>`;
}
