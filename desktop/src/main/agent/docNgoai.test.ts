/**
 * Đọc thư mục NGOÀI dự án (kéo từ Finder) + đọc slide/tài liệu Office.
 *
 * Người dùng 01/10/2026: kéo thư mục slide môn học vào AI Code ⇒ "Thư mục này
 * nằm ngoài dự án". Hai chỗ thiếu: quyền đọc thư mục ngoài, và `read_file`
 * không đọc được `.pptx`. Ba file mẫu trong `__mau_office__` do LibreOffice
 * THẬT xuất ra — không phải zip tự dựng — vì cái cần kiểm là định dạng mà
 * phần mềm văn phòng thật ghi, không phải định dạng ta nghĩ nó ghi.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import zlib from 'node:zlib';
import { _xoaQuyenDocNgoai, capQuyenDocNgoai, lyDoKhongCapNgoai } from './jail';
import { docOffice, giaiThucThe, Zip } from './docOffice';

vi.mock('electron', () => ({ app: { getPath: () => os.tmpdir(), isPackaged: false } }));
const { chayToolAgent } = await import('./tools');

const MAU = path.join(__dirname, '__mau_office__');

let goc = '';
let ngoai = '';

beforeEach(async () => {
  _xoaQuyenDocNgoai();
  goc = await fs.realpath(await fs.mkdtemp(path.join(os.tmpdir(), 'ct-duan-')));
  ngoai = await fs.realpath(await fs.mkdtemp(path.join(os.tmpdir(), 'ct-slide-')));
  await fs.mkdir(path.join(ngoai, 'Chuong8'), { recursive: true });
  await fs.copyFile(path.join(MAU, 'slide.pptx'), path.join(ngoai, 'Chuong8', 'hooks.pptx'));
  await fs.writeFile(path.join(ngoai, 'Chuong8', 'ghi-chu.md'), '# useEffect\nmảng phụ thuộc [userId]\n');
  await fs.writeFile(path.join(ngoai, '.env'), 'SECRET=khong-duoc-lo');
  await fs.writeFile(path.join(goc, 'a.txt'), 'trong dự án');
});

describe('docOffice — file do LibreOffice thật xuất ra', () => {
  it('pptx: đúng thứ tự slide, chữ, thực thể XML, ghi chú người thuyết trình', async () => {
    const kq = docOffice(await fs.readFile(path.join(MAU, 'slide.pptx')), '.pptx');
    expect(kq.soPhan).toBe(2);
    expect(kq.chu).toMatch(/Slide 1 ──\nSlide một: React Hooks\nuseState & useEffect/);
    expect(kq.chu).toContain('Slide hai: useReducer <dispatch>');
    expect(kq.chu.indexOf('Slide một')).toBeLessThan(kq.chu.indexOf('Slide hai'));
    expect(kq.chu).toContain('nhắc sinh viên về mảng phụ thuộc');
  });

  it('docx: tiêu đề, đoạn văn, bảng', async () => {
    const kq = docOffice(await fs.readFile(path.join(MAU, 'tai-lieu.docx')), '.docx');
    expect(kq.chu).toContain('Chương 8 — Hooks');
    expect(kq.chu).toContain('useState lưu state & useEffect chạy sau render.');
    expect(kq.chu).toMatch(/\| useContext \| tránh prop drilling \|/);
  });

  it('xlsx: chuỗi dùng chung + số', async () => {
    const kq = docOffice(await fs.readFile(path.join(MAU, 'bang.xlsx')), '.xlsx');
    expect(kq.chu).toContain('Tên\tĐiểm');
    expect(kq.chu).toContain('Cường\t9.5');
  });

  it('file hỏng / không phải zip ⇒ lỗi có lý do', () => {
    expect(() => docOffice(Buffer.from('không phải zip'), '.pptx')).toThrow(/không phải file zip/);
  });

  it('⛔ bom zip: khai kích thước nhỏ nhưng nở to ⇒ dừng', () => {
    // Một mục DEFLATE 40MB toàn số 0 (nén còn ~40KB), thư mục trung tâm KHAI
    // DỐI là 10 byte — phải bị chặn bởi trần giải nén thật, không tin lời khai.
    const nen = zlib.deflateRawSync(Buffer.alloc(40 * 1024 * 1024));
    const ten = Buffer.from('ppt/presentation.xml');
    const loc = Buffer.alloc(30); loc.writeUInt32LE(0x04034b50, 0); loc.writeUInt16LE(8, 8);
    loc.writeUInt32LE(nen.length, 18); loc.writeUInt32LE(10, 22); loc.writeUInt16LE(ten.length, 26);
    const cen = Buffer.alloc(46); cen.writeUInt32LE(0x02014b50, 0); cen.writeUInt16LE(8, 10);
    cen.writeUInt32LE(nen.length, 20); cen.writeUInt32LE(10, 24); cen.writeUInt16LE(ten.length, 28); cen.writeUInt32LE(0, 42);
    const viTriCen = loc.length + ten.length + nen.length;
    const eocd = Buffer.alloc(22); eocd.writeUInt32LE(0x06054b50, 0); eocd.writeUInt16LE(1, 8); eocd.writeUInt16LE(1, 10);
    eocd.writeUInt32LE(cen.length + ten.length, 12); eocd.writeUInt32LE(viTriCen, 16);
    const zip = Buffer.concat([loc, ten, nen, cen, ten, eocd]);
    expect(() => new Zip(zip).doc('ppt/presentation.xml')).toThrow();
  });

  it('giải thực thể số', () => {
    expect(giaiThucThe('&#7843;&#x1EA1;&amp;lt;')).toBe('ảạ&lt;');
  });
});

describe('thư mục ngoài — cấp quyền CHỈ ĐỌC', () => {
  it('chưa cấp ⇒ đường tuyệt đối bị từ chối, kèm hướng dẫn kéo thư mục vào', async () => {
    const kq = await chayToolAgent(goc, 'list_dir', { path: ngoai });
    expect(kq.noiDung).toMatch(/CHƯA được cấp quyền đọc/);
    expect(kq.noiDung).toMatch(/KÉO/);
  });

  it('cấp rồi ⇒ list_dir / read_file (pptx, md) / grep / glob đều chạy, đường in ra là TUYỆT ĐỐI', async () => {
    capQuyenDocNgoai(goc, ngoai);

    const ds = await chayToolAgent(goc, 'list_dir', { path: ngoai });
    expect(ds.noiDung).toContain('Chuong8/');
    expect(ds.noiDung).not.toContain('.env');            // danh sách chặn vẫn áp dụng

    const slide = await chayToolAgent(goc, 'read_file', { path: path.join(ngoai, 'Chuong8', 'hooks.pptx') });
    expect(slide.noiDung).toMatch(/^PPTX .* — 2 slide/);
    expect(slide.noiDung).toContain('Slide một: React Hooks');

    const tim = await chayToolAgent(goc, 'grep', { pattern: 'phụ thuộc', path: ngoai });
    expect(tim.noiDung).toContain(path.join(ngoai, 'Chuong8', 'ghi-chu.md'));

    const g = await chayToolAgent(goc, 'glob', { pattern: `${ngoai}/**/*.pptx` });
    expect(g.noiDung).toContain(path.join(ngoai, 'Chuong8', 'hooks.pptx'));

    // Đường tương đối vẫn đọc trong DỰ ÁN như cũ.
    expect((await chayToolAgent(goc, 'read_file', { path: 'a.txt' })).noiDung).toContain('trong dự án');
  });

  it('⛔ cấp rồi vẫn KHÔNG đọc được .env trong thư mục ngoài', async () => {
    capQuyenDocNgoai(goc, ngoai);
    const kq = await chayToolAgent(goc, 'read_file', { path: path.join(ngoai, '.env') });
    expect(kq.noiDung).toMatch(/Không đọc file/);
    expect(kq.noiDung).not.toContain('khong-duoc-lo');
  });

  it('⛔ thoát ra ngoài thư mục được cấp bằng ".." ⇒ chặn', async () => {
    capQuyenDocNgoai(goc, path.join(ngoai, 'Chuong8'));
    const kq = await chayToolAgent(goc, 'read_file', { path: path.join(ngoai, 'Chuong8', '..', '.env') });
    expect(kq.noiDung).toMatch(/CHƯA được cấp|Không đọc/);
    expect(kq.noiDung).not.toContain('khong-duoc-lo');
  });

  it('⛔ symlink trong thư mục ngoài trỏ ra chỗ khác ⇒ chặn', async () => {
    const biMat = await fs.mkdtemp(path.join(os.tmpdir(), 'ct-bimat-'));
    await fs.writeFile(path.join(biMat, 'khoa.txt'), 'BI-MAT-123');
    await fs.symlink(path.join(biMat, 'khoa.txt'), path.join(ngoai, 'loi-tat.txt'));
    capQuyenDocNgoai(goc, ngoai);
    const kq = await chayToolAgent(goc, 'read_file', { path: path.join(ngoai, 'loi-tat.txt') });
    expect(kq.noiDung).not.toContain('BI-MAT-123');
  });

  it('⛔ chỉ ĐỌC: tool ghi với đường tuyệt đối vào thư mục ngoài bị từ chối', async () => {
    capQuyenDocNgoai(goc, ngoai);
    const so = { hoanTac: new Map(), soLanGhi: 0 } as never;
    const kq = await chayToolAgent(goc, 'create_file', { path: path.join(ngoai, 'moi.txt'), content: 'x' },
      { so } as never);
    expect(kq.noiDung).toMatch(/LỖI/);
    await expect(fs.access(path.join(ngoai, 'moi.txt'))).rejects.toThrow();
  });

  it('⛔ không cấp cho / , thư mục nhà, hay tổ tiên của nó', () => {
    expect(lyDoKhongCapNgoai('/')).toMatch(/cả ổ đĩa/);
    expect(lyDoKhongCapNgoai(os.homedir())).toMatch(/thư mục nhà/);
    expect(lyDoKhongCapNgoai(path.dirname(os.homedir()))).toMatch(/thư mục nhà/);
    expect(lyDoKhongCapNgoai(path.join(os.homedir(), '.ssh'))).toMatch(/\.ssh/);
    expect(lyDoKhongCapNgoai(path.join(os.homedir(), 'Documents', 'MonHoc'))).toBeNull();
  });

  it('quyền theo DỰ ÁN: dự án khác không đọc được thư mục đã cấp cho dự án này', async () => {
    capQuyenDocNgoai(goc, ngoai);
    const khac = await fs.realpath(await fs.mkdtemp(path.join(os.tmpdir(), 'ct-khac-')));
    const kq = await chayToolAgent(khac, 'list_dir', { path: ngoai });
    expect(kq.noiDung).toMatch(/CHƯA được cấp/);
  });
});
