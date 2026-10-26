/**
 * Bảng 4 model CuongMini (27/10/2026): Pro (Haiku 5.5, mặc định) · Pro 2 (Sonnet 5.5) · Max (Opus 5.5) · Fable Max (Fable 5.1).
 *   npx tsx --test src/services/agent/bangModel.test.ts
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  MA_DEFAULT, MA_SOLID, anTenThat, bangChoApp, bangClassic, bangModel, dungChoNhom, laDefault, laMaCuongMini, maChoApp,
  maMacDinhCho, timModel, tuongDuongFree, giaiDefault, chuanHoaMaTuApp,
} from './bangModel.js';

test('danh sách app: đúng 4 model, đúng thứ tự, không rambo, không mục ẩn', () => {
  const ds = bangChoApp(true);
  assert.deepEqual(ds.map((m) => m.ten), ['CuongMini Pro', 'CuongMini Pro 2', 'CuongMini Max', 'CuongMini Fable Max']);
  assert.deepEqual(ds.map((m) => m.id), ['cm-default', 'cm-sonic', 'cm-optimum', 'cm-invisible']);
  assert.ok(ds.every((m) => m.cong === 'anthropic'));
  assert.ok(bangClassic().every((m) => m.an), 'Classic chỉ còn dạng ẩn');
  assert.equal(bangModel().length, 4);
});

test('model thật + khoá: Pro free · Pro 2 + Max khoá chung · Fable Max khoá riêng', () => {
  const by = Object.fromEntries(bangChoApp().map((m) => [m.id, m]));
  assert.equal(by['cm-default']!.model, 'claude-haiku-5-5'); assert.equal(by['cm-default']!.khoa, 'free');
  assert.equal(by['cm-sonic']!.model, 'claude-sonnet-5-5'); assert.equal(by['cm-sonic']!.khoa, 'chung');
  assert.equal(by['cm-optimum']!.model, 'claude-opus-5-5'); assert.equal(by['cm-optimum']!.khoa, 'chung');
  assert.equal(by['cm-invisible']!.model, 'claude-fable-5-1'); assert.equal(by['cm-invisible']!.khoa, 'invisible');
});

test('mã cũ ⇒ mã mới; mã lạ / trống / mục ẩn ⇒ CuongMini Pro', () => {
  for (const cu of ['', undefined, 'rac', 'cm-heshin', 'cm-nova', 'cm-shin', 'cm-eco', 'cm-classic-optimum', 'sonnet-5', 'gpt-sol', 'cl-free']) {
    assert.equal(timModel(cu).id, MA_DEFAULT, String(cu));
  }
  assert.equal(timModel('cl-sonnet-5-5').id, 'cm-sonic');
  assert.equal(timModel('cl-opus-5-5').id, 'cm-optimum');
  assert.equal(timModel('cl-fable-5-1').id, 'cm-invisible');
  assert.equal(giaiDefault().id, MA_DEFAULT);
  /* Từ app: mục ẩn + mã rác ⇒ Pro; mã hợp lệ giữ. */
  assert.equal(chuanHoaMaTuApp(MA_SOLID), MA_DEFAULT);
  assert.equal(chuanHoaMaTuApp('rac'), MA_DEFAULT);
  assert.equal(chuanHoaMaTuApp('cm-classic-sonic'), MA_DEFAULT);
  assert.equal(timModel('cm-classic-sonic').id, MA_DEFAULT, 'rambo tắt ⇒ Pro');
  assert.equal(chuanHoaMaTuApp('cm-optimum'), 'cm-optimum');
  assert.equal(chuanHoaMaTuApp('cl-sonnet-5-5'), 'cm-sonic');
  assert.ok(laDefault('cm-default') && laDefault('') && laDefault('cm-tu-dong'));
  assert.ok(!laDefault('cm-sonic'));
  assert.ok(laMaCuongMini('cm-heshin') && !laMaCuongMini('rac'));
});

test('cổng chính hãng hỏng ⇒ dự phòng ngầm cm-solid; dự phòng hỏng ⇒ về Pro', () => {
  for (const m of bangChoApp()) assert.equal(tuongDuongFree(m)?.id, MA_SOLID, m.id);
  assert.equal(tuongDuongFree(timModel(MA_DEFAULT))?.cong, 'modelapi');
});

test('hạn mức nhóm chỉ Pro (+ dự phòng)', () => {
  assert.ok(dungChoNhom({ id: MA_DEFAULT }));
  assert.ok(dungChoNhom({ id: MA_SOLID }));
  assert.ok(!dungChoNhom({ id: 'cm-sonic' }));
});

test('app đời cũ nhận mã nó hiểu', () => {
  assert.deepEqual(maChoApp(bangChoApp(), 'cm2').map((m) => m.id), ['cm-default', 'cm-sonic', 'cm-optimum', 'cm-invisible']);
  assert.deepEqual(maChoApp(bangChoApp(), 'cm').map((m) => m.id), ['cm-heshin', 'cm-sonic', 'cm-optimum', 'cm-invisible']);
  assert.deepEqual(maChoApp(bangChoApp(), 'cu').map((m) => m.id), ['cl-free', 'cl-sonnet-5-5', 'cl-opus-5-5', 'cl-fable-5-1']);
  assert.equal(maMacDinhCho('cm'), 'cm-heshin');
  for (const ban of ['cu', 'cm', 'cm2'] as const) for (const m of maChoApp(bangChoApp(), ban)) assert.notEqual(chuanHoaMaTuApp(m.id), MA_SOLID);
});

test('câu lỗi gửi app không lộ tên model thật / cổng thật', () => {
  const ra = anTenThat('HTTP 503 No available channel for model gpt-6-sol · claude-haiku-5-5 · rambo.ai.vn · api.anthropic.com · modelapi.vn');
  assert.ok(!/gpt-6-sol|claude-|rambo|anthropic|modelapi/i.test(ra), ra);
});
