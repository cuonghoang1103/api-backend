---
name: kiem-thu
description: Viết/chạy test (Jest, Vitest, Playwright, JUnit, pytest, xUnit), test đỏ/flaky, thiết kế test case (SWT301).
---

# KỸ NĂNG: KIỂM THỬ — test bắt được lỗi thật, chạy xong tự dừng

Mục tiêu: mỗi test kiểm MỘT hành vi có ý nghĩa, đỏ khi mã sai và xanh khi mã đúng, chạy không cần người,
và bạn đã CHẠY nó để thấy kết quả — không phải "test này chắc pass".

## 0. Luật vàng (đọc trước mọi thứ)

1. **Không bao giờ chạy test ở chế độ watch.** Nó không tự dừng ⇒ treo tới hết giờ. Luôn dạng chạy-một-lần:
   ```bash
   CI=1 npx jest                      # Jest; CRA: CI=true npm test
   npx vitest run                     # KHÔNG phải `npx vitest` trần (mặc định là watch)
   npx playwright test --reporter=line
   pytest -q
   ./mvnw -q test            # hoặc ./gradlew test
   dotnet test
   php artisan test          # hoặc vendor/bin/phpunit
   ```
   Kiểm `package.json`: script `"test": "vitest"` hoặc `"jest --watch"` ⇒ đừng gọi `npm test`, gọi thẳng lệnh chạy-một-lần.
   Windows PowerShell không hiểu `CI=1 lệnh` ⇒ `$env:CI=1; npx jest`.
2. **Đọc cách dự án đang test trước khi viết.** Framework nào, thư mục test ở đâu, đặt tên ra sao (`*.test.ts`,
   `*_test.py`, `*Tests.cs`), có helper/fixture/factory sẵn chưa, DB test cấu hình thế nào. Viết giống test xung quanh.
   Chưa có framework ⇒ đề xuất cái hợp stack (Vite ⇒ Vitest, Next/Node ⇒ Jest hoặc Vitest, Spring ⇒ JUnit5 có sẵn trong
   `spring-boot-starter-test`) và hỏi trước khi thêm phụ thuộc.
3. **Test phải từng ĐỎ vì đúng lý do.** Viết test cho lỗi ⇒ chạy trên mã chưa sửa, thấy đỏ với thông điệp đúng
   lỗi đó, rồi mới sửa mã, rồi thấy xanh. Test chưa từng đỏ có thể là test không kiểm gì.
4. **Không làm test xanh bằng cách làm yếu nó.** Cấm: xoá assertion, đổi `toBe(3)` thành `toBeDefined()`, thêm `.skip`/
   `@Disabled`/`[Fact(Skip=...)]`, tăng timeout cho qua, bọc `try/catch` nuốt lỗi, cập nhật snapshot mù. Test đỏ ⇒ hoặc
   mã sai (sửa mã), hoặc yêu cầu đã đổi (sửa test VÀ nói rõ với người dùng vì sao).
5. **Chạy hẹp khi làm, chạy rộng trước khi xong.** Lặp nhanh với một file/một test; kết thúc bằng cả bộ test + kiểu + build.

## 1. Kim tự tháp và chọn loại test

- **Unit** (nhiều nhất, mili-giây): hàm thuần, logic nghiệp vụ, validator, tính tiền. Không mạng, không DB thật.
- **Integration** (vừa): API route + DB thật (hoặc container), repository + DB, component + store. Bắt lỗi ở chỗ nối.
- **E2E** (ít, chậm): vài luồng sống còn qua trình duyệt thật — đăng nhập, thanh toán, luồng chính của đồ án.
Kiểm hành vi quan sát được (đầu ra, trạng thái, response), không kiểm chi tiết cài đặt (hàm private được gọi mấy lần).
Mỗi lỗi đã sửa ⇒ thêm một **test hồi quy** tái hiện đúng lỗi đó, đặt tên nói rõ lỗi.

## 2. Lệnh chạy hẹp và coverage

| Công cụ | Một file / một test | Coverage |
|---|---|---|
| Jest | `npx jest src/cart.test.ts -t "giảm giá"` | `npx jest --coverage` |
| Vitest | `npx vitest run src/cart.test.ts -t "giảm giá"` | `npx vitest run --coverage` (cần `@vitest/coverage-v8`) |
| Playwright | `npx playwright test tests/login.spec.ts -g "đăng nhập"` | — |
| pytest | `pytest tests/test_cart.py -k giam_gia -x` | `pytest --cov=app --cov-report=term-missing` (cần `pytest-cov`) |
| Maven | `./mvnw -Dtest=CartServiceTest#tinhGiamGia test` | plugin JaCoCo ⇒ `target/site/jacoco/index.html` |
| Gradle | `./gradlew test --tests 'com.app.CartServiceTest'` | plugin `jacoco` ⇒ `./gradlew jacocoTestReport` |
| dotnet | `dotnet test --filter "FullyQualifiedName~CartServiceTests"` | `dotnet test --collect:"XPlat Code Coverage"` |

Coverage là đèn báo chỗ CHƯA test, không phải điểm chất lượng. 100% dòng mà không assertion nào vẫn là 0 test.
Ưu tiên nhánh (branch coverage) của logic quan trọng hơn là đuổi con số.
`npx playwright show-report` mở một server không tự tắt — đừng chạy; đọc đầu ra `--reporter=line` hoặc thư mục `test-results/`.

## 3. Mẫu test chạy được

**Jest/Vitest — unit, dạng bảng:**
```ts
import { describe, it, expect } from 'vitest';   // Jest: bỏ dòng này (globals)
import { tinhPhiShip } from './phiShip';

describe('tinhPhiShip', () => {
  it.each([
    [0, 30000], [499999, 30000],     // dưới ngưỡng
    [500000, 0], [2000000, 0],       // biên và trên ngưỡng
  ])('đơn %i đ ⇒ phí %i đ', (tong, phi) => {
    expect(tinhPhiShip(tong)).toBe(phi);
  });
  it('ném lỗi khi tổng âm', () => {
    expect(() => tinhPhiShip(-1)).toThrow(/không hợp lệ/);
  });
});
```
**React Testing Library** — tìm theo vai trò/nhãn như người dùng thấy, không theo class:
```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
it('báo lỗi khi email sai định dạng', async () => {
  const user = userEvent.setup();
  render(<FormDangKy onSubmit={vi.fn()} />);
  await user.type(screen.getByLabelText(/email/i), 'abc');
  await user.click(screen.getByRole('button', { name: /đăng ký/i }));
  expect(await screen.findByText(/email không hợp lệ/i)).toBeInTheDocument();
});
```
Cần `jsdom` (`environment: 'jsdom'` trong cấu hình Vitest, `testEnvironment: 'jsdom'` với Jest) và `@testing-library/jest-dom`.
**API Express + supertest (integration):**
```ts
import request from 'supertest';
import { app } from '../src/app';          // app tách khỏi app.listen() để test không mở cổng
it('GET /api/orders/:id của người khác ⇒ 404', async () => {
  const res = await request(app).get('/api/orders/999').set('Authorization', `Bearer ${tokenUserA}`);
  expect(res.status).toBe(404);
});
```
**JUnit 5 + Mockito:**
```java
@ExtendWith(MockitoExtension.class)
class OrderServiceTest {
  @Mock OrderRepository repo;
  @InjectMocks OrderService service;
  @Test void huyDonDaGiao_nemLoi() {
    when(repo.findById(1L)).thenReturn(Optional.of(new Order(1L, Status.DELIVERED)));
    assertThrows(IllegalStateException.class, () -> service.cancel(1L));
    verify(repo, never()).save(any());
  }
  @ParameterizedTest @CsvSource({"17,false", "18,true", "60,true", "61,false"})
  void kiemTuoi(int tuoi, boolean hopLe) { assertEquals(hopLe, Validator.tuoiHopLe(tuoi)); }
}
```
Spring integration: `@SpringBootTest` + `@AutoConfigureMockMvc`, hoặc lát cắt `@WebMvcTest` / `@DataJpaTest` cho nhanh.
**pytest:**
```python
import pytest
from app.cart import tinh_phi_ship

@pytest.mark.parametrize("tong,phi", [(0, 30000), (499999, 30000), (500000, 0)])
def test_phi_ship(tong, phi):
    assert tinh_phi_ship(tong) == phi

def test_tong_am():
    with pytest.raises(ValueError, match="không hợp lệ"):
        tinh_phi_ship(-1)
```
FastAPI: `from fastapi.testclient import TestClient`; Django: `python manage.py test` hoặc `pytest-django` với `@pytest.mark.django_db`.
**xUnit (.NET):**
```csharp
public class PhiShipTests {
  [Theory]
  [InlineData(0, 30000)] [InlineData(499999, 30000)] [InlineData(500000, 0)]
  public void TinhPhi(decimal tong, decimal phi) => Assert.Equal(phi, PhiShip.Tinh(tong));
}
```
API ASP.NET Core: `WebApplicationFactory<Program>` (cần `public partial class Program {}`). NUnit: `[TestCase(...)]`.
**Playwright e2e:**
```ts
import { test, expect } from '@playwright/test';
test('đăng nhập rồi thấy trang tổng quan', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Mật khẩu').fill(process.env.E2E_PASSWORD!);
  await page.getByRole('button', { name: 'Đăng nhập' }).click();
  await expect(page.getByRole('heading', { name: 'Tổng quan' })).toBeVisible();   // tự chờ, không sleep
});
```
Lần đầu: `npx playwright install chromium` (Linux CI thêm `--with-deps`). Khai `webServer` trong `playwright.config.ts`
để Playwright tự bật/tắt dev server, và `use: { baseURL }`. Dùng tài khoản test riêng, không tài khoản thật của người dùng.

## 4. Mock, stub, fake — đặt đúng chỗ

- Mock ở **biên hệ thống**: HTTP ra ngoài, email, thanh toán, đồng hồ, số ngẫu nhiên, file hệ thống. Đừng mock chính thứ đang test.
- Mock quá nhiều ⇒ test chỉ kiểm rằng mock trả về cái bạn bảo nó trả. Logic nghiệp vụ nên là hàm thuần, test không cần mock.
- HTTP: `msw` (JS), `nock`, `responses`/`respx` (Python), WireMock (Java). Ưu tiên fake có hành vi thật (repo in-memory) hơn chuỗi `when(...)`.
- Thời gian: `vi.useFakeTimers(); vi.setSystemTime(new Date('2026-01-01T00:00:00Z'))` / `jest.useFakeTimers()` ·
  Java tiêm `Clock` · Python `freezegun` · .NET `TimeProvider`. Nhớ trả lại đồng hồ thật sau test (`vi.useRealTimers()`).
- Reset mock giữa các test (`vi.restoreAllMocks()` / `jest.restoreAllMocks()` trong `afterEach`, `restoreMocks: true` trong cấu hình).

## 5. Dữ liệu test và DB test

- Mỗi test tự tạo dữ liệu nó cần (factory/builder), không dựa vào dữ liệu test khác để lại. Dọn bằng transaction rollback
  hoặc truncate giữa các test.
- DB test là DB RIÊNG. Kiểm biến môi trường trước khi chạy integration test — test có bước `deleteMany()` chạy nhầm vào DB
  dev/prod là mất dữ liệu thật. Thêm chốt: `if (!process.env.DATABASE_URL?.includes('test')) throw new Error('không phải DB test')`.
- Tốt nhất: cùng loại DB với prod — Testcontainers (Java `org.testcontainers:postgresql`, .NET `Testcontainers.PostgreSql`,
  Node `@testcontainers/postgresql`, Python `testcontainers`) — cần Docker đang chạy. Hoặc `docker compose` một service DB test.
- SQLite in-memory / EF `UseInMemoryDatabase` / H2: nhanh nhưng KHÁC PG/SQL Server — không kiểm ràng buộc khoá ngoại như nhau,
  khác phân biệt hoa thường, khác kiểu ngày, EF InMemory không có transaction và không phải DB quan hệ. Test pass ở đó chưa
  chứng minh gì về truy vấn thật; nói rõ điều này khi dùng.

## 6. TDD khi hợp

Đỏ → Xanh → Tái cấu trúc: viết một test nhỏ cho hành vi kế tiếp, chạy thấy đỏ, viết mã ít nhất để xanh, dọn mã khi vẫn xanh.
Hợp nhất cho logic có quy tắc rõ (tính tiền, validator, máy trạng thái) và khi sửa lỗi (test hồi quy trước). Giao diện
thăm dò thì viết test sau khi hình dạng đã ổn.

## 7. Thiết kế ca kiểm thử (hộp đen) — dùng cho cả code lẫn bài SWT301

Ví dụ yêu cầu: "Tuổi đăng ký hợp lệ từ 18 đến 60 (số nguyên)."
- **Phân vùng tương đương (EP):** chia đầu vào thành lớp xử lý giống nhau, mỗi lớp một đại diện.
  Hợp lệ: [18..60] → 30. Không hợp lệ: < 18 → 10; > 60 → 70; không phải số → "abc"; rỗng → "".
- **Phân tích giá trị biên (BVA):** lỗi hay nằm ở biên. Biên 2 giá trị: 17, 18, 60, 61. Biên 3 giá trị: 17, 18, 19, 59, 60, 61.
- **Bảng quyết định:** khi kết quả phụ thuộc tổ hợp điều kiện. Ví dụ đăng nhập:

| Điều kiện / Luật | R1 | R2 | R3 | R4 |
|---|---|---|---|---|
| Email tồn tại | Đ | Đ | S | Đ |
| Mật khẩu đúng | Đ | S | – | Đ |
| Tài khoản bị khoá | S | S | – | Đ |
| **Kết quả** | Vào trang chủ | Báo sai mật khẩu | Báo sai thông tin | Báo tài khoản bị khoá |

  Mỗi cột = ít nhất một test case. `–` = không quan tâm.
- **Chuyển trạng thái:** vẽ trạng thái + sự kiện, test mọi chuyển hợp lệ VÀ vài chuyển cấm.
  Đơn hàng: `Mới →(xác nhận) Đã xác nhận →(giao) Đang giao →(nhận) Hoàn tất`; `Mới/Đã xác nhận →(huỷ) Đã huỷ`.
  Ca cấm: huỷ khi `Đang giao`, xác nhận khi `Đã huỷ` ⇒ phải bị từ chối.
- **Hộp trắng:** phủ lệnh (statement) và phủ nhánh (branch — mỗi `if` cả đúng lẫn sai). Độ phức tạp chu trình
  V(G) = E − N + 2 (cạnh − nút + 2) = số điều kiện quyết định + 1 = số đường độc lập tối thiểu cần test.

**Mẫu bảng test case (SWT301 / Excel):**

| TC ID | Chức năng | Mô tả | Tiền điều kiện | Các bước | Dữ liệu test | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Kỹ thuật |
|---|---|---|---|---|---|---|---|---|---|
| TC_REG_01 | Đăng ký | Tuổi ở biên dưới hợp lệ | Ở trang Đăng ký | 1. Nhập thông tin hợp lệ 2. Nhập tuổi 3. Bấm "Đăng ký" | Tuổi = 18 | Đăng ký thành công, chuyển về trang chủ | | Pass/Fail/Untested | BVA |
| TC_REG_02 | Đăng ký | Tuổi dưới biên | như trên | như trên | Tuổi = 17 | Hiện "Tuổi phải từ 18 đến 60", không tạo tài khoản | | | BVA |

Quy tắc viết: mỗi TC kiểm MỘT điều; bước đủ rõ để người khác làm lại; "kết quả mong đợi" đo được (thông báo cụ thể, trạng thái
DB), không viết "hệ thống chạy đúng". Báo lỗi (bug report): ID, tiêu đề, bước tái hiện, dữ liệu, mong đợi vs thực tế, mức độ
(Severity) và độ ưu tiên (Priority), môi trường, ảnh chụp. Khi sinh viên nhờ làm bài, giải thích VÌ SAO chọn từng giá trị.

## 8. Bẫy đã gặp thật

- **Watch mode** (`vitest`, `jest --watch`, `ng test` mặc định, `npm test` của CRA không có `CI`) ⇒ treo tới hết giờ.
- **Test phụ thuộc thứ tự**: xanh khi chạy cả bộ, đỏ khi chạy riêng (hoặc ngược lại) ⇒ chia sẻ trạng thái (biến module, DB,
  mock chưa reset). Kiểm bằng chạy riêng file đó.
- **Test phụ thuộc thời gian/ngẫu nhiên**: đỏ lúc 0h, cuối tháng, năm nhuận, khi máy CI ở UTC. Cố định đồng hồ, seed ngẫu nhiên.
- **Flaky vì `sleep`**: chờ bằng điều kiện (`findBy*`, `expect(...).toBeVisible()`, `await waitFor`), không `setTimeout` cố định.
- **Quên `await`**: `expect(promise).rejects...` không có `await` ⇒ test luôn xanh. Async assertion luôn `await`.
- **Snapshot cập nhật bừa** (`-u`, `--update-snapshots`) ⇒ chụp luôn cả lỗi làm chuẩn. Chỉ cập nhật sau khi đọc diff và chắc
  thay đổi là cố ý; nói với người dùng.
- **Tiến trình không thoát** sau khi test xong (Jest "did not exit") ⇒ kết nối DB/server/timer còn mở. Đóng trong `afterAll`
  (`await prisma.$disconnect()`, `server.close()`); tìm bằng `npx jest --detectOpenHandles`. `--forceExit` chỉ che lỗi.
- **Test xanh vì lý do sai**: kiểm `status === 200` trong khi thân response là trang lỗi; kiểm `toBeTruthy()` trên mảng rỗng.
  Assert nội dung cụ thể.
- **Integration test chạy vào DB thật** và dọn dẹp bằng `deleteMany()` ⇒ xem mục 5.

## 9. Việc KHÔNG tự làm khi chưa được đồng ý

Xoá/skip test đang có, sửa kỳ vọng của test hiện có (nghĩa là đổi đặc tả), cập nhật snapshot hàng loạt, hạ ngưỡng coverage
trong cấu hình CI, thêm framework/thư viện test mới, chạy test có ghi/xoá dữ liệu vào DB không phải DB test.

## 10. Báo cáo cuối

Đã viết test gì (đường dẫn, bao nhiêu ca, kỹ thuật nào), lệnh đã chạy và KẾT QUẢ THẬT (số pass/fail, trích đầu ra khi đỏ),
test hồi quy có từng đỏ trước khi sửa không, coverage nếu đo, những gì chưa test được và vì sao, lệnh để người dùng chạy lại.
