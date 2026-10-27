/**
 * CT Work 27/10/2026 — CuongMini đọc code + review code: phần THUẦN + gitSource với fetch GIẢ (không mạng, không DB).
 *   npx tsx --test src/services/work/codeReview.test.ts
 */

import assert from 'node:assert/strict';
import { after, describe, it } from 'node:test';

import { annotatePatch, diffText, isNoise, numberedFile, parseWhen, patchLines } from './codeText.js';
import { matchFile, parseCodeReview, reviewComment, SEVERITY_TO_DEFECT, type DiffIndexFile } from './codeReviewRules.js';
import { __setGitFetchForTests, cleanPrNumber, compare, pull, pullFiles, type RepoTarget } from './gitSource.js';

const PATCH = `@@ -10,4 +10,6 @@ public class UserDao {
     public User find(int id) {
-        String sql = "SELECT * FROM users WHERE id=" + id;
+        String sql = "SELECT * FROM users WHERE id=?";
+        PreparedStatement ps = conn.prepareStatement(sql);
+        ps.setInt(1, id);
         return map(ps.executeQuery());
     }`;

describe('codeText — số dòng, patch, ngân sách', () => {
  it('numberedFile: số dòng + cắt đúng chỗ, đọc tiếp từ line', () => {
    const src = Array.from({ length: 100 }, (_, i) => `line ${i + 1}`).join('\n');
    const all = numberedFile(src, { budget: 100_000 });
    assert.equal(all.total, 100);
    assert.equal(all.cut, false);
    assert.match(all.text, /^  1\| line 1$/m);
    assert.match(all.text, /^100\| line 100$/m);
    const cut = numberedFile(src, { budget: 120 });
    assert.equal(cut.cut, true);
    assert.ok(cut.shown[1] < 100 && cut.shown[0] === 1);
    const from = numberedFile(src, { budget: 100_000, fromLine: 95 });
    assert.deepEqual(from.shown, [95, 100]);
    assert.doesNotMatch(from.text, /line 94/);
  });

  it('annotatePatch gắn số dòng TỆP MỚI; patchLines khớp đúng dòng thêm + ngữ cảnh', () => {
    const a = annotatePatch(PATCH);
    assert.match(a, /^\s+10\s{2}\s*public User find/m);
    assert.match(a, /^\s+11 \+\s+String sql = "SELECT \* FROM users WHERE id=\?";/m);
    assert.match(a, /^\s+-\s+String sql = "SELECT \* FROM users WHERE id=" \+ id;/m);
    const l = patchLines(PATCH);
    assert.deepEqual([...l.added].sort((x, y) => x - y), [11, 12, 13]);
    assert.deepEqual([...l.all].sort((x, y) => x - y), [10, 11, 12, 13, 14, 15]);
    assert.equal(patchLines(null).all.size, 0);
  });

  it('diffText: danh sách tệp trước; tệp ồn (lock/dist) xếp sau; hết ngân sách ⇒ liệt kê tệp bỏ', () => {
    const files = [
      { filename: 'package-lock.json', status: 'modified', additions: 900, deletions: 10, patch: '@@ -1 +1 @@\n-a\n+b'.repeat(400) },
      { filename: 'src/UserDao.java', status: 'modified', additions: 3, deletions: 1, patch: PATCH },
      { filename: 'big.bin', status: 'added', additions: 0, deletions: 0, patch: null, truncated: true },
    ];
    const d = diffText(files, 2_000);
    assert.match(d.text, /^Changed files \(3\):/);
    assert.match(d.text, /big\.bin .*diff too large/);
    assert.deepEqual(d.included, ['src/UserDao.java']);
    assert.deepEqual(d.omitted, ['package-lock.json']);
    assert.ok(isNoise('dist/app.min.js') && isNoise('yarn.lock') && !isNoise('src/App.tsx'));
  });

  it('parseWhen: tương đối, ngày theo giờ VN, rác ⇒ null', () => {
    const now = new Date('2026-10-27T05:00:00Z'); // 12:00 VN
    assert.equal(parseWhen('7d', now)!.toISOString(), '2026-10-20T05:00:00.000Z');
    assert.equal(parseWhen('24h', now)!.toISOString(), '2026-10-26T05:00:00.000Z');
    assert.equal(parseWhen('2026-10-20', now)!.toISOString(), '2026-10-19T17:00:00.000Z');
    assert.equal(parseWhen('2026-10-20', now, 'end')!.toISOString(), '2026-10-20T16:59:59.999Z');
    assert.equal(parseWhen('today', now)!.toISOString(), '2026-10-26T17:00:00.000Z');
    assert.equal(parseWhen('hôm qua', now)!.toISOString(), '2026-10-25T17:00:00.000Z');
    assert.equal(parseWhen('last tuesday', now), null);
    assert.equal(parseWhen('', now), null);
  });
});

describe('parseCodeReview — kẹp kết quả model (review sai còn tệ hơn không có)', () => {
  const files: DiffIndexFile[] = [
    { filename: 'src/dao/UserDao.java', patch: PATCH, shown: true },
    { filename: 'src/web/LoginServlet.java', patch: '@@ -1,2 +1,3 @@\n a\n+b\n c', shown: true },
    { filename: 'src/huge/Gen.java', patch: '@@ -1 +1 @@\n+x', shown: false },
  ];

  it('tệp ngoài diff ⇒ bỏ; dòng ngoài patch ⇒ gỡ số dòng; tệp chưa đưa model ⇒ không giữ số dòng', () => {
    const r = parseCodeReview({
      summary: 'ok', verdict: 'comment',
      findings: [
        { file: 'src/dao/UserDao.java', line: 12, severity: 'major', category: 'security', message: 'm1', suggestion: 's1' },
        { file: 'UserDao.java', line: 99, severity: 'MINOR', category: 'style', message: 'm2' },
        { file: 'src/Other.java', line: 3, severity: 'BLOCKER', message: 'invented file' },
        { file: 'src/huge/Gen.java', line: 1, severity: 'NIT', message: 'm3' },
        { file: 'src/web/LoginServlet.java', line: '2', severity: 'weird', category: 'weird', message: 'm4' },
        { file: 'src/dao/UserDao.java', line: 12, message: '' },
      ],
    }, files);
    assert.equal(r.dropped, 2, 'tệp bịa + không có nội dung');
    assert.equal(r.findings.length, 4);
    const byMsg = Object.fromEntries(r.findings.map((f) => [f.message, f]));
    assert.equal(byMsg.m1.line, 12);
    assert.equal(byMsg.m1.severity, 'MAJOR');
    assert.equal(byMsg.m2.file, 'src/dao/UserDao.java', 'khớp đuôi tên tệp duy nhất');
    assert.equal(byMsg.m2.line, null, 'dòng 99 không có trong patch');
    assert.equal(byMsg.m3.line, null, 'patch chưa đưa model ⇒ không tin số dòng');
    assert.equal(byMsg.m4.line, 2);
    assert.equal(byMsg.m4.severity, 'MINOR');
    assert.equal(byMsg.m4.category, 'correctness');
    assert.equal(r.linesCleared, 2);
    assert.equal(r.verdict, 'COMMENT');
    assert.equal(r.findings[0].severity, 'MAJOR', 'nặng trước');
  });

  it('không APPROVE khi còn BLOCKER hoặc tiêu chí chưa đạt; "yes" thiếu bằng chứng ⇒ unknown', () => {
    const blocker = parseCodeReview({ verdict: 'APPROVE', findings: [{ file: 'src/dao/UserDao.java', line: 11, severity: 'BLOCKER', message: 'x' }] }, files);
    assert.equal(blocker.verdict, 'CHANGES');
    const unmet = parseCodeReview({ verdict: 'APPROVE', acceptance: [{ criterion: 'Login works', met: 'no', evidence: 'no servlet' }, { criterion: 'Has tests', met: 'yes' }] }, files);
    assert.equal(unmet.verdict, 'CHANGES');
    assert.equal(unmet.acceptance[1].met, 'unknown');
    const ok = parseCodeReview({ verdict: 'APPROVE', acceptance: [{ criterion: 'Uses PreparedStatement', met: 'yes', evidence: 'src/dao/UserDao.java:12' }] }, files);
    assert.equal(ok.verdict, 'APPROVE');
    assert.equal(parseCodeReview({ verdict: 'MERGE IT' }, files).verdict, 'COMMENT');
    assert.equal(parseCodeReview('garbage', files).findings.length, 0);
  });

  it('matchFile: a/ b/ ./ và :line; đuôi trùng nhiều tệp ⇒ không khớp', () => {
    assert.equal(matchFile('b/src/dao/UserDao.java:12', files)!.filename, 'src/dao/UserDao.java');
    assert.equal(matchFile('./src/web/LoginServlet.java', files)!.filename, 'src/web/LoginServlet.java');
    const dup: DiffIndexFile[] = [{ filename: 'a/Util.java', patch: null, shown: true }, { filename: 'b2/Util.java', patch: null, shown: true }];
    assert.equal(matchFile('Util.java', dup), null);
  });

  it('bình luận gửi thành viên: kết luận gợi ý + file:line + tiêu chí chưa đạt + link phiên review; không có chữ "AI"', () => {
    const r = parseCodeReview({
      summary: 'Đổi sang PreparedStatement.', verdict: 'CHANGES',
      findings: [{ file: 'src/dao/UserDao.java', line: 12, severity: 'MAJOR', category: 'correctness', message: 'Chưa đóng PreparedStatement', suggestion: 'try-with-resources' }],
      acceptance: [{ criterion: 'Đăng nhập sai báo lỗi', met: 'unknown', evidence: 'không có trong diff' }], nextSteps: ['Đóng tài nguyên'],
    }, files);
    const md = reviewComment({ language: 'vi', target: 'PR #7: Login', reviewKey: 'REV-3', reviewUrl: '/work/ws/NT/reviews?review=3', result: r, coverage: { filesRead: 2, filesTotal: 3, omitted: ['src/huge/Gen.java'] } });
    assert.match(md, /Kết luận gợi ý: \*\*Cần sửa trước khi duyệt\*\*/);
    assert.match(md, /`src\/dao\/UserDao\.java:12`/);
    assert.match(md, /chưa kiểm được/);
    assert.match(md, /\[REV-3\]\(\/work\/ws\/NT\/reviews\?review=3\)/);
    assert.match(md, /Đã đọc diff 2\/3 tệp \(chưa đọc: src\/huge\/Gen\.java\)/);
    assert.doesNotMatch(md, /\bAI\b/);
    assert.equal(SEVERITY_TO_DEFECT.BLOCKER, 'CRITICAL');
  });
});

describe('gitSource — PR + so sánh nhánh (fetch GIẢ)', () => {
  after(() => __setGitFetchForTests(null));
  const gh: RepoTarget = { provider: 'GITHUB', repo: 'team/nha-tro', apiBase: 'https://api.github.com', webBase: 'https://github.com', token: 'tok_secret_value_123456', projectId: 7 };
  const gl: RepoTarget = { provider: 'GITLAB', repo: 'g/p', apiBase: 'https://gitlab.com/api/v4', webBase: 'https://gitlab.com', token: null, projectId: 7 };
  const ok = (b: unknown) => new Response(JSON.stringify(b), { status: 200, headers: { 'content-type': 'application/json' } });

  it('GitHub pull: state merged/draft, nhánh + sha, mô tả; token chỉ đi trong header', async () => {
    const seen: string[] = [];
    __setGitFetchForTests(((url: string, init: { headers: Record<string, string> }) => {
      seen.push(url);
      assert.equal(init.headers.Authorization, 'Bearer tok_secret_value_123456');
      if (url.endsWith('/repos/team/nha-tro/pulls/24')) {
        return Promise.resolve(ok({ number: 24, title: 'NT-24 Login', body: 'Closes NT-24', state: 'closed', merged: true, merged_at: '2026-10-26T00:00:00Z', draft: false, mergeable: null, head: { ref: 'feature/NT-24-login', sha: 'a'.repeat(40) }, base: { ref: 'main', sha: 'b'.repeat(40) }, user: { login: 'khoa' }, additions: 30, deletions: 4, changed_files: 3, commits: 2, html_url: 'https://github.com/team/nha-tro/pull/24' }));
      }
      return Promise.resolve(new Response('{}', { status: 404 }));
    }) as never);
    const p = await pull(gh, 24);
    assert.equal(p.state, 'merged');
    assert.equal(p.headRef, 'feature/NT-24-login');
    assert.equal(p.baseSha, 'b'.repeat(40));
    assert.equal(p.authorLogin, 'khoa');
    assert.equal(p.changedFiles, 3);
    assert.ok(seen.every((u) => !u.includes('tok_secret')));
  });

  it('GitHub pull files: phân trang tới khi < 100, patch bị cắt theo trần', async () => {
    const page1 = Array.from({ length: 100 }, (_, i) => ({ filename: `f${i}.ts`, status: 'modified', additions: 1, deletions: 0, changes: 1, patch: '@@ -1 +1 @@\n+x' }));
    const page2 = [{ filename: 'huge.ts', status: 'added', additions: 9, deletions: 0, changes: 9, patch: 'x'.repeat(250_000) }, { filename: 'img.png', status: 'added', additions: 0, deletions: 0, changes: 0 }];
    __setGitFetchForTests(((url: string) => Promise.resolve(ok(url.endsWith('&page=1') ? page1 : url.endsWith('&page=2') ? page2 : []))) as never);
    const r = await pullFiles(gh, 5);
    assert.equal(r.files.length, 102);
    assert.equal(r.files[100].patch, null, '> 200 KB ⇒ bỏ patch');
    assert.equal(r.files[100].truncated, true);
    assert.equal(r.truncated, true);
  });

  it('GitHub compare: ahead/behind, commit mới nhất, tệp; nhánh có "/" giữ nguyên trong đường dẫn', async () => {
    let asked = '';
    __setGitFetchForTests(((url: string) => {
      asked = url;
      return Promise.resolve(ok({ status: 'diverged', ahead_by: 2, behind_by: 1, total_commits: 2, html_url: 'https://github.com/x/compare', commits: [{ sha: 'c1', commit: { message: 'NT-24 a', author: { name: 'Khoa', email: 'k@x.vn', date: '2026-10-25T00:00:00Z' } }, author: { login: 'khoa' } }, { sha: 'c2', commit: { message: 'NT-24 b' } }], files: [{ filename: 'a.java', status: 'modified', additions: 1, deletions: 1, changes: 2, patch: PATCH }] }));
    }) as never);
    const c = await compare(gh, 'main', 'feature/NT-24-login');
    assert.ok(asked.endsWith('/repos/team/nha-tro/compare/main...feature/NT-24-login'), asked);
    assert.equal(c.aheadBy, 2);
    assert.equal(c.behindBy, 1);
    assert.deepEqual(c.commits.map((x) => x.sha), ['c1', 'c2']);
    assert.equal(c.commits[0].authorLogin, 'khoa');
    assert.equal(c.files[0].filename, 'a.java');
  });

  it('GitLab MR + diffs (lùi về /changes khi GitLab cũ) + compare', async () => {
    __setGitFetchForTests(((url: string) => {
      if (url.endsWith('/merge_requests/3')) return Promise.resolve(ok({ iid: 3, title: 'NT-3', description: 'd', state: 'opened', draft: true, source_branch: 'f', target_branch: 'main', sha: 'h'.repeat(40), diff_refs: { base_sha: 'z'.repeat(40) }, author: { username: 'an' }, detailed_merge_status: 'mergeable', changes_count: '2', web_url: 'https://gitlab.com/g/p/-/merge_requests/3' }));
      if (url.includes('/merge_requests/3/diffs')) return Promise.resolve(new Response('{}', { status: 404 }));
      if (url.endsWith('/merge_requests/3/changes')) return Promise.resolve(ok({ changes: [{ new_path: 'a.py', old_path: 'a.py', diff: '@@ -1 +1,2 @@\n x\n+y\n' }] }));
      if (url.includes('/repository/compare?from=main&to=f')) return Promise.resolve(ok({ commits: [{ id: 'c9', message: 'm', author_name: 'An' }], diffs: [{ new_path: 'b.py', old_path: 'b.py', new_file: true, diff: '+1\n' }], web_url: 'https://gitlab.com/g/p/-/compare/main...f' }));
      return Promise.resolve(new Response('{}', { status: 404 }));
    }) as never);
    const m = await pull(gl, 3);
    assert.equal(m.state, 'draft');
    assert.equal(m.mergeable, true);
    assert.equal(m.changedFiles, 2);
    assert.equal(m.baseSha, 'z'.repeat(40));
    const f = await pullFiles(gl, 3);
    assert.equal(f.files[0].additions, 1);
    const c = await compare(gl, 'main', 'f');
    assert.equal(c.aheadBy, 1);
    assert.equal(c.behindBy, null);
    assert.equal(c.files[0].status, 'added');
  });

  it('cleanPrNumber: "#12" / "!3" / số; rác ⇒ 400', () => {
    assert.equal(cleanPrNumber('#12'), 12);
    assert.equal(cleanPrNumber('!3'), 3);
    assert.equal(cleanPrNumber(7), 7);
    assert.throws(() => cleanPrNumber('12a'));
    assert.throws(() => cleanPrNumber(0));
  });
});

describe('registry: code_read + code_review', async () => {
  const r = await import('./toolRegistry/index.js');
  it('code_read: một tool đọc, chỉ token người, có MCP + Ask, không BUILTIN; trần MCP ≤ 280', () => {
    const t = r.commandByName('code_read')!;
    assert.equal(t.write, false);
    assert.equal(t.personOnly, true);
    assert.ok(r.mcpCommands().includes(t) && r.askCommands().includes(t) && !r.builtinCommands().includes(t));
    for (const a of ['activity', 'tree', 'file', 'commits', 'commit', 'compare', 'pr', 'pr_files']) assert.ok((t.input.shape.action.options as string[]).includes(a), a);
    assert.ok(r.mcpCommands().filter((x) => !x.agentOnly).length <= 280);
  });
  it('code_review: lệnh GHI chỉ ở Ask (không chiếm chỗ MCP); MCP dùng review_manage ai_code_review', () => {
    const t = r.commandByName('code_review')!;
    assert.equal(t.write, true);
    assert.ok(!r.mcpCommands().includes(t) && !r.builtinCommands().includes(t) && r.askCommands().includes(t));
    assert.ok((r.commandByName('review_manage')!.input.shape.action.options as string[]).includes('ai_code_review'));
    assert.ok(!('decision' in r.commandByName('review_manage')!.input.shape), 'AI không đặt quyết định review');
  });
});
