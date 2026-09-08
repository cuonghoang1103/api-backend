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

const container = document.getElementById('root');
if (!container) throw new Error('Không tìm thấy #root');

createRoot(container).render(
  <React.StrictMode>
    <TanStackQueryProvider>
      <App />
    </TanStackQueryProvider>
  </React.StrictMode>,
);
