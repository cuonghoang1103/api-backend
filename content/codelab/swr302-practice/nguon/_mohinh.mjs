/**
 * SWR302 practice — MÁY CHẤM SƠ ĐỒ (tệp bắt đầu bằng "_" ⇒ bộ xuất bỏ qua).
 * ═════════════════════════════════════════════════════════════════════════════════════════════
 * Người học "vẽ" bằng chữ — đúng cú pháp công cụ thật, dán vào mermaid.live / plantuml.com là ra hình:
 *   - Context diagram & DFD : Mermaid flowchart  —  ((Hệ thống)) tròn = process · [Thực thể] = external entity ·
 *                             [(Kho)] = data store · A -->|nhãn dữ liệu| B
 *   - Use case diagram      : PlantUML           —  actor, usecase, rectangle "Hệ thống" { … }, A --> UC,
 *                             Base ..> Inc : <<include>> · Ext ..> Base : <<extend>> · Con --|> Cha
 *   - ERD (khái niệm)       : Mermaid erDiagram  —  CUSTOMER ||--o{ BOOKING : makes · CUSTOMER { string customerId PK }
 *   - State / dialog map    : Mermaid stateDiagram-v2 (PlantUML state cũng được) — [*] --> A · A --> B : event [guard] / action
 *   - Swimlane / activity   : PlantUML activity  —  |Lane| · start · :hành động; · if (điều kiện?) then (yes) … else (no) … endif · stop
 *
 * Máy chấm KHÔNG ép một đáp án duy nhất: nó kiểm THUỘC TÍNH mà lý thuyết đòi (một process duy nhất, không luồng
 * thực thể↔thực thể, mọi kho có vào và ra, mọi actor nối ≥ 1 use case, extend đi từ use case mở rộng tới use case
 * gốc, quan hệ "nhiều" đặt đúng phía, trạng thái tới được từ trạng thái đầu…) + các SỰ KIỆN của tình huống (thực thể /
 * actor / use case / entity bắt buộc, với nhiều tên đồng nghĩa chấp nhận được — khai bằng regex trên tên đã chuẩn hoá).
 *
 * Mọi hàm chạy TRONG realm chấm (Worker) phải tự chứa ⇒ được nhúng bằng gon() (esbuild minify) vào từng kiểm.
 * Viết như hàm JS thường để chạy/thử được bằng Node (tệp _thu-mohinh.mjs trong scratchpad).
 */
import { gon } from './_chung.mjs';

/* ═══════════════════════════════════════ LÕI (tự chứa) ═══════════════════════════════════════ */
export function CORE() {
  function norm(s) {
    return String(s == null ? '' : s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase()
      .replace(/[_\-/]+/g, ' ').replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function khop(ten, mau) {
    var n = norm(ten);
    return (mau || []).some(function (m) { return new RegExp(m).test(n); });
  }
  function tu(s) { return norm(s).split(' ').filter(Boolean); }
  function m(en, vi) { return vi ? en + ' — VI: ' + vi : en; }
  function ds(xs) { return xs.map(function (x) { return '"' + x + '"'; }).join(', '); }
  function soTu(s) { return tu(s).length; }
  function cat(s, n) { s = String(s); return s.length > n ? s.slice(0, n - 1) + '…' : s; }
  // tìm phần tử đầu tiên khớp một nhóm tên (mau = mảng regex)
  function tim(ds2, mau, layTen) { for (var i = 0; i < ds2.length; i++) if (khop(layTen ? layTen(ds2[i]) : ds2[i], mau)) return ds2[i]; return null; }
  function chu(v) { return typeof v === 'string' ? v : ''; }
  // tách nguồn thành dòng: bỏ \r, chấm phẩy cuối dòng
  function dong(src) { return String(src).replace(/\r/g, '').split('\n'); }
  // dòng không đọc được (dùng chung cho mọi bộ phân tích)
  function kd(so, s, mau) { return m('line ' + so + ' not understood: ' + cat(s, 50) + (mau ? ' (' + mau + ')' : ''), 'dòng ' + so + ' không đọc được'); }
  return { norm: norm, khop: khop, tu: tu, m: m, ds: ds, soTu: soTu, cat: cat, tim: tim, chu: chu, dong: dong, kd: kd };
}

/* ═══════════ TỪ VỰNG: động từ (tên use case/process), hành động (nhãn luồng), danh động từ (trạng thái) ═══════════ */
export function P_TU(C) {
  // Động từ rộng (tên use case phải bắt đầu bằng một động từ: "Book Appointment", "Make Payment"…)
  var VERB = ('fix hand prepay prebook precheck dispense prescribe retire decommission write abort acknowledge activate adopt advise alert amend annotate appeal append appoint archive arrange assemble audit auto backup balance bid broadcast bulk calibrate cancel capture catalog catalogue categorize categorise certify check-in checkin cite clear clone close collect combine commit compile complain conduct consolidate contribute convert coordinate copy correct count crop customize customise deactivate declare delegate deliver deploy deregister describe destroy diagnose dial discard discount dismiss dispose distribute document draw drop duplicate earn edit elect email embed empty enqueue enter equip erase evaluate exclude execute expire explore extract fetch finalize finalise flag fulfil fulfill fund gather grant group guide hide highlight hold identify ignore import improve include increase initiate insert integrate interview invalidate investigate join justify label launch limit locate log maintain mark merge message migrate mint moderate monitor mute negotiate nominate note obtain onboard override own pair park pass patch payout pin pledge poll populate preview price print proceed procure promote propose protect provision publish purge qualify queue quote randomize randomise reallocate reassign rebook recalculate recall reclaim recognize recognise reconcile redeem redirect reduce refer register regulate reimburse reinstate relate release relocate rename renew repay repeat rephrase replenish request require reserve resize resolve restrict retract retry revise revise reward rollback route sanction save schedule screen seal search secure segment select serve settle shortlist sign simulate sort source specify sponsor stack stage stamp state stock stream submit summarize summarise supervise survey suspend swap tally terminate thank throttle tick toggle total trace transcribe transform translate transport trigger trim unblock undo unfollow unpublish unregister unsubscribe update upgrade validate verify view void waive warn weigh welcome whitelist withdraw accept access activate add adjust ask approve attach charge credit debit deduct dispute escalate notify pause reactivate rebook recharge refill reopen resubmit reward settle sponsor tokenize tokenise unlock verify vet allocate analyse analyze answer apply approve archive arrange ask assess assign attach attend audit '
    + 'authenticate authorize back backup bill block book borrow browse buy calculate call cancel capture change chat check checkout choose claim '
    + 'clean close collect comment compare complete compose compute configure confirm connect consult contact control convert create curate '
    + 'deactivate decide decline define delete deliver deposit design detect disable dispatch display dispense distribute do donate download draft edit '
    + 'enable end enrol enroll enter escalate estimate evaluate examine exchange export extend file fill filter find finish follow forecast forward generate get '
    + 'give grade grant handle help hire import inform input inspect install invite invoice issue join keep leave lend link list load lock log login '
    + 'logout look maintain make manage map mark match measure merge modify monitor move notify obtain offer open operate order organize organise '
    + 'pack participate pay perform pick place plan post predict prepare prescribe print prioritize process produce provide publish purchase '
    + 'push query raise rank rate read reassign receive recommend reconcile record recover redeem refund register reject release reload remind '
    + 'remove renew rent reorder repair replace reply report request reschedule reserve reset resolve respond restock restore resume retrieve return '
    + 'review revoke rotate run save scan schedule score screen search see select sell send serve set setup share ship show sign simulate skip sort split pause unpause '
    + 'start stop store submit subscribe suggest supply suspend swap switch sync synchronise synchronize take tag test top track trade train transfer translate '
    + 'triage unlock unsubscribe update upgrade upload use validate verify view visit vote waitlist watch withdraw write').split(' ');
  // Động từ "rõ là hành động" — nhãn luồng dữ liệu không được bắt đầu bằng chúng (luồng = DỮ LIỆU, không phải hành động)
  var HANH = ('accept add approve assign browse calculate cancel choose confirm create delete edit enter generate get give inform maintain manage '
    + 'make modify notify pay place provide receive register reject remove select send submit validate verify ask').split(' ');
  // Danh động từ hợp lệ làm tên trạng thái (không phải hoạt động)
  var GER_OK = 'pending waiting booking ongoing outstanding missing remaining upcoming incoming outgoing existing'.split(' ');
  function goc3(w) { // places → place, sends → send, approves → approve, pushes → push
    var r = [w];
    if (/ies$/.test(w)) r.push(w.slice(0, -3) + 'y');
    if (/es$/.test(w)) r.push(w.slice(0, -2));
    if (/s$/.test(w)) r.push(w.slice(0, -1));
    return r;
  }
  function laDongTu(w) { w = C.norm(w); return VERB.indexOf(w) >= 0; }
  function laHanhDong(w) { // nhãn luồng bắt đầu bằng động từ hành động (cả dạng ngôi thứ ba)
    w = C.norm(w);
    return goc3(w).some(function (x) { return HANH.indexOf(x) >= 0; });
  }
  function laHoatDongIng(w) { // "Processing", "Validating", "Picking" ⇒ hoạt động, không phải trạng thái
    w = C.norm(w);
    if (!/ing$/.test(w) || GER_OK.indexOf(w) >= 0) return false;
    var s = w.slice(0, -3);
    var c = [s, s + 'e'];
    if (/(.)\1$/.test(s)) c.push(s.slice(0, -1));
    return c.some(function (x) { return VERB.indexOf(x) >= 0; });
  }
  C.laDongTu = laDongTu; C.laHanhDong = laHanhDong; C.laHoatDongIng = laHoatDongIng;
  return true;
}

/* ═══════════════════════════ Mermaid flowchart (context diagram, DFD) ═══════════════════════════ */
export function P_FLOW(C) {
  var HINH = [
    ['tron', /^\(\(\s*"?([^"]*?)"?\s*\)\)/],
    ['kho', /^\[\(\s*"?([^"]*?)"?\s*\)\]/],
    ['svd', /^\(\[\s*"?([^"]*?)"?\s*\]\)/],
    ['con', /^\[\[\s*"?([^"]*?)"?\s*\]\]/],
    ['hcn', /^\[\s*"?([^"\]]*?)"?\s*\]/],
    ['bo', /^\(\s*"?([^"()]*?)"?\s*\)/],
    ['thoi', /^\{\s*"?([^"}]*?)"?\s*\}/],
    ['khac', /^>\s*"?([^"\]]*?)"?\s*\]/],
  ];
  var LINK1 = /^\s*(<)?(-{2,}>|-{3,}|-\.+->|-\.+-|={2,}>|={3,}|--x|--o)\s*(?:\|\s*"?([^|"]*?)"?\s*\|)?\s*/;
  var LINK2 = /^\s*(<)?(--|==|-\.)\s*"?([^"<>|]+?)"?\s*(-{2,}>|-{3,}|\.+->|\.+-|={2,}>|={3,})\s*/;
  return function parse(src) {
    var nut = {}, canh = [], loi = [], thuTu = [];
    function docNut(s, so) {
      var mm = /^\s*([A-Za-z_][\w-]*)/.exec(s);
      if (!mm) return null;
      var id = mm[1], rest = s.slice(mm[0].length), hinh = null, nhan = null;
      for (var i = 0; i < HINH.length; i++) {
        var h = HINH[i][1].exec(rest);
        if (h) { hinh = HINH[i][0]; nhan = h[1].trim(); rest = rest.slice(h[0].length); break; }
      }
      cho.push({ id: id, nhan: nhan, hinh: hinh, so: so });
      return { id: id, rest: rest };
    }
    function ghiNut(x) {
      var id = x.id, hinh = x.hinh, nhan = x.nhan, so = x.so;
      if (!nut[id]) { nut[id] = { id: id, nhan: nhan == null ? id : nhan, hinh: hinh || 'chua', dong: so }; thuTu.push(id); }
      else if (hinh) {
        if (nut[id].hinh === 'chua') { nut[id].hinh = hinh; nut[id].nhan = nhan; }
        else if (nut[id].hinh !== hinh) loi.push(C.m('line ' + so + ': node "' + id + '" is declared twice with different shapes', 'dòng ' + so + ': nút "' + id + '" khai hai lần với hai hình khác nhau'));
      }
    }
    var cho = [];
    var ds = C.dong(src), daoDau = false;
    for (var i = 0; i < ds.length; i++) {
      var so = i + 1;
      var dongs = ds[i].split(';');
      for (var k = 0; k < dongs.length; k++) {
        var s = dongs[k].replace(/%%.*$/, '').trim();
        if (!s) continue;
        if (/^(flowchart|graph)\b/i.test(s)) { daoDau = true; continue; }
        if (/^(classDef|class|style|linkStyle|click|direction)\b/.test(s)) continue;
        if (/^subgraph\b/.test(s) || /^end$/.test(s)) { loi.push(C.m('line ' + so + ': subgraph is not used in these models — draw every node at the top level', 'dòng ' + so + ': không dùng subgraph trong các mô hình này — vẽ mọi nút ở mức ngoài cùng')); continue; }
        cho = [];
        var canhDong = [];
        var a = docNut(s, so);
        if (!a) { loi.push(C.kd(so, s)); continue; }
        var rest = a.rest, truoc = a.id, ok = true;
        while (rest.trim()) {
          var l = LINK1.exec(rest), nhan = null, op = null, nguoc = false;
          if (l) { nguoc = !!l[1]; op = l[2]; nhan = l[3] == null ? null : l[3]; }
          else {
            l = LINK2.exec(rest);
            if (l) { nguoc = !!l[1]; op = l[4]; nhan = l[3]; }
          }
          if (!l) { ok = false; break; }
          rest = rest.slice(l[0].length);
          var b = docNut(rest, so);
          if (!b) { ok = false; break; }
          var coMui = />$/.test(op) || /x$|o$/.test(op);
          canhDong.push({ tu: truoc, den: b.id, nhan: nhan == null ? '' : String(nhan).trim(), huong: nguoc && coMui ? 'hai' : (coMui ? 'mot' : 'khong'), dong: so });
          truoc = b.id; rest = b.rest;
        }
        if (ok) { cho.forEach(ghiNut); canhDong.forEach(function (c) { canh.push(c); }); }
        if (!ok) loi.push(C.kd(so, s, 'use A -->|label| B'));
      }
    }
    if (!daoDau) loi.unshift(C.m('the first line must be "flowchart LR" (or "graph LR")', 'dòng đầu phải là "flowchart LR" (hoặc "graph LR")'));
    return { nut: nut, ds: thuTu.map(function (id) { return nut[id]; }), canh: canh, loi: loi };
  };
}

/* ═══════════════════════════════ PlantUML use case diagram ═══════════════════════════════ */
export function P_UC(C) {
  return function parse(src) {
    var act = {}, uc = {}, qh = [], bien = [], loi = [], sau = [];
    var sau2 = 0; // độ sâu khối rectangle/package
    var chu = String(src).replace(/\r/g, '').replace(/\/'[\s\S]*?'\//g, function (x) { return x.replace(/[^\n]/g, ' '); });
    var ds = chu.split('\n');
    var trongNote = false, trongSkin = 0, coBatDau = false;
    function khoaTen(t) { return 'n:' + C.norm(t); }
    function dinhNghia(loai, ten, alias, so) {
      ten = String(ten).trim();
      var bang = loai === 'actor' ? act : uc;
      if (!alias) { for (var k0 in bang) if (C.norm(bang[k0].ten) === C.norm(ten)) return k0; }
      var key = alias || khoaTen(ten);
      if (!bang[key]) bang[key] = { key: key, ten: ten, trong: sau2 > 0, dong: so };
      return key;
    }
    // một "đầu" của quan hệ (sau khi che): \u0001n\u0001 = (Tên) · \u0002n\u0002 = :Tên: · \u0003n\u0003 = "Tên" · alias
    var che = [];
    function dau(s) {
      s = s.trim();
      var mm;
      if ((mm = /^\u0001(\d+)\u0001$/.exec(s))) return { loai: 'uc', ten: che[+mm[1]] };
      if ((mm = /^\u0002(\d+)\u0002$/.exec(s))) return { loai: 'actor', ten: che[+mm[1]] };
      if ((mm = /^\u0003(\d+)\u0003$/.exec(s))) return { loai: 'ten', ten: che[+mm[1]] };
      if ((mm = /^([A-Za-z_]\w*)$/.exec(s))) return { loai: 'id', ten: mm[1] };
      return null;
    }
    function boc(s) {
      return s.replace(/\(([^()]+)\)/g, function (_, n) { che.push(n); return '\u0001' + (che.length - 1) + '\u0001'; })
        .replace(/"([^"]+)"/g, function (_, n) { che.push(n); return '\u0003' + (che.length - 1) + '\u0003'; })
        .replace(/(^|[\s>.-]):([^:]+):(?=\s|$|[-.<])/g, function (_, p, n) { che.push(n); return p + '\u0002' + (che.length - 1) + '\u0002'; });
    }
    var OP = /^(.+?)\s*(<\|?[-.]+(?:(?:up|down|left|right|u|d|l|r)[-.]+)?(?:\|?>)?|[-.]+(?:(?:up|down|left|right|u|d|l|r)[-.]+)?(?:\|?>)?)\s*([^-.<>|].*)$/;
    for (var i = 0; i < ds.length; i++) {
      var so = i + 1;
      var s = ds[i].trim();
      if (!s || /^'/.test(s)) continue;
      if (trongNote) { if (/^end\s*note$/i.test(s)) trongNote = false; continue; }
      if (trongSkin) { if (/\{\s*$/.test(s)) trongSkin++; if (/^\}/.test(s)) trongSkin--; continue; }
      if (/^@startuml/i.test(s)) { coBatDau = true; continue; }
      if (/^@enduml/i.test(s)) continue;
      if (/^(left to right direction|top to bottom direction|title\b|caption\b|header\b|footer\b|legend\b|endlegend|hide\b|show\b|!|scale\b|actorStyle\b)/i.test(s)) continue;
      if (/^skinparam\b/i.test(s)) { if (/\{\s*$/.test(s)) trongSkin = 1; continue; }
      if (/^note\b/i.test(s)) { if (!/:/.test(s)) trongNote = true; continue; }
      var mm;
      if ((mm = /^(rectangle|package|frame|node|folder|cloud)\s+(?:"([^"]+)"|([^\s{]+))(?:\s+as\s+\w+)?(?:\s+<<[^>]*>>)?\s*\{\s*$/i.exec(s))) {
        sau2++; bien.push({ ten: mm[2] || mm[3], loai: mm[1].toLowerCase(), dong: so }); continue;
      }
      if (/^\}$/.test(s)) { if (sau2 > 0) sau2--; else loi.push(C.m('line ' + so + ': "}" without an open rectangle', 'dòng ' + so + ': "}" thừa')); continue; }
      // actor
      if ((mm = /^actor\/?\s+(.+)$/i.exec(s))) {
        var r = mm[1].replace(/<<[^>]*>>/g, '').replace(/#\S+/g, '').trim(), t = null, al = null, x;
        if ((x = /^"([^"]+)"\s+as\s+([\w.]+)$/.exec(r)) || (x = /^:([^:]+):\s+as\s+([\w.]+)$/.exec(r))) { t = x[1]; al = x[2]; }
        else if ((x = /^([\w.]+)\s+as\s+"([^"]+)"$/.exec(r)) || (x = /^([\w.]+)\s+as\s+:([^:]+):$/.exec(r))) { t = x[2]; al = x[1]; }
        else if ((x = /^([\w.]+)\s+as\s+([\w.]+)$/.exec(r))) { t = x[1]; al = x[2]; }
        else if ((x = /^"([^"]+)"$/.exec(r)) || (x = /^:([^:]+):$/.exec(r))) { t = x[1]; }
        else if ((x = /^([\w.]+)$/.exec(r))) { t = x[1]; al = x[1]; }
        if (t == null) { loi.push(C.kd(so, s)); continue; }
        dinhNghia('actor', t, al, so); continue;
      }
      // usecase
      if ((mm = /^usecase\/?\s+(.+)$/i.exec(s)) || (mm = /^(\([^)]+\)\s+as\s+[\w.]+)$/.exec(s))) {
        var r2 = mm[1].replace(/<<[^>]*>>/g, '').replace(/#\S+/g, '').trim(), t2 = null, al2 = null, y;
        if ((y = /^"([^"]+)"\s+as\s+([\w.]+)$/.exec(r2)) || (y = /^\(([^)]+)\)\s+as\s+([\w.]+)$/.exec(r2))) { t2 = y[1]; al2 = y[2]; }
        else if ((y = /^([\w.]+)\s+as\s+"([^"]+)"$/.exec(r2)) || (y = /^([\w.]+)\s+as\s+\(([^)]+)\)$/.exec(r2))) { t2 = y[2]; al2 = y[1]; }
        else if ((y = /^([\w.]+)\s+as\s+([\w.]+)$/.exec(r2))) { t2 = y[1]; al2 = y[2]; }
        else if ((y = /^"([^"]+)"$/.exec(r2)) || (y = /^\(([^)]+)\)$/.exec(r2))) { t2 = y[1]; }
        else if ((y = /^([\w.]+)$/.exec(r2))) { t2 = y[1]; al2 = y[1]; }
        if (t2 == null) { loi.push(C.kd(so, s)); continue; }
        dinhNghia('uc', t2, al2, so); continue;
      }
      if ((mm = /^\(([^)]+)\)$/.exec(s))) { dinhNghia('uc', mm[1], null, so); continue; }
      if ((mm = /^:([^:]+):\s+as\s+(\w+)$/.exec(s))) { dinhNghia('actor', mm[1], mm[2], so); continue; }
      if ((mm = /^:([^:]+):$/.exec(s))) { dinhNghia('actor', mm[1], null, so); continue; }
      // quan hệ: che (Tên) "Tên" :Tên: rồi mới tách nhãn và tìm mũi tên
      var nhan = '';
      var s2 = boc(s);
      var ci = s2.indexOf(':');
      if (ci >= 0) { nhan = s2.slice(ci + 1).trim(); s2 = s2.slice(0, ci).trim(); }
      var o = OP.exec(s2);
      if (o) {
        var A = dau(o[1]), B = dau(o[3]);
        if (A && B) {
          sau.push({ A: A, B: B, op: o[2], nhan: nhan, so: so, sau: sau2 });
          // tham chiếu (Tên)/:Tên: ngay tại chỗ ⇒ định nghĩa với độ sâu hiện tại
          [A, B].forEach(function (d) { if (d.loai === 'uc') dinhNghia('uc', d.ten, null, so); else if (d.loai === 'actor') dinhNghia('actor', d.ten, null, so); });
          continue;
        }
      }
      loi.push(C.kd(so, s));
    }
    if (sau2 > 0) loi.push(C.m('a rectangle "{" is never closed with "}"', 'thiếu "}" đóng rectangle'));
    // giải tên ⇒ khoá
    function giai(d) {
      if (d.loai === 'uc') return { k: 'uc', key: dinhNghia('uc', d.ten, null, 0) };
      if (d.loai === 'actor') return { k: 'actor', key: dinhNghia('actor', d.ten, null, 0) };
      if (d.loai === 'id') {
        if (act[d.ten]) return { k: 'actor', key: d.ten };
        if (uc[d.ten]) return { k: 'uc', key: d.ten };
      }
      var nk = 'n:' + C.norm(d.ten);
      if (act[nk]) return { k: 'actor', key: nk };
      if (uc[nk]) return { k: 'uc', key: nk };
      for (var k1 in act) if (C.norm(act[k1].ten) === C.norm(d.ten)) return { k: 'actor', key: k1 };
      for (var k2 in uc) if (C.norm(uc[k2].ten) === C.norm(d.ten)) return { k: 'uc', key: k2 };
      // PlantUML: tên trần chưa khai trong quan hệ ⇒ actor
      act[d.loai === 'id' ? d.ten : nk] = { key: d.loai === 'id' ? d.ten : nk, ten: d.ten, trong: false, dong: 0, ngam: true };
      return { k: 'actor', key: d.loai === 'id' ? d.ten : nk };
    }
    sau.forEach(function (q) {
      var a = giai(q.A), b = giai(q.B), op = q.op, nh = C.norm(q.nhan);
      var nguoc = /^</.test(op);
      var loai;
      if (/\|>|<\|/.test(op)) loai = 'gen';
      else if (/include/.test(nh)) loai = 'include';
      else if (/extend/.test(nh)) loai = 'extend';
      else loai = 'assoc';
      var tu2 = nguoc ? b : a, den = nguoc ? a : b;
      qh.push({ loai: loai, tu: tu2.key, tuK: tu2.k, den: den.key, denK: den.k, net: /\./.test(op) ? 'dut' : 'lien', coMui: />|</.test(op), nhan: q.nhan, dong: q.so });
    });
    var actors = Object.keys(act).map(function (k) { return act[k]; });
    var ucs = Object.keys(uc).map(function (k) { return uc[k]; });
    return { actors: actors, ucs: ucs, qh: qh, bien: bien, loi: loi, coBatDau: coBatDau };
  };
}

/* ═══════════════════════════════ Mermaid erDiagram ═══════════════════════════════ */
export function P_ER(C) {
  var TRAI = { '|o': [0, 1], '||': [1, 1], '}o': [0, 'N'], '}|': [1, 'N'] };
  var PHAI = { 'o|': [0, 1], '||': [1, 1], 'o{': [0, 'N'], '|{': [1, 'N'] };
  var TEN = '([A-Za-z][\\w-]*(?:\\["[^"]*"\\])?|"[^"]+")';
  var RE_QH = new RegExp('^' + TEN + '\\s*(\\|o|\\|\\||\\}o|\\}\\|)(--|\\.\\.)(o\\||\\|\\||o\\{|\\|\\{)\\s*' + TEN + '\\s*:\\s*(.*)$');
  function tenCua(t) {
    var mm = /^([A-Za-z][\w-]*)\["([^"]*)"\]$/.exec(t);
    if (mm) return { id: mm[1], ten: mm[2] };
    if (/^"/.test(t)) return { id: t.slice(1, -1), ten: t.slice(1, -1) };
    return { id: t, ten: t };
  }
  return function parse(src) {
    var tt = {}, qh = [], loi = [], dau = false, cur = null;
    function the(t, so) {
      var x = tenCua(t);
      if (!tt[x.id]) tt[x.id] = { id: x.id, ten: x.ten, thuocTinh: [], dong: so };
      else if (x.ten !== x.id) tt[x.id].ten = x.ten;
      return tt[x.id];
    }
    var ds = C.dong(src);
    for (var i = 0; i < ds.length; i++) {
      var so = i + 1;
      var s = ds[i].replace(/%%.*$/, '').trim();
      if (!s) continue;
      if (cur) {
        if (/^\}$/.test(s)) { cur = null; continue; }
        var s4 = s.replace(/"[^"]*"\s*$/, '').trim();
        var tk = s4.split(/[\s,]+/).filter(Boolean);
        var khoa = [];
        while (tk.length > 1 && /^(PK|FK|UK)$/i.test(tk[tk.length - 1])) khoa.unshift(tk.pop().toUpperCase());
        if (!tk.length || tk.length > 2 || !tk.every(function (x) { return /^[\w()[\]*-]+$/.test(x); })) { loi.push(C.kd(so, s, 'attribute: type name PK')); continue; }
        var ten = tk.length === 2 ? tk[1] : tk[0], kieu = tk.length === 2 ? tk[0] : '';
        cur.thuocTinh.push({ ten: ten, kieu: kieu, khoa: khoa, dong: so });
        continue;
      }
      if (/^erDiagram\b/.test(s)) { dau = true; continue; }
      if (/^(direction|title|classDef|class|style)\b/.test(s)) continue;
      var mb = new RegExp('^' + TEN + '\\s*\\{\\s*$').exec(s);
      if (mb) { cur = the(mb[1], so); continue; }
      var q = RE_QH.exec(s);
      if (q) {
        var A = the(q[1], so), B = the(q[5], so);
        var L = TRAI[q[2]], R = PHAI[q[4]];
        qh.push({ a: A.id, b: B.id, minA: L[0], maxA: L[1], minB: R[0], maxB: R[1], xac: q[3] === '--', nhan: q[6].replace(/^"|"$/g, '').trim(), dong: so });
        continue;
      }
      if (new RegExp('^' + TEN + '$').test(s)) { the(s, so); continue; }
      loi.push(C.kd(so, s, 'relationship: A ||--o{ B : verb'));
    }
    if (cur) loi.push(C.m('an entity block "{" is never closed', 'khối thực thể "{" chưa đóng'));
    if (!dau) loi.unshift(C.m('the first line must be "erDiagram"', 'dòng đầu phải là "erDiagram"'));
    return { tt: Object.keys(tt).map(function (k) { return tt[k]; }), qh: qh, loi: loi };
  };
}

/* ═══════════════════════════ Mermaid stateDiagram-v2 / PlantUML state ═══════════════════════════ */
export function P_STATE(C) {
  return function parse(src) {
    var st = {}, ch = [], loi = [], dau = false, trongNote = false;
    function the(id, so) {
      if (id === '[*]') return id;
      if (!st[id]) st[id] = { id: id, ten: id, gia: false, moTa: '', dong: so };
      return id;
    }
    var ds = C.dong(src);
    for (var i = 0; i < ds.length; i++) {
      var so = i + 1;
      var s = ds[i].replace(/%%.*$/, '').trim();
      if (!s || /^'/.test(s)) continue;
      if (trongNote) { if (/^end\s*note$/i.test(s)) trongNote = false; continue; }
      if (/^stateDiagram(-v2)?\b/.test(s)) { dau = true; continue; }
      if (/^@startuml/i.test(s)) { dau = true; continue; }
      if (/^(@enduml|direction\b|classDef\b|class\b|hide\b|skinparam\b|title\b|scale\b|left to right direction)/i.test(s)) continue;
      if (/^note\b/i.test(s)) { if (!/:/.test(s)) trongNote = true; continue; }
      var mm;
      if ((mm = /^state\s+"([^"]+)"\s+as\s+([\w]+)\s*(<<\w+>>)?\s*(\{)?$/.exec(s)) || (mm = /^state\s+([\w]+)\s+as\s+"([^"]+)"\s*(<<\w+>>)?\s*(\{)?$/.exec(s))) {
        var id = /^state\s+"/.test(s) ? mm[2] : mm[1], ten = /^state\s+"/.test(s) ? mm[1] : mm[2];
        the(id, so); st[id].ten = ten;
        if (mm[3] && /choice|fork|join/.test(mm[3])) st[id].gia = true;
        if (mm[4]) loi.push(C.m('line ' + so + ': composite states are not used here — draw a flat state machine', 'dòng ' + so + ': không dùng trạng thái lồng — vẽ máy trạng thái phẳng'));
        continue;
      }
      if ((mm = /^state\s+([\w]+)\s*(<<\w+>>)?\s*(\{)?$/.exec(s))) {
        the(mm[1], so);
        if (mm[2] && /choice|fork|join/.test(mm[2])) st[mm[1]].gia = true;
        if (mm[3]) loi.push(C.m('line ' + so + ': composite states are not used here — draw a flat state machine', 'dòng ' + so + ': không dùng trạng thái lồng — vẽ máy trạng thái phẳng'));
        continue;
      }
      if (/^\}$/.test(s)) continue;
      if ((mm = /^(\[\*\]|[\w]+)\s*(-+>)\s*(\[\*\]|[\w]+)\s*(?::\s*(.*))?$/.exec(s))) {
        var a = the(mm[1], so), b = the(mm[3], so), nh = (mm[4] || '').trim();
        var ev = nh, gd = '', hd = '';
        var g = /\[([^\]]*)\]/.exec(nh);
        if (g) gd = g[1].trim();
        var sl = nh.indexOf('/');
        if (sl >= 0) { hd = nh.slice(sl + 1).trim(); }
        ev = nh.replace(/\[[^\]]*\]/, '').split('/')[0].trim();
        ch.push({ tu: a, den: b, nhan: nh, suKien: ev, guard: gd, hanhDong: hd, dong: so });
        continue;
      }
      if ((mm = /^([\w]+)\s*:\s*(.*)$/.exec(s))) { the(mm[1], so); st[mm[1]].moTa = mm[2]; continue; }
      if ((mm = /^([\w]+)$/.exec(s))) { the(mm[1], so); continue; }
      loi.push(C.kd(so, s, 'transition: A --> B : event [guard] / action'));
    }
    if (!dau) loi.unshift(C.m('the first line must be "stateDiagram-v2"', 'dòng đầu phải là "stateDiagram-v2"'));
    return { st: Object.keys(st).map(function (k) { return st[k]; }), ch: ch, loi: loi };
  };
}

/* ═══════════════════════════ PlantUML activity (swimlane) ═══════════════════════════
 * Hỗ trợ: |Lane| · start · stop/end · :hành động; (một dòng) · if (…) then (…) · elseif (…) then (…) · else (…) · endif
 * · repeat / repeat while (…) · while (…) … endwhile · fork / fork again / end fork. Ra danh sách hành động theo thứ tự xuất hiện,
 * mỗi cái gắn lane + mức lồng if, cùng các quyết định (có nhánh else hay không). */
export function P_ACT(C) {
  return function parse(src) {
    var lanes = [], buoc = [], qd = [], loi = [], lane = null, chong = [], coStart = false, coStop = false;
    var ds = C.dong(src);
    for (var i = 0; i < ds.length; i++) {
      var so = i + 1;
      var s = ds[i].trim();
      if (!s || /^'/.test(s)) continue;
      if (/^@(start|end)uml/i.test(s) || /^(title|skinparam|note|end note|floating note|partition|\}|detach|kill)\b/i.test(s)) continue;
      var mm;
      if ((mm = /^\|(?:#\w+\|)?([^|]+)\|$/.exec(s))) { lane = mm[1].trim(); if (lanes.indexOf(lane) < 0) lanes.push(lane); continue; }
      if (/^start$/i.test(s)) { coStart = true; continue; }
      if (/^(stop|end)$/i.test(s)) { coStop = true; buoc.push({ loai: 'stop', lane: lane, dong: so }); continue; }
      if ((mm = /^:([\s\S]*?);$/.exec(s))) { buoc.push({ loai: 'hd', ten: mm[1].trim(), lane: lane, sau: chong.length, dong: so }); continue; }
      if ((mm = /^if\s*\((.*)\)\s*then\s*(?:\((.*)\))?$/i.exec(s))) { var d = { dk: mm[1], nhan: [mm[2] || ''], coElse: false, lane: lane, dong: so }; qd.push(d); chong.push(d); continue; }
      if ((mm = /^elseif\s*\((.*)\)\s*then\s*(?:\((.*)\))?$/i.exec(s))) { if (chong.length) chong[chong.length - 1].nhan.push(mm[2] || ''); continue; }
      if ((mm = /^else\s*(?:\((.*)\))?$/i.exec(s))) { if (chong.length) { chong[chong.length - 1].coElse = true; chong[chong.length - 1].nhan.push(mm[1] || ''); } continue; }
      if (/^end\s*if$/i.test(s)) { if (chong.length) chong.pop(); else loi.push(C.m('line ' + so + ': endif without if', 'dòng ' + so + ': endif thừa')); continue; }
      if (/^(repeat|fork|fork again|end fork|end merge|endwhile|backward)\b/i.test(s) || /^(while|repeat while)\s*\(/i.test(s)) continue;
      loi.push(C.kd(so, s, 'action: ":Do something;"'));
    }
    if (chong.length) loi.push(C.m('an "if" is never closed with "endif"', 'thiếu "endif"'));
    return { lanes: lanes, buoc: buoc, qd: qd, loi: loi, coStart: coStart, coStop: coStop };
  };
}

/* ═══════════════════════════════ ghép thư viện + dựng kiểm ═══════════════════════════════ */
const PHAN = { tu: ['tuVung', P_TU], flow: ['pf', P_FLOW], uc: ['pu', P_UC], er: ['pe', P_ER], state: ['ps', P_STATE], act: ['pa', P_ACT] };
const _boNho = new Map();
/** Chuỗi BIỂU THỨC dựng thư viện trong realm: (function(){ var C = CORE(); C.pf = P_FLOW(C); … return C; })() */
export function thuVien(phan = []) {
  phan = phan.filter((x, i, a) => a.indexOf(x) === i);
  const khoa = phan.join(',');
  if (_boNho.has(khoa)) return _boNho.get(khoa);
  const s = `(function(){var C=${gon(CORE)}();${phan.map((p) => `C.${PHAN[p][0]}=${gon(PHAN[p][1])}(C);`).join('')}return C;})()`;
  _boNho.set(khoa, s);
  return s;
}

/**
 * Một kiểm "tuỳ ý" dùng thư viện mô hình.
 *   fn(L, C, A) ⇒ 'OK' | lời giải thích. L = thư viện, C = cấu hình (JSON), A = { BIEN: giá trị người học khai }.
 *   bien = tên các biến toàn cục người học khai (vd ['CONTEXT_DIAGRAM']).
 */
export function kiemMH(moTa, fn, { C = {}, bien = [], phan = [], nhom, an } = {}) {
  const canTu = /laDongTu|laHanhDong|laHoatDongIng/.test(String(fn));
  phan = canTu ? ['tu', ...phan] : phan.filter((x) => x !== 'tu');
  const A = `{${bien.map((b) => `${JSON.stringify(b)}:(typeof ${b}!=='undefined'?${b}:undefined)`).join(',')}}`;
  return {
    moTa,
    chuanBi: `const __KQ = (function () { try { var L = ${thuVien(phan)}; var A = ${A}; return (${gon(fn)})(L, ${JSON.stringify(C)}, A); } catch (e) { return (e && e.name === 'ReferenceError' ? 'missing: ' : 'error: ') + (e && e.message ? e.message : String(e)); } })();`,
    goi: '__KQ', mongDoi: 'OK',
    ...(nhom ? { nhom } : {}), ...(an ? { an: true } : {}),
  };
}

/** Chạy thử một hàm kiểm ngay trong Node (dùng khi soạn đề). */
export function thuNode(fn, C, A, phan = []) {
  const L = CORE();
  P_TU(L);
  for (const p of phan) L[PHAN[p][0]] = PHAN[p][1](L);
  return fn(L, C, A);
}
