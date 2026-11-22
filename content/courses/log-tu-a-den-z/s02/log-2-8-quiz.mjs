/**
 * 2.8 — Kiểm tra Chương 2 (soạn 22/11/2026). 10 câu đọc lệnh đoán kết quả; mọi đáp số đã chạy thật (OUT['s02/*']).
 * Phân bố đáp án: A ×2 (câu 3, 6) · B ×3 (1, 5, 9) · C ×3 (4, 7, 10) · D ×2 (2, 8).
 */
export default {
  title: '2.8 — Chapter 2 quiz|||2.8 — Kiểm tra Chương 2',
  slug: 'log-2-8-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Mười câu đọc lệnh đoán kết quả: đếm mã 502 đúng cột, uniq thiếu sort, tail -f sau logrotate, regex tham lam, tìm ${jndi bằng -F, jq gặp dòng hỏng, toán tử //, Group-Object, substr theo phút, giờ của log IIS và tường lửa Windows.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Quiz</span>
<h2>Read the command, predict the result</h2>
<p class="lead">Every question shows a command you could type on the sample pack. Predict what it does before choosing — that is the skill you need at 2 a.m. when there is no time to experiment.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I read huge files with <code>less</code>, <code>tail -F</code>, <code>zcat</code> and never open them in an editor.</li>
<li>I can write grep patterns for IPs, ISO times and status codes, and I know when to use <code>-F</code>.</li>
<li>I can type the count-sort-cut recipe and explain why <code>sort</code> comes before <code>uniq -c</code>.</li>
<li>I can filter and count JSON logs with jq, including missing fields and broken lines.</li>
<li>I can answer the same questions in PowerShell with Select-String and Group-Object.</li>
<li>I know when to switch to lnav, GoAccess, SQL or a spreadsheet.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Kiểm tra</span>
<h2>Đọc lệnh, đoán kết quả</h2>
<p class="lead">Câu nào cũng đưa ra một lệnh bạn có thể gõ trên gói log mẫu. Hãy đoán nó làm gì trước khi chọn — đó là kỹ năng bạn cần lúc 2 giờ sáng, khi không có thời gian thử.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi đọc tệp khổng lồ bằng <code>less</code>, <code>tail -F</code>, <code>zcat</code> và không bao giờ mở bằng trình soạn thảo.</li>
<li>Tôi viết được mẫu grep cho IP, giờ ISO, mã trạng thái, và biết khi nào dùng <code>-F</code>.</li>
<li>Tôi gõ được công thức đếm-xếp-cắt và giải thích được vì sao <code>sort</code> phải đứng trước <code>uniq -c</code>.</li>
<li>Tôi lọc và đếm được log JSON bằng jq, kể cả trường thiếu và dòng hỏng.</li>
<li>Tôi trả lời được cùng các câu hỏi bằng PowerShell với Select-String và Group-Object.</li>
<li>Tôi biết lúc nào chuyển sang lnav, GoAccess, SQL hay bảng tính.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'You must count HTTP 502 responses in an nginx combined access log as reliably as possible. Which command?|||Bạn cần đếm phản hồi HTTP 502 trong access log dạng combined của nginx thật chắc chắn. Lệnh nào?',
        options: [
          "grep -c '502' access.log",
          "awk '$9 == 502' access.log | wc -l",
          "grep -c ' 502 ' access.log — it can never match anything else|||grep -c ' 502 ' access.log — nó không bao giờ khớp nhầm thứ khác",
          "grep -vc ' 200 ' access.log",
        ],
        correctIndex: 1, points: 1,
        explanation: `EN: Column 9 is the status; comparing it exactly cannot be fooled by a 502-byte response or "15020" in a URL. ' 502 ' usually works but also matches a size of 502; plain 502 matches anywhere; -v 200 counts every non-200.|||VI: Cột 9 là mã trạng thái; so đúng cột thì không bị lừa bởi phản hồi 502 byte hay "15020" trong URL. ' 502 ' thường đúng nhưng cũng khớp kích thước 502; 502 trần khớp ở bất kỳ đâu; -v 200 đếm mọi thứ không phải 200.`,
      },
      {
        question: `What does awk '{print $1}' access.log | uniq -c | sort -nr | head -n 3 do wrong?|||Lệnh awk '{print $1}' access.log | uniq -c | sort -nr | head -n 3 sai ở đâu?`,
        options: [
          'Nothing — uniq -c groups identical values wherever they are|||Không sai gì — uniq -c gom các giá trị giống nhau ở bất cứ đâu',
          'sort -nr must come before uniq -c|||sort -nr phải đứng trước uniq -c',
          'head -n 3 cuts before counting, so counts are too small|||head -n 3 cắt trước khi đếm, nên số đếm bị nhỏ',
          'uniq only merges adjacent lines; without a sort first, the same IP is counted in many small pieces|||uniq chỉ gộp các dòng liền kề; thiếu một lần sort trước, cùng một IP bị đếm thành nhiều mẩu nhỏ',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: The recipe is awk | sort | uniq -c | sort -nr | head. Without the first sort, an IP that appears at 00:01 and 23:59 gets two separate small counts. PowerShell Group-Object does not have this trap.|||VI: Công thức là awk | sort | uniq -c | sort -nr | head. Thiếu lần sort đầu, một IP xuất hiện lúc 00:01 và 23:59 bị tách thành hai số đếm nhỏ riêng. Group-Object của PowerShell không có bẫy này.',
      },
      {
        question: 'You run tail -f /var/log/nginx/access.log at midnight. At 00:00 logrotate renames the file to access.log.1 and nginx starts a new access.log. What do you see afterwards?|||Bạn chạy tail -f /var/log/nginx/access.log lúc nửa đêm. Đúng 00:00, logrotate đổi tên tệp thành access.log.1 và nginx mở access.log mới. Sau đó bạn thấy gì?',
        options: [
          'Nothing new — tail -f keeps following the old, renamed file; use tail -F to follow the name|||Không thấy gì mới — tail -f vẫn bám tệp cũ đã đổi tên; dùng tail -F để bám theo tên',
          'tail -f switches to the new file automatically and prints a notice|||tail -f tự chuyển sang tệp mới và in ra một thông báo',
          'tail exits with an error because the file is gone|||tail thoát kèm lỗi vì tệp đã mất',
          'Every new line twice, once from each file|||Mỗi dòng mới hiện hai lần, mỗi tệp một lần',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: -f = --follow=descriptor (the open file); -F = --follow=name --retry. In the lesson’s real run, tail -F printed "has become inaccessible … has appeared; following new file" and continued; tail -f stayed silent.|||VI: -f = --follow=descriptor (tệp đang mở); -F = --follow=name --retry. Ở lần chạy thật trong bài, tail -F in ra "has become inaccessible … has appeared; following new file" rồi đọc tiếp; tail -f im lặng.',
      },
      {
        question: `On an nginx error-log line, grep -o '".*"' prints what?|||Với một dòng error log nginx, grep -o '".*"' in ra gì?`,
        options: [
          'Each quoted field on its own line|||Mỗi trường trong ngoặc kép trên một dòng riêng',
          'Only the first quoted field|||Chỉ trường trong ngoặc kép đầu tiên',
          'Everything from the first quote to the last quote of the line, as one match|||Mọi thứ từ dấu nháy đầu tới dấu nháy cuối của dòng, thành một chỗ khớp',
          'Nothing, because quotes must be escaped in grep|||Không gì cả, vì dấu nháy phải thoát trong grep',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: .* is greedy. The real output was "GET /api/v1/feed HTTP/1.1", upstream: "http://…", host: "cuongthai.example" — three fields in one. Use "[^"]*" to get each field separately.|||VI: .* là tham lam. Output thật là "GET /api/v1/feed HTTP/1.1", upstream: "http://…", host: "cuongthai.example" — ba trường dính làm một. Dùng "[^"]*" để lấy từng trường riêng.',
      },
      {
        question: 'You want every line containing the literal text ${jndi: in an access log. Which command is correct?|||Bạn muốn mọi dòng chứa đúng chuỗi ${jndi: trong access log. Lệnh nào đúng?',
        options: [
          "grep -E '${jndi:' access.log",
          "grep -F '${jndi:' access.log",
          'grep "${jndi:" access.log',
          "grep -c 'jndi' access.log | head",
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: -F searches the fixed string, so $ and { are not special. With -E, $ is an anchor and { starts a repetition; inside double quotes the shell itself tries to expand ${…}. The last option only counts.|||VI: -F tìm chuỗi cố định, nên $ và { không đặc biệt. Với -E, $ là neo và { mở một phép lặp; trong nháy kép thì chính shell cố khai triển ${…}. Phương án cuối chỉ đếm.',
      },
      {
        question: 'jq -c . app-hong.jsonl stops with "parse error: Invalid numeric literal at line 3". The file mixes JSON lines with an npm warning. How do you keep the JSON records?|||jq -c . app-hong.jsonl dừng với "parse error: Invalid numeric literal at line 3". Tệp trộn dòng JSON với một cảnh báo npm. Giữ lại các bản ghi JSON bằng cách nào?',
        options: [
          "jq -R -c 'fromjson? | {level, msg}' app-hong.jsonl",
          "jq -s -c '.' app-hong.jsonl",
          "jq -r -c '.' app-hong.jsonl",
          'Delete line 3 by hand in an editor, then run jq again|||Mở trình soạn thảo xoá tay dòng 3, rồi chạy lại jq',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: -R reads lines as strings; fromjson? parses what it can and skips the rest — the real run printed 3 objects from 4 lines. -s and -r do not change parsing; editing evidence by hand is bad practice.|||VI: -R đọc dòng như chuỗi; fromjson? phân tích được cái nào thì lấy, còn lại bỏ qua — lần chạy thật in ra 3 đối tượng từ 4 dòng. -s và -r không thay đổi việc phân tích; sửa tay bằng chứng là thói quen xấu.',
      },
      {
        question: `jq -r '.res.statusCode // "-"' app.jsonl | sort | uniq -c prints 47 lines of "-". What are they?|||jq -r '.res.statusCode // "-"' app.jsonl | sort | uniq -c in ra 47 dòng "-". Đó là gì?`,
        options: [
          'Requests that returned HTTP status 0|||Các request trả về mã HTTP 0',
          'Lines jq could not parse|||Các dòng jq không phân tích được',
          'Records without a res object — error and warning records that have no response status|||Các bản ghi không có đối tượng res — bản ghi lỗi và cảnh báo không có mã phản hồi',
          'Requests answered from cache|||Các request được trả từ bộ đệm',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: // returns the right side when the left is null; 25 errors + 22 warnings = 47 records have no .res. Unparseable lines would stop jq instead.|||VI: // trả về vế phải khi vế trái là null; 25 lỗi + 22 cảnh báo = 47 bản ghi không có .res. Dòng không phân tích được thì sẽ làm jq dừng chứ không ra "-".',
      },
      {
        question: 'Which PowerShell pipeline is the equivalent of … | sort | uniq -c | sort -nr | head -n 3?|||Đường ống PowerShell nào tương đương … | sort | uniq -c | sort -nr | head -n 3?',
        options: [
          '… | Sort-Object | Get-Unique | Select-Object -First 3',
          '… | Measure-Object -Line | Select-Object -Last 3',
          '… | Select-String -Pattern . -AllMatches | Select-Object -First 3',
          '… | Group-Object -NoElement | Sort-Object Count -Descending | Select-Object -First 3',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Group-Object counts equal values (no need to sort first), Sort-Object Count -Descending orders them, Select-Object -First 3 cuts — the real run gave 422 203.0.113.66 first, as in bash. Get-Unique removes duplicates but does not count.|||VI: Group-Object đếm các giá trị bằng nhau (không cần sort trước), Sort-Object Count -Descending xếp chúng, Select-Object -First 3 cắt — lần chạy thật ra 422 203.0.113.66 đứng đầu, như bash. Get-Unique bỏ trùng nhưng không đếm.',
      },
      {
        question: "For the access-log field [20/Nov/2026:14:07:12, what does awk '{print substr($4, 2, 17)}' print?|||Với trường access log [20/Nov/2026:14:07:12, awk '{print substr($4, 2, 17)}' in ra gì?",
        options: [
          '[20/Nov/2026:14:07',
          '20/Nov/2026:14:07',
          '20/Nov/2026:14',
          '14:07:12',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: substr(s, start, length): start at character 2 (skipping "["), take 17 characters = "20/Nov/2026:14:07", the minute. substr($4, 14, 2) gives the hour.|||VI: substr(s, vị trí, độ dài): bắt đầu ở ký tự 2 (bỏ "["), lấy 17 ký tự = "20/Nov/2026:14:07", tức là phút. substr($4, 14, 2) cho ra giờ.',
      },
      {
        question: 'An IIS log (W3C format) and a Windows Firewall pfirewall.log from the same server both show 08:30:00. Can you compare them directly?|||Một log IIS (định dạng W3C) và pfirewall.log của Windows Firewall trên cùng server đều ghi 08:30:00. So thẳng được không?',
        options: [
          'Yes — logs written by the same machine always use the same time zone|||Được — log do cùng một máy ghi thì luôn cùng múi giờ',
          'Yes — both are W3C format, so both are UTC|||Được — cả hai là định dạng W3C, nên đều là UTC',
          'No — IIS W3C logs use UTC by default, while pfirewall.log states "#Time Format: Local"|||Không — log W3C của IIS mặc định dùng UTC, còn pfirewall.log ghi rõ "#Time Format: Local"',
          'No — the firewall log stores epoch milliseconds|||Không — log tường lửa lưu epoch mili giây',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Microsoft documents W3C Extended times as UTC, and the firewall log header in the pack says Time Format: Local. On a UTC+7 server, 08:30 IIS = 15:30 local. Always read the header.|||VI: Microsoft ghi rõ giờ trong W3C Extended là UTC, còn tiêu đề log tường lửa trong gói mẫu ghi Time Format: Local. Trên server UTC+7, 08:30 của IIS = 15:30 giờ địa phương. Luôn đọc tiêu đề.',
      },
    ],
  },
};
