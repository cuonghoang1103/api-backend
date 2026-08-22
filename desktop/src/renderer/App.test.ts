/**
 * Canh ĐÚNG cách `App.tsx` giải một đường dẫn thành màn hình.
 *
 * ─── Vì sao tệp này tồn tại ───
 * `Content()` giải hai bước: `findRoute(route)` rồi `nativePageFor(...)`. Bản
 * trước bỏ cuộc ngay khi bước một trả `undefined`, mà `ROUTES` chỉ liệt kê GỐC
 * của mỗi cây — nên mọi đường con của cây web rơi vào "Không tìm thấy" dù sổ
 * đăng ký dựng được chúng. `/language/ja` và `/roadmap/frontend` hỏng như thế
 * từ 20/08/2026; bốn đường con của Phỏng vấn hỏng trong v0.5.63.
 *
 * Không phép kiểm nào bắt được, vì mọi thứ đang có đều hỏi SỔ ĐĂNG KÝ:
 *   • `dinhTuyenWeb.test.ts` hỏi `khopTuyenWeb` — bảng tra, đúng.
 *   • `routes.test.ts` hỏi `ROUTES` — bảng route, đúng.
 *   • `do:bo-cuc` gọi thẳng `nativePageFor(duong)` trong `trang-thu.tsx` —
 *     nên nó đo sổ đăng ký, KHÔNG đo đường app thật đi qua.
 * Cả ba đều xanh trong khi trang thật hiện "Không tìm thấy".
 *
 * ⚠️ Nên đừng thay `giaiNhuApp()` dưới đây bằng một lời gọi `nativePageFor`
 * trần: giá trị của nó nằm ở chỗ nó lặp lại ĐÚNG hai bước của `Content()`.
 *
 * ⚠️⚠️ GIỚI HẠN, phải biết để khỏi tin quá: `giaiNhuApp()` là BẢN SAO logic của
 * `Content()`, không phải chính nó (dựng `Content` thật cần React + jsdom +
 * đủ bộ provider). Đo thật: phá `App.tsx` thì chỉ phép kiểm ĐỌC NGUỒN ở cuối
 * tệp đỏ, ba phép kiểm hành vi vẫn xanh vì chúng chạy bản sao. Nên phép kiểm
 * cuối mới là thứ gác thật; ba cái đầu gác cho SỔ ĐĂNG KÝ khỏi thủng.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ROUTES, findRoute } from './routes';
import { nativePageFor } from './page-registry';
import { TUYEN_WEB } from './features/web/dinhTuyenWeb';

/** Lặp lại đúng hai bước của `Content()` trong `App.tsx`. */
const giaiNhuApp = (route: string) => nativePageFor(findRoute(route)?.path ?? route);

/** `/language/:code` → `/language/x`, để có một đường dẫn thật mà thử. */
const lamThat = (mau: string) => mau.replace(/:[a-z]+/gi, 'x');

describe('App.tsx giải đường dẫn', () => {
  it('MỌI đường trong bảng cây web đều dựng được — kể cả đường con', () => {
    for (const t of TUYEN_WEB) {
      const duong = lamThat(t.mau);
      expect(giaiNhuApp(duong), `"${duong}" rơi vào màn "Không tìm thấy"`).toBeDefined();
    }
  });

  it('mọi route trong thanh bên đều dựng được, hoặc là trang chưa port', () => {
    for (const r of ROUTES) {
      // Chưa port thì `nativePageFor` trả undefined NHƯNG `findRoute` phải thấy
      // — đó là điều kiện để hiện màn "mở trên web" thay vì "Không tìm thấy".
      expect(findRoute(r.path), `route ${r.path} không tự tìm lại được`).toBeDefined();
    }
  });

  it('đường NGOÀI mọi cây rơi vào "Không tìm thấy" của App, không nuốt bừa', () => {
    for (const d of ['/khong-co-that', '/languages', '/interviews', '/cvs']) {
      expect(giaiNhuApp(d), `"${d}" bị nhận nhầm thành một trang`).toBeUndefined();
    }
  });

  /*
   * Đường nằm TRONG một cây web nhưng không có màn nào thì KHÔNG trả undefined
   * — chủ cây được dựng, rồi `TrangWebTheoTuyen` tự hiện "Không tìm thấy" KÈM
   * NÚT QUAY VỀ gốc cây. Đó là màn tốt hơn màn trống của `App.tsx`, nên đây là
   * hành vi ĐÚNG chứ không phải chỗ nuốt bừa.
   *
   * Viết ra thành phép kiểm vì nó trông y hệt một lỗi khi đọc lướt — chính bộ
   * kiểm này đã bắt tôi phải nói rõ ra (22/08/2026).
   */
  it('đường TRONG cây nhưng không có màn: chủ cây dựng, tự hiện lối quay về', () => {
    for (const d of ['/cv/khong-co', '/language/ja/khong-co', '/interview/khong-co']) {
      expect(giaiNhuApp(d), `"${d}" phải do chủ cây dựng`).toBeDefined();
    }
  });

  /*
   * Chốt nguồn: bản vá nằm ở chỗ hỏi `nativePageFor` bằng CHÍNH `route` khi
   * `findRoute` không thấy. Ai đó "gọn hoá" lại thành `definition.path` là
   * đưa nguyên lỗi cũ trở lại, và ba bộ kiểm kia vẫn xanh.
   */
  it('App.tsx phải lùi về `route` khi findRoute không thấy', () => {
    const nguon = readFileSync(join(__dirname, 'App.tsx'), 'utf8');
    expect(nguon, 'mất đường lùi — đường con của cây web sẽ hỏng lại')
      .toContain('nativePageFor(definition?.path ?? route)');
  });
});
