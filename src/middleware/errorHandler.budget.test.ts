/**
 * Chặn vì HẠN MỨC phải đến tay người dùng dưới dạng CÂU CHỮ THẬT.
 *
 * 08/09/2026: cầu dao ngân sách chặn lời gọi AI và ghi rõ lý do vào log
 * ("Đã chạm trần chi phí AI trong ngày…"), nhưng app iOS chỉ hiện
 * "Internal Server Error" — nhìn như web sập. Nguyên nhân: `LLMError` không
 * mang `statusCode`, nên errorHandler mặc định 500, và ở 5xx nó CỐ Ý thay câu
 * thật bằng câu chung để không lộ nội bộ.
 *
 * Phép kiểm này giữ đúng cả hai vế: 4xx phải giữ nguyên câu, 5xx phải che.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { errorHandler } from './errorHandler.js';

type Ra = { ma: number; than: Record<string, unknown> };

/** Gọi errorHandler với một lỗi và thu lại thứ nó định trả về. */
function chay(err: Error): Ra {
  const ra: Ra = { ma: 0, than: {} };
  const res = {
    status(n: number) { ra.ma = n; return this; },
    json(b: Record<string, unknown>) { ra.than = b; return this; },
    headersSent: false,
  };
  const req = { originalUrl: '/api/v1/courses/lessons/633/ai/ask', method: 'POST', ip: '1.2.3.4', headers: {} };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errorHandler(err as any, req as any, res as any, (() => {}) as any);
  return ra;
}

const CAU_THAT = 'Đã chạm trần chi phí AI trong ngày (~$80.58 / $80). Mọi lời gọi AI tạm dừng tới 00:00.';

test('chặn vì hạn mức → 429 và GIỮ NGUYÊN câu chữ thật', () => {
  const err = Object.assign(new Error(CAU_THAT), { statusCode: 429, code: 'BUDGET_EXCEEDED' });
  const ra = chay(err);
  assert.equal(ra.ma, 429);
  assert.equal(ra.than.message, CAU_THAT, 'người dùng phải đọc được LÝ DO, không phải câu chung chung');
  assert.equal(ra.than.code, 'BUDGET_EXCEEDED', 'app cần mã này để hiện màn hình riêng');
  assert.equal(ra.than.success, false);
});

test('đúng lỗi cũ: thiếu statusCode thì rơi về 500 và câu thật BỊ CHE', () => {
  // Đây là hình dạng của lỗi TRƯỚC khi vá — giữ lại để thấy vì sao phải vá.
  const err = new Error(CAU_THAT);
  const ra = chay(err);
  assert.equal(ra.ma, 500);
  assert.equal(ra.than.message, 'Internal Server Error');
});

test('5xx thật vẫn phải che nội bộ', () => {
  const err = Object.assign(new Error('connect ECONNREFUSED 10.0.0.5:5432'), { statusCode: 503 });
  const ra = chay(err);
  assert.equal(ra.ma, 503);
  assert.equal(ra.than.message, 'Internal Server Error', 'không được lộ địa chỉ nội bộ ra ngoài');
});

test('4xx khác vẫn giữ câu chữ (không bị vá này làm hỏng)', () => {
  const err = Object.assign(new Error('Giá trị đã tồn tại'), { statusCode: 409 });
  const ra = chay(err);
  assert.equal(ra.ma, 409);
  assert.equal(ra.than.message, 'Giá trị đã tồn tại');
});
