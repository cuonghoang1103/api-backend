/**
 * pr-10-1 — Prisma ORM · Chapter 10 · Lesson 10.1 "Four raw functions, and the one that lets an attacker in" (deck video, 12/11/2026). Bài web: pr-10-1-bon-ham-tho.
 * Output THẬT (`chay.sh p10-1`, prisma-pg PostgreSQL 16.14, CSDL c101 = mẫu c10: 2.000 user, 100.000 bài; Prisma 6.19.3): $queryRaw gửi $1 + params · $executeRaw UPDATE ⇒ 50,
 * $executeRaw SELECT ⇒ 3 (số hàng, không phải hàng) · "x' OR 1=1 --": Unsafe trả 2.000 hàng, $queryRaw 0 · ghép hai lệnh qua Unsafe ⇒ 42601 "cannot insert multiple commands
 * into a prepared statement" · Prisma.sql + join giữ tham số · ORDER BY ${cot} không lỗi, không sắp; Prisma.raw theo danh sách trắng thì sắp · repo CuongThai (đọc):
 * 28 dòng RawUnsafe trong 10 tệp src, không có bước CI nào chặn.
 */
/* Output chạy THẬT, đóng băng từ thư mục demo của khoá video Prisma (12/11/2026) — deck tự chứa, không đọc tệp ngoài repo. */
const DU_LIEU = {
 "demo/out/p10-1/gui.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c101 npx tsx p10/101/tho.mts gui\nprisma:query SELECT id, username FROM users WHERE email = $1 AND deleted_at IS NULL\nprisma:query params: [\"u1@vd.vn\"]\nprisma:query UPDATE posts SET deleted_at = now() WHERE author_id = $1\nprisma:query params: [7]\n$executeRaw UPDATE tra ve: 50\nprisma:query SELECT id FROM users WHERE id <= $1\nprisma:query params: [3]\n$executeRaw SELECT tra ve: 3 (mot con so, khong phai hang)\n",
 "demo/out/p10-1/tan-cong.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c101 npx tsx p10/101/tho.mts tan-cong\nemail = \"u1@vd.vn\"       → $queryRawUnsafe:    1 hang · $queryRaw: 1 hang\nemail = \"x' OR 1=1 --\"   → $queryRawUnsafe: 2000 hang · $queryRaw: 0 hang\nSQL that su chay (Unsafe): SELECT id, username FROM users WHERE email = 'x' OR 1=1 --'\ncau ghep 2 lenh qua $queryRawUnsafe → P2010 Raw query failed. Code: `42601`. Message: `ERROR: cannot insert multiple commands into a prepared statement`\nusername cua user 1 sau do: user1\n",
 "demo/out/p10-1/dong.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c101 npx tsx p10/101/tho.mts dong\nket qua: 94839, 88839, 82839\nprisma:query SELECT id, title FROM posts WHERE deleted_at IS NULL AND content ILIKE $1 AND author_id = $2 ORDER BY created_at DESC LIMIT $3\nprisma:query params: [\"%prisma%\",42,3]\nORDER BY ${cot}            → Bai 98839 | Bai 96839 | Bai 94839 | Bai 92839 (khong loi, khong sap)\nORDER BY Prisma.raw(trang) → Bai 10839 | Bai 12839 | Bai 14839 | Bai 16839\n",
 "demo/out/p10-1/cuongthai.txt": "$ cd ~/Downloads/api-backend && grep -rn 'RawUnsafe' src | grep -v '\\.test\\.' | grep -v '\\.md:' | wc -l\n      28\n$ cd ~/Downloads/api-backend && grep -rln 'RawUnsafe' src | grep -v '\\.test\\.' | grep -v '\\.md$' | wc -l\n      10\n$ cd ~/Downloads/api-backend && grep -rln 'RawUnsafe' .github 2>/dev/null | wc -l\n       0\n"
};
const fs = { readFileSync: (p) => { const k = String(p); if (!(k in DU_LIEU)) throw new Error('thiếu dữ liệu đóng băng: ' + k); return DU_LIEU[k]; } };
import { lamDeck, tp, ts, two, box, cards, c, tbl, steps , icards, cmp, bars, hub, tiers, flow } from './_pr-chung.mjs';

export const deck = { key: 'pr-10-1', code: 'PR 10.1', title: 'Four raw functions, and the one that lets an attacker in', sub: 'Chapter 10 · Lesson 10.1' };

const DEMO = 'demo';
const OUT = (t, ch = 'p10-1') => fs.readFileSync(`${DEMO}/out/${ch}/${t}.txt`, 'utf8').replace(/\n+$/, '');
const gon = (s) => s.replace(/^\$ DATABASE_URL=\S+ /gm, '$ ').replace(/p10\/10\d\//g, '').replace(/cd ~\/Downloads\/api-backend && /g, '').split('\n').filter((l) => !/^\s*$/.test(l)).join('\n');
const MOI = 'terminal — PostgreSQL 16.14 · Prisma 6.19.3 · 2,000 users';
const bo$ = (t) => gon(OUT(t)).split('\n').filter((l) => !/^\$ (npx|DATABASE)/.test(l)).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 10 — Escape hatches: raw SQL and client extensions', bai: '10.1' }, [
  /* 1 */ { cover: true, nhan: 'Chapter 10 · Lesson 10.1', t: 'Four raw functions, and the one that lets an attacker in', sub: 'A pair of parentheses is the whole security boundary — run for real' },
  /* 2 */ { t: 'What you will take away from this lesson', body: icards([
      ['code', '$queryRaw, $executeRaw — and their Unsafe twins', ''],
      ['search', 'What each one actually sends', ''],
      ['warn', 'The injection, run against a real table', ''],
      ['filter', 'Dynamic filters that stay parameterised', ''],
      ['key', 'Identifiers you cannot parameterise', ''],
    ], 2) },
  /* 3 */ { t: 'The four', body: tbl(['Function', 'Takes', 'Returns', 'Safe?'], [
      [c('$queryRaw'), 'a tagged template', 'rows', 'every ${…} becomes $1, $2'],
      [c('$executeRaw'), 'a tagged template', 'a count', 'same'],
      [c('$queryRawUnsafe'), 'a string (+ params)', 'rows', 'only if the string is constants'],
      [c('$executeRawUnsafe'), 'a string (+ params)', 'a count', 'only if the string is constants'],
    ]) + ts(`await prisma.$queryRaw\`SELECT id FROM users WHERE email = \${email}\`;            // tagged template: no parentheses
await prisma.$queryRawUnsafe(\`SELECT id FROM users WHERE email = '\${email}'\`);   // a string: parentheses`, { sm: true }) +
      box('The difference is a pair of parentheses', 'With the tagged template, JavaScript hands Prisma the text and the values separately. With a string, the values are already inside the SQL before Prisma sees it — and $queryRawUnsafe(sql, ...params) is the only safe way to use it.', 'do2') },
  /* 4 */ { t: 'What each one actually sends', body: ts(`await prisma.$queryRaw\`SELECT id, username FROM users WHERE email = \${'u1@vd.vn'} AND deleted_at IS NULL\`;
const n = await prisma.$executeRaw\`UPDATE posts SET deleted_at = now() WHERE author_id = \${7}\`;
const x = await prisma.$executeRaw\`SELECT id FROM users WHERE id <= \${3}\`;`, { sm: true }) +
      tp(bo$('gui'), { wrap: 116, fs: 14, title: MOI }) +
      box('$executeRaw returns a number, whatever the statement', 'For the SELECT it returned 3 — the row count, not the rows. Awaiting it "for rows" compiles and hands you a number.', 'lam') },
  /* 5 */ { t: 'The attack, run for real', body: two(ts(`// "search by email", written the unsafe way
const timUnsafe = (email: string) =>
  prisma.$queryRawUnsafe(
    \`SELECT id, username FROM users
     WHERE email = '\${email}'\`);
// the same search, parameterised
const timSafe = (email: string) =>
  prisma.$queryRaw\`SELECT id, username FROM users
    WHERE email = \${email}\`;`, { sm: true }), tp(bo$('tan-cong'), { wrap: 62, fs: 12, title: MOI }), '') +
      cards([
        ['The quote closes the literal', "x' ends the string; OR 1=1 makes every row match."],
        ['-- hides the wreckage', 'The leftover quote becomes a comment: valid SQL, no error in any log.'],
        ['Stacked statements were refused', 'One prepared statement cannot carry two commands (42601). Reading every row needed only one.'],
      ], 3) },
  /* 6 */ { t: 'Dynamic filters that stay parameterised', body: two(ts(`const dk: Prisma.Sql[] = [
  Prisma.sql\`deleted_at IS NULL\`];
if (tuKhoa) dk.push(
  Prisma.sql\`content ILIKE \${'%' + tuKhoa + '%'}\`);
if (tacGia) dk.push(
  Prisma.sql\`author_id = \${tacGia}\`);

await prisma.$queryRaw\`
  SELECT id, title FROM posts
  WHERE \${Prisma.join(dk, ' AND ')}
  ORDER BY created_at DESC LIMIT \${3}\`;`, { sm: true }), tp(bo$('dong').split('\n').slice(0, 3).join('\n'), { wrap: 62, fs: 12, title: MOI }), '') +
      cards([
        [c('Prisma.sql'), 'A fragment that carries its own parameters; composing renumbers them for you.'],
        [c('Prisma.join(list, sep)'), 'The separator is SQL text: a constant you wrote, never input.'],
        [c('Prisma.empty'), 'The zero-length fragment for an absent clause.'],
      ], 3) },
  /* 7 */ { t: 'You cannot parameterise an identifier', body: ts(`await prisma.$queryRaw\`… ORDER BY \${cot} ASC LIMIT 4\`;                                   // sends ORDER BY $1
await prisma.$queryRaw\`… ORDER BY \${Prisma.raw(['title', 'created_at'].includes(cot) ? cot : 'id')} ASC LIMIT 4\`;`, { sm: true }) +
      tp(bo$('dong').split('\n').slice(3).join('\n'), { wrap: 116, fs: 14, title: MOI }) +
      box('ORDER BY $1 sorts by a constant — no error, no order', 'A bind parameter is a value, never a column name. Prisma.raw injects text verbatim, so it must only ever receive a value from your own allow-list.', 'do2') +
      cards([
        ['What PostgreSQL received', 'ORDER BY $1 with params ["title"] — the same string on every row, so the rows came back in storage order.'],
        ['The allow-list', 'A fixed set of column names and a default (id). Anything else from the request is ignored, never forwarded.'],
      ], 2) },
  /* 8 */ { t: 'A rule a machine enforces', body: tp(gon(OUT('cuongthai')).replace(/\$ grep -rn 'RawUnsafe' src.*$/m, "$ grep -rn RawUnsafe src (excluding tests and .md) | wc -l").replace(/\$ grep -rln 'RawUnsafe' src.*$/m, '$ … files').replace(/\$ grep -rln 'RawUnsafe' \.github.*$/m, '$ grep -rln RawUnsafe .github | wc -l'), { fs: 15, title: 'terminal — the CuongThai repository, read-only, 12 Nov 2026' }) +
      cards([
        ['28 lines in 10 files', 'Some are DDL with whitelisted names; each one needs a reviewer who knows why.'],
        ['No CI step checks them', 'Nothing stops the 29th. A grep in CI with an allow-list is a few lines.'],
        ['The habit', 'Tagged template by default; Unsafe only for constants, and named in an allow-list.'],
      ], 3) },
  /* 9 */ { t: 'The rule', body: cmp(['Need', 'Use'], [
      ['a value from the user', c('$queryRaw`… ${value}`')],
      ['optional clauses', c('Prisma.sql') + ' + ' + c('Prisma.join') + ' / ' + c('Prisma.empty')],
      ['a column or table name', c('Prisma.raw') + ' from an allow-list — never the input itself'],
      ['a statement, not rows', c('$executeRaw') + ' — and expect a number'],
      ['anything else', 'not ' + c('…Unsafe')],
    ]) + box('If you must use Unsafe', '$queryRawUnsafe(sql, ...params) with $1, $2 placeholders is still parameterised — the attack string above returned 0 rows that way. The danger is only ever text you concatenated.', 'lam') },
  /* 10 */ { t: 'Your turn — and what to keep', body: two(steps([
      `Send ${c("x' OR 1=1 --")} through both functions`,
      `Build a filter with ${c('Prisma.sql')} and ${c('Prisma.join')}`,
      `Try ${c('ORDER BY ${col}')}; then an allow-list`,
      `Grep your repo for ${c('RawUnsafe')}`,
      `Add a CI step that fails on a new ${c('RawUnsafe')}`,
    ]), box('Keep these', `<ul><li>Tagged template, no parentheses</li><li>Unsafe only for constants</li><li>Identifiers via an allow-list</li><li>Let CI count RawUnsafe</li></ul>`, 'lam'), '') },
]);
