/**
 * QA đợt 6 (e14d0a60): máy chủ chỉ trả mã `cm-*` khi app gửi `?bang=cm`; thiếu cờ ⇒ nhận mã CŨ (gpt-sol, cl-*) và MẤT
 * Nova/Shin/Eco. Mọi chỗ app MỚI gọi `GET /agent/tools` / `GET /agent/cong-anthropic` phải gửi cờ — test đọc nguồn.
 * (NutCuongMiniCli chỉ đọc `pro`, không đọc mã model — vẫn bắt gửi để không ai sao chép nhầm chỗ đó đi đọc `models`.)
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const goc = path.resolve(__dirname, '../../..');
const NGUON = [
  'src/main/ipc/agent.ts',
  'src/main/agent/lenhMayChu.ts',
  'src/renderer/features/chat/NutCuongMiniCli.tsx',
];

describe('app mới gửi ?bang=cm ở mọi lời gọi danh sách model', () => {
  for (const f of NGUON) {
    it(f, () => {
      const s = readFileSync(path.join(goc, f), 'utf8');
      const goi = [...s.matchAll(/\/api\/v1\/agent\/(tools|cong-anthropic)(?!\/)([^'"`\n]*)/g)];
      expect(goi.length, `${f} phải có lời gọi /agent/tools hoặc /agent/cong-anthropic`).toBeGreaterThan(0);
      for (const m of goi) {
        const dong = s.slice(Math.max(0, (m.index ?? 0) - 400), (m.index ?? 0) + 200);
        expect(/bang=cm|set\('bang', 'cm'\)/.test(dong), `${f}: ${m[0]} thiếu ?bang=cm`).toBe(true);
      }
    });
  }
});
