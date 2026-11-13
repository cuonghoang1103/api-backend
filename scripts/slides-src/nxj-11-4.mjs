/*DU_LIEU*/
const DU_LIEU = {
 "n11-4:file:src/app/dashboard/layout.tsx": "// app/dashboard/layout.tsx — mỗi thư mục @slot thành MỘT prop cùng tên\nexport default function Layout({ children, team, analytics }: {\n  children: React.ReactNode; team: React.ReactNode; analytics: React.ReactNode;\n}) {\n  return (\n    <main className=\"p-4 font-sans text-xl\">\n      {children}\n      <div className=\"mt-3 grid grid-cols-2 gap-3\">\n        <section className=\"rounded border p-3\">{team}</section>\n        <section className=\"rounded border p-3\">{analytics}</section>\n      </div>\n    </main>\n  );\n}\n",
 "n11-4:file:src/app/dashboard/page.tsx": "export default function Page() { return <h1 className=\"text-2xl font-bold\">Dashboard</h1>; }\n",
 "n11-4:file:src/app/dashboard/@team/page.tsx": "export default function Team() { return <p>👥 Nhóm: An, Bình, Chi</p>; }\n",
 "n11-4:file:src/app/dashboard/@analytics/page.tsx": "export default function Analytics() { return <p>📈 Doanh thu: 42 đơn</p>; }\n",
 "n11-4:bai": "$ npx tsc --noEmit      # layout.tsx chép nguyên đoạn mã của bài\ndashboard/layout.tsx(2,34): error TS7031: Binding element 'children' implicitly has an 'any' type.\ndashboard/layout.tsx(2,44): error TS7031: Binding element 'team' implicitly has an 'any' type.\ndashboard/layout.tsx(2,50): error TS7031: Binding element 'analytics' implicitly has an 'any' type.",
 "n11-4:trang": "$ npx next typegen >/dev/null 2>&1; npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ grep -A4 \"'/dashboard'\" .next/types/routes.d.ts | head -6\n   * export default function Layout(props: LayoutProps<'/dashboard'>) {\n   *   return <div>{props.children}</div>\n   * }\n   * ```\n   */\n$ npm run build\n✓ Compiled successfully in 1991ms\n└ ○ /dashboard\n$ for u in /dashboard /dashboard/@team /@team; do curl -s -o /dev/null -w \"%{http_code}\" localhost:3000$u; done\n/dashboard         200\n/dashboard/@team   404\n/dashboard/team    404\n/@team             404\n$ curl -s localhost:19390/dashboard | sed 's/<!-- -->//g' | grep -o '<h1[^>]*>[^<]*\\|<section[^>]*><p>[^<]*' | sed 's/<[^>]*>//g'\nDashboard\n👥 Nhóm: An, Bình, Chi\n📈 Doanh thu: 42 đơn",
 "n11-4:file:src/app/bang/layout.tsx": "// app/bang/layout.tsx — hai khe đứng cạnh nhau\nexport default function Layout({ children, team, analytics }: {\n  children: React.ReactNode; team: React.ReactNode; analytics: React.ReactNode;\n}) {\n  return (\n    <main className=\"p-4 font-sans text-xl\">\n      {children}\n      <div className=\"mt-3 grid grid-cols-2 gap-3\">\n        <section className=\"rounded border p-3\">{team}</section>\n        <section className=\"rounded border p-3\">{analytics}</section>\n      </div>\n    </main>\n  );\n}\n",
 "n11-4:file:src/app/bang/page.tsx": "export default function Page() { return <h1 className=\"text-2xl font-bold\">Bảng điều khiển — TIEU-DE</h1>; }\n",
 "n11-4:file:src/app/bang/@team/page.tsx": "import { connection } from 'next/server';\nexport default async function Team() {\n  await connection();\n  return <p>👥 Nhóm: An, Bình, Chi — NHOM</p>;\n}\n",
 "n11-4:file:src/app/bang/@analytics/page.tsx": "// khe chậm: một truy vấn thống kê mất 1,5 giây\nimport { connection } from 'next/server';\nexport default async function Analytics() {\n  await connection();\n  await new Promise((r) => setTimeout(r, 1500));\n  return <p>📈 Doanh thu: 42 đơn — THONG-KE</p>;\n}\n",
 "n11-4:file:src/app/bang/@analytics/loading.tsx": "export default function Loading() { return <p className=\"text-gray-500\">⏳ đang tính thống kê… DANG-TAI</p>; }\n",
 "n11-4:tai": "# /bang2 = y hệt /bang nhưng KHÔNG có @analytics/loading.tsx\n$ npm run build 2>&1 | grep -E '/bang'\n├ ƒ /bang\n├ ƒ /bang2\n$ node luong.mjs localhost:3000/bang TIEU-DE NHOM DANG-TAI THONG-KE      # khe chậm CÓ loading.tsx riêng\n+  44 ms · mẩu 1 ·  1869 B · có: TIEU-DE, NHOM, DANG-TAI\n+  44 ms · mẩu 2 ·  7639 B · có: TIEU-DE, NHOM, DANG-TAI\n+1537 ms · mẩu 3 ·   122 B · có: THONG-KE\n+1537 ms · mẩu 4 ·   933 B · có: THONG-KE\n+1538 ms · mẩu 5 ·    14 B\n$ node luong.mjs localhost:3000/bang2 TIEU-DE NHOM DANG-TAI THONG-KE     # KHÔNG có loading.tsx trong khe\n+1539 ms · mẩu 1 ·  1723 B · có: TIEU-DE, NHOM, THONG-KE\n+1539 ms · mẩu 2 ·  7472 B · có: TIEU-DE, NHOM, THONG-KE\n+1539 ms · mẩu 3 ·    14 B",
 "n11-4:file:src/app/loi/layout.tsx": "export default function Layout({ children, team, analytics }: {\n  children: React.ReactNode; team: React.ReactNode; analytics: React.ReactNode;\n}) {\n  return (\n    <main className=\"p-4 font-sans text-xl\">\n      {children}\n      <div className=\"mt-3 grid grid-cols-2 gap-3\">\n        <section className=\"rounded border p-3\">{team}</section>\n        <section className=\"rounded border p-3\">{analytics}</section>\n      </div>\n    </main>\n  );\n}\n",
 "n11-4:file:src/app/loi/page.tsx": "export default function Page() { return <h1 className=\"text-2xl font-bold\">Bảng điều khiển</h1>; }\n",
 "n11-4:file:src/app/loi/@team/page.tsx": "export default function Team() { return <p>👥 Nhóm: An, Bình, Chi</p>; }\n",
 "n11-4:file:src/app/loi/@analytics/page.tsx": "// khe hỏng: truy vấn thống kê ném lỗi\nimport { connection } from 'next/server';\nexport default async function Analytics(): Promise<React.ReactNode> {\n  await connection();\n  throw new Error('CSDL thống kê không trả lời');\n}\n",
 "n11-4:file:src/app/loi/@analytics/error.tsx": "'use client';\nexport default function Loi({ reset }: { reset: () => void }) {\n  return <p className=\"text-red-600\">⚠️ Thống kê đang lỗi <button onClick={reset} className=\"underline\">thử lại</button></p>;\n}\n",
 "n11-4:loi": "# /loi2 = y hệt /loi nhưng KHÔNG có @analytics/error.tsx\n$ npm run build 2>&1 | grep -E '/loi'\n├ ƒ /loi\n└ ƒ /loi2\n$ for u in /loi /loi2; do printf '%-6s HTTP %s\\n' \"$u\" \"$(curl -s -o /dev/null -w '%{http_code}' localhost:19390$u)\"; done\n/loi   HTTP 500\n/loi2  HTTP 500",
 "n11-4:file:src/app/dash/layout.tsx": "// app/dash/layout.tsx — có liên kết sang /dash/settings\nimport Link from 'next/link';\nexport default function Layout({ children, team, analytics }: {\n  children: React.ReactNode; team: React.ReactNode; analytics: React.ReactNode;\n}) {\n  return (\n    <main className=\"p-4 font-sans text-xl\">\n      <nav className=\"mb-2 flex gap-4 text-blue-600 underline\"><Link href=\"/dash\" id=\"l-home\">/dash</Link><Link href=\"/dash/settings\" id=\"l-set\">/dash/settings</Link></nav>\n      {children}\n      <div className=\"mt-3 grid grid-cols-2 gap-3\">\n        <section className=\"rounded border p-3\">{team}</section>\n        <section className=\"rounded border p-3\">{analytics}</section>\n      </div>\n    </main>\n  );\n}\n",
 "n11-4:file:src/app/dash/page.tsx": "export default function Page() { return <h1 className=\"text-2xl font-bold\">Trang chính</h1>; }\n",
 "n11-4:file:src/app/dash/@team/page.tsx": "export default function Team() { return <p>👥 Nhóm — trang chính</p>; }\n",
 "n11-4:file:src/app/dash/@team/settings/page.tsx": "export default function TeamSettings() { return <p>⚙️ Nhóm — cài đặt</p>; }\n",
 "n11-4:file:src/app/dash/@analytics/page.tsx": "export default function Analytics() { return <p>📈 Thống kê — trang chính</p>; }\n",
 "n11-4:mac": "# chỉ @team có settings/ — @analytics và children KHÔNG có, cũng KHÔNG có default.tsx\n$ npm run build 2>&1 | grep -E '/dash|Error|default|parallel' | head -8\n⚠ Strict route matching is enabled by default. This validation indicates a bug in your app's route structure, but you can temporarily restore loose route matching by setting `deprecated.looseRouteMatching` to `true` in your Next.js config.\nError: Turbopack build failed with 2 errors:\n./src/app/dash/layout.tsx\nError: Parallel route slots cannot render the same URLs\nThe following layouts have parallel route slots that cannot render the same URLs:\napp/dash/layout.tsx\n- /dash/settings is missing a matching page or default.tsx in @analytics, children\nEvery URL matched by one slot must have a matching page or default.tsx in every sibling slot.\n$ for u in /dash /dash/settings; do printf '%-15s HTTP %s\\n' \"$u\" \"$(curl -s -o /dev/null -w '%{http_code}' localhost:19390$u)\"; done\n/dash           HTTP 000\n/dash/settings  HTTP 000",
 "n11-4:file:src/app/dash/@analytics/default.tsx": "export default function Default() { return <p>📈 Thống kê — (không có gì cho URL này)</p>; }\n",
 "n11-4:file:src/app/dash/default.tsx": "export default function Default() { return null; }\n",
 "n11-4:macsua": "$ npm run build 2>&1 | grep -E '/dash|Error' | head -6\n├ ○ /dash\n├ ○ /dash/settings\n├ ○ /dashboard\n$ for u in /dash /dash/settings; do printf '%-15s HTTP %s\\n' \"$u\" \"$(curl -s -o /dev/null -w '%{http_code}' localhost:19390$u)\"; done\n/dash           HTTP 200\n/dash/settings  HTTP 200\n$ curl -s localhost:19390/dash/settings | sed 's/<!-- -->//g' | grep -o '<section[^>]*><p>[^<]*' | sed 's/<[^>]*>//g'\n⚙️ Nhóm — cài đặt\n📈 Thống kê — (không có gì cho URL này)\n$ node -e \"const d=require('$HOME/Documents/video-bai-giang/scratchpad/nxj/demo/out/anh-nxj-11-4.json'); console.log('bấm Link /dash → /dash/settings (Next 16):', d['mem16'].ketQua.khe)\"\nbấm Link /dash → /dash/settings (Next 16): 📈 Thống kê — trang chính | h1: Trang chính\n$ echo \"tải thẳng /dash/settings (Next 16): số thẻ h1 = $(curl -s localhost:19390/dash/settings | grep -o '<h1' | wc -l | tr -d ' ') · khe analytics: $(curl -s localhost:19390/dash/settings | sed 's/<!-- -->//g' | grep -o '<section[^>]*><p>[^<]*' | sed 's/<[^>]*>//g' | tail -1)\"\ntải thẳng /dash/settings (Next 16): số thẻ h1 = 0 · khe analytics: 📈 Thống kê — (không có gì cho URL này)",
 "n11-4:kho": "$ find frontend/src/app -type d -name '@*' | wc -l      # kho cuongthai.com\n0\n$ find frontend/src/app -name 'default.tsx' | wc -l\n0",
 "n11-4:file:app/dash/layout.jsx": "// CÙNG cấu trúc trên Next.js 14.2.35 — chỉ @team có settings/, KHÔNG default.js\nimport Link from 'next/link';\nexport default function Layout({ children, team, analytics }) {\n  return (\n    <main style={{ padding: 16, fontFamily: 'sans-serif', fontSize: 20 }}>\n      <nav style={{ display: 'flex', gap: 16 }}><Link href=\"/dash\" id=\"l-home\">/dash</Link><Link href=\"/dash/settings\" id=\"l-set\">/dash/settings</Link></nav>\n      {children}\n      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>\n        <section style={{ border: '1px solid #ccc', padding: 12 }}>{team}</section>\n        <section style={{ border: '1px solid #ccc', padding: 12 }}>{analytics}</section>\n      </div>\n    </main>\n  );\n}\n",
 "n11-4:file:app/dash/page.jsx": "export default function Page() { return <h1>Trang chính</h1>; }\n",
 "n11-4:file:app/dash/@team/page.jsx": "export default function Team() { return <p>👥 Nhóm — trang chính</p>; }\n",
 "n11-4:file:app/dash/@team/settings/page.jsx": "export default function TeamSettings() { return <p>⚙️ Nhóm — cài đặt</p>; }\n",
 "n11-4:file:app/dash/@analytics/page.jsx": "export default function Analytics() { return <p>📈 Thống kê — trang chính</p>; }\n",
 "n11-4:v14": "$ npx next --version\nNext.js v14.2.35\n$ npm run build 2>&1 | grep -E '/dash|rror' | head -6\n├ ○ /dash                                154 B          87.4 kB\n└ ○ /dash/settings                       154 B          87.4 kB\n$ for u in /dash /dash/settings; do printf '%-15s HTTP %s   (Next.js 14, tải thẳng)\\n' \"$u\" \"$(curl -s -o /dev/null -w '%{http_code}' localhost:19387$u)\"; done\n/dash           HTTP 200   (Next.js 14, tải thẳng)\n/dash/settings  HTTP 200   (Next.js 14, tải thẳng)\n$ node -e \"const d=require('$HOME/Documents/video-bai-giang/scratchpad/nxj/demo/out/anh-nxj-11-4.json'); console.log('bấm Link sang /dash/settings (Next 14) ⇒ thanh địa chỉ:', d['v14-mem'].ketQua.duong, '· khe analytics vẫn:', d['v14-mem'].ketQua.khe)\"\nbấm Link sang /dash/settings (Next 14) ⇒ thanh địa chỉ: /dash/settings · khe analytics vẫn: 📈 Thống kê — trang chính"
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, box, two, steps, kw, c, cmp, br, tree, icards, gantt } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-11-4', code: 'NXJ 11.4', title: 'Parallel routes: several pages in one layout', sub: 'Chapter 11 · Lesson 11.4' };
const O = (k) => { const v = DU_LIEU[`n11-4:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const B = (ten, o) => br('nxj-11-4', ten, { vp: 640, ...o });
const F = (p) => O(`file:${p}`).trim();
const goc = (s) => s.replace(/\s+\/\/ .*$/gm, '');
const bo = (s) => s.split('\n').filter((l) => !/^\/\/ /.test(l)).join('\n');
const dongs = (k, re) => { const l = O(k).split('\n').filter((x) => !x.startsWith('$ ') && re.test(x)); if (!l.length) throw new Error('không thấy dòng trong ' + k + ' ' + re); return l; };
const doan = (k, dau) => { const ls = O(k).split('\n'); const i = ls.findIndex((l) => l.startsWith('$ ') && l.includes(dau)); if (i < 0) throw new Error('không thấy ' + dau); const r = []; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ ') && !ls[j].startsWith('# '); j++) if (ls[j].trim()) r.push(ls[j]); return r; };

// đoạn mã của bài (khối layout), chép nguyên — tsc đo ở khối "bai"
const BAI = `// layout.tsx receives each @slot as a prop, named after the folder
export default function Layout({ children, team, analytics }) {
  return (
    <>
      {children}
      <section>{team}</section>
      <section>{analytics}</section>
    </>
  );
}`;
// ── số đo (chặn: dữ liệu đổi ⇒ deck không dựng)
const TSC = dongs('bai', /error TS7031/);
const URLS = dongs('trang', /^\/(dashboard|@team)/);
const HTML = doan('trang', "grep -o '<h1");
const ms = (k, dau) => doan(k, dau).map((l) => { const m = /^\+\s*(\d+) ms · mẩu (\d+) ·\s+(\d+) B(?: · có: (.*))?$/.exec(l); if (!m) throw new Error('dòng luồng lạ ' + l); return { ms: +m[1], co: (m[4] ?? '').split(', ').filter(Boolean) }; });
const L1 = ms('tai', 'luong.mjs localhost:3000/bang '), L2 = ms('tai', 'luong.mjs localhost:3000/bang2');
const khi = (L, x) => L.find((m) => m.co.includes(x))?.ms;
const LOI = dongs('loi', /^\/loi2? +HTTP/);
const MAC = dongs('mac', /Strict route|Parallel route slots|missing a matching|Every URL/);
const SUA = dongs('macsua', /^\/dash|^⚙️|^📈/);
const V14 = dongs('v14', /^\/dash|bấm Link|^Next\.js v14/);
const M16 = dongs('macsua', /bấm Link|tải thẳng/);
const KHO = O('kho').split('\n').filter((l) => /^\d+$/.test(l.trim()));
if (TSC.length !== 3) throw new Error('tsc layout đổi');
if (!/^\/dashboard +200/.test(URLS[0]) || !URLS.slice(1).every((l) => /404/.test(l))) throw new Error('URL slot đổi');
if (khi(L1, 'NHOM') > 200 || khi(L1, 'THONG-KE') < 1400 || khi(L2, 'NHOM') < 1400) throw new Error('luồng đổi');
if (LOI.join() !== '/loi   HTTP 500,/loi2  HTTP 500') throw new Error('lỗi khe đổi');
if (!MAC.some((l) => /missing a matching page or default\.tsx in @analytics, children/.test(l))) throw new Error('lỗi build default đổi');
if (!V14.some((l) => /\/dash\/settings +HTTP 200/.test(l)) || !V14.some((l) => /trang chính/.test(l))) throw new Error('Next 14 đổi');
if (KHO.join() !== '0,0') throw new Error('kho đổi');

const LAYOUT = goc(bo(F('src/app/dashboard/layout.tsx'))).replace(/ className="[^"]*"/g, '')
  .replace(/export default function Layout\(\{ children, team, analytics \}: \{\n[^\n]*\n\}\) \{/, 'export default function Layout(\n  { children, team, analytics }: Props\n) {');
if (!/: Props\n\) \{/.test(LAYOUT)) throw new Error('mã layout đổi');

export const S = [
  { cover: true, nhan: 'Chapter 11 · Lesson 11.4', t: 'Parallel routes:<br>several pages in one layout', sub: 'Named @slots, each a prop of the layout, each loading and failing on its own. Measured: streaming per slot, an error per slot, and default.tsx — which Next.js 16 now enforces at build',
    en: 'Lesson eleven point four: parallel routes — several pages rendered into one layout at once. Named at-slots become props of the layout, and each loads and fails on its own. We measure streaming per slot, an error per slot, and default dot tsx, which Next.js sixteen now enforces at build time.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>A slot is a folder named <code>@name</code>: not in the URL, a <b>prop</b> of the layout</li>
    <li>The lesson's layout compiled: TS7031 ×3 — and the generated <code>LayoutProps</code></li>
    <li>Each slot <b>streams</b> on its own (44 ms vs 1.5 s, measured) and <b>fails</b> on its own</li>
    <li><code>default.tsx</code>: Next.js 16 refuses to build without it; 14 shows a 404 on reload</li>
    <li>Soft vs hard navigation: the same URL, two different screens</li></ul>`,
    en: 'Five takeaways: a slot is a folder named with an at sign, not part of the URL but a prop of the layout; the lesson\'s layout compiled, with three TS seven oh three one errors and the generated LayoutProps; each slot streams and fails on its own; default dot tsx — Next.js sixteen refuses to build without it, fourteen shows a four oh four on reload; and soft versus hard navigation giving two screens for one URL.' },
  { t: 'A slot is a folder named @name', body: two(D(tree(['src/app/dashboard/', '   layout.tsx          // gets the slots', '   page.tsx            // = children', '*  @team/page.tsx      // slot team', '*  @analytics/page.tsx // slot analytics'], { fs: 17 }),
      tn(['$ curl … (status)', ...URLS, '$ curl -s …/dashboard | grep …  # the HTML', ...HTML].join('\n'), { fs: 15, title: 'next start + curl (real)' })),
    D(tsx(LAYOUT, { sm: true, hl: [2, 9, 10] }),
      box('Read it', 'The <code>@</code> folder is <b>not</b> a URL segment (<code>/dashboard/@team</code> ⇒ 404). Each slot arrives as a <b>prop</b> named after the folder; <code>page.tsx</code> is the implicit <code>children</code> slot. One URL, three pages, in one HTML.', 'xanh')), ''),
    en: 'A slot is a folder whose name starts with an at sign. It is not a URL segment — slash dashboard slash at team is a four oh four — instead it arrives in the layout as a prop with the folder\'s name, and page dot tsx is the implicit children slot. One URL, three pages, in one HTML response.' },
  { t: 'The lesson\'s layout, compiled: TS7031 ×3', body: two(D(tsx(BAI, { sm: true, hl: [2] }),
      tn(['$ npx tsc --noEmit', ...TSC].join('\n'), { fs: 13, wrap: 72, title: 'tsc (real) — layout.tsx as written' })),
    D(tsx(`export default function Layout({
  children, team, analytics,
}: {
  children: React.ReactNode;
  team: React.ReactNode;
  analytics: React.ReactNode;
}) { … }`, { sm: true, hl: [5, 6, 7] }),
      box('Or let Next type it', '<code>next typegen</code> (and every build) writes a global helper: <code>LayoutProps&lt;\'/dashboard\'&gt;</code> knows the slot names from the folders — a renamed slot becomes a type error.', 'lam')), ''),
    en: 'The lesson\'s layout, copied into a TypeScript project: three TS seven oh three one errors, one per destructured prop. Type the props as React nodes — or use the generated LayoutProps helper, which reads the slot names from your folders, so renaming a slot becomes a type error.' },
  { t: 'Measured: each slot streams on its own', body: two(D(gantt([
      ['/bang · title + team', 0, khi(L1, 'NHOM'), '#1f8a3b', `${khi(L1, 'NHOM')} ms`], ['/bang · loading.tsx of @analytics', 0, khi(L1, 'DANG-TAI'), '#94a3b8', `${khi(L1, 'DANG-TAI')} ms`], ['/bang · analytics', 0, khi(L1, 'THONG-KE'), '#0070f3', `${khi(L1, 'THONG-KE')} ms`],
      ['/bang2 · everything', 0, khi(L2, 'NHOM'), '#b91c1c', `${khi(L2, 'NHOM')} ms`]], { w: 560, nhan: 260, fs: 15, buoc: 500, rh: 40 }),
      tn([...doan('tai', 'luong.mjs localhost:3000/bang ').slice(0, 3), '…', ...doan('tai', 'luong.mjs localhost:3000/bang2').slice(0, 1)].join('\n'), { fs: 13, wrap: 64, title: 'node luong.mjs — chunks as they arrive (real)' })),
    D(B('bang-400', { url: 'localhost:3000/bang · at 400 ms', h: 120, w: 480 }), B('bang', { url: 'localhost:3000/bang · at 2 s', h: 120, w: 480 }),
      box('Read it', '<code>@analytics</code> waits 1.5 s and has its <b>own</b> <code>loading.tsx</code>: the title and the team arrive at 44 ms, the spinner too, the numbers stream in at ~1.5 s. Without that file (<code>/bang2</code>) the whole page waits.', 'xanh')), 'r64'),
    en: 'Measured: each slot streams on its own. The analytics slot waits one and a half seconds and has its own loading dot tsx: the title and the team panel arrive after forty-four milliseconds together with the slot\'s spinner, and the numbers stream in at about one point five seconds. The copy without that loading file makes the whole page wait.' },
  { t: 'Measured: each slot fails on its own', body: two(D(tsx(goc(bo(F('src/app/loi/@analytics/page.tsx'))).replace('Analytics(): Promise<React.ReactNode> {', 'Analytics():\n  Promise<React.ReactNode> {') + '\n' + goc(bo(F('src/app/loi/@analytics/error.tsx'))).replace(/ className="[^"]*"/g, '').replace('return <p>⚠️ Thống kê đang lỗi <button onClick={reset}>thử lại</button></p>;', 'return <p>⚠️ Thống kê đang lỗi\n    <button onClick={reset}>thử lại</button></p>;').replace('export default function Loi({ reset }: { reset: () => void }) {', 'export default function Loi(\n  { reset }: { reset: () => void }\n) {'), { sm: true, hl: [5] }),
      tn(['$ curl -s -o /dev/null -w "%{http_code}" …', ...LOI].join('\n'), { fs: 16, title: 'next start + curl (real)' })),
    D(B('loi', { url: 'localhost:3000/loi · @analytics/error.tsx', h: 110, w: 500 }), B('loi2', { url: 'localhost:3000/loi2 · no error.tsx', h: 220, w: 500 }),
      box('Read it', 'Own <code>error.tsx</code>: the slot shows its error UI, the team panel stays. Without it the <b>whole page</b> fails. Either way: status <b>500</b> — monitoring still sees it.', 'lam')), ''),
    en: 'Each slot fails on its own — if you give it an error dot tsx. With one, the analytics slot shows its retry message and the team panel stays. Without it, the whole page fails. And in both cases the HTTP status is five hundred, so your monitoring sees the failure even when users still get a useful page.' },
  { t: 'default.tsx: Next.js 16 refuses to build without it', body: two(D(tree(['src/app/dash/', '   layout.tsx · page.tsx', '   @team/page.tsx', '*  @team/settings/page.tsx   // only here', '   @analytics/page.tsx       // no settings/'], { fs: 17 }),
      tn(['$ npm run build', ...MAC].join('\n'), { fs: 13, wrap: 64, title: 'next build 16.4.6 (real)' })),
    D(tree(['src/app/dash/', '*  default.tsx            // null', '*  @analytics/default.tsx // placeholder'], { fs: 17 }),
      tn(['$ npm run build && curl …', ...SUA].join('\n'), { fs: 15, title: 'the fix (real)' }),
      box('Read it', '<code>/dash/settings</code> exists only in <code>@team</code>. Every sibling slot — <b>including <code>children</code></b> — needs a page or a <code>default.tsx</code> for that URL. Next.js 16 checks it at build ("strict route matching").', 'xanh')), 'r64'),
    en: 'default dot tsx. slash dash slash settings exists only in the team slot. On Next.js sixteen the build stops: parallel route slots cannot render the same URLs — slash dash slash settings is missing a matching page or default dot tsx in at analytics and in children. Add a default for each, including children, and it builds and serves the settings URL.' },
  { t: 'Same folders on Next.js 14: the lesson\'s trap', body: two(D(tn(['$ npm run build && next start   # Next.js 14.2.35, NO default.js', ...V14].join('\n'), { fs: 14, wrap: 64, title: 'Next.js 14.2.35 (real)' }),
      box('The trap, measured', 'Click the Link: the URL becomes <code>/dash/settings</code>, <code>@team</code> switches, <code>@analytics</code> and the title <b>keep their old state</b> — it looks fine. Reload: the page is a <b>404 page served with status 200</b>. It only shows on a direct link or a refresh.', 'do2')),
    D(B('v14-mem', { url: 'Next 14 · after clicking the Link', h: 220, w: 400 }), B('v14-cung', { url: 'Next 14 · reload /dash/settings', h: 200, w: 400 })), 'r64'),
    en: 'The same folders on Next.js fourteen show the lesson\'s trap. Click the link and the URL becomes slash dash slash settings; the team slot switches while analytics and the title keep their old state, so everything looks fine. Reload, and you get a four oh four page — served with status two hundred. It only appears on a direct link or a refresh. Sixteen turns this into a build error.' },
  { t: 'Soft vs hard navigation: one URL, two screens', body: two(D(tn(M16.join('\n'), { fs: 13, wrap: 60, title: 'Next.js 16.4.6, with the default.tsx files (real)' }),
      cmp(['/dash/settings', 'title (children)', '@team', '@analytics'], [
        ['after clicking a Link', 'kept: "Trang chính"', 'settings', 'kept: main page'],
        ['typed / reloaded', 'default.tsx: nothing', 'settings', 'default.tsx'],
      ])),
    D(B('mem16', { url: 'click → /dash/settings', h: 160, w: 400 }), B('cung-sua', { url: 'reload /dash/settings', h: 160, w: 400 }),
      box('So', 'Soft navigation keeps a slot\'s last state; a hard load has no state, so <code>default.tsx</code> renders. Design <code>default.tsx</code> as a real screen, not an afterthought.', 'lam')), 'r64'),
    en: 'Soft versus hard navigation: one URL, two screens. After clicking a link to slash dash slash settings, the title and the analytics slot keep their previous state. Type or reload the same URL and there is no state, so the default files render: no title, and the analytics placeholder. Design default dot tsx as a real screen.' },
  { t: 'When parallel routes beat plain components', body: icards([
      ['gauge', 'Independent loading', 'Each slot has its own <code>loading.tsx</code> — a slow panel streams in late without blocking the rest.'],
      ['warn', 'Independent errors', 'Each slot has its own <code>error.tsx</code> — one failing widget, not a failing page.'],
      ['map', 'Independent navigation', 'A slot can have sub-URLs of its own (<code>@team/settings</code>) while others stay put.'],
      ['layers', 'The modal pattern', 'A slot that shows a modal over the page — Lesson 11.5 combines it with intercepting routes.'],
    ], 2) + two(box('Otherwise: just components', 'If the sections never load, fail or navigate separately, plain components in one page are simpler.', ''),
      box(`cuongthai.com: ${KHO[0]} slots`, `The site uses <b>${KHO[0]}</b> <code>@slot</code> folders and <b>${KHO[1]}</b> <code>default.tsx</code> today — a multi-widget admin dashboard is where they would fit.`, 'lam'), ''),
    en: 'When do parallel routes beat plain components? When sections must load independently, fail independently, or navigate independently — and for the modal pattern of the next lesson. Otherwise, plain components are simpler. This course\'s own site has zero slot folders today; a multi-widget admin dashboard is where they would fit.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Parallel routes', 'several pages rendered into one layout'), kw('Slot (@folder)', 'a prop of the layout, not a URL segment'),
      kw('children', 'the implicit slot = page.tsx'), kw('LayoutProps<\'/x\'>', 'generated type with the slot names'),
      kw('Per-slot loading / error', 'its own Suspense and error boundary'), kw('default.tsx', 'what a slot renders when the URL has no match'),
      kw('Strict route matching', 'Next 16: missing default.tsx = build error'), kw('Soft vs hard navigation', 'kept state vs default.tsx'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: parallel routes; the slot folder; children as the implicit slot; the generated LayoutProps; per-slot loading and error; default dot tsx; strict route matching; and soft versus hard navigation.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Add ${c('@feed')} and ${c('@sidebar')} to a layout; type the props (or ${c("LayoutProps<'/x'>")})`,
      `Make ${c('@feed')} wait 1.5 s with its own ${c('loading.tsx')}; watch the chunks arrive`,
      `Throw in ${c('@feed')}: with and without its own ${c('error.tsx')} — and read the status code`,
      `Add ${c('@sidebar/settings')}; build; add the ${c('default.tsx')} files it asks for`,
      `Compare clicking a Link vs reloading the same URL`,
    ]), box('Keep these', `<ul><li><code>@slot</code> = a prop, never in the URL</li><li>Own <code>loading.tsx</code> / <code>error.tsx</code> per slot</li><li>Errors still answer 500</li><li><code>default.tsx</code> in every slot, incl. children</li><li>Soft keeps state; reload renders defaults</li></ul>`, 'lam'), ''),
    en: 'Your turn: add two slots and type the props; make one wait with its own loading file and watch the chunks arrive; throw in a slot with and without its own error file and read the status code; add a sub-URL to one slot, build, and add the default files it asks for; and compare clicking a link with reloading. Keep: a slot is a prop, never in the URL; own loading and error per slot; errors still answer five hundred; default dot tsx in every slot, children included; soft keeps state, reload renders defaults.' },
];
export const slides = lamDeck({ chuong: 'Chapter 11 — Advanced routing', bai: '11.4' }, S);
