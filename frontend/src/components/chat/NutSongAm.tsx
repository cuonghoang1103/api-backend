'use client';

/**
 * Nút mở màn nói chuyện.
 *
 * ⚠️ CỐ Ý KHÔNG DÙNG BIỂU TƯỢNG ĐIỆN THOẠI. Cái ống nghe nói "gọi cho một
 * người" — người dùng chờ chuông, chờ bắt máy, chờ ai đó "alô". Đây không
 * phải cuộc gọi: chạm là nói được ngay, và im là nó tự hiểu hết câu.
 *
 * Ba vạch sóng nói đúng việc đang xảy ra — có tiếng, và tiếng là thứ chính.
 */
export function NutSongAm({
  onClick,
  tone = 'studio',
}: {
  onClick: () => void;
  tone?: 'studio' | 'terminal';
}) {
  const mau = tone === 'terminal' ? '#22d3ee' : 'var(--studio-accent)';
  return (
    <button
      type="button"
      onClick={onClick}
      title="Nói chuyện với CuongMini — rảnh tay, tự nghe tiếp sau mỗi câu"
      aria-label="Mở màn nói chuyện"
      className="flex h-9 w-9 items-center justify-center rounded-full transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2"
      style={{ background: mau }}
    >
      <span className="flex h-[14px] items-center gap-[2.5px]">
        {[0, 1, 2].map((i) => (
          <i
            key={i}
            className="block w-[2.5px] rounded-full bg-white"
            style={{ height: 5, animation: `nut-song 1s ${i * 130}ms ease-in-out infinite` }}
          />
        ))}
      </span>
      <style jsx>{`
        @keyframes nut-song {
          0%, 100% { height: 5px; }
          50% { height: 13px; }
        }
        /* Người xin giảm chuyển động thì vạch đứng yên — nút vẫn nhận ra được
           bằng hình dạng, không cần nhấp nháy. */
        @media (prefers-reduced-motion: reduce) {
          i { animation: none !important; height: 9px !important; }
        }
      `}</style>
    </button>
  );
}
