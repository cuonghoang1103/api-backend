/**
 * Đợt 8A — phần thuần chung ba nơi: `/usage` vẽ hạn mức THẬT (`moTaUsage2`), quản lý server MCP (`hanhDongMcp`,
 * `trangThaiMcpChu`), hỏi gắn khi nhắc KEY (`hoiGanDoan`).
 */
import { describe, expect, it } from 'vitest';

import { moTaUsage2 } from './lenhGach';
import { hanhDongMcp, hoiGanDoan, lamHanhDongMcp, trangThaiMcpChu, type GiaoDienCtw, type TheChonCtw } from './ctworkLenh';

const CM = {
  phienBan: 2, laAdmin: false, goi: 'pro',
  model: { id: 'cm-sonic', ten: 'CuongMini Sonic 5.5', loai: 'theo_tien', khongGioiHan: false, daDungNgay: 5, tranNgay: 20, daDungThang: 30, tranThang: 100, giaHanNgay: 3 },
  chinhHang: { hang: 'free', khongGioiHan: false, daDungNgay: 1, tranNgay: 2, daDungThang: 3, tranThang: 10 },
  vi: { daDung: 2.5, tran: 10, phanTram: 25, soGio: 5, hoiLucNao: null, khongGioiHan: false, giaHan: 0 },
  nhom: { projectId: 2, key: 'LF', loai: 'taiTro', nhaTaiTro: 'Cường', khongGioiHan: true, daDungNgay: 0.4, daDungThang: 1.2 },
  taiTro: { phut: 1, tranPhut: 10, ngay: 12, tranNgay: 300 },
  default: { phut: 0, tranPhut: 10, ngay: 3, tranNgay: null, free: false },
  giaHan: { soLanKy: 2, usdKy: 6, dangCho: 1 },
};

describe('moTaUsage2', () => {
  it('máy chủ cũ (không cuongMini) ⇒ null để lùi moTaUsage', () => {
    expect(moTaUsage2({ daDung: 1, tran: 2 })).toBeNull();
  });
  it('người thường: model (đã dùng/trần ngày-tháng + gia hạn), Code Max, ví, admin tài trợ, chống spam, gia hạn, phiên', () => {
    const md = moTaUsage2({ cuongMini: CM }, { nguCanhPhanTram: 37, tienPhien: 0.42 })!;
    expect(md).toMatch(/CuongMini Sonic 5\.5/);
    expect(md).toMatch(/Hôm nay: \$5 \/ \$20 \(gồm \+\$3 gia hạn\)/);
    expect(md).toMatch(/Tháng này: \$30 \/ \$100/);
    expect(md).toMatch(/Nhóm Code Max \(miễn phí\)/);
    expect(md).toMatch(/Ví AI Code 5 giờ/);
    expect(md).toMatch(/LF\*\* — admin Cường tài trợ, KHÔNG trần \$/);
    expect(md).toMatch(/1\/10 câu\/phút · 12\/300 câu\/ngày/);
    expect(md).toMatch(/Gia hạn tháng này: 2 lần \(\+\$6\) · 1 yêu cầu chờ duyệt/);
    expect(md).toMatch(/Phiên này: ngữ cảnh 37% · \$0\.420/);
    expect(md).not.toMatch(/Admin — chi tiêu/);
    expect(md).not.toMatch(/claude-|gpt-/);
  });
  it('admin: bảng khoá (tên, ngân sách, đã dùng, còn %) + theo model + modelapi + rambo; tiếng Anh', () => {
    const md = moTaUsage2({ cuongMini: { ...CM, laAdmin: true, goi: 'admin', admin: {
      keys: [{ ten: 'Key 1 (200 USD)', trangThai: 'hoatDong', nganSachUsd: 200, daDungUsd: 50, conPhanTram: 75, boQua: null, lamMoiLuc: '' }],
      theoModel: [{ ten: 'CuongMini Sonic 5.5', homNayUsd: 1, thangUsd: 10, buocHomNay: 4 }],
      modelapi: { homNayUsd: 0.5, thangUsd: 7 }, chinhHang: { homNayUsd: 1, thangUsd: 10 }, rambo: { buocHomNay: 30, cauHoiHomNay: 6 },
    } } }, {}, 'en')!;
    expect(md).toMatch(/\| Key 1 \(200 USD\) \| \$200 \| \$50 \| 75% \|/);
    expect(md).toMatch(/\| CuongMini Sonic 5\.5 \| \$1 \| \$10 \| 4 \|/);
    expect(md).toMatch(/CuongMini Core \(modelapi\): today \$0\.500 · month \$7/);
    expect(md).toMatch(/CuongMini Classic \(flat-rate\): today 6 questions · 30 steps/);
  });
});

describe('quản lý server MCP', () => {
  it('trạng thái rõ + nút theo trạng thái; CT Work có thêm 4 việc', () => {
    expect(trangThaiMcpChu({ ten: 'figma', ok: true, soTool: 3 }, 'vi')).toBe('đã nối · 3 tool');
    expect(trangThaiMcpChu({ ten: 'figma', ok: false, soTool: 0, dangNoi: true }, 'en')).toBe('connecting…');
    expect(trangThaiMcpChu({ ten: 'figma', ok: false, soTool: 0, ngat: true }, 'vi')).toBe('đã ngắt (phiên này)');
    expect(trangThaiMcpChu({ ten: 'figma', ok: false, soTool: 0, loi: 'thiếu FIGMA_API_KEY' }, 'vi')).toBe('lỗi: thiếu FIGMA_API_KEY');
    expect(hanhDongMcp({ ten: 'figma', ok: true, soTool: 3 }, 'vi').map((x) => x.giaTri)).toEqual(['ngat', 'noiLai', 'tatHan']);
    expect(hanhDongMcp({ ten: 'figma', ok: false, soTool: 0, ngat: true }, 'vi').map((x) => x.giaTri)).toEqual(['noi', 'tatHan']);
    expect(hanhDongMcp({ ten: 'figma', ok: false, soTool: 0, tat: true }, 'vi').map((x) => x.giaTri)).toEqual(['noi']);
    /* 20/10/2026: CT Work KHÔNG có "Tắt hẳn" (cờ disabled sống mãi ⇒ "mở lại là mất kết nối") — bỏ hẳn = Đăng xuất. */
    expect(hanhDongMcp({ ten: 'ctwork', ok: true, soTool: 20 }, 'vi').map((x) => x.giaTri)).toEqual(['ngat', 'noiLai', 'ctwDuAn', 'ctwQuyen', 'ctwBoGan', 'ctwDangXuat']);
    expect(hanhDongMcp({ ten: 'ctwork', ok: true, soTool: 20 }, 'vi')[0]!.nhan).toBe('Ngắt (phiên này)');
    expect(hanhDongMcp({ ten: 'ctwork', ok: false, soTool: 0, tat: true }, 'vi').map((x) => x.giaTri)).toContain('noi');
  });
  it('ngắt / kết nối gọi đúng kênh lõi với đúng server; đăng xuất hỏi xác nhận trước', async () => {
    const goi: Array<[string, Record<string, unknown>]> = [];
    const the: TheChonCtw[] = [];
    const g: GiaoDienCtw = {
      goi: async <T,>(k: string, d?: Record<string, unknown>) => { goi.push([k, d ?? {}]); return { ok: true } as T; },
      traLoi: () => undefined, chon: (o) => { the.push(o); }, thongBao: () => undefined, datNhap: () => undefined, ngonNgu: 'vi',
    };
    expect(await lamHanhDongMcp(g, 'figma', 'ngat')).toMatch(/Đã ngắt figma/);
    expect(goi.at(-1)).toEqual(['agent:mcpServer', { ten: 'figma', viec: 'ngat' }]);
    expect(await lamHanhDongMcp(g, 'figma', 'noiLai')).toMatch(/Đã nối figma/);
    expect(await lamHanhDongMcp(g, 'ctwork', 'ctwDangXuat')).toBeNull();
    expect(the.at(-1)!.tieuDe).toMatch(/Đăng xuất CT Work trên máy này\?/);
    expect(goi.some(([k, d]) => k === 'agent:ctwork' && d.viec === 'ngat')).toBe(false);
    await the.at(-1)!.khiChon('co');
    expect(goi.some(([k, d]) => k === 'agent:ctwork' && d.viec === 'ngat')).toBe(true);
  });
  it('nhắc KEY-123 ⇒ hỏi gắn một lần; "Không" ⇒ ghi nhớ đã hỏi, không gắn', async () => {
    const goi: Array<[string, Record<string, unknown>]> = [];
    const the: TheChonCtw[] = [];
    const g: GiaoDienCtw = {
      goi: async <T,>(k: string, d?: Record<string, unknown>) => { goi.push([k, d ?? {}]); return { ok: true } as T; },
      traLoi: () => undefined, chon: (o) => { the.push(o); }, thongBao: () => undefined, datNhap: () => undefined, ngonNgu: 'vi',
    };
    hoiGanDoan(g, { key: 'LF', projectId: 2, workspaceId: 3, workspace: 'LabFlow' }, 'key');
    expect(the[0]!.tieuDe).toMatch(/Gắn thư mục này với dự án CT Work LF \(id 2\)\?/);
    expect(the[0]!.moTa).toMatch(/Bạn vừa nhắc LF-/);
    await the[0]!.khiChon('khong');
    expect(goi.some(([, d]) => d.viec === 'daHoi' && d.loai === 'ganDuAn')).toBe(true);
    expect(goi.some(([, d]) => d.viec === 'gan')).toBe(false);
  });
});
