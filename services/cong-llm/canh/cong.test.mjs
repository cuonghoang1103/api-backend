/**
 * Cổng key con: ngưỡng nhường, và câu nói với người dùng.
 *
 * Cả hai đến từ một báo cáo thật 16/09/2026: key terminal của một tài khoản
 * MỚI, vừa cấp Pro, chưa dùng lần nào, bị chặn với câu
 * *"Cổng key con đang tạm đóng: key chính đã dùng 71% cửa sổ 5h — phần còn
 * lại nhườn…(click to expand)"*.
 *
 * Hai điều sai nằm ở đó:
 *   ① ngưỡng 70% giữ tới 30% cửa sổ cho web — quá rộng, và người trả tiền
 *     cho key terminal là người chịu;
 *   ② thứ người dùng cần biết nhất (bao lâu nữa, có mất gì không) nằm ở KHÚC
 *     BỊ CẮT. OpenCode cắt cụt câu dài, nên phần đuôi không ai đọc.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const goc = dirname(fileURLToPath(import.meta.url));
const ma = readFileSync(join(goc, 'canh.mjs'), 'utf8');

/** Dựng lại câu cho người dùng đúng như `canh.mjs` — giữ hai bản khớp nhau. */
function cauChoNguoiDung(ph) {
  const khiNao = ph == null ? 'chạy lại trong ít phút nữa'
    : ph <= 1 ? 'chạy lại trong khoảng một phút'
    : `chạy lại sau khoảng ${ph} phút`;
  return `Tạm dừng, ${khiNao}. Nó TỰ nối lại — bạn không phải làm gì và không mất lượt nào. `
    + 'Lý do: cổng dùng chung đang cao điểm nên key của bạn nhường tạm.';
}

test('① ngưỡng nhường đã nới, và hai ngưỡng vẫn có khoảng trễ', () => {
  const nhuong = Number(/NGUONG_NHUONG = Number\(env\.NGUONG_NHUONG \?\? ([\d.]+)\)/.exec(ma)[1]);
  const moLai = Number(/NGUONG_MO_LAI = Number\(env\.NGUONG_MO_LAI \?\? ([\d.]+)\)/.exec(ma)[1]);

  assert.ok(nhuong >= 0.8, `ngưỡng nhường ${nhuong} vẫn giữ quá nhiều đệm cho web`);
  assert.ok(nhuong < 1, 'nhường ở 100% thì chốt không còn tác dụng gì');
  /* Khoảng trễ là thứ chống cổng bật/tắt liên tục quanh mốc. */
  assert.ok(moLai < nhuong, 'ngưỡng mở lại phải NHỎ HƠN ngưỡng nhường');
  assert.ok(nhuong - moLai >= 0.05, `khoảng trễ ${(nhuong - moLai).toFixed(2)} quá hẹp — cổng sẽ rung`);
});

test('⭐ mặc định ở compose KHỚP mặc định trong mã', () => {
  /*
   * Compose LUÔN truyền `NGUONG_NHUONG` xuống, nên `env.X ?? 0.85` trong mã
   * không bao giờ được dùng tới. Đổi một chỗ mà quên chỗ kia thì triển khai
   * xong, mã mới đã lên, mà cổng vẫn chạy ngưỡng CŨ — và log vẫn báo số cũ,
   * nên nhìn log cũng không thấy gì sai. Đã dẫm phải 16/09/2026.
   */
  const compose = readFileSync(join(goc, '..', 'docker-compose.yml'), 'utf8');
  const cNhuong = /NGUONG_NHUONG: \$\{CONG_LLM_NGUONG_NHUONG:-([\d.]+)\}/.exec(compose)[1];
  const cMoLai = /NGUONG_MO_LAI: \$\{CONG_LLM_NGUONG_MO_LAI:-([\d.]+)\}/.exec(compose)[1];
  const mNhuong = /NGUONG_NHUONG = Number\(env\.NGUONG_NHUONG \?\? ([\d.]+)\)/.exec(ma)[1];
  const mMoLai = /NGUONG_MO_LAI = Number\(env\.NGUONG_MO_LAI \?\? ([\d.]+)\)/.exec(ma)[1];

  assert.equal(cNhuong, mNhuong, `compose ${cNhuong} ≠ mã ${mNhuong} — compose thắng, mã vô nghĩa`);
  assert.equal(cMoLai, mMoLai, `compose ${cMoLai} ≠ mã ${mMoLai}`);
});

test('② câu cho người dùng dựng LÚC TRẢ LỜI, không dùng lý do đã cất sẵn', () => {
  /* `s.lyDo` chỉ được làm mới mỗi chu kỳ, nên nó có thể lệch tới một phút. */
  assert.match(ma, /return loiAnthropic\(res, 429, 'rate_limit_error', cauChoNguoiDung\(\)\)/);
  assert.match(ma, /function cauChoNguoiDung\(\)/);
});

test('② tin quan trọng nhất SỐNG SÓT khi OpenCode cắt cụt', () => {
  for (const ph of [null, 0, 1, 7, 42]) {
    const dau = cauChoNguoiDung(ph).slice(0, 55);
    assert.match(dau, /Tạm dừng/, `mất chữ "tạm dừng" trong 55 ký tự đầu: ${dau}`);
    assert.match(dau, /chạy lại/, `mất chữ "chạy lại" trong 55 ký tự đầu: ${dau}`);
  }
});

test('② nói rõ nó TỰ nối lại và KHÔNG mất lượt', () => {
  const c = cauChoNguoiDung(7);
  assert.match(c, /TỰ nối lại/);
  assert.match(c, /không mất lượt nào/);
  /* ⛔ Không được đọc thành "7 phút nữa nó sẽ dừng" — ngược hẳn nghĩa. */
  assert.ok(!/Tạm nghỉ sau/.test(c), 'câu đọc ngược nghĩa');
});

test('② câu trong mã khớp bản dựng lại ở phép kiểm này', () => {
  /* Hai bản lệch nhau thì phép kiểm còn xanh mà sản phẩm đã đổi. */
  for (const manh of ['Tạm dừng, ', 'Nó TỰ nối lại', 'không mất lượt nào', 'chạy lại sau khoảng ']) {
    assert.ok(ma.includes(manh), `canh.mjs không còn chứa "${manh}"`);
  }
});
