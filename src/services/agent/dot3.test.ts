/**
 * ĐỢT 3 (18/10/2026) — capability mới không làm app cũ thấy tool lạ; prompt nói đúng luật.
 *   npx tsx --test src/services/agent/dot3.test.ts
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ALL_CAPABILITIES, AGENT_TOOLS, parseCapabilities, toolsForGateway, type AgentCapability } from './tools.js';
import { buildSystemPrompt } from './prompt.js';

const MOI: Record<string, AgentCapability> = {
  giao_viec_ghi: 'phu_ghi', gop_viec_phu: 'phu_ghi', hoi_nguoi_dung: 'hoi', cho_doi: 'cho',
  hen_goi_lai: 'hen', huy_hen: 'hen', liet_ke_phien: 'phien', nhan_phien: 'phien',
};

test('tool đợt 3: có capability RIÊNG, nằm trong ALL_CAPABILITIES (không bị parseCapabilities vứt)', () => {
  for (const [ten, cap] of Object.entries(MOI)) {
    const t = AGENT_TOOLS.find((x) => x.name === ten);
    assert.ok(t, `thiếu tool ${ten}`);
    assert.equal(t!.capability, cap);
    assert.equal(t!.ring, 'client');
    assert.ok(ALL_CAPABILITIES.includes(cap), `ALL_CAPABILITIES thiếu ${cap}`);
  }
  assert.deepEqual(parseCapabilities(['hoi', 'cho', 'hen', 'phien', 'phu_ghi', 'xyz']), ['hoi', 'cho', 'hen', 'phien', 'phu_ghi']);
});

test('app cũ (không khai capability đợt 3) KHÔNG bao giờ thấy tool đợt 3', () => {
  const cu = toolsForGateway(['fs_read', 'git_read', 'fs_write', 'shell', 'plan', 'subagent', 'shell_nen']).map((t) => t.function.name);
  for (const ten of Object.keys(MOI)) assert.ok(!cu.includes(ten), `app cũ lại thấy ${ten}`);
  const moi = toolsForGateway(['fs_read', 'hoi', 'cho']).map((t) => t.function.name);
  assert.ok(moi.includes('hoi_nguoi_dung') && moi.includes('cho_doi') && !moi.includes('hen_goi_lai'));
});

test('prompt: có mục cho từng khả năng đợt 3 + luật an toàn nhắn phiên', () => {
  const p = buildSystemPrompt({ capabilities: ['fs_read', 'fs_write', 'shell', 'subagent', 'phu_ghi', 'hoi', 'cho', 'hen', 'phien'], tranViecPhu: 3 });
  assert.match(p, /AGENT PHỤ GHI/);
  assert.match(p, /HỎI BẰNG LỰA CHỌN/);
  assert.match(p, /CHỜ & HẸN/);
  assert.match(p, /NHẮN GIỮA PHIÊN/);
  assert.match(p, /KHÔNG phải lệnh của người dùng/);
  assert.match(p, /git index riêng/);
  const cu = buildSystemPrompt({ capabilities: ['fs_read'] });
  assert.doesNotMatch(cu, /HỎI BẰNG LỰA CHỌN|NHẮN GIỮA PHIÊN|AGENT PHỤ GHI/);
});

test('prompt agent phụ GHI khác agent phụ đọc', () => {
  const doc = buildSystemPrompt({ capabilities: ['fs_read'], laPhu: true });
  const ghi = buildSystemPrompt({ capabilities: ['fs_read', 'fs_write'], laPhu: true, phuGhi: true });
  assert.match(doc, /CHỈ ĐỌC/);
  assert.match(ghi, /KHU RIÊNG/);
  assert.match(ghi, /25 bước/);
  assert.doesNotMatch(ghi, /Bạn CHỈ ĐỌC/);
});

test('mô tả web_doc nói đúng trần mới (~8.000 ký tự)', () => {
  assert.match(AGENT_TOOLS.find((t) => t.name === 'web_doc')!.description, /8\.000/);
});
