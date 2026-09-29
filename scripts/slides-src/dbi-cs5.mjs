/**
 * dbi-cs5.mjs — DBI202 ⭐ Chuyên sâu 5: SQL NÂNG CAO (mức đi làm / phỏng vấn). Deck tự dựng, không phải slide trường.
 * Đi TIẾP từ Chương 6 của trường (dbi7b: SELECT, JOIN, subquery, GROUP BY/HAVING): hàm cửa sổ, CTE & CTE đệ quy,
 * top-N mỗi nhóm, gaps & islands, PIVOT/UNPIVOT, MERGE/ON CONFLICT, OUTPUT/RETURNING, phân trang keyset, JSON,
 * STRING_AGG/ROLLUP, NOT IN vs NOT EXISTS.
 * Mọi con số / bảng trên slide lấy từ output THẬT của flm-nguon/DBI202/gen/sql/cs5/*.sql
 * (Azure SQL Edge 15.0 = lõi SQL Server 2019 + PostgreSQL 16).
 * Render: node scripts/_render-slides.mjs --deck scripts/slides-src/dbi-cs5.mjs --out <dir>
 */
import { lamDeck, code } from './_cs-chung.mjs';

export const deck = { key: 'cs5', code: 'CS5', title: 'SQL nâng cao', sub: 'DBI202 · ⭐ Chuyên sâu' };

const C = { cam: '#e08a1e', nau: '#b85a2b', xam: '#404040', nhat: '#fff7ef', xanh: '#2f7d4f', xnhat: '#f1f9f4', lam: '#1b5fa8', lnhat: '#eef5fc', do: '#e02020' };
const sm = (src) => code(src, 'sql', 'sm');

/* ── Slide 6: ba cửa sổ của cùng dòng "Võ Việt Anh" ── */
const NV1 = [['Trần Minh Quang', '150 000'], ['Hoàng Thị Hà', '90 000'], ['Võ Việt Anh', '60 000'], ['Lê Thị Lan Anh', '45 000']];
const khung = (tieuDe, over, tu, den, tong) => `<div style="border:2px solid ${C.cam};border-radius:10px;padding:10px 12px;background:#fff">
<div style="font-weight:700;font-size:19px;color:${C.nau};margin-bottom:4px">${tieuDe}</div>
<div style="font-family:Menlo,monospace;font-size:14px;color:#555;margin-bottom:8px;min-height:40px">${over}</div>
<table style="font-size:17px">${NV1.map(([t, l], i) => {
  const trong = i >= tu && i <= den; const hien = i === 2;
  return `<tr><td style="background:${trong ? '#ffe2b8' : '#fff'};${hien ? `outline:3px solid ${C.do};outline-offset:-3px;font-weight:700` : ''}">${t}</td><td style="background:${trong ? '#ffe2b8' : '#fff'};text-align:right">${l}</td></tr>`;
}).join('')}</table>
<div style="margin-top:8px;font-size:19px">SUM = <b class="do">${tong}</b></div></div>`;
const baCuaSo = `<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px">
${khung('① Cả phân vùng', 'OVER (PARTITION BY depNum)', 0, 3, '345 000')}
${khung('② Từ đầu tới dòng này', 'OVER (PARTITION BY depNum<br>ORDER BY lương DESC ROWS<br>UNBOUNDED PRECEDING)', 0, 2, '300 000')}
${khung('③ Dòng trước + sau', 'OVER (… ORDER BY lương DESC<br>ROWS BETWEEN 1 PRECEDING<br>AND 1 FOLLOWING)', 1, 3, '195 000')}
</div>`;

/* ── Slide 11: cây nhân viên FUHCompany ── */
const nut = (x, y, w, t, { fill = '#fff', stroke = C.cam } = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="34" rx="7" fill="${fill}" stroke="${stroke}" stroke-width="2"/>` +
  `<text x="${x + w / 2}" y="${y + 23}" text-anchor="middle" font-size="15" font-weight="700" fill="${C.xam}">${t}</text>`;
const noi = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#b0b0b0" stroke-width="2"/>`;
const cap1 = [['Hà', 160], ['Bảo', 420], ['Mai', 680], ['Tài', 860], ['Tâm', 1010]];
const cap2 = [['V. Anh', 95, 160], ['L. Anh', 225, 160], ['An', 330, 420], ['Hân', 420, 420], ['T. Anh', 510, 420], ['Nam', 630, 680], ['Thu', 730, 680], ['Nghĩa', 1010, 1010]];
const cayNV = `<svg width="1100" height="190" viewBox="0 0 1100 190" xmlns="http://www.w3.org/2000/svg" style="font-family:Arial,sans-serif;display:block;margin:0 auto">
${cap1.map(([, x]) => noi(550, 36, x, 76)).join('')}
${cap2.map(([, x, p]) => noi(p, 110, x, 146)).join('')}
${nut(470, 2, 160, 'Quang (cấp 0)', { fill: '#ffe2b8' })}
${cap1.map(([t, x]) => nut(x - 45, 76, 90, t, { fill: C.nhat })).join('')}
${cap2.map(([t, x]) => nut(x - 42, 146, 84, t, { stroke: '#999' })).join('')}
<text x="8" y="98" font-size="14" fill="#777">cấp 1</text><text x="8" y="168" font-size="14" fill="#777">cấp 2</text>
</svg>`;

/* ── Slide 15: đảo ngày liên tiếp ── */
const ngayLan = [1, 2, 3, 6, 7];
const dao = `<div style="display:flex;gap:6px;align-items:flex-end;justify-content:center"><div style="font-weight:700;font-size:19px;align-self:center;margin-right:8px">lan:</div>${[1, 2, 3, 4, 5, 6, 7].map((d) => {
  const co = ngayLan.includes(d); const nhom = d <= 3 ? '#ffd29a' : '#bfe3cb';
  return `<div style="width:108px;text-align:center"><div style="height:46px;border-radius:8px;border:2px solid ${co ? C.nau : '#ccc'};background:${co ? nhom : '#f4f4f4'};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:19px;color:${co ? C.xam : '#aaa'}">0${d}/09</div><div style="font-size:15px;color:#666;margin-top:3px">${co ? `rn ${ngayLan.indexOf(d) + 1} → ${d <= 3 ? '31/08' : '02/09'}` : 'trống'}</div></div>`;
}).join('')}</div>`;

/* ── Slide 20: OFFSET vs keyset ── */
const phanTrang = `<svg width="1100" height="130" viewBox="0 0 1100 130" xmlns="http://www.w3.org/2000/svg" style="font-family:Arial,sans-serif;display:block;margin:0 auto">
<text x="0" y="22" font-size="17" font-weight="700" fill="${C.xam}">OFFSET 99980</text>
<rect x="150" y="6" width="880" height="24" fill="#fdf0ee" stroke="#c0392b"/>
<text x="590" y="24" text-anchor="middle" font-size="15" fill="#c0392b">đọc rồi VỨT 99 980 dòng …</text>
<rect x="1030" y="6" width="60" height="24" fill="#ffe2b8" stroke="${C.nau}"/><text x="1060" y="24" text-anchor="middle" font-size="14" font-weight="700">20</text>
<text x="0" y="82" font-size="17" font-weight="700" fill="${C.xam}">Keyset</text>
<line x1="150" y1="78" x2="1025" y2="78" stroke="#bbb" stroke-dasharray="5 5" stroke-width="2"/>
<text x="590" y="70" text-anchor="middle" font-size="15" fill="${C.xanh}">nhảy thẳng qua chỉ mục: WHERE id &gt; 99980</text>
<rect x="1030" y="66" width="60" height="24" fill="#ffe2b8" stroke="${C.nau}"/><text x="1060" y="84" text-anchor="middle" font-size="14" font-weight="700">20</text>
<text x="1090" y="120" text-anchor="end" font-size="14" fill="#666">bảng 100 000 bài viết, khoá chính id</text>
</svg>`;

const ST = '<style>.cs .nd :not(pre)>code{font-size:.84em}</style>';
export const slides = lamDeck('SQL NÂNG CAO', [
  /* 1 */ { cover: true, t: 'SQL nâng cao', sub: 'Hàm cửa sổ · CTE đệ quy · top-N · MERGE / UPSERT · phân trang · JSON — mức đi làm & phỏng vấn' },

  /* 2 */ { t: 'Đi tiếp từ Chương 6', body: `
<div class="hai">
<div class="o"><b>Chương 6 (trường) đã có</b><br>SELECT · WHERE · ORDER BY · JOIN · truy vấn con · UNION/EXCEPT/INTERSECT · GROUP BY · HAVING</div>
<div class="o xanh"><b>Đi làm còn cần</b><br>xếp hạng, so với dòng trước, luỹ kế · cây nhiều cấp · "top 3 mỗi nhóm" · upsert · phân trang nhanh · JSON</div>
</div>
<ul>
<li>Phần 1 (slide 3–12): <b>hàm cửa sổ</b> (window function) và <b>CTE</b>, kể cả CTE đệ quy.</li>
<li>Phần 2 (slide 13–25): các "bài toán kinh điển" phỏng vấn hay hỏi + cú pháp riêng của mỗi hệ.</li>
<li>Dữ liệu: CSDL <b>FUHCompany</b> của chương 5–8 (14 nhân viên, 6 dự án) + vài bảng nhỏ tự dựng.</li>
</ul>
<div class="o do2">Mỗi câu SQL đều <b>chạy thật</b> trên SQL Server (Azure SQL Edge = lõi 2019) <b>và</b> PostgreSQL 16 — chỗ nào hai hệ khác nhau, slide ghi rõ.</div>` },

  /* 3 */ { t: 'GROUP BY gộp dòng — OVER giữ dòng', body: `
<div class="hai">
${sm(`SELECT depNum, AVG(empSalary)
FROM tblEmployee
GROUP BY depNum;     -- 14 dòng → 5 dòng`)}
${sm(`SELECT depNum, empName, empSalary,
  AVG(empSalary) OVER (PARTITION BY depNum)
FROM tblEmployee;    -- vẫn đủ 14 dòng`)}
</div>
<table style="font-size:19px">
<tr><th>depNum</th><th>empName</th><th>empSalary</th><th>luongTB_phong</th><th>chenh_lech</th></tr>
<tr><td>1</td><td>Trần Minh Quang</td><td>150000</td><td>86250.0</td><td>63750.0</td></tr>
<tr><td>1</td><td>Hoàng Thị Hà</td><td>90000</td><td>86250.0</td><td>3750.0</td></tr>
<tr><td>1</td><td>Võ Việt Anh</td><td>60000</td><td>86250.0</td><td>-26250.0</td></tr>
<tr><td>1</td><td>Lê Thị Lan Anh</td><td>45000</td><td>86250.0</td><td>-41250.0</td></tr>
<tr><td>2</td><td>Đặng Tuấn Anh</td><td>105000</td><td>81750.0</td><td>23250.0</td></tr>
</table>
<div class="nho">… 14 dòng. Mỗi dòng "nhìn thấy" nhóm của mình mà <span class="do">không bị gộp mất</span> ⇒ so được từng người với trung bình phòng.</div>` },

  /* 4 */ { t: 'Cú pháp OVER và thứ tự thực thi', body: `
${code(`hàm(...) OVER (
    PARTITION BY cột    -- chia nhóm (không ghi = cả bảng một nhóm)
    ORDER BY cột        -- thứ tự trong nhóm
    ROWS | RANGE ...    -- khung (frame): lấy những dòng nào quanh dòng hiện tại
)`, 'sql')}
<div class="hai">
<div class="o"><b>Thứ tự logic</b>: FROM → WHERE → GROUP BY → HAVING → <span class="do">hàm cửa sổ</span> → SELECT → ORDER BY</div>
<div class="o do2">Nên <b>không</b> đặt được trong WHERE:<br><code>Msg 4108 … can only appear in the SELECT or ORDER BY clauses</code><br>PostgreSQL: <code>window functions are not allowed in WHERE</code></div>
</div>
<div class="nho">Cách sửa: tính trong bảng dẫn xuất / CTE, rồi lọc ở câu ngoài (<code>WHERE rn = 1</code>).</div>` },

  /* 5 */ { t: 'ROW_NUMBER · RANK · DENSE_RANK', body: `
${sm(`ROW_NUMBER() OVER (ORDER BY workHours DESC, empSSN, proNum)   -- luôn 1,2,3… không trùng
RANK()       OVER (ORDER BY workHours DESC)   -- đồng hạng, rồi NHẢY số
DENSE_RANK() OVER (ORDER BY workHours DESC)   -- đồng hạng, KHÔNG nhảy`)}
<table style="font-size:19px">
<tr><th>proNum</th><th>empName</th><th>workHours</th><th>row_num</th><th>rnk</th><th>dense_rnk</th></tr>
<tr><td>5</td><td>Bùi Văn Nam</td><td>40.0</td><td>1</td><td>1</td><td>1</td></tr>
<tr><td>6</td><td>Huỳnh Văn Tài</td><td>40.0</td><td>2</td><td>1</td><td>1</td></tr>
<tr><td>2</td><td>Lê Thị Lan Anh</td><td>35.0</td><td>3</td><td class="do">3</td><td class="do">2</td></tr>
<tr><td>1</td><td>Võ Việt Anh</td><td>30.0</td><td>4</td><td>4</td><td>3</td></tr>
<tr><td>4</td><td>Phạm Quốc Bảo</td><td>30.0</td><td>5</td><td>4</td><td>3</td></tr>
<tr><td>3</td><td>Mai Duy An</td><td>25.0</td><td>8</td><td class="do">8</td><td class="do">4</td></tr>
</table>
<div class="nho">16 lượt phân công (trích). ROW_NUMBER phải có ORDER BY <b>duy nhất</b> — thiếu cột phụ thì hai dòng 40 giờ đổi chỗ tuỳ lần chạy.</div>` },

  /* 6 */ { t: '"Cửa sổ" của một dòng — Võ Việt Anh, phòng 1', body: `${baCuaSo}
<div class="o" style="font-size:20px">Cùng một dòng (viền đỏ), ba khung khác nhau ⇒ ba kết quả khác nhau. Khung = <b>tập dòng</b> mà hàm gộp nhìn thấy khi tính cho dòng đó.</div>` },

  /* 7 */ { t: 'LAG / LEAD — so với dòng trước, dòng sau', body: `
${sm(`SELECT thang, tien,
       LAG(tien)  OVER (ORDER BY thang) AS thang_truoc,
       LEAD(tien) OVER (ORDER BY thang) AS thang_sau,
       tien - LAG(tien) OVER (ORDER BY thang) AS tang_giam,
       -- phan_tram = 100.0 * tang_giam / thang_truoc (tính bằng LAG như trên)
       LAG(tien, 1, 0) OVER (ORDER BY thang) AS truoc_mac_dinh_0
FROM DoanhThu ORDER BY thang;`)}
<table style="font-size:19px">
<tr><th>thang</th><th>tien</th><th>thang_truoc</th><th>thang_sau</th><th>tang_giam</th><th>phan_tram</th><th>truoc_mac_dinh_0</th></tr>
<tr><td>2026-01</td><td>120</td><td class="do">NULL</td><td>90</td><td>NULL</td><td>NULL</td><td>0</td></tr>
<tr><td>2026-02</td><td>90</td><td>120</td><td>150</td><td>-30</td><td>-25.0</td><td>120</td></tr>
<tr><td>2026-03</td><td>150</td><td>90</td><td>150</td><td>60</td><td>66.7</td><td>90</td></tr>
<tr><td>2026-06</td><td>135</td><td>180</td><td class="do">NULL</td><td>-45</td><td>-25.0</td><td>180</td></tr>
</table>
<div class="nho">Trước đây phải tự nối bảng với chính nó (self-join) theo "tháng − 1". Dòng đầu không có "trước" ⇒ NULL, trừ khi cho giá trị mặc định.</div>` },

  /* 8 */ { t: 'Luỹ kế & trung bình trượt — bẫy RANGE mặc định', body: `
<div class="hai">
<div>${sm(`SUM(tien) OVER (ORDER BY thang
  ROWS BETWEEN UNBOUNDED PRECEDING
  AND CURRENT ROW)          -- luỹ kế
AVG(tien * 1.0) OVER (ORDER BY thang
  ROWS BETWEEN 2 PRECEDING
  AND CURRENT ROW)          -- TB 3 tháng`)}
<table style="font-size:18px;margin-top:8px"><tr><th>thang</th><th>tien</th><th>luy_ke</th><th>tb_truot_3</th></tr>
<tr><td>01</td><td>120</td><td>120</td><td>120.0</td></tr><tr><td>02</td><td>90</td><td>210</td><td>105.0</td></tr>
<tr><td>03</td><td>150</td><td>360</td><td>120.0</td></tr><tr><td>04</td><td>150</td><td>510</td><td>130.0</td></tr></table></div>
<div>
<p style="font-size:21px">Không ghi khung ⇒ mặc định <b>RANGE … CURRENT ROW</b>: dòng <b>trùng</b> giá trị ORDER BY bị cộng <span class="do">cùng lúc</span>.</p>
<table style="font-size:18px"><tr><th>maDon</th><th>ngay</th><th>tien</th><th>mặc định</th><th>ROWS</th></tr>
<tr><td>1</td><td>09-01</td><td>100</td><td>100</td><td>100</td></tr>
<tr><td>2</td><td>09-02</td><td>50</td><td class="do">180</td><td>150</td></tr>
<tr><td>3</td><td>09-02</td><td>30</td><td class="do">180</td><td>180</td></tr>
<tr><td>4</td><td>09-03</td><td>70</td><td>250</td><td>250</td></tr></table>
<div class="nho">Luỹ kế từng dòng: <b>ROWS</b> + ORDER BY <b>duy nhất</b> (ngay, maDon).</div>
</div></div>` },

  /* 9 */ { t: 'Khung ROWS/RANGE · LAST_VALUE · NTILE', body: `
<table style="font-size:17px">
<tr><th>empName</th><th>empSalary</th><th>FIRST_VALUE</th><th>LAST_VALUE (mặc định)</th><th>LAST_VALUE (… UNBOUNDED FOLLOWING)</th></tr>
<tr><td>Trần Minh Quang</td><td>150000</td><td>Trần Minh Quang</td><td class="do">Trần Minh Quang</td><td>Lê Thị Lan Anh</td></tr>
<tr><td>Hoàng Thị Hà</td><td>90000</td><td>Trần Minh Quang</td><td class="do">Hoàng Thị Hà</td><td>Lê Thị Lan Anh</td></tr>
<tr><td>Võ Việt Anh</td><td>60000</td><td>Trần Minh Quang</td><td class="do">Võ Việt Anh</td><td>Lê Thị Lan Anh</td></tr>
</table>
<ul style="font-size:19px;gap:2px">
<li>Khung mặc định <b>dừng ở dòng hiện tại</b> ⇒ LAST_VALUE trả chính dòng đó. Sửa: <code>ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING</code>.</li>
<li>SQL Server: RANGE chỉ nhận UNBOUNDED / CURRENT ROW (<code>Msg 4194</code>). PostgreSQL: <code>RANGE BETWEEN INTERVAL '1 day' PRECEDING …</code> được.</li>
</ul>
<div class="hai" style="align-items:center">
<table style="font-size:15px"><tr><th>NTILE(4) nhom</th><th>so_nguoi</th><th>thap_nhat</th><th>cao_nhat</th></tr>
<tr><td>1</td><td>4</td><td>90000</td><td>150000</td></tr><tr><td>2</td><td>4</td><td>65000</td><td>88000</td></tr>
<tr><td>3</td><td>3</td><td>52000</td><td>60000</td></tr><tr><td>4</td><td>3</td><td>38000</td><td>45000</td></tr></table>
<div class="o" style="font-size:20px"><b>NTILE(4) OVER (ORDER BY empSalary DESC)</b> chia 14 người thành 4 nhóm gần đều: <b>4 · 4 · 3 · 3</b> — các nhóm đầu nhận phần dư. Dùng để chia "tứ phân vị" (quartile).</div>
</div>` },

  /* 10 */ { t: 'CTE — đặt tên cho từng bước', body: `
<div class="hai">
${sm(`WITH luongPhong AS (      -- bước 1
    SELECT depNum, AVG(empSalary) AS tb
    FROM tblEmployee GROUP BY depNum
),
congTy AS (               -- bước 2
    SELECT AVG(empSalary) AS tb
    FROM tblEmployee
)
SELECT d.depName, p.tb, c.tb
FROM luongPhong p
JOIN tblDepartment d ON d.depNum = p.depNum
CROSS JOIN congTy c
WHERE p.tb > c.tb;`)}
<div>
<table style="font-size:17px"><tr><th>depName</th><th>tb_phong</th><th>tb_cong_ty</th></tr>
<tr><td>Phòng Phần mềm trong nước</td><td>86250.0</td><td>73214.3</td></tr>
<tr><td>Phòng Phần mềm nước ngoài</td><td>81750.0</td><td>73214.3</td></tr></table>
<ul style="font-size:20px;margin-top:10px;gap:4px">
<li>CTE (Common Table Expression) = truy vấn con <b>có tên</b>, sống trong một câu lệnh.</li>
<li>Đọc từ trên xuống như các bước; dùng lại tên nhiều lần.</li>
<li class="do">SQL Server: câu đứng trước WITH phải kết thúc bằng ";" (Msg 319) — vì thế hay thấy <code>;WITH</code>.</li>
</ul></div></div>` },

  /* 11 */ { t: 'CTE đệ quy — cây nhân viên (supervisorSSN)', body: `${cayNV}
${sm(`WITH cay AS (                                    -- PostgreSQL: WITH RECURSIVE cay AS (
  SELECT empSSN, empName, 0 AS cap FROM tblEmployee
  WHERE supervisorSSN IS NULL                     -- ① phần neo: giám đốc
  UNION ALL
  SELECT e.empSSN, e.empName, c.cap + 1
  FROM tblEmployee e JOIN cay c ON e.supervisorSSN = c.empSSN   -- ② lặp: cấp dưới của người đã có
)
SELECT cap, empName FROM cay;                     -- 14 dòng: 1 cấp 0 · 5 cấp 1 · 8 cấp 2`)}` },

  /* 12 */ { t: 'CTE đệ quy — sinh dãy ngày & giới hạn đệ quy', body: `
<div class="hai">
<div>
${sm(`WITH ngay AS (
  SELECT CAST('2026-09-01' AS DATE) AS d
  UNION ALL
  SELECT DATEADD(DAY, 1, d) FROM ngay
  WHERE d < '2026-09-07'
)
SELECT n.d, COUNT(o.maDon) ...
FROM ngay n LEFT JOIN DonHang o
  ON o.ngay = n.d GROUP BY n.d;`)}
<div class="nho" style="margin-top:6px">PostgreSQL: <code>generate_series(DATE '2026-09-01', DATE '2026-09-07', INTERVAL '1 day')</code></div>
</div>
<div>
<table style="font-size:17px"><tr><th>ngay</th><th>so_don</th><th>doanh_thu</th></tr>
<tr><td>2026-09-02</td><td>2</td><td>80</td></tr><tr><td>2026-09-03</td><td class="do">0</td><td class="do">0</td></tr>
<tr><td>2026-09-04</td><td class="do">0</td><td class="do">0</td></tr><tr><td>2026-09-05</td><td>1</td><td>70</td></tr></table>
<div class="o do2" style="font-size:18px;margin-top:10px"><b>SQL Server</b>: mặc định tối đa <b>100</b> vòng ⇒ <code>Msg 530</code>; nới bằng <code>OPTION (MAXRECURSION 400)</code> (0 = không giới hạn).<br><b>PostgreSQL</b>: <b>không</b> có giới hạn ⇒ dữ liệu có vòng là chạy mãi; chặn bằng <code>CYCLE … SET … USING …</code> (bản 14+).</div>
</div></div>` },

  /* 13 */ { t: 'Top-N mỗi nhóm — 3 cách', body: `
<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
${sm(`-- ① ROW_NUMBER
WITH xh AS (
 SELECT depNum, empName, empSalary,
  ROW_NUMBER() OVER (PARTITION BY depNum
   ORDER BY empSalary DESC, empSSN) AS rn
 FROM tblEmployee)
SELECT * FROM xh WHERE rn <= 2;`)}
${sm(`-- ② CROSS APPLY / LATERAL
SELECT d.depNum, x.empName
FROM tblDepartment d
CROSS APPLY (SELECT TOP (2) e.empName
  FROM tblEmployee e
  WHERE e.depNum = d.depNum
  ORDER BY e.empSalary DESC, e.empSSN) x;
-- PG: CROSS JOIN LATERAL (… LIMIT 2)`)}
</div>
${sm(`-- ③ Truy vấn con tương quan: trong phòng có < 2 người lương cao hơn tôi
SELECT e.depNum, e.empName FROM tblEmployee e
WHERE (SELECT COUNT(*) FROM tblEmployee e2
       WHERE e2.depNum = e.depNum AND e2.empSalary > e.empSalary) < 2;`)}
<div class="nho">Cả ba ra đúng <b>9 dòng</b> (phòng 4 chỉ có 1 người), kiểm bằng EXCEPT: 0 dòng lệch.</div>` },

  /* 14 */ { t: 'So sánh 3 cách — khi có đồng hạng', body: `
<p style="font-size:21px">Lớp A: An 9, Bình 9, Chi 8 — "top 1 mỗi lớp" là ai?</p>
<table style="font-size:19px">
<tr><th>Cách</th><th>Lớp A trả về</th><th>Hợp khi</th></tr>
<tr><td>ROW_NUMBER = 1</td><td class="do">chỉ An (cắt theo cột phụ)</td><td>cần đúng N dòng, quét cả bảng một lần</td></tr>
<tr><td>RANK = 1</td><td>An, Bình</td><td>muốn giữ người đồng hạng</td></tr>
<tr><td>APPLY TOP (1) WITH TIES</td><td>An, Bình</td><td>ít nhóm + có chỉ mục (nhóm, điểm) ⇒ mỗi nhóm một lần seek</td></tr>
<tr><td>PG: LATERAL … LIMIT 1</td><td class="do">chỉ An</td><td>như APPLY; giữ đồng hạng: <code>FETCH FIRST 1 ROWS WITH TIES</code> (PG 13+)</td></tr>
<tr><td>COUNT(cao hơn) &lt; 1</td><td>An, Bình</td><td>dữ liệu nhỏ; chạy lại truy vấn con cho từng dòng</td></tr>
</table>
<div class="o">Phỏng vấn hỏi "top N" ⇒ <b>hỏi lại</b>: đồng hạng xử lý thế nào? Rồi mới chọn hàm.</div>` },

  /* 15 */ { t: 'Gaps & islands — chuỗi ngày liên tiếp', body: `${dao}
${sm(`WITH t AS (SELECT nguoi, ngay,
  DATEADD(DAY, -ROW_NUMBER() OVER (PARTITION BY nguoi ORDER BY ngay), ngay) AS nhom
  FROM DangNhap)                -- PG: ngay - CAST(ROW_NUMBER() OVER (…) AS INT)
SELECT nguoi, MIN(ngay) AS tu_ngay, MAX(ngay) AS den_ngay, COUNT(*) AS so_ngay
FROM t GROUP BY nguoi, nhom;`)}
<div class="hai" style="font-size:20px">
<div class="o">Ngày liên tiếp tăng 1, số thứ tự cũng tăng 1 ⇒ <b>hiệu không đổi</b> = mã của "đảo".</div>
<div class="o xanh">lan: 01→03 (<b>3</b> ngày), 06→07 (<b>2</b>). Khoảng trống: dùng <b>LEAD</b>, ngày sau − ngày này &gt; 1.</div>
</div>` },

  /* 16 */ { t: 'PIVOT / UNPIVOT ↔ FILTER · crosstab', body: `
<div class="hai">
${sm(`-- SQL Server
SELECT depNum, [F] AS nu, [M] AS nam
FROM (SELECT depNum, empSex, empSSN
      FROM tblEmployee) src
PIVOT (COUNT(empSSN)
  FOR empSex IN ([F], [M])) p;`)}
${sm(`-- PostgreSQL (và mọi hệ: CASE)
SELECT depNum,
  COUNT(*) FILTER (WHERE empSex='F') AS nu,
  COUNT(*) FILTER (WHERE empSex='M') AS nam
FROM tblEmployee GROUP BY depNum;
-- hoặc crosstab() của extension tablefunc`)}
</div>
<div style="display:grid;grid-template-columns:330px 1fr;gap:22px;align-items:start">
<table style="font-size:17px"><tr><th>depNum</th><th>nu</th><th>nam</th></tr>
<tr><td>1</td><td>2</td><td>2</td></tr><tr><td>2</td><td>1</td><td>3</td></tr><tr><td>3</td><td>2</td><td>1</td></tr>
<tr><td>4</td><td>0 <span class="do">(crosstab: NULL)</span></td><td>1</td></tr><tr><td>5</td><td>1</td><td>1</td></tr></table>
<ul style="font-size:20px;gap:6px">
<li>PIVOT xoay <b>giá trị</b> của một cột (F, M) thành <b>tên cột</b>.</li>
<li>Danh sách cột phải <b>viết cứng</b> trong câu lệnh; cột động ⇒ SQL động.</li>
<li><span class="do">UNPIVOT lặng lẽ bỏ dòng NULL</span> (Chi chưa có điểm hoá ⇒ mất dòng); muốn giữ: CROSS APPLY (VALUES …) / CROSS JOIN LATERAL (VALUES …).</li>
</ul></div>` },

  /* 17 */ { t: 'MERGE (SQL Server) ↔ INSERT … ON CONFLICT', body: `
<div class="hai">
${sm(`MERGE INTO TonKho AS t
USING PhieuNhap AS s ON t.ma = s.ma
WHEN MATCHED THEN
  UPDATE SET t.soLuong = t.soLuong + s.soLuong
WHEN NOT MATCHED BY TARGET THEN
  INSERT (ma, soLuong) VALUES (s.ma, s.soLuong)
OUTPUT $action, inserted.ma, ...;`)}
${sm(`INSERT INTO TonKho (ma, soLuong)
VALUES ('BUT', 20), ('TAY', 7)
ON CONFLICT (ma) DO UPDATE
  SET soLuong = TonKho.soLuong
              + EXCLUDED.soLuong
RETURNING ma, soLuong;
-- ON CONFLICT (ma) DO NOTHING`)}
</div>
<table style="font-size:18px"><tr><th>hanh_dong</th><th>ma</th><th>truoc</th><th>sau</th></tr>
<tr><td>UPDATE</td><td>BUT</td><td>10</td><td>30</td></tr><tr><td>INSERT</td><td>TAY</td><td>NULL</td><td>7</td></tr></table>
<div class="nho">"Upsert" = update nếu có, insert nếu chưa. PostgreSQL 15+ cũng có MERGE; <code>RETURNING</code> và <code>WHEN NOT MATCHED BY SOURCE</code> trong MERGE chỉ có từ PostgreSQL 17 (bản 16 ở đây báo lỗi cú pháp).</div>` },

  /* 18 */ { t: 'Bẫy của MERGE (và ON CONFLICT)', body: `
<table style="font-size:18px">
<tr><th>Bẫy</th><th>Chuyện gì xảy ra (chạy thật)</th></tr>
<tr><td>Nguồn có một khoá <b>hai lần</b></td><td>SQL Server <code>Msg 8672</code> · PG <code>ON CONFLICT DO UPDATE command cannot affect row a second time</code> ⇒ gộp nguồn trước (GROUP BY)</td></tr>
<tr><td>Quên dấu <b>;</b> cuối MERGE</td><td><code>Msg 10713</code>: A MERGE statement must be terminated by a semi-colon</td></tr>
<tr><td><b>NOT MATCHED BY SOURCE THEN DELETE</b> với nguồn chỉ có một phần</td><td>phiếu chỉ có BUT ⇒ <span class="do">xoá luôn THUOC và VO</span></td></tr>
<tr><td>Hai phiên cùng MERGE một khoá mới</td><td>cả hai thấy "chưa có" ⇒ một phiên lỗi trùng khoá ⇒ thêm <code>WITH (HOLDLOCK)</code> (ON CONFLICT thì nguyên tử sẵn)</td></tr>
<tr><td>ON CONFLICT trên cột <b>không có</b> UNIQUE/PK</td><td><code>there is no unique or exclusion constraint matching the ON CONFLICT specification</code></td></tr>
</table>
<div class="o">Upsert đơn giản trên PostgreSQL: <b>ON CONFLICT</b>. Đồng bộ cả bảng (có xoá): MERGE — nhưng kiểm kỹ điều kiện.</div>` },

  /* 19 */ { t: 'OUTPUT (SQL Server) ↔ RETURNING (PostgreSQL)', body: `
<div class="hai">
${sm(`INSERT INTO SanPham (ten, gia)
OUTPUT inserted.id, inserted.ten
VALUES (N'Bút', 5000), (N'Vở', 12000);

UPDATE SanPham SET gia = gia * 110 / 100
OUTPUT deleted.gia AS cu, inserted.gia AS moi
WHERE gia >= 8000;

DELETE FROM SanPham
OUTPUT deleted.* WHERE ...;`)}
${sm(`INSERT INTO SanPham (ten, gia)
VALUES ('Bút', 5000), ('Vở', 12000)
RETURNING id, ten;

UPDATE SanPham SET gia = gia * 110 / 100
WHERE gia >= 8000
RETURNING id, gia;   -- chỉ giá MỚI

DELETE FROM SanPham WHERE ...
RETURNING *;`)}
</div>
<ul style="font-size:20px;gap:4px">
<li>Lấy lại id vừa sinh / dòng vừa đổi <b>trong cùng một câu</b> — khỏi SELECT lại.</li>
<li class="do">OUTPUT không có INTO trên bảng có trigger ⇒ <code>Msg 334</code>; dùng <code>OUTPUT … INTO @bien_bang</code>.</li>
<li>Dòng OUTPUT/RETURNING <b>không</b> có thứ tự đảm bảo ⇒ gom lại rồi ORDER BY. Giá cũ trong RETURNING: PostgreSQL 18 (<code>RETURNING OLD.*</code>).</li>
</ul>` },

  /* 20 */ { t: 'Phân trang: OFFSET/FETCH vs keyset', body: `${phanTrang}
<div class="hai">
${sm(`-- trang 5000, mỗi trang 20 dòng
SELECT id FROM BaiViet ORDER BY id
OFFSET 99980 ROWS FETCH NEXT 20 ROWS ONLY;
-- keyset (seek method)
SELECT TOP (20) id FROM BaiViet
WHERE id > 99980 ORDER BY id;`)}
<table style="font-size:18px"><tr><th>Đo thật</th><th>logical reads</th></tr>
<tr><td>OFFSET 0 (trang 1)</td><td>3</td></tr>
<tr><td>OFFSET 99980</td><td class="do">2643</td></tr>
<tr><td>Keyset id &gt; 99980</td><td>3</td></tr>
<tr><td colspan="2">PG EXPLAIN ANALYZE: OFFSET ⇒ Index Scan <b>actual rows=100000</b>; keyset ⇒ <b>rows=20</b></td></tr></table>
</div>
<div class="nho">Keyset: nhanh đều mọi trang, không trùng/sót khi có dòng mới chèn — nhưng không nhảy thẳng "trang 5000" được. Khoá 2 cột: PG <code>WHERE (ngay, id) &gt; (…, …)</code>; SQL Server phải viết <code>ngay &gt; @n OR (ngay = @n AND id &gt; @id)</code>.</div>` },

  /* 21 */ { t: 'JSON trên SQL Server', body: `
${sm(`CREATE TABLE DonHang (maDon INT PRIMARY KEY,
  chiTiet NVARCHAR(MAX) CHECK (ISJSON(chiTiet) = 1));   -- JSON là CHUỖI + ràng buộc
SELECT JSON_VALUE(chiTiet, '$.khach.ten')  AS khach,      -- một giá trị đơn
       JSON_QUERY(chiTiet, '$.khach')      AS khach_json  -- object / mảng
FROM DonHang;
SELECT d.maDon, i.sp, i.sl, i.gia
FROM DonHang d
CROSS APPLY OPENJSON(d.chiTiet, '$.items')
  WITH (sp NVARCHAR(50) '$.sp', sl INT '$.sl', gia INT '$.gia') i;   -- mảng → dòng
SELECT (SELECT maDon AS ma ... FOR JSON PATH) AS ket_qua;             -- dòng → JSON`)}
<table style="font-size:17px"><tr><th>maDon</th><th>sp</th><th>sl</th><th>gia</th></tr>
<tr><td>1</td><td>Bút</td><td>2</td><td>5000</td></tr><tr><td>1</td><td>Vở</td><td>3</td><td>12000</td></tr><tr><td>2</td><td>Thước</td><td>1</td><td>8000</td></tr></table>
<div class="nho">Thiếu khoá ⇒ NULL (lax); <code>'strict $.x'</code> ⇒ Msg 13608. JSON_OBJECT, JSON_PATH_EXISTS (SQL Server 2022) <span class="do">không có</span> trên Azure SQL Edge.</div>` },

  /* 22 */ { t: 'JSON trên PostgreSQL: jsonb', body: `
${sm(`CREATE TABLE DonHang (maDon INT PRIMARY KEY, chiTiet JSONB NOT NULL);  -- JSON sai ⇒ lỗi ngay khi INSERT
SELECT chiTiet -> 'khach' ->> 'ten'  AS khach,        -- -> trả jsonb, ->> trả text
       chiTiet #>> '{items,0,sp}'    AS mon_dau_tien
FROM DonHang;
SELECT d.maDon, i.*
FROM DonHang d CROSS JOIN LATERAL
     jsonb_to_recordset(d.chiTiet -> 'items') AS i(sp TEXT, sl INT, gia INT);
CREATE INDEX ix_ct ON DonHang USING GIN (chiTiet);
SELECT maDon FROM DonHang WHERE chiTiet @> '{"khach":{"tinh":"HN"}}';   -- "chứa" ⇒ dùng GIN`)}
<table style="font-size:17px"><tr><th></th><th>SQL Server</th><th>PostgreSQL</th></tr>
<tr><td>Kiểu lưu</td><td>NVARCHAR(MAX) + ISJSON</td><td><b>jsonb</b> (nhị phân, đã kiểm cú pháp)</td></tr>
<tr><td>Lấy giá trị</td><td>JSON_VALUE / JSON_QUERY</td><td><code>-&gt;</code> <code>-&gt;&gt;</code> <code>#&gt;&gt;</code></td></tr>
<tr><td>Mảng → dòng</td><td>OPENJSON … WITH</td><td>jsonb_to_recordset / jsonb_array_elements</td></tr>
<tr><td>Tìm nhanh</td><td>cột tính + chỉ mục</td><td>GIN + <code>@&gt;</code></td></tr></table>` },

  /* 23 */ { t: 'STRING_AGG · ROLLUP · GROUPING SETS · CUBE', body: `
<div class="hai">
<div>
${sm(`STRING_AGG(e.empName, ', ')
  WITHIN GROUP (ORDER BY e.empName)
-- PG: STRING_AGG(e.empName, ', '
--        ORDER BY e.empName)`)}
<div class="nho" style="margin-top:6px">ProjectD → "Đặng Tuấn Anh, Phạm Quốc Bảo" (SQL Server) nhưng <span class="do">"Phạm Quốc Bảo, Đặng Tuấn Anh"</span> (PostgreSQL ở đây): thứ tự chữ có dấu tuỳ <b>collation</b>.</div>
</div>
<div>
<table style="font-size:17px"><tr><th>depNum</th><th>empSex</th><th>so_nguoi</th><th>tong_luong</th></tr>
<tr><td>1</td><td>F</td><td>2</td><td>135000</td></tr><tr><td>1</td><td>M</td><td>2</td><td>210000</td></tr>
<tr><td>1</td><td class="do">NULL</td><td>4</td><td>345000</td></tr>
<tr><td>2</td><td>…</td><td>…</td><td>…</td></tr>
<tr><td class="do">NULL</td><td class="do">NULL</td><td>8</td><td>672000</td></tr></table>
<div class="nho">GROUP BY ROLLUP (depNum, empSex), phòng 1–2</div>
</div></div>
<ul style="font-size:20px;gap:4px">
<li><b>ROLLUP(a, b)</b> = (a,b) + (a) + () — chi tiết, tổng từng nhóm, tổng cộng · <b>CUBE(a, b)</b> = mọi tổ hợp (ở đây 17 dòng) · <b>GROUPING SETS</b> = tự chọn.</li>
<li><code>GROUPING(cột) = 1</code> ⇒ NULL này là dòng tổng, không phải dữ liệu NULL thật.</li>
</ul>` },

  /* 24 */ { t: 'EXISTS vs IN vs JOIN — khi nào khác kết quả', body: `
${sm(`-- "Ai không giám sát ai?"  (giám đốc có supervisorSSN = NULL)
WHERE empSSN NOT IN (SELECT supervisorSSN FROM tblEmployee)              -- 0 dòng !
WHERE NOT EXISTS (SELECT 1 FROM tblEmployee s WHERE s.supervisorSSN = e.empSSN)   -- 9
LEFT JOIN tblEmployee s ON s.supervisorSSN = e.empSSN WHERE s.empSSN IS NULL      -- 9`)}
<div class="hai">
<div class="o do2"><b>NOT IN + NULL</b>: <code>x NOT IN (a, b, NULL)</code> = <code>x&lt;&gt;a AND x&lt;&gt;b AND x&lt;&gt;NULL</code> ⇒ UNKNOWN ⇒ <b>không bao giờ TRUE</b>. Cả hai hệ đều ra 0.</div>
<div class="o"><b>JOIN nhân bản dòng</b>: "nhân viên có dự án" — JOIN ra <b>16</b> dòng, EXISTS / IN ra <b>12</b> người.</div>
</div>
<div class="o xanh">Quy tắc: kiểm "có / không có" ⇒ <b>EXISTS / NOT EXISTS</b>. Cần cột của bảng kia ⇒ JOIN (coi chừng trùng). IN chỉ an toàn khi chắc chắn không có NULL.</div>` },

  /* 25 */ { t: 'Tóm tắt & câu hỏi phỏng vấn', body: `
<table style="font-size:17px">
<tr><th>Câu hỏi</th><th>Ý trả lời</th></tr>
<tr><td>RANK khác DENSE_RANK?</td><td>đồng hạng rồi nhảy số (1,1,3) / không nhảy (1,1,2)</td></tr>
<tr><td>Top 3 lương mỗi phòng?</td><td>ROW_NUMBER/RANK trong CTE, lọc ngoài · APPLY/LATERAL · hỏi lại chuyện đồng hạng</td></tr>
<tr><td>Luỹ kế sai khi trùng ngày?</td><td>khung mặc định RANGE ⇒ ghi ROWS + ORDER BY duy nhất</td></tr>
<tr><td>Vì sao OFFSET trang sâu chậm?</td><td>đọc rồi vứt mọi dòng phía trước ⇒ keyset</td></tr>
<tr><td>NOT IN hay NOT EXISTS?</td><td>NOT EXISTS — NOT IN gặp NULL ra rỗng</td></tr>
</table>
<div class="o" style="font-size:18px"><b>Azure SQL Edge (lõi 2019) thiếu so với SQL Server 2022</b>, chạy thật đều lỗi: <code>GREATEST</code> · <code>GENERATE_SERIES</code> · <code>IS DISTINCT FROM</code> · mệnh đề <code>WINDOW</code> · <code>DATETRUNC</code> · <code>JSON_OBJECT</code>. Edge lại có sẵn <code>DATE_BUCKET</code> và <code>IGNORE NULLS</code> (SQL Server thường: từ 2022). PostgreSQL 16 có tương đương cho cả sáu thứ thiếu (<code>greatest</code>, <code>generate_series</code>, <code>date_trunc</code>…) nhưng lại <span class="do">chưa có IGNORE NULLS</span>.</div>` },
].map((it) => (it.body ? { ...it, body: ST + it.body } : it)));
