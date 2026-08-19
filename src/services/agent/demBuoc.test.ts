/**
 * Trần bước phải tính cho VIỆC ĐANG LÀM, không phải cho cả cuộc trò chuyện.
 *
 * Lỗi thật, người dùng gặp 19/08/2026: "Đã chạm trần 8 bước trong một việc.
 * Hãy hỏi lại câu hỏi hẹp hơn, hoặc bắt đầu việc mới." — hiện ra NGAY, trước
 * khi agent làm bất cứ gì.
 *
 * Nguyên nhân: `demBuoc` đếm mọi tin `assistant` có `tool_calls` trong TOÀN
 * BỘ `messages`, tức là gộp cả những câu hỏi trước trong cùng cuộc. Ở mức
 * Thấp (8 bước), sau khoảng tám lời gọi tool cộng dồn thì MỌI câu hỏi sau
 * đều bị từ chối ngay — cuộc trò chuyện chết hẳn.
 *
 * Chỗ độc nhất: câu thông báo đề nghị "bắt đầu việc mới", nên lỗi này trông
 * y như một giới hạn có chủ ý. Người dùng mở cuộc mới, thấy hết, và không ai
 * biết là hỏng.
 */
import assert from 'node:assert/strict';
import test from 'node:test';

import { demBuocViecNay } from './turn.js';

const goiTool = (ten: string) => ({
  role: 'assistant' as const,
  content: null,
  tool_calls: [{ id: `c_${ten}`, type: 'function' as const, function: { name: ten, arguments: '{}' } }],
});
const traTool = (ten: string) => ({ role: 'tool' as const, tool_call_id: `c_${ten}`, content: 'ok' });

test('đếm từ câu hỏi GẦN NHẤT, không gộp câu hỏi trước', () => {
  const hoiThoai = [
    { role: 'user' as const, content: 'câu hỏi thứ nhất' },
    goiTool('a'), traTool('a'),
    goiTool('b'), traTool('b'),
    goiTool('c'), traTool('c'),
    { role: 'assistant' as const, content: 'xong câu một' },
    // ── người dùng hỏi câu MỚI ⇒ bộ đếm phải về 0 ──
    { role: 'user' as const, content: 'câu hỏi thứ hai' },
    goiTool('d'), traTool('d'),
  ];
  assert.equal(demBuocViecNay(hoiThoai), 1, 'việc mới phải bắt đầu lại từ 0');
});

test('chưa có câu hỏi nào thì là 0', () => {
  assert.equal(demBuocViecNay([{ role: 'user', content: 'hỏi' }]), 0);
});

test('đếm đúng trong CÙNG một việc', () => {
  const ht = [
    { role: 'user' as const, content: 'hỏi' },
    goiTool('a'), traTool('a'),
    goiTool('b'), traTool('b'),
  ];
  assert.equal(demBuocViecNay(ht), 2);
});

test('cuộc dài KHÔNG khoá cứng câu hỏi mới', () => {
  // 20 bước rải qua ba câu hỏi trước, mức Thấp (8) — câu thứ tư vẫn phải chạy.
  const ht: any[] = [];
  for (let q = 0; q < 3; q += 1) {
    ht.push({ role: 'user', content: `hỏi ${q}` });
    for (let i = 0; i < 7; i += 1) { ht.push(goiTool(`t${q}_${i}`)); ht.push(traTool(`t${q}_${i}`)); }
    ht.push({ role: 'assistant', content: `xong ${q}` });
  }
  ht.push({ role: 'user', content: 'hỏi mới' });
  assert.equal(demBuocViecNay(ht), 0, 'câu hỏi mới bị tính cả bước của ba câu trước ⇒ chết ngay');
});
