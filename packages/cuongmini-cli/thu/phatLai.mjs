// Dựng lại màn hình terminal từ bản ghi của pty_chay.py bằng xterm headless (đúng bộ giải mã của
// VS Code/xterm.js, có reflow khi đổi cỡ như iTerm2) — để ĐẾM những gì người dùng thật nhìn thấy.
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { Terminal } = require('@xterm/headless');

/**
 * Phát lại tới mốc `t` giây (mặc định: hết bản ghi).
 * Trả về: `manHinh` = các dòng ĐANG HIỆN (buffer đang dùng), `tatCa` = cả lịch sử cuộn + màn hình
 * của buffer thường, `manPhu` = đang ở alternate screen.
 */
/**
 * Đợt 6: mốc `t` theo LỊCH của kịch bản ⇒ giây THẬT (pty_chay.py chờ chữ trước phím khi máy chậm và ghi `["k", lịch, thật]`).
 * Lấy độ trễ của phím cuối cùng có lịch ≤ t. Không có bản ghi `k` (kịch bản cũ) ⇒ giữ nguyên.
 */
export function moc(ghi, t) {
  if (t === Infinity) return t;
  const phim = ghi.su_kien.filter((e) => e[0] === 'k');
  /* Neo theo phím KẾ TIẾP (giữ đúng khoảng "trước phím đó bao lâu"): phím đó đã chờ chữ cần thấy ⇒ màn hình lúc này đã
     vẽ xong bước trước. Sau phím cuối ⇒ cộng độ trễ cuối. */
  const sau = phim.find((e) => e[1] >= t);
  if (sau) return sau[2] - (sau[1] - t);
  let lech = 0;
  for (const e of phim) lech = Math.max(lech, e[2] - e[1]);
  return t + lech;
}

export async function phatLai(ghi, t = Infinity) {
  const term = new Terminal({ cols: ghi.cols, rows: ghi.rows, scrollback: 5000, allowProposedApi: true });
  const viet = (b) => new Promise((ok) => term.write(b, ok));
  const den = moc(ghi, t);
  for (const e of ghi.su_kien) {
    if (e[0] === 'k') continue;
    if (e[1] > den) break;
    if (e[0] === 'r') term.resize(e[2], e[3]);
    else await viet(Buffer.from(e[2], 'base64'));
  }
  const dongCua = (buf, tu, den) => {
    const ra = [];
    for (let i = tu; i < den; i += 1) ra.push(buf.getLine(i)?.translateToString(true) ?? '');
    return ra;
  };
  const dang = term.buffer.active;
  const thuong = term.buffer.normal;
  const kq = {
    manPhu: dang.type === 'alternate',
    manHinh: dongCua(dang, dang.viewportY, dang.viewportY + term.rows),
    tatCa: dongCua(thuong, 0, thuong.length),
    cot: term.cols,
    hang: term.rows,
  };
  term.dispose();
  return kq;
}

/** Số dòng chứa chuỗi (đếm mỗi dòng một lần). */
export const demDong = (dong, chu) => dong.filter((d) => chu.some((c) => d.includes(c))).length;
