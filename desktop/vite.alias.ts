/**
 * MỘT bảng alias cho MỌI bản dựng của app desktop.
 *
 * ⚠️ Trước 20/08/2026 bảng này bị chép thành hai bản: một trong `vite.config.ts`
 * (bản dựng thật) và một trong `vite.bo-cuc.config.ts` (bản dựng thử bố cục).
 * Chúng lệch nhau ngay lần đầu có cơ hội: ba shim Next mới chỉ được thêm vào
 * bản thứ nhất, nên bản dựng thử vẫn nối vào Next.js THẬT — `useParams()` trả
 * `null` ngoài router của Next, và cây Ngoại ngữ nổ ở `String(params.code)`.
 *
 * Bộ đo báo ĐỎ cho một trang không có lỗi nào. Đây là lần thứ ba trong ngày một
 * "lỗi" hoá ra nằm ở bộ đo — xem `feedback_verify_the_checker_before_the_content`.
 *
 * Giữ hai danh sách song song là mời gọi chúng lệch nhau. Một danh sách thì
 * không lệch được.
 */
import path from 'node:path';

export function aliasDesktop(goc: string): Record<string, string> {
  const o = (p: string): string => path.resolve(goc, p);
  return {
    '@renderer': o('src/renderer'),
    '@shared': o('src/shared'),

    /**
     * `@` trỏ vào cây nguồn của WEB.
     *
     * App desktop dùng lại nguyên nhiều trang của web — Notes (22 tệp, hơn
     * 6.000 dòng), rồi Thuật toán · Mô phỏng · Lộ trình · Ngoại ngữ (hơn
     * 51.000 dòng nữa). Viết lại chúng nghĩa là nuôi hai bản song song mãi
     * mãi: mỗi tính năng mới làm hai lần, mỗi lỗi sửa hai chỗ.
     *
     * Chúng import theo `@/...`, nên alias này là thứ duy nhất cần để chúng
     * biên dịch được ở đây.
     */
    '@': path.resolve(goc, '../frontend/src'),

    /**
     * BỐN shim thay cho Next.js. Đo thật mức dính của từng cây trước khi làm:
     *
     *   Notes       22 tệp ·  6.332 dòng · đúng 1 `next/dynamic`
     *   Thuật toán  12 tệp ·  3.239 dòng · KHÔNG dính gì
     *   Mô phỏng    84 tệp · 34.940 dòng · đúng 1 `next/dynamic`
     *   Lộ trình     5 tệp ·    632 dòng · 2 `next/link`
     *   Ngoại ngữ   45 tệp · 12.616 dòng · 10 link · 2 image · 19 navigation
     *
     * Hơn 57.000 dòng tính năng, đổi lấy bốn tệp shim.
     *
     * ⚠️ Thêm shim mới thì thêm Ở ĐÂY, không thêm vào từng file cấu hình.
     */
    /**
     * ⚠️⚠️ MỘT BẢN REACT DUY NHẤT — ghim bằng alias, không trông vào `dedupe`.
     *
     * `../frontend` là một gói RIÊNG và có `node_modules/react` của nó. Khi
     * một component web được nạp từ đó, bộ giải mặc định tìm `react` ở
     * `node_modules` GẦN NHẤT — tức bản của frontend — trong khi app chạy bản
     * của desktop. Hai bản không chia sẻ dispatcher, và mọi hook ném
     * `Cannot read properties of null (reading 'useContext')` ngay lượt render
     * đầu: màn hình trắng, không có gì trong log nói lý do.
     *
     * `resolve.dedupe` KHÔNG đủ — đã thử 16/09/2026, nó không với tới cây
     * `node_modules` của một gói nằm ngoài root. Alias thì tuyệt đối.
     *
     * Thêm `zustand` vì cùng lý do: cửa hàng tin nhắn là một singleton, hai
     * bản zustand nghĩa là hai cửa hàng — trang ghi vào cái này, component
     * đọc cái kia, và giao diện đứng im không lỗi.
     */
    react: o('node_modules/react'),
    'react-dom': o('node_modules/react-dom'),
    'react/jsx-runtime': o('node_modules/react/jsx-runtime.js'),
    'react/jsx-dev-runtime': o('node_modules/react/jsx-dev-runtime.js'),
    zustand: o('node_modules/zustand'),
    /**
     * `sonner` cũng là một SINGLETON (kho toast cấp mô-đun), cùng lý do như
     * `zustand`. Đo 23/09/2026 trên `dist/renderer`: bản dựng mang HAI lớp kho
     * toast (`this.subscribers=[]` hai lần) — `<Toaster>` trong `App.tsx` nghe
     * kho của desktop, còn mọi `toast.*` trong cây web ghi vào kho của
     * `frontend/node_modules/sonner`. Không ai vẽ kho thứ hai ⇒ mọi toast của
     * cây web im lặng, đúng điều `toastCayWeb.test.ts` định chặn. Hai bên cùng
     * bản 1.7.4 nên ghim về một bản là an toàn.
     */
    sonner: o('node_modules/sonner'),

    'next/dynamic': o('src/renderer/shims/next-dynamic.tsx'),
    'next/link': o('src/renderer/shims/next-link.tsx'),
    'next/image': o('src/renderer/shims/next-image.tsx'),
    'next/navigation': o('src/renderer/shims/next-navigation.tsx'),
  };
}
