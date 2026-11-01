/** Giảng theo slide — bài 12.3 "Dựng trên PostgreSQL" (deck api-12-3, 6 slide). EN = dịch sát ý VI. */
import { walkApi } from '../_slides.mjs';

export default walkApi('api-12-3', 'Building on PostgreSQL', 'Dựng trên PostgreSQL', [
  [1, 'Cover', `<p>Same contract, same tests, a database underneath.</p>`, `<p>Cùng hợp đồng, cùng test, một CSDL bên dưới.</p>`],
  [2, 'Two stores', `<p>Routes call a store; the same 18 tests run on memory and on PostgreSQL.</p>`, `<p>Route gọi store; cùng 18 test chạy trên bộ nhớ và trên PostgreSQL.</p>`],
  [3, 'One pool', `<p>Seven pools became one; a wait timeout turns an empty pool into a fast 503.</p>`, `<p>Bảy pool thành một; thời hạn chờ biến pool cạn thành 503 nhanh.</p>`],
  [4, 'Connections', `<p>Instances times pool size must fit under max_connections.</p>`, `<p>Số instance nhân kích thước pool phải nằm dưới max_connections.</p>`],
  [5, 'Fifty at once', `<p>The exclusion constraint lets exactly one booking through; a row lock keeps the three-booking rule.</p>`, `<p>Ràng buộc loại trừ cho đúng một lượt qua; khoá dòng giữ luật ba lượt.</p>`],
  [6, 'Errors and pages', `<p>SQLSTATE codes map to HTTP in one place; pages come straight from an index.</p>`, `<p>Mã SQLSTATE đổi sang HTTP ở một chỗ; trang lấy thẳng từ index.</p>`],
]);
