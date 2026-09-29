/**
 * dbi-cs1.mjs — ⭐ Chuyên sâu CS.1: Lịch sử & hệ sinh thái CSDL (DBI202, deck tự dựng, 30/09/2026).
 * Xem REPO/DBI202/_PROMPT-CS.md và CHUYEN-SAU.md mục 1. Khuôn: _cs-chung.mjs.
 */
import { lamDeck, code } from './_cs-chung.mjs';

export const deck = { key: 'cs1', code: 'CS1', title: '⭐ Chuyên sâu 1 — Lịch sử & hệ sinh thái CSDL', sub: 'Từ tủ hồ sơ tới PostgreSQL & NoSQL' };

export const slides = lamDeck('LỊCH SỬ & HỆ SINH THÁI CSDL', [
  { cover: true, t: 'Lịch sử & hệ sinh thái CSDL', sub: 'Từ tủ hồ sơ giấy tới PostgreSQL, SQL Server, và NoSQL — 60 năm trong 20 trang' },

  { t: 'Trước 1970: dữ liệu nằm trong file, không có CSDL', body: `
<ul>
<li>Thập niên 1950–60: mỗi chương trình tự đọc/ghi <b>file riêng</b> (COBOL, thẻ đục lỗ) — gọi là <b>xử lý file (file processing)</b>.</li>
<li>Chương trình lương và chương trình nhân sự cùng lưu "tên nhân viên" ở <b>hai file khác nhau</b> ⇒ trùng lặp, sửa một nơi quên nơi kia.</li>
<li class="do">Không có ai đứng giữa chương trình và dữ liệu để kiểm soát — đó là lý do CSDL (database) và DBMS ra đời.</li>
</ul>
<div class="o">Ẩn dụ: <b>tủ hồ sơ giấy</b> của một công ty — mỗi phòng ban giữ một bộ hồ sơ riêng, muốn đối chiếu phải đi photocopy qua lại.</div>` },

  { t: 'Mô hình phân cấp (hierarchical) — IBM IMS, 1966–68', body: `
<ul>
<li>1966: IBM cùng North American Rockwell và Caterpillar xây hệ quản lý danh sách linh kiện (bill of materials) cho tên lửa <b>Saturn V</b> của chương trình <b>Apollo</b>.</li>
<li>Hệ chạy thật đầu tiên (ICS/DL/I) hoàn tất 1967 trên IBM System/360, vận hành chính thức tháng 8/1968 — trở thành <b>IBM IMS</b> (Information Management System), vẫn bán tới nay.</li>
<li>Dữ liệu tổ chức thành <b>cây</b>: mỗi bản ghi con có <span class="do">đúng một</span> cha. Ví dụ: Phòng ban → Nhân viên → Người phụ thuộc.</li>
</ul>
<div class="o do2">Nhược điểm: một sinh viên học 2 môn thì bản ghi môn đó phải <b>chép lại</b> dưới cả hai — vì cây không cho một con có hai cha.</div>` },

  { t: 'Mô hình mạng (network) — CODASYL / IDMS', body: `
<ul>
<li>1969: nhóm CODASYL (Conference on Data Systems Languages — cũng là nhóm tạo ra COBOL) công bố báo cáo <b>DBTG</b> (Database Task Group), chuẩn hoá <b>mô hình mạng</b>.</li>
<li>Khác cây: một bản ghi được phép có <span class="do">nhiều cha</span> — dữ liệu tổ chức thành <b>đồ thị</b> (graph) qua các con trỏ (pointer) nối trực tiếp.</li>
<li>Cài đặt nổi tiếng: <b>IDMS</b> (Integrated Database Management System, hãng Cullinane, đầu thập niên 1970).</li>
<li>Truy vấn phải <b>đi từng bước theo con trỏ</b> (navigational) — lập trình viên tự viết vòng lặp duyệt, không có "hỏi một câu, DBMS tự tìm đường".</li>
</ul>` },

  { t: 'Edgar F. Codd, 1970 — ý tưởng đổi cả ngành', body: `
<p class="y-chinh">🎯 Tháng 6/1970, Codd (nhà nghiên cứu IBM) công bố bài báo <span class="do">"A Relational Model of Data for Large Shared Data Banks"</span> trên tạp chí <i>Communications of the ACM</i>, tập 13, số 6, trang 377–387.</p>
<ul>
<li>Ý tưởng cốt lõi: dữ liệu là các <b>quan hệ (relation)</b> — về bản chất là <b>bảng</b> — không cần con trỏ, không cần biết dữ liệu "nằm vật lý ở đâu".</li>
<li>Người dùng chỉ cần nói <b>muốn gì</b> (khai báo — declarative), DBMS tự tính <b>cách lấy</b> — ngược hẳn với mô hình phân cấp/mạng phải tự duyệt con trỏ.</li>
<li>IBM ban đầu không vội thương mại hoá vì sợ ảnh hưởng doanh thu IMS — mở đường cho các nhóm khác đi trước.</li>
</ul>
<div class="o xanh">Đây là câu trả lời chuẩn cho câu hỏi "vì sao mô hình quan hệ ra đời": để <b>tách</b> cách người dùng nghĩ về dữ liệu khỏi cách máy lưu dữ liệu.</div>` },

  { t: 'System R & sự ra đời của SQL (IBM, 1974–79)', body: `
<ul>
<li>IBM San Jose Research lập dự án <b>System R</b> (1974) để kiểm chứng ý tưởng của Codd có xây được một DBMS thật hay không.</li>
<li>Nhóm System R thiết kế ngôn ngữ truy vấn <b>SEQUEL</b> (Structured English QUEry Language) — sau đổi thành <b>SQL</b> vì lý do nhãn hiệu (SEQUEL đã bị hãng khác đăng ký).</li>
<li>System R chứng minh được: hệ quan hệ có thể nhanh, có thể hỗ trợ giao dịch (transaction) — mở khoá cho cả ngành đi theo.</li>
</ul>
<div class="o">SQL không phải "tên gọi khác của mô hình quan hệ" — nó chỉ là <b>một</b> ngôn ngữ hiện thực hoá mô hình đó (và là ngôn ngữ thắng thế).</div>` },

  { t: 'Ingres — đối thủ song song ở Berkeley', body: `
<ul>
<li>Cùng thời với System R, nhóm <b>Michael Stonebraker</b> và Eugene Wong tại UC Berkeley xây <b>Ingres</b> (Interactive Graphics and Retrieval System, bắt đầu 1973).</li>
<li>Ingres dùng ngôn ngữ riêng <b>QUEL</b> trước khi SQL trở thành chuẩn chung của ngành.</li>
<li>Ingres về sau thương mại hoá (Relational Technology Inc. → Ingres Corp., nay là Actian) và là <b>tổ tiên trực tiếp</b> của Postgres/PostgreSQL (slide sau).</li>
</ul>` },

  { t: 'Oracle — bản thương mại SQL đầu tiên, 1979', body: `
<ul>
<li>Larry Ellison, Bob Miner, Ed Oates lập Software Development Laboratories (1977), đọc bài báo Codd và bản thiết kế System R (IBM công bố công khai).</li>
<li>1979: công ty (khi đó đã đổi tên Relational Software Inc.) tung ra <b>Oracle version 2</b> — DBMS quan hệ dùng SQL <span class="do">bán ra thị trường đầu tiên</span>, chạy trên PDP-11.</li>
<li>Đặt tên "version 2" (bỏ qua v1) vì tin khách hàng ngại mua sản phẩm "phiên bản 1".</li>
<li>Oracle đi trước cả IBM (khi đó vẫn ưu tiên IMS) trong việc thương mại hoá SQL — một lợi thế lịch sử Oracle giữ tới hôm nay.</li>
</ul>` },

  { t: 'Sybase → SQL Server — khởi đầu 1988–1989', body: `
<ul>
<li>1984: Mark Hoffman và Bob Epstein lập <b>Sybase</b>, xây DBMS SQL Server chạy trên Unix.</li>
<li>Tháng 1/1988: Microsoft bắt tay với Sybase và Ashton-Tate để đưa Sybase SQL Server lên <b>OS/2</b> của IBM/Microsoft.</li>
<li>1989: <b>Ashton-Tate/Microsoft SQL Server 1.0</b> phát hành — đây là gốc gác của SQL Server ngày nay; Ashton-Tate rút lui ngay sau đó.</li>
<li>1990: SQL Server 1.1 hỗ trợ thêm Windows.</li>
</ul>` },

  { t: 'SQL Server tách hẳn khỏi Sybase', body: `
<ul>
<li>Microsoft và Sybase tiếp tục hợp tác tới <b>1994</b>: sau đó Microsoft giữ toàn quyền phát triển SQL Server trên Windows, Sybase đi hướng riêng (đổi tên dòng sản phẩm thành <b>Adaptive Server Enterprise</b>).</li>
<li><b>SQL Server 7.0 (1998)</b> là bản viết lại gần như toàn bộ engine lưu trữ — mốc được xem là SQL Server <span class="do">tách hẳn</span> khỏi mã gốc Sybase.</li>
<li>Từ đó hai sản phẩm phát triển độc lập: SQL Server (Microsoft) và Adaptive Server Enterprise / SAP ASE (Sybase, sau này SAP mua lại).</li>
</ul>
<div class="o">Vì sao cần biết: một số cú pháp T-SQL cổ (ví dụ kiểu con trỏ, một vài hàm hệ thống) vẫn còn dấu vết di sản Sybase.</div>` },

  { t: 'Postgres — hậu duệ của Ingres tại Berkeley, 1986', body: `
<ul>
<li>Sau khi rời dự án Ingres, Stonebraker quay lại Berkeley và khởi động dự án kế tiếp: <b>POSTGRES</b> ("post-Ingres"), bắt đầu triển khai năm <b>1986</b>.</li>
<li>Mục tiêu: giải quyết những gì Ingres (và các hệ quan hệ thời đó) còn thiếu — kiểu dữ liệu do người dùng tự định nghĩa, quan hệ giữa các bảng phức tạp hơn (hướng tới hướng đối tượng).</li>
<li>Dự án được DARPA, Army Research Office, NSF và ESL Inc. tài trợ; kết thúc ở bản Berkeley 4.2.</li>
<li>POSTGRES ban đầu dùng ngôn ngữ truy vấn riêng (PostQuel), <span class="do">chưa có SQL</span>.</li>
</ul>` },

  { t: 'PostgreSQL — đổi tên khi có SQL, 1996', body: `
<ul>
<li>1994: hai sinh viên Andrew Yu và Jolly Chen thêm bộ dịch <b>SQL</b> vào POSTGRES, phát hành ra ngoài với tên <b>Postgres95</b> — mã nguồn mở hoàn toàn bằng ANSI C.</li>
<li>1996: nhóm phát triển đổi tên thành <b>PostgreSQL</b> để vừa giữ gốc "Postgres" vừa nêu rõ hỗ trợ SQL; đánh số phiên bản lại từ <b>6.0</b> (nối tiếp mạch số của POSTGRES Berkeley).</li>
<li>Từ đó PostgreSQL là dự án mã nguồn mở cộng đồng, không công ty nào sở hữu — đây là lý do license PostgreSQL rất thoáng (không như MySQL bị Oracle mua).</li>
</ul>
<div class="o xanh">Vì sao đồ án/đi làm của bạn hay chọn PostgreSQL: mã nguồn mở thật sự, miễn phí hoàn toàn kể cả dùng thương mại, cộng đồng lớn, chuẩn SQL tuân thủ tốt.</div>` },

  { t: 'MySQL — 1995, hướng web', body: `
<ul>
<li>1995: Michael "Monty" Widenius, David Axmark, Allan Larsson (Thuỵ Điển) phát hành <b>MySQL</b>, đặt theo tên con gái của Monty ("My").</li>
<li>Thiết kế ưu tiên <b>đơn giản và nhanh</b> cho web (thời kỳ đầu engine lưu trữ MyISAM không hỗ trợ giao dịch đầy đủ) — rất hợp với PHP thời kỳ LAMP stack bùng nổ.</li>
<li>2008 Sun Microsystems mua MySQL AB; 2010 Oracle mua lại Sun ⇒ MySQL hiện thuộc <b>Oracle</b>. Nhánh cộng đồng tách ra thành <b>MariaDB</b> (do chính Monty lập, lo ngại Oracle đóng mã nguồn).</li>
</ul>` },

  { t: 'Một ngôn ngữ, nhiều chuẩn: SQL-86 → SQL:2023', body: `
<p>SQL trở thành chuẩn ANSI/ISO, cập nhật định kỳ:</p>
<table>
<tr><th>Chuẩn</th><th>Năm</th><th>Điểm mới chính</th></tr>
<tr><td>SQL-86</td><td>1986</td><td>Chuẩn ANSI đầu tiên: SELECT/INSERT/UPDATE/DELETE cơ bản</td></tr>
<tr><td>SQL-89</td><td>1989</td><td>Ràng buộc toàn vẹn: PRIMARY KEY, FOREIGN KEY, CHECK</td></tr>
<tr><td>SQL-92</td><td>1992</td><td>Cú pháp JOIN tường minh, outer join</td></tr>
<tr><td>SQL:1999</td><td>1999</td><td>Truy vấn đệ quy, kiểu dữ liệu mới, trigger</td></tr>
<tr><td>SQL:2003</td><td>2003</td><td><b>Window function</b>, cột tự tăng chuẩn hoá (identity)</td></tr>
<tr><td>SQL:2011</td><td>2011</td><td>Dữ liệu theo thời gian (temporal)</td></tr>
<tr><td>SQL:2016</td><td>2016</td><td>JSON</td></tr>
<tr><td>SQL:2023</td><td>2023</td><td>Kiểu dữ liệu thuộc tính đồ thị (property graph queries)</td></tr>
</table>
<p class="nho">Không hãng nào tuân thủ 100% chuẩn — mỗi DBMS thêm phần mở rộng riêng (T-SQL của SQL Server, PL/pgSQL của PostgreSQL).</p>` },

  { t: 'Vì sao NoSQL ra đời (2000s)', body: `
<ul>
<li>Các công ty web quy mô cực lớn (Google, Amazon, Facebook) gặp bài toán mô hình quan hệ truyền thống khó giải rẻ: <b>hàng tỷ</b> bản ghi, ghi liên tục, phải chạy trên <b>hàng nghìn máy rẻ tiền</b> thay vì một máy chủ mạnh.</li>
<li><b>Định lý CAP</b> (Eric Brewer, 2000): một hệ phân tán chỉ giữ được tối đa 2 trong 3 tính chất — Consistency (nhất quán), Availability (luôn sẵn sàng), Partition tolerance (chịu được mạng đứt đoạn). RDBMS truyền thống thiên về Consistency.</li>
<li>NoSQL đánh đổi: <b>bớt ràng buộc</b> (không JOIN phức tạp, đôi khi nhất quán "cuối cùng" — eventual consistency) để đổi lấy <b>mở rộng ngang (horizontal scale)</b> dễ dàng và tốc độ ghi cực nhanh.</li>
</ul>
<div class="o do2">NoSQL <span class="do">không thay thế</span> mô hình quan hệ — nó giải một lớp bài toán khác (dữ liệu khổng lồ, ít ràng buộc, đọc/ghi cực nhanh).</div>` },

  { t: 'NoSQL — bốn họ chính', body: `
<table>
<tr><th>Loại</th><th>Ví dụ</th><th>Hợp với</th></tr>
<tr><td>Key–value</td><td><b>Redis</b> (2009, Salvatore Sanfilippo)</td><td>cache, session, hàng đợi</td></tr>
<tr><td>Document</td><td><b>MongoDB</b> (2009, 10gen)</td><td>dữ liệu dạng JSON lồng nhau, schema hay đổi</td></tr>
<tr><td>Wide-column</td><td><b>Cassandra</b> (2008, Facebook, sau thành Apache)</td><td>ghi cực lớn, nhiều trung tâm dữ liệu</td></tr>
<tr><td>Graph</td><td>Neo4j (2007)</td><td>quan hệ nhiều tầng: mạng xã hội, gợi ý</td></tr>
</table>
<p>Thuật ngữ "NoSQL" (thường hiểu là "not only SQL") được cộng đồng dùng phổ biến từ khoảng 2009, gắn với một loạt buổi gặp mặt (meetup) ở San Francisco bàn về các hệ CSDL phi quan hệ mới nổi.</p>` },

  { t: 'NewSQL — muốn cả hai thế giới', body: `
<ul>
<li>Thuật ngữ xuất hiện khoảng đầu thập niên 2010: các hệ cố giữ <b>SQL + ACID</b> (như RDBMS truyền thống) nhưng vẫn <b>mở rộng ngang</b> như NoSQL.</li>
<li>Ví dụ: Google Spanner, CockroachDB, TiDB — phân tán dữ liệu trên nhiều máy nhưng vẫn hỗ trợ giao dịch nhất quán mạnh và cú pháp gần chuẩn SQL.</li>
<li>Đánh đổi: kiến trúc phức tạp hơn nhiều, độ trễ mạng giữa các node ảnh hưởng tốc độ giao dịch.</li>
</ul>` },

  { t: 'Vì sao mô hình quan hệ vẫn thắng thế', body: `
<ul>
<li><b>Toán học vững</b>: đại số quan hệ (relational algebra) cho phép DBMS <b>tối ưu truy vấn tự động</b> — người dùng khai báo "muốn gì", không cần tự viết vòng lặp duyệt.</li>
<li><b>ACID</b> (Atomicity, Consistency, Isolation, Durability) bảo đảm giao dịch đúng — quan trọng sống còn với tiền bạc, hàng tồn kho.</li>
<li>Hơn 50 năm công cụ, người biết SQL, tài liệu, kinh nghiệm vận hành — chi phí chuyển đổi rất lớn.</li>
<li>Phần lớn ứng dụng doanh nghiệp có <b>quan hệ rõ ràng</b> giữa các thực thể (khách hàng – đơn hàng – sản phẩm) — đúng bài toán JOIN được sinh ra để giải.</li>
</ul>
<p class="meo">🧠 Thực tế: đa số hệ thống lớn dùng <b>cả hai</b> — RDBMS cho dữ liệu lõi (giao dịch, tiền), NoSQL cho phần phụ trợ (cache, log, tìm kiếm).</p>` },

  { t: 'CSDL trong đời thật', body: `
<div class="hai">
<div class="o">🏦 <b>Ngân hàng</b><br>Mỗi giao dịch chuyển khoản phải <b>ACID</b> tuyệt đối — trừ tiền tài khoản A và cộng tiền tài khoản B phải cùng thành công hoặc cùng thất bại, không có nửa chừng.</div>
<div class="o xanh">🛒 <b>Thương mại điện tử</b><br>Đơn hàng, tồn kho, thanh toán trong RDBMS; gợi ý sản phẩm, log hành vi, tìm kiếm thường dùng thêm NoSQL/search engine bên cạnh.</div>
</div>
<div class="o do2" style="margin-top:14px">🎓 <b>Ứng dụng trường học (như FAP)</b><br>Sinh viên – Lớp – Môn học – Điểm là các bảng có <b>khoá ngoại</b> ràng buộc chặt: không thể có điểm của một sinh viên không tồn tại — đúng bài toán CSDL quan hệ.</div>` },

  { t: 'Bảng so sánh 4 hệ CSDL phổ biến', body: `
<table>
<tr><th></th><th>SQL Server</th><th>PostgreSQL</th><th>MySQL</th><th>Oracle</th></tr>
<tr><td>Giấy phép</td><td>Thương mại (có bản Express miễn phí, giới hạn)</td><td>Mã nguồn mở, miễn phí</td><td>Mã nguồn mở (GPL) + bản trả phí</td><td>Thương mại, đắt</td></tr>
<tr><td>Hệ điều hành</td><td>Windows, Linux (từ 2017)</td><td>Windows, Linux, macOS</td><td>Đa nền tảng</td><td>Đa nền tảng</td></tr>
<tr><td>Ai thường dùng</td><td>doanh nghiệp dùng hệ Microsoft (.NET)</td><td>startup, đồ án, hệ cần chuẩn SQL mạnh</td><td>web (PHP/WordPress), scale-out đọc nhiều</td><td>ngân hàng, tập đoàn lớn, hệ cũ (legacy)</td></tr>
<tr><td>Khi nào chọn</td><td>đã có hạ tầng Microsoft, cần SSRS/SSIS</td><td>cần JSON, GIS, extension mạnh, chi phí thấp</td><td>đọc nhiều hơn ghi, cần đơn giản/nhanh</td><td>cần hỗ trợ 24/7 cấp doanh nghiệp, đã có hợp đồng Oracle</td></tr>
</table>
<p class="nho">Đây là bức tranh chung — mỗi hãng đều có ngoại lệ và bản miễn phí/giới hạn riêng.</p>` },

  { t: 'Sự cố thật: GitLab xoá nhầm CSDL production (31/01/2017)', body: `
<ul>
<li>Một kỹ sư GitLab định xoá dữ liệu ở máy <b>replica</b> (bản sao) đang gặp lỗi đồng bộ, nhưng chạy nhầm lệnh xoá thư mục dữ liệu PostgreSQL trên máy <b>primary</b> (chính) đang phục vụ production.</li>
<li>Khoảng <b>300 GB</b> dữ liệu biến mất chỉ trong 1–2 giây; khi cần khôi phục thì <b>cả 5 cơ chế sao lưu</b> (backup) đang dùng đều không hoạt động đúng như kỳ vọng.</li>
<li>GitLab.com ngừng hoạt động khoảng <b>18 giờ</b>, mất vĩnh viễn khoảng <b>6 giờ dữ liệu</b> (project, comment, tài khoản mới tạo trong khoảng 17:20–00:00 UTC).</li>
<li>GitLab công khai toàn bộ quá trình khôi phục (bài postmortem + video livestream) — trở thành ví dụ kinh điển ngành về tầm quan trọng của việc <b>thử khôi phục backup định kỳ</b>, không chỉ tạo backup.</li>
</ul>
<div class="o do2">Bài học cho môn này: sao lưu (backup) không có nghĩa lý gì nếu chưa từng <b>thử phục hồi (restore) thành công</b> ít nhất một lần.</div>` },

  { t: 'SQL chạy thật — cùng một câu hỏi, hai hệ khác nhau', body: `
<p>Cả hai đều trả lời "phiên bản đang chạy là gì" — nhưng khai báo khác cú pháp:</p>
${code(`-- SQL Server\nSELECT @@VERSION;`, 'sql')}
${code(`-- PostgreSQL\nSELECT version();`, 'sql')}
<p class="meo">🧠 Đây chính là ý "khai báo cái gì, không nói làm thế nào": bạn không cần biết SQL Server lưu chuỗi phiên bản ở đâu trong bộ nhớ — chỉ cần gọi đúng hàm/biến hệ thống của từng DBMS.</p>` },

  { t: 'Vài khác biệt cú pháp tiêu biểu SQL Server ↔ PostgreSQL', body: `
<table>
<tr><th>Việc</th><th>SQL Server</th><th>PostgreSQL</th></tr>
<tr><td>Lấy N dòng đầu</td><td><code>SELECT TOP 5 * FROM t</code></td><td><code>SELECT * FROM t LIMIT 5</code></td></tr>
<tr><td>Cột tự tăng</td><td><code>id INT IDENTITY(1,1)</code></td><td><code>id INT GENERATED ALWAYS AS IDENTITY</code></td></tr>
<tr><td>Thời điểm hiện tại</td><td><code>GETDATE()</code></td><td><code>now()</code></td></tr>
<tr><td>Thay NULL</td><td><code>ISNULL(x, 0)</code></td><td><code>COALESCE(x, 0)</code></td></tr>
<tr><td>Nối chuỗi</td><td><code>'Xin ' + N'chào'</code></td><td><code>'Xin ' || 'chào'</code></td></tr>
<tr><td>Kế hoạch thực thi</td><td>Execution Plan (đồ hoạ trong SSMS)</td><td><code>EXPLAIN ANALYZE</code></td></tr>
</table>
<p class="pitfall">⚠️ Bẫy hay gặp: chép nguyên câu T-SQL sang PostgreSQL rồi báo lỗi "cú pháp sai" — hai hệ <b>cùng chuẩn SQL nền</b> nhưng phần mở rộng (TOP, IDENTITY, hàm ngày giờ…) luôn khác nhau, phải tra riêng từng hệ.</p>` },

  { t: 'Lộ trình sự nghiệp liên quan tới CSDL', body: `
<div class="hai">
<div class="o">💻 <b>Backend developer</b><br>Thiết kế bảng, viết truy vấn, tối ưu index cho API — kỹ năng CSDL là một phần công việc hằng ngày, không phải môn học riêng.</div>
<div class="o xanh">🗄️ <b>DBA (Database Administrator)</b><br>Vận hành: backup/restore, tuning hiệu năng, phân quyền, giám sát 24/7 — chuyên sâu vào MỘT hệ (SQL Server DBA, Oracle DBA…).</div>
</div>
<div class="o do2" style="margin-top:14px">📊 <b>Data engineer</b><br>Xây pipeline chuyển dữ liệu giữa nhiều hệ (RDBMS → kho dữ liệu/data warehouse → công cụ phân tích), thường làm việc với cả SQL lẫn NoSQL cùng lúc.</div>
<p class="nho">Cả ba nghề đều bắt đầu từ đúng những gì môn DBI202 dạy: mô hình quan hệ, SQL, chuẩn hoá, chỉ mục, giao dịch.</p>` },

  { t: 'Tổng kết — dòng thời gian 60 năm', body: `
<table>
<tr><th>Năm</th><th>Mốc</th></tr>
<tr><td>1966–69</td><td>IBM IMS phân cấp (Apollo); CODASYL DBTG — mô hình mạng</td></tr>
<tr><td>1970</td><td>Codd công bố mô hình quan hệ</td></tr>
<tr><td>1974–79</td><td>System R (IBM) → SQL; Ingres (Berkeley)</td></tr>
<tr><td>1979</td><td>Oracle v2 — RDBMS SQL thương mại đầu tiên</td></tr>
<tr><td>1986</td><td>SQL-86 chuẩn hoá; Postgres bắt đầu ở Berkeley</td></tr>
<tr><td>1989</td><td>SQL Server 1.0 (Microsoft/Sybase/Ashton-Tate)</td></tr>
<tr><td>1995–96</td><td>MySQL ra đời; Postgres95 đổi tên PostgreSQL</td></tr>
<tr><td>2008–09</td><td>Cassandra, Redis, MongoDB — làn sóng NoSQL</td></tr>
<tr><td>2011→</td><td>NewSQL; SQL vẫn cập nhật chuẩn (SQL:2023)</td></tr>
</table>
<p class="do nho">Không hệ nào "thắng tuyệt đối" — mỗi hệ giải đúng bài toán nó sinh ra để giải.</p>` },
]);
