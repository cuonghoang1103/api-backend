/**
 * 12.3 — Lỗi 6–10 của dbg-cap: race đặt trùng (và bản sửa đầu gây deadlock), deadlock đổi giờ, rò rỉ SSE, đệm cũ, hồi quy tìm bằng git bisect run.
 * Output thật: scratchpad/dbg/lab/ch12/out (c12b.sh + lần chạy bản sửa đầu); diff = commit của repo lời giải.
 */
import { DUA, DAT_CHO, DOI, CHO_SQL, SU_KIEN, CACHE, KHUNG_GIO, TEST_KG, LIEN_KE, BISECT, TAO_LS, TAI_SSE, HEAP, SUA_06, SUA_09, D6A, D6B, D7, D8, D9, D10 } from './_ma-12.mjs';
import { O6_LOI, O6_V1, O6_SUA, O6_KIEM_V1, O7_LOI, O7_CHO, O7_JAVA, O7_PG, O7_SUA, O8_SO, O8_GIU, O8_KT, O9_LOI, O9_SUA, O10_LOG, O10_VOI, O10_THO, O10_BISECT, O10_SHOW } from './_ra-12.mjs';
import { lienKet, nguon } from '../_chung.mjs';
import { ma, ra, mo, song, ds } from './_khung-12.mjs';

const goiY = (t, a, b, c) => [
  mo(t('Hint 1 — where to look', 'Gợi ý 1 — nhìn vào đâu'), `<p>${t(...a)}</p>`),
  mo(t('Hint 2 — which tool', 'Gợi ý 2 — dùng công cụ nào'), `<p>${t(...b)}</p>`),
  mo(t('Hint 3 — which code', 'Gợi ý 3 — vùng mã nào'), `<p>${t(...c)}</p>`),
].join('\n');
const giai = (t, ...noi) => mo(t('Walkthrough (open after your own attempt)', 'Lời giải (mở sau khi đã tự làm)'), ...noi);

const LIEN_KET = [
  lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-8-1-race', title: 'Bài 8.1 — Race condition', sub: 'Đặt trùng, mất cập nhật, UNIQUE và transaction.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-7-4-khoa', title: 'Bài 7.4 — Khoá và deadlock', sub: 'pg_locks, pg_stat_activity, đọc log deadlock.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-8-4-bo-nho', title: 'Bài 8.4 — Rò rỉ bộ nhớ', sub: 'Hai heap snapshot, Comparison, Retainers.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-8-3-cache', title: 'Bài 8.3 — "Sửa rồi mà vẫn lỗi"', sub: 'Bộ đệm ở mọi tầng, kiểm bản đang chạy bằng /health.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-9-1-bisect-run', title: 'Bài 9.1 — git bisect run', sub: 'Mã thoát 0 / 1 / 125 của script kiểm.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'postgresql', bai: 'postgresql-11-4-khoa-deadlock', title: 'PostgreSQL 11.4 — Khoá và deadlock', sub: 'Các mức khoá dòng, thứ tự khoá.', cta: 'Mở bài →' }),
].join('\n');

const noiDung = song((t) => `
<span class="eyebrow">${t('Chapter 12 · Bugs 6–10', 'Chương 12 · Lỗi 6–10')}</span>
<h2>${t('Five bugs that do not happen when you click once', 'Năm lỗi không xảy ra khi bạn chỉ bấm một lần')}</h2>
<p class="lead">${t(
  'Concurrency, memory over time, state in another service, and history. None of them shows up in a single manual test, so for each one the first deliverable is a <strong>script</strong> that makes it happen on demand.',
  'Đồng thời, bộ nhớ theo thời gian, trạng thái nằm ở dịch vụ khác, và lịch sử. Không lỗi nào lộ ra khi thử tay một lần, nên với mỗi lỗi, sản phẩm đầu tiên là một <strong>script</strong> làm nó xảy ra khi bạn muốn.')}</p>

<h3>${t('Bug 6 · LAB-1206 — two groups own the same slot', 'Lỗi 6 · LAB-1206 — hai nhóm cùng giữ một khung giờ')}</h3>
<p>${t('Technique required: a parallel reproduction script with warm connections, run several times; a database constraint.', 'Kỹ thuật bắt buộc: script tái hiện song song với kết nối đã làm nóng, chạy nhiều lần; một ràng buộc trong CSDL.')}</p>
${goiY(t,
  ['"Many students clicked at the same moment." Clicking twice by hand is not "the same moment" — fire 20 requests with <code>Promise.all</code>.', '"Rất nhiều bạn bấm cùng một lúc." Bấm tay hai lần không phải "cùng một lúc" — bắn 20 request bằng <code>Promise.all</code>.'],
  ['If the script shows no duplicates, warm up first: on a real server the HTTP sockets and the PostgreSQL pool are already open (lesson 8.1). Then look for overlapping rows with <code>tstzrange(…) &amp;&amp; tstzrange(…)</code>.', 'Nếu script không ra lượt trùng, hãy làm nóng trước: trên server thật, socket HTTP và pool PostgreSQL đã mở sẵn (bài 8.1). Rồi tìm các dòng chồng giờ bằng <code>tstzrange(…) &amp;&amp; tstzrange(…)</code>.'],
  ['<code>node/src/dat-cho.mjs</code>: SELECT, then INSERT, nothing in between that stops a second request.', '<code>node/src/dat-cho.mjs</code>: SELECT, rồi INSERT, không có gì ở giữa ngăn được request thứ hai.'])}
${giai(t, `
${ma(DUA)}
${ra(O6_LOI)}
<p>${t('Eighteen confirmations for one slot. Two lessons hide in the last command: (1) the obvious database fix — an exclusion constraint — <strong>cannot be added while bad data exists</strong>; the migration must first resolve the duplicates (and someone must phone the groups). (2) The error message names the conflicting keys, which is your list for that phone call.',
  'Mười tám xác nhận cho một khung giờ. Lệnh cuối giấu hai bài học: (1) bản sửa hiển nhiên ở CSDL — ràng buộc loại trừ — <strong>không thêm được khi dữ liệu bẩn còn đó</strong>; migration phải xử lý các lượt trùng trước (và phải có người gọi điện cho các nhóm). (2) Thông báo lỗi nêu đúng các khoá xung đột, chính là danh sách cho cuộc gọi đó.')}</p>
<p>${t('First fix: <code>EXCLUDE USING gist</code> plus mapping 23P01 to 409. The reproduction passed — once:', 'Bản sửa đầu: <code>EXCLUDE USING gist</code> và đổi 23P01 thành 409. Bản tái hiện qua — một lần:')}</p>
${ma(D6A, 'diff')}
${ra(O6_V1)}
<p>${t(
  'Second run: <strong>nineteen 500s</strong>. Concurrent INSERTs that collide on an exclusion constraint wait for each other\'s transaction to finish; with many of them the waits form a cycle and PostgreSQL kills transactions with 40P01. Some requests took 12–13 s (deadlock_timeout 1 s, repeated). The grader runs 8 rounds for exactly this reason — and even so it let this version pass once in three runs here:',
  'Lần chạy thứ hai: <strong>mười chín lỗi 500</strong>. Các INSERT cùng lúc đụng nhau trên ràng buộc loại trừ phải chờ giao dịch của nhau kết thúc; khi nhiều, các lượt chờ tạo thành vòng và PostgreSQL huỷ giao dịch với 40P01. Có request mất 12–13 s (deadlock_timeout 1 s, lặp lại). Bộ chấm chạy 8 vòng chính vì lẽ đó — mà vẫn cho bản này qua một trong ba lần chạy ở đây:')}</p>
${ra(O6_KIEM_V1)}
<p>${t('Final fix: serialise bookings <em>per room</em> with a transaction-scoped advisory lock, keep EXCLUDE as the last line of defence for any other write path:', 'Bản sửa cuối: xếp hàng các lượt đặt <em>theo phòng</em> bằng khoá tư vấn trong phạm vi giao dịch, giữ EXCLUDE làm lưới cuối cho mọi đường ghi khác:')}</p>
${ma(D6B, 'diff')}
${ra(O6_SUA)}
${mo('db/sua-06.sql · dat-cho.mjs (bản phát hành)', ma(SUA_06, 'sql'), ma(DAT_CHO))}
`)}
<p><strong>${t('🕵️ Real incident:', '🕵️ Sự cố thật:')}</strong> ${t(
  'In 2015 Egor Homakov sent two Starbucks gift-card transfers at the same moment from two sessions; on the sixth try both succeeded — two $5 transfers out of a $5 card, $15 + $5 = $20 in total, and he bought $16.70 of food with it before reporting. His note: limiting requests, random delays or "DB transactions used the wrong way" do not stop races; a pessimistic lock does.',
  'Năm 2015, Egor Homakov gửi hai lệnh chuyển tiền thẻ quà tặng Starbucks cùng lúc từ hai phiên; tới lần thứ sáu cả hai cùng thành công — hai lần chuyển 5 USD từ một thẻ chỉ có 5 USD, tổng cộng 15 + 5 = 20 USD, và anh mua đồ ăn 16,70 USD trước khi báo lỗi. Ghi chú của anh: giới hạn số request, chờ ngẫu nhiên hay "dùng transaction sai cách" không chặn được race; khoá bi quan thì chặn được.')}</p>
${nguon('🕵️', 'Egor Homakov (2015) — Hacking Starbucks for unlimited coffee', 'Race condition trên chuyển tiền thẻ quà tặng.', 'https://sakurity.com/blog/2015/05/21/starbucks.html')}

<h3>${t('Bug 7 · LAB-1207 — "deadlock detected" on swap', 'Lỗi 7 · LAB-1207 — "deadlock detected" khi đổi giờ')}</h3>
<p>${t('Technique required: reproduce with opposite orders in parallel; read <code>pg_stat_activity</code> + <code>pg_blocking_pids()</code> while it hangs; read the PostgreSQL deadlock report.', 'Kỹ thuật bắt buộc: tái hiện bằng hai chiều ngược nhau chạy song song; đọc <code>pg_stat_activity</code> + <code>pg_blocking_pids()</code> lúc đang treo; đọc báo cáo deadlock của PostgreSQL.')}</p>
${goiY(t,
  ['A swap between A and B, and at the same time a swap between B and A. Who locks what first?', 'Một lượt đổi giữa A và B, cùng lúc một lượt đổi giữa B và A. Ai khoá cái gì trước?'],
  ['Query <code>pg_stat_activity</code> during the first second (deadlock_timeout = 1 s), then <code>docker logs dbg-pg</code> — PostgreSQL prints the whole cycle.', 'Truy vấn <code>pg_stat_activity</code> trong giây đầu (deadlock_timeout = 1 s), rồi <code>docker logs dbg-pg</code> — PostgreSQL in cả vòng chờ.'],
  ['<code>DatChoService.doiGio(a, b)</code>: two <code>khoaDeSua()</code> calls in parameter order.', '<code>DatChoService.doiGio(a, b)</code>: hai lần <code>khoaDeSua()</code> theo thứ tự tham số.'])}
${giai(t, `
${ma(DOI)}
${ra(O7_LOI)}
${ma(CHO_SQL, 'sql')}
${ra(O7_CHO)}
<p>${t('The PostgreSQL log gives the cycle and the exact statement (<code>for no key update</code> = what Hibernate sends for PESSIMISTIC_WRITE). The Java side only says CannotAcquireLockException:', 'Log PostgreSQL cho thấy cả vòng và đúng câu lệnh (<code>for no key update</code> = thứ Hibernate gửi cho PESSIMISTIC_WRITE). Phía Java chỉ nói CannotAcquireLockException:')}</p>
${ra(O7_PG)}
${ra(O7_JAVA)}
<p>${t('PostgreSQL\'s documentation gives the rule: "the best defense against deadlocks is generally to avoid them by being certain that all applications using a database acquire locks on multiple objects in a consistent order." Lock the smaller id first:', 'Tài liệu PostgreSQL nêu luật: "cách phòng deadlock tốt nhất thường là tránh nó, bằng cách bảo đảm mọi ứng dụng dùng CSDL đều xin khoá trên nhiều đối tượng theo một thứ tự nhất quán." Khoá id nhỏ trước:')}</p>
${ma(D7, 'diff')}
${ra(O7_SUA)}
<p>${t('Retrying on 40P01 is a valid <em>extra</em> safety net (Spring Retry, or a loop), but alone it turns a bug into latency.', 'Thử lại khi gặp 40P01 là một lưới an toàn <em>bổ sung</em> hợp lệ (Spring Retry, hoặc một vòng lặp), nhưng chỉ có nó thì lỗi biến thành độ trễ.')}</p>
`)}

<h3>${t('Bug 8 · LAB-1208 — memory grows until OOMKilled', 'Lỗi 8 · LAB-1208 — bộ nhớ tăng tới khi bị OOMKilled')}</h3>
<p>${t('Technique required: two heap snapshots around a workload, Comparison, then Retainers (Chrome DevTools → Memory, via <code>chrome://inspect</code> on 127.0.0.1:41209).', 'Kỹ thuật bắt buộc: hai heap snapshot kẹp một lượt tải, Comparison, rồi Retainers (Chrome DevTools → Memory, qua <code>chrome://inspect</code> vào 127.0.0.1:41209).')}</p>
${goiY(t,
  ['"No unusual traffic" — then which normal action creates something that is never freed? The web app opens <code>/su-kien</code> every time a tab is shown.', '"Không có tải bất thường" — vậy hành động bình thường nào tạo ra thứ không bao giờ được giải phóng? Web mở <code>/su-kien</code> mỗi lần hiện một tab.'],
  ['Snapshot, open and close 2,000 SSE connections, snapshot again, sort by "# Delta". Look for a count that equals your workload.', 'Chụp snapshot, mở rồi đóng 2.000 kết nối SSE, chụp lại, sắp theo "# Delta". Tìm con số bằng đúng lượng tải của bạn.'],
  ['<code>node/src/su-kien.mjs</code>: what happens when the browser closes the connection?', '<code>node/src/su-kien.mjs</code>: chuyện gì xảy ra khi trình duyệt đóng kết nối?'])}
${giai(t, `
${ra(O8_KT)}
${ra(O8_SO)}
<p>${t('Exactly +2,000 ServerResponse, +2,000 Socket, +2,001 Timeout: one of each per closed connection, still alive. Retainers answer "who keeps it":', 'Đúng +2.000 ServerResponse, +2.000 Socket, +2.001 Timeout: mỗi kết nối đã đóng để lại một bộ, vẫn sống. Retainers trả lời "ai giữ nó":')}</p>
${ra(O8_GIU)}
<p>${t('The response is held by the closure of a <code>setInterval</code> (the 15-second ping), which the timer list keeps alive forever — the <code>Set</code> is a second owner. Clean both on <code>close</code>:', 'Response bị giữ bởi closure của một <code>setInterval</code> (nhịp ping 15 giây), mà danh sách hẹn giờ giữ sống mãi — cái <code>Set</code> là chủ thứ hai. Dọn cả hai khi <code>close</code>:')}</p>
${ma(D8, 'diff')}
<p>${t('The grader counts live timers through the inspector (<code>process.getActiveResourcesInfo()</code>) before and after 300 connections: +300 on the shipped version, +0 after the fix (lesson 12.4).', 'Bộ chấm đếm bộ hẹn giờ còn sống qua inspector (<code>process.getActiveResourcesInfo()</code>) trước và sau 300 kết nối: +300 ở bản phát hành, +0 sau khi sửa (bài 12.4).')}</p>
${mo('su-kien.mjs · tools/tai-sse.mjs · heap.mjs', ma(SU_KIEN), ma(TAI_SSE), ma(HEAP))}
`)}

<h3>${t('Bug 9 · LAB-1209 — renamed room, old name for ten minutes', 'Lỗi 9 · LAB-1209 — đổi tên phòng, tên cũ còn mười phút')}</h3>
<p>${t('Technique required: follow the data through each layer and read the cache headers; ask "who owns this data, who copies it, who tells the copy it is stale?"', 'Kỹ thuật bắt buộc: lần theo dữ liệu qua từng tầng và đọc header của bộ đệm; hỏi "ai giữ bản gốc, ai sao chép, ai báo cho bản sao là nó đã cũ?"')}</p>
${goiY(t,
  ['Ctrl+F5 does not help ⇒ it is not the browser cache. Compare what lich-api returns with what dat-api returns.', 'Ctrl+F5 không đỡ ⇒ không phải bộ đệm trình duyệt. So cái lich-api trả với cái dat-api trả.'],
  ['<code>curl -si</code> and the <code>X-Cache</code> header.', '<code>curl -si</code> và header <code>X-Cache</code>.'],
  ['<code>node/src/cache.mjs</code> — TTL, and who could tell it the data changed (PostgreSQL <code>LISTEN</code>/<code>NOTIFY</code>).', '<code>node/src/cache.mjs</code> — TTL, và ai có thể báo cho nó dữ liệu đã đổi (PostgreSQL <code>LISTEN</code>/<code>NOTIFY</code>).'])}
${giai(t, `
${ra(O9_LOI)}
<p>${t('The owner (lich-api) has the new name; the copy (dat-api) serves the old one with <code>HIT; age=2</code>, and would for up to 600 s. Nothing told it. The fix lets the database announce changes:', 'Chủ dữ liệu (lich-api) đã có tên mới; bản sao (dat-api) trả tên cũ với <code>HIT; age=2</code>, và sẽ còn như vậy tới 600 s. Không ai báo cho nó. Bản sửa để CSDL tự thông báo khi dữ liệu đổi:')}</p>
${ma(SUA_09, 'sql')}
${ma(D9, 'diff')}
${ra(O9_SUA)}
<p>${t('Why a trigger and not "lich-api calls dat-api after saving"? Any writer — an SQL script, a migration, a third service — fires the trigger. TTL stays (60 s) as a safety net if the LISTEN connection drops.', 'Vì sao dùng trigger mà không phải "lich-api gọi dat-api sau khi lưu"? Bất kỳ ai ghi — một script SQL, một migration, một dịch vụ thứ ba — cũng kích hoạt trigger. TTL vẫn giữ (60 s) làm lưới an toàn khi kết nối LISTEN rớt.')}</p>
${mo('cache.mjs (bản phát hành)', ma(CACHE))}
`)}

<h3>${t('Bug 10 · LAB-1210 — worked in 1.4, broken in 1.6', 'Lỗi 10 · LAB-1210 — bản 1.4 chạy, bản 1.6 hỏng')}</h3>
<p>${t('Technique required: <code>git bisect run</code> with a script that returns 0 / 1 / 125. dat-api has its own history (<code>node/</code>, 38 commits, tags v1.4.0 … v1.6.0).', 'Kỹ thuật bắt buộc: <code>git bisect run</code> với script trả 0 / 1 / 125. dat-api có lịch sử riêng (<code>node/</code>, 38 commit, tag v1.4.0 … v1.6.0).')}</p>
${goiY(t,
  ['"Worked in 1.4" is a gift: you have a good commit and a bad commit.', '"Bản 1.4 chạy" là một món quà: bạn có một commit tốt và một commit xấu.'],
  ['The existing tests pass on 1.6 — they do not cover touching slots. Write the test first, keep it OUTSIDE the repo so every old commit uses the same check.', 'Bộ test sẵn có qua hết trên 1.6 — nó không có trường hợp hai ca chạm nhau. Viết test trước, để NGOÀI repo để mọi commit cũ dùng chung một phép kiểm.'],
  ['Some commits in the range do not even load (a "wip" commit). What must your script return for those?', 'Có commit trong dải không nạp nổi mã (một commit "wip"). Script của bạn phải trả gì cho những commit đó?'])}
${giai(t, `
${ra(O10_LOG)}
<p>${t('Two hasty runs first — both name the same, wrong commit:', 'Hai lần chạy vội trước — cả hai cùng chỉ một commit, và đều sai:')}</p>
${ra(O10_VOI)}
${ra(O10_THO)}
<p>${t('<code>npm test</code> passes everywhere except where the code does not load, so the first "bad" is the wip commit. The second script has the right test but treats "cannot load" as "bad". The right script separates the two:', '<code>npm test</code> qua ở mọi nơi trừ chỗ mã không nạp được, nên "xấu" đầu tiên là commit wip. Script thứ hai có test đúng nhưng coi "không nạp được" là "xấu". Script đúng tách hai trường hợp:')}</p>
${ma(LIEN_KE)}
${ma(BISECT, 'bash')}
${ra(O10_BISECT)}
<p>${t('Three commits skipped (125), the culprit found anyway — a "refactor" that changed <code>&lt;</code> into <code>&lt;=</code> "to also cover the touching case":', 'Ba commit bị bỏ qua (125), thủ phạm vẫn được tìm ra — một "refactor" đổi <code>&lt;</code> thành <code>&lt;=</code> "để tính cả trường hợp chạm biên":')}</p>
${ra(O10_SHOW)}
<p>${t('Fix on main (not a revert of the whole commit — the refactor part is fine) plus the test that would have caught it:', 'Sửa trên main (không revert cả commit — phần refactor không sai) cộng với test lẽ ra đã bắt được nó:')}</p>
${ma(D10, 'diff')}
${mo('khung-gio.mjs · test/khung-gio.test.mjs (bản phát hành) · tools/tao-lich-su.sh', ma(KHUNG_GIO), ma(TEST_KG), ma(TAO_LS, 'bash'))}
`)}
<p><strong>${t('Lesson:', 'Bài học:')}</strong> ${t('bisect is exactly as good as its test, and "cannot test" must never be reported as "bad".', 'bisect tốt đúng bằng phép kiểm của nó, và "không kiểm được" không bao giờ được báo là "xấu".')}</p>

<h3>${t('At work: who you talk to for each bug', 'Đi làm: mỗi lỗi bạn phải nói chuyện với ai')}</h3>
<p>${t(
  'Bug 6 needs the lab manager (which group keeps the slot) and a data fix before the migration; bug 7 and 9 cross team boundaries (Java team and Node team) — the PR description must explain the contract, e.g. "dat-api now LISTENs on phong_doi; any writer to phong triggers it". Bug 8 goes with a graph from operations: memory flat after the deploy. That conversation is half of the job in outsourcing.',
  'Lỗi 6 cần thầy quản lý lab (nhóm nào giữ khung giờ) và một bản sửa dữ liệu trước migration; lỗi 7 và 9 vượt ranh giới đội (đội Java và đội Node) — mô tả PR phải giải thích giao ước, ví dụ "dat-api giờ LISTEN kênh phong_doi; mọi ai ghi vào bảng phong đều kích hoạt nó". Lỗi 8 đi kèm biểu đồ của vận hành: bộ nhớ phẳng sau khi deploy. Cuộc nói chuyện đó là một nửa công việc ở outsourcing.')}</p>

<h3>🎤 ${t('What an interviewer will ask', 'Phỏng vấn viên sẽ hỏi')}</h3>
${ds(t, [
  [`<strong>"How do you prevent double booking?"</strong> A constraint in the database (UNIQUE, or EXCLUDE for ranges) as the guarantee, plus serialising the conflicting writes (row lock, advisory lock) so users get 409 instead of 500 — and a parallel test run several times.`, `<strong>"Làm sao chặn đặt trùng?"</strong> Một ràng buộc trong CSDL (UNIQUE, hoặc EXCLUDE cho khoảng) làm bảo đảm, cộng xếp hàng các lượt ghi xung đột (khoá dòng, khoá tư vấn) để người dùng nhận 409 thay vì 500 — và một test song song chạy nhiều lần.`],
  [`<strong>"What causes a deadlock and how do you fix it?"</strong> Two transactions lock the same resources in opposite order. Read the database's deadlock report, then lock in a consistent order; retry on 40P01 only as an extra net.`, `<strong>"Deadlock do đâu và sửa thế nào?"</strong> Hai giao dịch khoá cùng tài nguyên theo thứ tự ngược nhau. Đọc báo cáo deadlock của CSDL, rồi khoá theo thứ tự nhất quán; thử lại khi 40P01 chỉ là lưới bổ sung.`],
  [`<strong>"Memory keeps growing in a Node service. What do you do?"</strong> Confirm with a graph, then two heap snapshots around a known workload, Comparison by count, Retainers to the owner. Often a timer, listener or map that is never cleaned.`, `<strong>"Bộ nhớ một dịch vụ Node cứ tăng. Bạn làm gì?"</strong> Xác nhận bằng biểu đồ, rồi hai heap snapshot kẹp một lượt tải đã biết, Comparison theo số lượng, Retainers tới chủ sở hữu. Thường là một hẹn giờ, listener hay map không bao giờ được dọn.`],
  [`<strong>"Something broke between two releases. How do you find the commit?"</strong> <code>git bisect run</code> with a test kept outside the repo; exit 125 for commits that cannot be tested.`, `<strong>"Có gì đó hỏng giữa hai bản phát hành. Tìm commit thế nào?"</strong> <code>git bisect run</code> với một test để ngoài repo; thoát 125 cho commit không kiểm được.`],
], 'ol')}

${LIEN_KET}
${nguon('📘', 'PostgreSQL 16 — Explicit Locking (13.3.4 Deadlocks, 13.3.5 Advisory Locks)', 'Khoá theo thứ tự nhất quán; pg_advisory_xact_lock.', 'https://www.postgresql.org/docs/16/explicit-locking.html')}
${nguon('📘', 'PostgreSQL 16 — CREATE TABLE … EXCLUDE', 'Ràng buộc loại trừ cho khoảng thời gian.', 'https://www.postgresql.org/docs/16/sql-createtable.html')}
${nguon('📘', 'PostgreSQL 16 — NOTIFY', 'LISTEN/NOTIFY, payload, khi nào thông báo được gửi.', 'https://www.postgresql.org/docs/16/sql-notify.html')}
${nguon('📘', 'git-bisect', 'bisect run và mã thoát 125.', 'https://git-scm.com/docs/git-bisect')}
`);

export default {
  title: '12.3 — Bugs 6–10: double booking race, deadlock, memory leak, stale cache, regression|||12.3 — Lỗi 6–10: race đặt trùng, deadlock, rò rỉ bộ nhớ, cache cũ, lỗi hồi quy',
  slug: 'dbg-12-3-loi-6-10',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Năm lỗi không lộ khi bấm một lần: 20 request cùng lúc ra 18 lượt đặt trùng, bản sửa EXCLUDE đầu tiên qua một lần rồi trả 19×500 vì deadlock 40P01 (sửa cuối: khoá tư vấn theo phòng); đổi giờ a⇄b chết 37/40 (khoá theo thứ tự id); SSE để lại +2.000 Timeout/Socket (Retainers chỉ ra setInterval); đệm phòng cũ 10 phút (LISTEN/NOTIFY); git bisect run với 125 tìm ra commit đổi < thành <=.',
  content: noiDung,
};
