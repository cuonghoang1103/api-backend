/**
 * MÃ GIA HẠN THEO $ (19/10/2026) — lõi chung (desktop · CLI · VS Code):
 *   • thông tin thẻ (`giaHanTien`) đi từ khung lỗi SSE / HTTP 429 tới sự kiện `loi`;
 *   • kênh `agent:giaHanTien` / `agent:giaHanTienKiem` có schema chặt, mở cho VS Code (qua app);
 *   • mã không lưu, không log; app tự kiểm lại ≥ 30 s; lỗi chạm trần KHÔNG tự thử lại.
 * Đọc nguồn cho phần cần máy chủ SSE thật; schema zod chạy thật.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';
import { INVOKE_CHANNELS } from '../../shared/ipc';

const loop = readFileSync(join(import.meta.dirname, 'loop.ts'), 'utf8');
const ipcAgent = readFileSync(join(import.meta.dirname, '..', 'ipc', 'agent.ts'), 'utf8');
const cauNoi = readFileSync(join(import.meta.dirname, '..', 'cauNoiVscode.ts'), 'utf8');
const the = readFileSync(join(import.meta.dirname, '..', '..', 'renderer', 'features', 'chat', 'NhapMaGiaHanTien.tsx'), 'utf8');
const agentMode = readFileSync(join(import.meta.dirname, '..', '..', 'renderer', 'features', 'chat', 'AgentMode.tsx'), 'utf8');

describe('mã gia hạn theo $ — lõi', () => {
  it('giaHanTien đi từ khung SSE `error` VÀ từ HTTP 429 (NHOM_HET_TRAN) tới sự kiện `loi`', () => {
    expect(loop).toMatch(/laGiaHanTien\(e\.giaHanTien\) \? \{ giaHanTien: e\.giaHanTien \}/);
    expect(loop).toMatch(/laGiaHanTien\(loiThan\.data\?\.giaHanTien\) \? \{ giaHanTien: loiThan\.data\.giaHanTien \}/);
    expect(loop).toMatch(/phanHoi\.giaHanTien \? \{ giaHanTien: phanHoi\.giaHanTien \}/);
  });

  it('chạm trần tiền KHÔNG tự thử lại (người dùng phải nhập mã / chờ duyệt)', () => {
    const i = loop.indexOf('const MA_DANG_THU_LAI');
    const than = loop.slice(i, loop.indexOf(']);', i));
    for (const ma of ['NHOM_HET_TRAN', 'CUONGMINI_HET_TRAN', 'AGENT_BUDGET_EXCEEDED', 'CONG_ANTHROPIC_HET_HAN_MUC']) expect(than).not.toContain(ma);
  });

  it('schema kênh: mã 1–200 ký tự, trần ≤ 60, id dương; cuocId (VS Code gửi kèm) bị bỏ', () => {
    const s = INVOKE_CHANNELS['agent:giaHanTien'];
    const ok = s.safeParse({ ma: 'MA-123456', tran: 'model:cm-solid', cuocId: 'c1' });
    expect(ok.success).toBe(true);
    expect(ok.success && ok.data).toEqual({ ma: 'MA-123456', tran: 'model:cm-solid' });
    expect(s.safeParse({ ma: '', tran: 'vi' }).success).toBe(false);
    expect(s.safeParse({ ma: 'x'.repeat(201), tran: 'vi' }).success).toBe(false);
    expect(s.safeParse({ ma: 'abc123', tran: 'x'.repeat(61) }).success).toBe(false);
    const k = INVOKE_CHANNELS['agent:giaHanTienKiem'];
    expect(k.safeParse({ id: 7 }).success).toBe(true);
    expect(k.safeParse({ id: -1 }).success).toBe(false);
    expect(k.safeParse({ id: '7' }).success).toBe(false);
  });

  it('VS Code (qua app) được mở hai kênh mới', () => {
    expect(cauNoi).toMatch(/'agent:giaHanTien', 'agent:giaHanTienKiem'/);
  });

  it('main gửi mã trong THÂN (kèm vé khoá), không lưu, không log', () => {
    const i = ipcAgent.indexOf("handle('agent:giaHanTien'");
    const than = ipcAgent.slice(i, ipcAgent.indexOf("handle('agent:giaHanTienKiem'"));
    expect(than).toContain('/api/v1/agent/gia-han-tien');
    expect(than).toMatch(/body: JSON\.stringify\(\{ ma, tran, \.\.\.\(veAnthropic\(\) \? \{ congAnthropicVe: veAnthropic\(\) \} : \{\}\) \}\)/);
    expect(than).not.toMatch(/setSetting|logger\.|console\./);
  });

  it('thẻ desktop: ô ẩn ký tự, tự kiểm lại ≥ 30 s, lần 1 tự làm tiếp; gắn dưới MỌI khối lỗi có giaHanTien', () => {
    expect(the).toContain('type="password"');
    expect(the).toMatch(/NHIP_KIEM_MS = 30_000/);
    expect(the).toMatch(/setInterval\(\(\) => \{ void kiem\(idCho\); \}, NHIP_KIEM_MS\)/);
    expect(the).toMatch(/if \(tuNhap\) lamTiepRef\.current\(\)/);
    expect(the).not.toMatch(/localStorage|sessionStorage/);
    expect(agentMode).toMatch(/\{m\.giaHanTien && \(\s*<NhapMaGiaHanTien/);
  });
});
