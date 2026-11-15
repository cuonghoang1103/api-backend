import test from 'node:test';
import assert from 'node:assert/strict';
import { timDanhThuc } from './danhThuc.js';
import { goiYNghe } from './goiYNghe.js';

const goi = (s: string) => timDanhThuc(s, 'Odin');

test('gọi đúng tên vẫn trúng như cũ', () => {
  for (const s of ['Odin ơi bật nhạc', 'Hey Odin, mấy giờ rồi', 'Ô Đin, tăng âm lượng', 'Odin']) {
    assert.equal(goi(s).trung, true, s);
  }
  assert.equal(goi('Odin ơi bật nhạc').conLai, 'bật nhạc');
});

test('15/11 quán ồn: Whisper nghe "Hey Odin" thành Hồ Đình / Hồ Linh / All in ⇒ nhận khi có lời chào hoặc cả câu', () => {
  assert.equal(goi('Hi, Hồ Linh').trung, true);
  assert.equal(goi('Hey Hồ Đình, mấy giờ rồi?').trung, true);
  assert.equal(goi('Hey Hồ Đình, mấy giờ rồi?').conLai, 'mấy giờ rồi?');
  assert.equal(goi('Hồ Đình').trung, true);
  assert.equal(goi('All in!').trung, true);
});

test('KHÔNG đánh thức nhầm câu đời thường có Hồ Đình / Hồ Linh / all in', () => {
  for (const s of [
    'Hồ Đình Nam đến chưa',
    'chị Hồ Linh hôm nay nghỉ',
    'all in luôn đi anh',
    'tối nay all in kèo này',
    'đình làng mình đẹp lắm',
    'ổ đĩa cứng đầy rồi',
    'anh định làm gì',
    'Hồ Đình với Hồ Linh là anh em',
  ]) {
    assert.equal(goi(s).trung, false, s);
  }
});

test('gợi ý Whisper: câu gọi mẫu đứng ĐẦU', () => {
  const g = goiYNghe('vi', [], 'Odin', 'Odin');
  assert.ok(g.startsWith('Hey Odin, Odin ơi'), g.slice(0, 60));
});

test('JSON có ngoặc kép chưa thoát trong say ⇒ vớt đúng say + actions, không đọc to "actions"', async () => {
  const { parseRobotReply } = await import('./voiceLoop.js');
  const raw = '{"say":"Bạn thấy cái tên "Bậm Trợn" có hợp không?","actions":[{"type":"face","payload":{"emotion":"curious","ms":2000}}]}';
  const r = parseRobotReply(raw);
  assert.equal(r.say, 'Bạn thấy cái tên "Bậm Trợn" có hợp không?');
  assert.ok(!/actions/.test(r.say));
  assert.equal(r.actions.length, 1);
  // JSON chuẩn vẫn như cũ
  assert.equal(parseRobotReply('{"say":"Chào bạn","actions":[]}').say, 'Chào bạn');
  // fenced
  assert.equal(parseRobotReply('```json\n{"say":"Xin chào","actions":[]}\n```').say, 'Xin chào');
});

test('đổi tiếng: câu dài có ĐỘNG TỪ ĐỔI rõ ràng thì nhận; câu kể có "nói tiếng Anh" thì không', async () => {
  const { khopDoiCheDo } = await import('./cheDo.js');
  assert.equal(khopDoiCheDo('Ý tôi nói là bạn có thể đổi sang tiếng Việt để nói với tôi.'), 'vi');
  assert.equal(khopDoiCheDo('Odin ơi chuyển qua tiếng Anh giúp mình với nhé bạn'), 'en');
  assert.equal(khopDoiCheDo('Can you please switch back to Vietnamese now?'), 'vi');
  assert.equal(khopDoiCheDo('tôi đang học nói tiếng Anh ở trường mỗi buổi chiều'), null);
  assert.equal(khopDoiCheDo('nói tiếng Việt đi'), 'vi');
  assert.equal(khopDoiCheDo('tiếng Anh'), 'en');
});
