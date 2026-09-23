/**
 * Git & GitHub · Deck git-02 — Chương 2: Đọc lịch sử — khảo cổ trên chính mã của bạn.
 *
 * Mọi output terminal trên slide là output THẬT (git 2.51) của kho thử dựng bằng một
 * script trong thư mục scratch (tác giả/ngày cố định ⇒ mã băm tái tạo được):
 *   23 commit · 3 tác giả + dependabot · tag v1.0.0 · nhánh feature/login (đã merge --no-ff)
 *   · nhánh feature/avatar (chưa merge) · đổi tên auth/login.js → src/services/auth.js
 *   · commit "chore: run prettier" thụt lề lại cả file · lỗi cấy ở 8a4ce74.
 * Dòng dài chỉ được CẮT BỚT (đánh dấu "# …"), không sửa chữ.
 */
import { S, cover, cards, box, steps, table, vs, flow, two, list, code, mindmap, graph, term } from './_git-chung.mjs';

export const deck = { key: 'git-02', code: 'GIT · CHƯƠNG 2', title: 'Đọc lịch sử: khảo cổ trên chính mã của bạn', sub: 'Git & GitHub · Chương 2' };

/** Terminal chữ nhỏ hơn (14px) cho output dài ~70 ký tự đặt trong nửa slide. */
const small = (html, fs = 14) => { const k = 'tsm' + String(fs).replace('.', '_'); return `<style>.${k} .g-term pre{font-size:${fs}px;line-height:1.45}</style><div class="${k}">${html}</div>`; };

/**
 * Hình bisect: dải 15 commit theo cha-thứ-nhất từ v1.0.0 (tốt) tới HEAD (hỏng),
 * mỗi hàng là một bước — đúng 4 bước mà `git bisect run` đã đi trong kho thử.
 */
const bisectSvg = () => {
  const ids = ['23e0', '8a67', 'd0c0', '31f9', 'f649', 'e9f1', '8a4c', 'e0fe', 'e8ce', '2f56', 'cb5e', '7160', '7e6d', 'b11c', '8d19'];
  // [khoảng còn lại: lo..hi (chỉ số), commit được kiểm, kết quả]
  const rows = [
    [1, 14, 8, 'bad', 'Bước 1'], [1, 8, 4, 'good', 'Bước 2'], [5, 8, 6, 'bad', 'Bước 3'], [5, 6, 5, 'good', 'Bước 4'],
  ];
  const W = 1168, x0 = 130, dx = 66, r = 21, top = 46, dy = 92;
  const X = (i) => x0 + i * dx;
  let s = `<svg class="c-svg" viewBox="0 0 ${W} 490" width="${W}" height="490">`;
  rows.forEach(([lo, hi, t, res, lab], k) => {
    const y = top + k * dy;
    s += `<text x="14" y="${y + 6}" font-size="19" font-weight="700" fill="#e6edf3">${lab}</text>`;
    s += `<rect x="${X(lo) - r - 8}" y="${y - r - 8}" width="${X(hi) - X(lo) + 2 * r + 16}" height="${2 * r + 16}" rx="14" fill="rgba(255,194,51,.08)" stroke="rgba(255,194,51,.55)" stroke-width="1.5"/>`;
    s += `<line x1="${X(0)}" y1="${y}" x2="${X(14)}" y2="${y}" stroke="#30363d" stroke-width="3"/>`;
    ids.forEach((id, i) => {
      const inR = i >= lo && i <= hi;
      const isT = i === t;
      const c = isT ? (res === 'bad' ? '#ff5c6c' : '#3fb950') : i === 0 ? '#3fb950' : i === 14 ? '#ff5c6c' : inR ? '#ffc233' : '#484f58';
      s += `<circle cx="${X(i)}" cy="${y}" r="${r}" fill="#0d1117" stroke="${c}" stroke-width="${isT ? 5 : 3}"/>`;
      s += `<text x="${X(i)}" y="${y + 5}" text-anchor="middle" font-family="SF Mono,Menlo,monospace" font-size="13" font-weight="700" fill="${inR || isT || i === 0 || i === 14 ? '#fff' : '#6e7681'}">${id}</text>`;
    });
    const tx = X(t);
    s += `<text x="${tx}" y="${y - r - 13}" text-anchor="middle" font-size="15" font-weight="700" fill="${res === 'bad' ? '#ff5c6c' : '#3fb950'}">${res === 'bad' ? 'kiểm: HỎNG' : 'kiểm: TỐT'}</text>`;
    s += `<text x="${X(14) + 34}" y="${y + 6}" font-size="15" fill="#9da7b3">còn ${hi - lo + 1}</text>`;
  });
  const yf = top + 4 * dy;
  s += `<text x="14" y="${yf + 6}" font-size="19" font-weight="700" fill="#ff5c6c">Kết quả</text>`;
  s += `<circle cx="${X(6)}" cy="${yf}" r="${r + 6}" fill="#ff5c6c" opacity=".35"/>`;
  s += `<circle cx="${X(6)}" cy="${yf}" r="${r}" fill="#0d1117" stroke="#ff5c6c" stroke-width="5"/>`;
  s += `<text x="${X(6)}" y="${yf + 5}" text-anchor="middle" font-family="SF Mono,Menlo,monospace" font-size="13" font-weight="700" fill="#fff">8a4c</text>`;
  s += `<text x="${X(6) + 40}" y="${yf - 2}" font-family="SF Mono,Menlo,monospace" font-size="17" fill="#ffc233">8a4ce74… is the first bad commit</text>`;
  s += `<text x="${X(6) + 40}" y="${yf + 22}" font-size="15" fill="#9da7b3">4 bước cho 16 commit · hình lược 2 commit của nhánh feature/login đã merge</text>`;
  s += `<text x="${X(0)}" y="${top - r - 13}" text-anchor="middle" font-size="14" font-weight="700" fill="#3fb950">v1.0.0</text>`;
  s += `<text x="${X(14)}" y="${top - r - 13}" text-anchor="middle" font-size="14" font-weight="700" fill="#ff5c6c">HEAD</text>`;
  return s + `</svg>`;
};

/** Hình "khoảng" dùng chung cho slide log A..B và diff A...B. */
const forkGraph = (mode) => graph({
  w: 1100, h: 304, y0: 94, dx: 200, dy: 104, r: 36,
  lanes: [{ lane: 0, n: 'main', c: 'git' }, { lane: 1, n: 'avatar', c: 'blu' }],
  commits: [
    { id: '7160777', x: 0, t: mode === 'diff' ? 'tổ tiên chung' : 'docs: changelog', hl: mode === 'diff', c: mode === 'diff' ? 'vio' : undefined },
    { id: '7e6d3af', x: 1, p: ['7160777'], t: 'JWT 24h', c: mode === 'log' ? 'amb' : undefined },
    { id: 'b11c84a', x: 2, p: ['7e6d3af'], t: '/health', c: mode === 'log' ? 'amb' : undefined },
    { id: '8d19d92', x: 3, p: ['b11c84a'], t: 'changelog', c: mode === 'log' ? 'amb' : undefined, hl: mode === 'diff' },
    { id: 'c5ad2e8', x: 1, lane: 1, p: ['7160777'], t: 'avatar helper', c: mode === 'log' ? 'grn' : 'blu' },
    { id: '931e710', x: 2, lane: 1, p: ['c5ad2e8'], t: 'prefer upload', c: mode === 'log' ? 'grn' : 'blu', hl: mode === 'diff' },
  ],
  refs: [{ to: '8d19d92', n: 'main' }, { to: '931e710', n: 'feature/avatar', side: 'down' }],
});

export const slides = S([
  cover({ t: 'Chương 2 — Đọc lịch sử', sub: 'git log như truy vấn · show &amp; diff · blame &amp; cuốc chim · bisect · một cuộc điều tra thật', chap: 'CHƯƠNG 2' }),

  /* 2 */
  { t: 'Bản đồ chương', body: mindmap('Đọc lịch sử', 'lịch sử là tài liệu chi tiết nhất bạn có', [
    { t: '2.1 git log', d: 'lọc theo đường dẫn, tác giả, ngày · A..B · vẽ đồ thị', c: 'blu' },
    { t: '2.2 show &amp; diff', d: 'một commit trọn vẹn · file ở quá khứ · hai chấm/ba chấm', c: 'grn' },
    { t: '2.3 blame &amp; cuốc chim', d: 'dòng còn → blame · mã đã mất → -S / -G', c: 'amb' },
    { t: '2.4 bisect', d: 'tìm nhị phân: 1.000 commit ≈ 10 bước', c: 'pnk' },
    { t: '2.5 Điều tra thật', d: 'grep → blame → show → -S → bisect', c: 'vio' },
  ]) },

  /* 3 — 2.1 */
  { t: 'git log: nén thành một dòng, rồi LỌC', body: two(
    term(['$ git log --oneline -5', '8d19d92 docs: changelog for /health', 'b11c84a feat(api): add /health route', '7e6d3af chore(config): default JWT_EXPIRES_IN to 24h', '7160777 docs: start a changelog', "cb5ea68 Merge branch 'feature/login'",
      '$ git log --oneline --author=Binh --grep=docs', '8d19d92 docs: changelog for /health', '7160777 docs: start a changelog', 'e9f1578 docs: how to run the server', '8a674b5 docs: add README section on auth',
      '$ git log --oneline --since=2026-09-01 -- src/services/', '2f569a3 chore: run prettier on everything'], { title: 'output thật — git 2.51' }),
    `${table(['Bộ lọc', 'Trả lời câu'], [
      ['<code>-- &lt;đường dẫn&gt;</code>', 'Ai đã chạm file/thư mục này?'],
      ['<code>--author=</code>', 'Người này đã làm gì? (khớp <b>chuỗi con</b>)'],
      ['<code>--since / --until</code>', 'Trong khoảng thời gian nào?'],
      ['<code>--grep=</code>', 'Lời nhắn có chữ này không?'],
      ['<code>-S / -G</code>', 'Nội dung thay đổi có chuỗi này? (bài 2.3)'],
    ], { sm: true })}
    ${box('warn', '<code>--author=an</code> khớp 22/23 commit trong kho thử: “Van <b>An</b>”, “Tr<b>an</b>”, “Ho<b>an</b>g” đều chứa “an”. Neo bằng email.')}`, 'l') },

  /* 4 — 2.1 */
  { t: 'Hai chấm: “cái gì có ở B mà A không có”', body: `
    ${forkGraph('log')}
    ${table(['Lệnh', 'Output thật', 'Nghĩa là'], [
      ['<code>git log --oneline main..feature/avatar</code>', '+931e710, c5ad2e8', 'Nhánh của tôi thêm gì lên main'],
      ['<code>git log --oneline feature/avatar..main</code>', '!8d19d92, b11c84a, 7e6d3af', 'main đã đi tiếp những gì mà tôi chưa có'],
      ['<code>git log --oneline main...feature/avatar</code>', 'cả 5 commit trên', 'Ba chấm: riêng của MỖI bên'],
    ], { sm: true })}
    ${box('tip', 'Trước mỗi lần push: <code>git log origin/main..main</code> = “tôi sắp đẩy những gì?”')}` },

  /* 5 — 2.1 */
  { t: 'log --graph: đọc hình dạng lịch sử bằng chữ', body: two(
    small(term(['$ git log --oneline --graph --all --decorate -10', '* 8d19d92 (HEAD -> main) docs: changelog for /health', '* b11c84a feat(api): add /health route', '* 7e6d3af chore(config): default JWT_EXPIRES_IN to 24h', '| * 931e710 (feature/avatar) feat(profile): prefer uploaded avatar', '| * c5ad2e8 feat(profile): add avatar URL helper', '|/', '* 7160777 docs: start a changelog', "*   cb5ea68 Merge branch 'feature/login'", '|\\', '| * ea815ae (feature/login) feat(ui): validate email on the login form', '| * eec9dc4 feat(ui): add login form', '|/', '* 2f569a3 chore: run prettier on everything'], { title: 'output thật' })),
    `${graph({ w: 520, h: 390, y0: 110, dx: 62, dy: 100, x0: 36, r: 20, commits: [
      { id: '2f56', x: 0 },
      { id: 'eec9', x: 1, lane: 2, p: ['2f56'] }, { id: 'ea81', x: 2, lane: 2, p: ['eec9'] },
      { id: 'cb5e', x: 3, p: ['2f56', 'ea81'], star: true },
      { id: '7160', x: 4, p: ['cb5e'] },
      { id: 'c5ad', x: 5, lane: 1, p: ['7160'] }, { id: '931e', x: 6, lane: 1, p: ['c5ad'] },
      { id: '7e6d', x: 5, p: ['7160'] }, { id: 'b11c', x: 6, p: ['7e6d'] }, { id: '8d19', x: 7, p: ['b11c'], hl: true },
    ], refs: [{ to: '8d19', n: 'main' }, { to: '8d19', n: 'HEAD', k: 'head' }, { to: '931e', n: 'feature/avatar', side: 'down' }, { to: 'ea81', n: 'feature/login', side: 'down' }] })}
    ${list(['<code>*</code> = một commit · <code>|/</code> = chỗ rẽ nhánh', '<code>|\\</code> = merge: hai dòng lịch sử nhập lại', 'Thiếu <code>--all</code> thì nhánh avatar biến mất khỏi hình'])}`, 'l') },

  /* 6 — 2.2 */
  { t: 'git show: một commit, trọn vẹn', body: two(
    small(term(['$ git show 8a4ce74', 'commit 8a4ce74a20d3fc9bd4189ae2bbed8be55cc39a19', 'Author: Nguyen Van An <an@example.com>', 'Date:   Thu Aug 27 16:09:41 2026 +0700', '',
      '    fix(auth): add /auth/refresh so 24h sessions stop dying silently', '',
      'diff --git a/src/services/auth.js b/src/services/auth.js', 'index fd13139..fe3c882 100644', '--- a/src/services/auth.js', '+++ b/src/services/auth.js', '@@ -4,14 +4,20 @@ function now() {',
      '# … (cắt bớt)', '+ +// ignoreExpiration: an expired token may be exchanged for a fresh one', '  function refreshToken(token) {',
      "! -    if (token.exp < now()) throw new Error('refresh token expired');", '= +    const payload = verify(token, { ignoreExpiration: true });'], { title: 'output thật' }), 13.5),
    `${steps([['Siêu dữ liệu', 'ai · khi nào · mã băm đầy đủ'], ['Lời nhắn', 'VÌ SAO — thứ blame không cho bạn'], ['Diff', 'CÁI GÌ: dòng đỏ bị bỏ, dòng xanh được thêm']])}
    ${box('tip', 'Thêm <code>--stat</code> → chỉ danh sách file.<br>Thêm <code>-- &lt;file&gt;</code> → chỉ phần của một file.')}`, 'l2') },

  /* 7 — 2.2 */
  { t: 'commit:đường-dẫn — đọc file như nó TỪNG có', body: two(
    small(term(['$ git show v1.0.0:src/services/auth.js', "const config = require('../config');", '# … (cắt bớt)', '// old mobile app (v1) still sends ?token= in the query string', 'function legacyAuth(req) {', '    return req.query.token ? { sub: req.query.token } : null;', '}', '', 'function refreshToken(token) {', "+     if (token.exp < now()) throw new Error('refresh token expired');", '    return { sub: token.sub, exp: now() + config.JWT_EXPIRES_IN };', '}',
      '$ git grep -n legacyAuth v1.0.0', 'v1.0.0:src/services/auth.js:13:function legacyAuth(req) {', 'v1.0.0:src/services/auth.js:22:module.exports = { now, login, legacyAuth, refreshToken };', '$ git status -s', '# (trống — thư mục làm việc không bị đụng tới)'], { title: 'output thật' })),
    `${list(['<code>HEAD~10:src/app.js</code> — mười commit trước', '<code>v1.0.0:package.json</code> — thư viện ở bản phát hành', '<code>main:README.md</code> — bản trên nhánh khác', '<code>… &gt; /tmp/cu.js</code> — lưu ra để so'])}
    ${box('good', 'Không stash, không đổi nhánh, không checkout. Hỏi “hồi v1.0.0 hàm này kiểm hạn token thế nào?” — trả lời trong 2 giây: <b>có kiểm</b>.')}`, 'l') },

  /* 8 — 2.2 */
  { t: 'diff hai chấm vs ba chấm — cái bẫy của nhánh sống lâu', body: `
    ${forkGraph('diff')}
    ${two(
      term(['$ git diff --stat main feature/avatar', ' .env.example  | 1 -', ' CHANGELOG.md  | 1 -', ' src/avatar.js | 4 ++++', ' src/index.js  | 1 -'], { title: 'đầu mút ↔ đầu mút: 8d19d92 ↔ 931e710' }),
      term(['$ git diff --stat main...feature/avatar', ' src/avatar.js | 4 ++++', ' 1 file changed, 4 insertions(+)', '# chỉ việc của nhánh — giống tab', '# “Files changed” của pull request'], { title: 'tổ tiên chung ↔ đầu nhánh: 7160777 ↔ 931e710' }))}` },

  /* 9 — 2.3 */
  { t: 'git blame: mỗi dòng trỏ về một commit', body: `
    ${small(term(['$ git blame -L 17,21 src/services/auth.js', '8a4ce74a (Nguyen Van An 2026-08-27 16:09:41 +0700 17) // ignoreExpiration: an expired token may be exchanged for a fresh one', '23e0aacc (Nguyen Van An 2026-08-15 18:15:59 +0700 18) function refreshToken(token) {', '+ 2f569a3e (Hoang Cuong   2026-09-02 19:16:32 +0700 19)   const payload = verify(token, { ignoreExpiration: true });', '+ 2f569a3e (Hoang Cuong   2026-09-02 19:16:32 +0700 20)   return { sub: payload.sub, exp: now() + config.JWT_EXPIRES_IN };', '23e0aacc (Nguyen Van An 2026-08-15 18:15:59 +0700 21) }'], { title: 'output thật' }), 14)}
    ${cards([
      { ic: '🔑', t: 'Cột 1: mã băm', d: 'commit chạm dòng này GẦN NHẤT', c: 'git' },
      { ic: '👤', t: 'Cột 2–3: ai, khi nào', d: 'tác giả + thời điểm của commit đó', c: 'blu' },
      { ic: '🔢', t: 'Cột 4: số dòng', d: '<code>-L 17,21</code> hoặc <code>-L :refreshToken</code> để thu hẹp', c: 'grn' },
      { ic: '➡️', t: 'Nước đi tiếp theo', d: '<code>git show &lt;mã băm&gt;</code> — đọc VÌ SAO', c: 'amb' },
    ], 4)}` },

  /* 10 — 2.3 */
  { t: 'Commit prettier che mất tác giả thật — -w nhìn xuyên qua', body: `
    ${term(['$ git blame -s -L 19,20 src/services/auth.js', '+ 2f569a3e 19)   const payload = verify(token, { ignoreExpiration: true });', '+ 2f569a3e 20)   return { sub: payload.sub, exp: now() + config.JWT_EXPIRES_IN };', '# 2f569a3 = "chore: run prettier on everything" — chỉ đổi thụt lề 4 → 2 dấu cách',
      '$ git blame -s -w -L 19,20 src/services/auth.js', '= 8a4ce74a 19)   const payload = verify(token, { ignoreExpiration: true });', '= 8a4ce74a 20)   return { sub: payload.sub, exp: now() + config.JWT_EXPIRES_IN };', '# 8a4ce74 = "fix(auth): add /auth/refresh…" — commit thật sự viết ra dòng này'], { title: 'output thật' })}
    ${cards([
      { t: '-w', d: 'bỏ qua thay đổi chỉ có khoảng trắng', c: 'grn' },
      { t: '-M', d: 'dòng dời chỗ TRONG một file', c: 'blu' },
      { t: '-C', d: 'dòng chép/dời từ file khác', c: 'vio' },
      { t: '.git-blame-ignore-revs', d: 'danh sách commit định dạng bỏ qua vĩnh viễn — GitHub cũng đọc', c: 'amb' },
    ], 4)}` },

  /* 11 — 2.3 */
  { t: 'Cái cuốc chim: tìm mã ĐÃ BIẾN MẤT', body: `
    ${two(
      term(['$ git grep -n legacyAuth', '# (không có gì — hàm đã bị xoá)', "$ git log -S'legacyAuth' --oneline", 'd0c0e0e refactor(auth): delete the legacy auth path', 'b76a82c feat(auth): add legacyAuth fallback for old clients', '# sinh ra ở b76a82c · bị xoá ở d0c0e0e'], { title: 'output thật' }),
      table(['Cờ', 'Khớp commit khi…', 'JWT_EXPIRES_IN'], [
        ['<code style="white-space:nowrap">-S"chuỗi"</code>', 'SỐ LẦN xuất hiện thay đổi (sinh ra / bị xoá)', '+3 commit'],
        ['<code style="white-space:nowrap">-G"regex"</code>', 'diff có một dòng khớp — kể cả dòng chỉ bị sửa', '!5 commit (thêm prettier + fix)'],
      ], { sm: true }), 'l')}
    ${box('bad', '<b>Bẫy đã kiểm thật:</b> gõ hai lần <code>-S"password" -S"api_key"</code> thì Git lặng lẽ <b>chỉ dùng cái cuối</b>. Muốn tìm nhiều chuỗi: <code>git log -G"password|api_key" --all</code>.')}` },

  /* 12 — 2.3 */
  { t: '--follow: đi xuyên qua lần đổi tên file', body: `
    ${graph({ w: 1100, h: 250, y0: 110, dx: 104, x0: 70, commits: [
      { id: '5eab', x: 0, t: 'scaffold', c: 'blu' }, { id: '3fa9', x: 1, p: ['5eab'], t: 'login', c: 'blu' }, { id: 'b76a', x: 2, p: ['3fa9'], t: 'legacyAuth', c: 'blu' },
      { id: '6ec2', x: 3, p: ['b76a'], t: 'git mv', hl: true, c: 'amb' },
      { id: '2861', x: 4, p: ['6ec2'], t: 'env' }, { id: '23e0', x: 5, p: ['2861'], t: 'refresh' }, { id: 'd0c0', x: 6, p: ['23e0'], t: 'xoá legacy' },
      { id: '8a4c', x: 7, p: ['d0c0'], t: 'bug' }, { id: 'e0fe', x: 8, p: ['8a4c'], t: 'đổi tên biến' }, { id: '2f56', x: 9, p: ['e0fe'], t: 'prettier' },
    ], refs: [{ to: '3fa9', n: 'tên cũ: auth/login.js', k: 'note' }, { to: 'd0c0', n: 'tên mới: src/services/auth.js', k: 'note' }] })}
    ${table(['Lệnh', 'Output thật', 'Vì sao'], [
      ['<code>git log --oneline -- src/services/auth.js</code>', '7 commit, dừng ở 6ec27f5', 'chỉ biết đường dẫn MỚI'],
      ['<code>git log --oneline --follow -- src/services/auth.js</code>', '+10 commit, về tới 5eabddb', 'nhận ra git mv, theo tiếp tên cũ'],
    ], { sm: true })}` },

  /* 13 — 2.4 */
  { t: 'git bisect: mỗi câu trả lời vứt đi một nửa', body: `
    ${bisectSvg()}` },

  /* 14 — 2.4 */
  { t: 'git bisect run: để máy tự trả lời', body: two(
    small(term(['$ git bisect start HEAD v1.0.0', 'Bisecting: 7 revisions left to test after this (roughly 3 steps)', '[e8cea376c9570cb27c59aac9754b616b61588083] feat: add server entry point', '$ git bisect run ../check.sh', "running '../check.sh'", 'Bisecting: 3 revisions left to test after this (roughly 2 steps)', '# … (cắt bớt 2 bước)', "running '../check.sh'", '! 8a4ce74a20d3fc9bd4189ae2bbed8be55cc39a19 is the first bad commit', '    fix(auth): add /auth/refresh so 24h sessions stop dying silently', '= bisect found first bad commit', '$ git bisect reset', "Switched to branch 'main'"], { title: 'output thật' }), 13.5),
    `${code(`#!/bin/sh
# ../check.sh — nằm NGOÀI kho
node -e "
const { refreshToken } = require('./src/services/auth.js');
try { refreshToken({ sub: 1, exp: 0 }); process.exit(1); }
catch (e) { process.exit(0); }"`, 'bash')}
    ${table(['Mã thoát', 'Git hiểu là'], [['<code>0</code>', '+tốt (good)'], ['<code>1–124, 126, 127</code>', '-hỏng (bad)'], ['<code>125</code>', '!không kiểm được → skip']], { sm: true })}`, 'r') },

  /* 15 — 2.5 */
  { t: 'Cuộc điều tra: năm lệnh, một thủ phạm', body: `
    ${flow([
      { e: '🔎', t: 'git grep -n', d: 'ignoreExpiration ở dòng 19 của auth.js', c: 'blu' },
      { e: '👤', t: 'git blame -w', d: 'dòng 19 ← 8a4ce74 (không phải prettier)', c: 'amb' },
      { e: '📖', t: 'git show', d: 'lời nhắn: cờ này CỐ Ý, để đổi token hết hạn', c: 'grn' },
      { e: '⛏️', t: 'git log -S', d: 'JWT_EXPIRES_IN: 3 commit, không cái nào làm yếu hạn', c: 'vio' },
      { e: '🎯', t: 'bisect run', d: '4 bước → 8a4ce74', c: 'git' },
    ])}
    ${two(
      box('good', '<b>Hai phương pháp độc lập</b> (blame và bisect) cùng chỉ <code>8a4ce74</code> ⇒ giả thuyết thành chẩn đoán.'),
      box('warn', 'Lời nhắn cứu bạn khỏi sửa sai: xoá cờ <code>ignoreExpiration</code> sẽ làm hỏng refresh của mọi người. Lỗi thật: bước “kiểm lại” không kiểm <code>exp</code>.'))}` },

  /* 16 — 2.5 */
  { t: 'Hai ngã cụt — và cách nhận ra mình đang đi sai', body: vs({
    no: { t: 'Đường tốn cả buổi chiều', items: ['<code>git log</code> cả kho rồi ngồi đọc — 2.400 tiêu đề không tìm được bằng mắt', '<code>git log -- file</code>: 147 commit, đa số là đổi tên, log, định dạng', 'Đổ cho <code>JWT_EXPIRES_IN</code> trên server — Git không trả lời được câu đó', 'Thấy cờ lạ là xoá, chưa đọc lời nhắn'] },
    yes: { t: 'Đường thu hẹp', items: ['Bắt đầu từ <b>mã</b> (<code>git grep</code>), không từ lịch sử', 'Lấy mã băm (<code>blame -w</code>) rồi đọc lý do (<code>show</code>)', 'Lọc đúng câu hỏi: <code>-S</code>, đường dẫn, khoảng <code>A..B</code>', 'Xác nhận bằng test tất định + <code>bisect run</code>; lời nhắn bản vá ghi lại cách tìm ra'] },
  }) },

  /* 17 */
  { t: 'Bảng tra nhanh Chương 2', body: table(['Câu hỏi', 'Gõ'], [
    ['Tôi sắp push / sắp kéo về những gì?', '<code>git log --oneline origin/main..main</code> · <code>main..origin/main</code>'],
    ['Ai đã chạm file này gần đây?', '<code>git log --oneline -20 -- &lt;file&gt;</code>'],
    ['Hình dạng các nhánh?', '<code>git log --oneline --graph --all</code>'],
    ['Commit này đổi gì, vì sao?', '<code>git show &lt;mã băm&gt;</code> (<code>--stat</code> cho gọn)'],
    ['File này hồi v1.0.0 thế nào?', '<code>git show v1.0.0:đường/dẫn</code>'],
    ['Nhánh tôi thêm gì từ lúc rẽ ra?', '<code>git diff main...feature</code> (BA chấm)'],
    ['Vì sao dòng này tồn tại?', '<code>git blame -w -C -M -L a,b -- file</code> → <code>git show</code>'],
    ['Chuỗi này sinh ra / mất đi khi nào?', '<code>git log -S"chuỗi" --oneline --all</code>'],
    ['Commit nào làm hỏng?', '<code>git bisect start HEAD &lt;tốt&gt;</code> → <code>git bisect run &lt;kiểm&gt;</code> → <code>reset</code>'],
  ], { sm: true }) },

  /* 18 */
  { t: 'Thực hành chương 2 (30 phút)', body: `
    ${steps([
      ['Trong <code>thu-git</code>: tạo nhánh <code>feature/avatar</code> + một commit trên mỗi nhánh', 'đoán trước output của <code>main..feature/avatar</code> và <code>feature/avatar..main</code>, rồi mới chạy'],
      ['So <code>git diff --stat main feature/avatar</code> với bản BA chấm', 'giải thích vì sao bản hai chấm “xoá” file của main'],
      ['Thêm dòng <code>MAX_RETRIES</code>, thụt lề lại, rồi xoá nó', '<code>blame</code> vs <code>blame -w</code>; <code>log -S</code> phải ra đúng 2 commit'],
      ['Vòng lặp 20 commit, cấy lỗi ở commit 13', '<code>git bisect run grep -q "a + b" tinh.txt</code> — đếm số bước'],
    ])}
    ${box('good', '<b>Đạt khi:</b> bisect gọi tên đúng “commit so 13” sau khoảng 5 bước, <code>git bisect reset</code> đưa bạn về <code>main</code>, và <code>git status</code> sạch.')}` },
]);
