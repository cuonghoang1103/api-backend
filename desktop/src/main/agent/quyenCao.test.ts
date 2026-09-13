import { describe, expect, it } from 'vitest';

import { BIEN_LENH, BIEN_RA, CHO_LENH, cachGoi, ghepLenh, hopSeHien } from './quyenCao';
import type { Nen } from './quyenCao';

/**
 * Đây là bộ kiểm của một đường chạy lệnh với quyền ROOT. Điều duy nhất giữ nó
 * an toàn là: **thứ người dùng đọc và bấm duyệt chính là thứ chạy ra**. Nếu
 * chuỗi lệnh bị nối vào giữa một câu PowerShell/AppleScript thì một dấu nháy
 * không thoát đúng là đủ để hai thứ đó khác nhau — và người dùng không có cách
 * nào biết.
 */

/** Mấy tải trọng thật sự phá được nếu có ai đó đi nối chuỗi. */
const HIEM = [
  'npm i -g opencode-ai',
  'echo "a"; rm -rf /',
  "echo 'a' && whoami",
  'echo `id`',
  'echo $(id)',
  'echo "\\"; shutdown -h now; #"',
  ['npm i -g a', 'rm -rf /'].join('\n'),
];

describe('⛔ chuỗi lệnh KHÔNG được nối vào script', () => {
  for (const nen of ['win32', 'darwin'] as const) {
    it(`${nen}: không tải trọng nào xuất hiện trong tham số`, () => {
      const { args } = cachGoi(nen);
      const het = args.join(' || ');
      for (const l of HIEM) {
        // Lệnh đi qua BIẾN MÔI TRƯỜNG. Thấy nó trong `args` nghĩa là ai đó đã
        // quay lại kiểu nối chuỗi, và cả lớp bảo vệ sụp theo.
        expect(het, `tải trọng lọt vào args: ${l}`).not.toContain(l);
      }
      // Và script PHẢI nhắc tên biến — nếu không thì nó lấy lệnh ở đâu?
      expect(het).toContain(BIEN_LENH);
    });
  }

  it('linux: lệnh là MỘT phần tử argv, không phải chuỗi bị phân tích lại', () => {
    /* `pkexec` cố ý KHÔNG chuyển tiếp biến môi trường, nên ở đây lệnh buộc
       phải đi qua tham số. Vẫn an toàn vì đó là argv: `bash -lc <lenh>` nhận
       nguyên văn phần tử cuối, không có shell nào tách nó lần nữa. */
    const { prog, args } = cachGoi('linux');
    expect(prog).toBe('pkexec');
    expect(args.slice(0, -1)).toEqual(['--disable-internal-agent', 'bash', '-lc']);
    expect(args[args.length - 1]).toBe(CHO_LENH);
  });

  it('⛔⛔ đưa chuỗi lệnh cho `cachGoi` KHÔNG làm đổi gì trong đầu ra', () => {
    /* Đây là phép kiểm thật sự của cả tính năng.
     *
     * ⚠️ Bản đầu viết `expect(cachGoi.length).toBe(1)` và nó KHÔNG đỏ khi tôi
     * thử thêm `cachGoi(nen, _lenh = '')` — `Function.length` bỏ qua mọi tham
     * số có giá trị mặc định, mà "thêm tham số có mặc định" đúng là cách người
     * ta hay thêm. Phép kiểm đạt vì lý do sai; xem
     * [[feedback_phep_kiem_dat_vi_ly_do_sai]].
     *
     * Kiểm HÀNH VI thì không né được: gọi kèm một tải trọng, và đầu ra phải
     * giống hệt lúc không kèm. Ai đó thêm tham số RỒI DÙNG nó là đỏ ngay. */
    const kemLenh = cachGoi as unknown as (n: Nen, l?: string) => ReturnType<typeof cachGoi>;
    for (const nen of ['win32', 'darwin', 'linux'] as const) {
      const khong = cachGoi(nen);
      for (const l of HIEM) {
        expect(kemLenh(nen, l), `đầu ra đổi theo chuỗi lệnh ở ${nen}`).toEqual(khong);
      }
    }
  });

  it('⛔ ghép lệnh THAY TRỌN một phần tử, không nối vào giữa phần tử nào', () => {
    for (const nen of ['win32', 'darwin', 'linux'] as const) {
      const goi = cachGoi(nen);
      for (const l of HIEM) {
        const args = ghepLenh(goi, l);
        // Mỗi phần tử hoặc LÀ nguyên chuỗi lệnh, hoặc không chứa nó chút nào.
        for (const a of args) {
          if (a === l) continue;
          expect(a, `nối vào giữa một phần tử: ${a}`).not.toContain(l);
        }
        // Và số phần tử không đổi — không ai được chèn thêm gì.
        expect(args).toHaveLength(goi.args.length);
      }
    }
  });
});

describe('cách gọi từng nền tảng', () => {
  it('Windows: PowerShell, và PHẢI có -NoProfile', () => {
    const { prog, args, raQuaTep } = cachGoi('win32');
    expect(prog).toBe('powershell.exe');
    // `-NoProfile`: hồ sơ PowerShell của người dùng có thể định nghĩa lại
    // `Start-Process`, và nó chạy TRƯỚC script này.
    expect(args).toContain('-NoProfile');
    expect(args.join(' ')).toContain('-Verb RunAs');
    expect(raQuaTep).toBe(true);
  });

  it('⛔ Windows PHẢI hứng đầu ra qua tệp', () => {
    // `Start-Process -Verb RunAs` mở console MỚI ở phiên có quyền; console đó
    // không nối vào tiến trình này, nên stdout về rỗng. Quên bước tệp thì lệnh
    // chạy thật mà màn hình không hiện gì — trông y hệt "không chạy".
    const { args } = cachGoi('win32');
    expect(args.join(' ')).toContain(BIEN_RA);
  });

  it('macOS: osascript với administrator privileges, đọc lệnh từ biến', () => {
    const { prog, args, raQuaTep } = cachGoi('darwin');
    expect(prog).toBe('osascript');
    expect(args[0]).toBe('-e');
    expect(args[1]).toContain('with administrator privileges');
    expect(args[1]).toContain(`system attribute "${BIEN_LENH}"`);
    // macOS trả stdout thẳng về, không cần tệp trung gian.
    expect(raQuaTep).toBe(false);
  });

  it('không nền nào đi qua shell — `shell: false` là cả điểm của cách này', () => {
    // Ghim bằng hình dạng: `prog` phải là một chương trình cụ thể, không phải
    // một chuỗi lệnh. Có khoảng trắng trong `prog` là dấu hiệu ai đó vừa quay
    // lại kiểu "đưa cả câu cho shell".
    for (const nen of ['win32', 'darwin', 'linux'] as const) {
      expect(cachGoi(nen).prog).not.toMatch(/\s/);
    }
  });
});

describe('câu báo trước hộp của hệ điều hành', () => {
  it('mỗi nền một câu, và câu nào cũng gọi đúng tên thứ sắp hiện', () => {
    // Người dùng bấm duyệt trong app rồi thấy MỘT hộp nữa hiện lên. Không nói
    // trước thì họ tưởng app hỏng hoặc bấm nhầm.
    expect(hopSeHien('win32')).toContain('UAC');
    expect(hopSeHien('darwin')).toContain('mật khẩu');
    expect(hopSeHien('linux')).toContain('polkit');
  });
});
