/**
 * Kiểm QUYỀN SỐNG LÂU — danh sách "Luôn cho phép" ghi xuống đĩa.
 *
 * Sai ở đây không báo lỗi: nó chỉ khiến agent chạy một lệnh mà người dùng
 * tưởng mình chưa bao giờ cho phép, hoặc ngược lại — bấm thu hồi xong vẫn thấy
 * nó chạy thẳng. Bốn câu hỏi phải có phép kiểm riêng:
 *   1. Ghi/đọc lại có đúng không.
 *   2. Dự án A có RÒ sang dự án B không.
 *   3. Thu hồi có thật sự thu hồi không (cả đĩa lẫn bộ nhớ).
 *   4. `hoiNguoiDung` có TÔN TRỌNG nó không, và có từ chối ghi thứ
 *      `choNho: false` không.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const THU_MUC = await fs.mkdtemp(path.join(os.tmpdir(), 'ct-quyen-'));
vi.mock('electron', () => ({ app: { getPath: () => THU_MUC }, BrowserWindow: {} }));

const { napQuyenLau, themQuyenLau, xoaQuyenLau, quenDem, duongDanKho } = await import('./quyenLau');
const { hoiNguoiDung, traLoi } = await import('./xinPhep');
const { taoSoCuoc } = await import('./so');

const A = '/tmp/du-an-a';
const B = '/tmp/du-an-b';

beforeEach(async () => {
  await fs.rm(duongDanKho(), { force: true });
  quenDem();
});

describe('kho quyền lâu dài', () => {
  it('ghi rồi đọc lại được', async () => {
    expect(await themQuyenLau(A, 'npm test')).toBe(true);
    await themQuyenLau(A, 'git status');
    quenDem();                                  // ép đọc lại TỪ ĐĨA, không lấy đệm
    expect([...(await napQuyenLau(A))].sort()).toEqual(['git status', 'npm test']);
  });

  it('⛔ dự án A KHÔNG rò sang dự án B', async () => {
    // `npm test` ở hai repo là hai lệnh khác nhau — hai `package.json` khác nhau.
    await themQuyenLau(A, 'npm test');
    quenDem();
    expect(await napQuyenLau(B)).toEqual(new Set());
    expect(await napQuyenLau(null)).toEqual(new Set());
  });

  it('thêm trùng không nhân đôi', async () => {
    await themQuyenLau(A, 'npm test');
    await themQuyenLau(A, 'npm test');
    expect((await napQuyenLau(A)).size).toBe(1);
  });

  it('thu hồi một khoá, và thu hồi cả dự án', async () => {
    await themQuyenLau(A, 'npm test');
    await themQuyenLau(A, 'git status');
    expect(await xoaQuyenLau(A, 'npm test')).toBe(1);
    expect(await xoaQuyenLau(A, 'khong-co')).toBe(0);
    quenDem();
    expect([...(await napQuyenLau(A))]).toEqual(['git status']);

    await themQuyenLau(A, 'npm run build');
    expect(await xoaQuyenLau(A)).toBe(2);       // xoá CẢ dự án
    quenDem();
    expect(await napQuyenLau(A)).toEqual(new Set());
  });

  it('file hỏng ⇒ coi như rỗng, KHÔNG ném', async () => {
    // Mất điện giữa lúc ghi để lại JSON cụt. Ném ở đây nghĩa là agent chết
    // ngay lời gọi tool đầu tiên, vì một file đệm không quan trọng.
    await fs.writeFile(duongDanKho(), '{"duAn": {"a": ', 'utf8');
    quenDem();
    expect(await napQuyenLau(A)).toEqual(new Set());
    expect(await themQuyenLau(A, 'npm test')).toBe(true);   // vẫn ghi đè được
  });
});

describe('hoiNguoiDung tôn trọng quyền lâu dài', () => {
  const dieuKhien = new AbortController();

  it('khoá đã có trong sổ lâu dài ⇒ cho phép NGAY, không đẩy thẻ', async () => {
    const so = taoSoCuoc();
    so.goc = A;
    so.quyenLau = new Set(['npm test']);
    const the: unknown[] = [];
    const q = await hoiNguoiDung(
      { ten: 'run_command', duongDan: 'npm test', khoa: 'npm test' },
      (y) => the.push(y), dieuKhien.signal, so,
    );
    expect(q).toBe('choPhepCaFile');
    expect(the).toHaveLength(0);
  });

  it('⛔ `choNho: false` thì sổ lâu dài KHÔNG có tác dụng', async () => {
    // Lệnh nguy hiểm không được nhớ ở đâu cả. Nếu một khoá như thế lọt được
    // vào file (người dùng sửa tay, hoặc một bản app cũ ghi vào), nó vẫn phải
    // dừng lại hỏi.
    const so = taoSoCuoc();
    so.goc = A;
    so.quyenLau = new Set(['rm -rf build']);
    let idThe = '';
    const cho = hoiNguoiDung(
      { ten: 'run_command', duongDan: 'rm -rf build', khoa: 'rm -rf build', choNho: false },
      (y) => { idThe = y.id; }, dieuKhien.signal, so,
    );
    await new Promise((r) => { setTimeout(r, 20); });
    expect(idThe).not.toBe('');
    traLoi(idThe, 'tuChoi');
    expect(await cho).toBe('tuChoi');
  });

  it('`choPhepMai` ghi xuống ĐĨA, và chỉ cho dự án đang mở', async () => {
    const so = taoSoCuoc();
    so.goc = A;
    let idThe = '';
    const cho = hoiNguoiDung(
      { ten: 'run_command', duongDan: 'npm run build', khoa: 'npm run build' },
      (y) => { idThe = y.id; }, dieuKhien.signal, so,
    );
    await new Promise((r) => { setTimeout(r, 20); });
    traLoi(idThe, 'choPhepMai');
    expect(await cho).toBe('choPhepMai');

    expect(so.quyenLau.has('npm run build')).toBe(true);   // bộ nhớ: ngay lập tức
    await new Promise((r) => { setTimeout(r, 60); });      // đĩa: ghi bất đồng bộ
    quenDem();
    expect([...(await napQuyenLau(A))]).toEqual(['npm run build']);
    expect(await napQuyenLau(B)).toEqual(new Set());
  });

  it('⛔ `choPhepMai` trên việc KHÔNG được nhớ ⇒ đi qua nhưng KHÔNG ghi', async () => {
    // Giao diện đã ẩn nút với lệnh nguy hiểm; đây là lớp chặn thứ hai, phòng
    // khi một app bị sửa vẫn gửi lên quyết định ấy.
    const so = taoSoCuoc();
    so.goc = A;
    let idThe = '';
    const cho = hoiNguoiDung(
      { ten: 'run_command', duongDan: 'rm -rf /', khoa: 'rm -rf /', choNho: false },
      (y) => { idThe = y.id; }, dieuKhien.signal, so,
    );
    await new Promise((r) => { setTimeout(r, 20); });
    traLoi(idThe, 'choPhepMai');
    await cho;
    await new Promise((r) => { setTimeout(r, 60); });
    quenDem();
    expect(await napQuyenLau(A)).toEqual(new Set());
    expect(so.quyenLau.has('rm -rf /')).toBe(false);
  });
});
