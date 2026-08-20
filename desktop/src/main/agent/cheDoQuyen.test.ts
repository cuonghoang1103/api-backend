/**
 * Kiểm CHỐT TỰ DUYỆT — chỗ nguy hiểm nhất của cả app.
 *
 * Sai ở đây không báo lỗi, không đỏ màn hình: nó chỉ khiến agent chạy một lệnh
 * mà người dùng chưa từng nhìn thấy. Nên hai câu hỏi phải có bài kiểm riêng:
 *   1. Chế độ nào cho tự duyệt cái gì.
 *   2. `hoiNguoiDung` có TÔN TRỌNG cờ đó không, và có DỪNG lại khi cờ tắt không.
 */
import { describe, it, expect, vi } from 'vitest';

vi.mock('electron', () => ({ app: { getPath: () => '/tmp' }, BrowserWindow: {} }));

const { tuDuyetSua, tuDuyetLenh } = await import('./loop');
const { hoiNguoiDung, taoSoNho, traLoi } = await import('./xinPhep');

describe('chế độ nào tự duyệt cái gì', () => {
  it('sửa file: chỉ hai chế độ tự nhận', () => {
    expect(tuDuyetSua('keHoach')).toBe(false);
    expect(tuDuyetSua('hoi')).toBe(false);
    expect(tuDuyetSua('tuSua')).toBe(true);
    expect(tuDuyetSua('tuSuaVaLenh')).toBe(true);
  });

  it('lệnh: CHỈ `tuSuaVaLenh`, và CHỈ mức thường', () => {
    for (const c of ['keHoach', 'hoi', 'tuSua'] as const) {
      for (const m of ['thuong', 'cankiem', 'nguyhiem'] as const) {
        expect(tuDuyetLenh(c, m)).toBe(false);
      }
    }
    expect(tuDuyetLenh('tuSuaVaLenh', 'thuong')).toBe(true);
  });

  it('⛔ KHÔNG chế độ nào tự duyệt được lệnh cần kiểm / nguy hiểm', () => {
    expect(tuDuyetLenh('tuSuaVaLenh', 'cankiem')).toBe(false);
    expect(tuDuyetLenh('tuSuaVaLenh', 'nguyhiem')).toBe(false);
  });
});

describe('hoiNguoiDung tôn trọng cờ tự duyệt', () => {
  const dieuKhien = new AbortController();

  it('cờ BẬT ⇒ cho phép NGAY, và KHÔNG đẩy thẻ nào lên màn hình', async () => {
    const the: unknown[] = [];
    const q = await hoiNguoiDung(
      { ten: 'edit_file', duongDan: 'a.ts', tuDuyet: true },
      (y) => the.push(y),
      dieuKhien.signal,
      taoSoNho(),
    );
    expect(q).toBe('choPhep');
    expect(the).toHaveLength(0);
  });

  it('cờ TẮT ⇒ DỪNG chờ người dùng, có đẩy thẻ lên', async () => {
    const soNho = taoSoNho();
    let idThe = '';
    const chờ = hoiNguoiDung(
      { ten: 'run_command', duongDan: 'rm -rf /', tuDuyet: false },
      (y) => { idThe = y.id; },
      dieuKhien.signal,
      soNho,
    );
    // Cho vòng lặp sự kiện chạy một nhịp — nếu nó tự trả lời thì lộ ra ở đây.
    await new Promise((r) => { setTimeout(r, 20); });
    expect(idThe).not.toBe('');

    let daXong = false;
    void chờ.then(() => { daXong = true; });
    await new Promise((r) => { setTimeout(r, 20); });
    expect(daXong).toBe(false);          // vẫn đang chờ, đúng như mong đợi

    traLoi(idThe, 'tuChoi');
    expect(await chờ).toBe('tuChoi');
  });

  it('tự duyệt KHÔNG ghi vào sổ nhớ — hạ chế độ xuống là hỏi lại', async () => {
    const soNho = taoSoNho();
    await hoiNguoiDung(
      { ten: 'edit_file', duongDan: 'b.ts', tuDuyet: true }, () => {}, dieuKhien.signal, soNho,
    );
    // Sổ vẫn rỗng ⇒ lần sau với `tuDuyet: false` sẽ phải hỏi thật.
    expect(soNho.size).toBe(0);
  });
});
