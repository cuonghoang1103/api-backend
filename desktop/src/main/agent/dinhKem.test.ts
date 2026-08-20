/**
 * Kiểm phần dễ sai nhất của đính kèm: BIẾN TÊN FILE THÀNH TÊN AN TOÀN.
 *
 * Tên đến từ ba nguồn, và chỉ một trong ba là lành: hộp thoại chọn file của hệ
 * điều hành (lành), CLIPBOARD, và KÉO-THẢ. Hai nguồn sau mang tên do nơi khác
 * đặt — nên đây là chỗ chặn trèo thư mục, và nó phải có bài kiểm riêng.
 */
import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

vi.mock('electron', () => ({ app: { getPath: () => '/tmp' } }));
const { tenAnToan, datDinhKem, TRAN_BYTE_DINH_KEM } = await import('./dinhKem');

describe('tenAnToan', () => {
  it('giữ nguyên tên lành, kể cả tiếng Việt có dấu', () => {
    expect(tenAnToan('bao-cao.pdf')).toBe('bao-cao.pdf');
    expect(tenAnToan('Đặc tả.docx')).toBe('Đặc-tả.docx');
  });

  it('CHẶN trèo thư mục', () => {
    expect(tenAnToan('../../../etc/passwd')).toBe('passwd');
    expect(tenAnToan('..')).toBe('tep-dinh-kem');
    expect(tenAnToan('../../.env')).toBe('env');
    expect(tenAnToan('/etc/shadow')).toBe('shadow');
  });

  it('bỏ ký tự nguy hiểm với shell — đường dẫn này có thể đi vào một chuỗi lệnh', () => {
    expect(tenAnToan('a;rm -rf ~.txt')).toBe('a-rm-rf-.txt');
    expect(tenAnToan('$(whoami).log')).toBe('whoami-.log');
    expect(tenAnToan('it\'s a file.txt')).toBe('it-s-a-file.txt');
  });

  it('không cho ra file ẩn', () => {
    expect(tenAnToan('.env')).toBe('env');
    expect(tenAnToan('...hidden')).toBe('hidden');
  });

  it('tên rỗng hoặc toàn ký tự lạ vẫn ra một cái tên dùng được', () => {
    expect(tenAnToan('')).toBe('tep-dinh-kem');
    expect(tenAnToan('///')).toBe('tep-dinh-kem');
    expect(tenAnToan('!!!')).toBe('tep-dinh-kem');
  });

  it('cắt tên quá dài, không để lại dấu chấm/gạch lơ lửng ở cuối', () => {
    const ra = tenAnToan(`${'x'.repeat(200)}.txt`);
    expect(ra.length).toBeLessThanOrEqual(80);
    expect(ra.endsWith('-')).toBe(false);
    expect(ra.endsWith('.')).toBe(false);
  });
});


// ─── Ghi thật xuống đĩa ────────────────────────────────────────────

const goc = await fs.mkdtemp(path.join(os.tmpdir(), 'dinhkem-test-'));
const b64 = (s: string): string => Buffer.from(s, 'utf8').toString('base64');
const thuMuc = path.join(goc, '.cuongthai', 'dinh-kem');

beforeEach(async () => {
  await fs.rm(path.join(goc, '.cuongthai'), { recursive: true, force: true });
  await fs.rm(path.join(goc, '.git'), { recursive: true, force: true });
});
afterAll(async () => { await fs.rm(goc, { recursive: true, force: true }); });

describe('datDinhKem', () => {
  it('ghi đúng nội dung, trả đường dẫn TƯƠNG ĐỐI', async () => {
    const r = await datDinhKem(goc, 'nhat-ky.log', b64('xin chào'));
    expect(r.tuongDoi).toBe('.cuongthai/dinh-kem/nhat-ky.log');
    expect(await fs.readFile(path.join(goc, r.tuongDoi), 'utf8')).toBe('xin chào');
    expect(r.byte).toBe(Buffer.byteLength('xin chào', 'utf8'));
  });

  it('trùng tên thì thêm hậu tố, KHÔNG ghi đè bản cũ', async () => {
    const a = await datDinhKem(goc, 'log.txt', b64('bản một'));
    const b = await datDinhKem(goc, 'log.txt', b64('bản hai'));
    expect(a.tuongDoi).not.toBe(b.tuongDoi);
    expect(b.tuongDoi).toBe('.cuongthai/dinh-kem/log-1.txt');
    // Bản cũ còn nguyên — câu hỏi cũ trong hội thoại vẫn trỏ đúng nội dung nó
    // đã hỏi về.
    expect(await fs.readFile(path.join(goc, a.tuongDoi), 'utf8')).toBe('bản một');
  });

  it('tên trèo thư mục bị ép về trong thư mục đính kèm', async () => {
    const r = await datDinhKem(goc, '../../../thoat.txt', b64('x'));
    expect(r.tuongDoi).toBe('.cuongthai/dinh-kem/thoat.txt');
    await expect(fs.access(path.join(goc, '..', '..', '..', 'thoat.txt'))).rejects.toThrow();
  });

  it('quá trần thì TỪ CHỐI, không ghi gì', async () => {
    const to = 'a'.repeat(TRAN_BYTE_DINH_KEM + 1024);
    await expect(datDinhKem(goc, 'to.bin', Buffer.from(to).toString('base64'))).rejects.toThrow(/quá trần/);
    await expect(fs.readdir(thuMuc)).rejects.toThrow();   // thư mục còn chưa được tạo
  });

  it('file rỗng bị từ chối', async () => {
    await expect(datDinhKem(goc, 'rong.txt', b64(''))).rejects.toThrow(/rỗng/);
  });

  it('thêm `.cuongthai/` vào .git/info/exclude ĐÚNG MỘT LẦN', async () => {
    await fs.mkdir(path.join(goc, '.git', 'info'), { recursive: true });
    await fs.writeFile(path.join(goc, '.git', 'info', 'exclude'), '# có sẵn\n');
    await datDinhKem(goc, 'a.txt', b64('1'));
    await datDinhKem(goc, 'b.txt', b64('2'));
    // `boQuaTrongGit` chạy nền (`void`) — chờ một nhịp cho nó xong.
    await new Promise((r) => { setTimeout(r, 120); });
    const noi = await fs.readFile(path.join(goc, '.git', 'info', 'exclude'), 'utf8');
    expect(noi).toContain('# có sẵn');
    expect(noi.match(/\.cuongthai\//g)?.length).toBe(1);
  });

  it('không phải kho git thì vẫn ghi được file, không ném', async () => {
    const r = await datDinhKem(goc, 'khong-git.txt', b64('ok'));
    expect(await fs.readFile(path.join(goc, r.tuongDoi), 'utf8')).toBe('ok');
  });
});
