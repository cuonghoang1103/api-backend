/**
 * IDE & đồ nghề dev — Chương 1: VS Code chuyên sâu cho Node.js, TypeScript và React (soạn 22/11/2026).
 * Slug + title chương GIỮ NGUYÊN theo khung trong ../ide-va-do-nghe-dev.mjs (ghép bằng ghep()).
 * Mọi bài làm trên dự án mẫu labflow-mini (tạo ở bài 0.1). Phím tắt kiểm theo bảng mặc định VS Code 1.124
 * (Keyboard Shortcuts Reference). Debugger sâu KHÔNG dạy ở đây — thuộc debug-co-phuong-phap ch3.
 * KHÔNG backtick trần trong content; mã mẫu đi qua bash()/js()/json()/out() của ./_chung.mjs, khai báo thành const.
 */
import { bash, js, json, out, tl, phim, bai, giai, Q } from './_chung.mjs';

/* ═════════════ 1.1 — Điều hướng ═════════════ */
const P_DIEU_HUONG = [
  ['Quick Open — go to a file by name', 'Quick Open — mở file theo tên', 'Ctrl+P', '⌘P'],
  ['Command Palette — run any command', 'Command Palette — chạy mọi lệnh', 'Ctrl+Shift+P / F1', '⇧⌘P / F1'],
  ['Go to Symbol in this file', 'Đi tới symbol trong file này', 'Ctrl+Shift+O', '⇧⌘O'],
  ['Go to Symbol in the whole workspace', 'Đi tới symbol trong cả dự án', 'Ctrl+T', '⌘T'],
  ['Go to Line', 'Đi tới dòng', 'Ctrl+G', '⌃G'],
  ['Go to Definition', 'Đi tới định nghĩa', 'F12 (or Ctrl+Click)', 'F12 (or ⌘Click)'],
  ['Peek Definition (inline, no jump)', 'Xem nhanh định nghĩa (tại chỗ, không nhảy)', 'Alt+F12', '⌥F12'],
  ['Go to References', 'Đi tới các nơi dùng', 'Shift+F12', '⇧F12'],
  ['Find All References (side panel)', 'Tìm mọi nơi dùng (bảng bên)', 'Shift+Alt+F12', '⌥⇧F12'],
  ['Go to Implementation', 'Đi tới phần cài đặt', 'Ctrl+F12', '⌘F12'],
  ['Show Call Hierarchy', 'Xem cây lời gọi', 'Shift+Alt+H', '⌥⇧H'],
  ['Go Back / Go Forward', 'Quay lại / Đi tiếp vị trí trước', 'Alt+← / Alt+→ (Linux: Ctrl+Alt+- / Ctrl+Shift+-)', '⌃- / ⌃⇧-'],
  ['Switch between open editors', 'Đổi qua lại các tab đang mở', 'Ctrl+Tab', '⌃Tab'],
  ['Next / previous problem (error)', 'Lỗi kế tiếp / trước', 'F8 / Shift+F8', 'F8 / ⇧F8'],
  ['Focus breadcrumbs (path bar on top)', 'Nhảy vào thanh breadcrumb', 'Ctrl+Shift+.', '⇧⌘.'],
  ['Show Explorer / toggle side bar', 'Hiện Explorer / ẩn hiện thanh bên', 'Ctrl+Shift+E / Ctrl+B', '⇧⌘E / ⌘B'],
];
const P_TIM = [
  ['Search in all files', 'Tìm trong mọi file', 'Ctrl+Shift+F', '⇧⌘F'],
  ['Replace in all files', 'Thay trong mọi file', 'Ctrl+Shift+H', '⇧⌘H'],
  ['Toggle Match Case / Whole Word / Regex', 'Bật tắt Phân biệt hoa thường / Nguyên từ / Regex', 'Alt+C / Alt+W / Alt+R', '⌥⌘C / ⌥⌘W / ⌥⌘R'],
  ['Show “files to include / exclude”', 'Hiện ô “files to include / exclude”', 'Ctrl+Shift+J', '⇧⌘J'],
  ['Replace all (in the search view)', 'Thay tất cả (trong ô tìm kiếm)', 'Ctrl+Alt+Enter', '⌥⌘Enter'],
  ['Find / replace in the current file', 'Tìm / thay trong file hiện tại', 'Ctrl+F / Ctrl+H', '⌘F / ⌥⌘F'],
];
const QUICK_OPEN = out(`
Gõ trong Quick Open (Ctrl+P / ⌘P)     Kết quả
task.ser                              mở src/services/task.service.js (gõ thiếu, gõ tắt vẫn ra: "tsk" cũng khớp)
>format                               giống Command Palette: lệnh "Format Document"…
@                                     symbol trong file đang mở (gõ @: để gom theo loại: hàm, biến…)
#findUser                             symbol trong cả dự án (giống Ctrl+T / ⌘T)
:20                                   nhảy tới dòng 20 (giống Ctrl+G / ⌃G)
?                                     liệt kê mọi tiền tố ở trên
`
);
const TIM_GLOB = out(`
files to include:   src/**                 chỉ tìm trong thư mục src
files to include:   *.jsx, *.tsx           chỉ file React
files to exclude:   **/*.test.js           bỏ file test
files to exclude:   web                    bỏ cả thư mục web
(nút "Use Exclude Settings and Ignore Files" bật sẵn ⇒ tự bỏ node_modules và mọi thứ trong .gitignore)
`
);
const DAP_11 = (en) => `
<ol>
<li><code>src/utils/format.js</code> — ${en ? 'Ctrl+T/⌘T then type the name, or F12 from a call' : 'Ctrl+T/⌘T rồi gõ tên, hoặc F12 từ một chỗ gọi'}</li>
<li><code>src/services/task.service.js</code> ${en ? 'and' : 'và'} <code>test/task.service.test.js</code> — Shift+F12/⇧F12</li>
<li><code>src/routes/tasks.routes.js</code> — ${en ? 'text search <code>done</code> with Whole Word on, or Quick Open “tasks.rou”' : 'tìm chữ <code>done</code> bật Nguyên từ, hoặc Quick Open “tasks.rou”'}</li>
<li><code>findUserById</code> ${en ? 'and' : 'và'} <code>formatDueDate</code> — ${en ? 'Call Hierarchy, outgoing calls, or Peek' : 'Call Hierarchy chiều lời gọi đi, hoặc Peek'}</li>
<li><code>onDone</code> ${en ? 'in' : 'trong'} <code>web/src/TaskList.jsx</code> — Shift+F12/⇧F12</li>
<li>3 — Ctrl+Shift+O/⇧⌘O ${en ? 'in user.service.js, then' : 'trong user.service.js, chọn'} <code>USERS</code></li>
<li><code>src/server.js</code> — Shift+F12/⇧F12</li>
<li>400 — Ctrl+Shift+O/⇧⌘O → <code>createTask</code></li>
<li><code>src/services/task.service.js</code> ${en ? 'and' : 'và'} <code>src/routes/users.routes.js</code> — Ctrl+Shift+F/⇧⌘F</li>
<li><code>createTask</code> — Ctrl+G/⌃G ${en ? 'then 20' : 'rồi gõ 20'}</li>
</ol>
`;
const L1 = (en) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? 'Chapter 1 · VS Code' : 'Chương 1 · VS Code'}</span>
<h2>${en ? '1.1 — Navigation: Quick Open, Command Palette, Go to Symbol/Definition/References' : '1.1 — Điều hướng: Quick Open, Command Palette, Go to Symbol/Definition/References'}</h2>
<p class="lead">${en
    ? 'Reading code is most of the job, and reading means jumping: from a route to the service it calls, from a function to everyone who calls it, and back. In this lesson you learn the dozen shortcuts that replace scrolling through the Explorer — and the difference between searching for <em>text</em> and searching for a <em>symbol</em>, which decides whether your answer is complete.'
    : 'Đọc code là phần lớn công việc, mà đọc tức là nhảy: từ route sang service nó gọi, từ một hàm sang mọi chỗ gọi nó, rồi quay lại. Bài này dạy chục phím tắt thay cho việc cuộn cây Explorer — và khác biệt giữa tìm <em>chữ</em> và tìm <em>symbol (ký hiệu)</em>, thứ quyết định câu trả lời của bạn có đầy đủ hay không.'}</p>

<h3>${en ? 'Three search boxes you will use all day' : 'Ba ô tìm kiếm bạn dùng cả ngày'}</h3>
<p>${en
    ? '<strong>Quick Open</strong> finds files, <strong>Command Palette</strong> finds commands, <strong>symbol search</strong> finds functions, classes and variables. They are actually one box with different prefixes — type the prefix and the box changes mode:'
    : '<strong>Quick Open</strong> tìm file, <strong>Command Palette</strong> tìm lệnh, <strong>tìm symbol</strong> tìm hàm, class, biến. Thật ra cả ba là một ô với tiền tố khác nhau — gõ tiền tố là ô đổi chế độ:'}</p>
${QUICK_OPEN}
<p>${en
    ? 'Quick Open matches <em>fuzzily</em>: the letters you type only need to appear in order. <code>tsrv</code> finds <code>task.service.js</code>. With 1,800 files this is the difference between one second and one minute.'
    : 'Quick Open khớp <em>mờ (fuzzy)</em>: các chữ bạn gõ chỉ cần xuất hiện đúng thứ tự. <code>tsrv</code> vẫn tìm ra <code>task.service.js</code>. Với 1.800 file, đây là khác biệt giữa một giây và một phút.'}</p>

<h3>${en ? 'The navigation shortcuts (Windows/Linux and macOS)' : 'Bảng phím điều hướng (Windows/Linux và macOS)'}</h3>
${phim(P_DIEU_HUONG, !en)}
<p>${en
    ? 'Do not learn the whole table today. Start with four: <code>Ctrl+P</code>/<code>⌘P</code>, <code>F12</code>, <code>Shift+F12</code> and Go Back. Go Back is the one people forget — and it is what makes jumping safe: after following three definitions you return to where you started in three presses instead of hunting for the tab.'
    : 'Đừng học cả bảng hôm nay. Bắt đầu với bốn phím: <code>Ctrl+P</code>/<code>⌘P</code>, <code>F12</code>, <code>Shift+F12</code> và Go Back (quay lại). Go Back là phím hay bị quên — và chính nó làm việc nhảy trở nên an toàn: đi theo ba lần định nghĩa xong, bấm ba lần là về đúng chỗ xuất phát, không phải đi tìm tab.'}</p>
<div class="callout warn"><p>${en
    ? '<strong>Mac laptops:</strong> F12 may be the volume key. Either press <code>fn+F12</code>, or turn on <em>System Settings → Keyboard → Keyboard Shortcuts → Function Keys → Use F1, F2, etc. keys as standard function keys</em>. <strong>Windows laptops</strong> have the same issue with an <code>Fn</code> lock key.'
    : '<strong>Laptop Mac:</strong> F12 có thể là phím âm lượng. Hoặc bấm <code>fn+F12</code>, hoặc bật <em>System Settings → Keyboard → Keyboard Shortcuts → Function Keys → Use F1, F2, etc. keys as standard function keys</em>. <strong>Laptop Windows</strong> cũng vậy, có phím khoá <code>Fn</code>.'}</p></div>

<h3>${en ? 'Definition, Peek, References, Implementation, Call Hierarchy — which one when' : 'Definition, Peek, References, Implementation, Call Hierarchy — dùng cái nào lúc nào'}</h3>
<table>
<thead><tr><th>${en ? 'Question you are asking' : 'Câu bạn đang hỏi'}</th><th>${en ? 'Command' : 'Lệnh'}</th></tr></thead>
<tbody>
<tr><td>${en ? '“What does this function do?”' : '“Hàm này làm gì?”'}</td><td>${en ? 'Peek Definition (<code>Alt+F12</code>/<code>⌥F12</code>) — read it without losing your place' : 'Peek Definition (<code>Alt+F12</code>/<code>⌥F12</code>) — đọc mà không mất chỗ đang đứng'}</td></tr>
<tr><td>${en ? '“I want to edit it”' : '“Mình muốn sửa nó”'}</td><td>Go to Definition (<code>F12</code>)</td></tr>
<tr><td>${en ? '“Who uses this? Can I change its signature?”' : '“Ai đang dùng nó? Đổi tham số được không?”'}</td><td>Go to References (<code>Shift+F12</code>/<code>⇧F12</code>)</td></tr>
<tr><td>${en ? '“This is an interface — which class really runs?” (TypeScript)' : '“Đây là interface — class nào chạy thật?” (TypeScript)'}</td><td>Go to Implementation (<code>Ctrl+F12</code>/<code>⌘F12</code>)</td></tr>
<tr><td>${en ? '“Which route ends up calling this?”' : '“Route nào cuối cùng gọi tới đây?”'}</td><td>${en ? 'Call Hierarchy (<code>Shift+Alt+H</code>/<code>⌥⇧H</code>) — incoming calls, several levels up' : 'Call Hierarchy (<code>Shift+Alt+H</code>/<code>⌥⇧H</code>) — các lời gọi tới, lần ngược nhiều tầng'}</td></tr>
</tbody>
</table>
<p>${en
    ? 'Try it in <code>labflow-mini</code>: open <code>src/utils/format.js</code>, put the cursor on <code>formatDueDate</code>, press <code>Shift+Alt+H</code>/<code>⌥⇧H</code>. The tree shows <code>toView</code> in task.service.js; expand it and you see <code>listTasks</code>, <code>createTask</code>, <code>markDone</code>; expand again and you reach the route handlers in tasks.routes.js. In ten seconds you know every request that formats a date.'
    : 'Thử trong <code>labflow-mini</code>: mở <code>src/utils/format.js</code>, đặt con trỏ lên <code>formatDueDate</code>, bấm <code>Shift+Alt+H</code>/<code>⌥⇧H</code>. Cây hiện <code>toView</code> trong task.service.js; mở tiếp thấy <code>listTasks</code>, <code>createTask</code>, <code>markDone</code>; mở nữa là tới các hàm xử lý route trong tasks.routes.js. Mười giây là biết mọi request có định dạng ngày.'}</p>
<div class="pitfall co-tieu-de"><p><strong>${en ? 'Plain JavaScript: the language server guesses' : 'JavaScript thuần: language server phải đoán'}</strong></p><p>${en
    ? 'In TypeScript, references are exact because types are known. In plain JavaScript the TypeScript server infers what it can from <code>import</code>/<code>export</code>; code that builds names dynamically (<code>obj[name]()</code>, <code>require(variable)</code>) is invisible to it. So in a JS project, after Find References also run a text search for the name before deleting or renaming something public.'
    : 'Với TypeScript, kết quả tìm nơi dùng là chính xác vì biết kiểu. Với JavaScript thuần, TypeScript server chỉ suy ra được những gì nhìn thấy qua <code>import</code>/<code>export</code>; code dựng tên động (<code>obj[name]()</code>, <code>require(bien)</code>) nó không thấy. Vì vậy trong dự án JS, sau Find References hãy tìm thêm theo chữ trước khi xoá hay đổi tên một thứ dùng chung.'}</p></div>

<h3>${en ? 'Searching the whole project' : 'Tìm trên toàn dự án'}</h3>
${phim(P_TIM, !en)}
<p>${en
    ? 'The search view (powered by ripgrep) is your text search across all files. Three toggles at the right of the box matter: <strong>Aa</strong> match case, <strong>ab</strong> whole word, <strong>.*</strong> regular expression. Whole word is the most underrated: searching <code>done</code> without it also finds <code>onDone</code> and <code>markTaskDone</code>. Press <code>Ctrl+Shift+J</code>/<code>⇧⌘J</code> (or click <strong>…</strong>) to limit where you search:'
    : 'Ô tìm kiếm (chạy bằng ripgrep bên dưới) là công cụ tìm chữ trên mọi file. Ba nút bên phải ô đáng nhớ: <strong>Aa</strong> phân biệt hoa thường, <strong>ab</strong> nguyên từ, <strong>.*</strong> biểu thức chính quy. Nguyên từ (whole word) bị đánh giá thấp nhất: tìm <code>done</code> mà không bật nó thì ra cả <code>onDone</code> và <code>markTaskDone</code>. Bấm <code>Ctrl+Shift+J</code>/<code>⇧⌘J</code> (hoặc bấm <strong>…</strong>) để giới hạn chỗ tìm:'}</p>
${TIM_GLOB}
<p>${en
    ? '<strong>Replace across files</strong> (<code>Ctrl+Shift+H</code>/<code>⇧⌘H</code>) shows every match; clicking one opens a diff of that file before and after. Three habits make it safe: commit first (so <code>git diff</code> and <code>git checkout .</code> can rescue you), narrow it with “files to include”, and read the preview before <em>Replace All</em>. Regex replacements with groups (<code>$1</code>) belong to Chapter 4 (lesson 4.4).'
    : '<strong>Thay trên nhiều file</strong> (<code>Ctrl+Shift+H</code>/<code>⇧⌘H</code>) liệt kê mọi chỗ khớp; bấm một chỗ là mở bản so sánh trước/sau của file đó. Ba thói quen giữ an toàn: commit trước (để <code>git diff</code> và <code>git checkout .</code> cứu được), thu hẹp bằng “files to include”, và đọc bản xem trước rồi mới <em>Replace All</em>. Thay bằng regex có nhóm (<code>$1</code>) thuộc Chương 4 (bài 4.4).'}</p>
<div class="callout ok"><p>${en
    ? '<strong>Text search or Find References?</strong> Use <strong>Find References</strong> for code symbols (a function, a variable) — exact, no comments, no look-alikes. Use <strong>text search</strong> for strings, error messages, config keys, URLs, CSS classes, and anything a language server does not understand. Example: to find which code returns “user not found”, search the text; to find who calls <code>findUserById</code>, use references.'
    : '<strong>Tìm chữ hay Find References?</strong> Dùng <strong>Find References</strong> cho symbol trong code (một hàm, một biến) — chính xác, không lẫn chú thích, không lẫn tên giống. Dùng <strong>tìm chữ</strong> cho chuỗi, thông báo lỗi, khoá cấu hình, URL, class CSS, và mọi thứ language server không hiểu. Ví dụ: tìm code nào trả “user not found” thì tìm chữ; tìm ai gọi <code>findUserById</code> thì dùng references.'}</p></div>

<h3>${en ? 'Seeing where you are: breadcrumbs and Outline' : 'Biết mình đang đứng đâu: breadcrumb và Outline'}</h3>
<p>${en
    ? 'The bar above the editor (<strong>breadcrumbs</strong>) shows folder › file › function. <code>Ctrl+Shift+.</code>/<code>⇧⌘.</code> focuses it so you can jump to a sibling function with arrow keys. The <strong>Outline</strong> view in the Explorer lists every symbol of the file — handy for a 600-line legacy file.'
    : 'Thanh phía trên editor (<strong>breadcrumbs — đường dẫn vụn bánh mì</strong>) hiện thư mục › file › hàm. <code>Ctrl+Shift+.</code>/<code>⇧⌘.</code> nhảy vào thanh đó để dùng phím mũi tên chuyển sang hàm bên cạnh. Mục <strong>Outline</strong> trong Explorer liệt kê mọi symbol của file — rất tiện với một file code cũ 600 dòng.'}</p>

<h3>${en ? '🧪 Practice (10 minutes): ten “where is it called” questions' : '🧪 Thực hành (10 phút): mười câu “gọi ở đâu”'}</h3>
<div class="callout ok"><ol>
<li>${en ? 'Open <code>labflow-mini</code> in VS Code. Put your mouse out of reach. Start a 10-minute timer.' : 'Mở <code>labflow-mini</code> trong VS Code. Để chuột ra xa tầm tay. Bấm đồng hồ 10 phút.'}</li>
<li>${en ? 'Answer, writing the shortcut you used next to each answer:' : 'Trả lời từng câu, ghi kèm phím tắt đã dùng:'}
<ol>
<li>${en ? 'In which file is <code>formatDueDate</code> defined?' : '<code>formatDueDate</code> định nghĩa ở file nào?'}</li>
<li>${en ? 'Which files call <code>formatDueDate</code>?' : 'Những file nào gọi <code>formatDueDate</code>?'}</li>
<li>${en ? 'Which file handles <code>PATCH /tasks/:id/done</code>?' : 'File nào xử lý <code>PATCH /tasks/:id/done</code>?'}</li>
<li>${en ? 'Which two functions does <code>toView</code> call?' : '<code>toView</code> gọi hai hàm nào?'}</li>
<li>${en ? 'Which React function calls <code>markTaskDone</code>?' : 'Hàm React nào gọi <code>markTaskDone</code>?'}</li>
<li>${en ? 'How many users are in <code>USERS</code>?' : '<code>USERS</code> có bao nhiêu người?'}</li>
<li>${en ? 'Where is <code>createApp</code> used?' : '<code>createApp</code> được dùng ở đâu?'}</li>
<li>${en ? 'What HTTP status does <code>createTask</code> set when the title is missing?' : '<code>createTask</code> đặt mã HTTP nào khi thiếu title?'}</li>
<li>${en ? 'Which files contain the text <code>not found</code>?' : 'Những file nào chứa chữ <code>not found</code>?'}</li>
<li>${en ? 'Which function starts at line 20 of <code>task.service.js</code>?' : 'Dòng 20 của <code>task.service.js</code> là hàm nào?'}</li>
</ol></li>
</ol>
<p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? 'all ten answers match the key below, within 10 minutes, and every line has a shortcut written next to it (no “I scrolled”).' : 'cả mười câu khớp đáp án dưới đây, trong 10 phút, và dòng nào cũng ghi phím tắt đã dùng (không có dòng “mình cuộn tìm”).'}</p></div>
${giai(en ? 'Answer key' : 'Đáp án', DAP_11(en))}

<h3>${en ? '🗂 Key terms' : '🗂 Thuật ngữ trong bài'}</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Quick Open</span><span class="v">${en ? 'Open a file by typing part of its name (fuzzy match).' : 'Mở file bằng cách gõ một phần tên (khớp mờ).'}</span></div>
  <div class="kv"><span class="k">Command Palette ${en ? '' : '(bảng lệnh)'}</span><span class="v">${en ? 'Search box for every command, showing its shortcut.' : 'Ô tìm mọi lệnh của VS Code, kèm phím tắt.'}</span></div>
  <div class="kv"><span class="k">${en ? 'Definition' : 'Definition (định nghĩa)'}</span><span class="v">${en ? 'The place where a symbol is declared.' : 'Chỗ một symbol được khai báo.'}</span></div>
  <div class="kv"><span class="k">${en ? 'Reference' : 'Reference (nơi dùng)'}</span><span class="v">${en ? 'A place where a symbol is used.' : 'Một chỗ symbol được dùng tới.'}</span></div>
  <div class="kv"><span class="k">Call Hierarchy ${en ? '' : '(cây lời gọi)'}</span><span class="v">${en ? 'Tree of who calls a function (incoming) or what it calls (outgoing).' : 'Cây ai gọi hàm này (incoming) hoặc hàm này gọi gì (outgoing).'}</span></div>
  <div class="kv"><span class="k">Whole word ${en ? '' : '(nguyên từ)'}</span><span class="v">${en ? 'Match only complete words: <code>done</code> but not <code>onDone</code>.' : 'Chỉ khớp nguyên từ: <code>done</code> mà không khớp <code>onDone</code>.'}</span></div>
  <div class="kv"><span class="k">Glob</span><span class="v">${en ? 'File pattern like <code>src/**/*.js</code> used in include/exclude boxes.' : 'Mẫu tên file như <code>src/**/*.js</code> dùng trong ô include/exclude.'}</span></div>
</div>

<h3>${en ? '📌 Summary' : '📌 Tóm tắt'}</h3>
<ul>
<li>${en ? 'One box, many modes: Ctrl+P/⌘P for files, then <code>&gt;</code> commands, <code>@</code> symbols in file, <code>#</code> symbols in workspace, <code>:</code> line.' : 'Một ô, nhiều chế độ: Ctrl+P/⌘P cho file, rồi <code>&gt;</code> lệnh, <code>@</code> symbol trong file, <code>#</code> symbol cả dự án, <code>:</code> dòng.'}</li>
<li>${en ? 'F12 to go, Alt+F12/⌥F12 to peek, Shift+F12/⇧F12 for references, Go Back to return.' : 'F12 để đi, Alt+F12/⌥F12 để xem nhanh, Shift+F12/⇧F12 để tìm nơi dùng, Go Back để quay về.'}</li>
<li>${en ? 'Call Hierarchy answers “which request reaches this function” in seconds.' : 'Call Hierarchy trả lời “request nào đi tới hàm này” trong vài giây.'}</li>
<li>${en ? 'References for symbols, text search for strings and config; in plain JS do both before renaming.' : 'References cho symbol, tìm chữ cho chuỗi và cấu hình; với JS thuần làm cả hai trước khi đổi tên.'}</li>
<li>${en ? 'Replace in files safely: commit first, narrow with include/exclude, read the preview.' : 'Thay trên nhiều file an toàn: commit trước, thu hẹp bằng include/exclude, đọc bản xem trước.'}</li>
</ul>
${tl('https://code.visualstudio.com/docs/editing/editingevolved', '📘', 'VS Code Docs — Code Navigation', en ? 'Quick Open, Go to Definition, Peek, breadcrumbs' : 'Quick Open, Go to Definition, Peek, breadcrumbs')}
${tl('https://code.visualstudio.com/docs/editing/codebasics', '📘', 'VS Code Docs — Basic Editing', en ? 'Search across files, include/exclude, replace' : 'Tìm trên nhiều file, include/exclude, thay thế')}
${tl('https://code.visualstudio.com/docs/configure/keybindings', '⌨️', 'VS Code Docs — Keyboard shortcuts', en ? 'Defaults for Windows, macOS and Linux + printable PDFs' : 'Phím mặc định cho Windows, macOS, Linux + bản PDF in được')}
</div>
`;

/* ═════════════ 1.2 — Chỉnh sửa nhanh ═════════════ */
const P_CON_TRO = [
  ['Add the next occurrence of the selection', 'Thêm con trỏ ở lần xuất hiện kế tiếp', 'Ctrl+D', '⌘D'],
  ['Skip this occurrence, go to the next', 'Bỏ qua lần này, sang lần kế', 'Ctrl+K Ctrl+D', '⌘K ⌘D'],
  ['Select ALL occurrences', 'Chọn MỌI lần xuất hiện', 'Ctrl+Shift+L', '⇧⌘L'],
  ['Add a cursor where you click', 'Thêm con trỏ chỗ bấm chuột', 'Alt+Click', '⌥Click'],
  ['Add a cursor above / below', 'Thêm con trỏ dòng trên / dưới', 'Ctrl+Alt+↑ / ↓ (Linux: Shift+Alt+↑ / ↓)', '⌥⌘↑ / ↓'],
  ['Cursor at the end of every selected line', 'Con trỏ ở cuối mọi dòng đang chọn', 'Shift+Alt+I', '⇧⌥I'],
  ['Column (box) selection', 'Chọn theo cột (hình chữ nhật)', 'Shift+Alt+drag', '⇧⌥drag'],
  ['Undo the last cursor', 'Bỏ con trỏ vừa thêm', 'Ctrl+U', '⌘U'],
  ['Back to one cursor', 'Về lại một con trỏ', 'Esc', 'Esc'],
];
const P_DONG = [
  ['Move line up / down', 'Chuyển dòng lên / xuống', 'Alt+↑ / ↓', '⌥↑ / ↓'],
  ['Copy line up / down', 'Nhân đôi dòng lên / xuống', 'Shift+Alt+↑ / ↓', '⇧⌥↑ / ↓'],
  ['Delete line', 'Xoá dòng', 'Ctrl+Shift+K', '⇧⌘K'],
  ['New line below / above (cursor anywhere)', 'Dòng mới bên dưới / bên trên (con trỏ ở đâu cũng được)', 'Ctrl+Enter / Ctrl+Shift+Enter', '⌘Enter / ⇧⌘Enter'],
  ['Select the current line', 'Chọn cả dòng', 'Ctrl+L', '⌘L'],
  ['Expand / shrink selection (word → string → call → block)', 'Nới / thu vùng chọn (từ → chuỗi → lời gọi → khối)', 'Shift+Alt+→ / ←', '⌃⇧⌘→ / ←'],
  ['Toggle line comment / block comment', 'Bật tắt chú thích dòng / khối', 'Ctrl+/ / Shift+Alt+A', '⌘/ / ⇧⌥A'],
  ['Indent / outdent', 'Thụt vào / thụt ra', 'Ctrl+] / Ctrl+[', '⌘] / ⌘['],
  ['Format document', 'Định dạng cả file', 'Shift+Alt+F', '⇧⌥F'],
  ['Trigger suggestions / parameter hints', 'Gọi gợi ý / gợi ý tham số', 'Ctrl+Space / Ctrl+Shift+Space', '⌃Space / ⇧⌘Space'],
];
const P_REFACTOR = [
  ['Rename symbol (every reference)', 'Đổi tên symbol (mọi nơi dùng)', 'F2', 'F2'],
  ['Quick Fix / lightbulb', 'Quick Fix / bóng đèn', 'Ctrl+.', '⌘.'],
  ['Refactor menu (extract, move…)', 'Menu refactor (tách, chuyển…)', 'Ctrl+Shift+R', '⌃⇧R'],
  ['Organize imports', 'Sắp xếp và dọn import', 'Shift+Alt+O', '⇧⌥O'],
];
const SEED_JSON = json(`
[
  { "id": 1, "name": "An", "role": "LEAD", "active": true },
  { "id": 2, "name": "Binh", "role": "DEV", "active": true },
  { "id": 3, "name": "Chi", "role": "DEV", "active": false },
  { "id": 4, "name": "Dung", "role": "QA", "active": true },
  { "id": 5, "name": "Giang", "role": "DEV", "active": true },
  { "id": 6, "name": "Hanh", "role": "BA", "active": true },
  { "id": 7, "name": "Khoa", "role": "DEV", "active": false },
  { "id": 8, "name": "Linh", "role": "QA", "active": true },
  { "id": 9, "name": "Minh", "role": "DEV", "active": true },
  { "id": 10, "name": "Nga", "role": "LEAD", "active": true },
  { "id": 11, "name": "Phuc", "role": "DEV", "active": true },
  { "id": 12, "name": "Quan", "role": "DEV", "active": false }
]
`
);
const SEED_JS = js(`
export const SEED = [
  { id: 1, name: 'An', role: 'LEAD', active: true },
  { id: 2, name: 'Binh', role: 'DEV', active: true },
  // … 10 dòng nữa cùng dạng
];
`
);
const SEED_KIEM = bash(`
node -e "import('./web/src/seed.js').then(m => console.log(m.SEED.length, m.SEED[11].name))"
`
);
const SEED_OUT = out(`
12 Quan
`
);
const SNIPPET = json(`
{
  "Express route": {
    "scope": "javascript",
    "prefix": "exroute",
    "body": [
      "\${1:tasksRouter}.\${2|get,post,patch,delete|}('/\${3:path}', (req, res) => {",
      "  $0",
      "});"
    ],
    "description": "Express route handler (labflow-mini)"
  }
}
`
);
const TRUOC_TACH = js(`
// TRƯỚC: hai chỗ dựng lỗi giống hệt nhau trong task.service.js
    const err = new Error('title is required');
    err.status = 400;
    throw err;
// …
    const err = new Error('task not found');
    err.status = 404;
    throw err;
`
);
const SAU_TACH = js(`
// SAU: một hàm, hai chỗ gọi
function httpError(message, status) {
  const err = new Error(message);
  err.status = status;
  return err;
}
// …
    throw httpError('title is required', 400);
// …
    throw httpError('task not found', 404);
`
);
const L2 = (en) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? 'Chapter 1 · VS Code' : 'Chương 1 · VS Code'}</span>
<h2>${en ? '1.2 — Editing fast: multi-cursor, line moves, snippets, rename and quick fixes' : '1.2 — Chỉnh sửa nhanh: đa con trỏ, di chuyển dòng, snippet, đổi tên và quick fix'}</h2>
<p class="lead">${en
    ? 'Lesson 1.1 got you to the right place. This one is about changing code once you are there: editing many lines as if they were one, moving and duplicating lines without copy-paste, letting the language server rename and extract for you, and turning the boilerplate you type every day into a three-letter snippet.'
    : 'Bài 1.1 đưa bạn tới đúng chỗ. Bài này nói về việc sửa code khi đã tới nơi: sửa nhiều dòng như sửa một dòng, chuyển và nhân đôi dòng không cần copy-paste, để language server đổi tên và tách hàm thay bạn, và biến đoạn code mẫu gõ mỗi ngày thành một snippet ba chữ.'}</p>

<h3>${en ? 'Multi-cursor: one edit, many places' : 'Đa con trỏ: sửa một lần, nhiều chỗ cùng đổi'}</h3>
<p>${en
    ? 'With several cursors, everything you type — letters, arrows, <code>Home</code>/<code>End</code>, word jumps with <code>Ctrl+←/→</code> (<code>⌥←/→</code> on Mac) — happens at every cursor at once. The trick is to put cursors on things that <em>look the same</em> and then move them with keys that behave the same on every line.'
    : 'Khi có nhiều con trỏ, mọi thứ bạn gõ — chữ, phím mũi tên, <code>Home</code>/<code>End</code>, nhảy theo từ bằng <code>Ctrl+←/→</code> (Mac: <code>⌥←/→</code>) — xảy ra ở mọi con trỏ cùng lúc. Bí quyết là đặt con trỏ lên những chỗ <em>trông giống nhau</em> rồi di chuyển bằng phím có tác dụng giống nhau trên mọi dòng.'}</p>
${phim(P_CON_TRO, !en)}
<div class="lz-flow">
  <div class="lz-step"><strong>1.</strong> ${en ? 'Double-click (or <code>Ctrl+D</code>/<code>⌘D</code>) a word to select it.' : 'Nhấp đúp (hoặc <code>Ctrl+D</code>/<code>⌘D</code>) một từ để chọn nó.'}</div>
  <div class="lz-step"><strong>2.</strong> ${en ? 'Press <code>Ctrl+D</code>/<code>⌘D</code> again for each next match — watch the counter in the find box.' : 'Bấm tiếp <code>Ctrl+D</code>/<code>⌘D</code> cho từng chỗ khớp kế — để ý bộ đếm trong ô tìm.'}</div>
  <div class="lz-step"><strong>3.</strong> ${en ? 'A match you do not want? <code>Ctrl+K Ctrl+D</code>/<code>⌘K ⌘D</code> skips it.' : 'Chỗ khớp không muốn sửa? <code>Ctrl+K Ctrl+D</code>/<code>⌘K ⌘D</code> bỏ qua.'}</div>
  <div class="lz-step"><strong>4.</strong> ${en ? 'Type. Then <code>Esc</code> to return to one cursor.' : 'Gõ. Xong bấm <code>Esc</code> về lại một con trỏ.'}</div>
</div>
<div class="pitfall co-tieu-de"><p><strong>${en ? 'Ctrl+Shift+L is not rename' : 'Ctrl+Shift+L không phải đổi tên'}</strong></p><p>${en
    ? 'Select-all-occurrences works on <em>text in this file only</em>. It changes the word inside comments and strings too, and it does not touch other files. To rename a variable or function, use <code>F2</code> (below). Multi-cursor is for repetitive <em>shape</em> edits: data rows, object keys, a column of values.'
    : 'Chọn-mọi-lần-xuất-hiện làm việc trên <em>chữ trong đúng file này</em>. Nó sửa cả từ nằm trong chú thích và chuỗi, và không đụng tới file khác. Muốn đổi tên biến hay hàm thì dùng <code>F2</code> (bên dưới). Đa con trỏ dành cho sửa lặp lại theo <em>hình dạng</em>: các dòng dữ liệu, khoá của object, một cột giá trị.'}</p></div>

<h3>${en ? 'Lines without copy-paste' : 'Thao tác dòng không cần copy-paste'}</h3>
${phim(P_DONG, !en)}
<p>${en
    ? 'Two of these change how you work. <strong>Move line</strong> (<code>Alt+↑/↓</code>, <code>⌥↑/↓</code>) reorders statements or JSX elements without cutting anything, and works on a multi-line selection. <strong>Expand selection</strong> grows the selection along the syntax tree: inside <code>formatDueDate(task.due)</code> press it repeatedly and you select <code>due</code> → <code>task.due</code> → the whole call → the object property → the whole object. It is the fastest way to select “exactly this expression”.'
    : 'Hai phím trong bảng này thay đổi cách bạn làm việc. <strong>Chuyển dòng</strong> (<code>Alt+↑/↓</code>, <code>⌥↑/↓</code>) đổi thứ tự câu lệnh hay phần tử JSX mà không phải cắt dán, và dùng được với nhiều dòng đang chọn. <strong>Nới vùng chọn</strong> mở rộng vùng chọn theo cây cú pháp: đứng trong <code>formatDueDate(task.due)</code> bấm liên tiếp là chọn <code>due</code> → <code>task.due</code> → cả lời gọi → thuộc tính của object → cả object. Đây là cách nhanh nhất để chọn “đúng biểu thức này”.'}</p>

<h3>${en ? 'Let the language server change the code: rename, quick fix, extract' : 'Để language server sửa code: đổi tên, quick fix, tách'}</h3>
${phim(P_REFACTOR, !en)}
<ul>
<li>${en
    ? '<strong>Rename (F2)</strong> changes the declaration and every reference the language server knows, across files, including <code>import { … }</code> lines. Before applying, <code>Shift+Enter</code> in the rename box opens a <em>preview</em> of every change.'
    : '<strong>Đổi tên (F2)</strong> sửa chỗ khai báo và mọi nơi dùng mà language server biết, trên nhiều file, kể cả dòng <code>import { … }</code>. Trước khi áp dụng, bấm <code>Shift+Enter</code> trong ô đổi tên để mở <em>bản xem trước</em> mọi thay đổi.'}</li>
<li>${en
    ? '<strong>Quick Fix (Ctrl+. / ⌘.)</strong> appears as a lightbulb: add a missing import, fix a spelling, convert to a template string, remove unused code. Put the cursor on a red squiggle and press it before reaching for Google.'
    : '<strong>Quick Fix (Ctrl+. / ⌘.)</strong> hiện thành bóng đèn: thêm import còn thiếu, sửa tên gõ sai, đổi sang template string, xoá code không dùng. Đặt con trỏ lên dòng gạch đỏ và bấm nó trước khi đi tìm Google.'}</li>
<li>${en
    ? '<strong>Refactor (Ctrl+Shift+R / ⌃⇧R)</strong> on a selection offers <em>Extract to function</em>, <em>Extract to constant</em> and <em>Move to a new file</em> (which also fixes the imports). Moving or renaming a file in the Explorer offers to update imports too (setting <code>javascript.updateImportsOnFileMove.enabled</code>).'
    : '<strong>Refactor (Ctrl+Shift+R / ⌃⇧R)</strong> trên một vùng chọn cho <em>Extract to function</em> (tách thành hàm), <em>Extract to constant</em> (tách thành hằng) và <em>Move to a new file</em> (chuyển sang file mới, tự sửa import). Đổi tên hay chuyển file trong Explorer cũng được hỏi có cập nhật import không (cài đặt <code>javascript.updateImportsOnFileMove.enabled</code>).'}</li>
</ul>
<p>${en ? 'A real extract in labflow-mini — the same three lines appear twice in <code>task.service.js</code>:' : 'Một lần tách thật trong labflow-mini — ba dòng giống nhau xuất hiện hai lần trong <code>task.service.js</code>:'}</p>
${TRUOC_TACH}
${SAU_TACH}
<p>${en
    ? 'VS Code’s <em>Extract to function in module scope</em> creates the function from your selection with a placeholder name; you then rename it with F2 and adjust the parameters. The refactoring is mechanical — the thinking (what the function should be called, what it takes) is yours.'
    : '<em>Extract to function in module scope</em> của VS Code dựng hàm từ vùng bạn chọn với tên tạm; bạn đổi tên bằng F2 và chỉnh tham số. Phần cơ học là của công cụ — phần suy nghĩ (hàm tên gì, nhận gì) là của bạn.'}</p>

<h3>${en ? 'Snippets: your own three-letter shortcuts' : 'Snippet: phím tắt ba chữ của riêng bạn'}</h3>
<p>${en
    ? 'A snippet is a template you expand by typing its prefix and pressing <code>Tab</code>. VS Code ships some (type <code>for</code> in a JS file). Project snippets live in <code>.vscode/*.code-snippets</code>, so the whole team gets them through Git. Command Palette → <em>Snippets: Configure Snippets</em> → <em>New Snippets file for ‘labflow-mini’…</em>, name it <code>labflow</code>:'
    : 'Snippet (đoạn mẫu) là khuôn bạn bung ra bằng cách gõ tiền tố rồi bấm <code>Tab</code>. VS Code có sẵn một số (gõ <code>for</code> trong file JS). Snippet của dự án nằm trong <code>.vscode/*.code-snippets</code>, nên cả nhóm cùng có qua Git. Command Palette → <em>Snippets: Configure Snippets</em> → <em>New Snippets file for ‘labflow-mini’…</em>, đặt tên <code>labflow</code>:'}</p>
${SNIPPET}
<p>${en
    ? '<code>$1</code>, <code>$2</code>, <code>$3</code> are tab stops (Tab jumps to the next), <code>\${1:tasksRouter}</code> gives a default, <code>\${2|get,post,patch,delete|}</code> offers a choice list, <code>$0</code> is where the cursor ends. Make a snippet only for something you have typed at least five times.'
    : '<code>$1</code>, <code>$2</code>, <code>$3</code> là các điểm dừng (Tab nhảy sang điểm kế), <code>\${1:tasksRouter}</code> có giá trị mặc định, <code>\${2|get,post,patch,delete|}</code> cho chọn trong danh sách, <code>$0</code> là chỗ con trỏ dừng cuối. Chỉ làm snippet cho thứ bạn đã gõ ít nhất năm lần.'}</p>

<h3>${en ? '🧪 Practice (15 minutes, keyboard only)' : '🧪 Thực hành (15 phút, chỉ bàn phím)'}</h3>
<div class="callout ok"><ol>
<li>${en ? 'In labflow-mini create <code>web/src/seed.js</code> (<code>Ctrl+N</code>/<code>⌘N</code>, then save as) and paste this JSON:' : 'Trong labflow-mini tạo <code>web/src/seed.js</code> (<code>Ctrl+N</code>/<code>⌘N</code> rồi lưu tên đó) và dán JSON này:'}</li>
</ol>
${SEED_JSON}
<ol start="2">
<li>${en ? 'Without the mouse, turn it into a JS module like this: keys without quotes, strings in single quotes, <code>export const SEED = </code> in front and <code>;</code> at the end. Hint: select <code>"id"</code> → <code>Ctrl+Shift+L</code>/<code>⇧⌘L</code> → type <code>id</code>; repeat for the other keys; for the values, select the first <code>"</code> of a name … or use Find (<code>Ctrl+H</code>/<code>⌥⌘F</code>) for <code>"</code> → <code>&#39;</code> after the keys are done.' : 'Không dùng chuột, biến nó thành module JS như dưới: khoá không có nháy, chuỗi dùng nháy đơn, thêm <code>export const SEED = </code> ở đầu và <code>;</code> ở cuối. Gợi ý: chọn <code>"id"</code> → <code>Ctrl+Shift+L</code>/<code>⇧⌘L</code> → gõ <code>id</code>; lặp lại với các khoá khác; với giá trị, sau khi xong khoá thì dùng Find/Replace (<code>Ctrl+H</code>/<code>⌥⌘F</code>) đổi <code>"</code> thành <code>&#39;</code>.'}</li>
</ol>
${SEED_JS}
<ol start="3">
<li>${en ? 'Check it loads (run in the project folder):' : 'Kiểm module nạp được (chạy trong thư mục dự án):'}</li>
</ol>
${SEED_KIEM}
${SEED_OUT}
<ol start="4">
<li>${en ? 'In <code>src/services/task.service.js</code>, extract the duplicated error lines into <code>httpError(message, status)</code> using Refactor (<code>Ctrl+Shift+R</code>/<code>⌃⇧R</code>) and F2, as shown above. Run <code>npm test</code>.' : 'Trong <code>src/services/task.service.js</code>, tách các dòng dựng lỗi lặp lại thành <code>httpError(message, status)</code> bằng Refactor (<code>Ctrl+Shift+R</code>/<code>⌃⇧R</code>) và F2 như ở trên. Chạy <code>npm test</code>.'}</li>
<li>${en ? 'Rename <code>markDone</code> to <code>completeTask</code> with F2 and open the preview with <code>Shift+Enter</code> first. Count the files it changes.' : 'Đổi tên <code>markDone</code> thành <code>completeTask</code> bằng F2, mở bản xem trước bằng <code>Shift+Enter</code> trước. Đếm số file bị đổi.'}</li>
</ol>
<p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? 'the check prints <code>12 Quan</code>; <code>npm test</code> shows <code>fail 0</code>; <code>git diff --stat</code> shows the rename touched exactly <code>task.service.js</code> and <code>tasks.routes.js</code>; and you never touched the mouse. Keep the changes — commit them with <code>git commit -am "refactor: httpError, completeTask"</code> after <code>git add web/src/seed.js</code>.' : 'lệnh kiểm in <code>12 Quan</code>; <code>npm test</code> báo <code>fail 0</code>; <code>git diff --stat</code> cho thấy việc đổi tên chạm đúng <code>task.service.js</code> và <code>tasks.routes.js</code>; và bạn không chạm chuột lần nào. Giữ các thay đổi — <code>git add web/src/seed.js</code> rồi commit bằng <code>git commit -am "refactor: httpError, completeTask"</code>.'}</p></div>

<h3>${en ? '🗂 Key terms' : '🗂 Thuật ngữ trong bài'}</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">${en ? 'Multi-cursor' : 'Multi-cursor (đa con trỏ)'}</span><span class="v">${en ? 'Several insertion points; every keystroke applies to all.' : 'Nhiều điểm chèn; mỗi phím bấm áp lên tất cả.'}</span></div>
  <div class="kv"><span class="k">${en ? 'Occurrence' : 'Occurrence (lần xuất hiện)'}</span><span class="v">${en ? 'Another place where the same text appears.' : 'Một chỗ khác có cùng đoạn chữ.'}</span></div>
  <div class="kv"><span class="k">${en ? 'Expand selection' : 'Expand selection (nới vùng chọn)'}</span><span class="v">${en ? 'Grow the selection to the enclosing syntax node.' : 'Mở vùng chọn ra nút cú pháp bao ngoài.'}</span></div>
  <div class="kv"><span class="k">Quick Fix</span><span class="v">${en ? 'Lightbulb suggestions to fix or improve the code at the cursor.' : 'Gợi ý bóng đèn để sửa/cải thiện code tại con trỏ.'}</span></div>
  <div class="kv"><span class="k">${en ? 'Extract' : 'Extract (tách)'}</span><span class="v">${en ? 'Turn selected code into a function, constant or new file.' : 'Biến đoạn code đang chọn thành hàm, hằng hoặc file mới.'}</span></div>
  <div class="kv"><span class="k">Snippet</span><span class="v">${en ? 'A template expanded from a short prefix, with tab stops.' : 'Khuôn bung ra từ một tiền tố ngắn, có điểm dừng Tab.'}</span></div>
  <div class="kv"><span class="k">${en ? 'Tab stop' : 'Tab stop (điểm dừng)'}</span><span class="v">${en ? '<code>$1</code>, <code>$2</code>… — where Tab moves the cursor inside a snippet.' : '<code>$1</code>, <code>$2</code>… — chỗ phím Tab đưa con trỏ tới trong snippet.'}</span></div>
</div>

<h3>${en ? '📌 Summary' : '📌 Tóm tắt'}</h3>
<ul>
<li>${en ? 'Ctrl+D/⌘D adds the next match, Ctrl+Shift+L/⇧⌘L takes all, Alt/⌥+Click places cursors by hand.' : 'Ctrl+D/⌘D thêm chỗ khớp kế, Ctrl+Shift+L/⇧⌘L lấy tất cả, Alt/⌥+Click đặt con trỏ bằng tay.'}</li>
<li>${en ? 'Multi-cursor is for repetitive shapes in one file; F2 is for renaming symbols across files.' : 'Đa con trỏ dùng cho sửa lặp lại trong một file; F2 dùng để đổi tên symbol trên nhiều file.'}</li>
<li>${en ? 'Move/copy lines with Alt/⌥+arrows, select expressions with Expand Selection.' : 'Chuyển/nhân đôi dòng bằng Alt/⌥+mũi tên, chọn biểu thức bằng Expand Selection.'}</li>
<li>${en ? 'Ctrl+./⌘. before Google; Ctrl+Shift+R/⌃⇧R for extract and move to file.' : 'Ctrl+./⌘. trước khi tra Google; Ctrl+Shift+R/⌃⇧R để tách hàm và chuyển file.'}</li>
<li>${en ? 'Project snippets in .vscode/*.code-snippets travel with Git to the whole team.' : 'Snippet dự án trong .vscode/*.code-snippets đi theo Git tới cả nhóm.'}</li>
</ul>
${tl('https://code.visualstudio.com/docs/editing/codebasics', '📘', 'VS Code Docs — Basic Editing', en ? 'Multiple selections, column selection, line operations' : 'Đa vùng chọn, chọn cột, thao tác dòng')}
${tl('https://code.visualstudio.com/docs/editing/refactoring', '📘', 'VS Code Docs — Refactoring', en ? 'Rename, extract, Code Actions' : 'Đổi tên, tách, Code Actions')}
${tl('https://code.visualstudio.com/docs/editing/userdefinedsnippets', '📘', 'VS Code Docs — Snippets in Visual Studio Code', en ? 'Snippet syntax: tab stops, placeholders, choices' : 'Cú pháp snippet: điểm dừng, giá trị mặc định, lựa chọn')}
</div>
`;

/* ═════════════ 1.3 — Settings, workspace, tasks, launch ═════════════ */
const USER_SETTINGS = json(`
// settings.json của NGƯỜI DÙNG — áp cho mọi dự án trên máy bạn
{
  "editor.formatOnSave": true,
  "files.autoSave": "onFocusChange",
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  "editor.linkedEditing": true,
  "editor.stickyScroll.enabled": true,
  "editor.minimap.enabled": false,
  "explorer.confirmDragAndDrop": false,
  "terminal.integrated.scrollback": 10000
}
`
);
const WS_SETTINGS = json(`
// labflow-mini/.vscode/settings.json — commit vào Git, cả nhóm dùng chung
{
  "editor.tabSize": 2,
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": { "source.fixAll.eslint": "explicit" },
  "files.eol": "\\n",
  "[markdown]": { "editor.formatOnSave": false },
  "search.exclude": { "**/coverage": true, "**/dist": true }
}
`
);
const EXT_JSON = json(`
// labflow-mini/.vscode/extensions.json — VS Code gợi ý cài khi bạn cùng nhóm mở repo
{
  "recommendations": ["dbaeumer.vscode-eslint", "esbenp.prettier-vscode"]
}
`
);
const TASKS_JSON = json(`
// labflow-mini/.vscode/tasks.json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "test",
      "type": "npm",
      "script": "test",
      "group": { "kind": "test", "isDefault": true },
      "problemMatcher": []
    },
    {
      "label": "dev server",
      "type": "npm",
      "script": "dev",
      "isBackground": true,
      "problemMatcher": []
    }
  ]
}
`
);
const KEYB = json(`
// keybindings.json (Command Palette → "Preferences: Open Keyboard Shortcuts (JSON)")
[
  { "key": "ctrl+k t", "command": "workbench.action.tasks.test" }
]
// trên Mac ghi "cmd+k t"
`
);
const LAUNCH_JSON = json(`
// labflow-mini/.vscode/launch.json — hai cấu hình chạy cơ bản
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "labflow-mini: server",
      "program": "\${workspaceFolder}/src/server.js",
      "env": { "PORT": "3000" },
      "skipFiles": ["<node_internals>/**"]
    },
    {
      "type": "node",
      "request": "launch",
      "name": "labflow-mini: npm test",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["test"],
      "console": "integratedTerminal"
    }
  ]
}
`
);
const P_CHAY = [
  ['Open Settings (UI)', 'Mở Settings (giao diện)', 'Ctrl+,', '⌘,'],
  ['Run Build Task (default build task)', 'Chạy build task mặc định', 'Ctrl+Shift+B', '⇧⌘B'],
  ['Toggle the integrated terminal', 'Bật tắt terminal tích hợp', 'Ctrl+`', '⌃`'],
  ['Open Run and Debug view', 'Mở khung Run and Debug', 'Ctrl+Shift+D', '⇧⌘D'],
  ['Start with debugger / without debugger', 'Chạy có debugger / không debugger', 'F5 / Ctrl+F5', 'F5 / ⌃F5'],
  ['Stop / restart', 'Dừng / chạy lại', 'Shift+F5 / Ctrl+Shift+F5', '⇧F5 / ⇧⌘F5'],
  ['Toggle breakpoint', 'Đặt / bỏ breakpoint', 'F9', 'F9'],
];
const KIEM_CHAY = bash(`
# terminal khác, khi "labflow-mini: server" đang chạy từ Run and Debug:
curl -s localhost:3000/users/2
`
);
const KIEM_CHAY_OUT = out(`
{"id":2,"name":"Binh","role":"DEV"}
`
);
const L3 = (en) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? 'Chapter 1 · VS Code' : 'Chương 1 · VS Code'}</span>
<h2>${en ? '1.3 — Settings, workspace settings and .vscode for the team; tasks.json' : '1.3 — Settings, workspace settings và thư mục .vscode cho cả nhóm; tasks.json'}</h2>
<p class="lead">${en
    ? 'In a team project the classic fight is formatting: one person saves with 4 spaces, another with 2, every pull request shows 300 changed lines that are only whitespace. VS Code solves it with layers of settings — yours and the project’s — and a <code>.vscode</code> folder committed to Git. In the same folder live <code>tasks.json</code> (run test/build with one key) and <code>launch.json</code> (start the app from the Run view). This lesson sets up all four for labflow-mini.'
    : 'Trong đồ án nhóm, trận cãi kinh điển là định dạng: người lưu bằng 4 dấu cách, người lưu bằng 2, pull request nào cũng 300 dòng thay đổi mà toàn là khoảng trắng. VS Code giải bằng các tầng cài đặt — của bạn và của dự án — cộng một thư mục <code>.vscode</code> commit vào Git. Cùng thư mục đó có <code>tasks.json</code> (chạy test/build bằng một phím) và <code>launch.json</code> (chạy ứng dụng từ khung Run). Bài này dựng cả bốn file cho labflow-mini.'}</p>

<h3>${en ? 'Layers of settings: who wins' : 'Các tầng cài đặt: ai thắng'}</h3>
<div class="lz-stack">
  <div class="lz-layer"><strong>${en ? 'Language-specific' : 'Theo ngôn ngữ'}</strong> — <code>"[javascript]": { … }</code> ${en ? 'inside either file below (wins over plain settings in the same file)' : 'nằm trong một trong hai file dưới (thắng cài đặt thường cùng file)'}</div>
  <div class="lz-layer"><strong>Workspace</strong> — <code>.vscode/settings.json</code> ${en ? 'in the project, committed' : 'trong dự án, commit vào Git'}</div>
  <div class="lz-layer"><strong>User</strong> — ${en ? 'your machine, every project' : 'máy của bạn, mọi dự án'}</div>
  <div class="lz-layer"><strong>Default</strong> — ${en ? 'what VS Code ships' : 'mặc định của VS Code'}</div>
</div>
<p>${en
    ? 'The higher layer wins. So: personal taste (theme, font, minimap, auto save) goes in <strong>User</strong>; anything that changes the files you commit (indentation, formatter, line endings) goes in <strong>Workspace</strong>. Open the UI with <code>Ctrl+,</code>/<code>⌘,</code> — the tabs <em>User</em> and <em>Workspace</em> at the top choose the layer. The JSON files: Command Palette → <em>Preferences: Open User Settings (JSON)</em> or <em>Open Workspace Settings (JSON)</em>.'
    : 'Tầng trên thắng. Vì vậy: sở thích cá nhân (theme, font, minimap, tự lưu) đặt ở <strong>User</strong>; thứ gì làm thay đổi file bạn commit (thụt lề, formatter, kiểu xuống dòng) đặt ở <strong>Workspace</strong>. Mở giao diện bằng <code>Ctrl+,</code>/<code>⌘,</code> — hai tab <em>User</em> và <em>Workspace</em> ở trên cùng là chọn tầng. File JSON: Command Palette → <em>Preferences: Open User Settings (JSON)</em> hoặc <em>Open Workspace Settings (JSON)</em>.'}</p>
<table>
<thead><tr><th>${en ? 'User settings file' : 'File cài đặt User'}</th><th>${en ? 'Location' : 'Vị trí'}</th></tr></thead>
<tbody>
<tr><td>macOS</td><td><code>~/Library/Application Support/Code/User/settings.json</code></td></tr>
<tr><td>Windows</td><td><code>%APPDATA%\\Code\\User\\settings.json</code></td></tr>
<tr><td>Linux</td><td><code>~/.config/Code/User/settings.json</code></td></tr>
</tbody>
</table>
<p>${en ? 'A sensible starting User file (every key is explained by hovering it in the editor):' : 'Một file User khởi đầu hợp lý (rê chuột lên từng khoá trong editor là có giải thích):'}</p>
${USER_SETTINGS}

<h3>${en ? 'The team folder: .vscode/' : 'Thư mục của nhóm: .vscode/'}</h3>
${WS_SETTINGS}
${EXT_JSON}
<ul>
<li>${en ? '<code>files.eol</code> fixes line endings for files VS Code creates — the Windows/Mac CRLF problem from the Git course (14.4) at the editor level.' : '<code>files.eol</code> chốt kiểu xuống dòng cho file VS Code tạo — vấn đề CRLF Windows/Mac của khoá Git (14.4), xử lý ngay ở editor.'}</li>
<li>${en ? '<code>"explicit"</code> in <code>codeActionsOnSave</code> means “run on explicit save (Ctrl+S)”, not on auto save.' : '<code>"explicit"</code> trong <code>codeActionsOnSave</code> nghĩa là “chạy khi bạn chủ động lưu (Ctrl+S)”, không chạy khi tự lưu.'}</li>
<li>${en ? 'When a teammate opens the repo, <code>extensions.json</code> makes VS Code offer to install the recommended extensions (lesson 1.4 covers which ones).' : 'Khi bạn cùng nhóm mở repo, <code>extensions.json</code> làm VS Code đề nghị cài các extension được gợi ý (bài 1.4 nói nên cài gì).'}</li>
<li>${en ? 'Commit <code>settings.json</code>, <code>extensions.json</code>, <code>tasks.json</code>, <code>launch.json</code>. Some <code>.gitignore</code> templates ignore the whole <code>.vscode/</code> folder — check with <code>git check-ignore -v .vscode/settings.json</code>.' : 'Commit <code>settings.json</code>, <code>extensions.json</code>, <code>tasks.json</code>, <code>launch.json</code>. Một số mẫu <code>.gitignore</code> bỏ qua cả thư mục <code>.vscode/</code> — kiểm bằng <code>git check-ignore -v .vscode/settings.json</code>.'}</li>
</ul>
<div class="pitfall co-tieu-de"><p><strong>${en ? 'Settings are not enforcement' : 'Cài đặt không phải là cưỡng chế'}</strong></p><p>${en
    ? 'Workspace settings only help people who use VS Code and have the extensions. The real rule belongs in the project: a Prettier config file, an ESLint config and a CI check. The editor settings make following the rule effortless; CI makes it mandatory.'
    : 'Cài đặt workspace chỉ giúp người dùng VS Code và đã cài extension. Luật thật phải nằm trong dự án: file cấu hình Prettier, cấu hình ESLint và một bước kiểm trong CI. Cài đặt editor giúp tuân thủ dễ dàng; CI mới làm nó bắt buộc.'}</p></div>

<h3>${en ? 'tasks.json: run test and dev server without typing commands' : 'tasks.json: chạy test và dev server không cần gõ lệnh'}</h3>
${TASKS_JSON}
<p>${en
    ? '<code>"type": "npm"</code> runs a script from <code>package.json</code>. <code>"group": { "kind": "test", "isDefault": true }</code> makes it the target of <em>Tasks: Run Test Task</em>. A build task marked <code>"kind": "build"</code> would run with <code>Ctrl+Shift+B</code>/<code>⇧⌘B</code>; test has no default shortcut, so bind one:'
    : '<code>"type": "npm"</code> chạy một script trong <code>package.json</code>. <code>"group": { "kind": "test", "isDefault": true }</code> biến nó thành đích của lệnh <em>Tasks: Run Test Task</em>. Một task build đánh dấu <code>"kind": "build"</code> sẽ chạy bằng <code>Ctrl+Shift+B</code>/<code>⇧⌘B</code>; test thì không có phím mặc định, nên tự gán:'}</p>
${KEYB}
<p>${en ? 'After adding it, open <em>Preferences: Open Keyboard Shortcuts</em> and search <code>ctrl+k t</code> (or <code>cmd+k t</code>) to make sure nothing else uses it.' : 'Thêm xong, mở <em>Preferences: Open Keyboard Shortcuts</em> và tìm <code>ctrl+k t</code> (hoặc <code>cmd+k t</code>) để chắc không có lệnh khác dùng trùng.'}</p>

<h3>${en ? 'Running the app: launch.json basics' : 'Chạy ứng dụng: launch.json cơ bản'}</h3>
${phim(P_CHAY, !en)}
<p>${en
    ? 'Open Run and Debug (<code>Ctrl+Shift+D</code>/<code>⇧⌘D</code>), click <em>create a launch.json file</em>, choose Node.js, and replace the content with:'
    : 'Mở Run and Debug (<code>Ctrl+Shift+D</code>/<code>⇧⌘D</code>), bấm <em>create a launch.json file</em>, chọn Node.js, rồi thay nội dung bằng:'}</p>
${LAUNCH_JSON}
<p>${en
    ? 'Pick a configuration in the dropdown and press <code>Ctrl+F5</code>/<code>⌃F5</code> to run it, or <code>F5</code> to run it with the debugger attached. <code>\${workspaceFolder}</code> is the project root, <code>env</code> sets environment variables, <code>skipFiles</code> keeps the debugger out of Node’s internals. The quickest way to debug anything once: Command Palette → <em>Debug: JavaScript Debug Terminal</em>, then run <code>npm test</code> in that terminal — it attaches automatically.'
    : 'Chọn cấu hình trong danh sách thả xuống và bấm <code>Ctrl+F5</code>/<code>⌃F5</code> để chạy, hoặc <code>F5</code> để chạy kèm debugger. <code>\${workspaceFolder}</code> là thư mục gốc dự án, <code>env</code> đặt biến môi trường, <code>skipFiles</code> giữ debugger khỏi nhảy vào phần nội bộ của Node. Cách nhanh nhất để debug thứ gì đó một lần: Command Palette → <em>Debug: JavaScript Debug Terminal</em>, rồi chạy <code>npm test</code> trong terminal đó — nó tự gắn debugger.'}</p>
<div class="callout ok"><p>${en ? 'Breakpoints, stepping, watch expressions, conditional breakpoints and attaching to a running process are taught in the Debugging course: ' : 'Breakpoint, chạy từng bước, watch, breakpoint có điều kiện và gắn vào tiến trình đang chạy được dạy ở khoá Gỡ lỗi: '}${bai('debug-co-phuong-phap', 'dbg-3-1-launch-json', en ? 'Debugging 3.1 — launch.json' : 'Gỡ lỗi 3.1 — launch.json')}. ${en ? 'Here you only need to start and stop the app from the editor.' : 'Ở đây bạn chỉ cần chạy và dừng ứng dụng từ editor.'}</p></div>

<h3>${en ? 'Taking your settings to a new machine: Settings Sync' : 'Mang cài đặt sang máy mới: Settings Sync'}</h3>
<p>${en
    ? 'Accounts icon (bottom left) → <em>Backup and Sync Settings…</em> → sign in with GitHub or Microsoft. Settings, keybindings, snippets and the extension list follow you. Chapter 6 does the same with dotfiles for everything outside VS Code.'
    : 'Biểu tượng Accounts (góc dưới bên trái) → <em>Backup and Sync Settings…</em> → đăng nhập GitHub hoặc Microsoft. Cài đặt, phím tắt, snippet và danh sách extension đi theo bạn. Chương 6 làm điều tương tự bằng dotfiles cho mọi thứ ngoài VS Code.'}</p>

<h3>${en ? '🧪 Practice (20 minutes)' : '🧪 Thực hành (20 phút)'}</h3>
<div class="callout ok"><ol>
<li>${en ? 'Put the User settings above in your User settings JSON (keep anything you already had).' : 'Đưa các cài đặt User ở trên vào file User settings JSON của bạn (giữ những gì đã có).'}</li>
<li>${en ? 'In labflow-mini create <code>.vscode/settings.json</code>, <code>.vscode/extensions.json</code>, <code>.vscode/tasks.json</code> and <code>.vscode/launch.json</code> with the contents of this lesson.' : 'Trong labflow-mini tạo <code>.vscode/settings.json</code>, <code>.vscode/extensions.json</code>, <code>.vscode/tasks.json</code> và <code>.vscode/launch.json</code> với nội dung trong bài.'}</li>
<li>${en ? 'Add the keybinding and run the test task with it.' : 'Thêm phím tắt và chạy task test bằng nó.'}</li>
<li>${en ? 'Select “labflow-mini: server” in Run and Debug, press <code>Ctrl+F5</code>/<code>⌃F5</code>, then in another terminal:' : 'Chọn “labflow-mini: server” trong Run and Debug, bấm <code>Ctrl+F5</code>/<code>⌃F5</code>, rồi ở terminal khác:'}</li>
</ol>
${KIEM_CHAY}
${KIEM_CHAY_OUT}
<ol start="5">
<li>${en ? 'Stop it with <code>Shift+F5</code>/<code>⇧F5</code>. Commit: <code>git add .vscode &amp;&amp; git commit -m "chore: vscode settings, tasks, launch"</code>.' : 'Dừng bằng <code>Shift+F5</code>/<code>⇧F5</code>. Commit: <code>git add .vscode &amp;&amp; git commit -m "chore: vscode settings, tasks, launch"</code>.'}</li>
</ol>
<p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? 'your keybinding opens a terminal panel ending in <code>fail 0</code>; <code>curl</code> prints Binh’s JSON while the server runs from Run and Debug; <code>git show --stat HEAD</code> lists exactly the four files under <code>.vscode/</code>.' : 'phím tắt của bạn mở khung terminal kết thúc bằng <code>fail 0</code>; <code>curl</code> in JSON của Binh khi server chạy từ Run and Debug; <code>git show --stat HEAD</code> liệt kê đúng bốn file trong <code>.vscode/</code>.'}</p></div>

<h3>${en ? '🗂 Key terms' : '🗂 Thuật ngữ trong bài'}</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">${en ? 'User settings' : 'User settings (cài đặt người dùng)'}</span><span class="v">${en ? 'Your preferences, for every project on this machine.' : 'Sở thích của bạn, áp cho mọi dự án trên máy.'}</span></div>
  <div class="kv"><span class="k">${en ? 'Workspace settings' : 'Workspace settings (cài đặt dự án)'}</span><span class="v">${en ? '<code>.vscode/settings.json</code>; override User; shared through Git.' : '<code>.vscode/settings.json</code>; đè lên User; dùng chung qua Git.'}</span></div>
  <div class="kv"><span class="k">Formatter</span><span class="v">${en ? 'Tool that rewrites spacing and layout (Prettier).' : 'Công cụ tự sắp lại khoảng trắng và bố cục (Prettier).'}</span></div>
  <div class="kv"><span class="k">Task</span><span class="v">${en ? 'A named command in <code>tasks.json</code> VS Code can run and track.' : 'Một lệnh có tên trong <code>tasks.json</code> VS Code chạy và theo dõi được.'}</span></div>
  <div class="kv"><span class="k">${en ? 'Launch configuration' : 'Launch configuration (cấu hình chạy)'}</span><span class="v">${en ? 'An entry in <code>launch.json</code>: what to start, with which env and args.' : 'Một mục trong <code>launch.json</code>: chạy gì, biến môi trường và tham số nào.'}</span></div>
  <div class="kv"><span class="k">Settings Sync</span><span class="v">${en ? 'Backs up settings, keybindings, snippets and extensions to your account.' : 'Sao lưu cài đặt, phím tắt, snippet và extension vào tài khoản.'}</span></div>
</div>

<h3>${en ? '📌 Summary' : '📌 Tóm tắt'}</h3>
<ul>
<li>${en ? 'Default ← User ← Workspace ← language-specific: the more specific layer wins.' : 'Default ← User ← Workspace ← theo ngôn ngữ: tầng cụ thể hơn thắng.'}</li>
<li>${en ? 'Personal taste in User; anything that changes committed files in Workspace.' : 'Sở thích riêng ở User; thứ gì làm đổi file commit thì ở Workspace.'}</li>
<li>${en ? 'Commit .vscode/settings, extensions, tasks and launch; enforce rules with config files and CI.' : 'Commit .vscode/settings, extensions, tasks và launch; cưỡng chế luật bằng file cấu hình và CI.'}</li>
<li>${en ? 'npm tasks + a keybinding turn “type the test command” into one key press.' : 'Task npm + một phím tắt biến “gõ lệnh test” thành một lần bấm.'}</li>
<li>${en ? 'Ctrl+F5/⌃F5 runs a launch configuration, F5 adds the debugger — the debugger itself is in the Debugging course.' : 'Ctrl+F5/⌃F5 chạy một cấu hình, F5 chạy kèm debugger — bản thân debugger học ở khoá Gỡ lỗi.'}</li>
</ul>
${tl('https://code.visualstudio.com/docs/configure/settings', '📘', 'VS Code Docs — User and workspace settings', en ? 'Layers, JSON files, language-specific settings' : 'Các tầng, file JSON, cài đặt theo ngôn ngữ')}
${tl('https://code.visualstudio.com/docs/debugtest/tasks', '📘', 'VS Code Docs — Integrate with external tools via tasks', en ? 'tasks.json, npm tasks, groups, problem matchers' : 'tasks.json, task npm, nhóm, problem matcher')}
${tl('https://code.visualstudio.com/docs/debugtest/debugging-configuration', '📘', 'VS Code Docs — Debug configuration', en ? 'launch.json attributes and variables' : 'Thuộc tính và biến của launch.json')}
</div>
`;

/* ═════════════ 1.4 — Extension và rủi ro bảo mật ═════════════ */
const EXT_CLI = bash(`
code --list-extensions                          # liệt kê extension đang cài (id dạng publisher.ten)
code --install-extension dbaeumer.vscode-eslint # cài theo ĐÚNG id, không theo tên hiển thị
code --uninstall-extension ten.extension-khong-dung
`
);
const REPO_LA = bash(`
# Dựng một "repo lạ" vô hại để thấy Workspace Trust làm việc
mkdir -p ~/do-nghe/repo-la/.vscode && cd ~/do-nghe/repo-la
cat > .vscode/tasks.json <<'EOF'
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "chay-khi-mo",
      "type": "shell",
      "command": "echo DA-CHAY > da-chay.txt",
      "runOptions": { "runOn": "folderOpen" }
    }
  ]
}
EOF
code .
`
);
const REPO_LA_KIEM = bash(`
# sau khi chọn "No, I don't trust the authors": chỉ còn .vscode, KHÔNG có da-chay.txt
ls -a ~/do-nghe/repo-la
`
);
const REPO_LA_OUT = out(`
.
..
.vscode
`
);
const L4 = (en) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? 'Chapter 1 · VS Code' : 'Chương 1 · VS Code'}</span>
<h2>${en ? '1.4 — Extensions worth installing — and the security risk of extensions' : '1.4 — Extension đáng cài — và rủi ro bảo mật của extension'}</h2>
<p class="lead">${en
    ? 'Extensions are what turn VS Code into an IDE for your stack. They are also programs that run on your machine with <strong>your</strong> permissions: they can read every file in your home folder, your <code>.env</code> files, your SSH keys and your Git tokens, and talk to the network. This lesson gives you a short list worth installing and the habits that keep a fake extension or a booby-trapped repository from owning your laptop.'
    : 'Extension (tiện ích mở rộng) là thứ biến VS Code thành IDE cho đúng công nghệ bạn dùng. Nó cũng là chương trình chạy trên máy bạn với quyền <strong>của bạn</strong>: đọc được mọi file trong thư mục người dùng, file <code>.env</code>, khoá SSH, token Git, và gửi dữ liệu ra mạng. Bài này cho bạn một danh sách ngắn đáng cài và những thói quen giữ cho một extension giả hay một repo cài bẫy không chiếm được laptop của bạn.'}</p>

<h3>${en ? 'A short list for Node.js / TypeScript / React' : 'Danh sách ngắn cho Node.js / TypeScript / React'}</h3>
<table>
<thead><tr><th>Extension</th><th>ID</th><th>${en ? 'What it gives you' : 'Cho bạn điều gì'}</th></tr></thead>
<tbody>
<tr><td>ESLint</td><td><code>dbaeumer.vscode-eslint</code></td><td>${en ? 'Lint errors as you type, fix on save' : 'Báo lỗi lint ngay khi gõ, sửa khi lưu'}</td></tr>
<tr><td>Prettier</td><td><code>esbenp.prettier-vscode</code></td><td>${en ? 'One formatting style for the whole team' : 'Một kiểu định dạng cho cả nhóm'}</td></tr>
<tr><td>Error Lens</td><td><code>usernamehw.errorlens</code></td><td>${en ? 'Shows the error message at the end of the line — you stop missing squiggles' : 'Hiện nội dung lỗi ngay cuối dòng — hết bỏ sót gạch đỏ'}</td></tr>
<tr><td>GitLens</td><td><code>eamodio.gitlens</code></td><td>${en ? 'Who changed this line and why (Git course 14.2)' : 'Ai sửa dòng này và vì sao (khoá Git 14.2)'}</td></tr>
<tr><td>REST Client</td><td><code>humao.rest-client</code></td><td>${en ? 'Send HTTP requests from a <code>.http</code> file committed with the code' : 'Gửi request HTTP từ file <code>.http</code> commit cùng code'}</td></tr>
<tr><td>Dev Containers</td><td><code>ms-vscode-remote.remote-containers</code></td><td>${en ? 'Open the project inside a container (Chapter 6, Docker course)' : 'Mở dự án bên trong container (Chương 6, khoá Docker)'}</td></tr>
<tr><td>Prisma</td><td><code>Prisma.prisma</code></td><td>${en ? 'Highlighting and formatting for <code>schema.prisma</code>' : 'Tô màu và định dạng <code>schema.prisma</code>'}</td></tr>
<tr><td>Tailwind CSS IntelliSense</td><td><code>bradlc.vscode-tailwindcss</code></td><td>${en ? 'Class name completion and preview' : 'Gợi ý và xem trước tên class'}</td></tr>
</tbody>
</table>
<p>${en
    ? 'You do not need them all — install what your current project uses. Ten well-chosen extensions beat forty: every extension costs startup time, memory, and is one more piece of code with access to your files. Open the Extensions view with <code>Ctrl+Shift+X</code>/<code>⇧⌘X</code>, or use the command line:'
    : 'Không cần cài hết — cài những gì dự án hiện tại dùng. Mười extension chọn kỹ hơn bốn mươi cái: mỗi extension tốn thời gian khởi động, tốn bộ nhớ, và là thêm một đoạn code có quyền đọc file của bạn. Mở khung Extensions bằng <code>Ctrl+Shift+X</code>/<code>⇧⌘X</code>, hoặc dùng dòng lệnh:'}</p>
${EXT_CLI}

<h3>${en ? 'The hacker’s view (1): a fake extension with a real-looking name' : 'Góc hacker (1): extension giả có cái tên trông như thật'}</h3>
<p>${en
    ? 'In January 2023, researchers at Aqua Security (team Nautilus) published a harmless copy of Prettier under the publisher <code>espenp</code> instead of <code>esbenp</code> and the name <code>pretier-vscode</code> instead of <code>prettier-vscode</code>. It could show the same display name as the real one, and it got <strong>more than 1,000 installs in under 48 hours</strong>. A real attacker would have had a thousand developer machines.'
    : 'Tháng 1/2023, nhóm nghiên cứu Nautilus của Aqua Security đăng một bản sao vô hại của Prettier với nhà phát hành <code>espenp</code> thay vì <code>esbenp</code> và tên <code>pretier-vscode</code> thay vì <code>prettier-vscode</code>. Nó hiện được đúng tên hiển thị như bản thật, và có <strong>hơn 1.000 lượt cài trong chưa tới 48 giờ</strong>. Nếu là kẻ tấn công thật, họ đã có một nghìn máy của lập trình viên.'}</p>
<div class="callout warn"><p><strong>${en ? 'Before installing anything, check five things:' : 'Trước khi cài bất cứ thứ gì, kiểm năm điều:'}</strong></p><ol>
<li>${en ? 'The <strong>ID</strong> (publisher.name), not the display name — compare letter by letter with the official docs or the tool’s website.' : '<strong>ID</strong> (nhaphathanh.ten), không phải tên hiển thị — so từng chữ với tài liệu chính thức hoặc trang chủ của công cụ.'}</li>
<li>${en ? 'Install count and how long it has existed — the real Prettier has tens of millions.' : 'Số lượt cài và đã tồn tại bao lâu — Prettier thật có hàng chục triệu.'}</li>
<li>${en ? 'A link to a source repository that actually contains the extension.' : 'Có link tới repo mã nguồn thật sự chứa extension đó.'}</li>
<li>${en ? 'Recent updates and real reviews.' : 'Có cập nhật gần đây và đánh giá thật.'}</li>
<li>${en ? 'Do you actually need it? Fewer extensions, smaller attack surface.' : 'Bạn có thật sự cần nó không? Ít extension hơn, ít chỗ bị tấn công hơn.'}</li>
</ol></div>

<h3>${en ? 'The hacker’s view (2): the repository that runs when you open it' : 'Góc hacker (2): repo tự chạy khi bạn mở nó'}</h3>
<p>${en
    ? 'Lesson 1.3 showed that <code>.vscode/tasks.json</code> can run commands. A task can also say <code>"runOn": "folderOpen"</code> — run automatically when the folder opens. Security companies (GitLab, Trend Micro and others) have documented the <em>Contagious Interview</em> campaign: a fake recruiter sends a “take-home coding test” repository; the candidate opens it in VS Code, clicks “trust”, and a hidden task downloads malware that steals browser passwords, crypto wallets and tokens. Students looking for an internship are exactly the target.'
    : 'Bài 1.3 cho thấy <code>.vscode/tasks.json</code> chạy được lệnh. Một task còn có thể ghi <code>"runOn": "folderOpen"</code> — tự chạy khi mở thư mục. Các công ty bảo mật (GitLab, Trend Micro…) đã ghi nhận chiến dịch <em>Contagious Interview</em>: một “nhà tuyển dụng” giả gửi repo “bài test làm ở nhà”; ứng viên mở bằng VS Code, bấm “tin tưởng”, và một task ẩn tải mã độc đánh cắp mật khẩu trình duyệt, ví tiền điện tử và token. Sinh viên đang tìm chỗ thực tập đúng là đối tượng nhắm tới.'}</p>
<p>${en
    ? 'The defence is <strong>Workspace Trust</strong> (since VS Code 1.57, 2021). When you open a folder for the first time VS Code asks whether you trust its authors. Choosing <em>No</em> opens it in <strong>Restricted Mode</strong>: tasks, debugging, workspace settings that could run programs, and extensions that have not declared they are safe in restricted mode are all disabled — you can still read every file. Trust is remembered per folder: <em>Workspaces: Manage Workspace Trust</em> to review or revoke.'
    : 'Cách phòng là <strong>Workspace Trust (tin cậy thư mục)</strong>, có từ VS Code 1.57 (2021). Lần đầu mở một thư mục, VS Code hỏi bạn có tin tác giả không. Chọn <em>No</em> thì mở ở <strong>Restricted Mode (chế độ hạn chế)</strong>: task, debug, cài đặt workspace có thể chạy chương trình, và extension chưa khai báo an toàn ở chế độ hạn chế đều bị tắt — bạn vẫn đọc được mọi file. Quyết định tin cậy được nhớ theo thư mục: <em>Workspaces: Manage Workspace Trust</em> để xem lại hoặc thu hồi.'}</p>
<div class="pitfall co-tieu-de"><p><strong>${en ? 'Rules for code you did not write' : 'Luật với code không phải do bạn viết'}</strong></p><ul>
<li>${en ? 'Open in Restricted Mode first. Read <code>.vscode/</code>, <code>package.json</code> scripts (<code>preinstall</code>, <code>postinstall</code>) and any binary or font file that has no business being there.' : 'Mở ở Restricted Mode trước. Đọc <code>.vscode/</code>, các script trong <code>package.json</code> (<code>preinstall</code>, <code>postinstall</code>) và mọi file nhị phân, file font “lạc chỗ”.'}</li>
<li>${en ? 'Trust only after reading. Trusting once also trusts every later <code>git pull</code> of that folder.' : 'Chỉ tin sau khi đã đọc. Tin một lần là tin luôn mọi lần <code>git pull</code> sau đó của thư mục.'}</li>
<li>${en ? 'Run unknown projects in a Dev Container or a virtual machine, not on the laptop that holds your keys (Chapter 6).' : 'Chạy dự án lạ trong Dev Container hoặc máy ảo, không chạy trên laptop đang giữ khoá của bạn (Chương 6).'}</li>
<li>${en ? 'A recruiter who insists you run their code on your own machine before any interview is a red flag.' : 'Nhà tuyển dụng đòi bạn chạy code của họ trên máy mình trước cả buổi phỏng vấn là dấu hiệu đáng ngờ.'}</li>
</ul></div>

<h3>${en ? '🧪 Practice (15 minutes)' : '🧪 Thực hành (15 phút)'}</h3>
<div class="callout ok"><ol>
<li>${en ? 'Run <code>code --list-extensions</code>. For each line, ask “did I use this in the last month?”. Uninstall at least the ones you cannot explain.' : 'Chạy <code>code --list-extensions</code>. Với mỗi dòng, tự hỏi “tháng qua mình có dùng không?”. Gỡ ít nhất những cái bạn không giải thích được.'}</li>
<li>${en ? 'Open labflow-mini, Command Palette → <em>Extensions: Show Recommended Extensions</em>. Install the two recommended in lesson 1.3 and check their IDs match the table above exactly.' : 'Mở labflow-mini, Command Palette → <em>Extensions: Show Recommended Extensions</em>. Cài hai extension được gợi ý ở bài 1.3 và kiểm ID khớp đúng từng chữ với bảng trên.'}</li>
<li>${en ? 'Build the harmless “strange repo” below and open it. When VS Code asks, choose <strong>No, I don’t trust the authors</strong>.' : 'Dựng “repo lạ” vô hại dưới đây rồi mở nó. Khi VS Code hỏi, chọn <strong>No, I don’t trust the authors</strong>.'}</li>
</ol>
${REPO_LA}
${REPO_LA_KIEM}
${REPO_LA_OUT}
<ol start="4">
<li>${en ? 'Look at the status bar: it says <em>Restricted Mode</em>. Try Command Palette → <em>Tasks: Run Task</em> and read what VS Code tells you.' : 'Nhìn thanh trạng thái: có chữ <em>Restricted Mode</em>. Thử Command Palette → <em>Tasks: Run Task</em> và đọc VS Code nói gì.'}</li>
<li>${en ? 'Delete the folder when done: <code>rm -rf ~/do-nghe/repo-la</code>.' : 'Xong thì xoá thư mục: <code>rm -rf ~/do-nghe/repo-la</code>.'}</li>
</ol>
<p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? 'your extension list is shorter than before and you can say what each one does; ESLint and Prettier are installed with the exact IDs; and <code>da-chay.txt</code> was <strong>not</strong> created while the strange repo was in Restricted Mode.' : 'danh sách extension ngắn hơn trước và bạn nói được từng cái dùng để làm gì; ESLint và Prettier đã cài đúng ID; và <code>da-chay.txt</code> <strong>không</strong> được tạo ra khi repo lạ ở Restricted Mode.'}</p></div>

<h3>${en ? '🗂 Key terms' : '🗂 Thuật ngữ trong bài'}</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">${en ? 'Extension' : 'Extension (tiện ích mở rộng)'}</span><span class="v">${en ? 'A plugin that runs inside VS Code with your user’s permissions.' : 'Phần bổ sung chạy trong VS Code với quyền của tài khoản bạn.'}</span></div>
  <div class="kv"><span class="k">${en ? 'Extension ID' : 'Extension ID (mã extension)'}</span><span class="v">${en ? '<code>publisher.name</code> — the only reliable identity of an extension.' : '<code>nhaphathanh.ten</code> — danh tính đáng tin duy nhất của một extension.'}</span></div>
  <div class="kv"><span class="k">${en ? 'Typosquatting' : 'Typosquatting (giả tên gõ nhầm)'}</span><span class="v">${en ? 'Publishing under a name one typo away from a popular one.' : 'Đăng dưới cái tên chỉ khác tên nổi tiếng một lỗi gõ.'}</span></div>
  <div class="kv"><span class="k">Workspace Trust</span><span class="v">${en ? 'VS Code’s question “do you trust the authors?” before running anything from a folder.' : 'Câu hỏi “bạn có tin tác giả?” của VS Code trước khi chạy thứ gì từ thư mục.'}</span></div>
  <div class="kv"><span class="k">Restricted Mode</span><span class="v">${en ? 'Limited mode: no tasks, no debug, limited extensions.' : 'Chế độ hạn chế: không task, không debug, extension bị giới hạn.'}</span></div>
  <div class="kv"><span class="k">${en ? 'runOn: folderOpen' : 'runOn: folderOpen (chạy khi mở)'}</span><span class="v">${en ? 'A task option that runs a command as soon as the folder is opened.' : 'Tuỳ chọn task chạy lệnh ngay khi thư mục được mở.'}</span></div>
</div>

<h3>${en ? '📌 Summary' : '📌 Tóm tắt'}</h3>
<ul>
<li>${en ? 'Install few extensions, chosen for the stack you use now.' : 'Cài ít extension, chọn theo công nghệ đang dùng.'}</li>
<li>${en ? 'Identify extensions by ID, not by display name; a typosquat got 1,000+ installs in 48 hours (2023).' : 'Nhận diện extension bằng ID, không bằng tên hiển thị; một bản giả tên có hơn 1.000 lượt cài trong 48 giờ (2023).'}</li>
<li>${en ? 'Extensions and workspace tasks run with your permissions — your keys and tokens are in reach.' : 'Extension và task của workspace chạy với quyền của bạn — khoá và token nằm trong tầm với.'}</li>
<li>${en ? 'Open unknown repos in Restricted Mode, read .vscode and package.json scripts, then decide.' : 'Mở repo lạ ở Restricted Mode, đọc .vscode và script trong package.json rồi mới quyết.'}</li>
<li>${en ? 'Fake “coding test” repositories that run on folder open are a real, active attack on job seekers.' : 'Repo “bài test” giả tự chạy khi mở là kiểu tấn công thật, đang nhắm vào người tìm việc.'}</li>
</ul>
${tl('https://code.visualstudio.com/docs/editing/workspaces/workspace-trust', '🔒', 'VS Code Docs — Workspace Trust', en ? 'Restricted Mode and what it disables' : 'Restricted Mode và những gì bị tắt')}
${tl('https://devclass.com/2023/01/09/researchers-demonstrate-a-thousand-installs-of-fake-vs-code-extension-in-48-hours/', '🕵️', 'DevClass — Researchers demonstrate a thousand installs of fake VS Code extension in 48 hours', en ? 'The Aqua Nautilus Prettier typosquat (2023)' : 'Thí nghiệm giả tên Prettier của Aqua Nautilus (2023)')}
${tl('https://about.gitlab.com/blog/how-to-detect-and-prevent-contagious-interview-ide-attacks/', '🕵️', 'GitLab — How to detect and prevent Contagious Interview IDE attacks', en ? 'Fake job-test repositories and tasks.json' : 'Repo bài test tuyển dụng giả và tasks.json')}
</div>
`;

/* ═════════════ 1.5 — Lab bấm giờ ═════════════ */
const LAB_KIEM = bash(`
npm test                                   # hoặc phím tắt task test của bạn
curl -s localhost:3000/tasks/2             # server chạy bằng Ctrl+F5 / ⌃F5 từ Run and Debug
curl -s -w " %{http_code}" localhost:3000/tasks/99
git add -A && git diff --cached --stat
`
);
const LAB_OUT = out(`
ℹ tests 4
ℹ pass 4
ℹ fail 0
{"id":2,"title":"Ve man hinh danh sach","assigneeId":2,"status":"DOING","due":"2026-12-03","priority":"MEDIUM","assignee":"Binh","dueText":"03/12/2026"}
{"error":"task not found"} 404
 src/routes/tasks.routes.js   |  6 +++++-
 src/services/httpError.js    |  5 +++++
 src/services/task.service.js | 27 ++++++++++++++++-----------
 test/task.service.test.js    |  6 +++++-
 web/src/TaskList.jsx         |  6 +++---
 web/src/api.js               |  2 +-
 6 files changed, 35 insertions(+), 17 deletions(-)
`
);
const LAB_SERVICE = js(`
// src/services/task.service.js — phần thay đổi (lời giải mẫu)
import { httpError } from './httpError.js';      // do "Move to a new file" tự thêm

function findTask(id) {                          // do "Extract to function" tạo, đổi tên bằng F2
  return TASKS.find((t) => t.id === id);
}

export function getTaskById(id) {
  const task = findTask(id);
  if (!task) throw httpError('task not found', 404);
  return toView(task);
}

export function completeTask(id) {
  const task = findTask(id);
  // … như cũ
}
`
);
const LAB_ROUTE = js(`
// src/routes/tasks.routes.js — route mới (gõ "exroute" + Tab rồi điền)
tasksRouter.get('/:id', (req, res) => {
  res.json(getTaskById(Number(req.params.id)));
});
`
);
const LAB_TEST = js(`
// test/task.service.test.js — test mới (nhân đôi một test có sẵn bằng Shift+Alt+↓ / ⇧⌥↓ rồi sửa)
test('getTaskById bao 404 khi khong co', () => {
  assert.throws(() => getTaskById(99), /task not found/);
});
`
);
const LAB_DAP = (en) => `
<p>${en ? 'Reference solution (your formatting may differ):' : 'Lời giải mẫu (định dạng của bạn có thể khác):'}</p>
${LAB_SERVICE}
${LAB_ROUTE}
${LAB_TEST}
<p>${en ? 'Keys used, in order: Ctrl+P/⌘P · F2 · snippet + Tab · Ctrl+Shift+O/⇧⌘O · Ctrl+Shift+R/⌃⇧R (Extract, Move to a new file) · Ctrl+D/⌘D or Shift+Alt+I/⇧⌥I · Shift+Alt+↓/⇧⌥↓ · Ctrl+Shift+H/⇧⌘H with include <code>src/**</code> · your test-task key · Ctrl+F5/⌃F5 · F12 + Go Back.' : 'Phím đã dùng theo thứ tự: Ctrl+P/⌘P · F2 · snippet + Tab · Ctrl+Shift+O/⇧⌘O · Ctrl+Shift+R/⌃⇧R (Extract, Move to a new file) · Ctrl+D/⌘D hoặc Shift+Alt+I/⇧⌥I · Shift+Alt+↓/⇧⌥↓ · Ctrl+Shift+H/⇧⌘H với include <code>src/**</code> · phím task test của bạn · Ctrl+F5/⌃F5 · F12 + Go Back.'}</p>
`;
const L5 = (en) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? 'Chapter 1 · Lab' : 'Chương 1 · Lab'}</span>
<h2>${en ? '1.5 — Lab: A timed keyboard-only task list in the sample Express + React app' : '1.5 — Lab: Danh sách việc làm bằng bàn phím có bấm giờ trong ứng dụng Express + React mẫu'}</h2>
<p class="lead">${en
    ? 'This is a small real ticket on <code>labflow-mini</code>: add “get one task” to the API, tidy the service with two refactorings, rename an API function used by React, add a field, add a test, and prove it works. Every step uses a shortcut from lessons 1.1–1.4. The goal is not only to finish, but to finish <strong>without touching the mouse</strong> and <strong>under 15 minutes</strong>.'
    : 'Đây là một ticket nhỏ có thật trên <code>labflow-mini</code>: thêm “lấy một task” vào API, dọn service bằng hai lần refactor, đổi tên một hàm API mà React đang dùng, thêm một trường, thêm một test, và chứng minh nó chạy. Mỗi bước dùng phím tắt từ bài 1.1–1.4. Mục tiêu không chỉ là xong, mà là xong <strong>không chạm chuột</strong> và <strong>dưới 15 phút</strong>.'}</p>

<h3>${en ? 'Before you start' : 'Trước khi bắt đầu'}</h3>
<ul>
<li>${en ? 'Starting point: labflow-mini after lessons 1.2 and 1.3 (<code>markDone</code> is already <code>completeTask</code>, <code>httpError</code> exists, <code>.vscode/</code> has your tasks and launch configuration, the <code>exroute</code> snippet exists). <code>git status</code> must be clean.' : 'Điểm xuất phát: labflow-mini sau bài 1.2 và 1.3 (<code>markDone</code> đã thành <code>completeTask</code>, đã có <code>httpError</code>, <code>.vscode/</code> có task và cấu hình chạy, đã có snippet <code>exroute</code>). <code>git status</code> phải sạch.'}</li>
<li>${en ? 'Move the mouse out of reach (or turn the trackpad off). Start a stopwatch.' : 'Đẩy chuột ra xa (hoặc tắt trackpad). Bấm đồng hồ.'}</li>
<li>${en ? 'Stuck on a shortcut? Command Palette is allowed — it is a keyboard tool. Searching the web is not.' : 'Quên phím? Được dùng Command Palette — nó là công cụ bàn phím. Không được tra web.'}</li>
</ul>

<h3>${en ? 'The task list' : 'Danh sách việc'}</h3>
<table>
<thead><tr><th>#</th><th>${en ? 'Task' : 'Việc'}</th><th>${en ? 'Hint' : 'Gợi ý'}</th></tr></thead>
<tbody>
<tr><td>1</td><td>${en ? 'Rename <code>fetchTasks</code> (web/src/api.js) to <code>getTasks</code> everywhere' : 'Đổi tên <code>fetchTasks</code> (web/src/api.js) thành <code>getTasks</code> ở mọi nơi'}</td><td>Ctrl+P/⌘P, F2, Shift+Enter ${en ? 'to preview' : 'để xem trước'}</td></tr>
<tr><td>2</td><td>${en ? 'In task.service.js, extract <code>TASKS.find((t) =&gt; t.id === id)</code> into a function <code>findTask(id)</code>' : 'Trong task.service.js, tách <code>TASKS.find((t) =&gt; t.id === id)</code> thành hàm <code>findTask(id)</code>'}</td><td>${en ? 'Expand Selection, Ctrl+Shift+R/⌃⇧R → Extract to function, F2' : 'Expand Selection, Ctrl+Shift+R/⌃⇧R → Extract to function, F2'}</td></tr>
<tr><td>3</td><td>${en ? 'Add and export <code>getTaskById(id)</code>: return the task view, or throw <code>httpError(&#39;task not found&#39;, 404)</code>' : 'Thêm và export <code>getTaskById(id)</code>: trả task (qua toView), hoặc ném <code>httpError(&#39;task not found&#39;, 404)</code>'}</td><td>${en ? 'Copy completeTask’s first lines with Shift+Alt+↓/⇧⌥↓' : 'Nhân đôi mấy dòng đầu của completeTask bằng Shift+Alt+↓/⇧⌥↓'}</td></tr>
<tr><td>4</td><td>${en ? 'Move <code>httpError</code> to its own file' : 'Chuyển <code>httpError</code> sang file riêng'}</td><td>${en ? 'Ctrl+Shift+R/⌃⇧R → Move to a new file (VS Code names it httpError.js and fixes the import)' : 'Ctrl+Shift+R/⌃⇧R → Move to a new file (VS Code đặt tên httpError.js và tự sửa import)'}</td></tr>
<tr><td>5</td><td>${en ? 'Add <code>priority: &#39;MEDIUM&#39;</code> to all three rows of <code>TASKS</code>' : 'Thêm <code>priority: &#39;MEDIUM&#39;</code> vào cả ba dòng của <code>TASKS</code>'}</td><td>${en ? 'Select the three lines, Shift+Alt+I/⇧⌥I, move left past <code> }</code>' : 'Chọn ba dòng, Shift+Alt+I/⇧⌥I, lùi qua <code> }</code>'}</td></tr>
<tr><td>6</td><td>${en ? 'Add route <code>GET /tasks/:id</code> in tasks.routes.js using <code>getTaskById</code>' : 'Thêm route <code>GET /tasks/:id</code> trong tasks.routes.js dùng <code>getTaskById</code>'}</td><td>${en ? 'Snippet <code>exroute</code> + Tab; Ctrl+./⌘. to add the import' : 'Snippet <code>exroute</code> + Tab; Ctrl+./⌘. để thêm import'}</td></tr>
<tr><td>7</td><td>${en ? 'Add a test: <code>getTaskById(99)</code> throws “task not found”' : 'Thêm test: <code>getTaskById(99)</code> ném “task not found”'}</td><td>Shift+Alt+↓/⇧⌥↓ ${en ? 'on an existing test' : 'trên một test có sẵn'}</td></tr>
<tr><td>8</td><td>${en ? 'Replace the text <code>Chua giao</code> with <code>Unassigned</code> — only under <code>src/</code>' : 'Thay chữ <code>Chua giao</code> bằng <code>Unassigned</code> — chỉ trong <code>src/</code>'}</td><td>Ctrl+Shift+H/⇧⌘H, Ctrl+Shift+J/⇧⌘J, include <code>src/**</code></td></tr>
<tr><td>9</td><td>${en ? 'Run the tests with your test-task shortcut' : 'Chạy test bằng phím task test của bạn'}</td><td>${en ? 'lesson 1.3' : 'bài 1.3'}</td></tr>
<tr><td>10</td><td>${en ? 'Start the server from Run and Debug and call the two URLs below' : 'Chạy server từ Run and Debug và gọi hai URL bên dưới'}</td><td>Ctrl+Shift+D/⇧⌘D, Ctrl+F5/⌃F5, Ctrl+&#96;/⌃&#96;</td></tr>
<tr><td>11</td><td>${en ? 'From <code>onDone</code> in TaskList.jsx, follow F12 down to the service function that finally changes the status, then Go Back to TaskList.jsx' : 'Từ <code>onDone</code> trong TaskList.jsx, đi F12 xuống tới hàm service thực sự đổi trạng thái, rồi Go Back về TaskList.jsx'}</td><td>${en ? 'F12 on markTaskDone stops at the fetch: continue with Ctrl+Shift+F/⇧⌘F for <code>/done</code>' : 'F12 trên markTaskDone dừng ở lệnh fetch: đi tiếp bằng Ctrl+Shift+F/⇧⌘F tìm <code>/done</code>'}</td></tr>
</tbody>
</table>
<div class="callout warn"><p>${en
    ? 'Task 11 shows a limit of Go to Definition: the browser code calls the server over HTTP, so there is no symbol link between <code>web/</code> and <code>src/</code>. Text search on the URL is the bridge. You will meet the same boundary between React and Spring in Chapter 2.'
    : 'Việc 11 cho thấy giới hạn của Go to Definition: code trình duyệt gọi server qua HTTP, nên giữa <code>web/</code> và <code>src/</code> không có liên kết symbol nào. Tìm chữ theo URL là cây cầu. Bạn sẽ gặp đúng ranh giới này giữa React và Spring ở Chương 2.'}</p></div>

<h3>${en ? 'Check your result' : 'Kiểm kết quả'}</h3>
${LAB_KIEM}
<p>${en ? 'Real output of the reference solution:' : 'Output thật của lời giải mẫu:'}</p>
${LAB_OUT}

<h3>${en ? '🧪 Done when' : '🧪 Đạt khi'}</h3>
<div class="callout ok">
<p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? 'all of these are true —' : 'đúng hết các điều sau —'}</p>
<ol>
<li>${en ? 'Finished in <strong>under 15 minutes</strong>, mouse untouched.' : 'Xong <strong>dưới 15 phút</strong>, không chạm chuột.'}</li>
<li><code>pass 4</code>, <code>fail 0</code>.</li>
<li>${en ? '<code>/tasks/2</code> returns Binh’s task with <code>"priority":"MEDIUM"</code>; <code>/tasks/99</code> returns 404 with <code>task not found</code>.' : '<code>/tasks/2</code> trả task của Binh có <code>"priority":"MEDIUM"</code>; <code>/tasks/99</code> trả 404 với <code>task not found</code>.'}</li>
<li>${en ? '<code>git diff --cached --stat</code> lists the same six files as above — no stray files, nothing in <code>node_modules</code>.' : '<code>git diff --cached --stat</code> liệt kê đúng sáu file như trên — không có file lạ, không có gì trong <code>node_modules</code>.'}</li>
<li>${en ? 'Write your time next to the Section 0 sheet, then commit: <code>git commit -m "feat: GET /tasks/:id"</code>.' : 'Ghi thời gian vào cạnh phiếu Mục 0, rồi commit: <code>git commit -m "feat: GET /tasks/:id"</code>.'}</li>
</ol>
<p>${en ? 'Over 15 minutes? Run <code>git reset --hard HEAD</code> (this discards only the lab changes, because you started clean) and do it again tomorrow. Most people pass on the second or third try.' : 'Quá 15 phút? Chạy <code>git reset --hard HEAD</code> (chỉ bỏ các thay đổi của lab, vì bạn bắt đầu từ trạng thái sạch) và làm lại ngày mai. Đa số đạt ở lần thứ hai hoặc ba.'}</p>
</div>
${giai(en ? 'Reference solution' : 'Lời giải mẫu', LAB_DAP(en))}

<h3>${en ? '🗂 Key terms' : '🗂 Thuật ngữ trong bài'}</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Ticket</span><span class="v">${en ? 'A unit of work in the team’s tracker (Jira, CT Work…).' : 'Một đầu việc trong hệ thống quản lý việc của nhóm (Jira, CT Work…).'}</span></div>
  <div class="kv"><span class="k">${en ? 'Speed-run' : 'Speed-run (chạy đua bấm giờ)'}</span><span class="v">${en ? 'Doing a fixed task list against the clock to measure fluency.' : 'Làm một danh sách việc cố định có bấm giờ để đo độ thạo.'}</span></div>
  <div class="kv"><span class="k">${en ? 'Staged changes' : 'Staged changes (thay đổi đã stage)'}</span><span class="v">${en ? 'Changes added with <code>git add</code>, shown by <code>git diff --cached</code>.' : 'Thay đổi đã <code>git add</code>, xem bằng <code>git diff --cached</code>.'}</span></div>
  <div class="kv"><span class="k">${en ? 'Symbol boundary' : 'Ranh giới symbol'}</span><span class="v">${en ? 'Where code talks over HTTP/strings, so the IDE cannot link definitions.' : 'Chỗ code nói chuyện qua HTTP/chuỗi, IDE không nối được định nghĩa.'}</span></div>
</div>

<h3>${en ? '📌 Summary' : '📌 Tóm tắt'}</h3>
<ul>
<li>${en ? 'A real ticket is a chain of small IDE moves: find, rename, extract, move, edit many lines, test, run.' : 'Một ticket thật là chuỗi thao tác IDE nhỏ: tìm, đổi tên, tách, chuyển, sửa nhiều dòng, test, chạy.'}</li>
<li>${en ? 'Refactorings (Extract, Move to a new file, F2) fix imports for you; check with git diff.' : 'Refactor (Extract, Move to a new file, F2) tự sửa import; kiểm lại bằng git diff.'}</li>
<li>${en ? 'Go to Definition stops at HTTP; text search on the URL crosses from front end to back end.' : 'Go to Definition dừng ở HTTP; tìm chữ theo URL để đi từ frontend sang backend.'}</li>
<li>${en ? 'Measure your time; repeat until under 15 minutes.' : 'Đo thời gian; làm lại tới khi dưới 15 phút.'}</li>
</ul>
</div>
`;

/* ═════════════ 1.6 — Quiz ═════════════ */
const QUIZ1 = [
  Q('ide-1-1', 'Before changing the parameters of findUserById in a plain JavaScript project, you need every caller. What is the most reliable approach?|||Trước khi đổi tham số của findUserById trong một dự án JavaScript thuần, bạn cần mọi chỗ gọi. Cách đáng tin nhất là gì?', [
    'Ctrl+Shift+F / ⇧⌘F for "findUserById" with Regex turned on|||Ctrl+Shift+F / ⇧⌘F tìm "findUserById" có bật Regex',
    'Shift+F12 / ⇧F12 on the name, then a whole-word text search to catch calls the language server cannot see|||Shift+F12 / ⇧F12 trên tên hàm, rồi tìm chữ bật nguyên từ để bắt những lời gọi language server không thấy',
    'Ctrl+Shift+L / ⇧⌘L on the name in user.service.js|||Ctrl+Shift+L / ⇧⌘L trên tên hàm trong user.service.js',
    'Ctrl+P / ⌘P and open each service file in turn|||Ctrl+P / ⌘P rồi mở lần lượt từng file service',
  ], 1, 'EN: References are exact for what the language server can infer; in plain JS dynamic calls (obj[name]()) are invisible, so a whole-word text search completes the list. Regex alone adds nothing here and still mixes in comments.|||VI: References chính xác với những gì language server suy ra được; trong JS thuần, lời gọi động (obj[name]()) nó không thấy, nên tìm chữ nguyên từ để bổ sung. Chỉ bật Regex không thêm được gì và vẫn lẫn chú thích.'),
  Q('ide-1-2', 'You select the word name in a file and press Ctrl+Shift+L / ⇧⌘L, then type username. What changed?|||Bạn chọn chữ name trong một file, bấm Ctrl+Shift+L / ⇧⌘L rồi gõ username. Cái gì đã đổi?', [
    'The symbol name in every file of the project, imports included|||Symbol name trong mọi file của dự án, kể cả import',
    'Only the occurrence under the cursor|||Chỉ chỗ đang đặt con trỏ',
    'Only occurrences that are variables, not those in comments|||Chỉ những chỗ là biến, không đụng chú thích',
    'Every occurrence of that text in this file only — including inside comments and strings|||Mọi chỗ có đúng chữ đó trong riêng file này — kể cả trong chú thích và chuỗi',
  ], 3, 'EN: Select-all-occurrences is a text tool limited to the current file. To rename a symbol across files use F2.|||VI: Chọn-mọi-lần-xuất-hiện là công cụ chữ, chỉ trong file hiện tại. Đổi tên symbol trên nhiều file thì dùng F2.'),
  Q('ide-1-3', 'Every pull request in your SWP391 team shows hundreds of lines changed only by indentation. Where should "editor.tabSize": 2 and the default formatter go?|||Pull request nào của nhóm SWP391 cũng hiện hàng trăm dòng đổi chỉ vì thụt lề. "editor.tabSize": 2 và formatter mặc định nên đặt ở đâu?', [
    'In .vscode/settings.json, committed to the repository|||Trong .vscode/settings.json, commit vào repo',
    'In each member’s User settings, agreed in a chat message|||Trong User settings của từng người, thống nhất qua tin nhắn',
    'In keybindings.json|||Trong keybindings.json',
    'In launch.json, under env|||Trong launch.json, mục env',
  ], 0, 'EN: Anything that changes committed files belongs to Workspace settings in Git; User settings are personal and drift. Ideally a Prettier config and a CI check enforce it too.|||VI: Thứ gì làm đổi file commit thì thuộc Workspace settings trong Git; User settings là của riêng từng người và sẽ lệch. Tốt nhất có thêm file cấu hình Prettier và bước kiểm CI.'),
  Q('ide-1-4', 'On a MacBook, pressing F12 in VS Code turns the volume up instead of going to the definition. What do you do?|||Trên MacBook, bấm F12 trong VS Code lại tăng âm lượng thay vì đi tới định nghĩa. Bạn làm gì?', [
    'Reinstall VS Code|||Cài lại VS Code',
    'Use Ctrl+F12, which is the Mac shortcut|||Dùng Ctrl+F12, đó là phím của Mac',
    'Press fn+F12, or turn on “Use F1, F2, etc. keys as standard function keys” in System Settings|||Bấm fn+F12, hoặc bật “Use F1, F2, etc. keys as standard function keys” trong System Settings',
    'Go to Definition does not exist on macOS|||Go to Definition không có trên macOS',
  ], 2, 'EN: The top row sends media keys by default on Mac laptops. ⌘Click also works. ⌘F12 (not Ctrl+F12) is Go to Implementation.|||VI: Hàng phím trên cùng của laptop Mac mặc định là phím media. ⌘Click cũng được. ⌘F12 (không phải Ctrl+F12) là Go to Implementation.'),
  Q('ide-1-5', 'In Quick Open (Ctrl+P / ⌘P), which prefix searches symbols across the whole workspace?|||Trong Quick Open (Ctrl+P / ⌘P), tiền tố nào tìm symbol trên toàn dự án?', [
    '>',
    '#',
    '@',
    ':',
  ], 1, 'EN: # = workspace symbols (same as Ctrl+T / ⌘T). @ is symbols in the current file, > is commands, : is go to line.|||VI: # = symbol cả dự án (giống Ctrl+T / ⌘T). @ là symbol trong file hiện tại, > là lệnh, : là đi tới dòng.'),
  Q('ide-1-6', 'A “recruiter” sends you a GitHub repo as a take-home test and asks you to open it in VS Code tonight. What is the safest way?|||Một “nhà tuyển dụng” gửi repo GitHub làm bài test ở nhà và bảo bạn mở bằng VS Code ngay tối nay. Cách an toàn nhất là gì?', [
    'Open it in Restricted Mode, read .vscode/ and the package.json scripts first, and run it only inside a container or VM|||Mở ở Restricted Mode, đọc .vscode/ và script trong package.json trước, và chỉ chạy trong container hoặc máy ảo',
    'Click “Trust” — the repo is on GitHub, so it has been scanned|||Bấm “Trust” — repo trên GitHub nên đã được quét',
    'Trust it but uninstall all extensions first|||Tin nó nhưng gỡ hết extension trước',
    'Open it and run npm install quickly before the deadline|||Mở và chạy npm install cho kịp hạn',
  ], 0, 'EN: Trusting enables tasks with runOn: folderOpen, and npm install runs lifecycle scripts — both are used in real “Contagious Interview” attacks. Removing extensions does not stop tasks.|||VI: Tin tưởng là bật task runOn: folderOpen, còn npm install chạy script vòng đời — cả hai đều được dùng trong các vụ “Contagious Interview” thật. Gỡ extension không chặn được task.'),
  Q('ide-1-7', 'You want Prettier. The search shows two results with the same display name “Prettier - Code formatter”. How do you pick the real one?|||Bạn muốn cài Prettier. Kết quả tìm có hai mục cùng tên hiển thị “Prettier - Code formatter”. Chọn bản thật thế nào?', [
    'The one at the top of the search results|||Bản đứng đầu kết quả tìm',
    'The one with the nicer icon|||Bản có biểu tượng đẹp hơn',
    'The one updated most recently|||Bản cập nhật gần nhất',
    'Compare the extension ID (esbenp.prettier-vscode) letter by letter with the official docs, and check installs and the source repository|||So ID extension (esbenp.prettier-vscode) từng chữ với tài liệu chính thức, kiểm số lượt cài và repo mã nguồn',
  ], 3, 'EN: Display names and icons can be copied (Aqua Nautilus, 2023: espenp.pretier-vscode got 1,000+ installs in 48 hours). The ID is the identity.|||VI: Tên hiển thị và biểu tượng chép được (Aqua Nautilus 2023: espenp.pretier-vscode có hơn 1.000 lượt cài trong 48 giờ). ID mới là danh tính.'),
  Q('ide-1-8', 'tasks.json has a task with "group": { "kind": "test", "isDefault": true }. How do you run it?|||tasks.json có một task với "group": { "kind": "test", "isDefault": true }. Chạy nó bằng cách nào?', [
    'Ctrl+Shift+B / ⇧⌘B|||Ctrl+Shift+B / ⇧⌘B',
    'F5|||F5',
    'Command Palette → Tasks: Run Test Task (no default shortcut — bind one in keybindings.json)|||Command Palette → Tasks: Run Test Task (không có phím mặc định — tự gán trong keybindings.json)',
    'It runs automatically on every save|||Nó tự chạy mỗi lần lưu',
  ], 2, 'EN: Ctrl+Shift+B runs the default BUILD task; F5 starts a launch configuration. The default test task has no key until you bind workbench.action.tasks.test.|||VI: Ctrl+Shift+B chạy task BUILD mặc định; F5 chạy một cấu hình launch. Task test mặc định không có phím cho tới khi bạn gán workbench.action.tasks.test.'),
  Q('ide-1-9', 'In Run and Debug you selected “labflow-mini: server”. What is the difference between Ctrl+F5 / ⌃F5 and F5?|||Trong Run and Debug bạn đã chọn “labflow-mini: server”. Ctrl+F5 / ⌃F5 khác F5 thế nào?', [
    'Ctrl+F5 runs the configuration without the debugger; F5 runs it with the debugger attached|||Ctrl+F5 chạy cấu hình không kèm debugger; F5 chạy có gắn debugger',
    'Ctrl+F5 runs the tests; F5 runs the server|||Ctrl+F5 chạy test; F5 chạy server',
    'Ctrl+F5 restarts the server; F5 stops it|||Ctrl+F5 khởi động lại server; F5 dừng nó',
    'They are identical on every OS|||Hai phím giống hệt nhau trên mọi hệ điều hành',
  ], 0, 'EN: Same launch.json entry, with or without the debugger. Stop is Shift+F5, restart Ctrl+Shift+F5 / ⇧⌘F5.|||VI: Cùng một mục trong launch.json, có hoặc không có debugger. Dừng là Shift+F5, chạy lại là Ctrl+Shift+F5 / ⇧⌘F5.'),
  Q('ide-1-10', 'From markTaskDone in web/src/api.js, F12 does not take you to the Express route that handles PATCH /tasks/:id/done. Why, and what do you do?|||Từ markTaskDone trong web/src/api.js, F12 không đưa bạn tới route Express xử lý PATCH /tasks/:id/done. Vì sao, và làm gì?', [
    'The TypeScript server crashed; restart VS Code|||TypeScript server bị treo; khởi động lại VS Code',
    'The browser calls the server over HTTP, so there is no symbol link; search the text /done across the project|||Trình duyệt gọi server qua HTTP nên không có liên kết symbol; tìm chữ /done trên toàn dự án',
    'You must convert the project to TypeScript first|||Phải chuyển dự án sang TypeScript trước',
    'Use Ctrl+Shift+L / ⇧⌘L on markTaskDone|||Dùng Ctrl+Shift+L / ⇧⌘L trên markTaskDone',
  ], 1, 'EN: Go to Definition follows imports, not network calls. Text search on the URL path is the bridge between front end and back end — TypeScript would not change that.|||VI: Go to Definition đi theo import, không đi theo lời gọi mạng. Tìm chữ theo đường dẫn URL là cây cầu giữa frontend và backend — có TypeScript cũng vậy.'),
];
const L6 = (en) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? 'Chapter 1 · Quiz' : 'Chương 1 · Kiểm tra'}</span>
<h2>${en ? 'Check what stuck' : 'Xem thử đọng lại được gì'}</h2>
<p class="lead">${en ? 'Ten situations from a real working day in VS Code. If you miss one, the explanation names the lesson to reread.' : 'Mười tình huống của một ngày làm việc thật trong VS Code. Sai câu nào thì đọc lại bài mà lời giải nhắc tới.'}</p>
<h3>${en ? 'Self-check before you start' : 'Tự kiểm trước khi làm'}</h3>
<ul>
<li>${en ? 'I can open any file and any symbol without the Explorer.' : 'Tôi mở được mọi file và mọi symbol mà không cần Explorer.'}</li>
<li>${en ? 'I know when to use Find References and when to use text search.' : 'Tôi biết khi nào dùng Find References, khi nào tìm chữ.'}</li>
<li>${en ? 'I can edit many lines at once and rename a symbol across files safely.' : 'Tôi sửa được nhiều dòng một lúc và đổi tên symbol trên nhiều file an toàn.'}</li>
<li>${en ? 'I know which settings go in .vscode/ and which stay personal.' : 'Tôi biết cài đặt nào đặt trong .vscode/, cài đặt nào để riêng.'}</li>
<li>${en ? 'I run tests and the app with one key each.' : 'Tôi chạy test và chạy ứng dụng, mỗi việc một phím.'}</li>
<li>${en ? 'I open unknown repositories in Restricted Mode.' : 'Tôi mở repo lạ ở Restricted Mode.'}</li>
</ul>
</div>
`;

export default {
  title: 'Chapter 1 — VS Code in depth for Node.js, TypeScript and React|||Chương 1 — VS Code chuyên sâu cho Node.js, TypeScript và React',
  description: 'Bàn phím trước, chuột sau: điều hướng, đa con trỏ, tìm/thay toàn dự án, settings và tasks cho nhóm, extension an toàn — làm trên labflow-mini.',
  lessons: [
    { title: '1.1 — Navigation: Quick Open, Command Palette, Go to Symbol/Definition/References|||1.1 — Điều hướng: Quick Open, Command Palette, Go to Symbol/Definition/References', slug: 'ide-1-1-dieu-huong', type: 'LESSON', isFreePreview: true, description: 'Ba ô tìm kiếm và tiền tố, bảng phím điều hướng hai hệ, Definition/Peek/References/Call Hierarchy, tìm/thay toàn dự án, 10 câu có đáp án.', content: L1(true) + L1(false) },
    { title: '1.2 — Editing fast: multi-cursor, line moves, snippets, rename and quick fixes|||1.2 — Chỉnh sửa nhanh: đa con trỏ, di chuyển dòng, snippet, đổi tên và quick fix', slug: 'ide-1-2-chinh-sua', type: 'LESSON', isFreePreview: true, description: 'Đa con trỏ, thao tác dòng, F2/Quick Fix/Extract trên labflow-mini, snippet dự án, bài 12 dòng JSON thành module JS không dùng chuột.', content: L2(true) + L2(false) },
    { title: '1.3 — Settings, workspace settings and .vscode for the team; tasks.json|||1.3 — Settings, workspace settings và thư mục .vscode cho cả nhóm; tasks.json', slug: 'ide-1-3-cau-hinh', type: 'LESSON', isFreePreview: true, description: 'Tầng cài đặt User/Workspace, .vscode cho nhóm (settings, extensions, tasks, launch), phím chạy task test, chạy app bằng Run and Debug, Settings Sync.', content: L3(true) + L3(false) },
    { title: '1.4 — Extensions worth installing — and the security risk of extensions|||1.4 — Extension đáng cài — và rủi ro bảo mật của extension', slug: 'ide-1-4-extension', type: 'LESSON', isFreePreview: true, description: 'Danh sách extension ngắn theo ID, góc hacker: Prettier giả tên (2023) và repo bài test tuyển dụng tự chạy khi mở; Workspace Trust và Restricted Mode thử thật.', content: L4(true) + L4(false) },
    { title: '1.5 — Lab: A timed keyboard-only task list in the sample Express + React app|||1.5 — Lab: Danh sách việc làm bằng bàn phím có bấm giờ trong ứng dụng Express + React mẫu', slug: 'ide-1-5-lab', type: 'LESSON', isFreePreview: true, description: 'Ticket thật 11 việc trên labflow-mini (đổi tên, tách hàm, chuyển file, đa con trỏ, route + test mới, chạy từ Run and Debug), đạt khi dưới 15 phút không chạm chuột.', content: L5(true) + L5(false) },
    { title: '1.6 — Chapter 1 quiz|||1.6 — Kiểm tra Chương 1', slug: 'ide-1-6-quiz', type: 'QUIZ', isFreePreview: true, description: 'Mười câu tình huống về điều hướng, đa con trỏ, cài đặt nhóm, task/launch và Workspace Trust, có giải thích.', content: L6(true) + L6(false), quiz: { timeLimitSeconds: 900, questions: QUIZ1 } },
  ],
};
