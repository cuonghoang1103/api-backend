/**
 * Chế độ đóng vai (27/11/2026) — phần thuần của vaiDong.ts.
 *   npx tsx --test src/services/work/vaiDong.test.ts
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  cauNhacTraiVai, chayVoiVai, kiemVaiKhai, nhacTraiVai, nhanVai, normalizeSoloSettings, notAssigneeTheoVai, parseVai,
  soloRolesOf, tacGiaDuocDuyet, tenTheoVai, vaiYeuCau, GOI_Y_VAI, HATS,
} from './vaiDong.js';

describe('vaiDong — phần thuần', () => {
  it('parseVai nhận C3/c3/3/BE/QA, rỗng ⇒ null, lạ ⇒ INVALID', () => {
    assert.equal(parseVai('C3'), 'C3');
    assert.equal(parseVai('c5'), 'C5');
    assert.equal(parseVai('2'), 'C2');
    assert.equal(parseVai('C3 Dev BE'), 'C3'); // nhãn option của trường Role
    assert.equal(parseVai('BE'), 'C3');
    assert.equal(parseVai('qa'), 'C5');
    assert.equal(parseVai('Leader'), 'C1');
    assert.equal(parseVai(''), null);
    assert.equal(parseVai(undefined), null);
    assert.equal(parseVai('none'), null);
    assert.equal(parseVai('C6'), 'INVALID');
    assert.equal(parseVai('admin'), 'INVALID');
    assert.equal(parseVai(['C4', 'C1']), 'C4');
  });

  it('kiemVaiKhai: lạ ⇒ 400 WORK_BAD_ROLE, agent có vai ⇒ 403 WORK_ROLE_AGENT, agent không vai ⇒ null', () => {
    assert.throws(() => kiemVaiKhai('C9', false), (e: any) => e.statusCode === 400 && e.code === 'WORK_BAD_ROLE');
    assert.throws(() => kiemVaiKhai('C5', true), (e: any) => e.statusCode === 403 && e.code === 'WORK_ROLE_AGENT');
    assert.equal(kiemVaiKhai(undefined, true), null);
    assert.equal(kiemVaiKhai('C1', false), 'C1');
  });

  it('tác giả tự duyệt: chỉ khi đóng vai KHÁC mọi vai tác giả đã ghi', () => {
    assert.equal(tacGiaDuocDuyet(['C3'], 'C5'), true);
    assert.equal(tacGiaDuocDuyet(['C3'], 'C3'), false, 'cùng vai bị chặn');
    assert.equal(tacGiaDuocDuyet(['C3'], null), false, 'không vai ⇒ hành vi cũ (chặn)');
    assert.equal(tacGiaDuocDuyet([null], 'C5'), false, 'dòng tác giả không ghi vai ⇒ không đoán, chặn');
    assert.equal(tacGiaDuocDuyet(['C3', 'C4'], 'C4'), false);
    assert.equal(tacGiaDuocDuyet(['C3', 'C4'], 'C5'), true);
    assert.equal(tacGiaDuocDuyet([], 'C5'), false);
  });

  it('notAssignee theo vai của thẻ', () => {
    assert.equal(notAssigneeTheoVai('C3', 'C5'), 'allow');
    assert.equal(notAssigneeTheoVai('C3', 'C3'), 'same-role');
    assert.equal(notAssigneeTheoVai(null, 'C5'), 'no-card-role');
    assert.equal(notAssigneeTheoVai('C3', null), 'no-role');
  });

  it('nhắc trái vai: tạo test case khi đang C3 ⇒ C5; đúng vai / đọc ⇒ không nhắc', () => {
    assert.deepEqual(nhacTraiVai('/tests', 'C3'), ['C5']);
    assert.deepEqual(nhacTraiVai('/test-cycles/4/runs', 'C4'), ['C5']);
    assert.deepEqual(nhacTraiVai('test_create', 'C3'), ['C5']);
    assert.deepEqual(nhacTraiVai('fpt_unit_add_cases', 'C2'), ['C5']);
    assert.equal(nhacTraiVai('/tests', 'C5'), null);
    assert.equal(nhacTraiVai('/tests', 'C3', false), null, 'lệnh đọc không nhắc');
    assert.deepEqual(nhacTraiVai('/sprints', 'C3'), ['C1']);
    assert.equal(nhacTraiVai('/swr/requirements', 'C1'), null, 'C1 cũng làm yêu cầu được');
    assert.deepEqual(nhacTraiVai('/srs/use-cases', 'C5'), ['C2', 'C1']);
    assert.equal(nhacTraiVai('/issues/12/comments', 'C3'), null, 'việc chung không thuộc vai nào');
    assert.equal(nhacTraiVai('/tests', null), null);
    assert.match(cauNhacTraiVai('C3', ['C5']), /acting as C3 · BE.*C5 · QA/);
  });

  it('tên theo vai: luôn là MỘT người kèm vai trong ngoặc', () => {
    assert.equal(tenTheoVai('Nguyễn Văn A', 'C3'), 'Nguyễn Văn A (role C3 · BE)');
    assert.equal(tenTheoVai('Nguyễn Văn A', 'C5', 'vi'), 'Nguyễn Văn A (vai C5 · QA)');
    assert.equal(tenTheoVai('Nguyễn Văn A', null), 'Nguyễn Văn A');
    assert.equal(tenTheoVai('', 'C1'), '');
    assert.equal(nhanVai('C1'), 'C1 · PM');
    for (const h of HATS) assert.ok(GOI_Y_VAI[h].includes(h), `gợi ý vai ${h}`);
  });

  it('settings: chỉ enabled === true mới bật; null/khác ⇒ tắt', () => {
    assert.deepEqual(soloRolesOf({ soloRoles: { enabled: true } }), { enabled: true });
    assert.deepEqual(soloRolesOf({ soloRoles: { enabled: 'yes' } }), { enabled: false });
    assert.deepEqual(soloRolesOf(null), { enabled: false });
    assert.deepEqual(normalizeSoloSettings({ soloRoles: { enabled: true, x: 1 } }), { soloRoles: { enabled: true } });
    assert.deepEqual(normalizeSoloSettings({ soloRoles: { enabled: false } }), { soloRoles: null });
    assert.deepEqual(normalizeSoloSettings({ a: 1 }), { a: 1 });
  });

  it('ngữ cảnh yêu cầu: vai sống trong chayVoiVai, ra ngoài thì mất', async () => {
    assert.equal(vaiYeuCau(), null);
    await chayVoiVai('C4', async () => {
      await new Promise((r) => setTimeout(r, 1));
      assert.equal(vaiYeuCau(), 'C4');
      await chayVoiVai('C5', async () => assert.equal(vaiYeuCau(), 'C5'));
      assert.equal(vaiYeuCau(), 'C4');
    });
    assert.equal(vaiYeuCau(), null);
  });
});
