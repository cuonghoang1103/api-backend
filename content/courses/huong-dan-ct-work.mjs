/**
 * Hướng dẫn CT Work — khoá học CuongThai (Courses, academyType=GENERAL, KHÔNG thuộc kỳ Academy).
 * 12 bài = 12 tập video "Hướng dẫn CT Work từ cơ bản tới nâng cao" (dự án ~/Documents/video-bai-giang,
 * src/bai/ctw-NN-*), 5 phần theo VAI người dùng: thành viên · nhóm trưởng · giảng viên · khách hàng · nâng cao.
 * slug bài = `slugWeb` của tập (ctw-01-bat-dau …) — đừng đổi: video map, bảng Trợ giúp
 * (frontend/src/components/work/help/videos.ts) và xuat/gan-web.mts đều khớp theo đúng slug này.
 *
 * Nội dung bài: tiếng Việt (giọng video là tiếng Việt), soạn từ lời thoại của từng tập. KHÔNG dùng khối
 * .ml-en/.ml-vi, nên trang học hiện cùng một bản ở cả hai ngôn ngữ giao diện — `course-content-check.mjs`
 * sẽ báo "ml-en=0 ml-vi=0" cho mọi bài, đó là CỐ Ý, không phải lỗi. Tiêu đề bài/phần vẫn song ngữ "EN|||VI".
 * Thân bài là HTML (trang học render HTML đã sanitize, KHÔNG render markdown) — chỉ dùng thẻ sanitizeHtml cho phép.
 *
 * Video: content/course-videos/huong-dan-ct-work.mjs (tsx xuat/gan-web.mts huong-dan-ct-work điền link R2).
 *
 * Kiểm trước khi seed:
 *   node scripts/course-seed.mjs --file ./content/courses/huong-dan-ct-work.mjs          (dry, cần DATABASE_URL)
 * Seed: tự chạy trong deploy (Step 3.12b của deploy.sh, deploy-nha.sh chạy lại khối đó).
 */

const WORK = 'https://cuongthai.com/work';
const li = (xs) => xs.map((x) => `<li>${x}</li>`).join('');

/** Dựng thân một bài. Mọi chuỗi là HTML nội dòng đã viết tay (không có < > & trần). */
function bai({ phan, tap, mo, hoc, y = [], buoc, meo, lam, tomTat, tiep }) {
  return [
    `<span class="eyebrow">${phan} · Tập ${tap}/12</span>`,
    `<p class="lead">${mo}</p>`,
    '<h3>🎯 Bạn sẽ học được</h3>',
    `<ul>${li(hoc)}</ul>`,
    ...(y.length ? ['<h3>🧭 Hiểu trước khi bấm</h3>', ...y.map((p) => `<p>${p}</p>`)] : []),
    '<h3>🛠️ Làm từng bước</h3>',
    ...buoc.map(([tieuDe, cac]) => `<h4>${tieuDe}</h4>\n<ol>${li(cac)}</ol>`),
    '<h3>💡 Mẹo &amp; chỗ hay vướng</h3>',
    `<ul>${li(meo)}</ul>`,
    `<div class="callout ok"><p><strong>🧪 Làm theo ngay trên CT Work</strong></p><ol>${li(lam)}</ol><p><a href="${WORK}" target="_blank" rel="noopener">Mở CT Work → cuongthai.com/work</a></p></div>`,
    '<h3>📌 Tóm tắt</h3>',
    `<ul>${li(tomTat)}</ul>`,
    tiep ? `<p><em>Tập sau:</em> ${tiep}</p>` : '',
  ].filter(Boolean).join('\n');
}

const P1 = 'Phần 1 · Người dùng mới &amp; thành viên';
const P2 = 'Phần 2 · Nhóm trưởng &amp; admin';
const P3 = 'Phần 3 · Giảng viên';
const P4 = 'Phần 4 · Khách hàng';
const P5 = 'Phần 5 · Nâng cao';

/* ───────────────────────────── Phần 1 ───────────────────────────── */

const s01 = {
  title: 'Part 1 — New users & team members|||Phần 1 — Người dùng mới & thành viên nhóm',
  description: 'Bốn tập cho mọi thành viên: CT Work là gì, tạo không gian và dự án đầu tiên, dùng Board mỗi ngày, mở một thẻ việc từ A tới Z, và làm việc nhóm bằng trò chuyện, Docs, cuộc họp.',
  lessons: [
    {
      title: 'What is CT Work? Your first workspace and project|||CT Work là gì? Tạo không gian và dự án đầu tiên',
      slug: 'ctw-01-bat-dau',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Ba tầng cần nhớ (không gian → dự án → thẻ việc), tạo không gian, tạo dự án từ mẫu đúng môn (SWP391, SWR302, SWT301, Capstone), đi một vòng thanh bên, và hai phím cứu cánh ⌘K và ?.',
      content: bai({
        phan: P1, tap: 1,
        mo: 'Tập mở đầu của loạt Hướng dẫn CT Work — 12 tập, đi từ người mới tới nhóm trưởng, giảng viên, khách hàng và cuối cùng là AI cùng các tích hợp. Hôm nay bắt đầu từ con số không: CT Work là gì, rồi tự tay tạo không gian và dự án đầu tiên của nhóm bạn.',
        hoc: [
          'CT Work là gì, và vì sao nó thay được mớ tin nhắn Zalo khi làm đồ án nhóm',
          'Ba tầng cần nhớ: <strong>không gian → dự án → thẻ việc</strong>',
          'Tạo không gian làm việc (workspace) và dự án từ mẫu đúng môn',
          'Đọc thanh bên ba nhóm và dải <strong>Bắt đầu</strong>',
          'Hai phím cứu cánh: <code>⌘K</code> / <code>Ctrl+K</code> và <code>?</code>',
        ],
        y: [
          'Lần làm đồ án nhóm gần nhất: việc giao trong nhóm Zalo, tin nhắn trôi mất, tới hạn không ai nhớ ai làm phần nào, giảng viên hỏi tiến độ thì cả nhóm lục tin cũ. CT Work thay mớ tin nhắn đó bằng một bảng việc rõ ràng: <strong>ai làm gì, tới đâu rồi, hạn khi nào</strong>.',
          'CT Work là công cụ quản lý dự án kiểu Jira (phần mềm quản lý công việc mà rất nhiều công ty phần mềm đang dùng) — nhưng miễn phí cho sinh viên, chạy ngay trên trình duyệt và có cả app cho máy tính.',
          '<strong>Không gian làm việc</strong> (workspace) là tầng ngoài cùng: mỗi nhóm, mỗi lớp hay mỗi công ty dùng một không gian. Trong không gian có nhiều <strong>dự án</strong> — ví dụ nhóm bạn vừa làm đồ án SWP391, vừa làm bài tập SWR302. Trong mỗi dự án là các <strong>thẻ việc</strong>: mỗi thẻ là một việc cụ thể, có người làm và hạn chót. Nhớ ba tầng này là đọc được mọi màn hình của CT Work.',
          'Trang không gian có ba ô ở góc trên phải (số dự án, số thẻ đang mở, vai trò của bạn), các thẻ dự án ở giữa, và thanh bên trái liệt kê dự án kèm mã viết tắt. Phía trên thanh bên là các mục chung của không gian như Khối lượng việc, AI agent, Thành viên và cài đặt — các tập sau mở dần từng mục.',
        ],
        buoc: [
          ['Tạo không gian mới', [
            'Vào trang <strong>Không gian làm việc</strong> (cuongthai.com/work).',
            'Bấm <strong>Không gian mới</strong> ở góc trên bên phải.',
            'Hộp thoại chỉ hỏi tên và mô tả — mô tả không bắt buộc, gõ tên nhóm là đủ. Bấm <strong>Tạo không gian</strong>.',
            'Bạn vào một không gian trống và là <strong>Chủ sở hữu</strong>: được mời người, tạo dự án và đổi mọi cài đặt.',
          ]],
          ['Tạo dự án từ mẫu', [
            'Bấm <strong>Dự án mới</strong>.',
            'Chọn loại dự án: Cá nhân, Nhóm phần mềm, Dự án khách hàng, hay <strong>Trường học và môn học</strong>. Sinh viên chọn loại cuối — nó bật sẵn sprint, kiểm thử và báo cáo cho giảng viên.',
            'Bấm <strong>Đổi mẫu</strong> để xem hết các mẫu dựng sẵn, chọn mẫu đúng môn: SWP391 cho đồ án, SWR302 cho yêu cầu phần mềm, SWT301 cho kiểm thử, Capstone cho đồ án tốt nghiệp.',
            'Gõ tên dự án. Ô <strong>Mã dự án</strong> tự điền theo tên (ví dụ <code>TMS</code>); mã này đứng đầu tên mọi thẻ: <code>TMS-1</code>, <code>TMS-2</code>…',
            'Bấm <strong>Tạo dự án</strong> — bạn có một board trống, sẵn sàng thêm việc. Mẫu đã tạo sẵn các cột, các loại thẻ và sprint đầu tiên; có mẫu còn tạo sẵn tài liệu phải nộp cho trường.',
          ]],
          ['Đi một vòng thanh bên', [
            'Nhóm <strong>Lập kế hoạch</strong>: Bảng (Board — nơi bạn mở mỗi ngày), Backlog (kho mọi việc chưa làm), Dòng thời gian.',
            'Nhóm <strong>Công việc</strong>: Thẻ, Trò chuyện, Docs, Sơ đồ.',
            'Kéo xuống là nhóm <strong>Phân tích</strong>, nơi có các báo cáo.',
            'Dải <strong>Bắt đầu</strong> phía trên board là người dẫn đường: ghi bạn đã xong mấy bước thiết lập và bước tiếp theo là gì (bước "tạo link chỉ xem cho giảng viên" học ở tập 5).',
          ]],
          ['Hai phím cứu cánh', [
            'Nhấn <code>⌘K</code> (Mac) hoặc <code>Ctrl+K</code> (Windows) để mở ô tìm nhanh, chọn ví dụ <strong>Đi tới danh sách thẻ</strong> rồi nhấn Enter — trang Thẻ mở ngay.',
            'Nhấn <code>?</code> để mở bảng Trợ giúp đúng bài của trang đang xem (đang ở trang Thẻ thì mở bài về danh sách thẻ và bộ lọc).',
          ]],
        ],
        meo: [
          'Nút <strong>Không gian mới</strong> nằm ở trang Không gian làm việc, góc trên bên phải.',
          'Không thấy mẫu môn của mình? Chọn loại <strong>Trường học và môn học</strong> trước, rồi bấm <strong>Đổi mẫu</strong>.',
          'Trong ô tìm nhanh cứ gõ chữ <code>backlog</code> là thấy lối đi.',
          'Lạc ở đâu thì nhấn <code>?</code>.',
        ],
        lam: [
          'Vào cuongthai.com, mở CT Work và tạo một không gian mang tên nhóm của bạn.',
          'Tạo một dự án từ mẫu đúng môn bạn đang học, xem mã dự án được tự điền là gì.',
          'Nhấn <code>⌘K</code> / <code>Ctrl+K</code> để nhảy sang Backlog, rồi nhấn <code>?</code> để đọc bài trợ giúp của trang đó.',
        ],
        tomTat: [
          'CT Work là công cụ quản lý việc kiểu Jira, miễn phí cho sinh viên.',
          'Ba tầng: không gian chứa dự án, dự án chứa các thẻ việc.',
          'Tạo dự án thì chọn mẫu đúng môn; mã dự án đứng đầu tên mọi thẻ.',
          'Thanh bên có ba nhóm Lập kế hoạch · Công việc · Phân tích. Bị lạc: <code>⌘K</code> hoặc <code>?</code>.',
        ],
        tiep: 'dùng Board mỗi ngày — kéo thẻ, lọc thẻ, và đọc từng chi tiết trên một thẻ.',
      }),
    },
    {
      title: 'The Board every day: drag, filter, swimlanes|||Dùng Board mỗi ngày: kéo thẻ, lọc, nhóm theo người và epic',
      slug: 'ctw-02-board-hang-ngay',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Board là bảng giấy nhớ của nhóm: đọc một thẻ (nhãn, mã, hạn, điểm, ưu tiên, người làm), chip "⏳ Chờ" khi bị thẻ khác chặn, kéo thẻ qua các cột, lọc nhanh và nhóm theo người, epic, việc con.',
      content: bai({
        phan: P1, tap: 2,
        mo: 'Tập trước bạn đã hiểu ba tầng và tạo dự án đầu tiên từ mẫu. Hôm nay mở chỗ bạn sẽ ghé mỗi ngày: <strong>Board</strong>, tức bảng việc của nhóm.',
        hoc: [
          'Board là gì (cách làm Kanban) và mỗi cột nghĩa là gì',
          'Đọc một thẻ: nhãn, mã, hạn chót, điểm, ưu tiên, người làm, việc con',
          'Hiểu chip <strong>⏳ Chờ …</strong> — thẻ đang bị thẻ khác chặn',
          'Kéo thẻ đúng quy ước của nhóm',
          'Lọc nhanh và <strong>Nhóm theo</strong> người thực hiện, epic, việc con',
        ],
        y: [
          'Hình dung một tấm bảng trắng dán đầy giấy nhớ, chia thành các cột Cần làm · Đang làm · Xong. Mỗi tờ giấy là một việc; làm tới đâu dời tờ giấy sang phải tới đó, nhìn bảng là biết cả nhóm đang ở đâu. Cách làm này tên là <strong>Kanban</strong> — Board của CT Work chính là tấm bảng đó, nhưng nằm trên mạng để cả nhóm cùng thấy.',
          'Board trong video là của Sprint 2 (sprint = một đợt làm việc ngắn, thường 1–2 tuần, học kỹ ở tập 6), với bốn cột: Cần làm, Đang làm, <strong>Đang review</strong> (chờ người khác kiểm tra) và Hoàn thành.',
        ],
        buoc: [
          ['Đọc một thẻ', [
            'Dòng trên cùng là tiêu đề việc.',
            'Nhãn màu (ví dụ <code>frontend</code>) cho biết việc thuộc mảng nào.',
            'Mã thẻ (ví dụ <code>NHOM-10</code>) — nhắn cho bạn cùng nhóm cứ gọi bằng mã này cho khỏi nhầm.',
            'Hạn chót: chuyển màu <strong>đỏ</strong> là đã quá hạn.',
            'Số điểm là độ khó ước lượng; mũi tên nhỏ là độ ưu tiên; ảnh tròn cuối dòng là người đang làm.',
            'Dòng "3 việc con · 1/3" nghĩa là thẻ được chia làm ba việc nhỏ và mới xong một.',
          ]],
          ['Hiểu chip ⏳ Chờ', [
            'Chip cam có đồng hồ cát, ví dụ <strong>Chờ NHOM-14</strong>, nghĩa là thẻ này đang bị NHOM-14 chặn (phải có API tìm phòng trước mới làm được phần đặt chỗ).',
            'Các thẻ có thể nối thành chuỗi: NHOM-16 chờ NHOM-15, NHOM-15 chờ NHOM-14.',
            'Thẻ phía trước xong thì chip tự biến mất — không cần xoá tay. Mở Board là thấy ngay ai đang chờ ai, nên dồn sức vào việc nào trước.',
          ]],
          ['Kéo thẻ', [
            'Bắt tay vào làm: nắm thẻ, kéo sang <strong>Đang làm</strong>, thả ra — cả nhóm thấy ngay.',
            'Mở Pull Request (gửi code nhờ người khác xem): kéo sang <strong>Đang review</strong>.',
            'Người kiểm tra thấy ổn thì kéo sang <strong>Hoàn thành</strong>. Đừng tự kéo việc của mình sang Hoàn thành khi chưa ai xem.',
          ]],
          ['Lọc nhanh', [
            'Bấm <strong>Chỉ thẻ của tôi</strong> để chỉ còn việc giao cho bạn (bấm lần nữa để tắt).',
            'Phần <strong>Lọc nhanh</strong>: Mới cập nhật, Hạn trong tuần, Chưa giao.',
            'Nút <strong>Nhãn</strong> lọc theo mảng (ví dụ chỉ <code>backend</code>).',
            'Ô <strong>Tìm trên board</strong> ở góc trái: gõ một chữ trong tiêu đề là lọc ngay.',
          ]],
          ['Nhóm theo', [
            'Bấm <strong>Nhóm theo</strong> để chia Board thành các làn ngang.',
            '<strong>Người thực hiện</strong>: mỗi người một làn — trưởng nhóm thấy ngay ai đang ôm quá nhiều việc.',
            '<strong>Epic</strong>: mỗi epic một làn (epic = một mảng tính năng lớn gồm nhiều thẻ nhỏ, ví dụ "Tìm và đặt phòng tự học").',
            '<strong>Việc con</strong>: mỗi thẻ cha một làn, các việc con thành thẻ riêng để kéo từng cái.',
            'Muốn về như cũ: chọn <strong>Không nhóm</strong>.',
          ]],
        ],
        meo: [
          'Thẻ mới chưa giao cho ai thì <strong>Chỉ thẻ của tôi</strong> sẽ không thấy — mở thẻ, giao cho chính bạn, rồi lọc lại.',
          'Kéo thẻ mà không ăn: nắm vào phần tiêu đề của thẻ, kéo hẳn sang cột bên cạnh rồi mới thả.',
        ],
        lam: [
          'Mở Board của dự án bạn tạo ở tập 1, tạo hai thẻ bằng nút <strong>Tạo thẻ</strong> ở cuối cột, rồi kéo một thẻ sang Đang làm.',
          'Bấm <strong>Chỉ thẻ của tôi</strong>, rồi bấm <strong>Hạn trong tuần</strong>, xem Board còn lại những gì.',
          'Đổi <strong>Nhóm theo</strong> sang Người thực hiện, rồi đổi về Không nhóm.',
        ],
        tomTat: [
          'Board là bảng giấy nhớ của nhóm: mỗi cột là một trạng thái, mỗi thẻ là một việc.',
          'Một thẻ cho biết nhãn, mã, hạn chót, điểm, ưu tiên và người làm; hạn đỏ là quá hạn.',
          'Chip ⏳ Chờ là thẻ đang bị thẻ khác chặn.',
          'Làm tới đâu kéo thẻ tới đó; lọc bằng Chỉ thẻ của tôi, Lọc nhanh, Nhãn; xem theo làn bằng Nhóm theo.',
        ],
        tiep: 'mở hẳn một thẻ ra xem từ A tới Z — mô tả, việc con, liên kết chặn, bình luận và ghi giờ.',
      }),
    },
    {
      title: 'One issue from A to Z|||Một thẻ việc từ A tới Z: mô tả, việc con, liên kết, bình luận, ghi giờ',
      slug: 'ctw-03-the-viec-chi-tiet',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Viết mô tả theo mẫu user story kèm tiêu chí chấp nhận, đọc cột Chi tiết, chia việc con, nối liên kết chặn, bình luận nhắc tên bằng @, đính kèm tệp, ghi giờ (log work) và đọc tab Lịch sử.',
      content: bai({
        phan: P1, tap: 3,
        mo: 'Tập trước bạn đọc thẻ từ bên ngoài trên Board. Hôm nay bấm mở hẳn một thẻ ra, xem bên trong có gì và dùng hết từng phần từ A tới Z.',
        hoc: [
          'Một thẻ tốt trả lời năm câu: làm gì, vì sao, thế nào là xong, ai làm, khi nào xong',
          'Viết mô tả theo mẫu <strong>user story</strong> kèm <strong>tiêu chí chấp nhận</strong>',
          'Chia việc con và nối <strong>liên kết chặn</strong>',
          'Bình luận có nhắc tên bằng <code>@</code>, đính kèm tệp',
          'Ghi giờ (log work) và đọc tab Lịch sử',
        ],
        y: [
          'Một thẻ chỉ ghi "Làm trang" thì mỗi người hiểu một kiểu, tới hạn mới phát hiện làm sai và cả nhóm làm lại. Bên trong mỗi thẻ CT Work có chỗ cho đủ năm câu: làm gì, vì sao, thế nào là xong, ai làm, khi nào xong.',
        ],
        buoc: [
          ['Mô tả và chi tiết', [
            'Trên Board, bấm vào một thẻ — bảng chi tiết trượt ra từ bên phải.',
            'Phần <strong>Mô tả</strong> viết theo mẫu user story (câu chuyện người dùng): <em>Là ai, tôi muốn gì, để làm gì</em>. Ví dụ: "Là sinh viên, tôi muốn xem các phòng còn trống theo khung giờ, để chọn nhanh một phòng phù hợp."',
            'Ngay dưới là <strong>Tiêu chí chấp nhận</strong>: danh sách những điều phải đúng mới tính là xong (lọc theo tầng, phòng kín hiện mờ, dùng tốt trên điện thoại…).',
            'Cột phải <strong>Chi tiết</strong>: Người thực hiện (ai làm), Độ ưu tiên (gấp tới đâu), Nhãn (mảng nào); nhóm Kế hoạch có Epic, Sprint, số điểm, ngày bắt đầu và hạn chót.',
            'Phím tắt ở cuối cột: <code>A</code> giao người, <code>S</code> đổi trạng thái, <code>D</code> đặt hạn chót.',
          ]],
          ['Chia việc con', [
            'Kéo xuống mục <strong>Việc con</strong>, bấm ô <strong>Thêm việc con</strong>.',
            'Gõ tên việc (ví dụ "Ảnh phòng tải chậm trên 3G") rồi nhấn Enter — việc con hiện ngay với mã riêng (ví dụ <code>NHOM-25</code>), có người làm và trạng thái riêng.',
            'Thanh tiến độ của thẻ cha tự cộng dồn (1/3 thành 1/4 = 25%).',
          ]],
          ['Liên kết chặn', [
            'Mở thẻ rồi bấm tab <strong>Liên kết</strong>.',
            '<strong>Chặn</strong> NHOM-16: phải xong thẻ này thì NHOM-16 mới làm được.',
            '<strong>Bị chặn bởi</strong> NHOM-14: thẻ này phải chờ NHOM-14 xong trước.',
            '<strong>Liên quan tới</strong>: chỉ là có dính dáng, không bắt ai chờ ai.',
            'Liên kết chặn sinh ra chip ⏳ Chờ trên Board (tập 2) và mũi tên phụ thuộc trên Dòng thời gian (tập 6).',
          ]],
          ['Bình luận và nhắc tên', [
            'Trao đổi về một việc thì bình luận ngay trên thẻ (đừng nhắn riêng) để sau này ai mở thẻ cũng đọc được.',
            'Bấm tab <strong>Bình luận</strong>, gõ nội dung rồi gõ <code>@</code> — danh sách thành viên hiện ra; gõ vài chữ đầu của tên, nhấn Enter để chọn. Người được nhắc nhận thông báo.',
            'Gõ nốt câu, bấm <strong>Bình luận</strong>. Tên được nhắc hiện thành nhãn màu tím.',
            'Ảnh chụp lỗi thì kéo thả vào mục <strong>Tệp đính kèm</strong> (mỗi tệp tối đa 25 MB).',
          ]],
          ['Ghi giờ và lịch sử', [
            'Làm xong một buổi, bấm <strong>Ghi giờ</strong> (log work) ở cột phải.',
            'Ô <strong>Thời gian làm</strong> gõ kiểu <code>2h 30m</code>; chọn <strong>Hoạt động</strong> (ví dụ Coding) và ghi vài chữ đã làm gì.',
            'Báo cáo Đóng góp và báo cáo thời gian cho giảng viên đều lấy số từ đây — ghi đều tay thì cuối kỳ khỏi phải nhớ lại.',
            'Tab <strong>Nhật ký giờ</strong> liệt kê mọi lần đã ghi; tab <strong>Lịch sử</strong> ghi mọi thay đổi trên thẻ (ai đổi gì, lúc nào) — có tranh cãi thì mở ra là rõ.',
          ]],
        ],
        meo: [
          'Gõ <code>@</code> mà không ra ai: bạn đó chưa vào dự án — tập 5 chỉ cách mời.',
          'Thời gian phải có chữ <code>h</code> và <code>m</code> (như <code>1h</code>, <code>30m</code>), đừng gõ mỗi con số.',
        ],
        lam: [
          'Mở một thẻ trong dự án của bạn, viết mô tả theo mẫu "Là ai, tôi muốn, để" kèm ba tiêu chí chấp nhận.',
          'Thêm hai việc con và xem thanh tiến độ của thẻ cha.',
          'Bình luận và nhắc tên một bạn cùng nhóm bằng <code>@</code>.',
          'Ghi một giờ làm việc, rồi mở tab Lịch sử xem nó ghi lại những gì.',
        ],
        tomTat: [
          'Mô tả viết theo mẫu "Là ai, tôi muốn, để", kèm tiêu chí chấp nhận.',
          'Cột Chi tiết cho biết ai làm, gấp tới đâu, thuộc epic và sprint nào, hạn khi nào.',
          'Việc lớn thì chia việc con; thứ tự làm thì nối bằng liên kết chặn.',
          'Trao đổi bằng bình luận có nhắc tên, và ghi giờ sau mỗi buổi làm.',
        ],
        tiep: 'làm việc nhóm ngay trong CT Work — trò chuyện theo kênh, đọc tài liệu Docs, và đi họp.',
      }),
    },
    {
      title: 'Teamwork: chat, docs and meetings|||Làm việc nhóm: trò chuyện, Docs và đi họp ngay trong CT Work',
      slug: 'ctw-04-tro-chuyen-docs-hop',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Kênh trò chuyện và luồng trả lời, gửi tin, gọi video Jitsi, đọc Docs chung của nhóm, trả lời lời mời họp và vào họp để được điểm danh — kèm mẹo "chuyện gì để ở đâu".',
      content: bai({
        phan: P1, tap: 4,
        mo: 'Tập cuối của phần dành cho thành viên. Tập trước bạn làm việc trên từng thẻ; hôm nay làm việc với cả nhóm: trò chuyện, đọc tài liệu chung, và đi họp — tất cả ngay trong dự án, cạnh các thẻ việc.',
        hoc: [
          'Kênh trò chuyện và quy tắc vàng "trả lời trong luồng"',
          'Gửi tin, đính kèm, ghi âm, gọi video nhanh',
          'Đọc và cùng sửa Docs của nhóm',
          'Trả lời lời mời họp và vào họp để được điểm danh',
          'Chuyện gì nên để ở đâu: thẻ · trò chuyện · Docs · cuộc họp',
        ],
        y: [
          'Một nhóm đồ án thường dùng tới năm chỗ: Zalo để nhắn, Google Docs để viết, Meet để họp, Excel để chia việc… Tìm một quyết định cũ là phải lục cả năm chỗ. Trong CT Work, trò chuyện, tài liệu và cuộc họp nằm ngay trong dự án.',
        ],
        buoc: [
          ['Kênh trò chuyện', [
            'Mở mục <strong>Trò chuyện</strong> ở thanh bên. Cột trái là danh sách kênh, mỗi kênh một chủ đề (ví dụ <code>general</code>, <code>backend</code>, <code>frontend</code>, <code>hoi-dap</code>).',
            'Mở kênh hỏi đáp, bấm dòng "1 trả lời" dưới một câu hỏi — khung <strong>Luồng trả lời</strong> mở bên phải.',
            'Quy tắc vàng: trả lời ngay trong luồng của câu hỏi, đừng trả lời ra kênh chính — kênh gọn, mỗi câu hỏi có đủ lời giải đi kèm.',
          ]],
          ['Gửi tin và gọi', [
            'Bấm ô nhắn tin dưới cùng, gõ nội dung, nhấn Enter là gửi.',
            'Ba nút nhỏ dưới ô nhắn: kẹp giấy (đính kèm tệp), micro (ghi âm), mặt cười (biểu tượng cảm xúc).',
            'Nút <strong>Gọi</strong> ở góc trên mở phòng gọi video Jitsi miễn phí cho cả nhóm, không cần cài gì.',
          ]],
          ['Đọc Docs', [
            'Mở <strong>Docs</strong> — nơi để thứ cần đọc lại nhiều lần: quy ước nhóm, đặc tả yêu cầu, biên bản họp.',
            'Cột trái là danh sách trang (ví dụ Đọc đầu tiên, Đặc tả yêu cầu, Giao diện chính).',
            'Trang <strong>Đọc đầu tiên</strong> ghi quy ước làm việc của nhóm: mỗi ngày làm gì, mỗi tuần họp hôm nào, thế nào thì tính là xong. Thành viên mới vào nhóm, việc đầu tiên là đọc trang này.',
            'Docs viết giống Word (tiêu đề, danh sách, bảng) nhưng cả nhóm cùng sửa một bản — hết cảnh gửi qua lại tệp "bản cuối, bản cuối thật".',
          ]],
          ['Đi họp', [
            'Mở mục <strong>Cuộc họp</strong>, tab <strong>Sắp tới</strong>, bấm vào buổi họp.',
            'Trang cuộc họp ghi giờ họp, có nút vào phòng họp (Jitsi, Google Meet hoặc Teams) và mục <strong>Chương trình</strong> (agenda) để bạn chuẩn bị trước.',
            'Ở câu "Bạn có tham dự không", bấm <strong>Có</strong>, <strong>Có thể</strong> hoặc <strong>Không</strong> để trưởng nhóm biết ai sẽ tới.',
            'Tới giờ, bấm <strong>Vào họp</strong> từ CT Work — bạn được điểm danh có mặt luôn; vào muộn quá 5 phút bị ghi là đến muộn.',
          ]],
        ],
        meo: [
          'Chuyện về đúng một việc ("lỗi này sửa chưa") → bình luận trên thẻ đó.',
          'Chuyện nhanh, hỏi xong là thôi ("ai rảnh review giúp mình") → nhắn trong kênh Trò chuyện.',
          'Chuyện cần đọc lại nhiều lần (quy ước, đặc tả, kết luận) → viết vào Docs.',
          'Chuyện cần cả nhóm ngồi lại để chốt → đặt cuộc họp và ghi quyết định vào biên bản.',
          'Nút trả lời trong luồng hiện ra khi rê chuột lên một tin nhắn (biểu tượng khung chat nhỏ).',
        ],
        lam: [
          'Vào Trò chuyện, gửi một tin vào kênh <code>general</code>, rồi trả lời một tin trong luồng của nó.',
          'Mở Docs, tạo trang "Quy ước nhóm" với ba dòng: họp hôm nào, hỏi ở đâu, thế nào là xong.',
          'Mở một cuộc họp sắp tới và trả lời Có hoặc Không (chưa có cuộc họp nào thì để đó — tập 7 học cách lên lịch).',
        ],
        tomTat: [
          'Trò chuyện chia theo kênh; hỏi đáp thì trả lời trong luồng.',
          'Gửi tin bằng Enter, đính kèm tệp, ghi âm, bấm Gọi để họp nhanh bằng video.',
          'Docs là tài liệu chung cả nhóm cùng sửa; trang Đọc đầu tiên dành cho quy ước nhóm.',
          'Cuộc họp: trả lời Có hay Không, rồi vào họp từ CT Work để được điểm danh.',
        ],
        tiep: 'phần dành cho nhóm trưởng — mời thành viên vào nhóm, hiểu các vai trò và quyền hạn.',
      }),
    },
  ],
};

/* ───────────────────────────── Phần 2 ───────────────────────────── */

const s02 = {
  title: 'Part 2 — Team leads & project admins|||Phần 2 — Nhóm trưởng & admin dự án',
  description: 'Bốn tập cho nhóm trưởng: mời thành viên và phát quyền, lập kế hoạch bằng Backlog/Sprint/Dòng thời gian/JQL, tài liệu từ mẫu + phê duyệt + sơ đồ Mermaid + biên bản họp thành thẻ, và đọc báo cáo tiến độ, đóng góp, khối lượng việc.',
  lessons: [
    {
      title: 'Team lead: invites, roles and permissions|||Nhóm trưởng: mời thành viên, vai trò và quyền hạn',
      slug: 'ctw-05-moi-nhom-phan-quyen',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Mời bằng email hoặc link mời có số lượt và hạn, bốn vai trò không gian, năm vai trò dự án, quản lý nhãn, và tạo link công khai chỉ xem cho giảng viên.',
      content: bai({
        phan: P2, tap: 5,
        mo: 'Mở đầu phần dành cho nhóm trưởng. Hôm nay bạn đưa cả nhóm vào không gian và quyết định ai được làm gì.',
        hoc: [
          'Mời thành viên bằng email hoặc bằng link mời',
          'Bốn vai trò của không gian và năm vai trò của dự án',
          'Đổi vai trò, quản lý nhãn dùng chung',
          'Tạo link công khai chỉ xem cho giảng viên — và thu hồi khi hết dùng',
        ],
        y: [
          'Hình dung không gian làm việc như một căn nhà, các dự án là các phòng. Chủ nhà giữ chìa khoá tổng, người quản lý sắp xếp mọi phòng, thành viên vào phòng được giao để làm việc, còn khách chỉ được dẫn vào đúng phòng khách. Vai trò trong CT Work chính là những chiếc chìa khoá đó: phát đúng chìa thì nhóm làm trơn tru mà không ai lỡ tay xoá mất dữ liệu.',
        ],
        buoc: [
          ['Mời bằng email', [
            'Vào <strong>Thành viên và cài đặt</strong> của không gian, chọn mục <strong>Lời mời</strong> → phần <strong>Mời qua email</strong>.',
            'Ô Địa chỉ email nhận nhiều địa chỉ cùng lúc, cách nhau bằng dấu phẩy hoặc xuống dòng — dán cả danh sách nhóm một lần.',
            'Chọn <strong>Vai trò trong không gian</strong> (thường là Thành viên). Muốn đưa thẳng vào một dự án thì chọn ở ô <strong>Thêm vào dự án</strong> kèm vai trò dự án (không bắt buộc).',
            'Bấm <strong>Gửi lời mời</strong>. Người đã có tài khoản được thêm ngay; người chưa có nhận email kèm link, hết hạn sau 7 ngày.',
          ]],
          ['Link mời cho cả lớp', [
            'Ngay bên dưới là <strong>Link mời</strong>: đặt <strong>Số lượt tối đa</strong> (ví dụ 30) và <strong>Hết hạn sau</strong> (ví dụ 7 ngày), bấm <strong>Tạo link mời</strong>.',
            'Bấm <strong>Chép</strong> rồi dán vào nhóm chat của lớp — ai bấm link là vào được không gian.',
            'Link chỉ hiện <strong>đúng một lần</strong>, nên chép ngay; ai có link cũng vào được, nên đừng dán ở chỗ công khai.',
            'Bảng <strong>Lời mời đang chờ</strong> phía dưới: đủ người rồi thì bấm <strong>Thu hồi</strong> để khoá link.',
          ]],
          ['Bốn vai trò không gian', [
            'Mở tab <strong>Thành viên</strong> của không gian.',
            '<strong>Chủ sở hữu</strong>: người tạo, toàn quyền, kể cả xoá không gian. <strong>Quản trị</strong>: quản lý thành viên và mọi dự án. <strong>Thành viên</strong>: làm việc trong các dự án được chia sẻ cho mình. <strong>Khách</strong>: chỉ thấy đúng dự án được thêm vào (giảng viên, khách hàng).',
            'Mục <strong>AI agent</strong> bên dưới là các trợ lý AI cũng là thành viên nhóm (tập 11); cuối trang có <strong>Chuyển quyền sở hữu</strong> khi nhóm trưởng đổi người.',
          ]],
          ['Vai trò dự án và nhãn', [
            'Vào <strong>Cài đặt dự án</strong> → mục <strong>Thành viên</strong> — mỗi dự án có chìa riêng.',
            'Năm vai trò dự án: <strong>Quản trị</strong> (cấu hình tất cả), <strong>Thành viên</strong> (tạo, sửa, chuyển thẻ), <strong>Người xem</strong> (chỉ đọc), <strong>Giảng viên</strong> (đọc, bình luận, duyệt — không tạo thẻ), <strong>Khách hàng</strong> (chỉ thấy cổng khách, tập 10).',
            'Đổi vai trò: bấm ô vai trò ở cột cuối của người đó và chọn lại.',
            'Cùng trong Cài đặt dự án, mục <strong>Nhãn</strong>: thêm nhãn mới, đặt màu, đổi tên nhãn cho cả nhóm dùng chung.',
          ]],
          ['Link công khai cho giảng viên', [
            'Đây là bước còn thiếu của dải Bắt đầu ở tập 1. Vào <strong>Cài đặt dự án</strong> → <strong>Link công khai</strong> — người ngoài xem dự án ở chế độ chỉ đọc, không cần tài khoản.',
            'Bấm <strong>Tạo link</strong>, đặt nhãn (ví dụ "Giảng viên review"), tích các phần được chia sẻ: Board, Backlog, Báo cáo, Kiểm thử.',
            'Chọn thời hạn (mặc định 30 ngày), bấm <strong>Tạo link</strong> và gửi cho thầy cô.',
            'Bình luận, tệp đính kèm và email của thành viên <strong>không bao giờ</strong> bị chia sẻ qua link này. Hết dùng thì thu hồi.',
          ]],
        ],
        meo: [
          'Bạn ấy bấm link mà phải đăng nhập trước: do chưa có tài khoản cuongthai.com — đăng ký xong bấm lại link là vào.',
          'Không đổi được vai trò: kiểm tra xem bạn có đang là <strong>Quản trị</strong> của dự án đó không.',
        ],
        lam: [
          'Tạo một link mời 10 lượt, hết hạn sau 3 ngày, gửi cho một bạn cùng nhóm.',
          'Khi bạn ấy vào rồi, mở Cài đặt dự án, đổi vai trò của bạn ấy thành Người xem, rồi đổi lại Thành viên.',
          'Thêm một nhãn mới tên <code>cần-thiết-kế</code> với màu tuỳ thích.',
        ],
        tomTat: [
          'Mời bằng email cho từng người, hoặc tạo link mời có số lượt và thời hạn cho cả lớp.',
          'Không gian có bốn vai trò: Chủ sở hữu, Quản trị, Thành viên, Khách.',
          'Dự án có năm vai trò: Quản trị, Thành viên, Người xem, Giảng viên, Khách hàng.',
          'Nhãn đặt ở Cài đặt dự án; link công khai chỉ đọc dành cho giảng viên, nhớ thu hồi khi hết dùng.',
        ],
        tiep: 'lập kế hoạch cho cả nhóm — Backlog, Sprint, Dòng thời gian và danh sách thẻ.',
      }),
    },
    {
      title: 'Planning: backlog, sprints, timeline and issue list|||Lập kế hoạch: Backlog, Sprint, Dòng thời gian và danh sách thẻ',
      slug: 'ctw-06-backlog-sprint-timeline',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Scrum trong một phút, trang Backlog và epic, kéo thẻ vào sprint, bắt đầu/kết thúc sprint, Dòng thời gian (Gantt) với mũi tên phụ thuộc và đường găng, lọc danh sách thẻ bằng JQL và xuất CSV/Excel/PDF.',
      content: bai({
        phan: P2, tap: 6,
        mo: 'Có người rồi, giờ là lúc lập kế hoạch: việc gì làm trước, làm trong đợt nào, và khi nào xong.',
        hoc: [
          'Backlog và Sprint là gì (cách làm Scrum)',
          'Đọc trang Backlog, lọc theo epic',
          'Tạo thẻ và kéo vào sprint; bắt đầu và kết thúc sprint',
          'Đọc Dòng thời gian: thanh ngang, mũi tên phụ thuộc, đường găng, xung đột lịch',
          'Lọc danh sách thẻ bằng JQL và xuất CSV, Excel, PDF',
        ],
        y: [
          'Đồ án mười tuần mà chỉ có một hạn nộp cuối kỳ thì tuần chín cả nhóm mới cuống cuồng bắt đầu. Các công ty phần mềm chia nhỏ thời gian theo cách gọi là <strong>Scrum</strong>: mọi việc đổ vào một cái kho tên là <strong>Backlog</strong>; cứ 1–2 tuần nhóm bốc một ít việc ra làm cho xong — mỗi đợt là một <strong>Sprint</strong> (chặng chạy nước rút). Hết chặng, xem lại đã xong gì rồi bốc tiếp. Mười tuần thành năm chặng nhỏ, chặng nào cũng có thứ để nộp.',
        ],
        buoc: [
          ['Đọc trang Backlog', [
            'Mở <strong>Backlog</strong> ở thanh bên. Trang xếp từ trên xuống: các sprint, rồi kho Backlog ở cuối.',
            'Sprint đang chạy ghi khoảng ngày, số thẻ và tổng điểm; dòng nhỏ dưới tên sprint là <strong>mục tiêu sprint</strong> — chặng này xong thì người dùng được gì.',
            'Sprint đã lên lịch nhưng chưa chạy nằm bên dưới; cuối cùng là Backlog — việc chưa xếp vào sprint nào.',
            'Cột trái là danh sách <strong>Epic</strong> kèm thanh tiến độ: bấm một epic là chỉ còn thẻ của mảng đó; bấm <strong>Mọi thẻ</strong> để xem lại tất cả.',
          ]],
          ['Tạo thẻ và kéo vào sprint', [
            'Ở cuối Backlog, bấm <strong>Tạo thẻ</strong>, gõ tiêu đề, nhấn Enter — thẻ mới nằm trong Backlog.',
            'Nắm thẻ, kéo lên khối sprint muốn làm (ví dụ Sprint 3), thả ra. Lập kế hoạch chính là kéo việc từ kho vào chặng.',
          ]],
          ['Bắt đầu và kết thúc sprint', [
            'Bên phải tên sprint có nút <strong>Bắt đầu sprint</strong>. Nút mờ khi đang có sprint khác chạy — một lúc chỉ chạy một sprint.',
            'Khi bấm được, nó hỏi ngày bắt đầu, ngày kết thúc và mục tiêu rồi mới chạy.',
            'Sprint đang chạy có nút <strong>Kết thúc sprint</strong>: hộp thoại đếm sẵn số thẻ đã xong, chưa xong.',
            'Thẻ chưa xong không mất: chọn chuyển sang sprint sau, hoặc trả về Backlog (việc con chưa xong cũng đi theo).',
          ]],
          ['Dòng thời gian', [
            'Mở <strong>Dòng thời gian</strong> (Timeline, biểu đồ Gantt): mỗi thẻ là một thanh ngang từ ngày bắt đầu tới hạn chót, gom theo epic.',
            'Đổi khung nhìn Ngày · Tuần · Tháng · Quý.',
            'Mũi tên nhỏ là <strong>liên kết chặn</strong> (tập 3): NHOM-14 xong mới tới NHOM-15, rồi NHOM-16.',
            'Viền cam là <strong>đường găng</strong>: chuỗi việc mà trễ một ngày là cả dự án trễ một ngày.',
            'Nút đỏ <strong>xung đột lịch</strong> báo có thẻ được xếp bắt đầu trước khi thẻ chặn nó xong — bấm vào để xem và dời lịch.',
          ]],
          ['Danh sách thẻ, JQL và Xuất', [
            'Trang <strong>Thẻ</strong>: mọi thẻ của dự án thành một bảng như bảng tính (trạng thái, ưu tiên, người làm, điểm, hạn chót).',
            'Bấm nút <strong>JQL</strong> (ngôn ngữ truy vấn kiểu Jira) và gõ điều kiện như một câu, ví dụ <code>assignee = currentUser() AND status != Done</code> — thẻ giao cho tôi và chưa Xong. Nhấn Enter.',
            'Nút <strong>Xuất</strong> xuất đúng danh sách đang lọc ra CSV (nhập vào công cụ khác), Excel (đủ mọi trường) hoặc PDF (in, nộp báo cáo).',
          ]],
        ],
        meo: [
          'Thẻ không hiện trên Dòng thời gian: nó chưa có ngày bắt đầu hoặc hạn chót — mở thẻ, đặt ngày là thấy.',
          'Câu JQL chép đúng từng chữ, kể cả dấu ngoặc tròn sau <code>currentUser</code>.',
        ],
        lam: [
          'Vào Backlog, tạo năm thẻ cho các việc của nhóm.',
          'Kéo ba thẻ vào sprint đầu tiên, bấm <strong>Bắt đầu sprint</strong>, chọn hai tuần và ghi một câu mục tiêu.',
          'Mở trang Thẻ, bật JQL, gõ câu lọc "việc của tôi chưa xong", rồi thử xuất ra Excel.',
        ],
        tomTat: [
          'Backlog là kho mọi việc; Sprint là một chặng 1–2 tuần có mục tiêu rõ ràng.',
          'Lập kế hoạch = tạo thẻ trong kho rồi kéo vào sprint; bắt đầu rồi kết thúc sprint, việc chưa xong chuyển sang chặng sau.',
          'Dòng thời gian vẽ thẻ theo ngày: mũi tên là liên kết chặn, viền cam là đường găng.',
          'Trang Thẻ lọc bằng JQL và xuất CSV, Excel, PDF.',
        ],
        tiep: 'Docs có mẫu và xin duyệt, vẽ sơ đồ bằng AI, lên lịch họp và biến biên bản thành thẻ việc.',
      }),
    },
    {
      title: 'Docs, diagrams and meetings|||Tài liệu, sơ đồ và cuộc họp: viết SRS, vẽ ERD, biên bản thành thẻ việc',
      slug: 'ctw-07-docs-so-do-hop',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Trang Docs từ 50 mẫu (Report 1–7 Capstone FPT, SWR302, dự án khách), xin phê duyệt lần lượt/cùng lúc, lịch sử phiên bản và xuất Word/PDF; sơ đồ Mermaid, AI vẽ, nhập draw.io; lên lịch họp kèm Jitsi và .ics; biên bản → thẻ việc.',
      content: bai({
        phan: P2, tap: 7,
        mo: 'Hôm nay lo phần giấy tờ của nhóm: viết tài liệu, vẽ sơ đồ, và tổ chức cuộc họp sao cho họp xong là có việc để làm.',
        hoc: [
          'Tạo trang Docs từ mẫu (SRS, Report 1–7 của FPT, mẫu SWR302…)',
          'Xin phê duyệt tài liệu, xem lịch sử phiên bản, xuất Word/PDF/Markdown',
          'Vẽ ERD và lưu đồ bằng Mermaid, dùng <strong>AI vẽ</strong>, nhập draw.io/Excalidraw',
          'Lên lịch họp kèm link video và tệp lịch <code>.ics</code>',
          'Biến biên bản họp thành thẻ việc',
        ],
        y: [
          'Tuần nộp Report 3: một file Word "SRS bản cuối, bản cuối thật", sơ đồ ERD nằm trên máy một bạn (bạn ấy nghỉ ốm là cả nhóm không sửa được), buổi họp nói nhiều mà hôm sau không ai nhớ ai nhận việc gì. Mỗi dự án CT Work có ba chỗ cho giấy tờ: <strong>Docs</strong> (tài liệu), <strong>Sơ đồ</strong> (Diagram) và <strong>Cuộc họp</strong> — và cả ba đều nối về thẻ việc: biên bản sinh ra thẻ, tài liệu liên kết với thẻ, tài liệu xong thì gửi đi duyệt.',
        ],
        buoc: [
          ['Trang mới từ mẫu', [
            'Mở <strong>Docs</strong>, bấm dấu <strong>＋</strong> cạnh ô lọc trang.',
            'Hộp <strong>Trang mới</strong>: bên trái là 50 mẫu dựng sẵn, bên phải là phần xem trước.',
            'Đầu danh sách là bảy báo cáo đồ án Capstone theo khung FPT (Report 1 → Report 7). Report 3 là bản đặc tả yêu cầu phần mềm (SRS) — mẫu ghi sẵn mục đích, cách viết và bảng ghi thay đổi.',
            'Kéo xuống có mẫu môn SWR302 (theo sách của Wiegers) và mẫu cho dự án khách như phiếu tiếp nhận, thoả thuận bảo mật.',
            'Bấm <strong>Dùng mẫu</strong> là có ngay một trang mới đúng khung.',
          ]],
          ['Xin phê duyệt và xuất file', [
            'Chip <strong>Nháp</strong> cạnh tiêu đề: trang chưa ai duyệt. Viết xong, bấm <strong>Xin phê duyệt</strong> và chọn người duyệt (giảng viên, bạn trong nhóm).',
            '<strong>Lần lượt</strong>: người sau chỉ được hỏi khi người trước đã duyệt. <strong>Cùng lúc</strong>: mọi người duyệt song song. Có thể đặt hạn và ghi chú.',
            'Luật duyệt chặt: không ai duyệt thay người khác, kể cả admin; chỉ một người từ chối là cả yêu cầu bị từ chối. Trang để Nội bộ thì khách chưa làm người duyệt được.',
            'Duyệt xong mà ai sửa trang: CT Work giữ chữ ký nhưng gắn cờ báo nội dung đã đổi để nhóm xin duyệt lại.',
            'Nút <strong>Lịch sử</strong> giữ mọi phiên bản (so sánh, khôi phục). Menu <strong>⋯</strong> có Xuất Word, Xuất PDF, Markdown để nộp lên hệ thống của trường.',
          ]],
          ['Sơ đồ viết bằng chữ', [
            'Mở mục <strong>Sơ đồ</strong>. Sơ đồ ERD (quan hệ giữa các bảng dữ liệu) viết bằng cú pháp <strong>Mermaid</strong>: bên trái là mã, bên phải là hình — sửa một dòng là hình vẽ lại ngay.',
            'Góc dưới có dòng <strong>Cú pháp hợp lệ</strong>, gõ sai là biết liền.',
            'Nút <strong>AI vẽ</strong> dựng sơ đồ từ dữ liệu của nhóm (use case, màn hình, quy tắc), ví dụ loại Sequence (sơ đồ tuần tự). Kết quả chỉ là <strong>đề xuất</strong>: phải có người bấm <strong>Nhận</strong> mới vào báo cáo, chỗ AI phải đoán ghi rõ là giả định.',
            'Đã vẽ bằng draw.io hay Excalidraw: bấm <strong>Nhập</strong>, chọn tệp — tệp chỉ được đọc ngay trong CT Work, không gửi đi đâu.',
          ]],
          ['Lên lịch họp', [
            'Mở <strong>Cuộc họp</strong>, bấm <strong>Lên lịch họp</strong> ở góc trên phải.',
            'Gõ tiêu đề, chọn loại họp, giờ bắt đầu, thời lượng, múi giờ.',
            'Ô <strong>Link video</strong> nhận link Google Meet, Zoom, Teams; chưa có thì bấm <strong>Tạo link</strong> để có phòng Jitsi miễn phí, không cần tài khoản.',
            '<strong>Mẫu chương trình</strong> điền sẵn các mục cần bàn kèm thời lượng và khung biên bản. Tích chọn người được mời.',
            'Ô cuối gửi email mời kèm tệp lịch <code>.ics</code> — mở tệp là buổi họp vào lịch Google/Outlook. Bấm <strong>Lên lịch</strong>.',
          ]],
          ['Biên bản thành thẻ việc', [
            'Mở buổi họp đã diễn ra: phần <strong>Chương trình</strong> (cần bàn), <strong>Biên bản</strong> (đã làm được gì, đang vướng gì), <strong>Quyết định</strong> (điều cả nhóm đã chốt).',
            'Phần <strong>Việc cần làm</strong>: mỗi dòng có nội dung, người phụ trách và hạn chót.',
            '<strong>Gợi ý từ biên bản</strong>: AI đọc biên bản và đề xuất thêm việc — không có gì được lưu cho tới khi bạn chọn.',
            'Bấm <strong>Tạo thẻ</strong>: các dòng thành thẻ trên Board, có người làm và có hạn.',
            'Phần <strong>Ghi âm</strong>: mọi người phải đồng ý trước, âm thanh tự xoá sau 30 ngày. Có bản ghi thì <strong>AI soạn biên bản</strong> viết bản nháp — mỗi quyết định phải trích được câu nói thật và chỉ có hiệu lực khi người chủ trì duyệt.',
          ]],
        ],
        meo: [
          'Sơ đồ mới: bấm <strong>Tạo mới</strong> ở góc trên trang Sơ đồ; dòng đầu tiên của mã ERD là <code>erDiagram</code>.',
          'Mỗi bảng viết tên rồi mở ngoặc nhọn, mỗi cột một dòng gồm kiểu và tên; đường nối giữa hai bảng viết ở trên cùng.',
          'Thẻ tạo từ biên bản: mở Board là thấy ngay.',
        ],
        lam: [
          'Tạo một trang Docs từ mẫu Report 3, bấm <strong>Xin phê duyệt</strong> và chọn một bạn trong nhóm làm người duyệt.',
          'Mở Sơ đồ, viết một ERD bằng Mermaid có hai bảng Sinh viên và Lớp, rồi sửa một dòng xem hình đổi theo.',
          'Lên lịch một buổi họp, bấm <strong>Tạo link</strong> để có phòng Jitsi, rồi thêm hai việc cần làm và bấm <strong>Tạo thẻ</strong>.',
        ],
        tomTat: [
          'Docs có 50 mẫu: Report 1–7 của FPT, mẫu SWR302 và mẫu cho dự án khách.',
          'Viết xong thì Xin phê duyệt (lần lượt hoặc cùng lúc); mọi phiên bản được giữ, xuất được Word hay PDF.',
          'Sơ đồ viết bằng Mermaid, sửa chữ là hình đổi; AI vẽ chỉ là đề xuất; hình cũ từ draw.io nhập vào được.',
          'Cuộc họp lên lịch kèm Jitsi và tệp lịch; ghi biên bản, quyết định, rồi biến việc cần làm thành thẻ.',
        ],
        tiep: 'các báo cáo dành cho nhóm trưởng — burndown, báo cáo tuần do AI viết, và ai đóng góp bao nhiêu.',
      }),
    },
    {
      title: 'Reports: progress, contributions, workload|||Báo cáo cho nhóm trưởng: tiến độ, đóng góp từng người, khối lượng việc',
      slug: 'ctw-08-bao-cao-dong-gop',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Burndown và vận tốc, tab Sức khoẻ/Burndown/Vận tốc/Báo cáo sprint và retro, báo cáo tuần do AI viết từ số liệu thật, Đóng góp từng người, Khối lượng việc người × tuần, Tổng quan nhóm và Nộp bài.',
      content: bai({
        phan: P2, tap: 8,
        mo: 'Hôm nay đọc số liệu: nhóm có kịp tiến độ không, ai đang làm bao nhiêu, và ai đang bị dồn quá nhiều việc.',
        hoc: [
          'Đọc biểu đồ <strong>Burndown</strong> và <strong>Vận tốc</strong> (Velocity)',
          'Dùng các tab Sức khoẻ, Burndown, Vận tốc, Báo cáo sprint, tạo retro',
          'Tạo báo cáo tuần do AI viết và kiểm mục Số liệu đã dùng',
          'Đọc Đóng góp từng người và Khối lượng việc — đúng cách',
          'Trang Tổng quan nhóm và Nộp bài',
        ],
        y: [
          'Tuần sáu, giảng viên hỏi "nhóm em có kịp demo không?" — bạn trả lời theo cảm giác. Lúc chấm điểm nhóm, một bạn kêu "em làm nhiều nhất mà điểm bằng nhau". Cả hai chuyện cần cùng một thứ: <strong>số liệu thật</strong> thay cho cảm giác.',
          '<strong>Burndown</strong> (đốt dần) là biểu đồ số điểm việc còn lại theo từng ngày của sprint. Đường chéo đi xuống là đường lý tưởng (tới ngày cuối còn 0). Đường thật nằm <strong>trên</strong> đường lý tưởng là nhóm đang chậm, nằm dưới là đang nhanh.',
          '<strong>Vận tốc</strong> (Velocity) là số điểm nhóm làm xong mỗi sprint — biết vận tốc thì sprint sau nhận đúng sức nhóm, không ôm quá nhiều.',
        ],
        buoc: [
          ['Sức khoẻ, Burndown, Vận tốc', [
            'Mở <strong>Báo cáo</strong> ở nhóm Phân tích. Tab <strong>Sức khoẻ</strong> (Health): dải đỏ cảnh báo sprint có rủi ro (cần bao nhiêu điểm mỗi ngày so với đang làm).',
            'Bốn ô đếm: việc quá hạn, việc sắp tới hạn trong 3 ngày, việc kẹt quá 5 ngày, việc gấp chưa ai nhận. Dưới cùng là khối lượng từng người — ai gánh hơn 1,6 lần trung bình nhóm bị tô sáng.',
            'Tab <strong>Burndown</strong>: các ô cam kết / đã xong / còn mấy ngày; đường chấm đứt là lý tưởng, đường tím là việc còn lại thật.',
            'Tab <strong>Vận tốc</strong>: mỗi sprint cam kết bao nhiêu điểm và xong bao nhiêu.',
            'Tab <strong>Báo cáo sprint</strong>: thẻ đã xong, chưa xong, thẻ thêm vào giữa chừng, thẻ bị bỏ ra. Cuối trang có nút <strong>Tạo retro</strong> — buổi nhìn lại sau mỗi sprint: dán ý kiến của nhóm, AI chia thành điều làm tốt, chưa tốt và việc cần làm.',
          ]],
          ['Báo cáo tuần do AI viết', [
            'Mở tab <strong>Báo cáo tuần</strong> (Weekly report), chọn người đọc: Giảng viên, Khách hàng hoặc Nhóm; chọn ngôn ngữ Anh hay Việt.',
            'Số liệu lấy từ dữ liệu dự án, AI chỉ viết phần chữ, mỗi lần tạo tốn một lượt AI. Bấm <strong>Tạo</strong> (chờ khoảng 10 giây).',
            'Báo cáo có kỳ báo cáo, tóm tắt, việc đã xong kèm người làm, rủi ro sprint, và cảnh báo phân bổ việc không cân bằng.',
            'Nút <strong>Chép</strong> để dán vào email gửi giảng viên, nút <strong>Tải về</strong> tệp Markdown. Cuối báo cáo có <strong>Số liệu đã dùng</strong> để bạn kiểm AI không bịa con số nào.',
          ]],
          ['Đóng góp từng người', [
            'Tab <strong>Đóng góp</strong> (Contributions) trả lời "ai làm bao nhiêu". Dòng lưu ý đầu trang: số đếm cho thấy <strong>hoạt động</strong>, không phải chất lượng hay công sức — dùng để mở đầu cuộc trò chuyện, đừng dùng riêng để chấm điểm.',
            'Hàng ô số trong 30 ngày: thẻ hoàn thành, tỉ lệ đúng hạn, giờ đã ghi, số lần trao đổi, tài liệu và test.',
            'Bảng từng người: thẻ xong, điểm, đúng hạn, quá hạn, giờ, bình luận, review, họp. Trợ lý AI có dòng riêng, xếp cuối và không cộng vào tổng nhóm.',
            'Nút <strong>Excel</strong> và <strong>Tóm tắt PDF</strong> để gửi kèm khi giảng viên hỏi.',
          ]],
          ['Khối lượng việc', [
            '<strong>Khối lượng việc</strong> (Workload) nằm ở cấp không gian — gom việc của mọi dự án.',
            'Lưới người × tuần: mỗi ô là số giờ được giao so với năng lực (mặc định 8 giờ/ngày = 40 giờ/tuần). Ô đỏ là quá tải (ví dụ 80 giờ = 200%).',
            'Bấm vào ô để xem những thẻ tạo nên con số đó, rồi chuyển bớt cho người đang rảnh. Tab <strong>Người và Agent</strong> so việc người với việc AI agent (tập 11).',
          ]],
          ['Tổng quan nhóm và Nộp bài', [
            'Trang <strong>Tổng quan nhóm</strong> gom mọi thứ nhóm trưởng cần để ý: dải <strong>Cần để ý</strong> (thẻ quá hạn, sprint chậm, thiếu hồ sơ, thành viên cần chú ý), bảng <strong>Ai đang làm gì</strong>, cuộc họp sắp tới, hồ sơ FPT còn thiếu, việc kẹt / chờ review / trễ hạn.',
            'Trang <strong>Nộp bài</strong> gom sản phẩm theo từng người (đã nộp, trễ hạn); <strong>Tải tất cả</strong> tải mọi tệp một lần, <strong>Xuất CSV</strong> cho bảng nộp bài kèm hạn chót.',
          ]],
        ],
        meo: [
          'Burndown chỉ có số liệu sau khi sprint đã bắt đầu, và chỉ đếm thẻ đã có story point.',
          'Báo cáo tuần tốn một lượt AI mỗi lần tạo — đọc kỹ rồi hẵng bấm Tạo lại.',
          'Thấy ai quá tải thì nói chuyện với bạn ấy trước, rồi mới chia lại việc trên Board.',
        ],
        lam: [
          'Mở Báo cáo của dự án nhóm, đọc tab Burndown và cho biết đường thật đang nằm trên hay dưới đường lý tưởng.',
          'Tạo một báo cáo tuần cho người đọc là Giảng viên, bằng tiếng Việt, rồi mở mục Số liệu đã dùng để kiểm.',
          'Mở tab Đóng góp và Khối lượng việc, tìm xem bạn nào đang ôm nhiều việc nhất tuần này.',
        ],
        tomTat: [
          'Sức khoẻ cho biết sprint có rủi ro không; Burndown so việc còn lại với đường lý tưởng.',
          'Vận tốc là số điểm làm xong mỗi sprint — dùng để nhận việc vừa sức.',
          'Báo cáo tuần do AI viết từ số liệu thật, luôn kèm mục Số liệu đã dùng.',
          'Đóng góp và Khối lượng việc cho thấy ai làm bao nhiêu, ai quá tải — là điểm bắt đầu để trò chuyện, không phải để chấm điểm.',
        ],
        tiep: 'đổi vai sang giảng viên — tạo lớp, điểm danh bằng mã QR, giao bài, chấm điểm và làm quiz.',
      }),
    },
  ],
};

/* ───────────────────────────── Phần 3 ───────────────────────────── */

const s03 = {
  title: 'Part 3 — Lecturers|||Phần 3 — Giảng viên',
  description: 'Lớp học trong CT Work: mã lớp, nhóm = dự án, Bảng tin, bài tập chấm theo rubric, điểm danh QR chống điểm danh hộ, sổ điểm có trọng số, quiz tự chấm, và Trung tâm giảng dạy.',
  lessons: [
    {
      title: 'For lecturers: classes, QR attendance, grading, quizzes|||Giảng viên: tạo lớp, điểm danh QR, giao bài, chấm điểm, quiz',
      slug: 'ctw-09-giang-vien-lop-hoc',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Tạo lớp và mã lớp 8 ký tự, sinh viên lập nhóm (mỗi nhóm một dự án), giao bài tập có rubric và trừ điểm muộn, điểm danh bằng QR/mã 6 số, sổ điểm có trọng số, quiz tự chấm với ngân hàng câu hỏi, Trung tâm giảng dạy.',
      content: bai({
        phan: P3, tap: 9,
        mo: 'Hôm nay đổi vai, ngồi vào ghế giảng viên: tạo lớp, điểm danh bằng mã QR, giao bài, chấm điểm và làm quiz. Sinh viên cũng làm thử được — ai cũng tạo được lớp thử.',
        hoc: [
          'Lớp học nối với dự án của từng nhóm như thế nào',
          'Tạo lớp, gửi mã lớp, dùng Bảng tin',
          'Giao bài tập có hạn, rubric và trừ điểm nộp muộn; chấm và trả bài',
          'Mở điểm danh bằng QR / mã 6 số',
          'Sổ điểm có trọng số, quiz tự chấm, Trung tâm giảng dạy',
        ],
        y: [
          'Một lớp SWP391 bốn mươi sinh viên, bảy nhóm: mỗi nhóm một nhóm Zalo, điểm danh bằng giấy chuyền tay, bài nộp qua email, điểm trong một file Excel riêng — cuối kỳ muốn biết nhóm nào chậm phải mở từng nơi. Phần <strong>Lớp học</strong> gom tất cả về một chỗ theo kiểu Google Classroom, nhưng nối thẳng vào dự án của từng nhóm.',
          'Giảng viên tạo lớp và nhận <strong>mã lớp 8 ký tự</strong>. Sinh viên nhập mã (hoặc bấm link mời) để vào lớp, rồi tạo nhóm hoặc tham gia nhóm có sẵn — mỗi nhóm được tạo luôn một dự án CT Work theo mẫu môn. Giảng viên tự động là <strong>Teacher</strong> trong dự án của mọi nhóm, nên xem được board, báo cáo và đóng góp. Lớp có năm tab: Bảng tin, Bài trên lớp, Mọi người, Điểm, Lịch.',
        ],
        buoc: [
          ['Trang Lớp học và Bảng tin', [
            'Mở <strong>Lớp học</strong> ở thanh bên. Ô <strong>Vào lớp</strong> trên cùng là chỗ sinh viên nhập mã; bên dưới là các lớp bạn phụ trách.',
            'Mở lớp: ô <strong>Mã lớp</strong> bên trái kèm nút chép để gửi cho sinh viên; bên dưới là <strong>Sắp tới</strong> (buổi học kế tiếp, hạn bài gần nhất).',
            'Ở giữa là <strong>Bảng tin</strong> (Stream): ghim thông báo lên đầu; mỗi lần giao bài, Bảng tin tự đăng một dòng. Công tắc bên trái bật/tắt bình luận của sinh viên.',
          ]],
          ['Tạo lớp', [
            'Bấm <strong>Tạo lớp</strong> ở góc trên.',
            'Chọn môn (ví dụ SWP391), gõ mã lớp học phần (ví dụ SE1840) và kỳ học (ví dụ FA26) — hai ô bắt buộc. Tên lớp không bắt buộc.',
            'Ô <strong>Tôi là giảng viên của lớp</strong> được tích sẵn; tạo hộ thầy cô thì bỏ tích và nhập email giảng viên.',
            'Hàng cuối: số người tối đa mỗi nhóm, số ngày mã lớp còn dùng được, ngày bắt đầu tuần 1. Bấm <strong>Tạo</strong>.',
          ]],
          ['Giao và chấm bài tập', [
            'Tab <strong>Bài trên lớp</strong> (Classwork) có ba phần: Bài tập, Quiz, Tài liệu (slide, đề cương, link — gom theo tuần hoặc chủ đề).',
            'Bài tập có hạn chót, thang điểm, cá nhân hay nhóm, và trừ điểm nộp muộn (ví dụ 10%/ngày). Hướng dẫn ghi rõ phải nộp gì và chấm theo <strong>rubric</strong> (bảng tiêu chí chấm điểm).',
            'Tab <strong>Bài làm của sinh viên</strong>: lọc đã nộp / chưa nộp / nộp muộn, chấm từng tiêu chí, điểm tự cộng — sinh viên chưa thấy cho tới khi bạn bấm <strong>Trả bài</strong>.',
            'Bài nhóm chấm một lần cho cả nhóm, vẫn chỉnh được điểm riêng từng thành viên.',
          ]],
          ['Điểm danh bằng QR', [
            'Tab <strong>Lịch</strong> chứa các buổi học (định kỳ hằng tuần hoặc buổi lẻ, xuất được tệp <code>.ics</code>). Tới giờ, bấm <strong>Điểm danh</strong> trên dòng buổi học.',
            'Luật: mỗi sinh viên điểm danh một lần; nhập sai 5 lần bị khoá 10 phút — chống điểm danh hộ.',
            'Chọn thời gian hiệu lực (ví dụ 5 phút), bấm <strong>Mở điểm danh</strong>: mã QR và mã 6 số hiện ra kèm đồng hồ đếm ngược. Chiếu lên máy chiếu; sinh viên quét QR hoặc gõ 6 số.',
            'Bảng điền dần từng người, ai vào sau giờ bắt đầu tự ghi là muộn. Hết giờ, bấm <strong>Đánh vắng</strong> những người còn lại. Tab Điểm danh tổng hợp cả kỳ, gắn cờ ai vắng quá ngưỡng, xuất Excel.',
          ]],
          ['Sổ điểm', [
            'Tab <strong>Điểm</strong> (Gradebook): mỗi bài tập và quiz là một cột, cột Tổng tự cộng.',
            'Điểm in nghiêng là điểm nháp — sinh viên chỉ thấy khi bạn trả bài.',
            'Nút <strong>Trọng số</strong> tính điểm theo phần trăm (ví dụ lab 30%, đồ án 70%); <strong>Nhập/Xuất Excel</strong> để đưa điểm cũ vào hoặc nộp phòng đào tạo.',
          ]],
          ['Quiz tự chấm', [
            'Trong Bài trên lớp, mở hoặc tạo quiz (bài trắc nghiệm ngắn, máy tự chấm).',
            'Câu hỏi lấy từ <strong>Ngân hàng câu hỏi</strong> của lớp, năm loại: một đáp án, nhiều đáp án, đúng sai, trả lời ngắn, nối cặp. Nhập từ Excel hoặc định dạng Aiken/GIFT của Moodle; AI soạn nháp được nhưng phải có người duyệt.',
            '<strong>Rút ngẫu nhiên</strong> cho mỗi sinh viên một bộ đề khác nhau. Cột Cài đặt: giờ mở, giờ đóng, thời gian làm, số lần làm, khi nào hiện đáp án.',
            'Đồng hồ chạy trên máy chủ nên không gian lận giờ được; mỗi lần sinh viên chuyển tab khác bị ghi lại cho bạn xem.',
          ]],
          ['Trung tâm giảng dạy', [
            'Mở <strong>Giảng dạy</strong> (Teaching hub) ở thanh bên: gom mọi nhóm bạn hướng dẫn, ở mọi lớp và không gian, vào một bảng.',
            'Hàng ô số: nhóm đáng lo, cần để ý, ổn, số thẻ quá hạn, câu hỏi đang chờ bạn trả lời; mỗi nhóm một dòng kèm màu sức khoẻ.',
            '<strong>Xuất Excel</strong>, <strong>Xuất PDF</strong>, <strong>AI tóm tắt</strong> để tổng hợp trước họp bộ môn. Tab <strong>Rubric</strong> có mẫu theo quy định môn (SWP391 từng iteration và buổi bảo vệ, SEP490) — bấm <strong>Dùng mẫu</strong> rồi sửa.',
          ]],
        ],
        meo: [
          'Sinh viên vào lớp ở trang Lớp học → ô <strong>Vào lớp</strong>, gõ mã 8 ký tự rồi bấm <strong>Tiếp tục</strong>.',
          'Trừ điểm muộn nằm trong hộp Tạo bài tập: tích <strong>Cho nộp muộn</strong>, rồi đặt phần trăm trừ mỗi ngày.',
          'Nút <strong>Điểm danh</strong> nằm ngay trên dòng buổi học trong tab Lịch.',
        ],
        lam: [
          'Tạo một lớp thử, chép mã lớp, nhờ một bạn vào lớp bằng mã đó và tạo nhóm.',
          'Giao một bài tập nhóm có hạn chót, cho nộp muộn trừ 10% mỗi ngày.',
          'Tạo một buổi học, bấm <strong>Điểm danh</strong>, nhờ bạn kia quét mã QR bằng điện thoại.',
        ],
        tomTat: [
          'Lớp có mã 8 ký tự; sinh viên vào lớp rồi lập nhóm, mỗi nhóm là một dự án CT Work.',
          'Bài tập có hạn, trừ điểm muộn, chấm theo rubric, chỉ hiện điểm khi bạn trả bài.',
          'Điểm danh bằng QR hoặc mã 6 số, chống điểm danh hộ, xuất được Excel.',
          'Sổ điểm tự cộng, có trọng số; quiz tự chấm có ngân hàng câu hỏi và đồng hồ máy chủ; Trung tâm giảng dạy gom mọi nhóm vào một bảng.',
        ],
        tiep: 'làm dự án cho khách hàng — chia sẻ thẻ, cổng khách, và xem dự án dưới con mắt của khách.',
      }),
    },
  ],
};

/* ───────────────────────────── Phần 4 ───────────────────────────── */

const s04 = {
  title: 'Part 4 — Clients (client portal)|||Phần 4 — Khách hàng (cổng khách)',
  description: 'Làm dự án cho khách thật: Board Kanban, thẻ chia sẻ (biểu tượng con mắt), cổng khách hàng, xem trước như khách, mời khách, xin ký nghiệm thu UAT, và tách tài liệu nội bộ với tài liệu cho khách.',
  lessons: [
    {
      title: 'Client projects: shared cards, client portal, UAT sign-off|||Làm dự án cho khách: chia sẻ thẻ, cổng khách hàng, duyệt UAT',
      slug: 'ctw-10-cong-khach-hang',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Hai cửa của dự án (nhóm và khách), Board Kanban của mẫu Dự án khách hàng, xem trước như khách, mời khách bằng email, xin ký nghiệm thu UAT, và đặt Ai xem được cho từng trang Docs.',
      content: bai({
        phan: P4, tap: 10,
        mo: 'Nhóm bạn nhận làm dự án cho một khách hàng thật. Khách theo dõi tiến độ ở đâu, và thấy được những gì? Tập này trả lời bằng <strong>cổng khách hàng</strong>.',
        hoc: [
          'Hai cửa của một dự án: cửa trong cho nhóm, cửa ngoài cho khách',
          'Board Kanban của mẫu Dự án khách hàng, thẻ đã chia sẻ (con mắt)',
          'Xem trước như khách — kiểm tra khách thấy đúng những gì',
          'Mời khách và xin ký nghiệm thu UAT',
          'Tài liệu nội bộ và tài liệu cho khách',
        ],
        y: [
          'Làm website cho một quán cà phê: ngày nào chủ quán cũng nhắn hỏi tiến độ, bạn chụp màn hình gửi qua — rồi lỡ tay gửi luôn ghi chú nội bộ kiểu "khách này hay đổi ý, nhớ chốt phạm vi sớm". CT Work giải bằng một cổng riêng: khách tự vào xem, và chỉ thấy đúng phần nhóm cho phép.',
          '<strong>Cổng khách hàng</strong> (Client portal) là trang gọn dành riêng cho khách. Cửa trong (nhóm) thấy hết thẻ, bình luận, giờ làm, báo cáo; cửa ngoài (khách) chỉ thấy thẻ đã chia sẻ, tài liệu cho khách, yêu cầu cần họ duyệt và lịch họp. Bình luận trong dự án có khách mặc định là <strong>ghi chú nội bộ</strong> — muốn khách đọc thì chọn <strong>Trả lời khách</strong>. Và đây không chỉ là ẩn trên màn hình: <strong>máy chủ chặn luôn</strong>, khách không thể lần ra thẻ chưa chia sẻ.',
        ],
        buoc: [
          ['Board Kanban của dự án khách', [
            'Tạo dự án từ mẫu <strong>Dự án khách hàng</strong> — mẫu bật sẵn cổng khách, phê duyệt và cuộc họp (nhóm <strong>Studio</strong> cuối thanh bên).',
            'Board kiểu Kanban: thẻ chảy từ trái sang phải, không chia sprint. Bốn cột: Backlog, Đã chọn, Đang làm, Hoàn thành.',
            'Biểu tượng <strong>con mắt</strong> cạnh mã thẻ = thẻ đã chia sẻ cho khách. Nhãn <code>from-client</code> = yêu cầu do chính khách gửi từ cổng của họ.',
          ]],
          ['Xem trước như khách', [
            'Mở <strong>Cổng khách hàng</strong>, bấm <strong>Xem trước như khách</strong>. Dải vàng phía trên ghi rõ: chỉ xem, bạn không đăng nhập thành ai khác.',
            'Tab <strong>Tổng quan</strong>: tiến độ chung, số việc đang mở / đã xong, các mốc sắp tới.',
            'Tab <strong>Yêu cầu</strong>: các thẻ đã chia sẻ cùng trạng thái; thẻ khách tự gửi có chữ "từ bạn".',
            'Tab <strong>Phê duyệt</strong>: nơi hiện yêu cầu khách ký duyệt (giai đoạn, tài liệu, nghiệm thu). Tab <strong>Tài liệu</strong> và <strong>Cuộc họp</strong>: chỉ thứ dành cho khách.',
            'Kiểm lại: không có ghi chú nội bộ, giờ làm hay sprint của nhóm.',
          ]],
          ['Mời khách và xin nghiệm thu', [
            'Ở góc nhìn của nhóm, phía trên cổng có ô <strong>Khách hàng</strong>: gõ email của khách, bấm <strong>Mời khách</strong> — khách vào với vai Khách và đi thẳng tới cổng.',
            'Luật hiển thị: chỉ thẻ đã chia sẻ, trả lời đánh dấu Trả lời khách, và tài liệu đặt <strong>Nhóm và khách</strong> mới hiện ở cổng.',
            'Nút <strong>Yêu cầu ký nghiệm thu UAT</strong> (User Acceptance Testing — khách dùng thử rồi ký xác nhận đạt): đặt tiêu đề, môi trường chạy thử (ví dụ Staging), số bản build, tích các thẻ cần nghiệm thu, đính kèm tài liệu, bấm <strong>Gửi cho khách</strong>.',
            'Phải mời khách trước — nghiệm thu cần ít nhất một khách duyệt.',
          ]],
          ['Tài liệu: cho khách hay nội bộ', [
            'Mở <strong>Docs</strong> của dự án. Trang có dải vàng <strong>Khách thấy được</strong> và ô <strong>Ai xem được</strong> = Nhóm và khách là trang khách đọc được.',
            'Trang nhãn <strong>Nội bộ</strong>, Ai xem được = Nhóm dự án: khách hoàn toàn không thấy.',
            'Muốn đưa một trang nội bộ ra cho khách: bấm <strong>Chia sẻ với khách</strong> ngay dưới tiêu đề.',
          ]],
        ],
        meo: [
          'Giá vốn, đánh giá khách hay việc còn lấn cấn: cứ để ở trang nội bộ.',
          'Mẫu Dự án khách hàng nằm ngay ở bước chọn loại dự án khi bấm Dự án mới.',
          'Thẻ chia sẻ thành công có biểu tượng con mắt; trang Docs đổi ở ô <strong>Ai xem được</strong> bên phải.',
          'Thấy thiếu thẻ trong cổng khách: gần như chắc chắn bạn chưa chia sẻ thẻ đó.',
        ],
        lam: [
          'Tạo một dự án từ mẫu Dự án khách hàng, rồi thêm ba thẻ việc.',
          'Mở một thẻ và bấm <strong>Chia sẻ với khách</strong>; viết một trang Docs nội bộ và một trang cho khách.',
          'Vào Cổng khách hàng, bấm <strong>Xem trước như khách</strong>, kiểm tra khách thấy đúng những gì bạn muốn chưa.',
        ],
        tomTat: [
          'Cổng khách hàng là cửa riêng cho khách; máy chủ chặn mọi thứ chưa chia sẻ.',
          'Thẻ có con mắt là thẻ khách thấy; bình luận mặc định là ghi chú nội bộ, muốn khách đọc thì chọn Trả lời khách.',
          'Xem trước như khách để tự kiểm tra, mời khách bằng email, xin nghiệm thu UAT khi xong một đợt việc.',
          'Tài liệu chọn Chỉ nhóm hoặc Nhóm và khách.',
        ],
        tiep: 'phần nâng cao — trợ lý AI, đồng đội AI agent, và kết nối CT Work với GitHub, Slack, lịch.',
      }),
    },
  ],
};

/* ───────────────────────────── Phần 5 ───────────────────────────── */

const s05 = {
  title: 'Part 5 — Advanced: AI, agents, integrations|||Phần 5 — Nâng cao: AI, agent, tích hợp',
  description: 'Hỏi AI về dự án, đồng đội AI agent và rào chắn của nó, báo cáo Người và Agent, kết nối GitHub/kênh chat/Microsoft/Google/Notion/Slack; rồi dùng CT Work trên app máy tính, điện thoại và phím tắt.',
  lessons: [
    {
      title: 'Advanced: AI assistant, AI agents and integrations|||Nâng cao: Trợ lý AI, AI agent và kết nối GitHub, Slack, lịch',
      slug: 'ctw-11-ai-agent-tich-hop',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Hỏi AI bằng ⌘J (chỉ đề xuất, bạn bấm Áp dụng), AI agent là thành viên đăng nhập bằng token và luôn qua Review, lọc board Người/Agent, báo cáo Người và Agent, nối GitHub bằng webhook + mã thẻ, thông báo Discord/Slack, Notion và Slack.',
      content: bai({
        phan: P5, tap: 11,
        mo: 'Phần nâng cao: cho AI vào nhóm — hỏi AI về dự án, giao thẻ cho AI agent, rồi nối CT Work với GitHub, kênh chat, Notion và Slack.',
        hoc: [
          'Hỏi AI về dự án bằng <code>⌘J</code> / <code>Ctrl+J</code>',
          'AI agent — đồng đội AI: làm được gì, KHÔNG được làm gì',
          'Lọc board theo Người / Agent và đọc báo cáo Người và Agent',
          'Nối GitHub bằng webhook và mã thẻ; thông báo sang Discord, Slack, Google Chat',
          'Microsoft 365 & Google, Notion và Slack',
        ],
        y: [
          'Cuối sprint, nhóm trưởng muốn biết ngay sprint đang có rủi ro gì — mà muốn trả lời phải mở từng thẻ, xem hạn, xem ai làm, tự cộng điểm, mất cả buổi tối; còn thẻ viết test case thì nằm im vì chẳng ai rảnh tay. Tập này có hai trợ thủ: một <strong>trợ lý AI</strong> đọc dự án giúp bạn, và một <strong>đồng đội AI</strong> tự nhận thẻ về làm.',
          'Bản đồ bốn mảnh: (1) Hỏi AI, (2) AI agent, (3) báo cáo Người và Agent, (4) các kết nối (Integration).',
        ],
        buoc: [
          ['Hỏi AI về dự án', [
            'Ở Board, bấm <strong>Hỏi AI</strong> ở thanh bên trái, hoặc nhấn <code>⌘J</code> (Windows: <code>Ctrl+J</code>).',
            'Bảng <strong>Trợ lý AI</strong> mở bên phải với câu gợi ý (nên làm gì tiếp, sprint có đúng tiến độ không, ai đang quá tải), việc soạn sẵn (viết user story, soạn test case) và Công cụ dự án (luyện bảo vệ đồ án, kiểm yêu cầu trước khi nộp).',
            'Gõ câu hỏi, ví dụ "Sprint 2 đang có rủi ro gì? Trả lời ngắn ba ý", nhấn Enter (chờ khoảng mười mấy giây).',
            'AI chỉ <strong>đề xuất</strong> — không có gì thay đổi cho tới khi có người bấm <strong>Áp dụng</strong>. Đừng dán mật khẩu vào đây.',
          ]],
          ['AI agent — đồng đội AI', [
            'Mở mục <strong>AI agent</strong> ở cấp không gian. AI agent là thành viên của nhóm: nhận thẻ, bình luận, ghi giờ và báo chi phí.',
            'Agent đăng nhập bằng <strong>token</strong> riêng (một mã khoá dài), không bao giờ dùng mật khẩu; mỗi agent có một người chủ chịu trách nhiệm.',
            'Agent <strong>không</strong> được duyệt, xoá, đổi cài đặt, đụng tới tiền hay nói chuyện với khách. Agent bấm Hoàn thành thì thẻ chỉ sang cột <strong>Review</strong> chờ người kiểm tra.',
            'Ô <strong>Agent có sẵn</strong> là đồng đội AI chạy luôn trên CT Work: giao thẻ là nó làm, không cần cài gì, có trần chi phí mỗi lượt.',
            'Trang một agent có các mục Đang làm, Token, Webhook, Hộp thư (thẻ được giao). Tạo token: mã chỉ hiện <strong>đúng một lần</strong> kèm lệnh nối cho công cụ AI như Claude Code, Cursor, Gemini CLI — chúng nói chuyện với CT Work qua <strong>MCP</strong> (chuẩn chung để công cụ AI dùng dữ liệu của app khác). Giữ token như giữ mật khẩu.',
          ]],
          ['Lọc Người và Agent, báo cáo', [
            'Trên thanh lọc của Board có ba nút <strong>Tất cả · Người · Agent</strong>. Ảnh đại diện agent luôn có hình robot nhỏ ở góc.',
            'Mục <strong>Báo cáo</strong> → tab <strong>Người và Agent</strong>: số thẻ agent đã giải quyết, tỉ lệ bị người trả lại, chi phí agent, chi phí mỗi điểm; bảng từng agent và bảng người (giờ đã ghi, thẻ đã giải quyết).',
            'Chi phí agent là số <strong>ước lượng, do agent tự khai</strong> — chỉ coi là tự báo, không phải số đo.',
          ]],
          ['GitHub, kênh chat, Microsoft và Google', [
            'Mở <strong>Cài đặt dự án</strong> → nhóm <strong>Tự động hoá và tích hợp</strong> → <strong>GitHub</strong>. CT Work nối với repo bằng <strong>webhook</strong> (địa chỉ để GitHub tự báo tin sang khi có thay đổi) — không cần cài app hay token cá nhân.',
            'Bấm <strong>Kết nối GitHub</strong>: CT Work tạo địa chỉ webhook và một khoá bí mật để bạn dán vào cài đặt của repo.',
            'Sau đó chỉ cần nhắc mã thẻ (ví dụ <code>NHOM-12</code>) trong tên branch, nội dung commit hoặc tiêu đề pull request — mọi thứ tự hiện trong mục <strong>Development</strong> của thẻ.',
            'Mục <strong>Thông báo chat</strong> đẩy tin thẻ mới, giao việc, việc xong, bình luận sang Discord, Slack hoặc Google Chat (Zalo chưa nối được; Discord dễ nhất cho nhóm sinh viên).',
            'Mục <strong>Microsoft 365 và Google</strong>: xuất danh sách thẻ ra Excel trên OneDrive hoặc Google Sheets (một chiều). Đồng bộ lịch Outlook/Google: mỗi người tự nối ở <strong>Kết nối của tôi</strong>, khi quản trị đã bật.',
          ]],
          ['Notion và Slack', [
            'Mục <strong>Notion và Slack</strong> trong nhóm Công việc. Tab Notion: nhập trang Notion vào Docs, xuất trang Docs sang Notion, nhập database Notion thành thẻ (xem trước được; nhập lại không bao giờ tạo thẻ trùng).',
            'Tab Slack: thêm app CT Work vào workspace Slack của nhóm. Trong kênh đã nối, gõ <code>/ctwork new</code> để gửi một đề xuất vào mục <strong>Tiếp nhận</strong> cho nhóm xem xét.',
          ]],
        ],
        meo: [
          'Không thấy nút Hỏi AI: tìm biểu tượng ngôi sao lấp lánh ở thanh trên của Board.',
          'Câu trả lời của AI có thể sai — luôn mở thẻ ra kiểm trước khi làm theo.',
          'GitHub chưa hiện gì: kiểm lại webhook trong cài đặt repo, và viết đúng mã thẻ.',
        ],
        lam: [
          'Mở Board của nhóm, nhấn <code>⌘J</code> / <code>Ctrl+J</code>, hỏi AI "nhóm mình đang có rủi ro gì", rồi tự kiểm lại từng ý trên board.',
          'Vào mục AI agent, đọc kỹ những việc agent không được làm, rồi lọc board theo Agent xem có thẻ nào không.',
          'Nếu nhóm đã có repo GitHub: đặt tên branch có mã thẻ (ví dụ <code>feature/NHOM-12</code>) rồi xem mục Development của thẻ.',
        ],
        tomTat: [
          'Hỏi AI bằng <code>⌘J</code>: trợ lý đọc dự án, chỉ đề xuất, bạn mới là người bấm Áp dụng.',
          'AI agent là đồng đội AI: đăng nhập bằng token, không duyệt, không xoá, việc xong vẫn phải qua Review.',
          'Lọc board theo Người hoặc Agent; chi phí agent trong báo cáo chỉ là số tự khai.',
          'Nối GitHub bằng webhook và mã thẻ, đẩy thông báo sang Discord hay Slack, đưa Notion vào Docs.',
        ],
        tiep: 'tập cuối — CT Work trên app máy tính, trên điện thoại, và các phím tắt hay dùng.',
      }),
    },
    {
      title: 'CT Work on desktop and phone: apps, updates, shortcuts|||CT Work trên máy tính và điện thoại: tải app, cập nhật, phím tắt',
      slug: 'ctw-12-app-may-tinh-dien-thoai',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Ba cách mở CT Work dùng chung một dữ liệu: web, app desktop (macOS/Windows/Linux, tự cập nhật, thông báo của máy) và trình duyệt điện thoại (thêm vào màn hình chính); cùng các phím tắt C, ⌘\\, ?, /, ⌘K, ⌘J.',
      content: bai({
        phan: P5, tap: 12,
        mo: 'Tập cuối của loạt: phần nhẹ nhàng mà dùng hằng ngày — cài app CT Work trên máy tính, dùng trên điện thoại, và vài phím tắt cho nhanh tay.',
        hoc: [
          'Ba cách mở CT Work — web, app máy tính, điện thoại — dùng chung một dữ liệu',
          'Tải đúng bản app cho máy của bạn',
          'Dùng app desktop: đồng bộ, thông báo, tự cập nhật',
          'Dùng CT Work trên điện thoại và thêm vào màn hình chính',
          'Các phím tắt hay dùng',
        ],
        y: [
          'Board của nhóm lẫn giữa ba mươi tab trình duyệt, có người giao việc mà tab đang ngủ nên bạn chẳng biết gì. Vì vậy CT Work có ba cách mở: <strong>web</strong> (cuongthai.com → CT Work), <strong>app desktop</strong> (macOS, Windows, Linux) và <strong>trình duyệt điện thoại</strong> (không cần cài gì). Cả ba dùng chung một tài khoản và một dữ liệu: kéo thẻ trên app, đồng đội thấy ngay trên điện thoại.',
        ],
        buoc: [
          ['Tải app', [
            'Bấm <strong>Tải app CT Work</strong> ở cuối thanh bên, hoặc mở trang <a href="https://cuongthai.com/download/ct-work" target="_blank" rel="noopener">cuongthai.com/download/ct-work</a>.',
            'Nút lớn ở giữa (Download) tự đoán máy bạn đang dùng; mục <strong>Other platforms</strong> có các bản khác: Mac Apple Silicon, Mac Intel, Windows, hai bản Linux.',
            'Lợi ích của app riêng: chỉ có CT Work (mở thẳng vào board), đồng bộ trực tiếp với web và app CuongThai, thông báo của hệ điều hành khi được giao việc / nhắc tên / sắp hạn (kể cả khi chạy nền), tự cập nhật, cài song song với app CuongThai, đăng nhập an toàn.',
          ]],
          ['Dùng app desktop', [
            'Sau khi cài và đăng nhập, app mở thẳng vào board của nhóm — mọi thứ y hệt bản web (thanh bên, cột, bộ lọc, Hỏi AI), không phải học lại.',
            'Bấm một thẻ để mở chi tiết bên phải; đóng lại là về đúng board vừa xem.',
            'Góc dưới bên trái có <strong>Trực tuyến</strong> và <strong>Đã đồng bộ</strong>: thay đổi của bạn đã lên máy chủ.',
            'Có bản mới, app tự tải ngầm — khởi động lại là đang dùng bản mới nhất.',
          ]],
          ['Trên điện thoại', [
            'Mở trình duyệt, vào cuongthai.com rồi mở CT Work. Board tự co cho vừa màn hình dọc — vuốt ngang để xem các cột; thẻ vẫn hiện mã, hạn và chip chờ.',
            'Thanh bên giấu trong nút ba gạch ở góc trên bên trái.',
            'Chạm một thẻ để mở chi tiết: đổi trạng thái, đọc việc con, bình luận ngay trên điện thoại.',
            'Dùng như một app: bấm nút <strong>Chia sẻ</strong> của trình duyệt → <strong>Thêm vào màn hình chính</strong>. (App iPhone/iPad có tab CT Work riêng, đang thử nghiệm.)',
          ]],
          ['Phím tắt hay dùng', [
            'Ở board, nhấn <code>C</code> để mở hộp <strong>Tạo thẻ</strong>; <code>Esc</code> để đóng.',
            '<code>⌘\\</code> (Windows: <code>Ctrl+\\</code>) thu gọn / hiện lại thanh bên.',
            '<code>?</code> mở bảng Trợ giúp đúng bài của trang đang xem.',
            '<code>/</code> tìm trên board, <code>⌘K</code> nhảy tới bất cứ đâu, <code>⌘J</code> hỏi AI. Danh sách đủ: bài <strong>Phím tắt</strong> trong Trợ giúp (gõ "phím tắt" vào ô tìm).',
          ]],
        ],
        meo: [
          'Không biết Mac chip gì: bấm quả táo → <strong>Giới thiệu về máy Mac này</strong>. M1 tới M4 là Apple Silicon.',
          'Phím tắt một chữ không chạy khi bạn đang gõ trong ô nhập — bấm ra ngoài board trước.',
          'Trên Windows, chỗ nào thấy <code>⌘</code> (Command) thì dùng <code>Ctrl</code>.',
        ],
        lam: [
          'Tải app CT Work đúng với máy của bạn, đăng nhập, mở board của nhóm.',
          'Trên điện thoại, mở CT Work trong trình duyệt và thêm vào màn hình chính.',
          'Ở board, thử liền một mạch: <code>C</code> tạo thẻ, <code>Esc</code>, <code>⌘\\</code>, rồi <code>?</code>.',
        ],
        tomTat: [
          'CT Work mở được ở ba nơi — web, app máy tính, trình duyệt điện thoại — dùng chung một dữ liệu.',
          'App máy tính chỉ có CT Work, có thông báo của hệ điều hành và tự cập nhật.',
          'Phím tắt cần nhớ: <code>C</code> tạo thẻ, <code>⌘K</code> nhảy trang, <code>⌘J</code> hỏi AI, <code>?</code> mở Trợ giúp.',
          'Bạn đã đi hết 12 tập: từ tạo không gian, dùng board, làm nhóm, quản lý dự án, tới AI và các kết nối. Giờ cài app lên máy và mời cả nhóm vào dự án thật của mình.',
        ],
      }),
    },
  ],
};

export default {
  category: { slug: 'career', name: 'Nghề nghiệp', icon: 'Briefcase', sortOrder: 7 },
  course: {
    slug: 'huong-dan-ct-work',
    title: 'CT Work Tutorial',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: false,
    syncOrder: true,
    // ⚠️ ẢNH BÌA CHƯA CÓ (17/10/2026: URL này trả 404). Thẻ khoá và trang khoá vẫn hiện được —
    // CourseCard có onError rơi về ảnh mặc định, trang khoá dùng SafeImage. Dựng + đẩy theo đúng mẫu các khoá khác:
    //   thêm một dòng ['huong-dan-ct-work', <logo>, '5B5BD6', 'CT Work', 'Hướng dẫn từ cơ bản tới nâng cao'] vào
    //   mảng KHOA của scripts/course-cover-offline.mjs rồi chạy --slug huong-dan-ct-work, hoặc trong container:
    //   node scripts/course-cover.mjs --slug huong-dan-ct-work --icon <logo trong scripts/icons/> --color 5B5BD6 …
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/huong-dan-ct-work.png?v=1',
    shortDescription: 'A 12-part video walkthrough of CT Work, the free Jira-style project tracker: boards, issues, sprints, docs, reports, classes, client portal, AI agents and the desktop app — by role.|||Loạt 12 video hướng dẫn CT Work — công cụ quản lý dự án kiểu Jira miễn phí: board, thẻ việc, sprint, Docs, báo cáo, lớp học, cổng khách, AI agent và app máy tính — theo từng vai.',
    description: 'Loạt video "Hướng dẫn CT Work từ cơ bản tới nâng cao" — 12 tập ngắn (5–8 phút), quay trên CT Work thật (cuongthai.com/work), chia theo VAI của bạn. Phần 1 cho mọi thành viên: CT Work là gì, tạo không gian và dự án từ mẫu đúng môn, dùng Board mỗi ngày, mở một thẻ việc từ A tới Z, trò chuyện – Docs – cuộc họp. Phần 2 cho nhóm trưởng: mời thành viên và phát quyền, Backlog – Sprint – Dòng thời gian – JQL, tài liệu từ mẫu và phê duyệt, sơ đồ Mermaid, biên bản thành thẻ việc, báo cáo tiến độ – đóng góp – khối lượng việc. Phần 3 cho giảng viên: lớp học, điểm danh QR, bài tập có rubric, sổ điểm, quiz tự chấm. Phần 4 cho dự án khách hàng: cổng khách, chia sẻ thẻ, nghiệm thu UAT. Phần 5 nâng cao: trợ lý AI, AI agent, GitHub, Slack, Notion, và app máy tính – điện thoại – phím tắt. Mỗi bài có tóm tắt từng bước, mẹo và bài "Làm theo ngay trên CT Work".',
    whatYouLearn: 'Tạo không gian và dự án đúng mẫu môn (SWP391, SWR302, SWT301, Capstone); đọc và dùng Board, thẻ việc, việc con, liên kết chặn, bình luận và ghi giờ; làm việc nhóm bằng kênh trò chuyện, Docs và cuộc họp; mời thành viên và phân quyền; chạy sprint, đọc Dòng thời gian và lọc bằng JQL; viết tài liệu từ mẫu, xin phê duyệt, vẽ sơ đồ; đọc burndown, vận tốc, báo cáo tuần và đóng góp; quản lý lớp học, điểm danh và chấm điểm; mở cổng cho khách; dùng AI, AI agent, các kết nối và app máy tính.',
    requirements: 'Không cần biết gì trước. Một tài khoản cuongthai.com (miễn phí) và trình duyệt; nên mở CT Work song song để làm theo từng tập.',
    documentsNote: 'Làm theo trực tiếp tại cuongthai.com/work. Trong CT Work nhấn ? để mở Trợ giúp đúng bài của trang đang xem (mỗi bài có video tập tương ứng); tải app máy tính ở cuongthai.com/download/ct-work.',
  },
  sections: [s01, s02, s03, s04, s05],
};
