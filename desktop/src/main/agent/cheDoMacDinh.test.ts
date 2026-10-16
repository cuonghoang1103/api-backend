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

const { taoCuoc, datGocChoCuoc, datGocNeuChuaCo, datCheDoQuyen, quyenCuaCuoc, soCuaCuoc, napPhien, xoaHoiThoai } = await import('./loop');

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

describe('tab CHƯA CÓ thư mục ⇒ toàn quyền (16/10/2026)', () => {
  it('tab mới ⇒ `boQuaHet`, và cờ trên SỔ cũng bật (thứ thẻ duyệt thật sự đọc)', () => {
    const id = taoCuoc();
    expect(quyenCuaCuoc(id).cheDoQuyen).toBe('boQuaHet');
    expect(soCuaCuoc(id).boQuaHet).toBe(true);
  });

  it('toàn quyền TỰ ĐẶT không đi theo sang thư mục mặc định', () => {
    const id = taoCuoc();
    datGocNeuChuaCo(id, goc);
    expect(quyenCuaCuoc(id).cheDoQuyen).toBe('keHoach');
    expect(soCuaCuoc(id).boQuaHet).toBe(false);
  });

  it('người dùng TỰ bật "Bỏ qua tất cả" rồi mới chọn thư mục ⇒ GIỮ (lỗi bạn chủ app trên Windows)', () => {
    const id = taoCuoc();
    datCheDoQuyen(id, 'boQuaHet');
    datGocChoCuoc(id, goc);
    expect(quyenCuaCuoc(id).cheDoQuyen).toBe('boQuaHet');
    expect(soCuaCuoc(id).boQuaHet).toBe(true);
  });

  it('⛔ đổi từ dự án A sang dự án B ⇒ vẫn HẠ về mặc định', async () => {
    const id = taoCuoc();
    datCheDoQuyen(id, 'boQuaHet');
    datGocChoCuoc(id, goc);
    const gocB = await fs.mkdtemp(path.join(os.tmpdir(), 'ct-duan-b-'));
    datGocChoCuoc(id, gocB);
    expect(quyenCuaCuoc(id).cheDoQuyen).toBe('keHoach');
    expect(soCuaCuoc(id).boQuaHet).toBe(false);
  });

  it('bỏ thư mục (✕) ⇒ về toàn quyền của tab trống', () => {
    const id = taoCuoc();
    datGocChoCuoc(id, goc);
    datGocChoCuoc(id, null);
    expect(quyenCuaCuoc(id).cheDoQuyen).toBe('boQuaHet');
  });

  it('mở lại phiên KHÔNG đổi thư mục ⇒ sổ mới vẫn mang cờ của chế độ đang hiện', () => {
    const id = taoCuoc();
    datCheDoQuyen(id, 'boQuaHet');
    napPhien(id, id, [], null);
    expect(quyenCuaCuoc(id).cheDoQuyen).toBe('boQuaHet');
    expect(soCuaCuoc(id).boQuaHet).toBe(true);
  });

  it('bấm "Việc mới" khi đang "Bỏ qua tất cả" ⇒ sổ mới VẪN bật, và vẫn nhớ thư mục', () => {
    const id = taoCuoc();
    datGocChoCuoc(id, goc);
    datCheDoQuyen(id, 'boQuaHet');
    xoaHoiThoai(id);
    expect(soCuaCuoc(id).boQuaHet).toBe(true);
    expect(soCuaCuoc(id).goc).toBe(goc);
  });
});
