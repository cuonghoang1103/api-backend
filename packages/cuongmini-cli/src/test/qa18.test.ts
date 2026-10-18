/**
 * Hồi quy QA độc lập 18/10/2026 — chạy CLI 0.4.0 trong PTY thật với backend local + model thật (và máy chủ kịch bản
 * cho lõi THẬT), đi đúng đường người dùng. Mỗi test ứng với một lỗi đã thấy trên màn hình.
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { datNgonNgu } from '../i18n';
import { KhoChat } from '../kho';
import { moModel, tenModel } from '../congModel';
import { bocDong, veMarkdown } from '../markdown';
import { boMau } from '../mau';
import { chanDoanEn } from '../moTaHaiNgu';
import { dichDanhThuc, dichLyDo, dichMoTaCho, dichTomTat, soNhieu } from '../trangThai';
import { rutGiua, veManMoDau, veMuc } from '../veBang';

const goc = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const TV = /[ăâđêôơưàáạảãầấậẩẫằắặẳẵèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

test('MỌI tóm tắt tool tĩnh của lõi đều dịch hết sang tiếng Anh (QA: "gửi failed", "0 dirs, 2 file")', () => {
  datNgonNgu('en');
  const thuMuc = path.join(goc, 'desktop/src/main/agent');
  const tep = ['loop.ts', 'tools.ts', 'ghiNote.ts', 'phien.ts', 'mcp.ts', 'choHen.ts', 'viecPhuGhi.ts', 'hoiLuaChon.ts', 'phienMang.ts', 'gitViet.ts', 'lenhNen.ts', 'xinPhep.ts'];
  const con: string[] = [];
  for (const f of tep) {
    let src = '';
    try { src = readFileSync(path.join(thuMuc, f), 'utf8'); } catch { continue; }
    for (const m of src.matchAll(/tomTat: '([^']*)'/g)) {
      const en = dichTomTat(m[1]!);
      if (TV.test(en)) con.push(`${f}: "${m[1]}" ⇒ "${en}"`);
    }
  }
  assert.deepEqual(con, []);
  assert.equal(dichTomTat('1 kết quả'), '1 result');
  assert.equal(dichTomTat('0 thư mục, 2 file'), '0 dirs, 2 files');
  assert.equal(dichTomTat('1 phiên'), '1 session');
  assert.equal(dichTomTat('gửi hỏng'), 'send failed');
  assert.equal(dichTomTat('cổng AI đang quá tải — chờ 5s rồi thử lại (lần 1/3)'), 'AI gateway overloaded — retrying in 5s (attempt 1/3)');
  assert.equal(soNhieu('3 file · 1 lines'), '3 files · 1 line');
  datNgonNgu('vi');
  assert.equal(dichTomTat('1 kết quả'), '1 kết quả');
});

test('lý do lệnh nguy hiểm (lenh.ts) đều có bản tiếng Anh', () => {
  datNgonNgu('en');
  const src = readFileSync(path.join(goc, 'desktop/src/main/agent/lenh.ts'), 'utf8');
  const ds = [...src.matchAll(/lyDo: '([^']*)'/g), ...src.matchAll(/lyDo\.push\('([^']*)'\)/g), ...src.matchAll(/lyDo: \['([^']*)'\]/g)].map((m) => m[1]!);
  assert.ok(ds.length > 30, `quét được ${ds.length}`);
  const thieu = ds.filter((l) => TV.test(dichLyDo(l)));
  assert.deepEqual(thieu, []);
  datNgonNgu('vi');
});

test('mô tả model của máy chủ (models.ts, cauHinh.ts) đều có bản tiếng Anh; tên chính hãng không còn "chính hãng"', () => {
  datNgonNgu('en');
  const thieu: string[] = [];
  for (const f of ['src/services/agent/models.ts', 'src/services/agent/anthropicChinhHang/cauHinh.ts']) {
    for (const m of readFileSync(path.join(goc, f), 'utf8').matchAll(/^\s+mo: '([^']*)',$/gm)) if (TV.test(moModel(m[1]!))) thieu.push(m[1]!);
  }
  assert.deepEqual(thieu, []);
  assert.equal(tenModel({ ten: 'Claude Sonnet 5.5 · chính hãng', cong: 'anthropic' }), 'Claude Sonnet 5.5 · official');
  datNgonNgu('vi');
});

test('chờ / tự thức / chẩn đoán: tiếng Anh không lẫn tiếng Việt', () => {
  datNgonNgu('en');
  assert.equal(dichMoTaCho('3 giây'), '3s');
  assert.equal(dichMoTaCho('lệnh nền n1 in ra /ready/'), 'background n1 to print /ready/');
  assert.equal(dichDanhThuc('[Đánh thức — hẹn #h1 lúc 07:26] Kiểm lại build'), '[Wake-up — schedule #h1 at 07:26] Kiểm lại build');
  const cd = chanDoanEn([
    { ten: 'Mạng', muc: 'ok', chiTiet: 'Có mạng.' }, { ten: 'Máy chủ', muc: 'ok', chiTiet: 'Trả lời sau 34ms.' },
    { ten: 'Cổng AI', muc: 'canh', chiTiet: 'Cổng chính đang hỏng.' }, { ten: 'Thư mục dự án', muc: 'ok', chiTiet: '/a/b — đọc được, KHÔNG ghi được.' },
  ]);
  assert.doesNotMatch(cd, TV, cd);
  assert.match(cd, /\/a\/b — readable, NOT writable\./);
  datNgonNgu('vi');
});

test('tiền KHÔNG mất khi dừng giữa lượt (QA: /cost ~$0.000 khi sổ máy chủ 0,84 $) hoặc lượt lỗi', () => {
  datNgonNgu('en');
  const k = new KhoChat(true);
  k.batDauLuot('a', 0, 'a');
  for (let i = 0; i < 6; i++) k.xuLy({ loai: 'tienTrinh', tokenRa: 10, tokenVao: 45000, tienUsd: 0.14 });
  k.xuLy({ loai: 'huy' });
  assert.ok(Math.abs(k.S.tienPhien - 0.84) < 1e-9, String(k.S.tienPhien));
  const ket = k.S.bang.find((m) => m.loai === 'ketLuot');
  assert.match(ket && ket.loai === 'ketLuot' ? ket.ghiChu : '', /interrupted · ~\$0\.840/);
  k.batDauLuot('b', 0, 'b');
  k.xuLy({ loai: 'tienTrinh', tokenRa: 10, tokenVao: 1, tienUsd: 0.1 });
  k.xuLy({ loai: 'loi', ma: 'LLM_ERROR', thongDiep: 'hỏng' });
  assert.ok(Math.abs(k.S.tienPhien - 0.94) < 1e-9, String(k.S.tienPhien));
  k.batDauLuot('c', 0, 'c');
  k.xuLy({ loai: 'tienTrinh', tokenRa: 10, tokenVao: 1, tienUsd: 0.05 });
  k.xuLy({ loai: 'xong', tienUsd: 0.05, soFileDaSua: 0 });
  assert.ok(Math.abs(k.S.tienPhien - 0.99) < 1e-9, 'xong không cộng hai lần');
  datNgonNgu('vi');
});

test('kế hoạch đã XONG của lượt trước không treo dưới lượt mới', () => {
  const k = new KhoChat(true);
  k.batDauLuot('a', 0, 'a');
  k.xuLy({ loai: 'keHoach', viec: [{ ten: 'x', trangThai: 'xong' }, { ten: 'y', trangThai: 'xong' }] });
  k.xuLy({ loai: 'xong', tienUsd: 0, soFileDaSua: 0 });
  k.batDauLuot('b', 0, 'b');
  assert.equal(k.S.keHoach.length, 0);
  k.xuLy({ loai: 'keHoach', viec: [{ ten: 'x', trangThai: 'dang' }] });
  k.xuLy({ loai: 'xong', tienUsd: 0, soFileDaSua: 0 });
  k.batDauLuot('c', 0, 'c');
  assert.equal(k.S.keHoach.length, 1, 'kế hoạch còn việc dở thì giữ');
});

test('dòng tool: tham số chính trước đường dẫn; từ chối không in lời dặn model; giao việc phụ không in khối trùng', () => {
  datNgonNgu('en');
  const k = new KhoChat(true);
  k.batDauLuot('a', 0, 'a');
  k.xuLy({ loai: 'toolBatDau', id: 'g', ten: 'grep', thamSo: '"TODO" in src' });
  k.xuLy({ loai: 'tool', id: 'g', ten: 'grep', tomTat: '1 kết quả', thamSo: '"TODO" in src', duongDan: 'src' });
  k.xuLy({ loai: 'toolBatDau', id: 'r', ten: 'run_command', thamSo: 'npm test' });
  k.xuLy({ loai: 'tool', id: 'r', ten: 'run_command', tomTat: 'bị từ chối', hong: true, chiTiet: 'NGƯỜI DÙNG TỪ CHỐI chạy lệnh: npm test\nHọ đã đọc lệnh và không đồng ý. ĐỪNG gọi lại y hệt' });
  k.xuLy({ loai: 'toolBatDau', id: 'p', ten: 'giao_viec_ghi', thamSo: 'Thêm hàm chia' });
  k.xuLy({ loai: 'tool', ten: 'giao_viec_ghi', tomTat: 'Thêm hàm chia…' }); // tóm tắt lúc giao (không id)
  k.xuLy({ loai: 'tool', id: 'p', ten: 'giao_viec_ghi', tomTat: 'xong (1/3) · 1 file chờ gộp', thamSo: 'Thêm hàm chia' });
  k.xuLy({ loai: 'xong', tienUsd: 0, soFileDaSua: 0 });
  const tools = k.S.bang.filter((m) => m.loai === 'tool');
  const chu = boMau(tools.flatMap((m) => veMuc(m, 100)).join('\n'));
  assert.match(chu, /Search\("TODO" in src\)\n {2}⎿ {2}1 result\b/);
  assert.doesNotMatch(chu, /NGƯỜI DÙNG|ĐỪNG/);
  assert.match(chu, /Bash\(npm test\)\n {2}⎿ {2}denied/);
  assert.equal(tools.filter((m) => m.loai === 'tool' && m.ten === 'giao_viec_ghi').length, 1, chu);
  assert.match(chu, /TaskWrite\(Thêm hàm chia\)\n {2}⎿ {2}done \(1\/3\) · 1 file pending merge/);
  datNgonNgu('vi');
});

test('trả lời thẻ hỏi không in "Allowed ·"; bỏ qua nói rõ', () => {
  datNgonNgu('en');
  const k = new KhoChat(true);
  k.batDauLuot('a', 0, 'a');
  k.xuLy({ loai: 'hoiLuaChon', id: 'h1', cauHoi: [{ cauHoi: 'DB?', luaChon: [{ nhan: 'PG' }, { nhan: 'SQLite' }] }] });
  k.xuLy({ loai: 'xongHoi', id: 'h1', tomTat: 'không trả lời' });
  const chu = boMau(k.S.bang.flatMap((m) => veMuc(m, 100)).join('\n'));
  assert.match(chu, /You skipped the question/);
  assert.doesNotMatch(chu, /Allowed|không trả lời/);
  datNgonNgu('vi');
});

test('khối code dài: BỌC, không cắt "…" (QA: lệnh `open -t "…"` mất nửa đường dẫn); văn xuôi bọc không thừa dấu cách đầu dòng', () => {
  const duong = `open -t "/private/tmp/${'x'.repeat(120)}/mcp.json"`;
  const ra = boMau(veMarkdown(`\`\`\`\n${duong}\n\`\`\``, { rong: 60 }));
  assert.ok(ra.replace(/\n│ (↪ )?/g, '').includes(duong), ra);
  assert.doesNotMatch(ra, /…/);
  const doan = bocDong('Config file: abc · open with /mcp open · reload with /mcp reload after editing.', 40);
  for (const d of doan.slice(1)) assert.doesNotMatch(boMau(d), /^ /, JSON.stringify(doan));
});

test('banner: câu chào BỌC (không "…"), đường dẫn rút GIỮA giữ tên dự án', () => {
  datNgonNgu('en');
  const ra = boMau(veManMoDau({ phienBan: '0.4.0', ten: 'Hoàng Nghĩa Cường', thuMuc: `/private/tmp/${'a'.repeat(90)}/du-an-cua-toi`, nhanh: 'main', banMoi: null, lenhCai: '', ngoaiTuyen: false,
    model: 'Sonnet 5', muc: 'Medium', cheDo: { ten: 'Ask before edits', icon: '✋', mau: '#4ade80' } }, ['LOGO'], 140).join('\n'));
  assert.match(ra, /runs code\s*│\n│\s+right here\./);
  assert.match(ra, /every edit\/command still\s*│\n│\s+asks\./);
  assert.match(ra, /(…|\.\.\.)[a-z]*\/du-an-cua-toi/);
  assert.equal(rutGiua('/abc/def', 50), '/abc/def');
  datNgonNgu('vi');
});
