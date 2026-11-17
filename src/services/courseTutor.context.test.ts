import assert from 'node:assert/strict';
import test from 'node:test';
import {
  boNgonNguKhac, vanBanBai, chonNgu, quizTuDuLieuBai, vanTayBai, khoaCacheCoVanTay, plain, TRAN_NOI_DUNG,
  doanSlide, docSlideHoi,
} from './courseTutor.context.js';

// Đúng hình dạng bài SWT301: ảnh slide dùng chung, rồi cặp khối EN/VI, và
// khối EN có một <div> con — chỗ một regex không tham lam sẽ cắt hụt.
const BAI = `<div class="anh-slide"><img src="x.webp" /><p class="chu-thich">📑 SWT5 · slide 30/101 — Risk</p></div>
<div class="ml-en"><p>Risk = likelihood × impact.</p><div class="pitfall">EN pitfall</div><p>EN tail</p></div>
<div class="ml-vi"><p>Rủi ro = khả năng × tác động.</p><div class="pitfall">Bẫy VI</div></div>`;

test('tiếng Việt: bỏ trọn khối EN kể cả div con, giữ ảnh + khối VI', () => {
  const t = plain(boNgonNguKhac(BAI, false), 1e9);
  assert.ok(t.includes('slide 30/101'), 'mất chú thích slide');
  assert.ok(t.includes('Rủi ro') && t.includes('Bẫy VI'));
  assert.ok(!t.includes('EN pitfall') && !t.includes('EN tail'), 'lọt nửa sau của khối EN');
});

test('tiếng Anh: bỏ khối VI, giữ khối EN', () => {
  const t = plain(boNgonNguKhac(BAI, true), 1e9);
  assert.ok(t.includes('EN tail') && !t.includes('Rủi ro'));
});

test('bài chỉ có một thứ tiếng thì giữ nguyên — không được mất trắng', () => {
  const chiEn = '<div class="ml-en"><p>Only English here</p></div>';
  assert.equal(boNgonNguKhac(chiEn, false), chiEn);
  assert.equal(boNgonNguKhac('<p>thường</p>', false), '<p>thường</p>');
});

test('vanBanBai đánh dấu khi bị cắt, không đánh dấu khi đủ', () => {
  assert.ok(!vanBanBai(BAI, false).includes('bị cắt'));
  const dai = `<div class="ml-vi"><p>${'a'.repeat(TRAN_NOI_DUNG + 10)}</p></div><div class="ml-en"><p>x</p></div>`;
  assert.ok(vanBanBai(dai, false).endsWith('[… phần sau của bài bị cắt vì quá dài]'));
});

test('chonNgu tách "EN|||VI"', () => {
  assert.equal(chonNgu('Risk|||Rủi ro', false), 'Rủi ro');
  assert.equal(chonNgu('Risk|||Rủi ro', true), 'Risk');
  assert.equal(chonNgu('Risk|||', false), 'Risk');
  assert.equal(chonNgu('plain', false), 'plain');
});

test('quiz dựng từ quizData: đúng tiếng, correctIndex → mảng, có trần', () => {
  const qd = { questions: [
    { question: 'Q1|||Câu 1', options: ['A|||Á', 'B|||Bê'], correctIndex: 1, explanation: 'Why|||Vì' },
    { question: 'Q2|||Câu 2', options: ['x', 'y', 'z'], correctIndexes: [0, 2] },
  ] };
  const vi = quizTuDuLieuBai(qd, false);
  assert.deepEqual(vi[0], { n: 1, prompt: 'Câu 1', options: ['Á', 'Bê'], correctIndexes: [1], explanation: 'Vì' });
  assert.deepEqual(vi[1].correctIndexes, [0, 2]);
  assert.equal(quizTuDuLieuBai({ questions: Array.from({ length: 80 }, () => qd.questions[0]) }, false).length, 60);
  assert.deepEqual(quizTuDuLieuBai(null, false), []);
});

test('khoá cache đổi khi nội dung đổi và vừa cột VarChar(40)', () => {
  const a = khoaCacheCoVanTay('start', vanTayBai('t', '<p>cũ</p>'));
  const b = khoaCacheCoVanTay('start', vanTayBai('t', '<p>mới</p>'));
  assert.notEqual(a, b);
  assert.ok(khoaCacheCoVanTay('x'.repeat(40), vanTayBai(1)).length <= 40);
});

// "Hỏi slide này" (17/11/2026): đúng markup `_slides.mjs` sinh — ảnh + chú thích, rồi cặp khối giảng EN/VI.
const haiSlide = (bo: string, n: number, ten: string, vi: string) =>
  `<div class="anh-slide"><img src="x/${n}.webp" alt="${bo} slide ${n}: ${ten}" /><p class="chu-thich">📑 <strong>${bo}</strong> · slide ${n}/21 — ${ten}</p></div>\n`
  + `<div class="ml-en giang"><p>EN text ${n}</p></div>\n<div class="ml-vi giang"><p>${vi}</p></div>`;

test('doanSlide: trích ĐÚNG phần giảng của slide được hỏi, một thứ tiếng; slide 2 không nhầm slide 21', () => {
  const html = [haiSlide('SWT0', 2, 'ISTQB', 'Giảng slide hai'), haiSlide('SWT0', 3, 'Test levels', 'Giảng slide ba'),
    haiSlide('SWT0', 21, 'Tổng kết', 'Giảng slide hai mươi mốt')].join('\n');
  assert.equal(doanSlide(html, { bo: 'SWT0', so: 2 }, false), 'Giảng slide hai');
  assert.equal(doanSlide(html, { bo: 'SWT0', so: 21 }, false), 'Giảng slide hai mươi mốt');
  assert.equal(doanSlide(html, { bo: 'SWT0', so: 3 }, true), 'EN text 3');
  assert.equal(doanSlide(html, { bo: 'SWT1', so: 2 }, false), '', 'bộ khác ⇒ rỗng, không đoán');
});

test('docSlideHoi: không tin client', () => {
  assert.deepEqual(docSlideHoi({ bo: 'SWT0', so: 2, ten: '  ISTQB  ' }), { bo: 'SWT0', so: 2, ten: 'ISTQB' });
  assert.equal(docSlideHoi({ bo: 'SWT0', so: 0 }), undefined);
  assert.equal(docSlideHoi({ bo: '<script>', so: 2 }), undefined);
  assert.equal(docSlideHoi('rác'), undefined);
});
