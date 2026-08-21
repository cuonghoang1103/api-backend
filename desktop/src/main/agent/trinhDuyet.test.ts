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


describe('tìm cửa sổ app — ĐỪNG ĐOÁN', () => {
  /*
   * 21/08/2026: `web_mo` dò cửa sổ bằng
   *     BrowserWindow.getAllWindows().find((w) => w.isResizable())
   * và trả "không tìm thấy cửa sổ app" trong khi app đang mở ngay trước mặt.
   * Agent không mở nổi trình duyệt, rồi quay ra bảo người dùng "bạn tự mở
   * khung trình duyệt giúp tôi" — nghe rất hợp lý, và sai hoàn toàn.
   *
   * `isResizable()` là thuộc tính của HỆ ĐIỀU HÀNH, đổi theo trạng thái cửa
   * sổ. Nó chưa bao giờ là cách nhận dạng "cửa sổ chính".
   */
  it('không còn dò cửa sổ bằng isResizable()', () => {
    expect(nguon, 'lại đi đoán cửa sổ bằng thuộc tính của hệ điều hành')
      .not.toContain('isResizable()');
  });

  it('dùng tham chiếu thẳng tới cửa sổ chính', () => {
    expect(nguon, 'không lấy cửa sổ qua layCuaSoChinh()').toContain('layCuaSoChinh()');
    const w = readFileSync(join(goc, 'src/main/window.ts'), 'utf8');
    expect(w, 'window.ts không xuất layCuaSoChinh').toContain('export function layCuaSoChinh');
    expect(w, 'không dọn tham chiếu khi cửa sổ đóng ⇒ giữ cửa sổ đã huỷ')
      .toMatch(/closed[\s\S]{0,120}cuaSoChinh = null/);
  });
});

describe('cờ `ep` — url là MỆNH LỆNH hay MẶC ĐỊNH', () => {
  /*
   * Tab "Trình duyệt" gọi `mo(vùng, 'http://localhost:3000')` mỗi lần gắn lại,
   * tức là NẠP ĐÈ. Người dùng đăng nhập FuOverflow, bấm sang tab Lập trình rồi
   * quay lại — trang đăng nhập biến mất về localhost. Trông y như app tự đăng
   * xuất họ; thật ra trang chỉ bị ghi đè.
   */
  it('BrowserMode KHÔNG ép nạp địa chỉ mặc định', () => {
    const bm = readFileSync(join(goc, 'src/renderer/features/chat/BrowserMode.tsx'), 'utf8');
    expect(bm, 'tab Trình duyệt lại ép nạp MAC_DINH mỗi lần gắn lại')
      .toContain('mo(vung, MAC_DINH, false)');
  });

  it('mo() chỉ nạp url khi được ÉP hoặc khi chưa có trang nào', () => {
    const b = readFileSync(join(goc, 'src/main/browser.ts'), 'utf8');
    const i = b.indexOf('export function mo(');
    expect(i, 'không thấy mo()').toBeGreaterThan(-1);
    const than = b.slice(i, b.indexOf('\n}', i));
    expect(than, 'mo() không nhận cờ ep').toContain('ep = true');
    expect(than, 'mo() vẫn nạp vô điều kiện').toContain('ep || trong');
  });

  /*
   * ⚠️ Phép kiểm ĐÁNG GIÁ NHẤT ở đây. Một cờ boolean phải khai ở NĂM nơi:
   * hàm, handler IPC, preload, schema zod, và interface DesktopBridge. Thiếu
   * riêng schema zod thì renderer gửi đi, main nhận `undefined`, cờ chết lặng
   * giữa đường — `tsc` xanh vì kiểu vẫn hợp lệ.
   */
  it('`ep` được khai ĐỦ ở cả năm nơi', () => {
    const ipc = readFileSync(join(goc, 'src/shared/ipc.ts'), 'utf8');
    const pre = readFileSync(join(goc, 'src/preload/index.ts'), 'utf8');
    const han = readFileSync(join(goc, 'src/main/ipc/browser.ts'), 'utf8');
    const b = readFileSync(join(goc, 'src/main/browser.ts'), 'utf8');
    expect(b, '1/5 hàm mo()').toContain('ep = true');
    expect(han, '2/5 handler IPC không chuyển tiếp ep').toContain('ep !== false');
    expect(pre, '3/5 preload không gửi ep').toContain('{ vung, url, ep }');
    const i = ipc.indexOf('browserMoSchema');
    expect(ipc.slice(i, i + 700), '4/5 schema zod thiếu ep ⇒ CỜ BỊ LỌC BỎ ÂM THẦM')
      .toContain('ep: z.boolean().optional()');
    const j = ipc.indexOf('mo(\n      vung:');
    expect(j, '5/5 DesktopBridge chưa khai ep').toBeGreaterThan(-1);
  });
});


describe('đứt kết nối giữa lượt — phải THÀNH MÃ, không ném thô', () => {
  /*
   * 21/08/2026: giữa một lượt agent đang tải tài liệu, người dùng nhận đúng
   * một chữ đỏ `terminated`. Đó là undici báo luồng SSE bị cắt — nhưng vì nó
   * bay thẳng lên catch chung, nó vừa KHÔNG nói được gì cho người dùng, vừa
   * KHÔNG có `ma` nên KHÔNG khớp `MA_DANG_THU_LAI` ⇒ không được thử lại, và
   * cả lượt 20 bước chết vì một nhịp mạng.
   *
   * Backend dịch chuỗi này từ 17/08, nhưng chỉ cho chặng backend↔cổng.
   */
  const lp = readFileSync(join(goc, 'src/main/agent/loop.ts'), 'utf8');

  it('bọc lời gọi lượt để bắt lỗi luồng', () => {
    expect(lp, 'không còn hàm thật được bọc').toContain('mgoiMotLuotThat');
  });

  it('nhận diện `terminated` và trả mã CONNECTION_LOST', () => {
    const i = lp.indexOf('return await mgoiMotLuotThat(o);');
    expect(i, 'không thấy chỗ bọc').toBeGreaterThan(-1);
    const than = lp.slice(i, i + 900);
    expect(than, 'không nhận diện chuỗi undici').toContain('terminated');
    expect(than, 'không trả mã đáng thử lại').toContain("ma: 'CONNECTION_LOST'");
    expect(than, 'nuốt luôn cả lệnh Dừng của người dùng').toContain('o.signal.aborted');
  });

  it('CONNECTION_LOST nằm trong nhóm được thử lại', () => {
    // Tìm chỗ KHAI BÁO, không phải chỗ dùng — `MA_DANG_THU_LAI.has(...)` xuất
    // hiện trước trong file và slice từ đó thì không chứa danh sách.
    const i = lp.indexOf('const MA_DANG_THU_LAI');
    expect(i, 'không thấy khai báo MA_DANG_THU_LAI').toBeGreaterThan(-1);
    expect(lp.slice(i, i + 400)).toContain("'CONNECTION_LOST'");
  });
});

describe('tải file phục vụ dạng XEM TẠI CHỖ', () => {
  /*
   * FuOverflow trả PDF với Content-Type `application/pdf` dạng xem tại chỗ, nên
   * Chromium đưa nó vào trình xem PDF dựng sẵn và `will-download` KHÔNG BAO GIỜ
   * bắn. Màn hình hiện PDF đàng hoàng trong khi agent chỉ thấy "hết giờ chờ" —
   * trông như lỗi vô lý.
   */
  const b = readFileSync(join(goc, 'src/main/browser.ts'), 'utf8');

  it('có đường lùi bằng net.request', () => {
    expect(b, 'không có đường lùi — PDF xem-tại-chỗ sẽ không bao giờ tải được')
      .toContain('async function taiBangNet');
    expect(b, 'đường lùi không dùng net.request').toMatch(/net\.request\(\{[\s\S]{0,120}session:/);
  });

  it('đường lùi vẫn mang cookie đăng nhập của khung', () => {
    const i = b.indexOf('async function taiBangNet');
    const than = b.slice(i, i + 1400);
    expect(than, 'không dùng đúng phân vùng ⇒ tải về trang "vui lòng đăng nhập"')
      .toContain('session.fromPartition(PHAN_VUNG)');
    expect(than, 'không bật cookie phiên').toContain('useSessionCookies: true');
  });

  it('hết giờ chờ thì ĐI ĐƯỜNG LÙI, không trả lỗi luôn', () => {
    const i = b.indexOf('gioBan = setTimeout');
    expect(i, 'không thấy đồng hồ chờ will-download').toBeGreaterThan(-1);
    const than = b.slice(i, i + 700);
    expect(than, 'vẫn trả lỗi thẳng thay vì thử đường lùi').toContain('taiBangNet(');
    expect(than, 'không gỡ khỏi hàng chờ ⇒ hai đường cùng ghi một file')
      .toContain('choTaiHienTai = null');
  });
});


describe('đồng hồ chờ không được biến thành hạn TẢI XONG', () => {
  /*
   * `gioBan` hỏi "máy chủ có trả file không". Không tắt nó lúc việc tải BẮT
   * ĐẦU thì nó âm thầm trở thành "phải tải xong trong ngần ấy giây", và mọi
   * file lớn đều bị báo hỏng trong khi đang chảy về bình thường.
   *
   * Đo thật 21/08/2026: `paper.pdf` 860KB về đĩa đầy đủ, đúng tên, mở được 3
   * trang — agent vẫn báo "máy chủ không trả file". Chỉ phát hiện được vì đi
   * NHÌN FILE TRÊN ĐĨA thay vì tin lời agent tường thuật.
   *
   * Và từ khi có đường lùi `taiBangNet`, một báo-hỏng-nhầm như thế làm file
   * được tải LẦN HAI ⇒ sinh bản trùng `paper (2).pdf`.
   */
  const b = readFileSync(join(goc, 'src/main/browser.ts'), 'utf8');

  it('hàng chờ mang theo callback `batDau`', () => {
    const i = b.indexOf('interface ChoTai');
    expect(i).toBeGreaterThan(-1);
    expect(b.slice(i, b.indexOf('\n}', i)), 'ChoTai không có batDau').toContain('batDau: () => void');
  });

  it('`will-download` gọi batDau ngay sau setSavePath', () => {
    const i = b.indexOf('muc.setSavePath(dich);');
    expect(i, 'không thấy setSavePath').toBeGreaterThan(-1);
    expect(b.slice(i, i + 400), 'tải bắt đầu rồi mà đồng hồ chờ vẫn chạy')
      .toContain('cho.batDau()');
  });

  it('batDau TẮT HẲN đồng hồ chờ', () => {
    // Tìm chỗ CÀI ĐẶT (`{`), không phải dòng khai kiểu trong interface —
    // `batDau: () => void` xuất hiện trước và slice từ đó thì rỗng.
    const i = b.indexOf('batDau: () => {');
    expect(i, 'taiFile không cung cấp batDau').toBeGreaterThan(-1);
    const than = b.slice(i, i + 160);
    expect(than, 'không huỷ đồng hồ').toContain('clearTimeout(gioBan)');
    expect(than, 'không đặt lại null ⇒ có thể huỷ nhầm lần sau').toContain('gioBan = null');
  });
});


describe('chống lồng thư mục khi tải', () => {
  /*
   * Model đặt `thu_muc` theo cây nó hình dung; GỐC tải thì do người dùng bấm
   * chọn — mà hộp thoại macOS nhớ chỗ mở lần trước. Cộng lại ra:
   *   Kì 3/DBI202/DBI202 - PE - FA25 - 2/Kì 3/DBI202/6319 - SP26 - RE/q1.jpg
   * Đo thật 21/08/2026. Không ai báo lỗi — file về đủ, đúng tên, chỉ nằm sai chỗ.
   */
  it('bỏ đoạn đầu đã có sẵn trong đường dẫn gốc', () => {
    const i = nguon.indexOf('function duongDanCon');
    expect(i).toBeGreaterThan(-1);
    const than = nguon.slice(i, nguon.indexOf('\n}', i));
    expect(than, 'không có bộ tên của gốc để đối chiếu').toContain('gocGiai.split(path.sep)');
    expect(than, 'không bỏ đoạn đầu trùng ⇒ vẫn lồng').toContain('tenGoc.has(');
  });

  it('vẫn GIỮ đoạn cuối — không được bỏ sạch thành ghi thẳng vào gốc', () => {
    const i = nguon.indexOf('function duongDanCon');
    const than = nguon.slice(i, nguon.indexOf('\n}', i));
    expect(than, 'thiếu chặn `doan.length - 1` ⇒ thư mục con biến mất')
      .toContain('doan.length - 1');
  });

  it('vẫn chặn leo ra ngoài gốc', () => {
    const i = nguon.indexOf('function duongDanCon');
    const than = nguon.slice(i, nguon.indexOf('\n}', i));
    expect(than, "bỏ mất chặn '..'").toContain("=== '..'");
    expect(than, 'bỏ mất phép so lại với gốc').toContain('startsWith(gocGiai');
  });
});


describe('hộp thoại chọn thư mục tải', () => {
  /*
   * Hộp thoại VẪN phải hiện mỗi cuộc — `web_tai` ghi ra ổ đĩa thật, ngoài
   * thư mục dự án, nên chỗ ghi phải là một cú bấm của người dùng chứ không
   * phải chuỗi ký tự model tự nghĩ ra. Nhưng mở nó ở `Downloads` mỗi lần thì
   * người dùng bấm nhầm vào thư mục con, và `thu_muc` cộng dồn thành đường
   * dẫn lồng năm tầng. Đo thật 21/08/2026.
   */
  it('mở sẵn ở thư mục đã chọn lần trước', () => {
    const i = nguon.indexOf('async function thuMucTaiCuaCuoc');
    expect(i, 'không còn hàm thuMucTaiCuaCuoc').toBeGreaterThan(-1);
    const than = nguon.slice(i, i + 1500);
    expect(than, 'không đọc lại lựa chọn cũ').toContain('aiThuMucTaiCuoi');
    expect(than, 'không dùng nó làm defaultPath').toMatch(/defaultPath:[\s\S]{0,80}lanTruoc/);
  });

  it('vẫn HỎI, không tự dùng lại', () => {
    const i = nguon.indexOf('async function thuMucTaiCuaCuoc');
    const than = nguon.slice(i, i + 1500);
    expect(than, 'bỏ mất hộp thoại ⇒ mất luôn ranh giới cho phép')
      .toContain('showOpenDialog');
  });

  it('ghi nhớ lựa chọn sau khi người dùng bấm', () => {
    const i = nguon.indexOf('async function thuMucTaiCuaCuoc');
    const than = nguon.slice(i, i + 1500);
    expect(than, 'không lưu lại ⇒ lần sau lại mở ở Downloads')
      .toContain("setSetting('aiThuMucTaiCuoi'");
  });

  it('khoá cài đặt được khai trong schema — thiếu là bị lọc bỏ ÂM THẦM', () => {
    const ipc = readFileSync(join(goc, 'src/shared/ipc.ts'), 'utf8');
    expect(ipc, 'settingKeySchema thiếu aiThuMucTaiCuoi').toContain("'aiThuMucTaiCuoi'");
  });
});
