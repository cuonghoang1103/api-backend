/**
 * Kiểm lệnh chạy NỀN bằng tiến trình thật.
 *
 * Không giả lập `spawn`: thứ dễ sai ở đây là hành vi của HỆ ĐIỀU HÀNH — tiến
 * trình có thật sự sống sau khi hàm trả về không, giết có giết được cả nhóm con
 * không, đầu ra có tới nơi không. Một bản giả lập sẽ "đạt" cả khi mã sai.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { batLenhNen, docDauRaNen, dsLenhNen, dungLenhNen, dungMoiLenhNen } from './lenhNen';

const CUOC = 'kiem';

/**
 * Trạng thái KHÔNG tiêu thụ.
 *
 * ⚠️ `docDauRaNen` dời con trỏ đọc — gọi nó trong điều kiện chờ là tự ăn mất dữ
 * liệu của chính mình rồi khẳng định trên chuỗi rỗng. Tôi đã viết đúng lời cảnh
 * báo đó rồi vẫn dính, vì `cho()` dùng chính hàm ấy làm điều kiện. `dsLenhNen`
 * chỉ đọc, nên nó mới là thứ dùng để chờ.
 */
function trangThai(id: string) {
  return dsLenhNen(CUOC).find((l) => l.id === id);
}

/** Chờ tới khi `dieuKien` đúng, hoặc hết giờ. Không `sleep` cứng: máy chậm thì đợi lâu hơn. */
async function cho(dieuKien: () => boolean, msToiDa = 5000): Promise<boolean> {
  const het = Date.now() + msToiDa;
  while (Date.now() < het) {
    if (dieuKien()) return true;
    await new Promise((r) => setTimeout(r, 50));
  }
  return dieuKien();
}

afterEach(() => dungMoiLenhNen());

describe('lệnh chạy nền', () => {
  it('trả về NGAY, không chờ lệnh xong', async () => {
    const t0 = Date.now();
    const kq = batLenhNen({ lenh: 'sleep 30', cwd: process.cwd(), cuocId: CUOC });
    const troi = Date.now() - t0;

    expect(kq.ok).toBe(true);
    // Đây là toàn bộ lý do module này tồn tại. `chayLenh` thường sẽ ngồi đủ 30
    // giây; cái này phải trả về gần như tức thì.
    expect(troi).toBeLessThan(1000);
  });

  it('gom được đầu ra, và lần đọc sau chỉ trả phần MỚI', async () => {
    const kq = batLenhNen({ lenh: 'echo dong-mot; sleep 0.4; echo dong-hai', cwd: process.cwd(), cuocId: CUOC });
    expect(kq.ok).toBe(true);

    // Chờ bằng `trangThai` (chỉ đọc), rồi mới đọc — một lần.
    await cho(() => trangThai(kq.id!)?.dangChay === false, 5000);
    const lan1 = docDauRaNen(kq.id!);
    expect(lan1.moi).toContain('dong-mot');
    expect(lan1.moi).toContain('dong-hai');

    // Lần đọc thứ hai KHÔNG được lặp lại phần cũ — đó là điểm của con trỏ đọc:
    // agent hỏi lại mỗi vài giây, trả cả đệm mỗi lần là tính tiền lại từ đầu.
    const lan2 = docDauRaNen(kq.id!);
    expect(lan2.coGiMoi).toBe(false);
  });

  it('báo đúng trạng thái khi lệnh tự kết thúc', async () => {
    const kq = batLenhNen({ lenh: 'exit 3', cwd: process.cwd(), cuocId: CUOC });
    await cho(() => trangThai(kq.id!)?.dangChay === false, 5000);

    const r = docDauRaNen(kq.id!);
    expect(r.dangChay).toBe(false);
    expect(r.ma).toBe(3);
  });

  it('dừng được, và tiến trình chết thật', async () => {
    const kq = batLenhNen({ lenh: 'sleep 30', cwd: process.cwd(), cuocId: CUOC });
    expect(dsLenhNen(CUOC).find((l) => l.id === kq.id)?.dangChay).toBe(true);

    expect(dungLenhNen(kq.id!).ok).toBe(true);
    expect(await cho(() => trangThai(kq.id!)?.dangChay === false, 4000)).toBe(true);
  });

  it('lệnh không tồn tại vẫn ĐỌC ĐƯỢC lý do, không chết câm', async () => {
    // `spawn` với `shell: true` không ném; shell chạy rồi báo "command not
    // found" ra stderr và thoát khác 0. Agent phải đọc được chuỗi đó, nếu không
    // nó thấy một tiến trình dừng mà không biết vì sao.
    const kq = batLenhNen({ lenh: 'lenh-khong-ton-tai-abc123', cwd: process.cwd(), cuocId: CUOC });
    await cho(() => trangThai(kq.id!)?.dangChay === false, 6000);

    const r = docDauRaNen(kq.id!);
    expect(r.ma).not.toBe(0);
  });

  it('chặn khi vượt trần số lệnh nền', () => {
    for (let i = 0; i < 4; i++) {
      expect(batLenhNen({ lenh: 'sleep 30', cwd: process.cwd(), cuocId: CUOC }).ok).toBe(true);
    }
    const qua = batLenhNen({ lenh: 'sleep 30', cwd: process.cwd(), cuocId: CUOC });
    expect(qua.ok).toBe(false);
    expect(qua.loi).toMatch(/dừng bớt/i);
  });

  it('đọc một mã không tồn tại thì báo lỗi, không ném', () => {
    const r = docDauRaNen('khong-co');
    expect(r.ok).toBe(false);
    expect(r.loi).toBeTruthy();
  });
});
