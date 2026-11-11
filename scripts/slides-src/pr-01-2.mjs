/**
 * pr-01-2 — Prisma ORM · Chapter 1 · Lesson 1.2 "What prisma generate actually writes" (deck video, 12/11/2026). Bài web: pr-1-2-generate-viet-gi.
 * Output THẬT: `bash scratchpad/prisma/demo/chay.sh p1-2` trên dự án demo/p02/hoc-prisma (User + Post; Prisma 6.19.3, macOS arm64):
 * thư mục .prisma/client 21 MB (index.d.ts 136.063 B · index.js 10.310 B · libquery_engine-darwin-arm64 19,4 MB · query_engine_bg.wasm 2,3 MB);
 * `export type User = $Result.DefaultSelection<Prisma.$UserPayload>` + $UserPayload (objects / scalars); 68 kiểu `User…`; 17 phương thức delegate;
 * CuongThai @27318b94b: 17.665 dòng, 611 model, 57 enum; output riêng ./src/generated/prisma; index.js giữ clientVersion + inlineSchema.
 * KHÁC bài web (6.7.0, Linux, lược đồ CuongThai cũ 3.847 dòng / 112 model / 19 enum) — lời giảng theo output thật.
 */
/* Output chạy THẬT, đóng băng từ thư mục demo của khoá video Prisma (12/11/2026) — deck tự chứa, không đọc tệp ngoài repo. */
const DU_LIEU = {
 "demo/out/p1-2/ls.txt": "$ cd ../p02/hoc-prisma && env -u DATABASE_URL ls -la node_modules/.prisma/client | awk '{print $5, $9}' | grep -v '^ *$'; du -sh node_modules/.prisma/client\n640 .\n96 ..\n23 client.d.ts\n166 client.js\n23 default.d.ts\n182 default.js\n25 edge.d.ts\n9621 edge.js\n6600 index-browser.js\n136063 index.d.ts\n10310 index.js\n19356128 libquery_engine-darwin-arm64.dylib.node\n5309 package.json\n16927 query_engine_bg.js\n2297601 query_engine_bg.wasm\n758 schema.prisma\n184 wasm-edge-light-loader.mjs\n177 wasm-worker-loader.mjs\n25 wasm.d.ts\n6927 wasm.js\n 21M\tnode_modules/.prisma/client\n",
 "demo/out/p1-2/model-type.txt": "$ cd ../p02/hoc-prisma && env -u DATABASE_URL grep -n '^export type User = ' node_modules/.prisma/client/index.d.ts; grep -n -A 12 'export type $UserPayload' node_modules/.prisma/client/index.d.ts | head -14\n20:export type User = $Result.DefaultSelection<Prisma.$UserPayload>\n1208:  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {\n1209-    name: \"User\"\n1210-    objects: {\n1211-      posts: Prisma.$PostPayload<ExtArgs>[]\n1212-    }\n1213-    scalars: $Extensions.GetPayloadResult<{\n1214-      id: number\n1215-      email: string\n1216-      fullName: string | null\n1217-      createdAt: Date\n1218-    }, ExtArgs[\"result\"][\"user\"]>\n1219-    composites: {}\n1220-  }\n",
 "demo/out/p1-2/delegate.txt": "$ cd ../p02/hoc-prisma && env -u DATABASE_URL grep -oE '^    (findUnique|findUniqueOrThrow|findFirst|findFirstOrThrow|findMany|create|createMany|createManyAndReturn|delete|update|deleteMany|updateMany|updateManyAndReturn|upsert|count|aggregate|groupBy)<' node_modules/.prisma/client/index.d.ts | sort -u | tr -d ' <' | tr '\\n' ' '\naggregate count create createMany createManyAndReturn delete deleteMany findFirst findFirstOrThrow findMany findUnique findUniqueOrThrow groupBy update updateMany updateManyAndReturn upsert ",
 "demo/out/p1-2/kieu-args.txt": "$ cd ../p02/hoc-prisma && env -u DATABASE_URL grep -oE 'export type User[A-Za-z]+' node_modules/.prisma/client/index.d.ts | sort -u | wc -l; grep -oE 'export type User[A-Za-z]+' node_modules/.prisma/client/index.d.ts | sort -u | head -12\n      68\nexport type UserAggregateArgs\nexport type UserAvgAggregateInputType\nexport type UserAvgAggregateOutputType\nexport type UserAvgOrderByAggregateInput\nexport type UserCountAggregateInputType\nexport type UserCountAggregateOutputType\nexport type UserCountOrderByAggregateInput\nexport type UserCountOutputType\nexport type UserCountOutputTypeCountPostsArgs\nexport type UserCountOutputTypeDefaultArgs\nexport type UserCountOutputTypeSelect\nexport type UserCreateArgs\n",
 "demo/out/p1-2/cuongthai.txt": "$ wc -l ~/Downloads/api-backend/prisma/schema.prisma | awk '{print $1}'; grep -c '^model ' ~/Downloads/api-backend/prisma/schema.prisma; grep -c '^enum ' ~/Downloads/api-backend/prisma/schema.prisma\n17665\n611\n57\n",
 "demo/out/p1-2/output.txt": "$ cd ../p02/hoc-prisma && env -u DATABASE_URL npx prisma generate --schema prisma/schema-output.prisma 2>&1 | grep Generated; ls src/generated/prisma/\n✔ Generated Prisma Client (v6.19.3) to ./src/generated/prisma in 59ms\nclient.d.ts\nclient.js\ndefault.d.ts\ndefault.js\nedge.d.ts\nedge.js\nindex-browser.js\nindex.d.ts\nindex.js\nlibquery_engine-darwin-arm64.dylib.node\npackage.json\nquery_engine_bg.js\nquery_engine_bg.wasm\nruntime\nschema.prisma\nwasm-edge-light-loader.mjs\nwasm-worker-loader.mjs\nwasm.d.ts\nwasm.js\n",
 "demo/out/p1-2/index-js.txt": "$ cd ../p02/hoc-prisma && env -u DATABASE_URL grep -nE 'clientVersion|engineVersion|activeProvider|\"inlineSchema\"' node_modules/.prisma/client/index.js | cut -c1-110 | head -6\n166:  \"clientVersion\": \"6.19.3\",\n167:  \"engineVersion\": \"c2990dca591cba766e3b7ef5d9e8a84796e47ab7\",\n171:  \"activeProvider\": \"postgresql\",\n180:  \"inlineSchema\": \"generator client {\\n  provider = \\\"prisma-client-js\\\"\\n}\\n\\ndatasource db {\\n  provider\n"
};
const fs = { readFileSync: (p) => { const k = String(p); if (!(k in DU_LIEU)) throw new Error('thiếu dữ liệu đóng băng: ' + k); return DU_LIEU[k]; } };
import { lamDeck, tp, prs, two, box, cards, c, tbl, steps } from './_pr-chung.mjs';

export const deck = { key: 'pr-01-2', code: 'PR 1.2', title: 'What prisma generate actually writes', sub: 'Chapter 1 · Lesson 1.2' };

const DEMO = 'demo';
const OUT = (t) => fs.readFileSync(`${DEMO}/out/p1-2/${t}.txt`, 'utf8').replace(/\n+$/, '');
const gon = (s) => s.replace(/^\$ cd \.\.\/p02\/hoc-prisma && env -u DATABASE_URL /gm, '$ ').replace(/node_modules\/\.prisma\/client/g, '$C');
const lenh = (s, l) => s.replace(/^\$ .*$/m, `$ ${l}`);

export const slides = lamDeck({ chuong: 'Chapter 1 — What an ORM actually is', bai: '1.2' }, [
  /* 1 */ { cover: true, nhan: 'Chapter 1 · Lesson 1.2', t: 'What prisma generate<br>actually writes', sub: 'Open the box: it is ordinary TypeScript and JavaScript in your node_modules' },
  /* 2 */ { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Where the generated client lives, and how big each file is</li>
    <li>The four kinds of things inside: model types, delegates, Args types, the Payload machinery</li>
    <li>Three commands that make it readable</li>
    <li>Why the file grows faster than your schema — measured on CuongThai</li>
    <li>Generating somewhere you can see it, and how thin the runtime really is</li></ul>` },
  /* 3 */ { t: 'Where it lives, and how big it is', body: two(tp(lenh(gon(OUT('ls')), 'ls -la $C ; du -sh $C'), { fs: 14, wrap: 32 }),
      tbl(['File', 'What it is'], [['<code>index.d.ts</code> — 136 KB', 'only types: models, delegates, every argument'], ['<code>index.js</code> — 10 KB', 'tiny runtime glue: reads the embedded schema, forwards calls'], ['<code>libquery_engine-…node</code> — 19 MB', 'the Rust query engine for <b>this</b> platform (darwin-arm64)'], ['<code>query_engine_bg.wasm</code> — 2.3 MB', 'the WebAssembly engine, shipped alongside in 6.19'], ['<code>schema.prisma</code>', 'a copy of your schema'], ['<code>edge.js</code>, <code>wasm.js</code>', 'variants for edge runtimes (Chapter 11)']]), 'r37') },
  /* 4 */ { t: 'Four kinds of things inside', body: cards([
      ['1 · Model types', '<code>User</code>, <code>Post</code> — scalar fields only, no relations. What a bare <code>findMany()</code> returns.'],
      ['2 · Delegates', '<code>prisma.user</code> — one object per model with <code>findMany</code>, <code>create</code>, … generic over the arguments you pass.'],
      ['3 · Args types', '<code>UserWhereInput</code>, <code>UserCreateInput</code>, <code>UserOrderBy…</code> — most of the file.'],
      ['4 · Payload machinery', '<code>Prisma.UserGetPayload&lt;T&gt;</code>, <code>$Result</code> — conditional types that compute “what comes back for these arguments”.'],
    ], 2) },
  /* 5 */ { t: 'Read it yourself 1 — the model type', body: tp(lenh(gon(OUT('model-type')), "grep -n '^export type User = ' … ; grep -n -A 12 'export type $UserPayload' …"), { wrap: 120, fs: 15 }) +
    two(box('objects', 'the relations — <code>posts: $PostPayload[]</code>. What <code>include</code> reaches.', 'lam'), box('scalars', 'the columns — <code>id</code>, <code>email</code>, <code>fullName</code>, <code>createdAt</code>. What <code>select</code> picks.', 'xanh'), '') },
  /* 6 */ { t: 'Read it yourself 2 & 3 — methods and Args', body: tp(lenh(gon(OUT('delegate')), 'grep the methods of prisma.user'), { wrap: 110 }) +
    tp(lenh(gon(OUT('kieu-args')), "grep -oE 'export type User[A-Za-z]+' … | sort -u | wc -l ; … | head").split('\n').slice(0, 8).join('\n') + '\n…', { wrap: 110, fs: 14 }) +
    box('68 types named User… for one four-field model', 'That is the price of type safety — and why a big schema slows your editor down (Chapter 8).', 'lam') },
  /* 7 */ { t: 'Why the file grows faster than the schema', to: true, body: tbl(['You add', 'Cost', 'Why'], [
      ['+1 field', 'cheap', 'one more line in a handful of types'],
      ['+1 model', 'linear', 'a new delegate and dozens of new types'],
      ['+1 relation', '<b>the expensive one</b>', 'both models grow relation filters, nested create/update/upsert inputs, cross-referencing order-by inputs'],
    ]) + two(tp(lenh(OUT('cuongthai'), 'wc -l ; grep -c ^model ; grep -c ^enum'), { title: 'CuongThai schema.prisma @27318b94b' }),
      box('The result', 'Hover a query in a 600-model schema and the editor can pause for seconds while tsc evaluates deep conditional types. Chapter 8 lists what actually helps.', 'do2'), '') },
  /* 8 */ { t: 'Trap: importing from .prisma/client', body: two(
      `<div class="o bad"><div class="h">✗ import … from '.prisma/client'</div>It works today. It is an implementation detail that changed shape between majors — and moves entirely when you set <code>output</code>.</div>`,
      `<div class="o ok"><div class="h">✓ import … from '@prisma/client'</div>The public package name. Upgrades and custom outputs do not break it.</div>`, '') +
    box('One rule', 'Always import from <code>@prisma/client</code> (or from your custom output path) — never from the hidden folder.', 'lam') },
  /* 9 */ { t: 'Generate where you can see it', body: two(prs(`generator client {\n  provider = "prisma-client-js"\n  output   = "../src/generated/prisma"\n}`, { hl: [3] }) + tp(lenh(gon(OUT('output')), 'npx prisma generate ; ls src/generated/prisma/').split('\n').slice(0, 3).join('\n') + '\n' + gon(OUT('output')).split('\n').slice(3).join('  '), { wrap: 60, fs: 13 }),
      steps(['The import path changes: <code>from \'../generated/prisma\'</code>', 'Add it to <code>.gitignore</code> — still machine-written code', 'Your build must run <code>prisma generate</code> — the postinstall hook no longer covers you']), '') },
  /* 10 */ { t: 'The runtime is thinner than you think', body: tp(lenh(gon(OUT('index-js')), "grep -nE 'clientVersion|engineVersion|activeProvider|inlineSchema' $C/index.js"), { wrap: 120 }) +
    box('No per-model code', '<code>index.js</code> is configuration — your schema embedded as text — plus one call into the shared runtime. The delegates are built at start-up by a <code>Proxy</code> that reads that schema. All model-specific work in the package is <b>types</b>, and types vanish at build time.', 'xanh') +
    box('Where the weight really is', '10 KB of JavaScript, 136 KB of types — and a 19 MB engine binary. Lesson 1.3 follows a query out of your process into that engine.', 'lam') },
  /* 11 */ { t: 'Your turn — and what to keep', body: two(steps([
      `${c('ls -la node_modules/.prisma/client')} — name every file`,
      `Find ${c('export type User =')} and ${c('$UserPayload')}; point at objects and scalars`,
      `Count the ${c('User…')} types; add a relation and count again`,
      `Generate to ${c('src/generated/prisma')} once, then switch back`,
    ]), box('Keep these', `<ul><li>The client is ordinary generated code — read it</li><li>Types are most of it; the runtime is thin</li><li>Relations make the types grow fastest</li><li>Import from ${c('@prisma/client')}, never ${c('.prisma/client')}</li></ul>`, 'lam'), '') },
]);
