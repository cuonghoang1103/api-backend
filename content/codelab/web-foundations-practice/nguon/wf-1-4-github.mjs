/** Bộ luyện bài 1.4 — GitHub. Lược đồ: ./_luoc-do.mjs (loại 'js'). kiem[].moTa = "EN|||VI".
 *  Mỗi đề cài lại một mẩu logic mà git/GitHub làm cho bạn: đọc URL remote, dòng status -sb, ahead/behind, quyết định push, soát lời nhắn commit, .gitignore. */
import { c, doiDau } from './_luoc-do.mjs';

const BAI = '<p><em>Bài 1.4 — GitHub: mã của bạn trên đám mây.</em> Các output trong bài (status -sb, push bị từ chối, .gitignore) đều do đúng những quy tắc này sinh ra.</p>';

export default doiDau({
  slug: 'wf-1-4-github',
  ten: '1.4 GitHub: remote, push, pull',
  baiHoc: 'Nền tảng Web — Bài 1.4 GitHub',
  ngonNgu: 'javascript',
  loaiKiem: 'js',
  level: 'BEGINNER',
  moTa: 'Đọc URL remote HTTPS/SSH, dựng dòng git status -sb, đếm ahead/behind, quyết định push (up-to-date / fast-forward / rejected), soát lời nhắn commit, khớp mẫu .gitignore — 6 bài.',
  de: [
    {
      tieuDe: 'Đọc URL của remote',
      doKho: 'EASY', phut: 15,
      khaiNiem: ['URL HTTPS', 'URL SSH kiểu scp', 'regex có nhóm'], tienQuyet: ['regex', 'object'], the: ['javascript', 'git'],
      moTa: `${BAI}<p>Viết ${c('parseRemote(url)')} trả ${c('{ protocol, host, owner, repo }')} cho ba dạng URL GitHub đưa ra: ${c('https://github.com/an/ct-shop.git')} (protocol ${c('"https"')}), ${c('git@github.com:an/ct-shop.git')} và ${c('ssh://git@github.com/an/ct-shop.git')} (cả hai protocol ${c('"ssh"')}). Đuôi ${c('.git')} và dấu ${c('/')} cuối là tuỳ chọn và không thuộc tên repo. Dạng khác ⇒ ${c('null')}.</p>`,
      yeuCau: ['Nhận đủ ba dạng.', 'Bỏ .git và / cuối.', 'Sai dạng ⇒ null.'],
      dauVao: 'url: string.', dauRa: 'object | null.',
      rangBuoc: ['owner và repo không chứa "/".'],
      viDu: [{ input: 'parseRemote("git@github.com:an/ct-shop.git")', output: '{ protocol: "ssh", host: "github.com", owner: "an", repo: "ct-shop" }', explanation: 'Dạng SSH trong bước 7 của bài.' }],
      goiY: ['Ba regex, mỗi dạng một cái; nhóm cuối: ([^/]+?)(?:\\.git)?\\/?$', 'Dạng scp: /^git@([^:]+):([^/]+)\\/([^/]+?)(?:\\.git)?\\/?$/'],
      khoiDau: { 'main.js': `// Bài 1.4 — đọc URL remote
function parseRemote(url) {
  const parts = url.split('/');
  return { protocol: 'https', host: parts[2], owner: parts[3], repo: parts[4] };
}
` },
      loiGiai: { 'main.js': `// Bài 1.4 — đọc URL remote: ba dạng, ba regex
const FORMS = [
  ['https', /^https:\\/\\/([^/]+)\\/([^/]+)\\/([^/]+?)(?:\\.git)?\\/?$/],
  ['ssh', /^git@([^:]+):([^/]+)\\/([^/]+?)(?:\\.git)?\\/?$/],            // dạng scp: git@host:owner/repo
  ['ssh', /^ssh:\\/\\/git@([^/]+)\\/([^/]+)\\/([^/]+?)(?:\\.git)?\\/?$/],
];

function parseRemote(url) {
  for (const [protocol, re] of FORMS) {
    const m = re.exec(url.trim());
    if (m) return { protocol, host: m[1], owner: m[2], repo: m[3] };
  }
  return null;
}
` },
      giaiThich: `<p>Dạng ${c('git@github.com:an/repo')} trông lạ vì nó mượn cú pháp của lệnh ${c('scp')}: dấu hai chấm ngăn tên máy với đường dẫn. Nhóm lười ${c('+?')} cùng ${c('(?:\\.git)?')} là cách để ${c('.git')} không lọt vào tên repo.</p>`,
      loiHayGap: ['Nhóm tham lam — repo thành "ct-shop.git".', 'Chỉ nhận dạng HTTPS.'],
      thamKhao: 'https://docs.github.com/en/get-started/git-basics/about-remote-repositories',
      kiem: [
        { moTa: 'HTTPS and SSH forms|||Dạng HTTPS và SSH', goi: '[parseRemote("https://github.com/an/ct-shop.git"), parseRemote("git@github.com:an/ct-shop.git")]', mongDoi: [{ protocol: 'https', host: 'github.com', owner: 'an', repo: 'ct-shop' }, { protocol: 'ssh', host: 'github.com', owner: 'an', repo: 'ct-shop' }] },
        { moTa: 'ssh:// URL, no .git, trailing slash|||URL ssh://, không .git, có / cuối', goi: '[parseRemote("ssh://git@gitlab.com/team/web-app"), parseRemote("https://github.com/an/my.site/")]', mongDoi: [{ protocol: 'ssh', host: 'gitlab.com', owner: 'team', repo: 'web-app' }, { protocol: 'https', host: 'github.com', owner: 'an', repo: 'my.site' }] },
        { moTa: 'Not a remote URL ⇒ null|||Không phải URL remote ⇒ null', goi: '[parseRemote("github.com/an/x"), parseRemote("https://github.com/an")]', mongDoi: [null, null] },
      ],
    },
    {
      tieuDe: 'Dòng git status -sb',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['upstream', 'ahead/behind', 'định dạng chuỗi'], tienQuyet: ['template string', 'mảng'], the: ['javascript', 'git'],
      moTa: `${BAI}<p>Viết ${c('statusLine(branch, upstream, ahead, behind)')} trả đúng dòng đầu mà ${c('git status -sb')} in: không có upstream (${c('null')}) ⇒ ${c('"## main"')}; có upstream ⇒ ${c('"## main...origin/main"')}, thêm ${c('" [ahead 1]"')}, ${c('" [behind 2]"')} hoặc ${c('" [ahead 1, behind 2]"')} khi khác 0.</p>`,
      yeuCau: ['Ba trường hợp ngoặc vuông đúng định dạng.', 'Không có upstream thì không có "..." và ngoặc.', 'Số 0 không hiện.'],
      dauVao: 'branch: string; upstream: string | null; ahead, behind: số.', dauRa: 'string.',
      rangBuoc: ['ahead, behind là số nguyên ≥ 0.'],
      viDu: [{ input: 'statusLine("main", "origin/main", 1, 0)', output: '"## main...origin/main [ahead 1]"', explanation: 'Đúng output ở bước 3 của bài.' }],
      goiY: ['const parts = []; if (ahead) parts.push("ahead " + ahead); …', 'parts.length ? " [" + parts.join(", ") + "]" : ""'],
      khoiDau: { 'main.js': `// Bài 1.4 — status -sb
function statusLine(branch, upstream, ahead, behind) {
  return '## ' + branch + '...' + upstream;
}
` },
      loiGiai: { 'main.js': `// Bài 1.4 — dòng đầu của git status -sb
function statusLine(branch, upstream, ahead, behind) {
  if (!upstream) return '## ' + branch;                 // chưa push -u: không có nhánh theo dõi
  const parts = [];
  if (ahead) parts.push('ahead ' + ahead);
  if (behind) parts.push('behind ' + behind);
  return '## ' + branch + '...' + upstream + (parts.length ? ' [' + parts.join(', ') + ']' : '');
}
` },
      giaiThich: `<p>Một dòng này trả lời hai câu quan trọng nhất trước khi gập laptop: còn commit chưa push không (ahead), và có việc của người khác chưa pull không (behind). Không có upstream nghĩa là nhánh chưa từng được ${c('push -u')}.</p>`,
      loiHayGap: ['In "[ahead 0]".', 'Quên trường hợp chưa có upstream.'],
      thamKhao: 'https://git-scm.com/docs/git-status#_short_format',
      kiem: [
        { moTa: 'The lesson outputs|||Các output của bài', goi: '[statusLine("main", "origin/main", 0, 0), statusLine("main", "origin/main", 1, 0)]', mongDoi: ['## main...origin/main', '## main...origin/main [ahead 1]'] },
        { moTa: 'Behind, and both|||Behind, và cả hai', goi: '[statusLine("main", "origin/main", 0, 2), statusLine("feature/cart", "origin/feature/cart", 3, 1)]', mongDoi: ['## main...origin/main [behind 2]', '## feature/cart...origin/feature/cart [ahead 3, behind 1]'] },
        { moTa: 'No upstream yet|||Chưa có upstream', goi: 'statusLine("feature/x", null, 2, 0)', mongDoi: '## feature/x' },
      ],
    },
    {
      tieuDe: 'Đếm ahead / behind',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['tổ tiên chung', 'lịch sử tuyến tính'], tienQuyet: ['mảng', 'vòng lặp'], the: ['javascript', 'git'],
      moTa: `${BAI}<p>Lịch sử mỗi bên là mảng mã commit từ cũ tới mới (giả định lịch sử thẳng, không có merge). Viết ${c('aheadBehind(local, remote)')} trả ${c('{ ahead, behind, base }')}: ${c('base')} là commit chung MỚI NHẤT (${c('null')} nếu không có), ${c('ahead')} = số commit của local sau ${c('base')}, ${c('behind')} = số commit của remote sau ${c('base')}.</p>`,
      yeuCau: ['Tìm commit chung mới nhất.', 'Không có gì chung ⇒ base null, đếm toàn bộ.', 'Không sửa mảng vào.'],
      dauVao: 'local, remote: string[] (cũ → mới).', dauRa: '{ ahead, behind, base }.',
      rangBuoc: ['Lịch sử tuyến tính.'],
      viDu: [{ input: 'aheadBehind(["8161c6f","6ea36d0","b1"], ["8161c6f","6ea36d0","a8272b6"])', output: '{ ahead: 1, behind: 1, base: "6ea36d0" }', explanation: 'Đúng lúc An push bị từ chối ở bước 5.' }],
      goiY: ['Duyệt i từ 0 khi local[i] === remote[i]; base là phần tử cuối cùng bằng nhau.', 'ahead = local.length - (i), behind = remote.length - (i).'],
      khoiDau: { 'main.js': `// Bài 1.4 — ahead/behind
function aheadBehind(local, remote) {
  return { ahead: local.length - remote.length, behind: 0, base: null };
}
` },
      loiGiai: { 'main.js': `// Bài 1.4 — ahead/behind: đi chung tới khi rẽ nhánh
function aheadBehind(local, remote) {
  let i = 0;
  while (i < local.length && i < remote.length && local[i] === remote[i]) i++;   // tiền tố chung
  return {
    ahead: local.length - i,                    // commit chỉ có ở máy bạn
    behind: remote.length - i,                  // commit chỉ có trên remote
    base: i > 0 ? local[i - 1] : null,          // commit chung mới nhất
  };
}
` },
      giaiThich: `<p>Khi cả ahead lẫn behind đều lớn hơn 0, hai bên đã <em>rẽ nhánh</em> — đúng tình huống push bị từ chối. ${c('git pull --rebase')} đưa behind về 0 (lấy commit của remote) rồi đặt commit của bạn lên trên, nên lúc đó chỉ còn ahead.</p>`,
      loiHayGap: ['Lấy hiệu độ dài — sai khi hai bên rẽ nhánh.', 'Dùng includes cho từng commit — chậm và sai thứ tự.'],
      thamKhao: 'https://git-scm.com/docs/git-rev-list#Documentation/git-rev-list.txt---left-right',
      kiem: [
        { moTa: 'Diverged: ahead 1, behind 1|||Rẽ nhánh: ahead 1, behind 1', goi: 'aheadBehind(["8161c6f", "6ea36d0", "b1"], ["8161c6f", "6ea36d0", "a8272b6"])', mongDoi: { ahead: 1, behind: 1, base: '6ea36d0' } },
        { moTa: 'Only ahead, only behind, equal|||Chỉ ahead, chỉ behind, bằng nhau', goi: '[aheadBehind(["a", "b", "c"], ["a"]), aheadBehind(["a"], ["a", "b"]), aheadBehind(["a", "b"], ["a", "b"])]', mongDoi: [{ ahead: 2, behind: 0, base: 'a' }, { ahead: 0, behind: 1, base: 'a' }, { ahead: 0, behind: 0, base: 'b' }] },
        { moTa: 'Nothing in common|||Không có gì chung', goi: 'aheadBehind(["x"], ["a", "b"])', mongDoi: { ahead: 1, behind: 2, base: null } },
      ],
    },
    {
      tieuDe: 'Push sẽ ra sao?',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['fast-forward', 'rejected (fetch first)', 'up-to-date'], tienQuyet: ['mảng', 'điều kiện'], the: ['javascript', 'git'],
      moTa: `${BAI}<p>Viết ${c('pushResult(local, remote, branch = "main")')} (lịch sử cũ → mới, mã commit 7 ký tự) trả đúng dòng git in ra: hai bên giống nhau ⇒ ${c('"Everything up-to-date"')}; remote rỗng ⇒ ${c('" * [new branch]      main -> main"')}; remote là tiền tố của local ⇒ fast-forward ${c('"   8161c6f..6ea36d0  main -> main"')} (cũ..mới); còn lại ⇒ ${c('" ! [rejected]        main -> main (fetch first)"')}.</p>`,
      yeuCau: ['Đủ bốn trường hợp.', 'Khoảng trắng đúng như git (3 dấu cách đầu dòng fast-forward; cột 20 cho nhãn).', 'Tham số branch tuỳ chọn.'],
      dauVao: 'local, remote: string[]; branch?: string.', dauRa: 'string.',
      rangBuoc: ['Lịch sử tuyến tính, không cần xét force.'],
      viDu: [{ input: 'pushResult(["8161c6f","6ea36d0"], ["8161c6f"])', output: '"   8161c6f..6ea36d0  main -> main"', explanation: 'Bước 3 của bài.' }],
      goiY: ['Nhãn đệm tới 18 ký tự: "[new branch]".padEnd(18) và "[rejected]".padEnd(18).', 'Tiền tố: remote.every((c, i) => local[i] === c) && local.length > remote.length.'],
      khoiDau: { 'main.js': `// Bài 1.4 — kết quả push
function pushResult(local, remote, branch = 'main') {
  return 'Everything up-to-date';
}
` },
      loiGiai: { 'main.js': `// Bài 1.4 — kết quả push: chỉ nhận khi remote không mất commit nào
function pushResult(local, remote, branch = 'main') {
  const ref = branch + ' -> ' + branch;
  if (local.length === remote.length && local.every((c, i) => c === remote[i])) return 'Everything up-to-date';
  if (remote.length === 0) return ' * ' + '[new branch]'.padEnd(18) + ref;
  const isPrefix = remote.length < local.length && remote.every((c, i) => local[i] === c);
  if (isPrefix) return '   ' + remote[remote.length - 1] + '..' + local[local.length - 1] + '  ' + ref;   // fast-forward
  return ' ! ' + '[rejected]'.padEnd(18) + ref + ' (fetch first)';      // remote có commit bạn chưa có
}
` },
      giaiThich: `<p>Quy tắc của push chỉ có một câu: remote chỉ được <em>tiến lên</em> (fast-forward), không bao giờ mất commit. Nếu remote có thứ local không chứa, nhận push là xoá công sức của người khác — nên git từ chối và bảo bạn fetch trước.</p>`,
      loiHayGap: ['Coi local dài hơn là được push — sai khi rẽ nhánh.', 'Sai khoảng trắng — so sánh output thất bại.'],
      thamKhao: 'https://git-scm.com/docs/git-push#_note_about_fast_forwards',
      kiem: [
        { moTa: 'Fast-forward and new branch|||Fast-forward và nhánh mới', goi: '[pushResult(["8161c6f", "6ea36d0"], ["8161c6f"]), pushResult(["12c727d"], [], "feature/cart")]', mongDoi: ['   8161c6f..6ea36d0  main -> main', ' * [new branch]      feature/cart -> feature/cart'] },
        { moTa: 'Rejected when the remote has new work|||Bị từ chối khi remote có việc mới', goi: 'pushResult(["8161c6f", "6ea36d0", "b1aaaaa"], ["8161c6f", "6ea36d0", "a8272b6"])', mongDoi: ' ! [rejected]        main -> main (fetch first)' },
        { moTa: 'Up to date; behind-only is also rejected|||Đã khớp; chỉ đi sau cũng bị từ chối', goi: '[pushResult(["a"], ["a"]), pushResult(["a"], ["a", "b"])]', mongDoi: ['Everything up-to-date', ' ! [rejected]        main -> main (fetch first)'] },
      ],
    },
    {
      tieuDe: 'Soát lời nhắn commit',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['dòng tiêu đề', 'thân commit', 'kiểm tra quy tắc'], tienQuyet: ['split', 'regex'], the: ['javascript', 'git'],
      moTa: `${BAI}<p>Viết ${c('lintCommit(message)')} trả mảng vấn đề (rỗng = tốt), theo thứ tự: tiêu đề (dòng 1, đã trim) rỗng ⇒ ${c('"empty subject"')} (và dừng); dài hơn 72 ký tự ⇒ ${c('"subject longer than 72"')}; kết thúc bằng dấu chấm ⇒ ${c('"subject ends with a period"')}; là một trong ${c('"update" "fix" "wip" "changes" "asdf"')} (không phân biệt hoa thường) ⇒ ${c('"subject says nothing"')}; có thân mà dòng 2 không trống ⇒ ${c('"missing blank line after subject"')}.</p>`,
      yeuCau: ['Đúng thứ tự năm quy tắc.', 'Tiêu đề rỗng thì chỉ báo một lỗi.', 'Không có thân thì bỏ quy tắc cuối.'],
      dauVao: 'message: string.', dauRa: 'string[].',
      rangBuoc: ['Độ dài tính bằng số ký tự của dòng đầu đã trim.'],
      viDu: [{ input: 'lintCommit("Add home page")', output: '[]', explanation: 'Một tiêu đề ngắn, nói rõ làm gì.' }],
      goiY: ['const lines = message.split("\\n"); const subject = lines[0].trim();', 'Có thân khi lines.length > 1 và có dòng nào từ dòng 2 trở đi không rỗng.'],
      khoiDau: { 'main.js': `// Bài 1.4 — soát lời nhắn commit
function lintCommit(message) {
  return [];
}
` },
      loiGiai: { 'main.js': `// Bài 1.4 — soát lời nhắn commit: tiêu đề ngắn, có nghĩa, cách thân một dòng trống
const VAGUE = ['update', 'fix', 'wip', 'changes', 'asdf'];

function lintCommit(message) {
  const lines = message.split('\\n');
  const subject = lines[0].trim();
  if (subject === '') return ['empty subject'];
  const problems = [];
  if (subject.length > 72) problems.push('subject longer than 72');
  if (subject.endsWith('.')) problems.push('subject ends with a period');
  if (VAGUE.includes(subject.toLowerCase())) problems.push('subject says nothing');
  const hasBody = lines.slice(1).some((l) => l.trim() !== '');
  if (hasBody && lines[1].trim() !== '') problems.push('missing blank line after subject');
  return problems;
}
` },
      giaiThich: `<p>Tiêu đề commit hiện ở mọi nơi: ${c('git log --oneline')}, trang lịch sử GitHub, tiêu đề pull request. Dưới 72 ký tự để không bị cắt; dòng trống để git tách tiêu đề khỏi thân. Một tiêu đề "fix" không giúp ai sáu tháng sau.</p>`,
      loiHayGap: ['Đếm độ dài cả thông điệp thay vì dòng đầu.', 'Báo thiếu dòng trống khi không có thân.'],
      thamKhao: 'https://cbea.ms/git-commit/',
      kiem: [
        { moTa: 'Good messages from the lesson|||Lời nhắn tốt trong bài', goi: '[lintCommit("Add home page"), lintCommit("Document how to run\\n\\nExplain npm run dev.")]', mongDoi: [[], []] },
        { moTa: 'Several problems in order|||Nhiều vấn đề theo thứ tự', goi: 'lintCommit("Fix.\\nmore text")', mongDoi: ['subject ends with a period', 'missing blank line after subject'] },
        { moTa: 'Vague, too long, empty|||Mơ hồ, quá dài, rỗng', goi: '[lintCommit("WIP"), lintCommit("x".repeat(73)), lintCommit("   \\n\\nbody")]', mongDoi: [['subject says nothing'], ['subject longer than 72'], ['empty subject']] },
      ],
    },
    {
      tieuDe: 'Khớp mẫu .gitignore',
      doKho: 'HARD', phut: 25,
      khaiNiem: ['glob', 'phủ định !', 'mẫu thư mục', 'luật cuối thắng'], tienQuyet: ['regex', 'split'], the: ['javascript', 'git'],
      moTa: `${BAI}<p>Viết ${c('isIgnored(path, gitignore)')}: ${c('path')} là đường dẫn file từ gốc dự án (vd ${c('"src/app.log"')}), ${c('gitignore')} là nội dung file. Quy tắc (bản rút gọn của git): bỏ dòng trống và dòng ${c('#')}; ${c('!mẫu')} là phủ định (bỏ-bỏ-qua); mẫu kết thúc bằng ${c('/')} chỉ khớp THƯ MỤC (một thành phần thư mục trong đường dẫn); mẫu không chứa ${c('/')} (ngoài dấu cuối) khớp với BẤT KỲ thành phần nào của đường dẫn; mẫu có ${c('/')} ở đầu hoặc giữa thì neo từ gốc và khớp tiền tố theo thành phần; ${c('*')} khớp mọi ký tự trừ ${c('/')}, ${c('?')} khớp một ký tự trừ ${c('/')}. Dòng khớp CUỐI CÙNG quyết định.</p>`,
      yeuCau: ['Phủ định và luật cuối thắng.', 'Mẫu thư mục chỉ khớp thư mục.', 'Mẫu có / được neo gốc.'],
      dauVao: 'path: string; gitignore: string.', dauRa: 'boolean.',
      rangBuoc: ['Không cần ** và không cần ký tự thoát.'],
      viDu: [{ input: 'isIgnored(".env", "node_modules/\\ndist/\\n.env")', output: 'true', explanation: 'Đúng .gitignore của bài.' }],
      goiY: ['globToRe(p) = new RegExp("^" + p.replace(/[.+^${}()|[\\]\\\\]/g, "\\\\$&").replace(/\\*/g, "[^/]*").replace(/\\?/g, "[^/]") + "$")', 'Thành phần: const parts = path.split("/"); thư mục = parts.slice(0, -1); file = parts.at(-1).'],
      khoiDau: { 'main.js': `// Bài 1.4 — .gitignore
function isIgnored(path, gitignore) {
  return gitignore.split('\\n').includes(path);
}
` },
      loiGiai: { 'main.js': `// Bài 1.4 — .gitignore: duyệt mọi dòng, dòng khớp cuối cùng quyết định
const globToRe = (p) => new RegExp('^' + p.replace(/[.+^\${}()|[\\]\\\\]/g, '\\\\$&').replace(/\\*/g, '[^/]*').replace(/\\?/g, '[^/]') + '$');

function matches(pattern, path) {
  const parts = path.split('/');
  const dirOnly = pattern.endsWith('/');
  let p = dirOnly ? pattern.slice(0, -1) : pattern;
  const anchored = p.includes('/');                      // có / ở đầu hoặc giữa ⇒ neo gốc
  if (p.startsWith('/')) p = p.slice(1);
  if (!anchored) {
    const re = globToRe(p);
    const candidates = dirOnly ? parts.slice(0, -1) : parts; // mẫu thư mục chỉ xét thành phần thư mục
    return candidates.some((seg) => re.test(seg));
  }
  const pp = p.split('/');
  const limit = dirOnly ? parts.length - 1 : parts.length;  // mẫu thư mục không được khớp chính tên file
  if (pp.length > limit) return false;
  return pp.every((seg, i) => globToRe(seg).test(parts[i])); // khớp tiền tố theo thành phần
}

function isIgnored(path, gitignore) {
  let ignored = false;
  for (const raw of gitignore.split(/\\r?\\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const negate = line.startsWith('!');
    if (matches(negate ? line.slice(1) : line, path)) ignored = !negate;   // luật sau đè luật trước
  }
  return ignored;
}
` },
      giaiThich: `<p>Hai quy tắc làm người mới bối rối nhất: luật sau đè luật trước (nên ${c('!keep.log')} phải đứng SAU ${c('*.log')}), và mẫu không có ${c('/')} khớp ở mọi tầng thư mục (${c('node_modules/')} bỏ qua cả ${c('packages/a/node_modules')}). Khi nghi ngờ, ${c('git check-ignore -v &lt;file&gt;')} cho biết đúng dòng nào thắng — như ở bước 2 của bài.</p>`,
      loiHayGap: ['Đặt !keep.log trước *.log — không có tác dụng.', 'Coi mọi mẫu là neo gốc — node_modules lồng nhau lọt vào commit.'],
      thamKhao: 'https://git-scm.com/docs/gitignore#_pattern_format',
      kiem: [
        { moTa: 'The lesson .gitignore|||.gitignore của bài', chuanBi: 'const G = "node_modules/\\ndist/\\n.env\\n";', goi: '[".env", "node_modules/react/index.js", "dist/assets/a.js", "src/main.js", "README.md"].map((p) => isIgnored(p, G))', mongDoi: [true, true, true, false, false] },
        { moTa: 'Wildcards and negation: the last match wins|||Ký tự đại diện và phủ định: dòng khớp cuối thắng', chuanBi: 'const G = "# logs\\n*.log\\n!keep.log\\n.env*\\n!.env.example";', goi: '["app.log", "src/debug.log", "keep.log", ".env.local", ".env.example"].map((p) => isIgnored(p, G))', mongDoi: [true, true, false, true, false] },
        { moTa: 'Directory-only and anchored patterns|||Mẫu chỉ-thư-mục và mẫu neo gốc', chuanBi: 'const G = "build/\\n/secret.txt\\ndocs/*.pdf";', goi: '["build", "src/build/x.js", "secret.txt", "src/secret.txt", "docs/a.pdf", "docs/sub/a.pdf"].map((p) => isIgnored(p, G))', mongDoi: [false, true, true, false, true, false] },
      ],
    },
  ],
});
