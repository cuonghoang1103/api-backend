import { test } from 'node:test';
import assert from 'node:assert/strict';
import { modelChinhHangCuaBac, streamChatChinhHang, trongTranChat } from './aiChatChinhHang.js';

test('bậc → model chính hãng mặc định, env đè chỉ nhận claude-*', () => {
  assert.equal(modelChinhHangCuaBac('cuongmini-pro'), 'claude-haiku-5-5');
  assert.equal(modelChinhHangCuaBac('cuongmini-pro-2'), 'claude-sonnet-5-5');
  assert.equal(modelChinhHangCuaBac('cuongmini-max'), 'claude-opus-5-5');
  process.env.WEB_CHAT_MODEL_MAX = 'gpt-6-sol';
  assert.equal(modelChinhHangCuaBac('cuongmini-max'), 'claude-opus-5-5');
  process.env.WEB_CHAT_MODEL_MAX = 'claude-opus-5-1';
  assert.equal(modelChinhHangCuaBac('cuongmini-max'), 'claude-opus-5-1');
  delete process.env.WEB_CHAT_MODEL_MAX;
});

test('trần $/ngày: tổng 0 = tắt, vượt người = chặn', () => {
  assert.equal(trongTranChat({ ca: 0, nguoi: 0 }), true);
  assert.equal(trongTranChat({ ca: 30, nguoi: 0 }), false);
  assert.equal(trongTranChat({ ca: 1, nguoi: 3 }), false);
  process.env.WEB_CHAT_CHINH_HANG_USD_NGAY = '0';
  assert.equal(trongTranChat({ ca: 0, nguoi: 0 }), false);
  delete process.env.WEB_CHAT_CHINH_HANG_USD_NGAY;
});

test('stream: nhả chữ theo thứ tự, trả usd + model, viec = web_chat', async () => {
  let seen: { viec?: string; model?: string } = {};
  const g = streamChatChinhHang({
    bac: 'cuongmini-pro-2', system: 's', messages: [{ role: 'user', content: 'hi' }], userId: 7,
    _goi: async (o) => {
      seen = { viec: o.viec, model: o.model };
      for (const d of ['Xin', ' chào', '!']) { await new Promise((r) => setTimeout(r, 2)); o.onToken?.(d); }
      return { usd: 0.0123 };
    },
  });
  let text = '';
  let r = await g.next();
  while (!r.done) { text += r.value; r = await g.next(); }
  assert.equal(text, 'Xin chào!');
  assert.deepEqual(r.value, { usd: 0.0123, model: 'claude-sonnet-5-5' });
  assert.deepEqual(seen, { viec: 'web_chat', model: 'claude-sonnet-5-5' });
});

test('stream: lỗi trước chữ đầu ⇒ ném; lỗi giữa chừng ⇒ nhả phần đã có rồi ném', async () => {
  await assert.rejects(async () => {
    for await (const _ of streamChatChinhHang({ bac: 'cuongmini-pro', system: '', messages: [], userId: 1, _goi: async () => { throw new Error('het key'); } })) { /* */ }
  }, /het key/);
  let got = '';
  await assert.rejects(async () => {
    for await (const c of streamChatChinhHang({
      bac: 'cuongmini-max', system: '', messages: [], userId: 1,
      _goi: async (o) => { o.onToken?.('một phần'); await new Promise((r) => setTimeout(r, 1)); throw new Error('gãy'); },
    })) got += c;
  }, /gãy/);
  assert.equal(got, 'một phần');
});
