/**
 * Trần chờ-chữ-đầu của gia sư phòng thi.
 *
 * Bảo vệ đúng lỗi đã gặp 08/09/2026: câu trả lời dài của CuongMini bị chặt
 * ngang ở giây thứ 40 kèm "quá 40000ms", vì trần vốn để LÙI MODEL lại được đặt
 * cho CẢ lượt. Có chữ rồi thì phải để nó chảy hết.
 *
 *   npx tsx --test src/services/examTutor.deadline.test.ts
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { withFirstTokenDeadline, DeadlineError } from './examTutor.service.js';

const cho = (ms: number) => new Promise((r) => setTimeout(r, ms));

test('chưa có chữ nào trong hạn → ném DeadlineError (để lùi sang model khác)', async () => {
  const bd = Date.now();
  await assert.rejects(
    withFirstTokenDeadline(async () => { await cho(500); return 'xong'; }, 100, () => {}),
    (e: unknown) => e instanceof DeadlineError,
  );
  assert.ok(Date.now() - bd < 400, 'phải bỏ ngay khi hết hạn, không đợi hết lượt');
});

test('CÓ chữ trước hạn → chạy tiếp quá hạn vẫn xong, KHÔNG bị chặt', async () => {
  const chu: string[] = [];
  const ra = await withFirstTokenDeadline(
    async (tok) => {
      await cho(30);
      tok?.('Vòng 1: ');        // chữ đầu tới TRƯỚC hạn 100ms
      await cho(400);           // rồi model nghĩ tiếp, VƯỢT hạn
      tok?.('Vòng 3, 4 …');
      return 'đủ câu';
    },
    100,
    (d) => chu.push(d),
  );
  assert.equal(ra, 'đủ câu');
  assert.deepEqual(chu, ['Vòng 1: ', 'Vòng 3, 4 …'], 'phải nhận đủ hai mẩu chữ');
});

test('lỗi thật của model vẫn bay lên nguyên vẹn, không bị nuốt thành DeadlineError', async () => {
  await assert.rejects(
    withFirstTokenDeadline(async () => { throw new Error('upstream 503'); }, 5000, () => {}),
    /upstream 503/,
  );
});

test('không stream (onToken undefined) → vẫn giữ trần cho cả lượt', async () => {
  await assert.rejects(
    withFirstTokenDeadline(async () => { await cho(300); return 1; }, 80),
    (e: unknown) => e instanceof DeadlineError,
  );
});
