/**
 * FER202 · Exercise 1 — Cài Node.js & npm: thứ tự các bước + đọc kết quả lệnh kiểm tra. (Bài lý thuyết ⇒ order/table/choice.)
 */
import { doiDau, KHOA, lc, tinh } from './_chung.mjs';

const o = (ma, de, muc, dapAn, giaiThich) => ({ ma, de, muc: lc(...muc), dapAn, giaiThich });
const q = (ma, de, luaChon, dapAn, giaiThich) => ({ ma, de, luaChon: lc(...luaChon), dapAn, giaiThich });

export default doiDau({
  slug: 'fer202-1-ex1-nodejs',
  ten: 'Exercise 1 — Install Node.js',
  khoa: KHOA,
  baiHoc: 'fer202-1-ex1-nodejs',
  de: [
    tinh({
      loai: 'order',
      tieuDe: 'Install Node.js LTS and verify it',
      doKho: 'EASY', phut: 5,
      khaiNiem: ['LTS', 'installer', 'PATH', 'verification'], the: ['node', 'order', 'exercise-1'],
      moTa: {
        en: '<p>Exercise 1 asks you to install Node.js and npm, then prove they work. Put the steps in order. (On macOS/Linux you may use a version manager such as <code>nvm</code>, but the order of ideas is the same.)</p>',
        vi: '<p>Exercise 1 yêu cầu cài Node.js và npm rồi chứng minh chúng chạy. Hãy xếp các bước. (Trên macOS/Linux có thể dùng trình quản lý phiên bản như <code>nvm</code>, nhưng thứ tự ý tưởng vẫn vậy.)</p>',
      },
      goiY: ['Chọn bản LTS cho môn học: ổn định, được hỗ trợ lâu.', 'Terminal cũ không thấy PATH mới ⇒ mở terminal mới rồi mới kiểm.'],
      loiHayGap: ['Kiểm trong terminal mở TRƯỚC khi cài ⇒ báo "node is not recognized".', 'Cài bản Current lẻ thay vì LTS ⇒ một số công cụ chưa hỗ trợ.'],
      giaiThich: '<p>Tải LTS → chạy trình cài (giữ tuỳ chọn thêm vào PATH) → mở terminal MỚI → node -v → npm -v.</p>',
      thuatNgu: [{ en: 'LTS', vi: 'Long-Term Support — bản hỗ trợ dài hạn' }, { en: 'PATH', vi: 'danh sách thư mục hệ thống tìm lệnh' }],
      cauHoi: [
        o('i1', 'Order the steps', [
          ['c', 'Open a NEW terminal window'],
          ['a', 'Download the LTS installer from nodejs.org'],
          ['e', 'Run <code>npm -v</code> and see a version number'],
          ['b', 'Run the installer, keeping "Add to PATH" checked'],
          ['d', 'Run <code>node -v</code> and see a version such as v22.x'],
        ], ['a', 'b', 'c', 'd', 'e'], 'Download → install → new terminal → node -v → npm -v.|||Tải → cài → terminal mới → node -v → npm -v.'),
      ],
    }),
    tinh({
      tieuDe: 'Read the terminal',
      doKho: 'EASY', phut: 6,
      khaiNiem: ['node -v', 'npm -v', 'command not found'], the: ['node', 'quiz', 'exercise-1'],
      moTa: {
        en: '<p>Five terminal outputs you will meet on day one. Pick what each one means and what to do next. Reading error messages calmly is half of programming.</p>',
        vi: '<p>Năm kết quả terminal bạn gặp ngay ngày đầu. Chọn ý nghĩa và việc nên làm tiếp. Bình tĩnh đọc thông báo lỗi là một nửa của lập trình.</p>',
      },
      goiY: ['"not recognized"/"command not found" ⇒ hệ thống không tìm thấy chương trình trong PATH.', 'Số phiên bản in ra ⇒ đã cài thành công.'],
      loiHayGap: ['Cài lại liên tục thay vì mở terminal mới.', 'Bỏ qua thông báo và chép lệnh tiếp.'],
      giaiThich: '<p>Mỗi thông báo cho biết đúng một điều; đọc dòng đầu và tên lệnh trong đó trước.</p>',
      thuatNgu: [{ en: 'terminal', vi: 'cửa sổ gõ lệnh' }],
      cauHoi: [
        q('t1', '<code>node -v</code> prints <code>v22.11.0</code>', [['a', 'Node is installed; this is its version'], ['b', 'Node failed'], ['c', 'npm is missing'], ['d', 'You must reinstall']], ['a'], 'v22 is an LTS line.|||v22 là dòng LTS.'),
        q('t2', '<code>\'node\' is not recognized as an internal or external command</code> (Windows)', [['a', 'Node is broken forever'], ['b', 'The terminal cannot find node: open a new terminal; if still failing, add Node to PATH or reinstall'], ['c', 'You typed JavaScript wrong'], ['d', 'npm is too old']], ['b'], 'Usually just an old terminal session.|||Thường chỉ là phiên terminal cũ.'),
        q('t3', '<code>npm -v</code> prints <code>10.9.0</code>', [['a', 'npm comes with Node and works'], ['b', 'You must install npm separately'], ['c', 'This is the Node version'], ['d', 'Error']], ['a'], 'npm is bundled with the Node installer.|||npm đi kèm bộ cài Node.'),
        q('t4', '<code>zsh: command not found: npx</code> on macOS right after installing', [['a', 'npx does not exist'], ['b', 'Restart the terminal (or reload the shell profile) so PATH is refreshed'], ['c', 'Buy a license'], ['d', 'Use Windows']], ['b'], 'Same idea as on Windows.|||Cùng ý như trên Windows.'),
        q('t5', 'Which version line should you install for FER202?', [['a', 'The newest "Current" odd release'], ['b', 'An even-numbered LTS release'], ['c', 'Any version from 2015'], ['d', 'It does not matter']], ['b'], 'Even majors become LTS (18, 20, 22…).|||Major chẵn trở thành LTS (18, 20, 22…).'),
      ],
    }),
  ],
});
