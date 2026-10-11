/**
 * Mạng bản tin AI nhiều bot — kiểm thử KẾ HOẠCH (phần thuần).
 *
 * Chạy: npx tsx --test src/services/techTrends/newsBotsSchedule.test.ts
 *
 * Chứng minh: trần chung luôn ≤ cap và ≥ 2 bài/ngày; claude-mini được ưu tiên
 * (số bài ≥ mọi bot khác, và ≥ 1); không bot nào xuất hiện hai lần trong cùng
 * khung giờ; kế hoạch xác định; và các hàm xoay vòng kiểu bài/chủ đề đúng.
 */
import assert from 'node:assert/strict';
import test from 'node:test';

import {
  CLAUDE_POST_TYPES,
  claudePostTypeFor,
  clampDailyCap,
  comparisonForDay,
  COMPARISONS,
  NEWS_BOT_DAILY_MAX,
  NEWS_BOTS_CAP_MAX,
  NEWS_BOTS_CAP_MIN,
  NEWS_BOTS_PRIORITY,
  newsBotsAtSlot,
  planNewsBotsDay,
  SLOTS,
  type NewsBotKey,
} from './cuongMiniSchedule.js';

function daysFrom(start: string, n: number): string[] {
  const base = Date.parse(`${start}T00:00:00Z`);
  return Array.from({ length: n }, (_, i) => new Date(base + i * 86_400_000).toISOString().slice(0, 10));
}
const DAYS = daysFrom('2026-10-11', 120);
const CAPS = [6, 7, 8];

function countByBot(plan: ReturnType<typeof planNewsBotsDay>): Record<string, number> {
  const c: Record<string, number> = {};
  for (const k of NEWS_BOTS_PRIORITY) c[k] = 0;
  for (const p of plan) c[p.botKey]++;
  return c;
}

test('clampDailyCap ép về [6,8], giá trị lạ ⇒ 7', () => {
  assert.equal(clampDailyCap(3), NEWS_BOTS_CAP_MIN);
  assert.equal(clampDailyCap(99), NEWS_BOTS_CAP_MAX);
  assert.equal(clampDailyCap(7), 7);
  assert.equal(clampDailyCap(Number.NaN), 7);
});

test('tổng số bài: ≥2 và ≤ cap mỗi ngày', () => {
  for (const cap of CAPS) {
    for (const d of DAYS) {
      const n = planNewsBotsDay(d, cap).length;
      assert.ok(n >= 2, `ngày ${d} cap ${cap}: chỉ ${n} bài`);
      assert.ok(n <= cap, `ngày ${d} cap ${cap}: ${n} > ${cap}`);
    }
  }
});

test('claude-mini được ưu tiên: số bài ≥ mọi bot khác và ≥ 1', () => {
  for (const cap of CAPS) {
    for (const d of DAYS) {
      const c = countByBot(planNewsBotsDay(d, cap));
      assert.ok(c['claude-mini'] >= 1, `ngày ${d} cap ${cap}: claude-mini = 0`);
      for (const k of NEWS_BOTS_PRIORITY) {
        if (k === 'claude-mini') continue;
        assert.ok(c['claude-mini'] >= c[k], `ngày ${d} cap ${cap}: ${k}(${c[k]}) > claude-mini(${c['claude-mini']})`);
      }
    }
  }
});

test('tôn trọng trần mỗi bot/ngày', () => {
  for (const cap of CAPS) {
    for (const d of DAYS) {
      const c = countByBot(planNewsBotsDay(d, cap));
      for (const k of NEWS_BOTS_PRIORITY) {
        assert.ok(c[k] <= NEWS_BOT_DAILY_MAX[k as NewsBotKey], `ngày ${d} cap ${cap}: ${k} vượt trần`);
      }
    }
  }
});

test('khung giờ hợp lệ & không bot nào lặp lại trong cùng khung', () => {
  for (const cap of CAPS) {
    for (const d of DAYS) {
      const plan = planNewsBotsDay(d, cap);
      const perSlot = new Map<number, Set<string>>();
      for (const p of plan) {
        assert.ok(p.slotIndex >= 0 && p.slotIndex < SLOTS.length, 'slotIndex trong 0..4');
        assert.equal(p.slot, SLOTS[p.slotIndex], 'slot khớp slotIndex');
        assert.ok(NEWS_BOTS_PRIORITY.includes(p.botKey), 'botKey hợp lệ');
        let set = perSlot.get(p.slotIndex);
        if (!set) { set = new Set(); perSlot.set(p.slotIndex, set); }
        assert.ok(!set.has(p.botKey), `ngày ${d}: ${p.botKey} xuất hiện 2 lần ở khung ${p.slot}`);
        set.add(p.botKey);
      }
    }
  }
});

test('seq của mỗi bot liền mạch 0..k-1 (để xoay kiểu bài)', () => {
  for (const cap of CAPS) {
    for (const d of DAYS.slice(0, 30)) {
      const plan = planNewsBotsDay(d, cap);
      const seqs: Record<string, number[]> = {};
      for (const p of plan) (seqs[p.botKey] ??= []).push(p.seq);
      for (const [k, arr] of Object.entries(seqs)) {
        const sorted = [...arr].sort((a, b) => a - b);
        assert.deepEqual(sorted, arr.length ? Array.from({ length: arr.length }, (_, i) => i) : [], `seq của ${k} không liền mạch`);
      }
    }
  }
});

test('planNewsBotsDay xác định (gọi lại y hệt)', () => {
  for (const cap of CAPS) {
    for (const d of DAYS.slice(0, 20)) {
      assert.deepEqual(planNewsBotsDay(d, cap), planNewsBotsDay(d, cap));
    }
  }
});

test('newsBotsAtSlot = planNewsBotsDay lọc theo khung giờ', () => {
  for (const d of DAYS.slice(0, 40)) {
    const plan = planNewsBotsDay(d, 7);
    for (const slot of SLOTS) {
      assert.deepEqual(newsBotsAtSlot(d, slot, 7), plan.filter((p) => p.slot === slot));
    }
  }
});

test('claudePostTypeFor: luôn là 1 trong 4 kiểu, và quét ĐỦ 4 kiểu theo thời gian', () => {
  const seen = new Set<string>();
  for (const d of DAYS) {
    for (let seq = 0; seq < 3; seq++) {
      const t = claudePostTypeFor(d, seq);
      assert.ok((CLAUDE_POST_TYPES as readonly string[]).includes(t), `${t} không hợp lệ`);
      seen.add(t);
    }
  }
  assert.equal(seen.size, CLAUDE_POST_TYPES.length, 'phải chạm đủ cả 4 kiểu bài');
});

test('claudePostTypeFor: 4 ngày liên tiếp (cùng seq) ra đủ 4 kiểu khác nhau', () => {
  const four = daysFrom('2026-11-01', 4).map((d) => claudePostTypeFor(d, 0));
  assert.equal(new Set(four).size, 4, 'xoay vòng phải phủ cả 4 kiểu');
});

test('comparisonForDay: chủ đề hợp lệ, không trùng trong cùng ngày, xoay vòng theo thời gian', () => {
  const used = new Set<string>();
  for (const d of DAYS) {
    const a = comparisonForDay(d, 0);
    const b = comparisonForDay(d, 1);
    assert.ok(COMPARISONS.some((t) => t.slug === a.slug), 'chủ đề nằm trong danh sách');
    assert.notEqual(a.slug, b.slug, `ngày ${d}: hai bài so sánh cùng chủ đề`);
    used.add(a.slug); used.add(b.slug);
  }
  assert.ok(used.size >= Math.ceil(COMPARISONS.length * 0.7), `chỉ dùng ${used.size}/${COMPARISONS.length} chủ đề`);
});
