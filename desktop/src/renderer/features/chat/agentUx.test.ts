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
