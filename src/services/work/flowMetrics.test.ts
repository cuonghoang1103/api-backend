/**
 * UX-B — số liệu dòng chảy, hàm thuần: npx tsx --test src/services/work/flowMetrics.test.ts
 * Mọi đáp án dựng tay (đếm trên giấy), không lấy từ chính hàm đang kiểm.
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  cfdBands, computeAgingWip, computeCfd, computeCycleTimes, computeReleaseBurnup, computeThroughput, dayRange, mondayOfDay,
  percentile, percentiles, rollingAverage, segments, valueAt, type FieldChange, type FlowIssue, type FlowStatus,
} from './flowMetrics.js';

const TZ = 'Asia/Ho_Chi_Minh';
/** Giờ VN → Date. */
const vn = (s: string) => new Date(`${s}+07:00`);

// Quy trình: To Do(1) → In Progress(2) → In Review(3) → Done(4); quy trình Bug có "In Progress"(12) trùng tên.
const statuses: FlowStatus[] = [
  { id: 1, name: 'To Do', category: 'TODO', position: 0, isDefaultWorkflow: true },
  { id: 2, name: 'In Progress', category: 'IN_PROGRESS', position: 1, isDefaultWorkflow: true },
  { id: 3, name: 'In Review', category: 'IN_PROGRESS', position: 2, isDefaultWorkflow: true },
  { id: 4, name: 'Done', category: 'DONE', position: 3, isDefaultWorkflow: true },
  { id: 12, name: 'In progress', category: 'IN_PROGRESS', position: 1 },
];
const statusCat = new Map(statuses.map((s) => [s.id, s.category]));
const ch = (issueId: number, from: number | null, to: number | null, at: string): FieldChange => ({ issueId, from: from === null ? null : String(from), to: to === null ? null : String(to), at: vn(at) });

describe('percentile — nội suy tuyến tính (PERCENTILE.INC)', () => {
  it('đáp án tay', () => {
    const x = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    // h = 9·0.5 = 4.5 ⇒ 5 + 0.5·(6−5) = 5.5
    assert.equal(percentile(x, 0.5), 5.5);
    // h = 9·0.85 = 7.65 ⇒ 8 + 0.65·1 = 8.65
    assert.ok(Math.abs(percentile(x, 0.85)! - 8.65) < 1e-9);
    // h = 9·0.95 = 8.55 ⇒ 9.55
    assert.ok(Math.abs(percentile(x, 0.95)! - 9.55) < 1e-9);
    assert.equal(percentile([], 0.5), null);
    assert.equal(percentile([7], 0.95), 7);
    // không phụ thuộc thứ tự đầu vào
    assert.equal(percentile([10, 1, 5], 0.5), 5);
  });
  it('percentiles làm tròn 1 chữ số + trung bình', () => {
    assert.deepEqual(percentiles([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]), { n: 10, p50: 5.5, p85: 8.7, p95: 9.6, mean: 5.5 });
  });
});

describe('segments / valueAt — phát lại lịch sử', () => {
  it('trạng thái ban đầu lấy từ vế from của lần đổi đầu tiên', () => {
    const segs = segments(vn('2026-10-01T09:00:00'), 4, [ch(1, 1, 2, '2026-10-02T09:00:00'), ch(1, 2, 4, '2026-10-03T09:00:00')], (s) => (s === null ? null : Number(s)));
    assert.equal(valueAt(segs, vn('2026-09-30T00:00:00')), undefined);
    assert.equal(valueAt(segs, vn('2026-10-01T23:00:00')), 1);
    assert.equal(valueAt(segs, vn('2026-10-02T10:00:00')), 2);
    assert.equal(valueAt(segs, vn('2026-10-04T00:00:00')), 4);
  });
});

describe('CFD — đếm theo dải lúc cuối ngày', () => {
  // A: tạo 01/10 (To Do) → 02/10 In Progress → 04/10 Done
  // B: tạo 02/10 (To Do) → 03/10 In Review
  // C: tạo 03/10, không đổi gì (hiện ở To Do)
  // D: bug tạo 01/10 ở "In progress"(12) quy trình Bug, không đổi ⇒ gộp vào dải "In Progress"
  const issues: FlowIssue[] = [
    { id: 1, number: 1, createdAt: vn('2026-10-01T09:00:00'), resolvedAt: vn('2026-10-04T15:00:00'), statusId: 4 },
    { id: 2, number: 2, createdAt: vn('2026-10-02T09:00:00'), resolvedAt: null, statusId: 3 },
    { id: 3, number: 3, createdAt: vn('2026-10-03T09:00:00'), resolvedAt: null, statusId: 1 },
    { id: 4, number: 4, createdAt: vn('2026-10-01T10:00:00'), resolvedAt: null, statusId: 12 },
  ];
  const changes = [ch(1, 1, 2, '2026-10-02T10:00:00'), ch(1, 2, 4, '2026-10-04T15:00:00'), ch(2, 1, 3, '2026-10-03T11:00:00')];
  const r = computeCfd({ days: dayRange('2026-10-01', '2026-10-04'), tz: TZ, statuses, issues, statusChanges: changes });
  it('dải gộp trạng thái trùng tên, sắp TODO → IN_PROGRESS → DONE', () => {
    assert.deepEqual(r.bands.map((b) => b.name), ['To Do', 'In Progress', 'In Review', 'Done']);
    assert.deepEqual(r.bands[1].statusIds, [2, 12]);
  });
  it('số đếm từng ngày đúng đáp án tay', () => {
    const rows = r.points.map((p) => [p.day, p.s1, p.s2, p.s3, p.s4]);
    assert.deepEqual(rows, [
      ['2026-10-01', 1, 1, 0, 0], // A To Do, D In progress
      ['2026-10-02', 1, 2, 0, 0], // A In Progress, B To Do, D
      ['2026-10-03', 1, 2, 1, 0], // A, D In Progress · B In Review · C To Do
      ['2026-10-04', 1, 1, 1, 1], // A Done
    ]);
  });
  it('tổng mỗi ngày = số thẻ đã tạo tới cuối ngày', () => {
    const totals = r.points.map((p) => Number(p.s1) + Number(p.s2) + Number(p.s3) + Number(p.s4));
    assert.deepEqual(totals, [2, 3, 4, 4]);
  });
  it('cfdBands: quy trình mặc định đặt tên dải', () => {
    assert.equal(cfdBands([...statuses].reverse())[1].name, 'In Progress');
  });
});

describe('cycle / lead time', () => {
  // X: tạo 01/10 09:00, vào In Progress 03/10 09:00, Done 05/10 21:00 ⇒ cycle 2.5 ngày, lead 4.5 ngày
  // Y: tạo 01/10 09:00, To Do → Done thẳng 02/10 09:00 ⇒ cycle null, lead 1
  // Z: tạo 02/10 09:00, In Review 02/10 09:00 (nhóm IN_PROGRESS) → In Progress 03/10 → Done 08/10 09:00 ⇒ cycle 6, lead 6
  const issues: FlowIssue[] = [
    { id: 1, number: 11, createdAt: vn('2026-10-01T09:00:00'), resolvedAt: vn('2026-10-05T21:00:00'), statusId: 4 },
    { id: 2, number: 12, createdAt: vn('2026-10-01T09:00:00'), resolvedAt: vn('2026-10-02T09:00:00'), statusId: 4 },
    { id: 3, number: 13, createdAt: vn('2026-10-02T09:00:00'), resolvedAt: vn('2026-10-08T09:00:00'), statusId: 4 },
    { id: 4, number: 14, createdAt: vn('2026-10-02T09:00:00'), resolvedAt: null, statusId: 2 },
  ];
  const changes = [
    ch(1, 1, 2, '2026-10-03T09:00:00'), ch(1, 2, 4, '2026-10-05T21:00:00'),
    ch(2, 1, 4, '2026-10-02T09:00:00'),
    ch(3, 1, 3, '2026-10-02T09:00:00'), ch(3, 3, 2, '2026-10-03T09:00:00'), ch(3, 2, 4, '2026-10-08T09:00:00'),
  ];
  const r = computeCycleTimes({ issues, statusChanges: changes, statusCat, tz: TZ });
  it('từng thẻ', () => {
    assert.deepEqual(r.items.map((x) => [x.number, x.cycleDays, x.leadDays, x.day]), [
      [12, null, 1, '2026-10-02'],
      [11, 2.5, 4.5, '2026-10-05'],
      [13, 6, 6, '2026-10-08'],
    ]);
  });
  it('phân vị: cycle trên [2.5, 6], lead trên [1, 4.5, 6]', () => {
    // cycle: p50 = 2.5 + 0.5·3.5 = 4.25 → 4.3 · p85 = 2.5 + 0.85·3.5 = 5.475 → 5.5 · p95 = 5.825 → 5.8
    assert.deepEqual(r.cycle, { n: 2, p50: 4.3, p85: 5.5, p95: 5.8, mean: 4.3 });
    // lead (1, 4.5, 6): p50 = 4.5 · p85: h=1.7 ⇒ 4.5+0.7·1.5 = 5.55 → 5.6 · p95: h=1.9 ⇒ 5.85 → 5.9
    assert.deepEqual(r.lead, { n: 3, p50: 4.5, p85: 5.6, p95: 5.9, mean: 3.8 });
  });
  it('lọc theo khoảng resolvedAt', () => {
    const r2 = computeCycleTimes({ issues, statusChanges: changes, statusCat, tz: TZ, from: vn('2026-10-03T00:00:00') });
    assert.deepEqual(r2.items.map((x) => x.number), [11, 13]);
  });
});

describe('throughput theo tuần (thứ Hai → CN, giờ VN)', () => {
  it('mondayOfDay', () => {
    assert.equal(mondayOfDay('2026-10-10'), '2026-10-05'); // thứ Bảy
    assert.equal(mondayOfDay('2026-10-11'), '2026-10-05'); // Chủ nhật
    assert.equal(mondayOfDay('2026-10-12'), '2026-10-12'); // thứ Hai
  });
  it('đếm + điểm, tuần hiện tại không vào trung bình', () => {
    const mk = (id: number, at: string, est: number): FlowIssue => ({ id, number: id, createdAt: vn('2026-09-01T09:00:00'), resolvedAt: vn(at), statusId: 4, estimate: est });
    const issues = [
      mk(1, '2026-09-21T10:00:00', 3), // tuần 21/09
      mk(2, '2026-09-27T23:30:00', 2), // CN 27/09 23:30 VN (= 16:30Z) ⇒ vẫn tuần 21/09
      mk(3, '2026-09-28T00:30:00', 5), // thứ Hai 28/09 00:30 VN (= 27/09 17:30Z) ⇒ tuần 28/09
      mk(4, '2026-10-06T10:00:00', 1), // tuần 05/10 (hiện tại)
      mk(5, '2026-08-01T10:00:00', 8), // ngoài khoảng
      { id: 6, number: 6, createdAt: vn('2026-09-01T09:00:00'), resolvedAt: null, statusId: 2 },
    ];
    const r = computeThroughput({ issues, tz: TZ, today: '2026-10-10', weeks: 4 });
    assert.deepEqual(r.weeks.map((w) => [w.week, w.count, w.points]), [
      ['2026-09-14', 0, 0], ['2026-09-21', 2, 5], ['2026-09-28', 1, 5], ['2026-10-05', 1, 1],
    ]);
    // TB 3 tuần trọn: (0 + 2 + 1)/3 = 1 · điểm (0 + 5 + 5)/3 = 3.3
    assert.equal(r.average, 1);
    assert.equal(r.averagePoints, 3.3);
  });
});

describe('aging WIP', () => {
  it('tuổi tính từ lúc vào đoạn IN_PROGRESS hiện tại; quay lại To Do thì đếm lại', () => {
    const now = vn('2026-10-10T09:00:00');
    const issues: FlowIssue[] = [
      // vào In Progress 05/10 09:00, sang In Review 08/10 (vẫn nhóm IN_PROGRESS) ⇒ tuổi 5 ngày
      { id: 1, number: 1, createdAt: vn('2026-10-01T09:00:00'), resolvedAt: null, statusId: 3 },
      // In Progress 02/10 → To Do 04/10 → In Progress 09/10 09:00 ⇒ 1 ngày
      { id: 2, number: 2, createdAt: vn('2026-10-01T09:00:00'), resolvedAt: null, statusId: 2 },
      // To Do ⇒ không phải WIP
      { id: 3, number: 3, createdAt: vn('2026-10-01T09:00:00'), resolvedAt: null, statusId: 1 },
      // tạo thẳng ở In Progress 07/10 21:00, không lịch sử ⇒ 2.5 ngày
      { id: 4, number: 4, createdAt: vn('2026-10-07T21:00:00'), resolvedAt: null, statusId: 2 },
    ];
    const changes = [
      ch(1, 1, 2, '2026-10-05T09:00:00'), ch(1, 2, 3, '2026-10-08T09:00:00'),
      ch(2, 1, 2, '2026-10-02T09:00:00'), ch(2, 2, 1, '2026-10-04T09:00:00'), ch(2, 1, 2, '2026-10-09T09:00:00'),
    ];
    const bands = cfdBands(statuses);
    const r = computeAgingWip({ issues, statusChanges: changes, statusCat, bands, now });
    assert.deepEqual(r.map((x) => [x.number, x.ageDays, x.band]), [[1, 5, 's3'], [4, 2.5, 's2'], [2, 1, 's2']]);
  });
});

describe('release burnup', () => {
  // Version 7. P: 3 điểm, gắn từ đầu, Done 03/10. Q: 5 điểm, gắn vào version ngày 02/10, chưa xong.
  // R: 2 điểm, gắn từ đầu, gỡ khỏi version 03/10. S: 1 điểm, version khác.
  const issues: FlowIssue[] = [
    { id: 1, number: 1, createdAt: vn('2026-10-01T08:00:00'), resolvedAt: vn('2026-10-03T10:00:00'), statusId: 4, estimate: 3, fixVersionId: 7 },
    { id: 2, number: 2, createdAt: vn('2026-10-01T08:00:00'), resolvedAt: null, statusId: 2, estimate: 5, fixVersionId: 7 },
    { id: 3, number: 3, createdAt: vn('2026-10-01T08:00:00'), resolvedAt: null, statusId: 1, estimate: 2, fixVersionId: null },
    { id: 4, number: 4, createdAt: vn('2026-10-01T08:00:00'), resolvedAt: null, statusId: 1, estimate: 1, fixVersionId: 8 },
  ];
  const versionChanges = [ch(2, null, 7, '2026-10-02T09:00:00'), ch(3, 7, null, '2026-10-03T09:00:00')];
  const statusChanges = [ch(1, 1, 4, '2026-10-03T10:00:00'), ch(2, 1, 2, '2026-10-02T12:00:00')];
  it('phạm vi / xong / còn lại theo điểm + đường lý tưởng', () => {
    const r = computeReleaseBurnup({ versionId: 7, days: dayRange('2026-10-01', '2026-10-04'), tz: TZ, issues, versionChanges, statusChanges, statusCat, byCount: false, releaseDay: '2026-10-05' });
    assert.deepEqual(r.map((p) => [p.day, p.scope, p.done, p.remaining, p.ideal]), [
      ['2026-10-01', 5, 0, 5, 5],      // P + R; ideal 5 → 0 trong 4 ngày
      ['2026-10-02', 10, 0, 10, 3.8],  // + Q
      ['2026-10-03', 8, 3, 5, 2.5],    // − R, P xong
      ['2026-10-04', 8, 3, 5, 1.3],
    ]);
  });
  it('theo số thẻ', () => {
    const r = computeReleaseBurnup({ versionId: 7, days: ['2026-10-03'], tz: TZ, issues, versionChanges, statusChanges, statusCat, byCount: true });
    assert.deepEqual([r[0].scope, r[0].done, r[0].ideal], [2, 1, null]);
  });
});

describe('velocity — trung bình trượt 3 sprint', () => {
  it('đáp án tay', () => {
    assert.deepEqual(rollingAverage([10, 20, 30, 40]), [10, 15, 20, 30]);
    assert.deepEqual(rollingAverage([]), []);
    assert.deepEqual(rollingAverage([5, 6], 3), [5, 5.5]);
  });
});

describe('dayRange', () => {
  it('gồm hai đầu, trần giữ phần gần đây', () => {
    assert.deepEqual(dayRange('2026-10-01', '2026-10-03'), ['2026-10-01', '2026-10-02', '2026-10-03']);
    assert.deepEqual(dayRange('2026-01-01', '2026-10-03', 2), ['2026-10-02', '2026-10-03']);
    assert.deepEqual(dayRange('2026-10-05', '2026-10-03'), []);
  });
});
