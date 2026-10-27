/**
 * FER202 · Exercise 3 — Git & GitHub: cấu hình, khởi tạo, commit, đẩy lên GitHub; .gitignore; đọc lỗi thường gặp.
 */
import { doiDau, KHOA, lc, tinh } from './_chung.mjs';

const o = (ma, de, muc, dapAn, giaiThich) => ({ ma, de, muc: lc(...muc), dapAn, giaiThich });
const q = (ma, de, luaChon, dapAn, giaiThich) => ({ ma, de, luaChon: lc(...luaChon), dapAn, giaiThich });
const v = (...ds) => ds;

export default doiDau({
  slug: 'fer202-1-ex3-git',
  ten: 'Exercise 3 — Git & GitHub',
  khoa: KHOA,
  baiHoc: 'fer202-1-ex3-git',
  de: [
    tinh({
      loai: 'order',
      tieuDe: 'First push of a lab project to GitHub',
      doKho: 'EASY', phut: 6,
      khaiNiem: ['git config', 'git init', 'remote', 'push -u'], the: ['git', 'order', 'exercise-3'],
      moTa: {
        en: '<p>You have a React project folder and an empty GitHub repository. Order the commands for the very first submission (identity is not configured on this computer yet).</p>',
        vi: '<p>Bạn có thư mục dự án React và một repo GitHub trống. Xếp các lệnh cho lần nộp đầu tiên (máy này chưa cấu hình danh tính).</p>',
      },
      goiY: ['Danh tính phải có trước commit đầu tiên.', 'remote add trước push; -u nhớ nhánh mặc định cho lần sau.'],
      loiHayGap: ['Commit mà chưa cấu hình ⇒ "Please tell me who you are".', 'Đẩy cả node_modules vì quên .gitignore.'],
      giaiThich: '<p>config → init → add → commit → branch -M main → remote add → push -u.</p>',
      thuatNgu: [{ en: 'remote', vi: 'repo ở xa (GitHub) mà repo máy bạn liên kết tới' }],
      cauHoi: [
        o('p1', 'Order the commands', [
          ['f', '<code>git remote add origin https://github.com/you/fer202-lab1.git</code>'],
          ['b', '<code>git init</code>'],
          ['d', '<code>git commit -m "Lab 1: first version"</code>'],
          ['a', '<code>git config --global user.name "Your Name"</code> and <code>user.email</code>'],
          ['g', '<code>git push -u origin main</code>'],
          ['c', '<code>git add .</code>'],
          ['e', '<code>git branch -M main</code>'],
        ], ['a', 'b', 'c', 'd', 'e', 'f', 'g'], 'Identity → repo → stage → commit → name the branch → link GitHub → push.|||Danh tính → repo → chọn → commit → đặt tên nhánh → nối GitHub → đẩy.'),
      ],
    }),
    tinh({
      loai: 'table',
      tieuDe: 'Git command for each need',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['status', 'log', 'clone', 'pull', 'branch'], the: ['git', 'table', 'exercise-3'],
      moTa: {
        en: '<p>Write the Git command for each situation you will meet while working on labs and the group project.</p>',
        vi: '<p>Ghi lệnh Git cho mỗi tình huống bạn gặp khi làm lab và dự án nhóm.</p>',
      },
      bang: [{
        ma: 'g', de: 'Command',
        cot: [{ ma: 'need', ten: 'Need' }, { ma: 'cmd', ten: 'Command' }],
        hang: [
          { ma: 'st', o: { need: 'See which files changed and what is staged' } },
          { ma: 'log', o: { need: 'See the commit history in one line per commit' } },
          { ma: 'clone', o: { need: 'Copy the group repo https://github.com/team/app.git to your computer' } },
          { ma: 'pull', o: { need: 'Get teammates\' new commits on the current branch' } },
          { ma: 'branch', o: { need: 'Create and switch to a new branch feature/login' } },
        ],
        dapAn: {
          'st.cmd': 'git status',
          'log.cmd': v('git log --oneline', 'git log --oneline --graph'),
          'clone.cmd': 'git clone https://github.com/team/app.git',
          'pull.cmd': v('git pull', 'git pull origin main'),
          'branch.cmd': v('git checkout -b feature/login', 'git switch -c feature/login'),
        },
        giaiThich: 'switch -c is the modern spelling of checkout -b. Pull = fetch + merge.|||switch -c là cách viết mới của checkout -b. Pull = fetch + merge.',
      }],
      goiY: ['status trả lời "đang có gì thay đổi?".', 'Tạo nhánh và chuyển sang luôn: checkout -b (hoặc switch -c).'],
      loiHayGap: ['Làm thẳng trên main trong dự án nhóm ⇒ xung đột liên tục.', 'Quên pull trước khi bắt đầu ⇒ code cũ, xung đột khi push.'],
      giaiThich: '<p>Năm lệnh này đủ cho phần lớn công việc hằng ngày; merge/rebase học khi làm nhóm.</p>',
      thuatNgu: [{ en: 'branch', vi: 'nhánh: dòng phát triển riêng' }, { en: 'merge conflict', vi: 'xung đột khi hai bên sửa cùng chỗ' }],
    }),
    tinh({
      tieuDe: 'Git situations: what do you do?',
      doKho: 'MEDIUM', phut: 8,
      khaiNiem: ['.gitignore', 'rejected push', 'merge conflict', 'secrets'], the: ['git', 'quiz', 'exercise-3'],
      moTa: {
        en: '<p>Five real situations from lab submissions. Choose the correct action — the wrong options are what students actually do and regret.</p>',
        vi: '<p>Năm tình huống thật khi nộp lab. Chọn cách xử lý đúng — các lựa chọn sai là điều sinh viên thật sự làm rồi hối hận.</p>',
      },
      goiY: ['Không bao giờ force-push lên nhánh chung.', 'Lộ khoá bí mật ⇒ đổi khoá, không chỉ xoá file.'],
      loiHayGap: ['Xoá cả repo rồi tạo lại khi gặp lỗi push.', 'Commit tệp .env.'],
      giaiThich: '<p>Đọc thông báo của Git: nó thường nói luôn lệnh nên chạy tiếp.</p>',
      thuatNgu: [{ en: 'rejected (non-fast-forward)', vi: 'bị từ chối vì remote có commit bạn chưa có' }],
      cauHoi: [
        q('s1', '<code>git push</code> says: rejected — the remote contains work that you do not have locally.', [['a', 'git push --force'], ['b', 'git pull (resolve conflicts if any), then push again'], ['c', 'Delete the GitHub repo'], ['d', 'Copy files manually']], ['b'], 'Force would delete a teammate\'s commits.|||Force sẽ xoá commit của bạn cùng nhóm.'),
        q('s2', 'You accidentally committed node_modules (200 MB).', [['a', 'Leave it'], ['b', 'Add node_modules/ to .gitignore, run git rm -r --cached node_modules, commit'], ['c', 'Delete the project'], ['d', 'Zip it']], ['b'], '--cached removes it from Git but keeps the folder on disk.|||--cached bỏ khỏi Git nhưng giữ thư mục trên máy.'),
        q('s3', 'After pull you see <<<<<<< HEAD … ======= … >>>>>>> in App.js.', [['a', 'Git is broken'], ['b', 'A merge conflict: edit the file to keep the right code, remove the markers, add and commit'], ['c', 'Run npm install'], ['d', 'Revert everything']], ['b'], 'Both sides changed the same lines.|||Cả hai bên sửa cùng dòng.'),
        q('s4', 'You pushed a .env file containing an API key to a public repo.', [['a', 'Delete the file in a new commit — done'], ['b', 'Revoke/rotate the key immediately, then remove the file and add .env to .gitignore'], ['c', 'Make the commit message vague'], ['d', 'Nothing, nobody looks']], ['b'], 'History still contains the key; bots scan GitHub within minutes.|||Lịch sử vẫn chứa khoá; bot quét GitHub trong vài phút.'),
        q('s5', 'Best commit message for adding the course list page:', [['a', '"update"'], ['b', '"feat: add course list page with search"'], ['c', '"asdf"'], ['d', '"final final 2"']], ['b'], 'Say what and why in the imperative mood.|||Nói làm gì, vì sao, dạng mệnh lệnh.'),
      ],
    }),
  ],
});
