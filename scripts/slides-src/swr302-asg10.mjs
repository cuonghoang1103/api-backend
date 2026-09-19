export const deck = { key: 'asg10', code: 'A.10', title: 'Thuyết trình & tự kiểm', sub: 'SWR302 · Software Requirements · Assignment (20%)' };
export const slides = [
  { kind: 'cover', t: 'Tuần 9 — thuyết trình', sub: 'Và bảng tự kiểm chạy trước khi nộp',
    body: `<p class="cov-meta">SWR302 · A.10 · 20 phút · 5 người đều nói</p>` },

  { t: 'Bố cục 20 phút', body: `
    <table class="t big2">
      <tr><th>2 phút</th><td>Bài toán — bằng <b>con số của đề</b>, không bằng tính từ</td></tr>
      <tr><th>3 phút</th><td>Phạm vi — context diagram, nói rõ cái gì NGOÀI</td></tr>
      <tr><th>5 phút</th><td class="hl">Một lát cắt dọc: một yêu cầu đi hết tám tài liệu</td></tr>
      <tr><th>4 phút</th><td>Chỗ khó nhất và cách nhóm giải</td></tr>
      <tr><th>3 phút</th><td>Ưu tiên &amp; ước lượng — kèm chỗ bảng làm nhóm bất ngờ</td></tr>
      <tr><th>3 phút</th><td>Còn hở gì, ai phải trả lời</td></tr>
    </table>` },

  { t: 'Lát cắt dọc ăn điểm hơn đi lướt cả tám', body: `
    <p class="lead2">Hai mươi phút không đủ để trình bày 109 yêu cầu. Nhưng đủ để đi <b>một</b> yêu cầu qua cả tám tài liệu.</p>
    <div class="box ok">Con số trong đề → mục tiêu kinh doanh → use case → yêu cầu chức năng → business rule → mục từ điển → mockup → hạng ưu tiên → phần công ước lượng.</div>
    <p class="note">Cách này chứng minh <b>cả bộ tài liệu khớp nhau</b> — đúng thứ chiếm nhiều điểm nhất. Đi lướt cả tám chỉ chứng minh bạn có đủ file.</p>` },

  { t: 'Năm người nói phần nào', body: `
    <table class="t big2">
      <tr><th>Trưởng nhóm</th><td>Bài toán + phạm vi + chốt lại cuối</td></tr>
      <tr><th>BA use case</th><td>Phần use case của lát cắt dọc</td></tr>
      <tr><th>BA luật &amp; dữ liệu</th><td>Business rule + mục từ điển của lát cắt</td></tr>
      <tr><th>BA mô hình</th><td>Chỗ khó nhất, minh hoạ bằng sơ đồ</td></tr>
      <tr><th>BA kế hoạch</th><td>Ưu tiên, ước lượng, phần còn hở</td></tr>
    </table>
    <p class="note">Ai không nói thì thầy sẽ hỏi. Chia sẵn vẫn hơn bị gọi.</p>` },

  { t: 'Slide nên trông thế nào', body: `
    <div class="grid2">
      <div class="box ok"><b>Nên</b><br/>Một sơ đồ mỗi slide · con số to · trích đúng một yêu cầu nguyên văn</div>
      <div class="box warn"><b>Không nên</b><br/>Dán cả bảng 109 dòng · đọc slide · ảnh chụp Word thu nhỏ</div>
    </div>
    <p class="note">Tài liệu đã nộp rồi. Slide để <b>giải thích</b> tài liệu, không phải để trình chiếu lại nó.</p>` },

  { t: 'Câu hỏi sau thuyết trình', body: `
    <table class="t big2">
      <tr><th>"Sao cái này ngoài phạm vi?"</th><td class="hl">Trích câu trong đề, không nói "nhóm em thấy không cần"</td></tr>
      <tr><th>"Yêu cầu này kiểm thế nào?"</th><td>Đọc METER trong Planguage</td></tr>
      <tr><th>"Số ước lượng tin được không?"</th><td>Nói khoảng + giả định, đừng bảo vệ một con số</td></tr>
      <tr><th>"Bên liên quan X nghĩ sao?"</th><td>Nếu chưa hỏi được thì nói thẳng là giả định</td></tr>
    </table>
    <p class="note">"Chỗ đó nhóm em chưa chốt được, đây là câu hỏi đang treo" là câu trả lời <b>được điểm</b>, không phải câu trả lời thua.</p>` },

  { t: 'Bảng tự kiểm — tính đầy đủ', body: `
    <div class="steps">
      <div><span class="n">1</span>Đủ 8 tài liệu, đúng khuôn Wiegers</div>
      <div><span class="n">2</span>Mọi use case có luồng ngoại lệ</div>
      <div><span class="n">3</span>Mọi yêu cầu chất lượng có SCALE và METER</div>
      <div><span class="n">4</span>Mọi trường trong mockup có trong từ điển</div>
      <div><span class="n">5</span>Bảng ưu tiên có số, không chỉ có nhãn</div>
      <div><span class="n">6</span>Ước lượng ghi khoảng + giả định</div>
    </div>` },

  { t: 'Bảng tự kiểm — tính nhất quán', body: `
    <table class="t big2">
      <tr><th>V&amp;S ↔ context diagram</th><td>Danh sách "ngoài phạm vi" khớp các hộp ngoài vòng tròn</td></tr>
      <tr><th>Bên liên quan ↔ actor</th><td>Cùng tên, không ai thừa, không ai thiếu</td></tr>
      <tr><th>UC ↔ FE</th><td class="hl">Mọi UC sinh ra FE; mọi FE về được một UC</td></tr>
      <tr><th>BR ↔ FE</th><td>Mọi BR có ít nhất một FE cài nó</td></tr>
      <tr><th>Mockup ↔ từ điển</th><td>Mọi trường hiển thị đều được định nghĩa</td></tr>
      <tr><th>Từ ngữ</th><td>Một khái niệm, một tên, trong cả tám tài liệu</td></tr>
    </table>` },

  { t: 'Nộp cái gì', body: `
    <div class="steps">
      <div><span class="n">1</span>Tám tài liệu, đặt tên <code>01-vision-scope.docx</code> … <code>08-estimation.xlsx</code></div>
      <div><span class="n">2</span>Ma trận truy vết (một file riêng, dễ tìm)</div>
      <div><span class="n">3</span>Nhật ký đóng góp theo tuần</div>
      <div><span class="n">4</span>Slide thuyết trình</div>
      <div><span class="n">5</span>Một file <code>DOC-NAY-GOM-GI.txt</code> nói mỗi file là gì</div>
    </div>
    <p class="note">Mục 5 mất 5 phút và làm người chấm tìm được thứ họ cần. Bộ tài liệu mẫu trong khoá cũng đóng gói đúng kiểu này.</p>` },
];
