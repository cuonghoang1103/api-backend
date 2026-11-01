import s from '@/components/courses/chuong-trinh/chuongTrinh.module.css';

// Khung chờ của /courses — cùng bố cục với trang thật (hero + thẻ số liệu, thanh công cụ, thanh học kỳ + lưới thẻ)
// để lúc dữ liệu về không bị nhảy bố cục.
export default function Loading() {
  return (
    <div className={`${s.goc} min-h-screen pb-20 pt-20 sm:pt-24`} aria-busy="true">
      <div className="relative z-10 mx-auto max-w-7xl space-y-6 px-4 sm:space-y-8 sm:px-6 lg:px-8">
        <div className={`${s.the} grid gap-6 rounded-3xl p-5 sm:p-8 lg:grid-cols-[1.35fr_0.85fr]`}>
          <div>
            <div className="shimmer-track h-8 w-44 rounded-full" />
            <div className="shimmer-track mt-5 h-11 w-[28rem] max-w-full" />
            <div className="shimmer-track mt-4 h-4 w-[34rem] max-w-full" />
            <div className="shimmer-track mt-2 h-4 w-[26rem] max-w-full" />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className={`${s.theTrong} h-[92px] rounded-2xl`} />)}
          </div>
        </div>
        <div className="shimmer-track h-12 w-full rounded-2xl lg:w-[30rem]" />
        <div className="grid gap-6 lg:grid-cols-[288px_minmax(0,1fr)] lg:gap-8">
          <div className={`${s.the} hidden h-[480px] rounded-2xl lg:block`} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={`${s.the} overflow-hidden rounded-2xl`}>
                <div className="shimmer-track aspect-video w-full" />
                <div className="space-y-2 p-4">
                  <div className="shimmer-track h-5 w-24 rounded-full" />
                  <div className="shimmer-track h-5 w-3/4" />
                  <div className="shimmer-track h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
