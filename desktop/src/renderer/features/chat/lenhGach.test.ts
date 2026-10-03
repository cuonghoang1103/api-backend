/**
 * Lệnh `/` của AI Code (03/10/2026) — phần thuần. Lệnh cần máy chủ (`/usage`)
 * kiểm với hàm `request` GIẢ; `/compact`, `/doctor` có phép kiểm riêng ở main
 * (`main/agent/lenhMayChu.test.ts`) với `fetch` giả.
 */
import { describe, expect, it } from 'vitest';

import type { AgentNguCanhChiTiet, AgentPhien } from '../../../shared/ipc';
import {
  LENH_AGENT, chonPhien, chuanHoa, dsCauHoi, layUsage, locPhien, moTaChanDoan, moTaNguCanh, moTaTrangThai,
  moTaTroGiup, moTaUsage, promptPlan, promptReview, tachLenh, tenFileXuat, timMuc, timTheoChu, xuatMarkdown,
} from './lenhGach';
import type { MucHienThi } from './useAgent';

describe('danh sách lệnh', () => {
  it('đủ cả ba nhóm lệnh của đề giao', () => {
    const ten = LENH_AGENT.map((l) => l.ten);
    for (const t of ['/model', '/usage', '/context', '/compact', '/status', '/plan', '/review', '/init',
      '/resume', '/rewind', '/memory', '/export', '/doctor', '/offline', '/effort', '/hooks', '/mcp']) {
      expect(ten).toContain(t);
    }
  });

  it('mọi lệnh có mô tả tiếng Việt, và tên + bí danh KHÔNG trùng nhau', () => {
    const tatCa = LENH_AGENT.flatMap((l) => [l.ten, ...(l.khac ?? [])]);
    expect(new Set(tatCa).size).toBe(tatCa.length);
    for (const l of LENH_AGENT) expect(l.mo.length).toBeGreaterThan(8);
  });

  it('/help liệt kê ĐỦ mọi lệnh, theo nhóm, kèm lệnh dự án', () => {
    const h = moTaTroGiup(LENH_AGENT, [{ ten: '/rade', mo: 'lệnh dự án' }]);
    for (const l of LENH_AGENT) expect(h).toContain(`\`${l.ten}`);
    expect(h).toContain('**Phiên & model**');
    expect(h).toContain('`/rade`');
  });
});

describe('tachLenh', () => {
  it('đổi bí danh về tên chính và tách tham số', () => {
    expect(tachLenh('/tomtat giữ tên file đã sửa')).toEqual({ ten: '/compact', thamSo: 'giữ tên file đã sửa' });
    expect(tachLenh('/MOI')).toEqual({ ten: '/clear', thamSo: '' });
    expect(tachLenh('/ngoaituyen')).toEqual({ ten: '/offline', thamSo: '' });
  });
  it('không phải lệnh dựng sẵn ⇒ null (để lệnh dự án / câu hỏi đi tiếp)', () => {
    expect(tachLenh('/rade IOT102')).toBeNull();
    expect(tachLenh('sửa giúp /model')).toBeNull();
  });
});

describe('/model · /effort — khớp chữ gõ', () => {
  const models = [
    { id: 'sonnet-5', ten: 'Cuong Sonnet 5' },
    { id: 'opus-4-8', ten: 'CuongMini Max 4.8' },
    { id: 'gpt-sol', ten: 'GPT 6 Sol' },
    { id: 'fable-5', ten: 'Cuong Fable 5' },
  ];
  it('khớp id, tên, một phần tên — bỏ dấu, bỏ khoảng trắng', () => {
    expect(timTheoChu('opus-4-8', models)?.id).toBe('opus-4-8');
    expect(timTheoChu('gpt 6 sol', models)?.id).toBe('gpt-sol');
    expect(timTheoChu('max', models)?.id).toBe('opus-4-8');
    expect(timTheoChu('fable', models)?.id).toBe('fable-5');
  });
  it('mơ hồ (khớp nhiều) hoặc không khớp ⇒ null, không đoán bừa', () => {
    expect(timTheoChu('cuong', models)).toBeNull();
    expect(timTheoChu('llama', models)).toBeNull();
  });
  const muc = [
    { id: 'thap', ten: 'Thấp' }, { id: 'vua', ten: 'Vừa' }, { id: 'cao', ten: 'Cao' },
    { id: 'ratCao', ten: 'Rất cao' }, { id: 'toiDa', ten: 'Tối đa' }, { id: 'ultracode', ten: 'Ultracode' },
  ];
  it('mức nỗ lực: tiếng Việt có/không dấu và tên tiếng Anh', () => {
    expect(timMuc('rất cao', muc)?.id).toBe('ratCao');
    expect(timMuc('toi da', muc)?.id).toBe('toiDa');
    expect(timMuc('high', muc)?.id).toBe('cao');
    expect(timMuc('ultra', muc)?.id).toBe('ultracode');
    expect(timMuc('cao', muc)?.id).toBe('cao'); // trùng hẳn thắng "rất cao" chứa "cao"
  });
  it('chuanHoa', () => {
    expect(chuanHoa('Rất cao')).toBe('ratcao');
    expect(chuanHoa('Đề bài')).toBe('debai');
  });
});

describe('/usage — với request GIẢ', () => {
  it('đọc đủ trường máy chủ trả và dựng câu có key gia hạn + trần tiền ngày', async () => {
    let duong = '';
    const u = await layUsage(async (d) => {
      duong = d;
      return {
        daDung: 2_400_000, tran: 6_500_000, tranGoc: 6_000_000, giaHan: 500_000, conLai: 4_100_000,
        phanTram: 37, soGio: 5, hoiLucNao: '2026-10-03T05:00:00Z', hoiHetLuc: '2026-10-03T09:00:00Z',
        coKeyGiaHan: true, tienNgay: { phanTram: 41, catViecNen: false, dungHet: false },
      };
    });
    expect(duong).toBe('/api/v1/agent/usage');
    const md = moTaUsage(u);
    expect(md).toContain('2.400.000');
    expect(md).toContain('≈ 29 việc');
    expect(md).toContain('gia hạn bằng key: +500.000');
    expect(md).toContain('Trần tiền ngày của máy chủ: 41%');
    expect(md).toMatch(/Key gia hạn: \*\*có\*\*/);
  });
  it('máy chủ cũ thiếu trường mới ⇒ vẫn dựng được; sai hình dạng ⇒ ném câu rõ', async () => {
    const u = await layUsage(async () => ({ daDung: 10, tran: 100, hoiLucNao: null }));
    expect(u.conLai).toBe(90);
    expect(moTaUsage(u)).toContain('chưa bật');
    await expect(layUsage(async () => ({ loi: 'x' }))).rejects.toThrow(/sai hình dạng/);
  });
});

describe('/context', () => {
  const ct: AgentNguCanhChiTiet = {
    deBai: 1200, lichSu: 40_000, ketQuaTool: 300_000, soAnh: 3, byteAnh: 3 * 1_048_576,
    tong: 341_200, soTin: 80, soLuot: 9, tongGui: 341_200, tomTat: null,
  };
  it('chia đủ bốn phần + số lượt máy chủ đã cắt', () => {
    const md = moTaNguCanh(ct, 600_000, 2);
    expect(md).toContain('341k / 600k');
    expect(md).toContain('| Đề bài | 1k |');
    expect(md).toContain('| Kết quả tool + tham số | 300k | 88% |');
    expect(md).toContain('3 tấm · 3.0 MB');
    expect(md).toContain('đã tự cắt **2** lượt');
    expect(md).toContain('Chưa có bản tóm tắt');
  });
  it('đã /compact ⇒ nói số tin đã gộp và ký tự gửi lên', () => {
    const md = moTaNguCanh({ ...ct, tongGui: 60_000, tomTat: { soTinDaGop: 64, luc: Date.UTC(2026, 9, 3, 6) } }, 600_000, 0);
    expect(md).toContain('64 tin đầu');
    expect(md).toContain('Gửi lên: 60k thay vì 341k');
  });
});

describe('/status · /doctor', () => {
  it('/status nói đúng cổng đang dùng', () => {
    const md = moTaTrangThai({
      phienBan: '0.5.150', cong: 'epNgoaiTuyen', online: true, tenCucBo: 'Bản lập trình (30B)',
      duAn: 'api', duongDan: '/x/api', nhanh: 'main', model: 'Cuong Sonnet 5', muc: 'Vừa', cheDo: 'Hỏi từng việc', tomTat: false,
    });
    expect(md).toContain('0.5.150');
    expect(md).toContain('ép tay bằng /offline (Bản lập trình (30B))');
    expect(md).toContain('`main`');
  });
  it('/doctor đếm lỗi/cảnh báo và giữ thứ tự mục', () => {
    const md = moTaChanDoan([
      { ten: 'Mạng', muc: 'ok', chiTiet: 'Có mạng.' },
      { ten: 'Máy chủ', muc: 'loi', chiTiet: 'Trả 502.' },
      { ten: 'AI ngoại tuyến', muc: 'canh', chiTiet: 'Chưa cài.' },
    ]);
    expect(md).toContain('1 lỗi · 1 cảnh báo');
    expect(md.indexOf('Mạng')).toBeLessThan(md.indexOf('Máy chủ'));
    expect(md).toContain('✗ **Máy chủ**');
  });
});

describe('/plan · /review', () => {
  it('prompt nói rõ CHỈ ĐỌC và mang yêu cầu', () => {
    expect(promptPlan('thêm /compact')).toMatch(/CHỈ ĐỌC[\s\S]*thêm \/compact/);
    expect(promptReview('src/main')).toMatch(/file:dòng|đường\/dẫn:dòng/);
    expect(promptReview('src/main')).toContain('src/main');
  });
});

describe('/rewind · /resume', () => {
  const muc: MucHienThi[] = [
    { kieu: 'nguoi', text: 'câu một' }, { kieu: 'may', text: 'a' },
    { kieu: 'tool', ten: 'read_file', tomTat: 'x', vong: 'may' },
    { kieu: 'nguoi', text: 'câu hai' },
  ];
  it('đánh số câu hỏi đúng thứ tự quayLui đếm (1 = câu đầu)', () => {
    expect(dsCauHoi(muc)).toEqual([{ k: 1, text: 'câu một' }, { k: 2, text: 'câu hai' }]);
  });
  const phien: AgentPhien[] = [
    { id: 'a', tieuDe: 'Sửa lỗi đăng nhập', duAn: 'api', luucLuc: 3, soTinNhan: 4 },
    { id: 'b', tieuDe: 'Viết test', duAn: 'web', luucLuc: 5, soTinNhan: 2 },
    { id: 'c', tieuDe: 'Đã cất', duAn: null, luucLuc: 9, soTinNhan: 1, luuTru: true },
    { id: 'd', tieuDe: 'Việc ghim', duAn: 'api', luucLuc: 1, soTinNhan: 1, ghim: true },
  ];
  it('lọc bỏ việc lưu trữ, ghim lên đầu, rồi mới nhất', () => {
    expect(locPhien(phien, '').map((p) => p.id)).toEqual(['d', 'b', 'a']);
    expect(locPhien(phien, 'dang nhap').map((p) => p.id)).toEqual(['a']);
  });
  it('chọn theo số thứ tự trong danh sách vừa in, hoặc từ khoá khớp duy nhất', () => {
    expect(chonPhien(phien, '2')?.id).toBe('b');
    expect(chonPhien(phien, 'test')?.id).toBe('b');
    expect(chonPhien(phien, 'api')).toBeNull(); // khớp 2 ⇒ không đoán
    expect(chonPhien(phien, '9')).toBeNull();
  });
});

describe('/export', () => {
  it('Markdown đủ người/agent/tool/đầu ra lệnh, không vỡ khối mã', () => {
    const md = xuatMarkdown([
      { kieu: 'nguoi', text: 'sửa build' },
      { kieu: 'tool', ten: 'read_file', tomTat: 'a.ts', vong: 'may' },
      { kieu: 'tool', ten: 'grep', tomTat: 'x', vong: 'may' },
      { kieu: 'lenhRa', text: '$ npm test\n```lạ```\nok' },
      { kieu: 'may', text: 'Đã sửa.', cucBo: 'Bản 30B' },
      { kieu: 'loi', text: 'Đã dừng theo yêu cầu.' },
    ], { tieuDe: 'Sửa build', duAn: 'api', luc: new Date(2026, 9, 3, 13, 5) });
    expect(md).toMatch(/^# Sửa build/);
    expect(md).toContain('## Bạn\n\nsửa build');
    expect(md).toContain('- `read_file` — a.ts\n- `grep` — x');
    expect(md).toContain('## Agent (AI trên máy · Bản 30B)');
    expect(md.match(/```/g)?.length).toBe(2); // ``` bên trong đầu ra đã được thay
    expect(md).toContain('> ⚠ Đã dừng theo yêu cầu.');
  });
  it('tên file bỏ dấu, có ngày', () => {
    expect(tenFileXuat('Sửa lỗi đăng nhập!', new Date(2026, 9, 3))).toBe('sua-loi-dang-nhap-20261003.md');
    expect(tenFileXuat('', new Date(2026, 0, 9))).toBe('viec-ai-code-20260109.md');
  });
});
