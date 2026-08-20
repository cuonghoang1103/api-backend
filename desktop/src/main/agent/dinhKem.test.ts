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
const { tenAnToan, datDinhKem, datDinhKemTuDuong, TRAN_BYTE_DINH_KEM } = await import('./dinhKem');

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

/**
 * Kéo-thả từ Finder — đường ĐƯỜNG DẪN THẬT.
 *
 * Ba tình huống mà đường base64 cũ không làm được, và đó cũng là ba thứ người
 * dùng báo hỏng ngày 20/08/2026: thư mục, file đã nằm sẵn trong dự án, và file
 * lớn. Hai cái đầu kiểm được ở đây.
 */
describe('datDinhKemTuDuong — kéo-thả từ Finder', () => {
  let goc: string;
  let ngoai: string;

  beforeEach(async () => {
    goc = await fs.mkdtemp(path.join(os.tmpdir(), 'ct-keo-'));
    ngoai = await fs.mkdtemp(path.join(os.tmpdir(), 'ct-ngoai-'));
  });

  it('file NGOÀI dự án thì chép vào .cuongthai/dinh-kem', async () => {
    const f = path.join(ngoai, 'log.txt');
    await fs.writeFile(f, 'nội dung thật');
    const r = await datDinhKemTuDuong(goc, f);

    expect(r.coSan).toBe(false);
    expect(r.laThuMuc).toBe(false);
    expect(r.tuongDoi).toBe(path.join('.cuongthai', 'dinh-kem', 'log.txt'));
    expect(await fs.readFile(path.join(goc, r.tuongDoi), 'utf8')).toBe('nội dung thật');
  });

  it('file VỐN Ở TRONG dự án thì KHÔNG chép, chỉ trỏ vào chính nó', async () => {
    await fs.mkdir(path.join(goc, 'src'));
    const f = path.join(goc, 'src', 'index.ts');
    await fs.writeFile(f, 'export {};');

    const r = await datDinhKemTuDuong(goc, f);
    expect(r.coSan).toBe(true);
    expect(r.tuongDoi).toBe(path.join('src', 'index.ts'));
    // Không được đẻ ra bản sao — agent sửa bản sao thì dự án thật không đổi gì.
    await expect(fs.readdir(path.join(goc, '.cuongthai'))).rejects.toThrow();
  });

  it('THƯ MỤC trong dự án được nhận (agent có list_dir/grep)', async () => {
    await fs.mkdir(path.join(goc, 'src', 'sau'), { recursive: true });
    const r = await datDinhKemTuDuong(goc, path.join(goc, 'src', 'sau'));
    expect(r.laThuMuc).toBe(true);
    expect(r.coSan).toBe(true);
    expect(r.tuongDoi).toBe(path.join('src', 'sau'));
  });

  it('THƯ MỤC ngoài dự án bị từ chối, kèm lý do dùng được', async () => {
    await expect(datDinhKemTuDuong(goc, ngoai)).rejects.toThrow(/ngoài dự án/);
  });

  /*
   * Bẫy tiền tố: `/tmp/duan-cu` cũng `startsWith('/tmp/duan')`. So bằng chuỗi
   * thì file của một dự án KHÁC bị coi là "đã trong dự án", rồi agent nhận một
   * đường tương đối mà cái ngục sẽ từ chối — hỏng ở tận nơi khác.
   */
  it('thư mục anh em có tên là TIỀN TỐ của gốc KHÔNG bị coi là bên trong', async () => {
    const anhEm = `${goc}-cu`;
    await fs.mkdir(anhEm, { recursive: true });
    const f = path.join(anhEm, 'a.txt');
    await fs.writeFile(f, 'x');

    const r = await datDinhKemTuDuong(goc, f);
    expect(r.coSan).toBe(false);                          // phải là CHÉP VÀO
    expect(r.tuongDoi.startsWith('.cuongthai')).toBe(true);
    await fs.rm(anhEm, { recursive: true, force: true });
  });

  it('file rỗng và file quá trần đều bị từ chối', async () => {
    const rong = path.join(ngoai, 'rong.txt');
    await fs.writeFile(rong, '');
    await expect(datDinhKemTuDuong(goc, rong)).rejects.toThrow(/rỗng/);

    const to = path.join(ngoai, 'to.bin');
    await fs.writeFile(to, Buffer.alloc(TRAN_BYTE_DINH_KEM + 1));
    await expect(datDinhKemTuDuong(goc, to)).rejects.toThrow(/quá trần/);
  });

  it('trùng tên thì thêm hậu tố, KHÔNG ghi đè', async () => {
    const a = path.join(ngoai, 'note.txt');
    await fs.writeFile(a, 'lần 1');
    const r1 = await datDinhKemTuDuong(goc, a);
    await fs.writeFile(a, 'lần 2');
    const r2 = await datDinhKemTuDuong(goc, a);

    expect(r1.tuongDoi).not.toBe(r2.tuongDoi);
    expect(await fs.readFile(path.join(goc, r1.tuongDoi), 'utf8')).toBe('lần 1');
    expect(await fs.readFile(path.join(goc, r2.tuongDoi), 'utf8')).toBe('lần 2');
  });

  it('đường dẫn không tồn tại thì ném, không trả về im lặng', async () => {
    await expect(datDinhKemTuDuong(goc, path.join(ngoai, 'khong-co'))).rejects.toThrow();
  });
});
