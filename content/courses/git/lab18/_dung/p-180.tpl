    /* ─────────────────────────── 18.0 ─────────────────────────── */
    {
      title: '18.0 — Chapter 18 slides: real team accidents, in pictures|||18.0 — Slide Chương 18: tai nạn Git thật của nhóm bằng hình',
      slug: 'git-18-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 17 slide của Chương 18: ba loại tệp NetBeans, vì sao .gitignore thêm sau vô tác dụng, xung đột web.xml, PR để lâu, ba thông báo đồng bộ, main ahead 2, reset hay revert, merge không PR, revert -m 1 và revert cái revert, cách chẩn đoán và bảng tra nhanh.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 18 · Slides</span>
<h2>Seven real accidents of a three-person Java web team, in 17 slides</h2>
<p class="lead">Chapter 16 sets up a team repository and Chapter 17 (Quick start) gets a group onto GitHub; this chapter is about what goes wrong afterwards. The setting is a NetBeans web project (Servlet/JSP, Ant or Maven) written by three students — An, Bình and Chi — on Windows and Mac. Each accident is reproduced in a lab, then repaired; the slides give the picture, the lessons give every command.</p>
<p>The terminal lines and graphs on the slides come from real runs of the lab (git 2.51.1); the names and the passwords in the sample project are invented. The lab is a script, <code>lab18/tao-nhom.sh</code>; lesson 18.7 pastes a twenty-line starter that is enough to do every exercise by hand, and explains why the full script is not pasted.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 18 · Slide</span>
<h2>Bảy tai nạn thật của nhóm ba người làm Java web, trong 17 slide</h2>
<p class="lead">Chương 16 dựng kho cho nhóm và chương Khởi động nhanh đưa cả nhóm lên GitHub; chương này nói về những gì hỏng sau đó. Bối cảnh là một dự án web NetBeans (Servlet/JSP, Ant hoặc Maven) của ba sinh viên — An, Bình và Chi — dùng Windows và Mac. Mỗi tai nạn được tái hiện trong một lab rồi sửa; slide cho hình, bài học cho từng lệnh.</p>
<p>Các dòng terminal và đồ thị trên slide lấy từ các lần chạy thật của lab (git 2.51.1); tên người và mật khẩu trong dự án mẫu là bịa. Lab là một script, <code>lab18/tao-nhom.sh</code>; bài 18.7 dán một bản khởi động hai mươi dòng đủ để tự làm mọi bài tập bằng tay, và giải thích vì sao không dán nguyên script đầy đủ.</p>
</div>
${gallery('git-18', [
  [1, 'Bìa'], [2, 'Bản đồ chương'], [3, 'Ba loại tệp trong dự án NetBeans'], [4, 'Đã theo dõi rồi thì .gitignore vô tác dụng'],
  [5, 'Tệp đã xoá vẫn nằm trong lịch sử — xoay vòng mật khẩu'], [6, 'Hai người cùng chèn vào web.xml'], [7, 'Xoá dấu hiệu xung đột làm hỏng XML'],
  [8, 'PR để lâu: main đi xa dần'], [9, 'git pull = fetch + merge, và ba chỗ nó vấp'], [10, 'Hai người cùng đẩy lên main: lịch sử rẽ đôi'],
  [11, 'main ahead 2: dời việc sang nhánh rồi đưa main về origin/main'], [12, 'reset hay revert: hỏi một câu — commit đã rời máy chưa?'],
  [13, 'Merge không qua PR và merge có rào chắn'], [14, 'Hoàn tác merge: ORIG_HEAD, revert -m 1, và revert cái revert'],
  [15, 'Chẩn đoán năm lệnh, rồi sửa từng lớp'], [16, 'Bảng tra nhanh: triệu chứng → chẩn đoán → cách sửa → cách phòng'], [17, 'Thực hành cả chương'],
])}
`,
    },

