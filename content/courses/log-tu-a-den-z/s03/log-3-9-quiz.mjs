/**
 * 3.9 — Kiểm tra Chương 3 (soạn 24/11/2026, agent lgz). 10 câu; đáp số dựa trên output thật OUT['s03/*'] (bộ EVTX mẫu công khai).
 * Phân bố đáp án: A ×2 (3, 8) · B ×3 (1, 5, 9) · C ×3 (2, 6, 10) · D ×2 (4, 7).
 */
export default {
  title: '3.9 — Chapter 3 quiz|||3.9 — Kiểm tra Chương 3',
  slug: 'log-3-9-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Mười câu: log nào chứa gì, Event ID phải đọc kèm provider, Keywords Audit Success/Failure, câu Message không nằm trong .evtx, Filter XML, kích thước 20 MB và log quay vòng, cờ DIRTY, crash 1000/1001 và c0000005, chuỗi tắt sạch 1074→6006→13, số bản ghi đi lùi.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Quiz</span>
<h2>Event Viewer from zero</h2>
<p class="lead">Ten questions built on the real sample logs of this chapter. For each one, ask: which field proves it?</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can name the five Windows Logs and the Operational log for RDP, PowerShell and Defender.</li>
<li>I can read the System part and EventData of an event's XML.</li>
<li>I can build a filter, save it as a Custom View and export .evtx/.csv.</li>
<li>I can check a log's size, mode and oldest event, and explain Circular/AutoBackup/Retain.</li>
<li>I can read a crash (1000/1001) and a restart sequence (1074/6006/13/12/6005).</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Kiểm tra</span>
<h2>Event Viewer từ số 0</h2>
<p class="lead">Mười câu dựa trên log mẫu thật của chương. Với mỗi câu, tự hỏi: trường nào chứng minh điều đó?</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi kể được năm Windows Logs và log Operational của RDP, PowerShell, Defender.</li>
<li>Tôi đọc được phần System và EventData trong XML của một sự kiện.</li>
<li>Tôi dựng được bộ lọc, lưu thành Custom View và xuất .evtx/.csv.</li>
<li>Tôi kiểm được kích thước, chế độ và sự kiện cũ nhất của một log, và giải thích Circular/AutoBackup/Retain.</li>
<li>Tôi đọc được một crash (1000/1001) và một chuỗi khởi động lại (1074/6006/13/12/6005).</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'Which log records who restarted the PC (USER32 1074), service starts/stops (7036) and boot events (6005)?|||Log nào ghi ai đã khởi động lại máy (USER32 1074), dịch vụ bật/tắt (7036) và sự kiện khởi động (6005)?',
        options: [
          'Security|||Security',
          'System|||System',
          'Application|||Application',
          'Setup|||Setup',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Lesson 3.1: in the sample System log, Service Control Manager wrote 5620 of 8414 events; USER32 and EventLog are System providers too.|||VI: Bài 3.1: trong log System mẫu, Service Control Manager ghi 5620 trên 8414 sự kiện; USER32 và EventLog cũng là provider của System.',
      },
      {
        question: 'In one Application log, Event ID 1000 appears 136 times. Only one is a crash. Why?|||Trong một log Application, Event ID 1000 xuất hiện 136 lần. Chỉ một lần là crash. Vì sao?',
        options: [
          'The other 135 were cleared by an attacker|||135 lần kia đã bị kẻ tấn công xoá',
          'Event ID 1000 means crash only at Level Critical|||Event ID 1000 chỉ là crash khi Level là Critical',
          'Event IDs are per provider: 1000 is a crash only from "Application Error"; the rest came from LoadPerf and VMware Tools|||Event ID tính theo provider: 1000 chỉ là crash khi đến từ "Application Error"; số còn lại do LoadPerf và VMware Tools ghi',
          'The log was exported in the wrong language|||Log bị xuất sai ngôn ngữ',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Lesson 3.2: 121 × LoadPerf, 13 × VMware Tools, 1 × Interactive Services detection, 1 × Application Error.|||VI: Bài 3.2: 121 × LoadPerf, 13 × VMware Tools, 1 × Interactive Services detection, 1 × Application Error.',
      },
      {
        question: 'A Security event has Keywords 0x8010000000000000. What does it mean?|||Một sự kiện Security có Keywords 0x8010000000000000. Nghĩa là gì?',
        options: [
          'Audit Failure|||Audit Failure (kiểm toán thất bại)',
          'Audit Success|||Audit Success (kiểm toán thành công)',
          'Classic event without a manifest|||Sự kiện kiểu cũ không có manifest',
          'The event was forwarded from another machine|||Sự kiện được chuyển tới từ máy khác',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Lesson 3.2: all 130 × 4625 carried 0x8010… (Audit Failure); all 429 × 4624 carried 0x8020… (Audit Success).|||VI: Bài 3.2: cả 130 lần 4625 mang 0x8010… (Audit Failure); cả 429 lần 4624 mang 0x8020… (Audit Success).',
      },
      {
        question: 'You open a customer\'s exported .evtx and see "The description for Event ID … cannot be found". What is true?|||Bạn mở tệp .evtx khách xuất và thấy "The description for Event ID … cannot be found". Điều gì đúng?',
        options: [
          'The file is corrupted and must be discarded|||Tệp đã hỏng, phải bỏ',
          'The event has no data|||Sự kiện không có dữ liệu',
          'You need administrator rights to read it|||Bạn cần quyền quản trị mới đọc được',
          'The sentence is built from the provider\'s message template on the displaying machine; the data is all there in Details/XML|||Câu chữ được dựng từ mẫu thông điệp của provider trên máy hiển thị; dữ liệu vẫn đủ trong Details/XML',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Lesson 3.2: the 1074 event stores seven Data values; the sentence "The process %1 has initiated the %5 of computer %2…" lives in USER32\'s message resources.|||VI: Bài 3.2: sự kiện 1074 lưu bảy giá trị Data; câu "The process %1 has initiated the %5 of computer %2…" nằm trong tài nguyên thông điệp của USER32.',
      },
      {
        question: 'In Filter Current Log › XML you see timediff(@SystemTime) &lt;= 604800000. What does it select?|||Trong Filter Current Log › XML bạn thấy timediff(@SystemTime) &lt;= 604800000. Nó chọn gì?',
        options: [
          'Events from the first 7 days of the log|||Sự kiện của 7 ngày đầu tiên trong log',
          'Events of the last 7 days, counted back from now (604 800 000 ms)|||Sự kiện của 7 ngày gần nhất, tính lùi từ bây giờ (604 800 000 ms)',
          'Events with record id below 604800000|||Sự kiện có record id nhỏ hơn 604800000',
          'Events that took less than 7 days to write|||Sự kiện ghi mất ít hơn 7 ngày',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Lesson 3.4: the dialog is a query builder; the same QueryList works in Get-WinEvent -FilterXml, wevtutil qe and WEF.|||VI: Bài 3.4: hộp thoại chỉ là trình dựng truy vấn; cùng QueryList dùng được trong Get-WinEvent -FilterXml, wevtutil qe và WEF.',
      },
      {
        question: 'A server writes ~1 947 Security events/hour at ~508 bytes each, log size 20 MB, overwrite as needed. How far back can you investigate?|||Một máy chủ ghi ~1 947 sự kiện Security/giờ, mỗi sự kiện ~508 byte, log 20 MB, ghi đè khi cần. Bạn điều tra lùi được bao xa?',
        options: [
          'About 90 days|||Khoảng 90 ngày',
          'Forever, old events are archived automatically|||Mãi mãi, sự kiện cũ tự được lưu trữ',
          'About 21 hours|||Khoảng 21 giờ',
          'Exactly 7 days, Windows keeps a week by default|||Đúng 7 ngày, Windows mặc định giữ một tuần',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Lesson 3.5: security_big_sample.evtx — 62 031 events in 31.9 h, 30.1 MB ⇒ 20 MB ≈ 21.2 h; 78 % was WFP noise (5156/5152/5158/5157).|||VI: Bài 3.5: security_big_sample.evtx — 62 031 sự kiện trong 31,9 giờ, 30,1 MB ⇒ 20 MB ≈ 21,2 giờ; 78 % là nhiễu WFP (5156/5152/5158/5157).',
      },
      {
        question: 'The header of an RDP Operational log says "first chunk 10, last chunk 9, next record #308 335", but the file holds 1 795 records. Conclusion?|||Tiêu đề log RDP Operational ghi "chunk đầu 10, chunk cuối 9, bản ghi kế #308 335", nhưng tệp chỉ có 1 795 bản ghi. Kết luận?',
        options: [
          'The file is corrupted beyond repair|||Tệp hỏng không cứu được',
          'An attacker cleared the log|||Kẻ tấn công đã xoá log',
          'The log is in Retain mode and full|||Log đang ở chế độ Retain và đã đầy',
          'The circular log wrapped around: more than 300 000 older events were overwritten|||Log vòng đã quay vòng: hơn 300 000 sự kiện cũ đã bị ghi đè',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Lesson 3.5: newest chunk before oldest = Circular mode at work. Clearing would leave 1102/104 and restart numbering; Retain would set the FULL flag.|||VI: Bài 3.5: chunk mới nằm trước chunk cũ = chế độ Circular đang chạy. Xoá log sẽ để lại 1102/104 và đánh số lại; Retain sẽ bật cờ FULL.',
      },
      {
        question: 'Event 1000: application adberdr813.exe, module msvcrt.dll, exception code c0000005. What is c0000005?|||Event 1000: ứng dụng adberdr813.exe, module msvcrt.dll, mã ngoại lệ c0000005. c0000005 là gì?',
        options: [
          'Access violation — reading/writing an invalid memory address|||Access violation — đọc/ghi một địa chỉ bộ nhớ không hợp lệ',
          'The application was blocked by Defender|||Ứng dụng bị Defender chặn',
          'Unhandled .NET exception|||Ngoại lệ .NET không ai bắt',
          'The module msvcrt.dll is missing|||Thiếu module msvcrt.dll',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Lesson 3.6: .NET unhandled exceptions are e0434352 (with Event 1026); the faulting module is where it died, rarely the culprit.|||VI: Bài 3.6: ngoại lệ .NET không ai bắt là e0434352 (kèm Event 1026); module lỗi là nơi chương trình chết, hiếm khi là thủ phạm.',
      },
      {
        question: 'Which sequence in the System log is a clean shutdown followed by a boot?|||Chuỗi nào trong log System là một lần tắt sạch rồi khởi động?',
        options: [
          '41 → 6008 → 6005|||41 → 6008 → 6005',
          '1074 → 6006 → 13 … 12 → 6005 → 6013|||1074 → 6006 → 13 … 12 → 6005 → 6013',
          '6005 → 1074 → 41|||6005 → 1074 → 41',
          '7036 → 7045 → 6006|||7036 → 7045 → 6006',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Lab 3: every restart on 18/08/2016 shows 1074 (Explorer/rundll32) + 1074 (winlogon) → 6006 → 13, then 12 → 6005.|||VI: Lab 3: mọi lần khởi động lại ngày 18/8/2016 đều có 1074 (Explorer/rundll32) + 1074 (winlogon) → 6006 → 13, rồi 12 → 6005.',
      },
      {
        question: 'A boot event 6005 has record 5004, while events earlier the same day have records 5107–5870, and no 6006 precedes it. Most likely?|||Một sự kiện khởi động 6005 có bản ghi 5004, trong khi các sự kiện sớm hơn cùng ngày mang số 5107–5870, và không có 6006 nào trước nó. Khả năng cao nhất?',
        options: [
          'The clock was changed (4616)|||Đồng hồ bị đổi (4616)',
          'Windows Update installed a patch|||Windows Update đã cài một bản vá',
          'The VM (or disk) was restored to an older snapshot, so the log file went back in time|||Máy ảo (hoặc ổ đĩa) được khôi phục về snapshot cũ, nên tệp log quay về quá khứ',
          'A blue screen; 1001 BugCheck will follow|||Màn hình xanh; sẽ có 1001 BugCheck theo sau',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Lab 3: record numbers only go up inside a log; going backwards means the file itself was replaced by an older copy. A blue screen would leave 41 and 6008/1001.|||VI: Lab 3: số bản ghi trong một log chỉ tăng; đi lùi nghĩa là chính tệp bị thay bằng bản cũ. Màn hình xanh sẽ để lại 41 và 6008/1001.',
      },
    ],
  },
};
