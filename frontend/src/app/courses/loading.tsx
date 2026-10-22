import s from '@/components/courses/chuong-trinh/chuongTrinh.module.css';

// Khung chờ của /courses — cùng nhịp với trang Chương trình đào tạo (tiêu đề lớn, dải số, các học kỳ dạng hàng),
// để lúc dữ liệu về không bị nhảy bố cục.
export default function Loading() {
  return (
    <div className={`${s.goc} min-h-screen`} aria-busy="true">
      <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 sm:pt-16 lg:px-8">
        <div className="shimmer-track h-3 w-28" />
        <div className="mt-6 border-b border-[var(--p-rule-strong)] pb-10">
          <div className="shimmer-track h-12 w-80 max-w-full sm:h-16" />
          <div className="shimmer-track mt-5 h-4 w-[32rem] max-w-full" />
          <div className="shimmer-track mt-2 h-4 w-[24rem] max-w-full" />
        </div>
        <div className="shimmer-track my-6 h-11 w-full md:w-[30rem]" />
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="mt-10 border-t border-[var(--p-rule)] pt-6">
            <div className="shimmer-track h-7 w-64 max-w-full" />
            {Array.from({ length: 4 }).map((__, j) => (
              <div key={j} className="mt-5 flex gap-4">
                <div className="shimmer-track aspect-video w-24 shrink-0 sm:w-32" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="shimmer-track h-4 w-2/3" />
                  <div className="shimmer-track h-3 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
