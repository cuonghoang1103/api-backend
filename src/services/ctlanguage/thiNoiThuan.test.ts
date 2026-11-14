/**
 * npx tsx --test src/services/ctlanguage/thiNoiThuan.test.ts
 * Thi nói với giám khảo AI — luật thuần + MỌI đề trong repo (đề nói IELTS sinh từ web, HSKK dựng từ đề phòng thi).
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { napDe } from './thi.js';
import { napDeNoi } from './thiNoi.js';
import { kiemDe, tatCaCau } from './thiThuan.js';
import {
  chuHanDau, deNoiHskk, deNoiIelts, diemNhacLai, doKhopNhacLai, docChamHskk, kiemDeNoi, sachBanGhiNoi, tomTatDeNoi, tongHskk,
  type NguonNoiIelts,
} from './thiNoiThuan.js';

const NGUON: NguonNoiIelts = {
  moTa: 'Part 1: food', phut: 12,
  part1: [{ chuDe: 'Food', cau: ['What do you usually eat for breakfast?', 'Do you like cooking?'] }, { chuDe: 'Travel', cau: ['How do you get to school?'] }],
  part2: { cueCard: 'Describe a meal you enjoyed.\n\nYou should say:\n• where you had it\n• who you were with\n\nand explain why you enjoyed it.', goiY: [], cauChot: ['Do you often eat there?'] },
  part3: [{ chuDe: 'Eating habits', cau: ['Why do people eat out more today?', 'Is fast food a problem?'] }],
};

test('IELTS: kịch bản đúng thứ tự Part 1 → thẻ đề (60 s chuẩn bị) → nói dài 120 s → câu chốt → Part 3 → lời kết', () => {
  const de = deNoiIelts(9, 'band 5', NGUON, 'noi-x');
  assert.deepEqual(kiemDeNoi(de), []);
  assert.deepEqual(de.buoc.map((b) => `${b.phan}:${b.kieu}`), ['p1:hoi', 'p1:hoi', 'p1:hoi', 'p1:hoi', 'p2:the', 'p2:noiDai', 'p2:hoi', 'p3:hoi', 'p3:hoi', 'p3:ket']);
  assert.equal(de.buoc[0]!.khongCham, true);
  assert.match(de.buoc[1]!.loi, /Let's talk about food\. What do you usually eat/);
  assert.equal(de.buoc[1]!.hoi, 'What do you usually eat for breakfast?');
  assert.match(de.buoc[3]!.loi, /^Now let's talk about travel\./);
  const the = de.buoc[4]!;
  assert.equal(the.giayChuanBi, 60);
  assert.equal(the.giayNoi, 0);
  assert.equal(the.the!.de, 'Describe a meal you enjoyed.');
  assert.deepEqual(the.the!.goiY, ['where you had it', 'who you were with', 'and explain why you enjoyed it.']);
  assert.equal(de.buoc[5]!.giayNoi, 120);
  assert.equal(de.phan.find((p) => p.id === 'p1')!.giayToiDa, 300);
  assert.equal(tomTatDeNoi(de).soCau, 7); // không tính câu hỏi tên, thẻ đề, lời kết
});

test('kiemDeNoi bắt: bước lùi phần, thiếu lời kết, lời có thẻ, thẻ đề thiếu thời gian chuẩn bị', () => {
  const de = deNoiIelts(9, 'band 5', NGUON, 'noi-x');
  assert.ok(kiemDeNoi({ ...de, buoc: de.buoc.slice(0, -1) }).some((l) => l.includes('lời kết')));
  assert.ok(kiemDeNoi({ ...de, buoc: de.buoc.map((b, i) => (i === 2 ? { ...b, loi: '[en]Hi[/en]' } : b)) }).some((l) => l.includes('ngoặc vuông')));
  assert.ok(kiemDeNoi({ ...de, buoc: de.buoc.map((b, i) => (i === 4 ? { ...b, giayChuanBi: 0 } : b)) }).some((l) => l.includes('giayChuanBi')));
  assert.ok(kiemDeNoi({ ...de, buoc: de.buoc.map((b, i) => (i === 6 ? { ...b, phan: 'p1' } : b)) }).some((l) => l.includes('thứ tự phần')));
});

test('chuHanDau: lấy phần chữ Hán trước pinyin', () => {
  assert.equal(chuHanDau('请介绍一下你的家人。 Qǐng jièshào — Hãy giới thiệu'), '请介绍一下你的家人。');
  assert.equal(chuHanDau('你喜欢什么运动？为什么？'), '你喜欢什么运动？为什么？');
});

test('doKhopNhacLai: đúng nguyên câu = 1, bỏ dấu câu, thiếu chữ / nói thừa bị trừ, im lặng = 0', () => {
  assert.equal(doKhopNhacLai('今天天气很好', '今天天气很好。'), 1);
  assert.equal(doKhopNhacLai('', '今天天气很好。'), 0);
  const thieu = doKhopNhacLai('今天很好', '今天天气很好。');
  assert.ok(thieu > 0.7 && thieu < 1);
  assert.ok(doKhopNhacLai('今天天气很好我觉得非常非常舒服', '今天天气很好。') < 0.7);
});

test('HSKK: dựng từ đề phòng thi + chấm nhắc lại + gộp điểm 30/30/40', () => {
  const goc = [...napDe().values()].find((d) => d.kyThi === 'HSKK');
  assert.ok(goc, 'repo phải có đề HSKK');
  const de = deNoiHskk(goc!)!;
  assert.deepEqual(kiemDeNoi(de), []);
  const nl = de.buoc.map((b, i) => ({ b, i })).filter((x) => x.b.kieu === 'nhacLai');
  assert.equal(nl.length, 15);
  assert.equal(de.buoc.filter((b) => b.phan === 'p2' && b.kieu === 'hoi').length, 10);
  assert.equal(de.buoc.filter((b) => b.kieu === 'noiDai').length, 2);
  for (const b of de.buoc) assert.ok(!/[A-Za-zÀ-ỹ]/.test(b.loi), `lời giám khảo HSKK chỉ có chữ Hán: ${b.loi}`);
  // Nhắc đúng 12/15 câu, bỏ 3 câu ⇒ 80 điểm, 12 câu khớp.
  const banGhi = sachBanGhiNoi(de, nl.slice(0, 12).map((x) => ({ buoc: x.i, text: x.b.hoi, giay: 4 })));
  assert.deepEqual(diemNhacLai(de, banGhi), { diem: 80, soCau: 15, soKhop: 12 });
  assert.equal(tongHskk(80, 70, 50), 65);
  assert.equal(tongHskk(Number.NaN, 200, -5), 30);
});

test('sachBanGhiNoi: bỏ bước lạ / bước không chờ trả lời, mỗi bước một dòng, kẹp giây', () => {
  const de = deNoiIelts(9, 'band 5', NGUON, 'noi-x');
  const r = sachBanGhiNoi(de, [{ buoc: 1, text: ' a ', giay: 9999 }, { buoc: 1, text: 'b', giay: 3 }, { buoc: 4, text: 'thẻ đề' }, { buoc: 99, text: 'x' }, { buoc: '2', text: 'c' }, null]);
  assert.deepEqual(r, [{ buoc: 1, text: 'b', giay: 3 }, { buoc: 2, text: 'c', giay: 0 }]);
  assert.deepEqual(sachBanGhiNoi(de, 'x'), []);
});

test('docChamHskk: đọc JSON có chữ thừa, kẹp điểm, hỏng ⇒ null', () => {
  const k = docChamHskk('```json\n{"phan2":{"diem":130,"nhanXet":"ổn"},"phan3":{"diem":"45","nhanXet":"ngắn"},"nhanXet":"x","goiY":["a","",1],"loi":[{"goc":"我去学校在","sua":"我在学校","vi":"trật tự"},{"goc":""}]}\n```');
  assert.equal(k!.p2.diem, 100);
  assert.equal(k!.p3.diem, 45);
  assert.deepEqual(k!.goiY, ['a']);
  assert.equal(k!.loi.length, 1);
  assert.equal(docChamHskk('{"phan2":{"diem":50}}'), null);
  assert.equal(docChamHskk('xin lỗi'), null);
});

test('MỌI đề trong repo hợp lệ: đề viết (kiemDe) + đề nói (kiemDeNoi); IELTS đủ 5 bộ L+R / Writing / Speaking', () => {
  const de = napDe();
  const noi = napDeNoi();
  for (const d of de.values()) assert.deepEqual(kiemDe(d), [], d.id);
  for (const d of noi.values()) assert.deepEqual(kiemDeNoi(d), [], d.id);
  for (const so of [1, 2, 3, 4, 5]) {
    const lr = de.get(`ielts-de-${so}`);
    assert.ok(lr, `ielts-de-${so}`);
    assert.equal(tatCaCau(lr!).length, 80);
    assert.ok(lr!.phan.every((p) => p.band?.length), 'Listening/Reading có bảng quy band');
    assert.equal(tatCaCau(de.get(`ielts-viet-de-${so}`)!).filter((x) => x.cau.kieu === 'viet').length, 2);
    assert.ok(noi.get(`ielts-noi-de-${so}`), `ielts-noi-de-${so}`);
  }
  assert.ok([...noi.values()].some((d) => d.kyThi === 'HSKK'));
  for (const id of ['hsk4-de-1', 'hsk4-de-2', 'jlpt-n3-de-1', 'jlpt-n3-de-2']) assert.ok(de.get(id), id);
});
