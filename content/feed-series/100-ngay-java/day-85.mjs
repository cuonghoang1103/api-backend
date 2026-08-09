/** "100 Ngày Java với CuongThai" — Ngày 85: Tìm kiếm bài viết (Blog API).
    Nối đúng chỗ Ngày 84 kết ("người đọc muốn ô tìm kiếm; gõ 'java' ra mọi bài
    về Java; từ LIKE ngây thơ tới full-text index").
    Ngày 86 (bình luận & thẻ, khép lô) trỏ ngược về phần kết.

    ⚠ LUẬT 6: dựng nguyên lý full-text bằng JDK thuần (chỉ mục ngược + giao +
    xếp hạng); thân bài dạy full-text PostgreSQL thật. Output là kết quả THẬT
    của javac/java JDK 21. */
export default {
  day: 85,
  card: 'java-day-85',
  category: 'Java',
  hashtags: ['100NgayJava', 'Java', 'HocLapTrinh'],
  codeLab: {
    track: 'java-core',
    slug: 'build-an-inverted-index-for-document-search',
    title: 'Tự dựng chỉ mục ngược cho tìm kiếm',
  },

  content: `🔎 100 NGÀY JAVA — NGÀY 85: TÌM KIẾM BÀI VIẾT

Blog của bạn lật trang được rồi. Nhưng người đọc còn muốn một thứ mọi trang đều có: một ô **tìm kiếm**. Gõ "java" là ra mọi bài về Java.

Nghe đơn giản. Nhưng làm cho *đúng* và *nhanh* thì có cả một thế giới phía sau — và trên đường đi bạn gặp lại đúng bài học chỉ mục của Ngày 66.

━━━━━━━━━━━━━━━━━━━━

🐌 CÁCH NGÂY THƠ: LIKE '%java%'

Bản năng đầu tiên là dùng \`LIKE\`:

\`\`\`sql
SELECT * FROM bai_viet WHERE noi_dung LIKE '%java%';
\`\`\`

Chạy được. Nhưng đo cái giá:

\`\`\`
1) LIKE '%java%' -> quet 5 bai (khong dung chi muc), ra [b1, b3, b5]
\`\`\`

Nó **quét từng bài**. Vì sao không dùng chỉ mục được? Nhớ Ngày 66: dấu \`%\` ở *đầu* mẫu khiến chỉ mục vô dụng — chỉ mục sắp theo phần đầu chuỗi, mà đây tìm chuỗi con ở giữa. Với 5 bài thì không sao. Với 50.000 bài, mỗi lần gõ tìm là quét cả 50.000 — chậm thấy rõ.

\`LIKE\` ổn cho tìm nhanh trên bảng nhỏ. Nhưng ô tìm kiếm chính của một blog thật cần thứ tốt hơn.

━━━━━━━━━━━━━━━━━━━━

📇 CÁCH ĐÚNG: CHỈ MỤC NGƯỢC

Đây là ý tưởng làm nền cho *mọi* máy tìm kiếm, từ Google tới thanh tìm trong app của bạn. Thay vì mỗi lần tìm lại quét toàn bộ văn bản, ta xây trước một **chỉ mục ngược** (inverted index): mỗi *từ* trỏ tới danh sách *các bài chứa nó*.

\`\`\`
"Hoc Java co ban"  ─┐
"Java Stream API"  ─┼─ java  -> [b1, b3, b5]
"Java Stream ..."  ─┘   stream -> [b3, b5]
                        api    -> [b3]
\`\`\`

\`\`\`
2) chi muc nguoc: 'java' -> [b1, b3, b5] (khong quet)
3) 'stream' -> [b3, b5]
\`\`\`

Giờ tìm "java" là **tra thẳng** vào chỉ mục lấy \`[b1, b3, b5]\` — không quét bài nào. Đảo ngược so với "duyệt từng bài xem có chứa từ không": ta hỏi "từ này nằm ở những bài nào". Đó là lý do tên gọi *ngược*.

━━━━━━━━━━━━━━━━━━━━

🔗 NHIỀU TỪ = GIAO CÁC TẬP

Người ta gõ "java stream" muốn bài có **cả hai** từ. Chỉ mục làm việc này bằng phép **giao tập**:

\`\`\`
4) 'java stream' (ca hai) -> giao([b1,b3,b5], [b3,b5]) = [b3, b5]
\`\`\`

Lấy danh sách bài của "java", danh sách của "stream", giao lại — ra những bài chứa cả hai. Nhanh, vì chỉ giao hai danh sách ngắn thay vì quét toàn văn.

━━━━━━━━━━━━━━━━━━━━

🏆 XẾP HẠNG: BÀI NÀO LIÊN QUAN HƠN?

Tìm ra 3 bài rồi, nhưng bài nào để *lên đầu*? Một tín hiệu đơn giản: từ khoá xuất hiện càng nhiều, bài càng liên quan.

\`\`\`
5) xep hang 'java' theo tan so -> dau la b5 (3 lan)
\`\`\`

Bài b5 nhắc "java" ba lần nên xếp trên b1, b3 (mỗi bài một lần). Đây là ý tưởng gốc của \`TF\` (term frequency) — máy tìm kiếm thật còn cân thêm nhiều yếu tố (từ hiếm quan trọng hơn, vị trí trong tiêu đề, độ mới...), nhưng cốt lõi là đây.

Và một bước không thể thiếu — **chuẩn hoá**:

\`\`\`
6) chuan hoa 'JAVA'='Java'='java' -> cung 1 khoa chi muc? true
\`\`\`

Gõ "JAVA", "Java" hay "java" đều phải ra cùng kết quả. Nên khi dựng chỉ mục và khi tìm, đều thường-hoá và (với tiếng Việt) bỏ dấu (Ngày 82) về cùng một dạng.

━━━━━━━━━━━━━━━━━━━━

✅ TRONG THỰC TẾ: ĐỪNG TỰ DỰNG, DÙNG FULL-TEXT CỦA POSTGRES

Chương trình hôm nay để *hiểu* cơ chế. Ở production, đừng tự dựng và tự bảo trì chỉ mục ngược — PostgreSQL có sẵn **tìm kiếm toàn văn** (full-text search) làm đúng những việc trên, tốt hơn:

\`\`\`sql
-- tsvector: văn bản đã tách từ + chuẩn hoá; tsquery: câu tìm
SELECT * FROM bai_viet
WHERE to_tsvector('simple', noi_dung) @@ to_tsquery('simple', 'java & stream')
ORDER BY ts_rank(to_tsvector('simple', noi_dung),
                 to_tsquery('simple', 'java & stream')) DESC;
\`\`\`

\`to_tsvector\` tách từ + chuẩn hoá (đúng bước "chuẩn hoá" ở trên), \`@@\` là phép khớp, \`ts_rank\` xếp hạng theo độ liên quan. Tạo một chỉ mục \`GIN\` trên cột \`tsvector\` là truy vấn nhanh trên hàng triệu bài. Bạn có full-text thật chỉ với vài dòng SQL, không phải viết một dòng Java nào.

Khi cần mạnh hơn nữa (gõ sai chính tả vẫn ra, đa ngôn ngữ, gợi ý) thì có **Elasticsearch** / **OpenSearch** — nhưng với 99% blog, full-text của Postgres là đủ và gọn.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Viết tìm kiếm bằng \`LIKE '%tu%'\`, đếm số bài phải quét.
2. Tự dựng một chỉ mục ngược \`Map<String, Set<Long>>\` cho vài bài (link Code Lab).
3. Tìm nhiều từ bằng phép giao các tập bài.
4. Xếp hạng kết quả theo số lần từ khoá xuất hiện.
5. Thử \`to_tsvector\`/\`to_tsquery\` của PostgreSQL trên một bảng thật.

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Tìm kiếm không phải \`LIKE '%x%'\` — cách đó quét cả bảng vì dấu \`%\` đầu vô hiệu chỉ mục (Ngày 66). Cách đúng là **chỉ mục ngược**: mỗi từ trỏ tới các bài chứa nó, tìm là tra thẳng; nhiều từ thì **giao tập**; xếp hạng theo **tần số**; và **chuẩn hoá** để gõ kiểu nào cũng ra. Ở thật, PostgreSQL có full-text (\`tsvector\`/\`ts_rank\`) làm sẵn tất cả — dùng nó, đừng tự dựng.

Blog giờ đăng bài, phân trang, tìm kiếm được. Nhưng nó vẫn là một chiều: tác giả nói, người đọc chỉ đọc. Một blog sống động cần **tương tác** — người đọc bình luận, và bài được gắn **thẻ** để gom theo chủ đề. Cả hai đều là chuyện *quan hệ giữa các bảng* mà Ngày 71 mới chạm tới: một bài nhiều bình luận, một bài nhiều thẻ và một thẻ nhiều bài.

Ngày 86: **Bình luận & thẻ** — quan hệ một-nhiều (bình luận) và **nhiều-nhiều** (thẻ) trong JPA, cách tránh lại bẫy N+1 khi tải chúng, và khép lô mười ngày với một Blog API đã ra dáng. Hẹn gặp lại!

#100NgayJava #Java #HocLapTrinh`,
};
