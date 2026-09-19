/** Web Foundations · Deck wf-test — Chương 13: Kiểm thử. */
import { code, F, FH } from './_wf-chung.mjs';

export const deck = { key: 'wf-test', code: 'WF · CH13', title: 'Kiểm thử', sub: 'Nền tảng Lập trình Web · Chương 13' };

export const slides = [
  { kind: 'cover', t: 'Chương 13 — Kiểm thử', sub: 'Unit test · Testing Library · Giả lập · CI',
    body: `<p class="cov-meta">Nền tảng Lập trình Web · cuongthai.com<br/>Chương phân biệt người học nghề với người làm nghề</p>` },

  { t: 'Nội dung chương', body: `
    <ol class="toc">
      <li>Kiểm thử để làm gì — và tháp ba tầng</li>
      <li>Unit test đầu tiên: Arrange · Act · Assert ⭐</li>
      <li>Kiểm thử giao diện theo cách người dùng thấy ⭐⭐</li>
      <li>Giả lập mạng, giả lập thời gian, chạy trong CI</li>
    </ol>` },

  { t: 'Vì sao kiểm bằng tay thất bại', body: `
    <p class="lead2">Kiểm tay ổn ở lần sửa <b>đầu tiên</b>. Nó hỏng ở lần <b>thứ mười</b> — vì bạn thôi kiểm lại những phần "không đụng tới", mà đó đúng là những phần bị vỡ.</p>
    <div class="box ok">Một bộ test kiểm lại TẤT CẢ trong hai giây, mỗi lần. Ba thứ nó cho bạn: <b>quyền được sửa mã</b> · <b>một bản mô tả ý định</b> · <b>một lỗi không bao giờ quay lại</b>.</div>` },

  { t: 'Tháp ba tầng', body: `
    <div class="grid3">
      <div class="card"><b>Unit</b><p>Một hàm. Mili giây.<br/><b>Viết NHIỀU nhất</b></p></div>
      <div class="card"><b>Tích hợp</b><p>Component + con của nó. Vài giây.<br/>Viết vừa phải</p></div>
      <div class="card"><b>Đầu-cuối</b><p>Trình duyệt thật. Vài phút.<br/>Viết VÀI cái</p></div>
    </div>
    <div class="box warn">Kim tự tháp NGƯỢC — chủ yếu E2E — cho bạn bộ test chạy hai mươi phút và thỉnh thoảng đỏ vô cớ. Rồi cả nhóm thôi tin nó, rồi xoá nó.</div>` },

  { t: 'Arrange · Act · Assert', body: `
    ${code(`import { describe, it, expect } from 'vitest';
import { tongTien } from './tinhTien';

describe('tongTien', () => {
  it('cộng giá nhân số lượng của mọi món', () => {
    const gio = [{ gia: 100, soLuong: 2 }, { gia: 50, soLuong: 1 }];  // Arrange
    const kq = tongTien(gio);                                          // Act
    expect(kq).toBe(250);                                              // Assert
  });

  it('trả 0 cho giỏ rỗng', () => {
    expect(tongTien([])).toBe(0);
  });
});`, 'javascript', 'sm')}
    <div class="box">Đặt tên test thành CÂU mô tả hành vi. <code>it('trả 0 cho giỏ rỗng')</code> nói cho người sau biết quy tắc là gì; <code>it('test 2')</code> không nói gì cả.</div>` },

  { t: 'Matcher chiếm 95% nhu cầu', body: `
    ${code(`expect(x).toBe(5);              // ===, cho số/chuỗi/boolean
expect(obj).toEqual({ a: 1 });  // so sánh SÂU, cho object/mảng
expect(arr).toHaveLength(3);
expect(s).toContain('pizza');
expect(fn).toThrow();           // truyền một HÀM, không phải lời gọi
await expect(p).resolves.toBe(1);`)}
    <div class="box warn"><code>expect({a:1}).toBe({a:1})</code> sẽ <b>TRƯỢT</b> — hai object khác nhau không bao giờ <code>===</code>. Dùng <code>toEqual</code> cho mọi thứ không phải kiểu nguyên thuỷ. Đây là lỗi đầu tiên gần như ai cũng gặp.</div>` },

  { t: `Tìm phần tử như một CON NGƯỜI ${FH()}`, body: `
    ${code(`render(<Counter />);
const nut = screen.getByRole('button', { name: '+' });
fireEvent.click(nut);
expect(screen.getByText('1')).toBeInTheDocument();`, 'javascript')}
    <table class="t">
      <tr><th>Cách tìm</th><th>Dùng khi</th></tr>
      <tr><td><b>getByRole</b></td><td>button, heading, textbox — <b>ưu tiên nhất</b></td></tr>
      <tr><td><b>getByLabelText</b></td><td>Ô nhập, qua thẻ label — kiêm kiểm khả năng tiếp cận</td></tr>
      <tr><td><b>getByText</b></td><td>Chữ nhìn thấy được. Đổi câu chữ là hỏng</td></tr>
      <tr><td><b>getByTestId</b></td><td>Phương án CUỐI</td></tr>
    </table>
    <div class="box warn">⛔ Đừng tìm theo <b>class CSS</b>. Test đi tìm <code>.btn-primary</code> sẽ đỏ ngay hôm đổi tên class, dù nút vẫn chạy hoàn hảo — lúc đó test đang báo cáo về file CSS, không phải về hành vi.</div>` },

  { t: 'get · query · find', body: `
    ${code(`getBy...     // phải có NGAY — không có thì ném lỗi
queryBy...   // có thể không có — trả null (dùng cho "KHÔNG được xuất hiện")
findBy...    // SẮP có — trả Promise (dùng sau việc bất đồng bộ)

expect(screen.queryByText('Lỗi')).not.toBeInTheDocument();
expect(await screen.findByText('Đã lưu')).toBeInTheDocument();`)}` },

  { t: 'Giả lập mạng — và nhớ kiểm nhánh HỎNG', body: `
    ${code(`global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: async () => [{ id: 1, ten: 'Margherita' }],
});
expect(await screen.findByText('Margherita')).toBeInTheDocument();

// nhánh hỏng — chỗ lỗi thật sự ở
global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500 });
expect(await screen.findByText(/không tải được/i)).toBeInTheDocument();`, 'javascript', 'sm')}
    <div class="box warn">Phần lớn nhóm chỉ kiểm nhánh thuận, rồi ship một spinner quay mãi khi máy chủ trả 500. Nhánh lỗi là nhánh không ai thử bằng tay — chính vì thế nó xứng đáng có test.</div>` },

  { t: 'Điều khiển thời gian và chạy trong CI', body: `
    ${code(`vi.useFakeTimers();
vi.advanceTimersByTime(3000);   // nhảy tới tương lai ngay lập tức
vi.useRealTimers();`, 'javascript')}
    ${code(`# .github/workflows/ci.yml
on: [push, pull_request]
steps:
  - run: npm ci        # KHÔNG phải npm install — cài đúng file lock
  - run: npm test -- --run
  - run: npm run build # test xanh mà build đỏ là chuyện thường`, 'yaml', 'sm')}
    <div class="box ok">Không có đồng hồ giả thì test chờ thật 3 giây. Một trăm test như vậy là bộ kiểm chạy năm phút thay vì năm giây.</div>` },

  { t: 'Luật quan trọng nhất của cả chương', body: `
    <p class="lead2"><b>Kiểm BỘ KIỂM trước khi tin nó.</b></p>
    <div class="steps">
      <div><span class="n">1</span><span>Viết test, thấy nó xanh.</span></div>
      <div><span class="n">2</span><span><b>Cố ý làm hỏng mã</b> — đổi <code>+</code> thành <code>-</code>, xoá một điều kiện.</span></div>
      <div><span class="n">3</span><span>Xác nhận test chuyển sang <b>ĐỎ</b>.</span></div>
      <div><span class="n">4</span><span>Trả mã về như cũ.</span></div>
    </div>
    <div class="box warn">Một test xanh ở CẢ bản đúng lẫn bản hỏng còn <b>tệ hơn không có test</b> — nó bán cho bạn một sự yên tâm bạn chưa xứng đáng có.</div>` },

  { t: 'Tự luyện', body: `
    ${code(`// 1. Viết hàm xepLoai(diem) rồi test: 9→'Giỏi', 5→'Đạt', 4→'Chưa đạt'
// 2. Thêm test cho trường hợp biên: diem = 0, diem = null, diem = 'a'
// 3. Render một form, test rằng nút Gửi bị khoá tới khi email hợp lệ
// 4. Giả lập fetch trả 500, test rằng thông báo lỗi hiện ra
// 5. Với MỖI test ở trên: cố ý làm hỏng mã, xác nhận test đỏ, rồi sửa lại`, 'javascript', 'sm')}
    <div class="box ok">Bài 5 không phải phần phụ — nó là phần quan trọng nhất.</div>` },
];
