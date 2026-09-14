/**
 * Khoá ba nguyên nhân làm AI Code "chạy mãi, ấn Dừng không được, app đơ".
 * Người dùng báo trên Windows 14/09/2026.
 *
 * Cả ba đều KHÔNG làm vỡ build, không đỏ phép kiểm nào, và hỏng theo kiểu im
 * lặng nhất: agent đứng yên ở một bước, không lỗi, không hết giờ.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const doc = (p: string) => readFileSync(new URL(p, import.meta.url), 'utf8');
const lenhNen = doc('./lenhNen.ts');
const ipcAgent = doc('../ipc/agent.ts');

describe('lệnh nền không được treo vĩnh viễn', () => {
  it('stdin ĐÓNG HẲN — lệnh chờ nhập phải nhận EOF, không ngồi chờ mãi', () => {
    // Không khai `stdio` thì Node mở stdin thành ống RỖNG NHƯNG MỞ. `npm` hỏi
    // "Ok to proceed? (y)", `winget` hỏi giấy phép, `git` hỏi mật khẩu — tất
    // cả sẽ chờ một câu trả lời không bao giờ tới. Windows hỏi nhiều nhất.
    expect(lenhNen, 'spawn không đóng stdin ⇒ lệnh hỏi-đáp treo vĩnh viễn')
      .toMatch(/stdio:\s*\['ignore',\s*'pipe',\s*'pipe'\]/);
  });

  it('có HẠN GIỜ, và hạn giờ được xoá khi lệnh xong', () => {
    expect(lenhNen, 'không có hạn giờ ⇒ lệnh treo chiếm một suất MAX_NEN mãi mãi')
      .toMatch(/TRAN_GIO_MS/);
    // Quên xoá thì 20 phút sau nó giết nhầm một lệnh khác đã tái dùng id.
    expect(lenhNen, 'không xoá hẹn giờ khi lệnh kết thúc ⇒ có thể giết nhầm lệnh sau')
      .toMatch(/clearTimeout\(muc\.dongHo\)/);
  });

  it('nút Dừng dừng CẢ lệnh nền, không chỉ huỷ luồng LLM', () => {
    const khoi = ipcAgent.slice(
      ipcAgent.indexOf("handle('agent:cancel'"),
      ipcAgent.indexOf("handle('agent:reset'"),
    );
    expect(khoi, 'agent:cancel không gọi dungLenhNenCua ⇒ bấm Dừng mà tiến trình vẫn chạy')
      .toMatch(/dungLenhNenCua\(/);
    expect(khoi).toMatch(/huyLuotCua\(/);
  });

  it('Windows được giết theo CÂY tiến trình, không chỉ tiến trình cha', () => {
    // `npm test` đẻ ra node → vitest → worker. Giết mỗi `npm` thì cây con vẫn
    // sống, và người vừa bấm Dừng tưởng đã dừng.
    expect(lenhNen).toMatch(/taskkill.*\/T.*\/F|'\/T',\s*'\/F'/s);
    expect(lenhNen).toMatch(/process\.kill\(-pid/);
  });
});
