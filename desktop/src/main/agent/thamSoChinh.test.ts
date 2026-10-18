/**
 * Tham số chính trên dòng tool (`● Wait(…)`) — QA 18/10/2026 thấy `Wait(thoi_gian)`: mã nội bộ lộ ra giao diện
 * ở cả ba nơi (desktop, CLI, VS Code dùng chung lõi).
 */
import { describe, it, expect, vi } from 'vitest';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const THU_MUC = await fs.mkdtemp(path.join(os.tmpdir(), 'ct-tsc-'));
vi.mock('electron', () => ({ app: { getPath: () => THU_MUC }, BrowserWindow: { getAllWindows: () => [] } }));
vi.mock('../store', () => ({ getSettings: () => ({}), setSetting: () => {} }));

const { thamSoChinh } = await import('./loop');

describe('thamSoChinh — cho_doi không lộ mã loại', () => {
  it('đọc được, không còn thoi_gian/lenh_nen', () => {
    expect(thamSoChinh('cho_doi', { loai: 'thoi_gian', giay: 3 })).toBe('3s');
    expect(thamSoChinh('cho_doi', {})).toBe('30s');
    expect(thamSoChinh('cho_doi', { loai: 'lenh_nen', id: 'n1', khop: 'ready' })).toBe('n1 /ready/');
    expect(thamSoChinh('cho_doi', { loai: 'url', url: 'http://localhost:3000/' })).toBe('localhost:3000');
    expect(thamSoChinh('cho_doi', { loai: 'tien_trinh', pid: 42 })).toBe('pid 42');
    expect(thamSoChinh('grep', { pattern: 'TODO', path: 'src' })).toBe('"TODO" in src');
  });
});
