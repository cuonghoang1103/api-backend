import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
/* Bọc CẢ cây bằng provider của react-query.
 *
 * ⛔ Không có nó thì mọi mã web dùng `useQuery` ném ngay lúc vẽ:
 *    "No QueryClient set, use QueryClientProvider to set one"
 * và ranh giới lỗi nuốt trọn màn hình. 09/09/2026 người dùng gặp đúng vậy ở
 * Học viện: `monHoc.tsx` dùng lại `CourseTutor` của web → `usePro()` →
 * `useQuery`. Gia sư AI vẫn nằm nguyên trong mã, chỉ là chưa bao giờ chạy
 * được — trang chết trước khi kịp vẽ nó.
 *
 * Dùng LẠI component của web chứ không tự tạo `QueryClient` mới: cùng một
 * singleton (`getQueryClient`) nghĩa là cùng cấu hình staleTime/retry, và mã
 * ngoài React (store Zustand của nhạc) vẫn vô hiệu hoá đúng cache đó. Tự tạo
 * bản thứ hai là hai cache song song, cập nhật một bên không thấy ở bên kia.
 */
import TanStackQueryProvider from '@/components/providers/TanStackQueryProvider';
import './styles.css';
import { BIEN_THE, THONG_TIN_BIEN_THE } from '../shared/bienThe';

/* Biến thể app (13/10/2026) — cho mã DÙNG CHUNG với web biết mình đang chạy trong
   app CT Work riêng (vd. thanh bên CT Work giấu "Về trang chính", vì app này không
   có trang chính). Đặt TRƯỚC khi dựng cây React: không có nhịp nào đọc thấy rỗng. */
(globalThis as { __ctBienThe?: string }).__ctBienThe = BIEN_THE;
document.title = THONG_TIN_BIEN_THE.tenSanPham;

const container = document.getElementById('root');
if (!container) throw new Error('Không tìm thấy #root');

createRoot(container).render(
  <React.StrictMode>
    <TanStackQueryProvider>
      <App />
    </TanStackQueryProvider>
  </React.StrictMode>,
);
