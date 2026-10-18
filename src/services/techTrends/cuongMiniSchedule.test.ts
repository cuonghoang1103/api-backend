/**
 * CuongMini — kiểm thử LỊCH (phần thuần).
 *
 * Chạy: npx tsx --test src/services/techTrends/cuongMiniSchedule.test.ts
 *
 * Mục tiêu: chứng minh 5 khung giờ ⇒ 2–3 bài/ngày, đúng MỘT bài tổng hợp, các
 * bài so sánh KHÔNG trùng nhau trong ngày và XOAY VÒNG theo ngày; và
 * `shouldPostAtSlot` khớp đúng `planDay`.
 */
import assert from 'node:assert/strict';
import test from 'node:test';

import {
  COMPARISONS,
  SLOTS,
  planDay,
  postsPerDay,
  shouldPostAtSlot,
} from './cuongMiniSchedule.js';

function daysFrom(start: string, n: number): string[] {
  const base = Date.parse(`${start}T00:00:00Z`);
  return Array.from({ length: n }, (_, i) =>
    new Date(base + i * 86_400_000).toISOString().slice(0, 10),
  );
}

const DAYS = daysFrom('2026-10-11', 120);

test('postsPerDay luôn là 2 hoặc 3', () => {
  for (const d of DAYS) {
    const n = postsPerDay(d);
    assert.ok(n === 2 || n === 3, `ngày ${d} trả ${n}`);
  }
});

test('cả hai số 2 và 3 đều xuất hiện trên khoảng dài', () => {
  const counts = new Set(DAYS.map((d) => postsPerDay(d)));
  assert.ok(counts.has(2) && counts.has(3), 'phải có cả ngày 2 bài lẫn ngày 3 bài');
});

test('planDay: 2–3 bài, khung giờ hợp lệ & không trùng & đã sắp xếp', () => {
  for (const d of DAYS) {
    const plan = planDay(d);
    assert.ok(plan.length >= 2 && plan.length <= 3, `ngày ${d} có ${plan.length} bài`);
    assert.equal(plan.length, postsPerDay(d), 'khớp postsPerDay');

    const idxs = plan.map((p) => p.slotIndex);
    assert.equal(new Set(idxs).size, idxs.length, 'khung giờ không trùng');
    for (const i of idxs) assert.ok(i >= 0 && i < SLOTS.length, 'index trong 0..4');
    assert.deepEqual([...idxs].sort((a, b) => a - b), idxs, 'đã sắp xếp tăng dần');
    for (const p of plan) assert.equal(p.slot, SLOTS[p.slotIndex], 'slot khớp slotIndex');
  }
});

test('mỗi ngày có ĐÚNG một bài tổng hợp, còn lại là so sánh', () => {
  for (const d of DAYS) {
    const plan = planDay(d);
    const digests = plan.filter((p) => p.mode === 'digest');
    const comparisons = plan.filter((p) => p.mode === 'comparison');
    assert.equal(digests.length, 1, `ngày ${d} phải có đúng 1 digest`);
    assert.equal(comparisons.length, plan.length - 1, 'còn lại là comparison');
    for (const c of comparisons) {
      assert.ok(c.comparison, 'bài so sánh phải có chủ đề');
      assert.ok(COMPARISONS.some((t) => t.slug === c.comparison!.slug), 'chủ đề nằm trong danh sách tuyển');
    }
  }
});

test('các chủ đề so sánh trong CÙNG ngày không trùng nhau', () => {
  for (const d of DAYS) {
    const slugs = planDay(d).filter((p) => p.mode === 'comparison').map((p) => p.comparison!.slug);
    assert.equal(new Set(slugs).size, slugs.length, `ngày ${d} có chủ đề so sánh trùng`);
  }
});

test('chủ đề so sánh XOAY VÒNG qua nhiều mục theo thời gian', () => {
  const used = new Set<string>();
  for (const d of DAYS) {
    for (const p of planDay(d)) if (p.mode === 'comparison') used.add(p.comparison!.slug);
  }
  // Qua 120 ngày phải chạm phần lớn danh sách, không kẹt ở vài chủ đề.
  assert.ok(used.size >= Math.ceil(COMPARISONS.length * 0.7), `chỉ dùng ${used.size}/${COMPARISONS.length} chủ đề`);
});

test('planDay xác định (gọi lại cho kết quả y hệt)', () => {
  for (const d of DAYS.slice(0, 20)) {
    assert.deepEqual(planDay(d), planDay(d));
  }
});

test('shouldPostAtSlot khớp đúng planDay cho cả 5 khung giờ', () => {
  for (const d of DAYS.slice(0, 40)) {
    const plan = planDay(d);
    const scheduled = new Set(plan.map((p) => p.slot));
    for (const slot of SLOTS) {
      const got = shouldPostAtSlot(d, slot);
      if (scheduled.has(slot)) {
        assert.ok(got, `ngày ${d} khung ${slot} phải có kế hoạch`);
        assert.equal(got!.slot, slot);
      } else {
        assert.equal(got, null, `ngày ${d} khung ${slot} KHÔNG được đăng`);
      }
    }
  }
});

test('mọi chủ đề so sánh có slug duy nhất và URL chính thức đủ cả hai bên', () => {
  const slugs = COMPARISONS.map((t) => t.slug);
  assert.equal(new Set(slugs).size, slugs.length, 'slug phải duy nhất');
  for (const t of COMPARISONS) {
    assert.match(t.a.url, /^https:\/\//, `${t.slug}: thiếu URL A`);
    assert.match(t.b.url, /^https:\/\//, `${t.slug}: thiếu URL B`);
  }
});
