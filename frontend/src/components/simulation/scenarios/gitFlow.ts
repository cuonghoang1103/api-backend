/**
 * VPS & Docker · Git — bốn vùng chứa, và mọi lệnh chỉ là chuyển file giữa chúng.
 *
 * Git khó không phải vì lệnh khó nhớ, mà vì hầu hết người học chưa bao giờ
 * được chỉ cho thấy BỐN VÙNG CHỨA mà file có thể nằm:
 *
 *   Working tree   — thư mục bạn đang gõ code
 *   Staging area   — "giỏ hàng": những gì SẼ vào commit tới
 *   Local repo     — lịch sử commit trên máy bạn
 *   Remote         — origin trên GitHub
 *
 * Vẽ được bốn vùng đó ra thì mọi lệnh trở nên hiển nhiên: `add` đẩy file từ
 * vùng 1 sang vùng 2, `commit` đóng gói vùng 2 thành một điểm trong vùng 3,
 * `push` gửi vùng 3 lên vùng 4. Và những câu hỏi hay gây bối rối cũng tự trả
 * lời: vì sao sửa file sau khi `add` thì phải `add` lại (bản trong giỏ là bản
 * chụp lúc add), vì sao `commit` xong mà GitHub chưa thấy gì (chưa `push`).
 *
 * Nhánh thứ hai đi vào phần hình học: nhánh chỉ là một CÁI NHÃN trỏ vào một
 * commit, `HEAD` là nhãn cho biết bạn đang đứng ở đâu, và `merge` tạo ra một
 * commit có HAI cha. Hiểu như vậy thì `switch` không còn đáng sợ, vì nó chỉ
 * là di chuyển một cái nhãn.
 */

import { GitBranch } from 'lucide-react';
import type { PanelOp, PanelSpec } from '../panels';
import type { I18nText, Scenario, ScenarioOptions, SimStep } from '../types';

/* ── Mã lệnh ─────────────────────────────────────────────────── */

const BASIC_CMD = [
  '$ git init                 # tạo kho',
  '$ git status               # xem đang có gì',
  '$ git add index.js         # đưa vào giỏ',
  '$ git commit -m "thêm API" # đóng gói giỏ',
  '$ git push origin main     # gửi lên GitHub',
];

const BRANCH_CMD = [
  '$ git switch -c feature    # tạo nhánh + nhảy sang',
  '$ git commit -m "..."      # commit trên feature',
  '$ git stash                # cất việc dở, chưa commit',
  '$ git switch main          # về nhánh chính',
  '$ git merge feature        # nhập hai lịch sử',
  '$ git stash pop            # lấy lại việc đã cất',
];

/* ── Bố cục ──────────────────────────────────────────────────── */

const panels = (opts: ScenarioOptions): PanelSpec[] => [
  {
    id: 'cmd',
    kind: 'code',
    title: { vi: 'Lệnh đang chạy', en: 'The command being run' },
    file: 'terminal',
    x: 0,
    y: 0,
    w: 470,
    h: 236,
    lines: opts.part === 'branch' ? BRANCH_CMD : BASIC_CMD,
  },
  {
    id: 'graph',
    kind: 'tree',
    title:
      opts.part === 'branch'
        ? { vi: 'Đồ thị commit — nhánh chỉ là cái nhãn', en: 'Commit graph — a branch is just a label' }
        : { vi: 'Lịch sử commit trên máy bạn', en: 'Commit history on your machine' },
    hint: { vi: 'commit mới nhất nằm dưới cùng', en: 'newest commit at the bottom' },
    x: 0,
    y: 248,
    w: 470,
    h: 312,
    accent: '#f59e0b',
  },
  {
    id: 'zones',
    kind: 'lanes',
    title: { vi: 'Bốn vùng chứa của Git', en: 'Git’s four places a file can live' },
    hint: { vi: 'mọi lệnh chỉ là chuyển file giữa bốn vùng này', en: 'every command just moves files between these' },
    x: 482,
    y: 0,
    w: 518,
    h: 340,
    accent: '#34d399',
    layout: 'rows',
    lanes: [
      { id: 'work', label: 'Working tree', sub: { vi: 'thư mục bạn đang sửa', en: 'the folder you edit' }, accent: '#94a3b8' },
      { id: 'stage', label: 'Staging', sub: { vi: 'giỏ hàng cho commit tới', en: 'the basket for the next commit' }, accent: '#f59e0b' },
      { id: 'local', label: 'Local repo', sub: { vi: 'lịch sử trên máy bạn', en: 'history on your machine' }, accent: '#34d399' },
      { id: 'remote', label: 'origin', sub: { vi: 'GitHub', en: 'GitHub' }, accent: '#38bdf8' },
    ],
  },
  {
    id: 'out',
    kind: 'log',
    title: { vi: 'Kết quả', en: 'Output' },
    file: 'git',
    x: 482,
    y: 352,
    w: 518,
    h: 208,
    accent: '#38bdf8',
    maxLines: 5,
  },
];

/* ── Tiện ích ────────────────────────────────────────────────── */

type Tone = 'ok' | 'warn' | 'err' | 'muted' | 'info' | 'active';

const lines = (v: number[]): PanelOp => ({ p: 'cmd', op: 'lines', value: v });

const out = (label: string, tone: Tone = 'muted'): PanelOp => ({ p: 'out', op: 'push', item: { label, tone } });

/** Đặt một file/commit vào một trong bốn vùng. */
const put = (lane: string, id: string, label: string, sub: string, tone: Tone = 'info'): PanelOp => ({
  p: 'zones',
  op: 'push',
  lane,
  item: { id, label, sub, tone },
});

/** Lấy phần tử ra khỏi một vùng (nó đã chuyển sang vùng khác). */
const take = (lane: string, n = 1): PanelOp => ({ p: 'zones', op: 'shift', lane, n });

/** Làn đang được chiếu sáng. */
const focus = (lane: string | null): PanelOp => ({ p: 'zones', op: 'active', value: lane });

/** Một commit trong đồ thị. `depth` 0 = nhánh chính, 1 = nhánh phụ. */
const commit = (id: string, label: string, depth: number, sub: string, badge: string, tone: Tone = 'muted'): PanelOp => ({
  p: 'graph',
  op: 'push',
  item: { id, label, depth, sub, badge, tone },
});

const relabel = (id: string, tone: Tone, badge?: string, sub?: string): PanelOp => ({
  p: 'graph',
  op: 'tone',
  key: id,
  tone,
  badge,
  sub,
});

type Push = (
  id: string,
  title: I18nText,
  detail: I18nText,
  duration: number,
  ops: PanelOp[],
  extra?: Partial<SimStep>
) => void;

function collector(): { steps: SimStep[]; push: Push } {
  const steps: SimStep[] = [];
  const push: Push = (id, title, detail, duration, ops, extra = {}) => {
    steps.push({ id, title, detail, kind: 'INTERNAL', duration, ops, ...extra });
  };
  return { steps, push };
}

/* ────────────────────────────────────────────────────────────
   A — LUỒNG CƠ BẢN: FILE ĐI QUA BỐN VÙNG
   ──────────────────────────────────────────────────────────── */

function buildBasic(): SimStep[] {
  const { steps, push } = collector();

  push(
    'init',
    { vi: 'git init — tạo ra vùng thứ ba', en: 'git init — creates the third place' },
    {
      vi: 'Trước khi chạy lệnh này, thư mục của bạn chỉ là một thư mục bình thường. `git init` tạo ra thư mục ẩn `.git`, và chính nó là "local repo" — toàn bộ lịch sử sẽ nằm trong đó. Xoá `.git` là xoá sạch lịch sử, còn file mã nguồn thì vẫn nguyên.',
      en: 'Before this command your folder is just a folder. `git init` creates the hidden `.git` directory, and that directory IS the "local repo" — all history will live inside it. Delete `.git` and you delete the history; your source files remain untouched.',
    },
    2500,
    [lines([1]), focus('local'), out('Initialized empty Git repository in .git/', 'ok')],
    { sfx: 'click' }
  );

  push(
    'untracked',
    { vi: 'Bạn viết code — file nằm ở Working tree', en: 'You write code — the file sits in the working tree' },
    {
      vi: 'File `index.js` mới tạo đang ở vùng thứ nhất và Git gọi nó là *untracked*: Git nhìn thấy nó nhưng chưa theo dõi. `git status` chính là lệnh hỏi "mỗi file hiện đang ở vùng nào" — đó là lý do nó là lệnh nên gõ nhiều nhất khi mới học.',
      en: 'The new `index.js` is in the first place and Git calls it *untracked*: Git can see it but is not tracking it. `git status` is precisely the question "which place is each file in right now" — which is why it is the command worth typing most while learning.',
    },
    2700,
    [
      lines([2]),
      focus('work'),
      put('work', 'f1', 'index.js', 'chưa theo dõi', 'warn'),
      out('Untracked files: index.js', 'warn'),
    ],
    { sfx: 'blip' }
  );

  push(
    'add',
    { vi: 'git add — chuyển sang giỏ hàng', en: 'git add — move it into the basket' },
    {
      vi: 'File chuyển từ vùng 1 sang vùng 2. Điểm quan trọng ít ai nói: Git chụp lại NỘI DUNG file tại đúng thời điểm bạn `add`. Sửa tiếp file sau đó thì bản trong giỏ vẫn là bản cũ — và `git status` sẽ hiện file đó ở CẢ HAI vùng cùng lúc. Đây là nguồn gốc của câu "tôi đã add rồi mà sao vẫn còn ở đó".',
      en: 'The file moves from place 1 to place 2. The part rarely mentioned: Git snapshots the file’s CONTENT at the moment you `add`. Edit it afterwards and the basket still holds the old version — `git status` will then list that file in BOTH places at once. This is the source of "but I already added it".',
    },
    3000,
    [
      lines([3]),
      focus('stage'),
      take('work'),
      put('stage', 'f2', 'index.js', 'ảnh chụp lúc add', 'info'),
      out('Changes to be committed: new file: index.js', 'ok'),
    ],
    {
      sfx: 'swoosh',
      teachingNote: {
        vi: 'Hỏi lớp: add xong rồi sửa tiếp file thì `git status` hiện file đó mấy lần?',
        en: 'Ask the class: after adding, if you edit the file again, how many times does `git status` list it?',
      },
    }
  );

  push(
    'commit',
    { vi: 'git commit — đóng gói giỏ thành một điểm lịch sử', en: 'git commit — seal the basket into a point in history' },
    {
      vi: 'Commit lấy MỌI thứ đang ở trong giỏ (và chỉ những thứ đó) rồi đóng thành một ảnh chụp bất biến, có mã băm riêng. File rời khỏi giỏ, giỏ trống trở lại. Đây cũng là lý do `git add .` một cách vô thức lại nguy hiểm: bạn đóng gói cả những thứ mình không định đưa vào.',
      en: 'A commit takes EVERYTHING in the basket (and only that) and seals it into an immutable snapshot with its own hash. The file leaves the basket, and the basket is empty again. This is also why a reflexive `git add .` is risky: you seal in things you never meant to include.',
    },
    3000,
    [
      lines([4]),
      focus('local'),
      take('stage'),
      put('local', 'f3', 'a13f2c', 'thêm API', 'ok'),
      commit('c1', 'a13f2c', 0, 'thêm API', 'HEAD → main', 'ok'),
      out('[main a13f2c] thêm API · 1 file changed', 'ok'),
    ],
    { sfx: 'success' }
  );

  push(
    'still-local',
    { vi: 'Commit xong nhưng GitHub vẫn chưa thấy gì', en: 'Committed — and GitHub still knows nothing' },
    {
      vi: 'Đây là chỗ vấp phổ biến nhất của người mới. Commit chỉ ghi vào `.git` TRÊN MÁY BẠN. Vùng thứ tư vẫn trống trơn. Nếu ổ cứng hỏng lúc này thì công sức mất sạch, dù bạn đã commit cẩn thận — commit không phải là sao lưu.',
      en: 'This is the most common stumble for beginners. A commit writes only into `.git` ON YOUR MACHINE. The fourth place is still empty. If the disk dies right now the work is gone, however carefully you committed — a commit is not a backup.',
    },
    2800,
    [focus('remote'), out('origin: (chưa có gì)', 'warn')],
    {
      sfx: 'buzz',
      teachingNote: {
        vi: 'Nhấn: commit ≠ sao lưu. Chỉ khi push thì công việc mới rời khỏi máy bạn.',
        en: 'Stress: commit ≠ backup. Only push moves the work off your machine.',
      },
    }
  );

  push(
    'push',
    { vi: 'git push — gửi commit lên vùng thứ tư', en: 'git push — send commits to the fourth place' },
    {
      vi: '`push` chuyển những commit mà origin chưa có lên GitHub. Nó gửi CẢ COMMIT, không gửi file rời — nên lịch sử ở hai nơi giống hệt nhau. Từ giờ đồng nghiệp `git pull` là nhận đúng những gì bạn có, kèm nguyên vẹn thông tin ai commit, lúc nào, kèm lời nhắn gì.',
      en: 'A push sends the commits origin does not yet have. It ships COMMITS, not loose files — so the history is identical in both places. From now on a colleague’s `git pull` gets exactly what you have, along with who committed, when, and with what message.',
    },
    2900,
    [
      lines([5]),
      focus('remote'),
      put('remote', 'f4', 'a13f2c', 'origin/main', 'info'),
      relabel('c1', 'ok', 'HEAD → main, origin/main'),
      out('To github.com:...  main → main', 'ok'),
    ],
    { sfx: 'ping' }
  );

  push(
    'recap',
    { vi: 'Toàn bộ Git cơ bản gói trong một câu', en: 'All of basic Git in one sentence' },
    {
      vi: 'Working tree → (add) → Staging → (commit) → Local repo → (push) → origin. Mỗi lệnh là một mũi tên. Khi nào bối rối không biết mình đang ở đâu, gõ `git status` — nó sẽ nói cho bạn biết file đang nằm ở vùng nào, và mũi tên tiếp theo cần đi là gì.',
      en: 'Working tree → (add) → Staging → (commit) → Local repo → (push) → origin. Each command is one arrow. Whenever you lose track of where you are, type `git status` — it tells you which place each file is in and which arrow comes next.',
    },
    2900,
    [lines([]), focus(null)],
    { sfx: 'lock' }
  );

  return steps;
}

/* ────────────────────────────────────────────────────────────
   B — NHÁNH, MERGE VÀ STASH
   ──────────────────────────────────────────────────────────── */

function buildBranch(): SimStep[] {
  const { steps, push } = collector();

  push(
    'start',
    { vi: 'Điểm xuất phát: hai commit trên main', en: 'Starting point: two commits on main' },
    {
      vi: '`main` không phải là "nhánh gốc" theo nghĩa đặc biệt nào cả — nó chỉ là một cái NHÃN đang trỏ vào commit mới nhất. `HEAD` là nhãn thứ hai, cho biết bạn đang đứng ở đâu. Nắm được "nhãn trỏ vào commit" là nắm được toàn bộ phần còn lại.',
      en: '`main` is not a "root branch" in any special sense — it is just a LABEL pointing at the newest commit. `HEAD` is a second label saying where you currently stand. Grasp "labels point at commits" and the rest follows.',
    },
    2600,
    [
      commit('g0', 'root', 0, 'khởi tạo', '', 'muted'),
      commit('g1', 'a13f2c', 0, 'thêm API', 'HEAD → main', 'ok'),
      focus('local'),
      put('local', 'b0', 'main', 'nhãn trỏ a13f2c', 'ok'),
      out('$ git log --oneline --graph', 'muted'),
    ],
    { sfx: 'click' }
  );

  push(
    'branch',
    { vi: 'git switch -c feature — thêm một cái nhãn nữa', en: 'git switch -c feature — add one more label' },
    {
      vi: 'Tạo nhánh KHÔNG sao chép file, không tốn dung lượng, không mất thời gian dù kho có mười nghìn commit. Nó chỉ ghi thêm một cái nhãn `feature` trỏ vào đúng commit bạn đang đứng, rồi chuyển `HEAD` sang nhãn đó. Đây là lý do nhánh trong Git rẻ tới mức nên tạo thoải mái.',
      en: 'Creating a branch copies no files, costs no space and takes no time even in a repo with ten thousand commits. It just writes one more label `feature` pointing at the commit you are on, then moves `HEAD` to it. That is why branches in Git are cheap enough to create freely.',
    },
    2900,
    [
      lines([1]),
      relabel('g1', 'ok', 'main, feature ← HEAD'),
      put('local', 'b1', 'feature', 'cùng trỏ a13f2c', 'info'),
      out('Switched to a new branch ‘feature’', 'ok'),
    ],
    { sfx: 'blip' }
  );

  push(
    'work',
    { vi: 'Commit trên feature — hai nhãn tách nhau ra', en: 'Commit on feature — the labels part ways' },
    {
      vi: 'Commit mới được tạo với cha là `a13f2c`, và nhãn `feature` nhích theo. Nhãn `main` đứng yên — nó vẫn trỏ vào commit cũ. Chính khoảnh khắc hai nhãn trỏ vào hai commit khác nhau là lúc "nhánh" thật sự tồn tại.',
      en: 'A new commit is created with `a13f2c` as its parent, and the `feature` label follows it. The `main` label stays put, still pointing at the old commit. The moment the two labels point at different commits is when a "branch" truly exists.',
    },
    2800,
    [
      lines([2]),
      commit('g2', '7c91ab', 1, 'thêm màn hình mới', 'feature ← HEAD', 'info'),
      relabel('g1', 'muted', 'main'),
      out('[feature 7c91ab] thêm màn hình mới', 'ok'),
    ],
    { sfx: 'swoosh' }
  );

  push(
    'stash',
    { vi: 'git stash — cất việc đang dở, chưa muốn commit', en: 'git stash — shelve work you are not ready to commit' },
    {
      vi: 'Bạn đang sửa dở một file thì cần nhảy sang nhánh khác gấp. Commit nửa vời thì bẩn lịch sử, mà mang theo file đang sửa thì dễ lẫn. `stash` cất phần thay đổi vào một chỗ riêng — không phải commit, không thuộc nhánh nào — và trả Working tree về sạch sẽ.',
      en: 'You are mid-edit and suddenly need to jump to another branch. Committing half-done work dirties the history, and carrying the edits along invites confusion. `stash` shelves the changes somewhere separate — not a commit, not on any branch — and returns the working tree to clean.',
    },
    3000,
    [
      lines([3]),
      focus('work'),
      put('work', 'w1', 'stash@{0}', 'sửa dở, đã cất', 'warn'),
      out('Saved working directory and index state', 'warn'),
    ],
    { sfx: 'lock' }
  );

  push(
    'switch',
    { vi: 'git switch main — HEAD di chuyển, file đổi theo', en: 'git switch main — HEAD moves and the files follow' },
    {
      vi: '`switch` làm hai việc: chuyển `HEAD` sang nhãn `main`, rồi thay nội dung Working tree cho khớp với commit mà nhãn đó trỏ tới. Màn hình mới bạn vừa viết BIẾN MẤT khỏi thư mục — nhưng nó không mất, nó vẫn nằm trong commit `7c91ab` trên nhánh kia.',
      en: '`switch` does two things: it moves `HEAD` to the `main` label, then rewrites the working tree to match the commit that label points at. The new screen you just wrote DISAPPEARS from the folder — but it is not lost, it still lives in commit `7c91ab` on the other branch.',
    },
    3000,
    [
      lines([4]),
      relabel('g1', 'ok', 'main ← HEAD'),
      relabel('g2', 'info', 'feature'),
      out('Switched to branch ‘main’', 'ok'),
    ],
    {
      sfx: 'swoosh',
      teachingNote: {
        vi: 'Trấn an lớp: file "biến mất" khi switch là bình thường — chúng nằm trong commit của nhánh kia.',
        en: 'Reassure the class: files "vanishing" on switch is normal — they live in the other branch’s commit.',
      },
    }
  );

  push(
    'merge',
    { vi: 'git merge feature — commit có HAI cha', en: 'git merge feature — a commit with TWO parents' },
    {
      vi: 'Git tìm commit tổ tiên chung của hai nhánh, gộp thay đổi hai bên, rồi tạo một commit mới có HAI cha. Nếu hai bên sửa cùng một dòng thì Git dừng lại và báo xung đột — nó không đoán bừa. Lúc đó bạn sửa tay, `add` file đã sửa, rồi `commit` để hoàn tất.',
      en: 'Git finds the common ancestor of both branches, combines the changes from each side, and creates a new commit with TWO parents. If both sides edited the same line, Git stops and reports a conflict — it never guesses. You then fix it by hand, `add` the resolved file, and `commit` to finish.',
    },
    3200,
    [
      lines([5]),
      commit('g3', 'merge', 0, 'gộp feature vào main', 'HEAD → main', 'ok'),
      relabel('g2', 'muted', 'feature'),
      out('Merge made by the ‘ort’ strategy.', 'ok'),
    ],
    { sfx: 'success' }
  );

  push(
    'pop',
    { vi: 'git stash pop — lấy lại việc đã cất', en: 'git stash pop — take the shelved work back' },
    {
      vi: 'Phần sửa dở quay lại Working tree, đúng như lúc bạn cất đi. `pop` lấy ra rồi xoá khỏi chồng stash; `apply` thì lấy ra mà vẫn giữ lại. Lưu ý stash là của MÁY BẠN — nó không được `push` lên đâu cả, nên đừng dùng nó để cất việc quan trọng qua đêm.',
      en: 'The unfinished edits return to the working tree exactly as you left them. `pop` takes and removes them from the stash stack; `apply` takes them while keeping a copy. Note the stash is LOCAL — it is never pushed anywhere, so do not use it to park important work overnight.',
    },
    3000,
    [
      lines([6]),
      take('work'),
      put('work', 'w2', 'file đang sửa', 'đã lấy lại', 'ok'),
      out('Dropped refs/stash@{0}', 'ok'),
    ],
    { sfx: 'ping' }
  );

  push(
    'recap',
    { vi: 'Nhánh là nhãn, HEAD là chỗ bạn đứng', en: 'A branch is a label, HEAD is where you stand' },
    {
      vi: 'Nhớ hai câu đó thì `switch`, `merge`, thậm chí `reset` sau này đều hết đáng sợ: chúng chỉ là di chuyển nhãn và cập nhật Working tree cho khớp. Và vì commit là bất biến, gần như mọi thao tác đều đảo ngược được — `git reflog` lưu lại từng bước HEAD đã đi qua, kể cả những bước bạn tưởng đã mất.',
      en: 'Hold those two sentences and `switch`, `merge`, even `reset` later all stop being scary: they only move labels and update the working tree to match. And because commits are immutable, almost everything is reversible — `git reflog` records every position HEAD has occupied, including the ones you thought were lost.',
    },
    3000,
    [lines([]), focus(null)],
    { sfx: 'lock' }
  );

  return steps;
}

/* ── Kịch bản ────────────────────────────────────────────────── */

export const gitFlowScenario: Scenario = {
  id: 'git-flow',
  name: { vi: 'Git — bốn vùng chứa và cái nhãn tên nhánh', en: 'Git — four places and a branch label' },
  tagline: {
    vi: 'File trong Git luôn nằm ở một trong bốn vùng: Working tree, Staging, Local repo, origin. Mọi lệnh chỉ là một mũi tên giữa chúng — và nhánh chẳng qua là cái nhãn trỏ vào một commit.',
    en: 'A file in Git always sits in one of four places: working tree, staging, local repo, origin. Every command is just an arrow between them — and a branch is nothing but a label pointing at a commit.',
  },
  icon: GitBranch,
  accent: '#34d399',
  group: 'devops',
  lesson: {
    course: 'nodejs',
    code: '17.6',
    slug: 'nodejs-17-6-deploy-hong-quay-lui',
    title: { vi: 'Khi deploy nói dối: build cũ, smoke test, quay lui', en: 'When the deploy lies: stale builds, smoke tests, rollback' },
  },
  nodes: [],
  edges: [],
  panels,
  options: [
    {
      id: 'part',
      label: { vi: 'Phần', en: 'Part' },
      defaultValue: 'basic',
      choices: [
        {
          value: 'basic',
          label: 'add · commit · push',
          fullLabel: 'File đi qua bốn vùng',
          color: '#34d399',
          hint: { vi: 'vì sao commit xong GitHub chưa thấy', en: 'why GitHub sees nothing after a commit' },
        },
        {
          value: 'branch',
          label: 'branch · merge · stash',
          fullLabel: 'Nhánh chỉ là một cái nhãn',
          color: '#f59e0b',
          hint: { vi: 'switch làm file "biến mất"', en: 'why switch makes files "vanish"' },
        },
      ],
    },
  ],
  build: (opts: ScenarioOptions): SimStep[] => (opts.part === 'branch' ? buildBranch() : buildBasic()),
};
