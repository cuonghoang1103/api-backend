/**
 * Học liệu + tiến độ — phần thuần:  npx tsx --test src/services/hocLieu/hocLieu.test.ts
 */
import assert from 'node:assert/strict';
import { describe, it, after } from 'node:test';
import { htmlSangMd, khoiSangMd, baiSachSangMd, phuDeSangVanBan, catTrang, chuNoiTuyen, chuanTim } from './veMarkdown.js';
import { nhomDekiru, _datNguonLay, mucLuc, timBuoi } from './sachHoc.js';
import { xuHuong, trangThaiLich, chuoiNgay, diemYeu, danhGiaMon, deXuat, veBaoCao, dauTuanVN, ngayVN, type TongHop } from './tienDo.js';
import { mucLucSach, noiDungMucSach } from './hocLieu.service.js';

describe('veMarkdown — HTML bài học ⇒ markdown', () => {
  it('giữ phần tiếng Việt của bài song ngữ, bỏ tiếng Anh', () => {
    const html = '<div class="ml-en"><p>English only</p></div><div class="ml-vi"><h2>Lệnh ls</h2><p>Liệt kê <strong>tệp</strong>.</p></div>';
    const md = htmlSangMd(html);
    assert.match(md, /### Lệnh ls/);
    assert.match(md, /Liệt kê \*\*tệp\*\*/);
    assert.doesNotMatch(md, /English only/);
    assert.match(htmlSangMd(html, true), /English only/);
  });
  it('khối code giữ nguyên xuống dòng + ngôn ngữ; link thành [chữ](url); bảng thành hàng |', () => {
    const md = htmlSangMd('<pre><code class="language-bash">ls -la\ncd /tmp &amp;&amp; pwd</code></pre><p>Xem <a href="https://x.dev/a">tài liệu</a></p><table><tr><td>a</td><td>b</td></tr></table>');
    assert.match(md, /```bash\nls -la\ncd \/tmp && pwd\n```/);
    assert.match(md, /\[tài liệu\]\(https:\/\/x\.dev\/a\)/);
    assert.match(md, /\| a \| b \|/);
  });
});

describe('veMarkdown — khối khoá sách (Dekiru)', () => {
  it('furigana {漢字|かな} ⇒ 漢字(かな); ==dạ quang== bỏ dấu', () => {
    assert.equal(chuNoiTuyen('{学生|がくせい}です ==quan trọng=='), '学生(がくせい)です quan trọng');
  });
  it('từ vựng: từ · cách đọc · nghĩa + câu ví dụ', () => {
    const md = khoiSangMd({ t: 'vocab', items: [{ w: '{学生|がくせい}', pos: 'n', ipa: 'gakusei', vi: 'học sinh', ex: 'わたしは{学生|がくせい}です。', exVi: 'Tôi là học sinh.' }] });
    assert.match(md, /\*\*学生\(がくせい\)\*\* · gakusei · học sinh/);
    assert.match(md, /VD: わたしは学生\(がくせい\)です。 — Tôi là học sinh\./);
  });
  it('trắc nghiệm + điền: có đáp án mặc định, ẩn khi answers=false', () => {
    const mcq = { t: 'mcq', id: 'm1', title: 'Chọn', items: [{ q: 'はじめまして nghĩa là?', options: ['Tạm biệt', 'Rất vui được gặp'], correct: 1, why: 'câu chào lần đầu' }] };
    assert.match(khoiSangMd(mcq), /Đáp án: B — câu chào lần đầu/);
    assert.doesNotMatch(khoiSangMd(mcq, { dapAn: false }), /Đáp án/);
    const quiz = { t: 'quiz', id: 'q1', title: 'Điền', kind: 'fill', items: [{ q: 'わたし__ パクです。', answers: ['は'] }] };
    assert.match(khoiSangMd(quiz), /Đáp án: は/);
  });
  it('hội thoại + ghép câu + đọc chữ Hán (che furigana ở đề, đáp án có cách đọc)', () => {
    assert.match(khoiSangMd({ t: 'dialogue', lines: [{ who: 'パク', role: 'a', text: 'はじめまして。', vi: 'Rất vui được gặp.' }] }), /\*\*パク:\*\* はじめまして。 — _Rất vui được gặp\._/);
    assert.match(khoiSangMd({ t: 'build', id: 'b', title: 'Ghép', items: [{ vi: 'Tôi là Park', chips: ['パク', 'です', 'わたしは'], answer: ['わたしは', 'パク', 'です'] }] }), /Đáp án: わたしは パク です/);
    const rk = khoiSangMd({ t: 'readkanji', id: 'r', title: 'Đọc', items: [{ text: '{学生|がくせい}', ro: 'gakusei', vi: 'học sinh' }] });
    assert.match(rk, /1\. 学生 — đọc: gakusei/);
  });
  it('bài đủ: tiêu đề, id, phút, mục tiêu, các khối', () => {
    const md = baiSachSangMd({ id: 'b1-ngu-phap', title: 'Ngữ pháp Bài 1', goal: 'Nói N1 は N2 です', minutes: 50, blocks: [{ t: 'h', text: 'ポイント 1' }, { t: 'rule', formula: 'N1 は N2 です', vi: 'N1 là N2' }] });
    assert.match(md, /^## Ngữ pháp Bài 1\n_id: b1-ngu-phap · ~50 phút_/);
    assert.match(md, /\*\*Công thức:\*\* N1 は N2 です — N1 là N2/);
  });
  it('nhóm mục Dekiru đúng 5 nhóm như trang web', () => {
    assert.equal(nhomDekiru('b1-hoi-thoai'), 'loi');
    assert.equal(nhomDekiru('b1-ngu-phap'), 'loi');
    assert.equal(nhomDekiru('s113-b1-buoi-1'), 'co');
    assert.equal(nhomDekiru('b1-lt-a'), 'luyen');
    assert.equal(nhomDekiru('b3-thi-thu-113'), 'thi');
    assert.equal(nhomDekiru('b1-theo-sach-15'), 'bs');
  });
});

describe('phụ đề, cắt trang, tìm không dấu', () => {
  it('phụ đề ⇒ [mm:ss] lời; ưu tiên tiếng Việt', () => {
    assert.equal(phuDeSangVanBan([{ t: 5, en: 'hello' }, { t: 65.4, vi: 'xin chào', en: 'hi' }]), '[00:05] hello\n[01:05] xin chào');
  });
  it('cắt trang ở ranh đoạn, trả offset tiếp', () => {
    const s = 'a'.repeat(30) + '\n\n' + 'b'.repeat(30);
    const p = catTrang(s, 0, 40);
    assert.equal(p.text, 'a'.repeat(30));
    assert.equal(p.tiep, 30);
    assert.equal(catTrang(s, p.tiep!, 40).tiep, null);
  });
  it('tìm không dấu', () => { assert.equal(chuanTim('Ngữ Pháp Đầu'), 'ngu phap dau'); });
});

describe('khoá sách qua JSON công khai (nguồn giả)', () => {
  const INDEX = { khoa: 'dekiru', tieuDe: 'Dekiru', donVi: 'Bài', phienBan: 'v1', buoi: [
    { n: 1, so: 0, ten: 'Bài 0', phut: 600, bai: [{ id: 'b0-kana', kind: 'kana', title: 'Kana', minutes: 60 }], tep: 'bai-1.json' },
    { n: 2, so: 1, ten: 'Bài 1', phut: 1645, bai: [
      { id: 'b1-hoi-thoai', kind: 'conversation', title: 'Hội thoại', minutes: 35 },
      { id: 'slot-1', kind: 'review', title: 'Buổi 1', minutes: 90 },
      { id: 'b1-lt-a', kind: 'homework', title: 'Luyện A', minutes: 20 },
    ], tep: 'bai-2.json' },
  ] };
  const BAI2 = { bai: [
    { id: 'b1-hoi-thoai', kind: 'conversation', title: 'Hội thoại: はじめまして', minutes: 35, blocks: [{ t: 'dialogue', lines: [{ who: 'パク', role: 'a', text: 'はじめまして。' }] }] },
    { id: 'slot-1', kind: 'review', title: 'Buổi 1', minutes: 90, blocks: [{ t: 'p', text: 'Ôn buổi 1' }] },
  ] };
  _datNguonLay(async (url) => {
    if (url.endsWith('/sach-hoc/dekiru/index.json')) return INDEX;
    if (url.endsWith('/sach-hoc/dekiru/bai-2.json')) return BAI2;
    throw new Error('404 ' + url);
  });
  after(() => _datNguonLay(null));

  it('mục lục theo SỐ BÀI của sách (bai=1 ⇒ buổi n=2)', async () => {
    const ml = await mucLuc('dekiru');
    assert.equal(timBuoi(ml, 1)?.n, 2);
    const o = await mucLucSach('dekiru', 1) as any;
    assert.equal(o.bai, 1);
    assert.match(o.link, /\/language\/ja\/dekiru\?bai=1$/);
    assert.deepEqual(o.nhom.map((g: any) => g.nhom), ['① Học trước — phần cốt lõi', '② Học theo buổi trên lớp', '③ Luyện thêm — từ dễ đến khó']);
  });
  it('đọc một mục: nội dung đủ + link sâu', async () => {
    const r = await noiDungMucSach('dekiru', 1, 'b1-hoi-thoai') as any;
    assert.deepEqual(r.muc, ['b1-hoi-thoai']);
    assert.match(r.noiDung, /\*\*パク:\*\* はじめまして。/);
    assert.equal(r.tiep, null);
  });
  it('khoá sách không có ⇒ lỗi rõ', async () => {
    await assert.rejects(mucLucSach('khong-co'), /book phải là một trong/);
  });
});

describe('tiến độ — chấm điểm thuần', () => {
  it('xu hướng: lệch < 10% ⇒ ngang; thiếu số ⇒ chưa đủ', () => {
    assert.equal(xuHuong(10, 5), 'tang');
    assert.equal(xuHuong(3, 8), 'giam');
    assert.equal(xuHuong(10, 10.5), 'ngang');
    assert.equal(xuHuong(null, 4), 'chua_du');
    assert.equal(xuHuong(0, 0), 'chua_du');
  });
  it('đúng lịch / chậm / chậm nhiều / chưa tới hạn', () => {
    assert.equal(trangThaiLich(0, 0, 0), 'chua_toi_han');
    assert.equal(trangThaiLich(10, 10, 0), 'dung_lich');
    assert.equal(trangThaiLich(19, 20, 1), 'dung_lich');
    assert.equal(trangThaiLich(14, 20, 6), 'cham');
    assert.equal(trangThaiLich(5, 20, 15), 'cham_nhieu');
  });
  it('chuỗi ngày: hôm nay chưa học vẫn giữ chuỗi tới hôm qua; đứt ⇒ dừng', () => {
    assert.equal(chuoiNgay(['2026-11-22', '2026-11-23', '2026-11-24'], '2026-11-24'), 3);
    assert.equal(chuoiNgay(['2026-11-22', '2026-11-23'], '2026-11-24'), 2);
    assert.equal(chuoiNgay(['2026-11-20', '2026-11-23'], '2026-11-24'), 1);
    assert.equal(chuoiNgay([], '2026-11-24'), 0);
  });
  it('điểm yếu: < 60%, thấp nhất trước', () => {
    const d = diemYeu([{ ten: 'PE1', diem: 3, toiDa: 10 }, { ten: 'FE1', diem: 8, toiDa: 10 }, { ten: 'Quiz', diem: 5, toiDa: 10 }]);
    assert.deepEqual(d.map((x) => [x.ten, x.phanTram]), [['PE1', 30], ['Quiz', 50]]);
  });
  it('tuần/ngày theo giờ VN (23:30 UTC Chủ nhật = sáng thứ Hai VN)', () => {
    const t = Date.parse('2026-11-29T23:30:00Z'); // VN: 30/11 06:30 (thứ Hai)
    assert.equal(ngayVN(t), '2026-11-30');
    assert.equal(dauTuanVN(t), '2026-11-30');
    assert.equal(dauTuanVN(Date.parse('2026-11-29T10:00:00Z')), '2026-11-23');
  });
  it('lời khuyên cụ thể: môn chậm có tên việc quá hạn; Code Lab đạt thấp; link nhận xét tiếng Anh', () => {
    const m = danhGiaMon({ ma: 'ctwork:jpd', ten: 'JPD113+123', nguon: 'ctwork', tong: 20, xong: 5, toiHan: 10, xongTrongHan: 4, quaHan: 6, xongTuanNay: 2, xongTuanTruoc: 5, sapToi7Ngay: 8, link: 'https://x/work/jpd', viecQuaHan: [{ ten: 'BAI2-9 Từ vựng', han: '2026-12-09' }] });
    assert.equal(m.lich, 'cham_nhieu');
    assert.equal(m.xuHuong, 'giam');
    assert.equal(m.phanTram, 25);
    const t: TongHop = { homNay: '2026-12-10', mon: [m], codeLab: [{ track: 'React', nop: 10, dat: 4 }], thi: [{ ten: 'FER202 PE', diem: 4, toiDa: 10 }], thiTuanNay: 40, thiTuanTruoc: 55, gioTuanNay: 3, gioTuanTruoc: 9, chuoi: 0, ngayHocTuanNay: 2 };
    const dx = deXuat(t);
    assert.match(dx[0]!, /JPD113\+123: chậm 6 việc so với lịch \(BAI2-9 Từ vựng\)/);
    assert.ok(dx.some((s) => /Code Lab React: đạt 40%/.test(s)));
    assert.ok(dx.some((s) => /"FER202 PE" chỉ 40%/.test(s)));
    const bc = veBaoCao(t);
    assert.match(bc, /JPD113\+123\*\* — 5\/20 \(25%\) · 🔴 chậm nhiều \(quá hạn 6\) · ↘ đi xuống/);
    assert.match(bc, /nhan-xet-tuan/);
  });
  it('không có gì chậm ⇒ một lời khuyên giữ nhịp', () => {
    const t: TongHop = { homNay: '2026-12-10', mon: [], codeLab: [], thi: [], thiTuanNay: null, thiTuanTruoc: null, gioTuanNay: 5, gioTuanTruoc: 5, chuoi: 4, ngayHocTuanNay: 3 };
    assert.deepEqual(deXuat(t).length, 1);
    assert.match(deXuat(t)[0]!, /đúng nhịp/);
  });
});
