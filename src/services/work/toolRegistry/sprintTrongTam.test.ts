/**
 * sprint_current khi KHÔNG có sprint ACTIVE (18/10/2026): chọn sprint "trong tâm" để agent vẫn thấy thẻ.
 * Thuần — không CSDL.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { sprintTrongTam } from './planning.js';

const d = (s: string) => new Date(`${s}T03:00:00Z`); // 10:00 giờ VN
const sp = (name: string, a: string | null, b: string | null) => ({ name, startAt: a ? d(a) : null, endAt: b ? d(b) : null });

describe('sprintTrongTam', () => {
  it('không có sprint planned ⇒ null', () => {
    assert.equal(sprintTrongTam([], '2026-10-18'), null);
  });
  it('sprint có ngày PHỦ hôm nay ⇒ chọn nó + cờ đến ngày chưa bắt đầu', () => {
    const r = sprintTrongTam([sp('S3', '2026-11-01', '2026-11-14'), sp('S2', '2026-10-12', '2026-10-25')], '2026-10-18');
    assert.equal(r?.sprint.name, 'S2');
    assert.equal(r?.denNgayChuaBatDau, true);
  });
  it('không sprint nào phủ hôm nay ⇒ sprint SẮP TỚI gần nhất, chưa tới ngày ⇒ không gắn cờ', () => {
    const r = sprintTrongTam([sp('S5', '2026-12-01', '2026-12-14'), sp('S4', '2026-10-20', '2026-11-02'), sp('Cu', '2026-09-01', '2026-09-14')], '2026-10-18');
    assert.equal(r?.sprint.name, 'S4');
    assert.equal(r?.denNgayChuaBatDau, false);
  });
  it('chỉ có sprint đã quá hạn hoặc chưa đặt ngày ⇒ lấy sprint planned đầu tiên', () => {
    const r = sprintTrongTam([sp('Khong ngay', null, null), sp('Cu', '2026-09-01', '2026-09-14')], '2026-10-18');
    assert.equal(r?.sprint.name, 'Khong ngay');
    assert.equal(r?.denNgayChuaBatDau, false);
  });
  it('sprint không có ngày kết thúc, đã tới ngày bắt đầu ⇒ phủ hôm nay', () => {
    const r = sprintTrongTam([sp('Mo', '2026-10-01', null)], '2026-10-18');
    assert.equal(r?.sprint.name, 'Mo');
    assert.equal(r?.denNgayChuaBatDau, true);
  });
});
