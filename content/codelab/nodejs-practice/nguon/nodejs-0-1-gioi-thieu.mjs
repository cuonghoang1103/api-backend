// Node.js 0.1 — About this course & the full roadmap. Bài định hướng ⇒ đề nhẹ: trắc nghiệm, bảng chủ đề → chương, sắp thứ tự.
import { modul, cs, q, ord, bang1, tn } from './_node.mjs';

const TN = [
  tn('Node.js', 'Node.js', 'A runtime that runs JavaScript outside the browser — created by Ryan Dahl in 2009.'),
  tn('V8', 'V8', 'Chrome\'s JavaScript engine: the part that executes your code.'),
  tn('libuv', 'libuv', 'The C library giving Node its non-blocking event loop and async I/O.'),
  tn('event loop', 'vòng lặp sự kiện', 'The single-threaded scheduler that lets one process juggle thousands of connections.'),
  tn('LTS', 'LTS', 'Long-term-support release (even majors) — what production should run.'),
];
const CH = Array.from({ length: 18 }, (_, i) => String(i + 1));

export default modul('nodejs-0-1-gioi-thieu', '0.1 About this course & the full roadmap', [
  cs({
    ten: 'What Node.js is, who made it, what it replaced',
    kho: 'EASY', phut: 5,
    en: 'Questions on the "What is Node.js" part of the lesson.',
    vi: 'Câu hỏi về phần "Node.js là gì" của bài.',
    cau: [
      q('h1', ['Who created Node.js, and when?', 'Ai tạo ra Node.js, khi nào?'],
        ['Ryan Dahl, 2009 (presented at JSConf EU)', 'Brendan Eich, 1995', 'Google, 2008, together with Chrome', 'The OpenJS Foundation, 2015'],
        ['Ryan Dahl wrapped Chrome\'s V8 engine so JavaScript could run on a server and presented it at JSConf EU 2009. Brendan Eich created JavaScript itself (1995); the OpenJS Foundation stewards Node today.', 'Ryan Dahl bọc engine V8 của Chrome để JavaScript chạy trên server và trình bày ở JSConf EU 2009. Brendan Eich tạo ra JavaScript (1995); OpenJS Foundation quản lý Node hiện nay.']),
      q('h2', ['Node.js is built on which two pieces?', 'Node.js dựng trên hai mảnh nào?'],
        ['V8 (runs the JavaScript) and libuv (event loop and async I/O)', 'Express (the web framework) and npm (the package manager)', 'The browser DOM (the page) and the Fetch API (the network)', 'Java\'s JVM (the runtime) and a thread pool (one per request)'],
        ['V8 executes your code; libuv gives the non-blocking event loop and async I/O. Chapter 2 pulls both apart.', 'V8 chạy code; libuv cho event loop không chặn và I/O bất đồng bộ. Chương 2 tách cả hai ra xem.']),
      q('h3', ['Which server model did Node replace for many teams?', 'Node thay thế mô hình server nào ở nhiều đội?'],
        ['One heavy thread per request — Node uses one non-blocking event loop instead', 'One process per user — Node starts a fresh process for every login', 'Servers written in assembly — Node compiles JavaScript to it ahead of time', 'Serverless functions — Node keeps one function per route in memory'],
        ['Older servers handled each request on its own thread, which is heavy. One Node process juggles thousands of connections cheaply — ideal for I/O-heavy APIs. The other big change: one language for the whole stack.', 'Server cũ xử lý mỗi request trên một luồng riêng — nặng. Một process Node xoay xở hàng nghìn kết nối với chi phí thấp — hợp cho API nhiều I/O. Thay đổi lớn kia: một ngôn ngữ cho cả stack.']),
      q('h4', ['Roughly how much of the real job is "write app.get(\'/\', …)", according to the lesson?', 'Theo bài, "viết app.get(\'/\', …)" chiếm khoảng bao nhiêu phần việc thật?'],
        ['About 5% — the rest decides whether the API survives real users', 'About 50% — the other half is mostly styling the frontend', 'About 90% — once routes exist the API is basically finished', 'All of it — everything else is optional polish for large companies'],
        ['Most of the course is the other 95%: the event loop under load, auth done right, data that does not corrupt, deploys that do not go down.', 'Phần lớn khoá học là 95% còn lại: event loop khi tải cao, xác thực đúng, dữ liệu không hỏng, deploy không sập.']),
    ],
    goiY: [['Engine + loop = V8 + libuv.', 'Engine + vòng lặp = V8 + libuv.'], ['The lesson contrasts Node with "one thread per request".', 'Bài so Node với "mỗi request một luồng".']],
    loi: [['Calling Node.js a framework (that is Express) or a language (that is JavaScript).', 'Gọi Node.js là framework (đó là Express) hay ngôn ngữ (đó là JavaScript).'], ['Thinking Node is fast at heavy computation — it is fast at WAITING (chapter 2).', 'Nghĩ Node giỏi tính toán nặng — nó giỏi CHỜ (chương 2).']],
    tns: TN,
  }),

  cs({
    ten: 'Which chapter teaches it?',
    kho: 'EASY', phut: 6, loai: 'table',
    en: 'Use the roadmap: for each topic the lesson mentions, pick the chapter (1–18) that teaches it.',
    vi: 'Dùng bản đồ khoá học: với mỗi chủ đề bài nhắc tới, chọn chương (1–18) dạy nó.',
    bang: [bang1('r1', ['Topic → chapter.', 'Chủ đề → chương.'],
      [{ ma: 'chu', ten: 'Topic|||Chủ đề' }, { ma: 'ch', ten: 'Chapter|||Chương', luaChon: CH }],
      [
        { o: { chu: 'Scope, closures, this, async from the ground up' }, a: { ch: '1' } },
        { o: { chu: 'V8, libuv, the event loop, why blocking is fatal' }, a: { ch: '2' } },
        { o: { chu: 'package.json, semver, lockfiles, supply-chain safety' }, a: { ch: '4' } },
        { o: { chu: 'Routing, middleware, error handling in Express' }, a: { ch: '5' } },
        { o: { chu: 'Schema, migrations, transactions, the N+1 trap' }, a: { ch: '7' } },
        { o: { chu: 'Password hashing, JWT, refresh-token rotation' }, a: { ch: '8' } },
        { o: { chu: 'Presigned URLs, S3 / Cloudflare R2, CDN delivery' }, a: { ch: '10' } },
        { o: { chu: 'Cache patterns, invalidation, rate-limit counters in Redis' }, a: { ch: '12' } },
        { o: { chu: 'Structured logs, request ids, health checks' }, a: { ch: '15' } },
        { o: { chu: 'A container that exits with code 137, zero-downtime deploys' }, a: { ch: '17' } },
      ],
      ['Stage 1 Foundations = 1–4 (JS, runtime, core modules, npm). Stage 2 API = 5–7 (Express, REST, Prisma). Stage 3 Safety = 8–10 (auth, web security, uploads). Stage 4 Real systems = 11–13 (WebSockets, Redis, jobs). Stage 5 Operations = 14–16 (testing, observability, performance). Stage 6 Shipping = 17–18 (Docker & deploy, architecture).', 'Chặng 1 Nền tảng = 1–4. Chặng 2 API = 5–7. Chặng 3 An toàn = 8–10. Chặng 4 Hệ thống thật = 11–13. Chặng 5 Vận hành = 14–16. Chặng 6 Đưa lên = 17–18.'])],
    goiY: [['Find the stage first (what kind of problem is it?), then the chapter inside the stage.', 'Tìm chặng trước (vấn đề thuộc loại gì?), rồi tới chương trong chặng.'], ['Exit code 137 is a container being killed — that is Docker & deployment.', 'Mã thoát 137 là container bị giết — thuộc Docker & triển khai.']],
    loi: [['Putting JWT under "web security" (9) — authentication has its own chapter (8).', 'Xếp JWT vào "bảo mật web" (9) — xác thực có chương riêng (8).'], ['Putting rate-limit counters under security — in this course they are built with Redis (12).', 'Xếp bộ đếm rate limit vào bảo mật — khoá này dựng bằng Redis (12).']],
    tns: TN,
  }),

  cs({
    ten: 'Stage 1 and Stage 2, chapter by chapter',
    kho: 'EASY', phut: 4, loai: 'order',
    en: 'Each chapter assumes the one before it. Put the first seven chapters in order.',
    vi: 'Mỗi chương dựa trên chương trước. Sắp bảy chương đầu đúng thứ tự.',
    cau: [
      ord('o1', ['Chapters 1–7.', 'Chương 1–7.'], [
        'JavaScript you actually need for the backend',
        'Inside the Node.js runtime',
        'Core modules (fs, path, streams, buffers, http)',
        'npm & project hygiene',
        'Express core',
        'REST API design',
        'Database with Prisma & PostgreSQL',
      ], ['The language, then the runtime that runs it, then the runtime\'s built-in modules, then packages — only then a framework (Express), the API design on top of it, and finally a real database replacing the in-memory array.', 'Ngôn ngữ, rồi runtime chạy nó, rồi module có sẵn của runtime, rồi gói npm — chỉ khi đó mới tới framework (Express), thiết kế API trên nó, cuối cùng là CSDL thật thay mảng trong RAM.']),
    ],
    goiY: [['Core modules come before npm packages; Express is an npm package.', 'Module lõi đến trước gói npm; Express là một gói npm.'], ['The database arrives after the API shape is clear.', 'CSDL đến sau khi hình dạng API đã rõ.']],
    loi: [['Starting with Express — it is unreadable without async and the event loop.', 'Bắt đầu bằng Express — không đọc nổi nếu chưa có async và event loop.'], ['Putting the database before REST design.', 'Đặt CSDL trước thiết kế REST.']],
    tns: TN,
  }),

  cs({
    ten: 'Reading a backend course the right way',
    kho: 'MEDIUM', phut: 5,
    en: 'The lesson ends with a trap, a time budget and the stack of this website. Pick the right statement.',
    vi: 'Bài kết bằng một cái bẫy, quỹ thời gian và stack của web này. Chọn phát biểu đúng.',
    cau: [
      q('t1', ['Why does almost every chapter end with a measurement rather than a screenshot?', 'Vì sao gần như chương nào cũng kết bằng một phép đo thay vì ảnh chụp?'],
        ['Server bugs rarely show on screen; only running it under production-like conditions proves it works', 'Screenshots of terminals are too large to store on the course website', 'Measurements are quicker to write than a screenshot is to take and crop', 'Backend code has no user interface, so a screenshot would show nothing'],
        ['A leaked socket per request or a transaction that is not one looks exactly like working code on screen. "It works" is a much weaker signal here than in frontend work.', 'Rò một socket mỗi request hay giao dịch không phải giao dịch trông y như code chạy đúng trên màn hình. "Nó chạy" là tín hiệu yếu hơn nhiều so với frontend.']),
      q('t2', ['How much time does the lesson budget for the course?', 'Bài dự trù bao nhiêu thời gian cho khoá?'],
        ['About 3–4 hours per chapter, 60–70 hours in total, typing every example', 'One weekend in total, if you watch the videos at double speed', 'About 10 hours in total, skimming the text and skipping the labs', 'About 300 hours in total, rewriting every chapter twice from memory'],
        ['"Speed is not the goal — being able to rebuild it from memory is."', '"Tốc độ không phải mục tiêu — tự dựng lại được từ trí nhớ mới là mục tiêu."']),
      q('t3', ['Which stack does this website run on (the course\'s production examples)?', 'Web này chạy stack nào (ví dụ production của khoá)?'],
        ['Node.js + Express + TypeScript, PostgreSQL via Prisma, Redis, Socket.IO, Cloudflare R2, Docker on a VPS', 'PHP + Laravel, MySQL, Memcached and file uploads on a shared hosting plan', 'Python + Django, MongoDB, RabbitMQ and Amazon S3 on a Kubernetes cluster', 'Java + Spring Boot, Oracle, Kafka and Azure Blob Storage on AWS Lambda'],
        ['When a chapter says "here is how it is done in production", it means this stack, on this site.', 'Khi một chương nói "trong production làm thế này", nó nói về đúng stack này, trên web này.']),
      q('t4', ['Which Node release line should production run?', 'Production nên chạy dòng phát hành Node nào?'],
        ['An LTS release — an even-numbered major', 'The newest odd-numbered major, for the features', 'Any version, as long as npm installs', 'Whatever the laptop has'],
        ['Even majors become LTS and are supported for about 30 months; odd majors are experimental (lesson 0.3).', 'Bản chính chẵn thành LTS và được hỗ trợ khoảng 30 tháng; bản lẻ là thử nghiệm (bài 0.3).']),
    ],
    goiY: [['The trap in the lesson is about what you can and cannot see.', 'Cái bẫy trong bài là về thứ bạn thấy và không thấy được.'], ['LTS = even.', 'LTS = chẵn.']],
    loi: [['Skimming the course like a frontend tutorial and trusting "it runs".', 'Lướt khoá như hướng dẫn frontend và tin "nó chạy".'], ['Deploying an odd-numbered major.', 'Deploy bản chính số lẻ.']],
    tns: TN,
  }),
]);
