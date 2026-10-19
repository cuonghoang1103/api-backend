import assert from 'node:assert/strict';
import { test } from 'node:test';
import { boSungTheNN } from './theNgoaiNgu.js';

test('đã bọc đủ ⇒ y nguyên', () => {
  const s = 'Part 1 nhé! [en]What do you usually do in your free time?[/en]';
  assert.equal(boSungTheNN(s, 'en'), s);
});

test('câu tiếng Anh trần (lỗi thật 19/10) ⇒ bọc, gộp với thẻ kề', () => {
  assert.equal(
    boSungTheNN('Great, "Playing soccer" is a fun hobby! Let me give you a small tip. [en]I play soccer[/en] is the more natural way to say it.', 'en'),
    '[en]Great, "Playing soccer" is a fun hobby! Let me give you a small tip. I play soccer is the more natural way to say it.[/en]',
  );
  assert.equal(boSungTheNN('Good, [en]I play soccer[/en] sounds natural now. How often do you play soccer?', 'en'),
    '[en]Good, I play soccer sounds natural now. How often do you play soccer?[/en]');
});

test('tiếng Anh chen trong câu Việt ⇒ chỉ bọc phần Anh', () => {
  assert.equal(boSungTheNN('Bạn nên nói I play soccer nhé.', 'en'), 'Bạn nên nói [en]I play soccer[/en] nhé.');
  assert.equal(boSungTheNN('Chào mừng bạn quay lại! Mình nói tiếp nhé.', 'en'), 'Chào mừng bạn quay lại! Mình nói tiếp nhé.');
});

test('không nhận nhầm tiếng Việt / tên riêng', () => {
  for (const s of ['Part 1 nhé!', 'Mình là CuongMini, cho con hỏi nha.', 'Mình vào Part 2 nhé, một phút chuẩn bị.']) assert.equal(boSungTheNN(s, 'en'), s);
});

test('Nhật/Trung trần ⇒ bọc dãy kana/Hán', () => {
  assert.equal(boSungTheNN('Từ 学生 nghĩa là học sinh. 学生ですか？', 'ja'), 'Từ [en]学生[/en] nghĩa là học sinh. [en]学生ですか？[/en]');
  assert.equal(boSungTheNN('Giỏi lắm! 你喜欢做什么？', 'zh'), 'Giỏi lắm! [en]你喜欢做什么？[/en]');
  assert.equal(boSungTheNN('Câu đúng: {学生|がくせい}です。', 'ja'), 'Câu đúng: [en]{学生|がくせい}です。[/en]');
});
