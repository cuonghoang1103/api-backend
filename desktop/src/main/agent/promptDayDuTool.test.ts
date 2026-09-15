/**
 * Prompt phải KỂ TÊN những tool tồn tại nhưng không ai gọi.
 *
 * Rà 15/09/2026: `chay_lenh_nen`, `doc_dau_ra_nen`, `dung_lenh_nen`,
 * `sua_nhieu_cho` đều đã cắm xong — máy chủ mô tả, app chạy được, có thẻ duyệt —
 * mà `prompt.ts` nhắc tới chúng ĐÚNG 0 LẦN. Model đọc prompt để biết mình làm
 * việc thế nào; thứ chỉ nằm trong danh sách mô tả tool thì nó dùng khi tình cờ
 * nhìn thấy, không phải khi cần. Hệ quả đo được:
 *
 *   • `npm run dev` gọi bằng `run_command` ⇒ treo tới hết giờ ⇒ trả "LỆNH BỊ
 *     DỪNG" ⇒ model tưởng mã hỏng và đi sửa mã đang đúng.
 *   • Đổi tên một biến ở 20 chỗ ⇒ 20 lần `edit_file` ⇒ 20 lượt qua cổng, mỗi
 *     lượt chở lại TOÀN BỘ hội thoại, 20 thẻ duyệt cho người dùng bấm.
 *
 * Phép kiểm này neo vào TÊN TOOL chứ không vào câu chữ, nên nó sống qua mọi
 * lần viết lại prompt và chỉ đỏ khi tên tool thật sự biến mất khỏi prompt.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

const goc = join(import.meta.dirname, '../../..');
const prompt = readFileSync(join(goc, '../src/services/agent/prompt.ts'), 'utf8');
const toolMC = readFileSync(join(goc, '../src/services/agent/tools.ts'), 'utf8');
const toolApp = readFileSync(join(goc, 'src/main/agent/tools.ts'), 'utf8');
const turn = readFileSync(join(goc, '../src/services/agent/turn.ts'), 'utf8');

describe('prompt kể tên đủ tool đã cắm', () => {
  it('nhắc cả ba tool lệnh nền', () => {
    for (const ten of ['chay_lenh_nen', 'doc_dau_ra_nen', 'dung_lenh_nen']) {
      expect(prompt, `prompt không nhắc \`${ten}\` — tool tồn tại mà không ai gọi`)
        .toContain(ten);
    }
  });

  it('nói rõ lệnh không tự dừng thì ĐỪNG dùng run_command', () => {
    expect(prompt).toMatch(/KHÔNG BAO GIỜ TỰ KẾT THÚC/);
  });

  it('nhắc sua_nhieu_cho cho trường hợp nhiều chỗ trong cùng một file', () => {
    expect(prompt).toContain('sua_nhieu_cho');
  });

  it('nhắc git_commit / tao_pr thay vì để model commit bằng shell', () => {
    for (const ten of ['git_commit', 'tao_pr']) {
      expect(prompt, `prompt không nhắc \`${ten}\` — model sẽ commit bằng run_command, `
        + 'đi vòng qua chốt chặn nhánh chung và bộ lọc file bí mật')
        .toContain(ten);
    }
    expect(prompt).toMatch(/ĐỪNG commit khi người dùng chưa bảo/);
  });

  it('gọi đúng tên tool kế hoạch (`cap_nhat_ke_hoach`, không phải `ke_hoach`)', () => {
    expect(toolMC).toContain("name: 'cap_nhat_ke_hoach'");
    expect(prompt).toContain('cap_nhat_ke_hoach');
    expect(prompt, 'prompt còn gọi tên cũ `ke_hoach` — model gọi tên đó sẽ ăn lỗi')
      .not.toMatch(/`ke_hoach`/);
  });
});

describe('trần agent phụ nói đúng con số của lượt này', () => {
  it('mô tả tool KHÔNG chốt cứng một con số', () => {
    const i = toolMC.indexOf("name: 'giao_viec_phu'");
    expect(i).toBeGreaterThan(-1);
    expect(toolMC.slice(i, i + 1600), 'mô tả tool là chuỗi TĨNH dùng chung cho mọi mức — '
      + 'chốt cứng "Tối đa 3" là nói dối ở mức Thấp (1) và Ultracode (10)')
      .not.toMatch(/Tối đa 3 việc phụ/);
  });

  it('prompt nhận trần THẬT từ turn.ts thay vì gõ lại số', () => {
    expect(turn).toMatch(/tranViecPhu: TRAN_VIEC_PHU\[mucNoLuc\]/);
    expect(turn).toMatch(/tranBuoc: MAX_AGENT_STEPS/);
    expect(prompt).toMatch(/TRẦN AGENT PHỤ/);
    expect(prompt).toMatch(/opts\.tranViecPhu/);
  });

  it('bảng trần ở app khớp bảng trần ở máy chủ', () => {
    const loop = readFileSync(join(goc, 'src/main/agent/loop.ts'), 'utf8');
    for (const [muc, so] of [['thap', 1], ['vua', 3], ['cao', 3], ['ratCao', 5], ['toiDa', 6], ['ultracode', 10]] as const) {
      expect(loop, `app thiếu trần việc phụ cho mức ${muc}`)
        .toMatch(new RegExp(`${muc}:\\s*${so}\\b`));
      expect(turn, `máy chủ thiếu trần việc phụ cho mức ${muc}`)
        .toMatch(new RegExp(`${muc}:\\s*${so}\\b`));
    }
  });
});

describe('sua_nhieu_cho chẩn đoán khoảng trắng như edit_file', () => {
  it('gọi timGanDung khi một phép không khớp', () => {
    const i = toolApp.indexOf('async function toolSuaNhieuCho');
    expect(i).toBeGreaterThan(-1);
    const than = toolApp.slice(i, i + 4000);
    expect(than, 'một phép trượt là huỷ CẢ LÔ — không nói chỗ lệch thì model gửi lại y hệt')
      .toContain('timGanDung');
    expect(than).toContain('hienKhoangTrang');
  });

  it('không xui model đi dò từng byte bằng xxd', () => {
    const i = toolApp.indexOf('async function toolSuaNhieuCho');
    expect(toolApp.slice(i, i + 4000)).toMatch(/ĐỪNG dùng xxd/);
  });
});
