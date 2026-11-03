/**
 * Chốt bảo trì CuongMini — công tắc tổng "chặn tất cả (trừ admin + CT Work)".
 * Thuần, không chạm CSDL: dùng userId=null (laAdmin tự trả false) + `_datDemAdmin` để giả vai trò.
 *
 *   npx tsx --test src/services/agent/cuongMiniBaoTri.test.ts
 */
import assert from 'node:assert/strict';
import test from 'node:test';

import {
  CAU_BAO_TRI, MA_LOI_BAO_TRI, _datDemAdmin, _xoaDemAdmin, chanBoiBaoTri,
  cuongMiniBaoTri, datCuongMiniBaoTri, purposeDuocChua,
} from './cuongMiniBaoTri.js';

function reset() {
  delete process.env.CUONGMINI_BAO_TRI;
  datCuongMiniBaoTri(false);
  _xoaDemAdmin();
}

test('câu lỗi là tiếng Việt, KHÔNG kèm tiếng Anh', () => {
  assert.equal(CAU_BAO_TRI, 'CuongMini đã quá tải hoặc đang bảo trì xin vui lòng thử lại sau');
  assert.ok(!/[/]|please|maintenance/i.test(CAU_BAO_TRI), 'không được kèm tiếng Anh / dấu gạch chéo');
  assert.equal(MA_LOI_BAO_TRI, 'CUONGMINI_BAO_TRI');
});

test('tập CHỪA: mọi work_* + admin_thong_ke được chừa; việc người thường thì KHÔNG', () => {
  for (const p of ['work_assistant', 'work_spec_review', 'work_digest', 'work_setup', 'work_agent', 'admin_thong_ke']) {
    assert.equal(purposeDuocChua(p), true, `${p} phải được chừa`);
  }
  for (const p of ['course_tutor', 'codelab_coach', 'chat_pro', 'exam_tutor', 'language_tutor', 'agent_code', 'note_format', undefined, null]) {
    assert.equal(purposeDuocChua(p), false, `${String(p)} KHÔNG được chừa`);
  }
});

test('mặc định TẮT ⇒ không chặn gì', async () => {
  reset();
  assert.equal(cuongMiniBaoTri(), false);
  for (const p of ['course_tutor', 'agent_code', 'work_assistant']) {
    assert.equal(await chanBoiBaoTri(p, null), false, `tắt thì ${p} phải qua`);
  }
});

test('BẬT ⇒ chặn người thường ở course_tutor + agent_code; CHỪA work_* ', async () => {
  reset();
  datCuongMiniBaoTri(true);
  assert.equal(cuongMiniBaoTri(), true);
  assert.equal(await chanBoiBaoTri('course_tutor', null), true, 'trợ giảng người thường phải bị chặn');
  assert.equal(await chanBoiBaoTri('agent_code', null), true, 'AI Code người thường phải bị chặn');
  assert.equal(await chanBoiBaoTri('work_assistant', null), false, 'CT Work KHÔNG bị chặn');
  assert.equal(await chanBoiBaoTri('work_spec_review', 123), false, 'CT Work KHÔNG bị chặn kể cả có userId');
  assert.equal(await chanBoiBaoTri('admin_thong_ke', null), false, 'AI thống kê admin KHÔNG bị chặn');
});

test('BẬT ⇒ ADMIN vẫn dùng được mọi việc', async () => {
  reset();
  datCuongMiniBaoTri(true);
  _datDemAdmin(7, true);   // user #7 là admin (nạp sẵn đệm, khỏi chạm CSDL)
  _datDemAdmin(8, false);  // user #8 là người thường
  assert.equal(await chanBoiBaoTri('course_tutor', 7), false, 'admin không bị chặn');
  assert.equal(await chanBoiBaoTri('agent_code', 7), false, 'admin không bị chặn AI Code');
  assert.equal(await chanBoiBaoTri('course_tutor', 8), true, 'người thường bị chặn');
});

test('env CUONGMINI_BAO_TRI thắng công tắc admin', async () => {
  reset();
  datCuongMiniBaoTri(false);
  process.env.CUONGMINI_BAO_TRI = '1';
  assert.equal(cuongMiniBaoTri(), true, 'env=1 ép BẬT dù admin để tắt');
  assert.equal(await chanBoiBaoTri('course_tutor', null), true);
  process.env.CUONGMINI_BAO_TRI = '0';
  datCuongMiniBaoTri(true);
  assert.equal(cuongMiniBaoTri(), false, 'env=0 ép TẮT dù admin để bật');
  assert.equal(await chanBoiBaoTri('agent_code', null), false);
  reset();
});
