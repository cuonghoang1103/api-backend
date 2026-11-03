/** Bộ luyện bài 10.3 — Quy trình Git. Lược đồ: ./_luoc-do.mjs (loại 'js'). kiem[].moTa = "EN|||VI". ´ = dấu huyền, @{ = ${
 *  Máy chấm không chạy git ⇒ luyện phần "nghĩ" của quy trình bằng JS: soát thông điệp commit, đặt tên nhánh, đọc khối xung đột,
 *  gỡ xung đột theo lựa chọn, quyết định push/pull từ hai lịch sử, và gộp ba bên theo dòng (thứ git merge làm). */
import { c, doiDau } from './_luoc-do.mjs';

const BAI = '<p><em>Bài 10.3 — Quy trình Git.</em> Mỗi bài mô phỏng một quyết định trong quy trình làm việc nhóm — thứ Git làm hoặc thứ người review nhìn vào.</p>';

export default doiDau({
  slug: 'wf-10-3-git-workflow',
  ten: '10.3 Quy trình Git',
  baiHoc: 'Nền tảng Web — Bài 10.3 Git workflow for real work',
  ngonNgu: 'javascript',
  loaiKiem: 'js',
  level: 'INTERMEDIATE',
  moTa: 'Soát thông điệp commit, đặt tên nhánh từ tiêu đề việc, đọc các khối xung đột <<<<<<< ======= >>>>>>>, gỡ xung đột theo ours/theirs/both, quyết định push/pull/merge từ hai lịch sử, và tự viết phép gộp ba bên theo dòng — 6 bài.',
  de: [
    {
      tieuDe: 'Soát thông điệp commit',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['thông điệp commit'], tienQuyet: ['split', 'regex'], the: ['javascript', 'git'],
      moTa: `${BAI}<p>Viết ${c('commitProblems(message)')} trả mảng vấn đề theo thứ tự: dòng tiêu đề (dòng đầu) rỗng ⇒ ${c('["empty subject"]')} (dừng luôn); dài hơn 72 ký tự ⇒ ${c('"subject longer than 72"')}; kết thúc bằng dấu chấm ⇒ ${c('"subject ends with a period"')}; chữ đầu là chữ thường ⇒ ${c('"start with a capital letter"')}; cả tiêu đề (không phân biệt hoa thường, bỏ dấu câu cuối) là một trong ${c('update, fix, wip, changes, stuff, asdf, final')} ⇒ ${c('"say what changed"')}; có thân bài mà dòng thứ hai không trống ⇒ ${c('"blank line after the subject"')}.</p>`,
      yeuCau: ['Đúng thứ tự vấn đề.', 'Tiêu đề rỗng dừng sớm.', 'Kiểm dòng trống sau tiêu đề.'],
      dauVao: 'message: string.', dauRa: 'string[].',
      rangBuoc: ['Tiêu đề được trim trước khi kiểm.'],
      viDu: [{ input: 'commitProblems("Add search(term) to notes")', output: '[]', explanation: 'Commit của An trong bài.' }],
      goiY: ['const [first = "", second, ...rest] = message.split("\\n"); const subject = first.trim();', '/^[a-z]/.test(subject) — chữ thường ở đầu'],
      khoiDau: { 'main.js': `// Bài 10.3 — soát thông điệp commit
function commitProblems(message) {
  return message ? [] : ['empty subject'];
}
` },
      loiGiai: { 'main.js': `// Bài 10.3 — luật quen thuộc: tiêu đề ngắn, viết hoa, không dấu chấm, nói rõ thay đổi; dòng trống trước thân bài
const VAGUE = new Set(['update', 'fix', 'wip', 'changes', 'stuff', 'asdf', 'final']);

function commitProblems(message) {
  const lines = String(message).split('\\n');
  const subject = lines[0].trim();
  if (subject === '') return ['empty subject'];
  const problems = [];
  if (subject.length > 72) problems.push('subject longer than 72');
  if (subject.endsWith('.')) problems.push('subject ends with a period');
  if (/^[a-z]/.test(subject)) problems.push('start with a capital letter');
  if (VAGUE.has(subject.toLowerCase().replace(/[.!]+$/, ''))) problems.push('say what changed');
  if (lines.length > 1 && lines[1].trim() !== '') problems.push('blank line after the subject');
  return problems;
}
` },
      giaiThich: `<p>${c('git log --oneline')} chỉ hiện tiêu đề — sáu tháng sau đó là thứ duy nhất người khác (và bạn) đọc. Nhiều nhóm gắn đúng những luật này vào hook ${c('commit-msg')} hoặc CI.</p>`,
      loiHayGap: ['Không trim tiêu đề.', 'Coi "Fix." khác "fix".'],
      thamKhao: 'https://cbea.ms/git-commit/',
      kiem: [
        { moTa: 'Good messages pass|||Thông điệp tốt được nhận', goi: '[commitProblems("Add search(term) to notes"), commitProblems("Fix crash for pick-up orders\\n\\nOrders without an address made shippingLabel throw.")]', mongDoi: [[], []] },
        { moTa: 'Vague, lowercase, period|||Mơ hồ, chữ thường, dấu chấm', goi: '[commitProblems("update"), commitProblems("Fix."), commitProblems("added the thing.")]', mongDoi: [['start with a capital letter', 'say what changed'], ['subject ends with a period', 'say what changed'], ['subject ends with a period', 'start with a capital letter']] },
        { moTa: 'Long subject, missing blank line, empty|||Tiêu đề dài, thiếu dòng trống, rỗng', goi: '[commitProblems("A".repeat(73) + "\\nbody"), commitProblems("   \\nbody")]', mongDoi: [['subject longer than 72', 'blank line after the subject'], ['empty subject']] },
      ],
    },
    {
      tieuDe: 'Tên nhánh từ tiêu đề việc',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['quy ước đặt tên nhánh', 'slug'], tienQuyet: ['normalize', 'regex'], the: ['javascript', 'git'],
      moTa: `${BAI}<p>Viết ${c('branchName(type, title)')}: ${c('type')} phải là ${c('feature | fix | docs | chore')} (khác ⇒ ném ${c('RangeError("unknown type: <type>")')}). Tiêu đề thành slug: bỏ dấu tiếng Việt (${c('normalize("NFD")')} rồi bỏ dấu kết hợp; ${c('đ/Đ')} → ${c('d')}), chữ thường, mọi chuỗi ký tự không phải a–z/0–9 thành một ${c('-')}, bỏ ${c('-')} hai đầu, cắt tối đa 40 ký tự (không để ${c('-')} ở cuối sau khi cắt). Slug rỗng ⇒ ném ${c('RangeError("empty title")')}. Kết quả ${c('"<type>/<slug>"')}.</p>`,
      yeuCau: ['Kiểm type.', 'Bỏ dấu tiếng Việt.', 'Tối đa 40 ký tự slug.'],
      dauVao: 'type: string; title: string.', dauRa: 'string.',
      rangBuoc: ['Không có dấu cách hay ký tự đặc biệt trong tên nhánh.'],
      viDu: [{ input: 'branchName("feature", "Thêm tìm kiếm ghi chú")', output: '"feature/them-tim-kiem-ghi-chu"', explanation: 'Tên nhánh gõ được trên mọi terminal.' }],
      goiY: ['title.normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").replace(/[đĐ]/g, "d")', '.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")'],
      khoiDau: { 'main.js': `// Bài 10.3 — tên nhánh
function branchName(type, title) {
  return type + '/' + title;
}
` },
      loiGiai: { 'main.js': `// Bài 10.3 — loại/việc-ngắn-gọn: đọc được, gõ được, không dấu cách
const TYPES = ['feature', 'fix', 'docs', 'chore'];

function branchName(type, title) {
  if (!TYPES.includes(type)) throw new RangeError('unknown type: ' + type);
  const slug = String(title)
    .normalize('NFD').replace(/[\\u0300-\\u036f]/g, '')    // bỏ dấu
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
    .replace(/-+$/, '');
  if (!slug) throw new RangeError('empty title');
  return type + '/' + slug;
}
` },
      giaiThich: `<p>Tên nhánh xuất hiện trong lệnh, URL của pull request và log CI. Dấu cách và dấu tiếng Việt làm lệnh phải đặt trong nháy và dễ gõ sai; tiền tố loại giúp lọc nhánh (${c('git branch --list "fix/*"')}).</p>`,
      loiHayGap: ['Quên đ.', 'Cắt 40 rồi để lại "-" ở cuối.'],
      thamKhao: 'https://git-scm.com/docs/git-check-ref-format',
      kiem: [
        { moTa: 'Vietnamese title|||Tiêu đề tiếng Việt', goi: '[branchName("feature", "Thêm tìm kiếm ghi chú"), branchName("fix", "Đơn tự lấy không có địa chỉ!")]', mongDoi: ['feature/them-tim-kiem-ghi-chu', 'fix/don-tu-lay-khong-co-dia-chi'] },
        { moTa: 'Length limit and trimming dashes|||Giới hạn độ dài và bỏ gạch thừa', goi: '[branchName("docs", "  --Update README: setup & deploy (v2)--  "), branchName("chore", "a".repeat(39) + " bcd")]', mongDoi: ['docs/update-readme-setup-deploy-v2', 'chore/' + 'a'.repeat(39)] },
        { moTa: 'Bad type or empty title|||Loại sai hoặc tiêu đề rỗng', goi: '[(() => { try { branchName("hotfix", "x"); } catch (e) { return e.message; } })(), (() => { try { branchName("fix", "!!!"); } catch (e) { return e.message; } })()]', mongDoi: ['unknown type: hotfix', 'empty title'] },
      ],
    },
    {
      tieuDe: 'Đọc các khối xung đột',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['dấu xung đột', 'ours/theirs'], tienQuyet: ['split', 'vòng lặp'], the: ['javascript', 'git'],
      moTa: `${BAI}<p>Viết ${c('findConflicts(text)')} trả mảng các khối xung đột ${c('{ startLine, ours, theirs, theirsName }')}: ${c('startLine')} là số dòng (từ 1) của dòng ${c('<<<<<<<')}; ${c('ours')}/${c('theirs')} là mảng dòng giữa các dấu; ${c('theirsName')} là chữ sau ${c('>>>>>>> ')}. Dòng đánh dấu bắt đầu bằng đúng 7 ký tự ${c('<')}/${c('=')}/${c('>')}. Khối không đóng (hết tệp mà chưa có ${c('>>>>>>>')}) ⇒ ném ${c('SyntaxError("unterminated conflict at line N")')}. Không có xung đột ⇒ ${c('[]')}.</p>`,
      yeuCau: ['Nhiều khối.', 'Số dòng chính xác.', 'Khối dở dang ⇒ lỗi.'],
      dauVao: 'text: string.', dauRa: '{ startLine, ours, theirs, theirsName }[].',
      rangBuoc: ['Một dòng "=======" ngoài khối xung đột là văn bản thường.'],
      viDu: [{ input: 'findConflicts(notes.js trong bài)', output: '[{ startLine: 4, ours: ["  return [...notes].sort().join(\'\\\\n\');"], theirs: [...], theirsName: "origin/main" }]', explanation: 'Đúng xung đột của Bình.' }],
      goiY: ['Trạng thái: "out" | "ours" | "theirs"; đổi trạng thái ở mỗi dòng dấu.', "line.startsWith('<<<<<<<') / === '=======' / startsWith('>>>>>>>')"],
      khoiDau: { 'main.js': `// Bài 10.3 — đọc khối xung đột
function findConflicts(text) {
  return [];
}
` },
      loiGiai: { 'main.js': `// Bài 10.3 — máy trạng thái ba trạng thái: ngoài khối → phần của ta → phần của họ
function findConflicts(text) {
  const lines = String(text).split('\\n');
  const blocks = [];
  let cur = null;
  let part = 'out';
  lines.forEach((line, i) => {
    if (part === 'out' && line.startsWith('<<<<<<<')) {
      cur = { startLine: i + 1, ours: [], theirs: [], theirsName: '' };
      part = 'ours';
    } else if (part === 'ours' && line === '=======') {
      part = 'theirs';
    } else if (part === 'theirs' && line.startsWith('>>>>>>>')) {
      cur.theirsName = line.slice(7).trim();
      blocks.push(cur);
      cur = null;
      part = 'out';
    } else if (part !== 'out') {
      cur[part].push(line);
    }
  });
  if (cur) throw new SyntaxError('unterminated conflict at line ' + cur.startLine);
  return blocks;
}
` },
      giaiThich: `<p>Git chỉ ghi văn bản có quy ước; trình soạn thảo (VS Code: "Accept Current / Incoming / Both") đọc đúng các dấu này. Một khối dở dang nghĩa là ai đó đã xoá mất một dấu bằng tay — tệp đó không nên được commit.</p>`,
      loiHayGap: ['Coi "=======" ngoài khối là dấu.', 'Đánh số dòng từ 0.'],
      thamKhao: 'https://git-scm.com/docs/git-merge#_how_conflicts_are_presented',
      kiem: [
        { moTa: "Binh's conflict from the lesson|||Xung đột của Bình trong bài", goi: 'findConflicts(["const notes = [];", "", "function list() {", "<<<<<<< HEAD", "  return [...notes].sort().join(\'\\\\n\');", "=======", "  return notes.map((n, i) => (i + 1) + \'. \' + n).join(\'\\\\n\');", ">>>>>>> origin/main", "}"].join("\\n"))', mongDoi: [{ startLine: 4, ours: ["  return [...notes].sort().join('\\n');"], theirs: ["  return notes.map((n, i) => (i + 1) + '. ' + n).join('\\n');"], theirsName: 'origin/main' }] },
        { moTa: 'Two blocks, a plain ======= line, no conflicts|||Hai khối, dòng ======= thường, không xung đột', goi: '[findConflicts("=======\\n<<<<<<< HEAD\\na\\n=======\\nb\\nc\\n>>>>>>> feature/x\\nmid\\n<<<<<<< HEAD\\n=======\\nz\\n>>>>>>> main").map((b) => [b.startLine, b.ours.length, b.theirs.length, b.theirsName]), findConflicts("plain\\ntext")]', mongDoi: [[[2, 1, 2, 'feature/x'], [9, 0, 1, 'main']], []] },
        { moTa: 'An unterminated block throws|||Khối dở dang ném lỗi', goi: 'findConflicts("x\\n<<<<<<< HEAD\\na\\n=======\\nb")', mongDoi: { loi: 'SyntaxError', thongDiep: '^unterminated conflict at line 2$' } },
      ],
    },
    {
      tieuDe: 'Gỡ xung đột theo lựa chọn',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['ours/theirs/both', 'không để sót dấu'], tienQuyet: ['vòng lặp', 'mảng'], the: ['javascript', 'git'],
      moTa: `${BAI}<p>Viết ${c('resolve(text, choices)')}: ${c('choices')} là mảng, mỗi phần tử cho một khối xung đột theo thứ tự: ${c('"ours"')}, ${c('"theirs"')}, ${c('"both"')} (ours rồi theirs) hoặc một CHUỖI khác bất kỳ được coi là nội dung viết tay thay cho cả khối (có thể nhiều dòng). Trả văn bản đã gỡ, giữ nguyên các dòng ngoài khối. Số lựa chọn khác số khối ⇒ ném ${c('RangeError("expected N choices, got M")')}. Kết quả còn dòng bắt đầu bằng ${c('<<<<<<<')} hoặc ${c('>>>>>>>')} ⇒ ném ${c('Error("conflict markers left")')}.</p>`,
      yeuCau: ['Bốn kiểu lựa chọn.', 'Đếm khớp số khối.', 'Chặn dấu sót.'],
      dauVao: 'text: string; choices: string[].', dauRa: 'string.',
      rangBuoc: ['Dùng lại cách đọc khối của bài trước (tự viết lại trong tệp).'],
      viDu: [{ input: 'resolve(notes.js xung đột, ["  return [...notes].sort().map((n, i) => (i + 1) + \'. \' + n).join(\'\\\\n\');"])', output: 'tệp với dòng return mới, không còn dấu', explanation: 'Cách Bình gỡ trong bài: giữ cả hai ý.' }],
      goiY: ['Duyệt dòng; trong khối thì gom ours/theirs; khi gặp >>>>>>> thì đẩy phần được chọn.', 'const pick = { ours: b.ours, theirs: b.theirs, both: [...b.ours, ...b.theirs] }[choice] ?? choice.split("\\n");'],
      khoiDau: { 'main.js': `// Bài 10.3 — gỡ xung đột
function resolve(text, choices) {
  return text.replace(/^(<<<<<<<|=======|>>>>>>>).*\\n?/gm, '');
}
` },
      loiGiai: { 'main.js': `// Bài 10.3 — thay mỗi khối bằng phần được chọn; kiểm số lựa chọn và kiểm không còn dấu
function resolve(text, choices) {
  const out = [];
  let block = null, part = null, k = 0;
  const lines = String(text).split('\\n');
  const total = lines.filter((l) => l.startsWith('<<<<<<<')).length;
  if (total !== choices.length) throw new RangeError('expected ' + total + ' choices, got ' + choices.length);
  for (const line of lines) {
    if (!block && line.startsWith('<<<<<<<')) { block = { ours: [], theirs: [] }; part = 'ours'; continue; }
    if (block && part === 'ours' && line === '=======') { part = 'theirs'; continue; }
    if (block && part === 'theirs' && line.startsWith('>>>>>>>')) {
      const choice = choices[k++];
      const pick = { ours: block.ours, theirs: block.theirs, both: [...block.ours, ...block.theirs] }[choice] ?? String(choice).split('\\n');
      out.push(...pick);
      block = null;
      continue;
    }
    if (block) block[part].push(line); else out.push(line);
  }
  const result = out.join('\\n');
  if (/^(<<<<<<<|>>>>>>>)/m.test(result)) throw new Error('conflict markers left');
  return result;
}
` },
      giaiThich: `<p>Mã khởi đầu chỉ xoá các dòng dấu — giữ LẪN LỘN cả hai phiên bản, thường là mã sai (hai lệnh return). Gỡ xung đột là chọn có chủ đích cho từng khối. Phép kiểm cuối là lưới an toàn mà ${c('git add')} không có.</p>`,
      loiHayGap: ['Chỉ xoá dấu, giữ cả hai.', 'Không đếm khối.', 'Viết tay một dòng mà vẫn dính dấu.'],
      thamKhao: 'https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging#_basic_merge_conflicts',
      kiem: [
        { moTa: 'ours, theirs, both|||ours, theirs, both', goi: '(() => { const t = "a\\n<<<<<<< HEAD\\nmine\\n=======\\nyours\\n>>>>>>> main\\nz"; return [resolve(t, ["ours"]), resolve(t, ["theirs"]), resolve(t, ["both"])]; })()', mongDoi: ['a\nmine\nz', 'a\nyours\nz', 'a\nmine\nyours\nz'] },
        { moTa: "A hand-written resolution, as Binh did|||Gỡ bằng tay như Bình", goi: 'resolve(["function list() {", "<<<<<<< HEAD", "  return [...notes].sort().join(\'\\\\n\');", "=======", "  return notes.map((n, i) => (i + 1) + \'. \' + n).join(\'\\\\n\');", ">>>>>>> origin/main", "}"].join("\\n"), ["  return [...notes].sort().map((n, i) => (i + 1) + \'. \' + n).join(\'\\\\n\');"])', mongDoi: "function list() {\n  return [...notes].sort().map((n, i) => (i + 1) + '. ' + n).join('\\n');\n}" },
        { moTa: 'Wrong number of choices|||Sai số lựa chọn', goi: 'resolve("<<<<<<< HEAD\\na\\n=======\\nb\\n>>>>>>> x\\n<<<<<<< HEAD\\nc\\n=======\\nd\\n>>>>>>> x", ["ours"])', mongDoi: { loi: 'RangeError', thongDiep: '^expected 2 choices, got 1$' } },
        { moTa: 'Markers left in a manual resolution|||Còn dấu trong phần viết tay', goi: 'resolve("<<<<<<< HEAD\\na\\n=======\\nb\\n>>>>>>> x", ["a\\n>>>>>>> x"])', mongDoi: { loi: 'Error', thongDiep: 'conflict markers left' } },
      ],
    },
    {
      tieuDe: 'Push, pull hay merge?',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['ahead/behind', 'fast-forward', 'push bị từ chối'], tienQuyet: ['Set', 'indexOf'], the: ['javascript', 'git'],
      moTa: `${BAI}<p>Viết ${c('syncStatus(local, remote)')}: hai mảng mã commit của CÙNG một nhánh, từ cũ tới mới (lịch sử tuyến tính). Gọi ${c('base')} là commit chung MỚI NHẤT (phần đầu chung dài nhất). ${c('ahead')} = số commit chỉ có ở local sau base, ${c('behind')} = số commit chỉ có ở remote sau base. Trả ${c('{ ahead, behind, action }')} với ${c('action')}: ${c('"up to date"')} (0/0), ${c('"push"')} (ahead > 0, behind = 0), ${c('"pull (fast-forward)"')} (ahead = 0, behind > 0), ${c('"pull then push (merge)"')} (cả hai > 0 — đây là lúc push bị từ chối). Không có commit chung nào ⇒ ném ${c('Error("unrelated histories")')}.</p>`,
      yeuCau: ['Tìm phần đầu chung.', 'Đếm ahead/behind.', 'Bốn hành động.'],
      dauVao: 'local: string[]; remote: string[].', dauRa: '{ ahead, behind, action }.',
      rangBuoc: ['Lịch sử tuyến tính (không cần xử lý merge commit).'],
      viDu: [{ input: 'syncStatus(["365679b", "b1"], ["365679b", "057bbcf"])', output: '{ ahead: 1, behind: 1, action: "pull then push (merge)" }', explanation: 'Đúng lúc push của Bình bị từ chối "fetch first".' }],
      goiY: ['let i = 0; while (i < local.length && i < remote.length && local[i] === remote[i]) i++;', 'ahead = local.length - i; behind = remote.length - i;'],
      khoiDau: { 'main.js': `// Bài 10.3 — push, pull hay merge?
function syncStatus(local, remote) {
  return { ahead: local.length - remote.length, behind: 0, action: 'push' };
}
` },
      loiGiai: { 'main.js': `// Bài 10.3 — phần đầu chung = lịch sử đã đồng bộ; phần đuôi mỗi bên quyết định việc cần làm
function syncStatus(local, remote) {
  let i = 0;
  while (i < local.length && i < remote.length && local[i] === remote[i]) i++;
  if (i === 0) throw new Error('unrelated histories');
  const ahead = local.length - i;
  const behind = remote.length - i;
  const action = ahead === 0 && behind === 0 ? 'up to date'
    : behind === 0 ? 'push'
    : ahead === 0 ? 'pull (fast-forward)'
    : 'pull then push (merge)';
  return { ahead, behind, action };
}
` },
      giaiThich: `<p>Đây là thứ ${c('git status')} in ra: "Your branch is ahead of 'origin/main' by 1 commit, and behind by 1" (diverged). Push chỉ được nhận khi behind = 0; vì vậy push của Bình bị từ chối, và ${c('--force')} là "giả vờ behind = 0" bằng cách xoá commit của người khác.</p>`,
      loiHayGap: ['So độ dài thay vì so phần chung.', 'Coi diverged là push được.'],
      thamKhao: 'https://git-scm.com/docs/git-status',
      kiem: [
        { moTa: 'Diverged: the rejected push|||Phân kỳ: lần push bị từ chối', goi: 'syncStatus(["365679b", "b1"], ["365679b", "057bbcf"])', mongDoi: { ahead: 1, behind: 1, action: 'pull then push (merge)' } },
        { moTa: 'Push, fast-forward, up to date|||Push, tiến thẳng, đã đồng bộ', goi: '[syncStatus(["a", "b", "c"], ["a"]).action, syncStatus(["a"], ["a", "b", "c"]), syncStatus(["a", "b"], ["a", "b"]).action]', mongDoi: ['push', { ahead: 0, behind: 2, action: 'pull (fast-forward)' }, 'up to date'] },
        { moTa: 'Unrelated histories|||Lịch sử không liên quan', goi: 'syncStatus(["x"], ["y"])', mongDoi: { loi: 'Error', thongDiep: 'unrelated histories' } },
      ],
    },
    {
      tieuDe: 'Gộp ba bên theo dòng',
      doKho: 'HARD', phut: 25,
      khaiNiem: ['three-way merge', 'base/ours/theirs'], tienQuyet: ['mảng', 'vòng lặp'], the: ['javascript', 'git'],
      moTa: `${BAI}<p>Viết ${c('merge3(base, ours, theirs, theirsName = "theirs")')} — ba văn bản có CÙNG số dòng (mô hình đơn giản: chỉ sửa dòng, không thêm/xoá). Với từng dòng: hai bên giống nhau ⇒ lấy dòng đó; chỉ ours đổi so với base ⇒ lấy ours; chỉ theirs đổi ⇒ lấy theirs; cả hai đổi và khác nhau ⇒ xung đột. Các dòng xung đột LIỀN NHAU gộp thành MỘT khối ${c('<<<<<<< ours')} … ${c('=======')} … ${c('>>>>>>> <theirsName>')}. Trả ${c('{ text, conflicts }')} (conflicts = số khối). Số dòng khác nhau ⇒ ném ${c('RangeError("line counts differ")')}.</p>`,
      yeuCau: ['Luật theo base.', 'Gộp dòng xung đột liền nhau.', 'Đếm khối.'],
      dauVao: 'base, ours, theirs: string; theirsName?: string.', dauRa: '{ text, conflicts }.',
      rangBuoc: ['Đây là lý do git cần base: không có nó thì không biết bên nào đã đổi.'],
      viDu: [{ input: 'merge3("a\\nb\\nc", "a\\nB\\nc", "a\\nb\\nC")', output: '{ text: "a\\nB\\nC", conflicts: 0 }', explanation: 'Hai bên sửa hai dòng khác nhau — tự gộp như ở Bước 3 của bài.' }],
      goiY: ['for i: const o = O[i], t = T[i], b = B[i]; if (o === t) take o; else if (o === b) take t; else if (t === b) take o; else conflict', 'Giữ một khối đang mở { ours: [], theirs: [] }; đóng nó khi gặp dòng không xung đột hoặc hết tệp.'],
      khoiDau: { 'main.js': `// Bài 10.3 — gộp ba bên theo dòng
function merge3(base, ours, theirs, theirsName = 'theirs') {
  return { text: ours, conflicts: 0 };   // "giữ của mình" — mất thay đổi của người khác
}
` },
      loiGiai: { 'main.js': `// Bài 10.3 — base cho biết AI đã đổi dòng nào; chỉ khi CẢ HAI đổi khác nhau mới là xung đột
function merge3(base, ours, theirs, theirsName = 'theirs') {
  const B = base.split('\\n'), O = ours.split('\\n'), T = theirs.split('\\n');
  if (B.length !== O.length || B.length !== T.length) throw new RangeError('line counts differ');
  const out = [];
  let open = null;
  let conflicts = 0;
  const close = () => {
    if (!open) return;
    out.push('<<<<<<< ours', ...open.ours, '=======', ...open.theirs, '>>>>>>> ' + theirsName);
    conflicts++;
    open = null;
  };
  for (let i = 0; i < B.length; i++) {
    const b = B[i], o = O[i], t = T[i];
    if (o === t || t === b) { close(); out.push(o); }        // giống nhau, hoặc chỉ ours đổi
    else if (o === b) { close(); out.push(t); }              // chỉ theirs đổi
    else {                                                   // cả hai đổi, khác nhau
      open ??= { ours: [], theirs: [] };
      open.ours.push(o);
      open.theirs.push(t);
    }
  }
  close();
  return { text: out.join('\\n'), conflicts };
}
` },
      giaiThich: `<p>So hai tệp thôi thì không biết dòng khác nhau là do ai sửa. Base (commit chung, Bài 10.3 Bước 3) trả lời câu đó — vì vậy sửa khác dòng thì tự gộp, sửa cùng dòng mới xung đột. Git thật còn xử lý dòng thêm/xoá bằng thuật toán diff, nhưng luật quyết định giống hệt.</p>`,
      loiHayGap: ['Không dùng base — báo xung đột mọi dòng khác nhau.', 'Mỗi dòng một khối.', 'Quên đóng khối cuối.'],
      thamKhao: 'https://en.wikipedia.org/wiki/Merge_(version_control)#Three-way_merge',
      kiem: [
        { moTa: 'Different lines merge cleanly|||Khác dòng thì tự gộp', goi: 'merge3("a\\nb\\nc", "a\\nB\\nc", "a\\nb\\nC")', mongDoi: { text: 'a\nB\nC', conflicts: 0 } },
        { moTa: 'Same change on both sides is not a conflict|||Cùng một thay đổi ở hai bên không xung đột', goi: 'merge3("x\\ny", "x\\nY", "x\\nY")', mongDoi: { text: 'x\nY', conflicts: 0 } },
        { moTa: 'Adjacent conflicting lines form one block|||Các dòng xung đột liền nhau thành một khối', goi: 'merge3("1\\n2\\n3\\n4", "1\\ntwo\\nthree\\n4", "1\\nhai\\nba\\nfour", "origin/main")', mongDoi: { text: '1\n<<<<<<< ours\ntwo\nthree\n=======\nhai\nba\n>>>>>>> origin/main\nfour', conflicts: 1 } },
        { moTa: 'Two separate blocks; line count check|||Hai khối riêng; kiểm số dòng', goi: '[merge3("a\\nb\\nc", "A\\nb\\nC", "α\\nb\\nγ").conflicts, (() => { try { merge3("a", "a\\nb", "a"); } catch (e) { return e.name; } })()]', mongDoi: [2, 'RangeError'] },
      ],
    },
  ],
});
