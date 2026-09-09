/**
 * Kiểm CHẾ ĐỘ QUYỀN MẶC ĐỊNH.
 *
 * Một cài đặt quyết định agent được làm gì NGAY KHI mở dự án, trước khi người
 * dùng kịp nhìn màn hình. Hai câu hỏi, và câu thứ hai mới là câu quan trọng:
 *   1. Đặt gì thì mở dự án ra đúng chế độ đó chưa.
 *   2. `boQuaHet` có LỌT vào làm mặc định không — phải là KHÔNG, kể cả khi
 *      file cài đặt trên đĩa ghi đúng chữ đó.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const THU_MUC = await fs.mkdtemp(path.join(os.tmpdir(), 'ct-cdmd-'));
vi.mock('electron', () => ({ app: { getPath: () => THU_MUC }, BrowserWindow: { getAllWindows: () => [] } }));

const caiDat: Record<string, unknown> = {};
vi.mock('../store', () => ({
  getSettings: () => caiDat,
  setSetting: (k: string, v: unknown) => { caiDat[k] = v; },
}));

const { taoCuoc, datGocChoCuoc, quyenCuaCuoc } = await import('./loop');

let goc = '';
beforeEach(async () => {
  goc = await fs.mkdtemp(path.join(os.tmpdir(), 'ct-duan-cd-'));
  for (const k of Object.keys(caiDat)) delete caiDat[k];
});

function moDuAn(): { cheDoQuyen: string; choSua: boolean; choChayLenh: boolean } {
  const id = taoCuoc();
  datGocChoCuoc(id, goc);
  const w = quyenCuaCuoc(id);
  return { cheDoQuyen: w.cheDoQuyen, choSua: w.choSua, choChayLenh: w.choChayLenh };
}

describe('chế độ mặc định khi mở dự án', () => {
  it('KHÔNG đặt gì ⇒ `keHoach` (chỉ đọc), như cũ', () => {
    expect(moDuAn()).toEqual({ cheDoQuyen: 'keHoach', choSua: false, choChayLenh: false });
  });

  it('đặt `tuSuaVaLenh` ⇒ mở dự án ra là đã có quyền, không phải bấm lại', () => {
    caiDat.aiCheDoQuyenMacDinh = 'tuSuaVaLenh';
    expect(moDuAn()).toEqual({ cheDoQuyen: 'tuSuaVaLenh', choSua: true, choChayLenh: true });
  });

  it('nhận cả `hoi` và `tuSua`', () => {
    caiDat.aiCheDoQuyenMacDinh = 'hoi';
    expect(moDuAn().cheDoQuyen).toBe('hoi');
    caiDat.aiCheDoQuyenMacDinh = 'tuSua';
    expect(moDuAn().cheDoQuyen).toBe('tuSua');
  });

  it('⛔ `boQuaHet` KHÔNG làm mặc định được, dù cài đặt ghi thế', () => {
    // Chế độ đó tắt sạch mọi thẻ duyệt, kể cả lệnh `nguyhiem`, và nó có cửa
    // cảnh báo riêng phải đọc trước khi bật. Làm mặc định tự động cho MỌI dự
    // án mở về sau — kể cả repo vừa clone — là bỏ cái cửa đó đi và quên mất
    // là đã bỏ. File cài đặt là JSON trên đĩa nên sửa tay được; chốt phải nằm
    // trong mã, không ở giao diện.
    caiDat.aiCheDoQuyenMacDinh = 'boQuaHet';
    expect(moDuAn().cheDoQuyen).toBe('keHoach');
  });

  it('giá trị RÁC ⇒ về `keHoach`, không ném', () => {
    for (const rac of ['', 'linh tinh', 42, null, {}]) {
      caiDat.aiCheDoQuyenMacDinh = rac;
      expect(moDuAn().cheDoQuyen).toBe('keHoach');
    }
  });
});
