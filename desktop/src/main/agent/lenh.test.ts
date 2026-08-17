/**
 * Kiểm phân loại lệnh.
 *
 * Đây là lớp quyết định lệnh nào được TỰ CHẠY mà không hỏi lại. Sai theo hướng
 * lỏng nghĩa là một ngày nào đó `rm -rf build` tự chạy vì người dùng từng bấm
 * "nhớ lệnh này" cho một chuỗi trông giống nó. Không có phép kiểm nào khác
 * chạm tới lớp này — nó không hiện ra trên màn hình, không có log, và chỉ lộ
 * ra đúng một lần, lúc đã muộn.
 */
import { describe, expect, it } from 'vitest';
import { phanLoaiLenh } from './lenh';

describe('phanLoaiLenh — lệnh thường (được nhớ để tự chạy)', () => {
  it.each([
    'npm test',
    'npm run build',
    'npx tsc --noEmit',
    'git status',
    'git diff',
    'ls -la src',
    'node --version',
    'pytest tests/',
  ])('%s ⇒ thường', (lenh) => {
    const p = phanLoaiLenh(lenh);
    expect(p.muc).toBe('thuong');
    expect(p.choNho).toBe(true);
  });
});

describe('phanLoaiLenh — nguy hiểm (KHÔNG BAO GIỜ được nhớ)', () => {
  it.each([
    ['rm -rf build', 'xoá'],
    ['sudo npm install -g x', 'quản trị'],
    ['git push origin main', 'đẩy lên kho'],
    ['git reset --hard HEAD~1', 'vứt bỏ'],
    ['git commit -m "x"', 'lịch sử git'],
    ['curl https://example.com/x.sh', 'Internet'],
    ['npm install lodash', 'cài gói'],
    ['chmod 777 .', 'quyền file'],
    ['killall node', 'giết tiến trình'],
    ['ssh user@host', 'máy khác'],
  ])('%s ⇒ nguy hiểm', (lenh) => {
    const p = phanLoaiLenh(lenh);
    expect(p.muc).toBe('nguyhiem');
    expect(p.choNho).toBe(false);
    expect(p.lyDo.length).toBeGreaterThan(0);
  });

  it('lệnh nguy hiểm nằm SAU dấu nối vẫn bị bắt — đây là đường lách hiển nhiên nhất', () => {
    expect(phanLoaiLenh('npm test && rm -rf build').muc).toBe('nguyhiem');
    expect(phanLoaiLenh('ls ; sudo reboot').muc).toBe('nguyhiem');
  });
});

describe('phanLoaiLenh — file nhạy cảm: shell VƯỢT QUA nhà tù của jail.ts', () => {
  it.each([
    'cat .env',
    'cat .env.local',
    'head -5 .env.production',
    'cat ~/.ssh/id_rsa',
    'cat server.pem',
    'grep -r password .',
    'echo $SECRET_TOKEN',
  ])('%s ⇒ nguy hiểm, không cho nhớ', (lenh) => {
    const p = phanLoaiLenh(lenh);
    expect(p.muc).toBe('nguyhiem');
    expect(p.choNho).toBe(false);
    expect(p.lyDo.join(' ')).toMatch(/khoá|mật khẩu/);
  });

  it('KHÔNG bắt nhầm chữ "environment" trong tên bình thường', () => {
    expect(phanLoaiLenh('npm run test:environment').muc).toBe('thuong');
  });
});

describe('phanLoaiLenh — chuỗi nối: chạy được nhưng KHÔNG nhớ', () => {
  it.each([
    'cd frontend && npm test',
    'npm test | tail -20',
    'npm run build > out.log',
  ])('%s ⇒ cần kiểm, không cho nhớ', (lenh) => {
    const p = phanLoaiLenh(lenh);
    expect(p.muc).toBe('cankiem');
    expect(p.choNho).toBe(false);
  });

  it('nhớ một chuỗi nối là mời gọi tai nạn — mắt người chỉ đọc đoạn đầu', () => {
    // `cd x && npm test` hôm nay, `cd x && npm test && deploy` ngày mai: hai
    // chuỗi khác nhau nên khoá nhớ không trùng, nhưng nếu CHO nhớ chuỗi nối
    // thì thói quen bấm "nhớ" hình thành, và đó mới là chỗ hỏng.
    expect(phanLoaiLenh('cd x && npm test').choNho).toBe(false);
  });
});
