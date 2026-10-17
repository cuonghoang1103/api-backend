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
export async function phatLai(ghi, t = Infinity) {
  const term = new Terminal({ cols: ghi.cols, rows: ghi.rows, scrollback: 5000, allowProposedApi: true });
  const viet = (b) => new Promise((ok) => term.write(b, ok));
  for (const e of ghi.su_kien) {
    if (e[1] > t) break;
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
