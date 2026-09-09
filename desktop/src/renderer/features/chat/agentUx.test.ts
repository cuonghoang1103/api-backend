/**
 * Ba lỗi người dùng báo ngày 24/08/2026, canh để không tái diễn.
 *
 * ⚠️ Đây là phép kiểm ĐỌC NGUỒN. Nói rõ vì sao: `AgentMode` chỉ dựng sau khi
 * đăng nhập và cần cầu nối Electron, nên `do:bo-cuc` (dựng lại vỏ thủ công) và
 * `smoke.mjs` (dừng ở màn đăng nhập) đều không với tới. Ba thứ dưới đây là
 * những chỗ dễ bị "dọn dẹp" mất nhất.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const doc = (p: string) => readFileSync(join(__dirname, p), 'utf8');
const agentMode = doc('AgentMode.tsx');
const useAgent = doc('useAgent.ts');
const loop = doc('../../../main/agent/loop.ts');
const baoMat = doc('../../../main/security.ts');

describe('1. nút Chép phải chạy được', () => {
  /*
   * `navigator.clipboard.writeText()` ném `NotAllowedError: Write permission
   * denied` nếu Electron không cấp quyền — KỂ CẢ khi có cử chỉ bấm thật. Đo
   * trong bản đóng gói: trước khi thêm quyền HỎNG, sau khi thêm OK và chữ vào
   * đúng clipboard hệ điều hành. Cả kho có ~40 lời gọi `writeText`, và chỗ nào
   * cũng `.catch()` bỏ qua nên hỏng hoàn toàn im lặng.
   */
  it('quyền clipboard được cấp ở main', () => {
    expect(baoMat, 'thiếu quyền ⇒ MỌI nút Chép trong app im lặng không làm gì')
      .toContain('clipboard-sanitized-write');
  });

  it('KHÔNG mở quyền ĐỌC clipboard', () => {
    /* Ghi là app đưa dữ liệu RA; đọc là app lấy thứ người dùng đã chép ở nơi
       khác — mật khẩu, số thẻ. Không tính năng nào cần đọc. */
    expect(baoMat).not.toContain("'clipboard-read'");
  });
});

describe('2. gõ được trong lúc agent chạy', () => {
  it('ô nhập KHÔNG bị disabled theo `dangChay`', () => {
    const o = agentMode.slice(agentMode.indexOf('className="ct-agent-o"'));
    const den = o.slice(0, o.indexOf('/>'));
    expect(den, 'khoá ô nhập là bắt người dùng bấm Dừng — vứt một lượt đã trả tiền')
      .not.toMatch(/disabled=\{trangThai\.dangChay\}/);
  });

  it('có hàng chờ, và nó XẾP HÀNG chứ không chen ngang', () => {
    expect(agentMode).toContain('hangCho');
    expect(agentMode, 'đang chạy thì phải xếp hàng, không bỏ qua câu vừa gõ')
      .toMatch(/if \(trangThai\.dangChay\) \{\s*\n\s*datHangCho/);
  });

  it('hàng chờ được RÚT khi lượt xong', () => {
    expect(agentMode, 'xếp vào mà không rút ra thì câu nằm đó vĩnh viễn')
      .toMatch(/useEffect\([\s\S]{0,400}hangCho\.length === 0[\s\S]{0,300}void gui\(/);
  });
});

describe('3. thấy được tool đang chạy', () => {
  /*
   * `phat({ loai: 'tool' })` chỉ chạy SAU khi tool xong. Tool dài (tạo PDF,
   * `npm test`, tải một lô file) ⇒ màn hình đứng im hàng chục giây.
   */
  it('main phát sự kiện TRƯỚC khi gọi tool', () => {
    expect(loop, "thiếu `toolBatDau` ⇒ tool chạy lâu là im lặng hoàn toàn")
      .toContain("loai: 'toolBatDau'");
    const iBatDau = loop.indexOf("loai: 'toolBatDau'");
    const iXong = loop.indexOf("loai: 'tool', id: goi.id");
    expect(iBatDau, 'phải phát TRƯỚC, không phải sau').toBeLessThan(iXong);
  });

  it('renderer THAY dòng đang chạy, không đẻ dòng thứ hai', () => {
    expect(useAgent).toContain("case 'toolBatDau'");
    expect(useAgent, 'phải tìm đúng dòng theo `id` rồi thay')
      .toMatch(/findLastIndex[\s\S]{0,200}dangChay === true/);
  });

  it('giao diện vẽ con quay cho dòng đang chạy', () => {
    expect(agentMode).toMatch(/m\.dangChay === true/);
    expect(agentMode, 'phải nói tool đang LÀM GÌ, không chỉ hiện tên tool')
      .toContain('viecCuaTool');
  });
});

describe('4. màn hình KHÔNG được đứng im giữa hai vòng', () => {
  /*
   * Người dùng báo 10/09/2026: *"nãy nó không hiện làm tôi cứ tưởng nó bị ngắt
   * lang giữa chừng"*.
   *
   * `dangNghi` bị tắt ở gần như MỌI sự kiện (`chu`, `toolBatDau`, `tool`, cả
   * năm loại `xinPhep*`) và chỉ bật lại ở `batDau` của vòng SAU. Nên sau mỗi
   * tool có một khoảng dài đúng bằng một lượt gọi cổng — 2,4–4,7 giây theo
   * bảng đo trong CLAUDE.md — mà không một điểm ảnh nào đổi.
   *
   * `dangChay` bật ở `gui()` và tắt ở `finally`, phủ trọn lượt, không kẽ hở.
   * Thanh trạng thái PHẢI bám cờ đó. Đây chính là chỗ dễ bị "dọn dẹp" ngược
   * lại nhất, vì `dangNghi` nghe hợp lý hơn khi đọc tên.
   */
  it('thanh trạng thái keo theo `dangChay`, KHÔNG phải `dangNghi`', () => {
    expect(agentMode, 'thiếu thanh ⇒ không có gì hiện giữa hai vòng')
      .toContain('<ThanhDangLam');
    expect(agentMode, 'bám `dangNghi` là để lại đúng khoảng chết cũ')
      .toMatch(/trangThai\.dangChay && \(\s*<ThanhDangLam/);
  });

  it('đang chờ NGƯỜI DÙNG duyệt thì thanh không được quay', () => {
    // Quay tiếp lúc đó là bảo người ta ngồi đợi một thứ đang đợi chính họ —
    // cùng lý do `useAgent` tắt con quay ở mọi nhánh `xinPhep`.
    const viec = doc('viecDangLam.ts');
    expect(viec).toMatch(/kieu: 'cho'/);
    expect(viec, 'phải dừng ở mục `nguoi` — thẻ bỏ dở của lượt trước làm kẹt mọi lượt sau')
      .toMatch(/m\.kieu === 'nguoi'\) break/);
  });
});

describe('5. khung web mở được bằng TAY, không chỉ chờ agent', () => {
  /*
   * Khung `KhungWeb` có từ 19/08/2026 nhưng đường mở duy nhất là agent gọi
   * `web_mo`. Người dùng muốn xem trang chạy trong lúc agent sửa mã thì phải
   * sang tab Trình duyệt — và mất luôn cột AI Code, đúng cái bước thủ công mà
   * khung này sinh ra để bỏ đi.
   */
  it('có nút mở khung, và nút KHÔNG bị khoá lúc agent chạy', () => {
    expect(agentMode).toContain('Khung web');
    // Lúc agent đang chạy mới là lúc cần nhìn trang nhất.
    const i = agentMode.indexOf("data-bat={webUrl !== null}");
    expect(i, 'không tìm thấy nút mở khung web').toBeGreaterThan(-1);
    const nut = agentMode.slice(i, i + 700);
    expect(nut, 'khoá theo `dangChay` là khoá đúng lúc cần dùng nhất')
      .not.toContain('disabled={trangThai.dangChay}');
  });

  it('mở bằng tay KHÔNG được nạp đè trang đang mở', () => {
    /* Cùng MỘT `WebContentsView` dùng chung với tab Trình duyệt. Ép nạp
       localhost mỗi lần bấm nút là cuốn phăng trang người dùng vừa đăng nhập —
       đúng lỗi mà `ep: false` của `BrowserMode` đã có sẵn để tránh. */
    expect(agentMode).toMatch(/url: WEB_MAC_DINH, ep: false/);
    const khungWeb = doc('KhungWeb.tsx');
    expect(khungWeb, '`ep` không đi tới main thì cờ chết lặng giữa đường')
      .toContain('cau.browser.mo(vung, url, ep)');
  });
});
