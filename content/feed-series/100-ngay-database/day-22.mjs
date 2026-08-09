/** "100 Ngày Database với CuongThai" — Ngày 22: Khoá.
    Khoá ứng viên/chính, khoá tự nhiên vs thay thế (surrogate), thực hành dùng
    cả hai (id PK + UNIQUE natural), khoá tổng hợp (composite).

    ⚠ proof.lines trong thẻ là OUTPUT THẬT của psql (PostgreSQL 15.4, DB
    hoc_db_day22). Ghi chú SQL Server (IDENTITY thay SERIAL). */
export default {
  day: 22,
  card: 'db-day-22',
  category: 'Database',
  hashtags: ['100NgayDatabase', 'Database', 'PostgreSQL', 'SQL'],
  codeLab: {
    track: 'sql',
    slug: 'combine-a-surrogate-identity-key-with-a-natural-unique-key',
    title: 'Kết hợp khoá thay thế với khoá tự nhiên',
  },

  content: `🗄️ 100 NGÀY DATABASE — NGÀY 22: KHOÁ — CHỌN ĐỊNH DANH CHO BẢNG

Ngày 21 ta cho mỗi bảng một \`SERIAL id\` làm khoá chính — nhưng chưa hỏi: *đó có phải lựa chọn đúng không?* Nên dùng một mã có sẵn (số CMND, mã SKU, email) làm khoá, hay tự sinh một id vô nghĩa? Quyết định tưởng nhỏ này ảnh hưởng tới **toàn bộ** hệ thống về sau: khoá là thứ mọi bảng khác *tham chiếu tới*, nên chọn sai là sửa rất đau. Hôm nay ta làm rõ các loại khoá và cách chọn. Kết quả là thật từ psql.

━━━━━━━━━━━━━━━━━━━━

🗝️ KHOÁ ỨNG VIÊN VÀ KHOÁ CHÍNH

- **Khoá ứng viên (candidate key)** — bất kỳ cột (hoặc nhóm cột) nào định danh **duy nhất** một dòng. Một bảng có thể có nhiều khoá ứng viên (ví dụ \`san_pham\` có thể định danh bằng \`id\`, bằng \`ma_sku\`, hoặc bằng \`ten\` nếu tên không trùng).
- **Khoá chính (primary key)** — khoá ứng viên bạn **chọn** làm định danh chính thức. Nó tự động \`NOT NULL\` + \`UNIQUE\`, và là cái mà khoá ngoại của bảng khác trỏ tới. Mỗi bảng có đúng một khoá chính.

Ba phẩm chất của một khoá chính tốt: **duy nhất**, **không NULL**, và **bất biến** (không đổi giá trị theo thời gian). Chính chữ "bất biến" dẫn ta tới câu hỏi lớn tiếp theo.

━━━━━━━━━━━━━━━━━━━━

🆔 KHOÁ TỰ NHIÊN vs KHOÁ THAY THẾ

Hai trường phái chọn khoá chính:

- **Khoá tự nhiên (natural key)** — dùng một dữ liệu *có sẵn, có ý nghĩa*: mã SKU sản phẩm, email người dùng, số CMND. Ưu: gọn (không cần cột thừa), tự mang ý nghĩa. Nhược: **có thể đổi** (người dùng đổi email) hoặc **bị tái dùng**, và khi đó *mọi* bảng tham chiếu tới nó đều phải sửa theo — cơn ác mộng.
- **Khoá thay thế (surrogate key)** — một id *vô nghĩa, tự sinh* (\`SERIAL\`/\`IDENTITY\`, hoặc UUID). Ưu: **bất biến tuyệt đối**, không bao giờ đổi, an toàn để tham chiếu mãi mãi. Nhược: vô nghĩa (nhìn \`id = 4712\` không biết là gì), cần một cột thừa.

━━━━━━━━━━━━━━━━━━━━

✅ THỰC HÀNH TỐT: DÙNG **CẢ HAI**

Cách nhiều hệ thống chọn (và cũng là mặc định tốt): **khoá thay thế làm \`PRIMARY KEY\`** (để tham chiếu ổn định), **cộng một \`UNIQUE\` trên khoá tự nhiên** (để chống trùng nghiệp vụ):

\`\`\`sql
CREATE TABLE san_pham (
  id     SERIAL PRIMARY KEY,       -- surrogate: bất biến, dùng cho khoá ngoại
  ma_sku TEXT NOT NULL UNIQUE,     -- natural: chống hai sản phẩm cùng mã
  ten    TEXT NOT NULL
);
\`\`\`

Cả hai đều định danh được một dòng — nhưng mỗi cái một vai:

\`\`\`sql
SELECT id, ma_sku, ten FROM san_pham WHERE id = 1;             -- -> SKU-001 Ban phim
SELECT id, ma_sku, ten FROM san_pham WHERE ma_sku = 'SKU-002'; -- -> Chuot
\`\`\`

Và \`UNIQUE\` chặn hai sản phẩm trùng mã nghiệp vụ:

\`\`\`sql
INSERT INTO san_pham (ma_sku, ten) VALUES ('SKU-001', 'Hang khac');
\`\`\`

\`\`\`
ERROR:  duplicate key value violates unique constraint "san_pham_ma_sku_key"
DETAIL:  Key (ma_sku)=(SKU-001) already exists.
\`\`\`

Bạn được cái tốt của cả hai: id \`ổn định\` để nối bảng, mã \`ma_sku\` để con người dùng và để đảm bảo không trùng.

━━━━━━━━━━━━━━━━━━━━

🔗 KHOÁ TỔNG HỢP (COMPOSITE KEY)

Đôi khi *không cột đơn nào* định danh được một dòng — mà cần **nhiều cột cùng nhau**. Kinh điển là bảng nối "sinh viên đăng ký môn học": mỗi *cặp* (sinh viên, môn học) chỉ được đăng ký một lần:

\`\`\`sql
CREATE TABLE dang_ky (
  sinh_vien_id INT,
  mon_hoc_id   INT,
  PRIMARY KEY (sinh_vien_id, mon_hoc_id)   -- khoá gồm HAI cột
);
INSERT INTO dang_ky VALUES (1, 10), (1, 11), (2, 10);   -- OK
INSERT INTO dang_ky VALUES (1, 10);                     -- trùng cặp!
\`\`\`

\`\`\`
ERROR:  duplicate key value violates unique constraint "dang_ky_pkey"
DETAIL:  Key (sinh_vien_id, mon_hoc_id)=(1, 10) already exists.
\`\`\`

Cặp (1,10) đã tồn tại nên bị chặn — nhưng (2,11) khác cặp thì vẫn thêm được bình thường. Khoá tổng hợp diễn tả chính xác luật "mỗi tổ hợp là duy nhất", và là công cụ chuẩn cho bảng nối nhiều–nhiều (ta gặp lại ở Ngày 28).

*(Ghi chú: nhiều đội vẫn thích thêm một \`id\` surrogate cho cả bảng nối, và để cặp cột kia là \`UNIQUE\` — để bảng nối cũng dễ được tham chiếu. Cả hai cách đều dùng được.)*

━━━━━━━━━━━━━━━━━━━━

🔄 POSTGRESQL vs SQL SERVER

Khái niệm khoá **giống hệt** hai hệ. Chỉ khác cách sinh khoá thay thế: PostgreSQL \`SERIAL\`/\`GENERATED ... AS IDENTITY\`, SQL Server \`IDENTITY(1,1)\`. \`UNIQUE\`, khoá tổng hợp \`PRIMARY KEY (a, b)\` viết y như nhau. Về UUID làm surrogate: PostgreSQL có kiểu \`uuid\` + \`gen_random_uuid()\`, SQL Server có \`UNIQUEIDENTIFIER\` + \`NEWID()\` — cùng ý tưởng.

━━━━━━━━━━━━━━━━━━━━

✍️ BÀI TẬP NHỎ

1. Với bảng \`nguoi_dung\`, chọn khoá chính và giải thích: dùng \`email\` (natural) hay \`id\` (surrogate)?
2. Thêm \`UNIQUE\` cho một khoá tự nhiên vào bảng \`san_pham\` của bạn, rồi thử chèn trùng.
3. Thiết kế bảng nối "diễn viên đóng phim" với khoá tổng hợp phù hợp.
4. Vì sao email làm khoá chính lại rủi ro khi người dùng đổi email?

━━━━━━━━━━━━━━━━━━━━

🎯 KẾT LUẬN

Khoá chính là định danh mà cả hệ thống tựa vào, nên nó phải **duy nhất, không NULL, và bất biến**. Khoá tự nhiên có ý nghĩa nhưng dễ đổi; khoá thay thế vô nghĩa nhưng bền — và mặc định tốt là **dùng cả hai** (\`id\` surrogate làm PK + \`UNIQUE\` cho mã nghiệp vụ). Khi cần định danh bằng tổ hợp cột, dùng khoá tổng hợp. Chọn khoá đúng ngay từ đầu tiết kiệm cho bạn vô số đau đớn về sau.

Giờ ta đã biết chọn khoá. Nhưng vẫn còn câu hỏi lớn nhất của thiết kế: *dữ liệu nên chia thành những bảng nào?* Nhồi tất cả vào một bảng khổng lồ thì sao? Ngày mai ta xem tận mắt những gì hỏng khi thiết kế sai — các "dị thường" khiến dữ liệu tự mâu thuẫn.

Ngày 23: **Dị thường dữ liệu** — vì sao một bảng "gộp tất cả" gây dư thừa và các dị thường khi thêm/sửa/xoá, và đó là động lực cho chuẩn hoá. Hẹn gặp lại!

#100NgayDatabase #Database #PostgreSQL`,
};
