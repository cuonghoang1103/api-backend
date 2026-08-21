/**
 * Quyền trình duyệt: mở/đọc/console TỰ DO, bấm/gõ PHẢI DUYỆT.
 *
 * Ranh giới này do người dùng chốt 19/08/2026, và lý do nằm ở chỗ trang đang
 * mở chạy bằng phiên đăng nhập THẬT của họ: một cú `web_bam` trúng nút xoá
 * thì không có `git checkout` nào lấy lại được. Ngược lại, bắt duyệt cả việc
 * ĐỌC thì agent hỏi năm câu cho một lần xem trang — người dùng sẽ bấm bừa, và
 * lúc đó cái duyệt ở `web_bam` cũng mất giá trị.
 */
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it, vi } from 'vitest';

/*
 * `browser.ts` nạp `electron` ngay ở đầu file, mà `electron` không chạy được
 * ngoài Electron. Giả lập tối thiểu là đủ: phần ta muốn kiểm (`tenSach`,
 * `duongDanChuaCo`) là hàm thuần, và `session.fromPartition` chỉ bị gọi bên
 * trong `ganBatTai()` lúc tải thật.
 *
 * Kiểm HÀNH VI thật chứ không so chuỗi trong mã: đây là lớp chặn duy nhất giữa
 * một tên file do máy chủ của người khác đặt và ổ đĩa của người dùng.
 */
vi.mock('electron', () => ({
  BrowserWindow: { getAllWindows: () => [] },
  WebContentsView: class {},
  session: { fromPartition: () => ({ on: () => {} }) },
  shell: {},
}));

const goc = join(import.meta.dirname, '../../..');
const nguon = readFileSync(join(goc, 'src/main/agent/tools.ts'), 'utf8');

const { duongDanChuaCo, tenSach } = await import('../browser');

describe('quyền trình duyệt', () => {
  it('bấm/gõ đi qua hoiNguoiDung', () => {
    const i = nguon.indexOf('async function toolWebTacDong');
    expect(i, 'không còn hàm toolWebTacDong').toBeGreaterThan(-1);
    const than = nguon.slice(i, i + 2600);
    expect(than, 'web_bam/web_go KHÔNG xin duyệt — một cú bấm nhầm là không hoàn tác được')
      .toContain('hoiNguoiDung');
    expect(than, 'không được cho NHỚ: cùng bộ chọn trên hai trang là hai việc khác nhau')
      .toContain('choNho: false');
  });

  it('mở/đọc/console/chụp KHÔNG xin duyệt', () => {
    for (const ten of ['toolWebMo', 'toolWebDoc', 'toolWebConsole', 'toolWebAnh', 'toolWebLienKet']) {
      const i = nguon.indexOf(`async function ${ten}`);
      expect(i, `không thấy ${ten}`).toBeGreaterThan(-1);
      const than = nguon.slice(i, nguon.indexOf('\n}', i));
      expect(than, `${ten} đang xin duyệt — việc chỉ QUAN SÁT thì không nên hỏi`)
        .not.toContain('hoiNguoiDung');
    }
  });

  it('máy chủ khai đủ 8 tool trình duyệt, đều thuộc quyền `browser`', () => {
    const mc = readFileSync(join(goc, '../src/services/agent/tools.ts'), 'utf8');
    for (const t of [
      'web_mo', 'web_doc', 'web_anh', 'web_console', 'web_bam', 'web_go', 'web_lien_ket', 'web_tai',
    ]) {
      const i = mc.indexOf(`name: '${t}'`);
      expect(i, `máy chủ chưa khai ${t}`).toBeGreaterThan(-1);
      expect(mc.slice(i, i + 400), 'thiếu capability browser: ' + t).toContain('capability: \'browser\'');
    }
  });

  it('app chạy được mọi tool máy chủ khai — thiếu một cái là model gọi vào hư không', () => {
    const mc = readFileSync(join(goc, '../src/services/agent/tools.ts'), 'utf8');
    const khai = [...mc.matchAll(/name: '(web_[a-z_]+)'/g)].map((m) => m[1]!);
    const thieu = khai.filter((t) => !nguon.includes(`case '${t}'`));
    expect(thieu, `app không cài: ${thieu.join(', ')}`).toEqual([]);
  });
});

describe('ảnh chụp trang', () => {
  it('web_anh chặn ảnh quá lớn — máy chủ BỎ IM LẶNG nếu vượt trần', () => {
    const i = nguon.indexOf('async function toolWebAnh');
    expect(i, 'không thấy toolWebAnh').toBeGreaterThan(-1);
    const than = nguon.slice(i, nguon.indexOf('\n}', i));
    expect(than, 'không kiểm cỡ ảnh ⇒ máy chủ lọc bỏ và model tưởng đã xem rồi bịa bố cục')
      .toContain('5_600_000');
    expect(than).toContain('anh: [{ media_type');
  });
});

describe('prompt phải DẠY model dùng tool trình duyệt', () => {
  /*
   * Người dùng bật "Trình duyệt: BẬT" rồi bảo "mở localhost:3000", agent vẫn
   * gọi `doc_web` — tool cũ, chặn localhost — rồi trả lời "tôi không mở được
   * localhost, bạn tự mở giúp". Tool `web_mo` CÓ trong danh sách gửi lên, quyền
   * CÓ tới máy chủ; thứ thiếu là prompt không nhắc một chữ nào về chúng, nên
   * model với lấy cái tool nó quen.
   *
   * Khai một tool là chưa đủ để nó được dùng.
   */
  const mc = readFileSync(join(goc, '../src/services/agent/prompt.ts'), 'utf8');

  it('có mục riêng cho trình duyệt, gắn theo quyền `browser`', () => {
    expect(mc, 'prompt không gắn mục nào theo quyền browser').toContain('includes(\'browser\')');
    expect(mc, 'prompt không nhắc web_mo').toContain('web_mo');
  });

  it('nói thẳng là ĐỪNG dùng doc_web khi đã có web_mo', () => {
    expect(mc, 'model sẽ tiếp tục với lấy doc_web vì nó quen hơn').toMatch(/ĐỪNG DÙNG .{0,3}doc_web/);
  });

  it('mô tả doc_web tự chỉ sang web_mo', () => {
    const t = readFileSync(join(goc, '../src/services/agent/tools.ts'), 'utf8');
    const i = t.indexOf('name: \'doc_web\'');
    expect(t.slice(i, i + 900), 'mô tả doc_web không chỉ đường sang web_mo').toContain('web_mo');
  });
});


describe('tải file — tên file đến từ máy chủ CỦA NGƯỜI KHÁC', () => {
  it('mọi dấu tách thư mục bị đổi thành gạch ngang', () => {
    expect(tenSach('../../.ssh/authorized_keys')).not.toContain('/');
    expect(tenSach('..\\..\\Windows\\system32\\a.dll')).not.toContain('\\');
    // Không còn mở đầu bằng dấu chấm ⇒ không tạo file ẩn, không leo thư mục.
    expect(tenSach('../../x.pdf').startsWith('.')).toBe(false);
  });

  it('tên rỗng hoặc toàn ký tự cấm vẫn ra một tên dùng được', () => {
    expect(tenSach('')).toBe('tai-ve.bin');
    expect(tenSach('   ')).toBe('tai-ve.bin');
    expect(tenSach('...')).toBe('tai-ve.bin');
  });

  it('tên quá dài bị cắt nhưng GIỮ đuôi — mất đuôi là mở nhầm ứng dụng', () => {
    const t = tenSach(`${'a'.repeat(400)}.pdf`);
    expect(t.length).toBeLessThanOrEqual(120);
    expect(t.endsWith('.pdf')).toBe(true);
  });

  it('giữ nguyên chữ có dấu — tài liệu của trường toàn tiếng Việt', () => {
    expect(tenSach('Đề thi cuối kỳ PRF192.pdf')).toBe('Đề thi cuối kỳ PRF192.pdf');
  });

  it('KHÔNG ghi đè file đã có', () => {
    const thu = mkdtempSync(join(tmpdir(), 'tai-'));
    try {
      const f = join(thu, 'de-thi.pdf');
      writeFileSync(f, 'x');
      const moi = duongDanChuaCo(f);
      expect(moi, 'ghi đè thì bản tốt của người dùng biến mất không dấu vết').not.toBe(f);
      expect(moi).toContain('de-thi (2).pdf');
    } finally {
      rmSync(thu, { recursive: true, force: true });
    }
  });
});

describe('quyền tải file', () => {
  it('web_tai phải ghi vào thư mục người dùng TỰ CHỌN', () => {
    const i = nguon.indexOf('async function toolWebTai');
    expect(i, 'không còn hàm toolWebTai').toBeGreaterThan(-1);
    const than = nguon.slice(i, i + 4500);
    expect(than, 'ghi thẳng ra đĩa mà không có ranh giới nào do người dùng chọn')
      .toContain('thuMucTaiCuaCuoc');
  });

  it('thư mục con do MODEL đặt không được leo ra ngoài', () => {
    const i = nguon.indexOf('function duongDanCon');
    expect(i, 'không còn hàm duongDanCon').toBeGreaterThan(-1);
    const than = nguon.slice(i, nguon.indexOf('\n}', i));
    expect(than, 'không chặn đoạn leo thư mục').toContain('=== \'..\'');
    expect(than, 'không so lại đường dẫn đã giải với gốc').toContain('startsWith(gocGiai');
  });

  it('file CHẠY ĐƯỢC hỏi duyệt RIÊNG, dù thư mục đã được duyệt', () => {
    const i = nguon.indexOf('async function toolWebTai');
    const than = nguon.slice(i, i + 4500);
    expect(than, 'tải .exe/.dmg mà không hỏi gì thêm').toContain('DUOI_CHAY_DUOC');
    expect(than, 'không xin duyệt cho file chạy được').toContain('hoiNguoiDung');
  });
});

describe('prompt phải dạy đúng THỨ TỰ tải', () => {
  const pr = readFileSync(join(goc, '../src/services/agent/prompt.ts'), 'utf8');

  it('dạy lấy link bằng web_lien_ket thay vì tự dựng URL', () => {
    expect(pr, 'prompt không nhắc web_lien_ket').toContain('web_lien_ket');
    expect(pr, 'prompt không nhắc web_tai').toContain('web_tai');
    expect(pr, 'không cảnh báo việc tự đoán URL — đoán sai thì lưu trang lỗi thành .pdf')
      .toContain('ĐỪNG TỰ DỰNG URL');
  });

  it('dạy nhìn DUNG LƯỢNG để phát hiện file hỏng', () => {
    expect(pr, 'không có cách nào nhận ra "tải xong" mà file là trang đăng nhập')
      .toContain('DUNG LƯỢNG');
  });

  it('cấm điền mật khẩu hộ người dùng', () => {
    expect(pr, 'prompt không cấm agent tự gõ mật khẩu').toContain('để điền mật khẩu');
  });
});
