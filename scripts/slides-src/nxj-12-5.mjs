/*DU_LIEU*/
const DU_LIEU = {
 "n12-5:file:prisma/schema.prisma": "// prisma/schema.prisma — bài 12.5: mỗi ghi chú có chủ (authorId)\ngenerator client {\n  provider = \"prisma-client-js\"\n}\n\ndatasource db {\n  provider = \"sqlite\"\n  url      = \"file:./dev.db\"\n}\n\nmodel Note {\n  id       Int    @id @default(autoincrement())\n  title    String\n  body     String @default(\"\")\n  authorId Int    @default(1)\n}\n",
 "n12-5:file:src/lib/phien.ts": "// lib/phien.ts — \"phiên\" GIẢN LƯỢC của phòng thí nghiệm: cookie uid=<số>. Ở thật phải là phiên đã KÝ (Chương 15), cookie trần sửa được.\nimport { cookies } from 'next/headers';\n\nexport async function getCurrentUser() {\n  const uid = Number((await cookies()).get('uid')?.value);\n  return Number.isInteger(uid) && uid > 0 ? { id: uid } : null;\n}\n",
 "n12-5:file:src/app/bai12-5/actions.ts": "'use server';\n// sửa 1: kiểu + import thật — còn lại giữ nguyên logic của bài\nimport { db } from '@/lib/db';\nimport { getCurrentUser } from '@/lib/phien';\n\nexport async function deletePost(postId: number) {\n  const user = await getCurrentUser();\n  if (!user) throw new Error('Not authenticated');\n  const post = await db.note.findUnique({ where: { id: postId } });\n  if (post.authorId !== user.id) throw new Error('Forbidden');\n  await db.note.delete({ where: { id: postId } });\n}\n",
 "n12-5:bai": "$ npx tsc --noEmit      # đoạn mã của bài, chép nguyên\nbai12-5/actions.ts(3,27): error TS7006: Parameter 'postId' implicitly has an 'any' type.\nbai12-5/actions.ts(5,22): error TS2304: Cannot find name 'getCurrentUser'.\nbai12-5/actions.ts(8,22): error TS2304: Cannot find name 'db'.\nbai12-5/actions.ts(11,9): error TS2304: Cannot find name 'db'.\n$ npx tsc --noEmit      # sửa 1: kiểu + import\nbai12-5/actions.ts(10,7): error TS18047: 'post' is possibly 'null'.",
 "n12-5:file:src/app/xoa/actions.ts": "'use server';\n// app/xoa/actions.ts — ba action xoá, từ sai tới đúng\nimport { db } from '@/lib/db';\nimport { getCurrentUser } from '@/lib/phien';\n\n// A) logic của bài, chạy như JS thường (post! = \"tin tôi đi, không null\")\nexport async function deletePost(postId: number) {\n  const user = await getCurrentUser();\n  if (!user) throw new Error('Not authenticated');\n  const post = await db.note.findUnique({ where: { id: postId } });\n  if (post!.authorId !== user.id) throw new Error('Forbidden');\n  await db.note.delete({ where: { id: postId } });\n  console.log(`[A deletePost] user ${user.id} xoá #${postId}`);\n}\n\n// B) BẪY: nhận userId từ người gọi\nexport async function deleteNote(noteId: number, userId: number) {\n  const note = await db.note.findUnique({ where: { id: noteId } });\n  if (!note || note.authorId !== userId) return { error: 'Forbidden' };\n  await db.note.delete({ where: { id: noteId } });\n  console.log(`[B deleteNote] userId (do người gọi gửi) = ${userId} · xoá #${noteId}`);\n  return { ok: true };\n}\n\n// C) ĐÚNG: ai gọi = đọc từ phiên; kiểm đầu vào; truy vấn đã khoanh theo chủ\nexport async function xoaGhiChu(noteId: unknown) {\n  const user = await getCurrentUser();\n  if (!user) return { error: 'Chưa đăng nhập' };\n  if (typeof noteId !== 'number' || !Number.isInteger(noteId) || noteId <= 0) return { error: 'noteId không hợp lệ' };\n  const { count } = await db.note.deleteMany({ where: { id: noteId, authorId: user.id } });\n  console.log(`[C xoaGhiChu] user ${user.id} · noteId ${noteId} · đã xoá ${count}`);\n  return count === 1 ? { ok: true } : { error: 'Không tìm thấy' };\n}\n",
 "n12-5:file:src/app/xoa/NutXoa.tsx": "'use client';\n// app/xoa/NutXoa.tsx — giao diện chỉ hiện nút xoá cho ghi chú của MÌNH (UI che, không phải bảo vệ)\nimport { deletePost, deleteNote, xoaGhiChu } from './actions';\n\nexport function NutXoa({ id, uid }: { id: number; uid: number }) {\n  return (\n    <span className=\"ml-2 flex gap-1\">\n      <button onClick={() => deletePost(id)}>A</button>\n      <button onClick={() => deleteNote(id, uid)}>B</button>\n      <button onClick={() => xoaGhiChu(id)}>C</button>\n    </span>\n  );\n}\n",
 "n12-5:file:src/app/xoa/page.tsx": "// app/xoa/page.tsx — danh sách; nút xoá chỉ hiện cho ghi chú của người đang đăng nhập\nimport { db } from '@/lib/db';\nimport { getCurrentUser } from '@/lib/phien';\nimport { NutXoa } from './NutXoa';\n\nexport default async function Trang() {\n  const user = await getCurrentUser();\n  const notes = await db.note.findMany({ orderBy: { id: 'asc' } });\n  return (\n    <main className=\"p-4 text-xl\">\n      <p>đăng nhập: {user ? `user ${user.id}` : 'chưa'}</p>\n      <ul>{notes.map((n) => <li key={n.id} className=\"flex\">#{n.id} {n.title} (chủ: user {n.authorId}){user?.id === n.authorId && <NutXoa id={n.id} uid={user.id} />}</li>)}</ul>\n    </main>\n  );\n}\n",
 "n12-5:trang": "$ npx next typegen >/dev/null 2>&1; npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -E 'Compiled|/xoa|Static|Dynamic'\n✓ Compiled successfully in 4.3s\n└ ƒ /xoa\n○  (Static)   prerendered as static content\nƒ  (Dynamic)  server-rendered on demand\n$ curl -b uid=2 localhost:3000/xoa      # user 2 chỉ thấy nút xoá ở ghi chú của mình\n#12 Ghi chú của user 1 (chủ: user 1)\n#13 Ghi chú của user 2 (chủ: user 2)[A][B][C]\n#14 Ghi chú khác của user 1 (chủ: user 1)#15 Nháp của user 1 (chủ: user 1)",
 "n12-5:file:goi.sh": "# goi.sh <tên action> <cookie uid> '<mảng đối số JSON>' [header thêm] — gọi THẲNG một Server Action bằng curl (không trình duyệt, không nút)\nID=$(node -e \"const m=require('./.next/server/server-reference-manifest.json'); for (const [id,v] of Object.entries(m.node)) if (v.exportedName==='$1') console.log(id)\")\ncurl -s -o /tmp/nxj-12-5-kq.txt -w 'HTTP %{http_code}' -X POST localhost:19392/xoa -H \"Next-Action: $ID\" -H 'content-type: text/plain;charset=UTF-8' ${2:+-b \"uid=$2\"} ${4:+-H \"$4\"} --data-binary \"$3\"\necho \" · $(tail -c 120 /tmp/nxj-12-5-kq.txt | tr -d '\\n' | sed 's/.*\"b\":\"[^\"]*\"}//')\"; rm -f /tmp/nxj-12-5-kq.txt\n",
 "n12-5:tan-cong": "$ bash goi.sh deletePost \"\" '[13]'          # A, KHÔNG cookie\nHTTP 500 · 1:E{\"digest\":\"2182075609\"}\n$ bash goi.sh deletePost 2 '[99999]'       # A, user 2, id không tồn tại\nHTTP 500 · 1:E{\"digest\":\"3918568795\"}\n$ bash goi.sh deleteNote 2 '[12,1]'        # B: user 2 xoá #12 của user 1, tự khai userId = 1\nHTTP 200 · 1:{\"ok\":true}\n$ bash goi.sh xoaGhiChu 2 '[14]'           # C: user 2 xoá #14 của user 1\nHTTP 200 · 1:{\"error\":\"Không tìm thấy\"}\n$ bash goi.sh xoaGhiChu 2 '[\"14 OR 1=1\"]'  # C: đầu vào rác\nHTTP 200 · 1:{\"error\":\"noteId không hợp lệ\"}\n$ bash goi.sh xoaGhiChu 1 '[15]'           # C: user 1 xoá ghi chú của chính mình\nHTTP 200 · 1:{\"ok\":true}\n$ grep '\\[A\\|\\[B\\|\\[C\\|TypeError\\|Not auth' (log next start)\nError: Not authenticated\nTypeError: Cannot read properties of null (reading 'authorId')\n[B deleteNote] userId (do người gọi gửi) = 1 · xoá #12\n[C xoaGhiChu] user 2 · noteId 14 · đã xoá 0\n[C xoaGhiChu] user 1 · noteId 15 · đã xoá 1\n$ node -e \"const {PrismaClient}=require('@prisma/client');new PrismaClient().note.findMany({orderBy:{id:'asc'}}).then(r=>console.log('CSDL còn: '+r.map(n=>'#'+n.id+' (user '+n.authorId+')').join(' · ')))\"\nCSDL còn: #13 (user 2) · #14 (user 1)",
 "n12-5:cua": "$ bash goi.sh xoaGhiChu 1 '[14]' 'Origin: http://evil.example'     # Origin lạ (trang khác gửi hộ)\nHTTP 500 · 1:E{\"digest\":\"403536267\"}\n$ bash goi.sh xoaGhiChu 1 '[99]' 'Origin: http://localhost:19392'  # Origin khớp Host\nHTTP 200 · 1:{\"error\":\"Không tìm thấy\"}\n$ grep -aiE 'origin|csrf|x-forwarded-host' ~/.rtq-nxj/nen-c12s.log | sed 's/^ *//' | cut -c1-150 | head -2\n`x-forwarded-host` header with value `localhost:19392` does not match `origin` header with value `evil.example` from a forwarded Server Actions reques\n$ node -e 'mảng 2 MB' | bash goi.sh xoaGhiChu 1 -      # thân 2 MB\nHTTP 500 · 1:E{\"digest\":\"2003265017\"}\n$ grep -aiE 'Body exceeded|bodySizeLimit' ~/.rtq-nxj/nen-c12s.log | sed 's/^ *//' | cut -c1-150 | head -2\n⨯ Error: Body exceeded 1 MB limit.\nTo configure the body size limit for Server Actions, see: https://nextjs.org/docs/app/api-reference/next-config-js/serverActions#bodysizelimit\n$ curl -X POST localhost:3000/xoa -H \"Next-Action: 40$(id bịa 40 ký tự)\"      # id không có trong sổ\nHTTP 409\n$ grep -aiE 'Failed to find Server Action|not found' ~/.rtq-nxj/nen-c12s.log | sed 's/^ *//' | cut -c1-150 | head -1\nError: Failed to find Server Action \"40aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\". This request might be from an older or newer deployment."
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, box, two, steps, kw, c, cmp, icards, seq } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-12-5', code: 'NXJ 12.5', title: 'Security: an action is a public endpoint', sub: 'Chapter 12 · Lesson 12.5' };
const O = (k) => { const v = DU_LIEU[`n12-5:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const F = (p) => O(`file:${p}`).trim();
const bo = (s) => s.split('\n').filter((l) => !/^\/\/ /.test(l)).join('\n');
const goc = (s) => s.replace(/\s+\/\/ .*$/gm, '');
const dongs = (k, re) => { const l = O(k).split('\n').filter((x) => !x.startsWith('$ ') && re.test(x)); if (!l.length) throw new Error('không thấy dòng trong ' + k + ' ' + re); return l; };
const doan = (k, dau) => { const ls = O(k).split('\n'); const i = ls.findIndex((l) => l.startsWith('$ ') && l.includes(dau)); if (i < 0) throw new Error('không thấy ' + dau); const r = []; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ '); j++) if (ls[j].trim()) r.push(ls[j]); return r; };
const lenh = (k, dau) => O(k).split('\n').find((l) => l.startsWith('$ ') && l.includes(dau)).slice(2).replace(/\s+#.*$/, '');

const BAI = `async function deletePost(postId) {
  'use server';
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');            // authn

  const post = await db.post.findUnique({ where: { id: postId } });
  if (post.authorId !== user.id) throw new Error('Forbidden'); // authz

  await db.post.delete({ where: { id: postId } });
}`;
// ── số đo
const TSC1 = doan('bai', 'chép nguyên'), TSC2 = doan('bai', 'sửa 1');
const HTML = doan('trang', 'curl -b uid=2').join('').split(/(?=#\d+ )/);
const A1 = doan('tan-cong', 'A, KHÔNG cookie')[0], A2 = doan('tan-cong', 'id không tồn tại')[0];
const B1 = doan('tan-cong', 'B: user 2')[0];
const C1 = doan('tan-cong', 'C: user 2 xoá #14')[0], C2 = doan('tan-cong', 'đầu vào rác')[0], C3 = doan('tan-cong', 'C: user 1 xoá')[0];
const LOG = doan('tan-cong', '(log next start)');
const CSDL = dongs('tan-cong', /^CSDL còn/)[0];
const OR1 = doan('cua', 'Origin lạ')[0], OR2 = doan('cua', 'Origin khớp')[0];
const ORLOG = doan('cua', 'x-forwarded-host')[0];
const BODY = doan('cua', 'thân 2 MB')[0], BODYLOG = doan('cua', 'Body exceeded')[0].replace(/^⨯ /, '');
const ID409 = doan('cua', 'id bịa')[0], IDLOG = doan('cua', 'Failed to find')[0];
if (TSC1.length !== 4 || !/TS18047: 'post' is possibly 'null'/.test(TSC2[0])) throw new Error('tsc đổi');
if (!/500/.test(A1) || !/500/.test(A2) || !/200 · 1:\{"ok":true\}/.test(B1) || !/Không tìm thấy/.test(C1) || !/không hợp lệ/.test(C2) || !/ok":true/.test(C3)) throw new Error('tấn công đổi');
if (!LOG.some((l) => /reading 'authorId'/.test(l)) || !LOG.some((l) => /\[B deleteNote\].*xoá #12/.test(l)) || !/#13 \(user 2\) · #14 \(user 1\)$/.test(CSDL)) throw new Error('log/CSDL đổi');
if (!/500/.test(OR1) || !/200/.test(OR2) || !/does not match `origin`/.test(ORLOG) || !/500/.test(BODY) || !/Body exceeded 1 MB/.test(BODYLOG) || !/409/.test(ID409) || !/older or newer deployment/.test(IDLOG)) throw new Error('cổng Next đổi');
const ACT = goc(bo(F('src/app/xoa/actions.ts')));
const khoi = (ten) => { const L = ACT.split('\n'); const a = L.findIndex((l) => l.includes(`function ${ten}(`)); return L.slice(a, L.findIndex((l, i) => i > a && l === '}') + 1).filter((l) => !/console\.log/.test(l)).join('\n'); };
const A_SRC = khoi('deletePost'), B_SRC = khoi('deleteNote'), C_SRC = khoi('xoaGhiChu').replace("if (typeof noteId !== 'number' || !Number.isInteger(noteId) || noteId <= 0) return { error: 'noteId không hợp lệ' };", "if (typeof noteId !== 'number'\n      || !Number.isInteger(noteId) || noteId <= 0)\n    return { error: 'noteId không hợp lệ' };").replace("const { count } = await db.note.deleteMany({ where: { id: noteId, authorId: user.id } });", "const { count } = await db.note.deleteMany({\n    where: { id: noteId, authorId: user.id },\n  });");
const ra = (l) => { const m = l.match(/1:(\{.*\})$/); return m ? `<code>${m[1]}</code>` : l; };
const goi = (s) => s.replace(/^bash goi\.sh /, '');

export const S = [
  { cover: true, nhan: 'Chapter 12 · Lesson 12.5', t: 'Security: an action<br>is a public endpoint', sub: 'It looks like a local function; it is a POST anyone can send. Measured with curl: hiding the button, the lesson\'s checks, a userId argument, the fixed action — and what Next.js already guards for you',
    en: 'Lesson twelve point five: security. A Server Action looks like a local function, but it is a POST anyone can send. With curl we measure hiding the button, the lesson\'s own checks, a user id passed as an argument, the fixed action, and what Next.js already guards for you.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The lesson's <code>deletePost</code> compiled — <code>tsc</code> finds a real bug</li>
    <li>A hidden button protects nothing: one <code>curl</code> per attack</li>
    <li>A <code>userId</code> argument: another user's note deleted</li>
    <li>The fix: identity from the session, a query scoped to the owner, validated input</li>
    <li>Origin, body size, unknown ids: what Next.js checks — and what it never will</li></ul>`,
    en: 'Five takeaways: the lesson\'s deletePost compiled, where tsc finds a real bug; why a hidden button protects nothing; a user id argument that let one user delete another\'s note; the fix — identity from the session, a query scoped to the owner, validated input; and what Next.js checks for you, versus what it never will.' },
  { t: "The lesson's code, compiled: tsc finds the null", body: two(D(tsx(BAI, { sm: true, hl: [6, 7] })),
    D(tn(['$ npx tsc --noEmit   # as written', ...TSC1.map((l) => l.replace(/^bai12-5\//, '')), '$ npx tsc --noEmit   # typed + real imports', ...TSC2.map((l) => l.replace(/^bai12-5\//, ''))].join('\n'), { fs: 13, wrap: 50, title: 'tsc (real)' }),
      box('Read it', 'After the usual fixes one error remains: <code>TS18047 \'post\' is possibly \'null\'</code>. <code>findUnique</code> returns <code>null</code> for an id that does not exist — and the next line reads <code>post.authorId</code>. Measured below what that does at runtime.', 'do2')), 'r64'),
    en: 'The lesson\'s code, compiled. After the usual fixes — a type for postId, real imports for getCurrentUser and db — one error remains: TS one eight zero four seven, post is possibly null. findUnique returns null for an id that does not exist, and the next line reads post dot authorId. We measure what that does at runtime.' },
  { t: 'Hiding the button is not protection', body: two(D(tn(['$ curl -b uid=2 localhost:3000/xoa   # the page user 2 sees', ...HTML.map((l) => l.trim())].join('\n'), { fs: 15, wrap: 60, title: 'curl (real)' }),
      seq(['attacker', 'POST /xoa', 'action'], [[0, 1, 'Next-Action: <id> · [12, 1]'], [1, 2, 'runs — no button involved'], [2, 0, 'HTTP 200 · {"ok":true}', '#c0392b', true]], { w: 540, rh: 46, fs: 15, top: 58 })),
    D(box('Read it', 'User 2 gets buttons only on <b>#13</b>, the note they own. That is a UI choice. The action id is in the bundle (12.1), so the request the button would send can be sent by anyone, with any arguments, from a terminal.', 'lam'),
      box('So', 'Every check must live <b>inside the action</b>, on the server. Below: the lesson\'s action (A), a tempting shortcut (B), and the fix (C) — attacked with <code>curl</code>.', 'xanh')), ''),
    en: 'Hiding the button is not protection. User two sees delete buttons only on the note they own — that is a UI choice. The action id is in the bundle, so the same request can be sent by anyone, with any arguments, from a terminal. Every check must live inside the action. Next we attack three versions with curl.' },
  { t: "Action A — the lesson's logic, attacked", body: two(D(tsx(A_SRC, { sm: true, hl: [3, 5] })),
    D(tn([`$ ${goi(lenh('tan-cong', 'A, KHÔNG cookie'))}   # no cookie`, A1, `$ ${goi(lenh('tan-cong', 'id không tồn tại'))}   # user 2, unknown id`, A2, '# server log', ...LOG.filter((l) => /Not authenticated|TypeError/.test(l))].join('\n'), { fs: 14, wrap: 58, title: 'curl + log (real)' }),
      box('Read it', 'The checks hold, but both answers are a <b>500</b> with only a digest: a thrown error. The unknown id crashed on <code>post.authorId</code> — the null tsc warned about. Return <code>{ error }</code> for expected failures, and handle "not found".', 'do2')), ''),
    en: 'Action A, the lesson\'s logic, attacked. Without a cookie it refuses — with a thrown error, so the caller gets a five hundred and a digest. With an id that does not exist it crashes: cannot read authorId of null — exactly the null tsc warned about. Return an error object for expected failures, and handle not found.' },
  { t: 'Action B — the userId argument: another user\'s note, deleted', body: two(D(tsx(B_SRC, { sm: true, hl: [1, 3] })),
    D(tn([`$ ${goi(lenh('tan-cong', 'B: user 2'))}   # cookie: user 2 · args: note 12, "userId" 1`, B1, '# server log', ...LOG.filter((l) => /\[B /.test(l)), '# database afterwards', CSDL].join('\n'), { fs: 13, wrap: 46, title: 'curl + log + database (real)' }),
      box('Read it', 'The check compares the note\'s owner with a <code>userId</code> that <b>the caller chose</b>. User 2 sent <code>[12, 1]</code> — "I am user 1" — and note #12 of user 1 is gone. It reads correctly in review and protects nothing.', 'do2')), 'r64'),
    en: 'Action B takes the user id as a parameter, because the only caller is our own form. But the caller controls every argument: logged in as user two, we sent note twelve and user id one, the action believed it, and user one\'s note is gone. It reads correctly in code review and protects nothing.' },
  { t: 'Action C — session, scoped query, validated input', body: two(D(tsx(C_SRC, { sm: true, hl: [2, 4, 7] }), tn([...LOG.filter((l) => /\[C /.test(l)), CSDL].join('\n'), { fs: 14, wrap: 70, title: 'log + database (real)' })),
    D(cmp(['Attack (curl)', 'C answers'], [
        ["user 2 → #14 (user 1's)", ra(C1)], ['user 2 → <code>"14 OR 1=1"</code>', ra(C2)], ['user 1 → #15 (own)', ra(C3)],
      ]),
      box('Read it', 'Identity from the <b>session</b>; the delete is <b>scoped</b> to the owner (0 rows otherwise, no null to forget); input checked first — Zod in Chapter 16.', 'xanh')), 'r64'),
    en: 'Action C: identity from the session, never from an argument; a delete scoped to the owner, so another user\'s note matches zero rows — no separate lookup and no null to forget; and the input checked first. Measured: user two deleting user one\'s note gets not found, garbage input is rejected, and user one deletes their own note.' },
  { t: 'What Next.js already checks — and what it never will', body: cmp(['Request (curl, real)', 'Next.js 16 answers', 'server log'], [
      ['<code>Origin: http://evil.example</code>', OR1.split(' · ')[0], ORLOG.slice(0, 82) + '…'],
      ['<code>Origin</code> matching the host', OR2.split(' · ')[0], 'the action ran'],
      ['a 2 MB argument', BODY.split(' · ')[0], BODYLOG],
      ['an id not in this build', ID409, IDLOG.slice(0, 70) + '…'],
    ]) + two(box('Built in', 'Actions are POST-only and the <code>Origin</code> must match the host — a page on another site cannot submit them for your users (CSRF). Bodies are capped at <b>1 MB</b> (<code>serverActions.bodySizeLimit</code>). Unknown or unused ids are refused.', 'xanh'),
      box('Never built in', 'None of this knows <b>who</b> the user is or <b>which rows</b> they own. curl without an <code>Origin</code> header went straight through. Authentication, authorization, validation and rate limits are yours.', 'do2'), ''),
    en: 'What Next.js already checks. A request whose Origin does not match the host is refused — a page on another site cannot submit your actions for your users. Bodies over one megabyte are refused. An id that is not in this build gets a four oh nine. But none of this knows who the user is or which rows they own; curl without an Origin went straight through. Authentication, authorization, validation and rate limits are yours.' },
  { t: 'The four checks every mutating action needs', body: icards([
      ['key', '1 · Who is calling?', 'Read the session <b>inside</b> the action. Never accept a user id, role or price as an argument.'],
      ['lock', '2 · May they touch this record?', 'Scope the query: <code>where: { id, authorId: user.id }</code> — 0 rows for anyone else.'],
      ['check', '3 · Is the input valid?', 'Every argument and FormData field is attacker-controlled text. Parse it with a schema.'],
      ['gauge', '4 · Should it be rate-limited?', 'Mail, payments, anything enumerable: a public endpoint needs a limit.'],
    ], 2) + box('And', 'Return <code>{ error }</code> for expected failures (12.4) · only export real actions from a <code>\'use server\'</code> file — every export a client imports gets a callable id (12.1).', 'lam'),
    en: 'Four checks for every mutating action: who is calling, read from the session inside the action; may they touch this record, by scoping the query to the owner; is the input valid, since every argument is attacker-controlled; and should it be rate-limited. Return errors for expected failures, and only export real actions from a use server file.' },
  { t: 'cuongthai.com: the same class of bug', body: two(D(box('From the project\'s reviews', 'Write paths — uploads, sockets — that trusted the client instead of re-checking on the server had to be patched. A Server Action is exactly such a write path: the pretty form in front changes nothing about who can reach it.', 'lam'),
      box('In this repo today (12.3)', 'The public <code>/api/revalidate</code> route skips its secret check when the variable is empty (<code>if (envSecret &amp;&amp; …)</code>). A guard must <b>fail closed</b>: no secret configured ⇒ refuse.', 'do2')),
    D(seq(['anyone', 'endpoint', 'database'], [[0, 1, 'POST + crafted args'], [1, 1, 'session? owner? input?', '#1f8a3b'], [1, 2, 'scoped write', '#1f8a3b'], [1, 0, '{ error } or { ok }', '#1f8a3b', true]], { w: 520, rh: 50, fs: 16, top: 58 })), ''),
    en: 'The same class of bug on this course\'s own site: write paths that trusted the client had to be patched, and a Server Action is exactly such a write path. And in the repo today, the public revalidate route skips its secret check when the variable is empty. A guard must fail closed: no secret configured means refuse.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Public endpoint', 'callable by curl with any arguments'), kw('Authentication', 'who: from the session, inside the action'),
      kw('Authorization', 'may they: a query scoped to the owner'), kw('Input validation', 'every argument is attacker text'),
      kw('userId argument', 'the caller picks it — never trust it'), kw('Origin check', 'built in: blocks cross-site submits'),
      kw('bodySizeLimit', '1 MB by default'), kw('Fail closed', 'missing secret or session ⇒ refuse'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: public endpoint; authentication; authorization; input validation; the user id argument trap; the built-in Origin check; the one megabyte body limit; and failing closed.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Copy the lesson's ${c('deletePost')} into a ${c('.ts')}; read the ${c('TS18047')} and call it with an unknown id`,
      `Find an action id in ${c('.next/server/server-reference-manifest.json')}; call it with ${c('curl')} and no cookie`,
      `Write ${c('deleteNote(noteId, userId)')}; delete another user's note with one ${c('curl')}`,
      `Rewrite it: session inside, ${c('deleteMany({ where: { id, authorId } })')}, input checked; replay the attack`,
    ]), box('Keep these', `<ul><li>An action = a public POST</li><li>Hidden buttons protect nothing</li><li>Identity from the session, never an argument</li><li>Scope every query to the owner</li><li>Next.js checks Origin and size — not users</li></ul>`, 'lam'), ''),
    en: 'Your turn: compile the lesson\'s deletePost and call it with an unknown id; find an action id in the manifest and call it with curl and no cookie; write the userId version and delete another user\'s note; then rewrite it with the session, a scoped delete and input checks, and replay the attack. Keep: an action is a public POST; identity comes from the session; scope every query to the owner; and Next.js checks origin and size, not users.' },
];
export const slides = lamDeck({ chuong: 'Chapter 12 — Server Actions', bai: '12.5' }, S);
