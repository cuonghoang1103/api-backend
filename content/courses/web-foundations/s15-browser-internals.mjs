/**
 * Web Foundations — Chương 15: Trình duyệt và JavaScript chạy thật ra sao (soạn 20/11/2026).
 * Lấp chỗ trống sau đợt soát phủ kiến thức: đường hiển thị + layout thrashing, thiết kế lỗi, giao thức lặp/generator,
 * bộ nhớ & rò rỉ ở front-end, ngày giờ & múi giờ. Song ngữ EN/VI (.ml-en / .ml-vi).
 * Bài tách ở ./s15/; mã + output chạy thật ở ./_demo/15-1 … 15-3 và ./_demo/_t15/ (node _demo/_t15/chay.mjs).
 * ⏳ Chưa có deck slide (wf-15-0 chương / wf-15-N bài) — dựng + đẩy WF/v1 rồi thêm walkWf/galleryGiang như Ch11–14.
 * ⏳ Chưa có Code Lab module wf-15-* trong content/codelab/web-foundations-practice.
 */

import { onTapBai } from './_on-tap/index.mjs';
import { baiMoc, baiBaoVe } from './_du-an/index.mjs';
import { FE, phanFE, baiThiCuoi } from './_on-tap/fe.mjs';
import L151 from './s15/wf-15-1-rendering-pipeline.mjs';
import L152 from './s15/wf-15-2-error-handling.mjs';
import L153 from './s15/wf-15-3-iterables-generators.mjs';
import L154 from './s15/wf-15-4-memory-leaks.mjs';
import L155 from './s15/wf-15-5-dates-timezones.mjs';

export default {
  title: 'Chapter 15 — How the browser and JavaScript really work|||Chương 15 — Trình duyệt và JavaScript chạy thật ra sao',
  description: 'Năm chủ đề mà khoá React, Node.js và các buổi phỏng vấn fresher mặc định bạn đã nắm, nhưng các chương trước chưa dạy riêng: trình duyệt vẽ trang thế nào (và vì sao trang giật), thiết kế lỗi cho đàng hoàng, giao thức lặp và generator, bộ nhớ và rò rỉ trong ứng dụng một trang, ngày giờ và múi giờ. Mỗi bài có số đo chạy thật trong Chromium, góc hacker và một lab.',
  lessons: [
    L151,

    L152,

    L153,

    L154,

    L155,

    /* ─────────────── mốc dự án 15 (dự án xuyên suốt khoá) ─────────────── */
    baiMoc(15),

    {
      title: '15.6 — Chapter 15 quiz|||15.6 — Kiểm tra chương 15',
      slug: 'wf-15-6-quiz',
      type: 'QUIZ',
      description: 'Mười câu về đường hiển thị, layout thrashing, thiết kế lỗi, iterable/generator, rò rỉ bộ nhớ và ngày giờ — câu "in ra gì" đều đã chạy thật trong Chromium — kèm 10 câu tiếng Anh kiểu đề FE (Phần B).',
      content: `
<div class="ml-en"><p class="lead">Ten questions covering the rendering pipeline, layout thrashing, error design, iterables and generators, memory leaks, and dates. Every "what does this print" answer was verified by running the code in Chromium.</p>
<h3>The chapter in five points</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">CSS blocks paint, scripts block parsing</span><span class="lz-t">defer and media change that</span><span class="lz-d">Measured: a 1-second stylesheet = ~1 s of white screen; the same file with media="print" = none.</span></div>
<div class="lz-node"><span class="lz-k">Read all, then write all</span><span class="lz-t">never read geometry between writes</span><span class="lz-d">Interleaving forced 1,000 layouts: roughly 170–190× slower for the same result.</span></div>
<div class="lz-node"><span class="lz-k">Errors carry information</span><span class="lz-t">kind, cause, cleanup, report</span><span class="lz-d">Subclasses + instanceof, { cause }, finally, and global handlers for what slips through.</span></div>
<div class="lz-node"><span class="lz-k">Reachable means alive</span><span class="lz-t">remove what you registered</span><span class="lz-d">Listeners, intervals, detached DOM and Map entries keep memory after unmount.</span></div>
<div class="lz-node"><span class="lz-k">One instant, many printouts</span><span class="lz-t">pick the zone on purpose</span><span class="lz-d">'2026-11-20' is UTC midnight; in New York that is still the 19th.</span></div>
</div>
<p class="note-ct">If you got a "what does this print" wrong, rerun that lesson's example and change one thing at a time. Watching it happen teaches more than reading the answer.</p></div>
<div class="ml-vi"><p class="lead">Mười câu về đường hiển thị, layout thrashing, thiết kế lỗi, iterable và generator, rò rỉ bộ nhớ và ngày giờ. Các câu "in ra gì" đều đã được xác minh bằng cách chạy code thật trong Chromium.</p>
<h3>Cả chương trong năm ý</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">CSS chặn vẽ, script chặn đọc</span><span class="lz-t">defer và media đổi được điều đó</span><span class="lz-d">Đo thật: stylesheet chậm 1 giây = ~1 giây màn hình trắng; cùng tệp đó có media="print" = không chờ.</span></div>
<div class="lz-node"><span class="lz-k">Đọc hết, rồi ghi hết</span><span class="lz-t">không đọc kích thước giữa các lần ghi</span><span class="lz-d">Xen kẽ ép 1.000 lần dàn trang: chậm khoảng 170–190 lần cho cùng một kết quả.</span></div>
<div class="lz-node"><span class="lz-k">Lỗi mang thông tin</span><span class="lz-t">loại, nguyên nhân, dọn dẹp, báo cáo</span><span class="lz-d">Lớp con + instanceof, { cause }, finally, và handler toàn cục cho phần lọt lưới.</span></div>
<div class="lz-node"><span class="lz-k">Với tới được là còn sống</span><span class="lz-t">gỡ thứ bạn đã đăng ký</span><span class="lz-d">Listener, interval, DOM tách rời và mục trong Map giữ bộ nhớ sau khi gỡ component.</span></div>
<div class="lz-node"><span class="lz-k">Một thời điểm, nhiều cách in</span><span class="lz-t">chọn múi giờ có chủ đích</span><span class="lz-d">'2026-11-20' là nửa đêm UTC; ở New York lúc đó vẫn là ngày 19.</span></div>
</div>
<p class="note-ct">Câu "in ra gì" nào bạn sai thì chạy lại ví dụ của bài đó và đổi từng thứ một. Tự nhìn nó xảy ra dạy được nhiều hơn đọc đáp án.</p></div>
${onTapBai('wf-15-6-quiz')}
${phanFE(15)}
`,
      quiz: {
        timeLimitSeconds: 1320,
        questions: [
          {
            question: 'A page has <link rel="stylesheet" href="/big.css"> in its head and the file takes 2 s to download. What does the user see during those 2 s?|||Trang có <link rel="stylesheet" href="/big.css"> trong head và tệp mất 2 giây để tải. Trong 2 giây đó người dùng thấy gì?',
            options: [
              'A blank page — CSS is render-blocking|||Trang trắng — CSS chặn hiển thị',
              'The text without styles, then the styles appear|||Chữ chưa có kiểu, rồi kiểu hiện ra sau',
              'The page, fully styled, because HTML arrived first|||Trang đầy đủ kiểu, vì HTML về trước',
              'An error in the console|||Một lỗi trong console',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which change lets a slow <script src="/app.js"> in the head stop delaying the first paint, while still running before DOMContentLoaded and in order?|||Thay đổi nào làm một <script src="/app.js"> chậm trong head thôi làm trễ lần vẽ đầu, mà vẫn chạy trước DOMContentLoaded và đúng thứ tự?',
            options: ['Add defer|||Thêm defer', 'Add async|||Thêm async', 'Add media="print"|||Thêm media="print"', 'Move it into a CSS @import|||Chuyển nó vào một @import trong CSS'],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'for (const el of items) { const w = box.offsetWidth; el.style.width = w / 2 + "px"; } — why is this slow?|||for (const el of items) { const w = box.offsetWidth; el.style.width = w / 2 + "px"; } — vì sao đoạn này chậm?',
            options: [
              'Each read after a write forces a new layout (layout thrashing)|||Mỗi lần đọc sau khi ghi ép một lần dàn trang mới (layout thrashing)',
              'offsetWidth makes a network request|||offsetWidth gửi một request mạng',
              'style.width triggers garbage collection|||style.width kích hoạt thu gom rác',
              'for...of is slower than forEach|||for...of chậm hơn forEach',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'function f() { try { throw new Error("x"); } finally { return "ok"; } } — what does f() do?|||function f() { try { throw new Error("x"); } finally { return "ok"; } } — f() làm gì?',
            options: [
              'Returns "ok" and the error disappears|||Trả về "ok" và lỗi biến mất',
              'Throws Error: x|||Ném Error: x',
              'Returns undefined|||Trả về undefined',
              'Throws a SyntaxError|||Ném SyntaxError',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'try { setTimeout(() => { throw new Error("late"); }, 0); } catch (e) { console.log("caught"); } — what happens?|||try { setTimeout(() => { throw new Error("late"); }, 0); } catch (e) { console.log("caught"); } — chuyện gì xảy ra?',
            options: [
              '"caught" is never printed; the console shows Uncaught Error: late|||Không bao giờ in "caught"; console hiện Uncaught Error: late',
              '"caught" is printed|||In ra "caught"',
              'Nothing at all happens|||Không có gì xảy ra',
              'The page reloads|||Trang tự tải lại',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You need the friendly message "Could not read settings" but also the original SyntaxError for debugging. What do you throw?|||Bạn cần câu thân thiện "Không đọc được cài đặt" nhưng vẫn giữ SyntaxError gốc để gỡ lỗi. Bạn throw gì?',
            options: [
              'new Error("Could not read settings", { cause: err })|||new Error("Không đọc được cài đặt", { cause: err })',
              'The string "Could not read settings: " + err|||Chuỗi "Không đọc được cài đặt: " + err',
              'Nothing — return null|||Không throw gì — return null',
              'err, unchanged|||err, giữ nguyên',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'function* g() { yield 1; yield 2; } const it = g(); console.log([...it], [...it]); — what is printed?|||function* g() { yield 1; yield 2; } const it = g(); console.log([...it], [...it]); — in ra gì?',
            options: ['[1, 2] []|||[1, 2] []', '[1, 2] [1, 2]|||[1, 2] [1, 2]', '[] []|||[] []', 'TypeError: it is not iterable|||TypeError: it is not iterable'],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'for (const x of { a: 1, b: 2 }) console.log(x); — what happens?|||for (const x of { a: 1, b: 2 }) console.log(x); — chuyện gì xảy ra?',
            options: [
              'TypeError: object is not iterable — use Object.entries|||TypeError: object không lặp được — dùng Object.entries',
              'Prints a and b|||In ra a và b',
              'Prints 1 and 2|||In ra 1 và 2',
              'Prints nothing|||Không in gì',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A modal adds window.addEventListener("resize", onResize) on open and only calls el.remove() on close. After opening it 30 times, what is true?|||Một hộp thoại gọi window.addEventListener("resize", onResize) khi mở và chỉ gọi el.remove() khi đóng. Mở 30 lần xong thì điều gì đúng?',
            options: [
              'There are 30 listeners, and each keeps its modal and data alive|||Có 30 listener, mỗi cái giữ sống hộp thoại và dữ liệu của nó',
              'The garbage collector removes the listeners with the elements|||Bộ thu gom rác gỡ listener cùng với phần tử',
              'el.remove() also removes listeners on window|||el.remove() cũng gỡ listener trên window',
              'Only the last listener remains|||Chỉ còn listener cuối cùng',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'On a computer in New York, new Date("2026-11-20").getDate() returns?|||Trên một máy tính ở New York, new Date("2026-11-20").getDate() trả về?',
            options: [
              '19 — a date-only string is read as UTC midnight|||19 — chuỗi chỉ có ngày được đọc là nửa đêm UTC',
              '20|||20',
              '10 — months count from 0|||10 — tháng đếm từ 0',
              'NaN — the format is not supported|||NaN — định dạng không được hỗ trợ',
            ],
            correctIndex: 0,
            points: 1,
          },
          ...FE[15],
        ],
      },
    },

    /* ─────────────── đề tổng hợp cuối khoá + bảo vệ dự án ─────────────── */
    baiThiCuoi(),
    baiBaoVe(),
  ],
};
