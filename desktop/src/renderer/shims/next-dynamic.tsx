/**
 * Thay thế `next/dynamic` cho app desktop.
 *
 * Cây component Notes của web dùng `next/dynamic` đúng MỘT lần — để nạp chậm
 * trình soạn thảo. Chỉ vì một import đó mà kéo cả Next.js vào bản dựng desktop
 * là không đáng, nên đây là bản dựng lại trên `React.lazy`.
 *
 * Bao phủ đúng phần API mà cây Notes dùng: `loader` và `options.loading`. Các
 * tuỳ chọn riêng của Next (`ssr`, `suspense`) được NHẬN nhưng bỏ qua — app
 * desktop không có server-side rendering nên `ssr: false` vốn đã là mặc định.
 *
 * KHÔNG cố mô phỏng đầy đủ `next/dynamic`. Một shim giả vờ làm được nhiều hơn
 * thực tế sẽ hỏng ở chỗ khác, xa chỗ gây ra.
 */
import { lazy, Suspense, type ComponentType, type ReactNode } from 'react';

interface DynamicOptions {
  loading?: (props: { error?: Error | null; isLoading?: boolean }) => ReactNode;
  /** Có trong API của Next; ở đây không dùng vì desktop không có SSR. */
  ssr?: boolean;
}

type Loader<P> = () => Promise<{ default: ComponentType<P> } | ComponentType<P>>;

export default function dynamic<P extends object>(
  loader: Loader<P>,
  options: DynamicOptions = {},
): ComponentType<P> {
  const Lazy = lazy(async () => {
    const loaded = await loader();
    // `next/dynamic` chấp nhận cả module có `default` lẫn component trần;
    // `React.lazy` thì bắt buộc phải có `default`.
    return 'default' in loaded ? loaded : { default: loaded };
  }) as unknown as ComponentType<P>;

  return function DynamicComponent(props: P) {
    return (
      <Suspense fallback={options.loading?.({ isLoading: true }) ?? null}>
        {/*
          Ép kiểu đặt ở chỗ TẠO `Lazy` (bên trên), không đặt ở đây. `React.lazy`
          gói props vào `PropsWithRef`, mà với `P` chung chung thì TypeScript
          không chứng minh được tương thích — ép một lần ở nguồn thì chỗ dùng
          giữ nguyên kiểu thật và vẫn được kiểm ở NƠI GỌI.
        */}
        <Lazy {...props} />
      </Suspense>
    );
  };
}
