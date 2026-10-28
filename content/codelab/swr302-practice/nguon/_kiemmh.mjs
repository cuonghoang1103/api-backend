/**
 * SWR302 practice — BỘ KIỂM SƠ ĐỒ & TÀI LIỆU CÓ CẤU TRÚC (dựng trên _mohinh.mjs).
 * ═════════════════════════════════════════════════════════════════════════════════════════════
 * Mỗi hàm kiemXxx(cfg) trả MẢNG kiểm 'js' (mỗi kiểm một realm mới — thư viện nhúng sẵn). Hàm kiểm bên trong
 * (L, C, A) ⇒ 'OK' | lời giải thích song ngữ — viết TỰ CHỨA (chỉ dùng L, C, A).
 *
 * Quy ước khớp tên: mỗi phần tử bắt buộc khai `khop: ['regex', …]` trên tên ĐÃ CHUẨN HOÁ (chữ thường, bỏ dấu,
 * gạch dưới/gạch ngang ⇒ khoảng trắng). Vd Payment Gateway: ['payment', 'gateway', 'vnpay|momo|bank'].
 * cfg.nhom = { cuPhap, thanhPhan, … } gắn kiểm vào chức năng của thang điểm (f1…); cfg.an = ['tên kiểm'] ⇒ kiểm ẩn.
 */
import { kiemMH } from './_mohinh.mjs';

const nh = (nhom, k) => (nhom && nhom[k] ? nhom[k] : undefined);

/* ─────────────────────────────── CONTEXT DIAGRAM ─────────────────────────────── */
function ctxDoc(L, C, A) {
  var src = A[C.bien];
  if (typeof src !== 'string' || !src.trim()) return { loi: L.m(C.bien + ' is empty — write the diagram as a Mermaid flowchart string', C.bien + ' đang trống — viết sơ đồ thành chuỗi Mermaid flowchart') };
  return { p: L.pf(src) };
}

export function kiemNguCanh(cfg) {
  const { bien = 'CONTEXT_DIAGRAM', nhom = {}, an = [] } = cfg;
  const C = { bien, ngoai: cfg.ngoai || [], cam: cfg.cam || [], toiThieuLuong: cfg.toiThieuLuong || 0 };
  const C0 = { bien };
  const opt = (k, ten, Cx = C0) => ({ C: Cx, bien: [bien], phan: ['flow'], nhom: nh(nhom, k), an: an.includes(ten) });
  const DOC = ctxDoc.toString();
  const boc = (than) => new Function('L', 'C', 'A', `var ctxDoc = ${DOC}; var d = ctxDoc(L, C, A); if (d.loi) return d.loi; var p = d.p; ${than}`);
  const ds = [];
  ds.push(kiemMH({ en: 'Context diagram — valid Mermaid syntax, every line understood', vi: 'Sơ đồ ngữ cảnh — đúng cú pháp Mermaid, mọi dòng đọc được' }, boc(`
    if (p.loi.length) return p.loi[0] + (p.loi.length > 1 ? ' (+' + (p.loi.length - 1) + ')' : '');
    if (!p.canh.length) return L.m('no data flow found', 'chưa có luồng dữ liệu nào');
    return 'OK';`), opt('cuPhap', 'cuphap')));
  ds.push(kiemMH({ en: 'Context diagram — exactly ONE process (the whole system), no data stores, no internal processes', vi: 'Sơ đồ ngữ cảnh — đúng MỘT process (cả hệ thống), không kho dữ liệu, không process con' }, boc(`
    var tron = p.ds.filter(function (n) { return n.hinh === 'tron'; });
    var kho = p.ds.filter(function (n) { return n.hinh === 'kho'; });
    var la = p.ds.filter(function (n) { return n.hinh !== 'tron' && n.hinh !== 'hcn'; });
    if (tron.length === 0) return L.m('no process circle — draw the system as ONE circle: S((System name))', 'chưa có hình tròn — vẽ hệ thống là MỘT hình tròn: S((Tên hệ thống))');
    if (tron.length > 1) return L.m(tron.length + ' circles (' + L.ds(tron.map(function (n) { return n.nhan; })) + ') — a context diagram has ONE process: the whole system. Sub-processes belong to the level-0 DFD', tron.length + ' hình tròn — sơ đồ ngữ cảnh chỉ có MỘT process là cả hệ thống. Process con thuộc DFD mức 0');
    if (kho.length) return L.m('data store ' + L.ds(kho.map(function (n) { return n.nhan; })) + ' — no data stores in a context diagram (the database is INSIDE the system)', 'kho dữ liệu ' + L.ds(kho.map(function (n) { return n.nhan; })) + ' — sơ đồ ngữ cảnh không có kho (CSDL nằm TRONG hệ thống)');
    if (la.length) return L.m('node ' + L.ds(la.map(function (n) { return n.id; })) + ' has no rectangle shape — external entities are rectangles: E1[Name]', 'nút ' + L.ds(la.map(function (n) { return n.id; })) + ' chưa là hình chữ nhật — thực thể ngoài vẽ E1[Tên]');
    return 'OK';`), opt('cuPhap', 'motprocess')));
  ds.push(kiemMH({ en: 'Context diagram — every flow is a labelled one-way arrow between an external entity and the system', vi: 'Sơ đồ ngữ cảnh — mọi luồng là mũi tên một chiều có nhãn, nối thực thể ngoài với hệ thống' }, boc(`
    var N = p.nut;
    for (var i = 0; i < p.canh.length; i++) {
      var c = p.canh[i], a = N[c.tu], b = N[c.den];
      if (!c.nhan) return L.m('line ' + c.dong + ': unlabelled arrow ' + c.tu + ' → ' + c.den + ' — name the data it carries', 'dòng ' + c.dong + ': mũi tên không nhãn ' + c.tu + ' → ' + c.den + ' — ghi tên dữ liệu chảy trên nó');
      if (c.huong !== 'mot') return L.m('line ' + c.dong + ': use one arrow per direction (-->), not a double-headed or plain line', 'dòng ' + c.dong + ': mỗi chiều một mũi tên (-->), không dùng mũi tên hai đầu hay đường trơn');
      if (a && b && a.hinh !== 'tron' && b.hinh !== 'tron') return L.m('line ' + c.dong + ': flow between two external entities (' + a.nhan + ' → ' + b.nhan + ') — what happens outside the system is not shown', 'dòng ' + c.dong + ': luồng giữa hai thực thể ngoài (' + a.nhan + ' → ' + b.nhan + ') — chuyện bên ngoài hệ thống không vẽ');
      if (c.tu === c.den) return L.m('line ' + c.dong + ': a flow from the system to itself', 'dòng ' + c.dong + ': luồng từ hệ thống về chính nó');
    }
    var le = p.ds.filter(function (n) { return n.hinh === 'hcn' && !p.canh.some(function (c) { return c.tu === n.id || c.den === n.id; }); });
    if (le.length) return L.m('external entity ' + L.ds(le.map(function (n) { return n.nhan; })) + ' has no data flow', 'thực thể ngoài ' + L.ds(le.map(function (n) { return n.nhan; })) + ' không có luồng nào');
    return 'OK';`), opt('cuPhap', 'luongdung')));
  ds.push(kiemMH({ en: 'Context diagram — flow labels name DATA (noun phrases), not actions', vi: 'Sơ đồ ngữ cảnh — nhãn luồng là DỮ LIỆU (cụm danh từ), không phải hành động' }, boc(`
    var sai = p.canh.filter(function (c) { return c.nhan && L.laHanhDong(L.tu(c.nhan)[0]); });
    if (sai.length) return L.m('"' + sai[0].nhan + '" reads as an action — name the data instead, e.g. "order details", "payment result"' + (sai.length > 1 ? ' (' + sai.length + ' labels)' : ''), '"' + sai[0].nhan + '" là hành động — gọi tên dữ liệu, vd "order details", "payment result"' + (sai.length > 1 ? ' (' + sai.length + ' nhãn)' : ''));
    return 'OK';`), opt('cuPhap', 'nhandulieu')));
  ds.push(kiemMH({ en: 'Context diagram — every external entity named in the case is present', vi: 'Sơ đồ ngữ cảnh — đủ mọi thực thể ngoài có trong đề' }, boc(`
    var hcn = p.ds.filter(function (n) { return n.hinh === 'hcn'; });
    var thieu = C.ngoai.filter(function (e) { return !hcn.some(function (n) { return L.khop(n.nhan, e.khop); }); });
    if (thieu.length) return L.m('missing external entit' + (thieu.length > 1 ? 'ies' : 'y') + ': ' + L.ds(thieu.map(function (e) { return e.ten; })) + ' (or an equivalent name)', 'thiếu thực thể ngoài: ' + L.ds(thieu.map(function (e) { return e.ten; })) + ' (hoặc tên tương đương)');
    return 'OK';`), opt('thanhPhan', 'du', { bien, ngoai: C.ngoai.map((e) => ({ ten: e.ten, khop: e.khop })) })));
  ds.push(kiemMH({ en: 'Context diagram — no internal component, data or user-interface element drawn as an external entity', vi: 'Sơ đồ ngữ cảnh — không vẽ thành phần bên trong, dữ liệu hay giao diện thành thực thể ngoài' }, boc(`
    var hcn = p.ds.filter(function (n) { return n.hinh === 'hcn'; });
    for (var i = 0; i < C.cam.length; i++) {
      var x = hcn.filter(function (n) { return L.khop(n.nhan, C.cam[i].khop); })[0];
      if (x) return L.m('"' + x.nhan + '" is not an external entity — ' + C.cam[i].lyDo, '"' + x.nhan + '" không phải thực thể ngoài — ' + (C.cam[i].lyDoVi || C.cam[i].lyDo));
    }
    return 'OK';`), opt('thanhPhan', 'cam', { bien, cam: C.cam })));
  for (const e of (cfg.ngoai || []).filter((x) => (x.can && x.can.length) || (x.luong && x.luong.length))) {
    const Ce = { bien, e };
    ds.push(kiemMH({ en: `Context diagram — data flows of ${e.ten} match the case`, vi: `Sơ đồ ngữ cảnh — luồng dữ liệu của ${e.ten} khớp đề` }, boc(`
      var e = C.e, n = p.ds.filter(function (x) { return x.hinh === 'hcn' && L.khop(x.nhan, e.khop); })[0];
      if (!n) return L.m('no external entity for ' + e.ten, 'chưa có thực thể ngoài ' + e.ten);
      var vao = p.canh.filter(function (c) { return c.tu === n.id; }), ra = p.canh.filter(function (c) { return c.den === n.id; });
      if ((e.can || []).indexOf('vao') >= 0 && !vao.length) return L.m(e.ten + ' sends data INTO the system in the case — add an arrow ' + n.id + ' --> system', e.ten + ' có gửi dữ liệu VÀO hệ thống theo đề — thêm mũi tên ' + n.id + ' --> hệ thống');
      if ((e.can || []).indexOf('ra') >= 0 && !ra.length) return L.m(e.ten + ' receives data FROM the system in the case — add an arrow system --> ' + n.id, e.ten + ' có nhận dữ liệu TỪ hệ thống theo đề — thêm mũi tên hệ thống --> ' + n.id);
      for (var i = 0; i < (e.luong || []).length; i++) {
        var f = e.luong[i], ds2 = f.huong === 'vao' ? vao : ra;
        if (!ds2.some(function (c) { return L.khop(c.nhan, f.khop); })) return L.m('missing the ' + (f.huong === 'vao' ? 'incoming' : 'outgoing') + ' flow "' + f.ten + '" ' + (f.huong === 'vao' ? 'from ' : 'to ') + e.ten, 'thiếu luồng ' + (f.huong === 'vao' ? 'vào' : 'ra') + ' "' + f.ten + '" ' + (f.huong === 'vao' ? 'từ ' : 'tới ') + e.ten);
      }
      return 'OK';`), opt('luong', `luong:${e.ten}`, Ce)));
  }
  if (C.toiThieuLuong) {
    ds.push(kiemMH({ en: `Context diagram — at least ${C.toiThieuLuong} data flows`, vi: `Sơ đồ ngữ cảnh — ít nhất ${C.toiThieuLuong} luồng dữ liệu` }, boc(`
      return p.canh.length >= C.toiThieuLuong ? 'OK' : L.m('only ' + p.canh.length + ' flows — the case describes more exchanges', 'mới ' + p.canh.length + ' luồng — đề mô tả nhiều trao đổi hơn');`), opt('luong', 'soluong', { bien, toiThieuLuong: C.toiThieuLuong })));
  }
  return ds;
}

/* ─────────────────────────────── USE CASE DIAGRAM ─────────────────────────────── */
function ucDoc(L, C, A) {
  var src = A[C.bien];
  if (typeof src !== 'string' || !src.trim()) return { loi: L.m(C.bien + ' is empty — write the diagram as a PlantUML string', C.bien + ' đang trống — viết sơ đồ thành chuỗi PlantUML') };
  var p = L.pu(src);
  var act = {}, uc = {};
  p.actors.forEach(function (a) { act[a.key] = a; });
  p.ucs.forEach(function (u) { uc[u.key] = u; });
  // actor → các use case tới được (liên kết trực tiếp, kế thừa từ cha, rồi lan qua include / extend)
  function cha(k) { return p.qh.filter(function (q) { return q.loai === 'gen' && q.tuK === 'actor' && q.tu === k; }).map(function (q) { return q.den; }); }
  function toiDuoc(k) {
    var goc = [k], seen = {}, i;
    for (i = 0; i < goc.length; i++) cha(goc[i]).forEach(function (c) { if (goc.indexOf(c) < 0) goc.push(c); });
    var hang = [];
    p.qh.forEach(function (q) {
      if (q.loai !== 'assoc') return;
      if (q.tuK === 'actor' && goc.indexOf(q.tu) >= 0 && q.denK === 'uc') hang.push(q.den);
      if (q.denK === 'actor' && goc.indexOf(q.den) >= 0 && q.tuK === 'uc') hang.push(q.tu);
    });
    for (i = 0; i < hang.length; i++) {
      var u = hang[i];
      if (seen[u]) continue; seen[u] = true;
      p.qh.forEach(function (q) {
        if (q.loai === 'include' && q.tu === u) hang.push(q.den);
        if (q.loai === 'extend' && q.den === u) hang.push(q.tu);
      });
    }
    return Object.keys(seen);
  }
  function actorCua(ukey) { // actor nối TRỰC TIẾP với use case
    var r = [];
    p.qh.forEach(function (q) {
      if (q.loai !== 'assoc') return;
      if (q.tu === ukey && q.denK === 'actor') r.push(q.den);
      if (q.den === ukey && q.tuK === 'actor') r.push(q.tu);
    });
    return r;
  }
  return { p: p, act: act, uc: uc, toiDuoc: toiDuoc, actorCua: actorCua };
}

export function kiemUseCase(cfg) {
  const { bien = 'USE_CASE_DIAGRAM', nhom = {}, an = [] } = cfg;
  const C = {
    bien, actors: cfg.actors || [], camActor: cfg.camActor || [], ucs: cfg.ucs || [], quanHe: cfg.quanHe || [],
    bienNguCanh: cfg.bienNguCanh || null, toiThieuUC: cfg.toiThieuUC || 0,
  };
  const C0 = { bien };
  const opt = (k, ten, Cx = C0, them = []) => ({ C: Cx, bien: [bien, ...them], phan: ['uc', ...(them.length ? ['flow'] : [])], nhom: nh(nhom, k), an: an.includes(ten) });
  const DOC = ucDoc.toString();
  const gon2 = (xs) => xs.map((e) => ({ ten: e.ten, khop: e.khop }));
  const boc = (than) => new Function('L', 'C', 'A', `var ucDoc = ${DOC}; var d = ucDoc(L, C, A); if (d.loi) return d.loi; var p = d.p; ${than}`);
  const ds = [];
  ds.push(kiemMH({ en: 'Use case diagram — valid PlantUML, every line understood', vi: 'Sơ đồ use case — đúng cú pháp PlantUML, mọi dòng đọc được' }, boc(`
    if (p.loi.length) return p.loi[0] + (p.loi.length > 1 ? ' (+' + (p.loi.length - 1) + ')' : '');
    if (!p.actors.length || !p.ucs.length) return L.m('declare actors and use cases', 'khai actor và use case');
    return 'OK';`), opt('cuPhap', 'cuphap')));
  ds.push(kiemMH({ en: 'Use case diagram — ONE system boundary holds every use case; actors stay outside', vi: 'Sơ đồ use case — MỘT biên hệ thống chứa mọi use case; actor ở ngoài' }, boc(`
    if (p.bien.length === 0) return L.m('no system boundary — wrap the use cases in rectangle "System name" { … }', 'chưa có biên hệ thống — bọc use case trong rectangle "Tên hệ thống" { … }');
    if (p.bien.length > 1) return L.m(p.bien.length + ' boundaries — one system, one rectangle', p.bien.length + ' biên — một hệ thống, một hình chữ nhật');
    var ngoai = p.ucs.filter(function (u) { return !u.trong; });
    if (ngoai.length) return L.m('use case ' + L.ds(ngoai.map(function (u) { return u.ten; })) + ' is outside the boundary', 'use case ' + L.ds(ngoai.map(function (u) { return u.ten; })) + ' nằm ngoài biên');
    var trong = p.actors.filter(function (a) { return a.trong; });
    if (trong.length) return L.m('actor ' + L.ds(trong.map(function (a) { return a.ten; })) + ' is inside the boundary — actors are outside the system', 'actor ' + L.ds(trong.map(function (a) { return a.ten; })) + ' nằm trong biên — actor ở ngoài hệ thống');
    return 'OK';`), opt('cuPhap', 'bien')));
  ds.push(kiemMH({ en: 'Use case diagram — links are legal: actor–use case associations, «include»/«extend» only between use cases, no actor–actor association', vi: 'Sơ đồ use case — liên kết hợp lệ: actor–use case là association, «include»/«extend» chỉ giữa hai use case, không nối actor–actor' }, boc(`
    for (var i = 0; i < p.qh.length; i++) {
      var q = p.qh[i];
      if ((q.loai === 'include' || q.loai === 'extend') && (q.tuK !== 'uc' || q.denK !== 'uc')) return L.m('line ' + q.dong + ': «' + q.loai + '» must connect two use cases — an actor is linked with a plain association', 'dòng ' + q.dong + ': «' + q.loai + '» chỉ nối hai use case — actor nối bằng association thường');
      if ((q.loai === 'include' || q.loai === 'extend') && q.net !== 'dut') return L.m('line ' + q.dong + ': «' + q.loai + '» is a dashed arrow (..>)', 'dòng ' + q.dong + ': «' + q.loai + '» là mũi tên nét đứt (..>)');
      if (q.loai === 'assoc' && q.tuK === 'actor' && q.denK === 'actor') return L.m('line ' + q.dong + ': association between two actors — actors only talk to the system (use --|> for generalization)', 'dòng ' + q.dong + ': association giữa hai actor — actor chỉ tương tác với hệ thống (tổng quát hoá dùng --|>)');
      if (q.loai === 'assoc' && q.tuK === 'uc' && q.denK === 'uc') return L.m('line ' + q.dong + ': plain line between two use cases — use «include» or «extend»', 'dòng ' + q.dong + ': đường thường giữa hai use case — dùng «include» hoặc «extend»');
      if (q.loai === 'gen' && q.tuK !== q.denK) return L.m('line ' + q.dong + ': generalization must be actor → actor or use case → use case', 'dòng ' + q.dong + ': tổng quát hoá phải actor → actor hoặc use case → use case');
    }
    return 'OK';`), opt('cuPhap', 'lienket')));
  ds.push(kiemMH({ en: 'Use case diagram — every actor takes part in a use case and every use case is reachable', vi: 'Sơ đồ use case — actor nào cũng tham gia use case và use case nào cũng có người dùng tới' }, boc(`
    var dung = {};
    p.actors.forEach(function (a) { d.toiDuoc(a.key).forEach(function (u) { dung[u] = true; }); });
    var ac = p.actors.filter(function (a) {
      return !p.qh.some(function (q) { return q.loai === 'assoc' && (q.tu === a.key || q.den === a.key); })
        && !p.qh.some(function (q) { return q.loai === 'gen' && q.tu === a.key; })
        && !p.qh.some(function (q) { return q.loai === 'gen' && q.den === a.key; });
    });
    if (ac.length) return L.m('actor ' + L.ds(ac.map(function (a) { return a.ten; })) + ' is not linked to any use case', 'actor ' + L.ds(ac.map(function (a) { return a.ten; })) + ' không nối use case nào');
    var mo = p.ucs.filter(function (u) { return !dung[u.key]; });
    if (mo.length) return L.m('use case ' + L.ds(mo.map(function (u) { return u.ten; })) + ' cannot be reached by any actor (no association, include or extend leads to it)', 'use case ' + L.ds(mo.map(function (u) { return u.ten; })) + ' không actor nào tới được (không association/include/extend nào dẫn tới)');
    return 'OK';`), opt('cuPhap', 'noi')));
  ds.push(kiemMH({ en: 'Use case diagram — use cases are named verb + object; actors are roles', vi: 'Sơ đồ use case — use case đặt tên động từ + tân ngữ; actor là vai trò' }, boc(`
    var x = p.ucs.filter(function (u) { var t = L.tu(u.ten); return t.length < 2 || !L.laDongTu(t[0]); });
    if (x.length) return L.m('use case "' + x[0].ten + '" — start with a verb and name the goal, e.g. "Book Appointment", "Make Payment"' + (x.length > 1 ? ' (' + x.length + ' names)' : ''), 'use case "' + x[0].ten + '" — bắt đầu bằng động từ và nêu mục tiêu, vd "Book Appointment"' + (x.length > 1 ? ' (' + x.length + ' tên)' : ''));
    var y = p.actors.filter(function (a) { return /^(the )?system$|database|\\bdb\\b|server|screen|website|app$/.test(L.norm(a.ten)); });
    if (y.length) return L.m('"' + y[0].ten + '" is part of the system, not an actor', '"' + y[0].ten + '" là một phần của hệ thống, không phải actor');
    return 'OK';`), opt('cuPhap', 'ten')));
  ds.push(kiemMH({ en: 'Use case diagram — every actor of the case is present', vi: 'Sơ đồ use case — đủ mọi actor của đề' }, boc(`
    var thieu = C.actors.filter(function (e) { return !p.actors.some(function (a) { return L.khop(a.ten, e.khop); }); });
    if (thieu.length) return L.m('missing actor: ' + L.ds(thieu.map(function (e) { return e.ten; })) + ' (or an equivalent name)', 'thiếu actor: ' + L.ds(thieu.map(function (e) { return e.ten; })) + ' (hoặc tên tương đương)');
    return 'OK';`), opt('actor', 'du', { bien, actors: gon2(C.actors) })));
  if (C.camActor.length) {
    ds.push(kiemMH({ en: 'Use case diagram — no internal component modelled as an actor', vi: 'Sơ đồ use case — không vẽ thành phần bên trong thành actor' }, boc(`
      for (var i = 0; i < C.camActor.length; i++) {
        var x = p.actors.filter(function (a) { return L.khop(a.ten, C.camActor[i].khop); })[0];
        if (x) return L.m('"' + x.ten + '" is not an actor — ' + C.camActor[i].lyDo, '"' + x.ten + '" không phải actor — ' + (C.camActor[i].lyDoVi || C.camActor[i].lyDo));
      }
      return 'OK';`), opt('actor', 'cam', { bien, camActor: C.camActor })));
  }
  if (C.bienNguCanh) {
    ds.push(kiemMH({ en: 'Use case diagram — actors are consistent with the context diagram', vi: 'Sơ đồ use case — actor nhất quán với sơ đồ ngữ cảnh' }, boc(`
      var src = A[C.bienNguCanh];
      if (typeof src !== 'string' || !src.trim()) return L.m('answer the context diagram first (' + C.bienNguCanh + ')', 'hãy làm sơ đồ ngữ cảnh trước (' + C.bienNguCanh + ')');
      var ctx = L.pf(src).ds.filter(function (n) { return n.hinh === 'hcn'; });
      for (var i = 0; i < C.actors.length; i++) {
        var e = C.actors[i];
        var o2 = ctx.some(function (n) { return L.khop(n.nhan, e.khop); }), o3 = p.actors.some(function (a) { return L.khop(a.ten, e.khop); });
        if (o2 && !o3) return L.m(e.ten + ' is an external entity in the context diagram but not an actor here', e.ten + ' là thực thể ngoài ở sơ đồ ngữ cảnh nhưng không là actor ở đây');
        if (o3 && !o2) return L.m(e.ten + ' is an actor here but missing from the context diagram', e.ten + ' là actor ở đây nhưng thiếu ở sơ đồ ngữ cảnh');
      }
      return 'OK';`), opt('actor', 'nhatquan', { bien, bienNguCanh: C.bienNguCanh, actors: gon2(C.actors) }, [C.bienNguCanh])));
  }
  const nhomUC = [];
  const coNhom = cfg.moiKiemUC || 3;
  for (let i = 0; i < C.ucs.length; i += coNhom) nhomUC.push(C.ucs.slice(i, i + coNhom));
  for (const g of nhomUC) {
    const Cu = { bien, us: g.map((u) => ({ ten: u.ten, tenVi: u.tenVi, khop: u.khop, actor: (u.actor || []).map((a) => ({ ten: a.ten, khop: a.khop })) })) };
    const ten = g.map((u) => u.ten).join(' · ');
    ds.push(kiemMH({ en: `Use case coverage — ${ten}`, vi: `Phủ use case — ${g.map((u) => u.tenVi || u.ten).join(' · ')}` }, boc(`
      for (var z = 0; z < C.us.length; z++) {
        var u = C.us[z];
        var tim = p.ucs.filter(function (x) { return L.khop(x.ten, u.khop); });
        if (!tim.length) return L.m('no use case for: ' + u.ten, 'chưa có use case cho: ' + (u.tenVi || u.ten));
        for (var i = 0; i < (u.actor || []).length; i++) {
          var nhomA = u.actor[i];
          var ac = p.actors.filter(function (a) { return L.khop(a.ten, nhomA.khop); });
          if (!ac.length) return L.m('use case "' + tim[0].ten + '" needs the actor ' + nhomA.ten, 'use case "' + tim[0].ten + '" cần actor ' + nhomA.ten);
          var ok = tim.some(function (x) { return ac.some(function (a) { return d.toiDuoc(a.key).indexOf(x.key) >= 0; }); });
          if (!ok) return L.m('"' + tim[0].ten + '" is not linked to ' + nhomA.ten + ' (directly, through a parent actor, or through «include»/«extend»)', '"' + tim[0].ten + '" chưa nối với ' + nhomA.ten + ' (trực tiếp, qua actor cha, hoặc qua «include»/«extend»)');
        }
      }
      return 'OK';`), opt('ucs', `uc:${ten}`, Cu)));
  }
  for (const r of C.quanHe) {
    const Cr = { bien, r };
    ds.push(kiemMH({ en: `«${r.loai}» — ${r.ten}`, vi: `«${r.loai}» — ${r.tenVi || r.ten}` }, boc(`
      var r = C.r;
      var a = p.ucs.filter(function (x) { return L.khop(x.ten, r.tu); }), b = p.ucs.filter(function (x) { return L.khop(x.ten, r.den); });
      if (!a.length || !b.length) return L.m('need both use cases: ' + r.ten, 'cần đủ hai use case: ' + (r.tenVi || r.ten));
      var giua = p.qh.filter(function (q) { return a.some(function (x) { return x.key === q.tu || x.key === q.den; }) && b.some(function (x) { return x.key === q.tu || x.key === q.den; }); });
      if (!giua.length) return L.m('no relationship yet: ' + r.ten, 'chưa có quan hệ: ' + (r.tenVi || r.ten));
      var dung = giua.filter(function (q) { return q.loai === r.loai && a.some(function (x) { return x.key === q.tu; }) && b.some(function (x) { return x.key === q.den; }); });
      if (dung.length) return 'OK';
      var q = giua[0];
      if (q.loai !== r.loai) return L.m('line ' + q.dong + ': this is «' + r.loai + '», not «' + q.loai + '» — ' + r.lyDo, 'dòng ' + q.dong + ': đây là «' + r.loai + '», không phải «' + q.loai + '» — ' + (r.lyDoVi || r.lyDo));
      return L.m('line ' + q.dong + ': wrong direction — ' + (r.loai === 'extend' ? 'the arrow goes FROM the extension TO the base use case' : 'the arrow goes FROM the base TO the included use case'), 'dòng ' + q.dong + ': sai chiều — ' + (r.loai === 'extend' ? 'mũi tên đi TỪ use case mở rộng TỚI use case gốc' : 'mũi tên đi TỪ use case gốc TỚI use case được gộp'));`), opt('quanHe', `qh:${r.ten}`, Cr)));
  }
  if (C.toiThieuUC) {
    ds.push(kiemMH({ en: `Use case diagram — at least ${C.toiThieuUC} use cases`, vi: `Sơ đồ use case — ít nhất ${C.toiThieuUC} use case` }, boc(`
      return p.ucs.length >= C.toiThieuUC ? 'OK' : L.m('only ' + p.ucs.length + ' use cases', 'mới ' + p.ucs.length + ' use case');`), opt('ucs', 'soluong', { bien, toiThieuUC: C.toiThieuUC })));
  }
  return ds;
}

/** Bảng Actor (# | Actor | Description) + bảng Use case (# | Use Case | Actors | Description) đối chiếu với sơ đồ. */
export function kiemBangUC(cfg) {
  const { bien = 'USE_CASE_DIAGRAM', bienActor = 'ACTORS', bienUC = 'USE_CASES', nhom = {}, an = [], toiThieuTu = 6, khongActor = false } = cfg;
  const C = { bien, bienActor, bienUC, toiThieuTu };
  const DOC = ucDoc.toString();
  const boc = (than) => new Function('L', 'C', 'A', `var ucDoc = ${DOC}; var d = ucDoc(L, C, A); if (d.loi) return L.m('fix the use case diagram first', 'sửa sơ đồ use case trước'); var p = d.p; ${than}`);
  const opt = (k, ten) => ({ C, bien: [bien, bienActor, bienUC], phan: ['uc'], nhom: nh(nhom, k), an: an.includes(ten) });
  const ds = [];
  if (!khongActor) {
    ds.push(kiemMH({ en: 'Actor table — one row per actor of the diagram, each with a real description', vi: 'Bảng Actor — mỗi actor của sơ đồ một dòng, có mô tả thật' }, boc(`
      var T = A[C.bienActor];
      if (!Array.isArray(T) || !T.length) return L.m(C.bienActor + ' is empty — one object { name, description } per actor', C.bienActor + ' đang trống — mỗi actor một object { name, description }');
      for (var i = 0; i < p.actors.length; i++) {
        var a = p.actors[i];
        if (!T.some(function (r) { return r && L.norm(r.name) === L.norm(a.ten); })) return L.m('no row for actor "' + a.ten + '" (names must match the diagram)', 'thiếu dòng cho actor "' + a.ten + '" (tên phải khớp sơ đồ)');
      }
      for (var j = 0; j < T.length; j++) {
        var r = T[j] || {};
        if (!p.actors.some(function (a) { return L.norm(a.ten) === L.norm(r.name); })) return L.m('row "' + r.name + '" is not an actor of the diagram', 'dòng "' + r.name + '" không phải actor trong sơ đồ');
        if (L.soTu(r.description) < C.toiThieuTu || /<|tbd|todo|\\.\\.\\./i.test(String(r.description))) return L.m('describe "' + r.name + '" in a real sentence (who they are, what they do with the system)', 'mô tả "' + r.name + '" bằng một câu thật (họ là ai, làm gì với hệ thống)');
      }
      return 'OK';`), opt('bang', 'actor')));
  }
  ds.push(kiemMH({ en: 'Use case table — one row per use case: id UC-01…, the same name, a description', vi: 'Bảng Use case — mỗi use case một dòng: mã UC-01…, đúng tên, có mô tả' }, boc(`
    var T = A[C.bienUC];
    if (!Array.isArray(T) || !T.length) return L.m(C.bienUC + ' is empty — one object { id, name, actors, description } per use case', C.bienUC + ' đang trống — mỗi use case một object { id, name, actors, description }');
    var ids = {};
    for (var j = 0; j < T.length; j++) {
      var r = T[j] || {};
      if (!/^UC-?\\d{1,3}$/i.test(String(r.id || '').trim())) return L.m('row ' + (j + 1) + ': id must look like "UC-01"', 'dòng ' + (j + 1) + ': mã phải dạng "UC-01"');
      var k = String(r.id).toUpperCase().replace('-', '');
      if (ids[k]) return L.m('duplicate id ' + r.id, 'trùng mã ' + r.id);
      ids[k] = 1;
      if (!p.ucs.some(function (u) { return L.norm(u.ten) === L.norm(r.name); })) return L.m('row ' + r.id + ' "' + r.name + '" is not a use case of the diagram', 'dòng ' + r.id + ' "' + r.name + '" không phải use case trong sơ đồ');
      if (L.soTu(r.description) < C.toiThieuTu || /<|tbd|todo|\\.\\.\\./i.test(String(r.description))) return L.m(r.id + ': write a real description (goal + main outcome)', r.id + ': viết mô tả thật (mục tiêu + kết quả chính)');
    }
    var thieu = p.ucs.filter(function (u) { return !T.some(function (r) { return r && L.norm(r.name) === L.norm(u.ten); }); });
    if (thieu.length) return L.m('no row for use case ' + L.ds(thieu.map(function (u) { return u.ten; })), 'thiếu dòng cho use case ' + L.ds(thieu.map(function (u) { return u.ten; })));
    return 'OK';`), opt('bang', 'uc')));
  ds.push(kiemMH({ en: 'Use case table — the Actors column matches the associations of the diagram', vi: 'Bảng Use case — cột Actors khớp liên kết trong sơ đồ' }, boc(`
    var T = A[C.bienUC];
    if (!Array.isArray(T) || !T.length) return L.m(C.bienUC + ' is empty', C.bienUC + ' đang trống');
    for (var j = 0; j < T.length; j++) {
      var r = T[j] || {};
      var u = p.ucs.filter(function (x) { return L.norm(x.ten) === L.norm(r.name); })[0];
      if (!u) continue;
      var ac = Array.isArray(r.actors) ? r.actors : String(r.actors || '').split(/[,;]/);
      ac = ac.map(function (x) { return String(x).trim(); }).filter(Boolean);
      var la = ac.filter(function (x) { return !p.actors.some(function (a) { return L.norm(a.ten) === L.norm(x); }); });
      if (la.length) return L.m(r.id + ': actor "' + la[0] + '" is not in the diagram', r.id + ': actor "' + la[0] + '" không có trong sơ đồ');
      var truc = d.actorCua(u.key).map(function (k) { return d.act[k] ? d.act[k].ten : k; });
      var thieu = truc.filter(function (t) { return !ac.some(function (x) { return L.norm(x) === L.norm(t); }); });
      if (thieu.length) return L.m(r.id + ' "' + r.name + '": the diagram links ' + L.ds(thieu) + ' — list it in Actors', r.id + ' "' + r.name + '": sơ đồ nối ' + L.ds(thieu) + ' — ghi vào cột Actors');
      if (!ac.length && !truc.length) {
        var ai = p.actors.filter(function (a) { return d.toiDuoc(a.key).indexOf(u.key) >= 0; });
        if (!ai.length) return L.m(r.id + ': no actor', r.id + ': không có actor');
      }
    }
    return 'OK';`), opt('bang', 'ucactor')));
  return ds;
}

/* ─────────────────────────────── ERD (khái niệm) ─────────────────────────────── */
function erDoc(L, C, A) {
  var src = A[C.bien];
  if (typeof src !== 'string' || !src.trim()) return { loi: L.m(C.bien + ' is empty — write the ERD as a Mermaid erDiagram string', C.bien + ' đang trống — viết ERD thành chuỗi Mermaid erDiagram') };
  var p = L.pe(src);
  function the(mau) { return p.tt.filter(function (t) { return L.khop(t.ten, mau) || L.khop(t.id, mau); }); }
  function giua(as, bs) {
    return p.qh.filter(function (q) {
      return (as.some(function (t) { return t.id === q.a; }) && bs.some(function (t) { return t.id === q.b; }))
        || (as.some(function (t) { return t.id === q.b; }) && bs.some(function (t) { return t.id === q.a; }));
    });
  }
  // nhìn quan hệ q từ phía tập as: { maxA, minA (của as), maxB, minB (của phía kia) }
  function nhin(q, as) {
    if (as.some(function (t) { return t.id === q.a; })) return { maxA: q.maxA, minA: q.minA, maxB: q.maxB, minB: q.minB };
    return { maxA: q.maxB, minA: q.minB, maxB: q.maxA, minB: q.minA };
  }
  return { p: p, the: the, giua: giua, nhin: nhin };
}

export function kiemErd(cfg) {
  const { bien = 'ERD', nhom = {}, an = [] } = cfg;
  const C = { bien, tt: cfg.tt || [], camTt: cfg.camTt || [], qh: cfg.qh || [], khongTrucTiep: cfg.khongTrucTiep || [], khaiNiem: cfg.khaiNiem !== false };
  const DOC = erDoc.toString();
  const boc = (than) => new Function('L', 'C', 'A', `var erDoc = ${DOC}; var d = erDoc(L, C, A); if (d.loi) return d.loi; var p = d.p; ${than}`);
  const C0 = { bien };
  const opt = (k, ten, Cx = C0) => ({ C: Cx, bien: [bien], phan: ['er'], nhom: nh(nhom, k), an: an.includes(ten) });
  const ds = [];
  ds.push(kiemMH({ en: 'ERD — valid Mermaid erDiagram, every line understood', vi: 'ERD — đúng cú pháp Mermaid erDiagram, mọi dòng đọc được' }, boc(`
    if (p.loi.length) return p.loi[0] + (p.loi.length > 1 ? ' (+' + (p.loi.length - 1) + ')' : '');
    if (p.tt.length < 2 || !p.qh.length) return L.m('declare entities and relationships', 'khai thực thể và quan hệ');
    return 'OK';`), opt('cuPhap', 'cuphap')));
  ds.push(kiemMH({ en: 'ERD — every entity has an identifier (PK) and takes part in a relationship; every relationship has a verb label', vi: 'ERD — thực thể nào cũng có định danh (PK) và có quan hệ; quan hệ nào cũng có nhãn động từ' }, boc(`
    var x = p.tt.filter(function (t) { return !t.thuocTinh.some(function (a) { return a.khoa.indexOf('PK') >= 0; }); });
    if (x.length) return L.m('entity ' + L.ds(x.map(function (t) { return t.ten; })) + ' has no identifier — add an attribute marked PK in its { } block', 'thực thể ' + L.ds(x.map(function (t) { return t.ten; })) + ' chưa có định danh — thêm thuộc tính đánh dấu PK trong khối { }');
    var le = p.tt.filter(function (t) { return !p.qh.some(function (q) { return q.a === t.id || q.b === t.id; }); });
    if (le.length) return L.m('entity ' + L.ds(le.map(function (t) { return t.ten; })) + ' is not related to anything', 'thực thể ' + L.ds(le.map(function (t) { return t.ten; })) + ' không có quan hệ nào');
    var y = p.qh.filter(function (q) { return L.soTu(q.nhan) < 1; });
    if (y.length) return L.m('line ' + y[0].dong + ': name the relationship with a verb ("places", "contains")', 'dòng ' + y[0].dong + ': đặt tên quan hệ bằng động từ ("places", "contains")');
    return 'OK';`), opt('cuPhap', 'dinhdanh')));
  if (C.khaiNiem) {
    ds.push(kiemMH({ en: 'ERD — conceptual level: no foreign keys (the relationship line already says it)', vi: 'ERD — mức khái niệm: không khoá ngoại (đường quan hệ đã nói điều đó)' }, boc(`
      var x = [];
      p.tt.forEach(function (t) { t.thuocTinh.forEach(function (a) { if (a.khoa.indexOf('FK') >= 0) x.push(t.ten + '.' + a.ten); }); });
      if (x.length) return L.m('foreign key ' + L.ds(x) + ' — a conceptual ERD shows the relationship, not the FK column (that is logical/physical design)', 'khoá ngoại ' + L.ds(x) + ' — ERD khái niệm vẽ quan hệ, không ghi cột FK (đó là thiết kế logic/vật lý)');
      return 'OK';`), opt('cuPhap', 'fk')));
  }
  ds.push(kiemMH({ en: 'ERD — every core entity of the case is present', vi: 'ERD — đủ các thực thể cốt lõi của đề' }, boc(`
    var thieu = C.tt.filter(function (e) { return !d.the(e.khop).length; });
    if (thieu.length) return L.m('missing entit' + (thieu.length > 1 ? 'ies' : 'y') + ': ' + L.ds(thieu.map(function (e) { return e.ten; })), 'thiếu thực thể: ' + L.ds(thieu.map(function (e) { return e.ten; })));
    return 'OK';`), opt('thanhPhan', 'du', { bien, tt: C.tt })));
  if (C.camTt.length) {
    ds.push(kiemMH({ en: 'ERD — no attribute, actor-role or the system itself drawn as an entity', vi: 'ERD — không vẽ thuộc tính, hay chính hệ thống, thành thực thể' }, boc(`
      for (var i = 0; i < C.camTt.length; i++) {
        var x = d.the(C.camTt[i].khop)[0];
        if (x) return L.m('"' + x.ten + '" should not be an entity — ' + C.camTt[i].lyDo, '"' + x.ten + '" không nên là thực thể — ' + (C.camTt[i].lyDoVi || C.camTt[i].lyDo));
      }
      return 'OK';`), opt('thanhPhan', 'cam', { bien, camTt: C.camTt })));
  }
  for (const r of C.qh) {
    const Cr = { bien, r };
    ds.push(kiemMH({ en: `Relationship — ${r.ten}`, vi: `Quan hệ — ${r.tenVi || r.ten}` }, boc(`
      var r = C.r, as = d.the(r.a), bs = d.the(r.b);
      if (!as.length || !bs.length) return L.m('need both entities for: ' + r.ten, 'cần đủ hai thực thể cho: ' + (r.tenVi || r.ten));
      var qs = d.giua(as, bs);
      if (!qs.length) return L.m('no relationship yet: ' + r.ten, 'chưa có quan hệ: ' + (r.tenVi || r.ten));
      var v = d.nhin(qs[0], as);
      var muon = r.nhieu; // 'b' = b là phía nhiều (a 1 — N b) · 'a' · 'ca' (M:N) · 'mot' (1:1)
      var thucTe = v.maxA === 'N' && v.maxB === 'N' ? 'ca' : v.maxB === 'N' ? 'b' : v.maxA === 'N' ? 'a' : 'mot';
      var ten = function (x) { return x === 'b' ? 'one ' + as[0].ten + ' — many ' + bs[0].ten : x === 'a' ? 'many ' + as[0].ten + ' — one ' + bs[0].ten : x === 'ca' ? 'many-to-many' : 'one-to-one'; };
      if (thucTe !== muon) return L.m('line ' + qs[0].dong + ': cardinality reads ' + ten(thucTe) + ', the case says ' + ten(muon) + (r.lyDo ? ' — ' + r.lyDo : ''), 'dòng ' + qs[0].dong + ': bản số đang là ' + ten(thucTe) + ', đề nói ' + ten(muon) + (r.lyDoVi ? ' — ' + r.lyDoVi : ''));
      if (r.minB != null && v.minB !== r.minB) return L.m('line ' + qs[0].dong + ': optionality on the ' + bs[0].ten + ' side should be ' + (r.minB === 0 ? 'zero-or-… (o)' : 'exactly/at least one (|)') + (r.lyDo ? ' — ' + r.lyDo : ''), 'dòng ' + qs[0].dong + ': phía ' + bs[0].ten + ' phải là ' + (r.minB === 0 ? 'có thể không có (o)' : 'bắt buộc có (|)') + (r.lyDoVi ? ' — ' + r.lyDoVi : ''));
      if (r.minA != null && v.minA !== r.minA) return L.m('line ' + qs[0].dong + ': optionality on the ' + as[0].ten + ' side should be ' + (r.minA === 0 ? 'zero-or-… (o)' : 'exactly/at least one (|)'), 'dòng ' + qs[0].dong + ': phía ' + as[0].ten + ' phải là ' + (r.minA === 0 ? 'có thể không có (o)' : 'bắt buộc có (|)'));
      return 'OK';`), opt('quanHe', `qh:${r.ten}`, Cr)));
  }
  for (const r of C.khongTrucTiep) {
    const Cr = { bien, r };
    ds.push(kiemMH({ en: `ERD — ${r.ten}`, vi: `ERD — ${r.tenVi || r.ten}` }, boc(`
      var r = C.r, as = d.the(r.a), bs = d.the(r.b);
      var qs = d.giua(as, bs);
      if (qs.length) return L.m('line ' + qs[0].dong + ': ' + r.lyDo, 'dòng ' + qs[0].dong + ': ' + (r.lyDoVi || r.lyDo));
      return 'OK';`), opt('quanHe', `kt:${r.ten}`, Cr)));
  }
  return ds;
}

/** Bảng thực thể (# | Entity | Description) đối chiếu ERD. */
export function kiemBangThucThe(cfg) {
  const { bien = 'ERD', bienBang = 'ENTITIES', nhom, an = false, toiThieuTu = 6 } = cfg;
  const C = { bien, bienBang, toiThieuTu };
  const DOC = erDoc.toString();
  const fn = new Function('L', 'C', 'A', `var erDoc = ${DOC}; var d = erDoc(L, C, A); if (d.loi) return L.m('fix the ERD first', 'sửa ERD trước'); var p = d.p;
    var T = A[C.bienBang];
    if (!Array.isArray(T) || !T.length) return L.m(C.bienBang + ' is empty — one object { name, description, attributes } per entity', C.bienBang + ' đang trống — mỗi thực thể một object { name, description, attributes }');
    for (var i = 0; i < p.tt.length; i++) {
      var t = p.tt[i];
      var r = T.filter(function (x) { return x && (L.norm(x.name) === L.norm(t.ten) || L.norm(x.name) === L.norm(t.id)); })[0];
      if (!r) return L.m('no row for entity "' + t.ten + '"', 'thiếu dòng cho thực thể "' + t.ten + '"');
      if (L.soTu(r.description) < C.toiThieuTu || /<|tbd|todo|\\.\\.\\./i.test(String(r.description))) return L.m('describe "' + t.ten + '" in a real sentence (what one instance is, why the business keeps it)', 'mô tả "' + t.ten + '" bằng một câu thật (một thể hiện là gì, vì sao nghiệp vụ cần lưu)');
      var pk = t.thuocTinh.filter(function (a) { return a.khoa.indexOf('PK') >= 0; })[0];
      var at = Array.isArray(r.attributes) ? r.attributes.join(' ') : String(r.attributes || '');
      if (pk && L.norm(at).indexOf(L.norm(pk.ten)) < 0) return L.m('"' + t.ten + '": list the identifier ' + pk.ten + ' among its attributes', '"' + t.ten + '": ghi định danh ' + pk.ten + ' trong cột thuộc tính');
    }
    for (var j = 0; j < T.length; j++) if (!p.tt.some(function (t) { return L.norm(T[j] && T[j].name) === L.norm(t.ten) || L.norm(T[j] && T[j].name) === L.norm(t.id); })) return L.m('row "' + (T[j] && T[j].name) + '" is not an entity of the ERD', 'dòng "' + (T[j] && T[j].name) + '" không có trong ERD');
    return 'OK';`);
  return [kiemMH({ en: 'Entity table — every entity described, identifier listed', vi: 'Bảng thực thể — mô tả đủ mọi thực thể, có ghi định danh' }, fn, { C, bien: [bien, bienBang], phan: ['er'], nhom, an })];
}

/* ─────────────────────────────── STATE DIAGRAM ─────────────────────────────── */
function stDoc(L, C, A) {
  var src = A[C.bien];
  if (typeof src !== 'string' || !src.trim()) return { loi: L.m(C.bien + ' is empty — write the diagram as a Mermaid stateDiagram-v2 string', C.bien + ' đang trống — viết sơ đồ thành chuỗi Mermaid stateDiagram-v2') };
  var p = L.ps(src);
  var that = p.st.filter(function (s) { return !s.gia; });
  function tim(mau) { return that.filter(function (s) { return L.khop(s.ten, mau) || L.khop(s.id, mau); }); }
  return { p: p, that: that, tim: tim };
}

export function kiemState(cfg) {
  const { bien = 'STATE_DIAGRAM', nhom = {}, an = [], tenDoiTuong = 'the object' } = cfg;
  const C = { bien, st: cfg.st || [], ch: cfg.ch || [], toiThieu: cfg.toiThieu || 0, guardToiThieu: cfg.guardToiThieu || 0, tenDoiTuong, canCuoi: cfg.canCuoi !== false };
  const DOC = stDoc.toString();
  const boc = (than) => new Function('L', 'C', 'A', `var stDoc = ${DOC}; var d = stDoc(L, C, A); if (d.loi) return d.loi; var p = d.p; ${than}`);
  const C0 = { bien, tenDoiTuong, canCuoi: C.canCuoi };
  const opt = (k, ten, Cx = C0) => ({ C: Cx, bien: [bien], phan: ['state'], nhom: nh(nhom, k), an: an.includes(ten) });
  const ds = [];
  ds.push(kiemMH({ en: 'State diagram — valid syntax; one initial pseudostate, at least one final state', vi: 'Sơ đồ trạng thái — đúng cú pháp; một trạng thái đầu, ít nhất một trạng thái kết thúc' }, boc(`
    if (p.loi.length) return p.loi[0] + (p.loi.length > 1 ? ' (+' + (p.loi.length - 1) + ')' : '');
    var dau = p.ch.filter(function (c) { return c.tu === '[*]'; }), cuoi = p.ch.filter(function (c) { return c.den === '[*]'; });
    if (dau.length !== 1) return L.m(dau.length ? 'more than one initial transition [*] --> … — the object is born in ONE state' : 'no initial pseudostate — add [*] --> FirstState', dau.length ? 'nhiều hơn một chuyển từ [*] — đối tượng sinh ra ở MỘT trạng thái' : 'chưa có trạng thái đầu — thêm [*] --> TrạngTháiĐầu');
    if (!cuoi.length && C.canCuoi) return L.m('no final state — add LastState --> [*]', 'chưa có trạng thái kết thúc — thêm TrạngTháiCuối --> [*]');
    return 'OK';`), opt('cuPhap', 'cuphap')));
  ds.push(kiemMH({ en: 'State diagram — every transition is labelled with an event; every state is reachable and has a way out', vi: 'Sơ đồ trạng thái — mọi chuyển có sự kiện; mọi trạng thái tới được và có lối ra' }, boc(`
    var x = p.ch.filter(function (c) { return c.tu !== '[*]' && c.den !== '[*]' && !c.suKien && !c.guard; });
    if (x.length) return L.m('line ' + x[0].dong + ': transition ' + x[0].tu + ' → ' + x[0].den + ' has no event — write "A --> B : event [guard]"', 'dòng ' + x[0].dong + ': chuyển ' + x[0].tu + ' → ' + x[0].den + ' chưa có sự kiện — viết "A --> B : sự kiện [điều kiện]"');
    var toi = {}, hang = ['[*]'];
    for (var i = 0; i < hang.length; i++) p.ch.forEach(function (c) { if (c.tu === hang[i] && !toi[c.den]) { toi[c.den] = 1; hang.push(c.den); } });
    var khong = p.st.filter(function (s) { return !toi[s.id]; });
    if (khong.length) return L.m('state ' + L.ds(khong.map(function (s) { return s.ten; })) + ' can never be reached from the initial state', 'trạng thái ' + L.ds(khong.map(function (s) { return s.ten; })) + ' không bao giờ tới được từ trạng thái đầu');
    var cut = p.st.filter(function (s) { return !p.ch.some(function (c) { return c.tu === s.id; }); });
    if (cut.length) return L.m('state ' + L.ds(cut.map(function (s) { return s.ten; })) + ' has no outgoing transition — if it is an end, add ' + cut[0].id + ' --> [*]', 'trạng thái ' + L.ds(cut.map(function (s) { return s.ten; })) + ' không có lối ra — nếu là điểm kết thúc, thêm ' + cut[0].id + ' --> [*]');
    return 'OK';`), opt('cuPhap', 'toiduoc')));
  if (cfg.kiemTen !== false) ds.push(kiemMH({ en: 'State diagram — states are conditions (adjective / past participle), not activities', vi: 'Sơ đồ trạng thái — trạng thái là tình trạng (tính từ / quá khứ phân từ), không phải hoạt động' }, boc(`
    var x = d.that.filter(function (s) { var t = L.tu(s.ten); return t.length && (L.laHoatDongIng(t[0]) || (L.laHanhDong(t[0]) && !/(ed|en)$/.test(t[0]))); });
    if (x.length) return L.m('"' + x[0].ten + '" is an activity — name where ' + C.tenDoiTuong + ' SITS, e.g. "Submitted", "Under Review", "Paid"', '"' + x[0].ten + '" là hoạt động — đặt tên chỗ đối tượng NẰM YÊN, vd "Submitted", "Under Review", "Paid"');
    return 'OK';`), opt('cuPhap', 'tinhtrang')));
  if (C.toiThieu) {
    ds.push(kiemMH({ en: `State diagram — at least ${C.toiThieu} distinct states`, vi: `Sơ đồ trạng thái — ít nhất ${C.toiThieu} trạng thái phân biệt` }, boc(`
      return d.that.length >= C.toiThieu ? 'OK' : L.m('only ' + d.that.length + ' states', 'mới ' + d.that.length + ' trạng thái');`), opt('thanhPhan', 'soluong', { bien, toiThieu: C.toiThieu })));
  }
  if (C.st.length) {
    ds.push(kiemMH({ en: 'State diagram — the key states of the case are modelled', vi: 'Sơ đồ trạng thái — có đủ các trạng thái then chốt của đề' }, boc(`
      var thieu = C.st.filter(function (e) { return !d.tim(e.khop).length; });
      if (thieu.length) return L.m('missing state for: ' + L.ds(thieu.map(function (e) { return e.ten; })), 'thiếu trạng thái cho: ' + L.ds(thieu.map(function (e) { return e.tenVi || e.ten; })));
      return 'OK';`), opt('thanhPhan', 'du', { bien, st: C.st })));
  }
  for (const r of C.ch) {
    const Cr = { bien, r };
    ds.push(kiemMH({ en: `Transition — ${r.ten}`, vi: `Chuyển trạng thái — ${r.tenVi || r.ten}` }, boc(`
      var r = C.r, a = r.tu === '[*]' ? [{ id: '[*]' }] : d.tim(r.tu), b = r.den === '[*]' ? [{ id: '[*]' }] : d.tim(r.den);
      if (!a.length || !b.length) return L.m('need both states for: ' + r.ten, 'cần đủ hai trạng thái cho: ' + (r.tenVi || r.ten));
      var cs = p.ch.filter(function (c) { return a.some(function (x) { return x.id === c.tu; }) && b.some(function (x) { return x.id === c.den; }); });
      if (!cs.length) return L.m('no transition yet: ' + r.ten, 'chưa có chuyển: ' + (r.tenVi || r.ten));
      if (r.suKien && !cs.some(function (c) { return L.khop(c.nhan, r.suKien); })) return L.m('line ' + cs[0].dong + ': the event should say what triggers it — ' + r.ten, 'dòng ' + cs[0].dong + ': sự kiện phải nói cái gì kích hoạt — ' + (r.tenVi || r.ten));
      if (r.guard && !cs.some(function (c) { return c.guard; })) return L.m('line ' + cs[0].dong + ': add the guard condition in [ ] — ' + r.lyDo, 'dòng ' + cs[0].dong + ': thêm điều kiện canh trong [ ] — ' + (r.lyDoVi || r.lyDo));
      return 'OK';`), opt('chuyen', `ch:${r.ten}`, Cr)));
  }
  if (C.guardToiThieu) {
    ds.push(kiemMH({ en: `State diagram — at least ${C.guardToiThieu} guarded transitions [condition]`, vi: `Sơ đồ trạng thái — ít nhất ${C.guardToiThieu} chuyển có điều kiện canh [điều kiện]` }, boc(`
      var n = p.ch.filter(function (c) { return c.guard; }).length;
      return n >= C.guardToiThieu ? 'OK' : L.m('only ' + n + ' guard(s) — two arrows leaving the same state on the same event need guards to tell them apart', 'mới ' + n + ' guard — hai mũi tên rời cùng trạng thái cùng sự kiện cần guard để phân biệt');`), opt('chuyen', 'guard', { bien, guardToiThieu: C.guardToiThieu })));
  }
  return ds;
}

export function kiemBangState(cfg) {
  const { bien = 'STATE_DIAGRAM', bienBang = 'STATES', nhom, an = false, toiThieuTu = 6 } = cfg;
  const C = { bien, bienBang, toiThieuTu };
  const DOC = stDoc.toString();
  const fn = new Function('L', 'C', 'A', `var stDoc = ${DOC}; var d = stDoc(L, C, A); if (d.loi) return L.m('fix the state diagram first', 'sửa sơ đồ trạng thái trước');
    var T = A[C.bienBang];
    if (!Array.isArray(T) || !T.length) return L.m(C.bienBang + ' is empty — one object { name, description } per state', C.bienBang + ' đang trống — mỗi trạng thái một object { name, description }');
    for (var i = 0; i < d.that.length; i++) {
      var s = d.that[i];
      var r = T.filter(function (x) { return x && (L.norm(x.name) === L.norm(s.ten) || L.norm(x.name) === L.norm(s.id)); })[0];
      if (!r) return L.m('no row for state "' + s.ten + '"', 'thiếu dòng cho trạng thái "' + s.ten + '"');
      if (L.soTu(r.description) < C.toiThieuTu || /<|tbd|todo|\\.\\.\\./i.test(String(r.description))) return L.m('describe the business meaning of "' + s.ten + '" in a real sentence', 'mô tả ý nghĩa nghiệp vụ của "' + s.ten + '" bằng một câu thật');
    }
    for (var j = 0; j < T.length; j++) if (!d.that.some(function (s) { return L.norm(T[j] && T[j].name) === L.norm(s.ten) || L.norm(T[j] && T[j].name) === L.norm(s.id); })) return L.m('row "' + (T[j] && T[j].name) + '" is not a state of the diagram', 'dòng "' + (T[j] && T[j].name) + '" không có trong sơ đồ');
    return 'OK';`);
  return [kiemMH({ en: 'State table — every state described with its business meaning', vi: 'Bảng trạng thái — mô tả ý nghĩa nghiệp vụ của mọi trạng thái' }, fn, { C, bien: [bien, bienBang], phan: ['state'], nhom, an })];
}

/* ─────────────────────────────── DFD (mức 0 / mức 1) ─────────────────────────────── */
function dfdDoc(L, C, A) {
  var src = A[C.bien];
  if (typeof src !== 'string' || !src.trim()) return { loi: L.m(C.bien + ' is empty — write the DFD as a Mermaid flowchart string', C.bien + ' đang trống — viết DFD thành chuỗi Mermaid flowchart') };
  var p = L.pf(src);
  var proc = p.ds.filter(function (n) { return n.hinh === 'tron'; }), kho = p.ds.filter(function (n) { return n.hinh === 'kho'; }), ngoai = p.ds.filter(function (n) { return n.hinh === 'hcn'; });
  return { p: p, proc: proc, kho: kho, ngoai: ngoai };
}

export function kiemDfd(cfg) {
  const { bien = 'DFD', nhom = {}, an = [] } = cfg;
  const C = { bien, proc: cfg.proc || [], kho: cfg.kho || [], ngoai: cfg.ngoai || [], canBang: cfg.canBang || [], canBangVoi: cfg.canBangVoi || null };
  const DOC = dfdDoc.toString();
  const boc = (than) => new Function('L', 'C', 'A', `var dfdDoc = ${DOC}; var d = dfdDoc(L, C, A); if (d.loi) return d.loi; var p = d.p; ${than}`);
  const opt = (k, ten) => ({ C, bien: [bien], phan: ['flow'], nhom: nh(nhom, k), an: an.includes(ten) });
  const ds = [];
  ds.push(kiemMH({ en: 'DFD — valid syntax; processes are numbered verb phrases, stores are named', vi: 'DFD — đúng cú pháp; process có số và là cụm động từ, kho có tên' }, boc(`
    if (p.loi.length) return p.loi[0];
    if (!d.proc.length) return L.m('no process — processes are circles P1((1.0 Verb object))', 'chưa có process — process là hình tròn P1((1.0 Động từ + danh từ))');
    var la = p.ds.filter(function (n) { return ['tron', 'kho', 'hcn'].indexOf(n.hinh) < 0; });
    if (la.length) return L.m('node ' + la[0].id + ' has no DFD shape — process ((…)), store [(…)], entity […]', 'nút ' + la[0].id + ' chưa đúng hình DFD — process ((…)), kho [(…)], thực thể […]');
    for (var i = 0; i < d.proc.length; i++) {
      var t = d.proc[i].nhan, m = /^(\\d+(\\.\\d+)*)\\s+(.+)$/.exec(t);
      if (!m) return L.m('process "' + t + '" needs a number, e.g. "1.0 Book appointment"', 'process "' + t + '" cần đánh số, vd "1.0 Book appointment"');
      if (!L.laDongTu(L.tu(m[3])[0])) return L.m('process "' + t + '" — name it verb + object ("Record payment")', 'process "' + t + '" — đặt tên động từ + tân ngữ ("Record payment")');
    }
    return 'OK';`), opt('cuPhap', 'cuphap')));
  ds.push(kiemMH({ en: 'DFD — data only moves THROUGH a process: no entity–entity, entity–store or store–store flow; every flow labelled', vi: 'DFD — dữ liệu chỉ đi QUA process: không luồng thực thể–thực thể, thực thể–kho, kho–kho; luồng nào cũng có nhãn' }, boc(`
    var N = p.nut;
    for (var i = 0; i < p.canh.length; i++) {
      var c = p.canh[i], a = N[c.tu], b = N[c.den];
      if (!c.nhan) return L.m('line ' + c.dong + ': unlabelled flow', 'dòng ' + c.dong + ': luồng không nhãn');
      if (a.hinh !== 'tron' && b.hinh !== 'tron') return L.m('line ' + c.dong + ': ' + a.nhan + ' → ' + b.nhan + ' does not pass through a process', 'dòng ' + c.dong + ': ' + a.nhan + ' → ' + b.nhan + ' không đi qua process nào');
    }
    return 'OK';`), opt('cuPhap', 'quaprocess')));
  ds.push(kiemMH({ en: 'DFD — no black hole or miracle; every store is both written and read', vi: 'DFD — không "hố đen" hay "phép màu"; kho nào cũng được ghi và được đọc' }, boc(`
    for (var i = 0; i < d.proc.length; i++) {
      var n = d.proc[i];
      var vao = p.canh.some(function (c) { return c.den === n.id; }), ra = p.canh.some(function (c) { return c.tu === n.id; });
      if (vao && !ra) return L.m('black hole: "' + n.nhan + '" takes data in and produces nothing', 'hố đen: "' + n.nhan + '" nhận dữ liệu mà không sinh ra gì');
      if (ra && !vao) return L.m('miracle: "' + n.nhan + '" produces data from nothing', 'phép màu: "' + n.nhan + '" sinh dữ liệu từ hư không');
      if (!ra && !vao) return L.m('"' + n.nhan + '" has no flow', '"' + n.nhan + '" không có luồng nào');
    }
    for (var j = 0; j < d.kho.length; j++) {
      var k = d.kho[j];
      if (!p.canh.some(function (c) { return c.den === k.id; })) return L.m('store "' + k.nhan + '" is read but never written — which process creates its data?', 'kho "' + k.nhan + '" được đọc mà chưa ai ghi — process nào tạo dữ liệu cho nó?');
      if (!p.canh.some(function (c) { return c.tu === k.id; })) return L.m('store "' + k.nhan + '" is written but never read — why keep it?', 'kho "' + k.nhan + '" được ghi mà không ai đọc — giữ để làm gì?');
    }
    return 'OK';`), opt('cuPhap', 'hoden')));
  if (C.proc.length || C.kho.length) {
    ds.push(kiemMH({ en: 'DFD — the processes and stores the case needs are present', vi: 'DFD — có đủ process và kho đề cần' }, boc(`
      var t1 = C.proc.filter(function (e) { return !d.proc.some(function (n) { return L.khop(n.nhan, e.khop); }); });
      if (t1.length) return L.m('missing process for: ' + L.ds(t1.map(function (e) { return e.ten; })), 'thiếu process cho: ' + L.ds(t1.map(function (e) { return e.ten; })));
      var t2 = C.kho.filter(function (e) { return !d.kho.some(function (n) { return L.khop(n.nhan, e.khop); }); });
      if (t2.length) return L.m('missing data store: ' + L.ds(t2.map(function (e) { return e.ten; })), 'thiếu kho dữ liệu: ' + L.ds(t2.map(function (e) { return e.ten; })));
      return 'OK';`), opt('thanhPhan', 'du')));
  }
  if (C.canBangVoi) {
    ds.push(kiemMH({ en: 'DFD — balanced with YOUR context diagram: the same external flows, same names, same directions, nothing added', vi: 'DFD — cân bằng với sơ đồ ngữ cảnh CỦA BẠN: đúng các luồng ngoài, cùng tên, cùng chiều, không thêm' }, boc(`
      var src = A[C.canBangVoi];
      if (typeof src !== 'string' || !src.trim()) return L.m('draw the context diagram first (' + C.canBangVoi + ')', 'hãy vẽ sơ đồ ngữ cảnh trước (' + C.canBangVoi + ')');
      var q = L.pf(src), Q = q.nut, N = p.nut;
      function ngoaiCua(pp, NN) {
        return pp.canh.filter(function (c) { return NN[c.tu] && NN[c.den] && (NN[c.tu].hinh === 'hcn' || NN[c.den].hinh === 'hcn'); }).map(function (c) {
          var e = NN[c.tu].hinh === 'hcn' ? NN[c.tu] : NN[c.den];
          return { e: L.norm(e.nhan), huong: NN[c.tu].hinh === 'hcn' ? 'vao' : 'ra', nhan: L.norm(c.nhan), goc: c.nhan, dong: c.dong };
        });
      }
      var a = ngoaiCua(q, Q), b = ngoaiCua(p, N);
      var cung = function (x, y) { return x.e === y.e && x.huong === y.huong && x.nhan === y.nhan; };
      var thieu = a.filter(function (x) { return !b.some(function (y) { return cung(x, y); }); });
      if (thieu.length) return L.m('the context flow "' + thieu[0].goc + '" (' + (thieu[0].huong === 'vao' ? thieu[0].e + ' → system' : 'system → ' + thieu[0].e) + ') is missing or renamed in the DFD', 'luồng ngữ cảnh "' + thieu[0].goc + '" bị thiếu hoặc đổi tên trong DFD');
      var them = b.filter(function (y) { return !a.some(function (x) { return cung(x, y); }); });
      if (them.length) return L.m('line ' + them[0].dong + ': flow "' + them[0].goc + '" with an external entity is not in your context diagram — levels must balance', 'dòng ' + them[0].dong + ': luồng "' + them[0].goc + '" với thực thể ngoài không có trong sơ đồ ngữ cảnh của bạn — các mức phải cân bằng');
      return 'OK';`), { ...opt('canBang', 'canbang'), bien: [bien, C.canBangVoi] }));
  }
  if (C.canBang.length) {
    ds.push(kiemMH({ en: 'DFD — balanced with the context diagram: the same external flows, same names, same directions, nothing added', vi: 'DFD — cân bằng với sơ đồ ngữ cảnh: đúng các luồng ngoài, cùng tên, cùng chiều, không thêm' }, boc(`
      var N = p.nut;
      var ngoai = p.canh.filter(function (c) { return N[c.tu].hinh === 'hcn' || N[c.den].hinh === 'hcn'; }).map(function (c) {
        var e = N[c.tu].hinh === 'hcn' ? N[c.tu] : N[c.den];
        return { e: L.norm(e.nhan), huong: N[c.tu].hinh === 'hcn' ? 'vao' : 'ra', nhan: L.norm(c.nhan), dong: c.dong };
      });
      for (var i = 0; i < C.canBang.length; i++) {
        var f = C.canBang[i];
        if (!ngoai.some(function (x) { return x.e === L.norm(f.thucThe) && x.huong === f.huong && x.nhan === L.norm(f.nhan); })) return L.m('the context flow "' + f.nhan + '" (' + (f.huong === 'vao' ? f.thucThe + ' → system' : 'system → ' + f.thucThe) + ') is missing or renamed', 'luồng ngữ cảnh "' + f.nhan + '" (' + (f.huong === 'vao' ? f.thucThe + ' → hệ thống' : 'hệ thống → ' + f.thucThe) + ') bị thiếu hoặc đổi tên');
      }
      var them = ngoai.filter(function (x) { return !C.canBang.some(function (f) { return x.e === L.norm(f.thucThe) && x.huong === f.huong && x.nhan === L.norm(f.nhan); }); });
      if (them.length) return L.m('line ' + them[0].dong + ': flow "' + them[0].nhan + '" with an external entity is not in the context diagram — levels must balance', 'dòng ' + them[0].dong + ': luồng "' + them[0].nhan + '" với thực thể ngoài không có trong sơ đồ ngữ cảnh — các mức phải cân bằng');
      return 'OK';`), opt('canBang', 'canbang')));
  }
  return ds;
}

/* ─────────────────────────────── SWIMLANE (PlantUML activity) ─────────────────────────────── */
export function kiemSwimlane(cfg) {
  const { bien = 'SWIMLANE', nhom = {}, an = [] } = cfg;
  const C = { bien, lanes: cfg.lanes || [], hd: cfg.hd || [], thuTu: cfg.thuTu || [], canNhanh: cfg.canNhanh !== false, banGiaoToiThieu: cfg.banGiaoToiThieu || 0 };
  const DOC = function swDoc(L, C, A) {
    var src = A[C.bien];
    if (typeof src !== 'string' || !src.trim()) return { loi: L.m(C.bien + ' is empty — write a PlantUML activity diagram with |Lanes|', C.bien + ' đang trống — viết sơ đồ PlantUML activity có |Lane|') };
    var p = L.pa(src);
    var hd = p.buoc.filter(function (b) { return b.loai === 'hd'; });
    function tim(mau) { for (var i = 0; i < hd.length; i++) if (L.khop(hd[i].ten, mau)) return i; return -1; }
    return { p: p, hd: hd, tim: tim };
  }.toString();
  const boc = (than) => new Function('L', 'C', 'A', `var swDoc = ${DOC}; var d = swDoc(L, C, A); if (d.loi) return d.loi; var p = d.p; ${than}`);
  const opt = (k, ten) => ({ C, bien: [bien], phan: ['act'], nhom: nh(nhom, k), an: an.includes(ten) });
  const ds = [];
  ds.push(kiemMH({ en: 'Swimlane — valid syntax: start, stop, every action inside a lane, every decision closed', vi: 'Swimlane — đúng cú pháp: có start, stop, mọi hành động nằm trong một lane, mọi rẽ nhánh được đóng' }, boc(`
    if (p.loi.length) return p.loi[0];
    if (!p.coStart || !p.coStop) return L.m('add "start" and "stop"', 'thêm "start" và "stop"');
    if (p.lanes.length < 2) return L.m('a swimlane needs at least two lanes (|Role|)', 'swimlane cần ít nhất hai lane (|Vai trò|)');
    var x = d.hd.filter(function (b) { return !b.lane; });
    if (x.length) return L.m('action "' + x[0].ten + '" is not in any lane — put a |Lane| line before it', 'hành động "' + x[0].ten + '" chưa thuộc lane nào — đặt dòng |Lane| trước nó');
    var y = d.hd.filter(function (b) { var t = L.tu(b.ten); return !t.length || !L.laDongTu(t[0]); });
    if (y.length) return L.m('action "' + y[0].ten + '" — start with a verb ("Check slot availability")', 'hành động "' + y[0].ten + '" — bắt đầu bằng động từ ("Check slot availability")');
    return 'OK';`), opt('cuPhap', 'cuphap')));
  if (C.lanes.length) {
    ds.push(kiemMH({ en: 'Swimlane — the lanes are the roles of the case', vi: 'Swimlane — các lane là các vai trò trong đề' }, boc(`
      var thieu = C.lanes.filter(function (e) { return !p.lanes.some(function (l) { return L.khop(l, e.khop); }); });
      if (thieu.length) return L.m('missing lane: ' + L.ds(thieu.map(function (e) { return e.ten; })), 'thiếu lane: ' + L.ds(thieu.map(function (e) { return e.ten; })));
      return 'OK';`), opt('thanhPhan', 'lane')));
  }
  for (const h of C.hd) {
    const Ch = { ...C, h };
    ds.push(kiemMH({ en: `Swimlane — "${h.ten}" is done by the right role`, vi: `Swimlane — "${h.tenVi || h.ten}" do đúng vai thực hiện` }, boc(`
      var h = C.h, i = d.tim(h.khop);
      if (i < 0) return L.m('no action for: ' + h.ten, 'chưa có hành động cho: ' + (h.tenVi || h.ten));
      if (!L.khop(d.hd[i].lane, h.lane)) return L.m('"' + d.hd[i].ten + '" sits in lane ' + d.hd[i].lane + ' — who performs it in the case?', '"' + d.hd[i].ten + '" đang ở lane ' + d.hd[i].lane + ' — theo đề ai làm việc này?');
      return 'OK';`), { ...opt('hanhDong', `hd:${h.ten}`), C: Ch }));
  }
  if (C.thuTu.length) {
    ds.push(kiemMH({ en: 'Swimlane — actions happen in the order the case describes', vi: 'Swimlane — hành động đúng thứ tự đề mô tả' }, boc(`
      for (var i = 0; i < C.thuTu.length; i++) {
        var a = d.tim(C.thuTu[i][0].khop), b = d.tim(C.thuTu[i][1].khop);
        if (a < 0 || b < 0) return L.m('need both actions: ' + C.thuTu[i][0].ten + ' / ' + C.thuTu[i][1].ten, 'cần đủ hai hành động: ' + C.thuTu[i][0].ten + ' / ' + C.thuTu[i][1].ten);
        if (a > b) return L.m('"' + C.thuTu[i][0].ten + '" must come before "' + C.thuTu[i][1].ten + '"', '"' + C.thuTu[i][0].ten + '" phải trước "' + C.thuTu[i][1].ten + '"');
      }
      return 'OK';`), opt('hanhDong', 'thutu')));
  }
  if (C.canNhanh) {
    ds.push(kiemMH({ en: 'Swimlane — shows the unhappy path: a decision with both branches labelled', vi: 'Swimlane — có đường không thuận: một rẽ nhánh có đủ hai nhánh gắn nhãn' }, boc(`
      var q = p.qd.filter(function (x) { return x.coElse; });
      if (!q.length) return L.m('no decision with an else branch — what happens when it fails / is rejected?', 'chưa có rẽ nhánh nào có else — chuyện gì xảy ra khi hỏng / bị từ chối?');
      var t = q.filter(function (x) { return x.nhan.some(function (n) { return !String(n).trim(); }); });
      if (t.length) return L.m('line ' + t[0].dong + ': label both branches, e.g. then (yes) … else (no)', 'dòng ' + t[0].dong + ': gắn nhãn cả hai nhánh, vd then (yes) … else (no)');
      return 'OK';`), opt('hanhDong', 'nhanh')));
  }
  if (C.banGiaoToiThieu) {
    ds.push(kiemMH({ en: `Swimlane — at least ${C.banGiaoToiThieu} hand-offs between lanes`, vi: `Swimlane — ít nhất ${C.banGiaoToiThieu} điểm bàn giao giữa các lane` }, boc(`
      var n = 0;
      for (var i = 1; i < d.hd.length; i++) if (d.hd[i].lane !== d.hd[i - 1].lane) n++;
      return n >= C.banGiaoToiThieu ? 'OK' : L.m('only ' + n + ' hand-off(s) — the case passes the work between more roles', 'mới ' + n + ' điểm bàn giao — đề chuyển việc qua nhiều vai hơn');`), opt('hanhDong', 'bangiao')));
  }
  return ds;
}

/* ─────────────────────────────── ĐẶC TẢ USE CASE ─────────────────────────────── */
/**
 * cfg = { bien:'UC_SPEC', actorChinh:{ten,khop}, actorPhu?:[{ten,khop}], tienDK:[{ten,khop}], hauDK:[{ten,khop}],
 *         luongChinh:{ toiThieu:6, su:[{ten,khop}] (theo THỨ TỰ) }, ngoaiLe:[{ten,khop}], thayThe:[{ten,khop}], br?:[ma] , nhom:{…} }
 * Người học khai:
 *   const UC_SPEC = { id, name, primaryActor, secondaryActors:[], description, trigger, preconditions:[], postconditions:[],
 *     normalFlow:['1. Patient …', '2. System …'], alternativeFlows:[{ id:'AF1', at:3, name, steps:[] }],
 *     exceptions:[{ id:'E1', at:5, condition, steps:[] }], priority, frequency, businessRules:['BR-01'], assumptions:[] }
 */
export function kiemDacTaUC(cfg) {
  const { bien = 'UC_SPEC', nhom = {}, an = [] } = cfg;
  const C = { bien, ...cfg };
  delete C.nhom; delete C.an;
  const DOC = function spDoc(L, C, A) {
    var s = A[C.bien];
    if (!s || typeof s !== 'object') return { loi: L.m(C.bien + ' is missing — declare const ' + C.bien + ' = { … } with the template fields', 'thiếu ' + C.bien + ' — khai const ' + C.bien + ' = { … } đủ các trường của template') };
    function ds(x) { return Array.isArray(x) ? x.map(function (y) { return typeof y === 'string' ? y : (y && (y.text || y.step || y.description)) || ''; }) : []; }
    function buoc(fl) { return ds(fl).map(function (t) { return String(t).replace(/^\s*\d+[.)]\s*/, ''); }); }
    return { s: s, ds: ds, buoc: buoc };
  }.toString();
  const boc = (than) => new Function('L', 'C', 'A', `var spDoc = ${DOC}; var d = spDoc(L, C, A); if (d.loi) return d.loi; var s = d.s; ${than}`);
  const opt = (k, ten) => ({ C, bien: [bien, ...(cfg.bienBR ? [cfg.bienBR] : [])], phan: [], nhom: nh(nhom, k), an: an.includes(ten) });
  const out = [];
  out.push(kiemMH({ en: 'Use case specification — every template field is filled (no placeholders)', vi: 'Đặc tả use case — điền đủ mọi trường của template (không còn chữ mẫu)' }, boc(`
    var can = ['id', 'name', 'primaryActor', 'description', 'trigger', 'preconditions', 'postconditions', 'normalFlow', 'alternativeFlows', 'exceptions', 'priority'];
    for (var i = 0; i < can.length; i++) {
      var v = s[can[i]];
      if (v == null || (typeof v === 'string' && !v.trim()) || (Array.isArray(v) && !v.length)) return L.m('field "' + can[i] + '" is empty', 'trường "' + can[i] + '" đang trống');
      if (/<[^>]*>|\\bTBD\\b|\\.\\.\\./.test(JSON.stringify(v))) return L.m('field "' + can[i] + '" still has template text (<…>, TBD, ...)', 'trường "' + can[i] + '" còn chữ mẫu (<…>, TBD, ...)');
    }
    if (!/^UC-?\\d+$/i.test(String(s.id))) return L.m('id must look like UC-05', 'mã phải dạng UC-05');
    if (!L.laDongTu(L.tu(s.name)[0])) return L.m('use case name starts with a verb', 'tên use case bắt đầu bằng động từ');
    if (!/^(high|medium|low|must|should|could)/i.test(String(s.priority))) return L.m('priority: High / Medium / Low', 'độ ưu tiên: High / Medium / Low');
    return 'OK';`), opt('cauTruc', 'du')));
  out.push(kiemMH({ en: 'Use case specification — actors, trigger and conditions match the case', vi: 'Đặc tả use case — actor, trigger và các điều kiện khớp đề' }, boc(`
    if (!L.khop(s.primaryActor, C.actorChinh.khop)) return L.m('primary actor: who starts this use case to reach a goal? (' + C.actorChinh.ten + ')', 'actor chính: ai khởi động use case này để đạt mục tiêu? (' + C.actorChinh.ten + ')');
    var phu = (Array.isArray(s.secondaryActors) ? s.secondaryActors : String(s.secondaryActors || '').split(/[,;]/)).join(' | ');
    for (var i = 0; i < (C.actorPhu || []).length; i++) if (!L.khop(phu, C.actorPhu[i].khop)) return L.m('secondary actor missing: ' + C.actorPhu[i].ten, 'thiếu actor phụ: ' + C.actorPhu[i].ten);
    var pre = d.ds(s.preconditions).join(' | ');
    for (var j = 0; j < (C.tienDK || []).length; j++) if (!L.khop(pre, C.tienDK[j].khop)) return L.m('precondition missing: ' + C.tienDK[j].ten, 'thiếu tiền điều kiện: ' + C.tienDK[j].ten);
    var post = d.ds(s.postconditions).join(' | ');
    for (var k = 0; k < (C.hauDK || []).length; k++) if (!L.khop(post, C.hauDK[k].khop)) return L.m('postcondition missing: ' + C.hauDK[k].ten, 'thiếu hậu điều kiện: ' + C.hauDK[k].ten);
    if (C.trigger && !L.khop(s.trigger, C.trigger.khop)) return L.m('trigger: ' + C.trigger.ten, 'trigger: ' + C.trigger.ten);
    return 'OK';`), opt('dieuKien', 'dieukien')));
  out.push(kiemMH({ en: 'Use case specification — the normal flow is a numbered actor ↔ system dialogue covering the case, in order', vi: 'Đặc tả use case — luồng chính là đối thoại actor ↔ hệ thống đánh số, phủ đề, đúng thứ tự' }, boc(`
    var b = d.buoc(s.normalFlow);
    var t = C.luongChinh || {};
    if (b.length < (t.toiThieu || 5)) return L.m('only ' + b.length + ' steps — the normal flow needs at least ' + (t.toiThieu || 5), 'mới ' + b.length + ' bước — luồng chính cần ít nhất ' + (t.toiThieu || 5));
    var he = b.filter(function (x) { return /^(the )?system\\b/i.test(x.trim()); }).length;
    if (he === 0 || he === b.length) return L.m('alternate actor steps and System steps ("<Actor> selects…", "System displays…")', 'xen kẽ bước của actor và bước "System …"');
    var vt = -1;
    for (var i = 0; i < (t.su || []).length; i++) {
      var f = t.su[i], j = -1;
      for (var k = 0; k < b.length; k++) if (L.khop(b[k], f.khop)) { j = k; break; }
      if (j < 0) return L.m('the normal flow never covers: ' + f.ten, 'luồng chính chưa có bước: ' + f.ten);
      if (j < vt) return L.m('"' + f.ten + '" comes too early — follow the order of the case', '"' + f.ten + '" đến quá sớm — theo đúng thứ tự trong đề');
      vt = j;
    }
    return 'OK';`), opt('luong', 'luongchinh')));
  out.push(kiemMH({ en: 'Use case specification — alternative flows and exceptions cover the case and point to a real step', vi: 'Đặc tả use case — luồng thay thế và ngoại lệ phủ đề và trỏ đúng một bước có thật' }, boc(`
    var b = d.buoc(s.normalFlow);
    var nhom = [['alternativeFlows', C.thayThe || []], ['exceptions', C.ngoaiLe || []]];
    for (var g = 0; g < nhom.length; g++) {
      var ds2 = Array.isArray(s[nhom[g][0]]) ? s[nhom[g][0]] : [];
      for (var i = 0; i < ds2.length; i++) {
        var x = ds2[i] || {};
        var at = Number(String(x.at == null ? '' : x.at).replace(/[^0-9.]/g, ''));
        if (!(at >= 1 && at <= b.length)) return L.m(nhom[g][0] + '[' + i + ']: "at" must be the number of the normal-flow step where it branches (1…' + b.length + ')', nhom[g][0] + '[' + i + ']: "at" phải là số bước của luồng chính nơi rẽ nhánh (1…' + b.length + ')');
        if (!d.ds(x.steps).length) return L.m(nhom[g][0] + '[' + i + ']: list its steps', nhom[g][0] + '[' + i + ']: liệt kê các bước');
      }
      var chu = ds2.map(function (x) { return [x && x.name, x && x.condition, d.ds(x && x.steps).join(' ')].join(' '); }).join(' | ');
      for (var k = 0; k < nhom[g][1].length; k++) if (!L.khop(chu, nhom[g][1][k].khop)) return L.m((g ? 'exception' : 'alternative flow') + ' missing: ' + nhom[g][1][k].ten, 'thiếu ' + (g ? 'ngoại lệ' : 'luồng thay thế') + ': ' + nhom[g][1][k].ten);
    }
    return 'OK';`), opt('ngoaiLe', 'ngoaile')));
  if (cfg.bienBR) {
    out.push(kiemMH({ en: 'Use case specification — the business rules it cites exist', vi: 'Đặc tả use case — các business rule được trích đều có thật' }, boc(`
      var br = A[C.bienBR];
      var ma = (Array.isArray(s.businessRules) ? s.businessRules : []).map(String);
      if (!ma.length) return L.m('cite the business rules this use case enforces (BR-xx)', 'trích các business rule use case này áp dụng (BR-xx)');
      if (!Array.isArray(br)) return 'OK';
      var la = ma.filter(function (m) { return !br.some(function (r) { return r && String(r.id).toUpperCase() === m.toUpperCase(); }); });
      if (la.length) return L.m('rule ' + L.ds(la) + ' is cited but not defined in ' + C.bienBR, 'rule ' + L.ds(la) + ' được trích mà chưa định nghĩa trong ' + C.bienBR);
      return 'OK';`), opt('luong', 'br')));
  }
  return out;
}
