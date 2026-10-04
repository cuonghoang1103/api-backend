/* Khung dùng chung của cây Content Creator (`components/studio/CreatorFrame.tsx`)
   — `XuongNoiDungPage` dựng nó quanh mọi trang `/creator/**` vì router của app
   không chạy `app/creator/layout.tsx` của Next. Khai riêng ở đây (không sửa tệp
   shim chung) — wildcard `@/app/*\/page` chỉ phủ module TRANG. */
declare module '@/components/studio/CreatorFrame' {
  import type { ComponentType, ReactNode } from 'react';
  const KhungCreatorApp: ComponentType<{ children: ReactNode }>;
  export default KhungCreatorApp;
}
