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

const deepEqual = (a: unknown, b: unknown, msg?: string): void => { expect(a, msg).toEqual(b); };
const eq = (a: unknown, b: unknown, msg?: string): void => { expect(a, msg).toBe(b); };

describe('phanLoaiLenh — lệnh thường (được nhớ để tự chạy)', () => {
  it.each([
    'npm test',
    'npm run build',
    /* `npx` ĐÃ RỜI danh sách này (09/09/2026) — cố ý, không phải hồi quy.
       `npx <gói chưa cài>` TẢI VÀ CHẠY mã từ Internet, đúng tiêu chí "không có
       đường lùi" mà chính `lenh.ts` đặt ra cho danh sách nguy hiểm; mà từ
       chuỗi lệnh thì không phân biệt được nó gọi binary trong dự án hay tải
       gói lạ. Nay là 'cankiem' + `choNho: true`: hỏi MỘT lần cho mỗi chuỗi
       lệnh nguyên văn, rồi nhớ. Xem phép kiểm "LƯỠNG DỤNG" ở cuối tệp. */
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

/*
 * ============================================================
 * BA BỘ ĐỐI CHỨNG cho `phanLoaiLenh`
 * ============================================================
 *
 * Bảng mẫu này từng CHỈ có POSIX, và cái giá đo được ngày 09/09/2026: 15/15
 * lệnh phá hoại của Windows (`del /f /s /q`, `rd /s /q`, `Remove-Item
 * -Recurse -Force`, `format`, `reg delete`, `runas`, `takeown`…) xếp
 * **'thường'** ⇒ ở chế độ `tuSuaVaLenh` chúng TỰ CHẠY, không hỏi, và còn được
 * ghi nhớ. Cùng những lệnh đó trên macOS bị chặn đúng. Người dùng Windows
 * chạy một chế độ khác hẳn thứ giao diện nói, và không có gì báo.
 *
 * Ba bộ, vì một bộ không đủ:
 *   1. Phải CHẶN — thiếu là lỗ hổng.
 *   2. Phải CHO QUA — thừa là người dùng bấm bừa rồi bật "Bỏ qua tất cả",
 *      và cảnh báo sai chỗ ăn mòn đúng cái chốt nó định bảo vệ.
 *   3. Cửa sau qua TRÌNH THÔNG DỊCH — `bash -c "rm -rf x"` từng lọt vì ký tự
 *      trước `rm` là dấu `"`, không nằm trong lớp ranh giới `[\s;&|]`.
 */
const PHAI_CHAN_WINDOWS = [
  'del /f /s /q C:\\du-an\\*', 'rd /s /q build', 'Remove-Item -Recurse -Force .\\src',
  'format D: /q', 'powershell -c "Get-Content .\\config.json"',
  'Invoke-WebRequest -Uri http://la.example/x.ps1 -OutFile x.ps1',
  'iwr http://la.example/a.exe -o a.exe', 'taskkill /f /im node.exe',
  'reg delete HKLM\\Software\\Foo /f', 'runas /user:Administrator cmd',
  'winget install Foo', 'choco install bar -y', 'net stop W32Time',
  'icacls C:\\du-an /grant Everyone:F', 'takeown /f C:\\du-an /r',
];

const PHAI_CHAN_THONG_DICH = [
  'bash -c "rm -rf build"', 'sh -c "rm -rf build"', 'zsh -c "rm -rf build"',
  'eval "rm -rf build"', 'node -e "require(\'fs\').rmSync(\'src\',{recursive:true})"',
  'perl -e "unlink glob \'*\'"', 'ruby -e "File.delete(*Dir[\'*\'])"',
  'python3 -c "import shutil; shutil.rmtree(\'src\')"',
  'xargs rm', 'find . -delete', 'truncate -s 0 src/a.ts', 'git branch -D main',
];

const PHAI_CHO_QUA = [
  'npm test', 'npm run build', 'npm run dev', 'git status', 'git diff',
  'git log --oneline -5', 'git add .', 'ls -la', 'cat package.json', 'pwd',
  'node --version', 'pytest', 'go test ./...', 'cargo build', 'tsc --noEmit',
  'echo hello', 'grep -rn foo src', 'wc -l src/a.ts', 'head -20 a.ts',
];

describe('ba bộ đối chứng cho phanLoaiLenh', () => {
it('WINDOWS: 15 lệnh phá hoại đều bị chặn (từng lọt HẾT)', () => {
  const lot = PHAI_CHAN_WINDOWS.filter((l) => phanLoaiLenh(l).muc === 'thuong');
  deepEqual(lot, [], `lọt qua thành 'thường' ⇒ tự chạy không hỏi: ${lot.join(' | ')}`);
});

it('TRÌNH THÔNG DỊCH: không lách được bằng dấu nháy', () => {
  const lot = PHAI_CHAN_THONG_DICH.filter((l) => phanLoaiLenh(l).muc === 'thuong');
  deepEqual(lot, [], `lọt qua thành 'thường': ${lot.join(' | ')}`);
});

it('KHÔNG báo oan: lệnh hàng ngày vẫn tự chạy được', () => {
  const oan = PHAI_CHO_QUA.filter((l) => phanLoaiLenh(l).muc !== 'thuong')
    .map((l) => `${l} → ${phanLoaiLenh(l).muc}`);
  deepEqual(oan, [], `báo oan ⇒ người dùng bấm bừa: ${oan.join(' | ')}`);
});

it('LỚP RANH GIỚI: nháy/ngoặc/backtick không che được lệnh nguy hiểm', () => {
  /* Lớp ranh giới cũ là `[\s;&|]` — chỉ khoảng trắng và ba ký tự nối. Nên
     `(rm -rf build)` xếp 'thường' và TỰ CHẠY: ký tự trước `rm` là `(`, mà `(`
     cũng không nằm trong `META` nên không có cả đường lùi 'cankiem'.
     Bốn ca dưới đây ĐỎ nếu ai thu lớp ranh giới lại. */
  for (const l of ['(rm -rf build)', '(sudo make install)',
                   'test -d build && (rm -rf build)', 'VAR=x rm -rf build']) {
    eq(phanLoaiLenh(l).muc, 'nguyhiem', l);
  }
});

it('LƯỠNG DỤNG: npx vẫn hỏi, nhưng nhớ được nguyên văn', () => {
  const p = phanLoaiLenh('npx tsc --noEmit');
  eq(p.muc, 'cankiem');
  eq(p.choNho, true);   // nhớ theo NGUYÊN VĂN, không mở đường cho `npx goi-la`
  eq(phanLoaiLenh('npx mot-goi-la').muc, 'cankiem');
});
});
